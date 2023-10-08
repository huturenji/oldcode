<template>
<div class="hotelRoom lineBorderB">
    <div class="panel cursorp" @click="toggleShow(!isShow)">
        <div class="panel_attend">
            <div class="panel_border bbpxs" :class="{noBorder:isShow}">
                <div class="leftBg cursorp" @click.stop="showBooking(-1)"><div v-bind:style="{backgroundImage: 'url(' + changUrlToHttps(room.imageUrl) + ')'}"></div></div>
                <div class="left_box">
                    <div class="left_title name">{{room.roomName}}</div>
                    <p class="left_title tips">{{room.area}}平米/{{room.bedType}}</p>
                </div>
                <div class="money">
                    <span class="hotArea num-font">
                        <span class="little rmb">¥</span>
                        <span class="bignum">{{parseInt(room.ratePlanMinPrice) || parseInt(room.roomProducts[0].perDayPrice)}}</span>
                        <span class="black little">起</span>
                        <Icon v-if="isShow" type='icon_common_uparrow' class="iconDown" size=".24"/>
                        <Icon v-else type='icon_common_downarrow' class="iconDown" size=".24"/>
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div class="panel PlistWrap" v-show="isShow">
        <div class="panel_attend product cursorp" v-for="(product,index) in room.roomProducts" @click="showBooking(index)" :key="index">
            <div class="panel_border bbpxs">
                <div class="left_box">
                    <div class="left_title name" :class="{lowTips:0 == index}">{{product.breakfastType}}</div>
                    <p class="left_title tips">{{product.productName}} / {{product.cancelType}}</p>
                    <div class="buttonOut">
                        <span v-if="product.instantConfirmation" class="greenbutton">立即确认</span>
                    </div>
                </div>
                <div class="money">
                    <p class="hotArea">
                        <span class="little rmb">¥</span>
                        <span class="bignum num-font">{{parseInt(product.perDayPrice)}}</span>
                    </p>
                    <!-- 优惠券先行屏蔽不要删除2020-6-3 -->
                    <!-- <p class="coupon-label" v-if="!!product.CanUseCoupon&&product.CanUseCoupon.length>0">
                        {{getBestCoupon(product)}}
                    </p> -->
                </div>
                <template v-if='useTypeConfig'>
                    <div class="right_box cursorp noauth normal-btn"  v-if="useTypeConfig.isPublic(myTripModelData.hotelUseType) && !myTripModelData.haveAuth && myTripModelData.tripListLength == 0 && !myTripModelData.getAuthing" @click.stop="$emit('openApplyFun','')">出差申请</div>
                    <div class="right_box cursorp normal-btn"  v-else-if="(!myTripModelData.getAuthing || useTypeConfig.isPrivate(myTripModelData.hotelUseType)) && product.canBook" @click.stop="gotoOpenApply(index,product.canBook)">
                        <div class="title">订</div>
                        <div class="reserve">{{paymentTypeTextMap[product.paymentType]}}</div>
                    </div>
                    <div class="right_box finish cursorp" v-else-if="!myTripModelData.getAuthing || useTypeConfig.isPrivate(myTripModelData.hotelUseType)" @click.stop="gotoOpenApply(index,product.canBook)">订完</div>
                    <div class="right_box hidden cursorp" v-else></div>
                </template>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {getBestCoupon} from 'components/coupon/js/requestHandler.js';
import Icon from 'components/icon';
import hotelHandler from 'hotelHandler/hotelHandler.js'
export default {
    components: {
        Icon
    },
    props:{
        room:{
            type:Object,
            default(){
                return {
                    RoomProductInfo:[{}]
                }
            }
        },
        Breakfast:{
            type:String,
            default:'含早'
        },
        roomIndex:{
            type:Number,
            default:0
        },
        myTripModelData:{
            type:Object,
            default(){
                return {
                    'choosedTrip':'',
                    'haveAuth':false,
                    'tripListLength':0,
                    'hotelUseType': hotelHandler.USE_TYPE_ENUM.PUBLIC.name,
                    'getAuthing':true
                }
            }
        }   
    },
    data() {
        return {
            paymentTypeTextMap:{
                0:'到店付',
                1:'在线付'
            },
            roomInfo:this.room,
            isShow:false,
            // roomIndex:this.roomIndex,
            useTypeConfig: null
        }
    },
    async created() {
        this.useTypeConfig = await hotelHandler.useTypeConfig()
    },
    mounted() {
        // let _this=this;
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
        getBestCoupon(product){
            let that = this;
            return getBestCoupon(product, function(bestCoupon){
                that.$set(product, 'bestCoupon',bestCoupon);
            });
        },
        gotoOpenApply(index,canBook){
            if (!canBook){
                return
            }
            let _this=this;
            _this.$emit('openApplyFun',{roomInfo:_this.room,index:index})
        },
        toggleShow(showType){
            let _this=this;
            _this.isShow = showType;
        },
        showBooking(index){
            let _this=this;
            _this.$emit('showBooking',{roomInfo:_this.room,productIndex:index,roomIndex:_this.roomIndex})
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
.hotelRoom.lineBorderB:after{
    left: 2rem;
}
.hotelRoom{
margin-bottom: 0;
color: @text-color;
.panel{
    &.PlistWrap{
        background: @background-color;
        .panel_attend:last-child .bbpxs:after{
            display: none;
        }
    }
    background: @sub-background-color;
    .panel_attend{
        padding: 0 .3rem;
        .panel_border{
            &.noBorder.bbpxs:after{
                display: none;
            }
            padding: .4rem 0 ;
            font-size: .32rem;
            .flex-box();
            .justify-content(space-between);
            .align-items(center);
            .leftBg{
                margin-right: 0.3rem;
                width: 1.6rem;
                height: 1.6rem;
                background: url(~assets/img/hotel/empty.png) no-repeat center;
                background-size: cover;
                border-radius: 0.08rem;
                div{
                    width: 1.6rem;
                    height: 1.6rem;
                    background: url(~assets/img/hotel/empty.png) no-repeat center;
                    background-size: cover;
                    border-radius: 0.08rem;
                }
            }
            .left_box{
                .flex(1);
                .left_title {
                    font-size: .24rem;
                    color: @third-text-color;
                }
                .name{
                    color: @text-color;
                    font-size:0.3rem;
                    font-weight: bold;
                }
                .name.lowTips:after{
                    content: '低';
                    margin-left: 0.1rem;
                    color: @sub-background-color;
                    font-size: 0.22rem;
                    background: @success-color;
                    border-radius: 0.03rem;
                    line-height: 0.3rem;
                    text-align: center;
                    width: 0.3rem;
                    display: inline-block;
                    vertical-align: middle;
                    font-weight: normal;
                }
                .tips{
                    margin-top: 0.1rem;
                }
                .buttonOut{
                    .greenbutton{
                        margin-top: 0.15rem;
                        display: inline-block;
                        padding: 0 0.12rem;
                        line-height: 0.33rem;
                        color: @success-color;
                        border: 0.02rem solid @success-color;
                        text-align: center;
                        border-radius: 0.04rem;
                        font-size: 0.24rem;
                    }
                }
            }
            .money{
                .hotArea{
                    font-size: 0;
                    .iconDown{
                        fill: @third-text-color;
                    }
                }
                text-align: right;
                font-size: .48rem;
                color: @danger-color-light;
                display: flex;
                font-size: 0.24rem;
                flex-direction: column;
                justify-content: center;
                align-items: flex-end;
                padding-left: 0.1rem;
                .little{
                    font-size: 14px;
                }
                .bignum{
                    font-size: 24px;
                }
                .black{
                    font-size: 12px;
                    margin-left: 0.04rem;
                    margin-right: 0.12rem;
                    color: @placeholder-color;
                }
                .coupon-label{
                    font-size: .2rem;
                    color: @danger-color;
                    text-align: center;
                    border-radius: .04rem;
                    border: 1px solid @danger-color;
                    min-width: 1.36rem;
                    padding: 0 .08rem;
                    }
            }
            .right_box{
                margin-left: 0.2rem;
                width: 0.88rem;
                height: 0.88rem;
                background: url(~assets/img/hotel/icon_reserve.png)no-repeat top left;
                background-size: 100%;
                text-align: center;
                display: initial;
                .title{
                    font-size: 0.3rem;
                    color: @sub-background-color;
                    line-height:.5rem;
                }
                .reserve{
                    font-size: 0.24rem;
                    line-height:.42rem;
                    color: @danger-color-light;
                }
            }
            .right_box.finish{
                background: url(~assets/img/hotel/icon_overroom.png)no-repeat center;
                background-size: 100%;
                line-height: 0.88rem;
                color: @sub-background-color;
            }
            .right_box.noauth{
                height: 0.88rem;
                .linear-gra-waring();
                border-radius: 0.08rem;
                font-size: 0.3rem;
                color: @sub-background-color;
                width: 0.88rem;
                display: flex;
                align-items: center;
            }
        }
    }
    .product:first-child{
        box-shadow: 0 0.03rem 0.08rem rgba(0,0,0,0.1) inset;
    }
}
}
</style>

