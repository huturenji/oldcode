<template>
<div>

  <div class="page-index-domestic">

    <div class="flightWrap">
            <div class="flightCityWrap">
          <div class="name">
              <label class="no-wrap cursorp" @click="selectCity('begin')" :class="{turndirection:isTurnDirection}">{{isStartAirport?tripJson.departAirportName:tripJson.startCity}}</label>
              <label class="no-wrap cursorp" @click="selectCity('end')" :class="{turndirection:isTurnDirection}">{{isEndAirport?tripJson.arriveAirportName:tripJson.endCity}}</label>
          </div>
          <div class="title">
              <span>出发地</span>
              <span>目的地</span>
          </div>
          <div class="flight-icon icon-btn cursorp">
              <div class="rotation-btn" @click="changeCity" :class="{turnaround:flightTrunAround}"></div>
          </div>
      </div>
      <div class="dateWrap">
        <div class="dateItem cursorp" @click="selectCalendar('start')">
          <div>
              <span class="title">出发</span>
              <span class="week">{{new Date(tripJson.selectStartDateStamp*1000).getTime()|sDay}}</span>
          </div>
          <div class="dateText">
              <span class="num-font">{{formatDate(tripJson.selectStartDateStamp).month}}</span>
              <span class="label">月</span>
              <span class="num-font">{{formatDate(tripJson.selectStartDateStamp).date}}</span>
              <span class="label">日</span>
          </div>
        </div>
      </div>
      <div class="cabin-wrap">
        <div class="label">舱位</div>
        <div class="text cursorp" @click="showFlightCabinPop=true">{{flightCabinType.text}}
            <Icon type="icon_common_rightarrow" size='.24' class="icon icon-btn"/>
        </div>
      </div>
      <div class="travle-type" v-if='!!useTypeConfig && useTypeConfig.isBoth()'>
        <div class="label">出行类型</div>
        <div class="text">
          <span class="chooseBut cursorp" @click="flightTripType = USE_TYPE_ENUM.PUBLIC.name">
              <Icon :type="useTypeConfig.isPublic(flightTripType) ? 'btn_common_radio_sel' : 'btn_common_radio_nor'" size='.38' class="icon"/> <span>因公</span>
          </span>
          <span class="chooseBut cursorp" @click="flightTripType = USE_TYPE_ENUM.PRIVATE.name">
              <Icon :type="useTypeConfig.isPrivate(flightTripType) ? 'btn_common_radio_sel' : 'btn_common_radio_nor'" size='.38' class="icon"/> <span>因私</span>
          </span>
        </div>
      </div>
        <div v-if="useTypeConfig && useTypeConfig.isPublic(flightTripType)" class="travle-standards">
            差旅标准:
            <span class="seatType">{{flightCabinInfo.name}}</span>
        </div>

    </div>
    <div class="button">
        <SnButton type="primary"  class="search-btn" @click="searchFlight">查询</SnButton>
    </div>

    <History class='history-container' ref="history" @click="fillHistory"></History>
    
    <!-- 日期选择 -->
    <div v-transfer-dom style="display:none">
        <ScrollLock :lock="false" :bodyLock="showCalendar">
            <SnDatetimePicker ref='SnDatetimePicker' v-model="chooseDay" @change='choseDayChange' @closed='showCalendar=false' :disabled-date='disabledDate'/>
        </ScrollLock>
    </div>
    <!-- 城市选择 -->
    <div v-transfer-dom>
      <popup v-model="showCityPop" height="100%" width="100%" position="right" class="citySelect">
        <City :dataList='cityList' @choose='chooseCity' :hasSearch='true' :hotList='hotCityList' :hisList='hisCityList'
          :hasHis='true' :hasHot='true' :hasLocal='false' :searchUrl='searchUrl' :cityType="'flight'" :cityIsShow="showCityPop"></City>
      </popup>
    </div>
    <!-- 仓位选择 -->
    <div v-transfer-dom>
      <popup v-model="showFlightCabinPop" is-transparent :style="{zIndex: 670}">
        <div class="roomInfoWrap" @touchmove.prevent>
          <div class="roomTit lineBorderB">请选择舱位
              <Icon type='btn_common_close' size='.32' class="but" @click="showFlightCabinPop=false"/>
          </div>
          <cabinCheck :cabinList='flightCabinList' v-model='flightCabinType'></cabinCheck>
        </div>
      </popup>
    </div>
  </div>

  <slot name= 'hotPhone'/>
</div>
</template>

<script>
import {
    SnDatetimePicker
} from 'sinosun-ui';
import SnButton from 'components/button'
import Icon from 'components/icon';
import extendUtils from 'flightCommon/extend.js';
import requestHandler from 'flightCommon/requestHandler.js';
import { TransferDom, Popup} from 'vux';
import { FlightFilterOptions, NOLIMIT } from 'flightCommon/enum/flightFilterEnum.js';
import ScrollLock from 'flightComp/scrollLock/vue-scroll-lock'
const City = () => import('components/city/city');
const CabinCheck = () => import('flightComp/cabinChecker/cabinChecker.vue');
const History = () => import('flightComp/history/history');
//是否是小应用
const miniApp = (extendUtils.getStorage('homePageType') == 'mini');
const otherSourceType = ['trip', 'order', 'entryList', 'coupon', 'push','footerBar'];

export default {
    mixins: [extendUtils.mixin.tChatEventMixin],
    directives: {
        TransferDom
    },
    components: {
        ScrollLock,
        SnButton,
        Icon,
        History,
        Popup,
        City,
        CabinCheck,
        SnDatetimePicker
    },
    props: {
        isCurrent: {
            type: Boolean,
            default: false
        }
    },
    data() {
        let that = this;
        let managerData = extendUtils.stateManager.setData([
            //仓位选择
            {
                name: 'showFlightCabinPop',
                parent: miniApp ? null : '$refs.currentView',
                show: {
                    callback: function () {
                    }
                },
                hide: {
                    callback: function () {
                    }
                }
            },
            //显示日历
            {
                name: 'showCalendar',
                parent: miniApp ? null : '$refs.currentView',
                show: {
                    callback: function () {
                    }
                },
                hide: {
                    callback: function () {
                        that.$refs.SnDatetimePicker.onHide()
                    }
                }
            },
            //城市选择控件
            {
                name: 'showCityPop',
                parent: miniApp ? null : '$refs.currentView',
                show: {
                    callback: function () {
                    }
                },
                hide: {
                    title: that.getTitleName(),
                    callback: function () {
                    }
                }
            }

        ], miniApp ? this : null);
        let today = new Date()
        let tommrow = today.setDate(today.getDate()+1)
        return Object.assign(managerData, {
            isTurnDirection: false,//左右切换的动画，点击更换目的地出发地中间的小图标
            colorBtn: false,
            isRedPocketData: false,
            // isShowNewActivityPopup:false,
            dtReceiveCoupon: false, // 是否点击新人页面领取
            displayMode: 3,//时间模式
            searchUrl: '/flight/v1/searchAirportCity',//搜索请求url
            cityList: [],//城市列表
            hisCityList: [],//历史城市列表
            hotCityList: [],//热门城市列表
            flightTripType: null, //PUBLIC因公，PRIVATE因私
            flighType: 'single', //机票类型single单程，return往返
            flightCabinType: NOLIMIT, //航班舱位
            cityType: 'begin', //选择城市类型，begin，end
            flightCabinList: [NOLIMIT, ...FlightFilterOptions.CABIN],
            flightCabinInfo: { name: '不限', clr: '' },
            flightCabinTypeMap: {//机票舱位map
                1: '头等舱',
                2: '商务舱',
                3: '经济舱 '
            },
            tripJson: {//机票查询参数
                startCity: '北京',
                endCity: '武汉',
                startCityCode: 'BJS',
                endCityCode: 'WUH',
                departAirportCode: '',
                departAirportName: '',
                arriveAirportCode: '',
                arriveAirportName: '',
                selectStartDateStamp: parseInt(new Date().getTime() / 1000) + 24 * 1 * 3600
            },
            flightTrunAround: false,//飞机往返城市切换动画显示
            isStartAirport: false,
            isEndAirport: false,
            pageFrom: this.$route.query.pageFrom,
            useTypeConfig: null,
            USE_TYPE_ENUM: extendUtils.USE_TYPE_ENUM,
            chooseDay: tommrow
        });
    },
    async created() {
        this.useTypeConfig = await extendUtils.useTypeConfig()
        this.flightTripType = this.$route.query.useType || this.useTypeConfig.default();
        this.init();
        sinosdk.sino.onChildWindowClose(function () {
            this.$refs.history.loadHistory();
        }.bind(this));
    },
    watch: {
        flightCabinType: function () {
            this.showFlightCabinPop = false;
        }
    },
    filters: {
        sDay: function (vals) {
            var val = parseInt(vals);
            var time = new Date(val);
            if (new Date(val).toDateString() == new Date().toDateString()) {
                return '今天'
            }
            if (new Date(val).toDateString() == new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toDateString()) {
                return '明天'
            }
            if (new Date(val).toDateString() == new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 2).toDateString()) {
                return '后天'
            }
            return extendUtils.indexToWeek(time.getDay());
        },
        eDay: function (vale) {
            var val = parseInt(vale);
            var time = new Date(val);
            if (new Date(val).toDateString() == new Date().toDateString()) {
                return '今天'
            }
            if (new Date(val).toDateString() == new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toDateString()) {
                return '明天'
            }
            if (new Date(val).toDateString() == new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 2).toDateString()) {
                return '后天'
            }
            return extendUtils.indexToWeek(time.getDay());
        }
    },
    methods: {
        /**
                     * 统一控制页面跳转
                    */
        toPage(url) {
            if (!!url) { } else {
                extendUtils.showToast('程序小哥努力开发中，敬请期待...')
            }
        },
        getTitleName() {
            return miniApp ? '机票' : '商旅通'
        },
        goBackFun(){
            extendUtils.closePage('');
        },
        /**
             * 初始化数据
             */
        init() {
            let that = this;
            that.setTripInfo();
            //分步请求城市数据
            setTimeout(() => {
                that.getFlightHotCity();
                that.getFligthCity().then(() => {
                    //获取历史城市，存储在本地的，要在好几个异步的操作后都去主动跑一次
                    that.getFligthHistoryCity();
                    that.getMycriterion();

                });
            }, 300);
        },
        /**
             * 行程数据初始化，处理从行程、订单详情带入的参数
             */
        async setTripInfo() {
            let that = this;
            await extendUtils.authInterceptor();
            //机票读取上一次查询的城市数据
            if (!!extendUtils.getStorage(requestHandler.primaryKey + '_indexFlightJson')) {
                let indexFlightJson = JSON.parse(extendUtils.getStorage(requestHandler.primaryKey + '_indexFlightJson'));
                if (!!indexFlightJson.startCity) {
                    that.tripJson.startCity = indexFlightJson.startCity;
                }
                if (!!indexFlightJson.endCity) {
                    that.tripJson.endCity = indexFlightJson.endCity;
                }
                if (!!indexFlightJson.startCityCode) {
                    that.tripJson.startCityCode = indexFlightJson.startCityCode;
                }
                if (!!indexFlightJson.endCityCode) {
                    that.tripJson.endCityCode = indexFlightJson.endCityCode;
                }
            }
            if (!!this.pageFrom && otherSourceType.indexOf(this.pageFrom) > -1 && this.pageFrom != 'coupon' && (that.isCurrent || miniApp)) {
                if (!!that.$route.query.startCity && '' != that.$route.query.startCity) {
                    that.tripJson.startCity = decodeURIComponent(that.$route.query.startCity);
                }
                if (!!that.$route.query.endCity && '' != that.$route.query.endCity) {
                    that.tripJson.endCity = decodeURIComponent(that.$route.query.endCity);
                }
                let now = new Date();
                now = new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + "/" + now.getDate());
                let tommrowTime = new Date(now).setDate(now.getDate() + 1);
                let startDate = !that.$route.query.departTime || that.$route.query.departTime < now.getTime() ? tommrowTime : that.$route.query.departTime;
                that.tripJson.selectStartDateStamp = parseInt(startDate) / 1000;
                that.chooseDay = new Date(parseInt(startDate))
            }

        },
        /**
       * 获取我的差标信息
       */
        getMycriterion() {
            //获取差标数据
            // extendUtils.GetCriterionFunction({ uaid: 0, cpyId: 0 }).then(function (res) {
            //     if ('0' == res.ret) {
            //         let flightCabinTypes = res.responseData.flightCabinTypes || [];
            //         if (0 < flightCabinTypes.length) {
            //             _this.flightCabinInfo.name = flightCabinTypes.map(ele => {
            //                 return _this.flightCabinTypeMap[ele]
            //             }).join('、');
            //         };
            //     }
            // });

        },
        /**
             * 搜索航班
             */
        searchFlight() {
            let that = this;
            that.doFlightSearch();
        },
        changeBtnColor() {
            let that = this;
            that.colorBtn = true;
        },
        normalBtnColor() {
            let that = this;
            that.colorBtn = false;
        },
        /**
             * 执行搜索航班
             */
        async doFlightSearch() {
            const that = this;
            await extendUtils.authInterceptor();
            if (that.flighType == 'single') {
                that.tripJson.startCityCode = that.isFlightCityValid(that.tripJson.startCity);
                if (!that.tripJson.startCityCode) {
                    extendUtils.showToast('请选择正确的出发地');
                    return;
                }
                that.tripJson.endCityCode = that.isFlightCityValid(that.tripJson.endCity);
                if (!that.tripJson.endCityCode) {
                    extendUtils.showToast('请选择正确的目的地');
                    return;
                }
                extendUtils.setStorage('startCityCode', that.tripJson.startCityCode);
                extendUtils.setStorage('endCityCode', that.tripJson.endCityCode);
                extendUtils.setStorage('selectDate', new Date(that.tripJson.selectStartDateStamp * 1000).format('yyyy/MM/dd'));
                extendUtils.setStorage('startCity', that.tripJson.startCity);
                extendUtils.setStorage('endCity', that.tripJson.endCity);
                if (that.isStartAirport) {
                    extendUtils.setStorage('departAirportName', that.tripJson.departAirportName);
                } else {
                    extendUtils.setStorage('departAirportName', '');
                }
                if (that.isEndAirport) {
                    extendUtils.setStorage('arriveAirportName', that.tripJson.arriveAirportName);
                } else {
                    extendUtils.setStorage('arriveAirportName', '');
                }
                if (extendUtils.getStorage('startCityCode') == extendUtils.getStorage('endCityCode')) {
                    extendUtils.showToast('出发地和目的地不可以相同');
                } else {
                    //存储机票的查询历史城市记录
                    that.setFligthHistoryCity();
                    let indexFlightJson = {
                        'startCity': that.tripJson.startCity,
                        'endCity': that.tripJson.endCity,
                        'startCityCode': that.tripJson.startCityCode,
                        'endCityCode': that.tripJson.endCityCode
                    };
                    extendUtils.setStorage(requestHandler.primaryKey + '_indexFlightJson', JSON.stringify(indexFlightJson));
                    let url = 'flight/index.html#/list?flightCabinType=' + that.flightCabinType.value + '&useType=' + that.flightTripType
                    if (!!that.$route.query.tripNo) {
                        url += '&tripNo=' + that.$route.query.tripNo;
                    }
                    requestHandler.addHistory({
                        start: that.tripJson.startCity,
                        end: that.tripJson.endCity,
                        time: that.tripJson.selectStartDateStamp * 1000
                    });//记录查询历史
                    setTimeout(() => {
                        that.$refs.history.getSearchHistory();
                    }, 2000)
                    requestHandler.openPage(url)
                }
            }
        },
        /**
            * 存储机票历史城市
            */
        async setFligthHistoryCity() {
            const that = this;
            await extendUtils.authInterceptor();
            let cityKey = requestHandler.primaryKey + "_FHCity";
            var cityList = !!extendUtils.getStorage(cityKey) ? JSON.parse(extendUtils.getStorage(cityKey)) : [];
            if (!!that.cityList && that.cityList.length > 0 && !!that.tripJson) {
                for (let i = 0; i < that.cityList.length; i++) {
                    var group = that.cityList[i];
                    if (!!group.dataList && group.dataList.length > 0) {
                        for (let j = 0; j < group.dataList.length; j++) {
                            if (group.dataList[j].cityName == that.tripJson.endCity
                                    || group.dataList[j].cityName == that.tripJson.startCity) {
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
                    if (cityList[i].cityName === cityList[j].cityName) {
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
            extendUtils.setStorage(cityKey, JSON.stringify(cityList));
            //刷新内存数据
            that.getFligthHistoryCity();
        },
        /**
             * 获取机票历史城市
             */
        async getFligthHistoryCity() {
            const that = this;
            await extendUtils.authInterceptor();
            let cityKey = requestHandler.primaryKey + "_FHCity";
            var cityArray = !!extendUtils.getStorage(cityKey) ? JSON.parse(extendUtils.getStorage(cityKey)) : [];
            //火车票/飞机票没有定位城市，只有酒店有
            // if(!!that.cityList && that.cityList.length > 0 && !!extendUtils.getStorage("locationCity")){
            //     for(let i =0;i < that.cityList.length;i++){
            //         var group = that.cityList[i];
            //         if(!!group.dataList && group.dataList.length > 0){
            //             for(let j=0;j<group.dataList.length;j++){
            //                 if(group.dataList[j].cityName == extendUtils.getStorage("locationCity")){
            //                     //历史记录 定位的数据添加一个参数IsLocation，标记是定位数据，要显示小图标
            //                     let cityLocal = JSON.parse(JSON.stringify(group.dataList[j]));
            //                     cityLocal.IsLocation = true;
            //                     cityArray.unshift(cityLocal);
            //                     break;
            //                 }
            //             }
            //         }
            //     }
            // }
            //数组去重
            if (cityArray.length > 1) {
                for (var i = 1; i < cityArray.length; i++) {
                    //定位城市需要去重
                    if (cityArray[i].cityName == cityArray[0].cityName) {
                        cityArray.splice(i, 1);
                        i--;
                    }
                }
            }
            //显示的时候，包括定位城市，最多显示6个城市。
            if (cityArray.length > 6) {
                cityArray = cityArray.slice(0, 6);
            }
            that.hisCityList = extendUtils.sortedUniq(cityArray);
        },
        /**
             * 获取机票城市
             */
        getFligthCity() {
            const that = this;
            return new Promise(() => {
                if (extendUtils.getStorage("flightCitys")) {
                    that.cityList = JSON.parse(extendUtils.getStorage("flightCitys"));
                    //获取最新机票城市并存储缓存
                    that.getFligthCityData();
                    // r(that.cityList);
                } else {
                    that.getFligthCityData();
                }
            });
        },
        /**
             * 获取最新机票城市
             */
        getFligthCityData() {
            const that = this;
            requestHandler.getAllCNAirportCity().then((res) => {
                if (!!res.result) {
                    that.cityList = res.result.orderedAirport;
                    extendUtils.setStorage('flightCitys', JSON.stringify(that.cityList.slice(0,1)));
                }
            }).catch((err) => {
                console.error(err);
            });
        },
        /**
                * 获取机票热门城市
                */
        getFlightHotCity() {
            const that = this;
            requestHandler.getHotAirportCity().then((res) => {
                if (!!res.result) {
                    that.hotCityList = extendUtils.sortedUniq(res.result.hotCity);
                }
            }).catch((err) => {
                console.error(err);
            });
        },
        /**
             * 打开城市选择组件
             * @type 业务类型
             */
        selectCity(type) {
            let that = this;
            that.cityType = type;
            that.showCityPop = true;
            document.title = '城市选择';
        },
        /**
             * 选择城市
             * @city 城市数据对象
             */
        chooseCity(city) {
            const that = this;
            that.showCityPop = false;
            document.title = that.getTitleName();
            if (that.cityType == 'begin') {
                that.isStartAirport = false;
                that.tripJson.startCity = city.cityName;
                that.tripJson.startCityCode = city.cityCode;
                if ('cityAirport' == city.type || 'airport' == city.type) {
                    that.isStartAirport = true;
                    that.tripJson.departAirportCode = city.airportCode;
                    that.tripJson.departAirportName = city.airportShortName;
                }
            } else {
                that.isEndAirport = false;
                that.tripJson.endCity = city.cityName;
                that.tripJson.endCityCode = city.cityCode;
                if ('cityAirport' == city.type || 'airport' == city.type) {
                    that.isEndAirport = true;
                    that.tripJson.arriveAirportCode = city.airportCode;
                    that.tripJson.arriveAirportName = city.airportShortName;
                }
            }
        },
        /**
             * 选择时间
             * @date 时间
             */
        choseDayChange(date) {
            this.tripJson.selectStartDateStamp = new Date(date).getTime() / 1000;
            this.chooseDay = date;
            this.showCalendar = false;
        },
        /**
             * 判断机票城市是否正确,返回城市code
             * @cityName 城市名
             */
        isFlightCityValid(cityName) {
            const that = this;
            for (let group of that.cityList) {
                if (group.dataList) {
                    for (let city of group.dataList) {
                        if (city.cityName && cityName == city.cityName) {
                            return city.cityCode;
                        }
                    }
                }
            }
            return false;
        },
        /**
             * 获取日期的星期几
             * @e 时间数据
             */
        indexToWeek(e) {
            return extendUtils.indexToWeek(e);
        },
        /**
          * 切换往返城市 防抖动
          */
        changeCity() {
            let that = this;
            extendUtils.throttle(function () {
                that.changeCityNew();
            }, this);
        },
        /**
          * 切换往返城市
          */
        changeCityNew() {
            const that = this;
            //控制动画的两个变量
            that.flightTrunAround = true;
            that.isTurnDirection = true;

            //更新数据
            let tempJson = JSON.parse(JSON.stringify(that.tripJson));
            let tempStartType = that.isStartAirport;
            that.tripJson.startCity = tempJson.endCity;
            that.tripJson.endCity = tempJson.startCity;
            that.tripJson.startCityCode = tempJson.endCityCode;
            that.tripJson.endCityCode = tempJson.startCityCode;
            that.tripJson.departAirportCode = tempJson.arriveAirportCode;
            that.tripJson.departAirportName = tempJson.arriveAirportName;
            that.tripJson.arriveAirportCode = tempJson.departAirportCode;
            that.tripJson.arriveAirportName = tempJson.departAirportName;
            that.isStartAirport = that.isEndAirport;
            that.isEndAirport = tempStartType;

            //切换动画控制
            let flightTrunAroundTimer = setTimeout(() => {
                that.flightTrunAround = false;
            }, 500)
            let flightTrunDirectionTimer = setTimeout(() => {
                that.isTurnDirection = false;
            }, 100)
            // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
            this.$once('hook:beforeDestroy', () => {
                clearTimeout(flightTrunAroundTimer);
                clearTimeout(flightTrunDirectionTimer);
            })
        },
        /**
             * 打开选择时间组件
             * @type 业务类型
             */
        selectCalendar(type) {
            this.dataType = type;
            this.$refs.SnDatetimePicker.onClick();
            this.showCalendar = true;
        },
        disabledDate(current ){
            let yestoday = new Date();
            yestoday.setDate(yestoday.getDate()-1)
            return current < yestoday.getTime()
        },
        formatDate:function(val){
            let now = new Date(val * 1000);
            let month = now.getMonth()+1;
            let date = now.getDate();
            return {month: month<10 ? '0'+month : month, date: date<10 ? '0'+date : date}
        },
        fillHistory(history) {
            this.tripJson.startCity = history.start;
            this.tripJson.endCity = history.end;
            //历史记录的日期不小于当天,才更新日期
            if (history.time >= new Date().getTime()) {
                this.tripJson.selectStartDateStamp = history.time / 1000;
            }
        }
    }
}
</script>

<style lang="less" scpoed>
    @import '~themes/default/styles/index/domestic.less';
</style>
<style lang="less">
@import '~themes/default/styles/common/index.less';
    .sn-datetime-picker-view-header{
        margin-top: .88rem;
        &:before{
            content: '机票价格变动频繁，以实际成交价为准';
            display: block;
            // height: .88rem;
            height: .44rem;
            line-height: .88rem;
            position: absolute;
            top: -.88rem;
            color: @warning-color;
            margin-left: .3rem;
            font-size: 18px;
        }
    }
</style>