import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Popover, Icon, message } from 'antd';
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
    getAuthBtn,
    validatorSpecialString
} from '@/utils/utils';
import { apiUrl } from '@/utils/sldconfig';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';
import Search from '@/components/Search/Search';
import AuthBtn from '@/components/AuthBtn';
import ReviewModal from './components/reviewModal';
import DotTag from '@/components/DotTag';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
let curtime = moment();
// let pageSize = 2;
//状态(1-未开始,2-进行中,3-已结束)
let stateTxtValue = { 1: "未开始", 2: "进行中", 3: "已结束", 0: "待审核", 4: "审核拒绝" }

@connect(({ everyday_buy }) => ({
    everyday_buy
}))
@Form.create()
export default class TogetherBugList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initLoading: false,
            submiting: false,
            show_preview_modal: false,//预览图片modal框是否展示
            preview_img: '',//预览图片
            preview_alt_con: '',//预览图片内容
            listData: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            type: 'add',//'add'新增  'edit'编辑
            editActivityId: "",
            params: { pageSize: pageSize, pageIndex: 1 },//搜索条件
            addData: [
                {
                    type: 'input',
                    label: `${sldComLanguage('专场名称')}`,
                    name: 'promotionName',
                    placeholder: `${sldComLanguage('请输入专场名称，最多15个字')}`,
                    initialValue: '',
                    maxLength: 15,
                    rules: [{
                        required: true,
                        whitespace: true,
                        message: `${sldComLanguage('请输入专场名称')}`
                    }, { validator: (rule, value, callback) => validatorSpecialString(rule, value, callback) }]
                },
                {
                    type: 'datepicker',
                    label: `${sldComLanguage('专场日期')}`,
                    name: 'promotionTime',
                    bodyContainer: 1,
                    disabledDate: (currentDate) => currentDate && currentDate < moment().startOf('day'),
                    placeholder: `${sldComLanguage('请选择专场日期')}`,
                    initialValue: '',
                    rules: [{
                        required: true,
                        message: `${sldComLanguage('请选择专场日期')}`
                    }, {
                        validator: (rule, value, callback) => {
                            // if (value && value[1].diff(value[0], 'days') > 30) {
                            //     callback(`${sldComLanguage('专场日期最多不超过30天')}`);
                            // }
                            callback();
                        }
                    }]
                },
                {
                    type: 'timepicker2',
                    label: '活动开始时间',
                    extra: `${sldComLanguage('结束时间：23:59:59')}`,
                    name: 'promotionStartTime',
                    placeholder: '开始时间',
                    initialValue: moment('00:00:00', 'HH:mm:ss'),
                    format:'HH:mm:ss',
                    rules: [{
                        required: true,
                        message: `${sldComLanguage('请选择活动开始时间')}`
                    }]
                },
                {
                    type: 'upload_img_upload',
                    label: `${sldComLanguage('title图片')}`,
                    name: 'titleUrl',
                    placeholder: `${sldComLanguage('请上传banner图片')}`,
                    extra: `${sldComLanguage('建议图片高度48像素,支持格式gif，jpg，png')}`,
                    fileList: [],
                    img_info: {},
                    upload_name: 'file',
                    required: true,
                    upload_url: `${apiUrl}v3/oss/common/upload?source=setting`,
                    uploadPreview: this.uploadImgPre,
                    beforeUpload: this.beforeUpload,
                    uploadChange: (info) => this.uploadImg(info, 'titleUrl'),
                    initialValue: ''
                },
                {
                    type: 'upload_img_upload',
                    label: `${sldComLanguage('banner图片')}`,
                    name: 'bannerUrl',
                    placeholder: `${sldComLanguage('请上传banner图片')}`,
                    extra: `${sldComLanguage('建议宽度为345像素，高度130像素,支持格式gif，jpg，png')}`,
                    fileList: [],
                    img_info: {},
                    upload_name: 'file',
                    required: true,
                    upload_url: `${apiUrl}v3/oss/common/upload?source=setting`,
                    uploadPreview: this.uploadImgPre,
                    beforeUpload: this.beforeUpload,
                    uploadChange: (info) => this.uploadImg(info, 'bannerUrl'),
                    initialValue: ''
                },
                {
                    type: 'radio_check',
                    label: `${sldComLanguage('是否展示banner')}`,
                    name: 'isShowBanner',
                    placeholder: `${sldComLanguage('请选择')}`,
                    sldOptions: [
                        {
                            label:'显示',
                            value:'1'
                        },
                        {
                            label:'不显示',
                            value:'0'
                        }
                    ],
                    initialValue:'1',
                    rules: [{
                        required: true,
                        message: `${sldComLanguage('请选择')}`
                    }]
                }
            ],//modal框的数据
            formValues: { states: [0,1, 2] },//搜索条件
            search_data: [
                {
                    type: 'input',
                    label: `${sldComLanguage('关键字')}`,
                    name: 'keyword',
                    placeholder: `${sldComLanguage('请输入专场名称')}`
                },
                {
                    type: 'rangepicker',
                    label: `${sldComLanguage('专场日期')}`,
                    name: 'activityDate',
                    placeholder1: `${sldComLanguage('开始时间')}`,
                    placeholder2: `${sldComLanguage('结束时间')}`
                },
                {
                    type: 'select',
                    mode: "multiple",
                    width: 250,
                    initialValue: ['0',1, 2],
                    label: `${sldComLanguage('专场状态')}`,
                    name: 'states',
                    placeholder: `${sldComLanguage('请选择专场状态')}`,
                    sel_data: [] //根据用户权限动态赋值
                }
            ],
            //管理权限可以查看的数据状态
            view_auth_states:[
                { key: 1, name: `${sldComLanguage('未开始')}` },
                { key: 2, name: `${sldComLanguage('进行中')}` },
                { key: 3, name: `${sldComLanguage('已结束')}` },
                { key: '0', name: `${sldComLanguage('待审核')}` },
                { key: 4, name: `${sldComLanguage('审核拒绝')}` }
            ],
            //审核权限可以查看的数据状态
            // audit_auth_states:[
            //     { key: '0', name: `${sldComLanguage('待审核')}` },
            //     { key: 4, name: `${sldComLanguage('审核拒绝')}` }
            // ],            
            columns: [
                {
                    title: `${sldComLanguage('专场名称')}`,
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
                    title: `${sldComLanguage('专场日期')}`,
                    dataIndex: 'promotionTime',
                    align: 'center',
                    width: 200
                },
                {
                    title: `${sldComLanguage('专场状态')}`,
                    dataIndex: 'state',
                    align: 'center',
                    width: 100,
                    render: (text) => { 
                        switch (text){
                        case 0: return <DotTag type="pending">{stateTxtValue[text]} </DotTag>
                        case 1: return <DotTag type="normal">{stateTxtValue[text]} </DotTag>
                        case 2: return <DotTag type='sucess'>{stateTxtValue[text]}</DotTag>
                        case 3: return <DotTag type='normal'>{stateTxtValue[text]}</DotTag>
                        case 4: return <DotTag type='failed'>{stateTxtValue[text]}</DotTag>
                        default: return <DotTag type='normal'>{stateTxtValue[text]}</DotTag>
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
                                pathname: '/marketing_promotion/buy_everyday_detail',
                                query: {
                                    id: record.promotionId
                                }
                            }}
                            >
                                <div style={{ display: 'inline-block', color: "#ff7e2b" }}>详情</div>
                            </Link>
                            <AuthBtn eventKey={["edit_buy_everyday"]} btnAuth={btnAuth}>
                                {(record.state == 4) &&
                                    <Fragment>
                                        {/* <span className={global.splitLine} /> */}                                  
                                        {<div style={{ display: 'inline-block', margin: '0 3px', color: "#ff7e2b", cursor: "pointer" }} onClick={() => this.editActivity(record)}>编辑</div>}
                                    </Fragment>
                                }
                            </AuthBtn>
                            <AuthBtn eventKey={["end_buy_everyday"]} btnAuth={btnAuth}>
                                {(record.state == 1 || record.state == 2) &&
                                    <Fragment>
                                        {/* <span className={global.splitLine} /> */}
                                        {/*结束后不可恢复，是否确定结束？*/}
                                        {sldPopConfirmDiy('leftBottom', `${sldComLanguage('结束后不可恢复，是否确定结束')}`, () => this.operate(record.promotionId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                            <div style={{ display: 'inline-block', margin: '0 3px', color: "#ff7e2b", cursor: "pointer" }}>结束</div>)}
                                    </Fragment>
                                }
                            </AuthBtn>
                            
                            <AuthBtn eventKey={["audit_buy_everyday"]} btnAuth={btnAuth}>
                                {record.state == 0 &&
                                    <Fragment>                                   
                                        {/*待审核，显示审核*/}
                                        <div style={{ display: 'inline-block', margin: '0 3px', color: "#ff7e2b", cursor: "pointer" }} onClick={() => this.showReview(record)}>审核</div>
                                    </Fragment>
                                }                            
                            </AuthBtn>                         
                            <AuthBtn eventKey={["delete_buy_everyday"]} btnAuth={btnAuth}>
                                {/**已结束和审核拒绝都可以删除 */
                                    (record.state == 3 || record.state == 4) &&
                                    <Fragment>
                                        {sldPopConfirmDiy('leftBottom', `${sldComLanguage('是否确定删除')}`, () => this.operate(record.promotionId, 'delete'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                            <div style={{ display: 'inline-block', margin: '0 3px', color: "#ff7e2b", cursor: "pointer" }}>删除</div>)}
                                    </Fragment>
                                }
                            </AuthBtn>
                        </Fragment>
                    )
                }
            ],
            reviewModalVisible:false,
            record:{},
            dateTab_height: 0//可以变化的日期标签区域的高度
        };
    }

    componentDidMount() {
        this.judgeUserAuth()
        //初始化取值，需要state [0,1, 2]
        this.get_list({ ...this.state.params, ...this.state.formValues });
    }

    //根据登录用户的权限，动态判断要获取的数据
    judgeUserAuth = ()=>{
        let { search_data, view_auth_states } = this.state;
        search_data[2].sel_data = search_data[2].sel_data.concat(view_auth_states)

        // if(btnAuth.includes('view')) {
        //     search_data[2].sel_data = search_data[2].sel_data.concat(view_auth_states)
        //     return 
        // }
        // if(btnAuth.includes('audit')) {
        //     search_data[2].sel_data = search_data[2].sel_data.concat(audit_auth_states)            
        // }        
    }
    
    beforeUpload = (file) => {
        const isJpgOrPngOrGifOrGif = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        if (!isJpgOrPngOrGifOrGif) {
            message.error('文件格式错误！');
        }
        const isLt2M = file.size / 1024 / 1024 < 20;
        if (!isLt2M) {
            message.error('图片不能超过20M');
        }
        return isJpgOrPngOrGifOrGif && isLt2M;
    }

    //上传图片
    uploadImg = (info, type) => {
        let { addData } = this.state;
        console.log(122,info)
        if (info.file.status != undefined && info.file.status != 'error') {
            for (let i = 0; i < addData.length; i++) {
                if (addData[i].name == type) {
                    addData[i].fileList = info.fileList;
                    addData[i].img_info = (info.file.response != undefined && info.fileList.length > 0 && info.file.response.data != undefined) ? info.file.response.data : [];
                }
            }
            this.setState({ addData });
        }
    };

    //预览图片
    uploadImgPre = (info) => {
        //手动上传的图片，地址是info.response.data.url 编辑预制的图片，地址是 info.url
        this.viewImg(true, info.url || info.response.data.url);
    };

    //预览图片/关闭预览图片
    viewImg = (flag, img = '', text = '') => {
        this.setState({
            preview_img: img,
            preview_alt_con: text,
            show_preview_modal: flag
        });
    };

    //最多展示10个字，超出…
    showUIProps = (value) => value && value.length > 10 ? `${value.substring(0, 10)}...` : value

    //添加专场
    addActivity = () => {
        let { addData } = this.state;
        //新建专场，要清理初始值
        for (let i = 0; i < addData.length; i++) {
            if (addData[i].name == 'bannerUrl'||addData[i].name == 'titleUrl') {//专场图片
                addData[i].fileList = [];
                addData[i].img_info = {}
            } else if (addData[i].name == 'promotionTime') {//专场日期
                addData[i].initialValue = "";
                addData[i].disabled = false

            }else if (addData[i].name == 'promotionStartTime') {//专场开始时间
                addData[i].initialValue = moment().add(1,'hours');
                addData[i].disabled = false

            } if (addData[i].name == 'promotionName') {//专场名字 
                addData[i].initialValue = "";
            }
            if(addData[i].name == 'isShowBanner'){
                addData[i].initialValue = "1";
            }
        }
        this.setState({
            modalVisible: true,
            type: 'add',
            title: `${sldComLanguage('新建专场')}`,
            addData: addData
        });//添加专场
    };

    //编辑专场
    editActivity = (activity) => {
        let { addData } = this.state;
        for (let i = 0; i < addData.length; i++) {
            if (addData[i].name == 'bannerUrl') {//专场图片
                addData[i].fileList = [
                    {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: activity.bannerUrl
                    }
                ];
                addData[i].img_info = {
                    height: 789,
                    path: activity.bannerUrl,
                    url: activity.bannerUrl,
                    width: 1261
                }
            } else if (addData[i].name == 'promotionTime') {//专场日期
                addData[i].initialValue = moment(activity[addData[i].name]);
                addData[i].disabled = true
            }else if (addData[i].name == 'promotionStartTime') {//专场活动开始时间
                addData[i].initialValue = moment(activity[addData[i].name]);
                addData[i].disabled = true
            }
            else if (addData[i].name == 'promotionName') {//专场名字
                addData[i].initialValue = activity[addData[i].name];
            }
            else if(addData[i].name == 'titleUrl'){
                addData[i].fileList = [
                    {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: activity.titleUrl
                    }
                ];
                addData[i].img_info = {
                    height: 789,
                    path: activity.titleUrl,
                    url: activity.titleUrl,
                    width: 1261
                }
            }
            else if(addData[i].name == 'isShowBanner'){
                addData[i].initialValue = String(activity[addData[i].name]);
            }
        }
        this.setState({
            type: 'edit',
            editActivityId: activity.promotionId,
            title: `${sldComLanguage('编辑专场')}`,
            addData: addData,
            modalVisible: true
        });//编辑专场
    };

    //专场操作  del：结束 edit: 编辑
    operate = (id, type) => {
        this.setState({ submiting: true });
        const { params, formValues } = this.state;
        const { dispatch } = this.props;
        let dis_type = '';
        let param_data = {};
        if (type == 'del') {
            dis_type = 'everyday_buy/del_activity';
            param_data = { promotionId: id };
        }else if(type == 'delete'){
            dis_type = 'everyday_buy/delete_buyEveryday';
            param_data = { promotionId: id };
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
                    this.get_list({ ...params, ...formValues });
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
            type: 'everyday_buy/get_activity_lists',
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
            // this.setState({ params });
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
        let { addData, type, editActivityId, formValues, params } = this.state;
        //手动赋值图片地址
        console.log(123,addData)
        for (let i = 0; i < addData.length; i++) {
            if (addData[i].name == 'bannerUrl') {
                if (addData[i].img_info.path == undefined) {
                    failTip(`${sldComLanguage('请上传')}${sldComLanguage('banner图片')}`);
                    return false;
                }
                val.bannerUrl = addData[i].img_info.url;
            }
            if (addData[i].name == 'titleUrl') {
                if (addData[i].img_info.path == undefined) {
                    failTip(`${sldComLanguage('请上传')}${sldComLanguage('title图片')}`);
                    return false;
                }
                val.titleUrl = addData[i].img_info.url;
            }
        }
        //处理时间格式
        if (val.promotionTime) {
            val.promotionTime = moment(val.promotionTime).format(dateFormat)
        }
        if (val.promotionStartTime) {
            let promotionStartTime = moment(val.promotionStartTime).format('HH:mm:ss')
            if (type == 'add' && moment(`${val.promotionTime} ${promotionStartTime}`).diff(curtime, 'minutes')<60) {
                failTip(`开始时间距离当前时间应大于一个小时`);
                return false;
            }
            val.promotionStartTime = promotionStartTime
        }
        const { dispatch } = this.props;
        this.setState({ submiting: true });
        if (type == 'add') {
            dispatch({
                type: 'everyday_buy/add_activity',
                payload: val,
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
        } else if (type == 'edit') {
            val.promotionId = editActivityId
            dispatch({
                type: 'everyday_buy/update_activity',
                payload: val,
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
        }

    };

    //搜索事件
    searchClick = (data) => {
        const { params } = this.state
        const values = { ...data };
        //时间处理
        if (values.activityDate) {
            values.startTimeStr = values.activityDate[0] ? `${values.activityDate[0].format(dateFormat)}` : '';
            values.endTimeStr = values.activityDate[1] ? `${values.activityDate[1].format(dateFormat)}` : '';

            delete values.activityDate;
        }
        for (let i in values) {
            if (values[i] == '') {
                delete values[i];
            }
        }
        this.setState({
            formValues: values
        });
        //搜索事件，重新计算列表区域高度
        this.dateTabsHeight()
        this.get_list({ ...params, ...values });
    };

    //搜索重置事件
    seaReset = () => {
        const { params } = this.state
        //搜索条件置为空
        this.setState({
            formValues: { states: [0,1, 2] }
        });
        //搜索事件，重新计算列表区域高度
        this.dateTabsHeight()
        this.get_list({ ...params, states: [0,1, 2] });
    };

    //更新日期标签区域的高度
    dateTabsHeight = () => {
        const { dateTab_height } = this.state;
        if (this.refs.search_part != undefined) {
            if (this.refs.search_part.clientHeight != dateTab_height) {
                this.setState({ dateTab_height: this.refs.search_part.clientHeight });
            }
        }
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
        const { record,params,formValues } = this.state
        const { dispatch } = this.props;
        param.promotionId = record.promotionId
        dispatch({
            type: 'everyday_buy/auditPromotion',
            payload: param,
            callback: (res) => {
                if (res.state == 200) {
                    sucTip(res.msg);
                    this.get_list({ ...params, ...formValues });
                    this.setState({
                        reviewModalVisible: false
                    });
                } else {
                    failTip(res.msg);
                }
            }
        });
    }   

    render() {
        const { selectedRows, columns, initLoading, listData, submiting, addData,
            modalVisible, title, search_data, preview_img, preview_alt_con,
            show_preview_modal, dateTab_height,reviewModalVisible,record } = this.state;
        return (
            <AuthBtn eventKey={['view_buy_everyday']} btnAuth={btnAuth} showPage>
                <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
                    {/*顶部标题*/}
                    {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('天天专场')}`, 0)}
                    {getSldEmptyH(8)}
                    {/*搜索操作区*/}
                    <div className={global.tableListForm} ref="search_part">
                        <Search
                            search_data={search_data}
                            seaSubmit={(datas) => this.searchClick(datas)}
                            seaReset={() => this.seaReset()}
                        />
                    </div>
                    <AuthBtn eventKey={["add_buy_everyday"]} btnAuth={btnAuth}>
                        <div className={global.operate_bg}>
                            {sldIconBtn(() => this.addActivity(), `${sldComLanguage('新建专场')}`, 7, 7)}
                        </div>
                    </AuthBtn>
                    <Spin spinning={initLoading}>
                        {/*标准表格-start*/}
                        <StandardTable
                            bordered={false}
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
                        totalHeight={document.body.clientHeight - 250 - dateTab_height}
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
                    {/*图片预览-start*/}
                    <SldPreviewImg
                        img={preview_img}
                        show_preview_modal={show_preview_modal}
                        modal_width={300}
                        preview_alt_con={preview_alt_con}
                        closePreviewModal={() => this.viewImg(false)}
                    />
                    {/*图片预览-end*/}
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
