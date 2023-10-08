/*
* 编辑秒杀活动
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, InputNumber,Tooltip,message,Modal,Button,Spin,Table,Upload,Popconfirm } from 'antd';
import XLSX from 'xlsx';
import {
    sucTip,
    failTip,
    sldLlineRtextAddGoodsAddMargin,
    sldComLanguage,
    downLoad_front,
    isObjArrRepeat,
    getStorage,
    isEmpty,
    getTableNum,
    setSession
} from '@/utils/utils';
import _chunk from 'lodash/chunk';
import _uniq from 'lodash/uniq';

import global from '@/global.less';
import _styles from './index.less';
import SldSelMoreLeftRightSeckillGoods from '@/components/SldSelMoreLeftRightSeckillGoods';
import ReviewLog from '@/components/ReviewLog';

const { confirm } = Modal;
let sthis = '';
const storeId = getStorage('storeId');
const FormItem = Form.Item;
let stateTxtValue = { 0: "待店铺审核", 1: "待平台审核", 2: "审核通过",3:"审核拒绝" }
// eslint-disable-next-line no-shadow
@connect(({ promotion,project, global }) => ({
    promotion,project, global
}))
@Form.create()
export default class AddSecill extends Component {
      sele_more_goods = {
          info: [],//选择的商品数组
          ids: [],//选择的商品id数组
          min_num: 1//最小数量，0为不限制
      };
    
      constructor(props) {
          super(props);
          sthis = this;
          const {
              form: { getFieldDecorator }
          } = props;
          this.state = {
              query: props.location.query,
              columns: [
                  {
                      title: '序号',
                      dataIndex: 'index',
                      align: 'center',
                      width: 30,
                      render: (text, record, index) => getTableNum(this.state.page, 10, index)
                  },
                  {
                      title: '商品名称',
                      dataIndex: 'skuName',
                      align: 'center',
                      width: 100,
                      render: (text) => <Tooltip title={text}><div className={`${_styles['sku_name']}`}>{text}</div></Tooltip>
                  },
                  {
                      title: 'sku编号',
                      dataIndex: 'sku',
                      align: 'center',
                      width: 100
                  },
                  {
                      title:'销售价',
                      dataIndex: 'salePrice',
                      align: 'center',
                      width: 100
                  },
                  {
                      title: <div style={{ position: 'relative' }}>
                          <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>划线价
                      </div>,
                      dataIndex: 'markingPrice',
                      align: 'center',
                      width: 100,
                      render: (text, record) => (
                          <FormItem
                              style={{ width: '100%' }}
                          >
                              {getFieldDecorator(`markingPrice${record.withKey}`, {
                                  initialValue: text,
                                  rules:[{
                                      required: true,
                                      message: `${sldComLanguage('该项必填')}`
                                  }]
                              })(
                                  <InputNumber
                                      min={0.01}
                                      max={9999999}
                                      precision={2}
                                      style={{ width: '100%' }}
                                      onChange={e => this.handleFieldChange(e, 'markingPrice', record)}
                                  />,
                              )}
                          </FormItem>
                      )
                  },
                  {
                      title: <div style={{ position: 'relative' }}>
                          <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>秒杀价
                      </div>,
                      dataIndex: 'seckillPrice',
                      align: 'center',
                      width: 100,
                      render: (text, record) => (
                          <FormItem
                              style={{ width: '100%' }}
                          >
                              {getFieldDecorator(`seckillPrice${record.withKey}`, {
                                  initialValue: text,
                                  rules:[{
                                      required: true,
                                      message: `${sldComLanguage('该项必填')}`
                                  }]
                              })(
                                  <InputNumber
                                      min={0.01}
                                      max={9999999}
                                      precision={2}
                                      style={{ width: '100%' }}
                                      onChange={e => this.handleFieldChange(e, 'seckillPrice', record)}
                                  />,
                              )}
                          </FormItem>
                      )
                  },
                  {
                      title: <div style={{ position: 'relative' }}>
                          <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>秒杀库存
                      </div>,
                      dataIndex: 'seckillStock',
                      align: 'center',
                      width: 100,
                      render: (text, record) => (
                          <FormItem
                              style={{ width: '100%' }}
                          >
                              {getFieldDecorator(`seckillStock${record.withKey}`, {
                                  initialValue: text,
                                  rules:[{
                                      required: true,
                                      message: `${sldComLanguage('该项必填')}`
                                  }]
                              })(
                                  <InputNumber
                                      min={1}
                                      max={99999999}
                                      precision={0}
                                      style={{ width: '100%' }}
                                      onChange={e => this.handleFieldChange(e, 'seckillStock', record)}
                                  />,
                              )}
                          </FormItem>
                      )
                  },
                  {
                      title: <div style={{ position: 'relative' }}>
                          <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>限购数量
                      </div>,
                      dataIndex: 'upperLimit',
                      align: 'center',
                      width: 100,
                      render: (text, record) => (
                          <FormItem
                              style={{ width: '100%' }}
                          >
                              {getFieldDecorator(`upperLimit${record.withKey}`, {
                                  initialValue: text,
                                  rules:[{
                                      required: true,
                                      message: `${sldComLanguage('该项必填')}`
                                  }]
                              })(
                                  <InputNumber
                                      min={1}
                                      max={99999999}
                                      precision={0}
                                      style={{ width: '100%' }}
                                      onChange={e => this.handleFieldChange(e, 'upperLimit', record)}
                                  />,
                              )}
                          </FormItem>
                      )
                  },
                  {
                      title: '操作',
                      align: 'center',
                      width: 100,
                      render: (_, record) => (
                          <Popconfirm
                              title="是否确定删除?"
                              onConfirm={()=>this.delItem(record)}
                              onCancel={()=>{}}
                          ><span className={`${_styles['operation_text']}`}>删除</span></Popconfirm>
                      )
                  }
              ],//商品规格表头
              detail:{}, // 活动详情信息
              uploading:false, 
              originData:[],
              activityStateList:[], //已参加其他活动的sku   
              page:{
                  current:1,
                  pageSize:10
              },
              initLoading:false 
          };
      }

      componentDidMount() {
          const { query } = this.state;
          if (query.stageId != undefined) {
              // 获取商品列表
              this.get_list({ pageSize: 2000, pageIndex:1,stageId:query.stageId,verifyStates:[3] }); 
              // 获取活动详情
              this.get_detail(query);
          }
          
      }

  //编辑保存事件
  handleSaveAllData = () => {
      const { dispatch } = this.props;
      const { query,originData} = this.state;
      const {promotionId,stageId} = query
      this.props.form.validateFieldsAndScroll((err) => {
          if (!err) {
              let sendParams = {}
              let products = []
              let tipsInfo = []
              originData.forEach((item)=>{
                  const {sku,seckillPrice, markingPrice,seckillStock,upperLimit,productId} = item
                  let arrinfo = []
                  if(isEmpty(seckillStock)){
                      arrinfo.push(`秒杀库存为必填`)
                  }
                  if(isEmpty(seckillPrice)){
                      arrinfo.push(`秒杀价为必填`)
                  }
                  if(isEmpty(markingPrice)){
                      arrinfo.push(`划线价为必填`)
                  }
                  if(Number(markingPrice)<Number(seckillPrice)){
                      arrinfo.push(`划线价不能小于秒杀价`)
                  }
                  if(arrinfo.length>0){
                      let info = arrinfo.join(',')
                      tipsInfo.push(`商品${sku},${info}`)
                  }
                  products.push({
                      sku,
                      productId,
                      promotionPrice:seckillPrice,
                      promotionStock:seckillStock,
                      markingPrice,
                      upperLimit
                  })
                
              })
              sendParams.promotionId = promotionId
              sendParams.stageId = stageId
              sendParams.products = products
              
              if(tipsInfo.length>0){
                  const rdom = (<p style={{whiteSpace:'pre-line'}}>{`${tipsInfo.join('\n')}`}</p>)
                  message.error(rdom,6);
                  tipsInfo = [];
                  return false;
              }
              sthis.setState({ uploading: true });
              dispatch({
                  type: 'promotion/updateProduct',
                  payload: sendParams,
                  callback: (res) => {
                      sthis.setState({ uploading: false });
                      if (res.state == 200) {
                          sucTip(res.msg);
                          setTimeout(() => {
                              this.goBack();
                          }, 500);
                      } else {
                          failTip(res.msg);
                      }
                  }
              });
          }
      });
  };

  goBack = ()=>{
      setSession('seckill_detail_back',5);
      this.props.history.goBack()
  }

  sldHandleCancle = () => {
      this.setState({ modalVisibleGoods: false });
  };

  //退出活动
  delItem = (record) => {
      const { dispatch } = this.props;
      dispatch({
          type: 'promotion/quit_seckill_activit_good',
          payload: { 
              promotionIdBindProductId : record.productId
          },
          callback: (res) => {
              if (res.state == 200) {
                  let { originData } = this.state
                  originData = originData.filter(item=>item.withKey!=record.withKey)
                  this.setState({
                      originData
                  })   
                  
              }else{
                  failTip(res.msg)
              }
          }
      });
  }

  //商品多选-回调事件
  seleGoods = (selectedRowsP, selectedRowKeysP) => {
      let { originData } = this.state
      selectedRowsP.forEach((item)=>{
          item.withKey = item.sku
      })
      selectedRowsP = selectedRowsP.filter((item)=>{
          const list = originData.find(el=>el.withKey==item.withKey)
          return list?false:true
      })
      originData = originData.concat(selectedRowsP)
      this.setState({
          originData
      })

      this.sldHandleCancle();
  };

  downFile = () =>{
      downLoad_front('buy_everyday')
  }

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

  handleImpotedJson = async (jsonData)=>{
      try {
          if(!!jsonData.length && jsonData.length > 0){
              // 整合商品详情的入参
              let _skuList = [];
              for(let index = 0; index < jsonData.length; index++) {
                  const ele = jsonData[index];
                  if(Array.isArray(ele)&&ele.length>0){
                      if(index==0){
                          if(ele[0]!='商品名称'){
                              message.error('商品名称项错误,请按格式重新上传!');
                              return false
                          }
                          if(ele[1]!='*商品SKU'){
                              message.error('商品SKU项错误,请按格式重新上传!');
                              return false
                          }
                          if(ele[2]!='*专场价'){
                              message.error('专场价项错误,请按格式重新上传!');
                              return false
                          }
                      }else{
                          let _params = {}
                          // 商品名 不要导入的
                          // 商品SKU
                          if( ele[1] && (/^[A-Za-z0-9]+$/.test( ele[1] )) ){
                              _params.sku = ele[1]
                          }else{
                              message.error(`解析失败,请检查第${index+1}行商品SKU数据`,5);
                              return false;
                          }
                          // 专场价
                          // eslint-disable-next-line no-restricted-globals
                          if( ele[2] && (!isNaN(parseInt(ele[2]))) ){
                              _params.promotionPrice = ele[2]
                          }else{
                              message.error(`解析失败,请检查第${index+1}行专场价数据`,5);
                              return false;
                          }
                          _params.excelIndex = index+1
                          _params.withKey = _params.sku

                          _skuList.push(_params)
                      }
                  }
              }
              
              if(isObjArrRepeat(_skuList,'sku')){
                  message.error(`sku数据项重复,请检查数据`);
                  return false
              }
              if(_skuList.length==0){
                  message.error(`请导入数据!`);
                  return false
              }
              if(_skuList.length>1000){
                  message.error(`最多支持导入1000条数据`);
                  return false
              }
              console.log('_skuList',_skuList)
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
     headers: { Authorization: 'SID' }, 
     showUploadList: false,
     beforeUpload: this.beforeUploadFun
 }

   //获取详情
   get_detail = (query) => {
       const {promotionId,stageId,promotionName,stageTime,stageAliar,verifyState} = query
       this.setState({
           detail:{
               promotionId,
               stageId,
               promotionName,
               stageTime,
               stageAliar,
               verifyState
           }
       })
   };

   //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      const { query } = this.state;
      dispatch({
          type: 'promotion/get_joined_seckill_goods',
          payload: { ...params,promotionId:query.id },
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  if (res.data.list.length == 0 && this.state.params.current > 1) {
                      params.current = params.current - 1;
                      params.pageIndex = params.current
                      this.get_list(params);
                  } else {
                      res.data.list.forEach((item)=>{
                          item.seckillPrice = item.promotionPrice
                          item.seckillStock = item.promotionStock
                          item.withKey = item.sku;
                      });
                      this.setState({
                          originData: res.data.list
                      });
                  }
              }
          }
      });
  };

   // 导入切片
   get_goods_list_all =async (imSkuList)=>{
       const {query:{ promotionTime }} = this.state
       //导入直接置空
       this.setState({ uploading: true, originData:[] });
       message.success(`导入中...`)

       let skuList = []
       imSkuList.forEach((item)=>{
           skuList.push(item.sku)
       })
       // 对sku进行去重处理
       skuList = _uniq(skuList)

       let resTotalList = []
       let skuGroup = _chunk(skuList,100)
       const promiseList = skuGroup.map(skus => this.getListBySkus(skus));
       try {
           for (const promise of promiseList) {
               const colList = await promise;
               resTotalList = resTotalList.concat(colList)
           }
       } catch (error) {
           console.log(error)
       }
      
       this.setState({
           uploading:false
       })
       // 根据日期获取已经参加活动的sku集合 检验已参加其他活动商品
       let activityStateList = await this.hasActivityByDate([promotionTime])
       let checkActiveInfo = this.checkActiveSku(activityStateList,imSkuList)
       if(checkActiveInfo.length>0){
           message.error(`${checkActiveInfo[0]}`,5);
           return false;
       }

       // 检查专场价
       let checkInfo = this.setInfo(resTotalList,imSkuList)
       if(checkInfo.length>0){
           message.error(`${checkInfo[0]}`,5);
           return false;
       }

       let errList = []
       // 导入丢失的sku
       let withoutSku=[]
       // 核算数据 出参和入参相同
       if(resTotalList.length == skuList.length){
           this.setState({
               originData:[...imSkuList]
           });
       }else{
           let that = this
           // 数据有丢失 ，需要提示出sku信息
           imSkuList.forEach((item,index)=>{
               if(resTotalList.findIndex(e=>e.sku==item.sku)>-1){
                   // todo
               }else{
                   errList.push(`请检查第${index+2}行商品${item.sku},未匹配到数据`)
                   withoutSku.push(item.sku)
               }
           })

           confirm({
               title:'以下商品未匹配到数据，是否确定继续导入?',
               content: `${errList.join('\n')}`,
               className:'comfirm_modal',
               cancelText:'取消',
               okText:'确定',
               mask:false,
               onOk(){
                   //剔除导入缺失的sku
                   imSkuList = imSkuList.filter((item)=>!withoutSku.includes(item.sku))
                   that.setState({
                       originData:[...imSkuList]
                   });
               },
               onCancel() {

               }
           });
       }

   };

   //导入下设置查询回来的数据
   setInfo = (resTotalList,imSkuList)=>{
       let checkInfo = []
       for (let index = 0; index < imSkuList.length; index++) {
           const item = imSkuList[index];
           let ele = resTotalList.find((e)=>e.sku==item.sku)
           if(ele){
               // 专场价大于销售价
               if(item.promotionPrice>ele.salePrice){
                   checkInfo.push(`第${item.excelIndex}行专场价大于销售价`)
                   return checkInfo
               }
               item.skuName = ele.skuName
               item.mainImage = ele.mainImage
               item.salePrice = ele.salePrice
               item.supplierSettlePrice = ele.supplierSettlePrice
           }
        
       }
       return checkInfo
   }

   //检查已参加活动的商品
   checkActiveSku = (activityStateList,imSkuList)=>{
       let checkActiveInfo = []
       for (let index = 0; index < imSkuList.length; index++) {  
           const item = imSkuList[index]; 
           if(activityStateList.includes(item.sku)){
               checkActiveInfo.push(`第${item.excelIndex}行商品${item.sku}已参加其他活动`)
               return checkActiveInfo
           }
       }
       return checkActiveInfo
   }

  // 打开手动选择模态框
  addGoods = () => {
      this.setState({ modalVisibleGoods: true});
  };

   //按100条来查询sku数据
   getListBySkus = (skus)=>new Promise((resolve) => {
       const { dispatch } = this.props;
       let new_params = { pageSize:100, pageIndex: 1,skus: skus,storeId};
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

   //根据日期获取以参加活动的sku集合
   hasActivityByDate = (dateList) => new Promise((resolve) =>{
       const { dispatch } = this.props;
       dispatch({
           type: 'project/get_productState_list',
           payload: {
               dateList
           },
           callback: (res) => {
               if (res.state == 200) {
                   //skuInfos = [{exactDate:'2022-10-20',skuList:['JD10000533636355','JD10000533']}]
                   resolve(res.data.skuInfos[0].skus||[])
               } else {
                   failTip(res.msg)
               }
           }
       })
   })

   handleFieldChange(val, fieldName, record) {
       let { originData } = this.state;
       
       //秒杀库存和限购数量都不可以超过最大库存
       if ((fieldName == 'seckillStock' || fieldName == 'upperLimit') && Number(val) > (Number(record.skuStock)||1000)) {
           val = record.skuStock||val;
       }
       //秒杀价格都不可以超过商品价格
       if (fieldName == 'seckillPrice' && Number(val) > Number(record.salePrice)) {
           val = record.salePrice;
       }
       //限购数量都不可以超过秒杀库存
       if (fieldName == 'upperLimit' && Number(val) > Number(record.seckillStock)) {
           val = record.seckillStock;
       }
       // 当前操作的数据
       let tar_item = originData.filter(item => item.withKey == record.withKey);
       if (tar_item.length > 0) {
           let tar_data = tar_item[0];
           if (tar_data) {
               tar_data[fieldName] = val;
               this.setState({ originData }, () => {
                   sthis.props.form.resetFields([`seckillStock${record.withKey}`,`upperLimit${record.withKey}`,`seckillPrice${record.withKey}`]);
               });
           }
       }
   }

   pagination = {
       onChange:(current)=>{
           this.setState({
               page:{
                   current,
                   pageSize:10
               }
           })
       }
   }


   render() {
       const { detail,modalVisibleGoods,uploading,columns,originData,initLoading } = this.state;
    
       return (
           <div
               className={`${global.common_page} ${global.com_flex_column}`}
               style={{ position: 'relative' }}
           >
               {sldLlineRtextAddGoodsAddMargin('#69A2F2', '活动详情', 0, 0, 10)}
               <div className={`${_styles['content_des']}`}>
                   <div className={`${_styles['des_item']}`}><span className={`${_styles['des_item_title']}`}>活动名称：</span> <span className={`${_styles['des_item_content']}`}>{detail.promotionName}</span></div>
                   <div className={`${_styles['des_item']}`}><span className={`${_styles['des_item_title']}`}>活动日期：</span> <span className={`${_styles['des_item_content']}`}>{detail.stageTime}</span></div>
                   <div className={`${_styles['des_item']}`}><span className={`${_styles['des_item_title']}`}>活动场次：</span> <span className={`${_styles['des_item_content']}`}>{detail.stageAliar}</span></div>
                   {/* <div className={`${_styles['des_item']}`}><span className={`${_styles['des_item_title']}`}>场次状态：</span> <span className={`${_styles['des_item_content']}`}>{stateTxtValue[detail.verifyState]}</span></div> */}
               </div>
               {/* <div style={{marginBottom:'10px'}}>
                   <Upload {...this.upProps} disabled={uploading} style={{marginRight:'8px'}}>
                       <Button loading={uploading} type='primary'>上传文件</Button>
                   </Upload>
                   <Button onClick={()=>{this.downFile()}} style={{marginRight:'8px'}}>下载模板</Button>
                   <Button onClick={()=>{this.addGoods()}} style={{marginRight:'8px'}}>添加商品</Button>
               </div> */}
               <Spin spinning={uploading}>
                   <Scrollbars
                       autoHeight
                       autoHeightMin={100}
                       autoHeightMax={document.body.clientHeight-300}
                   >
                       <Table 
                           rowKey="withKey"
                           columns={columns}
                           dataSource={originData}
                           size="small"
                           pagination={this.pagination}
                           loading={initLoading}
                       />
                   </Scrollbars>
                   
               </Spin>
               <ReviewLog type='project/listRecord' params={{businessId:this.props.location.query.stageId}} />
               <div
                   className={global.m_diy_bottom_wrap}
                   style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}
               >
                   <div onClick={() => this.goBack()} className={global.add_goods_bottom_btn}>
                       {sldComLanguage('取消')}
                   </div>
                   <div
                       onClick={() => this.props.form.submit(this.handleSaveAllData)}
                       className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}
                   >
                       {sldComLanguage('提交审核')}
                   </div>
               </div>
               {/*商品多选的modal框-start*/}
               <SldSelMoreLeftRightSeckillGoods
                   selectedRows={this.sele_more_goods.info}
                   selectedRowKeys={this.sele_more_goods.ids}
                   modalVisible={modalVisibleGoods}
                   width={1000}
                   height={document.body.clientHeight - 400}
                   sldHandleSeleMoreModalCancle={this.sldHandleCancle}
                   seleSvideo={this.seleGoods}
                   title={`${sldComLanguage('请选择商品(至少选择一个)')}`}
                   extra={this.sele_more_goods}
                   selectStageDay={detail.promotionTime}
               />
               {/*商品多选的modal框-end*/}
           </div>
       );
   }
}
