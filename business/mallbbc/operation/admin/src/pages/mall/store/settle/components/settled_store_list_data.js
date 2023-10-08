/*
* 入驻店铺管理——入驻店铺列表
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import router from 'umi/router';
import {
    list_com_page_size_10,
    dragSldTableColumn,
    getTableNum,
    sldComLanguage,
    sldHandlePaginationData,
    sldtbaleOpeBtnText,
    list_com_page_more,
    sldPopConfirmDiy,
    failTip,
    sucTip,
    formItemLayoutModal,
    getAuthBtn
} from '@/utils/utils';
import { week_to_num, month_to_num } from '@/utils/util_data';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';
import AuthBtn from '@/components/AuthBtn';

const storeType = {
    '1':'非自营接入店铺',
    '2':'非自营手工店铺'
}
let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
@connect(({ store }) => ({
    store
}))
@Form.create()
export default class SettledStoreListData extends Component {
    operate_id = '';

    //当前操作的店铺id
    operate_info = {};

    //当前操作的店铺信息
    week_data = {
        type: 'checkboxgroup',
        label: `${sldComLanguage('结算周期')}`,
        extra: `${sldComLanguage('设置该商家每周几进行结算，可多选，全部选中则为按天结算。')}`,
        name: 'billDays',
        placeholder: `${sldComLanguage('请选择结算周期')}`,
        sldOptions: week_to_num(),
        rules: [{
            required: true,
            message: `${sldComLanguage('请选择结算周期')}`
        }]
    };

    month_data = {
        type: 'checkboxgroup',
        label: `${sldComLanguage('结算周期')}`,
        extra: `${sldComLanguage('设置该商家每月几号进行结算，可多选，若当月没有设置的日期则该日不进行结算。')}`,
        name: 'billDays',
        placeholder: `${sldComLanguage('请选择结算周期')}`,
        sldOptions: month_to_num(),
        rules: [{
            required: true,
            message: `${sldComLanguage('请选择结算周期')}`//请选择结算周期
        }]
    };

    constructor(props) {
        super(props);
        this.state = {
            search_height: 0,
            modalVisible: false,
            submiting: false,
            initLoading: false,
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: `${sldComLanguage('商品规格')}`,
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            addData: [{
                type: 'radio_select',
                label: `${sldComLanguage('结算方式')}`,
                name: 'billType',
                data: [{
                    key: 1,
                    value: `${sldComLanguage('按月结算')}`
                }, {
                    key: 2,
                    value: `${sldComLanguage('按周结算')}`
                }],
                initialValue: 1,
                isReset: true,
                callback: this.switchBillType
            }],//结算周期数据
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('店铺名称')}`,
                name: 'storeName',
                placeholder: `${sldComLanguage('请输入店铺名称')}`
            }, {
                type: 'input',
                label: `${sldComLanguage('店主账号')}`,
                name: 'vendorName',
                placeholder: `${sldComLanguage('请输入店主账号')}`
            }, {
                type: 'select',
                label: `${sldComLanguage('店铺等级')}`,
                name: 'storeGradeId',
                placeholder: `${sldComLanguage('请选择店铺等级')}`,
                sel_data: [],
                diy: true,
                sele_key: 'gradeId',
                sele_name: 'gradeName'
            }, {
                type: 'select',
                label: `${sldComLanguage('店铺状态')}`,
                name: 'state',
                placeholder: `${sldComLanguage('请选择店铺状态')}`,
                sel_data: [
                    { key: '', name: `${sldComLanguage('全部')}` },
                    { key: '1', name: `${sldComLanguage('开启')}` },
                    { key: '2', name: `${sldComLanguage('关闭')}` }
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
                    title: `${sldComLanguage('店主账号')}`,
                    dataIndex: 'vendorName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('联系电话')}`,
                    dataIndex: 'contactPhone',
                    align: 'center',
                    width: 100
                }, {
                    title: `${sldComLanguage('店铺等级')}`,
                    dataIndex: 'storeGradeName',
                    align: 'center',
                    width: 100
                }, 
                {
                    title: '店铺类型',
                    dataIndex: 'goodsSource',
                    align: 'center',
                    width: 100,
                    render:(text)=>storeType[text]
                },
                {
                    title: `${sldComLanguage('开店时间')}`,
                    dataIndex: 'createTime',
                    align: 'center',
                    width: 150
                }, {
                    title: `${sldComLanguage('有效期')}`,
                    dataIndex: 'storeExpireTime',
                    align: 'center',
                    width: 150
                }, {
                    title: `${sldComLanguage('店铺状态')}`,
                    width: 80,
                    align: 'center',
                    dataIndex: 'state',
                    render: (text) => <span>{text == 1 ? '开启' : '关闭'}</span>
                },
                {
                    title: `店铺标识符`,
                    dataIndex: 'identifier',
                    align: 'center',
                    width: 80
                },
                {
                    title: `${sldComLanguage('操作')}`,//操作
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            {sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => this.viewApplyDetail(record))}
                            <span className={global.splitLine} />
                            <AuthBtn eventKey={['edit_settle_store']} btnAuth={btnAuth}>
                                {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => this.edit(record))}
                                <span className={global.splitLine} />
                            </AuthBtn>
                            <AuthBtn eventKey={['set_bill_date']} btnAuth={btnAuth}>

                                {sldtbaleOpeBtnText(`${sldComLanguage('设置结算周期')}`, () => this.setBillCycle(record))}
                            </AuthBtn>
                            <AuthBtn eventKey={['delete_settle_store']} btnAuth={btnAuth}>

                                {record.state == 2 && <Fragment>
                                    <span className={global.splitLine} />
                                    {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operate(record.storeId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                        sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))//删除后不可恢复，是否确定删除？
                                    }
                                </Fragment>}
                            </AuthBtn>
                            <AuthBtn eventKey={['switch_settle_store']} btnAuth={btnAuth}>
                                {record.state == 1 &&
                                    <Fragment>
                                        <span className={global.splitLine} />
                                        {sldPopConfirmDiy('leftBottom', '店铺关闭为敏感操作，确定要关闭吗？', () => this.operate({ storeId: record.storeId, state: record.state == 2 ? 1 : 2 }, 'switch'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                            sldtbaleOpeBtnText(`关闭`, () => null))}
                                    </Fragment>
                                }
                                {record.state == 2 &&
                                    <Fragment>
                                        <span className={global.splitLine} />
                                        <span className={`${global.input_after_wrap} ${global.tableOperateText}`} onClick={() => { this.operate({ storeId: record.storeId, state: 1 }, 'switch') }}>开启</span>
                                    </Fragment>
                                }
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
        this.get_store_grade();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.updateFlag == '1') {
            this.get_list({ pageSize: pageSize });
        }
    }

    resize = () => {
        const { search_height } = this.state;
        if (this.refs.search_part != undefined) {
            if (this.refs.search_part.clientHeight != search_height) {
                this.setState({ search_height: this.refs.search_part.clientHeight });
            }
        }
    };

    edit = (val) => {
        router.push(`/manage_store/settle_store_list_to_edit?id=${val.storeId}&state=${val.state}`);
    };

    //查看入驻信息
    viewApplyDetail = (val) => {
        router.push(`/manage_store/settle_store_list_view?id=${val.storeId}`);
    };

    //设置结算周期
    setBillCycle = (val) => {
        let { addData } = this.state;
        //初始化结算周期数据
        let tar_bill_data = {};
        addData = addData.filter(item => (item.name != 'billDays'));
        addData.forEach(item => {
            item.initialValue = val[item.name] ? val[item.name] : 1;
        });
        if (val.billType == 1 || !val.billType) {
            tar_bill_data = this.month_data;
        } else {
            tar_bill_data = this.week_data;
        }
        tar_bill_data = JSON.parse(JSON.stringify(tar_bill_data));
        tar_bill_data.initialValue = val.billDay != null && val.billDay ? val.billDay.split(',') : '';
        addData.push(tar_bill_data);
        this.operate_id = val.storeId;
        this.operate_info = val;
        this.setState({ modalVisible: true, addData });
    };

    //获取数据列表
    get_list = (params) => {
        this.setState({ initLoading: true });
        const { dispatch } = this.props;
        dispatch({
            type: 'store/get_settled_store_list',
            payload: { ...params },
            callback: (res) => {
                this.setState({ initLoading: false });
                this.props.setUpdateFlag('');
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

    //获取店铺列表
    get_store_grade = () => {
        let { search_data } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'store/get_grade_lists',
            payload: { pageSize: list_com_page_more },
            callback: (res) => {
                if (res.state == 200) {
                    let tmp_data = search_data.filter(item => item.name == 'storeGradeId')[0];
                    tmp_data.sel_data = res.data.list;
                }
                this.setState({ search_data });
            }
        });
    };

    switchBillType = (e) => {
        let { addData } = this.state;
        addData = addData.filter(item => item.name != 'billDays');
        let tar_bill_data = {};
        if (e.target.value == 1) {
            //按月结算
            tar_bill_data = JSON.parse(JSON.stringify(this.month_data));
        } else if (e.target.value == 2) {
            //按周结算
            tar_bill_data = JSON.parse(JSON.stringify(this.week_data));
        }
        if (this.operate_info.storeId != undefined && this.operate_info.storeId && this.operate_info.billType == e.target.value) {
            tar_bill_data.initialValue = this.operate_info.billDay != null && this.operate_info.billDay ? this.operate_info.billDay.split(',') : '';
        }
        addData.push(tar_bill_data);
        this.setState({ addData });
    };

    //店铺操作  del：删除 stop：停用 start：启用 set_bill:设置结算周期
    operate = (id, type) => {
        this.setState({ submiting: true });
        const { params } = this.state;
        const { dispatch } = this.props;
        let dis_type = '';
        let param_data = {};
        if (type == 'del') {
            dis_type = 'store/del_own_store';
            param_data.storeId = id;
        } else if (type == 'switch') {
            dis_type = 'store/switch_own_store';
            param_data = id;
        } else if (type == 'set_bill') {
            dis_type = 'store/set_settled_store_bill';
            param_data = id;
        }
        dispatch({
            type: dis_type,
            payload: param_data,
            callback: (res) => {
                if (res.state == 200) {
                    sucTip(res.msg);
                    this.get_list(params);
                    this.operate_info = {};
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

    sldHandleCancle = () => {
        this.setState({ modalVisible: false });
    };

    sldHandleConfirm = (val) => {
        val.billDays = val.billDays.join(',');//结算日期字符串，以逗号隔开
        val.storeId = this.operate_id;
        this.operate(val, 'set_bill');
    };

    render() {
        const { selectedRows, search_data, columns, initLoading, data, submiting, modalVisible, addData, search_height } = this.state;
        return (
            <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
                <div className={global.tableListForm} ref="search_part">
                    <Search
                        search_data={search_data}
                        seaSubmit={(datas) => this.search(datas)}
                        seaReset={() => this.seaReset()}
                    />
                </div>
                <Spin spinning={initLoading}>
                    {/*标准表格-start*/}
                    <StandardTable
                        totalHeight={document.body.clientHeight - 160 - search_height}
                        bordered={false}
                        selectedRows={selectedRows}
                        data={data}
                        rowKey="storeId"
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
                {/*新增/编辑对话框-start*/}
                <SldModal
                    title={`${sldComLanguage('设置结算周期')}`}
                    submiting={submiting}
                    width={500}
                    modalVisible={modalVisible}
                    sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
                    sldHandleCancle={this.sldHandleCancle}
                    formItemLayoutModal={formItemLayoutModal}
                    content={addData}
                />
                {/*新增/编辑对话框-end*/}
            </div>

        );
    }
}
