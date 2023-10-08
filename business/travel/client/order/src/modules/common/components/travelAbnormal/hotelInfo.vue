<template>
    <div class="hotel-info-container">
        <div class="textBig">{{hotel.hotelName}}</div>
        <div class="fContent">
            <div>
                <Icon type='icon_common_calendar' size='.26'/>
                <span>{{new Date(hotel.inDate).format('MM月dd日')}}</span>
                <span class='label'>入住</span>
                <span class='split'>-</span>
                <span>{{new Date(hotel.outDate).format('MM月dd日')}}</span>
                <span class='label'>离店</span>
            </div>
            <div>
                <Icon type='check-circle' size='.26'/>
                <span>{{hotel.roomName}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import extendUtils from 'orderCommon/extend.js';
const Icon = ()=>import('components/icon');
export default {
    components: {Icon},
    props: {
        hotel: {
            type: Object,
            default: ()=>{ return {} }
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

    .hotel-info-container{
        display: flex;
        flex-direction: column;
        padding: .4rem .8rem;
        background: #fff;
    }
    .textBig {
        font-size: 0.36rem;
        font-weight: bold;
        margin-bottom: .4rem;
    }

    .fContent {
        &>div{
            display: flex;
            align-items: center;
            margin-bottom: .06rem;

            .icon{
                margin-right: .12rem;
            }

            &>span{
                margin-right: .1rem;
            }
            .label{
                color: @placeholder-color;
            }
        }
    }

</style>
