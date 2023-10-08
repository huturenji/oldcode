import { BaseHandler } from "opcl";
import injectErrorCode from '../errorcodehandler/test.js';

class activityHandler extends BaseHandler {
    constructor() {
        super();
        injectErrorCode()
    }
    //查询活动列表
    clientActivityList(param) {
        return this.sendApiRequest('/activitystudio/lottery/v1/clientActivityList', param, "POST");
    }
    //查询活动详情
    detailActivity(param) {
        return this.sendApiRequest('/activitystudio/lottery/v1/detail', param, "GET");
    }
    //编辑活动状态
    editActivity(param) {
        return this.sendApiRequest('/activitystudio/lottery/v1/editActivity', param, "POST");
    }
    //补充活动奖品
    addPrize(param) {
        return this.sendApiRequest('/activitystudio/lottery/v1/addPrize', param, "POST");
    }
    //查询中奖名单
    winnerList(param) {
        return this.sendApiRequest('/activitystudio/lottery/v1/winnerList', param, "POST");
    }
    //导出中奖名单
    winnerListExport(param) {
        return this.sendApiRequest('/activitystudio/lottery/v1/winnerListExport', param, "POST");
    }
    //查询订单详情
    detailOrder(param) {
        return this.sendApiRequest('/activitystudio/order/v1/detailOrder', param, "GET");
    }    
    /**
     * 获取参与者名单
     */
     getUsersByActivityIdPage(param){
        return this.sendApiRequest('/activitystudio/lottery/v1/getUsersByActivityIdPage', param, 'POST');
    }    
}

export default new activityHandler();
