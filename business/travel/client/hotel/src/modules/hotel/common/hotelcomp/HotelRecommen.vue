<template>
    <div class="recommenHotelItemWrap">
    <div class="recommenHotelItem normal-btn">
        <div class="topbgWrap">
            <div class="topbg" v-bind:style="{backgroundImage: 'url(' + changUrlToHttps(hotel.defaultPicture) + ')'}"></div>
        </div>
        <div class="iteminfoWrap">
            <div class="itemName">{{hotel.hotelName}}</div>
            <div class="recommenInfoWrap">
                <span class="left" v-if='0!=hotel.commentScorer||".0"!=hotel.commentScorer'>{{returnFloat1(hotel.commentScorer/10)}}<span>分</span></span>
                <span class="left" v-else><span>暂无评分</span></span>
                <span class="right">
                    <span>距离{{distance}}</span>
                </span>
            </div>
            <div class="moneyWrap">
                <span class="left">￥</span>
                <span class="middle">{{hotel.minPrice}}</span>
                <span class="right">起</span>
                <!-- <span class="coupon-label" v-if="!!hotel.CanUseCoupon&&hotel.CanUseCoupon.length>0">
                    {{getBestCoupon()}}
                </span> -->
                <!-- <span class="coupon-label">
                    满200减20
                </span> -->
            </div>
        </div>
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
        listType:{
            type:String,
            default:''
        }
    },
    data() {
        return {
            startTextMap:{0:'其他',1:'快捷',2:'经济',3:'舒适',4:'高档',5:'豪华'},
            distance:'--公里'
            // listType:this.listType
        }
    },
    created() {
        var _this = this;
        if (!!_this.hotel.distance && parseFloat(_this.hotel.distance) > 0){
            let distance = _this.hotel.distance;
            let temps = parseInt(distance);
            if (temps<1000){
                _this.distance = parseInt(temps/10)*10+'米';
            } else {
                _this.distance = parseInt(distance/100)/10+'公里';
            }                
        }
    },
    mounted() {
    },
    computed: {
    },
    watch:{
    },
    methods: {
        /**
             * 艺龙图片使用https
             */ 
        changUrlToHttps(url){
            return hotelHandler.changUrlToHttps(url);
        },
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
.recommenHotelItemWrap{
    display: inline-block;
    width: 50%;
    padding: 0 0.1rem;
    padding-bottom: 0.2rem;
    background: @sub-background-color;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    .recommenHotelItem{
        .topbgWrap{
            width: 100%;
            height: 2.27rem;
            background: url(~assets/img/hotel/empty.png) no-repeat center;
            background-size: cover;
            .topbg{
                width: 100%;
                height: 2.27rem;
                background: url(~assets/img/hotel/empty.png) no-repeat center;
                background-size: cover;
            }
        }
        .iteminfoWrap{
            border: 1px solid @border-color-base;
            padding: 0.13rem 0.3rem;
            .itemName{
                padding: 0.15rem 0;
                font-size: 0.32rem;
                font-weight: bold;
                color: @text-color;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .recommenInfoWrap{  
                position: relative;
                display: -ms-flexbox;
                display: -webkit-box;
                display: -webkit-flex;
                display: flex; 
                -ms-flex-align: center;
                -webkit-align-items: center;
                -moz-align-items: center;
                align-items: center;
                .left{
                    font-size: 0.36rem;
                    color: @theme-color;  
                    width: 1.2rem; 
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    span{
                        font-weight: normal;
                        font-size: 0.24rem;
                    }
                }
                .right{
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    font-size: 0.26rem;
                    color: @third-text-color;
                    margin-left: 0.05rem;
                }
            }
            .moneyWrap{
                line-height: 0.5rem;
                color: @danger-color-light;
                .left{
                    font-size: 0.3rem;
                }
                .middle{
                    font-size: 0.42rem;
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
</style>

