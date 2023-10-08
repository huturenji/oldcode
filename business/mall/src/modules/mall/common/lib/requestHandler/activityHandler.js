import base from './base';
import extendUtils from '../utils';
import injectErrorCodeAddress from '../errorCodeHandler/address';


class ActivityHandler extends base{
    constructor(){
        super();   
        //注入请求的全局配置
        injectErrorCodeAddress();
    }


    /**
     * 根据活动id获取活动详情
     */
    getMarketingDetail(param){
        return this.request('/marketing/v1/getMarketingDetail', param);
    }

    /**
     * 批量查询商品的营销活动信息
     */
    listProductMarketing(param){
        return this.request('/marketing/v1/listProductMarketing', param);
    }
}

export default new ActivityHandler();