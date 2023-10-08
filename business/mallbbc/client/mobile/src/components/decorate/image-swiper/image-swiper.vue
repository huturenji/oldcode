<template>
    <view v-if="showSwiper" class="image_swiper_wrap">
        <!-- 商品轮播 -->
        <view class="carousel_bottom_wrap_goods" ref="carousel_bottom_wrap_goods" v-margin="decoItem" v-if="decoProps.dataType === 'goods'">
            <swiper
                class="carousel carousel_bottom"
                :autoplay="false"
                next-margin="202rpx"
                :current="current"
                @change="change"
                :style="{ height: carouselHeight }"
            >
                <swiper-item
                    v-for="(item, index) in goodsList"
                    :key="index"
                    class="carousel-item"
                    @click="skipTo(item)"
                >
                    <thumbAllBuyV ref="thumbAllBuyV" :goodsItem="item" :dataLevel="[index]" @changeData="changeData"></thumbAllBuyV>
                </swiper-item>
            </swiper>
            <!-- 这里轮播点用组件，不用自带的 -->
            <customSwiperDot v-if="goodsList.length > 0" :dotNum="goodsList.length" :currentIndex="current" background="rgba(0,0,0,0.18)" :swiperDotStyle="{position:'absolute',bottom:12 + 'rpx'}"></customSwiperDot>
        </view>
        <!-- 图片轮播 使用之前的轮播装修组件 -->
        <view class="carousel_bottom_wrap" ref="carousel_bottom_wrap" v-if="decoProps.dataType === 'img'" :current="swiperCurrent" v-margin="decoItem">
            <view class='blur-bg-area'>
                <view v-show='blurBackgroundImg && showVague' class='blur-bg' :style='blurBgStyle'></view>  
            </view>
            <swiper
                class="carousel carousel_bottom"
                circular
                :interval="decoProps.autoplaySpeed ? decoProps.autoplaySpeed * 1000 : 3000"
                :autoplay="carouselAutoplay"
                :current="current"
                @change="change"
                @animationfinish="(e) => { swiperTransition(e, decoItem) }"
                :style="{ height: carouselHeight }"
            >
                <swiper-item
                    v-for="(item, index) in decoItem.data"
                    :key="index"
                    class="carousel-item"
                    :class="{pad10:current==index}"
                    :style="{paddingLeft:current == index ? decoProps.imageSpacing * 2+'rpx':'0',paddingRight:current==index ? decoProps.imageSpacing*2+'rpx':'0'}"
                    @click="skipTo(item)"
                >
                    <image class="swiper_img" mode="widthFix" :src="item.img" @load="imgLoad(index)" :style="{borderRadius:swiperImgBorderRadio}" ref="swiperImg" />
                </swiper-item>
            </swiper>
            <!-- 这里轮播点用组件，不用自带的 -->
            <customSwiperDot :dotNum="decoItem.data.length" :currentIndex="current" background="rgba(0,0,0,0.18)" :swiperDotStyle="{position:'absolute',bottom:swiperDotPostion}"></customSwiperDot>
        </view>
    </view>
</template>

<script>
import { skipTo, isEmpty, isNotEmpty } from "@/utils/common.js";
import pullProdouctPriceMixin from '@/common/mixin/pullProdouctPriceMixin'
import checkGoodsByAddress from '@/common/mixin/checkGoodsByAddress'
import eventsMixin from '../common/mixin/eventsMixin'
import customSwiperDot from '@/components/swiper-dot/index.vue';
import thumbAllBuyV from '@/components/goods/thumb/thumb-all-buy-v2.vue';
import goodsHandler from '@/components/goods/handler';

export default {
    name: "deco-goods-swiper",
    mixins: [eventsMixin, pullProdouctPriceMixin, checkGoodsByAddress],
    props: {
        decoItem: {
            type: Object,
            default: () => {}
        },
        isDecoReady: {}
    },
    components: {
        customSwiperDot,
        thumbAllBuyV
    },
    watch: {
        parentScrollTop:{
            handler(val, oldVal) {
                //不在初始化时执行，避免多次触发同一事件
                if (oldVal != undefined) {

                }
            },
            immediate: true
        },
        decoItem:{
            handler(val){
                //初始化第一张图
                if (isNotEmpty(val) && this.isDecoReady) {
                    this.initData(JSON.parse(JSON.stringify(val)))
                }
            },
            deep: true,
            immediate: true
        }
    },
    computed: {
        showSwiper() {
            let show = false
            if (this.decoItem.props.dataType === 'goods') {
                show = this.goodsList.length > 0
            } else if (this.decoItem.props.dataType === 'img') {
                show = this.decoItem.data.length > 0
            }
            return show
        },
        swiperDotPostion(){
            let num = 12
            if(this.decoItem.props.swiperDotPosition){
                num = Number(this.decoItem.props.swiperDotPosition)*2
            }
            return num + 'rpx'
        },
        swiperImgBorderRadio(){
            let num = 20
            if(this.decoItem.props.borderRadio==0||this.decoItem.props.borderRadio){
                num = Number(this.decoItem.props.borderRadio)*2
            }
            return num + 'rpx'
        },
        blurBgStyle(){
            if (isEmpty(this.blurBackgroundImg) || this.blurLock){
                return;
            }
            return {
                background: "url('" + this.blurBackgroundImg + "') center no-repeat",
                backgroundSize: '100%'
            }
        },
        showVague(){
            return isNotEmpty(this.decoItem) && this.decoItem.props.showVague && !this.blurLock
        }
    },
    data() {
        return {
            decoProps: {}, // 组件的属性
            goodsList: [],
            swiperCurrent: 0, // 轮播当前索引
            carouselAutoplay: true, // 自动播放
            blurBackgroundImg: null,
            blurLock: false,//暂停高斯模糊效果
            current: 0,
            carouselHeight: '',
            countTime: 0 // 倒计时
        };
    },
    created(){
        //监听样式反转事件，并反转样式
        this.eventsId.decoReverse = this.custEvents.addListener('decoReverse', item => {
            if (item.reverse){
                this.blurLock = true;
            } else {
                this.blurLock = false;
            }
        })
    },
    beforeDestroy(){
        this.custEvents.remove('decoReverse', this.eventsId.decoReverse)
    },
    methods: {
        initData(val) {
            this.decoProps = val.props
            if (this.decoProps.dataType == 'goods') {
                this.getGoods(val)
            } else if (this.decoProps.dataType == 'img') {
                this.$nextTick(() => {
                    // 计算图片的宽高
                    this.blurBackgroundImg = val.data[0].img;
                })
            }
        },
        computedHeight() {
            this.$nextTick(() => {
                // 计算图片的宽高
                let width = this.$refs['carousel_bottom_wrap_goods'].$el.clientWidth
                this.carouselHeight = width / 375 * 362 * 2 + 'rpx'
            })
        },
        imgLoad(index) {
            if (index === 0) {
                // 获取第一张图片的高度
                this.carouselHeight = this.$refs['swiperImg'][0].$el.offsetHeight + 'px'
            }
        },
        // 相关跳转
        skipTo(item) {
            skipTo(item, this)
        },
        // 轮播完切换高斯模糊背景
        swiperTransition(e, item) {
            const index = e.detail.current;
            this.swiperCurrent = index;
            this.blurBackgroundImg = item.data[index].img;
        },
        //轮播图切换
        change(e) {
            this.current = e.detail.current;       
        },
        getGoods(data) {
            if (data.props.sources === 'upload') {
                let param = {
                    skus: data.data[0].ids
                };
                goodsHandler.getListBySkus(param).then(async res => {
                    if (res.state === 200 && res.data.length > 0) {
                        let list = res.data.map(item => {
                            return {...item, canPurchase: true, hasStock: true}
                        })

                        // 对是否可售进行判断
                        if (this.decoProps.filterNosaleGoods) {
                            list = await this.filterGoodsByAddress(list)
                        } else {
                            list = await this.updateGoodsByAddress(list)
                        }

                        this.goodsList = list
                        if (this.goodsList.length > 0) {
                            this.computedHeight()
                        }
                    }
                })
            } else if (data.props.sources === 'buytogether' && data.data && data.data[0]) {
                this.getBuySessionList(data.data[0].info?.promotionId)
            }
        },
        // 获取一起买场次列表
        getBuySessionList(id) {
            let dateTime = new Date();
            let year = dateTime.getFullYear();
            let month = dateTime.getMonth() + 1;
            let day = dateTime.getDate();
            this.$request({
                url: 'v3/specialoffer/front/buyTogether/getDateStage',
                method: 'GET',
                data: {
                    stageDate: year + '-' + month + '-' + day,
                    promotionId: id
                }
            }).then(res => {
                if (res.state == 200 && res.data.buyTogetherStageVOList) {
                    const list = res.data.buyTogetherStageVOList
                    // 只查找进行中 / 未开始 的场次
                    let index = list.findIndex(item => item.frontState === 2 || item.frontState === 1)
                    if (index !== -1) {
                        this.getSessionGoodsList(list[index].stageId, list[index].promotionId)

                        this.countTime = list[index].distanceTime
                        if (this.countTime > 0 && list[index].frontState === 2) {
                            // 进行中的秒杀进行倒计时
                            let secInterval = setInterval(() => {
                                if (this.countTime <= 0) {
                                    //倒计时结束，清除倒计时
                                    clearInterval(secInterval);
                                    this.getBuySessionList(id);
                                } else {
                                    this.countTime -= 1
                                }
                            }, 1000)
                        }
                    }
                }
            })
        },
        // 获取一起买商品列表
        getSessionGoodsList(stageId, promotionId) {
            this.$request({
                url: 'v3/specialoffer/front/buyTogether/productList',
                data: {
                    stageId: stageId,
                    promotionId: promotionId,
                    pageSize: 10,
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
                        this.goodsList = list.slice(0, this.decoProps.showGoodsNum || 3)
                    } else {
                        list = await this.updatePromotionGoodsByAddress(list)
                        this.goodsList = list.slice(0, this.decoProps.showGoodsNum || 3)
                    }

                    if (this.goodsList.length > 0) {
                        this.computedHeight()
                    }
                }
            })
        },
        /**
         * 用于子组件修改分类下数据
         * @param {*} keys 索引集合
         * @param {*} key 需要修改数据的key
         * @param {*} val 需要修改数据的值
         */
        changeData(keys, key, val) {
            let data = keys.reduce((pre, cur) => pre[cur], this.goodsList)
            this.$set(data, key, val)
        }
    }
};
</script>

<style lang="scss" scoped>
.carousel_bottom_wrap_goods {
    display: flex;
    justify-content: center;
    position: relative;

    .carousel_bottom {
        overflow: hidden;
    }

    .carousel {
        width: 100%;

        .carousel-item {
            width: 100%;
            height: 100%;
            overflow: hidden;
            padding-right: 20rpx;
            .content {
                height: 696rpx;
                background: #fff;
            }
        }

        image {
            width: 100%;
            height: 100%;
            border-radius: 20rpx;
            overflow: hidden;
        }
    }
}

.carousel_bottom_wrap {
  display: flex;
  justify-content: center;
  position: relative;

    .blur-bg-area{
        position:fixed;
        top:0;
        left: auto;
        width: var(--page-width);
        overflow: hidden;
        z-index: -1;
        .blur-bg{
            height:376rpx;
            width:1034px;
            margin-left: -50%;
            filter: blur(80rpx);
        }
    }

    .carousel_bottom {
        overflow: hidden;
    }
    .carouselShadow {
        position: absolute;
        width: 750rpx;
        height: 194rpx;
    }
    .carousel {
        width: 100%;
        // border-radius: 20rpx;
        .carousel-item {
            width: 100%;
            height: 100%;
            // padding: 0 1px;
            overflow: hidden;
            // border-radius: 20rpx;
            
            &.pad10{
                padding: 0 20rpx;
            }
        }

        image {
            width: 100%;
            height: 100%;
            // border-radius: 20rpx;
            overflow: hidden;
        }

        .itemImg {
            width: 100%;
            height: 100%;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: contain;
            // border-radius: 20rpx;
        }

        .swiper_img {
            width: 100%;
            height: 100%;
            // border-radius: 20rpx;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
    }
}
.image_swiper_wrap{
    position: relative;
}
</style>