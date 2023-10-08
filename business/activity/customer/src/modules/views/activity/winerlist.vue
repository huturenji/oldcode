<template>
    <div class="card_box">
        <headBreadcrumb
            title="中奖名单"
            btnName="导出"
            showbtn="true"
            type="default"
            @goback="goback"
            @tabClick="exportWinnerList"
        ></headBreadcrumb>
        <el-table
            :data="listData"
            :header-cell-style="{ background: '#f2f2f2',color:'#1D2129',height:'40px' }"
            stripe
            >
            <el-table-column
            align="center"
            prop="index"
            label="序号">
            </el-table-column>
            <el-table-column
            align="center"
            prop="userName"
            label="中奖人"
            >
            <template slot-scope="scope">
                <span>{{scope.row.userName || "佚名"}}</span>
            </template>
            </el-table-column>
            <el-table-column
            align="center"
            prop="prizeName"
            label="奖品名称">
            </el-table-column>
            <el-table-column
            align="center"
            prop="createTime"
            label="中奖时间"
            :formatter="dateFmt"
            >
            </el-table-column>
            <el-table-column
            align="center"
            prop="receiverAddress"
            label="邮寄地址">
             <template slot-scope="scope">
                <div v-if="scope.row.receiverAddress" style="text-align:left">
                    <div>{{scope.row.receiverName}}&nbsp;&nbsp;{{scope.row.receiverPhone}}</div>
                    <div>{{scope.row.receiverAddress}}</div>
                </div>
                <div v-else>
                    --
                </div>
            </template>
            </el-table-column>
           
        </el-table>
        <el-pagination
            class="page"
            background
            @size-change="getSupplierList"
            @current-change="getSupplierList"
            :current-page.sync="pageObj.currPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size.sync="pageObj.pageSize"
            layout=" total,prev, pager, next, jumper, sizes"
            :total="pageObj.totalRecord">
        </el-pagination>
    </div>
</template>

<script>
import { utils } from "opcl";
import apihandler from "bislibs/requestHandler/activityhandler";
const headBreadcrumb = () => import("biscomponents/activity/head-breadcrumb.vue");
export default {
    components: {
        headBreadcrumb
    },
    data() {
        const that = this;
        return {
            userInput: {
                activityId: this.$route.query.activityId||utils.getStorage("customer_activityId"),
                channelId: "",
                userId: apihandler.userInfo.userId,
                companyId: "",
                sorts: []
            },
            pageObj: {
                pageSize: 10,
                currPage: 1,
                totalRecord: 0,
                totalPages:1
            },
            listData: []
        };
    },
    watch: {},
    created() {},
    mounted() {          
        this.getSupplierList();
    },
    methods: {
        //获取列表数据
        getPageData(reqData) {
            const that = this;
            that.$iLoading.show();
            apihandler
                .winnerList(reqData)
                .then((response) => {
                    if (
                        response.resultCode == 0 &&
                        response.result &&
                        response.result.list
                    ) {

                        that.listData = []
                        let tempData = response.result.list
                        that.pageObj = {
                            pageSize: response.result.pageSize,
                            currPage: response.result.pageIndex,
                            totalRecord: response.result.total,
                            totalPages:response.result.pageCount
                        }
                        tempData.forEach((item,index) => {
                            that.listData.push({
                                ...item,
                                "index":that.pageObj.pageSize*(response.result.pageIndex-1)+index+1
                            })
                        });
                    }
                })
                .catch((e) => {
                    console.log(e)
                }).finally(() => {
                    that.$iLoading.hide();
                });
        },
        /**
         * 校验参数并且发送请求
         */
        getSupplierList() {
            let that = this
            let reqData = JSON.parse(JSON.stringify(that.userInput));
            reqData["pageSize"] = that.pageObj.pageSize
            reqData["pageIndex"] = that.pageObj.currPage
            //发送请求 TODO
            that.getPageData(reqData);
        },
        
        goback(){
            this.$router.go(-1);
        },
        //导出中奖名单
        exportWinnerList(){
            let that = this
            let reqData = JSON.parse(JSON.stringify(that.userInput));
            reqData["pageSize"] = that.pageObj.pageSize
            reqData["pageIndex"] = that.pageObj.currPage
            that.$iLoading.show();
            apihandler.winnerListExport(reqData)
            .then((response) => {
                if (response && response.resultCode == "0") {
                    let durl = response.result;
                    utils.downloadFile(durl, "中奖名单.xlsx");
                }else{
                    utils.showToast("导出文件失败");
                }
            })
            .catch((e) => {
                console.log(e)
            }).finally(() => {
                that.$iLoading.hide();
            });
        },
        /**
         * 格式化日期
        */
        dateFmt(row, column, cellValue){
            let startDate = new Date(cellValue);
            return startDate?startDate.format('yyyy/MM/dd HH:mm:ss'):"--";
        },
    }
};
</script>
<style scoped lang="less">
@import "~styles/common.less";
</style>


