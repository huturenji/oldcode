import base from './base';
import injectErrorCode from '../errorCodeHandler/order';
import injectErrorCodeExpress from '../errorCodeHandler/express';
class OrderHandler extends base{
    constructor(){
        super();   
        //注入请求的全局配置
        injectErrorCode();  
        injectErrorCodeExpress();      
    }

    /**
     * 设置用户参数
     * @param {*} param 
     */
    setUserInfo(param){
        return Object.assign({}, param, {
            userId: this.userId,
            companyId: this.companyId,
            channelId: this.channelId,
        })
    }

    cancelOrder(param){
        return this.request('/order/v1/cancel', this.setUserInfo(param));
    }

    /**
     * 获取订单详情
     */
    async getOrderDetail(param, httpConfig={}){
        return this.request('/order/v1/getDetail', httpConfig.notAssignUserParam ? param : this.setUserInfo(param), httpConfig);
    }

    /**
     * 查询B+平台订单列表
     */
    getOrderList(param){
        return this.request('/order/v1/list', this.setUserInfo(param));
    }
	
	/**
	 * 更改审批订单状态
	 */
	updateOrderApproveState(param){
        return this.request('/order/v1/updateApprovalState', this.setUserInfo(param));
    }
    
    /**
     * 提交订单页查询预计配送时间
     */
    getPromiseTime(param){
        return this.request('/order/v1/getEstimatedDispatchTime', this.setUserInfo(param));
    }
    
    /**
     * 查询配送时间的接口
     */
    getPromiseCalendar(param){
        return this.request('/order/v1/getPromiseCalendar', this.setUserInfo(param));
    }
    
    /**
     * 提交订单页查询运费
     */
    getFreight(param){
        return this.request('/order/v1/getFreight', this.setUserInfo(param));
    }

    /**
     * 查询商品大小件标记
     */
    getSkuClassify(param){
        return this.request('/order/v1/getProductClassification', this.setUserInfo(param));
    }

    /**
     * 查询收货人信息 
     */
    getReceiverInfo(param){
        return this.request('/order/v1/order/getReceiverInfo', this.setUserInfo(param));
    }

    /**
     * 提交订单接口
     */
    createOrder(param){
        return this.request('/order/v1/add', param);
    }

    /**
     * 查询订单物流详情
     */
    async getOrderExpressRouteInfos(param){
        return this.request('/order/v1/getDeliveryInfo', this.setUserInfo(param));
    }

    /**
     * 更新订单
     */
    updateOrderDetail(param){
        return this.request('/order/v1/update', this.setUserInfo(param));
    }

    /**
     * 获取订单服务订单个数统计
     */
    getOrderStatistics(param){
        return this.request('/order/v1/getOrderStatistics', this.setUserInfo(param), {method: 'get'});
    }
    
}
export default new OrderHandler();