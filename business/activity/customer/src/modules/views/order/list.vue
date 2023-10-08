<template>
    <div>
        <el-table
            :data="listData"
            stripe
            :header-cell-style="{ background: '#F7F8FA',color:'#1d2129' }"
            >
            <el-table-column
            align="center"
            prop="orderNo"
            label="订单流水号">
            </el-table-column>

            <el-table-column
            align="center"
            prop="activityId"
            label="活动编号"
            width="180"
            show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column
            align="center"
            prop="activityName"
            label="活动名称"
            width="180"
            show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column
            align="center"
            prop="products"
            label="商品信息"
            width="180">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p v-for="(e,i) in scope.row.products" :key="i" class="hover_goods">
                            <span class="hover_goods_left">{{e.skuName}}</span>
                            <span class="hover_goods_right">¥{{e.salePrice}}*{{e.number}}</span>
                        </p>
                        <div slot="reference" class="sku">
                            <span class="sku_name">{{ scope.row.products[0].skuName }}</span><span class="sku_info">等{{scope.row.products.length}}个商品</span>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>

            <el-table-column
            align="center"
            prop="payStatus"
            label="支付状态"
            width="180">
                <template slot-scope="scope">
                    <div class="state" :class="'state'+scope.row.payStatus">{{scope.row.payStatus=='PAID'?'已支付':'待支付'}}</div>
                </template>
            </el-table-column>

            <el-table-column
            align="center"
            prop="createTime"
            label="订单创建时间">
            </el-table-column>

            <el-table-column
            align="center"
            prop="orderAmount"
            label="订单金额">
                <template slot-scope="scope">
                    <div>￥{{scope.row.orderAmount}}</div>
                </template>
            </el-table-column>
            
            <el-table-column
            align="center"
            prop="approveStatus"
            label="审核状态">
                <template slot-scope="scope">
                    <div>{{scope.row.approveStatus=='APPROVED'?'已审核':'未审核'}}</div>
                </template>
            </el-table-column>

            <el-table-column
            align="center"
            prop="name"
            label="操作"
            >
            <template slot-scope="scope">
                <el-button @click="openDetail(scope.row)" type="text" >详情</el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="page"
            background
            @size-change="changePageSize"
            @current-change="onPageChange"
            :current-page="pageObj.currPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageObj.pageSize"
            layout=" total,prev, pager, next, jumper, sizes"
            :total="pageObj.totals">
        </el-pagination>
    </div>
</template>

<script>
import orderhandler from "bislibs/requestHandler/orderhandler";
export default {
    components: {
       
    },
    data() {
        const that = this;
        return {
            listData: [],
            pageObj: {
                pageSize: 10,
                currPage: 1,
                totals: 0
            },
        };
    },
    watch: {},
    created() {
        
    },
    mounted() {          
        this.getOrderList();
    },
    methods: {
        getOrderList() {
            const that = this;
            that.$iLoading.show();
            let params = {
                customerId:orderhandler.userInfo.userId,
                pageIndex: this.pageObj.currPage,
                pageSize: this.pageObj.pageSize
            };
            orderhandler
            .getOrderList(params)
                .then((result) => {
                    if (result.resultCode === 0) {
                        that.listData = result.result.orders;
                        that.pageObj = {
                            pageSize: result.result.pageSize,
                            currPage: result.result.pageIndex,
                            totals  : result.result.total
                        }
                    }
                    that.$iLoading.hide();
                })
                .catch(() => {
                    that.$iLoading.hide();
                });
        },
       
        /**
         * 跳转到详情
         */
        openDetail(row) {
            this.$router.push({
                path: "/order/detail",
                query: {
                    orderNo: row.orderNo,
                    approveStatus:row.approveStatus
                }
            });
        },
        onPageChange(currentPage) {
            let that = this;
            that.pageObj.currPage = currentPage;
            that.getOrderList();
        },
        changePageSize(pageSize) {
            let that = this;
            that.pageObj.currPage = 1;
            that.pageObj.pageSize = pageSize;
            that.getOrderList();
        },
    }
};
</script>
<style scoped lang="less">
.page{
    text-align: right;
    margin: 15px 0;
}
.state{position: relative;}
.state::before{
    content: "";
    width: 6px;height: 6px;
    border-radius: 50%;
    position: absolute;
    left: 45px;top:10px;
}
.sku{
    display: flex;
    .sku_name{
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .sku_info{
      flex: 20px;
    }
  }
.statePAID::before{background: #23C343;}
.stateUNPAID::before{background: #FF9A2E;}
.hover_goods{
    width: 240px;
    display: flex;
    justify-content: space-between;
    .hover_goods_left,hover_goods_right{
      width: 100px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>


