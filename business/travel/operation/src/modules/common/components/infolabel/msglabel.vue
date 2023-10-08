<template>
	<div class="infoLabel">
		<slot name="header"></slot>
		<div v-if="!!infoName" :class="classForName">{{infoName}}</div>
		<slot v-if="!!infoValue" name="middlePoint">：</slot>
		<div v-if="!!infoValue" :class="classForValue">{{infoValue}}</div>
		<slot name="footer"></slot>
	</div>
</template>

<script>
	export default {
		props: {
			infoName: {
				type: String,
				required: true
			},
			infoValue: {
				type: String,
				required: false
			},
			classForName: {
				type: String,
				required: false
			},
			classForValue: {
				type: String,
				required: false
			}
		}
	}
</script>
<style lang="less">
//订单详情
@font-color-text1: #333333;
//已出票
@font-color-text2: #478aee;
//订单号
@font-color-text3: #7F7F7F;
//总金额数字
@font-color-text4: #F39800;
//退票成功
@font-color-text5: #25CB67;
//顺丰速递
@font-color-text6: #191919;
.infoLabel{
    word-break: break-all;
    display: flex;
    align-items: baseline;
	.infoLabel1 {
		color: #7F7F7F;
		font-size: 14px;
	}
	
	.infoLabel2 {
		color: #333333;
		font-size: 14px;
	}
	.infoLabelFlight {
		color: #478aee;
		font-size: 14px;
		cursor: pointer;
	}
	
	.infoLabel3 {
		color: @font-color-text3;
		font-size: 14px;
	}
	
	.infoLabel31 {
		color: @font-color-text3;
	}
	
	.infoLabel4 {
		color: #F83939;
		font-weight: bold;
		font-size: 20px;
	}
	
	.infoLabel5 {
        color: #7F7F7F;
        flex: none;
	}
	
	.infoLabel6 {
		color: @font-color-text2;
	}
	
	.infoLabel7 {
        color: @font-color-text1;
        max-width: 1000px;    
	}
}
</style>