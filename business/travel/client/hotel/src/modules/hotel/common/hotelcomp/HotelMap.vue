<template>
<div class="mapOutWrap">
    <div id="map-container" class='amap-wrapper'>
    </div>
    <div v-if='showInfo' class="mapInfoWrap">
        <HotelList class="nopadding" @click.native='openDetail(hotel.hotelId, hotel.providerType)' :hotel='hotel' :locationPoint='point'/>
        <span @click="showInfo=false;removeMapActive()" class="closeButWrap cursorp"></span>
    </div>
    <div class="locationBut" @click="gotoPosition()">我的位置</div>
</div>
</template>
<script>
import hotelHandler from 'hotelHandler/hotelHandler.js'
import HotelList from 'hotelComponent/hotelcomp/hotelList.vue';
export default {
    components: {
        HotelList
    },
    props:{
        hotelList:{
            type:Array,
            default:() => []
        },
        locationPoint:{
            type:Object,
            default:() => {}
        }
    },
    data() {
        return {
            aMap:null,//地图对象
            showInfo:false,
            hotel:{},//酒店信息
            priceList:this.hotelList,//酒店价格列表，用来标注在地图上
            point:this.locationPoint,//定位点
            svgLng:0,//中心点经度
            svgLaT:0,//中心点纬度
            markers: [],//标记点list
            position:[]//定位坐标
        }
    },
    watch:{
        hotelList:{
            handler(newVal){
                let that = this;
                console.log('watch hotelList')
                //如果值存在，并且地图为初始化
                if (0<newVal.length){
                    if (!that.aMap){
                        //初始化地图
                        that.initMap(newVal);
                    }
                    that.showInfo = false;
                    that.showPrice(that.aMap,newVal);
                }
            },
            deep:true
        }
    },
    created() {
    },
    computed: {},
    mounted() {
        let that = this;
        that.initMap(that.priceList);
        that.showPrice(that.aMap,that.priceList);
        /**
         * 监听点击事件
         * @param {Object} content
         * @param {Object} marker
         */
        // function addClickHandler(content,marker){
        //     marker.addEventListener('click',function(e){
        //         openInfo(content,e);
        //     });
        // }
        // /**
        //  * 打开信息窗口
        //  * @param {Object} content
        //  * @param {Object} e
        //  */
        // function openInfo(content,e){
        //     let p = e.target;
        //     let point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        //     let infoWindow = new BMap.InfoWindow(content,opts);//创建信息窗口对象
        //     aMap.openInfoWindow(infoWindow,point);//开启信息窗口
        // }
    },
    methods: {
        /**
         * 初始化地图 返回地图对象
         */
        initMap(dataList){
            let that = this;
            let length = dataList.length;
            if (0==length) { return; }
            //获取地图中心点
            dataList.forEach((item)=>{
                that.svgLng+=parseFloat(item.lng);
                that.svgLaT+=parseFloat(item.lat);
            });
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
                return;
            }
            if (!that.aMap){
                let aMap = new AMap.Map('map-container', {
                    zoom:11,//级别
                    center: [that.svgLng/length,that.svgLaT/length],//中心点坐标
                    resizeEnable: true
                });
                AMap.plugin('AMap.Geolocation', function() {
                    var geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true,//是否使用高精度定位，默认:true
                        timeout: 10000, //超过10秒后停止定位，默认：5s
                        zoomToAccuracy: false,//定位成功后是否自动调整地图视野到定位点
                        panToLocation:false,//定位成功后是移动到定位点
                        showButton: false, 
                        markerOptions:{//定位点配置
                            icon:"./assets/img/hotel/icon_map_location@2x.png",
                            zIndex:99
                        }
                    });
                    aMap.addControl(geolocation);
                    geolocation.getCurrentPosition(function(status,result){
                        if (status=='complete'){
                            that.position = [result.position.lng,result.position.lat];
                        } else {

                        }
                    });
                });
                //设置地图主题样式为whitesmoke
                aMap.setMapStyle("amap://styles/whitesmoke");
                that.aMap = aMap;
            }
                
        },
        gotoPosition(){
            this.aMap.setCenter(this.position)
        },
        /**
         * 显示所有价格位置
         * @param {Object} aMap  地图对象
         * @param {Object} priceList  价格列表
         */
        showPrice(aMap,priceList){
            if (!aMap) { return; }//地图未初始化直接返回
            let _this = this;
            //清除地图点
            _this.markers.forEach((marker)=>{
                aMap.remove(marker);
            })
            _this.markers = [];
            //标记价格点  //标记酒店价格
            priceList.forEach((item)=>{
                let gaodePoint = hotelHandler.baiduToGaode(item.lng,item.lat);
                var Marker = new AMap.Marker({
                    position: new AMap.LngLat(gaodePoint.lng,gaodePoint.lat),
                    offset: new AMap.Pixel(-36, -5),
                    content:"<div class='h_Pos'><span>"+item.minPrice+"</span></div>",
                    extData:{
                        hotelInfo: item
                    }
                });
                _this.markers.push(Marker);
                aMap.add(Marker);
                Marker.on('click', ()=>{ _this.openHotelInfo(item) });
            });
            aMap.setFitView();

        },
            
        /**
         * 打开酒店信息
         * @param {Object} hid  酒店ID
         * @param {Object} providerType  供应商
         */
        openHotelInfo(mapItem){
            let _this = this;
            _this.hotel = mapItem;
            _this.showInfo = true;
            _this.removeMapActive();
            _this.setMarkOption(mapItem);
        },
            
        /**
         * 修改定位点信息
         * @param {Object} hotelItem  酒店信息
         */
        setMarkOption(hotelItem){
            let _this = this;
            for (var i = 0; i < _this.markers.length; i++){
                // 获取存在每个 extData 中的 id
                var id = _this.markers[i].getExtData().hotelInfo.hotelId;
                if (id === hotelItem.hotelId){
                    let targetMarker = _this.markers[i];
                    targetMarker.setContent("<div class='h_Pos h_Pos_active'><span>"+hotelItem.minPrice+"</span></div>")
                }
            }

        },            
            
        /**
         * 打开酒店详情
         * @param {Object} hid  酒店ID
         * @param {Object} providerType  供应商
         */
        openDetail(hid,providerType){
            let _this = this;
            let hotelSearchJson = JSON.parse(hotelHandler.getStorage('hotelSearch'));
            //统一收集数据
            let hotelObj = {
                hid:hid,
                inDate:parseInt(hotelSearchJson.inDate),
                outDate:parseInt(hotelSearchJson.outDate),
                inDays:parseInt((hotelSearchJson.outDate - hotelSearchJson.inDate) / (24 * 60 * 60 * 1000)),
                providerType:providerType,
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
         * 去除地图价格标记物active 状态
         */
        removeMapActive(){
            let arr = document.getElementsByClassName("h_Pos");
            let arrLength = arr.length;
            for (var i=0;i<arrLength;i++){
                arr[i].classList.remove("h_Pos_active");
            }
        }
    }
}
</script>

<style lang="less">
@import '~styles/core/common.less';
.h_Pos{
    display: inline-block;
    width: 73px;
    height: 39px;
    line-height: 30px;
    text-align: center;
    color:@danger-color-light;
    background: url('~assets/img/hotel/price_bg.png') no-repeat center;
    background-size: 100%;
}
.h_Pos_active{
    width: 73px;
    height: 39px;
    line-height: 30px;
    text-align: center;
    color:@sub-background-color;
    background: url('~assets/img/hotel/price_bg_check.png') no-repeat center;
    background-size: 100%;
}
.h_Pos span:before{
    content: '￥';
    font-size: 12px;
}
.h_Pos span:after{
    content: '起';
    font-size: 12px;
}
.amap-wrapper{        
    position: absolute;
    top: 2.14rem;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
}
.infoWrap{
    position: relative;
    width: 0.19rem;
    height: 0.31rem;
    background: url('~assets/img/hotel/gps_mark.png') no-repeat center;
    background-size: 0.19rem 0.31rem;
}
.infoName{
    position: absolute;
    text-align: center;
    padding: 0.05rem 0.1rem;
    width: 2rem;
    font-size: 0.24rem;
    bottom: 0.45rem;
    left: 50%;
    margin-left: -0.95rem;
    background: @sub-background-color;
    box-shadow: 0 3px 14px rgba(0,0,100,0.6);;
    border-radius: 0.05rem;
}
.infoName:after{
    position: absolute;
    content: '';
    width: 0.3rem;
    height: 0.23rem;
    bottom: -0.2rem;
    left: 50%;
    margin-left: -0.15rem;
    background: url('~assets/img/hotel/sharp.png') no-repeat center;
    background-size: 0.3rem 0.23rem;
}
.mapInfoWrap{
    position: absolute;
    top: 3.02rem;
    left: 0.3rem;
    right: 0.3rem;
    .lineWrap.hoteListItem.nopadding{
        padding: 0 0.4rem 0 0;
        box-shadow: 0 0.04rem 0.14rem -0.04rem rgba(105, 105, 105, 0.53);
        border-radius: 0.08rem;
        &:after{
            display: none;
        }
        .iconWrap .iconImg{
            border-radius: 0;
            border-top-left-radius: 0.08rem;
            border-bottom-left-radius: 0.08rem;
        }
        // .titWrap .name{
            // flex: 1;
        // }
    }
}
.mapInfoWrap .lineWrap.hoteListItem{
    margin-bottom: 0;
}
.closeButWrap{
    position: absolute;
    right: 0;
    top: 0;
    width: 0.6rem;
    height: 0.6rem;
    background: url('~assets/img/hotel/icon_mapclose_hov.png') no-repeat center;
    background-size: .44rem;
}
.closeButWrap:active{
    background: url('~assets/img/hotel/icon_mapclose_hov.png') no-repeat center;
    background-size: .44rem;
}
.locationBut{
    cursor: pointer;
    position: absolute;
    right: 15px;
    bottom: 20px;
    width: 0.7rem;
    height: 0.7rem;
    padding-top: 0.48rem;
    text-align: center;
    color: @secondary-text-color;
    font-size: 0.12rem;
    background:#fff url('~assets/img/hotel/mypositive.svg') no-repeat center 0.08rem;
    background-size: .36rem;
    box-shadow: 0 0.06rem 0.1rem 0 rgba(101, 112, 242, 0.12);
    border-radius: 0.08rem;
}
.amap-wrapper{
    .amap-logo,.amap-copyright{
        display: none !important;
    }
}
</style>