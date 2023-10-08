/**
 * 定义全局配置，并输出业务用配置
 */
import externalUtils from 'common/lib/utils/external'
const NODE_ENV = process.env.NODE_ENV;
const TIMESTAMP = process.env.TIMESTAMP_ENV;//时间戳
const BIZMATEVER = externalUtils.getBizMateVersion();

const USER_INFO_PARAMS = ['userId','companyId','channelId'];//用户基本信息属性
const URL_STABLE_PARAMS = []
const USER_CONFIG = {
    USER_INFO_PARAMS,
    URL_STABLE_PARAMS
}
const DEFAULT_PAGE = {
    IMG: {
        DEFAULT_EMPTY_IMG: require('themes/default/img/defaultPage/img_defpage_nocontent@2x.png')//商品空白页默认图
    }
}

/**
 * http请求配置
 */
const HTTP_CONT = {
    ORIGIN:window.location.origin + "/"//域名
}

/**
 * 授权组件需要的参数
 */
const AUTH_CONFIG = {
    loginKcConfigPath: NODE_ENV == 'production' ? `../keycloak.json?t=${TIMESTAMP}` : './thirdparty/keycloak.json',
    loginKcConfig: {
        clientId: 'BPLUS_H5'
    },
    userInfoParams: USER_INFO_PARAMS,
    zIndex: 12000,
    mode: 'native',
}

const ROLE = {
    USER: 'user',
    GUEST: 'guest'
} 


//安全链路代理服务
const BSL_CONF = {
    BODY_HTTP_VERSION:1.1,//http请求版本
    GET_METHOD:'GET',//get请求
    BIZMATEVER:BIZMATEVER,//bizMate版本号，非bizMate为null
    JSON_CONF: NODE_ENV == 'production' ? `../bslConfig.json?t=${TIMESTAMP}` : './thirdparty/bslConfig.json'
}


export default {
    DEFAULT_PAGE,
    HTTP_CONT: HTTP_CONT,
    USER_CONFIG:USER_CONFIG,
    AUTH_CONFIG: AUTH_CONFIG,//授权配置
    BSL_CONF:BSL_CONF,//安全链路配置
    ROLE
}