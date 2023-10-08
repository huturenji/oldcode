<!-- 巨拾惠一起买small(一排两个)item组件
-->
<template name="goodsItem">
    <view class="goods_item" @click="goGoodsDetail(goodsItem)" v-if="goodsItem">
        <view class="goods-img" :class="{opacity_change:goodsItem.state==3}">
            <imgThumb :imgSrc="goodsItem.mainImage" showThumbTips :noSale="promotionNoSale(goodsItem)" />
        </view>
        <view class="goodsNameWrap" :class="{opacity_change:goodsItem.state==3}">
            <view :title="goodsItem.skuName" class="goods_name">
                <text>{{ goodsItem.skuName }}</text>
            </view>
        </view>
        <view class="pinInfo flex_row_start_start" :class="{marginTop16:(otherParams.showBuyNum || otherParams.showSuccessNum),opacity_change:goodsItem.state==3}">
            <view class="flex_row_center_center hadBuyNum" v-if="otherParams.showBuyNum && goodsItem.buyQuantity >= 5">
                已拼<text>{{goodsItem.buyQuantity || 0}}</text>件
            </view>
            <view class="flex_row_center_center allBuyNum" v-if="otherParams.showSuccessNum">
                <text>{{goodsItem.wishStock  || 0}}</text>件成团
            </view>
        </view>
        <view class="price_box">
            <!-- <view class="price_bg flex_column_between_start" :class="{opacity_change:goodsItem.state==3,hadStarted:goodsItem.state!=1}"> -->
            <view class="price_bg flex_column_between_start" :class="{opacity_change:goodsItem.state==3, hadStarted: true}">
                <view class="flex_row_between_start top_part">
                    <view class="origin_price">
                        <span v-if="goodsItem.salePrice">¥{{ getPartNumber(goodsItem.salePrice,'int') }}{{ getPartNumber(goodsItem.salePrice,'decimal') }}</span>
                    </view>
                    <view class="sale_price_box">
                        <!-- todo 预约功能屏蔽 -->
                        <!-- <view class="flex_row_center_center remind" @click.stop="subscribe" v-if="goodsItem.state==1" :class="{reminded:goodsItem.remind}">
                            {{ goodsItem.remind? '已预约' : '提醒我' }}
                        </view> -->
                        <view class="flex_row_center_center remind">{{priceName?priceName:'一起买'}}</view>
                        <view class="sale_price num-font" v-if="goodsItem.promotionPrice">
                            <text :style="{fontSize:fontSize('unit', getPartNumber(goodsItem.promotionPrice,'int').toString().length)}" class="unit">¥</text>
                            <text class="big_price" :style="{fontSize:fontSize('big', getPartNumber(goodsItem.promotionPrice,'int').toString().length)}">
                                {{ getPartNumber(goodsItem.promotionPrice,'int') }}
                            </text>
                            <text class="small_price" :style="{fontSize:fontSize('small', getPartNumber(goodsItem.promotionPrice,'int').toString().length)}">
                                {{ getPartNumber(goodsItem.promotionPrice,'decimal')}}
                            </text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="activity_end_icon" v-if="goodsItem.state==3"></view>
    </view>
</template>

<script>
import { getPartNumber } from '@/utils/common';
import imgThumb from '@/common/components/thumb/imgThumb.vue';
import activityMinxin from './minxin/activity.js'
// import promotionHandler from "@/views/components/promotion/common/handler";

export default {
    name: "thumb-all-buy-small",
    components: {
        imgThumb
    },
    mixins: [activityMinxin],
    data() {
        return {
            getPartNumber,
            fitFontSize:{
                unit: {1:'24',2:'24',3:'24',4:'24',5:'24',6:'24',7:'22',8:'16',9:'16',10:'16',11:'16',12:'16'},
                big: {1:'36',2:'36',3:'36',4:'36',5:'36',6:'36',7:'30',8:'28',9:'22',10:'18',11:'18',12:'18'},
                small: {1:'22',2:'22',3:'22',4:'22',5:'22',6:'22',7:'20',8:'20',9:'20',10:'18',11:'18',12:'18'}  
            }
        };
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
    props: {
        // 商品item对象
        goodsItem: {
            type: Object,
            default: () => {}
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
                    'showBuyNum': true,
                    'showSuccessNum': true
                }
            }
        },
        // 表示数据层级，用于修改父组件数据
        dataLevel: {
            type: Array
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
                })
            } catch (error) {
                console.log("跳转到商品详情出错", error);
            }
        },
        subscribe() {
            let param = {};  
            param.productId = this.goodsItem.productId;
            promotionHandler.setBuyTogetherRemind(param).then(res => {
                if (res.state == 200) {
                    this.goodsItem.remind = !this.goodsItem.remind;
                    if (this.goodsItem.remind){
                        uni.showToast({ title: '活动预约成功', icon: 'none' })
                    } else {
                        uni.showToast({ title: '取消预约成功', icon: 'none' })
                    }
                    this.$emit('changeData', this.dataLevel, 'remind', this.goodsItem.remind)
                } else {
                    uni.showToast({ title: res.msg, icon: 'none' })
                }
            }).catch(() => {
                //异常处理
            })
        }
    },
    watch:{
        
    }
};
</script>

<style scoped lang='scss'>
.goods_item {
    background: #fff;
    border-radius: 20rpx;
    box-shadow: -2rpx 0rpx 40rpx -4rpx rgba(156, 159, 169, 0.1);
    overflow: hidden;
    position: relative;
    .opacity_change {
        opacity: 0.4;
    }
    .activity_end_icon {
        position: absolute;
        top: 0;
        right: 0;
        width: 150rpx;
        height: 150rpx;
        opacity: 1;
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_common_yijieshu.png') center no-repeat;
        background-size: 100% 100%;
    }
    .goods-img {
        width: 100%;
        height: 296rpx;
        overflow: hidden;
        ::v-deep uni-image {
            border-radius: 20rpx 20rpx 0 0 !important;
        }
        ::v-deep img {
            width: 100%;
            height: auto;
            display: block;
        }
    }
    .goodsNameWrap {
        height: 76rpx;
        overflow: hidden;
        margin: 16rpx 0 14rpx;
        word-break: break-all;
    }

    .goodsNameWrap .goods_name {
        max-height: 76rpx;
        width: 100%;
        padding: 0 20rpx;
        font-size: 28rpx;
        color: #222222;
        line-height: 36rpx;
        font-weight: bold;
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
        &.marginTop16 {
            height: 36rpx;
            margin: 16rpx 0 20rpx 20rpx;
        }
        font-size: 22rpx;
        color: #666666;
        view {
            height: 100%;
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
                padding: 0 12rpx 0 0;
                color: #666666;
            }
        }
    }
    .price_box {
        padding-left: 20rpx;
    }
  .price_bg{
    width: 100%;
    height: 130rpx;
    padding: 0 4rpx 20rpx 0;
    background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_yqm_small_bnj.png") right no-repeat;
    background-size: auto 130rpx;
    .top_part {
        width: 100%;
        padding-right: 40rpx;
    }
    .origin_price{
        min-width: 10rpx;
        min-height: 10rpx;
        padding-top: 20rpx;
        line-height: 28rpx;
        font-size: 20rpx;
        color: #666666;
    }
    .sale_price_box{
        width: 104rpx;
        .remind {
            padding-top: 4rpx;
            width: 100%;
            height: 42rpx;
            font-size: 26rpx;
            font-weight: bold;
            letter-spacing: 2rpx;
            color: #ff3030;
            &.reminded {
                color: #fff;
            }
        }
        .sale_price {
            text-align: center;
            height: 40rpx;
            line-height: 40rpx;
            font-size: 16rpx;
            color: #ffffff;
            .small_price{
                font-size: 20rpx;
            }
            .big_price {
                font-size: 28rpx;
            }
        }
    }
    .num {
        font-size: 22rpx;
        color: #222222;
    }
    &.hadStarted {
        background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_yqm_small1_bnj.png") right no-repeat;
        background-size: auto 130rpx;
        .remind {
            color: #fff;
        }
    }
  }
}
</style>
