/*
* 多选组件——左右布局，这样能看到更多的数据
* 用于商品池选择
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import {
    Empty,
    Form, Modal,Tooltip,Select,Spin,Row,Col,Radio,Input,Button,Upload,message
} from 'antd';
import XLSX from 'xlsx';
import { Scrollbars } from 'react-custom-scrollbars';
import _chunk from 'lodash/chunk';
import {
    failTip,
    sldComLanguage,
    downLoad_front
} from '@/utils/utils';
import global from '@/global.less';
import styles from './index.less';
import ALibbSvg from '../ALibbSvg';
import Count from './count';

const { Search } = Input;
const { confirm } = Modal;

@connect(({ project }) => ({
    project
}))
@Form.create()
export default class SelectGoodsPool extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            modalVisible: false,
            loading: false,
            goodsLoading:false,
            poolList:[], // 商品池下拉列表
            poolGoodsList:[], // 池商品
            title: '',
            params: { pageSize: 10 },
            publishType:1,
            uploading:false,
            orderSn:'' // 订单号
        };
    }

    componentDidMount() {
        Modal.destroyAll();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.modalVisible) {
            this.setState({
                poolGoodsList:[],
                publishType:nextProps.publishType||1,
                selectedRows: [...nextProps.selectedRows],
                selectedRowKeys: [...nextProps.selectedRowKeys]
            });
        }
    }

    componentWillUnmount() {
        Modal.destroyAll();
    }

    onSearchOrder = (orderSn)=>{
        this.getOrderProduct({orderSn})
    }

    onSearchSku = (keyword)=>{
        this.searchByKeyword({keyword})
    }

    //根据抽奖订单获取商品列表
  getOrderProduct = (params) => {
      this.setState({ loading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'project/getOrderProduct',
          payload: params,
          callback: (res) => {
              this.setState({ loading: false });
              if (res.state == 200) {
                  let orderProductList = res.data.orderProductVOList 
                  this.get_goods_list_all(orderProductList)
                  this.setState({
                      orderSn:params.orderSn
                  }) 
              }else{
                  
              }
          }
      });
  };

  // 获取所有的sku信息
  get_goods_list_all =async (orderProductList)=>{
      this.setState({
          goodsLoading:true
      })
      let skuList = []
      orderProductList.forEach((item)=>{
          skuList.push(item.sku)
      })
      let selectedRows = []
      let selectedRowKeys = []
      let skuGroup = _chunk(skuList,100)
      const promises = skuGroup.map(skus => this.get_goods_list_group(skus));
      try {
          for (const promise of promises) {
              const column = await promise;
              selectedRows = selectedRows.concat(column)
          }
      } catch (error) {
          console.log(error)
      }

      this.setState({
          goodsLoading:false
      })
      // 补充number数据项
      selectedRows.forEach(item => {
          const ele = orderProductList.find((e)=>e.sku==item.sku)
          item.showPrice = item.salePrice
          item.num = ele.number
          selectedRowKeys.push(item.sku);
      });

      // 核算数据
      let errList = []
      if(selectedRows.length == orderProductList.length){
          // 导入核验成功
          this.setState({
              poolGoodsList:Object.assign([],selectedRows),
              selectedRows,
              selectedRowKeys
          });
      }else{
          let that = this
          // 数据有丢失 ，需要提示出sku信息
          orderProductList.forEach((item,index)=>{
              if(selectedRows.findIndex(e=>e.sku==item.sku)>-1){
                  // todo
              }else{
                  errList.push(`请检查第${index+2}行商品${item.sku},未匹配到数据`)
              }
          })

          confirm({
              title: '以下商品未匹配到数据，是否确定继续导入?',
              content: `${errList.join('\n')}`,
              className:'comfirm_modal',
              cancelText:'取消',
              okText:'确定',
              mask:false,
              onOk(){
                  that.setState({
                      poolGoodsList:Object.assign([],selectedRows),
                      selectedRows,
                      selectedRowKeys
                  });
                  
              },
              onCancel() {
  
              }
          });
      }

      //   this.setState({
      //       poolGoodsList:Object.assign([],selectedRows),
      //       selectedRows,
      //       selectedRowKeys
      //   });

  };

  // 根据skus获取商品，按100来取值
  get_goods_list_group = (skus)=>new Promise((resolve) => {
      const { dispatch } = this.props;
      let new_params = { pageSize:100, pageIndex: 1,skus: skus };
      dispatch({
          type: 'project/get_activity_goods_lists_byskulist',
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

  // 根据sku查询
  searchByKeyword = (params) => {
      this.setState({
          goodsLoading:true
      })
      const { dispatch } = this.props;
      let { poolGoodsList } = this.state;
      params.pageIndex = params.current||1;
      params.pageSize = 16
      dispatch({
          type: 'project/get_activity_goods_lists',
          payload: params,
          callback: (res) => {
              this.setState({
                  goodsLoading:false
              })
              if (res.state == 200) {
                  if (res.data.pagination != undefined) {
                      if (res.data.pagination.current == 1) {
                          poolGoodsList = res.data.list;
                      } else {
                          poolGoodsList = poolGoodsList.concat(res.data.list);
                      }
                  }
                  this.setState({
                      poolGoodsList
                  });
              }
          }
      });
  };

 
  //取消事件
  sldCancle = () => {
      this.setState({
          selectedRows: [],
          selectedRowKeys: []
      });
      this.props.sldHandleSeleMoreModalCancle();
  };

  sldConfirm = () => {
      let { selectedRows, selectedRowKeys,orderSn,publishType } = this.state;
      if (selectedRowKeys.length > 0) {
          if (this.props.extra.min_num != undefined && this.props.extra.min_num > 0 && selectedRowKeys.length < this.props.extra.min_num) {
              failTip(`${sldComLanguage('该模块至少需要选择')}${this.props.extra.min_num}${sldComLanguage('个商品')}`);//该模块至少需要选择   个商品
              return false;
          }
          if (this.props.extra.total_num != undefined && this.props.extra.total_num > 0 && selectedRowKeys.length != this.props.extra.total_num) {
              failTip(`${sldComLanguage('该模块需要选择')}${this.props.extra.total_num}${sldComLanguage('个商品')}`);//该模块需要选择   个商品
              return false;
          }
          if (this.props.extra.max_num != undefined && this.props.extra.max_num > 0 && selectedRowKeys.length > this.props.extra.max_num) {
              failTip(`${sldComLanguage('该模块最多选择')}${this.props.extra.max_num}${sldComLanguage('个商品')}`);//该模块至少需要选择   个商品
              return false;
          }

          this.props.seleSvideo(selectedRows, selectedRowKeys,orderSn,publishType);
          this.setState({
              selectedRows: [],
              selectedRowKeys: []
          });
      } else {
          failTip(`${sldComLanguage('请选择商品')}`);
      }

  };

  //关闭modal事件
  closeReset = () => {
      
  };

  //左侧数据点击事件（将选中的数据添加到右侧，左侧添加选中标识）
  handleLeftItem = (item) => {
      let { selectedRows, selectedRowKeys } = this.state;
      //   if(selectedRows.length>=12){
      //       failTip('选择商品已大于12种')
      //       return false
      //   }
      if (selectedRowKeys.indexOf(item.sku) == -1) {
          item.showPrice = item.salePrice
          item.num = 1
          selectedRowKeys.push(item.sku);
          selectedRows.push(item);
      }
      this.setState({
          selectedRowKeys,
          selectedRows
      });
  };

  // 全选事件
  handleLeftAll = () => {
      let { selectedRows, selectedRowKeys,poolGoodsList } = this.state;
      if( poolGoodsList && Array.isArray(poolGoodsList) ){
          poolGoodsList.forEach((item)=>{
              if (selectedRowKeys.indexOf(item.sku) == -1) {
                  selectedRowKeys.push(item.sku);
                  selectedRows.push(item);
              }
          })
          this.setState({
              selectedRowKeys,
              selectedRows
          });
      }
  };

  //右侧数据点击事件（移除选中数据，右侧将不显示，左侧的选中标识去掉）
  handleRightItem = (item) => {
      let { selectedRows, selectedRowKeys } = this.state;
      selectedRows = selectedRows.filter(items => items.sku != item.sku);
      selectedRowKeys = selectedRowKeys.filter(items => items != item.sku);
      this.setState({
          selectedRowKeys,
          selectedRows
      });
  };

  count = (item,value)=>{
      item.num = value
      console.log('value',value)
  }

  changeType = (e)=>{
      this.setState({
          publishType:e.target.value,
          selectedRows:[],
          selectedRowKeys:[],
          poolGoodsList:[]
      })
  }

  // 直接导模板
  downFile = () =>{
      downLoad_front('selgoods')
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

  handleImpotedJson = (jsonData)=>{
      try {
          if(!!jsonData.length && jsonData.length > 0){
              // 整合商品详情的入参
              let _skuList = [];
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
                          if(ele[2]!='商品数量'){
                              message.error('商品数量项错误,请按格式重新上传!');
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
                          // sku 数量
                          // eslint-disable-next-line no-restricted-globals
                          if( ele[2] && (!isNaN(parseInt(ele[2]))) ){
                              _params.number = ele[2]
                          }else{
                              message.error(`解析失败,请检查第${index+1}行商品数量数据`,5);
                              return false;
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
              
              this.get_goods_list_all(_skuList)


          }else{
              message.error('解析失败,请按格式上传!');
          }
    
      } catch (error) {
          message.error('解析失败,请按格式上传!');
      }
  }

  // 这个upProps应该放在beforeUploadFun函数的后面
  // eslint-disable-next-line react/sort-comp 
  upProps = {
      name: 'file', //发到后台的文件参数名
      // action: `${serverUrl('/api/road/upload')}`,     // 传到后端的接口名,这里不传
      headers: { Authorization: 'SID' }, // 
      showUploadList: false,
      beforeUpload: this.beforeUploadFun
  }

  render() {
      const { modalVisible, width, title, height } = this.props;
      const { selectedRows, selectedRowKeys, poolGoodsList,goodsLoading,publishType,uploading} = this.state;
      return (
          <Modal
              destroyOnClose
              onOk={this.sldConfirm}
              afterClose={this.closeReset}
              onCancel={this.sldCancle}
              visible={modalVisible}
              width={width}
              title={title}
          >
              <div className={`${styles.component_sele_more} ${global.flex_column_start_start}`}>
                  <div className={global.tableListForm}>
                      <div style={{margin:5,display:'flex'}}>
                          <div style={{width:'150px',textAlign:'right',paddingRight:'8px'}}>
                            请选择商品获取方式:
                          </div>
                          <div>
                              <Radio.Group onChange={this.changeType} value={Number(publishType)}>
                                  <Radio value={1}>通过兑换劵订单号</Radio>
                                  <Radio value={2}>手动导入</Radio>
                                  <Radio value={3}>通过SKU获取</Radio>
                              </Radio.Group>
                          </div>
                      </div>
                      <div style={{marginTop:'10px',marginBottom:'10px'}}>
                          {
                              publishType ==1?
                                  <div style={{display:'flex',alignItems:'center'}}>
                                      <div style={{width:'150px',textAlign:'right',paddingRight:'8px'}}>兑换券订单号:</div>
                                      <div className={styles.btn_height}><Search placeholder='请输入兑换券订单号' enterButton="关联" onSearch={this.onSearchOrder} /></div>
                                  </div>
                                  :
                                  publishType ==2?
                                      <div style={{display:'flex',alignItems:'center'}}>
                                          <div style={{width:'150px',textAlign:'right'}}></div>
                                          <Button onClick={()=>{this.downFile()}}>下载模板</Button>
                                          <Upload {...this.upProps} disabled={uploading}>
                                              <Button loading={uploading} style={{marginLeft:'8px'}}>点击上传</Button>
                                          </Upload>
                                      </div>
                                      :
                                      <div style={{display:'flex',alignItems:'center',height:'32px'}}>
                                          <div style={{width:'150px',textAlign:'right',paddingRight:'8px'}}>sku:</div>
                                          <div className={styles.btn_height}><Search placeholder='请输入sku' enterButton="搜索" onSearch={this.onSearchSku} /></div>
                                      </div>
                          } 
                      </div>
                  </div>
                  <div className={`${styles.content} ${global.flex_row_start_start}`} style={{ height: height }}>
                      <div style={{ height: height, background: '#f5f5f5' }}>
                          <Scrollbars
                              ref='scrollbars'
                              style={{ width: 438, zIndex: 1 }}
                          >
                              <Spin spinning={goodsLoading}>
                                  <div className={`${styles.left} ${global.flex_row_start_start}`} style={{ height: height }}>
                                      {
                                          poolGoodsList != undefined && poolGoodsList.length > 0 &&
                                        poolGoodsList.map((item, index) => <a
                                            key={index}
                                            href="javascript:void(0)"
                                            className={`${styles.item} ${global.flex_row_start_start}`}
                                            onClick={() => this.handleLeftItem(item)}
                                            style={{ marginBottom: index == poolGoodsList.length - 1 ? 10 : 0 }}
                                        >
                                            <div className={`${styles.item_left} ${global.flex_row_center_center}`}>
                                                <img className={styles.live_img} src={item.mainImage} />
                                            </div>
                                            <div className={`${styles.item_right} ${global.flex_column_start_start}`}>
                                                <span className={`${styles.svideo_name}`}>{item.skuName}</span>
                                                <Tooltip title={item.sku}>
                                                    <span className={`${styles.spec_name}`}>{item.sku}</span>
                                                </Tooltip>
                                                <span className={`${styles.svideo_label}`}>{sldComLanguage('¥')}{item.showPrice||item.salePrice}</span>
                                                {selectedRowKeys.indexOf(item.sku) > -1 &&
                                                <div className={`${styles.sele_svideo_flag}`}>
                                                    <ALibbSvg fill="#FC701E" width={19} height={19} type="yixuan" />
                                                </div>
                                                }
                                            </div>
                                        </a>)
                                      }
                                      {
                                          poolGoodsList == undefined||poolGoodsList.length ==0 &&
                                    <div className={global.flex_column_center_center} style={{width:'100%',height:'100%'}}>
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                    </div>
                                      }
                                  </div>
                              </Spin>  
                          </Scrollbars>
                      </div>
                      <div className={`${styles.center} ${global.flex_row_center_center}`}>
                          <ALibbSvg fill="#ff711e" width={39} height={32} type="move-up1" />
                      </div>
                      <div style={{ height: height, background: '#f5f5f5' }}>
                          <Scrollbars
                              style={{ width: 438, zIndex: 1 }}
                          >
                              <div className={`${styles.right} ${global.flex_row_start_start}`} style={{ height: height }}>
                                  {
                                      selectedRows.length > 0 ?
                                          selectedRows.map((item, index) => <span
                                              key={item.sku}
                                              href="javascript:void(0)"
                                              className={`${styles.item_single} ${global.flex_row_start_start}`}
                                              style={{ marginBottom: index == selectedRows.length - 1 ? 10 : 0 }}
                                          >
                                              <div className={`${styles.item_left} ${global.flex_row_center_center}`}>
                                                  <img className={styles.live_img} src={item.mainImage} />
                                              </div>
                                              <div className={`${styles.item_right} ${global.flex_column_start_start}`}>
                                                  <span className={`${styles.svideo_name}`}>{item.skuName}</span>
                                                  <Tooltip title={item.sku}>
                                                      <span className={`${styles.spec_name}`}>{item.sku}</span>
                                                  </Tooltip>
                                                  <span className={`${styles.svideo_label}`}>{sldComLanguage('¥')}{item.showPrice||item.salePrice}</span>
                                                  <div className={`${styles.sele_svideo_flag_single} ${publishType==1?styles._disabled:''}`} onClick={() => this.handleRightItem(item)}>
                                                      <ALibbSvg fill="#FC701E" width={19} height={19} type="shanchu" />
                                                  </div>
                                                  <div className={`${styles.sele_svideo_flag_count}`}>
                                                      <Count min={1} onChange={(value)=>this.count(item,value)} value={item.num} disabled={publishType==1?true:false} />
                                                  </div>
                                              </div>
                                          </span>)
                                          :<div className={global.flex_column_center_center} style={{width:'100%',height:'100%'}}>
                                              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`${sldComLanguage('您还未选择数据')}`} />
                                          </div>
                                  }
                              </div>
                          </Scrollbars>
                          {/* <div style={{color:'#000',position:'fixed'}}>{selectedRows.length}/12</div> */}
                      </div>
                  </div>
              </div>
          </Modal>
      );
  }
}
