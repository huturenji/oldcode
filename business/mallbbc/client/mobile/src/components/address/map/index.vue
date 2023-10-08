<template>
    <div class="address-map">
        <view class="search-bar">
            <view class="changeCity normal-btn" @click="chooseArea">
                {{ cityName }}
                <!-- <text class="iconfont icon_arrow_down"></text> -->
            </view>
            <view class="search_center">
                <text class="iconfont icon_search"></text>
                <input class='sea_input' type='text'  v-model.trim="searchValue" placeholder="小区/写字楼/学校等" @focus ="focusSearch" @input="onInput"
                     maxlength="100" />
                <image class='clear_content' v-show="!!searchValue" @click="clearInput"
                    :src="imgUrl+'common/icon/icon_search_clean.svg'" />     
            </view>
            <text v-if="showSearch" class='sea_btn' @click="openSearch = false;showSearch = false">取消</text>
        </view>

        <view id="container" class="myMap">
            <view class='map-center-icon' v-if='showCenterPoint'>
                <view  :class='{"bounce": pointBounce,"map-icon":true}'></view>
            </view>
        </view>

        <view class="result-panel" :class="{ 'full-height': openSearch }">
            <view class='content'>       <!--防止absolute导致的偶现不能滑动-->
                <!--附近的点-->                                           
                <template v-if="!openSearch">
                    <ul class="nearby" v-if='nearbyData && nearbyData.length>0'>
                        <li
                            v-for="data in nearbyData"
                            :key="data.id"
                            :class="{ selected: currPos.id == data.id }"
                            class="normal-btn"
                            @click="handlerResult(data)"
                        >
                            <view class="iconPositionWrap">
                                <text class="iconfont" :class="[dealClass(data)]"></text>
                            </view>
                            <view>
                                <view class="name">{{ data.name }}</view>
                                <view class="address">{{ data.address }}</view>
                            </view>
                        </li>
                    </ul>
                    <view v-else-if="!nearbyData" class='empty flex_column_center_center'>
                        <view class='img'>暂无数据</view>
                        <view class='btn' @click="getLocationManual">手动定位</view>
                    </view>
                </template>
                <!-- 搜索的点 -->
                <template v-else-if="!!openSearch && searchResult && searchResult.length > 0">
                    <ul class="search-result">
                        <li
                            v-for="data in searchResult"
                            :key="data.id"
                            class="normal-btn"
                            @click="emitResult(data)"
                        >
                            <view>
                                <view class="name">{{ data.name }}</view>
                                <view class="address  no-wrap">
                                    {{
                                        data.address && data.address.length > 0
                                            ? data.address
                                            : ""
                                    }}
                                </view>
                            </view>
                            <view class="distance" v-if="data.distance != -1">
                                {{ data.distance | distanceFormat }}
                            </view>
                        </li>
                    </ul>
                </template>
                <!-- 搜索历史 -->
                <template v-else-if='!!openSearch && (!searchResult || searchResult.length==0)'>
                    <view class="search-item" v-if="historySearchList && historySearchList.length>0" style="padding-bottom: 0;">
                        <view class="search-title">
                            <text>搜索历史</text>
                            <view class="del" @click="clearHistory">
                                <image :src="imgUrl+'common/icon/del_search.png'" />
                            </view>
                        </view>
                        <view class="search-con">
                            <view class="item" v-for="(item,index) in getVisibleList()" :key="index" @click="emitResult(item)">{{item.name}}
                            </view>
                        </view>
                        <view class="search_drawer" v-if="historySearchList && historySearchList.length > 10" @click="searchDrewerOpen=!searchDrewerOpen">
                            <text>更多历史搜索</text>
                            <text class="iconfont" :class="searchDrewerOpen ?'icon_arrow_up':'icon_arrow_down'"></text>
                        </view>
                    </view>
                </template>
                <template v-if="!!openSearch && searchResult.length==0 && historySearchList.length==0">
                    <view class="flex_column_start_center empty_part">
                        <view class="img"></view>
                        <text class="tip_con">{{$L('没有相关搜索结果')}}~</text>
                    </view>
                </template>
            </view>
        </view>
        <selectAddress ref='selectAddress' :sel_data='selAddressData' @selectAddress="successSelectAddress"></selectAddress>
        <!-- 确认删除搜索历史的弹窗 -->
        <uni-popup ref="deletePopup" type="dialog">
            <uni-popup-dialog type="input" title ="提示" content="确认要清空搜索历史吗?" :duration="2000"  @confirm="confirmDelete()"></uni-popup-dialog>
        </uni-popup>
    </div>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
import selectAddress from '@/components/address/linkselect';
import {initMap} from '@/utils/common'
const MAX_HISTORY_LENGTH = 20;
const historyKey = 'mapSearchHistroy';

export default {
    name: "address-map",
    components: {
        uniPopup,
        uniPopupDialog,
        selectAddress
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            openSearch:false,
            showSearch:false,
            chooseCityName:null, //联级选择的城市
            selAddressData:[], //联级选择地址
            searchValue:'', //搜索值
            nearbyData: [], //附近的位置
            searchResult: [], //搜索的位置
            historySearchList:[], //历史记录
            searchDrewerOpen:false,//搜索历史更多开关
            currPos: {}, //当前的位置
            location: null,
            map: null, //地图实例
            mapConfig: {
                zoom: 14,
                resizeEnable: true
            },
            geolocation: null,//Map的位置对象
            showCenterPoint: false,//是否显示地图中心点
            pointBounce: true//地图中心点是否执行跳动动画
        }
    },
    filters: {
        distanceFormat(value) {
            if (value < 1000) {
                return `${value}m`;
            } 
            return `${Number(value / 1000).toFixed(2)}km`;
            
        }
    },
    computed: {
        cityName() {
            //如果设置了当前城市，直接返回
            if (this.chooseCityName){
                return this.cityNameFormat(this.chooseCityName);
            }
            //未设置当前城市，则使用当前定位城市
            if (!this.location) {
                return "";
            }
            let name = this.location.addressComponent.city;
            return this.cityNameFormat(name);
        }
    },
    mounted(){
        initMap(this.loadMap);
        this.getHistory();
    },
    methods: {
        dealClass(data){
            return `${this.currPos.id == data.id ? 'icon_position' : 'icon_site'}`
        },
        async loadMap(){
            let that = this
            that.map = new AMap.Map("container", that.mapConfig);
            that.bounceAction();
            that.location = await that.getLocation();
            that.nearbyData = (await that.searchNearBy()).pois;
            that.currPos = that.nearbyData && that.nearbyData.length > 0
                ? that.nearbyData[0]
                : {};

            that.bindEvent(that.map) 
        },
        bindEvent(map){
            let that = this;
            map.on('moveend', async ()=>{
                that.bounceAction();
                that.location.position = map.getCenter();
                that.nearbyData = (await that.searchNearBy()).pois;
                that.currPos = that.nearbyData && that.nearbyData.length > 0
                    ? that.nearbyData[0]
                    : {};
            });
        },
        bounceAction(){
            let that = this;
            this.showCenterPoint = true;
            this.pointBounce = false;
            setTimeout(()=>{
                that.pointBounce = true;
            }, 100)
        },
        cityNameFormat(name){
            return name.length > 4 ? name.substring(0, 3) + "..." : name;
        },
        search(keywords){
            this.$refs.searchComp.searchValue = keywords;
            this.onInput(keywords)
        },
        clearInput(){
            this.searchValue = ''
        },
        /**
         * 目前采用的是Autocomplete算法（同京东）。 POI搜索算法暂屏蔽
         */
        onInput() {
            if (!(this.searchValue)){
                return;
            }
            let that = this;
            
            AMap.plugin("AMap.Autocomplete", function() {
                var autoComplete = new AMap.Autocomplete({
                    city: that.cityName,
                    citylimit: true
                });
                autoComplete.search(that.searchValue, function(status, result) {
                    if (status == "complete") {
                        let currPos = [
                            that.currPos.location.lng,
                            that.currPos.location.lat
                        ];
                        that.searchResult = result.tips.filter(tip => {
                            if (!tip.location){
                                return false
                            }
                            let distance = AMap.GeometryUtil.distance(currPos, [
                                tip.location.lng,
                                tip.location.lat
                            ]);
                            if ((distance)) {
                                tip.distance = Math.round(distance);
                            } else {
                                tip.distance = -1;
                            }
                            return true;
                        });
                    } else {
                        that.searchResult = []
                    }
                });
            });
        },
        handlerResult(data){
            data.district = (data.pname||'')+(data.cityname||'')+(data.adname||'') 
            if (!data.district){
                data.district = this.cityName;
            }
            this.emitResult(data)
        },
        /**
         * 选定结果
         */
        emitResult(data) {
            this.addStorage(data);
            this.$emit("onHitResult", data);
        },
        addStorage(value){
            let historySearchList = !!this.$getStorageSync(historyKey) ? this.$getStorageSync(historyKey) : []
            if (!historySearchList){
                historySearchList = [];
            }
            let index = historySearchList.findIndex(h=>h.id == value.id);
            if (index>-1){
                historySearchList.splice(index, 1);
            }
            historySearchList.unshift(value);
            //最多存MAX_LENGTH条
            if (historySearchList.length > MAX_HISTORY_LENGTH){
                historySearchList.length = MAX_HISTORY_LENGTH;
            }
            this.$setStorageSync(historyKey, historySearchList);
        },
        getHistory(){
            try {
                this.historySearchList = this.$getStorageSync(historyKey) ? this.$getStorageSync(historyKey) : [];
            } catch (e){
                console.log('初始化搜索历史记录报错', e);
            }
        },
        /**
         * 选择地址
         */
        selectAddress(item) {
            this.currPos = item;
            this.map.setCenter([item.location.lng, item.location.lat]); //设置地图中心点
        },
        focusSearch() {
            this.openSearch = true;
            this.searchResult = [];
            this.showSearch = true;
            // this.closePopFun();
        },
        // async getListData(page, mescroll){
        //     let result = await this.searchNearBy(page);
        //     this.nearbyData.push(...result.pois)
        //     mescroll.endBySize(result.pois.length, result.count);
        // },
        /**
         * 搜索附近位置
         */
        searchNearBy() {
            let that = this;
            return new Promise(resolve => {
                AMap.service(["AMap.PlaceSearch"], function() {
                    try {
                        //构造地点查询类
                        var placeSearch = new AMap.PlaceSearch({
                            pageSize: 50, // 单页显示结果条数
                            pageIndex: 1, // 页码
                            extensions:'all', //返回详细信息
                            city: that.location.addressComponent.citycode,
                            citylimit: true, //是否强制限制在设置的城市内搜索
                            // map: that.map, // 展现结果的地图实例
                            autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
                            showCover: false,
                            type: '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施'

                        });
                        placeSearch.searchNearBy("", [
                            that.location.position.lng,
                            that.location.position.lat
                        ], 200, function(
                            status,
                            result
                        ) {
                            if (status == "complete") {
                                resolve(!result.poiList || result.poiList.length==0 ? {} : result.poiList);
                            } else {
                                resolve({});
                            }
                        });
                    } catch (e){
                        console.error(e);
                        resolve({});
                    }
                });
            });
        },
        getLocationManual(){
            if (!this.geolocation){
                return;
            }
            this.geolocation.getCurrentPosition(function(status) {
                if (status == "complete") {
                } else {
                    SnUtils.showToast("获取定位失败，请检查定位权限是否开启");
                }
            });
        },
        /**
         * 获取当前位置
         */
        getLocation(option) {
            let that = this;
            return new Promise(resolve => {
                AMap.plugin("AMap.Geolocation", function() {
                    let icon = require('./img/icon_map_location@2x.png')
                    var geolocation = new AMap.Geolocation(Object.assign({
                        showButton: true,//是否显示定位按钮
                        enableHighAccuracy: true, //是否使用高精度定位，默认:true
                        timeout: 10000, //超过10秒后停止定位，默认：5s
                        buttonPosition: "RB", //定位按钮的停靠位置
                        buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        showMarker: true,
                        showCircle: true,//定位成功后用圆圈表示定位精度范围
                        panToLocation: true,//定位成功后将定位到的位置作为地图中心点
                        zoomToAccuracy: false,//定位成功后是否自动调整地图视野到定位点
                        markerOptions: {
                            content:'<img src="'+icon+'" style="width: .4rem;height: .46rem;transform:translateY(.23rem)"/>'
                        },
                        circleOptions: {//定位精度圈的样式
                            'strokeColor': '#262DD9',
                            'noSelect': true,
                            'strokeOpacity': 0,
                            'strokeWeight': 0,
                            'fillColor': '#262DD9',
                            'fillOpacity': 0.1
                        }
                    }, option));
                    that.map.addControl(geolocation);
                    geolocation.getCurrentPosition(function(status, result) {
                        if (status == "complete") {
                            resolve(result);
                        } else {
                            SnUtils.showToast("获取定位失败，请检查定位权限是否开启");
                            resolve();
                        }
                    });
                    that.geolocation = geolocation;
                });
            });
        },
        chooseArea(){
            // this.$refs.selectAddress.show()
        },
        /**
         * 接受三级联动返回的数据
         */
        successSelectAddress(address) {
            if (address && address.length>1){
                this.chooseCityName = address[1].name;//设置城市
            }
        },
        /**
         * 获取可见的搜索历史条目
         */
        getVisibleList(){
            if (this.searchDrewerOpen){
                return this.historySearchList;
            }
            return this.historySearchList.slice(0,10)
            
        },
        clearHistory(){
            this.$refs.deletePopup.open();
        },
        //清除搜索历史
        confirmDelete() {
            this.$removeStorageSync(historyKey);
            this.historySearchList = [];
            this.$refs.deletePopup.close();
        }
    }
};
</script>

<style lang="scss" scoped>


.address-map {
    height: 100%;
    overflow: hidden;
    position: relative;

    .search-bar {
        padding:10rpx;
        height: 78rpx;
        line-height: 78rpx;
        display: flex;
        align-items:center;
        box-sizing: content-box;
        background: #fff;

        .changeCity {
            width: 110rpx;
            font-size: 24rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: content-box;
            white-space: nowrap;

            .iconfont {
                font-size: 24rpx;
                margin-left: 6rpx;
                color: #C2C2C2;
            }
        }

        .sea_input {
            flex: 1;
            height: 65rpx;
            font-size: 24rpx;
            color: #333;
        }

        .search_center {
            display: flex;
            align-items: center;
            border: none;
            flex: 1;
            height: 60rpx;
            margin:0 8rpx;
            padding-left: 20rpx;
            border-radius: 32.5rpx;
            background-color: #f5f5f5;

            .icon_search {
                font-size: 30rpx;
                margin-right: 22rpx;
                color: #999;
            }

            .clear_content {
                width: 30rpx;
                height:30rpx;
                margin-right:10rpx;
            }
        }
    }

    .myMap {
        width: 100%;
        // height: 50%;
        height:calc((50% - 78rpx));
        .map-center-icon{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -100%);
            z-index: 99;

            .bounce{
                animation: bounce 1s ease-in-out;
            }
            .map-icon{
                background: url("@/static/shared/common/icon/position.svg") center no-repeat;
                background-size: contain;
                width: 96rpx;
                height:96rpx;
            }


            @keyframes bounce {
                0% {
                    transform: translateY(0);
                }

                50%{
                    transform: translateY(-.2rem);
                }

                100% {
                    transform: translateY(0);
                }
            }
        }
    }

    .result-panel {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 50%;
        background: #fff;
        z-index: 999;
        transition: height 0.3s;

        .content{
            position: static;
            height: 100%;
            overflow-y: auto;
        }

        &.full-height {
            height: calc(100% - 78rpx);
        }

        ul.nearby,
        ul.search-result {
            padding-left: 10rpx;
            li {
                display: flex;
                align-items: center;
                height: 1.1rem;
                padding: 0 20rpx;

                .name {
                    font-size: 0.3rem;
                }

                .address {
                    font-size: 0.24rem;
                    color: #999;
                }

                .distance{
                    flex: none;
                }

                &.selected {
                    .name {
                        color: #e82b29;
                    }
                }

                .iconPosition {
                    width: 44rpx;
                    height: 44rpx;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 0.16rem;
                    .iconfont{
                        font-size: 44rpx;
                    }
                    .icon_position{
                        color:#e82b29;
                    }
                    .icon_site{
                        color:#C2C2C2;
                    }


                }
            }
        }

        ul.search-result {
            li {
                justify-content: space-between;
            }
        }

        .search-item {
            padding: 30rpx 28rpx;

            .search-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 48rpx;
                color: #2D2D2D;
                font-size: 28rpx;
                font-weight: bold;

                image {
                    width: 48rpx;
                    height: 48rpx;
                }
            }

            .search-con {
                display: flex;
                align-items: center;
                flex-wrap: wrap;

                .item {
                    height: 50rpx;
                    padding: 0 18rpx;
                    color: #2D2D2D;
                    line-height: 50rpx;
                    font-size: 24rpx;
                    background-color: #F5F5F5;
                    border-radius: 25rpx;
                    margin-right: 20rpx;
                    margin-top: 20rpx;
                    max-width: 274rpx;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                }
            }
            .search_drawer{
                display: flex;
                justify-content: center;
                font-size: 24rpx;
                color: #2D2D2D;
                margin-top: 20rpx;
                .iconfont {
                    font-size: 27rpx;
                    color: #C2C2C2;
                    margin-left: 4rpx;
                }
            }
        }

        .empty{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);

            .img{
                width: 256rpx;
                height: 256rpx;
                background: var(--addressEmptyImg);
                background-size: 100% 100%;
                padding-top: 266rpx;
                text-align: center;
                color:#999;
            }

            .btn{
                margin: 60rpx auto;
                width: 180rpx;
                height: 68rpx;
                line-height: 68rpx;
                border: 1rpx solid var(--tagColor);
                border-radius:34rpx;
                color:var(--tagColor);
                text-align: center;
                font-size:26rpx;
            }
        }

        .search-history {
            padding: 0.24rem 0.3rem;
        }
    }
}
.mask{
    animation:fade 0.5s ease-in-out 0s 1 alternate forwards;;
    background: rgba(0, 0, 0, 0.5);
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    bottom:0;
    right:0;
    left:0;
    z-index: 2555;
}
.empty_part {
    flex: 1;
    width: 100%;
    height:calc((100% - 78rpx));
    padding-top: calc((100vh - 100rpx - var(--titleBarFillHeight, 0px))*0.32 - 128rpx);
    .img {
        width: 256rpx;
        height: 256rpx;
        background: var(--addressEmptyImg);
        background-size: 100% 100%;
        text-align: center;
        color:#999;
    }
    .tip_con {
        color: $main-third-color;
        font-size: 28rpx;
    }
}
::v-deep .amap-logo,
::v-deep .amap-copyright {
    display: none !important;
}
::v-deep .amap-geo{
    width: .6rem;
    height: .7rem;
    box-shadow: 0px .06rem .1rem 0px rgba(101, 112, 242, 0.12);
    border-radius: .08rem;
    border: none;
    background: #fff url('./img/mypositive.svg') center no-repeat;
}
::v-deep .amap-geolocation-con{
    z-index: 998 !important;
}
</style>
