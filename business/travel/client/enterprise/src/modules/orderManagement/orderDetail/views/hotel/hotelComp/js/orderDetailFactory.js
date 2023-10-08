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
        }
    ], this);
    return Object.assign(managerData, {
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
        showPayTypes: false,//弹出支付列表
        swpPayLoad: false,//支付组件加载完成flag
        servicePhone: extendUtils.BIS_CUSTOMER_SERVICE_PHONE//客服电话
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
    // });

    //新页面关闭回到本页面时，本页面自动刷新的事件
    sinosdk.sino.onChildWindowClose(function (data) { // eslint-disable-line
        try {
            data = requestHandler.analyzeWinCloseData(data);
            if (data.refresh){
                clearInterval(_this.timeInterval);
                _this.getOrderDetail();
            }
        } catch (e) {
            console.error(e);
        }
    }.bind(this));

    if (!!this.$route.query.pageFrom) {
        _this.pageFrom = this.$route.query.pageFrom;
    }
    _this.orderNo = this.$route.query.orderNo;
    _this.getOrderDetail();
};
export const beforeRouteLeave = function (to, from, next) {
    const that = this;
    that.closeTopPop(function () {
        next();
    });
};
export const mounted = function () {
    let _this = this;
    window.onresize = function () {
        return (function () {
            _this.screenHeight = document.documentElement.clientHeight;
        })()
    }

}
export const computed = {
    getGoodsDesc(){
        return OrderClass.getGoodsDesc();
    }
}
export const filters = {
    limitTimeFilter: function (value) {
        if (value && value >= 1) {
            return new Date(value * 1000).format('mm分ss秒');
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
    /**
     * 电话提示信息comfirm
     */
    showPhoneTips() {
        let phoneExp = extendUtils.BIS_CUSTOMER_SERVICE_PHONE.replace(/[`~!@#$%^&*()\+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）\+={}|《》？：“”【】、；‘’，。、]/img, ' 转 ')
        let confirmMsg = `<div class="bigbox">
        <div class="box"></div>
        <p class="orderfail">联系客服失败？</p>
        <p class="p">试试拨打 ${phoneExp}</p>
        <p class="sp">服务时间 8: 30-17: 30</p>
    </div>`
        extendUtils.showConfirm(confirmMsg, null, 1, null, '确定', null, null, true)
    },
    //orderInfo.roomType == 1"时的取消（预付的取消） RoomType0现付1预付
    cancelConfirmRoomTypeOne(){
        this.showCancelOrderBut = true;
        this.showCancelOrder = true;
    },
    /**
     * T信点击返回的事件处理
     */
    closeTopPop(callback) {
        let that = this;
        return extendUtils.stateManager.closeTopPop(() => {
            if (!callback) {
                //小应用要跳到首页去  这段逻辑在现有首页上可能会有问题，暂不用
                // if(extendUtils.getStorage('homePageType')!='mini'){
                //   requestHandler.openPageLib('hotel.html#/');
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
                if (that.pageFrom=='advance' || that.pageFrom=='cash'){
                    extendUtils.closePage('', 2, loadData);
                } else if (that.pageFrom=='push'){
                    extendUtils.closePage('', extendUtils.getNavigatorType() == 'ios' ? 1 : 2, loadData);
                } else if (that.pageFrom=='orderListPc'){
                    extendUtils.closePage('', 1, loadData);
                } else {
                    extendUtils.closePage('', 1, loadData);
                }
            } else {
                callback();
            }
        });
    },
    goBackFun(){
        let that = this;
        let loadData = {
            orderNo: that.orderInfo.orderNo,
            orderStatus: that.orderInfo.orderStatus,
            postSaleStatus: that.orderInfo.postSaleStatus
        };
        loadData = JSON.stringify(loadData);
        //预付或者orderSuc页面过来的，都要返回两个step才能到首页
        // push是推送过来的，必须返回2次，否则安卓有问题
        if (that.pageFrom=='advance' || that.pageFrom=='cash'){
            extendUtils.closePage('', 2, loadData);
        } else if (that.pageFrom=='push'){
            extendUtils.closePage('', extendUtils.getNavigatorType() == 'ios' ? 1 : 2, loadData);
        } else if (that.pageFrom=='orderListPc'){
            extendUtils.closePage('', 1, loadData);
        } else {
            extendUtils.closePage('', 1, loadData);
        }
    },
    /**
     * 点击查看酒店报销凭证的详情
     */
    viewInvoiceFun() {
        let that = this;
        if (that.orderInfo.orderStatus == 'WAIT_FOR_PAY'){ // 如果是酒店状态是待支付，则弹窗提示
            let msg = '订单未支付，无法查看报销凭证';
            extendUtils.showConfirm(msg, function(){
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
    cancelConfirm(){
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
        OrderClass.getOrderDetail(_this.orderNo).then(function (res) {
            //是否为别人帮预定的订单
            _this.selfOrder = res.result.selfOrder;
            _this.loading = false;
            _this.orderInfo = res.result;
            _this.orderScore = res.result.orderScore;
            // 发票信息
            _this.invoiceInfo = _this.orderInfo.invoiceInfo
            _this.invoiceContent = _this.orderInfo.invoiceContent
            _this.invoiceRemarks = _this.orderInfo.invoiceRemarks || '--';

            _this.inDays = (new Date(_this.orderInfo.outDate).getTime() - new Date(_this.orderInfo.inDate).getTime()) / (
                24 * 60 * 60 * 1000);
            _this.inDate = new Date(_this.orderInfo.inDate).getTime();
            _this.outDate = new Date(_this.orderInfo.outDate).getTime();
            _this.custOrderStatus = (hotelOrderStatus[_this.orderInfo.orderStatus] || {}).text || '';
            _this.orderStatusColor = (hotelOrderStatus[_this.orderInfo.orderStatus] || {}).color || '';
            if (_this.orderInfo.orderStatus == 'WAIT_FOR_PAY') {
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
            //现付担保类型酒店已取消支付失败显示以下提示信息
            if (0 == res.result.roomType && res.result.guarantee && "ALREADY_CANCEL" == res.result.orderStatus && 'REFUNDED' == res.result.payStatus) {
                extendUtils.simpleShowConfirm('信用卡担保失败，订单将被取消；请检查信用卡额度后重新下单', function () {
                })
            }

            _this.loadPayComp();
        }).catch(() => {
            _this.loading = false;
        });
    },
    /**
     * 支付超时后的操作
     */
    payTimeout(){
        let that = this;
        if (that.orderInfo.orderStatus != 'WAIT_FOR_PAY'){
            return;
        }
        //pc端不主动查询状态，而是弹出确认框，用户确认后再查询
        if (extendUtils.isPC()){
            let msg = '抱歉，您的订单由于超时未支付已取消，请重新预订';
            extendUtils.showConfirm(msg, function(){
                that.getOrderDetail();
                that.orderAgain();
            }, 1, null, '确定', null, null, true)
        } else {
            setTimeout(()=>{
                that.getOrderDetail(); //倒计时完成，再拉取一次订单详情
            },1000)
        }
    },
    /**
     * 取消订单
     */
    onConfirm: function () {
        let _this = this;
        _this.cancelLoading = true;
        OrderClass.cancelProductOrder(_this.orderNo).then((res)=>{
            _this.cancelSuccess(res);
        }).catch(() => {
            _this.cancelLoading = false;
        })
    },
    cancelSuccess(res){
        let _this = this;
        _this.cancelLoading = false;
        if (res.result && res.result.success) {
            _this.showCancelOrder = false;
            _this.limitTime = null;
            _this.getOrderDetail();
        } else {
            extendUtils.showToast('取消失败');
        }
    },
    /**
     * 打开酒店详情
     */
    openIntroduction: function () {
        var _this = this;
        //统一收集数据
        let hotelObj = {
            hid:_this.orderInfo.hotelId,
            inDate:new Date().getTime(),
            outDate:parseInt(parseInt(new Date().getTime()) + 24 * 60 * 60 * 1000),
            inDays:1,
            providerType:_this.orderInfo.providerType,
            useType:_this.orderInfo.orderExtraInfo.useType,
            tripNo:null,
            cityName:_this.orderInfo.cityName
        }
        if (_this.$vux.loading.isVisible()){
            return;
        }
        //先查询酒店详情是否状态正常
        _this.$vux.loading.show({text: ''})
        requestHandler.getHotelDetail({
            hid:hotelObj.hid,
            inDate:new Date(parseInt(hotelObj.inDate)).format('yyyy/MM/dd'),
            outDate:new Date(parseInt(hotelObj.outDate)).format('yyyy/MM/dd'),
            providerType:hotelObj.providerType,
            useType:hotelObj.useType
        }).then(function(res){
            _this.$vux.loading.hide()
            if (0==res.resultCode){
                let key = 'hotelDetail'+hotelObj.hid+'_'+hotelObj.inDate+'_'+hotelObj.outDate;
                extendUtils.setStorage(key,JSON.stringify(res));
                let outDate = parseInt(parseInt(new Date().getTime()) + 24 * 60 * 60 * 1000);
                requestHandler.openPageLib('hotel/index.html#/detail?hid=' + _this.orderInfo.hotelId
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
        }).catch(()=>{
            //异常情况下由公共错误码进行提示
            _this.$vux.loading.hide()
        })
    },
    /**
     * 展示地图
     */
    showMap: function () {
        let _this = this;
        requestHandler.openPageLib('hotel/index.html#/addr?lng=' + _this.orderInfo.lng + '&lat=' + _this.orderInfo.lat + '&hotelName=' + _this.orderInfo.hotelName + '&address=' + _this.orderInfo.address + '&close=1')
    },
    /**
     * 打开支付弹框
     */
    orderPay() {
        const that = this;
        that.openPay();
    },
    /**
     * 支付成功回调
     */
    paySuccCallback() {
        this.timeInterval && clearInterval(this.timeInterval);
        let param = OrderClass.toSuccessParam();
        param.query.pageFrom = 'order';
        this.$router.push(param);
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

    loadPayComp(){
        let _this = this;
        if (_this.orderInfo.orderStatus == 'WAIT_FOR_PAY' && _this.limitTime && _this.limitTime>=0){
            //动态加载支付组件
            requestHandler.dynamicLoadPay(()=>{
                _this.swpPayLoad = true;
            })
        }
    },

    /**
     * 异步调起支付组件
     */
    openPay(){
        if (!this.limitTime){
            extendUtils.showToast('支付超时，请重新下单');
            return;
        }
        var core = ()=>{
            if (!this.swpPayLoad){
                this.popLoading = true;
                setTimeout(()=>{
                    this.openPay();
                },100);
                return;
            }
            this.popLoading = false;
            this.showPayTypes = true;
        }

        //先校验差标，再打开支付列表
        this.$refs.travelAbnormal.checkTravelAbnormal({orderNo: this.orderNo}).then(res=>{
            this.checkSign = res;//保存校验成功的签名
            core();
        })
    }
};
