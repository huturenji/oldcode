<template>
    <div class="page-flight-times">
        <header :class="{disable: item.disableStyle, 'linear-gra-primary-light': !item.isGaiOrder, 'linear-gra-waring': item.isGaiOrder}">
            <div class="airline-info">
                <airlogo class='icon' :airCode="item.airLineCode"/>
                <span class="lable">{{item.airLineName+item.flightNo}}</span>
                <span class="lable">{{item.beginDate | dataFormat}}</span>
                <span class="lable">{{item.beginDate | getWeekDay}}</span>
            </div>
            <div v-if='item.share' class="share-flight">
                <div class="angle-line"></div>
                [实际承运] {{item.shareAirlineName}}{{item.shareFlightNo}}
            </div>
            <div class="air-info">
                <div class="time num-font">
                    <div>{{item.beginTime}}</div>
                    <div>{{item.arriveTime}}</div>
                </div>
                <div class="airport">
                    <div>{{item.sAirportName}}{{item.sTerminal}}</div>
                    <div>{{item.eAirportName}}{{item.eTerminal}}</div>
                </div>
                <div class="arrow">
                    <div>约{{item.duration}}</div>
                    <div class="icon"></div>
                        <div v-if='item.stopNum>0'>
                            经停 {{item.stopItems[0].stopCityName}}{{item.stopItems.length>1?(','+item.stopItems[1].stopCityName):''}}
                    </div>
                </div>
            </div>
            <div class="airline-info-bottom">
                <span>{{item.planeType}}</span>
                <span class="split"></span>
                <span>{{item.hasMeal ? '有餐饮' : '无餐饮'}}</span>
            </div>
        </header>
    </div>
</template>

<script>
import extendUtils from 'orderCommon/extend.js';
import airlogo from 'components/airlogo/airlogo.vue'
export default {
    components: {
        airlogo
    },
    props: ['item', 'iconType'],
    data() {
        return {
            iconName: null
        }
    },
    filters: {
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
    mounted() {
    },
    methods: {
    },
    watch: {
    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/orderDetail/flight/flightTimesComp.less';
</style>
