/*
* 满优惠——添加满N件折扣活动
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, Input, InputNumber, Checkbox, DatePicker,message,Radio,Table,Button,Popconfirm } from 'antd';
import {
    failTip,
    sucTip,
    sldLlineRtextAddMargin,
    sldIconBtnBg,
    sldComLanguage,
    dateTimeFormat,
    getSldHorLine,
    sldCommonTitleByBg,
    getSldEmptyH,
    getSldComImg,
    getStorage,
    sldIconBtn,
    getAuthBtn,
    hasAuth
} from '@/utils/utils';
import { num_to_num } from '@/utils/util_data';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import SldSelGoodsSingleDiy from '@/components/SldSelGoodsSingleDiy';
import ALibbSvg from '@/components/ALibbSvg';
import SldSelMoreLeftRightGoods from '@/components/SldSelMoreLeftRightGoodsSku';
import ReviewButton from '@/components/Review';
import ReviewLog from '@/components/ReviewLog';
import _chunk from 'lodash/chunk';
import moment from 'moment';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const storeId = getStorage('storeId');
let sthis = '';
// eslint-disable-next-line no-shadow
@connect(({ promotion, global }) => ({
    promotion, global
}))
@Form.create()
export default class AddFullNld extends Component {
    sele_more_goods = {
        info: [],//选择的商品数组
        ids: [],//选择的商品id数组
        min_num: 1,//最小数量，0为不限制
        max_num: 200//最多选择200个
    };

    key = 1;

    ladder_item = {
        key: 1,
        fullValue: '',//优惠门槛
        minusValue: '',//优惠金额
        sendCouponIds: false,//是否赠送优惠券
        sel_voucher: {},//选择的优惠券信息
        sendSkus: false,//是否送赠品
        sel_goods: {}//选择的赠品信息
    }; 
    
    constructor(props) {
        super(props);
        sthis = this;
        this.state = {
            ladder_promotion: [{
                key: 1,
                fullValue: '',//优惠门槛
                minusValue: '',//优惠金额
                sendCouponIds: false,//是否赠送优惠券
                sel_voucher: {},//选择的优惠券信息
                sendSkus: false,//是否送赠品
                sel_goods: {}//选择的赠品信息
            }],//阶梯优惠数组
            curData: {},//当前操作的数据
            link_type: '',
            loading: false,
            query: props.location.query,
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            detail: {},//活动详情数据
            viewFlag: props.location.query.tar != undefined && (props.location.query.tar == 'view'||props.location.query.tar == 'audit') ? true : false,//查看标识
            minusValueMap:['一','二','三','四','五'],
            cacheVoucher:[], //用来缓存编辑和复制状态下的优惠劵信息，用来提交时如果没有改变优惠券时 提示优惠券无效
            sle_more_title: '',//选择商品的标题
            modalVisibleGoods: false, //控制选择商品弹窗
            useType: 1,//适用商品类型
            columns_spu: [
                {
                    title: ' ',
                    dataIndex: 'key',
                    align: 'center',
                    width: 30,
                    render: (text, record, index) => index + 1
                },
                {
                    title: `${sldComLanguage('商品图片')}`,
                    dataIndex: 'mainImage',
                    align: 'center',
                    width: 100,
                    render: (text) => <div>{getSldComImg(text, 200, 200, 50, 50)}</div>
                },
                {
                    title: `${sldComLanguage('商品名称')}`,
                    dataIndex: 'skuName',
                    align: 'center',
                    width: 150
                },
                {
                    title: `${sldComLanguage('商品价格(¥)')}`,
                    dataIndex: 'salePrice',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('商品库存')}`,
                    dataIndex: 'skuStock',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('sku')}`,
                    dataIndex: 'sku',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 100,
                    render: (text, record) => {
                        console.log(this.state.viewFlag)
                        const {viewFlag} = this.state
                        return (
                            viewFlag?
                                <div>
                                --
                                </div>
                                :
                                <div
                                    onClick={() => this.delGoods(record.sku)}
                                    className={`${promotion.coupon_goods_operate} ${global.flex_row_center_center}`}
                                    style={{display:`${this.viewFlag?'none':'block'}`}}
                                >
                                    <ALibbSvg fill="#2d2d2d" width={18} height={18} type="shanchu5" />
                                </div>
                        )
                    }
                }
            ],
            goodsLoading:false
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

  //获取满N件折扣详情
  get_detail = async (id) => {
      const { dispatch } = this.props;
      let { detail, ladder_promotion,query } = this.state;
      let _this = this;
      let cacheVoucher = [];
      dispatch({
          type: 'promotion/get_full_nld_detail',
          payload: { fullId: id },
          callback: async (res) => {
              if (res.state == 200) {
                  detail = res.data;
                  //清除时间数据，防止带入已结束的时间段
                  if(query.tar == 'copy'){
                      detail.startTime='';
                      detail.endTime=''
                  }
                  detail.ruleList.forEach((item, index) => {
                      if (index == 0) {
                          ladder_promotion[0].fullValue = item.fullValue;
                          ladder_promotion[0].minusValue = item.minusValue;
                          //初始化选中的优惠券数据
                          if (item.couponList != null && item.couponList.length != undefined && item.couponList.length > 0) {
                              ladder_promotion[0].sel_voucher = item.couponList[0];
                              ladder_promotion[0].sendCouponIds = true;
                          }
                          //初始化选中的商品数据
                          if (item.giftList != null && item.giftList.length != undefined && item.giftList.length > 0) {
                              ladder_promotion[0].sel_goods = item.giftList[0];
                              ladder_promotion[0].sendSkus = true;
                          }
                      } else {
                          ladder_promotion.push({
                              fullValue: item.fullValue,
                              minusValue: item.minusValue,
                              sel_voucher: item.couponList != null && item.couponList.length != undefined && item.couponList.length > 0 ? item.couponList[0] : {},
                              sendCouponIds: item.couponList != null && item.couponList.length != undefined && item.couponList.length > 0 ? true : false,
                              sel_goods: item.giftList != null && item.giftList.length != undefined && item.giftList.length > 0 ? item.giftList[0] : {},
                              sendSkus: item.giftList != null && item.giftList.length != undefined && item.giftList.length > 0 ? true : false,
                              key: index+1
                          });
                          _this.key += 1;
                      }
                      // 将接口返回的优惠券信息缓存下来 用来判断复制状态下优惠券是否过期
                      if(item.couponList != null && item.couponList.length != undefined && item.couponList.length > 0){
                          cacheVoucher.push(item.couponList[0])
                      }
                  });
                  if(detail.useType==2){
                      if(detail.skuList.length>0){
                          this.get_goods_list_all(detail.skuList)
                      }
                  }
                  this.setState({
                      detail, ladder_promotion,cacheVoucher,
                      useType: detail.useType //适用商品类型
                  });
              } else {
                  failTip(res.msg);
              }
          }
      });
  };

// 根据skus获取商品
get_goods_list_group = (skus)=>new Promise((resolve) => {
    const { dispatch } = this.props;
    let new_params = { pageSize:100, pageIndex: 1,skus: skus,storeId };
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

get_goods_list_all =async (skuList)=>{
    this.setState({
        goodsLoading:true
    })
    let selectedRows = []
    let selectedRowKeys = []
    let skuGroup = _chunk(skuList,100)
    const promises = skuGroup.map(skus => this.get_goods_list_group(skus));
    for (const promise of promises) {
        const column = await promise;
        selectedRows = selectedRows.concat(column)
    }

    selectedRows.forEach(item => {
        selectedRowKeys.push(item.sku);
    });
    this.sele_more_goods.info = selectedRows;
    this.sele_more_goods.ids = selectedRowKeys;
    this.setState({
        selectedRows,
        selectedRowKeys,
        goodsLoading:false
    });

}

  handleSelectRows = (rows, rowkeys) => {
      this.setState({
          selectedRows: rows,
          selectedRowKeys: rowkeys
      });
  };


  //保存并新增事件
  handleSaveAllData = () => {
      const { dispatch } = this.props;
      const { query, ladder_promotion, minusValueMap,cacheVoucher,selectedRows } = this.state;
      let param = {};
      this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              param.fullName = values.fullName;
              //活动时间处理
              if (values.activityTime) {
                  param.startTime = values.activityTime[0] ? values.activityTime[0].format(dateTimeFormat) : '';
                  param.endTime = values.activityTime[1] ? values.activityTime[1].format(dateTimeFormat) : '';
              }

              //活动开始时间必须小于结束时间
              if(Date.parse(param.startTime) >= Date.parse(param.endTime)){
                  failTip(`${sldComLanguage('活动开始时间必须小于结束时间')}`);
                  return false;
              }

              let rule_data = [];
              let submitStatus=true;
              for (let i = 0; i < ladder_promotion.length; i++) {
                  let item = ladder_promotion[i];
                  let minusValue = values[`minusValue_${item.key}`];
                  let sendSkus = item.sel_goods.sku != undefined ? item.sel_goods.sku : '';
                  let sendCouponIds = item.sel_voucher.couponId != undefined && item.sel_voucher.couponId > 0 ? item.sel_voucher.couponId : '';
                  //校验优惠内容必须有其中一个，否则无法提交
                  if (!sendCouponIds && !sendSkus && (minusValue == undefined || !minusValue)) {
                      failTip(`${sldComLanguage('请设置')}${i + 1}${sldComLanguage('级优惠的优惠内容')}`);
                      return false;
                  }
                  rule_data.push({
                      fullValue: values[`fullValue_${item.key}`],
                      minusValue: minusValue,
                      sendIntegral: 0,
                      sendCouponIds: sendCouponIds,
                      sendSkus: sendSkus
                  });
                  if(i>0 && rule_data[i].fullValue<rule_data[i-1].fullValue){
                      submitStatus=false;
                      failTip(`第${minusValueMap[i]}阶梯的优惠门槛不能低于第${minusValueMap[i-1]}阶梯的优惠门槛`);
                      break;
                  }
                  if(i>0 && rule_data[i].minusValue>rule_data[i-1].minusValue){
                      submitStatus=false;
                      failTip(`第${minusValueMap[i]}阶梯的打折力度不能低于第${minusValueMap[i-1]}阶梯的打折力度`);
                      break;
                  }
              }
              if(!submitStatus){
                  return;
              }
              if(query.id != undefined && query.id > 0 && query.tar == 'copy'){
                  let errMsg = []
                  rule_data.forEach((item)=>{
                      let ele = cacheVoucher.find((e)=>e.couponId == item.sendCouponIds);
                      if(ele && ele.couponStock==0){
                          errMsg.push(ele.couponName)
                      }
                  })
                  if(errMsg.length>0){
                      const rdom = (<p style={{whiteSpace:'pre-line'}}>{`${errMsg.join('，')}已领完,请重新选择`}</p>)
                      message.warning(rdom,6);
                      errMsg = [];
                      return false
                  }
              }
              param.ruleJson = JSON.stringify(rule_data);
              let dis_type = '';
              //适用商品类型为指定商品
              param.useType = values.useType
              if (values.useType == 2) {
                  if(selectedRows.length==0){
                      failTip(sldComLanguage('请选择指定商品'));
                      return false;
                  }
                  if(selectedRows.length>200){
                      failTip(sldComLanguage('指定商品数量超过200!'));
                      return false;
                  }  
                  let params = [];
                  selectedRows.forEach((item)=>{
                      params.push({
                          "sku": item.sku,
                          "skuName": item.skuName
                      })
                  })
                  param.productInfoVOList = params;
              }
              sthis.setState({ loading: true });
              if (query.id != undefined && query.id > 0 && query.tar == 'edit') {
                  //编辑满N件折扣
                  param.fullId = query.id;
                  dis_type = 'promotion/edit_full_nld';
              } else {
                  //新增满N件折扣
                  dis_type = 'promotion/add_full_nld';
              }
              dispatch({
                  type: dis_type,
                  payload: param,
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

  //返回上个页面
  backPre = () => {
      this.props.history.goBack();
  };


  addPromotion = () => {
      let { ladder_promotion } = this.state;
      ladder_promotion.push({ ...this.ladder_item, key: this.key + 1 });
      this.key += 1;
      this.setState({ ladder_promotion });
  };

  /*
  * 送赠品/送优惠券事件
  * type goods:赠品 voucher:优惠券  val 当前操作的优惠信息
  *
  * */
  handleGoodsOrVoucher = (type, e, val) => {
      this.itemKey = val.key;
      if (e.target.checked) {
          this.setState({ link_type: type, curData: val });
      } else {
          let { ladder_promotion } = this.state;
          let tmp_data = ladder_promotion.filter(item => item.key == val.key)[0];
          if (type == 'goods') {
              tmp_data.sel_goods = {};
          } else if (type == 'voucher') {
              tmp_data.sel_voucher = {};
          }
          this.setState({
              ladder_promotion: JSON.parse(JSON.stringify(ladder_promotion))
          });
      }
  };

  resetSel = (type,val) => {
      this.setState({ link_type: type,curData: val });
  };

  //选择商品或者优惠券取消事件
  sldHandleLinkCancle = () => {
      let { link_type } = this.state;
      if (link_type == 'goods') {
      // this.props.form.resetFields(['sendSkus']);
          this.props.form.resetFields([`sendGoodsIds_${this.itemKey}`]);
      } else if (link_type == 'voucher') {
      // this.props.form.resetFields(['sendCouponIds']);
          this.props.form.resetFields([`sendCouponIds_${this.itemKey}`]);
      }
      this.setState({ link_type: '' });
  };

  //商品或优惠券选中事件
  seleSku = (val) => {
      let { link_type, curData, ladder_promotion } = this.state;
      let tar_data = ladder_promotion.filter(item => item.key == curData.key)[0];
      if (link_type == 'goods') {
          tar_data.sel_goods = val;
      } else if (link_type == 'voucher') {
          tar_data.sel_voucher = val;
      }
      this.setState({ link_type: '', ladder_promotion: JSON.parse(JSON.stringify(ladder_promotion)), curData: {} });
  };

  //删除阶梯优惠券
  delPromotion = (key) => {
      let { ladder_promotion } = this.state;
      ladder_promotion = ladder_promotion.filter(item => item.key != key);
      this.setState({ ladder_promotion: JSON.parse(JSON.stringify(ladder_promotion)) });
  };
  
  //控制日历组件时间的选择范围
  range = (start, end) => {
      const result = [];
      for (let i = start; i < end; i++) {
          result.push(i);
      }
      return result;
  };

//控制日历组件时间的选择范围
disabledRangeTime = (date, type) => {
    if (type === 'start') {
        let sameDay = false,
            sameHour = false;
        if (date && date.length > 0) {
            sameDay = date[0].isSame(moment(), 'day')
            sameHour = date[0].isSame(moment(), 'hour')
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
    }
};

//适用商品选择事件
handleUseType = (e) => {
    let { modalVisibleGoods, sle_more_title, selectedRows, selectedRowKeys } = this.state;
    //重置数据
    this.sele_more_goods = {
        info: [],
        ids: [],
        min_num: 1
    };
    selectedRows = [];
    selectedRowKeys = [];

    if (e.target.value == 2) {
        modalVisibleGoods = true;
        sle_more_title = `${sldComLanguage('选择商品(最少选择1个)')}`;
    }
    this.setState({
        sle_more_title,
        modalVisibleGoods,
        useType: e.target.value,
        selectedRows,
        selectedRowKeys
    });
};

skuHandleCancle = () => {
    this.setState({
        modalVisibleGoods: false
    });
};

//商品多选-回调事件
seleGoods = (selectedRows, selectedRowKeys) => {
    this.sele_more_goods.ids = [...selectedRowKeys];
    this.sele_more_goods.info = JSON.parse(JSON.stringify(selectedRows));
    this.setState({
        selectedRows: selectedRows,
        selectedRowKeys: selectedRowKeys
    });
    this.skuHandleCancle();
};

//商品删除事件
delGoods = (sku) => {
    let { selectedRows, selectedRowKeys } = this.state;
    selectedRows = selectedRows.filter(item => item.sku != sku);
    selectedRowKeys = selectedRowKeys.filter(item => item != sku);
    this.sele_more_goods.ids = [...selectedRowKeys];
    this.sele_more_goods.info = JSON.parse(JSON.stringify(selectedRows));
    this.setState({
        selectedRows: selectedRows,
        selectedRowKeys: selectedRowKeys
    });
};

resetSelGoods = () => {
    this.setState({
        modalVisibleGoods: true,
        sle_more_title: `${sldComLanguage('选择商品(最少选择1个)')}`
    });
};

refuseEvent = (auditReason)=>{
    // 审核拒绝或通过,0-拒绝,1-通过
    this.fullNldAudit({state:0,auditReason})
}

successEvent = ()=>{
    this.fullNldAudit({state:1})
}

fullNldAudit = (param)=>{
    const { query:{id} } = this.state
    const { dispatch } = this.props;
    param.fullId = id
    dispatch({
        type: 'promotion/fullNld_audit',
        payload: param,
        callback: (res) => {
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

render() {
    const {
        loading,ladder_promotion, link_type, detail, viewFlag,sle_more_title,modalVisibleGoods,useType,columns_spu,selectedRows,goodsLoading,query:{tar}
    } = this.state;
    let {
        form: { getFieldDecorator }
    } = this.props;
    return (
        <div
            className={`${promotion.full_activity} ${global.common_page} ${global.com_flex_column}`}
            style={{ position: 'relative' }}
        >
            <AuthBtn btnAuth={btnAuth} eventKey={["full_nld_view"]} showPage>
                
                <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
                    {sldLlineRtextAddMargin('#FA6F1E', `${sldComLanguage('满N件折扣活动')}`, 0, 0, 10)}
                    {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
                </div>
                {getSldHorLine(1)}
                <Spin spinning={loading}>
                    <Form layout="inline">
                        <Scrollbars
                            autoHeight
                            autoHeightMin={100}
                            autoHeightMax={document.body.clientHeight - 160}
                        >
                            <div className={`${global.goods_sku_tab} ${global.add_goods_wrap}`}>
                                {/* 基本信息-start */}
                                <div>
                                    {getSldEmptyH(10)}
                                    {sldCommonTitleByBg(`${sldComLanguage('活动基本信息')}`)}
                                    <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: 'red' }}>*</span>{sldComLanguage('活动名称')}
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    extra={`${sldComLanguage('最多输入20个字')}`}
                                                    style={{ width: 300 }}
                                                >
                                                    {getFieldDecorator('fullName', {
                                                        initialValue: detail.fullName, rules: [{
                                                            required: true,
                                                            whitespace: true,
                                                            message: `${sldComLanguage('请输入活动名称')}`
                                                        }]
                                                    })(
                                                        <Input maxLength={20} disabled={viewFlag} style={{ width: 400 }} placeholder={`${sldComLanguage('请输入活动名称')}`} />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>

                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: 'red' }}>*</span>{sldComLanguage('活动时间')}
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    extra={`${sldComLanguage('活动时间不可与其他活动重叠')}`}
                                                    style={{ width: 300 }}
                                                >
                                                    {getFieldDecorator('activityTime', {
                                                        initialValue: detail.startTime != undefined && detail.startTime
                                                            ? [moment(detail.startTime, dateTimeFormat), moment(detail.endTime, dateTimeFormat)]
                                                            : '', rules: [{
                                                            required: true,
                                                            message: `${sldComLanguage('请选择活动时间')}`
                                                        }]
                                                    })(
                                                        <RangePicker
                                                            disabled={viewFlag}
                                                            disabledDate={(current)=> current< moment().startOf('day')}
                                                            disabledTime={this.disabledRangeTime}
                                                            style={{ width: 400 }}
                                                            placeholder={[`${sldComLanguage('开始时间')}`, `${sldComLanguage('结束时间')}`]}
                                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                                            getCalendarContainer={(triggerNode)=>triggerNode.parentNode}
                                                        />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                        
                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: 'red' }}>*</span>{sldComLanguage('适用商品')}
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    style={{ width: 400 }}
                                                >
                                                    {getFieldDecorator('useType', {
                                                        initialValue: detail.useType?detail.useType:useType
                                                    })(
                                                        <RadioGroup size="small" disabled={viewFlag} onChange={(e) => this.handleUseType(e)}>
                                                            <Radio value={1}>{sldComLanguage('全部商品可用')}</Radio>
                                                            <Radio value={2}>{sldComLanguage('指定商品可用')}</Radio>
                                                        </RadioGroup>,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>

                                        {
                                            useType == 2 &&
                                                <div className={`${promotion.item} ${global.flex_row_start_start}`} style={{width:'90%'}}>
                                                    <div className={`${promotion.left}`}>
                                                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('已选择商品')}
                                                    </div>
                                                    <div className={`${promotion.right}`}>
                                                        <span
                                                            className={`${promotion.reset_sel}`}
                                                            onClick={() => this.resetSelGoods()}
                                                            style={{display:`${viewFlag?'none':'block'}`}}
                                                        >{sldComLanguage('重新选择')}</span>
                                                        <Scrollbars
                                                            autoHeight
                                                            autoHeightMax={300}
                                                        >
                                                            <Table
                                                                rowKey="sku"
                                                                pagination={false}
                                                                columns={columns_spu}
                                                                dataSource={selectedRows}
                                                                size="small"
                                                                loading={goodsLoading}
                                                            />
                                                        </Scrollbars>
                                                    </div>
                                                </div>
                                        }

                                        {ladder_promotion.map((item, index) => <Fragment key={index}>
                                            {getSldEmptyH(15)}
                                            <div className={`${promotion.common_title_bg} ${global.flex_row_between_center}`}>
                                                <span className={`${promotion.title}`}>{`${num_to_num()[index + 1]}${sldComLanguage('级优惠')}`}</span>
                                                {index > 0 &&
                            <div className={`${promotion.del_ladder_pro}`} onClick={() => this.delPromotion(item.key)}>
                                <ALibbSvg
                                    fill="#c8c8c8"
                                    width={18}
                                    height={18}
                                    type="qingchu"
                                />
                            </div>}
                                            </div>
                                            <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                <div className={`${promotion.left}`}>
                                                    <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠门槛')}
                                                </div>
                                                <div className={`${promotion.right}`}>
                                                    <FormItem
                                                        extra={`${sldComLanguage('以件为单位，设置使用该活动的最低件数')}`}
                                                    >
                                                        {getFieldDecorator(`fullValue_${item.key}`, {
                                                            initialValue: item.fullValue, rules: [{
                                                                required: true,
                                                                message: `${sldComLanguage('请输入优惠门槛')}`
                                                            }]
                                                        })(
                                                            <InputNumber disabled={viewFlag} style={{ width: 400 }} min={1} max={9999999} precision={0} />,
                                                        )}
                                                    </FormItem>
                                                </div>
                                            </div>

                                            <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                <div className={`${promotion.left}`}>
                                                    <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠内容')}
                                                </div>
                                                <div className={`${promotion.right} ${global.flex_column_start_start}`}>
                                                    <FormItem
                                                        style={{ width: 300 }}
                                                        extra={`${sldComLanguage('优惠折扣，满足优惠门槛后可以享受该优惠折扣，例如：输入90代表9折')}`}
                                                    >
                                                        <span
                                                            style={{ marginRight: 10 }}
                                                        >{sldComLanguage('打')}</span>{getFieldDecorator(`minusValue_${item.key}`, { initialValue: item.minusValue })(
                                                            <InputNumber disabled={viewFlag} style={{ width: 100 }} min={1} max={100} precision={0} />,
                                                        )}<span style={{ marginLeft: 10 }}>{sldComLanguage('折')}</span>
                                                    </FormItem>

                                                    {getSldEmptyH(10)}
                                                    <FormItem
                                                        style={{ width: 300 }}
                                                    >
                                                        {getFieldDecorator(`sendCouponIds_${item.key}`, {
                                                            initialValue: item.sel_voucher.couponId != undefined && item.sel_voucher.couponId?true:false,
                                                            valuePropName: 'checked'
                                                        })(
                                                            <Checkbox
                                                                disabled={viewFlag}
                                                                onChange={(e) => this.handleGoodsOrVoucher('voucher', e, item)}
                                                            >
                                                                {sldComLanguage('送优惠券')}
                                                            </Checkbox>,
                                                        )}
                                                        {item.sel_voucher.couponId != undefined && item.sel_voucher.couponId && !viewFlag &&
                                <span
                                    className={`${promotion.reset_sel}`}
                                    onClick={() => this.resetSel('voucher',item)}
                                >{sldComLanguage('重新选择')}</span>
                                                        }
                                                    </FormItem>
                                                    {item.sel_voucher.couponId != undefined && item.sel_voucher.couponId &&
                                <div className={`${promotion.sel_goods} ${global.flex_column_start_start}`}>
                                    <div className={`${global.flex_row_start_center}`}><span
                                        className={`${promotion.sel_tip}`}
                                    >{sldComLanguage('您已选择如下优惠券：')}</span></div>
                                    <div className={`${promotion.goods_info} ${global.flex_row_start_center}`}>
                                        <div className={`${promotion.left} ${global.flex_row_center_center}`}><img
                                            src={require('../../../assets/voucher.png')}
                                        /></div>
                                        <div className={`${global.flex_column_between_start}`}>
                                            <span className={`${promotion.goods_name}`}>{sldComLanguage('优惠券')}</span>
                                            <span className={`${promotion.goods_price}`}>{item.sel_voucher.couponName}</span>
                                        </div>
                                    </div>
                                </div>
                                                    }
                                                    {getSldEmptyH(10)}
                                                    {/* <FormItem
                                style={{ width: 700 }}
                                >
                                {getFieldDecorator(`sendGoodsIds_${item.key}`, {
                                    initialValue: item.sel_goods.sku != undefined && item.sel_goods.sku?true:false,
                                    valuePropName: 'checked',
                                })(
                                    <Checkbox
                                    disabled={viewFlag}
                                    onChange={(e) => this.handleGoodsOrVoucher('goods', e, item)}
                                    >
                                    {sldComLanguage('送赠品')}
                                    </Checkbox>,
                                )}
                                {item.sel_goods.sku != undefined && item.sel_goods.sku && !viewFlag &&
                                <span className={`${promotion.reset_sel}`}
                                        onClick={() => this.resetSel('goods',item)}>{sldComLanguage('重新选择')}</span>
                                }
                                </FormItem> */}
                                                    {/* {item.sel_goods.sku != undefined && item.sel_goods.sku &&
                                <div className={`${promotion.sel_goods} ${global.flex_column_start_start}`}>
                                <div className={`${global.flex_row_start_center}`}><span
                                    className={`${promotion.sel_tip}`}>{sldComLanguage('您已选择如下赠品：')}</span></div>
                                <div className={`${promotion.goods_info} ${global.flex_row_start_center}`}>
                                    <div className={`${promotion.left} ${global.flex_row_center_center}`}><img
                                    src={item.sel_goods.mainImgUrl || item.sel_goods.mainImage}/></div>
                                    <div className={`${global.flex_column_between_start}`}>
                                    <span className={`${promotion.goods_name}`}>{sldComLanguage('赠品')}</span>
                                    <span className={`${promotion.goods_price}`}>{item.sel_goods.skuName}</span>
                                    </div>
                                </div>
                                </div>
                                } */}
                                                </div>
                                            </div>
                                        </Fragment>)}

                                        {ladder_promotion.length < 5 && !viewFlag &&
                        <div className={`${global.flex_row_start_center} ${promotion.add_new}`}>
                            {sldIconBtn(() => this.addPromotion(), `${sldComLanguage('添加下级优惠')}`, 7, 7)}
                            <span className={`${promotion.add_new_tip}`}>{sldComLanguage('提醒：每级优惠不叠加，如：满足二级优惠条件后则不再享有一级优惠，最多支持5级优惠~')}</span>
                        </div>
                                        }

                                    </div>
                                </div>
                                {/* 基本信息-end */}
                            </div>
                            {
                                ['view','audit'].includes(tar) && <ReviewLog type='project/getfullRecord' params={{fullId:this.state.query.id}} />
                            }
                            {getSldEmptyH(15)}
                            <div
                                className={global.m_diy_bottom_wrap}
                                style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}
                            >
                                {/* {['view','copy','edit'].includes(tar) && <Button onClick={() => this.props.history.goBack()} style={{marginRight:20}}>返回</Button>} */}
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
                                {
                                    tar == 'audit' && hasAuth('full_nld_audit')&&
                                    <ReviewButton 
                                        refuseText='审核拒绝'
                                        refuseTitle='确定拒绝该条满N件折扣活动么?'
                                        refuseEvent={this.refuseEvent}
                                        successText='审核通过'
                                        successTitle='确定通过该条满N件折扣活动么?'
                                        successEvent={this.successEvent}
                                    />
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
                /> 
                {/*商品多选的modal框-start*/}
                <SldSelMoreLeftRightGoods 
                    selectedRows={this.sele_more_goods.info}
                    selectedRowKeys={this.sele_more_goods.ids}
                    modalVisible={modalVisibleGoods}
                    width={1000}
                    height={document.body.clientHeight - 400}
                    sldHandleSeleMoreModalCancle={this.skuHandleCancle}
                    seleSvideo={this.seleGoods}
                    title={sle_more_title}
                    extra={this.sele_more_goods}
                />
            </AuthBtn>

        </div>
    );
}
}
