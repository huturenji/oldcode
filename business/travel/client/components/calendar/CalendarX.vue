<template>
  <section class="wh_containerWrap" @touchmove='stopProp' @touchend='stopProp'>
    <div class="musk" v-if="showMusk"></div>
    <div class="wh_content_all">
      <div class="content_tabs">
        <div class="cancel cursorp" @click="cancel" v-show="onlyTime" v-bind:class="{onlyTime:onlyTime}">
          取消
        </div>
        <tab v-show="!onlyTime && !dateRange" class="newTab">
          <tab-item selected @on-item-click="switchSelect('date')" v-if="!dateRange" class="tabItem">{{dateTop}}
          </tab-item>
          <tab-item @on-item-click="switchSelect('time')" v-if="!onlyDate && !dateRange " class="tabItem">{{selectedTime}}
          </tab-item>
        </tab>
        <tab v-show="dateRange" class="rangeTab">
          <tab-item selected @on-item-click="switchSelect('startDate')" class="tabItem">{{startDateStr}}
          </tab-item>
          <span style="line-height: .9rem">—</span>
          <tab-item @on-item-click="switchSelect('endDate')" class="tabItem">{{endDateStr}}
          </tab-item>
        </tab>
        <div class="confirm cursorp" v-show="!onlyDate" @click="commitDate" v-bind:class="{onlyTime:onlyTime}">
          确定
        </div>
        <div class="confirm cursorp" @click="setNewDay()" v-if="onlyDate" v-bind:class="{onlyTime:onlyTime}">
          <span v-if='displayMode==5'>本月</span>
          <span v-else>今天</span>
        </div>
      </div>
      <!--<transition name="fade">-->
      <div style="height: 4.8rem" v-show="showTimeSelected">
        <picker :data='times' v-model='thisTime' @on-change='timeChange'></picker>
      </div>
      <!--</transition>-->
      <!--<transition name="fade">-->
      <swiper :show-dots="false" v-model="swiperMonthIndex" direction='vertical' height="220px" loop v-show="showMonthSelect">
        <swiper-item v-for="year in yearList" :key="year.year">
          <div class="yearSelect_content">
            <div class="yearSelect_content_item cursorp" v-for="(item,index) in year.monthList" @click="clickMonth(item,index)">
              <div>
                <li class="wh_nextDayShow" v-if="(isHideOtherday&&item.nextDayShow)||item.hidden" v-bind:class="{isToday_now:item.isTodayNow}">
                  {{item.yearStr}}
                </li>
                <li v-else="(isHideOtherday&&item.nextDayShow)||item.otherMonth||item.dayHide" v-bind:class="{ isThisMonth: item.isThisMonth,wh_isMark:item.isMark,isTodayNow:item.isTodayNow}">
                  {{item.yearStr}}
                </li>
              </div>
            </div>
          </div>
        </swiper-item>
      </swiper>
      <!--</transition>-->

      <div class="wh_content" v-show="showCalender" style="background: #eee">
        <div class="wh_content_item" v-for="tag in textTop">
          <div>
            {{tag}}
          </div>
        </div>
      </div>
      <!--<transition name="fade">-->
      <swiper style="" :show-dots="false" direction='vertical' height="660px" v-model="swiperIndex" :duration="400"
        :threshold="80" :min-moving-distance="50" @on-index-change="changeMonth" loop v-show="showCalender">
        <swiper-item v-for="month in swiperList" :key="month.timestamp">
          <div class="wh_content" @touchmove="measureStart($event)">
            <div class="wh_content_item cursorp" v-for="(item,index) in month.daylist" @click="clickDay(item,index,true)">
              <div>
                <div class="pointBlockLeft" v-if="dateRange && item.isEndDay && (markedRange[0]!=markedRange[1])&&markedRange[0]!=0&&item.otherMonth==0"
                  v-bind:class="{}"></div>
                <div class="pointBlockLeftHide" v-if="dateRange && item.isEndDay && (markedRange[0]!=markedRange[1])&&markedRange[0]!=0&&item.otherMonth!=0"
                  v-bind:class="{}"></div>
                <li class="wh_nextDayShow" v-if="(isHideOtherday&&item.nextDayShow)||item.otherMonth||item.dayHide"
                  v-bind:class="{isToday_now:item.isNow,hideRange:item.isBetween,hidePoint:item.isStartDay||item.isEndDay}">
                  {{item.id}}
                </li>
                <li v-else="(isHideOtherday&&item.nextDayShow)||item.otherMonth||item.dayHide" v-bind:class="{ wh_isToday: (item.isToday)  &&!item.isBetween,isRangeSelectedPoint:item.isStartDay||item.isEndDay,isRangeSelectedBetween:item.isBetween  }">
                  <div v-if="item.isTodayNow" style="font-size: .28rem">今天
                  </div>
                  <div v-else>{{item.id}}<span style="font-size: .2rem;color: #478aee" v-if="isThisMonth(item) && dateRange">月</span>
                  </div>

                </li>
                <div class="pointBlockRight" v-if="dateRange && item.isStartDay && (markedRange[0]!=markedRange[1]) &&markedRange[1]!=0&&item.otherMonth==0"></div>
                <div class="pointBlockRightHide" v-if="dateRange && item.isStartDay && (markedRange[0]!=markedRange[1]) &&markedRange[1]!=0&&item.otherMonth!=0"></div>
                <div class="display:none" v-bind:class="{isMark:item.isMark,isDisable:item.isDisable,isToday:item.isToday&&item.isMark}"></div>
              </div>
            </div>
          </div>
        </swiper-item>
      </swiper>
      <!--</transition>-->
    </div>
  </section>
</template>
<script>
  import {
    Popover,
    Tab,
    TabItem,
    Swiper,
    Picker,
    ToastPlugin,
    SwiperItem,
  } from 'vux';
  import Vue from 'vue';
	//时间最后一位补零
	function addZero(time) {
	  let result = time;
	  if (time < 0) {
		return;
	  }
	  if (time >= 10 && (time % 10) == 0) {
		result = parseInt(time / 10) + '0';
	  } else if (time < 10) {
		result = '0' + result;
	  }
	  return result;
	}
  
  Vue.use(ToastPlugin);
  export default {
    name: 'calendar',
    components: {
      Popover,
      Tab,
      Picker,
      TabItem,
      Swiper,
      SwiperItem,
    },
    data() {
      return {
        showMusk: false,
        thisDate: new Date(),
        times: [],
        thisTime: [],
        compareTime: [],
        chooseStartDate: false,
        chooseEndDate: false,
        startDateStr: '请选择起始日期',
        endDateStr: '请选择结束日期',
        selectMode: 0, //用在判断是否是选择范围，0表示不是，1是在选起始时间，2是在选结束时间
        selectedDate: '2018年5月',
        selectedTime: '08:30',
        textTop: ['日', '一', '二', '三', '四', '五', '六'],
        myData: [],
        list: [],
        isClickToday: false,
        onlyDate: false,
        onlyTime: false,
        dateRange: false,
        swiperIndex: 1,
        swiperMonthIndex: 19,
        dateTop: '',
        swiperList: [],
        yearList: [],
        lastIndex: 1,
        showCalender: true,
        showMonthSelect: false,
        showTimeSelected: false
      };
    },
    props: {
      markedRange: {
        type: Array,
        default: () => [0, 0]
      }, //默认被选定的日期区段
      monthSwiperMode: {
        default: 'vertical'
      }, //月份滑动的方式，左右还是上下滑动
      onlyMarked: {
        type: Boolean,
        default: false
      }, //只能点击mark的时间
      displayMode: {
        type: Number,
        default: 1
      }, //1、都显示，2、只能选择时间，3、只能选择日期,4、选择日期时段
      markArray: {
        type: Array,
        default: () => []
      }, //被标记日期列表
      disMarkArray: {
        type: Array,
        default: () => []
      }, //被alert日期列表
      markDate: {
        type: Array,
        default: () => []
      },

      agoDayHide: {
        type: Number,
        default: 0
      }, //某个日期/月份以前的不允许点击 时间戳长度是 13 位，0代表禁用
      futureDayHide: {
        type: Number,
        default: 0
      }, //某个日期以后的不允许点击 时间戳长度是 13 位
      isHideOtherday: {
        default: false
      } //超过今天的日期是否可以被点击 时间戳长度是 13 位
    },
    created() {
      this.myData = new Date();
    },
    mounted() {
      //            this.getList(this.myData);
      //            this.createYearData();

      this.createDate();
      this.createTime();
      this.setDisplayMode();
      setTimeout(() => {
        this.setNewDay();
      }, 200);
    },
    methods: {
      //阻止冒泡导致外部滑动
      stopProp(event) {
        const that = this;
        if (event.type == 'touchmove') {
          event.stopPropagation();
          event.preventDefault();
        }
      },
      //根据标记区间重新渲染日历
      resetViewByRange() {
        const that = this;
        let chooseDay = new Date();
        let val = JSON.parse(JSON.stringify(that.markedRange));
        if (val.length = 2 && !isNaN(Date.parse(val[0]))) {
          // that.createDate();
          let array = [];
          array.push({
            'daylist': that.getList(that.getPreMonth(chooseDay)),
            'Date': that.getPreMonth(chooseDay)
          });
          array.push({
            'daylist': that.getList(chooseDay),
            'Date': chooseDay
          });
          setTimeout(() => {
            array.push({
              'daylist': that.getList(that.getNextMonth(chooseDay)),
              'Date': that.getNextMonth(chooseDay)
            });
            that.swiperList = array;
          }, 50);
          if (new Date(that.markedRange[0]).getTime() > 0) {
            that.startDateStr = new Date(that.markedRange[0]).format("yyyy年MM月dd日");
          }
          if (new Date(that.markedRange[1]).getTime() > 0) {
            that.endDateStr = new Date(that.markedRange[1]).format("yyyy年MM月dd日");
          }
        }
      },
      //填充对应月份
      isThisMonth(item) {
        return item.id == (new Date(item.date).getMonth() + 1)
      },
      measureStart(el) {
        //用来防止用户滑动过快
        el.preventDefault();
        const that = this;
        setTimeout(() => {
          that.showMusk = true;
        }, 50);
        setTimeout(() => {
          that.showMusk = false;
        }, 600)
      },
      cancel() {
        const that = this;
        that.thisTime = that.compareTime;
        this.$emit('commitDate', '');
      },
      timeChange(time) {
        const that = this;
        let hours = '00';
        let minute = '00';
        if (parseInt(time[0]) < 10) {
          hours = '0' + time[0]
        } else {
          hours = '' + time[0]
        }
        if (parseInt(time[1]) < 10) {
          minute = '0' + time[1]
        } else {
          minute = '' + time[1]
        }
        const timeStamp = parseInt(new Date(new Date().format('yyyy/MM/dd')).getTime() / 1000) + parseInt(time[0] *
          3600) + parseInt(time[1] * 60);
        that.selectedTime = hours + ':' + minute;
        this.$emit('choseTime', time);
        this.$emit('changeDate', timeStamp);
      },
      switchSelect(type) {
        const that = this;
        if (type == 'date' || type == 'startDate' || type == 'endDate') {
          if (type == 'startDate') {
            that.chooseStartDate = true;
            that.chooseEndDate = false;
            setTimeout(() => {
              const date = new Date(that.startDateStr.slice(0, 4), that.startDateStr.slice(5, 7) - 1, that.startDateStr
                .slice(8, 10));
              if (date.getTime() > 0) {
                const chooseMonth = {
                  'year': date.getFullYear(),
                  'month': date.getMonth() + 1,
                  'day': date.getDate()
                };
                that.createDate(chooseMonth);
              }
            }, 50);
          } else if (type == 'endDate') {
            that.chooseEndDate = true;
            that.chooseStartDate = false;
            setTimeout(() => {
              const date = new Date(that.endDateStr.slice(0, 4), that.endDateStr.slice(5, 7) - 1, 1);
              if (date.getTime() > 0) {
                const chooseMonth = {
                  'year': date.getFullYear(),
                  'month': date.getMonth() + 1,
                  'day': date.getDate()
                };
                that.createDate(chooseMonth);
              }
            }, 50);
          }
          if (type == 'date') {
            if (that.showMonthSelect) {
              that.showMonthSelect = false;
              //              setTimeout(() => {
              that.showCalender = true;
              //              }, 5);
            } else if (that.showTimeSelected) {
              that.showCalender = true;
              that.showTimeSelected = false;
            } else {
              that.showCalender = false;
              that.showMonthSelect = true;
              setTimeout(() => {
                const date = that.dateTop;
                const chooseMonth = new Date(date.slice(0, 4), date.slice(5, 7) - 1, 1);
                that.createYearData(chooseMonth);
              }, 5);
            }
          }
        } else if (type == 'time') {
          that.showCalender = false;
          that.showMonthSelect = false;
          setTimeout(() => {
            that.showTimeSelected = true;
          }, 5);
        }

      },
      /*无限切换日历思路
       * 1、swiper实际上只有3页
       * 2、没切换到前一页或者后一页后，这三页会重置，index也会重置
       * */
      createTime(timeStamp) {
        const that = this;
        let chooseDay = new Date(timeStamp);

        let hours = [];
        let minutes = [];
        for (let i = 0; i < 24; i++) {
          hours.push(i.toString() + '')
        }
        for (let i = 0; i < 60; i++) {
          minutes.push(i.toString() + '')
        }
        that.times = [hours, minutes];
        that.thisTime = [chooseDay.getHours().toString(), chooseDay.getMinutes().toString()];
        that.compareTime = new Array();
        const compareTime = that.thisTime;
        that.compareTime = [compareTime[0], compareTime[1]];
        let hoursStr = '';
        let minuteStr = '';
        if (chooseDay.getHours() < 10) {
          hoursStr = '0' + chooseDay.getHours();
        } else {
          hoursStr = chooseDay.getHours();
        }
        if (chooseDay.getMinutes() < 10) {
          minuteStr = '0' + chooseDay.getMinutes()
        } else {
          minuteStr = chooseDay.getMinutes();
        }
        that.selectedTime = hoursStr + ':' + minuteStr;
      },
      //用来注入时间
      setDate(timeStamp) {
        const that = this;
        const myData = new Date(timeStamp * 1000); //任意时间
        const obj = {
          'year': myData.getFullYear(),
          'month': myData.getMonth() + 1,
          'day': myData.getDate()
        };
        this.$emit('changeDate', timeStamp);
        that.createDate(obj);
        that.createTime(timeStamp * 1000);
      },
      createDate(chooseMonth, type) {
        const that = this;
        let chooseDay = '';
        if (chooseMonth) {
          //做日期的注入，并模拟点击操作
          if (!!chooseMonth.day) {
            chooseDay = new Date(chooseMonth.year, chooseMonth.month - 1, chooseMonth.day);
            //                        const week = (chooseMonth.day % 7) == 0 ? (chooseMonth.day / 7 + 1) : (Math.ceil(chooseMonth.day / 7));
            const week = Math.ceil((chooseDay.getDate() + 6 - chooseDay.getDay()) / 7);
            const index = chooseDay.getDay() + (week - 1) * 7;
            const item = {
              id: index,
              date: new Date(chooseDay).format('yyyy/MM/d'),
              isTodayNow: false,
              isToday: false,
              isMark: false,
              isDisable: false,
              isStartDay: false,
              isEndDay: false,
              isBetween: false,
              dayHide: false,
              nextDayShow: false
            };
            setTimeout(() => {
              that.clickDay(item, index);
            }, 200);
          } else {
            chooseDay = new Date(chooseMonth.year, chooseMonth.month - 1);
          }
          that.createYearData(chooseDay);
        } else {
          if (that.showMonthSelect) {
            that.showMonthSelect = false;
            that.createYearData();
          } else {
            that.showCalender = false;
          }
          if (that.displayMode != 2 && that.displayMode != 5) {
            setTimeout(() => {
              that.showCalender = true;
            }, 400);
          }
          that.createYearData();
          chooseDay = new Date();
        }
        let array = [];
        array.push({
          'daylist': that.getList(that.getPreMonth(chooseDay)),
          'Date': that.getPreMonth(chooseDay)
        });
        if (!!chooseMonth) {
          array.push({
            'daylist': that.getList(chooseDay, chooseDay, false),
            'Date': chooseDay
          });
        } else {
          array.push({
            'daylist': that.getList(chooseDay),
            'Date': chooseDay
          });
        }
        setTimeout(() => {
          array.push({
            'daylist': that.getList(that.getNextMonth(chooseDay)),
            'Date': that.getNextMonth(chooseDay)
          });
          that.swiperList = array;
        }, 50);
        that.swiperIndex = 1;
        that.lastIndex = 1;
        let mygetMonth = chooseDay.getMonth() + 1 < 10 ? '0' + (chooseDay.getMonth() + 1) : chooseDay.getMonth() + 1;
        that.dateTop = chooseDay.getFullYear() + '年' + mygetMonth + '月';
      },
      setNewDay(chooseDay) {
        const that = this;
        /*
         * 实现思路
         * 1、先分别获取今天和现在显示的年月日
         * 2、比较两者大小
         * 3、若现在显示的比今天的大，则通过修改指定swiper页内容，并切换swiperIndex，如果二者在同一个月则直接重新渲染当前页
         * 4、切换完毕后再去用老办法渲染另外两页为对应的数据
         *
         * 现在通过判断日期，可以带动画的跳到任意日期了
         * */
        if (!!chooseDay) {} else {
          chooseDay = new Date();
          that.createYearData();
          //同时改写月历
          const thisMonth = new Date().format('yyyy/MM');
          this.$emit('changeMonth', thisMonth);
        }
        const timeStamp = parseInt(chooseDay.getTime() / 1000);
        if (!((that.agoDayHide > 0 && that.agoDayHide / 1000 > timeStamp) || (that.futureDayHide > 0 && that.futureDayHide /
            1000 < timeStamp))) {
          this.$emit('changeDate', timeStamp);
        }
        const mygetMonth = chooseDay.getMonth() + 1 < 10 ? '0' + (chooseDay.getMonth() + 1) : chooseDay.getMonth() + 1;
        that.dateTop = chooseDay.getFullYear() + '年' + mygetMonth + '月';
        if (!!that.swiperList.length > 0) {
          const disDate = that.swiperList[that.lastIndex].Date;
          if ((disDate.getFullYear() == chooseDay.getFullYear() && disDate.getMonth() > chooseDay.getMonth()) ||
            disDate.getFullYear() >
            chooseDay.getFullYear()) {
            if (that.lastIndex > 0) {
              that.swiperList[that.lastIndex - 1].daylist = that.getList(chooseDay, chooseDay);
              that.swiperList[that.lastIndex - 1].Date = chooseDay;
              setTimeout(() => {
                that.swiperIndex = that.lastIndex - 1;
              }, 50);
            } else {
              that.swiperList[2].daylist = that.getList(chooseDay, chooseDay);
              that.swiperList[2].Date = chooseDay;
              setTimeout(() => {
                that.swiperIndex = 2;
              }, 50);
            }
          } else if ((disDate.getFullYear() == chooseDay.getFullYear() && disDate.getMonth() < chooseDay.getMonth()) ||
            disDate.getFullYear() < chooseDay.getFullYear()) {
            if (that.lastIndex < 2) {
              that.swiperList[that.lastIndex + 1].daylist = that.getList(chooseDay, chooseDay);
              that.swiperList[that.lastIndex + 1].Date = chooseDay;
              setTimeout(() => {
                that.swiperIndex = that.lastIndex + 1;
              }, 50);
            } else {
              that.swiperList[0].daylist = that.getList(chooseDay, chooseDay);
              that.swiperList[0].Date = chooseDay;
              setTimeout(() => {
                that.swiperIndex = 0;
              }, 50);
            }
          } else {
            that.swiperList[that.swiperIndex].daylist = that.getList(chooseDay, chooseDay);
            that.swiperList[that.swiperIndex].Date = chooseDay;
          }
        }
        setTimeout(() => {
          that.lastIndex = that.swiperIndex;
        }, 200);



        that.$forceUpdate();
        that.isClickToday = true;
      },
      createYearData(chooseDay) {
        const that = this;
        let today = '';
        if (chooseDay) {
          today = chooseDay
        } else {
          today = new Date();
        }
        let thisMonth = today.getMonth() + 1;
        let thisYear = today.getFullYear();
        let initYear = thisYear - 20;
        let array = [];
        for (let i = 0; i < 40; i++) {
          initYear++;
          let monthList = [];
          const preYear = initYear - 1;
          const nextYear = initYear + 1;
          monthList.push({
            'year': preYear,
            'month': 12,
            'yearStr': preYear + '年12月',
            hidden: true,
            isThisMonth: (thisYear == initYear && thisMonth == 12)
          });
          for (let i = 1; i < 13; i++) {
            //判断是否需要控制显示的范围
            let obj = {
              'year': initYear,
              'month': i,
              'yearStr': initYear + '年' + i + '月',
              hidden: false,
              isThisMonth: (thisYear == initYear && thisMonth == i)
            };
            if (this.agoDayHide > 0) {
              const hideDay = new Date(this.agoDayHide)
              let hideYear = hideDay.getFullYear();
              let hideMonth = hideDay.getMonth();
              if (hideYear > initYear || (hideYear == initYear && hideMonth >= i)) {
                obj.hidden = true;
              }
            }
            monthList.push(obj);
          }

          monthList.push({
            'year': nextYear,
            'month': 1,
            'yearStr': nextYear + '年1月',
            hidden: true,
            isThisMonth: (thisYear == initYear && thisMonth == 1)
          });
          monthList.push({
            'year': nextYear,
            'month': 2,
            'yearStr': nextYear + '年2月',
            hidden: true,
            isThisMonth: (thisYear == initYear && thisMonth == 2)
          });
          array.push({
            'monthList': monthList,
            'year': initYear,
          })
        }
        that.swiperMonthIndex = 19;
        that.yearList = array;
      },
      //日历切换时，重新渲染的方法
      changeMonth(index, type) {
        //changeMonthRevert:changeMonth的方向方法，用在跨月选择时间后重新渲染上一页
        const that = this;
        let isPreRevert = false;
        let isNextRevert = false;
        if (!!type && type == 'preRevert') {
          isPreRevert = true;
        } else if (!!type && type == 'nextRevert') {
          isNextRevert = true;
        }
        let nextIndex = that.getNextIndex(index);
        let preIndex = that.getPreIndex(index);
        let today = new Date();
        if (!!that.swiperList && that.swiperList.length > 0) {
          //相当于更新下一页
          today = that.swiperList[index].Date;
          let array = that.swiperList;
          if (((index > that.lastIndex && index - that.lastIndex == 1) || (index < that.lastIndex && that.lastIndex -
              index == 2)) || isNextRevert) {
            //                        array.shift();
            setTimeout(() => {
              array.splice(nextIndex, 1, {
                'daylist': that.getList(that.getNextMonth(today)),
                'Date': that.getNextMonth(today)
              });
              that.lastIndex = index;
              that.swiperList = array;
            }, 30);
            /*
             * 如果是点击今天，则前后两页都要重置
             * */
            if (that.isClickToday) {
              setTimeout(() => {
                array.splice(preIndex, 1, {
                  'daylist': that.getList(that.getPreMonth(today)),
                  'Date': that.getPreMonth(today)
                });
                that.lastIndex = index;
                that.swiperList = array;
              }, 30);
            }
          } else if (((index < that.lastIndex && that.lastIndex - index == 1) || (index > that.lastIndex && index -
              that.lastIndex == 2)) || isPreRevert) {
            //相当于更新前一页
            setTimeout(() => {
              array.splice(preIndex, 1, {
                'daylist': that.getList(that.getPreMonth(today)),
                'Date': that.getPreMonth(today)
              });
              that.lastIndex = index;
              that.swiperList = array;
            }, 30);
            if (that.isClickToday) {
              setTimeout(() => {
                array.splice(nextIndex, 1, {
                  'daylist': that.getList(that.getNextMonth(today)),
                  'Date': that.getNextMonth(today)
                });
                that.lastIndex = index;
                that.swiperList = array;
              }, 30);
            }
          }
          let mygetMonth = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
          that.dateTop = today.getFullYear() + '年' + mygetMonth + '月';
        }
      },
      getNextIndex(index) {
        let nextIndex = 0;
        switch (index) {
          case 0:
            nextIndex = 1;
            break;
          case 1:
            nextIndex = 2;
            break;
          case 2:
            nextIndex = 0;
            break;
        }
        return nextIndex;
      },
      getPreIndex(index) {
        let preIndex = 0;
        switch (index) {
          case 0:
            preIndex = 2;
            break;
          case 1:
            preIndex = 0;
            break;
          case 2:
            preIndex = 1;
            break;
        }
        return preIndex;
      },
      clickMonth(item, index) {
        const that = this;
        if (this.agoDayHide > 0) {
          //如果是有时间范围参数则不响应
          const hideDay = new Date(this.agoDayHide)
          let hideYear = hideDay.getFullYear();
          let hideMonth = hideDay.getMonth();
          if (hideYear > item.year || (hideYear == item.year && hideMonth >= item.month)) {
            return
          }
        }
        if (item.otherMonth) {
          item.otherMonth < 0 ? this.PreMonth(item.date) : this.NextMonth(item.date);
        } else {
          if (!(this.isHideOtherday && item.nextDayShow) && !item.dayHide) {
            for (let i = 0; i < that.yearList[that.swiperMonthIndex].monthList.length; i++) {
              if (i == index) {
                that.yearList[that.swiperMonthIndex].monthList[i].isThisMonth = true;
              } else {
                that.yearList[that.swiperMonthIndex].monthList[i].isThisMonth = false;
              }
            }
          }
        }
        that.createDate(item);
        let timeStamp = '';
        if (that.displayMode == 1) {
          const compareTime = that.thisTime;
          timeStamp = parseInt(new Date(item.year + "/" + addZero(item.month)) / 1000) + parseInt(compareTime[0] * 3600) +
            parseInt(compareTime[1] * 60);
        } else {
          timeStamp = parseInt(new Date(item.year + "/" + addZero(item.month)) / 1000);
        }
        //        this.$emit('changeDate', timeStamp);
        const thisMonth = new Date(timeStamp * 1000).format('yyyy/MM/dd');
        this.$emit('changeMonth', item.year + "/" + addZero(item.month) + '/01');
        this.thisDate = '';
        if (that.displayMode != 5) {
          that.switchSelect('date');
        }
      },
      commitDate() {
        const that = this;
        if (that.thisDate == '') {
          let time = 200;
          if ($(".tipsBox").length == 0) {
            $("body").append("<div class='tipsBox'><span>" + "请选择日期" + "</span></div>");
            $(".tipsBox").stop().delay(time).animate({
              opacity: 'show'
            }, 0).delay(2000).animate({
              opacity: 'hide'
            }, 350, function () {
              $(".tipsBox").remove()
            });
            $(document).on("click", ".tipsBox", function () { //点击tipsbox隐藏
              $(".tipsBox").stop().animate({
                opacity: 'hide'
              }, 150, function () {
                $(".tipsBox").remove()
              });
            })
          }
        } else {
          const compareTime = that.thisTime;
          that.compareTime = [compareTime[0], compareTime[1]];
          const dayStamp = new Date(that.thisDate).setHours(0, 0, 0, 0);
          const timeStamp = parseInt(new Date(dayStamp).getTime() / 1000) + parseInt(compareTime[0] * 3600) + parseInt(
            compareTime[1] * 60);
          const date = {
            'date': that.thisDate,
            'time': compareTime[0] + ':' + compareTime[1],
            'timeStamp': timeStamp
          };
          const dateRange = {
            'startTime': new Date(that.startDateStr.slice(0, 4), that.startDateStr.slice(5, 7) - 1, that.startDateStr
              .slice(8, 10)),
            'endTime': new Date(that.endDateStr.slice(0, 4), that.endDateStr.slice(5, 7) - 1, that.endDateStr.slice(8,
              10))
          };
          if (that.dateRange) {
            if (dateRange.startTime == 'Invalid Date' || dateRange.endTime == 'Invalid Date') {
              this.$emit('commitDate', '');
            } else {
              this.$emit('commitDate', dateRange);
            }

          } else {
            this.$emit('commitDate', date);
          }
        }
      },
      clickDay(item, index, type) {
        //type 用来判断是模拟的点击（false）还是真实的点击（true）
        const that = this;
        //用来判断是否有重置选择时间段的操作
        let isReset = false;
        let hasRender = false;
        that.thisDate = item.date;
        let timeStamp = '';
        if (that.displayMode == 1) {
          const compareTime = that.thisTime;
          timeStamp = parseInt(new Date(item.date).getTime() / 1000) + parseInt(compareTime[0] * 3600) + parseInt(
            compareTime[1] * 60);
        } else {
          timeStamp = new Date(item.date).getTime() / 1000;
        }
        if (type == true) {
          if (!((that.agoDayHide > 0 && that.agoDayHide / 1000 > timeStamp) || (that.futureDayHide > 0 && that.futureDayHide /
              1000 < timeStamp))) {
            this.$emit('changeDate', timeStamp);
          }
        }
        if (item == 'commit') {
          that.$emit('choseDay', item.date);
        } else {
          if (!(that.isHideOtherday && item.nextDayShow) && !item.dayHide) {
            that.$emit('choseDay', item);
          }
        }
        if (item.otherMonth) {
          item.otherMonth < 0 ? that.PreMonth(item.date) : that.NextMonth(item.date);
        } else {
          if (!(that.isHideOtherday && item.nextDayShow) && !item.dayHide && that.swiperList.length > 0) {
            let markFlag = false;
            //如果开始时间和结束时间不在同一页，需要把当前的下一页也渲染了(不在同一个月且时间戳小)
            if (new Date(that.swiperList[that.swiperIndex].daylist[index].date).getMonth() != new Date(that.markedRange[
                0]).getTime() && new Date(that.swiperList[that.swiperIndex].daylist[index].date).getTime() < new Date(
                that.markedRange[1]).getTime()) {
              that.changeMonth(that.swiperIndex, 'nextRevert');
            }
            //如果开始时间和结束时间不在同一页，需要把当前的下一页也渲染了(不在同一个月且时间戳大)
            if (new Date(that.swiperList[that.swiperIndex].daylist[index].date).getMonth() != new Date(that.markedRange[
                1]).getTime() && new Date(that.swiperList[that.swiperIndex].daylist[index].date).getTime() > new Date(
                that.markedRange[0]).getTime()) {
              that.changeMonth(that.swiperIndex, 'preRevert');
            }
            for (let i = 0; i < that.swiperList[that.swiperIndex].daylist.length; i++) {
              if (that.dateRange && type) {
                if (that.chooseStartDate) {
                  //即选择的日期小于当前截止，或者截止未设置
                  if (new Date(that.swiperList[that.swiperIndex].daylist[index].date).getTime() <= new Date(that.markedRange[
                      1]).getTime() || that.markedRange[1] == 0) {
                    hasRender = true;
                    if (i == index) {
                      that.startDateStr = new Date(that.swiperList[that.swiperIndex].daylist[index].date).format(
                        "yyyy年MM月dd日");
                      that.swiperList[that.swiperIndex].daylist[i].isStartDay = true;
                      that.swiperList[that.swiperIndex].daylist[i].isBetween = false;
                    } else {
                      //判断是否跨月
                      if (i > index && new Date(that.swiperList[that.swiperIndex].daylist[i].date).getTime() < new Date(
                          that.markedRange[1]).getTime()) {
                        that.swiperList[that.swiperIndex].daylist[i].isBetween = true;
                      } else {
                        that.swiperList[that.swiperIndex].daylist[i].isBetween = false;
                      }
                      that.swiperList[that.swiperIndex].daylist[i].isStartDay = false;
                    }
                  } else {
                    //重置日历
                    isReset = true;
                  }
                } else if (that.chooseEndDate) {
                  if (new Date(that.swiperList[that.swiperIndex].daylist[index].date).getTime() >= new Date(that.markedRange[
                      0]).getTime()) {
                    hasRender = true;
                    if (i == index) {
                      that.endDateStr = new Date(that.swiperList[that.swiperIndex].daylist[index].date).format(
                        "yyyy年MM月dd日");
                      that.swiperList[that.swiperIndex].daylist[i].isEndDay = true;
                      that.swiperList[that.swiperIndex].daylist[i].isBetween = false;
                    } else {
                      if (i < index && new Date(that.swiperList[that.swiperIndex].daylist[i].date).getTime() > new Date(
                          that.markedRange[0]).getTime() && that.markedRange[0] != 0) {
                        that.swiperList[that.swiperIndex].daylist[i].isBetween = true;
                      } else {
                        that.swiperList[that.swiperIndex].daylist[i].isBetween = false;
                      }
                      that.swiperList[that.swiperIndex].daylist[i].isEndDay = false;
                    }
                  } else {
                    //重置日历
                    isReset = true;
                  }
                }

              } else if (!that.dateRange) {
                if (that.onlyMarked) {
                  if (i == index && that.swiperList[that.swiperIndex].daylist[i].isMark) {
                    markFlag = true;
                    that.swiperList[that.swiperIndex].daylist[i].isToday = true;
                  } else {
                    that.swiperList[that.swiperIndex].daylist[i].isToday = false;
                  }
                } else {
                  if (i == index) {
                    that.swiperList[that.swiperIndex].daylist[i].isToday = true;
                  } else {
                    that.swiperList[that.swiperIndex].daylist[i].isToday = false;
                  }
                }
              }
            }
            if (!markFlag && that.onlyMarked) {
              that.swiperList[that.swiperIndex].daylist = that.getList(that.myData)
            }
          }
          if (hasRender) {
            if (that.chooseStartDate) {
              that.markedRange[0] = new Date(that.swiperList[that.swiperIndex].daylist[index].date).format("yyyy/M/dd");
            } else if (that.chooseEndDate) {
              that.markedRange[1] = new Date(that.swiperList[that.swiperIndex].daylist[index].date).format("yyyy/M/dd");
            }
          }
          if (isReset && !hasRender) {
            //否则清除范围，置空并选择起始点，并标记当前时间为起始时间
            if (that.chooseStartDate) {
              that.markedRange[0] = new Date(that.swiperList[that.swiperIndex].daylist[index].date).format("yyyy/M/dd");
              that.markedRange[1] = 0;
              const date = new Date(item.date);
              if (date.getTime() > 0) {
                const chooseMonth = {
                  'year': date.getFullYear(),
                  'month': date.getMonth() + 1,
                  'day': date.getDate()
                };
                that.startDateStr = new Date(that.swiperList[that.swiperIndex].daylist[index].date).format(
                  "yyyy年MM月dd日");
                that.endDateStr = '请选择结束日期';
                that.createDate(chooseMonth);
              }
            } else if (that.chooseEndDate) {
              that.markedRange[1] = new Date(that.swiperList[that.swiperIndex].daylist[index].date).format("yyyy/M/dd");
              that.markedRange[0] = 0;
              const date = new Date(item.date);
              if (date.getTime() > 0) {
                const chooseMonth = {
                  'year': date.getFullYear(),
                  'month': date.getMonth() + 1,
                  'day': date.getDate()
                };
                that.startDateStr = '请选择开始时间';
                that.endDateStr = new Date(that.swiperList[that.swiperIndex].daylist[index].date).format("yyyy年MM月dd日");
                that.createDate(chooseMonth);
              }
            }
          }
        }
      },
      ChoseMonth(date, isChosedDay = true) {
        const that = this;
        date = that.dateFormat(date);
        if (!!date) {
          that.myData = new Date(date);
        } else {
          that.myData = new Date();
        }
        that.$emit('changeMonth', that.dateFormat(that.myData));
        that.getList(this.myData, date, isChosedDay);
      },
      PreMonth(date, isChosedDay = true) {
        const that = this;
        that.myData = new Date(date);
        date = that.dateFormat(date);
        that.$emit('changeMonth', that.dateFormat(that.myData));
        that.setNewDay(that.myData);
        const chooseDay = that.myData.getDate();
        const week = Math.ceil((chooseDay + 6 - that.myData.getDay()) / 7);
        const index = that.myData.getDay() + (week - 1) * 7;
        const item = {
          id: index,
          date: that.myData,
          isTodayNow: false,
          isToday: false,
          isMark: false,
          isDisable: false,
          dayHide: false,
          nextDayShow: false
        };
        setTimeout(() => {
          //在选择时间范围的模式下，不会有点击的效果
          if (!that.dateRange) {
            // 现在不会选择第一天
            //            that.clickDay(item, index);
            that.createYearData(that.myData);
          }
        }, 200);
        that.myData = that.getPreMonth(that.myData);
      },
      NextMonth(date, isChosedDay = true) {
        const that = this;
        that.myData = new Date(date);
        date = this.dateFormat(date);
        that.$emit('changeMonth', this.dateFormat(this.myData));
        that.setNewDay(that.myData);
        const chooseDay = that.myData.getDate();
        const week = Math.ceil((chooseDay + 6 - that.myData.getDay()) / 7);
        const index = that.myData.getDay() + (week - 1) * 7;
        const item = {
          id: index,
          date: that.myData,
          isTodayNow: false,
          isToday: false,
          isMark: false,
          isDisable: false,
          dayHide: false,
          nextDayShow: false
        };
        setTimeout(() => {
          //在选择时间范围的模式下，不会有点击的效果
          if (!that.dateRange) {
            //            现在不会选择第一天
            //            that.clickDay(item, index);
            that.createYearData(that.myData);
          }
        }, 200);
        that.myData = that.getNextMonth(that.myData);
      },
      getPreMonth(date) {
        let timeArray = this.dateFormat(date).split('/');
        let year = timeArray[0];
        let month = timeArray[1];
        let day = timeArray[2];
        let days = new Date(year, month, 0);
        days = days.getDate();
        let year2 = year;
        let month2 = parseInt(month) - 1;
        if (month2 == 0) {
          year2 = parseInt(year2) - 1;
          month2 = 12;
        }
        let day2 = day;
        let days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
          day2 = days2;
        }
        if (month2 < 10) {
          month2 = '0' + month2;
        }
        let t2 = year2 + '/' + month2 + '/' + day2;
        return new Date(t2);
      },
      getNextMonth(date) {
        let arr = this.dateFormat(date).split('/');
        let year = arr[0]; //获取当前日期的年份
        let month = arr[1]; //获取当前日期的月份
        let day = arr[2]; //获取当前日期的日
        let days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中的月的天数
        let year2 = year;
        let month2 = parseInt(month) + 1;
        if (month2 == 13) {
          year2 = parseInt(year2) + 1;
          month2 = 1;
        }
        let day2 = day;
        let days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
          day2 = days2;
        }
        if (month2 < 10) {
          month2 = '0' + month2;
        }
        let t2 = year2 + '/' + month2 + '/' + day2;
        return new Date(t2);
      },
      getDaysInOneMonth(date) { //天数
        let getyear = date.getFullYear();
        let getmonth = date.getMonth() + 1;
        getmonth = parseInt(getmonth, 10);
        let d = new Date(getyear, getmonth, 0);
        return d.getDate();
      },
      getMonthweek(date) {
        let getyear = date.getFullYear();
        let getmonth = date.getMonth() + 1;
        let dateOne = new Date(getyear + '/' + getmonth + '/1');
        return dateOne.getDay() == 0 ? 0 : dateOne.getDay();
      },
      getList(date, chooseDay, isChosedDay = true) {
        const that = this;
        const markedRange = that.markedRange;
        if (!date) {
          date = new Date();
        }
        if (!!chooseDay) {
          chooseDay = new Date(chooseDay).format("yyyy/M/d");
        }
        let array = [];
        for (let i = 0; i < this.getDaysInOneMonth(date); i++) {
          let nowTime = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + (i + 1);
          if (
            this.dateFormat(new Date()) ==
            this.dateFormat(new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + (i + 1)))
          ) {
            array = array.concat({
              id: i + 1,
              date: nowTime,
              otherMonth: 0,
              isTodayNow: true,
              isToday: !that.dateRange && chooseDay == nowTime,
              isMark: this.markArray.indexOf(i + 1) >= 0 || this.markDate.indexOf(nowTime) >= 0,
              isDisable: this.disMarkArray.indexOf(nowTime) >= 0,
              dayHide: new Date(nowTime).getTime() < parseInt(this.agoDayHide) || (new Date(nowTime).getTime() >
                parseInt(this.futureDayHide) && this.futureDayHide > 0),
              isStartDay: new Date(nowTime).getTime() == (markedRange.length == 2 ? new Date(markedRange[0]).getTime() :
                0),
              isEndDay: new Date(nowTime).getTime() == (markedRange.length == 2 ? new Date(markedRange[1]).getTime() :
                0),
              isBetween: new Date(nowTime).getTime() < (markedRange.length == 2 ? new Date(markedRange[1]).getTime() :
                0) && new Date(nowTime).getTime() > (markedRange.length == 2 ? new Date(markedRange[0]).getTime() :
                0) && markedRange[0] != 0,
              nextDayShow: new Date(nowTime).getTime() >
                new Date().getTime()
            });
            this.$emit(
              'isToday',
              this.dateFormat(new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + (i + 1)))
            );
          } else {
            array = array.concat({
              id: i + 1,
              date: nowTime,
              otherMonth: 0,
              isTodayNow: false,
              isToday: !that.dateRange && chooseDay == nowTime && isChosedDay,
              isMark: this.markArray.indexOf(i + 1) >= 0 || this.markDate.indexOf(nowTime) >= 0,
              isDisable: this.disMarkArray.indexOf(nowTime) >= 0,
              isStartDay: new Date(nowTime).getTime() == (markedRange.length == 2 ? new Date(markedRange[0]).getTime() :
                0),
              isEndDay: new Date(nowTime).getTime() == (markedRange.length == 2 ? new Date(markedRange[1]).getTime() :
                0),
              isBetween: new Date(nowTime).getTime() < (markedRange.length == 2 ? new Date(markedRange[1]).getTime() :
                0) && new Date(nowTime).getTime() > (markedRange.length == 2 ? new Date(markedRange[0]).getTime() :
                0) && markedRange[0] != 0,
              dayHide: new Date(nowTime).getTime() < parseInt(this.agoDayHide) || (new Date(nowTime).getTime() >
                parseInt(this.futureDayHide) && this.futureDayHide > 0),
              nextDayShow: new Date(nowTime).getTime() >
                new Date().getTime()
            });
          }
        }
        let array2 = [];
        let num = this.getDaysInOneMonth(this.getPreMonth(date)) - this.getMonthweek(date) + 1;
        let preDate = this.getPreMonth(date);
        let nextDate = this.getNextMonth(date);
        //上个月多少开始
        for (let i = 0; i < this.getMonthweek(date); i++) {
          let nowTime = preDate.getFullYear() + '/' + (preDate.getMonth() + 1) + '/' + (num + i);
          array2 = array2.concat({
            id: num + i,
            date: nowTime,
            dayHide: new Date(nowTime).getTime() < parseInt(this.agoDayHide) || new Date(nowTime).getTime() >
              parseInt(this.futureDayHide),
            isStartDay: new Date(nowTime).getTime() == (markedRange.length == 2 ? new Date(markedRange[0]).getTime() :
              0),
            isEndDay: new Date(nowTime).getTime() == (markedRange.length == 2 ? new Date(markedRange[1]).getTime() :
              0),
            isBetween: new Date(nowTime).getTime() < (markedRange.length == 2 ? new Date(markedRange[1]).getTime() :
              0) && new Date(nowTime).getTime() > (markedRange.length == 2 ? new Date(markedRange[0]).getTime() :
              0) && markedRange[0] != 0,
            nextDayShow: new Date(nowTime).getTime() >
              new Date().getTime(),
            otherMonth: -1
          });
        }
        array = array2.concat(array);
        //下个月的
        let _length = 7 - array.length % 7;
        if (_length < 7) {
          for (let i = 0; i < _length; i++) {
            let nowTime = nextDate.getFullYear() + '/' + (nextDate.getMonth() + 1) + '/' + (i + 1);
            array.push({
              id: i + 1,
              date: nextDate.getFullYear() + '/' + (nextDate.getMonth() + 1) + '/' + (i + 1),
              dayHide: new Date(nowTime).getTime() < parseInt(this.agoDayHide) || new Date(nowTime).getTime() >
                parseInt(this.futureDayHide),
              isStartDay: new Date(nowTime).getTime() == (markedRange.length == 2 ? new Date(markedRange[0]).getTime() :
                0),
              isEndDay: new Date(nowTime).getTime() == (markedRange.length == 2 ? new Date(markedRange[1]).getTime() :
                0),
              isBetween: new Date(nowTime).getTime() < (markedRange.length == 2 ? new Date(markedRange[1]).getTime() :
                0) && new Date(nowTime).getTime() > (markedRange.length == 2 ? new Date(markedRange[0]).getTime() :
                0) && markedRange[0] != 0,
              nextDayShow: new Date(nowTime).getTime() >
                new Date().getTime(),
              otherMonth: 1
            });
          }
        }
        return array;
      },
      dateFormat(date) {
        date = new Date(date);
        return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
      },
      initDateRange() {
        const that = this;
        if (new Date(that.markedRange[0]).getTime() > 0) {
          that.startDateStr = new Date(that.markedRange[0]).format("yyyy年MM月dd日");
          const startDate = new Date(that.markedRange[0]);
          const week = Math.ceil((startDate.getDate() + 6 - that.myData.getDay()) / 7);
          const index = startDate.getDay() + (week - 1) * 7;
          const item = {
            id: index,
            date: startDate,
            isTodayNow: false,
            isToday: false,
            isMark: false,
            isDisable: false,
            isStartDay: false,
            isEndDay: false,
            isBetween: false,
            dayHide: false,
            nextDayShow: false
          };
          const chooseMonth = {
            'year': startDate.getFullYear(),
            'month': startDate.getMonth() + 1,
            'day': startDate.getDate()
          };
          setTimeout(() => {
            if (startDate > 0) {
              that.createDate(chooseMonth);
            }
          }, 100);
        }
        if (new Date(that.markedRange[1]).getTime() > 0) {
          that.endDateStr = new Date(that.markedRange[1]).format("yyyy年MM月dd日");
        }

      },
      setDisplayMode() {
        const that = this;
        const mode = that.displayMode;
        switch (mode) {
          case 1:
            that.onlyDate = false;
            that.onlyTime = false;
            that.dateRange = false;
            break;
          case 2:
            that.switchSelect('time');
            that.onlyDate = false;
            that.onlyTime = true;
            that.dateRange = false;
            break;
          case 3:
            that.onlyDate = true;
            that.onlyTime = false;
            that.dateRange = false;
            break;
          case 4:
            that.onlyDate = false;
            that.onlyTime = false;
            that.dateRange = true;
            that.chooseStartDate = true;
            that.chooseEndDate = false;
            that.initDateRange();
            break;
          case 5:
            that.showMonthSelect = true;
            that.showCalender = false;
            that.onlyDate = true;
            that.onlyTime = false;
            that.dateRange = false;
        }
      }
    },
    watch: {
      markArray(val, oldVal) {
        const that = this;
        let list = that.swiperList[that.swiperIndex].daylist;
        for (let i = 0; i < list.length; i++) {
          list[i].isMark = false;
          if (list[i].date) {
            for (let n = 0; n < val.length; n++) {
              if (list[i].id == val[n]) {
                list[i].isMark = true;
              }
            }
          }
        }
        this.list = list;
      },
      disMarkArray(val, oldVal) {
        let list = this.list;
        for (let i = 0; i < list.length; i++) {
          list[i].isMark = false;
          if (list[i].date) {
            for (let n = 0; n < val.length; n++) {
              if (list[i].id == val[n]) {
                list[i].isDisable = true;
              }
            }
          }
        }
        this.list = list;
      },
      markDate(val, oldVal) {
        let list = this.list;
        for (let i = 0; i < list.length; i++) {
          list[i].isMark = false;
          if (list[i].date) {
            for (let n = 0; n < val.length; n++) {
              if (list[i].date == val[n]) {
                list[i].isMark = true;
              }
            }
          }
        }
        this.list = list;
      }
    }
  };

</script>
<style lang="less" scoped>
  @import './calendar.less';

</style>
