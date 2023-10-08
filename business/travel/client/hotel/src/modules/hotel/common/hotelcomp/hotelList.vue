<template>
<div class="lineWrap hoteListItem normal-btn cursorp">
    <div class="iconWrap">
        <div class="iconImg" v-bind:style="{backgroundImage: 'url(' + changUrlToHttps(hotel.defaultPicture) + ')'}"></div>
    </div>
    <div class="textBoxWrap">
        <div class="titWrap">
            <span class='name'>{{hotel.hotelName}}</span>
            <span class='star' :class="'starIcon'+hotel.star">{{startTextMap[hotel.star]}}</span>
        </div>
        <div class="contentFlexWrap">
            <div class="contentWrap">
                <div class="textWrap">
                    <span class="left num-font" v-if='0!=hotel.commentScorer||".0"!=hotel.commentScorer'>{{scorerIsFavorableRate?hotel.commentScorer*10:returnFloat1(hotel.commentScorer/10)}}<span>{{scorerIsFavorableRate?'%好评率':'分'}}</span></span>
                    <span class="left" v-else><span>暂无评分</span></span>
                    <span class="right">{{hotel.commentTotalNum || 0}}人评论</span>
                </div>
                <!-- 
                    islocationSearch :是否按位置区域查询酒店
                    ispositionSearch：是否按位置中心点查询酒店
                    isrecommendList:是否推荐 默认为false
                    isCityPosition :是否是定位城市
                    areaId:位置筛选类型ID
                    currentDistance:0,  //根据经纬度计算距离
                    targetDistance:0,  //根据接口distance属性计算
                    -->
                <div class="textInfoWrap">
                    <span class="leftLine" v-if='islocationSearch'>
                        <span v-if="parseInt(areaId) > 10000000 && ((locationPoint.lat+locationPoint.lng)!=0)">{{targetDistance}}距离您{{parseFloat(targetDistance) > 0?targetDistance:currentDistance}}</span>
                        <span v-else>{{locationName}}</span>
                    </span>
                    <span class="leftLine" v-else-if='ispositionSearch || isrecommendList'>
                        <span>{{parseFloat(targetDistance)>0?targetDistance+'距离':''}}{{positionName}}</span>
                    </span>
                    <span class="leftLine" v-else-if='isCityPosition'>
                        <span v-if="sortIndex == 3">距离您{{targetDistance}}</span>
                        <span v-else>距离您{{(parseInt(currentDistance )|| 0) < 0.1?targetDistance:currentDistance}}</span>
                    </span>
                    <span class="right" v-if="!ispositionSearch">{{hotel.cbdName || hotel.address}}</span>
                </div>
            </div>
        </div>
        <div class="tagsWrap" v-if="!!hotel.recLabel && ''!=hotel.recLabel">
            <span class="tagItem">{{hotel.recLabel}}</span>
        </div>
        <div class="moneyWrap">
            <span class="num-font money"><span class="rmb">¥</span>{{hotel.minPrice}}</span>
        </div>
        <!-- <div class="couponWrap">
            <span class="couponLabel linear-gra-hotel-red" v-if="!!hotel.CanUseCoupon&&hotel.CanUseCoupon.length>0">{{getBestCoupon()}}</span>
        </div> -->
        
    </div>
</div>
</template>
<script>
import hotelHandler from 'hotelHandler/hotelHandler.js'
import {getBestCoupon} from 'components/coupon/js/requestHandler.js';
export default {
    components: {
    },
    props:{
        hotel: {//酒店信息
            type:Object,
            default:() => {}
        },
        locationPoint:{
            type:Object,
            default:() => {}
        },
        ispositionSearch:{
            type:Boolean,
            default:false
        },
        positionName:{
            type:String,
            default:''
        },
        isCityPosition:{
            type:Boolean,
            default:false
        },
        locationName:{
            type:String,
            default:''
        },
        islocationSearch:{
            type:Boolean,
            default:false
        },
        isrecommendList:{
            type:Boolean,
            default:false
        },
        areaId:{
            type:String,
            default:'0'
        },
        sortIndex:{
            type:Number,
            default:0
        },
        scorerIsFavorableRate:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            startTextMap:{0:'其他',1:'快捷',2:'经济',3:'舒适',4:'',5:''},
            hoveLocation:false,
            distance:0,
            currentDistance:0,
            targetDistance:0,
            hoveCurrentLocation:false,
            hoveTargetLocation:false
        }
    },
    created() {
        var _this = this;
        if (!!_this.hotel.distance && parseFloat(_this.hotel.distance) > 0){
            let distance = _this.hotel.distance;
            let temps = parseInt(distance);
            if (temps<1000){
                _this.targetDistance = parseInt(temps/10)*10+'米';
            } else {
                _this.targetDistance = parseInt(distance/100)/10+'公里';
            }                
            _this.hoveTargetLocation = true; 
            return;
        }
        _this.setLocationS();
    },
    mounted() {
    },
    computed: {
    },
    watch:{
        /**
         * 定位位置发生变化
            */
        locationPoint:{
            handler(newVal){
                let _this = this;
                //console.log('watch locationPoint is ' + JSON.stringify(newVal))
                if (newVal&&newVal.lat&&newVal.lng){ //经纬度不为0
                    _this.currentDistance = _this.genLocation(newVal,_this.hotel);             
                    _this.hoveCurrentLocation = true;  
                } else {
                    _this.hoveCurrentLocation = false; 
                }
            },
            deep:true
        }
    },
    methods: {
        /**
             * 获取最优惠的优惠券价格
             */  
        getBestCoupon(){
            let that = this;
            return getBestCoupon(that.hotel, function(bestCoupon){
                that.$set(that.hotel, 'bestCoupon',bestCoupon);
            });
        },
        /**
             * 艺龙图片使用https
             */ 
        changUrlToHttps(url){
            return hotelHandler.changUrlToHttps(url);
        },
        /**
         * 当前定位位置到酒店的距离
         */
        setLocationS(){
            let _this = this;
            _this.currentDistance = _this.genLocation(_this.locationPoint,_this.hotel);
            _this.hoveCurrentLocation = true;
        },
        /**
         * 计算距离
         * @param {Object} locationPoint  定位距离
         * @param {Object} hotel          酒店信息
         */
        genLocation:function(locationPoint,hotel){
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
         * 评分保留一位小数
         * @param {Object} 分数
         */
        returnFloat1(value) {
            value = Math.round(parseFloat(value) * 10) / 10;
            if (value.toString().indexOf(".") < 0) {
                value = value.toString() + ".0";
            }
            return value;
        }
    }
}
</script>
<style lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
@import '~styles/mixins/hairLine.less';
.lineWrap.hoteListItem{
.flex-box(); 
    padding: 0.2rem 0.3rem; 
    background: @sub-background-color;
    box-sizing: border-box;
    .bbpx(1px, @border-color-base, 0.3rem, 0.3rem, solid);
    .couponWrap{
        text-align: right;
        .couponLabel{
            display: inline-block;
            font-size: .24rem;
            color: @sub-background-color;
            text-align: center;
            line-height: 0.44rem;
            border-radius: .44rem;
            padding: 0 .2rem;
        }
    }
.iconWrap{
    width: 2.04rem;
    height: 2.72rem;
    background: url(~assets/img/hotel/empty.png) no-repeat center;
    background-size: cover;
    border-radius: 0.08rem;
    .iconImg{
        width: 2.04rem;
        height: 2.72rem;
        background: url(~assets/img/hotel/empty.png) no-repeat center;
        background-size: cover;
        border-radius: 0.08rem;
    }
    span{
        display: inline-block;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5) url(~assets/img/hotel/icon_over.png) no-repeat center;
        background-size: 0.9rem 0.3rem;
        border-radius: 0.08rem;
    }
}
.textBoxWrap{
    padding-left: 0.24rem;
    // padding-top: 0.25rem;
    width:calc(~'100% - 1.99rem');
    .contentFlexWrap{
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .contentWrap{
        flex: 3;
        white-space:nowrap; 
        overflow:hidden; 
        text-overflow:ellipsis; 
    }
    .tagsWrap{
        .tagItem{
            display: inline-block;
            line-height: 0.36rem;
            background: rgba(255, 78, 58, 0.08);
            padding: 0 0.16rem;
            border-radius: 0.36rem;
            color: @danger-color-light;
            font-size: 0.2rem;
        }
    }
    .textWrap{
        margin: 0.08rem 0;
        display: flex;
        align-items: flex-end;
        .left{
            font-size: 0.3rem;
            color: @warning-color;
            span{
                font-weight: normal;
                font-size: 0.24rem;
            }
        }
        .right{
            font-size: 0.24rem;
            color: @third-text-color;
            margin-left: 0.1rem;
            white-space:nowrap; 
            overflow:hidden; 
            text-overflow:ellipsis; 
        }
    }
    .textInfoWrap{
        font-size: 0.24rem;
        color: @third-text-color;
        .flex-box();
        align-items: center;
        height: 0.42rem;
        .leftLine{
            margin-right: 0.1rem;
            padding-right: 0.1rem;
            white-space:nowrap; 
            overflow:hidden; 
            text-overflow:ellipsis; 
            max-width: 2.2rem;
            .brpx(1px, @border-color-base, .02rem, .02rem);
        }
        span:last-of-type:after{
            display: none;
        }
        .right{
            display: inline-block;
            white-space:nowrap; 
            overflow:hidden; 
            text-overflow:ellipsis; 
        }
    } 
    .textInfoWrap>span:only-child{
        max-width:5rem;
    }  
    .textInfoWrap>.right:only-child{
        background:none;
        padding-left: 0;
        margin-left: 0;
    }
}
.titWrap{
    .flex-box();
    .align-items(flex-end);
    font-size: 0.3rem;
    color: @text-color;
    overflow:hidden; 
    text-overflow:ellipsis;  
    position: relative;
    .name{
        margin-right: 0.1rem;
        font-weight: bold;
        overflow:hidden; 
        text-overflow:ellipsis; 
        white-space: nowrap;
        flex: 1;
    } 
    .star{
        margin-top: 0.1rem;
        width: 0.85rem;
        display: inline-block;
        position: relative;
        font-size: 0.24rem;
        color: @third-text-color;  
        font-weight: normal; 
        text-align: right;                    
    }
    .star.starIcon4{
        width: 0.69rem;
        height: 0.52rem;
        margin-top: 0;
        vertical-align: text-bottom;
        background: url(~assets/img/hotel/icon_star4.png) no-repeat center;
        background-size: 95% 95%;
    }
    .star.starIcon5{
        width: 0.69rem;
        height: 0.52rem;
        margin-top: 0;
        vertical-align: text-bottom;
        background: url(~assets/img/hotel/icon_star5.png) no-repeat center;
        background-size: 95% 95%;
    }
}
.haveBack:after{
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -0.12rem;
    content: '';
    display: inline-block;
    width: 0.24rem;
    height: 0.24rem;
    background: url(~assets/img/hotel/icon_back.png) no-repeat center;
    background-size: 0.24rem;
}
.haveBack:empty{
    width: 0.24rem;
    height: 0.24rem;
}
.moneyWrap{
    margin-top: -0.05rem;
    text-align: right;
    font-size: 0.44rem;
    color: @danger-color-light;
    display: flex;
    justify-content:flex-end;
    align-items: center;
    .money{
        font-size: 0.48rem;
    }
    .rmb{
        font-size: 0.28rem;
    }
    .money:after{
        display: inline-block;
        content: '起';
        color: @third-text-color;
        font-size: 0.24rem;
        padding-left: 0.1rem;
    }
}
}
</style>

