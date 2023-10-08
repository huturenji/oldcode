<template>
    <view class="container">
        <view class="title">
            <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/login/icon_login_LOGO.svg" mode="widthFix"></image>
            <view class="text">商户端</view>
        </view>

        <view class="input_wrap">
            <view class="input">
                <u--input
                    v-model="account"
                    placeholder="商户账号"
                    clearable
                    fontSize="17"
                    border="bottom"
                    :placeholderStyle="placeholderStyle"
                >
                    <template slot="prefix">
                        <image class="prefix_icon" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/login/btn_common_zhanghao.svg" mode="widthFix"></image>
                    </template>
                </u--input>
            </view>
            <view class="input">
                <u--input
                    v-model="password"
                    placeholder="登录密码"
                    clearable
                    password
                    border="bottom"
                    :placeholderStyle="placeholderStyle"
                    fontSize="17"
                    color="#222222"
                >
                    <template slot="prefix">
                        <image class="prefix_icon" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/login/btn_common_mima.svg" mode="widthFix"></image>
                    </template>
                </u--input>
            </view>
            <view class="input">
                <!-- 注意：由于兼容性差异，如果需要使用前后插槽，nvue下需使用u--input，非nvue下需使用u-input -->
                <!-- #ifndef APP-NVUE -->
                <u-input  
                    v-model="verifyCode"
                    placeholder="请输入验证码"
                    border="bottom"
                    fontSize="17"
                    :placeholderStyle="placeholderStyle"
                >
                <!-- #endif -->
                <!-- #ifdef APP-NVUE -->
                <u--input 
                    v-model="verifyCode"
                    placeholder="请输入验证码"
                    border="bottom"
                    fontSize="17"
                    :placeholderStyle="placeholderStyle"
                >
                <!-- #endif -->
                    <template slot="suffix">
                        <view @click="getCaptcha" class="code_container">
                            <image :src="code" mode="widthFix"></image>
                        </view>
                    </template>
                    <template slot="prefix">
                        <image class="prefix_icon" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/login/btn_common_yanzhengma.svg" mode="widthFix"></image>
                    </template>
                <!-- #ifndef APP-NVUE -->
                </u-input>
                <!-- #endif -->
                <!-- #ifdef APP-NVUE -->
                </u--input>
                <!-- #endif -->
            </view>
        </view>

        <view class="btn">
            <u-button @click="login" color="#FF711E" text="登录" shape="circle" ></u-button>
        </view>
    </view>
</template>

<script>
import loginHandler from '@/utils/auth/handler';
import { isEmpty, setStorageSync } from '@/utils/common';
import { setTokenInfoToStorage } from '@/utils/auth/index';
import config from '@/common/lib/config'
export default {
    mixins: [],
    data() {
        return {
            code: '',
            storeConfig: {},
            password:'', // 密码
            account:'', // 账号
            verifyCode:'', // 验证码
            verifyKey:'' // 验证码key
        };
    },
    components: {
    },
    // 设置当前页面分享到朋友
    onShareAppMessage(option) {
        
    },

    computed:{
        // placehoder的样式
        placeholderStyle(){
            return "fontSize: 34rpx;color: #C2C2C2;"
        }
    },
 
    created() {
        this.getCaptcha()
        this.getStoreSetting()
    },
    onHide(){
    },
 
    methods: {
        // 获取验证码
        getCaptcha(){
            loginHandler.getCaptcha().then(res => {
                if(res.state == 200 && !!res.data.key){
                    this.code = `data:image/png;base64,${res.data.captcha}`;
                    this.verifyKey = res.data.key;
                }
            }).catch(e => {
                console.error(e);
            })
        },

        // 获取店铺配置相关信息
        getStoreSetting(){
            loginHandler.getStoreSetting().then(res => {
                if(res.state == 200 && res.data?.length){
                    this.storeConfig = res.data[0];
                }
            }).catch(e => {
                console.error(e);
            })
        },

        // 检测相关的参数为必填
        checkParams(){
            if(isEmpty(this.account)){
                uni.showToast({
                    icon: 'none',
                    title: '用户名不能为空'
                })
                return false
            }
            if(isEmpty(this.password)){
                uni.showToast({
                    icon: 'none',
                    title: '密码不能为空'
                })
                return false
            }
            if(isEmpty(this.verifyCode)){
                uni.showToast({
                    icon: 'none',
                    title: '验证码不能为空'
                })
                return false
            }
            return true
        },
        
        // 获取店铺配置相关信息
        login(){
            if(!this.checkParams()){ return false }
            let params = {
                username: this.account,
                password: this.password,
                verifyCode: this.verifyCode,
                verifyKey: this.verifyKey
            }
            uni.showLoading({
                title: '登录中',
                mask: true
            })
            loginHandler.login(params).then(async res => {
                if(res.state == 200 && res.data.access_token){
                    
                    // 将token和refresh_token存入缓存
                    let tokenInfo = {
                        access_token: res.data.access_token || '',
                        refresh_token: res.data.refresh_token || ''
                    }
                    setTokenInfoToStorage(tokenInfo)

                    let shopList = res.data.offlineShopVOList || [];
                    this.setShopList(shopList);

                    let userInfo = {
                        vendorName: res.data.vendorName || '',
                        vendorNickname: res.data.vendorNickname || ''
                    }
                    this.setUserInfo(userInfo || {});

                    this.setVendorId(res.data.vendorId || '');
                    this.redirectToIndex()
                } else {
                    this.getCaptcha()
                    uni.showToast({
                        icon: 'none',
                        title: res.msg
                    })
                }
            }).catch(e => {
                console.error(e);
                this.getCaptcha()
            }).finally(() => {
                uni.hideLoading()
            })
        },    
        
        /**
         * 将关联的门店列表存储到缓存localStorage
         */
        setShopList(shopList = []){
            setStorageSync(config.STORAGE_CACHE_KEY.SHOPLIST_CACHE_KEY, shopList);
        },

        /**
         * 将当前店铺vendorId存储到缓存localStorage
         */
        setVendorId(vendorId = ''){
            setStorageSync(config.STORAGE_CACHE_KEY.VENDORID, vendorId);
        },
        
        /**
         * 将当前店铺登录人信息存储到缓存localStorage
         */
        setUserInfo(userInfo = ''){
            setStorageSync(config.STORAGE_CACHE_KEY.USER_INFO, userInfo);
        },


        redirectToIndex(){
            uni.redirectTo({
                url: '/views/shop/index'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
page{
    background-color: #fff;
}
.container{
    padding: 0 80rpx;
    .input_wrap{
        margin-top: 64rpx;
    }
    .input{
       margin-top: 20rpx;
       position: relative;
       ::v-deep .u-input{
            padding: 24rpx 0 !important;
       }
       .prefix_icon{
            width: 36rpx;
            margin-right: 8rpx;
       }
    }
}
.title{
    margin-top: 56rpx;
    text-align: center;
    font-size: 40rpx;
    font-weight: bold;
    image{
        width: 144rpx;
        height: 144rpx;
    }
    .text{
        margin-top: 4rpx;
    }
}
.code_container{
    position: absolute;
    width: 168rpx;
    height: 86rpx;
    right: 0rpx;
    top: 50%;
    margin-top: -52rpx;
    background-color: #eff2f5;
    display: flex;
    align-items: center;
    justify-content: center;
    image{
        width: 152rpx;
    }
}
.btn{
    margin-top: 92rpx;
    ::v-deep .u-button{
        height: 88rpx;
        color: #fff;
        font-size: 30rpx;
        font-weight: 600;
    }
}
</style>
