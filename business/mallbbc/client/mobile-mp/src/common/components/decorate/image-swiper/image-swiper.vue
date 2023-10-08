<template>
    <view class="image_swiper_wrap">
            <!-- 商品轮播 -->
            <view
                class="carousel_bottom_wrap_goods"
                ref="carousel_bottom_wrap_goods"
                v-if="decoProps.dataType === 'goods'"
                :style="[styles, rootStyle, {visibility: showSwiper ? '' : 'hidden'}]"
                >                
                <swiper
                    class="carousel carousel_bottom"
                    :autoplay="false"
                    next-margin="202rpx"
                    :current="current"
                    @change="change"
                    :style="[{ height: carouselHeight }]"
                >
                    <swiper-item
                        v-for="(item, index) in goodsList"
                        :key="index"
                        class="carousel-item"
                        @click="skipTo(item)"
                    >
                        <thumbAllBuyBig
                            ref="thumbAllBuyV"
                            class="thumbAllBuyV"
                            :goodsItem="item"
                            :dataLevel="[index]"
                            @changeData="changeData"
                        ></thumbAllBuyBig>
                    </swiper-item>
                </swiper>
                <customSwiperDot
                    v-if="goodsList.length > 0"
                    :dotNum="goodsList.length"
                    :currentIndex="current"
                    background="rgba(0,0,0,0.18)"
                    :swiperDotStyle="{ position: 'absolute', 
                        left: '50%',
                        transform: 'translateX(-50%)', 
                        bottom: '12rpx' }"
                ></customSwiperDot>
            </view>
            <!-- 图片轮播 使用之前的轮播装修组件 -->
            <view
                class="carousel_bottom_wrap"
                ref="carousel_bottom_wrap"
                v-show="showSwiper"
                v-if="decoProps.dataType === 'img'"
                :current="swiperCurrent"
                :style="[styles, rootStyle]"
            >
                <view class="blur-bg-area" :style="[bgStyles]">
                    <view
                        v-show="blurBackgroundImg && showVague"
                        class="blur-bg"
                        :style="[blurBgStyle]"
                    ></view>
                </view>
                <swiper
                    class="carousel carousel_bottom"
                    circular
                    :interval="
                        decoProps.autoplaySpeed
                            ? decoProps.autoplaySpeed * 1000
                            : 3000
                    "
                    :autoplay="carouselAutoplay"
                    :current="current"
                    @change="change"
                    @animationfinish="
                        (e) => {
                            swiperTransition(e, decoItem);
                        }
                    "
                    :style="[{ height: carouselHeight, borderRadius: swiperImgBorderRadio }]"
                >
                    <swiper-item
                        v-for="(item, index) in decoItem.data"
                        :key="index"
                        class="carousel-item"
                        @click="skipTo(item)"
                        >
                            <image class="swiper_img" :src="item.img" @load="imgLoad" :style="[swiperStyle, { height: carouselHeight }]" />
                    </swiper-item>
                </swiper>
                <!-- 这里轮播点用组件，不用自带的 -->
                <customSwiperDot
                    v-show="loadedImg"
                    :dotNum="decoItem.data.length"
                    :currentIndex="current"
                    background="rgba(0,0,0,0.18)"
                    :swiperDotStyle="{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bottom: swiperDotPostion
                    }"
                ></customSwiperDot>
            </view>
    </view>
</template>
<script>
import { skipTo, isEmpty, isNotEmpty, getQuerySelector } from "@/utils/common.js";
import indexMixin from "@/common/components/decorate/common/mixin";
import pullProdouctPriceMixin from "@/common/mixin/pullProdouctPriceMixin";
import checkGoodsByAddress from "@/common/mixin/checkGoodsByAddress";
import customSwiperDot from "@/common/components/swiper-dot";
import thumbAllBuyBig from "@/common/components/thumb/thumb-all-buy-big.vue";
import goodsHandler from "@/views/components/goods/handler";
import request from '@/utils/request';
export default {
	name: "deco-swiper",
	mixins: [indexMixin, pullProdouctPriceMixin, checkGoodsByAddress],
	props: {
		decoItem: {
			type: Object,
			default: () => {},
		},
	},
	components: {
		customSwiperDot,
		thumbAllBuyBig,
	},
	watch: {
		decoItem: {
			handler(val) {
				//初始化第一张图
				if (isNotEmpty(val)) {
					this.initData(JSON.parse(JSON.stringify(val)));
                    // 初始化背景和margin padding
                    this.initBackgroud(val)
                    this.initSpace(val);
				}
			},
			deep: true,
			immediate: true,
		},
	},
	computed: {
		showSwiper() {
			let show = false;
            const { props: { dataType } } = this.decoItem || {};
			if (dataType === "goods") {
				show = this.goodsList.length > 0;
			} else if (dataType === "img") {
				show = this.decoItem.data.length > 0;
			}
            return show;
		},
		swiperDotPostion() {
			let num = 12;
			if (this.decoItem.props.swiperDotPosition) {
				num = Number(this.decoItem.props.swiperDotPosition) * 2;
			}
            return num + "rpx";
		},
		swiperImgBorderRadio() {
			let num = 20;
            const borderRadius = this.decoItem.props?.borderRadio;
			if (borderRadius != null && !isNaN(borderRadius)) {
				num = borderRadius * 2;
			}
			return num + "rpx";
		},
		blurBgStyle() {
			if (isEmpty(this.blurBackgroundImg) || this.blurLock) {
				return;
			}
			return {
				background:
					"url('" + this.blurBackgroundImg + "') center no-repeat",
				backgroundSize: "100%",
			};
		},
		showVague() {
			return (
				isNotEmpty(this.decoItem) &&
				this.decoItem.props.showVague &&
				!this.blurLock
			);
		},
        bgStyles() {
            const style = {}, background = this.decoItem.styles[0]?.background;
            if (background) {
                if (background.img) {
                    style.background = "url('" + background.img + "') center no-repeat";
                    style.backgroundSize = "100%";
                } else if (background.color) {
                    style.backgroundColor = background.color;
                }
            }
            return style;
        },
        swiperStyle() {
            const imageSpacing = this.decoProps.imageSpacing;
            let style = {
                borderRadius: this.swiperImgBorderRadio, 
            }
            if (imageSpacing) {
                style.transform = "translateX(" + imageSpacing + "px)",
                style.width = "calc(100% - " + imageSpacing * 2 + "px)";
            }
            return style;
        },
        rootStyle() {
            const [ , marginRight, , marginLeft ] = this.decoItem.styles[0]?.margin || [];
            const margin = Number(marginRight || 0) + Number(marginLeft || 0);
            return {
                width: "calc(100% - " + margin +"px)"
            }
        }
	},
	data() {
		return {
			decoProps: {}, // 组件的属性
			goodsList: [],
			swiperCurrent: 0, // 轮播当前索引
			carouselAutoplay: true, // 自动播放
			blurBackgroundImg: null,
			blurLock: false, //暂停高斯模糊效果
			current: 0,
            carouselWidth: "750rpx",
			carouselHeight: "250rpx",
			countTime: 0, // 倒计时
            loadedImg: false, // 图片是否加载完成
		};
	},
	methods: {
		initData(val) {
			this.decoProps = val.props;
            const dataType = this.decoProps.dataType;
			if (dataType == "goods") {
				this.getGoods(val);
			} else if (dataType == "img") {
				this.$nextTick(() => {
					this.blurBackgroundImg = val.data[0].img;
				});
			}
		},
		computedHeight() {
			this.$nextTick(async () => {
                // 计算图片的宽高
                const attr = await getQuerySelector('.thumbAllBuyV', false, this);
                // thumbAllBuyV组件的高度再加上20rpx让dot正好位于轮播图下方
                this.carouselHeight = attr.height + 20 + "px";
			});
		},
		imgLoad(e) {
            let imgWidth = this.swiperStyle.width;
            const screenWidth = uni.getSystemInfoSync().windowWidth;
            if (!imgWidth || imgWidth == "100%") {
                imgWidth = screenWidth + "";
            }
            if (imgWidth.includes("calc(100%")) {
                let padding = imgWidth.replace(/calc\(100%|\-|px\)/g, "").trim()
                imgWidth = screenWidth - padding;
            }
            const { width, height } = e.detail;
            this.carouselHeight = Math.ceil((height * imgWidth / width)) + "px";
            this.loadedImg = true;
		},
		// 相关跳转
		skipTo(item) {
			skipTo(item, this);
		},
		// 轮播完切换高斯模糊背景
		swiperTransition(e, item) {
			const index = e.detail.current;
			this.swiperCurrent = index;
			this.blurBackgroundImg = item.data[index].img;
		},
		//轮播图切换
		change(e) {
            const { source, current } = e.detail;
            if (source === 'autoplay' || source === 'touch') {
			    this.current = current;
            }
		},
		getGoods(data) {
			if (data.props.sources === "upload") {
				let param = {
					includeGroup: false,
					skus: data.data[0].ids,
				};
				goodsHandler.getListBySkus(param).then(async (res) => {
					if (res.state === 200 && res.data.length > 0) {
						let list = res.data.map((item) => {
							return {
								...item,
								canPurchase: true,
								hasStock: true,
                                source: "upload",
							};
						});

						// 对是否可售进行判断
						if (this.decoProps.filterNosaleGoods) {
							list = await this.filterGoodsByAddress(list);
						} else {
							list = await this.updateGoodsByAddress(list);
						}

						this.goodsList = list;
						if (this.goodsList.length > 0) {
							this.computedHeight();
						}
					}
				});
			} else if (
				data.props.sources === "buytogether" &&
				data.data &&
				data.data[0]
			) {
				this.getBuySessionList(data.data[0].info?.promotionId);
			}
		},
		// 获取一起买场次列表
		getBuySessionList(id) {
			let dateTime = new Date();
			let year = dateTime.getFullYear();
			let month = dateTime.getMonth() + 1;
			let day = dateTime.getDate();
			request({
				url: "/v3/specialoffer/front/buyTogether/getDateStage",
				method: "GET",
				data: {
					stageDate: year + "-" + month + "-" + day,
					promotionId: id,
				},
			}).then((res) => {
				if (res.state == 200 && res.data.buyTogetherStageVOList) {
					const list = res.data.buyTogetherStageVOList;
					// 只查找进行中 / 未开始 的场次
					let index = list.findIndex(
						(item) => item.frontState === 2 || item.frontState === 1
					);
					if (index !== -1) {
						this.getSessionGoodsList(
							list[index].stageId,
							list[index].promotionId
						);

						this.countTime = list[index].distanceTime;
						if (
							this.countTime > 0 &&
							list[index].frontState === 2
						) {
							// 进行中的秒杀进行倒计时
							let secInterval = setInterval(() => {
								if (this.countTime <= 0) {
									//倒计时结束，清除倒计时
									clearInterval(secInterval);
									this.getBuySessionList(id);
								} else {
									this.countTime -= 1;
								}
							}, 1000);
						}
					}
				}
			});
		},
		// 获取一起买商品列表
		getSessionGoodsList(stageId, promotionId) {
			request({
				url: "/v3/specialoffer/front/buyTogether/productList",
				data: {
					stageId: stageId,
					promotionId: promotionId,
					pageSize: 10,
					pageIndex: 1,
				},
				method: "POST",
				header: {
					"Content-Type": "application/json",
				},
			}).then(async (res) => {
				if (res.state === 200 && res.data) {
					let list = res.data.list.map((item) => {
						return { ...item, canPurchase: true, hasStock: true };
					});

					// 对是否可售进行判断
					if (this.decoProps.filterNosaleGoods) {
						list = await this.filterPromotionGoodsByAddress(list);
						this.goodsList = list.slice(
							0,
							this.decoProps.showGoodsNum || 3
						);
					} else {
						list = await this.updatePromotionGoodsByAddress(list);
						this.goodsList = list.slice(
							0,
							this.decoProps.showGoodsNum || 3
						);
					}

					if (this.goodsList.length > 0) {
						this.computedHeight();
					}
				}
			});
		},
		/**
		 * 用于子组件修改分类下数据
		 * @param {*} keys 索引集合
		 * @param {*} key 需要修改数据的key
		 * @param {*} val 需要修改数据的值
		 */
		changeData(keys, key, val) {
			let data = keys.reduce((pre, cur) => pre[cur], this.goodsList);
			this.$set(data, key, val);
		},
	},
};
</script>

<style lang="scss" scoped>

.carousel_bottom_wrap_goods {
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
	position: relative;

	.blur-bg-area {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
        height: 100%;
		overflow: hidden;
		z-index: -1;
		.blur-bg {
			height: 376rpx;
			width: 1034px;
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
		.carousel-item {
			width: 100%;
			height: 100%;
			// padding: 0 1px;
			overflow: hidden;
            box-sizing: border-box;
		}

		image {
			width: 100%;
			height: 100%;
			overflow: hidden;
		}

		.itemImg {
			width: 100%;
			height: 100%;
			background-position: center center;
			background-repeat: no-repeat;
			background-size: contain;
		}

		.swiper_img {
			width: 100%;
			height: 100%;
			background-position: center center;
			background-repeat: no-repeat;
			background-size: 100% 100%;
		}
	}
}
.image_swiper_wrap {
    width: 100%;
	position: relative;
}
</style>