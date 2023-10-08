<template>
    <div class="card_box">
        <headBreadcrumb
            title="报名用户"
            :showbtn="false"
            @goback="gotoBack"
        ></headBreadcrumb>
        <div style="background: #f2f2f2; height: 10px"></div>
        <namedcomp
            compName="报名总人数："
            align="start"
            nocolon
            style="margin: 10px 0px"
        >
            <div slot="component" style="width: 350px">
                {{ pageObj.totalRecord || '--' }}
            </div>
        </namedcomp>

        <el-table
            :data="listData"
            :header-cell-style="{
                background: '#f2f2f2',
                color: '#1D2129',
                height: '40px'
            }"
            stripe
        >
            <el-table-column
                align="center"
                prop="registerTime"
                label="报名时间"
                :formatter="dateFmt"
            >
            </el-table-column>

            <el-table-column align="center" prop="name" label="用户名">
                <template slot-scope="scope">
                    <span>{{ scope.row.name || '佚名' }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" prop="mobile" label="手机号">
            </el-table-column>
        </el-table>
        <el-pagination
            class="page"
            background
            @size-change="getList"
            @current-change="getList"
            :current-page.sync="pageObj.currPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size.sync="pageObj.pageSize"
            layout=" total,prev, pager, next, jumper, sizes"
            :total="pageObj.totalRecord"
        >
        </el-pagination>
    </div>
</template>

<script>
import { utils } from 'opcl'
import apihandler from 'bislibs/requestHandler/activityhandler'
const headBreadcrumb = () =>
    import('biscomponents/activity/head-breadcrumb.vue')
export default {
    components: {
        headBreadcrumb
    },
    data() {
        const that = this
        return {
            userInput: {
                activityId:
                    this.$route.query.activityId
            },
            pageObj: {
                pageSize: 10,
                currPage: 1,
                totalRecord: 0,
                totalPages: 1
            },
            listData: []
        }
    },
    watch: {},
    created() {},
    mounted() {
        this.getList()
    },
    methods: {
        //获取列表数据
        getPageData(reqData) {
            const that = this
            that.$iLoading.show()
            apihandler
                .getUsersByActivityIdPage(reqData)
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
                            totalPages: response.result.pageCount
                        }
                        tempData.forEach((item, index) => {
                            that.listData.push({
                                ...item,
                                index:
                                    that.pageObj.pageSize *
                                        (response.result.pageIndex - 1) +
                                    index +
                                    1
                            })
                        })
                    }
                })
                .catch((e) => {
                    console.log(e)
                })
                .finally(() => {
                    that.$iLoading.hide()
                })
        },
        /**
         * 校验参数并且发送请求
         */
        getList() {
            let that = this
            let reqData = JSON.parse(JSON.stringify(that.userInput))
            reqData['pageSize'] = that.pageObj.pageSize
            reqData['pageIndex'] = that.pageObj.currPage
            //发送请求 TODO
            that.getPageData(reqData)
        },

        goback() {
            this.$router.go(-1)
        },
        /**
         * 格式化日期
         */
        dateFmt(row, column, cellValue) {
            let startDate = !!cellValue ? new Date(cellValue) : null
            return startDate ? startDate.format('yyyy/MM/dd HH:mm:ss') : '--'
        },
        //返回
        gotoBack() {
            this.$router.go(-1)
        }
    }
}
</script>
<style scoped lang="less">
@import '~styles/common.less';
</style>


