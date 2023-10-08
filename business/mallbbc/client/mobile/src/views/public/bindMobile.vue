<template>
    <view class="container">
        <text class="back-btn iconfont icon_arrow_left" @click="navBack"></text>
        <!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
        <view class="wrapper" v-if="bindState">
            <view class="login-title">
                {{$L('绑定手机号')}}
            </view>
            <view class="input-content">
                <view class="input-item">
                    <input type="number" :value="mobile" :placeholder="$L('请输入手机号')" maxlength="11" data-key="mobile" @input="inputChange"
                     @focus="setFocus" />
                    <text class="clear-account iconfont icon_close_fill" v-show="mobile&&curFocus=='mobile'" @click="clearContent('mobile')"></text>
                </view>
                <view class="input-item pwd_wrap">
                    <input type="number" :value="smsCode" maxlength="6" :placeholder="$L('请输入短信验证码')" data-key="smsCode" @input="inputChange"
                     @confirm="toLogin" @focus="setFocus" />
                    <view class="pwd-right">
                        <text class="clear-pwd iconfont icon_close_fill" v-show="smsCode&&curFocus=='smsCode'" @click="clearContent('smsCode')"></text>
                        <view :style="{opacity: countDownM?0.3:1}" class="sms-code-view" @click="getSmsCode">
                            <text class="sms-code">{{countDownM?`${countDownM}s后重新获取`:'获取验证码'}}</text>
                        </view>
                    </view>

                </view>
            </view>
            <button class="confirm-btn" @click="toLogin" :style="{opacity: (!(mobile&&smsCode)||logining)?0.5:1}">{{$L('确认绑定')}}</button>
        </view>
        <!-- 绑定选择部分 -->
        <view class="wrapper" v-else>
            <view class="bind_state_top">
                <image class="mobile_logo" :src="imgUrl+'user/bind_mobile.png'"></image>
                <text class="mobile_num">{{mobile}}</text>
                <text class="mobile_binded">{{$L('该手机号已被绑定')}}</text>
            </view>
            <view class="bind_change_info">
                <view class="bind_change_info_text">{{$L('继续绑定：将解除与账号')}}<text class="change_info_mobile">{{bindedAccount}}</text>{{$L('的绑定关系')}}</view>
                <view class="bind_change_info_text">{{$L('更新信息：授权信息将绑定到账号')}}<text class="change_info_mobile">{{bindedAccount}}</text>{{$L('上')}}</view>
            </view>
            <view class="bind_state_btn_con">
                <view class="update_btn" @click="confirmBind(3)">{{$L('更新信息')}}</view>
                <view class="go_on_btn" @click="confirmBind(2)">{{$L('继续绑定')}}</view>
            </view>
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
            bindState: true,
            imgUrl: getApp().globalData.imgUrl,
            mobile: '',
            smsCode: '',
            logining: false,
            countDownM: 0, //短信验证码倒计时
            timeOutId: '', //定时器的返回值
            curFocus: '', //当前光标所在的位置
            code: '', //用户code
            bindType: 1, //绑定方式，默认 1==去绑定，检测手机号是否已绑定其他账号；2==继续绑定，新增一条会员信息；3==更新信息，更新原会员的微信信息
            client: 1, //终端类型， 1、H5(微信内部浏览器) 2、H5(微信小程序)；3、app
            bindedAccount:'',//已经绑定的账号
            source:'' //页面来源，该用户已登录，却强行被解绑了，来源为 ’account‘
        }
    },
    mounted(){
        this.initClient();
        if (this.$Route.query.code) {
            this.code = this.$Route.query.code;
        }
        this.source = 'account'
    },
    onLoad() {
        // this.initClient();
        // if (this.$Route.query.code) {
        //     this.code = this.$Route.query.code;
        // }
        // this.source = 'account'
    },

    methods: {
        ...mapMutations(['login', 'setUserCenterData']),
        //光标聚焦事件
        setFocus(e) {
            this.curFocus = e.currentTarget.dataset.key;
        },
        inputChange(e) {
            const key = e.currentTarget.dataset.key;
            this[key] = e.detail.value;
        },
        navBack() {
            this.$Router.back(1)
        },

        //初始化终端类型
        initClient() {
            let {
                client
            } = this;
                //#ifdef APP-PLUS
            client = 2;
            //#endif
            //#ifdef MP-WEIXIN
            client = 4;
            //#endif
            //#ifdef H5
            client = 3;
            //#endif
            this.client = client;
        },

        toLogin() {
            const {
                mobile,
                smsCode,
                logining,
                code,
                bindType,
                client
            } = this;
            let _this = this;
            if (!(mobile && smsCode) || logining) {
                return;
            }
            _this.logining = true;
            let param = {};
            param.url = 'v3/member/front/login/wechat/bindMobile';
            param.data = {};
            param.data.bindType = bindType;
            param.data.mobile = mobile;
            param.data.smsCode = smsCode;
            param.data.resource = client;
            if (!_this.$checkMobile(mobile)) {
                return false
            }
            //如果有缓存的购物车数据，登录需要把数据同步，并清除本地缓存
            let local_cart_list = uni.getStorageSync('cart_list')
            let cartInfo = []
            if (local_cart_list) {
                local_cart_list.cartInfoList.forEach(item => {
                    if (item.isChecked == 1) {
                        cartInfo.push({
                            spu: item.spu,
                            sku: item.sku,
                            buyNum: item.buyNum,
                            productPrice: item.productPrice,
                            checked: 1
                        })
                    }
                })
                param.data.cartInfo = JSON.stringify(cartInfo);
            }

            param.data.bindKey = code;

            param.method = 'POST';
            _this.$request(param).then(res => {
                if (res.state == 200) {
                    this.$removeStorage({
                        key: 'cart_data'
                    }); //清除购物车数据
                    res.data.loginTime = Date.parse(new Date()); //登录时间
                    _this.login(res.data);
                    //获取个人中心的数据
                    _this.$request({
                        url: 'v3/member/front/member/memberInfo'
                    }).then(result => {
                        if (_this.source == 'account'){
                            const pages = getCurrentPages(); //当前页面栈
                            if (pages.length > 1) {
                                const beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
                                beforePage.$vm.isBindMobile = true; //修改上一页的数据     isBindMobile 为true，即为已绑定
                            }
                            _this.$Router.back(1)
                        } else {
                            _this.setUserCenterData(result.data);
                            _this.$loginGoPage();
                        }
                    }).catch(() => {})


                } else if (res.state == 267) {
                    //手机号已被绑定,提示用户
                    _this.bindState = false;
                    _this.bindedAccount = res.data;
                } else {
                    //错误提示
                    _this.$api.msg(res.msg);
                }
                _this.logining = false;
            }).catch(() => {})
        },

        //提示绑定操作
        confirmBind(type){
            this.bindType = type;
            this.toLogin();
        },

        //清空输入的内容
        clearContent(type) {
            this[type] = '';
        },

        //获取短信验证码
        getSmsCode() {
            if (this.countDownM) {
                return;
            }
            if (!this.$checkMobile(this.mobile)) {
                return false
            } 
            let param = {};
            param.url = 'v3/msg/front/commons/smsCode';
            param.data = {};
            param.data.mobile = this.mobile;
            param.data.type = 'wxAuth';
            this.$request(param).then(res => {
                this.$api.msg(res.msg)
                if (res.state == 200) {
                    this.countDownM = 60;
                    this.countDown();
                }
            })
                
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
        }
    }

}
</script>

<style lang='scss'>
    page {
        background: #fff;
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
        color: #333;
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

        .clear-account {
            position: absolute;
            right: 6rpx;
            top: 28rpx;
            font-size: 26rpx;
            color: #ddd;
        }

        &:last-child {
            margin-bottom: 0;

            .pwd-right {
                position: absolute;
                right: 6rpx;
                top: 6rpx;
                display: flex;
                align-items: center;

                .clear-pwd {
                    font-size: 26rpx;
                    color: #ddd;
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
        }
    }


    .confirm-btn {
        width: 620rpx;
        height: 88rpx;
        line-height: 88rpx;
        margin-top: 90rpx;
        background: linear-gradient(90deg, rgba(252, 31, 29, 1) 0%, rgba(253, 115, 38, 1) 100%);
        box-shadow: 0px 3rpx 14rpx 1rpx rgba(253, 38, 29, 0.26);
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

    /* 绑定结果页 */
    .bind_state_top {
        margin-top: 172rpx;
        display: flex;
        flex-direction: column;
        align-items: center;

        .mobile_logo {
            width: 120rpx;
            height: 120rpx;
        }
        .mobile_num{
            font-size: 30rpx;
            font-weight: 500;
            color: #FC2624;
            margin-top: 39rpx;
        }
        .mobile_binded{
            font-size: 30rpx;
            font-weight: 500;
            color: #333333;
            margin-top: 19rpx;
        }

    }
    .bind_change_info{
        font-size: 28rpx;
        text-align: center;
        color: #666666;
        line-height: 39rpx;
        margin-top: 51rpx;
        .change_info_mobile{
            color: #333333;
        }
    }
    .bind_state_btn_con{
        width: 620rpx;
        height: 70rpx;
        margin: 0 auto;
        margin-top: 80rpx;
        font-size: 30rpx;
        display: flex;
        .update_btn{
            width: 308rpx;
            height: 69rpx;
            line-height: 69rpx;
            color: #ff0000;
            text-align: center;
            border-radius: 35rpx 0 0 35rpx;
            border: 1px solid #ff0000;
        }
        .go_on_btn{
            width: 308rpx;
            height: 69rpx;
            line-height: 69rpx;
            text-align: center;
            background-color: #ff0000;
            color: white;
            border-radius: 0 35rpx 35rpx 0;
            border: 1px solid #ff0000;
        }
    }

</style>
