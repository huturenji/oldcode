/* eslint-disable react/sort-comp */
/*
* 编辑商品
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, InputNumber, Tooltip, message, Modal, Button, Spin, Table, Upload, Popconfirm } from 'antd';
import XLSX from 'xlsx';
import {
    sucTip,
    failTip,
    sldLlineRtextAddGoodsAddMargin,
    sldComLanguage,
    sldSvgIcon,
    downLoad_front,
    isObjArrRepeat,
    getStorage,
    isEmpty,
    sldIconBtnBg,
    setSession,
    getAuthBtn,
    getTableNum
} from '@/utils/utils';
import moment from 'moment';
import _groupBy from 'lodash/groupBy'
import _chunk from 'lodash/chunk';
import _uniq from 'lodash/uniq';
import _orderBy from 'lodash/orderBy';

import global from '@/global.less';
import _styles from './index.less';
import ReviewLog from '@/components/ReviewLog';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
const { confirm } = Modal;
let sthis = '';
const storeId = getStorage('storeId');
const FormItem = Form.Item;
// eslint-disable-next-line no-shadow
@connect(({ promotion, project, global }) => ({
    promotion, project, global
}))
@Form.create()
export default class ReviewEdit extends Component {
    sele_more_goods = {
        info: [],//选择的商品数组
        ids: [],//选择的商品id数组
        min_num: 1//最小数量，0为不限制
    };

    constructor(props) {
        super(props);
        sthis = this;
        const {
            form: { getFieldDecorator }
        } = props;
        this.state = {
            query: props.location.query,
            columns: [
                {
                    title: '序号',
                    dataIndex: 'index',
                    align: 'center',
                    width: 30,
                    render: (text, record, index) => getTableNum(this.state.page, 10, index)
                },
                {
                    title: '商品名称',
                    dataIndex: 'skuName',
                    align: 'center',
                    width: 100,
                    render: (text) => <Tooltip title={text}><div className={`${_styles['sku_name']}`}>{text}</div></Tooltip>
                },
                {
                    title: 'sku编号',
                    dataIndex: 'sku',
                    align: 'center',
                    width: 100
                },
                {
                    title: '销售价',
                    dataIndex: 'salePrice',
                    align: 'center',
                    width: 100
                },
                {
                    title: '结算价',
                    dataIndex: 'settlePrice',
                    align: 'center',
                    width: 100
                },
                {
                    title: <div style={{ position: 'relative' }}>
                        <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>划线价
                    </div>,
                    dataIndex: 'markingPrice',
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <FormItem
                            style={{ width: '100%' }}
                        >
                            {getFieldDecorator(`markingPrice${record.withKey}`, {
                                initialValue: text,
                                rules: [{
                                    required: true,
                                    message: `${sldComLanguage('该项必填')}`
                                }]
                            })(
                                <InputNumber
                                    min={0.01}
                                    max={9999999}
                                    precision={2}
                                    style={{ width: '100%' }}
                                    onChange={e => this.handleFieldChange(e, 'markingPrice', record)}
                                />,
                            )}
                        </FormItem>
                    )
                },
                {
                    title: <div style={{ position: 'relative' }}>
                        <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>拼团价
                    </div>,
                    dataIndex: 'promotionPrice',
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <FormItem
                            style={{ width: '100%' }}
                        >
                            {getFieldDecorator(`promotionPrice${record.withKey}`, {
                                initialValue: text,
                                rules: [{
                                    required: true,
                                    message: `${sldComLanguage('该项必填')}`
                                }]
                            })(
                                <InputNumber
                                    min={0.01}
                                    max={9999999}
                                    precision={2}
                                    style={{ width: '100%' }}
                                    onChange={e => this.handleFieldChange(e, 'promotionPrice', record)}
                                />,
                            )}
                        </FormItem>
                    )
                },
                {
                    title: <div style={{ position: 'relative' }}>
                        <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>实际成团件数
                    </div>,
                    dataIndex: 'lowestStock',
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <FormItem
                            style={{ width: '100%' }}
                        >
                            {getFieldDecorator(`lowestStock${record.withKey}`, {
                                initialValue: text,
                                rules: [{
                                    required: true,
                                    message: `${sldComLanguage('该项必填')}`
                                }]
                            })(
                                <InputNumber
                                    min={1}
                                    max={99999999}
                                    precision={0}
                                    style={{ width: '100%' }}
                                    onChange={e => this.handleFieldChange(e, 'lowestStock', record)}
                                />,
                            )}
                        </FormItem>
                    )
                },
                {
                    title: <div style={{ position: 'relative' }}>
                        <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>成团件数
                    </div>,
                    dataIndex: 'wishStock',
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <FormItem
                            style={{ width: '100%' }}
                        >
                            {getFieldDecorator(`wishStock${record.withKey}`, {
                                initialValue: text,
                                rules: [{
                                    required: true,
                                    message: `${sldComLanguage('该项必填')}`
                                }]
                            })(
                                <InputNumber
                                    min={1}
                                    max={99999999}
                                    precision={0}
                                    style={{ width: '100%' }}
                                    onChange={e => this.handleFieldChange(e, 'wishStock', record)}
                                />,
                            )}
                        </FormItem>
                    )
                },
                {
                    title: <div style={{ position: 'relative' }}>
                        <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>限购件数
                        <Tooltip placement="bottomLeft" title={sldComLanguage('限制每个会员ID在本场活动中的购买数量')}>
                            <div style={{ right: -15, top: 2, position: 'absolute' }}>{sldSvgIcon('#bfbbba', 14, 14, 'wen')}</div>
                        </Tooltip></div>,
                    dataIndex: 'upperLimit',
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <FormItem
                            style={{ width: '100%' }}
                        >
                            {getFieldDecorator(`upperLimit${record.withKey}`, {
                                initialValue: text,
                                rules: [{
                                    required: true,
                                    message: `${sldComLanguage('该项必填')}`
                                }]
                            })(
                                <InputNumber
                                    min={1}
                                    max={99999999}
                                    precision={0}
                                    style={{ width: '100%' }}
                                    onChange={e => this.handleFieldChange(e, 'upperLimit', record)}
                                />,
                            )}
                        </FormItem>
                    )
                },
                {
                    title: '操作',
                    align: 'center',
                    width: 100,
                    render: (_, record) => (
                        <AuthBtn eventKey={["delete"]} btnAuth={btnAuth}>
                            <Popconfirm
                                title="是否确定删除?"
                                onConfirm={() => this.delItem(record)}
                                onCancel={() => { }}
                            ><span className={`${_styles['operation_text']}`}>删除</span></Popconfirm>

                        </AuthBtn>
                    )
                }
            ],//商品规格表头
            filterActivityDateList: [], // 过滤用
            filterActivitySessionList: [], //过滤用
            detail: {}, // 活动详情信息
            uploading: false,
            originData: [],
            dataList: [],
            activityStateList: [], //已参加其他活动的sku
            stageMap: {}, // {2022-09-22_08:00 : 19}
            params: { pageSize: 2000, current: 1, pageIndex: 1 },//搜索条件
            page: {
                current: 1,
                pageSize: 10
            }
        };
    }

    componentDidMount() {
        const { query, params } = this.state;
        if (query.stageId != undefined && query.stageId > 0) {
            // 获取详情
            this.get_detail()
            this.get_list({ ...params })
        }
    }

    componentWillUnmount() {
    }

    //获取数据列表
    get_list = (params) => {
        const { query } = this.state;
        this.setState({ initLoading: true });
        const { dispatch } = this.props;
        params.current = params.current || 1
        dispatch({
            type: 'promotion/get_buyTogetherProduct_List',
            payload: { ...params, stageId: query.stageId, promotionId: query.promotionId, verifyStates:[query.verifyState] },
            callback: (res) => {
                this.setState({ initLoading: false });
                if (res.state == 200) {
                    if (res.data.list.length == 0 && this.state.params.current > 1) {
                        params.current = params.current - 1;
                        params.pageIndex = params.current
                        this.get_list(params);
                    } else {
                        res.data.list.forEach((item) => {
                            item.withKey = `${item.stageId}_${item.sku}`;
                        });
                        this.setState({
                            originData: res.data.list || []
                        });
                    }
                }
            }
        });
    };

    //保存并新增事件
    handleSaveAllData = () => {
        const { dispatch } = this.props;
        const { detail, originData } = this.state;
        const { promotionId, stageId } = detail
        this.props.form.validateFieldsAndScroll((err) => {
            if (!err) {
                let sendParams = {}
                let stageAndskuList = []
                let tipsInfo = []
                let sendData = _groupBy(originData, 'stageId')
                let products = []
                Object.keys(sendData).forEach((item) => {
                    // let productInfoList = []
                    let stage_sku = sendData[item]
                    // 取第一项提取公共参数
                    // const { stageId, startTime, endTime } = stage_sku[0]
                    // let _stageParams = {
                    //     stageId,
                    //     startTime,
                    //     endTime
                    // }
                    stage_sku.forEach((skus) => {
                        const { activityDate, activitySession, sku, skuName, mainImage, salePrice, promotionPrice, markingPrice, lowestStock, wishStock, upperLimit,productId } = skus
                        let arrinfo = []
                        if (isEmpty(promotionPrice)) {
                            arrinfo.push(`拼团价为必填`)
                        }
                        if (isEmpty(markingPrice)) {
                            arrinfo.push(`划线价为必填`)
                        }
                        if (Number(markingPrice)<Number(promotionPrice)) {
                            arrinfo.push(`划线价不能小于拼团价`)
                        }
                        if (isEmpty(lowestStock)) {
                            arrinfo.push(`实际成团件数为必填`)
                        }
                        if (isEmpty(wishStock)) {
                            arrinfo.push(`成团件数为必填`)
                        }
                        if (isEmpty(upperLimit)) {
                            arrinfo.push(`限购件数为必填`)
                        }
                        if (arrinfo.length > 0) {
                            let info = arrinfo.join(',')
                            tipsInfo.push(`日期${activityDate}场次${activitySession},商品${sku},${info}`)
                        }
                        // productInfoList.push({
                        //     sku,
                        //     skuName,
                        //     salePrice,
                        //     promotionPrice,                           
                        //     upperLimit,
                        //     productId,
                        //     promotionStock:wishStock
                        // })
                        products.push({
                            sku,
                            promotionPrice,                           
                            markingPrice,                           
                            upperLimit,
                            productId,
                            lowestStock,
                            wishStock
                        })
                    })
                    // _stageParams.productInfoList = productInfoList
                    // stageAndskuList.push(_stageParams)
                })
                if (products.length == 0) {
                    message.error("没有商品，无法提交审核，请取消", 6);
                    return false;
                }
                if (tipsInfo.length > 0) {
                    const rdom = (<p style={{ whiteSpace: 'pre-line' }}>{`${tipsInfo.join('\n')}`}</p>)
                    message.error(rdom, 6);
                    tipsInfo = [];
                    return false;
                }
                sendParams.promotionId = promotionId
                sendParams.stageId = stageId
                sendParams.products = products

                sthis.setState({ uploading: true });
                dispatch({
                    type: 'promotion/updateProduct',
                    payload: sendParams,
                    callback: (res) => {
                        sthis.setState({ uploading: false });
                        if (res.state == 200) {
                            sucTip(res.msg);
                            setTimeout(() => {
                                this.goBackList()
                            }, 500);
                        } else {
                            failTip(res.msg);
                        }
                    }
                });
            }
        });
    };

    sldHandleCancle = () => {
        this.setState({ modalVisibleGoods: false });
    };

    delItem = (item) => {
        this.setState({ initLoading: true });
        const {params,query } = this.state;
        const { dispatch } = this.props;
        const {stageId,sku} = item
        const parsm = {
            promotionId:query.promotionId,
            stageId,
            skuList:[sku]
        }
        dispatch({
            type: 'promotion/quit_buyTogetherProduct',
            payload: { 
                buyTogetherProductList:[parsm]
            },
            callback: (res) => {
                this.setState({ initLoading: false });
                if (res.state == 200) {   
                    failTip('退出成功')
                    let { originData } = this.state
                    originData = originData.filter(dataItem=>dataItem.withKey!=item.withKey)
                    this.setState({
                        originData
                    })   
                }else{
                    failTip(res.msg)
                }
            }
        });        
    }

    //获取详情
    get_detail = () => {
        const { query } = this.state;
        const { promotionId, stageId, promotionName, promotionDate, stageContent, stateValue,verifyState, duration } = query
        this.setState({
            detail: {
                promotionId,
                stageId,
                promotionName,
                promotionDate,
                stageContent,
                verifyState,
                stateValue,
                duration
            }
        })
    };

    handleFieldChange(val, fieldName, record) {
        let { originData } = this.state;

        //拼团价格不可以超过商品价格
        if (fieldName == 'promotionPrice' && Number(val) > Number(record.salePrice)) {
            val = record.salePrice;
        }
        //实际成团件数要小于成团件数
        if ((fieldName == 'lowestStock') && Number(val) > Number(record.wishStock)) {
            val = record.wishStock;
        }
        //实际成团件数要小于成团件数
        if ((fieldName == 'wishStock') && Number(val) < Number(record.lowestStock)) {
            val = record.lowestStock;
        }

        // 当前操作的数据
        let tar_item = originData.filter(item => item.withKey == record.withKey);
        if (tar_item.length > 0) {
            let tar_data = tar_item[0];
            if (tar_data) {
                tar_data[fieldName] = val;
                this.setState({ originData }, () => {
                    sthis.props.form.resetFields([`promotionPrice${record.withKey}`, `lowestStock${record.withKey}`, `wishStock${record.withKey}`, `upperLimit${record.withKey}`]);
                });
            }
        }
    }

    // eslint-disable-next-line react/sort-comp
    pagination = {
        onChange: (current) => {
            this.setState({
                page: {
                    current,
                    pageSize: 10
                }
            })
        }
    }

    goBackList = ()=>{
        setSession('togetherBuy_detail_back',3); 
        this.props.history.goBack()
    }

    render() {
        const { detail, uploading, columns, originData } = this.state;

        return (
            <div
                className={`${global.common_page} ${global.com_flex_column}`}
                style={{ position: 'relative' }}
            >
                <div className={global.flex_com_space_between}>
                    {sldLlineRtextAddGoodsAddMargin('#69A2F2', `${sldComLanguage('活动编辑')}`, 0, 0, 10)}
                    {sldIconBtnBg(() => this.goBackList(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
                </div>
                <div className={`${_styles['content_des']}`}>
                    <div className={`${_styles['des_item']} ${_styles['des_item_name']}`}><span className={`${_styles['des_item_title']}`}>活动名称：</span> <span className={`${_styles['des_item_content']}`}>{detail.promotionName}</span></div>
                    <div className={`${_styles['des_item']} ${_styles['des_item_date']}`}><span className={`${_styles['des_item_title']}`}>活动日期：</span> <span className={`${_styles['des_item_content']}`}>{detail.promotionDate}</span></div>
                    <div className={`${_styles['des_item']} ${_styles['des_item_stage']}`}><span className={`${_styles['des_item_title']}`}>活动场次：</span> <span className={`${_styles['des_item_content']}`}>{detail.stageContent}</span></div>
                    <div className={`${_styles['des_item']} ${_styles['des_item_time']}`}><span className={`${_styles['des_item_title']}`}>场次时长：</span> <span className={`${_styles['des_item_content']}`}>{detail.duration}小时</span></div>
                    <div className={`${_styles['des_item']} ${_styles['des_item_state']}`}><span className={`${_styles['des_item_title']}`}>专场状态：</span> <span className={`${_styles['des_item_content']}`}>{detail.stateValue}</span></div>
                </div>
                <div style={{ marginBottom: '10px' }} />

                <Spin spinning={uploading}>
                    <Scrollbars
                        autoHeight
                        autoHeightMin={100}
                        autoHeightMax={document.body.clientHeight - 270}
                    >
                        <Table
                            rowKey="withKey"
                            columns={columns}
                            dataSource={originData}
                            size="small"
                            pagination={this.pagination}
                        />
                    </Scrollbars>
                </Spin>

                <ReviewLog type='project/listRecord' params={{ businessId: this.props.location.query.stageId }} />

                <div
                    className={global.m_diy_bottom_wrap}
                    style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}
                >
                    <div onClick={() => this.goBackList()} className={global.add_goods_bottom_btn}>
                        {sldComLanguage('取消')}
                    </div>
                    <div
                        onClick={() => this.props.form.submit(this.handleSaveAllData)}
                        className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}
                    >
                        {sldComLanguage('提交审核')}
                    </div>
                </div>

            </div>
        );
    }
}
