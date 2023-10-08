import base from './base';
import extendUtils from '../utils';
import injectErrorCodeAddress from '../errorCodeHandler/address';


class AddressHandler extends base{
    constructor(){
        super();   
        //注入请求的全局配置
        injectErrorCodeAddress();
    }


    /**
     * 获取地址列表数据
     */
    getAddressList(param){
        return this.request('/customer-profile/v1/listAddress', param);
    }

    /**
     * 删除地址
     */
    deleteAddress(param){
        return this.request('/customer-profile/v1/deleteAddress', param);
    }

    /**
     * 新增地址
     */
    addAddress(param){
        return this.request('/customer-profile/v1/addAddress', param);
    }

    /**
     * 编辑地址
     */
    updateAddress(param){
        return this.request('/customer-profile/v1/updateAddress', param);
    }

    /**
     * 获取省份数据
     */
    getProvince(param){
        return this.request('/supplier/v1/getProvince', param, {method:'get'});
    }

    /**
     * 根据省份id获取市级数据
     */
    getCity(param){
        return this.request('/supplier/v1/getCity', param, {method:'get'});
    }

    /**
     * 根据市级id获取区县数据
     */
    getCounty(param){
        return this.request('/supplier/v1/getCounty', param, {method:'get'});
    }

    /**
     * 根据市级id获取乡/街道的数据
     */
    getTown(param){
        return this.request('/supplier/v1/getTown', param, {method:'get'});
    }

    addressAnalyse(param){
        return this.request('/supplier/v1/addressParsing', param);
    }


    /******************共享地址相关的接口开始**********************/

    /**
     * 获取共享地址的列表
     */
    getShareAddressList(param){
        return this.request('/customer-profile/v1/listCommonAddress', param);
    }

    /**
     * 删除共享地址列表
     */
    deleteCommonAddress(param){
        return this.request('/customer-profile/v1/deleteCommonAddress', param);
    }

    /**
     * 新增共享地址
     */
    addCommonAddress(param){
        return this.request('/customer-profile/v1/addCommonAddress', param);
    }

    /**
     * 更新共享地址
     */
    updateCommonAddress(param){
        return this.request('/customer-profile/v1/updateCommonAddress', param);
    }

    /******************共享地址相关的接口结束**********************/
}

export default new AddressHandler();