import { connect } from 'dva/index';
import React, { Component,Fragment } from 'react';
import moment from 'moment';
import { Form, Select, Input, Spin, Upload, Icon, DatePicker, Button,Radio } from 'antd';
import XLSX from 'xlsx';
import { Scrollbars } from 'react-custom-scrollbars';
import {
    sldLlineRtextAddGoods,
    failTip,
    sucTip,
    getSldEmptyH,
    sldComLanguage,
    sldBeforeUpload,
    getLocalStorageStingVal,
    downLoad_front,
    getStorage,
    downlad
} from '@/utils/utils';
import { apiUrl } from '@/utils/sldconfig.js';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import _style from '../css/advert.less';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';

const FormItem = Form.Item;
const Option = Select.Option;
let sthis = '';
// eslint-disable-next-line no-shadow
@connect(({ product, global }) => ({
    product, global
}))
@Form.create()
export default class Add_article extends Component {

    constructor(props) {
        super(props);
        sthis = this;
        this.state = {
            bisEdit: !!props.location.query.id ? true : false,//'add'新增  'edit'编辑
            detail: {
                channelId: '',
                channelName: '',
                pushTimeData:moment().endOf('minute'),//推送时间
                title: '',//标题
                linkUrl:'',
                pushCompanyList:[]//推送企业
            }, 
            // eslint-disable-next-line no-template-curly-in-string
            htmlTemplate:'<!DOCTYPE html><html pageHeight=1192><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible"content="IE=edge,chrome=1"><meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"><meta name="format-detection"content="telephone=yes"><title></title><style>html{font-size:13.33333vw;user-select:none;margin:0px;padding:0px;overflow:hidden;}@media screen and(min-width:450px){html{font-size:50px;}}a{-webkit-tap-highlight-color:rgba(255,255,255,0);-webkit-user-select:none;-moz-user-focus:none;-moz-user-select:none;}body{margin:0px;padding:0px;font-family:"PingFang SC","Hiragino Sans GB","Microsoft Yahei","宋体",Tahoma,Arial,Helvetica,STHeiti,sans-serif;font-size:0.28rem;-webkit-font-smoothing:antialiased;-webkit-overflow-scrolling:touch;overflow-x:hidden;color:#333;}.no_wrap{overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-all;line-height:125%;} .adNews{font-size:0.34rem;position:relative;display:inherit;} .adNews .adimg{object-fit:cover;margin-top:0.15rem;width:100%;border-radius:0.08rem;overflow:hidden;} .adNews .adimg img{object-fit:cover;width:100%;border-radius:0.08rem;}</style></head><body><div class="wrap"><a class="adNews"itemheight="300"target="_blank"href="${linkUrl}"><div class="adimg"style="display: block; margin-top: 0rem;"><img src="${imageUrl}"style=""></div></a></div></body></html>',//推送模板
            initPushTimeData:moment().endOf('minute').format('YYYY-MM-DD HH:mm:ss'),//初始推送时间
            query: props.location.query,//query数据
            showLoading: true,
            optional: [],//未开通渠道数据
            available: [],//支付方式列表
            preview_img: '',
            preview_alt_con: '',
            show_preview_modal: false,
            uploadImgInfo: {//上传图片数据
                logoImgFileList: []
            },
            companyInfos:[],//企业数据
            appNoticeList:[],//推送消息模板配置
            tplCode:'after_sale_reminder',//推送模板加密配置使用售后的
            pushObjectEnum:'COMPANY', // COMPANY 按企业推送  USER 按用户推送
            pushUserEnum:'USER_ALL', // USER_ALL 所有用户  USER_LIST 指定用户
            pushUserCompanyEnum:'NOW_COMPANY', // NOW_COMPANY 当前企业  ALL_COMPANY 所有企业
            pushUserList:[],
            upInfo:{
                attachmentName:'',
                attachmentUrl:''
            } // 上传的用户信息
        };
    }

    componentDidMount() {
        this.getDetail();
        this.get_list();
        this.getChannelList();
        this.props.dispatch({
            type: 'global/getLayoutCollapsed'
        });
    }

    //获取消息模板配置有关渠道富文本是否base64加密的数据
    get_list = () => {
        this.setState({ initLoading: true });
        const { dispatch } = this.props;
        let { appNoticeList, tplCode } = this.state;
        dispatch({
            type: 'sldsetting/get_member_msg_tpl_lists',
            payload: { noticeType: 'single' },
            callback: (res) => {
                this.setState({ initLoading: false });
                if (res.state == 200) {
                    res.data.forEach(item => {
                        if(item.tplCode == tplCode){
                            appNoticeList = item.appNoticeList;
                        }
                    });
                    this.setState({ appNoticeList });
                }
            }
        });
    }

    //获取渠道是否使用富文本加密的配置
    getDescEncodeSwitch(channelId){
        let { appNoticeList } = this.state;
        let res = 0;
        appNoticeList.forEach((item)=>{
            if(item.channelId==channelId){
                res = item.descEncodeSwitch;
                return res;
            }
        })
        return res;
    }

    //根据id获取详细信息
    getDetail = () => {
        let { detail, query, uploadImgInfo, initPushTimeData, htmlTemplate} = this.state;
        const { dispatch } = this.props;
        if (!!query.id) {
            dispatch({
                type: 'advert/get_detail',
                payload: { 'id': query.id },
                callback: (res) => {
                    if (res.state == 200) {
                        //初始化数据
                        detail = {
                            channelId: res.data.pushChannel.pushChannelId,
                            channelName: res.data.pushChannel.pushChannelName,
                            pushTimeData:moment(res.data.pushTime),//推送时间
                            title: res.data.title,//标题
                            linkUrl:res.data.linkUrl,
                            imageUrl:res.data.imageUrl,
                            pushCompanyList:res.data.pushCompanyList.map((cpy)=>cpy.pushCompanyId)//推送企业
                        }
                        initPushTimeData = moment(res.data.pushTime).format('YYYY-MM-DD HH:mm:ss');
                        htmlTemplate = res.data.htmlTemplate;
                        let logoImgFileList = [];
                        if (detail.imageUrl) {
                            let tmp_data = {};
                            tmp_data.uid = detail.imageUrl;
                            tmp_data.name = detail.imageUrl;
                            tmp_data.status = 'done';
                            tmp_data.url = detail.imageUrl;
                            tmp_data.response = {};
                            tmp_data.response.data = {};
                            tmp_data.response.data.url = detail.imageUrl;
                            tmp_data.response.data.path = detail.imageUrl;
                            logoImgFileList.push(tmp_data);
                        }
                        uploadImgInfo.logoImgFileList = logoImgFileList;
                        this.getAllCompanyInfo(res.data.pushChannel.pushChannelId);
                        this.setState({ detail, uploadImgInfo, initPushTimeData, htmlTemplate, showLoading: false });
                    } else {
                        failTip(res.msg);
                    }
                }
            });
        }
    };


    //保存并新增事件
    handleSaveAllData = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { dispatch } = this.props;
                const {detail, uploadImgInfo, companyInfos, initPushTimeData, htmlTemplate, bisEdit, query,pushUserList,upInfo} = this.state;
                const {pushObjectEnum,pushUserEnum,pushUserCompanyEnum} = values
              
                
                let descEncodeSwitch = this.getDescEncodeSwitch(values.channelId);
                let params = {
                    userId: "1",
                    companyId: "1",
                    userName: (getStorage('user_info') != '' && getStorage('user_info') != null) ? JSON.parse(getStorage('user_info')).user_name : 'admin',
                    pushTime: detail.pushTime || initPushTimeData,//处理没选择时间的问题
                    pushChannel:{pushChannelId:values.channelId,pushChannelName:detail.channelName},
                    title: values.title,
                    linkUrl: values.linkUrl,
                    descEncodeSwitch:descEncodeSwitch,
                    pushObjectEnum:pushObjectEnum
                }
                if(bisEdit){
                    params.id = query.id;
                }

                if( pushObjectEnum=='COMPANY' ){
                    //推送企业
                    if (values.pushCompanyList.length > 0) {
                        params.pushCompanyList = values.pushCompanyList.map((cpyItem)=>{
                            let index = companyInfos.findIndex((item) => item.companyId == cpyItem)
                            return {pushCompanyId:cpyItem,pushCompanyName:companyInfos[index].companyName}
                        });
                    } else {
                        failTip(`${('请选择推送企业')}`);
                        return false;
                    }
                }else if( pushObjectEnum=='USER' ){
                    // 推送用户
                    params.pushUserEnum = pushUserEnum

                    if(pushUserEnum=='USER_ALL'){
                        // 所有用户
                        params.pushUserCompanyEnum = pushUserCompanyEnum

                    }else if(pushUserEnum=='USER_LIST'){
                        // 指定用户
                        if(pushUserList.length==0){
                            failTip('请上传用户数据');
                            return false;
                        }
                        params.pushUserList = pushUserList
                        params.attachmentUrl = upInfo.attachmentUrl
                        params.attachmentName = upInfo.attachmentName
                    }
                    
                }
                
                //封面图
                if (uploadImgInfo.logoImgFileList.length > 0) {
                    params.imageUrl = uploadImgInfo.logoImgFileList[0].response.data.url;//图片
                    let imgW = uploadImgInfo.logoImgFileList[0].response.data.width;
                    let imgH = uploadImgInfo.logoImgFileList[0].response.data.height;
                    let pageHeight = parseInt(imgH*750/imgW);
                    let reg = /(?<=pageHeight=).*?(?=>)/;
                    params.htmlTemplate = htmlTemplate.replace(reg,pageHeight);
                } else {
                    failTip(`${('请上传推送图片')}`);
                    return false;
                }
                dispatch({
                    type: 'advert/addAndupdate',
                    payload: params,
                    callback: (res) => {
                        if (res.state == 200) {
                            sucTip(res.msg);
                            setTimeout(() => {
                                sthis.props.history.goBack();
                            }, 500);
                        } else {
                            failTip(res.msg);
                        }
                    }
                });
            }
        });
    };

    //select渠道选择
    selectOnChange = (e) => {
        let { detail, optional } = this.state;
        let index = optional.findIndex((item) => item.channelId == e)
        detail.channelName = optional[index].channelName;
        this.getAllCompanyInfo(optional[index].channelId);
        detail.pushCompanyList = [];
        this.setState({ detail });
    };

    //获取渠道列表
    getChannelList = () => {
        const { dispatch } = this.props;
        let { optional } = this.state;
        dispatch({
            type: 'advert/operation_list',
            payload: { pageSize: 1000, pageNum: 1 },
            callback: (res) => {
                if (res.state == 200) {
                    optional = res.data.channelInfos.filter(i => i.channelId != -1);
                    this.setState({ optional });
                } else {
                    failTip(res.msg);
                }
            }
        });
    };

    //获取渠道企业列表
    getAllCompanyInfo = (id) => {
        const { dispatch } = this.props;
        let { companyInfos } = this.state;
        dispatch({
            type: 'advert/get_allCompanyInfo',
            payload: { 'channelId': id},
            callback: (res) => {
                if (res.state == 200) {
                    companyInfos = res.data.companyInfos;
                    this.setState({ companyInfos });
                } else {
                    failTip(res.msg);
                }
            }
        });
    };

    //选择日期
    datePickerOnChange = (e,f) => {
        let { detail } = this.state;
        detail.pushTime = f;
        this.setState({ detail });
    };
    
    //预览图片
    uploadPreview = (info) => {
        this.viewImg(true, info.response.data.url);
    };

    //上传图片
    uploadChange = (info, type) => {
        let { uploadImgInfo } = this.state;
        if (info.file.status != undefined && info.file.status != 'error') {
            uploadImgInfo[type] = info.fileList;
        }
        this.setState({ uploadImgInfo });
    };

    //预览图片/关闭预览图片
    viewImg = (flag, img = '', text = '') => {
        this.setState({
            preview_img: img,
            preview_alt_con: text,
            show_preview_modal: flag
        });
    };

    // 直接导模板
    downFile = (type) =>{
        downLoad_front(type)
    }

    //获取excel内容
    beforeUploadFun =async (file,fileList)=>new Promise(async (resolve, reject)=>{
        const { pushObjectEnum } = this.state
        //限制上传文件的数量,只显示最近上传的1个文件，旧文件将被新的文件替换。
        fileList = fileList.slice(-1);
        const isExcle = file.name.split('.')[file.name.split('.').length-1] === 'xlsx';
        if (!isExcle) {
            failTip('请按模板上传xlsx文件!');
            reject()
            return
        }
        const isLt50M = file.size / 1024 / 1024 < 50;
        if (!isLt50M) {
            failTip('上传文件需小于50MB!');
            reject()
            return
        }
        
        let execRes = await this.loadExcle(fileList)
       
        if(pushObjectEnum=='USER' && execRes){
            resolve();
        }
       
        reject()
    })

    loadExcle = (fileList)=> new Promise((resolve) => {
        const { pushObjectEnum } = this.state
        let that = this
        let rABS = true;
        const f = fileList[0];
        let reader = new FileReader();
        if (rABS) {reader.readAsBinaryString(f);} else {reader.readAsArrayBuffer(f);}
        reader.onload = function(e){
            var data = e.target.result;
            if (!rABS) {data = new Uint8Array(data);}
            var workbook = XLSX.read(data, {
                type: rABS ? 'binary' : 'array'
            });
            // 假设我们的数据在第一个标签
            var first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
            // XLSX自带了一个工具把导入的数据转成json
            var jsonArr = XLSX.utils.sheet_to_json(first_worksheet, {header:1});
            // 通过自定义的方法处理Json，比如加入state来展示
            const res = pushObjectEnum=='COMPANY' ? that.handleImpotedJson(jsonArr):that.handleImpotedUserJson(jsonArr);
           
            if(res){
                resolve(true)
            }else{
                resolve(false)
            }
        };
    })
    
    // 解析导入的公司
    handleImpotedJson = (data)=>{
        let { detail, companyInfos } = this.state;
        let MAX_COMPANY_LENGTH = 50;
        try {
            let jsonData = data.filter((item)=>item.length > 0)
            if(!!jsonData.length && jsonData.length > 0){
                //是否选择渠道校验
                if(detail.channelName == ''){
                    failTip(`请先选择渠道再上传对应渠道下的企业数据`);
                    return;
                }

                //长度校验
                if((jsonData.length-1) > MAX_COMPANY_LENGTH){//-1为减去第一行表头
                    failTip(`上传失败,企业数据不能超过${MAX_COMPANY_LENGTH}`);
                    return;
                }
                // 整合商品详情的入参
                let companyList = [];
                for(let index = 0; index < jsonData.length; index++) {
                    const ele = jsonData[index];
                    if(Array.isArray(ele)&&ele.length>0){
                        if(index==0){
                            if(ele[0]=='companyId'){
                                // todo
                            }else{
                                failTip('companyId项错误,请按格式重新上传!');
                                return false
                            }
                        // eslint-disable-next-line no-restricted-globals
                        }else if( ele[0] && ele[0]!=''){
                            if(companyList.indexOf(String(ele[0]))>-1){
                                failTip(`companyId重复,请检查第${index+1}行数据`);
                                return false
                            }
                            if(companyInfos.findIndex((item) => item.companyId == ele[0]) == -1){
                                failTip(`企业“${ele[1]}”在该渠道不存在,请检查第${index+1}行数据`);
                                return false
                            }
                            companyList.push(String(ele[0]));
                        }else{
                            failTip(`解析失败,请检查第${index+1}行数据`);
                        }
                    }
                }
                this.props.form.setFieldsValue({
                    pushCompanyList:[...companyList]
                })
                detail.pushCompanyList = companyList;
                this.setState({ detail });
                return true  
            }
            failTip('解析失败,请按格式上传!');
            
        
        } catch (error) {
            failTip('解析失败,请按格式上传!');
        }
    }

    // 解析导入的用户数据
    handleImpotedUserJson = (jsonData)=>{
        try {
            if(!!jsonData.length && jsonData.length > 0){
                let _userList = [];
                for(let index = 0; index < jsonData.length; index++) {
                    const ele = jsonData[index];
                    if(Array.isArray(ele)&&ele.length>0){
                        if(index==0){
                            if(ele[0]!='用户ID'){
                                failTip.error('用户ID项错误,请按格式重新上传!');
                                return false
                            }
                            if(ele[1]!='企业ID'){
                                failTip.error('企业ID项错误,请按格式重新上传!');
                                return false
                            }
                        }else{
                            let _params = {}

                            if( ele[0] ){
                                _params.pushUserId = ele[0]
                            }else{
                                failTip.error(`解析失败,请填写用户ID`);
                                return false;
                            }
                           
                            if( ele[1] ){
                                _params.pushCompanyId = ele[1]
                            }else{
                                failTip.error(`解析失败,请填写公司ID`);
                                return false;
                            }

                            _userList.push(_params)
                        }
                    }
                }
                if(_userList.length==0){
                    failTip.error(`请导入数据!`);
                    return false
                }
               
                this.setState({
                    pushUserList:_userList
                })
                return true
            }
            failTip.error('解析失败,请按格式上传!');
        } catch (error) {
            failTip.error('解析失败,请按格式上传!');
        }
    }

    upChange = (info) => {
        if (info.file.status != undefined && info.file.status != 'error') {
            const { name,response } = info.file
            if(response && response.data){
                this.setState({
                    upInfo:{
                        attachmentUrl:response.data.url,
                        attachmentName:name
                    }
                })
            }
           
        }
    };

    // eslint-disable-next-line react/sort-comp
    upProps = {
        name: 'file', //发到后台的文件参数名
        action: `${apiUrl}v3/oss/common/upload?source=adminDoc`,
        headers: { Authorization: `Bearer ${getLocalStorageStingVal('sld_token')}` },
        showUploadList: false,
        beforeUpload: this.beforeUploadFun,
        onChange:this.upChange
    }

    
    handlePushType = (e) => {
        this.setState({ pushObjectEnum: e.target.value });
    };

    handlePushUserType = (e) => {
        this.setState({ pushUserEnum: e.target.value });
    }

    render() {
        const { 
            detail, showLoading, optional, companyInfos, query, bisEdit, uploadImgInfo, preview_img, preview_alt_con, show_preview_modal,
            pushObjectEnum,pushUserEnum,pushUserCompanyEnum,upInfo
        } = this.state;
        let { form: { getFieldDecorator } } = this.props;
        const uploadButton = (text) => (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">{text}</div>
            </div>
        );
        const disabledDate = (current) => 
            current && current < moment().endOf('minute')
        ;

        return (
           
            <Spin spinning={query.id != undefined ? showLoading : false}>
                {bisEdit &&
                        <div className={global.flex_com_space_between} style={{ marginBottom: 10, padding: 10 }}>
                            <div />
                        </div>
                }
                <div
                    className={`${promotion.full_activity} ${promotion.seckill} ${global.common_page_20}`}
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
                >
                    {sldLlineRtextAddGoods('#FA6F1E', `${('基础信息')}`)}
                    {getSldEmptyH(10)}
                    <div className={`${global.goods_sku_tab} ${global.add_goods_wrap}`}>
                        <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                            <Scrollbars
                                autoHeight
                                autoHeightMin={100}
                                autoHeightMax={document.body.clientHeight - 160}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {/* 推送时间 */}
                                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                        <div className={`${promotion.left}`}>
                                            <span style={{ color: '#FF1515' }}>*</span>推送时间
                                        </div>
                                        <div className={`${promotion.right}`}>
                                            <FormItem
                                                style={{ width: 300 }}
                                            >
                                                {getFieldDecorator('pushTimeData', {
                                                    initialValue: detail.pushTimeData, rules: [{
                                                        required: true,
                                                        message: `${('请选择推送时间')}`
                                                    }]
                                                })(
                                                    <DatePicker
                                                        disabled={bisEdit}
                                                        format="YYYY-MM-DD HH:mm:ss"
                                                        disabledDate={disabledDate}
                                                        showTime="true"
                                                        onChange={(e,f) => this.datePickerOnChange(e,f)}
                                                    />
                                                )}
                                            </FormItem>
                                        </div>
                                    </div>

                                    {/* 新建时选取渠道 */}
                                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                        <div className={`${promotion.left}`}>
                                            <span style={{ color: '#FF1515' }}>*</span>推送渠道
                                        </div>
                                        <div className={`${promotion.right}`}>
                                            <FormItem>
                                                {getFieldDecorator('channelId', {
                                                    initialValue: detail.channelId,
                                                    rules: [{
                                                        required: true,
                                                        message: `${('请选择推送渠道')}`
                                                    }]
                                                })(
                                                    <Select
                                                        showSearch
                                                        disabled={bisEdit}
                                                        placeholder={`${('请选择推送渠道')}`}
                                                        style={{ width: 400 }}
                                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                                        filterOption={(input, option) =>{
                                                            if (option && option.props.children) {
                                                                return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                            } 
                                                            return true
                                                        }}
                                                        onChange={(e) => this.selectOnChange(e)}
                                                    >
                                                        {optional.map((item, index) => <Option
                                                            key={index}
                                                            value={item.channelId}
                                                        >{`${item.channelName}(${item.channelId})`}</Option>)}
                                                    </Select>,
                                                )}
                                                <a href="https://docs.qq.com/sheet/DSWhxaVNTUXN3QndX?tab=BB08J2" target="_blank" rel="noreferrer" className={_style.support_link}>查看已支持推送渠道</a>
                                            </FormItem>
                                        </div>
                                    </div>

                                    {/* 推送方式 */}
                                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                        <div className={`${promotion.left}`}>
                                            <span style={{ color: '#FF1515' }}>*</span>推送方式
                                        </div>
                                        <div className={`${promotion.right}`}>
                                            <FormItem>
                                                {getFieldDecorator('pushObjectEnum', {
                                                    initialValue: pushObjectEnum,
                                                    rules: [{
                                                        required: true,
                                                        message: `${('请选择推送方式')}`
                                                    }]
                                                })(
                                                    <Radio.Group onChange={(e) => this.handlePushType(e)}>
                                                        <Radio.Button value="COMPANY">按企业推送</Radio.Button>
                                                        <Radio.Button value="USER">按用户推送</Radio.Button>
                                                    </Radio.Group>
                                                )}
                                            </FormItem>
                                        </div>
                                    </div>

                                    {
                                        pushObjectEnum=='COMPANY' && 
                                        <Fragment>
                                            {/* 新建时选取企业 */}
                                            <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                <div className={`${promotion.left}`}>
                                                    <span style={{ color: '#FF1515' }}>*</span>推送企业
                                                </div>
                                                <div className={`${promotion.right}`}>
                                                    <FormItem>
                                                        {getFieldDecorator('pushCompanyList', {
                                                            initialValue: detail.pushCompanyList,
                                                            rules: [{
                                                                required: true,
                                                                message: `${('请选择推送企业')}`
                                                            }]
                                                        })(
                                                            <Select
                                                                disabled={bisEdit}
                                                                placeholder={`${('请选择推送企业')}`}
                                                                mode="multiple"
                                                                style={{ width: 400 }}
                                                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                                                filterOption={(input, option) =>{
                                                                    if (option && option.props.children) {
                                                                        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                                    } 
                                                                    return true
                                                                }}
                                                                // onChange={(e) => this.selectCpyOnChange(e)}
                                                            >
                                                                {companyInfos.map((item, index) => <Option
                                                                    key={index}
                                                                    value={item.companyId}
                                                                >{`${item.companyName}(${item.companyId})`}</Option>)}
                                                            </Select>,
                                                        )}
                                                    </FormItem>
                                                </div>
                                            </div>
                                            {/* 上传推送企业模板数据 */}
                                            <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                <div className={`${promotion.left}`}>
                                                    <span style={{ color: '#FF1515' }}></span>上传推送企业数据
                                                </div>
                                                <div className={`${promotion.right}`}>
                                                    <Upload {...this.upProps}>
                                                        <Button><Icon type="upload" />上传文件</Button>
                                                    </Upload>
                                                    <span className={_style.down_link} onClick={()=>{this.downFile('company')}}>下载&nbsp;“企业推送模板”</span>
                                                    <span style={{marginLeft:'10px',color:'#999'}}>请先选择渠道再上传对应渠道下的企业数据</span>
                                                    <div className={_style.extra}>
                                                        支持格式：.xlxs，文件大小不超50M
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    }

                                    {
                                        pushObjectEnum == 'USER' && 
                                        <Fragment>
                                            {/* 推送用户 */}
                                            <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                <div className={`${promotion.left}`}>
                                                    <span style={{ color: '#FF1515' }}>*</span>推送用户
                                                </div>
                                                <div className={`${promotion.right}`}>
                                                    <FormItem>
                                                        {getFieldDecorator('pushUserEnum', {
                                                            initialValue: pushUserEnum,
                                                            rules: [{
                                                                required: true,
                                                                message: `${('请选择推送用户')}`
                                                            }]
                                                        })(
                                                            <Radio.Group onChange={(e) => this.handlePushUserType(e)}>
                                                                <Radio value="USER_ALL">所有用户</Radio>
                                                                <Radio value="USER_LIST">指定用户</Radio>
                                                            </Radio.Group>
                                                        )}
                                                    </FormItem>
                                                </div>
                                            </div>
                                            {/* 用户下推送企业 */}
                                            {
                                                pushUserEnum=='USER_ALL' && 
                                                <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                    <div className={`${promotion.left}`}>
                                                        <span style={{ color: '#FF1515' }}>*</span>用户下推送企业
                                                    </div>
                                                    <div className={`${promotion.right}`}>
                                                        <FormItem>
                                                            {getFieldDecorator('pushUserCompanyEnum', {
                                                                initialValue: detail.pushUserCompanyEnum||pushUserCompanyEnum,
                                                                rules: [{
                                                                    required: true,
                                                                    message: `${('请选择用户下推送企业')}`
                                                                }]
                                                            })(
                                                                <Radio.Group>
                                                                    <Radio value="NOW_COMPANY">当前企业</Radio>
                                                                    <Radio value="ALL_COMPANY">所有企业</Radio>
                                                                </Radio.Group>
                                                            )}
                                                        </FormItem>
                                                    </div>
                                                </div>
                                            }
                                            {/* 上传推送用户数据 */}
                                            {
                                                pushUserEnum=='USER_LIST' && 
                                                <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                    <div className={`${promotion.left}`}>
                                                        <span style={{ color: '#FF1515' }}></span>上传推送用户数据
                                                    </div>
                                                    <div className={`${promotion.right}`}>
                                                        <Upload {...this.upProps}>
                                                            <Button><Icon type="upload" />上传文件</Button>
                                                        </Upload>
                                                        <span className={_style.down_link} onClick={()=>{this.downFile('pushuser')}}>下载&nbsp;“用户推送模板”</span>
                                                        <span style={{marginLeft:'10px',color:'#999'}}>请先选择渠道再上传对应渠道下的企业数据</span>
                                                        <div className={_style.extra}>
                                                            支持格式：.xlxs，文件大小不超50M，企业id只能填一个，特殊情况：-2的代表所有企业，-3代表当前企业
                                                        </div>
                                                        <div>
                                                            {
                                                                upInfo.attachmentUrl && <span onClick={()=>{downlad(upInfo.attachmentUrl,upInfo.attachmentName)}} className={_style.down_url}><Icon type="link" style={{marginRight:'4px'}} />{upInfo.attachmentName}</span>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </Fragment>
                                    }

                                    {/* 推送标题 */}
                                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                        <div className={`${promotion.left}`}>
                                            <span style={{ color: '#FF1515' }}>*</span>推送标题
                                        </div>
                                        <div className={`${promotion.right}`}>
                                            <FormItem
                                                style={{ width: 300 }}
                                            >
                                                {getFieldDecorator('title', {
                                                    initialValue: detail.title, rules: [{
                                                        required: true,
                                                        whitespace: true,
                                                        message: `${('请输入推送标题')}`
                                                    }]
                                                })(
                                                    <Input maxLength={50} disabled={bisEdit} style={{ width: 400 }} placeholder={`${('请输入推送标题')}`} />,
                                                )}
                                            </FormItem>
                                        </div>
                                    </div>

                                    {/* 封面图 */}
                                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                        <div className={`${promotion.left}`}>
                                            <span style={{ color: '#FF1515' }}>*</span>封面图
                                        </div>
                                        <div className={`${promotion.right}`}>
                                            <FormItem
                                                extra='支持上传.gif .jpeg .png .jpg格式的图片'
                                                style={{ width: 300 }}
                                            >
                                                <Upload
                                                    disabled={bisEdit}
                                                    withCredentials
                                                    beforeUpload={sldBeforeUpload}
                                                    accept=".gif, .jpeg, .png,.jpg,"
                                                    name="file"
                                                    action={`${apiUrl}v3/oss/common/upload?source=setting`}
                                                    listType="picture-card"
                                                    fileList={uploadImgInfo.logoImgFileList}
                                                    onPreview={(info) => this.uploadPreview(info)}
                                                    onChange={(info) => this.uploadChange(info, 'logoImgFileList')}
                                                    headers={{
                                                        Authorization: `Bearer ${getLocalStorageStingVal('sld_token')}`
                                                    }}
                                                >
                                                    {uploadImgInfo.logoImgFileList.length >= 1 ? null : uploadButton('上传图片')}
                                                </Upload>
                                            </FormItem>
                                        </div>
                                    </div>

                                    {/* 地址连接 */}
                                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                        <div className={`${promotion.left}`}>
                                            <span style={{ color: '#FF1515' }}>*</span>地址连接
                                        </div>
                                        <div className={`${promotion.right}`}>
                                            <FormItem
                                                style={{ width: 300 }}
                                            >
                                                {getFieldDecorator('linkUrl', {
                                                    initialValue: detail.linkUrl, rules: [{
                                                        required: true,
                                                        whitespace: true,
                                                        message: `${('请输入地址连接')}`
                                                    }]
                                                })(
                                                    <Input maxLength={500} disabled={bisEdit} style={{ width: 400 }} placeholder={`${('请输入地址连接')}`} />,
                                                )}
                                            </FormItem>
                                        </div>
                                    </div>                                    
                                    {getSldEmptyH(35)}
                                    
                                    <div
                                        className={global.m_diy_bottom_wrap}
                                        style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}
                                    >
                                        <div onClick={() => this.props.history.goBack()} className={global.add_goods_bottom_btn}>
                                            {sldComLanguage('返回')}{/*返回*/}
                                        </div>


                                        {!bisEdit && <div
                                            onClick={() => this.props.form.submit(this.handleSaveAllData)}
                                            className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}
                                        >
                                            保存并返回
                                        </div>}

                                    </div>
                                </div>
                            </Scrollbars>
                        </div>
                    </div>
                </div>
                {/*图片预览-start*/}
                <SldPreviewImg
                    img={preview_img}
                    show_preview_modal={show_preview_modal}
                    modal_width={500}
                    preview_alt_con={preview_alt_con}
                    closePreviewModal={() => this.viewImg(false)}
                />
                {/*图片预览-end*/}
            </Spin>
           
        );
    }
}
