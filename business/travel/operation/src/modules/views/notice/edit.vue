<template>
    <div class="channel-edit-content">
        <header>
            <a class="icon-back" @click="$router.go(-1)"></a>
            <span class="title">{{docTitle}}</span>
        </header>

        <section>
            <div class="editBoxTitle">服务提醒配置</div>

            <div class="row">
                <div class="left required">业务类型：</div>
                <div class="right">
                    <Select
                        v-model.trim="bizTypeSelect"
                        class="protocol"
                        multiple
                        :max-tag-count="0"
                        :max-tag-placeholder="maxTagPlaceholder"
                        :disabled="!!editItemData"
                    >
                        <Option v-for="(item,index) in bizTypes" :key="index" :value="item">
                            <label
                                :class="{'customboxCheck':isSelectCheckItem(item),'customboxNoCheck':!isSelectCheckItem(item)}"
                            >
                                <div class="imgDiv" />
                                {{item.businessTypeDesc}}
                            </label>
                        </Option>
                    </Select>
                </div>
            </div>
            <div class="row">
                <label class="left required">提醒时间：</label>
                <DatePicker
                    type="datetime"
                    id="scheduledBeginTime"
                    placement="bottom-end"
                    placeholder="请选择日期"
                    class="date-picker"
                    :format="dateFormatString"
                    :value="defaultDataStart"
                    :clearable="false"
                    :transfer="true"
                ></DatePicker>
                <span class="date-split">————</span>
                <DatePicker
                    type="datetime"
                    id="scheduledEndTime"
                    placement="bottom-end"
                    placeholder="请选择日期"
                    class="date-picker"
                    :format="dateFormatString"
                    :value="defaultDataEnd"
                    :clearable="false"
                    :transfer="true"
                ></DatePicker>
            </div>
            <div class="row">
                <div class="left required">提醒内容：</div>
                <div class="rightInstructions">
                    <textarea
                        class="descInput"
                        type="text"
                        :placeholder="placeholder4"
                        v-model="formData.remindContent"
                    ></textarea>
                    <div
                        class="error-msg"
                        v-if="formData.validateMsg.remindContentErrorMsg"
                    >{{formData.validateMsg.remindContentErrorMsg}}</div>
                </div>
            </div>
        </section>

        <div class="save-btn cursorp" @click.stop="saveNewData">保存</div>

        <Loading :show="loading" text="正在保存配置，请稍候"></Loading>
    </div>
</template>

<script>
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
import utils from "bislibs/utils";
export default {
    directives: {
        // TransferDom
    },
    components: {        
    },
    data() {
        return {
            loading: false,
            cacheRuleKey: "announcementItem",
            editItemData: null, //编辑的数据
            placeholder1: "请输入提醒时间",
            placeholder2: "起始时间不能晚于当前时间",
            placeholder3: "结束时间不能早于开始时间",
            placeholder4: "请输入提醒内容：不超过2000字",
            placeholder5: "请选择业务类型",
            //表单数据
            formData: {
                businessTypes: -1, //业务
                businessTypeDesc:"",//业务描述
                startRemindTime: null, //开始提醒时间
                endRemindTime: null, //结束提醒时间
                remindContent: null, //提醒内容
                validateMsg: {} //校验结果
            },
            dateFormatString: "yyyy-MM-dd HH:mm",
            defaultDataStart: "",
            defaultDataEnd: "",            
            bizTypes: [], //业务类型数据源
            bizTypeSelect: [] //业务选中的类型
        };
    },
    computed: {
        docTitle: function() {
            return (
                (!!utils.getStorage(this.cacheRuleKey) ? "编辑" : "新增") +
                "服务提醒"
            );
        }
    },
    activated() {},
    created() {
        const that = this;
        document.title = that.docTitle;
    },
    mounted() {
        this.initPageData();
    },
    watch: {
        "formData.remindContent": function(val, oldVal) {
            let that = this;
            //非必填，不需要校验
        },
        bizTypeSelect: function(val, oldVal) {
            let that = this;
            //非必填，不需要校验
            if (!!val && val.length > 0) {
                that.formData.businessTypes = [];
                that.formData.businessTypeDesc = ""
                val.forEach(element => {
                    that.formData.businessTypes.push(parseInt(element.businessType));
                    that.formData.businessTypeDesc += element.businessTypeDesc+"、";
                });
            } else {
                that.formData.businessTypes = -1;
                that.formData.businessTypeDesc = ""
            }
        }
    },
    methods: {
        fillformData() {
            const that = this;
            that.formData.startRemindTime = $(
                "#scheduledBeginTime .ivu-input"
            ).val();
            that.formData.endRemindTime = $(
                "#scheduledEndTime .ivu-input"
            ).val();
        },
        /**
         * 表单校验
         */
        validateForm(data) {
            const that = this;
            let result = true;
            if (!that.editItemData) {
                if (!that.validateFormBizType(data)) {
                    result = false;
                    return result;
                }
            }
            if (!that.validateFormRemindTime(data)) {
                result = false;
                return result;
            }
            if (!that.validateFormRemindContent(data)) {
                result = false;
                return result;
            }
            return result;
        },

        /**
         * 校验RemindContent
         */
        validateFormRemindContent(data) {
            const that = this;
            let result = true;
            if (!data.remindContent) {
                utils.showToast(that.placeholder4);
                result = false;
            } else if (data.remindContent.length > 2000) {
                utils.showToast(that.placeholder4);
                result = false;
            }
            return result;
        },
        /**
         * 校验BizType
         */
        validateFormBizType(data) {
            const that = this;
            let result = true;

            if (data.businessTypes == -1) {
                utils.showToast(that.placeholder5);
                result = false;
            }
            return result;
        },

        /**
         * 检验RemindTime
         */
        validateFormRemindTime(data) {
            const that = this;
            //清空上一次的校验
            // delete that.formData.validateMsg["UaIdRegexErrorMsg"];
            let result = true;
            if (!data.startRemindTime || !data.endRemindTime) {
                utils.showToast(that.placeholder1);
                result = false;
                // } else if (
                //     new Date(new Date().format(that.dateFormatString)) -
                //         new Date(data.startRemindTime) >=
                //     0
                // ) {
                //     utils.showToast(that.placeholder2);
                //     result = false;
            } else if (
                new Date(data.startRemindTime) - new Date(data.endRemindTime) >
                0
            ) {
                utils.showToast(that.placeholder3);
                result = false;
            }
            return result;
        },

        /**
         * 提交表单
         */
        saveNewData() {
            const that = this;
            //日期控件赋值
            that.fillformData();
            //表单校验
            if (!that.validateForm(that.formData)) {
                return;
            }
            //提交的数据结构
            var requestBody = JSON.parse(JSON.stringify(that.formData));
            delete requestBody.validateMsg;

            let defaultErrorMsg = "新增失败";
            if (!!that.editItemData) {
                delete requestBody.businessTypes; //不能编辑类型
                requestBody.remindNo = that.editItemData.remindNo;
                defaultErrorMsg = "更新失败";
                that.loading = true;
                tmHandler
                    .updateServiceReminder(requestBody)
                    .then(function(res) {
                        if (res.resultCode == 0) {
                            that.loading = false;
                            that.$router.go(-1);
                            utils.showToast("保存成功");
                        } else {
                            that.loading = false;
                            utils.showToast(res.resultMessage || defaultErrorMsg);
                        }
                    })
                    .catch(e => {
                        that.loading = false;
                        utils.showToast(defaultErrorMsg);
                    });
            } else {
                that.loading = true;
                tmHandler
                    .addServiceReminder(requestBody)
                    .then(function(res) {
                        if (res.resultCode == 0) {
                            that.loading = false;
                            that.$router.go(-1);
                            utils.showToast("保存成功");
                        } else {
                            that.loading = false;
                            utils.showToast(res.resultMessage || defaultErrorMsg);
                        }
                    })
                    .catch(e => {
                        that.loading = false;
                        utils.showToast(defaultErrorMsg);
                    });
            }
        },
        /**
         * 获取服务名称
         */
        initPageData() {
            let that = this;
            if (!!utils.getStorage(that.cacheRuleKey)) {
                that.editItemData = JSON.parse(
                    utils.getStorage(that.cacheRuleKey)
                );
                //编辑数据赋初值
                that.formData.remindContent = that.editItemData.remindContent;
                that.formData.startRemindTime =
                    that.editItemData.startRemindTime;
                that.formData.endRemindTime = that.editItemData.endRemindTime;

                that.defaultDataStart = that.formData.startRemindTime,
                that.defaultDataEnd = that.formData.endRemindTime,                
                that.getAllBizTypes(true);
            } else {
                that.defaultDataStart = new Date().format("yyyy-MM-dd") + " 00:00",
                that.defaultDataEnd = new Date().format("yyyy-MM-dd") + " 23:59",
                that.getAllBizTypes(false);
            }
        },
        /**
         * 查询商旅通业务类型列表
         */
        getAllBizTypes(fromUpdata) {
            let that = this;
            tmHandler.getBusinessType().then(res => {
                if (
                    0 == res.resultCode &&
                    !!res.result.businessTypes &&
                    res.result.businessTypes.length > 0
                ) {
                    that.bizTypes = res.result.businessTypes;

                    if (fromUpdata) {
                        //业务类型拼接一个数据类型
                        var displayType = that.editItemData.businessType;
                        that.bizTypeSelect = [];
                        for (let j = 0; j < displayType.length; j++) {
                            var bsType = displayType[j];
                            for (let i = 0; i < that.bizTypes.length; i++) {
                                if (that.bizTypes[i].businessType == bsType) {
                                    that.bizTypeSelect.push(that.bizTypes[i]);
                                    i = that.bizTypes.length;
                                }
                            }
                        }
                    }
                }
            });
        },
        /**
         * 多选的结果展示
         */
        maxTagPlaceholder(num) {
            const that = this;
            var res = "";
            let maxSize = 3;
            let listLength = Math.min(maxSize, that.bizTypeSelect.length);
            for (var i = 0; i < listLength; i++) {
                // ;
                res += that.bizTypeSelect[i].businessTypeDesc;
                res += i == listLength - 1 ? "" : "、";
            }
            // console.log(res);
            if (res.length > 9 || that.bizTypeSelect.length > maxSize) {
                res = res.substring(0, 9) + "...";
            }
            return res;
        },
        /**
         * 某一个条件是否被选中
         */
        isSelectCheckItem(item) {
            return this.bizTypeSelect.indexOf(item) != -1;
        }
    }
};
</script>
<style scoped lang="less">
@import "edit.less";

.firstLine {
    float: left;
    display: flex;
    align-items: center;

    .itemName {
        margin: 5px 0px;
        display: flex;

        img {
            height: 16px;
            width: 16px;
            margin: 5px;
        }
    }

    .itemIcon {
        height: 16px;
        width: 16px;
        margin: 0px 10px;
    }

    .check {
        background: url(~assets//icon_check.png)
            0 center no-repeat transparent;
    }

    .uncheck {
        background: url(~assets//icon_uncheck.png)
            0 center no-repeat transparent;
    }

    .protocol {
        width: 100px;
    }
}

.modesErrorMsg {
    color: #f83939;
    padding-left: 10px;
    margin-top: -31px;
    font-size: 12px;
    line-height: initial;
    margin-left: 310px;
    margin-bottom: 30px;
}
.serviceError {
    color: #f83939;
    padding-left: 10px;
    margin-top: 15px;
    margin-left: 308px;
    font-size: 12px;
    line-height: initial;
}
</style>
<style>
@import "~styles/myiview.less";
</style>