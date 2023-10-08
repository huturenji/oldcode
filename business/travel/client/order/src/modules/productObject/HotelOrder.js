import requestHandler from 'orderCommon/requestHandler.js';
import OrderClass from './OrderClass.js';
import extendUtils from 'orderCommon/extend.js';
import { orderPayStatus } from 'orderCommon/enum/orderStatusEnum.js';
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
            inDate: data.inDate,
            outDate: data.outDate,
            cityName: data.cityName,
            hotelId: data.hotelID,
            roomType: data.roomType,
            invoiceMode: data.invoiceMode,
            hotelName: data.hotelName,
            cLat:data.lat,
            cLng:data.lng,
            hId:data.hotelId
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
            requestHandler.getHotelOrderDetail(obj).then((res) => {
                //字段调整展示代金券优惠信息，支付前orderAmount，支付后realPayAmount
                try {
                    if (orderPayStatus[res.result.payState].useRealPayAmount){
                        res.result.orderAmount = res.result.realPayAmount;
                    }
                } catch (error) {
                }
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
        let startTime = new Date(this.hotel.outDate).getTime()
        if (parseInt((nowTime - startTime) / 1000 / 60 / 60 / 24) > 30) {
            extendUtils.showToast('离店时间超过30天，不再支持补开报销凭证');
            return;
        }
        requestHandler.openPage(targetUrl+'?tripType=hotel&orderNo=' + this.orderDetail.orderNo + '&payType=' + this.orderDetail.useType)
    }

    /**
     * 查看已开出的发票详情发票
     */
    toProductInvoiceDetail(targetUrl){
        requestHandler.openPage(targetUrl+'?orderNo=' + this.orderDetail.orderNo + '&type=hotel');
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

    //获取酒店详情
    getCityId(){
        return new Promise((resolve, reject) => {
            requestHandler.getHotelDetail({
                hid:this.hotel.hId,
                inDate:this.hotel.inDate,
                outDate:this.hotel.outDate,
                providerType:this.orderDetail.providerType,
                useType:"PRIVATE"
            }).then(function(res){
                if (0==res.resultCode && res.result){
                    resolve(res.result.hotelDetails.cityId)
                } else {
                    reject(false)
                }
            }).catch((e)=>{
                console.log(e)
                reject(false)
            }) 
        })
    }

    /**
     * 再次预订
     */
    async toProductHome(url='hotel/index.html#/list'){
        if (this.hotel.inDate < new Date().toLocaleDateString()){
            this.hotel.inDate = new Date().toLocaleDateString()
            this.hotel.outDate = new Date(new Date().getTime() + 24*60*60*1000).toLocaleDateString()
        }

        //授权
        let useTypeConfig = await extendUtils.useTypeConfig();
        let hotelTripType = this.orderDetail.useType || useTypeConfig.default();

        //code
        let cityCode = await this.getCityId();

        let indexHotelJson = {
            'cityName':this.hotel.cityName,
            'cityCode':this.cityCode
        };
        await extendUtils.authInterceptor();
        extendUtils.setStorage(requestHandler.primaryKey+'_indexHotelJson', JSON.stringify(indexHotelJson));
        extendUtils.setStorage('tripType', hotelTripType);
                
        let hotelSearch = {
            inDate:new Date(this.hotel.inDate).getTime(),
            outDate:new Date(this.hotel.outDate).getTime(),
            inDays:new Date().getTime()
        }
        extendUtils.setStorage('hotelSearch', JSON.stringify(hotelSearch));
        let openType = extendUtils.MINIPROGRAM_CONFIG.IN_MINIPROGRAM?'href':null;
        requestHandler.openPage(url + "?keywords=&useType=PRIVATE&cityName=" + this.hotel.cityName + "&cityCode=" + cityCode + "&minPrice=0&maxPrice=600&htoelLimitPrice=-1&cLng=" + this.hotel.cLng + "&cLat=" + this.hotel.cLat + "&locationCity=" + this.hotel.cityName,openType)
    }


    /**
     * 商品描述
     */
    getGoodsDesc(){
        let hotel = this.hotel;
        let departDate = new Date(hotel.inDate);
        departDate = departDate.format('MM月dd日');
        return departDate + ' ' + hotel.hotelName;
    }

    /**
     * 跳转到支付成功页面：抽象方法
     */
    toSuccessParam(){
        return {
            path: '/suc/hotel',
            query: {
                'orderNo': this.orderDetail.orderNo
            }
        }
    }
}

