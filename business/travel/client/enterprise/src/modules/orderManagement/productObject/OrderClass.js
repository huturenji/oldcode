"use strict";
// import requestHandler from 'orderCommon/requestHandler.js';
import extendUtils from 'orderCommon/extend.js';
export default class OrderClass {
    constructor() {
        this.role = (extendUtils.getUrlParams() || {}).role;//TODO 用户角色 现在企业订单管理和商旅订单还是合用一个页面，所以需要用role来做权限区分
        this.orderDetail = {
            orderStatus: null,
            orderNo: null,
            useType: extendUtils.USE_TYPE_ENUM.PRIVATE.code,//默认因私
            tripNo: null,
            providerType: null
        };
        this.invoiceDetail = {
            invoiceFlag: null,
            invoiceDone: null
        }
        //产品公共属性。独有属性（比如航班号、座位号等）在子类构造函数中通过_setProductDetail()扩展
        this._productDetail = {
            id: null,
            departDate: null,
            arriveDate: null,
            departTime: null,
            arriveTime: null,
            departCityName: null,
            arriveCityName: null,
            departCityCode: null,
            arriveCityCode: null
        }

        //锁死对象，只可在构造函数中扩展属性
        Object.seal(this.orderDetail);
        Object.seal(this.invoiceDetail);
    }

    /**
     * 设置各个产品的数据，比如航班信息，车次信息，酒店信息。只存原始订单的数据，不存退改数据。
     * _productDetail只是公共的属性，各产品独有的属性在子类中扩展
     * @param obj
     * @return {any}
     * @private
     */
    _setProductDetail(obj){
        var _productDetail = Object.assign(this._productDetail, obj);
        Object.seal(this._productDetail)
        return _productDetail;
    }

    setOrderDetail(obj){
        this.orderDetail = Object.assign(this.orderDetail, obj);
        return this;
    }

    setInvoiceDetail(obj){
        this.invoiceDetail = Object.assign(this.invoiceDetail, obj);
        return this;
    }

    /**
     * 是否展示补开发票按钮
     * @param invoiceFlag
     * @param orderStatus
     * @return {*}
     */
    showInvoice(){
        if (this.role == 'company') { //TODO
            return false;
        }
        //没有申请过开票，才能补开发票
        if (this.invoiceDetail.invoiceFlag!=='0'){
            return false;
        }
        return this.showProductInvoice(this.orderDetail.orderStatus)
    }

    /**
     * 取消订单
     */
    cancelOrder(orderNo) {
        let that = this;
        return new Promise((resolve, reject) => {
            extendUtils.showConfirm('确定取消订单？', function () {
                that.cancelProductOrder(orderNo).then((res) => {
                    resolve(res);
                }).catch(() => {
                    reject();
                });
            }, 2, null, null, null, null, true)
        })
    }

    /**
     * 获取的订单详情 （抽象方法）
     * @param orderNo 传入的订单号，如果不传入，则用已持有的订单号
     * @return {Promise}
     */
    getOrderDetail(orderNo) {
        let that = this;
        return new Promise((resolve, reject) => {
            that.getProductOrderDetail(orderNo).then(res => {
                res.result && that.setOrderDataByDetail(res.result);
                resolve(res);
            }).catch(e => {
                reject(e);
            })
        })
    }

    /**
     * 补开发票：补开发票
     * @param orderNo 订单号
     * @param useType 因公/因私
     * @param beginDate 起始时间
     * @param No 航班号/车次号
     */
    toReimburse() {
        let targetUrl = 'invoice/index.html#/confirm';
        this.toProductReimburse(targetUrl);
    }

    /**
     * 去首页：抽象方法
     */
    toHome(target) {
        let url = 'home.html#/';
        //如果是小应用进来的，则跳到相应产品小应用的首页
        let homePageType = extendUtils.getStorage('homePageType');
        if (!!homePageType && homePageType == 'mini') {
            url = target || undefined;//在子类中确定url的值
        }
        this.toProductHome(url);
    }

    /**==========================================================抽象方法 start============================================================*/
    /**
     * 获取订单详情具体实现方法，在各个子类中实现：抽象方法
     */
    getProductOrderDetail() {}

    /**
     * 取消订单具体实现方法，在各个子类中实现：抽象方法
     */
    cancelProductOrder() {}
    /**
     * 去补开发票：抽象方法
     */
    toProductReimburse() {}

    /**
     * 是否展示补开发票按钮：抽象方法
     */
    showProductInvoice() {}

    /**
     * 再次预定：抽象方法
     */
    toProductHome(){}

    /**
     * 将订单详情返回的数据转换成OrderClass的数据格式：抽象方法
     * @return {*}
     */
    setOrderData() {}

    /**
     * 商品描述：抽象方法
     */
    getGoodsDesc(){}

    /**
     * 跳转到支付成功页面：抽象方法
     */
    toSuccessParam(){}

    /**
     * 查看已开出来的发票详情
     * @param orderNo 订单号
     */
    toViewInvoiceDetail() {
        let targetUrl = 'invoiceManage.html#/InvoiceDetailIndex';
        this.toProductInvoiceDetail(targetUrl);
    }
}

