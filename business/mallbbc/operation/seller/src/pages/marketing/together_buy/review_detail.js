import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Tooltip,Table } from 'antd';
import {
    list_com_page_size_10,
    dragSldTableColumn,
    sldComLanguage,
    sldHandlePaginationData,
    sldLlineRtextAddGoodsAddMargin,
    sucTip,
    failTip,
    sldIconBtnBg,
    setSession,
    isEmpty,
    getAuthBtn,
    hasAuth
} from '@/utils/utils';
import global from '@/global.less';
import _styles from './index.less';
import StandardTable from '@/components/StandardTable';
import ReviewButton from '@/components/Review';
import ReviewLog from '@/components/ReviewLog';
import AuthBtn from '@/components/AuthBtn';
import DotTag from '@/components/DotTag';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
// eslint-disable-next-line no-shadow
@connect(({ promotion, global }) => ({
    promotion, global
}))
@Form.create()
export default class VerifyDetail extends Component {


    constructor(props) {
        super(props);
        this.state = {
            initLoading: false,
            detail: {}, // 活动详情信息
            data: {},//列表数据

            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key

            query: props.location.query,
            params: { pageSize: 2000, current: 1, pageIndex: 1 },//搜索条件
            formValues: {},//搜索条件
            columns: [
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
                    title: '商品审核状态',
                    dataIndex: 'verifyState',
                    align: 'center',
                    width: 100,
                    render: (text, record) => {
                        switch (text) {
                        case 0:
                            return <DotTag type='pending'>{record.verifyStateValue}</DotTag>
                        case 2:
                            return <DotTag type='sucess'>{record.verifyStateValue}</DotTag>
                        case 3:
                            return <DotTag type='failed'>{record.verifyStateValue}</DotTag>
                        default:
                            return <DotTag type='normal'>{record.verifyStateValue}</DotTag>
                        }
                    }                    
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
                    title: '划线价',
                    dataIndex: 'markingPrice',
                    align: 'center',
                    width: 100
                },
                {
                    title: '拼团价',
                    dataIndex: 'promotionPrice',
                    align: 'center',
                    width: 100
                },
                {
                    title: '实际成团件数',
                    dataIndex: 'lowestStock',
                    align: 'center',
                    width: 100
                },
                {
                    title: '成团件数',
                    dataIndex: 'wishStock',
                    align: 'center',
                    width: 100
                },
                {
                    title: '每人限购件数',
                    dataIndex: 'upperLimit',
                    align: 'center',
                    width: 100
                },
                {
                    title: '已售件数',
                    dataIndex: 'buyQuantity',
                    align: 'center',
                    width: 100
                },
                {
                    title: '参团人数',
                    dataIndex: 'buyerCount',
                    align: 'center',
                    width: 100
                },
                {
                    title: '拼团状态',
                    dataIndex: 'showState',
                    align: 'center',
                    width: 100,
                    render: (text, record) => {
                        switch (text){
                        case 1: return <DotTag type="normal">{record.showStateValue}</DotTag>
                        case 2: return <DotTag type='pending'>{record.showStateValue}</DotTag>
                        case 3: return <DotTag type='sucess'>{record.showStateValue}</DotTag>
                        case 4: return <DotTag type='failed'>{record.showStateValue}</DotTag>
                        default: return <DotTag type='normal'>{record.showStateValue}</DotTag>
                        }                    
                    } 
                }
            ]
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

    //获取详情
    get_detail = () => {
        const { query } = this.state;
        const { promotionId, stageId, promotionName, promotionDate, stageContent, stateValue, verifyState, verifyStateValue, duration, bisType } = query
        this.setState({
            detail: {
                promotionId,
                stageId,
                promotionName,
                promotionDate,
                stageContent,
                stateValue,
                verifyState,
                verifyStateValue,
                duration,
                bisType
            }
        })
    };

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
                            item.key = `${item.stageProductId}_${item.sku}`;
                        });
                        this.setState({
                            data: res.data
                        });
                    }
                }
            }
        });
    };

    handleSelectRows = (rows, rowkeys) => {
        this.setState({
            selectedRows: rows,
            selectedRowKeys: rowkeys
        });
    };

    handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
        const { formValues, params } = this.state;
        if (type == 'main') {

            const params1 = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
            const { showState } = params1
            if (isEmpty(showState)) {
                delete params.showState
            }
            Object.assign(params, params1)

            pageSize = params.pageSize;
            params.pageIndex = params.current
            this.setState({ params });
            this.get_list(params);
        }
    };

    //表格拖动
    resizeTable = (index, size, type, data) => {
        let datas = dragSldTableColumn(index, size, data);
        this.setState({ [type]: datas });
    };

    refuseEvent = (reason) => {
        this.auditPromotion({ rejectReason: reason, verifyState: 3 })
    }

    successEvent = () => {
        this.auditPromotion({ verifyState: 1 })
    }

    auditPromotion = (param) => {
        const { detail, data: { list } } = this.state
        const { dispatch } = this.props;
        param.promotionId = detail.promotionId
        param.stageId = detail.stageId
        if (list) {
            let arr = []
            list.forEach((item) => {
                arr.push(item.productId)
            })
            param.productIds = arr
        } else {
            failTip('商品不存在');
            return
        }

        dispatch({
            type: 'promotion/audit',
            payload: param,
            callback: (res) => {
                if (res.state == 200) {
                    sucTip(res.msg);
                    this.setState({
                        reviewModalVisible: false
                    });
                    setTimeout(() => {
                        this.goBackList();
                    }, 500);
                } else {
                    failTip(res.msg);
                }
            }
        });
    }

    goBackList = ()=>{
        setSession('togetherBuy_detail_back',3); 
        this.props.history.goBack()
    }

    render() {
        const { selectedRows, columns, initLoading, data, detail } = this.state;

        return (
            <div className={global.common_page}>
                <div className={global.flex_com_space_between}>
                    {sldLlineRtextAddGoodsAddMargin('#69A2F2', detail.bisType == 'audit' ? `${sldComLanguage('活动审批详情')}` : `${sldComLanguage('活动详情')}`, 0, 0, 10)}
                    {sldIconBtnBg(() => this.goBackList(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
                </div>
                <div className={`${_styles['content_des']}`}>
                    <div className={`${_styles['des_item']} ${_styles['des_item_name']}`}><span className={`${_styles['des_item_title']}`}>活动名称：</span> <span className={`${_styles['des_item_content']}`}>{detail.promotionName}</span></div>
                    <div className={`${_styles['des_item']} ${_styles['des_item_date']}`}><span className={`${_styles['des_item_title']}`}>活动日期：</span> <span className={`${_styles['des_item_content']}`}>{detail.promotionDate}</span></div>
                    <div className={`${_styles['des_item']} ${_styles['des_item_stage']}`}><span className={`${_styles['des_item_title']}`}>活动场次：</span> <span className={`${_styles['des_item_content']}`}>{detail.stageContent}</span></div>
                    <div className={`${_styles['des_item']} ${_styles['des_item_time']}`}><span className={`${_styles['des_item_title']}`}>场次时长：</span> <span className={`${_styles['des_item_content']}`}>{detail.duration}小时</span></div>
                    <div className={`${_styles['des_item']} ${_styles['des_item_state']}`}><span className={`${_styles['des_item_title']}`}>专场状态：</span> <span className={`${_styles['des_item_content']}`}>{detail.stateValue}</span></div>
                </div>

                <Spin spinning={initLoading}>
                    {/*标准表格-start*/}
                    {/* <StandardTable
                        totalHeight={document.body.clientHeight - 260}
                        bordered={false}
                        selectedRows={selectedRows}
                        data={data}
                        rowKey="key"
                        isCheck={false}
                        columns={columns}
                        onSelectRow={this.handleSelectRows}
                        onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                        onSldHandleSeleRow={this.onSldHandleSeleRow}
                        resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                        isColumnResize
                        scroll={{ x: 1000 }}
                    /> */}
                    <Table 
                        rowKey="Key"
                        columns={columns}
                        dataSource={data.list}
                        size="small"
                        pagination={this.pagination}
                    />
                    {/*标准表格-end*/}
                </Spin>
                <ReviewLog type='project/listRecord' params={{ businessId: this.props.location.query.stageId }} />
                <div
                    className={global.m_diy_bottom_wrap}
                    style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}
                >
                    {
                        detail.bisType == 'audit' && hasAuth("together_buy_audit_audit") &&
                        <ReviewButton
                            refuseText='审核拒绝'
                            refuseTitle='确定拒绝该条活动么?'
                            refuseEvent={this.refuseEvent}
                            successText='审核通过'
                            successTitle='确定通过该条活动么?'
                            successEvent={this.successEvent}
                        />
                    }


                </div>
            </div>

        );
    }
}
