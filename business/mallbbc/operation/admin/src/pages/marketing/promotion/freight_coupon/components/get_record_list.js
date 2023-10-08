/*
* 运费券列表（只针对自营店铺商品）
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import {
    list_com_page_size_10,
    dragSldTableColumn,
    getTableNum,
    sldComLanguage,
    dateFormat,
    sldHandlePaginationData,
    sldIconBtn,
    getAuthBtn,
    failTip,
    downByUrl
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
// eslint-disable-next-line no-shadow
@connect(({ freight_coupon, project }) => ({
    freight_coupon, project
}))
@Form.create()
export default class GetRecordList extends Component {

    operate_ids = '';

    //当前操作的运费券id串
    reason_list = [];

    constructor(props) {
        super(props);
        this.state = {
            search_height: 0,
            enableFlag: 0,//运费券开关
            operateData: [],
            modal_width: 700,//查看规格、下架运费券的modal框宽度
            down_reason_list: [],//获取违规下架理由
            preview_img: '',
            show_preview_modal: false,
            modalVisibleDetail: false,
            initLoading: false,
            submiting: false,
            show_foot: false,
            modalVisible: false,//是否显示规格弹框
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: `${sldComLanguage('运费券规格')}`,
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            addData: [{
                type: 'select',
                label: `${sldComLanguage('下架理由')}`,
                name: 'offlineReason',
                placeholder: `${sldComLanguage('请选择下架理由')}`,
                sel_data: [],
                sele_key: 'reasonId',
                sele_name: 'content',
                diy: true,
                rules: [{
                    required: true,
                    message: `${sldComLanguage('请选择下架理由')}`
                }]
            }, {
                type: 'textarea',
                label: `${sldComLanguage('备注')}`,
                name: 'offlineComment',
                placeholder: `${sldComLanguage('请输入违规下架理由')}`,
                extra: `${sldComLanguage('最多输入100字')}`,
                maxLength: 100
            }],//下架数据
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('会员名')}`,
                name: 'memberName',
                placeholder: `${sldComLanguage('请输入会员名')}`
            }, {
                type: 'select',
                label: `${sldComLanguage('使用状态')}`,
                name: 'states',
                placeholder: `${sldComLanguage('请选择使用状态')}`,
                sel_data: [
                    { key: '', name: `${sldComLanguage('全部')}` },
                    { key: '1', name: `${sldComLanguage('未使用')}` },
                    { key: '2', name: `${sldComLanguage('已使用')}` },
                    { key: '3', name: `${sldComLanguage('已过期')}` },
                    { key: '4', name: `${sldComLanguage('已失效')}` },
                    { key: '5', name: `${sldComLanguage('不可用')}` }
                ]
            }, {
                type: 'select',
                label: `${sldComLanguage('领取渠道')}`,
                name: 'channelName',
                placeholder: `${sldComLanguage('请选择领取渠道')}`,
                sel_data: []
            }],
            formValues: {},//搜索条件
            columns: [
                {
                    title: ' ',
                    align: 'center',
                    width: 30,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('运费券编号')}`,
                    dataIndex: 'couponCode',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('会员名')}`,
                    dataIndex: 'memberName',
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('领取渠道')}`,
                    dataIndex: 'channelName',
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('领取时间')}`,
                    dataIndex: 'receiveTime',
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('使用状态')}`,
                    dataIndex: 'useStateValue',
                    align: 'center'

                }
            ]
        };
    }

    componentDidMount() {
        this.get_list({ pageSize: pageSize });
        this.get_operation_list()
        this.resize();
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    resize = () => {
        const { search_height } = this.state;
        if (this.refs.search_part != undefined) {
            if (this.refs.search_part.clientHeight != search_height) {
                this.setState({ search_height: this.refs.search_part.clientHeight });
            }
        }
    };

    // 获取渠道信息
    get_operation_list = () => {
        const { dispatch } = this.props;
        const arr = []
        dispatch({
            type: 'project/operation_list',
            payload: { pageSize: 1000, pageNum: 1 },
            callback: (res) => {
                if (res.state == 200) {
                    if (res.data.channelInfos && res.data.channelInfos.length > 0) {
                        res.data.channelInfos.filter(item => item.channelId !== '-1').forEach(item => {
                            arr.push({
                                name: item.shortChannelName,
                                key: item.shortChannelName
                            })
                        })

                        arr.unshift({
                            name: '全部渠道',
                            key: null
                        })
                    }

                    this.setState(prev => ({
                        search_data: prev.search_data.map(item => {
                            if (item.name === 'channelName') {
                                item.sel_data = arr
                            }
                            return item
                        })
                    }));
                }
            }
        });
    }

    //获取数据列表
    get_list = (params) => {
        this.setState({ initLoading: true });
        const { dispatch, couponId } = this.props;
        dispatch({
            type: 'freight_coupon/get_freightcoupon_receive_lists',
            payload: { ...params, couponId },
            callback: (res) => {
                this.setState({ initLoading: false });
                if (res.state == 200) {
                    if (res.data.length == 0 && this.state.params.current > 1) {
                        params.current = params.current - 1;
                        this.get_list(params);
                    } else {
                        this.setState({
                            data: res.data
                        });
                    }
                }
            }
        });
    };

    // 分页跳转
    handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
        const { formValues } = this.state;
        if (type == 'main') {
            const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
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

    //搜索事件
    search = (data) => {
        const values = { ...data };
        //活动时间处理
        if (values.search_activity_time) {
            values.publishStartTime = values.search_activity_time[0] ? `${values.search_activity_time[0].format(dateFormat)} 00:00:00` : '';
            values.publishEndTime = values.search_activity_time[1] ? `${values.search_activity_time[1].format(dateFormat)} 23:59:59` : '';
            delete values.search_activity_time;
        }
        //使用时间处理
        if (values.search_user_time) {
            values.effectiveStart = values.search_user_time[0] ? `${values.search_user_time[0].format(dateFormat)} 00:00:00` : '';
            values.effectiveEnd = values.search_user_time[1] ? `${values.search_user_time[1].format(dateFormat)} 24:00:00` : '';
            delete values.search_user_time;
        }
        for (let i in values) {
            if (i == 'states') {
                let a = []
                a.push(values[i])
                values[i] = a;
            }
            if (values[i] == '' || values[i] == undefined) {
                delete values[i];
            }
        }
        this.setState({
            formValues: values,
            params: { pageSize: pageSize }
        });
        this.get_list({ pageSize: pageSize, ...values });
    };

    //搜索重置事件
    seaReset = () => {
        //搜索条件置为空
        this.setState({
            formValues: {},
            params: { pageSize: pageSize }
        });
        this.get_list({ pageSize: pageSize });
    };

    //搜索点击
    moreSearchToggle = () => {
        const { search_height } = this.state;
        if (this.refs.search_part != undefined) {
            if (this.refs.search_part.clientHeight != search_height) {
                this.setState({ search_height: this.refs.search_part.clientHeight });
            }
        }
    };

    // 导出领取记录
    export_record = () => {
        const { dispatch, couponId } = this.props;
        this.setState({ loading: true })

        dispatch({
            type: 'freight_coupon/exportReceiveInfo',
            payload: {
                couponId
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
    }

    render() {
        const { selectedRows, search_data, columns, initLoading, data } = this.state;
        return (
            <div style={{ width: '100%' }}>
                <AuthBtn eventKey={['view_freight_coupon']} btnAuth={btnAuth} showPage>
                    <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
                        <div className={global.tableListForm} ref="search_part">
                            <Search
                                search_data={search_data}
                                moreSearchToggle={() => this.moreSearchToggle()}
                                seaSubmit={(datas) => this.search(datas)}
                                seaReset={() => this.seaReset()}
                                showLessCount={5}
                            />
                        </div>
                        {/*公共功能条-start*/}
                        <AuthBtn eventKey={["export_record"]} btnAuth={btnAuth}>
                            <div className={global.operate_bg} style={{ display: 'flex', flexDirection: 'row-reverse', paddingRight: '10px' }}>
                                {
                                    sldIconBtn(() => this.export_record(), `${sldComLanguage('导出')}`, 7, 0, 14, 14, 3, 'ziyuan23', '#FA6F1E')
                                }
                            </div>
                        </AuthBtn>
                        {/*公共功能条-end*/}
                        <Spin spinning={initLoading}>
                            {/*标准表格-start*/}
                            <StandardTable
                                bordered={false}
                                selectedRows={selectedRows}
                                data={data}
                                rowKey="couponId"
                                isCheck={false}
                                columns={columns}
                                onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                                onSldHandleSeleRow={this.onSldHandleSeleRow}
                                resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                                isColumnResize
                            />
                            {/*标准表格-end*/}

                        </Spin>
                    </div>
                </AuthBtn>
            </div>


        );
    }
}
