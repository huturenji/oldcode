import base from './base';
import injectOrderErrorCode from '../errorCodeHandler/order';
import injectAftersaleErrorCode from '../errorCodeHandler/aftersale';
class AfterSaleHandler extends base {
    constructor() {
        super();

        injectOrderErrorCode();
        injectAftersaleErrorCode();
    }

    /**
     * 查询订单列表
     */
    getOrderList(params) {
        return this.request('/order/v1/list', params);
    }

    /**
     * 获取订单详情
     */
    getOrderDetail(params) {
        return this.request('/order/v1/getDetail', params);
    }

    /**
     * 查询服务单列表
     */
    getServiceListPage(params) {
        return this.request('/postsale/v1/listPersonalServiceRequest', params, {method: 'get'});
    }

    /*
     * 查询某订单中某商品是否可以提交售后服务
     */
    getAvailableNumberComp(params) {
        return this.request('/postsale/v1/getServiceableItems', params, {method: 'get'});
    }

    /*
     * 根据订单号、商品编号查询支持的服务类型
     */
    getCustomerExpectComp(params) {
        return this.request('/postsale/v1/getServiceCategory', params, {method: 'get'});
    }

    /*
     * 根据订单号、商品编号查询商品取件方式
     */
    getWareReturnComp(params) {
        return this.request('/postsale/v1/getProductRecallMethods', params, {method: 'get'});
    }

    /*
     * 查询申请原因类型
     */
    getApplyReasonTypes(params) {
        return this.request('/postsale/v1/getSubmittingReason', params, {method: 'get'});
    }

    /*
     * 取消已经生成的服务单
     */
    auditCancel(params) {
        return this.request('/postsale/v1/cancelServiceRequest', params);
    }

    /*
     * 收到退款或者收到换货的商品，核实无货后，可以调用确认服务单接口更新状态为完成
     */
    confirmOrder(params) {
        return this.request('/postsale/v1/closeServiceRequest', params);
    }

    /*
     * 填写发运信息
     */
    updateSendSku(params) {
        return this.request('/postsale/v1/updateRecallDispatchInfo', params);
    }

    /*
     * 查询服务单明细信息
     */
    getServiceDetailInfo(params) {
        return this.request('/postsale/v1/getServiceRequestDetail', params);
    }

    /*
     * 发起售后申请
     */
    createApply(params) {
        return this.request('/postsale/v1/submitServiceRequest', params);
    }

    /*
     * 查询售后服务正在处理的订单个数
     */
    getMyServiceStatistics(params) {
        return this.request('/postsale/v1/getMyServiceStatistics', params, {method: 'get'});
    }
}

export default new AfterSaleHandler();