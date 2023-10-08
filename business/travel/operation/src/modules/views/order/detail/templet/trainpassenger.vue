<template>
	<!--乘客信息-->
	<div class="passengerItemTrain">
		<div class="leftIcon">
			<img src="~assets//icon_customer_head.png" />
		</div>
		<div class="rightDiv">
			<div  :class="[passenger.ticketStatus=='HAS_CHANGE_SUCCESS'? 'tips-gray': '','firstLine']">
				<span class="spanF">{{passenger.psgName}}</span>
				<span class="spanS">{{passenger.seatNo||''}}</span>
                <span class="spanS">{{passenger.seatType||''}}</span>
				<InfoLabel class="spanT" :infoName="passenger.cardType" :infoValue="getCardNo(passenger.cardNo)" classForName="infoLabel5" classForValue="infoLabel2">
					<span class="spanT2" slot="middlePoint" >:</span>
				</InfoLabel>
				<InfoLabel class="spanT" infoName="联系电话" :infoValue="passenger.phone" classForName="infoLabel5" classForValue="infoLabel2">
					<span class="spanT2" slot="middlePoint" >:</span>
				</InfoLabel>
				<InfoLabel class="spanT" infoName="企业名称" :infoValue="cpyName" classForName="infoLabel5" classForValue="infoLabel2">
					<span class="spanT2" slot="middlePoint" >:</span>
				</InfoLabel>
			</div>
			<div class="secondLine">
                <!-- 按钮组、乘客状态 -->
                <div class="cust-btn-group">
                    <div v-if="ticketInfo.isGaiOrder">
                        <div class="tips-wait" v-if="passenger.ticketStatus=='CHANGING'">改签中</div>
                        <div class="tips-wait" v-else-if="passenger.ticketStatus=='SEAT_TAKING'">改签占座中</div>
                        <div class="tips-wait" v-else-if="passenger.ticketStatus=='SEAT_TAKEN_SUCCESS'">改签占座成功</div>
                        <template v-if="!tuiOrder">
                            <div class="tips-wait" v-if="passenger.ticketStatus=='CHANGE_SUCCESS'">改签成功</div>
                            <div class="tips-failed" v-else-if="passenger.ticketStatus=='CHANGE_FAILED'
                            ||passenger.ticketStatus=='CHANGE_CANCELLED'||passenger.ticketStatus=='SEAT_TAKEN_FAILED'">改签失败</div>
                        </template>
                        <template v-else>
                            <div class="psg-status" v-if="getTrainPsgStatusName(tuiOrder.orderStatus)">{{getTrainPsgStatusName(tuiOrder.orderStatus)}}</div>
                        </template>
                    </div>
                    <div v-else>
                        <div class="tips-wait" v-if="passenger.ticketStatus=='ALREADY_PAID'">正在出票，请稍候...</div>
                        <div class="tips-wait" v-else-if="passenger.ticketStatus=='UNPAID'">待支付</div>
                        <template v-if="!tuiOrder">
                            <div class="changeSuccess" v-if="passenger.ticketStatus=='HAS_CHANGE_SUCCESS'">已改签</div>
							<div class="tips-waiting" v-else-if="passenger.ticketStatus=='HAS_CHANGING'">改签中</div>
                            <div class="tips-failed" v-else-if="passenger.ticketStatus=='FAILED_OUT_TICKET'">出票失败</div>
                            <div class="tips-wait" v-else-if="passenger.ticketStatus=='ALREADY_OUT_TICKET'">出票成功</div>
                        </template>
                        <template v-else>
                            <div class="psg-status" v-if="getTrainPsgStatusName(tuiOrder.orderStatus)">{{getTrainPsgStatusName(tuiOrder.orderStatus)}}</div>
                        </template>
                    </div>                    
                    <!--<div class="btn" v-if="item.status=='ALREADY_PAID'">改签</div>-->
					<div>
						<!-- 退票UI -->
						<refundticketTrain v-if="showRefundticket(ticketInfo, passenger)" :ticket="ticketInfo" :passenger="passenger" 
							:tuiOrder="tuiOrder" @refreshPage="refreshOrderPage" /> 
					</div>
                </div>
                <div class="status-message ticket-failed-info" v-if="isTrainTicketOutTicketFail(passenger.ticketStatus)">
                    因铁路系统繁忙，出票失败；退款将在1-7个工作日内原路退回
                </div>
                <!-- 乘客状态提示文字 -->
                <template v-if="tuiOrder">
					<div class="showButtonWrap">
						<div class="status-message tui-success-info message" v-if="isTrainTicketRefundOK(tuiOrder.orderStatus)">
							退款{{calcPrice}} 将在1-7个工作日内原路退回
						</div>
						<div class="dialogShow">
							<div class="refundDetail" >
								<div class="title">退款明细</div>
								<ul>
									<li>
										<span>车票票款</span> <span>{{tuiOrder.seatPrice}}元</span>
									</li>
									<li v-if="tuiOrder.refPoundage!=null && tuiOrder.refPoundage!=undefined">
										<span>退票手续费</span> <span>{{tuiOrder.refPoundage}}元</span>
									</li>
									<li v-if="tuiOrder.refTicketAmount!=null && tuiOrder.refTicketAmount!=undefined">
										<span>应退票款</span> <span>{{tuiOrder.refTicketAmount}}元</span>
									</li>
									<li v-if="tuiOrder.refInsAmount!=null && tuiOrder.refInsAmount!=undefined">
										<span>应退出行保险</span> <span>{{tuiOrder.refInsAmount}}元</span>
									</li>
								</ul>
							</div>
						</div>					
					</div>
                    <div class="status-message tui-failed-info" v-if="isTrainTicketRefundFail(tuiOrder.orderStatus)">
                        因铁路系统繁忙，请持购票有效证件到火车站办理
                    </div>
                </template>				
			</div>
		</div>
	</div>
</template>

<script>
    import InfoLabel from 'biscomponents/infolabel/msglabel.vue';
    import utils from "bislibs/utils";
   	
	const refundticketTrain = () => import("biscomponents/orderdetail/refundticket/train.vue");   

	export default {
		components: {
			InfoLabel,
			refundticketTrain,
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
		},
		computed: {
			//公司名称
			cpyName:function(){			
				return this.ticketInfo.companyName;
			},
			// //供应商电话
			// providerPhone:function(){
			// 	return this.ticketInfo.providerPhone;
			// },
			// //供应商名字
			// providerName:function(){
			// 	return this.ticketInfo.providerShortName;
			// },				
			//当前退票单子
			tuiOrder:function(){
				if(this.passenger.ticketStatus=='HAS_CHANGE_SUCCESS'){
					//已改签的票，不显示退票的结果
					return null
				}
                if(!!this.passenger.refundOrderInfoList && this.passenger.refundOrderInfoList.length>0){
					//先找到这个订单对应的所有的退票单，然后排除改签导致的退款，然后排序找到最新的一个，显示出来。
                    let TuiOrderList2 = JSON.parse(JSON.stringify(this.passenger.refundOrderInfoList));
					for(let i=0;i<TuiOrderList2.length;i++){
                        //TuiOrderType判断退款单是否是改签产生的，1是正常退款，2、3是改签导致的
						if(!TuiOrderList2[i] ){
							TuiOrderList2.splice(i,1);
                            i--;
						}
                        if(!((TuiOrderList2[i].orderNo == this.ticketInfo.newOrderNo 
                            || TuiOrderList2[i].orderNo == this.ticketInfo.orderNo) && TuiOrderList2[i].refundType=="NORMAL")){
                            TuiOrderList2.splice(i,1);
                            i--;
						}
					}                    
				    //如果乘客的最新状态是退票的状态，才显示退票记录。
					TuiOrderList2.sort(function(a,b){                        
						return new Date(a.opTime) - new Date(b.opTime)
					})
					return TuiOrderList2[0];
				}
				return null;
			},		
            calcPrice:function () {
                let amount = (this.tuiOrder.refTicketAmount || 0) + (this.tuiOrder.refInsAmount || 0);
                return amount ? "（￥"+amount+"）":"";
            },					
		},
		data() {
			return {
			}
		},
		created() {},
		mounted() {},
		methods: {
			refreshOrderPage() {
				//退票操作完成，刷新订单数据
				this.$emit("refreshPage");
			},
            /**
             * 获取乘车人的状态名字
             * @param TuiOrder的状态码
             */
            getTrainPsgStatusName(status) {
                return utils.getTrainTicketStatusName(status);
            },	
            /**
             * 获取出行人的状态State
             * @param status 状态码
             * @returns {*}
             */
            isTrainTicketRefundOK(status){
                //非改签单，才显示disable的样式
                try{
                    return utils.isTrainTicketREFUND_OK(status);
                }catch(e){
                    return false;
                }
            },   
            isTrainTicketRefundFail(status){
                //非改签单，才显示disable的样式
                try{
                    return utils.isTrainTicketREFUND_FAIL(status);
                }catch(e){
                    return false;
                }
            },   	
            isTrainTicketOutTicketFail(ticketStatus){
                //非改签单，才显示disable的样式
                try{
					return ticketStatus=='FAILED_OUT_TICKET'||ticketStatus=='CHANGE_FAILED'
                            ||ticketStatus=='CHANGE_CANCELLED'||ticketStatus=='SEAT_TAKEN_FAILED'
                }catch(e){
                    return false;
                }
            },   					
			getCardNo(cardNo){
				return utils.getFormatCardNo(cardNo)
			},
			//是否显示退票按钮 
            showRefundticket(ticket, passenger) {   
                //是已出票 并且 乘客没有退票成功没有改签成功 才满足条件
				if(ticket.isGaiOrder){
					//改签只能改签一次，所以，改签票后续只有退票一个操作。判断逻辑就是改签成功且退票未成功。
					return utils.isTrainTicketCHANGE_OK(passenger.ticketStatus) && !(this.tuiOrder 
						&& this.isTrainTicketRefundOK(this.tuiOrder.orderStatus))
				}else{
					//非改签票的后续操作有2种，改签或退票。判断逻辑就是已出票并且未改签成功并且未退票成功。
					return utils.getRefundTicketTrainStatus(ticket.orderStatus) && !(this.tuiOrder 
						&& this.isTrainTicketRefundOK(this.tuiOrder.orderStatus)) && passenger.ticketStatus != "HAS_CHANGE_SUCCESS"
				}					
            },  
		},
	}
</script>
<style scoped lang="less">
	@import '~styles/variables.less';
	@import '~styles/mixins/mixins.less';		
	.passengerItemTrain {
		background: white;
		display: flex;
		align-content: flex-start;
		padding: 40px 40px;
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
				.spanF{
					margin-right: 80px;
					color: #333333;
				}
				.spanS{
					margin-right: 40px;
					color: #333333;
				}
				.spanT{
					margin-right: 40px;
				}
				.spanT2{
					margin-right: 10px;
				}				
			}
			.tips-gray{
				.spanF,.spanT,.spanS{
					color: #7F7F7F;
				}
			}
			.secondLine {
				margin-top: 40px;
				padding-bottom: 6px;
				border-bottom: 1px dashed #7F7F7F;
				color: #25CB67;
				.cust-btn-group{
					display: flex;
					justify-content: space-between;
				}
				span {
					font-size: 18px;
				}
				.message{
					color: #25CB67;
					margin: 10px 0;
				}	
				.tips-waiting{
					color: #FF6617;
				}
				.changeSuccess{
					color: #7F7F7F;
				}
				.showButtonWrap{
					position: relative;
					.dialogShow{
						display: none;
						position: absolute;
					    bottom: 20px;
					    left: 80px;
					    height: 240px;
					    width: 300px;
					    padding: 20px;
					    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
					    background: #fff;
					    z-index: 1;
					    border-radius: 5px;
					    overflow: auto;
					    .refundDetail{
					    	background: #fff;
					    	color: @fc-normal;
					    	.title{
					    		font-size: 16px;
					    		margin: 0 auto 20px;
					    		font-weight: bold;
					    		text-align: center;
					    	}
			
					    	ul{
					    		li{
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
				.showButtonWrap:hover .dialogShow{
					display: block;
				}															
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
					div{
						flex: 14%;
						display: flex;
					}
				}
				.line2 {
					color: #333333;
					display: flex;
					justify-content: space-between;
					margin-bottom: 20px;
					.firstChild{
						color: #7F7F7F
					}
					div{
						flex: 20%;
						display: flex;
					}					
				}
				.line3 {
					color: #333333;
					display: flex;
					justify-content: space-between;
					margin-bottom: 20px;
					.firstChild{
						color: #7F7F7F
					}
					div{
						flex: 20%;
						display: flex;
					}						
				}
				.line4 {
					color: #333333;
					display: flex;
					justify-content: space-between;
					.firstChild{
						color: #7F7F7F
					}
					div{
						flex: 20%;
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
				}
			}
		}
	}

</style>