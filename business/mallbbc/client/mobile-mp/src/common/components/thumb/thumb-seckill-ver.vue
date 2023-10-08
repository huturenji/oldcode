<!-- 联盟秒杀商品组件：横向展示，一行一个，商品列表页面
    点击进入商品详情页
    加入购物车事件
-->
<template name="thumb-seckill-old">
    <view class="goods_item" @click="goGoodsDetail">
        <view class="goods_item_top">
            <view class="goods_img_wrap">
                <imgThumb class="goods_img" :imgSrc="goodsItem.mainImage" showThumbTips :noSale="promotionNoSale(goodsItem)" />
            </view>

            <view class="goods_item_wrap">
                <view class="itemTop">
                    <view class="goods_name">
                        <text class="storeLogo ownStoreLogo" v-if="goodsItem.storeId == '6'"></text>
                        <img :src="goodsItem.storeLogo" class="storeLogo"
                            v-if="goodsItem.storeId != '6' && goodsItem.storeLogo" />
                        <text>{{ goodsItem.skuName }}</text>
                    </view>
                    <!-- 已开始和进行中进度条 -->
                    <view v-if="props.showProgress && goodsItem.stageState == 2" class="progress-box">
                        <view class="progress-con" v-if="goodsItem.hasStock && goodsItem.canPurchase">
                            <view class="leftRoom"></view>
                            <view class="progress">
                                <view class="real-progress"
                                    :style="{ width: parseInt(goodsItem.secKillProgress) * 216 / 100 + 'rpx' }">
                                </view>
                            </view>
                            <view class="rightRoom"></view>
                            <view class="lightningBox"
                                :style="{ left: (goodsItem.hasStock && goodsItem.canPurchase) ? (parseInt(goodsItem.secKillProgress) * 216 / 100 - 2) + 'rpx' : (216 - 18) + 'rpx' }">
                                <view class="lightning"></view>
                                <view class="right-progress-text"
                                    :style="{ left: parseInt(goodsItem.secKillProgress) >= 50 ? (parseInt(goodsItem.secKillProgress) == 100 ? '-50rpx' : '-40rpx') : '40rpx', color: parseInt(goodsItem.secKillProgress) >= 50 ? '#fff' : '#f30300' }">
                                    {{ goodsItem.secKillProgress }}</view>
                            </view>
                        </view>
                        <view v-else class="allProgress" :style="{ width: '252rpx' }">100%</view>
                        <view class="lightningBox lightningBoxAll" v-if="!goodsItem.hasStock || !goodsItem.canPurchase">
                            <view class="lightning"></view>
                        </view>
                    </view>
                    <!-- 即将开始进度条 -->
                    <view v-if="props.showProgress && goodsItem.stageState == 1" class="progress-box-will"></view>

                    <view class="limit">
                        <view class="limitNum" v-if="props.showMaxNum">限量&nbsp;{{ goodsItem.promotionStock }}&nbsp;件</view>
                        <view v-if="props.showBuyNum">|</view>
                        <view class="haveBuyNum" v-if="props.showBuyNum">
                            <view v-if="goodsItem.stageState == 1" class="sold_out_num">已抢 0 件</view>
                            <view v-else class="sold_out_num">
                                已抢&nbsp;{{(!goodsItem.hasStock || !goodsItem.canPurchase) ? goodsItem.promotionStock : goodsItem.buyQuantity}}&nbsp;件
                            </view>
                        </view>
                    </view>
                </view>
                <view class="itemBottom">
                    <view class="goods_bottom_left" v-if="goodsItem.salePrice">
                        <view class="goods_price num-font fitFont">
                            <text class="small_price">￥</text>
                            <text class="big_price">{{ getPartNumber(goodsItem.promotionPrice, 'int') }}</text>
                            <text class="small_price">{{ getPartNumber(goodsItem.promotionPrice, 'decimal') }}</text>
                        </view>
                        <view class="old_price num-font">
                            ￥{{ getPartNumber(goodsItem.salePrice, 'int') }}{{ getPartNumber(goodsItem.salePrice, 'decimal') }}
                        </view>
                    </view>
                    <view class="goods_bottom_left noSale flex_row_start_center" v-else>暂无报价</view>
                    <view class="itemBottomRight">
                        <!-- 去抢购 -->
                        <view v-if="goodsItem.stageState == 2">
                            <view
                                v-if="goodsItem.secKillProgress != '100%' && goodsItem.hasStock && goodsItem.canPurchase"
                                class="goods_bottom_right buyButton"
                                @click.stop="goGoodsDetail"
                            >
                                去抢购
                            </view>
                            <view v-else class="sold_out_wrap buyButton" @click.stop="haveSoldOut">已抢光</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import activityMinxin from './minxin/activity.js'
import goodsHandler from "@/views/components/goods/handler";
import imgThumb from '@/common/components/thumb/imgThumb.vue';
import { getPartNumber } from '@/utils/common';
export default {
    name: "thumb-seckill-old",
    components: {
        imgThumb
    },
    mixins: [activityMinxin],
    data() {
        return {
            getPartNumber
        }
    },
    props: {
        goodsItem: {
            type: Object
        },
        props: {
            type: Object
        }
    },
    methods: {
        //进入商品详情页
        goGoodsDetail() {
            try {
                let { sku, storeId, mainImage } = this.goodsItem;
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
        },
        // 设置/取消提醒
        setRemind() {
            if (!this.goodsItem.salePrice) {
                uni.showToast({
                    title: '该商品暂不可售，去看看别的吧！',
                    icon: 'none'
                })
                return
            }


            let param = {
                productId: this.goodsItem.productId || this.goodsItem.id
            }
            goodsHandler.setSeckillRemind(param).then((res) => {
                if (res.state == 200) {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                    this.$set(this.goodsItem, 'remind', !this.goodsItem.remind)
                } else {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }
            });

        },
        // 已抢完
        haveSoldOut() {
            uni.showToast({
                title: '该商品已抢完，去看看别的吧！',
                icon: 'none'
            })
        }
    }
}
</script>

<style lang='scss' scoped>
.goods_item {
    width: 100%;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx 30rpx 30rpx 20rpx;
    box-sizing: border-box;
    margin-bottom: 20rpx;

    .goods_item_top {
        display: flex;

        .goods_img_wrap {
            width: 33%;
            border-radius: 12rpx;
            margin-right: 8%;
            display: flex;
            align-items: center;
            justify-content: center;

            .goods_img {
                width: 100%;
                border-radius: 15rpx;
            }
        }

        .goods_item_wrap {
            flex: 1;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .goods_name {
                font-size: 30rpx;
                color: #2D2D2D;
                font-weight: 600;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                word-break: break-word;

                .storeLogo {
                    width: 36rpx;
                    height: 36rpx;
                    vertical-align: text-top;
                    margin-right: 10rpx;

                    &.ownStoreLogo {
                        display: inline-block;
                        width: 36rpx;
                        height: 36rpx;
                        margin-top: 2rpx;
                        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_logo_jingdongqiyegou_bnj.svg');
                        background-size: 100% 100%;
                    }
                }
            }

            .progress-box {
                width: 252rpx;
                height: 24rpx;
                margin-top: 16rpx;
                position: relative;

                .allProgress {
                    width: 100%;
                    background: #f30300;
                    height: 100%;
                    color: #ffffff;
                    font-size: 18rpx;
                    line-height: 24rpx;
                    text-align: right;
                    padding-right: 24rpx;
                    border-radius: 12rpx;
                    overflow: hidden;
                }

                .progress-con {
                    width: 252rpx;
                    height: 24rpx;
                    display: flex;
                    border-radius: 12rpx;
                    overflow: hidden;
                    background: #feecec;
                }

                .leftRoom,
                .rightRoom {
                    width: 18rpx;
                    height: 24rpx;
                }

                .leftRoom {
                    background: #f30300;
                }

                .rightRoom {
                    //   background: #feecec;
                }

                .progress {
                    width: 216rpx;
                    height: 24rpx;
                    background: #f30300;
                    display: flex;
                    position: relative;

                    .real-progress {
                        background: #f30300;
                        height: 100%;
                        color: #ffffff;
                        font-size: 18rpx;
                        line-height: 24rpx;
                        text-align: right;
                        //   padding-right: 24rpx;
                    }
                }

                .lightningBox {
                    height: 36rpx;
                    width: 36rpx;
                    position: absolute;
                    top: -3px;
                    display: flex;

                    &.lightningBoxAll {
                        right: -18rpx;
                    }

                    .lightning {
                        width: 36rpx;
                        height: 36rpx;
                        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/seckill/icon_flash.png') center no-repeat;
                        background-size: 36rpx 36rpx;
                    }

                    .right-progress-text {
                        position: absolute;
                        height: 36rpx;
                        line-height: 36rpx;
                        font-size: 18rpx;
                        text-align: right;
                    }
                }
            }

            .progress-box-will {
                width: 252rpx;
                height: 24rpx;
                background: #f30300;
                border-radius: 12rpx;
                margin-top: 16rpx;
            }

            .limit {
                display: flex;
                font-size: 22rpx;
                color: #222222;
                margin-top: 12rpx;

                .limitNum {
                    margin-right: 4rpx;
                }

                .haveBuyNum {
                    margin-left: 4rpx;
                }
            }

            .itemBottom {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;

                .goods_bottom_left {
                    width: calc(100% - 170rpx);

                    &.noSale {
                        height: 100%;
                        padding-bottom: 4rpx;
                        font-size: 34rpx;
                        font-weight: bold;
                        color: #222;
                    }
                }

                .goods_price {
                    width: fit-content;
                    color: #f30300;
                    font-size: 28rpx;

                    .big_price {
                        font-size: 44rpx;
                    }
                }

                .old_price {
                    font-size: 24rpx;
                    height: 28rpx;
                    line-height: 28rpx;
                    text-decoration: line-through;
                    color: #999999;
                }

                .itemBottomRight {
                    margin-bottom: 6rpx;

                    .buyButton {
                        width: 160rpx;
                        height: 68rpx;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-weight: bold;
                        font-size: 30rpx;
                        color: #fff;
                        border-radius: 34rpx;
                        background: linear-gradient(53deg, #f30300 14%, #ff4745 100%);
                        box-shadow: 0px 4rpx 8rpx 0px rgba(241, 105, 87, 0.2);
                        white-space: nowrap;

                        &.sold_out_wrap {
                            opacity: 0.4;
                        }

                        &.cancel_remind_btn {
                            opacity: 0.4;
                        }
                    }
                }
            }
        }
    }

    .goods_item_bottom {
        display: flex;

        .limitNum,
        .haveBuyNum {
            height: 40rpx;
            padding: 0 10rpx;
            background-color: gray;
            margin-right: 20rpx;
            border-radius: 20rpx;
            color: #fff;
        }
    }
}
</style>
