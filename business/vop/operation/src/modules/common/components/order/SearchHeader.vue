<template>
    <div class="search-header">
        <el-row class="header-row">
            <el-col
                :span="11"
                class="search-input"
            >
                <el-input 
                    :placeholder="placeholder" 
                    clearable
                    @keyup.enter.native="search" 
                    v-model.trim="searchKey"
                >
                    <template slot="append">
                        <el-button
                            @click.native="search"
                            icon="el-icon-search"
                        ></el-button>
                    </template>
                </el-input>
            </el-col>
            <date-picker 
                placeholder="请选择下单时间" 
                title="下单时间:"
            >
            </date-picker>
        </el-row>
        <!-- <el-row class="small-btn export">
            <el-button 
                type="primary" 
                @click.native="exportOrderList"
                v-if="(type=='SALE'?showSaleExportAuth:showPurchaseExportAuth)&&orderList.length" 
                :loading="loading">导出订单</el-button>
        </el-row> -->
    </div>
</template>
<script>
import utils from "bislibs/utils";
import DatePicker from "./DatePicker";
export default {
    components: {
        DatePicker
    },
    props: {
        orderList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            searchKey: "",
            loading: false,
            showSaleExportAuth: utils.hasAuth('showSaleExportAuth'),
            showPurchaseExportAuth: utils.hasAuth('showPurchaseExportAuth')
        };
    },
    computed: {
        placeholder() {
            return `订单号/供应商订单号/收货人姓名/收货人手机号码/下单人姓名/下单人手机号码`;
        }
    },
    methods: {
        search() {
            this.$emit("on-search");
        },
        exportOrderList() {
            this.$emit("on-export");
        }
    }
};
</script>
<style lang="less">
 
.search-header {
    margin: 8px 8px 16px 8px;
    .el-input-group__append {
        background-color: #478aee;
        color: #fff;
        border: 1px solid #478aee;
    }
    .el-col-10 {
        margin-right: 150px;
    }
    .export {
        text-align: right;
        margin-top: 24px;
        .el-button {
            padding: 9px 23px;
        }
    }
    .header-row {
        height: 36px;
        .search-input {
            .el-input-group__append {
                color: #fff;
                background-color: #478aee;
                border: 1px solid #478aee;
                border-radius: 0 8px 8px 0;
                padding: 0 19px;
            }
            .el-input__inner {
                border-radius: 8px 0 0 8px;
                height: 36px;
                line-height: 36px;
                padding-right: 0px;
            }
        }
    }
    .el-button {
        padding: 11px 12px;
        font-size: 12px;
    }
    .el-button + .el-button {
        margin-left: 8px;
    }
}
</style>