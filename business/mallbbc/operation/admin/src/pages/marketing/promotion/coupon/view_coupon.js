import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, Table ,Button, message } from 'antd';
import router from 'umi/router';
import {
    sldLlineRtextAddGoodsAddMargin,
    sldComLanguage,
    sldCommonTitleByBg,
    getSldHorLine,
    getSldEmptyH,
    getSldComImg,
    sldIconBtnBg,
    setSession,
    withIndex,
    failTip,
    getAuthBtn,
    hasAuth
} from '@/utils/utils';
import { coupon_link_type } from '@/utils/util_data';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import ReviewButton from '@/components/Review';
import ReviewLog from '@/components/ReviewLog';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
// eslint-disable-next-line no-shadow
@connect(({ coupon, global }) => ({
    coupon, global
}))
@Form.create()
export default class ViewCoupon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coupon_detail: {},//优惠券详情
            cat_data: [],//三级分类数据
            checkedCatIds: [],//选择的分类id数组
            useType: 1,//适用商品类型
            useTimeType: 1,//使用时间类型
            curCouponType: 1,//当前选择的优惠券类型
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
                    title: `${sldComLanguage('店铺名称')}`,
                    dataIndex: 'storeName',
                    align: 'center',
                    width: 150
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
        this.getCat();
        this.get_operation_list({ pageSize:1000,pageNum:1});
    }

    componentWillUnmount() {
    }

  //获取分类数据
  getCat = () => {
      const { dispatch } = this.props;
      dispatch({
          type: 'project/get_cate_tree_list',
          payload: { pId: 0, grade: 3 },
          callback: (res) => {
              if (res.state == 200) {
                  let cateTree= res.data.list || res.data.categoryTrees;
                  if (cateTree.length > 0) {
                      cateTree.forEach(item => {
                          item.key = item.categoryId;
                          item.title = item.categoryName;
                          if (item.children != null) {
                              item.children.forEach(second => {
                                  second.key = second.categoryId;
                                  second.title = second.categoryName;
                                  if (second.children != null) {
                                      second.children.forEach(third => {
                                          third.key = third.categoryId;
                                          third.title = third.categoryName;
                                      });
                                  }
                              });
                          }
                      });
                  }
                  this.setState({
                      cat_data: cateTree
                  });
              }
          }
      });
  };

  //获取优惠券详情
  get_detail = async (id) => {
      const { dispatch } = this.props;
      let { checkedCatIds } = this.state;
      this.setState({ loading: true });
      dispatch({
          type: 'coupon/get_coupon_detail',
          payload: { couponId: id },
          callback: async (res) => {
              if (res.state == 200) {
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

  get_goods_list = (id) => {
      let { selectedRows, selectedRowKeys,pagination } = this.state;
      const { dispatch } = this.props;
      dispatch({
          type: 'coupon/get_coupon_goods_list',
          payload: { couponId: id,...pagination },
          callback: async (res) => {
              if (res.state == 200) {
                  if (res.data.list.length > 0) {
                      selectedRows = withIndex(res.data.list,res.data.pagination);
                      selectedRows.forEach(item => {
                          item.mainImage = item.mainImage;
                          selectedRowKeys.push(item.sku);
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
          type: 'coupon/exportWithPass',
          payload: {couponId:coupon_detail.couponId,fileName:'平台优惠券卡密'},
          callback: (res) => {
              if(res.state!=undefined&&res.state == 89101001){
                  failTip('卡密导出失败')
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
          type:'coupon/approve',
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
          loading, curCouponType, useTimeType, useType, columns_spu, columns_member, selectedRows, selectedMemberRows, coupon_detail, query,pagination,linkInfo,channelList,checkedCategory
      } = this.state;
      const channelName = channelList.find((item)=>item.channelId==coupon_detail.channelId)?.channelName
      const showchannelId = channelList.find((item)=>item.channelId==coupon_detail.channelId)?.channelId
      return (
          <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
              <Spin spinning={loading}>
                  <Form layout="inline">
                      <div className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity}`}>
                          <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
                              {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('优惠券详情')}`, 0, 0, 0)}
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
                              {sldCommonTitleByBg(`${sldComLanguage('优惠券基本信息')}`)}
                              {getSldEmptyH(10)}
                              <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>

                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('优惠券所属类型')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {coupon_detail.storeId > 0 ? `${sldComLanguage('店铺优惠券')}` : `${sldComLanguage('平台优惠券')}`}
                                      </div>
                                  </div>

                                  {coupon_detail.storeId > 0 &&
                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                      <div className={`${promotion.left}`}>
                          {sldComLanguage('店铺名称')}
                      </div>
                      <div className={`${promotion.right}`}>
                          {coupon_detail.storeName}
                      </div>
                  </div>
                                  }

                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('优惠券名称')}
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

                                  {query.type != undefined && query.type == 'system' &&
                    <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                        <div className={`${promotion.left}`}>
                            {sldComLanguage('与店铺优惠券叠加')}
                        </div>
                        <div className={`${promotion.right}`}>
                            {coupon_detail.plusQualification == 1 ? `${sldComLanguage('允许')}` : `${sldComLanguage('不允许')}`}
                        </div>
                    </div>
                                  }

                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('适用商品')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {useType == 1 && `${sldComLanguage('全部商品可用')}`}
                                          {useType == 2 && `${sldComLanguage('指定商品可用')}`}
                                          {useType == 3 && `${sldComLanguage('指定分类可用')}`}
                                      </div>
                                  </div>

                                  {useType == 2 &&
                  <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                          {sldComLanguage('已选择商品')}
                      </div>
                      <div className={`${promotion.right}`}>
                          <Scrollbars
                              autoHeight
                              autoHeightMax={600}
                          >
                              <Table
                                  rowKey="sku"
                                  pagination={pagination}
                                  columns={columns_spu}
                                  dataSource={selectedRows}
                                  size="small"
                                  onChange={this.handleTableChange}
                              />
                          </Scrollbars>
                      </div>
                  </div>
                                  }

                                  {useType == 3 &&
                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                      <div className={`${promotion.left}`}>
                          已选择分类
                      </div>
                      <div className={`${promotion.right}`}>
                          {checkedCategory.join('/')}
                      </div>
                  </div>
                                  }
                                  {coupon_detail.publishType != undefined && (coupon_detail.publishType ==1||coupon_detail.publishType ==6) &&
                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                      <div className={`${promotion.left}`}>
                          {sldComLanguage('活动时间')}
                      </div>
                      <div className={`${promotion.right}`}>
                          {coupon_detail.publishStartTime} ~ {coupon_detail.publishEndTime}
                      </div>
                  </div>
                                  }

                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('使用时间')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {useTimeType == 1 && coupon_detail.effectiveStart && `${coupon_detail.effectiveStart} ~ ${coupon_detail.effectiveEnd}`}
                                          {useTimeType == 2 && `${sldComLanguage('领券当日起天')}${coupon_detail.cycle}${sldComLanguage('内可以使用')}`}
                                      </div>
                                  </div>


                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('获取方式')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {coupon_detail.publishType == 1 && `${sldComLanguage('免费领取')}`}
                                          {coupon_detail.publishType == 3 && `${sldComLanguage('活动赠送')}`}
                                          {coupon_detail.publishType == 5 && `${sldComLanguage('指定会员发放')}`}
                                          {coupon_detail.publishType == 6 && `${sldComLanguage('凭密码领取')}`}
                                          {hasAuth('export_pass_coupon') && coupon_detail.publishType == 6 && coupon_detail.state!=6 && coupon_detail.state!=7 && <Button type="primary" size='small' style={{marginLeft:'10px'}} onClick={()=>{this.exportWithPass()}}>导出卡密</Button>}
                                      </div>
                                  </div>
                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('适用渠道')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {channelName?`${channelName}    ( 渠道id：${showchannelId} )`:'全部渠道'}
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
                                          {sldComLanguage('优惠内容')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {curCouponType == 1 && `${sldComLanguage('满足使用门槛后可以减免')}${coupon_detail.publishValue}${sldComLanguage('元')}`}
                                          {curCouponType == 2 && `${sldComLanguage('满足使用门槛后可以享受')}${coupon_detail.publishValue && (coupon_detail.publishValue / 10)}${sldComLanguage('折')}`}
                                          {curCouponType == 2 && coupon_detail.discountLimitAmount && `${sldComLanguage('，最多可以优惠')}${coupon_detail.discountLimitAmount}${sldComLanguage('元')}`}
                                          {curCouponType == 3 && `${sldComLanguage('在')}${coupon_detail.randomMin}～${coupon_detail.randomMax}${sldComLanguage('元范围内随机生成，总共不超过')}${coupon_detail.publishAmount}${sldComLanguage('元')}`}

                                      </div>
                                  </div>
                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          <span style={{ color: 'red' }} />{sldComLanguage('跳转链接')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {
                                              linkInfo?
                                                  <div>
                                                      <div>{coupon_link_type().find((item)=>item.key ==linkInfo.url_type )?.name}</div>
                                                      {
                                                          (linkInfo.url_type=='url' || linkInfo.url_type=='openBbcPage_url') && 
                                                        <div>
                                                            <div>
                                                                <span>H5链接地址&nbsp;:&nbsp;{linkInfo?.url||'--'}</span>
                                                            </div>
                                                            <div>
                                                                <span>微信小程序链接地址&nbsp;:&nbsp;{linkInfo?.wx_url||'--'}</span>
                                                            </div>
                                                        </div>
                                                      }
                                                      {
                                                          linkInfo.url_type=='topic' && <div>{`${linkInfo?.info?.name}-${linkInfo?.info?.decoId}`}</div>
                                                      }
                                                  </div>
                                                  :
                                                  <div>无操作</div>
                                          }
                       
                                      </div>
                                  </div>


                              </div>
                              {/* 基本信息-end */}

                              {/* 领取和使用规则-start */}
                              {getSldEmptyH(10)}
                              {sldCommonTitleByBg(`${sldComLanguage('领取和使用规则')}`)}
                              {
                                  coupon_detail.publishType ==1 && 
                                <Fragment>
                                    {getSldEmptyH(10)}
                                    <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                                        <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                            <div className={`${promotion.left}`}>
                                            每人每企业限领次数
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                {coupon_detail.limitReceive
                                                    ? `${sldComLanguage(`每人每企业限领`)}${coupon_detail.companyLimitReceive}${sldComLanguage(`次`)}`
                                                    : `${sldComLanguage('不限制次数')}`
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                              }
                              {
                                  (coupon_detail.publishType ==1||coupon_detail.publishType ==5) &&
                                <Fragment>
                                    {getSldEmptyH(10)}
                                    <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                                        <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                            <div className={`${promotion.left}`}>
                                                {coupon_detail.publishType ==5?sldComLanguage('每位会员发放张数'):sldComLanguage('每人限领次数')}
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                {coupon_detail.limitReceive
                                                    ? `${sldComLanguage(`每位会员${coupon_detail.publishType ==5?'发放':'限制领取'}`)}${coupon_detail.limitReceive}${sldComLanguage(`${coupon_detail.publishType ==5?'张':'次'}`)}`
                                                    : `${sldComLanguage('不限制次数')}`
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                              }
                              <Fragment>
                                  {getSldEmptyH(10)}
                                  <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                              使用规则描述
                                          </div>
                                          <div className={`${promotion.right}`} style={{whiteSpace:'pre-line'}}>
                                              {coupon_detail.description}
                                          </div>
                                      </div>
                                  </div>
                              </Fragment>
                            
                              {/* 领取和使用规则-end */}
                              {getSldEmptyH(30)}
                              <ReviewLog type="coupon/listRecord" params={{couponId:coupon_detail.couponId}}></ReviewLog>
                              {getSldEmptyH(30)}
                              {/*审核 对话框-start*/}
                              <AuthBtn eventKey={["audit_coupon"]} btnAuth={btnAuth}>
                                  {
                                      query.type == 'system' && coupon_detail.state == 6 &&
                                  <div className={`${promotion.bottom_fixed_wrap}`}>
                                      <ReviewButton 
                                          refuseText="审核拒绝"
                                          refuseTitle="确定拒绝该条优惠券么？"
                                          refuseEvent={this.refuseEvent}
                                          successText="审核通过"
                                          successTitle="确定通过该条优惠券么？"
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
          </div>
      );
  }
}

