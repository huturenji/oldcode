import {baseAdapter} from '../base'
import * as bridge from "sino/bridge/lib/handler";
export let channelIds = {
    dev: '5260549',
    sit: '3163397',
    uat: '7170,2114821',
    prod: '7170',
}
export let appName = '稠银企e家'
export let adapter = Object.assign({}, baseAdapter, {
    getToken(path, opt = {}, events = {}){
        let proceed = arguments[arguments.length-1];
       // if(utils.compareBizVersion('1.2.0') > -1){
            opt.mode = 'native';
      //  }
        //继续执行原函数
        proceed.proceedDefault(path, opt = {}, events = {});
    },
    /**
     * js调用 Native 获取用户差标信息
     * @export
     */
    async getCriterion() {
        //处理从银企通用户服务获取的差标数据，key值首字母调整为小写
        return await bridge.callHandler('GetTravelCriterionFunction', {})
    },

    /**
     * js调用 Native 获取用户免审批信息
     * @export
     */
    async getSpecial() {
        //处理从银企通用户服务获取的差标数据，key值首字母调整为小写
        return await bridge.callHandler('GetSpecialCompetenciesFunction', {})
    },

    /**
     * js调用 Native 获取用户预定日期
     * @export
     */
    async getReservationDateRange() {
        //处理从银企通用户服务获取的差标数据，key值首字母调整为小写
        return await bridge.callHandler('GetReservationDateRangeFunction', {})
    },

    /**
     * 用户是否已登录(老银行默认已登录)
     * @returns 
     */    
         async isLogined() {
            return {
                ret: 0,
                responseData: {
                    status: 1
                }
            };
    },
})