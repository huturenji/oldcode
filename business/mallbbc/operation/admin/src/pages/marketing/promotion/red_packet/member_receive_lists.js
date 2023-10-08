/*
* 红包——红包领取详情
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin,Popover,Timeline,Empty } from 'antd';
import {
    list_com_page_size_10,
    dragSldTableColumn,
    getTableNum,
    sldComLanguage,
    dateFormat,
    sldHandlePaginationData,
    getSldEmptyH,
    sldLlineRtextAddGoods,
    sldIconBtnBg,
    getSldHorLine,
    sldIconBtn,
    downByUrl,
    failTip,
    hasAuth,
    sldtbaleOpeBtnText
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import _style from './index.less';

let pageSize = list_com_page_size_10;
@connect(({ redpacket }) => ({
    redpacket
}))
@Form.create()
export default class MemberReceiveLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: props.location.query,
            operateData: [],
            modal_width: 700,//查看规格、下架红包的modal框宽度
            down_reason_list: [],//获取违规下架理由
            preview_img: '',
            preview_alt_con: '',
            show_preview_modal: false,
            modalVisibleDetail: false,
            initLoading: false,
            submiting: false,
            show_foot: false,
            modalVisible: false,//是否显示规格弹框
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: `${sldComLanguage('红包规格')}`,
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('会员名称')}`,
                name: 'memberName',
                placeholder: `${sldComLanguage('请输入会员名称')}`
            }, {
                type: 'select',
                label: `${sldComLanguage('使用状态')}`,
                name: 'useState',
                placeholder: `${sldComLanguage('请选择使用状态')}`,
                sel_data: [
                    { key: '', name: `${sldComLanguage('全部')}` },
                    { key: '1', name: `${sldComLanguage('未使用')}` },
                    { key: '2', name: `${sldComLanguage('已使用')}` },
                    { key: '3', name: `${sldComLanguage('已过期')}` },
                    { key: '4', name: `${sldComLanguage('已失效')}` }
                ]
            }, {
                type: 'rangepicker',
                label: `${sldComLanguage('领取时间')}`,
                name: 'search_receive_time',
                placeholder1: `${sldComLanguage('开始时间')}`,
                placeholder2: `${sldComLanguage('结束时间')}`
            }, {
                type: 'rangepicker',
                label: `${sldComLanguage('使用时间')}`,//使用时间
                name: 'search_user_time',
                placeholder1: `${sldComLanguage('开始时间')}`,
                placeholder2: `${sldComLanguage('结束时间')}`
            }],
            formValues: {},//搜索条件
            useDetailList:[], // 使用详情记录
            useLoading:false, // 使用详情loading
            columns: [
                {
                    title: ' ',
                    align: 'center',
                    width: 30,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('会员名称')}`,
                    dataIndex: 'memberName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('手机号')}`,
                    dataIndex: 'phone',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('来源企业')}`,
                    dataIndex: 'companyName',
                    align: 'center',
                    width: 60
                },
                {
                    title: `${sldComLanguage('领取渠道')}`,
                    dataIndex: 'channelName',
                    align: 'center',
                    width: 60
                },
                {
                    title: `${sldComLanguage('领取时间')}`,
                    dataIndex: 'receiveTime',
                    align: 'center',
                    width: 100
                }
                ,
                {
                    title: `${sldComLanguage('初始面额')}`,
                    dataIndex: 'amount',
                    align: 'center',
                    width: 50
                },
                {
                    title: `${sldComLanguage('剩余可用余额')}`,
                    dataIndex: 'balance',
                    align: 'center',
                    width: 50
                },
                {
                    title: `${sldComLanguage('使用状态')}`,
                    dataIndex: 'useStateValue',
                    align: 'center',
                    width: 60
                }
                ,
                {
                    title: `${sldComLanguage('消费记录')}`,
                    dataIndex: 'useTime',
                    align: 'center',
                    width: 70,
                    render:(text, record)=>(
                        <Popover content={this.content()} title="消费记录" trigger="click" destroyTooltipOnHide placement="left">
                            <span> {sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => {this.getUseDetail(record.couponCode)})}</span>
                        </Popover>
                    )
                }
            ]
        };
    }

    componentDidMount() {
        this.get_list({ pageSize: pageSize });
    }

    //获取数据列表
    get_list = (params) => {
        this.setState({ initLoading: true });
        const { dispatch } = this.props;
        dispatch({
            type: 'redpacket/get_redpacket_receive_lists',
            payload: { ...params, couponId: this.state.query.id },
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

    // 获取使用详情
    getUseDetail = (couponCode) => {
        this.setState({ useLoading: true });
        const { dispatch } = this.props;
        dispatch({
            type: 'redpacket/useDetail',
            payload: { code:couponCode },
            callback: (res) => {
                this.setState({ useLoading: false });
                if (res.state == 200) {
                    const { list } = res.data
                    this.setState({
                        useDetailList:list
                    })
                }
            }
        });
    };

    // 选中行事件
    handleSelectRows = (rows, rowkeys) => {
        this.setState({
            selectedRows: rows,
            selectedRowKeys: rowkeys
        });
    };

    // 分页事件
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

    //自动补零
    autoAddZero = (num) => {
        num += ''
        if (!/\./.test(num)) {
            num += '.00'
            return num;
        }
        var arrayNum = num.split('.')
        if (arrayNum[1].length < 2) {
            num += '0'
            return num;
        }
        return num;
    }

    content = ()=> {
        const { useDetailList,useLoading } = this.state
        return (
            <Spin spinning={useLoading}>
                <div className={_style.red_records}>
                    <Timeline>
                        {
                            useDetailList && useDetailList.map((item)=>{
                                const {id,content,amount,type,createTime,orderSn} = item
                                return (
                                    <Timeline.Item key={id}>
                                        <div>
                                            <div>
                                                <span>{content}</span>
                                                <span className={`${_style.amount} ${type==1?_style.pay:_style.income}`}>{type==1?'-':'+'}{this.autoAddZero(amount)}</span>
                                            </div>
                                            {
                                                orderSn && 
                                                <div>
                                                订单号:{orderSn}
                                                </div>
                                            }
                                            <div>
                                                {createTime}
                                            </div>
                                        </div>
                                    </Timeline.Item>
                                )
                        
                            })
                        }
                    </Timeline>
                    {
                        useDetailList && useDetailList.length==0 && 
                        <Empty />
                    }
                </div>
            </Spin>
        )
    }

    //搜索事件
    search = (data) => {
        const values = { ...data };
        //领取时间处理
        if (values.search_receive_time) {
            values.receiveStartTime = values.search_receive_time[0] ? `${values.search_receive_time[0].format(dateFormat)} 00:00:00` : '';
            values.receiveEndTime = values.search_receive_time[1] ? `${values.search_receive_time[1].format(dateFormat)} 23:59:59` : '';
            delete values.search_receive_time;
        }
        //使用时间处理
        if (values.search_user_time) {
            values.useStartTime = values.search_user_time[0] ? `${values.search_user_time[0].format(dateFormat)} 00:00:00` : '';
            values.useEndTime = values.search_user_time[1] ? `${values.search_user_time[1].format(dateFormat)} 24:00:00` : '';
            delete values.search_user_time;
        }
        for (let i in values) {
            if (values[i] == '') {
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

    // 导出领取记录
    export_record = () => {
        const { dispatch } = this.props;
        this.setState({ loading: true })      

        dispatch({
            type: 'redpacket/exportReceiveInfo',
            payload: {
                couponId: this.state.query.id,
                fileName:'红包领取记录'
            },
            callback: () => {
                this.setState({ loading: false })
            }
        })
    }

    render() {
        const { selectedRows, search_data, columns, initLoading, data } = this.state;
        return (
            <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
                {getSldEmptyH(10)}
                <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
                    {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('领取详情')}`)}
                    {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
                </div>
                {getSldHorLine(1)}
                <div className={global.tableListForm}>
                    <Search
                        search_data={search_data}
                        seaSubmit={(datas) => this.search(datas)}
                        seaReset={() => this.seaReset()}
                    />
                </div>
                {/*公共功能条-start*/}
                <div className={global.operate_bg} style={{ display: 'flex', flexDirection: 'row-reverse', paddingRight: '10px' }}>
                    {
                        hasAuth('redpacket_recieve_export') && sldIconBtn(() => this.export_record(), `${sldComLanguage('导出')}`, 7, 0, 14, 14, 3, 'ziyuan23', '#FA6F1E')
                    }
                </div>
                {/*公共功能条-end*/}
                <Spin spinning={initLoading}>
                    {/*标准表格-start*/}
                    <StandardTable
                        bordered={false}
                        selectedRows={selectedRows}
                        data={data}
                        rowKey="couponMemberId"
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
            </div>
        );
    }
}
