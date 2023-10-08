/*
 * @Descripttion: 订单公共js方法
 * @version: 
 * @Author: sj
 * @Date: 2019-05-18 8:20:51
 * @LastEditors: sj
 * @LastEditTime: 2019-05-18 8:20:51
 */
import TrainOrder from 'modules/orderManagement/productObject/TrainOrder.js';
import FlightOrder from 'modules/orderManagement/productObject/FlightOrder.js';
import HotelOrder from "modules/orderManagement/productObject/HotelOrder";
import CarOrder from "modules/orderManagement/productObject/CarOrder";
// import CONF from "./lib/config.js"
import injectErrorCode from './errorCodeConfig'

import extendUtils from 'orderCommon/extend.js';

//引入配置
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
        return this.request('/order/v1/list', Object.assign({queryType: 2},param), {timeout: 15000});
    }

    /**
     * 获取部门信息
     * @param param
     * @return {*}
     */
    downloadCpyOrganization(){
        return this.request('/bp/v1/travel/user/downloadCpyOrganization', {});
    }

    /**
     * 总支出列表
     * @param param
     * @return {*}
     */
    getOrdersByAmount(param){
        return this.request('/order/v1/listByPaymentAmount', Object.assign({queryType: 2},param));
    }

    /**
     * 总退款列表
     * @param param
     * @return {*}
     */
    getRefOrders(param){
        return this.request('/order/v1/refundList', Object.assign({queryType: 2},param));
    }

    /**
     * 数据统计的数据
     * @param param
     * @return {*}
     */
    getDataStatistics(param){
        return this.request('/order/v1/getStatistics', param);
    }

    /**
     * 获取最近12个月的传入数据
     * @param param
     * @return {*}
     */
    getPayAmountStatisticByDateRange(param){
        return this.request('/order/v1/listPaymentAmountByDate', Object.assign({queryType: 2},param));
    }

    /**
     * 根据城市获取已支付的订单数据
     * @param param
     * @return {*}
     */
    getPayAmountOfCity(param){
        return this.request('/order/v1/listPaymentAmountByCity', Object.assign({queryType: 2},param));
    }

    /*=======================================================订单详情========================================================*/
    /**
     * 获取商旅后台的所有的配置
     * @param param
     * @return {*}
     */
    getConfigData(param){
        return this.request('/bp/v1/travel/config/getConfigs', param);
    }

    /**
     * 获取车次详情
     * @param param
     * @return {*}
     */
    getTrainLineByTrainNo(param){
        return this.request('/train/v1/getTrainLineByTrainNo', param);
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
     * 获取酒店详情
     * @param param
     * @return {*}
     */
    getHotelDetail(param){
        return this.request('/hotel/v1/getHotelDetail',param,{method:'post'});
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
     * 查看这个客户是否有财务推送的功能
     * @param param
     * @return {*}
     */
    financeInfoPushStatus(param){
        return this.request('/order/v1/financeInfoPushStatus', param);
    }

    /**
     * 页面添加需要接受推送的人员，服务端保存
     * @param param
     * @return {*}
     */
    addUaidToFinanceInfo(param){
        return this.request('/order/v1/addUaidToFinanceInfo', param);
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
    openPageLib(url ,href,oFlag=false){
        let newUrl = '';
        let preUrl = null;
        let appName = 'enterprise';

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

    /**
     * 获取老板付列表(暂不用)
     */
    getBossPayType() {
        const that = this;
        return new Promise(resolve=> {
            //如果开启了因公因私，则不返回老板付列表（此时按因公条件来查询）
            if (extendUtils.ENABLE_USE_TYPE){
                window.bossPayType = ['NONE']
                resolve(window.bossPayType)
                return;
            }
            if (window.bossPayType){
                resolve(window.bossPayType)
                return;
            }
            let bossPayType = [];
            that.request('/channel/v1/getPaymentMethods', {}, {method: 'get'}).then((res) => {
                if (!!res.result && res.result.paymentMethods) {
                    res.result.paymentMethods.forEach(pay=>{
                        if (extendUtils.isBossPay(pay.payType)){
                            bossPayType.push(pay.payType)
                        }
                    })
                }
                //没有就返回NONE
                if (bossPayType.length==0){
                    bossPayType = ['NONE'];
                }
                window.bossPayType = bossPayType
                resolve(window.bossPayType)
            }).catch((e) => {
                console.error(e);
                window.bossPayType = ['NONE']
                resolve(window.bossPayType)
            });
        })
    }

    /****
     * 获取小应用的相关配置（通过jsbridge）[目前该方法是为了进入小应用首页，title显示和当前小应用名称关联起来]
     */
    async getAppConfig() {
        return await sinosdk.sino.getAppInfo({'key':'msgSource'}).then(function(data){
            if (!!data){ //用户存在
                var jsonData = JSON.parse(data.value);
                return jsonData||{};
            }
        }).catch(()=>{
            return {};
        })
    }

}

Object.assign(requestHandler.prototype, extendUtils)
export default new requestHandler();
