import base from './base';
import extendUtils from 'common/lib/utils';
import injectErrorCode from '../errorCodeHandler/cart.js';
class cartHandler extends base{
    constructor(){
        //注入请求的全局配置
        injectErrorCode();
        super(); 
    }

    /**
     * 加入购物车
	 * @param {*} param 
    */
    addCartList(param){
        return this.request('/cart/v1/add', param, {noSSOFlag:true,method:'post',noZipFlag:true});
    }
    /**
     * 获取购物车列表
	 * @param {*} param 
    */
    async getCartList(param){
        return this.request('/cart/v1/list', param, {noSSOFlag:true,method:'get'});
    }
    /**
     * 删除购物车商品
     * @param {*} param 
     */
    deleteGoodsFromCartList(param){
        return this.request('/cart/v1/delete', param, {noSSOFlag:true,method:'post',noZipFlag:true});
    }
    /**
     * 设置购物车商品数量
     * @param {*} param 
     */
    setCartNum(param){
        return this.request('/cart/v1/setQuantity', param, {noSSOFlag:true,method:'post',noZipFlag:true});
    }
    /**
     * 获取渠道配置信息
     * @param {*} param 
     */
    async getchannelInfo(param){
        return this.request('/channel/v1/getApprovalRequestUrl', param, {noSSOFlag:true,method:'get',noZipFlag:true});
    }
}
export default new cartHandler();