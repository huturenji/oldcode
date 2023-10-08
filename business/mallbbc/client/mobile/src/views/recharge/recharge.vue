<!-- 账号充值 -->
<template>
    <view class="container">
        <view v-if="!rechargeSn" class="amount_part flex_column_start_start">
            <text class="title">{{$L('充值金额')}}</text>
            <view class="amount_view flex_row_start_start">
                <text :class="{num:true, flex_row_center_center:true,hasSelAmout:amount == item}"
                    v-for="(item,index) in amountList" :key='index' @click="selAmount(item)">{{item}}{{$L('元')}}</text>
                <input
                    :class="{num:true, flex_row_center_center:true, input_amount:true,hasSelAmout:!amount||input_amount}"
                    :placeholder="$L('请输入金额')" v-model="input_amount" placeholder-class='input_placeholder'
                    maxlength="5" @focus='selSetAmount' @blur='handleBlur' type="number" />
            </view>
        </view>
        <view class="pay_part flex_column_start_start">
            <text class="title">{{$L('选择充值方式')}}</text>
            <view v-for="(item,index) in payMethod" :key='index' @click="selectPayMethod(item)"
                :class="{item:true, b_b:index<payMethod.length-1, flex_row_between_center:true}">
                <view class="left flex_row_start_center">
                    <image class="pay_icon" :src="item.payIcon" />
                    <text class="tit">{{item.payMethodName}}</text>
                </view>
                <text
                    :class="{iconfont:true, icon_checked_radio:selData.payMethod == item.payMethod,icon_check_radio:selData.payMethod != item.payMethod,has_sel:selData.payMethod == item.payMethod}"></text>
            </view>
        </view>
        <view v-show="showBtn" class="btn_recharge flex_row_center_center" @click="reCharge">{{$L('确认充值')}}</view>
    </view>
</template>

<script>
import {
    mapState
} from 'vuex';
export default {
    data() {
        return {
            rechargeSn: '',
            selData: {},
            payMethod: [], //支付方式
            amount: 50,
            amountList: [50, 100, 200, 500, 1000],
            input_amount: '',
            balance: 0, //账户总金额
            client: 'wxbrowser', //支付发起来源 pc==pc,mbrowser==移动设备浏览器,app==app,wxxcx==微信小程序,wxbrowser==微信内部浏览器
            isAllowAutoPay: true, //当浏览器地址有code时，是否允许自动支付，如果支付失败的话置为false
            wxBrowerCode: '', //微信浏览器支付的code
            payMethodType: '', //支付发起来源，上个页面 rechargeBalance:用户充值    rechargeDetail：充值详情
            rechargeId: '', //从充值详情过来的，充值id
            showBtn: true, // 输入金额键盘弹出时隐藏确认按钮
            windowHeight: '', // 屏幕高度判断键盘弹出收起,
            isClick: true
        }
    },
    computed: {
        ...mapState(['hasLogin', 'userInfo'])
    },
    mounted() {
        if (this.$Route.query.rechargeSn) {
            this.rechargeSn = this.$Route.query.rechargeSn;
        }
        if (this.$Route.query.payMethodType) {
            this.payMethodType = this.$Route.query.payMethodType;
        }
        if (this.$Route.query.rechargeId) {
            this.rechargeId = this.$Route.query.rechargeId;
        }

        //#ifdef H5
        //判断code地址的参数 start
        let code = this.$getQueryVariable('code');
        if (code) {
            this.wxBrowerCode = code;
            if (this.$Route.query.type == 'sel') {
                this.amount = this.$Route.query.amount;
            } else if (this.$Route.query.type == 'input') {
                this.input_amount = this.$Route.query.amount;
            }
        }
        //判断code地址的参数 end
        //#endif

        this.initClient();
        this.balance = parseFloat(this.$Route.query.balance) || 0;
        this.getPayMethod();
        // 手机软键盘收起时显示确认按钮
        uni.getSystemInfo({
            success: (res) => {
                this.windowHeight = res.windowHeight;
            }
        });
        uni.onWindowResize((res) => {
            if (res.size.windowHeight < this.windowHeight) {
                this.showBtn = false;
            } else {
                this.showBtn = true
            }
        })
    },

    methods: {

        //初始化终端类型
        initClient() {
            //#ifdef APP-PLUS
            this.client = 'app';
            //#endif
            //#ifdef H5
            this.client = this.$isWeiXinBrower() ? 'wxbrowser' : 'mbrowser';
            //#endif
            //#ifdef MP-WEIXIN
            this.client = 'wxxcx';
            //#endif
        },

        //获取支付方式
        getPayMethod() {
            let {
                client,
                wxBrowerCode,
                isAllowAutoPay
            } = this;
            this.$request({
                url: 'v3/business/front/orderPay/payMethod',
                data: {
                    source: client,
                    type: 2 //支付发起类型 1==下单支付，2==余额充值/订单列表
                }
            }).then(res => {
                if (res.state == 200) {
                    res.data.forEach(item => {
                        item.payIcon = getApp().globalData.imgUrl +
                                `pay/${item.payMethod}_pay_icon.png`;
                    });
                    this.payMethod = res.data;
                    if (!wxBrowerCode) {
                        this.selData = this.payMethod[0];
                    } else {
                        //有code的话要默认选中微信支付，并直接提交订单
                        this.selData = this.payMethod.filter(item => item.payMethod == 'wx')[0];
                        if (isAllowAutoPay) {
                            this.reCharge();
                        }
                    }

                }
            }).catch(() => { })
        },
        //选择支付方式事件
        selectPayMethod(val) {
            let that = this;
            that.selData = val;
            this.isClick = true
        },
        //确认充值事件
        reCharge() {
            const {
                selData,
                rechargeSn,
                amount,
                input_amount,
                wxBrowerCode,
                client
            } = this;
            let _this = this
            uni.showLoading()
            if (!this.isClick) {
                uni.hideLoading()
                return false
            }

            this.isClick = false


            let param = {};
            param.method = 'POST';
            param.data = {};
            param.data.key = this.userInfo.access_token;
            if (rechargeSn) {
                param.url = 'v3/member/front/balanceRecharge/rechargeContinue';
                param.data.rechargeSn = rechargeSn;
            } else {
                param.url = 'v3/member/front/balanceRecharge/recharge';
                param.data.amount = amount || input_amount;
                if (!param.data.amount) {
                    this.$api.msg('请设置充值金额');
                    return false
                }
            }
            param.data.payType = selData.payType;
            param.data.payMethod = selData.payMethod;

            if (client == 'wxxcx') {
                //微信小程序支付
                uni.login({
                    success: code => {
                        param.data.code = code.code;
                        param.data.codeSource = 1; //用户code来源（JSAPI支付时必填）：1==小程序，2==微信内部浏览器
                        this.$request(param).then(res => {
                            if (res.state == 200) {
                                uni.hideLoading()
                                let tmp_data = res.data.payData;
                                if (res.data.actionType == null) {
                                    //微信小程序支付
                                    uni.requestPayment({
                                        'timeStamp': tmp_data.timeStamp,
                                        'nonceStr': tmp_data.nonceStr,
                                        'package': tmp_data.packageValue,
                                        'signType': 'MD5',
                                        'paySign': tmp_data.paySign,
                                        success: function () {
                                                
                                            _this.payTip('success');
                                        },
                                        fail: function () {
                                            _this.payTip('fail');
                                        }
                                    });
                                }

                            } else {
                                this.isClick = true
                                this.$api.msg(res.msg);
                                uni.hideLoading()
                            }
                        }).catch(() => { })
                    }
                });
                return false;
            } else if (client == 'wxbrowser') {
                //微信h5支付
                if (!wxBrowerCode) {

                    let paramStr = '';
                    if (rechargeSn) {
                        paramStr = 'type=continue';
                    } else {
                        if (amount) {
                            paramStr = 'type=sel';
                        }
                        if (input_amount) {
                            paramStr = 'type=input';
                        }
                        paramStr += '&amount=' + (amount || input_amount);
                    }

                    if (location.href.indexOf('?') > -1) {
                        location.href += '&' + paramStr;
                    } else {
                        location.href += '?' + paramStr;
                    }
                    uni.hideLoading()
                    let uricode = encodeURIComponent(location.href)
                    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + getApp()
                        .globalData.h5AppId +
                            '&redirect_uri=' + uricode +
                            '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
                    return false;
                } 
                param.data.code = wxBrowerCode;
                param.data.codeSource = 2; //用户code来源（JSAPI支付时必填）：1==小程序，2==微信内部浏览器
                    
            }
            this.$request(param).then(res => {
                if (res.state == 200) {
                    uni.hideLoading()
                    let tmp_data = res.data.payData;
                    if (res.data.actionType == 'redirect') {
                        window.location.href = tmp_data;
                    } else if (res.data.actionType == null) {
                        if (client == 'wxbrowser') {
                            //微信h5支付
                            this.$weiXinBrowerPay({
                                timestamp: tmp_data.timeStamp,
                                nonceStr: tmp_data.nonceStr,
                                package: tmp_data.packageValue,
                                signType: 'MD5',
                                paySign: tmp_data.paySign,
                                appId: tmp_data.appId, //此参数可不用
                                success: function (r) {
                                    if (r.errMsg == "chooseWXPay:ok") {
                                        _this.payTip('success');
                                    } else {
                                        _this.payTip('fail');
                                        _this.isAllowAutoPay = false; //支付失败后禁止自动支付
                                    }
                                },
                                cancel: function () {
                                    _this.payTip('fail');
                                    _this.isAllowAutoPay = false; //支付失败后禁止自动支付
                                    _this.isClick = true
                                }
                            });
                        } else if (client == 'wxxcx') {
                            //微信小程序支付
                            uni.requestPayment({
                                'timeStamp': tmp_data.timeStamp,
                                'nonceStr': tmp_data.nonceStr,
                                'package': tmp_data.packageValue,
                                'signType': 'MD5',
                                'paySign': tmp_data.paySign,
                                'success': function () {
                                    _this.payTip('success');
                                },
                                'fail': function () {
                                    _this.payTip('fail');
                                    _this.isClick = true
                                }
                            });
                        } else if (client == 'app') {
                            //APP支付
                            let provider = '';
                            let orderInfo = {};
                            if (selData.payMethod == 'wx') {
                                provider = 'wxpay';
                                orderInfo.appid = tmp_data.appId;
                                orderInfo.noncestr = tmp_data.nonceStr;
                                orderInfo.package = tmp_data.packageValue;
                                orderInfo.partnerid = tmp_data.partnerId;
                                orderInfo.prepayid = tmp_data.prepayId;
                                orderInfo.timestamp = tmp_data.timeStamp;
                                orderInfo.sign = tmp_data.sign;
                            } else if (selData.payMethod == 'alipay') {
                                provider = 'alipay';
                            }
                            uni.requestPayment({
                                provider: provider,
                                orderInfo: provider == 'alipay' ? res.data.payData : orderInfo, //订单数据
                                success: function () {
                                    _this.payTip('success');
                                },
                                fail: function () {
                                    _this.payTip('fail');
                                    _this.isClick = true;
                                }
                            });

                        }
                    } else if (res.data.actionType == 'autopost') {
                        document.write(res.data.payData);
                    }

                } else {

                    this.isClick = true
                    this.$api.msg(res.msg);
                    uni.hideLoading()
                }
            }).catch(() => { })
        },

        //支付操作完成提示
        payTip(type) {
            if (type == 'success') {
                //提示充值成功，如果来自账户充值页面，直接跳转充值明细列表页面，否则返回上一级页面（充值详情页面），并更新数据    rechargeBalance:用户充值        rechargeDetail：充值详情
                this.$api.msg('充值成功');
                if (this.payMethodType == 'rechargeBalance') {
                    this.$Router.push('/pages/recharge/list')
                } else if (this.payMethodType == 'rechargeDetail') {
                    const pages = getCurrentPages(); //当前页面栈
                    if (pages.length > 1) {
                        const beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
                        beforePage.$vm.getDetail(); //触发上个面中的方法获取订单列表 *getDetail为上个页面的方法*
                        beforePage.$vm.rechargeId = this.rechargeId; //更新上一页的充值id
                    }
                    setTimeout(() => {
                        this.$Router.back(1)
                    }, 1000)
                }
            } else if (type == 'fail') {
                //提示充值失败 刷新界面
                this.$api.msg('充值失败,请重试～');
                this.getPayMethod();
            }
        },

        //选择充值金额
        selAmount(amount) {
            this.input_amount = '';
            this.amount = amount;
        },

        //设置金额聚焦事件
        selSetAmount() {
            this.amount = '';
            this.showBtn = false
            this.isClick = true
        },
        //输入金额
        handleBlur(e) {
            this.showBtn = true
            let val = parseFloat(e.detail.value.toString());
            if (val > 5000) {
                this.$api.msg('一次最多充值5000元');
                this.input_amount = 5000;
            } else if (this.balance + val > 999999.00) {
                this.$api.msg('当前账号余额已达最大值');
            } else if (val <= 0) {
                this.$api.msg('充值金额不能为负数或者为零');
                this.input_amount = ''
            } else if (Number.isNaN(val)) {
                this.input_amount = ''
            } else {
                //小数点后最多后两位
                this.input_amount = val.toString().indexOf('.') == -1
                    ? val
                    : val.toString().substring(0, val
                        .toString().indexOf('.') + 3);
            }
        }
    }
}
</script>

<style lang="scss">
    page {
        background: $bg-color-split;
        width: 750rpx;
        margin: 0 auto;
    }

    uni-page-body {
        display: flex;
        height: 100%;
    }

    .container {
        display: flex;
        flex-direction: column;
        flex: 1;

        .amount_part {
            margin-top: 20rpx;
            width: 750rpx;
            height: 400rpx;
            background: #fff;

            .title {
                color: $main-font-color;
                font-size: 32rpx;
                line-height: 36rpx;
                margin: 30rpx 0 10rpx 20rpx;
            }

            .amount_view {
                flex-wrap: wrap;

                .num {
                    width: 223rpx;
                    height: 129rpx;
                    background: rgba(255, 255, 255, 1);
                    box-shadow: 0px 0px 20rpx 0px rgba(153, 153, 153, 0.2);
                    border-radius: 15rpx;
                    color: $main-font-color;
                    font-size: 36rpx;
                    margin: 20rpx 0 0 20rpx;
                    line-height: 129rpx;

                    &.hasSelAmout {
                        border: 1rpx solid $main-color;
                    }

                }

                .input_placeholder {
                    color: $main-third-color;
                    font-size: 24rpx;
                    text-align: center;
                }

                .input_amount {
                    text-align: center;
                }
            }

        }

        .pay_part {
            margin-top: 20rpx;
            background: #fff;
            flex: 1;

            .title {
                color: $main-font-color;
                font-size: 32rpx;
                margin-top: 30rpx;
                margin-left: 20rpx;
            }

            .item {
                width: 100%;
                padding: 20rpx;
                position: relative;

                .left {
                    .pay_icon {
                        width: 80rpx;
                        height: 80rpx;
                    }

                    .tit {
                        color: $main-font-color;
                        font-size: 28rpx;
                        margin-left: 20rpx;
                    }

                }

                .iconfont {
                    color: $main-third-color;
                    font-size: 32rpx;
                }

                .has_sel {
                    color: $main-color;
                }

                &.b_b:after {
                    left: 20rpx;
                }
            }
        }

        .btn_recharge {
            width: 670rpx;
            margin: 0 40rpx;
            height: 88rpx;
            background: linear-gradient(-90deg, rgba(252, 29, 28, 1) 0%, rgba(255, 122, 24, 1) 100%);
            box-shadow: 0px 3rpx 20rpx 0rpx rgba(252, 30, 28, 0.26);
            border-radius: 44rpx;
            color: #fff;
            font-size: 36rpx;
            position: fixed;
            left: 50%;
            transform: translateX(-375rpx);
            bottom: 40rpx;
            // top: calc(100vh - 88rpx);
            // top: 1200rpx;
        }
    }
</style>