import miniEnum from "./enum/miniprogram";
import { bslConfig } from "./enum/bslConfig";
const CHANNELID = '18949'; //渠道id 目前写死
const COMPANYID = '18949'; //企业id 目前写死
const CHANNELNAME = '微信小程序'; //渠道名称 目前写死
const COMPANYNAME = '微信小程序'; //企业名称 目前写死
const SERVICE_PHONE = '4008556588'; //客服电话
const ENV = process.env.ENV || 'pro'; //编译的环境变量
const SERVICE_NAME = process.env.SERVICE; //编译的服务环境
const APP_KEY = process.env.APPNAME || 'jushihui'; //编译的小程序名称
const MINE_TOPIC_ID = '1894901'; // 巨拾惠主题我的页面 专题id
const COUPON_TOPIC_ID = '2000001'; //领券中心专题页id 该id每个渠道都要在admin装修配置，并且领券中心的专题页面装修id每个渠道要一致
const PRESENT_CARD_NUMBER = 6; //鹅毛情礼物送礼贺卡数量配置
const GD_KEY = '76e645e5a29548996c394e708b940c78'; //高德地图小程序适配的key

const ACTIVITY_SERVICE_NAME = 'activitystudio'; // 抽奖活动的服务名称 
const BIZCLOUD_SERVICE_NAME = 'bizcloud'; // 商云公共的服务名称 

const GIFT_SHARE_IMAGE = 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/share/default.png'; // 涉及鹅毛情模块分享图片
const JU_SHARE_IMAGE = 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/share/jushihui.png'; // 涉及巨拾惠模块分享图片

const API_CONFIG = {
    dev: 'https://bplusdev.sinosun.com:18180/',
    sit: 'https://bplussit.sinosun.com:18380/',
    uat: 'https://bplus-uat.sinosun.com/',
    pro: 'https://cloud.sinosun.com/'
}
const API_URL = API_CONFIG[ENV];
const BSL_CONFIG = bslConfig[ENV];
const MINI_CONFIG = miniEnum[APP_KEY]; // 当前小程序相关配置项

// 项目页面重定向的路由相关配置
const REDIRECT_PATH = {
    INDEX: '/pages/index/index', // 小程序首页
}

const TIME_LINE_SCHNE = 1154; //分享朋友圈的场景值
 
export default {
    CHANNELID,
    COMPANYID,
    CHANNELNAME,
    COMPANYNAME,
    API_CONFIG,
    REDIRECT_PATH,
    SERVICE_NAME,
    SERVICE_PHONE,
    ENV,
    MINE_TOPIC_ID,
    COUPON_TOPIC_ID,
    PRESENT_CARD_NUMBER,
    MINI_CONFIG,
    APP_KEY,
    GIFT_SHARE_IMAGE,
    JU_SHARE_IMAGE,
    ACTIVITY_SERVICE_NAME,
    BIZCLOUD_SERVICE_NAME,
    API_URL,
    TIME_LINE_SCHNE,
    GD_KEY,
    BSL_CONFIG
}