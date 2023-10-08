<template>
    <div class="train-info-container">
        <div class="train-info">
            <div class='date'>
                <div>{{train.startDate | dataFormat}} {{train.startDate | getWeekDay}}</div>
                <div>{{endDate | dataFormat}}  {{endDate | getWeekDay}}</div>
            </div>
            <div class="time num-font">
                <div>{{train.startTime}}</div>
                <div>{{train.endTime}}</div>
            </div>
            <div class="station">
                <div>{{train.startStation}}</div>
                <div>{{train.endStation}}</div>
            </div>
            <div class="arrow">
                <div>{{train.trainNo}}</div>
                <div class="icon"></div>
                <div>{{train.seatType}}</div>
            </div>
        </div>
    </div>
</template>
<script>
    import extendUtils from 'trainHandler/common/lib/trainHandler.js';
    export default {
        components: {},
        props: {
            train: {
                type: Object,
                default: ()=>{return {}}
            },
            seatType: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
            }
        },
        computed: {
            endDate: function () {
                if (!this.train || !this.train.startDate) {
                    return '';
                }
                let endTime = (new Date(this.train.startDate + " " + this.train.startTime).getTime()) + this.train.runTime * 1000 * 60;
                return new Date(endTime).format("yyyy/MM/dd");
            }
        },
        filters: {
            getWeekDay(value) {
                if (!value) {
                    return '';
                }
                let date = new Date(value);
                return extendUtils.indexToWeek(date.getDay(), 3);
            },
            getWeekDay(value){
                if (!value) {
                    return '';
                }
                let date = new Date(value);
                return extendUtils.indexToWeek(date.getDay(), 3);
            },
            dataFormat(value) {
                if (!value) {
                    return '';
                }
                let date = new Date(value);
                return date.format('MM月dd日');
            },
        },
        mounted() {
        },
        methods: {
        }
    }

</script>
<style scoped lang="less">
    @import '~styles/core/common.less';

    .train-info-container{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: .4rem 0;
        background: @sub-background-color;
    }

    .train-info{
        width: 100%;
        position: relative;
        padding: 0 .8rem;

        .date{
            position: relative;
            display: flex;
            justify-content: space-between;
            font-size: .3rem;
        }

        .time{
            position: relative;
            display: flex;
            justify-content: space-between;
            font-size: .68rem;
            font-weight: bold;
        }
        .station{
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
            color: @secondary-text-color;

            .icon{
                height: .5rem;
                background: url(~themes/default/img/orderDetail/icon_train_jingting@2x.svg) no-repeat center;
                background-size: contain;
            }
        }
    }
</style>
