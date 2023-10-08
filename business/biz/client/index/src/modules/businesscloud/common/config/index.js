/**
 * 定义全局配置，并输出业务用配置
 */
import externalUtils from 'common/lib/utils/external'
const PAGE_SIZE = {//每页数据长度
    DEFAULT: 20,//默认值
}

const TIMESTAMP = process.env.TIMESTAMP_ENV;//时间戳
const RUN_ENV = process.env.BP_ENV;//运行环境，默认为Dev
const BIZMATEVER = externalUtils.getBizMateVersion();

const USER_INFO_PARAMS = ['userId','companyId','companyName','channelId','channelName', 'uaId', 'cpyId','cpyName', 'ProdId','userName','userPhone'];//用户基本信息属性
const URL_STABLE_PARAMS = []
const USER_CONFIG = {
    USER_INFO_PARAMS,
    URL_STABLE_PARAMS,
}
/**
 * http请求配置
 */
const HTTP_CONT = {
    ORIGIN:window.location.origin + "/"//域名
}

const DEFAULT_PAGE = {
    IMG: {
        DEFAULT_EMPTY_IMG: require('themes/default/img/defaultPage/img_defpage_nocontent@2x.png'),//商品空白页默认图
    }
}

/**
 * 授权组件需要的参数
 */
const AUTH_CONFIG = {
    "enableAgreement": true,
    "enableAuthorize": true,
    "enanbleResourceProtect": false,
    "loginKcConfig": {
        "clientId": "MEDIA_H5",
        "serviceName": 'news'
    },
    "pdfViewerUrl": `./thirdparty/pdfView/web/viewer.html?t=${TIMESTAMP}`,
    "apiWhiteList": ['/channel/v1/getChannel','/channel/v1/getUserAgreeProtocol','/channel/v1/addUserAgreeProtocol'],
    "urlWhiteList":[],//页面授权白名单
    //以下配置2.x版本（token exchange）需要
    "kcAdapterUrl": `./thirdparty/keycloak.sino.js?t=${TIMESTAMP}`,
    "loginKcConfigPath": `../keycloak.json?t=${TIMESTAMP}`,
    "bslConfig": `../bslConfig.json?t=${TIMESTAMP}`,
}

const WHITE_LIST = {
    JSBRIDGE: {//不用加载jsbridge的路由
        PATH: [!externalUtils.getBizMateVersion()&&'/shareArticle']
    },
    AUTH: {//不用授权的路由
        PATH: [!externalUtils.getBizMateVersion()&&'/shareArticle']
    }
}

//安全链路代理服务地址
const PROSY_BSLM_SERVERURL = {
    Dev:{url:'https://bizmatedev.sinosun.com:17280',encryption:true},
    BlackBox:{url:'https://bizmatesit.sinosun.com:17380',encryption:true},
    Sandbox:{url:'https://bizmateuat.sinosun.com',encryption:true},
    Production:{url:'https://cloud.sinosun.com',encryption:true}
}

//安全链路代理服务
const BSL_CONF = {
    BODY_HTTP_VERSION:1.1,//http请求版本
    GET_METHOD:'GET',//get请求
    DEFAULT_ENCRYPTION:PROSY_BSLM_SERVERURL[RUN_ENV].encryption,//默认请求是否加密
    BIZMATEVER:BIZMATEVER,//bizMate版本号，非bizMate为null
}


export default {
    HTTP_CONT: HTTP_CONT,
    PAGE_SIZE: PAGE_SIZE,//每页数据长度
    DEFAULT_PAGE: DEFAULT_PAGE,//缺省图
    USER_CONFIG:USER_CONFIG,
    AUTH_CONFIG: AUTH_CONFIG,//授权配置
    WHITE_LIST: WHITE_LIST,//白名单
    BSL_CONF:BSL_CONF,//安全链路配置
    RUN_ENV:RUN_ENV,//运行环境
}