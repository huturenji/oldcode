<template>
    <div class="order-item" v-if="fullScreen">
        <div class="order-summary">
            <i class="icon icon-train"></i>
            <label>火车票</label>
            <span><span>订单号：</span>{{orderItem.orderNo}}</span>
            <span><span>预订日期：</span>{{orderItem.orderTime}}</span>
            <span><span>预订人：</span>{{orderItem.scheduledPersonName || '无'}}</span>
            <!-- <span class="showTitle"
                :tips="OrgNameFormatShow(orderItem.orgName)"><span>部门：</span>{{orderItem.orgName|OrgNameFormat}}</span> -->
        </div>
        <div class="order-detail">
            <div class="order-detail-block">
                <div>
                    <div>
                        <span>{{orderItem.startCity}}</span>
                        <span v-if="orderItem.endCity">——</span>
                        <span>{{orderItem.endCity}}</span>
                        <span class="seat" v-if="orderItem.trainNo">{{orderItem.trainNo}}</span>
                        <span class="seat" v-if="orderItem.seatType">【{{seatType}}】</span>
                    </div>
                </div>
                <div class="travel-info">
                    <label class="pos-label pos-label-start">始</label>
                    <span v-if="orderItem.stationStart">{{orderItem.stationStart}}</span>
                    <span v-if="orderItem.startTime">{{orderItem.startTime}}</span>
                </div>
                <div class="travel-info">
                    <label class="pos-label pos-label-end">到</label>
                    <span v-if="orderItem.stationEnd">{{orderItem.stationEnd}}</span>
                    <span v-if="orderItem.endTime">{{orderItem.endTime}}</span>
                </div>
            </div>

            <div class="order-detail-block">
                <div class="sub-label">乘车人</div>
                <div class="single-text travel-person cusTD">
                    <div class="wraper"  v-if="!customersArr">
                        <span>{{customerNames}}</span>
                        <span class="dialog">{{customerNameValue}}</span>
                    </div>                
                </div>                
            </div>
            <div class="order-detail-block">
                <div class="sub-label">金额</div>
                <div class="single-text red-font">
                    ￥{{orderItem.payAmount}}
                </div>
            </div>
            <div class="order-detail-block">
                <div class="sub-label">状态</div>
                <div class="single-text"
                    :class="['payStatus-'+orderItem.payStatus,{'part-status-margin':orderItem.partStatus}]">
                    {{orderStatus}}
                    <div v-if="orderItem.orderStatus=='ALREADY_OUT_TICKET'">
                        <span v-if="orderItem.isHasTui && !orderItem.isHasGai">（有退票）</span>
                        <span v-if="orderItem.isHasGai && !orderItem.isHasTui">（有改签）</span>
                        <span v-if="orderItem.isHasGai && orderItem.isHasTui">（有退改）</span>
                    </div>
                </div>
                <div v-if="orderItem.partStatus" class="part-status">
                    {{orderItem.partStatus}}
                </div>
            </div>
            <div class="order-detail-block">
                <div class="sub-label">支付方式</div>
                <div class="single-text">
                    <span>{{orderItem.alias ? orderItem.alias : orderItem.payTypeName}} </span>
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
            <label>火车票</label>
            <span>{{orderItem.supplierOrderNo || orderItem.orderNo}}</span>
            <span>{{orderItem.orderTime}}</span>
            <span v-if="showPersion"><span>预订人：</span>{{orderItem.scheduledPersonName || '无'}}</span>
            <!-- <span v-if="showOrgnization"><span>部门：</span>{{orderItem.orgName}}</span> -->
        </div>
        <div class="order-detail">
            <div class="order-detail-block">
                <div>
                    <div>
                        <span>{{orderItem.startCity}}</span>
                        <span>——</span>
                        <span>{{orderItem.endCity}}</span>
                    </div>
                </div>
                <div class="travel-info">
                    <span v-if="orderItem.startTime">{{orderItem.startTime}}</span>
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
                <div class="single-text red-font">
                    ￥{{orderItem.payAmount}}
                </div>
            </div>
            <div class="order-detail-block">
                <div class="single-text">
                    {{orderItem.alias ? orderItem.alias : orderItem.payTypeName}}
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
import { getTrainOrderStatus } from 'orderCommon/enum/orderStatusEnum.js'
export default {
    props: ['orderItem', 'isFullScreen', 'showPers', 'showOrg'],
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
            var customerArr = this.orderItem.passengers ? this.orderItem.passengers.split(',') : [];
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
        seatType: function () {
            switch (this.orderItem.seatType) {
            case 0:
                return '商务座';
            case 1:
                return '特等座';
            case 2:
                return '一等座';
            case 3:
                return '二等座';
            case 4:
                return '高级软卧';
            case 5:
                return '软卧';
            case 6:
                return '硬卧';
            case 7:
                return '软座';
            case 8:
                return '硬座';
            case 9:
                return '无座';
            case 10:
                return '其他';
            default:
                return '其他'
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
            return getTrainOrderStatus(this.orderItem.orderStatus);
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
        /**
            * 跳转到订单详情
            * @param typeName
            * @param typeCode
            */
        goDetail() {
            this.$emit('goPage', "enterprise/index.html#/order/detail/train/app?OrderNo=" + this.orderItem.orderNo);
        }
    }
}
</script>
<style scoped lang="less">
    @import '../orderItem/orderItem.less';
</style>