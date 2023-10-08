<!-- 订单跟踪页面 -->
<template>
    <div class="orderTrack-packageInfor">
        <div @click="gotoExpressTrack(item)" v-for="(item, index) in packageList" :key="index">
            <div class="title">包裹{{index+1}}</div>
            <div class="content" v-if="showMsg(item)">
                <div class="icon_part"><Icon type="icon_mall_songhuo2" size=".32"/></div>
                <div class="detail_part">
                    <div>
                        <span v-if="!!(getRemarkAndTime(item).remark)" v-html="formatedDomStr(getRemarkAndTime(item).remark, getRemarkAndTime(item).phone)">{{getRemarkAndTime(item).remark}}</span>
                        
                        <!-- <span v-if="!!(getRemarkAndTime(item).name)" class="bold">{{getRemarkAndTime(item).name}}</span>
                        <span v-if="!!(getRemarkAndTime(item).phone)" class="bold"> 电话:{{getRemarkAndTime(item).phone}}</span>                        -->
                    </div>
                    <i><Icon type="icon_common_rightarrow" size=".24"/></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import orderMixin from '../orderCommon/mixin';
import Icon from 'common/components/base/Icon';
import orderHandler from 'common/lib/requestHandler/orderHandler.js';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
export default {
    components: {
        Icon
    },
    mixins: [tChatEventMixin, orderMixin], 
    data() {
        return {
            orderNo: '', //订单no
            packageList: [], //包裹的list
        };
    },
    created(){
        this.init();
    },
    methods: {

        //初始化包裹信息
        init(){
            let that = this;
            this.orderNo = that.$route.query.orderNo;
            let param = {
                orderNo: this.orderNo
            }
            that.$loading.show();
            orderHandler.getOrderExpressRouteInfos(param).then( res => {
                that.$loading.hide()
                if(res.resultCode == 0){
                    that.packageList = res.result.packageList;
                }
                
            }).catch(e => {
                that.$loading.hide()
                console.log(e)
            });
        },

        /** 
        * 是否显示msg
        */
        showMsg(item){
            let flag = false;
            if(!!item.deliveryInfo.routeInfos && item.deliveryInfo.routeInfos.length > 0 && !!item.deliveryInfo.routeInfos[0].remarkAndTime && !!item.deliveryInfo.routeInfos[0].remarkAndTime.length > 0){
                flag = true;
            }
            return flag;
        },

        /** 
         * 获取物流时间和详情的信息
        */
        getRemarkAndTime(item){
            try{
                return item.deliveryInfo.routeInfos[0].remarkAndTime[0]
            }catch(e){
                return {}
            }
        },

        /**
         * 跳转：物流跟踪
         */
        gotoExpressTrack(item){
            this.$router.push({
                path: '/expressTrack',
                query: {
                    item: JSON.stringify(item),
                    orderNo: this.orderNo
                }
            })
        },
       
        /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
            this.$router.back();
        },

    }
};
</script>
<style scoped lang="less">
@import "~themes/default/styles/order/orderList/packageInfor.less";
</style>