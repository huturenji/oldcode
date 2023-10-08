<template>
    <div class="order-item" v-if="fullScreen">
        <div class="order-summary">
            <i class="icon icon-hotel"></i>
            <label>酒店</label>
            <span><span>订单号：</span>{{orderItem.orderNo}}</span>
            <span><span>预订日期：</span>{{orderItem.orderTime}}</span>
            <span><span>预订人：</span>{{orderItem.scheduledPersonName || '无'}}</span>
            <!-- <span class="showTitle"
                :tips="OrgNameFormatShow(orderItem.orgName)"><span>部门：</span>{{orderItem.orgName|OrgNameFormat}}</span> -->
            <!--<div class="staff-btn"><span>客服</span></div>-->
        </div>
        <div class="order-detail">
            <div class="order-detail-block">
                <div>
                    <div>
                        <span>{{orderItem.hotelName}}</span>
                        <span class="seat" v-if="orderItem.roomTypeName">【{{orderItem.roomTypeName}}】</span>
                    </div>
                </div>
                <div class="travel-info">
                    <label class="pos-label pos-label-start">住</label>
                    <span v-if="orderItem.arriveDate">{{orderItem.arriveDate | dateFormat}}</span>
                    <span v-if="nightNum" class="travelTime">共<span>{{nightNum}}</span>晚</span>
                </div>
                <div class="travel-info">
                    <label class="pos-label pos-label-end">离</label>
                    <span v-if="orderItem.departDate">{{orderItem.departDate | dateFormat}}</span>
                </div>
            </div>

            <div class="order-detail-block">
                <div class="sub-label">入住人</div>
                <div class="single-text travel-person cusTD">
                    <div class="wraper"  v-if="!customersArr">
                        <span>{{customerNames}}</span>
                        <span class="dialog">{{customerNameValue}}</span>
                    </div>                
                </div>
            </div>
            <div class="order-detail-block">
                <div class="sub-label">金额</div>
                <div class="single-text red-font" :class="{'with-vouch':orderItem.vouchAmount}">
                    <span>￥{{orderItem.payAmount}}</span>
                    <span class="payment" :class="paymentIcon"></span>
                    <span class="payment payment-vouch-icon" v-if="orderItem.isGuarantee"></span>
                </div>
                <div class="vouch" v-if="orderItem.vouchAmount">
                    担保：￥{{orderItem.vouchAmount}}
                    <span class="payment payment-vouch-icon"></span>
                </div>
            </div>
            <div class="order-detail-block">
                <div class="sub-label">状态</div>
                <div class="single-text"
                    :class="['payStatus-'+orderItem.payStatus,{'part-status-margin':orderItem.partStatus}]">
                    {{orderStatus}}
                </div>
                <div v-if="orderItem.partStatus" class="part-status">
                    {{orderItem.partStatus}}
                </div>
            </div>
            <div class="order-detail-block">
                <div class="sub-label">支付方式</div>
                <div class="single-text">
                    <span>{{payType(this.orderItem)}}</span>
                </div>
            </div>
            <div class="order-detail-block">
                <div class="button normal-btnprimary cursorp" @click="goDetail()">
                    详情
                </div>
            </div>
        </div>
    </div>


    <div class="pc-order-item" v-else>
        <div class="order-summary">
            <label>酒店</label>
            <span>{{orderItem.supplierOrderNo || orderItem.orderNo}}</span>
            <span>{{orderItem.orderTime}}</span>
            <span v-if="showPersion"><span>预订人：</span>{{orderItem.scheduledPersonName || '无'}}</span>
            <!-- <span v-if="showOrgnization"><span>部门：</span>{{orderItem.orgName}}</span> -->
        </div>
        <div class="order-detail">
            <div class="order-detail-block">
                <div>
                    <div>
                        <span>{{orderItem.hotelName}}</span>
                    </div>
                </div>
                <div class="travel-info">
                    <label>入住 :</label>
                    <span v-if="orderItem.arriveDate">{{orderItem.arriveDate | dateFormat}}</span>
                </div>
                <div class="travel-info">
                    <label>离店 :</label>
                    <span v-if="orderItem.departDate">{{orderItem.departDate | dateFormat}}</span>
                </div>
            </div>

            <div class="order-detail-block">
                <div class="single-text travel-person cusTD">
                    <div class="wraper"  v-if="!customersArr">
                        <span>{{customerNames}}</span>
                        <span class="dialog">{{customerNameValue}}</span>
                    </div>                
                </div>               
            </div>
            <div class="order-detail-block">
                <div class="single-text red-font" :class="{'with-vouch':orderItem.vouchAmount}">
                    <span>￥{{orderItem.payAmount}}</span>
                </div>
                <div class="vouch" v-if="orderItem.vouchAmount">
                    担保：￥{{orderItem.vouchAmount}}
                    <span class="payment payment-vouch-icon"></span>
                </div>
            </div>
            <div class="order-detail-block">
                <div class="single-text">
                    {{payType(this.orderItem)}}
                </div>
            </div>
            <div class="order-detail-block">
                <div class="button normal-btnprimary cursorp" @click="goDetail()">
                    详情
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getHotelOrderStatus } from 'orderCommon/enum/orderStatusEnum.js'
export default {
    //  components: {
    //     Poptip,
    //  },
    props: ['orderItem', 'isFullScreen', 'showOrg', 'showPers'],
    data() {
        return {
            customerNames: '',
            customerNameValue: '',
            fullScreen: this.isFullScreen,
            showPersion: this.showPers,
            showOrgnization: this.showOrg
        }
    },
    filters: {
        dateFormat(value) {
            try {
                return value && value.split(" ")[0];
            } catch (e) {
                return value;
            }
        },
        OrgNameFormat(value) {
            if (!!value && value.length >= 10) {
                return value.substr(0, 9) + '...'
            } 
            return value || "---"
                
        }
    },
    computed: {
        customersArr: function () {
            let _this = this;
            _this.customerNames = '';
            _this.customerNameValue = '';
            var customerArr = this.orderItem.customers ? this.orderItem.customers.split(',') : [];
            if (!!customerArr) {
                for (let i = 0; i < customerArr.length; i++) {
                    if (i < 1) {
                        _this.customerNames += customerArr[i] + ' ';
                    }
                    _this.customerNameValue += customerArr[i] + ' ';
                }
                if (customerArr.length >= 2) {
                    _this.customerNames += '...';
                }
            }
            return customerArr
        },
        paymentIcon: function () {
            if (this.orderItem.roomType == '0') {
                return 'payment-xf-icon';
            } 
            return 'payment-yf-icon';
                
        },
        nightNum: function () {
            try {
                let startDate = new Date(this.orderItem.arriveDate).getTime();
                let endDate = new Date(this.orderItem.departDate).getTime();
                return (endDate - startDate) / (1000 * 60 * 60 * 24);

            } catch (e) {
                return null;
            }
        },
        payStatus: function () {
            switch (this.orderItem.payStatus) {
            case 0:
                return '未支付';
            case 1:
                return '已支付';
            case 2:
                return '已退款';
            default:
                return ''        
            }
        },
        orderStatus: function () {
            return getHotelOrderStatus(this.orderItem.orderStatus);
        }
    },
    watch: {
        isFullScreen(val) {
            var _this = this;
            _this.fullScreen = val;
        },
        showPers(val) {
            var _this = this;
            _this.showPersion = val;
        },
        showOrg(val) {
            var _this = this;
            _this.showOrgnization = val;
        }
    },
    methods: {
        OrgNameFormatShow(OrgName) {
            return OrgName || "---"
        },
        payType: function (orderItem) {
            if (orderItem.roomType == 0) {
                return '到店付';
            } 
            return orderItem.alias ? orderItem.alias : orderItem.payTypeName;
                
        },
        /**
             * 跳转到订单详情
             * @param typeName
             * @param typeCode
             */
        goDetail() {
            this.$emit('goPage', "enterprise/index.html#/order/detail/hotel/app?OrderNo=" + this.orderItem.orderNo);
        }
    }
}
</script>
<style scoped lang="less">
    @import '../orderItem/orderItem.less';
</style>
