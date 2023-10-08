<!-- 商品列表页 -->
<template>
	<view class="goods-container">
		<w-loading ref="loading"></w-loading>
		<view class="top-fix">

			<!-- 搜索输入框 -->
			<view class="input_wrapper">
				<custom-input class="input" v-model="keyword" :placeholder="placeholder" :disabled="true" @search="toSearchPage" />
			</view>


			<view class="filter-wrapper">
				<!-- 点击后会触发事件，参数为当前点击的tab的 index -->
				<view class="filter-item" :class="[{ 'filter-item-active': index === currentIndex }]"
					v-for="(item, index) in navList" :key="index" @click="clickTab(index)">
					<text class="filter-name">{{ item.name }}</text>
					<block v-if="item.supportSort">
						<view class="up-arrow"
							:class="{ 'up-arrow-active': index == currentIndex && item.sortType == 'asc' }"></view>
						<view class="down-arrow"
							:class="{ 'down-arrow-active': index == currentIndex && item.sortType == 'desc' }"></view>
					</block>
				</view>

				<!-- 品牌筛选 -->
				<view class="filter-item flex_row_center_center" :class="{ brand_tab_active: showBrandMaskFlag }"
					@click="toggleBrandMask">
					<text class="select_brand_text text_ellipsis" v-if="selectedBrandList.length">{{
						selectedBrandListText
					}}</text>
					<text v-else class="filter-name">品牌</text>
					<text class="iconfont icon_arrow_down_fill brand_arrow"
						:class="{ brand_arrow_active: showBrandMaskFlag, select_brand_text: selectedBrandList.length }"></text>
				</view>

				<!-- 布局控制图标 -->
				<!-- 瀑布流 垂直布局 -->
				<view @click="goodsDisplayType = DISPLAY_TYPE.horizontal" class="filter-item arrange_icon arrange_icon_ver"
					v-show="goodsDisplayType == DISPLAY_TYPE.masonry"></view>

				<!-- 水平布局 -->
				<view @click="goodsDisplayType = DISPLAY_TYPE.masonry" class="filter-item arrange_icon arrange_icon_hor"
					v-show="goodsDisplayType == DISPLAY_TYPE.horizontal"></view>
			</view>
		</view>

		<!-- 商品列表区 -->
		<scroll-view class="scroll-view" scroll-y="true" @scrolltolower="getMoreGoodsList">
			<goods-display :goods-list="goodsList" :type="goodsDisplayType" />

			<block v-if="loaded && goodsList.length == 0">
				<view class="empty-wrapper">
					<image class="empty-image" :src="emptyImage" />
					<text class="empty-dec">暂无内容</text>
				</view>
			</block>
			<block v-else>
				<block v-if="loadingState == 'loading'">
					<loadingState class="loading" state='loading' />
				</block>
				<block v-if="loadingState == 'noMore'">
					<noMoreDataDivider class="noMore" color="#999999" />
				</block>
			</block>

		</scroll-view>

		<!-- 品牌列表弹窗 -->
		<view class="brand-mask" v-if="showBrandMaskFlag" @click="toggleBrandMask">
			<view class="brand_list">
				<view class="brand_list_con">
					<scroll-view enable-flex scroll-y class="cate-list" v-if="brandList && brandList.length > 0">
						<view class="cate-list-row flex_row_start_center">
							<view v-for="(item, index) in brandList" :key="index"
								class="brand_name flex_row_start_center"
								@click.stop="clickBrand(item.brandId, item.brandName)">

								<image class="select_icon" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/select_svg.svg"
									v-if="tempSelectBrandList.findIndex(val => val.brandId == item.brandId) > -1">
								</image>

								<text
									:class="{ sel: tempSelectBrandList.findIndex(val => val.brandId == item.brandId) > -1 }">{{
										item.brandName
									}}</text>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="operate_btn flex_row_center_center">
					<view class="btn reset flex_row_center_center" @click.stop="resetBrandList">重置</view>
					<view class="btn confirm flex_row_center_center" @click.stop="confirmBrandList">确认</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import goodsDisplay from '@/views/components/goods/goods-display';
import loadingState from "@/common/components/loading/loading";
import noMoreDataDivider from "@/common/components/division/index";
import goodsHandler from '@/views/components/goods/handler.js';
import CustomInput from '@/views/components/input/custom-input';
import { DISPLAY_TYPE } from '@/common/lib/enum/goods.js';
import shareMixin from '@/common/mixin/share';
import {isNotEmpty} from '@/utils/common.js'
export default {
	mixins: [shareMixin],
	components: { goodsDisplay, CustomInput, loadingState, noMoreDataDivider },
	name: 'goods-list',
	data() {
		return {
			 
			isLoading: false, // 当前正在请求数据
			noMoreFlag: false, // 没有数据了标识
			goodsDisplayType: DISPLAY_TYPE.masonry,
			DISPLAY_TYPE,
			currentIndex: 0, // 当前点击的 tab index
			navList: [
				{
					name: '综合推荐',
					supportSort: false,
				},
				{
					name: '销量',
					supportSort: false,
					sort: "sale_desc"
				}
			],

			goodsList: [],
			pageIndex: 1, // 当前页码
            pageCount: 0, // 总页数
			pageSize: 20,
			loaded: false, // 是否请求过接口
			loadingState: null,
			keyword: '',
			emptyImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwnr.png',

			// 品牌筛选相关
			showBrandMaskFlag: false,
			tempSelectBrandList: [], // 用于筛选的品牌:还没确定的选项
			selectedBrandList: [], // 用于筛选的品牌
			brandList: [], // 所有品牌列表
			categoryIds:'',  //分类id
			placeholder: ''
		}
	},
	onLoad(options) {
		if (options) {
			this.keyword = decodeURIComponent(options.keyword || '');
			this.categoryIds = decodeURIComponent(options.categoryIds || '');
			this.placeholder = decodeURIComponent(options.categoryName || '');
            this.storeAndSupplierInfos = options.storeAndSupplierInfos ? JSON.parse(decodeURIComponent(options.storeAndSupplierInfos)) : [];
		}
		this.getGoodsList();
	},
	computed: {
		selectedBrandListText() {
			return this.selectedBrandList.map(brand => brand.brandName).join(',');
		},
		currentTab(){
			return this.navList[this.currentIndex];
		}
	},
	methods: {
		// 重置所有状态
		reset() {
			this.goodsList = [];
			this.pageIndex = 1;
			this.loaded = false;
			this.loadingState = null;
			this.noMoreFlag = false;
		},
		clickTab(index) {
			// 关闭品牌筛选
			if(this.showBrandMaskFlag){
				this.toggleBrandMask();
			}

			// 连续点击
			if(this.currentIndex == index){
				return
			}

			this.currentIndex = index;
			this.getGoodsList();
		},
		// 获取商品列表
		getGoodsList() {
			this.reset();
			this.$refs?.loading?.open();
			this.replaceOrAppendGoodsList();
		},
		// 加载更多
		getMoreGoodsList() {
			this.pageIndex += 1;
            if (this.pageIndex > this.pageCount) {
                this.pageIndex = this.pageCount;
            }
			this.replaceOrAppendGoodsList({ loadMore: true });
		},

		// 拉取或者追加数据，对应拉取数据和加载更多
		async replaceOrAppendGoodsList(options = {}) {

			// 没有数据了 或者 当前正在请求  直接返回
			if (this.loadingState == 'noMore' || this.isLoading) {
				return
			}
			try {
				// loading状态控制
				this.loaded && (this.loadingState = 'loading');
				this.isLoading = true; // 正在加载数据，防止用户重复拉取数据
				let data = await this.loadData();
				this.loadingState = null;


				// 请求数据异常
				if (!data) {
					this.loaded = true;
					return
				}

				let goodsList = data.list;

				// 没有数据了
				if(data.pagination.current >= data.pagination.pageCount){
					this.loadingState = 'noMore';
				} 

				if (options.loadMore) {
					this.goodsList = this.goodsList.concat(goodsList);

				} else {
					this.goodsList = goodsList
				}

				this.loaded = true;
				this.isLoading = false;
                // list条数不够pageSize, 继续调接口获取数据
                if (this.goodsList.length < this.pageSize) {
                    this.getMoreGoodsList();
                }
			} catch (error) {
				this.loaded = true;
				console.log(error);
			} finally {
				this.$refs?.loading?.close();
			}
		},
		// 拉取数据
		async loadData() {
            // 省市区code
            const { provinceCode, cityCode, districtCode, townCode } = this.$store.state.defaultAddress;
            
			let params = {
				pageSize: this.pageSize,
				pageIndex: this.pageIndex,
				sort: this.currentTab.sort,
				brandInfoVOList: this.selectedBrandList,
                storeAndSupplierInfos: this.storeAndSupplierInfos,
                stockFilter: 0, // 是否过滤库存
			}
            // 过滤无货商品
            if (provinceCode && cityCode) {
                params.stockFilter = 1;
                params = { ...params, stockFilter: 1, provinceCode, cityCode, districtCode, townCode }
            }

			if(isNotEmpty(this.keyword)){
				params = Object.assign({}, params, {
					keyword: this.keyword
				})
			}

			if (this.categoryIds) {
				params.categoryIds = (this.categoryIds+'').split(',').map((item)=>{return parseInt(item)})
			}
			try {
				let res = await goodsHandler.search(params);
				if (res.state == 200) {
					this.brandList.length || (this.brandList = res.data.brandInfoVOList);
					let list = res.data.productVOPageVO.list;
                    const pageInfo = res.data.productVOPageVO.pagination;
                    const { current, pageCount } = pageInfo;
                    // 从接口更新pageIndex, 因为触底事件偶现触发多次
                    this.pageIndex = current;
                    if (!this.pageCount) {
                        this.pageCount = pageCount;
                    }
					let pagination = {
						...pageInfo,
						pageSize: list.length
					}
					return Promise.resolve({ list, pagination })
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'error'
					})
					return Promise.resolve(null)
				}
			} catch (error) {
				console.error(error);
				return Promise.resolve(null)
			} finally {
			}
		},

		// 切换品牌筛选显示
		toggleBrandMask() {
			this.showBrandMaskFlag = !this.showBrandMaskFlag;
			// 修复选择品牌未确认时切换品牌列表 数据错误
			if (this.showBrandMaskFlag) {
				this.tempSelectBrandList = JSON.parse(JSON.stringify(this.selectedBrandList));
			} else {
				this.tempSelectBrandList = [];
			}
		},

		clickBrand(brandId, brandName) {
			let index = this.tempSelectBrandList.findIndex(item => item.brandId == brandId);
			if (index > -1) {
				//选中的话取消选中
				this.tempSelectBrandList.splice(index, 1);
			} else {
				this.tempSelectBrandList.push({ brandId, brandName });
			}
		},
		// 重置品牌筛选条件
		resetBrandList() {
			this.tempSelectBrandList = [];
			this.selectedBrandList = []
		},
		// 确定品牌筛选条件
		confirmBrandList() {
			this.selectedBrandList = JSON.parse(JSON.stringify(this.tempSelectBrandList));
			this.toggleBrandMask();
			this.getGoodsList()
		},

		toSearchPage() {
			this.$Router.replace({
				path: '/views/search/index',
				query: {
					keyword: this.keyword,
                    storeAndSupplierInfos: JSON.stringify(this.storeAndSupplierInfos)
				}
			})
		}
	}

}
</script>

<style lang="scss" scoped>
$top-bar-height: 160rpx;

.goods-container{
	overflow: hidden;
}
.top-fix{
	position: fixed;
	width: 100%;
	top: 0;
	left: 0;
}
.input_wrapper {
	background-color: #fff;
	padding: 10rpx 30rpx;
}

.filter-wrapper {
	background-color: #fff;
	height: 72rpx;
	line-height: 72rpx;
	display: flex;
	justify-content: space-around;
	align-items: center;

	.brand_tab_active {
		border-radius: 34rpx 34rpx 0 0;
		background: #eff2f5;
		padding: 0 24rpx;
	}

	.arrange_icon {
		height: 32rpx;
		width: 32rpx;

	}

	.arrange_icon_hor {
		background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/btn_common_hor.svg');
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
	}

	.arrange_icon_ver {
		background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/btn_common_ver.svg');
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
	}

	.filter-item {
		color: #666666;
		text-align: center;
		font-size: 30rpx;
		transition: all 0.2s;
		position: relative;

		.select_brand_text {
			color: #f30300;
			font-weight: bold;
		}

		.text_ellipsis {
			max-width: 264rpx;
			display: inline-block;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.brand_arrow {
			margin-left: 6rpx;
			font-size: 12rpx;
			transition: all 0.3s;
		}

		.brand_arrow_active {
			transform: rotate(180deg);
		}

		.up-arrow {
			top: 3px;
			left: 32px;
			border-width: 0 4px 6px;
			border-style: solid;
			border-color: transparent transparent #878788;
			position: absolute;
		}

		.down-arrow {
			left: 32px;
			top: 12px;
			border-width: 6px 4px 0;
			border-style: solid;
			border-color: #878788 transparent transparent;
			position: absolute;
		}

		.up-arrow-active {
			border-color: transparent transparent #7abcfa;
		}

		.down-arrow-active {
			border-color: #7abcfa transparent transparent;
		}
	}

	.filter-item-active {
		color: #f30300;
		font-weight: bold;
	}
}


.scroll-view {
	height: calc(100vh - #{$top-bar-height});
	position: fixed;
	width: 100%;
	top: $top-bar-height;
	left: 0;
	::v-deep .goods-horizontal .left-part .lazy-item{
		width: 240rpx;
	}
}

.empty-wrapper {
	display: flex;
	flex-direction: column;
	height: 100%;
	align-items: center;
	justify-content: center;

	.empty-image {
		margin-top: -64px;
		width: 128px;
		height: 128px;
	}

	.empty-dec {
		font-size: 26rpx;
		color: #999999;
	}

}

.brand-mask {
	position: fixed;
	left: 0;
	margin: 0 auto;
	top: $top-bar-height;
	z-index: 95;
	transition: all 0.3s;
	overflow: hidden;
	height: 100%;
	width: 100%;
	background-color: rgba($color: #000, $alpha: 0.7);

	.brand_list {
		min-height: 376rpx;
		max-height: 952rpx;
		transition: all 0.3s;
		padding: 18rpx 30rpx 48rpx;
		background: linear-gradient(180deg, #eff2f5 1%, #eff2f5);
		border-radius: 0 0 20rpx 20rpx;

		.brand_list_con {
			min-height: 214rpx;
			height: calc(100% - 96rpx);
			max-height: 790rpx;

			.cate-list {
				height: 100%;
				max-height: 790rpx;

				.cate-list-row {
					flex-wrap: wrap;

					.brand_name {
						width: 50%;
						height: 64rpx;
						padding-right: 32rpx;
						font-size: 26rpx;

						text {
							flex: 1;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							word-break: break-all;
						}

						.select_icon {
							width: 32rpx;
							height: 32rpx;
							margin-right: 10rpx;
						}

						.sel {
							color: #f30300;
							font-weight: bold;
						}
					}
				}
			}
		}

		.operate_btn {
			margin-top: 16rpx;

			.btn {
				flex: 1;
				height: 80rpx;
				font-weight: bold;
			}

			.reset {
				border: 1px solid #f30300;
				color: #f30300;
				font-size: 32rpx;
				border-radius: 40rpx 0 0 40rpx;
			}

			.confirm {
				background: #f30300;
				color: #fff;
				border: 1px solid #f30300;
				border-left: 0px;
				border-right: 0px;
				font-size: 32rpx;
				border-radius: 0 40rpx 40rpx 0;
			}
		}
	}
}

::v-deep .noMore-data {
	margin-top: 14rpx;
}
::v-deep .goods-masonry .u-wrap .u-lazy-item {
    border-radius: 20rpx 20rpx 0 0!important;
    overflow: hidden;
}

::v-deep .goods-horizontal .u-wrap .u-lazy-item {
    border-radius: 20rpx!important;
    overflow: hidden;
}

.swiper {
	height: calc(100vh - #{$top-bar-height});
	.swiper-item {
		.scroll-view {
			height: 100%;
		}
	}
}
</style>
