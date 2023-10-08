<!--
 * @Descripttion: 待支付订单和物流信息卡片
 * @Author: mawenshu
 * @Date: 2023-05-06 13:48:09
-->
<template>
    <!-- 物流卡片 -->
    <view class="order-traces" v-if="listTrace.length">
        <swiper class="swiper" circular :autoplay="autoplay" interval="5000" @change="traceTabChange">
            <swiper-item class="trace-box" v-for="(item, listTraceIndex) in listTrace" @click="viewLogistic(item)"
                :key="listTraceIndex">
                <view class="image-wrapper">
                    <image mode="widthFix" :src="item.mainImage"></image>
                </view>
                <!-- 订单信息 -->
                <block v-if="item.orderSource === ORDER_SOURCE.NORMAL">
                    <view class="feather-desc">
                        <view class="trace-title">
                            <text>{{ item.title }}</text>
                        </view>
                        <view class="detail">
                            <text class="time-key">剩余支付时间</text>
                            <view class="time">
                                <text>{{ formatRemainTime(item.remainTime).hours }}小时 </text>
                                <text>{{ formatRemainTime(item.remainTime).minutes }}分 </text>
                                <text v-if="item.remainTime<60">{{ formatRemainTime(item.remainTime).seconds }}秒 </text>
                            </view>
                        </view>
                    </view>

                    <OrderButton class="order-button" :orderSn="item.orderSn" :type="BUTTON_TYPES.PAY" text="去支付"
                        :remainTime="item.remainTime" :order="item" :orderProductList="item.orderProductListVOList"
                        @timeout="payTimeout" @timing="timing($event, item)" @order-pay-success="orderPaySuccess" />

                </block>
                <!-- 订单物流信息 -->
                <block v-else>
                    <view class="desc">
                        <view class="trace-title">{{ item.title }}</view>
                        <view class="detail oneline">{{ item.detail }}</view>
                    </view>
                </block>

            </swiper-item>
        </swiper>
        <view class="indicator-box" v-if="listTrace.length > 1">
            <span v-for="index in listTrace.length" :key="index" class="indicator"
                :class="{ 'indicator-active': currentTraceIndex === index }"></span>
        </view>
    </view>
</template>

<script>

import { getAllTime } from "@/utils/common.js";
import { ORDER_STATE, ORDER_SOURCE, BUTTON_TYPES } from "@/common/lib/enum/order.js";
import orderHandler from '@/views/components/order/handler.js';
import OrderButton from "@/common/components/button/order-button";
import orderMixin from '@/common/mixin/orderMixin'; //订单混入

export default {
    mixins: [orderMixin],
    components: {
        OrderButton,
    },
    props: {
        showLogistics: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            maxTraceNum: 5, // 最多显示的物流信息数量
            currentTraceIndex: 0, // 物流卡片当前index
            ORDER_SOURCE,
            BUTTON_TYPES,
            listTrace: [],
        }
    },
    created(){
        // 父组件生命周期onShow比当前组件created提前，所以先调用一遍
        this.loadData();
        uni.$off('loadLogistics');
        uni.$on('loadLogistics', this.loadData)
    },
    methods: {
        loadData(){
            this.showLogistics && this.getListTrace();
        },
        formatRemainTime(remainTime) {
            return getAllTime(remainTime);
        },
        // $event 是默认参数
        timing($event, item) {
            item.remainTime = $event.remainTime;
        },
        // 待支付倒计时结束
        payTimeout() {
            this.getListTrace();
            uni.$emit('updateRedpoint');
        },
        orderPaySuccess() {
            this.getListTrace();
        },
        traceTabChange({ detail }) {
            this.currentTraceIndex = detail.current;
        },
        // 查看 待支付订单信息和近2天物流信息
        getListTrace() {
            let toPayOrderListPromise = orderHandler.getOrderList({
                orderState: ORDER_STATE.WAIT_PAY,
                pageSize: this.maxTraceNum,
                current: 1,
            });
            let listOrderTracePromise = orderHandler.listOrderTrace({
                days: 2,
            })

            Promise.all([toPayOrderListPromise, listOrderTracePromise]).then(results => {
                this.listTrace = [];
                this.currentTraceIndex = 0;
                this.$nextTick(() => {
                    this.listTrace = this.listTraceConverter(results);
                })
            })
        },
        listTraceConverter(results) {
            let listTrace = [];

            let list = null;
            for (let index = 0; index < results.length; index++) {
                const result = results[index];
                // 待支付订单列表信息 orderSource = NORMAL
                if (index === 0) {
                    list = result.data.list.map(order => {
                        return {
                            ...order,
                            title: '待支付',
                            mainImage: order.orderProductListVOList[0]?.mainImage,
                            remainTime: order.remainTime
                        }
                    })
                }
                // 物流信息
                if (index === 1) {
                    list = result.data.orderTraces.map(orderTrace => {
                        return {
                            orderSource: '',
                            title: orderTrace.tracesResultState.acceptTime,
                            detail: orderTrace.tracesResultState.remark,
                            mainImage: orderTrace.productInfos[0]?.mainImage,
                            orderSn: orderTrace.orderSn
                        }
                    }).slice(-5).reverse(); // 取倒数5个

                }

                listTrace = listTrace.concat(list);
            }
            // 先这样写着，后面再优化，可能还会改
            return listTrace.slice(0, 5);

        },
        viewLogistic({ orderSn, orderSource, featherId }) {
            if (orderSource === ORDER_SOURCE.NORMAL) {
                this.$Router.push({
                    path: '/views/order/detail/index',
                    query: { orderSn }
                })
            } else {
                // 物流信息
                this.orderSn = orderSn; 
                this.lookLogistics(orderSn); // 订单混入
            }
        },
    }
}
</script>

<style lang="scss" scoped>

.oneline {
    overflow: hidden;
    white-space: nowrap;
    word-break: break-all;
    text-overflow: ellipsis;
}
.order-traces {
    margin-top: 40rpx;
    background-color: #fff;

    .swiper {
        height: 128rpx;
        border-radius: 20rpx;
        overflow: hidden;
        transform: translateY(0);
        -webkit-transform: translateY(0);
    }

    .trace-box {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        box-sizing: border-box;
        background: #eff2f5;
        padding: 16rpx;

        .image-wrapper {
            margin-right: 16rpx;

            image {
                width: 96rpx;
                height: 96rpx;
                border-radius: 10rpx;
            }
        }

        .desc {
            padding-top: 6rpx;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow: hidden;
            font-size: 26rpx;

            .trace-title {
                font-size: 26rpx;
                color: #999999;
            }

            .detail {
                color: #666666;
                font-size: 26rpx;
                margin-top: 10rpx;
                height: 36rpx;
                line-height: 36rpx;

            }
        }

        .feather-desc {
            padding-top: 6rpx;
            flex-grow: 1;

            .trace-title {
                font-size: 28rpx;
                color: #222;
                font-weight: bold;
            }

            .detail {
                margin-top: 10rpx;
            }

            .time-key {
                color: #666666;
                font-size: 26rpx;
            }

            .time {
                color: #222;
                margin-left: 16rpx;
                font-weight: bold;
                display: inline-block;
            }
        }

        .order-button {
            ::v-deep .btn {
                background: #f30300;
                border-radius: 28rpx;
                color: #ffffff;
                font-weight: bold;
                padding: 10rpx 20rpx;
                border: none;

            }
        }


    }

    .indicator-box {
        margin-top: 10rpx;
        display: flex;
        justify-content: center;

        span {
            display: block;
        }

        .indicator {
            margin-left: 8rpx;
            transform: skew(-20deg);
            height: 6rpx;
            width: 12rpx;
            border-radius: 30rpx;
            background-color: #999999;
            transition: width 0.3s;
        }

        .indicator-active {
            background-color: $main-color;
            width: 20rpx;
        }
    }

}
</style>