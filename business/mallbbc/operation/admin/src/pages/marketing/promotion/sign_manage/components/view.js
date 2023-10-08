import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin,Button } from 'antd';
import router from 'umi/router';
import {
    sldCommonTitleByBg,
    getSldHorLine,
    getSldEmptyH,
    getAuthBtn,
    sucTip,
    failTip,
    isEmpty,
    toChinesNum
} from '@/utils/utils';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import _style from '../css/index.less';
import ReviewButton from '@/components/Review';
import ReviewLog from '@/components/ReviewLog';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
let cumulativeMap = {
    '1':'等于',
    '2':'大于等于'
}

// eslint-disable-next-line no-shadow
@connect(({ sign_manage,global }) => ({
    sign_manage,global
}))
@Form.create()
export default class View extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            query: props.queryparams,
            detail: {},
            loading:false
        };
    }

    componentDidMount() {
        const { query } = this.state;
        if (query.id != undefined) {
            this.get_detail(query.id);
        }
    }

    componentWillUnmount() {
    }

  //获取详情
  get_detail = (id) => {
      const { dispatch } = this.props;
      this.setState({ loading: true });
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
                  let daySignInfo = {}
                  let addDaySignLadder = []
                  let addDaySignSequence = []
                  signRuleVOList.forEach((item)=>{
                      if(item.oneLevelType==1){
                          daySignInfo.couponList = item.couponList
                          daySignInfo.redpacketList = item.redpacketList
                          daySignInfo.sendIntegral = item.sendIntegral
                      }else if (item.oneLevelType==2 && item.twoLevelType==2){
                          addDaySignLadder.push({
                              couponList : item.couponList,
                              redpacketList : item.redpacketList,
                              sendIntegral : item.sendIntegral,
                              cumulativeRange:item.cumulativeRange,
                              ruleValue:item.ruleValue
                          })
                      } else if (item.oneLevelType==2 && item.twoLevelType==1) {
                          addDaySignSequence.push({
                              couponList : item.couponList,
                              redpacketList : item.redpacketList,
                              sendIntegral : item.sendIntegral,
                              cumulativeRange:item.cumulativeRange,
                              ruleValue:item.ruleValue
                          })
                      }
                  })
                  this.setState({
                      detail:{
                          signActivityId,
                          signActivityName,
                          startTime,
                          endTime,
                          description,
                          daySignInfo:isEmpty(daySignInfo)?null:daySignInfo,
                          addDaySignLadder:isEmpty(addDaySignLadder)?null:addDaySignLadder,
                          addDaySignSequence:isEmpty(addDaySignSequence)?null:addDaySignSequence
                      },
                      loading:false
                  });
              }
          }
      });
  };

refuseEvent = (auditReason)=>{
    // 审核拒绝或通过,0-拒绝,1-通过
    this.signAudit({state:0,auditReason})
}

successEvent = ()=>{
    this.signAudit({state:1})
}

signAudit = (param)=>{
    const { query:{id} } = this.state
    const { dispatch } = this.props;
    param.signActivityId = id
    dispatch({
        type: 'sign_manage/signAudit',
        payload: param,
        callback: (res) => {
            if (res.state == 200) {
                sucTip(res.msg);
                setTimeout(() => {
                    router.go(-1)
                }, 500);
            } else {
                failTip(res.msg);
            }
        }
    });
}


render() {
    const {
        loading,detail,query:{tar}
    } = this.state;
    console.log(tar)  
    return (
        <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
            <Spin spinning={loading}>
                <Form layout="inline">
                    <div className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity}`}>
                        {/* <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
                            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', '签到详情', 0, 0, 0)}
                            {sldIconBtnBg(() => {setSession('coupon_detail_back',1);router.go(-1)}, 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
                        </div> */}
                        {getSldHorLine(1)}
                        <Scrollbars
                            autoHeight
                            autoHeightMin={100}
                            autoHeightMax={document.body.clientHeight - 100}
                        >
                            {/* 基本信息-start */}
                            {getSldEmptyH(10)}
                            {sldCommonTitleByBg(`基本信息`)}
                            {getSldEmptyH(10)}
                            <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>

                                <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                    <div className={`${promotion.left}`}>
                                        <span style={{ color: 'red' }}>*</span>活动ID
                                    </div>
                                    <div className={`${promotion.right}`}>
                                        {detail.signActivityId}
                                    </div>
                                </div>

                                <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                    <div className={`${promotion.left}`}>
                                        <span style={{ color: 'red' }}>*</span>活动名称
                                    </div>
                                    <div className={`${promotion.right}`}>
                                        {detail.signActivityName}
                                    </div>
                                </div>

                                <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                    <div className={`${promotion.left}`}>
                                        <span style={{ color: 'red' }}>*</span>活动时间
                                    </div>
                                    <div className={`${promotion.right}`}>
                                        {detail.startTime} ~ {detail.endTime}
                                    </div>
                                </div>

                                <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                    <div className={`${promotion.left}`}>
                                        <span style={{ color: 'red' }}>*</span>活动规则描述
                                    </div>
                                    <div className={`${promotion.right}`} style={{whiteSpace:'pre-line'}}>
                                        {detail.description}
                                    </div>
                                </div>

                                <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                    <div className={`${promotion.left}`}>
                                        <span style={{ color: 'red' }}>*</span>奖励设置
                                    </div>
                                    <div className={`${promotion.right}`}>
                                        <div>
                                            {
                                                detail.daySignInfo &&
                                                <div className={`${_style['view_item']}`}>
                                                    {
                                                        detail.daySignInfo.couponList &&
                                                        <div>
                                                            <div className={`${_style['everyday-sign-head']}`}>
                                                                <span className={`${_style['sign-name']}`}>每日签到</span> <span className={`${_style['sign-summary']}`}></span>
                                                            </div>
                                                            <div className={`${_style['everyday-sign-body']}`}>
                                                                <div className={`${_style['coupon-body']}`}>
                                                                    <div className={`${_style['img_coupon']}`}></div>
                                                                    <div className={`${_style['name']}`}>{detail.daySignInfo.couponList[0].couponName}</div>
                                                                </div>  
                                                            </div>
                                                        </div>
                                                        
                                                    }
                                                    {
                                                        detail.daySignInfo.redpacketList &&
                                                        <div>
                                                            <div className={`${_style['everyday-sign-head']}`}>
                                                                <span className={`${_style['sign-name']}`}>每日签到</span> <span className={`${_style['sign-summary']}`}></span>
                                                            </div>
                                                            <div className={`${_style['everyday-sign-body']}`}>
                                                                <div className={`${_style['coupon-body']}`}>
                                                                    <div className={`${_style['img_redpacket']}`}></div>
                                                                    <div className={`${_style['name']}`}>{detail.daySignInfo.redpacketList[0].redpacketName}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                    }
                                                    {
                                                        detail.daySignInfo.sendIntegral &&
                                                        <div>
                                                            <div className={`${_style['everyday-sign-head']}`}>
                                                                <span className={`${_style['sign-name']}`}>每日签到</span> <span className={`${_style['sign-summary']}`}></span>
                                                            </div>
                                                            <div className={`${_style['everyday-sign-body']}`}>
                                                                <div className={`${_style['coupon-body']}`}>
                                                                    <div className={`${_style['img_integral']}`}></div>
                                                                    <div className={`${_style['name']}`}>{detail.daySignInfo.sendIntegral}个积分</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                    }
                                                </div>
                                            }
                                            {
                                                (detail.addDaySignLadder || detail.addDaySignSequence) && 
                                                <div className={`${_style['view_item']}`}>
                                                    <div className={`${_style['ladder-sign-head']}`}>额外奖励</div>
                                                    {/* 累计签到 */}
                                                    {detail.addDaySignLadder && <div className={`${_style['ladder-sign-body']}`}>
                                                        <div style={{fontSize:'16px',fontWeight:'bold'}}>累计签到</div>
                                                        {
                                                            detail.addDaySignLadder.map((item,index)=>(
                                                                <div className={`${_style['view_item']}`} key={index}>
                                                                    <div className={`${_style['rank']}`}>{`${toChinesNum(index+1)}级奖励规则`}({`${cumulativeMap[item.cumulativeRange]}${item.ruleValue}天`})</div>
                                                                    {item.couponList &&<div>
                                                                        <div className={`${_style['coupon-body']}`}>
                                                                            <div className={`${_style['img_coupon']}`}></div>
                                                                            <div className={`${_style['name']}`}>{item.couponList[0].couponName}</div>
                                                                        </div>
                                                                    </div>}

                                                                    {item.redpacketList &&<div>
                                                                        <div className={`${_style['coupon-body']}`}>
                                                                            <div className={`${_style['img_redpacket']}`}></div>
                                                                            <div className={`${_style['name']}`}>{item.redpacketList[0].redpacketName}</div>
                                                                        </div>                                                              
                                                                    </div>}

                                                                    {item.sendIntegral &&<div>
                                                                        <div className={`${_style['coupon-body']}`}>
                                                                            <div className={`${_style['img_integral']}`}></div>
                                                                            <div className={`${_style['name']}`}>{item.sendIntegral}个积分</div>
                                                                        </div>
                                                                    </div>}
                                                                </div>
                                                            ))
                                                        }
                                                    </div>}
                                                    {/* 连续签到 */}
                                                    {detail.addDaySignSequence && <div className={`${_style['ladder-sign-body']}`}>
                                                        <div style={{fontSize:'16px',fontWeight:'bold'}}>连续签到</div>
                                                        {
                                                            detail.addDaySignSequence.map((item,index)=>(
                                                                <div className={`${_style['view_item']}`} key={index}>
                                                                    <div className={`${_style['rank']}`}>{`${toChinesNum(index+1)}级奖励规则`}({`${cumulativeMap[item.cumulativeRange]}${item.ruleValue}天`})</div>
                                                                    {item.couponList &&<div>
                                                                        <div className={`${_style['coupon-body']}`}>
                                                                            <div className={`${_style['img_coupon']}`}></div>
                                                                            <div className={`${_style['name']}`}>{item.couponList[0].couponName}</div>
                                                                        </div>
                                                                    </div>}

                                                                    {item.redpacketList &&<div>
                                                                        <div className={`${_style['coupon-body']}`}>
                                                                            <div className={`${_style['img_redpacket']}`}></div>
                                                                            <div className={`${_style['name']}`}>{item.redpacketList[0].redpacketName}</div>
                                                                        </div>                                                              
                                                                    </div>}

                                                                    {item.sendIntegral &&<div>
                                                                        <div className={`${_style['coupon-body']}`}>
                                                                            <div className={`${_style['img_integral']}`}></div>
                                                                            <div className={`${_style['name']}`}>{item.sendIntegral}个积分</div>
                                                                        </div>
                                                                    </div>}
                                                                </div>
                                                            ))
                                                        }
                                                    </div>}
                                                </div>
                                                
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* 基本信息-end */}
                            {getSldEmptyH(30)}
                            <ReviewLog type="sign_manage/getRecord" params={{signActivityId:this.state.query.id}}></ReviewLog>
                            {getSldEmptyH(30)}
                            <div
                                className={global.m_diy_bottom_wrap}
                                style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}
                            >
                                <Button onClick={() => router.go(-1)} style={{marginRight:20}}>返回</Button>
                                {
                                    tar=='audit' && 
                                    <AuthBtn eventKey={['audit_sign']} btnAuth={btnAuth}>
                                        <ReviewButton 
                                            refuseText='审核拒绝'
                                            refuseTitle='确定拒绝该签到活动么?'
                                            refuseEvent={this.refuseEvent}
                                            successText='审核通过'
                                            successTitle='确定通过该签到活动么?'
                                            successEvent={this.successEvent}
                                        />
                                    </AuthBtn>
                                }
                            </div>
                            {getSldEmptyH(30)}
                        </Scrollbars>
                    </div>
                </Form>
            </Spin>
        </div>
    );
}
}

