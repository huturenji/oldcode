import requestHandler from 'orderCommon/requestHandler.js';
// import {
//     Group,
//     Cell,
//     CellBox,
//     Flexbox,
//     FlexboxItem,
//     Confirm,
//     XButton,
//     TransferDom,
//     Popup
// } from 'vux';
// import LoadingX from "components/loading/LoadingX.vue";
import customerService from "components/customer-service/index";
import extendUtils from 'orderCommon/extend.js';
import { hotelOrderStatus } from 'orderCommon/enum/orderStatusEnum.js'

const OrderClass = requestHandler.getOrderObj('hotel');

export const data = function () {
    let that = this;
    let managerData = extendUtils.stateManager.setData(['showRefundDetail',
        {
            name: 'showPriceDetail',
            type: 'page',
            show: {
                callback: function () {
                    document.getElementsByTagName('html')[0].classList.add('body-noscroll');
                }
            },
            hide: {
                callback: function () {
                    document.getElementsByTagName('html')[0].classList.remove('body-noscroll');
                }
            }
        },
        {
            name: 'showCancelOrder',
            type: 'page',
            show: {
                callback: function () {
                    if (that.showCancelOrderBut) {
                        document.title = '取消订单'
                    } else {
                        document.title = '退款明细'
                    }
                }
            },
            hide: {
                title: '订单详情'
            }
        },
        {
            name: 'showCancelDescription',
            type: 'page',
            show: {
                title: '酒店政策'
            },
            hide: {
                callback: function () {
                    if (that.showCancelOrder) {
                        if (that.showCancelOrderBut) {
                            document.title = '取消订单'
                        } else {
                            document.title = '退款明细'
                        }
                    } else {
                        document.title = '订单详情'
                    }
                }
            }
        },
        {
            name: 'showguarantee',
            type: 'page',
            show: {
                title: '验证银行卡信息'
            },
            hide: {
                callback: function () {
                    document.title = '订单详情'
                    window.scrollTo(0,0);//TODO IOS 提交担保后页面没有上移
                }
            }
        },
        {
            name: 'openH5PayFrame',//是否以frame形式打开了H5支付
            type: 'page',
            hide: {
                callback: function () {
                    //如果H5支付正在进行，则先关闭H5支付
                    if (that.$refs.payComp && that.$refs.payComp.payInstance && that.$refs.payComp.payInstance.isOnH5Pay()){
                        that.$refs.payComp.payInstance.closeH5Pay();
                    }
                }
            }
        }
    ], this);
    return Object.assign(managerData, {
        expiration: '',
        agoDayHideDate: '',
        showCalendar:false,
        flag:true,
        titleFlex: 3,
        orderInfo: {},
        inDays: 1,
        inDate: new Date().getTime(),
        outDate: new Date().getTime() + 24 * 60 * 60 * 1000,
        roomTypeMap: {
            0: '现付',
            1: '在线支付'
        },
        pageFrom: '',
        orderNo: 0,
        toThreePayType: 0,
        loading: true,
        popLoading: false,
        custOrderStatus: '',
        orderStatusColor: '',
        limitTime: 0,
        timeInterval: null,
        paid: false,
        abnormalObj: {},//支付异常类型
        cancelLoading: false, //支付loading样式
        showConfirm: false, //未支付订单取消订单的确认框
        invoiceInfo: {},
        invoiceContent: '',
        invoiceRemarks: '',
        showCancelOrderBut: false,//退款明细界面是否显示确定按钮，未退款显示，已退款不显示
        orderScore: null,//积分
        servicePhone: extendUtils.BIS_CUSTOMER_SERVICE_PHONE,//客服电话
        //信用卡信息
        creditCard: {
            idType: 0,
            holderName: '',
            number:'',
            cvv:'',
            idNo:'',
            mobile:''
        },
        smsCode:'',
        idTypeListMap: { //证件类型map
            0: '身份证',
            1: '护照',
            2: '其他'
        },
        idTypeList: [ //身份证 = 0,   护照 = 1,   其他 = 2
            {
                key: 0,
                value: '身份证'
            },
            {
                key: 1,
                value: '护照'
            },
            {
                key: 2,
                value: '其他'
            }
        ],
        timer:null,
        countdown:'',
        passengersPhone:{phone:''},
        paymentMethods:[]//支付方式列表
    })
};

export const created = function () {
    var _this = this;
  

    //注册并监听t信返回事件
    // extendUtils.appBack(function (data) {//点击app返回事件
    //     extendUtils.throttle(function () {
    //         _this.closeTopPop();
    //     }, this);
    // }.bind(this));
    _this.$emit('showOff', true);
    // extendUtils.reFreshPage(() => {
    //     _this.paid = false;
    //     clearInterval(_this.timeInterval);
    //     _this.getOrderDetail();
    //     extendUtils.reloadWithNoCache()
    // });
    this.showguarantee = this.$route.query && this.$route.query.needguarantee == 'true'
    //新页面关闭回到本页面时，本页面自动刷新的事件
    sinosdk.sino.onChildWindowClose(function () {
        // try{
        //     data = requestHandler.analyzeWinCloseData(data);
        //     if(data.refresh){
        //         clearInterval(_this.timeInterval);
        //         _this.getOrderDetail();
        //     }
        // }catch (e) {
        //     console.error(e);
        // }
        try {
            clearInterval(_this.timeInterval);
            _this.sobotOut();
            _this.getOrderDetail();
        } catch (e) {
            console.error(e);
        }
    }.bind(this));

    if (!!this.$route.query.pageFrom) {
        _this.pageFrom = this.$route.query.pageFrom;
    }
    _this.orderNo = this.$route.query.orderNo;
    _this.getOrderDetail();
    _this.getPaymentMethods();
};
// 以前在pc裸跑兼容代码，现在去掉
// export const beforeRouteLeave = function (to, from, next) {
//     const that = this;
//     that.closeTopPop(function () {
//         next();
//     });
// };
export const mounted = function () {
    let _this = this;
    window.onresize = function () {
        return (function () {
            _this.screenHeight = document.documentElement.clientHeight;
        })()
    }

}
export const computed = {
    getGoodsDesc() {
        return OrderClass.getGoodsDesc();
    },

    /********
     * 整合在线客服需要拼接的参数（用的在线客服事智齿科技）
     */
    zcConfig(){
        // let that = this;     
        if (!!extendUtils.isPC()){
            return {}
        }
        let callBackUrl = extendUtils.assignUrlParam('pageFrom', 'customerService');
        return {
            card_title: `${this.orderInfo.hotelName}`, //标题（必传）
            card_url: encodeURIComponent(callBackUrl), //商品信息的商品链接地址（必传）（建议使用encodeURIComponent转义一下，防止链接中带有特殊符号导致参数获取失败）
            card_desc: encodeURIComponent(`订单号: ${this.orderInfo.providerOrderNo || this.orderInfo.orderNo}  金额: ￥${this.orderInfo.orderAmount}  入住时间: ${this.orderInfo.inDate}`), //商品信息的简述内容（选传）
            card_note: this.custOrderStatus, //订单状态
            card_picture: encodeURIComponent(require('orderCommon/zkimg/hotel.png')) //商品的缩略图（选传）（建议使用encodeURIComponent转义一下，防止链接中带有特殊符号导致参数获取失败） 此处选择用base64的方式
        } 
             
    },
    /**
     * 获取支付方式名称
     */    
    getPaymentName(){
        let res = null;
        let that = this;
        if (!!this.orderInfo && !!this.orderInfo.payType && this.orderInfo.payType!=''){
            let index = that.paymentMethods.findIndex(item => {
                return item.payType == this.orderInfo.payType;
            })
            if (index > -1){
                res = that.paymentMethods[index].alias
            }
        }
        return res;
    }
}
export const filters = {
    limitTimeFilter: function (value) {
        if (value && value >= 1) {
            return new Date(value * 1000).format('mm分ss秒');
        }
        return '';
    },
    limitTimeFilterChange: function (value) {
        if (value && value >= 1) {
            return new Date(value * 1000).format('mm:ss');
        }
        return '';
    },
    dataFormat(value) {
        if (!value) {
            return '';
        }
        let date = new Date(value);
        return date.format('MM月dd日');
    },
    getWeekDay(value) {
        if (!value) {
            return '';
        }
        let date = new Date(value);
        return extendUtils.indexToWeek(date.getDay(), 3);
    }
};
export const methods = {
    //跳转到客服系统
    async gotoCustomerService(){  
        let url = await customerService.run(1, this.zcConfig, 'product').catch(e=>{
            console.log(e)
        });
        window.open(url)
    },
    // 酒店客人手机号脱敏
    dataDecorate(){
        let maskIns = SnUtils.DataMasking;
        this.passengersPhone.phone = maskIns.maskingText(SnUtils.DataMasking.MASKING_TYPE.TEL,this.orderInfo.contactMobile);
    },

    /**
     * 电话提示信息comfirm
     */
    showPhoneTips() {
        let phoneExp = extendUtils.BIS_CUSTOMER_SERVICE_PHONE.replace(/[`~!@#$%^&*()\+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）\+={}|《》？：“”【】、；‘’，。、]/img, ' 转 ')
        let confirmMsg = `<div class="bigbox">
        <div class="box"></div>
        <p class="orderfail">联系客服失败？</p>
        <p class="p">试试拨打 ${phoneExp}</p>
        <p class="p">服务时间 9: 00-21: 00</p>
    </div>`
        extendUtils.showConfirm(confirmMsg, ()=>{ this.callPhone() }, 2, null, '拨打', null, null, true)
    },
    //orderInfo.roomType == 1"时的取消（预付的取消） RoomType0现付1预付
    cancelConfirmRoomTypeOne() {
        this.showCancelOrderBut = true;
        this.showCancelOrder = true;
    },
    /**
     * T信点击返回的事件处理
     */
    // closeTopPop(callback) {
    //     let that = this;
    //     return extendUtils.stateManager.closeTopPop(() => {
    //         if (!callback) {
    //             //小应用要跳到首页去  这段逻辑在现有首页上可能会有问题，暂不用
    //             // if(extendUtils.getStorage('homePageType')!='mini'){
    //             //   requestHandler.openPage('hotel.html#/');
    //             //   return;
    //             // }
    //             let loadData = {
    //                 orderNo: that.orderInfo.orderNo,
    //                 orderStatus: that.orderInfo.orderStatus,
    //                 postSaleStatus: that.orderInfo.postSaleStatus,
    //             };
    //             loadData = JSON.stringify(loadData);
    //             //预付或者orderSuc页面过来的，都要返回两个step才能到首页
    //             // push是推送过来的，必须返回2次，否则安卓有问题
    //             if (that.pageFrom == 'advance' || that.pageFrom == 'cash') {
    //                 extendUtils.goBackPage('', 2, loadData);
    //             } else if (that.pageFrom == 'push') {
    //                 extendUtils.goBackPage('', extendUtils.getNavigatorType() == 'ios' ? 1 : 2, loadData);
    //             } else if (that.pageFrom == 'orderListPc') {
    //                 that.$router.go(-1)
    //             } else {
    //                 extendUtils.goBackPage('', 1, loadData);
    //             }
    //         } else {
    //             callback();
    //         }
    //     });
    // },
    goBackFun(){
        let that = this;
        //小应用要跳到首页去  这段逻辑在现有首页上可能会有问题，暂不用
        // if(extendUtils.getStorage('homePageType')!='mini'){
        //   requestHandler.openPage('hotel.html#/');
        //   return;
        // }
        let loadData = {
            orderNo: that.orderInfo.orderNo,
            orderStatus: that.orderInfo.orderStatus,
            postSaleStatus: that.orderInfo.postSaleStatus
        };
        loadData = JSON.stringify(loadData);
        //预付或者orderSuc页面过来的，都要返回两个step才能到首页
        // push是推送过来的，必须返回2次，否则安卓有问题
        if (that.pageFrom == 'advance' || that.pageFrom == 'cash') {
            extendUtils.closePage('', 2, loadData);
        } else if (that.pageFrom == 'push') {
            extendUtils.closePage('', extendUtils.getNavigatorType() == 'ios' ? 1 : 2, loadData);
        } else if (that.pageFrom == 'orderListPc') {
            that.$router.go(-1)
        } else {
            extendUtils.closePage('', 1, loadData);
        }
    },
    /**
    * 显示时间组选择件
    */
    showCalendarDo: function () {
        let that = this;
        that.$nextTick(() => {
            that.showCalendar = true;
            that.$forceUpdate()
        })
        
        that.delayShow = 0;

    },
    /**
       * 选择证件类型
       * @param {Object} e
       */
    onIdTypeChange: function (e) {
        this.creditCard.idType = e;
    },
    /**
       * 时间选择
       * @param {Object} e
       */
    choseDay: function (e) {
        let that = this;
        if (this.showCalendar) {
            e.length<10 && (e+='/01');//暂时解决ios兼容问题，后续需要修改
            //   var curMonth = new Date(new Date(parseInt(that.$route.query.outDate)).getFullYear(), new Date(parseInt(that.$route.query.outDate)).getMonth()+1, 1);
            var curMonth = new Date(new Date(that.orderInfo.outDate).getFullYear(), new Date(that.orderInfo.outDate).getMonth()+1, 1);
            if (curMonth.getTime() > new Date(e).getTime()) {
                extendUtils.showToast('只接受有效期为离店日期月份之后的信用卡');
                return;
            }
            this.showCalendar = false;
            this.expiration = new Date(e).format('yyyy/MM');
        }
    },
    /**
       * 数据提交时的验证
       */
    validate: function () {
        let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!this.creditCard.number) {
            extendUtils.showToast('请填写信用卡号');
            return false;
        }
        if (!extendUtils.isCreditCardNo(this.creditCard.number)) {
            extendUtils.showToast('请填写正确信用卡号');
            return false;
        }
        if (!this.creditCard.cvv) {
            extendUtils.showToast('请填写CVV2码');
            return false;
        }
        if (!extendUtils.isCVV(this.creditCard.cvv)) {
            extendUtils.showToast('请填写3或4位CVV2码');
            return false;
        }
        if (!this.creditCard.holderName) {
            extendUtils.showToast('请填写持卡人姓名');
            return false;
        }
        if (!!!(this.creditCard.holderName)) {
            extendUtils.showToast('请填写正确持卡人姓名');
            return false;
        }
        if (!this.creditCard.idNo) {
            extendUtils.showToast('请填写证件号');
            return false;
        }
        if (0 == this.creditCard.idType && !extendUtils.isCardNo(this.creditCard.idNo)) {
            extendUtils.showToast('请填写正确证件号');
            return false;
        }
        if (!(this.creditCard.mobile && myreg.test(this.creditCard.mobile))) {
            extendUtils.showToast('请填写正确手机号码');
            return false;
        }
        return true;
    },
    validateSmsCode: function () {
        let smsCodeReg = /^[0-9]*$/
        if (!this.smsCode || !smsCodeReg.test(this.smsCode)) {
            extendUtils.showToast('请输入验证码');
            return false;
        }
        return true;
    },
    /**
     * 获取验证码
     */
    getCaptcha(){
        const that = this;
        that.getCode()
    },
    getCode(){
        var that = this
        if (that.validate()){
            that.creditCard.expirationYear = parseInt(that.expiration.split('/')[0]);
            that.creditCard.expirationMonth = parseInt(that.expiration.split('/')[1]);
            let orderInfo = {
                orderNo:this.orderNo,
                creditCard:this.creditCard
            };
            that.$vux.loading.show({ text: '' })
            requestHandler.payHotelOrder(orderInfo).then(function (res) {
                that.$vux.loading.hide()
                if (0 == res.resultCode) {
                    if (res.result.success){
                        that.flag = false;
                        const TIME_COUNT = 90;
                        if (!that.timer) {
                            that.countdown = TIME_COUNT;
                            that.flag = false;
                            that.timer = setInterval(() => {
                                if (that.countdown > 0 && that.countdown <= TIME_COUNT) {
                                    that.countdown--;
                                } else {
                                    that.flag = true;
                                    clearInterval(that.timer);
                                    that.timer = null;
                                }
                            }, 1000)
                        }
                    } else {
                        console.log(res.result.reason)
                        extendUtils.showConfirm('获取验证码失败', null, 2, null, null, null, null, true)
                    }
                }
            }).catch(() => {
                //异常情况下由公共错误码进行提示
                that.$vux.loading.hide()
            })
        }
    },
    /**
     * 提交担保
     */
    goToGuarantee(){
        var that = this;
        if (that.validate()){
            if (that.validateSmsCode()){
                that.dataInfo = {
                    orderNo:this.orderNo,
                    smsCode:this.smsCode
                };
                that.$vux.loading.show({ text: '' })
                requestHandler.confirmPayHotelOrder(this.dataInfo).then(function (res) {
                    that.$vux.loading.hide()
                    if (0 == res.resultCode) {
                        if (res.result.success){
                            that.showguarantee = false
                            that.getOrderDetail();
                        } else {
                            console.log(res.result.reason)
                            extendUtils.showConfirm('验证码填写错误，请90s后重新获取验证码', null, 2, null, '重新获取'(that.countdown+'s'), null, null, true)
                        }
                    }
                }).catch(() => {
                    //异常情况下由公共错误码进行提示
                    that.$vux.loading.hide()
                })
            }
        }
    },
    /**
     * 点击查看酒店报销凭证的详情
     */
    viewInvoiceFun() {
        let that = this;
        if (that.orderInfo.orderStatus == 'WAIT_FOR_PAY') { // 如果是酒店状态是待支付，则弹窗提示
            let msg = '订单未支付，无法查看报销凭证';
            extendUtils.showConfirm(msg, function () {
            }, 1, null, '知道了', null, null, true);
        } else {
            this.viewInvoiceDetail()
        }


    },
    /**
     * 已开出来的去查看报销凭证详情
     */
    viewInvoiceDetail() {
        OrderClass.toViewInvoiceDetail(this.orderInfo.orderNo);
    },
    /**
     * 联系客服打电话
     */
    callPhone() {
        sinosdk.sino.callTel(extendUtils.BIS_CUSTOMER_SERVICE_PHONE);
    },
    cancelConfirm() {
        let that = this;
        OrderClass.cancelOrder(that.orderNo).then(res => {
            that.cancelSuccess(res);
        }).catch(() => {
            that.cancelLoading = false;
        })
    },
    /**
     * 补开报销
     */
    toReimburse() {
        OrderClass.toReimburse(this.orderInfo.orderNo, this.orderInfo.orderExtraInfo.useType, this.orderInfo.outDate);
    },
    /**
     * 再次预订
     */
    orderAgain() {
        OrderClass.toHome()
    },
    /**
     * 查询订单详情
     * @param {Object} orderNo
     */
    getOrderDetail: function () {
        //兼容如理，如果此时有confirm框，就关掉
        try {
            Vue.$vux.confirm.hide()
        } catch (e) {
        }
        let _this = this;
        clearInterval(_this.timeInterval);
        return OrderClass.getOrderDetail(_this.orderNo).then(function (res) {
            //是否为别人帮预定的订单
            _this.selfOrder = res.result.selfOrder;
            _this.loading = false;
            _this.orderInfo = res.result;
            _this.orderScore = res.result.orderScore;
            // 发票信息
            _this.invoiceInfo = _this.orderInfo.invoiceInfo
            _this.invoiceContent = _this.orderInfo.invoiceContent
            _this.invoiceRemarks = _this.orderInfo.invoiceRemarks || '--';
            // 乘客电话
            if (SnTravel.functional.ISDECORATE){
                _this.dataDecorate();
            } else {
                _this.passengersPhone.phone = _this.orderInfo.contactMobile;
            }

            _this.expiration = new Date(new Date(_this.orderInfo.outDate).getFullYear(), new Date(_this.orderInfo.outDate).getMonth()+1, 1).format('yyyy/MM');
            _this.agoDayHideDate =new Date(new Date(_this.orderInfo.outDate).getFullYear(), new Date(_this.orderInfo.outDate).getMonth()+1, 1).getTime()

            _this.inDays = (new Date(_this.orderInfo.outDate).getTime() - new Date(_this.orderInfo.inDate).getTime()) / (
                24 * 60 * 60 * 1000);
            _this.inDate = new Date(_this.orderInfo.inDate).getTime();
            _this.outDate = new Date(_this.orderInfo.outDate).getTime();
            _this.custOrderStatus = (hotelOrderStatus[_this.orderInfo.orderStatus] || {}).text || '';
            _this.orderStatusColor = (hotelOrderStatus[_this.orderInfo.orderStatus] || {}).color || '';
            if (_this.orderInfo.orderStatus == 'WAIT_FOR_PAY') {
                _this.loadPay = true;//加载pay组件
                _this.limitTime = _this.orderInfo.orderExtraInfo.remainPayTime;//单位秒
                if (_this.limitTime > 0) {
                    _this.timeInterval && clearInterval(_this.timeInterval);
                    _this.timeInterval = setInterval(function () {
                        if (_this.limitTime) {
                            if (_this.limitTime <= 1) {
                                _this.limitTime = null;
                                clearInterval(_this.timeInterval);
                                _this.payTimeout();
                            } else {
                                _this.limitTime = _this.limitTime - 1;
                            }
                        } else {
                            _this.timeInterval && clearInterval(_this.timeInterval);
                        }
                    }, 1000);
                } else {
                    _this.limitTime = null;
                    clearInterval(_this.timeInterval);
                }
            } else {
                _this.timeInterval && clearInterval(_this.timeInterval);
            }
            //更新代金券数据
            _this.$refs.payComp && _this.$refs.payComp.getCashCouponList();
            //现付担保类型酒店已取消支付失败显示以下提示信息
            if (0 == res.result.roomType && res.result.guarantee && "ALREADY_CANCEL" == res.result.orderStatus && 'REFUNDED' == res.result.payStatus) {
                extendUtils.simpleShowConfirm('信用卡担保失败，订单将被取消；请检查信用卡额度后重新下单', function () {
                })
            }

            return Promise.resolve()
        }).catch(() => {
            _this.loading = false;
            return Promise.resolve()
        });
    },
    /**
     * 支付超时后的操作
     */
    payTimeout() {
        let that = this;
        if (that.orderInfo.orderStatus != 'WAIT_FOR_PAY') {
            return;
        }
        //pc端不主动查询状态，而是弹出确认框，用户确认后再查询
        if (extendUtils.isPC()) {
            let msg = '抱歉，您的订单由于超时未支付已取消，请重新预订';
            extendUtils.showConfirm(msg, function () {
                that.getOrderDetail();
                that.orderAgain();
            }, 1, null, '确定', null, null, true)
        } else {
            setTimeout(() => {
                that.getOrderDetail(); //倒计时完成，再拉取一次订单详情
            }, 1000)
        }
    },
    /**
     * 取消订单
     */
    onConfirm: function () {
        let _this = this;
        _this.cancelLoading = true;
        OrderClass.cancelProductOrder(_this.orderNo).then((res) => {
            _this.cancelSuccess(res);
        }).catch(() => {
            _this.cancelLoading = false;
        })
    },
    cancelSuccess(res) {
        let _this = this;
        _this.cancelLoading = false;
        if (res.result && res.result.success) {
            _this.showCancelOrder = false;
            _this.limitTime = null;
            _this.getOrderDetail();
        } else {
            extendUtils.showConfirm('取消失败，请联系客服', _this.gotoCustomerService, 2, '取消' , '联系客服', null, function () {}, true)
        }
    },
    /**
     * 打开酒店详情
     */
    openIntroduction: function () {
        var _this = this;
        //统一收集数据
        let hotelObj = {
            hid: _this.orderInfo.hotelId,
            inDate: new Date().getTime(),
            outDate: parseInt(parseInt(new Date().getTime()) + 24 * 60 * 60 * 1000),
            inDays: 1,
            providerType: _this.orderInfo.providerType,
            useType: _this.orderInfo.orderExtraInfo.useType,
            tripNo: null,
            cityName: _this.orderInfo.cityName
        }
        if (_this.$vux.loading.isVisible()) {
            return;
        }
        //微信小程序内嵌页面直接跳转
        if (extendUtils.MINIPROGRAM_CONFIG.IN_MINIPROGRAM){
            let outDate = parseInt(parseInt(new Date().getTime()) + 24 * 60 * 60 * 1000);
            requestHandler.openPage('hotel/index.html#/detail?hid=' + _this.orderInfo.hotelId
                + '&inDate=' + new Date().getTime()
                + '&outDate=' + outDate
                + '&inDays=' + _this.inDays
                + '&tripNo=' + null
                + '&useType=' + _this.orderInfo.orderExtraInfo.useType
                + '&providerType=' + _this.orderInfo.providerType
                + '&cityName=' + _this.orderInfo.cityName
                + '&close=1'
                + '&pageFrom=orderDetail'
            )
            return
        }
        //先查询酒店详情是否状态正常
        _this.$vux.loading.show({ text: '' })
        requestHandler.getHotelDetail({
            hid: hotelObj.hid,
            inDate: new Date(parseInt(hotelObj.inDate)).format('yyyy/MM/dd'),
            outDate: new Date(parseInt(hotelObj.outDate)).format('yyyy/MM/dd'),
            providerType: hotelObj.providerType,
            useType: hotelObj.useType
        }).then(function (res) {
            _this.$vux.loading.hide()
            if (0 == res.resultCode) {
                let key = 'hotelDetail' + hotelObj.hid + '_' + hotelObj.inDate + '_' + hotelObj.outDate;
                extendUtils.setStorage(key, JSON.stringify(res));
                let outDate = parseInt(parseInt(new Date().getTime()) + 24 * 60 * 60 * 1000);
                requestHandler.openPage('hotel/index.html#/detail?hid=' + _this.orderInfo.hotelId
                    + '&inDate=' + new Date().getTime()
                    + '&outDate=' + outDate
                    + '&inDays=' + _this.inDays
                    + '&tripNo=' + null
                    + '&useType=' + _this.orderInfo.orderExtraInfo.useType
                    + '&providerType=' + _this.orderInfo.providerType
                    + '&cityName=' + _this.orderInfo.cityName
                    + '&close=1'
                    + '&pageFrom=orderDetail'
                )
            }
        }).catch(() => {
            //异常情况下由公共错误码进行提示
            _this.$vux.loading.hide()
        })
    },
    /**
     * 展示地图
     */
    showMap: function () {
        let _this = this;
        requestHandler.openPage('hotel/index.html#/addr?lng=' + _this.orderInfo.lng + '&lat=' + _this.orderInfo.lat + '&hotelName=' + _this.orderInfo.hotelName + '&address=' + _this.orderInfo.address + '&close=1')
    },
    /**
     * 打开支付弹框
     */
    orderPay() {
        let that = this;
        
        if (!this.limitTime) {
            extendUtils.showToast('支付超时，请重新下单');
            return;
        }
        let inMiniprogram = extendUtils.MINIPROGRAM_CONFIG.IN_MINIPROGRAM; // 判断运行环境
        if (inMiniprogram){
            this.$refs.payComp.wxMiniPay(window.sinopay.PAY_TYPE.WX_MINI_PAY)
        } else {
            that.openPay();
        }
    },

    /**
     * 去担保
     *  
     */
    orderguarantee() {
        const that = this;
        that.openGuarantee()
    },
    /**
     * 判断状态是否可以取消 默认为false
     * @param {Object} status       订单状态
     * @param {Object} IsCancelable 已支付状态是否可以取消
     */
    isCancelStatus: function (status, cancelable) {
        return (hotelOrderStatus[status] || {}).isCancel
            || ((hotelOrderStatus[status] || {}).payCancel && cancelable);
    },

    /**
     * 异步调起支付组件
     */
    async openPay() {
        this.$refs.payComp.getPayTypeList();
    },
    /**
     * 异步调起担保信用卡信息
     */
    async openGuarantee() {
        if (!this.limitTime) {
            extendUtils.showToast('担保超时，请重新下单');
            return;
        }
        console.log('担保')
        this.showguarantee = true
    },

    /**
     * 支付成功页面点击“查看订单”
     */
    paySucToDetail(){
        this.timeInterval && clearInterval(this.timeInterval);
        this.getOrderDetail();
    },

    /**
     * 小程序支付后，需要执行的回调
     */
    miniPayDone(){
        this.timeInterval && clearInterval(this.timeInterval);
        this.getOrderDetail();
    },

    /**
     * 支付完成时停止倒计时
     */
    payComplete(){
        this.timeInterval && clearInterval(this.timeInterval);
    },

    openFrame(){
        this.openH5PayFrame = true;
    },

    /**
     * 获取支付方式
     */
    getPaymentMethods(){
        let that = this;
        requestHandler.getPaymentMethods().then((res)=>{
            if (res.resultCode == 0 && res.result){
                that.paymentMethods = res.result.paymentMethods;
            }
        })
    }
};
