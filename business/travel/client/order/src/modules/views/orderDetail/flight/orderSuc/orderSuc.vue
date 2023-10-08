<template>
    <div>
        <div class="tab">
            <div class="orderSuc">
                <div class="topWrap">
                    <div class="top">
                        <Icon type='icon_common_success' size='1.16' class='icon'/>
                        <div class="tit">付款成功</div>
                        <div class="mt10">预计30分钟内出票，请耐心等待</div>
                        <div class="text">出票成功将会以短信方式发送至您的手机，请您注意查收</div>
                    </div>
                </div>
            </div>
            <div class='btn-group'>
                <SnButton type="primary" class="submit_btn normal-btn cursorp" @click.native="toOrderDetail()">查看订单</SnButton>
                <div class="rightTips icon-btn cursorp" @click="openTrip"> 我的行程 </div>
            </div>
        </div>

        <HotelMarketing
            :orderNo='orderNo'
            :providerType='providerType'
            :endCity='endCity'
            :arriveTime='arriveTime'
            :departTime='departTime'
            :useType='useType'
            :tripNo='tripNo'
            :pageFrom='pageFrom'
        >
        </HotelMarketing>
    </div>
</template>

<script>
import requestHandler from 'orderCommon/requestHandler.js';
import HotelMarketing from 'components/hotelrecommendation/HotelMarketing.vue'
const Icon = ()=>import('components/icon');
const SnButton = ()=>import('components/button');
export default {
    components: {
        HotelMarketing,
        Icon,
        SnButton
    },
    props: [
        'pageFrom',
        'orderNo',
        'providerType',
        'endCity',
        'arriveTime',
        'departTime',
        'useType',
        'tripNo'
    ],
    methods: {
        toOrderDetail() {
            this.$emit('toOrderDetail')
        },
        openTrip() {
            requestHandler.openPage('trip/index.html#/')
        }
    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/orderDetail/flight/orderSuc.less';
</style>
