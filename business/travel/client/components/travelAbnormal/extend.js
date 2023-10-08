var utils = SnTravel.functional;
// 函数代理。
var extendUtils = utils;
/**
 * 为jsbriage方法添加超时功能
 * @param data
 * @param func
 * @param timeout
 * @return {Promise}
 */
var jsBriageTimeoutHandler = async function(data, func, timeout){
    return new Promise(async (resolve)=>{
        let result;
        setTimeout(()=>{
            if (!result){
                resolve();
            }
        },timeout)
        resolve(await func(data));
    })
}

if (!window.globalBus){
    window.globalBus = new Vue();
}

extendUtils.Bus = window.globalBus

let _GetCriterionFunction = utils.GetCriterionFunction;
let _GetSpecialFunction = utils.GetSpecialFunction;
let _GetReservationDateRangeFunction = utils.GetReservationDateRangeFunction;

extendUtils.GetCriterionFunction = data => jsBriageTimeoutHandler(data, _GetCriterionFunction, 5000);
extendUtils.GetSpecialFunction = data => jsBriageTimeoutHandler(data, _GetSpecialFunction, 5000);
extendUtils.GetReservationDateRangeFunction = data => jsBriageTimeoutHandler(data, _GetReservationDateRangeFunction, 5000);


export default extendUtils;
