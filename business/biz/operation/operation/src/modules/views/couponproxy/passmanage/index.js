/*
* 红包——平台红包列表
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin, message } from 'antd';
import XLSX from 'xlsx';
import {
    failTip,
    sucTip,
    list_com_page_size_10,
    dragSldTableColumn,
    getTableNum,
    sldComLanguage,
    dateFormat,
    sldHandlePaginationData,
    sldIconBtn,
    formItemLayoutModal,
    sldLlineRtextAddGoodsAddMargin,
    getAuthBtn
} from '@/utils/utils';
import { apiUrl } from '@/utils/sldconfig';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
// eslint-disable-next-line no-shadow
@connect(({ couponproxy }) => ({
    couponproxy
}))
@Form.create()
export default class passManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search_height: 0,
            modal_width: 700,//查看规格、下架红包的modal框宽度
            initLoading: false,
            submiting: false,
            show_foot: false,
            modalVisible: false,//是否显示规格弹框
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            params: { pageSize: pageSize },//搜索条件
            importPageData: [
                {
                    type: 'input',
                    label: `${sldComLanguage('渠道ID')}`,//渠道ID
                    name: 'channelId',
                    placeholder: `${sldComLanguage('请输入渠道ID')}`,//请输入渠道ID
                    initialValue: '',
                    maxLength: 128,
                    // extra: `${sldComLanguage('最多输入128个字')}`,
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: `${sldComLanguage('请输入渠道ID')}`//请输入渠道ID
                        }
                    ]
                },
                {
                    type: 'input',
                    label: `${sldComLanguage('重复渠道ID')}`,//重复渠道 ID
                    name: 'channelIdcfm',
                    placeholder: `${sldComLanguage('请重复渠道ID')}`,//请输入渠道ID
                    initialValue: '',
                    maxLength: 128,
                    // extra: `${sldComLanguage('最多输入128个字')}`,
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: `${sldComLanguage('请重复渠道ID')}`//请输入渠道ID
                        }
                    ]
                },
                {
                    type: 'upload_file_upload',
                    label: `${sldComLanguage('卡密文件')}`,
                    name: 'fileUrl',
                    placeholder: `${sldComLanguage('请添加卡密文件')}`,
                    // extra: `${sldComLanguage('卡密文件,Excel表格')}`,
                    fileList: [],
                    img_info: {},
                    upload_name: 'file',
                    required: true,
                    upload_url: `${apiUrl}v3/oss/common/upload?source=setting`,
                    uploadPreview: this.uploadImgPre,
                    beforeUpload: this.beforeUpload,
                    uploadChange: (info) => this.uploadImg(info, 'fileUrl'),
                    initialValue: '',
                    loading: false
                }
            ],
            search_data: [
                {
                    type: 'input',
                    label: `${sldComLanguage('渠道ID')}`,
                    name: 'channelId',
                    placeholder: `${sldComLanguage('请输入渠道ID')}`
                },
                {
                    type: 'input',
                    label: `${sldComLanguage('企业ID')}`,
                    name: 'companyId',
                    placeholder: `${sldComLanguage('请输入企业ID')}`
                },
                {
                    type: 'input',
                    label: `${sldComLanguage('企业名称')}`,
                    name: 'companyName',
                    placeholder: `${sldComLanguage('请输入企业名称')}`
                },
                {
                    type: 'select',
                    label: `${sldComLanguage('领取状态')}`,
                    name: 'state',
                    placeholder: `${sldComLanguage('请选择领取状态')}`,
                    sel_data: [
                        { key: '', name: `${sldComLanguage('全部')}` },
                        { key: 1, name: `${sldComLanguage('已领取')}` },
                        { key: 2, name: `${sldComLanguage('未领取')}` }
                    ]
                },
                {
                    type: 'rangepicker',
                    label: `${sldComLanguage('导入时间')}`,
                    name: 'import_time',
                    placeholder1: `${sldComLanguage('开始时间')}`,
                    placeholder2: `${sldComLanguage('结束时间')}`
                },
                {
                    type: 'rangepicker',
                    label: `${sldComLanguage('领取时间')}`,
                    name: 'receive_time',
                    placeholder1: `${sldComLanguage('开始时间')}`,
                    placeholder2: `${sldComLanguage('结束时间')}`
                }
            ],
            formValues: {},//搜索条件
            columns: [
                {
                    title: ' ',
                    align: 'center',
                    width: 30,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('渠道ID')}`,
                    dataIndex: 'channelId',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('第三方用户ID')}`,
                    dataIndex: 'thirdUserId',
                    align: 'center',
                    render: (text) => <div>{!!text ? text : '--'} </div>
                },
                {
                    title: `${sldComLanguage('卡密')}`,
                    dataIndex: 'password',
                    align: 'center',
                    //这里需要脱敏显示，使用正则实现
                    render: (text) => <div>{!!text ? text.replace(/(\S{4})\S*(\S{4})/, '$1****$2') : '--'} </div>
                },
                {
                    title: `${sldComLanguage('企业ID')}`,
                    dataIndex: 'companyId',
                    align: 'center',
                    render: (text) => <div>{!!text ? text : '--'} </div>
                },
                {
                    title: `${sldComLanguage('企业名称')}`,
                    dataIndex: 'companyName',
                    align: 'center',
                    render: (text) => <div>{!!text ? text : '--'} </div>
                },
                {
                    title: `${sldComLanguage('领取状态')}`,
                    dataIndex: 'state',
                    align: 'center',
                    render: (text) => {
                        switch (text) {
                            case 1:
                                return <div>已领取</div>
                            case 2:
                                return <div>未领取</div>
                            default:
                                return '--'
                        }
                    }
                },
                {
                    title: `${sldComLanguage('签约状态')}`,
                    dataIndex: 'isSign',
                    align: 'center',
                    render: (text) => <div>{text == 1 ? '已签约' : '--'} </div>
                },
                {
                    title: `${sldComLanguage('导入时间')}`,
                    dataIndex: 'importTime',
                    align: 'center',
                    render: (text) => <div>{!!text ? new Date(text).format('yyyy-MM-dd hh:mm:ss') : '--'} </div>
                },
                {
                    title: `${sldComLanguage('领取时间')}`,
                    dataIndex: 'receiveTime',
                    align: 'center',
                    render: (text) => <div>{!!text ? new Date(text).format('yyyy-MM-dd hh:mm:ss') : '--'} </div>
                }
            ],
            importTypes: {
                // 1 表示 admin平台优惠券的Excel表格，字段 是特有的。
                1: {
                    //infoKeys 就是 infoKeysArr 平铺展开后的，请注意 一定要保持数量一致
                    infoKeys: [
                        "优惠券名称",
                        "领券开始时间",
                        "领券结束时间",
                        "优惠券类型",
                        "面额（元）",
                        "使用规则描述",
                        "优惠券兑换码"
                    ],
                    infoKeysArr: [
                        //infoKeys 就是 infoKeysArr 平铺展开后的，请注意 一定要保持数量一致
                        //一级菜单，总共7个字段（Excel读取），转化成一个对象resourceObj                       
                        [
                            "优惠券名称",
                            "领券开始时间",
                            "领券结束时间",
                            "优惠券类型",
                            "面额（元）",
                            "使用规则描述",
                            "优惠券兑换码"
                        ]
                    ],
                    // 一条数据 必须 要么有接口ID（第五级）要么有权限ID（第四级），否则认为是一条垃圾数据，需要删除
                    necessaryKeys: [
                        "优惠券兑换码",
                        "优惠券名称"
                    ],
                    keysMapping: {
                        "优惠券名称": "couponName",
                        "领券开始时间": "publishStartTime",
                        "领券结束时间": "publishEndTime",
                        "优惠券类型": "couponType",
                        "面额（元）": "publishValue",
                        "使用规则描述": "description",
                        "优惠券兑换码": "password"

                    },
                    //这里是接口的层级对象模型。
                    resourceObj: {
                        "couponName": "string",
                        "publishStartTime": "string",
                        "publishEndTime": "string",
                        "couponType": 0,
                        "publishValue": 0,
                        "description": "string",
                        "password": "string"
                    }
                }
            },
            checkRes: "",
            tipText1: "请上传Excel文件",
            tipText2: "不是标准的卡密文件，无法解析！",
            tipText3: "json文件解析错误",
            tipText4: "有重复的优惠券兑换码！"
        };
    }

    componentDidMount() {
        this.get_list({ pageSize: pageSize });
        this.resize();
        window.addEventListener('resize', this.resize);
        this.setMyDateFormat()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    //解决从Excel解析出来的日期，使用JSON.stringfy转义的时候，会出现日期计算错误
    setMyDateFormat = () => {
        Date.prototype.format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (`${this.getFullYear()}`).substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp(`(${k})`).test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
                }
            }
            return fmt;
        }

        Date.prototype.toJSON = function () {
            return this.format("yyyy-MM-dd hh:mm:ss"); // util.formatDate是自定义的个时间格式化函数
        }
    }

    //适配页面放大或缩小，列表不出现遮挡
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
            type: 'couponproxy/getPwdList',
            payload: { ...params, current: params.current || 1 },
            callback: (res) => {
                this.setState({ initLoading: false });
                if (res.resultCode == 0) {
                    if (res.result && res.result.resultList.length == 0 && this.state.params.current > 1) {
                        params.current = params.current - 1;
                        this.get_list(params);
                    } else {
                        this.setState({
                            data: {
                                list: res.result.resultList,
                                pagination: {
                                    current: res.result.current,
                                    pageCount: res.result.pageCount || 0,
                                    pageSize: res.result.pageSize,
                                    total: res.result.resultCount || 0
                                }
                            }
                        });
                    }
                } else {
                    failTip(res.msg || res.resultMessage)
                }
            }
        });
    };

    //处理列表的选择
    handleSelectRows = (rows, rowkeys) => {
        this.setState({
            selectedRows: rows,
            selectedRowKeys: rowkeys
        });
    };

    //处理列表的分页
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
        if (values.import_time) {
            // console.log('search', values.import_time)
            //toISOString() 函数将当前日期转换为 UTC
            values.importStartTime = values.import_time[0] ? new Date(`${values.import_time[0].format(dateFormat)} 00:00:00`) : '';
            values.importEndTime = values.import_time[1] ? new Date(`${values.import_time[1].format(dateFormat)} 23:59:59`) : '';
            delete values.import_time;
        }
        //使用时间处理
        if (values.receive_time) {
            values.receiveStartTime = values.receive_time[0] ? `${values.receive_time[0].format(dateFormat)} 00:00:00` : '';
            values.receiveEndTime = values.receive_time[1] ? `${values.receive_time[1].format(dateFormat)} 24:00:00` : '';
            delete values.receive_time;
        }

        for (let i in values) {
            //去掉空的参数
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

    //导入弹框的取消按钮
    sldHandleCancle = () => {
        let { importPageData } = this.state;
        //复原上传的Excel等数据
        for (let i = 0; i < importPageData.length; i++) {
            if (importPageData[i].name == 'fileUrl') {
                importPageData[i].fileList = []
            }
        }
        this.setState({ modalVisible: false, importPageData, excelData: {}, checkRes:"" });
    };

    //导入弹框的确认按钮
    sldHandleConfirm = (val) => {
        if (val.channelId != val.channelIdcfm) {
            failTip('两次渠道ID不一致，请重新输入');
            return false;
        }
        const { excelData, formValues, checkRes } = this.state
        if (!(!!excelData && excelData.children && excelData.children.length)) {
            failTip(`请添加卡密文件${!!checkRes ? (`，${checkRes}`) : ""}`);
            return false;
        }

        const { dispatch } = this.props;
        const that = this;
        //校验成功后，给每条数据都添加渠道ID
        excelData.children.forEach(element => {
            element.channelId = val.channelId
        });

        that.setState({ submiting: true });
        //导入接口
        dispatch({
            type: 'couponproxy/importpass',
            payload: { couponPasswordlList: excelData.children },
            callback: (res) => {
                that.setState({ submiting: false });
                if (res.resultCode == 0) {
                    this.sldHandleCancle()
                    sucTip(res.resultMessage)
                    this.get_list({ pageSize: pageSize, ...formValues });
                } else {
                    failTip(res.msg || res.resultMessage);
                }
            }
        });
    };


    //启动上传 若返回 false 则停止上传
    beforeUpload = (file, fileList) => {
        // console.log('beforeUpload', file.type)
        const { tipText1 } = this.state

        let that = this;
        //每次上传，清空上次的解析数据
        that.setState({
            excelData: {}
        })
        //限制上传文件的数量,只显示最近上传的1个文件，旧文件将被新的文件替换。
        fileList = fileList.slice(-1);
        const isExcle = file.type.includes('application/vnd');
        if (!isExcle) {
            message.error(tipText1);
            this.setState({checkRes : tipText1})
            return false
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('上传文件需小于10MB!');
            this.setState({checkRes : '上传文件需小于10MB!'})
            return false
        }
        var rABS = true;
        const f = fileList[0];
        var reader = new FileReader();

        that.startUploadLoading()

        reader.onload = function (e) {
            var data = e.target.result;
            if (!rABS) { data = new Uint8Array(data); }
            var workbook = XLSX.read(data, {
                type: rABS ? 'binary' : 'array',
                cellDates: true//读取excel，日期格式
            });
            // 假设我们的数据在第一个标签
            var first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
            // XLSX自带了一个工具把导入的数据转成json
            var jsonArr = XLSX.utils.sheet_to_json(first_worksheet);
            // console.log('first', jsonArr)
            try {
                jsonArr = JSON.parse(JSON.stringify(jsonArr).replaceAll("\\\\", "")); //去掉转义符号\);                
                // 通过自定义的方法处理Json，比如加入state来展示
                that.handleImpotedJson(jsonArr);
            } catch (error) {
                that.stopUploadLoading()
                message.error(tipText1);
                this.setState({checkRes : tipText1})
            }
        };
        if (rABS) { reader.readAsBinaryString(f); } else { reader.readAsArrayBuffer(f); }
        return false;
    }

    /**
     * 上传文件，是前端解析Excel在调用接口；
     */
    handleImpotedJson = (jsonArr) => {
        const { importType } = this.state

        // console.log(99, jsonArr)
        const that = this;

        let checkResult = that.checkFileInfo(jsonArr);
        // console.log('checkRes', checkResult)
        if (!!checkResult) {
            that.stopUploadLoading()
            message.error(checkResult);

            this.setState({checkRes : checkResult})
            return;
        }

        let reqData = { children: [] };

        jsonArr.forEach((element) => {
            for (let i = 0; i < importType.infoKeysArr.length; i++) {
                let keys = importType.infoKeysArr[i]
                //(i + 1) 表示 层级 grade，grade从1开始
                that.excelJSONToObj(reqData, element, keys, (i + 1))
            }
        });

        // console.log(122, reqData)
        that.setState({
            excelData: reqData
        }, () => {
            that.stopUploadLoading()
        });
    }

    /**
     * 将Excel的一条条的数据 转换成 接口请求的数据对象 resourceObj
     * @param {*} reqData 接口请求对象
     * @param {*} excelJson 一条Excel的记录数据
     * @param {*} keys 一个resourceObj必须的字段
     * @param {*} grade resourceObj对象的层级,从1开始
     */
    excelJSONToObj = (reqData, excelJson, keys, grade) => {
        const { importType } = this.state

        //keys 都是 7个字段，参见 keysMapping 和 infoKeysArr
        if (
            this.ifHasNecessaryKey(excelJson)
        ) {
            let bisObj = {
                "couponName": "",
                "publishStartTime": "",
                "publishEndTime": "",
                "couponType": 0,
                "publishValue": 0,
                "description": "",
                "password": ""
            };

            for (let i = 0; i < Object.keys(importType.keysMapping).length; i++) {
                bisObj[importType.keysMapping[keys[i]]] = excelJson[keys[i]]
            }

            this.addObjToReq(reqData, bisObj, grade)
        }
    }

    /**
     * 根据grade的层级，将resourceObj对象 加到 接口请求 reqData 对象中
     * @param {*} reqData 
     * @param {*} bisObj 
     * @param {*} grade 
     */
    addObjToReq = (reqData, bisObj, grade) => {
        let reqArr = reqData.children
        //grade == 1了 递归结束，开始赋值
        if (grade == 1) {
            reqArr.push(bisObj);
        } else {
            let lastIndex = reqArr.length > 0 ? reqArr.length - 1 : 0;
            let lastChild = reqArr[lastIndex]
            this.addObjToReq(lastChild, bisObj, grade - 1)
        }
    }


    /**
     * 是否还有必要的字段
     */
    ifHasNecessaryKey = (item) => {
        const { importType } = this.state
        let result = true
        importType.necessaryKeys.forEach(element => {
            result = result && item[element] != undefined && item[element] != null && item[element].toString().trim() !== ''
        });

        return result
    }


    /**
     * 上传文件，对JSON数据对象的keys做校验
     */
    checkFileInfo = (jsonArr) => {
        const { importType, tipText2, tipText3, tipText4 } = this.state

        let result = "";
        //解析错误
        if (jsonArr && jsonArr.length > 0) {
            for (let i = 0; i < jsonArr.length; i++) {
                //某条数据没有necessaryKeys，说明是没有意义的，应该删除
                // TODO : 需要自己定义
                if (!this.ifHasNecessaryKey(jsonArr[i])) {
                    jsonArr.splice(i, 1);
                    i--;
                }
            }

            //校验重复的卡密
            const newArr = jsonArr.map(item => item['优惠券兑换码']);
            const isRepeat = newArr.some((item, index, arr) => arr.indexOf(item) != index);
            if (isRepeat) {
                result = tipText4;
                return result
            }

            //正常情况，第一条数据是完整的key的数据。校验一下这个数据的key是否是标准数据格式。
            let item = jsonArr[0];
            if (item) {
                let itemKeys = Object.keys(item);
                let isFormatData = true;
                importType.infoKeys.forEach((element) => {
                    isFormatData =
                        isFormatData && itemKeys.includes(element);
                });
                if (!isFormatData) {
                    result = tipText2;
                }
            } else {
                result = tipText2;
            }
        } else {
            result = tipText3;
        }

        return result;
    }

    //上传图片
    uploadImg = (info, type) => {
        // console.log('uploadImg', info, type)
        let { importPageData } = this.state;
        for (let i = 0; i < importPageData.length; i++) {
            if (importPageData[i].name == type) {
                if (info.fileList.length > 1) {
                    info.fileList.splice(0, info.fileList.length - 1);
                }
                importPageData[i].fileList = info.fileList

            }
        }
        this.setState({ importPageData });
    };

    //启动上传文件的加载框
    startUploadLoading = () => {
        let { importPageData } = this.state;
        for (let i = 0; i < importPageData.length; i++) {
            if (importPageData[i].name == 'fileUrl') {
                importPageData[i].loading = true
            }
        }
        this.setState({ importPageData });
    };

    //停止上传文件的加载框
    stopUploadLoading = () => {
        let { importPageData } = this.state;
        for (let i = 0; i < importPageData.length; i++) {
            if (importPageData[i].name == 'fileUrl') {
                importPageData[i].loading = false
            }
        }
        this.setState({ importPageData });
    };

    //打开导入卡密的弹框
    toImportPage = () => {
        let { importTypes } = this.state;

        this.setState({
            importType: importTypes[1],
            modal_width: 500,
            title: `${sldComLanguage('导入卡密')}`,
            modalVisible: true,
            show_foot: true
        });
    };

    render() {
        const { selectedRows, search_data, columns, initLoading, data, modalVisible, title, modal_width, importPageData, show_foot, submiting, search_height } = this.state;
        return (

            <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('卡密管理')}`, 0, 0, 10)}

                <AuthBtn eventKey={['view_couponproxy_list']} btnAuth={btnAuth} showPage>

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
                    <AuthBtn eventKey={["import_couponproxy_coupon"]} btnAuth={btnAuth}>
                        <div className={global.operate_bg}>
                            {sldIconBtn(() => this.toImportPage(), `${sldComLanguage('导入卡密')}`, 7, 0, 14, 14, 3, 'tianjia', '#FA6F1E')}
                        </div>
                    </AuthBtn>
                    {/*公共功能条-end*/}

                    <Spin spinning={initLoading}>
                        {/*标准表格-start*/}
                        <StandardTable
                            totalHeight={document.body.clientHeight - 200 - search_height - 20}
                            bordered={false}
                            selectedRows={selectedRows}
                            data={data}
                            rowKey="password"
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

                { /*新增/编辑对话框-start*/}
                <SldModal
                    width={modal_width}
                    title={title}
                    submiting={submiting}
                    modalVisible={modalVisible}
                    sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
                    sldHandleCancle={this.sldHandleCancle}
                    formItemLayoutModal={formItemLayoutModal}
                    content={importPageData}
                    show_foot={show_foot}
                    confirmText={`${sldComLanguage('确定导入')}`}
                    accept=".xlsx"
                />
                { /*新增/编辑对话框-end*/}
            </div>
        );
    }
}
