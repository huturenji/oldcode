<template>
    <!--搭配组件 以后改为商品组合-->
    <view class="match_wrap" :style="[styles]">
        <view class="match_top">
            <view class="match_top_title" v-if="decoItem.props.dapei_title">{{ decoItem.props.dapei_title }}</view>
            <view class="match_image_wrap flex_row_center_center">
                <image :src="decoItem.props.dapei_img" mode="" class="match_image" />
            </view>
            <view class="match_top_text" v-if="decoItem.props.dapei_desc">{{ decoItem.props.dapei_desc }}</view>
        </view>
        <view class="match_main_wrap" >
            <scroll-view
                scroll-x="true"
                class="match_main"
                style="white-space: nowrap;"
                v-if="decoItem && decoItem.data && decoItem.data[0].info"
            >
                <view
                    class="match_item"
                    style=""
                    v-for="(item, index) in renderGoodsList()"
                    :key="index"
                    @click="toGoodsDetail(item)"
                >
                    <view class="match_goods_img">
                        <image :src="item.mainImage" mode="aspectFit" />
                    </view>
                    <view class="match_goods_name">{{ item.skuName }}</view>
                    <view class="match_goods_price num-font" v-if="item.salePrice">
                        <text class="small_price">￥</text>
                        <text class="big_price">{{ filters.toSplit(filters.toFix(item.salePrice))[0] }}</text>.
                        <text class="small_price">{{ filters.toSplit(filters.toFix(item.salePrice))[1] }}</text>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>


<script module="filters" lang="wxs" src="@/utils/filter.wxs"></script>
<script>
import pullProdouctPriceMixin from '@/common/mixin/pullProdouctPriceMixin'
import mixin from "@/common/components/decorate/common/mixin/index";
import { isNotEmpty } from '@/utils/common.js'

export default {
    mixins: [pullProdouctPriceMixin, mixin],
    name: "goods-image-top",
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {},
        }
    },
    data() {
        return {

        };
    },
    mounted () {
        this.initDecoGoodsData(this.decoItem);//在pullProdouctPriceMixin中
        this.initBackgroud(this.decoItem)
        this.initSpace(this.decoItem)
    },
    methods: {
        renderGoodsList(){
            let list = []
            try {
                list = this.decoItem.data[0].info
            } catch (error) {
                list = []
            }
            return list
        },
        // 跳转商品详情页
        toGoodsDetail({ sku, storeId }) {
            this.$Router.push({
                path: "/views/goods/detail/index",
                query: { sku, storeId }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@media screen and (min-width: 550px) {
    ::v-deep ::-webkit-scrollbar {
        height: 4px !important;
        display: inline-block !important;
    }

    ::v-deep ::-webkit-scrollbar-thumb {
        border-radius: 10px !important;
        background: #ccc !important;
    }

    ::v-deep ::-webkit-scrollbar-track {
        border-radius: 10px !important;
        background: rgba(0, 0, 0, 0.1) !important;
    }
}

.match_wrap {
    box-sizing: border-box;
    flex-direction: column;
    background-color: #fff;

    .match_top {
        display: flex;
        flex-direction: column;
        background-color: #fff;

        image {
            width: 100%;
        }

        .match_image_wrap {
            width: 100%;
            height: 240rpx;
            display: flex;
            justify-content: center;

            .match_image {
                width: 100%;
                height: 100%;
                margin: 0 auto;
            }
        }

        .match_top_title {
            text-align: center;
            padding-bottom: 20rpx;
            font-size: 32rpx;
            color: #333;
        }

        .match_top_text {
            padding: 20rpx 20rpx 0;
            font-size: 28rpx;
            color: #333;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }

    .match_main_wrap {
        background-color: #fff;
        margin-top: 20rpx;
    }

    .match_main {

        .match_item {
            display:inline-block;
            width: 222rpx;
            height: 370rpx;
            margin-right: 20rpx;
            background-color: #fff;
            border-radius: 15rpx;
            position: relative;

            .match_goods_img {
                width: 222rpx;
                height: 222rpx;
                background-color: #ccc;
                border-radius: 15rpx 15rpx 0 0;

                image {
                    width: 222rpx;
                    height: 222rpx;
                    border-radius: 10rpx 10rpx 0 0;
                }
            }

            .match_goods_name {
                font-size: 28rpx;
                color: #333;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                white-space: pre-wrap;
                -webkit-box-orient: vertical;
                word-break: break-all;
                line-height: 125%;
                // box-sizing: border-box;
                // padding: 10rpx 0rpx 0 0rpx;
            }

            .match_goods_price {
                font-size: 28rpx;
                color: rgb(255, 43, 32);
                position: absolute;
                bottom: 12rpx;
                // left: 20rpx;

                .big_price {
                    font-size: 34rpx;
                }

                .small_price {
                    font-size: 24rpx;
                }
            }
        }
    }
}
</style>