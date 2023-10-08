<template>
    <view>
        <w-loading ref="loading"></w-loading>
        <view class="top-wrapper">
            <!-- 点击后会触发事件，参数为当前点击的tab的 index -->
            <tabs :list="navList" :current="currentIndex" @clickTab="clickTab" itemWidth="50%" />
        </view>
        <!-- 订单列表展示部分 -->
        <swiper class="swiper" :current="currentIndex" duration="300" @change="changeTab">
            <swiper-item class="swiper-item" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
                <scroll-view class="scroll-view" scroll-y @scrolltolower="getMoreGiftList">
                    <view class="gift-container" v-for="(gift, orderIndex) in tabItem.giftList" :key="orderIndex">
                        <view class="gift-head">
                            <view class="create-time">{{ gift.createTime }}</view>
                            <view class="status-value" :style="{ color: getTextColor(gift) }">{{ getStatusValue(gift) }}
                            </view>
                        </view>
                        <!-- 我送出的 一期不显示赠品和附件，只显示主商品 -->
                        <view class="gift-body" :class="{ 'caidai-gift-body': product.productType != 0 }"
                            v-if="showProduct(product)" v-for="(product, pIndex) in gift.orderProducts" :key="pIndex"
                            @click="toGiftDetail(gift.featherId)">
                            <view class="img-wrapper">
                                <image class="main-image" :src="product.mainImage" />
                            </view>
                            <view class="product-content">
                                <view class="tag-name">
                                    <view class="tag" v-if="product.productType == 1">附件</view>
                                    <view class="tag" v-if="product.productType == 2">赠品</view>
                                    <view class="sku-name text-ellipsis">{{ product.skuName }}</view>
                                </view>
                                <view class="sku-desc text-ellipsis">{{ product.specValues || '' }}</view>
                            </view>
                            <view class="extract-info">
                                <!-- <text class="num">*{{ product.productNum }}</text> -->
                                <text class="num">*{{ product.productNum }}</text>
                            </view>
                        </view>

                        <view class="gift-foot">
                            <!-- 待支付按钮组 -->
                            <view class="btn-wrapper" v-if="gift.featherOrderInfoVO.orderState == 10">
                                <block
                                    v-for="(type, tIndex) in giftEnum[gift.giverOrReceiver][giftStatusMap.UNPAY].btnConfig"
                                    :key="tIndex">
                                    <btn-factory :type="type" :giftInfo="gift" @cancelResult="cancelResult"
                                        @order-pay-success="orderPaySuccess" />
                                </block>
                            </view>
                            <!-- 除了待支付，其他礼物状态对应的按钮 -->
                            <view class="btn-wrapper" v-else>
                                <block v-if="gift.status == giftStatusMap.TO_RECEIVE">
                                    <button class="share-btn" open-type="share"
                                        @click="currentFeatherId = gift.featherId">
                                        微信分享送礼单
                                    </button>
                                </block>

                                <block v-for="(type, tIndex) in giftEnum[gift.giverOrReceiver][gift.status].btnConfig"
                                    :key="tIndex">
                                    <btn-factory :type="type" :giftInfo="gift" :remainTime="getRemainTime(gift)"
                                        @timeout="timeout" />
                                </block>
                            </view>
                        </view>
                    </view>
                    <block v-if="tabItem.loaded && tabItem.giftList.length == 0">
                        <view class="empty-wrapper">
                            <image class="empty-image" :src="emptyImage" />
                            <text class="empty-dec">暂无礼品~</text>
                        </view>
                    </block>
                    <block v-else>
                        <block v-if="tabItem.loadingState == 'loading'">
                            <loadingState state='loading' />
                        </block>
                        <block v-if="tabItem.loadingState == 'noMore'">
                            <noMoreDataDivider color="#999999" />
                        </block>
                    </block>

                </scroll-view>
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
import BtnFactory from '@/views/components/button/btnFactory';

import Tabs from "@/views/components/tab/tabs";
import noMoreDataDivider from "@/common/components/division/index";
import loadingState from "@/common/components/loading/loading";
import { getGiftList } from '@/views/components/gift/handler';

import { giftType, giftStatusMap, giftStatusValueMap, giftEnum } from '@/common/lib/enum/gift.js';
import { ORDER_STATE } from "@/common/lib/enum/order.js";
import shareMixin from '@/common/mixin/share';
import config from '@/common/lib/config'
export default {
    mixins: [shareMixin],
    components: {
        BtnFactory,
        Tabs,
        loadingState,
        noMoreDataDivider
    },
    data() {
        return {
            giftType, giftStatusMap, giftEnum,
            emptyImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwnr.png',
            currentIndex: 0,
            currentFeatherId: 0, // 当前点击的鹅毛情id
            navList: [
                {
                    name: '我送出的',
                    type: 0, // 请求字段，送出的：0； 收到的：1
                    giftList: [],
                    loaded: false,
                    pageIndex: 1,
                    pageSize: 10,
                    loadingState: null
                },
                {
                    name: '我收到的',
                    type: 1,
                    giftList: [],
                    loaded: false,
                    pageIndex: 1,
                    pageSize: 10,
                    loadingState: null
                }
            ]
        }
    },

    computed: {
        currentTab() {
            return this.navList[this.currentIndex];
        },
        isReceiver() {
            return this.currentIndex == 1;
        }
    },

    beforeDestroy() {
        uni.$off('payTimeout');
        uni.$off('forceUpdatePage');
    },

    onShow() {
        // 列表页监听详情页支付超时事件
        uni.$off('payTimeout');
        uni.$on('payTimeout', this.payTimeout);
        // 刷新页面数据
        uni.$off('forceUpdatePage');
        uni.$on('forceUpdatePage', this.forceUpdatePage);
    },

    mounted() {
        this.currentIndex = this.$Route.query.currentIndex || 0;
        this.getGiftList();
    },
    // 设置当前页面分享到朋友
    onShareAppMessage(option) {
        let shareMessage = {
            imageUrl: config.GIFT_SHARE_IMAGE
        }
        if (option.from === 'button') {
            shareMessage.path = `/views/gift/receive/index?featherId=${this.currentFeatherId}`
        } else if (option.from === 'menu') {
            shareMessage.path = `/views/gift/list/index?currentIndex=${this.currentIndex}`
        }
        let share = this.setShareAppMessage(shareMessage)

        return share;
    },
    methods: {
        // 含有定时器的按钮组件抛出的超时事件，type就是事件名称
        timeout({ type, featherId }) {
            // 如果不是微信分享，即礼物待收礼失效
            if (type != 'weixinShare') {
                return;
            }
            for (let index = 0; index < this.currentTab.giftList.length; index++) {
                const element = this.currentTab.giftList[index];
                if (element.featherId == featherId) {
                    element.status = giftStatusMap.EXPIRED;
                }
            }
        },
        // 是否显示商品
        showProduct({ productType }) {
            // 主商品 或者 收礼人显示
            return productType == 0 || this.isReceiver;
        },
        getTextColor({ giverOrReceiver, status }) {
            return giftEnum[giverOrReceiver][status].textColor;
        },
        // 获取礼物状态所对应的值
        getStatusValue({ status, featherOrderInfoVO }) {
            if (featherOrderInfoVO.orderState == ORDER_STATE.WAIT_PAY) {
                return giftStatusValueMap.get(giftStatusMap.UNPAY);
            }
            return giftStatusValueMap.get(status);
        },
        // 根据某个截止时间获取剩余时间，单位秒，这里目前只有礼物失效剩余时间，订单支付失效时间接口没有返回
        getRemainTime({ expiredTime, status }) {
            let remainTime = 0;
            if (status == giftStatusMap.TO_RECEIVE && expiredTime != null) {
                remainTime = Math.round((new Date(expiredTime).getTime() - Date.now()) / 1000);
            }
            return remainTime;
        },

        changeTab(event) {
            this.currentIndex = event.detail.current;
            this.getGiftList();
        },
        clickTab(index) {
            this.currentIndex = index;
        },

        getGiftList() {
            if (this.currentTab.loaded) {
                return
            }
            this.$refs?.loading?.open();
            this.assignOrUpdateGiftList();
        },

        // 加载更多
        getMoreGiftList() {
            this.currentTab.pageIndex += 1;
            this.assignOrUpdateGiftList({ loadMore: true });
        },
        /**
         * @param  {...any} featherIds 删除包含featherIds的数据
         */
        deleteDataByFeatherIds(...featherIds) {
            this.currentTab.giftList = this.currentTab.giftList.filter(value => {
                return !featherIds.includes(value.featherId);
            })

            if (this.currentTab.giftList.length == 0) {
                this.currentTab.loadingState = 'no_data'
            }
        },
        payTimeout({ featherId }) {
            this.deleteDataByFeatherIds(featherId, 10)
        },

        // 取消送礼结果,前端删除这条数据，不重新请求接口
        cancelResult({ featherId }) {
            this.deleteDataByFeatherIds(featherId)
        },
        async assignOrUpdateGiftList(options = {}) {
            try {
                this.currentTab.loaded && (this.currentTab.loadingState = 'loading');
                let data = await this.loadData();
                this.currentTab.loaded = true;
                this.currentTab.loadingState = null;
                if (!data) {
                    return;
                }

                if (data.list?.length < this.currentTab.pageSize) {
                    this.currentTab.loadingState = 'noMore';

                    if (data.list.length === 0) {
                        return
                    }
                }


                if (options.loadMore) {
                    this.currentTab.giftList = this.currentTab.giftList.concat(data.list);

                } else {
                    this.currentTab.giftList = data.list;

                }

            } catch (error) {
                console.error(error);
            } finally {
                this.$refs?.loading?.close();
            }
        },
        /**
        * @param {*} payResult 支付成功、支付取消、支付失败
        */
        orderPaySuccess({ featherId, giverOrReceiver }) {
            console.log('支付完成');
            const giftList = this.navList[giverOrReceiver].giftList
            // 支付成功，刷新页面数据 礼物状态刷新为待收礼
            for (let index = 0; index < giftList.length; index++) {
                const gift = this.navList[0].giftList[index];

                if (gift.featherId == featherId) {
                    gift.featherOrderInfoVO.orderState = ORDER_STATE.WAIT_DELIVER; // 待收货
                    gift.status = giftStatusMap.TO_RECEIVE; // 待收礼
                    break;
                }
            }
        },

        // 取消送礼结果,前端删除这条数据，不重新请求接口
        cancelResult({ featherId }) {
            this.deleteDataByFeatherIds(featherId)
        },

        /**
         * 强制刷新全部tab
         */
        forceUpdatePage() {
            // 
            for (let i = 0; i < this.navList.length; i++) {
                this.navList[i].loaded = false;
                this.navList[i].pageIndex = 1;
            }
            this.assignOrUpdateGiftList();
        },

        // 只负责拉取数据，不写业务逻辑,返回一个载有数据的promise
        loadData() {
            const params = {
                pageSize: this.currentTab.pageSize,
                current: this.currentTab.pageIndex,
                type: this.currentTab.type
            }

            return new Promise(async (resolve) => {
                try {
                    let res = await getGiftList(params);
                    if (res.state == 200) {
                        resolve(res.data)
                    } else {
                        resolve(null)
                    }
                } catch (error) {
                    Promise.resolve(null)
                    console.error('loadData', error);
                } finally {
                }
            })

        },

        toGiftDetail(featherId) {
            this.$Router.push({
                path: '/views/gift/detail/index',
                query: { featherId }
            })
        },
        toGoodsList() {
            this.$Router.push({
                path: '/views/goods/list/index'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
$top-bar-height: 40px;

.text-ellipsis {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
}

.top-wrapper {
    height: $top-bar-height;
    background: #ffffff;
    border-radius: 0px 0px 8px 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}


.swiper {
    height: calc(100vh - #{$top-bar-height});

    .swiper-item {
        .scroll-view {
            height: 100%;
            padding: 0 10px;
            box-sizing: border-box;
        }
    }
}


.gift-container {
    border-radius: 10px;
    background-color: #fff;
    padding: 14px 16px 14px;
    margin-top: 10px;
}

.gift-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    .create-time {
        height: 20px;
        font-size: 14px;
        color: #999999;
        line-height: 20px;
    }

    .status-value {
        height: 20px;
        font-size: 14px;
        color: #fc8848;
        line-height: 20px;
    }
}

.caidai-gift-body {
    border-radius: 8px;
    margin-top: 10px;

    .caidai {
        position: absolute;
        width: 100px;
        height: 18px;
        background-color: red;
        color: #fff;
        text-align: center;
        left: -30px;
        transform: rotate(-45deg);
    }
}

.gift-body {
    padding: 10px 0;
    display: flex;
    overflow: hidden;
    position: relative;

    .main-image {
        width: 80px;
        height: 80px;
        border-radius: 5px;
    }

    .product-content {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .tag-name {
            display: flex;
            align-items: flex-start;
        }

        .tag {
            box-sizing: content-box;
            height: 26rpx;
            line-height: 26rpx;
            flex-shrink: 0;
            color: $main-color;
            font-size: 20rpx;
            font-weight: bold;
            border: 2rpx solid $main-color;
            border-radius: 6rpx;
            margin-right: 16rpx;
            padding: 2rpx 8rpx;
        }

        .sku-name {
            height: 36px;
            font-size: 14px;
            font-weight: bold;
            color: #222222;
            line-height: 18px;
        }

        .sku-desc {
            height: 18px;
            font-size: 13px;
            color: #999999;
            line-height: 18px;
        }
    }

    .extract-info {
        min-width: 40px;
        text-align: center;

        .num {
            color: #222;
        }
    }
}


.gift-foot {
    .btn-wrapper {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;

        ::v-deep .share-btn {
            border-radius: 28px;
            background-color: #fc3030;
            border: #fc3030 1px solid;
            text-align: center;
            color: #fff;
            min-width: 86px;
            box-sizing: border-box;
            margin-left: 10px;
            font-size: 14px;
            font-weight: 600;
            padding: 0 10px;
            margin: 0;
            margin-left: 10px;
            height: 29px;
            line-height: 29px;
            text-align: center;
        }

        ::v-deep .btn {
            min-width: 86px;
            box-sizing: border-box;
            margin-left: 10px;
        }
    }
}

.empty-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: center;
    justify-content: center;

    .empty-image {
        margin-top: -100px;
        width: 256rpx;
        height: 256rpx;
    }

    .empty-dec {
        font-weight: bold;
        font-size: 15px;
        color: #999;
    }

    .empty-btn {
        padding: 4px 10px;
        border-radius: 28px;
        margin-top: 10px;
        background-color: #f30300;
        color: #ffffff;
        font-weight: bold;
        font-size: 16px;
    }
}
</style>