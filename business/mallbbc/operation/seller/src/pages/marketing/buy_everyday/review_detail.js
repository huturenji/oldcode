/*
* 参与一起买活动的商品
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Tooltip,Table } from 'antd';
import {
    list_com_page_size_10,
    dragSldTableColumn,
    sldComLanguage,
    sldHandlePaginationData,
    sldtbaleOpeBtnText,
    sldLlineRtextAddMargin,
    sucTip,
    failTip,
    sldIconBtnBg,
    sldPopConfirmDiy,
    setSession,
    getAuthBtn,
    isEmpty,
    downByUrl,
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
let stateTxtValue = { 1: '未开始', 2: '进行中', 3: '已结束' }
// eslint-disable-next-line no-shadow
@connect(({ promotion, global }) => ({
    promotion, global
}))
@Form.create()
export default class JoinedGoodsList extends Component {


    constructor(props) {
        super(props);
        this.state = {
            initLoading: false,
            detail: {}, // 活动详情信息
            data: {},//列表数据

            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key

            query: props.location.query,
            params: { pageSize: pageSize, current: 1 },//搜索条件
            formValues: {},//搜索条件
            columns: [
                {
                    title: '商品名称',
                    dataIndex: 'skuName',
                    align: 'center',
                    width: 100,
                    render: (text) => <Tooltip title={text}><div className={`${_styles['sku_name']}`}>{text || '--'}</div></Tooltip>
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
                    width: 100,
                    render: (text) => <span>{text || '--'}</span>
                },
                {
                    title: '结算价',
                    dataIndex: 'supplierSettlePrice',
                    align: 'center',
                    width: 100,
                    render: (text) => <span>{text || '--'}</span>
                },
                {
                    title: '划线价',
                    dataIndex: 'markingPrice',
                    align: 'center',
                    width: 100
                },
                {
                    title: '专场价',
                    dataIndex: 'promotionPrice',
                    align: 'center',
                    width: 100
                },
                {
                    title: '商品状态',
                    dataIndex: 'state',
                    align: 'center',
                    width: 100,
                    render: (text) => <div>{text == 1 ? '上架' : '已下架'}</div>
                },
                {
                    title: '商品审核状态',
                    dataIndex: 'verifyState',
                    align: 'center',
                    width: 100,
                    render: (text) => {
                        switch (text) { //商品审核状态(0-待店铺审核,1-待平台审核,2-审核通过,3-审核拒绝)
                        case 0:
                            return <DotTag type='pending'>待审核</DotTag>
                        case 2:
                            return <DotTag type='sucess'>审核通过</DotTag>
                        case 3:
                            return <DotTag type='failed'>审核拒绝</DotTag>
                        default:
                            return <DotTag type='normal'>待审核</DotTag>
                        }
                    }      
                },                   
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 100,
                    render: (text, record) => {
                        return (
                            <Fragment>
                                {'--'} 
                            </Fragment>
                        )
                    }
                }
            ]
        };
    }


    componentDidMount() {
        const { query } = this.state;
        if (query.id != undefined && query.id > 0) {
            const { promotionName, promotionTime, state, verifyState, bisType } = query
            this.setState({
                detail: {
                    promotionId: query.id,
                    promotionName,
                    promotionTime,
                    state,
                    verifyState,
                    bisType
                }
            },()=>{
                // 获取列表页
                this.get_list({ pageSize: 2000 })
            })
        }
    }

    //获取数据列表
    get_list = (params) => {
        this.setState({ initLoading: true });
        const { dispatch } = this.props;
        const { query , detail} = this.state;
        params.pageIndex = params.current || 1
        dispatch({
            type: 'promotion/get_buyEveryday_skus',
            payload: { promotionId: query.id, ...params, verifyStates:[query.verifyState] },
            callback: (res) => {
                this.setState({ initLoading: false });
                if (res.state == 200) {
                    if (res.data.products.length == 0 && this.state.params.current > 1) {
                        params.current = params.current - 1;
                        this.get_list(params);
                    } else {
                        res.data.products.forEach((item) => {
                            item.key = `${item.sku}`;
                        });
                        detail.state = res.data.state
                        this.setState({
                            data: {
                                list: res.data.products,
                                pagination: res.data.pagination
                            },
                            detail
                        });
                    }
                }
            }
        });
    };

    //退出活动
    quitActivity = (item) => {
        this.setState({ initLoading: true });
        const { params } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'promotion/quit_buyEveryday',
            payload: {
                promotionIdBindProductId: item.id
            },
            callback: (res) => {
                this.setState({ initLoading: false });
                if (res.state == 200) {
                    sucTip('退出成功')
                    this.get_list({ pageSize: pageSize, ...params });
                } else {
                    failTip(res.msg)
                }
            }
        });
    }

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
        if (list) {
            let arr = []
            list.forEach((item) => {
                arr.push(item.id)
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
        const { detail } = this.state;
        if(!!detail.bisType){
            setSession('togetherBuy_detail_back',3); 
        }else {
            setSession('togetherBuy_detail_back',2); 
        }
        this.props.history.goBack()
    }

    // eslint-disable-next-line react/sort-comp
    pagination = {
        onChange:(current)=>{
            this.setState({
                page:{
                    current,
                    pageSize:10
                }
            })
        }
    }

    render() {
        const { selectedRows, columns, initLoading, data, detail } = this.state;

        return (
            <div className={global.common_page}>
                <AuthBtn eventKey={['buy_everyday_audit_view']} btnAuth={btnAuth} showPage>
                    <div className={global.flex_com_space_between}>
                        {sldLlineRtextAddMargin('#FA6F1E', detail.bisType == 'audit' ? `${sldComLanguage('天天专场 / 专场商品审核')}` : `${sldComLanguage('天天专场 / 专场商品列表')}`, 0, 0, 10)}
                        {sldIconBtnBg(() => this.goBackList(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
                    </div>
                    <div className={`${_styles['content_des']}`}>
                        <div className={`${_styles['des_item']} ${_styles['des_item_name']}`}><span className={`${_styles['des_item_title']}`}>活动名称：</span> <span className={`${_styles['des_item_content']}`}>{detail.promotionName}</span></div>
                        <div className={`${_styles['des_item']} ${_styles['des_item_date']}`}><span className={`${_styles['des_item_title']}`}>活动时间：</span> <span className={`${_styles['des_item_content']}`}>{detail.promotionTime}</span></div>
                        <div className={`${_styles['des_item']} ${_styles['des_item_state']}`}><span className={`${_styles['des_item_title']}`}>活动状态：</span> <span className={`${_styles['des_item_content']}`}>{stateTxtValue[detail.state]}</span></div>

                    </div>
                    <Spin spinning={initLoading}>
                        {/*标准表格-start*/}
                        {/* <StandardTable
                            totalHeight={document.body.clientHeight - 260}
                            bordered={false}
                            selectedRows={selectedRows}
                            data={data}
                            rowKey="id"
                            isCheck={false}
                            columns={columns}
                            onSelectRow={this.handleSelectRows}
                            onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                            onSldHandleSeleRow={this.onSldHandleSeleRow}
                            resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                            isColumnResize
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
                    <ReviewLog type='project/listRecord' params={{ businessId: (`S${this.props.location.query.id}` )}} />
                    <div
                        className={global.m_diy_bottom_wrap}
                        style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}
                    >
                        {
                            detail.bisType == 'audit' && hasAuth("buy_everyday_audit_audit") &&
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
                </AuthBtn>
            </div>

        );
    }
}
