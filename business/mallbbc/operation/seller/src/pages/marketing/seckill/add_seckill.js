/*
* 参加秒杀活动
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, DatePicker, Select, Table, InputNumber, Switch, Tooltip,Upload,Button,message,Tag,Collapse,List,Modal } from 'antd';
import XLSX from 'xlsx';
import {
    failTip,
    sucTip,
    sldLlineRtextAddGoodsAddMargin,
    sldComLanguage,
    getSldHorLine,
    sldCommonTitleByBg,
    dateTimeFormat,
    getSldEmptyH,
    list_com_page_more,
    sldIconBtn,
    sldSvgIcon,
    downLoad_front,
    isRepeat,
    getStorage,
    guid
} from '@/utils/utils';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import SldSelMoreLeftRightSeckillGoods from '@/components/SldSelMoreLeftRightSeckillGoods';
import moment from 'moment';

const { confirm } = Modal;

const step = 100;
const storeId = getStorage('storeId');
let sthis = '';
let errMsg = [];
const FormItem = Form.Item;
const Option = Select.Option;
const { Panel } = Collapse;
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
      
      //   upProps = {
      //       name: 'file', //发到后台的文件参数名
      //       // action: `${serverUrl('/api/road/upload')}`,     // 传到后端的接口名,这里不传
      //       headers: { Authorization: 'SID' }, // 
      //       showUploadList: false,
      //       beforeUpload: this.beforeUploadFun
      //   }

      constructor(props) {
          super(props);
          sthis = this;
          const {
              form: { getFieldDecorator }
          } = props;
          this.state = {
              battchVal: '',//批量设置里面的值
              activity_stages: [],//活动场次
              activity_labels: [],//活动标签
              loading: false,
              modalVisibleGoods: false,
              query: props.location.query,
              selectedRows: [],
              selectedRowKeys: [],//selectedRows的key
              detail: {},//活动详情数据
              columns_spec: [
                  {
                      title: ' ',
                      dataIndex: 'key',
                      align: 'center',
                      width: 30,
                      render: (text, record, index) => index + 1
                  },
                  {
                      title: `${sldComLanguage('SKU规格')}`,
                      dataIndex: 'specValues',
                      align: 'center',
                      width: 100,
                      render: (text) => text ? text : `${sldComLanguage('默认')}`
                  },
                  {
                      title: `${sldComLanguage('销售价(¥)')}`,
                      dataIndex: 'salePrice',
                      align: 'center',
                      width: 100
                  },
                  {
                      title: `${sldComLanguage('库存')}`,
                      dataIndex: 'skuStock',
                      align: 'center',
                      width: 100
                  },
                  {
                    title: <div style={{ position: 'relative' }}>
                        <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>{sldComLanguage('划线价')}
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
                                rules: record.state == 1?[{
                                    required: true,
                                    message: `${sldComLanguage('该项必填')}`
                                }]:[]
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
                          <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>{sldComLanguage('秒杀价')}
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
                                  rules: record.state == 1?[{
                                      required: true,
                                      message: `${sldComLanguage('该项必填')}`
                                  }]:[]
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
                          <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>{sldComLanguage('秒杀库存')}
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
                                  rules: record.state == 1?[{
                                      required: true,
                                      message: `${sldComLanguage('该项必填')}`
                                  }]:[]
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
                          {sldComLanguage('限购数量')}
                          <Tooltip placement="bottomLeft" title={sldComLanguage('限制每个会员ID在本场活动中的购买数量')}>
                              <div style={{ right: -15, top: 2, position: 'absolute' }}>{sldSvgIcon('#bfbbba', 14, 14, 'wen')}</div>
                          </Tooltip></div>,
                      dataIndex: 'upperLimit',
                      align: 'center',
                      width: 100,
                      render: (text, record) => (
                          <FormItem
                              style={{ width: '100%' }}
                          >
                              {getFieldDecorator(`upperLimit${record.withKey}`, {
                                  initialValue: text
                              })(
                                  <InputNumber
                                      min={0}
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
                      title: `${sldComLanguage('参与')}`,
                      dataIndex: 'state',
                      align: 'center',
                      width: 60,
                      render: (text, record) => (
                          <FormItem
                              style={{ width: '100%' }}
                          >
                              {getFieldDecorator(`state${record.sku}`, {
                                  valuePropName: 'checked',
                                  initialValue: text == 1 ? true : false
                              })(
                                  <Switch
                                      style={{ width: '100%' }}
                                      onChange={e => this.handleFieldChange(e ? 1 : 2, 'state', record)}
                                  />,
                              )}
                          </FormItem>
                      )
                  }],//商品规格表头
              uploading:false,
              skuDateList:[],
              multiSkill:[
                  {
                      uuid:guid(),
                      labelId:'',
                      stageId:'',
                      stageDay:'', // 需要stageDay2022=10-24 查询当天已参与其他活动的信息
                      stageTime:'',
                      activityTime:'',
                      selectedRows:[],
                      selectedRowKeys:[]
                  }
              ], //  2022/3/25  新需求支持一次性添加多场次的场景,此处数组为动态表单的数据  
              curMultiIndex:0, //当前场次
              selectStageDay:''
          };
      }

      componentDidMount() {
          const { query } = this.state;
          if (query.id != undefined && query.id > 0) {
              this.get_detail(query.id);
          }
          this.get_activity_stage(query.id);
          this.get_activity_label();
          this.props.dispatch({
              type: 'global/getLayoutCollapsed'
          });
      }

      componentWillUnmount() {
      }


      // //批量设置
      // batchConfirm = (e, type, val) => {
      //   const { selectedRows, battchVal } = this.state;
      //   let sku_product_id = [];
      //   for(let i = 0; i < selectedRows.length; i++) {
      //     if (selectedRows[i].goodsId == val.goodsId) {
      //       selectedRows[i].seckillProductVOList.map(item => {
      //         item[type] = battchVal;
      //         sku_product_id.push(item.productId);
      //       });
      //       break;
      //     }
      //   }
      //   this.setState({ selectedRows, battchVal: '' }, () => {
      //     sku_product_id.map(item=>{
      //       sthis.props.form.resetFields(['seckillStock'+item,'upperLimit'+item,'seckillPrice'+item,'state'+item]);
      //     })
      //   });
      // };

      // //批量设置
      // handleFieldBattchChange = (e, type, item) => {
      //   //将sku里对应的数据抽成数组，排序，获取最小的值，批量设置的值不能大于最小的值
      //   let tmp_type_key = type == 'seckillPrice' ? 'productPrice' : 'skuStock';
      //   let typeAarry = [];
      //   item.seckillProductVOList.map(val => {
      //     typeAarry.push(val[tmp_type_key]);
      //   });

      //   let minVal = typeAarry.sort()[0];
      //   if (e > minVal) {
      //     e = minVal;
      //   }
      //   this.setState({ battchVal: e });
      // };

      // //全部参与事件
      // setAll = (e, val) => {
      //   let { selectedRows } = this.state;
      //   for(let i = 0; i < selectedRows.length; i++) {
      //     if (selectedRows[i].goodsId == val.goodsId) {
      //       selectedRows[i].seckillProductVOList.map(item => {
      //         item.state = e.target.checked ? 1 : 0;
      //       });
      //       //全选或者全不选就不是 混沌状态
      //       if(e.target.checked){
      //         val.checkAll = true;
      //       }else{
      //         val.checkAll = false;
      //       }
      //       val.indeterminate = false;
      //       break;
      //     }
      //   }
      //   // this.setState({ selectedRows }, () => {
      //   //   sthis.props.form.resetFields();
      //   // });
      //   this.setState({ selectedRows });
      // };
 

  handleSelectRows = (rows, rowkeys) => {
      this.setState({
          selectedRows: rows,
          selectedRowKeys: rowkeys
      });
  };

  //保存并新增事件
  handleSaveAllData = () => {
      const { dispatch } = this.props;
      const { query ,activity_stages,activity_labels,multiSkill,detail} = this.state;
      this.props.form.validateFieldsAndScroll((err) => {
          if (!err) {
              let sendParams = {}
              let stageInfoList = []
              let stageDaySku = {} // 同一天内重复的sku去重 ,不同天的可以重复
              let errInfo = []
              let vaiInfo = []
              let tipsInfo = []
              let Num = 0
              multiSkill.forEach((stageItem,ins)=>{
                  let params = {};
                  params.labelId = stageItem.labelId || null
                  params.stageId = stageItem.stageId
                  if(stageItem.stageId && activity_stages.length>0){
                      const item = activity_stages.find((item1)=>item1.stageId == stageItem.stageId)
                      params.startTime = item.startTime
                      params.stageName = item.stageName
                  }
                  if(stageItem.labelId && activity_labels.length>0){
                      const item = activity_labels.find((item1)=>item1.labelId == stageItem.labelId)
                      params.labelName = item.labelName
                  }
                  if (stageItem.activityTime) {
                      params.endTime = stageItem.activityTime;
                  }
                  params.products = [];
                  if(stageDaySku[stageItem.stageDay]){
                      // todo
                  }else{
                      stageDaySku[stageItem.stageDay] = []
                  }
                  stageItem.selectedRows.forEach((goodsItem,idx) => {
                      if (goodsItem.state == 1) {
                          if(stageDaySku[stageItem.stageDay].indexOf(goodsItem.sku)>-1){
                              errInfo.push(`场次${ins+1},活动时间${stageItem.stageDay},第${idx+1}个商品,sku${goodsItem.sku}重复`)
                          }
                          stageDaySku[stageItem.stageDay].push(goodsItem.sku)
                          let arrinfo = []
                          if(!goodsItem.seckillPrice){
                              arrinfo.push(`秒杀价为必填`)
                          }
                          if(Number(goodsItem.seckillPrice) > Number(goodsItem.markingPrice)){
                              arrinfo.push(`秒杀价不能高于划线价`)
                          }
                          if(!goodsItem.seckillStock){
                              arrinfo.push(`秒杀库存为必填`)
                          }
                          if(arrinfo.length>0){
                              let info = arrinfo.join(',')
                              tipsInfo.push(`场次${ins+1},第${idx+1}个商品,${info}`)
                          }
                          params.products.push({
                              sku: goodsItem.sku,
                              //   skuName:goodsItem.skuName,
                              //   mainImage:goodsItem.mainImage,
                              //   salePrice:goodsItem.salePrice,
                              promotionPrice: goodsItem.seckillPrice,
                              markingPrice: goodsItem.markingPrice,
                              promotionStock: goodsItem.seckillStock,
                              upperLimit: goodsItem.upperLimit != undefined ? goodsItem.upperLimit : 0
                              //   skuStock:goodsItem.skuStock||1000
                          });
                      }
                  });
                  if(params.products.length==0){
                      vaiInfo.push(`场次${ins+1}请选择要参与活动的商品`)
                  }
                  Num = Num + params.products.length
                  stageInfoList.push(params)
              })
         
              let dis_type = '';
              sendParams.promotionId = query.id;// 秒杀活动id
              sendParams.promotionName = detail.promotionName;// 秒杀活动id
              sendParams.seckillEndTime = detail.endTime;// 秒杀活动结束时间
              sendParams.stageInfoList = stageInfoList
              if(vaiInfo.length>0){
                  const rdom = (<p style={{whiteSpace:'pre-line'}}>{`${vaiInfo.join('\n')}`}</p>)
                  message.error(rdom,6);
                  vaiInfo = [];
                  return false;
              }
              if(errInfo.length>0){
                  const rdom = (<p style={{whiteSpace:'pre-line'}}>{`${errInfo.join('\n')}`}</p>)
                  message.error(rdom,6);
                  errInfo = [];
                  return false;
              }
              if(tipsInfo.length>0){
                  const rdom = (<p style={{whiteSpace:'pre-line'}}>{`${tipsInfo.join('\n')}`}</p>)
                  message.error(rdom,6);
                  tipsInfo = [];
                  return false;
              }
              if(Num>2000){
                  message.error('一次性最多支持添加2000个商品!');
                  return false
              }
              dis_type = 'promotion/join_seckill_activity';
              sthis.setState({ loading: true });
              // 校验数据
              //   return false
              dispatch({
                  type: dis_type,
                  payload: sendParams,
                  callback: (res) => {
                      sthis.setState({ loading: false });
                      if (res.state == 200) {
                          sucTip(res.msg);
                          setTimeout(() => {
                              sthis.props.history.goBack();
                          }, 500);
                      } else {
                          failTip(res.msg);
                      }
                  }
              });
          }
      },
      );
  };

  sldHandleCancle = () => {
      this.setState({ modalVisibleGoods: false });
  };

  //商品多选-回调事件
  seleGoods = (selectedRowsP, selectedRowKeysP) => {
      let { curMultiIndex,multiSkill } = this.state;
      // 当前操作的场次数据
      let temp = multiSkill[curMultiIndex];
      selectedRowsP.forEach((item) => {
          //默认都选中
          item.state = 1;
      });

      //如果多次选择的话，数据要保留之前的 (因为有填写的数据所以要保留)
      temp.selectedRowKeys.forEach((item) => {
          if (selectedRowKeysP.indexOf(item) > -1) {
              let pre_item_data = temp.selectedRows.filter(val => val.sku == item)[0];
              for (let i = 0; i < selectedRowsP.length; i++) {
                  if (selectedRowsP[i].sku == item) {
                      selectedRowsP[i] = { ...pre_item_data };
                      break;
                  }
              }
          }
      });

      //设置 之前的key为sku  ，现在多场次操作sku作为key不在唯一,所以增加一个key
      selectedRowsP.forEach((item)=>{
          item.withKey = `${item.sku}_${temp.uuid}`
      })
      this.sele_more_goods.ids = [...selectedRowKeysP];
      this.sele_more_goods.info = JSON.parse(JSON.stringify(selectedRowsP));
      // 这个要隔断 不然数据会串
      temp.selectedRows = JSON.parse(JSON.stringify(selectedRowsP));
      temp.selectedRowKeys = selectedRowKeysP;
      this.setState({
          multiSkill
      });
      this.sldHandleCancle();
  };

  //删除添加的商品spu
  delSpu = (sku,multiIndex) => {
      let { multiSkill } = this.state;
      // 当前操作的场次数据
      let temp = multiSkill[multiIndex];
      temp.selectedRows = temp.selectedRows.filter(item => item.sku != sku);
      temp.selectedRowKeys = temp.selectedRowKeys.filter(item => item != sku);
      this.sele_more_goods.ids = [...temp.selectedRowKeys];
      this.sele_more_goods.info = JSON.parse(JSON.stringify(temp.selectedRows));
      this.setState({ multiSkill,curMultiIndex:multiIndex });
  };

  addGoods = (multiIndex) => {
      let { multiSkill } = this.state;
      // 当前操作的场次数据
      let temp = multiSkill[multiIndex];
      let selectStageDay = temp.stageDay
      if(!selectStageDay){
          message.error('请先选择场次信息！')
          return 
      }
      this.sele_more_goods.ids = [...temp.selectedRowKeys];
      this.sele_more_goods.info = JSON.parse(JSON.stringify(temp.selectedRows));
      this.setState({ modalVisibleGoods: true,curMultiIndex:multiIndex,selectStageDay });
  };

  upLoad = (multiIndex,stageId)=>{
      if(!stageId){
          message.warning('请先选择场次信息')
      }
      this.setState({curMultiIndex:multiIndex });
  }

   // 直接导模板
   downFile = () =>{
       downLoad_front('2')
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
              let skuList = [];
              for(let index = 0; index < jsonData.length; index++) {
                  const ele = jsonData[index];
                  if(Array.isArray(ele)&&ele.length>0){
                      if(index==0){
                          if(ele[0]!='排序'){
                              message.error('排序项错误,请按格式重新上传!');
                              return false
                          }
                          if(ele[1]!='sku'){
                              message.error('sku项错误,请按格式重新上传!');
                              return false
                          }
                          if(ele[2]!='商品名称'){
                              message.error('商品名称项错误,请按格式重新上传!');
                              return false
                          }
                          if(ele[3]!='划线价'){
                              message.error('划线价项错误,请按格式重新上传!');
                              return false
                          }
                          if(ele[4]!='秒杀价'){
                              message.error('秒杀价项错误,请按格式重新上传!');
                              return false
                          }
                          if(ele[5]!='秒杀库存'){
                              message.error('秒杀库存项错误,请按格式重新上传!');
                              return false
                          }
                          if(ele[6]!='限购数量'){
                              message.error('限购数量项错误,请按格式重新上传!');
                              return false
                          }
                      }else{
                          let params = {}
                          // 排序
                          // eslint-disable-next-line no-restricted-globals
                          if( ele[0] && (!isNaN(parseInt(ele[0]))) ){
                              params.sort = ele[0]
                          }else{
                              message.error(`解析失败,请检查第${index+1}行排序数据`,5);
                              return false;
                          }
                          // sku
                          if( ele[1] && (/^[A-Za-z0-9]+$/.test( ele[1] )) ){
                              params.sku = ele[1]
                          }else{
                              message.error(`解析失败,请检查第${index+1}行sku数据`,5);
                              return false;
                          }
                          // 商品名 不要导入的

                          // 划线价
                          // eslint-disable-next-line no-restricted-globals
                          if( ele[3] && (!isNaN(parseInt(ele[3]))) ){
                              params.markingPrice = ele[3]
                          }else{
                              message.error(`解析失败,请检查第${index+1}行划线价数据`,5);
                              return false;
                          }
                          // 秒杀价
                          // eslint-disable-next-line no-restricted-globals
                          if( ele[4] && (!isNaN(parseInt(ele[4]))) ){
                              params.seckillPrice = ele[4]
                          }else{
                              message.error(`解析失败,请检查第${index+1}行秒杀价数据`,5);
                              return false;
                          }
                          // 秒杀库存
                          // eslint-disable-next-line no-restricted-globals
                          if( ele[5] && (!isNaN(parseInt(ele[5]))) ){
                              params.seckillStock = ele[5]
                          }else{
                              message.error(`解析失败,请检查第${index+1}行秒杀库存数据`,5);
                              return false;
                          }
                          // 限购数量
                          // eslint-disable-next-line no-restricted-globals
                          if( ele[6] && (!isNaN(parseInt(ele[6]))) ){
                              params.upperLimit = ele[6]
                          }else{
                              message.error(`解析失败,请检查第${index+1}行限购数量数据`,5);
                              return false;
                          }
              
                          skuList.push(params)
                      }
                  }
              }
              if(skuList.length>1000){
                  message.error(`最多支持导入1000条数据`);
                  return false
              }
              if(skuList.length>0){
                  this.setState({
                      skuDateList:skuList
                  })
                  errMsg = []
                  const skus = []
                  skuList.forEach((item)=>{
                      skus.push(item.sku)
                  })
                  if(isRepeat(skus)){
                      message.error(`sku数据项重复,请检查数据`);
                      return false
                  }
                  if(skus.length>step){
                      //这里需要切片
                      const sliceTotal = Math.ceil(skus.length / step)
                      this.get_list({ pageSize:10000, current: 1,productIdArr:skus},0,sliceTotal,[]);
                      // for( var i = 0; i<sliceNum; i++ ){
              
                      // }
                  }else{
                      this.get_list({ pageSize:10000, current: 1,productIdArr:skus},0,0,[]);
                  }
              }else{
                  message.error(`请导入数据!`);
              }

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

   //获取秒杀详情
   get_detail = (id) => {
       let { detail } = this.state;
       //    const { dispatch } = this.props;
       //    dispatch({
       //        type: 'promotion/get_seckill_detail',
       //        payload: { promotionId: id },
       //        callback: (res) => {
       //            if (res.state == 200) {
       //                detail = res.data;
       //                this.setState({
       //                    detail
       //                });
       //            } else {
       //                failTip(res.msg);
       //            }
       //        }
       //    });

       detail = JSON.parse(getStorage('join_seckill_detail'))
       this.setState({
           detail
       });

   };

//获取活动场次
get_activity_stage = (id) => {
    const { dispatch } = this.props;
    let { activity_stages } = this.state;
    dispatch({
        type: 'promotion/get_activity_stage',
        payload: { promotionId: id},
        callback: (res) => {
            if (res.state == 200) {
                activity_stages = res.data.list;
            }
            this.setState({ activity_stages });
        }
    });
};

//获取活动标签
get_activity_label = () => {
    const { dispatch } = this.props;
    let { activity_labels } = this.state;
    dispatch({
        type: 'promotion/get_activity_label',
        payload: { pageSize: list_com_page_more },
        callback: (res) => {
            if (res.state == 200) {
                activity_labels = res.data.list.filter(item => item.state == 1);
            }
            this.setState({ activity_labels });
        }
    });
};

  get_list = (params,sliceNum,sliceTotal,resSliceTotal) => {
      this.setState({ loading: true });
      sliceNum==0 && message.success(`导入中...`);
      const { dispatch } = this.props;
      const { skuDateList,multiSkill,curMultiIndex } = this.state
   
      // 构造map
      let skuJson = {}
      skuDateList.forEach((item,index)=>{
          skuJson[item.sku] = {num:index,...item}
      })
   
      let dis_type = '';
      const { productIdArr } = params;
      // debugger;
      const ids = productIdArr.slice(sliceNum,sliceNum+step)
      let new_params = { skus: ids,storeId };
      dis_type = 'project/get_list_by_skus';
      dispatch({
          type: dis_type,
          payload: new_params,
          callback: async (res) => {
              // this.setState({ loading: false });
              if (res.state == 200) {
                  let dataList = res.data;
                  // 当前操作的场次数据
                  let cur = multiSkill[curMultiIndex];
                  let activityStateList = []
                  if(!cur.stageDay){
                      message.error(`请选择场次信息`,5);
                  }else{
                      // 根据日期获取已经参加活动的sku集合 手动添加为置灰
                      activityStateList = await this.hasActivityByDate([cur.stageDay])
                  }
                  dataList.forEach((item)=>{
                      if(activityStateList.includes(item.sku)){
                          item.activityState = 2
                      }else{
                          item.activityState = 1
                      }
                  })
                  //进行数据组装
                  for (let k = 0; k < dataList.length; k++) {
                      const item = dataList[k];
                      if(item.activityState==2){
                          if(skuJson[item.sku]){
                              const e = skuJson[item.sku]
                              errMsg.push(`请检查${e.num+2}行商品${e.sku}已参加其他活动`)
                          }
                      }else if(skuJson[item.sku]){
                          const ele = skuJson[item.sku]
                          if(item.activityState==1){
                              //秒杀库存和限购数量都不可以超过最大库存
                              if ((Number(ele.seckillStock) || Number(ele.upperLimit)) > (Number(item.skuStock)||1000)) {
                                  message.error(`请检查${ele.num+2}行商品${ele.sku}秒杀库存和限购数量不可以超过最大库存`,5);
                                  this.setState({ loading: false });
                                  return false
                              }
                              //秒杀价格都不可以超过商品价格
                              if (Number(ele.seckillPrice) > Number(item.salePrice)) {
                                  message.error(`请检查${ele.num+2}行商品${ele.sku}秒杀价格不可以超过商品价格`,5);
                                  this.setState({ loading: false });
                                  return false
                              }
                              //秒杀价格都不可以超过商品划线价
                              if (Number(ele.seckillPrice) > Number(ele.markingPrice)) {
                                  message.error(`请检查${ele.num+2}行商品${ele.sku}秒杀价格不可以超过商品划线价格`,5);
                                  this.setState({ loading: false });
                                  return false
                              }
                              // 限购数量都不可以超过秒杀库存
                              if (Number(ele.upperLimit) > Number(ele.seckillStock)) {
                                  message.error(`请检查${ele.num+2}行商品${ele.sku}限购数量不可以超过秒杀库存`,5);
                                  this.setState({ loading: false });
                                  return false
                              }
                              item.seckillPrice = ele.seckillPrice;
                              item.seckillStock = ele.seckillStock;
                              item.markingPrice = ele.markingPrice;
                              item.upperLimit = ele.upperLimit;
                          }

                      }else{
                          message.error(`未匹配到数据!`);
                      }
               
                  }


                  sliceNum = sliceNum+step;
                  sliceTotal = sliceTotal-1;
                  resSliceTotal = resSliceTotal.concat(dataList)
                  // debugger;
                  if( sliceTotal && (sliceTotal > 0) ){
                      this.get_list(params,sliceNum,sliceTotal,resSliceTotal);
                  }else{
                      // 核算数据
                      let errList = [];
                      if(productIdArr.length == resSliceTotal.length){
                          // 核算成功
                          if(errMsg.length>0){
                              const rdom = (<p style={{whiteSpace:'pre-line'}}>{`${errMsg.join('\n')}`}</p>)
                              //   message.error(rdom,6);
                              let that = this;
                              Modal.error({
                                  className:'comfirm_modal',
                                  content: rdom,
                                  okText:'关闭',
                                  onOk(){
                                      that.setState({ loading: false });
                                  }
                              })
                              errMsg = [];
                              //   this.setState({ loading: false });
                              return false
                          }
                          // 代表完毕
                          errMsg = []
                          this.setState({ loading: false });
              
                          // resSliceTotal = that.mergeTree(resSliceTotal,'goodsId','seckillProductVOList');
                          const key = []
                          resSliceTotal.forEach((item)=>{
                              key.push(item.sku)
                          })
                          // 上传直接覆盖
                          // 当前操作的场次数据
                          let temp = multiSkill[curMultiIndex];
                          temp.selectedRows = []
                          temp.selectedRowKeys = []
                          this.setState({
                              multiSkill
                          },()=>{this.seleGoods(resSliceTotal,key)});
                      }else{
                          // 返回的数据丢失
                          productIdArr.forEach((item,index)=>{
                              if(resSliceTotal.findIndex(e=>e.sku==item)>-1){
                                  // todo
                              }else{
                                  errList.push(`请检查${index+2}行商品${item},未匹配到数据`)
                              }
                          })
                          let that = this
                          confirm({
                              title: '以下商品未匹配到数据，是否确定继续导入?',
                              content: `${errList.join('\n')}`,
                              className:'comfirm_modal',
                              cancelText:'取消',
                              okText:'确定',
                              mask:false,
                              onOk(){
                                  if(errMsg.length>0){
                                      const rdom = (<p style={{whiteSpace:'pre-line'}}>{`${errMsg.join('\n')}`}</p>)
                                      // message.error(rdom,6);
                                      Modal.error({
                                          className:'comfirm_modal',
                                          content: rdom,
                                          okText:'关闭',
                                          onOk(){
                                              that.setState({ loading: false });
                                          }
                                      })
                                      errMsg = [];
                                      that.setState({ loading: false });
                                      return false
                                  }
                                  // 代表完毕
                                  errMsg = []
                                  that.setState({ loading: false });
                      
                                  // resSliceTotal = that.mergeTree(resSliceTotal,'goodsId','seckillProductVOList');
                                  const key = []
                                  resSliceTotal.forEach((item)=>{
                                      key.push(item.sku)
                                  })
                                  // 上传直接覆盖
                                  // 当前操作的场次数据
                                  let temp = multiSkill[curMultiIndex];
                                  temp.selectedRows = []
                                  temp.selectedRowKeys = []
                                  that.setState({
                                      multiSkill
                                  },()=>{that.seleGoods(resSliceTotal,key)});
                              },
                              onCancel() {
                                  that.setState({ loading: false });
                              }
                          });
               
                      }
                  }
            
          
              }else{
                  failTip(res.msg);
                  this.setState({ loading: false });
              }
          }
      });
  };

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
                  const {skuInfos} = res.data
                  resolve(skuInfos[0].skus||[])
              } else {
                  failTip(res.msg)
              }
          }
      })
  })

  mergeTree = (arr,key,tarKey)=>{
      let hash = {};
      let resArr = [];
      arr.forEach((item)=>{
          if(hash[ item[key] ]){
              let i = resArr.findIndex( (el)=>el[key] == item[key] );
              resArr[i][tarKey] = resArr[i][tarKey].concat(item[tarKey]);
          }else{
              hash[ item[key] ] = true
              resArr.push(item)
          }
      })
      return resArr
  }

  addMultiSkill = ()=>{
      let { multiSkill } = this.state;
      if(multiSkill.length>=5){
          failTip('已添加5个场次！');
          return false
      }
      let params = {
          uuid:guid(),
          labelId:'',
          stageId:'',
          stageDay:'',
          stageTime:'',
          selectedRows:[],
          selectedRowKeys:[]
      }
      multiSkill.push(params)
      this.setState({ multiSkill });
  }

  delMultiSkill = (index)=>{
      let { multiSkill } = this.state;
      if(multiSkill.length<=1){
          failTip('至少保留一个！');
          return false
      }
      multiSkill.splice(index,1)
      this.setState({ multiSkill });
  }

  changeInfo = (e,type,multiIndex)=>{
   
      let { multiSkill,activity_stages } = this.state;
      // 当前操作的场次数据
      let temp = multiSkill[multiIndex];
      if(type!='activityTime'){
          temp[type] = e
          if(type=='stageId'){
              const ele = activity_stages.find(item=>item.stageId==e)
              if(!!ele){
                  temp.stageDay = ele.startTime.split(' ')[0]
                  temp.stageTime = ele.startTime.split(' ')[1]
                  // 场次切换清空结束时间 ，商品
                  temp.activityTime = ''
                  temp.selectedRows = []
                  temp.selectedRowKeys = []
                  sthis.props.form.resetFields([`activityTime${temp.uuid}`]);
              }
          }
      }else{
          temp[type] = e && e.format(dateTimeFormat);
      }
      this.setState({
          multiSkill,
          curMultiIndex:multiIndex
      });
  }

  changePanel = ()=>{
      this.setState({
      
      })
  }

  //控制日历组件时间的选择范围
    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };

    //控制日历组件时间的选择范围
    disabledRangeTime = (date) => {
        let sameDay = false,
            sameHour = false;
        if (date) {
            sameDay = date.isSame(moment(), 'day')
            sameHour = date.isSame(moment(), 'hour')
        }
        if(sameDay&&sameHour){
            return {
                disabledHours: () => this.range(0, moment().hour()),
                disabledMinutes: () => this.range(0, moment().minutes())
                //   disabledSeconds: () => this.range(0, moment().seconds())
            };
        }
        if(sameDay&&!sameHour){
            return {
                disabledHours: () => this.range(0, moment().hour())
            };
        }
    };

    disabledDate = (currentDate,item)=>{
        const {stageDay} = item;
        return ( currentDate && currentDate < moment(`${stageDay} :00:00:00`).valueOf() ) || (currentDate && currentDate.valueOf() > moment(`${stageDay} :23:59:59`).valueOf()+1)
    }

    //spec_data_table 表格编辑事件
    handleFieldChange(val, fieldName, record) {
        let { curMultiIndex, multiSkill } = this.state;
        let withKey = record.withKey;
        let uuid = withKey.split('_')[1];
        let curinx = multiSkill.findIndex(el=>el.uuid==uuid)
        curMultiIndex = curinx;
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
        // 当前操作的场次数据
        let temp = multiSkill[curMultiIndex];
        let tar_sku_list = temp.selectedRows.filter(item => item.sku == record.sku);
        if (tar_sku_list.length > 0) {
            let tar_data = tar_sku_list[0];
            if (tar_data) {
                tar_data[fieldName] = val;
                this.setState({ multiSkill,curMultiIndex }, () => {
                    sthis.props.form.resetFields([`seckillStock${record.withKey}`,`upperLimit${record.withKey}`,`seckillPrice${record.withKey}`,`state${record.withKey}`]);
                });
            }
        }
    }

    render() {
        const { loading, detail, modalVisibleGoods, activity_stages, activity_labels, columns_spec,uploading,multiSkill,curMultiIndex,selectStageDay } = this.state;
        let {
            form: { getFieldDecorator }
        } = this.props;
       
        return (
            <div
                className={`${promotion.full_activity} ${promotion.seckill} ${global.common_page} ${global.com_flex_column}`}
                style={{ position: 'relative' }}
            >
                {sldLlineRtextAddGoodsAddMargin('#69A2F2', `${sldComLanguage('秒杀活动')}`, 0, 0, 10)}
                {getSldHorLine(1)}
                {sldCommonTitleByBg(`${sldComLanguage('活动基本信息')}`,'一次性最多支持添加2000个商品')}
                <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                        <div className={`${promotion.left}`}>
                            {sldComLanguage('活动名称')}
                        </div>
                        <div className={`${promotion.right} ${promotion.right_show_content}`}>
                            {detail.promotionName}
                        </div>
                    </div>
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                        <div className={`${promotion.left}`}>
                            {sldComLanguage('活动时间')}
                        </div>
                        <div className={`${promotion.right} ${promotion.right_show_content}`}>
                            {detail.startTime} ~ {detail.endTime}
                        </div>
                    </div>
                </div>
                <Spin spinning={loading}>
                    <Form layout="inline">
                        <Scrollbars
                            autoHeight
                            autoHeightMin={100}
                            autoHeightMax={document.body.clientHeight-300}
                        >
                            <Collapse defaultActiveKey={[`${multiSkill[0].uuid}`]} onChange={(key)=>{this.changePanel(key)}}>
                                { 
                                    multiSkill.map((multiItem,multiIndex)=><Panel header={<div><Tag color={multiIndex==curMultiIndex?'green':'#f50'}>活动场次{multiIndex+1}</Tag><Button style={{float:'right'}} icon="delete" size="small" onClick={(e)=>{e.stopPropagation();this.delMultiSkill(multiIndex)}}>删除该场次</Button></div>} key={multiItem.uuid}>
                                        <div className={`${global.goods_sku_tab} ${global.add_goods_wrap}`} style={{paddingBottom:'45px'}}>
                                            {/* 基本信息-start */}
                                            <div>
                                                {getSldEmptyH(10)}
                                                {/* {sldCommonTitleByBg(`${sldComLanguage('活动基本信息')}`)} */}
                                                <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                                                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                        <div className={`${promotion.left}`}>
                                                            <span style={{ color: 'red' }}>*</span>{sldComLanguage('活动场次')}
                                                        </div>
                                                        <div className={`${promotion.right}`}>
                                                            <FormItem>
                                                                {getFieldDecorator(`stageId${multiItem.uuid}`, {
                                                                    rules: [{
                                                                        required: true,
                                                                        message: `${sldComLanguage('请选择活动场次')}`
                                                                    }]
                                                                })(
                                                                    <Select
                                                                        placeholder={`${sldComLanguage('请选择活动场次')}`}
                                                                        style={{ width: 300 }}
                                                                        onChange={(e) => this.changeInfo(e, 'stageId',multiIndex)}
                                                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                                                    >
                                                                        {activity_stages.map((item, index) => <Option
                                                                            key={index}
                                                                            value={item.stageId}
                                                                        >{item.stageName}</Option>)}
                                                                    </Select>,
                                                                )}
                                                            </FormItem>
                                                        </div>
                                                    </div>

                                                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                        <div className={`${promotion.left}`}>
                                                            <span style={{ color: 'red' }} />{sldComLanguage('活动标签')}
                                                        </div>
                                                        <div className={`${promotion.right}`}>
                                                            <FormItem>
                                                                {getFieldDecorator(`labelId${multiItem.uuid}`, {
                                                                    rules: [{
                                                                        required: false,
                                                                        message: `${sldComLanguage('请选择活动标签')}`
                                                                    }]
                                                                })(
                                                                    <Select
                                                                        placeholder={`${sldComLanguage('请选择活动标签')}`}
                                                                        style={{ width: 300 }}
                                                                        onChange={(e) => this.changeInfo(e, 'labelId',multiIndex)}
                                                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                                                    >
                                                                        {activity_labels.map((item, index) => <Option
                                                                            key={index}
                                                                            value={item.labelId}
                                                                        >{item.labelName}</Option>)}
                                                                    </Select>,
                                                                )}
                                                            </FormItem>
                                                        </div>
                                                    </div>

                                                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                        <div className={`${promotion.left}`}>
                                                            {sldComLanguage('商品秒杀结束时间')}
                                                        </div>
                                                        <div className={`${promotion.right}`}>
                                                            <FormItem
                                                                extra={`${sldComLanguage('设置后商品的秒杀结束时间以设置时间为准，若未设置秒杀时间，则本场秒杀结束时，商品同时结束秒杀。')}`}
                                                                style={{ width: 300 }}
                                                            >
                                                                {getFieldDecorator(`activityTime${multiItem.uuid}`,{
                                                                    rules: [{
                                                                        validator: (rule, value, callback) => {
                                                                            const {stageDay,stageTime} = multiItem;
                                                                        
                                                                            if (!value) {
                                                                                callback();
                                                                                return 
                                                                            }
                                                                            if(value > moment(`${stageDay} ${stageTime}`).valueOf()){
                                                                                callback();
                                                                            }else{
                                                                                callback('结束时间应该大于该场次时间');
                                                                            }
                                                                        }
                                                                    }]
                                                                })(
                                                                    <DatePicker
                                                                        disabledDate={(currentDate)=>this.disabledDate(currentDate,multiItem)}
                                                                        // disabledTime={this.disabledRangeTime}
                                                                        showTime
                                                                        disabled={multiItem.stageId?false:true}
                                                                        style={{ width: '100%' }}
                                                                        placeholder={`${sldComLanguage('请选择商品秒杀结束时间')}`}
                                                                        onChange={(e) => this.changeInfo(e, 'activityTime',multiIndex)} 
                                                                        getCalendarContainer={(triggerNode)=>triggerNode.parentNode}
                                                                    />,
                                                                )}
                                                            </FormItem>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* 基本信息-end */}

                                            {getSldEmptyH(20)}
                                            <div className={`${global.flex_row_start_center} ${promotion.add_new}`}>
                                                {sldIconBtn(() => this.addGoods(multiIndex), `${sldComLanguage('添加活动商品')}`, 7, 7)}
                                                <Button onClick={()=>{this.downFile()}} style={{marginRight:'10px'}}>下载模板</Button>
                                                <Upload {...this.upProps} disabled={multiItem.stageId?false:true} style={{marginRight:'10px'}}>
                                                    <Button loading={uploading} onClick={()=>{this.upLoad(multiIndex,multiItem.stageId)}}>点击上传</Button>
                                                </Upload>
                                                <span className={`${promotion.add_new_tip}`}>{sldComLanguage('提醒：至少添加一个商品,已参加其他平台活动或其他秒杀场次的商品不可参与该活动,上传最多1000条,导入会覆盖前一次数据')}</span>
                                            </div>
                                            <Form onSubmit={() => this.handleSaveAllData()} layout="inline">
                                                <List
                                                    itemLayout="vertical"
                                                    pagination={multiItem.selectedRows.length==0?false:{
                                                        size:"small",
                                                        pageSize:5
                                                    }}
                                                    dataSource={multiItem.selectedRows}
                                                    renderItem={(item,index)=><List.Item key={index}>
                                                        <div className={`${promotion.sele_goods}`}>
                                                            <img
                                                                onClick={() => this.delSpu(item.sku,multiIndex)}
                                                                className={promotion.del_spu}
                                                                src={require('../../../assets/del_seckill_goods.png')}
                                                            />
                                                            <div className={`${promotion.goods_info} ${global.flex_row_between_start}`}>
                                                                <div className={`${promotion.goods_info_left} ${global.flex_row_start_start}`}>
                                                                    <div className={`${promotion.goods_img_wrap} ${global.flex_row_center_center}`}>
                                                                        <img className={`${promotion.goods_img}`} src={item.mainImage} />
                                                                    </div>
                                                                    <p className={`${promotion.goods_name}`}>{item.skuName}</p>
                                                                </div>
                                                                {/* <div className={`${promotion.goods_info_right} ${global.flex_row_end_end}`}>
                          <Popconfirm
                            title={<InputNumber
                              min={0.01}
                              max={9999999}
                              precision={2}
                              style={{ width: '100%' }}
                              value={battchVal}
                              onChange={e => this.handleFieldBattchChange(e, 'seckillPrice', item)}
                            />}
                            onConfirm={(e) => {
                              this.batchConfirm(e, 'seckillPrice', item);
                            }}
                          >
                            <div className={`${promotion.batch_btn} ${global.flex_row_center_center}`}>{sldComLanguage('批量设置秒杀价')}</div>
                          </Popconfirm>
                          <Popconfirm
                            title={<InputNumber
                              min={1}
                              max={99999999}
                              precision={0}
                              style={{ width: '100%' }}
                              value={battchVal}
                              onChange={e => this.handleFieldBattchChange(e, 'seckillStock', item)}
                            />}
                            onConfirm={(e) => {
                              this.batchConfirm(e, 'seckillStock', item);
                            }}
                          >
                            <div className={`${promotion.batch_btn} ${global.flex_row_center_center}`}>{sldComLanguage('批量设置秒杀库存')}</div>
                          </Popconfirm>
                          <Popconfirm
                            title={<InputNumber
                              min={0}
                              max={99999999}
                              precision={0}
                              style={{ width: '100%' }}
                              value={battchVal}
                              onChange={e => this.handleFieldBattchChange(e, 'upperLimit', item)}
                            />}
                            onConfirm={(e) => {
                              this.batchConfirm(e, 'upperLimit', item);
                            }}
                          >
                            <div className={`${promotion.batch_btn} ${global.flex_row_center_center}`}>{sldComLanguage('批量设置限购数量')}</div>
                          </Popconfirm>
                          <div className={`${promotion.batch_btn} ${global.flex_row_center_center}`}><Checkbox
                            indeterminate = {item.indeterminate}
                            checked={item.checkAll}
                            onChange={(e) => {
                              this.setAll(e, item);
                            }}><span className={`${promotion.sel_all}`}>{sldComLanguage('全部参与')}</span></Checkbox></div>
                        </div> */}
                                                            </div>
                                                            <Scrollbars
                                                                autoHeight
                                                                autoHeightMax={300}
                                                            >
                                                                <Table
                                                                    rowKey="withKey"
                                                                    pagination={false}
                                                                    columns={columns_spec}
                                                                    dataSource={[item]}
                                                                    size="small"
                                                                />
                                                            </Scrollbars>
                                                        </div></List.Item>}
                                                />
                                            </Form>
                                        </div>
                                    </Panel>)
             
                                }
                            </Collapse>
                            <div>
                                <Button type="dashed" icon="plus" style={{width:'500px',margin:'8px auto',display:'block'}} onClick={()=>{this.addMultiSkill()}}>
                   添加活动场次
                                </Button>
                            </div>

                            {getSldEmptyH(15)}
                            <div
                                className={global.m_diy_bottom_wrap}
                                style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}
                            >
                                <div onClick={() => this.props.history.goBack()} className={global.add_goods_bottom_btn}>
                                    {sldComLanguage('返回')}
                                </div>
                                <div
                                    onClick={() => this.props.form.submit(this.handleSaveAllData)}
                                    className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}
                                >
                                    提交审核
                                </div>
                            </div>
                        </Scrollbars>
                    </Form>
                </Spin>

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
                    selectStageDay={selectStageDay}
                />
                {/*商品多选的modal框-end*/}
            </div>
        );
    }
}
