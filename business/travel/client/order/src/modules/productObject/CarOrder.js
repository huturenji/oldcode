import requestHandler from 'orderCommon/requestHandler.js';
import OrderClass from './OrderClass.js';
// import extendUtils from 'orderCommon/extend.js';
export default class CarOrder extends OrderClass{
    constructor(){
        super();
        this.car = this._setProductDetail({
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
    setCar(obj){
        this.car = Object.assign(this.car, obj);
        return this;
    }

    /**
     * 设置订单对象属性
     * @param data 订单详情对象
     */
    setOrderDataByDetail(data){
        this.setOrderDetail({
            orderStatus: data.basicOrder.orderStatus,
            orderNo: data.basicOrder.orderNo,
            useType: data.basicOrder.useType
            // tripNo: data.orderExtraInfo.tripNo,//TODO 缺失
            // providerType: data.providerType
        }).setInvoiceDetail({
            invoiceFlag: data.invoiceFlag,
            invoiceDone: data.invoiceDone
        }).setCar({
            departDate: data.basicOrder.departureTime
            // departCityName: data.cityName,
            // arriveCityName: data.cityName,
            // hotelId: data.hotelID,
            // roomType: data.roomType,
            // invoiceMode: data.invoiceMode,
            // hotelName: data.hotelName,
            // roomType: data.roomType,
            // invoiceMode: data.invoiceMode,
        })
    }

    /**
     * 取消订单
     */
    cancelProductOrder(){
        return new Promise((resolve, reject)=>{
            requestHandler.cancelHotelOrder({
                orderNo: this.orderDetail.orderNo,
                cancelReason: '不想订了'
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
        return new Promise((resolve, reject)=>{
            const obj = {
                "orderNo": orderNo || this.orderDetail.orderNo
            };
            requestHandler.queryOrderDetail(obj).then((res) => {
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
        // let nowTime = new Date().getTime();
        // let startTime = new Date(this.car.departDate).getTime()
        // if (parseInt((nowTime - startTime) / 1000 / 60 / 60 / 24) > 30) {
        //     extendUtils.showToast('离店时间超过30天，不再支持补开报销凭证');
        //     return;
        // }
        requestHandler.openPage(targetUrl+'?tripType=car&orderNo=' + this.orderDetail.orderNo + '&payType=' + this.orderDetail.useType)
    }

    /**
     * 查看已开出的发票详情发票
     */
    toProductInvoiceDetail(targetUrl){
        requestHandler.openPage(targetUrl+'?orderNo=' + this.orderDetail.orderNo + '&type=car');
    }

    /**
     * 是否显示补开发票按钮
     */
    showProductInvoice(){
        //预付且是商旅开发票，才能展示补开按钮
        if (!(this.car.roomType=='1' && this.car.invoiceMode=='BusinessTrip')){
            return false;
        }
        return ['WAIT_FOR_CHECK_IN', 'ALREADY_FOR_CHECK_IN', 'ALREADY_LEAVE'].indexOf(this.orderDetail.orderStatus) > -1;
    }

    /**
     * 再次预订
     */
    toProductHome(url='car.html#/'){
        requestHandler.openPage(url + "?TEntry=2&arriveTime=" + (this.car.arriveDate && new Date(this.car.arriveDate).getTime()) + "&departTime=" + (this.car.departDate && new Date(this.car.departDate).getTime()) + "&endCity=" + this.car.arriveCityName + "&pageFrom=order" + '&useType=' + this.orderDetail.useType);
    }

    /**
     * 商品描述
     */
    getGoodsDesc(){
        let car = this.car;
        let departDate = new Date(car.departDate);
        departDate = departDate.format('MM月dd日');
        return departDate + ' 商务用车';
    }

    /**
     * 跳转到支付成功页面：抽象方法
     */
    toSuccessParam(){
        return {
            path: '/suc/car',
            query: {
                'orderNo': this.orderDetail.orderNo
            }
        }
    }
}

