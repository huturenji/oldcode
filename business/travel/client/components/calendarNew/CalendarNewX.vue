<template>
  <section class="wh_container" :class="{noMaxHeight:4==displayMode}">
    <div class="wh_content_all">
      <div class="content_tabs" v-if='dateRange'>
        <div class="tabItem">
          <div class='action'>入住</div>
          <div class="date">{{strDate(markedRange,'start')}} <span class="week">{{strWeek(markedRange,'start')}}</span></div>
        </div>
        <span style="line-height: .9rem">共{{totalDays}}晚</span>
        <div class="tabItem">
          <div class='action'>离店</div>
          <div class="date">{{strDate(markedRange,'end')}} <span class="week">{{strWeek(markedRange,'end')}}</span></div>
        </div>
      </div>
      <div class="wh_content weekList" v-show="showCalender">
        <div class="wh_content_item" v-for="tag in textTop">
          <div>
            {{tag}}
          </div>
        </div>
      </div>
    </div>
    <div class='wh_content_list' :class="{modeHotel:4==displayMode}">
      <div v-for="(month,monthIndex) in swiperList" :key="month.timestamp">
        <div class='wh_content recentMonth'>
          {{strMonth(month)}}
        </div>
        <div class="wh_content">
          <div class="wh_content_item" v-for="(item,index) in month.daylist" >
            <div class="cursorp" v-if='item.id>0' @click="item.dayHide || clickDay(item,index,true,monthIndex)">
              <li class="wh_nextDayShow" v-if="(isHideOtherday&&item.nextDayShow)&&item.otherMonth||item.dayHide"
                v-bind:class="{isToday_now:item.isNow,hideRange:item.isBetween,hidePoint:item.isStartDay||item.isEndDay}">
                <!-- <div v-if="dateRange && item.id==1">
                        {{new
                        Date(item.date).getMonth()+1}} <span style="font-size: .2rem">月</span>
                      </div> -->
                <div class='dayDetail' v-bind:class="{ wh_isToday: item.isToday}">
                  <div class="header">
                  

                    <div v-if=' item.isStartDay'>入住</div><div v-else-if=' item.isEndDay'>离店</div>
                    <div v-else>
                      <span v-if='item.isTodayNow'>今天</span>
                      <span v-else-if='item.isHoliday'>休</span>
                      <span v-else>{{item.chineseCalendar}}</span>
                    </div>
                    
                  </div>
                  <div class='middle' v-bind:class="{isHoliday:item.isHoliday,isHide:item.dayHide}">{{item.id}}</div>
                  <div class="bottom">
                    <span class="hasPrice" v-if='item.price>0'>{{item.price}}</span></div>
                </div>
              </li>
              <li v-else="(isHideOtherday&&item.nextDayShow)||item.otherMonth||item.dayHide" v-bind:class="{isToday:item.isTodayNow, wh_isToday: item.isToday && !item.isBetween, isRangeSelectedPointStart:item.isStartDay,isRangeSelectedPointEnd:item.isEndDay,isRangeSelectedBetween:item.isBetween  }">
                <div class='dayDetail'>
                  <div class="header" v-bind:class={isHoliday:item.isHoliday}>
                 
                    <div v-if=' item.isStartDay'>入住</div><div v-else-if=' item.isEndDay'>离店</div>
                    <div v-else>
                      <span v-if='item.isHoliday'>休</span>
                      <span v-else>{{item.chineseCalendar}}</span>
                    </div>
                  </div>
                  <div class='middle' v-bind:class="{isHoliday:item.isHoliday,isHide:item.dayHide}">
                    <span v-if="item.isTodayNow">今</span>
                    <span v-else>{{item.id}}</span>
                  </div>
                  


                  <div class="bottom">
                    <span class="hasPrice" v-if='item.price>0'>&yen;{{item.price}}</span></div>
                </div>
              </li>
              <div class="display:none" v-bind:class="{isMark:item.isMark,isDisable:item.isDisable,isToday:item.isToday&&item.isMark}"></div>
            </div>
          </div>
        </div>
      </div>
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
        thisDate: new Date().format('yyyy/mm/dd'),
        times: [],
        thisTime: [],
        compareTime: [],
        chooseStartDate: false,
        chooseEndDate: false,
        selectMode: 0, //用在判断是否是选择范围，0表示不是，1是在选起始时间，2是在选结束时间
        textTop: ['日', '一', '二', '三', '四', '五', '六'],
        myData: [],
        list: [],
        isClickToday: false,
        onlyDate: false,
        onlyTime: false,
        dateRange: false,
        swiperIndex: 1,
        swiperMonthIndex: 19,
        totalDays: 0,
        dateTop: '',
        startDateStr: '___',
        endDateStr: '___',
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
      displayMode: {
        type: Number,
        default: 1
      }, //3、飞机票，2、火车票，4、酒店
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
      //隐藏其他时间范围外日期
      isHideOtherday: {
        type: Boolean,
        default: true
      },
      dateDistance: {
        type: Number,
        default: 30
      },
      agoDayHide:{ 
        default: '0' 
      },//某个日期以前的不允许点击 时间戳长度是 10 位，0代表禁用
      futureDayHide: { 
        default: ''
      },//某个日期以后的不允许点击 时间戳长度是 10 位

      beginDate: {
        default: null,
      },
    },

    created() {
      this.myData = new Date();
    },
    mounted() {
      this.createDate();
      this.setDisplayMode();
    },
    watch: {
      // markedRange: {
      //   handler(val) {
      //     console.log( val);
      //     const that = this;
      //     if (val.length = 2 && !isNaN(Date.parse(val[0]))) {
      //       that.setDate(new Date(val[0]).getTime() / 1000);
      //     }
      //   },
      //   deep: true
      // },
      markedRange: function (newVal, oldVal) {
      },

        /**
         * 扩展函数：监听beginDate，并执行原函数setDate
         */
        beginDate: {
            handler(newVal, oldVal){
                if(!newVal){
                    return;
                }
                let seconds = null;
                if(newVal.constructor == Date){//直接传入Date数据
                    newVal = newVal.getTime();
                }else if(newVal.constructor == String){//传入日期字符串  比如yyyy/MM/dd hh:mm:ss等
                    try{
                        seconds = new Date(newVal).getTime();
                    }catch (e) {
                        console.error(e);
                    }
                }else if(!isNaN(newVal)){//传入getTime()返回的毫秒数
                    seconds = newVal;
                }else {
                    throw new Error('日历传入时间格式不正确');
                }
                this.setDate(seconds / 1000);//函数中将参数乘以了1000，为了不改动原函数，所以这里除以1000
            },
            immediate: true
        }
    },
    methods: {
      //根据标记区间重新渲染日历
      resetViewByRange() {
        const that = this;
        let val =JSON.parse(JSON.stringify(that.markedRange));
        if (val.length = 2 && !isNaN(Date.parse(val[0]))) {
          // that.createDate();
          let array = [];
          let chooseDay = new Date();
          // if (!!chooseMonth) {
          //   array.push({
          //     'daylist': that.getList(new Date(), chooseDay, false),
          //     'date': chooseDay
          //   });
          // } else {
            array.push({
              'daylist': that.getList(chooseDay),
              'date': chooseDay
            });
          // }
          //根据场景，用下个月第一天去带入，得到新的月
          let totalMonth = 2;
          if (that.displayMode == 3) {
            totalMonth = 12;
          } else if (that.displayMode == 4) {
            totalMonth = 6;
          } else if (that.displayMode == 2 && new Date().getMonth() == new Date(new Date().getTime() + 30 * 864e5).getMonth()) {
            totalMonth = 1;
          }
          for (let i = 1; i < totalMonth; i++) {
              let _date = new Date(chooseDay.valueOf());
              _date.setDate(1);
              _date.setMonth(_date.getMonth()+1);
              chooseDay = _date;
            array.push({
              'daylist': that.getList(_date),
              'date': _date
            });
          }
          if (totalMonth == 2) {
            array[1].daylist.forEach((val) => {
              if (!!val.date && (new Date(val.date) - new Date()) > 30 * 864e5) {
                val.dayHide = true;
              }
            })
          }
          that.swiperList = array;
        }
      },
      //低价日历注入价格
      addPrice(priceList) {
        const that = this;
        that.swiperList.forEach((month, swiperIndex) => {
          month.daylist.forEach((day, index) => {
            priceList.forEach(priceDay => {
              if (that.swiperList[swiperIndex].daylist[index].date == priceDay.departDate) {
                day.price = priceDay.ticketPrice;
              }
            })
          })
        })
        that.$forceUpdate();
      },
      //节假日的注入
      setHoliday(holidayList) {
        const that = this;
        that.swiperList.forEach((month, swiperIndex) => {
          month.daylist.forEach((day, index) => {
            holidayList.forEach(priceDay => {
              if (that.swiperList[swiperIndex].daylist[index].date == priceDay.gregorianCalendarYear) {
                if (!!priceDay.leagalHolidays) {
                  day.chineseCalendar = priceDay.gregorianCalendarYear;
                  day.isHoliday = true;
                } else if (priceDay.solarTerms) {
                  day.chineseCalendar = priceDay.solarTerms
                } else {
                  day.chineseCalendar = priceDay.chineseCalendarDay
                }
              }
            })
          })
        })
        that.$forceUpdate();
      },
      handleTotalDays() {
        const that = this;
        if (that.markedRange[0] != 0 && that.markedRange[1] != 0) {
          that.totalDays = parseInt((new Date(that.markedRange[1]) - new Date(that.markedRange[0])) /
            24 / 36e5);
        } else {
          that.totalDays = 0
        }

      },
      indexToWeek(index, type) {
            if(0>Number(index)||6<Number(index)) return '';
            let dayCycleArray = ['一','二','三','四','五','六'];
            (1==type||2==type)?dayCycleArray.unshift('天'):dayCycleArray.unshift('日');
            return (1==type?'星期':(2==type?'礼拜':'周')) + dayCycleArray[index];
      },
      strWeek(data, type) {
        const that = this;
        //防止没有赋值的时候执行
        if (data[0] != 0 && data[1] != 0) {
          if (type == 'start') {
            return that.indexToWeek(new Date(data[0]).getDay())
          } else {
            return that.indexToWeek(new Date(data[1]).getDay())
          }
        }
      },
      strDate(data, type) {
        const that = this;
        that.handleTotalDays();
        if (data[0] != 0 && data[1] != 0) {
          if (type == 'start') {
            return new Date(data[0]).format('MM月dd日')
          } else {
            return new Date(data[1]).format('MM月dd日')
          }
        }
      },
      //填充对应月份
      isThisMonth(item) {
        return item.id == (new Date(item.date).getMonth() + 1)
      },
      cancel() {
        const that = this;
        that.thisTime = that.compareTime;
        this.$emit('commitDate', '');
      },
      switchSelect(type) {
        const that = this;
        if (type == 'date' || type == 'startDate' || type == 'endDate') {
          if (type == 'startDate') {
            that.chooseStartDate = true;
            that.chooseEndDate = false;
          } else if (type == 'endDate') {
            that.chooseEndDate = true;
            that.chooseStartDate = false;
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
      setSelectedDay (date) {
          this.swiperList.forEach((el, i) => {
              el.daylist.forEach((day, i) => {
                  if (day.date) {
                      day.isToday = day.date === date
                  }
              })
          })
      },
      /*无限切换日历思路
       * 1、swiper实际上只有3页
       * 2、没切换到前一页或者后一页后，这三页会重置，index也会重置
       * */
      //用来注入时间
      setDate(timeStamp) {
        const that = this;
        this.$emit('changeDate', timeStamp);
        const chooseDay = new Date(timeStamp * 1000);
        const week = Math.ceil((chooseDay.getDate() + 6 - chooseDay.getDay()) / 7);
        const index = chooseDay.getDay() + (week - 1) * 7;
        const item = {
          id: index,
          date: chooseDay,
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
          const chooseMonth = {
            'year': chooseDay.getFullYear(),
            'month': chooseDay.getMonth() + 1,
            'day': chooseDay.getDate()
          };
          // this.createDate(chooseMonth);
          //增加判断是重新渲染哪一页的
          const swiperIndex = (chooseMonth.year - new Date().getFullYear() == 0) ? (chooseMonth.month - new Date().getMonth() -
            1) : (chooseMonth.month - new Date().getMonth() + 11);
          const dayIndex = (chooseMonth.year - new Date().getFullYear() == 0 && chooseMonth.month - new Date().getMonth() ==
            1) ? (chooseDay.getDate() - new Date().getDate() + new Date().getDay()) : index;
          that.clickDay(item, dayIndex, false, swiperIndex);
        }, 200);
      },
      createDate(chooseMonth, type) {
        const that = this;
        let chooseDay = '';
        that.swiperList = [];
        if (chooseMonth) {
          //做日期的注入，并模拟点击操作
          if (!!chooseMonth.day && type) {
            chooseDay = new Date(chooseMonth.year, chooseMonth.month - 1, chooseMonth.day);
            //                        const week = (chooseMonth.day % 7) == 0 ? (chooseMonth.day / 7 + 1) : (Math.ceil(chooseMonth.day / 7));
            const week = Math.ceil((chooseDay.getDate() + 6 - chooseDay.getDay()) / 7);
            const index = chooseDay.getDay() + (week - 1) * 7;
            const item = {
              id: index,
              date: chooseDay,
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
        } else {
          chooseDay = new Date();
        }
        let array = [];
        if (!!chooseMonth) {
          array.push({
            'daylist': that.getList(new Date(), chooseDay, false),
            'date': chooseDay
          });
        } else {
          array.push({
            'daylist': that.getList(chooseDay),
            'date': chooseDay
          });
        }
        //根据场景，用下个月第一天去带入，得到新的月
        let totalMonth = 2;
        if (that.displayMode == 3) {
          totalMonth = 12;
        } else if (that.displayMode == 4) {
          totalMonth = 6;
        } else if (that.displayMode == 2 && new Date().getMonth() == new Date(new Date().getTime() + 30 * 864e5).getMonth()) {
          totalMonth = 1;
        }
        for (let i = 1; i < totalMonth; i++) {
            let _date = new Date(chooseDay.valueOf());
            _date.setDate(1);
            _date.setMonth(_date.getMonth()+1);
            chooseDay = _date;
          array.push({
            'daylist': that.getList(_date),
            'date': _date
          });
        }
        if (totalMonth == 2) {
          array[1].daylist.forEach((val) => {
            if (!!val.date && (new Date(val.date) - new Date()) > 30 * 864e5) {
              val.dayHide = true;
            }
          })
        }
        that.swiperList = array;
      },
      strMonth(item) {
        const that = this;
        const chooseDay = item.date;
        if (chooseDay instanceof Date) {
          const mygetMonth = chooseDay.getMonth() + 1 < 10 ? '0' + (chooseDay.getMonth() + 1) : chooseDay.getMonth() +
            1;
          return chooseDay.getFullYear() + '年' + mygetMonth + '月';
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
            this.$emit('commitDate', dateRange);
          } else {
            this.$emit('commitDate', date);
          }
        }
      },
      clickDay(item, index, type, swiperIndex) {
        //type 用来判断是模拟的点击（false）还是真实的点击（true）
        const that = this;
        //用来判断是否有重置选择时间段的操作
        let isReset = false;
        // 用来判断是否在选择时间范围
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
          if (that.dateRange && type) {
            if (that.chooseStartDate) {
              //即选择的日期小于当前截止，或者截止未设置
              if (new Date(that.swiperList[swiperIndex].daylist[index].date).getTime() <= new Date(that.markedRange[
                  1]).getTime() || that.markedRange[1] == 0) {
                that.hasRender = true;
                that.chooseStartDate = false;
                that.chooseEndDate = true;
                that.markedRange[0] = new Date(that.swiperList[swiperIndex].daylist[index].date).format("yyyy/M/dd");
                that.startDateStr = new Date(that.swiperList[swiperIndex].daylist[index].date).format(
                  "yyyy年MM月dd日");
                that.createDate();
              } else {
                //重置日历
                isReset = true;
              }

            } else if (that.chooseEndDate) {
              if (new Date(that.swiperList[swiperIndex].daylist[index].date).getTime() >= new Date(that.markedRange[
                  0]).getTime()) {
                that.hasRender = true;
                that.chooseStartDate = true;
                that.markedRange[1] = new Date(that.swiperList[swiperIndex].daylist[index].date).format("yyyy/M/dd");
                that.endDateStr = new Date(that.swiperList[swiperIndex].daylist[index].date).format("yyyy年MM月dd日");
                that.createDate();
              } else {
                //重置日历
                isReset = true;
              }
            }
          } else if (!that.dateRange) {
            that.swiperList.forEach((list) => {
              list.daylist.forEach((day) => {
                !!day.isToday ? (day.isToday = false) : ''
              })
            });
            !!swiperIndex ? '' : (swiperIndex = 0);
            that.swiperList[swiperIndex].daylist[index].isToday = true;
          }
        }

        if (isReset && !hasRender) {
          // 否则清除范围，置空并选择起始点，并标记当前时间为起始时间
          that.markedRange[0] = new Date(that.swiperList[swiperIndex].daylist[index].date).format("yyyy/M/dd");
          that.markedRange[1] = 0;
          that.chooseStartDate = false;
          that.chooseEndDate = true;
          const date = new Date(item.date);
          if (date.getTime() > 0) {
            that.startDateStr = new Date(that.swiperList[swiperIndex].daylist[index].date).format(
              "yyyy年MM月dd日");
            that.endDateStr = '请选择结束日期';
            that.createDate();
          }
        }
        if (that.chooseEndDate && that.dateRange && that.chooseStartDate && that.chooseEndDate) {
          const dateRange = {
            'startTime': new Date(that.startDateStr.slice(0, 4), that.startDateStr.slice(5, 7) - 1, that.startDateStr
              .slice(8, 10)),
            'endTime': new Date(that.endDateStr.slice(0, 4), that.endDateStr.slice(5, 7) - 1, that.endDateStr.slice(8,
              10))
          };
          this.$emit('commitDate', dateRange)
        }
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
        that.myData = that.getNextMonth(that.myData);
      },
      getPreMonth(date) {
          return date.setMonth(date.getMonth()-1);
      },
      getNextMonth(date) {
          return date.setMonth(date.getMonth()+1);
      },
      getDaysInOneMonth(date) { //天数
        let getyear = date.getFullYear();
        let getmonth = date.getMonth() + 1;
        getmonth = parseInt(getmonth, 10);
        let d = new Date(getyear, getmonth, 0);
        return d.getDate();
      },
      getList(date, chooseDay, isStartMonth) {
        const that = this;
        const markedRange = that.markedRange;
        if (!date) {
          date = new Date();
        }
        if (!!chooseDay) {
          chooseDay = new Date(chooseDay).format("yyyy/M/d");
        }
        let array = [];
        for (let i = date.getDate(); i <= (this.getDaysInOneMonth(date)); i++) {
          let month = '';
          let day = '';
          if (date.getMonth() + 1 >= 10) {
            month = date.getMonth() + 1
          } else {
            month = '0' + (date.getMonth() + 1)
          }
          if (i >= 10) {
            day = i
          } else {
            day = '0' + i
          }
          let nowTime = date.getFullYear() + '/' + month + '/' + day;
          if (
            this.dateFormat(new Date()) ==
            this.dateFormat(new Date(nowTime))
          ) {
            array = array.concat({
              id: i,
              date: nowTime,
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
          } else {
            array = array.concat({
              id: i,
              date: nowTime,
              isTodayNow: false,
              isToday: !that.dateRange && chooseDay == nowTime,
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
        //对于起始的月，如果起始时间不是周日，则做补全；
        if (date.getDay() > 0) {
          let emptyArr = [];
          for (let i = 0; i < date.getDay(); i++) {
            emptyArr.push({
              id: date.getDate() - date.getDay() + i,
              dayHide: true
            });
          }
          array = [...emptyArr, ...array]
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
        }
      }
    },
    watch: {
      displayMode(val, oldVal) {
        const that = this;
        that.createDate();
        that.setDisplayMode();
      },
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
      },
    }
  };

</script>
<style lang="less" scoped>
  @import './calendar.less';

</style>
