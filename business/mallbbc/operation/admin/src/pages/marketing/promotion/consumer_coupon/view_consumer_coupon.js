import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, Table } from 'antd';
import router from 'umi/router';
import {
    sldLlineRtextAddGoodsAddMargin,
    sldComLanguage,
    sldCommonTitleByBg,
    getSldHorLine,
    getSldEmptyH,
    sldIconBtnBg,
    setSession,
    failTip
} from '@/utils/utils';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';

// eslint-disable-next-line no-shadow
@connect(({ consumer_coupon, global }) => ({
    consumer_coupon, global
}))
@Form.create()
export default class ViewCoupon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coupon_detail: {},//消费券详情
            useType: 1,//适用商品类型
            useTimeType: 1,//使用时间类型
            curCouponType: 1,//当前选择的优惠券类型
            query: props.location.query,
            loading: false,
            selectedRows: [],
            selectedMemberRows: [], //选择的会员
            selectedRowKeys: [],//selectedRows的key
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
                }
            ],
            pagination: {
                current: 1,
                pageSize: 5
            },
            linkInfo:null,
            channelList:[],
            checkedCategory:[]
        };
    }

    componentDidMount() {
        const { query } = this.state;
        if (query.id != undefined && query.id > 0) {
            this.get_detail(query.id);
        }

        this.get_operation_list({ pageSize:1000,pageNum:1});
    }

    componentWillUnmount() {
    }

  //获取消费券详情
  get_detail = async (id) => {
      const { dispatch } = this.props;
      let { checkedCatIds } = this.state;
      this.setState({ loading: true });
      dispatch({
          type: 'consumer_coupon/get_conscoupon_detail',
          payload: { couponId: id },
          callback: async (res) => {
              if (res.state == 200) {
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
            
                      }
                      this.get_member_list(couponMemberList, pageSize)
                  }
                  let checkedCategory = []
                  if (res.data.useType == 3) {
                      const category = res.data.couponProductCategoryVOList[0]
                      const {categoryName1,categoryName2,categoryName3} = category
                      if(categoryName1){checkedCategory.push(categoryName1)}
                      if(categoryName2){checkedCategory.push(categoryName2)}
                      if(categoryName3){checkedCategory.push(categoryName3)}

                  }
                  let linkInfo = null;
                  if(res.data.linkInfo){
                      try {
                          linkInfo = JSON.parse(res.data.linkInfo)
                      } catch (error) {
                          linkInfo = null
                      }
                  }
                  this.setState({
                      coupon_detail: res.data,
                      loading: false,
                      useTimeType: res.data.effectiveTimeType,//使用时间类型
                      useType: res.data.useType,//适用商品类型
                      curCouponType: res.data.couponType,//优惠券类型
                      checkedCatIds,
                      linkInfo,
                      checkedCategory
                  });
              }
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

  // 获取渠道信息
  get_operation_list=(params)=>{
      const { dispatch } = this.props;
      const arr = []
      dispatch({
          type: 'project/operation_list',
          payload: { ...params },
          callback: (res) => {
              if (res.state == 200) {
                  if(res.data.channelInfos&&res.data.channelInfos.length>0){
                      res.data.channelInfos.forEach((item)=>{
                          arr.push({channelName:item.channelName,channelId:item.channelId})
                      })
                  }else{
                      
                  }
                  this.setState({
                      channelList:arr
                  });
              }else {
                 
              }
          }
      });
  }

  handleTableChange = (pagination)=>{
      const { query } = this.state;
      this.setState({
          pagination
      },()=>{
          this.get_goods_list(query.id);
      })
  };

  exportWithPass = () => {
      const { dispatch } = this.props;
      const {coupon_detail} = this.state
      this.setState({loading:true})
      dispatch({
          type: 'store_coupon/exportWithPass',
          payload: {couponId:coupon_detail.couponId,fileName:'平台优惠券卡密'},
          callback: (res) => {
              if(res.state!=undefined&&res.state == 89101001){
                  
              }
              this.setState({loading:false})
          }
      })
  };

  successEvent = ()=>{
      this.event("审核通过","true")
  };

  refuseEvent = (value)=>{
      this.event(value,"false")
  };

  event =(value,passed)=>{
      const { dispatch } = this.props;
      const { coupon_detail,query } = this.state
      let param = {couponId:coupon_detail.couponId,passed:passed,remark:value}
      this.setState({loading:true})
      dispatch({
          type:'store_coupon/approve',
          payload:param,
          callback:(res)=>{
              if(res.state == 200){
                  this.get_detail(query.id);
              }else{
                  failTip(res.msg)
              }
              this.setState({loading:false})
          }
      })
  };

  render() {
      const {
          loading, columns_member, selectedMemberRows, coupon_detail
      } = this.state;
      return (
          <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
              <Spin spinning={loading}>
                  <Form layout="inline">
                      <div className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity}`}>
                          <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
                              {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('消费券详情')}`, 0, 0, 0)}
                              {sldIconBtnBg(() => {setSession('coupon_detail_back',1);router.go(-1)}, 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
                          </div>
                          {getSldHorLine(1)}
                          <Scrollbars
                              autoHeight
                              autoHeightMin={100}
                              autoHeightMax={document.body.clientHeight - 100}
                          >
                              {/* 基本信息-start */}
                              {getSldEmptyH(10)}
                              {sldCommonTitleByBg(`${sldComLanguage('消费券基本信息')}`)}
                              {getSldEmptyH(10)}
                              <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                                  
                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('消费券名称')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {coupon_detail.couponName}
                                      </div>
                                  </div>
                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('发放总量')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {coupon_detail.publishNum}张
                                      </div>
                                  </div>
                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('消费券类型')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {coupon_detail.couponTypeValue}
                                      </div>
                                  </div>
                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('消费券内容')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {coupon_detail.couponType=='1'?`面值${coupon_detail.publishValue}元`:`${coupon_detail.publishValue}折，最多优惠${coupon_detail.discountLimitAmount}元`}
                                      </div>
                                  </div>

                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('使用门槛')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {coupon_detail.limitQuota
                                              ? `${sldComLanguage('订单满')}${coupon_detail.limitQuota}${sldComLanguage('元时可以使用此优惠券')}`
                                              : `${sldComLanguage('无使用门槛')}`
                                          }
                                      </div>
                                  </div>
                                
                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('使用时间')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {coupon_detail.effectiveTimeType == 1 && `${coupon_detail.effectiveStart} ~ ${coupon_detail.effectiveEnd}`}
                                          {coupon_detail.effectiveTimeType == 2 && `领券当日起${coupon_detail.cycle}天内可以使用`}
                                      </div>
                                  </div>
                                  
                                  {coupon_detail.storeId > 0 &&
                                    <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                        <div className={`${promotion.left}`}>
                                            {sldComLanguage('适用门店')}
                                        </div>
                                        <div className={`${promotion.right}`}>
                                            {coupon_detail.shopNames=='-1'?'全部门店':coupon_detail.shopNames}
                                        </div>
                                    </div>
                                  }

                                  {
                                      coupon_detail.extendInfoVOList && coupon_detail.extendInfoVOList.map((item,index)=>(
                                          <div className={`${promotion.item} ${global.flex_row_start_center}`} key={index}>
                                              <div className={`${promotion.left}`}>
                                                  {`可用时段${index+1}`}
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {`${item.week} ${item.period}`}
                                              </div>
                                          </div>
                                      ))
                                  }
                                  
                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('获取方式')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {coupon_detail.publishTypeValue}
                                      </div>
                                  </div>

                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('每人限领')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {coupon_detail.limitReceive==0?'不限制次数':`${coupon_detail.limitReceive}次`}
                                      </div>
                                  </div>

                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('使用规则描述')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {coupon_detail.description}
                                      </div>
                                  </div>

                                  {coupon_detail.publishType == 5 &&
                                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                        <div className={`${promotion.left}`}>
                                            {sldComLanguage('已选择会员')}
                                        </div>
                                        <div className={`${promotion.right}`}>
                                            <Scrollbars
                                                autoHeight
                                                autoHeightMax={600}
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
                              {/* {getSldEmptyH(30)}
                              <ReviewLog type="store_coupon/listRecord" params={{couponId:coupon_detail.couponId}}></ReviewLog>
                              {getSldEmptyH(30)} */}
            
                          </Scrollbars>
                      </div>
                  </Form>
              </Spin>
          </div>
      );
  }
}

