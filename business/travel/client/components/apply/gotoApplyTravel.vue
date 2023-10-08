<template>
      <div class="GotoApplyTravel">
        <div class="ApplyTraveltips">{{tips}}</div>
        <div class="ApplyTravelfooter cursorp" @click="toTravelReq">
          {{buttonText}}
        </div>
        <div v-if="havePersonalPay" class="ApplyTravellink cursorp" @click="$emit('showPersonalPay','')"><i></i> 个人支付</div>
      </div>
</template>
<script>
import gotoApplyTravelHandler from './js/gotoApplyTravelHandler.js';
export default {
    directives:{
    },
    components:{
    },
    props:{
        tips:{
            type:String,
            default: '抱歉，未发现有效出差申请，无法提交因公出行订单'
        },
        buttonText:{
            type:String,
            default: '发起出差申请'
        },
        havePersonalPay:{
            type:Boolean,
            default: false
        }
    },
    data() {
        return {
            appplyAddress:''//去出差的地址
        };
    },
    created(){
    },
    mounted(){
    },
    methods:{
        /**
             * 打开审批申请页面
             */
        toTravelReq(){
            let that = this;
            sinosdk.sino.overwriteWindowopen();
            gotoApplyTravelHandler.getApplyTravelUrl({channelId:gotoApplyTravelHandler.channelId}).then((res) => {
                if (!!res.result.approveTravelUrl) {
                    that.appplyAddress = res.result.approveTravelUrl;
                }
                if (!!that.appplyAddress && '' != that.appplyAddress){
                    gotoApplyTravelHandler.handlerOpenPage(that.appplyAddress);
                } else {
                    gotoApplyTravelHandler.showToast('还未设置出差申请地址，请前往运营后台设置');
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }
}
</script>
<style scoped lang="less">
@import '~styles/core/common.less';
.GotoApplyTravel {
    text-align: center;
    .ApplyTraveltips {
        background: url(./img/icon_warning.png) no-repeat center top 1.39rem;
        background-size: 1.2rem;
        color: @third-text-color;
        font-size: 0.28rem;
        padding: 2.95rem 0.3rem 1.2rem 0.3rem;
        text-align: center;
    }
    .ApplyTravelfooter {
        display: block;
        color: @sub-background-color;
        font-size: .34rem;
        line-height: .9rem;
        margin: .3rem;
        border-radius: .1rem;
        background: @theme-color;
        text-align: center;
        &:active{
            box-shadow: 100rem 100rem 0 rgba(0,0,0,0.1) inset;
        }
    }
    .ApplyTravellink {
        text-align: center;
        color: @theme-color;
        font-size: 0.28rem;
        cursor: pointer;
        &:active{
            box-shadow: 100rem 100rem 0 rgba(0,0,0,0.1) inset;
        }
    }


}
</style>

