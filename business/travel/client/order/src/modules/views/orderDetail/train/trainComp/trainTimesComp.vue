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
            <div class="item">
                <span v-if="!!trainDetail.ticketNo">取票号：{{trainDetail.ticketNo}}</span>
                <span v-if="!!trainDetail.ticketGate">检票口：{{trainDetail.ticketGate}}</span>
            </div>
            <div v-if="!!trainDetail.ticketGate" class="item tips">
                - 检票口仅供参考，请以车站实际公布的为准 -
            </div>
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
        padding: .4rem .6rem;
        background: linear-gradient(316deg, #262DD9 0%, #4B52FA 100%);
        box-shadow: -.02rem 0rem .40rem -.04rem rgba(156,159,169,0.1);
        border-radius: .2rem .2rem 0 0;
        color: #fff;
        position: relative;
        .gai_img{
            position: absolute;
            left: 0;
            top: 0;
            width: 1rem;
            height: auto;
        }
        .qu_no{
            padding-top: .2rem;
            margin-top: .2rem;
            
            position: relative;
            &::before{
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                border-top: 1px dashed #fff;

            }
            .item{
                padding: 0 .4rem;
                display: flex;
                font-size: .26rem;
                line-height: .4rem;
                justify-content: space-around;
                span{
                    text-shadow: -.02rem 0rem .4rem rgba(156, 159, 169, 0.1);
                }
                &.tips{
                    padding: 0;
                    font-size: .24rem;
                    line-height: .36rem;
                    justify-content: center;
                    margin-top: .14rem;
                    text-shadow: -.02rem 0rem .4rem rgba(156, 159, 169, 0.1);
                }
            }
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
                font-size: .65rem;
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
