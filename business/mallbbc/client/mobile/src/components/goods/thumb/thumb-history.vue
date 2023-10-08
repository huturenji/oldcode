<!-- 商品组件：横向展示，一行一个，商品列表页面
    点击进入商品详情页
    加入购物车事件
-->
<template name="goodsItemH">
    <view class="history_wrap" :style="{left:left == true?'-160rpx':'0'}">
        <view class="goods_h_item flex_row_start_start" @click="goGoodsDetail(goods_info)">
            <view class="goods-img" :style="{backgroundImage: 'url('+goods_info.mainImage+')'}"></view>
            <view class="right flex_column_between_start">
                <view class="top flex_column_start_start" style="width: 100%;">
                    <view class="goodsNameWrap">
                        <text class="goods-name">{{goods_info.skuName}}</text>
                    </view>
                    <text class="goods-brief" v-if="goods_info.spuBrief">{{goods_info.spuBrief}}</text>
                </view>
                <view class="goods-price flex_row_between_center">
                    <view class="left flex_row_start_end num-font">
                        <text class="unit">￥</text>
                        <text class="price_int">{{this.$getPartNumber(goods_info.skuPrice,'int')}}</text>
                        <text class="price_decimal">{{this.$getPartNumber(goods_info.skuPrice,'decimal')}}</text>
                    </view>
                </view>
            </view>
        </view>
        <!-- #ifdef H5 -->
        <view class="operate_wrap" :style="{top:isWeiXinBrower?'20rpx':'92rpx'}">
            <view class="share_btn operate_btn" @click.stop="goShare(goods_info)" v-if="isWeiXinBrower">分享</view>
            <view class="delete_btn operate_btn" @click.stop="delGoods(goods_info.logId)">删除</view>
        </view>
        <!-- #endif -->
        
        <!-- #ifndef H5 -->
        <view class="operate_wrap" :style="{top:isWeiXinBrower?'92rpx':'20rpx'}">
            <view class="share_btn operate_btn" @click.stop="goShare(goods_info)">分享</view>
            <view class="delete_btn operate_btn" @click.stop="delGoods(goods_info.logId)">删除</view>
        </view>
        <!-- #endif -->
    </view>
</template>

<script>
export default {
    name: "thumb-history",
    data() {
        return {
            is_show_btn:false, //是否展示
            followId:'',
            startX:'',
            startY:''
        }
    },
    props: {
        goods_info: {
            type: Object,
            value: {}
        },
        item_index: {
            type: Number,
            val: 0
        },
        goods_index: {
            type: Number,
            val: 0
        },
        isWeiXinBrower:{
            type:Boolean
        },
        left:{
            type:Boolean
        }
    },
    watch:{
        goods_info(){
        }
    },
    methods: {
        //进入商品详情页
        goGoodsDetail(goods_info) {
            this.$Router.push({path:'/standard/product/detail',query:{sku:goods_info.sku}})
        },
        //删除足迹商品
        delGoods(id) {
            this.$emit("delGoods",this.item_index, this.goods_index,id);
        },
        //分享商品
        goShare(goods_info){
            this.$emit("goShare",goods_info)
        }
    }
}
</script>

<style lang='scss'>
    .history_wrap{
        position:relative;
        transition: all 0.3s;
    }
    .goods_h_item {
        width: 100%;
        background: #fff;
        padding: 0 20rpx 20rpx;
        overflow: hidden;
        background: #fff;
        width: 750rpx;
        &:first-child {
            padding-top: 20rpx;
        }
        .goods-img {
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            width: 290rpx;
            height: 290rpx;
            overflow: hidden;
            border-radius: 16rpx;
            background-color: #F8F6F7;
            flex-shrink: 0;
        }

        .right {
            height: 290rpx;
            padding: 10rpx 0 30rpx;
            width: 420rpx;

            .top {
                padding-left: 20rpx;
            }
        }
        .goodsNameWrap{
            max-height: 0.76rem;
            overflow: hidden;
            margin: 20rpx 0;
        }
        .goods-name {
            font-size: 30rpx;
            color: $com-main-font-color;
            line-height: 126%;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-word;
        }

        .goods-brief {
            color: $main-third-color;
            font-size: 24rpx;
            margin-top: 10rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
        }

        .goods-price {
            padding: 0 20rpx;
            width: 100%;
            margin-top: 15rpx;

            .left {
                color: var(--confirmBtnBgColor2);
                align-items: baseline;
                .unit,
                .price_decimal {
                    font-size: 24rpx;
                }

                .price_int {
                    font-size: 38rpx;
                    line-height: 38rpx;
                }

            }

            .iconfont {
                font-size: 45rpx;
                color: $main-font-color;
            }

            image {
                width: 42rpx;
                height: 42rpx;
            }
        }
    }
    .operate_wrap{
        position:absolute;
        width:160rpx;
        display: flex;
        flex-direction: column;
        right: -160rpx;
        top:20rpx;
        .operate_btn{
            width:160rpx;
            height:145rpx;
            font-size:28rpx;
            color:#fff;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #FF9518;
            transition: all 0.3s;
        }
        .share_btn{
            background: #FF0D24;
        }
        
    }
</style>
