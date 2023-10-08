<template>
    <div class="customerList_box">
        <customerListTable v-if="isShowModal"
        :tableList="tableDataList"
        @pageChange="pageChange"
        @pageSizeChange="pageSizeChange"
        :pageObject="pageObject"
        @filterChange="changeData"
        :detailUrl="seeDetailUrl"
        :gotoAddUrl="gotoAddUrl"
        ></customerListTable>
        <noAuth :isShowModal="!isShowModal" />
    </div>
</template>
<script>

import customerListTable from "biscomponents/customer/customerListTable.vue"; 
import customerHandler from "bislibs/requestHandler/customerHandler";
import {utils, eventlistenerhandler} from "opcl";
import noAuth from "biscomponents/customer/noAuth.vue";
export default {
    name: "customerList",
    components: {
       customerListTable,
       noAuth
    },
    data: () => {
        return {
            tableDataList: [], //表格数据
            pageObject: {}, // 分页参数
            pageSize:10,
            selectedState: null, // 状态筛选条件
            seeDetailUrl: { //去详情路由
                name: "customerDetail"
            },
            gotoAddUrl: { //去新增页面路由
                name: "customerAdd",
                params: {
                    isEdit: false
                }
            },
            isShowModal:true, //是否有权限查看表格,false能看，true不能看
        };
    },
    created() {
        this.seeCustomerListAuth();
        if (this.isShowModal){
            this.getCustomerList();
        } 
          
    },
    methods: {
        // // 判断是否有权限查看客户列表
        seeCustomerListAuth() {
            this.isShowModal = eventlistenerhandler.hasAuth('seeCustomerListAuth');
        },
        // 获取客户管理列表
        getCustomerList(pageIndex) {
            let requestData = {
                pageNum: pageIndex || 1,
                pageSize: this.pageSize
            };
            this.selectedState && (requestData.state = parseInt(this.selectedState)) ; //增加状态筛选条件
            this.$iLoading.show();
            customerHandler.getCustomerList(requestData).then(res => {
                    if (res.resultCode === 0) {
                        this.tableDataList=[];
                        // this.tableDataList = res.result.hitResultVOList;
                        let tempData = res.result.userVoList;
                        this.setPageObjectByData({
                            totalItems: res.result.total,
                            totalPages: res.result.pageCount,
                            pageSize:this.pageSize,
                            pageIndex
                        });
                        tempData.forEach((item,index) => {
                            this.tableDataList.push({
                                ...item,
                                "index":this.pageSize*(requestData.pageNum-1)+index+1
                            })
                        });
                        
                        
                    } else {
                        utils.showToast(res.resultMessage);
                    }
                })
                .catch(err => {
                    console.log(err);
                }).finally(()=>{
                    this.$iLoading.hide();
                })
        },
        // 改变筛选条件重新请求数据
        changeData: function(value) {
            this.selectedState = value.state;
            this.getCustomerList();
        },
        // 设置分页数据
        setPageObjectByData({ totalPages, totalItems, pageSize, pageIndex }) {
            this.$set(this.pageObject, "pageCount", totalPages);
            this.$set(this.pageObject, "total", totalItems);
            this.$set(this.pageObject, "currentPage", pageIndex || 1);
            this.$set(this.pageObject, "pageSize", pageSize);
        },
        // 当前页码变化请求数据
        pageChange(currentPage) {
            this.getCustomerList(currentPage);
        },
        // 每页数量改变时
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getCustomerList(1);
        }
    }
};
</script>
<style lang='less' scoped>
.customerList_box{
    height: 100%;
}
</style>
