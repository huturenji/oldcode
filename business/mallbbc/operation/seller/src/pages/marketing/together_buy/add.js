/*
* 参加一起买活动
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, InputNumber, Tooltip,message,Modal,Button,Spin,Table,Upload,Popconfirm } from 'antd';
import XLSX from 'xlsx';
import {
    sucTip,
    failTip,
    sldLlineRtextAddGoodsAddMargin,
    sldComLanguage,
    sldSvgIcon,
    downLoad_front,
    isObjArrRepeat,
    getStorage,
    isEmpty,
    getTableNum,
    hasAuth
} from '@/utils/utils';
import moment from 'moment';
import _groupBy from 'lodash/groupBy'
import _chunk from 'lodash/chunk';
import _uniq from 'lodash/uniq';
import _orderBy from 'lodash/orderBy';

import global from '@/global.less';
import _styles from './index.less';
import SldSelMoreLeftRightSeckillGoods from '@/components/SldSelMoreLeftRightTogetherBuyGoods';

const { confirm } = Modal;
let sthis = '';
const storeId = getStorage('storeId');
const FormItem = Form.Item;
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
                      title: '活动日期',
                      dataIndex: 'activityDate',
                      align: 'center',
                      width: 100,
                      filters: [],
                      onFilter: (value, record) => record.activityDate.indexOf(value) === 0
                  },
                  {
                      title: '活动场次',
                      dataIndex: 'activitySession',
                      align: 'center',
                      width: 100,
                      filters: [],
                      onFilter: (value, record) => record.activitySession.indexOf(value) === 0
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
                      title:'结算价',
                      dataIndex: 'supplierSettlePrice',
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
                          <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>拼团价
                      </div>,
                      dataIndex: 'promotionPrice',
                      align: 'center',
                      width: 100,
                      render: (text, record) => (
                          <FormItem
                              style={{ width: '100%' }}
                          >
                              {getFieldDecorator(`promotionPrice${record.withKey}`, {
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
                                      onChange={e => this.handleFieldChange(e, 'promotionPrice', record)}
                                  />,
                              )}
                          </FormItem>
                      )
                  },
                  {
                      title: <div style={{ position: 'relative' }}>
                          <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>实际成团件数
                      </div>,
                      dataIndex: 'lowestStock',
                      align: 'center',
                      width: 100,
                      render: (text, record) => (
                          <FormItem
                              style={{ width: '100%' }}
                          >
                              {getFieldDecorator(`lowestStock${record.withKey}`, {
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
                                      onChange={e => this.handleFieldChange(e, 'lowestStock', record)}
                                  />,
                              )}
                          </FormItem>
                      )
                  },
                  {
                      title: <div style={{ position: 'relative' }}>
                          <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>成团件数
                      </div>,
                      dataIndex: 'wishStock',
                      align: 'center',
                      width: 100,
                      render: (text, record) => (
                          <FormItem
                              style={{ width: '100%' }}
                          >
                              {getFieldDecorator(`wishStock${record.withKey}`, {
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
                                      onChange={e => this.handleFieldChange(e, 'wishStock', record)}
                                  />,
                              )}
                          </FormItem>
                      )
                  },
                  {
                      title: <div style={{ position: 'relative' }}>
                          <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>限购件数
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
              filterActivityDateList:[], // 过滤用
              filterActivitySessionList:[], //过滤用
              detail:{}, // 活动详情信息
              uploading:false, 
              originData:[],
              dataList:[],  
              activityStateList:[], //已参加其他活动的sku
              stageMap:{}, // {2022-09-22_08:00 : 19}
              page:{
                  current:1,
                  pageSize:10
              }     
          };
      }

      componentDidMount() {
          const { query } = this.state;
          if (query.id != undefined) {
              // 获取活动详情
              this.get_detail(query.id);
              // 获取场次信息, 为导入的数据加上场次id
              this.buyTogetherStageList(query.id)
          }
          
      }

      componentWillUnmount() {
      }


  //保存并新增事件
  handleSaveAllData = () => {
      const { dispatch } = this.props;
      const { detail,originData} = this.state;
      const {promotionId,promotionName} = detail
      this.props.form.validateFieldsAndScroll((err) => {
          if (!err) {
              let sendParams = {}
              let stageAndskuList = []
              let tipsInfo = []
              let sendData = _groupBy(originData,'stageId')
             
              Object.keys(sendData).forEach((item)=>{
                  let productInfoList = []
                  let stage_sku = sendData[item]
                  // 取第一项提取公共参数
                  const {stageId,startTime,endTime} = stage_sku[0]
                  let _stageParams = {
                      stageId,
                      startTime,
                      endTime
                  }
                  stage_sku.forEach((skus)=>{
                      const {activityDate,activitySession,sku,skuName,mainImage,salePrice,markingPrice,promotionPrice,lowestStock,wishStock,upperLimit} = skus
                      let arrinfo = []
                      if(isEmpty(markingPrice)){
                          arrinfo.push(`划线价为必填`)
                      }
                      if(isEmpty(promotionPrice)){
                          arrinfo.push(`拼团价为必填`)
                      }
                      if(isEmpty(lowestStock)){
                          arrinfo.push(`实际成团件数为必填`)
                      }
                      if(isEmpty(wishStock)){
                          arrinfo.push(`成团件数为必填`)
                      }
                      if(isEmpty(upperLimit)){
                          arrinfo.push(`限购件数为必填`)
                      }
                      if(Number(promotionPrice)>Number(markingPrice)){
                          arrinfo.push(`商品划线价不能小于拼团价`)
                      }
                      if(arrinfo.length>0){
                          let info = arrinfo.join(',')
                          tipsInfo.push(`日期${activityDate}场次${activitySession},商品${sku},${info}`)
                      }
                      productInfoList.push({
                          sku,
                          skuName,
                          salePrice:salePrice,
                          markingPrice,
                          promotionPrice,
                          lowestStock,
                          wishStock,
                          upperLimit
                      })
                  })
                  _stageParams.productInfoList = productInfoList
                  stageAndskuList.push(_stageParams)
              })
              sendParams.promotionId = promotionId
              sendParams.promotionName = promotionName
              sendParams.stageInfoList = stageAndskuList

              if(tipsInfo.length>0){
                  const rdom = (<p style={{whiteSpace:'pre-line'}}>{`${tipsInfo.join('\n')}`}</p>)
                  message.error(rdom,6);
                  tipsInfo = [];
                  return false;
              }
              sthis.setState({ uploading: true });
              dispatch({
                  type: 'promotion/add_buyTogetherProduct',
                  payload: sendParams,
                  callback: (res) => {
                      sthis.setState({ uploading: false });
                      if (res.state == 200) {
                          sucTip("提交成功");
                          setTimeout(() => {
                              sthis.props.history.goBack();
                          }, 500);
                      } else {
                          failTip(res.msg);
                      }
                  }
              });
          }
      });
  };

  sldHandleCancle = () => {
      this.setState({ modalVisibleGoods: false });
  };

  delItem = (record)=>{
      let { originData } = this.state
      originData = originData.filter(item=>item.withKey!=record.withKey)
      this.setState({
          originData
      })
  }

  //商品多选-回调事件
  seleGoods = (selectedRowsP, selectedRowKeysP,activityDate) => {
      let { originData } = this.state
     
      // 找到当天的集合看sku是否重复，重复此条数据直接放弃 ,如果没有重复找到当天的场次的位置 ，把数据追加放进去
      // 如果原数据没有今天的场次 则加进去
      // 我们通过withKey判断是否重复，然后追加到后面，再排序
      selectedRowsP = selectedRowsP.filter((item)=>{
          const list = originData.find(el=>el.withKey==item.withKey)
          return list?false:true
      })
      originData = originData.concat(selectedRowsP)
      originData = _orderBy(originData,['activityDate','activitySession'])
      this.setState({
          originData
      })

      this.sldHandleCancle();
  };

  downFile = () =>{
      downLoad_front('together_buy')
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
      const { stageMap } = this.state
      try {
          if(!!jsonData.length && jsonData.length > 0){
              // 整合商品详情的入参
              let _skuList = [];
              // 正整数
              let reg = /^[1-9]\d*$/
              for(let index = 0; index < jsonData.length; index++) {
                  const ele = jsonData[index];
                  if(Array.isArray(ele)&&ele.length>0){
                      if(index==1){
                          if(ele[0]!='*活动日期'){
                              message.error('活动日期项错误,请按格式重新上传!');
                              return false
                          }
                          if(ele[1]!='*活动场次'){
                              message.error('活动场次项错误,请按格式重新上传!');
                              return false
                          }
                          if(ele[2]!='商品名称'){
                              message.error('商品名称项错误,请按格式重新上传!');
                              return false
                          }
                          if(ele[3]!='*商品SKU'){
                              message.error('商品SKU项错误,请按格式重新上传!');
                              return false
                          }
                          if(ele[4]!='*划线价'){
                              message.error('划线价项错误,请按格式重新上传!');
                              return false
                          }
                          if(ele[5]!='*拼团价'){
                              message.error('拼团价项错误,请按格式重新上传!');
                              return false
                          }
                          if(ele[6]!='*实际成团件数'){
                              message.error('实际成团件数项错误,请按格式重新上传!');
                              return false
                          }
                          if(ele[7]!='*成团件数'){
                              message.error('成团件数项错误,请按格式重新上传!');
                              return false
                          }
                          if(ele[8]!='*每人限购件数'){
                              message.error('每人限购件数项错误,请按格式重新上传!');
                              return false
                          }
                      }else if(index>=2){
                          let _params = {}
                          // 活动日期
                          if( ele[0] && ( moment(ele[0]).isValid() ) ){
                              _params.activityDate = moment(ele[0]).format('YYYY-MM-DD')
                          }else{
                              message.error(`解析失败,请检查第${index+1}行活动日期数据`,5);
                              return false;
                          }
                          // 活动场次
                          if( ele[1] && ( /^(0[0-9]|1[0-9]|2[0-3]):00$/.test( ele[1] ) ) ){
                              _params.activitySession = ele[1]
                          }else{
                              message.error(`解析失败,请检查第${index+1}行活动场次数据`,5);
                              return false;
                          }

                          // 商品名 不要导入的

                          // 商品SKU
                          if( ele[3] && (/^[A-Za-z0-9]+$/.test( ele[3] )) ){
                              _params.sku = ele[3]
                          }else{
                              message.error(`解析失败,请检查第${index+1}行商品SKU数据`,5);
                              return false;
                          }
                          
                          // 划线价
                          // eslint-disable-next-line no-restricted-globals
                          if( ele[4] && (!isNaN(parseInt(ele[4]))) ){
                              _params.markingPrice = ele[4]
                          }else{
                              message.error(`解析失败,请检查第${index+1}行划线价数据`,5);
                              return false;
                          }
                          // 拼团价
                          // eslint-disable-next-line no-restricted-globals
                          if( ele[5] && (!isNaN(parseInt(ele[5]))) ){
                              _params.promotionPrice = ele[5]
                          }else{
                              message.error(`解析失败,请检查第${index+1}行拼团价数据`,5);
                              return false;
                          }
                          // 实际成团件数
                          // eslint-disable-next-line no-restricted-globals
                          if( ele[6] && reg.test(ele[6]) ){
                              _params.lowestStock = ele[6]
                          }else{
                              message.error(`解析失败,请检查第${index+1}行实际成团件数据`,5);
                              return false;
                          }
                          // 成团件数
                          // eslint-disable-next-line no-restricted-globals
                          if( ele[7] && reg.test(ele[7]) ){
                              _params.wishStock = ele[7]
                          }else{
                              message.error(`解析失败,请检查第${index+1}行成团件数数据`,5);
                              return false;
                          }
                          // 每人限购件数
                          // eslint-disable-next-line no-restricted-globals
                          if( ele[8] && reg.test(ele[8]) ){
                              _params.upperLimit = ele[8]
                          }else{
                              message.error(`解析失败,请检查第${index+1}行每人限购件数数据`,5);
                              return false;
                          }
                          // moment(endTime).diff(moment(startTime),'minutes' )  计算时间差  
                          if( moment(`${_params.activityDate} ${_params.activitySession}`).diff(moment(), 'minutes')>30 && stageMap[`${_params.activityDate}_${_params.activitySession}`] ){
                              _params.withKey = `${_params.activityDate}_${_params.activitySession}_${_params.sku}` 
                              _params.excelIndex = index+1
                              _skuList.push(_params)
                          }else{
                              // 时间场次已经过去的或者即将过去(距离开始还有30分钟)的和瞎填的场次直接过滤
                          } 
                          
                      }
                  }
              }
            
              if(_skuList.length==0){
                  message.error(`请检查导入数据及场次信息!`);
                  return false
              }
              if(_skuList.length>1000){
                  message.error(`最多支持导入1000条数据`);
                  return false
              }
              // 对导入的数据规整一遍 按日期和场次升序排列
              _skuList = _orderBy(_skuList,['activityDate','activitySession'])
              // 按日期进行分组，_skuList的伴随分组 ,用来辅助判断 同一日期内 sku不能重复
              let _calssByDate = _groupBy(_skuList,'activityDate')
              console.log('_calssByDate',_calssByDate)
              let dateList = Object.keys(_calssByDate)

              for (let index = 0; index < dateList.length; index++) {
                  const date = dateList[index];
                  const ele = _calssByDate[date]
                  if(isObjArrRepeat(ele,'sku')){
                      message.error(`日期${date}内存在重复项sku数据`,5);
                      return false;
                  }
              }
              // 根据日期获取已经参加活动的sku集合 手动添加为置灰
              let activityStateList = await this.hasActivityByDate(dateList)
            
              // 如果某一日期下 存在已有活动的sku,需要过滤出来 遇见即返回
              if(activityStateList.length>0){
                  for (let index = 0; index < activityStateList.length; index++) {
                      const item = activityStateList[index];
                      const inList = _calssByDate[item.date]
                      if(inList){
                          const ele = inList.find((e)=>item.skus.includes(e.sku))
                          if(ele){
                              message.error(`请检查商品${ele.sku}在${item.date}已参加其他活动`);
                              return false;
                          }
                      }
                      
                  }
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
     headers: { Authorization: 'SID' }, 
     showUploadList: false,
     beforeUpload: this.beforeUploadFun
 }

   //获取详情
   get_detail = (id) => {
       const { dispatch } = this.props;
       dispatch({
           type: 'promotion/get_buyTogether_detail',
           payload: { promotionId: id }, //promotionId
           callback: (res) => {
               if (res.state == 200) {
                   this.setState({
                       detail:res.data
                   });
               } else {
                   failTip(res.msg);
               }
           }
       });
   };

   //获取场次信息，为导入的信息赋值 场次id 
   buyTogetherStageList = (id) => {
       const { dispatch } = this.props;
       const { columns } = this.state;
       dispatch({
           type: 'project/get_buyTogether_stage',
           payload: { promotionId: id}, // 1-全部 2-未开始的 3-已经有商品参加的场次
           callback: (res) => {
               if (res.state == 200) {
                   //    let buyTogetherStageGroupList = [
                   //        {
                   //            "day": "10-21",
                   //            "date":"2022-10-21",
                   //            "buyTogetherStageVOList":[
                   //                {
                   //                    "stageId":123,
                   //                    "state":1, //1-未开始 2-进行中 3-已结束
                   //                    "stageContent":"19:00",
                   //                    "startTime":"2022-10-21 19:00:00",
                   //                    "endTime":"2022-10-21 20:00:00"
                   //                }
                   //            ]
                   //        }
                   //    ]
                   let stageMap = {}
                   let filterActivityDateList = []
                   let filterActivitySessionList = []
                   res.data.buyTogetherStageGroupList.forEach((item,index)=>{
                       let key = item.stageDate
                       let dayparams = {
                           text: item.stageDate,
                           value: item.stageDate
                       }
                       filterActivityDateList.push(dayparams)
                       if(index==0){
                           item.buyTogetherStageVOList.forEach((ele)=>{
                               let stageParms = {
                                   text: ele.stageContent,
                                   value: ele.stageContent
                               }
                               filterActivitySessionList.push(stageParms)
                           })
                       }
                       item.buyTogetherStageVOList.forEach((el)=>{
                           stageMap[`${key}_${el.stageContent}`] = {
                               stageId:el.stageId,
                               startTime:el.startTime,
                               endTime:el.endTime
                           }
                       })
                   })
                   const [,dateCol,sessionCol] = columns
                   dateCol.filters = filterActivityDateList
                   sessionCol.filters = filterActivitySessionList
                   console.log('stageMap',stageMap)
                   this.setState({
                       stageMap,
                       columns
                   });
               } else {
                   failTip(res.msg);
               }
           }
       });
   };

   // 导入切片
   get_goods_list_all =async (imSkuList)=>{
       //导入直接置空
       this.setState({ uploading: true, originData:[] });
       message.success(`导入中...`)

       let skuList = []
       imSkuList.forEach((item)=>{
           skuList.push(item.sku)
       })
       // 对sku进行去重处理,导入数据的sku今天和明天是可以重复的,根据sku查信息，没必要查两次
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
       const { stageMap } = this.state
       let checkInfo = []
       for (let index = 0; index < imSkuList.length; index++) {
           const item = imSkuList[index];
           const stageInfo = stageMap[`${item.activityDate}_${item.activitySession}`]
           item.stageId = stageInfo.stageId
           item.startTime = stageInfo.startTime
           item.endTime = stageInfo.endTime
           let ele = resTotalList.find((e)=>e.sku==item.sku)
           if(ele){
               // 一起买价大于销售价
               if(Number(item.promotionPrice)>Number(ele.salePrice)){
                   checkInfo.push(`第${item.excelIndex}行拼团价大于销售价`)
                   return checkInfo
               }
               // 一起买价大于划线价
               if(Number(item.promotionPrice)>Number(item.markingPrice)){
                   checkInfo.push(`第${item.excelIndex}行拼团价大于划线价`)
                   return checkInfo
               }
               // 实际成团件数大于成团件数
               if(Number(item.lowestStock)>Number(item.wishStock)){
                   checkInfo.push(`第${item.excelIndex}行实际成团件数大于成团件数`)
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
                   //    let skuInfos = [{exactDate:'2022-10-20',skuList:['JD10000533636355','JD10000533']}]
                   resolve(res.data.skuInfos||[])
               } else {
                   failTip(res.msg)
               }
           }
       })
   })

   getDate = (date)=>{
       if(isEmpty(date)){
           return ''
       }
       let dateArr = date.split(' ')
       return dateArr[0]
   }

   handleFieldChange(val, fieldName, record) {
       let { originData } = this.state;

       //拼团价格不可以超过商品价格
       if (fieldName == 'promotionPrice' && Number(val) > Number(record.salePrice)) {
           val = record.salePrice;
       }
       //实际成团件数要小于成团件数
       if ((fieldName == 'lowestStock') && Number(val) > Number(record.wishStock)) {
           val = record.wishStock;
       }
       //实际成团件数要小于成团件数
       if ((fieldName == 'wishStock') && Number(val) < Number(record.lowestStock)) {
           val = record.lowestStock;
       }
   
       // 当前操作的数据
       let tar_item = originData.filter(item => item.withKey == record.withKey);
       if (tar_item.length > 0) {
           let tar_data = tar_item[0];
           if (tar_data) {
               tar_data[fieldName] = val;
               this.setState({ originData }, () => {
                   sthis.props.form.resetFields([`promotionPrice${record.withKey}`,`lowestStock${record.withKey}`,`wishStock${record.withKey}`,`upperLimit${record.withKey}`]);
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
       const { detail,modalVisibleGoods,uploading,columns,originData } = this.state;
    
       return (
           <div
               className={`${global.common_page} ${global.com_flex_column}`}
               style={{ position: 'relative' }}
           >
               {sldLlineRtextAddGoodsAddMargin('#69A2F2', `${sldComLanguage('一起买活动')}`, 0, 0, 10)}
               <div className={`${_styles['content_des']}`}>
                   <div className={`${_styles['des_item']}`}><span className={`${_styles['des_item_title']}`}>活动名称：</span> <span className={`${_styles['des_item_content']}`}>{detail.promotionName}</span></div>
                   <div className={`${_styles['des_item']}`}><span className={`${_styles['des_item_title']}`}>活动时间：</span> <span className={`${_styles['des_item_content']}`}>{this.getDate(detail.startTime)}~{this.getDate(detail.endTime)}</span></div>
                   <div className={`${_styles['des_item']}`}><span className={`${_styles['des_item_title']}`}>活动场次：</span> <span className={`${_styles['des_item_content']}`}>{detail.stageHourTimeList && detail.stageHourTimeList.join(',')}</span></div>
                   <div className={`${_styles['des_item']}`}><span className={`${_styles['des_item_title']}`}>场次时长：</span> <span className={`${_styles['des_item_content']}`}>{detail.duration}小时</span></div>
                   <div className={`${_styles['des_item']}`}><span className={`${_styles['des_item_title']}`}>活动状态：</span> <span className={`${_styles['des_item_content']}`}>{detail.state==1?'未开始':'进行中'}</span></div>
               </div>
               <div style={{marginBottom:'10px'}}>
                   <Upload {...this.upProps} disabled={uploading} style={{marginRight:'8px'}}>
                       <Button loading={uploading} type='primary'>上传文件</Button>
                   </Upload>
                   <Button onClick={()=>{this.downFile()}} style={{marginRight:'8px'}}>下载模板</Button>
                   <Button onClick={()=>{this.addGoods()}} style={{marginRight:'8px'}}>添加商品</Button>
               </div>
               <Spin spinning={uploading}>
                   <Scrollbars
                       autoHeight
                       autoHeightMin={100}
                       autoHeightMax={document.body.clientHeight-270}
                   >
                       <Table 
                           rowKey="withKey"
                           columns={columns}
                           dataSource={originData}
                           size="small"
                           pagination={this.pagination}
                       />
                   </Scrollbars>
                   
               </Spin>
               <div
                   className={global.m_diy_bottom_wrap}
                   style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}
               >
                   <div onClick={() => this.props.history.goBack()} className={global.add_goods_bottom_btn}>
                       {sldComLanguage('取消')}
                   </div>
                   {hasAuth('together_buy_unattend_add')&&<div
                       onClick={() => this.props.form.submit(this.handleSaveAllData)}
                       className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}
                   >
                       {sldComLanguage('提交审核')}
                   </div>}
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
               />
               {/*商品多选的modal框-end*/}
           </div>
       );
   }
}
