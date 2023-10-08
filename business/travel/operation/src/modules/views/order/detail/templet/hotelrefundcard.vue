<template>
	<!-- 退款明细 -->
	<div class="hotel_return_collapse">
		<div class="titleDiv">
			<div class="tuiTitle">{{tuiTitle}}</div>
			<div class="cursorp" :class="listSwitch ? 'showItemIconUp' : 'showItemIcon'" @click.stop="listSwitch = !listSwitch">
				<div class="imgDiv" />
			</div>
		</div>
		<div v-for="item in tuiOrderList" :key="item.orderNo" v-show="listSwitch">
			<div class="status">{{getHotelTuiOrderStatusUi(item.hasRefundOrder) +" "+ (item.refundTime ||"")}}</div>
			<div class="mainTable">
				<div class="title">
					<div class="left">{{orderBase.supplierShortName}}已审核，同意取消订单</div>
					<div class="center">审核时间：{{item.refundTime}}</div>
					<div class="right">客服：{{orderBase.supplierPhone}}</div>
				</div>
				<div class="table">
					<div class="passengerDiv">
						<div class="middleDiv">
							<div v-if="!!item.hotelPassengers" class="passengers">入住人</div>
							<div class="namesDiv">
								<span v-for="psg in item.hotelPassengers" :key="psg.passengerId">{{psg.passengerName}}</span>
							</div>
							<div v-if="!!orderBase" class="hotel">
								<div>入住信息</div>
								<div>{{orderBase.hotelName}}</div>
								<div>{{orderBase.roomTypeName + " 共" + orderBase.roomCount + "间"}}</div>
								<div>{{orderBase.arriveDate}}—{{orderBase.departDate}} 共{{orderBase.days}}晚</div>
							</div>
						</div>
					</div>
					<div class="priceDiv">
						<div class="middleDiv">
							<div class="RefundAmoun">
								<span>订单总额</span>
								<span>￥{{Number(item.payAmount||0).toFixed(2)}}</span>
							</div>
							<div class="RefundAmoun">
								<span>优惠券扣减</span>
								<span>-￥{{Number(item.discountAmount||0).toFixed(2)}}</span>
							</div>
							<div class="RefundAmoun">
								<span>实付金额</span>
								<span>￥{{(Number(item.payAmount||0) - Number(item.discountAmount||0)).toFixed(2)}}</span>
							</div>
						</div>
					</div>
					<div class="priceDiv">
						<div class="middleDiv">
							<div class="RefundAmoun">
								<span>酒店扣费</span>
								<span>￥{{Number(item.lossFee||0).toFixed(2)}}</span>
							</div>
						</div>
					</div>
					<div class="operation">
						<div class="middleDiv">
							<div class="RefundAmoun">实退金额</div>
							<div class="RefundAmoun">￥{{Number(item.refundAmount||0).toFixed(2)}}</div>
							<div class="editBtn">
								<span>已退款</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="tuiDesc" v-if="!!tuiOrderList && tuiOrderList.length>0 && listSwitch">
			{{tuidesc}}
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			tuiList: {
				type: Array,
				required: true,
			},
			orderBase: {
				type: Object,
				required: true,
			},
		},
		computed: {
			tuidesc: function() {
				return "取消规则：" + (this.orderBase.cancelDescription || "");
			},
			//动态的title拼接
			tuiTitle: function() {
				return "退款明细"
			},
			//处理退款单数据
			tuiOrderList: function() {
				//1、做一次深拷贝
				let tuiOrderArr = JSON.parse(JSON.stringify(this.tuiList));
				return tuiOrderArr;
			},
		},
		data() {
			return {
				listSwitch: false, //控制 伸缩和展开的按钮
			}
		},
		created() {
//			console.log("created");
		},
		mounted() {},
		methods: {
			/**
			 * 通过装填获取退款说明文字
			 */
			getHotelTuiOrderStatusUi(src) {
				if(src) {
					return "已退款"
				}
				return "未退款";
			},
		},
	}
</script>
<style lang="less">
	.hotel_return_collapse {
		margin: 20px 0;
		background: white;
		padding: 20px;
		.titleDiv {
			display: flex;
			.tuiTitle {
				color: #333333;
				font-weight: bold;
				font-size: 18px;
				margin-right: 40px;
			}
			.showItemIcon {
				flex: 0 0 7%;
				text-align: center;
				display: flex;
				justify-content: center;
				align-items: center;
                .imgDiv{
                    // margin: 15px 0 0 15px;
                    height: 18px;
                    width: 18px;
                    background: url(~assets//icon_tui_down.png);
                }                   
			}
			.showItemIconUp {
				flex: 0 0 7%;
				text-align: center;
				display: flex;
				justify-content: center;
				align-items: center;
                .imgDiv{
                    // margin: 15px 0 0 15px;
                    height: 18px;
                    width: 18px;
                    background: url(~assets//icon_tui_up.png);
                }   
			}
		}
		.status {
			padding: 15px 10px 5px 0;
			background: white;
			color: #7F7F7F;
		}
		.tuiDesc {
			padding: 10px;
			background: white;
		}
		.mainTable {
			border: 1px solid #EBEBEB;
			.title {
				padding: 5px 30px;
				background: #478aee;
				color: white;
				display: -webkit-box;
				display: -webkit-flex;
				display: flex;
				text-align: center;
				.left {
					/*flex:0 0 18%;*/
					margin-right: 60px;
				}
				.center {
					/*flex:0 0 70%;*/
					margin-right: 60px;
				}
				.right {
					margin-right: 0px;
					/*flex:0 0 12%;*/
				}
			}
			.table {
				background: white;
				display: flex;
				justify-content: space-between;
				padding: 20px 0;
				.passengerDiv {
					flex: 0 0 25%;
					display: flex;
					justify-content: center;
					align-items: center;
					.middleDiv {
						color: #333333;
						.passengers {
							margin-bottom: 10px;
							color: #7F7F7F;
						}
						.namesDiv {
							display: flex;
							font-weight: bold;
						}
						.hotel {
							margin-top: 10px;
							div {
								margin-bottom: 5px;
								font-weight: bold;
							}
							div:nth-child(1) {
								color: #7F7F7F;
								font-weight: normal;
							}
						}
					}
				}
				.priceDiv {
					flex: 0 0 25%;
					display: flex;
					justify-content: center;
					align-items: center;
					border-left: 1px dashed #EBEBEB;
					.middleDiv {
						padding: 0;
					}
					.RefundAmoun {
						padding-top: 10px;
						text-align: center;
						display: flex;
						color: #333333;
						span:nth-child(1) {
							color: #7F7F7F;
							margin-right: 20px;
						}
					}
				}
				.operation {
					flex: 0 0 25%;
					display: flex;
					justify-content: center;
					align-items: center;
					border-left: 1px dashed #EBEBEB;
					.middleDiv {
						color: #333333;
						font-size: 14px;
						.RefundAmoun {
							display: flex;
							color: #333333;
							justify-content: center;
						}
						.editBtn {
							margin: 0px auto;
							line-height: 32px;
							height: 32px;
							width: 120px;
							background: #C2C2C2;
							text-align: center;
							border-radius: 5px;
							span {
								color: white;
								align-self: center;
							}
						}								
						div:nth-child(2) {
							color: #F83939;
							font-weight: bold;
							font-size: 18px;
							margin: 10px 0;
						}
					}
				}
			}
		}
	}
</style>