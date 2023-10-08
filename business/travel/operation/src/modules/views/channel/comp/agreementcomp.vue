<template>
    <div class="agreementcomp">
        <div
            v-for="(item, index) in agreementArray"
            :key="item.id"
            class="agreement"
        >
            <div class="fullBox">
                <div class="leftBox">协议名称：</div>
                <div class="rightBox rightBoxW">
                    <Input
                        slot="component"
                        v-model.trim="item.name"
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
                <div class="leftBox">上传协议书：</div>
                <div class="rightBox rightBoxW">
                    <uploadfile
                        :uploadUrl="uploadUrl"
                        type="fileShort"
                        :id="index"
                        :defaultList="item.uploadDefault"
                        @onUploadChange="fileUpChange"
                    ></uploadfile>
                </div>
            </div>
        </div>
        <div class="foot" v-if="agreementArray.length < maxSize">
            <Button
                type="dashed"
                style="width: 600px; margin: 10px"
                @click="addItem"
                >+新增协议</Button
            >
        </div>
    </div>
</template>

<script>
const uploadfile = () => import("components/uploadfile/uploadfile.vue");
import utils from "bislibs/utils";

export default {
    props: {
        dataArray: {
            type: Array,
            default: [],
        },
    },
    components: {
        uploadfile,
    },
    data() {
        return {
            uploadUrl: utils.uploadUrl,
            agreementArray: [],
            maxSize: 5, //最大协议数量
        };
    },
    created() {},
    mounted() {},
    watch: {
        /**
         * 父组件传入的参数
         */
        dataArray: {
            handler(val, oldcval) {
                // debugger
                console.log("dataArray.watch" + JSON.stringify(val));
                if (val && val.length > 0) {
                    this.agreementArray = JSON.parse(JSON.stringify(val));
                } else {
                    this.agreementArray = [];
                }
            },
            deep: true,
            immediate: true,
        },
        agreementArray: {
            handler(val, oldcval) {
                if (val && val.length > 0) {
                    this.submit();
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        /**
         * 上传组件的输出，当有文件上传或者删除的时候会自动触发
         */
        fileUpChange(uploadFileList, index) {
            if (uploadFileList && uploadFileList.length > 0) {
                this.agreementArray[index].fileUrl = uploadFileList[0].url;
                this.agreementArray[index].fielName = uploadFileList[0].name;
                // this.agreementArray[index].uploadDefault.push({
                //           name: uploadFileList[0].name,
                //           url: uploadFileList[0].url,
                //       });
                
            } else {
                this.agreementArray[index].fileUrl = "";
                this.agreementArray[index].fielName = "";
                // this.agreementArray[index].uploadDefault = [];
            }
        },
        /**
         * 新增一条item
         */
        addItem() {
            this.agreementArray.push({
                id: "",
                name: "",
                fielName: "",
                fileUrl: "",
                uploadDefault: [],
            });
        },

        /**
         * 删除一条item
         */
        delItem(index) {
            if (index < 0 || index >= this.agreementArray.length) {
                return;
            } else {
                this.agreementArray.splice(index, 1);
            }
        },
        /**
         * 输出input，用于双向绑定的实现。要做组件数据校验
         */
        submit() {
            let result = this.validOutData(this.agreementArray);
            var copyValue = [];
            this.agreementArray &&
                this.agreementArray.forEach((element) => {
                    copyValue.push({
                        // protocolId: element.id,
                        protocolName: element.name,
                        protocolUrl: element.fileUrl,
                    });
                });
            //返回输入数据
            var outData = {
                requestData: {
                    protocolConfigList: copyValue,
                },
                errorMsg: result.errorMsg,
                vaildResult: result.vaildResult, //添加校验结果数据
            };
            // console.log("agreementArr=" + JSON.stringify(copyValue));
            this.$emit("onDataChange", outData); //v-model
        },
        /**
         * 校验输出值
         */
        validOutData(outData) {
            let vaildResult = true;
            let errorMsg = "";

            if (!(outData && Array.isArray(outData))) {
                vaildResult = false;
                errorMsg = "数据错误";
            } else {
                if (outData.length == 1) {
                    if (
                        (outData[0].name && !outData[0].fileUrl) ||
                        (!outData[0].name && outData[0].fileUrl)
                    ) {
                        vaildResult = false;
                        errorMsg = "协议配置请输入协议名称和上传协议书";
                    }
                } else {
                    let eleIndex = outData.findIndex((element) => {
                        return !element.name || !element.fileUrl;
                    });
                    if (eleIndex > -1) {
                        vaildResult = false;
                        errorMsg = "协议配置请输入协议名称或上传协议书";
                    }
                }
            }

            return {
                errorMsg: errorMsg,
                vaildResult: vaildResult,
            };
        },
    },
};
</script>
<style scoped lang="less">
@import "~styles/common.less";
@import "~styles/variables.less";
@import "~styles/mixins/mixins.less";
.agreementcomp {
    background: #fff;
    height: 100%;
    color: #333333;

    .agreement {
        // border: 1px solid #e2e2e2;
        border-radius: 5px;
        background: white;
        margin: 10px 0;

        .delbtn {
            color: red;
            cursor: pointer;
            margin: 8px;
            height: 16px;
            width: 16px;
            background: url(~assets//icon_del.png) no-repeat
                left;
            background-size: contain;
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
                flex: 0 0 130px;
                height: 32px;
                text-align: end;
                line-height: 32px;
                padding-right: 10px;
            }
            .rightBoxW {
                max-width: 80%;
            }
            .rightBox {
                // width: 70vw;
                flex: auto;
                display: flex;
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
    }
    .foot {
        display: flex;
        justify-content: center;
    }
}
</style>