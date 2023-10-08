<template>
    <div class="HotelMarketing">
        <div class="topTitleWrap lineBorderB">
            <div class="tit">去{{searchJson.cityName}}住哪里？</div>
            <div class="textWrap">
                <span class="text">特惠好房，安心入住</span>
                <!-- <span class="tips" v-if="haveUseCoupon">{{bestCouponText}}</span> -->
            </div>
        </div>
        <div class="recommendWrap">
            <div class="recommendTit">看看同事住过的酒店</div>
        </div>
        <div class="recommenHotelWrap">
            <div class="recommenHotelItemWrap cursorp normal-btn" v-for="(item,index) in marketingHotelList" :key="index" @click='openDetail(item.hotelId, item.providerType)'>
                <div class="recommenHotelItem">
                    <div class="topbgWrap">
                        <div class="topbg" v-bind:style="{backgroundImage: 'url(' + item.defaultPicture + ')'}"></div>
                    </div>
                    <div class="iteminfoWrap">
                        <div class="itemName">{{item.hotelName}}</div>
                        <div class="moneyWrap">
                            <span class="left">￥</span>
                            <span class="middle">{{item.minPrice}}</span>
                            <span class="right"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="tabwrap">
            <div class="panelwrap">
                <HotelDate class="hotelIndex cursorp normal-btn" :inDate='hotelTripJson.inDate' :outDate='hotelTripJson.outDate' :inDays='hotelTripJson.inDays' @click.native="selectCalendar()"/>
                <div class="lineTextWrap" v-if='useTypeConfig && useTypeConfig.isBoth()'>
                    <div class="label">出行类型</div>
                    <div class="text chooseButWrap">
                        <span class="chooseBut cursorp" @click="hotelTripType=USE_TYPE_ENUM.PUBLIC.name;setPriceFromCriterion()">
                            <Icon class="radio" v-if="useTypeConfig.isPublic(hotelTripType)" type="btn_common_radio_sel" size=".4"/>
                            <Icon class="radioempty" v-else type="btn_common_radio_nor" size=".4"/>
                            <span class="textType">因公</span>
                        </span>
                        <span class="chooseBut last cursorp" @click="hotelTripType=USE_TYPE_ENUM.PRIVATE.name;setPriceFromCriterion()">
                            <Icon class="radio" v-if="useTypeConfig.isPrivate(hotelTripType)" type="btn_common_radio_sel" size=".4"/>
                            <Icon class="radioempty" v-else type="btn_common_radio_nor" size=".4"/>
                            <span class="textType">因私</span>
                        </span>
                    </div>
                </div>
                <div class="searchButton cursorp normal-btn" @click="searchHotel">更多{{searchJson.cityName}}酒店</div>
            </div>
        </div>
        <div v-transfer-dom>
            <div class="calendarNewXmask" v-show="showHotelCalendar" @click="showHotelCalendar=false">
                <popup v-model="showHotelCalendar" class="pcDialog" position="bottom" :show-mask="true" hide-on-blur style="min-height: 8rem;background: #ffffff;z-index:1000; ">
                    <ScrollLock class="calendar" :lock="false" :bodyLock="showHotelCalendar">
                        <CalendarNewX ref="hotelCalendar" @commitDate="chooseDate" @click.native.stop="()=>{}" :displayMode="displayMode" :markedRange='rangeDate'></CalendarNewX>
                    </ScrollLock>
                </popup>
            </div>
        </div>
        <div v-transfer-dom>
            <Loading :show="querying" text=""></Loading>
        </div>
    </div>
</template>
<script>
import CalendarNewX from "../calendarNew/CalendarNewX.vue";
import HotelDate from './comp/HotelDate.vue';
import {TransferDom, Popup, Loading} from 'vux';
import HotelMarketingHandler from './js/HotelMarketingHandler.js';
import ScrollLock from './comp/scrollLock/vue-scroll-lock.vue';
import Icon from 'components/icon';
export default {
    directives:{
        TransferDom
    },
    components:{
        Popup,
        CalendarNewX,
        HotelDate,
        ScrollLock,
        Loading,
        Icon
    },
    props: {
        'orderNo':{},
        'providerType':{},
        'endCity':{},
        'arriveTime':{},
        'departTime':{},
        'useType':{
            default:'PRIVATE'
        },
        'tripNo':{},
        'pageFrom':{}
    }
    ,
    data() {
        return {
            displayMode:4,//日历模式
            rangeDate:[],//日历默认时间
            cityList:[],//城市列表
            hotelTripType: '', //PUBLIC因公，PRIVATE因私
            initHotelTripType: '', //页面初始类型PUBLIC因公，PRIVATE因私
            useTypeIsBoth:false,//是否展示因公因私切换按钮
            hotelTripJson:{//酒店查询参数可修改，用于更多按钮使用
                inDate: new Date().getTime(),
                outDate: new Date().getTime() + 24 * 60 * 60 * 1000,
                inDays: 1,
                startCity:'武汉',
                startCityCode:0,
                cLng:0,//纬度
                cLat:0//经度
            },
            searchJson:{//酒店列表参数用于推荐列表跳转使用
                keywords:'',
                cityName:'武汉',
                inDate: new Date().getTime(),
                outDate: new Date().getTime() + 24 * 60 * 60 * 1000
            },
            showHotelCalendar:false,//日历是否显示
            hotelCalendarIsShow:false,//酒店日历很快关闭的控制
            amountRange: [0, 600],//酒店价格筛选，0表示不设置下线，600表示不限上限
            hotelLimitPriceInfos:[],//我的差标酒店差标
            cityTypeInfos:[],//我的差标城市分类
            haveHotelCriterion:false,//是否拥有酒店差标
            htoelLimitPrice:-1,//酒店差标价格限制
            keywords:'',//酒店搜索关键字
            marketingHotelList:[],//推荐酒店列表
            haveUseCoupon:false,//是否有酒店可用优惠券
            bestCouponText:'',//优惠券描述文字
            querying:false,//查询详情中
            USE_TYPE_ENUM: HotelMarketingHandler.USE_TYPE_ENUM,//因公因私枚举
            useTypeConfig: null//获取因公因私的工具函数
        };
    },
    async created(){
        let _this = this;
        _this.init();
        this.useTypeConfig = await HotelMarketingHandler.useTypeConfig();
    },
    mounted(){
    },
    methods:{
        /**
             * 初始化数据
             */
        init(){
            let _this = this;
            _this.setTripInfo();
            //第一次打开酒店界面显示提示信息
            _this.rangeDate = [new Date(parseInt(_this.hotelTripJson.inDate)).format('yyyy/MM/dd'),new Date(parseInt(_this.hotelTripJson.outDate)).format('yyyy/MM/dd')];
            setTimeout(()=>{
                _this.$refs.hotelCalendar.resetViewByRange();
            },300)
            setTimeout(() => {
                _this.getHotelCity();
                _this.getMarketingHotelList();
                // _this.findPersonalCoupon();
            }, 200);
        },
        /**
             * 获取推荐酒店列表
             */
        getMarketingHotelList() {
            const that = this;
            let param = {
                cityName: that.hotelTripJson.startCity,//酒店
                inDate: that.formatDateTime(that.hotelTripJson.inDate),
                outDate: that.formatDateTime(that.hotelTripJson.outDate)
            }
            HotelMarketingHandler.getMarketingHotelList(param).then((res) => {
                if (!!res.result.dataHotel) {
                    that.marketingHotelList = res.result.dataHotel;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        /**
             * 获取酒店可用优惠券列表优惠券暂时屏蔽
             */
        // findPersonalCoupon() {
        //     const that = this;
        //     let param = {
        //         ProductType: 2,//酒店
        //         Status: 1//可用
        //     }
        //     HotelMarketingHandler.findPersonalCoupon(param).then((res) => {
        //         if (!!res.data.Coupons) {
        //             if(res.data.Coupons.length > 0){
        //                 that.haveUseCoupon = true;
        //                 let bestCoupon = res.data.Coupons[0];
        //                 if(bestCoupon.CouponType==1){
        //                     that.bestCouponText =  '满'+bestCoupon.FullValue+'减￥'+bestCoupon.CouponValue;
        //                 }else{
        //                     that.bestCouponText =  '立减￥'+bestCoupon.CouponValue;
        //                 }
        //             }
        //             console.log(res.Coupons)
        //         }
        //     }).catch((err) => {
        //         console.log(err);
        //     });
        // },
        /**
             * 搜索酒店
             */
        searchHotel() {
            let that = this;
            let cityName = that.hotelTripJson.startCity;
            if (!cityName) {
                HotelMarketingHandler.showToast('请选择城市');
                return;
            }
            if (0 >= that.hotelTripJson.inDays) {
                HotelMarketingHandler.showToast('入住天数至少是一天');
                return;
            }
            that.getHotelCity().then(function(){
            //判断城市是否正确
                that.doHotelSearch(cityName);
            });
        },
        /**
             * 打开酒店详情
             * @param {Object} hotel
             */
        openDetail(hid,providerType){
            let _this = this;
            //传递参数
            let url = 'hotel/index.html#/detail?'+
                'hid='+hid+
                '&inDate='+_this.searchJson.inDate+
                '&outDate='+_this.searchJson.outDate+
                '&inDays='+parseInt((_this.searchJson.outDate - _this.searchJson.inDate) / (24 * 60 * 60 * 1000))+
                '&useType='+_this.useType+
                '&providerType='+providerType+
                '&cityName='+_this.searchJson.cityName+
                '&pageFrom=orderSuc';
            if (_this.useTypeConfig.isPublic(_this.initHotelTripType)){
                url += ('&tripNo='+_this.tripNo);
            } else {
                url += '&tripNo=';
            }
            //统一收集数据
            let hotelObj = {
                hid:hid,
                inDate:_this.searchJson.inDate,
                outDate:_this.searchJson.outDate,
                inDays:parseInt((_this.searchJson.outDate - _this.searchJson.inDate) / (24 * 60 * 60 * 1000)),
                providerType:providerType,
                useType:_this.useType,
                tripNo:_this.tripNo,
                cityName:_this.searchJson.cityName
            }
            if (_this.querying){
                return;
            }
            //先查询酒店详情是否状态正常
            _this.querying = true;

            HotelMarketingHandler.getHotelDetail({
                hid:hotelObj.hid,
                inDate:new Date(parseInt(hotelObj.inDate)).format('yyyy/MM/dd'),
                outDate:new Date(parseInt(hotelObj.outDate)).format('yyyy/MM/dd'),
                providerType:hotelObj.providerType,
                useType:hotelObj.useType
            }).then(function(res){
                _this.querying = false;
                if (0==res.resultCode){
                    let key = 'hotelDetail'+hotelObj.hid+'_'+hotelObj.inDate+'_'+hotelObj.outDate;
                    HotelMarketingHandler.setStorage(key,JSON.stringify(res));
                    HotelMarketingHandler.handlerOpenPage(url); 
                }
            }).catch(()=>{
                //异常情况下由公共错误码进行提示
                _this.querying = false;
            }) 
        },
        /**
             * 执行酒店搜索
             * @cityName 所选城市
             */
        doHotelSearch(cityName){
            let _this = this;
            let cityCode = _this.isHotelCityValid(cityName);
            if (!cityCode){
                HotelMarketingHandler.showToast('请选择正确城市');
                return;
            }
            //传递查询条件
            let url = 'hotel/index.html#/list?keywords='+_this.keywords+
            '&useType='+_this.hotelTripType+
            '&cityName='+cityName+
            '&cityCode='+cityCode+
            '&pageFrom=orderSuc';
            //价格筛选
            if (_this.haveHotelCriterion){ //根据差标价格筛选
                url += '&minPrice=0';
                url += '&maxPrice='+_this.htoelLimitPrice;
                url += '&haveHotelCriterion='+_this.haveHotelCriterion;
            } else { //无差标价格
                if (_this.amountRange[0] != 0 && _this.amountRange[0] != 600){
                    url += '&minPrice='+_this.amountRange[0];
                }
                if (_this.amountRange[1] != 0 && _this.amountRange[1] != 600){
                    url += '&maxPrice='+_this.amountRange[1];
                }
            }
            //用于列表页判断是否显示符合差标按钮
            url += '&htoelLimitPrice='+_this.htoelLimitPrice;
            if (_this.useTypeConfig.isPublic(_this.hotelTripType)){
                url += ('&tripNo='+_this.tripNo);
            } else {
                url += '&tripNo=';
            }
            let hotelSearch = {
                inDate:_this.hotelTripJson.inDate,
                outDate:_this.hotelTripJson.outDate,
                inDays:_this.hotelTripJson.inDays
            }
            HotelMarketingHandler.setStorage('hotelSearch', JSON.stringify(hotelSearch));
            HotelMarketingHandler.handlerOpenPage(url);            
        },
        /**
             * 酒店城市名校验以及获取城市code
             * @cityName 城市名
             */
        isHotelCityValid(cityName){
            const that = this;
            for (let group of that.cityList){
                if (group.dataList){
                    for (let city of group.dataList){
                        if (city.name&&cityName==city.name){
                            return city.cityCode;
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
            console.log('selectCalendar')
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
                HotelMarketingHandler.showToast('请选择正确开始时间')
                return;
            }
            _this.hotelTripJson.inDate = data.startTime.getTime();
            if (!data.endTime.getTime()) {
                HotelMarketingHandler.showToast('请选择正确结束时间')
                return;
            }
            _this.hotelTripJson.outDate = data.endTime.getTime();
            if (_this.hotelTripJson.inDate == _this.hotelTripJson.outDate) {
                HotelMarketingHandler.showToast('开始时间和结束时间不能是同一天')
                return;
            }
            _this.hotelTripJson.inDays = parseInt((_this.hotelTripJson.outDate - _this.hotelTripJson.inDate) / (24 * 60 * 60 * 1000));
            _this.showHotelCalendar = false;
        },
        /**
             * 获取酒店城市
             */
        getHotelCity() {
            console.log("getHotelCity")
            const that = this;
            return new Promise(function(resolve){
                //获取缓存中的数据
                if (HotelMarketingHandler.getStorage('hotelCitys')){
                    that.cityList = JSON.parse(HotelMarketingHandler.getStorage('hotelCitys'));
                    //获取最新酒店城市并存储缓存
                    that.getHotelCityData();
                    resolve(that.cityList)
                } else {
                    return HotelMarketingHandler.getHotelCitys({}).then((res) => {
                        if (!!res.result.cityList) {
                            that.cityList = res.result.cityList;
                            if (0 < res.result.cityList.length && !!res.result.cityList[0].dataList[0].cityCode){
                                HotelMarketingHandler.setStorage('hotelCitys',JSON.stringify(res.result.cityList));
                            }
                            return res.result.cityList;
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            });
        },
        /**
             * 获取最新酒店城市
             */
        getHotelCityData() {
            //获取缓存中的数据
            HotelMarketingHandler.getHotelCitys({}).then((res) => {
                if (!!res.result.cityList) {
                    if (0 < res.result.cityList.length && !!res.result.cityList[0].dataList[0].cityCode){
                        HotelMarketingHandler.setStorage('hotelCitys',JSON.stringify(res.result.cityList));
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        /**
             * 获取所选城市的类别
             */
        getHotelCityType(){
            let _this = this; 
            let cityTypeInfos = _this.cityTypeInfos;
            let cityTypeInfosLength = _this.cityTypeInfos.length;
            let cityType = 3;//3为国内其他城市,//4为中国港澳
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
            if (_this.useTypeConfig.isPublic(_this.hotelTripType)){ //因公
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
                _this.amountRange = [0,600];
                _this.htoelLimitPrice = -1;
                _this.haveHotelCriterion = false;
            }
            _this.$forceUpdate();
        }, 
        /**
             * 格式化时间
             * @inputTime 时间
             */
        formatDateTime(inputTime){
            return new Date(parseInt(inputTime)).format('yyyy/MM/dd');
        },
        /**
             * 行程数据初始化，处理从行程、订单详情带入的参数
             */
        async setTripInfo(){
            let _this = this;
            let pageFrom = _this.pageFrom;
            if (!!pageFrom && (pageFrom == 'order')){ //交叉营销
                if (!!_this.endCity && '' != _this.endCity) {
                    _this.hotelTripJson.startCity = _this.endCity; 
                    _this.searchJson.cityName = _this.endCity;
                }   
                //通过统一的公共方法获取配置的因公因私配置
                let useTypeConfig = await HotelMarketingHandler.useTypeConfig();
                _this.hotelTripType = _this.useType || useTypeConfig.default();
                _this.initHotelTripType = _this.useType || useTypeConfig.default();
                _this.useTypeIsBoth = useTypeConfig.isBoth();

                let today = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
                let morry = new Date(new Date().setHours(0, 0, 0, 0)).getTime()+(24*3600*1000);
                let departTime = parseInt(_this.departTime);
                //入住时间小于今天
                if (departTime < today){
                    _this.hotelTripJson.inDate = today;
                    _this.searchJson.inDate = today;
                } else {
                    _this.hotelTripJson.inDate = departTime;
                    _this.searchJson.inDate = departTime;
                }
                //有入住时间并且入住时间小于明天
                if (!!_this.arriveTime){
                    let arriveTime = parseInt(_this.arriveTime);
                    if (arriveTime < morry){
                        _this.hotelTripJson.outDate = morry;
                        _this.searchJson.outDate = morry; 
                    } else {
                        _this.hotelTripJson.outDate = arriveTime;
                        _this.searchJson.outDate = arriveTime;
                    }
                } else {
                    _this.hotelTripJson.outDate = _this.hotelTripJson.inDate + 24 * 60 * 60 * 1000;
                    _this.searchJson.outDate = _this.hotelTripJson.inDate + 24 * 60 * 60 * 1000;
                }
                _this.hotelTripJson.inDays = parseInt((_this.hotelTripJson.outDate - _this.hotelTripJson.inDate) / (24 * 60 * 60 * 1000));
            }
        }
    }
}
</script>
<style lang="less">
    .HotelMarketing .tabwrap .panelwrap .hotelDate .tab .panel{ background: none;}
</style>
<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
.HotelMarketing{
    .topTitleWrap{
        background: @sub-background-color;
        padding: 0.25rem 0.3rem;
        .tit{
            margin-bottom: 0.05rem;
            color: @text-color;
            font-size: 0.38rem;
        }
        .textWrap{
            .flex-box();
            .align-items(center);
            .text{
                margin-right: 0.2rem;
                color: @secondary-text-color;
                font-size: 0.26rem;
            }
            .tips{
                color: @danger-color-light;
                font-size: 0.22rem;
                border: 1px solid @danger-color-light;
                border-radius: 0.03rem;
                padding: 0 0.08rem;
            }
        }
    }
    .recommenHotelWrap{
        // margin-bottom: 0.5rem;
        padding: 0 0 0 0.1rem;
        background: @sub-background-color;
        .flex-box();
        overflow-x: auto;
    }
    .recommendWrap{
        margin-top: 0.02rem;
        background: @sub-background-color;
        padding: 0 0.3rem;
        .flex-box();
        line-height: 0.8rem;
        .recommendTit{
            -webkit-box-flex: 1;
            -moz-box-flex: 1;
            -webkit-flex: 1;
            -ms-flex: 1;
            flex: 1;
            font-size: 0.3rem;
            color: @text-color;
            padding-left: 0.6rem;
            background: url(~assets/img/hotel/icon_recommend.png) no-repeat left;
            background-size: 0.4rem;
        } 
        .recommendright{
            color: @text-color;
            padding-right: 0.28rem; 
            font-size: 0.3rem;         
            background: url(~assets/img/hotel/icon_right.png) no-repeat right;
            background-size: 0.14rem 0.28rem;
        }   
    }
    .recommenHotelItemWrap{
        .flex(0 0 40%;);
        display: inline-block;
        width: 0;
        padding: 0 0.1rem;
        padding-bottom: 0.2rem;
        background: @sub-background-color; 
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        .recommenHotelItem{
            .topbgWrap{
                height: 1.68rem;
                background: url(~assets/img/hotel/empty.png) no-repeat center;
                background-size: cover;
                .topbg{
                    width: 100%;
                    height: 1.68rem;
                    background: url(~assets/img/hotel/empty.png) no-repeat center;
                    background-size: cover;
                }
            }
            .iteminfoWrap{
                .itemName{
                    padding: 0.15rem 0;
                    font-size: 0.3rem;
                    color: @text-color;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
                .moneyWrap{
                    // line-height: 0.5rem;
                    color: @danger-color-light;
                    .left{
                        font-size: 0.3rem;
                    }
                    .middle{
                        font-size: 0.4rem;
                    }
                    .right{
                        color: @placeholder-color;
                        font-size: 0.26rem;
                        padding-left: 0.1rem;
                    }
                    .coupon-label{
                        font-size: .2rem;
                        color: @danger-color-light;
                        text-align: center;
                        border-radius: .04rem;
                        border: 1px solid @danger-color-light;
                        min-width: 1.36rem;
                        padding: 0 .08rem;
                        margin-right: .16rem;
                    }
                }
            }
        }
    }

    .tabwrap{
        padding: 0.3rem;
        background: @sub-background-color;
        .panelwrap{
            padding: 0 0.3rem 0.5rem 0.3rem;
            .panel-box {
                position: relative;
            }
            .marketingDate{
                padding: 0.3rem 0;
            }
            .panel-box_attend {   
                .flex-box();
                .justify-content(space-between);
                .align-items(center);
                p{
                    font-size: .32rem;
                }
                .panel-box_bd {
                    -webkit-box-flex: 1;      
                    -moz-box-flex: 1;        
                    -webkit-flex: 1;          
                    -ms-flex: 1;              
                    flex: 1;
                    min-width: 0;
                    text-align: center;
                    .name{
                        font-size:0.32rem;
                        font-weight: 500;
                    }
                }
                .panel-box_title {
                    width: auto;
                    font-size: .36rem;
                    color: @text-color;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-wrap: break-word;
                    word-break: break-all;
                    .checkin,.dataTips{
                        color: @third-text-color;
                        font-size: .24rem;
                    }
                    .comment{
                        margin-left: .2rem;
                    }
                    .icon{
                        font-size: .25rem;
                        img{
                            width: .24rem;
                            margin-left: .1rem;
                            margin-right: .06rem;
                        }
                        &:first-child{
                            img{
                                margin-left: 0;
                            }
                        }
                    }
                    .day{
                        display: inline-block;
                        border: 1px dashed @border-color-base;
                        text-align: center;
                        line-height: 0.54rem;
                        border-radius: .54rem;
                        font-size: 0.28rem;
                        padding: 0 0.2rem;
                        color: @text-color;
                    }
                }
                .panel-box_title.top{
                    margin-top: 0;
                }
                .panel-box_title.mid{
                    margin-top: 0;
                    padding-top: 0;
                }
            }
            .lineTextWrap {
                padding: 0.25rem 0;
                .flex-box();
                .justify-content(space-between);
                .align-items(center);
                font-size: 0.32rem;
                height: .42rem;
                line-height: 2;
                .label {
                    color: @third-text-color;
                    width: 1.8rem;
                    margin-right: 0.2rem;
                }
                .text {
                    text-align: right;
                    color: @text-color;
                    cursor: pointer;
                    .chooseButWrap{
                        .flex-box();
                        .align-items(center);
                    }
                    .chooseBut {
                        display: inline-flex;
                        .align-items(center);
                        .radio{
                            color: @theme-color;
                            font-size: 0.4rem;
                        }
                        .radioempty{
                            font-size: 0.4rem;
                        }
                        .textType{
                            margin-left: 0.1rem;
                            font-size: 0.3rem;
                        }
                    }
                }
            }
            .searchButton {
                margin-top: 0.3rem;
                line-height: 0.8rem;
                background: @theme-color;
                color: @sub-background-color;
                font-size: 0.32rem;
                border-radius: 0.08rem;
                text-align: center;

            }
        }
    }
    .leftPart{
        text-align: left;
    }
    .rightPart{
        text-align: right;
    }
    .mr10{
        margin-right: 0.1rem;
    }
}
.calendarNewXmask{
    cursor: pointer;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.6);
    z-index: 999;
}
</style>

