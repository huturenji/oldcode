import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import {
    Button, Spin, Popover
} from 'antd';
import moment from 'moment';
import {
    list_com_page_size_10,
    sldLlineRtextAddGoods,
    sldIconBtnBg,
    getSldEmptyH,
    sldHandlePaginationData,
    formItemLayoutModal,
    dateFormat,
    failTip,
    getTableNum,
    sucTip,
    getAuthBtn,
    sldComLanguage
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import ReviewLog from '@/components/ReviewLog';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
let stateTxtValue = { 1: "未开始", 2: "进行中", 3: "已结束", 0: "待审核", 4: "审核拒绝" }

@connect(({ everyday_buy }) => ({
    everyday_buy
}))
export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: props.location.query,
            formValues: {},//搜索条件
            dateTab_height: 0,//可以变化的日期标签区域的高度
            detail: {},//详情
            initLoading: false,
            columns: [
                {
                    title: `${sldComLanguage('店铺名称')}`,
                    dataIndex: 'storeName',
                    align: 'center',
                    width: 200,
                    render: (text) => <Popover
                        placement="topLeft"
                        content={<div style={{ display: "flex", alignItems: "center", background: "#fff" }}>
                            <div>{text}</div></div>}
                    >
                        <div style={{ display: 'inline-block', margin: '0 3px' }}>{this.showUIProps(text)}</div>
                    </Popover>
                },
                {
                    title: `${sldComLanguage('商品名称')}`,
                    dataIndex: 'skuName',
                    align: 'center',
                    width: 200,
                    render: (text) => <Popover
                        placement="topLeft"
                        content={<div style={{ display: "flex", alignItems: "center", background: "#fff" }}>
                            <div>{text}</div></div>}
                    >
                        <div style={{ display: 'inline-block', margin: '0 3px' }}>{this.showUIProps(text)}</div>
                    </Popover>
                },
                {
                    title: `${sldComLanguage('SKU编号')}`,
                    dataIndex: 'sku',
                    align: 'center',
                    width: 200
                },
                {
                    title: `${sldComLanguage('商品状态')}`,
                    dataIndex: 'state',//
                    align: 'center',
                    render: (text) => <div style={{ display: 'inline-block', margin: '0 3px' }}>{this.getStateVaule(text)}</div>
                },
                {
                    title: `${sldComLanguage('销售价')}`,
                    dataIndex: 'salePrice',
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('结算价')}`,
                    dataIndex: 'supplierSettlePrice',
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('划线价')}`,
                    dataIndex: 'markingPrice',
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('专场价')}`,
                    dataIndex: 'promotionPrice',
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    render: (text, record, index) => {
                        this.getlistState()
                        const { detail } = this.state;
                        let total = detail?.pagination?.total || index
                        return (
                            <Fragment>
                                <AuthBtn eventKey={["sort_buy_everyday_goods"]} btnAuth={btnAuth}>
                                    {this.state.listItemstate == 3 || getTableNum(this.state.params, pageSize, index) == 1 ?
                                        null :
                                        <span style={{ cursor: 'pointer', marginRight: '4px', color: 'red' }} onClick={() => this.changeSort(1, record)}>置顶</span>
                                    }
                                    {this.state.listItemstate == 3 || getTableNum(this.state.params, pageSize, index) == 1 ?
                                        null :
                                        <span style={{ cursor: 'pointer', marginRight: '4px', color: 'green' }} onClick={() => this.changeSort(2, record)}>上移</span>
                                    }
                                    {this.state.listItemstate == 3 || getTableNum(this.state.params, pageSize, index) == total ?
                                        null :
                                        <span style={{ cursor: 'pointer', marginRight: '8px', color: 'blue' }} onClick={() => this.changeSort(3, record)}>下移</span>
                                    }
                                </AuthBtn>

                            </Fragment>
                        )
                    }
                }

            ],
            modalVisible: false,
            operateData: [//导出数据的内容区
                {
                    type: 'rangepicker',
                    name: 'exportdate',
                    label: `${sldComLanguage('导出日期')}`,
                    placeholder: `${sldComLanguage('请选择导出日期')}`,
                    placeholder1: `${sldComLanguage('开始时间')}`,
                    placeholder2: `${sldComLanguage('结束时间')}`,
                    initialValue: '',
                    bodyContainer: 1,
                    // disabledDate: (currentDate) => currentDate && currentDate < moment().subtract(1, 'days'),
                    rules: [{
                        required: true,
                        message: `${sldComLanguage('请选择导出日期')}`
                    }]
                }
            ],
            params: { pageSize: pageSize, pageIndex: 1, current: 1 }
        };
    }

    componentDidMount() {
        this.getGoodsList({ promotionId: this.state.query.id, ...this.state.params })
    }

    // 获取列表数据状态===state=3/2/1
    getlistState = () => {
        let listItemstate = this.state.detail.list.map((item) => {
            return item.state
        }).filter((item, index, self) => self.indexOf(item) === index).toString()
        this.state.listItemstate = listItemstate
        return listItemstate
    }

    //排序处理
    changeSort = (sortType, record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'everyday_buy/refreshSort',
            payload: { sortType, promotionIdBindProductId: record.id },
            callback: (res) => {
                if (res.state == 200) {
                    this.getGoodsList({ promotionId: this.state.query.id, ...this.state.params })
                }
            }
        });
    }

    getStateVaule = (state) => {
        //:0-已下架,1-上架
        let stateValue = { 0: "已下架", 1: "上架" }
        return stateValue[state]
    }

    //获取商品列表
    getGoodsList = (params) => {
        const { detail } = this.state;

        this.setState({ initLoading: true });
        const { dispatch } = this.props;
        dispatch({
            type: 'everyday_buy/get_check_goods_lists',
            payload: { ...params,verifyStates: [2] },
            callback: (res) => {
                this.setState({ initLoading: false });
                if (res.state == 200 && res.data) {
                    res.data.list = res.data.products
                    delete res.data['products']

                    res.data.list && res.data.list.forEach((item, index) => {
                        item.key = index;
                    });
                    this.setState({
                        detail: res.data
                    });
                } else {
                    detail.list = []
                    this.setState({
                        detail: detail
                    });
                }
            }
        });
    };

    //启动导出效果
    beginExport = () => {
        this.setState({ modalVisible: true });
    }

    //关闭导出弹框
    sldHandleCancle = () => {
        this.setState({ modalVisible: false });
    };

    //导出接口
    sldHandleConfirm = (val) => {
        //时间处理
        if (val.exportdate) {
            val.startDate = val.exportdate[0] ? `${val.exportdate[0].format(dateFormat)} 00:00:00` : '';
            val.endDate = val.exportdate[1] ? `${val.exportdate[1].format(dateFormat)} 23:59:59` : '';

            delete val.exportdate;
        }
        this.setState({ initLoading: true });
        const { dispatch } = this.props;
        dispatch({
            type: 'everyday_buy/export_goods',
            payload: { ...val, promotionId: this.state.query.id },
            callback: (res) => {
                this.setState({ initLoading: false });
                this.sldHandleCancle()
                if (res.state != 200) {
                    failTip(res.msg);
                }
                else {
                    this.downloadExcelFile(res.data.downloadPath, res.data.fileName);
                }
            }
        });
    }

    /**
     * 下载Excel
     * @param url 下载地址，也可以是一个blob对象，必选
     * @param saveName 保存文件名，可选
     */
    downloadExcelFile = (url, saveName) => {
        const that = this
        var x = new XMLHttpRequest();
        x.open("GET", url, true);
        x.responseType = 'blob';
        x.onload = function () {
            that.isExportingExcel = false;

            var url = window.URL.createObjectURL(x.response) // eslint-disable-line
            var a = document.createElement('a');
            a.href = url
            a.download = saveName;
            a.click()

        }
        x.send();
    }

    handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
        const { formValues } = this.state;
        if (type == 'main') {
            const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
            pageSize = params.pageSize;
            params.pageIndex = params.current
            this.setState({ params });
            this.getGoodsList({ ...params, promotionId: this.state.query.id });
        }
    };

    //最多展示10个字，超出…
    showUIProps = (value) => value && value.length > 10 ? `${value.substring(0, 10)}...` : value

    render() {
        const { detail, initLoading, columns, modalVisible, operateData, dateTab_height,query } = this.state;
        return (
            <div className={global.common_page} style={{ flex: 1 }}>
                <div className={global.flex_com_space_between}>
                    {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('天天专场 / 专场详情')}`)}
                    {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
                </div>
                {getSldEmptyH(8)}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ maxWidth: '20vw', wordBreak: 'break-all', display: "flex" }}>专场名称：
                            <Popover
                                placement="topLeft"
                                content={<div style={{ display: "flex", alignItems: "center", background: "#fff" }}>
                                    <div>{detail.promotionName}</div></div>}
                            >
                                <div style={{ fontWeight: 'bold' }}>{this.showUIProps(detail.promotionName)}</div>
                            </Popover>
                        </div>
                        <div style={{ maxWidth: '20vw', wordBreak: 'break-all', margin: '0 20px' }}>专场日期：<span style={{ fontWeight: 'bold' }}> {`${moment(detail.promotionTime).format(dateFormat)}`}</span></div>
                        <div style={{ maxWidth: '20vw' }}>专场状态：<span style={{ fontWeight: 'bold' }}> {stateTxtValue[detail.state]}</span></div>
                    </div>
                    {/* <Button style={{ marginLeft: '10vw' }} icon="upload" type="primary" onClick={() => this.beginExport()}>导出</Button> */}
                </div>
                {getSldEmptyH(20)}
                <Spin spinning={initLoading}>
                    {/*标准表格-start*/}
                    <StandardTable
                        totalHeight={document.body.clientHeight - 250 - dateTab_height}
                        data={detail}
                        rowKey="key"
                        isCheck={false}
                        columns={columns}
                        onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                        onSldHandleSeleRow={this.onSldHandleSeleRow}
                        resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                        isColumnResize
                    />
                    {/*标准表格-end*/}
                </Spin>
                <ReviewLog type='project/listRecord' params={{businessId:query.id}} />      
                { /*导出对话框-start*/}
                <SldModal
                    title={`${sldComLanguage('导出')}`}
                    submiting={false}
                    modalVisible={modalVisible}
                    sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
                    sldHandleCancle={this.sldHandleCancle}
                    formItemLayoutModal={formItemLayoutModal}
                    content={operateData}
                    show_foot
                />
                { /*导出对话框-end*/}
            </div>
        );
    }
}
