import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import Link from 'umi/link';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form,Empty, Spin,Modal,Input,Select,Button,Icon } from 'antd';
import {
    list_com_page_size_10,
    getSldHorLine,
    sldLlineRtextAddMargin,
    sldIconBtnBg,
    getAuthBtn,
    getSldEmptyH,
    isEmpty,
    failTip,
    sucTip,
    sldCommonTitleByBg
} from '@/utils/utils';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import _style from './audit.less';
import AuthBtn from '@/components/AuthBtn';
import DotTag from '@/components/DotTag';
import { couponContent,showShopName, mapUseState } from './enum';

const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;
let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
@connect(({ store }) => ({
    store
}))
@Form.create()
export default class MsgLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shopList:[],
            couponCode:'',
            shopId:'',
            remark:'',
            detail:{},
            receiveMember:{},
            check:{}
        };
    }


    componentDidMount() {
        this.getOfflineShop({pageSize:1000});
    }

  //获取门店列表
  getOfflineShop = (params) => {
      const { dispatch } = this.props;
      dispatch({
          type: 'project/getOfflineShop',
          payload: params,
          callback: (res) => {
              if (res.state == 200) {
                  this.setState({ shopList:res.data.list });
              }
          }
      });
  };

  //获取详情
  getCouponDetail = (params) => {
      const { dispatch } = this.props;
      dispatch({
          type: 'conscoupon/getCouponDetail',
          payload: params,
          callback: (res) => {
              if (res.state == 200) {
                  this.setState({ 
                      detail :res.data,
                      receiveMember:res.data.receiveMemberVO,
                      check:res.data.couponCheckMemberVO||{}
                  });
              }else{
                  failTip(res.msg)
              }
          }
      });
  };

  search = ()=>{
      const {couponCode} = this.state
      this.getCouponDetail({couponCode})
  }

  couponCodeChange = (e)=>{
      this.setState({
          couponCode : e.target.value.replace(/\s+/g,"")
      })
  }

  shopChange = (e)=>{
      this.setState({
          shopId : e
      })
  }

  sureAudit = ()=>{
      const {couponCode,shopId} = this.state
      if(isEmpty(couponCode)){
          failTip('请填写劵码')
          return
      }
      if(isEmpty(shopId)){
          failTip('请选择门店')
          return
      }
      let that = this
      confirm({
          centered: true,
          title: '注意',
          content: '核销该消费券券码后将不可使用，确定核销吗？',
          cancelText:'取消',
          okText:'确定',
          className:`${_style.p20}`,
          onOk() {
              that.audit()
          },
          onCancel() {
            
          }
      });
  }

  audit = ()=>{
      const { dispatch } = this.props;
      const {couponCode,shopId} = this.state
      dispatch({
          type: 'conscoupon/audit',
          payload: {couponCode,shopId},
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg)
                  this.getCouponDetail({couponCode})
                  setTimeout(() => {
                      this.refs.scrollbars.scrollToBottom()
                  }, 0);
              }else{
                  failTip(res.msg)
              }
          }
      });
  }

  setRemark = ()=>{
      let that = this
      this.setState({
          remark:''
      })
      confirm({
          centered: true,
          icon:'',
          title: '核销备注',
          content: <TextArea autosize={{ minRows: 4, maxRows: 6 }} onChange={this.inputChange} placeholder="请输入备注" maxLength={200} />,
          cancelText:'取消',
          okText:'确定',
          className:`${_style.p20}`,
          onOk(destroy) {
              setTimeout(()=>{
                  const { remark } = that.state;
                  if(isEmpty(remark)){
                      failTip('请填写备注信息')
                  }else{
                      that.updateRemarks()
                      destroy()
                  }
              },500)
          },
          onCancel() {
           
          }
      });
  }

  inputChange = ({ target: { value } }) => {
      this.setState({
          remark:value
      })
  };
  
  // 添加备注
  updateRemarks = ()=>{
      const { dispatch } = this.props;
      const {couponCode,receiveMember:{couponMemberId},remark} = this.state
      dispatch({
          type: 'conscoupon/updateRemarks',
          payload: { couponMemberId,remarks:remark },
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg)
                  this.getCouponDetail({couponCode})
              }else{
                  failTip(res.msg)
              }
          }
      });
  }

  render() {
      const {shopList,detail,receiveMember,check } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1 }}>
              <AuthBtn btnAuth={btnAuth} eventKey={["conscoupon_list_approve"]} showPage>
                  <div className={global.flex_com_space_between}>
                      {sldLlineRtextAddMargin('#FA6F1E', `消费券 / 核销消费券`, 0, 0, 0)}
	                {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', '返回上级页面', '#fff', 7, 0, 15, 15, 5)}
	            </div>
                  <div>
                      <div className={`${_style.search}`}>
                          <div>消费券券码：</div>
                          <div><Input onChange={this.couponCodeChange} style={{width:'260px'}} /></div>
                          <div className={`${_style.marginL10}`}>核销门店：</div>
                          <div>
                              <Select style={{width:'260px'}} onChange={this.shopChange}>
                                  {shopList.map((item)=>(
                                      <Option key={item.shopId}>{item.shopName}</Option>
                                  ))}
                              </Select>
                          </div>
                          <Button style={{marginLeft:'20px'}} onClick={this.search} type='primary'>确定</Button>
                      </div>
                     
                      {getSldHorLine(1)}
                      <div className={`${_style.title}`}>消费券详情<span> {mapUseState(receiveMember.useState)} </span></div>
                      {
                          isEmpty(detail)?<Empty  
                              description={
                                  <span>
                                      <span style={{fontWeight:'600',fontSize:'16px'}}>暂无消费券信息</span><br />请先输入消费券券码和核销门店信息
                                  </span>
                              } 
                          />:

                              <Scrollbars
                                  ref="scrollbars"
                                  autoHeight
                                  autoHeightMin={100}
                                  autoHeightMax={document.body.clientHeight - 260}
                              >
                                  <div className={`${promotion.full_activity}`}>
                                      {sldCommonTitleByBg('消费券信息')}
                                      <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                           
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                  消费券ID
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {detail.couponId}
                                              </div>
                                          </div>
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                  消费券名称
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {detail.couponName}
                                              </div>
                                          </div>
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                   消费券类型
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {detail.couponTypeValue}
                                              </div>
                                          </div>
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                    消费券内容
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {couponContent(detail.couponType,detail.publishValue,detail.discountLimitAmount)}
                                              </div>
                                          </div>
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                  使用门槛
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {detail.couponContent}
                                              </div>
                                          </div>
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                  消费券使用有效期
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {detail.effectiveTimeType == 1 && `${detail.effectiveStart} ~ ${detail.effectiveEnd}`}
                                                  {detail.effectiveTimeType == 2 && `领券当日起${detail.cycle}天内可以使用`}
                                              </div>
                                          </div>
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                  适用门店
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {showShopName(detail.shopIds,shopList)}
                                              </div>
                                          </div>
                                          {
                                              detail.extendInfoVOList && detail.extendInfoVOList.map((item,index)=>(
                                                  <div className={`${promotion.item} ${_style.item} ${global.flex_row_start_center}`} key={index}>
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
                                      {sldCommonTitleByBg('领取信息')}
                                      <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                                          {/* <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                  使用状态
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {mapUseState(receiveMember.useState)}
                                              </div>
                                          </div> */}
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                  会员名
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {receiveMember.memberName||'--'}
                                              </div>
                                          </div>
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                  会员昵称
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {receiveMember.memberNickName||'--'}
                                              </div>
                                          </div>
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                  会员真实姓名
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {receiveMember.memberTrueName||'--'}
                                              </div>
                                          </div>
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                  手机号
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {receiveMember.memberPhone||'--'}
                                              </div>
                                          </div>
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                  消费券劵码
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {receiveMember.couponCode||'--'}
                                              </div>
                                          </div>
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                  领取渠道
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {receiveMember.receiveChannelName||'--'}
                                              </div>
                                          </div>
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                  领取时间
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {receiveMember.receiveTime}
                                              </div>
                                          </div>
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                  获取方式
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {detail.publishTypeValue}
                                              </div>
                                          </div>
                                      </div>
                                      {sldCommonTitleByBg('核销记录')}
                                      <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                  核销人
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {check.verifyUserName||'--'}
                                              </div>
                                          </div>
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                  核销时间
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {check.verifyTime||'--'}
                                              </div>
                                          </div>
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                  核销门店
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  {check.verifyStore||'--'}
                                              </div>
                                          </div>
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`}>
                                                  备注
                                              </div>
                                              <div className={`${promotion.right}`} style={{whiteSpace:'pre-line',paddingRight:'6px'}}>
                                                  {receiveMember.remarks||<span style={{color:'#999'}}>未填写</span>}
                                                  <Icon type="edit" style={{marginLeft:'6px',cursor:'pointer'}} onClick={()=>this.setRemark()} />
                                              </div>
                                          </div>
                                          <div className={`${promotion.item}  ${_style.item} ${global.flex_row_start_center}`}>
                                              <div className={`${promotion.left}`} />
                                              <div className={`${promotion.right}`}>
                                                  <Button type='primary' onClick={this.sureAudit} disabled={!(receiveMember.useState==1)}>确定核销</Button>
                                              </div>
                                          </div>
                                      </div>
                                      {getSldEmptyH(10)}
                                  </div>
                              </Scrollbars>
                      }
                      
                  </div>
                  
              </AuthBtn>

          </div>

      );
  }
}
