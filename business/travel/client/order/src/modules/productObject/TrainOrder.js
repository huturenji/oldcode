import requestHandler from 'orderCommon/requestHandler.js';
import OrderClass from './OrderClass.js';
import extendUtils from 'orderCommon/extend.js';
export default class TrainOrder extends OrderClass{
    constructor(){
        super();
        this.train = this._setProductDetail({
            trainNo: null,
            departStation: null,
            arriveStation: null
        })
    }

    /**
     * 子类特有的产品对象属性
     * @param obj
     * @return {FlightOrder}
     */
    setTrain(obj){
        this.train = Object.assign(this.train, obj);
        return this;
    }

    /**
     * 设置订单对象属性
     * @param data 订单详情对象
     */
    setOrderDataByDetail(data){
        let orderDetail = data.orderInfo;
        this.setOrderDetail({
            orderStatus: orderDetail.orderStatus,
            orderNo: orderDetail.orderNo,
            useType: data.orderExtraInfo.useType,
            tripNo: data.orderExtraInfo.tripNo,
            providerType: orderDetail.providerType
        }).setInvoiceDetail({
            invoiceFlag: data.invoiceFlag,
            invoiceDone: data.invoiceDone
        }).setTrain({
            departDate: orderDetail.startDate,
            orderTime: orderDetail.orderTime, //下单时间
            arriveDate: orderDetail.endDate,
            departTime: orderDetail.startTime,
            arriveTime: orderDetail.endTime,
            departCityName: orderDetail.startCity,
            arriveCityName: orderDetail.endCity,
            trainNo: orderDetail.trainNo,
            departStation: orderDetail.startStation,
            arriveStation: orderDetail.endStation
        })
    }

    /**
     * 取消订单
     */
    cancelProductOrder(){
        return new Promise((resolve, reject)=>{
            requestHandler.cancelTrainOrder({
                orderNo: this.orderDetail.orderNo,
                cancelReason: '不想订了'
            }).then(function (res) {
                resolve(res);
            }).catch(err => {
                reject(err);
            });
        })
    }

    /**
     * 获取订单详情
     * @param orderNo 传入的订单号，如果不传入，则用已持有的订单号
     * @return {Promise}
     */
    getProductOrderDetail(orderNo){
        return new Promise((resolve, reject)=>{
            const obj = {
                "orderNo": orderNo || this.orderDetail.orderNo
            };
            requestHandler.getTrainOrderDetail(obj).then((res) => {
                resolve(res);
            }).catch(e => {
                reject(e);
            })
        })
    }

    /**
     * 补开发票
     */
    toProductReimburse(targetUrl){
        let nowTime = new Date().getTime();
        let startTime = new Date(this.train.orderTime).getTime()
        if (parseInt((nowTime - startTime) / 1000 / 60 / 60 / 24) > 30) {
            extendUtils.showToast('下单时间超过30天，不再支持补开报销凭证');
            return;
        }
        requestHandler.openPage(targetUrl+'?tripType=train&orderNo=' + this.orderDetail.orderNo + '&payType=' + this.orderDetail.useType);
    }

    /**
     * 查看已开出的发票详情发票
     */
    toProductInvoiceDetail(targetUrl){
        requestHandler.openPage(targetUrl+'?orderNo=' + this.orderDetail.orderNo + '&type=train');
    }

    /**
     * 是否显示补开发票按钮
     */
    showProductInvoice(){
        return ['ALREADY_REFUND', 'PARTIAL_ALREADY_REFUND', 'ALREADY_OUT_TICKET'].indexOf(this.orderDetail.orderStatus) > -1;
    }

    /**
     * 再次预订
     */
    toProductHome(url='train/index.html#/'){
        requestHandler.openPage(url + "?TEntry=1&startCity=" + this.train.departStation + "&endCity=" + this.train.arriveStation + "&departTime=" + (this.train.departDate && new Date(this.train.departDate).getTime()) + "&pageFrom=order" + '&useType=' + this.orderDetail.useType);
    }

    /**
     * 商品描述
     */
    getGoodsDesc(train = this.train){
        let departDate = new Date(train.departDate);
        departDate = departDate.format('MM月dd日');
        return departDate + ' ' + train.departStation + '-' + train.arriveStation;
    }

    /**
     * 跳转到支付成功页面：抽象方法
     */
    toSuccessParam(){
        let startTime = new Date(this.train.arriveDate).getTime();
        let endTime = new Date(this.train.arriveDate).getTime()+(24*3600*1000);
        return {
            path: '/suc/train',
            query: {
                'orderNo': this.orderDetail.orderNo,
                'providerType':this.orderDetail.providerType,
                'endCity':this.train.arriveCityName || '',
                'arriveTime':endTime,
                'departTime':startTime,
                'useType':this.orderDetail.useType,
                'tripNo':this.orderDetail.tripNo || ''
            }
        }
    }
}

