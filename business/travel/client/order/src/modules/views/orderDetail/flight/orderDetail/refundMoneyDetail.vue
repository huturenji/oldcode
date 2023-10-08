<template>
    <div>
        <div class="wrap-box" v-for="(tuiOrderList,index) in tuiOrderInfo" :key="tuiOrderList.psgIDs">
            <div class="showBox">
                <span class="detailNo" v-if="tuiOrderInfo.length>1">明细{{index+1}}</span>
                <div class="baseDetail">
                    <ul>
                        <li><span>乘机人</span><span>{{tuiOrderFilter(tuiOrderList.psgNames)}}</span></li>
                        <li><span>航班信息</span><span>
                                <p>{{airlineInfo.airLineName+airlineInfo.flightNo}}</p>
                                <p>{{airlineInfo.beginDate | dataFormat}}
                                    {{airlineInfo.beginDate | getWeekDay}}{{airlineInfo.beginTime}}
                                    {{airlineInfo.sAirportName+airlineInfo.sTerminal}}-{{airlineInfo.eAirportName+airlineInfo.eTerminal}}
                                </p>
                            </span></li>
                        <li><span>退票日期</span><span class='loading'>{{tuiOrderFilter(tuiOrderList.appDate) | dateFormat}}</span></li>
                        <li><span>消费金额</span><span class='loading'><span class='rmb' v-if='loading'>&yen;</span>{{tuiOrderFilter(tuiOrderList.partialPayAmount)}}</span></li>
                        <li><span>退票扣减</span><span class='loading'><span class='rmb' v-if='loading'>&yen;</span>{{tuiOrderFilter(tuiOrderList.partialRefundFee)}}</span></li>
                        <li><span>实退金额</span><span class='loading'><span class='rmb' v-if='loading'>&yen;</span>{{tuiOrderFilter(tuiOrderList.partialRefundAmount)}}</span></li>
                    </ul>
                    <div class="linkDetail icon-btn cursorp" @click="getMoreDetail(tuiOrderList)">
                        <!-- <router-link to="/flight/moreDetail">更多详情<span>></span></router-link> -->
                        <div>更多详情</div>
                    </div>
                </div>
            </div>
        </div>
        <div v-transfer-dom>
            <popup v-model="showMoreDetail" height="100%" width="100%" position="right">
                <moreDetail @closeDesc="showMoreDetail = false" ref="moreDetail" :refundDetail="refundDetail"
                    :tuiDetailInfo="currentList" :orderInfo="orderInfo" :airlineInfo="airlineInfo" :originalAirline="originalAirline"></moreDetail>
            </popup>
        </div>
    </div>
</template>
<script>
import extendUtils from 'orderCommon/extend.js';
import {
    TransferDom,
    Popup
} from 'vux';
import requestHandler from 'orderCommon/requestHandler.js';
import moreDetail from "./moreDetail.vue"
export default {
    directives: {
        TransferDom

    },
    mixins: [extendUtils.mixin.tChatEventMixin],
    components: {
        Popup,
        moreDetail
    },
    data() {
        let managerData = extendUtils.stateManager.setData([
            //更多详情'showMoreDetail',
            {
                name: 'showMoreDetail', //退款明细
                show: {
                    title: '退款明细'
                },
                hide: {
                    callback: function () { },
                    title: '退款明细'
                }
            }
        ], this);
        let data = {
            checkPopStatus: false,
            refundDetail: {},
            orderInfo: {},
            airlineInfo: {},
            tuiOrderInfo: {},
            currentList: {},
            originalAirline: {},
            airLineId: (this.$route.query || {}).airLineId
        }
        data = Object.assign(managerData, data)
        return data
    },
    filters: {
        dateFormat(value){
            return value && value.replace(/\//g,'-')
        },
        dataFormat(value) {
            if (!value) {
                return '';
            }
            let date = new Date(value);
            return date.format('MM月dd日');
        },
        getWeekDay(value) {
            if (!value) {
                return '';
            }
            let date = new Date(value);
            return extendUtils.indexToWeek(date.getDay(), 3);
        }

    },
    created() {
        this.getRefundDatail();
        // let that = this
        //注册并监听t信返回事件

        // extendUtils.appBack(function (data) { //点击app返回事件
        //     extendUtils.throttle(function () {
        //         extendUtils.stateManager.closeTopPop(() => {
        //             that.$router.back();
        //         });
        //     }, this);
        // }.bind(this));
    },
    computed: {
        loading(){
            return !this.refundDetail || !this.tuiOrderInfo
        }
    },
    methods: {
        getRefundDatail() {
            const that = this;
            const param = {
                "orderNo": (that.$route.query || {}).orderNo
            };
            requestHandler.getFlightOrderDetail(param).then((res) => {
                that.refundDetail = res.result;
                that.tuiOrderInfo = res.result.tuiOrderList.filter(item => item.refStatus == 6)
                that.orderInfo = res.result.orderBase;
                that.originalAirline = res.result.airLines[0];
                //根据airlineId找到实际退票的航班，可能是原航班，也可能是改签航班
                let airline = null;
                let airLineId = this.airLineId;
                res.result.airLines.some((_airline) => {
                    if (_airline.airLineID == airLineId){
                        airline = _airline;
                        return airline;
                    }
                    _airline.passengers && _airline.passengers.some((psg)=>{
                        let gaiOrder = psg.gaiOrderList && psg.gaiOrderList.length>0 && psg.gaiOrderList[0];
                        if (gaiOrder && gaiOrder.chaFlightInfo.airLineID == airLineId){
                            airline = gaiOrder.chaFlightInfo;
                        }
                        return airline
                    })
                    return airline
                })
                that.airlineInfo = airline;
                
            }).catch(() => { })
        },
        tuiOrderFilter(value) {
            if (this.loading) {
                return '正在获取数据，请稍侯...';
            }
            return value;
        },
        getMoreDetail(tuiOrderList) {
            this.showMoreDetail = true;
            this.currentList = tuiOrderList
        },
        goBackFun(){
            this.$router.back();
        }

    }
}
</script>
<style lang="less" scope>
    @import '~themes/default/styles/common/index.less';
    @import '~styles/mixins/hairLine.less';

    .wrap-box {
        padding: 0 .3rem;

        .detailNo {
            font-size: .28rem;
            margin-bottom: .16rem;
            display: block;
        }

        .showBox {
            margin: .16rem 0 .48rem;
            position: relative;

            .baseDetail {
                background: #fff;
                border-radius: @border-radius-base;
                box-shadow: 0px 4px 30px -4px rgba(125, 155, 250, 0.22);
                padding: .4rem .4rem 0;

                ul li {
                    display: flex;
                    justify-content: space-between;
                    font-size: .28rem;
                    margin-bottom: .3rem;

                    &:nth-child(2) {
                        p {
                            margin-bottom: .14rem;
                        }
                    }
                    .loading{
                        color: @placeholder-color;
                    }
                    span {
                        display: inline-block;

                        &:nth-child(1) {
                            flex-basis: 2rem;
                            text-align: left;
                            color: @third-text-color;
                            flex: none;
                        }

                        &:nth-child(2) {
                            text-align: right;
                        }
                    }
                }
            }

            .linkDetail {
                .btpx(1px, @border-color-base);
                display: flex;
                align-items: center;
                justify-content: center;
                height: 1rem;
                margin-top: .1rem;
                color: @theme-color;
                font-size: .28rem;
                text-align: center;
            }
        }
    }
</style>
