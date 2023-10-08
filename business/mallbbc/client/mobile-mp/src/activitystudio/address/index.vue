<template>
    <view class="address">
        <view>
            <view class="row b-b">
                <text class="tit">联系人<text class="redTxt">*</text></text>
                <input class="input" maxlength='10' type="text" v-model.trim="addressData.memberName" placeholder="请输入收货人姓名"
                placeholder-class="placeholder" :disabled="!showBtn" />
            </view>
            <view class="row b-b">
                <text class="tit">联系电话<text class="redTxt">*</text></text>
                <input class="input" type="text" @input="trimFun" v-model="addressData.telMobile" placeholder="请输入手机号"
                placeholder-class="placeholder" :disabled="!showBtn" />
            </view>
            <view class="row b-b textareaRow">
                <text class="tit">详细地址<text class="redTxt">*</text></text>
                <textarea class="textarea" type="text" v-model.trim="addressData.detailAddress" placeholder="请输入详细地址,建议5～60字" maxlength='60'
                placeholder-class="placeholder" :disabled="!showBtn" />
            </view>
        </view>
        <view class="submit" v-if="showBtn">
            <view @click="submitAddress">提交地址领取</view>
        </view>
    </view>
</template>

<script>
import { redeem, getPrizeDetail } from '@/activitystudio/common/lib/handler.js'
import { checkTel } from '@/utils/common.js'

export default {
    data() {
        return {
            winCertificate: '',
            activityId: '',
            showBtn: false,
            addressData: {
                memberName: '',
                telMobile: '',
                detailAddress: ''
            }
        }
    },
    onLoad({ winCertificate, activityId }) {
        this.winCertificate = winCertificate
        this.activityId = activityId
    },
    onShow() {
        this.getDetail()
    },
    methods: {
        getDetail() {
            getPrizeDetail({ winCertificate: this.winCertificate }).then(res => {
                if (res.resultCode === 0) {
                    if (res.result && res.result.state === 2) {
                        this.addressData.memberName = res.result.receiverName
                        this.addressData.telMobile = res.result.receiverPhone
                        this.addressData.detailAddress = res.result.receiverAddress
                    } else if (res.result && res.result.state === 1) {
                        this.showBtn = true
                    }
                } else {
                    uni.showToast({ title: '页面加载失败，请稍后再试!', icon: 'none' })
                }
            })
        },
        // 输入校验
        trimFun() {
            setTimeout(() => {
                if (this.addressData.telMobile) {
                    this.addressData.telMobile = this.addressData.telMobile.replace(/[^0-9]/g, '').substring(0,11)
                }
            },0)
        },
        submitAddress() {
            if (this.addressData.memberName === '') {
                uni.showToast({ title: '请输入联系人!', icon: 'none' })
                return
            }
            if (!checkTel(this.addressData.telMobile)) {
                return
            }
            if (this.addressData.detailAddress === '') {
                uni.showToast({ title: '请输入详细地址!', icon: 'none' })
                return
            }

            let params = {
                receiverAddress: this.addressData.detailAddress,
                receiverName: this.addressData.memberName,
                receiverPhone: this.addressData.telMobile,
                winCertificate: this.winCertificate
            }

            redeem(params).then(res => {
                // 接口成功后跳转到我的奖品页
                if (res.resultCode === 0) {
                    uni.showToast({ title: '领取成功', icon: 'none' })
                    setTimeout(() => {
                        this.$Router.replace({
                            path: '/activitystudio/list/index',
                            query: {
                                activityId: this.activityId
                            }
                        })
                    }, 1000)
                } else {
                    uni.showToast({ title: '领取失败，请稍后再试！', icon: 'none' })
                }
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.address {
    position: relative;
    width: 750rpx;
    height: 100vh;
    background-color: #eff2f5;

    .row {
        display: flex;
        align-items: center;
        position: relative;
        padding: 0 30rpx;
        height: 100rpx;
        background: #fff;

        &.b-b {
            &:after {
                position: absolute;
                z-index: 3;
                left: 20rpx;
                right: 0;
                bottom: 0;
                height: 0;
                content: '';
                -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
                border-bottom: 1px solid rgba(0, 0, 0, .1);
            }
        }

        .tit {
            flex-shrink: 0;
            min-width: 150rpx;
            font-size: 28rpx;
            color: #666666;

            .redTxt {
                color: #ff0400;
            }
        }

        .input {
            flex: 1;
            font-size: 30rpx;
            color: #222;

            .placeholder {
                font-size: 28rpx;
                color: #999;
            }
        }
    }

    .textareaRow {
        height: 160rpx;
        align-items: flex-start;
        padding-top: 20rpx;

        textarea {
            font-size: 30rpx;
            color: #222222;
            height: 120rpx;

            .placeholder{
                font-size: 28rpx;
                color: #999999;
            }
        }
    }

    .submit {
        width: 100%;
        height: 88rpx;
        text-align: center;
        padding: 0 30rpx;
        margin-top: 120rpx;

        view {
            display: inline-block;
            width: 100%;
            height: 88rpx;
            line-height: 88rpx;
            border-radius: 44rpx;
            background-color: #f30300;
            color: #fff;
            cursor: pointer;
        }
    }
}
</style>
