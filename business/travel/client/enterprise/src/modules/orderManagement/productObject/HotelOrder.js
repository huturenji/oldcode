import requestHandler from 'orderCommon/requestHandler.js';
import OrderClass from './OrderClass.js';
import extendUtils from 'orderCommon/extend.js';
export default class HotelOrder extends OrderClass{
    constructor(){
        super();
        this.hotel = this._setProductDetail({
            hotelId: null,
            hotelName: null,
            roomType: null,
            invoiceMode: null
        })
    }

    /**
     * 子类特有的产品对象属性
     * @param obj
     * @return {FlightOrder}
     */
    setHotel(obj){
        this.hotel = Object.assign(this.hotel, obj);
        return this;
    }

    /**
     * 设置订单对象属性
     * @param data 订单详情对象
     */
    setOrderDataByDetail(data){
        this.setOrderDetail({
            orderStatus: data.orderStatus,
            orderNo: data.orderNo,
            useType: data.orderExtraInfo.useType,
            tripNo: data.orderExtraInfo.tripNo,//TODO 缺失
            providerType: data.providerType
        }).setInvoiceDetail({
            invoiceFlag: data.invoiceFlag,
            invoiceDone: data.invoiceDone
        }).setHotel({
            departDate: data.inDate,
            arriveDate: data.outDate,
            departCityName: data.cityName,
            arriveCityName: data.cityName,
            hotelId: data.hotelID,
            roomType: data.roomType,
            invoiceMode: data.invoiceMode,
            hotelName: data.hotelName
        })
    }

    /**
     * 取消订单
     */
    cancelProductOrder(){
        return new Promise((resolve, reject)=>{
            requestHandler.cancelHotelOrder({
                OrderNo: this.orderDetail.orderNo,
                CancelReason: '不想订了'
            }).then(function (res) {
                resolve(res);
            }).catch(e => {
                console.error(e);
                reject();
            });
        })
    }

    /**
     * 获取订单详情
     * @param orderNo 传入的订单号，如果不传入，则用已持有的订单号
     * @return {Promise}
     */
    getProductOrderDetail(orderNo){
        // await extendUtils.authInterceptor();
        return new Promise((resolve, reject)=>{
            const obj = {
                "orderNo": orderNo || this.orderDetail.orderNo
            };
            requestHandler.getHotelOrderDetail(obj).then((res) => {
                resolve(res);
            }).catch(e => {
                console.error(e);
                reject();
            })
        })
    }

    /**
     * 补开发票
     */
    toProductReimburse(targetUrl){
        let nowTime = new Date().getTime();
        let startTime = new Date(this.hotel.departDate).getTime()
        if (parseInt((nowTime - startTime) / 1000 / 60 / 60 / 24) > 30) {
            extendUtils.showToast('离店时间超过30天，不再支持补开报销凭证');
            return;
        }
        requestHandler.openPageLib(targetUrl+'?tripType=hotel&orderNo=' + this.orderDetail.orderNo + '&payType=' + this.orderDetail.useType)
    }

    /**
     * 是否显示补开发票按钮
     */
    showProductInvoice(){
        //预付且是商旅开发票，才能展示补开按钮
        if (!(this.hotel.roomType=='1' && this.hotel.invoiceMode=='BusinessTrip')){
            return false;
        }
        return ['WAIT_FOR_CHECK_IN', 'ALREADY_FOR_CHECK_IN', 'ALREADY_LEAVE'].indexOf(this.orderDetail.orderStatus) > -1;
    }

    /**
     * 再次预订
     */
    toProductHome(url='hotel/index.html#/'){
        requestHandler.openPageLib(url + "?TEntry=2&ArriveTime=" + (this.hotel.arriveDate && new Date(this.hotel.arriveDate).getTime()) + "&DepartTime=" + (this.hotel.departDate && new Date(this.hotel.departDate).getTime()) + "&EndCity=" + this.hotel.arriveCityName + "&pageFrom=order");
    }

    /**
     * 商品描述
     */
    getGoodsDesc(){
        let hotel = this.hotel;
        let departDate = new Date(hotel.departDate);
        departDate = departDate.format('MM月dd日');
        return departDate + ' ' + hotel.hotelName;
    }

    /**
     * 跳转到支付成功页面：抽象方法
     */
    toSuccessParam(){
        return {
            path: '/order/suc/hotel',
            query: {
                'OrderNo': this.orderDetail.orderNo
            }
        }
    }

    /**
     * 查看已开出的发票详情发票
     */
    toProductInvoiceDetail(targetUrl){
        requestHandler.openPageLib(targetUrl+'?orderNo=' + this.orderDetail.orderNo + '&type=hotel');
    }
}

