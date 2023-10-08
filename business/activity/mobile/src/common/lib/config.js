const TIMESTAMP = TIMESTAMP_ENV;//时间戳
const WORKSPACE_PATH = '/activitystudio/static';//项目访问根目录
const USER_INFO_PARAMS = ['userId','companyId','channelId']; //用户基本信息属性
const URL_STABLE_PARAMS = ['supplierId','channelId'];//url上固定需要的参数

const AUTH_CONFIG = {
    loginKcConfigPath: process.env.NODE_ENV == 'production' ? `${location.origin + WORKSPACE_PATH}/keycloak.json?t=${TIMESTAMP}` : './thirdparty/keycloak.json',
    loginKcConfig: {
        clientId: 'BPLUS_H5'
    },
    userInfoParams: USER_INFO_PARAMS,
    mode: 'native'
}

// 加密秘钥和偏移量，用于领取奖品跳转mallbbc时使用
const CRY_CODE = "mallbbc"
// 对应的环境
let hostname = window.location.hostname;
let hostMap={
    "bplusdev.sinosun.com":"mallbbcg2",
    "bplussit.sinosun.com":"mallbbcg2",
    "bplus-uat.sinosun.com":"mallbbcg2bank",
    "cloud.sinosun.com":"mallbbcg2bank"
}
const DOMAIN_NAME = hostMap[hostname]||'mallbbcg2'   //mallbbcg2    mallbbcg2bank

export default {
    WORKSPACE_PATH,
    USER_INFO_PARAMS,
    URL_STABLE_PARAMS,
    AUTH_CONFIG,
    CRY_CODE,
    DOMAIN_NAME
}