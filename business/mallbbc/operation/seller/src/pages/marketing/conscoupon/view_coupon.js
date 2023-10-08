import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, Table,Button } from 'antd';
import {
    sldLlineRtextAddMargin,
    sldComLanguage,
    sldCommonTitleByBg,
    getSldHorLine,
    getSldEmptyH,
    getSldComImg,
    sldIconBtnBg,
    withIndex,
    failTip,
    getAuthBtn
} from '@/utils/utils';
import { coupon_link_type } from '@/utils/util_data';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import router from 'umi/router';
import ReviewButton from '@/components/Review';
import ReviewLog from '@/components/ReviewLog';
import AuthBtn from '@/components/AuthBtn';
import { couponContent,mapstate } from './enum';


let btnAuth = getAuthBtn();

// eslint-disable-next-line no-shadow
@connect(({ promotion, global, project }) => ({
    promotion, global,project
}))
@Form.create()
export default class ViewCoupon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coupon_detail: {},//消费券详情
            useType: 1,//适用商品类型
            useTimeType: 1,//使用时间类型
            curCouponType: 1,//当前选择的消费券类型
            query: props.location.query,
            loading: false,
            selectedRows: [],
            selectedMemberRows: [], //选择的会员
            selectedRowKeys: [],//selectedRows的key
      
            columns_spu: [
                {
                    title: ' ',
                    dataIndex: 'index',
                    align: 'center',
                    width: 30
                    // render: (text, record, index) => {
                    //   return index + 1;
                    // },
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
                }
            ],
            pagination: {
                current: 1,
                pageSize: 5
            },
            linkInfo:null
        };
    }

    componentDidMount() {
        const { query } = this.state;
        if (query.id != undefined && query.id > 0) {
            this.get_detail(query.id);
        }
    }

    componentWillUnmount() {
    }

  //获取消费券详情
  get_detail = async (id) => {
      const { dispatch } = this.props;
      this.setState({ loading: true });
      dispatch({
          type: 'conscoupon/get_detail',
          payload: { couponId: id },
          callback: async (res) => {
              if (res.state == 200) {
                	console.log("linkInfo")  
                	if (res.data.useType == 2) {
                      this.get_goods_list(id);//获取商品列表
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
                  let linkInfo = null;
                  if(res.data.linkInfo){
                      try {
                          linkInfo = JSON.parse(res.data.linkInfo)
                      } catch (error) {
                          linkInfo = null
                      }
                  }
                  console.log("linkInfo",linkInfo)
                  this.setState({
                      coupon_detail: res.data,
                      loading: false,
                      useTimeType: res.data.effectiveTimeType,//使用时间类型
                      useType: res.data.useType,//适用商品类型
                      curCouponType: res.data.couponType,//消费券类型
                      linkInfo
                  });
              }else{
                  failTip(res.msg)
                  this.setState({
                      loading: false
                  })
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

  get_goods_list = (id) => {
      let { selectedRows, selectedRowKeys,pagination } = this.state;
      const { dispatch } = this.props;
      dispatch({
          type: 'promotion/get_coupon_goods_list',
          payload: { couponId: id,...pagination },
          callback: async (res) => {
              if (res.state == 200) {
                  if (res.data.list.length > 0) {
                      selectedRows = withIndex(res.data.list,res.data.pagination);
                      selectedRows.forEach(item => {
                          selectedRowKeys.push(item.sku); // 没用?
                      });
                  }
                  this.setState({
                      selectedRows,
                      selectedRowKeys,
                      pagination: {
                          ...pagination,
                          total: res.data.pagination.total
                      }
                  });
              }
          }
      });
  };

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
          type: 'conscoupon/exportWithPass',
          payload: {couponId:coupon_detail.couponId,fileName:'店铺消费券卡密'},
          callback: (res) => {
              if(res.state!=undefined&&res.state == 89101001){
                
              }
              this.setState({loading:false})
          }
      })
  };
  
  successEvent = ()=>{
      this.event("审核通过","true")
  }

  refuseEvent = (value)=>{
      this.event(value,"false")
  }

  event =(value,passed)=>{
      const { dispatch } = this.props;
      const { coupon_detail,query } = this.state
      let param = {couponId:coupon_detail.couponId,passed:passed,remark:value}
      this.setState({loading:true})
      dispatch({
          type:'conscoupon/approve',
          payload:param,
          callback:(res)=>{
              if(res.state == 200){
                  if(passed=='true'){
                      setTimeout(() => {
                          router.go(-1)
                      }, 500);
                  }else{
                      this.get_detail(query.id);
                  }
              }else{
                  failTip(res.msg)
              }
              this.setState({loading:false})
          }
      })
  }

  render() {
      const { loading, useTimeType, columns_member,selectedMemberRows, coupon_detail,query } = this.state;
      return (
          <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
              <AuthBtn btnAuth={btnAuth} eventKey={["conscoupon_list_view","conscoupon_list_audit"]} showPage>
                  <Spin spinning={loading}>
                      <Form layout="inline">
                          <div className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity}`}>
                              <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
                                  <div style={{display:"flex"}}>
                                      {sldLlineRtextAddMargin('#FA6F1E', `消费券 / 消费券详情`, 0, 0, 0)}
                                      <div style={{marginLeft:'15px'}}>{mapstate(coupon_detail.state)}</div>
                                  </div>
                                  {sldIconBtnBg(() => router.go(-1), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
                              </div>
                              {getSldHorLine(1)}
                              <Scrollbars
                                  autoHeight
                                  autoHeightMin={100}
                                  autoHeightMax={document.body.clientHeight - 110}
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
                                              {coupon_detail.publishNum}{sldComLanguage('张')}
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
                                              {couponContent(coupon_detail.couponType,coupon_detail.publishValue,coupon_detail.discountLimitAmount)}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              {sldComLanguage('使用门槛')}
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {coupon_detail.limitQuota
                                                  ?`${sldComLanguage('订单满')}${coupon_detail.limitQuota}${sldComLanguage('元时可以使用此消费券')}`
                                                  :`${sldComLanguage('无使用门槛')}`
                                              }
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              {sldComLanguage('适用门店')}
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              { coupon_detail.shopNames == -1 ?'全部门店可用':coupon_detail.shopNames }
                                          </div>
                                      </div>
                                      
                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              {sldComLanguage('消费券使用有效期')}
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {useTimeType == 1 && `${coupon_detail.effectiveStart} ~ ${coupon_detail.effectiveEnd}`}
                                              {useTimeType == 2 && `${sldComLanguage('领券当日起天')}${coupon_detail.cycle}${sldComLanguage('内可以使用')}`}
                                          </div>
                                      </div>

                                      {
                                          coupon_detail.extendInfoVOList && coupon_detail.extendInfoVOList.map((item,index)=>(
                                              <div className={`${promotion.item} ${global.flex_row_start_center}`} key={index}>
                                                  <div className={`${promotion.left}`}>
                                                      {`可用时段${coupon_detail.extendInfoVOList.length>1?index+1:''}`}
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
                                              {coupon_detail.publishType == 1 && `${sldComLanguage('免费领取')}`}
                                              {coupon_detail.publishType == 3 && `${sldComLanguage('活动赠送')}`}
                                              {coupon_detail.publishType == 5 && `${sldComLanguage('指定会员发放')}`}
                                              {coupon_detail.publishType == 6 && `${sldComLanguage('凭密码领取')}`}
                                              {coupon_detail.publishType == 6 && 
                                              <AuthBtn btnAuth={btnAuth} eventKey={["conscoupon_list_export"]}>
                                                  <Button type="primary" size='small' style={{marginLeft:'10px'}} onClick={()=>{this.exportWithPass()}}>导出卡密</Button>
                                              </AuthBtn>
                                              
                                              }
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

                                  {/* 领取和使用规则-start */}
                                  
                                  {getSldEmptyH(10)}
                                  {sldCommonTitleByBg(`${sldComLanguage('领取和使用规则')}`)}
                                  {getSldEmptyH(10)}
                                  <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                                      {
                                          coupon_detail.publishType ==1 && 
                                          <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                  {sldComLanguage('每人每企业限领次数')}
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {coupon_detail.companyLimitReceive
                                                      ?`${sldComLanguage('每位会员在同一个企业内限制领取')}${coupon_detail.companyLimitReceive}${sldComLanguage('次')}`
                                                      :`${sldComLanguage('不限制次数')}`
                                                  }
                                              </div>
                                          </div>
                                      }
                                      {
                                          (coupon_detail.publishType ==1||coupon_detail.publishType ==5) &&
                                            <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                                <div className={`${promotion.left}`}>
                                                    {coupon_detail.publishType==5 ? sldComLanguage('每位会员发放张数'):sldComLanguage('每人限领次数')}
                                                </div>
                                                <div className={`${promotion.right}`}>
                                                    {coupon_detail.limitReceive
                                                        ?`${sldComLanguage(`每位会员${coupon_detail.publishType ==5?'发放':'限制领取'}`)}${coupon_detail.limitReceive}${sldComLanguage(`${coupon_detail.publishType ==5?'张':'次'}`)}`
                                                        :`${sldComLanguage('不限制次数')}`
                                                    }
                                                </div>
                                            </div>
                                      }
                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              {sldComLanguage('使用规则描述')}
                                          </div>
                                          <div className={`${promotion.right}`} style={{whiteSpace:'pre-line'}}>
                                              {`${coupon_detail.description}`}
                                          </div>
                                      </div>
                                  </div>
                                  {/* 领取和使用规则-end */}
                                  {getSldEmptyH(30)}
                                  <ReviewLog type="conscoupon/listRecord" params={{couponId:coupon_detail.couponId}} />
                                  {getSldEmptyH(30)}
                                  {/*审核 对话框-start*/}
                                  <AuthBtn btnAuth={btnAuth} eventKey={["conscoupon_list_audit"]}>
                                      {
                                          query.type == 'review' && coupon_detail.state == 6 &&
                                            <div className={`${promotion.bottom_fixed_wrap}`}>
                                                <ReviewButton 
                                                    refuseText="审核拒绝"
                                                    refuseTitle="确定拒绝该条消费券么？"
                                                    refuseEvent={this.refuseEvent}
                                                    successText="审核通过"
                                                    successTitle="确定通过该条消费券么？"
                                                    successEvent={this.successEvent}
                                                />
                                            </div>
                                      } 
                                  </AuthBtn>
                                  {getSldEmptyH(30)}
                              </Scrollbars>
                          </div>
                      </Form>
                  </Spin>
              </AuthBtn>
          </div>
      );
  }
}

