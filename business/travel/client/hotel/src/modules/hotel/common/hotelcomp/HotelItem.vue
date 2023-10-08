<template>
<div class="hoteItem">
    <div class="itemText">
        <span class="itemName">{{hotel.hotelName}}</span><span class="roomType">{{starLevelListMap[hotel.star]}}</span>
    </div>
    <div class="itemWarp bbpxs pb40">
        <div class="left">
            <div class="itemTit">{{hotel.address}}</div>
            <div class="itemTips" v-if="hoveLocation && isLocationCity"><Icon type='icon_common_location-fill' class="locationFill" size=".24"/>距您{{distance}}</div>
            <div class="itemTips">{{hotel.cbdName}}</div>
        </div>
        <div class="right map cursorp normal-btn" @click='showMap'>地图/导航<Icon type='icon_common_rightarrow' class="numwrapRight" size=".24"/></div>
    </div>
    <div class="itemWarp pt40">
        <div class="left">
            <div class="itemTit">酒店介绍</div>
        </div>
        <div class="right map cursorp normal-btn" @click='openIntroduction'>详情/设施<Icon type='icon_common_rightarrow' class="numwrapRight" size=".24"/></div>
    </div>
    <div class="serviceListWrap" v-if="0 < serviceList.length">
        <template v-for="(server,index) in serviceList" >
            <span :key="index" v-if="server!=''" class="serviceItem"><Icon type='icon_common_check-circle' class="serverIcon" size=".24"/>{{server}}</span>
        </template>
    </div>
</div>
</template>

<script>
import hotelHandler from 'hotelHandler/hotelHandler.js'
import Icon from 'components/icon';
export default {
    components: {
        Icon
    },
    props:{
        hotel:{
            type:Object,
            default: () => {}
        },
        hid:{
            type:String,
            default:''
        },
        locationPoint:{
            type:Object,
            default:() => {}
        },
        serviceList:{
            type:Array,
            default:() => {}
        },
        isLocationCity:{
            type:Boolean,
            default:false

        }
    },
    data() {
        return {
            hoveLocation:false,
            lng:0,
            lat:0,
            distance:0,
            starLevelListMap: {//酒店星级map
                5: '豪华型',
                4: '高档型',
                3: '舒适型',
                2: '其他',
                1: '快捷',
                0: '其他'
            }
        }
    },
    watch:{
        /**
         * hotel数据,等待父页面请求返回后处理
         */
        hotel:{
            handler(newVal){
                if (newVal.lat){ //hotel数据父页面已经返回
                    this.setLocationS();
                }
            },
            deep:true
        },
        /**
         * 定位位置发生变化
         */
        locationPoint:{
            handler(newVal){
                let _this = this;
                console.log('watch locationPoint is ' + JSON.stringify(newVal))
                if (newVal.lat&&newVal.lng){ //经纬度不为0
                    _this.distance = _this.genLocation(newVal,_this.hotel);             
                    _this.hoveLocation = true;  
                } else {
                    _this.hoveLocation = false;  
                }
            },
            deep:true
        }
    },
    created() {
        this.setLocationS();
    },
    mounted() {
        let _this = this;
        if (!!hotelHandler.getStorage('lng')){
            _this.locationPoint = {
                lng:hotelHandler.getStorage('lng'),
                lat:hotelHandler.getStorage('lat')
            }
        } 
    },
    methods: {
        showComments:function(){
            this.$router.push({
                path:'/comments', 
                query:{
                    hid:this.hid,
                    providerType:this.hotel.providerType,
                    commentScorer:this.hotel.commentScorer
                }
            })
        },
        showMap:function(){
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
                hotelHandler.showToast('地图组件加载失败');
                return;
            }                
            _this.$router.push({
                path:'/addr', 
                query:{
                    lng:_this.hotel.lng,
                    lat:_this.hotel.lat,
                    hotelName:_this.hotel.hotelName,
                    address:_this.hotel.address
                }
            })
        },  
        setLocationS(){
            let _this = this;
            _this.distance = _this.genLocation(_this.locationPoint,_this.hotel);
            _this.hoveLocation = true; 
        },
        /**
         * 计算距离
         * @param {Object} locationPoint  定位距离
         * @param {Object} hotel          酒店信息
         */
        genLocation(locationPoint,hotel){
            let distance = hotelHandler.getFlatternDistance(parseFloat(locationPoint.lat),parseFloat(locationPoint.lng),parseFloat(hotel.lat),parseFloat(hotel.lng));
            let temps = parseInt(distance);
            if (temps){
                if (temps<1000){
                    return parseInt(temps/10)*10+'米';
                }
                return parseInt(distance/100)/10+'公里';
                        
            }
            return '--公里';
            
        },
        /**
         * 打开酒店介绍
         */
        openIntroduction:function(){
            var _this = this;
            _this.$router.push({
                path:'/introduction' 
            })
        }
    }
}
</script>
<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
.bbpxs{
    .bbpx();
}
.bbpxd{
    .bbpx(1px, @border-color-base, 0, 0, dashed);
}
.hoteItem{
    position: relative;
    top: -0.2rem;
    padding:0.4rem 0.3rem;
    color: @text-color;
    background: @sub-background-color;
    border-radius:0.2rem 0.2rem 0px 0px;
    .itemText{
        line-height: 0.5rem;
        font-size: 0.36rem;
        margin-bottom: 0.2rem;
        font-weight: bold;
        .itemName{
            padding-right: 0.16rem;
        }
        .roomType{
            font-size: 0.24rem;
            font-weight: normal;
        }
    }
    .itemWarp{
        &.pb40{
            padding-bottom: 0.3rem;
        }
        &.pt40{
            padding-top: 0.3rem;
        }
        .flex-box();
        .justify-content(space-between);
        .align-items(center);
        .left{
            .locationFill{
                fill:@third-text-color;
                margin-right: 0.08rem;
            }
            .flex(1);
            .itemTit{
                line-height: 0.42rem;
                font-size: 0.26rem;
            }
            .itemTips{
                line-height: 0.42rem;
                font-size: 0.26rem;
                color: @third-text-color;
            }
        }
        .right{
            font-size: 0.26rem;
            color: @warning-color;
            text-align: center;
            .flex-box();
            .align-items(center);
            .numwrapRight{
                fill:@warning-color;
            }
        }
    }
    .serviceListWrap{
        font-size: 0.2rem;
        line-height: 0.38rem;
        color: @third-text-color;
        .flex-box();
        .align-items(center);
        flex-wrap: wrap;
        .serviceItem{
            .flex-box();
            .align-items(center);
            margin-top: 0.2rem;
            margin-right: 0.2rem;
            .serverIcon{
                fill: @success-color;
                margin-right: 0.04rem;
            }
        }
    }
}
</style>

