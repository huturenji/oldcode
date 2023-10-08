let functional = SnTravel.functional;
/**
 * 火车票相关配置,输出火车票通用配置
 */

// const RUN_ENV = process.env.BP_ENV;//运行环境，默认为Dev

const TIMESTAMP = new Date().getTime();//时间戳 

/**
 * http请求配置
 */
const HTTP_CONT = {
    ORIGIN:window.location.origin + '/'//域名
    // ORIGIN:'https://bpblackbox.sinosun.com:18196'//域名
}

/**
 * 组件地址
 */
const APP_URL_MAP = {
    "swplib": {
        "path": "/static/swplib/",
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
                "version": "",
                "entry": `swp-serviceAuth.js?t=${TIMESTAMP}`
            }
        }
    }
}

/**
 * 页面跳转地址
 */
const OPENPAGE_MAP = Object.assign({}, functional.OPENPAGE_MAP,{
    // 'orderDetail.html':'travel/static/enterprise/modules/',
    // 'myOrder.html':'travel/static/enterprise/modules/',
    // 'company.html':'travel/static/enterprise/modules/',
    'enterprise/index.html':'travel/static/'
})

export default {
    HTTP_CONT:HTTP_CONT,//请求域名
    APP_URL_MAP:APP_URL_MAP,//组件地址
    OPENPAGE_MAP:OPENPAGE_MAP//页面跳转地址
}