/*
 * @Descripttion: 机票公共js方法
 * @version: 
 * @Author: sj
 * @Date: 2019-05-18 8:20:51
 * @LastEditors: sj
 * @LastEditTime: 2019-05-18 8:20:51
 */
import extendUtils from 'flightCommon/extend.js';
import injectErrorCode from './errorCodeConfig'
const ORIGIN = extendUtils.HTTP_CONT.ORIGIN;

class requestHandler extends extendUtils.baseRequestHandler{
    constructor(){
        super();
        injectErrorCode();
        this.extendUtils = null;
        this.Vue = null;
    
        this.ERROR_CODE = {
            NO_APPLY: 46100001, //无申请单
            PRICE_CHANGE: 46030001,//变价
            NO_CABIN: 46030002//无可用舱位
        }
    }

    setVue(instance){
        this.Vue = instance;
    }

    /**
     * 获取价格日历的节假日
     * @param param
     * @return {*}
     */
    queryBussinessTripCalendar() {
        let date = new Date();
        let firstDay = date.getFullYear() - 1 + '/01/01';
        let lastDay = date.getFullYear() + 1 + '/12/31';

        let obj = {
            startDay: firstDay,
            endDay: lastDay
        };
        return this.request('/flight/v1/queryBussinessTripCalendar', obj);
    }

    /**
     * 获取价格日历
     * @param param
     * @return {*}
     */
    searchFlightPriceCalendar(param) {
        return this.request('/flight/v1/searchPriceCalendar', param);
    }

    /**
     * 获取机票列表
     * @param param
     * @return {*}
     */
    queryFlight(param) {
        return this.request('/flight/v1/queryFlight', param);
    }

    /**
     * 获取机票列表，其中舱位只保留关键数据
     * @param param
     * @return {*}
     */
    querySimpleFlightList(param) {
        return this.request('/flight/v1/queryFlightList', param);
    }

    /**
     * 获取舱位列表
     * @param param
     * @return {*}
     */
    queryCabins(param) {
        return this.request('/flight/v1/queryFlightCabin', param);
    }

    /**
     * 获取保险费
     * @param param
     * @return {*}
     */
    getFlightInsProducts() {
        return this.request('/insurance/v1/getFlightInsProducts', {});
    }

    /**
     * 验价
     * @param param
     * @return {*}
     */
    verifyCabin(param) {
        return this.request('/flight/v1/verifyCabin', param);
    }

    /**
     * 下单
     * @param param
     * @return {*}
     */
    createOrder(param) {
        return this.request('/flight/v1/createOrder', param);
    }

    /**
     * 获取优惠券
     * @param param
     * @return {*}
     */
    // findPersonalCoupon(param) {
    //     return this.request('/bp/v1/travel/coupon/findPersonalCoupon', param);
    // }

    /**
     * 获取邮寄费
     * @param param
     * @return {*}
     */
    getExpressFee() {
        return this.request('/express/v1/getExpressFee', {});
    }

    /**
     * 获取机票城市
     * @param param
     * @return {*}
     */
    getAllCNAirportCity() {
        return this.request('/flight/v1/getAllCNAirportCity', {});
    }

    /**
     * 获取机票热门城市
     * @param param
     * @return {*}
     */
    getHotAirportCity() {
        return this.request('/flight/v1/getHotAirportCity', {});
    }

    /**
     * 机票申请改签
     * @param param
     * @return {*}
     */
    applyFlightChange(param){
        return this.request('/flight/v1/applyChange', param);
    }

    /**
     * 获取申请出差地址
     */
    getApplyTravelUrl(param){
        return this.request('/channel/v1/getChannel',param,{method:'get'});
    }

    /**
     * 查询航班客规
     * @param param
     * @return {*}
     */
    queryGuestRule(param){
        return this.request('/flight/v1/queryGuestRule', param);
    }

    /**
     * 加载js
     * @id 加载js的id属性 swpPay
     * @type 代表加载sets.env.js 里面的js类型 如 pay invoice address passenger等等
     * @onload js加载完执行的回调
     */
    async loadJs(id,type,onload){
        const src = ORIGIN + extendUtils.APP_URL_MAP.swplib.path + extendUtils.APP_URL_MAP.swplib.child[type].prefix + 
                    (extendUtils.APP_URL_MAP.swplib.child[type].version || '') + extendUtils.APP_URL_MAP.swplib.child[type].entry;
        extendUtils.loadScript({
            id: id,
            src: src,
            onload: onload
        })        
    }

    /**
     * 获取订单列表
     * @param param
     * @return {*}
     */
    getTripHistroy(param){
        return this.request('/flight/v1/queryUserFlightHistory', param);
    }

    /**
     * 公共方法，打开新窗口前处理路径
     */
    async openPage(url,uasLocation=false){
        let newUrl = '';
        let appName = 'flight';
        let preUrl = null;
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
        if (uasLocation){
            location.href = newUrl;
        } else {
            extendUtils.openPage(newUrl);
        }
    }

    async addHistory(obj){
        const MAX_SIZE = 3;
        await extendUtils.authInterceptor();
        const key = this.primaryKey + '_searchFlightHistory';
        let storage = extendUtils.getStorage(key);
        storage = !!storage ? JSON.parse(storage) : [];
        //起始点相同时,只更新时间
        let index = -1;
        if (storage.some((s, i) => {
            if (s.start == obj.start && s.end == obj.end){
                s.time = obj.time;
                index = i;
                return true;
            } 
            return false
        })){
            storage = storage.splice(index, 1).concat(storage);
        } else {
            storage.unshift(obj);
        }
        //最多存3条
        if (storage.length > MAX_SIZE){
            storage.splice(3, storage.length - 1);
        }
        extendUtils.setStorage(key, JSON.stringify(storage));
    }
}

export default new requestHandler();
