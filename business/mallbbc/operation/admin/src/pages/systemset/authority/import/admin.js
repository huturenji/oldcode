import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Upload, Button, message, Spin } from 'antd';
import XLSX from 'xlsx';
import {
    failTip,
    sucTip,
    sldLlineRtextAddGoodsAddMargin,
    sldComLanguage,
    getSldEmptyH,
    loginOut,
    showMoreHelpTip
} from '@/utils/utils';
import {
    sld_systemset_authority_import
} from '@/utils/util_data';
import global from '@/global.less';

@connect(({ authority }) => ({
    authority
}))
@Form.create()
export default class AdminImport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initLoading: false,
            uploading: false,
            importTypes: {
                // 1 表示 admin平台的Excel表格，字段 是特有的。
                1: {
                    //infoKeys 就是 infoKeysArr 平铺展开后的，请注意 一定要保持数量一致
                    infoKeys: [
                        "一级菜单",
                        "一级菜单ID",
                        "一级菜单路由",
                        "二级菜单",
                        "二级菜单ID",
                        "二级菜单路由",
                        "三级菜单",
                        "三级菜单ID",
                        "三级菜单路由",
                        "权限",
                        "权限ID",
                        "权限路由",
                        "接口",
                        "接口ID",
                        "接口路由"
                    ],
                    infoKeysArr: [
                        //infoKeys 就是 infoKeysArr 平铺展开后的，请注意 一定要保持数量一致
                        //五级菜单，总共15个字段（Excel读取），每3个一组转化成一个对象resourceObj
                        //请注意，五级菜单，一定要保证 从第一到第五的顺序，不能打乱，因为下面代码解析会用到。infoKeys也要保持从上至下的顺序。
                        [

                            "一级菜单",
                            "一级菜单ID",
                            "一级菜单路由"
                        ],
                        [

                            "二级菜单",
                            "二级菜单ID",
                            "二级菜单路由"
                        ],
                        [

                            "三级菜单",
                            "三级菜单ID",
                            "三级菜单路由"
                        ],
                        [
                            "权限",
                            "权限ID",
                            "权限路由"
                        ],
                        [
                            "接口",
                            "接口ID",
                            "接口路由"
                        ]
                    ],
                    // 一条数据 必须 要么有接口ID（第五级）要么有权限ID（第四级），否则认为是一条垃圾数据，需要删除
                    necessaryKeys: [
                        "权限ID",
                        "接口ID"
                    ],
                    keysMapping: {
                        "一级菜单": "content",
                        "一级菜单ID": "resourceId",
                        "一级菜单路由": "frontPath",

                        "二级菜单": "content",
                        "二级菜单ID": "resourceId",
                        "二级菜单路由": "frontPath",

                        "三级菜单": "content",
                        "三级菜单ID": "resourceId",
                        "三级菜单路由": "frontPath",

                        "权限": "content",
                        "权限ID": "resourceId",
                        "权限路由": "frontPath",

                        "接口": "content",
                        "接口ID": "resourceId",
                        "接口路由": "frontPath"
                    },
                    //这里是接口的层级对象模型。
                    resourceObj: {
                        "children": [],
                        "content": "string",
                        "frontPath": "string",
                        "grade": 0,
                        "pid": 0,
                        "resourceId": 0,
                        "createTime": "2023-01-04T01:06:53.504Z",
                        "state": 0,
                        "url": "string"
                    }
                }
            },
            uploadIcon: require('@/assets/img/systemset/home/inport_down.png'),
            tipText1: "请按平台端模板上传xlsx文件",
            tipText2: "不是标准的权限码数据，无法解析！",
            tipText3: "json文件解析错误"
        };
    }

    componentDidMount() {
        const { importTypes } = this.state
        this.setState({
            importType: importTypes[1]
        })
    }


    /**
     * 前端读取Excel的内容，做预处理后再调用接口
     */
    beforeUploadFun = (file, fileList) => {
        const { tipText1 } = this.state

        let that = this;
        //限制上传文件的数量,只显示最近上传的1个文件，旧文件将被新的文件替换。
        fileList = fileList.slice(-1);
        const isExcle = file.name.split('.')[file.name.split('.').length - 1] === 'xlsx';
        if (!isExcle) {
            message.error(tipText1);
            return false
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('上传文件需小于10MB!');
            return false
        }
        var rABS = true;
        const f = fileList[0];
        var reader = new FileReader();

        that.setState({ initLoading: true });

        reader.onload = function (e) {
            var data = e.target.result;
            if (!rABS) { data = new Uint8Array(data); }
            var workbook = XLSX.read(data, {
                type: rABS ? 'binary' : 'array'
            });
            // 假设我们的数据在第一个标签
            var first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
            // XLSX自带了一个工具把导入的数据转成json
            var jsonArr = XLSX.utils.sheet_to_json(first_worksheet);
            try {
                jsonArr = JSON.parse(JSON.stringify(jsonArr).replaceAll("\\\\", "")); //去掉转义符号\);                
                // 通过自定义的方法处理Json，比如加入state来展示
                that.handleImpotedJson(jsonArr);
            } catch (error) {
                that.setState({ initLoading: false });
                message.error(tipText1);
            }
        };
        if (rABS) { reader.readAsBinaryString(f); } else { reader.readAsArrayBuffer(f); }
        return false;
    }

    // 这个upProps应该放在beforeUploadFun函数的后面
    // eslint-disable-next-line react/sort-comp
    upProps = {
        name: 'file', //发到后台的文件参数名
        headers: { Authorization: 'SID' },
        showUploadList: false,
        beforeUpload: this.beforeUploadFun
    }

    /**
     * 上传文件，是前端解析Excel在调用接口；
     */
    handleImpotedJson = (jsonArr) => {
        const { importType } = this.state

        // console.log(99, jsonArr)
        const that = this;

        let checkRes = that.checkFileInfo(jsonArr);
        if (!!checkRes) {
            that.setState({ initLoading: false });
            message.error(checkRes);
            return;
        }

        let reqData = { systemResourceVoList: [] };

        jsonArr.forEach((element) => {
            for (let i = 0; i < importType.infoKeysArr.length; i++) {
                let keys = importType.infoKeysArr[i]
                //(i + 1) 表示 层级 grade，grade从1开始
                that.excelJSONToObj(reqData, element, keys, (i + 1))
            }
        });

        console.log(122, 22)

        // console.log(122, JSON.stringify(reqData))
        // that.setState({ initLoading: false });
        this.initAuth(reqData)
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

        //keys 都是 3个字段，参见 keysMapping 和 infoKeysArr
        if (
            excelJson[keys[0]] &&
            excelJson[keys[1]] &&
            excelJson[keys[2]]
        ) {
            let bisObj = {
                "grade": grade,
                "children": [],//默认[]
                "createTime": "",//默认可以不传
                "state": 1,//默认都是1
                "url": "/"//默认都是 /
            };

            bisObj[importType.keysMapping[keys[0]]] = excelJson[keys[0]]
            bisObj[importType.keysMapping[keys[1]]] = excelJson[keys[1]]
            bisObj[importType.keysMapping[keys[2]]] = excelJson[keys[2]]

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
        let reqArr = reqData.systemResourceVoList || reqData.children
        //grade == 1了 递归结束，开始赋值
        if (grade == 1) {
            // 父节点id
            bisObj.pid = reqData.resourceId || "0"
            // 非第一层的节点，resourceId 等于 父节点id 加上 Excel原有的resourceId
            if (bisObj.pid != "0") {
                bisObj.resourceId = `${bisObj.pid}-${bisObj.resourceId}`
            }
            reqArr.push(bisObj);
        } else {
            let lastIndex = reqArr.length > 0 ? reqArr.length - 1 : 0;
            let lastChild = reqArr[lastIndex]
            this.addObjToReq(lastChild, bisObj, grade - 1)
        }
    }

    /**
     * 上传文件，对JSON数据对象的keys做校验
     */
    checkFileInfo = (jsonArr) => {
        const { importType, tipText2, tipText3 } = this.state

        let result = "";
        //解析错误
        if (jsonArr && jsonArr.length > 0) {
            for (let i = 0; i < jsonArr.length; i++) {
                //某条数据没有necessaryKeys，说明是没有意义的，应该删除
                // TODO : 需要自己定义
                if (!jsonArr[i][importType.necessaryKeys[0]] && !jsonArr[i][importType.necessaryKeys[1]]) {
                    jsonArr.splice(i, 1);
                    i--;
                }
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

    //导入权限表接口
    initAuth = (params) => {
        const { dispatch } = this.props;
        const that = this;
        dispatch({
            type: 'authority/init_all_permission_admin',
            payload: params,
            callback: (res) => {
                that.setState({ initLoading: false });
                if (res.state == 200) {
                    // sucTip(res.msg);
                    loginOut();
                } else {
                    failTip(res.msg);
                }
            }
        });
    };

    render() {
        const { uploading, tipText1, uploadIcon, initLoading } = this.state;
        return (
            <div className={global.common_page} style={{ flex: 1 }}>
                {/*顶部提示语*/}
                {showMoreHelpTip("", sld_systemset_authority_import(), 0, true, true)}

                {/*上传文件*/}
                {getSldEmptyH(10)}
                <Spin spinning={initLoading}>
                    <div style={{ textAlign: 'center' }}>
                        <img src={uploadIcon} style={{ height: '75px', width: '65px' }} />
                        <div style={{ color: '#999999' }}>{tipText1}</div>
                        {getSldEmptyH(10)}
                        <div style={{ marginBottom: '10px' }}>
                            <Upload {...this.upProps} disabled={uploading} style={{ marginRight: '8px' }}>
                                <Button loading={uploading} type='primary'>上传文件</Button>
                            </Upload>
                        </div>
                    </div>
                    {/*上传文件*/}

                </Spin>
            </div>

        );
    }
}
