import requestHandler from 'orderCommon/requestHandler.js';
import extendUtils from 'orderCommon/extend.js';
import customerService from "components/customer-service/index";
import {
    getFlightOrderStatus,
    getFlightOrderStatusColor,
    flightOrderStatus,
    showFlightSubStatus,
    getFlightPostSaleStatus
} from 'orderCommon/enum/orderStatusEnum.js'
import {
    getFlightPsgStatusObj,
    StateStyle,
    gaiOrderStatuConvert,
    tuiOrderStatuConvert
} from 'orderCommon/enum/psgStatusEnum.js'
// let fromWhere = '';
const OrderClass = requestHandler.getOrderObj('flight');

export const watch = {};
/**
 * 便于扩展，所以用了这种写法
 * @param extend 扩展的属性
 */
export const data = function (extend) {
    return function () {
        const that = this;
        let managerData = extendUtils.stateManager.setData([
            {
                name: 'showDescription',
                type: 'page'
            },
            {
                name: 'showPriceDetail',
                type: 'page',
                show: {
                    callback: function () {
                        document.body.classList.add('body-noscroll');
                    }
                },
                hide: {
                    callback: function () {
                        document.body.classList.remove('body-noscroll');
                    }
                }
            },
            {
                name: 'showCancelTicketSuc',
                type: 'page',
                related: 'showCancelTicketInfo',
                show: {
                    title: '退票申请'
                },
                hide: {
                    title: '订单详情',
                    callback: function () {
                        that.getOrderDetail();
                    }
                }
            },
            {
                name: 'showEndorseInfo',
                type: 'page',
                hide: {
                    title: '订单详情'
                },
                show: {
                    title: '申请改签'
                }
            },
            {
                name: 'showCancelTicketInfo',
                type: 'page',
                show: {
                    title: '退票申请',
                    callback: function () {
                        document.body.classList.add('body-noscroll');
                    }
                },
                hide: {
                    title: '订单详情',
                    callback: function () {
                        document.body.classList.remove('body-noscroll');
                    }
                }
            },
            {
                name: 'showInsuranceOptionPop',//改签保险说明
                show: {
                    title: '说明'
                },
                hide: {
                    title: '退票申请'
                }
            },
            {
                name: 'showPsgPop',
                hide: {
                    callback: function () {
                        that.$refs.psgCard.initList();
                        that.showPsgPop = false;
                    }
                }
            },
            {
                name: 'showInsurancePop',
                hide: {
                    title: '退票申请'
                },
                show: {
                    title: '保险详情'
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
        /* eslint-disable */
        let data = {
            orderTax: '',
            orderAddress: '',
            useType: '',
            value1: '1',
            value2: '其他原因',
            otherReason: '',
            selectedOptions: '',
            popState: '', //出行人弹出框类型 0：改签 1：退票
            airline: {},
            airline2: {},
            choosedPsgArr: [],
            choosedPsg: '',
            choosedPsgId: '',
            choosedAirLine: {}, //退改签选中的航班
            isForward: false,
            loading: true,
            popLoading: false, //提交的loading
            limitTime: 0,
            optionList: [],
            orderDetail: {},
            //      orderState: '',
            choosenType: '',
            orderPsgs: [],
            orderType: 'flight',
            priceDetail: [],
            payTypeList: [{
                key: '1',
                value: '支付宝支付'
            }, {
                key: '2',
                value: '微信支付'
            }],
            startDate: '',
            isReturnType: false,
            commitType: 1,
            fromWhere: '', //从哪里跳转进来
            orderExtraInfo: {}, //订单信息，目前只有因公因私标记UseType
            pageFrom: '',
            seatPriceList: {}, //座位订单详情集合
            orderStatusColor: '',
            custOrderStatus: '',
            invoiceFlag: null,
            invoiceDone: null,
            timeInterval: null,
            paid: false,
            airLineList: [], //所有航班订单列表，包括改签的（只含有最新的改签记录）
            addMoney: 0, //补款金额（给某一个改签补款时赋值）
            sumAddMoney: 0, //所有的补款金额合计
            chaOrder: {
                orderNo: null,
                unPaidOrderNos: null
            }, //选中的改签单
            insuranceOrders: [],//保险订单列表
            insuredCountInfos: [],//保险订单展示名字列表
            orderData: {}, //订单数据
            orderNo: this.$route.query.orderNo,
            StateStyle: StateStyle, //psgStatusEnum中的StatuStyle对象
            currPayCabin: null, //当前支付的舱位，只有改签补款才有值；
            flightOrderStatus: flightOrderStatus,
            expressInfo: {},
            expresslist: [],
            expressStatus: '',
            expressStatusTime: '',
            needAddMoney: false,
            isInsAddMoney: false,//是否是单独的机票改签后保险补款
            // coupons: [],//优惠券列表
            expressFee: 0, // 快递金额
            orderScore: null, //积分
            loadPay: false,//开始支付
            checkSign: false,
            quitInsOrdering:false,//批量退保开关
            insuranceDetail: {},//保险详情
            goodsDesc: null,//支付时使用的商品描述
            publicTiantian:false, //因公购买天天游
            caution:'',//提示内容
            servicePhone: extendUtils.BIS_CUSTOMER_SERVICE_PHONE,//客服电话
            paymentMethods:[]//支付方式列表
        }
        data = Object.assign(managerData, data); //注意，用assign方法，managerData必须是第一个参数，否则其中的get、set方法会失效
        if (extend) {
            data = Object.assign(data, extend);
        }
        return data;
    };
}


/**=================生命周期函数====================**/
export const created = function () {
    const that = this;
    document.title = '订单详情';
    if (!!that.$route.query.pageFrom) {
        that.pageFrom = that.$route.query.pageFrom;
    }
    // extendUtils.reFreshPage(() => {
    //     that.excuteMainMethod();
    //     extendUtils.reloadWithNoCache()
    // })
    //注册并监听t信返回事件
    // extendUtils.appBack(function (data) { //点击app返回事件
    //     extendUtils.throttle(function () {
    //         that.closeTopPop();
    //     }, this);
    // }.bind(this));

    //新页面关闭回到本页面时，本页面自动刷新的事件

    sinosdk.sino.onChildWindowClose(function (datas) {
        //处理数据
        // try {
        //     if(!!data){
        //         data = requestHandler.analyzeWinCloseData(data);
        //         data.showPsgPop && (that.showPsgPop = data.showPsgPop)
        //         data.refresh && that.excuteMainMethod();
        //     }

        // } catch (e) {
        //     console.error(e)
        // }
        try {
            that.excuteMainMethod();
            that.sobotOut();
            if (!!datas){
                datas = requestHandler.analyzeWinCloseData(datas);
                datas.showPsgPop && (that.showPsgPop = datas.showPsgPop)
            }

        } catch (e) {
            console.error(e)
        }
    }.bind(this));
    that.$emit('showOff', true);
    that.excuteMainMethod();
    that.getPaymentMethods();

}

export const mounted = function () {
    let _this = this;
    window.onresize = function () {
        return (function () {
            _this.screenHeight = document.documentElement.clientHeight;
        })()
    }
}

/**=================路由====================**/
export const beforeRouteEnter = function (to, from, next) {
    // const that = this;
    this.fromWhere = from.path;
    next();
};
export const activated = function () {
    const that = this;
    // extendUtils.reFreshPage(() => {
    //     that.excuteMainMethod();
    //     extendUtils.reloadWithNoCache()
    // })
    document.title = '订单详情';
    that.$emit('showOff', true);
};

/**=================计算方法====================**/
export const computed = {
    //是否开了发票
    hasInvoice(){
        return (this.invoiceFlag=="1" || this.invoiceDone=="1") && this.orderDetail.orderStatus!=="ALREADY_CANCEL" && this.orderDetail.orderStatus!=="FAILED_OUT_TICKET";
    },
    invoiceSupplement(){
        return !this.hasInvoice && (this.showSubStatus(this.orderDetail.orderStatus) || this.orderDetail.orderStatus=='ALREADY_REFUND')
    },

    /********
     * 整合在线客服需要拼接的参数（用的在线客服事智齿科技）
     */
    zcConfig(){
        // let that = this;  
        if (!!extendUtils.isPC()){
            return {};
        }
        let callBackUrl = extendUtils.assignUrlParam('pageFrom', 'customerService');
        return {
            card_title: `${this.airLineList[0].airLineName} ${this.airLineList[0].flightNo} ${this.airLineList[0].sAirportName}-${this.airLineList[0].eAirportName}`, //标题（必传）
            card_url: encodeURIComponent(callBackUrl), //商品信息的商品链接地址（必传）（建议使用encodeURIComponent转义一下，防止链接中带有特殊符号导致参数获取失败）
            card_desc: encodeURIComponent(`订单号: ${this.orderDetail.providerOrderNo || this.orderDetail.orderNo}  金额: ￥${this.orderDetail.amount}  起飞时间: ${this.airLineList[0].beginDate} ${this.airLineList[0].beginTime}`), //商品信息的简述内容（选传）
            card_note: `${this.custOrderStatus}${this.chargeChangeAndRefundStatus(this.orderDetail.postSaleStatus)}`, //订单状态
            card_picture: encodeURIComponent(require('orderCommon/zkimg/flight.png')) //商品的缩略图（选传）（建议使用encodeURIComponent转义一下，防止链接中带有特殊符号导致参数获取失败） 此处选择用base64的方式
        }
        
    },
    /**
     * 获取支付方式名称
     */    
    getPaymentName(){
        let res = null;
        let that = this;
        if (!!this.orderDetail && !!this.orderDetail.payType && this.orderDetail.payType!=''){
            let index = that.paymentMethods.findIndex(item => {
                return item.payType == this.orderDetail.payType;
            })
            if (index > -1){
                res = that.paymentMethods[index].alias
            }
        }
        return res;
    }

}

/**=================过滤器====================**/
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
    getWeekDay(value) {
        if (!value) {
            return '';
        }
        let date = new Date(value);
        return extendUtils.indexToWeek(date.getDay(), 3);
    }
}

/**=================函数====================**/
export const methods = {

    //跳转到客服系统
    async gotoCustomerService(){  
        let url = await customerService.run(1, this.zcConfig, 'product').catch(e=>{
            console.log(e)
        });
        window.open(url)
    },

    //判断主订单括号里面的状态 比如 已出票（有改签）里面的有改签
    chargeChangeAndRefundStatus(statu){
        let res = getFlightPostSaleStatus(statu);
        return !!res ? `(${res})` : '';
    },

    getGoodsDesc(airline){
        return OrderClass.getGoodsDesc(airline);
    },
    getExpresslist() {
        let list = !!this.expressInfo ? this.expressInfo.expressDetails : [];
        if (!!list) {
            for (let i = 0; i < list.length; i++) {
                if (i == 0) {
                    list[i].isLastPoint = true;
                } else if (i == (list.length - 1)) {
                    list[i].isFirstPoint = true;
                }
            }
        }
        return list || [];
    },
    /**
     * 电话提示信息comfirm 转换,等特殊字符为‘转’排除 -
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
    /**
     * 核心方法：每次进入页面必须执行的所有方法
     */
    excuteMainMethod(openPayChannel) {
        this.paid = false;
        this.popLoading = false;
        this.getOrderDetail(openPayChannel);
    },
    /**
     * 当前订单状态是否是有票的状态
     */
    showSubStatus(statu) {
        return showFlightSubStatus(statu);
    },
    /**
     *  判断是否是往返航班
     */
    isRoundTrip() {
        return !!this.airline2 && Object.keys(this.airline2).length > 0;
    },

    /**
     * 联系客服打电话
     */
    callPhone() {
        sinosdk.sino.callTel(extendUtils.BIS_CUSTOMER_SERVICE_PHONE);
    },

    /**
     * 补开报销
     */
    toReimburse() {
        OrderClass.toReimburse();
    },
    /**
     * 查看报销详情
     */
    goReimburseDetail() {
        if (this.orderDetail.orderStatus == 'UNPAID') {
            extendUtils.showConfirm('订单未支付，无法查看报销凭证', null, 1, null, '知道了', null, null, true);
            return;
        }
        requestHandler.openPage('express/index.html#/invoice/flight?orderNo=' + this.orderDetail.orderNo)
    },
    /**
     * 再次预定
     */
    orderAgain() {
        OrderClass.toHome()
    },
    /**
     * 获取日期的time
     * @param date
     * @returns {number}
     */
    formatDate(date) {
        // const that = this;
        return new Date(date).getTime();
    },
    /**
     * T信点击返回的事件处理
     */
    // closeTopPop() {
    //     let that = this;
    //     extendUtils.stateManager.closeTopPop(() => {
    //         //小应用要跳到首页去   这段逻辑在现有首页上可能会有问题，暂不用
    //         //   if(extendUtils.getStorage('homePageType')!='mini'){
    //         //     requestHandler.openPage('flight.html#/');
    //         //     return;
    //         //   }
    //         let loadData = {
    //             orderNo: that.orderDetail.orderNo,
    //             orderStatus: that.orderDetail.orderStatus,
    //             postSaleStatus: that.orderDetail.postSaleStatus,
    //         };
    //         loadData = JSON.stringify(loadData);
    //         if(that.pageFrom=='pay'){//push是推送过来的，必须返回2次，否则安卓有问题
    //             extendUtils.goBackPage('', 2, loadData);
    //         } else if(that.pageFrom=='push'){//push是推送过来的，必须返回2次，否则安卓有问题
    //             extendUtils.goBackPage('', extendUtils.getNavigatorType() == 'ios' ? 1 : 2, loadData);
    //         }else if(that.pageFrom=='orderListPc'){
    //             that.$router.go(-1)
    //         }else{
    //             extendUtils.goBackPage('', 1, loadData);
    //         }
    //     });
    // },
    /**
     * 选择往返程（暂保留，不过现在不支持往返程同时改签或退票）
     * 函数体已过时，暂保留函数声明，以后做往返程改签时，需要再修改
     */
    choosedChangeType() {
    },
    /**
     * 判断航班是否所有乘机人都改签
     */
    setAirLineDisableStyle(airLines) {
        airLines.forEach((airLine) => {
            let disableStyle = true;
            airLine.passengers.forEach((psg) => {
                if (!psg.gaiOrderList || psg.gaiOrderList.length == 0) {
                    disableStyle = false;
                    
                } else if (getFlightPsgStatusObj(psg.status).state != StateStyle.SUCCESS) {
                    disableStyle = false;
                    
                }
            });
            airLine.disableStyle = disableStyle;
        })
        return airLines;
    },
    /**
     * 获取退改签记录
     *
     * @param item
     * @param psg
     * @param airline
     */
    getGaiOrderList() {
        const that = this;
        let gaiList = [];
        //退改签list的排序规则，日期倒序
        const compare = (x, y) => {
            const timeStampX = new Date(x.appDate).getTime();
            const timeStampY = new Date(y.appDate).getTime();
            if (timeStampX < timeStampY) {
                return 1;
            } else if (timeStampX > timeStampY) {
                return -1;
            } 
            return 0;
            
        };
        that.airLineList.forEach((airline) => {
            //筛选出每个乘机人的最新退改签记录
            airline.passengers.forEach((psg) => {
                if (!!psg.gaiOrderList && psg.gaiOrderList.length > 0) {
                    //只取最新的改签航班记录
                    let currPsgGaiList = psg.gaiOrderList = psg.gaiOrderList.sort(compare); //顺便把乘机人的退改list按申请时间排个序，后面直接取第一个就是最新的退改记录
                    let lastGaiOrder = currPsgGaiList[0]; //由于现阶段只可能改签成功一次，所以取第一个改签单即可
                    // let lastGaiOrderAppDate = lastGaiOrder ? lastGaiOrder.appDate : null;
                    lastGaiOrder.passenger = JSON.parse(JSON.stringify(psg));

                    //如果该乘客有退票历史，需要先判断最新一次退票是在某个改签单上，还是在原航班上
                    if (!!psg.tuiOrderList && psg.tuiOrderList.length > 0) {
                        let currPsgTuiList = psg.tuiOrderList.sort(compare);
                        let lastTuiOrder = currPsgTuiList[0]; //只有最新的退单有意义，因为只可能退成功一次。（最新的无论成功或失败都是有意义的）

                        //1. 如果当前乘客最新的退票是在改签单上的，则把lastGaiOrder上的Status替换成退单的状态，同时把原航班上这个乘客的Status改成“已改签”
                        //说明：这种情况对应了乘客由A航班改签到B航班（B可能等于A，比如升舱改签），改签成功后，再到B航班上进行退票。所以原航班上肯定是“已改签” ，否则不可能在改签航班上退票。
                        //2. 如果当前乘客最新的退票是在原航班上的，则原航班依然使用乘客的Status，不用修改
                        //说明：这种情况对应了乘客A航班改签到B航班（B可能等于A，比如升舱改签），改签失败了（失败的改签航班不展示），再回到原航班退票。
                        if (that.isCancelByGaiOrder(airline, psg)) {
                            lastGaiOrder.passenger.status = tuiOrderStatuConvert[lastTuiOrder.refStatus]; //注意这两行的代码顺序！
                            psg.status = 16; //原航班先写死成改签成功。（状态码不应该硬编码）
                        }
                    }
                    gaiList.push(lastGaiOrder);

                    //拼接改签单的简要信息。在改签失败的时候展示用
                    psg.endorseShortInfo = that.getGaiOrderShortInfo(lastGaiOrder);
                }
            });
        })
        if (!!gaiList && gaiList.length > 0) {
            //对整个改签航班列表转化格式并按时间倒序排序
            gaiList = that.convertGaiOrder(gaiList).sort((x, y) => {
                const timeStampX = x.gaiOrder && new Date(x.gaiOrder.appDate).getTime();
                const timeStampY = y.gaiOrder && new Date(y.gaiOrder.appDate).getTime();
                if (timeStampX < timeStampY) {
                    return 1;
                } else if (timeStampX > timeStampY) {
                    return -1;
                } 
                return 0;
                
            });
            //新的航班集合是：原航班集合+改签航班集合。改签航班的数据结构和原航班类似
            that.airLineList = [...gaiList, ...that.airLineList];
        }
    },
    /**
     * 是否是在改签单上退票的(默认TuiOrderList和GaiOrderList都是按时间倒序排列的）
     * 注：现阶段没有多次改签，所以以下方案只适合改签成功一次的情况
     * @param psg 乘机人对象（传这个是为了方便以后扩展）
     */
    isCancelByGaiOrder(airline, psg) {
        let tuiOrderList = psg.tuiOrderList;
        let gaiOrderList = psg.gaiOrderList;
        //没有退票单则没有继续讨论的意义
        if (!tuiOrderList || tuiOrderList.length == 0) {
            return false;
        }
        //如果没有改签单，则肯定是在原航班退票
        if (!gaiOrderList || gaiOrderList.length == 0) {
            return false;
        }

        //最近一次退票成功的改签单；
        let lastSucTuiOrder = tuiOrderList[0]; //只有最新的退单有意义，因为只可能退成功一次
        //最近一次改签成功的改签单；在此之后的所有失败的改签单都没有讨论的意义，因为改签失败的航班是不会展示的
        let lastSucGaiOrder = gaiOrderList[0]; //由于现阶段只可能改签成功一次，所以取第一个改签单即可
        let convertStatus = gaiOrderStatuConvert[lastSucGaiOrder.chaStatus]; //将改签单的状态转化成出行人的Status
        let orderState = getFlightPsgStatusObj(convertStatus).state; //获取改签单状态对应的状态类型（成功or失败）
        //如果这个改签单是成功的，且改签申请时间小于退票申请时间，那退单只可能是在这个改签单上退的
        //如果这个改签单是失败的，那只可能在原航班上退票
        if (orderState == StateStyle.SUCCESS && new Date(lastSucTuiOrder.appDate).getTime() > new Date(lastSucGaiOrder.appDate).getTime()) {
            return true;
        } //注意，这里还省略了CANCEL和INPROCESS的状态，这两个状态下是不可能退票的。统一返回false，这两种情况没讨论的意义
        return false;
        
    },
    /**
     * 拼接改签单的简要信息。在改签失败的时候展示用
     */
    getGaiOrderShortInfo(gaiOrder) {
        try {
            let airline = gaiOrder.chaFlightInfo;
            let dateStr = new Date(airline.beginDate).format('MM月dd日');
            return dateStr + " " + airline.sCityName + "-" + airline.eCityName + " " + airline.flightNo + " " + airline.cabinName;
        } catch (e) {
            return '';
        }
    },
    /**
     * 将GaiOrder转化成正常行程对象那样的结构
     */
    convertGaiOrder(gaiList) {
        //转化完后的gaiOrderObj格式应类似于：
        //{
        // flightNo：{
        //              ..航班信息，
        //              Passengers，//旅客信息，含有TuiOrderList和GaiOrderList
        //              gaiOrder，//这个改签单的信息，不再含有Passengers集合
        //              isGaiOrder//true
        //            }
        // }
        let gaiFlightObj = {};
        let sumAddMoney = 0; //补款金额合计值
        gaiList.forEach((gaiOrder) => {
            let chaOrderNo = gaiOrder.chaOrderNo;
            let obj = gaiFlightObj[chaOrderNo]; //以航班为主体结构，然后向里面填充出行人list和退改签list（类似原始航班的结构）
            if (!obj || Object.keys(obj).length == 0) {
                obj = gaiOrder.chaFlightInfo;
                obj.passengers = [];
            }
            obj.passengers.push(gaiOrder.passenger); //拼接航班下的乘机人list
            delete gaiOrder.passenger; //用完就删，给obj.gaiOrder的结构里不用存乘机人对象（这里面的乘机人对象也没有实际意义，因为只有其中一个）
            //注意：obj.gaiOrder实际存的是这个航班里面最后一次遍历出来的乘机人的gaiOrder。由于一个改签单里面的人状态是一致的，因此可以直接用gaiOrder的状态做一些判断
            obj.gaiOrder = gaiOrder; //给改签单的一个语法糖，拿改签单里面的改签数据时，就不用再到Passengers的GaiOrderList里面去拿了。
            obj.isGaiOrder = true; //标识是改签单
            gaiFlightObj[chaOrderNo] = obj;
        })
        //遍历gaiOrderObj，将航班信息拿出来放到list中，这样就和原始航班的AirLines结构一样了
        let result = [];
        Object.keys(gaiFlightObj).forEach((key) => {
            let flight = gaiFlightObj[key];
            //判断这个改签单是否改签失败(或取消)了,都改签失败(或取消)了这个改签航班就不展示了
            //由于一个改签单里面的人状态是一致的，因此可以直接用gaiFlightObj.gaiOrder的状态做一些判断
            let statusConvert = gaiOrderStatuConvert[flight.gaiOrder.chaStatus];
            let statusState = getFlightPsgStatusObj(statusConvert).state;
            if (statusState != StateStyle.FAILED && statusState != StateStyle.CANCEL) {
                result.push(flight);
                //改签航班的补款金额求和
                let gaiOrder = flight.gaiOrder;
                gaiOrder.needAddMoney && (sumAddMoney += gaiOrder.realAddMoneyAmount);
            }
        })
        this.sumAddMoney = sumAddMoney;
        return result;
    },
    /**
     * 判断这个改签单是否所有人都改签失败了
     * @param passengers 改签单内的乘机人集合
     */
    isGaiOrderFailed(passengers) {
        let endorseFailed = true;
        passengers && passengers.forEach((psg) => {
            //有一个人没失败就不算全部失败
            if (getFlightPsgStatusObj(psg.status).type != 1 || getFlightPsgStatusObj(psg.status).state != StateStyle.FAILED) {
                endorseFailed = false;
                
            }
        });
        return endorseFailed;
    },
    /**
     * 日期格式化
     * @param date
     * @returns {string|Object|string}
     */
    handleDate(date) {
        // const that = this;
        let str = '';
        if (!!date && new Date(date).getTime() > 0) {
            const timeZone = new Date().getTimezoneOffset() / 60;
            if (new Date(date.split('T')).getTime() > 0) {
                date = date.split('T');
                str = new Date(date).format('yyyy/MM/dd HH:mm:ss')
            } else {
                str = new Date(new Date(date).getTime() + timeZone * 3600000).format('yyyy/MM/dd HH:mm:ss')
            }
        } else {
            str = '待确认'
        }
        return str;
    },
    /**
     * 航班飞行时间
     * @param airLine 航班对象（去程、返程）
     * @returns {number}
     */
    countTime(airLine) {
        // const that = this;
        let time = 0;
        if (!!airLine) {
            const startTime = airLine.beginTime.split(':');
            const endTime = airLine.arriveTime.split(':');
            const between = (parseInt(endTime[0]) - parseInt(startTime[0])) * 60 + parseInt(endTime[1]) - parseInt(
                startTime[1]);
            if (airLine.beginDate == airLine.arriveDate) {
                time = "约" + parseInt(between / 60) + '小时' + extendUtils.addZero(between % 60) + '分钟'
            } else {
                time = "约" + parseInt(between / 60 + 24) + '小时' + extendUtils.addZero(between % 60 + 60) + '分钟'
            }
        }
        return time;
    },

    /**
     * 确认改签或退票，进入下一个步骤
     * @param changeObj
     */
    onConfirm(changeObj) {
        const that = this;
        const orderNo = that.orderDetail.orderNo;
        let airLine = that.choosedAirLine;
        //过滤掉空数据（未找到空数据的原因，先简单处理）
        that.choosedPsgArr = that.choosedPsgArr.filter(psg=>{
            return !!psg;
        })
        if (that.popState == 0) { //改签
            let endorseMsg = {};
            let beginDate = changeObj.beginDate || airLine.beginDate;
            //删除乘机人的GaiOrderList，否则后面转json字符串时会引起循环引用的错误。而且GaiOrderList后面用不到
            let choosedPsgArr = [];
            that.choosedPsgArr.forEach(psg => {
                let _psg = Object.assign({}, psg);
                delete _psg.gaiOrderList;
                choosedPsgArr.push(_psg);
            })
            endorseMsg = {
                "psgIDs": that.choosedPsgId,
                "psgNames": that.choosedPsg,
                "psgArr": choosedPsgArr,
                "orderNo": orderNo,
                "providerOrderNo": that.orderDetail.providerOrderNo,
                "airLineIDs": airLine.airLineID + '',
                "airCompanyLogoImg": airLine.airCompanyLogoImg + '',
                "airCompanyName": airLine.airCompanyName + '',
                "planeType": airLine.planeType + '',
                "airLineCode": airLine.airLineCode + '',
                "eCityCode": airLine.eCityCode + '',
                "sCityCode": airLine.sCityCode + '',
                "beginDate": beginDate,
                //如果改签日期大于原始航班起飞日期，则BeginTime从0点开始；如果是同一天，则BeginTime是原航班时间
                "beginTime": (new Date(beginDate).getTime() - new Date(airLine.beginDate).getTime()) > 0 ? "00:00" : airLine.beginTime,
                "cabin": airLine.cabin + '',
                "cabinRank": changeObj.cabinRank + '',
                "providerType": that.orderDetail.providerType,
                "endorseOrderObj": {
                    "airLineCode": airLine.airLineCode,
                    "airLineID": airLine.airLineID,
                    "beginDate": airLine.beginDate,
                    "beginTime": airLine.beginTime,
                    "cabin": airLine.cabin,
                    "flightNo": airLine.flightNo
                }
            };
            extendUtils.setStorage('endorseMsg', JSON.stringify(endorseMsg));
            extendUtils.setStorage('startCity', airLine.sCityName);
            extendUtils.setStorage('endCity', airLine.eCityName);
            requestHandler.openPage('flight/index.html#/list?type=endorse');
            that.showEndorseInfo = false;
        } else { //退票
            let obj = {
                "orderNo": orderNo,
                "psgIDs": that.choosedPsgId,
                "psgNames": that.choosedPsg,
                "refundType": changeObj.refundType,
                "airLineIDs": airLine.isGaiOrder ? airLine.gaiOrder.oladAirlineIDs : airLine.airLineID, //改签航班也要用原始航班的id
                "remark": changeObj.remark,
                "path": changeObj.path,
                "chaAirLineIDs": airLine.isGaiOrder ? airLine.airLineID : null,//如果是改签单，传入改签航班id，腾邦要用
                "chaOrderNo": airLine.isGaiOrder ? airLine.gaiOrder.chaOrderNo : null//如果是改签单，传入改签单号，腾邦要用
            };
            const defaultErrorMsg = '退票失败';
            that.popLoading = true;
            requestHandler.applyFlightRefund(obj).then((res) => {
                that.popLoading = false;
                if (res.result.success) {
                    that.showCancelTicketSuc = true;
                } else {
                    extendUtils.showToast(!!res.rdesc ? res.rdesc : defaultErrorMsg);
                }
            }).catch(() => {
                that.popLoading = false;
            });
        }
    },
    /**
     * 日期格式化
     * @param date
     * @returns {Object}
     */
    strDate(date) {
        return new Date(date).format("yyyy/MM/dd")
    },
    /**
     * 选择改签/退票人点击确定按钮后的方法，用于隐藏psgCard，并显示退/改签相应的确认页面
     */
    confirmReturn(psgList) {
        const that = this;
        if (that.choosedPsg.length == 0) {
            extendUtils.showConfirm('请选择需要办理退票/改签的乘客', null, 1, null, null, null, null, true)
        } else {
            that.choosedPsg = '';
            that.choosedPsgId = '';
            that.choosedPsgArr = psgList;
            psgList.forEach((val, index) => {
                that.choosedPsg += val.psgName;
                that.choosedPsgId += val.psgId;
                if (index != psgList.length - 1 && psgList.length > 1) {
                    that.choosedPsg += ','
                    that.choosedPsgId += ','
                }
            });
            if (that.popState == 0) {
                that.showEndorseInfo = true;
                document.title = '申请改签';
            } else {
                that.showCancelTicketInfo = true;
                that.$refs.cancelTicketInfo.init();
                document.title = '退票申请';
            }
        }
        that.showPsgPop = false;
    },
    /**
     * 取消订单
     */
    cancelOrder(orderNo = this.orderDetail.orderNo) {
        let that = this;
        OrderClass.cancelOrder(orderNo).then((res)=>{
            if (res.result && res.result.success) {
                that.limitTime = null;
                extendUtils.showToast("取消成功");
                that.getOrderDetail();
            } else {
                extendUtils.showToast("取消失败");
            }
        }).catch((e)=>{
            console.error(e);
        });
    },
    /**
     * 点击改签或退票按钮的方法，弹出选乘客的popup
     * @param person 乘机人
     * @param airline 选中的航班
     * @param isRoundTrip 往返程 0：去程 1：返程
     * @param type 操作类型 0： 改签 1：退票
     */
    changeTicketState(person, airline, isRoundTrip, type) {
        const that = this;
        extendUtils.throttle(()=>{
            if (that.is365OutOfService()) {
                extendUtils.showConfirm('365商旅在00:00--07:00暂停在线改签、退票服务，给您带来不便敬请谅解', null, 1, null, '确定', null, null, true);
                return;
            }

            //先判断乘机人状态，如果正在改签或退票，就提示，并终止操作
            let psgStatusObj = getFlightPsgStatusObj(person.status);
            if (psgStatusObj.state == StateStyle.INPROCESS) {
                extendUtils.showToast(psgStatusObj.name[0] + ",请稍后重试");
                return;
            }

            //退改签1年内有效
            let nowTime = new Date().getTime();
            let startTime = new Date(this.airline.beginDate).getTime()
            if ((nowTime - startTime) / 1000 / 60 / 60 / 24 >= 365) {
                extendUtils.showConfirm('机票已过退改有效期，如需办理相关业务，请前往航司值机柜台现场办理或拨打客服热线<span class="text-phone normal-btn">'+this.orderDetail.providerPhone+'</span>', function () {
                    that.callPhone();
                }, 2, '取消', '确定', null, function () {}, true);
                return;
            }

            that.choosedPsgArr = [person];
            that.choosedPsg = person.psgName;
            that.choosedAirLine = airline;



            that.choosedPsgId = person.psgId + "";
            if (isRoundTrip == 1) {
                that.selectedOptions = ["去程票"];
            } else {
                that.selectedOptions = ["返程票"];
            }
            that.$nextTick(() => {
                that.$refs.psgCard.setDefaultPsgId(person.psgId);
            })
            that.popState = type;
            that.showPsgPop = true;
        }, this)
    },
    /**
     * 点击补款按钮，给补款金额赋值，并调用支付选中框
     */
    addMoneyPay(airline) {
        this.addMoney = airline.realAddMoneyAmount;
        this.chaOrder.orderNo = airline.gaiOrder.chaOrderNo;
        this.chaOrder.unPaidOrderNos = this.getUnPaidOrderNos(airline.gaiOrder.unPaidOrderNos);
        this.goodsDesc = this.getGoodsDesc(OrderClass.setAirline({
            departDate: airline.beginDate,
            arriveDate: airline.arriveDate,
            departTime: airline.beginTime,
            arriveTime: airline.arriveTime,
            departCityName: airline.sCityName,
            arriveCityName: airline.eCityName,
            departCityCode: airline.sCityCode,
            arriveCityCode: airline.eCityCode,
            departAirportName: airline.sAirportName,
            arriveAirportName: airline.eAirportName
        }).airline);
        this.currPayCabin = airline.cabinName;
        this.isInsAddMoney = airline.isInsAddMoney || false;
        this.orderPay();
        extendUtils.setSession(extendUtils.primaryKey + this.orderDetail.orderNo + '_chaOrderNo', window.JSON.stringify({chaOrderNo: this.chaOrder.orderNo, unPaidOrderNos: this.chaOrder.unPaidOrderNos }));
    },
    /**
     * 点击支付按钮弹出支付选择框
     */
    orderPay() {
        //改签的不验价
        if (this.needAddMoney || this.isInsAddMoney){
            this.openPay(this.needAddMoney);//改签要校验差标
            return;
        }
        this.verifyCabinPrice();
    },

    /**
     * 验价
     */
    verifyCabinPrice(){
        let that = this;
        try {
            that.popLoading = true;
            requestHandler.verifyCabinPrice({
                providerType: this.orderDetail.providerType,
                flightNo: this.airline.flightNo,
                sCode: this.airline.sAirportCode,
                eCode: this.airline.eAirportCode,
                cabin: this.airline.cabin,
                goDate: this.airline.beginDate,
                sTime: this.airline.beginTime,
                chd: false,
                currFare: this.airline.fare,
                directSale: this.airline.directSale,
                orderNo: this.orderDetail.orderNo,
                productId: this.airline.productId,
                tax: this.airline.tax,
                oil: this.airline.oil,
                endDate: this.airline.arriveDate,
                eTime: this.airline.arriveTime,
                share: this.airline.share,
                airLineCode: this.airline.airLineCode
            }).then(res => {
                that.popLoading = false;
                if (res.result.canBook && res.result.newFare != this.airline.fare){
                    extendUtils.showConfirm('因航司票价浮动，订单实际支付金额已由￥' + this.airline.fare + '变更为￥' + res.result.newFare,
                        function () {
                            that.excuteMainMethod(true);
                        }, 1, null, '知道了', null, null, true);
                    return true;
                } else if (!res.result.canBook){
                    extendUtils.showConfirm('您预订的舱位已经售罄，订单已取消，请重新选择其他舱位或航班。',
                        function () {
                            that.excuteMainMethod();
                        }, 1, null, '知道了', null, null, true);
                } else {
                    that.openPay();
                }
            }).catch(e => {
                console.info(e);
                that.popLoading = false;
            });
        } catch (e){
            console.info(e);
            that.popLoading = false;
        }
    },

    /**
     * 获取订单详情
     */
    getOrderDetail(openPayChannel) {
        //兼容如理，如果此时有confirm框，就关掉
        try {
            Vue.$vux.confirm.hide()
        } catch (e) {
        }
        const that = this;
        clearInterval(that.timeInterval);
        const orderNo = (that.$route.query || {}).orderNo;
        if (!!orderNo) {
            return OrderClass.getOrderDetail(orderNo).then(res => {
                that.loading = false;
                if (!!res.result) {
                    //是否为别人帮预定的订单
                    that.selfOrder = res.result.selfOrder;
                    
                    //解析人员所有的保险订单信息
                    res.result = that.getPsuInsurance(res.result) || res.result;
                    that.expressInfo = res.result.expressInfo;
                    that.expressFee = parseInt(res.result.expressFee);
                    if (!!that.expressInfo && !!that.expressInfo.expressStatusAndTime && !!that.expressInfo.expressStatusAndTime.length) {
                        that.expressStatus = that.expressInfo.expressStatusAndTime[this.expressInfo.expressStatusAndTime.length - 1].status
                        that.expressStatusTime = that.expressInfo.expressStatusAndTime[this.expressInfo.expressStatusAndTime.length - 1].time
                    }
                    that.expresslist = that.getExpresslist();
                    // that.coupons = res.result.coupons;
                    that.orderScore = res.result.orderScore;
                    that.orderData = res.result;
                    if (!!res.result.insuranceOrders) {
                        that.insuranceOrders = res.result.insuranceOrders;
                    }
                    if (!!res.result.insuredCountInfos) {
                        that.insuredCountInfos = res.result.insuredCountInfos;
                    }
                    that.orderExtraInfo = res.result.orderExtraInfo;
                    that.orderDetail = res.result.orderBase;
                    if (!!that.orderDetail.unPaidOrderNos){
                        that.orderDetail.unPaidOrderNos = that.getUnPaidOrderNos(that.orderDetail.unPaidOrderNos)
                    }
                    that.orderTax = res.result.invoiceInfo;
                    that.orderAddress = res.result.invoiceFlag == '1' ? res.result.address : {};
                    that.invoiceFlag = res.result.invoiceFlag;
                    that.invoiceDone = res.result.invoiceDone;
                    that.custOrderStatus = getFlightOrderStatus(that.orderDetail.orderStatus);
                    that.orderStatusColor = getFlightOrderStatusColor(this.orderDetail.orderStatus);
                    that.airline = res.result.airLines[0];


                    that.useType = res.result.orderExtraInfo.useType;
                    if (res.result.airLines.length == 2) {
                        that.airline2 = res.result.airLines[1];
                    }
                    //是否提示如：如需报销，请务必在机场自行打印行程单
                    if (!!res.result.orderExtraInfo.caution){
                        that.publicTiantian = true;
                        that.caution = res.result.orderExtraInfo.caution;
                    }
                    that.orderPsgs = that.airline.passengers && that.airline.passengers.length>0 ? that.airline.passengers : [{}]; //乘机人放在航班下面，这里只拿出 去程航班的乘机人，专门提取公共数据。默认给一个空数据
                    extendUtils.setStorage('customerList', JSON.stringify(that.orderPsgs));
                    that.airLineList = [...that.setAirLineDisableStyle(res.result.airLines)]; //先判断原始航班是否都改签了
                    that.getGaiOrderList(); //必须先将原航班放进airLineList后再执行此方法。原理：先展示改签订单，再展示原订单
                    that.startDate = new Date(that.airline.arriveDate).format('MM月dd日') + ' ' + extendUtils.indexToWeek(new Date(that
                        .airline.arriveDate).getDay());
                    if (that.orderDetail.orderStatus == 'UNPAID') {
                        that.loadPay = true;//加载pay组件
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
                    } else {
                        that.timeInterval && clearInterval(that.timeInterval);
                    }
                    //更新代金券数据
                    that.$refs.payComp && that.$refs.payComp.getCashCouponList();
                    //还原上一次改签补款的改签单号（如果有的话）
                    //微信支付返回到本页面时，会丢失改签补款的改签单号，需要用session记住
                    let chaOrderNoObj = extendUtils.getSession(extendUtils.primaryKey + that.orderDetail.orderNo + '_chaOrderNo');
                    if (!!chaOrderNoObj) {
                        chaOrderNoObj = window.JSON.parse(chaOrderNoObj);
                        that.chaOrder.orderNo = chaOrderNoObj.chaOrderNo;
                        that.chaOrder.unPaidOrderNos = chaOrderNoObj.unPaidOrderNos;
                        extendUtils.removeSession(extendUtils.primaryKey + that.orderDetail.orderNo + '_chaOrderNo');
                    }

                    //设置商品描述
                    that.goodsDesc = that.getGoodsDesc();
                    //自动打开支付方式选择
                    if (openPayChannel === true) {
                        that.orderPay();
                    }
                } else {
                    extendUtils.showToast("获取订单信息失败");
                }
                return Promise.resolve()
            }).catch((err) => {
                console.error(err)
                that.loading = false;
                return Promise.resolve()
            });
        }
        return Promise.resolve()
        
    },
    /**
     * 支付超时后的操作
     */
    payTimeout(){
        let that = this;
        if (that.orderDetail.orderStatus != 'UNPAID'){
            return;
        }
        //pc端不主动查询状态，而是弹出确认框，用户确认后再查询
        if (extendUtils.isPC()){
            //改签状态的提示语不同
            let msg = that.needAddMoney ? '抱歉，您的改签单由于超时未支付已取消，如需改签请重新申请' : '抱歉，您的订单由于超时未支付已取消，请重新预订';
            extendUtils.showConfirm(msg, function(){
                that.getOrderDetail();
                //改签状态不用跳到首页
                !that.needAddMoney && that.orderAgain();
            }, 1, null, '确定', null, null, true)
        } else {
            setTimeout(()=>{
                that.getOrderDetail(); //倒计时完成，再拉取一次订单详情
            },1000)
        }
    },
    /**
     * 解析人员所有的保险订单信息
     */
    getPsuInsurance(e) {
        let _this = this;
        let datas = e;
        //有保险订单才处理
        if (!!datas.insuranceOrders && 0 < datas.insuranceOrders.length) {
            let airLinesLeng = datas.airLines.length;
            for (let i = 0; i < airLinesLeng; i++) {
                let PsgLength = datas.airLines[i].passengers.length;
                for (let j = 0; j < PsgLength; j++) {
                    datas.airLines[i].passengers[j].insuranceOrders = _this.getinsuranceOrdersByPsgID(datas.airLines[i].passengers[j], datas.insuranceOrders);
                }
            }
        }
        return datas;
    },
    /**
     * 获取乘客所有保险订单信息
     */
    getinsuranceOrdersByPsgID(passenger, list) {
        let insuranceOrders = list;
        let insuranceOrderLength = insuranceOrders.length;
        let res = [];
        if (!!insuranceOrders || 0 < insuranceOrderLength) {
            for (let i = 0; i < insuranceOrderLength; i++) {
                let ChildOrderLength = insuranceOrders[i].insuredInfos.length;
                for (let j = 0; j < ChildOrderLength; j++) {
                    if (passenger.cardNo == insuranceOrders[i].insuredInfos[j].cardNo && passenger.cardType == insuranceOrders[i].insuredInfos[j].cardType) {
                        let dataJson = JSON.parse(JSON.stringify(insuranceOrders[i]));
                        delete dataJson.insuredInfos;
                        dataJson['insuranceChildOrder'] = insuranceOrders[i].insuredInfos[j];
                        res.push(dataJson);
                        break;
                    }
                }
            }
        }
        return res;
    },
    /**
     * 显示保险详情
     */
    showInsuranceDetail(item) {
        let _this = this;
        _this.insuranceDetail = item;
        _this.showInsurancePop = true
    },
    /**
     * 计算保险订单航班详情
     */
    getAirLineBriefInfo(item) {
        let text = '';
        text = item.airCompanyName + item.flightNo + '</br>' + item.departTime + item.departCityName + '-' + item.arriveCityName;
        return text;
    },

    /**
     * 是否是365供应商
     */
    is365Provider() {
        try {
            return this.orderDetail.providerType.toString() == '0'
        } catch (e) {
            return false;
        }
    },

    /**
     * 是否不在365服务时间内
     */
    is365OutOfService() {
        if (this.is365Provider()) {
            let now = new Date().getHours();
            if (now <= 6 && now >= 0) {
                return true;
            } 
                
            
        }
    },

    /**
     * 调起支付组件
     */
    openPay(){
        if (!this.limitTime && !this.isInsAddMoney){
            extendUtils.showToast('支付超时，请重新下单');
            return;
        }
        let inMiniprogram = extendUtils.MINIPROGRAM_CONFIG.IN_MINIPROGRAM; // 判断运行环境
        if (inMiniprogram){
            this.$refs.payComp.wxMiniPay(window.sinopay.PAY_TYPE.WX_MINI_PAY)
        } else {
            this.$refs.payComp.getPayTypeList();
        }
    },
    
    /**
     * 前往保险列表页面
     */    
    gotoInsurancesList(){
        let _this = this;
        extendUtils.setStorage('insuranceOrders', JSON.stringify(_this.insuranceOrders));
        _this.$router.push({
            path: '/insurances/flight', 
            query:{
                selfOrder:_this.selfOrder
            }
        }) 
    },
    /**
     * 获取待支付订单号列表
     */  
    getUnPaidOrderNos(Obj){
        let resList = [];
        for (let j = 0,len=Obj.length; j < len; j++) {
            resList.push(Obj[j].orderNo)
        }
        return resList;
    },
    goBackFun(){
        let that = this;
        //小应用要跳到首页去   这段逻辑在现有首页上可能会有问题，暂不用
        //   if(extendUtils.getStorage('homePageType')!='mini'){
        //     requestHandler.openPage('flight.html#/');
        //     return;
        //   }
        let loadData = {
            orderNo: that.orderDetail.orderNo,
            orderStatus: that.orderDetail.orderStatus,
            postSaleStatus: that.orderDetail.postSaleStatus
        };
        loadData = JSON.stringify(loadData);
        if (that.pageFrom=='pay'){ //push是推送过来的，必须返回2次，否则安卓有问题
            extendUtils.closePage('', 2, loadData);
        } else if (that.pageFrom=='push'){ //push是推送过来的，必须返回2次，否则安卓有问题
            extendUtils.closePage('', extendUtils.getNavigatorType() == 'ios' ? 1 : 2, loadData);
        } else if (that.pageFrom=='orderListPc'){
            that.$router.go(-1)
        } else {
            extendUtils.closePage('', 1, loadData);
        }
    },
    refresh(){
        let that = this;
        that.excuteMainMethod();
        extendUtils.reloadWithNoCache()
    },

    setLimitTime(time){
        this.limitTime = time;
    },

    isNeedAddMoney(value){
        this.needAddMoney = value;
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
}
