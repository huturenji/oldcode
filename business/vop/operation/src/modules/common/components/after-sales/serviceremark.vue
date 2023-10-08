<template>
    <div class="service-remark">
        <div class="title">
            服务单日志
        </div>
        <el-table 
            class="remark-table"
            max-height="540"
            stripe
            :highlight-current-row="true"
            :header-cell-style="{background:'#f2f2f2'}" 
            style="border: 1px solid #EBEEF5;border-bottom:0"
            :data="systemLogs"
        >
            <el-table-column  
                width="240"
                prop="recordTime"
                label="时间"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.recordTime }}</span>
                </template>
            </el-table-column>
            <el-table-column
                width="240"
                prop="userName"
                label="操作人"
            ></el-table-column>
            <el-table-column
                prop="content"
                label="内容"
            >
            </el-table-column>
        </el-table>
        <!-- <div class="pages">
            <el-pagination
                background
                v-show="totals>0"
                @size-change="changePageSize"
                @current-change="onPageChange"
                :current-page="currentPage"
                :page-sizes="pageSizeOpt"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper,sizes"
                :total="totals">
            </el-pagination>
        </div> -->
    </div>
</template>
<script>
import utils from "bislibs/utils";
export default {
    props: {
        systemLogs: {
            type: Array,
            default: () => []
        },
        totals: {
            type: Number,
            default: 0
        },
        pageSize: {
            type: Number,
            default: 10
        },
        currentPage: {
            type: Number,
            default: 1
        },
        changePageSize: {
            type: Function,
            default: () => {}
        },
        onPageChange: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        operateTime() {
            return time => {
                return this.$moment(time).format("YYYY-MM-DD HH:mm:ss");
            };
        }
    },
    data() {
        return {
            pageSizeOpt: utils.pageSizeOpts
        };
    }
};
</script>
<style lang="less" scoped>
.service-remark {
    margin: 16px 0 24px 0;
    border-radius: 8px;
    padding: 16px 0 32px 0;
    background-color: #fff;
    .title {
        padding: 0 32px 8px 32px;
        border-bottom: 1px solid #eee;
    }
    .remark-table {
        margin: 24px 24px 0 24px;
        width: inherit;
    }
    .pages {
        padding-right: 56px;
    }
}
</style>