/*
* 消惠券列表
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import Link from 'umi/link';
import {
    failTip,
    list_com_page_size_10,
    dragSldTableColumn,
    getTableNum,
    sldComLanguage,
    dateFormat,
    sldHandlePaginationData,
    sldtbaleOpeBtnText,
    sldLlineRtextAddGoodsAddMargin,
    getSldEmptyH,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import promotion from '@/assets/css/promotion.less';
import AuthBtn from '@/components/AuthBtn';
import DotTag from '@/components/DotTag';


let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
// eslint-disable-next-line no-shadow
@connect(({ consumer_coupon }) => ({
    consumer_coupon
}))
@Form.create()
export default class StoreCoupon extends Component {
    goods_spec_columns = [
        {
            title: ' ',
            dataIndex: 'id',
            align: 'center',
            width: 30,
            render: (text, record, index) => index + 1
        },
        {
            title: `${sldComLanguage('规格名称')}`,
            dataIndex: 'specValue',
            align: 'center',
            width: 400
        },
        {
            title: `${sldComLanguage('编码')}`,
            align: 'center',
            width: 200
        }
    ];

    operate_ids = '';

    //当前操作的优惠券id串
    reason_list = [];

    constructor(props) {
        super(props);
        this.state = {
            search_height: 0,
            operateData: [],
            modal_width: 700,//查看规格、下架优惠券的modal框宽度
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
            title: `${sldComLanguage('优惠券规格')}`,
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('消费券ID')}`,
                name: 'couponId',
                placeholder: `${sldComLanguage('请输入消费券ID')}`
            }, {
                type: 'input',
                label: `${sldComLanguage('消费券名称')}`,
                name: 'couponName',
                placeholder: `${sldComLanguage('请输入消费券名称')}`
            }, {
                type: 'select',
                label: `${sldComLanguage('店铺')}`,
                name: 'storeIdList',
                mode:"multiple",
                placeholder: `${sldComLanguage('请选择店铺')}`,
                sel_data: [
                    
                ]
            }, {
                type: 'select',
                label: `${sldComLanguage('可用状态')}`,
                name: 'states',
                placeholder: `${sldComLanguage('请选择可用状态')}`,
                sel_data: [
                    { key: '', name: `${sldComLanguage('全部')}` },
                    { key: '6', name: `${sldComLanguage('待审核')}` },
                    { key: '7', name: `${sldComLanguage('审核拒绝')}` },
                    { key: '8', name: `${sldComLanguage('生效中')}` },
                    { key: '5', name: `${sldComLanguage('已过期')}` },
                    { key: '2', name: `${sldComLanguage('已失效')}` }
                ]
            }, {
                type: 'select',
                label: `${sldComLanguage('消费券类型')}`,
                name: 'couponType',
                placeholder: `${sldComLanguage('请选择消费券类型')}`,
                sel_data: [
                    { key: '', name: `${sldComLanguage('全部')}` },
                    { key: '1', name: `${sldComLanguage('固定金额券')}` },
                    { key: '2', name: `${sldComLanguage('折扣券')}` }
                ]
            }, {
                type: 'select',
                label: `${sldComLanguage('获取方式')}`,
                name: 'publishType',
                placeholder: `${sldComLanguage('请选择获取方式')}`,
                sel_data: [
                    { key: '', name: `${sldComLanguage('全部')}` },
                    { key: '1', name: `${sldComLanguage('免费领取')}` },
                    { key: '5', name: `${sldComLanguage('指定会员发放')}` },
                    { key: '3', name: `${sldComLanguage('活动赠送')}` },
                    { key: '6', name: `${sldComLanguage('凭密码领取')}` }
                ]
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
                    title: `${sldComLanguage('店铺名称')}`,
                    dataIndex: 'storeName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('消费券名称')}`,
                    dataIndex: 'couponName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('消费券ID')}`,
                    dataIndex: 'couponId',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('发行总量/张')}`,
                    dataIndex: 'publishNum',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('消费券类型')}`,
                    dataIndex: 'couponTypeValue',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('消费券内容')}`,
                    dataIndex: 'discountLimitAmount',
                    align: 'center',
                    width: 100,
                    render: (text, record) => {
                        let res = ''
                        if(record.couponType==1){
                            res = <div>
                                面值{record.publishValue}元
                            </div>
                        }else{
                            res = <div>
                                {record.publishValue}折，最多优惠{record.discountLimitAmount}元
                            </div>
                        }
                        return res
                    }
                },
                {
                    title: `${sldComLanguage('使用门槛')}`,
                    dataIndex: 'couponContent',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('获取方式')}`,
                    dataIndex: 'publishTypeValue',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('已领取/已使用/已过期')}`,
                    dataIndex: 'expiredNum',
                    align: 'center',
                    width: 150,
                    render: (text, record) => <Link to={{
                        pathname: '/marketing_promotion/consumer_coupon_to_receive_list',
                        query: {
                            id: record.couponId
                        }
                    }}
                    >
                        <div className={promotion.voucher_num}>{record.receivedNum}/{record.usedNum}/{record.expiredNum}</div>
                    </Link>
                },
                {
                    title: `${sldComLanguage('可用状态')}`,
                    dataIndex: 'state',
                    align: 'center',
                    width: 100,
                    render: (text,record) => {
                        switch (text) {
                        case 6:
                            return <DotTag type='pending'>待审核</DotTag>
                        case 7:
                            return <DotTag type='failed'>审核拒绝</DotTag>
                        case 8:
                            return <DotTag type='sucess'>生效中</DotTag>
                        case 5:
                            return <DotTag type='normal'>已过期{!!record.manualEnd?`(终止领取)`:''}</DotTag>
                        case 3:
                            return <DotTag type='normal'>已删除</DotTag>
                        case 2:
                            return <DotTag type='normal'>已失效</DotTag>
                        default:
                            return ''
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
                                pathname: '/marketing_promotion/consumer_coupon_to_view',
                                query: {
                                    id: record.couponId,
                                    type: 'store'
                                }
                            }}
                            >
                                {sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => null)}
                            </Link>
                        </Fragment>
                    )
                }
            ]
        };
    }

    componentDidMount() {
        this.get_list({ pageSize: pageSize });
        let {search_height} = this.state
        this.get_store_list()
        this.resize();
        window.addEventListener('resize', this.resize);
        console.log(document.body.clientHeight - 100 - search_height - 20);
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

    //获取数据列表
    get_list = (params) => {
        this.setState({ initLoading: true });
        const { dispatch } = this.props;
        dispatch({
            type: 'consumer_coupon/get_conscoupon_lists',
            payload: { ...params },
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

    // 获取店铺数据列表
    get_store_list = (params) => {
        let { search_data } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'consumer_coupon/get_own_store_list',
            payload: params,
            callback: (res) => {
                if (res.state == 200) {
                    let storeData = res.data.list
                    storeData.forEach((item)=>{
                        item.key = item.storeId
                        item.name = item.storeName
                    })
                    let index = search_data.findIndex(item=>item.name=='storeIdList')
                    search_data[index].sel_data = storeData
                    this.setState({
                        search_data
                    });
                } else {
                    failTip(res.msg);
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
            if(i=='couponId'){
                values[i] = Number(values[i])
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

    render() {
        const { selectedRows, search_data, columns, initLoading, data, search_height } = this.state;
        return (
            <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
                {getSldEmptyH(10)}
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('消费券')}`, 0, 0, 10)}{/*消费券*/}
                <AuthBtn eventKey={['view_consumer_coupon']} btnAuth={btnAuth} showPage>

                    <div className={global.tableListForm} ref="search_part">
                        <Search
                            search_data={search_data}
                            moreSearchToggle={() => this.moreSearchToggle()}
                            seaSubmit={(datas) => this.search(datas)}
                            seaReset={() => this.seaReset()}
                        />
                    </div>
                    <Spin spinning={initLoading}>
                        {/*标准表格-start*/}
                        <StandardTable
                            totalHeight={document.body.clientHeight - 100 - search_height - 20}
                            bordered={false}
                            selectedRows={selectedRows}
                            data={data}
                            rowKey="couponId"
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
