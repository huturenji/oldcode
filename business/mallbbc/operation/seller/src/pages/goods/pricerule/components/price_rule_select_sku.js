/*
* 定价管理-选择SKU组件
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Input, Table, Button,Upload,message,Spin,InputNumber,Modal,Tooltip } from 'antd';
import XLSX from 'xlsx';
import {
    failTip,
    sldComLanguage,
    getSldListGoodsImg80,
    sldtbaleOpeBtnText,
    sldSvgIcon,
    downLoad_front,
    getStorage,
    isEmpty,
    isRepeat,
    withIndex
} from '@/utils/utils';
import ALibbSvg from '@/components/ALibbSvg';
import global from '@/global.less';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from '../../product.less';
import _chunk from 'lodash/chunk';

const step = 100;
const storeId = getStorage('storeId');
const sourceType = {
    'JDW':'京东官网到手价',
    'JDU':'京东联盟价',
    'JD':'京东建议销售价'
}
const { Search } = Input;
const { confirm } = Modal;
@connect(({ pricerule,project }) => ({
    pricerule,project
}))
export default class SelectSKU extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectData: [],//已选择的商品列表
            searchResult: [],//搜索SKU商品结果集

            columns: [
                {
                    title: `序号`,
                    dataIndex: 'index',
                    key: "index",
                    align: 'center',
                    width: 60
                },
                {
                    title: `SKU`,
                    dataIndex: 'sku',
                    key: "sku",
                    align: 'center',
                    width: 100,
                    render:(text)=><span style={{wordBreak:'break-all'}}>{text}</span>
                },
                {
                    title: `${sldComLanguage('商品信息')}`,
                    dataIndex: 'skuName',
                    key: "skuName",
                    align: 'center',
                    width: 200,
                    render: (text, record) => (
                        <div className={`${styles.goods_info} ${global.com_flex_row_flex_start}`}>
                            <div className={styles.goods_img}>{getSldListGoodsImg80(record.mainImage)}</div>
                            <div className={`${global.com_flex_column_space_between} ${styles.goods_detail}`}>
                                <span className={styles.goods_name}>
                                    {text}
                                </span>
                            </div>
                        </div>
                    )
                },
                {
                    title: `${sldComLanguage('供应商销售价')}`,
                    dataIndex: 'supplierSalePrice',
                    key: "supplierSalePrice",
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('结算价')}`,
                    dataIndex: 'supplierSettlePrice',
                    key: "supplierSettlePrice",
                    align: 'center',
                    width: 100
                },
                {
                    title: (
                        <div>
                             参考价
                            <Tooltip title="按以下优先级获取：京东官网到手价、京东联盟销售价、京东建议销售价">
                                <span style={{marginLeft:'2px',position:'relative',top:'3px'}}><ALibbSvg fill="#FF711E" width={18} height={18} type="wenti" /></span>
                            </Tooltip>
                        </div>
                    ),
                    dataIndex: 'supplierReferencePrice',
                    key: "supplierReferencePrice",
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('参考价来源')}`,
                    dataIndex: 'supplierReferenceSource',
                    key: "supplierReferenceSource",
                    align: 'center',
                    width: 100,
                    render:(text)=>sourceType[text]||''
                },
                {
                    title: `${sldComLanguage('销售价')}`,
                    dataIndex: 'unitPrice',
                    key: "unitPrice",
                    align: 'center',
                    width: 100,
                    render:(text, record)=>{
                        console.log(text)
                        return (
                            <InputNumber
                                min={0.01}
                                max={9999999}
                                precision={2}
                                defaultValue={text}
                                style={{ width: '100%' }}
                                disabled={this.state.isEdit}
                                onBlur={e => this.handleSalePrice(e.target.value,record)}
                            />
                        )
                    }
                },
                {
                    title: `${sldComLanguage('毛利率')}`,
                    dataIndex: 'profit',
                    key: "profit",
                    align: 'center',
                    width: 100
                }
            ],
            uploading:false,
            isEdit:false,
            searchLoading:false
        };
    }

    componentDidMount() {
        //父组件有注册函数，把自己赋值给父组件
        this.props.onRef && this.props.onRef(this)
        //传入的已勾选数据，没有商品信息，也没有价格信息，需要自己调用接口赋值
        const skuInfos = JSON.parse(JSON.stringify(this.props.selectSkus))
        const isEdit = window.location.hash.indexOf('price_rule_list_add')>-1?false:true;
        this.setState({isEdit})
        if (!isEdit) {
            this.state.columns.push(
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    key: "spLogo",
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            {sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => {
                                const { selectData } = this.state;
                                let findIndex = selectData.findIndex(selItem => selItem.sku === record.sku);
                                findIndex >= 0 && selectData.splice(findIndex, 1);
                                this.setState({ selectData: selectData })
                            })}
                        </Fragment>
                    )
                },
            )
        }
        if(skuInfos){
            let param = skuInfos.map((item)=>{
                const {sku,unitPrice} = item
                return {
                    sku,
                    unitPrice
                }
            })
            if(param.length>0){
                this.get_goods_list_all(param,true)
            }
           
        }
       
    }


    componentWillUnmount() { }

  //组件操作触发回调函数
  sendParams = (callback) => {
      //讲用户操作结果保存到组件内部并且触发外部回调函数
      const { selectData } = this.state
      if (selectData.length == 0) {
          failTip(sldComLanguage('请选择SKU'));
          return 'error';
      }
      if(selectData.length>0){
          let errorList = []
          selectData.forEach((item,i)=>{
              if(isEmpty(item.unitPrice)){
                  errorList.push(`请填写第${i+1}个商品sku${item.sku}的销售价`)
              }
          })
          if(errorList.length>0){
              const rdom = (<p style={{whiteSpace:'pre-line'}}>{`${errorList.join('\n')}`}</p>)
              message.error(rdom,6);
              errorList = [];
              return 'error';
          }
      }
      callback && callback(selectData)
  };

  //搜搜商品列表
  searchGoods = (keyword) => {
      const { dispatch } = this.props;
      if(isEmpty(keyword)){
          failTip('请输入sku')
          return
      }
      const skuarr = keyword.split(',')
      this.setState({ searchLoading: true });
      dispatch({
          type: 'project/get_list_by_skus',
          payload: { skus: skuarr,storeId,calculate:false,onlyJD:true },
          callback: async (res) => {
              
              if (res.state == 200) {
                  let priceList = await this.getProductPrices(res.data)
                  res.data.forEach((item)=>{
                      let find = priceList.find(price => price.sku == item.sku)
                      if (find) {
                          //供应商销售价
                          item['supplierSalePrice'] = find.supplierSalePrice 
                          // 供应商结算价
                          item['supplierSettlePrice'] = find.supplierSettlePrice
                          // 供应商参考价
                          item['supplierReferencePrice'] = find.supplierReferencePrice
                           // 供应商参考价来源
                           item['supplierReferenceSource'] = find.supplierReferenceSource
                          // 取计算规则后的价格 和 结算价 二者中的较大值
                          item['unitPrice'] = Math.max(find.salePrice,find.supplierSettlePrice)
                          // 计算利率
                          item['profit'] = this.calcProfit(item.unitPrice,find.supplierSettlePrice)
                          
                          
                      }
                  })
                  this.setState({ searchLoading: false });
                  this.setState({
                      searchResult: res.data
                  });
                  
              } else {
                  this.setState({ searchLoading: false });
                  failTip(res.msg)
              }
          }
      })
  }
  
  get_goods_list_all =async (exSkuList,isEdit)=>{
      // 导入直接置空
      this.setState({ uploading: true,selectData:[] });
      (!isEdit) && message.success(`导入中...`)
      
      let skuList = []
      exSkuList.forEach((item)=>{
          skuList.push(item.sku)
      })
      let resSliceTotal = []
      let skuGroup = _chunk(skuList,100)
      const promises = skuGroup.map(skus => this.get_goods_list_group(skus));
      try {
          for (const promise of promises) {
              const column = await promise;
              resSliceTotal = resSliceTotal.concat(column)
          }
      } catch (error) {
          console.log(error)
      }
      if(resSliceTotal.length==0){
          this.setState({
              uploading:false
          })
          return false
      }
      let priceList = await this.getProductPrices(resSliceTotal)
      this.setState({
          uploading:false
      })

      // 核算数据
      let errList = []
      if(resSliceTotal.length == exSkuList.length){
          // 导入核验成功
          this.setPrice(resSliceTotal,priceList,exSkuList,isEdit)
          this.setState({
              searchResult:[...resSliceTotal],
              selectData:[...resSliceTotal]
          });
      }else{
          let that = this
          let configText = {
              tips:function(index,sku){
                  return isEdit?`商品${sku},未匹配到数据`:`请检查第${index+2}行商品${sku},未匹配到数据`
              },
              title:isEdit?'以下商品未查询到，是否确定继续':'以下商品未匹配到数据，是否确定继续导入?'
          }
          // 数据有丢失 ，需要提示出sku信息
          exSkuList.forEach((item,index)=>{
              if(resSliceTotal.findIndex(e=>e.sku==item.sku)>-1){
                  // todo
              }else{
                  errList.push(configText.tips(index,item.sku))
              }
          })

          confirm({
              title: configText.title,
              content: `${errList.join('\n')}`,
              className:'comfirm_modal',
              cancelText:'取消',
              okText:'确定',
              mask:false,
              onOk(){
                  
                  that.setPrice(resSliceTotal,priceList,exSkuList,isEdit)
                  that.setState({
                      searchResult:[...resSliceTotal],
                      selectData:[...resSliceTotal]
                  });
              },
              onCancel() {

              }
          });
      }

  };

  //导入和编辑下为sku设置价格
  setPrice = (resSliceTotal,priceList,exSkuList,isEdit)=>{
      resSliceTotal.forEach((item)=>{
          let find = priceList.find(price => price.sku == item.sku)
          let ele = exSkuList.find((e)=>e.sku==item.sku)
          if (find) {
              //供应商销售价
              item['supplierSalePrice'] = find.supplierSalePrice 
              // 供应商结算价
              item['supplierSettlePrice'] = find.supplierSettlePrice
              // 供应商参考价
              item['supplierReferencePrice'] = find.supplierReferencePrice
              // 供应商参考价来源
              item['supplierReferenceSource'] = find.supplierReferenceSource
              // 编辑状态下  取计算价格和供应商结算价的较大者 (详情接口返回的unitPrice 和 listSkuPrices接口返回的 salePrice是一个意思 )
              if(isEdit){
                  item['unitPrice'] = Math.max(ele.unitPrice,find.supplierSettlePrice)
              }else{
                  // 价格设置优先级  1导入的价格  2 listSkuPrices (可能价格返回-1即被默认和分类定价规则屏蔽掉的 取计算价格和供应商结算价的较大者)
                  item['unitPrice'] = ele.unitPrice || Math.max(find.salePrice,find.supplierSettlePrice)
              }
              item['profit'] = this.calcProfit(item.unitPrice,find.supplierSettlePrice)
          }
      })
  }

  get_goods_list_group = (skus)=>new Promise((resolve) => {
      const { dispatch } = this.props;
      let new_params = { pageSize:100, pageIndex: 1,skus: skus,storeId,calculate:false,onlyJD:true };
      dispatch({
          type: 'project/get_list_by_skus',
          payload: new_params,
          callback: (res) => {
              if (res.state == 200) {
                  resolve(res.data)
              }else{
                  resolve([])
              }
          }
      });
  })

  //获取商品价格
  getProductPrices = (skus) => new Promise((resolve) =>{
      const { dispatch } = this.props;
      const arr1 = []
      skus.forEach((item1)=>{
          const {categoryId1,categoryId2,categoryId3,sku} = item1
          arr1.push({
              categoryId1,
              categoryId2,
              categoryId3,
              sku
          })
      })
      const arr = [...arr1]
      let hash = {};
      let param = [];
      param = arr.reduce((prev, item) => {
          // eslint-disable-next-line no-unused-expressions
          hash[item.sku] ? '': hash[item.sku] = true && prev.push(item);
          return prev;
      }, [])

      dispatch({
          type: 'pricerule/get_product_prices',
          payload: {
              skuInfos: param
          },
          callback: (res) => {
              if (res.state == 200) {
                  resolve(res.data.skuPrice||[])
                
              } else {
                
                  failTip(res.msg)
                  resolve([])
              }
          }
      })
  })


  //点击列表某一条
  listItemClick = (listItem) => {
      const { selectData } = this.state;
      let findIndex = selectData.findIndex(item => item.sku == listItem.sku);
      //已经选中了，就删掉；否则，添加
      if (findIndex >= 0) {
          selectData.splice(findIndex, 1)
      } else {
          selectData.push(listItem)
      }
     
      this.setState({
          selectData: selectData
      })
  }

  // 处理输入价格，并计算毛利率
  handleSalePrice = (e,record)=>{
      //   if(isEmpty(e)) {return}
      const { selectData } = this.state;
      const target = selectData.find(item=>item.sku==record.sku)
      console.log(1111,e,target)
      if(target){
          target.unitPrice = e
          if(isEmpty(e)){
              target.profit = ''
              
          }else{
              target.profit = this.calcProfit(e,record.supplierSettlePrice)
          }
         
          this.setState({
              selectData
          })
      }  
  }

  //(兆日售价-供应商结算价)/兆日售价
  calcProfit = (a,b)=>Number((a-b)*100/a).toFixed(2)

  // 直接导模板
  downFile = () =>{
      downLoad_front('rule')
  }

 
  // 上传
  beforeUploadFun = (file,fileList)=>{
      let that = this;
      //限制上传文件的数量,只显示最近上传的1个文件，旧文件将被新的文件替换。
      fileList = fileList.slice(-1);
      const isExcle = file.name.split('.')[file.name.split('.').length-1] === 'xlsx';
      if (!isExcle) {
          message.error('请按模板上传xlsx文件!');
          return false
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
          message.error('上传文件需小于10MB!');
          return false
      }
      var rABS = true;
      const f = fileList[0];
      var reader = new FileReader();
      reader.onload = function(e){
          var data = e.target.result;
          if (!rABS) {data = new Uint8Array(data);}
          var workbook = XLSX.read(data, {
              type: rABS ? 'binary' : 'array'
          });
          // 假设我们的数据在第一个标签
          var first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
          // XLSX自带了一个工具把导入的数据转成json
          var jsonArr = XLSX.utils.sheet_to_json(first_worksheet, {header:1});
          // 通过自定义的方法处理Json，比如加入state来展示
          that.handleImpotedJson(jsonArr);
      };
      if (rABS) {reader.readAsBinaryString(f);} else {reader.readAsArrayBuffer(f);}
      return false;
  }

  handleImpotedJson = (jsonData)=>{
      try {
          if(!!jsonData.length && jsonData.length > 0){
              // 整合商品详情的入参
              let _skuList = [];
              let reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,2}))$/
              for(let index = 0; index < jsonData.length; index++) {
                  const ele = jsonData[index];
                  if(Array.isArray(ele)&&ele.length>0){
                      if(index==0){
                          if(ele[0]!='sku'){
                              message.error('sku项错误,请按格式重新上传!');
                              return false
                          }
                          if(ele[1]!='商品名称'){
                              message.error('商品名称项错误,请按格式重新上传!');
                              return false
                          }
                          if(ele[2]!='销售价'){
                              message.error('销售价项错误,请按格式重新上传!');
                              return false
                          }
                      }else{
                          let _params = {}
                          // sku
                          if( ele[0] && (/^[A-Za-z0-9]+$/.test( ele[0] )) ){
                              _params.sku = ele[0]
                          }else{
                              message.error(`解析失败,请检查第${index+1}行sku数据`,5);
                              return false;
                          }
                          // sku 销售价
                          // eslint-disable-next-line no-restricted-globals
                          if( ele[2] && (reg.test(ele[2])) ){
                              _params.unitPrice = ele[2]
                          }else{
                              //   message.error(`解析失败,请检查第${index+1}行销售价数据`,5);
                              //   return false;
                              _params.unitPrice = ''
                          }

                          _skuList.push(_params)
                      }
                  }
              }

              if(_skuList.length==0){
                  message.error(`请导入数据!`);
                  return false
              }

              if(_skuList.length>1000){
                  message.error(`最多支持导入1000条数据`);
                  return false
              }
              const _skus = []
              _skuList.forEach((item)=>{
                  _skus.push(item.sku)
              })
              if(isRepeat(_skus)){
                  message.error(`sku数据项重复,请检查数据`);
                  return false
              }
              this.get_goods_list_all(_skuList)
          }else{
              message.error('解析失败,请按格式上传!');
          }
      
      } catch (error) {
          message.error('解析失败,请按格式上传!');
      }
  }

  // eslint-disable-next-line react/sort-comp
  upProps = {
      name: 'file', //发到后台的文件参数名
      // action: `${serverUrl('/api/road/upload')}`,     // 传到后端的接口名,这里不传
      headers: { Authorization: 'SID' }, // 
      showUploadList: false,
      beforeUpload: this.beforeUploadFun
  }

  //判断是否item是选中的
  isListItemChecked(listItem) {
      const { selectData } = this.state;
      return selectData.length && selectData.find(item => item && (item.sku == listItem.sku))
  }

  // 导出excel
  downExcel(data){
      var table=[];
      data.forEach((item) => {
          var row={
              "sku":String(item.sku),
              "商品名称":item.skuName,
              "供应商销售价":item.supplierSalePrice,
              "结算价":item.supplierSettlePrice,
              "参考价":item.supplierReferencePrice,
              "参考价来源":sourceType[item.supplierReferenceSource]||'',
              "销售价":item.unitPrice,
              "毛利率":item.profit
          };
          table.push(row);
      });
      //创建book
      var wb = XLSX.utils.book_new();
      //json转sheet
      var ws = XLSX.utils.json_to_sheet(table, {raw:false});
      //设置列宽
      ws['!cols']= [
          {width: 30},
          {width: 15},
          {width: 15},
          {width: 15},
          {width: 10},
          {width: 10},
          {width: 10},
          {width: 10}
      ];
      // var timestamp = (new Date()).getTime();
      //sheet写入book
      XLSX.utils.book_append_sheet(wb, ws, "file");
      //输出
      // eslint-disable-next-line no-useless-concat
      XLSX.writeFile(wb,"sku定价规则"+".xlsx");
  }


  render() {
      const { selectData, searchResult, columns,uploading,searchLoading } = this.state;
      let Tabledata = selectData
      if (Array.isArray(Tabledata)&&Tabledata.length>0) {
          Tabledata = withIndex(Tabledata,{current:1,pageSize:10000})
      } else {
          Tabledata = []
      }
      return (
          <Spin tip="加载中..." spinning={uploading}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {
                      !this.props.readOnly &&
                        <div style={{ flex: "1" }}>
                            <Search
                                placeholder={`${sldComLanguage('SKU编号')}`}
                                onSearch={(e)=>this.searchGoods(e)}
                                enterButton
                                allowClear
                            />
                            <Spin tip="加载中..." spinning={searchLoading}>
                                <Scrollbars
                                    style={{ height: '300px' }}
                                >
                                    {searchResult && searchResult.map(item => <div
                                        className={styles.sku_name_box}
                                        key={item.sku}
                                        onClick={() => this.listItemClick(item)}
                                    >
                                        <div className={`${styles.line_clamp2} ${styles.sku_name_list}`}>{item.skuName}</div>
                                        <div style={{ width: '30px', height: '32px' }}>{this.isListItemChecked(item) ? sldSvgIcon('#FF5000', 30, 30, 'xuanzhong1') : ""}</div>
                                    </div>)}
                                </Scrollbars>
                            </Spin>
                        </div>
                  }
                  <div style={{ flex: "3" }}>
                      {
                          !this.props.readOnly &&
                            <div>{`已选择${ selectData.length }项`}
                                <Button onClick={()=>{this.downFile()}} style={{marginRight:'10px',marginLeft:'20px'}}>下载模板</Button>
                                <Upload {...this.upProps} disabled={uploading} style={{marginRight:'10px'}}>
                                    <Button loading={uploading}>点击上传</Button>
                                </Upload>
                                <Button onClick={()=>{this.downExcel(Tabledata)}} disabled={Tabledata.length==0}>导出</Button>
                            </div>
                      }
                      <Table
                          columns={columns}
                          scroll={{ y: 390 }}
                          rowKey="sku"
                          dataSource={selectData || []}
                         
                          className='move-table'
                      />
                  </div>
              </div>
          </Spin>
      );
  }
}
