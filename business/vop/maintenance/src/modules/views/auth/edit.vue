<template>
    <div>
        <div class="contentArea">
            <div
                class="content"
                v-if="showDown"
            >
                <div>{{ importType && importType.info1 }}</div>
                <div class="bodyContent">
                    <img
                        :src="require('assets/inport_down.png')"
                        alt
                    />
                    <div>{{ importType && importType.info2 }}</div>
                    <a
                        href="javascript:;"
                        class="upbtn"
                    >
                        <Button class="btnBg">下载模板</Button>
                        <div
                            class="input"
                            @click="downFile"
                        ></div>
                    </a>
                </div>
            </div>
            <div
                class="line"
                v-if="showDown"
            ></div>
            <div class="content">
                <div>{{ importType && importType.info1 }}</div>
                <div>{{ importType && importType.infoUp }}</div>
                <div class="bodyContent">
                    <img
                        :src="require('assets/inport_up.png')"
                        alt
                    />
                    <div>{{ tipText1 }}</div>
                    <a
                        href="javascript:;"
                        class="upbtn"
                    >
                        <Button
                            class="btnBg"
                            @click="downFile"
                        >上传文件</Button>
                        <input
                            type="file"
                            :accept="inputFormats.toString()"
                            @change="getLocalFile"
                            class="input"
                        />
                    </a>
                </div>
            </div>
        </div>
        <div class="foot">
            <Button
                class="backBtn"
                @click="gotoBack"
            >
                返回
            </Button>
        </div>
    </div>
</template>

<script>
import utilshandler from "bislibs/utils";
import systemhandler from "bislibs/requestHandler/systemhandler";
export default {
    props: {},
    components: {},
    data() {
        return {
            importTypes: {
                1: {
                    info1: "1.下载Excel权限码文档。请到gitlab下载归档的权限码文件，按照格式要求填写数据。",
                    infoUp: "2.上传已填好的Excel文件。请注意是全量上传，操作人保证不要遗漏。",
                    info2: "权限码模板",
                    infoKeys: [
                        "busTypeId",
                        "ue业务类型",
                        "权限编码",
                        "ue页面功能",
                        "roleName"
                    ],
                    templateUrl:
                        "./thirdparty/template/interfaceAuthCodeTemplate.json"
                }
            },
            inputFormats: [".xls", ".xlsx"],
            userInput: {},
            XLSX: null,
            tipText1: "仅支持Excel格式",
            tipText2: "不是标准的权限码数据，无法解析！",
            showDown: false
        };
    },
    computed: {
        //导入的类型，分为 供应商 和 资讯 2类
        importType() {
            return this.importTypes[this.$route.query.type || 1];
        }
    },
    watch: {},
    created() {
        this.XLSX = require("xlsx");
    },
    mounted() {},
    methods: {
        /**
         * 下载模板文件
         */
        downFile() {
            const that = this;
            that.$iLoading.show();

            let fileUrl = that.importType.templateUrl;
            let fileName = that.importType.info2 + ".xlsx";
            utilshandler.downloadFile(fileUrl, fileName);
            setTimeout(() => {
                that.$iLoading.hide();
            }, 1000);
        },
        /**
         * TODO:上传文件，是前端解析Excel在调用接口；
         */
        uploadfile() {
            const that = this;
            let reqData = {};

            let checkRes = that.checkFileInfo();
            if (!!checkRes) {
                utilshandler.showToast(checkRes);
                return;
            }
            reqData.permissions = [];
            this.userInput.forEach((element) => {
                if (
                    element[that.importType.infoKeys[0]] &&
                    element[that.importType.infoKeys[1]]
                ) {
                    let bisObj = {
                        busTypeId: element[that.importType.infoKeys[0]] + "",
                        busTypeName: element[that.importType.infoKeys[1]],
                        permissions: []
                    };
                    reqData.permissions.push(bisObj);
                }
                if (
                    element[that.importType.infoKeys[2]] &&
                    element[that.importType.infoKeys[3]]
                ) {
                    let permisObj = {
                        permissionId: element[that.importType.infoKeys[2]] + "",
                        permissionName: element[that.importType.infoKeys[3]],
                        apiRoles: []
                    };
                    let lastIndex =
                        reqData.permissions.length > 0
                            ? reqData.permissions.length - 1
                            : 0;
                    let permissions =
                        reqData.permissions[lastIndex].permissions;
                    permissions.push(permisObj);
                }
                if (element[that.importType.infoKeys[4]]) {
                    let rolesObj = {
                        roleName: element[that.importType.infoKeys[4]],
                        roleDesc: ""
                    };
                    let lastIndexP =
                        reqData.permissions.length > 0
                            ? reqData.permissions.length - 1
                            : 0;
                    let permissions =
                        reqData.permissions[lastIndexP].permissions;
                    let lastIndexR =
                        permissions.length > 0 ? permissions.length - 1 : 0;
                    let apiRoles = permissions[lastIndexR].apiRoles;
                    apiRoles.push(rolesObj);
                }
            });
            // console.log(JSON.stringify(reqData));
            that.$iLoading.show();
            systemhandler
                .updatePermission(reqData)
                .then((response) => {
                    that.$iLoading.hide();
                    if (response && response.resultCode != 0) {
                        utilshandler.showToast(response.resultMessage);
                    } else {
                        utilshandler.showToast("导入成功");
                        that.gotoBack();
                    }
                })
                .catch(() => {
                    that.$iLoading.hide();
                });
        },
        /**
         * 读取本地文件
         */
        getLocalFile(obj) {
            if (!obj || !obj.currentTarget.files) {
                return;
            }
            const that = this;
            var wb; //读取完成的数据
            var f = obj.currentTarget.files[0];
            //格式校验
            if (
                f.name &&
                f.name.split(".").length > 1 &&
                that.inputFormats.indexOf("." + f.name.split(".")[1]) == -1
            ) {
                utilshandler.showToast(that.tipText1);
                return;
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                wb = that.XLSX.read(data, {
                    type: "binary"
                });
                let strs = JSON.stringify(
                    that.XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
                );
                that.userInput = JSON.parse(strs.replaceAll("\\\\", "")); //去掉转义符号\);
                // console.log("上传完成读取");
                // console.log(JSON.stringify(that.userInput));
                that.$iLoading.hide();
                //发送请求
                that.uploadfile();
            };
            that.$iLoading.show();
            reader.readAsBinaryString(f);
            //默认清空value，否则多次上传一个没反应
            obj.target.value = "";
        },

        checkFileInfo() {
            const that = this;
            let result = "";
            //解析错误
            if (that.userInput && that.userInput.length > 0) {
                for (let i = 0; i < that.userInput.length; i++) {
                    //某条数据没有roleName，说明是没有意义的，应该删除
                    if (!that.userInput[i]["roleName"]) {
                        that.userInput.splice(i, 1);
                        i--;
                    }
                }
                //正常情况，第一条数据是完整的key的数据。校验一下这个数据的key是否是标准数据格式。
                let item = that.userInput[0];
                if (item) {
                    let itemKeys = Object.keys(item);
                    let isFormatData = true;
                    that.importType.infoKeys.forEach((element) => {
                        isFormatData =
                            isFormatData && itemKeys.includes(element);
                    });
                    if (!isFormatData) {
                        result = that.tipText2;
                    }
                } else {
                    result = that.tipText2;
                }
            } else {
                result = "json文件解析错误";
            }

            return result;
        },
        gotoBack() {
            this.$router.go(-1);
        }
    }
};
</script>
<style scoped lang="less">
.contentArea {
    display: flex;
    justify-content: space-around;
    padding: 70px;
    background: white;
    .line {
        width: 2px;
        border-right: 1px dashed #e2e2e2;
        height: 30vh;
        margin-top: 5vh;
    }
    .content {
        width: 20vw;
        text-align: center;
        .bodyContent {
            text-align: center;
            margin-top: 5vh;
            color: #999999;
            img {
                height: 75px;
                width: 65px;
            }
        }
        .upbtn {
            position: relative;
            // cursor: pointer;
            text-decoration: underline;
            color: #478aee;
            font-size: 14px;
            overflow: hidden;
            display: inline-block;
            *display: inline;
            *zoom: 1;
            .btnBg {
                width: 100px;
                margin: 5px;
            }
            .input {
                position: absolute;
                height: 40px;
                width: 100px;
                left: 5px;
                top: 5px;
                opacity: 0;
                filter: alpha(opacity=0);
                cursor: pointer;
            }
        }
        .upbtn:hover {
            text-decoration: none;
        }
    }
}
.foot {
    background: white;
    text-align: center;
    .backBtn {
        background: #e2e2e2;
        color: black;
        width: 91px;
        margin: 0 15px;
        font-size: 14px;
        border: 1px solid #e2e2e2;
    }
}
</style>


