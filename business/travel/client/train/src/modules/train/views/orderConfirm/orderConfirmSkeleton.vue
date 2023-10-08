<template>
  <div>
    <div class="trainOrderWrap child-view">
        <div class="data-wrap">
          <header>
            <div class="start-time">
              <div class="date">{{startDate}}</div>
              <div class="time num-font">{{trainDetail.goTime}}</div>
              <div class="station">{{trainDetail.startStation}}</div>
            </div>
            <div class="time-info cursorp">
              <div class="train-no">{{trainDetail.trainCode}}</div>
              <div class="iconWrap"></div>
              <div class="duration">{{trainDetail.runTimeFormat}}</div>
            </div>
            <div class="end-time">
              <div class="date">{{endDate}}</div>
              <div class="time num-font">{{trainDetail.endTime}}</div>
              <div class="station">{{trainDetail.toStation}}</div>
            </div>
          </header>
        </div>

        <div class="setSeatWrap">
          <div class="seat animated-background"></div>
          <div class="money animated-background"></div>
        </div>
        <div class="customerList">
            <div class="first animated-background"></div>
            <div class="second animated-background"></div>
            <div class="third animated-background"></div>
        </div>
        <div class="reimburse">
          <div class="item" v-for="i in 4" :key="i">
            <div class="left animated-background"></div>
            <div class="right">
              <p class="animated-background"></p>
              <p class="animated-background"></p>
            </div>
          </div>
        </div>

    </div>
    <div class="bottomButWrap"></div>
  </div>
</template>
<script>
import trainHandler from 'trainHandler/common/lib/trainHandler.js';
export default {
  data: function() {
    return {
      startDate: '',
      endDate: '',
      trainDetail: {},
    };
  },
  created(){
    let that = this;
    //缓存里面取车次详情
    that.trainDetail = !!trainHandler.getStorage('trainDetail') ? JSON.parse(trainHandler.getStorage('trainDetail')) : {};
    that.startDate = new Date(trainHandler.getStorage('startDate')).format('MM月dd日') + "  " + trainHandler.indexToWeek(new Date(trainHandler.getStorage('startDate')).getDay());
    const endDate = new Date(trainHandler.getStorage('startDate')).getTime() + that.trainDetail.runDays * 24 * 3600000;
    that.endDate = new Date(endDate).format('MM月dd日') + "  " + trainHandler.indexToWeek(new Date(endDate).getDay());     
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="less" scoped>
@import '~themes/default/styles/orderConfirmSkeleton.less';
</style>