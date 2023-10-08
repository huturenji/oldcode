<template>
	<view class="uni-indexed-list" ref="list" id="list">
		<!-- #ifdef APP-NVUE -->
		<list class="uni-indexed-list__scroll" scrollable="true" show-scrollbar="false">
			<cell v-for="(list, idx) in lists" :key="idx" :ref="'uni-indexed-list-' + idx">
				<!-- #endif -->
				<!-- #ifndef APP-NVUE -->
				<scroll-view :scroll-into-view="scrollViewId" class="uni-indexed-list__scroll" scroll-y @scrolltolower="getMore">
					<view v-for="(list, idx) in lists" :key="idx" :id="'uni-indexed-list-' + idx">
						<!-- #endif -->
						<uni-indexed-list-item :list="list" :loaded="loaded" :idx="idx" :showSelect="showSelect" @itemClick="onClick"></uni-indexed-list-item>
						<!-- #ifndef APP-NVUE -->
					</view>
				</scroll-view>
				<!-- #endif -->
				<!-- #ifdef APP-NVUE -->
			</cell>
		</list>
		<!-- #endif -->
		<view class="uni-indexed-list__menu">
			<view v-for="(list, key) in lists" :key="key" class="uni-indexed-list__menu-item" @click="goInitial(key)">
				<text class="uni-indexed-list__menu-text" :class="touchmoveIndex == key ? 'uni-indexed-list__menu-text--active' : ''">{{ list.key }}</text>
			</view>
		</view>
		<view v-if="touchmove" class="uni-indexed-list__alert-wrapper">
			<text class="uni-indexed-list__alert">{{ lists[touchmoveIndex].key }}</text>
		</view>
	</view>
</template>
<script>
	import uniIcons from '../uni-icons/uni-icons.vue'
	import uniIndexedListItem from './uni-indexed-list-item.vue'
	// #ifdef APP-NVUE
	const dom = weex.requireModule('dom');
	// #endif
	// #ifdef APP-PLUS
	function throttle(func, delay) {
		var prev = Date.now();
		return function() {
			var context = this;
			var args = arguments;
			var now = Date.now();
			if (now - prev >= delay) {
				func.apply(context, args);
				prev = Date.now();
			}
		}
	}

	function touchMove(e) {
		let pageY = e.touches[0].pageY
		let index = Math.floor((pageY - this.winOffsetY) / this.itemHeight)
		if (this.touchmoveIndex === index) {
			return false
		}
		let item = this.lists[index]
		if (item) {
			// #ifndef APP-NVUE
			this.scrollViewId = 'uni-indexed-list-' + index
			this.touchmoveIndex = index
			// #endif
			// #ifdef APP-NVUE
			dom.scrollToElement(this.$refs['uni-indexed-list-' + index][0], {
				animated: false
			})
			this.touchmoveIndex = index
			// #endif
		}
	}
	const throttleTouchMove = throttle(touchMove, 40)
	// #endif

	
	/**
	 * IndexedList 索引列表
	 * @description 用于展示索引列表
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=375
	 * @property {Boolean} showSelect = [true|false] 展示模式
	 * 	@value true 展示模式
	 * 	@value false 选择模式
	 * @property {Object} options 索引列表需要的数据对象
	 * @event {Function} click 点击列表事件 ，返回当前选择项的事件对象
	 * @example <uni-indexed-list options="" showSelect="false" @click=""></uni-indexed-list>
	 */
	export default {
		name: 'UniIndexedList',
		components: {
			uniIcons,
			uniIndexedListItem
		},
		props: {
			options: {
				type: Array,
				default () {
					return []
				}
			},
			showSelect: {
				type: Boolean,
				default: false
			},
			hasMore:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				lists: [],
				winHeight: 0,
				itemHeight: 0,
				winOffsetY: 0,
				touchmove: false,
				touchmoveIndex: -1,
				scrollViewId: '',
				touchmoveTimeout: '',
				loaded: false
			}
		},
		watch: {
			options: {
				handler: function() {
					this.setList()
				},
				deep: true
			}
		},
		mounted() {
			setTimeout(() => {
				this.setList()
			}, 50)
			setTimeout(() => {
				this.loaded = true
			}, 300);
		},
		methods: {
			setList() {
				let index = 0;
				this.lists = [];
				this.options.forEach((value, index) => {
					if (value.goodsBrandInfoList.length === 0) {
						return
					}
					let indexBefore = index
					let items = value.goodsBrandInfoList.map(item => {
						let obj = {}
						obj['key'] = value.brandInitial;
						obj['name'] = item.brandName;
						obj['image'] = item.imageUrl;
						obj['brandDesc'] = item.brandDesc;
						obj['brandId'] = item.brandId;
						obj['itemIndex'] = index
						index++
						obj.checked = item.checked ? item.checked : false
						return obj
					})
					this.lists.push({
						title: value.brandInitial,
						key: value.brandInitial,
						items: items,
						itemIndex: indexBefore
					})
				})
				// #ifndef APP-NVUE
				uni.createSelectorQuery()
					.in(this)
					.select('#list')
					.boundingClientRect()
					.exec(ret => {
						this.winOffsetY = ret[0].top
						this.winHeight = ret[0].height
						this.itemHeight = this.winHeight / this.lists.length
					})
				// #endif
				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs['list'], (res) => {
					this.winOffsetY = res.size.top
					this.winHeight = res.size.height
					this.itemHeight = this.winHeight / this.lists.length
				})
				// #endif
			},
			//右侧字母导航点击事件，点击字母，列表自动滚动到对应的部分
			goInitial(index) {
				let item = this.lists[index]
				if (item) {
					this.scrollViewId = 'uni-indexed-list-' + index
					this.touchmoveIndex = index
					// #ifdef APP-NVUE
					dom.scrollToElement(this.$refs['uni-indexed-list-' + index][0], {
						animated: false
					})
					// #endif
				}
			},
			onClick(e) {
				let {
					item
				} = e
				//根据品牌id跳转到商品列表
				this.$Router.push({path:'/standard/product/list',query:{brandId}})

			},
			getMore(){
				if(this.hasMore){
					this.$emit("getData")
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.uni-indexed-list {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		width: 750rpx;
		margin: 0 auto;
	}

	.uni-indexed-list__scroll {
		flex: 1;
	}

	.uni-indexed-list__menu {
		width: 80rpx;
		background-color: transparent;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		position: absolute;
		right: 0;
		z-index: 2;
		top: 15vh;
	}

	.uni-indexed-list__menu-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		align-items: center;
		justify-content: center;

	}

	.uni-indexed-list__menu-text {
		line-height: 32rpx;
		font-size: 24rpx;
		text-align: center;
		color: #2D2D2D;
	}

	.uni-indexed-list__menu--active {}

	.uni-indexed-list__menu-text--active {
		color: $main-color;
	}

	.uni-indexed-list__alert-wrapper {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.uni-indexed-list__alert {
		width: 80px;
		height: 80px;
		border-radius: 80px;
		text-align: center;
		line-height: 80px;
		font-size: 35px;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
