<template>
    <view class="daydayBuy" v-margin="decoItem">
        <!-- title区域 含背景图 -->
        <view class="tab-right-top" v-if="!isFirstLoading">
            <!-- 顶部背景 -->
            <view
                v-if="topBackgroundImg"
                class="tabBg"
                :style="{
                    'background-image': `url(${topBackgroundImg})`,
                    'background-repeat': 'no-repeat',
                    'background-position': 'top',
                    'backgroundSize': '100% auto'
                }"
            ></view>
            <view class="right-title" ref="rightTitle">
                <!-- 左侧主标题 -->
                <view class="right-title-left">
                    <image :src="titleUrl || mainTitle.img" mode="heightFix" />
                </view>
                <!-- 右侧区域 图文 -->
                <view class="right-title-right">
                    <view class="imgOrtext" v-if="subTitle.titleStyle === 'imgOrtext'" @click="skipTo(subTitle)">
                        <view v-if="subTitle.title">{{ subTitle.title }}</view>
                        <image v-else-if="subTitle.img" :src="subTitle.img" mode="heightFix" />
                    </view>
                </view>
            </view>
        </view>

        <!-- 商品区域 -->
        <view class="goodsContent">
            <!-- banner图 -->
            <img
                v-if="bannerUrl && isShowBanner"
                :src="bannerUrl"
                style="width: 100%;height: auto;margin-bottom: 14rpx;border-radius: 20rpx;"
            />

            <!-- 横排 -->
            <template v-if="show_style === 'd_row'">
                <thumbDayBuyRow class="goods_item" v-for="item in goodsList" :key="item.sku" :goodsItem="item" :otherParams='{}' />
            </template>
            <!-- 大图 -->
            <template v-if="show_style === 'd_big'">
                <thumbDayBuyBig class="goods_item" v-for="item in goodsList" :key="item.sku" :goodsItem="item" :otherParams='{}' />
            </template>
            <!-- 一行两个 -->
            <template v-if="show_style === 'd_small'">
                <view class="goodsList">
                    <view class="goodsLeft">
                        <thumbDayBuySmall class="goods_item" v-for="item in twoGoodsList(0)" :key="item.sku" :goodsItem="item" :otherParams='{}' />
                    </view>
                    <view class="goodsRight">
                        <thumbDayBuySmall class="goods_item" v-for="item in twoGoodsList(1)" :key="item.sku" :goodsItem="item" :otherParams='{}' />
                    </view>
                </view>
            </template>
            <!-- 两图+横排 -->
            <template v-if="show_style === 'd_smallRow'">
                <!-- 前两个一行两个 -->
                <view class="goodsList">
                    <view class="goodsLeft">
                        <thumbDayBuySmall class="goods_item" v-for="item in sliceGoods(0)" :key="item.sku" :goodsItem="item" :otherParams='{}' />
                    </view>
                    <view class="goodsRight">
                        <thumbDayBuySmall class="goods_item" v-for="item in sliceGoods(1)" :key="item.sku" :goodsItem="item" :otherParams='{}' />
                    </view>
                </view>
                <!-- 后面的横排 -->
                <view class="goodsList">
                    <thumbDayBuyRow class="goods_item" v-for="item in sliceGoods(2)" :key="item.sku" :goodsItem="item" :otherParams='{}' />
                </view>
            </template>

            <!-- 加载状态 -->
            <loadingState mTop="220rpx" state="first_loading" v-if="isFirstLoading" />
            <!-- 骨架图 -->
            <thumbSkeleton :showType="skeletonStyle[show_style]" v-if="showSkeleton" />
            <!-- 缺省页 -->
            <view class="empty_page" v-if="isLoaded && goodsList.length === 0">
                <view class="empty_img"></view>
                <view class="empty_text">{{$L('当前暂无数据')}}</view>
            </view>
        </view>
    </view>
</template>

<script>
import { skipTo, isNotEmpty } from '@/utils/common.js'
import checkGoodsByAddress from '@/common/mixin/checkGoodsByAddress'
import thumbDayBuyRow from '@/components/goods/thumb/thumb-day-buy-row.vue'; // 一起买横排
import thumbDayBuySmall from '@/components/goods/thumb/thumb-day-buy-small.vue'; // 一起买一行两个
import thumbDayBuyBig from '@/components/goods/thumb/thumb-day-buy-big.vue'; // 一起买大图
import loadingState from "@/components/loading/loading.vue";
import thumbSkeleton from '@/components/goods/thumb/thumb-skeleton.vue';

export default {
    name: "deco-everyday-buy",
    mixins: [checkGoodsByAddress],
    components: {
        thumbDayBuyRow,
        thumbDayBuySmall,
        thumbDayBuyBig,
        loadingState,
        thumbSkeleton
    },
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        },
        isDecoReady: {
            type: Boolean
        }
    },
    watch: {
        decoItem: {
            handler(val) {
                if (isNotEmpty(val) && this.isDecoReady){
                    this.initData(val)
                }
            },
            deep: true,
            immediate: true
        }
    },
    computed: {
        sliceGoods() {
            return (type) => {
                let list = []
                if (this.goodsList.length === 1) {
                    if (type === 0) {
                        list = this.goodsList.slice(0, 1)
                    }
                } else if (this.goodsList.length === 2) {
                    if (type === 0) {
                        list = this.goodsList.slice(0, 1)
                    } else if (type === 1) {
                        list = this.goodsList.slice(1, 2)
                    }
                } else if (this.goodsList.length > 2) {
                    if (type === 0) {
                        list = this.goodsList.slice(0, 1)
                    } else if (type === 1) {
                        list = this.goodsList.slice(1, 2)
                    } else {
                        list = this.goodsList.slice(2)
                    }
                }
                return list
            }
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
        }
    },
    data() {
        return {
            show_style: '', // 商品样式
            topBackgroundImg: '', // title 背景
            filterNosaleGoods: false,
            mainTitle: {}, // title 主标题
            subTitle: {}, // title 副标题
            // 骨架图显示样式
            skeletonStyle: {
                d_row: 'bijia',
                d_big: 'datubijia',
                d_small: 'small',
                d_smallRow: 'small'
            },
            promotionId: '',
            bannerUrl: '',
            isShowBanner: false,
            titleUrl: '',
            isFirstLoading: true,
            showSkeleton: false,
            isLoaded: false,
            goodsList: []
        };
    },
    mounted() {},
    methods: {
        initData(data) {
            this.show_style = data.props.show_style
            this.filterNosaleGoods = data.props.filterNosaleGoods
            this.topBackgroundImg = data.data[0].topBackgroundImg
            this.mainTitle = data.data[0].mainTitle
            this.subTitle = data.data[0].subTitle

            this.getDaydayInfo()
        },
        // 获取天天专场
        getDaydayInfo() {
            return this.$request({
                url: 'v3/specialoffer/front/buyEveryday/getTodayBuyEveryday',
                method: 'GET'
            }).then(res => {
                if (res.state === 200 && res.data) {
                    this.promotionId = res.data.promotionId
                    this.bannerUrl = res.data.bannerUrl
                    this.isShowBanner = res.data.isShowBanner == 1
                    this.titleUrl = res.data.titleUrl
                    this.getOnlineGoods()
                } else {
                    this.isLoaded = true
                }
                this.isFirstLoading = false
            })
        },
        getOnlineGoods() {
            this.showSkeleton = true
            this.$request({
                url: 'v3/specialoffer/front/buyEveryday/pagePromotionBindProduct',
                data: {
                    promotionId: this.promotionId,
                    pageSize: 999,
                    pageIndex: 1
                },
                method: 'POST',
                header: {
                    "Content-Type": "application/json"
                }
            }).then(async res => {
                if (res.state === 200 && res.data) {
                    let list = res.data.products.map(item => {
                        return {...item, canPurchase: true, hasStock: true}
                    })

                    // 对是否可售进行判断
                    if (this.filterNosaleGoods) {
                        this.goodsList = await this.filterPromotionGoodsByAddress(list)
                    } else {
                        this.goodsList = list
                        this.updatePromotionGoodsByAddress(this.goodsList) //在pullProdouctPriceMixin中 再更新商品的区域限售和有货无货
                    }
                }
                this.showSkeleton = false
                this.isLoaded = true
            })
        },
        // 装修跳转相关
        skipTo(item) {
            skipTo(item, this);
        }
    }
};
</script>

<style lang="scss" scoped>
.daydayBuy {
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
            }
        }
    }

    .goods_item {
        margin-bottom: 20rpx;
    }

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

    .empty_page {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: calc((100vh - 240rpx - var(--titleBarFillHeight, 0px))*0.32 - 128rpx);

        .empty_img{
            width:256rpx;
            height: 256rpx;
            background: var(--emptyImg);
            background-size: 100% 100%;
        }

        .empty_text{
            font-size: 28rpx;
            color: $main-third-color;
        }
    }
}
</style>