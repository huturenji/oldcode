import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, Table, Button } from 'antd';
import {
    sldComLanguage,
    getSldEmptyH,
    failTip,
    getAuthBtn,
    hasAuth,
    downByUrl,
    sldCommonTitleByBg
} from '@/utils/utils';
import { coupon_link_type } from '@/utils/util_data';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import ReviewButton from '@/components/Review';
import ReviewLog from '@/components/ReviewLog';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
// eslint-disable-next-line no-shadow
@connect(({ freight_coupon, global }) => ({
    freight_coupon, global
}))
@Form.create()
export default class FreightCouponDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coupon_detail: {},//红包详情
            cat_data: [],//三级分类数据
            checkedCatIds: [],//选择的分类id数组
            useType: 1,//适用商品类型
            useTimeType: 1,//使用时间类型
            curCouponType: 1,//当前选择的红包类型
            query: props.couponId,
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
                    render: (text) => text ? text : '--'
                },
                {
                    title: '公司',//渠道
                    dataIndex: 'companyName',
                    align: 'center',
                    width: 80,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '渠道',//渠道
                    dataIndex: 'channelName',
                    align: 'center',
                    width: 80,
                    render: (text) => text ? text : '--'
                }
            ],
            pagination: {
                current: 1,
                pageSize: 5
            },
            linkInfo: null,
            channelList: [],
            checkedCategory: []
        };
    }

    componentDidMount() {
        const { query } = this.state;

        if (query != undefined && query > 0) {
            this.get_detail(query);
        }
    }

    //获取红包详情
    get_detail = async (id) => {
        const { dispatch } = this.props;
        let { checkedCatIds } = this.state;
        this.setState({ loading: true });
        dispatch({
            type: 'freight_coupon/get_freightcoupon_detail',
            payload: { couponId: id },
            callback: async (res) => {
                if (res.state == 200) {
                    if (res.data.publishType == 2 && res.data.memberVOList) {//指定会员 需要查询会员列表
                        let pageSize = 1000;
                        let couponMemberList = []
                        try {
                            pageSize = res.data.memberVOList.length;
                            res.data.memberVOList.forEach((item) => {
                                couponMemberList.push({
                                    companyId: item.companyId,
                                    memberName: item.memberName
                                })
                            })
                        } catch (error) {

                        }
                        this.get_member_list(couponMemberList, pageSize)
                    }
                    let checkedCategory = []
                    if (res.data.useType == 3) {
                        const category = res.data.couponProductCategoryVOList[0]
                        const { categoryName1, categoryName2, categoryName3 } = category
                        if (categoryName1) { checkedCategory.push(categoryName1) }
                        if (categoryName2) { checkedCategory.push(categoryName2) }
                        if (categoryName3) { checkedCategory.push(categoryName3) }

                    }
                    let linkInfo = null;
                    if (res.data.linkInfo) {
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
                        curCouponType: res.data.couponType,//红包类型
                        checkedCatIds,
                        linkInfo,
                        checkedCategory
                    });
                }
            }
        });
    };
    
    // 获取指定会员信息
    get_member_list = (couponMemberList, pageSize) => {
        let { selectedMemberRows } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'project/get_member_detail_lists',
            payload: { memberInfoList: couponMemberList, pageSize },
            callback: async (res) => {
                if (res.state == 200) {
                    if (res.data.length > 0) {
                        // todo 经过沟通，公司相关的数据暂时前端写死，后续再优化 2021-12-14
                        res.data = res.data.map(item => ({
                            ...item,
                            keyId: `${item.companyId}${item.memberId}`
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
    
    // 导出卡密
    exportWithPass = () => {
        const { dispatch } = this.props;
        const { coupon_detail } = this.state
        this.setState({ loading: true })

        dispatch({
            type: 'freight_coupon/exportWithPass',
            payload: {
                couponId: coupon_detail.couponId,
                fileName: sldComLanguage('运费券卡密')
            },
            callback: (res) => {
                if(res.state == 200){
                    const {downloadPath,fileName} = res.data
                    downByUrl(downloadPath,fileName)
                }else{
                    failTip(res.msg);
                }
                this.setState({ loading: false })
            }
        })
    };
    
    // 审核通过
    successEvent = () => {
        this.event("审核通过", "true")
    };
    
    // 审核拒绝
    refuseEvent = (value) => {
        this.event(value, "false")
    };
    
    // 审核执行
    event = (value, passed) => {
        const { dispatch } = this.props;
        const { coupon_detail, query } = this.state
        let param = { couponId: coupon_detail.couponId, passed: passed, remark: value }
        this.setState({ loading: true })
        dispatch({
            type: 'freight_coupon/approve',
            payload: param,
            callback: (res) => {
                if (res.state == 200) {
                    this.get_detail(query);
                } else {
                    failTip(res.msg)
                }
                this.setState({ loading: false })
            }
        })
    };

    render() {
        const {
            loading, useTimeType, columns_member, selectedMemberRows, coupon_detail,linkInfo
        } = this.state;
        const { type } = this.props;
        return (
            <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
                <Spin spinning={loading}>
                    <Form layout="inline">
                        <div className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity}`}>
                            <Scrollbars
                                autoHeight
                                autoHeightMin={100}
                                autoHeightMax={document.body.clientHeight - 200}
                            >
                                {/* 基本信息-start */}
                                {getSldEmptyH(10)}
                                {sldCommonTitleByBg(`${sldComLanguage('优惠券基本信息')}`)}
                                {getSldEmptyH(10)}
                                <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>

                                    <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                        <div className={`${promotion.left}`}>
                                            <span style={{ color: 'red' }}>*</span>{sldComLanguage('运费券名称')}
                                        </div>
                                        <div className={`${promotion.right}`}>
                                            {coupon_detail.couponName}
                                        </div>
                                    </div>
                                    <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                        <div className={`${promotion.left}`}>
                                            <span style={{ color: 'red' }}>*</span>{sldComLanguage('运费券面值')}
                                        </div>
                                        <div className={`${promotion.right}`}>
                                            {coupon_detail.publishValue}
                                        </div>
                                    </div>

                                    <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                        <div className={`${promotion.left}`}>
                                            <span style={{ color: 'red' }}>*</span>{sldComLanguage('发行总量')}
                                        </div>
                                        <div className={`${promotion.right}`}>
                                            {coupon_detail.publishNum}
                                        </div>
                                    </div>

                                    <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                        <div className={`${promotion.left}`}>
                                            <span style={{ color: 'red' }}>*</span>{sldComLanguage('获取方式')}
                                        </div>
                                        <div className={`${promotion.right}`}>
                                            {coupon_detail.publishType == 1 && `${sldComLanguage('活动赠送')}`}
                                            {coupon_detail.publishType == 2 && `${sldComLanguage('指定会员发放')}`}
                                            {coupon_detail.publishType == 3 && `${sldComLanguage('凭密码领取')}`}
                                            {coupon_detail.publishType == 4 && `${sldComLanguage('免费领取')}`}
                                            {hasAuth('export_pass_freight_coupon') && coupon_detail.publishType == 3 && coupon_detail.state != 1 && coupon_detail.state != 2 && <Button type="primary" size='small' style={{ marginLeft: '10px' }} onClick={() => { this.exportWithPass() }}>导出卡密</Button>}
                                        </div>
                                    </div>

                                    <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                        <div className={`${promotion.left}`}>
                                            <span style={{ color: 'red' }}>*</span>{sldComLanguage('使用时间')}
                                        </div>
                                        <div className={`${promotion.right}`}>
                                            {useTimeType == 1 && coupon_detail.effectiveStart && `${coupon_detail.effectiveStart} ~ ${coupon_detail.effectiveEnd}`}
                                            {useTimeType == 2 && `${sldComLanguage('领券当日起天')}${coupon_detail.cycle}${sldComLanguage('内可以使用')}`}
                                        </div>
                                    </div>

                                    {coupon_detail.publishType == 2 &&
                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: 'red' }}>*</span>{sldComLanguage('已选择会员')}
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <Scrollbars
                                                    autoHeight
                                                    autoHeightMax={200}
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
                                {(coupon_detail.publishType ==4||coupon_detail.publishType ==2) &&
                                    <Fragment>
                                        {getSldEmptyH(10)}
                                        {sldCommonTitleByBg(`${sldComLanguage('领取和使用规则')}`)}
                                        {
                                            coupon_detail.publishType==4 && 
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
                                        
                                        {getSldEmptyH(10)}
                                        <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                                            <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                                <div className={`${promotion.left}`}>
                                                    {coupon_detail.publishType ==2?sldComLanguage('每位会员发放张数'):sldComLanguage('每人限领次数')}
                                                </div>
                                                <div className={`${promotion.right}`}>
                                                    {coupon_detail.limitReceive
                                                        ? `${sldComLanguage(`每位会员${coupon_detail.publishType ==2?'发放':'限制领取'}`)}${coupon_detail.limitReceive}${sldComLanguage(`${coupon_detail.publishType ==2?'张':'次'}`)}`
                                                        : `${sldComLanguage('不限制次数')}`
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </Fragment>
                                }
                                {/* 领取和使用规则-end */}

                                {getSldEmptyH(30)}
                                <ReviewLog type="freight_coupon/listRecord" params={{ couponId: coupon_detail.couponId }}></ReviewLog>
                                {getSldEmptyH(30)}
                                {/*审核 对话框-start*/}
                                <AuthBtn eventKey={["audit_freight_coupon"]} btnAuth={btnAuth}>
                                    {
                                        type == 'system' && coupon_detail.state == 1 &&
                                        <div className={`${promotion.bottom_fixed_wrap}`}>
                                            <ReviewButton
                                                refuseText="审核拒绝"
                                                refuseTitle="确定拒绝该运费券么？"
                                                refuseEvent={this.refuseEvent}
                                                successText="审核通过"
                                                successTitle="确定通过该运费券么？"
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

