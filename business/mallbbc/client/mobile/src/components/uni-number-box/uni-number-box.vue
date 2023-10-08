<template>
	<view class="uni-numbox" :class="inputClass" :style="{marginRight:margin_right*2+'rpx'}">
		<view @click="_calcValue('minus')" class="uni-numbox__minus">
			<text class="uni-numbox--text" :class="{ 'uni-numbox--disabled': value <= min || disabled }">-</text>
		</view>
		<input :disabled="disabled" @blur="_onBlur" class="uni-numbox__value" type="number" :value="value" />
		<view @click="_calcValue('plus')" class="uni-numbox__plus">
			<text class="uni-numbox--text" :class="{ 'uni-numbox--disabled': value >= max || disabled }">+</text>
		</view>
	</view>
</template>
<script>
	export default {
		name: "UniNumberBox",
		props: {
			value: {
				type: [Number, String],
				default: 1
			},
			min: {
				type: Number,
				default: 1
			},
			max: {
				type: Number,
				default: 999
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			},
			margin_right: {
				type: Number,
				default: 0
			},
            inputSync: {//是否同步input内容
                type: Boolean,
                default: false
            },
			inputClass: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				inputValue: this.value
			};
		},
		watch: {
			value: {
				immediate: true, 
				handler (newVal,oldVal) {
					this.inputValue=newVal;
				}
			}
		},
		created() {
			// this.value = +this.value;
			// this.$emit("change", this.value);
		},
		methods: {
			_calcValue(type) {
				if (this.disabled) {
					return;
				}
				const scale = this._getDecimalScale();
				let preValue, value;
				preValue = value = this.value * scale;
				let step = this.step * scale;
				if (type === "minus") {
					value -= step;
					if (value < this.min) {
						value = this.min
						uni.showToast({
							title: '商品不能再减少了',
							icon: 'none'
						})
						return
					}
				} else if (type === "plus") {
					value += step;
					if (value > this.max) {

						value = this.max
						value = value>=999?999:value
						uni.showToast({
							title: '库存不足',
							icon: 'none'
						})
						return;
					}else{
						if(value>999){
							value = 999
							uni.showToast({
								title: '超过最大购买量',
								icon: 'none'
							})
						}
					}
					if (value < this.min) {
						value = this.min
						uni.showToast({
							title: '商品不能再减少了',
							icon: 'none'
						})
					}

				}

				// this.inputValue = String(value / scale);
                this.$emit("change", {
					preValue, 
					value: String(value / scale)
				});
			},
			_getDecimalScale() {
				let scale = 1;
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + "").split(".")[1].length);
				}
				return scale;
			},
			_onBlur(event) {
				let value = event.detail.value;
				if (!value || value == '') {
					value = this.min;
					uni.showToast({
						title: '商品不能再减少了',
						icon: 'none'
					})
				}
				value = +value;
				if (value > this.max) {
					value = this.max;
					value = value>=999?999:value
				} else {
					if(value>999){
						value = 999
						uni.showToast({
							title: '超过最大购买量',
							icon: 'none'
						})
					}
				}
				
				if (value < this.min) {
					value = this.min;
					uni.showToast({
						title: '商品不能再减少了',
						icon: 'none'
					})
				}

				// this.inputValue = value;
                this.$emit("change", {preValue: this.inputValue, value: value});
			}
		}
	};
</script>
<style lang="scss" scoped>
	$box-height: 35px;
	/* #ifdef APP-NVUE */
	$box-line-height: 35px;
	/* #endif */
	$box-line-height: 26px;
	$box-width: 35px;

	.uni-numbox {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		height: 50rpx;
		line-height: 50rpx;
		width: 182rpx;
	}

	.uni-numbox__value {
		background-color: $uni-bg-color;
		width: 78rpx;
		height: 50rpx;
		text-align: center;
		font-size: 24rpx;
		border-width: 1rpx;
		border-style: solid;
		border-color: rgba(0, 0, 0, .1);
	}

	.uni-numbox__minus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 50rpx;
		height: 50rpx;
		// line-height: $box-line-height;
		// text-align: center;
		font-size: 20px;
		color: $uni-text-color;
		background-color: #fff;
		border-width: 1rpx;
		border-style: solid;
		border-color: rgba(0, 0, 0, .1);
		border-top-left-radius: $uni-border-radius-base;
		border-bottom-left-radius: $uni-border-radius-base;
		border-right-width: 0;
	}

	.uni-numbox__plus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 50rpx;
		height: 50rpx;
		border-width: 1rpx;
		border-style: solid;
		border-color: rgba(0, 0, 0, .1);
		border-top-right-radius: 6rpx;
		border-bottom-right-radius: 6rpx;
		background-color: #fff;
		border-left-width: 0;
	}

	.uni-numbox--text {
		font-size: 30rpx;
		color: #2D2D2D;
	}

	.uni-numbox--disabled {
		color: #949494;
	}

	.uni-input-input {
		font-size: 24rpx !important;
		color: #2D2D2D;
	}
</style>