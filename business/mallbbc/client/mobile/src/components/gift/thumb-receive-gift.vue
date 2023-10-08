<!-- 鹅毛情礼物领取页面卡片组件
-->
<template name="goodsItemH">
        <view class="thumb_container">
            <img class="hudie" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/icon_emq_lihe.svg" alt="" />
            <view class="gift_item_con flex_column_start_start">
                <template v-for="(item,index) in gift_info.orderProductListVOList">
                    <view class="gift_item_con_top flex_column_center_center" :key="index" v-if="item.productType==0">
                        <view class="goods_image">
                            <view class="goods_image_con">
                                <imgThumb :imgSrc="item.mainImage" />
                            </view>
                        </view>
                        <view class="bottom_desc">
                            <text class="goods_name">
                                <i class="store_name"><i :style="{ backgroundColor: 'var(--tagColor)' }">{{ gift_info.storeName }} </i></i>
                                {{item.skuName}}
                            </text>  
                            <view class="spec_info" v-if="item.specValues || item.productNum">
                                <view class="spec">{{item.specValues?item.specValues:''}}</view>
                                <view v-if="item.productNum" class="product_num">{{$L('数量 *')}}{{item.productNum}}</view>
                            </view>
                        </view>
                    </view>
                </template>
            </view>
        </view>
</template>

<script>
import imgThumb from "@/components/goods/thumb/imgThumb.vue";

export default {
    name: "thumb-receive-gift",
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl
        }
    },
    components: {
        imgThumb
    },
    props: {
        // 礼物商品信息
        gift_info: {
            type: Object,
            default: ()=>{}
        } 
    }
}
</script>

<style lang='scss' scoped>
.thumb_container{
    width: 100%;
    position: relative;
    .hudie{
        position: absolute;
        width: 210rpx;
        height: auto;
        z-index: 10;
        top: -58rpx;
        left: 50%;
        margin-left: -105rpx;
    }
}
.gift_item_con{
    border-radius: 16rpx;
    background: #eff2f5;
    overflow: hidden;
 
    .gift_item_con_top{
        width: 100%;
        border-radius: 16rpx 16rpx 0px 0px;
        .bottom_desc{
            width: 100%;
            position: relative;
            flex: 1;
            padding: 32rpx 24rpx;          
            border-radius: 0px 0px 16rpx 16rpx;
            background: rgba(255,255,255,0.66);
            backdrop-filter: blur(25.2rpx);
        }
        .goods_image{
            width: 100%;
            position: relative;
            border-radius: 16rpx 16rpx 0px 0px;
            .goods_image_con{
                width: 100%;
                height: 532rpx;
                margin-bottom: -45px;
                border-radius: 16rpx 16rpx 0px 0px;
                ::v-deep .lazy-item{
                    overflow: hidden;
                    border-radius: 16rpx 16rpx 0px 0px;
                }
                ::v-deep .u-lazy-item{
                    overflow: hidden;
                    border-radius: 16rpx 16rpx 0px 0px !important;
                }
                ::v-deep div{
                    overflow: hidden;
                    border-radius: 16rpx 16rpx 0px 0px;
                }
                ::v-deep img{
                    overflow: hidden;
                    border-radius: 16rpx 16rpx 0px 0px;
                }
            }
        }
        .goods_name {
            color: #222222;
            font-size: 28rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
            line-height: 150%;
            font-weight: bold;
            .store_name {
                display: inline-flex;
                height: 48rpx;
                line-height: 48rpx;
                margin-right: 10rpx;
                align-items: center;
                justify-content: center;
                vertical-align: top;

                i {
                    display: flex;
                    padding: 0 8rpx;
                    color: #fff;
                    font-size: 20rpx;
                    font-weight: 500;
                    border-radius: 6rpx;
                    height: 30rpx;
                    line-height: normal;
                    font-style: normal;
                    align-items: center;
                    align-content: center;
                    justify-content: center;
                }
            }
        }

        .spec_info {
            margin-top: 24rpx;
            color: #666;
            font-size: 26rpx;
            line-height: 48rpx;
            
            display: flex;

            .spec{
                flex: 1;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            .product_num{
                height: 44rpx;
                line-height: 44rpx;
                width: 160rpx;
                margin-left: 20rpx;
            }
        }
    }
}

</style>
