<template>
    <div class="marketPage">
        <div class="header">
            <div>
                <div class="title">服务提醒</div>
                <div class="count">当前服务提醒数量：{{page.totalRecord}}</div>
            </div>
            <div class="add-btn cursorp" @click="editNotifyRule()">新增服务提醒</div>
        </div>
        <div class="listRegion">
            <div class="notifySearch">
                <div class="notifyName">小应用：</div>
                <div class="notifySelete">
                    <Select v-model="businessModel" clearable>
                        <Option
                            v-for="item in businessTypes"
                            :key="item.businessType"
                            :value="item.businessType"
                        >{{ item.businessTypeDesc }}</Option>
                    </Select>
                </div>
                <div class="notifySearchBtn">
                    <button @click="searchNotify()">查询</button>
                </div>
            </div>
            <div v-if="isLoadData" class="loading-container">
                <span>数据加载中...</span>
            </div>
            <div v-else class="list">
                <div class="listTitle">
                    <div
                        class="listTitleCell"
                        v-for="(item) in listTitles"
                        :key="item.name"
                    >{{item.name}}</div>
                </div>
                <div class="empty-message" v-if="!notifyList || notifyList.length==0">
                    <i class="icon"></i> 未找到符合要求的信息，请重新查询
                </div>
                <div
                    class="listItem cursorp"
                    v-for="(item,index) in notifyList"
                    :key="item.remindNo"
                >
                    <div class="itemFirstLine">
                        <div class="itemFirstLineCell">{{index+1}}</div>
                        <div
                            class="itemFirstLineCell"
                            :title="item.businessTypeDesc"
                        >{{item.businessTypeDesc}}</div>
                        <div
                            class="itemFirstLineCell"
                        >{{item.startRemindTime+"到" +item.endRemindTime}}</div>
                        <div
                            class="itemFirstLineCell"
                            :title="item.remindContent"
                        >{{item.remindContent}}</div>
                        <div class="itemFirstLineCell">
                            <Button
                                type="primary"
                                class="notifyEdit"
                                @click.stop="editNotifyRule(item)"
                            >修改</Button>
                            <div class="dialogWrap">
                                <Button
                                    type="error"
                                    class="notifyDelet"
                                    @click.stop="delNotifyRule(item, true, $event)"
                                >删除</Button>
                                <div class="dialogShow" v-show="item.isDelDialog">
                                    <div class="title">确认删除该服务提醒?</div>
                                    <div class="btns">
                                        <span
                                            class="cursorp"
                                            @click.stop="delNotifyRule(item ,false, $event)"
                                        >取消</span>
                                        <span class="cursorp" @click.stop="delNotify(item)">确定</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <page :page="page" @turnPage="turnPage" v-if="notifyList && notifyList.length>0"></page>
            </div>
        </div>
        <Loading :show="loading" text="加载中，请稍候"></Loading>
    </div>
</template>

<script>
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
import utils from "bislibs/utils";
import page from "components/page/page";

export default {
    directives: {
    },
    components: {
        page,
    },
    data() {
        return {
            cacheRuleItem: "announcementItem",
            listTitles: [
                {
                    name: "编码"
                },
                {
                    name: "提醒的小应用"
                },
                {
                    name: "提醒时间"
                },
                {
                    name: "提醒内容"
                },
                {
                    name: "操作"
                }
            ],
            notifyList: [],
            //查询条件 end
            page: {
                pageSize: 20,
                currPage: 1,
                pageCount: 1,
                totalRecord: 0
            },
            isLoadData: true, //是否是显示加载框
            loading: false, //删除时候的弹出的加载框
            businessTypes: [],
            businessModel: -1 //类型选择
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.getDataList();
        this.getAllBizTypes();        
    },
    methods: {
        //分页获取通知规则数据
        getDataList(bizTypeName) {
            let that = this;
            let request = {
                pageSize: that.page.pageSize,
                pageIndex: that.page.currPage
            };

            if (bizTypeName != -1) {
                request.businessType = bizTypeName;
            }
            //页面查询的时候，提示正在加载中
            that.isLoadData = true;
            tmHandler.selectServiceReminder(request).then(
                function(res) {
                    that.isLoadData = false;
                    if (0 == res.resultCode && !!res.result.serviceList) {
                        that.page.totalRecord =
                            res.result.totalRecord || res.result.serviceList.length;
                        that.page.pageCount = res.result.totalPageCount || 1;
                        let tempArray = res.result.serviceList;
                        //统一添加属性isDelDialog
                        for (let i = 0; i < tempArray.length; i++) {
                            tempArray[i].isDelDialog = false;
                        }
                        that.notifyList = tempArray;
                    } else {
                        utils.showToast(res.resultMessage);
                        that.notifyList && that.notifyList.splice(0);
                    }
                },
                function(error) {
                    that.isLoadData = false;
                    that.notifyList && that.notifyList.splice(0);
                }
            );
        },
        /**
         * 指定页码翻页跳转
         * @param newPageNum 页码
         */
        turnPage(newPageNum) {
            this.page.currPage = parseInt(newPageNum);
            this.getDataList(this.businessModel);
        },
        /**
         * 修改通知规则
         */
        editNotifyRule(item) {
            if (!!item) {
                //修改
                utils.setStorage(this.cacheRuleItem, JSON.stringify(item));
                this.$router.push({
                    path: "/notice/editReminder"
                });
            } else {
                //新增
                utils.removeStorage(this.cacheRuleItem);
                this.$router.push({
                        path: "/notice/addReminder"
                    });        
            }
        },
        /**
         * 删除通知规则的弹框操作
         */
        delNotifyRule(item, value, event) {
            const that = this;
            item.isDelDialog = value;
            for (var i = 0; i < that.notifyList.length; i++) {
                if (that.notifyList[i].remindNo != item.remindNo) {
                    that.notifyList[i].isDelDialog = false;
                }
            }
            //需要强制刷新
            that.$forceUpdate();
        },
        /**
         * 删除通知规则
         */
        delNotify(item) {
            const that = this;
            that.delNotifyRule(item, false);
            that.loading = true;
            tmHandler
                .deleteServiceReminder({
                        remindNo: item.remindNo
                })
                .then(function(res) {
                    that.loading = false;
                    if (0 == res.resultCode) {
                        that.businessModel = -1;//删除的时候，全局搜索，选择框置空
                        that.getDataList();
                        that.$forceUpdate();
                    } else {
                        utils.showToast(res.resultMessage || "删除失败");
                    }
                })
                .catch(e => {
                    that.loading = false;
                    utils.showToast("删除失败");
                });
        },
        /**
         * 查询商旅通业务类型列表
         */
        getAllBizTypes() {
            let that = this;
            tmHandler
                .getBusinessType()
                .then(res => {
                    if (
                        0 == res.resultCode &&
                        !!res.result.businessTypes &&
                        res.result.businessTypes.length > 0
                    ) {
                        that.businessTypes = res.result.businessTypes;
                        // "";
                        // that.businessModel = that.businessTypes[0].businessType;
                    }
                })
                .catch(e => {
                    console.log(e);
                });
        },
        /**
         * 查询上报服务
         */
        searchNotify() {
            let that = this;
            //每次点击按妞查询，需要翻页重置
            that.page.currPage = 1;

            that.getDataList(that.businessModel);
        }
    }
};
</script>
<style scoped lang="less">
@import "list.less";
</style>
