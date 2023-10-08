import {
    getTrainPsgStatusObj,
    getTrainPsgStatusName,
    getTrainPsgStatusColor,
    StateStyle
} from 'orderCommon/enum/psgStatusEnum.js'
import requestHandler from 'orderCommon/requestHandler.js';
import extendUtils from 'orderCommon/extend.js';

import {
    getTrainOrderStatus,
    getTrainOrderStatusColor,
    showTrainSubStatus,
    getTrainPostSaleStatus
} from 'orderCommon/enum/orderStatusEnum.js';
import {getAPPCustomConfigs} from 'orderCommon/customFunctionConfigs.js';

const OrderClass = requestHandler.getOrderObj('train');

export const data = function (extend) {
    return function () {
        // let that = this;
        let managerData = extendUtils.stateManager.setData([
            'showRefundDetail', //退款明细弹框
            {
                name: 'showDescription', //退改签说明
                type: 'page'
            },
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
                name: 'showTravelByPop', //列车时刻列表
                type: 'page',
                show:{
                    title: '列车时刻'
                },
                hide: {
                    title: '订单详情'
                }
            },
            {
                name: 'showRefundPop', //退票弹框
                hide: {
                    title: '订单详情'
                }
            },
            {
                name: 'showChangeDetailPop', //查看改签高改低改签差额明细弹窗
                hide: {
                    title: '订单详情'
                }
            }
        ], this);
        let data = { // eslint-disable-line
            orderData: {},
            typeList: [{
                key: '0',
                value: '身份证'
            },
            {
                key: '6',
                value: '台湾通行证'
            },
            {
                key: '1',
                value: '护照'
            },
            {
                key: '4',
                value: '港澳通行证'
            }
            ],
            StateStyle: StateStyle,
            invoiceInfo: {}, //发票详情
            invoiceContent: '', //发票内容
            invoiceFlag: '', //是否申请了开票
            custOrderStatus: null,
            Coupons: [],
            choosedPsg: {},
            choosedPsgName: '',
            choosedPsgId: '',
            checkPopStatus: false,
            limitTime: 0,
            tavelList: [],
            orderDetail: {},
            orderPsgs: [],
            startDate: '',
            orderExtraInfo: {}, //订单信息，目前只有因公因私标记UseType
            loading: true, //页面加载中
            popLoading: false,
            pageFrom: '',
            seatPriceList: [], //座位订单详情集合
            orderStatusColor: '',
            timeInterval: null,
            gaiOrderObj: [],//改签的数组
            orderScore: null,//积分
            needPay: false,//改签调用支付组件
            payChangeAmount: '',//改签支付的金额
            payOrderNo: '',//支付的订单编号
            newOrderNo: '',//新的订单编号
            trainRemaining: {},//改签支付倒计时存储对象
            trainTimeInterval: {},//改签支付倒计时的Interval存储对象
            endorseTrainConfig:true,//火车票改签 定制化 配置开关
            reimbursementConfig:true,//报销凭证 定制化 配置开关
            showPayTypes: false,//弹出支付列表
            swpPayLoad: false,//支付组件加载完成flag
            needPayChangeTrainObj: null, //当前改签支付，只有改签低改高调取支付才有值；用来判断改签支付超标 行程异常的
            checkSign: null,
            showTuiStatus :true, //显示确认退票还是退款明细
            loadingText: '加载中...',//loading的提示语
            changePayGoodsDes:{},//改签支付的需要传递给支付的产品信息
            changeDetailDes:{}, //查看改签高改低改签差额明细详情
            servicePhone: extendUtils.BIS_CUSTOMER_SERVICE_PHONE//客服电话
        };
        data = Object.assign(managerData, data); //注意，用assign方法，managerData必须是第一个参数，否则其中的get、set方法会失效
        if (extend) {
            data = Object.assign(data, extend);
        }
        return data;
    };
}
export const created = function () {
    const that = this;
    that.getMyCustomConfigs();
    if (!!that.$route.query.pageFrom) {
        that.pageFrom = that.$route.query.pageFrom;
    }
    //注册并监听t信返回事件

    // extendUtils.appBack(function (data) { //点击app返回事件
    //     that.closeTopPop();
    // },that);
    
    // 注册推送
    sinosdk.sino.onChildWindowClose(function (data) { // eslint-disable-line 
        try {
            data = requestHandler.analyzeWinCloseData(data);
            if (data.refresh){
                clearInterval(that.timeInterval);
                that.getOrderDetail();
            }
        } catch (e) {
            console.error(e);
        }
    }.bind(this));
    that.$emit('showOff', true);
    // extendUtils.reFreshPage(() => {
    //     that.getOrderDetail();
    // });
    that.getOrderDetail();

};
export const computed = {
    getGoodsDesc(){
        if (this.needPay && Object.keys(this.changePayGoodsDes).length > 0){
            const date = new Date(this.changePayGoodsDes.startDate).format('MM月dd日') 
            return date + ' ' + this.changePayGoodsDes.startStation + '-' + this.changePayGoodsDes.endStation;
        }
        return OrderClass.getGoodsDesc()
        
    },

    orderNoList(){
        let arr = [];
        if (!!this.newOrderNo){
            arr.push(this.newOrderNo)
        } else {
            arr.push(this.orderDetail.orderNo)
        }
        return arr;
    }

}
export const activated = function () {
    this.getOrderDetail();
}
export const beforeRouteLeave = function () {
    // const that = this;
    // that.checkPopStatus ? '' : that.closeTopPop();
    // that.checkPopStatus ? next() : next(false);
};
export const mounted = function () {
    let _this = this;
    window.onresize = function () {
        return (function () {
            _this.screenHeight = document.documentElement.clientHeight;
        })()
    }
    sinosdk.sino.overwriteWindowopen();
};
export const filters = {
    getWeekDay(value) {
        if (!value) {
            return '';
        }
        let date = new Date(value);
        return extendUtils.indexToWeek(date.getDay(), 3);
    },
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
    formatRuntime(value) {
        if (!value) {
            return '';
        }
        let minute = value % 60;
        minute = minute ? extendUtils.addZero(value % 60) : 0;
        return parseInt(value / 60) + "小时" + minute + "分钟";
    },
    dataFormat(value) {
        if (!value) {
            return '';
        }
        let date = new Date(value);
        return date.format('MM月dd日');
    }
};
export const methods = {
    goBackFun(){
        let that = this;
        that.checkPopStatus = true;
        let loadData = {
            orderNo: that.orderDetail.orderNo,
            orderStatus: that.orderDetail.orderStatus,
            postSaleStatus: that.orderDetail.postSaleStatus,
            changeAndRefundStatus: that.orderDetail.changeAndRefundStatus
        };
        loadData = JSON.stringify(loadData);
        if (that.pageFrom=='pay'){ //push是推送过来的，必须返回2次，否则安卓有问题
            extendUtils.closePage('', 2, loadData);
        } else if (that.pageFrom=='push'){ //push是推送过来的，必须返回2次，否则安卓有问题
            extendUtils.closePage('', extendUtils.getNavigatorType() == 'ios' ? 1 : 2, loadData);
        } else if (that.pageFrom=='orderListPc'){
            extendUtils.closePage('', 1, loadData);
        } else {
            extendUtils.closePage('', 1, loadData);
        }
    },
    //数据脱敏的方法
    desensitization(num){
        if (num){
            let length = num.length;
            if (length>2){
                let str = '';
                str = str + num.slice(0,1) + '************' + num.slice(length-1);
                return str;
            }
            return num;
          
        }
        return num;
        

    },
    //判断主订单括号里面的状态 比如 已出票（有改签）里面的有改签
    chargeChangeAndRefundStatus(statu){
        let res = getTrainPostSaleStatus(statu);
        return !!res ? `(${res})` : '';
    },
    /**
   * 电话提示信息comfirm
   * <img src="~assets/img/compment/icon_orderdetail_reminder.svg">
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
    /**
     * 当前订单状态是否是有票的状态
     */
    showSubStatus(statu) {
        return showTrainSubStatus(statu);
    },
    /**
     * 是否可以补开发票
     * 已出票，已退票，已出票（有退票）可以补开发票
     */
    ableReimburse() {
        return OrderClass.showInvoice();
    },
    /**
     * 已开发票
     */
    hasReimburse(){
        return this.invoiceFlag == '1' && this.orderDetail.orderStatus != 'ALREADY_CANCEL' && this.orderDetail.orderStatus != 'FAILED_OUT_TICKET'
    },
    /**
     * 未开发票，需补开
     */
    notHasReimburse(){
        return this.invoiceFlag == "0" && this.ableReimburse() && this.orderDetail.orderStatus != "UNPAID"
    },
    /**
     * 补开报销
     */
    toReimburse() {
        OrderClass.toReimburse();
    },
    /**
     * 已开出来的去查看报销凭证详情
     */
    viewInvoiceDetail() {
        OrderClass.toViewInvoiceDetail();
    },

    //查看报销凭证
    checkInvoice() {
        if (!this.hasReimburse()){
            return;
        }
        let index = ['UNPAID', 'ALREADY_PAID'].indexOf(this.orderDetail.orderStatus);
        if (index > -1) { //待支付和已支付的不能查看发票，只有已出票的场景才可以
            let str = '订单尚未支付，无法查看';
            if (index == 1){
                str = '订单尚未出票，无法查看'
            }
            extendUtils.showConfirm(str, null, 1, null, '知道了', null, null, true)
        } else {
            this.viewInvoiceDetail()
        }
    },
    /**
     * 获取乘车人的状态名字
     * @param TuiOrder的状态码
     */
    getTrainPsgStatusName(status) {
        return getTrainPsgStatusName(status);
    },
    /**
     * 获取乘车人的状态颜色
     * @param TuiOrder的状态码
     */
    getTrainPsgStatusColor(status) {
        return getTrainPsgStatusColor(status);
    },
    /**
     * 获取出行人的状态State
     * @param status 状态码
     * @returns {*}
     */
    psgStatuState(status) {
        //非改签单，才显示disable的样式
        try {
            return getTrainPsgStatusObj(status).state;
        } catch (e) {
            return null;
        }
    },
    /**
     * 获取出行人对象类型
     * @param status
     * @returns 0：退票，1：改签；-1：正常
     */
    getPsgStatuType(status) {
        try {
            return getTrainPsgStatusObj(status).type;
        } catch (e) {
            return -1;
        }
    },
    /**
     * 联系客服打电话
     */
    callPhone() {
        sinosdk.sino.callTel(extendUtils.BIS_CUSTOMER_SERVICE_PHONE);
    },
    /**
     * 再次预定
     */
    orderAgain() {
        OrderClass.toHome()
    },
    /**
     * 座位价格明细
     */
    setPriceDetail() {
        let that = this;
        const compareGai = (x, y) => {
            const timeStampX = new Date(x.changeApplyTime).getTime();
            const timeStampY = new Date(y.changeApplyTime).getTime();
            if (timeStampX < timeStampY) {
                return 1;
            } else if (timeStampX > timeStampY) {
                return -1;
            } 
            return 0;
            
        };
        that.seatPriceList = [];
        that.orderPsgs.forEach((item) => {
            let _item = item;
            let seat = item.seatType;
            if (item.changeOrderInfoList && item.changeOrderInfoList.length > 0 && that.chargeChangeOrderStatus(item.changeOrderInfoList[0].changeOrderStatus)) {
                //按时间倒序，取最新申请的改签单
                _item = item.changeOrderInfoList.sort(compareGai)[0];
                seat = _item.seatType + '（改签票）';
            }
            let index = extendUtils.findIndex(that.seatPriceList, function (o) { return o.type == seat && o.amount == _item.seatPrice });
            if (index > -1) { //说明存在 就是更新
                that.seatPriceList[index].count++;
                that.$forceUpdate();
            } else {
                that.seatPriceList.push({
                    type: seat,
                    amount: _item.seatPrice,
                    count: 1
                })
            }
        });
    },
    /**
     *  判断改签的状态  用来显示座位价格明细 setPriceDetail 是改签成功后续的操作的话返回true
     */
    chargeChangeOrderStatus(changeOrderStatus){
        if (changeOrderStatus=='CHANGE_SUCCESS'||changeOrderStatus=='AFTER_CHANGE_REFUND_SUCCESS'||changeOrderStatus=='AFTER_CHANGE_REFUND_FAILED'||changeOrderStatus=='AFTER_CHANGE_REFUNDING'){
            return true;
        }
        return false;
        
    },

    /**
    * 每次进入页面，自动拉取一次 定制业务的配置数据，用于 不同的渠道，
    * 控制定制业务的显示与否
    */
    getMyCustomConfigs(){
        let that = this;
        //每次进入页面，自动拉取配置数据
        getAPPCustomConfigs().then(response=>{
            //报销凭证 定制功能 取值
            that.reimbursementConfig = response && response.Reimburse ? response.Reimburse.DisPlay : true;
            //火车票订单改签 定制功能 取值
            that.endorseTrainConfig = response && response.TrainOrderEndorse ? response.TrainOrderEndorse.DisPlay : true;

        }).catch(error=>{
            console.log(error);
        })
    },
    /**
     * 列车时刻表
     */
    showTravel() {
        const that = this;
        that.showTravelByPop = true;
    },
    /**
     * 获取列车详情
     */
    getTrainLineByTrainNo(trainNo) {
        const that = this;
        const obj = {
            "trainCode": trainNo,
            "fromStation": that.orderData.orderInfo.startStation,
            "toStation": that.orderData.orderInfo.endStation,
            "queryDate": that.orderData.orderInfo.startDate
        };

        requestHandler.getTrainLineByTrainNo(obj).then((res) => {
            that.showTravel();
            if (!!res.result) {
                that.tavelList = res.result.siteList;
            }
        }).catch((err) => {
            console.log(err)
        });
    },
    /**
     * 查询退票详情
     */
    showRefundDetailPop(item) {
        if (!!item.newTuiOrder){ //如果是没有改签直接退票的显示newTuiOrder
            this.choosedPsg = item.newTuiOrder;
        } else { //有改签直接退票的
            this.choosedPsg = item;
        }
        this.showTuiStatus = false;
        this.showRefundPop = true;
    },
    /**
     * 支付成功回调
     */
    paySuccCallback() {
        requestHandler.unLoadPay();
        this.timeInterval && clearInterval(this.timeInterval);
        this.checkPopStatus = true;
        let param = OrderClass.toSuccessParam();
        param.query.pageFrom = 'order';
        this.$router.push(param);
    },
    /**
     * 处理非T信返回时的操作
     */
    // closeTopPop() {
    //     const that = this;
    //     extendUtils.stateManager.closeTopPop(() => {
    //         that.checkPopStatus = true;
    //         let loadData = {
    //             orderNo: that.orderDetail.orderNo,
    //             orderStatus: that.orderDetail.orderStatus,
    //             postSaleStatus: that.orderDetail.postSaleStatus,
    //             changeAndRefundStatus: that.orderDetail.changeAndRefundStatus
    //         };
    //         loadData = JSON.stringify(loadData);
    //         if(that.pageFrom=='pay'){//push是推送过来的，必须返回2次，否则安卓有问题
    //             extendUtils.closePage('', 2, loadData);
    //         } else if(that.pageFrom=='push'){//push是推送过来的，必须返回2次，否则安卓有问题
    //             extendUtils.closePage('', extendUtils.getNavigatorType() == 'ios' ? 1 : 2, loadData);
    //         }else if(that.pageFrom=='orderListPc'){
    //             extendUtils.closePage('', 1, loadData);
    //         }else{
    //             extendUtils.closePage('', 1, loadData);
    //         }
    //     });
    // },
    /**
     * 取消订单
     */
    cancelOrder() {
        const that = this;
        OrderClass.cancelOrder().then((res)=>{
            if (res.result && res.result.success) {
                that.limitTime = null;
                extendUtils.showToast("取消成功");
                that.getOrderDetail();
            } else {
                extendUtils.showToast("取消失败");
            }
        }).catch((e)=>{
            console.error(e);
        })
    },

    /**
     * 确认退票
     */
    onConfirm() {
        const that = this;
        if (!that.showTuiStatus){ return } //如果是查看退款详情return 掉
        const orderNo = that.newOrderNo || that.orderDetail.orderNo;
        let obj = {
            "companyId": requestHandler.companyId,
            "userId": requestHandler.userId,
            "orderNo": orderNo,
            "psgIds": that.choosedPsgId,
            "psgNames": that.choosedPsgName
        };
        const defaultErrorMsg = '申请退票失败';
        that.popLoading = true;
        that.loadingText = '退票中...';
        extendUtils.throttle(function () { 
            requestHandler.applyTrainRefund(obj).then(function (res) {
                if (res.resultCode==0 && res.result.success) {
                    that.popLoading = false;
                    that.loadingText = '加载中...';
                    that.checkPopStatus = true;
                    that.showRefundPop = false;
                    extendUtils.showToast('申请退票成功');
                    that.newOrderNo = '';//清空新的订单号
                    that.$nextTick(() => {
                        that.getOrderDetail();
                    });
                } else {
                    that.newOrderNo = '';//清空新的订单号
                    extendUtils.showToast(res.rdesc || defaultErrorMsg);
                }
            }).catch((e) => {
                that.popLoading = false;
                that.loadingText = '加载中...';
                that.newOrderNo = '';//清空新的订单号
                that.showErrorTips(e);
            });
        }, that);
    },
    /**
     * 停止倒计时
     * @param key 航班号
     */
    clearCountdown(key) {
        const that = this;
        //如果key为空，就清空所有倒计时
        if (!!that.trainTimeInterval && !key) {
            Object.keys(that.trainTimeInterval).forEach((key1)=>{
                that.clearCountdown(key1);
            })
            return;
        }
        clearInterval(that.trainTimeInterval[key]);
        that.$set(that.trainTimeInterval, key , null);
        that.$set(that.trainRemaining, key , null) ;
        that.$forceUpdate();
    },
    /**
     * 火车票改签倒计时
     */
    cutDownTime(remainPayTime, key){
        const that = this;
        //如果该航班已存在倒计时（注意要用typeof判断），则返回。否则会陷入死循环
        if (typeof that.trainRemaining[key] == 'undefined') {
            that.trainRemaining[key] = {}
        } else {
            return;
        }
        if (typeof that.trainTimeInterval[key] == 'undefined') {
            that.trainTimeInterval[key] = {}
        } else {
            return;
        }
        if (!!remainPayTime) {
            if (!that.trainRemaining) {
                that.trainRemaining = {}
            }
            let step = 1;//时间减少的步长
            that.$set(that.trainRemaining, key , remainPayTime) ;
            that.$set(that.trainTimeInterval, key , setInterval(function () {
                let remainingTime = that.trainRemaining[key] ;
                if (!!remainingTime){
                    if (remainingTime/step <= 1) {
                        that.getOrderDetail();
                        that.clearCountdown(key);
                    } else {
                        that.$set(that.trainRemaining, key, remainingTime - step);
                        that.$forceUpdate();
                    }
                } else if (that.trainRemaining[key]){
                    that.clearCountdown(key);
                }
            }, 1000));
        } else {
            that.clearCountdown(key);
        }
    },
    /**
     * 判断是否还有没退票或改签的旅客
     */
    checkStatus(psgList) {
        const that = this;
        //退list的排序规则，日期倒序
        const compareTui = (x, y) => {
            const timeStampX = new Date(x.opTime).getTime();
            const timeStampY = new Date(y.opTime).getTime();
            if (timeStampX < timeStampY) {
                return 1;
            } else if (timeStampX > timeStampY) {
                return -1;
            } 
            return 0;
            
        };
        const compareGai = (x, y) => {
            const timeStampX = new Date(x.changeApplyTime).getTime();
            const timeStampY = new Date(y.changeApplyTime).getTime();
            if (timeStampX < timeStampY) {
                return 1;
            } else if (timeStampX > timeStampY) {
                return -1;
            } 
            return 0;
            
        };

        //清空改签票数组
        that.gaiOrderObj = [];

        //更新改签倒计时
        that.clearCountdown();
        that.trainRemaining = {};
        that.trainTimeInterval = {};//改签支付倒计时的Interval存储对象
        
        psgList.forEach((item) => {
            if (!!item.changeOrderInfoList && item.changeOrderInfoList.length > 0) {
                //按时间倒序，取最新申请的改签单
                let gaiList = item.changeOrderInfoList.sort(compareGai);
                let gaiItem = gaiList[0];
                if (that.psgStatuState(gaiItem.changeOrderStatus) == StateStyle.SUCCESS || that.psgStatuState(gaiItem.changeOrderStatus) == StateStyle.INPROCESS) {
                    gaiItem.startDate = gaiItem.startTime.substring(0, 10);
                    gaiItem.startTime = gaiItem.startTime.substring(11, 16);
                    gaiItem.endDate = gaiItem.endTime.substring(0, 10);
                    gaiItem.endTime = gaiItem.endTime.substring(11, 16);
                    gaiItem.priceDiffNeedPaying = gaiItem.priceDiffNeedPaying; // eslint-disable-line
                    gaiItem.psgName = item.psgName;
                    gaiItem.psgId = item.psgId;
                    gaiItem.cardNo = item.cardNo;
                    gaiItem.cardType = item.cardType;
                    that.gaiOrderObj.push(gaiItem);
                }
                // 改签占座成功后更新倒计时对象
                if (gaiItem.changeOrderStatus=='SEAT_TAKEN_SUCCESS' && gaiItem.remainPayTime > 0){
                    that.cutDownTime(gaiItem.remainPayTime, gaiItem.newOrderNo);
                }
                that.$set(item, 'newGaiOrder', gaiItem);
                that.$set(item, 'status', gaiItem.changeOrderStatus);
            }
            if (!!item.refundOrderInfoList && item.refundOrderInfoList.length > 0) {
                //按时间倒序，取最新申请的退单
                let tuiList = item.refundOrderInfoList.sort(compareTui);
                that.$set(item, 'newTuiOrder', tuiList[0]);
                that.$set(item, 'newGaiOrder', null); //将改签的更新为null 退票的优先级大于改签的
                that.$set(item, 'status', tuiList[0].orderStatus);
            }
            if ((item.refundOrderInfoList && item.refundOrderInfoList.length <= 0) && (item.changeOrderInfoList && item.changeOrderInfoList.length <= 0)) {
                that.$set(item, 'status', "0");
            }
            if (!item.refundOrderInfoList && !item.refundOrderInfoList) {
                that.$set(item, 'status', "0");
            }

            //TODO 临时处理，未知出票结果
            if (item.ticketStatus=='W'){
                that.$set(item, 'status', "101");
            }
            //TODO 临时处理，标识该乘客已取票，目前的作用是此时不能改签
            if (item.ticketStatus=='Q'){
                that.$set(item, 'status', "102");
            }
        });
    },

    //显示高改低改签差额明细
    showChangeDetails(item){
        this.changeDetailDes = item;
        this.showChangeDetailPop = true;
    },
    /**
     * 判断是否是在23:00-6:00是否可购票退票
     */
    checkHour() {
        let res = false;
        let myDate = new Date();
        let hour = myDate.getHours();
        if (22 < hour || hour < 6) {
            res = true;
        }
        return res;
    },
    /**
       * 确认改签操作
       */
    confirmChange(item) {
        const that = this;
        if (item.priceDiffNeedPaying > 0 && item.changeOrderStatus == 'SEAT_TAKEN_SUCCESS') { //调用支付

            that.needPay = true;
            that.payChangeAmount = item.seatPrice;
            that.newOrderNo = item.newOrderNo;

            //更新改签车次需要支付的时候传递的商品信息描述 
            that.changePayGoodsDes = {
                startStation : item.startStation || '',
                endStation : item.endStation || '',
                startDate : item.startDate || ''
            }
            //更新改签车次信息，用来判断超标和行程异常 
            that.needPayChangeTrainObj = item;
            //动态加载支付js
            that.loadPayComp();
            that.$nextTick(() => {
                that.openPay(true);
            })
            //支付倒计时开始
            that.limitTime = that.trainRemaining[item.newOrderNo];
            let timer = null;
            if (that.limitTime>0){
                clearInterval(timer);
                timer = setInterval(function(){
                    that.limitTime--;
                    if (that.limitTime<=1){
                        //倒计时结束如果调起了支付js将支付组件js移除 组件改为false
                        that.swpPayLoad = false;
                        that.showPayTypes = false;
                        requestHandler.unLoadPay();                        
                        that.getOrderDetail(); //倒计时完成，再拉取一次订单详情
                        clearInterval(timer);
                        that.limitTime = null;
                        that.needPay = false;
                    }
                },1000)
            } else {
                clearInterval(timer);
            }

            that.$once('hook:beforeDestroy', () => {
                clearInterval(timer);
            })


        } else if (item.priceDiffNeedPaying <= 0) {
            let param = {
                companyId: requestHandler.companyId,
                userId: requestHandler.userId,
                channelId: requestHandler.channelId,
                orderNo: item.newOrderNo
            }
            requestHandler.confirmTrainChange(param).then((res) => {
                if (res.result && res.result.success) {
                    that.getOrderDetail();
                } else {
                    extendUtils.showToast('确认改签失败')
                }
            }).catch(() => {
            });
        }
    },


    /**
    * 跳转到退改进度
    */
    gotoRefundAndChange() {
        let that = this;
        requestHandler.openPageLib('train/index.html#/regression?orderNo=' + that.orderDetail.orderNo);
    },
    /**
    * 取消改签操作
    */
    cancelChange(item) {
        const that = this;
        let param = {
            companyId: requestHandler.companyId,
            userId: requestHandler.userId,
            channelId: requestHandler.channelId,
            orderNo: item.newOrderNo
        }
        requestHandler.cancelTrainChange(param).then((res) => {
            if (res.result && res.result.success) {
                that.getOrderDetail();
            } else {
                extendUtils.showToast('取消改签失败')
            }
        }).catch(() => {
        });
    },
    /**
     * 开始改签
     */
    changeTicket(person, orderDetail) {
        let that = this;
        //验证是否可改签
        if (that.checkAvailableTrainTime(that.orderDetail)){ return }
        //先判断乘车人状态，如果正在改签或退票，就提示，并终止操作
        if (that.isRefundingOrChanging(person)){ return }
        // 火车票验证是否可改签
        let param = {
            orderNo: orderDetail.orderNo,
            passengerId: person.psgId
        }
        that.popLoading = true;
        requestHandler.verifyTrainChange(param).then((res) => {
            if (res.result && res.result.success) {
                that.popLoading = false;
                extendUtils.setStorage('changeTrainTicketsPerson', JSON.stringify(person));
                extendUtils.setStorage('applyChangeOrderDetail', JSON.stringify(orderDetail));
                requestHandler.openPageLib('train/index.html#/endorse?psgName=' + person.psgName + '&StartStation=' + orderDetail.startStation + '&EndStation=' + orderDetail.endStation + '&StartDate=' + orderDetail.startDate);
            }
        }).catch((err) => {
            that.popLoading = false;
            that.showErrorTips(err);
        });
    },
    showErrorTips(res){
        let that = this;
        if (res.resultCode == '46020002') { //46020002
            let text = '铁路网上购票系统将在23:00-次日06:00进行系统维护，期间暂停服务；如您需办理购票、改签或退票，请到铁路车站窗口办理，谢谢';
            extendUtils.showConfirm(text, null, 1, null, null, '温馨提示', null, true);
            
        } else if (res.resultCode == '46020020' || res.resultCode == '46020026') { //46020020 46020026
            that.showOverTimeShort();
        } else if (res.resultCode == '46020022' || res.resultCode == '46020040') { //46020022
            that.showOverTimePop();
        } else if (res.resultCode == '46020019') { //46020019
            that.showOverTickOut();
        } else if (res.resultCode == '46020038'){ //不符合改签条件
            that.showChangeError();
        } else if (res.resultCode == '46020039') {
            that.showOverChangeTimePop();
        } else if (res.resultCode == '46020021') {
            extendUtils.showToast('订单中存在正在进行改签的乘客');
        }
    },
    showOverTickOut(){
        let that = this;
        extendUtils.showConfirm('<div class="overTimePop">您已取票，无法办理网络改签/退票，如有需要请前往车站售票窗口办理</div>', function () {
            that.showDescription = true
        }, 2, '知道了', '退改说明', null, function () {}, true);
    },
    showOverTimeShort(){
        let that = this;
        extendUtils.showConfirm('<div class="overTimePop">距离发车时间不足35分钟，已停止网络改签/退票，如有需要请前往车站窗口办理</div>', function () {
            that.showDescription = true
        }, 2, '知道了', '退改说明', null, function () {}, true);
    },
    showOverTimePop(){
        let that = this;
        extendUtils.showConfirm('<div class="overTimePop">已过发车时间，无法办理网络改签/退票，如有需要请前往车站窗口办理</div>', function () {
            that.showDescription = true
        }, 2, '知道了', '退改说明', null, function () {}, true);
    },

    /***
     * 中的状态下，不能进行操作，按钮置灰  
     * 目前是改签和退票按钮 extendUtils.showToast 提示 改签中 和 退票中
     */
    isRefundingOrChanging(person){
        let res = false;
        if (person.newGaiOrder) {
            let psgStatusObj = getTrainPsgStatusObj(person.newGaiOrder.changeOrderStatus);
            if (psgStatusObj.state == StateStyle.SUCCESS || psgStatusObj.state == StateStyle.INPROCESS) {
                psgStatusObj.name && extendUtils.showToast(psgStatusObj.name[0] + ",请稍后重试");
                res = true;
            }
        }
        if (person.newTuiOrder) {
            let psgStatusObj = getTrainPsgStatusObj(person.newTuiOrder.orderStatus);
            if (psgStatusObj.state == StateStyle.SUCCESS || psgStatusObj.state == StateStyle.INPROCESS) {
                psgStatusObj.name && extendUtils.showToast(psgStatusObj.name[0] + ",请稍后重试");
                res = true;
            }
        }
        return res;
    },
    /**
     * 开始申请退票
     */
    cancelTicket(person) {
        const that = this;
        //先判断乘车人状态，如果正在改签或退票，就提示，并终止操作
        if (that.isRefundingOrChanging(person)){
            return; 
        }
        if (!that.checkAvailableTrainTime(that.orderDetail)){ //验证是否可退票
            that.choosedPsg = person;
            that.showTuiStatus = true;
            that.choosedPsgName = person.psgName;
            that.choosedPsgId = person.psgId + "";
            that.showRefundPop = true;
            document.title = '退票申请';
        }
        
    },

    //前端判断火车票操作改签/退票的时间限制 包括23：00-06：00；超过发车时间；发车不到35分钟等
    checkAvailableTrainTime(item){
        const that = this;
        let flag = false;
        let text = '铁路网上购票系统将在23:00-次日06:00进行系统维护，期间暂停服务；如您需办理购票、改签或退票，请到铁路车站窗口办理，谢谢';
        if (that.checkHour()) {
            extendUtils.showConfirm(text, null, 1, null, null, '温馨提示', null, true);
            flag = true;
            return flag;
        }
        //超过发车时间，不可退票
        let diffTime = new Date().getTime() - new Date(item.startDate + " " + item.startTime).getTime();
        if (diffTime >= 0) {
            that.showOverTimePop();
            flag = true;
            return flag;
        }

        //不到35分钟发车的票，不能点击退票
        let diffTimeShotTime = (new Date(item.startDate + " " + item.startTime).getTime()) - (new Date().getTime());
        if (diffTimeShotTime <= 35*60*1000) {
            that.showOverTimeShort();
            flag = true;
            return flag;
        }
        return flag;
    },


    //改签后退票
    cancelChangeTicket(person) {
        let that = this;
        if (!that.checkAvailableTrainTime(person)){
            that.newOrderNo = person.newOrderNo;
            that.choosedPsg = person;
            that.showTuiStatus = true;
            that.choosedPsgName = person.psgName;
            that.choosedPsgId = person.psgId + "";
            that.showRefundPop = true;
            document.title = '退票申请';
        }
    },
    //暂不支持改签成功后退票 友好弹窗
    //提示内容：当前版本暂不支持火车票改签后在线退票，如您需办理退票业务，请前往车站售票窗口或联系客服
    changeRefoundTips(){
        let tipStr = "当前版本暂不支持火车票改签后在线退票，如您需办理退票业务，请前往车站售票窗口或联系客服";
        extendUtils.showConfirm(tipStr,function(){
            sinosdk.sino.callTel(extendUtils.BIS_CUSTOMER_SERVICE_PHONE);
        },2,'知道了','联系客服',null,null,true);
    },
    
    /****
     * 365供应商暂不支持正常退票 目前针对365供应商的正常的退票前端暂时屏蔽
     ****/
    normalRefoundTips(){
        let tipStr = "当前版本暂不支持火车票在线退票，如您需办理退票业务，请前往车站售票窗口或联系客服";
        extendUtils.showConfirm(tipStr,function(){
            sinosdk.sino.callTel(extendUtils.BIS_CUSTOMER_SERVICE_PHONE);
        },2,'知道了','联系客服',null,null,true);
    },

    /**
     * 打开支付类型选择
     */
    orderPay() {
        const that = this;
        that.$nextTick(() => {
            that.openPay();
        })
    },


    /**
     * 查询订单详情
     */
    getOrderDetail() {
        //兼容如理，如果此时有confirm框，就关掉
        try {
            Vue.$vux.confirm.hide()
        } catch (e) { }
        const that = this;
        clearInterval(that.timeInterval);
        that.needPay = false;
        const orderNo = (that.$route.query || {}).orderNo;
        if (!!orderNo) {
            OrderClass.getOrderDetail(orderNo).then(res => {
                that.loading = false;
                if (!!res.result) {
                    //是否为别人帮预定的订单
                    that.selfOrder = res.result.selfOrder; 
                   
                    // todo 暂时屏蔽掉优惠券的东西                   
                    // if (!!res.result.Coupons && res.result.Coupons.length > 0) { // 优惠券
                    //     that.Coupons = res.result.Coupons
                    // }
                    // that.orderScore = res.result.OrderScore; todo 暂时屏蔽掉积分的东西
                   
                    that.orderData = res.result;
                    that.orderExtraInfo = res.result.orderExtraInfo;
                    that.orderDetail = res.result.orderInfo;
                    that.payOrderNo = that.orderDetail.orderNo;
                    that.orderPsgs = res.result.orderPsgs;
                    that.invoiceFlag = res.result.invoiceFlag;
                    if (that.invoiceFlag == 1) {
                        that.invoiceInfo = res.result.invoiceInfo;
                        that.invoiceContent = res.result.invoiceContent;
                    }

                    
                    that.checkStatus(that.orderPsgs, that.orderDetail);

                    that.setPriceDetail();
                    that.custOrderStatus = getTrainOrderStatus(that.orderDetail.orderStatus); //获取订单的显示状态
                    that.orderStatusColor = getTrainOrderStatusColor(this.orderDetail.orderStatus);//获取订单的显示状态的颜色样式
                    extendUtils.setStorage('customerList', JSON.stringify(that.orderPsgs));
                    that.startDate = new Date(that.orderDetail.startDate).format('yyyy年MM月dd日') + ' ' + extendUtils.indexToWeek(new Date(
                        that.orderDetail.startDate).getDay());
                    if (that.orderDetail.orderStatus == 'UNPAID') {
                        that.limitTime = that.orderExtraInfo.remainPayTime; //单位秒
                        if (that.limitTime > 0) {
                            that.timeInterval && clearInterval(that.timeInterval);
                            that.timeInterval = setInterval(function () {
                                if (that.limitTime) {
                                    if (that.limitTime <= 1) {
                                        that.limitTime = null;
                                        clearInterval(that.timeInterval);
                                        that.payTimeout();
                                    } else {
                                        that.limitTime = that.limitTime - 1;
                                    }
                                } else {
                                    that.timeInterval && clearInterval(that.timeInterval);
                                }
                            }, 1000);
                        } else {
                            that.limitTime = null;
                            clearInterval(that.timeInterval);
                        }

                        that.loadPayComp();                        
                    } else {
                        that.timeInterval && clearInterval(that.timeInterval);
                    }
                }
            }).catch((err) => {
                that.loading = false;
                console.error(err)
            });
        }
    },
    /**
     * 支付超时后的操作
     */
    payTimeout(){
        let that = this;
        if (that.orderDetail.orderStatus != 'UNPAID') {
            return
        }
        //pc端不主动查询状态，而是弹出确认框，用户确认后再查询
        if (extendUtils.isPC()){
            let msg = '抱歉，您的订单由于超时未支付已取消，请重新预订';
            extendUtils.showConfirm(msg, function(){
                that.getOrderDetail();
                that.orderAgain();
            }, 1, null, '确定', null, null, true);
        } else {
            setTimeout(()=>{
                that.getOrderDetail(); //倒计时完成，再拉取一次订单详情
            },1000);
        }
    },

    loadPayComp(){
        let that = this;
        if ((that.limitTime && that.limitTime>=0 && that.orderDetail.orderStatus=='UNPAID') || that.needPay){
            //动态加载支付组件
            requestHandler.dynamicLoadPay(()=>{
                that.swpPayLoad = true;
            })
        }
    },
    /**
     * 异步调起支付组件
     */
    openPay(noLimit=false){
        if (!this.limitTime && !noLimit){
            extendUtils.showToast('支付超时，请重新下单');
            return;
        }
        let core = ()=>{
            if (!this.swpPayLoad){
                this.popLoading = true;
                setTimeout(()=>{
                    core();
                },100);
                return;
            }
            this.popLoading = false;
            this.showPayTypes = true;
        }
        //先校验差标，再打开支付列表
        this.$refs.travelAbnormal.checkTravelAbnormal({orderNo: this.newOrderNo || this.orderDetail.orderNo}).then(res=>{
            this.checkSign = res;//保存校验成功的签名
            core();
        })
    }
};
