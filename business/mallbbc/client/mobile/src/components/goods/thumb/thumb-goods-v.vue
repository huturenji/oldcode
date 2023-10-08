<!-- 商品组件：竖直方向
    点击进入商品详情页
    应用于商品列表页面
-->
<template name="goodsListItemV">
    <view class="goods_v_item flex_column_start_start" @click="goGoodsDetail(goods_info)">
        <view class="goods-img">
            <imgThumb 
                :imgSrc="goods_info.mainImage" 
            />
        </view>
        <view class="bottom_part flex_column_between_start">
            <view class="top flex_column_start_start">
                <view class="goodsNameWrap">
                    <view class="goods-name" v-html="goods_info.skuName">
                    </view>
                </view>
                <text v-if="goods_info.goodsBrief" class="goods-brief">{{goods_info.goodsBrief}}</text>
            </view>
            <view v-if="goods_info.activityList&&goods_info.activityList.length>0" class="activity_con">
                <block v-for="(item, index) in goods_info.activityList" :key="index">
                    <view class="act_label ladder_group" v-if="item.promotionType==105">
                        {{item.promotionName}}
                    </view>
                    <view class="act_label discounts" v-if="item.promotionType==201||item.promotionType==202||item.promotionType==203||item.promotionType==204">
                        {{item.promotionName}}
                    </view>
                    
                    <view class="act_label secKill" v-if="item.promotionType==104">
                        {{item.promotionName}}
                    </view>
                    
                    <view class="act_label preSale" v-if="item.promotionType==103">
                        {{item.promotionName}}
                    </view>
                </block>
            </view>
            <view class="bottom flex_column_start_between">
                <view class="goods-price flex_row_start_center">
                    <view class="left flex_row_start_center">
                        <view class="left_price num-font">
                            <text class="unit">￥</text>
                            <text class="price_int">{{$getPartNumber(goods_info.salePrice,'int')}}</text>
                            <text class="price_decimal">{{$getPartNumber(goods_info.salePrice ,'decimal')}}</text>
                        </view>
                        
                    </view>
                </view>
                <view class="store_enter">
                    <text class="stroe_name">{{goods_info.storeName}}</text>
                </view>
                
            </view>
            
            
        </view>
    </view>
</template>

<script>
import imgThumb from "@/components/goods/thumb/imgThumb.vue";

export default {
    name: "thumb-goods-v",
    components:{
        imgThumb
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl
        }
    },
    props: {
        goods_info: {
            type: Object,
            value: {}
        }
    },
    methods: {
        //进入商品详情页
        goGoodsDetail(goods_info) {
            this.$Router.push({ path: '/standard/product/detail', query: { sku: goods_info.sku}})
        }
    }
}
</script>

<style lang='scss'>
    .goods_v_item {
        margin: 10rpx;
        background: #fff;
        border-radius: 20rpx;
        overflow: hidden;
        box-shadow: -2rpx 0rpx 40rpx -4rpx rgba(156,159,169,0.10); 
        

        .goods-img {
            width: 100%;
            height: 340rpx;
            overflow: hidden;
            ::v-deep uni-image{
                border-radius: 20rpx 20rpx 0 0 !important;
            }
            ::v-deep img{
                width: 100%;
                height: auto;
                display: block;
            }
        }

        .bottom_part {
            flex: 1;
            padding-bottom: 20rpx;
            width: 100%;
        }

        .top {
            width: 100%;
        }
        .goodsNameWrap{

            margin: 20rpx 0;
            max-height: 0.76rem;
            overflow: hidden;
        }
        .goodsNameWrap .goods-name {
            font-size: 30rpx;
            color: $com-main-font-color;
            line-height: 127%;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: bold;
            padding: 0 20rpx;
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
            min-height: 38rpx;
        }

        .goods-brief {
            padding: 5rpx 20rpx 0;
            font-size: 24rpx;
            color: $main-third-color;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            height: 40rpx;
        }

        .goods-price {
            padding: 0 20rpx;
            width: 100%;

            
            color: var(--confirmBtnBgColor2);
    
            .unit{
                font-size: 32rpx;
                letter-spacing: -2px;
            }

            .price_int,
            .price_decimal {
                font-size: 40rpx;
                
                
            }
            

            .sales {
                color: $main-third-color;
                font-size: 22rpx;
                margin-left: 22rpx;
                /* margin-left: 29rpx; */
            }
        }
    }

    .activity_con {
        padding-left: 20rpx;
        margin-bottom: 20rpx;
        .act_label{
            padding: 2rpx 8rpx;
            border: 2rpx solid $main-color;
            border-radius: 6rpx;
            color: $main-color;
            font-size: 20rpx;
            margin-right: 12rpx;
        }
    

        .ladder_group{
        
        }
        
        .discounts {
            
        }
        
        .secKill{
            
        }
        
        .preSale{
            
        }
        
        .spellGroup{
        
        }

    
    }

    .store_enter {
        display: flex;
        font-size: 24rpx;
        align-items: center;
        padding-left: 20rpx;
        margin-top: 14rpx;
        margin-bottom: 14rpx;
    }

    .stroe_name {
        max-width: 200rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #666666;
    }

    .store_enter_btn {
        color: #333333;
        font-weight: bold;
        margin-left: 10rpx;

    }

    .store_enter_image {
        width: 11rpx;
        height: 19rpx;
        margin-left: 10rpx;
    }
</style>
