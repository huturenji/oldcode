/*
 * @Descripttion: 酒店js方法
 * @version: 
 * @Author: xwc
 * @Date: 2019年5月28日16:59:41
 * @LastEditors: xwc
 * @LastEditTime: 2019年5月28日16:59:48
 */

let functional = SnTravel.functional;
let {openPage,loadScript,ErrorCodeMap,WhiteList,NoticeType,NETWORK_ERR_SCENE,BisType}  = functional;
const ORIGIN = functional.HTTP_CONT.ORIGIN;
NETWORK_ERR_SCENE.push('index.html#/express');//配置需要展示“网络不给力”的页面
NETWORK_ERR_SCENE.push('index.html#/');//配置需要展示“网络不给力”的页面
WhiteList.global.push('express.identifyExpressCompany');
/**
 * 引入快递服务的错误码
 * VERINVOICE_MODULE_ID = "06" 
 */
const CheckErpressErrorCodeMap = {
    // "46060001": {//场景说明：不支持此种供应商
    //     text: '不支持此供应商',
    //     noticeType: NoticeType.TOAST,
    //     showCode: false,
    // },
    // "46060002": {//场景说明：邮寄方信息不完整
    //     text: '寄件人信息不完整',
    //     noticeType: NoticeType.TOAST,
    //     showCode: false,
    // },
    // "46060003": {//场景说明：收件人信息不完整
    //     text: '收件人信息不完整',
    //     noticeType: NoticeType.TOAST,
    //     showCode: false,
    // },
    "46060004": {//场景说明：第三方连接超时
        text: '快递公司系统繁忙，订单提交失败，请稍后重试',
        noticeType: NoticeType.ALERT,
        showCode: false,
    },
    "46060005": {//场景说明：第三方接口限流
        text: '快递公司系统繁忙，订单提交失败，请稍后重试',
        noticeType: NoticeType.ALERT,
        showCode: false,
    },
    // "46060006": {//场景说明：订单不存在
    //     text: '订单不存在',
    //     bisType: BisType.REFRESH,
    //     noticeType: NoticeType.ALERT,
    //     showCode: false,
    // },
    "46060007": {//场景说明：订单已取消
        text: '订单已取消',
        bisType: BisType.REFRESH,
        noticeType: NoticeType.ALERT,
        showCode: false,
    },
    "46060008": {//场景说明：订单已删除
        text: '订单已删除',
        bisType: BisType.REFRESH,
        noticeType: NoticeType.ALERT,
        showCode: false,
    },
    // "46060009": {//场景说明：快递公司不存在
    //     text: '快递公司不存在',
    //     noticeType: NoticeType.TOAST,
    //     showCode: false,
    // },
    // "46060010": {//场景说明：查询顺丰物流信息，无效的手机后四位
    //     text: '输入错误，验证失败，请重试',
    //     noticeType: NoticeType.ALERT,
    //     showCode: false,
    // },
    "46060011": {//场景说明：订单已邮寄，无法取消
        text: '订单已邮寄，无法取消',
        bisType: BisType.REFRESH,
        noticeType: NoticeType.ALERT,
        showCode: false,
    },
    // "46060012": {//场景说明：无效的快递订单类型，只能是我寄和我收
    //     text: '无效的快递订单类型',
    //     noticeType: NoticeType.TOAST,
    //     showCode: false,
    // },
    "46060013": {//场景说明：快递没有物流信息
        text: '暂未查到该运单信息，请稍后再试或去对应物流公司官网查询',
        noticeType: NoticeType.ALERT,
        showCode: false,
    },
    "46060014": {//场景说明：快递100免费查询次数已用完不做提示，跳转到快递100查询
        text: '快递100免费查询次数已用完',
        noticeType: NoticeType.TOAST,
        ignore: true,
    },
    "46060016": {//场景说明：无效外部快递订单
        text: '无效的快递单号',
        noticeType: NoticeType.TOAST,
    },
    "46000008": {//场景说明：供应商错误
        text: '供应商错误',
        noticeType: NoticeType.TOAST,
    },
  }
  Object.assign(ErrorCodeMap,CheckErpressErrorCodeMap);
  /** ========================================errorCode end========================================== */


class expressHandler extends functional.baseRequestHandler{
    constructor(){
        super();
        this.conf = null;
    } 
    /**
    * 拆小应用openpage跳转问题 重写
    */
    handlerOpenPage(url ,href,oFlag=false){
        let newUrl = '';
        let preUrl = null;
        for (const key in functional.OPENPAGE_MAP) {
            if (url.indexOf(key) > -1) {
                preUrl = functional.OPENPAGE_MAP[key];
                break;
            }
        }
        newUrl = preUrl ? (ORIGIN + preUrl + url) : url;
        if(href && href == 'href'){
            window.location.href = urlProxy(newUrl);
        }else{
            openPage(newUrl,oFlag);
        }
    }
    /**
     * 获取订单列表
     */
    getExpressOrders(param){
        return this.request('/express/v1/list',param);
    }     
    /**
     * 取消订单
     */
    cancelExpressOrder(param){
        return this.request('/express/v1/cancel',param);
    } 
    /**
     * 删除订单
     */
    deleteExpressOrder(param){
        return this.request('/express/v1/delete',param);
    }
    /**
     * 查询所有快递公司
     */
    getExpressCompanies(param){
        return this.request('/express/v1/getExpressCompanies',param);
    }
    /**
     * 查询快递单号所属快递公司
     */
    queryExpressCompany(param){
        return this.request('/express/v1/identifyExpressCompany',param);
    }
    /**
     * 查询快递物流详情
     */
    getExpressDetail(param){
        return this.request('/express/v1/getDeliveryInfo',param);
    }
    /**
     * 查询快递订单详情
     */
    getExpressOrderDetail(param){
        return this.request('/express/v1/getExpressOrderDetail',param);
    }
    /**
     * 预估快递费用
     */
    getRoughExpressOrderPrice(param){
        return this.request('/express/v1/getRoughExpressOrderPrice',param);
    }
    /**
     * 快递下单
     */
    createExpressOrder(param){
        return this.request('/express/v1/add',param);
    }
    /**
     * 查询机票订单详情
     */
    getOrderDetail(param){
        return this.request('/flight/v1/getOrderDetail',param);
    }
    /**
     * 加载js
     * @id 加载js的id属性 swpPay
     * @type 代表加载sets.env.js 里面的js类型 如 pay invoice address passenger等等
     * @onload js加载完执行的回调
     */
    loadJs(id,type,onload){
        const src = ORIGIN + functional.APP_URL_MAP.swplib.path + functional.APP_URL_MAP.swplib.child[type].prefix + 
                    (functional.APP_URL_MAP.swplib.child[type].version || '') + functional.APP_URL_MAP.swplib.child[type].entry;
        loadScript({
            id: id,
            src: src,
            onload: onload
        })
    }
}

Object.assign(expressHandler.prototype, functional);
export default new expressHandler();