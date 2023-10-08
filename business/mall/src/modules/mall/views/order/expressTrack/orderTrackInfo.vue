<template>
    <section class="trackInfo-wrap" >
        <emptyPage v-if="trackInfo.length == 0" tips='暂无物流信息'/>
        <ul  v-else   class="track_shipflow">
            <li class="track_shipflow_item" 
                v-for="(item,index) in trackInfo" 
                :key = 'index'
                :class="index == 0?'cur':''"
                >
                <Icon v-if="item.state!='' && item.state!= undefined" :type='"order_track_type_"+item.state' size='.4' class="type_dot_status"></Icon>
                <div class="track_shipflow_item_msg">
                    <i v-if="!(item.state!='' && item.state!= undefined)"  class='type_dot'></i>
                    <div class='content'>
                        <p class="order_status" v-show="item.state!=undefined">{{transformStatus(item.state,'text')}}</p>
                        <p class="track_shipflow_item_msg_text">
                            <span v-html="formatedDomStr(item.remarkAndTime.remark, item.remarkAndTime.phone)"></span> 
                        </p>
                        <p class="track_shipflow_item_msg_time">{{item.remarkAndTime.time?new Date(item.remarkAndTime.time*1).format('yyyy-MM-dd HH:mm:ss'):''}}</p>
                    </div>
                </div>
            </li>
        </ul>
    </section>
</template>
<script>

import orderMixin from '../orderCommon/mixin';
import Icon from 'common/components/base/Icon';
const emptyPage = ()=>import('commonComp/base/emptyPage.vue');
export default {
    mixins: [orderMixin],
    components:{
        emptyPage,Icon
    },
    props:{
        trackInfo:{
            type:Array,
            required: true
        }
    },
    data() {
        return {
            showpage:false,
            orderStatus:[
                {
                    state:1,
                    text:'已下单',
                },
                {
                    state:2,
                    text:'包裹处理中',
                },
                {
                    state:3,
                    text:'运输中',
                },
                {
                    state:4,
                    text:'派送中',
                },
                {
                    state:5,
                    text:'已签收',
                },
            ],
        };
    },
    mounted(){

    },
    methods: {
        /*
         * 从订单状态表中获取对应状态的其他信息
         * @state 订单的物流状态
         * @key 需要根据状态取得其他信息的key
        */
        transformStatus(state,key){
            if(state!='' || state != undefined ){
                let obj = this.orderStatus.filter(item => item.state == state);
                if(key&&obj.length){
                    return obj[0][key];
                }
            }
            return '';
        },

    }
};
</script>
<style scoped lang="less">
@import "~themes/default/styles/order/orderList/orderTrackInfo.less";
</style>