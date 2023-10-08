<template>
    <div class="channelFormSLA">
        <div class="fullBox">
            <div class="leftBox">协议名称：</div>
            <div class="rightBox rightBoxW">
                <Input
                    slot="component"
                    v-model.trim="formData.protocolName"
                    clearable
                    maxlength="50"
                    placeholder="请输入协议名称"
                    style="width: 350px"
                />
                <div
                    v-if="index > 0"
                    class="delbtn"
                    @click="delItem(index)"
                ></div>
            </div>
        </div>
        <div class="fullBox">
            <div class="leftBox">获取信息摘要：</div>
            <div class="rightBox rightBoxW">
                <div id="editorElemToolbar" class="editorElemToolbar"></div>
                <div id="editorElemContent" class="editorElemContent"></div>
                <!-- <div class="error-msg" v-if="errorDataLA">{{errorDataLA}}</div> -->
            </div>
        </div>
        <div class="fullBox">
            <div class="leftBox">上传协议书：</div>
            <div class="rightBox rightBoxW">
                <uploadfile
                    :uploadUrl="uploadUrl"
                    type="fileShort"
                    :defaultList="uploadDefault"
                    @onUploadChange="uploadChange"
                ></uploadfile>
                <!-- <div class="error-msg" v-if="errorDataLA">{{errorDataLA}}</div> -->
            </div>
        </div>
    </div>
</template>

<script>
// import uploadfile from "components/uploadfile/uploadfile.vue";
const uploadfile = () => import("components/uploadfile/uploadfile.vue");
import E from "wangeditor";
import utils from "bislibs/utils";

export default {
    props: {
        inputData: {
            //页面操作数据
            type: [Object, String],
            required: true,
            default: { protocolName: "", protocolUrl: "", protocolSummary: "" },
        },
        value: {
            //v-model
            type: String,
            default: "",
        },
    },
    directives: {
        // TransferDom
    },
    components: {
        // Loading
        uploadfile,
    },
    data() {
        return {
            uploadUrl: utils.uploadUrl,
            uploadDefault: [], //上传默认数据
            editorComp: null, //编辑框组件
            formData: {
                protocolUrl: "", //协议内容
                protocolSummary: "", //摘要信息
                protocolName: "", //协议名字
            },
            errorDataLA: "", //协议的错误提示信息
            errorDataSummary: "", //摘要的错误提示信息
            protocolSummary: "",
            defaultProtocolName: "请输入协议名字", //编辑框的内容
            defaultProtocol: "请上传协议文档", //编辑框的内容
            defaultContent: "请输入摘要内容", //编辑框的内容
            defaultContent2: "字符长度已超过最大限制", //编辑框的内容
            emptyContent: "<p><br></p>", //协议内容为空的一种取值
        };
    },
    computed: {},
    activated() {},
    created() {},
    mounted() {
        this.initData();
    },
    watch: {
        /**
         * 父组件传入的参数
         */
        inputData: {
            handler(val, oldcval) {
                //协议的初始化
                const that = this;
                if (val != oldcval) {
                    // "";
                    //名字的初始化
                    if (val && !!val.protocolName) {
                        this.formData.protocolName = val.protocolName;
                    }
                    //摘要的初始化
                    if (val && !!val.protocolSummary) {
                        this.formData.protocolSummary = val.protocolSummary;
                        setTimeout(function () {
                            //给摘要输入框赋值，需要延期300毫秒，否则会出现watch多跑一次的问题
                            that.editorComp &&
                                that.editorComp.txt.html(val.protocolSummary);
                            that.editorComp &&
                                that.editorComp.change &&
                                that.editorComp.change();
                            // console.log("setTimeout.protocolSummary");
                        }, 300);
                    }
                    //协议书PDF的地址
                    if (val && !!val.protocolUrl) {
                        this.formData.protocolUrl = val.protocolUrl;
                        this.uploadDefault.push({
                            name: this.formData.protocolUrl.substr(
                                (this.formData.protocolUrl.lastIndexOf("/") ||
                                    0) + 1
                            ),
                            url: this.formData.protocolUrl,
                        });
                    }
                }
            },
            deep: true,
            immediate: true,
        },

        formData: {
            handler(val, oldcval) {
                //摘要输入框内容发生变化，调用一次校验，然后输出一次组件数据
                this.validFormData();
            },
            deep: true,
        },
    },
    methods: {
        //校验表单数据
        validFormData() {
            let result = true;
            // ""
            //校验 摘要和 协议，必须都通过，才是校验成功
            result =
                this.validEmptyData() ||
                (this.validFormDataSummary() &&
                    this.validFormDataLA() &&
                    this.validFormDataName());
            let errorMsg = "服务授权请同时输入名字、摘要和协议";
            //提交一次数据
            this.submit(true, result, errorMsg);
            return result;
        },
        //新增校验条件，是否都为空
        validEmptyData() {
            return (
                !this.validFormDataSummary() &&
                this.formData.protocolUrl == "" &&
                this.formData.protocolName == ""
            );
        },
        //校验摘要
        validFormDataSummary() {
            let result = true;
            // console.log("validFormDataSummary")
            //校验摘要内容
            var protocolSummary = this.formData.protocolSummary;
            if (protocolSummary == this.emptyContent || protocolSummary == "") {
                this.errorDataLA = this.defaultContent;
                // errorMsg = this.errorDataLA
                // utils.showToast(this.errorDataLA);
                result = false;
            } else if (this.getBLength(protocolSummary) > 50000) {
                this.errorDataLA = this.defaultContent2;
                // errorMsg = this.errorDataLA
                // utils.showToast(this.errorDataLA);
                result = false;
            } else {
                this.errorDataLA = "";
            }
            return result;
        },
        //校验协议内容
        validFormDataLA() {
            let result = true;
            // ""
            //校验协议内容
            var content = this.formData.protocolUrl;
            // var text = this.editorComp ? this.editorComp.txt.text() : content;
            if (content == "") {
                this.errorDataLA = this.defaultProtocol;
                // errorMsg = this.errorDataLA
                // utils.showToast(this.errorDataLA);
                result = false;
            } else {
                this.errorDataLA = "";
            }
            return result;
        },
        //校验名字
        validFormDataName() {
            let result = true;
            // ""
            //校验协议内容
            var content = this.formData.protocolName;
            // var text = this.editorComp ? this.editorComp.txt.text() : content;
            if (content == "") {
                this.errorDataLA = this.defaultProtocolName;
                // errorMsg = this.errorDataLA
                // utils.showToast(this.errorDataLA);
                result = false;
            } else {
                this.errorDataLA = "";
            }
            return result;
        },
        /**
         * fromValid 来自校验方法？
         */
        submit(fromValid, vaildResult, errorMsg) {
            // "";
            var requestBody = JSON.parse(JSON.stringify(this.formData));
            //处理协议摘要为空
            if (requestBody.protocolSummary == this.emptyContent) {
                requestBody.protocolSummary = "";
            }

            //返回输入数据
            var outData = {
                requestData: {
                    channelProtocol: requestBody,
                },
                errorMsg: errorMsg,
                vaildResult: vaildResult, //添加校验结果数据
            };

            // console.log(outData);
            this.$emit("input", outData); //v-model
        },
        initData() {
            const that = this;
            this.editorComp = new E("#editorElemContent", "#editorElemToolbar");
            // 关闭粘贴样式的过滤
            // this.editorComp.config.pasteFilterStyle = false;
            this.editorComp.config.menus = [
                // 菜单配置
                "fontSize", // 字号
                "foreColor", // 文字颜色
                // "backColor", // 背景颜色
                // "head", // 标题
                "bold", // 粗体
                "italic", // 斜体
                "underline", // 下划线
                "strikeThrough", // 删除线
                "list", // 列表
                "justify", // 对齐方式
                // "fontName", // 字体
                // "link", // 插入链接
                // "quote", // 引用
                // "emoticon", // 表情
                // "image", // 插入图片
                // "table", // 表格
                // "code", // 插入代码
                // "undo", // 撤销
                // "redo" // 重复
            ];
            // 自定义配置颜色（字体颜色、背景色）
            this.editorComp.config.colors = [
                "#000000",
                "#1c487f",
                "#191919",
                "#23c7ad",

                "#25cb67",
                "#333333",
                "#3864A7",
                "#407cd6",

                "#4d80bf",
                "#46acc8",
                "#478aee",
                "#666666",

                "#7b5ba1",
                "#8baa4a",
                "#999999",
                "#a9a9a9",

                "#b2b2b2",
                "#B5d0f9",
                "#c2c2c2",
                "#c24f4a",

                "#cccccc",
                "#d7d7d7",
                "#e7e7e7",
                "#eeece0",

                "#ecf3fd",
                "#e5e5e5",
                "#f9963b",
                "#f2f3f5",

                "#f25e3d",
                "#f83939",
                "#f8a339",
                "#ff4e4e",

                "#ff8b03",
                "#ffebeb",
                "#ffffff",
            ];

            // 把这个html通过submit的方法传入父组件
            this.editorComp.config.onchange = (html) => {
                that.formData.protocolSummary = html;
                // that.validFormData();
            };
            // 下面是最重要的的方法
            // his.editorComp.config.uploadImgServer = "你的上传图片的接口";
            // this.editorComp.config.uploadFileName = "你自定义的文件名";
            // this.editorComp.config.uploadImgHooks = {
            //     before: function(xhr, editorComp, files) {
            //         // 图片上传之前触发
            //         // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
            //         // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
            //         // return {
            //         //     prevent: true,
            //         //     msg: '放弃上传'
            //         // }
            //     },
            //     success: function(xhr, editorComp, result) {
            //         // 图片上传并返回结果，图片插入成功之后触发
            //         // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            //         this.imgUrl = Object.values(result.result).toString();
            //     },
            //     fail: function(xhr, editorComp, result) {
            //         // 图片上传并返回结果，但图片插入错误时触发
            //         // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            //     },
            //     error: function(xhr, editorComp) {
            //         // 图片上传出错时触发
            //         // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
            //     },
            //     timeout: function(xhr, editorComp) {
            //         // 图片上传超时时触发
            //         // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
            //     },

            //     // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
            //     // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
            //     customInsert: function(insertImg, result, editorComp) {
            //         // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
            //         // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

            //         // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
            //         let url = Object.values(result.result); // result.data就是服务器返回的图片名字和链接
            //         JSON.stringify(url); // 在这里转成JSON格式
            //         insertImg(url);
            //         // result 必须是一个 JSON 格式字符串！！！否则报错
            //     }
            // };

            this.editorComp.create(); // 创建富文本实例
        },
        /**
         * 获取字符串字节数
         * @param {Object} str
         * @return {Object} realLength
         */
        getBLength(str) {
            var realLength = 0;
            var len = str.length;
            // return len;
            var charCode = -1;
            for (var i = 0; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128) {
                    realLength += 1;
                } else {
                    realLength += 2;
                }
            }
            return realLength;
        },
        /**
         * 上传组件的输出，当有文件上传或者删除的时候会自动触发
         */
        uploadChange(uploadFileList, index) {
            if (uploadFileList && uploadFileList.length > 0) {
                this.formData.protocolUrl = uploadFileList[0].url;
            } else {
                this.formData.protocolUrl = "";
            }
        },
    },
};
</script>
<style scoped lang="less">
@import "~styles/common.less";
@import "~styles/variables.less";
@import "~styles/mixins/mixins.less";

* {
    box-sizing: border-box;
    color: @font-color;
}

.channelFormSLA {
    margin-left: 10px;
    background: #fff;
    height: 100%;
    color: #333333;

    .addBtn {
        width: 70px;
        height: 32px;
        line-height: 32px;
        background: #478aee;
        color: #fff;
        text-align: center;
        border-radius: 4px;
        margin-left: 5px;
        cursor: pointer;
    }

    .fullBox {
        display: flex;
        margin-bottom: 10px;
        .required:before {
            content: "*";
            color: @font-red-color;
            font-size: 12px;
            margin-right: 6px;
        }
        .leftBox {
            flex: 0 0 120px;
            text-align: right;
            height: 32px;
            line-height: 32px;
            padding-right: 10px;
        }
        .rightBoxW {
            max-width: 80%;
        }
        .rightBox {
            // width: 70vw;
            flex: auto;
            .inputline1 {
                display: flex;
                // width: 35vw;
            }
            .editorSpace {
                padding: 0;
                color: #ccc;
            }
            .editorElemToolbar {
                border: 1px solid #e2e2e2;
                // border-radius: 4px;
                height: 150px;
                // width: 35vw;
            }
            .editorElemContent {
                border: 1px solid #e2e2e2;
                border-top: none;
                // border-radius: 4px;
                // width: 35vw;
            }
            input {
                border: 1px solid @border;
                border-radius: 2px;
                height: 32px;
                line-height: 32px;
                padding-left: 10px;
                font-size: 14px;
                color: #333;
                /* 使用webkit内核的浏览器 */
                &::-webkit-input-placeholder {
                    font-size: 12px;
                    color: #999;
                }
                /* Firefox版本4-18 */
                &:-moz-placeholder {
                    font-size: 12px;
                }
                /* Firefox版本19+ */
                &::-moz-placeholder {
                    font-size: 12px;
                    color: #999;
                }
                /* IE浏览器 */
                &:-ms-input-placeholder {
                    font-size: 12px;
                    color: #999;
                }
            }
        }
    }
    .error-msg {
        color: @font-red-color;
        padding-left: 10px;
        margin-top: 6px;
        font-size: 12px;
        line-height: initial;
    }
    .outline {
        margin-left: 150px;
        margin-bottom: 10px;
    }
}
</style>

<style lang="less">
.channel-edit-content .ivu-select-placeholder {
    font-size: 12px !important;
    color: #999 !important;
}
.el-input {
    height: 32px !important;
}
.el-input__icon {
    line-height: initial !important;
}
.channel-edit-content .el-input__inner {
    color: #333333;
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    padding-left: 12px;
}
.channel-edit-content .el-input__inner::-webkit-input-placeholder {
    color: #999999;
}
.channel-edit-content .el-input__inner::-moz-placeholder {
    color: #999999;
}
.channel-edit-content .el-input__inner:-ms-input-placeholder {
    color: #999999;
}
</style>

