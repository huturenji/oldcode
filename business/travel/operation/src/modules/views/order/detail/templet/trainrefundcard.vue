<template>
	<!-- 退款明细 -->
	<div class="train_return_collapse">
		<div class="titleDiv">
			<div class="tuiTitle">{{tuiTitle}}</div>
			<div class="cursorp" :class="listSwitch ? 'showItemIconUp' : 'showItemIcon'" @click.stop="listSwitch = !listSwitch">
				<div class="imgDiv" />
			</div>
		</div>
		<div v-for="item in refundOrderList" :key="item.refundNo" v-show="listSwitch">
            <div v-if="item.refundType == 'HIGH_TO_LOW'">	<!-- 改签高改低 UE不一样 -->
                <div class="status">{{getTrainTuiOrderStatusUi(item.orderStatus) +" "+ (item.refDate ||"")}}</div>
                <div class="mainTable">
                    <div class="title">
                        <div class="left">改签信息</div>
                        <div class="center">退款明细</div>
                        <div class="right">退款结果</div>
                    </div>
                    <div class="table">
                        <div class="passengerDiv">
                            <div class="middleWrap">
                                <div v-if="!!item.psgNameList" class="passengers">改签乘客</div>
                                <div v-for="psg in item.psgNameList" :key="psg">{{psg}}</div>
                                <div v-if="!!item.orderInfo" class="checi">
                                    <div>改签车次</div>
                                    <div>{{item.orderInfo.trainNo}}</div>
                                    <div>{{getDataFromTime(item)}}</div>
                                    <div>{{item.orderInfo.startStation}}——{{item.orderInfo.endStation}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="priceDivGai2">
                            <div class="line">
                                <div class="content">退还改签差额<span>￥{{Number(item.ticketFareAmount||0).toFixed(2)}}</span></div>
                                <div class="detail">原票价<span>￥{{Number(item.oldSeatPrice||0).toFixed(2)}}</span>，改签票价<span>￥{{Number(item.seatPrice||0).toFixed(2)}}</span>
                                ，改签手续费：<span>￥{{Number(item.changeChargeFee||0).toFixed(2)}}</span></div>
                            </div>
                            <div class="line">
                                <div class="content">返还商旅通优惠<span>￥{{Number(item.couponConsumptionAmount||0).toFixed(2)}}</span></div>
                                <div class="detail" v-if="Number(item.couponConsumptionAmount||0) > 0">改签后订单不满足优惠券使用条件，需返还商旅通优惠<span>￥{{Number(item.couponConsumptionAmount||0).toFixed(2)}}</span></div>
                            </div>
                        </div>
                        <div class="operation">
                            <div class="middleDiv">
                                <div class="RefundAmoun">实退金额</div>
                                <div class="RefundAmoun">￥{{Number(item.refTicketAmount|| 0).toFixed(2)}}</div>
                                <div class="editBtn">
                                    <span>已退款</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="status">{{getTrainTuiOrderStatusUi(item.orderStatus) +" "+ (item.refDate ||"")}}</div>
                <div class="mainTable">
                    <div class="title">
                        <div class="left">退票信息</div>
                        <div class="center">退款明细</div>
                        <div class="right">退款结果</div>
                    </div>
                    <div class="table">
                        <div class="passengerDiv">
                            <div class="middleWrap">
                                <div v-if="!!item.psgNameList" class="passengers">退票乘客</div>
                                <div v-for="psg in item.psgNameList" :key="psg">{{psg}}</div>
                                <div v-if="!!item.orderInfo" class="checi">
                                    <div>车次</div>
                                    <div>{{item.orderInfo.trainNo}}</div>
                                    <div>{{getDataFromTime(item)}}</div>
                                    <div>{{item.orderInfo.startStation}}——{{item.orderInfo.endStation}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="priceDiv">
                            <div class="line1">
                                <div class="hidebg tableCell" :class="{tableCellhover:child.orderType >=0 && child.orderType <=4}" v-for="(child) in item.refundChildOrders" :key="child.name">
                                    <div>
                                        <div>{{child.name}}</div>
                                        <div :class="child.status=='不涉及'?'status1':'status2'">
                                            <div class="imgDiv" v-if="child.status!='不涉及' && child.status!=''" /> {{child.status}}
                                        </div>
                                    </div>
                                    <div class="hidebox2" :style="{height:getDialogHeight(child)}">
                                        <div v-if="child.status=='不涉及'">
                                            <div class="boxtitle">本次退票不涉及{{child.name}}</div>
                                            <div class="boxFotter" v-if="child.orderType == 3 || child.orderType == 4">如有疑问，请联系客服：{{sinosunPhone(item)}}</div>
                                            <div class="boxFotter" v-else>如有疑问，请联系客服：{{item.orderInfo.providerPhone}}</div>
                                        </div>
                                        <div v-else-if="child.orderType == 0">
                                            <div class="boxtitle">{{item.orderInfo.providerShortName}}已审核，同意退票</div>
                                            <div class="boxContent">审核时间：{{item.refDate}}</div>
                                            <div class="boxContent">乘客：{{item.refPsgName}}</div>
                                            <div class="boxContent" v-if="!!item.orderInfo">车次：{{item.orderInfo.trainNo +" " + getDataFromTime(item) + " " + item.orderInfo.startStation + '——' + item.orderInfo.endStation}}</div>
                                            <div class="boxContent">消费金额：￥{{Number(child.partialPayAmount || 0).toFixed(2)}}</div>
                                            <div class="boxContent">退票扣减：￥{{Number(child.refundFee|| 0).toFixed(2)}}</div>
                                            <div class="boxContent">实退金额：￥{{Number(child.partialPayAmount|| 0).toFixed(2) - Number(child.refundFee|| 0).toFixed(2)}}</div>
                                            <div class="boxFotter">如有疑问，请联系客服：{{item.orderInfo.providerPhone}}</div>
                                        </div>
                                        <div v-else-if="child.orderType == 2">
                                            <div class="boxtitle" v-if="!!child.partialPayAmount && child.partialPayAmount > 0">{{item.orderInfo.providerShortName}}已审核，同意退保</div>
                                            <div class="boxtitle" v-else>{{item.orderInfo.providerShortName}}已审核，不可退保</div>
                                            <div class="boxContent">审核时间：{{item.refDate}}</div>
                                            <div class="boxContent">被保险人：{{item.refPsgName}}</div>
                                            <div class="boxContent">投保产品：乘意险</div>
                                            <div class="boxContent">消费金额：￥{{Number(child.partialPayAmount|| 0).toFixed(2)}}</div>
                                            <div class="boxContent">退票扣减：￥{{Number(child.refundFee|| 0).toFixed(2)}}</div>
                                            <div class="boxContent">实退金额：￥{{Number(child.partialPayAmount|| 0).toFixed(2)-Number(child.refundFee|| 0).toFixed(2)}}</div>
                                            <div class="boxFotter">如有疑问，请联系客服：{{item.orderInfo.providerPhone}}</div>
                                        </div>
                                        <div v-else-if="child.orderType == 4">
                                            <div class="boxtitle">{{sinosunName(item)}}已审核，扣减购票优惠</div>
                                            <div class="boxContent">审核时间：{{item.refDate}}</div>
                                            <div class="boxContent">消费金额：-￥{{Number(child.partialPayAmount|| 0).toFixed(2)}}</div>
                                            <div class="boxContent">实退金额：-￥{{Number(child.partialPayAmount|| 0).toFixed(2)}}</div>
                                            <div class="boxFotter">如有疑问，请联系客服：{{sinosunPhone(item)}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="line2">
                                <div :class="index == 0 ? 'firstChild' : ''" v-for="(child,index) in item.refundChildOrders" :key="child.childRefOrderNo">
                                    {{getTableCellAmountUI(child.status, child.partialPayAmount, child.orderType)}}
                                </div>
                            </div>
                            <div class="line3">
                                <div :class="index == 0 ? 'firstChild' : ''" v-for="(child,index) in item.refundChildOrders" :key="child.childRefOrderNo">
                                    {{getTableCellAmountUI(child.status, child.refundFee, child.orderType)}}
                                </div>
                            </div>
                            <div class="line4">
                                <div :class="index == 0 ? 'firstChild' : ''" v-for="(child,index) in item.refundChildOrders" :key="child.childRefOrderNo">
                                    {{getTableCellAmountUI(child.status, child.partialRefAmount, child.orderType)}}
                                </div>
                            </div>
                        </div>
                        <div class="operation">
                            <div class="middleDiv">
                                <div class="RefundAmoun">实退金额</div>
                                <div class="RefundAmoun">￥{{!!item.refundChildOrders ? Number((item.refundChildOrders[item.refundChildOrders.length-1].partialRefAmount)|| 0).toFixed(2) : 0}}</div>
                                <div class="editBtn">
                                    <span>已退款</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
		</div>
		<div class="tuiDesc" v-if="!!refundOrderList && refundOrderList.length>0 && listSwitch">
			{{tuidesc}}
		</div>
	</div>
</template>

<script>
	import utils from 'bislibs/utils'
	export default {
		props: {
			tuiList: {
				type: Array,
				required: true,
			},
		},
		computed: {
			tuidesc: function() {
				return "退款说明：1、车票退款按火车票退改规则执行；  2、出行保险在乘车当天0:00前可退保，过时不可退保；    3、退款后不满足优惠券使用条件，则在退款时扣减相应优惠金额；";
			},
			//动态的title拼接
			tuiTitle: function() {
				return "退款明细"
			},
			//处理退款单数据
			refundOrderList: function() {
				//1、做一次深拷贝
				let tuiOrderArr = JSON.parse(JSON.stringify(this.tuiList));
				//2、定义费用类型，OrderType的类型，具体定义参见getNameForOrdertype方法
				let ordertypeStart = 0;
				let ordertypeEnd = 4;

				//3、解析tuiOrder数据，手动生成退款明细列表RefundChildOrders用于UI的展示
				for(let i = 0; i < tuiOrderArr.length; i++) {
                    let tuiOrder = tuiOrderArr[i];

					//退票人列表
					let array = !!tuiOrder.refPsgName ? tuiOrder.refPsgName.split(","):[]
//					console.log("psgNameList.array=" + array);
                    tuiOrder.psgNameList = array || [];
                                        
                    if(tuiOrder.refundType == 'HIGH_TO_LOW'){
                        //改签单高改低不需要表格UE数据
                        continue;
                    }
					//退款明细数组
					let refundChildOrders = [];
					//添加第一列
					let uiTableItem = {
						"orderType": -1,
						"name": "",
						"status": "",
						"partialPayAmount": "消费金额", //消费款
						"refundFee": "退票扣减", //扣款
						"partialRefAmount": "实退金额", //退款
					}
					refundChildOrders.push(uiTableItem);
					//添加第二列 车票	
					uiTableItem = {
						"orderType": 0,
						"name": this.getNameForOrdertype(0, ordertypeEnd),
						//扣款不为0，说明退款已经成功
						"status": !!tuiOrder.seatConsumptionAmount && Number(tuiOrder.seatConsumptionAmount) > 0 ? "已审核" : "不涉及",
						"partialPayAmount": Number(tuiOrder.seatConsumptionAmount || 0).toFixed(2), //消费款
						"refundFee": Number(tuiOrder.seatRefundDeduction || 0).toFixed(2), //扣款
						"partialRefAmount": (Number(tuiOrder.seatConsumptionAmount || 0).toFixed(2) - Number(tuiOrder.seatRefundDeduction || 0).toFixed(2)), //退款
					}
					refundChildOrders.push(uiTableItem);
					//添加第三列 出行保险	
					uiTableItem = {
						"orderType": 2,
						"name": this.getNameForOrdertype(2, ordertypeEnd),
						"status": !!tuiOrder.insuranseConsumptionAmount && Number(tuiOrder.insuranseConsumptionAmount) > 0 ? "已审核" : "不涉及",
						"partialPayAmount": Number(tuiOrder.insuranseConsumptionAmount || 0).toFixed(2), //消费款
						"refundFee": Number(tuiOrder.insuranseRefundDeduction || 0).toFixed(2), //扣款
						"partialRefAmount": (Number(tuiOrder.insuranseConsumptionAmount || 0).toFixed(2) - Number(tuiOrder.insuranseRefundDeduction || 0).toFixed(2)), //退款
					}
					refundChildOrders.push(uiTableItem);
					//添加第四列 优惠券	
					uiTableItem = {
						"orderType": 4,
						"name": this.getNameForOrdertype(4, ordertypeEnd),
						"status": !!tuiOrder.couponConsumptionAmount && Number(tuiOrder.couponConsumptionAmount) > 0 ? "已审核" : "不涉及",
						"partialPayAmount": Number(tuiOrder.couponConsumptionAmount || 0).toFixed(2), //消费款
						"refundFee": 0, //扣款
						"partialRefAmount": Number(tuiOrder.couponConsumptionAmount || 0).toFixed(2), //退款
					}
					refundChildOrders.push(uiTableItem);
					//添加第五列 总计
					uiTableItem = {
						"orderType": ordertypeEnd + 1,
						"name": this.getNameForOrdertype(ordertypeEnd + 1, ordertypeEnd),
						"status": "",
						//这里的有问题，不应该前端去计算，应该后端返回结果，前端展示而已。需要后面调整//TODO
						"partialPayAmount": (Number(tuiOrder.seatConsumptionAmount || 0) + Number(tuiOrder.insuranseConsumptionAmount || 0)).toFixed(2), //消费款
						"refundFee": (Number(tuiOrder.insuranseRefundDeduction || 0) + Number(tuiOrder.seatRefundDeduction || 0)).toFixed(2), //扣款
						"partialRefAmount": (Number(tuiOrder.seatConsumptionAmount || 0) + Number(tuiOrder.insuranseConsumptionAmount || 0) -
							Number(tuiOrder.insuranseRefundDeduction || 0) - Number(tuiOrder.seatRefundDeduction || 0)).toFixed(2), //退款
					}
					refundChildOrders.push(uiTableItem);

					tuiOrder.refundChildOrders = refundChildOrders;
				}

				return tuiOrderArr;
			},
			// sinosunPhone: function(item) {
			// 	return item.orderInfo.retailerPhone || utils.BIS_CUSTOMER_SERVICE_PHONE; //
			// },
			// sinosunName: function(item) {
			// 	return item.orderInfo.retailerShortName || "兆日国际旅行社"; //
			// },
		},
		data() {
			return {
				listSwitch: false, //控制 伸缩和展开的按钮
				showTips: false, //
			}
		},
		created() {
//			console.log("created");
		},
		mounted() {},
		methods: {
			sinosunPhone(item) {
				return item.orderInfo.retailerPhone || utils.BIS_CUSTOMER_SERVICE_PHONE; //
			},
			sinosunName(item) {
				return item.orderInfo.retailerShortName || "兆日国际旅行社"; //
			},            
			/**
			 * 通过OrderType获取明细的名字
			 */
			getNameForOrdertype(orderType, endType) {
				let result = ""
				if(orderType == endType + 1) {
					result = "总计";
				} else {
					//后面的改签费等会有多个，然后名字不同，增加一个改签费1等等。//TODO
					switch(parseInt(orderType)) {
						case 0:
							result = "车票";
							break;
						case 1:
							result = "改签费";
							break;
						case 2:
							result = "出行保险";
							break;
						case 3:
							result = "快递";
							break;
						case 4:
							result = "优惠券";
							break;
						default:
							result = "";
							break;
					}
				}
				return result;
			},
			/**
			 * 表格的每一项数据的具体UI显示
			 */
			getTableCellAmountUI(status, amount, type) {
				if(status == '不涉及') {
					return '---';
				} else if(!!status) {
					if(type == 4) { //优惠券 显示-
						return "-￥" + Number(amount || 0).toFixed(2)
					} else {
						return "￥" + Number(amount || 0).toFixed(2)
					}
				} else {
					//-1是第一列
					if(type != -1) {
						return "￥" + Number(amount || 0).toFixed(2);
					} else {
						return amount;
					}
				}
			},
			/**
			 * 发起退款
			 */
			startRefMoney(item) {
				let _this = this;
				_this.showTips = false;
				_this.$emit('startRefMoney', item);
			},
			getTrainTuiOrderStatusUi(src) {
				if(src == 3) {
					return "已退款"
				}
				return "未退款";
			},
			showDialog(child) {
				if(child.orderType >= 0 && child.orderType <= 4) {
					child.showMouseTips = !child.showMouseTips;
					//需要强制刷新
					this.$forceUpdate();
				}
			},
			getDialogHeight(child){
				let result = 105
				if(child.status=='不涉及'){
					result = 105
				}else if(child.orderType == 0 || child.orderType == 1|| child.orderType == 2){
					result = 295
				}else if(child.orderType == 3){
					result = 235
				}else if(child.orderType == 4){
					result = 205
				}else{
					
				}
//				console.log('getDialogHeighttrain='+result);
				return result+ 'px';
            },			
            getDataFromTime(item){
                return item.orderInfo.startDate
            },	
		},
	}
</script>
<style lang="less">
	.train_return_collapse {
		margin: 20px 0;
		background: white;
		padding: 20px;
		.status {
			padding: 10px 10px 10px 0;
			background: white;
			color: #7F7F7F;
		}
		.tuiDesc {
			padding: 10px;
			background: white;
			color: #7F7F7F;
		}
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
		.mainTable {
			border: 1px solid #EBEBEB;
			font-size: 14px;
			.title {
				padding: 5px 0px;
				background: #478aee;
				color: white;
				display: flex;
				justify-content: space-between;
				text-align: center;
				.left {
					flex: 0 0 18%;
				}
				.center {
					flex: 0 0 70%;
				}
				.right {
					flex: 0 0 12%;
				}
			}
			.table {
				background: white;
				display: flex;
				justify-content: space-between;
				padding: 30px 0;
				.passengerDiv {
					flex: 0 0 18%;
					display: flex;
					justify-content: center;
					align-items: center;
					border-right: 1px dashed #EBEBEB;
					.middleWrap {
						color: #333333;
						font-weight: bold;
						padding: 0 20px;
						.passengers {
							margin-bottom: 10px;
							color: #7F7F7F;
							font-weight: normal;
						}
						.checi {
							color: #333333;
							div {
								margin-bottom: 5px;
							}
							div:nth-child(1) {
								color: #7F7F7F;
								font-weight: normal;
								margin-top: 10px;
							}
						}
					}
                }
                .priceDivGai2{
					flex: 0 0 70%;
					border-right: 1px dashed #EBEBEB;
                    overflow-y: scroll;
                    padding: 0px 40px;
                    margin: auto;
                    .line{
                        margin-bottom: 30px;    
                        span{
                            color: #333333;
                            font-weight: bold;
                        }                    
                        .content{
                            color: #333333;
                            font-size: 14px;
                        }
                        .detail{
                            color: #7F7F7F;
                            font-size: 12px;
                        }
                    }                    
                }
				.priceDiv {
					flex: 0 0 70%;
					border-right: 1px dashed #EBEBEB;
					// overflow-y: scroll;
					.line1 {
						color: #7F7F7F;
						display: flex;
						justify-content: space-between;
						margin-bottom: 30px;
						.tableCell {
							flex: 20%;
							text-align: center;
							div {
								.status1 {
									margin-top: 14px;
									color: #F83939;
									font-size: 12px;
								}
								.status2 {
									margin-top: 14px;
									color: #25CB67;
                                    font-size: 12px;
                                    display: flex;
                                    justify-content: center;                                    
                                    .imgDiv{
                                        height: 15px;
                                        width: 20px;
                                        background: url(~assets//icon_gou.png); 
                                        background-size: contain;
                                    }
								}
							}
						}
					}
					.line2 {
						color: #333333;
						display: flex;
						justify-content: space-between;
						margin-bottom: 30px;
						.firstChild {
							color: #7F7F7F;
							.status1 {
								color: #F83939;
							}
							.status2 {
								color: #25CB67;
							}
						}
						div {
							flex: 20%;
							display: flex;
							justify-content: center;
							font-weight: bold;
						}
						div:nth-child(1) {
							font-weight: normal;
						}
					}
					.line3 {
						color: #333333;
						display: flex;
						justify-content: space-between;
						margin-bottom: 30px;
						.firstChild {
							color: #7F7F7F
						}
						div {
							flex: 20%;
							display: flex;
							justify-content: center;
							font-weight: bold;
						}
						div:nth-child(1) {
							font-weight: normal;
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
							flex: 20%;
							display: flex;
							justify-content: center;
							font-weight: bold;
						}
						div:nth-child(1) {
							font-weight: normal;
						}
					}
				}
				.operation {
					flex: 0 0 12%;
					display: flex;
					justify-content: center;
					align-items: center;
					.middleDiv {
						font-size: 14px;
					}
					.RefundAmoun {
						padding-top: 10px;
						text-align: center;
						font-weight: bold;
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
		.hidebg {
			position: relative;
			.editBtn {
				margin: 0px auto;
				line-height: 32px;
				height: 32px;
				width: 80px;
				background: gray;
				text-align: center;
				border-radius: 5px;
				span {
					color: white;
					align-self: center;
				}
			}
			.editBtn2 {
				margin: 0px auto;
				line-height: 32px;
				height: 32px;
				width: 80px;
				background: gray;
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
				right: 0;
				height: 250px;
				width: 480px;
				padding: 20px;
				box-shadow: 0px 2px 10px rgba(0, 0, 0, .5);
				background: #fff;
				z-index: 1;
				border-radius: 5px;
				overflow: auto;
				.boxtitle {
					text-align: center;
					font-size: 14px;
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
			.hidebox2 {
				display: none;
				position: absolute;
				right: -120px;
				height: 250px;
				width: 350px;
				padding: 20px;
				font-size: 14px;
				box-shadow: 0px 2px 10px rgba(0, 0, 0, .5);
				background: #fff;
				z-index: 1;
				border-radius: 5px;
				overflow: auto;
				.boxtitle {
					text-align: center;
					font-weight: bold;
					color: #333333;
				}
				.boxContent {
					color: #7F7F7F;
					margin-top: 10px;
					text-align: left;
				}
				.boxFotter {
					color: #7F7F7F;
					border-top: 1px dashed #EBEBEB;
					text-align: center;
					margin-top: 10px;
					padding-top: 10px;
				}
			}
		}
		.tableCellhover:hover .hidebox2 {
			display: block;
		}
	}
</style>