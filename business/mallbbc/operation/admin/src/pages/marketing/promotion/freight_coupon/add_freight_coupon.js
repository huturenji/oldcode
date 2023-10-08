import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, Input, InputNumber, Radio, DatePicker, Table, Popconfirm,Select } from 'antd';
import moment from 'moment';
import {
    failTip,
    sucTip,
    sldLlineRtextAddGoodsAddMargin,
    sldComLanguage,
    dateTimeFormat,
    sldCommonTitleByBg,
    getSldHorLine,
    getSldEmptyH,
    isEmpty
} from '@/utils/utils';
import { coupon_link_type } from '@/utils/util_data';
import global from '@/global.less';
import SelectMemberPop from '@/components/SelectMemberPop';
import SldSelGoodsSingleDiy from '@/components/SldSelGoodsSingleDiy';
import promotion from '@/assets/css/promotion.less';
import ALibbSvg from '@/components/ALibbSvg';

let sthis = '';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
// eslint-disable-next-line no-shadow
@connect(({ redpacket, global }) => ({
    redpacket, global
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

    sele_cat_ids_array = [];//选择的最后一级分类id数组

    constructor(props) {
        super(props);
        sthis = this;
        this.state = {
            link_data: { url_type: '', url: '',wx_url:'', info: '' },
            link_type:'',
            couponFlag: true,//专题弹窗
            isFirstLoading: true,//是否第一次加载
            coupon_detail: {},//运费券详情
            cat_data: [],//三级分类数据
            checkedCatIds: [],//选择的分类id数组
            useType: 1,//适用商品类型
            useTimeType: 1,//使用时间类型
            curCouponType: 1,//当前选择的运费券类型
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
            publishType: 4,//获取方式，1为免费领取，2为指定会员发放， 3为密码领取
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
            channelList: [],
            channelType: -500,
            channelProps: {
                channelId: '',
                channelName: ''
            },
            fullPath: ''//选中的分类路径
        };
    }

    componentDidMount() {
        const { query } = this.state;
        if (query.id != undefined && query.id > 0) {
            this.get_detail(query.id);
        } else {
            this.setState({ isFirstLoading: false });
        }
        if (query.type != undefined && (query.type == 'copy' || query.type == 'edit')) {
            this.setState({ couponFlag: false });
        }

    }

    //获取运费券详情
    get_detail = async (id) => {
        const { dispatch } = this.props;
        let { checkedCatIds, query, publishType, channelType } = this.state;
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
                            // let pageSize = 1000;
                        }
                        this.get_member_list(couponMemberList, pageSize)
                    }
                    if (query.type != undefined && query.type == 'copy') {
                        res.data.couponName = '';//清空运费券名称
                        res.data.publishStartTime = '';//清空运费券的活动时间
                        if (res.data.effectiveTimeType == 1) {
                            //如果是固定使用时间，需要清空使用时间
                            res.data.effectiveStart = '';
                        }
                    }
                    if (res.data.channelId == -500) {
                        channelType = -500
                    } else {
                        channelType = 2
                    }
                    publishType = res.data.publishType;//获取方式
                    let link_data,val,name
                    if (res.data.linkInfo){
                        link_data = JSON.parse(res.data.linkInfo)
                        val = link_data?.url_type
                        this.selectLink("",val,link_data)
                        this.getDetailItemHideLabel(link_data)
                    } else {
                        val = ""
                        this.selectLink("",val)
                    }
                    name = coupon_link_type().filter(item=>item.key == val)[0]?.name
                    this.setState({
                        coupon_detail: res.data,
                        linkName:name,
                        loading: false,
                        useTimeType: res.data.effectiveTimeType,//使用时间类型
                        useType: res.data.useType,//适用商品类型
                        curCouponType: res.data.couponType,//运费券类型
                        checkedCatIds,
                        publishType,
                        channelType
                    });
                }
                this.setState({ isFirstLoading: false });
            }
        });
    };

    // 获取领取人信息
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

    // 重置选中会员
    resetSelMembers = () => {
        this.setState({
            modalVisibleMember: true,
            sle_more_title: `${sldComLanguage('指定会员发放(最少选择1个)')}`
        });
    };

    //保存并新增事件
    handleSaveAllData = () => {
        const { dispatch } = this.props;
        const { query, publishType, selectedMemberRows, loading, link_data, channelProps, checkedCategory, couponFlag, coupon_detail } = this.state;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {

                //防止连续点击添加多张运费券
                if (loading == true) {
                    return false
                }
                //使用时间处理
                if (values.effectiveTime) {
                    values.effectiveStart = values.effectiveTime[0] ? values.effectiveTime[0].format(dateTimeFormat) : '';
                    values.effectiveEnd = values.effectiveTime[1] ? values.effectiveTime[1].format(dateTimeFormat) : '';
                    delete values.effectiveTime;
                }

                //适用商品类型为指定分类
                if (values.useType == 3) {
                    if (isEmpty(checkedCategory)) {
                        failTip('请选择分类');
                        return false;
                    }
                    values.couponCategoryVO = checkedCategory;
                }


                if (publishType == 2) { //指定会员发放
                    if (selectedMemberRows.length <= 0) {
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
                    if (channelProps.channelId) {
                        const ele = couponMemberExampleList.find(el => el.channelId != channelProps.channelId)
                        if (ele) {
                            failTip(sldComLanguage(`选择“指定渠道”发放后，指定会员${ele.memberName}应为该渠道下的会员`));
                            return false;
                        }
                    }
                    values.memberVOList = couponMemberExampleList;
                }

                let dis_type = '';
                if (query.id != undefined && query.id > 0 && query.type == 'edit') {
                    //编辑运费券
                    values.couponId = query.id;
                    dis_type = 'freight_coupon/edit_freightcoupon';
                } else {
                    //新增运费券
                    dis_type = 'freight_coupon/add_freightcoupon';
                }
                if (!couponFlag) {
                    values.linkInfo = coupon_detail.linkInfo
                }
                if (link_data.url_type) {
                    values.linkInfo = JSON.stringify(link_data)
                }
                if (values.channelType == -500) {
                    values.channelId = -500;
                } else {
                    values.channelId = values.channelId
                }
                sthis.setState({ loading: true });

                dispatch({
                    type: dis_type,
                    payload: values,
                    callback: (res) => {
                        if (res.state == 200) {
                            sucTip(res.msg);
                            setTimeout(() => {
                                sthis.setState({ loading: false });
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

    // 会员弹窗取消
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

    //运费券类型选择  1 满减券 2 折扣券 3 随机金额券
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
        if (e.target.value == 2) {
            modalVisibleMember = true;
            sle_member_title = `选择要发放的会员(最少 1 个)`;
        }
        this.setState({
            sle_member_title,
            modalVisibleMember,
            publishType: e.target.value
        })
    }
     
    selectLink = (type,val,link_data)=>{
        let data = {};
        if (val == '') {
        //无操作
            data.url = link_data?.url || ''; //h5链接
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
        }else if (val == 'topic') {
        //专题
            data.url = link_data?.url || '';
            data.wx_url = link_data?.wx_url || ''; //微信链接
            data.url_type = 'topic'; //专题类型
            data.info = link_data?.info || ''; //专题id  
        }
        if(type == "sel"){
            this.setState({ couponFlag: true });
        }
        this.setState({ link_type: val });
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
        }else if (data.url_type == 'topic'){
            htmlElement = <Input value={data.info.name} disabled />
        }
        return htmlElement
    }
  
    onChange = (e,type) => {
        let { link_data } = this.state;
        link_data[type] = e;
        this.setState({ link_data });
    }
   
    seleSku = (val) => {
        let { link_data } = this.state;
        link_data.info = val;
        this.setState({ link_data });
        this.setState({ link_type: '' });
    }
  
    sldHandleLinkCancle = () => {
        this.setState({ link_type: '' });
    };

    render() {
        const {
            modalVisibleMember, loading, sle_member_title, useTimeType, columns_member, selectedMemberRows, coupon_detail,
            isFirstLoading, publishType, channelProps, useType,link_type,linkName,link_data,couponFlag
        } = this.state;
        let {
            form: { getFieldDecorator }
        } = this.props;
        return (
            <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('新建运费券')}`, 0, 0, 10)}
                {getSldHorLine(1)}
                {getSldEmptyH(10)}
                <Spin spinning={loading}>
                    <Form layout="inline">
                        <Scrollbars
                            autoHeight
                            autoHeightMin={100}
                            autoHeightMax={document.body.clientHeight - 170}
                        >
                            <div className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity}`}>
                                {/* 基本信息-start */}
                                {!isFirstLoading &&
                                    <Fragment>
                                        {sldCommonTitleByBg(`${sldComLanguage('运费劵基本信息')}`)}
                                        {getSldEmptyH(10)}
                                        <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                                            <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                <div className={`${promotion.left}`}>
                                                    <span style={{ color: 'red' }}>*</span>{sldComLanguage('运费券名称')}
                                                </div>
                                                <div className={`${promotion.right}`}>
                                                    <FormItem
                                                        extra={<span>{sldComLanguage('最多输入20个字')}</span>}
                                                        style={{ width: 300 }}
                                                    >
                                                        {getFieldDecorator('couponName', {
                                                            initialValue: coupon_detail.couponName, rules: [{
                                                                required: true,
                                                                whitespace: true,
                                                                message: `${sldComLanguage('请输入运费券名称')}`
                                                            }]
                                                        })(
                                                            <Input maxLength={20} style={{ width: 400 }} placeholder={`${sldComLanguage('请输入运费券名称')}`} />,
                                                        )}
                                                    </FormItem>
                                                </div>
                                            </div>
                                            <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                <div className={`${promotion.left}`}>
                                                    <span style={{ color: 'red' }}>*</span>{sldComLanguage('运费券面值')}
                                                </div>
                                                <div className={`${promotion.right}`}>
                                                    <FormItem
                                                        extra={<span>{sldComLanguage('可输入的最小值为0.01，最大值不超过1000')}</span>}
                                                        style={{ width: 300 }}
                                                    >
                                                        {getFieldDecorator('publishValue', {
                                                            initialValue: coupon_detail.publishValue, rules: [{
                                                                required: true,
                                                                message: `${sldComLanguage('请输入运费券面值')}`
                                                            }]
                                                        })(
                                                            <InputNumber
                                                                max={1000}
                                                                min={0.01}
                                                                step={0.01}
                                                                precision={2}
                                                                style={{ width: 400 }}
                                                                placeholder={`${sldComLanguage('请输入运费券面值')}`}
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
                                                        extra={<span>{sldComLanguage('最小值为1，最大值不超过10000')}</span>}
                                                    >
                                                        {getFieldDecorator('publishNum', {
                                                            initialValue: coupon_detail.publishNum, rules: [{
                                                                required: true,
                                                                message: `${sldComLanguage('请输入发放总量')}`
                                                            }]
                                                        })(
                                                            <InputNumber
                                                                max={10000}
                                                                min={1}
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
                                                    <span style={{ color: 'red' }}>*</span>{sldComLanguage('获取方式')}
                                                </div>
                                                <div className={`${promotion.right}`}>
                                                    <FormItem
                                                        style={{ width: 600 }}
                                                        extra={
                                                            <div>{sldComLanguage('选择“活动赠送”类型则在成功参与指定商城活动后系统自动赠送该券')}</div>
                                                        }
                                                    >
                                                        {getFieldDecorator('publishType', {
                                                            initialValue: coupon_detail.publishType != undefined ? coupon_detail.publishType : 4
                                                        })(
                                                            <RadioGroup size="small" onChange={(e) => this.handlePublishType(e)}>
                                                                <Radio value={4}>{sldComLanguage('免费领取')}</Radio>
                                                                <Radio value={1}>{sldComLanguage('活动赠送')}</Radio>
                                                                <Radio value={2}>{sldComLanguage('指定会员发放')}</Radio>
                                                                <Radio value={3}>{sldComLanguage('凭密码领取')}</Radio>
                                                            </RadioGroup>,
                                                        )}
                                                    </FormItem>
                                                </div>
                                            </div>

                                            {publishType == 2 &&
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
                                                                    disabledDate={(current) => current < moment().startOf('day')}
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
                                                                >领券当日起</span>
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
                                                                    style={{ display: 'inline-block', marginLeft: 5, color: 'rgba(0, 0, 0, 0.65)' }}
                                                                >{sldComLanguage('天')}</span>
                                                            </div>
                                                        </FormItem>
                                                    </div>
                                                </div>
                                            }

                                            <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                <div className={`${promotion.left}`}>
                                                    <span style={{ color: 'red' }} />{sldComLanguage('跳转链接')}
                                                </div>
                                                <div className={`${promotion.right}`}>
                                                    <FormItem
                                                        style={{ width: 400 }}
                                                        extra={<div>
                                                            <div>{sldComLanguage('运费券去使用跳转链接配置')}</div>
                                                        </div>}
                                                    >
                                                        {getFieldDecorator('linkInfo', {
                                                            initialValue: linkName
                                                        })(
                                                            <Select
                                                                placeholder="请选择链接类型"
                                                                onSelect={(e) => this.selectLink("sel",e)}
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
                                        {
                                            (publishType == 4||publishType == 2) && 
                                            <Fragment>
                                                {getSldEmptyH(10)}
                                                {sldCommonTitleByBg(`${sldComLanguage('领取和使用规则')}`)}
                                                {getSldEmptyH(10)}
                                                {
                                                    <Fragment>
                                                        {
                                                            publishType==4 && 
                                                            <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                                                                <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                                    <div className={`${promotion.left}`}>
                                                                        <span style={{ color: 'red' }}>*</span>每人每企业限领次数
                                                                    </div>
                                                                    <div className={`${promotion.right}`}>
                                                                        <FormItem
                                                                            style={{ width: 300 }}
                                                                            extra='每位会员在同一个企业内限制领取的次数，0代表不限制次数'
                                                                        >
                                                                            {getFieldDecorator('companyLimitReceive', {
                                                                                initialValue: coupon_detail.companyLimitReceive, rules: [{
                                                                                    required: true,
                                                                                    message: '请输入每人每企业限领次数'
                                                                                }]
                                                                            })(
                                                                                <InputNumber
                                                                                    max={100}
                                                                                    min={0}
                                                                                    precision={0}
                                                                                    style={{ width: 400 }}
                                                                                    placeholder='请输入每人每企业限领次数'
                                                                                />,
                                                                            )}
                                                                        </FormItem>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }

                                                        <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                                                            <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                                <div className={`${promotion.left}`}>
                                                                    <span style={{ color: 'red' }}>*</span>{(publishType==4) ? `每人限领次数` : `每位会员发放张数`}
                                                                </div>
                                                                <div className={`${promotion.right}`}>
                                                                    <FormItem
                                                                        style={{ width: 300 }}
                                                                        extra={(publishType==4) ? `每位会员限制领取的次数，0代表不限制次数` : `每位会员发放张数`}
                                                                    >
                                                                        {getFieldDecorator('limitReceive', {
                                                                            initialValue: coupon_detail.limitReceive, rules: [{
                                                                                required: true,
                                                                                message: `${(publishType==4) ? '请输入限制领取次数' : '请输入每个会员发放张数'}`
                                                                            }]
                                                                        })(
                                                                            <InputNumber
                                                                                max={100}
                                                                                min={0}
                                                                                precision={0}
                                                                                style={{ width: 400 }}
                                                                                placeholder={(publishType==4) ? `${sldComLanguage('请输入限制领取次数')}` : `${sldComLanguage('请输入每个会员发放张数')}`}
                                                                            />,
                                                                        )}
                                                                    </FormItem>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Fragment>
                                                }

                                            </Fragment>
                                        }
                                        {/* 领取和使用规则-end */}

                                    </Fragment>
                                }
                            </div>

                            {!isFirstLoading &&
                                <div
                                    className={global.m_diy_bottom_wrap}
                                    style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}
                                >
                                    <div onClick={() => this.props.history.goBack()} className={global.add_goods_bottom_btn}>
                                        {sldComLanguage(`${sldComLanguage('取消')}`)}
                                    </div>
                                    <Popconfirm
                                        title="是否提交审核?"
                                        onConfirm={() => this.props.form.submit(this.handleSaveAllData)}
                                        okText="确认"
                                        cancelText="取消"
                                    >
                                        <div className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}>
                                            提交审核
                                        </div>
                                    </Popconfirm>

                                </div>
                            }
                            {getSldEmptyH(20)}
                        </Scrollbars>
                    </Form>
                </Spin>

                {/*选择指定会员modal框-start*/}
                <SelectMemberPop
                    selectedRows={this.sele_more_members.info}
                    selectedRowKeys={this.sele_more_members.ids}
                    modalVisible={modalVisibleMember}
                    channelProps={channelProps}
                    width={1100}
                    height={document.body.clientHeight - 400}
                    modalCancle={this.memberPopCancle}
                    confirmMember={this.confirmMemberChoose}
                    title={sle_member_title}
                />
                {/*选择指定会员modal框-end*/}
                <SldSelGoodsSingleDiy
                    link_type={link_type}
                    seleSku={this.seleSku}
                    isFirstLoading={couponFlag}
                    sldHandleCancle={this.sldHandleLinkCancle}
                    client="mobile"
                />
            </div>
        );
    }
}

