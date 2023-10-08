import { BaseHandler } from "opcl";
import injectErrorCode from '../errorcodehandler/test.js';

class homelHandler extends BaseHandler {
    constructor() {
        super();
        injectErrorCode()
    }

    /**
     * 获取抽奖数据列表
     * @param {*} param 
     * @returns 
     */
    listLotteryType(param) {
        return this.sendApiRequest('/lottery/v1/listType', param, "GET");
    }
    /**
     * 获取商品池商品
     * @param {*} param 
     * @returns 
     */
    listGoods(param) {
        return this.sendApiRequest('/activitystudio/product/v1/listProduct', param, "GET");
    }
    /**
     * 获取商品池
     * @param {*} param 
     * @returns 
     */
    listGoodsPools(param) {
        return this.sendApiRequest('/activitystudio/product/v1/listProductPool', param, "GET");
    }
    /**
     * 创建抽奖活动
     * @param {*} param 
     * @returns 
     */
    createLotteryActivity(param) {
        return this.sendApiRequest('/activitystudio/lottery/v1/createActivity', param, "POST");
    }
    /**
     * 创建预览的抽奖活动
     * @param {*} param 
     * @returns 
     */
    createPreviewLottery(param) {
        return this.sendApiRequest('/activitystudio/lottery/v1/preActivity', param, "POST");
    }
    /**
     * 获取开户行信息
     * @param {*} param 
     * @returns 
     */
    companyType(param) {
        return this.sendApiRequest('/lottery/v1/companyInfo', param, "GET");
    }
    //查询订单详情
    detailOrder(param) {
        return this.sendApiRequest('/activitystudio/order/v1/detailOrder', param, "GET");
    }
    /**
     * 校验兑换码文件
     * @param {*} param 
     * @returns 
     */
    checkVoucherFile(param) {
        return this.sendApiRequest('/activitystudio/lottery/v1/checkVoucherFile', param, "POST");
    }
}

export default new homelHandler();
