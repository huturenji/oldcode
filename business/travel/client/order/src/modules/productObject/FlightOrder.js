"use strict";
import requestHandler from 'orderCommon/requestHandler.js';
import OrderClass from './OrderClass.js';
import extendUtils from 'orderCommon/extend.js';
import { orderPayStatus } from 'orderCommon/enum/orderStatusEnum.js';
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
            departDate: airline.beginDate,
            arriveDate: airline.arriveDate,
            departTime: airline.beginTime,
            arriveTime: airline.arriveTime,
            departCityName: airline.sCityName,
            arriveCityName: airline.eCityName,
            departCityCode: airline.sCityCode,
            arriveCityCode: airline.eCityCode,
            departAirportName: airline.sAirportName,
            arriveAirportName: airline.eAirportName,
            cabin:airline.cabinRank
        })
    }

    /**
     * 取消订单
     */
    cancelProductOrder(orderNo){
        return new Promise((resolve, reject)=>{
            requestHandler.cancelFlightOrder({
                orderNo: orderNo,
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
                //字段调整展示代金券优惠信息，支付前orderAmount，支付后realPayAmount
                try {
                    if (orderPayStatus[res.result.orderBase.payStatus].useRealPayAmount){
                        res.result.orderBase.payAmount = res.result.orderBase.realPayAmount;
                    } else {
                        res.result.orderBase.payAmount = res.result.orderBase.orderAmount;
                    }
                    res.result.orderBase.amount = res.result.orderBase.payAmount;
                } catch (error) {
                }
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
        requestHandler.openPage(targetUrl+'?tripType=flight&orderNo=' + this.orderDetail.orderNo + '&payType=' + this.orderDetail.useType);
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
    toProductHome(url="flight/index.html#/list"){
        let selectDate
        if (new Date().getTime()> new Date(this.airline.departDate).getTime()){
            selectDate = new Date(new Date().getTime() + 24*60*60*1000).toLocaleDateString()
        } 
        else {
            selectDate = this.airline.departDate
        }
        extendUtils.setStorage('startCityCode',this.airline.departCityCode)
        extendUtils.setStorage('endCityCode',this.airline.arriveCityCode)
        extendUtils.setStorage('selectDate',selectDate)
        extendUtils.setStorage('startCity',this.airline.departCityName)
        extendUtils.setStorage('endCity',this.airline.arriveCityName)
        requestHandler.openPage(url + "?flightCabinType="+this.airline.cabin+"&useType=" + this.orderDetail.useType);
    }

    /**
     * 商品描述
     */
    getGoodsDesc(airline = this.airline){
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
            path: '/suc/flight',
            query: {
                'orderNo': this.orderDetail.orderNo,
                'endCity':this.airline.arriveCityName || '',
                'arriveTime':endTime,
                'departTime':startTime,
                'useType':this.orderDetail.useType,
                'tripNo':this.orderDetail.tripNo || ''
            }
        }
    }
}

