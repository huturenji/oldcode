<template>
    <view class="agreement">
        <uni-popup ref="agreementpopup" @touchmove.stop.prevent="moveHandle">
            <!-- 主体内容 -->
            <view class="agreement-content">
              <view class="agreement-title">
                <image :src="'./static/shared/common/icon/icon_fwh_mianzexieyi.svg'"></image>
                <text>免责协议</text>
              </view>
              <scroll-view class="agreement-text" scroll-y="true">
                 <text>{{content}}</text>
              </scroll-view>
              <view class="agreement-btn">
                <button @click="cancelClick" class="cancelStyle">{{cancelText}}</button>
                <button @click="confirmClick" class="confirmStyle">{{confirmText}}</button>
              </view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
export default {
    name: 'Protocol',
    data(){
        return {
          
        }
    },
    props: {
        //协议内容
        content: {
            type: String,
            default: ''
        },
        //取消按钮
        cancelText: {
            type:String,
            default:''
        },
        //确定按钮
        confirmText: {
            type:String,
            default:""
        }
    },
    mounted(){
        this.open();
    },
    methods: {
        moveHandle(){
            return true;
        },
        open(){
            this.$refs.agreementpopup.open("center");
        },
        cancelClick() {
            this.$emit('cancel')
            this.$refs.agreementpopup.close();
        },
        confirmClick() {
            this.$emit('confirm')
            this.$refs.agreementpopup.close();
        }
    }
};
</script>

<style lang="scss" scoped>
.agreement{
    .agreement-content{
        width: 590rpx;
        background: #ffffff;
        border-radius: 32rpx;
        padding: 40rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .agreement-title{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            image{
                width: 54rpx;
                height: 62rpx;
            }
            text{
                height: 44rpx;
                font-size: 32rpx;
                
                font-weight: 600;
                text-align: center;
                color: #222222;
                line-height: 44rpx;
                margin-top: 8rpx;
            }
        }
        .agreement-text{
            max-height: 360rpx;
            font-size: 28rpx;
            
            font-weight: 400;
            text-align: left;
            color: #222222;
            line-height: 40rpx;
            margin: 24rpx 0rpx 56rpx 0rpx;
            word-break: break-all;
        }
        .agreement-btn{
            width: 100%;
            display: flex;
            justify-content: space-between;
            font-weight: 600;
            
            font-size: 30rpx;
            button{
                width: 236rpx;
                height: 72rpx;
                border-radius: 38rpx;
                padding: 20rpx 40rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0rpx;
                &::after {
                    border: none;
                }
            }
            .cancelStyle{
                color: var(--tagColor);
                border: 2rpx solid var(--tagColor);
                background: #fff;
            }
            .confirmStyle{
                color: #ffffff;
                background: var(--tagColor);
            }   
        }
    }
}
</style>