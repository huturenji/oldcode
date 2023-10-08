<!--
 * @Author: whchen
 * @Descripttion: 
 * @Date: 2023-04-26 13:56:00
 * @LastEditTime: 2023-05-16 17:09:38
 * @FilePath: \mobile-miniprogram\src\views\components\uni-tooltip\index.vue
-->
<template>
	<view class="uni-tooltip" :class="{active: show}"  @click.stop="toogleTooltip">
		<view>
			<slot></slot>
		</view>
		<view v-if="content || $slots.content" class="uni-tooltip-popup" :style="{top: top + 'px', opacity: opacity}">
			<slot name="content">
				{{content}}
			</slot>
      		<view class="uni-tooltip-popup-arrow"></view>
		</view>
	</view>
</template>


<script>
	/**
	 * Tooltip 提示文字
	 * @description 常用于展示鼠标 hover 时的提示信息。
	 * @tutorial https://uniapp.dcloud.io/component/uniui/uni-tooltip
	 * @property {String} content   弹出层显示的内容
	 * @property {String}  placement出现位置, 目前只支持 left
	 */
	export default {
		name: "uni-tooltip",
		data() {
			return {
        show: false,
        top: 0,
        opacity: 0
			};
		},
		props: {
			content: {
				type: String,
				default: ''
			},

			placement: {
				type: String,
				default: 'bottom'
			},
		},
    methods: {
		toogleTooltip() {
			if (this.show) {
				this.closeTooltip()
			} else {
				this.showTooltip()
			}
		},
		showTooltip() {
			this.show = true
			this.$nextTick(() => {
				uni.createSelectorQuery()
				.in(this)
				.select('.uni-tooltip-popup')
				.boundingClientRect((con) => {
					const { height } = con;
					this.top = 0 - height - 10;
					this.$nextTick(() => {
					this.opacity = 0.9;
					})
				})
				.exec();
				})
		},
		closeTooltip() {
			this.show = false
		}
    }
}
</script>

<style>
	.uni-tooltip {
		position: relative;
	}

	.uni-tooltip-popup {
		z-index: 1;
		display: none;
		position: absolute;
		left: -40rpx;
		background-color: #272827;
		border-radius: 8rpx;
		color: #fff;
		font-size: 26rpx;
		text-align: left;
	}


	.uni-tooltip.active .uni-tooltip-popup {
		display: block;
	}

  .uni-tooltip-popup-arrow {
    position: absolute;
    left: 56rpx;
    width: 0px;
    height: 0px;
    border: 10rpx solid transparent;
    border-top-color: #272827;
  }
</style>
