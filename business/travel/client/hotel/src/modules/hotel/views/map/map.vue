<template>
    <div>
        <div id="hotel-map-container" class='hotel-amap-wrapper'></div>
        <span ref='order' class="mapBarWrap">
            <div class="mapBarInWrap">
                <span class="left" :class="{rightRadio:pageFrom != 'trip'}">{{hotelName}}</span>
                <span class="right icon-btn linear-gra-dange" v-if="pageFrom != 'trip'" @click='toOrder'>预订</span>
                <span class="downArr"></span>
            </div>
        </span>
        <div class="bottomInfoWrap">
            <div class="left">
                <div class="mapInfoTit">{{hotelName}}</div>
                <div class="mapInfoText">{{address}}</div>
            </div>
            <div class="right icon-btn" @click="navigation">
            </div>
        </div>
    </div>
</template>

<script>
import hotelHandler from 'hotelHandler/hotelHandler.js'
export default {
    mixins: [hotelHandler.mixin.tChatEventMixin],
    directives: {},
    components: {},
    props: {},
    data() {
        return {
            lng: 0,//酒店经度
            lat: 0,//酒店纬度
            zoom: 15,//比例尺
            center: [111.59996, 31.197646],//默认中心点
            hotelName: '',//酒店名字
            address: '',//酒店地址
            mapCenter: [this.lng, this.lat],//地图中心点
            pageFrom:'',//跳转来源
            aMap:null,//地图对象
            inwxmini:hotelHandler.MINIPROGRAM_CONFIG.IN_MINIPROGRAM || false
        }
    },
    beforeCreate() {},
    created() {
        var _this = this;
        if (_this.$route.query.close=='1' || _this.$route.query.close=='trip' ){
            _this.pageFrom = 'trip';
        }
        _this.$emit('showOff', true);
        _this.lng = this.$route.query.lng;
        _this.lat = this.$route.query.lat;
        _this.hotelName = this.$route.query.hotelName;
        _this.address = this.$route.query.address;
        _this.$forceUpdate();
    },
    mounted() {
        var _this = this;
        //判断Bmap是否加载完成，兼容部分银行环境无法访问外网的情况
        let ishaveBMap = false;
        try {
            // var x = AMap;
            ishaveBMap = true;
        } catch (e){
            console.log(e.message);
            ishaveBMap = false
        }
        if (!ishaveBMap){
            return;
        }            
        let gaodePoint = hotelHandler.baiduToGaode(_this.lng,_this.lat);
        let aMap = new AMap.Map('hotel-map-container', {
            zoom:_this.zoom,//级别
            center: [gaodePoint.lng,gaodePoint.lat],//中心点坐标
            resizeEnable: true
        });
            //设置地图主题样式为whitesmoke
        aMap.setMapStyle("amap://styles/whitesmoke");
        _this.aMap = aMap;
        //添加信息标记
        let markerInfo = new AMap.Marker({
            position: new AMap.LngLat(gaodePoint.lng,gaodePoint.lat),
            offset: new AMap.Pixel(0, -20),
            content:_this.$refs.order
        });
        aMap.add(markerInfo);

        //添加跳动图标标记点
        let markerIcon = new AMap.Marker({
            position: new AMap.LngLat(gaodePoint.lng,gaodePoint.lat),
            offset: new AMap.Pixel(-20, 0),
            icon:'./assets/img/hotel/icon_hotel_pos.png',
            animation: "AMAP_ANIMATION_BOUNCE"
        });
        aMap.add(markerIcon);
    },
    methods: {
        /**
             * 跳转到预定页面
             */
        toOrder(){
            this.$router.back(-1)
        },
        /**
             * 开始导航
             */
        navigation(){
            let _this = this;
            //微信小程序内调整为复制酒店名称并提示用户前往导航软件粘贴使用
            if (_this.inwxmini){
                hotelHandler.copyStr(_this.hotelName,'复制成功，请前往导航软件粘贴使用');
                return
            }
            let data = {
                mapType:0,
                longitude:parseFloat(_this.lng),
                latitude:parseFloat(_this.lat),
                actionType:1,
                destination :_this.hotelName
            }
            sinosdk.sino.openThirdMapApp(data).then((re)=>{
                var res = re || {};
                if (404==res.ret){
                    hotelHandler.showToast('暂不支持导航');
                } else if (-1==res.ret){
                    hotelHandler.showToast('未安装任何导航软件，请先进行安装');
                }
            });
        },
        /**
            * T信回退事件的注册回调 必须是goBackFun
            */
        goBackFun(){
            let _this = this;
            if (_this.$route.query.close=='1'){
                window.close();
                hotelHandler.closePage('');
                return;
            }
            _this.$router.back();             
        }            
    }
}
</script>
<style lang="less">
    @import './map.less';
</style>