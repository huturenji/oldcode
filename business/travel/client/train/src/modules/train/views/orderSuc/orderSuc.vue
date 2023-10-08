<template>
    <div>
        <div class="wrap">
            <div class="orderSuc">
                <div class="topWrap">
                    <div class="top">
                        <icon type="icon_common_success" size="1.15"/>
                        <div class="tit">付款成功</div>
                        <div class="text">预计30分钟内出票，请耐心等待</div>
                        <div class="tips">{{tipMsg}}</div>
                    </div>
                </div>
            </div>
            <div class="submit_btn cursorp" @click="toOrderDetail"> 查看订单 </div>
            <div class="rightTips cursorp" @click="toTripList"> 我的行程 </div>
        </div>
        <HotelMarketing
            :pageFrom='pageFrom'
            :orderNo='orderNo'
            :providerType='providerType'
            :endCity='endCity'
            :arriveTime='arriveTime'
            :departTime='departTime'
            :useType='useType'
            :tripNo='tripNo'
        >
        </HotelMarketing>
    </div>
</template>

<script>
    import icon from "components/icon/index.vue";
    import trainHandler from 'trainHandler/common/lib/trainHandler.js';
    import HotelMarketing from 'components/hotelrecommendation/HotelMarketing.vue'
    export default {
        components: {
            HotelMarketing,
            icon
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
        data: function () {
            return {
                tipMsg:'',
            }
        },
        methods: {
            //判断供应商方法 如果供应商为同程即ProviderType==4 即tipMsg为''
            chargeProduct(){
                if(this.providerType=='4'){
                    this.tipMsg='';
                }else{
                    this.tipMsg='出票成功将会以短信方式发送至您的手机，请您注意查收';
                }
            },
            toOrderDetail() {
                this.$emit('toOrderDetail')
            },
            toTripList() {
                trainHandler.openPageLib('trip/index.html#/')
            },
        }
    }
</script>
<style scoped lang="less">
@import '~themes/default/styles/orderSuc.less';  
</style>
