<template>
	<!--乘客信息-->
	<div class="passengerItemHotel">
		<div class="leftIcon">
			<img src="~assets//icon_room.png" />
		</div>
		<div class="rightDiv">
			<div class="secondLine">
				<!--index从0开始，显示的时候加1-->
				<span>房间{{index+1}}</span>
			</div>
			<div class="firstLine">
				<span class="name">{{passenger.passengerName}}</span>
				<InfoLabel class="lineSpace" infoName="联系电话" :infoValue="passenger.passengerPhone" classForName="infoLabel5" classForValue="infoLabel2">
				</InfoLabel>
				<!-- <InfoLabel class="lineSpace" infoName="部门" :infoValue="passenger.passengerDepartment" classForName="infoLabel5" classForValue="infoLabel2">
				</InfoLabel> -->
				<InfoLabel infoName="房费" :infoValue="'￥'+ hotelPrice" classForName="infoLabel5" classForValue="infoLabel2">
				</InfoLabel>
			</div>
		</div>
	</div>
</template>

<script>
	import InfoLabel from 'biscomponents/infolabel/msglabel.vue';
    import NP from 'number-precision';

	export default {
		components: {
			InfoLabel,
		},
		props: {
			//房间的索引
			index:{
				type:Number,
				required: true,
			},
			//乘客的信息
			passenger: {
				type: Object,
				required: true,
			},			
			//乘客的票的信息
			ticketInfo: {
				type: Object,
				required: true,
			},			
		},
		computed: {
            /**
             * 房费显示，需要计算,统一使用类库number-precision
             */
            hotelPrice:function(){
				let result = 0
				if(!!this.ticketInfo && !!this.ticketInfo.hotelNightlyRates){
					this.ticketInfo.hotelNightlyRates.forEach(element => {
						result = NP.plus(element.amount, result)						
					});
				}
				return result;
            }
		},
		data() {
			return {
			}
		},
		created() {
			//
//			console.log("酒店订单联系人详情");
		},
		mounted() {},
		methods: {
		},
	}
</script>
<style scoped lang="less">
	.passengerItemHotel {
		background: white;
		display: flex;
		align-content: flex-start;
		padding: 30px;
		/*width: 100%;*/
		.leftIcon {
			width: 24px;
			margin-right: 10px;
			img {
				height: 24px;
			}
		}
		.rightDiv {
			width: 100%;
			.firstLine {
				display: flex;
				align-content: flex-start;
				font-size: 16px;
				align-items: flex-end;
				.name{
					margin-right: 80px;
					color: #333333;
				}
				.lineSpace{
					margin-right: 20px;
				}				
			}
			.secondLine {
				/*margin-top: 40px;*/
				padding-bottom: 6px;
				border-bottom: 1px dashed #c2c2c2;
				span {
					color: #333333;
					font-size: 16px;
				}
			}
		}
	}
</style>