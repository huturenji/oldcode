import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, Input, InputNumber, Radio, DatePicker, Table, Empty,Select,Popconfirm } from 'antd';
import {
    failTip,
    sucTip,
    sldLlineRtextAddGoodsAddMargin,
    sldComLanguage,
    dateTimeFormat,
    sldCommonTitleByBg,
    getSldHorLine,
    getSldEmptyH,
    getSldComImg
} from '@/utils/utils';
import { coupon_link_type } from '@/utils/util_data';
import global from '@/global.less';
import SldSelMoreLeftRightGoods from '@/components/SldSelMoreLeftRightGoodsSku';
import promotion from '@/assets/css/promotion.less';
import ALibbSvg from '@/components/ALibbSvg';
import SelectMemberPop from '@/components/SelectMemberPop';
import moment from 'moment';

let sthis = '';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
// eslint-disable-next-line no-shadow
@connect(({ promotion, global }) => ({
    promotion, global
}))
@Form.create()
export default class AddCoupon extends Component {
  sele_more_goods = {
      info: [],//选择的商品数组
      ids: [],//选择的商品id数组
      min_num: 1,//最小数量，0为不限制
      max_num: 10000//最多选择10000个
  };

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
        link_data:{url_type:'',url:'',wx_url:'',info:''},
        link_type:'',
        enableFlag: 0,//优惠券开关
        isFirstLoading: true,//是否第一次加载
        coupon_detail: {},//优惠券详情
        checkedCatIds: [],//选择的分类id数组
        useType: 1,//适用商品类型
        useTimeType: 1,//使用时间类型
        curCouponType: 1,//当前选择的优惠券类型
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
                title: `${sldComLanguage('操作')}`,
                align: 'center',
                width: 100,
                render: (text, record) => <div
                    onClick={() => this.delGoods(record.sku)}
                    className={`${promotion.coupon_goods_operate} ${global.flex_row_center_center}`}
                >
                    <ALibbSvg fill="#2d2d2d" width={18} height={18} type="shanchu5" />
                </div>
            }
        ],
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
        ]
    };
}

componentDidMount() {
    const { query } = this.state;
    if (query.id != undefined && query.id > 0) {
        this.get_detail(query.id);
    } else {
        this.setState({ isFirstLoading: false });
    }
    this.checkCouponState();
}

componentWillUnmount() {
}

  //获取优惠券详情
  get_detail = async (id) => {
      const { dispatch } = this.props;
      let { checkedCatIds, query, publishType } = this.state;
      this.setState({ loading: true });
      dispatch({
          type: 'promotion/get_coupon_detail',
          payload: { couponId: id },
          callback: async (res) => {
              if (res.state == 200) {
                  if (res.data.useType == 2) {
                      this.get_goods_list(id);//获取商品列表
                  }
                  if (res.data.useType == 3) {
                      res.data.goodsCategoryList.forEach(item => {
                          let tar_id = item.categoryId3;
                          tar_id = tar_id ? tar_id : item.categoryId2;
                          tar_id = tar_id ? tar_id : item.categoryId1;
                          checkedCatIds.push(tar_id);
                      });
                  }
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
                      res.data.couponName = '';//清空优惠券名称
                      res.data.publishStartTime = '';//清空优惠券的活动时间
                      if (res.data.effectiveTimeType == 1) {
                          //如果是固定使用时间，需要清空使用时间
                          res.data.effectiveStart = '';
                      }
                  }
                  publishType = res.data.publishType;//获取方式
                  let link_data,val,name
                  if (res.data.linkInfo){
                      link_data = JSON.parse(res.data.linkInfo)
                      val = link_data?.url_type
                      this.selectLink(val,link_data)
                      this.getDetailItemHideLabel(link_data)
                  } else {
                      val = ""
                      this.selectLink(val)
                  }
                  name = coupon_link_type().filter(item=>item.key == val)[0]?.name
                  this.setState({
                      coupon_detail: res.data,
                      linkName:name,
                      loading: false,
                      useTimeType: res.data.effectiveTimeType,//使用时间类型
                      useType: res.data.useType,//适用商品类型
                      curCouponType: res.data.couponType,//优惠券类型
                      checkedCatIds,
                      publishType
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

  get_goods_list = (id) => {
      let { selectedRows, selectedRowKeys } = this.state;
      const { dispatch } = this.props;
      dispatch({
          type: 'promotion/get_coupon_goods_list',
          payload: { couponId: id },
          callback: async (res) => {
              if (res.state == 200) {
                  if (res.data.list.length > 0) {
                      selectedRows = res.data.list;
                      selectedRows.forEach(item => {
                          item.mainImage = item.goodsImage;
                          selectedRowKeys.push(item.sku);
                      });
                  }
                  this.sele_more_goods.info = selectedRows;
                  this.sele_more_goods.ids = selectedRowKeys;
                  this.setState({
                      selectedRows,
                      selectedRowKeys
                  });
              }
          }
      });
  };

  resetSelGoods = () => {
      this.setState({
          modalVisibleGoods: true,
          sle_more_title: `${sldComLanguage('选择商品(最少选择1个)')}`
      });
  };

  resetSelMembers = () => {
      this.setState({
          modalVisibleMember: true,
          sle_more_title: `${sldComLanguage('指定会员发放(最少选择1个)')}`
      });
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

  handleSelectRows = (rows, rowkeys) => {
      this.setState({
          selectedRows: rows,
          selectedRowKeys: rowkeys
      });
  };

  //验证优惠券开关
  checkCouponState = () => {
      const { dispatch } = this.props;
      dispatch({
          type: 'common/getSetting',
          payload: { str: 'coupon_is_enable' },
          callback: (res) => {
              if (res.state == 200) {
                  this.setState({ enableFlag: res.data[0].value, isFirstLoading: false });
              }
          }
      });
  };

  //保存并新增事件
  handleSaveAllData = async () => {
      const { dispatch } = this.props;
      const { query, selectedRowKeys,selectedRows, selectedMemberRows,publishType,link_data,coupon_detail } = this.state;
      this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              if(publishType == 1||publishType == 6){
                  //免费领取优惠券——活动时间处理
                  if (values.publishTime) {
                      values.publishStartTime = values.publishTime[0] ? values.publishTime[0].format(dateTimeFormat) : '';
                      values.publishEndTime = values.publishTime[1] ? values.publishTime[1].format(dateTimeFormat) : '';
                      delete values.publishTime;
                  }
              }

              //使用时间处理
              if (values.effectiveTime) {
                  values.effectiveStart = values.effectiveTime[0] ? values.effectiveTime[0].format(dateTimeFormat) : '';
                  values.effectiveEnd = values.effectiveTime[1] ? values.effectiveTime[1].format(dateTimeFormat) : '';
                  delete values.effectiveTime;
              }

              //适用商品类型为指定商品
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
                          "skuName": item.skuName,
                          "categoryId3": item.categoryId3,
                          "categoryName3": "",
                          "grade": ""
                      })
                  })
                  values.productInfoVOList = params;
              }
          
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
                  values.limitReceive = 0;//活动赠送和密码领取的优惠券不限制会员领取的数量
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
              if(values.linkInfo == "无操作"){
                  values.linkInfo = coupon_detail.linkInfo
              }
              if(link_data.url_type){
                  values.linkInfo = JSON.stringify(link_data)
              }
              let dis_type = '';
              if (query.id != undefined && query.id > 0 && query.type == 'edit') {
                  //编辑优惠券
                  values.couponId = query.id;
                  dis_type = 'promotion/edit_coupon';
              } else {
                  //新增优惠券
                  dis_type = 'promotion/add_coupon';
              }
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

  sldHandleCancle = () => {
      this.setState({
          modalVisibleGoods: false
      });
  };

  memberPopCancle = () => {
      this.setState({
          modalVisibleMember: false
      });
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

  //商品多选-回调事件
  seleGoods = (selectedRows, selectedRowKeys) => {
      this.sele_more_goods.ids = [...selectedRowKeys];
      this.sele_more_goods.info = JSON.parse(JSON.stringify(selectedRows));
      this.setState({
          selectedRows: selectedRows,
          selectedRowKeys: selectedRowKeys
      });
      this.sldHandleCancle();
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

  //优惠券类型选择  1 满减券 2 折扣券 3 随机金额券
  handleCouponType = (e) => {
      this.setState({ curCouponType: e.target.value });
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

  selectLink = (val,link_data)=>{
      let data = {};
      if (val == '') {
      //无操作
          data.url = link_data?.url || ''; //链接
          data.wx_url = link_data?.wx_url || ''; //微信链接
          data.url_type = ''; //链接类型
          data.info = link_data?.info || ''; //用于存放额外信息
      }else if(val == 'url'){
      //链接地址
          data.url = link_data?.url || '';
          data.wx_url = link_data?.wx_url || ''; //微信链接     
          data.url_type = 'url';
          data.info = link_data?.info || '';
      }else if (val == 'openBbcPage_url') {
      //非同域链接地址
          data.url = link_data?.url || '';
          data.wx_url = link_data?.wx_url || ''; //微信链接
          data.url_type = 'openBbcPage_url';
          data.info = link_data?.info || '';
      }
      this.setState({ link_data: data });
  }

  getDetailItemHideLabel = (data) => {
      let htmlElement = '';
      if (data.url_type == '') {
          htmlElement = null;
      }else if(data.url_type == 'url'||data.url_type == 'openBbcPage_url'){
          htmlElement = 
        <div key={`${data.url_type}`}>
            <div>
                <Input
                    defaultValue={data.url}
                    placeholder="请输入H5链接地址"
                    onChange={(e) => this.onChange(e.target.value, 'url')}
                />
            </div>
            <div style={{marginTop:'10px'}}>
                <Input
                    defaultValue={data.wx_url}
                    placeholder="请输入微信小程序链接地址"
                    onChange={(e) => this.onChange(e.target.value, 'wx_url')}
                />
                <div style={{marginTop:'4px',fontSize:'12px',color:'rgba(0, 0, 0, 0.45)'}}>微信小程序专题地址 /views/topic/index?topicId=专题id </div>
            </div>
        </div>
      }
      return htmlElement
  }

  onChange = (e,type) => {
      let { link_data } = this.state;
      link_data[type] = e;
      this.setState({ link_data });
  } 

  render() {
      const {
          modalVisibleGoods,modalVisibleMember, sle_member_title, loading, sle_more_title, curCouponType, useTimeType, useType, columns_spu, columns_member, selectedRows, selectedMemberRows, coupon_detail, enableFlag, isFirstLoading, publishType, query,link_data,linkName
      } = this.state;
      let {
          form: { getFieldDecorator }
      } = this.props;
      return (
          <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
              {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('发布优惠券')}`, 0, 0, 10)}
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
                    {sldCommonTitleByBg(`${sldComLanguage('优惠券基本信息')}`)}
                    {getSldEmptyH(10)}
                    <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                            <div className={`${promotion.left}`}>
                                <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠券名称')}
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
                                            message: `${sldComLanguage('请输入优惠券名称')}`
                                        }]
                                    })(
                                        <Input
                                            maxLength={20}
                                            style={{ width: 400 }}
                                            placeholder={`${sldComLanguage('请输入优惠券名称')}`}
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
                                    extra={`${sldComLanguage('最多10000张，修改优惠券总量时只能增加不能减少，请谨慎设置')}`}
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
                                <span style={{ color: 'red' }}>*</span>{sldComLanguage('适用商品')}
                            </div>
                            <div className={`${promotion.right}`}>
                                <FormItem
                                    style={{ width: 400 }}
                                >
                                    {getFieldDecorator('useType', {
                                        initialValue: useType
                                    })(
                                        <RadioGroup size="small" onChange={(e) => this.handleUseType(e)}>
                                            <Radio value={1}>{sldComLanguage('全部商品可用')}</Radio>
                                            <Radio value={2}>{sldComLanguage('指定商品可用')}</Radio>
                                        </RadioGroup>,
                                    )}
                                </FormItem>
                            </div>
                        </div>

                        {useType == 2 &&
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                        <div className={`${promotion.left}`}>
                            <span style={{ color: 'red' }}>*</span>{sldComLanguage('已选择商品')}
                        </div>
                        <div className={`${promotion.right}`}>
                            <span
                                className={`${promotion.reset_sel}`}
                                onClick={() => this.resetSelGoods()}
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
                                />
                            </Scrollbars>
                        </div>
                    </div>
                        }

                        {(publishType == 1||publishType == 6)&&
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                        <div className={`${promotion.left}`}>
                            <span style={{ color: 'red' }}>*</span>{sldComLanguage('活动时间')}
                        </div>
                        <div className={`${promotion.right}`}>
                            <FormItem
                                style={{ width: 400 }}
                                extra={`${sldComLanguage('该时间为优惠券领取的起止时间')}`}
                            >
                                {getFieldDecorator('publishTime', {
                                    initialValue: coupon_detail.publishStartTime != undefined && coupon_detail.publishStartTime ? [moment(coupon_detail.publishStartTime, dateTimeFormat), moment(coupon_detail.publishEndTime, dateTimeFormat)] : [],
                                    rules: [{
                                        required: true,
                                        message: `${sldComLanguage('请选择活动时间')}`
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

                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                            <div className={`${promotion.left}`}>
                                <span style={{ color: 'red' }}>*</span>{sldComLanguage('使用时间')}
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
                                            <Radio value={3}>{sldComLanguage('活动赠送')}</Radio>
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

                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                            <div className={`${promotion.left}`}>
                                <span style={{ color: 'red' }}>*</span>{sldComLanguage('使用门槛')}
                            </div>
                            <div className={`${promotion.right}`}>
                                <FormItem
                                    style={{ width: 300 }}
                                    extra={`${sldComLanguage('订单满多少元时可以使用此优惠券，0元代表无使用门槛')}`}
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
                                <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠券类型')}
                            </div>
                            <div className={`${promotion.right}`}>
                                <FormItem
                                    style={{ width: 400 }}
                                >
                                    {getFieldDecorator('couponType', {
                                        initialValue: curCouponType
                                    })(
                                        <RadioGroup size="small" onChange={(e) => this.handleCouponType(e)}>
                                            <Radio value={1}>{sldComLanguage('满减券')}</Radio>
                                            <Radio value={2}>{sldComLanguage('折扣券')}</Radio>
                                            <Radio value={3}>{sldComLanguage('随机金额券')}</Radio>
                                        </RadioGroup>,
                                    )}
                                </FormItem>
                            </div>
                        </div>

                        {/* 选择满减券的优惠内容-start */}
                        {curCouponType == 1 &&
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                        <div className={`${promotion.left}`}>
                            <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠内容')}
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
                                            message: `${sldComLanguage('请输入优惠内容')}`
                                        }]
                                    })(
                                        <InputNumber
                                            max={99999999}
                                            min={0.01}
                                            precision={2}
                                            style={{ width: 140 }}
                                            placeholder={`${sldComLanguage('请输入优惠内容')}`}
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
                        {/* 选择满减券的优惠内容-end */}

                        {/* 选择折扣券的优惠内容-start */}
                        {curCouponType == 2 &&
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                        <div className={`${promotion.left}`}>
                            <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠内容')}
                        </div>
                        <div className={`${promotion.right}`}>
                            <FormItem
                                extra={`${sldComLanguage('输入90代表9折，85代表8.5折')}`}
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
                                            max={99999999}
                                            min={0}
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
                        {/* 选择折扣券的优惠内容-end */}


                        {/* 选择随机金额券的优惠内容-start */}
                        {curCouponType == 3 &&
                    <Fragment>
                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                            <div className={`${promotion.left}`}>
                                <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠内容')}
                            </div>
                            <div className={`${promotion.right}`}>
                                <FormItem
                                    style={{ width: 210, marginRight: 0 }}
                                >
                                    <div className={global.flex_row_start_center}>
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                marginRight: 5,
                                                color: 'rgba(0, 0, 0, 0.65)'
                                            }}
                                        >{sldComLanguage('范围内随机')}</span>
                                        {getFieldDecorator('randomMin', {
                                            initialValue: coupon_detail.randomMin, rules: [{
                                                required: true,
                                                message: `${sldComLanguage('请输入最小值')}`
                                            }]
                                        })(
                                            <InputNumber
                                                max={1000}
                                                min={0}
                                                precision={2}
                                                style={{ width: 140 }}
                                                placeholder={`${sldComLanguage('请输入最小值')}`}
                                            />,
                                        )}
                                    </div>
                                </FormItem>
                            </div>
                            <div>~</div>
                            <div className={`${promotion.right}`}>
                                <FormItem
                                    style={{ width: 300, marginLeft: 5 }}
                                >
                                    <div className={global.flex_row_start_center}>
                                        {getFieldDecorator('randomMax', {
                                            initialValue: coupon_detail.randomMax,
                                            rules: [{
                                                required: true,
                                                message: `${sldComLanguage('请输入最大值')}`
                                            }]
                                        })(
                                            <InputNumber
                                                max={1000}
                                                min={0.01}
                                                precision={2}
                                                style={{ width: 140 }}
                                                placeholder={`${sldComLanguage('请输入最大值')}`}
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
                                <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠总金额')}
                            </div>
                            <div className={`${promotion.right}`}>
                                <FormItem
                                    extra={`${sldComLanguage('本次生成的随机金额优惠券的金额之和')}`}
                                    style={{ width: 300 }}
                                >
                                    <div className={global.flex_row_start_center}>
                                        {getFieldDecorator('publishAmount', {
                                            initialValue: coupon_detail.publishAmount, rules: [{
                                                required: true,
                                                message: `${sldComLanguage('请输入优惠总金额')}`
                                            }]
                                        })(
                                            <InputNumber
                                                max={5000000}
                                                min={0.01}
                                                precision={0}
                                                style={{ width: 140 }}
                                                placeholder={`${sldComLanguage('请输入优惠总金额')}`}
                                            />,
                                        )}
                                    </div>
                                </FormItem>
                            </div>
                        </div>
                    </Fragment>
                        }
                        {/* 选择随机金额券的优惠内容-end */}
                        {/* 配置优惠券链接地址-start */}
                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                            <div className={`${promotion.left}`}>
                                <span style={{ color: 'red' }} />{sldComLanguage('跳转链接')}
                            </div>
                            <div className={`${promotion.right}`}>
                                <FormItem
                                    style={{ width: 400 }}
                                    extra={<div>
                                        <div>{sldComLanguage('优惠券去使用跳转链接配置')}</div>
                                    </div>}
                                >
                                    {getFieldDecorator('linkInfo', {
                                        initialValue:linkName
                                    })(
                                        <Select
                                            placeholder="请选择链接类型"
                                            onSelect={(e) => this.selectLink(e)}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                        >
                                            {
                                                coupon_link_type().map((item,index)=><Option key={index} value={item.key}>{item.name}</Option>)
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                <div>
                                    {this.getDetailItemHideLabel(link_data)}
                                </div>
                            </div>
                        </div>

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
                                            initialValue: coupon_detail.description ? coupon_detail.description : useType==1 ? '全部商品可用' : '指定商品可用', rules: [{
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
                            <span>{sldComLanguage('优惠券模块暂未开启')}</span>
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

              {/*商品多选的modal框-start*/}
              <SldSelMoreLeftRightGoods 
                  selectedRows={this.sele_more_goods.info}
                  selectedRowKeys={this.sele_more_goods.ids}
                  modalVisible={modalVisibleGoods}
                  width={1000}
                  height={document.body.clientHeight - 400}
                  sldHandleSeleMoreModalCancle={this.sldHandleCancle}
                  seleSvideo={this.seleGoods}
                  title={sle_more_title}
                  extra={this.sele_more_goods}
              />
              {/*商品多选的modal框-end*/}


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
      );
  }
}
