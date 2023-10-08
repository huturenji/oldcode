/*
 * @Descripttion: 机票公共js方法
 * @version: 
 * @Author: sj
 * @Date: 2019-05-18 8:20:51
 * @LastEditors: sj
 * @LastEditTime: 2019-05-18 8:20:51
 */
import extendUtils from 'custCommon/extend.js';
import injectErrorCode from './errorCodeConfig'
const ORIGIN = extendUtils.HTTP_CONT.ORIGIN;

class requestHandler extends extendUtils.baseRequestHandler{
    constructor(){
        super();
        injectErrorCode();
        this.extendUtils = null;
        this.Vue = null;
    }

    /*************************机票 start**************************** */
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

    /*************************机票 end**************************** */

    /*************************酒店 start**************************** */
    /**
     * 获取订单列表
     * @param param
     * @return {*}
     */
    getHotelOrderList(param) {
        return this.request('/hotel/v1/getHotelSelfBooking', param, { method: 'post', noZipFlag: true });
    }

    /**
     * 获取酒店详情
     */
    getHotelDetail(param) {
        return this.request('/hotel/v1/getHotelDetail', param, { method: 'post', noZipFlag: true });
    }

    /** 
     * 获取酒店热门城市
     */
    getHotelHotCity(param) {
        return this.request('/hotel/v1/getHotCity', param, { method: 'get' });
    }

    /**
     * 获取酒店城市
     */
    getHotelCitys(param) {
        return this.request('/hotel/v1/getHotelCitys', param, { method: 'get' });
    }

    /*************************酒店 end**************************** */

    /*************************行程 start**************************** */
    /**
     * 获取行程列表
     */
    getTripList(param){
        return this.request('/trip/v1/getTripList', param);
    }
    /*************************行程 end**************************** */

    /**
     * 公共方法，打开新窗口前处理路径
     */
    async openPage(url){
        let newUrl = '';
        let preUrl = null;
        for (const key in extendUtils.OPENPAGE_MAP) {
            if (url.indexOf(key) > -1) {
                preUrl = extendUtils.OPENPAGE_MAP[key];
                break;
            }
        }
        newUrl = preUrl ? (ORIGIN + preUrl + url) : url;
        extendUtils.openPage(newUrl);
    }

    async addHistory(obj, type){
        const MAX_SIZE = 3;
        await extendUtils.authInterceptor();
        const key = this.primaryKey + `_search${type}History`;
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
