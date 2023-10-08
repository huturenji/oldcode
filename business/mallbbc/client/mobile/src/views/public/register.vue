<!-- 注册页面 -->
<template>
    <view class="container">
        <text class="back-btn iconfont icon_arrow_left" @click="navBack"></text>
        <!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
        <view class="wrapper">
            <view class="login-title">
                {{$L('注册')}}
            </view>
            <view class="input-content">
                <view class="input-item">
                    <input type="number" :value="mobile" :placeholder="$L('请输入手机号')" maxlength="11" data-key="mobile" @input="inputChange" @focus="setFocus"/>
                    <text class="clear-account iconfont icon_close_fill" v-show="mobile&&curFocus=='mobile'" @click="clearContent('mobile')"></text>
                </view>
                <view class="input-item">
                    <input type="text" :value="imgCode" maxlength="4" :placeholder="$L('请输入图形验证码')" data-key="imgCode" @input="inputChange" @focus="setFocus" @blur="smsBlur"/>
                    <view class="pwd-right">
                        <text class="clear-pwd iconfont icon_close_fill" v-show="imgCode&&curFocus=='imgCode'" @click="clearContent('imgCode')"></text>
                        <image @click="getImgCode" :src='showCodeImg' />
                    </view>

                </view>
                <view class="input-item">
                    <input type="number" :value="smsCode" maxlength="6" :placeholder="$L('请输入短信验证码')" data-key="smsCode" @input="inputChange"
                     @confirm="toRegist" @focus="setFocus"/>
                    <view class="pwd-right">
                        <text class="clear-pwd iconfont icon_close_fill" v-show="smsCode&&curFocus=='smsCode'" @click="clearContent('smsCode')"></text>
                        <view :style="{opacity: countDownM?0.3:1}" class="sms-code-view" @click="getSmsCode">
                            <text class="sms-code">{{countDownM?`${countDownM}s后重新获取`:'获取验证码'}}</text>
                        </view>
                    </view>

                </view>
            </view>
            <button class="confirm-btn" @click="toRegist" :style="{opacity: (!(mobile&&smsCode&&imgCode)||logining)?0.5:1}">{{$L('注册')}}</button>
            <view class="login-register">
                <text class="mobile-login">{{$L('已有账号')}}～</text>
                <text class="register" @click="navTo('/pages/public/login',1)">{{$L('去登陆')}}></text>
            </view>
        </view>
        <view class="other-login">
            <!-- #ifdef H5 -->
            <view class="title" v-if="isWeiXinH5">
                <text >{{$L('其他登录')}}</text>
            </view>
            <!-- #endif -->

            <!-- #ifndef H5 -->
            <view class="title" v-if="isWxEnable==1">
                <text >{{$L('其他登录')}}</text>
            </view>
            <!-- #endif -->

            <view class="login-method">
                <!-- #ifdef MP-WEIXIN -->
                <button class="wechat-login" v-if="canIUseGetUserProfile" @tap="getUserProfile">
                    <image class="wechat-icon" :src="imgUrl+'goods/wx_share.png'" mode="aspectFill" />
                    <text>{{$L('微信登录')}}</text>
                </button>
                <button class="wechat-login" v-if="!canIUseGetUserProfile" open-type="getUserInfo" @getuserinfo="getUser">
                    <image class="wechat-icon" :src="imgUrl+'goods/wx_share.png'" mode="aspectFill" />
                    <text>{{$L('微信登录')}}</text>
                </button>
                <!-- #endif -->
                <!-- #ifdef H5-->
                <view class="wechat-login" @tap="quickLogin" v-if="isWeiXinH5">
                    <image class="wechat-icon" :src="imgUrl+'goods/wx_share.png'" mode="aspectFill" />
                    <text>{{$L('微信登录')}}</text>
                </view>
                <!-- #endif -->
                <!-- #ifdef APP-PLUS -->
                <view class="wechat-login" @tap="quickLogin"  v-if="isWxEnable==1">
                    <image class="wechat-icon" :src="imgUrl+'goods/wx_share.png'" mode="aspectFill" />
                    <text>{{$L('微信登录')}}</text>
                </view>
                <!-- #endif -->
            </view>
        </view>
        <view class="agreement-part flex_row_center_center">
            <image @click="checkAgrement" class="register_icon" :src="show_check_icon" mode="aspectFill" />
            {{$L('我已阅读并同意')}}
            <text class="agreement" @click="agreement">{{$L('《用户注册协议及隐私政策》')}}</text>
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
            smsCode: '',
            showCodeImg: '',
            imgCode: '', //图形验证码
            imgCodeKey: '', //图形验证码的key
            logining: false,
            check_agreement: false,
            show_check_icon: getApp().globalData.imgUrl+'common/icon/register_uncheck.png',
            countDownM: 0, //短信验证码倒计时
            timeOutId: '', //定时器的返回值
            curFocus:'',//当前光标所在的位置
            client: 1, //终端类型， 1、H5(微信内部浏览器) 2、H5(微信小程序)；3、app
            oriUrl:'',//不带code的页面地址
            imgUrl: getApp().globalData.imgUrl,
            isWeiXinH5:true, //是否为微信浏览器h5
            canIUseGetUserProfile: false,//是否可以使用getUserProfile获取用户信息，用于微信小程序
            spreaderMemberId:0,
            isWxEnable:0
        }
    },
    mounted(){
        this.getImgCode();
        this.client = this.$getLoginClient();
        //#ifdef MP-WEIXIN
        if (uni.getUserProfile) {
            this.canIUseGetUserProfile = true;
        }
        this.spreaderMemberId = this.$Route.query.u?decodeURIComponent(this.$Route.query.u):0 
        //#endif
        //#ifdef H5
        let code = this.$getQueryVariable('code');
        this.spreaderMemberId = this.$Route.query.u?this.$Route.query.u:0
        // this.isWeiXinH5 = this.$isWeiXinBrower();
        if (code){
            let oriUrl = this.$Route.query.ori_url+'pages/public/register';
            let tmp_data = '';
            for (let i in this.$Route.query){
                if (i!='ori_url'){
                    tmp_data += i+'='+this.$Route.query[i]+'&'
                }
            }
            oriUrl += '?'+tmp_data;
            this.oriUrl = oriUrl;

            if (this.$isWeiXinBrower()){
                //微信浏览器的话要把浏览器地址里面的code去掉
                history.replaceState(window.history.state, '',this.oriUrl);
            }

            let tar_params = {};
            tar_params.source = this.client;
            tar_params.code = code;
            this.goLogin(tar_params);
        }
        //#endif
        // #ifdef APP-PLUS
        this.getWxAuthority()
        // #endif
    },
    onLoad() {
        // this.getImgCode();
        // this.client = this.$getLoginClient();
        // //#ifdef MP-WEIXIN
        // if (uni.getUserProfile) {
        //     this.canIUseGetUserProfile = true;
        // }
        // this.spreaderMemberId = this.$Route.query.u?decodeURIComponent(this.$Route.query.u):0 
        // //#endif
        // //#ifdef H5
        // let code = this.$getQueryVariable('code');
        // this.spreaderMemberId = this.$Route.query.u?this.$Route.query.u:0
        // // this.isWeiXinH5 = this.$isWeiXinBrower();
        // if(code){
        //     let oriUrl = this.$Route.query.ori_url+'pages/public/register';
        //     let tmp_data = '';
        //     for(let i in this.$Route.query){
        //         if(i!='ori_url'){
        //             tmp_data += i+'='+this.$Route.query[i]+'&'
        //         }
        //     }
        //     oriUrl += '?'+tmp_data;
        //     this.oriUrl = oriUrl;

        //     if(this.$isWeiXinBrower()){
        //         //微信浏览器的话要把浏览器地址里面的code去掉
        //         history.replaceState({},'',this.oriUrl);
        //     }

        //     let tar_params = {};
        //     tar_params.source = this.client;
        //     tar_params.code = code;
        //     this.goLogin(tar_params);
        // }
        // //#endif
        // // #ifdef APP-PLUS
        // this.getWxAuthority()
        // // #endif
    },

    methods: {
        ...mapMutations(['login', 'setUserCenterData']),

        getUser(e) {
            if (e.detail.errMsg == "getUserInfo:ok") {
                this.$bbcStatEvent({behaviorType:'reg'}) //统计埋点
                let userinfo = e.detail.userInfo;
                this.getWxXcxCoce(userinfo);
            }
        },
            
            
        smsBlur(){
            let imgReg = /^[A-Za-z0-9]+$/g
            if (!imgReg.test(this.imgCode)){
                this.imgCode = ""
                this.$api.msg('图形验证码格式不正确')
            }
        },
            
        //微信小程序根据用户信息获取code
        getWxXcxCoce(userinfo) {
            this.$setStorageSync('fromurl', {url:'/pages/tabbar/personalcenter'});
            let {client} = this;
            let _this = this;
            uni.showLoading();
            uni.login({
                success: code => {
                    let tar_params = {};
                    tar_params.source = client;
                    tar_params.code = code.code;
                    tar_params.userInfo = JSON.stringify(userinfo);
                    _this.goLogin(tar_params);
                }
            });
        },
            
        getUserProfile() {
            // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
            // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
            uni.getUserProfile({
                desc: '用于完善个人信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                    if (res.errMsg == "getUserProfile:ok"){
                        this.$bbcStatEvent({behaviorType:'reg'}) //统计埋点
                        let userinfo = res.userInfo;
                        this.getWxXcxCoce(userinfo);
                    }
                }
            })
        },
            
        //授权登录
        quickLogin (){
                
            if (!this.check_agreement) {
                this.$api.msg('请同意用户注册协议及隐私政策!');
                return false;
            }
                
            this.$setStorageSync('fromurl', {url:'/pages/tabbar/personalcenter'});
            let {client} = this;
            let _this = this;
            //#ifdef APP-PLUS
            uni.login({
                provider: 'weixin',
                success: function (loginRes) {
                    if (loginRes.errMsg == 'login:ok'){
                        //授权登录成功
                        // 获取用户信息
                        uni.getUserInfo({
                            provider: 'weixin',
                            success: function (infoRes) {
                                let tar_params = {};
                                tar_params.unionid = loginRes.authResult.unionid;
                                tar_params.openid = loginRes.authResult.openid;
                                tar_params.userInfo = JSON.stringify(infoRes.userInfo);
                                tar_params.source = client;
                                _this.goLogin(tar_params);
                            }
                        });
                    }
                }
            });
            //#endif
            //#ifdef H5
            let tar_url = location.href;
            tar_url += location.href.indexOf('?')>-1?'&':'?';
            tar_url += 'ori_url='+location.href;
            let uricode = encodeURIComponent(tar_url)
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + getApp().globalData.h5AppId +
                    '&redirect_uri=' + uricode + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
            //#endif
        },
        //登录 data为除购物车信息外的接口参数，对象类型
        goLogin(data){
            let _this = this;
            let param = {};
            param.url = 'v3/member/front/login/wechat/login';
            param.data = {...data};

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
            param.method = 'POST';
            this.$request(param).then(res => {
                if (res.state == 200) {
                    //更新登录时间
                    this.$setStorage({
                        key: 'bbc_login_time',
                        data: new Date().getTime()
                    });
                    uni.removeStorage({
                        key: 'cart_list'
                    }); //清除购物车数据
                    if (res.data.redirect == undefined){
                        //登录成功 获取个人中心的数据
                        res.data.loginTime = Date.parse(new Date());//登录时间
                        _this.login(res.data);
                        this.$bbcStatEvent({behaviorType:'reg'}) //统计埋点
                        _this.$request({
                            url: 'v3/member/front/member/memberInfo'
                        }).then(result => {
                            _this.setUserCenterData(result.data);
                            _this.$loginGoPage();
                        }).catch(() => {})
                    } else if (res.data.redirect != undefined){
                        //用户未注册，需要绑定手机号进行注册
                        _this.$Router.push({path:'/pages/public/bindMobile',query:{code:res.data.bindKey}})
                    }

                } else {
                    //错误提示
                    _this.$api.msg(res.msg);
                }
                uni.hideLoading();
            }).catch(() => {
                uni.hideLoading();
            })
        },

        //跳转协议页面
        agreement() {
            this.$Router.push('/pages/privacyPolicy/privacyPolicy')
        },
        //光标聚焦事件
        setFocus(e){
            this.curFocus = e.currentTarget.dataset.key;
        },
        //获取图形验证码
        getImgCode() {
            this.$request({
                url: 'v3/captcha/common/getCaptcha'
            }).then(res => {
                if (res.state == 200) {
                    this.showCodeImg = 'data:image/png;base64,' + res.data.captcha;
                    this.imgCodeKey = res.data.key;
                } else {
                    // this.$api.msg(res.data.msg);
                }
            })
        },
        //注册协议点击事件
        checkAgrement() {
            this.check_agreement = !this.check_agreement;
            this.show_check_icon = this.check_agreement ? getApp().globalData.imgUrl+'common/icon/register_checked.png' : getApp().globalData.imgUrl+'common/icon/register_uncheck.png';
        },
        inputChange(e) {
            const key = e.currentTarget.dataset.key;
            this[key] = e.detail.value;
        },
        navBack() {
            this.$back()
        },
        toRegist() {
            const {
                mobile,
                smsCode,
                imgCode,
                imgCodeKey,
                logining
            } = this;
            if (!(mobile && smsCode && imgCode) || logining) {
                return;
            }
            if (mobile.length<11){
                this.$api.msg('请填写格式正确的手机号');
                return;
            }
            if (!this.check_agreement) {
                this.$api.msg('请同意用户注册协议及隐私政策!');
                return false;
            }
            this.logining = true;
            let param = {};
            param.url = 'v3/frontLogin/oauth/register';
            param.data = {};
            param.method = 'POST';
            param.data.phone = mobile;
            param.data.code = smsCode;
            param.data.verifyCode = imgCode;
            param.data.verifyKey = imgCodeKey;
            // #ifdef APP-PLUS
            param.data.source = uni.getSystemInfoSync().platform == 'android'?3:4
            // #endif
            // #ifdef H5
            param.data.source = 2
            // #endif
            // #ifdef MP-WEIXIN
            param.data.source = 6
            // #endif
            if (this.spreaderMemberId){
                param.data.spreaderKey = this.spreaderMemberId
            }
            //如果有缓存的购物车数据，登录需要把数据同步，并清除本地缓存
            let local_cart_data = this.$getStorageSync('cart_data'); //这里需要同步获取
            if (local_cart_data) {
                param.data.cartInfo = JSON.stringify(local_cart_data);
            }
            param.method = 'POST';
            this.$request(param).then(res => {
                if (res.state == 200) {
                    //更新登录时间
                    this.$setStorage({
                        key: 'bbc_login_time',
                        data: new Date().getTime()
                    });
                    this.$removeStorage({
                        key: 'cart_data'
                    }); //清除购物车数据
                    this.$bbcStatEvent({behaviorType:'reg'}) //统计埋点
                    res.data.loginTime = Date.parse(new Date());//登录时间
                    this.login(res.data);
                    //获取个人中心的数据
                    this.$request({
                        url: 'v3/member/front/member/memberInfo'
                    }).then(result => {
                        this.setUserCenterData(result.data);
                        const pages = getCurrentPages();
                        if (pages.length > 1) {
                            // 直接返回上两级页面，否则会跳到登录页
                            this.$Router.back(2)
                        } else {
                            this.$Router.pushTab(`/pages/tabbar/personalcenter`);
                        }
                    }).catch(() => {})


                } else {
                    //错误提示
                    this.$api.msg(res.msg);
                    // 验证码刷新
                    this.getImgCode()
                }
                this.logining = false;
            })
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
            } else if (!this.imgCode) {
                this.$api.msg('请输入图形验证码!');
            } else {
                let param = {};
                param.url = 'v3/msg/front/commons/getCaptcha';
                param.data = {};
                param.data.verifyType = 2;
                param.data.mobile = this.mobile;
                param.data.verifyCode = this.imgCode;
                param.data.verifyKey = this.imgCodeKey;
                this.$request(param).then(res => {
                    if (res.state == 200) {
                        this.countDownM = 60;
                        this.countDown();
                    } else {
                        this.$api.msg(res.msg)
                        this.imgCode = '';
                        this.getImgCode();
                    }
                })
            }
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
        
        getWxAuthority(){
            this.$request({
                url:'v3/system/front/setting/getSettings',
                data:{
                    names:'login_wx_app_is_enable'
                }
            }).then(res=>{
                this.isWxEnable = res.data[0]
            })
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

        &:nth-child(2) {
            .pwd-right {
                position: absolute;
                right: 6rpx;
                top: 14rpx;
                display: flex;
                align-items: center;

                .clear-pwd {
                    font-size: 26rpx;
                    color: #ddd;
                }

                image {
                    width: 132rpx;
                    height: 55rpx;
                    box-shadow: 0px 5rpx 9rpx 1rpx rgba(102, 102, 102, 0.1);
                    border-radius: 6rpx;
                    margin-left: 20rpx;
                }
            }
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
                background: transparent;
                line-height: auto;
                height: auto;
                &::after {
                    border: none;
                }

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

        .register_icon {
            width: 46rpx;
            height: 46rpx;
        }

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
            color: #949494;
            font-size: 28rpx;
            line-height: 34rpx;
        }

        .register {
            color: #FC1C1C;
            font-size: 28rpx;
            line-height: 34rpx;
        }
    }
</style>
