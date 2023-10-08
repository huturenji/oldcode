<template>
	<!-- 退款申请 -->
	<div class="flight_return_collapse">
		<div class="titleDiv">
			<div class="tuiTitle">{{tuiTitle}}</div>
			<div class="cursorp" :class="listSwitch ? 'showItemIconUp' : 'showItemIcon'" @click.stop="listSwitch = !listSwitch">
				<div class="imgDiv" />
			</div>
		</div>
		<div v-for="item in tuiOrderList" :key="item.refOrderNo" v-show="listSwitch">
			<div class="status">{{getFlightTuiOrderStatusUi(item.outterRefStatus) +" "+ (item.outterRefDate ||"")}}</div>
			<div class="mainTable">
				<div class="title">
					<div class="left">退票信息</div>
					<div class="center">退款明细</div>
					<div class="right">操作</div>
				</div>
				<div class="table">
					<div class="passengerDiv">
						<div class="middleWrap">
							<div v-if="!!item.psgNameList" class="passengers">退票乘客</div>
							<div v-for="psg in item.psgNameList" :key="psg">{{psg}}</div>
							<div v-for="(airLine,index) in item.airLineShortInfos" :key="airLine.flightNo">
								<div v-if="!!item.airLineShortInfos && item.airLineShortInfos.length>0">
									<div style="color: #7F7F7F; margin: 10px 0;">航班{{item.airLineShortInfos.length > 1?index+1:""}}：</div>
									<div>{{airLine.airLineName + airLine.flightNo}}</div>
									<div style="margin: 5px 0;">{{new Date(airLine.beginDate).format("MM月dd日") +"周"+ getDateDayStr(airLine.beginDate)}}</div>
									<div>{{airLine.sAirportName + airLine.sTerminal}}—{{airLine.eAirportName + airLine.eTerminal}}</div>
								</div>	
							</div>
						</div>
					</div>
					<div class="priceDiv">
						<div class="line1">
							<div class="hidebg tableCell" :class="{tableCellhover:child.orderType >=0 && child.orderType <=4}" v-for="(child) in item.refundChildOrders" :key="child.childRefOrderNo">
								<div>
									<div>{{child.name}}</div>
									<div :class="child.status=='不涉及'?'status1':'status2'">
										<div class="imgDiv" v-if="child.status!='不涉及' && child.status!=''" /> {{child.status}}
									</div>
								</div>
								<div class="hidebox2" :style="{height:getDialogHeight(child)}">
									<div v-if="child.status=='不涉及'">
										<div class="boxtitle"  v-if="child.orderType == 1">本次退票不涉及改签费用</div>
										<div class="boxtitle" v-else-if="child.orderType == 3">本次退票不涉及快递费用</div>
										<div class="boxtitle" v-else-if="child.orderType == 4">本次退票不涉及优惠扣减</div>
										<div class="boxtitle" v-else>本次退票不涉及{{child.name}}</div>
										<div class="boxFotter" v-if="child.orderType == 3 || child.orderType == 4">如有疑问，请联系客服：{{sinosunPhone}}</div>
										<div class="boxFotter" v-else>如有疑问，请联系客服：{{orderBase.providerPhone}}</div>
									</div>
									<div v-else-if="child.orderType == 0">
										<div class="boxtitle">{{orderBase.providerShortName}}已审核，同意退票</div>
										<div class="boxContent">审核时间：{{item.refDate}}</div>
										<div class="boxContent">乘客：{{item.psgNames}}</div>
										<div  v-for="(airLine,index) in item.airLineShortInfos" :key="airLine.airLineID">
											<div class="boxContent" v-if="!!item.airLineShortInfos && item.airLineShortInfos.length>0">
												<span>航班{{(item.airLineShortInfos.length > 1?index+1:"") +":"+airLine.airLineName + airLine.flightNo}}</span>
												<span style="margin-left: 10px;margin-right: 10px;">{{new Date(airLine.beginDate).format("MM月dd日") +"周"+ getDateDayStr(airLine.beginDate)}}</span>
												<span>{{airLine.sAirportName + airLine.sTerminal +'-' +airLine.eAirportName + airLine.eTerminal}}</span>
											</div>
										</div>
										<div class="boxContent">消费金额：￥{{Number(child.partialSettleAmount || 0).toFixed(2)}}</div>
										<div class="boxContent">退票扣减：￥{{Number(child.refundFee|| 0).toFixed(2)}}</div>
										<div class="boxContent">实退金额：￥{{Number(child.partialRefSettleAmount|| 0).toFixed(2)}}</div>
										<div class="boxFotter">如有疑问，请联系客服：{{orderBase.providerPhone}}</div>
									</div>
									<div v-else-if="child.orderType == 1">
										<div class="boxtitle">{{orderBase.providerShortName}}已审核，同意退还改签费用</div>
										<div class="boxContent">审核时间：{{item.refDate}}</div>
										<div class="boxContent">乘客：{{item.psgNames}}</div>
										<div  v-for="(airLine,index) in item.airLineShortInfos" :key="airLine.airLineID">
											<div class="boxContent" v-if="!!item.airLineShortInfos && item.airLineShortInfos.length>0">
												<span>航班{{(item.airLineShortInfos.length > 1?index+1:"") +":"+airLine.airLineName + airLine.flightNo}}</span>
												<span style="margin-left: 10px;margin-right: 10px;">{{new Date(airLine.beginDate).format("MM月dd日") +"周"+ getDateDayStr(airLine.beginDate)}}</span>
												<span>{{airLine.sAirportName + airLine.sTerminal +'-' +airLine.eAirportName + airLine.eTerminal}}</span>
											</div>
										</div>
										<div class="boxContent">消费金额：￥{{Number(child.partialSettleAmount|| 0).toFixed(2)}}</div>
										<div class="boxContent">退票扣减：￥{{Number(child.refundFee|| 0).toFixed(2)}}</div>
										<div class="boxContent">实退金额：￥{{Number(child.partialRefSettleAmount|| 0).toFixed(2)}}</div>
										<div class="boxFotter">如有疑问，请联系客服：{{orderBase.providerPhone}}</div>
									</div>
									<div v-else-if="child.orderType == 2">
										<div class="boxtitle" v-if="!!child.partialRefSettleAmount && Number(child.partialRefSettleAmount) > 0">{{orderBase.providerShortName}}已审核，同意退保</div>										
										<div class="boxtitle" v-else>{{orderBase.providerShortName}}已审核，不可退保</div>
										<div class="boxContent">审核时间：{{item.refDate}}</div>
										<div class="boxContent">被保险人：{{item.psgNames}}</div>
										<div class="boxContent">投保产品：航空意外险</div>
										<div class="boxContent">消费金额：￥{{Number(child.partialSettleAmount|| 0).toFixed(2)}}</div>
										<div class="boxContent">退票扣减：￥{{Number(child.refundFee|| 0).toFixed(2)}}</div>
										<div class="boxContent">实退金额：￥{{Number(child.partialRefSettleAmount|| 0).toFixed(2)}}</div>
										<div class="boxFotter">如有疑问，请联系客服：{{orderBase.providerPhone}}</div>
									</div>
									<div v-else-if="child.orderType == 3">
										<div class="boxtitle" v-if="hasMaiInvoice">快递已寄出，不可退快递费</div>
										<div class="boxtitle" v-else>{{orderBase.retailerShortName}}已审核，同意退还快递费</div>
										<div class="boxContent">审核时间：{{item.refDate}}</div>
										<div class="boxContent">消费金额：￥{{Number(child.partialPayAmount|| 0).toFixed(2)}}</div>
										<div class="boxContent">退票扣减：￥{{Number(child.refundFee|| 0).toFixed(2)}}</div>
										<div class="boxContent">实退金额：￥{{Number(child.partialRefAmount|| 0).toFixed(2)}}</div>
										<div class="boxFotter">如有疑问，请联系客服：{{sinosunPhone}}</div>
									</div>
									<div v-else-if="child.orderType == 4">
										<div class="boxtitle">{{orderBase.retailerShortName}}已审核，扣减购票优惠</div>
										<div class="boxContent">审核时间：{{item.refDate}}</div>
										<div class="boxContent">消费金额：{{(Number(Math.abs(child.partialPayAmount))!=0 ?"-￥":"￥") + Number(Math.abs(child.partialPayAmount)|| 0).toFixed(2)}}</div>
										<div class="boxContent">实退金额：{{(Number(Math.abs(child.partialRefAmount))!=0 ?"-￥":"￥") + Number(Math.abs(child.partialRefAmount)|| 0).toFixed(2)}}</div>
										<div class="boxFotter">如有疑问，请联系客服：{{sinosunPhone}}</div>
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
						<div>
							<div class="RefundAmoun">实退金额</div>
							<div class="RefundAmoun2">￥{{Number(item.partialRefundAmount|| 0).toFixed(2)}}</div>
							<!--退款中 outterRefStatus=0 这个时候客服来发起退款-->
							<div class="hidebg">
								<div class="cursorp" @click="showDialog(item)" :class="isNeedStartRef(item) ? 'editBtn':'editBtn2'">
									<span v-if="isNeedStartRef(item)">发起退款</span>
									<span v-else>已退款</span>
								</div>
								<div class="hidebox" v-show="item.showTips">
									<div class="boxtitle">确定退款</div>
									<div class="boxContent" style="margin: 20px 0;"> 请再次核对退款金额，“确定退款”后资金将按原路退回，不可撤销</div>
									<div class="boxContent">消费金额：￥{{Number(item.partialPayAmount|| 0).toFixed(2)}}</div>
									<div class="boxContent">退票扣减：￥{{Number(item.partialRefundFee|| 0).toFixed(2)}}</div>
									<div class="boxContent">实退金额：￥{{Number(item.partialRefundAmount|| 0).toFixed(2)}}</div>
									<div class="boxFotter">
										<span class="cursorp" @click="closeDialog(item)">取消</span>
										<span class="cursorp" @click="startRefMoney(item)">确定退款</span>
									</div>
								</div>
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
	import  * as travelfun from "bislibs/traveloperationfun.js";

	export default {
		props: {
			tuiList: {
				type: Array,
				required: true,
			},
			airLines: {
				type: Array,
				required: true,
			},
			orderBase: {
				type: Object,
				required: true,
			},
			hasMaiInvoice: {
				type: Boolean,
				required: true,
			},
		},
		computed: {
			tuidesc: function() {
				return "退款说明：1、机票、改签费退款按航司退改规则执行； 2、出行保险在起飞当天0:00前可退保，过时不可退保；    3、快递未寄送且所有乘客全部退票后将退还快递费用；4、退款后不满足优惠券使用条件，则在退款时扣减相应优惠金额；";
			},
			//动态的title拼接
			tuiTitle: function() {
				//筛选出等待退款的数量
				let waitTuiSize = 0;
				if(this.tuiList.length > 0) {
					for(let i = 0; i < this.tuiList.length; i++) {
						if(this.tuiList[i].outterRefStatus == 0) {
							waitTuiSize += 1;
						}
					}
				}
				if(waitTuiSize > 0) {
					return "退款申请" + "（" + waitTuiSize + "条待退款）";
				}
				return "退款申请"
			},
			//处理退款单数据
			tuiOrderList: function() {
				//1、做一次深拷贝
				let tuiOrderArr = JSON.parse(JSON.stringify(this.tuiList));
				//2、筛选出供应商退款成功的单子，这些单子需要显示。
				if(tuiOrderArr.length > 0) {
					for(let i = 0; i < tuiOrderArr.length; i++) {
						//必须是OutterRefStatus有值，供应商退款成功后才有值
						if(!(tuiOrderArr[i].outterRefStatus >= 0)) {
							tuiOrderArr.splice(i, 1)
							i--;
						}
					}
                }
                //2.1 对退款单子进行分组，待退款的排在前面，按照申请时间的倒叙排列；已退款的排在后面，按照退款时间的倒叙排序。
                let waitingList = [];
                let oningList=[];
                for(let i = 0; i < tuiOrderArr.length; i++) {
                    if(tuiOrderArr[i].outterRefStatus==0){
                        waitingList.push(JSON.parse(JSON.stringify(tuiOrderArr[i])))
                    }else{
                        oningList.push(JSON.parse(JSON.stringify(tuiOrderArr[i])))
                    }
                }
                waitingList.sort(function(objA, objB){
                        return new Date(objB.appDate) - new Date(objA.appDate);
                });	
                oningList.sort(function(objA, objB){
                        return new Date(objB.outterRefDate) - new Date(objA.outterRefDate);
                });	    
                tuiOrderArr = undefined;
                tuiOrderArr = waitingList.concat(oningList); 
				//3、对退款单里面的RefundChildOrders具体退款明细排序，按照OrderType从小到大排序，如果OrderType一样，使用AppDate顺序排序。
				for(let i = 0; i < tuiOrderArr.length; i++) {
					if(!!tuiOrderArr[i].refundChildOrders) {
						tuiOrderArr[i].refundChildOrders.sort(function(a, b) {
							if(a.orderType == b.orderType) {
								return new Date(a.appDate) - new Date(b.appDate)
							} else {
								return a.orderType - b.orderType
							}
						})
						//4、为了表格的显示，要对退款明细列表 做 数据组织。添加UE显示需要的字段。
						let ordertypeStart = 0;
						let ordertypeEnd = 4;
						//如果排序后的列表，OrderType从小到大 有跳跃的现象，说明缺乏某种类型，手动补齐。
						for(let j = 0; j < tuiOrderArr[i].refundChildOrders.length; j++) {
                            let childOrderType = tuiOrderArr[i].refundChildOrders[j].orderType;
							//发现有type超出最大值区间，直接删掉
							if(childOrderType > ordertypeEnd) {
								tuiOrderArr[i].refundChildOrders.splice(j, 1)
								j--; //从删除的位置开始继续 遍历
							}
							//如果满足顺序递增条件，继续遍历
							else if(j == 0 || (j > 0 && ordertypeStart <= childOrderType && childOrderType <= (ordertypeStart + 1))) {
								//已经在取值区间最大，就把ordertypeStart赋值为最大值
								if(childOrderType == (ordertypeStart + 1)) {
									ordertypeStart += 1;
								}
								//添加UI需要的数据
                                tuiOrderArr[i].refundChildOrders[j].name = this.getNameForOrdertype(childOrderType, ordertypeEnd
                                    ,tuiOrderArr[i].refundChildOrders[j].payOrderNo != tuiOrderArr[i].orderNo);
								tuiOrderArr[i].refundChildOrders[j].status = "已审核";

								continue;
							}
							//不满足顺序递增条件，手动插入一条数据，继续遍历
							else {
								let uiTableItem = {
									orderType: ordertypeStart + 1,
									name: this.getNameForOrdertype(ordertypeStart + 1, ordertypeEnd),
									status: "不涉及",
								}
								//在当前位置插入 splice(2,0,"William")
								tuiOrderArr[i].refundChildOrders.splice(j, 0, uiTableItem)
								ordertypeStart += 1;//赋值加1
							}
						}

						//如果数据只有 部分OrderType，后面的手动补齐
						let size = tuiOrderArr[i].refundChildOrders.length;
						let maxOrderType = 0
						if(size > 0) {
							maxOrderType = tuiOrderArr[i].refundChildOrders[size - 1].orderType;
						}
						if(maxOrderType < ordertypeEnd) {
							for(let k = maxOrderType + 1; k < ordertypeEnd + 1; k++) {
								let uiTableItem = {
									orderType: k,
									name: this.getNameForOrdertype(k, ordertypeEnd),
									status: "不涉及",
								};
								//在当前位置插入 splice(2,0,"William")
								tuiOrderArr[i].refundChildOrders.push(uiTableItem);
							}
						}

						let uiTableItem = {
							"orderType": ordertypeEnd + 1,
							"name": this.getNameForOrdertype(ordertypeEnd + 1, ordertypeEnd),
							"status": "",
							"partialPayAmount": tuiOrderArr[i].partialPayAmount, //消费款
							"refundFee": tuiOrderArr[i].partialRefundFee, //扣款
							"partialRefAmount": tuiOrderArr[i].partialRefundAmount, //退款
						}
						//手动加入 总计 一列
						tuiOrderArr[i].refundChildOrders.push(uiTableItem)
						//手动加入 头部插入 第一列
						uiTableItem = {
							"orderType": -1,
							"name": "",
							"status": "",
							"partialPayAmount": "消费金额", //消费款
							"refundFee": "退票扣减", //扣款
							"partialRefAmount": "实退金额", //退款
						}
						tuiOrderArr[i].refundChildOrders.unshift(uiTableItem);
					}
					////退票人列表
					let array = tuiOrderArr[i].psgNames.split(",") 
					// let array = JSON.parse(JSON.stringify(tuiOrderArr[i].psgNames)) 
//					console.log("psgNameList.array=" + array);
					tuiOrderArr[i].psgNameList = array || [];
					// tuiOrderArr[i].psgNames = ""
					// array.forEach(element => {
					// 	tuiOrderArr[i].psgNames += element+"，"						
					// });
					// tuiOrderArr[i].psgNames = tuiOrderArr[i].psgNames.substring(0,tuiOrderArr[i].psgNames.length-1)
					//添加航班列表信息
					let airLineIDs = tuiOrderArr[i].airLineIDs;
					if(!!airLineIDs && !!this.airLines && !!this.airLines.length > 0) {
						let airLineShortInfos = [];
						for(let k = 0; k < this.airLines.length; k++) {
							//找到指定航班信息，加到列表中
							if(airLineIDs.indexOf(this.airLines[k].airLineID) != -1) {
								airLineShortInfos.push(JSON.parse(JSON.stringify(this.airLines[k])))
							}
						}
//						console.log("airLineShortInfos.size=" + airLineShortInfos.length);
						tuiOrderArr[i].airLineShortInfos = airLineShortInfos;
					}
					//默认弹框显示字段
					tuiOrderArr[i].showTips =false;
				}
//				let hh =  JSON.parse(JSON.stringify(tuiOrderArr[0]));
//				hh.refOrderNo = "RefOrderNoRefOrderNoRefOrderNo";
//				tuiOrderArr.push(hh);
				
				return tuiOrderArr;
			},
			sinosunPhone: function() {
				return this.orderBase.retailerPhone; //
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
			 * 通过OrderType获取明细的名字
			 */
			getNameForOrdertype(orderType, endType, isGai) {
				let result = ""
				if(orderType == endType + 1) {
					result = "总计";
				} else {
					//后面的改签费等会有多个，然后名字不同，增加一个改签费1等等。//TODO
					switch(parseInt(orderType)) {
						case 0:
							result = "机票";
							break;
						case 1:
							result = "改签费";
							break;
						case 2:
							result = isGai ? "出行保险(改签单)":"出行保险";
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
						return (Number(Math.abs(amount))!=0 ?"-￥":"￥") + Number(Math.abs(amount) || 0).toFixed(2)
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
				_this.closeDialog(item);
				_this.$emit('startRefMoney', item);
			},
			/**
			 * 
			 * 等待退款=0，退款失败 =1，退款成功= 2
			 */
			getFlightTuiOrderStatusUi(src) {
				if(src == 2) {
					return "已退款"
				} else if(src == 1) {
					return "退款失败"
				} else if(src == 0) {
					return "待退款"
				} else {
					return "未知状态"
				}
			},
			showDialog(item) {
				this.isNeedStartRef(item) ? item.showTips = true : item.showTips = false	
				//需要强制刷新
				this.$forceUpdate();
			},
			closeDialog(item) {
				this.isNeedStartRef(item) ? item.showTips = false : item.showTips = false	
				//需要强制刷新
				this.$forceUpdate();
			},			
			/**
			 * 是否显示 发起退款 按钮 
			 */
			isNeedStartRef(item) {
				return item.outterRefStatus == 1 || item.outterRefStatus == 0 ;
			},
			getDateDayStr(date){
				return travelfun.getDateDays(date);
			},
			getDialogHeight(child){
				let result = 105;
				let lineH = 30;
				if(child.status=='不涉及'){
					result += 0
				}else if(child.orderType == 0 || child.orderType == 1|| child.orderType == 2){
					result += lineH * 6
				}else if(child.orderType == 3){
					result += lineH * 4
				}else if(child.orderType == 4){
					result += lineH * 3
				}else{
					
				}
//				console.log('getDialogHeightFilght='+result);
				return result+ 'px';
			},				
		},
	}
</script>
<style lang="less">
	.flight_return_collapse {
		margin: 20px 0;
		background: white;
		padding: 20px;
		.status {
			padding: 15px 10px 5px 0;
			background: white;
			color: #7F7F7F;
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
						padding: 0 20px;
						.passengers {
							margin-bottom: 10px;
							color: #7F7F7F;
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
							flex: 14%;
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
								color: #F83939;
							}
						}
						div {
							flex: 14%;
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
							flex: 14%;
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
							flex: 14%;
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
					.RefundAmoun {
						font-weight: bold;
						text-align: center;
					}
					.RefundAmoun2 {
						font-weight: bold;
						color: #F83939;
						font-size: 20px;
						text-align: center;
						margin: 20px 0;
					}
				}
			}
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
		.hidebg {
			position: relative;
			.editBtn {
				margin: 0px auto;
				line-height: 32px;
				height: 32px;
				width: 120px;
				background: #478aee;
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
				width: 120px;
				background: #C2C2C2;
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
				height: 260px;
				width: 480px;
				padding: 20px 20px 0 20px;
				box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
				background: #fff;
				z-index: 1;
				border-radius: 5px;
				overflow: auto;
				.boxtitle {
					text-align: center;
					font-size: 18px;
					font-weight: bold;
				}
				.boxContent {
					margin: 5px 0;
					font-size: 14px;
				}
				.boxFotter {
					font-size: 16px;
					color: #333333;
					display: flex;
					justify-content: space-around;
					border-top: 1px solid #ebebeb;
					margin-top: 20px;
					span {
						padding: 5px 0px;
						background: #ebebeb;
						border: 1px solid #ebebeb;
						/* border-radius: 10px; */
						margin: 10px;
						width: 120px;
						text-align: center;
					}
					span:nth-child(2) {
						background: #478aee;
						color: #FFFFFF;
					}
				}
			}
			.hidebox2 {
				display: none;
				position: absolute;
			    right: -120px;
				height: 270px;
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
					margin-top: 5px;
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