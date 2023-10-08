<template>
    <div class="cityOutWrap" ref='cityOutWrap'>
        <div class="cityMusk cursorp" v-if="showMusk" @click="showMusk=false"></div>
        <!-- 城市搜索 -->
        <div class="title searchWrap" v-if='isSearch'>
            <search class="searchBar" :placeholder="placeholder" @on-change="searchCityByname" v-model="searchValue" auto-scroll-to-top @on-focus="showMusk=true;searchIsFocus=true;" @on-cancel="clearCity" ref="search" @on-blur="searchBlur"></search>
            <scroll-lock class="searchList" v-if="showMusk">
                <div v-if="cityType=='flight' && searchCityList.cities && searchCityList.cities.length == 0 && searchCityList.airports.length == 0 && searchValue != '' && searchEnding" class="noresdate">搜索不到结果</div>
                <div v-if="cityType=='train' && searchCityList.stations && searchCityList.stations.length == 0 && searchValue != '' && searchEnding" class="noresdate">搜索不到结果</div>
                <div v-if="cityType=='hotel' && searchCityList.cityList && searchCityList.cityList.length == 0 && searchValue != '' && searchEnding" class="noresdate">搜索不到结果</div>
                <div v-if="cityType=='car' && searchCityList.length == 0 && searchValue != '' && searchEnding" class="noresdate">搜索不到结果</div>
                <template v-if="cityType=='flight'">
                    <div class="cursorp fcityListWrap" v-for="(city,index) in searchCityList.cities" :key="index">
                        <div class="citytitWrap" @click="chooseFlightCity('city',city,'')">
                            <div class="left">城市</div>
                            <div class="flightCitytit lineBorderB nowrap">{{city.cityName}}<span>(不限机场)</span><span class="codeitem">{{city.cityCode}}</span></div>
                        </div>
                        <div class="flightAirport" v-for="(airport,index) in city.airports" :key="index" @click="chooseFlightCity('cityAirport',airport,city)">
                            <div class="flightAirportItem lineBorderB nowrap">{{airport.airportShortName}}<span class="codeitem">{{airport.airportCode}}</span></div>
                            </div>
                    </div>
                    <div class="cursorp fcityListWrap" v-for="(airport,index) in searchCityList.airports" :key="index">
                        <div class="citytitWrap" @click="chooseFlightCity('airport',airport,'')">
                            <div class="left airportLeft">机场</div>
                            <div class="flightCitytit lineBorderB nowrap">{{airport.cityName+' '}}{{airport.airportShortName}}<span class="codeitem">{{airport.cityCode}}</span></div>
                        </div>
                    </div>
                </template>
                <div v-if="cityType=='train'" class="cursorp tcityLineWrap " >
                    <!-- 火车票屏蔽城市，只显示车站 -->
                    <!-- <div class="lineLeft lineBorderB" v-for="(city,index) in searchCityList.Cities" @click="chooseTrainCity('city',city)">
                        <div class="cityTitle nowrap">{{city.cityName}}
                            <span>(包含</span><span v-for="(TrainInfo,ind) in city.TrainInfosOfCity">{{TrainInfo.StationName}}{{(ind+1) == city.TrainInfosOfCity.length ? '站':'站、'}}</span><span>)</span>
                            </div>
                    </div> -->
                    <div class="lineLeft lineBorderB" v-for="(station,index) in searchCityList.stations" :key="index"  @click="chooseTrainCity('station',station)">
                        <div class="cityTitle">{{station.stationName}}</div>
                    </div>
                </div>
                <template v-if="cityType=='hotel'">
                    <div class="cursorp hcityLineWrap lineBorderB" v-for="(city,index) in searchCityList.cityList" :key="index" @click="chooseCity(city)">
                        <div class="lineLeft">
                            <div class="cityTitle">{{city.type==0?city.cityName:city.name}}</div>
                            <div class="cityText">{{city.address}}</div>
                        </div>
                        <div class="lineright">[{{hotelCityTypeMap[city.type]}}]</div>
                    </div>

                </template>
                <template v-if="cityType=='car'">
                    <div class="cursorp hcityLineWrap lineBorderB" v-for="(city,index) in searchCityList" :key="index" @click="chooseCity(city)">
                        <div class="lineLeft">
                            <div class="cityTitle">{{city.type==0?city.cityName:city.name}}</div>
                            <div class="cityText">{{city.address}}</div>
                        </div>
                    </div>
                </template>
            </scroll-lock>
        </div>
        <div class="citys popupDebit" ref="listWrap" :class="cityType">
            <div class="listWrap">
                <!-- 定位/历史城市 -->
                <div class='hisCity'>
                    <div class="title"  :ref="'historyTitLine'" v-if="(isHis||isLocal)&&0<hisData.length" id="historyTit">
                        <span v-if='isLocal'>定位</span><span v-if='isHis&&isLocal'>/</span><span v-if='isHis'>历史</span>
                    </div>
                    <div class="cityList" v-if="isHis&&0<hisData.length">
                        <div class="cityItemWrap" v-for="(city,index) in hisData" :key="index">
                            <div class="cityItem normal-btn nowrap"  @click="chooseCity(city)">
                                <img src ='./img/icon_location_white.png' v-if="city.isLocation"/>
                                {{city.cityName || city.name}}
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 热门城市 -->
                <div class='hotCity' v-if='isHot'>
                    <div class="title" :ref="'hotTitLine'" id="hotTit">热门城市</div>
                    <div class="cityList">
                        <div class="cityItemWrap" v-for="(city,index) in hotData" :key="index">
                            <div class="cityItem normal-btn nowrap"  @click="chooseCity(city)">{{city.cityName || city.name}}</div>
                        </div>
                        
                    </div>
                </div>
                <!-- 城市 -->
                <div class="lineWrap" v-for="(groupItem,ind) in groupData" :key="ind">
                    <div class="groupName" :ref="'#'==groupItem.groupName?'AALine':groupItem.groupName+'Line'" v-if="!!groupItem.dataList.length && 0 < groupItem.dataList.length" :id="'#'==groupItem.groupName?'AA':groupItem.groupName">{{groupItem.groupName}}
                    </div>
                    <block v-for="(item,index) in groupItem.dataList" :key="index">
                        <div class="line normal-btn" v-if="index < MAX_GROUP_LENGTH"  @click="chooseCity(item)" :key="index">
                            <div class="linetext">{{item.cityName || item.name}}</div>
                        </div>
                    </block>
                    <div class="line showmore normal-btn" v-if="groupItem.dataList.length > MAX_GROUP_LENGTH && !!!groupItem.showAll" @click="showMoreCity(ind)">
                        <div class="linetext">查看全部</div>
                    </div>
                    <div v-if="!!groupItem.showAll && groupItem.dataList.length > MAX_GROUP_LENGTH">
                        <block v-for="(item,index) in groupItem.dataList" :key="index" >
                            <div class="line normal-btn" v-if="index >= MAX_GROUP_LENGTH"  @click="chooseCity(item)" :key="index">
                                <div class="linetext">{{item.cityName || item.name}}</div>
                            </div>
                        </block>
                    </div>
                </div>
            </div>
            <div class="atozshow" v-show="atozshow && ''!=atozText" v-html="atozText"></div>
        </div>
        <!-- 城市选择导航 -->
        <!-- <div v-transfer-dom> -->
            <div class="navTab">
                <div class="a2z cursorp" 
                    :key="item.id" 
                    v-for="(item,index) in indexList" 
                    :index="index" 
                    :ref="item.id" 
                    @click="handleLetterClick(item)"
                    @touchstart="handleTouchStart(item)"
                    @touchmove="handleTouchMove"
                    @touchend="handleTouchEnd">{{item.name}}</div>
            </div>
        <!-- </div> -->
    </div>
</template>

<script>
import {Search} from 'vux';
import cityHandler from './cityHandler.js';
import { setTimeout } from 'timers';
import ScrollLock from './scrollLock/vue-scroll-lock.vue';
export default {
    data() {
        return {
            searchCityList:[],
            isHot:this.hasHot,//热门城市
            isSearch:this.hasSearch,//搜索
            isLocal:this.hasLocal,//定位
            isHis:this.hasHis,//历史
            //搜索遮罩层
            showMusk:false,
            //城市搜索名称
            searchValue:'',
            //历史列表
            hisData:this.hisList,
            //热门list
            hotData:this.hotList,
            //城市分组信息
            groupData:this.dataList,
            indexList: [],//字母导航栏
            atozshow: false, //触摸组件是否显示大文字
            atozText: '', //触摸组件大文字内容
            cardH:20,//导航栏一个按钮的高度，默认20
            indextemp:0,//导航触发滚动的控制，有变化时才滚动
            startY:0,//字母导航起始位置
            cardLength:0,//字母数量
            throttleType:true,//字母导航节流控制
            atozNameMap:['历史', '热门', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'],
            atozMap:['historyTit','hotTit', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA'],
            MAX_GROUP_LENGTH:20,//城市组最大显示数量
            hotelCityTypeMap:{//酒店搜索城市类型名称
                '0':'城市','1':'行政区','2':'景区','3':'商圈','4':'酒店','5':'地点','6':'医院','7':'学校','8':'景点','9':'地铁站','10':'机场/车站'
            },
            searchIsFocus:false,//搜索框是否获取焦点
            searchEnding:false,//搜索城市是否完成
            cityTypeMap:{
                'flight':'flightCitys',
                'train':'trainCitys',
                'hotel':'hotelCitys',
                'car':'CarCitys'
            }
        };
    },
    components:{
        Search,
        ScrollLock
    },
    props:{
        hasHot:{//是否拥有热门功能
            type:Boolean,
            default:false
        },
        hasLocal:{//是否拥有定位功能
            type:Boolean,
            default:false
        },
        hasHis:{//是否拥有历史功能
            type:Boolean,
            default:false
        },
        hasSearch:{//是否拥有搜索功能
            type:Boolean,
            default:false
        },
        searchUrl:{//城市搜索url hasSearch为true时，必填
            type:String,
            default:''
        },
        placeholder:{//城市搜索提示
            type:String,
            default:''
        },
        dataList:{//数据列表，带有分组信息，从外部传入
            type:Array,
            default:() => [{dataList:[]}]
        },
        hisList:{//历史列表
            type:Array,
            default:() => []
        },
        hotList:{//热门列表
            type:Array,
            default:() => []
        },
        cityType:{
            type:String,
            default:''
        },
        cityIsShow:{
            type:Boolean,
            default:false
        }
    },
    created(){
        let that = this;
            
        if (0==that.dataList.length){
            that.groupData = [{dataList:[]}];
        }
        //先从缓存取一次数据，兼容获取数据失败的情况
        if (''!=that.cityType){
            let cityKey = this.cityTypeMap[that.cityType];
            if (cityHandler.getStorage(cityKey)){
                this.groupData = JSON.parse(cityHandler.getStorage(cityKey));
            }
        }
        that.getIndex();
    },
    mounted(){
        setTimeout(()=>{
            this.cardH = this.$refs['A'][0].clientHeight;
        },200)    
    },
    watch:{
        dataList:{
            handler(newVal){
                if (newVal&&0<newVal.length){
                    this.groupData = newVal;
                }
            },
            deep:true
        },
        hisList:{
            handler(newVal){
                if (newVal&&0<newVal.length){
                    this.hisData = newVal;
                }
            },
            deep:true
        },
        hotList:{
            handler(newVal){
                if (newVal&&0<newVal.length){
                    this.hotData = newVal;
                }
            },
            deep:true
        },
        cityIsShow:function (newVal) {
            if (!newVal){
                this.searchValue = '';
                this.searchCityList = [];
            } else {
                this.$refs['listWrap'].scrollTop = 0;
                this.$refs.search.cancel();
                this.showMusk = false;
            }
        }

    },
    methods:{
        /**
             * 搜索框失去焦点，切关键字为空时，初始化搜索框状态
             */
        searchBlur(){
            if (this.searchValue == ''){
                this.$refs.search.cancel();
                this.searchIsFocus = false;
            }
        },
        /**
             * 城市名称搜索
             */
        searchCityByname() {
            const that = this;
            if (!that.searchIsFocus){
                return;
            }
            const obj = {
                "keyword": that.searchValue.replace(/\s*/g,"")
            };
            that.searchEnding = false;
            cityHandler.searchCity(that.searchUrl,obj,this.cityType).then((res) => {
                that.searchEnding = true;
                if (!!res.result) {
                    that.showMusk = true;
                    that.searchCityList = res.result;
                    that.$forceUpdate();
                }
            }).catch((err) => {
                console.error(err);
            });
        },
        /**
             * 初始化导航栏
             */
        getIndex() {
            var that = this;
            that.indexList = [];
            that.indexList.push({
                name: '历史',
                id: 'historyTit'
            });
            that.indexList.push({
                name: '热门',
                id: 'hotTit'
            });
            for (var i = 0; i < 26; i++) {
                that.indexList.push({
                    name: String.fromCharCode(65 + i),
                    id: String.fromCharCode(65 + i)
                });
            }
            that.indexList.push({
                name: '#',
                id: 'AA'
            });
        },
        /**
             * 导航栏滑动触发城市列表滚动事件
             * @item 索引
             */
        goIndexTouch(item) {
            let refItemName = item +'Line';
            if (!!this.$refs[refItemName]) {
                let itemOffset2 = 0;
                if (refItemName == 'historyTitLine' || refItemName == 'hotTitLine' ){
                    itemOffset2 = this.$refs[refItemName].offsetTop;
                } else {
                    itemOffset2 = this.$refs[refItemName][0].offsetTop;
                }
                this.$refs['listWrap'].scrollTop = itemOffset2;
            }
        },
        handleLetterClick(item) {
            this.atozText = item.name;
            this.goIndexTouch(item.id);
        },
        handleTouchStart(item) {
            this.atozshow = true;
            this.atozText = item.name;
            this.goIndexTouch(item.id);
            if (this.cardH == 0){
                this.cardH = this.$refs['A'][0].clientHeight;
            }
            //需要加上整个弹窗的Y轴偏移量
            this.startY = this.$refs['A'][0].offsetTop + this.$refs.cityOutWrap.parentElement.offsetTop;
            this.cardLength = this.indexList.length;
        },
        handleTouchMove(e) {
            e.preventDefault();
            if (!this.throttleType) {
                return;
            }
            const touchY = e.touches[0].clientY - this.cardH; 
            const index = Math.floor((touchY - this.startY)/this.cardH);
            if (index >= 0 && index < this.cardLength && this.indextemp!=index) {
                this.indextemp = index;
                this.atozText = this.atozNameMap[index];
                this.goIndexTouch(this.atozMap[index]);
            }
            this.throttleType = false;
            setTimeout(() => {
                this.throttleType = true;
            },150)
        },
        handleTouchEnd() {
            this.atozshow = false;
            this.atozText = '';
        },
        /**
             * 初始化城市搜索
             */
        clearCity() {
            const that = this;
            that.showMusk = false;
            that.searchIsFocus = false;
            that.searchCityList = [];
            that.searchValue = '';
        },
        /**
             * 选择城市
             * @city 城市数据对象
             */
        chooseCity(city) {
            const that = this;
            that.clearCity();
            that.showCityPop = false;
            //返回city对象
            that.$emit('choose',city);
        },
        /**
             * 选择机票城市
             * @cityType 数据类型，城市，城市所属机场，机场
             * @item item数据（城市或机场）
             * @parent 城市数据
             */
        chooseFlightCity(cityType,item,parent){
            let _this = this;
            let data = {};
            data = item;
            data.type = cityType;
            if ('cityAirport' == cityType){
                data.cityCode = parent.cityCode;
                data.cityName = parent.cityName;
            }
            _this.$emit('choose',data);
        },
        /**
             * 选择火车票城市
             * @cityType 数据类型，城市，火车站
             * @item 数据
             */
        chooseTrainCity(cityType,item){
            let _this = this;
            let data = {};
            //data = item;
            data.name = item.cityName;
            data.type = cityType;
            if ('station' == cityType){
                data.name = item.stationName;
            }
            _this.$emit('choose',data);
        },

        showMoreCity(ind){
            let that = this;
            that.groupData[ind].showAll = true;
            that.$forceUpdate();
        }
    }
}
</script>
<style lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
    .bbpxs {
        .bbpx(1px, @border-color-base, 0, 0, solid);
    }
    .cityOutWrap{
            -moz-user-select: none;
            -khtml-user-select: none;
            user-select: none;
    }
    .citySelect {
        background-color: @sub-background-color !important;
        overflow-y: scroll !important;
        .cityMusk {
            z-index: 1001;
            background: rgba(0, 0, 0, 0.5);
            width: 100%;
            height: 100%;
            position: absolute;
        }
        .title {
            background: @sub-background-color;
            position: relative;
            color: @secondary-text-color;
            z-index: 1200;
            .searchBar {
                position: relative !important;
                z-index: 1200;
            }
        }
        .searchList {
            max-height: 7rem;
            overflow-y: auto;
            .hcityLineWrap {
                padding: 0.25rem 0 0.25rem 0.3rem;
                display: -ms-flexbox;
                display: -webkit-box;
                display: -webkit-flex;
                display: flex;
                -webkit-box-pack: space-between;
                -webkit-justify-content: space-between;
                -moz-justify-content: space-between;
                -ms-justify-content: space-between;
                -o-justify-content: space-between;
                justify-content: space-between;
                -ms-flex-align: center;
                -webkit-align-items: center;
                -moz-align-items: center;
                font-size: 0.32rem;
                color: @text-color;
                .lineLeft{
                    -webkit-box-flex: 1;
                    -moz-box-flex: 1;
                    -webkit-flex: 1;
                    -ms-flex: 1;
                    flex: 1;
                    .cityTitle{
                    }
                    .cityText{
                        color:@third-text-color;
                        font-size: 0.28rem;
                    }
                }
                .lineright{
                    padding-right: 0.3rem;
                    color:@border-color-base;
                    font-size: 0.28rem;
                    text-align: right;
                    width: 1.8rem;
                }
            }
            .tcityLineWrap{
                padding-left:0.3rem;
                font-size: 0.32rem;
                color: @text-color;
                .lineLeft{
                    padding: 0.25rem 0;
                    .cityTitle{
                        padding-right: 0.3rem;
                        span{
                            color: @third-text-color;
                            font-size: 0.28rem;
                        }
                    }
                    .cityText{
                        color:@third-text-color;
                        font-size: 0.28rem;
                    }
                }

            }
            .fcityListWrap{
                padding-left: 0.3rem;
                font-size: 0.32rem;
                color: @text-color;
                .citytitWrap{
                    display: -ms-flexbox;
                    display: -webkit-box;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-box-pack: space-between;
                    -webkit-justify-content: space-between;
                    -moz-justify-content: space-between;
                    -ms-justify-content: space-between;
                    -o-justify-content: space-between;
                    justify-content: space-between;
                    -ms-flex-align: center;
                    -webkit-align-items: center;
                    -moz-align-items: center;
                    line-height: 0.92rem;

                    .left{
                        width: 0.62rem;
                        height: 0.32rem;
                        line-height: 0.32rem;
                        border-radius: 0.04rem;
                        color: @sub-background-color;
                        background: @warning-color-light;
                        text-align: center;
                        margin-right: 0.2rem;
                        font-size: 0.22rem;
                    }
                    .airportLeft{
                        background: @theme-color;
                    }
                    .flightCitytit{
                        -webkit-box-flex: 1;
                        -moz-box-flex: 1;
                        -webkit-flex: 1;
                        -ms-flex: 1;
                        flex: 1;
                        span{
                            color: @third-text-color;
                            font-size: 0.28rem;
                        }
                        .codeitem{
                            margin-left: 0.4rem;
                        }
                    }
                }
                .flightAirport{
                    padding-left: 0.8rem;
                    font-size: 0.32rem;
                    color: @text-color;
                    line-height: 0.92rem;
                    .flightAirportItem{
                        padding-left: 0.52rem;
                        background: url(./img/icon_cityAirport.png) no-repeat 0.19rem center;
                        background-size: 0.21rem 0.15rem;
                        span{
                            color: @third-text-color;
                            font-size: 0.28rem;
                        }
                        .codeitem{
                            margin-left: 0.4rem;
                        }
                    }
                        

                }
            }
        }
        .noresdate{
            font-size: 0.32rem;
            padding: 0.25rem 0.3rem;
        }
        .citys {
            margin-top: 0rem;
            position: absolute;
            top: 1rem;
            left: 0;
            right: 0;
            bottom: 0;
            overflow-y: auto;
            padding: .1rem .5rem 1rem .1rem ;
            .hisCity,.hotCity{
                padding: 0.1rem;
            }
            .title {
                z-index: 0;
                color: @secondary-text-color;
                padding: 0 0.1rem;
            }
            .cityList {
                .cityItemWrap{
                    width: 33.33%;
                    padding: 0.1rem;
                    display: inline-block;
                    .cityItem{
                        .flex-box();
                        .align-items(center);
                        .justify-content(center);
                        font-size: .28rem;
                        padding: .1rem;
                        color: @text-color;
                        background-color: @border-color-base;
                        img{
                            width: 0.3rem;
                            height: 0.3rem;
                            display: inline-block;
                        }

                    }
                }
            }
        }
        .lineWrap{
          transform: all 0.3s;
          background: @sub-background-color;
          margin-bottom: 0rem;
        }
        .groupName{
          padding-left:0.3rem;
          font-size: 0.28rem;
          color: @third-text-color;
          height: 0.4rem;
          line-height: 0.44rem;
          background: @background-color;
        }
        .line{
          position: relative;
          line-height: 1.09rem;
          padding-left: 0.3rem;
          font-size: 0.32rem;
          color: @text-color;
        }
        .line .icon{
          position: absolute;
          top: 50%;
          left: 0.3rem;
          margin-top: -0.36rem;
          width: 0.72rem;
          height: 0.72rem;
          border-radius: 0.13rem;
          background-position: center;
          background-repeat: no-repeat;
          background-size: 0.72rem 0.72rem;
        }
        .linetext{
          position: relative;
          padding-right: 0.73rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .showmore.line .linetext{
            color:@theme-color ;
        }
    }
    .navTab {
        position: absolute;
        right: 0;
        top: 0;
        margin-top: 1.05rem;
        font-size: 0;
        z-index: 505;
    }
    .navTab div {
        width: 0.8rem;
        text-align: center;
        color: #999999;
        font-size: 15px;
        height: 15px;
        -webkit-touch-callout: none;
        /* iOS Safari */
        -webkit-user-select: none;
        /* Chrome/Safari/Opera */
        -khtml-user-select: none;
        /* Konqueror */
        -moz-user-select: none;
        /* Firefox */
        -ms-user-select: none;
        /* Internet Explorer/Edge */
        user-select: none;
    }
    .atozshow {
        position: fixed;
        top: 50%;
        left: 50%;
        display: inline-block;
        margin-top: -0.5rem;
        margin-left: -0.5rem;
        width: 1rem;
        height: 1rem;
        line-height: 1rem;
        background: rgba(0, 0, 0, 0.7);
        color: @sub-background-color;
        text-align: center;
        font-size: 0.4rem;
    }
    .searchWrap {
        .weui-search-bar {
            padding: 0.15rem 0.3rem;
            display: -ms-flexbox;
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            .weui-search-bar__box {
                padding: 0 0.15rem;
                -ms-flex-align: center;
                -webkit-align-items: center;
                -moz-align-items: center;
                align-items: center;
            }
        }
        .weui-search-bar__label {
            line-height: 0.56rem;
            span,
            i {
                color: @third-text-color;
                font-size: 0.28rem;
            }
        }
        .weui-search-bar__form {
            box-sizing: content-box;
            height: 0.3rem;
            padding: 0.13rem 0;
            -webkit-box-flex: auto;
            -moz-box-flex: auto;
            -webkit-flex: auto;
            -ms-flex: auto;
            flex: auto;
        }
        .weui-search-bar__box {
            display: -ms-flexbox;
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            .weui-icon-search {
                position: initial;
                font-size: 0.28rem;
                line-height: 0.3rem;
            }
            input {
                padding: 0;
                width: 100%;
                border: 0;
                font-size: 0.28rem;
                line-height: initial;
                box-sizing: content-box;
                background: transparent;
                -webkit-box-flex: 1;
                -moz-box-flex: 1;
                -webkit-flex: 1;
                -ms-flex: 1;
                flex: 1;
            }
        }
        .weui-search-bar__cancel-btn {
            display: none;
            margin-left: 0.1rem;
            line-height: 0.56rem;
            color: @theme-color;
            white-space: nowrap;
        }
        .weui-search-bar__box .weui-icon-clear {
            font-size: 0.28rem;
            line-height: 0.3rem;
        }
    }
@media screen and (min-width: @screen-sm) {
    .navTab div:hover {
        cursor: pointer;
        background: @theme-color;
        color: @sub-background-color;
    }
}
</style>
