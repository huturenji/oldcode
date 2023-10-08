<template>
    <div class="content">
        <slot name='title' v-if='showTripCard'/>
        <!-- 正常的显示行程列表的页面 -->
        <div class="trip-container" v-if='showTripCard'>
            <div class="trip-list-container">
                <div ref="li" class="tripObj">
                    <div v-if='tripObj.cause' class="title">
                        <!-- 左侧的title -->
                        <div  class="title_content">
                            <span v-if='tripObj.cause'>{{tripObj.cause}}</span>
                            <span v-if="tripObj.tripStatusEnum == 'APPLY'" class="applying">[审批中]</span>
                        </div> 
                    </div>
                    <div class="position" :class="{flowId: tripObj.flowId}">
                        <!-- 此时说明是用车不是出差申请过来的 因私的商务用车 -->
                        <div v-if="(tripObj.orderDetailList.length > 0) && (tripObj.orderDetailList[0].orderType == '6') && (tripObj.departCityName == tripObj.arriveCityName)">
                            <span v-if="!!tripObj.departCityName">{{tripObj.departCityName}}</span> 
                        </div> 
                        <div v-else>
                            <template v-if="!!tripObj.departCityName || !!tripObj.arriveCityName">
                                <span v-if="tripObj.flowId" class="position-title">地点：</span>    
                                <span v-if="!!tripObj.departCityName">{{tripObj.departCityName}}</span>
                                <span v-if="!tripObj.flowId">前往</span>
                                <span v-else-if="!!tripObj.departCityName && !!tripObj.arriveCityName && !!tripObj.flowId">-</span>
                                <span v-if='!!tripObj.arriveCityName'>{{tripObj.arriveCityName}}</span>
                                <span v-if="tripObj.flowId && ENABLE_USE_TYPE" class="for-public">因公</span>
                            </template>
                        </div> 
                    </div>

                    <!-- 该行程由谁帮您预订dom -->
                    <div v-if='!tripObj.isSelf && (tripObj.founderInfo||{}).founderName' class="is_self">
                        <span class='clr_red'>
                            <i><icon type="icon_common_prompt" size=".28"/></i>
                            该行程由<span class="name">{{(tripObj.founderInfo||{}).founderName}}</span>为您预订
                        </span>
                    </div>

                    <div v-if='tripObj.orderDetailList.length>0' class="trip-card-list">
                        <order :orderInfo="tripObj.orderDetail" :trip="trip" :enableDelete='false' :enableSwiper='false'></order>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import icon from 'components/icon';
import requestHandler from "custCommon/requestHandler.js";
import extendUtils from "custCommon/extend.js";
import order from 'components/tripCard/order.vue'
import {
    TransferDom
} from 'vux';
export default {
    directives: {TransferDom},
    components: {
        order,
        icon
    },
    data: function () {
        return Object.assign(extendUtils.stateManager.setData([], null), {
            tripObj: [],
            ENABLE_USE_TYPE: extendUtils.ENABLE_USE_TYPE !== false//是否开启因公因私功能
        }) 
    },
    created: function () {
        let that = this;
        this.getTripList();
        extendUtils.winCloseCbSingleton.register(sinosdk.sino.onChildWindowClose, ()=>{
            that.getTripList();
        })
    },  
    computed: {
        showTripCard(){
            return (this.tripObj.orderDetailList || []).length > 0;
        }
    },
    methods: {
        /**
       * 查询行程列表
       * queryType  0标识历史  1标识正常行程
       */
        getTripList() {
            let param = {
                queryType: 1,//1代表正常的 0代表历史行程
                pageIndex: 1,
                pageSize: 100,
                orderType: [0]
            }
            
            //获取uaId的相关信息
            let uaId = requestHandler.uaId;//该方法继承的base.js里面的方法
            if (!!uaId){
                param = Object.assign({}, param, {
                    uaId: uaId
                });
            }
            requestHandler.getTripList(param).then((res) => {
                if (0 == res.resultCode && res.result && res.result.tripList){
                    //找出第一个有订单的数据
                    let tripOrderList = []
                    let tripList = res.result.tripList.filter(_trip => (_trip.orderDetailList || []).length > 0);//只保留有订单的行程
                    //合并订单到一个数组
                    tripList.forEach(_trip => {
                        _trip.orderDetailList.forEach(_order => {
                            _order.tripNo = _trip.tripNo;
                        })
                        tripOrderList.push(..._trip.orderDetailList)
                    })
                    //排序获得最近的订单
                    if (tripOrderList.length > 1){
                        //1. 只显示未开始的
                        //2. 显示最近的订单，如果机票和酒店订单是同一天，则优先展示机票
                        const getCompareTime = tripOrder => {
                            if (tripOrder.orderType == '1'){ //机票
                                return new Date(tripOrder.beginDate.replace(/-/g, '/') + ' ' + tripOrder.beginTime).getTime()
                            } else if (tripOrder.orderType == '2'){ //酒店
                                return new Date(tripOrder.beginDate.replace(/-/g, '/')).getTime()
                            }
                        }
                        tripOrderList = tripOrderList.filter(orderDetail => {
                            let todayTime = 0;
                            let beginTime = 0;
                            if (orderDetail.orderType == '2'){
                                todayTime = new Date(new Date().format('yyyy/MM/dd')).getTime();
                                beginTime = new Date(orderDetail.beginDate).getTime();
                                return todayTime <= beginTime
                            }
                            todayTime = new Date().getTime();
                            beginTime = new Date(orderDetail.beginDate+' '+orderDetail.beginTime).getTime();
                            return todayTime < beginTime
                            
                        })
                            .sort((a, b) => {
                                if (a.orderType != b.orderType && a.beginDate == b.beginDate){
                                    return a.orderType == 1 ? -1 : 1; 
                                }
                                return getCompareTime(a) - getCompareTime(b)
                            
                            })
                    }
                    if (tripList.length > 0 && tripOrderList.length > 0){
                        let orderDetail = tripOrderList[0];
                        let trip = tripList.find(_trip => _trip.tripNo == orderDetail.tripNo)
                        trip.isSelf = true;
                        trip.orderDetail = orderDetail
                        if (trip.userId!=(trip.founderInfo || {}).founderUserId){
                            trip.isSelf = false;
                        }
    
                        this.tripObj = trip;
                    }

                }
            }).catch(e => {
                console.error(e)
                console.log("从服务器获取行程失败");
            });
        },

        /**
         * 时间转换为年月
         * @param {Object} date  时间
         */
        handleDate(date) {
            return extendUtils.handleDate(date);
        }
    }
}
</script>
<style lang='less' scoped>
@import '~themes/default/styles/componets/trip/index.less';
</style>