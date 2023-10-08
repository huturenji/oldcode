"use strict";
import requestHandler from 'orderCommon/requestHandler.js';
import OrderClass from './OrderClass.js';
import extendUtils from 'orderCommon/extend.js';
export default class FlightOrder extends OrderClass{
    constructor(){
        super();
        this.airline = this._setProductDetail({
            flightNo: null,
            departAirportName: null,
            arriveAirportName: null
        })
    }

    /**
     * 子类特有的产品对象属性
     * @param obj
     * @return {FlightOrder}
     */
    setAirline(obj){
        this.airline = Object.assign(this.airline, obj);
        return this;
    }

    /**
     * 设置订单对象属性
     * @param data 订单详情对象
     */
    setOrderDataByDetail(data){
        let orderDetail = data.orderBase;
        let airline = data.airLines[0];
        this.setOrderDetail({
            orderStatus: orderDetail.orderStatus,
            orderNo: orderDetail.orderNo,
            useType: data.orderExtraInfo.useType,
            tripNo: data.orderExtraInfo.tripNo,
            providerType: orderDetail.providerType
        }).setInvoiceDetail({
            invoiceFlag: data.invoiceFlag,
            invoiceDone: data.invoiceDone
        }).setAirline({
            departDate: airline.departDate,
            arriveDate: airline.arriveDate,
            departTime: airline.departTime,
            arriveTime: airline.arriveTime,
            departCityName: airline.sCityName,
            arriveCityName: airline.eCityName,
            departCityCode: airline.sCityCode,
            arriveCityCode: airline.eCityCode,
            departAirportName: airline.sAirportName,
            arriveAirportName: airline.eAirportName
        })
    }

    /**
     * 取消订单
     */
    cancelProductOrder(){
        return new Promise((resolve, reject)=>{
            requestHandler.cancelFlightOrder({
                OrderNo: this.orderDetail.orderNo,
                Remark: '不想订了'
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
            requestHandler.getFlightOrderDetail(obj).then((res) => {
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
        let startTime = new Date(this.airline.departDate).getTime()
        if (parseInt((nowTime - startTime) / 1000 / 60 / 60 / 24) > 30) {
            extendUtils.showToast('航班起飞30天后，不再支持补开报销凭证');
            return;
        }
        requestHandler.openPageLib(targetUrl+'?tripType=flight&orderNo=' + this.orderDetail.orderNo + '&payType=' + this.orderDetail.useType);
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
    toProductHome(url='flight/index.html#/'){
        requestHandler.openPageLib(url + "?TEntry=0&StartCity=" + this.airline.departCityName + "&EndCity=" + this.airline.arriveCityName + "&DepartTime=" + (this.airline.departDate && new Date(this.airline.departDate).getTime()) + "&pageFrom=order");
    }

    /**
     * 商品描述
     */
    getGoodsDesc(){
        let airline = this.airline;
        let departDate = new Date(airline.departDate);
        departDate = departDate.format('MM月dd日');
        return departDate + ' ' + airline.departAirportName + '-' + airline.arriveAirportName;
    }

    /**
     * 跳转到支付成功页面：抽象方法
     */
    toSuccessParam(){
        let startTime = new Date(this.airline.arriveDate).getTime();
        let endTime = new Date(this.airline.arriveDate).getTime()+(24*3600*1000);
        return {
            path: '/order/suc/flight',
            query: {
                'OrderNo': this.orderDetail.orderNo,
                'EndCity':this.airline.arriveCityName || '',
                'ArriveTime':endTime,
                'DepartTime':startTime,
                'HotelUseType':this.orderDetail.useType,
                'TripNo':this.orderDetail.tripNo || ''
            }
        }
    }
}

