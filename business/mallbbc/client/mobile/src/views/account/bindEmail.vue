<!-- 绑定电子邮箱页面 -->
<template>
    <view class="container flex_column_start_center">

        <view class="input-content flex_column_start_center">
            <view class="input-item pwd_wrap">
                <input type="text" :value="email" :placeholder="$L('请输入邮箱')" maxlength="50" data-key="email" placeholder-class='placeholder_class'
                 @input="inputChange" @confirm="confirm" />
                <view class="pwd-right" @click="clearContent('email')">
                    <text class="clear-pwd iconfont icon_close" v-show="email" ></text>
                </view>

            </view>
            <view class="input-item pwd_wrap">
                <input type="number" :value="smsCode" maxlength="4" :placeholder="$L('请输入邮箱验证码')" data-key="smsCode" @input="inputChange"
                 placeholder-class='placeholder_class' />
                <view class="pwd-right">
                    <text class="clear-pwd iconfont icon_close" v-if="smsCode" @click.prevent="clearContent('smsCode')"></text>
                    <view :style="{opacity: countDownM?0.3:1}" class="sms-code-view" @click="getSmsCode">
                        <text class="sms-code">{{countDownM?`${countDownM}s后重新获取`:'获取验证码'}}</text>
                    </view>
                </view>

            </view>
        </view>
        <button class="confirm-btn" @click="confirm" :disabled="logining">{{$L('确定')}}</button>
        <uni-popup ref="popup" type="dialog">
            <uni-popup-dialog type="input" :title="$L('温馨提示')" :content="bindTip" :duration="2000" before-close="true" @close="closeDialog"
             @confirm="confirmBind"></uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script>
import {
    mapMutations,
    mapState
} from 'vuex';
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
export default {
    components: {
        uniPopup,
        uniPopupDialog
    },
    data() {
        return {
            email: '',
            smsCode: '',
            logining: false,
            countDownM: 0, //短信验证码倒计时
            timeOutId: '', //定时器的返回值
            bind:'',//是否进行绑定，1-解绑，0-不解绑
            bindTip:''//弹框内容提示
        }
    },
    onLoad() {},
    computed: {
        ...mapState(['userInfo', 'userCenterData'])
    },
    methods: {
        ...mapMutations(['login', 'setUserCenterData', 'userInfo']),
        inputChange(e) {
            const key = e.currentTarget.dataset.key;
            this[key] = e.detail.value;
        },
        navBack() {
            this.$Router.back(1)
        },
        //获取邮箱验证码
        getSmsCode() {
            if (this.countDownM) {
                return;
            }
            //验证邮箱是否正确
            if (!this.$checkEmail(this.email)) {
                return false
            }
            let param = {};
            param.url = 'v3/msg/front/commons/sendVerifyCode';
            param.data = {};
            param.method = 'GET';
            param.data.verifyType = 1;
            param.data.verifyAddr = this.email;
            param.data.changeType = '';
            this.$request(param).then(res => {
                this.$api.msg(res.msg);
                if (res.state == 200) {
                    this.countDownM = 60;
                    this.countDown();
                }
            })
        },
        //确认事件
        confirm() {
            const {
                email,
                smsCode
            } = this;
                //验证邮箱是否正确
            if (!this.$checkEmail(email)) {
                return false
            }
            //是否填写验证码
            if (!smsCode){
                this.$api.msg('验证码不能为空');
                return;
            }
            let param = {};
            param.data = {};
            param.method = 'POST';
            param.url = 'v3/member/front/memberPassword/editEmail';
            param.data.memberEmail = email;
            param.data.emailCode = smsCode;
            if (this.bind != '') {
                param.data.isUnbound = this.bind;
            }
            this.$request(param).then(res => {
                if (res.state == 200) {
                    this.$api.msg(res.msg);
                    this.userCenterData.hasMemberEmail = 1;
                    this.userCenterData.memberEmail = email;
                    //更新个人信息数据
                    this.setUserCenterData(this.userCenterData);
                    setTimeout(() => {
                        this.$Router.back(1)
                    }, 2000)

                } else if (res.state == 267){
                    //提示是否进行绑定
                    this.bindTip = res.msg;
                    this.$refs.popup.open();
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {})
        },

        //清空输入的内容
        clearContent(type) {
            this[type] = '';
        },

        //跳转事件 type:跳转类型，1为redirectTo 2为navigateTo
        navTo(url, type) {
            if (type == 1) {
                this.$Router.replace(url)
            } else if (type == 2) {
                this.$Router.push(url)
            }
        },
        //倒计时
        countDown() {
            this.countDownM--;
            if (this.countDownM == 0) {
                clearTimeout(this.timeOutId);
            } else {
                this.timeOutId = setTimeout(this.countDown, 1000);
            }
        },
        //关闭弹框
        closeDialog() {
            this.bind = 0;
            this.$refs.popup.close();
            //返回上级页面
            setTimeout(() => {
                this.$Router.back(1)
            }, 200)
        },
        //确认绑定
        confirmBind() {
            this.bind = 1;
            this.$refs.popup.close();
            this.confirm();
        }

    }

}
</script>

<style lang='scss'>
    page {
        background: $bg-color-split;
        display: flex;
        flex: 1;
        height: 100%;
        width: 750rpx;
        margin: 0 auto;
    }

    uni-page-body {
        display: flex;
        height: 100%;
    }

    .container {
        flex: 1;
        margin-top: 20rpx;

        .bind_mobile {
            height: 80rpx;
            width: 100%;
            width: 100%;
            background: #F8F8F8;
            padding-left: 40rpx;
            color: $main-font-color;
            font-size: 26rpx;
        }
    }

    .wrapper {
        position: relative;
        z-index: 90;
        background: #fff;
        padding-bottom: 40upx;
    }

    .back-btn {
        position: absolute;
        left: 40upx;
        z-index: 9999;
        padding-top: var(--status-bar-height);
        top: 40upx;
        font-size: 40upx;
        color: $font-color-dark;
    }


    .input-content {
        flex: 1;
        width: 100%;
        background-color: #fff;
        padding: 0 40rpx;
    }

    .input-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0 20rpx;
        height: 80rpx;
        margin-bottom: 40rpx;
        border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
        position: relative;
        
        
        .placeholder_class {
            color: #949494;
            font-size: 26rpx;
        }

        .clear-account {
            position: absolute;
            right: 6rpx;
            top: 28rpx;
            font-size: 24rpx;
            color: #999;
        }

        &:first-child {
            margin-top: 40rpx;
        }

        &:last-child {
            input{
                width: 80% !important;
            }
            .pwd-right {
                position: absolute;
                right: 6rpx;
                top: 6rpx;
                display: flex;
                align-items: center;


                .clear-pwd {
                    font-size: 24rpx;
                    color: #999;
                    z-index: 999;
                }

                .sms-code-view {
                    border: 1px solid $main-color;
                    padding: 14rpx;
                    border-radius: 6rpx;
                    line-height: 0;
                    margin-left: 20rpx;

                    .sms-code {
                        color: $main-color;
                        font-size: 24rpx;
                        line-height: 24rpx;
                    }
                }
            }
        }

        &:last-child {
            margin-bottom: 0;

            .pwd-right {
                position: absolute;
                right: 6rpx;
                top: 14rpx;

                .clear-pwd {
                    font-size: 24rpx;
                    color: #999;
                }

                .pwd-tab {
                    font-size: 30rpx;
                    color: #666;
                    margin-left: 20rpx;
                    margin-right: 28rpx;
                }

                .forget-pwd {
                    color: #2D2D2D;
                    font-size: 28rpx;
                    line-height: 28rpx;
                    font-weight: 400;
                    border-left: 1px solid $border-color-split;
                    padding-left: 28rpx;
                }
            }
        }


        input {
            height: 60upx;
            font-size: 28rpx;
            color: $main-font-color;
            width: 100%;
        }
    }


    .confirm-btn {
        position: fixed;
        width: 668rpx;
        height: 88rpx;
        background: linear-gradient(-90deg, rgba(252, 29, 28, 1) 0%, rgba(255, 122, 24, 1) 100%);
        box-shadow: 0px 10rpx 20rpx 0px rgba(252, 30, 28, 0.2);
        border-radius: 44rpx;
        left: 0;
        right: 0;
        bottom: 40rpx;
        color: #fff;
        font-size: 36rpx;
        margin: 0 auto;
    }
</style>
