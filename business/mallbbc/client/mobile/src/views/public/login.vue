<template>
    <view class="container">
        <text class="back-btn iconfont icon_arrow_left" @click="navBack"></text>
        <!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
        <view class="wrapper">
            <view class="login-title">
            {{$L('密码登陆')}}
            </view>
            <view class="input-content">
                <view class="input-item">
                    <input type="text" :value="mobile" placeholder="请输入账号/手机号" maxlength="20" data-key="mobile" @input="inputChange" @focus="setFocus" @blur="handleAcc"/>
                    <text class="clear-account iconfont icon_close_fill" v-show="mobile&&curFocus=='mobile'" @click="clearContent('mobile')"></text>
                </view>
                <view class="input-item pwd_wrap">
                    <input type="text" style="width: 56%;" :value="password" :placeholder="$L('请输入密码')" maxlength="20" :password="!showPwd" data-key="password"
                     @input="inputChange" @confirm="toLogin" @focus="setFocus"/>
                    <view class="pwd-right">
                        <text class="clear-pwd iconfont icon_close_fill" v-show="password&&curFocus=='password'" @click="clearContent('password')"></text>
                        <text :class="{'pwd-tab': true,iconfont: true,icon_browse: showPwd,icon_hide: !showPwd}" @click.stop="changePwdState"></text>
                        <text class="forget-pwd" @click.stop="navTo('/pages/public/forgetPwd',2)">忘记密码</text>
                    </view>

                </view>
            </view>
            <button class="confirm-btn" @click="toLogin" :style="{opacity: (!(mobile&&password)||logining)?0.5:1}">登录</button>
            <view class="login-register">
                <text class="mobile-login" @click="navTo('/pages/public/loginMobile',1)">验证码登录</text>
                <text class="register" @click="navTo('/pages/public/register',1)">用户注册</text>
            </view>
        </view>
        <view class="other-login">
            <!-- #ifdef H5 -->
            <view class="title" v-if="isWeiXinH5">
                <text >其他登录</text>
            </view>
            <!-- #endif -->

            <!-- #ifndef H5 -->
            <view class="title" v-if="isWxEnable==1">
                <text >其他登录</text>
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
                    <text>微信登录</text>
                </view>
                <!-- #endif -->
                <!-- #ifdef APP-PLUS -->
                <view class="wechat-login" @tap="quickLogin" v-if="isWxEnable==1">
                    <image class="wechat-icon" :src="imgUrl+'goods/wx_share.png'" mode="aspectFill" />
                    <text>微信登录</text>
                </view>
                <!-- #endif -->
            </view>
        </view>
        <!-- #ifndef APP-PLUS -->
        <view class="agreement-part">
            登录即代表您已同意
            <text class="agreement" @click="agreement">《用户隐私政策》</text>
        </view>
        <!-- #endif -->
        <!-- #ifdef APP-PLUS -->
        <view class="agreement-part flex_row_center_center">
            <image @click="checkAgrement" class="register_icon" :src="show_check_icon" mode="aspectFill" />
            我已阅读并同意
            <text class="agreement" @click="agreement">《用户隐私政策》</text>
        </view>
        <!-- #endif -->
    </view>
</template>

<script>
import {
    mapMutations
} from 'vuex';

export default {
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            mobile: '',
            password: '',
            logining: false,
            showPwd: false,
            curFocus:'',//当前光标所在的位置
            client: 1, //终端类型， 1、H5(微信内部浏览器) 2、H5(微信小程序)；3、app
            oriUrl:'',//不带code的页面地址
            isWeiXinH5:true, //是否为微信浏览器h5
            check_agreement: false,
            show_check_icon: getApp().globalData.imgUrl+'common/icon/register_uncheck.png',
            canIUseGetUserProfile: false,//是否可以使用getUserProfile获取用户信息，用于微信小程序
            isWxEnable:0
        }
    },
    mounted(){
        this.client = this.$getLoginClient();
        //#ifdef MP-WEIXIN
        if (uni.getUserProfile) {
            this.canIUseGetUserProfile = true;
        }
        //#endif
        //#ifdef H5
        let code = this.$getQueryVariable('code');
        // this.isWeiXinH5 = this.$isWeiXinBrower();
        if (code){
            let oriUrl = this.$Route.query.ori_url+'pages/order/pay';
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
        // this.client = this.$getLoginClient();
        // //#ifdef MP-WEIXIN
        // if (uni.getUserProfile) {
        //     this.canIUseGetUserProfile = true;
        // }
        // //#endif
        // //#ifdef H5
        // let code = this.$getQueryVariable('code');
        // // this.isWeiXinH5 = this.$isWeiXinBrower();
        // if(code){
        //     let oriUrl = this.$Route.query.ori_url+'pages/order/pay';
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
        //注册协议点击事件
        checkAgrement() {
            this.check_agreement = !this.check_agreement;
            this.show_check_icon = this.check_agreement ? getApp().globalData.imgUrl+'common/icon/register_checked.png' : getApp().globalData.imgUrl+'common/icon/register_uncheck.png';
        },
        getUser(e) {
            if (e.detail.errMsg == "getUserInfo:ok") {
                let userinfo = e.detail.userInfo;
                this.getWxXcxCoce(userinfo);
            }
        },
            
        handleAcc(){
            let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/ig,
                regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/ig;
            if (regEn.test(this.mobile) || regCn.test(this.mobile)) {
                this.mobile = ""
                this.$api.msg("名称不能包含特殊字符.");
            }
                
        },
            
        //微信小程序根据用户信息获取code
        getWxXcxCoce(userinfo) {
            this.$setStorageSync('fromurl', {url:'/pages/index/index'});
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
                        let userinfo = res.userInfo;
                        this.getWxXcxCoce(userinfo);
                    }
                }
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
        inputChange(e) {
            const key = e.currentTarget.dataset.key;
            this[key] = e.detail.value;
        },
        navBack() {
                
            this.$Router.pushTab('/pages/index/index')
        },
        toLogin() {
            if (!(this.mobile && this.password) || this.logining) {
                uni.showToast({
                    title:'请输入账号密码',
                    icon:'none',
                    duration:700
                })
                return;
            }
            // #ifdef APP-PLUS
            if (!this.check_agreement) {
                this.$api.msg('请同意用户隐私政策!');
                return false;
            }
            // #endif
            this.logining = true;
            const {
                mobile,
                password
            } = this;
                //密码的验证 6～20位，英文、数字或符号
            if (!this.$checkPwd(password)) {
                this.logining = false;
                return false
            }
            let param = {};
            param.url = 'v3/member/front/login/token';
            param.data = {};
            param.data.username = mobile;//登陆类型为1时：是用户名；为2时：是手机号
            param.data.password = password;
            param.data.loginType = 1;//登陆类型：1-账号密码登陆，2-手机验证码登陆

            //如果有缓存的购物车数据，登录需要把数据同步，并清除本地缓存
            let local_cart_list = uni.getStorageSync('cart_list')
            let cartInfo = []
            if (local_cart_list) {
                local_cart_list.storeCartGroupList.forEach(item=>{
                    item.promotionCartGroupList.forEach(item1=>{
                        item1.cartList.forEach(item2=>{
                            if (item2.isChecked == 1){
                                cartInfo.push({
                                    sku:item2.sku,
                                    buyNum:item2.buyNum
                                })
                            }
                        })
                    })
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
                    res.data.loginTime = Date.parse(new Date());//登录时间
                    this.login(res.data);
                    //如果推手分享，则建立推手分享关系
                    if (this.$getStorageSync('u')){
                        this.estabTs()
                    }
                    //获取个人中心的数据
                    this.$request({
                        url: 'v3/member/front/member/memberInfo'
                    }).then(result => {
                        this.setUserCenterData(result.data);
                        this.$loginGoPage();
                    }).catch(() => {
                    })
                } else {
                    //错误提示
                    this.$api.msg(res.msg);
                }
                this.logining = false;
            }).catch(() => {
            })
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
        },
        //授权登录
        quickLogin (){
            // #ifdef APP-PLUS
            if (!this.check_agreement) {
                this.$api.msg('请同意用户隐私政策!');
                return false;
            }
            // #endif
            this.$setStorageSync('fromurl', {url:'/pages/index/index'});
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
            // #ifdef APP-PLUS
            if (!this.check_agreement) {
                this.$api.msg('请同意用户隐私政策!');
                return false;
            }
            // #endif
            let _this = this;
            let param = {};
            param.url = 'v3/member/front/login/wechat/login';
            param.data = {...data};

            //如果有缓存的购物车数据，登录需要把数据同步，并清除本地缓存
            let local_cart_list = uni.getStorageSync('cart_list')
            let cartInfo = []
            if (local_cart_list) {
                local_cart_list.storeCartGroupList.forEach(item=>{
                    item.promotionCartGroupList.forEach(item1=>{
                        item1.cartList.forEach(item2=>{
                            if (item2.isChecked == 1){
                                cartInfo.push({
                                    sku:item2.sku,
                                    buyNum:item2.buyNum
                                })
                            }
                        })
                    })
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
                        res.data.loginTime = Date.parse(new Date());//登录时间
                        _this.login(res.data);
                        //登录成功 获取个人中心的数据
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
                    // #ifndef MP-WEIXIN
                    _this.$api.msg(res.msg);
                    // #endif
                        
                    // #ifdef MP-WEIXIN
                    uni.showToast({
                        title:res.msg,
                        icon:'none',
                        duration:2000
                    })
                    // #endif
                        
                }
                uni.hideLoading();
            }).catch(() => {
                uni.hideLoading();
            })
        },
            
        //微信登录互联开关
        getWxAuthority(){
            this.$request({
                url:'v3/system/front/setting/getSettings',
                data:{
                    names:'login_wx_app_is_enable'
                }
            }).then(res=>{
                this.isWxEnable = res.data[0]
            })
        },
            
        estabTs() {
            let {
                spreaderMemberId
            } = this
            this.$request({
                url: '/v3/spreader/front/spreaderShare/editRelation',
                method: "POST",
                data: {
                    spreaderMemberId
                }
            }).then(res => {
                if (res.state == 200) { }
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
        /* padding-top: 19.2vh; */
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
                    &.icon_hide{
                        font-size: 15rpx;
                        transform: scale(0.1)
                    }

                    &.icon_browse{
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

        input {
            height: 60upx;
            font-size: $font-base + 2upx;
            color: $font-color-dark;
            width: 80%;
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
                background: transparent;
                line-height: auto;
                height: auto;
                &::after {
                    border: none;
                }

                image {
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
            border-bottom: 1rpx solid $main-color;
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
