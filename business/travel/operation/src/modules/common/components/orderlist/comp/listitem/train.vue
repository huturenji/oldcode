<template>
    <div class="order-item">
        <orderItemSummary :orderItem="orderItem"></orderItemSummary>
        <div class="order-detail">
            <div class="order-detail-block">
                <div>
                    <div>
                        <span>{{orderItem.startCity}}</span>
                        <span v-if="orderItem.endCity">——</span>
                        <span>{{orderItem.endCity}}</span>
                    </div>
                    <span class="seat" v-if="orderItem.trainNo">{{orderItem.trainNo}}</span>
                    <span class="seat" v-if="orderItem.seatTypeName">【{{orderItem.seatTypeName}}】</span>
                </div>
                <div class="travel-info">
                    <label class="pos-label pos-label-start">始</label>
                    <span v-if="orderItem.startStation">{{orderItem.startStation}}</span>
                    <span v-if="orderItem.startTime">
                    {{orderItem.startTime}}
                    </span>
                </div>
                <div class="travel-info">
                    <label class="pos-label pos-label-end">到</label>
                    <span v-if="orderItem.endStation">{{orderItem.endStation}}</span>
                    <span v-if="orderItem.endTime">
                    {{orderItem.endTime}}
                    </span>
                </div>
            </div>

            <div class="order-detail-block">
                <div class="sub-label">乘车人</div>
                <div class="single-text travel-person" :class="{'muti-person':customersArr.length>2,'double-person':customersArr.length==2}">
                    <div v-for="cust of customersArr" :key="cust" v-show="cust">
                        {{cust}}
                    </div>
                </div>
            </div>
            <div class="order-detail-block">
                <div class="sub-label">金额</div>
                <div class="single-text red-font">
                    	￥{{orderItem.payAmount || orderItem.totalPayAmount}}
                </div>
            </div>
            <div class="order-detail-block">
                <div class="sub-label">订单状态</div>
                <div class="single-text" :class="['payStatus-'+orderItem.payStatus,{'part-status-margin':orderItem.partStatus}]"
                    :style="{color:orderStatusColor}"
                >
                    {{orderStatus + partStatus}}
                </div>
                <!--<div v-if="orderItem.partStatus" class="part-status">
                    {{orderItem.partStatus}}
                </div>-->
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
                <manualRefundTrain v-if="orderItem.isAbnormal && !(typeof orderItem.bpProductExceptionProcessedStatus == 'undefined' || orderItem.bpProductExceptionProcessedStatus + '' == 'null')" 
                    :exceptionProcessedStatus="orderItem.bpProductExceptionProcessedStatus" :handlerId="orderItem.customeServiceStaffId"
                    :handlerName="orderItem.customeServiceStaff"  :orderItem="orderItem" @refreshPage="mbfRefreshPage" />                    
            </div>
        </div>
    </div>
</template>

<script>
	import utils from 'bislibs/utils'	
    import  * as travelfun from "bislibs/traveloperationfun.js"; 
    const orderItemSummary = () => import("./listitemheader.vue");       
    const viewInvoicePop = () => import("biscomponents/invoice/previewpopup.vue");      
    const manualRefundTrain = () => import("biscomponents/abnormal-order/train/train.vue");            

    export default {
        props: ['orderItem','expressCompanies'],
		components: {
			orderItemSummary,viewInvoicePop,manualRefundTrain,
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
            	return !!this.orderItem.invoiceInfo && !!this.orderItem.invoiceInfo.invoicePdfUrl && this.orderItem.invoiceInfo.invoicePdfUrl.length>0;
            },
			//发票模块数据
			viewInvoiceData:function(){
                let result = {
                    invoiceAddr:[],
                    // invoiceAddr:["https://inv.jss.com.cn/group5/M00/14/18/wKj6zl7q1zKIUQ9OAAIhKSB3BJYAAQjsAOCyH4AAiFB218.pdf"],
                };				
                if(!!this.orderItem.invoiceInfo && !!this.orderItem.invoiceInfo.invoicePdfUrl
                    && this.orderItem.invoiceInfo.invoicePdfUrl.length>0){
                        result.invoiceAddr.push(this.orderItem.invoiceInfo.invoicePdfUrl[0])
                }
				return result;
			}, 
            customersArr: function () {
                return this.orderItem.passengers ? this.orderItem.passengers.split(',') : [];
            },
			//支付方式
			payType: function() {
				return this.orderItem.payTypeName  || this.orderItem.paymentPlatform 
					&& this.orderItem.paymentPlatform.payTypeName || travelfun.getDefaultName();
			},
			payStatus: function() {
				return travelfun.getPayStatus(this.orderItem.payStatus);
			},
			userType: function() {
				return travelfun.getUserType(this.orderItem.useType);
			},            
			orderStatus: function() {
				return utils.getTrainOrderStatus(this.orderItem.orderStatus);
			},   
			partStatus:function(){
				if(utils.showTrainSubStatus(this.orderItem.orderStatus)){
                    return utils.getTrainPsgStatusUIName(this.orderItem)                
				}
				return ""                
            },
            orderStatusColor: function() {   
                return utils.getTrainOrderStatusColor(this.orderItem.orderStatus);
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



