<template>
    <view class="pay-result-container">
        <view class='content'>
            <view class='top'>
                <view class='icon'>
                    <img :src='panelText.img' />
                </view>
                <view class='tips'>{{panelText.tips}}</view>
                <view class='info'>{{panelText.info}}</view>
            </view>
            <view v-if="showBtn && panelText.isTogetherBuy" class="together_buy">
                    <view class="btn_share_buy cursorp" @click='goShare'>{{panelText.btnText2}}</view>
                    <view class="btn_view_order cursorp" @click='toOrderDetail'>{{panelText.btnText}}</view>
                </view>
            <view class="btn cursorp" v-else-if="showBtn" @click='toOrderDetail'>{{panelText.btnText}}</view>  
            
            <template v-if='showFeatherBtn'>
                <view class="present">
                    <!-- 鹅毛情支付成功分享微信好友收礼的人的时候，选择的礼物卡片列表 -->
                    <presentCard ref="presentCard" @choose="choose" type="zero"/>
                </view>         
                <view class="feather-btn">
                    <btnFactory :btnInfo="{ type: 'weixin' }" :info="giftInfo" :otherProps="{ choosedCardIndex }"></btnFactory>
                    <btnFactory :btnInfo="{ type: 'bizmate' }" :info="giftInfo" :otherProps="{ choosedCardIndex }"></btnFactory>
                </view>
            </template>
        </view>
    </view>
</template>

<script>
import btnFactory from "@/components/button/btnFactory.vue";
import presentCard from '@/components/gift/presentCard'
export default {
    props: {
        panelText: {
            type: Object,
            require: true
        }
    },
    components: { btnFactory, presentCard},
    data(){
        return {
            giftInfo: {
                featherId: this.$Route.query.featherId
            },
            choosedCardIndex: 0 //当前选择的图片封面
        }
    },
    computed:{
        showBtn(){
            return this.panelText.type=='NORMAL' || this.panelText.type=='VOUCHER'
        },
        showFeatherBtn(){
            return this.panelText.type=='FEATHER'
        }
    },
    methods: {
        choose(index){
            this.choosedCardIndex = index;
        },
        async toOrderDetail(){
            let url = `/pages/order/list?state=0`
            if (this.h5PayBack){
                url += `&redirectTo=${encodeURIComponent('/')}`
            }
            uni.redirectTo({
                url: url
            })
        },
        /**
         * 邀请朋友一起买
         */
        goShare(){
            this.$emit('goShare')        
        }      
    }
}
</script>

<style lang="scss" scoped>
    .pay-result-container{
        width: 750rpx;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
        background: #fff;

        .content{
            height: 100%;
            display: flex;
            flex-direction: column;
            text-align: center;

            .top{
                margin-top: calc(var(--titleBarFillHeight, 0px) + 128rpx);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            .icon{
                display: flex;
                align-items: center;
                justify-content: center;
                width: 120rpx;
                height: 120rpx;
            }

            .img{
                width: 100%;
                height: 100%;
            }
            .tips{
                width: 100%;
                color: #222;
                font-size: 32rpx;
                font-weight: bold;
                margin-top: 56rpx;
                text-align: center;
            }
            .info{
                margin-top: 28rpx;
                padding: 0 100rpx;
                font-size: 28rpx;
                color: #999;
            }
        }

        .btn{
            position: absolute;
            left: 30rpx;
            right: 30rpx;
            top: 50%;
            transform: translateY(-50%);
            height: 88rpx;
            line-height: 88rpx;
            font-size: 30rpx;
            text-align: center;
            border-radius: 40rpx;
            color: var(--payendBtntxtcolor1);
            background: var(--payendBtnbgcolor1);                
        }
        .feather-btn{
            padding: 80rpx 20rpx 0 20rpx;
            flex: 1;
            display: flex;
            justify-content: space-between;
            ::v-deep .btnFactory{
                flex: 1
            }
            ::v-deep .btn-weixin{
                width: 96%;
                margin: 0 auto !important;
                text-align: center;
                height: 80rpx;
                line-height: 80rpx;
                border-radius: 20rpx;
                font-size: 30rpx;
                font-weight: bold;
                cursor: pointer;
                margin: 0;
                background: #fff;
                color: #f30300;
                border: 2rpx solid #f30300;
            }
            ::v-deep .btn-bizmate{
                width: 96%;
                margin: 0 auto !important;
                text-align: center;
                height: 80rpx;
                line-height: 80rpx;
                border-radius: 20rpx;
                font-size: 30rpx;
                font-weight: bold;
                cursor: pointer;
                margin: 0;
            }
        }
        .together_buy{
            padding: 80rpx 20rpx 0 20rpx;
            display: flex;
            justify-content: space-between;
            height: 160rpx;
            .btn_share_buy{
                width: 96%;
                text-align: center;
                height: 80rpx;
                line-height: 80rpx;
                border-radius: 40rpx;
                font-size: 30rpx;
                font-weight: bold;
                cursor: pointer;
                margin: 0 6rpx;
                background: var(--payendBtnbgcolor2);
                color: var(--payendBtntxtcolor2);
                border: 2rpx solid var(--payendBtntxtcolor2);
            }
            .btn_view_order{
                padding: 0 34rpx;
                text-align: center;
                color: var(--payendBtntxtcolor3);
                background: var(--payendBtnbgcolor3);    
                width: 96%;
                height: 80rpx;
                line-height: 80rpx;
                border-radius: 40rpx;
                font-size: 30rpx;
                font-weight: bold;
                cursor: pointer;
                margin: 0 6rpx;
            }
        }    
    }
    .present{
        margin-top: 80rpx;
    }
</style>