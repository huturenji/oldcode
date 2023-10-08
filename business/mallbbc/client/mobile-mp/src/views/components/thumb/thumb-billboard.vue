<!-- 商品组件：横向展示，一行一个，商品列表页面
    点击进入商品详情页
    加入购物车事件
-->
<template name="goodsItemH">
    <view class="billboard_wrap" :style="{left:left == true?'-160rpx':'0'}">
        <view class="goods_billboard_item_h flex_row_start_start" @click="goGoodsDetail(goods_info)">
            <imgThumb class="goods-img" :imgSrc="goods_info.mainImage?goods_info.mainImage:''" :noSale="!goods_info.isInSell" :showThumbTips="showThumbTips" />
            <view class="right flex_column_between_start">
                <view class="top flex_column_start_start" style="width: 100%;">
                    <view class="goods-name">
                        {{goods_info.skuName}}
                    </view>
                    <text class="goods-brief" v-if="!!goods_info.spuBrief">{{goods_info.spuBrief}}</text>
                </view>
                <view class="goods-price flex_row_between_center" v-if="showThumbTips && goods_info.salePrice">
                    <view class="left flex_row_start_end num-font">
                        <text class="unit">￥</text>
                        <text class="price_int">{{getPartNumber(goods_info.salePrice,'int')}}</text>
                        <text class="price_decimal">{{getPartNumber(goods_info.salePrice,'decimal')}}</text>
                    </view>
                </view>
                <view class="flex_row_start_center" style="width: 100%;">
                    <text class="storeLogo ownStoreLogo" v-if="goods_info.storeId=='6'"></text>
                    <text class="storeLogo" v-if="!!goods_info.storeLogo && goods_info.storeId!='6'" :style="{backgroundImage: 'url('+goods_info.storeLogo+')'}"></text>
                    <text class="storeName">{{goods_info.storeName}}</text>
                </view>
            </view>
        </view>
        <view class="bottomInfo">
            <view class="left">{{formatMsgTime(goods_info.orderTime, goods_info.nowTime)}}</view>
            <view class="right">{{`${goods_info.buyingFlag}个朋友买过`}}</view>
        </view>
    </view>
</template>

<script>
import imgThumb from "@/common/components/thumb/imgThumb.vue";
import {getPartNumber} from '@/utils/common';
export default {
    name: "thumb-billboard",
    data() {
        return {
             
            is_show_btn:false, //是否展示
            followId:'',
            startX:'',
            startY:'',
        }
    },
    components: {
        imgThumb,
    },
    props: {
        goods_info: {
            type: Object,
            value: {}
        },
        isWeiXinBrower:{
            type:Boolean
        },
        left:{
            type:Boolean
        },
        // 是否显示imgThumb的tips遮罩
        showThumbTips: {
            type: [Boolean],
            default: false
        }
    },
    methods: {
        getPartNumber,
        //分享商品
        goShare(goods_info){
            this.$emit("goShare",goods_info)
        },
        //进入商品详情页
        goGoodsDetail({ sku, storeId, mainImage }) {

            this.$Router.push({
                path: '/views/goods/detail/index',
                query: {
                    sku, 
                    storeId, 
                    mainImage
                }
            })
        },
        //删除收藏商品
        delGoods(id) {
            this.$emit("delGoods", id);
        },
    
        /**
             * 时间显示格式化
             * @param String 时间戳
             * @param String 系统时间
             */        
        formatMsgTime (time, system) {
            let timespan = new Date(time.replace(/-/g, '/')).getTime()
            let systemTime = new Date(system.replace(/-/g, '/')).getTime()
            var dateTime = new Date(timespan);
            var year = dateTime.getFullYear();
            var month = dateTime.getMonth() + 1;
            var day = dateTime.getDate();
            var hour = dateTime.getHours();
            var minute = dateTime.getMinutes();
            var milliseconds = 0;
            var timeSpanStr;
            milliseconds = systemTime - timespan;
            //1分钟内显示为刚刚
            if (milliseconds < 1000 * 60 * 1) {
                timeSpanStr = '刚刚';
                //一小时内展示为x分钟前
            } else if (1000 * 60 * 1 <= milliseconds && milliseconds < 1000 * 60 * 60) {
                timeSpanStr = Math.floor((milliseconds / (1000 * 60))) + '分钟前';
                //一天内展示为x小时前
            } else if (1000 * 60 * 60 * 1 <= milliseconds && milliseconds < 1000 * 60 * 60 * 24) {
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60)) + '小时前';
                //7天内展示为x天前
            } else if (1000 * 60 * 60 * 24 <= milliseconds && milliseconds < 1000 * 60 * 60 * 24 * 7) {
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
                //1个月内展示为x周前
            } else if (1000 * 60 * 60 * 24 * 7 <= milliseconds && milliseconds < 1000 * 60 * 60 * 24 * 30) {
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 7)) + '周前';
                //1年内展示为x月前
            } else if (1000 * 60 * 60 * 24 * 30 <= milliseconds && milliseconds < 1000 * 60 * 60 * 24 * 365) {
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 30)) + '月前';
                //1年以上展示为x年前
            } else if (1000 * 60 * 60 * 24 * 365 <= milliseconds){
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 365)) + '年前';
                //异常展示年月日
            } else {
                timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
            }
            return `最近购买：${timeSpanStr}`;
        }
    },
    computed: {
        
    }
}
</script>

<style lang='scss'>
    .billboard_wrap{
        position:relative;
        transition: all 0.3s;
        // margin-bottom: 20rpx;
        padding: 58rpx 30rpx 30rpx;
        border-radius: 16rpx;
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/billboard/bg_dzm_kapian.svg') no-repeat;
        background-size: 100% auto;
    }
    .goods_billboard_item_h {
        overflow: hidden;
        margin-bottom: 24rpx;
        .goods-img {
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            width: 240rpx;
            height: 240rpx;
            overflow: hidden;
            border-radius: 16rpx;
            background-color: #F8F6F7;
            flex-shrink: 0;
        }

        .right {
            height: 240rpx;
            padding: 0 0 0 24rpx;
            flex: 1;
        }

        .goods-name {
            font-size: 28rpx;
            color: #222;
            line-height: 136%;
            min-height: 76rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-weight: bold;
            word-break:break-all;
        }
        .storeLogo{
            width: 32rpx;
            height: 32rpx;
            border-radius: 32rpx;
            background-position: center;
            background-repeat: no-repeat;
            background-size: 32rpx;
            margin-right: 8rpx;
            &.ownStoreLogo {
                background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_logo_jingdongqiyegou_bnj.svg');
                background-size: 32rpx;
            }
        }
        .storeName {
            font-size: 26rpx;
            color: #222;
            line-height: 38rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            word-break: break-word;
        }
        .goods-price {
            width: 100%;
            margin-top: 38rpx;
            font-weight: bold;
            .left {
                color: var(--confirmBtnBgColor2);
                align-items: baseline;
                .unit{
                    letter-spacing: -2px;
                }
                .unit,
                .price_decimal {
                    font-size: 28rpx;
                }

                .price_int {
                    font-size: 40rpx;
                    line-height: 40rpx;
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
    .bottomInfo{
        display: flex;
        justify-content:space-between;
        color: $main-third-color;
        font-size: 26rpx;
        line-height: 1.38;
        background: #fff;
        .left,.right{
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            word-break: break-word;
        }
        .right{
            text-align: right;
        }
    }
</style>
