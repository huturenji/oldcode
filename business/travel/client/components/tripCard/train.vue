<template>
<div>
    <div class='list'>
        <div class="type">
            <div class="card-date card-date-train" :class="{flowId: trip.flowId}">
                <div class="left">{{train.beginDate && handleDate(train.beginDate)}}<span class="week">{{train.beginDate | getWeek}}</span></div>
                <div v-if="isPC && enableDelete" @click="deleteOrder((train||{}).orderNo,train,trip,isHis)"  class="delete_order">删除</div>
            </div>
        </div>
      <div class="full train card-shadow">
          <swipeout>
                <swipeout-item :disabled='!enableSwiper || !enableDelete'>
                    <div slot="right-menu">
                        <swipeout-button class="cursorp delete_btn" @click.native="deleteOrder((train||{}).orderNo,train,trip,isHis)">
                            <div class="delete_part">
                                <icon type="icon_mall_delete" size=".34"/>
                            </div>
                        </swipeout-button>
                    </div>
                    <!-- OriginalOrderNo代表原始订单号不是改签的 -->
                    <div slot="content" class="trainDetail detailCard cursorp" @click="openOrderDetail((train.originalOrderNo)?(train.originalOrderNo):(train.orderNo))">
                        <div class="leave">
                            <div class="code">
                                <i><icon type="icon_train_train" size=".36"/></i>
                                <span>{{train.travelMessage ? (train.travelMessage + '次列车') : '火车票' }}</span>
                            </div>
                            <div v-if="!isHis" class="time" :class="{isEnd:remainTime(train)=='已结束'}">
                                {{remainTime(train)}}
                            </div>
                        </div>
                        <div class="content content-train">
                            <div class="stage">
                                <div class="station">
                                    <div class="time num-font">{{(train||{}).beginTime}}</div>
                                    <div class="city">{{(train||{}).beginStation}}</div>
                                </div>
                                <div @click.stop="showTimeListFun(train)" class="arrow">
                                    <div class="trainNo"></div>
                                    <div class="runtime">{{countTime(train)}}</div>
                                </div>
                                <div class="station">
                                    <div class="time num-font">{{(train||{}).arriveTime}}</div>
                                    <div class="city">{{(train||{}).arriveStation}}</div>
                                </div>
                            </div>

                            <!-- 订单中显示人员信息 -->
                            <slot name="psgList"></slot>
                        </div>
                    </div>
                </swipeout-item>
          </swipeout>
        </div>
        <!-- 列车时刻表的弹窗 -->
        <div v-transfer-dom>
            <div v-if="showTimeList" >
                <div class="mask"></div>
                <div class="wrap wrap_container">
                    <div class="time-box">
                        <div class="top">
                            <div class="title">
                                列车时刻<div class="closeicon" @click="showTimeList = false"></div>
                            </div>
                            <ul class="header flex">
                                <li>车站</li>
                                <li>到站</li>
                                <li>发车</li>
                                <li>停留</li>
                            </ul>
                        </div>
                        <div class="content">
                            <ul class="flex" :class="{selected:((item.StationName == (train||{}).beginStation) || (item.StationName == (train||{}).arriveStation))}" v-for="(item, index) in timeList" :key="index">
                                <li>{{item.stationName}}</li>
                                <li>{{item.arriveTime || ''}}</li>
                                <li>{{item.startTime}}</li>
                                <li>{{item.stopoverTime > 0 ? (item.stopoverTime + '分钟') : '----'}}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- loading -->
        <!-- <div v-transfer-dom>
           <loading :show="showLoading" :text="text"></loading>
        </div> -->
    </div>
</div>
</template>

<script>
import icon from 'components/icon';
import extendUtils from './utils';
import tripHandler from './requestHandler';
import { Swipeout, SwipeoutItem, SwipeoutButton, TransferDom} from 'vux';
export default {
    directives: {TransferDom},
    components: {
        Swipeout,
        SwipeoutItem,
        SwipeoutButton,
        icon
    },
    watch:{
        showTimeList(val){
            document.body.style.overflow = !!val ? 'hidden' : 'auto'; 
            //兼容部分安卓机型火车票查询列车时刻弹窗，整体页面跟着滚动的问题
            let dom = document.getElementsByClassName('child-view')[0];
            if (!!dom){
                dom.style.overflow = !!val ? 'hidden' : 'auto'
            }
        }
    },
    data(){
        return {
            isPC: extendUtils.isPC(), 
            showTimeList: false, //判断是否显示列车时刻表
            showLoading: false,
            text: '数据加载中...',
            timeList: []
        }
    },
    props:{
        enableDelete: {
            type: Boolean,
            default: true, 
        },
        enableSwiper: {
            type: Boolean,
            default: !extendUtils.isPC() 
        },
        train:{
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
        },
        formatRuntime(value){
            if (!value) {
                return '';
            }
            let minute = value % 60;
            minute = minute ? extendUtils.addZero(value % 60) : 0;
            return parseInt(value / 60)+"小时"+minute+"分钟";
        }
    },
    methods:{
        //打开列车时刻表
        showTimeListFun(train){
            let that = this;
            let param = {
                trainCode: train.travelMessage || '',
                fromStation: train.beginStation || '',
                toStation: train.arriveStation || '',
                queryDate: train.beginDate
            }
            that.showLoading = true;
            tripHandler.getTrainLineByTrainNo(param).then(res=>{                    
                that.showLoading = false;
                if (res.resultCode == 0 && res.result){
                    that.timeList = res.result.siteList;
                    that.showTimeList = true;
                }
            }).catch(e=>{
                that.showLoading = false;
                console.log(e);
            })
        },
        /**
         * 打开订单详情
         * @param {Object} orderNo 订单号
         */
        openOrderDetail(orderNo){
            extendUtils.openOrderDetail('train',orderNo,this.isSelf,this.founderName);
        },
        /**
             * 计算剩余时间
             * @param {Object} orderInfo   订单信息
             */
        remainTime(orderInfo){
            let beginTime = new Date(orderInfo.beginDate + ' ' + orderInfo.beginTime).getTime();
            let endTime = new Date(orderInfo.arriveDate + ' ' + orderInfo.arriveTime).getTime();
            return extendUtils.countTime(new Date().getTime(), beginTime, endTime, 'train');
        },
        /**
               * 计算相隔时间
               * @param {Object} orderInfo  订单信息
               */
        countTime(orderInfo){
            let beginTime = new Date(orderInfo.beginDate+' '+orderInfo.beginTime).getTime();
            let arriveTime = new Date(orderInfo.arriveDate+' '+orderInfo.arriveTime).getTime();
            let resTime = extendUtils.runTime(beginTime,arriveTime);
            return resTime?'约'+resTime:'';
        },
        /**
             * 时间转换为年月
             * @param {Object} date  时间
             */
        handleDate(date) {
            return extendUtils.handleDate(date);
        },
        /**
         * 删除订单
         */
        deleteOrder(orderNo,train,trip,isHis){
            let judgeTime = this.remainTime(train);//判断该订单是否是已结束的
            tripHandler.deleteOrderFun('train',train,trip,judgeTime,isHis);
        }
    }
}
</script>

<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
.trainDetail {
    .stage {
        display: flex;
        justify-content: space-between;
        .station {
            text-align: center;
            flex: 1;
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
                font-size: 28px;
                line-height: .8rem;
                font-weight: bold;
                margin-bottom: 0.12rem;
            }
            .city {
                display: inline-block;
                text-align: left;
                font-size: .28rem;
                line-height: .4rem;
            }
        }
        .arrow {
            text-align: center;
            margin-top: .3rem;
            width: 1.8rem;
            height: 0.34rem;
            .trainNo {
                width: 1.8rem;
                height: 0.34rem;
                background: url(./img/icon_train_shikebiao@2x.svg) center no-repeat;
                background-size: 100%;
                &:active{
                    opacity: .8;
                }
            }
            .runtime{
                font-size: .24rem;
                line-height: .44rem;
                margin-top: .08rem;
                color:@sub-background-color;
            }
           
        }
    }
}
</style>