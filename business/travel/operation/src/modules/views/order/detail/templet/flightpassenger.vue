<template>
	<!--乘客信息-->
	<div class="passengerItem">
		<div class="leftIcon">
			<img src="~assets//icon_customer_head.png" />
		</div>
		<div class="rightDiv">
			<div class="firstLine">
				<span class="spanF">{{passenger.psgName}}</span>
				<span class="spanS">{{ticketInfo.cabinName + ticketInfo.cabin}}</span>
				<InfoLabel class="spanT" :infoName="cardType" :infoValue="cardNo" classForName="infoLabel5" classForValue="infoLabel2">
					<span class="spanT2" slot="middlePoint" >:</span>
				</InfoLabel>
				<InfoLabel class="spanT" infoName="联系电话" :infoValue="passenger.mobile" classForName="infoLabel5" classForValue="infoLabel2">
					<span class="spanT2" slot="middlePoint" >:</span>
				</InfoLabel>
				<InfoLabel class="spanT" infoName="企业名称" :infoValue="cpyName" classForName="infoLabel5" classForValue="infoLabel2">
					<span class="spanT2" slot="middlePoint" >:</span>
				</InfoLabel>
			</div>
			<div class="secondLine">
				<!--<span>{{psgStatus}}</span>-->
				<div class="cust-status-btns">
					<div v-if="psgStatus">{{psgStatus}}</div>
					<template v-if="!ticketInfo.isGaiOrder">
						<div class="tips-wait" v-if="orderBase.orderStatus=='ALREADY_PAID' && psgStatuState(psg.status)== StateStyle.NORMAL">正在出票，请稍候</div>
						<div class="tips-wait" v-if="orderBase.orderStatus=='UNPAID'">待支付</div>
						<div class="tips-wait" v-if="orderBase.orderStatus=='ALREADY_CANCEL'">已取消</div>
						<div class="tips-wait" v-if="(orderBase.orderStatus=='PARTIAL_ALREADY_REFUND' || orderBase.orderStatus=='ALREADY_OUT_TICKET' 
							|| orderBase.orderStatus=='ALREADY_INVOICE') && psgStatuState(passenger.status)==StateStyle.NORMAL">出票成功</div>
						<div class="tips-failed" v-if="orderBase.orderStatus=='FAILED_OUT_TICKET'">出票失败</div>
					</template>
					<template v-else>
						<div class="tips-wait" v-if="getPsgStatuType(passenger.status)=='1' && psgStatuObj(passenger.status).ticketStatus== 'ALREADY_PAID'">正在出票，请稍候</div>
					</template>
					<div>
					<!-- 退票UI -->
					<refundticketFlight v-if="showRefundticket(ticketInfo, passenger)" :ticket="ticketInfo" :passenger="passenger" 
						:tuiOrder="tuiOrder" :orderBase="orderBase" :insuranceOrders="insuranceOrders" @refreshPage="refreshOrderPage" /> 
					</div>
				</div>
				
				<div class="status-message ticket-failed-info message" v-if="orderBase.orderStatus=='FAILED_OUT_TICKET'">
					因航司系统繁忙，出票失败；退款将在1-7个工作日内原路返回
				</div>
				<div class="status-message gai-failed-info message" v-if="getPsgStatuType(passenger.status)=='1' && psgStatuState(passenger.status)== StateStyle.FAILED">
					您改签的航班{{passenger.endorseShortInfo && '（'+passenger.endorseShortInfo+'）'}}由于航司系统繁忙改签失败，如有需要可重新提交
				</div>
				<template v-if="!!tuiOrder">
					<div class="status-message tui-failed-info message" v-if="getPsgStatuType(passenger.status)=='0' && psgStatuState(passenger.status)== StateStyle.FAILED">
						{{tuiOrder.platformRemarks || '因航司系统繁忙，请持购票有效证件到机场值机柜台办理'}}
					</div>
					<div class="showButtonWrap">
						<div class="status-message tui-success-info message" v-if="psgStatuState(passenger.status)==StateStyle.SUCCESS && getPsgStatuType(passenger.status)=='0' && !!tuiOrder">
							退款{{calcPrice}} 将在1-7个工作日内原路退回
						</div>
						<div class="dialogShow">
							<div class="refundDetail">
								<div class="title">退款明细</div>
								<ul>
									<li>
										<span>机票票款</span> <span>{{tuiOrder.partialPayAmount}}元</span>
									</li>
									<li v-if="tuiOrder.partialRefundFee!=null && tuiOrder.partialRefundFee!=undefined">
										<span>退票手续费</span> <span>{{tuiOrder.partialRefundFee}}元</span>
									</li>
									<li v-if="tuiOrder.partialRefundAmount!=null && tuiOrder.partialRefundAmount!=undefined">
										<span>应退票款</span> <span>{{tuiOrder.partialRefundAmount}}元</span>
									</li>
									<!--<li v-if="tuiOrder.refInsAmount!=null && tuiOrder.refInsAmount!=undefined">
										<span>应退出行保险</span> <span>{{tuiOrder.refInsAmount}}元</span>
									</li>-->
								</ul>
							</div>
						</div>
					</div>
				</template>
				<div class="add-money" v-if="showAddMoney(ticketInfo)">
					<div class="title">由于票价变动，您还需支付￥{{ticketInfo.realAddMoneyAmount}}</div>
				</div>
				<div class="gai-process-info" v-if="showGaiProcessInfo(ticketInfo)">
					正在为您办理{{psgStatuObj(passenger.status).name[0]}}，请稍候...
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    import InfoLabel from 'biscomponents/infolabel/msglabel.vue';
	import utils from 'bislibs/utils'
	const refundticketFlight = () => import("biscomponents/orderdetail/refundticket/flight.vue");   

	export default {
		components: {
			InfoLabel,
			refundticketFlight,
		},
		props: {
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
			//订单的信息
			orderBase: {
				type: Object,
				required: true,
			},
			//退票信息列表
			tuiOrderList: {
				type: Array,
				required: true,
			},
			//保险原始数据
			insuranceList: {
				type: Array,
				// required: true,
			},
		},
		computed: {
			//公司名称
			cpyName: function() {
                return this.orderBase.founderInfo.companyName;
            },
			// cpyName: function() {
			// 	let companyId = this.orderBase.companyId
			// 	if(!!utils.getStorage("companyArr")) {
			// 		let cpyNameObj = JSON.parse(utils.getStorage("companyArr"));
			// 		companyId = cpyNameObj[companyId]
			// 	}
			// 	return companyId;
			// },            
			//供应商电话
			providerPhone: function() {
				return this.orderBase.providerPhone;
			},
			//供应商名字
			provideName: function() {
				return this.orderBase.providerShortName;
			},
			//当前退票单子
			tuiOrder: function() {
				//如果乘客的最新状态是退票的状态，才显示退票记录。
				if(parseInt(this.passenger.status) < 10) {
					if(!!this.tuiOrderList && !!this.passenger.refundOrderNos && this.passenger.refundOrderNos.length > 0) {
						let TuiOrderList2 = JSON.parse(JSON.stringify(this.tuiOrderList));
						TuiOrderList2.sort(function(a, b) {
							return new Date(a.appDate) - new Date(b.appDate)
						})

						let psgId = this.passenger.psgId;

						for(let i = 0; i < TuiOrderList2.length; i++) {
							if(TuiOrderList2[i].psgIDs.indexOf(psgId) != -1) {
								return TuiOrderList2[i];
							}
						}
					}
				}
				return null;
			},
			totalCost: function() {
				return '￥' + (this.ticketInfo.sale + this.ticketInfo.oil + this.ticketInfo.tax + (!!this.passenger.isuPer ? this.passenger.isuPer : 0) + this.passenger.serFee);
			},
			totalPrice: function() {
				return '￥' + (this.ticketInfo.fare + this.ticketInfo.oil + this.ticketInfo.tax + (!!this.passenger.isuFarePer ? this.passenger.isuFarePer : 0) + this.passenger.serFee);
			},
			totalProfit: function() {
				return '￥' + ((this.ticketInfo.fare + this.ticketInfo.oil + this.ticketInfo.tax + (!!this.passenger.isuFarePer ? this.passenger.isuFarePer : 0) + this.passenger.serFee) -
					(this.ticketInfo.sale + this.ticketInfo.oil + this.ticketInfo.tax + (!!this.passenger.isuPer ? this.passenger.isuPer : 0) + this.passenger.serFee));
			},
			cardType: function() {
				return utils.getCardTypeName(parseInt(this.passenger.cardType));
			},
			cardNo: function() {
				return utils.getFormatCardNo(this.passenger.cardNo + "");
			},
			psgStatus: function() {
//				console.log("psgStatus=" + this.passenger.status);
				return this.getPsgStatusName(parseInt(this.passenger.status), this.ticketInfo.isGaiOrder);
			},
			calcPrice: function() {
				let amount = (this.tuiOrder.refTicketAmount || 0) + (this.tuiOrder.refInsAmount || 0);
				return amount ? "（￥" + amount + "）" : "";
			},
			//当前乘客购买的保险列表
			insuranceOrders:function(){
				let arr=this.insuranceList.filter(element=>{
					return element.airLineBriefInfo && element.airLineBriefInfo.airLineID == this.ticketInfo.airLineID
				})				
				return arr
			}
		},
		data() {
			return {
				StateStyle: utils.StateStyle, //psgStatusEnum中的StatuStyle对象
				showTips: false, //
			}
		},
		created() {},
		mounted() {},
		methods: {
			/**
			 * 获取出行人的状态名字
			 * @param status 状态码
			 * @returns {*}
			 */
			getPsgStatusName(status, isGaiOrder) {
				//改签单取分组1的状态名称
				return utils.getFlightPsgStatusName(status, isGaiOrder ? 1 : null);
			},
			/**
			 * 获取出行人的状态State
			 * @param status 状态码
			 * @returns {*}
			 */
			psgStatuState(status) {
				//非改签单，才显示disable的样式
				try {
					return utils.getFlightPsgStatusObj(status).state;
				} catch(e) {
					return null;
				}
			},
			/**
			 * 获取出行人的状态State
			 * @param status 状态码
			 * @returns {*}
			 */
			getPsgStatuType(status) {
				//非改签单，才显示disable的样式
				try {
					return utils.getFlightPsgStatusObj(status).type;
				} catch(e) {
					return null;
				}
			},
			/**
			 * 获取出行人的状态Obj
			 * @param status 状态码
			 * @returns {*}
			 */
			psgStatuObj(status) {
				//非改签单，才显示disable的样式
				try {
					return utils.getFlightPsgStatusObj(status);
				} catch(e) {
					return {};
				}
			},
			/**
			 * 是否展示补款模块
			 * @param airline 航班信息
			 */
			showAddMoney(airline) {
				if(!airline.isGaiOrder || !airline.gaiOrder || airline.gaiOrder.chaStatus != 5) { //TODO  这里是硬编码，以后要改！
					return false;
				}
				let realAddMoneyAmount = airline.gaiOrder.needExtraMoney ? airline.gaiOrder.realAddMoneyAmount : 0;
				airline.realAddMoneyAmount = realAddMoneyAmount; //同时给航班添加补款金额的属性
				//暂屏蔽倒计时
				// if (realAddMoneyAmount != 0) {
				//     this.countdown(600000, airline.gaiOrder.appDate, airline.airLineID);
				// }
				return realAddMoneyAmount != 0;
			},
			/**
			 * 是否展示“正在为您办理改签，请稍候”文字...
			 * @param airline 航班信息
			 */
			showGaiProcessInfo(airline) {
				if(!airline.isGaiOrder) {
					return false;
				}
				let flag = false;
				airline.passengers.forEach((psg) => {
					//如果需要补款，就不显示这段话
					if(!airline.gaiOrder.needExtraMoney && utils.getFlightPsgStatusObj(psg.status).state == this.StateStyle.INPROCESS) {
						flag = true;
						return;
					}
				})
				return flag;
			},
			//是否显示退票按钮 
            showRefundticket(ticket, psg) {   
				// <!-- 如果是改签单，只有改签成功和退票失败才展示退票按钮 -->
				// <!-- 如果是正常单，只有非改签成功和非退票成功才展示退票按钮 -->
				//订单状态必须是是已出票
				let isOrderStatus = this.orderBase.orderStatus=='PARTIAL_ALREADY_REFUND' 
					|| this.orderBase.orderStatus=='ALREADY_OUT_TICKET' || this.orderBase.orderStatus=='ALREADY_INVOICE'
				if(ticket.isGaiOrder){
					return isOrderStatus && (this.getPsgStatuType(psg.status)=='1' && this.psgStatuState(psg.status)== this.StateStyle.SUCCESS)
							|| (this.getPsgStatuType(psg.status)=='0' && this.psgStatuState(psg.status)== this.StateStyle.FAILED)
					
				}else{
					return isOrderStatus && this.psgStatuState(psg.status)!= this.StateStyle.SUCCESS;					
				}					
            },  		
			refreshOrderPage() {
				//退票操作完成，刷新订单数据
				this.$emit("refreshPage");
			},				
		},
	}
</script>
<style scoped lang="less">
	@import '../detail.less';
	@import '~styles/variables.less';
	@import '~styles/mixins/mixins.less';
	.passengerItem {
		background: white;
		display: flex;
		align-content: flex-start;
		padding: 40px 40px;
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
				.spanF {
					margin-right: 80px;
					color: #333333;
				}
				.spanS {
					margin-right: 40px;
					color: #333333;
				}
				.spanT {
					margin-right: 40px;
				}
				.spanT2 {
					margin-right: 10px;
				}
			}
			.secondLine {
				margin-top: 40px;
				padding-bottom: 6px;
				border-bottom: 1px dashed #7F7F7F;
				color: #25CB67;
				.cust-status-btns{
					display: flex;
					justify-content: space-between;
				}
				span {
					color: #25CB67;
					font-size: 18px;
				}
				.tips-wait{
					font-size: 16px;
				}
				.tips-failed{
					font-size: 16px;
					color: #F83939;
				}				
				.message {
					color: #25CB67;
					margin: 10px 0;
				}
				.showButtonWrap {
					position: relative;
					.dialogShow {
						display: none;
						position: absolute;
					    bottom: 20px;
					    left: 80px;
					    height: 200px;
					    width: 300px;
					    padding: 20px;
					    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
					    background: #fff;
					    z-index: 1;
					    border-radius: 5px;
					    overflow: auto;
						.refundDetail {
							background: #fff;
							color: @fc-normal;
							.title {
								font-size: 16px;
								margin: 0 auto 20px;
								font-weight: bold;
								text-align: center;
							}
							ul {
								li {
									.flex-box;
									.align-items(center);
									.justify-content(space-between);
									height: 35px;
									text-align: left;
								}
							}
						}
					}
				}
				// .showButtonWrap:hover .dialogShow{
				// 	display: block;
				// }						
			}
			.priceDiv {
				padding: 30px 0px;
				border-bottom: 1px dashed #7F7F7F;
				font-size: 14px;
				.line1 {
					color: #7F7F7F;
					display: flex;
					justify-content: space-between;
					margin-bottom: 20px;
					div {
						flex: 14%;
						display: flex;
					}
				}
				.line2 {
					color: #333333;
					display: flex;
					justify-content: space-between;
					margin-bottom: 20px;
					.firstChild {
						color: #7F7F7F
					}
					div {
						flex: 14%;
						display: flex;
					}
				}
				.line3 {
					color: #333333;
					display: flex;
					justify-content: space-between;
					margin-bottom: 20px;
					.firstChild {
						color: #7F7F7F
					}
					div {
						flex: 14%;
						display: flex;
					}
				}
				.line4 {
					color: #333333;
					display: flex;
					justify-content: space-between;
					.firstChild {
						color: #7F7F7F
					}
					div {
						flex: 14%;
						display: flex;
					}
				}
			}
			.tuiDiv {
				margin-top: 40px;
				color: #333333;
				font-size: 14px;
				.status {
					font-size: 16px;
					margin-bottom: 20px;
				}
				.lastLine {
					display: flex;
					justify-content: flex-start;
					margin-bottom: 10px;
					align-items: baseline;
					.editBtn {
						margin-left: 80px;
						line-height: 32px;
						height: 32px;
						width: 160px;
						background: #478aee;
						text-align: center;
						border-radius: 5px;
						span {
							color: white;
							align-self: center;
						}
					}
					.hidebg {
						position: relative;
						.editBtn {
							margin-left: 80px;
							line-height: 32px;
							height: 32px;
							width: 160px;
							background: #478aee;
							text-align: center;
							border-radius: 5px;
							span {
								color: white;
								align-self: center;
							}
						}
						.hidebox {
							position: absolute;
							bottom: 40px;
							/*right: 0;*/
							height: 150px;
							width: 480px;
							padding: 20px;
							box-shadow: 0px 2px 10px rgba(0, 0, 0, .5);
							background: #fff;
							z-index: 1;
							border-radius: 5px;
							overflow: auto;
							.boxtitle {
								text-align: center;
								font-size: 24px;
							}
							.boxContent {
								margin: 10px 0;
								line-height: 24px;
							}
							.boxFotter {
								text-align: center;
								font-size: 16px;
								color: black;
								span {
									padding: 10px;
									background: white;
									border: 1px solid;
									border-radius: 10px;
									margin: 10px;
								}
							}
						}
					}
				}
			}
		}
	}
</style>