import { BaseHandler } from "opcl";
import injectErrorCode from '../errorcodehandler/test.js';

class activityHandler extends BaseHandler {
    constructor() {
        super();
        injectErrorCode()
    }
    /**
     * 查询活动详情
     */
    getActivityDetail(param){
        return this.sendApiRequest('/activitystudio/lottery/v1/detail', param, 'get');
    }

    /**
     * 获取大屏配置
     */
    getScreenConfig(param){
        return this.sendApiRequest('/activitystudio/lottery/v1/getScreenConfig', param, 'get');
    }

    /**
     * 查询中奖名单
     * @returns 
     */
    getAwardList(param) {
        return this.sendApiRequest('/activitystudio/lottery/v1/winnerList', param);
    }

    /**
     * 获取参与者名单
     */
    getSignUpUserList(param){
        return this.sendApiRequest('/activitystudio/lottery/v1/getUsersByActivityId', param, 'GET');
    }

    /**
     * 设置大屏状态
     */
    setScreenConfig(param){
        return this.sendApiRequest('/activitystudio/lottery/v1/configScreen', param);
    }

    /**
     * 进入抽奖中状态
     * @returns 
     */
    startDraw(param){
        return this.sendApiRequest('/activitystudio/lottery/v1/startDraw', param);
    }

    /**
     * 开奖（得到中奖名单）
     * @returns 
     */
    liveDraw(param){
        return this.sendApiRequest('/activitystudio/lottery/v1/liveDraw', param);
    }
}

export default new activityHandler();
