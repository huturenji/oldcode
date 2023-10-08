<template>
    <div class='list'>
        <div class="type">
            <div class="card-date card-date-hotel" :class="{flowId: trip.flowId}">
                <div class="left">{{hotel.beginDate && handleDate(hotel.beginDate)}}<span class="week">{{hotel.beginDate | getWeek}}</span></div>
                <div v-if="isPC && enableDelete" @click="deleteOrder((hotel||{}).orderNo,hotel,trip,isHis)" class="delete_order">删除</div>
            </div>
        </div>
        <div class="full hotel card-shadow">
            <swipeout>
                <swipeout-item :disabled='!enableSwiper || !enableDelete'>
                    <div slot="right-menu">
                        <swipeout-button class="cursorp delete_btn" @click.native="deleteOrder((hotel||{}).orderNo,hotel,trip,isHis)">
                            <div class="delete_part">
                                <icon type="icon_mall_delete" size=".34"/>
                            </div>
                        </swipeout-button>
                    </div>
                    <div slot="content"  class="hotelDetail detailCard cursorp" @click="openOrderDetail(hotel.orderNo)">
                        <div class="leave">
                            <div class="code">
                                 <i><icon type="icon_hotel_hotel" size=".36"/></i>
                                <span>酒店</span>
                            </div>
                            <div v-if="!isHis" class="time" :class="{isEnd:remainTime(hotel)=='已结束'}">
                                {{remainTime(hotel)}}
                            </div>
                        </div>
                        <div class="content content-hotel">
                            <div class="hotel">{{hotel.travelMessage}}</div>
                            <div class='dataRange'>
                                <div class="live_start">
                                    <!-- {{handleDate2Month(hotel.beginDate)}} -->
                                    <div class="date_hotel">
                                        <span class="num num-font">{{new Date(hotel.beginDate).format('MM')}}</span>
                                        <span>月</span>
                                        <span class="num num-font">{{new Date(hotel.beginDate).format('dd')}}</span>
                                        <span>日</span>
                                    </div>
                                    <div class="status">{{hotel.beginDate | getWeek}}入住</div>
                                </div>
                                <div class="total">共{{handleTotalDay(hotel)}}晚</div>
                                <div class="live_end">
                                    <!-- {{handleDate2Month(hotel.arriveDate)}} -->
                                    <div class="date_hotel">
                                        <span class="num num-font">{{new Date(hotel.arriveDate).format('MM')}}</span>
                                        <span>月</span>
                                        <span class="num num-font">{{new Date(hotel.arriveDate).format('dd')}}</span>
                                        <span>日</span>
                                    </div>
                                    <div class="status">{{hotel.arriveDate | getWeek}}离店</div>
                                </div>
                            </div>
                            <!-- 订单中显示人员信息 -->
                            <slot name="psgList"></slot>
                        </div>
                        <div class="address">
                            <div class="address_detail">{{hotel.address}}</div>
                            <div class="toMap cursorp" @click.stop="showMap">
                                <icon type="icon_common_location" size=".28"/>
                            </div>
                        </div>
                    </div>
                </swipeout-item>
            </swipeout>
        </div>
    </div>
</template>

<script>
import icon from 'components/icon';
import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux';
import extendUtils from './utils';
import tripHandler from './requestHandler';
export default {
    directives: {},
    components: {
        Swipeout,
        SwipeoutItem,
        SwipeoutButton,
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
        hotel:{
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
        isSelf:{//是否预订人是自己
            type:Boolean,
            default:false
        },
        isHis:{//是否历史形成用的 true代表是历史行程
            type:Boolean,
            default:false
        }
    },
    filters:{
        getWeek(value) {
            if (!!value) {
                try {
                    return extendUtils.genWeek(new Date(value).getDay(), 1);
                } catch (e){
                    return null;
                }
            }
        }
    },
    methods:{
        /**
         * 打开订单详情
         * @param {Object} orderNo    订单号
         */
        openOrderDetail(orderNo){
            tripHandler.openOrderDetail('hotel',orderNo,this.isSelf,this.founderName);
        },
        /**
         * 时间转换为年月
         * @param {Object} date  时间
         */
        handleDate2Month(date) {
            return extendUtils.handleDate2Month(date);
        },
            
        /**
         * 时间转换为年月
         * @param {Object} date  时间
         */
        handleDate(date) {
            return extendUtils.handleDate(date);
        },
        /**
         * 计算总时间天数
         * @param {Object} hotel  酒店信息
         */
        handleTotalDay(hotel) {
            return extendUtils.handleTotalDay(new Date(hotel.beginDate).getTime(),new Date(hotel.arriveDate).getTime());
        },
        /**
         * 计算剩余时间
         * @param {Object} orderInfo   订单信息
         */
        remainTime(orderInfo){
            let beginTime = new Date(orderInfo.beginDate).getTime();
            let endTime = new Date(orderInfo.arriveDate).getTime();
            let todayTime = new Date(new Date().format('yyyy/MM/dd')).getTime();
            if (todayTime == beginTime){
                return '今天入住';
            }
            return extendUtils.countTime(todayTime, beginTime, endTime, 'hotel');
        },
        /**
         * 显示地图
         */
        showMap(){
            let _this = this;
            let url = 'addr?close=1&hotelName='+_this.hotel.travelMessage+"&address="+_this.hotel.address+"&lng="+_this.hotel.lng+"&lat="+_this.hotel.lat;
            extendUtils.showMap('hotel',url);
        },
        /**
         * 删除订单
         */
        deleteOrder(orderNo,hotel,trip,isHis){
            let judgeTime = this.remainTime(hotel);//判断该订单是否是已结束的
            tripHandler.deleteOrderFun('hotel',hotel,trip,judgeTime,isHis);
        }
    }
}
</script>

<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
.hotelDetail {
    .dataRange {
        margin-top: .14rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .live_start, .live_end{
            flex: 1;
            .date_hotel{
                height: .8rem;
                font-size: .24rem;
                color: #fff;
                .num{
                    font-size: 18px;
                    font-weight: bold;
                }
            }
            &.live_end{
                text-align: right;
            }

        }
        .total {
            font-size: .24rem;
            margin-top: 0.26rem;
            color: #fff;
            width: 1.3rem;
            height: 0.4rem;
            line-height: .34rem;
            text-align: center;
            border-bottom: 1px dashed rgba(255, 255, 255, .5);
            padding-bottom: .04rem;
        }
        .status {
            font-size: .24rem;
            color: #fff;
            line-height: .34rem;
        }
    }
    .roomDetail {
        display: flex;
        justify-content: flex-start;
        color: #fff;
        font-size: .26rem;
        margin: 0 .1rem;
        div{
            margin: 0;
        }
    }
    .address{
        height: .94rem;
        line-height: .94rem;
        padding: 0 .5rem;
        background-color: @sub-background-color;
        border-radius:0 0 .2rem .2rem;
        font-size: .24rem;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: center;
        .address_detail{
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .toMap{
            display: flex;
            align-items: center;
            &:active{
                opacity: .8;
            }
            .icon_common_location{
                fill: #333;
                margin-left: .04rem;
            }
        }
    }
}
</style>