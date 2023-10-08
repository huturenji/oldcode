/*
* 运费券列表（只针对自营店铺商品）
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Switch } from 'antd';
import Link from 'umi/link';
import {
    failTip,
    sucTip,
    list_com_page_size_10,
    dragSldTableColumn,
    getTableNum,
    sldComLanguage,
    dateFormat,
    sldHandlePaginationData,
    sldtbaleOpeBtnText,
    sldIconBtn,
    formItemLayoutModal,
    sldPopConfirmDiy,
    getAuthBtn,
    sldLlineRtextAddGoodsAddMargin
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import promotion from '@/assets/css/promotion.less';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';
import SldModal from '@/components/SldModal/SldModal';
import AuthBtn from '@/components/AuthBtn';
import DotTag from '@/components/DotTag';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
// eslint-disable-next-line no-shadow
@connect(({ freight_coupon, project }) => ({
    freight_coupon, project
}))
@Form.create()
export default class FreightCouponList extends Component {
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
            title: `${sldComLanguage('运费券规格')}`,
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('关键字')}`,
                name: 'couponName',
                placeholder: `${sldComLanguage('请输入运费券名称')}`
            }, {
                type: 'rangepicker',
                label: `${sldComLanguage('使用时间')}`,
                name: 'user_use_time',
                placeholder1: `${sldComLanguage('开始时间')}`,
                placeholder2: `${sldComLanguage('结束时间')}`
            }, {
                type: 'select',
                label: `${sldComLanguage('可用状态')}`,
                name: 'states',
                placeholder: `${sldComLanguage('请选择可用状态')}`,
                sel_data: [
                    { key: '', name: `${sldComLanguage('全部')}` },
                    { key: '1', name: `${sldComLanguage('待审核')}` },
                    { key: '2', name: `${sldComLanguage('审核拒绝')}` },
                    { key: '3', name: `${sldComLanguage('生效中')}` },
                    { key: '4', name: `${sldComLanguage('已过期')}` },
                    { key: '5', name: `${sldComLanguage('已失效')}` }
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
                    title: `${sldComLanguage('运费券ID')}`,
                    dataIndex: 'couponId',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('运费券名称')}`,
                    dataIndex: 'couponName',
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('发行总量')}`,
                    dataIndex: 'publishNum',
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('运费券面值')}`,
                    dataIndex: 'publishValue',
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('使用时间')}`,
                    dataIndex: 'effectiveStart',
                    align: 'center',
                    render: function (text, record) {
                        let res = '';
                        if (record.effectiveTimeType == '2') {
                            res = `${sldComLanguage('领取后')}${record.cycle}${sldComLanguage('天内')}`;
                        } else {
                            res = <div className={global.voucher_time_wrap}>
                                <p>{text}</p>
                                <p>~</p>
                                <p>{record.effectiveEnd}</p>
                            </div>;
                        }
                        return res;
                    }
                },
                {
                    title: `${sldComLanguage('未使用/已使用/已过期')}`,
                    dataIndex: 'usedNum',
                    align: 'center',
                    render: (text, record) => <Link to={{
                        pathname: '/marketing_promotion/freight_coupon_to_view',
                        query: {
                            id: record.couponId,
                            type: 'view_record'
                        }
                    }}
                    >
                        <div className={promotion.voucher_num}>{record.notUsedNum}/{record.usedNum}/{record.expiredNum}</div>
                    </Link>
                },
                {
                    title: `${sldComLanguage('获取方式')}`,
                    dataIndex: 'publishTypeValue',
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('可用状态')}`,
                    dataIndex: 'state',
                    align: 'center',
                    render: (text) => {
                        switch (text) {
                        case 1:
                            return <DotTag type='pending'>待审核</DotTag>
                        case 2:
                            return <DotTag type='failed'>审核拒绝</DotTag>
                        case 3:
                            return <DotTag type='sucess'>生效中</DotTag>
                        case 4:
                            return <DotTag type='normal'>已过期</DotTag>
                        case 5:
                            return <DotTag type='normal'>已失效</DotTag>
                        default:
                            return ''
                        }
                    }
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 200,
                    render: (text, record) => (
                        <Fragment>
                            <AuthBtn eventKey={["audit_freight_coupon"]} btnAuth={btnAuth}>
                                {record.state == 1 &&
                                    <Fragment>
                                        <Link to={{
                                            pathname: '/marketing_promotion/freight_coupon_to_view',
                                            query: {
                                                id: record.couponId,
                                                type: 'system'
                                            }
                                        }}
                                        >
                                            {sldtbaleOpeBtnText(`${sldComLanguage('审核')}`, () => null)}
                                        </Link>
                                        <span className={global.splitLine}></span>
                                    </Fragment>
                                }
                            </AuthBtn>
                            <AuthBtn eventKey={["detail_freight_coupon"]} btnAuth={btnAuth}>
                                <Link to={{
                                    pathname: '/marketing_promotion/freight_coupon_to_view',
                                    query: {
                                        id: record.couponId,
                                        type: 'view'
                                    }
                                }}
                                >
                                    {sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => null)}
                                </Link>
                            </AuthBtn>
                            <AuthBtn eventKey={["edit_freight_coupon"]} btnAuth={btnAuth}>
                                {/* 审核拒绝才可以编辑 */}
                                {record.state == 2 &&
                                    <Fragment>
                                        <span className={global.splitLine}></span>
                                        <Link to={{
                                            pathname: '/marketing_promotion/freight_coupon_to_add',
                                            query: {
                                                id: record.couponId,
                                                type: 'edit'
                                            }
                                        }}
                                        >
                                            {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => null)}
                                        </Link>
                                    </Fragment>
                                }
                            </AuthBtn>
                            <AuthBtn eventKey={["invalid_freight_coupon"]} btnAuth={btnAuth}>
                                {/* 只有已生效的才可以失效 */}
                                {(record.state == 3) &&
                                    <Fragment>
                                        <span className={global.splitLine} />
                                        {sldPopConfirmDiy('leftBottom', `${sldComLanguage('失效后不可恢复，是否确定失效？')}`, () => this.operate(record.couponId, 'invalid'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                            sldtbaleOpeBtnText(`${sldComLanguage('失效')}`, () => null))}
                                    </Fragment>
                                }
                            </AuthBtn>
                            <AuthBtn eventKey={["delete_freight_coupon"]} btnAuth={btnAuth}>
                                {/* 只有待审核、审核拒绝可以删除 */}
                                {(record.state == 1 || record.state == 2) &&
                                    <Fragment>
                                        <span className={global.splitLine} />
                                        {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除？')}`, () => this.operate(record.couponId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                            sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
                                    </Fragment>
                                }
                            </AuthBtn>
                            <AuthBtn eventKey={["get_record_freight_coupon"]} btnAuth={btnAuth}>
                                <span className={global.splitLine} />
                                <Link to={{
                                    pathname: '/marketing_promotion/freight_coupon_to_view',
                                    query: {
                                        id: record.couponId,
                                        type: 'view_record'
                                    }
                                }}
                                >
                                    {sldtbaleOpeBtnText(`${sldComLanguage('领用记录')}`, () => null)}
                                </Link>
                            </AuthBtn>
                        </Fragment>
                    )
                }
            ]
        };
    }

    componentDidMount() {
        this.get_list({ pageSize: pageSize });
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

    //运费券操作  type: invalid 失效 copy 复制  del 删除
    operate = (id, type) => {
        const { params, formValues } = this.state;
        const { dispatch } = this.props;
        let param_data = {};
        let dis_type = '';
        if (type == 'invalid') {
            dis_type = 'freight_coupon/invalid_freightcoupon';
            param_data.couponId = id;
        } else if (type == 'del') {
            dis_type = 'freight_coupon/del_freightcoupon';
            param_data.couponId = id;
        }
        this.setState({ submiting: true });
        dispatch({
            type: dis_type,
            payload: param_data,
            callback: (res) => {
                if (res.state == 200) {
                    sucTip(res.msg);
                    this.get_list({ ...params, ...formValues });
                    this.setState({
                        modalVisible: false
                    });
                } else {
                    failTip(res.msg);
                }
                this.setState({ submiting: false });
            }
        });
    };

    //获取数据列表
    get_list = (params) => {
        this.setState({ initLoading: true });
        const { dispatch } = this.props;
        dispatch({
            type: 'freight_coupon/get_freightcoupon_lists',
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

    //预览图片/关闭预览图片
    viewImg = (flag, img = '', text = '') => {
        this.setState({
            preview_img: img,
            preview_alt_con: text,
            show_preview_modal: flag
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
        
        //使用时间处理
        if (values.user_use_time) {
            values.effectiveStart = values.user_use_time[0] ? `${values.user_use_time[0].format(dateFormat)} 00:00:00` : '';
            values.effectiveEnd = values.user_use_time[1] ? `${values.user_use_time[1].format(dateFormat)} 23:59:59` : '';
            delete values.user_use_time;
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

    sldHandleCancle = () => {
        this.setState({ modalVisible: false });
    };

    sldHandleConfirm = (val) => {
        let selectd_reason = this.reason_list.filter(item => item.reasonId == val.offlineReason)[0];
        val.offlineReason = selectd_reason.content;
        val.couponIds = this.operate_ids;
        this.operate(val, 'down');
    };

    render() {
        const { selectedRows, search_data, columns, initLoading, data, show_preview_modal, preview_img, preview_alt_con, enableFlag, modalVisible, title, modal_width, operateData, show_foot, submiting } = this.state;
        return (
            <div style={{ width: '100%' }}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('运费券')}`, 10, 10, 10)}
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
                        <AuthBtn eventKey={["add_freight_coupon"]} btnAuth={btnAuth}>
                            <div className={global.operate_bg}>
                                <Link to={{
                                    pathname: '/marketing_promotion/freight_coupon_to_add'
                                }}
                                >
                                    {
                                        sldIconBtn(() => null, `${sldComLanguage('新建运费券')}`, 7, 0, 14, 14, 3, 'fabu1', '#FA6F1E')
                                    }

                                </Link>
                            </div>
                        </AuthBtn>
                        {/*公共功能条-end*/}
                        <Spin spinning={initLoading}>
                            {/*标准表格-start*/}
                            <StandardTable
                                totalHeight={document.body.clientHeight - 200 - 20}
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

                        {/*图片预览-start*/}
                        <SldPreviewImg
                            img={preview_img}
                            show_preview_modal={show_preview_modal}
                            modal_width={900}
                            preview_alt_con={preview_alt_con}
                            closePreviewModal={() => this.viewImg(false)}
                        />
                        {/*图片预览-end*/}
                        { /*新增/编辑对话框-start*/}
                        <SldModal
                            width={modal_width}
                            title={title}
                            submiting={submiting}
                            modalVisible={modalVisible}
                            sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
                            sldHandleCancle={this.sldHandleCancle}
                            formItemLayoutModal={formItemLayoutModal}
                            content={operateData}
                            show_foot={show_foot}
                        />
                        { /*新增/编辑对话框-end*/}
                    </div>
                </AuthBtn>
            </div>


        );
    }
}
