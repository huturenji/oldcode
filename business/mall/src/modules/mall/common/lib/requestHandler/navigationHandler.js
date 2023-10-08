import base from './base';
import extendUtils from 'common/lib/utils';
import injectErrorCode from '../errorCodeHandler/navigation.js';
class navigationHandler extends base{
    constructor(){
        //注入请求的全局配置
        injectErrorCode();
        super(); 
    }

    /**
     * 获取供应商列表
	 * @param {*} param 
    */
   getSupplierList(param){
        return this.request('/supplier/v1/list', param, {method:'get'});
    }

}
export default new navigationHandler();