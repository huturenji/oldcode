<template>
    <div class='order_list'>
        <hotel v-if="'hotel' == getOrderType(orderInfo.orderType)" :hotel=orderInfo :trip=trip :isSelf='trip.isSelf' :founderName='trip.isSelf?"":(trip.founderInfo||{}).founderName' v-bind="$attrs">
            <!-- 子行程添加乘客人员的插槽 -->
            <template slot="psgList" v-if="orderInfo.psgList && orderInfo.psgList.length > 0">
                <psgList :orderInfo='orderInfo'></psgList> 
            </template>
        </hotel>
        <train v-if="'train' == getOrderType(orderInfo.orderType)" :train=orderInfo :trip=trip :isSelf='trip.isSelf' :founderName='trip.isSelf?"":(trip.founderInfo||{}).founderName' v-bind="$attrs">
            <!-- 子行程添加乘客人员的插槽 -->
            <template slot="psgList" v-if="orderInfo.psgList && orderInfo.psgList.length > 0">
                <psgList :orderInfo='orderInfo'></psgList> 
            </template>
        </train>
        <flight v-if="'flight' == getOrderType(orderInfo.orderType)" :AirLine=orderInfo :trip=trip :orderNo='orderInfo.orderNo' :isSelf='trip.isSelf' :founderName='trip.isSelf?"":(trip.founderInfo||{}).founderName' v-bind="$attrs">
            <!-- 子行程添加乘客人员的插槽 -->
            <template slot="psgList" v-if="orderInfo.psgList && orderInfo.psgList.length > 0">
                <psgList :orderInfo='orderInfo'></psgList> 
            </template>
        </flight>
        <car v-if="'car' == getOrderType(orderInfo.orderType)" :car=orderInfo :trip=trip :isSelf='trip.isSelf' :founderName='trip.isSelf?"":(trip.founderInfo||{}).founderName' v-bind="$attrs">
        </car>
    </div>
</template>

<script>
import train from './train.vue';
import hotel from './hotel.vue';
import flight from './flight.vue';
import car from './car.vue';
import psgList from './psgList.vue';
import {getOrderType} from '../enum/excessEnum';
export default {
    components:{
        train,
        hotel,
        flight,
        car,
        psgList
    },
    props:{
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

</style>