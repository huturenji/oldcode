<template>
    <div class='list'>
        <div class="type">
          <div class="card-date card-date-car">
              <div>{{car.beginDate && car.beginDate.replace(/\//g,'-')}}<span class="week">{{car.beginDate | getWeek}}</span>{{' '+car.beginTime}}</div>
              <!-- <slot name="isSelf"></slot> -->
              <div v-if="isPC" @click="deleteOrder((car||{}).orderNo,car,trip,isHis)" class="delete_order">删除</div>
          </div>
        </div>
        <div class="full train">
            <swipeout>
                <swipeout-item :disabled='isPC'>
                    <div slot="right-menu">
                        <swipeout-button class="cursorp delete_btn" @click.native="deleteOrder((car||{}).orderNo,car,trip,isHis)"></swipeout-button>
                    </div>
                    <div slot="content" class="carDetail detailCard cursorp" @click="openOrderDetail((car||{}).orderNo)">
                        <div class="leave">
                            <div>
                                <img class="icon icon-car" src="~assets/img/trip/icon-car.png"/>
                                <span>商务用车</span>
                            </div>
                            <div v-if="!isHis" class="time" :class="{isEnd:remainTime(car)=='已结束'}">
                                {{remainTime(car)}}
                            </div>
                        </div>
                        <div class="content content-car">
                            <div class="top">
                                <span class="car-type">快车</span>
                                <span>[{{' ' + car.travelMessage + ' '}}]</span>
                            </div>
                            <ul class="car-list">
                                <li class="start">{{car.beginStation}}</li>   
                                <li class="end">{{car.arriveStation}}</li>   
                            </ul>
                        </div>
                    </div>
                </swipeout-item>
            </swipeout>
        </div>
    </div>
</template>

<script>
import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux';
import tripHandler from '../tripHandler.js';
export default {
    components: {
        Swipeout,
        SwipeoutItem,
        SwipeoutButton
    },
    data(){
        return {
            isPC: tripHandler.isPC()
        }
    },
    props:{
        car:{
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
                    return tripHandler.genWeek(new Date(value).getDay());
                } catch (e){
                    return null;
                }
            }
        },
        formatRuntime(value){
            if (!value) {
                return '';
            }
            let minute = value % 60;
            minute = minute ? tripHandler.addZero(value % 60) : 0;
            return parseInt(value / 60)+"小时"+minute+"分钟";
        }
    },
    methods:{
        /**
             * 打开订单详情
             * @param {Object} orderNo 订单号
             */
        openOrderDetail(orderNo){
            tripHandler.openOrderDetail('car',orderNo,this.isSelf,this.founderName);
        },
        /**
             * 计算剩余时间
             * @param {Object} orderInfo   订单信息
             */
        remainTime(orderInfo){
            let str = '';
            if (!!orderInfo.arriveDate && !!orderInfo.arriveTime){
                let arriveTime = new Date(orderInfo.arriveDate+' '+orderInfo.arriveTime).getTime();
                let NowTime = new Date().getTime();
                if (arriveTime < NowTime){
                    str = '已结束';
                }
            }
            return str;
        },
        /**
               * 计算相隔时间
               * @param {Object} orderInfo  订单信息
               */
        countTime(orderInfo){
            let beginTime = new Date(orderInfo.beginDate+' '+orderInfo.beginTime).getTime();
            let arriveTime = new Date(orderInfo.arriveDate+' '+orderInfo.arriveTime).getTime();
            let resTime = tripHandler.runTime(beginTime,arriveTime);
            return resTime?'约'+resTime:'';
        },
        /**
               * 删除订单
               */
        deleteOrder(orderNo,car,trip,isHis){
            // let judgeTime = this.remainTime(car);//判断该订单是否是已结束的
            tripHandler.deleteOrderFun('car',car,trip,null,isHis);
        }
    }
}
</script>

<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
.trainDetail {
    .stage {
        display: -ms-flexbox;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        justify-content: space-between;
        .station {
            text-align: center;
            &:first-of-type{
                 text-align: left;
             }
            &:last-of-type{
                 text-align: right;
             }
            span {
                display: flex
            }
            .time {
                font-size: .42rem;
                font-weight: bold;
                text-align: center;
                margin-bottom: 0.1rem;
            }
            .city {
                display: inline-block;
                text-align: left;
                font-size: .26rem;
            }
        }
        .arrow {
            text-align: center;
            margin-top: 0.25rem;
            .trainNo {
                font-size: .26rem;
                line-height: .26rem;
                color:rgba(255,255,255,0.7);
            }
            .runtime{
                font-size: .24rem;
                line-height: .26rem;
                color:rgba(255,255,255,0.7);
            }
            .icon{
                width: 1.51rem;
                height: .1rem;
                margin: .1rem auto;
                background: url(~assets/img/trip/icon_common_arrow1.svg) center no-repeat;
                background-size: 100%;
            }
            img {
                padding: .1rem;
                height: .34rem;
            }
        }
    }
            .seat-info{
            font-size: .26rem;
            padding-left: .1rem;
            color: @text-color;
            span{
                margin-left: .18rem;
            }
        }
}
</style>