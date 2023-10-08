<template>
    <div class="hotelListWrap">
        <div ref="hotelListWrap" class="hotelListScroll" @scroll="loadMore()">
            <div ref="hotelListIn">
                <HotelList  v-for="(item,index) in hotelList" :key="index" @click.native='openDetail(item.hotelId, item)'
                :hotel="item" :locationPoint='locationPoint' :ispositionSearch='ispositionSearch' :positionName='positionName' 
                :isCityPosition='isCityPosition' :locationName='locationName' :islocationSearch='islocationSearch' :areaId="areaId" :sortIndex="sortIndex"/> 
                <LoadingX
                    style="padding: .2rem;"
                    v-if="loading && !initpage"
                    :spinning="loading"
                    :turn="loading"
                    size="default"
                    tip="数据加载中"
                />
                <div v-else-if="!loading && noFlag">
                    <EmptyX  tipsText='暂无酒店数据'/>
                    <div class="resetflitle"><span class="cursorp normal-btn" @click="resetflitle">清空筛选</span></div>
                </div>
                <div v-if='hotelList.length < 4 && 0 < dataRecommendHotel.length'>
                    <div  class="recommendWrap lineBorderB"><div class="recommendTit">为您推荐以下热卖酒店</div></div>
                    <HotelList  :listType="'recommend'" 
                    v-for="(item,index) in dataRecommendHotel" :key="'recommen'+index" @click.native='openDetail(item.hotelId, item)'
                    :hotel="item" :locationPoint='locationPoint'  :ispositionSearch='ispositionSearch' :positionName='positionName' 
                    :isCityPosition='isCityPosition' :locationName='locationName' :islocationSearch='islocationSearch' :areaId="areaId" :sortIndex="sortIndex"/>
                </div>
                <div v-else-if="nomore && 1<pageIndex" style="text-align: center;padding: .2rem;color:#999999;">
                    <span>已经到底了</span>
                </div>
            </div>
        </div>
        <HotelMap v-show='!showList' :hotelList='hotelList' :locationPoint='locationPoint'/>
        <div class="quickFilterWrap" :class="{map:!showList,scrolling:isScrolling && 100 < listScrollTop && !isPc}">
            <div v-if="useTypeConfig && useTypeConfig.isPublic(hotelUseType) && -1 < htoelLimitPrice" @click="toggleHotelCriterion" class="quickFilterItem cursorp" :class="{active:hotelCriterionShow}">符合差标</div>
            <div  @click="setPayType(item.id);setBrandDes(item.name,filterInfoList[3].groupList[0].isTabOnly?'radio':'checkbox',filterInfoList[3].groupList[0].tabList);brandDes = brandDesTemp[0]" class="quickFilterItem cursorp" :class="{active:index===filterInfoList[3].groupList[0].choosed}" v-for="(item,index) in filterInfoList[3].groupList[0].tabList" :key="index">{{item.name}}</div>
        </div>
        <div v-transfer-dom class="searchAndFilterOutWrap">
            <div v-if='showSearchComponent' class="searchAndFilterWrap pcDialog" :class="{hideDateing:!showHotelCalendar}">
                <div class="search-component">
                    <div class="componentOut">
                        <div class="contentWrap">
                            <div class="content">
                                <div class="position">{{searchJson.cityName}}</div>
                                <div class="travel-time cursorp normal-btn" @click="selectCalendar">
                                    <div class="topline">
                                        <span class="label">住</span>
                                        <span class="time">{{new Date(parseInt(searchJson.inDate)).format('MM-dd')}}</span>
                                    </div>
                                    <div>
                                        <span class="label">离</span>
                                        <span class="time">{{new Date(parseInt(searchJson.outDate)).format('MM-dd')}}</span>
                                    </div>
                                </div>
                                <div class="input-block">
                                    <input type="search" ref="hotelSearch" @keyup.enter='getHotelList(true,true)' maxlength="20" v-model="searchJson.keywords" @focus="showhotelfliterPop = false" placeholder="酒店/位置/品牌"/>
                                </div>
                                <!-- <div class="icon cursorp normal-btn" @click="getHotelList(true,true)">搜索</div> -->
                            </div>
                        </div>
                        <!-- 酒店地图 -->
                        <div class="map normal-btn cursorp" @click='showMap' :class="{hotelList:!showList}"></div>
                    </div>
                </div>
                <div class="filterWrap">
                    <div class="tabItemWrap">
                        <div class="tabItem cursorp" @click="showhotelfliter(0)" :class="{disable:isDisable}"><span :class="{active:(showhotelfliterPop&&filterActive==0)||sortDes!='推荐排序'}">{{sortDes}}</span></div>
                        <div class="tabItem cursorp" @click="showhotelfliter(1)" :class="{disable:isDisable}"><span :class="{active:(showhotelfliterPop&&filterActive==1)||positionDes!='位置区域'}">{{positionDes}}</span></div>
                        <div class="tabItem cursorp" @click="showhotelfliter(2)" :class="{disable:isDisable}"><span :class="{active:(showhotelfliterPop&&filterActive==2)||priceDes!='价格/星级'}">{{priceDes}}</span></div>
                        <div class="tabItem cursorp" @click="showhotelfliter(3)" :class="{disable:isDisable}"><span :class="{active:(showhotelfliterPop&&filterActive==3)||brandDes!='筛选'}">{{brandDes}}</span></div>
                    </div>
                </div>
            </div>
        </div> 
        <div v-transfer-dom class="hotelList">
            <popup v-model="showhotelfliterPop" is-transparent position="top">
                <div class="roomInfoWrap" tips="推荐排序" v-show="filterActive==0"  @touchmove.prevent>
                    <div class="sortWrap">
                        <block v-for="(item,index) in sortMap[sortMapIndex]" :key="index" >
                        <div class="sortLine lineBorderB cursorp" v-if="3 != index || isCityPosition || ispositionSearch" :class="{active:index==sortIndex}" @click="setSort(index,item)">{{item.name}}</div>
                        </block>
                    </div>
                </div> 
                <div class="roomInfoWrap" tips="位置区域" v-show="filterActive==1">
                    <div class="groupWrap">
                        <div class="leftWrap">
                            <block v-for="(group,index) in locationAreaList" :key="index">
                                <div class="tit cursorp" v-if="0 != index || isCityPosition" :class="{active:locationAreaIndex==index}" @click="locationAreaIndex=index">{{group.groupName}}</div>
                            </block>
                        </div>
                        <div class="middleWrap" v-if="'positionParent' == locationAreaList[locationAreaIndex].groupType">
                            <div class="tit cursorp" :class="{active:locationAreaList[locationAreaIndex].choosed==index}" @click="changeLocationMiddle(index)" v-for="(middleGroup,index) in locationAreaList[locationAreaIndex].groupList" :key="index">{{middleGroup.typeName}}</div>
                        </div>
                        <div  class="groupRightWrap" :bodyLock="showhotelfliterPop">
                            <div class="tabWrap" v-if="'location' == locationAreaList[locationAreaIndex].groupType">
                                <div class="sortWrap">
                                    <div class="sortLine lineBorderB cursorp" :class="{active:tab.id==areaId}" v-for="(tab,index) in locationAreaList[locationAreaIndex].groupList[0].tabList" @click="loctionSearch(tab)" :key="index">{{tab.name}}</div>
                                </div>
                                </div>
                                <div class="tabWrap" v-if="'position' == locationAreaList[locationAreaIndex].groupType">
                                <div class="sortWrap">
                                    <div class="sortLine lineBorderB cursorp" :class="{active:locationAreaList[locationAreaIndex].choosed == index}" v-for="(tab,index) in locationAreaList[locationAreaIndex].groupList" @click="positionSearch(tab,index,false)" :key="index">{{tab.name}}</div>
                                </div>
                                </div> 
                                <div class="tabWrap" v-if="'positionParent' == locationAreaList[locationAreaIndex].groupType">
                                <div class="sortWrap">
                                    <div class="sortLine lineBorderB cursorp" :class="{active:locationAreaList[locationAreaIndex].groupList[locationAreaList[locationAreaIndex].choosed].choosed == index}" v-for="(tab,index) in locationAreaList[locationAreaIndex].groupList[locationAreaList[locationAreaIndex].choosed].pois" @click="positionSearch(tab,index,true)" :key="index">{{tab.name}}</div>
                                </div>
                            </div>  
                        </div>
                    </div>
                </div>                 
                <div class="roomInfoWrap" tips="价格星级筛选" v-show="filterActive==2">   
                    <div class="price_groupWrap">
                        <div class="roomInfoTit">价格</div> 
                        <div class="sliderWrap">
                            <div class="sliderItemWrap">
                                <div class="sliderItem" :class="{active:item==amountRange[0] || item==amountRange[1]}" v-for="(item,index) in sliderItems" :key="index">{{item==600?'不限':item}}</div>
                            </div>
                            <div class="elsliderWrap">
                                <el-slider v-model="amountRange" show-stops range :show-tooltip="false" :step="100" :max="600"></el-slider>
                            </div>
                        </div> 
                        <div class="checkerWrap lineBorderB setstart">
                            <div class="cursorp checkerDefault" v-for="(item, index) in setPriceRangeDate" :key="index" @click="amountRange=item.range">{{item.text}}</div>
                        </div>
                        <div class="roomInfoTit">星级(可多选)</div>
                        <checker class="checkerWrap lineBorderB" type="checkbox" v-model="starList" default-item-class="checkerDefault"
                            selected-item-class="check">
                            <checker-item :value="starLevel.key" class="cursorp" v-for="(starLevel, index) in starLevelList" :key="index">{{starLevel.value}}</checker-item>
                        </checker>
                    </div>
                    <div class="bottomButWrap">
                        <span class="rsetButton normal-btn" @click="starList=[];amountRange=[0,600];setPriceDes()">重置</span>
                        <span class="okButton normal-btn" @click="showhotelfliterPop=false;initHotelCriterion();setPriceDes();getHotelList(true);">完成</span>
                    </div>
                </div>
                <div class="roomInfoWrap" tips="筛选" v-show="filterActive==3">
                    <div class="groupWrap">
                        <div class="leftWrap" @touchmove.prevent>
                            <div class="tit cursorp" :class="{active:filterInfoIndex==index}" @click="filterInfoIndex=index" v-for="(group,index) in filterInfoList" :key="index">{{group.groupName}}</div>
                        </div>
                        <div  class="groupRightWrap" :bodyLock="showhotelfliterPop">
                            <div class="tabWrap" v-for="(tab,index) in filterInfoList[filterInfoIndex].groupList" :key="index">
                                <div class="roomInfoTit">{{tab.tabName}}</div>
                            <checker v-if="!!filterInfoList[filterInfoIndex].isGroupOnly" class="checkerWrap lineBorderB" v-model="filterInfoList[filterInfoIndex].choosed" default-item-class="checkerDefault"
                                selected-item-class="check">
                                <checker-item :value="item" @on-item-click="setBrandDes(item.shortName,'isGroupOnly',filterInfoList[filterInfoIndex].groupList)" v-for="(item, index) in tab.tabList" :key="index">{{item.shortName}}</checker-item>
                            </checker>
                            <checker v-else class="checkerWrap lineBorderB" :type="tab.isTabOnly?'radio':'checkbox'" v-model="tab.choosed" default-item-class="checkerDefault"
                                selected-item-class="check">
                                <checker-item :value="item.id"  @on-item-click="setBrandDes(item.name,tab.isTabOnly?'radio':'checkbox',tab.tabList)" v-for="(item, index) in tab.tabList" :key="index">{{item.name}}</checker-item>
                            </checker>
                            </div>
                        </div> 
                    </div>                   
                    <div class="bottomButWrap">
                        <span class="rsetButton cursorp normal-btn" @click="resetFilterInfo">重置</span>
                        <span class="okButton cursorp normal-btn" @click="showhotelfliterPop=false;getHotelList(true);brandDes = brandDesTemp[0]">完成</span>
                    </div>
                </div>                
            </popup>
        </div>
        <div v-transfer-dom>
            <popup v-model="showHotelCalendar" position="bottom" :show-mask="true" hide-on-blur style="min-height: 8rem;background: #ffffff ">
                <div class="calendar">
                    <CalendarNewX ref="hotelCalendar" @commitDate="chooseDate" :displayMode="displayMode" :markedRange='rangeDate'></CalendarNewX>
                </div>
            </popup>
        </div>
    </div>
</template>

<script>
import hotelHandler from 'hotelHandler/hotelHandler.js'
import HotelList from 'hotelComponent/hotelcomp/hotelList.vue';
import HotelMap from 'hotelComponent/hotelcomp/HotelMap.vue';
import {TransferDom,Checker,CheckerItem,Popup} from 'vux';  
import EmptyX from "components/empty/EmptyX.vue";
import CalendarNewX from "components/calendarNew/CalendarNewX.vue";
import LoadingX from "components/loading";
// import ScrollLock from 'hotelComponent/scrollLock/vue-scroll-lock.vue';
export default {
    mixins: [hotelHandler.mixin.tChatEventMixin],
    directives: {
        TransferDom
    },
    components: {
        HotelList,
        HotelMap,
        Checker,
        CheckerItem,
        Popup,
        // ScrollLock,
        CalendarNewX,
        EmptyX,
        LoadingX
    },
    data: function () {
        return {
            showList:true,//列表显示，用来控制列表与地图之间的切换
            locationPoint:{//当前位置
            },
            sortDes:'推荐排序',//推荐排序tiitle
            positionDes:'位置区域',//位置区域tiitle
            priceDes:'价格/星级',//价格/星级tiitle
            brandDes:'筛选',//筛选tiitle
            brandDesTemp:['筛选'],//筛选栈
            searchJson:{//搜索参数
                keywords:'',
                cityName:'',
                inDate: new Date().getTime(),
                outDate: new Date().getTime() + 24 * 60 * 60 * 1000
            },
            loading:false,//数据加载
            nomore:false,//沒有更多了
            pageSize:20,//每页条数
            pageIndex:1,//页数
            hotelList:[],
            noFlag:false,//没有数据标识
            initpage:true,//页面是否初始化
            tripNo:'',//行程ID
            systemEnvT:0,//环境ID
            filterActive:0,//筛选子类型展示（0排序、1位置、2价格、3筛选）
            amountRange: [0, 600],//价格删选，0表示不设置下线，600表示不限上限
            starLevelList: [//酒店星级list
                {key: 5,value: '五星/豪华'},
                {key: 4,value: '四星/高档'},
                {key: 3,value: '三星/舒适'},
                {key: 2,value: '二星/经济'}
                //              {key: 1,value: '快捷'}
            ],
            starLevelListMap: {//酒店星级map
                5: '五星/豪华',
                4: '四星/高档',
                3: '三星/舒适',
                2: '二星/经济'
                //              1: '快捷'
            },
            starList: [],//选中星级
            setPriceRangeDate:[
                {text:'￥100以下',range:[0,100]},
                {text:'¥100-200',range:[100,200]},
                {text:'¥200-300',range:[200,300]},
                {text:'¥300-400',range:[300,400]},
                {text:'¥400-500',range:[400,500]},
                {text:'￥500以上',range:[500,600]}
            ],
            showhotelfliterPop:false,//筛选界面显示控制
            sliderItems: [0,100,200,300,400,500,600],//价格参数
            sortMap:{
                0:[//排序参数
                    {name:'推荐排序',value:'Default'},
                    {name:'价格  低到高',value:'RateAsc'},
                    {name:'价格  高到低',value:'RateDesc'},
                    //{name:'推荐星级高到低',value:'StarRankDesc'},
                    {name:'距离您  近到远',value:'DistanceAsc'}
                ],
                1:[//排序参数
                    {name:'推荐排序',value:'Default'},
                    {name:'价格  低到高',value:'RateAsc'},
                    {name:'价格  高到低',value:'RateDesc'},
                    //{name:'推荐星级高到低',value:'StarRankDesc'}
                    {name:'距离  近到远',value:'DistanceAsc'} 
                ]
            },
            sortMapIndex:0,//排序参数索引
            sortIndex:0,//排序索引
            filterInfoList:[//筛选条件数据
                {groupName:'品牌连锁',choosed:'',isGroupOnly:true,groupList:[]},
                {groupName:'设施服务',groupList:[{choosed:[],tabName:'设施服务',tabList:[]}]},
                //{groupName:'房型早餐',groupList:[{choosed:[],tabName:'房型',tabList:[]},{choosed:'',tabName:'早餐',isTabOnly:true,tabList:[]}]},
                {groupName:'房型',groupList:[{choosed:[],tabName:'房型',tabList:[]}]},
                {groupName:'支付方式',groupList:[{choosed:'',tabName:'支付方式',isTabOnly:true,tabList:[{"id": 0,"name": "在线支付"},{"id": 1,"name": "到店支付"}]}]},
                {groupName:'主题推荐',groupList:[{choosed:'',tabName:'主题推荐',isTabOnly:true,tabList:[]}]}
            ],
            filterInfoIndex:0,//筛选类型索引（品牌、服务等）
            locationAreaList:[//位置区域-区域筛选参数
                {groupName:'距离我',groupType:'location',groupList:[{tabName:'距离我',tabList:[{id: '0',name:'不限'},{id: '10000001',name:'1km'},{id: '10000003',name:'3km'},{id: '10000005',name:'5km'}]}]},
                {groupName:'行政区',groupType:'location',groupList:[{tabName:'行政区',tabList:[]}]},
                {groupName:'商圈',groupType:'location',groupList:[{tabName:'商圈',tabList:[]}]}
            ],
            locationAreaIndex:0,//位置筛选类型ID（商圈，行政区域等）
            areaId:'0',//位置筛选类型ID
            hotelCriterionShow:!!this.$route.query.haveHotelCriterion,//是否拥有酒店差标
            hotelUseType: hotelHandler.USE_TYPE_ENUM.PUBLIC.name,//因公因私
            htoelLimitPrice:-1,//酒店差标价格限制
            ispositionSearch:false,//是否按位置中心点查询酒店
            positionLng:0,//中心点经度
            positionLat:0,//中心点纬度
            positionName:'',//位置中心点名字
            isCityPosition:false,//是否是定位城市
            islocationSearch:false,//是否按位置区域查询酒店
            locationName:'',//区域中心点名字
            cLng:0,//定位点经度
            cLat:0,//定位点纬度
            dataRecommendHotel:[],//相似酒店
            showHotelCalendar:false,//日历显示
            hotelCalendarIsShow:false,//酒店日历很快关闭的控制
            displayMode:4,//日历模式
            rangeDate:[],//日历默认时间
            isScrolling:false,//列表滚动中
            listScrollTop:0,//列表滚动距离
            isPc:false,//是否pc端
            // hotels:[],
            showSearchComponent: true,
            canAddpage:true,//滚动加载节流控制
            actionListScrollTop:0,//列表加载时滚动的距离，控制向下滚动才加载
            useTypeConfig: null,
            cityCode: this.$route.query.cityCode,//城市id
            isDisable:false, //解决用户多次点击的问题，loading为true时  筛选按钮不可点击
            homeTop: 0//页面滚动高度
        }
    },
    created: async function () {
        var _this = this;
        _this.isPc = hotelHandler.isPC();
        this.useTypeConfig = await hotelHandler.useTypeConfig()
        //获取定位信息
        try {
            _this.getLocation();
        } catch (e){
            console.log('location is fail')
        }
        _this.registerEvent();
        console.log("created.registerEvent")
        await _this.initSearchParam();
        _this.getHotelList();
        //获取酒店区域商圈参数
        _this.getLocationArea();
        //获取酒店筛选参数
        _this.getFilterInfo();
    },
    mounted: function () {
    },
    activated: function () {
        this.registerEvent();
        //判断日期是否变化，如果变了要重新查询
        let hotelSearchJson = JSON.parse(hotelHandler.getStorage('hotelSearch'));
        let newInDate = parseInt(hotelSearchJson.inDate);
        let newOutDate = parseInt(hotelSearchJson.outDate);
        let newRangeDate = [new Date(parseInt(newInDate)).format('yyyy/MM/dd'),new Date(parseInt(newOutDate)).format('yyyy/MM/dd')];
        let oldRangeDate = this.rangeDate;
        //保活时不从url上重新获取参数2019年12月20日16:13:21
        // this.initSearchParam();
        if (JSON.stringify(newRangeDate)!=JSON.stringify(oldRangeDate)){
            //设置日期
            this.setRangeDate();
            //修改了日期后数据重新查询
            this.getHotelList(true);
            this.homeTop = 0;
        } else {
            this.$refs.hotelListWrap.scrollTop = this.homeTop;
        }

    },
    deactivated: function () {
        this.showSearchComponent = false;//否则保活会导致页面切换时这个组件一致存在
    },
    watch: {
        isCityPosition: function (newVal, oldVal) {
            let _this = this;
            if (oldVal && !_this.ispositionSearch){ //更改城市为非当前城市
                _this.sortIndex = 0;
                _this.sortDes = '推荐排序';
            }
        },
        ispositionSearch: function (newVal, oldVal) {
            let _this = this;
            if (oldVal && !_this.isCityPosition){ //更改为位置区域搜索
                _this.sortIndex = 0;
                _this.sortDes = '推荐排序';
            }
        }
    },
    methods: {      
        registerEvent(){
            var _this = this;
            _this.showSearchComponent = true;
        },
        /**
         * 初始化酒店查询参数
         */
        async initSearchParam(){
            let _this = this;
            if (!!_this.$route.query.tripNo){
                _this.tripNo = _this.$route.query.tripNo;
            }  
            _this.hotelUseType = _this.$route.query.useType;
            //获取数据
            _this.searchJson.keywords = Base64.decode(_this.$route.query.keywords);
            _this.searchJson.cityName = _this.$route.query.cityName;  
            //设置日期
            _this.setRangeDate();
            //默认情况只有定位城市和输入城市相同的时候，才传输经纬度信息，否则会造成搜索结果按照经纬度所在的城市返回
            if (!!_this.$route.query.locationCity && !!_this.$route.query.cityName 
                && (_this.$route.query.locationCity == _this.$route.query.cityName)){
                if (!!_this.$route.query.cLng){
                    _this.cLng = _this.$route.query.cLng;
                }
                if (!!_this.$route.query.cLat){
                    _this.cLat = _this.$route.query.cLat;
                }  
                _this.isCityPosition = true;
            } else {
                _this.locationAreaIndex = 1;
            }
            //使用定位位置筛选
            if (!!_this.$route.query.useAddressDetail){
                _this.areaId = '10000005';
                _this.positionDes = '5km';
            } 

            //获取缓存的因私最后一次筛选条件
            await hotelHandler.authInterceptor();
            let key = hotelHandler.primaryKey + _this.cityCode + "_LastHotelFlite";
            let lastHotelFlite = {};
            if (!!hotelHandler.getStorage(key)){
                lastHotelFlite = JSON.parse(hotelHandler.getStorage(key));
            }
            let tempArr = [0,600];
            let isPrivate = _this.useTypeConfig.isPrivate(_this.hotelUseType);
            let recommendPriceRange = await _this.getRecommendPriceRange();
            //处理最低价格，先使用前一页面传入的数据，再使用推荐价格，最后使用缓存的最后一次查询的数据
            if (!!_this.$route.query.minPrice && !(0 ==_this.$route.query.minPrice && 600 ==_this.$route.query.maxPrice)){
                tempArr[0] = parseInt(_this.$route.query.minPrice);
            } else if (!!recommendPriceRange.minPrice || 0==recommendPriceRange.minPrice){
                tempArr[0] = 500 < recommendPriceRange.minPrice?500:recommendPriceRange.minPrice;
            } else if (isPrivate && !!lastHotelFlite.minPrice){
                tempArr[0] = lastHotelFlite.minPrice;
            } else {
                tempArr[0] = 0;
            } 
            //处理最高价格，先使用前一页面传入的数据，再使用推荐价格，最后使用缓存的最后一次查询的数据
            if (!!_this.$route.query.maxPrice && !(0 ==_this.$route.query.minPrice && 600 ==_this.$route.query.maxPrice)){
                tempArr[1] = parseInt(_this.$route.query.maxPrice);
            } else if (!!recommendPriceRange.maxPrice){
                tempArr[1] = 600 < recommendPriceRange.maxPrice?600:recommendPriceRange.maxPrice;
            } else if (isPrivate && !!lastHotelFlite.maxPrice){
                tempArr[1] = lastHotelFlite.maxPrice;
            } else {
                tempArr[1] = 600;
            }
            _this.amountRange = tempArr;
            //处理星级，先使用前一页面传入的数据，后使用缓存的最后一次查询的数据
            if (!!_this.$route.query.starList){
                _this.starList = JSON.parse(_this.$route.query.starList)
            } else if (isPrivate && !!lastHotelFlite.starList){
                _this.starList = lastHotelFlite.starList;
            }
            //处理排序，使用缓存的最后一次查询的数据
            if (isPrivate && !!lastHotelFlite.sortIndex){
                //非当前城市、非坐标点定位时没有距离近到远选项
                if (3 != lastHotelFlite.sortIndex || _this.isCityPosition || _this.ispositionSearch){
                    _this.sortIndex = lastHotelFlite.sortIndex;
                    _this.sortDes = _this.sortMap[_this.sortMapIndex][_this.sortIndex].name;
                }
            }
            //梳理因公有差标情况下的排序和价格筛选
            _this.htoelLimitPrice = parseInt(_this.$route.query.htoelLimitPrice);
            if (!!_this.$route.query.haveHotelCriterion){
                _this.setPriceFromCriterion();
            }
            if (!!JSON.parse(hotelHandler.getStorage('systemEnv'))){
                _this.systemEnvT = JSON.parse(hotelHandler.getStorage('systemEnv')).envType;
            }  
        },
        /**
         * 设置页面日期数据
         */
        setRangeDate(){
            let _this = this;
            let hotelSearchJson = JSON.parse(hotelHandler.getStorage('hotelSearch'));
            _this.searchJson.inDate = parseInt(hotelSearchJson.inDate);
            _this.searchJson.outDate = parseInt(hotelSearchJson.outDate);
            _this.rangeDate = [new Date(parseInt(_this.searchJson.inDate)).format('yyyy/MM/dd'),new Date(parseInt(_this.searchJson.outDate)).format('yyyy/MM/dd')];
            setTimeout(()=>{
                _this.$refs.hotelCalendar.resetViewByRange();
            },300)
        },
        /**
         * 根据我的差标信息设置酒店筛选价格
         */
        setPriceFromCriterion(){
            let _this = this; 
            if (_this.hotelCriterionShow){ //有差标价格
                _this.sortIndex = 2;
                _this.sortDes = '价格高到低';
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
            } else { //无差标价格
                _this.sortIndex = 0;
                _this.sortDes = '推荐排序';
                _this.amountRange = [0,600];
            }

        },
        /**
         * 获取定位
         */
        getLocation(){
            let _this = this;
            
            if (!!hotelHandler.getStorage('lng') && parseInt(hotelHandler.getStorage('lng')) > 0 ){
                _this.locationPoint = {
                    lng:hotelHandler.getStorage('lng'),
                    lat:hotelHandler.getStorage('lat')
                }
            }
            var onComplete = function(data){
                //console.log(JSON.stringify(data));
                _this.locationPoint = {
                    lng:data.point.x || 0,
                    lat:data.point.y || 0
                }
            }
            var onError = function(){
                //console.log(JSON.stringify(data));
                _this.locationPoint = {
                    lng:0,
                    lat:0
                }
            }
            hotelHandler.geoLocationByGaode(onComplete,onError);
        },
        /**
         * 初始化请求列表所需参数
         */
        resetHotelListParma(){
            let _this = this;
            _this.showhotelfliterPop = false;
            _this.sortIndex = 0;
            _this.amountRange = [0,600];
            _this.starList = [];
            _this.areaId = '0';
            _this.resetFilterInfo();
            _this.sortDes = '推荐排序';
            _this.positionDes = '位置区域';
            _this.hotelCriterionShow = false;
            _this.resetPositionData();
        },
        /**
         * 获取请求列表所需参数
         * @isInit 页数是否重置为1
         * @dataInit 筛选参数是否重置
         */
        getHotelListParma(isInit,dataInit){
            let _this = this;
            let postObj = JSON.parse(JSON.stringify(_this.searchJson));//避免强指针
            //因公因私
            postObj.useType = this.$route.query.useType;
            if (!!isInit){
                _this.pageIndex = 1;
                _this.actionListScrollTop = 0;
                _this.hotelList = [];
                _this.nomore = false; 
            }
            postObj.pageIndex = !!isInit?1:_this.pageIndex;
            postObj.pageSize = _this.pageSize;
            postObj.inDate = _this.formatDateTime(postObj.inDate);
            postObj.outDate = _this.formatDateTime(postObj.outDate);
            //用于相似酒店推荐
            if (_this.isCityPosition){ //城市为当前所处
                postObj.clng = _this.cLng;
                postObj.clat = _this.cLat;
            }
            postObj.hourRoom = false;//是否钟点房
            if (!dataInit){
                //推荐排序
                postObj.sort = _this.sortMap[_this.sortMapIndex][_this.sortIndex].value;
                if (3 == _this.sortIndex){ //距离我近到远
                    postObj.clng = _this.cLng;
                    postObj.clat = _this.cLat;
                }
                //位置区域筛选
                let areaId = parseInt(_this.areaId);
                if (_this.locationAreaIndex == 0 && 10000000 < areaId){ //距离
                    postObj.radius = areaId-10000000;
                    postObj.clng = _this.cLng;
                    postObj.clat = _this.cLat;
                } else if (_this.locationAreaIndex == 1){ //行政
                    postObj.districtId = areaId;
                } else if (_this.locationAreaIndex == 2){ //商圈
                    postObj.businessZoneId = areaId;
                }
                //以位置为中心点筛选
                if (_this.ispositionSearch){
                    postObj.radius = 5;//默认查询范围为5公里
                    postObj.clng = _this.positionLng;
                    postObj.clat = _this.positionLat;
                }
                //价格筛选
                if (_this.hotelCriterionShow){ //根据差标价格筛选
                    postObj.minPrice = 0;
                    postObj.maxPrice = parseInt(_this.htoelLimitPrice);
                } else { //无差标价格
                    if (_this.amountRange[0] != 0 && _this.amountRange[0] != 600){
                        postObj.minPrice = parseInt(_this.amountRange[0]);
                    }
                    if (_this.amountRange[1] != 0 && _this.amountRange[1] != 600){
                        postObj.maxPrice = parseInt(_this.amountRange[1]);
                    }
                }
                //星级筛选
                if (0 < _this.starList.length){
                    postObj.star = _this.starList;
                }
                //筛选——品牌筛选
                if ('' != _this.filterInfoList[0].choosed && [] != _this.filterInfoList[0].choosed){
                    postObj.brandId = _this.filterInfoList[0].choosed.brandId;
                    postObj.groupId = _this.filterInfoList[0].choosed.groupId;
                }
                //筛选——床型——含早——设施服务
                var tempArr = [];
                if ('' != _this.filterInfoList[1].groupList[0].choosed && [] != _this.filterInfoList[1].groupList[0].choosed){
                    tempArr = tempArr.concat(_this.filterInfoList[1].groupList[0].choosed)
                }
                if ('' != _this.filterInfoList[2].groupList[0].choosed && [] != _this.filterInfoList[2].groupList[0].choosed){
                    tempArr = tempArr.concat(_this.filterInfoList[2].groupList[0].choosed)
                }
                //if('' != _this.filterInfoList[2].groupList[1].choosed && [] != _this.filterInfoList[2].groupList[1].choosed){
                //tempArr = tempArr.concat(_this.filterInfoList[2].groupList[1].choosed)
                //}
                if (!!tempArr && tempArr.length>0){
                    postObj.facilities = tempArr.join(',');
                }
                //筛选——支付方式
                if (0 === _this.filterInfoList[3].groupList[0].choosed){ //在线付
                    postObj.onlyShowPrepay = true;
                } else if (1 === _this.filterInfoList[3].groupList[0].choosed){ //到店付
                    postObj.onlyShowSelfPay = true;
                }
                //筛选——主题
                if (!!_this.filterInfoList[4].groupList[0].choosed){
                    postObj.themeIds = _this.filterInfoList[4].groupList[0].choosed+'';
                }
            } else { //搜索初始化搜索条件和排序条件
                _this.resetHotelListParma();
            }
            return postObj;
        }, 
        /**
         * 获取酒店列表
         * @isInit 页数是否重置为1
         * @dataInit 筛选参数是否重置
         */
        getHotelList: function(isInit,dataInit) {
            let _this = this;
            if (_this.loading){
                return;
            }
            _this.loading = true;
            //关闭虚拟键盘
            setTimeout(()=>{
                this.$refs.hotelSearch.blur();
            },200)
            //获取酒店参数
            let postObj = _this.getHotelListParma(isInit,dataInit);
            //设置价格星级title
            _this.setPriceDes();
            //设置筛选title
            _this.brandDes = _this.brandDesTemp[0];
            //保存最近一次排序、价格、星级
            _this.setLastFliteData();
            _this.isDisable = true;
            hotelHandler.searchHotelList(postObj).then(function(res) {
                _this.$emit('showOff', true);
                if (0 == res.resultCode) {
                    _this.isDisable = false
                    _this.loading = false;
                    _this.initpage = false;
                    _this.dataRecommendHotel = res.result.dataRecommendHotel;
                    let rData = res.result || {};
                    _this.noFlag = (rData.dataHotel||[]).length==0;//没有数据标识
                    if (0 < (rData.dataHotel||[]).length) {
                        var dataList = res.result.dataHotel;
                        if (!!isInit){ //初始化页数
                            _this.hotelList = dataList;
                        } else { //加载下一页
                            _this.hotelList = _this.hotelList.concat(dataList)
                        } 
                        if (_this.pageIndex == res.result.totalPageCount || 0 == res.result.totalPageCount) { //最后一页时停止下拉
                            _this.nomore = true; //停止下拉
                        } else {
                            _this.pageIndex++
                        }
                    } else if (0 == res.result.totalPageCount) { //无数据时停止加载
                        _this.nomore = true; //停止下拉
                    } else {
                        _this.nomore = false;
                    }
                }
            }, true).catch((err) => {
                _this.loading = false;
                _this.isDisable = false;
                console.log(err);
            });
        }, 
        /**
         * 获取行政区域信息
         */
        getLocationArea:function(){
            let _this = this;
            hotelHandler.getLocationArea({cityId:_this.$route.query.cityCode}).then((res) => {
                if (!!res.result) {
                    _this.locationAreaList[1].groupList[0].tabList = res.result.districts;
                    _this.locationAreaList[1].groupList[0].tabList.unshift({id: '0',name:'不限'})
                    _this.locationAreaList[2].groupList[0].tabList = res.result.commerical;
                    _this.locationAreaList[2].groupList[0].tabList.unshift({id: '0',name:'不限'})
                    //机场/车站
                    if (!!res.result.station && res.result.station.length > 0){
                        let jsonData = {groupName:'机场/车站',choosed:0,groupType:'positionParent',groupList:_this.getPositionInfo(res.result.station,true)}
                        _this.locationAreaList.push(jsonData);
                    }  
                    //市内景点
                    if (!!res.result.cityCentreSite && res.result.cityCentreSite.length > 0){
                        let jsonData = {groupName:'市内景点',choosed:0,groupType:'position',groupList:_this.getPositionInfo(res.result.cityCentreSite,false)}
                        _this.locationAreaList.push(jsonData);
                    }
                    //市外景点
                    if (!!res.result.suburbAttractions && res.result.suburbAttractions.length > 0){
                        let jsonData = {groupName:'市外景点',choosed:0,groupType:'position',groupList:_this.getPositionInfo(res.result.suburbAttractions,false)}
                        _this.locationAreaList.push(jsonData);
                    } 
                    //大学
                    if (!!res.result.university && res.result.university.length > 0){
                        let jsonData = {groupName:'大学',choosed:0,groupType:'position',groupList:_this.getPositionInfo(res.result.university,false)}
                        _this.locationAreaList.push(jsonData);
                    }  
                    //演出场馆
                    if (!!res.result.performingArtsFacilities && res.result.performingArtsFacilities.length > 0){
                        let jsonData = {groupName:'演出场馆',choosed:0,groupType:'position',groupList:_this.getPositionInfo(res.result.performingArtsFacilities,false)}
                        _this.locationAreaList.push(jsonData);
                    } 
                    //医院
                    if (!!res.result.hospital && res.result.hospital.length > 0){
                        let jsonData = {groupName:'医院',choosed:0,groupType:'position',groupList:_this.getPositionInfo(res.result.hospital,false)}
                        _this.locationAreaList.push(jsonData);
                    }
                    //购物中心
                    if (!!res.result.shoppingMall && res.result.shoppingMall.length > 0){
                        let jsonData = {groupName:'购物中心',choosed:0,groupType:'position',groupList:_this.getPositionInfo(res.result.shoppingMall,false)}
                        _this.locationAreaList.push(jsonData);
                    }
                    //地铁站
                    if (!!res.result.subway && res.result.subway.length > 0){
                        let jsonData = {groupName:'地铁站',choosed:0,groupType:'positionParent',groupList:_this.getPositionInfo(res.result.subway,true)}
                        _this.locationAreaList.push(jsonData);
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
        }, 
        /**
         * 格式化位置数据
         */
        getPositionInfo(list,isParent){
            let data = list;
            let length = data.length;
            if (isParent){
                for (let i=0;i<length;i++){
                    data[i].choosed = 0;
                    data[i].pois.unshift({lng:-1,lat:-1,name:'不限'})
                }
            } else {
                data.unshift({lng:-1,lat:-1,name:'不限'})
            }
            return data;
        },
        /**
         * 获取筛选信息
         */
        getFilterInfo:function(){
            let _this = this;
            hotelHandler.getFilterInfo({cityId:_this.$route.query.cityCode}).then((res) => {
                if (!!res.result) {
                    let tempArr = [
                        {tabName:'热门',tabList:res.result.hotelBrands[0].brands},
                        {tabName:'经济',tabList:res.result.hotelBrands[1].brands},
                        {tabName:'舒适',tabList:res.result.hotelBrands[2].brands},
                        {tabName:'高档',tabList:res.result.hotelBrands[3].brands},
                        {tabName:'豪华',tabList:res.result.hotelBrands[4].brands}
                    ]
                    _this.filterInfoList[0].groupList = tempArr;
                    _this.filterInfoList[1].groupList[0].tabList = res.result.facilities;
                    _this.filterInfoList[2].groupList[0].tabList = res.result.bedTypes;
                    //_this.filterInfoList[2].groupList[1].tabList = res.result.breakfastTypes;
                    _this.filterInfoList[4].groupList[0].tabList = res.result.themes;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        /**
         * 重置筛选条件
         */
        resetFilterInfo(){
            let _this = this;
            for (var i=0;i<_this.filterInfoList.length;i++){
                if (_this.filterInfoList[i].isGroupOnly){
                    _this.filterInfoList[i].choosed = '';
                } else {
                    for (var j=0;j<_this.filterInfoList[i].groupList.length;j++){
                        _this.filterInfoList[i].groupList[j].choosed = _this.filterInfoList[i].groupList[j]=='isTabOnly'?'':[];
                    }
                }
            }
            _this.brandDesTemp = ['筛选'];
            _this.brandDes = _this.brandDesTemp[0];
        },
        /**
         * 翻页加载
         */
        loadMore() {
            let _this = this;
            _this.isListScrolling();
            if (_this.nomore || _this.loading) {
                return;
            }
            let scrollBoxHeight = _this.$refs.hotelListIn.offsetHeight;
            let windowHeight = _this.$refs.hotelListWrap.offsetHeight;
            let scrollTop = _this.$refs.hotelListWrap.scrollTop;
            if (scrollTop >= _this.actionListScrollTop && windowHeight + scrollTop + 5 >= scrollBoxHeight && _this.canAddpage) {
                _this.canAddpage = false;//限制多次触发
                _this.actionListScrollTop = scrollTop;
                setTimeout(function () {
                    _this.canAddpage = true;
                }, 500)
                _this.getHotelList();
            } 
        },
        /**
         * 切换筛选条件tab
         * @index 索引
         */
        showhotelfliter(index){
            let _this = this;
            if (_this.filterActive == index){
                _this.showhotelfliterPop = !_this.showhotelfliterPop;
            } else if (_this.showhotelfliterPop){
                _this.filterActive = index;
            } else {
                _this.showhotelfliterPop = !_this.showhotelfliterPop;
                _this.filterActive = index;
            }
        },
        /**
         * 打开酒店详情
         * @param {Object} hotel
         */
        openDetail:function(hid, item){
            let _this = this;
            //统一收集数据
            let hotelObj = {
                hid:hid,
                inDate:_this.searchJson.inDate,
                outDate:_this.searchJson.outDate,
                inDays:parseInt((_this.searchJson.outDate - _this.searchJson.inDate) / (24 * 60 * 60 * 1000)),
                providerType:item.providerType,
                useType:_this.$route.query.useType,
                tripNo:_this.tripNo,
                cityName:_this.$route.query.cityName
            }
            if (_this.$vux.loading.isVisible()){
                return;
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
                    _this.homeTop = _this.$refs.hotelListWrap.scrollTop;
                    _this.$router.push({
                        path:'/detail', 
                        query:{
                            hid: hotelObj.hid,
                            inDate:hotelObj.inDate,
                            outDate:hotelObj.outDate,
                            inDays:hotelObj.inDays,
                            tripNo:hotelObj.tripNo,
                            useType:hotelObj.useType,
                            providerType: hotelObj.providerType,
                            cityName:hotelObj.cityName
                        }
                    })
                }
            }).catch(()=>{
                //异常情况下由公共错误码进行提示
                _this.$vux.loading.hide()
            })
        },
        /**
         * 显示地图
         */
        showMap:function(){
            let that = this;
            //判断Bmap是否加载完成，兼容部分银行环境无法访问外网的情况
            let ishaveAMap = false;
            try {
                // var x = AMap;
                ishaveAMap = true;
            } catch (e){
                console.log(e.message);
                ishaveAMap = false
            }
            if (!ishaveAMap){
                hotelHandler.showToast('地图组件加载失败');
                return;
            }
            that.showList = !that.showList;
        },
        /**
         * 格式化时间
         * @inputTime 时间
         */
        formatDateTime(inputTime){
            return new Date(parseInt(inputTime)).format('yyyy/MM/dd');
        },
        /**
         * 计算价格星级title栏显示内容
         */
        setPriceDes: function () {
            let _this = this;
            let textPrice = '';
            let textStar = '';
            //价格筛选
            if (_this.hotelCriterionShow){
                textPrice = '￥'+_this.htoelLimitPrice+'以下';
            } else if (_this.amountRange[0] == 0 && (_this.amountRange[1] == 0 || _this.amountRange[1] == 600)){
                textPrice = '不限';
            } else if (_this.amountRange[0] == 0 && _this.amountRange[1] > 0&& _this.amountRange[1] < 600){
                textPrice = '￥'+_this.amountRange[1]+'以下';
            } else if ((_this.amountRange[0] > 0 && _this.amountRange[0] < 600)&& _this.amountRange[1] == 600){
                textPrice = '￥'+_this.amountRange[0]+'以上';
            } else if ((_this.amountRange[0] > 0 && _this.amountRange[0] < 600)&& _this.amountRange[1] > 0&& _this.amountRange[1] < 600){
                textPrice = '￥'+_this.amountRange[0]+'-'+''+_this.amountRange[1];
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
            if (textPrice == '不限' && textStar == '不限'){
                _this.priceDes = '价格/星级';
            } else if (textPrice != '不限' && textStar == '不限'){
                _this.priceDes = textPrice;
            } else if (textPrice != '不限' && textStar != '不限'){
                _this.priceDes = textPrice;
            } else if (textPrice == '不限' && textStar != '不限'){
                _this.priceDes = textStar;
            }
        },
        /**
         * 计算筛选title栏显示内容
         */
        setBrandDes(item,type,listData){
            let _this = this;
            if (_this.arrhaveitem(item,_this.brandDesTemp)){ //取消选中筛选条件
                _this.brandDesTemp.splice(_this.indexOfArr(item,_this.brandDesTemp), 1); 
            } else { //选中筛选条件
                if ('isGroupOnly' == type){ //多组内单选
                    let groupList = listData;
                    let groupLength = listData.length;
                    for (var i=0;i<groupLength;i++){
                        let arrList = groupList[i].tabList;
                        let arrLength = arrList.length;
                        for (var j=0;j<arrLength;j++){
                            if (-1 < _this.indexOfArr(arrList[j].shortName,_this.brandDesTemp)){
                                _this.brandDesTemp.splice(_this.indexOfArr(arrList[j].shortName,_this.brandDesTemp), 1);
                            }
                        }
                    }      
                } else if ('radio' == type){ //单选
                    let arrList = listData;
                    let arrLength = listData.length;
                    for (var index=0;index<arrLength;index++){
                        if (-1 < _this.indexOfArr(arrList[index].name,_this.brandDesTemp)){
                            _this.brandDesTemp.splice(_this.indexOfArr(arrList[index].name,_this.brandDesTemp), 1); 
                        }
                    }
                } else if ('checkbox' == type){ //多选
                }
                _this.brandDesTemp.unshift(item);
            }
        },
        /**
         * 数组是否包含元素
         * @item 元素
         * @arr 数组
         */
        arrhaveitem(item,arr){
            // let _this = this;
            var isInArr = false;
            var len = arr.length;
            for (var i=0;i<len;i++){
                if (arr[i] == item){
                    isInArr = true;
                    break;
                }
            }
            return isInArr;
        }, 
        /**
         * 元素在数组中的索引
         * @val 元素
         * @arr 数组
         */
        indexOfArr(val,arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == val) { return i; }
            }
            return -1;
        }, 
        /**
         * 切换是否选中符合差标条件
         */
        toggleHotelCriterion(){
            let _this = this;
            if (_this.loading){
                hotelHandler.showToast('酒店数据加载中');
                return;
            }
            if (_this.hotelCriterionShow){ //取消符合差标
                _this.hotelCriterionShow = false;
                _this.amountRange = [0, 600];
                _this.sortIndex = 0;
                _this.sortDes = '推荐排序';
            } else { //选中符合差标
                _this.hotelCriterionShow = true;
                _this.setPriceFromCriterion();
            }
            _this.setPriceDes();
            _this.getHotelList(true);
        }, 
        /**
         * 滑动价格，查询后去除符合差标的选项
         */
        initHotelCriterion(){
            let _this = this;
            if (_this.hotelCriterionShow){
                if (0 != _this.amountRange[0] || _this.htoelLimitPrice != _this.amountRange[1]){
                    _this.hotelCriterionShow = false;
                    _this.sortIndex = 0;
                    _this.sortDes = '推荐排序';
                }
            } else if (!!this.$route.query.haveHotelCriterion && 2 == _this.sortIndex && 0 == _this.amountRange[0] && _this.htoelLimitPrice == _this.amountRange[1]){
                _this.hotelCriterionShow = true;
            }
        }, 
        /**
         * 设置排序方式
         * @index 索引
         * @item 值
         */
        setSort(index,item) {
            let _this = this;
            _this.sortIndex=index;
            if (_this.hotelCriterionShow){
                if (2 != _this.sortIndex){
                    _this.hotelCriterionShow = false;
                    _this.amountRange = [0, 600];
                }
            } else if (!!this.$route.query.haveHotelCriterion && 2 == _this.sortIndex && 0 == _this.amountRange[0] && _this.htoelLimitPrice == _this.amountRange[1]){
                _this.hotelCriterionShow = true;
            }
            _this.showhotelfliterPop=false;
            _this.sortDes=item.name;
            _this.getHotelList(true);
        }, 
        /**
         * 快捷筛选支付方式
         * @index 值
         */
        setPayType(index) {
            let _this = this;
            console.log(_this.filterInfoList[3].groupList[0].choosed)
            if ( index === _this.filterInfoList[3].groupList[0].choosed){
                _this.filterInfoList[3].groupList[0].choosed = '';
            } else {
                _this.filterInfoList[3].groupList[0].choosed = index;
            }
            _this.getHotelList(true);
        }, 
        /**
         * 切换位置区域二级菜单索引
         * @index 索引值
         */
        changeLocationMiddle(index){
            let _this = this;
            _this.locationAreaList[_this.locationAreaIndex].choosed=index;
            _this.$forceUpdate();
        }, 
        /**
         * 酒店位置搜索，需传入经纬度和半径
         * @item 值
         * @index 索引
         * @isparent 是否多级菜单
         */
        positionSearch(item,index,isparent){
            let _this = this;
            let length = _this.locationAreaList.length;
            for (let i=0;i<length;i++){
                if ('positionParent' == _this.locationAreaList[i].groupType){
                //_this.locationAreaList[i].choosed = 0;
                    for (let j=0;j<_this.locationAreaList[i].groupList.length;j++){
                        _this.locationAreaList[i].groupList[j].choosed = 0;
                    }
                } else if ('position' == _this.locationAreaList[i].groupType){
                    _this.locationAreaList[i].choosed = 0;
                }
            }
            if (isparent){
                _this.locationAreaList[_this.locationAreaIndex].groupList[_this.locationAreaList[_this.locationAreaIndex].choosed].choosed = index;
            } else {
                _this.locationAreaList[_this.locationAreaIndex].choosed = index;
            }
            if (item.lng == -1){ //-1选项为不限，取消参数
                _this.ispositionSearch = false;
            } else {
                _this.ispositionSearch = true;
                _this.positionLng = item.lng;
                _this.positionLat = item.lat;
                _this.positionName = item.name;
                _this.areaId = '0';
                if (3 == _this.sortIndex){ //排序为近到远
                    _this.sortIndex = 0;
                    _this.sortDes = '推荐排序';
                }
                _this.sortMapIndex = 1;
            }
            _this.showhotelfliterPop=false;
            _this.islocationSearch = false;
            _this.positionDes = (item.name=='不限'?'位置区域':item.name);
            _this.getHotelList(true);
        }, 
        /**
         * 酒店区域搜索
         * @item 值
         * @index 索引
         * @isparent 是否多级菜单
         */
        loctionSearch(tab){
            let _this = this;
            _this.areaId=tab.id;
            _this.showhotelfliterPop=false;
            if (parseInt(_this.areaId) == 0){
                _this.islocationSearch = false;
                _this.locationName = '';
            } else {
                _this.islocationSearch = true;
                _this.locationName = tab.name;
            }
            _this.positionDes = (tab.name=='不限'?'位置区域':tab.name);
            _this.resetPositionData();
            _this.$forceUpdate();
            _this.getHotelList(true);
        },
        /**
         * 初始化酒店位置搜索参数
         * @item 索引值
         */
        resetPositionData(){
            let _this = this;
            _this.sortMapIndex = 0;
            _this.ispositionSearch = false;
            let length = _this.locationAreaList.length;
            for (let i=0;i<length;i++){
                if ('positionParent' == _this.locationAreaList[i].groupType){
                    _this.locationAreaList[i].choosed = 0;
                    for (let j=0;j<_this.locationAreaList[i].groupList.length;j++){
                        _this.locationAreaList[i].groupList[j].choosed = 0;
                    }
                } else if ('position' == _this.locationAreaList[i].groupType){
                    _this.locationAreaList[i].choosed = 0;
                }
            }
        },  
        /**
         * 初始化酒店搜索参数
         */
        resetflitle(){
            let _this = this;
            _this.searchJson.keywords = '';
            _this.getHotelList(true,true);
        },
        /**
         * 打开选择时间组件
         * @type 业务类型
         */
        selectCalendar() {
            console.log('selectCalendar')
            let that = this;
            let chooseDay = parseInt(that.searchJson.inDate) / 1000;
            that.rangeDate = [new Date(parseInt(that.searchJson.inDate)).format('yyyy/MM/dd'),new Date(parseInt(that.searchJson.outDate)).format('yyyy/MM/dd')];
            setTimeout(()=>{
                that.$refs.hotelCalendar.resetViewByRange();
            },300)
            that.$refs.hotelCalendar.setDate(chooseDay);
            that.showHotelCalendar = true;
            that.showhotelfliterPop = false;
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
            _this.searchJson.inDate = data.startTime.getTime();
            if (!data.endTime.getTime()) {
                hotelHandler.showToast('请选择正确结束时间')
                return;
            }
            _this.searchJson.outDate = data.endTime.getTime();
            if (_this.searchJson.inDate == _this.searchJson.outDate) {
                hotelHandler.showToast('开始时间和结束时间不能是同一天')
                return;
            }
            let hotelSearch = {
                inDate:_this.searchJson.inDate,
                outDate:_this.searchJson.outDate
            }
            hotelHandler.setStorage('hotelSearch', JSON.stringify(hotelSearch));
            _this.searchJson.inDays = parseInt((_this.searchJson.outDate - _this.searchJson.inDate) / (24 * 60 * 60 * 1000));
            _this.showHotelCalendar = false;
            _this.getHotelList(true);
            //window.opener.rereadHotel();
        },
        /**
         * 列表滚动时隐藏搜索栏
         */
        isListScrolling(){
            let _this = this;  
            _this.listScrollTop = _this.$refs.hotelListWrap.scrollTop;
            _this.isScrolling = true;
        },
        listScrollover(){
            let _this = this;
            _this.isScrolling = false;
        },
        /**
         * 设置最近一次筛选排序条件，因私的时候才记录
         */
        async setLastFliteData(){
            let _this = this;
            if (_this.useTypeConfig.isPrivate(_this.hotelUseType)){
                await hotelHandler.authInterceptor();
                let key = hotelHandler.primaryKey + _this.cityCode + "_LastHotelFlite";
                let dataJson = {
                    'sortIndex':_this.sortIndex,
                    'starList':_this.starList
                }
                //价格筛选
                dataJson.minPrice = parseInt(_this.amountRange[0]);
                dataJson.maxPrice = parseInt(_this.amountRange[1]);
                hotelHandler.setStorage(key, JSON.stringify(dataJson));
            }
        },
        /**
         * 获取推荐价格区间
         */
        async getRecommendPriceRange(){
            let _this = this;
            return new Promise((resolve,reject)=>{
                hotelHandler.getRecommendPriceRange({cityName:_this.$route.query.cityName}).then((res) => {
                    if (res.resultCode == 0 && res.result) {
                        resolve(res.result);
                    } else {
                        reject();
                    }

                }).catch((err) => {
                    reject(err);
                });
            })
        },
        /**
        * T信回退事件的注册回调 必须是goBackFun
        */
        goBackFun(){
            let _this = this;
            if (_this.showHotelCalendar) {
                _this.showHotelCalendar = false;
            } else { 
                hotelHandler.closePage('');
            }         
            
        }          
    }
}
</script>
<style lang="less">
      @import './hotelList.less';
</style>
