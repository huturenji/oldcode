/*
* 活动审核列表
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import Link from 'umi/link';
import {
    list_com_page_size_10,
    dragSldTableColumn,
    sldComLanguage,
    dateFormat,
    sldHandlePaginationData,
    sldtbaleOpeBtnText,
    isNotEmpty,
    getAuthBtn,
    withKey,
    hasAuth
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import AuthBtn from '@/components/AuthBtn';
import DotTag from '@/components/DotTag';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
//场次状态(1-未开始,2-进行中,3-已结束)
@connect(({ promotion }) => ({
    promotion
}))
@Form.create()
export default class ReviewList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initLoading: false,
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            params: { pageSize: pageSize, pageIndex: 1 },//搜索条件
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('活动名称')}`,
                name: 'promotionName',
                placeholder: `${sldComLanguage('请输入活动名称')}`
            }, {
                type: 'rangepicker',
                label: '活动日期',
                name: 'search_activity_time',
                placeholder1: `${sldComLanguage('开始时间')}`,
                placeholder2: `${sldComLanguage('结束时间')}`
            },
            {
                type: 'select',
                label: '商品审核状态',
                name: 'verifyStates',
                placeholder: '请选择商品审核状态',
                sel_data: [
                    //2-审核通过 3-审核拒绝
                    { key: '0', name: '待审核' },
                    // { key: '2', name: '审核通过' },
                    { key: '3', name: '审核拒绝' }
                ]
            }],
            formValues: {},//搜索条件
            columns: [
                {
                    title: `${sldComLanguage('活动名称')}`,
                    dataIndex: 'promotionName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('活动日期')}`,
                    dataIndex: 'promotionDate',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('活动场次')}`,
                    dataIndex: 'stageContent',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('场次时长')}`,
                    dataIndex: 'duration',
                    align: 'center',
                    width: 100,
                    render: (text)=><div>{text}小时</div>
                },
                {
                    title: `${sldComLanguage('场次状态')}`,
                    dataIndex: 'stateValue',
                    align: 'center',
                    width: 100,
                    render: (text,reocord) => {
                        switch(reocord.state) {
                        case 1:
                            return <DotTag type='normal'>{text}</DotTag>
                        case 2:
                            return <DotTag type='sucess'>{text}</DotTag>
                        case 3:
                            return <DotTag type='normal'>{text}</DotTag>
                        default:
                            return <DotTag type='normal'>{text}</DotTag>
                        }
                    }                    
                },                
                {
                    title: `${sldComLanguage('商品审核状态')}`,
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
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            <Link to={{
                                pathname: '/marketing/together_buy_review_detail',
                                query: {
                                    promotionId: record.promotionId,
                                    stageId: record.stageId,
                                    promotionName: record.promotionName,
                                    promotionDate: record.promotionDate,
                                    stageContent: record.stageContent,
                                    stateValue: record.stateValue,
                                    verifyState: record.verifyState,
                                    verifyStateValue: record.verifyStateValue,
                                    duration: record.duration,
                                    bisType: 'view'
                                }
                            }}
                            >
                                {sldtbaleOpeBtnText('查看', () => null)}
                            </Link>
                            <AuthBtn eventKey={["together_buy_audit_view"]} btnAuth={btnAuth}>
                                <Link to={{
                                    pathname: '/marketing/together_buy_review_edit',
                                    query: {
                                        promotionId: record.promotionId,
                                        stageId: record.stageId,
                                        promotionName: record.promotionName,
                                        promotionDate: record.promotionDate,
                                        stageContent: record.stageContent,
                                        stateValue: record.stateValue,
                                        verifyState: record.verifyState,
                                        verifyStateValue: record.verifyStateValue,
                                        duration: record.duration
                                    }
                                }}
                                >
                                    {(record.verifyState == 3 && record.state == 1) && hasAuth('together_buy_audit_edit')&& sldtbaleOpeBtnText('编辑', () => null)}
                                </Link>
                            </AuthBtn>
                            {
                                record.verifyState == 0 && hasAuth("together_buy_audit_audit")&&
                                <Link to={{
                                    pathname: '/marketing/together_buy_review_detail',
                                    query: {
                                        promotionId: record.promotionId,
                                        stageId: record.stageId,
                                        promotionName: record.promotionName,
                                        promotionDate: record.promotionDate,
                                        stageContent: record.stageContent,
                                        stateValue: record.stateValue,
                                        verifyState: record.verifyState,
                                        verifyStateValue: record.verifyStateValue,
                                        duration: record.duration,
                                        bisType: 'audit'
                                    }
                                }}
                                >
                                    {hasAuth('together_buy_audit_audit')&&sldtbaleOpeBtnText('审核', () => null)}
                                </Link>

                            }
                        </Fragment>

                    )
                }
            ]
        };
    }

    componentDidMount() {
        this.get_list({ pageSize: pageSize, pageIndex: 1 });
    }

    //获取数据列表
    get_list = (params) => {
        this.setState({ initLoading: true });
        const { dispatch } = this.props;
        //如果用户没有手动选择，默认 全部
        if (params.verifyStates == 0) {
            params.verifyStates = [0]
        } else if (!isNotEmpty(params.verifyStates)) {
            params.verifyStates = [0, 3]
            // delete params['verifyStates']
        } else {
            params.verifyStates = [params.verifyStates]
        }
        dispatch({
            type: 'promotion/get_listAudit_stage',
            payload: { ...params },
            callback: (res) => {
                this.setState({ initLoading: false });
                if (res.state == 200) {
                    if (res.data.length == 0 && this.state.params.current > 1) {
                        params.current = params.current - 1;
                        params.pageIndex = params.current
                        this.get_list(params);
                    } else {
                        const {list,pagination} = res.data
                        this.setState({
                            data:{
                                list: Array.isArray(list) ? withKey(list):[],
                                pagination
                            }
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
        const { formValues } = this.state;
        if (type == 'main') {
            const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
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

    //搜索事件
    search = (data) => {
        const values = { ...data };
        //活动时间处理
        if (values.search_activity_time) {
            values.startTime = values.search_activity_time[0] ? `${values.search_activity_time[0].format(dateFormat)} 00:00:00` : '';
            values.endTime = values.search_activity_time[1] ? `${values.search_activity_time[1].format(dateFormat)} 23:59:59` : '';
            delete values.search_activity_time;
        }
        for (let i in values) {
            if (values[i] == '') {
                delete values[i];
            }
        }
        this.setState({
            formValues: values,
            params: { pageSize: pageSize, pageIndex: 1 }
        });
        this.get_list({ pageSize: pageSize, ...values, pageIndex: 1 });
    };

    //搜索重置事件
    seaReset = () => {
        //搜索条件置为空
        this.setState({
            formValues: {},
            params: { pageSize: pageSize, pageIndex: 1 }
        });
        this.get_list({ pageSize: pageSize, pageIndex: 1 });
    };

    render() {
        const { selectedRows, search_data, columns, initLoading, data } = this.state;
        return (
            <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
                <AuthBtn eventKey={['together_buy_audit_view']} btnAuth={btnAuth} showPage>
                    <div className={global.tableListForm}>
                        <Search
                            search_data={search_data}
                            seaSubmit={(datas) => this.search(datas)}
                            seaReset={() => this.seaReset()}
                        />
                    </div>
                    <Spin spinning={initLoading}>
                        {/*标准表格-start*/}
                        <StandardTable
                            totalHeight={document.body.clientHeight - 360}
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
                        />
                        {/*标准表格-end*/}
                    </Spin>
                </AuthBtn>
            </div>

        );
    }
}
