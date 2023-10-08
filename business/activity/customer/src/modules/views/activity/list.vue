<template>
    <div class="card_box">
        <el-table
            :header-cell-style="{ background: '#F7F8FA',color:'#1D2129',height:'40px' }"
            :data="listData"
            @filter-change="tabFilter"
            @sort-change="changeSort"
            >
            <el-table-column
            align="center"
            prop="activityId"
            label="活动编号"
            width="180">
            </el-table-column>
            <el-table-column
            align="center"
            prop="name"
            label="抽奖活动名称"
            width="180"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            align="center"
            prop="toolId"
            width="180"
            label="全部抽奖形式"
            column-key="toolId"
            :formatter="stateFmt"
            :filter-multiple="false"
            :filters="formTypes">
            </el-table-column>
            <el-table-column
            align="center"
            prop="createTime"
            label="创建时间"
            sortable
            width="160"
            :formatter="dateFmt">
            </el-table-column>
            <el-table-column
            align="center"
            prop="startTime"
            label="开始时间"
            sortable
            width="160"
            :formatter="dateFmt">
            </el-table-column>
            <el-table-column
            align="center"
            prop="totalDrawSum"
            label="抽奖次数">
            </el-table-column>
            <el-table-column
            align="center"
            prop="remainPrizeSum"
            label="剩余奖品数量"
            width="180">
            <template slot-scope="scope">
                <el-popover trigger="hover" placement="top-end">
                    <div
                        v-for="(item,i) in scope.row.prizeList"
                        :key="i"
                    >
                    <p class="popover"><span class="popoverL">{{ item.name }} </span><span class="popoverR">  剩 {{ item.remainCount }}</span>  </p>
                    </div>
                    <div slot="reference">
                        <span>{{ scope.row.remainPrizeSum }}</span>
                    </div>
                </el-popover>
            </template>
            </el-table-column>
            <el-table-column
            align="center"
            prop="state"
            width="120"
            label="全部状态"
            :formatter="stateFmt"
            column-key="state"
            :filter-multiple="false"
            :filters="stateTypes">
            <template slot-scope="scope">
                <span class="state" :class="'state'+scope.row.state">{{scope.row.state | stateFmt}}</span>
            </template>
            </el-table-column>
            <el-table-column
            align="center"
            prop="name"
            label="操作"
            >
            <template slot-scope="scope">
                <el-button @click="openDetail(scope.row)" type="text" >详情</el-button>
                <el-button v-if="isXCKActivity(scope.row.toolId)" @click="openUsers(scope.row)" type="text" >报名用户</el-button>
                <!-- 复制链接暂时不用 -->
                <!-- <el-button @click="copyUrl(scope.row)" type="text" >复制链接</el-button> -->
            </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="page"
            background
            @size-change="getActivityList"
            @current-change="getActivityList"
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
export default {
    components: {},
    data() {
        return {
            userInput: {
                toolId: "-10",//抽奖形式
                state: "-10",//启用状态
                sorts: [],//排序
                "channelId": null,
                "companyId": null,
                "userId": apihandler.userInfo.userId,
            },
            listData: [],
            pageObj: {
                pageSize: 10,
                currPage: 1,
                totalRecord: 0,
                totalPages:1
            },
            formTypes: [
                {value: "1",text: "大转盘"},
                {value: "2",text: "砸金蛋"},
                {value: "3",text: "九宫格"},
                {value: "4",text: "红包雨"},
                {value: "5",text: "现场开奖"}
            ],
            stateTypes:[
                {value: "1",text: "待启用"},
                {value: "2",text: "已启用"},
                {value: "3",text: "已结束"}
            ],
            formStatus :{"-10":"全部抽奖形式", "1": "大转盘","2": "砸金蛋","3": "九宫格","4": "红包雨","5": "现场开奖"},
            stateStatus :{"-10":"全部状态", "1": "待启用","2": "已启用","3": "已结束"},
        };
    },
    filters: {
        stateFmt(val){
            let stateStatus = {"-10":"全部状态", "1": "待启用","2": "已启用","3": "已结束"}
            return stateStatus[val]
        }
    },
    watch: {},
    created() {},
    mounted() {          
        this.getActivityList();
    },
    methods: {
        /**
         * 获取列表数据
         */
        getPageData(reqData) {
            const that = this;
            that.$iLoading.show();
            apihandler
                .clientActivityList(reqData)
                .then((response) => {
                    if (
                        response.resultCode =="0" &&
                        response.result &&
                        response.result.list
                    ) {
                        that.listData = response.result.list;
                        that.pageObj = {
                            pageSize: response.result.pageSize,
                            currPage: response.result.pageIndex,
                            totalRecord: response.result.total,
                            totalPages:response.result.pageCount
                        }
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
        getActivityList() {
            let that = this
            let reqData = JSON.parse(JSON.stringify(that.userInput));
            reqData["pageSize"] = that.pageObj.pageSize
            reqData["pageIndex"] = that.pageObj.currPage
            if(reqData.state == '-10') delete reqData["state"];
            if(reqData.toolId == '-10') delete reqData["toolId"];
            if(reqData.sorts&&reqData.sorts.length<1 ) delete reqData["sorts"];
            //发送请求 
            that.getPageData(reqData);
        },
        /**
         * 跳转到详情
         */
        openDetail(row) {
            utils.setStorage("customer_activityId",row.activityId);
            this.$router.push({
                path: "/activity/detail",
                query: {
                    activityId: row.activityId
                }
            });
        },
        copyUrl(row){
            let hostname = window.location.hostname;
            let hostMap={
                "bplusdev.sinosun.com":"https://bplusdev.sinosun.com:18180",
                "bplussit.sinosun.com":"https://bplussit.sinosun.com:18380",
                "bplus-uat.sinosun.com":"https://bplus-uat.sinosun.com",
                "cloud.sinosun.com":"https://cloud.sinosun.com"
            }
            let link = (hostMap[hostname]||"https://cloud.sinosun.com")+"/activitystudio/static/mobile/index.html#/pages/luck-draw/luck-draw?activityId="+row.activityId;
            this.copyStr(link)
        },
        /**
         * 格式化函数
        */
        stateFmt(row, column, cellValue) {
            if("toolId" == column.columnKey){//格式化抽奖形式
                return this.formStatus[cellValue]
            }
        },
        /**
         * 格式化日期
        */
        dateFmt(row, column, cellValue){
            let startDate = cellValue?new Date(cellValue):"";
            return startDate?startDate.format('yyyy/MM/dd'):"--";
        },
        //筛选函数
        tabFilter (val ) {
            let that = this
            for (const key in val) {
                if (key == 'toolId') {
                    // 筛选活动形式
                    that.userInput.toolId = val[key][0]||"-10";
                } else if (key == 'state') {
                    // 筛选状态
                    that.userInput.state = val[key][0]||"-10";
                }
            }
            that.getActivityList();
        },
        //排序函数
        changeSort(column){
            let that = this
            if(!!column.order){
                let tempOrder =  column.order=="descending"?'DESC':'ASC';
                that.userInput.sorts = [{direction:tempOrder,field:column.prop}]
            }else{
                that.userInput.sorts = []
            }
            that.getActivityList();
        },
        /**
         * 复制字符串
         */
        copyStr (str) {
            var save = function (e){
                e.clipboardData.setData('text/plain',str);//下面会说到clipboardData对象
                e.preventDefault();//阻止默认行为
            }
            document.addEventListener('copy',save);
            document.execCommand("copy");//使文档处于可编辑状态，否则无效
            utils.showToast('复制成功');
            document.removeEventListener('copy',save);
        },
        //判断是否是营销类活动
        isYingxiaoActivity(activityType){
            let toolId = activityType
            return toolId ==1 || toolId ==2|| toolId ==3|| toolId ==4
        },
        //判断是否是现场开奖活动
        isXCKActivity(activityType){
            let toolId = activityType
            return toolId ==5
        },        
        /**
         * 跳转到报名用户
         */
         openUsers(row) {
            this.$router.push({
                path: "/activity/registeredlist",
                query: {
                    activityId: row.activityId
                }
            });
        },        
    }
};
</script>
<style scoped lang="less">
@import "~styles/common.less";
.topArea {
  padding: 20px 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #DCDEE2;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .formArea {
    display: flex;
    flex-wrap: wrap;
  }
}
.popover{
    display:flex;
    justify-content: space-between;
    .popoverL{max-width: 350px;margin-right: 15px;margin-bottom: 10px;}
    .popoverR{text-align: left;}
}
.state{position: relative;}
.state::before{
    content: "";
    width: 6px;height: 6px;
    border-radius: 50%;
    position: absolute;
    left: -12px;top:7px;
}
.state1::before{background: #FF9A2E;}
.state2::before{background: #23C343;}
.state3::before{background: #E5E6E8;}
</style>


