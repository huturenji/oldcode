<!-- 巨拾惠一起买row(一排一个)item组件
-->
<template name="goodsItem">
    <view class="thumb-all-buy" v-if="goodsItem">
        <view class="goods_item flex_row_center_center" @click="goGoodsDetail(goodsItem)">
            <view class="goods-img" :class="{opacity_change:goodsItem.state==3}">
                <imgThumb :imgSrc="goodsItem.mainImage" showThumbTips :noSale="promotionNoSale(goodsItem)" />
            </view>
            <view class="right flex_column_start_start">
                <view class="top" :class="{opacity_change:goodsItem.state==3}">
                    <view class="goods-name">{{goodsItem.skuName}}</view>
                </view>
                <view class="price_box">
                    <view class="price_bg flex_column_between_start" :class="{opacity_change:goodsItem.state==3,hadStarted:goodsItem.state!=1}">
                        <view class="flex_row_between_start top_part">
                            <view class="origin_price"><span v-if="goodsItem.salePrice">¥{{$getPartNumber(goodsItem.salePrice,'int')}}{{$getPartNumber(goodsItem.salePrice,'decimal')}}</span></view>
                            <view class="sale_price_box">
                                <view class="flex_row_center_center remind" @click.stop="subscribe" v-if="goodsItem.state==1" :class="{reminded:goodsItem.remind}">{{goodsItem.remind?'已预约':'提醒我'}}</view>
                                <view class="flex_row_center_center remind" v-else>{{priceName?priceName:'一起买'}}</view>
                                <view class="sale_price num-font" v-if="goodsItem.promotionPrice">
                                    <text :style="{fontSize:fontSize('unit',$getPartNumber(goodsItem.promotionPrice,'int').toString().length)}">¥</text>
                                    <text class="big_price" :style="{fontSize:fontSize('big',$getPartNumber(goodsItem.promotionPrice,'int').toString().length)}">{{$getPartNumber(goodsItem.promotionPrice,'int')}}</text>
                                    <text class="small_price" :style="{fontSize:fontSize('small',$getPartNumber(goodsItem.promotionPrice,'int').toString().length)}">{{$getPartNumber(goodsItem.promotionPrice,'decimal')}}</text>
                                </view>
                            </view>
                        </view>
                        <view class="pinInfo flex_column_end_start" :class="{opacity_change:goodsItem.state==3}">
                            <view class="flex_row_center_center hadBuyNum" v-if="otherParams.showBuyNum && goodsItem.buyQuantity >= 5">已拼<text>{{goodsItem.buyQuantity || 0}}</text>件</view>
                            <view class="flex_row_center_center allBuyNum" v-if="otherParams.showSuccessNum"><text>{{goodsItem.wishStock  || 0}}</text>件成团</view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="activity_end_icon" v-if="goodsItem.state==3"></view>
        </view>
    </view>
</template>

<script>
import imgThumb from "@/components/goods/thumb/imgThumb.vue";
import promotionHandler from "@/views/promotion/common/handler";
import activityMinxin from './minxin/activity.js'
import { mapState } from 'vuex';
export default {
    name: 'thumb-all-buy',
    props: {
        // 商品列表数据
        goodsItem:{
            type: Object,
            default:()=>{}
        },
        // 秒杀价上面展示的文字
        priceName:{
            type: String,
            default:'一起买'
        },
        otherParams: {
            type: Object,
            default: () => {
                return {
                    'showBuyNum': false,
                    'showSuccessNum': false
                }
            }
        },
        // 表示数据层级，用于修改父组件数据
        dataLevel: {
            type: Array
        }
    },
    components: {
        imgThumb
    },
    mixins:[activityMinxin],
    data() {
        return {
            fitFontSize:{
                unit: {1:'24',2:'24',3:'24',4:'24',5:'24',6:'24',7:'22',8:'16',9:'16',10:'16',11:'16',12:'16'},
                big: {1:'36',2:'36',3:'36',4:'36',5:'36',6:'36',7:'30',8:'28',9:'22',10:'18',11:'18',12:'18'},
                small: {1:'22',2:'22',3:'22',4:'22',5:'22',6:'22',7:'20',8:'20',9:'20',10:'18',11:'18',12:'18'}  
            }
        }
    },
    computed: {
        ...mapState(['hasLogin']),
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
        goGoodsDetail(goodsItem) {
            try {
                let sku = goodsItem.sku;
                this.$Router.push({
                    path: '/standard/product/detail',
                    query: {
                        sku
                    }
                });
            } catch (error) {
                console.log("跳转到商品详情出错", error);
            }
        },
        subscribe() {
            if (this.hasLogin) {
                let param = {};  
                param.productId = this.goodsItem.productId ;
                promotionHandler.setBuyTogetherRemind(param).then(res => {
                    if (res.state == 200) {
                        this.goodsItem.remind = !this.goodsItem.remind;
                        if (this.goodsItem.remind){
                            this.$api.msg('活动预约成功');
                        } else {
                            this.$api.msg('取消预约成功');
                        }
                        this.$emit('changeData', this.dataLevel, 'remind', this.goodsItem.remind)
                    } else {
                        this.$api.msg(res.msg);
                    }
                }).catch(() => {
                    //异常处理
                })
            }
        }
    }
}
</script>

<style lang='scss' scoped>
.thumb-all-buy{
    width: 100%;
    .goods_item{
        width: 100%;
        height: 244rpx;
        padding-left: 20rpx;
        border-radius: 12rpx;
        overflow: hidden;
        background: #fff;
        position: relative;
        .opacity_change {
            opacity: 0.4;
        }
        .activity_end_icon {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 150rpx;
            height: 150rpx;
            opacity: 1;
            background: url('@/static/shared/offcanvas/icon_common_yijieshu.png') center no-repeat;
            background-size: 100% 100%;
        }
        .goods-img {
            width: 204rpx;
            height: auto;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            overflow: hidden;
            background-color: #F8F6F7;
            flex-shrink: 0;
        }
        .right {
            width: calc(100% - 204rpx);
            height: 100%;
            padding: 16rpx 0rpx 0rpx 20rpx;
        }
        .top {
            width: 100%;
            padding: 0 24rpx 20rpx 0;
        }
        .goods-name {
            line-height: 136%;
            min-height: 32rpx;
            font-size: 26rpx;
            font-weight: bold;
            color: $mainnew-font-color;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
        }
        .pinInfo {
            width: fit-content;
            height: 64rpx;
            font-size: 22rpx;
            color: #666666;
            margin-top: -14rpx;
            view {
                line-height: 32rpx;
                text {
                    padding: 0 6rpx;
                    color: #06C7C3;
                }
            }
            .hadBuyNum {
                padding-right: 16rpx;
            }
            .allBuyNum {
                text {
                    padding: 0 6rpx 0 0;
                    color: #666666;
                }
            }
        }
        .price_box {
            width: 100%;
        }
        .price_bg{
            width: 100%;
            height: 132rpx;
            background: var(--togetherBuyPriceBgRow);
            background-size: auto 132rpx;
            .top_part {
                width: 100%;
                padding-right: 44rpx;
            }
            .origin_price{
                min-width: 10rpx;
                min-height: 10rpx;
                padding-top: 8rpx;
                line-height: 28rpx;
                font-size: 24rpx;
                color: #666666;
            }
            .sale_price_box{
                width: 110rpx;
                .remind {
                    padding-top: 6rpx;
                    padding-right: 2rpx;
                    width: 100%;
                    height: 42rpx;
                    font-size: 26rpx;
                    font-weight: bold;
                    letter-spacing: 2rpx;
                    color: var(--tagColor1);
                    &.reminded {
                        color: #fff;
                    }
                }
                .sale_price {
                    padding-top: 4rpx;
                    text-align: center;
                    height: 40rpx;
                    line-height: 40rpx;
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
                font-size: 24rpx;
                color: #666666;
            }
            &.hadStarted {
                background: var(--togetherBuyPriceBgRow1);
                background-size: auto 132rpx;
                .remind {
                    color: var(--prizeColor2);
                }
            }
        }
    }
}
</style>
