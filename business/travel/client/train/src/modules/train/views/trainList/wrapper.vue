<template>
    <div>

        <div class="atten_wrapper">
             <!--页面顶部标题栏-->
            <div class="tripDate">
                <div  class="arrow cursorp" :class="{'none':noYesterday}"><icon type='icon_common_leftarrow' size='.24'></icon>前一天</div>
                <div class="date cursorp" >
                <div><icon type='calendar' size='.32'></icon>{{startDateStr+' '+startWeekStr}}</div>
                </div>
                <div class="arrow right cursorp" :class="{'none':noFutrueday}">后一天<icon type='icon_common_rightarrow' size='.24'></icon></div>
            </div>
            <!--页面中部的车次列表-->
            <div class="list" id="list">
                <div class="train" v-for="(train,index) in trainList" :key="index">
                    <div class="trainLabel">
                        <div class="trainDetail">
                            <div class="station">
                                <div class="time animated-background"></div>
                                <div class="adress animated-background"></div>
                            </div>
                            <div class="arrow">
                                <div class="content animated-background"></div>
                            </div>
                            <div class="station toRight">
                                <div class="time animated-background"></div>
                                <div class="adress animated-background"></div>
                            </div>
                            <div class="miniPrice">
                                <p class="animated-background"></p>
                            </div>
                        </div>
                    </div>
                    <div class="banning animated-background"></div>
                </div>
                
            </div>
        </div>

      

    </div>
</template>
<script>
    import icon from "components/icon/index.vue"
    import trainHandler from 'trainHandler/common/lib/trainHandler.js';
    export default {    
        data:function () {
            return {
                trainList: [
                    {index:1},
                    {index:2},
                    {index:3},
                    {index:4},
                    {index:5},
                    {index:6},
                    {index:7},
                    {index:8},
                    {index:9},
                    {index:10}
                ],
                startDateStr: '', //订票的日期，用于显示
                startWeekStr: '', //订票的星期，用于显示
            }
        },
        components:{
            icon
        },
        mounted() {
        },
        created () {
            let that = this
            that.setDate();
        },
        methods: {
             /**
             * 设置显示的日期
             */ 
            setDate(){
                let that = this;
                //设置页面一些显示数据，日期
                that.searchDate = trainHandler.getStorage('startDate');
                that.startDateStr = new Date(that.searchDate).format('MM月dd日');
                that.startWeekStr = trainHandler.indexToWeek(new Date(that.searchDate).getDay(), 1);
            },
            
        },
    }
</script>
<style lang="less" scoped>
 @import '~themes/default/styles/skeletonList.less';
</style>