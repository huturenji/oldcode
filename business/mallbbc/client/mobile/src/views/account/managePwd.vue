<!-- 设置登录密码、设置支付密码、重置支付密码页面 -->
<template>
    <view class="container flex_column_start_center">
        <view class="bind_mobile flex_row_start_center">
            {{$L('您已绑定手机号')}}{{userCenterData.memberMobile?this.$replaceConByPosition(this.userCenterData.memberMobile,4,6,'****'):''}},{{$L('请用该手机号接收短信')}}
        </view>
        <view class="input-content flex_column_start_center">
            <view class="input-item pwd_wrap">
                <input type="number" :value="smsCode" maxlength="6" :placeholder="$L('请输入短信验证码')" data-key="smsCode" @input="inputChange" placeholder-class='placeholder_class'/>
                <view class="pwd-right">
                    <text class="clear-pwd iconfont icon_close" v-show="smsCode" @click="clearContent('smsCode')"></text>
                    <view :style="{opacity: countDownM?0.3:1}" class="sms-code-view" @click="getSmsCode">
                        <text class="sms-code">{{countDownM?`${countDownM}s后重新获取`:'获取验证码'}}</text>
                    </view>
                </view>

            </view>
            <view class="input-item pwd_wrap">
                <input type="text" :value="password" :placeholder="$L('建议6～20位英文、数字或符号的新密码')" maxlength="20" :password="!showPwd" data-key="password" placeholder-class='placeholder_class'
                 @input="inputChange"/>
                <view class="pwd-right">
                    <text class="clear-pwd iconfont icon_close" v-show="password" @click="clearContent('password')"></text>
                    <text :class="pwdState" @click="changePwdState"></text>
                </view>
            </view>
            <view class="input-item pwd_wrap">
                <input type="text" :value="confirmPwd" placeholder="再次确认密码" maxlength="20" data-key="confirmPwd" :password="!showPwd" placeholder-class='placeholder_class'
                 @input="inputChange" @confirm="confirmPwds" />
                <view class="pwd-right">
                    <text class="clear-pwd iconfont icon_close" v-show="confirmPwd" @click="clearContent('confirmPwd')"></text>
                    <text :class="pwdState" @click="changePwdState"></text>
                </view>
            </view>
            <view class="confirmState">
                <text>{{confirmState}}</text>
            </view>
            
        </view>
        <button class="confirm-btn" @click="confirm" :disabled="logining">{{$L('确定')}}</button>
    </view>
</template>

<script>
import {
    mapMutations,mapState
} from 'vuex';

export default {
    data() {
        return {
            source: '', //页面来源： reset_pay:重置支付密码 set_login:设置登录密码，set_pay:设置支付密码
            password: '',
            smsCode: '',
            logining: false,
            showPwd: false,
            countDownM: 0,//短信验证码倒计时
            timeOutId:'',//定时器的返回值,
            confirmPwd:'',
            confirmState:''
        }
    },
    onLoad() {
        // this.source = this.$Route.query.source;
        // let page_title = ''
        // if (this.$Route.query.source == 'reset_pay') {
        //     page_title = '重置支付密码';
        // } else if (this.$Route.query.source == 'set_login') {
        //     page_title = '设置登录密码';
        // } else if (this.$Route.query.source == 'set_pay') {
        //     page_title = '设置支付密码';
        // }
        // //设置页面标题
        // uni.setNavigationBarTitle({
        //     title: page_title
        // });

    },
    mounted(){
        this.source = this.$Route.query.source;
        let page_title = ''
        if (this.$Route.query.source == 'reset_pay') {
            page_title = '重置支付密码';
        } else if (this.$Route.query.source == 'set_login') {
            page_title = '设置登录密码';
        } else if (this.$Route.query.source == 'set_pay') {
            page_title = '设置支付密码';
        }
        //设置页面标题
        uni.setNavigationBarTitle({
            title: page_title
        });
    },
    computed: {
        ...mapState(['userInfo','userCenterData']),
        pwdState: function() {
            return {
                'pwd-tab': true,
                iconfont: true,
                iconkejian: this.showPwd,
                iconbukejian: !this.showPwd
            }
        }
    },
    methods: {
        ...mapMutations(['login', 'setUserCenterData','userInfo']),
        inputChange(e) {
            const key = e.currentTarget.dataset.key;
            this[key] = e.detail.value;
        },
        navBack() {
            this.$Router.back(1)
        },
        //获取短信验证码
        getSmsCode() {
            if (this.countDownM){
                return;
            }
            let param = {};
            param.url = 'v3/msg/front/commons/sendVerifyCode';
            param.data = {};
            param.method = 'GET';
            param.data.verifyType = 2;
            param.data.verifyAddr = this.userCenterData.memberMobile;
            this.$request(param).then(res => {
                this.$api.msg(res.msg);
                if (res.state == 200){
                    this.countDownM = 60;
                    this.countDown();
                }
            })
        },
        confirmPwds(){
            if (this.confirmPwd!=this.password){
                this.confirmState = '密码确认不一致'
            } else {
                this.confirmState = ''
            }
        },
        //确认事件
        confirm() {
            const {
                password,
                smsCode
            } = this;
                //密码的验证 6～20位，英文、数字或符号
                
            if (!this.smsCode){
                this.$api.msg('请填短信验证码')
                return false
            }
                
                
            if (!this.$checkPwd(password)) {
                return false;
            }
            if (this.confirmPwd==''){
                this.confirmState = '请输入确认密码'
                return false
            } else if (this.confirmPwd!=this.password){
                this.confirmState = '密码确认不一致'
                return false
            }
            this.confirmState = ''
                
                
            let param = {};
            param.data = {};
            param.method = 'POST';
            if (this.source == 'reset_pay'||this.source == 'set_pay'){
                param.url = 'v3/member/front/memberPassword/addPayPwd';
                param.data.memberMobile = this.userCenterData.memberMobile;
                param.data.verifyCode = smsCode;
                param.data.payPwd = password;
            } else if (this.source == 'set_login'){
                param.url = 'v3/member/front/memberPassword/addLoginPwd';
                param.data.memberMobile = this.userCenterData.memberMobile;
                param.data.verifyCode = smsCode;
                param.data.loginPwd = password;
            }
                
            this.$request(param).then(res => {
                this.$api.msg(res.msg);
                if (res.state == 200) {
                    if (this.source == 'set_pay'){
                        this.userCenterData.hasPayPassword = 1;
                    } else if (this.source == 'set_login'){
                        this.userCenterData.hasLoginPassword = 1;
                    }
                    //更新个人信息数据
                    this.setUserCenterData(this.userCenterData);
                    setTimeout(() => {
                        this.$Router.back(1)
                    }, 2000)

                } else {
                    this.logining = false;
                }
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
        },
        //倒计时
        countDown() {
            this.countDownM--;
            if (this.countDownM == 0) {
                clearTimeout(this.timeOutId);
            } else {
                this.timeOutId = setTimeout(this.countDown,1000);
            }
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

    .container {
        flex: 1;

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
    
    .confirmState{
        width: 100%;
        font-size: 24rpx;
        color: #FC1C1C;
    }

    .input-item {
        display: flex;
        flex-direction: column;
        align-items: space-between;
        justify-content: center;
        width: 100%;
        padding: 0 20rpx;
        height: 80rpx;
        margin-bottom: 40rpx;
        border-bottom: 1rpx solid #f2f2f2;
        position: relative;
        
        .placeholder_class{
            color: #949494;
            font-size: 26rpx;
            line-height: 80rpx;
        }

        .clear-account {
            position: absolute;
            right: 6rpx;
            top: 28rpx;
            font-size: 24rpx;
            color: #999;
        }

        &:first-child{
            margin-top: 40rpx;
            .pwd-right {
                position: absolute;
                right: 6rpx;
                top: 6rpx;
                display: flex;
                align-items: center;
                z-index: 100;
                

                .clear-pwd {
                    font-size: 24rpx;
                    color: #999;
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

        
        &:nth-child(3),&:nth-child(2){
            margin-bottom: 20rpx;

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
        }
    }


    .confirm-btn {
        position: fixed;
        width: 668rpx;
        margin: 0 41rpx;
        height: 88rpx;
        background: linear-gradient(-90deg, rgba(252, 29, 28, 1) 0%, rgba(255, 122, 24, 1) 100%);
        border-radius: 44rpx;
        left: 50%;
        transform: translateX(-375rpx);
        bottom: 40rpx;
        color: #fff;
        font-size: 36rpx;
        line-height: 88rpx;
    }
</style>
