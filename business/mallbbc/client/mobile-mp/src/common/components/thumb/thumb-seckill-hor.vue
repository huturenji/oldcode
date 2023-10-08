<!-- 巨拾惠折扣新秒杀item组件
-->
<template name="goodsItem">
    <view class="thumb-seckill" v-if="goodsItem">
        <view class="seckill_item flex_row_center_center" @click="goGoodsDetail(goodsItem)">
            <view class="goods-img">
                <imgThumb :imgSrc="goodsItem.mainImage" showThumbTips :noSale="promotionNoSale(goodsItem)" />
            </view>
            <view class="right flex_column_start_start">
                <view class="top">
                    <view class="goods-name">
                        {{goodsItem.skuName}}
                    </view>
                </view>
                <view class="price_box">
                    <view class="price_bg">
                        <view class="flex_row_between_start top_part">
                            <view class="origin_price">
                                <span v-if="goodsItem.salePrice">¥{{getPartNumber(goodsItem.salePrice,'int')}}{{getPartNumber(goodsItem.salePrice,'decimal')}}</span>
                            </view>
                            <view class="sale_price_box">
                                <view class="flex_row_start_center">{{priceName?priceName:'秒杀价'}}</view>
                                <view class="sale_price num-font" v-if="goodsItem.promotionPrice">
                                    <text :style="{fontSize:fontSize('unit',getPartNumber(goodsItem.promotionPrice,'int').toString().length)}">¥</text>
                                    <text class="big_price" :style="{fontSize:fontSize('big',getPartNumber(goodsItem.promotionPrice,'int').toString().length)}">{{getPartNumber(goodsItem.promotionPrice,'int')}}</text>
                                    <text class="small_price" :style="{fontSize:fontSize('small',getPartNumber(goodsItem.promotionPrice,'int').toString().length)}">{{getPartNumber(goodsItem.promotionPrice,'decimal')}}</text>
                                </view>
                            </view>
                        </view>
                        <view class="num" v-if="goodsItem.promotionStock">限量<text class="num-font">{{goodsItem.promotionStock}}</text>件</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import imgThumb from '@/common/components/thumb/imgThumb.vue';
import goodsHandler from "@/views/components/goods/handler.js";
import activityMinxin from './minxin/activity.js'
import { getPartNumber } from '@/utils/common';
export default {
    name: 'thumb-new-seckill',
    props: {
        // 商品列表数据
        goodsItem:{
            type: Object,
            default:()=>{}
        },
        // 秒杀价上面展示的文字
        priceName:{
            type: String,
            default:'秒杀价'
        }
    },
    components: {
        imgThumb,
    },
    mixins:[activityMinxin],
    data() {
        return {
            getPartNumber,
            fitFontSize:{
                unit: {1:'28',2:'28',3:'28',4:'28',5:'28',6:'28',7:'28',8:'28',9:'20',10:'18',11:'18',12:'18'},
                big: {1:'36',2:'36',3:'36',4:'36',5:'36',6:'36',7:'36',8:'36',9:'30',10:'26',11:'22',12:'20'},
                small: {1:'24',2:'24',3:'24',4:'24',5:'24',6:'24',7:'24',8:'24',9:'20',10:'18',11:'18',12:'18'}  
            }
        }
    },
    computed: {
        fontSize(){
            let size = ''
            return (type,length)=>{
                if ((length+4) > 12){
                    size = this.fitFontSize[type]['12']+'rpx'
                } else {
                    size = this.fitFontSize[type][length+4]+'rpx'
                }
                return size
            }
        }
    },
    mounted() {

    },
    methods: {
        //进入商品详情页
        goGoodsDetail({ sku, storeId, mainImage }) {
            try {
                this.$Router.push({
                    path: '/views/goods/detail/index',
                    query: {
                        sku,
                        storeId,
                        mainImage
                    }
                });
            } catch (error) {
                console.log("跳转到商品详情出错", error);
            }
        }
    }
}
</script>

<style lang='scss' scoped>
.thumb-seckill{
    width: 100%;
    .seckill_item{
        width: 100%;
        height: 280rpx;
        padding-left: 30rpx;
        border-radius: 12rpx;
        overflow: hidden;
        background: #fff;
        .goods-img {
            width: 204rpx;
            height: auto;
            margin-right: 20rpx;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            overflow: hidden;
            background-color: #F8F6F7;
            flex-shrink: 0;
        }
        .right {
            width: 100%;
            height: 100%;
            padding: 30rpx 0rpx 0rpx 20rpx;
        }
        .top {
            width: 100%;
            padding: 0 24rpx 40rpx 0;
        }
        .goods-name {
            font-size: 26rpx;
            color: #222;
            line-height: 136%;
            min-height: 64rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-weight: bold;
            word-break:break-all;
        }
        .price_box {
            width: 100%;
            padding: 0 14rpx 8rpx 0;
        }
        .price_bg{
            width: 100%;
            height: 136rpx;
            background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_miaosha_jiage_bnj.png') right no-repeat;
            background-size: auto 138rpx;
            .top_part {
                width: 100%;
                padding-right: 14rpx;
            }
            .origin_price{
                min-width: 10rpx;
                min-height: 10rpx;
                margin-top: -12rpx;
                line-height: 34rpx;
                font-size: 24rpx;
                color: #666666;
            }
            .sale_price_box{
                width: 154rpx;
                padding-top: 14rpx;
                view:first-child{
                    padding: 6rpx 0 0 26rpx;
                    width: 100%;
                    height: 48rpx;
                    font-size: 26rpx;
                    font-weight: bold;
                    letter-spacing: 2rpx;
                    color: #fff;
                }
                .sale_price {
                    text-align: center;
                    height: 56rpx;
                    line-height: 56rpx;
                    font-size: 22rpx;
                    color: #ffffff;
                    .small_price{
                        font-size: 24rpx;
                    }
                    .big_price {
                        font-size: 36rpx;
                    }
                }
            }
            .num {
                width: fit-content;
                margin-top: -34rpx;
                font-size: 24rpx;
                color: #666666;
            }
        }
    }
}
</style>
