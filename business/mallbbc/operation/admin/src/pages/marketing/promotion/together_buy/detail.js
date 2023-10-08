import { connect } from 'dva/index';
import React, { Component } from 'react';
import {
    Tabs, Button, Icon, Spin, Popover
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
    sucTip,
    sldComLanguage,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import _styles from './css/index.less';
import ReviewLog from '@/components/ReviewLog';
import DotTag from '@/components/DotTag';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
const TabPane = Tabs.TabPane;
let pageSize = list_com_page_size_10;
@connect(({ together_buy }) => ({
    together_buy
}))
export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: props.location.query,
            formValues: {},//搜索条件
            dateTab_height: 0,//可以变化的日期标签区域的高度
            activeDate: "",
            detail: {},//一起买详情
            initLoading: false,
            columns: [
                {
                    title: `${sldComLanguage('店铺名称')}`,
                    dataIndex: 'storeName',
                    align: 'center',
                    width: 150,
                    render: (text, record) => <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '150px' }}>{text}</div>
                },
                {
                    title: `${sldComLanguage('商品名称')}`,
                    dataIndex: 'skuName',
                    align: 'center',
                    width: 150,
                    render: (text, record) => <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '150px' }}>{text}</div>
                },
                {
                    title: `${sldComLanguage('SKU编号')}`,
                    dataIndex: 'sku',
                    align: 'center',
                    width: 150
                },
                {
                    title: `${sldComLanguage('销售价')}`,
                    dataIndex: 'salePrice',
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('结算价')}`,
                    dataIndex: 'settlePrice',
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('划线价')}`,
                    dataIndex: 'markingPrice',
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('拼团价')}`,
                    dataIndex: 'promotionPrice',
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('实际成团件数')}`,
                    dataIndex: 'lowestStock',
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('成团件数')}`,
                    dataIndex: 'wishStock',
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('参团人数')}`,
                    dataIndex: 'buyerCount',
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('已售件数')}`,
                    dataIndex: 'buyQuantity',
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('拼团状态')}`,
                    dataIndex: 'showState',
                    align: 'center',
                    filters: [{ text: '未开始', value: 1 }, { text: '拼团中', value: 2 }, { text: '拼团成功', value: 3 }, { text: '拼团失败', value: 4 }],
                    filterMultiple: false,
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
            params: { pageSize: pageSize, current: 1, pageIndex:1 },
            expandForm: false,
            goodsData: {}//商品列表数据
        };
    }

    componentDidMount() {
        this.get_activity_detail();
    }

    //获取活动详情
    get_activity_detail = () => {
        this.setState({ initLoading: true });
        const { dispatch } = this.props;

        dispatch({
            type: 'together_buy/get_activity_detail',
            payload: { promotionId: this.state.query.id },
            callback: (res) => {
                this.setState({ initLoading: false });
                if (res.state == 200) {
                    this.setState({
                        detail: res.data
                    });
                    this.get_stage_lists()
                }
            }
        });
    };

    //获取场次详情
    get_stage_lists = () => {
        this.setState({ initLoading: true });
        const { dispatch } = this.props;
        const { detail } = this.state;
        dispatch({
            type: 'together_buy/get_stage_lists',
            payload: { promotionId: this.state.query.id},
            callback: (res) => {
                this.setState({ initLoading: false });
                if (res.state == 200) {
                    detail.buyTogetherStageGroupList = res.data.buyTogetherStageGroupList
                    detail.buyTogetherStageGroupList.sort((x, y) => {
                        if (moment(x.stageDate).isAfter(moment(y.stageDate))) {
                            return 1
                        }
                        return -1
                    })

                    this.setState({
                        detail: detail
                    });
                    this.setUIdates()
                }
            }
        });
    };

    //设置UI显示的日期和场次数据
    setUIdates = () => {
        const { detail, expandForm } = this.state;
        //如果日期总数大于7个，并且不是全部展开，只显示7个。
        if (detail.buyTogetherStageGroupList.length > 7 && !expandForm) {
            detail.uiDates = detail.buyTogetherStageGroupList.slice(0, 7);
        } else {
            detail.uiDates = detail.buyTogetherStageGroupList;
        }

        this.setState({
            detail: detail
        });

        //uiDates 被重新赋值，我们默认取值第一个
        this.onDateTabClick(detail.uiDates[0])
        //uiDates 被重新赋值，重新计算列表区域高度
        this.dateTabsHeight()
    }

    //启动导出效果
    beginExport = () => {
        this.setState({ modalVisible: true });
    }

    //日历标签组的点击
    onDateTabClick = (date) => {
        //点击日历，调整场次标签组数据
        const { detail } = this.state;

        detail.seesions = []
        date.buyTogetherStageVOList && date.buyTogetherStageVOList.map((item) => {
            detail.seesions.push(item)
        })
        detail.seesions.sort((x, y) => {
            if (moment(x.startTime).isAfter(moment(y.startTime))) {
                return 1
            }
            return -1
        })
        this.setState({ activeDate: date.day, detail: detail }, () => {
            //默认选中第一个场次
            this.onSessionsTabClick(detail.seesions[0].stageId)
        })
    }

    //更新日期标签区域的高度
    dateTabsHeight = () => {
        const { dateTab_height } = this.state;
        if (this.refs.datetabs_part != undefined) {
            if (this.refs.datetabs_part.clientHeight != dateTab_height) {
                this.setState({ dateTab_height: this.refs.datetabs_part.clientHeight });
            }
        }
    };

    //场次标签组的点击
    onSessionsTabClick = (stageId) => {
        const { query } = this.state;

        let values = {
            state: undefined,
            stageId: stageId,
            promotionId: query.id
        }

        this.setState({
            formValues: values,
            params: { pageSize: pageSize, current: 1 , pageIndex:1}
        }, function () {
            //获取商品列表
            this.getGoodsList({ ...values, pageSize: pageSize, current: 1, pageIndex:1 })
        });
    }

    //获取商品列表
    getGoodsList = (params) => {
        this.setState({ initLoading: true });
        const { dispatch } = this.props;
        dispatch({
            type: 'together_buy/get_check_goods_lists',
            payload: { ...params },
            callback: (res) => {
                this.setState({ initLoading: false });
                if (res.state == 200 && res.data && res.data.list && res.data.list.length > 0) {
                    res.data.list.forEach((item, index) => {
                        item.key = index;
                    });
                    this.setState({
                        goodsData: res.data
                    });
                } else {
                    this.setState({
                        goodsData: { list: [] }
                    });
                }
            }
        });
    };

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
            type: 'together_buy/export_goods',
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
            this.getGoodsList(params);
        }
    };

    //日期的展开和关闭
    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm
        }, () => {
            this.setUIdates()
        });
    }

    //最多展示10个字，超出…
    showUIProps = (value) => {
        return value && value.length > 10 ? `${value.substring(0, 10)}...` : value
    }

    render() {
        const { detail, initLoading, goodsData, columns, modalVisible, operateData, expandForm, activeDate, dateTab_height, query } = this.state;
        return (
            <div className={global.common_page} style={{ flex: 1 }}>
                <div className={global.flex_com_space_between}>
                    {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('一起买活动 / 活动详情')}`)}
                    {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
                </div>
                {getSldEmptyH(8)}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}>
                        <div style={{ maxWidth: '20vw', wordBreak: 'break-all', display: "flex" }}>活动名称：
                            <Popover
                                placement="topLeft"
                                content={<div style={{ display: "flex", alignItems: "center", background: "#fff" }}>
                                    <div>{detail.promotionName}</div></div>}
                            >
                                <div style={{ fontWeight: 'bold' }}>{this.showUIProps(detail.promotionName)}</div>
                            </Popover>
                        </div>
                        <div style={{ maxWidth: '20vw', wordBreak: 'break-all' }}>活动日期：<span style={{ fontWeight: 'bold' }}> {`${moment(detail.startTime).format(dateFormat)}~${moment(detail.endTime).format(dateFormat)}`}</span></div>
                        <div style={{ maxWidth: '20vw', wordBreak: 'break-all', display: "flex" }}>活动场次：
                            <Popover
                                placement="topLeft"
                                content={<div style={{ display: "flex", alignItems: "center", background: "#fff" }}>
                                    <div>{detail.stageHourTimeList && detail.stageHourTimeList.toString()}</div></div>}
                            >
                                <div style={{ fontWeight: 'bold' }}>{this.showUIProps(detail.stageHourTimeList && detail.stageHourTimeList.toString())}</div>
                            </Popover>
                        </div>
                        <div style={{ maxWidth: '20vw' }}>场次时长：<span style={{ fontWeight: 'bold' }}> {`${detail.duration}小时`}</span></div>
                        <div style={{ maxWidth: '20vw' }}>活动状态：<span style={{ fontWeight: 'bold' }}> {detail.stateValue}</span></div>
                    </div>
                    <AuthBtn eventKey={["export_together_buy_goods"]} btnAuth={btnAuth}>
                        <Button style={{ marginLeft: '10vw' }} icon="upload" type="primary" onClick={() => this.beginExport()}>导出</Button>
                    </AuthBtn>
                </div>
                {getSldEmptyH(8)}
                <div className={`${_styles['date_box']}`} ref="datetabs_part">
                    <div className={`${_styles['date_group']}`}>
                        {
                            detail.uiDates && detail.uiDates.map((date, index) => <div
                                className={`${_styles['date_item']} ${activeDate == date.day ? _styles['date_item_check'] : ''}`}
                                onClick={() => this.onDateTabClick(date, index)}
                                key={index}
                            >{date.day}</div>)
                        }
                        {detail.buyTogetherStageGroupList && detail.buyTogetherStageGroupList.length > 7 &&
                            <a style={{ marginLeft: 5, fontSize: 14, height: '24px', lineHeight: '24px', color: '#fd6918' }} onClick={this.toggleForm}>
                                {expandForm ? `${sldComLanguage('收起')}` : `${sldComLanguage('展开')}`} <Icon type={expandForm ? 'up' : 'down'} />
                            </a>}
                    </div>
                </div>

                {getSldEmptyH(8)}
                {detail.seesions && detail.seesions.length && <Tabs animated={false} onChange={this.onSessionsTabClick}>
                    {
                        detail.seesions && detail.seesions.map((seesion) => <TabPane tab={`${seesion.stageContent}场次（${seesion.stateValue}）`} key={seesion.stageId}></TabPane>)
                    }
                </Tabs>}
                {/*公共功能条-end*/}
                {getSldEmptyH(8)}
                <Spin spinning={initLoading}>
                    {/*标准表格-start*/}
                    <StandardTable
                        totalHeight={document.body.clientHeight - 250 - dateTab_height}
                        data={goodsData}
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
