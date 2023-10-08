<template>
    <div class='order_list'>
        <hotel v-if="'hotel' == getOrderType(orderInfo.orderType)"  :enableDelete='false' :enableSwiper='false'
        :hotel=orderInfo :trip=trip :isSelf='trip.isSelf' :founderName='trip.isSelf?"":(trip.founderInfo||{}).founderName' v-bind="$attrs">
            <!-- 子行程添加乘客人员的插槽 -->
            <template slot="psgList" v-if="orderInfo.psgList && orderInfo.psgList.length > 0">
                <psgList :orderInfo='orderInfo'></psgList> 
            </template>
        </hotel>
        <train v-if="'train' == getOrderType(orderInfo.orderType)"  :enableDelete='false' :enableSwiper='false'
        :train=orderInfo :trip=trip :isSelf='trip.isSelf' :founderName='trip.isSelf?"":(trip.founderInfo||{}).founderName' v-bind="$attrs">
            <!-- 子行程添加乘客人员的插槽 -->
            <template slot="psgList" v-if="orderInfo.psgList && orderInfo.psgList.length > 0">
                <psgList :orderInfo='orderInfo'></psgList> 
            </template>
        </train>
        <flight v-if="'flight' == getOrderType(orderInfo.orderType)"  :enableDelete='false' :enableSwiper='false'
        :AirLine=orderInfo :trip=trip :orderNo='orderInfo.orderNo' :isSelf='trip.isSelf' :founderName='trip.isSelf?"":(trip.founderInfo||{}).founderName' v-bind="$attrs">
            <!-- 子行程添加乘客人员的插槽 -->
            <template slot="psgList" v-if="orderInfo.psgList && orderInfo.psgList.length > 0">
                <psgList :orderInfo='orderInfo'></psgList> 
            </template>
        </flight>
    </div>
</template>

<script>
import train from './train.vue';
import hotel from './hotel.vue';
import flight from './flight.vue';
import psgList from './psgList.vue';
import extendUtils from './utils';
import {getOrderType} from './enum/excessEnum';
export default {
    components:{
        train,
        hotel,
        flight,
        psgList
    },
    props:{
        enableDelete: {
            type: Boolean,
            default: true, 
        },
        enableSwiper: {
            type: Boolean,
            default: !extendUtils.isPC() 
        },
        orderInfo:{
            type:Object,
            default(){
                return {};
            }
        },
        trip:{
            type:Object,
            default(){
                return {};
            }
        }
    },
    methods:{
        getOrderType(type){
            return getOrderType(type);
        }
    }
}
</script>

<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
.order_list{
    /deep/ .list {
        .card-shadow{
            box-shadow:0rem 0.04rem 0.30rem -0.04rem rgba(0,70,199,0.18);
            border-radius: .2rem;
            overflow: hidden;
        }
        .detailCard {
            background-color: #06C7C3;
            color: #fff;
            border-radius: .2rem;
            position: relative;
            z-index: 100;
            .content{
                
                position: relative;
                color: #fff;
            }
            .content-train{
                padding: .26rem .5rem .3rem .5rem;
            }
        
            .content-flight{
                padding: .26rem .5rem .3rem .5rem;
            }
            .content-hotel{
                padding: .26rem .5rem .3rem .5rem;
            }
        }
        .type {
            .clear;
            .card-date{
                position: relative;
                margin: .24rem 0 .32rem .4rem;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                .left{
                    padding: 0 .26rem 0 .46rem;
                    position: relative;
                    z-index: 100;
                    background-color: #eff2f5;
                    height: .52rem;
                    line-height: .52rem;
                    padding: 0 .26rem 0 .46rem;
                    border-radius: .42rem;
                    color: #333;
                    position: relative;
                    box-shadow: 0px -.04rem .56rem 0px rgba(130,131,155,0.1);
                    &::before{
                        content:"";
                        position: absolute;
                        width: .12rem;
                        height: .12rem;
                        border-radius: 50%;
                        background-color: #333;
                        top: 50%;
                        margin-top: -.06rem;
                        left: .2rem;
                    }
                }
                .week{
                    margin-left: .14rem;
                }
                
            }
            .line{
                margin: 0 auto;
                padding: 0;
                height: 100%;
                width: 1px;
                background:#f2f3f5;
            }
        }
        .full {
            position: relative;
            z-index: 100;
            /deep/ .vux-swipeout-content{
                border-radius: .2rem;
            }
            position: relative;
            
            .trainDetail{
                color: #fff;
            }
            .hotelDetail{
                color: #fff;
            }
            .flightDetail{
                color: #fff;
            }
            
            .leave{
                height: 1.02rem;
                line-height: 1.02rem;
                font-size: 16px;
                margin: 0rem .5rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px dashed @border-color-base;
                &>div{
                    display: flex;
                    align-items: center;
                    .icon_train_train{
                        fill: #fff;
                    }
                    .icon_hotel_hotel{
                        fill: #fff;
                    }
                    .icon_plane_plane{
                        fill: #fff;
                    }
                }
                .air_logo{
                    display: inline-block;
                    border-radius: 50%;
                    overflow: hidden;
                    width: .42rem;
                    height: .42rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: .12rem;
                    /deep/ .logo {
                        border-radius: 50%;
                        background-size: 100% auto;
                    }
                }
                .code{
                    display: flex;
                    align-items: center;
                    i{
                        display: flex;
                        align-items: center;
                    }
                }
                .time{
                    font-size: 15px;
                }
                        
                .icon {
                    width: .3rem;
                    height: auto;
                    margin-right: 0.1rem;
                }
                .icon.icon-car {
                    width: .36rem;
                    height: auto;
                    margin-right: 0.1rem;
                }
            }
        }
    }
}
</style>