<template>
    <div class="agreementSummary">
        <div class="fullBox">
            <div class="leftBox required">
                {{ "获取信息摘要：" }}
            </div>
            <div class="rightBox">
                <div
                    :id="'editorElemToolbar' + agreePos"
                    class="editorElemToolbar"
                ></div>
                <div
                    :id="'editorElemContent' + agreePos"
                    class="editorElemContent"
                ></div>
            </div>
        </div>
    </div>
</template>

<script>
import E from "wangeditor";
var defaultSummaryTip = "请输入摘要内容";
export default {
    props: {
        inputData: {
            //页面操作数据
            type: [Object, String],
            required: true,
            default: function () {
                return { summaryList: [] };
            }
        },
        agreePos: {
            type: [Number],
            default: function () {
                return 0;
            }
        },
        value: {
            //v-model
            type: [Object, String],
            default: ""
        }
    },
    directives: {
        // TransferDom
    },
    components: {
        // Loading
    },
    data() {
        return {
            editorComp: null, //编辑框组件
            formData: {
                summaryList: [] //摘要信息
            },
            errorDataSummary: "", //摘要的错误提示信息
            defaultSummary: defaultSummaryTip,
            summaryList: []
        };
    },
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
                    //摘要的初始化
                    if (val && !!val.summaryList) {
                        //给摘要输入框赋值，需要延期300毫秒，否则会出现watch多跑一次的问题  //赋初值
                        that.formData.summaryList = val.summaryList;
                        that.editorComp &&
                            that.editorComp.txt.html(
                                that.formData.summaryList[0]
                            );
                        console.log("watch.inputData");
                    }
                }
            },
            deep: true,
            immediate: true
        },

        "formData.summaryList": {
            handler() {
                //摘要输入框内容发生变化，调用一次校验，然后输出一次组件数据
                this.validFormData();
            },
            deep: true
        }
    },
    methods: {
        initData() {
            console.log("initData");
            const that = this;
            this.editorComp = new E(
                "#editorElemContent" + this.agreePos,
                "#editorElemToolbar" + this.agreePos
            );
            // ;
            // 关闭粘贴样式的过滤
            // this.editorComp.config.pasteFilterStyle = false;
            this.editorComp.config.placeholder = "请输入信息摘要";
            this.editorComp.config.zIndex = 500

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
                "justify" // 对齐方式
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
                "#ffffff"
            ];

            // 把这个html通过submit的方法传入父组件
            this.editorComp.config.onchange = (html) => {
                that.formData.summaryList = [html];
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

            this.editorComp.txt.html(this.formData.summaryList[0]);            
        },
        //校验表单数据
        validFormData() {
            let result = true;
            //校验 摘要
            result = this.validFormDataSummary();
            let errorMsg = this.errorDataSummary;
            //提交一次数据
            this.submit(true, result, errorMsg);
            return result;
        },
        //校验摘要
        validFormDataSummary() {
            let result = true;
            // console.log("validFormDataSummary")
            //校验摘要内容
            var summaryList = this.formData.summaryList;
            //摘要的校验要求是 至少有一条数据就可以。
            if (!!summaryList && summaryList.length > 0) {
                for (let i = 0; i < summaryList.length; i++) {
                    if (!!summaryList[i]) {
                        result = true;
                        break;
                    } else {
                        result = false;
                    }
                }
            } else {
                result = false;
            }
            if (!result) {
                this.errorDataSummary = "请输入至少一条摘要";
                // showToast(this.errorDataSummary);
            } else {
                this.errorDataSummary = "";
            }
            return result;
        },

        /**
         * fromValid 来自校验方法？
         */
        submit(fromValid, vaildResult, errorMsg) {
            var requestBody = JSON.parse(JSON.stringify(this.formData));
            //将摘要里面的空数组删除掉
            for (let i = 0; i < requestBody.summaryList.length; i++) {
                if (!requestBody.summaryList[i]) {
                    requestBody.summaryList.splice(i, 1);
                    i--;
                }
            }
            //返回输入数据
            var outData = {
                modelData: requestBody,
                errorMsg: errorMsg,
                vaildResult: vaildResult //添加校验结果数据
            };

            // console.log(outData);
            this.$emit("input", outData); //v-model
        }
    }
};
</script>
<style scoped lang="less">
.agreementSummary {
    //   margin-left: 10px;
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
        margin-top: 8px;
        .required:before {
            content: "*";
            color: red;
            font-size: 12px;
            margin-right: 4px;
        }
        .leftBox {
            flex: 0 0 120px;
            text-align: right;
            height: 32px;
            line-height: 32px;
            margin-right: 4px;
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
                border: 1px solid #dcdfe6;
                border-radius: 4px;
                height: 40px;
                line-height: 40px;
                padding-left: 10px;
                font-size: 14px;
                color: #606266;
                width: 402px;
                /* 使用webkit内核的浏览器 */
                &::-webkit-input-placeholder {
                    font-size: 12px;
                    color: #dcdfe6;
                }
                /* Firefox版本4-18 */
                &:-moz-placeholder {
                    font-size: 12px;
                }
                /* Firefox版本19+ */
                &::-moz-placeholder {
                    font-size: 12px;
                    color: #dcdfe6;
                }
                /* IE浏览器 */
                &:-ms-input-placeholder {
                    font-size: 12px;
                    color: #dcdfe6;
                }
            }
        }
    }
    .error-msg {
        color: red;
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