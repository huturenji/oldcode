<template>
    <div class="page-order-process" v-show="openProcess">
        <div class="processMask"></div>
        <div class="processDialog">
            <div class="orderProgress">
                <div class="header"></div>
                <div class="main">
                    <div class="flightDetailNew">
                        <div class="content">
                            <div class="info">
                                <div class="plane">
                                    <airlogo class="logo" :airCode="flightDetail.airCompanyCode"/>
                                    <span>{{flightDetail.airCompanyName}}{{flightDetail.flightNo}}</span>&nbsp;
                                    <span class="split"></span>&nbsp;
                                    <span>{{flightDetail.departDate | dateFormat}}</span>
                                </div>
                                <div v-if='flightDetail.share' class="share-flight">
                                    <span>实际承运&nbsp;{{flightDetail.shareAirlineName}}{{flightDetail.shareFlightNo}}</span>
                                </div>
                            </div>
                            <div class="trip">
                                <div class="station">
                                    <span class="time">{{flightDetail.departTime}}</span>
                                    <span class="airport">{{flightDetail.departAirportName}}{{flightDetail.departAirportTerminal}}</span>
                                </div>
                                <div class="arrow">
                                    <div>
                                        <span class="goDate">约{{flightDetail.duration}}</span>
                                    </div>
                                    <span class="icon"></span>
                                    <div class="through" v-if='flightDetail.stopNum>0'>
                                        <div class="detail">经停
                                            {{flightDetail.stopItems[0].stopCityName}}{{flightDetail.stopItems.length>1?(','+flightDetail.stopItems[1].stopCityName):''}}
                                        </div>
                                    </div>
                                </div>
                                <div class="station">
                                    <span class="time">{{flightDetail.arriveTime}}</span>
                                    <span class="airport">{{flightDetail.arriveAirportName}}{{flightDetail.arriveAirportTerminal}}</span>
                                </div>
                            </div>
                            <div class="plane-type">
                                <span>{{flightDetail.planeType}}</span>
                                <span class="split">|</span>
                                <span>{{flightDetail.hasMeal ? '有餐饮' : '无餐饮'}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="passenger">
                        乘机人：<span class="names" v-for='(name, index) in psgList' :key="index">
                        {{name}}
                    </span>
                    </div>
                </div>
                <div class="bottom">
                    <div class="bottom_tips">正在预订席位，请稍候...</div>
                    <div class="precent">{{privateProcessPrecent}}%</div>
                    <div class='progress' :class="{'grow-process': privateProcessPrecent>0}" ref='progress'></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import extendUtils from 'flightCommon/extend.js';
import airlogo from 'components/airlogo/airlogo.vue'

export default {
    components: {
        airlogo
    },
    props: {
        openProcess: {
            type: Boolean,
            default: false
        },
        flightDetail: {
            type: Object,
            defalut: () => {
            }
        },
        processPrecent: {
            type: Number,
            default: 0
        },
        psgList: {
            type: Array,
            default: () => []
        }
    },
    model: {//绑定v-model
        prop: 'openProcess',
        event: 'closeProcess'
    },
    data() {
        return {
            privateProcessPrecent: this.processPrecent || 0
        }
    },
    watch: {
        processPrecent() {
            this.privateProcessPrecent = this.processPrecent;
        },
        openProcess(_new) {
            if (_new) {
                this.startProcess();
            } else {
                this.closeProcess();
            }
        }
    },
    filters: {
        dateFormat(date) {
            return new Date(date).format('MM月dd日') + "  " + extendUtils.indexToWeek(new Date(date).getDay())
        }
    },
    methods: {
        /**
             * 计算支付进度条
             */
        startProcess() {
            const that = this;
            let interval = setInterval(() => {
                if (that.privateProcessPrecent < 99) {
                    that.privateProcessPrecent++;
                } else {
                    clearInterval(interval);
                }
            }, 100)
        },
        closeProcess() {
            this.$emit('closeProcess');
        }
    }
}

</script>
<style scoped lang="less">
    @import '~themes/default/styles/orderConfirm/orderProcess.less';
</style>
<style lang='less'>
    .page-order-process{
        position:absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        .processMask{
            position: fixed;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 502;
        }
        .processDialog{
            width: 86%;
            max-width: 460px;
            border-radius: 16px;
            z-index: 502;
            pointer-events:all;
            display: block;
            position: initial;
            border-radius: 0.2rem;
            background-color: #FFFFFF;
            overflow: hidden;
            text-align: center;
        }
    }  
</style>
