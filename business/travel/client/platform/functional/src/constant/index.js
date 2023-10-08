import external from "../utils";
import BP_PARAM from "./bp-param";
import CHANNEL_CONFIG from "./channel";

const USER_INFO_PARAMS = ['userId','companyId','companyName','channelId','channelName', 'uaId', 'cpyId','cpyName', 'ProdId','userName','userPhone'];//用户基本信息属性
const URL_STABLE_PARAMS = [...USER_INFO_PARAMS, 'TGC','signData'];//url上固定需要的参数
const USER_CONFIG = {
    USER_INFO_PARAMS,
    URL_STABLE_PARAMS
}
const ISDECORATE = true ;
const NEED_TOGGLE_CASES = ['OrderNo','StartCity','EndCity','DepartTime','ArriveTime','UseType'];//url上需要兼容大写取参的配置
export const LOADING_TIMEOUT = 15 * 1000; //loading的超时时间
export const BIS_CUSTOMER_SERVICE_PHONE = '400-855-6588';//商旅联系电话
const RUN_ENV = process.env.BP_ENV;//运行环境，默认为Dev
const BIZMATEVER = external.getBizMateVersion();
const TIMESTAMP = process.env.TIMESTAMP_ENV;//时间戳
const MINIPROGRAM_CONFIG = {
    IN_MINIPROGRAM: ((sinosdk.sino.getPlatform() == sinosdk.sino.constant.RUN_ENV.WECHAT_MINI_APP) || (sinosdk.sino.getPlatform() == sinosdk.sino.constant.RUN_ENV.WECHAT_H5)), // 是否是在微信环境里面
    MINIPROGRAM_PAYSTATE_CACHEKEY: 'miniprogram_payState', // 小程序内支付状态的locakstorage缓存key
    MINIPROGRAM_PAYSTATE: {
        'SUCCESS': 1,
        'CANCLE': 2,
        'FAIL': 3
    }, // 小程序内支付状态枚举
    MINIPROGRAM_PAYPAGE: '/pages/bizcloud/pay'
}

/**
 * http请求配置
 */
const HTTP_CONT = {
    ORIGIN:window.location.origin + "/"//域名
}

/**
 * 组件地址
 */
const APP_URL_MAP = {
    "swplib": {
        "path": "travel/static/swplib/",
        "child": {
            "pay": {
                "prefix": "bp/pay/",
                "version": "",
                "entry": `sinopay.js?t=${TIMESTAMP}`
            },
            "invoice": {
                "prefix": "bp/invoice/",
                "version": "",
                "entry": `swp-invoice.js?t=${TIMESTAMP}`
            },
            "passenger": {
                "prefix": "bp/passenger/",
                "version": "",
                "entry": `swp-psg.js?t=${TIMESTAMP}`
            },
            "address": {
                "prefix": "bp/address/",
                "version": "",
                "entry": `swp-address.js?t=${TIMESTAMP}`
            },
            "serviceReminders": {
                "prefix": "bp/serviceReminders/",
                "version": "",
                "entry": `swp-serviceReminders.js?t=${TIMESTAMP}`
            },
            "serverAuth": {
                "prefix": "bp/serverAuth/",
                "version": "",
                "entry": `swp-serviceAuth.js?t=${TIMESTAMP}`
            },
            "protocol": {
                "prefix": "bp/protocol/",
                "version": "",
                "entry": `sino-protocol.js?t=${TIMESTAMP}`
            },
            "serverAuthOld": {
                "prefix": "bp/serverAuth/",
                "version": "1.0.2/",
                "entry": `swp-serviceAuth.js?t=${TIMESTAMP}`
            },
            "pdfView": {
                "prefix": "bp/pdfView/",
                "version": "",
                "entry": `web/viewer.html?t=${TIMESTAMP}`
            },
            "keycloak": {
                "prefix": "../",
                "version": "",
                "entry": `keycloak.json?t=${TIMESTAMP}`
            },
            "bsl": {
                "prefix": "../",
                "version": "",
                "entry": `bslConfig.json?t=${TIMESTAMP}`
            },
            "env": {
                "prefix": "../",
                "version": "",
                "entry": `env.json?t=${TIMESTAMP}`
            }
        }
    }
}

/**
 * 授权组件需要的参数
 */
let AUTH_CONFIG = {
    "enableAgreement": true,
    "enableAuthorize": true,
    "enanbleResourceProtect": false,
    "loginKcConfig": {
        "clientId": "TRAVEL_H5",
        "serviceName": 'travel'
    },
    "pdfViewerUrl": HTTP_CONT.ORIGIN + APP_URL_MAP.swplib.path + APP_URL_MAP.swplib.child['pdfView'].prefix + 
    (APP_URL_MAP.swplib.child['pdfView'].version || '') + APP_URL_MAP.swplib.child['pdfView'].entry,
    "apiWhiteList": ['/channel/v1/getChannel','/channel/v1/getUserAgreeProtocol','/channel/v1/addUserAgreeProtocol'],
    //以下配置2.x版本（token exchange）需要
    "kcAdapterUrl": `./thirdparty/keycloak.sino.js?t=${TIMESTAMP}`,
    "loginKcConfigPath": HTTP_CONT.ORIGIN + APP_URL_MAP.swplib.path + APP_URL_MAP.swplib.child['keycloak'].prefix + 
    (APP_URL_MAP.swplib.child['keycloak'].version || '') + APP_URL_MAP.swplib.child['keycloak'].entry,
    'mode': 'native'
}
// 小程序环境需要新增额外的授权参数
if (MINIPROGRAM_CONFIG.IN_MINIPROGRAM){
    console.log('IN_MINIPROGRAM', MINIPROGRAM_CONFIG.IN_MINIPROGRAM)
    let bpParam = BP_PARAM.getBpParam();
    if (bpParam){
        let {openId, channelId} = bpParam;
        AUTH_CONFIG= {
            ...AUTH_CONFIG,
            "thirdUserId": openId,
            'applicationId': CHANNEL_CONFIG[channelId].applicationId,
            'source': CHANNEL_CONFIG[channelId].source,
            'clientSecret': CHANNEL_CONFIG[channelId].secret
        }
    }
}

const ROLE = {
    USER: 'user',
    GUEST: 'guest'
} 

/**
 * 页面跳转地址
 * 部分银行内网做域名映射，导致取域名跳转或访问接口路径不对，这里保留使用完整url跳转的逻辑
 */
const OPENPAGE_MAP = {
    'coupon/index.html':'travel/static/',
    'order/index.html':'travel/static/',
    'wallet/index.html':'travel/static/',
    'trip/index.html':'travel/static/',
    'express/index.html':'travel/static/',
    'invoice/index.html':'travel/static/',
    'train/index.html':'travel/static/',
    'hotel/index.html':'travel/static/',
    'flight/index.html':'travel/static/',
    'h5TransitPage.html':'travel/static/pay/',
    'personal/index.html':'travel/static/',
    'passenger/index.html':'travel/static/',
    'address/index.html':'travel/static/',
    'mobile/index.html':'travel/static/'
}
  

const USE_TYPE_SCENE = {
    ORDER_ADD_TRIPNO: 1, //下单页是否需要行程tripNo，作为下单的参数
    ORDER_ADD_INVOICE: 2, //下单页是否需要打开开发票的开关
    TRIP_LIST_CHOOSE: 3 //车次详情页是否需要选择行程
}

const USE_TYPE_ENUM = {
    PUBLIC: {
        name: 'PUBLIC',
        code: 0,
        text: '公'
    },
    PRIVATE: {
        name: 'PRIVATE',
        code: 1,
        text: '私'
    }
}

const ENABLE_USE_TYPE = false;


//安全链路代理服务
const BSL_CONF = {
    BODY_HTTP_VERSION: 1.1,//http请求版本
    GET_METHOD: 'GET',//get请求
    BIZMATEVER: BIZMATEVER,//bizMate版本号，非bizMate为null
    JSON_CONF: HTTP_CONT.ORIGIN + APP_URL_MAP.swplib.path + APP_URL_MAP.swplib.child['bsl'].prefix + (APP_URL_MAP.swplib.child['bsl'].version || '') + APP_URL_MAP.swplib.child['bsl'].entry
}

// 环境变量和项目名的相关配置
const ENV_CONF = {
    JSON_CONF: HTTP_CONT.ORIGIN + APP_URL_MAP.swplib.path + APP_URL_MAP.swplib.child['env'].prefix + (APP_URL_MAP.swplib.child['env'].version || '') + APP_URL_MAP.swplib.child['env'].entry
}

export default {
    ...BP_PARAM,
    MINIPROGRAM_CONFIG,
    USER_CONFIG,
    RUN_ENV,
    HTTP_CONT,
    APP_URL_MAP,
    AUTH_CONFIG,
    OPENPAGE_MAP,
    LOADING_TIMEOUT,
    BIS_CUSTOMER_SERVICE_PHONE,
    NEED_TOGGLE_CASES,
    USE_TYPE_SCENE,
    USE_TYPE_ENUM,
    ENABLE_USE_TYPE,
    BSL_CONF, //安全链路配置
    ENV_CONF, //环境的相关配置
    ROLE,
    ISDECORATE
}