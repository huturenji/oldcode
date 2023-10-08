import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, Input, InputNumber, Radio, DatePicker, Table, Empty,Select,Popconfirm,Checkbox,TimePicker,Icon } from 'antd';
import {
    guid,
    failTip,
    sucTip,
    sldLlineRtextAddGoodsAddMargin,
    sldComLanguage,
    dateTimeFormat,
    sldCommonTitleByBg,
    getSldHorLine,
    getSldEmptyH,
    getAuthBtn,
    isNotEmpty
} from '@/utils/utils';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import ALibbSvg from '@/components/ALibbSvg';
import SelectMemberPop from '@/components/SelectMemberPop';
import AuthBtn from '@/components/AuthBtn';
import moment from 'moment';
import _cloneDeep from 'lodash/cloneDeep';
import {num2week,week2num,hasselectWeek,leaveWeek,myweekAndleaveWeek,checkSubset,checkTime} from './enum';

let btnAuth = getAuthBtn();
let sthis = '';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const format = 'HH:mm';
// eslint-disable-next-line no-shadow
@connect(({ promotion,conscoupon, global }) => ({
    promotion,conscoupon, global
}))
@Form.create()
export default class AddCoupon extends Component {

sele_more_members = {
    info: [],//选择的会员数组
    ids: [],//选择的会员id数组
    min_num: 1,//最小数量，0为不限制
    max_num: 10000//最多选择10000个
};

constructor(props) {
    super(props);
    sthis = this;
    this.state = {
        link_data:{url_type:'',url:'',info:''},
        link_type:'',
        enableFlag: 0,//消费券开关
        isFirstLoading: true,//是否第一次加载
        coupon_detail: {},//消费券详情
        checkedCatIds: [],//选择的分类id数组
        useTimeType: 1,//使用时间类型
        curCouponType: 1,//当前选择的消费券类型
        sle_more_title: '',//选择商品的标题
        sle_member_title: '',//选择会员的title
        modalVisibleGoods: false,
        modalVisibleMember: false,
        query: props.location.query,
        loading: false,
        selectedRows: [],
        selectedRowKeys: [],//selectedRows的key
        selectedMemberRows: [], //选中的指定会员
        selectedMemberRowKeys: [],//选中的指定会员id
        publishType: 1,//获取方式，1为免费领取，3为活动赠送，5为指定会员发放
        columns_member: [
            {
                title: '序号',
                dataIndex: 'key',
                align: 'center',
                width: 56,
                render: (text, record, index) => index + 1
            },
            {
                title: '会员名',
                dataIndex: 'memberName',
                align: 'center',
                width: 100
            },
            {
                title: '会员ID',
                dataIndex: 'memberId',
                align: 'center',
                width: 100
            },

            {
                title: `${sldComLanguage('手机号')}`,//手机号
                dataIndex: 'memberMobile',
                align: 'center',
                width: 120
            },
            {
                title: `${sldComLanguage('会员昵称')}`,//会员昵称
                dataIndex: 'memberNickName',
                align: 'center',
                width: 80,
                render: (text) => text?text:'--'
            },
            {
                title: '公司',//渠道
                dataIndex: 'companyName',
                align: 'center',
                width: 80,
                render: (text) => text?text:'--'
            },
            {
                title: '渠道',//渠道
                dataIndex: 'channelName',
                align: 'center',
                width: 80,
                render: (text) => text?text:'--'
            },
            {
                title: `${sldComLanguage('操作')}`,
                align: 'center',
                width: 100,
                render: (text, record) => <div
                    onClick={() => this.delMembers(record.keyId)}
                    className={`${promotion.coupon_goods_operate} ${global.flex_row_center_center}`}
                >
                    <ALibbSvg fill="#2d2d2d" width={18} height={18} type="shanchu5" />
                </div>
            }
        ],
        shopList:[],
        offlineShopType: 1,//适用门店    1 所有门店  2 指定门店
        availableTime:[
            {
                wId:guid(),
                week:['1','2','3','4','5','6','7'], // 存放选择的周数据
                dayTimeType:1, // 1 全天可用  2 自定义时间段
                rangTime:[
                    {
                        tId:guid(),
                        start:'',
                        end:'' 
                    }
                ] // 存放选择的时间段 
            }
        ],
        selectShopList:[]
    };
}

async componentDidMount() {
    const { query } = this.state;
    await this.getOfflineShop({pageSize:1000})
    if (query.id != undefined && query.id > 0) {
        this.get_detail(query.id);
    } else {
        this.setState({ isFirstLoading: false });
    }
    this.checkCouponState();

}

componentWillUnmount() {
}

  //获取消费券详情
  get_detail = async (id) => {
      const { dispatch } = this.props;
      let { checkedCatIds, query, publishType,availableTime,shopList } = this.state;
      let availableTimeCopy = _cloneDeep(availableTime)
      this.setState({ loading: true });
      dispatch({
          type: 'conscoupon/get_detail',
          payload: { couponId: id },
          callback: async (res) => {
              if (res.state == 200) {
                  const {shopIds,extendInfoVOList} = res.data
                  // 处理门店
                  let _offlineShopType = 1
                  let _selectShopList = []
                  if(isNotEmpty(shopIds)){
                      // 全部门店
                      if(shopIds=='-1'){
                          _offlineShopType = 1
                      }else{
                          // 指定门店
                          _offlineShopType = 2
                          let activeArr = []
                          let shopIdArr = shopIds.split(',')
                          // 需要过滤掉不在 shopList 里面的店铺
                          shopIdArr.forEach(item=>{
                              if(shopList.find(el=>el.shopId==item)){
                                  activeArr.push(item)
                              }
                          })
                          _selectShopList = activeArr
                      }
                      
                  }
                  // 处理时间段
                  let availableTimeArr = []
                  extendInfoVOList.forEach((item)=>{
                      const {week,period} = item
                      // 处理周
                      let weekArr = week.split(',')
                      let weekArrTrans = []
                      weekArr.forEach((el)=>{
                          weekArrTrans.push(week2num[el])
                      })
                      // 处理时间段
                      let _dayTimeType = 1
                      let rangTimeArr = []
                      if(period=='全天可用'){
                          rangTimeArr.push({
                              tId:guid(),
                              start:'',
                              end:''
                          })
                      }else{
                          _dayTimeType = 2
                          let periodArr = period.split(',')
                          periodArr.forEach((em)=>{
                              let [start,end] = em.split('-')
                              rangTimeArr.push({
                                  tId:guid(),
                                  start:start,
                                  end:end
                              })
                          })
                      }
                      // 组合数据
                      let _weekparmas = {
                          wId:guid(),
                          week:weekArrTrans,
                          dayTimeType:_dayTimeType,
                          rangTime:rangTimeArr
                      }
                      availableTimeArr.push(_weekparmas)
                  })
                 
                  if(res.data.publishType == 5 && res.data.couponMemberVOList){//指定会员 需要查询会员列表
                      let pageSize = 1000;
                      let couponMemberList = []
                      try {
                          pageSize = res.data.couponMemberVOList.length;
                          res.data.couponMemberVOList.forEach((item)=>{
                              couponMemberList.push({
                                  companyId:item.companyId,
                                  memberName:item.memberName
                              })
                          })
                      } catch (error) {
                          // let pageSize = 1000;
                      }
                      this.get_member_list(couponMemberList, pageSize)
                  }
                  if (query.type != undefined && query.type == 'copy') {
                      res.data.couponName = '';//清空消费券名称
                      res.data.publishStartTime = '';//清空消费券的活动时间
                      if (res.data.effectiveTimeType == 1) {
                          //如果是固定使用时间，需要清空使用时间
                          res.data.effectiveStart = '';
                      }
                  }
                  publishType = res.data.publishType;//获取方式
                  this.setState({
                      coupon_detail: res.data,
                      loading: false,
                      useTimeType: res.data.effectiveTimeType,//使用时间类型
        
                      curCouponType: res.data.couponType,//消费券类型
                      checkedCatIds,
                      publishType,
                      offlineShopType:_offlineShopType, // 适用门店
                      selectShopList:_selectShopList,
                      availableTime:isNotEmpty(availableTimeArr)?availableTimeArr:availableTimeCopy
                  });
              }
              this.setState({ isFirstLoading: false });
          }
      });
  };

  get_member_list = (couponMemberList, pageSize) => {
      let { selectedMemberRows } = this.state;
      const { dispatch } = this.props;
      dispatch({
          type: 'project/get_member_detail_lists',
          payload: { memberInfoList:couponMemberList, pageSize },
          callback: async (res) => {
              if (res.state == 200) {
                  if (res.data.length > 0) {
                      // todo 经过沟通，公司相关的数据暂时前端写死，后续再优化 2021-12-14
                      res.data = res.data.map(item => ({
                          ...item,
                          keyId:`${item.companyId}${item.memberId}`
                      }))
                      selectedMemberRows = res.data;
                  }
                  this.setState({
                      selectedMemberRows
                  });
              }
          }
      });
  };

  //获取门店列表
  getOfflineShop =async (params) => {
      const { dispatch } = this.props;
      await dispatch({
          type: 'project/getOfflineShop',
          payload: params,
          callback: (res) => {
              if (res.state == 200) {
                  this.setState({ shopList:res.data.list });
              }
          }
      });
  };

  resetSelMembers = () => {
      this.setState({
          modalVisibleMember: true,
          sle_more_title: `${sldComLanguage('指定会员发放(最少选择1个)')}`
      });
  };

   //消费券类型选择  1 满减券 2 折扣券 
   handleCouponType = (e) => {
       this.setState({ curCouponType: e.target.value });
   };

  //适用门店选择事件 全部  指定
  offlineShopTypeChange = (e) => {
      console.log(e)
      this.setState({
          offlineShopType:e.target.value
      })
  };

  // 指定门店多选事件
  handleShopChange = (e)=>{
      console.log(e)
      this.setState({
          selectShopList:e
      })
  }

  // 周选择事件
  weekChange = (e,wId)=>{
      const { availableTime } = this.state
      console.log(e,wId)
      let tar_data = availableTime.find(item => item.wId == wId);
      let _hasselectWeek = hasselectWeek(availableTime)
      let _leaveWeek = leaveWeek(_hasselectWeek)
      let myOptional= myweekAndleaveWeek([...tar_data.week],_leaveWeek)
      // 如果我选择的 在我可选里面   即value是myOptional的子集 验证通过 ,否则提示
      if(!checkSubset(myOptional,e)){
          failTip('周数存在交叉，请检查')
          // 将之前的值设置给该周数
          let obj = {}
          obj[`week_${wId}`] = [...tar_data.week]
          setTimeout(()=>{
              this.props.form.setFieldsValue(obj)
          },0)
          return false
      }
      if(tar_data){
          tar_data.week = e
      }
      this.setState({
          availableTime
      })
      console.log(tar_data)
  }

  // 时段选择 1全天  2自定义时段
  handleDayTimeChange = (e,wId)=>{
      const { availableTime } = this.state
      let tar_data = availableTime.find(item => item.wId == wId);
      if(tar_data){
          tar_data.dayTimeType = e.target.value
      }
      this.setState({
          availableTime
      })
  }

  // 自定义时段 填写时间段   type:start end  
  timeChange = (time,timeString,wId,tId,type)=>{
      const { availableTime } = this.state
      let tar_data = availableTime.find(item => item.wId == wId);
      let time_data = tar_data.rangTime.find(el => el.tId == tId );
      if(time_data){
          time_data[type] = timeString
      }
      this.setState({
          availableTime
      })
  }

  // 添加自定义时间
  addRangTime = (wId)=>{
      const { availableTime } = this.state
      let tar_data = availableTime.find(item => item.wId == wId);
      if(tar_data.rangTime.length==3){
          failTip('最多添加3个时间段')
          return 
      }
      tar_data.rangTime.push({
          tId:guid(),
          start:'',
          end:''
      })
      this.setState({ availableTime }); 
  }

  // 删除自定义时间
  delRangTime = (wId,tId)=>{
      const { availableTime } = this.state
      let tar_data = availableTime.find(item => item.wId == wId);
      tar_data.rangTime = tar_data.rangTime.filter(el => el.tId != tId );
      this.setState({ availableTime });
  }

  // 添加可用时间
  addAvailableTime = ()=>{
      let { availableTime } = this.state;
      availableTime.push({
          wId:guid(),
          week:[], // 存放选择的周数据
          dayTimeType:1, // 1 全天可用  2 自定义时间段
          rangTime:[
              {
                  tId:guid(),
                  start:'',
                  end:'' 
              }
          ] // 存放选择的时间段 
      });
      this.setState({ availableTime });
  }

  // 删除可用时间
  delAvailableTime = (wId)=>{
      let { availableTime } = this.state;
      availableTime = availableTime.filter(item => item.wId != wId);
      this.setState({ availableTime });  
  }

  //验证消费券开关
  checkCouponState = () => {
      const { dispatch } = this.props;
      dispatch({
          type: 'common/getSetting',
          payload: { str: 'coupon_is_enable' },
          callback: () => {
              //   if (res.state == 200) {
              //       this.setState({ enableFlag: res.data[0].value, isFirstLoading: false });
              //   }
              // 目前没有开启关闭消费券模块 先保留
              this.setState({ enableFlag: '1', isFirstLoading: false });
          }
      });
  };

  //保存并新增事件
  handleSaveAllData = async () => {
      const { dispatch } = this.props;
      const { query, selectedMemberRows,publishType,selectShopList,availableTime } = this.state;
      this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              
              //使用时间处理
              if (values.effectiveTime) {
                  values.effectiveStart = values.effectiveTime[0] ? values.effectiveTime[0].format(dateTimeFormat) : '';
                  values.effectiveEnd = values.effectiveTime[1] ? values.effectiveTime[1].format(dateTimeFormat) : '';
                  delete values.effectiveTime;
              }

              //指定门店
              if (values.offlineShopType == 2) {
                  if(selectShopList.length==0){
                      failTip('请选择门店')
                      return
                  }
                  values.shopIds = selectShopList.join(',')
              }else{
                  values.shopIds = -1
              }

              // 处理时间段
              let errorTime = [] //
              let extendInfoVO = [] // [{week:'周一,周二',period:'08:00-12:30,18:00-22:30'}]
              availableTime.forEach((item,index)=>{
                  const {week,dayTimeType,rangTime} = item
                  let timeparam = {}
                  let weekStr = []
                  week.sort((a,b)=>a-b)
                  week.forEach((e)=>{
                      weekStr.push(num2week[e])
                  })
                  timeparam.week = weekStr.join(',')
                  let periodArr = []

                  // 1 全天可用  2 自定义时间段
                  if(dayTimeType==1){
                      timeparam.period = '全天可用'
                  }else{
                      // 检查时间  结束时间大于开始时间  时间不能存在交叉
                      rangTime.forEach((el,i)=>{
                          const {start,end} = el
                          el.startPoint = moment(`2023-01-01 ${start}`).format('X')
                          el.endPoint = moment(`2023-01-01 ${end}`).format('X')
                          el.index = i+1
                          // 开始时间大于结束时间
                          if(el.startPoint>=el.endPoint){
                              errorTime.push(`可用时间${index+1},时间段${i+1},开始时间大于结束时间`)
                          }
                      })
                      checkTime(rangTime,errorTime,`可用时间${index+1}`)
                      rangTime.forEach((el)=>{
                          const {start,end} = el
                          periodArr.push(`${start}-${end}`)
                      })
                      timeparam.period = periodArr.join(',')
                  }
                  extendInfoVO.push(timeparam)
              })
              if(errorTime.length>0){
                  const rdom = (<p style={{whiteSpace:'pre-line'}}>{`${errorTime.join('\n')}`}</p>)
                  failTip(rdom)
                  return
              }
              values.extendInfoVO = extendInfoVO
              //门槛金额必需大于满减金额判断
              if((values.limitQuota<values.publishValue||values.limitQuota==values.publishValue)&&values.limitQuota!=0&&values.curCouponType==1){
                  failTip(sldComLanguage('使用门槛金额必需大于满减金额'));
                  return false;
              }

              if(publishType == 1){ // 免费领取
                  if(values.limitReceive*1 > values.publishNum*1){
                      failTip(sldComLanguage('每人限领次数不能超过发放总数～'));
                      return false;
                  }
              }else if(publishType == 5){ //指定会员发放
                  if(selectedMemberRows.length <= 0){
                      failTip(sldComLanguage('请选择指定会员'));
                      return false;
                  }
                  if((selectedMemberRows.length*values.limitReceive*1)!=values.publishNum*1){
              
                      failTip(sldComLanguage('发放数量和（指定会员总数*每位会员发放张数）不一致～'));
                      return false;
                  }
                  // 指定会员发放 每人每企业限领次数的输入框去掉，但companyLimitReceive参数和limitReceive取一样的值
                  values.companyLimitReceive = values.limitReceive
                  let couponMemberExampleList = selectedMemberRows.map(item => ({
                      userId: item.userId,
                      companyId: item.companyId,
                      channelId: item.channelId,
                      memberId: item.memberId,
                      memberName: item.memberName
                  }))
                  values.couponMemberExampleList = couponMemberExampleList;
              }else if(publishType == 3||publishType == 6){
                  values.limitReceive = 0;//活动赠送和密码领取 的消费券不限制会员领取的数量
                  values.companyLimitReceive = 0;
              }  
              //判断每人限领次数和每人每企业限领次数大小
              if(publishType == 1){
                  let clr = values.companyLimitReceive == 0?Infinity:values.companyLimitReceive,
                      lr = values.limitReceive == 0?Infinity:values.limitReceive;//数据为0时表示不限制次数，定义变量为Infinity（无穷大）
                  if(lr<clr){
                      failTip(sldComLanguage('每人限领次数应大于或等于每人每企业限领次数'));
                      return false;
                  }
              }
             
              let dis_type = '';
              if (isNotEmpty(query.id) && query.type == 'edit') {
                  //编辑消费券
                  values.couponId = query.id;
                  dis_type = 'conscoupon/update';
              } else {
                  //新增消费券
                  dis_type = 'conscoupon/add_coupon';
              }
              console.log('values',values)
              sthis.setState({ loading: true });
              dispatch({
                  type: dis_type,
                  payload: values,
                  callback: (res) => {
                      sthis.setState({ loading: false });
                      if (res.state == 200) {
                          sucTip(res.msg);
                          setTimeout(() => {
                              sthis.props.history.goBack();
                          }, 500);
                      } else {
                          failTip(res.msg);
                          sthis.setState({ loading: false });
                      }
                  }
              });

          }
      },
      );
  };

  memberPopCancle = () => {
      this.setState({
          modalVisibleMember: false
      });
  };

  //会员删除事件
  delMembers = (keyId) => {
      let { selectedMemberRows, selectedMemberRowKeys } = this.state;
      selectedMemberRows = selectedMemberRows.filter(item => item.keyId != keyId);
      selectedMemberRowKeys = selectedMemberRowKeys.filter(item => item != keyId);
      this.sele_more_members.ids = [...selectedMemberRowKeys];
      this.sele_more_members.info = JSON.parse(JSON.stringify(selectedMemberRows));
      this.setState({
          selectedMemberRows,
          selectedMemberRowKeys
      });
  };

  //指定会员多选-回调事件
  confirmMemberChoose = (selectedRows, selectedRowKeys) => {
    
      this.sele_more_members.ids = [...selectedRowKeys];
      this.sele_more_members.info = JSON.parse(JSON.stringify(selectedRows));
      this.setState({
          selectedMemberRows: selectedRows,
          selectedMemberRowKeys: selectedRowKeys
      });
      this.memberPopCancle();
  };

  //使用时间类型选择 1 固定使用时间  2 灵活使用时间
  handleUseTimeType = (e) => {
      this.setState({ useTimeType: e.target.value });
  };

  //获取方式选择事件
  handlePublishType = (e) => {
  
      let { sle_member_title, modalVisibleMember } = this.state;
      if (e.target.value == 5) {
          modalVisibleMember = true;
          sle_member_title = `选择要发放的会员(最少 1 个)`;
      }
      this.setState({
          sle_member_title,
          modalVisibleMember,
          publishType: e.target.value
      })
  }

  onChange = (e,type) => {
      let { link_data } = this.state;
      link_data[type] = e;
      this.setState({ link_data });
  } 

  render() {
      const {
          modalVisibleMember, sle_member_title, loading, curCouponType,selectShopList, useTimeType, offlineShopType, columns_member, 
          selectedMemberRows,coupon_detail, enableFlag, isFirstLoading, publishType, query,shopList,availableTime
      } = this.state;
      let {
          form: { getFieldDecorator }
      } = this.props;
      return (
          <AuthBtn btnAuth={btnAuth} eventKey={["conscoupon_list_add","conscoupon_list_edit"]} showPage>
              <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
                  {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${query.type=='edit'?'编辑':'新增'}消费券`, 0, 0, 10)}
                  {getSldHorLine(1)}
                  <Spin spinning={loading}>
                      <Form layout="inline">
                          <Scrollbars
                              autoHeight
                              autoHeightMin={100}
                              autoHeightMax={document.body.clientHeight - 160}
                          >
                              <div className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity}`}>
                                  {/* 基本信息-start */}
                                  {getSldEmptyH(10)}
                                  {enableFlag == 1 && !isFirstLoading &&
                <Fragment>
                    {sldCommonTitleByBg(`${sldComLanguage('消费券基本信息')}`)}
                    {getSldEmptyH(10)}
                    <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                            <div className={`${promotion.left}`}>
                                <span style={{ color: 'red' }}>*</span>{sldComLanguage('消费券名称')}
                            </div>
                            <div className={`${promotion.right}`}>
                                <FormItem
                                    extra={`${sldComLanguage('最多输入20个字')}`}
                                    style={{ width: 300 }}
                                >
                                    {getFieldDecorator('couponName', {
                                        initialValue: coupon_detail.couponName, rules: [{
                                            required: true,
                                            whitespace: true,
                                            message: `${sldComLanguage('请输入消费券名称')}`
                                        }]
                                    })(
                                        <Input
                                            maxLength={20}
                                            style={{ width: 400 }}
                                            placeholder={`${sldComLanguage('请输入消费券名称')}`}
                                        />,
                                    )}
                                </FormItem>
                            </div>
                        </div>
                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                            <div className={`${promotion.left}`}>
                                <span style={{ color: 'red' }}>*</span>{sldComLanguage('发放总量')}
                            </div>
                            <div className={`${promotion.right}`}>
                                <FormItem
                                    style={{ width: 300 }}
                                    extra={`${sldComLanguage('最多10000张，修改消费券总量时只能增加不能减少，请谨慎设置')}`}
                                >
                                    {getFieldDecorator('publishNum', {
                                        initialValue: coupon_detail.publishNum, rules: [{
                                            required: true,
                                            message: `${sldComLanguage('请输入发放总量')}`
                                        }]
                                    })(
                                        <InputNumber
                                            max={10000}
                                            min={query.type!=undefined&&query.type == 'edit'?coupon_detail.publishNum:1}
                                            precision={0}
                                            style={{ width: 400 }}
                                            placeholder={`${sldComLanguage('请输入发放总量')}`}
                                        />,
                                    )}
                                </FormItem>
                            </div>
                        </div>

                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                            <div className={`${promotion.left}`}>
                                <span style={{ color: 'red' }}>*</span>{sldComLanguage('消费券类型')}
                            </div>
                            <div className={`${promotion.right}`}>
                                <FormItem
                                    style={{ width: 400 }}
                                >
                                    {getFieldDecorator('couponType', {
                                        initialValue: curCouponType
                                    })(
                                        <RadioGroup size="small" onChange={(e) => this.handleCouponType(e)}>
                                            <Radio value={1}>{sldComLanguage('固定金额券')}</Radio>
                                            <Radio value={2}>{sldComLanguage('折扣券')}</Radio>
                                        </RadioGroup>,
                                    )}
                                </FormItem>
                            </div>
                        </div>

                        {
                            curCouponType == 1 && 
                            <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                <div className={`${promotion.left}`}>
                                    <span style={{ color: 'red' }}>*</span>{sldComLanguage('发放券面值')}
                                </div>
                                <div className={`${promotion.right}`}>
                                    <FormItem
                                        style={{ width: 300 }}
                                    >
                                        <div className={global.flex_row_start_center}>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    marginRight: 5,
                                                    color: 'rgba(0, 0, 0, 0.65)'
                                                }}
                                            >{sldComLanguage('减免')}</span>
                                            {getFieldDecorator('publishValue', {
                                                initialValue: coupon_detail.publishValue, rules: [{
                                                    required: true,
                                                    message: `${sldComLanguage('请输入发放券面值')}`
                                                }]
                                            })(
                                                <InputNumber
                                                    max={1000}
                                                    min={0.01}
                                                    precision={2}
                                                    style={{ width: 140 }}
                                                    placeholder={`${sldComLanguage('请输入发放券面值')}`}
                                                />,
                                            )}
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    marginLeft: 5,
                                                    color: 'rgba(0,0 , 0, 0.65)'
                                                }}
                                            >{sldComLanguage('元')}</span>
                                        </div>
                                    </FormItem>
                                </div>
                            </div>
                        }

                        {
                            curCouponType == 2 && 
                            <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                <div className={`${promotion.left}`}>
                                    <span style={{ color: 'red' }}>*</span>{sldComLanguage('折扣内容')}
                                </div>
                                <div className={`${promotion.right}`}>
                                    <FormItem
                                        extra={`${sldComLanguage('输入90代表9折,85代表8.5折')}`}
                                        style={{ width: 190 }}
                                    >
                                        <div className={global.flex_row_start_center}>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    marginRight: 5,
                                                    color: 'rgba(0, 0, 0, 0.65)'
                                                }}
                                            >{sldComLanguage('打')}</span>
                                            {getFieldDecorator('publishValue', {
                                                initialValue: coupon_detail.publishValue, rules: [{
                                                    required: true,
                                                    message: `${sldComLanguage('请输入折扣')}`
                                                }]
                                            })(
                                                <InputNumber
                                                    max={100}
                                                    min={1}
                                                    precision={0}
                                                    style={{ width: 140 }}
                                                    placeholder={`${sldComLanguage('请输入折扣')}`}
                                                />,
                                            )}
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    marginLeft: 5,
                                                    color: 'rgba(0, 0, 0, 0.65)'
                                                }}
                                            >{sldComLanguage('折')}</span>
                                        </div>
                                    </FormItem>
                                </div>
                                <div className={`${promotion.right}`}>
                                    <FormItem
                                        style={{ width: 300 }}
                                    >
                                        <div className={global.flex_row_start_center}>
                                            <span style={{
                                                display: 'inline-block',
                                                marginRight: 5,
                                                color: 'rgba(0, 0, 0, 0.65)'
                                            }}
                                            >{sldComLanguage('最多优惠')}</span>
                                            {getFieldDecorator('discountLimitAmount', {
                                                initialValue: coupon_detail.discountLimitAmount
                                            })(
                                                <InputNumber
                                                    max={1000}
                                                    min={0.01}
                                                    precision={2}
                                                    style={{ width: 140 }}
                                                    placeholder={`${sldComLanguage('请输入优惠金额')}`}
                                                />,
                                            )}
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    marginLeft: 5,
                                                    color: 'rgba(0, 0, 0, 0.65)'
                                                }}
                                            >{sldComLanguage('元')}</span>
                                        </div>
                                    </FormItem>
                                </div>
                            </div>
                        }
                        
                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                            <div className={`${promotion.left}`}>
                                <span style={{ color: 'red' }}>*</span>{sldComLanguage('使用门槛')}
                            </div>
                            <div className={`${promotion.right}`}>
                                <FormItem
                                    style={{ width: 300 }}
                                    extra={`${sldComLanguage('订单满多少元时可以使用此消费券，0元代表无使用门槛')}`}
                                >
                                    <div className={global.flex_row_start_center}>
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                marginRight: 5,
                                                color: 'rgba(0, 0, 0, 0.65)'
                                            }}
                                        >{sldComLanguage('订单满')}</span>
                                        {getFieldDecorator('limitQuota', {
                                            initialValue: coupon_detail.limitQuota, rules: [{
                                                required: true,
                                                message: `${sldComLanguage('请输入使用门槛')}`
                                            }]
                                        })(
                                            <InputNumber
                                                max={99999999}
                                                min={0}
                                                precision={2}
                                                style={{ width: 140 }}
                                                placeholder={`${sldComLanguage('请输入使用门槛')}`}
                                            />,
                                        )}
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                marginLeft: 5,
                                                color: 'rgba(0, 0, 0, 0.65)'
                                            }}
                                        >{sldComLanguage('元')}</span>
                                    </div>
                                </FormItem>
                            </div>
                        </div>

                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                            <div className={`${promotion.left}`}>
                                <span style={{ color: 'red' }}>*</span>{sldComLanguage('适用门店')}
                            </div>
                            <div className={`${promotion.right}`}>
                                <FormItem
                                    style={{ width: 400 }}
                                >
                                    {getFieldDecorator('offlineShopType', {
                                        initialValue: offlineShopType
                                    })(
                                        <RadioGroup size="small" onChange={(e) => this.offlineShopTypeChange(e)}>
                                            <Radio value={1}>{sldComLanguage('所有门店')}</Radio>
                                            <Radio value={2}>{sldComLanguage('指定门店')}</Radio>
                                        </RadioGroup>,
                                    )}
                                </FormItem>
                                {
                                    offlineShopType==2 &&
                                    <div>
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            placeholder="请选择"
                                            value={selectShopList}
                                            onChange={this.handleShopChange}
                                        >
                                            {shopList.map((item)=>(
                                                <Option key={item.shopId}>{item.shopName}</Option>
                                            ))}
                                        </Select>
                                    </div>
                                }
                            </div>
                        </div>
                
                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                            <div className={`${promotion.left}`}>
                                <span style={{ color: 'red' }}>*</span>{sldComLanguage('消费券有效期')}
                            </div>
                            <div className={`${promotion.right}`}>
                                <FormItem
                                    style={{ width: 400 }}
                                >
                                    {getFieldDecorator('useTimeType', {
                                        initialValue: useTimeType
                                    })(
                                        <RadioGroup size="small" onChange={(e) => this.handleUseTimeType(e)}>
                                            <Radio value={1}>{sldComLanguage('固定使用时间')}</Radio>
                                            <Radio value={2}>{sldComLanguage('灵活使用时间')}</Radio>
                                        </RadioGroup>,
                                    )}
                                </FormItem>
                            </div>
                        </div>

                        {useTimeType == 1 &&
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                        <div className={`${promotion.left}`}>
                            <span style={{ color: 'red' }}>*</span>{sldComLanguage('设置固定使用时间')}
                        </div>
                        <div className={`${promotion.right}`}>
                            <FormItem
                                style={{ width: 400 }}
                            >
                                {getFieldDecorator('effectiveTime', {
                                    initialValue: coupon_detail.effectiveStart != undefined && coupon_detail.effectiveStart ? [moment(coupon_detail.effectiveStart, dateTimeFormat), moment(coupon_detail.effectiveEnd, dateTimeFormat)] : [],
                                    rules: [{
                                        required: true,
                                        message: `${sldComLanguage('请先设置固定使用时间')}`
                                    }]
                                })(
                                    <RangePicker
                                        format="YYYY-MM-DD"    
                                        disabledDate={(current)=> current< moment().startOf('day')}
                                        style={{ width: 350 }}
                                        placeholder={[`${sldComLanguage('开始时间')}`, `${sldComLanguage('结束时间')}`]}
                                        showTime
                                        getCalendarContainer={(triggerNode) => triggerNode.parentNode}
                                    />,
                                )}
                            </FormItem>
                        </div>
                    </div>
                        }

                        {useTimeType == 2 &&
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                        <div className={`${promotion.left}`}>
                            <span style={{ color: 'red' }}>*</span>{sldComLanguage('设置灵活使用时间')}
                        </div>
                        <div className={`${promotion.right}`}>
                            <FormItem
                                extra={`${sldComLanguage('以天为单位')}`}
                                style={{ width: 300 }}
                            >
                                <div className={global.flex_row_start_center}>
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            marginRight: 5,
                                            color: 'rgba(0, 0, 0, 0.65)'
                                        }}
                                    >{sldComLanguage('领券当日起')}</span>
                                    {getFieldDecorator('cycle', {
                                        initialValue: coupon_detail.cycle, rules: [{
                                            required: true,
                                            message: `${sldComLanguage('请输入灵活使用时间')}`
                                        }]
                                    })(
                                        <InputNumber
                                            max={1000}
                                            min={1}
                                            precision={0}
                                            style={{ width: 150 }}
                                            placeholder={`${sldComLanguage('请输入灵活使用时间')}`}
                                        />,
                                    )}
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            marginLeft: 5,
                                            color: 'rgba(0, 0, 0, 0.65)'
                                        }}
                                    >{sldComLanguage('天')}</span>
                                </div>
                            </FormItem>
                        </div>
                    </div>
                        }

                        {
                            availableTime.map((item,i)=>(
                                <div className={`${promotion.item} ${global.flex_row_start_start}`} key={item.wId}>
                                    <div className={`${promotion.left}`}>
                                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('可用时间')}
                                    </div>
                                    <div className={`${promotion.right}`}>
                                        <FormItem
                                            style={{ width: 800 }}
                                            extra=''
                                        >
                                            {getFieldDecorator(`week_${item.wId}`, {
                                                initialValue: item.week, rules: [{
                                                    required: true,
                                                    message: '请选择'
                                                }]
                                            })(
                                                <Checkbox.Group style={{ width: '100%' }} onChange={(e)=>this.weekChange(e,item.wId)}>
                                                    <Checkbox value="1">周一</Checkbox>
                                                    <Checkbox value="2">周二</Checkbox>
                                                    <Checkbox value="3">周三</Checkbox>
                                                    <Checkbox value="4">周四</Checkbox>
                                                    <Checkbox value="5">周五</Checkbox>
                                                    <Checkbox value="6">周六</Checkbox>
                                                    <Checkbox value="7">周日</Checkbox>
                                                    {availableTime.length>1&&<Icon type="delete" onClick={()=>this.delAvailableTime(item.wId)} />}
                                                </Checkbox.Group>
                                            )}
                                        </FormItem>
                                        <div>
                                            <RadioGroup size="small" onChange={(e) => this.handleDayTimeChange(e,item.wId)} value={item.dayTimeType}>
                                                <Radio value={1}>全天可用</Radio>
                                                <Radio value={2}>自定义时间</Radio>
                                            </RadioGroup>
                                        </div>
                                        {
                                            item.dayTimeType==2 && item.rangTime.map((rangItem,index)=>(
                                                <div key={rangItem.tId} style={{marginTop:'16px'}}>
                                                    <span style={{marginRight:'10px',position:'relative',top:'6px'}}>时段{index+1}</span>
                                                    <FormItem>
                                                        {
                                                            getFieldDecorator(`timestart_${rangItem.tId}`,{
                                                                initialValue: rangItem.start?moment(rangItem.start,'HH:mm'):null,
                                                                rules:[{
                                                                    required: true,
                                                                    message: '请选择开始时间'
                                                                }]
                                                            })(
                                                                <TimePicker format={format} onChange={(time,timeString)=>{this.timeChange(time,timeString,item.wId,rangItem.tId,'start')}} />
                                                            )
                                                        }
                                                    </FormItem>
                                                    {/* <TimePicker format={format} onChange={(time,timeString)=>{this.timeChange(time,timeString,item.wId,rangItem.tId,'start')}} /> */}
                                                    <span>&nbsp;</span>
                                                    <FormItem>
                                                        {
                                                            getFieldDecorator(`timeend_${rangItem.tId}`,{
                                                                initialValue: rangItem.end?moment(rangItem.end,'HH:mm'):null,
                                                                rules:[{
                                                                    required: true,
                                                                    message: '请选择结束时间'
                                                                }]
                                                            })(
                                                                <TimePicker format={format} onChange={(time,timeString)=>{this.timeChange(time,timeString,item.wId,rangItem.tId,'end')}} />
                                                            )
                                                        }
                                                    </FormItem>
                                                    {/* <TimePicker format={format} onChange={(time,timeString)=>{this.timeChange(time,timeString,item.wId,rangItem.tId,'end')}} /> */}
                                                    {item.rangTime.length>1 && <Icon type="minus-circle" onClick={()=>this.delRangTime(item.wId,rangItem.tId)} style={{marginLeft:'8px',marginRight:'8px',position:'relative',top:'6px'}} />}
                                                    {(item.rangTime.length==index+1) && <span onClick={()=>this.addRangTime(item.wId)} style={{position:'relative',top:'6px'}}><Icon type="plus" />添加时间段</span>}
                                                </div>
                                            ))
                                        }
                                        {
                                            (availableTime.length==i+1) &&
                                            <div style={{marginTop:'8px',cursor:'pointer'}}>
                                                <Icon type="plus" /><span onClick={()=>{this.addAvailableTime()}}>添加可用时间</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            ))
                            
                        }


                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                            <div className={`${promotion.left}`}>
                                <span style={{ color: 'red' }}>*</span>{sldComLanguage('获取方式')}
                            </div>
                            <div className={`${promotion.right}`}>
                                <FormItem
                                    style={{ width: 600 }}
                                    extra={<div>
                                        <div>{sldComLanguage('选择“免费领取”类型则领取方式为用户在领券中心等处直接点击领取')}</div>
                                        <div>{sldComLanguage('选择“活动赠送”类型则在成功参与指定商城活动后系统自动赠送该券')}</div>
                                    </div>}
                                >
                                    {getFieldDecorator('publishType', {
                                        initialValue: coupon_detail.publishType != undefined ? coupon_detail.publishType : 1
                                    })(
                                        <RadioGroup size="small" onChange={(e) => this.handlePublishType(e)}>
                                            <Radio value={1}>{sldComLanguage('免费领取')}</Radio>
                                            {/* <Radio value={3}>{sldComLanguage('活动赠送')}</Radio> */}
                                            <Radio value={5}>{sldComLanguage('指定会员发放')}</Radio>
                                            <Radio value={6}>{sldComLanguage('凭密码领取')}</Radio>
                                        </RadioGroup>,
                                    )}
                                </FormItem>
                            </div>
                        </div>

                        {publishType == 5 &&
                      <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                          <div className={`${promotion.left}`}>
                              <span style={{ color: 'red' }}>*</span>{sldComLanguage('已选择会员')}
                          </div>
                          <div className={`${promotion.right}`}>
                              <span
                                  className={`${promotion.reset_sel}`}
                                  onClick={() => this.resetSelMembers()}
                              >{sldComLanguage('重新选择')}</span>
                              <Scrollbars
                                  autoHeight
                                  autoHeightMax={300}
                              >
                                  <Table
                                      rowKey="keyId"
                                      pagination={false}
                                      columns={columns_member}
                                      dataSource={selectedMemberRows}
                                      size="small" 
                                  />
                              </Scrollbars>
                          </div>
                      </div>
                        }

                         
                    </div>
                    {/* 基本信息-end */}

                    {/* 领取和使用规则-start */}
                    <Fragment>
                        {getSldEmptyH(10)}
                        {sldCommonTitleByBg(`${sldComLanguage('领取和使用规则')}`)}
                        {getSldEmptyH(10)}
                        <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                            {
                                publishType == 1 && 
                                <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                    <div className={`${promotion.left}`}>
                                        <span style={{ color: 'red' }}>*</span>{`每人每企业限领次数`}
                                    </div>
                                    <div className={`${promotion.right}`}>
                                        <FormItem
                                            style={{ width: 300 }}
                                            extra="每位会员在同一个企业内限制领取的次数，0代表不限制次数"
                                        >
                                            {getFieldDecorator('companyLimitReceive', {
                                                initialValue: coupon_detail.limitReceive, rules: [{
                                                    required: true,
                                                    message: `${'请输入每位会员在同一个企业内限制领取次数' }`
                                                }]
                                            })(
                                                <InputNumber
                                                    max={100}
                                                    min={0}
                                                    precision={0}
                                                    style={{ width: 400 }}
                                                    placeholder={`${sldComLanguage('请输入每位会员在同一个企业内限制领取次数')}`}
                                                />,
                                            )}
                                        </FormItem>
                                    </div>
                                </div>

                            }
                            {
                                (publishType == 1 || publishType == 5) && 
                                <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                    <div className={`${promotion.left}`}>
                                        <span style={{ color: 'red' }}>*</span>{(publishType==1) ? `每人限领次数` : `每位会员发放张数`}
                                    </div>
                                    <div className={`${promotion.right}`}>
                                        <FormItem
                                            style={{ width: 300 }}
                                            extra={(publishType==1) ? `每位会员限制领取的次数，0代表不限制次数` : `每位会员发放张数`}
                                        >
                                            {getFieldDecorator('limitReceive', {
                                                initialValue: coupon_detail.limitReceive, rules: [{
                                                    required: true,
                                                    message: `${(publishType==1) ? '请输入限制领取次数' : '请输入每个会员发放张数'}`
                                                }]
                                            })(
                                                <InputNumber
                                                    max={100}
                                                    min={0}
                                                    precision={0}
                                                    style={{ width: 400 }}
                                                    placeholder={(publishType==1) ? `${sldComLanguage('请输入限制领取次数')}` : `${sldComLanguage('请输入每个会员发放张数')}`}
                                                />,
                                            )}
                                        </FormItem>
                                    </div>
                                </div>
                            }
                            <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                <div className={`${promotion.left}`}>
                                    <span style={{ color: 'red' }}>*</span>{`使用规则描述`}
                                </div>
                                <div className={`${promotion.right}`}>
                                    <FormItem
                                        style={{ width: 300 }}
                                        extra="使用规则描述配置"
                                    >
                                        {getFieldDecorator('description', {
                                            initialValue: coupon_detail.description ? coupon_detail.description : offlineShopType==1 ? '全部门店可用' : '指定门店可用', rules: [{
                                                required: true,
                                                message: `${'请输入使用规则描述'}`
                                            }]
                                        })(
                                            <TextArea
                                                maxLength={200}
                                                disabled={false}
                                                style={{ minHeight: 32, width: 400 }}
                                                rows={4}
                                                placeholder="使用规则描述配置"
                                            />,
                                        )}
                                    </FormItem>
                                    
                                </div>
                            </div>
                        </div>
                    </Fragment>
                    {/* 领取和使用规则-end */}
                </Fragment>
                                  }
                                  {enableFlag != 1 && !isFirstLoading &&
                <Fragment>
                    {getSldEmptyH(150)}
                    <Empty
                        image={require('@/assets/moudle_disable.png')}
                        imageStyle={{
                            height: 80
                        }}
                        description={
                            <span>{sldComLanguage('消费券模块暂未开启')}</span>
                        }
                    />
                </Fragment>
                                  }
                              </div>
                              {getSldEmptyH(15)}
                              {enableFlag == 1 && !isFirstLoading &&
              <div
                  className={global.m_diy_bottom_wrap}
                  style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}
              >
                  <div onClick={() => this.props.history.goBack()} className={global.add_goods_bottom_btn}>
                      {sldComLanguage('取消')}
                  </div>
                  <Popconfirm
                      title="是否提交审核?"
                      onConfirm={() => this.props.form.submit(this.handleSaveAllData)}
                      okText="确认"
                      cancelText="取消"
                  >
                      <div
                          className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}
                      >
                          {sldComLanguage('提交审核')}
                      </div>
                  </Popconfirm>
              </div>
                              }
                          </Scrollbars>
                      </Form>
                  </Spin>

                  {/*选择指定会员modal框-start*/}
                  <SelectMemberPop 
                      selectedRows={this.sele_more_members.info}
                      selectedRowKeys={this.sele_more_members.ids}
                      modalVisible={modalVisibleMember} 
                      width={1100}
                      height={document.body.clientHeight - 400}
                      modalCancle={this.memberPopCancle} 
                      confirmMember={this.confirmMemberChoose}
                      title={sle_member_title} 
                  />
                  {/*选择指定会员modal框-end*/}
              </div>
          </AuthBtn>
          
      );
  }
}

