const utils = SnTravel.functional;
const extendUtils = {}
const ORIGIN = utils.HTTP_CONT.ORIGIN;
const OPENPAGE_MAP = { //跳转页面的配置文件
    'order':'travel/static/order/index.html#/',
    'flight':'travel/static/flight/index.html#/',
    'train':'travel/static/train/index.html#/',
    'hotel':'travel/static/hotel/index.html#/',
    'car':'travel/static/car/index.html#/',
    'criterion':'travel/static/personal/index.html#/'
};   

/**
 * 生成应用url
 * @param {*} appName  应用名称
 */
extendUtils.genAPPUrl = (appName) => {
    return ORIGIN + OPENPAGE_MAP[appName];
},

/**
 * 打开订单详情
 * @param {Object} orderType   详情类型，分为酒店hotel、火车票train、机票flight
 * @param {Object} orderNo     订单NO
 * @param {Object} isSelf     是否是自己下的订单
 * @param {Object} founderName 下单人      
 */
extendUtils.openOrderDetail = (orderType,orderNo) => {
    let url = extendUtils.genAPPUrl('order') + 'detail/'+orderType + '?orderNo=' + orderNo + '&pageFrom=trip'
    utils.openPage(url);
}

/**
* 计算相隔时间
* @param {Object} startTime  开始时间
* @param {Object} endTime  结束时间
*/
extendUtils.countTime = (startTime, beginTime, endTime, type) => {
    let difArr = utils.dateDiff(beginTime, startTime);
    let str = '';
    let strType = '出发';
    if (type == 'hotel'){
        strType = '入住'
    }
    if (difArr.length > 0){
        if (difArr[0] == '0'){
            if (difArr[1] == '0'){
                if (difArr[2] == '0'){
                    str = extendUtils.judgeTriping(endTime, type);
                } else {
                    str = difArr[2] + '分后' + strType;
                }
            } else {
                str = difArr[1] + '小时后' + strType;
            }
        } else if (type=='hotel' || difArr[1] == '0'){
            str = difArr[0] + '天后' + strType;
        } else {
            str = difArr[0] + '天' + difArr[1] + '小时后' + strType;
        }
    } else {
        str = extendUtils.judgeTriping(endTime, type);
    }
    return str;
}

//判断是否在行程中
extendUtils.judgeTriping = (endTime, type) => {
    let str = '';
    if (type == 'hotel'){
        let todayTime = new Date(new Date().format('yyyy/MM/dd')).getTime();
        if (endTime >= todayTime){
            str = '入住中';
        } else {
            str = '已结束';
        }
    } else {
        let nowTime = new Date().getTime();
        if (endTime >= nowTime){
            str = '行程中';
        } else {
            str = '已结束';
        }
    }
    return str;
}

/**
* 计算相隔时间
* @param {Object} startTime  开始时间
* @param {Object} endTime  结束时间
*/
extendUtils.runTime = (startTime,endTime) => {
    let difArr = utils.dateDiff(endTime,startTime);
    return 0<difArr.length
        ?(difArr[0] == 0 ? '' : (difArr[0] + '天')) + 
    difArr[1] + '小时' + difArr[2] +'分'
        :'';
}

/**
* 时间转换为年月
* @param {Object} date  时间
*/
extendUtils.handleDate2Month = (date) => {
    return new Date(date).format('MM月dd日')
}

/**
* 时间转换为年月
* @param {Object} date  时间
*/
extendUtils.handleDate = (date) => {
    return new Date(date).format('yyyy年MM月dd日')
}

/**
 * 计算总时间天数
 * @param {Object} startTime  开始时间
 * @param {Object} endTime  结束时间
 */
extendUtils.handleTotalDay = (startTime,endTime) => {
    return parseInt((endTime-startTime) / (24 * 3600 * 1000));
}

/**
 * 时间转换星期
 * @param {Object} num  星期几
 * @param {Object} type 格式
 */
 extendUtils.genWeek = (num, type) => {
    return utils.indexToWeek(num, type);
}

/**
 * 打开地图
 * @param {*} appName 
 * @param {*} url
 */
extendUtils.showMap = (appName,url) => {
    utils.openPage(extendUtils.genAPPUrl(appName)+url);
}


export default Object.assign({}, utils, extendUtils)