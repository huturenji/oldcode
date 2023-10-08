<template>
    <div>
        
        <div class='list'>
            <div class="type">
                <div class="card-date card-date-flight" :class="{flowId: trip.flowId}">
                    <div class="left">{{AirLine.beginDate && handleDate(AirLine.beginDate)}}<span class="week">{{AirLine.beginDate | getWeek}}</span></div>
                    <div v-if="isPC && enableDelete" @click="deleteOrder((AirLine||{}).orderNo,AirLine,trip,isHis)" class="delete_order">删除</div>
                </div>
            </div>
            <div class="full flight card-shadow">
                <swipeout>
                    <swipeout-item :disabled='!enableSwiper || !enableDelete'>
                        <div slot="right-menu">
                            <swipeout-button class="cursorp delete_btn" @click.native="deleteOrder((AirLine||{}).orderNo,AirLine,trip,isHis)">
                                <div class="delete_part">
                                    <icon type="icon_mall_delete" size=".34"/>
                                </div>
                            </swipeout-button>
                        </div>
                        <!-- OriginalOrderNo代表原始订单号不是改签的 -->
                        <div slot="content" class="flightDetail detailCard cursorp" @click="openOrderDetail((AirLine.originalOrderNo)?(AirLine.originalOrderNo):(AirLine.orderNo))">
                            <div class="leave">
                                <div v-if="AirLine.expansion">
                                    <span class="air_logo">
                                        <airlogo class="logo" :airCode="(AirLine||{}).expansion.airLineCode" />
                                    </span>
                                    <span>{{((AirLine||{}).expansion || {}).airLineName}}</span>
                                    <span>{{((AirLine||{}).expansion || {}).flightNo}}</span>
                                </div>
                                <!-- 兼容老数据服务器未传递Expansion字段 -->
                                <div class="code" v-else>
                                     <i><icon type="icon_plane_plane" size=".36"/></i>
                                    <span>{{(AirLine||{}).travelMessage}}</span>
                                </div>
                                
                                <div v-if="!isHis" class="time" :class="{isEnd:remainTime(AirLine)=='已结束'}">
                                    {{remainTime(AirLine)}}
                                </div>
                            </div>
                            <div class="content content-flight">
                                <div class="trip">
                                    <div class="station">
                                        <div class="time num-font" v-if='AirLine.beginTime'>{{splitTime(AirLine.beginTime)[0]}}<span class="colon">:</span>{{splitTime(AirLine.beginTime)[1]}}</div>
                                        <div class="airport">{{AirLine.beginStation}}</div>
                                    </div>
                                    <div class="arrow">
                                        <span v-if="judgeFlightStopItem(AirLine)" class="time">{{stopItemStr(AirLine)}}</span>
                                        <span v-else class="time"></span>
                                        <div class="icon"></div>    
                                        <span class="time">{{countTime(AirLine)}}</span>
                                    </div>
                                    <div class="station">
                                        <div class="time num-font" v-if='AirLine.arriveTime'>{{splitTime(AirLine.arriveTime)[0]}}<span class='colon'>:</span>{{splitTime(AirLine.arriveTime)[1]}}</div>
                                        <div class="airport">{{AirLine.arriveStation}}</div>
                                    </div>
                                </div>
                                <!-- 订单中显示人员信息 -->
                                <slot name="psgList"></slot>
                            </div>
                        </div>
                    </swipeout-item>
                </swipeout>
            </div>
        </div>
    </div>
</template>

<script>
import icon from 'components/icon';
import extendUtils from './utils';
import tripHandler from './requestHandler';
import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux';
import airlogo from 'components/airlogo/airlogo.vue';
export default {
    directives: {},
    components: {
        Swipeout,
        SwipeoutItem,
        SwipeoutButton,
        airlogo,
        icon
    },
    data(){
        return {
            isPC: extendUtils.isPC() 
        }
    },
    props: {
        enableDelete: {
            type: Boolean,
            default: true, 
        },
        enableSwiper: {
            type: Boolean,
            default: !extendUtils.isPC() 
        },
        AirLine:{
            type:Object,
            default(){
                return {}
            }
        },
        trip:{
            type:Object,
            default(){
                return {};
            }
        },
        founderName:{//其他预订人
            type:String,
            default:''
        },
        orderNo:{//订单号
            type:String,
            default:''
        },
        isSelf:{//是否预订人是自己
            type:Boolean,
            default:false
        },
        isHis:{//是否历史形成用的 true代表是历史行程
            type:Boolean,
            default:false
        }
    },
    mounted() {
    },
    created:function(){
    },
    filters:{
        getWeek(value) {
            if (!!value) {
                try {
                    return extendUtils.indexToWeek(new Date(value).getDay(), 1);
                } catch (e){
                    return null;
                }
            }
        }
    },
    methods:{
        splitTime(time){
            if(!time){
                return ''
            }
            return time.split(':');
        },
        /**
         * 打开订单详情
         */
        openOrderDetail(orderNo){
            tripHandler.openOrderDetail('flight',orderNo);
        },
        /**
         * 计算剩余时间
         * @param {Object} AirLine  航班信息
         */
        remainTime(AirLine){
            let beginTime = new Date(AirLine.beginDate+' '+AirLine.beginTime).getTime();
            let endTime = new Date(AirLine.arriveDate+' '+AirLine.arriveTime).getTime();
            return extendUtils.countTime(new Date().getTime(), beginTime, endTime, 'flight');
        },
            
        /**
         * 时间转换为年月
         * @param {Object} date  时间
         */
        handleDate(date) {
            return extendUtils.handleDate(date);
        },
        /**
         * 计算相隔时间
         * @param {Object} AirLine  航班信息
         */
        countTime(AirLine){
            let beginTime = new Date(AirLine.beginDate+' '+AirLine.beginTime).getTime();
            let arriveTime = new Date(AirLine.arriveDate+' '+AirLine.arriveTime).getTime();
            let resTime = extendUtils.runTime(beginTime,arriveTime);
            return resTime?'约'+resTime:'';
        },
        /**
         * 删除订单
         */
        deleteOrder(orderNo,AirLine,trip,isHis){
            let judgeTime = this.remainTime(AirLine);//判断该订单是否是已结束的
            tripHandler.deleteOrderFun('flight',AirLine,trip,judgeTime,isHis);
        },
        /**
         * 判断机票经停信息是否显示
         */
        judgeFlightStopItem(AirLine){
            let flag = false;
            if (((AirLine||{}).expansion || {}).stopNum > 0 && (AirLine||{}).expansion.stopItems && (AirLine||{}).expansion.stopItems.length > 0){
                flag = true;
            }
            return flag;
        },
        /**
         * 判断机票经停信息显示内容
        */
        stopItemStr(AirLine){
            let stopCityName = (AirLine||{}).expansion.stopItems[0].stopCityName ? ('经停' + (AirLine||{}).expansion.stopItems[0].stopCityName) : '' ;
            let durationTime = (AirLine||{}).expansion.stopItems[0].durationTime ? ((AirLine||{}).expansion.stopItems[0].durationTime + '分钟') : '' ;
            return stopCityName ? (stopCityName + ' ' + durationTime): '';
        }

    }
}
</script>

<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
.logo {
    vertical-align: middle;
}
.flightDetail {
    .date {
        text-align: left;
        font-size: .28rem;
        color: #fff;
        margin-left: .4rem;
    }
    .trip {
        display: -ms-flexbox;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        justify-content: space-between;
        .station {
            flex: 1;
            &:first-of-type{
             text-align: left;
            }
            &:last-of-type{
               text-align: right;
             }
            .airport {
                font-size: .26rem;
            }
            .time {
                font-size: .6rem;
                line-height: .8rem;
                font-weight: bold;
                margin-bottom: 0.1rem;
                .colon{
                    font-size: .4rem;
                }
            }
        }
        .arrow {
            width: 1.8rem;
            height: 0.34rem;
            text-align: center;
            
            .icon{
                margin: .1rem 0;
                width: 1.8rem;
                height: 0.24rem;
                background: url(./img/icon_plane_wjingting@2x.svg) center no-repeat;
                background-size: 100%;
                &:active{
                    opacity: .8;
                }
            }
            .time {
                font-size: .24rem;
                line-height: .34rem;
                display: block;
                color:#fff;
                height: .34rem;
            }
            .code {
                font-weight: 600;
                color: #fff;
            }
        }
    }
}
</style>