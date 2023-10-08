<template>
    <div class="page-flight-card">
        <section class="order-card" :class="{ disable: airline.disableStyle }">
            <FlightTimesComp :item="airline" :iconType="roundTrip" />
            <div class="gai-card" v-if="airline.isGaiOrder"></div>
            <section>
                <div class="psg-info" v-for="(psg, index) in airline.passengers" :key="index"
                    :class="{ disable: !airline.isGaiOrder && psgStatuState(psg.status) == StateStyle.SUCCESS && getPsgStatuType(psg.status) == '1' }">
                    <div class="customer-list">
                        <div class="customer-info">
                            <div class="passenger-name">{{ psg.psgName }}</div>
                            <div>{{ strIdType(psg.cardType) }}: {{ psg.cardNo | formateID }}</div>
                            <!-- airline:改签票显式卡票 -->
                            <!-- airline.isGaiOrde: 改签票 -->
                            <!-- psg.gaiOrderList.length === 0:未经过改签的票 -->
                            <!-- 除此之外是经过改签的原票：不显示票号 -->
                            <div v-if="psg.ticketNumber && (airline.isGaiOrder || psg.gaiOrderList.length === 0)"
                                class="ticket-number-wrapper">
                                <div class="ticket-number">票号：{{ psg.ticketNumber }}</div>
                                <div class="btn cursorp ticket-number-copy" @click="copyTicketNumber(psg.ticketNumber)">
                                    复制</div>
                            </div>
                        </div>

                        <div class="cabin-info">
                            [{{ airline.cabinName }}]
                        </div>
                    </div>
                    <div class="cust-btn-group clear">
                        <div class="psg-status fl" :style="{ color: getPsgStatusColor(psg.status) }"
                            v-if="getPsgStatusName(psg.status, airline.isGaiOrder)">
                            {{ getPsgStatusName(psg.status, airline.isGaiOrder) }}
                            <template
                                v-if="psgStatuState(psg.status) == StateStyle.UNKNOW && orderExtraInfo.lastUpdateTime">
                                （{{ orderExtraInfo.lastUpdateTime }}）
                            </template>
                            <!-- 改签后原单未退保 -->
                            <template v-if="getUserInsType(psg) && psgStatuState(psg.status) == StateStyle.SUCCESS">
                                <span class="quitInsTips">{{ getUserInsTips(psg, getPsgStatuType(psg.status) == '1')
                                }}</span>
                            </template>
                        </div>
                        <!-- 如果是改签单，只有改签成功和退票失败才展示退票按钮 -->
                        <!-- 如果是正常单，只有非改签成功和非退票成功才展示退票按钮 -->
                        <template v-if="(airline.isGaiOrder
                        && (getPsgStatuType(psg.status) == '1' && psgStatuState(psg.status) == StateStyle.SUCCESS)
                        || (getPsgStatuType(psg.status) == '0' && psgStatuState(psg.status) == StateStyle.FAILED))
                        || (!airline.isGaiOrder && psgStatuState(psg.status) != StateStyle.SUCCESS)">
                            <div class="btn cursorp"
                                v-if="(orderDetail.orderStatus == 'PARTIAL_ALREADY_REFUND' || orderDetail.orderStatus == 'ALREADY_OUT_TICKET' || orderDetail.orderStatus == 'ALREADY_INVOICE')"
                                @click="selfOrder && $emit('changeTicketState', psg, airline, roundTrip, 1)">
                                <SnButton inline ghost
                                    :disabled='psgStatuState(psg.status) == StateStyle.INPROCESS || !selfOrder'
                                    :type="airline.isGaiOrder ? 'warning' : 'primary'" size="small" shape="round">
                                    退票
                                </SnButton>
                            </div>
                        </template>

                        <template v-if="!airline.isGaiOrder">
                            <div class="tips-wait"
                                v-if="orderDetail.orderStatus == 'ALREADY_PAID' && psgStatuState(psg.status) == StateStyle.NORMAL">
                                正在出票，请稍候</div>
                            <div class="tips-wait" v-if="orderDetail.orderStatus == 'UNPAID'">待支付</div>
                            <div class="tips-success"
                                v-if="(orderDetail.orderStatus == 'PARTIAL_ALREADY_REFUND' || orderDetail.orderStatus == 'ALREADY_OUT_TICKET' || orderDetail.orderStatus == 'ALREADY_INVOICE') && psgStatuState(psg.status) == StateStyle.NORMAL">
                                出票成功</div>
                            <div class="tips-failed" v-if="orderDetail.orderStatus == 'FAILED_OUT_TICKET'">出票失败</div>
                            <div class="tips-cancel" v-if="orderDetail.orderStatus == 'ALREADY_CANCEL'">已取消</div>

                            <!-- 改签单没有改签按钮 -->
                            <div class="btn cursorp"
                                v-if="(orderDetail.orderStatus == 'PARTIAL_ALREADY_REFUND' || orderDetail.orderStatus == 'ALREADY_OUT_TICKET' || orderDetail.orderStatus == 'ALREADY_INVOICE') && psgStatuState(psg.status) != StateStyle.SUCCESS"
                                @click="selfOrder && $emit('changeTicketState', psg, airline, roundTrip, 0)">
                                <SnButton inline ghost
                                    :disabled='psgStatuState(psg.status) == StateStyle.INPROCESS || !selfOrder'
                                    :type="airline.isGaiOrder ? 'warning' : 'primary'" size="small" shape="round">
                                    改签
                                </SnButton>
                            </div>
                        </template>
                        <template v-else>
                            <div class="tips-wait"
                                v-if="getPsgStatuType(psg.status) == '1' && psgStatuObj(psg.status).ticketStatus == 'ALREADY_PAID'">
                                正在出票，请稍候</div>
                        </template>
                    </div>
                    <div class="status-message ticket-failed-info"
                        v-if="psgStatuState(psg.status) == StateStyle.UNKNOW">
                        <Icon size='.28' type="icon_common_prompt" class="icon icon-btn" />
                        请联系客服确认出票结果或以短信通知为准
                    </div>
                    <div class="status-message ticket-failed-info"
                        v-if="orderDetail.orderStatus == 'FAILED_OUT_TICKET'">
                        <Icon size='.28' type="icon_common_prompt" class="icon icon-btn" />
                        因航司系统繁忙，出票失败；退款将在1-7个工作日内原路返回
                    </div>
                    <div class="status-message ticket-failed-info cursorp" v-if="orderDetail.orderStatus == 'UNKNOWN'">
                        <Icon size='.28' type="icon_common_prompt" class="icon icon-btn" />
                        无法获取出票结果，请<a class="normal-btn" @click="$emit('callPhone')">联系客服</a>确认或以短信通知为准
                    </div>
                    <div class="status-message gai-failed-info"
                        v-if="getPsgStatuType(psg.status) == '1' && [StateStyle.FAILED, StateStyle.CANCEL].indexOf(psgStatuState(psg.status)) > -1">
                        <Icon size='.28' type="icon_common_prompt" class="icon icon-btn" />
                        <template v-if='psgStatuObj(psg.status).reason == "timeout"'>
                            您改签的航班{{ psg.endorseShortInfo &&
                                    '（' + psg.endorseShortInfo + '）'
                            }}由于超时未补款（￥{{ psg.gaiQianAddAmount }}）改签失败，如有需要可重新提交
                        </template>
                        <template v-else-if="psgStatuObj(psg.status).reason == 'activeCancel'">
                            您已取消改签申请，如有需要可重新提交
                        </template>
                        <template v-else>
                            您改签的航班{{ psg.endorseShortInfo && '（' + psg.endorseShortInfo + '）' }}由于舱位已满改签失败，如有需要可重新提交
                        </template>
                    </div>
                    <template v-if="!!psg.tuiOrderList && psg.tuiOrderList.length > 0">
                        <div class="status-message tui-failed-info"
                            v-if="getPsgStatuType(psg.status) == '0' && psgStatuState(psg.status) == StateStyle.FAILED">
                            <Icon size='.28' type="icon_common_prompt" class="icon icon-btn" />
                            {{ psg.tuiOrderList[0].platformRemarks || '因航司系统繁忙，请持购票有效证件到机场值机柜台办理' }}
                        </div>
                        <div class="status-message tui-success-info cursorp"
                            v-if="psgStatuState(psg.status) == StateStyle.SUCCESS && getPsgStatuType(psg.status) == '0' && !!psg.tuiOrderList && psg.tuiOrderList.length > 0">
                            <Icon size='.28' type="icon_common_prompt" class="icon icon-btn" />
                            退款将在1-7个工作日内原路退回
                            <a id="goDetail" class="normal-btn" @click="showRefundDetailPop(psg, airline)"
                                v-if="!!psg.tuiOrderList && psg.tuiOrderList.length > 0">退款明细</a>
                        </div>
                    </template>
                </div>
                <div class="add-money" v-if="showAddMoney(airline)">
                    <div class="title">由于票价变动，您还需支付￥{{ airline.realAddMoneyAmount }}</div>
                    <div class="btn-group">
                        <SnButton class="btn cursorp" inline ghost :disabled="!selfOrder" type="info"
                            @click.native="selfOrder && cancelEndorse(airline.gaiOrder.chaOrderNo)">
                            取消
                        </SnButton>
                        <SnButton class="btn cursorp" inline ghost
                            :disabled="!flightRemaining[airline.airLineID] || !selfOrder" type="warning"
                            @click.native="selfOrder && toPay(airline)">
                            去支付{{ flightRemaining[airline.airLineID] | limitTimeFilter }}
                        </SnButton>
                    </div>
                </div>
                <!-- 平价改签单独支付保险 -->
                <div class="add-money" v-else-if="getIsinsuranceOrderPay(airline)">
                    <div class="title">您有{{ getGaiInsPayTips() }}未支付，共￥{{ airline.gaiOrder.realAddMoneyAmount }}</div>
                    <div class="title grayColor">*投保规则：改签成功后付款投保</div>
                    <div class="btn-group">
                        <SnButton class="btn cursorp" inline ghost :disabled="!selfOrder" type="warning"
                            @click.native="selfOrder && toPayIns(airline)">
                            去支付
                        </SnButton>
                    </div>
                </div>
                <div class="gai-process-info" v-if="showGaiProcessInfo(airline)">
                    正在为您办理改签，请稍候...
                </div>
            </section>
        </section>
    </div>
</template>

<script>
import extendUtils from 'orderCommon/extend.js';
import FlightTimesComp from 'flightComp/flightTimesComp.vue';
import { getCardTypeName } from 'orderCommon/enum/custInfoEnum.js';
import { getFlightPsgStatusName, getFlightPsgStatusColor, getFlightPsgStatusObj, StateStyle, tuiOrderStatuConvert, gaiOrderStatuConvert } from 'orderCommon/enum/psgStatusEnum.js';
import { insuranceStatus } from 'orderCommon/enum/orderStatusEnum.js'
import {
    TransferDom
    // Confirm
} from 'vux';
// import requestHandler from 'orderCommon/requestHandler.js';
const Icon = () => import('components/icon');
const SnButton = () => import('components/button');
const ISDECORATE = extendUtils.ISDECORATE;
const MASKING_TYPE = SnUtils.DataMasking.MASKING_TYPE;
const maskingText = SnUtils.DataMasking.maskingText;
export default {
    directives: {
        TransferDom
    },
    components: {
        Icon,
        SnButton,
        FlightTimesComp
        // Confirm
    },
    props: {
        airline: Object,
        roundTrip: Number,
        orderDetail: Object,
        flightOrderStatus: Object,
        orderExtraInfo: Object,
        selfOrder: Boolean,
        insuranceOrders: Array
    },
    data() {
        return {
            iconName: null,
            StateStyle: StateStyle,//psgStatusEnum中的StatuStyle对象
            flightRemaining: {},//补款倒计时存储对象
            flightTimeInterval: {},//补款倒计时的Interval存储对象
            showRefundDetail: false,//退款明细弹框
            refundOrder: {},//退款明细的退单对象
            orderNo: this.orderDetail.orderNo
        }
    },
    filters: {
        limitTimeFilter: function (value) {
            if (value && value >= 0) {
                return "(" + new Date(value * 1000).format('mm分ss秒') + ")";
            }
            return '';
        },
        calcPrice: function (tuiOrder) {
            let amount = (tuiOrder.refTicketAmount || 0) + (tuiOrder.refInsAmount || 0);
            return "（￥" + (amount || 0) + "）";
        },
        //身份证号脱敏
        formateID(value) {
            try {
                value = ISDECORATE ? maskingText(MASKING_TYPE.TEL, value) : value;
            } catch (error) {

            }
            return value;
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        tuiAmountFilter: function (value) {
            if (!this.refundOrder.refStatus) {
                return;
            }
            let statusObj = getFlightPsgStatusObj(tuiOrderStatuConvert[this.refundOrder.refStatus]);
            //如果是供应商没有返回价格明细的状态，则显示提示文字
            if (!statusObj || !statusObj.hasPriceDetail) {
                return '正在获取数据，请稍后...';
            }
            return value + '元';
        },
        /**
             * 展示退款明细
             * @param psg 乘机人对象
             */
        showRefundDetailPop(psg, airline) {
            // this.showRefundDetail = true;
            // this.refundOrder = psg.tuiOrderList[0];
            if (psg.tuiOrderList[0].refStatus == 6) {
                this.$router.push({
                    path: '/refund/flight',
                    query: {
                        orderNo: this.orderNo,
                        airLineId: airline.airLineID
                    }
                })
            } else {
                this.$vux.confirm.show({
                    title: '',
                    content: '正在发起退款，请稍候查看',
                    showCancelButton: false,
                    onConfirm() {
                    }
                });
            }
        },
        /**
             * 更改证件显示文字
             * @param type 证件id
             * @returns {*}
             */
        strIdType(type) {
            return getCardTypeName(type);
        },
        /**
             * 获取出行人的状态名字
             * @param status 状态码
             * @returns {*}
             */
        getPsgStatusName(status, isGaiOrder) {
            //改签单取分组1的状态名称
            return getFlightPsgStatusName(status, isGaiOrder ? 1 : null);
        },
        /**
             * 获取出行人的状态颜色
             * @param status 状态码
             * @returns {*}
             */
        getPsgStatusColor(status) {
            return getFlightPsgStatusColor(status);
        },
        /**
             * 获取出行人的状态State
             * @param status 状态码
             * @returns {*}
             */
        psgStatuState(status) {
            //非改签单，才显示disable的样式
            try {
                return this.psgStatuObj(status).state;
            } catch (e) {
                return null;
            }
        },
        /**
             * 获取出行人的状态Obj
             * @param status 状态码
             * @returns {*}
             */
        psgStatuObj(status) {
            //非改签单，才显示disable的样式
            try {
                return getFlightPsgStatusObj(status);
            } catch (e) {
                return {};
            }
        },
        /**
             * 获取乘机人对象类型
             * @param status
             * @returns 0：退票，1：改签；-1：正常
             */
        getPsgStatuType(status) {
            try {
                return this.psgStatuObj(status).type;
            } catch (e) {
                return -1;
            }
        },
        /**
             * 是否展示“正在为您办理改签，请稍候”文字...
             * @param airline 航班信息
             */
        showGaiProcessInfo(airline) {
            if (!airline.isGaiOrder) {
                return false;
            }
            let flag = false;
            airline.passengers.forEach((psg) => {
                //如果需要补款，就不显示这段话
                if (!airline.gaiOrder.needAddMoney && getFlightPsgStatusObj(psg.status).type == 1 && getFlightPsgStatusObj(psg.status).state == this.StateStyle.INPROCESS) {
                    //无需补款时，这个乘客状态也不需要显示
                    if (this.psgStatuObj(psg.status).ticketStatus != 'ALREADY_PAID') {
                        flag = true;
                    }

                }
            })
            return flag;
        },
        /**
             * 获取是否是机票平价改签并购买了保险需要单独支付保险
             */
        getIsinsuranceOrderPay(airline) {
            // let that = this;
            let res = false;
            //是改签单才有这个判断逻辑
            if (airline.isGaiOrder && airline.gaiOrder) {
                let orders = (airline.gaiOrder || {}).unPaidOrderNos || [];
                for (let j = 0, len = orders.length; j < len; j++) {
                    if (5 != orders[j].orderType) {
                        res = false;
                        break;
                    } else {
                        res = true;
                    }
                }
                if (!(getFlightPsgStatusObj(gaiOrderStatuConvert[airline.gaiOrder.chaStatus]).state == StateStyle.SUCCESS)) {
                    res = false;
                }
            }
            return res;
        },
        /**
             * 平价改签单独支付保险
             * @param airline 航班信息
             */
        toPayIns(airline) {
            let that = this;
            //标识补款时不需要验价
            airline['isInsAddMoney'] = true;
            airline['realAddMoneyAmount'] = airline.gaiOrder.realAddMoneyAmount;
            airline.gaiOrder.chaOrderNo = airline.gaiOrder.unPaidOrderNos[0].orderNo;
            that.$emit('toPay', airline);
        },
        /**
             * 是否展示补款模块
             * @param airline 航班信息
             */
        showAddMoney(airline) {
            if (!airline.isGaiOrder || !airline.gaiOrder || airline.gaiOrder.chaStatus != 5) { //TODO  这里是硬编码，以后要改！
                return false;
            }
            let realAddMoneyAmount = airline.gaiOrder.realAddMoneyAmount;
            airline.realAddMoneyAmount = realAddMoneyAmount;//同时给航班添加补款金额的属性
            if (realAddMoneyAmount != 0) {
                this.countdown(airline.gaiOrder.remainPayTime, airline.airLineID);
                this.$emit('loadPay')
            }
            return realAddMoneyAmount != 0;
        },

        /**
             * 倒计时函数
             * @param remainPayTime 支付剩余时间，若已经没有时间则为0
             * @param key 航班号
             */
        countdown(remainPayTime, key) {
            const that = this;
            //如果该航班已存在倒计时（注意要用typeof判断），则返回。否则会陷入死循环（每次刷新倒计时，都会重新执行一次showAddMoney方法）
            if (typeof that.flightRemaining[key] == 'undefined') {
                that.flightRemaining[key] = {}
            } else {
                return;
            }
            if (typeof that.flightTimeInterval[key] == 'undefined') {
                that.flightTimeInterval[key] = {}
            } else {
                return;
            }
            if (!!remainPayTime) {
                that.$emit('isNeedAddMoney', true)
                if (!that.flightRemaining) {
                    that.flightRemaining = {}
                }
                let step = 1;//时间减少的步长
                that.$set(that.flightRemaining, key, remainPayTime);
                that.$emit('setLimitTime', remainPayTime)
                that.$set(that.flightTimeInterval, key, setInterval(function () {
                    let remainingTime = that.flightRemaining[key];
                    if (!!remainingTime) {
                        if (remainingTime / step <= 1) {
                            that.$emit('reload');
                            that.clearCountdown(key);
                        } else {
                            that.$set(that.flightRemaining, key, remainingTime - step);
                            that.$emit('setLimitTime', that.flightRemaining[key])
                            that.$forceUpdate();
                        }
                    } else if (that.flightRemaining[key]) {
                        that.clearCountdown(key);
                    }
                }, 1000));
            } else {
                that.clearCountdown(key);
            }
        },
        /**
             * 停止倒计时
             * @param key 航班号
             */
        clearCountdown(key) {
            const that = this;
            //如果key为空，就清空所有倒计时
            if (!!that.flightTimeInterval && !key) {
                Object.keys(that.flightTimeInterval).forEach((keys) => {
                    that.clearCountdown(keys);
                })
                return;
            }
            clearInterval(that.flightTimeInterval[key]);
            that.$set(that.flightTimeInterval, key, null);
            that.$set(that.flightRemaining, key, null);
            that.$emit('setLimitTime', null)
            that.$forceUpdate();
        },
        /**
                    * 补款
             * @parm airline 航班对象
             */
        toPay(airline) {
            if (!this.flightRemaining[airline.airLineID]) {
                return;
            }
            //非保险单独支付
            airline['isInsAddMoney'] = false;
            this.$emit('toPay', airline);
        },
        /**
             * 取消改签
             */
        cancelEndorse(orderNo) {
            this.$emit('cancelOrder', orderNo);
        },
        /**
             * 获取个人保险状态，是否展示改签、退票未退保，或退保失败的提示信息
             */
        getUserInsType(psg) {
            // let _this = this;
            let res = false;
            // if(!!psg.insuranceOrders){
            //     let insuranceOrders = psg.insuranceOrders || [];
            //     let insuranceOrderLength = insuranceOrders.length;
            //     if (!!insuranceOrders || 0 < insuranceOrderLength) {
            //         for (let i = 0; i < insuranceOrderLength; i++) {
            //             let status = insuranceOrders[i].insuranceChildOrder.status;
            //             if(insuranceStatus[status].infoCardShowTips){
            //                 res = true;
            //                 break;
            //             }
            //         }
            //     }                    
            // }
            // //判断改签类型1改期，2升舱，3其他
            // if(_this.getPsgStatuType(psg.status)=='1'){//改签类型
            //     let gaiOrder = (psg.gaiOrderList||[]);
            //     let length = gaiOrder.length;
            //     for (let i = 0; i < length; i++) {
            //         if(!gaiOrderTypeMap[gaiOrder[i].chaType].showQuitIns){
            //             res = false;
            //             break;
            //         }
            //     }
            // }
            if (!!psg.hasInsNotQuit) {
                res = true;
            }

            return res;
        },
        /**
             * 获取个人保险状态，是否有改签未退保
             * @parm psg 乘客对象
             * @parm type 退or改类型对应的tips的key
             */
        getUserInsTips(psg, isGai) {
            // let _this = this;
            let res = '';
            let type = isGai ? 'gaiTips' : 'tuiTips';
            let haveCanCancel = false;
            // let haveQuitAbnormal = false;
            if (!!psg.insuranceOrders) {
                let insuranceOrders = psg.insuranceOrders || [];
                let insuranceOrderLength = insuranceOrders.length;
                if (!!insuranceOrders || 0 < insuranceOrderLength) {
                    for (let i = 0; i < insuranceOrderLength; i++) {
                        let status = insuranceOrders[i].insuranceChildOrder.status;
                        if (insuranceStatus[status].canCancel) { //有可取消的单子
                            res = insuranceStatus[status][type];
                            haveCanCancel = true;
                            break;
                        }
                    }
                    if (!haveCanCancel) {
                        for (let i = 0; i < insuranceOrderLength; i++) {
                            let status = insuranceOrders[i].insuranceChildOrder.status;
                            if (insuranceStatus[status].infoCardShowTips) { //有退保异常的单子
                                res = insuranceStatus[status][type];
                                haveCanCancel = true;
                                break;
                            }
                        }
                    }
                }
            }
            return res;
        },
        /**
             * 获取平价改签待支付保险的信息
             */
        getGaiInsPayTips() {
            let that = this;
            let res = '';
            let insOrders = this.airline.gaiOrder.unPaidOrderNos;
            for (let i = 0; i < insOrders.length; i++) {
                let index = that.indexOfArr(insOrders[i].orderNo, this.insuranceOrders, 'orderNo');
                if (i == (insOrders.length - 1)) {
                    res += (this.insuranceOrders[index].insuredCount + '份' + this.insuranceOrders[index].insuranceProduct.productShortName);
                } else {
                    res += (this.insuranceOrders[index].insuredCount + '份' + this.insuranceOrders[index].insuranceProduct.productShortName + '和');
                }
            }
            return res;
        },
        /**
            * 元素在数组中的索引
            */
        indexOfArr(val, arr, key) {
            for (var i = 0; i < arr.length; i++) {
                if (!!key ? arr[i][key] == val : arr[i] == val) {
                    return i;
                }
            }
            return -1;
        },
        async copyTicketNumber(ticketNumber) {
            // 不管同步异步，暂且都await 
            if (await SnUtils.copyText(ticketNumber)) {
                SnUtils.showToast('复制成功');
            }

        }
    },
    watch: {
    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/orderDetail/flight/flightInfoCard.less';

.passenger-name {
    font-size: 0.30rem;
    font-weight: bold;
}

.ticket-number-wrapper {
    font-size: 0.26rem;
    line-height: 0.36rem;

    .ticket-number {
        width: 3rem;
        display: inline-block;
        color: #999999;
    }

    .ticket-number-copy {
        display: inline-block;
        color: #222222;
        margin-left: 0.16rem;
        font-weight: bold;
        font-family: PingFangSC, PingFangSC-Medium;
    }
}
</style>