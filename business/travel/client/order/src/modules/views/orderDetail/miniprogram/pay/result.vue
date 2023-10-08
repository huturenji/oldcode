<template>
    <div class="tab">
        <div class="orderSuc">
            <div class="topWrap">
                <div class="top">
                    <template v-if="paySuccess">
                        <Icon type='icon_common_success' size='1.16' class='icon'/>
                        <div class="tit">付款成功</div>
                        <div class="mt10">等待确认</div>
                    </template>
                    <template v-else-if="payCancle">
                        <Icon type='icon_common_prompt' size='1.16' class='icon icon_warn'/>
                        <div class="tit warn">付款取消</div>
                    </template>
                    <template v-else>
                        <Icon type='icon_common_prompt' size='1.16' class='icon icon_fail'/>
                        <div class="tit fail">付款失败</div>
                    </template>
                </div>
            </div>
        </div>
        <div class='btn-group'>
            <SnButton type="primary" class="submit_btn normal-btn cursorp" @click.native="toOrderDetail()">查看订单</SnButton>
            <div v-if="paySuccess" class="rightTips icon-btn cursorp" @click="toTripList"> 我的行程 </div>
        </div>
    </div>
</template>

<script>
import extendUtils from 'orderCommon/extend.js';
import requestHandler from 'orderCommon/requestHandler.js';
const Icon = ()=>import('components/icon');
const SnButton = ()=>import('components/button');
export default {
    components: {
        Icon,
        SnButton
    },
    data(){
        return {
            payState: null // 支付结果
        }
    },
    computed: {
        // 支付成功
        paySuccess(){
            return this.payState == extendUtils.MINIPROGRAM_CONFIG.MINIPROGRAM_PAYSTATE.SUCCESS
        },
        // 支付取消
        payCancle(){
            return this.payState == extendUtils.MINIPROGRAM_CONFIG.MINIPROGRAM_PAYSTATE.CANCLE
        },
        // 支付失败
        payFail(){
            return this.payState == extendUtils.MINIPROGRAM_CONFIG.MINIPROGRAM_PAYSTATE.FAIL
        }
    },
    created(){
        this.payState = SnUtils.getUserPara('payState');
        if (this.payState){
            SnUtils.setStorage(extendUtils.MINIPROGRAM_CONFIG.MINIPROGRAM_PAYSTATE_CACHEKEY, this.payState)
        }
        
    },
    methods: {
        /**
         * 前往订单详情  回退一步
         */
        toOrderDetail() {
            wx.miniProgram.navigateBack({
                delta: 1
            })
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
@import './result.less';
</style>
