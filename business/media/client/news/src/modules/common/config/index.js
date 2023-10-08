/**
 * 定义全局配置，并输出业务用配置
 */
import { pointDataConfig } from './dataPointEnum.js'
import externalUtils from 'common/lib/utils/external'
const PAGE_SIZE = {//每页数据长度
    DEFAULT: 20//默认值
}
const NODE_ENV = process.env.NODE_ENV;
const TIMESTAMP = process.env.TIMESTAMP_ENV;//时间戳
// const RUN_ENV = process.env.BP_ENV;//运行环境，默认为Dev
const BIZMATEVER = externalUtils.getBizMateVersion();

const USER_INFO_PARAMS = ['userId','companyId','companyName','channelId','channelName', 'uaId', 'cpyId','cpyName', 'ProdId','userName','userPhone'];//用户基本信息属性
const URL_STABLE_PARAMS = []
const USER_CONFIG = {
    USER_INFO_PARAMS,
    URL_STABLE_PARAMS
}
/**
 * http请求配置
 */
const HTTP_CONT = {
    ORIGIN:window.location.origin + "/"//域名
}

const DEFAULT_PAGE = {
    IMG: {
        DEFAULT_EMPTY_IMG: require('themes/default/img/defaultPage/img_defpage_nocontent@2x.png')//商品空白页默认图
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
        "clientId": "MALLBBCG2BANK_member",
        "serviceName": 'news'
    },
    "pdfViewerUrl": `./thirdparty/pdfView/web/viewer.html?t=${TIMESTAMP}`,
    "apiWhiteList": ['/channel/v1/getAppProtocols','/channel/v1/getUserAgreeProtocol','/channel/v1/addUserAgreeProtocol'],
    "urlWhiteList":[],//页面授权白名单
    //以下配置2.x版本（token exchange）需要
    "kcAdapterUrl": `./thirdparty/keycloak.sino.js?t=${TIMESTAMP}`,
    "loginKcConfigPath": NODE_ENV == 'production' ? `../keycloak.json?t=${TIMESTAMP}` : './thirdparty/keycloak.json',
    'mode': 'native',
    'source': 'self_bizmate'
}

const ROLE = {
    USER: 'user',
    GUEST: 'guest'
} 

const WHITE_LIST = {
    JSBRIDGE: {//不用加载jsbridge的路由
        PATH: [!externalUtils.getBizMateVersion()&&'/shareArticle']
    },
    AUTH: {//不用授权的路由
        PATH: []
    }
}


//安全链路代理服务
const BSL_CONF = {
    BODY_HTTP_VERSION:1.1,//http请求版本
    GET_METHOD:'GET',//get请求
    BIZMATEVER:BIZMATEVER,//bizMate版本号，非bizMate为null
    JSON_CONF: NODE_ENV == 'production' ? `../bslConfig.json?t=${TIMESTAMP}` : './thirdparty/bslConfig.json'
}


export default {
    HTTP_CONT: HTTP_CONT,
    PAGE_SIZE: PAGE_SIZE,//每页数据长度
    DEFAULT_PAGE: DEFAULT_PAGE,//缺省图
    USER_CONFIG:USER_CONFIG,
    AUTH_CONFIG: AUTH_CONFIG,//授权配置
    POINT_DATA_CONFIG:pointDataConfig,//数据埋点配置
    WHITE_LIST: WHITE_LIST,//白名单
    BSL_CONF:BSL_CONF,//安全链路配置
    ROLE
}