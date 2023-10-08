<template>
	<!--物流信息Item-->
	<div class="itemDiv">
		<div v-if="isLastPoint" class="leftIcon">
			<img class="img1" src="~assets//icon_express_light.png" />
			<div class="pointDiv"></div>
		</div>
		<div v-else-if="isFirstPoint" class="leftIcon">	
			<img class="img2" src="~assets//icon_express_point.png" />
		</div>
		<div v-else class="leftIcon">
			<img class="img2" src="~assets//icon_express_point.png" />
			<div class="pointDiv"></div>				
		</div>
		<div class="detailText">
			<div v-if="isLastPoint" class="lastPoint">
				<div>{{expressItem.expressLocationDesc || expressItem.status}}</div>
				<div>{{expressItem.expressLocationTime || expressItem.time}}</div>
			</div>
			<div class="otherPoint">
				<div>{{expressItem.expressLocationDesc || expressItem.status}}</div>
				<div>{{expressItem.expressLocationTime || expressItem.time}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		components: {},
		props: {
			//一条物流信息
			expressItem: {
				type: Object,
				default: function() {
					return {
						expressLocationTime: '',
					}
				}
			},
		},
		computed: {
			isLastPoint:function(){
				return this.expressItem.isLastPoint;
			},
			isFirstPoint:function(){
				return this.expressItem.isFirstPoint;
			},			
		},
		data() {
			return {
				// isLastPoint: true,
				// isFirstPoint: true,
			}
		},
		created() {},
		mounted() {},
		methods: {
		},
	}
</script>
<style scoped lang="less">
	.itemDiv {
		display: flex;
        justify-content: flex-start;
        font-size: 12px;
		.leftIcon{
			flex: 0 0 21px;
			text-align: center;
			.img1 {
				height: 12px;
				// width: 18px;
			}
			.img2 {
				height: 5px;
				width: 5px;
				border-radius: 3px;
			}		
			.pointDiv {
				height: 30px;
				width: 1px;
				background: #7F7F7F;
    			margin: 5px 10px 0px 10px;
			}
		}
		.detailText {
			margin-left: 5px;
			.lastPoint {
				color: #191919;
			}
			.otherPoint {
				color: #7F7F7F;
			}
		}
	}
</style>