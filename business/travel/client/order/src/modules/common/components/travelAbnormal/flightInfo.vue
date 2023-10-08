<template>
    <div class="flight-info-container">
        <div class="title">
            <airlogo class='icon' :airCode="airline.airLineCode"/>
            <span>{{airline.airLineName}}</span>
            <span>{{airline.beginDate}}</span> 
            <span>{{airline.beginDate | getWeekDay}}</span>
            <div>{{airline.cabinName}}</div>
        </div>
        <div class="air-info">
            <div class="time num-font">
                <div>{{airline.beginTime}}</div>
                <div>{{airline.arriveTime}}</div>
            </div>
            <div class="airport">
                <div>{{airline.sAirportName}}{{airline.sTerminal}}</div>
                <div>{{airline.eAirportName}}{{airline.eTerminal}}</div>
            </div>
            <div class="arrow">
                <div class="icon"></div>
            </div>
        </div>
    </div>
</template>
<script>
import extendUtils from 'orderCommon/extend.js';
import airlogo from 'components/airlogo/airlogo.vue'
export default {
    components: {airlogo},
    props: {
        airline: {
            type: Object,
            default: ()=>{ return {} }
        },
        cabinName: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
        }
    },
    created: function () {
    },
    filters: {
        getWeekDay(value){
            if (!value) {
                return '';
            }
            let date = new Date(value);
            return extendUtils.indexToWeek(date.getDay(), 3);
        }
    },
    mounted() {
    },
    methods: {
    }
}

</script>
<style scoped lang="less">
    @import '~themes/default/styles/common/index.less';
    .flight-info-container{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: .4rem 0;
        background: #fff;
    }
    .title {
        font-size: 0.28rem;
        text-align: center;
        display: flex;
        justify-content: space-around;
        position: relative;
        padding-left: calc(~"17px + .05rem");
        margin-bottom: .2rem;
        span{
            margin-right: .2rem;
        }
        .icon-flight{
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
        }
    }

    .air-info{
        width: 100%;
        position: relative;
        padding: 0 .8rem;

        .time{
            position: relative;
            display: flex;
            justify-content: space-between;
            font-size: 34px;
            font-weight: bold;
        }
        .airport{
            color: @third-text-color;
            display: flex;
            justify-content: space-between;
            margin-top: .1rem;
            font-size: .3rem;
        }

        .arrow{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            text-align: center;
            width: 1.58rem;
            height: .32rem;

            .icon{
                height: .5rem;
                background: url(~themes/default/img/orderDetail/icon_plane_jingting_black@2x.svg) no-repeat center;
                background-size: contain;
            }
        }
    }

</style>
