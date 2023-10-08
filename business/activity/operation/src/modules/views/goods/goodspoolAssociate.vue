<template>
    <div>
        <div class="goods-container">
            <div class="header-wrapper">
                <label class="label-text">商品池ID <span class="start">*</span></label>
                <input class="pool-input" v-model="poolId" placeholder="输入商品池 ID">
                <el-button class="pool-btn" :disabled="!poolId" type="primary" @click="getGoodsListByPoolId">查看池商品
                </el-button>
            </div>

            <div class="body-wrapper">
                <GoodsTable :productItem="productList" />
                <el-row type="flex" justify="end" class="pagination-wrapper">
                    <el-pagination v-show="productList.length" @size-change="pageSizeChange"
                        @current-change="pageIndexChange" @prev-click="pageIndexChange" @next-click="pageIndexChange"
                        background layout="total, sizes, prev, pager, next, jumper" :total="pageObj.total"
                        :page-size="pageObj.pageSize">
                    </el-pagination>
                </el-row>
            </div>


            <!-- 确认关联按钮 -->
            <!-- 关联：将另一个系统中的池数据，备份到本系统 -->
            <el-card shadow="always" class="foot-wrapper" v-if="isShowAssociate">
                <el-button :disabled="this.productList.length === 0" @click="confirmAssociate" type="primary">确认关联
                </el-button>
            </el-card>
        </div>
        <noAuth :isShowModal="!isShowModal" />
    </div>
</template>

<script>
import GoodsTable from './goodsTable.vue'
import goodshandler from "bislibs/requestHandler/goodshandler";
import { eventlistenerhandler } from "opcl";
import noAuth from "biscomponents/customer/noAuth.vue";

const { userInfo } = goodshandler

export default {
    components: { GoodsTable, noAuth },
    data() {
        return {
            poolName: '',
            productList: [],
            poolId: '',
            pageObj: {
                pageSize: 10,
                pageIndex: 1,
                total: 0
            },
            isShowAssociate: true,// 判断是否有权限关联商品池
            isShowModal: true // 判断是否有权限查看活动列表
        }
    },
    created() {
        this.associateProductPool();
        this.seeProductPool();
    },
    methods: {
        // 判断是否有权限关联商品池
        associateProductPool() {
            this.isShowAssociate = eventlistenerhandler.hasAuth('associateProductPool');
        },
        // 判断是否有权限查看活动列表
        seeProductPool() {
            this.isShowModal = eventlistenerhandler.hasAuth('seeProductPool');
        },
        getGoodsListByPoolId() {
            this.$iLoading.show();
            const param = { poolId: this.poolId, pageIndex: this.pageObj.pageIndex, pageSize: this.pageObj.pageSize }
            goodshandler.listProduct(param).then(res => {
                if (res.resultCode === 0) {
                   
                    const { pageIndex, pageSize, total, poolId, poolName, productList } = res.result;
                    this.pageObj.pageIndex = pageIndex
                    this.pageObj.pageSize = pageSize
                    this.pageObj.total = total
                    this.poolId = poolId
                    this.poolName = poolName
                    this.productList = productList.map((product, index) => { return { ...product, index: (pageIndex - 1) * pageSize + index + 1 } })
                    this.productList.forEach(element => {
                        element.settlePrice = "￥" + element.settlePrice
                    });
                }
            }).catch((e) => {

                console.error(e);
            }).finally(() => {

                this.$iLoading.hide();
            })
        },
        // 关联商品池
        confirmAssociate() {

            const params = {
                poolId: this.poolId,
                poolName: this.poolName,
                bind: true,
                operatorId: userInfo.userId,
                operatorName: userInfo.mgrName,
            }

            this.$iLoading.show();
            // 调用关联接口
            goodshandler.bindProductPool(params).then(res => {

                if (res.resultCode === 0) {
                    this.$message.success("关联成功")
                    this.$router.push({ path: '/goods/pool' })
                }
            }).catch((e) => {

                console.error(e);
            }).finally(() => {

                this.$iLoading.hide();
            })
        },
        pageSizeChange(pageSize) {
            this.pageObj.pageSize = pageSize
            this.getGoodsListByPoolId()
        },
        pageIndexChange(pageIndex) {
            this.pageObj.pageIndex = pageIndex
            this.getGoodsListByPoolId()
        },
    }
}
</script>

<style scoped lang="less">
.goods-container {
    background: rgb(242, 243, 245);
    height: 100%;
    // position: relative;
}

.header-wrapper {
    margin-bottom: 20px;
    background: #FFF;
    padding: 24px;
    box-sizing: border-box;

    .label-text {
        box-sizing: content-box;
        width: 60px;
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #222222;
        line-height: 20px;
        padding: 6px 2px 6px 0;
    }

    .start {
        width: 8px;
        height: 20px;
        margin-right: 4px;
        color: #980F0F;
    }

    .pool-input {
        width: 240px;
        height: 32px;
        background: #ffffff;
        border: 1px solid #d3d3d3;
        border-radius: 2px;
        display: inline-block;
        padding: 5px 12px;
        margin-right: 24px;
        outline: none;
    }

    .pool-btn {
        box-sizing: content-box;
        border-radius: 2px;
        border: 0;
        width: 70px;
        height: 22px;
        padding: 5px 16px;

    }
}

el-pagination::v-deep {
    padding-right: 10px;
}

.body-wrapper {
    margin-top: 12px;
    // height: calc(100% - 160px);
    background-color: #fff;

    .pagination-wrapper {
        margin-bottom: 87px;
        padding: 25px 0px 25px 0px;
    }
}

.el-input__inner {
    height: 32px !important;
}

.foot-wrapper {
    display: flex;
    width: calc(100% - 200px);
    flex-direction: column;
    align-items: center;

    position: fixed;
    left: 200px;
    bottom: 0px;

    .el-button {
        width: 88px;
        height: 32px;
        padding: 6px 16px;
        border-radius: 2px;

    }

}
</style>