<template>
    <view class="after-sale-wrapper">
        <view class="navbar">
            <view v-for="(item, index) in navList" :key="index" class="nav-item"
                :class="{ current: currentIndex === index }" @click="tabClick(index)">
                {{  item.text  }}
            </view>
        </view>
        <swiper :current="currentIndex" class="swiper" duration="300" @change="tabChange">
            <swiper-item v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
                <block v-if="tabItem.afsList.length == 0">
                    <view class="empty-wrapper">
                        <image class="empty-img" :src="imgUrl + 'empty/icon_defpage_zwnr.png'" />
                        <text class="empty-text">暂无数据</text>
                    </view>
                </block>
                <block v-else>
                    <scroll-view class="scroll-content" scroll-y>
                        <view class="store-item" v-for="(item, index) in tabItem.afsList" :key="index">
                            <view class="item-head">
                                <view class="store-info">
                                    <image class="img" :src="imgUrl + 'goods/store_logo.png'" mode="widthFix" />
                                    <text class="name">{{  item.storeName  }}</text>
                                </view>
                                <view class="state">
                                    <text>{{  item.stateValue  }}</text>
                                </view>
                            </view>
                            <view class="item-body">
                                <view class="img-wrapper">
                                    <imgThumb class="img" :imgSrc="item.mainImage" />
                                </view>
                                <view class="detail-wrapper">
                                    <view>
                                        <text>{{  item.skuName  }}</text>
                                    </view>
                                    <view>
                                        <view>{{  item.specValues  }}</view>
                                        <view class="num">共{{  item.afsNum  }}件</view>
                                    </view>
                                </view>
                            </view>
                            <view class="item-foot">
                                <view v-if="item.afsType === 2 && item.newOrderSn" class="btn exchange-btn" @click.stop="toExchangeOrderDetail(item.newOrderSn)">换货订单</view>
                                <view class="btn detail-btn" @click.stop="toAfsDetail(item)">售后详情</view>
                            </view>
                        </view>
                    </scroll-view>
                </block>

            </swiper-item>
        </swiper>
    </view>


</template>

<script>
import giftHandler from "@/components/gift/handler";
import imgThumb from "@/components/goods/thumb/imgThumb.vue";
import { afsTypes } from '@/views/gift/common/lib/enum.js';

export default {
    components: { imgThumb },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            currentIndex: 0,
            orderSn: '',
            navList: [
                {
                    text: '换货',
                    loaded: false, //标记已经加载过
                    afsList: []
                },
                {
                    text: '维修',
                    loaded: false,
                    afsList: []
                }
            ]

        }
    },
    onShow() {
        this.orderSn = this.$Route.query.orderSn;
        this.reset();
        this.loadData();
    },
    methods: {
        // 重置所有数据未未加载状态
        reset(){
            for (let i=0; i< this.navList.length; i++){
                this.navList[i].loaded = false;
            }
        },
        tabClick(index) {
            this.currentIndex = index;
        },
        tabChange({detail}) {
            this.currentIndex = detail.current;
            this.loadData();
        },
        loadData() {
            // 当前tab已经加载过了
            if (this.navList[this.currentIndex].loaded) {
                return;
            }
            uni.showLoading();

            const params = {
                orderSn: this.orderSn,
                afsType: 0
            }
            this.currentIndex === 0 && (params.afsType = afsTypes['EXCHANGE'])
            this.currentIndex === 1 && (params.afsType = afsTypes['REPAIR'])


            giftHandler.afsList(params).then(res => {
                if (res.state === 200) {
                    this.navList[this.currentIndex].loaded = true;
                    this.navList[this.currentIndex].afsList = res.data.list;
                } else {
                    this.navList[this.currentIndex].loaded = false;
                }

            }).catch((e) => {
                console.error('error:', e);
            }).finally(() => {
                uni.hideLoading();
            })
        },
        // 跳转到订单详情： 换货订单、维修订单
        toExchangeOrderDetail(orderSn) {
            this.$Router.push({ path: '/pages/order/detail', query: { orderSn } })
        },
        // 跳转到售后详情
        toAfsDetail({ afsSn, afsType }) {
            this.$Router.push({ path: '/views/order/aftersale/detail', query: { afsSn, afsType } })
        }

    }
}
</script>

<style lang="scss" scoped>
uni-page-body {
    height: 100%;
}

.after-sale-wrapper {
    height: 100%;
}

.navbar {
    box-sizing: border-box;
    height: 80rpx;
    background-color: #fff;
    display: flex;
    justify-content: space-around;

    .nav-item {
        font-size: 32rpx;
        color: #333;
        display: flex;
        align-items: center;
        position: relative;

        &.current {
            color: #fc1c1c;
            font-size: 32rpx;

            &::after {
                content: '';
                position: absolute;
                left: 14rpx;
                bottom: 0;
                width: 36rpx;
                height: 8rpx;
                background-color: #fc1c1c;
                border-radius: 4rpx;
            }
        }
    }


}

.swiper {
    height: calc(100% - 80rpx - 20rpx);
    margin-top: 20rpx;
}

.scroll-content {
    height: 100%;
}

.empty-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .empty-img {
        width: 256rpx;
        height: 256rpx;
    }
}

.store-item {
    border-radius: 20rpx;
    margin: 0 20rpx;
    margin-bottom: 20rpx;
    background-color: #fff;

    .item-head {
        padding: 30rpx 20rpx;
        display: flex;
        justify-content: space-between;
        border-bottom: 1rpx solid rgba(0, 0, 0, .1);

        .store-info {
            display: flex;
            align-items: center;

            .img {
                height: 34rpx;
                width: 34rpx;
            }

            .name {
                margin-left: 4rpx;
                font-size: 32rpx;
                color: #2d2d2d;
                font-weight: bold;
            }
        }

        .state>text {
            color: #f30300;
            font-size: 24rpx;
        }
    }

    .item-body {
        display: flex;
        padding: 20rpx;

        .img-wrapper {
            margin-right: 20rpx;

            .img {
                width: 160rpx;
                height: 160rpx;
                border-radius: 16rpx;
            }
        }

        .detail-wrapper {
            width: 100%;

            &>view:nth-child(1) {
                overflow: hidden;
                text-overflow: ellipsis;
                width: 400rpx;
                font-weight: bold;
                font-size: 28rpx;
                color: #222222;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                line-height: 128%;
            }

            &>view:nth-child(2) {
                margin-top: 50rpx;
                width: 100%;
                display: flex;
                justify-content: space-between;

                &>view:nth-child(1) {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 300rpx;
                    white-space: nowrap;
                    font-size: 26rpx;
                    color: #999;
                    font-weight: 400;
                }

                .num {
                    color: #999;
                    font-size: 28rpx;
                }

            }
        }
    }

    .item-foot {
        padding: 0 20rpx 20rpx;
        display: flex;
        justify-content: flex-end;

        &>view:nth-child(1) {
            margin-right: 20rpx;
        }
    }
}

.btn {
    width: 164rpx;
    height: 56rpx;
    border: 1.8rpx solid #c2c2c2;
    border-radius: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    &>text {
        color: #222222;
        font-weight: bold;
        font-size: 24rpx;
    }
}

.exchange-btn {
    border-color: #f30300;
    color: #f30300;
}

.detail-btn {
    background-color: #f30300;
    border-color: #f30300;
    color: #fff;
}
</style>