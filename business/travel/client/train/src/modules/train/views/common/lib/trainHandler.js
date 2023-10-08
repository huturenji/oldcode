/*
 * @Descripttion: h火车模块公共js方法
 * @version: 
 * @Author: yg
 * @Date: 2019-05-16 15:20:51
 * @LastEditors: zb
 * @LastEditTime: 2019-05-24 11:26:34
 */

//引入公共的配置文件
// import functional from 'platform/functional/src';
let { functional } = SnTravel;
let {ErrorCodeMap, NoticeType, WhiteList} = functional;
const ORIGIN = functional.HTTP_CONT.ORIGIN;

/**
 * 引入火车票的错误码
 */
const TrainErrorCodeMap = {
    "46240001": {
        text: '火车票已停用，敬请谅解',
        noticeType: NoticeType.TOAST,
    },
     /*-----------------火车票 TRAIN_MODULE_ID = "02"-----------------*/
     "46020001": {
        text: '网络异常，请稍后重试',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "46020002": {
        text: '当前时间供应商不支持此服务',
        noticeType: NoticeType.TOAST,
        ignore: true
    },
    "46020003": {
        text: '网络异常，请稍后重试',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "46020004": {//todo 场景不明确
        text: '乘客身份信息涉嫌被他人冒用',
        noticeType: NoticeType.TOAST,
    },
    "46020005": {
        text: '乘客身份信息未通过验证',
        noticeType: NoticeType.TOAST,
    },
    "46020006": {
        text: '乘客信息不正确',
        noticeType: NoticeType.TOAST,
    },
    "46020007": {//TODO 下个迭代服务器处理
        text: '乘客行程冲突无法提交订单，请将原票退改后重新购票',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "46020008": {//TODO 下个迭代服务器处理
        text: '乘客行程冲突无法提交订单，请将原票退改后重新购票',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "46020009": {
        text: '当前车票状态不允许执行此操作',
        noticeType: NoticeType.TOAST,
    },
    "46020010": {
        text: '出票五分钟内不可退票',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "46020011": {//TODO 下个迭代业务侧处理
        text: '距离发车时间不足35分钟，已停止网络退票，如有需要请前往车站窗口办理',
        noticeType: NoticeType.TOAST,
        // ignore: true,
    },
    "46020012": {
        text: '不支持网上退票',
        noticeType: NoticeType.TOAST,
    },
    "46020013": {
        text: '该订单不支持改签',
        noticeType: NoticeType.TOAST,
    },
    "46020014": {
        text: '网络异常，请稍后重试',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "46020015": {
        text: '该车票为受限车票，不支持网络退票，如有需要请前往车站窗口办理',
        noticeType: NoticeType.TOAST,
    },
    "46020016": {
        text: '您终于回来了，车次可能有变动，为您重新查询',
        noticeType: NoticeType.TOAST,
    },
    "46020017": {
        text: '该车次不可下单',
        noticeType: NoticeType.TOAST,
    },
    "46020018": {
        text: '网络异常，请稍后重试',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "46020019": {
        text: '您已取票，无法办理网络改签，如有需要请前往车站窗口办理',
        noticeType: NoticeType.TOAST,
        ignore: true,
    },
    "46020020": {
        text: '距离发车时间不足35分钟，已停止网络改签，如有需要请前往车站窗口办理',
        noticeType: NoticeType.TOAST,
        ignore: true,
    },
    "46020021": {
        text: '乘客行程冲突无法提交订单，请将原票退改后重新购票',
        noticeType: NoticeType.TOAST,
        showCode: true,
        ignore: true,
    },
    "46020038": {
        text: '不符合改签条件',
        noticeType: NoticeType.TOAST,
        showCode: true,
        ignore: true,
    },
    "46020022": {
        text: '已过发车时间，无法办理网络退票，如有需要请前往车站售票窗口办理',
        noticeType: NoticeType.TOAST,
    },
    "46020027": {
        text: '姓名格式错误',
        noticeType: NoticeType.TOAST,
    },
    "46020029": {
        text: '要改签的车次不在预售期内，无法改签',
        noticeType: NoticeType.TOAST,
    },
    "46020035": {
        text: '乘客身份校验流程未通过',
        noticeType: NoticeType.TOAST,
    },
};
Object.assign(ErrorCodeMap, TrainErrorCodeMap);
WhiteList.global.push('getTrainHistory');
/** ========================================errorCode end========================================== */

class trainHandler extends functional.baseRequestHandler{
    constructor(){
        super();
    }
    /**
     * 获取火车票热门城市
     */
    getHotCity(param){
        return this.request('/train/v1/getHotCity', param);
    }
    /**
     * 获取火车票城市
     */
    getAllCity(param){
        return this.request('/train/v1/getAllCity', param);
    }
    /**
     * 获取火车列表
     */
    getTrainQuery(param){
        return this.request('/train/v1/query', param);
    }
 
    /**
     * 2.5 查询车次时刻表
     */
    getTrainLineByTrainNo(param){
        return this.request('/train/v1/getTrainLineByTrainNo', param);
    }
    /**
     * 确认改签
     */
    confirmChange(param){
        return this.request('/train/v1/confirmChange', param);
    }
    /**
     * 申请改签接口调取
     */
    applyChange(param){
        return this.request('/train/v1/applyChange', param);
    }
    /**
     * 查询乘客的改签状态 
     */
    getChangeStatusOfPassenger(param){
        return this.request('/train/v1/getChangeStatusOfPassenger', param);
    }
 
    /**
     * 根据当前条件重新获取优惠券
     */
    findPersonalCoupon(param){
        return this.request('/bp/v1/travel/coupon/findPersonalCoupon', param);
    }
 
    /**
     * 确认下单操作
     */
    createOrder(param){
        return this.request('/train/v1/createOrder', param);
    }

    /**
     * 获取当前供应商支持的火车票购票的证件类型
     */
    getTrainCanBookCertificateType(param){
        return this.request('/train/v1/getTrainCanBookCertificateType', param);
    }

    /**
     * 获取申请出差地址
     */
    getApplyTravelUrl(param){
        return this.request('/channel/v1/getChannel', param, {method:'get'});
    }

    /**
     * 获取订单列表
     * @param param
     * @return {*}
     */
    getTripHistroy(param){
        return this.request('/train/v1/getTrainHistory', param);
    }

      /**
     * 查询退改进度
     */
    getChangeAndRefundProgress(param){
        return this.request('/train/v1/getChangeAndRefundProgress', param);
    }
 

    /**
     * 加载js
     * @id 加载js的id属性 swpPay
     * @type 代表加载sets.env.js 里面的js类型 如 pay invoice address passenger等等
     * @onload js加载完执行的回调
     */
    loadJs(id, type, onload){
        const src = ORIGIN + functional.APP_URL_MAP.swplib.path + functional.APP_URL_MAP.swplib.child[type].prefix + 
                    (functional.APP_URL_MAP.swplib.child[type].version || '') + functional.APP_URL_MAP.swplib.child[type].entry;
        functional.loadScript({
            id: id,
            src: src,
            onload: onload
        })
    }
    
    /**
    * 拆小应用openpage跳转问题 重写
    */
    openPageLib(url, href, oFlag = false){
        let newUrl = '';
        let preUrl = null;
        let appName = 'train';
        if(process.env.NODE_ENV == 'production'){
            for (const key in functional.OPENPAGE_MAP) {
                if (url.indexOf(key) > -1) {
                    preUrl = functional.OPENPAGE_MAP[key];
                    break;
                }
            }
        }else{
            url = url.replace(appName+'/','');
        }
        newUrl = preUrl ? (ORIGIN + preUrl + url) : url;
        if(href && href == 'href'){
            window.location.href = functional.urlProxy(newUrl);
        }else{
            functional.openPage(newUrl, oFlag);
        }
    }

    addHistory(obj){
      const MAX_SIZE = 3;
      const key = this.primaryKey + '_searchTrainHistory';
      let storage = functional.getStorage(key);
      storage = !!storage ? JSON.parse(storage) : [];
      //起始点相同时,只更新时间
      let index = -1;
      if(storage.some((s, i) => {
        if(s.start == obj.start && s.end == obj.end){
          s.time = obj.time;
          index = i;
          return true;
        }
      })){
        storage = storage.splice(index, 1).concat(storage);
      }else{
        storage.unshift(obj);
      }
      //最多存3条
      if(storage.length > MAX_SIZE){
        storage.splice(3, storage.length - 1);
      }
      functional.setStorage(key, JSON.stringify(storage));
    }

    /**
     * 重写lodash的去重方法
     * @param {*} array 
     * @param {*} iteratee 
     */
    sortedUniq(array, iteratee){
        if(array == null || array.length==0){
            return [];
        }
        function eq(value, other) {
            return value === other || (value !== value && other !== other);
        }
        let seen
        let index = -1//循环索引
        let resIndex = 0//结果数组索引
      
        const { length } = array//数组长度
        const result = []//结果数组
      
        while (++index < length) {
          const value = array[index], computed = iteratee ? iteratee(value) : value
          //value是原数组的当前值，computed是遍历器处理后的当前值
          if (!index || !eq(computed, seen)) {//如果是第一个元素或者，与之前的元素不相等
            seen = computed//存下新出现的元素，然后给结果数组里赋值
            result[resIndex++] = value === 0 ? 0 : value
            //结果数组结尾插入新值，排除-0的影响
          }
        }
        return result
    }
}


Object.assign(trainHandler.prototype, functional);
export default new trainHandler();
