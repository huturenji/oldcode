/**
 * 地址管理方法处理工厂
 * @author zhangbin
 */
// import functional from "platform/functional";
let { functional } = SnTravel;
let {ErrorCodeMap} = functional;

/**
 * 引入地址管理的错误码
 */
const AddressErrorCodeMap = {
    
};
Object.assign(ErrorCodeMap, AddressErrorCodeMap);
/** ========================================errorCode end========================================== */

class addressHandler extends functional.baseRequestHandler{

    setTravelToParam(param){
        try {
            param = Object.assign({}, param, {project: 'TRAVEL'})
        } catch (error) {
            
        }
        return param
    }

    /**
     *  删除地址
     */
    deleteDeliveryAddress(param){
        return this.request('/customer-profile/v1/deleteAddress', this.setTravelToParam(param));
    }

    /**
     *  获取省市
     */
    getProvinceCityCounty(param){
        return this.request('/customer-profile/v1/getProvinceCityCounty', param, {method: 'get'});
    }

    /**
     *  获取地址列表
     */
    getDeliveryAddress(param){
        return this.request('/customer-profile/v1/listAddress', this.setTravelToParam(param));
    }

    /**
     *  新增地址
     */
    addDeliveryAddress(param){
        return this.request('/customer-profile/v1/addAddress', this.setTravelToParam(param));
    }

    /**
     *  修改地址
     */
    modifyDeliveryAddress(param){
        return this.request('/customer-profile/v1/updateAddress', this.setTravelToParam(param));
    }

    /**
     * 获取省份数据
     */
    getProvince(param){
        return this.request('/customer-profile/v1/getProvince', param, {method:'get'});
    }

    /**
     * 根据省份id获取市级数据
     */
    getCity(param){
        return this.request('/customer-profile/v1/getCity', param, {method:'get'});
    }

    /**
     * 根据市级id获取区县数据
     */
    getCounty(param){
        return this.request('/customer-profile/v1/getCounty', param, {method:'get'});
    }

    /**
     * 根据市级id获取乡/街道的数据
     */
    getTown(param){
        return this.request('/customer-profile/v1/getTown', param, {method:'get'});
    }

    
    /******************共享地址相关的接口开始**********************/

    /**
     * 获取共享地址的列表
     */
    getShareAddressList(param){
        return this.request('/customer-profile/v1/listCommonAddress', this.setTravelToParam(param));
    }

    /**
     * 删除共享地址列表
     */
    deleteCommonAddress(param){
        return this.request('/customer-profile/v1/deleteCommonAddress', this.setTravelToParam(param));
    }

    /**
     * 新增共享地址
     */
    addCommonAddress(param){
        return this.request('/customer-profile/v1/addCommonAddress', this.setTravelToParam(param));
    }

    /**
     * 更新共享地址
     */
    updateCommonAddress(param){
        return this.request('/customer-profile/v1/updateCommonAddress', this.setTravelToParam(param));
    }

    /******************共享地址相关的接口结束**********************/
}


Object.assign(addressHandler.prototype, functional);
export default new addressHandler();


