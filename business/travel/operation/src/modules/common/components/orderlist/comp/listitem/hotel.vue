<template>
    <div class="order-item">
        <orderItemSummary :orderItem="orderItem"></orderItemSummary>
        <div class="order-detail">
            <div class="order-detail-block">
                <div>
                    <div>
                        <span>{{orderItem.hotelName}}</span>
                    </div>
                    <span class="seatOne" v-if="orderItem.roomTypeName">【{{orderItem.roomTypeName}}】</span>
                    <span class="seat" v-if="orderItem.roomCount">共{{orderItem.roomCount}}间</span>
                </div>
                <div class="travel-infoP">
                	<div>
		                <div class="travel-info">
		                    <label class="pos-label pos-label-start">住</label>
		                    <span v-if="orderItem.arriveDate">
		                    {{orderItem.arriveDate}}	
		                    </span>
		                </div>
		                <div class="travel-info">
		                    <label class="pos-label pos-label-end">离</label>
		                    <span v-if="orderItem.departDate">
		                    {{orderItem.departDate}}	
		                    </span>
		                </div>
                	</div>
                	<span v-if="nightNum" class="travelTime">共<span>{{nightNum}}</span>晚</span>
                </div>
            </div>

            <div class="order-detail-block">
                <div class="sub-label">入住人</div>
                <div class="single-text travel-person" :class="{'muti-person':customersArr.length>2,'double-person':customersArr.length==2}">
                    <div v-for="cust of customersArr" v-show="cust" :key="cust">
                        {{cust}}
                    </div>
                </div>
            </div>
            <div class="order-detail-block">
                <div class="sub-label">金额</div>
                <div class="single-text red-font" :class="{'with-vouch':orderItem.isGuarantee}">
                    <span>￥{{orderItem.payAmount||orderItem.totalPayAmount}}</span>
                    <!--<span class="payment" :class="paymentIcon"></span>
                    <span class="payment payment-vouch-icon"  v-if="orderItem.isGuarantee" ></span>-->
                </div>
                <div class="vouch" v-if="orderItem.isGuarantee" >
            		担保费用：￥{{orderItem.guaranteeAmount}}
                    <span class="payment payment-vouch-icon"></span>
                </div>
            </div>
            <div class="order-detail-block">
                <div class="sub-label">订单状态</div>
                <div class="single-text" :class="[{'part-status-margin':orderItem.partStatus}]" :style="{color:orderStatusColor}">
                    {{orderStatus}}
                </div>
                <div v-if="orderItem.partStatus" class="part-status">
                    {{orderItem.partStatus}}
                </div>
            </div>
            <div class="order-detail-block">
                <div class="sub-label">支付方式</div>
                <div class="single-text single-text1">
                    {{payType}}
                </div>
				<div v-if="userTypeFlag" class="userTypeDiv" :class="'diff-'+orderItem.useType">
					{{userType}}
				</div>
            </div>
            <div class="order-detail-block lastBlock">

                <viewInvoicePop v-if="hasInvoice" :inputData="viewInvoiceData"></viewInvoicePop>
                <div v-if="!orderItem.isAbnormal" class="button primary cursorp" @click="goDetail(orderItem.typeName,orderItem.typeCode, orderItem.orderNo)">
                   	 订单详情
                </div>
                <!-- 领取和退款UI -->
                <manualRefundHotel v-if="orderItem.isAbnormal && !(typeof orderItem.bpProductExceptionProcessedStatus == 'undefined' || orderItem.bpProductExceptionProcessedStatus + '' == 'null')" 
                    :exceptionProcessedStatus="orderItem.bpProductExceptionProcessedStatus" :handlerId="orderItem.customeServiceStaffId"
                    :handlerName="orderItem.customeServiceStaff"  :orderItem="orderItem" @refreshPage="mbfRefreshPage" />                
            </div>
        </div>
    </div>
</template>

<script>
    const orderItemSummary = () => import("./listitemheader.vue");    
    const viewInvoicePop = () => import("biscomponents/invoice/previewpopup.vue");    
    const manualRefundHotel = () => import("biscomponents/abnormal-order/hotel/hotel");   
    import utils from 'bislibs/utils'
    import  * as travelfun from "bislibs/traveloperationfun.js";

    export default {
        props: ['orderItem','expressCompanies'],
		components: {
			orderItemSummary,viewInvoicePop,manualRefundHotel,
		},        
        data() {
            return {
                userTypeFlag: utils.userTypeSwitch,
            	showDialog:false,//弹框信息是否显示
            }
        },
        created () {
            // 监听body点击事件,判断点击元素如果为className不为showButton,则让弹框隐藏
            let that = this;
        },
        beforeDestroy () {
            let that = this;
        },
        computed: {			
            hasInvoice:function(){
            	//必须是预付类型、兆日开票并且已经开发票 invoiceDone
                return this.orderItem.invoiceDone == 1 && this.orderItem.roomType == 1 && this.orderItem.invoiceMode=='BusinessTrip';
            },			
			//发票模块数据
			viewInvoiceData:function(){
                let result = {
                    invoiceAddr:[],
                    // invoiceAddr:["https://inv.jss.com.cn/group5/M00/14/18/wKj6zl7q1zKIUQ9OAAIhKSB3BJYAAQjsAOCyH4AAiFB218.pdf"],
                };				
                if(!!this.orderItem.invoiceInfo && !!this.orderItem.invoiceInfo.invoicePdfUrl
                    && this.orderItem.invoiceInfo.invoicePdfUrl.length>0){
                        result.invoiceAddr = this.orderItem.invoiceInfo.invoicePdfUrl
                }
				return result;
			},                      	
			orderStatus: function() {
				return utils.getHotelOrderStatus(this.orderItem.orderStatus);
			},        	
            customersArr: function () {
                let source = this.orderItem.customers|| this.orderItem.consumers
                return source ? source.split(',') : [];
            },
            paymentIcon: function () {
                if (this.orderItem.roomType == '0') {
                    return 'payment-xf-icon';
                } else {
                    return 'payment-yf-icon';
                }
            },
            nightNum: function () {
                try{
                    const pattern = 'yyyy-MM-dd hh:mm';
                    let startDate = new Date(this.orderItem.arriveDate).getTime();
                    let endDate = new Date(this.orderItem.departDate).getTime();
                    return (endDate - startDate) / (1000 * 60 * 60 * 24);
                }catch(e){
                    return null;
                }
            },
            payType: function () {
            	if(this.orderItem.roomType == 0){
            		return '到店付';
            	}else{
                    return this.orderItem.payTypeName  || this.orderItem.paymentPlatform 
					&& this.orderItem.paymentPlatform.payTypeName || travelfun.getDefaultName()
            	}
            },
            payStatus: function () {
    	       	if(this.orderItem.roomType == 0){
            		return '————';
            	}else{
					return travelfun.getPayStatus(this.orderItem.payStatus);
            	}
            },
			userType: function() {
				return travelfun.getUserType(this.orderItem.useType);
            },    
            orderStatusColor: function() {
                return utils.getHotelOrderStatusColor(this.orderItem.orderStatus);
            },        
        },
        methods: {
            /**
             * 跳转到订单详情
             * @param typeName
             * @param typeCode
             */
            goDetail(typeName, typeCode, orderNo) {
				this.$router.push({
					path: "/order/orderDetail",
					query: {
						typeName: typeName,
						typeCode: typeCode,
                        orderNo: orderNo,
                        isAbnormal:this.orderItem.isAbnormal
					}
				});                       
                // this.$emit('goDetail', typeName, typeCode, orderNo);
            },
            /**
             * 跳转到发票详情
             * @param invoiceResult
             */            
            goInvoiceDetail(invoiceResult) {
                this.$emit('goInvoiceDetail', invoiceResult);
            },
            /**
             * 领取、补录功能结果
             */
            mbfRefreshPage(){
                //补录成功，刷新列表数据
                this.$emit('refreshPage');
            }            
        },
    }
</script>
<style scoped lang="less">
    @import './listitem.less';
</style>



