<template>
    <div class="indexWrap" :class="{footerBar:showFooter}">
        <Platform name="serviceReminders"></Platform>
        <div class="indexbg">
            <div class="topbgWrap">
                <div class="topbg"></div>
            </div>
             <!-- 小红包入口 不能加到index层级中iphone6 IOS兼容 -->
            <!-- <RedPocket ref="redPocket"></RedPocket> -->
            <div class="topButtonWrap xg14">
            </div>
            <div class="contentWrap">
                <div class="top_bg"></div>
                <div class='swiperWrap'>

                    <div class="hotelDiv">
                        
                        <!-- 优惠券提示占位div -->
                        <!-- <div class="boxBlock" v-if="boxBlockShow"></div> -->
                        <div class="tab-swiper vux-center">
                            <!-- 优惠券提示 优惠券先行屏蔽不要删除2020-6-3-->
                            <!-- <InsertTips
                                ref="insertTips"
                                :dtReceiveCoupon="dtReceiveCoupon"
                            ></InsertTips> -->
                            <div class="hotelWrap flightWrap">
                                <div class="nearWrap bbpxd">
                                    <div v-if="useAddressDetail" class="textDetail cursorp" @click="selectCity('begin')">{{addressDetail}}</div>
                                    <div v-else class="leftTextWrap cursorp" @click="selectCity('begin')" placeholder="请选择城市">
                                        <div class="leftTextIn">
                                            {{hotelTripJson.startCity}}
                                        </div>
                                    </div>
                                    <Icon type='icon_common_rightarrow' class="nearWrapRight" size=".24"/>
                                    <div class="nearCitybgWrap">
                                        <div class="nearCityInWrap cursorp normal-btn" @click='nearCity'>
                                            <div class="nearLocationWrap">    
                                                <Icon type='icon_common_location' class="nearLocation" size=".4"/>
                                            </div>
                                            <div class="nearCitybg " >当前位置</div>
                                        </div>
                                    </div>
                                </div>
                                <HotelDate class="hotelIndex cursorp bbpxd" :inDate='hotelTripJson.inDate' :outDate='hotelTripJson.outDate' :inDays='hotelTripJson.inDays' @click.native="selectCalendar('start')"/>
                                <div class="lineTextWrap bbpxd">
                                    <div class="label">关键字</div>
                                    <input type="text" class="text xg9" placeholder="地点/品牌/酒店名称" v-model="keywords">
                                </div>
                                <div class="lineTextWrap starWrap bbpxd">
                                    <div class="label">价格/星级</div>
                                    <div class="text indexRightBut cursorp" @click="showhotelfliterPop=true">
                                        <div class="textShowBox">{{getHotelFliterText()}}</div>
                                        <Icon v-if="hotelFilters" size=".24" class="clearbut" type="icon_common_close"  @click.native.stop="starList=[];amountRange=[0,600];initHotelCriterion()"/>
                                        <Icon type='icon_common_rightarrow' class="textShowBoxRight" size=".24"/>
                                    </div>
                                </div>
                                <template v-if='useTypeConfig'>
                                    <div class="lineTextWrap" v-if="useTypeConfig.isBoth()">
                                        <div class="label">出行类型</div>
                                        <div class="text chooseButWrap">
                                            <span class="chooseBut cursorp" @click="setHotelTripType(USE_TYPE_ENUM.PUBLIC.name)">
                                                <Icon class="radio" v-if="useTypeConfig.isPublic(hotelTripType)" type="btn_common_radio_sel" size=".4"/>
                                                <Icon class="radioempty" v-else type="btn_common_radio_nor" size=".4"/>
                                                <span class="textType">因公</span>
                                            </span>
                                            <span class="chooseBut last cursorp" @click="setHotelTripType(USE_TYPE_ENUM.PRIVATE.name)">
                                                <Icon class="radio" v-if="useTypeConfig.isPrivate(hotelTripType)" type="btn_common_radio_sel" size=".4"/>
                                                <Icon class="radioempty" v-else type="btn_common_radio_nor" size=".4"/>
                                                <span class="textType">因私</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="tripLevel">
                                        <div v-show="useTypeConfig.isPublic(hotelTripType)" >
                                            差旅标准：<span>{{htoelLimitPrice == -1?'不限':'￥'+htoelLimitPrice+'/晚'}}</span>
                                        </div>
                                    </div>
                                </template>
                                <div class="primaryButtonWrap">
                                    <Button class="primaryButton" type="primary" @click="searchHotel()">查询</Button>
                                </div>
                            </div>
                        </div>

                        <!-- 优惠券弹出窗优惠券先行屏蔽不要删除2020-6-3-->
                        <!-- <div v-transfer-dom>
                            <NewActivityPopup v-show="isShowNewActivityPopup" ref='newActivityPopup'></NewActivityPopup>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
        <History ref="history" :inDate="hotelTripJson.inDate" :outDate="hotelTripJson.outDate" :lat="parseFloat(hotelTripJson.cLat)" :lng="parseFloat(hotelTripJson.cLng)" @clickActive="goDetail"></History>
        <div v-transfer-dom>
            <popup v-model="showHotelCalendar" position="bottom" :show-mask="true" hide-on-blur style="min-height: 8rem;background: #ffffff ">
                <div class="calendar">
                    <CalendarNewX ref="hotelCalendar" @commitDate="chooseDate" :displayMode="displayMode" :markedRange='rangeDate'></CalendarNewX>
                </div>
            </popup>
        </div>

        <!-- 企业商旅服务热线 -->
          <div class="hot_phone"><i class="left_line">-</i>企业商旅服务热线：<span @click="callPhone">{{hotPhone}}<i class="right_line">-</i></span></div>
        <div v-transfer-dom>
            <popup v-model="showhotelfliterPop" is-transparent>
                <div class="roomInfoWrap indexRoomInfoWrap" @touchmove.prevent>
                    <div class="roomTop bbpxs">价格星级筛选
                        <div class="btnWrap icon-btn" @click="showhotelfliterPop=false">
                            <Icon class="closeBtn" type="icon_common_close" size=".4"/>
                        </div>
                    </div>
                    <div class="roomInfoTit">价格</div>
                    <div class="sliderWrap">
                        <div class="sliderItemWrap">
                            <div class="sliderItem" :class="{active:item==amountRange[0] || item==amountRange[1]}" v-for="(item,index) in sliderItems" :key="index">{{item==600?'不限':item}}</div>
                        </div>
                        <div class="elsliderWrap">
                            <el-slider v-model="amountRange" show-stops range :show-tooltip="false" :step="100" :max="600" @change="initHotelCriterion"></el-slider>
                        </div>
                    </div>
                       <div class="roomInfoTit">星级(可多选)</div>
                    <checker class="checkerWrap" type="checkbox" v-model="starList" default-item-class="checkerDefault"
                        selected-item-class="check">
                        <checker-item :value="starLevel.key" class="cursorp" v-for="(starLevel, index) in starLevelList" :key="index">{{starLevel.value}}</checker-item>
                    </checker>
                    <div class="bottomButWrap">
                        <span class="rsetButton normal-btn" @click="starList=[];amountRange=[0,600]">重置</span>
                        <span class="okButton normal-btn" @click="showhotelfliterPop=false">完成</span>
                    </div>
                </div>
            </popup>
        </div>
        <div v-transfer-dom>
            <popup v-model="showCityPop" height="100%" width="100%" position="right" class="citySelect">
                <city :dataList='cityList' @choose='chooseCity' :hasSearch='true' 
                :hotList='hotCityList' :hisList='hisCityList'
                :hasHis='true' :hasHot='true' :hasLocal='true' :searchUrl='searchUrl' :cityType="'hotel'" :cityIsShow="showCityPop"></city>
            </popup>
        </div>

        <!-- 酒店首次进入的时候，显示的因公因私的弹窗不展示,屏蔽掉 -->
        <!-- <div v-transfer-dom>
            <div class="tipsInfoWrap" v-show="false">
                <div class="tipsInfo"></div>
                <div class="tipsClose cursorp" @click="hideAndSaveHotelTips"></div>
            </div>
        </div> -->
        <div v-transfer-dom>
            <footerBar v-if='showFooter' :activeType="'home'" :indexPage="'hotel'"/>
        </div>  
    </div>
</template>

<script>
// const NewActivityPopup = ()=>import('components/coupon/newActivityPopup.vue');
// const InsertTips = ()=>import('components/coupon/insertTips.vue');
// import {getProductType} from 'components/coupon/js/judgePageType.js'
import hotelHandler from 'hotelHandler/hotelHandler.js'
import CalendarNewX from "components/calendarNew/CalendarNewX.vue";
import Icon from 'components/icon';
import { TransferDom, Popup, Checker, CheckerItem } from 'vux';
    
import Button from 'components/button';
const city = ()=>import('components/city/city.vue');
const HotelDate = ()=>import('hotelComponent/hotelcomp/HotelDate.vue');
const Platform = ()=>import('components/announcement/index');
const footerBar = ()=>import('components/footerBar/footerBar.vue');
//是否是小应用
const miniApp = hotelHandler.getStorage('homePageType') == 'mini';
const History = ()=>import('hotelComponent/hotelcomp/HotelHistory.vue');
export default {
    mixins: [hotelHandler.mixin.tChatEventMixin],
    directives:{
        TransferDom
    },
    components:{
        History,
        Popup,
        Checker,
        CheckerItem,
        CalendarNewX,
        city,
        HotelDate,
        Platform,
        Icon,
        Button,
        footerBar
    },
    props:{
        isCurrent:{
            type:Boolean,
            default:false
        }
    },
    data() {
        let that = this;
        let managerData = hotelHandler.stateManager.setData([
            //酒店筛选条件界面显示控制
            {
                name: 'showhotelfliterPop',
                parent: miniApp ? null : '$refs.currentView',
                show: {
                    callback: function () {}
                },
                hide: {
                    callback: function () {}
                }
            },
            //显示日历
            {
                name: 'showHotelCalendar',
                parent: miniApp ? null : '$refs.currentView',
                show: {
                    callback: function () {}
                },
                hide: {
                    callback: function () {}
                }
            },
            //城市选择控件
            {
                name: 'showCityPop',
                parent: miniApp ? null : '$refs.currentView',
                show: {
                    callback: function () {}
                },
                hide: {
                    title: that.getTitleName(),
                    callback: function () {}
                }
            },
            {
                name:'isShowNewActivityPopup'
            }
        ], miniApp ? this : null);
        return Object.assign(managerData, {
            colorBtn:false,
            boxBlockShow:null, // 优惠券提示样式空白样式调整盒子
            isShowNewActivityPopup:false, //新人优惠券弹窗
            dtReceiveCoupon:false, // 是否点击新人页面领取
            displayMode:4,//日历模式
            rangeDate:[],//日历默认时间
            showHotelTips:false,//酒店提示
            searchUrl:'/hotel/v1/searchHotelCity',//搜索请求url
            cityList:[],//城市列表
            hisCityList:[],//历史城市列表
            hotCityList:[],//热门城市列表
            hotelTripType: '', //PUBLIC因公，PRIVATE因私
            hotelTripJson:{//酒店查询参数
                inDate: new Date().getTime(),
                outDate: new Date().getTime() + 24 * 60 * 60 * 1000,
                inDays: 1,
                startCity:'深圳',
                startCityCode:0,
                cLng:0,//纬度
                cLat:0//经度
            },
            locationCity:'深圳',//定位城市名
            hoveLocation: false,//定位是否成功
            getLocationing:false,//获取定位中
            hotelCalendarIsShow:false,//酒店日历很快关闭的控制
            amountRange: [0, 600],//酒店价格筛选，0表示不设置下线，600表示不限上限
            starLevelList: [//酒店星级筛选参数
                {key: 5,value: '五星/豪华'},
                {key: 4,value: '四星/高档'},
                {key: 3,value: '三星/舒适'},
                {key: 2,value: '二星/经济'}
            ],
            starLevelListMap: {//酒店星级显示map
                5: '五星/豪华',
                4: '四星/高档',
                3: '三星/舒适',
                2: '二星/经济'
            },
            starList: [], //酒店星级list
            sliderItems: [0,100,200,300,400,500,600],//酒店价格筛选组件参数
            hotelLimitPriceInfos:[],//我的差标酒店差标
            cityTypeInfos:[],//我的差标城市分类
            haveHotelCriterion:false,//是否拥有酒店差标
            htoelLimitPrice:-1,//酒店差标价格限制
            keywords:'',//酒店搜索关键字
            hotelFilters: false,//酒店价格星级筛选组件是否显示删除按钮
            pageFrom: this.$route.query.pageFrom,
            tempHotelFlitePri:{//临时存储因私价格星级
                amountRange:[0,600],
                starList:[]
            },
            firstShowPrivate:true,//是否是第一次展示因私
            addressDetail:'深圳',//定位到的详细地址
            useAddressDetail:false,//是否使用当前定位位置搜索
            USE_TYPE_ENUM: hotelHandler.USE_TYPE_ENUM,
            useTypeConfig: null,//因公因私配置信息
            toduNearCity: false,//是否点击了定位按钮
            showFooter:true,//是否展示底部导航栏首页默认展示底部导航栏
            inwxmini:hotelHandler.MINIPROGRAM_CONFIG.IN_MINIPROGRAM || false
        });
    },
    async created(){
        let that = this;
        hotelHandler.setStorage('homePageType','mini');
        that.$emit('showOff', true);
        sinosdk.sino.onChildWindowClose(function(){ //注册推送
            that.$refs.history.loadHistory();
            that.rereadHotel();
        }.bind(this));
        //window.rereadHotel = function(){that.rereadHotel()};
        that.init();
    },
    mounted(){
    },
    activated(){
        //调起定位 keep-alive时调用
        // this.$refs.insertTips.getPersonalCoupon()// 优惠券提示tips刷新方法
        // this.$refs.insertTips.getActivityData() // 优惠券提示tips刷新方法
    },
    computed:{
        //热线电话，从platform的常量里面取
        hotPhone(){
            return hotelHandler.BIS_CUSTOMER_SERVICE_PHONE;
        }
    },
    watch:{
        isShowNewActivityPopup(){ // 监听是生成过新人活动中心
            hotelHandler.setStorage('hasShowNewActivity'+'_'+hotelHandler.primaryKey+'hotel',true)
        }
    },
    deactivated(){
        //注销定位 keep-alive时调用
        hotelHandler.offLocation();
    },
    destroyed(){
        //注销定位
        hotelHandler.offLocation();
    },
        
    methods:{
        goDetail(history){
            let _this = this;
            let param = [
                'hid='+history.id,
                'inDate='+this.hotelTripJson.inDate,
                'outDate='+this.hotelTripJson.outDate,
                'inDays='+this.hotelTripJson.inDays,
                'tripNo='+this.$route.query.tripNo,
                'useType='+this.hotelTripType,
                'providerType='+history.providerType,
                'cityName='+this.hotelTripJson.startCity,
                'close=1'
            ]
            let hotelSearch = {
                inDate:this.hotelTripJson.inDate,
                outDate:this.hotelTripJson.outDate,
                inDays:this.hotelTripJson.inDays
            }
            //统一收集数据
            let hotelObj = {
                hid:history.id,
                inDate:_this.hotelTripJson.inDate,
                outDate:_this.hotelTripJson.outDate,
                inDays:_this.hotelTripJson.inDays,
                providerType:history.providerType,
                useType:_this.hotelTripType,
                tripNo:_this.$route.query.tripNo,
                cityName:_this.hotelTripJson.startCity
            }
            if (_this.$vux.loading.isVisible()){
                return;
            }
            if (this.inwxmini){
                hotelHandler.setStorage('hotelSearch', JSON.stringify(hotelSearch));
                hotelHandler.hotelOpenPage('hotel/index.html#/detail?'+param.join('&'));
                return
            }
            //先查询酒店详情是否状态正常
            _this.$vux.loading.show({text: ''})
            hotelHandler.getHotelDetail({
                hid:hotelObj.hid,
                inDate:new Date(parseInt(hotelObj.inDate)).format('yyyy/MM/dd'),
                outDate:new Date(parseInt(hotelObj.outDate)).format('yyyy/MM/dd'),
                providerType:hotelObj.providerType,
                useType:hotelObj.useType
            }).then(function(res){
                _this.$vux.loading.hide();
                if (0==res.resultCode){
                    let key = 'hotelDetail'+hotelObj.hid+'_'+hotelObj.inDate+'_'+hotelObj.outDate;
                    hotelHandler.setStorage(key,JSON.stringify(res));
                    hotelHandler.setStorage('hotelSearch', JSON.stringify(hotelSearch));
                    hotelHandler.hotelOpenPage('hotel/index.html#/detail?'+param.join('&'));
                }
            }).catch(()=>{
                //异常情况下由公共错误码进行提示
                _this.$vux.loading.hide()
            }) 
        },
        /**
            * 联系客服打电话
            */
        callPhone() {
            sinosdk.sino.callTel(this.hotPhone);
        },  
        /**
             * 初始化数据
             */
        async init(){
            let _this = this;
            //通过统一的公共方法获取配置的因公因私配置
            _this.useTypeConfig = await hotelHandler.useTypeConfig();
            _this.hotelTripType = this.$route.query.useType || _this.useTypeConfig.default();
            //第一次打开酒店界面显示提示信息
            _this.rangeDate = [new Date(parseInt(_this.hotelTripJson.inDate)).format('yyyy/MM/dd'),new Date(parseInt(_this.hotelTripJson.outDate)).format('yyyy/MM/dd')];
            setTimeout(()=>{
                _this.$refs.hotelCalendar.resetViewByRange();
            },300)
            if (!!!hotelHandler.getStorage('showHotelTipsIsShow')){
                _this.showHotelTips = true;
            }
            _this.setTripInfo();
            // _this.getLocation();
            setTimeout(() => {
                _this.getHotelHotCity();
                _this.getHotelCity(); 
            }, 300);
        },
        getTitleName(){
            return '酒店'
        },
        /**
             * 酒店我的附件按钮，如获取到定位信息则将城市名称填入酒店城市
             */
        nearCity() {
            var _this = this;
            if (!_this.hoveLocation) {
                hotelHandler.showToast('正在获取定位信息');
                if (!_this.getLocationing){
                    _this.getLocation();
                }
                _this.toduNearCity = true;
                return;
            }
            _this.hotelTripJson.startCity = _this.locationCity;
            if (_this.addressDetail != ''){
                _this.useAddressDetail = true;
            }
        },
        /**
         * 搜索酒店
         */
        searchHotel() {
            let that = this;
            let cityName = that.hotelTripJson.startCity;
            if (!cityName) {
                hotelHandler.showToast('请选择城市');
                return;
            }
            if (0 >= that.hotelTripJson.inDays) {
                hotelHandler.showToast('入住天数至少是一天');
                return;
            }
            // that.getHotelCity().then(function(){
            //判断城市是否正确
            if (this.inwxmini){
                that.doHotelSearch(cityName);
            } else {
                hotelHandler.authHandler.moduleGate(()=>{
                    that.doHotelSearch(cityName);
                })
            }
            //  });
        },
        /**
             * 执行酒店搜索
             * @cityName 所选城市
             */
        async doHotelSearch(cityName){
            let _this = this;
            let cityCode = _this.isHotelCityValid(cityName);
            if (!cityCode){
                hotelHandler.showToast('请选择正确城市');
                return;
            }
            //存储酒店历史城市
            _this.setHotelHistoryCity();
            //传递查询条件
            let url = 'hotel/index.html#/list?keywords='+Base64.encodeURI(_this.keywords)+
                '&useType='+_this.hotelTripType+
                '&cityName='+cityName+
                '&cityCode='+cityCode;
            //'&inDate='+_this.hotelTripJson.inDate+
            //'&outDate='+_this.hotelTripJson.outDate+
            //'&inDays='+_this.hotelTripJson.inDays;
            let indexHotelJson = {
                'cityName':cityName,
                'cityCode':cityCode
            };
            await hotelHandler.authInterceptor();
            hotelHandler.setStorage(hotelHandler.primaryKey+'_indexHotelJson', JSON.stringify(indexHotelJson));
            hotelHandler.setStorage('tripType', _this.hotelTripType);
                
            //价格筛选
            if (_this.haveHotelCriterion){ //根据差标价格筛选
                url += '&minPrice=0';
                url += '&maxPrice='+_this.htoelLimitPrice;
                url += '&haveHotelCriterion='+_this.haveHotelCriterion;
            } else { //无差标价格
                let amountData = JSON.parse(JSON.stringify(_this.amountRange));
                if (amountData[0] == amountData[1]){
                    amountData[0] = 0;
                    amountData[1] = 600;
                }
                url += '&minPrice='+amountData[0];
                url += '&maxPrice='+amountData[1];
            }
            //用于列表页判断是否显示符合差标按钮
            url += '&htoelLimitPrice='+_this.htoelLimitPrice;
            //星级筛选
            // if(0 < _this.starList.length){
            url += '&starList='+JSON.stringify(_this.starList);
            // }
            if (!!_this.$route.query.tripNo) {
                url += '&tripNo='+_this.$route.query.tripNo
            }
            if (_this.hoveLocation){
                url += ('&cLng='+_this.hotelTripJson.cLng+'&cLat='+_this.hotelTripJson.cLat+'&locationCity='+_this.locationCity);
            }
            if (_this.useAddressDetail){
                url += ('&useAddressDetail='+_this.useAddressDetail);
            }
            let hotelSearch = {
                inDate:_this.hotelTripJson.inDate,
                outDate:_this.hotelTripJson.outDate,
                inDays:_this.hotelTripJson.inDays
            }
            hotelHandler.setStorage('hotelSearch', JSON.stringify(hotelSearch));
            hotelHandler.hotelOpenPage(url);              
        },
        /**
             * 酒店城市名校验以及获取城市code
             * @cityName 城市名
             */
        isHotelCityValid(cityName){
            const that = this;
            for (let group of that.cityList){
                if (group.dataList){
                    for (let citys of group.dataList){
                        if (citys.name&&cityName==citys.name){
                            return citys.cityCode;
                        }
                    }
                }
            }
            return false;
        },
        /**
             * 打开选择时间组件
             * @type 业务类型
             */
        selectCalendar() {
            let that = this;
            let chooseDay = new Date(new Date().format("yyyy/MM/dd")).getTime() / 1000 + 24 * 3600;
            that.rangeDate = [new Date(parseInt(that.hotelTripJson.inDate)).format('yyyy/MM/dd'),new Date(parseInt(that.hotelTripJson.outDate)).format('yyyy/MM/dd')];
            setTimeout(()=>{
                that.$refs.hotelCalendar.resetViewByRange();
            },300)
            that.$refs.hotelCalendar.setDate(chooseDay);
            that.showHotelCalendar = true;
            that.hotelCalendarIsShow = false;
            setTimeout(()=>{
                that.hotelCalendarIsShow = true;
            },200)
        },
        /**
         * 酒店选择时间
         * @data 时间
         */
        chooseDate(data) {
            let _this = this;
            if (!_this.hotelCalendarIsShow){
                return
            }
            if (!data.startTime.getTime()) {
                hotelHandler.showToast('请选择正确开始时间')
                return;
            }
            
            if (!data.endTime.getTime()) {
                hotelHandler.showToast('请选择正确结束时间')
                return;
            }
            if (data.startTime.getTime() == data.endTime.getTime()) {
                hotelHandler.showToast('开始时间和结束时间不能是同一天')
                return;
            }
            _this.hotelTripJson.inDate = data.startTime.getTime();
            _this.hotelTripJson.outDate = data.endTime.getTime();
            _this.hotelTripJson.inDays = parseInt((_this.hotelTripJson.outDate - _this.hotelTripJson.inDate) / (24 * 60 * 60 * 1000));
            _this.showHotelCalendar = false;
        },
        /**
             * 选择城市
             * @city 城市数据对象
             */
        chooseCity(citys) {
            const _this = this;
            _this.showCityPop = false;
            document.title = _this.getTitleName();
            if (_this.cityType == 'begin') {
                if (citys.type != undefined){ //重搜索城市选择
                    _this.hotelTripJson.startCity = citys.cityName;
                    if (citys.type == 0){
                        _this.keywords = '';
                    } else {
                        _this.keywords = citys.name;
                    }
                } else {
                    _this.hotelTripJson.startCity = citys.name;
                }
                _this.hotelTripJson.startCityCode = citys.cityCode;

                _this.setPriceFromCriterion();
            }
            _this.useAddressDetail = false;
        },
        /**
             * 打开城市选择组件
             * @type 业务类型
             */
        selectCity(type) {
            let _this = this;
            _this.showCityPop = true;
            document.title = '城市选择';
            _this.cityType = type;
        },
        /**
         * 存储酒店历史城市
         */
        async setHotelHistoryCity() {
            const that = this;
            await hotelHandler.authInterceptor();
            let cityKey = hotelHandler.primaryKey + "_HhCity";
            var cityList = !!hotelHandler.getStorage(cityKey) ? JSON.parse(hotelHandler.getStorage(cityKey)) : [];
            if (!!that.cityList && that.cityList.length > 0 && !!that.hotelTripJson){
                for (let i =0;i < that.cityList.length;i++){
                    var group = that.cityList[i];
                    if (!!group.dataList && group.dataList.length > 0){
                        for (let j=0;j<group.dataList.length;j++){
                            if (group.dataList[j].name == that.hotelTripJson.startCity){
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
                for (var j = i + 1; j < l; j++){
                    if (cityList[i].name === cityList[j].name){
                        i++;
                        j = i;
                    }
                }
                temp.push(cityList[i]);
            }
            cityList = temp;
            //存储的时候，最多储存6个城市。
            if (cityList.length > 6){
                cityList = cityList.slice(0,6);
            }
            hotelHandler.setStorage(cityKey, JSON.stringify(cityList));
            //刷新内存数据
            that.getHotelHistoryCity();
        },
        /**
         * 获取酒店历史城市
         */
        async getHotelHistoryCity() {
            const that = this;
            await hotelHandler.authInterceptor();
            let cityKey = hotelHandler.primaryKey + "_HhCity";
            var cityArray = !!hotelHandler.getStorage(cityKey) ? JSON.parse(hotelHandler.getStorage(cityKey)) : [];
            // let a = hotelHandler.getStorage("locationCity")
            //把存储的历史记录动态的加上当前的定位城市
            if (!!that.cityList && that.cityList.length > 0 && !!hotelHandler.getStorage("locationCity")){
                for (let i =0;i < that.cityList.length;i++){
                    var group = that.cityList[i];
                    if (!!group.dataList && group.dataList.length > 0){
                        for (let j=0;j<group.dataList.length;j++){
                            if (group.dataList[j].name == hotelHandler.getStorage("locationCity")){
                                //历史记录 定位的数据添加一个参数isLocation，标记是定位数据，要显示小图标
                                let cityLocal = JSON.parse(JSON.stringify(group.dataList[j]));
                                cityLocal.isLocation = true;
                                cityArray.unshift(cityLocal);  
                                break;
                            }
                        }
                    }
                }
            }
            //数组去重
            if (cityArray.length > 1){
                for (var i = 1; i < cityArray.length; i++) {
                    //定位城市需要去重
                    if (cityArray[i].name == cityArray[0].name){
                        cityArray.splice(i, 1);
                        i--;
                    }
                }
            }
            //显示的时候，包括定位城市，最多显示6个城市。
            if (cityArray.length > 6){
                cityArray = cityArray.slice(0,6);
            }
            that.hisCityList = hotelHandler.sortedUniq(cityArray);
        },
        /**
         * 获取酒店热门城市
         */
        getHotelHotCity() {
            const that = this;
            hotelHandler.getHotCity({}).then((res) => {
                if (!!res.result) {
                    that.hotCityList = res.result.cityList;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        /**
         * 获取酒店城市
         */
        getHotelCity() {
            const that = this;
            //获取缓存中的数据
            if (hotelHandler.getStorage('hotelCitys')){
                that.cityList = JSON.parse(hotelHandler.getStorage('hotelCitys'));
            }
            //获取最新酒店城市并存储缓存
            hotelHandler.getHotelCitys({}).then((res) => {
                if (!!res.result.cityList) {
                    that.cityList = res.result.cityList;
                    if (0 < res.result.cityList.length){
                        hotelHandler.setStorage('hotelCitys',JSON.stringify(res.result.cityList.slice(0,1)));
                    }
                }
                that.getHotelHistoryCity(); 
            }).catch((err) => {
                that.getHotelHistoryCity(); 
                console.log(err);
            });
        },
        /**
         * 获取定位信息
         */
        getLocation(){
            let _this = this;
            _this.getLocationing = true;
            if (hotelHandler.isPC()){ //pc调用h5定位
                _this.getLocationByGaode();
            } else {
                _this.getLocationByApp();
            }
                
        },
        /**
         * 获取定位信息
         */
        async getLocationByGaode(){
            let _this = this;
            await hotelHandler.authInterceptor();
            var onComplete = function(data){
                if (_this.hoveLocation){
                    return
                }
                _this.getLocationing = false;
                _this.hotelTripJson.cLng = data.point.x || 0;
                _this.hotelTripJson.cLat = data.point.y || 0;
                if (!data.point.x||!data.point.y||!(data.addressObj.addressComponent.city || data.addressObj.addressComponent.province)){ //定位返回数据失败
                    _this.hoveLocation = false;
                    hotelHandler.offLocation();//关闭定位
                    if ('' == _this.hotelTripJson.startCity) {
                        _this.hotelTripJson.startCity = '深圳';
                    }
                    return;
                }
                _this.locationCity = (data.addressObj.addressComponent.city || data.addressObj.addressComponent.province || '深圳').replace('市', '');
                _this.addressDetail = data.address || '深圳';
                if ('' == _this.hotelTripJson.startCity) {
                    _this.hotelTripJson.startCity = _this.locationCity;
                }
                hotelHandler.setStorage('locationCity', _this.locationCity);
                _this.getHotelHistoryCity(); 
                _this.hoveLocation = true;
                hotelHandler.offLocation();//关闭定位
                //是否点击了定位点
                if (_this.toduNearCity){
                    _this.hotelTripJson.startCity = _this.locationCity;
                    if (_this.addressDetail != ''){
                        _this.useAddressDetail = true;
                    }
                }
            }
            var onError = function(){
                _this.getLocationing = false;
                hotelHandler.offLocation();//关闭定位
                if ('' == _this.hotelTripJson.startCity) {
                    _this.hotelTripJson.startCity = '深圳';
                }
            }
            //使用高德地图定位
            hotelHandler.geoLocationByGaode(onComplete,onError);
        },
        /**
         * 获取定位信息
         */
        async getLocationByApp(){
            let _this = this;
            await hotelHandler.authInterceptor();
            var onComplete = function(data){
                if (_this.hoveLocation){
                    return
                }
                _this.getLocationing = false;
                _this.hotelTripJson.cLng = data.point.x || 0;
                _this.hotelTripJson.cLat = data.point.y || 0;
                if (!data.point.x||!data.point.y||!(data.address_detail||{}).city){ //定位返回数据失败
                    _this.hoveLocation = false;
                    if ('' == _this.hotelTripJson.startCity) {
                        _this.hotelTripJson.startCity = '深圳';
                    }
                    //app定位失败调用h5定位
                    _this.getLocationByGaode();
                    return;
                }
                _this.locationCity = ((data.address_detail||{}).city || '深圳').replace('市', '');
                _this.addressDetail = data.address || '深圳';
                if ('' == _this.hotelTripJson.startCity) {
                    _this.hotelTripJson.startCity = _this.locationCity;
                }
                hotelHandler.setStorage('locationCity', _this.locationCity);
                _this.getHotelHistoryCity(); 
                _this.hoveLocation = true;
                hotelHandler.offLocation();//关闭定位
                //是否点击了定位点
                if (_this.toduNearCity){
                    _this.hotelTripJson.startCity = _this.locationCity;
                    if (_this.addressDetail != ''){
                        _this.useAddressDetail = true;
                    }
                }
            }
            var onError = function(){
                _this.getLocationing = false;
                if ('' == _this.hotelTripJson.startCity) {
                    _this.hotelTripJson.startCity = '深圳';
                }
            }
            //使用app定位
            hotelHandler.geoLocation(onComplete,onError);
            //如果app定位失败则调用H5定位
            setTimeout(() => {
                if (!_this.hoveLocation){
                    _this.getLocationByGaode();
                }
            }, 5000);
        },
        /**
         * 获取所选城市的类别
         */
        getHotelCityType(){
            let _this = this; 
            let cityTypeInfos = _this.cityTypeInfos;
            let cityTypeInfosLength = _this.cityTypeInfos.length;
            let cityType = 3;//3为国内其他城市,//4为港澳
            if ('香港' == _this.hotelTripJson.startCity || '澳门' == _this.hotelTripJson.startCity || '中国香港' == _this.hotelTripJson.startCity || '中国澳门' == _this.hotelTripJson.startCity ){
                cityType = 4;
            }
            //根据城市名获取当前所选城市差标价格限制
            if (cityTypeInfosLength > 0){ //城市分类信息
                for (var i=0;i<cityTypeInfosLength;i++){
                    let cityInfos = cityTypeInfos[i].cityInfos;
                    let cityInfosLength = cityInfos.length;
                    for (var j=0;j<cityInfosLength;j++){
                        if (_this.hotelTripJson.startCity == cityInfos[j].name){
                            cityType = cityTypeInfos[i].cityType;
                            return cityType;
                        }
                    }
                }
            }
            return cityType;
        },
        /**
         * 根据我的差标信息设置酒店筛选价格
         */
        setPriceFromCriterion(){
            let _this = this; 
            if (this.useTypeConfig && this.useTypeConfig.isPublic(_this.hotelTripType)){ //因公
                let hotelLimit = _this.hotelLimitPriceInfos;
                let hotelLimitLength = _this.hotelLimitPriceInfos.length;
                let cityType = _this.getHotelCityType();//3为国内其他城市
                _this.htoelLimitPrice = -1;//-1表示所选城市无酒店差标设置
                //根据城市名获取当前所选城市差标价格限制
                if (hotelLimitLength > 0){ //有酒店差标设置
                    for (var i=0;i<hotelLimitLength;i++){
                        if (cityType == hotelLimit[i].cityType){
                            _this.htoelLimitPrice = hotelLimit[i].limitPrice;
                            if (0 < _this.htoelLimitPrice && 100 > _this.htoelLimitPrice){
                                _this.amountRange = [0,50];
                            } else if (100 < _this.htoelLimitPrice && 200 > _this.htoelLimitPrice){
                                _this.amountRange = [0,150];
                            } else if (200 < _this.htoelLimitPrice && 300 > _this.htoelLimitPrice){
                                _this.amountRange = [0,250];
                            } else if (300 < _this.htoelLimitPrice && 400 > _this.htoelLimitPrice){
                                _this.amountRange = [0,350];
                            } else if (400 < _this.htoelLimitPrice && 500 > _this.htoelLimitPrice){
                                _this.amountRange = [0,450];
                            } else if (500 < _this.htoelLimitPrice){
                                _this.amountRange = [0,550];
                            } else {
                                _this.amountRange = [0,_this.htoelLimitPrice];
                            }
                            break;
                        }
                    }
                }
                if (_this.htoelLimitPrice == -1){
                    _this.amountRange = [0,600];
                }
                _this.haveHotelCriterion = _this.htoelLimitPrice == -1?false:true;
            } else { //因私
                let dataJson = JSON.parse(JSON.stringify(_this.tempHotelFlitePri));
                _this.amountRange = dataJson.amountRange;
                _this.starList = dataJson.starList;
                _this.htoelLimitPrice = -1;
                _this.haveHotelCriterion = false;
            }
            _this.$forceUpdate();
        }, 
        //保存酒店因私条件
        async setHotelTempFliter(){
            let _this = this;
            if (_this.firstShowPrivate){
                await hotelHandler.authInterceptor();
                _this.tempHotelFlitePri = _this.getLastHotelFliter();
            } else {
                _this.tempHotelFlitePri.amountRange = JSON.parse(JSON.stringify(_this.amountRange));
                _this.tempHotelFlitePri.starList = JSON.parse(JSON.stringify(_this.starList));
            }
        },
        //获取酒店最后一次筛选的条件
        getLastHotelFliter(){
            let _this = this;
            let lastHotelFlite = {
                amountRange:[0,600],
                starList:[]
            };
            let cityName = _this.hotelTripJson.startCity;
            let cityCode = _this.isHotelCityValid(cityName);
            if (!!cityCode){
                let key = hotelHandler.primaryKey + cityCode + "_LastHotelFlite";
                if (!!hotelHandler.getStorage(key)){
                    let dataJson = JSON.parse(hotelHandler.getStorage(key));
                    lastHotelFlite.amountRange[0] = dataJson.minPrice;
                    lastHotelFlite.amountRange[1] = dataJson.maxPrice;
                    lastHotelFlite.starList = dataJson.starList
                }
            }
            return lastHotelFlite;
        },
        //切换因公因私
        setHotelTripType(type){
            let _this = this;
            if (this.USE_TYPE_ENUM.PRIVATE.name==type){
                _this.firstShowPrivate = false;
            } else {
                //保存因私条件
                _this.setHotelTempFliter();
            }
            _this.hotelTripType = type;
            _this.setPriceFromCriterion();

        },
        /**
         * 行程数据初始化，处理从行程、订单详情带入的参数
         */
        async setTripInfo(){
            let _this = this;
            //从缓存读取因私筛选参数
            _this.setHotelTempFliter();
            //酒店读取上一次查询的城市数据
            await hotelHandler.authInterceptor();
            if (!!hotelHandler.getStorage(hotelHandler.primaryKey+'_indexHotelJson')){
                let indexHotelJson = JSON.parse(hotelHandler.getStorage(hotelHandler.primaryKey+'_indexHotelJson'));
                if (!!indexHotelJson.cityName){
                    _this.hotelTripJson.startCity = indexHotelJson.cityName;
                }
                if (!!indexHotelJson.cityCode){
                    _this.hotelTripJson.cityCode = indexHotelJson.cityCode;
                }
            }
            let pageFrom = _this.$route.query.pageFrom;
            if (!!pageFrom && (pageFrom == 'trip' || pageFrom == 'order' || pageFrom == 'push')&&(_this.isCurrent||miniApp)){ //如果是行程或者订单详情中过来的数据，需要判断是否是酒店
                if (!!_this.$route.query.endCity && '' != _this.$route.query.endCity) {
                    _this.hotelTripJson.startCity = _this.$route.query.endCity;
                }
                let today = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
                let morry = new Date(new Date().setHours(0, 0, 0, 0)).getTime()+(24*3600*1000);
                let departTime = parseInt(_this.$route.query.departTime || _this.$route.query.inDate);
                //入住时间小于今天
                if (departTime < today){
                    _this.hotelTripJson.inDate = today;
                } else {
                    _this.hotelTripJson.inDate = departTime;
                }
                //有结束时间并且结束时间小于明天
                if (!!(_this.$route.query.arriveTime || _this.$route.query.outDate)){
                    let arriveTime = parseInt((_this.$route.query.arriveTime || _this.$route.query.outDate));
                    if (arriveTime < morry){
                        _this.hotelTripJson.outDate = morry;
                    } else if (arriveTime == departTime){ //如果入住时间等于结束时间
                        _this.hotelTripJson.outDate = _this.hotelTripJson.inDate + 24 * 60 * 60 * 1000;
                    } else {
                        _this.hotelTripJson.outDate = arriveTime;
                    }
                } else {
                    _this.hotelTripJson.outDate = _this.hotelTripJson.inDate + 24 * 60 * 60 * 1000;
                }
                _this.hotelTripJson.inDays = parseInt((_this.hotelTripJson.outDate - _this.hotelTripJson.inDate) / (24 * 60 * 60 * 1000));
            }
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
         * 酒店星级价格筛选显示文字处理
         */
        getHotelFliterText(){
            let _this = this;
            let textPrice = '';
            let textStar = '';
            //价格筛选
            if (_this.haveHotelCriterion){
                textPrice = '￥'+_this.htoelLimitPrice+'以下';
            } else if (_this.amountRange[0] == 0 && (_this.amountRange[1] == 0 || _this.amountRange[1] == 600)){
                textPrice = '不限';
            } else if (_this.amountRange[0] == 0 && _this.amountRange[1] > 0&& _this.amountRange[1] < 600){
                textPrice = '￥'+_this.amountRange[1]+'以下';
            } else if ((_this.amountRange[0] > 0 && _this.amountRange[0] < 600)&& _this.amountRange[1] == 600){
                textPrice = '￥'+_this.amountRange[0]+'以上';
            } else if ((_this.amountRange[0] > 0 && _this.amountRange[0] < 600)&& _this.amountRange[1] > 0&& _this.amountRange[1] < 600){
                textPrice = '￥'+_this.amountRange[0]+'-'+'￥'+_this.amountRange[1];
            } else if (_this.amountRange[0] == 600 && _this.amountRange[1] == 600){
                textPrice = '不限';
            }
            //星级筛选
            if (0 < _this.starList.length){
                for (var i=0;i<_this.starList.length;i++){
                    if (i == _this.starList.length-1){
                        textStar += _this.starLevelListMap[_this.starList[i]];
                    } else {
                        textStar += _this.starLevelListMap[_this.starList[i]]+'，';
                    }
                }
            } else {
                textStar = '不限';
            }
            let text = '';
            if (textPrice == '不限' && textStar == '不限'){
                text = '不限';
            } else if (textPrice != '不限' && textStar == '不限'){
                text = textPrice;
            } else if (textPrice != '不限' && textStar != '不限'){
                text = textPrice+' '+textStar;
            } else if (textPrice == '不限' && textStar != '不限'){
                text = textStar;
            }
            _this.hotelFilters = (text!='不限');
            return text;
        }, 
        /**
             * 滑动价格或取消酒店价格星级筛选，去除符合差标的选项
             */
        initHotelCriterion(){
            let _this = this;
            if (_this.haveHotelCriterion){
                _this.haveHotelCriterion = false;
            }
        },
        /**
             * 隐藏并保存酒店提示层隐藏状态
             */
        hideAndSaveHotelTips(){
            let _this = this;
            _this.showHotelTips = false;
            hotelHandler.setStorage('showHotelTipsIsShow', true);
        },
        /**
             * 首页同步列表页或详情页的日期数据
             */
        rereadHotel(){
            let _this = this;
            let hotelSearch = JSON.parse(hotelHandler.getStorage('hotelSearch'));
            _this.hotelTripJson.inDate = hotelSearch.inDate;
            _this.hotelTripJson.outDate = hotelSearch.outDate;
            _this.rangeDate = [new Date(parseInt(_this.hotelTripJson.inDate)).format('yyyy/MM/dd'),new Date(parseInt(_this.hotelTripJson.outDate)).format('yyyy/MM/dd')];
            setTimeout(()=>{
                _this.$refs.hotelCalendar.resetViewByRange();
            },300)
            _this.hotelTripJson.inDays = parseInt((hotelSearch.outDate - hotelSearch.inDate) / (24 * 60 * 60 * 1000));
        },
        /**
            * T信回退事件的注册回调 必须是goBackFun
            */
        goBackFun(){
            hotelHandler.offLocation();
            hotelHandler.closePage('')
        }
    }
}
</script>
<style lang="less">
    @import './index.less';
</style>
