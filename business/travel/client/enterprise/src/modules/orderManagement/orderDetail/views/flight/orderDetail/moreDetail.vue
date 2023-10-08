<template>
    <div class="moreDetailBox">
        <div class="contentBox">
            <ul>
                <li>
                    <span>项目</span>
                    <span>消费金额</span>
                    <span>退票扣减</span>
                    <span>实退金额</span>
                </li>
                <li>
                    <span>机票</span>
                    <span>{{map['0'].partialPayAmount|amountFilter}}</span>
                    <span>{{map['0'].refundFee|amountFilter}}</span>
                    <span>{{map['0'].partialRefAmount|amountFilter}}</span>
                </li>
                <li>
                    <span>改签费</span>
                    <span :class="{'sty':styFilter(1)}">{{map['1'].partialPayAmount|amountFilter}}</span>
                    <span :class="{'sty':styFilter(1)}">{{map['1'].refundFee|amountFilter}}</span>
                    <span :class="{'sty':styFilter(1)}">{{map['1'].partialRefAmount|amountFilter}}</span>
                </li>
                <li>
                    <span>出行保险</span>
                    <span :class="{'sty':styFilter(2)}">{{map['2'].partialPayAmount|amountFilter}}</span>
                    <span :class="{'sty':styFilter(2)}">{{map['2'].refundFee|amountFilter}}</span>
                    <span :class="{'sty':styFilter(2)}">{{map['2'].partialRefAmount|amountFilter}}</span>
                </li>
                <li>
                    <span>快递</span>
                    <span :class="{'sty':styFilter(3)}">{{map['3'].partialPayAmount|amountFilter}}</span>
                    <span :class="{'sty':styFilter(3)}">{{map['3'].refundFee|amountFilter}}</span>
                    <span :class="{'sty':styFilter(3)}">{{map['3'].partialRefAmount|amountFilter}}</span>
                </li>
                <li>
                    <span>优惠券</span>
                    <span :class="{'sty':styFilter(4)}">{{map['4'].partialPayAmount|amountFilter}}</span>
                    <span :class="{'sty':styFilter(4)}">{{map['4'].refundFee|amountFilter}}</span>
                    <span :class="{'sty':styFilter(4)}">{{map['4'].partialRefAmount|amountFilter}}</span>
                </li>
                <li>
                    <span>总计</span>
                    <span>￥{{_tuiDetailInfo.partialPayAmount}}</span>
                    <span>￥{{_tuiDetailInfo.partialRefundFee}}</span>
                    <span>￥{{_tuiDetailInfo.partialRefundAmount}}</span>
                </li>
            </ul>
        </div>
        <div class="refundRule">
            <div class='title'>退票须知</div>
            <div>

                <p>1.机票、改签费退款标准按航司规定执行，具体请查看<span class='cursorp icon-btn link-btn' @click="showDescription=true">
                        退改/行李额；</span></p>


                <p>2.出行保险需在航班起飞当日 00:00前办理退保，过期不可办理；</p>


                <p>3.若退票后未邮寄报销凭证，将退还快递费用；</p>

            </div>
        </div>
        <div v-transfer-dom>
            <div class='cust-mask' v-if='showDescription' @click='showDescription=false'></div>
            <Popup v-model="showDescription" class='pop-up guest-rule-pop' position="bottom" :show-mask='false' height="80%" width="100%">
                <Description v-if="showDescription" @closeDesc="showDescription = false" :cabin="{fare: originalAirline.fare}" :cabinRules="originalAirline.guestRule" :providerName="orderInfo.providerShortName" :bodyLock="showDescription" />
            </Popup>
        </div>
    </div>
</template>
<script>
import extendUtils from 'orderCommon/extend.js';
import {
    TransferDom,
    Popup
} from 'vux';
import Description from 'components/flightticketrule/description';
export default {
    directives: {
        TransferDom
    },
    components: {
        Popup,
        Description
    },
    props: {
        refundDetail: Object,
        tuiDetailInfo: Object,
        tuiOrderInfo: Object,
        orderInfo: Object,
        airlineInfo: Object,
        originalAirline: Object
    },
    data() {
        return Object.assign(extendUtils.stateManager.setData([{
            name: 'showDescription',
            parent: '$refs.moreDetail'
        }]), {
            _tuiDetailInfo: !!this.tuiDetailInfo && Object.keys(this.tuiDetailInfo).length>0 ? this.tuiDetailInfo : {},
            map: {
                '0': { partialPayAmount: '- -', partialRefAmount: '- -', refundFee: '- -' },
                '1': { partialPayAmount: '- -', partialRefAmount: '- -', refundFee: '- -' },
                '2': { partialPayAmount: '- -', partialRefAmount: '- -', refundFee: '- -' },
                '3': { partialPayAmount: '- -', partialRefAmount: '- -', refundFee: '- -' },
                '4': { partialPayAmount: '- -', partialRefAmount: '- -', refundFee: '- -' }
            }
        })
    },
    created() {
    },
    methods: {
        styFilter(value) {
            if (!this._tuiDetailInfo.refundChildOrders) {
                return;
            }
            return !this._tuiDetailInfo.refundChildOrders.some(item => item.orderType == value)
        }
    },
    watch: {
        tuiDetailInfo: function (newvalue) {
            this._tuiDetailInfo = newvalue;
            this.map = {
                '0': { partialPayAmount: '- -', partialRefAmount: '- -', refundFee: '- -' },
                '1': { partialPayAmount: '- -', partialRefAmount: '- -', refundFee: '- -' },
                '2': { partialPayAmount: '- -', partialRefAmount: '- -', refundFee: '- -' },
                '3': { partialPayAmount: '- -', partialRefAmount: '- -', refundFee: '- -' },
                '4': { partialPayAmount: '- -', partialRefAmount: '- -', refundFee: '- -' }
            };
            this._tuiDetailInfo.refundChildOrders.forEach(item => {
                //循环item  判断item值，clr
                this.map[item.orderType + ''] = item;
                this.$forceUpdate();
            });
        }
    },
    filters: {
        amountFilter(num) {
            if (num >= 0) {
                return "￥" + num;
            } else if (num < 0) {
                return "-￥" + (-num);
            }
            return num;
        }
    }

}
</script>
<style lang="less" scoped>
    @import '~themes/default/styles/common/index.less';
    @import '~styles/mixins/hairLine.less';

    .moreDetailBox {
        height: 100%;
        background: @background-color;

        .contentBox {
            margin-bottom: .38rem;
            background-color: #fff;

            ul {
                padding: .36rem .3rem .1rem;
                li {
                    color: @text-color;
                    display: flex;
                    font-size: .28rem;
                    margin-bottom: .3rem;

                    &:nth-child(1) {
                        color: @third-text-color;
                    }

                    span {
                        flex: 1;
                        text-align: center;

                        &:nth-child(1) {
                            text-align: left;
                        }

                        &:last-of-type {
                            text-align: right;
                        }

                        &.sty {
                            color: @placeholder-color;
                        }
                    }
                }
            }
        }

        .refundRule {
            margin: 0 .3rem;
            color: @info-color;
            font-size: .26rem;
            .link-btn {
                cursor: pointer;
            }

            .title {
                font-weight: bold;
                margin-bottom: .1rem;
            }

            div {
                p {
                    margin-bottom: .08rem;
                    &:nth-child(1) {
                        span {
                            color: @theme-color;
                        }
                    }
                }
            }
        }

    }
    .cust-mask{
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        tap-highlight-color: rgba(0, 0, 0, 0);
        z-index: 501;
        transition: opacity 400ms;
    }
</style>
