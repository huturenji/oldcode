<template>
    <div class="order-summary">
        <label>{{orderItem.type}}</label>
        <div class="order-summary-lines">
            <div class="order-summary-line">
                <div class="block">
                    <span >商旅通订单号：{{orderItem.orderNo}}</span>
                    <span>{{providerName+"订单号："+ (orderItem.supplierOrderNo||'---')}}</span>
                    <!-- 如果是保险的话有一个 parentOrderNo = (机票商旅通订单号) -->
                    <span v-if="isHasParentNo" class="flight_orderNo">{{parentOrdertype}}订单号：<span @click="goTMOrderDetail(parentOrdertype,parentOrdertypeCode,orderItem.parentOrderNo)">{{(orderItem.parentOrderNo||'---')}}</span></span>
                </div>
            </div>
            <div class="order-summary-line">
                <div class="block">
                    <span>预订日期：{{orderItem.orderTime}}</span>
                    <div class="inlinespan">
                        预订人：{{orderItem.scheduledPersonName}}
                    </div>
                    <div class="inlinespan">
                        手机号码：{{orderItem.contactPhone||orderItem.scheduledPersonPhone ||orderItem.contactMobile}}
                    </div>
                </div>
                <div class="blockright">
                    <div class="inlinespan">
                        分销渠道：{{prodName}}
                    </div>
                    <div class="inlinespan">
                        企业：{{companyName}}
                    </div>
                    <div class="inlinespan">
                        供应商：{{providerName}}
                    </div>
                    <div class="inlinespan1">(</div>
                    <img src="~assets//icon_call.png"/>
                    <div class="inlinespan1">{{orderItem.providerPhone||"---"}} )</div>
                </div>
            </div>	
        </div>              
    </div>       
</template>

<script>
    import utils from "bislibs/utils";
import  * as travelfun from "bislibs/traveloperationfun.js";
    
    export default {
        props: ['orderItem'],
        data() {
            return {
            }
        },
        computed: {
			//供应商名称
			providerName:function() {
				return this.orderItem.providerShortName || travelfun.getProviderNameForId(this.orderItem.providerType);
			},	             	
			//分销商名称
			prodName:function() {
				return this.orderItem.prodName || travelfun.getProdNameForId(this.orderItem.channelId);		
			},   
			//企业名称
			companyName:function() {
                return this.orderItem.companyName || travelfun.getCompanyNameForId(this.orderItem.companyId);				
            },	
			//是否存在关联订单号，保险目前关联机票
			isHasParentNo:function() {
                return this.orderItem.type == '保险' && !!this.orderItem.parentOrderNo;				
            },
            //关联业务的名称，比如保险必须跟着机票才能下单，所以目前关联机票
            parentOrdertype:function() {
                let result="---";
                if(this.orderItem.type == '保险'){
                    result = this.getMyBusinessType(0).typeName
                }	
                return result;				
            },
            //关联业务的名称，比如保险必须跟着机票才能下单，所以目前关联机票
            parentOrdertypeCode:function() {
                let result="---";
                if(this.orderItem.type =='保险'){
                    result = this.getMyBusinessType(0).typeCode
                }	
                return result;				
            },            
        },
        methods: {
            /**
             * 跳转到订单详情
             * @param typeName
             * @param typeCode
             */
            goTMOrderDetail(typeName, typeCode, orderNo) {
                this.$router.push({
					path: "/order/orderDetail",
					query: {
						typeName: typeName,
						typeCode: typeCode,
						orderNo: orderNo,
					}
                });   
            },
            getMyBusinessType(type){
                return utils.getBusinessType(type)
            }
        },
    }
</script>
<style scoped lang="less">
    @import './listitem.less';
</style>



