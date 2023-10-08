<template>
    <!-- 收礼物流组件 -->
    <view :class="{ 'logistics-wrapper': show }">
        <view v-if="navList.length > 1" class="tips">您的礼物被拆成了多个包裹发出:</view>
        <view class="tab-wrapper" :class="{showScrollBar: isPC}" v-if="navList.length > 1">
             <scroll-view 
                class="scroll-wrapper"
                scroll-x
            >
                <view v-for="(navItem, index) in navList" :key="index" @click="handleNav(index)" class="logistic-wrapper-item" :class="index == tabCurrentIndex ? 'logistic-wrapper-active-item' : ''">
                    <view>{{ navItem.text }}</view>
                    <view class="arrow-down" v-if="index == tabCurrentIndex"></view>
                </view>
            </scroll-view>
        </view>
        <view v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
            <block v-if="tabIndex === tabCurrentIndex && tabItem">
                <view class="express-number">
                    <view class="left">
                        <text>物流单号</text>
                        <text>{{ tabItem.expressNumber || '' }}</text>
                    </view>
                    <text class="copy-btn" @click="copyStr(tabItem.expressNumber)">复制</text>
                </view>
                <view class="divide-line" v-if="navList.length == 1"></view>

                <view class="logistic" v-for="(item, index) in tabItem.routeList"
                    :class="{ more_info_logistic: isMoreInfo(item) }" :key="index">
                    <view class="left">
                        <image v-if="isMoreInfo(item)" :src="imgUrl + 'gift/icon_setp_more.svg'" mode=""
                            class="image_shape">
                        </image>
                        <image v-else-if="index === 0" :src="imgUrl + 'gift/icon_setp_sel.svg'" mode=""
                            class="image_shape">
                        </image>
                        <image v-else :src="imgUrl + 'gift/icon_setp_nor.svg'" mode="" class="image_shape">
                        </image>
                    </view>
                    <view class="right"
                        :class="[{ more_info_right: isMoreInfo(item) }, { last_item_line: index >= tabItem.routeList.length - 1 }]">
                        <view class="title" :style="isMoreInfo(item) ? moreInfoColor : ''"
                            @click.stop="showMoreInfo(item)">
                            {{ item.acceptTime }}
                        </view>
                        <view class="desc">{{ item.remark }}</view>
                    </view>
                </view>
                <view class="hide_con"
                    v-if="tabItem.routeList.length > 3 && tabItem.routeList.length === tabItem.localRouteList.length"
                    @click="hideMoreInfo">
                    <view class="hide_btn">收起</view>
                    <image :src="imgUrl + 'gift/btn_common_uptrianglenew.svg'" mode="widthFix" class="image_shape">
                    </image>
                </view>
            </block>

        </view>

    </view>
</template>

<script>
import giftHandler from "@/components/gift/handler";
import {copyText } from '@/utils/common';

export default {
    data() {
        return {
            tabCurrentIndex: 0,
            navList: [],
            imgUrl: getApp().globalData.imgUrl,
            MORE_INFO: '展开查看更多',
            moreInfoColor: {
                color: '#F30300',
                fontWeight: 'bold'
            },
            show: false,
            isPC: SnUtils.isPC()
        }
    },
    props: {
        orderSn: {
            type: String,
            default: () => { }
        },
        loaded: {
            type: Boolean,
            default: false
        }
    },
    created() {
        if (this.orderSn) {
            this.getLogisticList();
        }
    },
    methods: {
        handleNav(index) {
            this.tabCurrentIndex = index;
        },
        async getLogisticList() {
            if (this.loaded) {
                // 已经拉取过数据了
                return;
            }
            uni.showLoading();

            const params = { orderSn: this.orderSn };
            try {
                let res = await giftHandler.getLogistics(params);
                if (res.state === 200) {
                    this.show = true;
                    res.data?.traces?.forEach((trace, index) => {
                        let routeList = trace.tracesResult.routeList;

                        let localRouteList = JSON.parse(JSON.stringify(routeList)); // 拷贝一份数据

                        this.navList.push({
                            text: `包裹${index + 1}`,
                            count: trace.productInfos.length,
                            productInfos: trace.productInfos,
                            localRouteList,
                            routeList,
                            expressName: trace.tracesResult.expressName,
                            expressNumber: trace.tracesResult.expressNumber
                        });

                        // 如果需要显示的物流条数 >= 3
                        if (routeList.length >= 3) {
                            this.setRouteList(this.navList[index].routeList, localRouteList)
                        }
                        this.loaded = true;
                    });
                }

            } catch (e) {
                console.log('error', e);
            } finally {
                uni.hideLoading();
            }
        },
        // 判断是不是 当前item ‘展开查看更多’ 
        isMoreInfo(item) {
            return item.acceptTime === this.MORE_INFO;
        },
        // 展开查看更多
        showMoreInfo(item) {
            if (this.isMoreInfo(item)) {
                this.navList[this.tabCurrentIndex].routeList =
                    JSON.parse(JSON.stringify(this.navList[this.tabCurrentIndex].localRouteList)); // 拷贝一份数据
            }
        },
        hideMoreInfo() {
            this.setRouteList(this.navList[this.tabCurrentIndex].routeList, this.navList[this.tabCurrentIndex].localRouteList)
        },
        // 设置显示的物流信息
        setRouteList(target, source) {
            // 先删除原来的所有信息
            target.splice(0, target.length);
            target.push(source[0]);
            target.push({ acceptTime: this.MORE_INFO, remark: '' })
            target.push(source[source.length - 1]);
        },
        /**
         * 复制字符串
         */
        copyStr (str) {
            copyText(str);
        }
    }
}
</script>

<style lang="scss" scoped>
.logistics-wrapper {
    padding: 16rpx 34rpx 28rpx;
    background-color: #fff;
    border-radius: 20rpx;
    margin: 0rpx 20rpx;
    position: relative;
}

.tips{
    font-size: 28rpx;
    height: 60rpx;
    line-height: 40rpx;
    color: #222222;
}

.swiper {
    height: 1400rpx;
}

.express-number {
    font-size: 26rpx;
    line-height: 36rpx;
    color: #666;
    margin: 16rpx 4rpx;
    display: flex;
    justify-content: space-between;

    .left{
        &>text:nth-child(1) {
            margin-right: 16rpx;
        }
    }

    .copy-btn{
        font-size: 26rpx;
        color: #222;
        font-weight: bold;
    }
}

.divide-line {
    border-bottom: 1rpx solid #DDDCDC;
    position: absolute;
    width: 100%;
    left: 0;
}

.logistic {
    display: flex;
    margin-top: 28rpx;

    .left {
        margin-top: 4rpx;
        margin-right: 18rpx;

    }

    .right {
        position: relative;

        &::before {
            content: "";
            border-left: 2rpx dashed #c2c2c2;
            position: absolute;
            /* 这里控制左侧虚线的长度*/
            height: calc(100% - 14rpx);
            top: 40rpx;
            left: -34rpx;
        }

        .title {
            font-size: 30rpx;
            color: #222;
            font-weight: bold;
        }

        .desc {
            margin-top: 6rpx;
            font-size: 26rpx;
            color: #666;
        }
    }

    .more_info_right {
        &::before {
            top: 50rpx;
            height: 16rpx;
        }

        .title {
            line-height: 40rpx;
        }
    }

}

.more_info_logistic {
    margin-top: 32rpx;
}

.image_shape {
    width: 32rpx;
    height: 32rpx;
}

.last_item_line {
    &::before {
        content: "";
        display: none;
    }
}

.unreachable_shape {
    background-color: #ffffff !important;
    border: 3rpx solid #c2c2c2;
    border-radius: 50%;
}

.hide_con {
    display: flex;
    align-items: center;
    margin: 32rpx 50rpx 0rpx;


    .hide_btn {
        color: #F30300;
        font-weight: bold;
        font-size: 30rpx;
        margin-right: 8rpx;
    }
}
.scroll-wrapper{
    white-space: nowrap;
    display: flex;
    flex: 1;
    height: 100%;
}
.tab-wrapper{
    height: 128rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 28rpx;
    // pc端滚动条样式注释
    &.showScrollBar {
        ::v-deep ::-webkit-scrollbar {
            height: 8px !important;
            display: inline-block !important;
        }

        ::v-deep ::-webkit-scrollbar-thumb {
            border-radius: 10px !important;
            background: rgba(0, 0, 0, 0.1) !important;
        }

        ::v-deep ::-webkit-scrollbar-track {
            border-radius: 10px !important;
            background: rgba(0, 0, 0, 0.05) !important;
        }
    }
}

.logistic-wrapper-item {
    position: relative;
    border: 2rpx solid #A4ACB2;
    border-radius: 16rpx;
    padding: 18rpx 44rpx 30rpx;
    margin-right: 36rpx;
    display: inline-block;

    &>view:nth-child(1){
        color: #222222;
        height: 30rpx;
        font-weight: 700;
        line-height: 40rpx;
    }

    .arrow-down {
        background-color: #FFF5F5;
        border-left: 2rpx solid #F30300;
        border-bottom: 2rpx solid #F30300;
        width: 36rpx;
        height: 36rpx;
        border-bottom-left-radius: 10rpx;
        transform: rotate(-45deg);
        position: absolute;
        left: 56rpx;
        bottom: -20rpx;
        z-index: 100;
    }
}

.logistic-wrapper-active-item {
    border-color: #F30300;
    background-color: #FFF5F5;

    &>view:nth-child(1){
        color: #F30300;
    }
}
</style>