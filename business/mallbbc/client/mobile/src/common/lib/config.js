import CHANNEL_CONFIG from "./channel";
import BP_PARAM_CONFIG from "./bp-param";
const BP_PARAM = BP_PARAM_CONFIG.BP_PARAM
const CLIENT_NAME = 'mobile-g2';//应用名称
const WORKSPACE_PATH = '/mallbbcg2/static';//项目访问根目录
const TIMESTAMP = TIMESTAMP_ENV;//时间戳
const USER_INFO_PARAMS = ['userId','companyId','channelId'];//用户基本信息属性
const URL_STABLE_PARAMS = ['origin', BP_PARAM, 'enableAgreement'];//url上固定需要的参数
const INDEX_ROUTE_PATH = HOME_PAGE;//首页的路由path 为了解决首页tabBar切换的时候 不进栈 移动端首页模拟回退的问题

const AUTH_PATH_WHITELIST = ['/views/weixin/transfer/index']; //授权路由白名单
const ROUTER_PATH_FILTER_FROMLIST = ['/views/preview/index'];//路由过滤list，在该路由list的配置中，所有从这个路由出去的其他路由都不往后走

const GD_MAP = 'https://webapi.amap.com/maps?v=1.4.15&key=135fabf79ec64c008690c4099109f48f'; //高德地址
const ZC_URL = 'https://bplus.soboten.com/chat/h5/v2/index.html?sysnum=dcce9016106c4275adca76544d320c18'; //智齿客服对接应用的url

const TOPIC_PATH = '/pages/topic/index'; // 专题页路由
const COUPON_TOPIC_ID = '2000001'; //领券中心专题页id 该id每个渠道都要在admin装修配置，并且领券中心的专题页面装修id每个渠道要一致
const COUPON_TOPIC_YYG_ID = '2000002'; //一元购运费券专题页id 该id每个渠道都要在admin装修配置
const ENV_CONFIG_PATH = process.env.NODE_ENV == 'production' ? `${window.location.origin + WORKSPACE_PATH}/env.json?t=${TIMESTAMP}` : './thirdparty/env.json';

// 加密秘钥和偏移量，用于领取奖品跳转mallbbc时使用
const CRY_CODE = "mallbbc"

const WX_APPLET_TYPE_MALL = '1'; //微信小程序的环境类型 1：巨拾惠小程序；因为目前我们有两个小程序，服务端bizcloud服务在和微信服务交互的时候，要明确用哪个小程序的appid和apprecret
const WX_APPLET_TYPE_FEATHER = '2'; //微信小程序的环境类型 2：鹅毛情小程序; 因为目前我们有两个小程序，服务端bizcloud服务在和微信服务交互的时候，要明确用哪个小程序的appid和apprecret

const PRESENT_CARD_NUMBER = 6; //鹅毛情礼物送礼贺卡数量配置
// bslconfig路径
const BSLCONFIG_PATH = process.env.NODE_ENV == 'production' ? `${location.origin+WORKSPACE_PATH}/bslConfig.json?t=${TIMESTAMP}` : './thirdparty/bslConfig.json'

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


let AUTH_CONFIG = {
    loginKcConfigPath: process.env.NODE_ENV == 'production' ? `${location.origin+WORKSPACE_PATH}/keycloak.json?t=${TIMESTAMP}` : './thirdparty/keycloak.json',
    loginKcConfig: {
        clientId: 'MALLBBCG2BANK_member',
        serviceName: 'bbcmember'
    },
    userInfoParams: USER_INFO_PARAMS,
    zIndex: 12000,
    autoUpdateToken: false,
    mode: 'native',
    source: 'self_bizmate', 
    applicationId: 'bnj_wmp'
}

// 小程序环境需要新增额外的授权参数
if (MINIPROGRAM_CONFIG.IN_MINIPROGRAM){
    let bpParam = BP_PARAM_CONFIG.getBpParam();
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

const GOODS = {
    DETAIL: {
        DESCRIPTION: {
            MAX_WIDTH: 750
        }
    }
}

// 智齿科技的订单与商城订单status对应的map
// 订单状态，1: '待付款',2: '待发货',3: '运输中', 4: '派送中',5: '已完成', 6: '待评价',7: '已取消',
const ZC_ORDER_STATE_MAP = {
    0: 7,
    10: 1,
    20: 2,
    30: 3,
    40: 5,
    50: 7
}

const ROLE = {
    USER: 'user',
    GUEST: 'guest'
} 
// 是否脱敏
let ISDECORATE = true;
// #ifdef MP-WEIXIN
//微信小程序默认不脱敏
ISDECORATE = false
// #endif

export default {
    ...BP_PARAM_CONFIG,
    BP_PARAM,
    MINIPROGRAM_CONFIG,
    CRY_CODE, // 加密秘钥和偏移量
    WORKSPACE_PATH,//项目访问根目录
    CLIENT_NAME,//应用名称
    AUTH_CONFIG,//授权配置
    USER_INFO_PARAMS,//用户基本信息属性
    URL_STABLE_PARAMS,//url上固定需要的参数
    GOODS,//商品相关配置
    INDEX_ROUTE_PATH, //首页的路由path
    ZC_ORDER_STATE_MAP, //智齿科技的订单与商城订单status
    ROLE,//用户角色枚举
    GD_MAP, //高德地址src
    ISDECORATE,
    TOPIC_PATH,
    COUPON_TOPIC_ID,
    COUPON_TOPIC_YYG_ID,
    ENV_CONFIG_PATH,
    ZC_URL,
    AUTH_PATH_WHITELIST,
    WX_APPLET_TYPE_MALL,
    WX_APPLET_TYPE_FEATHER,
    ROUTER_PATH_FILTER_FROMLIST,//路由过滤list
    PRESENT_CARD_NUMBER,
    BSLCONFIG_PATH
}