<template>
    <view :class="{ 'logistics-wrapper': show }">
        <w-loading ref="loading"></w-loading>
        <view class="packageText" v-if="navList.length>1">您的礼物被拆成了多个包裹发出：</view>
        <!-- 收礼物流组件 -->
        <view class="tab-wrapper" v-if="navList.length>1">
            <scroll-view 
                class="scroll-wrapper"
                scroll-x
            >
                <view v-for="(item,index) in navList" :key="index" class="itemWrap" @click="handleNav(index)">
                    <view class="tabText" :class="{active:tabCurrentIndex == index}">{{item.text}}</view>
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
                        <image v-if="isMoreInfo(item)" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_setp_more.png" mode=""
                            class="image_shape">
                        </image>
                        <image v-else-if="index === 0" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_setp_sel.png" mode=""
                            class="image_shape">
                        </image>
                        <image v-else src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_setp_nor.png" mode="" class="image_shape">
                        </image>
                    </view>
                    <view class="right"
                        :class="[{ more_info_right: isMoreInfo(item) }]">
                        <view class="title" :style="isMoreInfo(item) ? moreInfoColor : ''"
                            @click.stop="showMoreInfo(item)">
                            {{ item.acceptTime }}
                        </view>
                        <view class="desc">{{ item.remark }}</view>
                        <view class="dashed" v-if="index !== tabItem.routeList.length - 1"></view>
                    </view>
                </view>
                <view class="hide_con"
                    v-if="tabItem.routeList.length > 3 && tabItem.routeList.length === tabItem.localRouteList.length"
                    @click="hideMoreInfo">
                    <view class="hide_btn">收起</view>
                    <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_uptrianglenew.svg" mode="widthFix" class="image_shape">
                    </image>
                </view>
            </block>

        </view>
    </view>
</template>

<script>
import {getLogistics} from "@/views/components/gift/handler";
import { copyText } from  "@/utils/common";

export default {
    data() {
        return {
            tabCurrentIndex: 0,
            navList: [],
            MORE_INFO: '展开查看更多',
            moreInfoColor: {
                color: '#F30300',
                fontWeight: 'bold'
            },
            show: false,
            scrollViewWidth:0
        }
    },
    props: {
        orderSn: {
            type: String,
            default: () => { }
        }
    },
    mounted() {
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
            this.$refs?.loading?.open();
            const params = { orderSn: this.orderSn };
            try {
                let res = await getLogistics(params);
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
                this.$refs?.loading?.close();
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
        copyStr (data) {
            copyText(data)
        },


    }
}
</script>

<style lang="scss" scoped>
.logistics-wrapper {
    padding: 28rpx 34rpx 28rpx;
    background-color: #fff;
    border-radius: 20rpx;
    position: relative;
    margin-bottom: 20rpx;
}

.swiper {
    height: 1400rpx;
}
.scroll-wrapper{
    white-space: nowrap;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.packageText{
    font-size: 28rpx;
    margin-bottom: 20rpx;
}
.tab-wrapper{
    height: 118rpx;
    width: 100%;
    font-size: 28rpx;
    .itemWrap{
        width: 162rpx;
        position: relative;
        margin-right: 36rpx;
        display: inline-block;
    }
    .tabText{
        font-size: 28rpx;
        color: #222;
        font-weight: bold;
        border: none;
        background-color: #EFF2F5;
        padding: 18rpx 44rpx 16rpx;
        border-radius: 16rpx;
        text-align: center;
    }
    .arrow-down {
        width: 26rpx;
        height: 26rpx;
        position: absolute;
        left: 65rpx;
        bottom: -12rpx;
        background-color: #EFF2F5;
        border-bottom-left-radius: 6rpx;
        transform: rotate(-45deg);
    }
    .active{
        font-size: 30rpx;
        color: $main-color;
        background-color: #EFF2F5;
    }
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

        .dashed{
            width: 2rpx;
            border-left: 2rpx dashed #c2c2c2;
            position: absolute;
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
            color: #F30300;
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

.logistic-wrapper-item {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border: 2rpx solid #A4ACB2;
    border-radius: 16rpx;
    padding: 18rpx 44rpx 30rpx;

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
        width: 30rpx;
        height: 30rpx;
        border-bottom-left-radius: 10rpx;
        transform: rotate(-45deg);
        position: absolute;
        left: 50rpx;
        bottom: -14rpx;
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