<template>
    <div class="systemConfiguration">
        <div class="head-panel">
            <div>
                <div class="title">商旅配置管理</div>
                <div class="count">当前配置数量：{{page.totalRecord}}</div>
            </div>
            <div
                class="add-btn cursorp"
                @click="toSwitchShow"
            >{{showPageFlag==1?switchBtnStrings[1]:switchBtnStrings[0]}}</div>
        </div>

        <div class="addConfigBox" v-if="showPageFlag==3 || showPageFlag==2">
            <div class="title">{{switchBtn}}</div>
            <div v-if="showPageFlag==3">{{"配置ID:"+configID}}</div>

            <div class="row">
                <div class="left required">配置名称：</div>
                <div class="right">
                    <input type="text" placeholder="请输入配置名称" v-model.trim="formData.key" maxlength="63">
                    <div
                        class="error-msg"
                        v-if="formData.validateMsg.keyErrorMsg"
                    >{{formData.validateMsg.keyErrorMsg}}</div>
                </div>
            </div>
            <div class="row">
                <div class="left required">配置内容：</div>
                <div class="right">
                    <input
                        type="text"
                        placeholder="请输入配置内容"
                        v-model.trim="formData.value"
                        maxlength="255"
                    >
                    <div
                        class="error-msg"
                        v-if="formData.validateMsg.valueErrorMsg"
                    >{{formData.validateMsg.valueErrorMsg}}</div>
                </div>
            </div>
            <div class="InstructionsName" >配置数据JSON格式化</div>
            <div class="rightInstructions">
                <textarea
                    class="descInput"
                    type="text"
                    disabled="disabled"
                    placeholder="输入的JSON格式字符串"
                    v-model="uIConfig"
                ></textarea>
                <div
                    class="error-msg"
                    v-if="formData.validateMsg.instructionsErrorMsg"
                >{{formData.validateMsg.instructionsErrorMsg}}</div>

                <div class="add-btn cursorp" @click="submitConfig">提交</div>
            </div>
        </div>

        <div class="list-container" v-else>
            <template v-if="!loading && !!configList && configList.length>0">
                <div class="table">
                    <div class="head-row">
                        <div cloumn="1">配置名称</div>
                        <div cloumn="8">配置内容</div>
                        <div cloumn="2">操作</div>
                    </div>

                    <div class="table-body">
                        <div class="content-row" v-for="config in configList" :key="config.configKey">
                            <div cloumn="1">
                                <Tooltip :content="config.configKey" placement="bottom" :transfer="true">
                                    <div class="no-wrap">{{config.configKey}}</div>
                                </Tooltip>
                            </div>
                            <div cloumn="8">
                                <Tooltip :content="config.configValue" placement="bottom" :transfer="true">
                                    <div class="no-wrap">{{config.configValue}}</div>
                                </Tooltip>
                            </div>
                            <div cloumn="2" class="operation">
                                <a
                                    href="javascript:void(0);"
                                    class="link-btn edit-btn cursorp"
                                    @click="editConfig(config)"
                                >编辑</a>
                                <div class="delBtnWrapper">
                                    <a
                                        href="javascript:void(0);"
                                        class="link-btn del-btn cursorp"
                                        @click="delConfigDialog(config, true)"
                                    >删除</a>
                                    <div class="dialogShow" v-show="config.isDelDialog">
                                        <div class="title">删除后该配置可能无法使用商旅通服务，确定删除?</div>
                                        <div class="btns">
                                            <span
                                                class="cursorp"
                                                @click.stop="delConfigDialog(config ,false)"
                                            >取消</span>
                                            <span class="cursorp" @click.stop="delConfig(config)">确定</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <page :page="page" @turnPage="turnPage"></page>
            </template>
            <template v-else-if="!loading">
                <div class="empty-message">
                    <i class="icon"></i>
                    您尚未添加商旅配置
                    <!-- <div class="link-add-btn cursorp" @click="toSwitchShow">新增商旅配置</div> -->
                </div>
            </template>
            <div v-else class="loading-container">
                <span>数据加载中...</span>
            </div>
        </div>
    </div>
</template>

<script>
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
import page from "components/page/page";
export default {
    components: {
        page
    },
    data() {
        return {
            loading: false,
            configList: [], //配置列表
            page: {
                //查询条件
                pageSize: 20,
                currPage: 1,
                pageCount: 1,
                totalRecord: 0
            },
            pageFlags: [1, 2, 3], //1显示列表，2新增配置，3编辑配置
            showPageFlag: 1, //显示那个字段
            switchBtnStrings: ["显示配置列表", "新增商旅配置", "编辑商旅配置"],
            switchBtn: !!this.switchBtnStrings ? this.switchBtnStrings[1] : "",
            formData: {
                key: null, //键值对key
                value: null, //键值对value
                validateMsg: {}
            },
            configID: null, //待编辑的配置地址ID,
            uIConfig:null,//页面显示字符串
        };
    },
    activated() {},
    created() {},
    mounted() {
        this.getSysConfigs();
    },
    watch: {
        "formData.key": function(val, oldVal) {
            let that = this;
            if (!!val) {
                delete that.formData.validateMsg["keyErrorMsg"];
            }
            //如果数据不为空了，我们跑一下这个检验
            let oldKey = "",
                oldVaule = "";
            let oldData = JSON.parse(that.uIConfig);
            if (that.uIConfig) {
                for (var key in oldData) {
                    //用javascript的for/in循环遍历对象的属性
                    oldKey = key;
                    oldVaule = oldData[key];
                }
            }
            let inputData = {};
            inputData[val] = oldVaule;
            that.uIConfig = JSON.stringify(inputData);
        },
        "formData.value": function(val, oldVal) {
            let that = this;

            if (!!val) {
                delete that.formData.validateMsg["valueErrorMsg"];
            }
            //如果数据不为空了，我们跑一下这个检验
            let oldKey = "",
                oldVaule = "";
            let oldData = JSON.parse(that.uIConfig);
            if (that.uIConfig) {
                for (var key in oldData) {
                    //用javascript的for/in循环遍历对象的属性
                    oldKey = key;
                    oldVaule = oldData[key];
                }
            }
            let inputData = {};
            inputData[oldKey] = val;
            that.uIConfig = JSON.stringify(inputData);
        }
    },
    methods: {
        submitConfig() {
            const that = this;

            delete that.formData.validateMsg["keyErrorMsg"];
            if (!that.formData.key) {
                that.$set(
                    that.formData.validateMsg,
                    "keyErrorMsg",
                    "请输入配置名称"
                );
                return;
            }

            delete that.formData.validateMsg["valueErrorMsg"];
            if (!that.formData.value) {
                that.$set(
                    that.formData.validateMsg,
                    "valueErrorMsg",
                    "请输入配置内容"
                );
                return;
            }

            delete that.formData.validateMsg["instructionsErrorMsg"];

            let request = JSON.parse(JSON.stringify(that.formData));
            delete request["validateMsg"];
            delete request["config"];


            request = {config:request}

            if (that.showPageFlag == 2) {
                tmHandler
                    .addConfig(request)
                    .then(function(res) {
                        that.loading = false;
                        if (
                            0 == res.resultCode 
                        ) {
                            that.toSwitchShow();
                            that.getSysConfigs();
                        } else {
                            utils.showToast(res.resultMessage || "提交失败");
                        }
                    })
                    .catch(e => {
                        that.loading = false;
                        utils.showToast("提交失败");
                        console.error("提交失败" + e);
                    });
            } else if (that.showPageFlag == 3) {
                request.config.configId = this.configID;
                tmHandler
                    .updateConfig(request)
                    .then(function(res) {
                        that.loading = false;
                        if (
                            0 == res.resultCode
                        ) {
                            that.toSwitchShow();
                            that.getSysConfigs();
                        } else {
                            utils.showToast(res.resultMessage || "提交失败");
                        }
                    })
                    .catch(e => {
                        that.loading = false;
                        utils.showToast("提交失败");
                        console.error("提交失败" + e);
                    });
            }
        },
        /**
         * 判断是不是JSON字符串
         */
        isJSON(str) {
            if (typeof str == "string") {
                try {
                    var obj = JSON.parse(str);
                    if (typeof obj == "object" && obj) {
                        return true;
                    } else {
                        return false;
                    }
                } catch (e) {
                    console.log("error：" + str + "!!!" + e);
                    return false;
                }
            }
            console.log("It is not a string!");
        },
        /**
         * 新增配置
         */
        toSwitchShow() {
            if (this.showPageFlag == this.pageFlags[0]) {
                //如果是列表，切换到新增
                this.showPageFlag = this.pageFlags[1];
                this.switchBtn = this.switchBtnStrings[1];
            } else {
                //如果不是列表页，切换到列表页
                this.showPageFlag = this.pageFlags[0];
                this.switchBtn = this.switchBtnStrings[0];
            }
            //清空输入框数据
            this.uIConfig = null;
            this.formData.key = "";
            this.formData.value = "";
            this.formData.validateMsg = {};
        },

        /**
         * 编辑配置
         */
        editConfig(config) {
            this.showPageFlag = this.pageFlags[2];
            this.switchBtn = this.switchBtnStrings[2];
            //待编辑的输入框数据
            this.uIConfig = null;
            this.formData.key = config.configKey;
            this.formData.value = config.configValue;
            this.configID = config.configId;
            this.formData.validateMsg = {};
        },
        /**
         * 删除配置的弹框操作
         */

        delConfigDialog(config, value) {
            config.isDelDialog = value;
            //需要强制刷新
            this.$forceUpdate();
        },
        /**
         * 删除配置
         */
        delConfig(config) {
            const that = this;
            that.delConfigDialog(config, false);
            // that.loading = true;
            tmHandler
                .deleteConfig({
                    configId: config.configId
                })
                .then(function(res) {
                    that.loading = false;
                    if (0 == res.resultCode) {
                        that.getSysConfigs();
                    } else {
                        utils.showToast(res.resultMessage || "删除失败");
                    }
                })
                .catch(e => {
                    that.loading = false;
                    utils.showToast("删除失败");
                    console.error("删除失败" + e);
                });
        },

        /**
         * 获取配置数据列表
         */
        getSysConfigs() {
            const that = this;
            let data = {
                pageSize: that.page.pageSize,
                pageIndex: that.page.currPage
            };
            that.loading = true;
            tmHandler
                .getConfigList(data)
                // sendHttpRequest4TravelManage("operationservice.getConfigList", data)
                .then(function(res) {
                    that.loading = false;
                    if (0 == res.resultCode && !!res.result) {
                        that.configList = res.result.configs;

                        that.page.totalRecord = res.result.totalElements || 0;
                        that.page.pageCount = res.result.totalPages || 0;
                    }
                })
                .catch(() => {
                    that.loading = false;
                });
        },

        /**
         * 指定页码翻页跳转
         * @param newPageNum 页码
         */
        turnPage(newPageNum) {
            this.page.currPage = parseInt(newPageNum);
            this.getSysConfigs();
        }
    }
};
</script>
<style scoped lang="less">
@import "systemconfig.less";
</style>
<style>
.ivu-tooltip-arrow {
    display: none !important;
}
/* ivu-tooltip-popper ivu-tooltip-dark */
.ivu-tooltip-inner {
    background-color: #fff !important;
    color: #191919 !important;
    border-radius: 2px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    white-space: normal;
    word-break: break-all;    
}
</style>



