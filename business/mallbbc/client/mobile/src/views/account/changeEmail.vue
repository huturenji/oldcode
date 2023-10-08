<!-- 修改电子邮箱页面 -->
<template>
    <view class="container flex_column_start_start">
        <template v-if="step==1">
            <view class="bind_mobile flex_row_start_center">
                {{$L('使用已绑定邮箱')}}{{userCenterData.memberEmail}}{{$L('进行身份验证')}}
            </view>
            <view class="main_content">
                <view class="input-item pwd_wrap flex_row_between_center">
                    <input type="number" class="sms_code" :value="smsCodeOri" maxlength="4" :placeholder="$L('请输入邮箱验证码')" placeholder-class='smsCodePlaceholder'
                     data-key="smsCodeOri" @input="inputChange" @confirm="toLogin" />
                    <view class="pwd-right flex_row_end_center">
                        <text class="clear-pwd iconfont icon_close" v-show="smsCodeOri" @click="clearContent('smsCodeOri')"></text>
                        <view :style="{opacity: countDownM?0.3:1}" class="sms-code-view" @click="getSmsCode">
                            <text class="sms-code">{{countDownM?`${countDownM}s后重新获取`:'获取验证码'}}</text>
                        </view>
                    </view>

                </view>
            </view>
        </template>
        <template v-if="step==2">
            <view class="second_main_content">
                <view class="flex_row_between_center input-item pwd_wrap ">
                    <input type="text" class="sms_code" :value="email" maxlength="50" :placeholder="$L('请输入新邮箱')" placeholder-class='smsCodePlaceholder'
                     data-key="email" @input="inputChange"  />
                    <view class="pwd-right flex_row_end_center">
                        <text class="clear-pwd iconfont icon_close" v-show="email" @click="clearContent('email')"></text>
                    </view>
                
                </view>
                <view class="flex_row_between_center input-item pwd_wrap " style="margin-top: 20rpx">
                    <input type="number" class="sms_code" :value="smsCode" maxlength="4" :placeholder="$L('请输入邮箱验证码')" placeholder-class='smsCodePlaceholder'
                     data-key="smsCode" @input="inputChange" @confirm="toLogin" />
                    <view class="pwd-right flex_row_end_center">
                        <text class="clear-pwd iconfont icon_close" v-show="smsCode" @click="clearContent('smsCode')"></text>
                        <view :style="{opacity: countDownM?0.3:1}" class="sms-code-view" @click="getSmsCode">
                            <text class="sms-code">{{countDownM?`${countDownM}s后重新获取`:'获取验证码'}}</text>
                        </view>
                    </view>
                
                </view>
            </view>
        </template>
        <view class="confirm_btn flex_row_center_center" @click="confirm">
            确定
        </view>
        <uni-popup ref="popup" type="dialog">
            <uni-popup-dialog type="input" :title="$L('温馨提示')" :content="bindTip" :duration="2000"  before-close="true" @close="closeDialog" @confirm="confirmBind"></uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script>
import {
    mapState,mapMutations
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
            email:'',//新邮箱
            smsCodeOri: '', //邮箱验证码（原先的）
            smsCode: '', //新邮箱验证码
            step: 1, //步骤
            countDownM: 0,//邮箱验证码倒计时
            timeOutId:'',//定时器的返回值
            bind:'',//是否进行绑定，1-解绑，0-不解绑
            bindTip:''//弹框内容提示
        };
    },
    computed: {
        ...mapState(['userInfo', 'userCenterData'])
    },
    onLoad() {

    },
    methods: {
        ...mapMutations(['setUserCenterData']),
        inputChange(e) {
            const key = e.currentTarget.dataset.key;
            this[key] = e.detail.value;
        },
        //清空输入的内容
        clearContent(type) {
            this[type] = '';
        },
        //获取邮箱验证码
        getSmsCode() {
            if (this.countDownM){
                return;
            }
            //验证邮箱
            if (this.step==2&&!this.$checkEmail(this.email)) {
                return;
            }
            let param = {};
            param.url = 'v3/msg/front/commons/sendVerifyCode';
            param.data = {};
            param.method = 'GET';
            param.data.verifyType = 1;
            param.data.changeType = this.step==1?'old':'new';
            param.data.verifyAddr = this.step==1?this.userCenterData.memberEmail:this.email;
            this.$request(param).then(res => {
                this.$api.msg(res.msg);
                if (res.state == 200){
                    this.countDownM = 60;
                    this.countDown();
                } else if (res.state == 267){
                    if (this.step == 2){
                        this.step = 1;
                        //设置页面标题
                        uni.setNavigationBarTitle({
                            title: '身份验证'
                        });
                    }
                }
            })
        },
        //倒计时
        countDown() {
            this.countDownM--;
            if (this.countDownM == 0) {
                clearTimeout(this.timeOutId);
            } else {
                this.timeOutId = setTimeout(this.countDown,1000);
            }
        },
        //确认事件
        confirm(){
            let param = {};
            param.data = {};
            param.method = 'POST';
            param.data.key = this.userInfo.access_token;
            if (this.step == 1){
                param.url = 'v3/member/front/memberPassword/verifyOldEmail';
                param.data.emailCode = this.smsCodeOri;
                param.data.memberEmail = this.userCenterData.memberEmail;
            } else {
                //验证邮箱是否正确
                if (!this.$checkEmail(this.email)) {
                    return false
                }
                param.url = 'v3/member/front/memberPassword/editEmail';
                param.data.memberEmail = this.email;
                param.data.emailCode = this.smsCode;
                if (this.bind != ''){
                    param.data.isUnbound = this.bind;
                }
            }
            this.$request(param).then(res => {
                if (res.state == 200){
                    this.$api.msg(res.msg);
                    if (this.step == 1){
                        this.step = 2;
                        //重置验证码倒计时
                        this.countDownM = 1;
                        this.countDown();
                        //设置页面标题
                        uni.setNavigationBarTitle({
                            title: '修改电子邮箱'
                        });
                    } else {
                        //更新个人信息数据
                        this.userCenterData.memberEmail = this.email;    
                        this.setUserCenterData(this.userCenterData);
                        //返回上级页面
                        setTimeout(() => {
                            this.$Router.push('/pages/account/account')
                        }, 2000)
                    }
                } else if (res.state == 267){
                    //提示是否进行绑定
                    this.bindTip = res.msg;
                    this.$refs.popup.open();
                } else {
                    this.$api.msg(res.msg);
                }
            })
        },
        //关闭弹框
        closeDialog(){
            this.bind = 0;
            this.$refs.popup.close();
            //返回上级页面
            setTimeout(() => {
                this.$Router.back(1)
            }, 200)
        },
        //确认绑定
        confirmBind(){
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

    .container {
        display: flex;
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
        
        .second_main_content{
            display: flex;
            flex-direction: column;
            flex: 1;
            width: 100%;
            background-color: #fff;
            margin-top: 20rpx;
            padding: 20rpx 40rpx 0;
        }

        .main_content {
            display: flex;
            flex: 1;
            width: 100%;
            background-color: #fff;
            padding: 20rpx 40rpx 0;
        }
        .input-item {
            height: 100rpx;
            border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
            position: relative;
            width: 100%;
            .sms_code_laceholder {
                color: #949494;
                font-size: 26rpx;
            }
        
            .sms_code {
                font-size: 28rpx;
                color: $main-font-color;
            }
        
            .clear-account {
                position: absolute;
                right: 6rpx;
                top: 28rpx;
                font-size: 24rpx;
                color: #999;
            }
        
            .pwd-right {
                flex-shrink: 0;
        
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
        
        .confirm_btn {
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
        }
    }
</style>
