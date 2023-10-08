<template>
    <div class="train-times-container" :class="{changebg:!!hasChangeOrder}">
        <!-- 改签的图片 -->
        <img v-if="hasChangeOrder" class="gai_img" src="~themes/default/img/orderDetail/icon_plane_chage@2x.svg">
        <header>
            <div class="start-time">
                <div class="date">
                    <span>{{trainDetail.startDate | dataFormat}}</span><span>{{trainDetail.startDate | getWeekDay}}</span>
                </div>
                <div class="time num-font">{{trainDetail.startTime}}</div>
                <div class="station">{{trainDetail.startStation}}</div>
            </div>
            <div class="time-info">
                <div class="train-no">{{trainDetail.trainNo}}</div>
                <div class="icon cursorp" @click="$emit('getTrainLineByTrainNo',trainDetail.trainNo)"></div>
                <div class="duration">{{trainDetail.runTime | formatRuntime}}</div>
            </div>
            <div class="end-time">
                <div class="date"><span>{{endDate | dataFormat}}</span><span>{{endDate | getWeekDay}}</span></div>
                <div class="time num-font">{{trainDetail.endTime}}</div>
                <div class="station">{{trainDetail.endStation}}</div>
            </div>
        </header>
        <!-- 取票号/检票口信息 -->
        <div class="qu_no" v-if="!!trainDetail.ticketGate || !!trainDetail.ticketNo">
            <span v-if="!!trainDetail.ticketNo">取票号：{{trainDetail.ticketNo}}</span>
            <span v-if="!!trainDetail.ticketGate">检票口：{{trainDetail.ticketGate}}</span>
        </div>
    </div>
</template>

<script>
import extendUtils from 'orderCommon/extend.js';
export default {
    components: {

    },
    props: {
        trainDetail: {
            type: Object
        },
        hasChangeOrder: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            startDateStr: null,
            startWeekStr: null,
            startGoTime: null,
            endDataDtr: null,
            endWeekStr: null,
            endGoTime: null,
            Runtime: null
        }
    },
    computed: {
        endDate: function () {
            if (!this.trainDetail || !this.trainDetail.startDate) {
                return '';
            }
            let endTime = (new Date(this.trainDetail.startDate + " " + this.trainDetail.startTime).getTime()) + this.trainDetail.runTime * 1000 * 60;
            return new Date(endTime).format("yyyy/MM/dd");
        }
    },
    filters: {
        formatRuntime(runTime) {
            if (!runTime) {
                return '';
            }
            let minute = runTime % 60;
            minute = minute ? extendUtils.addZero(runTime % 60) : 0; //前位补0
            return parseInt(runTime / 60) + '小时' + minute + '分钟'
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
    watch: {
    },
    mounted() {

    },
    methods: {
    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/common/index.less';
    @import '~styles/mixins/mixinsStyle.less';

    * {
        box-sizing: border-box;
    }
    .train-times-container{
        &.changebg{ 
            background: linear-gradient(142deg, #FFC10E 0%, #FFA501 100%);
        }
        padding: .4rem .67rem;
        background: linear-gradient(337deg, #0500A3 0%, #3991F7 100%);
        box-shadow: 0px .04rem .3rem -.04rem rgba(0,70,199,0.18);
        border-radius: .2rem .2rem 0 0;
        color: #fff;
        position: relative;
        .gai_img{
            position: absolute;
            left: 0;
            top: 0;
            width: 0.85rem;
            height: auto;
        }
        .qu_no{
            display: flex;
            justify-content: space-between;
            margin-top: .2rem;
            font-size: .24rem;
        }
    }
  
    header {
        .flex-box;
        .justify-content(space-between);
        .align-items(center);
        color: #fff;

        .start-time,
        .end-time {
            flex: 1;
            text-align: left;

            .date {
                font-size: .28rem;
                line-height: .36rem;
            }

            .time {
                font-size: .67rem;
                font-weight: 600;
                margin: .1rem 0;
            }

            .station {
                font-size: .3rem;
                // font-weight: bold;
            }
        }

        .end-time {
            text-align: right;
        }

        .time-info {
            flex: 1;
            font-size: .24rem;
            line-height: .34rem;
            text-align: center;

            .train-no {
                margin: .01rem 0;
            }

            .icon {
                display: flex;
                align-items: center;
                height: .44rem;
                background: url(~themes/default/img/orderDetail/icon_train_shikebiao@2x.svg) no-repeat center transparent;
                background-size: contain;
            }

            .duration {
                font-size: .24rem;
            }
        }
    }
</style>
