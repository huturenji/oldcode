<template>
    <view class="deco-tab-container" :style="[styles]">
        <block v-for="(data, dataIndex) in decoItem.data" :key="dataIndex">
            <!-- 顶部数据 -->
            <view class="top-data" v-if="data.topData.showTopData && data.topData.children.length"
                :style="[setTopDataStyle(data.topData)]">
                <view class="topData_item" :class="{ 'border-left': topDataIndex > 0 }"
                    v-for="(topData, topDataIndex) in data.topData.children" :key="topDataIndex"
                    @click="skipTo(topData)">
                    <view class="topData_image">
                        <image :src="topData.img" />
                    </view>
                    <text>{{ topData.tabName }}</text>
                    <!-- 数据红点 -->
                    <view v-if="getDotShow(topData) && topData.redDotType == 'redDot'" class="red_point red_point_offset">
                        <view
                            :class='redpointConfig[topData.redDotSource] > 9 && redpointConfig[topData.redDotSource] <= 99 ? "scale2" : "scale3"'>
                            {{ getPointNum(topData.redDotSource) }}
                        </view>
                    </view>
                    <view v-if="getDotShow(topData) && topData.redDotType == 'brackets'"> [{{ getPointNum(topData.redDotSource) }}]</view>
                </view>
            </view>

            <view class="body-data" :style="[setTabStyle(data)]">
                <!-- 标题 -->
                <view class="title_data" @click="skipTo(data.titleData)">
                    <view class="left_title_data" v-if="data.titleData.showTitleData">{{ data.titleData.title }}</view>
                    <view class="right_title_data" v-if="data.moreData.showMoreData">{{ data.moreData.title }}</view>
                </view>

                <!-- tab布局 -->
                <!-- 风格1 -->
                <view class="tab-con-wrapper-style1" v-if="decoItem.props.showStyle == STYLES.STYLE1">
                    <block v-for="(tab, tabIndex) in  data.children" :key="tabIndex">
                        <view class="tab-con" v-if="tab.url_type == 'customer-service'">
                            <btn-customer class="btn-customer" :showCard="false" title="" path='' image="">
                                <view class="btn-content flex_row_between_center" :class="[data.size]">
                                    <view class="flex_row_start_center">
                                        <view class="btn_image_wrapper">
                                            <image :src="tab.img" class="image"></image>
                                        </view>
                                        <text class="btn_name">{{ tab.tabName }}</text>
                                    </view>
                                    <text class="iconfont icon_arrow_right icon_text"></text>
                                </view>
                            </btn-customer>
                            
                        </view>


                        <view class="tab-con" :class="[data.size]" @click="skipTo(tab)" v-else>
                            <view class="tab-con-left">
                                <view class="image_wrapper">
                                    <image :src="tab.img" class="image"></image>
                                </view>
                                <text class=".text">{{ tab.tabName }}</text>
                            </view>
                            <view class="tab-con-right">
                                <!-- 数据红点 -->
                                <view v-if="getDotShow(tab)" class="red_point">
                                    <view class='content'
                                        :class='redpointConfig[tab.redDotSource] > 9 && redpointConfig[tab.redDotSource] <= 99 ? "scale2" : "scale3"'>
                                        {{ getPointNum(tab.redDotSource) }}
                                    </view>
                                </view>
                                <text class="iconfont icon_arrow_right icon_text"></text>
                            </view>
                        </view>
                    </block>
                </view>
                <!-- 风格2 -->
                <view class="tab-con-wrapper-style2" v-if="decoItem.props.showStyle == STYLES.STYLE2">
                    <block v-for="(tab, tabIndex) in  data.children" :key="tabIndex">
                        <view class="tab-con" :style="[setColumnWidth(decoItem.props)]"
                            v-if="tab.url_type == 'customer-service'">
                            <btn-customer class="btn-customer" :showCard="false" title="" path='' image="">
                                <view class="btn-content" :class="[data.size]">
                                    <view class="btn_image_wrapper">
                                        <image :src="tab.img" class="image"></image>
                                    </view>
                                    <text class="btn_name">{{ tab.tabName }}</text>
                                </view>
                            </btn-customer>
                        </view>


                        <view class="tab-con" :class="[data.size]" :style="[setColumnWidth(decoItem.props)]"
                            @click="skipTo(tab)" v-else>
                            <view>
                                <image :src="tab.img" class="image"></image>
                            </view>
                            <text class=".text">{{ tab.tabName }}</text>

                            <!-- 数据红点 -->
                            <view v-if="getDotShow(tab)" class="red_point red_point_pos">
                                <view class='content'
                                    :class='redpointConfig[tab.redDotSource] > 9 && redpointConfig[tab.redDotSource] <= 99 ? "scale2" : "scale3"'>
                                    {{ getPointNum(tab.redDotSource) }}
                                </view>
                            </view>
                        </view>
                    </block>
                </view>
                
                <!-- 物流信息卡片 -->
                <ExpressCard v-if="data.showLogistics" :showLogistics="data.showLogistics"/>
                
            </view>
        </block>
    </view>
</template>

<script>
import BtnCustomer from '@/common/components/button/btn-customer'
import ExpressCard from '@/common/components/express/express-card'
import { skipTo } from "@/utils/common.js";
import indexMixin from "@/common/components/decorate/common/mixin/index";
import { isNotEmpty } from "@/utils/common.js";
import redpointConfig from '@/views/components/redpoint/enum';
import personalHandler from "@/views/components/personal/handler";



export default {
    mixins: [indexMixin],
    components: { BtnCustomer, ExpressCard },
    data() {
        return {
            STYLES: {
                STYLE1: 'column',
                STYLE2: 'row'
            },
            redpointConfig
        }
    },
    created() {
        this.getRedPointInfo();
        uni.$off('updateRedpoint');
        uni.$on('updateRedpoint', this.getRedPointInfo);
    },
    props: {
        decoItem: {},
    },
    watch: {
        /**
         * 监听到装修数据变化时，开始绘制整体框架
         */
        decoItem: {
            handler(val, oldVal) {
                if (isNotEmpty(val) && JSON.stringify(val) != JSON.stringify(oldVal)) {
                    this.initBackgroud(val)
                    this.initSpace(val)
                }
            },
            deep: true,
            immediate: true
        },
    },
    computed: {
        setColumnWidth() {
            return props => {
                let maxNum = props.maxNum || '4'
                let width = (100 / maxNum) + '%';
                return {
                    width
                }
            }
        },
        setTabStyle() {
            return param => {
                const style = {
                    backgroundColor: param.background,
                    fontSize: param.textSize + 'px'
                }
                const topData = param.topData;
                if (topData.showTopData && topData.children.length) {
                    style.borderTopLeftRadius = 0;
                    style.borderTopRightRadius = 0;
                }

                return style
            }
        },
        setTopDataStyle() {
            return param => {
                const radius = param.radius.showRadius && {
                    borderBottomLeftRadius: param.radius.leftBottom + 'px',
                    borderBottomRightRadius: param.radius.rightBottom + 'px',
                    borderTopLeftRadius: param.radius.leftTop + 'px',
                    borderTopRightRadius: param.radius.rightTop + 'px',
                }

                return {
                    backgroundColor: param.background,
                    ...radius

                }
            }
        }
    },

    methods: {
        skipTo(value) {
            skipTo(value, this)
        },
        getDotShow(item){
            let show = false
            if (item.showRedDot
                && this.redpointConfig[item.redDotSource]
                && this.redpointConfig[item.redDotSource].number > 0) {
                show = true
            }
            return show
        },
        getPointNum(key) {
            let num = this.redpointConfig[key].number
            if (key === 'redpacketTotal') {
                num = `¥${num}`
            } else if (this.redpointConfig[key].number > 99) {
                num = '99+'
            }
            return num
        },
        getRedPointInfo() {
            personalHandler.getInfo().then(res => {
                if (res.state == 200 && res.data && Object.keys(res.data).length > 0) {
                    Object.keys(this.redpointConfig).forEach(item => {
                        this.redpointConfig[item].number = res.data[this.redpointConfig[item].key]
                    })
                }
            }).catch(e => {
                console.log(e);
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.image {
    width: 72rpx;
    height: 72rpx;
}
.deco-tab-container{
    position: relative;
}

.red_point {
    width: 28rpx;
    height: 28rpx;
    text-align: center;
    background: $main-color;
    border-radius: 50%;
    font-size: 18rpx;
    font-family: PingFang SC;
    font-weight: 900;
    color: #fff;
    line-height: 28rpx;
    z-index: 5;
    box-shadow: 2rpx 4rpx 6rpx 0 rgba(249, 3, 0, 0.24);
}

.red_point_pos {
    position: absolute;
    top: -6rpx;
    right: 10rpx;
}


.top-data {
    height: 80rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 4rpx solid #fff;

    .border-left {
        border-left: 2rpx solid #9c9c9c;
    }


    .topData_item {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        .topData_image {
            margin-right: 4rpx;
            width: 38rpx;
            height: 38rpx;
        }

        .red_point_offset {
            margin-left: 4rpx;
            margin-top: 2rpx;
        }
    }
}

.body-data {
    padding: 30rpx 40rpx;
    border-radius: 20rpx;

    .title_data {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left_title_data {
            font-weight: bold;
            font-size: 34rpx;
        }

        .right_title_data {
            font-size: 30rpx;
            color: #646464;
        }
    }

    .tab-con-wrapper-style1 {


        .tab-con {
            height: 40rpx;
            margin-top: 60rpx;

            display: flex;
            justify-content: space-between;
            align-items: center;

            .btn-customer {
                width: 100%;
                .btn-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    &.big .btn_image_wrapper {
                        display: flex;
                        width: 50rpx;
                        height: 50rpx;
                        margin-right: 10rpx;

                        .image {
                            width: 100%;
                            height: 100%;
                        }

                    }

                    &.small .btn_image_wrapper {
                        display: flex;
                        margin-right: 10rpx;
                        width: 40rpx;
                        height: 40rpx;

                        .image {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    &.big .btn_name {
                        font-size: 28rpx;
                        height: 28rpx;
                        line-height: 28rpx;
                        color: #222;
                        font-weight: 400;
                    }

                    &.small .btn_name {
                        font-size: 26rpx;
                        height: 26rpx;
                        line-height: 26rpx;
                        color: #222;
                        font-weight: 400;
                    }
                }
            }

            .icon_text {
                margin-left: 10rpx;
                font-size: 20rpx;
                color: #646464;

            }

            .tab-con-left,
            .tab-con-right {
                display: flex;
                justify-content: center;
                align-items: center;

                .image_wrapper {
                    margin-right: 10rpx;
                }
            }

            &.big .image {
                width: 50rpx;
                height: 50rpx;
            }


            &.big .text {
                font-size: 28rpx;
                color: #222;
                line-height: 120%;
                font-weight: 400;
            }


            &.small .image {
                width: 40rpx;
                height: 40rpx;
            }

            &.small .text {
                font-size: 26rpx;
                color: #222;
                line-height: 120%;
                font-weight: 400;
            }
        }
    }

    .tab-con-wrapper-style2 {
        overflow: hidden;
        margin-top: 10rpx;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;

        .btn-customer {
            .btn-content {
                height: 96rpx;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                &.big .btn_image_wrapper {
                    display: flex;
                    width: 72rpx;
                    height: 72rpx;
                    margin-bottom: 4rpx;

                    .image {
                        width: 100%;
                        height: 100%;
                    }

                }

                &.small .btn_image_wrapper {
                    display: flex;

                    width: 52rpx;
                    height: 52rpx;
                    margin-bottom: 4rpx;

                    .image {
                        width: 100%;
                        height: 100%;
                    }
                }

                &.big .btn_name {
                    margin-top: 4rpx;
                    font-size: 28rpx;
                    height: 28rpx;
                    line-height: 28rpx;
                    color: #222;
                    font-weight: 400;
                }

                &.small .btn_name {
                    margin-top: 4rpx;
                    font-size: 26rpx;
                    height: 26rpx;
                    line-height: 26rpx;
                    color: #222;
                    font-weight: 400;
                }
            }
        }

        .tab-con {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: 18rpx 0;

            &.big .image {
                width: 72rpx;
                height: 72rpx;
                margin-bottom: 4rpx;
            }


            &.big .text {
                font-size: 28rpx;
                color: #222;
                line-height: 120%;
                font-weight: 400;
            }


            &.small .image {
                width: 52rpx;
                height: 52rpx;
                margin-bottom: 4rpx;
            }

            &.small .text {
                font-size: 26rpx;
                color: #222;
                line-height: 120%;
                font-weight: 400;
            }
        }
    }
}
</style>