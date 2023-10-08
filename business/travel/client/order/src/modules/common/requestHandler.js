/*
 * @Descripttion: 订单公共js方法
 * @version: 
 * @Author: sj
 * @Date: 2019-05-18 8:20:51
 * @LastEditors: sj
 * @LastEditTime: 2019-05-18 8:20:51
 */
import TrainOrder from 'modules/productObject/TrainOrder.js';
import FlightOrder from 'modules/productObject/FlightOrder.js';
import HotelOrder from "modules/productObject/HotelOrder";
import CarOrder from "modules/productObject/CarOrder";
import injectErrorCode from './errorCodeConfig'

import extendUtils from 'orderCommon/extend.js';


const ORIGIN = extendUtils.HTTP_CONT.ORIGIN;

class requestHandler extends extendUtils.baseRequestHandler{
    constructor(){
        super();
        injectErrorCode();
    }

    /**
     * 获取订单对象实例
     * @param productType
     */
    getOrderObj(productType){
        if (!productType){
            return;
        }
        productType = productType.toLowerCase();
        if (productType=='flight'){
            return new FlightOrder();
        } else if (productType=='train'){
            return new TrainOrder();
        } else if (productType=='hotel'){
            return new HotelOrder();
        } else if (productType=='car'){
            return new CarOrder();
        }
    }

    /*=======================================================订单列表========================================================*/
    /**
     * 获取订单列表
     * @param param
     * @return {*}
     */
    getOrderOfAllTypes(param){
        return this.request('/order/v1/list', param, {timeout: 15000});
    }

    /*=======================================================订单详情========================================================*/
    /**
     * 获取车次详情
     * @param param
     * @return {*}
     */
    getTrainLineByTrainNo(param){
        return this.request('/train/v1/getTrainLineByTrainNo', param);
    }

    /**
     * 火车票取消订单
     * @param param
     * @return {*}
     */
    cancelTrainOrder(param){
        return this.request('/train/v1/cancelOrder', param, {method:'get'});
    }

    /**
     * 火车票退票
     * @param param
     * @return {*}
     */
    applyTrainRefund(param){
        return this.request('/train/v1/applyRefund', param);
    }

    /**
     * 火车票确认改签
     * @param param
     * @return {*}
     */
    confirmTrainChange(param){
        return this.request('/train/v1/confirmChange', param);
    }

    /**
     * 火车票取消改签
     * @param param
     * @return {*}
     */
    cancelTrainChange(param){
        return this.request('/train/v1/cancelChange', param);
    }

    /**
     * 火车票验证可否改签
     * @param param
     * @return {*}
     */
    verifyTrainChange(param){
        return this.request('/train/v1/verifyChange', param);
    }

    /**
     * 火车票订单详情
     * @param param
     * @return {*}
     */
    getTrainOrderDetail(param){
        return this.request('/train/v1/getOrderDetail', param);
    }

    /**
     * 酒店订单详情
     * @param param
     * @return {*}
     */
    getHotelOrderDetail(param){
        return this.request('/hotel/v1/getOrderDetail', param);
    }

    /**
     * 酒店取消订单
     * @param param
     * @return {*}
     */
    cancelHotelOrder(param){
        return this.request('/hotel/v1/cancelOrder', param, {method:'get'});
    }

    /**
     * 获取酒店详情
     * @param param
     * @return {*}
     */
    getHotelDetail(param){
        return this.request('/hotel/v1/getHotelDetail',param,{method:'post'});
    }

    /**
    * 获取短信验证码
    * @param {} param 
    */
    payHotelOrder(param){
        return this.request('/hotel/v1/payHotelOrder',param,{method:'post'});
    }

    /**
    * 提交担保
    * @param {} param 
    */
    confirmPayHotelOrder(param){
        return this.request('/hotel/v1/confirmPayHotelOrder',param,{method:'post'});
    }

    /**
     * 机票申请退票
     * @param param
     * @return {*}
     */
    applyFlightRefund(param){
        return this.request('/flight/v1/applyRefund', param);
    }

    verifyCabinPrice(param){
        return this.request('/flight/v1/verifyCabin', param);
    }

    /**
     * 机票取消订单
     * @param param
     * @return {*}
     */
    cancelFlightOrder(param){
        return this.request('/flight/v1/cancelOrder', param, {method:'get'});
    }

    /**
     * 机票订单详情
     * @param param
     * @return {*}
     */
    getFlightOrderDetail(param){
        return this.request('/flight/v1/getOrderDetail', param);
    }

    /**
     * 机票上传附件
     * @param param
     * @return {*}
     */
    async uploadFlightEvidence(fileName, param){
        return new Promise((resolve, reject) => {
            this.request('/file/v1/upload?c=static&p=/flight/cancelTicket&n='+fileName,param).then(data=>{
                resolve(data)
            }).catch(err=>{
                reject();
                console.error(err);
            })
        })
    }

    /**
     * 用车订单详情
     * @param param
     * @return {*}
     */
    queryOrderDetail(param){
        return this.request('/car/v1/queryOrderDetail', param);
    }

    /**
     * 用车行程中车辆实时位置
     * @param param
     * @return {*}
     */
    queryDriverLocationByOrderId(param){
        return this.request('/car/v1/queryDriverLocationByOrderId', param);
    }

    /**
     * 用车取消订单
     * @param param
     * @return {*}
     */
    cancelOrderCar(param){
        return this.request('/car/v1/cancelOrderCar', param);
    }

    /**
     * 保险批量退保
     * @param param
     * @return {*}
     */
    quitInsOrders(param){
        return this.request('/bp/order/quitInsOrders', param);
    }
   
    /**
     * 获取服务器配置
     * @param param
     * @return {*}
     */
    getSystemConfig(){
        return this.request('/flight/v1/getConfig', {});
    }

    /**
     * 获取订单数量
     */    
    getListOrderCount(param){
        return this.request('/order/v1//listOrderCount', param);
    }

    /**
     * 获取支付方式列表
     */    
    getPaymentMethods(param){
        return this.request('/channel/v1/getPaymentMethods', param, {method:'get'});
    }

    analyzeWinCloseData(data){
        if (!data){
            return
        }
        if (typeof data == 'string') {
            data = JSON.parse(data);
        }
        if (!!data.refreshData) { //PC兼容处理
            data = data.refreshData;
            if (typeof data == 'string') {
                data = JSON.parse(data);
            }
        }
        if (data.loadData){
            data = JSON.parse(data.loadData)
        }
        return data;
    }

    /**
     * 公共方法，打开新窗口前处理路径
     */
    openPage(url ,href,oFlag=false){
        let newUrl = '';
        let preUrl = null;
        let appName = 'order';
        if (process.env.NODE_ENV == 'production'){
            for (const key in extendUtils.OPENPAGE_MAP) {
                if (url.indexOf(key) > -1) {
                    preUrl = extendUtils.OPENPAGE_MAP[key];
                    break;
                }
            }
        } else {
            url = url.replace(appName+'/','');
        }
        
        newUrl = preUrl ? (ORIGIN + preUrl + url) : url;

        if (href && href == 'href'){
            window.location.href = extendUtils.urlProxy(newUrl);
        } else {
            extendUtils.openPage(newUrl,oFlag);
        }
    }

    async dynamicLoadPay(onload){
        let type = 'pay';
        const src = ORIGIN + extendUtils.APP_URL_MAP.swplib.path + extendUtils.APP_URL_MAP.swplib.child[type].prefix + 
                    (extendUtils.APP_URL_MAP.swplib.child[type].version || '') + extendUtils.APP_URL_MAP.swplib.child[type].entry;
        extendUtils.loadScript({
            id: 'swpPay',
            src: src,
            onload: onload
        })
    }

    unLoadPay(){
        let payJs = document.getElementById('swpPay');
        if (!!payJs){
            payJs.parentNode.removeChild(payJs);
        }
    }
}

export default new requestHandler();
