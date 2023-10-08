<template>
 
    <div class="main">

      <!--页面顶部标题栏-->
      <div class="tripDate">
        <div @click="searchTrain('preDay')" class="arrow cursorp" :class="{'none':noYesterday}"><icon type='icon_common_leftarrow' size='.24'></icon>前一天</div>
        <div class="date cursorp" @click="showCalendar=true">
          <div><icon type='calendar' size='.32'></icon>{{startDateStr+' '+startWeekStr}}</div>
        </div>
        <div @click="searchTrain('nextDay')" class="arrow right cursorp" :class="{'none':noFutrueday}">后一天<icon type='icon_common_rightarrow' size='.24'></icon></div>
      </div>


      <div class="loading-wrap" v-if="loading">
        <LoadingX tip='获取火车车次中，请稍候...' :spinning="true" :turn="true"/>
      </div>
      <!--页面中部的空列表显示-->
      <EmptyX class="trainListEmpty" v-else-if="!loading && noFlag" tipsText='没有符合条件的车次' />
      <!--页面中部的车次列表-->
      <div v-else class="list" id="list">
        <div class="train" v-for="(train,index) in trainList" :key="index" ref="trainList" @click="gotoDetail(train)" >
          <div class="trainLabel">
            <div class="trainDetail">
              <div class="station">
                <div v-if="!judgeSaleFlagNo(train)" class="time num-font">{{train.goTime}}</div>
                <div class="station">{{train.startStation}}</div>
              </div>
              <div class="arrow">
                <div class="code">{{train.trainCode}}</div>
                <!-- <img src="~svg/icon_train_jingting@2x.svg" /> -->
                <img src="~themes/default/img/icon_train_jingting@2x.svg" />
                <div v-if="!judgeSaleFlagNo(train)" class="time">{{train.runTimeFormat}}</div>
              </div>
              <div class="station toRight">
                <div v-if="!judgeSaleFlagNo(train)" class="time num-font">{{train.endTime}}<span class="plus" v-if="train.runDays>0">+{{train.runDays}}</span></div>
                <div class="station">{{train.toStation}}</div>
              </div>
              <div class="miniPrice num-font">
                <p>
                    <span>￥</span><span>{{train.minPrice}}</span>
                </p>
                <span class="coupon-label" v-if="!!train.CanUseCoupon&&Object.keys(train.CanUseCoupon).length>0&&!!train.CanUseCoupon.TrainCanUseCoupon&&train.CanUseCoupon.TrainCanUseCoupon.length>0">
                  {{getBestCoupon(train)}}
                </span>
              </div>
            </div>
            <div class="nearAlert" v-if='checkIsNearGo(train)'>
              距离发车时间不足半小时，已停止网络售票
            </div>  
            <div class="banning" v-else>
              <div v-if="0 < parseInt(train.saleFlag)">
                <span>
                  <span class="ticNum red">
                      <template v-if="2 == parseInt(train.saleFlag)">{{train.saleDateTime}}</template>
                      {{SaleFlagMap[train.saleFlag]}}
                      <template v-if="3 == parseInt(train.saleFlag)">{{train.saleDateTime}}</template>
                  </span>
                </span>
              </div>
              <div v-else>
                <span v-for="(item,index) in handleTrainBanning2List(train)" :key="index" class="seatAbout" :class="{seatAboutShort:handleTrainBanning2List(train).length<=3}">
                  <span class="ticNum" :class="{gray:item.leave==0}">{{item.name}}: </span>
                  <span class="ticPrice" :class="{gray:item.leave==0}" v-show="showPrice">￥{{item.price}}</span>
                  <span class="ticNum leave" :class="{gray:item.leave==0,red:0<item.leave && item.leave<10}" v-show="!showPrice">{{setSetShowText(item.leave)}}</span>
                </span>
              </div>
            </div>


          </div>
        </div>
      </div>
      <!--页面底部导航栏-->
      <transition name="showBar">
        <div class="footerBar pcDialog" v-show='showFootBar'>
          <div @click="filterTrainPop" class="option first cursorp">
            <icon :type="!hasFilter?'icon_filter_screen':'icon_filter_screen_sel'" size='.24' />
            <div :class="{isSelected :hasFilter}">筛选</div>
          </div>
          <div @click="orderByTime('start',true)" class="option second cursorp">
            <icon :type="orderType!='start'?'icon_train_sort':'icon_train_sort_sel'" size='.24' />
            <div v-show="orderType!='start'" v-bind:class="{isSelected :orderType=='start'}">发车
            </div>
            <div v-if="orderType=='start' && !runTimeAsc" v-bind:class="{isSelected :orderType=='start'}">
              <span>发车</span><span class="direct">(晚<img class="arrow" src="~assets/img/trainList/sArrowBlue.png">早)</span>
            </div>
            <div v-if="orderType=='start' &&  runTimeAsc" v-bind:class="{isSelected :orderType=='start'}">
              <span>发车</span><span class="direct">(早<img class="arrow" src="~assets/img/trainList/sArrowBlue.png">晚)</span>
            </div>
          </div>
          <div @click="orderByTime('total',true)" class="option third cursorp">
            <icon :type="orderType!='total'?'icon_time':'icon_time_sel'" size='.24' />
            <div v-if="orderType!='total'" v-bind:class="{isSelected :orderType=='total'}">耗时
            </div>
            <div v-if="orderType=='total' && !totalTimeAsc" v-bind:class="{isSelected :orderType=='total'}">
              <span>耗时</span><span class="direct">(长<img class="arrow" src="~assets/img/trainList/sArrowBlue.png">短)</span>
            </div>
            <div v-if="orderType=='total' && totalTimeAsc" v-bind:class="{isSelected :orderType=='total'}">
              <span>耗时</span><span class="direct">(短<img class="arrow" src="~assets/img/trainList/sArrowBlue.png">长)</span>
            </div>
          </div>
          <div @click="switchMode" class="option priceOption cursorp">
            <icon type="icon_train_price" size='.24' />
            <div><span v-bind:class="{isSelected :showPrice}">票价</span>/<span v-bind:class="{isSelected :!showPrice}">余票</span></div>
          </div>
        </div>
      </transition>
      <!--弹出框筛选组件-->
      <div v-transfer-dom class="trainListWrap">
        <popup v-model="showFilterPop" is-transparent class="train-filter">
            <!-- 火车票筛选组件 -->
            <trainFilter ref='trainFilter'  @closePopup="closePopup" @filterTrain='filterTrain' :stationStartList='stationStartList' :allOptionProps='allFilterOption' :stationEndList='stationEndList'></trainFilter>
        </popup>
      </div>
      <!--弹出框日历组件-->
      <div v-transfer-dom>
        <popup v-model="showCalendar" position="bottom" :show-mask="true" hide-on-blur style="min-height: 10rem;background: #ffffff ">
          <div class="calendar">
            <CalendarNewX ref="calendar" @changeDate="choseDayChange" :futureDayHide="futureDayHide" :agoDayHide="new Date(new Date().format('yyyy/MM/dd')).getTime()" :displayMode=2></CalendarNewX>
          </div>
        </popup>
      </div>
    </div>


</template>

<script>
  import trainFilter from 'trainComponents/trainComp/trainFilter/trainFilter.vue';
  import {getBestCoupon} from 'components/coupon/js/requestHandler.js';
  import trainHandler from 'trainHandler/common/lib/trainHandler.js';
  import mixin from 'trainHandler/common/lib/trainMixin.js';
  import {
    Popup,
    TransferDom
  } from 'vux';
  import icon from "components/icon/index.vue"
  import LoadingX from "components/loading/index";
  import EmptyX from "components/empty/EmptyX.vue";
  import CalendarNewX from "components/calendarNew/CalendarNewX.vue";
  export default {
    mixins: [trainHandler.mixin.tChatEventMixin,mixin],
    directives: {
      TransferDom
    },
    components: {
      Popup,
      CalendarNewX,
      LoadingX,
      EmptyX,
      trainFilter,
      icon
    },
    // mixins: [mixin],
    data: function () {
      let that = this;
      return Object.assign(this.setData(), {
        scrollInterval:null,
        lastScrollTop: null, //滚动的标记位
        hasFilter: false, //标记底部导航栏的筛选按钮是否高亮
        runTimeAsc: true, //标记底部导航栏的发车按钮是否高亮
        totalTimeAsc: false, //标记底部导航栏的耗时按钮是否高亮
        orderType: 'start', //标记列表的显示规则是那种类型：发车时间 还是 耗时
        stationStartList: [], //出发站车站列表，用于 底部导航栏 筛选 按钮
        stationEndList: [], //到达站车站列表，用于 底部导航栏 筛选 按钮
        isConfirm: false, //标记是否设置了筛选条件
        showFilterPop: false, //筛选组件的指示变量
        showPrice: false, //列表显示票价的指示变量 与显示票数相反
        showCalendar: false, //日历组件的指示变量
        showFootBar: true, //底部筛选的指示变量
        startDateStr: '', //订票的日期，用于显示
        startWeekStr: '', //订票的星期，用于显示
        startDate: '', //订票的日期，用于逻辑计算
        loading: false, //页面加载标记
        noFlag:false,//表示是否有火车列表数据
        trainList: [], //列表上显示车次列表数据源
        trainListAll: [], //车次列表，一个临时数据源
        searchDate: trainHandler.getStorage('startDate'), //订票日期，用于日历组件的设置
        noYesterday:false,
        noFutrueday:false,
        SaleFlagMap:{//异常状态的车次描述
            "0":'正常车次',
            "1":'列车运行图调整，暂停发售',
            "2":'起售',
            "3":'暂售至',
            "4":'列车停运',
        },
        allFilterOption:{//所有的筛选条件集合
          trainTypeOption:[],//trainTypeList的结果集
          timeOption:[],//timeOptionList的结果集
          stationStartOption:[],//出发站的结果集
          stationEndOption:[]//到达站的结果集
        },
        futureDayHide: new Date(new Date().format('yyyy/MM/dd')).getTime()+29*24*3600000
      });
    },
    watch: {
      startDateStr:function(newVal,oldVal){
        let that = this;
        let today = new Date().format("MM月dd日");
        let futrue = new Date(that.futureDayHide).format("MM月dd日");
        
        if(newVal == today){
          that.noYesterday = true;
        }else{
          that.noYesterday = false;
        }

        if(newVal == futrue){
          that.noFutrueday = true;
        }else{
          that.noFutrueday = false;
        }
      }
    },
    // beforeRouteEnter(to, from, next) {    
    //   this.addScrollListener();
    // },
    activated: function () {
      const that = this;
      this.setData();
    //   that.registerEvent();
      let cacheSearchDate = trainHandler.getStorage('startDate');
      document.title = trainHandler.getStorage('fromCity') + '-' + trainHandler.getStorage('toCity');
      that.refreshData();
      that.addScrollListener();
    },
    deactivated: function () {
      this.removeScrollListener();
    },
    created: function () {
      const that = this;
    //   that.registerEvent();
      document.title = trainHandler.getStorage('fromCity') + '-' + trainHandler.getStorage('toCity');
      that.refreshData();
    },
    mounted: function () {
      this.addScrollListener();
    },
    updated: function () {},
    beforeDestory: function () {
      this.removeScrollListener();
    },
    destroyed(){},
    beforeRouteLeave(to, from, next) {
      let checkOut = false;
      const that = this;
      if (that.showFilterPop) {
        that.closePopup();
      } else {
        checkOut = true;
      }
      checkOut ? next() : next(false);
      this.removeScrollListener();
    },
    methods: {
        registerEvent(){
            const that = this;
            //注册并监听t信返回事件
            // sinosdk.sino.onBack(function(){
            //   trainHandler.throttle(function() {
            //     trainHandler.stateManager.closeTopPop(()=>{
            //       let fromChange = that.$route.query.fromChange;
            //       if(fromChange && fromChange=='changeTickets'){//此时说明是改签跳转过来的这时候需要路由回退
            //         that.$router.back();
            //       }else{
            //         sinosdk.sino.back('');
            //       }    
                  
            //     })
            //     }.bind(this));
            // },that);
            // trainHandler.reFreshPage(() => {
            //    that.refreshData();
            // });
        },
        goBackFun(){
            const that = this;
            let fromChange = that.$route.query.fromChange;
            if(fromChange && fromChange=='changeTickets'){//此时说明是改签跳转过来的这时候需要路由回退
            that.$router.back();
            }else{
            sinosdk.sino.back('');
            }
        },
        refreshData(){
          const that = this;
          that.isSelectGD();
          that.setDate();
          that.searchTrain();
          //去缓存拿筛选条件
          that.getOptionFromStorage();
        },

        setData(){
          let that = this;
          return  trainHandler.stateManager.setData([
            //显示日历
            'showCalendar',
            //显示筛选
            {
              name: 'showFilterPop',
              hide:{
                callback(){
                  that.closePopup();
                }
              }
            },
          ], this);
        },
        /**
         * 判断筛选条件 缓存里面有没有 有的话记住先拿缓存里面的
         */ 
        async getOptionFromStorage(){
          let that = this;
          await trainHandler.authInterceptor(); //等待授权完成，才能取到primaryKey
          //缓存里期火车票列表筛选票价/余票 showPrice 这个变量来判断 默认为false  即显示余票
          let isShowPrice = trainHandler.getStorage(trainHandler.primaryKey + 'showPrice');
          if(isShowPrice){
            that.showPrice = JSON.parse(isShowPrice);
          }else{
            that.showPrice = false; //默认为false
          }

          //缓存里面取发车早晚和耗时长短
          let orderType = trainHandler.getStorage(trainHandler.primaryKey + 'orderType');
          let runTimeAsc = trainHandler.getStorage(trainHandler.primaryKey + 'runTimeAsc');
          let totalTimeAsc = trainHandler.getStorage(trainHandler.primaryKey + 'totalTimeAsc');
          if(orderType){
            that.orderType = orderType;
          }else{
            that.orderType = 'start';
          }
          if(runTimeAsc){
            that.runTimeAsc = JSON.parse(runTimeAsc);
          }else{
            that.runTimeAsc = true; //默认为true 默认是从早到晚
          }
          if(totalTimeAsc){
            that.totalTimeAsc = JSON.parse(totalTimeAsc);
          }else{
            that.totalTimeAsc = false; //false
          }
        },
        /**
         * 设置显示的日期
         */ 
        setDate(){
            let that = this;
            //设置页面一些显示数据，日期
            that.trainList = [];
            that.searchDate = trainHandler.getStorage('startDate');
            that.startDateStr = new Date(that.searchDate).format('MM月dd日');
            that.startWeekStr = trainHandler.indexToWeek(new Date(that.searchDate).getDay(), 1);
            setTimeout(() => {
                that.$refs.calendar.setDate(new Date(that.searchDate).getTime() / 1000);
            }, 50);
            that.startDateStr = new Date(that.searchDate).format('MM月dd日');
            that.startWeekStr = trainHandler.indexToWeek(new Date(that.searchDate).getDay(), 1);
        },
        /**
         * 获取最优惠的优惠券价格
         */  
        getBestCoupon(cabin){
            let that = this;
            if(!!cabin.CanUseCoupon&&Object.keys(cabin.CanUseCoupon).length>0&&!!cabin.CanUseCoupon.TrainCanUseCoupon&&cabin.CanUseCoupon.TrainCanUseCoupon.length>0){
                
                let couponBox=cabin.CanUseCoupon.TrainCanUseCoupon[0] // 后台大小排序，取第一个
                let sendBox={}
                sendBox.CanUseCoupon=[]
                sendBox.CanUseCoupon.push(couponBox)
                    return getBestCoupon(sendBox);
            }else{
                return 
            }
            
        },
        /**
         * 监听滚动条，开始滚动时隐藏筛选栏，在结束滚动时显示
         */
        addScrollListener(){
          document.body.addEventListener('scroll', this.handleScrollIOS, true);
        },
         /**
         * 移除滚动条相关的监听事件。否则在下一个路由页面，这些事件还是存在
         */
        removeScrollListener(){
           document.body.removeEventListener('scroll', this.handleScrollIOS, true);
        },
        //ios滚动行为特殊处理
        handleScrollIOS() {
          const that = this;
          let listDom = document.getElementById('list');
          if (!listDom) {
              return;
          }
          const scrollTop = window.pageYOffset || listDom.scrollTop || document.body.scrollTop;
          if (scrollTop > that.lastScrollTop) {
              that.showFootBar = false
          } else {
              that.showFootBar = true
          }
          that.lastScrollTop = scrollTop;
        },
        /**
         * 控制底部筛选的显隐
         */
        handleScroll() {
            const that = this;
            let listDom = document.getElementById('list');
            if (!listDom) {
                return;
            }
            let scrollTop = window.pageYOffset || listDom.scrollTop || document.body.scrollTop;

            if(that.scrollInterval == null) {
                // 未发起时，启动定时器，1秒1执行
                that.scrollInterval = setInterval(function() {
                    let currScrollTop = window.pageYOffset || listDom.scrollTop || document.body.scrollTop;
                    if(currScrollTop == that.lastScrollTop) {
                        that.showFootBar = true;
                        clearInterval(that.scrollInterval);
                        that.scrollInterval = null;
                    }
                }, 500);
            }
            if (scrollTop != that.lastScrollTop) {
                that.showFootBar = false
            }
            that.lastScrollTop = scrollTop;
        },
      /**
       * 日历组件的回调函数，里面做一些必要的业务
       * @param {Object} date 日期
       */
      choseDayChange(date) {
        const that = this;
        if (that.showCalendar) {
        //   if (new Date(startDate).getTime() - new Date(new Date().format("yyyy/MM/dd")).getTime() > 29 * 24 *3600000) {
        //     trainHandler.showToast('火车票预售期为三十天，请注意时间范围')
        //   }
          that.searchDate = new Date(date * 1000).format("yyyy/MM/dd");
          that.startDateStr = new Date(that.searchDate).format('MM月dd日');
          that.startWeekStr = trainHandler.indexToWeek(new Date(that.searchDate).getDay(), 1);
          that.$forceUpdate();
          that.searchTrain();
        }
        that.showCalendar = false;
      },
      /**
       * 底部导航栏的筛选按钮点击事件
       * @param {Object} 无
       */
      filterTrainPop() {
        const that = this;
        that.showFilterPop = true;
        //深拷贝现有的筛选条件
        that.$refs.trainFilter.allOption = JSON.parse(JSON.stringify(this.allFilterOption));
      },
      /**
       * 处理火车列表数据，生成席位列表、推荐席位等数据 生成banningList数组用于显示座席详情
       * @param {Object} list 车次列表数据源
       */
      handleBanningData(list) {
        const that = this;
        let newArr = list;
        list.forEach((train, index) => {
          const list = that.handleTrainBanning2List(train);
          newArr[index]['banningList'] = list;
        });
        that.trainList = newArr;
      },
      /**
       * 关闭筛选组件
       * @param {Object} 无
       */
      closePopup() {
        const that = this;
        that.showFilterPop = false;
        that.$refs.trainFilter.allOption = that.allFilterOption;
      },
      /**
       * 查询火车票
       * @param {Object} type 前一天还是后一天
       */
      searchTrain(type) {
        const that = this;
        let startDate = that.searchDate;
        if (!!type) {
          if (type == 'preDay') {
            startDate = new Date(new Date(startDate).getTime() - 24 * 3600000).format("yyyy/MM/dd");
          } else if (type == 'nextDay') {
            startDate = new Date(new Date(startDate).getTime() + 24 * 3600000).format("yyyy/MM/dd");
          }
        }
        if (new Date(startDate).getTime() < new Date(new Date().format("yyyy/MM/dd")).getTime()) {
          trainHandler.showToast('请选择大于等于当前的日期');
        } else if (new Date(startDate).getTime() - new Date(new Date().format("yyyy/MM/dd")).getTime() >= 30 * 24 * 3600000) {
          trainHandler.showToast('火车票预售期为三十天，请注意时间范围')
        } else {
          if(!that.$parent.loading){
            that.loading = true;
          }
          that.trainList = [];
          that.searchDate = startDate;
          const obj = {
            "fromStation": trainHandler.getStorage('fromCity'),
            "toStation": trainHandler.getStorage('toCity'),
            "fromDate": startDate,
            "trainType": 0 //默认获取所有的车次类型，同时前端自行进行高铁动车的筛选
          };
          that.startDateStr = new Date(startDate).format('MM月dd日');
          that.startWeekStr = trainHandler.indexToWeek(new Date(startDate).getDay(), 1);
          
          trainHandler.setStorage('startDate', startDate);
          //更新日历组件的
          that.setDate();
          trainHandler.getTrainQuery(obj).then((res) => {
            that.loading = false;
            that.$emit('showOff', true);
            if (!!res.result) {
              //存储火车票退改政策
              trainHandler.setStorage('queryKey', res.result.queryKey);
              trainHandler.setStorage('trainPolicy', res.result.policy);
              let list = res.result.trainList;              

              //解析出座席对象生成banningList数组
              that.handleBanningData(list);

              that.getTrainList(); //从车次列表解析出 车站列表数据
             
              that.trainListAll = JSON.parse(JSON.stringify(that.trainList));
              that.filterTrain(that.allFilterOption);
            }
          }).catch((err) => {
            that.$emit('showOff', true);
            that.loading = false;
            that.noFlag = true;
          });
        }
      },

      /**
       * 底部导航栏的 发车、耗时 按钮点击事件，对车次列表排序并显示
       * @param {Object} type 发车 还是 耗时
       */
      orderByTime(type,reverse=false) {
        const that = this;
        that.orderType = type;
       //将筛选条件存入缓存 发车早晚和耗时长短
        trainHandler.setStorage(trainHandler.primaryKey + 'orderType',that.orderType);
        if (type == 'start') { //早晚排序
          //是否需要更改排序方式。如果是用户主动选择排序，则每次要颠倒；如果是查询列表时的排序，则不用颠倒
          if(reverse){
            that.runTimeAsc = !that.runTimeAsc;
            that.totalTimeAsc = false;
            //将筛选条件存入缓存
            trainHandler.setStorage(trainHandler.primaryKey + 'runTimeAsc',that.runTimeAsc);
            trainHandler.setStorage(trainHandler.primaryKey + 'totalTimeAsc',that.totalTimeAsc);
          }
          let today = new Date().format('yyyy/MM/dd');
          const compare = (x, y) => {
            let totalMinuteX = new Date(today + ' ' + x.goTime);
            let totalMinuteY = new Date(today + ' ' + y.goTime); 
            if (totalMinuteX < totalMinuteY) {
              return  that.runTimeAsc ? -1 : 1;
            } else if (totalMinuteX > totalMinuteY) {
              return that.runTimeAsc ? 1 : -1;
            } else {
              return 0;
            }
          };
          //根据出发时间正序排列 arrayNew是早到晚
          that.trainList = that.trainList.sort(compare);           
        } else if( type == 'total') {//耗时排序
          //是否需要更改排序方式。如果是用户主动选择排序，则每次要颠倒；如果是查询列表时的排序，则不用颠倒
         if(reverse){
           that.totalTimeAsc = !that.totalTimeAsc;
           that.runTimeAsc = false;
           //将筛选条件存入缓存
           trainHandler.setStorage(trainHandler.primaryKey + 'totalTimeAsc',that.totalTimeAsc);
           trainHandler.setStorage(trainHandler.primaryKey + 'runTimeAsc',that.runTimeAsc);
         }
          const compare = (x, y) => {
            if (Number(x.runTime) < Number(y.runTime)) {
              return  that.totalTimeAsc ? -1: 1;
            } else if (Number(x.runTime) > Number(y.runTime)) {
              return that.totalTimeAsc ? 1: -1;
            } else {
              return 0;
            }
          };
          that.trainList = that.trainList.sort(compare);
        }
        //将不可预订的车次放到列表的最后面
        that.trainList = that.getTrainSortByType(that.trainList);
      },
      /**
       * 对车次列表进行tupe排序,将不可预订的车次放到最后面
       * @param {arr} list 火车列表
       */      
      getTrainSortByType(list){
          let length = list.length;
          let arrtempF = [];
          let arrtempS = [];
          for(let i=0;i<length;i++){
              if(0 < parseInt(list[i].saleFlag)){
                arrtempS.push(list[i])
              }else{
                arrtempF.push(list[i])
              }
          }
          return arrtempF.concat(arrtempS);
      },
      /**
       * 从车次列表解析出 车站列表数据
       * @param {Object} 
       */
      getTrainList() {
        const that = this;
        if (!!that.trainList && that.trainList.length > 0) {
          let stationStartArray = [];
          let stationEndArray = [];
          that.trainList.forEach((item) => {
            stationStartArray.push(item.startStation);
            stationEndArray.push(item.toStation);
          });
          that.stationStartList = [...new Set(stationStartArray)];
          that.stationEndList = [...new Set(stationEndArray)];
        }
      },
      /**
       * 判断是否选择了筛选
       */
      judgeFilterOption(){
        let that = this;
        if((that.allFilterOption.trainTypeOption && that.allFilterOption.trainTypeOption.length > 0)
         ||(that.allFilterOption.timeOption && that.allFilterOption.timeOption.length > 0)
         ||(that.allFilterOption.stationStartOption && that.allFilterOption.stationStartOption.length > 0)
         ||(that.allFilterOption.stationEndOption && that.allFilterOption.stationEndOption.length > 0)){
           that.hasFilter = true;
        }else{
           that.hasFilter = false;
        }
      },
      /**
       * 判断是否在首页选择了高铁动车选项
       */
      isSelectGD(){
        let that = this;
        //判断是否在首页勾选了高铁动车
        let trainType = parseInt(trainHandler.getStorage('trainType'));
        if(trainType == 1){//说明首页勾选了高铁动车 并且没有筛选条件
          let arr = that.allFilterOption.trainTypeOption.push('高铁(G/C)','动车(D)');
          let newArr = [...new Set(that.allFilterOption.trainTypeOption)]
          that.allFilterOption.trainTypeOption = newArr;
        }else{
          that.allFilterOption.trainTypeOption = [];
        }
      },
      /**
       * 底部导航栏的 筛选功能，车次、车站等条件
       * @param {Object} 
       */
      filterTrain(allOption) {
        let that = this;
        that.showFilterPop = false;
        that.allFilterOption = JSON.parse(JSON.stringify(allOption));

        //判断是否存在筛选条件 控制样式显示
        that.judgeFilterOption();
        
        //其实是在做对象的拷贝
        that.trainList = JSON.parse(JSON.stringify(that.trainListAll));
        that.trainList = that.trainList.filter(train=>{
          //筛选车次类型部分 false的话就说明过滤掉
          let flag = true;
          if(that.allFilterOption.trainTypeOption && that.allFilterOption.trainTypeOption.length > 0){//当车次类型筛选条件时
            flag = that.allFilterOption.trainTypeOption.some(temp=>{
              if(temp.indexOf('其它') > -1){//说明存在其他这一类型的筛选
                return temp.indexOf(train.trainCode.slice(0, 1)) > -1 || that.filterTrainTypeOther(train.trainCode.slice(0, 1));
              }else{
                return temp.indexOf(train.trainCode.slice(0, 1)) > -1;
              }
            });
            if(!flag){
              return flag;
            }
          }
          
          //筛选发车时间
          if(that.allFilterOption.timeOption && that.allFilterOption.timeOption.length > 0){//判断时间区间
              try{
                  let today = new Date().format('yyyy/MM/dd');
                  let departTime = new Date(today+' '+train.goTime);
                  flag = that.allFilterOption.timeOption.some((timeStr)=>{
                      let timeArr = timeStr.split('-');
                      //在时间段内中断轮询，并将flag置为true
                      return departTime.getTime()>=new Date(today+' '+timeArr[0]).getTime() && departTime.getTime()<=new Date(today+' '+timeArr[1]).getTime()
                  })
              }catch(e){console.error((e))};
              if(!flag){
                  return flag;
              }
          }

          //发车站筛选
          if(that.allFilterOption.stationStartOption && that.allFilterOption.stationStartOption.length > 0){
            flag = that.allFilterOption.stationStartOption.some(station=>{
                return train.startStation == station;
            });
            if(!flag){
              return flag;
            }
          }

          //到达站筛选
          if(that.allFilterOption.stationEndOption && that.allFilterOption.stationEndOption.length > 0){
            flag = that.allFilterOption.stationEndOption.some(station=>{
                return train.toStation == station;
            });
            if(!flag){
              return flag;
            }
          }
         return flag;
        })
        
        //筛选完重新排序
        that.orderByTime(that.orderType);
        
        //显示暂无车次提示
        that.noFlag = that.trainList.length == 0;
      },
      /**
       * 筛选列车类型为其他其他
       */
      filterTrainTypeOther(item){
        let arrType = ['G','C','D','Z','T','K'];
        //不存在返回true
        return arrType.indexOf(item)==-1;
      },
      /**
       * 列表切换显示余票、坐席
       */
      switchMode() {
        const that = this;
        that.showPrice = !that.showPrice;
        trainHandler.setStorage(trainHandler.primaryKey + 'showPrice', JSON.stringify(that.showPrice));
      },
      
      /**
       * 跳转到车次详情
       * @param {Object} train
       */
      gotoDetail(train) {
        const that = this;
        //距离发车时间在两个小时以内的友好提示
        if(that.checkTwoHour(train)){
          let text = '您选择的车票距开车时间很近了，请确保有足够的时间抵达车站候车。';
          trainHandler.showConfirm(text, function(){
            that.toDeTailfun(train);
          }, 1, null, '确定', '温馨提示', null, true);
        }else{
          that.toDeTailfun(train);
        }
      },
      //跳转到车次详情页面
      toDeTailfun(train){
        const that = this;

        //存储选择的该车次详情
        trainHandler.setStorage('trainDetail', JSON.stringify(train));
        if (!!that.$route.query.tripNo) {
          that.$router.push({
            path: '/detail',
            query: {
              tripNo: that.$route.query.tripNo,
              useType: that.$route.query.useType, //因公,因私
            },
          });
        } else {
          that.$router.push({
            path: '/detail',
            query: {
              fromChange:that.$route.query.fromChange,
              useType: that.$route.query.useType, //因公,因私
            },
          });
        }
      },
      //检测出发时间是否有两小时
      checkTwoHour(train){
        let nowDate = new Date().format('yyyy/MM/dd HH:mm');
        let flag = false;
        let trainTime = new Date(this.searchDate + ' ' + train.goTime).getTime();
        let todayTime =  new Date(nowDate).getTime();   

        //两个小时以内的弹窗友好提示
        if((trainTime - todayTime)/1000/60 < 120){
          flag = true;
        }
        return flag;
      },
      /**
       * 跳转到车次详情
       * @num 车次席位剩余票数
       */
      setSetShowText(num) {
        let text = '无';
        if (num == 0) {
          text = '无票'
        } else if (0 < num && num < 20) {
          text = num + '张';
        } else {
          text = '有票';
        }
        return text;
      }
    }
  }

</script>
<style scoped lang="less">
  @import '~themes/default/styles/trainList.less';
</style>

<style lang="less">
  .showBar-enter-active,
  .showBar-leave-active {
    transition: all .4s ease-out;
  }

  .showBar-enter,
  .showBar-leave-to {
    opacity: 0;
  }
  .train-filter.vux-popup-dialog{
    border-radius: .20rem .20rem 0px 0px;
  }
</style>

