<!-- 支付页面 -->
<template>
    <view>
        <uni-popup ref="resultPopup" type="bottom" class='result-popup' @change='onResultPopChange'>
            <view class="pay-result-container">
                <view class='content'>
                    <view class='top'>
                        <view class='icon' :class="panelText.class">
                            <img :src='panelText.img'/>
                        </view>
                        <view class="label">{{panelText.body}}</view>
                        <view v-if="panelText.tip" class='info'>{{panelText.tip}}</view>
                    </view>
                    <slot name='present'></slot>
                    <slot name='btnGroup'></slot>
                </view>
            </view>
        </uni-popup>
    </view>
</template>
<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
    components: {uniPopup},
    props: {
        panelText: {
            type: Object,
            require: true
        }
    },
    methods: {
        open(){
            this.$refs.resultPopup.open();
        },
        close(){
            this.$refs.resultPopup.close();
        },
        onResultPopChange(e){
            this.$emit('change', e.show);
        }
    }
}
</script>
<style lang="scss" scoped>
.pay-result-container {
    position: relative;
    height: 100%;
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

    
            img{
                width: 100%;
                height: 100%;
            }

            &.success{
                color: #23cda7;
            }

            &.failed{
                color: #ff4e3a;
            }

            &.loading-icon{
                border-radius: 60rpx;
                background-color: #F6F9FD;
                img{
                    animation: cricelLoading 1s steps(12, end) infinite;
                    width: 64rpx;
                    height: 64rpx;
                }
            }
        }
        .label{
            color: #222;
            font-size: 32rpx;
            font-weight: bold;
            margin-top: 56rpx;
        }
        .info{
            font-size: 28rpx;
            margin-top: 8rpx;
        }
    }

    @-webkit-keyframes cricelLoading {
        0% {
            transform: rotate3d(0,0,1,0deg);
        }
        100% {
            transform: rotate3d(0,0,1,360deg);
        }
        }
        @keyframes cricelLoading {
        0% {
            transform: rotate3d(0,0,1,0deg);
        }
        100% {
            transform: rotate3d(0,0,1,360deg);
        }
    }
}

.result-popup{
    ::v-deep uni-view.uni-transition{
        top: 0;
    }
    ::v-deep .uni-popup__wrapper-box{
        bottom: 0;
        height: 100%;
        padding: 0;
    }
}
</style>