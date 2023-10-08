<!-- 商品列表页 -->
<template>
    <view class="display-box">
        <block v-if="type == 'masonry'">
            <view class="masonry">
                <view class="column">
                    <block v-for="(goods, index) in leftList" :key="index">
                        <thumb-goods class="goods-item" :goods="goods" type="masonry" />
                    </block>
                </view>
                <view class="column">
                    <block v-for="(goods, index) in rightList" :key="index">
                        <thumb-goods class="goods-item" :goods="goods" type="masonry" />
                    </block>
                </view>
            </view>
        </block>

        <block v-else-if="type == 'horizontal'">
            <view class="horizontal">
                <thumb-goods class="goods-item" v-for="(goods, index) in goodsList" :key="index" :goods="goods"
                    type="horizontal" />
            </view>
        </block>

    </view>
</template>

<script>
import ThumbGoods from './thumb/thumb-goods.vue';
export default {
    name: "goods-display",
    props: {
        goodsList: {
            type: Array,
            default: []
        },
        type: {
            type: String,
            default: 'masonry'
        }
    },
    data() {
        return {};
    },
    computed: {
        leftList(){
            return this.goodsList.filter((item, index) => index % 2 == 0)
        },
        rightList(){
            return this.goodsList.filter((item, index) => index % 2 != 0)
        },
    },
    onLoad() {
    },
    created() {
    },
    methods: {
    },
    components: { ThumbGoods }
}
</script>

<style lang="scss" scoped>
.display-box {
    padding: 0 18rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .masonry {
        display: flex;
        width: 100%;
        justify-content: space-between;

        .column {
            display: flex;
            flex-direction: column;
            width: calc((100% - 18rpx) / 2);

            .goods-item {
                margin-top: 18rpx;
            }
        }
    }


    .horizontal {
        overflow: hidden;

        .goods-item {
            display: block;
            margin-top: 18rpx;
        }
    }




}
</style>
