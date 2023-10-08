import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin } from 'antd';
import router from 'umi/router';
import {
    sldCommonTitleByBg,
    getSldHorLine,
    getSldEmptyH,
    failTip,
    isNotEmpty,
    sldLlineRtextAddMargin,
    sldIconBtnBg,
    getAuthBtn
} from '@/utils/utils';
import DotTag from '@/components/DotTag';
import AuthBtn from '@/components/AuthBtn';
import { couponContent,mapUseState } from './enum';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';

let btnAuth = getAuthBtn();

// eslint-disable-next-line no-shadow
@connect(({ offline_shop,global }) => ({
    offline_shop,global
}))
@Form.create()
export default class View extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            query: props.location.query,
            receive:{},
            detail: {},
            check:{},
            loading:false
        };
    }

    componentDidMount() {
        const { query } = this.state;
        if (isNotEmpty(query.couponMemberId)) {
            this.get_detail(query.couponMemberId );
        }
    }

    componentWillUnmount() {
    }

  //获取详情
  get_detail = (couponMemberId ) => {
      const { dispatch } = this.props;
      this.setState({ loading: true });
      dispatch({
          type: 'conscoupon/receiveDetails',
          payload: { couponMemberId },
          callback: (res) => {
              if (res.state == 200) {
                  const {couponMemberVO,sellerCouponDetailVO,couponCheckMemberVO} = res.data
                  this.setState({
                      receive:couponMemberVO,
                      detail:sellerCouponDetailVO,
                      check:couponCheckMemberVO,
                      loading:false
                  });
              }else{
                  failTip(res.msg);
              }
          }
      });
  };

  render() {
      const {
          loading,receive,detail,check
      } = this.state;
    
      return (
          <AuthBtn btnAuth={btnAuth} eventKey={["conscoupon_list_view"]} showPage>
              <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
                  <Spin spinning={loading}>
                      <Form layout="inline">
                          <div className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity}`}>
                              <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
                                  <div style={{display:"flex"}}>
                                      {sldLlineRtextAddMargin('#FA6F1E', `消费券 / 领取详情`, 0, 0, 0)}
                                      <div style={{marginLeft:'15px'}}>{mapUseState(receive.useState)}</div>
                                  </div>
                                  {sldIconBtnBg(() => router.go(-1), 'fanhui', `返回上级页面`, '#fff', 7, 0, 15, 15, 5)}
                              </div>
                              {getSldHorLine(1)}
                              <Scrollbars
                                  autoHeight
                                  autoHeightMin={100}
                                  autoHeightMax={document.body.clientHeight - 100}
                              >
                                  {getSldEmptyH(10)}
                                  {sldCommonTitleByBg(`领取信息`)}
                                  {getSldEmptyH(10)}
                                  <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>

                                      {/* <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              使用状态
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {mapUseState(receive.useState)}
                                          </div>
                                      </div> */}

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              会员名
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {receive.memberName||'--'}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              会员昵称
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {receive.memberNickName||'--'}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              会员真实姓名
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {receive.memberTrueName||'--'}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              手机号
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {receive.memberPhone||'--'}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              消费券券码
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {receive.couponCode||'--'}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              领取渠道
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {receive.receiveChannelName||'--'}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              领取时间
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {receive.receiveTime}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              获取方式
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {detail.publishTypeValue}
                                          </div>
                                      </div>
                                  </div>
                                  {getSldEmptyH(10)}
                                  {sldCommonTitleByBg(`消费券信息`)}
                                  {getSldEmptyH(10)}
                                  <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              消费券ID
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {detail.couponId}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              消费券名称
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {detail.couponName}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              消费券类型
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {detail.couponTypeValue}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              消费券内容
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {couponContent(detail.couponType,detail.publishValue,detail.discountLimitAmount)}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              使用门槛
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {detail.couponContent||'--'}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              消费券使用有效期
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {detail.effectiveTimeType == 1 && `${detail.effectiveStart} ~ ${detail.effectiveEnd}`}
                                              {detail.effectiveTimeType == 2 && `领券当日起${detail.cycle}天内可以使用`}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              适用门店
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {detail.shopNames=='-1'?'全部门店可用':detail.shopNames}
                                          </div>
                                      </div>
                                      {
                                          detail.extendInfoVOList && detail.extendInfoVOList.map((item,index)=>(
                                              <div className={`${promotion.item} ${global.flex_row_start_center}`} key={index}>
                                                  <div className={`${promotion.left}`}>
                                                      {`可用时段${detail.extendInfoVOList.length>1?index+1:''}`}
                                                  </div>
                                                  <div className={`${promotion.right}`}>
                                                      {`${item.week} ${item.period}`}
                                                  </div>
                                              </div>
                                          ))
                                      }
                                  </div>
                                  {getSldEmptyH(10)}
                                  {sldCommonTitleByBg(`核销信息`)}
                                  {getSldEmptyH(10)}
                                  <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              核销人
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {check.verifyUserName||'--'}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              核销时间
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {check.verifyTime||'--'}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              核销门店
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {check.verifyStore||'--'}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              备注
                                          </div>
                                          <div className={`${promotion.right}`} style={{whiteSpace:'pre-line'}}>
                                              {receive.remarks||'--'}
                                          </div>
                                      </div>

                                  
                                  </div>
                                  {getSldEmptyH(20)}
                              </Scrollbars>
                          </div>
                      </Form>
                  </Spin>
              </div>
          </AuthBtn>
         
      );
  }
}

