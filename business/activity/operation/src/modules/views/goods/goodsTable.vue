<template>
    <div class="goodspoolListBox">
        <el-table class="tableList" :data="productItem" max-height="550" tooltip-effect="dark"
            @filter-change="changeData" :highlight-current-row="true" :header-cell-style="{ background: '#f7f8fa' }"
            style="
                    width: 100%;
                    border: 1px solid #ebeef5;
                    border-bottom: 0;
                ">
            <el-table-column prop="index" label="序号" width="80" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="sku" label="sku" :show-overflow-tooltip="true" min-width="100">
            </el-table-column>
            <el-table-column prop="skuName" label="商品名称" :show-overflow-tooltip="true" min-width="100">
                <template slot-scope="scope">
                    <div class="goods">
                        <img class="img" :src="scope.row.mainImage" alt="" />
                        <p class="goodspoolName">{{ scope.row.skuName }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="storeName" label="供应商" :show-overflow-tooltip="true" min-width="100">
            </el-table-column>
            <el-table-column prop="settlePrice" label="商品价格" :show-overflow-tooltip="true" min-width="100">
            </el-table-column>
        </el-table>
    </div>

</template>
<script>
export default {

    data() {
        return {
        };
    },

    props: {
        productItem: []
    },
};
</script>

<style scoped lang="less">
.goods {
    display: flex;
    align-items: center;

    .img {
        height: 40px;
        width: 40px;
    }

    p {
        margin: 0 10px;
    }
}
</style>