<!-- 修改登录密码、修改支付密码 -->
<template>
    <view class="container flex_column_start_center">
        <view class="input-content flex_column_start_center">
            <view class="input-item pwd_wrap">
                <input type="text" :value="passwordOld" :placeholder="$L('请输入旧密码')" maxlength="20" :password="!showPwdOld" data-key="passwordOld"
                 placeholder-class='placeholder_class' @input="inputChange" :cursor="passwordOld.length"/>
                <view class="pwd-right">
                    <text class="clear-pwd iconfont icon_close" v-show="passwordOld" @click="clearContent('passwordOld')"></text>
                    <text :class="pwdStateOld" @click="changePwdState('showPwdOld')"></text>
                </view>
            </view>
            <!-- <view class="confirmState">
                <text>{{passwordOldState}}</text>
            </view> -->
            <view class="input-item pwd_wrap">
                <input type="text" :value="passwordNew" :placeholder="$L('建议设置6～20位英文、数字或符号的新密码')" maxlength="20" :password="!showPwdNew"
                 data-key="passwordNew" placeholder-class='placeholder_class' @input="inputChange" @confirm="confirm" />
                <view class="pwd-right">
                    <text class="clear-pwd iconfont icon_close" v-show="passwordNew" @click="clearContent('passwordNew')"></text>
                    <text :class="pwdStateNew" @click="changePwdState('showPwdNew')"></text>
                </view>
            </view>
            <!-- <view class="confirmState">
                <text>{{passwordNewState}}</text>
            </view> -->
        </view>
        <button class="confirm-btn" @click="confirm" :disabled="logining">{{$L('确定')}}</button>
    </view>
</template>

<script>
import {
    mapMutations,
    mapState
} from 'vuex';

export default {
    data() {
        return {
            source: '', //页面来源： change_login:重置登录密码change_pay:修改支付密码
            passwordOld: '',
            passwordNew: '',
            smsCode: '',
            logining: false,
            showPwdOld: false,
            showPwdNew: false,
            countDownM: 0, //短信验证码倒计时
            timeOutId: '', //定时器的返回值,
            passwordNewState:'',
            passwordOldState:''
                
        }
    },
    onLoad() {
        // this.source = this.$Route.query.source;
        // let page_title = ''
        // if (this.$Route.query.source == 'change_login') {
        //     page_title = '修改登录密码';
        // } else if (this.$Route.query.source == 'change_pay') {
        //     page_title = '修改支付密码';
        // }
        // //设置页面标题
        // uni.setNavigationBarTitle({
        //     title: page_title
        // });

    },
    mounted(){
        this.source = this.$Route.query.source;
        let page_title = ''
        if (this.$Route.query.source == 'change_login') {
            page_title = '修改登录密码';
        } else if (this.$Route.query.source == 'change_pay') {
            page_title = '修改支付密码';
        }
        //设置页面标题
        uni.setNavigationBarTitle({
            title: page_title
        });
    },
    computed: {
        ...mapState(['userCenterData']),
        userInfo:{
            get(){
                return this.$store.state.userInfo
            },
            set(){}
        },
        pwdStateOld: function() {
            return {
                'pwd-tab': true,
                iconfont: true,
                icon_browse: this.showPwdOld,
                icon_hide: !this.showPwdOld
            }
        },
        pwdStateNew: function() {
            return {
                'pwd-tab': true,
                iconfont: true,
                icon_browse: this.showPwdNew,
                icon_hide: !this.showPwdNew
            }
        }
    },
    methods: {
        ...mapMutations(['login', 'setUserCenterData', 'userInfo']),
        inputChange(e) {
            const key = e.currentTarget.dataset.key;
            this[key] = e.detail.value
            if (/[\u4E00-\u9FA5]/g.test(e.detail.value)){
                this[key+'State'] = '密码格式不正确'
            } else {
                this[key+'State'] = ''
            }
                
        },
        navBack() {
            this.$Router.back(1)
        },
        //确认事件
        confirm() {
            const {
                passwordOld,
                passwordNew
            } = this;
                //密码的验证 6～20位，英文、数字或符号
            if (!this.$checkPwd(passwordOld)||!this.$checkPwd(passwordNew)) {
                return false
            }
            let param = {};
            param.data = {};
            param.method = 'POST';
            if (this.source == 'change_pay'){ //修改支付密码
                param.url = 'v3/member/front/memberPassword/editPayPwd';
                param.data.oldPayPwd = passwordOld;
                param.data.payPwd = passwordNew;
            } else if (this.source == 'change_login'){ //修改登录密码
                param.url = 'v3/member/front/memberPassword/editLoginPwd';
                param.data.oldLoginPwd = passwordOld;
                param.data.loginPwd = passwordNew;
            }
            this.$request(param).then(res => {
                this.$api.msg(res.msg);
                if (res.state == 200) {
                    setTimeout(() => {
                        this.$Router.back(1)
                    }, 2000)
                    this.logining = false;
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
        changePwdState(type) {
            this[type] = !this[type];
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
    
    .confirmState{
        width: 100%;
        padding-left: 22rpx;
        font-size: 24rpx;
        color: #FC1C1C;
        margin-top: 10rpx;
        margin-bottom: 30rpx;
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
        margin-top: 20rpx;
        background-color: #fff;
        padding: 0 40rpx;
    }

    .input-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        width: 100%;
        padding: 0 20rpx;
        height: 80rpx;
        margin-bottom: 40rpx;
        border-bottom: 1rpx solid #f2f2f2;
        position: relative;

        &:first-child {
            margin-top: 40rpx;
        }

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


        .pwd-right {
            position: absolute;
            right: 6rpx;
            top: 14rpx;


            .clear-pwd {
                font-size: 24rpx;
                color: #999;
            }

            .pwd-tab {
                font-size: 22rpx;
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
        margin: 0 41rpx;
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(-90deg, rgba(252, 29, 28, 1) 0%, rgba(255, 122, 24, 1) 100%);
        border-radius: 44rpx;
        left: 50%;
        bottom: 40rpx;
        transform: translateX(-375rpx);
        color: #fff;
        font-size: 36rpx;
    }
</style>
