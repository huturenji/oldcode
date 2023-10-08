<template>
    <view class='tab-row' v-if="nav_list.length > 0" :style="[styles]">
        <!-- 分类区域 -->
        <view class="right-cate">
            <!-- 一起买分类区域 -->
            <baseTabs
                v-if="nav_list.length > 0 && nav_list[0].title"
                :list="nav_list"
                :current="currIndex1"
                keyName="title"
                :itemStyle="{ height: '88rpx' }"
                :lineColor="`url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_bnj_xuanzhong.png') 100% 100% no-repeat`"
                lineWidth="46rpx"
                lineHeight="22rpx"
                :inactiveStyle="{color: '#222222', transform: 'scale(1)',fontSize:'30rpx'}"
                :activeStyle="{color: '#222222', transform: 'scale(1.1)', transformOrigin:'center bottom', fontWeight:'bold',transition: 'transform .3s',fontSize:'34rpx'}"
                @tabChange="tabChange1"                 
            ></baseTabs>
            <!-- 二级分类区域 -->
            <view class="right-cate2" v-if="nav_list[currIndex1].sessionList.length > 0 && nav_list[currIndex1].sessionList[0].title">
                <customTabs
                    :list="nav_list[currIndex1].sessionList"
                    :tabIndexStyle="tabIndexStyle"
                    :current='currIndex2'
                    :lineWidth="0"
                    :itemStyle="{'height': '76rpx','font-size':'36rpx','width':'184rpx'}"
                    :showScrollBar="false"
                    @change="tabChange2"
                    class="scrollView"
                />
            </view>
        </view>
                
        <!-- 商品区域 -->
        <view class="right-content">
            <!-- 商品加载骨架图 -->
            <thumbSkeleton
                v-if="!isDone"
                :showType="nav_list[currIndex1].style"
            />

            <!-- 横排 -->
            <template v-if="nav_list[currIndex1].show_style === 't_row'">
                <view class="goods_item" v-for="item in goodsList" :key="item.sku">
                    <thumbAllBuyRow :goodsItem="item" :otherParams="nav_list[currIndex1].props" />
                </view>
            </template>
            <!-- 大图 -->
            <template v-if="nav_list[currIndex1].show_style === 't_big'">
                <view class="goods_item" v-for="item in goodsList" :key="item.sku">
                    <thumbAllBuyBig :goodsItem="item" :otherParams="nav_list[currIndex1].props" />
                </view>
            </template>
            <!-- 一行两个 -->
            <template v-if="nav_list[currIndex1].show_style === 't_small'">
                <view class="goodsList">
                    <view class="goodsLeft">
                        <view class="goods_item" v-for="item in twoGoodsList(0)" :key="item.sku">
                            <thumbAllBuySmall :goodsItem="item" :otherParams="nav_list[currIndex1].props" />
                        </view>
                    </view>
                    <view class="goodsRight">
                        <view class="goods_item" v-for="item in twoGoodsList(1)" :key="item.sku">
                            <thumbAllBuySmall :goodsItem="item" :otherParams="nav_list[currIndex1].props" />
                        </view>
                    </view>
                </view>
            </template>
            
            <!-- 底部信息 -->
            <template>
                <!-- 加载中 -->
                <loadingState mTop="220rpx" state="first_loading" v-if="isFirstLoading" />
                <!-- 缺省页 -->
                <view class="empty_page" v-if="is_show_empty">
                    <view class="empty_img"></view>
                    <view class="empty_text">当前暂无数据</view>
                </view>
            </template>
        </view>
    </view>
</template>
<script>
import { throttle, skipTo } from '@/utils/common.js'
import request from '@/utils/request';
import checkGoodsByAddress from '@/common/mixin/checkGoodsByAddress'
import mixin from "@/common/components/decorate/common/mixin/index";
import thumbSkeleton from '@/common/components/thumb/thumb-skeleton.vue';
import thumbAllBuyRow from '@/common/components/thumb/thumb-all-buy-row.vue'; // 一起买横排
import thumbAllBuySmall from '@/common/components/thumb/thumb-all-buy-small.vue'; // 一起买一行两个
import thumbAllBuyBig from '@/common/components/thumb/thumb-all-buy-big.vue'; // 一起买大图
import loadingState from "@/common/components/loading/loading.vue";
import baseTabs from "@/common/components/tab/base";
import customTabs from "./custom";

export default {
    name: 'deco-together-buy',
    mixins: [mixin, checkGoodsByAddress],
    components: {
        thumbSkeleton,
        loadingState,
        customTabs,
        baseTabs,
        thumbAllBuyRow,
        thumbAllBuySmall,
        thumbAllBuyBig
    },
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        // 当前tab展示出来的商品
        goodsList() {
            let sliceList = []
            try {
                sliceList = this.nav_list[this.currIndex1].sessionList[this.currIndex2].goodsList
            } catch (error) {
                sliceList = []
            }
            return sliceList
        },
        // 场次的商品是否加载完成
        isDone() {
            let isDone = false
            try {
                isDone = this.nav_list[this.currIndex1].sessionList[this.currIndex2].isDone
            } catch (error) {
                
            }
            return isDone
        },
        twoGoodsList() {
            return (type) => {
                let list = []
                this.goodsList.forEach((item, index) => {
                    if (index % 2 === type) {
                        list.push(item)
                    }
                })
                return list
            }
        },
        // 二级分类样式
        tabIndexStyle() {
            let style = {}
            try {
                if (this.nav_list[this.currIndex1].sessionList.length > 3) {
                    style.width = '184rpx'
                } else {
                    style.flex = 1
                }
            } catch (error) {
                
            }
            
            return style
        },
        // 倒计时
        leftTime() {
            return (time) => {
                let hours = parseInt(time / 60 / 60 % 24)
                let minutes = parseInt(time / 60 % 60)
                let seconds = parseInt(time % 60)

                return {
                    hour: hours > 9 ? hours : '0' + hours,
                    min: minutes > 9 ? minutes : '0' + minutes,
                    second: seconds > 9 ? seconds : '0' + seconds
                }
            }
        }
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            decoProps: {},
            goodsComps: {
                t_row: 'bijia',
                t_big: 'datubijia',
                t_small: 'small'
            },
            cateShowEnum: {
                '即将开始': '即将开抢',
                '进行中': '进行中',
                '已结束': '已结束',
                '已开始': '已开始',
                '抢购中': '抢购中'
            },
            nav_list: [],
            // 空数据进行占位
            emptyData: [{
                title: '',
                sessionList: [{
                    isDone: true,
                    goodsList: []
                }]
            }],
            isFirstLoading: true,
            is_show_empty: false,
            currIndex1: 0, // 当前分类索引
            currIndex2: 0, // 二级分类索引
            secInterval: null,
            themeObj:null
        }
    },
    mounted() {
        this.initData(this.decoItem)
        this.initSpace(this.decoItem)

        // 倒计时
        this.secInterval = setInterval(() => {
            this.nav_list.forEach(item2 => {
                item2.sessionList.forEach(item3 => {
                    if (!isNaN(item3.distanceTime) && item3.distanceTime !== null && item3.frontState === 2) {
                        // timeEnd 用于标记时间已结束，避免数据重复请求
                        if (item3.distanceTime <= 0 && !item3.timeEnd) {
                            this.$set(item3, 'timeEnd', true)
                            throttle(() => this.getAllSessionList(), 'timeEnd', 1000)
                        } else if (item3.distanceTime > 0) {
                            this.$set(item3, 'distanceTime', item3.distanceTime-1)
                        }
                    }
                })
            })
        }, 1000);
    },
    destroyed() {
        this.secInterval && clearInterval(this.secInterval)
    },
    activated() {
        // this.changeRemindState();
    },
    methods: {
        // 初始化数据
        initData(data) {
            this.decoProps = data.props
            if (data.data.length) {
                this.nav_list = this.emptyData
                this.getAllSessionList()
            }
        },
        // 获取全部的场次列表
        getAllSessionList() {
            let list = this.decoItem.data.map((item, index) => {
                let activityData = item.activityData ? item.activityData : 0
                let timespan = (+ new Date()) + activityData * 1000 * 60 * 60 * 24
                let dateTime = new Date(timespan);
                let year = dateTime.getFullYear();
                let month = dateTime.getMonth() + 1;
                let day = dateTime.getDate();

                return {
                    title: item.categoryText,
                    stageDate: year + '-' + month + '-' + day,
                    promotionId: item.info?.promotionId,
                    activityData: item.activityData ? item.activityData : 0,
                    show_style: item.show_style,
                    style: this.goodsComps[item.show_style],
                    props: {
                        showBuyNum: item.showBuyNum,
                        showSuccessNum: item.showSuccessNum
                    },
                    done: false,
                    index,
                    index2: -1, // 用于记录二级分类索引
                    sessionList: []
                }
            })
            this.is_show_empty = false
            Promise.all(list.map(item => this.getBuySessionList(item)))
                .then(res => {
                    res.reduce((pre, cur, index) => {
                        cur.forEach((item, index2) => {
                            item.index = index2
                            item.params = {
                                stageId: item.stageId,
                                promotionId: item.promotionId
                            }
                            item.isDone = false
                            item.goodsList = []
                            item.show_style = list[index].show_style
                            item.title = item.stageContent
                        })
                        list[index].sessionList = cur
                        return [...pre, ...cur]
                    }, [])
                    // 对没有场次的空数据进行过滤
                    list = list.filter(item => item.sessionList.length !== 0)
                    
                    if (list.length > 0) {
                        this.nav_list = list
                        // 对正在进行中的场次获取商品列表
                        let current_list = this.nav_list[0].sessionList
                        // 判断顺序 1.进行中, 2.未开始，3.第1条数据
                        let list1 = current_list.filter(item => item.frontState === 2)
                        let currIndex2 = 0
                        if (list1.length > 0) {
                            currIndex2 = list1[list1.length - 1].index
                        } else {
                            let processingIndex = current_list.findIndex(item => item.frontState === 1)
                            currIndex2 = processingIndex === -1 ? 0 : processingIndex
                        }
                        this.currIndex2 = currIndex2
                        this.$set(this.nav_list[0], 'done', true)
                        this.getOnlineGoods(this.currIndex1, currIndex2, true)
                    } else {
                        // 显示缺省图
                        this.is_show_empty = true
                    }
                })
                .finally(() => {
                    this.isFirstLoading = false
                })
        },
        // 获取一起买场次列表
        getBuySessionList(params) {
            return new Promise(resolve => {
                request({
                    url: '/v3/specialoffer/front/buyTogether/getDateStage',
                    method: 'GET',
                    data: {
                        stageDate: params.stageDate,
                        promotionId: params.promotionId
                    }
                }).then(res => {
                    if (res.state == 200 && res.data.buyTogetherStageVOList) {
                        resolve(res.data.buyTogetherStageVOList)
                    } else {
                        resolve([])
                    }
                })
            })
        },
        /**
         * 接口获取商品列表
         * @param {*} tabIndex1 一级分类索引
         * @param {*} tabIndex2 二级分类索引
         */
        getOnlineGoods(tabIndex1, tabIndex2, isSliceGoods) {
            const tabInfo = this.nav_list[tabIndex1].sessionList[tabIndex2]

            // 分页数据一次性999条加载完
            request({
                url: '/v3/specialoffer/front/buyTogether/productList',
                data: {
                    ...tabInfo.params,
                    pageSize: 999,
                    pageIndex: 1
                },
                method: 'POST',
                header: {
                    "Content-Type": "application/json"
                }
            }).then(async res => {
                if (res.state === 200 && res.data) {
                    let list = res.data.list.map(item => {
                        return {...item, canPurchase: true, hasStock: true}
                    })

                    // 对是否可售进行判断
                    if (this.decoProps.filterNosaleGoods) {
                        list = await this.filterPromotionGoodsByAddress(list)
                        this.$set(tabInfo, 'goodsList', isSliceGoods ? list.slice(this.decoProps.sliceGoodsNum || 0): list)
                    } else {
                        list = await this.updatePromotionGoodsByAddress(list) //在pullProdouctPriceMixin中 再更新商品的区域限售和有货无货
                        this.$set(tabInfo, 'goodsList', isSliceGoods ? list.slice(this.decoProps.sliceGoodsNum || 0) : list)
                    }
                }
                this.$set(tabInfo, 'isDone', true);
            })
        },
        // 一起买三级tab切换事件
        tabChange1(e) {
            this.$set(this.nav_list[this.currIndex1], 'index2', this.currIndex2)
            this.currIndex1 = e.index

            // 如果该分类没有加载过，则进行数据请求
            if (!this.nav_list[this.currIndex1].done) {
                let list = this.nav_list[this.currIndex1].sessionList
                // 判断顺序 1.进行中, 2.未开始，3.第1条数据
                let list1 = list.filter(item => item.frontState === 2)
                if (list1.length > 0) {
                    this.currIndex2 = list1[list1.length - 1].index
                } else {
                    let processingIndex = list.findIndex(item => item.frontState === 1)
                    this.currIndex2 = processingIndex === -1 ? 0 : processingIndex
                }
                
                this.$set(this.nav_list[this.currIndex1], 'done', true)
                this.getOnlineGoods(this.currIndex1, this.currIndex2)
            } else {
                this.currIndex2 = this.nav_list[this.currIndex1].index2 === -1 ? 0 : this.nav_list[this.currIndex1].index2
            }
        },
        // 二级分类切换
        tabChange2({ isDone, index }) {
            this.currIndex2 = index
            if (!isDone) {
                this.getOnlineGoods(this.currIndex1, this.currIndex2)
            }
        },
        // 装修跳转相关
        skipTo(item) {
            skipTo(item, this);
        },
        // 修改提醒状态
        changeRemindState() {
            try {
                if (!!window.stageSkuId) {
                    let list = this.nav_list[this.currIndex1].sessionList[this.currIndex2].goodsList
                    let index = list.findIndex(item => item.productId == window.stageSkuId)
                    index !== -1 && this.$set(list[index], 'remind', window.remind)

                    window.stageSkuId = null;
                    window.remind = null;
                }
            } catch (error) {
                window.stageSkuId = null;
                window.remind = null;
            }
        }
    }
};
</script>
<style lang='scss' scoped>
.tab-row {
    width: 100%;
    position: relative;

    .right-cate {
        position: relative;
        .right-cate2 {
            width: 100%;
            height: 76rpx;
            margin: 8rpx 0 20rpx;
            display: flex;
            overflow-x: auto;
            border-radius: 12rpx;

            .scrollView {
                width: 100%;
            }
        }
        ::v-deep .u-tabs__wrapper__nav__line{
            bottom: 0px;
        }
    }

    .right-content {
        position: relative;
        .goodsList {
            display: flex;
            flex-wrap: wrap;

            .goodsLeft {
                display: inline-block;
                width: calc(50% - 12rpx);
                margin-right: 22rpx;
            }

            .goodsRight {
                display: inline-block;
                width: calc(50% - 12rpx);
            }
        }
    }
    .goods_item {
        width: 100%;
        margin-bottom: 20rpx;
    }

    ::v-deep .goods_h_item_wrap {
        margin-top: 0 !important;
    }

    .empty_page {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: calc((100vh - 240rpx - var(--titleBarFillHeight, 0px))*0.32 - 128rpx);

        .empty_img{
            width:256rpx;
            height: 256rpx;
            background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwnr.png") center no-repeat;
            background-size: 100% 100%;
        }

        .empty_text{
            font-size: 28rpx;
            color: $main-third-color;
        }
    }
}
</style>