<template>
	<div class="orderItemTrain">
		<!--退改签标记-->
		<div class="tuigaiDiv showButtonWrap">
			<div class="img" />
			<span class="explain cursorp" @click="showDialogTui=!showDialogTui">取票、退票、改签说明</span>
			<div class="dialogShow" v-show="showDialogTui">
				<div class="lineContent" v-html="getFormatRemark(popDes)"></div>
			</div>		
		</div>				
		<!--订单信息模块-->
		<OrderBaseDetail :orderDetail="orderDetail" orderType="Train" @refreshPage="getTrainOrderDetail"/>
    	<trainTuiCard v-bind:tuiList="refundOrderInfoList || []" @startRefMoney="startRefMoney" v-show="!!refundOrderInfoList && refundOrderInfoList.length > 0" />		
		<!-- 车票信息 -->
		<div v-for="tainOrderItem in orderAllTickets" :key="tainOrderItem.orderNo||tainOrderItem.newOrderNo" class="trainItemSpan">
            <div class="trainInfoAll">
                <!--车次信息-->
                <div class="aireLineinfo">
                    <div class="leftDiv">
                        <div class="aireLineName">
                            <span>{{!!tainOrderItem.orderInfo.startTimeT ? tainOrderItem.orderInfo.startTimeT.substring(0,10) :""}}</span>
                        </div>
                        <div class="aireLineStation">
                            <div class="stations">{{tainOrderItem.orderInfo.startCity}}——{{tainOrderItem.orderInfo.endCity}}</div>
                            <div v-if="!!tainOrderItem.orderPsgs && tainOrderItem.orderPsgs.length > 0">
                                <span>{{tainOrderItem.orderPsgs[0].seatType}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="rightDiv">
                        <div class="startPort">
                            <div>{{getDisplayStartTime(tainOrderItem.orderInfo.startTimeT)}}</div>
                            <div class="line1">{{getDisplayTime(tainOrderItem.orderInfo.startTimeT)}}</div>
                            <div>{{tainOrderItem.orderInfo.startStation}}</div>
                        </div>
                        <div class="airelineTime">
                            <div class="lineF">
                                <div class="lineCenter">{{tainOrderItem.orderInfo.trainNo}}</div>
                                <div class="linePoint"><span>时刻表</span></div>
                                <div class="lineCenter">{{getFormatRuntime(tainOrderItem.orderInfo.runTime)}}</div>
                            </div>
                            <!--<div class="lineS">
                                <img src="~assets//icon_flight.png" />
                            </div>-->
                        </div>
                        <div class="startPort">
                            <div>{{getDisplayEndTime(tainOrderItem.orderInfo.endTimeT)}}</div>
                            <div class="line1">{{getDisplayTime(tainOrderItem.orderInfo.endTimeT)}}</div>
                            <div>{{tainOrderItem.orderInfo.endStation}}</div>
                        </div>
                    </div>
                </div>
                <div class="aireLineinfoMore" v-if="tainOrderItem.orderInfo.ticketNo || tainOrderItem.orderInfo.ticketGate">
                    <div class="span1">取票号：{{tainOrderItem.orderInfo.ticketNo||"---"}}</div>
                    <div>检票口：{{tainOrderItem.orderInfo.ticketGate||"---"}} </div>
                </div>
                <div class="iconBack" v-if="tainOrderItem.orderInfo.isGaiOrder">
                    <div class="iconCss"></div>
                </div>    
            </div>
            <!--乘客信息-->
            <TrainPassenger v-for="item in tainOrderItem.orderPsgs" :key="item.psgId" v-bind:passenger="item" 
                v-bind:ticketInfo="tainOrderItem.orderInfo" @refreshPage="getTrainOrderDetail"/>
		</div>
	    <!--出行保险-->
	    <trainInsuranceCard v-bind:insuranceList="insProductList" :orderBase="orderDetail.orderInfo"></trainInsuranceCard>				
		<!--报销信息,火车票只要支付成功，就会显示这块信息-->
		<div class="baoxiaoDiv">
			<div class="titleDiv">报销凭证</div>			
			<div class="baseInfo" v-if="!!orderDetail.invoiceDetail && !!orderDetail.invoiceDetail.buyerName">
				<div class="topImgWrap">
					<img src="~assets//baoxiao_topimg.png"/>
				</div>
				<InfoLabel style="margin-bottom: 10px;" infoName="付款方" :infoValue="orderDetail.invoiceDetail.buyerName + (!!orderDetail.invoiceDetail.invoiceNum ?('（'+orderDetail.invoiceDetail.invoiceNum+ '）'):'')" classForName="infoLabel5" classForValue="infoLabel7">
				</InfoLabel>
				<InfoLabel style="margin-bottom: 20px;" infoName="收款方" :infoValue="orderDetail.invoiceDetail.sellerName||'无' " classForName="infoLabel5" classForValue="infoLabel7">
				</InfoLabel>				
				<InfoLabel style="margin-bottom: 10px;" infoName="发票内容" :infoValue="orderDetail.invoiceContent" classForName="infoLabel5" classForValue="infoLabel7">
				</InfoLabel>
				<div style="display: flex;justify-content: space-between;">
					<InfoLabel style="margin-bottom: 10px;" infoName="发票金额" :infoValue="'￥'+ (orderDetail.invoiceDetail.taxAmount|| 0)" classForName="infoLabel5" classForValue="infoLabel4">
					</InfoLabel>
                    <viewInvoicePop v-if="!!orderDetail.invoiceDetail.invoicePdfUrl" :inputData="viewInvoiceData"></viewInvoicePop>
                    <div v-else class="wuliuInfoImg2"  >
                        查看PDF
                    </div>	                    
				</div>
			</div>
			<div v-else>用户未申请开具报销凭证</div>
		</div>				
		<!--底部标签-->
		<div class="bottomDiv">
			<InfoLabel :infoName="'本产品由'+orderDetail.orderInfo.supplierShortName+'提供服务，联系电话'" :infoValue="orderDetail.orderInfo.supplierPhone" classForName="infoLabel31" classForValue="infoLabel7">
			</InfoLabel>
		</div>
	</div>
</template>

<script>
    const viewInvoicePop = () => import("biscomponents/invoice/previewpopup.vue"); 
    const InfoLabel = () => import("biscomponents/infolabel/msglabel.vue");
    const OrderBaseDetail = () => import("./commoninfo.vue");
    const TrainPassenger = () => import("./trainpassenger.vue");
    const trainTuiCard = () => import("./trainrefundcard.vue");
    const trainInsuranceCard = () => import("./traininscard.vue");    
  
	import  * as travelfun from "bislibs/traveloperationfun.js";  
	import utils from "bislibs/utils";
    import tmHandler from 'bislibs/requesthandler/traveloperationhandler.js';       	
	export default {
		components: {
			trainTuiCard,
			trainInsuranceCard,
			InfoLabel,
			TrainPassenger,
            OrderBaseDetail,
            viewInvoicePop,
		},
		props: {
			orderNo:{
				type:String,
				required: true,
			}			
		},
		computed: {
			popDes:function(){
				return utils.getTrainPolicy();
			},     
			//所有的退票单，需要从乘客列表里面筛选出来
			refundOrderInfoList:function(){
				let result = [];
				//先把所有的退单都找到，合并成一个。
				if(!!this.orderDetail.orderPsgs && this.orderDetail.orderPsgs.length > 0){
					for(let i=0;i<this.orderDetail.orderPsgs.length;i++){
						if(!!this.orderDetail.orderPsgs[i].refundOrderInfoList && this.orderDetail.orderPsgs[i].refundOrderInfoList.length > 0){
							for(let j=0;j<this.orderDetail.orderPsgs[i].refundOrderInfoList.length;j++){
								//只有退票单状态为3，表示已退票退款,加入到数组中								
								if(this.orderDetail.orderPsgs[i].refundOrderInfoList[j] && this.orderDetail.orderPsgs[i].refundOrderInfoList[j].orderStatus == 3){
                                    var tuiOrder = JSON.parse(JSON.stringify(this.orderDetail.orderPsgs[i].refundOrderInfoList[j]));
                                    if(tuiOrder.refundType == "HIGH_TO_LOW" && this.orderDetail.orderPsgs[i].changeOrderInfoList){
                                        //改签的高改低 差额退款需要获取 改签单的数据
                                        for(var k=0;k<this.orderDetail.orderPsgs[i].changeOrderInfoList.length > 0; k++){
                                            if(!!tuiOrder.newOrderNo && this.orderDetail.orderPsgs[i].changeOrderInfoList[k].newOrderNo == tuiOrder.newOrderNo){
                                                tuiOrder.orderInfo = JSON.parse(JSON.stringify(this.orderDetail.orderPsgs[i].changeOrderInfoList[k])) 
                                                k = this.orderDetail.orderPsgs[i].changeOrderInfoList.length                             
                                            }
                                        }
                                        //供应商不能更换，一个单子都是一样的
                                        tuiOrder.orderInfo.providerPhone = this.orderDetail.orderInfo.supplierPhone;
                                        tuiOrder.orderInfo.providerShortName = this.orderDetail.orderInfo.supplierShortName;   
                                        tuiOrder.orderInfo.retailerPhone = this.orderDetail.orderInfo.retailerPhone;
										tuiOrder.orderInfo.retailerShortName = this.orderDetail.orderInfo.retailerShortName; 
									}else if(tuiOrder.refundType == "NORMAL" && !!tuiOrder.newOrderNo && this.orderDetail.orderPsgs[i].changeOrderInfoList){	 
										//改签票退票，TuiOrderType=1并且NewOrderNo不为空就是改签票，车次信息需要获取对应的改签单
                                        for(var k=0;k<this.orderDetail.orderPsgs[i].changeOrderInfoList.length > 0; k++){
                                            if(!!tuiOrder.newOrderNo && this.orderDetail.orderPsgs[i].changeOrderInfoList[k].newOrderNo == tuiOrder.newOrderNo){
                                                tuiOrder.orderInfo = JSON.parse(JSON.stringify(this.orderDetail.orderPsgs[i].changeOrderInfoList[k])) 
                                                k = this.orderDetail.orderPsgs[i].changeOrderInfoList.length                             
                                            }
                                        }
                                        //供应商不能更换，一个单子都是一样的
                                        tuiOrder.orderInfo.providerPhone = this.orderDetail.orderInfo.supplierPhone;
                                        tuiOrder.orderInfo.providerShortName = this.orderDetail.orderInfo.supplierShortName;   
                                        tuiOrder.orderInfo.retailerPhone = this.orderDetail.orderInfo.retailerPhone;
										tuiOrder.orderInfo.retailerShortName = this.orderDetail.orderInfo.retailerShortName; 
                                    }else{
                                        tuiOrder.orderInfo = this.orderDetail.orderInfo
										//供应商不能更换，一个单子都是一样的
                                        tuiOrder.orderInfo.providerPhone = this.orderDetail.orderInfo.supplierPhone;
                                        tuiOrder.orderInfo.providerShortName = this.orderDetail.orderInfo.supplierShortName; 
									}
									
									if(!tuiOrder.refPsgName){
										//有时候，退票单没有返回用户数据，需要手动赋值
										tuiOrder.refPsgName = this.orderDetail.orderPsgs[i].psgName
									}
									result.push(tuiOrder)
								}
							}
						}
					}
				}
				if(!!result && result.length > 0){
					//去掉重复的退单，并按照待退款、已退款和时间排序
					result = travelfun.uniqArray(result,function(obj1, obj2){
						return obj1.refundNo == obj2.refundNo;
					})
					result.sort(function(a, b){
						//优先按照退款时间排序，退一步 按照申请 时间 排序
						if(!!a.refDate && !!b.refDate){
							return new Date(a.refDate) - new Date(b.refDate);
						}else{
							return new Date(a.opTime) - new Date(b.opTime);
						}
					})
				}
				console.log("refundOrderInfoList.length="+result.length);
				return result;
			},
			//所有的保险单，需要从乘客列表里面筛选出来
			insProductList:function(){
				let result = [];
				//先把所有的退单都找到，合并成一个。
				if(!!this.orderDetail.orderPsgs && this.orderDetail.orderPsgs.length > 0){
					for(let i=0;i<this.orderDetail.orderPsgs.length;i++){
						if(!!this.orderDetail.orderPsgs[i].insuranceList && this.orderDetail.orderPsgs[i].insuranceList.length > 0){
							for(let j=0;j<this.orderDetail.orderPsgs[i].insuranceList.length;j++){
								let insurance =  JSON.parse(JSON.stringify(this.orderDetail.orderPsgs[i].insuranceList[j]));
								//加上保险人的信息，保险里面没有，从外面乘客列表获取
								insurance.passenger = JSON.parse(JSON.stringify(this.orderDetail.orderPsgs[i]));
								insurance.passenger.insuranceList = null;
								insurance.passenger.refundOrderInfoList = null;
								//存储起来
								result.push(insurance)
							}
						}
					}
				}
//				console.log("insProductList.length="+result.length);
				return result;
            },
			//所有的车票，包括改签票
			orderAllTickets:function(){
                let result = [];
				//将原单的票数据拷贝一份
				let sourceTicket ={};
				sourceTicket.orderInfo = JSON.parse(JSON.stringify(this.orderDetail.orderInfo));
				sourceTicket.orderPsgs = JSON.parse(JSON.stringify(this.orderDetail.orderPsgs));
				//因为原单的数据结构是批量模型，一个车次挂载多个用户，所以票的状态都挂载到用户身上。
				//改签的单子没有批量的，所以都是一个车票一个用户，是个标准模型，状态直接使用车票的数据changeOrderStatus
				for(let i=0;i<sourceTicket.orderPsgs.length;i++){
					let element = sourceTicket.orderPsgs[i];
					//原单的用户的ticketStatus,等价于改签单子的票的状态是changeOrderStatus
					element.ticketStatus = sourceTicket.orderInfo.orderStatus
					// debugger
					//原单的startDate+startTime=改签单的startTime，为了保持统一，使用改签单的格式
					sourceTicket.orderInfo.startTimeT = sourceTicket.orderInfo.startDate + " " + sourceTicket.orderInfo.startTime
					sourceTicket.orderInfo.endTimeT = sourceTicket.orderInfo.endDate + " " + sourceTicket.orderInfo.endTime	
					//companyName需要赋值一下					
					sourceTicket.orderInfo.companyName = sourceTicket.orderInfo.founderInfo.companyName
					//providerPhone providerShortName运营都使用supplier
					sourceTicket.orderInfo.providerPhone = sourceTicket.orderInfo.supplierPhone
					sourceTicket.orderInfo.providerShortName = sourceTicket.orderInfo.supplierShortName
					//删除不必要的数据，改签列表和退票列表，数据量太大
					delete element.changeOrderInfoList
					// delete element.refundOrderInfoList
				}
                //从改签单里面取出 非改签失败的单子				
                if(!!this.orderDetail.orderPsgs && this.orderDetail.orderPsgs.length > 0){
					for(let i=0;i<this.orderDetail.orderPsgs.length;i++){
                        let changeOrderList = this.orderDetail.orderPsgs[i].changeOrderInfoList;
                        if(!!changeOrderList && changeOrderList.length > 0){
                            for(let j=0;j<changeOrderList.length;j++){
                                //只要不是改签失败，永远显示改签单
                                if(!utils.isTrainTicketCHANGE_FAIL(changeOrderList[j].changeOrderStatus)) {
                                         //改签单的格式参考原订单，分为两部分，OrderInfo和OrderPsgs
                                        let gaiOrder ={};
                                        let gaiOrderInfo = JSON.parse(JSON.stringify(changeOrderList[j]));
                                        //标记位改签单
                                        gaiOrderInfo.isGaiOrder = true
                                        gaiOrderInfo.companyName = this.orderDetail.orderInfo.companyName;
                                        //供应商不能更换，一个单子都是一样的
                                        gaiOrderInfo.providerPhone = this.orderDetail.orderInfo.supplierPhone;
                                        gaiOrderInfo.providerShortName = this.orderDetail.orderInfo.supplierShortName;
										gaiOrderInfo.companyName = this.orderDetail.orderInfo.founderInfo.companyName
										//改签单要赋值一下，保持UI调用的统一
										gaiOrderInfo.startTimeT = gaiOrderInfo.startTime
										gaiOrderInfo.endTimeT = gaiOrderInfo.endTime
                                        //订单基本信息赋值
                                        gaiOrder.orderInfo = gaiOrderInfo;
                                        //改签单的Passengers为空数组，需要从原来的车次里面把人的信息拿过来
                                        let gaiPsg = JSON.parse(JSON.stringify(this.orderDetail.orderPsgs[i]));
										//车票的状态 挂载到 乘客身上。保证模型统一，车票的一些变化的数据，都挂载到乘客身上，比如状态，座位等
										gaiPsg.ticketStatus = gaiOrderInfo.changeOrderStatus;
                                        gaiPsg.seatType = gaiOrderInfo.seatType;
 									    gaiPsg.seatTypeName = gaiOrderInfo.seatTypeName;
										gaiPsg.seatNo = gaiOrderInfo.seatNo;
										//改签成功后，需要将原单的状态改为“已改签”和“改签中”
                                        if(utils.isTrainTicketCHANGE_OK(gaiPsg.ticketStatus)){
                                            sourceTicket.orderPsgs[i].ticketStatus="HAS_CHANGE_SUCCESS";
										}
										if(utils.isTrainTicketCHANGE_PROCESSING(gaiPsg.ticketStatus)){
											sourceTicket.orderPsgs[i].ticketStatus="HAS_CHANGING";
										}
                                        //改签单默认不能再改签，需要去掉。
                                        delete gaiPsg.changeOrderInfoList
                                        //订单乘客信息赋值                              
                                        gaiOrder.orderPsgs = []
                                        gaiOrder.orderPsgs.push(gaiPsg);
                                        
                                        result.push(gaiOrder);
                                }
                            }
                        }
                    }
                }
				//原单的检票口和取票号需要从orderPsgs里面获取。改签单的相关信息在changeOrderList里面，不需要特殊处理。				
				if(sourceTicket.orderPsgs.length > 0){
					let noGaiPsg = sourceTicket.orderPsgs.find(item=>{
						return item.ticketStatus != "HAS_CHANGE_SUCCESS"  
					});
					//原单还有未改签成功的乘客，那就从这个乘客获取检票口
					if(!!noGaiPsg){
						sourceTicket.orderInfo.ticketNo = noGaiPsg.ticketNo
						sourceTicket.orderInfo.ticketGate = noGaiPsg.ticketGate
					}
				}
                //将原订单最后也加入到订单列表
                result.push(sourceTicket);

				return result;
            },    
			//发票模块数据
			viewInvoiceData:function(){				
				// const pdfBaseUrl = window.origin + "/travel/static/operation/thirdparty/pdfjs/web/viewer.html?file="
				// 	+ "https://down.szhtxx.cn/downPdf/440301999999980/2021/05/17/5445596176024576.pdf"
				let result = {
					// invoiceAddr:[pdfBaseUrl],
                    invoiceAddr:[this.orderDetail.invoiceDetail.invoicePdfUrl],
                    // invoiceAddr:"https://invtest.jss.com.cn/group1/M00/14/8F/wKjScF1L7fyAM96HAACJv3HxX9s747.pdf",
                    btnName:"查看PDF",
                    where:2,
                };				
//				console.log('invoiceImg='+result);
				return result;
			},                        
		},
		data() {
			return {
				orderDetail: {
					orderInfo:{},
					orderPsgs:[],
				},				
				passengerList: [{
					nameId: 100
				}],
				expressList: [{
					itemId: 1
				}],
				showDialogTui:false,//是否弹框显示退改规则
				showDialog: false, //弹框信息是否显示				
			}
		},
		created() {
			// console.log("火车票订单详情");
			this.getTrainOrderDetail();
			// 监听body点击事件,判断点击元素如果为className不为explain,则让弹框隐藏
			let that = this;
            document.body.addEventListener('click', function(e){
                if (e.target.className.indexOf('explain') < 0) {
                    that.showDialogTui = false;
				}
				if (e.target.className.indexOf('wuliuInfoImg') < 0) {
                    that.showDialog = false;
                }
			}, true)
		},
		 beforeDestroy () {
            let that = this;
            document.body.removeEventListener("click", function(e){
                if (e.target.className.indexOf('explain') < 0) {
                    that.showDialogTui = false;
				}
				 if (e.target.className.indexOf('wuliuInfoImg') < 0) {
                    that.showDialog = false;
                }
			}, true)
        },
		mounted() {},
		methods: {
            /**
             * 截取的时间段显示
             */
            getDisplayTime(sTime){
                return !!sTime ? sTime.substring(10,16) :""
            },
            /**
             * 转换到站日期
             */
			getDisplayEndTime(endTime){
				if(!!endTime){
					let date = Date.parse(endTime.substring(0,19));
					var a = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
					return new Date(date).format("MM月dd日") +"	" + a[new Date(date).getDay()]
				}
				return ''
			},	            
            /**
             * 转换发车日期
             */
			getDisplayStartTime(startTime){				
				if(!!startTime){
					let date = Date.parse(startTime.substring(0,19));
					var a = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
					return new Date(date).format("MM月dd日") +"	" + a[new Date(date).getDay()]
				}
				return ''
			},            
            /**
             * 转换运营时间
             */
            getFormatRuntime(RunTime){               
                if (!!RunTime) {
                    let minute = RunTime % 60;
                    minute = minute ? utils.addZero(RunTime % 60) : 0;
                    return parseInt(RunTime / 60)+"小时"+minute+"分钟";
                }
                return '';
            },
			/**
			 * 获取订单详情
			 */
			getTrainOrderDetail(){
				let _this = this;
				let data = {
					"orderNo":_this.orderNo,
                };
                tmHandler.getTrainOrderDetail(data)
                .then(function(res) {
					if(0 == res.resultCode) {
					_this.orderDetail = res.result;
					}}, function(error) {
						console.info(error);
					});				
			},	
			/**
			 * 发起退款
			 */
			startRefMoney(tuiOrder) {
				let _this = this;
				let data = {
					"orderNo":_this.orderNo,
					"refundNo":tuiOrder.refOrderNo,
					"refundAmount":(Number(tuiOrder.partialRefundAmount)||0),					
                };
                tmHandler.refund(data)
                .then(function(res) {
					if(0 == res.resultCode && res.result.refundState ==1) {
						utils.showToast('发起退款成功');
						//理论上发起退款之后，需要重新刷新当前页面的数据
						_this.getTrainOrderDetail();
					}else{
						utils.showToast(!!res.result ? res.result.message : '发起退款失败');
					}
				}, function(error) {
					console.info(error);
				});						
			},		
			/**
			 * 处理带有空格或者换行的格式问题
			 */ 	
			getFormatRemark(remark){                   
				if(remark){
					var result= remark.replaceAll("\n","<br>");
					result= result.replaceAll(" ","&nbsp");
					return result;
				}else{
					return remark;
				}
			},							
		},
	}
</script>
<style scoped lang="less">
	@import '../detail.less';
	.orderItemTrain{
		.tuigaiDiv {
			height: auto;
			display: flex;
			justify-content: flex-end;
			background: #F4F4F4;
			color: #478aee;
			font-size: 16px;
			align-items: flex-end;
			margin-bottom: 10px;
			span{
				margin-right: 20px;
			}		
			.img {
				height: 22px;
				width: 22px;
				background: url(~assets//icon_mail_alert.png) no-repeat;
			}			
		}		
		.showButtonWrap{
			position: relative;
			.dialogShow{
			    position: absolute;
			    right: 30px;
			    top: 30px;
			    height: 290px;
			    width: 480px;
			    padding: 20px;
			    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
			    background: #fff;
			    z-index: 1;
			    border-radius: 5px;
			    .lineContent{
					font-size: small;
				    color: #333333;
				    // text-align: center;
				    margin: 0 auto;
				    overflow-y: scroll;
				    height: 250px;
			    }
			}
        }	
        .trainItemSpan{
            margin-bottom: 20px;
            .trainInfoAll {
				background: #478aee;
                position: relative;  
                .aireLineinfoMore{
                    background: #478aee;
                    display: flex;
                    align-content: space-between;
                    margin: 0px 40px;          
                    color: white;
                    padding: 20px 0px;
                    border-top: 1px solid #ffffff;
                    .span1{
                        margin-right: 40px;
                    }          
                }
                .aireLineinfo {
                    background: #478aee;
                    display: flex;
                    align-content: space-between;
                    padding: 20px 40px;
                    .leftDiv {
                        flex: 3;
                        color: white;
                        .aireLineName {
                            display: flex;
                            align-content: flex-start;
                            margin-bottom: 40px;
                            align-items: baseline;
                            span{
                                font-size: 14px;
                            }
                        }
                        .aireLineStation {
                            display: flex;
                            justify-content: flex-start;
                            align-items: baseline;
                            span {
                                font-size: 16px;
                                align-self: center;
                                color: white;
                            }
                            .stations{
                                font-size: 28px;
                                margin-right: 135px;
                            }
                        }
                    }
                    .rightDiv {
                        flex: 2;
                        margin-top: 20px;
                        display: flex;
                        justify-content: flex-start;
                        color: white;
                        .airelineTime {
                            display: flex;
                            align-content: flex-start;
                            font-size: 14px;
                            align-items: center;
                            img {
                                height: 22px;
                                width: 22px;
                            }
                            .lineF{
                                margin: 0px 4px 0px 10px;
                                .lineCenter{
                                    text-align: center;
                                }
                                .linePoint{
                                    background: url(~assets//icon_train_arrorow.png) no-repeat;
                                    margin: 6px 0;
                                    width: 170px;
                                    text-align: center;
                                    vertical-align: middle;
                                    line-height: 13px;
                                    span{
                                        background: white;
                                        color: #478aee;
                                    }
                                }
                            }
                            .lineS{
                                margin-right: 10px;
                            }
                        }
                        .startPort{
                            font-size: 16px;
                            .line1{
                                font-size: 28px;
                                margin: 20px 0;
                            }
                        }
                    }
                }	                  
				.iconBack {
					position: absolute;
					background: transparent;
					top: 0;
					/*right: 0;*/
					.iconCss {
						height: 60px;
						width: 60px;
						right: 0px;
						top: 0px;
						background: url(~assets//gai.png) no-repeat;
						background-size: contain;
					}
				}                            
            }
        }

		.baoxiaoDiv {
			/*报销*/
			padding: 60px 40px;
			margin-top:20px;
			margin-bottom: 50px;
			background: white;
			.titleDiv {
				color: #478aee;
				font-size: 18px;
			}
			.baseInfo {
				padding-bottom: 30px;
				border-bottom: 1px dashed #7F7F7F;
				font-size: 16px;
				.topImgWrap{
					border-bottom: 1px dashed #EBEBEB;
					padding-bottom: 20px;
					margin-bottom: 20px;
					display: flex;
					justify-content: center;
					align-content: center;
					img{
						height: 60px;
					}
                }
                .wuliuInfoImg2 {
                    line-height: 32px;
                    height: 32px;
                    width: 160px;
                    background: #EBEBEB;
                    text-align: center;
                    border-radius: 5px;
                    // margin: 0 auto;
                    color: 333333;
                    align-self: center;
                }	                
				.viewBaoxiaoP {
					position: relative;
					.wuliuInfoImg {
						line-height: 32px;
						height: 32px;
						width: 160px;
						background: #478aee;
						text-align: center;
						border-radius: 5px;
						margin: 0 auto;
						color: white;
						align-self: center;
					}
					// .wuliuInfoImg2 {
					// 	line-height: 32px;
					// 	height: 32px;
					// 	width: 160px;
					// 	background: #EBEBEB;
					// 	text-align: center;
					// 	border-radius: 5px;
					// 	margin: 0 auto;
					// 	color: 333333;
					// 	align-self: center;
					// }								
					// .dialogShow {
					// 	position: absolute;
					// 	bottom: 55px;
					// 	right: 0;
					// 	width: 480px;
					// 	height: 290px;
					// 	padding: 30px 20px;
					// 	box-shadow: 0px 2px 10px rgba(0, 0, 0, .5);
					// 	background: #fff;
					// 	z-index: 1;
					// 	border-radius: 5px;
					// 	img{
					// 		height: 240px;
					// 	}
					// }
				}			
			}
		}
		.bottomDiv {
			font-size: 10px;
			display: flex;
			justify-content: center;
			margin: 50px 0px;
		}							
	}
</style>