<template>
	<view>
		<view v-if="loaded || list.itemIndex < 15" class="uni-indexed-list__title-wrapper">
			<text v-if="list.items && list.items.length > 0" class="uni-indexed-list__title">{{ list.key }}</text>
		</view>
		<view v-if="(loaded || list.itemIndex < 15) && list.items && list.items.length > 0" class="uni-indexed-list__list">
			<view v-for="(item, index) in list.items" :key="index" class="uni-indexed-list__item" hover-class="uni-indexed-list__item--hover" @click.stop="toGoodsList(item.brandId)">
				<view class="uni-indexed-list__item-container">
					<view class="uni-indexed-list__item-border" :class="{'uni-indexed-list__item-border--last':index===list.items.length-1}">
						<view v-if="showSelect" style="margin-right: 20rpx;">
							<uni-icons :type="item.checked ? 'checkbox-filled' : 'circle'" :color="item.checked ? '#007aff' : '#aaa'" size="24" />
						</view>

						<view class="diy_item flex_row_start_start">
							<image class="img" :src="item.image" @error='setDefaultImg(item,index)' mode="item.image"></image>
							<!-- <view class="img" :style="{backgroundImage: 'url('+item.image+')'}" ></view> -->
							<view class="detail flex_column_start_start">
								<text class="name">{{item.name}}</text>
								<text class="desc">{{item.brandDesc}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from '../uni-icons/uni-icons.vue'
	export default {
		name: 'UniIndexedList',
		components: {
			uniIcons
		},
		props: {
			loaded: {
				type: Boolean,
				default: false
			},
			idx: {
				type: Number,
				default: 0
			},
			list: {
				type: Object,
				default () {
					return {}
				}
			},
			showSelect: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return{
				imgUrl: getApp().globalData.imgUrl,
				defaultImg:getApp().globalData.imgUrl+ "user/brand.png"
			}
		},
		methods: {
			setDefaultImg(item,index){
					item.image = this.defaultImg
			},
			onClick(item) {
			},
			toGoodsList(brandId){
				this.$Router.push({path:'/standard/product/list',query:{brandId}})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-indexed-list__list {
		background-color: $uni-bg-color;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.uni-indexed-list__item {
		font-size: $uni-font-size-lg;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-indexed-list__item-container {
		padding-left: 30rpx;
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-indexed-list__item-border {
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding-left: 0;
		border-bottom-style: solid;
		border-bottom-width: 1rpx;
		border-bottom-color: rgba(0, 0, 0, .05);
	}

	.uni-indexed-list__item-border--last {
		border-bottom-width: 0px;
	}

	.uni-indexed-list__item-content {
		flex: 1;
		font-size: 14px;
	}

	.uni-indexed-list {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-indexed-list__title-wrapper {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		/* #endif */
		background-color: #f5f5f5;
		height: 36rpx;
		line-height: 36rpx;
		padding-left: 27rpx;
	}

	.uni-indexed-list__title {
		color: $main-font-color;
		font-size: 22rpx;
	}

	.diy_item {
		padding: 20rpx 70rpx 20rpx 0;
		
		.img {
			background-size: contain;
			background-position: center center;
			background-repeat: no-repeat;
			width: 80rpx;
			height: 80rpx;
			overflow: hidden;
			background-color: #F3F3F3;
			border-radius: 14rpx;
			flex-shrink: 0;
		}

		.detail {
			margin-left: 20rpx;
			padding-top: 5rpx;
			.name {
				color: #2D2D2D;
				font-size: 30rpx;
				line-height: 40rpx;
			}

			.desc {
				color: $main-third-color;
				font-size: 22rpx;
				line-height: 30rpx;
				width: 540rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
		}
	}
</style>
