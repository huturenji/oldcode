/*
* 新建签到活动
* */
import { connect } from 'dva/index';
import React, { Component,Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, Input, DatePicker, Button,Switch,Radio,Icon,Select,InputNumber, Popconfirm } from 'antd';
import moment from 'moment';
import _cloneDeep from 'lodash/cloneDeep';
import {
    failTip,
    sucTip,
    sldLlineRtextAddGoodsAddMargin,
    sldComLanguage,
    getSldHorLine,
    sldCommonTitleByBg,
    dateFormat,
    getSldEmptyH,
    isEmpty,
    guid,
    toChinesNum
} from '@/utils/utils';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import _style from './css/index.less';
import SldSelGoodsSingleDiy from '@/components/SldSelGoodsSingleDiy';

let sthis = '';
const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
let link_type_map = {
    '1':'signCoupon',
    '2':'redPacket'
}
// eslint-disable-next-line no-shadow
@connect(({ sign_manage, global }) => ({
    sign_manage, global
}))
@Form.create()
export default class AddSign extends Component {
    key = 1;

    constructor(props) {
        super(props);
        sthis = this;
        this.state = {
            query: props.location.query,
            detail: {},//活动详情数据
            viewFlag: props.location.query.tar != undefined && props.location.query.tar == 'view' ? true : false, //查看标识
            link_type: '', // 奖品类型弹窗模态框
            loading: false,
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            
            daySignFlag: false, //每日签到是否开启 
            addDaySignFlag: false, //累计签到是否开启
            addDaySignSequenceFlag: false, //连续签到是否开启
            daySignInfo: {
                sendType:'', // 1优惠券 2 红包 3 积分  有 sendType  不一定有sendCoupons或者sendRedpackets
                sendCoupons:null,
                sendRedpackets:null,
                sendIntegral:null //积分数量
            }, //每日签到的信息
            addDaySignLadder: [
                {
                    key: guid(),
                    sendType:'', 
                    sendCoupons:null,
                    sendRedpackets:null,
                    sendIntegral:null,
                    cumulativeRange:'1', // 1 等于  2 大于等于   这个目前要一致
                    dayNum:'' // 签到天数
                }
            ], //累计签到的信息
            addDaySignSequence: [
                {
                    key: guid(),
                    sendType:'', 
                    sendCoupons:null,
                    sendRedpackets:null,
                    sendIntegral:null,
                    cumulativeRange:'1', // 1 等于  2 大于等于   这个目前要一致
                    dayNum:'' // 签到天数
                }
            ], //连续签到的信息
            currentSignType:'', //当前操作的签到类型  
            currentKey:'' // 累计签到和连续签到 当前操作的的项

        };
    }

    componentDidMount() {
        const { query } = this.state;
        if (query.id != undefined && query.id > 0) {
            this.get_detail(query.id);
        }
        this.props.dispatch({
            type: 'global/getLayoutCollapsed'
        });
    }

    componentWillUnmount() {
    }

  //获取详情
  get_detail = (id) => {
      const { dispatch } = this.props;
      let { daySignInfo,addDaySignLadder,addDaySignSequence } = this.state
      let _daySignInfo = _cloneDeep(daySignInfo)
      let _addDaySignLadder = _cloneDeep(addDaySignLadder)
      let _addDaySignSequence = _cloneDeep(addDaySignSequence)
      dispatch({
          type: 'sign_manage/detail',
          payload: { signActivityId: id },
          callback: (res) => {
              if (res.state == 200) {
                  const {
                      signActivityId,
                      signActivityName,
                      startTime,
                      endTime,
                      description,
                      signRuleVOList

                  } = res.data
                  daySignInfo = {}
                  addDaySignLadder = []
                  signRuleVOList.forEach((item)=>{
                      if(item.oneLevelType==1){
                          daySignInfo.sendType = !isEmpty(item.couponList)?'1':!isEmpty(item.redpacketList)?'2':'3'
                          daySignInfo.sendCoupons = isEmpty(item.couponList)?null:{...item.couponList[0]}
                          daySignInfo.sendRedpackets = isEmpty(item.redpacketList)?null:{...item.redpacketList[0]}
                          daySignInfo.sendIntegral = isEmpty(item.sendIntegral)?null:item.sendIntegral
                      }else if (item.oneLevelType==2 && item.twoLevelType==2){
                          addDaySignLadder.push({
                              key:guid(),
                              sendType:!isEmpty(item.couponList)?'1':!isEmpty(item.redpacketList)?'2':'3',
                              sendCoupons : isEmpty(item.couponList)?null:{...item.couponList[0]},
                              sendRedpackets : isEmpty(item.redpacketList)?null:{...item.redpacketList[0]},
                              sendIntegral:isEmpty(item.sendIntegral)?null:item.sendIntegral,
                              cumulativeRange:item.cumulativeRange,
                              dayNum:item.ruleValue
                          })
                      } else if (item.oneLevelType==2 && item.twoLevelType==1) {
                          addDaySignSequence.push({
                              key:guid(),
                              sendType:!isEmpty(item.couponList)?'1':!isEmpty(item.redpacketList)?'2':'3',
                              sendCoupons : isEmpty(item.couponList)?null:{...item.couponList[0]},
                              sendRedpackets : isEmpty(item.redpacketList)?null:{...item.redpacketList[0]},
                              sendIntegral:isEmpty(item.sendIntegral)?null:item.sendIntegral,
                              cumulativeRange:item.cumulativeRange,
                              dayNum:item.ruleValue
                          })
                      }
                  })
                  
                  this.setState({
                      detail:{
                          signActivityId,
                          signActivityName,
                          startTime,
                          endTime,
                          description
                      },
                      daySignFlag:isEmpty(daySignInfo) ? false:true,
                      addDaySignFlag:isEmpty(addDaySignLadder) ? false:true,
                      addDaySignSequenceFlag:isEmpty(addDaySignSequence) ? false:true,
                      daySignInfo:isEmpty(daySignInfo) ? _daySignInfo:daySignInfo,
                      addDaySignLadder:isEmpty(addDaySignLadder)?_addDaySignLadder:addDaySignLadder,
                      addDaySignSequence:isEmpty(addDaySignSequence)?_addDaySignSequence:addDaySignSequence
                      
                  });
              }
          }
      });
  };


  //保存并新增事件
  handleSaveAllData = () => {
      const { dispatch } = this.props;
      const { query,daySignFlag, addDaySignFlag ,addDaySignSequenceFlag,daySignInfo,addDaySignLadder,addDaySignSequence } = this.state;
      this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              let params = {};
              //活动时间处理
              params.startTime = values.activityTime[0] ? `${values.activityTime[0].format(dateFormat)} 00:00:00` : '';
              params.endTime = values.activityTime[1] ? `${values.activityTime[1].format(dateFormat)} 23:59:59` : '';

              //签到周期开始时间必须小于结束时间
              if (Date.parse(params.startTime) >= Date.parse(params.endTime)) {
                  failTip(`${sldComLanguage('开始时间必须小于结束时间')}～`);
                  return false;
              }
              let dateInterval = Math.ceil((Date.parse(params.endTime) - Date.parse(params.startTime))/1000/60/60/24)
              // 名称
              params.signActivityName = values.signActivityName
              // 规则
              params.description = values.description
              
              let signRuleAddVOList = []
              // 每日签到
              if(daySignInfo.sendType && daySignFlag){
                  let keysMap = {
                      '1':'sendCoupons',
                      '2':'sendRedpackets',
                      '3':'sendIntegral'
                  }
                  let textMap = {
                      '1':'优惠券',
                      '2':'红包',
                      '3':'积分'
                  }
                  let key = keysMap[daySignInfo.sendType]
                  let text = textMap[daySignInfo.sendType]
                  if(isEmpty(daySignInfo[key])){
                      failTip(`${text}不能为空～`);
                      return false;
                  }
                  let daySignParams = {
                      oneLevelType:1,
                      sendCouponIds:isEmpty(daySignInfo.sendCoupons)?null:daySignInfo.sendCoupons.couponId ,
                      sendRedpacketIds:isEmpty(daySignInfo.sendRedpackets)?null:daySignInfo.sendRedpackets.redpacketId,
                      sendIntegral:isEmpty(daySignInfo.sendIntegral)?null : daySignInfo.sendIntegral,
                      twoLevelType:1
                  }
                  signRuleAddVOList.push(daySignParams)
              }
              
              // 累计签到
              let cumulativeRangeArr = [] //规则 整个list要一致
              let dayNumArr = [] // 天数要递增
              if(addDaySignFlag){
                  for (let index = 0; index < addDaySignLadder.length; index++) {
                      const ele = addDaySignLadder[index];
                      if(ele.sendType){
                          let keysMap = {
                              '1':'sendCoupons',
                              '2':'sendRedpackets',
                              '3':'sendIntegral'
                          }
                          let textMap = {
                              '1':'优惠券',
                              '2':'红包',
                              '3':'积分'
                          }
                          let key = keysMap[ele.sendType]
                          let text = textMap[ele.sendType]
                          if(isEmpty(ele[key])){
                              failTip(`${text}不能为空～`);
                              return false;
                          }
  
                          let itemParams = {
                              oneLevelType:2,
                              sendCouponIds:isEmpty(ele.sendCoupons)?null : ele.sendCoupons.couponId,
                              sendRedpacketIds:isEmpty(ele.sendRedpackets)?null : ele.sendRedpackets.redpacketId,
                              twoLevelType:2,
                              cumulativeRange:ele.cumulativeRange,
                              ruleValue:ele.dayNum,
                              sendIntegral:isEmpty(ele.sendIntegral)?null : ele.sendIntegral
                          }
                          cumulativeRangeArr.push(ele.cumulativeRange)
                          if (ele.dayNum > dateInterval) {
                              failTip(`累计签到天数不能超过活动周期～`);
                              return false;
                          }
                          dayNumArr.push(ele.dayNum)
                          // 检查cumulativeRange 要一致
                          const allEqual = cumulativeRangeArr.every(val=>val==cumulativeRangeArr[0])
                          if(!allEqual){
                              failTip(`等于或者大于等于规则要一致～`);
                              return false;
                          }
                          // 检查 dayNum 是否递增
                          let dayNumArrCopy = _cloneDeep(dayNumArr)
                          let dayNumArrSort = dayNumArrCopy.sort((a,b)=>a-b)
                          let uniqueArray = dayNumArrCopy.filter((item, index1, array) => array.indexOf(item) === index1)
                          if(dayNumArr.join(',')!=dayNumArrSort.join(',')){
                              failTip(`检查累计签到规则天数要递增～`);
                              return false;
                          }
                          if(uniqueArray.join(',')!=dayNumArr.join(',')){
                              failTip(`累计签到规则天数不能相等～`);
                              return false;
                          }
                          signRuleAddVOList.push(itemParams)
                      }
                  
                  }
              }

              // 连续签到
              let cumulativeRangeArr1 = [] //规则 整个list要一致
              let dayNumArr1 = [] // 天数要递增
              if(addDaySignSequenceFlag){
                  for (let index = 0; index < addDaySignSequence.length; index++) {
                      const ele = addDaySignSequence[index];
                      if(ele.sendType){
                          let keysMap = {
                              '1':'sendCoupons',
                              '2':'sendRedpackets',
                              '3':'sendIntegral'
                          }
                          let textMap = {
                              '1':'优惠券',
                              '2':'红包',
                              '3':'积分'
                          }
                          let key = keysMap[ele.sendType]
                          let text = textMap[ele.sendType]
                          if(isEmpty(ele[key])){
                              failTip(`${text}不能为空～`);
                              return false;
                          }
  
                          let itemParams = {
                              oneLevelType:2,
                              sendCouponIds:isEmpty(ele.sendCoupons)?null : ele.sendCoupons.couponId,
                              sendRedpacketIds:isEmpty(ele.sendRedpackets)?null : ele.sendRedpackets.redpacketId,
                              twoLevelType:1,
                              cumulativeRange:ele.cumulativeRange,
                              ruleValue:ele.dayNum,
                              sendIntegral:isEmpty(ele.sendIntegral)?null : ele.sendIntegral
                          }
                          cumulativeRangeArr1.push(ele.cumulativeRange)
                          if (ele.dayNum > dateInterval) {
                              failTip(`连续签到天数不能超过活动周期～`);
                              return false;
                          }
                          dayNumArr1.push(ele.dayNum)
                          // 检查cumulativeRange 要一致
                          const allEqual = cumulativeRangeArr1.every(val=>val==cumulativeRangeArr1[0])
                          if(!allEqual){
                              failTip(`等于或者大于等于规则要一致～`);
                              return false;
                          }
                          // 检查 dayNum 是否递增
                          let dayNumArrCopy = _cloneDeep(dayNumArr1)
                          let dayNumArrSort = dayNumArrCopy.sort((a,b)=>a-b)
                          let uniqueArray = dayNumArrCopy.filter((item, index1, array) => array.indexOf(item) === index1)
                          if(dayNumArr1.join(',')!=dayNumArrSort.join(',')){
                              failTip(`检查连续签到规则天数要递增～`);
                              return false;
                          }
                          if(uniqueArray.join(',')!=dayNumArr1.join(',')){
                              failTip(`连续签到规则天数不能相等～`);
                              return false;
                          }
                          signRuleAddVOList.push(itemParams)
                      }
                  
                  }
              }
              if(signRuleAddVOList.length==0){
                  failTip(`请配置奖励设置规则～`);
                  return false
              }
              params.signRuleAddVOList = signRuleAddVOList

              sthis.setState({ loading: true });
              let dis_type = '';
              if (query.id != undefined && query.tar == 'edit') {
                  //编辑签到
                  params.signActivityId = query.id;
                  dis_type = 'sign_manage/edit';
              } else {
                  //新增签到
                  dis_type = 'sign_manage/add';
              }
              dispatch({
                  type: dis_type,
                  payload: params,
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


  //radio开关事件
  handleSwitch = (e, type) => {
      this.setState({ [type]: e });
  };


  //选择优惠券取消事件
  sldHandleLinkCancle = () => {
      this.setState({ link_type: '' });
  };

  //优惠券选中事件
  seleSku = (val) => {
      let { link_type,currentSignType,currentKey,daySignInfo,addDaySignLadder,addDaySignSequence } = this.state;
      let sends 
      if(isEmpty(val)){
          failTip('请选择数据！')
          this.setState({ link_type: '' });
          return false
      } 
      // 优惠券
      if(link_type == link_type_map['1']){
          sends = {
              sendCoupons:val,
              sendRedpackets:null,
              sendIntegral:null
          }
      }
      // 红包
      if(link_type== link_type_map['2']){
          sends = {
              sendCoupons:null,
              sendRedpackets:val,
              sendIntegral:null
          }
      }
      
      // 为对应的数据源赋值
      // 日签
      if(currentSignType =='daySign' ){
          Object.assign(daySignInfo,sends) 
          this.setState({
              daySignInfo
          })
      }
      // 累计签到  
      if(currentSignType =='addDaySign' ){
          let tar_data = addDaySignLadder.filter(item => item.key == currentKey)[0];
          if(tar_data){
              Object.assign(tar_data,sends)
          }
          this.setState({
              addDaySignLadder
          })
      }

      // 连续签到  
      if(currentSignType =='addDaySignSequence' ){
          let tar_data = addDaySignSequence.filter(item => item.key == currentKey)[0];
          if(tar_data){
              Object.assign(tar_data,sends)
          }
          this.setState({
              addDaySignSequence
          })
      }

      this.setState({ link_type: '' });
  };
  
  // 删除选择的物品  type:daySign || addDaySign
  delSend = (type,key,sendTypeKey)=>{
      let { daySignInfo,addDaySignLadder,addDaySignSequence } = this.state;
      // 日签
      if(type =='daySign' ){
          daySignInfo[sendTypeKey] = null
          this.setState({
              daySignInfo
          })
      }
      let tempData = []
      // 累计签到  累计签到需要 currentKey
      if(type =='addDaySign' ){
          tempData = addDaySignLadder
      }
      // 连续签到  
      if (type == 'addDaySignSequence') {
          tempData = addDaySignSequence
      }
      let tar_data = tempData.filter(item => item.key == key)[0];
      if(tar_data){
          tar_data[sendTypeKey] = null
      }
      this.setState([tempData])
  }

  // 添加累计签到
  addDaySign = ()=>{
      let { addDaySignLadder } = this.state;
      addDaySignLadder.push({
          key: guid(),
          sendType:'', 
          sendCoupons:null,
          sendRedpackets:null,
          sendIntegral:null,
          cumulativeRange:'1', // 1 等于  2 大于等于   这个目前要一致
          dayNum:'' // 签到天数
      });
      this.key += 1;
      this.setState({ addDaySignLadder });
  }

  // 删除累计签到
  delAddDaySign = (key) => {
      let { addDaySignLadder } = this.state;
      addDaySignLadder = addDaySignLadder.filter(item => item.key != key);
      this.setState({ addDaySignLadder: JSON.parse(JSON.stringify(addDaySignLadder)) });
  };

  // 添加连续签到
  addDaySignSequenceFun = ()=>{
      let { addDaySignSequence } = this.state;
      addDaySignSequence.push({
          key: guid(),
          sendType:'', 
          sendCoupons:null,
          sendRedpackets:null,
          sendIntegral:null,
          cumulativeRange:'1', // 1 等于  2 大于等于   这个目前要一致
          dayNum:'' // 签到天数
      });
      this.key += 1;
      this.setState({ addDaySignSequence });
  }

  // 删除连续签到
  delDaySignSequence = (key) => {
      let { addDaySignSequence } = this.state;
      addDaySignSequence = addDaySignSequence.filter(item => item.key != key);
      this.setState({ addDaySignSequence: JSON.parse(JSON.stringify(addDaySignSequence)) });
  };
  
  // 选择计算方式 
  select = (key,value,dataType)=>{
      let { addDaySignLadder,addDaySignSequence } = this.state;
      let tempData = []
      if (dataType == 'addDaySignLadder') {
          tempData = addDaySignLadder
      } else if (dataType == 'addDaySignSequence') {
          tempData = addDaySignSequence
      }
      let tar_data = tempData.filter(item => item.key == key)[0];
      if(tar_data){
          tar_data['cumulativeRange'] = value
      }
      this.setState([tempData])
      
  }

  // 填写天数
  dayNumChange = (key,value,keyValue,dataType)=>{
      let { daySignInfo,addDaySignLadder,addDaySignSequence } = this.state;
      let tempData = []
      if(dataType =='daySign' ){
          daySignInfo[keyValue] = value
          this.setState({
              daySignInfo
          })
      } else if (dataType == 'addDaySignLadder') {
          tempData = addDaySignLadder
      } else if (dataType == 'addDaySignSequence') {
          tempData = addDaySignSequence
      }
      let tar_data = tempData.filter(item => item.key == key)[0];
      if(tar_data){
          tar_data[keyValue] = value
      }
      this.setState([tempData])
      
  }
  
  
  // 切换奖励类型  type:daySign || addDaySign
  sendTypeChange = (e,type,key)=>{
      let { daySignInfo,addDaySignLadder,addDaySignSequence } = this.state;
      let params = {
          sendType:e
      }
      let tempData = []
      // 日签
      if(type =='daySign' ){
          if (e == '3') {
              daySignInfo.sendCoupons = null
              daySignInfo.sendRedpackets = null
          }
          Object.assign(daySignInfo,params)
          this.setState({
              daySignInfo
          })
      }
      // 累计签到  累计签到需要 currentKey
      if(type =='addDaySign' ){
          tempData = addDaySignLadder
      }
      if (type == 'addDaySignSequence') {
          tempData = addDaySignSequence

      }
      let tar_data = tempData.filter(item => item.key == key)[0];
      if(tar_data){
          if (e == '3') {
              tar_data.sendCoupons = null
              tar_data.sendRedpackets = null
          }
          Object.assign(tar_data,params)
      }
      this.setState({
          currentSignType : type,
          currentKey      : key || '',
          link_type       : link_type_map[e],
          [tempData]:tempData
      })
  }

  //验证活动时间，不可超过30天
  validateActivityTime = (rule, value, callback) => {
      if (value.length == 2 && (value[1].unix() * 1 - value[0].unix() * 1 > 30 * 24 * 60 * 60)) {
          callback(sldComLanguage('签到周期不可以超过30天'));
      } else {
          callback();
      }
  };

  render() {
      const { 
          loading, detail, link_type, viewFlag, daySignFlag,addDaySignFlag,addDaySignSequenceFlag,addDaySignLadder,daySignInfo,addDaySignSequence,
          selectedRows,selectedRowKeys,query:{tar}
        
      } = this.state;
      //   console.log('orige1',daySignInfo)
      //   console.log('orige2',addDaySignLadder)
      let {
          form: { getFieldDecorator }
      } = this.props;
      const disabledDate = (currentDate) => currentDate && currentDate < moment().subtract(1, 'days');

      const radioStyle = {
          display: 'block',
          height: '30px',
          lineHeight: '30px'
      };
      return (
          <div
              className={`${promotion.full_activity} ${global.common_page} ${global.com_flex_column}`}
              style={{ position: 'relative' }}
          >
              {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${tar=='edit'?'编辑':'新建'}签到活动`, 0, 0, 10)}
              {getSldHorLine(1)}
              <Spin spinning={loading}>
                  <Form layout="inline">
                      <Scrollbars
                          autoHeight
                          autoHeightMin={100}
                          autoHeightMax={document.body.clientHeight - 160}
                      >
                          <div className={`${global.goods_sku_tab} ${global.add_goods_wrap}`}>
                              <div>
                                  {getSldEmptyH(10)}
                                  {sldCommonTitleByBg(`${sldComLanguage('规则设置')}`)}
                                  <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>

                                      <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                          <div className={`${promotion.left}`}>
                                              <span style={{ color: 'red' }}>*</span>活动名称
                                          </div>
                                          <div className={`${promotion.right} ${global.flex_column_start_start}`}>
                                              <FormItem
                                                  style={{ width: 300 }}
                                                  extra="最多输入20字"
                                              >
                                                  {getFieldDecorator('signActivityName', {
                                                      initialValue: detail.signActivityName, rules: [{
                                                          required: true,
                                                          message: '请输入活动名称'
                                                      }]
                                                  })(
                                                      <Input
                                                          maxLength={20}
                                                          style={{ minHeight: 32, width: 450 }}
                                                          placeholder='请输入活动名称'
                                                      />,
                                                  )}
                                              </FormItem>

                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                          <div className={`${promotion.left}`}>
                                              <span style={{ color: 'red' }}>*</span>活动日期
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              <FormItem
                                                  extra="活动时间默认为开始日期的00:00:00至结束日期的23:59:59"
                                                  style={{ width: 300 }}
                                              >
                                                  {getFieldDecorator('activityTime', {
                                                      initialValue: detail.startTime != undefined && detail.startTime
                                                          ? [moment(detail.startTime, dateFormat), moment(detail.endTime, dateFormat)]
                                                          : '', rules: [{
                                                          required: true,
                                                          message: '请选择活动日期'
                                                      }]
                                                  })(
                                                      <RangePicker
                                                          disabledDate={disabledDate}
                                                          disabled={viewFlag}
                                                          style={{ width: 400 }}
                                                          placeholder={['开始日期', '结束日期']}
                                                          getCalendarContainer={(triggerNode) => triggerNode.parentNode}
                                                      />,
                                                  )}
                                              </FormItem>
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                          <div className={`${promotion.left}`}>
                                              <span style={{ color: 'red' }}>*</span>活动规则
                                          </div>
                                          <div className={`${promotion.right} ${global.flex_column_start_start}`}>
                                              <FormItem
                                                  style={{ width: 300 }}
                                                  extra="最多输入5000字"
                                              >
                                                  {getFieldDecorator('description', {
                                                      initialValue: detail.description, rules: [{
                                                          required: true,
                                                          message: '请输入活动规则'
                                                      }]
                                                  })(
                                                      <TextArea
                                                          maxLength={5000}
                                                          style={{ minHeight: 32, width: 450 }}
                                                          autoSize={{ minRows:6,maxRows:10}}
                                                          placeholder='请输入活动规则'
                                                      />,
                                                  )}
                                              </FormItem>

                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                          <div className={`${promotion.left}`}>
                                              <span style={{ color: 'red' }}>*</span>奖励设置
                                          </div>
                                          <div className={`${promotion.right} ${global.flex_column_start_start}`}>
                                              <div>
                                                  <FormItem
                                                      style={{ width: 300 }}
                                                  >
                                                      <span style={{marginRight:'20px',color:'#222',fontWeight:'bold'}}>当日签到</span>
                                                      {getFieldDecorator('daySignFlag', { initialValue: daySignFlag, valuePropName: 'checked' })(
                                                          <Switch
                                                              disabled={viewFlag}
                                                              onChange={(e) => this.handleSwitch(e, 'daySignFlag')}
                                                              className={`${_style['switch_radio']}`}
                                                          >
                                                          </Switch>,
                                                      )}
                                                  </FormItem>
                                                  {getSldEmptyH(10)}
                                                  {
                                                      daySignFlag && 
                                                    <FormItem
                                                        style={{ width: 300 }}
                                                    >
                                                        {getFieldDecorator('sendType', {
                                                            initialValue: daySignInfo.sendType||undefined,
                                                            rules: [{
                                                                required: true,
                                                                message: `${sldComLanguage('该项必填')}`
                                                            }]
                                                        })(
                                                            <Radio.Group onChange={(e)=>this.sendTypeChange(e.target.value,'daySign')}>
                                                                <Radio value="1" style={radioStyle}>平台优惠券</Radio>
                                                                {
                                                                    daySignInfo.sendCoupons&&
                                                                    <div>
                                                                        <div className={`${_style['send_item']}`}>
                                                                            <span className={`${_style['left']}`}>{daySignInfo.sendCoupons.couponName}</span>
                                                                            <Icon type="delete" onClick={()=>this.delSend('daySign',null,'sendCoupons')} className={`${_style['right']}`} />
                                                                        </div>
                                                                    </div>
                                                                }
                                                                {
                                                                    daySignInfo.sendType==1 &&
                                                                    <div onClick={()=>this.sendTypeChange('1','daySign')} className={`${_style['reselect']}`}>{`${daySignInfo.sendCoupons?'重新':''}`}选择</div>
                                                                }
                                                                <Radio value="2" style={radioStyle}>红包</Radio>
                                                                {
                                                                    daySignInfo.sendRedpackets&&
                                                                    <div>
                                                                        <div className={`${_style['send_item']}`}>
                                                                            <span className={`${_style['left']}`}>{daySignInfo.sendRedpackets.redpacketName}</span>
                                                                            <Icon type="delete" onClick={()=>this.delSend('daySign',null,'sendRedpackets')} className={`${_style['right']}`} />
                                                                        </div>
                                                                    </div>
                                                                }
                                                                {
                                                                    daySignInfo.sendType==2 &&
                                                                    <div onClick={()=>this.sendTypeChange('2','daySign')} className={`${_style['reselect']}`}>{`${daySignInfo.sendRedpackets?'重新':''}`}选择</div>
                                                                }
                                                                <Radio value="3" style={radioStyle}>积分</Radio>
                                                                {daySignInfo.sendType==3 && <div>
                                                                    <FormItem
                                                                        style={{ width: 80,marginLeft:'8px' }}
                                                                        extra=""
                                                                    >
                                                                        {getFieldDecorator(`sendIntegral_${daySignInfo}`, {
                                                                            initialValue: daySignInfo.sendIntegral||undefined, rules: [{
                                                                                required: true,
                                                                                message: '请输入积分数量'
                                                                            }]
                                                                        })(
                                                                            <InputNumber
                                                                                className={`${_style['input_number']}`}
                                                                                placeholder='请输入积分数量'
                                                                                min={1}
                                                                                step={1}
                                                                                precision={0}
                                                                                onChange={(value)=>this.dayNumChange(daySignInfo.key,value,'sendIntegral','daySign')}
                                                                            />,
                                                                        )}
                                                                    </FormItem>
                                                                </div>}
                                                            </Radio.Group>
                                                        )}
                                                    </FormItem>
                                                  }
                                              </div>
                                              {getSldEmptyH(10)}
                                              <div>
                                                  <FormItem
                                                      style={{ width: 300 }}
                                                  >
                                                      <span style={{marginRight:'20px',color:'#222',fontWeight:'bold'}}>累计签到</span>
                                                      {getFieldDecorator('addDaySignFlag', { initialValue: addDaySignFlag, valuePropName: 'checked' })(
                                                          <Switch
                                                              disabled={viewFlag}
                                                              onChange={(e) => this.handleSwitch(e, 'addDaySignFlag')}
                                                              className={`${_style['switch_radio']}`}
                                                          >
                                                          </Switch>,
                                                      )}
                                                  </FormItem>
                                                  {getSldEmptyH(10)}
                                                  {
                                                      addDaySignFlag && 
                                                      <Fragment>
                                                          {addDaySignLadder.map((item,index)=>(
                                                              <div key={item.key}>
                                                                  <div className={`${_style['add_day_title']}`} style={{marginTop:'10px'}}>
                                                                      <span className={`${_style['title_left']}`}>{`${toChinesNum(index+1)}`}级奖励规则</span>
                                                                      {
                                                                          (addDaySignLadder.length>1) && <Icon type="close-circle" onClick={()=>this.delAddDaySign(item.key)} className={`${_style['title_right']}`} />
                                                                      }
                                                                  </div>
                                                                  <div>
                                                                      <span className={`${_style['label']}`}>累计签到天数</span>
                                                                      <Select defaultValue={String(item.cumulativeRange)} style={{ width: 120 }} onSelect={(value)=>this.select(item.key,value,'addDaySignLadder')}>
                                                                          <Option value="1">等于</Option>
                                                                          <Option value="2">大于等于</Option>
                                                                      </Select>
                                                                      <FormItem
                                                                          style={{ width: 80,marginLeft:'8px' }}
                                                                          extra=""
                                                                      >
                                                                          {getFieldDecorator(`ruleValue_${item.key}`, {
                                                                              initialValue: item.dayNum||undefined, rules: [{
                                                                                  required: true,
                                                                                  message: '请输入签到天数'
                                                                              }]
                                                                          })(
                                                                              <InputNumber
                                                                                  className={`${_style['input_number']}`}
                                                                                  placeholder='请输入签到天数'
                                                                                  min={1}
                                                                                  max={365}
                                                                                  step={1}
                                                                                  precision={0}
                                                                                  onChange={(value)=>this.dayNumChange(item.key,value,'dayNum','addDaySignLadder')}
                                                                              />,
                                                                          )}
                                                                      </FormItem>
                                                                  </div>
                                                                  <div style={{display:'flex'}}>
                                                                      <span className={`${_style['extra_label']}`}>可得奖励</span>
                                                                      <FormItem
                                                                          style={{ width: '90%' }}
                                                                          key={item.key}
                                                                      >
                
                                                                          {getFieldDecorator(`sendType_${item.key}`, {
                                                                              initialValue: item.sendType||undefined,
                                                                              rules: [{
                                                                                  required: true,
                                                                                  message: `${sldComLanguage('该项必填')}`
                                                                              }]
                                                                          })(
                                                                              <Radio.Group onChange={(e)=>this.sendTypeChange(e.target.value,'addDaySign',item.key)}>
                                                                                  <Radio value="1" style={radioStyle}>平台优惠券</Radio>
                                                                                  {
                                                                                      item.sendCoupons&&
                                                                                    <div>
                                                                                        <div className={`${_style['send_item']}`}>
                                                                                            
                                                                                            <span className={`${_style['left']}`}>{item.sendCoupons.couponName}</span>
                                                                                            <Icon type="delete" onClick={()=>this.delSend('addDaySign',item.key,'sendCoupons')} className={`${_style['right']}`} />
                                                                                        </div>
                                                                                    </div>
                                                                                  }
                                                                                  {
                                                                                      item.sendType ==1 &&
                                                                                  <div onClick={()=>this.sendTypeChange('1','addDaySign',item.key)} className={`${_style['reselect']}`}>{`${item.sendCoupons?'重新':''}`}选择</div>
                                                                                  }
                                                                                  <Radio value="2" style={radioStyle}>红包</Radio>
                                                                                  {
                                                                                      item.sendRedpackets&&
                                                                                  <div>
                                                                                      <div className={`${_style['send_item']}`}>
                                                                                          
                                                                                          <span className={`${_style['left']}`}>{item.sendRedpackets.redpacketName}</span>
                                                                                          <Icon type="delete" onClick={()=>this.delSend('addDaySign',item.key,'sendRedpackets')} className={`${_style['right']}`} />
                                                                                      </div>
                                                                                  </div>
                                                                                  }
                                                                                  {
                                                                                      item.sendType==2 &&
                                                                                  <div onClick={()=>this.sendTypeChange('2','addDaySign',item.key)} className={`${_style['reselect']}`}>{`${item.sendRedpackets?'重新':''}`}选择</div>
                                                                                  }
                                                                                  <Radio value="3" style={radioStyle}>积分</Radio>
                                                                                  {item.sendType==3 && <div style={{marginBottom:'16px'}}>
                                                                                      <FormItem
                                                                                          style={{ width: 80,marginLeft:'8px' }}
                                                                                          extra=""
                                                                                      >
                                                                                          {getFieldDecorator(`sendIntegral_${item.key}`, {
                                                                                              initialValue: item.sendIntegral||undefined, rules: [{
                                                                                                  required: true,
                                                                                                  message: '请输入积分数量'
                                                                                              }]
                                                                                          })(
                                                                                              <InputNumber
                                                                                                  className={`${_style['input_number']}`}
                                                                                                  placeholder='请输入积分数量'
                                                                                                  min={1}
                                                                                                  step={1}
                                                                                                  precision={0}
                                                                                                  onChange={(value)=>this.dayNumChange(item.key,value,'sendIntegral','addDaySignLadder')}
                                                                                              />,
                                                                                          )}
                                                                                      </FormItem>
                                                                                  </div>}
                                                                              </Radio.Group>
                                                                          )}
                                                                      </FormItem>
                                                                  </div>
                                                              </div>
                                                          ))}
                                                          <Button onClick={()=>this.addDaySign()} style={{marginTop:'8px'}}>添加累计签到奖励</Button>
                                                      </Fragment>
                                                  }
                            
                                              </div>
                                              {getSldEmptyH(10)}
                                              <div>
                                                  <FormItem
                                                      style={{ width: 300 }}
                                                  >
                                                      <span style={{marginRight:'20px',color:'#222',fontWeight:'bold'}}>连续签到</span>
                                                      {getFieldDecorator('addDaySignSequenceFlag', { initialValue: addDaySignSequenceFlag, valuePropName: 'checked' })(
                                                          <Switch
                                                              disabled={viewFlag}
                                                              onChange={(e) => this.handleSwitch(e, 'addDaySignSequenceFlag')}
                                                              className={`${_style['switch_radio']}`}
                                                          >
                                                          </Switch>,
                                                      )}
                                                  </FormItem>
                                                  {getSldEmptyH(10)}
                                                  {
                                                      addDaySignSequenceFlag && 
                                                      <Fragment>
                                                          {addDaySignSequence.map((item)=>(
                                                              <div key={item.key}>
                                                                  <div className={`${_style['add_day_title']}`} style={{height:'20px',justifyContent:'flex-end',marginTop:'10px'}}>
                                                                      {
                                                                          (addDaySignSequence.length>1) && <Icon type="close-circle" onClick={()=>this.delDaySignSequence(item.key)} className={`${_style['title_right']}`} />
                                                                      }
                                                                  </div>
                                                                  <div>
                                                                      <span className={`${_style['label']}`}>连续签到类型</span>
                                                                      <Radio.Group>
                                                                          <Radio defaultChecked disabled style={radioStyle}>周期型</Radio>   
                                                                      </Radio.Group>
                                                                  </div>
                                                                  <div>
                                                                      <span className={`${_style['label']}`}>连续签到天数</span>
                                                                      <Select defaultValue={String(item.cumulativeRange)} style={{ width: 120 }} onSelect={(value)=>this.select(item.key,value,'addDaySignSequence')}>
                                                                          <Option value="1">等于</Option>
                                                                          <Option value="2">大于等于</Option>
                                                                      </Select>
                                                                      <FormItem
                                                                          style={{ width: 80,marginLeft:'8px' }}
                                                                          extra=""
                                                                      >
                                                                          {getFieldDecorator(`ruleValue_${item.key}`, {
                                                                              initialValue: item.dayNum||undefined, rules: [{
                                                                                  required: true,
                                                                                  message: '请输入签到天数'
                                                                              }]
                                                                          })(
                                                                              <InputNumber
                                                                                  className={`${_style['input_number']}`}
                                                                                  placeholder='请输入签到天数'
                                                                                  min={1}
                                                                                  max={365}
                                                                                  step={1}
                                                                                  precision={0}
                                                                                  onChange={(value)=>this.dayNumChange(item.key,value,'dayNum','addDaySignSequence')}
                                                                              />,
                                                                          )}
                                                                      </FormItem>
                                                                  </div>
                                                                  <div style={{display:'flex'}}>
                                                                      <span className={`${_style['extra_label']}`}>可得奖励</span>
                                                                      <FormItem
                                                                          style={{ width: '90%' }}
                                                                          key={item.key}
                                                                      >
                
                                                                          {getFieldDecorator(`sendType_${item.key}`, {
                                                                              initialValue: item.sendType||undefined,
                                                                              rules: [{
                                                                                  required: true,
                                                                                  message: `${sldComLanguage('该项必填')}`
                                                                              }]
                                                                          })(
                                                                              <Radio.Group onChange={(e)=>this.sendTypeChange(e.target.value,'addDaySignSequence',item.key)}>
                                                                                  <Radio value="1" style={radioStyle}>平台优惠券</Radio>
                                                                                  {
                                                                                      item.sendCoupons&&
                                                                                    <div>
                                                                                        <div className={`${_style['send_item']}`}>
                                                                                            
                                                                                            <span className={`${_style['left']}`}>{item.sendCoupons.couponName}</span>
                                                                                            <Icon type="delete" onClick={()=>this.delSend('addDaySignSequence',item.key,'sendCoupons')} className={`${_style['right']}`} />
                                                                                        </div>
                                                                                    </div>
                                                                                  }
                                                                                  {
                                                                                      item.sendType ==1 &&
                                                                                  <div onClick={()=>this.sendTypeChange('1','addDaySignSequence',item.key)} className={`${_style['reselect']}`}>{`${item.sendCoupons?'重新':''}`}选择</div>
                                                                                  }
                                                                                  <Radio value="2" style={radioStyle}>红包</Radio>
                                                                                  {
                                                                                      item.sendRedpackets&&
                                                                                  <div>
                                                                                      <div className={`${_style['send_item']}`}>
                                                                                          
                                                                                          <span className={`${_style['left']}`}>{item.sendRedpackets.redpacketName}</span>
                                                                                          <Icon type="delete" onClick={()=>this.delSend('addDaySignSequence',item.key,'sendRedpackets')} className={`${_style['right']}`} />
                                                                                      </div>
                                                                                  </div>
                                                                                  }
                                                                                  {
                                                                                      item.sendType==2 &&
                                                                                  <div onClick={()=>this.sendTypeChange('2','addDaySignSequence',item.key)} className={`${_style['reselect']}`}>{`${item.sendRedpackets?'重新':''}`}选择</div>
                                                                                  }
                                                                                  <Radio value="3" style={radioStyle}>积分</Radio>
                                                                                  {item.sendType==3 && <div style={{marginBottom:'16px'}}>
                                                                                      <FormItem
                                                                                          style={{ width: 80,marginLeft:'8px' }}
                                                                                          extra=""
                                                                                      >
                                                                                          {getFieldDecorator(`sendIntegral_${item.key}`, {
                                                                                              initialValue: item.sendIntegral||undefined, rules: [{
                                                                                                  required: true,
                                                                                                  message: '请输入积分数量'
                                                                                              }]
                                                                                          })(
                                                                                              <InputNumber
                                                                                                  className={`${_style['input_number']}`}
                                                                                                  placeholder='请输入积分数量'
                                                                                                  min={1}
                                                                                                  step={1}
                                                                                                  precision={0}
                                                                                                  onChange={(value)=>this.dayNumChange(item.key,value,'sendIntegral','addDaySignSequence')}
                                                                                              />,
                                                                                          )}
                                                                                      </FormItem>
                                                                                  </div>}
                                                                              </Radio.Group>
                                                                          )}
                                                                      </FormItem>
                                                                  </div>
                                                              </div>
                                                          ))}
                                                          <Button onClick={()=>this.addDaySignSequenceFun()} style={{marginTop:'8px'}}>添加连续签到奖励</Button>
                                                      </Fragment>
                                                  }
                            
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          {getSldEmptyH(15)}
                          <div
                              className={global.m_diy_bottom_wrap}
                              style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}
                          >
                              <Button onClick={() => this.props.history.goBack()} style={{marginRight:20}}>返回</Button>
                              {
                                  !viewFlag &&
                                <Popconfirm
                                    title="是否提交审核?"
                                    onConfirm={() => this.props.form.submit(this.handleSaveAllData)}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Button style={{marginRight:20}} type='primary'>提交审核</Button>
                                </Popconfirm>
                              }
                          </div>
                      </Scrollbars>
                  </Form>
              </Spin>

              <SldSelGoodsSingleDiy
                  link_type={link_type}
                  seleSku={this.seleSku}
                  sldHandleCancle={this.sldHandleLinkCancle}
                  client="mobile"
                  selectedRows={selectedRows}
                  selectedRowKeys={selectedRowKeys}
              />

          </div>
      );
  }
}
