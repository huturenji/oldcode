<template>
	<div class="address-map">
		<div class="search-bar">
			<div class="changeCity normal-btn" @click="chooseAreaShow = true">
				{{ cityName }}
				<Icon
					type="icon_common_downarrow"
					class="icon-down"
					size=".24"
				></Icon>
			</div>
			<searchComp
				ref="searchComp"
                placeholderText='小区/写字楼/学校等'
                :isCacheSearchHistory='false'
				@search="search"
                @onInput='onInput'
				@focusInputFun="focusSearch"
				@cancleEmit="openSearch = false"
			/>
		</div>
		<div id="container" class="myMap">
            <div class='map-center-icon' v-if='showCenterPoint'>
                <Icon type='position' :class='{"bounce": pointBounce}' size='.96'/>
            </div>
        </div>
		<div class="result-panel" :class="{ 'full-height': openSearch }">
            <div class='content'><!--防止absolute导致的偶现不能滑动-->
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
                            <div class="icon-position">
                                <Icon
                                    :type="
                                        currPos.id == data.id
                                            ? 'icon_clock'
                                            : 'icon_common_site'
                                    "
                                    size=".44"
                                ></Icon>
                            </div>
                            <div>
                                <div class="name">{{ data.name }}</div>
                                <div class="address">{{ data.address }}</div>
                            </div>
                        </li>
                    </ul>
                    <div v-else-if="!nearbyData" class='empty'>
                        <div class='img'>暂无数据</div>
                        <div class='btn' @click="getLocationManual">手动定位</div>
                    </div>
                </template>

                <!--搜索的点-->
                <template
                    v-else-if="
                        !!openSearch && searchResult && searchResult.length > 0
                    "
                >
                    <ul class="search-result">
                        <li
                            v-for="data in searchResult"
                            :key="data.id"
                            class="normal-btn"
                            @click="emitResult(data)"
                        >
                            <div>
                                <div class="name">{{ data.name }}</div>
                                <div class="address  no-wrap">
                                    {{
                                        data.address && data.address.length > 0
                                            ? data.address
                                            : ""
                                    }}
                                </div>
                            </div>
                            <div class="distance" v-if="data.distance != -1">
                                {{ data.distance | distanceFormat }}
                            </div>
                        </li>
                    </ul>
                </template>
                <template v-else-if='!!openSearch && (!searchResult || searchResult.length==0)'>
                    <history
                        class="search-history"
                        ref="history"
                        :historyKey="historyKey"
                        @choose="emitResult"
                    />
                </template>
            </div>
		</div>

		<!-- 选择地址的三级选择的弹窗 -->
		<div v-transfer-dom>
			<popup
				v-model="chooseAreaShow"
				:popup-style="{ zIndex: 2560 }"
				height="60%"
			>
				<addressComp
					ref="addressCompChoose"
					:showTitle="true"
					@selectAddress="selectAddress"
					@closePop="closePopFun"
				></addressComp>
			</popup>
		</div>

        <!-- mask自定义遮罩层 -->
        <div v-transfer-dom>
            <div v-if="showMask" class="mask" @click="closePopFun"></div>
        </div>
	</div>
</template>

<script>
import extendUtils from "common/lib/utils";
import requestHandler from "common/lib/requestHandler/addressHandler.js";
import searchComp from "commonComp/search/simpleSearch.vue";
import Icon from "common/components/base/Icon";
import history from "./searchHistory";
import addressComp from "common/components/base/AddressComp"; //三级联动的组件
import { TransferDom, Popup } from "vux";

const MAX_HISTORY_LENGTH = 20;

export default {
	name: "address-map",
	directives: {
		TransferDom,
	},
	components: {
		Popup,
		searchComp,
		Icon,
		history,
		addressComp,
	},
	data() {
		let that = this;
		return Object.assign(
			extendUtils.stateManager.setData([
				{
					name: "openSearch", 
					type: "page",
					parent: "$refs.addressMap",
					show: {
						callback() {
							Array.prototype.forEach.call(document.querySelectorAll(".amap-geolocation-con"), dom=>{
                                dom.style.display = "none"
                            });
                            that.searchResult = [];
						},
					},
					hide: {
						callback() {
							Array.prototype.forEach.call(document.querySelectorAll(".amap-geolocation-con"), dom=>{
                                dom.style.display = "block"
                            });
                            that.selectAddress(that.currPos);
                            that.$forceUpdate()
						},
					},
				},
				{
					name: "chooseAreaShow",
					type: "page",
					parent: "$refs.addressMap",
					show: {
						callback() {
                            that.showMask = true;
                        },
					},
					hide: {
						callback() {
                            that.showMask = false;
                        },
					},
				},
			]),
			{
				mapConfig: {
                    zoom: 14,
                    resizeEnable: true,
                },
				nearbyData: [],
				searchResult: [],
				pageIndex: 1,
				location: null,
				currPos: {},
				map: null, //地图实例
				searchHistroy: [],
                historyKey: "mapSearchHistroy",
                chooseCityName: null,
                showMask: false,
                geolocation: null,//Map的位置对象
                showCenterPoint: false,//是否显示地图中心点
                pointBounce: true,//地图中心点是否执行跳动动画
			}
		);
	},
	filters: {
		distanceFormat(value) {
			if (value < 1000) {
				return `${value}m`;
			} else {
				return `${new Number(value / 1000).toFixed(2)}km`;
			}
		},
	},
	computed: {
		cityName() {
            //如果设置了当前城市，直接返回
            if(!extendUtils.isStrictEmpty(this.chooseCityName)){
                return this.cityNameFormat(this.chooseCityName);
            }
            //未设置当前城市，则使用当前定位城市
			if (!this.location) {
				return "";
			}
			let name = this.location.addressComponent.city;
			return this.cityNameFormat(name);
		},
	},
	created() {
        this.initMap();
	},
	methods: {
		initMap() {
            let that = this;
            const ID = 'amap'
            //先移除地图js，否则再次初始化本组件时会报错
            let script = document.getElementById(ID)
            script && script.remove();
			extendUtils.loadScript({
				src:
					"https://webapi.amap.com/maps?v=1.4.15&key=9bd29edddf0b97b5b4b8cfd5bca67055",
				id: ID,
				onload: async function() {
                    that.map = new AMap.Map("container", that.mapConfig);
                    that.bounceAction();
                    that.location = await that.getLocation();
                    that.nearbyData = (await that.searchNearBy()).pois;
					that.currPos = that.nearbyData && that.nearbyData.length > 0
							? that.nearbyData[0]
                            : {};

                    that.bindEvent(that.map)        
				},
			});
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
        /**
         * 目前采用的是Autocomplete算法（同京东）。 POI搜索算法暂屏蔽
         */
		onInput(keywords) {
            if(extendUtils.isEmpty(keywords)){
                return;
            }
			let that = this;
            // AMap.service(["AMap.PlaceSearch"], function() {
            //     try{
            //         //构造地点查询类
            //         var placeSearch = new AMap.PlaceSearch({
            //             pageSize: 100, // 单页显示结果条数
            //             pageIndex: 1, // 页码
            //             city: that.cityName,
            //             citylimit: true, //是否强制限制在设置的城市内搜索
            //             autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
            //             type: '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施',

            //         });
            //         placeSearch.search(keywords, function(
            //             status,
            //             result
            //         ) {
            //             if (status == "complete") {
            //                 that.searchResult = result.poiList.pois.filter(tip => {
            //                     if(!tip.location){
            //                         return false
            //                     }
            //                     let distance = AMap.GeometryUtil.distance([
            //         				that.currPos.location.lng,
            //         				that.currPos.location.lat,
            //                     ], [
            //                         tip.location.lng,
            //                         tip.location.lat,
            //                     ]);
            //                     if (!extendUtils.isStrictEmpty(distance)) {
            //                         tip.distance = Math.round(distance);
            //                     } else {
            //                         tip.distance = -1;
            //                     }
            //                     return true;
            //                 });
            //                 that.searchResult = that.searchResult.sort((a,b)=>{return a.distance - b.distance})
            //             }
            //         });
            //     }catch(e){
            //         console.error(e);
            //     }
            // });
			AMap.plugin("AMap.Autocomplete", function() {
				var autoComplete = new AMap.Autocomplete({
                    city: that.cityName,
                    citylimit: true,
				});
				autoComplete.search(keywords, function(status, result) {
					if (status == "complete") {
						let currPos = [
							that.currPos.location.lng,
							that.currPos.location.lat,
                        ];
						that.searchResult = result.tips.filter(tip => {
                            if(!tip.location){
                                return false
                            }
                            let distance = AMap.GeometryUtil.distance(currPos, [
                                tip.location.lng,
                                tip.location.lat,
                            ]);
                            if (!extendUtils.isStrictEmpty(distance)) {
                                tip.distance = Math.round(distance);
                            } else {
                                tip.distance = -1;
                            }
							return true;
						});
					}
				});
			});
        },
        handlerResult(data){
            data.district = (data.pname||'')+(data.cityname||'')+(data.adname||'') 
            if(!data.district){
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
            let historyKey = `${requestHandler.primaryKey}_${this.historyKey}`
            let historySearchList = !!extendUtils.getStorage(historyKey) ? JSON.parse(extendUtils.getStorage(historyKey)) : []
            if(!historySearchList){
                historySearchList = [];
            }
            let index = historySearchList.findIndex(h=>h.id == value.id);
            if(index>-1){
                historySearchList.splice(index, 1);
            }
            historySearchList.unshift(value);
            //最多存MAX_LENGTH条
            if(historySearchList.length > MAX_HISTORY_LENGTH){
                historySearchList.length = MAX_HISTORY_LENGTH;
            }
            extendUtils.setStorage(`${requestHandler.primaryKey}_${this.historyKey}`, JSON.stringify(historySearchList));
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
            this.closePopFun();
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
					try{
                        //构造地点查询类
                        var placeSearch = new AMap.PlaceSearch({
                            pageSize: 50, // 单页显示结果条数
                            pageIndex: 1, // 页码
                            city: that.location.addressComponent.citycode,
                            citylimit: true, //是否强制限制在设置的城市内搜索
                            // map: that.map, // 展现结果的地图实例
                            autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
                            showCover: false,
                            type: '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施',

                        });
                        placeSearch.searchNearBy("", [
                            that.location.position.lng,
                            that.location.position.lat,
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
                    }catch(e){
                        console.error(e);
                        resolve({});
                    }
				});
			});
        },
        getLocationManual(){
            if(!this.geolocation){
                return;
            }
            this.geolocation.getCurrentPosition(function(status, result) {
            if (status == "complete") {
                } else {
                    extendUtils.showToast("获取定位失败，请检查定位权限是否开启");
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
                            content:'<img src="'+icon+'" style="width: .4rem;height: .46rem;transform:translateY(.23rem)"/>',
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
							extendUtils.showToast("获取定位失败，请检查定位权限是否开启");
							resolve();
						}
					});
                    that.geolocation = geolocation;
				});
			});
		},
		/**
		 * 接受三级联动返回的数据
		 */
		selectAddress(addressIdList, addressNameList) {
            if(addressNameList && addressNameList.length>1){
                this.chooseCityName = addressNameList[1];//设置城市
            }
            this.closePopFun()
		},
		/**
		 * 关闭三级联动的弹窗
		 */
		closePopFun() {
			this.chooseAreaShow = false;
		},
	},
};
</script>

<style lang="less" scoped>
@import "~themes/default/styles/common/variable.less";
@import "~mallStyles/mixins/hairLine.less";
@search-height: 0.78rem;

@media screen and (min-width: @screen-sm) {
	@search-height: 0.88rem;

	.search-bar {
		padding-top: 0.1rem;
	}
}

.address-map {
	height: 100%;
    overflow: hidden;
	position: relative;

	.search-bar {
		height: @search-height;
		line-height: @search-height;
		display: flex;
		align-items: stretch;
		box-sizing: content-box;
		padding-bottom: 0.1rem;
		background: #fff;

		.changeCity {
			width: 1.52rem;
			font-size: 0.24rem;
			display: flex;
			justify-content: flex-end;
            align-items: center;
            padding: 0 .06rem;
            box-sizing: content-box;
            white-space: nowrap;

			.icon {
				margin-left: 0.06rem;
				margin-right: 0.1rem;
			}
		}

		/deep/ .search-container {
			margin-right: 0.3rem;
			.search-btn,
			.cancle-btn {
				height: @search-height;
				line-height: @search-height;
			}

			.icon-close,
			.icon-search {
				transform: translateY(-50%);
				margin: 0;
				width: initial;
				height: initial;
				display: flex;
			}
		}
	}

	.myMap {
		width: 100%;
		height: calc(~"50% - " @search-height);

        .map-center-icon{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -100%);
            z-index: 99;

            .icon{
                fill: @success-color;
                &.bounce{
                    animation: bounce 1s ease-in-out;
                }
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
		z-index: 9999;
		transition: height 0.3s;

        .content{
            position: static;
            height: 100%;
            overflow-y: auto;
        }

		&.full-height {
			height: calc(~"100% - .1rem - " @search-height);
		}

		ul.nearby,
		ul.search-result {
			li {
				display: flex;
				align-items: center;
				height: 1.1rem;
				padding: 0 0.2rem;

				.name {
					font-size: 0.3rem;
				}

				.address {
					font-size: 0.24rem;
					color: @third-text-color;
				}

                .distance{
                    flex: none;
                }

				&.selected {
					.name {
						color: @theme-color;
					}
				}

				.icon-position {
					fill: @theme-color;
					width: 0.44rem;
					height: 0.44rem;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-right: 0.16rem;
				}
			}
		}

		ul.search-result {
			li {
				.bbpx();
				justify-content: space-between;
			}
		}

        .empty{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);

            .img{
                width: 2.56rem;
                height: 3.1rem;
                background: url('~themes/default/img/defaultPage/img_defpage_nodata@2x.png') top center no-repeat;
                background-size: contain;
                padding-top: 2.66rem;
                text-align: center;
                color: @third-text-color;
            }

            .btn{
                .bpx(1px, .34rem, @theme-color);
                margin: .2rem auto;
                width: 1.8rem;
                height: .68rem;
                line-height: .68rem;
                border-radius: .34rem;
                color: @theme-color;
                text-align: center;
                font-size: .26rem;
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
/deep/ .amap-logo,
/deep/ .amap-copyright {
	display: none !important;
}
/deep/ .amap-geo{
    width: .6rem;
    height: .7rem;
    box-shadow: 0px .06rem .1rem 0px rgba(101, 112, 242, 0.12);
    border-radius: .08rem;
    border: none;
    background: #fff url('./img/mypositive.svg') center no-repeat;
}
/deep/ .amap-geolocation-con{
    z-index: 998;
}
</style>
