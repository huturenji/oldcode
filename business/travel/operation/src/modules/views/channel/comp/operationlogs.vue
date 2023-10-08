<template>
    <div class="operation-logs">
        <div class="head-panel">
            <div class="title">操作记录</div>
        </div>
        <Table stripe :columns="columnArr" :data="listOperations"></Table>
        <page :page="pageParams" @turnPage="turnPage"></page>
    </div>
</template>

<script>
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
import page from "components/page/page";
export default {
    components: {
        page,
    },
    data() {
        return {
            // loading: false,
            columnArr: [
                {
                    title: "时间",
                    key: "operateTimeStr",
                    align: "center",
                },
                {
                    title: "操作人",
                    key: "operator",
                    align: "center",
                },
                {
                    title: "内容",
                    key: "operationDesc",
                    align: "center",
                },
            ],
            listOperations: [],
            pageParams: {
                //查询条件
                pageSize: 10,
                currPage: 1,
                pageCount: 1,
                totalRecord: 0,
            },
        };
    },
    activated() {},
    created() {},
    mounted() {
        this.getoperations();
    },
    methods: {
        /**
         * 获取渠道操作记录
         */
        getoperations(reqData) {
            const that = this;
            if (!reqData) {
                reqData = {};
            }
            if (!reqData.channelId) {
                reqData.channelId = that.$route.query.channelId;
            }
            if (!reqData.pageIndex) {
                reqData.pageIndex = 1;
            }
            if (!reqData.pageSize) {
                reqData.pageSize = 10;
            }

            tmHandler
                .getChannelOperationRecord(reqData)
                .then((response) => {
                    if (response && response.result) {
                        let temp = response.result;

                        temp.hitResult &&
                            temp.hitResult.forEach((element) => {
                                element.operateTimeStr = new Date(
                                    element.operateTime
                                ).format("yyyy-MM-dd HH:mm:ss");
                            });

                        that.listOperations = temp.hitResult;
                        that.pageParams = {
                            totalRecord: temp.resultCount,
                            pageCount: temp.pageCount,
                            currPage: temp.pageIndex,
                            pageSize: 10,
                        };
                    }
                })
                .catch((e) => {});
        },
        /**
         * 指定页码翻页跳转
         * @param newPageNum 页码
         */
        turnPage(newPageNum) {
            this.pageParams.currPage = parseInt(newPageNum);
            this.getoperations({ pageIndex: this.pageParams.currPage });
        },
    },
};
</script>
<style scoped lang="less">
.operation-logs {
    margin: 10px 8vw;
    .head-panel {
        width: 100%;
        background: #fff;
        padding: 20px;
        .title {
            font-size: 16px;
            font-weight: bold;
        }
    }
}
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
.ivu-table {
    font-size: 14px;
}
.ivu-table-overflowX{
    overflow-x: hidden;
}
</style>



