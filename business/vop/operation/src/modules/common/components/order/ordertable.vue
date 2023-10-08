<template>
    <div
        class="order-table"
        id="orderTable"
    >
        <div class="title table-title">
            {{ type == 'parent'?'已拆分的订单':'商品信息' }}
        </div>
        <div
            class="parent"
            v-if="type == 'parent'"
        >
            <div class="goods-list">
                <el-table 
                    class="parent-header"
                    :header-cell-style="{background:'#f2f2f2'}" 
                    :data="dataList"
                    default-expand-all
                    :span-method="arraySpanMethod"
                >
                    <el-table-column
                        min-width="220"
                        prop="name"
                        label="商品详情"
                    >
                        <template slot-scope="scope">
                    
                            <div class="order-item">
                                <div
                                    class="order-no"
                                    v-if="scope.row.subOrderNo"
                                >
                                    <span class="mall-label">平台(子)订单号: </span><span
                                        class="active"
                                        @click="showDetail(scope.row.subOrderNo)"
                                    >{{ scope.row.subOrderNo }}</span>
                                    <span class="sp-label">供应商订单号: </span><span>{{ scope.row.supplierOrderNo }}</span>
                                    <span class="sp-label">供应商: </span><span>{{ scope.row.supplierType |supplierTypeFormat }}</span>
                                </div>
                                <div
                                    class="combind-row"
                                    v-for="(item,i) in scope.row.skuList"
                                    :key="i"
                                >
                                    <div class="dynamic-row">
                                        <div :style="{ display:'flex',flex: '220' }">
                                            <img
                                                :src="item.mainImage"
                                                style="width:48px;height:48px;margin-right: 10px;"
                                            />
                                            <p :style="{ width:'170px' ,whiteSpace: 'pre-wrap',wordBreak: 'break-all' }">
                                                {{ item.name }}
                                            </p>
                                        </div>
                                        <span :style="{ flex: '120' }">{{
                                            item.sku
                                        }}</span>
                                        <span :style="{ flex: '120' }">{{
                                            item.supplierSku
                                        }}</span>
                                        <span :style="{ flex: '90' }">{{
                                            goodAmount(item.supplierSettlePrice)
                                        }}</span>
                                        <span :style="{ flex: '90' }">{{
                                            goodAmount(item.settlePrice)
                                        }}</span>
                                        <span :style="{ width: '100px',flex: '90' }">{{ item.num }}件</span>
                                    </div>
                                </div>
                                <div class="subOrderAmount">
                                    <!-- //supplierOrderSettlePrice,orderSettlePrice,freight -->
                                    <div class="money"> 
                                        <label>供应商结算价小计: </label>
                                        <span>{{ goodAmount(scope.row.supplierOrderSettlePrice) }}</span>
                                    </div>
                                    <div class="money"> 
                                        <label>渠道价小计: </label>
                                        <span>{{ goodAmount(scope.row.orderSettlePrice) }}</span>
                                    </div>
                                    <div class="money"> 
                                        <label>运费: </label>
                                        <span>{{ goodAmount(scope.row.freight) }}</span>
                                    </div>
                                </div>
                            </div>  

                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        prop="supplierOrderNo"
                        label="商品编号"
                    >
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        prop="thirdOrderNo"
                        label="供应商商品编号"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="supplierOrderSettlePrice"
                        label="供应商结算价"
                        min-width="90"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="orderSettlePrice"
                        label="渠道价"
                        min-width="90"
                    >
                    </el-table-column>
                    <el-table-column
                        min-width="90"
                        prop="num"
                        label="数量"
                    >
                    </el-table-column>
                </el-table>
            </div>

            <div class="goods-total">
                <div
                    class="money"
                    v-for="(amount,index) in amountInfoList"
                    :key="index"
                > 
                    <label>{{ amount.key }}: </label>
                    <span>{{ goodAmount(amount.value) }}</span>
                </div>
            </div>
        </div>
        <div
            class="normal-table"
            v-else
        >
            <good-table 
                :amount-info-list="amountInfoList"
                :data-list="dataList" 
                :headers="headers"
            >
            </good-table>
            <div class="goods-total">
                <div
                    class="money"
                    v-for="(amount,index) in amountInfoList"
                    :key="index"
                > 
                    <label>{{ amount.key }}: </label>
                    <span>{{ goodAmount(amount.value) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import GoodTable from "./goodtable";
import accounting from "accounting";
import { mapMutations, mapGetters } from "vuex";
export default {
    components: {
        GoodTable
    },
    props: {
        type: {
            type: String,
            default: ""
        },
        dataList: {
            type: Array,
            default: () => []
        },
        amountInfoList: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        ...mapGetters(["orderType"]),
        goodAmount() {
            return function(amount) {
                return accounting.formatMoney(amount, "￥", 2, ",");
            };
        }
    },
    mounted() {
    },
    data() {
        return {
            headers: [
                {
                    title: "商品信息",
                    key: "name",
                    width: 460
                },
                {
                    title: "商品编号",
                    key: "sku"
                },
                {
                    title: "供应商商品编号",
                    key: "supplierSku"
                },
                {
                    title: "供应商结算价",
                    key: "supplierSettlePrice"
                },
                {
                    title: "渠道价",
                    key: "settlePrice"
                },
                {
                    title: "数量",
                    key: "num",
                    width: 90
                }
            ]
        };
    },
    filters:{
        supplierTypeFormat(val) {
            let mapSupplierType = {
                'JD':'京东',
                'EHSY':'西域'
            }
            if (val&&mapSupplierType[val]){
                return mapSupplierType[val]
            }
            return "--"
            
            
        }
    },
    methods: {
        ...mapMutations({
            setOrderNo: "SET_ORDERNO",
            setsubOrderNo: "SET_SUBORDERNO",
            setOrderType: "SET_ORDERTYPE"
        }),
        /**
         * 查看子订单详情
         */
        showDetail(subOrderNo) {
            this.setsubOrderNo(subOrderNo);
            this.setOrderType("CHILD");
            this.$router.push({
                name: 'salechild'
            });
        },
        /**
         * 合并单元格
         */
        // eslint-disable-next-line no-unused-vars
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            //我们把整行全部合并，然后自己实现
            if (columnIndex === 0) {
                //第一个元素代表rowspan，第二个元素代表colspan
                return [1, 9];
            } else if (
                columnIndex === 1 ||
                columnIndex === 2 ||
                columnIndex === 3 ||
                columnIndex === 4 ||
                columnIndex === 5 ||
                columnIndex === 6 ||
                columnIndex === 7 ||
                columnIndex === 8
            ) {
                return [0, 0];
            }
        }
    }
};
</script>
<style lang="less">
 .el-table__cell .cell .el-table__expand-icon{display: none;}
 .el-table th.gutter{
  display: table-cell!important;
}
.goods-list .el-table th.el-table__cell.is-leaf{text-align: center;}
.order-table {
    padding: 16px 0 32px 0;
    margin-bottom: 16px;
    background-color: #fff;
    border-radius: 8px;
    .table-title {
        padding: 0 32px;
        margin-bottom: 8px;
    }
    .parent {
        border-top: 1px solid #eee;
        padding: 0 24px;
        .goods-list {
            margin-top: 16px;
            border-radius: 4px;
            border: 1px solid #ebeef5;
            padding-bottom: 24px;
            .parent-header {
                .el-table__body-wrapper {
                    // display: none;
                }
            }
            .order-item {
                .order-no {
                    padding: 0px 0 5px 0;
                    border-bottom: 1px dashed #ddd;
                    margin: 0 10px;
                    .mall-label,
                    .sp-label {
                        color: #999;
                    }
                    .sp-label {
                        padding-left: 32px;
                    }
                }
                .subOrderAmount{
                    display: flex;
                    padding: 5px;
                    justify-content: flex-end;
                    margin-top: 15px;
                    font-weight: 700;
                    .money{margin-left:15px ;}
                }
            }
        }

        .el-table {
            border: none;
            border-radius: 0;
            &::before {
                height: 0;
            }
            tbody td {
                padding: 24px 0 0 0;
            }
            
        }
        .el-table td.el-table__cell:last-child{
                border-bottom: none;
            }
        .el-table--fit {
            border: none !important;
        }
    }
    
    .combind-row {
        display: flex;
        padding: 3px;
        // justify-content: space-between;
        .dynamic-row {
            display: flex;
            flex: auto;
            align-items: center;
            text-align: center;
            span {
                padding-left: 5px;
            }
        }
    }
    .normal-table {
        border-top: 1px solid #eee;
        padding: 24px 24px 0 24px;
    }
    .goods-total {
        padding-top: 16px;
        font-size: 14px;
        font-weight: 700;
        .money {
            text-align: right;
            margin-top: 8px;
            &:first-child {
                margin-top: 0;
            }
            // &:last-child {
            //     span {
            //         font-size: 20px;
            //         color: #ee6747;
            //     }
            // }
            // label {
            //     color: #999;
            // }
        }
    }
}
</style>