<template>
    <div class="tab">
        <div class="orderSuc">
            <div class="topWrap">
                <div class="top">
                    <Icon type='icon_common_success' size='1.16' class='icon'/>
                    <div class="tit">付款成功！</div>
                    <div class="mt10">等待确认</div>
                    <div class="text">稍后您将收到酒店确认短信</div>
                </div>
            </div>
        </div>
        <div class='btn-group'>
            <SnButton type="primary" class="submit_btn normal-btn cursorp" @click.native="toOrderDetail()">查看订单</SnButton>
            <div class="rightTips icon-btn cursorp" @click="toTripList"> 我的行程 </div>
        </div>
    </div>
</template>

<script>
// import extendUtils from 'orderCommon/extend.js';
import requestHandler from 'orderCommon/requestHandler.js';
const Icon = ()=>import('components/icon');
const SnButton = ()=>import('components/button');
export default {
    components: {
        Icon,
        SnButton
    },
    props: [
        'orderNo'
    ],
    methods: {
        /**
         * 前往订单详情
         */
        toOrderDetail() {
            this.$emit('toOrderDetail')
        },
        /**
         * 前往我的行程
         */
        toTripList() {
            requestHandler.openPage('trip/index.html#/')
        }
    }
}
</script>
<style scoped lang="less">
    @import './orderSuc.less';
</style>
