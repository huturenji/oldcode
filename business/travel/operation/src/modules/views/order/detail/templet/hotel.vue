<template>
	<div class="orderItemHotel">
		<!--取消规则-->
		<div class="tuigaiDiv showButtonWrap">
			<div class="img" />
			<span class="explain cursorp" @click="showDialogTui=!showDialogTui">取消规则</span>
			<div class="dialogShow" v-show="showDialogTui">
				<div class="lineContent">{{popDes}}</div>
			</div>		
		</div>				
		<!--订单信息模块-->
		<OrderBaseDetail :orderDetail="orderDetail" orderType="Hotel" @refreshPage="getHotelOrderDetail"/>
		<!--退款信息-->
    	<hotelTuiCard v-bind:orderBase="orderDetail" v-bind:tuiList="tuiOrderList || []" @startRefMoney="startRefMoney" v-show="!!tuiOrderList && tuiOrderList.length > 0" />		
		<!--酒店信息-->
		<div class="hotelInfo">
			<div class="line1">
				<div>{{orderDetail.hotelName}}</div>
				<!-- 退订UI -->
				<refundticketHotel v-if="showRefundticket" :ticket="orderDetail" @refreshPage="getHotelOrderDetail" /> 				
				</div>
			<div class="line2">{{orderDetail.address}}</div>
			<div class="line3">
				<span>{{orderDetail.roomTypeName}}</span>
				<span>共{{orderDetail.roomCount}}间</span>
			</div>
			<div class="line4">
				<div class="left">
					<div>入住</div>
					<div class="date">{{orderDetail.arriveDate}}</div>
				</div>
				<div class="middle">
					<span>共{{orderDetail.days}}晚</span>
				</div>
				<div class="left">
					<div>离店</div>
					<div class="date">{{orderDetail.departDate}}</div>
				</div>
			</div>
			<div class="line5">{{orderDetail.breakfastType + "  "+ (orderDetail.amenities || "")}}</div>
			<div class="line6" v-if="!!priceList && priceList.length>0">
				<div class="tableLine">
					<div class="tableLineType"><span>20181101</span></div>
					<div class="tableLineValue">每日房价</div>
				</div>
				<div v-for="(item,index) in priceList"  :key="item.currentDate" :class="index==(priceList.length-1)?'lastChild':'tableLine'" >
					<div class="tableLineType">{{item.currentDate}}</div>
					<div class="tableLineValue">￥{{item.amount}}</div>
				</div>
			</div>
		</div>
		<div class="passenger" v-if="!!orderDetail.hotelPassengers">
			<div class="desc">入住人信息</div>
			<!--乘客信息-->
			<HotelPassenger v-for="(item, index) in orderDetail.hotelPassengers" :key="item.passengerId" v-bind:passenger="item" v-bind:ticketInfo="orderDetail" v-bind:index="index" />
		</div>
		<!--报销信息,我们开票，但是没开出来 的场景不显示 这块信息，-->
		<div class="baoxiaoDiv">
			<div class="titleDiv">
				<span>报销凭证</span>				
				<!-- <span class="downBtn" :class="{'downBtnNoAble':isDownloading}" v-if="showInvoiceDiv && orderDetail && orderDetail.invoicePdfs.length >0" 
					@click.stop="downloadAllPdf">下载全部</span> -->
			</div>
			<InfoLabel v-if="orderDetail.roomType == 0 || (orderDetail.roomType == 1 && orderDetail.invoiceMode!='BusinessTrip')" style="margin-bottom: 20px;" 
				infoName="如需报销凭证，请在离店时向酒店前台索取" :infoValue="!!orderDetail.hotelPhone?'（联系电话：'+orderDetail.hotelPhone+'）':''" classForName="infoLabel5" classForValue="infoLabel7">
			</InfoLabel>				
			<div  v-else-if="showInvoiceDiv">
				<div class="baseInfo" v-for="invoice in invoicePdfUrlList" :key="invoice">
					<div class="topImgWrap">
						<img src="~assets//baoxiao_topimg.png"/>
					</div>
					<InfoLabel style="margin-bottom: 10px;" infoName="付款方" :infoValue="orderDetail.purchaserName + '（'+orderDetail.taxNumber+ '）'" classForName="infoLabel5" classForValue="infoLabel7">
					</InfoLabel>
					<InfoLabel style="margin-bottom: 20px;" infoName="收款方" :infoValue="orderDetail.sellerName||'无' " classForName="infoLabel5" classForValue="infoLabel7">
					</InfoLabel>				
					<InfoLabel style="margin-bottom: 10px;" infoName="发票内容" :infoValue="orderDetail.invoiceContent" classForName="infoLabel5" classForValue="infoLabel7">
					</InfoLabel>
					<InfoLabel style="margin-bottom: 0px;" infoName="发票备注" :infoValue="orderDetail.invoiceRemarks||'无'" classForName="infoLabel5" classForValue="infoLabel7">
					</InfoLabel>
					<div style="display: flex;justify-content: space-between;">
						<InfoLabel style="margin-bottom: 10px;" infoName="发票金额" :infoValue="'￥'+ (invoice.itaxAmount || orderDetail.taxAmount|| 0)" classForName="infoLabel5" classForValue="infoLabel4">
						</InfoLabel>
						<viewInvoicePop :inputData="getViewInvoiceData(invoice.invoicePdfUrl)"></viewInvoicePop>                  
					</div>
				</div>
				<div class="showMore cursorp" v-if="orderDetail && orderDetail.invoicePdfs && orderDetail.invoicePdfs.length > 3" @click="showMoreClick">
					<span v-if="showMoreConfition">
						查看全部
						<img src="~assets//icon_lisr_up.png" />
					</span>
					<span v-else>
						查看全部
						<img
							src="~assets//icon_list_down.png"
						/>
					</span>
				</div>
			</div>
			<div v-else>用户未申请开具报销凭证</div>		
		</div>
		<!--底部标签-->
		<div class="bottomDiv">
			<InfoLabel :infoName="'本产品由'+orderDetail.supplierShortName+'提供服务，联系电话'" :infoValue="orderDetail.supplierPhone" classForName="infoLabel31" classForValue="infoLabel7">
			</InfoLabel>
		</div>
	</div>
</template>

<script>
    const viewInvoicePop = () => import("biscomponents/invoice/previewpopup.vue"); 
    const InfoLabel = () => import("biscomponents/infolabel/msglabel.vue");
    const OrderBaseDetail = () => import("./commoninfo.vue");
    const HotelPassenger = () => import("./hotelpassenger.vue");
    const hotelTuiCard = () => import("./hotelrefundcard.vue"); 
	const refundticketHotel = () => import("biscomponents/orderdetail/refundticket/hotel.vue");   

    import tmHandler from 'bislibs/requesthandler/traveloperationhandler.js';     
	import utils from "bislibs/utils";

	export default {
		components: {
			hotelTuiCard,
			InfoLabel,
			HotelPassenger,
            OrderBaseDetail,
            viewInvoicePop,
			refundticketHotel,
		},
		props: {
			orderNo: {
				type: String,
				required: true,
			}
		},
		computed: {
			priceList: function() {
				return this.orderDetail.hotelNightlyRates||[];
			},
			//酒店的退款单，只有一个，要退钱就是整个订单都退，不存在部分人单独退房的情况。
			//这里我们还是模拟成列表
			tuiOrderList:function(){
				let result = [];
				//是否有退款，有的话就加一条数据
				if(this.orderDetail.hasRefundOrder){
					result.push(this.orderDetail);
				}
//				console.log("tuiOrderList.length="+result.length);
				return result;
			},	
			popDes:function(){
				return (this.orderDetail.cancelDescription || "")
			},    
			//酒店是否已经申请开票
			showInvoiceDiv:function(){
            	//必须是预付类型、兆日开票并且已经开发票 PurchaserName不为空
				 return this.orderDetail.roomType == 1 && this.orderDetail.invoiceMode=='BusinessTrip' 
				 	&& this.orderDetail.invoiceFlag ==1;
			},    	
			//是否显示退票按钮 
            showRefundticket:function() {   
                //现付的 必须是 已确认且可以取消；预付的必须是已支付且可取消的
				return this.orderDetail && this.orderDetail.orderStatus!='WAIT_FOR_PAY' 
					&& (((utils.hotelOrderStatus[this.orderDetail.orderStatus] || {}).payCancel && this.orderDetail.cancelable )
					|| ((utils.hotelOrderStatus[this.orderDetail.orderStatus] || {}).isCancel));
            },  					
		},
		data() {
			return {
				orderDetail:{
					hotelPassengers:[],
				},				
				showDialog: false, //弹框信息是否显示
				showDialogTui:false,//是否弹框显示退改规则	
				isDownloading:false,//是否正在下载	
				invoicePdfUrlList:[],//	酒店发票数据列表
				showMoreConfition: false //是否显示全部条件	
			}
		},
		created() {
			// console.log("酒店订单详情");
			this.getHotelOrderDetail();
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
		mounted() {
		},
		watch:{
			orderDetail: {//监视orderDetail，给发票列表及时赋值
				handler(val, oldVal) {
					if(!!val){
						this.invoicePdfUrlList = this.getInvoicePdfUrlList()
					}
				},
				deep: true,
				immediate: true
			},
			showMoreConfition: {//监视showMoreConfition，动态修改发票列表的大小
				handler(val, oldVal) {
					this.invoicePdfUrlList = this.getInvoicePdfUrlList()
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			/**
			 * 获取UI上显示的发票的列表。
			 */
			getInvoicePdfUrlList(){
				//必须是预付类型、兆日开票并且已经开发票 invoiceDone。InvoiceAddressAndAmounts是原始数据，UI上最多显示3条，
				//查看更多可以显示全部。一条都没有显示置灰的按钮
				let invoicePdfUrlArr = [];
				if(this.orderDetail  && this.orderDetail.invoicePdfs && this.orderDetail.invoicePdfs.length > 0){
					let tempList = JSON.parse(JSON.stringify(this.orderDetail.invoicePdfs))
					let amountList = JSON.parse(JSON.stringify(this.orderDetail.taxAmounts||[]))
					if(!this.showMoreConfition || this.orderDetail.invoicePdfs.length < 4){
						tempList = tempList.slice(0,3)
					}
					for(let i=0;i<tempList.length;i++){
						invoicePdfUrlArr.push({invoicePdfUrl:tempList[i],itaxAmount:amountList[i] ? amountList[i] : 0})		
					}
				}
				//申请中，但是没有开票成功，构造一条假数据
				if(invoicePdfUrlArr.length == 0){
					invoicePdfUrlArr.push({invoicePdfUrl:"",itaxAmount: 0})	
				}
				return invoicePdfUrlArr;		
			},
			/**
			 * 展开或者收缩 更多pdf
			 */
			showMoreClick() {
				let that = this;
				that.showMoreConfition = !that.showMoreConfition;
			},			
			/**
			 * 获取订单详情
			 */
			getHotelOrderDetail() {
				let that = this;
				let data = {
					"orderNo": that.orderNo,
                };
                tmHandler.getHotelOrderDetail(data)
                .then(function(res) {
					if(0 == res.resultCode) {
						that.orderDetail = res.result;
					}
				}, function(error) {
					console.info(error);
				});
			},
			getViewInvoiceData(url){
				let result = {
                    invoiceAddr:!!url ? [url]: [],
                    // invoiceAddr:"https://invtest.jss.com.cn/group1/M00/14/8F/wKjScF1L7fyAM96HAACJv3HxX9s747.pdf",
                    btnName:"查看PDF",
					where:3,
					orderStatus:'已取消'== utils.getHotelOrderStatus(this.orderDetail.orderStatus)? 1: 0,
                };				
//				console.log('invoiceImg='+result);
				return result;				
			},
			downloadAllPdf(){
				let that = this;
				if(that.isDownloading){
					return;
				}
				let data = {
					orderNo: that.orderNo,
				};
				that.isDownloading = true;
                tmHandler.downloadAllInvoice(data)
                .then(function(res) {
					if(0 == res.resultCode && res.result.invoicePdfUrl) {						
						utils.downloadFile(res.result.invoicePdfUrl,"发票");
						that.isDownloading = false;
					}else{
						utils.showToast("下载文件失败");
						that.isDownloading = false;
					}
				}, function(error) {
					console.info(error);
					utils.showToast("下载文件失败");
					that.isDownloading = false;
				});				
				
			}
		},
	}
</script>
<style scoped lang="less">
	.orderItemHotel{
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
				    text-align: center;
				    margin: 0 auto;
				    overflow-y: scroll;
				    height: 250px;
			    }
			}
		}			
		.baoxiaoDiv {
			/*报销*/
			padding: 30px;
			margin-top:20px;
			margin-bottom: 50px;
			background: white;
			.titleDiv {
				color: #333333;
				font-size: 18px;
				margin-bottom: 20px;
				display: flex;
				justify-content: space-between;
				.downBtn{
					font-size: 14px;
					color: #478aee;
				}
				.downBtnNoAble{
					color: #7f7f7f;
				}
			}
			.baseInfo {
				padding-bottom: 30px;
				margin-bottom: 30px;
				border-bottom: 1px dashed #c2c2c2;
				font-size: 16px;
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
				.topImgWrap{
					border-bottom: 1px dashed #c2c2c2;
					padding-bottom: 20px;
					padding-top: 20px;
					margin-bottom: 20px;
					display: flex;
					justify-content: center;
					align-content: center;
					img{
						height: 60px;
					}
				}
			}
			.showMore{
				margin-top: 16px;
				height: 30px;
				line-height: 30px;
				text-align: center;
				span {
					color: #6782f5;
				}
				img {
					width: 16px;
					vertical-align: middle;
				}				
			}
            // .line2{
            //     color: #7F7F7F; 
            //     font-size: 12px;
            // }            
			// .viewBaoxiaoP {
			// 	position: relative;
			// 	.line2{
			// 		color: #7F7F7F; 
			// 		font-size: 12px;
			// 	}
			// 	.dialogShow {
			// 		position: absolute;
			// 		bottom: 55px;
			// 		right: 0;
			// 		width: 480px;
			// 		height: 290px;
			// 		padding: 30px 20px;
			// 		box-shadow: 0px 2px 10px rgba(0, 0, 0, .5);
			// 		background: #fff;
			// 		z-index: 1;
			// 		border-radius: 5px;
			// 		img{
			// 			height: 240px;
			// 		}
			// 	}
			// }			
		}
		
		.bottomDiv {
			font-size: 10px;
			display: flex;
			justify-content: center;
			margin-bottom: 50px;
		}
		
		.hotelInfo {
			background: #FFFFFF;
			padding: 30px;
			.line1 {
				color: #333333;
				font-weight: bold;
				font-size: 18px;
	    		margin-bottom: 5px;
				display: flex;
				justify-content: space-between;
			}
			.line2 {
				border-bottom: 1px dashed #c2c2c2;
				padding-bottom: 20px;
			}
			.line3 {
				display: flex;
				margin-top: 15px;
			    margin-bottom: 15px;	
				span{
					margin-right: 10px;
				}
			}
			.line4 {
				display: flex;
				justify-content: space-between;
				width: 40%;
				.left {
					width: auto;
					.date{
						font-size: 18px;
					}
				}
				.middle {
					text-align: center;
					line-height: 30px;
					span{
						border: 1px dashed;
					    border-radius: 15px;
					    padding: 5px;					
					}
				}
			}
			.line5 {
				display: flex;
		    	margin: 15px 0px;		
			}
			.line6 {
				display: flex;
				display: webkit-box-flex;
				display: -moz-box-flex;
				display: -webkit-flex;
				display: -ms-flex;
				/*width: 100%;*/
				overflow-x: scroll;
				.tableLine {
					-webkit-box-flex: 0 0 15%;      
				    -moz-box-flex: 0 0 15%;        
				    -webkit-flex:  0 0 15%;          
				    -ms-flex:  0 0 15%;              
				    flex:  0 0 15%;					
					border-top: 1px solid #7F7F7F;
					border-bottom: 1px solid #7F7F7F;
					border-left: 1px solid #7F7F7F;
					.tableLineType{
					    border-bottom: 1px solid #7f7f7f;
						padding: 10px;
	    				text-align: center;    	
	    				span{
	    					color: white;
	    				}
					}
					.tableLineValue{
						padding: 10px;
	    				text-align: center;   					
					}				
				}
				.lastChild{
					-webkit-box-flex: 0 0 15%;      
				    -moz-box-flex: 0 0 15%;        
				    -webkit-flex:  0 0 15%;          
				    -ms-flex:  0 0 15%;              
				    flex:  0 0 15%;		
					border-right: 1px solid #7F7F7F;
					border-top: 1px solid #7F7F7F;
					border-bottom: 1px solid #7F7F7F;
					border-left: 1px solid #7F7F7F;
					.tableLineType{
					    border-bottom: 1px solid #7f7f7f;
						padding: 10px;
	    				text-align: center;    	
	    				span{
	    					color: white;
	    				}
					}
					.tableLineValue{
						padding: 10px;
	    				text-align: center;   					
					}					
				}			
			}
		}
		.passenger {
			margin: 10px 0px;
			background: white;
			padding: 30px;
			.desc {
				color: #333333;
				font-size: 18px;
			}
		}
	}
</style>