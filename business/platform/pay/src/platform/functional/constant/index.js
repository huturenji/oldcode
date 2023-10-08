import protocolHandler from '../requestHandler/protocolHandler'
const USER_INFO_PARAMS = ['userId','companyId','channelId'];//用户基本信息属性
const URL_STABLE_PARAMS = [...USER_INFO_PARAMS];//url上固定需要的参数
const USER_CONFIG = {
    USER_INFO_PARAMS,
    URL_STABLE_PARAMS,
}
export const LOADING_TIMEOUT = 15 * 1000; //loading的超时时间
export const BIS_CUSTOMER_SERVICE_PHONE = '400-855-6588';//商旅联系电话
const RUN_ENV = process.env.BP_ENV;//运行环境，默认为Dev

const TIMESTAMP = process.env.TIMESTAMP_ENV;//时间戳

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
            "entry": `swp-pay.js?t=${TIMESTAMP}`
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
            "version": "2.0.1/",
            "entry": `swp-serviceAuth.js?t=${TIMESTAMP}`
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
            "prefix": "bp/keycloak/",
            "version": "",
            "entry": `keycloak.json?t=${TIMESTAMP}`
          },
        }
    }
}

/**
 * 授权组件需要的参数
 */
const AUTH_CONFIG = {
    "enableAgreement": true,
    "enableAuthorize": true,
    "enanbleResourceProtect": false,
    "loginKcConfigPath": HTTP_CONT.ORIGIN + APP_URL_MAP.swplib.path + APP_URL_MAP.swplib.child['keycloak'].prefix + 
    (APP_URL_MAP.swplib.child['keycloak'].version || '') + APP_URL_MAP.swplib.child['keycloak'].entry,
    "loginKcConfig": {
        "resource": "TRAVEL_H5",
    },
    "kcAdapterUrl": "../thirdparty/keycloak.sino.js",
    "pdfViewerUrl": HTTP_CONT.ORIGIN + APP_URL_MAP.swplib.path + APP_URL_MAP.swplib.child['pdfView'].prefix + 
    (APP_URL_MAP.swplib.child['pdfView'].version || '') + APP_URL_MAP.swplib.child['pdfView'].entry,
    "apiWhiteList": ['/channel/v1/getChannel'],
    "getAppProtocolsFunc": async channelId=>protocolHandler.getAppProtocols(channelId),//获取用户协议
}

/**
 * 页面跳转地址
 */
const OPENPAGE_MAP = {
    'orderDetail.html':'travel/static/order/modules/',
    'wallet.html':'travel/static/coupon/modules/',
    'trip.html':'travel/static/trip/modules/',
    'myOrder.html':'travel/static/order/modules/',
    'express.html':'travel/static/express/modules/',
    'invoiceManage.html':'travel/static/invoice/modules/',
    'train.html':'travel/static/train/modules/',
    'hotel.html':'travel/static/hotel/modules/',
    'flight.html':'travel/static/flight/modules/',
    'h5TransitPage.html':'travel/static/pay/modules/',
    'personal.html':'travel/static/mybp/modules/',
    'passenger.html':'travel/static/passenger/modules/',
    'address.html':'travel/static/address/modules/',
  }
  

export default {
    USER_CONFIG,
    RUN_ENV,
    HTTP_CONT,
    APP_URL_MAP,
    AUTH_CONFIG,
    OPENPAGE_MAP,
    LOADING_TIMEOUT,
    BIS_CUSTOMER_SERVICE_PHONE
}