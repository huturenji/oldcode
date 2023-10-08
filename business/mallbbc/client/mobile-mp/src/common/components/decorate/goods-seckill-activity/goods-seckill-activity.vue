<template>
    <view class="container_box" ref="seckill_activity__box" :style="[styles]">
        <!-- title区域 含背景图 -->
        <view class="tab-right-top" v-if="decoProps.isTopShow && decoProps.cateStyle === 2">
            <!-- 顶部背景 -->
            <view v-if="decoProps.topBackgroundImg" class="tabBg" :style="{
                'background-image': `url(${decoProps.topBackgroundImg})`,
                'background-repeat': 'no-repeat',
                'background-position': 'top',
                'backgroundSize': '100% auto'
            }"></view>
            <view class="right-title" ref="rightTitle">
                <!-- 左侧主标题 -->
                <view class="right-title-left">
                    <image :src="decoProps.mainTitle.img" mode="heightFix" />
                </view>
                <!-- 右侧区域 图文 -->
                <view class="right-title-right">
                    <view class="imgOrtext" v-if="decoProps.subTitle.titleStyle === 'imgOrtext'"
                        @click="skipTo(decoProps.subTitle)">
                        <view v-if="decoProps.subTitle.title">{{ decoProps.subTitle.title }}</view>
                        <image v-else-if="decoProps.subTitle.img" :src="decoProps.subTitle.img" mode="heightFix" />
                    </view>
                    <view class="time-left"
                        v-if="decoProps.subTitle.titleStyle === 'countDown' && countTime > 0 && countIndex === `${currIndex1}${currIndex2}`">
                        <view>剩余时间</view>
                        <view class="time-num">{{ leftTime(countTime).hour }}</view>
                        <view class="time-icon"></view>
                        <view class="time-num">{{ leftTime(countTime).min }}</view>
                        <view class="time-icon"></view>
                        <view class="time-num">{{ leftTime(countTime).second }}</view>
                    </view>
                </view>
            </view>
        </view>


        <!-- 分类区域 -->
        <view :class="{ 'seckill_top_wrap': true, 'seckill_top_wrap_fixed': decoProps.tabFixed && !isChildren }"
            :style="{ padding: `0 ${decoProps.contentLRPadding * 2 + 'rpx'}` }">
            <view class="nav_list_wrap" v-if="nav_list.length > 0">
                <!-- 一级分类 -->
                <view class="nameWarp" :style="{ margin: `0 ${- decoProps.contentLRPadding * 2 + 'rpx'}` }"
                    :class="{ showScrollBar: isPC }" v-if="decoProps.firstTabShow">
                    <tabs :list="nav_list" :current="currIndex1" keyName="activityName" :itemStyle="{ height: '84rpx' }"
                        :firstTabShow="decoProps.firstTabShow" lineHeight="8rpx" @change="changeSort">
                        <template slot="slideBlock">
                            <view class="slide"></view>
                        </template>
                    </tabs>
                </view>
                <!-- 二级分类 -->
                <view class="seckill_time_wrap" :class="{ showScrollBar: isPC }"
                    v-if="nav_list[currIndex1].sessionList.length > 0 && nav_list[currIndex1].seckillType == 'vop'">
                    <view class="seckill_time1" v-if="decoProps.cateStyle === 1">
                        <tabs :list="nav_list[currIndex1].sessionList" :lineWidth="0"
                            :itemStyle="{ 'height': '138rpx', 'font-size': '36rpx', 'padding': '0 28rpx' }"
                            :cateStyle="decoProps.cateStyle" :current='currIndex2' @change="changeList">
                        </tabs>
                    </view>
                    <view class="seckill_time2" v-if="decoProps.cateStyle === 2">
                        <customTabs
                            :list="nav_list[currIndex1].sessionList"
                            :tabIndexStyle="tabIndexStyle"
                            :current='currIndex2'
                            :lineWidth="0"
                            :itemStyle="{'height': '76rpx','font-size':'36rpx','width':'184rpx'}"
                            :showScrollBar="false"
                            @change="changeList"
                            class="scrollView"
                        />
                    </view>
                </view>
            </view>
        </view>

        <!-- 商品区域 -->
        <view class="seckill_content" v-if="nav_list.length > 0" :style="[contentStyle]">
            <!-- 商品加载骨架图 first_loading状态 -->
            <thumbSkeleton v-if="skeletonShow" showType="bijia" />

            <!-- vop秒杀 样式1 -->
            <view class="goods_wrap" v-if="nav_list[currIndex1].seckillType == 'vop' && decoProps.show_style === 'old'">
                <view class="goods_item" v-for="item in goodsList" :key="item.sku">
                    <thumbSeckillVer :goodsItem="item" :props="nav_list[currIndex1].props" />
                </view>
            </view>
            <!-- vop秒杀 样式2 -->
            <view class="goods_wrap" v-if="nav_list[currIndex1].seckillType == 'vop' && decoProps.show_style === 'new'">
                <view class="goods_item" v-for="item in goodsList" :key="item.sku">
                    <thumbSeckillHor :goodsItem="item" />
                </view>
            </view>

            <!-- <loadingState mTop="220rpx" state="first_loading" v-if="!nav_list[currIndex1].isFirstLoading" /> -->
            <view class="showMore" v-if="nav_list[currIndex1].showMore && goodsList.length > 0"
                @click="showMore(nav_list[currIndex1].bottomData)">
                {{ nav_list[currIndex1].bottomTitle }}
            </view>
            <!-- 无秒杀空页面 -->
            <view class="empty_page" v-if="emptyFlag"
                :class="{ empty_union: nav_list[currIndex1].seckillType == 'union' }">
                <view class="empty_img"></view>
                <view class="empty_text">暂无数据</view>
            </view>
        </view>
    </view>
</template>

<script>
import { skipTo } from '@/utils/common.js'
import tabs from "./seckill_tab";
import customTabs from './custom.vue'
import checkGoodsByAddress from '@/common/mixin/checkGoodsByAddress'
import mixin from "@/common/components/decorate/common/mixin/index";
import { checkPaginationHasMore } from '@/utils/common';
import thumbSeckillVer from "@/common/components/thumb/thumb-seckill-ver.vue";
import thumbSeckillHor from '@/common/components/thumb/thumb-seckill-hor.vue'; // 秒杀横排
import thumbSkeleton from '@/common/components/thumb/thumb-skeleton.vue';
import goodsHandler from "@/views/components/goods/handler.js";
import indexMixin from "@/common/components/decorate/common/mixin/index";
import { isNotEmpty } from "@/utils/common.js";

export default {
    name: "deco-deco-goods-seckill-activity",
    mixins: [checkGoodsByAddress, indexMixin],
    data() {
        return {
            isPC: false,
            decoProps: {}, // 组件的属性
            nav_list: [],
            countTime: '',
            countIndex: '',
            currIndex1: 0, // 当前分类索引
            currIndex2: 0, // 二级分类索引
            is_show_empty: false //是否显示空页面
        }
    },
    props: {
        decoItem: {},
        isChildren: {
            type: Boolean,
            default: false
        }
    },
    components: {
        thumbSeckillVer,
        thumbSeckillHor,
        thumbSkeleton,
        tabs,
        customTabs
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
        emptyFlag() {
            return !this.nav_list[this.currIndex1]?.sessionList[this.currIndex2]?.goodsList?.length
        },
        // 二级分类样式
        cateWidthStyle() {
            let style = { 'height': '76rpx', 'font-size': '36rpx' }
            try {
                if (this.nav_list[this.currIndex1].sessionList.length > 3) {
                    style.width = '184rpx'
                } else {
                    style.flex = 1
                }
            } catch (error) {
                style.flex = 1
            }
            return style
        },
        goodsList() {
            let sliceList = []
            try {
                sliceList = this.nav_list[this.currIndex1].sessionList[this.currIndex2].goodsList
            } catch (error) {
                sliceList = []
            }
            return sliceList
        },
        skeletonShow() {
            let show = false
            try {
                show = !this.nav_list[this.currIndex1].sessionList[this.currIndex2].isDone
            } catch (error) {
                show = false
            }
            return show
        },
        contentStyle() {
            let style = {
                paddingLeft: this.decoProps.contentLRPadding * 2 + 'rpx',
                paddingRight: this.decoProps.contentLRPadding * 2 + 'rpx'
            }
            // 对上边距进行区分
            if (!this.decoProps.tabFixed || this.isChildren) {
                // 不吸顶
                style.paddingTop = '20rpx'
            } else if (this.decoProps.firstTabShow) {
                // 没有一级分类
                if (this.nav_list[this.currIndex1].seckillType == 'vop') {
                    style.paddingTop = this.decoProps.cateStyle === 1 ? '20rpx' : '0rpx'
                } else {
                    style.paddingTop = '20rpx'
                }
            } else if (this.nav_list[this.currIndex1].seckillType == 'vop') {
                style.paddingTop = this.decoProps.cateStyle === 1 ? '20rpx' : '0rpx'
            } else {
                style.paddingTop = 0
            }
            return style
        },
        // 倒计时
        leftTime() {
            return (time) => {
                let timeObj = {
                    hour: '00',
                    min: '00',
                    second: '00'
                }
                if (time > 0) {
                    let hours = parseInt(time / 60 / 60 % 24)
                    let minutes = parseInt(time / 60 % 60)
                    let seconds = parseInt(time % 60)
                    timeObj.hour = hours > 9 ? hours : '0' + hours
                    timeObj.min = minutes > 9 ? minutes : '0' + minutes
                    timeObj.second = seconds > 9 ? seconds : '0' + seconds
                }
                return timeObj
            }
        }
    },
    mounted() {
         
        this.initData(this.decoItem);
    },
    methods: {
        initData(data) {
            // 组件属性
            this.decoProps = data.props

            // 组件数据
            if (data.data.length > 0) {
                this.nav_list = data.data.map((item, index) => {
                    let obj = {
                        index,
                        index2: -1,
                        done: false,
                        isFirstLoading: item.seckillType !== 'vop',
                        title: item.activityName,
                        seckillType: item.seckillType,
                        params: item.seckillType === 'vop' ? item.vopdata : item.uniondata,
                        props: {
                            showBuyNum: item.showBuyNum,
                            showMaxNum: item.showMaxNum,
                            showProgress: item.showProgress
                        },
                        showMore: item.showMore,
                        bottomTitle: item.context,
                        bottomData: item.moredata,
                        sessionList: []
                    }
                    return obj
                })

                this.changeSort(this.nav_list[0])
            }
        },

        // 获取场次列表
        getSessionList(tabIndex1) {
            const tabInfo = this.nav_list[tabIndex1]
            goodsHandler.getTodaySeckillStage({ promotionId: tabInfo.params.info.promotionId }).then(res => {
                if (res.state == 200 && res.data.seckillStages) {
                    let startIndex = -1 // 记录是否有存在倒计时的场次
                    let list = res.data.seckillStages.map((item, index) => {
                        if (item.logicState == 2) { startIndex = index }
                        let obj = {
                            params: {
                                stageId: item.stageId
                            },
                            state: item.state,
                            logicState: item.logicState,
                            logicStateValue: item.logicStateValue,
                            distanceEndTime: item.distanceEndTime,
                            endTime: item.endTime,
                            index,
                            isDone: false,
                            title: item.stageAliar,
                            goodsList: []
                        }
                        return obj
                    })

                    this.$set(tabInfo, 'sessionList', list)

                    if (startIndex !== -1) {
                        // 如果接口数据回来前，tab切换走了，则不更新二级分类索引,但进行记录
                        this.asyncCurrIndex2Change(tabIndex1, startIndex)
                        this.getActivityGoods(tabIndex1, startIndex, 1)
                        let endTime = list[startIndex].endTime.replaceAll('-', '/')
                        // 场次的结束时间，存在时进行倒计时
                        this.countTime = parseInt(((+ new Date(endTime)) - (+ new Date())) / 1000) + 1
                        this.countIndex = tabIndex1 + '' + startIndex
                        if (this.countTime > 0) {
                            // 进行中的秒杀进行倒计时
                            let secInterval = setInterval(() => {
                                if (this.countTime <= 0) {
                                    //倒计时结束，清除倒计时
                                    clearInterval(secInterval);
                                    this.getSessionList(tabIndex1);
                                } else {
                                    this.countTime = parseInt(((+ new Date(endTime)) - (+ new Date())) / 1000) + 1
                                }
                            }, 1000)
                        }
                    } else {
                        this.asyncCurrIndex2Change(tabIndex1, 0)
                        this.getActivityGoods(tabIndex1, 0, 1)
                    }
                    if (res.data.seckillStages.length > 0) {
                        this.is_show_empty = false
                    } else {
                        this.is_show_empty = true
                    }
                } else if (res.state == 255) {
                    this.is_show_empty = true
                    this.$set(tabInfo, 'sessionList', [])

                } else {
                    this.is_show_empty = true
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }
                this.$set(tabInfo, 'isFirstLoading', true)
            })
        },
        // 获取商品列表activitySession
        getActivityGoods(tabIndex1, tabIndex2, pageIndex) {
            if (!this.nav_list[tabIndex1].sessionList[tabIndex2]) {
                return
            }
            const tabInfo = this.nav_list[tabIndex1].sessionList[tabIndex2]
            const params = {
                ...tabInfo.params,
                pageSize: 20,
                pageIndex: pageIndex
            }
            goodsHandler.getSeckillProductList(params).then(async (res) => {
                if (res.state == 200 && res.data) {
                    let result = res.data
                    result.list = result.list.map(item => {
                        return { ...item, canPurchase: true, hasStock: true }
                    })

                    // 对是否可售进行判断
                    if (this.decoProps.filterNosaleGoods) {
                        let list = await this.filterPromotionGoodsByAddress(result.list)
                        this.$set(tabInfo, 'goodsList', [...tabInfo.goodsList, ...list])
                    } else {
                        this.$set(tabInfo, 'goodsList', [...tabInfo.goodsList, ...result.list])
                        this.updatePromotionGoodsByAddress(result.list) //在pullProdouctPriceMixin中 再更新商品的区域限售和有货无货
                    }

                    if (res.data.list.length > 0) {
                        this.is_show_empty = false
                    } else {
                        this.is_show_empty = true
                    }

                    // 将该场次的加载状态设置为true
                    this.$set(tabInfo, 'isDone', true)
                    // 如果数据没加载完，自动加载下一个数据
                    if (checkPaginationHasMore(result.pagination)) {
                        this.getActivityGoods(tabIndex1, tabIndex2, pageIndex + 1)
                    }
                } else {
                    this.is_show_empty = true
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }
            })
        },
        // 切换分类
        changeSort({ index, seckillType: type, done }) {
            // tab切换之前记录当前的二级分类
            this.$set(this.nav_list[this.currIndex1], 'index2', this.currIndex2)
            this.currIndex1 = index
            this.currIndex2 = this.nav_list[this.currIndex1].index2 === -1 ? 0 : this.nav_list[this.currIndex1].index2

            if (!this.isChildren) {
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 0
                })
            }
            if (done) { return }
            // 没有加载过数据，则进行数据加载
            if (type == 'vop') {
                this.getSessionList(index);
            } else if (type == 'union') {
                this.nav_list[index].sessionList = [{
                    title: '',
                    goodsList: [],
                    done: false
                }]
                this.asyncCurrIndex2Change(index, 0)
            }
            this.$set(this.nav_list[index], 'done', true)
        },
        // 切换场次
        changeList({ index, isDone }) {
            this.currIndex2 = index
            if (!isDone) {
                this.getActivityGoods(this.currIndex1, this.currIndex2, 1)
            }
            if (!this.isChildren) {
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 0
                })
            }
        },
        // 如果接口数据回来前，tab切换走了，则不更新二级分类索引,但进行记录
        asyncCurrIndex2Change(tabIndex, index2) {
            if (tabIndex === this.currIndex1) {
                this.currIndex2 = index2
            } else {
                this.$set(this.nav_list[tabIndex], 'index2', index2)
            }
        },
        // 查看更多商品跳转
        showMore(item) {
            if (item.url_type == '') {

            } else if (item.url_type == 'next') {
                const sessionList = this.nav_list[this.currIndex1].sessionList
                if (this.currIndex2 < sessionList.length - 1) {
                    this.changeList({ index: this.currIndex2 + 1, isDone: sessionList[this.currIndex2 + 1].isDone })
                }
            } else if (item.url_type == 'url') {
                try {
                    skipTo(item, this);
                } catch {
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep.uni-swiper-wrapper {
    border-radius: 5px !important;
}

.container_box {
    margin: 0 auto;
    width: 100%;

    .tab-right-top {
        margin-bottom: 20rpx;
        position: relative;

        .tabBg {
            position: absolute;
            width: 100%;
            height: 50vh;
            left: 0;
            top: -32rpx;
        }

        .right-title {
            position: relative;
            width: 100%;
            height: 48rpx;

            .right-title-left,
            image {
                height: 100%;
            }

            .right-title-right {
                position: absolute;
                top: 0;
                right: 0;
                height: 48rpx;

                .imgOrtext {
                    height: 48rpx;
                    line-height: 48rpx;
                    cursor: pointer;
                }

                .time-left {
                    height: 34rpx;
                    line-height: 34rpx;
                    display: flex;
                    margin-top: 7rpx;
                    margin-right: 110rpx;

                    >view:first-child {
                        margin-right: 12rpx;
                        font-size: 24rpx;
                        color: #666;
                        font-family: PingFangSC, PingFangSC-Regular;
                        font-weight: 400;
                    }

                    .time-num {
                        width: 44rpx;
                        height: 34rpx;
                        background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/seckill/bg_bnj_time1.svg") center no-repeat;
                        background-size: 100% 100%;
                        font-size: 26rpx;
                        color: #fff;
                        text-align: center;
                    }

                    .time-icon {
                        width: 6rpx;
                        height: 22rpx;
                        background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/seckill/timeIcon.svg") center no-repeat;
                        background-size: 100% 100%;
                        margin: 6rpx 10rpx;
                    }
                }
            }
        }
    }

    .seckill_top_wrap {
        position: relative;

        .nav_list_wrap {
            width: 100%;
            box-sizing: border-box;

            .nameWarp {
                background-color: #fff;

                ::v-deep .tabs__wrapper__nav__item {
                    justify-content: flex-start;
                    flex: 0 1 auto;
                }

                ::v-deep .slide {
                    background: #f30300;
                }
            }
        }
    }

    .seckill_content {
        width: 100%;
        padding: 0 20rpx;
        position: relative;
    }

    .seckill_time_wrap {
        width: 100%;
        display: flex;
        align-items: center;
        margin-top: 0rpx;
        box-sizing: border-box;

        .seckill_time1 {
            width: 100%;
            height: 138rpx;
            padding: 0 16rpx;

            ::v-deep .tabs__wrapper__nav__item {
                justify-content: flex-start;
                flex: 0 1 auto;
            }

            ::v-deep .tabs__wrapper__nav__item:first-child {
                padding-left: 0 !important;
            }

            view:last-child {
                margin-right: 0;
            }
        }

        .seckill_time2 {
            width: 100%;
            height: 76rpx;
            margin-top: 8rpx;
            display: flex;
            overflow-x: auto;
            border-radius: 12rpx;
        }
    }

    .goods_wrap {
        box-sizing: border-box;

        .goods_item {
            margin: 0 0 20rpx 0;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    ::v-deep .bijia-part .wrap-item:first-child {
        margin-top: 0;
    }
}

.empty_page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: calc((100vh - 240rpx)*0.32 - 128rpx);

    &.empty_union {
        padding-top: calc((100vh - 94rpx)*0.32 - 128rpx);
    }

    .empty_img {
        width: 256rpx;
        height: 256rpx;
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwnr.png');
        background-size: 100% 100%;
    }

    .empty_text {
        font-size: 28rpx;
        color: $main-third-color;
    }
}

.item_container {
    text-align: center;
}

.slide {
    width: 20px;
    height: 4px;
    background: rgb(243, 3, 0);
}

.showScrollBar::v-deep {
    overflow-y: hidden !important;
    overflow-x: auto !important;

    .seckill_time {
        width: auto !important;
    }
}

.showMore {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    font-size: 28rpx;
}
</style>
