<template>
<div class="index-wrap" :class="{footerBar:showFooter}">
  <div class='trainDiv'>
    <!-- 优惠券提示 -->
    <!-- <InsertTips
        ref="insertTips"
        :dtReceiveCoupon="dtReceiveCoupon"
    ></InsertTips> -->
    <!-- 优惠券提示占位div -->
    <div class="boxBlock" v-if="boxBlockShow"></div>
    <div class="tab-swiper vux-center">
      <div class="flightWrap">
        <div class="noSearch">

          <!-- 出发地和目的地 -->
          <div class="flightCityWrap">
            <div class="itemWrap cursorp" @click="selectCity('begin')">
              <div class="itemName itemName_start" :class="{turndirection:isTurnDirection}">{{trainTripJson.startCity}}</div>
              <!-- 因为动画的原因上面真的的dom利用定位，已经脱离文档流 用假的dom占位 -->
              <div class="itemNameNew"></div>
              <div class="itemTit">出发地</div>
            </div>
            <div class="changeButWrap cursorp" @click="changeCity">
              <div class="outside" :class="{turnaround:trainTrunAround}"></div>
              <div class="train"></div>
            </div>
            <div class="itemWrap right cursorp" @click="selectCity('end')">
              <div class="itemName itemName_end" :class="{turndirection:isTurnDirection}">{{trainTripJson.endCity}}</div>
              <!-- 因为动画的原因上面真的的dom利用定位，已经脱离文档流 用假的dom占位 -->
              <div class="itemNameNew"></div>
              <div class="itemTit">目的地</div>
            </div>
          </div>

          <p class="xg7"></p>

          <!-- 选择的日期 -->
          <div class="dateWrap">
            <div class="dateItemWrap cursorp" @click="selectCalendar('start')">
              <div class="dateItem">
                <div class="dateTips">
                  <span>出发</span>
                  <span class="day">{{new Date(trainTripJson.selectStartDateStamp*1000).getTime()|sDay}}</span>  
                </div>
                <span class="dateText">
                  <span class="num-font num">{{new Date(trainTripJson.selectStartDateStamp*1000).format('MM')}}</span>
                  <span>月</span>
                  <span class="num-font num">{{new Date(trainTripJson.selectStartDateStamp*1000).format('dd')}}</span>
                  <span>日</span>
                </span>
              </div>
            </div>
          </div>
          
          <p class="xg7"></p>

          <!-- 只看高铁动车 -->
          <div class="lineTextWrap">
            <div class="only cursorp" @click="trainOnlyDandG=!trainOnlyDandG">
              <span>只看高铁动车</span>  
              <icon v-if="trainOnlyDandG" type='btn_common_radio_sel2' size='.4'></icon>
              <icon v-else type='btn_common_radio_nor' size='.4'></icon>
            </div>
          </div>


          <template v-if='!!useTypeConfig && useTypeConfig.isBoth()'>
            <p class="xg7"></p>

            <div class="lineTextWrap">
              <div class="label">
                <div class="title">出行类型</div>
                <div class="content">
                    <span @click="trainTripType=USE_TYPE_ENUM.PUBLIC.name"><icon :type="useTypeConfig.isPublic(trainTripType)?'btn_common_radio_sel':'btn_common_radio_nor'" size='.4'></icon><i>因公</i></span>
                    <span @click="trainTripType=USE_TYPE_ENUM.PRIVATE.name"><icon :type="useTypeConfig.isPrivate(trainTripType)?'btn_common_radio_sel':'btn_common_radio_nor'" size='.4'></icon><i>因私</i></span>
                </div>
              </div>
            </div>
          </template>

          <!-- 屏蔽掉差旅标准 -->
          <div class="trainSeat" v-if="!!useTypeConfig && useTypeConfig.isPublic(trainTripType)">
            <div>
              <div class="tripLeval">差旅标准：</div>
              <div class="seatType">{{trainSeatInfo.name}}</div>
            </div>
          </div>

          
         
        </div>

        <!-- 查询按钮 -->
        <div class="searchButton cursorp" @click="searchTrain">查询</div>
      </div>
    </div>
    <History ref="history" @click="fillHistory"></History>
  
    <div v-transfer-dom>
      <popup v-model="showCalendar" position="bottom" :show-mask="true" hide-on-blur style="max-height: 10rem;background: #ffffff ">
        <div class="calendar">
          <div class="tips">当前预售期为30天，您可以预订预售期的车票</div>
          <CalendarNewX ref="Calendar" @changeDate="choseDayChange" :displayMode.sync="displayMode" :futureDayHide="futureDayHide" :agoDayHide="agoDayHide"></CalendarNewX>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showCityPop" height="100%" width="100%" position="right" class="citySelect">
        <City :dataList='cityList' @choose='chooseCity' :hasSearch='true' :hotList='hotCityList' :hisList='hisCityList'
          :hasHis='true' :hasHot='true' :hasLocal='false' :searchUrl='searchUrl' :cityType="'train'" :cityIsShow="showCityPop"></City>
      </popup>
    </div>
    <!-- 优惠券弹出窗-->
    <!-- <div v-transfer-dom>
      <NewActivityPopup v-show="isShowNewActivityPopup" ref='newActivityPopup'></NewActivityPopup>
    </div> -->
    
  </div>

  <!-- 企业商旅服务热线 -->
  <div class="hot_phone"><i class="left_line">-</i>企业商旅服务热线：<span @click="callPhone">{{hotPhone}}<i class="right_line">-</i></span></div>
    <div v-transfer-dom>
        <footerBar v-if='showFooter' :activeType="'home'" :indexPage="'train'"/>
    </div>  
</div>
</template>

<script>
  // const NewActivityPopup = ()=>import('components/coupon/newActivityPopup.vue');
  // const InsertTips = ()=>import('components/coupon/insertTips.vue');
  const City = ()=>import('components/city/city.vue');
  const History = ()=>import('trainComponents/history/history');
  const footerBar = ()=>import('components/footerBar/footerBar.vue');
  import {getProductType} from 'components/coupon/js/judgePageType.js'
  import CalendarNewX from "components/calendarNew/CalendarNewX.vue";
  import icon from "components/icon/index.vue"
  import {
    TransferDom,
    Popup
  } from 'vux';
  import trainHandler from 'trainHandler/common/lib/trainHandler.js';
  //是否是小应用
  const miniApp = trainHandler.getStorage('homePageType') == 'mini';

  export default {
    mixins: [trainHandler.mixin.tChatEventMixin],
    directives: {
      TransferDom
    },
    data() {
      let that = this;
      let managerData = trainHandler.stateManager.setData([
        //城市选择控件
        {
          name: 'showCityPop',
          parent: miniApp ? null : '$refs.currentView',
          show: {
            callback: function () {
            //   that.enableToggleReturnBtn() && trainHandler.toggleReturnBtn(true);
            }
          },
          hide: {
            title: that.getTitleName(),
            callback: function () {
            //   that.enableToggleReturnBtn() && trainHandler.toggleReturnBtn();
            }
          }
        },
        //显示日历
        {
          name: 'showCalendar',
          parent: miniApp ? null : '$refs.currentView',
          show: {
            callback: function () {
            //   that.enableToggleReturnBtn() && trainHandler.toggleReturnBtn(true);
            }
          },
          hide: {
            callback: function () {
            //   that.enableToggleReturnBtn() && trainHandler.toggleReturnBtn();
            }
          }
        },
        {
            name:'isShowNewActivityPopup'
        },
      ], miniApp ? this : null);
      return Object.assign(managerData, {
        isTurnDirection:false,
        colorBtn:false,
        boxBlockShow:null, // 优惠券提示样式空白样式调整盒子
        isShowNewActivityPopup:false, // 新人优惠券弹窗
		    dtReceiveCoupon:false, // 是否点击新人页面领取
        cityType: 'begin',
        trainOnlyDandG: false, //高铁动车
        displayMode: 2, //时间模式
        searchUrl: '/train/v1/searchCity', //搜索请求url
        cityList: [], //城市列表
        hisCityList: [], //历史城市列表
        showCityPop: false, //城市选择控件
        trainTripType: null, //PUBLIC因公，PRIVATE因私
        useTypeConfig: null,
        trainTripJson: { //火车票查询参数
          startCity: '北京',
          endCity: '武汉',
          selectStartDateStamp: parseInt(new Date().getTime() / 1000) + 24 * 1 * 3600,
        },
        trainTrunAround: false, //火车往返城市切换动画显示
        pageFrom: this.$route.query.pageFrom,
        trainSeatInfo:{name:'不限',clr:''},
        trainSeatTypeMap:{//火车票席位map
					0:'商务座', 
					1:'特等座',
					2:'一等座', 
					3:'二等座',
					4:'高级软卧',
					5:'软卧', 
					6:'硬卧', 
					7:'软座',   
					8:'硬座', 
					9:'无座', 
					10:'其他'       		
        },
        hotCityList:[],
        futureDayHide: new Date(new Date().format('yyyy/MM/dd')).getTime()+29*24*3600000, //最晚的可购票日期
        agoDayHide: new Date(new Date().format('yyyy/MM/dd')).getTime(),
        USE_TYPE_ENUM: trainHandler.USE_TYPE_ENUM,
        showFooter:true,//是否展示底部导航栏首页默认展示底部导航栏
      });
    },
    components: {
      History,
      CalendarNewX,
      City,
      Popup,
      icon,
      footerBar
      // InsertTips,
      // NewActivityPopup,
    },
    props: {
      isCurrent: {
        type: Boolean,
        default: false
      }
    },
    async created() {
      this.notifyAppBackAndRefresh();
      this.useTypeConfig = await trainHandler.useTypeConfig();
      this.trainTripType = this.$route.query.useType || this.useTypeConfig.default();
      this.init();
    //   !this.enableToggleReturnBtn() ? trainHandler.toggleReturnBtn(true) : trainHandler.toggleReturnBtn();
    },
    activated: function () {
      this.notifyAppBackAndRefresh();
      // this.$refs.insertTips.getPersonalCoupon()// 刷新优惠券提示tips方法
      // this.$refs.insertTips.getActivityData() //  刷新优惠券提示tips方法
    },
    watch:{
        isShowNewActivityPopup(value){ // 监听是生成过新人活动中心
          trainHandler.setStorage('hasShowNewActivity' + '_' + trainHandler.primaryKey + 'train', true)
        },
    },
    computed:{
      //热线电话，从platform的常量里面取
      hotPhone(){
        let phone = trainHandler.BIS_CUSTOMER_SERVICE_PHONE;
        if(phone.indexOf('-')>-1){
          phone = phone.replace(/\-/g, '');
        }
        return phone;
      }
    },
    filters:{
        sDay:function(val){
          var val = parseInt(val);
          var time = new Date(val);
          if(new Date(val).toDateString() == new Date().toDateString()){
              return '今天'
          }
          if(new Date(val).toDateString() == new Date(new Date().getTime()+24*60*60*1000).toDateString()){
              return '明天'
          }
          if(new Date(val).toDateString() == new Date(new Date().getTime()+24*60*60*1000*2).toDateString()){
              return '后天'
          }
          return trainHandler.indexToWeek(time.getDay());
        },
        eDay:function(val){
            var val = parseInt(val);
            var time = new Date(val);
            if(new Date(val).toDateString() == new Date().toDateString()){
                return '今天'
            }
            if(new Date(val).toDateString() == new Date(new Date().getTime()+24*60*60*1000).toDateString()){
                return '明天'
            }
            if(new Date(val).toDateString() == new Date(new Date().getTime()+24*60*60*1000*2).toDateString()){
                return '后天'
            }
            return trainHandler.indexToWeek(time.getDay());
        }
    },
    methods: {
      /**
       * 判断是否需要切换返回按钮
       */
      enableToggleReturnBtn(){
        // return !this.pageFrom || (['trip', 'order','coupon','entryList','footerBar'].indexOf(this.pageFrom) == -1)
      },


      /**
       * 联系客服打电话
       */
      callPhone() {
          sinosdk.sino.callTel(this.hotPhone);
      },

      /**
       * 注册刷新返回事件
       */
      notifyAppBackAndRefresh() {
        //小应用才需执行，因为小应用只有这一个页面且是主页
        if (!miniApp) {
          return;
        }
        let that = this;
        
        // //注册并监听t信返回事件
        // sinosdk.sino.onBack(function(){
        //    trainHandler.stateManager.closeTopPop(() => {

        //        //统一调整为返回商云或关闭所有页面2021年3月24日todu后期商旅小应用合并后，此处逻辑需要重构
        //       //行程和我的订单跳转过来，点返回时关闭页面（即返回上一级 页面）
        //       let pageFrom = that.$route.query.pageFrom;
        //       if (!!pageFrom && (['trip', 'order', 'coupon','push'].indexOf(pageFrom) > -1)) {
        //         // sinosdk.sino.back('');
        //         sinosdk.sino.back('',parseInt('10000'));
        //       } else {
        //         //商旅通超级首页入口进入的返回入口页面
        //         if ('entryList'==pageFrom || (!!trainHandler.getSession('indexPageType') && trainHandler.getSession('indexPageType') == 'ind')) {
        //           sinosdk.sino.back('entryList');
        //         } else {
        //           //当前在首页时要关闭窗口到控制台，传入的参数在整个系统的url中不能存在，否则会跳转到那个url去；只有APP在所有url中找不到这个参数，才会回到工作台
        //         //   sinosdk.sino.back('-111111111');
        //         sinosdk.sino.back('',parseInt('10000'));
        //         }
        //       }
        //     });
        // },that)
        
        //新页面关闭回到本页面时，本页面自动刷新的事件
        sinosdk.sino.onChildWindowClose(function(data){
          // that.$refs.insertTips.getPersonalCoupon()// 刷新优惠券tips提示方法
          // that.$refs.insertTips.getActivityData() // 刷新优惠券tips提示方法
          that.$route.query.gotoUse=false // 关闭页面优惠券insertTips传值参数初始化
          that.$refs.history.loadHistory();
        }.bind(this))
        that.$emit('showOff', true);

      },
      goBackFun(){
            let that = this;
            let pageFrom = that.$route.query.pageFrom;
            if (!!pageFrom && (['trip', 'order', 'coupon','push'].indexOf(pageFrom) > -1)) {
            // sinosdk.sino.back('');
            sinosdk.sino.back('',parseInt('10000'));
            } else {
            //商旅通超级首页入口进入的返回入口页面
                if ('entryList'==pageFrom || (!!trainHandler.getSession('indexPageType') && trainHandler.getSession('indexPageType') == 'ind')) {
                    sinosdk.sino.back('entryList');
                } else {
                //当前在首页时要关闭窗口到控制台，传入的参数在整个系统的url中不能存在，否则会跳转到那个url去；只有APP在所有url中找不到这个参数，才会回到工作台
                //   sinosdk.sino.back('-111111111');
                sinosdk.sino.back('',parseInt('10000'));
                }
            }
      },
      /**
       * 初始化数据
       */
      async init() {
        let _this = this;
        await trainHandler.authInterceptor();
        //查询后记住城市信息，页面打开时读取，行程数据初始化，处理从行程、订单详情带入的参数
        _this.setTripInfo();
        _this.getTrainHotCity();
        _this.getTrainCity();
        _this.getTrainHistoryCity();
        _this.getMycriterion();
       
      },
      /**
			 * 获取我的差标信息
			 */	
			getMycriterion(){
				let _this = this;        	
        //获取差标数据
				// trainHandler.GetCriterionFunction({uaid:0,cpyId:0}).then(function(res){
				// 	if('0' == res.ret){
				// 		let trainSeatTypes = res.responseData.trainSeatTypes || [];
        //     if(0<trainSeatTypes.length){
        //         _this.trainSeatInfo.name = trainSeatTypes.map(ele => {
        //             return _this.trainSeatTypeMap[ele]
        //         }).join('、');
				// 		};			
				// 	}
				// });
				
      },
    getTitleName(){
        return miniApp ? '火车票' : '商旅通'
    },      
      /**
       * 打开选择时间组件
       * @type 业务类型
       */
      selectCalendar(type) {
        let that = this;
        let chooseDay = '';
        if (type == 'start') {
          that.dataType = "start";
          chooseDay = that.trainTripJson.selectStartDateStamp;
        }
        that.$refs.Calendar.setDate(chooseDay);
        that.showCalendar = true;
      },
      /**
       * 打开城市选择组件
       * @type 业务类型
       */
      selectCity(type) {
        let that = this;
        that.showCityPop = true;
        that.cityType = type;
        document.title = '城市选择';
      },
      /**
       * 选择时间
       * @date 时间
       */
      choseDayChange(date) {
        const that = this;
        if (that.dataType == 'start') {
          that.trainTripJson.selectStartDateStamp = new Date(date * 1000).getTime() / 1000;
        }
        that.showCalendar = false;
      },
      /**
       * 行程数据初始化，处理从行程、订单详情带入的参数
       */
      setTripInfo() {
        let _this = this;
        if (!!trainHandler.getStorage(trainHandler.primaryKey+'_indexTrainJson')) {
          let indexTrainJson = JSON.parse(trainHandler.getStorage(trainHandler.primaryKey+'_indexTrainJson'));
          if (!!indexTrainJson.fromCity) {
            _this.trainTripJson.startCity = indexTrainJson.fromCity;
          }
          if (!!indexTrainJson.toCity) {
            _this.trainTripJson.endCity = indexTrainJson.toCity;
          }
        }
        let pageFrom = _this.$route.query.pageFrom;
        // console.log('train isCurrent is ' + _this.isCurrent);
        if (!!pageFrom && (pageFrom == 'trip' || pageFrom == 'order' || pageFrom == 'push') && (_this.isCurrent || miniApp)) {
          if (!!_this.$route.query.startCity && '' != _this.$route.query.startCity) {
            _this.trainTripJson.startCity = decodeURIComponent(_this.$route.query.startCity);
          }
          if (!!_this.$route.query.endCity && '' != _this.$route.query.endCity) {
            _this.trainTripJson.endCity = decodeURIComponent(_this.$route.query.endCity);
          }
          
          //再次预定过来的如果是今天的即显示今天的订票日期  如果是今天之前的则显示明天的订票信息  目前默认显示明天座位订票日期
          let departTime = _this.$route.query.departTime;//再次预定传过来的日期 毫秒
          let nowData = new Date();
          nowData = new Date(nowData.getFullYear()+'/'+(nowData.getMonth()+1)+"/"+nowData.getDate());
          let tomorrowDate = new Date(nowData).setDate(nowData.getDate() + 1);
          let startDate = departTime < nowData.getTime() ? tomorrowDate : departTime;
          _this.trainTripJson.selectStartDateStamp = parseInt(startDate) / 1000;
        }

      },
      /**
       * 获取火车票热门城市
       */
      getTrainHotCity() {
        const that = this;
        const param = {
        };
        trainHandler.getHotCity(param).then((res) => {
          if (!!res.result) {
            that.hotCityList = trainHandler.sortedUniq(res.result.cities);
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      /**
       * 存储火车票历史城市
       */
      setTrainHistoryCity() {
        const that = this;
        let cityKey = trainHandler.primaryKey + "_historyStation";
        var cityList = !!trainHandler.getStorage(cityKey) ? JSON.parse(trainHandler.getStorage(cityKey)) : [];
        if (!!that.cityList && that.cityList.length > 0 && !!that.trainTripJson) {
          for (let i = 0; i < that.cityList.length; i++) {
              var group = that.cityList[i];
              if (!!group.dataList && group.dataList.length > 0) {
                for (let j = 0; j < group.dataList.length; j++) {
                  if (group.dataList[j].name == that.trainTripJson.endCity || group.dataList[j].name == that.trainTripJson.startCity) {
                    cityList.unshift(group.dataList[j]);
                    continue;
                  }
                }
              }
          }
        }
        //数组去重
        var temp = [];
        var l = cityList.length;
        for (var i = 0; i < l; i++) {
          for (var j = i + 1; j < l; j++) {
              if (cityList[i].name === cityList[j].name) {
                i++;
                j = i;
              }
          }
          temp.push(cityList[i]);
        }
        cityList = temp;
        //存储的时候，最多储存6个城市。
        if (cityList.length > 6) {
          cityList = cityList.slice(0, 6);
        }
        trainHandler.setStorage(cityKey, JSON.stringify(cityList));
        //刷新内存数据
        that.getTrainHistoryCity();
      },
      /**
       * 获取火车票历史城市
       */
      getTrainHistoryCity() {
        const that = this;
        let cityKey = trainHandler.primaryKey + "_historyStation";
        var cityArray = !!trainHandler.getStorage(cityKey) ? JSON.parse(trainHandler.getStorage(cityKey)) : [];
        //数组去重
        if (cityArray.length > 1) {
          for (var i = 1; i < cityArray.length; i++) {
              //定位城市需要去重
              if (cityArray[i].name == cityArray[0].name) {
                cityArray.splice(i, 1);
                i--;
              }
          }
        }
        //显示的时候，包括定位城市，。最多显示6个城市
        if (cityArray.length > 6) {
          cityArray = cityArray.slice(0, 6);
        }
        that.hisCityList = trainHandler.sortedUniq(cityArray);
      },
      /**
       * 获取火车票城市
       */
      getTrainCity() {
        const that = this;
        return new Promise((r, rej) => {
          if (trainHandler.getStorage("trainCitys")) {
            that.cityList = JSON.parse(trainHandler.getStorage("trainCitys")); 
            //兼容老版本本地的缓存
            let newCityList = [];
            that.cityList.forEach((val) => {
              val['showMore'] = false;
              newCityList.push(val);
            });
            that.cityList = newCityList;
            
            //获取最新火车站城市并存储缓存
            that.getTrainCityData();
            r(that.cityList);
          } else {
            that.getTrainCityData();
          }
        });
      },
      /**
       * 获取最新火车票城市
       */
      getTrainCityData() {
        const that = this;
        const param = {
        };
        trainHandler.getAllCity(param).then((res) => {
          if (!!res.result) {
              let newCityList = [];
              res.result.allCities.forEach((val) => {
                val['showMore'] = false;
                newCityList.push(val);
              });
              that.cityList = newCityList;
              trainHandler.setStorage("trainCitys", JSON.stringify(that.cityList));
          }
        }).catch((err) => {
            console.log(err);
        });
      },

      /**
       * 选择城市
       * @city 城市数据对象
       */
      chooseCity(city) {
        const _this = this;
        _this.showCityPop = false;
        document.title = _this.getTitleName();
        if (_this.cityType == 'begin') {
          _this.trainTripJson.startCity = city.name;
        } else {
          _this.trainTripJson.endCity = city.name;
        }
      },
      /**
       * 搜索火车票
       */
      searchTrain() {
        let that = this;
        that.getTrainCity().then((res) => {
          that.doTrainSearch();
        });
      },
      changeBtnColor(){
				let that = this;
				that.colorBtn = true;
			},
			normalBtnColor(){
				let that = this;
				that.colorBtn = false;
			},
      /**
       * 执行搜索火车票
       */
      doTrainSearch() {
        const that = this;
         /**
         * 需要判断是否是出差申请生成行程并通过行程的去预定火车票过来的。因为这时候会出现出差日期大于可购票日期30天的情况。
         * 此时的交互场景是点击查询按钮，弹出弹框提示，关闭弹框提示的时候日历组件弹出 同时选中明天的日期
         */
        if(that.trainTripJson.selectStartDateStamp * 1000 > that.futureDayHide){
          trainHandler.showConfirm('当前出发时间已超过火车票预售期，请重新选择', function(){      
            that.trainTripJson.selectStartDateStamp = parseInt(new Date().getTime() / 1000) + 24 * 1 * 3600;
            that.selectCalendar('start');
            that.showCalendar = true;
          }, 1, null, null, null, null, true);
          return;
        }
          
        trainHandler.setStorage('startDate', new Date(that.trainTripJson.selectStartDateStamp * 1000).format('yyyy/MM/dd'));
        //判断城市是否存在
        if (!that.isTrainCityValid(that.trainTripJson.startCity)) {
          trainHandler.showToast('请选择正确的出发地');
          return;
        }
        if (!that.isTrainCityValid(that.trainTripJson.endCity)) {
          trainHandler.showToast('请选择正确的目的地');
          return;
        }
        trainHandler.setStorage('fromCity', that.trainTripJson.startCity);
        trainHandler.setStorage('toCity', that.trainTripJson.endCity);
        trainHandler.setStorage('trainType', that.trainOnlyDandG ? 1 : 0);

        //判断出发地目的地城市名不相同
        if (trainHandler.getStorage('toCity') == trainHandler.getStorage('fromCity')) {
          trainHandler.showToast('出发地和目的地不可以相同');
        } else {
          //存储火车票的查询历史城市记录
          that.setTrainHistoryCity();
          let indexTrainJson = {
            'fromCity': that.trainTripJson.startCity,
            'toCity': that.trainTripJson.endCity,
          };
          trainHandler.setStorage(trainHandler.primaryKey+'_indexTrainJson', JSON.stringify(indexTrainJson));
          let url = 'train/index.html#/list'+ '?useType=' + that.trainTripType;
          if (!!that.$route.query.tripNo) {
            url += '&tripNo=' + that.$route.query.tripNo;
          }
          trainHandler.addHistory({
            start: that.trainTripJson.startCity,
            end: that.trainTripJson.endCity,
            time: that.trainTripJson.selectStartDateStamp * 1000
          });//记录查询历史
          setTimeout(()=>{
            that.$refs.history.getSearchHistory();
          },2000)
          setTimeout(() => {
            trainHandler.openPageLib(url);
          }, 50)
        }
      },
      /**
       * 判断火车票城市是否正确,返回城市code
       * @cityName 城市名
       */
      isTrainCityValid(cityName) {
        const that = this;
        for (let group of that.cityList) {
          if (group.dataList) {
            for (let city of group.dataList) {
              if (city.name && cityName == city.name) {
                return true;
              }
            }
          }
        }
        return false;
      },
      /**
       * 切换往返城市 防抖动
       */
      changeCity(){
        let that = this;
        trainHandler.throttle(function () {
          that.changeCityNew();
        }, this);
      },
      /**
       * 切换往返城市
       */
      changeCityNew() {
        const _this = this;
        //控制动画的两个变量
        _this.isTurnDirection = true;
        _this.trainTrunAround = true;
        //更新数据
        let tempJson = JSON.parse(JSON.stringify(_this.trainTripJson));
        _this.trainTripJson.startCity = tempJson.endCity;
        _this.trainTripJson.endCity = tempJson.startCity;
        //切换动画控制
        let trainTrunAroundTimer = setTimeout(() => {
          _this.trainTrunAround = false;
        }, 500)     
        let trainTrunDirectionTimer = setTimeout(() => {
          _this.isTurnDirection = false;
        }, 100)  
        // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
        this.$once('hook:beforeDestroy', () => {            
            clearTimeout(trainTrunAroundTimer);                                    
            clearTimeout(trainTrunDirectionTimer);                                    
        })

      },
      
      fillHistory(history){
        this.trainTripJson.startCity = history.start;
        this.trainTripJson.endCity = history.end;
        //历史记录的日期不小于当天,才更新日期
        if(history.time >= new Date().getTime()){
          this.trainTripJson.selectStartDateStamp = history.time / 1000;
        }
      }   
    }
  }

</script>

<style scoped lang="less">
  @import '~themes/default/styles/index.less';
</style>
