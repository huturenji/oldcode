import Base from './base';
import injectErrorCode from '../errorcodehandler/traveloperation.js';
/**
 * 项目中不允许直接调用libs的对象。对apiBase的调用都在这里。
 * 项目的api封装类
 */
class TravelOpeHandler extends Base {
    constructor() {
        super();
        injectErrorCode()
    }

    /**
     * 获取渠道的操作记录
     */
    getChannelOperationRecord(param) {
        return this.sendApiRequest('/channel/v1/listOperationRecord', param, "get");
    }
    /**
     * 获取渠道信息列表
     */
    getProductionChannels(param) {
        return this.sendApiRequest('/channel/v1/listChannel', param, "get");
    }
    /**
     * 根据id获取渠道设置
     */
    getProductionChannelById(param) {
        return this.sendApiRequest('/channel/v1/getChannel', param, "get");
    }
    /**
     * 新增渠道
     */
    addProductionChannel(param) {
        return this.sendApiRequest('/channel/v1/saveChannel', param);
    }
    /**
     * 编辑渠道
     */
    updateProductionChannel(param) {
        return this.sendApiRequest('/channel/v1/updateChannel', param);
    }
    /**
     * 删除渠道
     */
    deleteProductionChannel(param) {
        return this.sendApiRequest('/channel/v1/delete', param, "get");
    }
    /**
     * 启用停用渠道接口
     */
    updateChannelState(param) {
        return this.sendApiRequest('/channel/v1/updateChannelState', param);
    }
    /**
     * 获取支付方式列表
     */
    getPaymentPlatforms(param) {
        return this.sendApiRequest('/payment/v1/getAvailableMethods', param, "get");
    }
    /**
    * 查询全国省市区
    */
    getProvinceCityCounty(param) {
        return this.sendApiRequest('/customer-profile/v1/getProvinceCityCounty', param, "get");
    }
    /**
     * 分页获取收件人数据
     */
    getOrderNoAndReceiverInfos(param) {
        return this.sendApiRequest('/express/v1/getOrderNoAndReceiverInfos', param);
    }
    /**
     * 查询寄件人地址信息
     */
    getSenderInfos(param) {
        let request = {
            userId: this.userInfo && this.userInfo.userId,
        };
        return this.sendApiRequest('/customer-profile/v1/getSenderInfos', request);
    }
    /**
    * 编辑地址
    */
    modifySenderInfo(param) {
        return this.sendApiRequest('/customer-profile/v1/updateManage', param);
    }
    /**
    * 新增地址
    */
    addSenderInfo(param) {
        return this.sendApiRequest('/customer-profile/v1/addManage', param);
    }
    /**
    * 获取收件人地址列表
    */
    getSenderAndReceiverInfo(param) {
        return this.sendApiRequest('/express/v1/getExpressOrderDetail', param);
    }
    /**
     * 获取订单列表
     */
    getOrders(param) {
        return this.sendApiRequest('/order/v1/list', param);
    }
    /**
     * 获取订单详情
     */
    getFlightOrderDetail(param) {
        return this.sendApiRequest('/flight/v1/getOrderDetailForOm', param);
    }
    /**
     * 获取保险订单详情
     */
    getInsuranceOrderDetail(param) {
        return this.sendApiRequest('/insurance/v1//getOrderDetailForOm', param);
    }
    /** 
     * 获取订单操作记录
     */
    getOrderRecode(param) {
        return this.sendApiRequest('/operation-record/v1/list', param);
    }
    /** 
     * 获取订单操作记录
     */
     getFlightOrderRecode(param) {
        return this.sendApiRequest('/flight/v1/listOperationRecord', param);
    }    
    /**
     * 获取订单详情
     */
    getHotelOrderDetail(param) {
        return this.sendApiRequest('/hotel/v1//getOrderDetailForOm', param);
    }
    /**
    * 获取订单详情
    */
    getTrainOrderDetail(param) {
        return this.sendApiRequest('/train/v1/getOrderDetailForOm', param);
    }
    /**
     * 发起退款
     */
    refund(param) {
        return this.sendApiRequest('/travel-management/v1/refund', param);
    }
    /**
     * 编辑快递信息
     */
    modifyExpressInfo(param) {
        return this.sendApiRequest('/express/v1/update', param);
    }
    /**
     * 提交快递信息
     */
    addPatchExpressInfos(param) {
        return this.sendApiRequest('/express/v1/patchAdd', param);
    }
    /**
     * 查询快递公司
     */
    getExpressCompanies(param) {
        return this.sendApiRequest('/express/v1/getExpressCompanies', param);
    }
    /**
     * 获取企业
     */
    getOrderCompanyIds(param) {
        return this.sendApiRequest('/travel-management/v1/getCompanyNamesByChannelId', param);
    }
    /**
    * 查询供应商
    */
    getProviderInfos(param) {
        return this.sendApiRequest('/travel-management/v1/getProviderInfos', param);
    }
    /**
     * 查询饼图数据
     */
    getDataStatistics(param) {
        return this.sendApiRequest('/order/v1/getStatisticsByOperation', param);
    }
    /**
     * 查询营业趋势数据
     */
    getPayAmountStatisticByDateRange(param) {
        return this.sendApiRequest('/order/v1/listPaymentAmountByDate', param);
    }
    /**
     * 查询城市图表
     */
    getPayAmountOfCity(param) {
        return this.sendApiRequest('/order/v1/listPaymentAmountByCity', param);
    }
    /**
     * 查询退单列表
     */
    getRefOrders(param) {
        return this.sendApiRequest('/order/v1/refundList', param);
    }
    /**
     * 查询销售列表
     */
    getOrdersByAmount(param) {
        return this.sendApiRequest('/order/v1/listByPaymentAmount', param);
    }
    /**
     * 查询金额数据统计
     */
    getAmountStatistics(param) {
        return this.sendApiRequest('/travel-management/v1/getAmountStatistics', param);
    }
    /**
    * 查询财务报表订单状态筛选条件。
    */
    getFSOrderStatus(param) {
        return this.sendApiRequest('/travel-management/v1/getFSOrderStatus', param);
    }
    /**
    * ，导出财务报表信息，导出文件为Excel。
    */
    exportFinancialStatements(param) {
        return this.sendApiRequest('/travel-management/v1/exportFinancialStatements', param);
    }
    /**
     * 获取数据
     */
    getFinancialStatementsList(param) {
        return this.sendApiRequest('/travel-management/v1/getFinancialStatement', param);
    }
    /**
    * 新增配置
    */
    addConfig(param) {
        return this.sendApiRequest('/travel-management/v1/addConfig', param);
    }
    /**
    * 修改配置
    */
    updateConfig(param) {
        return this.sendApiRequest('/travel-management/v1/updateConfig', param);
    }
    /**
    * 删除配置
    */
    deleteConfig(param) {
        return this.sendApiRequest('/travel-management/v1/deleteConfig', param);
    }
    /**
    * 获取配置
    */
    getConfigList(param) {
        return this.sendApiRequest('/travel-management/v1/getConfigs', param);
    }
    /**
     * 查询商旅通业务类型列表（比如：酒店，机票，火车票等）
     */
    getAllBizTypes(param) {
        return this.sendApiRequest('/test-assistant/v1/getAllBizTypes', param);
    }
    /**
     * 指定灰度发布规则启用或停止
     */
    switchProviderGrayRule(param) {
        return this.sendApiRequest('/test-assistant/v1/switchProviderGrayRule', param);
    }
    /**
     * 分页查询供应商配置
     */
    queryOnlineProviderRules(param) {
        return this.sendApiRequest('/test-assistant/v1/queryOnlineProviderRules', param);
    }
    /**
     * 指定SP用户配置是否自动出票启用或停止 spConfig
     */
    switchProviderAutomatic(param) {
        return this.sendApiRequest('/test-assistant/v1/switchProviderAutomatic', param);
    }
    /**
     * 新增服务提醒
     */
    addServiceReminder(param) {
        return this.sendApiRequest('/travel-management/v1/addServiceReminder', param);
    }
    /**
     * 修改服务提醒
     */
    updateServiceReminder(param) {
        return this.sendApiRequest('/travel-management/v1/updateServiceReminder', param);
    }
    /**
     * 删除服务提醒
     */
    deleteServiceReminder(param) {
        return this.sendApiRequest('/travel-management/v1/deleteServiceReminder', param);
    }
    /**
     * 查询服务提醒
     */
    selectServiceReminder(param) {
        return this.sendApiRequest('/travel-management/v1/selectServiceReminder', param);
    }
    /**
     * 查询服务类型
     */
    getBusinessType(param) {
        return this.sendApiRequest('/travel-management/v1/getBusinessType', param);
    }

    /**
     * 客服领取异常订单，开始处理
     */
    processStart(param) {
        return this.sendApiRequest('/customer/v1/processStart', param);
    }
    /**
     * 客服订票失败，调相关服务取消订单并退费
     */
    processFail(param) {
        return this.sendApiRequest('/customer/v1/processFail', param);
    }
    /**
     * 客服订票成功，更新相关参数
     */
    buyAirlineTicket(param) {
        return this.sendApiRequest('/customer/v1/buyAirlineTicket', param);
    }
    /**
     * 保险投保成功接口
     */
    buyInsurance(param) {
        return this.sendApiRequest('/customer/v1/buyInsurance', param);
    }
    /**
     * 客服处理退保失败订单
     */
    cancelInsurance(param) {
        return this.sendApiRequest('/customer/v1/cancelInsurance', param);
    }
    /**
     * 客服对退费异常订单手动退款
     */
    applyRefund(param) {
        return this.sendApiRequest('/customer/v1/applyRefund', param);
    }

    /**
     * 根据查询维度查询B+平台订单列表
     */
    getBpOrderForPlatforms(param) {
        return this.sendApiRequest('/supplier-order/v1/getBpOrderForPlatforms', param);
    }
    /**
     * 根据产品编号查询产品信息
     */
    getBpProduct(param) {
        return this.sendApiRequest('/supplier-order/v1/getBpProduct', param);
    }
    /**
     * 查询B+平台酒店产品异常订单详情
     */
    getHotelDetailByBpProductNo(param) {
        return this.sendApiRequest('/supplier-order/v1/getHotelDetailByBpProductNo', param);
    }
    /**
     * 查询B+平台火车票产品异常订单详情
     */
    getTrainDetailByBpProductNo(param) {
        return this.sendApiRequest('/supplier-order/v1/getTrainDetailByBpProductNo', param);
    }
    /**
     * 查询机票供应商信息
     */
    getBpProductProviderInfo(param) {
        return this.sendApiRequest('/supplier-order/v1/getBpProductProviderInfo', param);
    }
    /**
     * 查询保险供应商信息
     */
    getBpInsuredProductProviderInfo(param) {
        return this.sendApiRequest('/supplier-order/v1/getBpInsuredProductProviderInfo', param);
    }
    /**
     * 查询B+平台产品异常类型
     */
    getBpProductExceptionTypes(param) {
        return this.sendApiRequest('/supplier-order/v1/getBpProductExceptionTypes', param);
    }
    /**
     * 更新商旅通数据库中保险产品数据
     */
    updateInsProducts(param) {
        return this.sendApiRequest('/insurance/v1/updateInsProducts', param);
    }
    /**
     * 查询商旅通保险产品列表。
     */
    getInsProductsForManager(param) {
        return this.sendApiRequest('/insurance/v1/getInsProductsForManager', param);
    }
    /**
     * 设置机票保险产品展示顺序。
     */
    setInsProductIndexByManager(param) {
        return this.sendApiRequest('/insurance/v1/setInsProductIndexByManager', param);
    }
    /**
     * 设置机票保险产品简称
     */
    setInsProductShortNameByManager(param) {
        return this.sendApiRequest('/insurance/v1/setInsProductShortNameByManager', param);
    }
    /**
     * 开启或者关闭保险产品
     */
    setInsProductValid(param) {
        return this.sendApiRequest('/insurance/v1/setInsProductValid', param);
    }
    /**
     * 下载订单全部发票
     */
    downloadAllInvoice(param) {
        return this.sendApiRequest('/invoice/v1/getInvoiceDetailsByOrderNo', param);
    }
    /**
     * 获取模板配置列表
     */
    getPushTemplateList(param) {
        return this.sendApiRequest('/notice/v1/getPushTemplateList', param);
    }
    /**
     * 保存或更新推送模板
     */
    saveOrUpdatePushTemplate(param) {
        return this.sendApiRequest('/notice/v1/saveOrUpdatePushTemplate', param);
    }
    /**
     * 删除某个渠道下某个业务的推送模板配置
     */
    deletePushTemplate(param) {
        return this.sendApiRequest('/notice/v1/deletePushTemplate', param);
    }
    /**
     * 判断是否存在模板
     */
    isExistPushTemplate(param) {
        return this.sendApiRequest('/notice/v1/isExistPushTemplate', param);
    }

    /**
         * 查询用户(运营接口)
         */
    searchUser(param) {
        return this.sendApiRequest('/zsa-adapter/v1/searchUser', param);
    }

    /**
    * 查询用户详情(运营接口)
    */
    getUser(param) {
        return this.sendApiRequest('/zsa-adapter/v1/getUser', param, "get");
    }
    /**
     * 新增用户(运营接口)
     */
    addUser(param) {
        return this.sendApiRequest('/zsa-adapter/v1/addUser', param);
    }
    /**
     * 删除用户(运营接口)
     */
    deleteUser(param) {
        return this.sendApiRequest('/zsa-adapter/v1/deleteUser', param, "get");
    }
    /**
     * 修改用户(运营接口)
     */
    updateUser(param) {
        return this.sendApiRequest('/zsa-adapter/v1/updateUser', param);
    }

    /**
     * 查询企业用户(运营接口)
     */
    searchCompanyUser(param) {
        return this.sendApiRequest('/zsa-adapter/v1/searchCompanyUser', param);
    }

    /**
     * 查询角色(运营接口)
     */
    listRole(param) {
        return this.sendApiRequest('/zsa-adapter/v1/listRole', param, "get");
    }
  
    /**
     * 查询角色详情(运营接口)
     */
    getRoleDetail(param) {
        return this.sendApiRequest('/zsa-adapter/v1/getRoleDetail', param, "get");
    }
    /**
     * 修改角色详情(运营接口)
     */
    updateRole(param) {
        return this.sendApiRequest('/zsa-adapter/v1/updateRole', param);
    }
    /**
     * 新增角色(运营接口)
     */
    addRole(param) {
        return this.sendApiRequest('/zsa-adapter/v1/addRole', param);
    }
    /**
     * 删除角色(运营接口)
     */
    deleteRole(param) {
        return this.sendApiRequest('/zsa-adapter/v1/deleteRole', param, "get");
    }
    /**
     * 查询权限(运营接口)
     */
    listPermission(param) {
        return this.sendApiRequest('/zsa-adapter/v1/listPermission', param, "get");
    }
    /**
     * 查询用户权限(运营接口)
     */
    getUserPermissionDetail(param) {
        return this.sendApiRequest('/zsa-adapter/v1/getUserPermissionDetail', param, "get");
    }
    /**
     * 火车票退票
     * @param param
     * @return {*}
     */
     applyTrainRefund(param){
        return this.sendApiRequest('/train/v1/applyRefund', param);
    }
    /**
     * 酒店取消订单
     * @param param
     * @return {*}
     */
    cancelHotelOrder(param){
        return this.sendApiRequest('/hotel/v1/cancelOrder', param, "get");
    }
    /**
     * 机票申请退票
     * @param param
     * @return {*}
     */
    applyFlightRefund(param){
        return this.sendApiRequest('/flight/v1/applyRefund', param);
    }        
};
export default new TravelOpeHandler();