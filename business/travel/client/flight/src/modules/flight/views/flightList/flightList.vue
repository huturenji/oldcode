<template>
    <div class="page-flight-list">
        <div class="main">
            <div class="tripDate" v-bind:class="{fix:showCalendar}">
                <div class="scrollBar">
                    <div class="calendarScroll" ref='calendarScroll' id='calendarScroll'>
                        <div id="calBlock" class="calBlock cursorp" v-for='item in priceList' :key="item.departDate"
                            @click='chooseCal(item)'>
                            <div class='content' :class="{choosen:item.departDate==flightSearchObj.searchDate}">
                                <div class="week">
                                    {{formatDate(item.departDate,'week')}}
                                </div>
                                <div class="date num-font">
                                    {{formatDate(item.departDate,'day')}}
                                </div>
                                <div class="price num-font">
                                    <span class="rmb">&yen;</span>{{item.ticketPrice>0?item.ticketPrice:'--'}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="selectCal cursorp" @click="showCalendar=!showCalendar" ref='selectCal'
                        :class='{isOnTouch:isCalendarOnTouch}'>
                        <Icon class="icon icon-btn" type="icon_common_calendar" size='.44' />
                    </div>
                </div>
                <div class="popBox pcDialog" v-show='showCalendar'>
                    <div class="filter">
                        <CalendarNewX ref="calendar" @changeDate="choseDayChange"
                            :beginDate="flightSearchObj.searchDate"
                            :agoDayHide="getNextDate(-1)" :displayMode=3>
                        </CalendarNewX>
                    </div>
                    <div class='calendar-mask cursorp' @click='showCalendar=false'></div>
                </div>
            </div>
            <div class="loading-content" v-if="!showSkeleton">
                <SnLoading :spinning="loading" :turn="true" tip="获取航班中，请稍候..." />
                <EmptyX v-if='!loading && flightList.length==0 && flightData.length!=0' tipsText='没有符合条件的航班' />
                <EmptyX v-else-if='!loading && noFlag' tipsText='该航线暂无航班或已售完，换个航线或日期试试' />
            </div>
            <wrapper v-if="showSkeleton"></wrapper>
            <div class="list" id='list' v-else-if='!loading'>
                <div class="flight cursorp" v-for="(flight,index) in flightList" ref="flightList" @click='chooseCabin(flight)' :key="index">
                    <span v-if='flight.isLowestPrice' class="icon-low linear-gra-waring">
                        当日低价
                    </span>
                    <div class="content">
                        <div class="trip">
                            <div class="air-info">
                                <div class="time num-font">
                                    <div>{{flight.departTime}}</div>
                                    <div>{{flight.arriveTime}}</div>
                                    <div class="plus" v-if="flight.runDays>0">+{{flight.runDays}}</div>
                                </div>
                                <div class="airport">
                                    <div class='no-wrap'>{{flight.departAirportName}}{{flight.departAirportTerminal}}</div>
                                    <div class='no-wrap'>{{flight.arriveAirportName}}{{flight.arriveAirportTerminal}}</div>
                                </div>
                                <div class="arrow">
                                    <div class="icon"></div>
                                    <div class="detail" v-if='flight.stopNum>0'>
                                        经停
                                        {{flight.stopItems[0].stopCityName}}{{flight.stopItems.length>1?(','+flight.stopItems[1].stopCityName):''}}
                                    </div>
                                </div>
                            </div>
                            <div class="plane-info">
                                <div class="flight-info">
                                    <airlogo class="logo" :airCode="flight.airCompanyCode" />
                                    <span>{{flight.airCompanyName}}{{flight.flightNo}}</span>
                                    <span class="cursorp share" v-if='flight.share'>[共享]</span>
                                    <span class="split"></span>
                                    <span>{{flight.planeType}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="price-info">
                            <div class="price num-font">
                                <span class="rmb">&yen;</span>
                                {{recommendCabins(flight.recommendCabins).fare}}
                            </div>
                            <span class="cabinName">
                                {{recommendCabins(flight.recommendCabins).cabinName}}
                                <template
                                    v-if="recommendCabins(flight.recommendCabins).discount<100 && recommendCabins(flight.recommendCabins).discount>0">
                                    {{recommendCabins(flight.recommendCabins).discount / 10}}折</template>
                                <template
                                    v-else-if="recommendCabins(flight.recommendCabins).discount==100">
                                    全价
                                </template>
                            </span>
                            <!-- <SnButton class="coupon-label" ghost size="small" type="warning"
                                v-if="!isEndorse() && !!recommendCabins(flight.recommendCabins).canUseCoupon && !!recommendCabins(flight.recommendCabins).canUseCoupon.length>0">
                                {{getBestCoupon(recommendCabins(flight.recommendCabins))}}
                            </SnButton> -->
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <transition name="showBar">
                <div class="footerBar" v-if='showFootBar'>
                    <div @click="openFilter" class="option cursorp icon-btn" :class="{'choosed': hasFilter}">
                        <Icon type="icon_filter_screen" size='.20'/><span class='label'>筛选</span>
                    </div>
                    <div class="split"></div>
                    <div class="option cursorp icon-btn" @click="orderBy('start',true)" :class="{'choosed': sortType=='start'}">
                        <Icon type="icon_time" size='.20'/>
                        <span class='label'>时间</span>
                        <template v-if="sortType=='start'">
                            <span class='label'>
                                <template v-if="!startTimeAsc">
                                        晚
                                        <Icon type="icon_train_arrow" size='.20'/>
                                        早
                                </template>
                                <template v-else>
                                        早<Icon type="icon_train_arrow" size='.20'/>晚
                                </template>
                            </span>
                        </template>
                    </div>
                    <div class="split"></div>
                    <div @click="orderBy('price',true)" class="option cursorp icon-btn" :class="{'choosed': sortType=='price'}">
                        <Icon type="icon_train_price@2x" size='.20'/>
                        <span class='label'>
                            价格
                        </span>
                        <template v-if="sortType=='price'">
                            <span class='label'>
                                <template v-if="priceAsc">
                                        低<Icon type="icon_train_arrow" size='.20'/>高
                                </template>
                                <template v-else>
                                    高<Icon type="icon_train_arrow" size='.20'/>低
                                </template>
                            </span>
                        </template>
                    </div>
                </div>
            </transition>

        <div v-transfer-dom>
            <popup v-model="showFilterPop" class='filter-pop' width="100%" height='80%' position="bottom">
                <flightFilter :showFilter="showFilterPop" :selectedFilters="selectedFilters"
                    :filterOptions="filterOptions" :filterOptionNames="filterOptionNames" @confirm="confirmFilter"
                    @closeFilter="showFilterPop=false">
                </flightFilter>
            </popup>
        </div>

        <div v-transfer-dom>
            <XDialog v-model="showApproachConfirm" class="approachConfirm">
                <div class="content">
                    <div class="title">请务必确认</div>
                    <article>
                        1.航班临近起飞，购票前请先到值机柜台确认出票后仍有时间值机。
                    </article>
                    <article>
                        2.若出票失败，订单自动取消并全额退款，若已出票，退改损失需自行承担。
                    </article>
                    <div class="btn-group">
                        <div class="cursorp" @click="chooseCabinCore">已确认，可预订</div>
                        <div class="cursorp" @click="showApproachConfirm=false">暂不预订</div>
                    </div>
                </div>
            </XDialog>
        </div>
    </div>
</template>

<script>
import wrapper from "./wrapper";
import extendUtils from 'flightCommon/extend.js';
import requestHandler from 'flightCommon/requestHandler.js';
import {
    TransferDom,
    Popup,
    XDialog
} from 'vux';
import Icon from 'components/icon';
import SnLoading from "components/loading";
import EmptyX from "components/empty/EmptyX.vue";
import CalendarNewX from "components/calendarNew/CalendarNewX.vue";
import flightFilter from 'flightComp/flightFliter/flightFilter.vue';
// import { getBestCoupon } from 'components/coupon/js/requestHandler.js';
import airlogo from 'components/airlogo/airlogo.vue';
import { NOLIMIT, FlightFilterOptions } from 'flightCommon/enum/flightFilterEnum.js';

export default {
    mixins: [extendUtils.mixin.tChatEventMixin],
    directives: {
        TransferDom
    },
    components: {
        Icon,
        wrapper,
        flightFilter,
        Popup,
        CalendarNewX,
        SnLoading,
        EmptyX,
        XDialog,
        airlogo
    },
    data: function () {
        return Object.assign(this.setData(), {
            endorseMsg: null,//航班具体改签信息
            flightSearchObj: {
                searchDate: null,//起始日期
                startCityCode: null,//起始城市编号
                endCityCode: null,//到达城市编号
                startCity: null,//起始城市
                endCity: null//到达城市
            },

            isCalendarOnTouch: false, //价格日历被点击
            showSkeleton: true,//骨架屏
            loading: false,
            priceList: [], //价格日历
            startTimeAsc: false, //按照时间排序,初始按时间降序
            priceAsc: false, //按照价格排序，初始按价格降序
            sortType: '', //排序类型
            flightDetail: '',
            showPrice: false,
            noFlag: false,//航班列表无数据
            flightList: [], //筛选之后的航班信息
            showFootBar: true, //底部筛选的指示变量
            selectOption: '起飞时间',
            filterOptions: {},
            filterOptionNames: [],
            flightData: [],//没有被筛选过的原始数据，只在每次查询接口时更新
            selectedFilters: {},//选中的筛选选项
            lastScrollTop: null,
            queryType: this.$route.query.type,
            showApproachConfirm: false,
            flightQueryParam: {},
            QUERY_MONTH: 3,//查询多少个月的数据
            filterCondition: {}//服务器筛选
        })
    },
    beforeRouteEnter(to, from, next) {
        this.addScrollListener();
        next();
    },
    activated: function () {
        this.setData();
        this.initTitleMenu();
        // this.registerEvent();
        this.resetScroll();
        this.addScrollListener();
    },
    deactivated: function () {
        this.removeScrollListener();
    },
    created: function () {
        // this.registerEvent();
        this.optionList = [];
        this.selectOption = '起飞时间';
        this.initData();
        this.initTitleMenu();
        this.setFilterData();
        this.initFiltersAndSort();
        this.searchFlight();
    },

    mounted: function () {
        this.initCalendarData();
        this.addScrollListener();
        this.bindEvent();
    },
    computed: {
        //推荐舱位，通常是航班价格最低的舱位
        recommendCabins() {
            return function (value) {
                return !!value && value.length > 0 && !!value[0] ? value[0] : {};
            }
        },
        /**
             * 是否由筛选条件
             */
        hasFilter() {
            return !!this.selectedFilters && Object.keys(this.selectedFilters).length > 0;
        }
    },
    beforeDestory: function () {
        this.removeScrollListener();
    },

    methods: {
        setData() {
            return extendUtils.stateManager.setData([
                'showFilterPop', 'showCalendar'
            ], this)
        },
        initData() {
            let flightSearchObj = {};
            flightSearchObj.searchDate = extendUtils.getStorage('selectDate');//起始日期
            flightSearchObj.startCityCode = extendUtils.getStorage('startCityCode');//起始城市编号
            flightSearchObj.endCityCode = extendUtils.getStorage('endCityCode');//到达城市编号
            flightSearchObj.startCity = extendUtils.getStorage('startCity');//起始城市
            flightSearchObj.endCity = extendUtils.getStorage('endCity');//到达城市
            flightSearchObj.providerType = null;

            //改签单需要使用改签单中的信息，覆盖初始数据
            if (this.isEndorse()) {
                let endorseMsg = extendUtils.getStorage('endorseMsg');
                //异常处理
                if (!endorseMsg) {
                    extendUtils.showToast('找不到改签信息，请重新申请改签');
                    this.queryType = '';
                    return;
                }
                this.endorseMsg = endorseMsg = JSON.parse(endorseMsg);
                flightSearchObj.searchDate = endorseMsg.beginDate;//起始日期
                flightSearchObj.startCityCode = endorseMsg.sCityCode;//起始城市编号
                flightSearchObj.endCityCode = endorseMsg.eCityCode;//到达城市编号
                flightSearchObj.providerType = endorseMsg.providerType;
                flightSearchObj.providerOrderNo = endorseMsg.providerOrderNo;
            } else {
                //不是改签过来的，则清除以前遗留的缓存
                extendUtils.removeStorage('endorseMsg');
            }

            this.flightSearchObj = Object.assign({}, this.flightSearchObj, flightSearchObj);
        },
        registerEvent() {
            const that = this;
            //注册并监听t信返回事件
            sinosdk.sino.onBack(function () { //点击app返回事件
                that.closeTopPop();
            }.bind(this));
            /*
                页面刷新时激发
                */
            // extendUtils.reFreshPage(() => {
            //     that.refreshData();
            // })
        },
        goBackFun(){ 
            this.closeTopPop();    
        },

        /**
             * 价格日历触摸事件
             */
        bindEvent() {
            let that = this;
            this.$refs.selectCal.addEventListener('touchstart', function () {
                that.isCalendarOnTouch = true;
            }, true);
            this.$refs.selectCal.addEventListener('touchend', function () {
                that.isCalendarOnTouch = false;
            }, true);
        },
        /**
             * 获取最优惠的优惠券价格
             */
        // getBestCoupon(cabin) {
        //     let that = this;
        //     return getBestCoupon(cabin, function (bestCoupon) {
        //         that.$set(cabin, 'bestCoupon', bestCoupon);
        //     });
        // },

        /**
             * 获取价格日历的节假日
             */
        getHoliday() {
            let that = this;
            requestHandler.queryBussinessTripCalendar().then((res) => {
                that.getCanledarInstance().setHoliday(res.result.holidaysCalendar)
            }).catch(err => {
                console.log(err)
            })
        },
        /**
             * T信点击返回的事件处理
             */
        closeTopPop() {
            extendUtils.stateManager.closeTopPop(() => {
                extendUtils.closePage('');
            });
        },
        /**
             * 初始化价格日历
             */
        initPriceCalendar() {
            let dayCount = (this.getNextMonth(this.QUERY_MONTH) - new Date()) / 60 / 60 / 1000 / 24;
            //初始化价格日历
            for (let i = 0; i <= dayCount; i++) {
                this.priceList.push({
                    departDate: new Date().addDay(i).format('yyyy/MM/dd')
                });
            }
            this.getPriceList()
        },

        /**
             * 点击价格日历，更新航班查询
             * @item 日期的信息
             */
        chooseCal(item) {
            this.flightSearchObj.searchDate = item.departDate;
            this.searchFlight();
            this.getPriceList() //更新价格日历
            this.showCalendar = false;
            //选中日历中的日期
            this.getCanledarInstance().setDate(new Date(this.flightSearchObj.searchDate).getTime() / 1000);
        },
        /**
             * 转换时间格式
             * @date 日期的数据
             * @type 要转换的类型
             * */
        formatDate(date, type) {
            if (type == 'week') {
                return extendUtils.indexToWeek(new Date(date).getDay(), 3)
            } 
            return new Date(date).format('MM-dd')
                
        },
        /**
             * 获取价格日历数据
             * */
        getPriceList() {
            const that = this;
            let searchDate = that.flightSearchObj.searchDate;
            //比较搜索日期和当前日期
            that.resetSearchDate();
            let obj = {
                "departCityCode": that.flightSearchObj.startCityCode,
                "arriveCityCode": that.flightSearchObj.endCityCode,
                "departDates": [searchDate],
                "providerOrderNo": that.flightSearchObj.providerOrderNo
            };
            for (let count = 0; count < 6; count++) {
                let length = obj.departDates.length;
                let dateTime = new Date(obj.departDates[length - 1]);
                dateTime = dateTime.setDate(dateTime.getDate() + 1);
                obj.departDates.push(new Date(dateTime).format('yyyy/MM/dd'))
            }
            that.resetScroll();
            requestHandler.searchFlightPriceCalendar(obj).then((res) => {
                let calendarMap = {}, priceMap = {};
                let oldListLength = that.priceList.length;
                res.result.flightPriceCalendar.forEach(calendar => {
                    calendarMap[calendar.departDate] = calendar;
                })
                that.priceList.forEach(price => {
                    priceMap[price.departDate] = price;
                })
                Object.assign(priceMap, calendarMap);//将服务器返回的日期数据merge到priceList中
                that.priceList = Object.values(priceMap);//更新priceList
                //填充日历中的最低价
                that.getCanledarInstance().addPrice(res.result.flightPriceCalendar);
                //如果最低价日历的长度变了，需要重新定位
                that.$nextTick(() => {
                    oldListLength != that.priceList.length && that.resetScroll();
                })
            }).catch((err) => {
                console.error(err);
            });
        },
        /**
             * 打开选择舱位
             * @flight 航班的数据
             * */
        chooseCabin(flight) {
            this.flightDetail = flight;
            if (this.approachDepartTime(flight)) {
                this.showApproachConfirm = true;
                return;
            }
            this.chooseCabinCore(flight);
        },
        chooseCabinCore(flight) {
            this.showApproachConfirm = false;
            extendUtils.setStorage(requestHandler.primaryKey + 'flightDetail', JSON.stringify(flight));
            //通过缓存传递参数
            extendUtils.setStorage(requestHandler.primaryKey + 'endorseMsg', JSON.stringify(this.endorseMsg));
            this.flightDetail = flight;
            let searchDate = new Date(this.flightSearchObj.searchDate);
            let startDateStr = searchDate.format('MM月dd日');
            let startWeekStr = extendUtils.indexToWeek(searchDate.getDay());
            this.$router.push({
                path: '/detail',
                query: {
                    // endorseMsg: JSON.stringify(this.endorseMsg),//修改为通过缓存传递
                    useType: this.$route.query.useType,
                    startDateStr: startDateStr,
                    startWeekStr: startWeekStr,
                    title: document.title,
                    type: this.$route.query.type,
                    tripNo: this.$route.query.tripNo,
                    flightNo: this.flightDetail.flightNo,
                    flightQueryParam: JSON.stringify(this.flightQueryParam),
                    cabinFilter: JSON.stringify(this.selectedFilters.CABIN)
                }
            })
        },
        /**
             * 是否临近起飞时间
             */
        approachDepartTime(flight) {
            try {
                let today = new Date().getTime();
                let flightTime = new Date(this.flightSearchObj.searchDate + ' ' + flight.departTime).getTime();
                let diff = flightTime - today;
                if (diff > 0 && diff < 60 * 60 * 1000) {
                    return true;
                }
            } catch (e) {
                console.error(e)
            }
            return false;
        },
        /**
             * 修改标题
             * @flight 航班的数据
             * */
        initTitleMenu() {
            document.title = [this.flightSearchObj.startCity + '-' + this.flightSearchObj.endCity]
        },
        /**
             * 打开并筛选器
             * */
        openFilter() {
            this.showFilterPop = true;
        },
        /**
             * 更新日期
             * @date 传入的日期
             * */
        choseDayChange(date) {
            if (this.showCalendar) {
                this.flightSearchObj.searchDate = new Date(date * 1000).format("yyyy/MM/dd");
                this.$forceUpdate();
                this.searchFlight();
                this.getPriceList();
            }
            this.showCalendar = false;
        },
        /*
            重置价格日历滚动位置
            */
        resetScroll() {
            //递归函数
            let recursive = () => {
                setTimeout(() => {
                    this.resetScroll();
                }, 200)
            }
            let dateDomArr = document.getElementsByClassName('date');
            if (!dateDomArr || dateDomArr.length == 0) {
                recursive();
                return;
            }
            let targetDate = new Date(this.flightSearchObj.searchDate).format('MM-dd');
            let offsetLeft = 0;
            Array.prototype.forEach.call(dateDomArr, dom => {
                if (dom.innerText.trim() == targetDate) {
                    offsetLeft = dom.offsetLeft - dom.offsetWidth/2;
                }
            })
            document.getElementById("calendarScroll").scrollLeft = offsetLeft
        },

        /**
             * 航班查询
             * type 是搜索前一天或后一天
             * reset 判断是否是点击日历控件来搜索航班 如果是需要重置日历位置
             * */
        searchFlight(reset, openLoading = true) {
            const that = this;
            if (!that.showSkeleton && openLoading) {
                that.loading = true;
            }
            let searchDate = that.flightSearchObj.searchDate;
            //比较搜索日期和当前日期，并根据场景做不同处理（重置/终止流程）
            if (!that.resetSearchDate()) {
                this.loading = false;
                this.showSkeleton = false;
                extendUtils.showToast('请选择大于等于当前的日期');
                return;
            }
            let obj = {
                "departCityCode": that.flightSearchObj.startCityCode,
                "isChild": false,
                "arriveCityCode": that.flightSearchObj.endCityCode,
                "departDate": searchDate,
                "providerType": that.flightSearchObj.providerType,
                "providerOrderNo": that.flightSearchObj.providerOrderNo,
                "flightType": 0//目前只有单程
            };
            if (that.filterCondition && Object.keys(that.filterCondition).length > 0) {
                obj.filterCondition = that.filterCondition
            }
            //记住查询条件
            that.flightQueryParam = obj;
            //清空数据
            if (openLoading) {
                that.flightList = [];
                that.flightData = [];
            }
            requestHandler.querySimpleFlightList(obj).then((res) => {
                try {
                    that.showSkeleton = false;
                    that.loading = false;
                    if (!!res.result && !!res.result.flights) {
                        that.flightData = res.result.flights;
                        if (!!that.isEndorse()) {
                            //直接更改原始数据，因为这里只能查询和原航班相同的航班
                            that.flightData = that.flightData.filter(function (air) {
                                // let later = true;
                                let time1 = air.departTime.split(":");
                                let time2 = that.flightSearchObj.searchDate.split(":");
                                if (time1[0] > time2[0]) {
                                    // later = true;
                                } else if (time1[0] < time2[0]) {
                                    // later = false;
                                } else if (time1[1] <= time2[1]) {
                                    // later = false;
                                }
                                if (new Date(air.departDate).getTime() > new Date(that.flightSearchObj.searchDate).getTime()) {
                                    // later = true;
                                }
                                return air.airCompanyCode == that.endorseMsg.airLineCode;
                            });
                            that.flightList = JSON.parse(JSON.stringify(that.flightData));
                        } else {
                            that.flightList = res.result.flights;
                        }
                        that.noFlag = that.flightList.length == 0;
                        //这里认为第一个肯定是最低级
                        if (that.flightList.length > 0) {
                            that.flightList[0]['isLowestPrice'] = true
                        }
                        that.setFilterData();//设置筛选条件
                        that.filterFlight();//筛选并排序
                    }
                } catch (e) { console.error(e) }
            }).catch((err) => {
                that.showSkeleton = false;
                that.noFlag = true;
                that.loading = false;
                console.info(err)
            }).finally(() => {
                that.resetScroll();
            });
        },
        /**
             * 根据筛选条件过滤航班
             * 如果没有传参数，则使用vue实例中的selectedFilters
             * @selectedFilters 注意不要给空对象，要么有内容，要么给null
             */
        filterFlight(selectedFilters = this.selectedFilters) {
            //再将参数赋值给实例中的selectedFilters对象。
            // 这里实际上的意思是，调用本函数时，如果没传参，则使用this.filterFlight的值，那么这行代码就没什么意义；如果传参了，那么将this.filterFlight更新成参数的值
            this.selectedFilters = selectedFilters || {};
            //每次默认将航班列表还原成初始状态
            this.flightList = JSON.parse(JSON.stringify(this.flightData));//其实是在做对象的拷贝，避免了flightList和flightData指向同一个内存地址。下面会对flightList做删减，不能影响到flightData
            if (!selectedFilters || Object.keys(selectedFilters).length == 0) {
                //筛选之后排序
                this.orderBy();
                return;
            }
            //注意:一旦某个条件判断为false，就要立马返回，不继续判断
            this.flightList = this.flightList.filter((flight) => {
                if (selectedFilters.DEPART_TIME && selectedFilters.DEPART_TIME.length > 0) { //判断时间区间
                    let flag
                    try {
                        let today = new Date().format('yyyy/MM/dd');
                        let departTime = new Date(today + ' ' + flight.departTime);
                        flag = selectedFilters.DEPART_TIME.some((timeStr) => {
                            let timeArr = timeStr.value.split('-');
                            //在时间段内中断轮询，并将flag置为true
                            return departTime.getTime() >= new Date(today + ' ' + timeArr[0]).getTime() && departTime.getTime() <= new Date(today + ' ' + timeArr[1]).getTime()
                        })
                    } catch (e) { console.error((e)) }
                    if (!flag) {
                        return flag;
                    }
                }
                // if(selectedFilters.CABIN && selectedFilters.CABIN.length>0) {//判断舱位
                //     //同时要过滤掉不符合条件的舱位数据
                //     flight.cabins = flight.cabins.filter((cabin)=>{
                //         return selectedFilters.CABIN.some(cabinFilter => {
                //             return cabinFilter.value.indexOf(cabin.cabinRank)>-1;
                //         });
                //     })
                // }
                //这个判断要放在外面，过滤掉没有舱位的航班
                if (flight.cabins.length == 0) {
                    return false;
                }

                let flag = true;//通用flag，用于简单逻辑判断
                if (selectedFilters.DEPART_AIRPORT && selectedFilters.DEPART_AIRPORT.length > 0) { //判断机场
                    flag = selectedFilters.DEPART_AIRPORT.some(airport => { return airport.value == flight.departAirportName });
                    if (!flag) {
                        return flag;
                    }
                }
                if (selectedFilters.ARRIVE_AIRPORT && selectedFilters.ARRIVE_AIRPORT.length > 0) { //判断机场
                    flag = selectedFilters.ARRIVE_AIRPORT.some(airport => { return airport.value == flight.arriveAirportName });
                    if (!flag) {
                        return flag;
                    }
                }
                if (selectedFilters.FLIGHT_TYPE && selectedFilters.FLIGHT_TYPE.length > 0) { //判断机型
                    flag = selectedFilters.FLIGHT_TYPE.some(flightType => {
                        return flightType.value.indexOf(flight.shortPlaneType) > -1;
                    })
                    if (!flag) {
                        return flag;
                    }
                }
                if (selectedFilters.COMPANY && selectedFilters.COMPANY.length > 0) { //判断航空公司
                    flag = selectedFilters.COMPANY.some(company => { return company.value == flight.airCompanyName });
                    if (!flag) {
                        return flag;
                    }
                }
                if (!!selectedFilters.DIRECTION && !!selectedFilters.DIRECTION.value) { //判断是否只显示直飞
                    flag = flight.stopNum == 0;
                    if (!flag) {
                        return flag;
                    }
                }
                if (selectedFilters.HIDE_SHARE && !!selectedFilters.HIDE_SHARE.value) { //判断是否隐藏共享
                    flag = !flight.share;
                    if (!flag) {
                        return flag;
                    }
                }
                return flag;
            });
            //筛选之后排序
            this.orderBy();
        },
        /**
             * 筛选控件点击“确定”
             */
        confirmFilter(selectedFilters) {
            //由于部分条件是服务器筛选的，所以如果清空筛选时，都要初始化，重新查一次
            if (selectedFilters == null || Object.keys(selectedFilters).length == 0) {
                this.filterCondition = {};
                this.selectedFilters = {};
                this.searchFlight(false, false);
                this.showFilterPop = false;
                return;
            }
            //服务器筛选舱位
            if (selectedFilters && selectedFilters.CABIN && selectedFilters.CABIN.length > 0) {
                let cabins = ''
                selectedFilters.CABIN.forEach(cabin => {
                    if (cabin.value != -1) {
                        cabins += cabin.value.toString() + ',';
                    }
                })
                if (!!cabins) {
                    cabins = cabins.substring(0, cabins.length - 1);
                }

                this.filterCondition.cabinRank = cabins;
                this.selectedFilters = selectedFilters || {};
                this.searchFlight(false, false);
                this.showFilterPop = false;
                return;
            }
            this.filterCondition.cabinRank = null;
            this.filterFlight(selectedFilters);
            this.showFilterPop = false;
        },
        /**
             * 根据首页的条件默认选中条件
             */
        async initFiltersAndSort() {
            //1. 首页选择的筛选条件
            let cabinType = this.$route.query.flightCabinType;
            if (!!cabinType) {
                //如果勾选的是"不限"，就不赋值了
                if (cabinType != NOLIMIT.value) {
                    this.selectedFilters['CABIN'] = [FlightFilterOptions.CABIN.find(cabin => { return cabin.value == cabinType })];
                    this.filterCondition.cabinRank = cabinType;//初始化时就把舱位参数给服务器
                }
            }
            //起飞、降落机场（如果是机场，则会匹配到，如果是城市，则不会被匹配到）
            let departAirportName = extendUtils.getStorage('departAirportName');
            let arriveAirportName = extendUtils.getStorage('arriveAirportName');
            departAirportName && (this.selectedFilters['DEPART_AIRPORT'] = [{ value: departAirportName, text: departAirportName }])
            arriveAirportName && (this.selectedFilters['ARRIVE_AIRPORT'] = [{ value: arriveAirportName, text: arriveAirportName }])

            await extendUtils.authInterceptor();//必须放这里，否则filterCondition.cabinRank在搜索航班时为空
            //2. 缓存的排序条件
            let flightSort = extendUtils.getStorage(requestHandler.primaryKey + 'flightSort');
            if (!!flightSort) {
                flightSort = JSON.parse(flightSort);
                this.sortType = flightSort.sortType;
                this.priceAsc = flightSort.priceAsc;
                this.startTimeAsc = flightSort.startTimeAsc;
            }

            //3. 如果改签选择的是经济舱，则不筛选（即都能看）；如果选的是头等舱或商务舱，则勾选“头等舱/商务舱”
            let endorseCabinRank = this.endorseMsg && this.endorseMsg.cabinRank;
            switch (endorseCabinRank) {
            case '0'://经济舱
                break;
            case '1':
            case '2':
                this.selectedFilters['CABIN'] = [FlightFilterOptions.CABIN[1]];
                this.filterCondition.cabinRank = '1,2';//需要将舱位参数提交给服务器过滤
                break;
            default:
                break;
            }
        },
        /**
             * 设置筛选条件
             * 思路：筛选条件的名称和选项分为两个对象，名称和选项是1对多的关系。因为“机场”条件分为【起飞】和【降落】
             * 组件遍历时，根据FlightFilterKeyValue对象的映射进行遍历
             */
        setFilterData() {
            let that = this;
            //设置筛选的名称
            that.filterOptionNames = ['DEPART_TIME', 'FLIGHT_TYPE', 'CABIN', 'COMPANY', 'AIRPORT']
            //设置静态的筛选选项
            that.filterOptions['DEPART_TIME'] = [NOLIMIT, ...FlightFilterOptions.DEPART_TIME];//起飞时间
            that.filterOptions['FLIGHT_TYPE'] = [NOLIMIT, ...FlightFilterOptions.FLIGHT_TYPE];//机型
            that.filterOptions['CABIN'] = [NOLIMIT, ...FlightFilterOptions.CABIN];//舱位类型

            //设置需要从服务器获取的选项
            let companyList = new Set();
            let departAirPortList = new Set();
            let arriveAirPortList = new Set();
            //从已有航班列表中归纳出航空公司和机场两个筛选条件
            that.flightList = that.flightList.forEach((val) => {
                companyList.add(JSON.stringify({ name: val.airCompanyName, code: val.airCompanyCode }));//转成字符串使用set去重
                arriveAirPortList.add(val.arriveAirportName);
                departAirPortList.add(val.departAirportName);
            }) || [];
            //转换成组件需要的数据格式
            companyList = [...companyList].map(obj => {
                //airCode用于展示航班logo
                obj = JSON.parse(obj);
                return { value: obj.name, text: obj.name, airCode: obj.code }
            });

            //机场的展示方式比较特殊，因此用两个数组拼起来
            departAirPortList = [...departAirPortList].map(obj => obj = { value: obj, text: obj });
            departAirPortList = [{ type: 'text', noCheckbox: true, text: extendUtils.getStorage('startCity') + '起飞' }, NOLIMIT, ...departAirPortList];
            arriveAirPortList = [...arriveAirPortList].map(obj => obj = { value: obj, text: obj });
            arriveAirPortList = [{ type: 'text', noCheckbox: true, text: extendUtils.getStorage('endCity') + '降落' }, NOLIMIT, ...arriveAirPortList];

            //动态数据一定要用$set，否则不会触发组件内的watch
            that.$set(that.filterOptions, 'COMPANY', [NOLIMIT, ...companyList]);
            that.$set(that.filterOptions, 'DEPART_AIRPORT', departAirPortList);
            that.$set(that.filterOptions, 'ARRIVE_AIRPORT', arriveAirPortList);
        },
        /**
             * 切换排序模式
             * @type 排序模式 start表示按时间排序，price表示按价格排序
             * @reverse 是否反转排序顺序 如果是用户点击排序，则需要反转；如果是查询列表引发的排序，则不用
             * */
        orderBy(type = this.sortType, reverse = false) {
            const that = this;
            //没有设置排序类型时不排序
            if (!type) {
                return;
            }
            that.sortType = type;
            if (type == 'start') {
                //是否需要更改排序方式。如果是用户主动选择排序，则每次要颠倒；如果是查询列表时的排序，则不用颠倒
                //另外，用户主动选择一个排序时，把另外一个排序初始化
                if (!!reverse){
                    that.startTimeAsc = !that.startTimeAsc
                    that.priceAsc = false;
                }
                let today = new Date().format('yyyy/MM/dd');
                const compare = (x, y) => {
                    let xDepartTime = new Date(today + ' ' + x.departTime);
                    let yDepartTime = new Date(today + ' ' + y.departTime);
                    if (xDepartTime < yDepartTime) {
                        return that.startTimeAsc ? -1 : 1;
                    } else if (xDepartTime > yDepartTime) {
                        return that.startTimeAsc ? 1 : -1;
                    } 
                    return 0;
                        
                };
                that.flightList = that.flightList.sort(compare);
            } else {
                //是否需要更改排序方式。如果是用户主动选择排序，则每次要颠倒；如果是查询列表时的排序，则不用颠倒
                //另外，用户主动选择一个排序时，把另外一个排序初始化
                if (!!reverse){
                    that.priceAsc = !that.priceAsc
                    that.startTimeAsc = false;
                }
                const compare = (x, y) => {
                    if (x.recommendCabins[0].fare < y.recommendCabins[0].fare) {
                        return that.priceAsc ? -1 : 1;
                    } else if (x.recommendCabins[0].fare > y.recommendCabins[0].fare) {
                        return that.priceAsc ? 1 : -1;
                    } 
                    return 0;
                        
                };
                that.flightList = that.flightList.sort(compare);
            }
            //每次排序完回到页面顶部
            let listDom = document.getElementById('list');
            !!listDom && (listDom.scrollTop = 0);
            //记住选择的排序方式
            extendUtils.setStorage(requestHandler.primaryKey + 'flightSort', JSON.stringify({ sortType: that.sortType, startTimeAsc: that.startTimeAsc, priceAsc: that.priceAsc }));
        },

        /**
             * 是否是改签查询列表
             */
        isEndorse() {
            return this.queryType == 'endorse';
        },

        /**
             * 如果搜索日期小于当前日期，1. 改签：需要重置为当前日期；2. 提示错误
             */
        resetSearchDate() {
            if (new Date(this.flightSearchObj.searchDate).getTime() < new Date(new Date().format("yyyy/MM/dd")).getTime()) {
                //如果是改签，则允许这种情况，并将搜索日期重置为当天
                if (this.isEndorse()) {
                    this.flightSearchObj.searchDate = new Date().format('yyyy/MM/dd');
                } else { //正常搜索时，不允许这种情况
                    return false;
                }
            }
            return true;
        },

        /**
             * 初始化价格日历
             */
        initCalendarData() {
            //初始化价格日历
            this.initPriceCalendar();
            //设置节假日
            this.getHoliday();
            //选中日历中的日期
            this.getCanledarInstance().setDate(new Date(this.flightSearchObj.searchDate).getTime() / 1000);
        },

        /**===============自动显隐筛选栏=================*/
        /**
             * 监听滚动条，开始滚动时隐藏筛选栏，在结束滚动时显示
             */
        addScrollListener() {
            document.body.addEventListener('scroll', this.handleScroll, true);
        },
        /**
             * 移除滚动条相关的监听事件。否则在下一个路由页面，这些事件还是存在
             */
        removeScrollListener() {
            document.body.removeEventListener('scroll', this.handleScroll, true);
        },
        handleScroll() {
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

        getNextMonth(addMonth) {
            let date = new Date();
            date.setMonth(date.getMonth() + addMonth);
            return date.getTime();
        },

        getNextDate(addDate = 0) {
            let date = new Date();
            date.setDate(date.getDate() + addDate);
            return date.getTime();
        },

        /**
             * 获取日历组件的实例
             */
        getCanledarInstance() {
            return this.$refs.calendar || {};
        }
    }
}

</script>
<style scoped lang="less">
    @import '~themes/default/styles/flightList/flightList.less';
</style>