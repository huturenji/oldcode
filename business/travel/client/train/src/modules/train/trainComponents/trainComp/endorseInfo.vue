<template>
  <div class="endorse-container">
    <ul class="content">
      <li>
        <span>乘车人</span>
        <span>{{psgName}}</span>
      </li>
      <li>
        <span>出发地</span>
        <span>{{StartStation}}</span>
      </li>
      <li>
        <span>目的地</span>
        <span>{{EndStation}}</span>
      </li>
      <li class="cursorp" @click="showCanlendar">
        <span>出发时间</span>
        <span class="blue">{{newStartDate | dateFormat}}<icon type="icon_common_rightarrow" size=".24"/></span>
      </li>
      <li>
        <div class="title">
            只看高铁动车
        </div>
        <SnSwitch class='cursorp' slot="right-icon" v-model="trainType" />
      </li>
    </ul>
    <div class="right-des cursorp" @click="gotoTuiGaiRules"><span><icon type="icon_common_prompt" size=".28"/>取票、退票、改签说明</span></div>
    <div class="search-btn cursorp" @click="searchTrain"><div>搜索列车</div></div>

    <!-- 遮罩层：当前页作为子组件引入父组件时，当前popup自带的遮罩层会和父组件的popup遮罩层冲突而不可使用，所以需要自己实现一个 -->
    <!-- <div class="mask cursorp" v-if="showCalendar" @click="showCalendar=false"></div> -->
    <!-- 日历控件 -->
    <div v-transfer-dom>
      <popup v-model="showCalendar" position="bottom" style="max-height: 10rem;background: #ffffff ">
        <div class="calendar">
          <CalendarNewX ref="endorseCalendar" @changeDate="chooseDate" :displayMode="2" :futureDayHide="futureDayHide" :agoDayHide="agoDayHide"></CalendarNewX>
        </div>
      </popup>
    </div>
     <!-- 退改规则 -->
    <div v-transfer-dom>
      <popup v-model="showTuiGaiRule" height="90%" width="100%" position="bottom" class="trainticketrule-des">
        <Description v-if="showTuiGaiRule" @closeDesc="showTuiGaiRule = false" />
      </popup>
    </div>
  </div>
</template>
<script>
    import SnSwitch from "components/switch";
    import trainHandler from 'trainHandler/common/lib/trainHandler.js';
    import Description from 'components/trainticketrule/description.vue';
    import CalendarNewX from "components/calendarNew/CalendarNewX.vue";
    import icon from "components/icon/index.vue"
    import {
        TransferDom,
        Popup,
        XSwitch 
    } from 'vux';
    export default {
        mixins: [trainHandler.mixin.tChatEventMixin],
        directives: {
            TransferDom
        },
        components: {
            CalendarNewX, Popup, XSwitch,Description,icon,SnSwitch
        },
        data: function () {
            return {
                psgName: '',
                StartStation: '',
                EndStation: '',
                StartDate:'',
                newStartDate: null,
                showCalendar:false,
                showCityPop: false, //城市选择控件
                trainType:false,
                showTuiGaiRule:false,
                futureDayHide:new Date(new Date().format('yyyy/MM/dd')).getTime()+29*24*3600000, //最晚的可购票日期
                agoDayHide:new Date(new Date().format('yyyy/MM/dd')).getTime(), 
            }
        },
        filters: {
            dateFormat: function (value) {
                try{
                    let startDate = new Date(value);
                    let dateStr = startDate.format("MM月dd日");
                    let week = trainHandler.indexToWeek(startDate.getDay());
                    return dateStr+" "+week;
                }catch(e){
                    return null;
                }
            }
        },
        watch: {
           StartDate: function (newValue, oldValue) {
              this.newStartDate = newValue;
           },
        },
        created: function () {
          const that = this;
          that.psgName = decodeURIComponent(trainHandler.getUserPara('psgName'));
          that.StartStation = decodeURIComponent(trainHandler.getUserPara('StartStation'));
          that.EndStation = decodeURIComponent(trainHandler.getUserPara('EndStation'));
          that.StartDate = decodeURIComponent(trainHandler.getUserPara('StartDate'));

          //注册并监听t信返回事件
        //   sinosdk.sino.onBack(function(){
        //     if(that.showTuiGaiRule){
        //       that.showTuiGaiRule = false;
        //       document.title = '申请改签';
        //     }else{
        //       sinosdk.sino.back('')  
        //     }
        //   },that)
        },
        mounted() {
        },
        computed: {
        },
        methods: {
                //注册并监听t信返回事件
            goBackFun(){
                const that = this;
                if(that.showTuiGaiRule){
                    that.showTuiGaiRule = false;
                    document.title = '申请改签';
                }else{
                    sinosdk.sino.back('')  
                }
            },
            /**
             * 显示退改签规则页面
            */
            gotoTuiGaiRules() {
              const that = this;
              document.title = '退改说明';
              that.showTuiGaiRule = true;
            },
            /**
             * 展开日历
             */
            showCanlendar() {
              this.$refs.endorseCalendar.setDate(new Date(this.newStartDate).getTime()/1000);
              this.showCalendar = true;
            },
            /**
             * 日历选中日期回调
             * @param date
             */
            chooseDate(date) {
                this.newStartDate = date * 1000;
                this.showCalendar = false;
            },
            /**
             * 查询航班
             */
            searchTrain() {
                 const that = this;
                  trainHandler.setStorage('startDate', new Date(that.newStartDate).format('yyyy/MM/dd'));
                  trainHandler.setStorage('fromCity', that.StartStation);
                  trainHandler.setStorage('toCity', that.EndStation);
                  trainHandler.setStorage('trainType', that.trainType ? 1 : 0);
                  let indexTrainJson = {
                    'fromCity': that.StartStation,
                    'toCity': that.EndStation,
                  };
                  trainHandler.setStorage('indexTrainJson', JSON.stringify(indexTrainJson));
                  that.$router.push({
                    path:'/list',
                    query:{
                      fromChange:'changeTickets'
                    }
                  })
            },

        },
    }
</script>
<style>
  .trainticketrule-des.vux-popup-dialog{
    border-radius: .2rem .2rem 0 0;
    background: @sub-background-color;
    overflow: hidden;
  }
</style>
<style scoped lang="less">
  @import '~themes/default/styles/endorseInfo.less';
</style>
