import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Popover, Icon } from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import {
    sldIconBtn,
    failTip,
    sucTip,
    dateFormat,
    list_com_page_size_10,
    dragSldTableColumn,
    sldHandlePaginationData,
    formItemLayoutModal,
    sldComLanguage,
    sldPopConfirmDiy,
    sldLlineRtextAddGoodsAddMargin,
    getSldEmptyH,
    showMoreHelpTip,
    getAuthBtn,
    validatorSpecialString
} from '@/utils/utils';
import {
    sld_promotion_together_buy
} from '@/utils/util_data';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import Search from '@/components/Search/Search';
import ReviewModal from './components/reviewModal';
import AuthBtn from '@/components/AuthBtn';
import DotTag from '@/components/DotTag';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;

@connect(({ together_buy }) => ({
    together_buy
}))
@Form.create()
export default class TogetherBugList extends Component {


    constructor(props) {
        super(props);
        this.state = {
            search_height: 0,
            initLoading: false,
            submiting: false,
            listData: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            type: 'add',//'add'新增  'edit'编辑
            editActivityId: "",
            params: { pageSize: pageSize, pageIndex:1 },//搜索条件
            addData: [
                {
                    type: 'input',
                    label: `${sldComLanguage('活动名称')}`,
                    name: 'promotionName',
                    placeholder: `${sldComLanguage('请输入活动名称，最多20个字')}`,
                    initialValue: '',
                    maxLength: 20,
                    rules: [{
                        required: true,
                        whitespace: true,
                        message: `${sldComLanguage('请输入活动名称')}`
                    }, { validator: (rule, value, callback) => validatorSpecialString(rule, value, callback) }]
                },
                {
                    type: 'rangepicker',
                    label: `${sldComLanguage('活动日期')}`,
                    name: 'activity_time',
                    extra: `${sldComLanguage('活动日期最多不超过30天')}`,
                    placeholder: `${sldComLanguage('请选择活动日期')}`,
                    placeholder1: `${sldComLanguage('开始时间')}`,
                    placeholder2: `${sldComLanguage('结束时间')}`,
                    initialValue: '',
                    disabledDate: (currentDate) => currentDate && currentDate < moment().subtract(1, 'days'),
                    rules: [{
                        required: true,
                        message: `${sldComLanguage('请选择活动日期')}`
                    }, {
                        validator: (rule, value, callback) => {
                            if (value && value[1].diff(value[0], 'days') > 30) {
                                callback(`${sldComLanguage('活动日期最多不超过30天')}`);
                            }
                            callback();
                        }
                    }]
                },
                {
                    type: 'seckill_time_select',
                    label: `${sldComLanguage('活动场次')}`,
                    // extra: `${sldComLanguage('每场活动时间为本场次整点开始时间到下一场次开始时间，当日设置的最后一场结束时间为当日23:59:59')}`,
                    name: "stageList",
                    sel_data: [],
                    onChange: this.handleSelTime,
                    placeholder: ``
                },
                {
                    type: 'inputnum',
                    label: `${sldComLanguage('场次时长')}`,
                    name: 'duration',
                    extra: `${sldComLanguage('场次时长不跨日，最迟截止时间为当日23:59:59')}`,
                    // placeholder: `${sldComLanguage('请输入活动名称')}`,
                    initialValue: '1',
                    unitStr: "小时",
                    width: "100px",
                    max: 24,
                    min: 1,
                    rules: [{
                        required: true,
                        message: `${sldComLanguage('场次时长')}`
                    }, {
                        validator: (rule, value, callback) => {
                            if (!value) {
                                callback(`${sldComLanguage('请选择场次时长')}`);
                            }
                            callback();
                        }
                    }]
                }
            ],//modal框的数据
            formValues: {states: [0, 1, 2]},//搜索条件
            search_data: [
                {
                    type: 'input',
                    label: `${sldComLanguage('关键字')}`,
                    name: 'promotionName',
                    placeholder: `${sldComLanguage('请输入活动名称')}`
                },
                {
                    type: 'rangepicker',
                    label: `${sldComLanguage('活动日期')}`,
                    name: 'activityDate',
                    placeholder1: `${sldComLanguage('开始时间')}`,
                    placeholder2: `${sldComLanguage('结束时间')}`
                },
                {
                    type: 'select',
                    mode: "multiple",
                    width: 250,
                    initialValue: [0,1, 2],                    
                    label: `${sldComLanguage('活动状态')}`,
                    name: 'states',
                    placeholder: `${sldComLanguage('请选择活动状态')}`,
                    sel_data: [
                        { key: 1, name: `${sldComLanguage('未开始')}` },
                        { key: 2, name: `${sldComLanguage('进行中')}` },
                        { key: 3, name: `${sldComLanguage('已结束')}` },
                        { key: 0, name: `${sldComLanguage('待审核')}` },
                        { key: 4, name: `${sldComLanguage('审核拒绝')}` }
                    ]
                }
            ],
            columns: [
                {
                    title: `${sldComLanguage('活动名称')}`,
                    dataIndex: 'promotionName',
                    align: 'center',
                    width: 100,
                    render: (text) => <Popover
                        placement="topLeft"
                        content={<div style={{ display: "flex", alignItems: "center", background: "#fff" }}>
                            <div>{text}</div></div>}
                    >
                        <div style={{ display: 'inline-block', margin: '0 3px' }}>{this.showUIProps(text)}</div>
                    </Popover>
                },
                {
                    title: `${sldComLanguage('活动日期')}`,
                    dataIndex: 'startTime',
                    align: 'center',
                    width: 200,
                    render: (text, record) => `${moment(text).format(dateFormat)}~${moment(record.endTime).format(dateFormat)}`
                },
                {
                    title: `${sldComLanguage('活动场次')}`,
                    dataIndex: 'stageHourTimeList',
                    align: 'center',
                    width: 200,
                    render: (text) => <Popover
                        placement="topLeft"
                        content={<div style={{ display: "flex", alignItems: "center", background: "#fff" }}>
                            <div>{text.toString()}</div></div>}
                    >
                        <div style={{ display: 'inline-block', margin: '0 3px' }}>{this.showUIProps(text.toString())}</div>
                    </Popover>
                },
                {
                    title: `${sldComLanguage('场次时长')}`,
                    dataIndex: 'duration',
                    align: 'center',
                    width: 200,
                    render: (text, record) => `${text}小时`
                    // render: (text, record) => `${record.seckillName}`
                },
                {
                    title: `${sldComLanguage('活动状态')}`,
                    dataIndex: 'stateValue',
                    align: 'center',
                    width: 100,
                    render: (text, record) => { 
                        switch (record.state){
                        case 0: return <DotTag type="pending">{text} </DotTag>
                        case 1: return <DotTag type="normal">{text} </DotTag>
                        case 2: return <DotTag type='sucess'>{text}</DotTag>
                        case 3: return <DotTag type='normal'>{text}</DotTag>
                        case 4: return <DotTag type='failed'>{text}</DotTag>
                        default: return <DotTag type='normal'>{text}</DotTag>
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
                                pathname: '/marketing_promotion/together_buy_detail',
                                query: {
                                    id: record.promotionId
                                }
                            }}
                            >
                                {/* {sldtbaleOpeBtnText(`${sldComLanguage('详情')}`, () => null)} */}
                                <div style={{ display: 'inline-block', color: "#ff7e2b" }}>详情</div>
                            </Link>

                            <AuthBtn eventKey={["audit_together_buy"]} btnAuth={btnAuth}>
                                {record.state == 0 &&
                                    <Fragment>                                   
                                        {/*待审核，显示审核*/}
                                        <div style={{ display: 'inline-block', margin: '0 3px', color: "#ff7e2b", cursor: "pointer" }} onClick={() => this.showReview(record)}>审核</div>
                                    </Fragment>
                                }                            
                            </AuthBtn>                 
                            <AuthBtn eventKey={["edit_together_buy"]} btnAuth={btnAuth}>
                                {record.state == 1 &&
                                    <Fragment>
                                        {/* <span className={global.splitLine} /> */}
                                        {/*只有未开始且没有商家参加活动的可以进行编辑，未开始但有商家参加活动的显示编辑按钮，需要置灰，hover时提示原因。*/}
                                        {!record.editFlag ? <Popover
                                            placement="topLeft"
                                            content={<div style={{ display: "flex", alignItems: "center", background: "#fff" }}>
                                                <Icon type="info-circle" theme='filled' style={{ color: "#ff7e2b", marginRight: "3px" }} />
                                                <div>该活动已有商家参与，不支持编辑</div></div>}
                                        >
                                            <div style={{ display: 'inline-block', margin: '0 3px', color: "#bfbfbf" }}>编辑</div>
                                        </Popover>
                                            : <div style={{ display: 'inline-block', margin: '0 3px', color: "#ff7e2b", cursor: "pointer" }} onClick={() => this.editActivity(record)}>编辑</div>}
                                    </Fragment>
                                }
                                {record.state == 4 &&
                                    <Fragment>
                                        <div style={{ display: 'inline-block', margin: '0 3px', color: "#ff7e2b", cursor: "pointer" }} onClick={() => this.editActivity(record)}>编辑</div>
                                    </Fragment>
                                }
                            </AuthBtn>         
                            <AuthBtn eventKey={["end_together_buy"]} btnAuth={btnAuth}>
                                {(record.state==1||record.state==2) && 
                                    <Fragment>
                                        {/* <span className={global.splitLine} /> */}
                                        {/*结束后不可恢复，是否确定结束？*/}
                                        {sldPopConfirmDiy('leftBottom', `${sldComLanguage('结束后不可恢复，是否确定结束')}`, () => this.operate(record.promotionId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                            <div style={{ display: 'inline-block', margin: '0 3px', color: "#ff7e2b", cursor: "pointer" }}>结束</div>)}
                                    </Fragment>
                                }                                    
                            </AuthBtn>         
                            <AuthBtn eventKey={["delete_together_buy"]} btnAuth={btnAuth}>
                                {(record.state==3) && 
                                    <Fragment>
                                        {/* <span className={global.splitLine} /> */}
                                        {/*结束后不可恢复，是否确定结束？*/}
                                        {sldPopConfirmDiy('leftBottom',`${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operate(record.promotionId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                            <div style={{ display: 'inline-block', margin: '0 3px', color: "#ff7e2b", cursor: "pointer" }}>删除</div>)}
                                    </Fragment>
                                }                            
                            </AuthBtn>  
                        </Fragment>
                    )
                }
            ],
            reviewModalVisible:false,
            record:{}            
        };
    }

    componentDidMount() {
        //初始化取值，需要state [0,1, 2]
        this.get_list({ pageSize: pageSize, pageIndex:1, ...this.state.formValues });
        this.resize();
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    //最多展示10个字，超出…
    showUIProps = (value) => value && value.length > 10 ? `${value.substring(0, 10)}...` : value

    //添加活动
    addActivity = () => {
        let { addData } = this.state;
        //新建活动，要清理初始值
        for (let i = 0; i < addData.length; i++) {
            if (addData[i].name == 'stageList') {
                addData[i].sel_data = [];
            } else if (addData[i].name == 'duration') {
                addData[i].initialValue = "1";
            } else {
                addData[i].initialValue = "";
            }
        }
        this.setState({
            modalVisible: true,
            type: 'add',
            title: `${sldComLanguage('新建活动')}`,
            addData: addData
        });//添加活动
    };

    //编辑活动
    editActivity = (activity) => {
        let { addData } = this.state;
        for (let i = 0; i < addData.length; i++) {
            if (addData[i].name == 'activity_time') {//活动日期组件
                addData[i].initialValue = [moment(activity.startTime), moment(activity.endTime)]
            } else if (addData[i].name == 'stageList') {//活动场次记录
                addData[i].sel_data = activity['stageHourTimeList']
            } else {
                addData[i].initialValue = activity[addData[i].name];
            }
        }
        this.setState({
            type: 'edit',
            editActivityId: activity.promotionId,
            title: `${sldComLanguage('编辑活动')}`,
            addData: addData,
            modalVisible: true
        });//编辑活动
    };

    vefryActivity= (activity) => {
        let { addData } = this.state;
        //给活动赋值
        for (let i = 0; i < addData.length; i++) {
            if (addData[i].name == 'activity_time') {//活动日期组件
                addData[i].initialValue = [moment(activity.startTime), moment(activity.endTime)]
            } else if (addData[i].name == 'stageList') {//活动场次记录
                addData[i].sel_data = activity['stageHourTimeList']
            } else {
                addData[i].initialValue = activity[addData[i].name];
            }
            //设置活动只读
            addData[i].disable = true
        }
        this.setState({
            type: 'vefry',
            editActivityId: activity.promotionId,
            title: `${sldComLanguage('审核活动')}`,
            addData: addData,
            //设置弹框的底部按钮字串
            show_foot:{cancelStr:'审核拒绝',confirmStr:'审核确定'},
            modalVisible: true
        });//编辑活动
    };


    handleSelTime = (val) => {
        let { addData } = this.state;
        let tmp_data = addData.filter(item => item.name === 'stageList')[0];
        if (tmp_data.sel_data.indexOf(val) > -1) {
            tmp_data.sel_data = tmp_data.sel_data.filter(item => item != val);
        } else {
            tmp_data.sel_data.push(val);
        }
        this.setState({ addData });
    };

    //活动操作  del：结束 edit: 编辑
    operate = (id, type) => {
        this.setState({ submiting: true });
        const { params,formValues } = this.state;
        const { dispatch } = this.props;
        let dis_type = '';
        let param_data = {};
        if (type == 'del') {
            dis_type = 'together_buy/del_activity';
            param_data = { promotionId: id };
        } else if (type == 'swiper') {
            dis_type = 'together_buy/set_activity_swiper';
            param_data = id;
        }
        dispatch({
            type: dis_type,
            payload: param_data,
            callback: (res) => {
                if (res.state == 200) {
                    sucTip(res.msg);
                    this.setState({
                        modalVisible: false
                    });
                    this.get_list({...params, ...formValues});
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
            type: 'together_buy/get_activity_lists',
            payload: params,
            callback: (res) => {
                this.setState({ initLoading: false });
                if (res.state == 200) {
                    this.setState({
                        listData: res.data
                    });
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

    //新增弹框取消
    sldHandleCancle = () => {
        this.setState({ modalVisible: false });
    };

    //新增弹框确认
    sldHandleConfirm = (val) => {
        let { addData, type, editActivityId, formValues} = this.state;
        //时间处理
        if (val.activity_time) {
            val.startTime = val.activity_time[0] ? `${val.activity_time[0].format(dateFormat)} 00:00:00` : '';
            val.endTime = val.activity_time[1] ? `${val.activity_time[1].format(dateFormat)} 23:59:59` : '';

            delete val.activity_time;
        }
        //活动场次的处理
        let stageList = addData.filter(item => item.name == 'stageList')[0];
        if (stageList.sel_data.length == 0) {
            failTip(`${sldComLanguage('请选择活动场次')}`);
            return false;
        }
        val.stageList = stageList.sel_data;

        const { dispatch } = this.props;
        this.setState({ submiting: true });
        if (type == 'add') {
            dispatch({
                type: 'together_buy/add_activity',
                payload: val,
                callback: (res) => {
                    if (res.state == 200) {
                        sucTip(res.msg);
                        this.get_list({ pageSize: pageSize, pageIndex:1 , ...formValues});
                        this.setState({
                            modalVisible: false
                        });
                    } else {
                        failTip(res.msg);
                    }
                    this.setState({ submiting: false });
                }
            });
        } else if (type == 'edit') {
            val.promotionId = editActivityId
            dispatch({
                type: 'together_buy/update_activity_swiper',
                payload: val,
                callback: (res) => {
                    if (res.state == 200) {
                        sucTip(res.msg);
                        this.get_list({ pageSize: pageSize, pageIndex:1, ...formValues });
                        this.setState({
                            modalVisible: false
                        });
                    } else {
                        failTip(res.msg);
                    }
                    this.setState({ submiting: false });
                }
            });
        }

    };

    //搜索事件
    searchClick = (data) => {
        const values = { ...data };
        //时间处理
        if (values.activityDate) {
            values.startTime = values.activityDate[0] ? `${values.activityDate[0].format(dateFormat)} 00:00:00` : '';
            values.endTime = values.activityDate[1] ? `${values.activityDate[1].format(dateFormat)} 23:59:59` : '';

            delete values.activityDate;
        }
        for (let i in values) {
            if (values[i] == '') {
                delete values[i];
            }
        }
        this.setState({
            formValues: values,
            params: { pageSize: pageSize, pageIndex:1 }
        });
        this.get_list({ pageSize: pageSize, ...values, pageIndex:1 });
    };

    //搜索重置事件
    seaReset = () => {
        //搜索条件置为空
        this.setState({
            formValues: {states: [0,1, 2]},
            params: { pageSize: pageSize, pageIndex:1 }
        });
        this.get_list({ pageSize: pageSize, pageIndex:1,states: [0,1, 2] });
    };

    showReview = (record)=>{
        this.setState({
            record,
            reviewModalVisible:true
        })
    }
  
    successEvent = ()=>{
        this.auditPromotion({state:1})
    }
  
    refuseEvent = (rejectReason)=>{
        if(!rejectReason){
            failTip("请输入拒绝原因");
            return
        }        
        this.auditPromotion({state:4,rejectReason})
    }
  
    reviewModalCancle = ()=>{
        this.setState({
            reviewModalVisible:false
        })
    }
  
    auditPromotion = (param)=>{
        const { record } = this.state
        const { dispatch } = this.props;
        param.promotionId = record.promotionId
        dispatch({
            type: 'together_buy/auditPromotion',
            payload: param,
            callback: (res) => {
                if (res.state == 200) {
                    sucTip(res.msg);
                    this.get_list({ pageSize: pageSize, pageIndex:1, ...this.state.formValues });
                    this.setState({
                        reviewModalVisible: false
                    });
                } else {
                    failTip(res.msg);
                }
            }
        });
    }

    resize = () => {
        const { search_height } = this.state;
        if (this.refs.search_part != undefined) {
            if (this.refs.search_part.clientHeight != search_height) {
                this.setState({ search_height: this.refs.search_part.clientHeight });
            }
        }
    };    

    render() {
        const { selectedRows, columns, initLoading, listData, submiting, addData, modalVisible, title, search_data, reviewModalVisible, record, search_height } = this.state;
        return (
            <AuthBtn eventKey={['view_together_buy']} btnAuth={btnAuth} showPage>
                <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
                    {/*顶部标题*/}
                    {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('一起买活动')}`, 0)}
                    {getSldEmptyH(8)}
                    {/*顶部提示语*/}
                    {getSldEmptyH(10)}
                    {showMoreHelpTip("", sld_promotion_together_buy(), 0, true, true)}
                    {getSldEmptyH(10)}
                    {/*搜索操作区*/}
                    <div className={global.tableListForm} ref="search_part">
                        <Search
                            search_data={search_data}
                            seaSubmit={(datas) => this.searchClick(datas)}
                            seaReset={() => this.seaReset()}
                        />
                    </div>
                    <AuthBtn eventKey={["add_together_buy"]} btnAuth={btnAuth}>
                        <div className={global.operate_bg}>
                            {sldIconBtn(() => this.addActivity(), `${sldComLanguage('新建活动')}`, 7, 7)}
                        </div>
                    </AuthBtn>
                    <Spin spinning={initLoading}>
                        {/*标准表格-start*/}
                        <StandardTable
                            bordered={false}
                            totalHeight={document.body.clientHeight - 300 - search_height - 20}
                            selectedRows={selectedRows}
                            data={listData}
                            rowKey="promotionId"
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
                        title={title}
                        submiting={submiting}
                        width={860}
                        modalVisible={modalVisible}
                        sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
                        sldHandleCancle={this.sldHandleCancle}
                        formItemLayoutModal={formItemLayoutModal}
                        content={addData}
                        confirmText='提交审核'
                    />
                    {/*审核 对话框-start*/}
                    <ReviewModal
                        modalVisible={reviewModalVisible}
                        record={record}
                        refuseEvent={this.refuseEvent}
                        successEvent={this.successEvent}
                        cancle={this.reviewModalCancle}
                    />                
                </div>
            </AuthBtn>
               
        );
    }
}
