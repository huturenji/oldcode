<!-- 忘记密码页面 -->
<template>
    <view class="container">
        <text class="back-btn iconfont icon_arrow_left" @click="navBack"></text>
        <!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
        <view class="wrapper">
            <view class="login-title">
                {{$L('找回密码')}}
            </view>
            <view class="input-content">
                <view class="input-item">
                    <input type="number" :value="mobile" :placeholder="$L('请输入手机号')" maxlength="11" data-key="mobile" @input="inputChange"
                     placeholder-class="input_placeholder" @focus="setFocus"/>
                    <text class="clear-account iconfont icon_close_fill" v-show="mobile&&curFocus=='mobile'" @click="clearContent('mobile')"></text>
                </view>
                <view class="input-item pwd_wrap">
                    <input type="number" class="smsCode_input" :value="smsCode" maxlength="6" :placeholder="$L('请输入短信验证码')" data-key="smsCode" @input="inputChange"
                     placeholder-class="input_placeholder" @confirm="toLogin" @focus="setFocus"/>
                    <view class="pwd-right">
                        <text class="clear-pwd iconfont icon_close_fill" v-show="smsCode&&curFocus=='smsCode'" @click="clearContent('smsCode')"></text>
                        <view :style="{opacity: countDownM?0.3:1}" class="sms-code-view" @click="getSmsCode">
                            <text class="sms-code">{{countDownM?`${countDownM}s后重新获取`:'获取验证码'}}</text>
                        </view>
                    </view>

                </view>
                <view class="input-item pwd_wrap">
                    <input :style="password.length? 'width: 81%;':''" type="text" :value="password" :placeholder="$L('请设置6～20位英文、数字或符号的密码')" maxlength="20" :password="!showPwd"
                     placeholder-class="input_placeholder" data-key="password" @input="inputChange" @confirm="toLogin" @focus="setFocus"/>
                    <view class="pwd-right">
                        <text class="clear-pwd iconfont icon_close_fill" v-show="password&&curFocus=='password'" @click="clearContent('password')"></text>
                        <text :class="pwdState" @click="changePwdState"></text>
                    </view>

                </view>
            </view>
            <button class="confirm-btn" @click="toResetPwd" :style="{opacity: (!(mobile&&password&&smsCode)||logining)?0.5:1}">{{$L('找回密码')}}</button>
        </view>
    </view>
</template>

<script>
import {
    mapMutations
} from 'vuex';

export default {
    data() {
        return {
            mobile: '',
            password: '',
            smsCode: '',
            logining: false,
            showPwd: false,
            countDownM: 0, //短信验证码倒计时
            timeOutId: '', //定时器的返回值
            curFocus:''//当前光标所在的位置
        }
    },
    onLoad() {

    },
    computed: {
        pwdState: function() {
            return 'pwd-tab iconfont '+(this.showPwd? 'icon_browse':'icon_hide')
        }
    },
    methods: {
        ...mapMutations(['login', 'setUserCenterData']),
        //光标聚焦事件
        setFocus(e){
            this.curFocus = e.currentTarget.dataset.key;
        },
        inputChange(e) {
            const key = e.currentTarget.dataset.key;
            this[key] = e.detail.value;
        },
        navBack() {
            this.$Router.back(1)
        },
        //获取短信验证码
        getSmsCode() {
            if (this.countDownM) {
                return;
            }
            if (this.$checkMobile(this.mobile)) {
                let param = {};
                param.url = 'v3/msg/front/commons/smsCode';
                param.data = {};
                param.data.mobile = this.mobile;
                param.data.type = 'free';
                this.$request(param).then(res => {
                    this.$api.msg(res.msg);
                    if (res.state == 200) {
                        this.countDownM = 60;
                        this.countDown();
                    }
                })
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
        //重置密码接口
        toResetPwd() {
            const {
                mobile,
                password,
                smsCode,
                logining
            } = this;
            if (!(mobile && password && smsCode) || logining) {
                return;
            }
            if (!this.$checkMobile(this.mobile)){
                return false
            }
            //密码的验证 6～20位，英文、数字或符号
            if (!this.$checkPwd(password)) {
                return false
            }
            this.logining = true;
            let param = {};
            param.url = 'v3/member/front/memberPassword/resetLoginPwd';
            param.data = {};
            param.data.memberMobile = mobile;
            param.data.verifyCode = smsCode;
            param.data.loginPwd = password;
            param.method = 'POST';
            this.$request(param).then(res => {
                this.$api.msg(res.msg);
                if (res.state == 200) {
                    setTimeout(() => {
                        this.$Router.back(1)
                    }, 2000)

                }
                this.logining = false;
            }).catch(() => {})
        },

        //清空输入的内容
        clearContent(type) {
            this[type] = '';
        },

        //是否显示密码切换事件
        changePwdState() {
            this.showPwd = !this.showPwd;
        },

        //跳转事件 type:跳转类型，1为redirectTo 2为navigateTo
        navTo(url, type) {
            if (type == 1) {
                this.$Router.replace(url)
            } else if (type == 2) {
                this.$Router.push(url)
            }
        }

    }

}
</script>

<style lang='scss'>
    page {
        background: #fff;
        width: 750rpx;
        margin: 0 auto;
    }

    .container {
        position: relative;
        width: 750rpx;
        height: 100vh;
        overflow: hidden;
        background: #fff;
    }

    .wrapper {
        position: relative;
        z-index: 90;
        background: #fff;
        padding-bottom: 40upx;
    }

    .back-btn {
        margin-left: 40rpx;
        margin-top: 40rpx;
        /* #ifndef H5 */
        margin-top: 88rpx;
        /* #endif */
        font-size: 32rpx;
        color: $main-font-color;
        display: inline-block;
    }

    .login-title {
        position: relative;
        margin-top: 90rpx;
        margin-bottom: 70rpx;
        margin-left: 65rpx;
        font-size: 36rpx;
        color: $main-font-color;
        font-weight: bold;

        &:after {
            position: absolute;
            left: 0;
            bottom: -10rpx;
            content: '';
            width: 76rpx;
            height: 6rpx;
            background: linear-gradient(90deg, rgba(252, 28, 28, 1) 0%, rgba(255, 138, 0, 0) 100%);
        }
    }

    .input-content {
        padding: 0 65rpx;
    }
    .input-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        height: 80rpx;
        margin-bottom: 50upx;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        position: relative;

        input {
            color: #2D2D2D;
            font-size: 30rpx;
        }
        .smsCode_input{
            width: 75%;
        }
        .input_placeholder {
            color: $main-third-color;
            font-size: 30rpx;
        }

        .clear-account {
            position: absolute;
            right: 6rpx;
            top: 28rpx;
            font-size: 26rpx;
            color: #ddd;
            z-index: 999;
        }

        &:nth-child(2) {
            .pwd-right {
                position: absolute;
                right: 6rpx;
                top: 6rpx;
                display: flex;
                align-items: center;
                .clear-pwd {
                    font-size: 26rpx;
                    color: #ddd;
                    position: relative;
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
                z-index: 999;
                .clear-pwd {
                    font-size: 26rpx;
                    color: #ddd;
                }

                .pwd-tab {
                    font-size: 30rpx;
                    color: #666;
                    margin-left: 20rpx;
                    margin-right: 28rpx;

                    &.icon_hide {
                        font-size: 15rpx;
                        transform: scale(0.1);
                        position: relative;
                        z-index: 999;
                    }

                    &.icon_browse {
                        font-size: 20rpx;
                        transform: scale(0.1)
                    }

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

        .tit {
            height: 50upx;
            line-height: 56upx;
            font-size: $font-sm+2upx;
            color: $font-color-base;
        }

        input {
            height: 60upx;
            font-size: $font-base + 2upx;
            color: $font-color-dark;
            width: 100%;
        }
    }


    .confirm-btn {
        width: 620rpx;
        height: 88rpx;
        line-height: 88rpx;
        margin-top: 90rpx;
        background: linear-gradient(90deg, rgba(252, 31, 29, 1) 0%, rgba(253, 115, 38, 1) 100%);
        box-shadow: 0px 3rpx 14rpx 1rpx rgba(253, 38, 29, 0.26);
        opacity: 0.7;
        border-radius: 44rpx;
        color: #fff;
        font-size: 36rpx;
    }

    .other-login {
        position: absolute;
        left: 0;
        bottom: 140rpx;
        width: 100%;
        display: flex;
        flex-direction: column;

        .title {
            display: flex;
            justify-content: center;
            align-items: center;

            &:before {
                content: ' ';
                width: 150rpx;
                height: 1rpx;
                background: #CBCBCB;
            }

            &:after {
                content: ' ';
                width: 150rpx;
                height: 1rpx;
                background: #CBCBCB;
            }

            text {
                color: #999999;
                font-size: 26rpx;
                margin: 0 20rpx;
            }
        }

        .login-method {
            display: flex;
            justify-content: center;
            margin-top: 20rpx;

            .wechat-login {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;

                .wechat-icon {
                    width: 110rpx;
                    height: 110rpx;
                }

                text {
                    color: #666666;
                    font-size: 26rpx;
                }
            }
        }

    }

    .agreement-part {
        position: absolute;
        left: 0;
        bottom: 60rpx;
        width: 100%;
        font-size: 26rpx;
        color: #999999;
        text-align: center;

        .agreement {
            color: #FC1E1E;
            border-bottom: 1rpx solid #FC1E1E;
        }
    }

    .login-register {
        display: flex;
        justify-content: center;
        margin-top: 33rpx;

        .mobile-login {
            color: #2D2D2D;
            font-size: 28rpx;
            line-height: 34rpx;
            border-right: 1px solid rgba(0, 0, 0, .1);
            padding-right: 30rpx;
            margin-right: 30rpx;
        }

        .register {
            color: #FC1C1C;
            font-size: 28rpx;
            line-height: 34rpx;
        }
    }
</style>
