import external from 'common/lib/utils/external';
/**
 * 定义全局配置，并输出业务用配置
 */

// 京东的图片显示规则
/**
 * 
商品图片url，在前面添加 http://img13.360buyimg.com/n0/  (末尾有/)
其中 n0(最大图 800*800px)、n1(350*350px)、n2(160*160px)、n3(130*130px)、n4(100*100px) 为图片大小。
也可以在前面添加 http://img13.360buyimg.com/n0/s450x550_
其中 s450x550_     是自定义的450*550的图片大小(注意末尾有一个下划线，没有/)
注意：n0带有京东水印，你用其余的n1-n4不带。s450x450_可以调整450和550为任意大小。利用n0-n4以及s450x450_可以调整图片为任意大小且选择是否要水印   【n12大图无水印】
 * 
 */


const RUN_ENV = process.env.BP_ENV;//运行环境，默认为Dev
const NODE_ENV = process.env.NODE_ENV;
const ENTERPRISE_INVOICE_APPID = '268435731'; //伴正事企业发票抬头小应用的小应用id，用来做导入企业发票抬头功能
const IMG_DOMAIN = 'https://img13.360buyimg.com/';//图片域名
const IMG_PATH = 'n1/s350x350_';//图片路径
const IMG_PATH_MAIN = 'n0/s800x800_';//主图图片路径
const APPSTORAGE_FILENAME = 'mallOrderData'//存app缓存的文件名，用于订单信息传递给审批页面
const BIS_CUSTOMER_SERVICE_PHONE = '400-855-6588';//客服电话
const BPLUS_TITLE = '企业购'; //BPlus的title常量
const PAGE_SIZE = {//每页数据长度
    DEFAULT: 20,//默认值
    ORDER: 10,//订单列表
}
const TIMESTAMP = process.env.TIMESTAMP_ENV;//时间戳
const BIZMATEVER = external.getBizMateVersion();
//售后模块
export const AFTER_SALE = {
    // 上传文件上限100M
    UPLOAD_FILE_MAX_SIZE: 1024 * 1000 * 100
}

//商品模块
const GOODS = {
    MAX_COUNT: 500,//最大可购数量
    MAX_TYPE_COUNT:50,//购物车中商品最大种类数
    DEFAULT_THUMBNAIL: require('themes/default/img/default_img.png'),//商品缩略图的默认图
    DEFAULT_THUMBNAIL_GIFT: require('themes/default/img/icon_mall_liwu.png'),//商品赠品和附件显示的缩略图的默认图
}

const DEFAULT_PAGE = {
    IMG: {
        DEFAULT_EMPTY_IMG: require('themes/default/img/defaultPage/img_defpage_nocontent@2x.png'),//商品空白页默认图
        CART_EMPTY_IMG: require('themes/default/img/defaultPage/icon_mall_gouwuchekong@3x.png'),//商品购物车页面空白页默认图
        DATA_FAIL: require('themes/default/img/defaultPage/img_defpage_datefail@2x.png'),//无数据时的默认图
        GOODS_NOPOOR: require('themes/default/img/defaultPage/img_defpage_staledated@2x.png'),//商品不在商品池的默认图
    }
}


const USER_INFO_PARAMS = ['userId','companyId','channelId'];//用户基本信息属性
const USER_PARAMS = [...USER_INFO_PARAMS];//终端用户基本信息属性
const URL_STABLE_PARAMS = ['supplierId','channelId'];//url上固定需要的参数

    
const THEMES = {
    SUNING: 'suning',
    XIYU: 'xiyu'
}

//供应商的对应关系
const SUPPLIER_Map = {
    1001 : {
        needAddressId: true,
        defaultCityId :'1607', //默认的cityId（深圳的）
        defaultAddressId :'19/1607/3639', //默认的addressId 包括省市区三级地址（广东省深圳市福田区）
        name: '京东',
        shortName: 'jd', 
        searchBrand: 'multiple', //商品列表品牌筛选支持多选
        changeReceiveAddress: {//售后是否能修改取件地址
            exchange: true,//售后类型：换货
        },
        appId: '268435679', //小应用id,
        analyseAddress: true,
        showMap: true,
        path: '/indexJD',
        hasShareAddress: true, //是否有共享地址的功能
    },
    1 :{
        needAddressId: true,
        defaultCityId :'1607', //默认的cityId（深圳的）
        defaultAddressId :'19/1607/3639', //默认的addressId 包括省市区三级地址（广东省深圳市福田区）
        name: '京东',
        shortName: 'jd', 
        searchBrand: 'multiple', //商品列表品牌筛选支持多选
        changeReceiveAddress: {//售后是否能修改取件地址
            exchange: true,//售后类型：换货
        },
        appId: '268435679', //小应用id
        analyseAddress: true,
        showMap: true,
        path: '/indexJD',
        hasShareAddress: true, //是否有共享地址的功能
    },
    1002 :{
        needAddressId: true,
        defaultCityId :'755', //默认的cityId（深圳的）
        defaultAddressId :'190/755/02', //默认的addressId 包括省市区三级地址（广东省深圳市福田区）
        name: '苏宁',
        shortName: 'sn', 
        searchBrand: 'single', //商品列表品牌筛选只支持单选
        changeReceiveAddress: {//售后是否能修改取件地址
            exchange: false,//售后类型：换货
        },
        appId: '268435735', //小应用id
        analyseAddress: false,
        showMap: false,
        theme: THEMES.SUNING,
        path: '/indexSN',
        hasShareAddress: false, //是否有共享地址的功能
    },
    2 :{
        needAddressId: true,
        defaultCityId :'755', //默认的cityId（深圳的）
        defaultAddressId :'190/755/02', //默认的addressId 包括省市区三级地址（广东省深圳市福田区）
        name: '苏宁',
        shortName: 'sn', 
        searchBrand: 'single', //商品列表品牌筛选只支持单选
        changeReceiveAddress: {//售后是否能修改取件地址
            exchange: false,//售后类型：换货
        },
        appId: '268435735', //小应用id
        analyseAddress: false,
        showMap: false,
        theme: THEMES.SUNING,
        path: '/indexSN',
        hasShareAddress: false, //是否有共享地址的功能
    },
    1004 :{ //官方苏宁测试环境
        needAddressId: true,
        defaultCityId :'755', //默认的cityId（深圳的）
        defaultAddressId :'190/755/02', //默认的addressId 包括省市区三级地址（广东省深圳市福田区）
        name: '苏宁',
        shortName: 'sn', 
        searchBrand: 'single', //商品列表品牌筛选只支持单选
        changeReceiveAddress: {//售后是否能修改取件地址
            exchange: false,//售后类型：换货
        },
        appId: '268435735', //小应用id
        analyseAddress: false,
        showMap: false,
        theme: THEMES.SUNING,
        path: '/indexSN',
        hasShareAddress: false, //是否有共享地址的功能
    },
}

//各个环境的supplierId的配置项
const supplierIdMap = {
	Dev: {
        'jd': {
            supplierId: 1001,
        },
        'sn': {
            supplierId: 1002,
        },
        'supplierIdList': [1001, 1002]
    },
	BlackBox: {
        'jd': {
            supplierId: 1001,
        },
        'sn': {
            supplierId: 1002,
        },
        'supplierIdList': [1001, 1002]
    },
	Sandbox: {
        'jd': {
            supplierId: 1001,
        },
        'sn': {
            supplierId: 1002,
        },
        'supplierIdList': [1001, 1002]
    },
	Production: {
        'jd': {
            supplierId: 1,
        },
        'sn': {
            supplierId: 2,
        },
        'supplierIdList': [1]
    },
}


const AUTH_CONFIG = {
    "enableAgreement": true,
    "enableAuthorize": true,
    "enanbleResourceProtect": false,
    "loginKcConfigPath": NODE_ENV == 'production' ? `../keycloak.json?t=${TIMESTAMP}` : './thirdparty/keycloak.json',
    "loginKcConfig": {
        "clientId": "mall_H5",
        "serviceName": 'mall'
    },
    "pdfViewerUrl": `./thirdparty/pdfView/web/viewer.html?t=${TIMESTAMP}`,
    "kcAdapterUrl": `./thirdparty/keycloak.sino.js?t=${TIMESTAMP}`,
    "apiWhiteList": ['/channel/v1/getAppProtocols', '/channel/v1/logUserConsent', '/channel/v1/getUserConsent', ],//不会被授权流程打断的接口请求路径
    "urlWhiteList": ['/guide']//不会进行授权流程的URL地址
}

const FRONTEND_ERROR = { 
    FRONTEND_ERROR_CODE: '00000000', //前端流程阻断性相关提示code
}

/**
 * 各种白名单配置
 */
const WHITE_LIST = {
    JSBRIDGE: {//jsbridge通用白名单
        PATH: !external.getBizMateVersion()?['/guide','/product/detail','/product/shareDetail','/product/list','/shareCart','/share','/jd','/indexJD','/sn','/indexSN','/category','/search','/employees','/product/recommendList', '/marketing']:[],//路由配置
    },
    AUTH: {//不用授权的路由
        PATH: !external.getBizMateVersion()?['/guide','/product/detail','/product/shareDetail','/product/list','/shareCart','/share','/jd','/indexJD','/sn','/indexSN','/category','/search','/employees','/product/recommendList', '/marketing']:[]
    }
}


/**
 * 售后服务时间（目前只有苏宁在用）
 */
const SERVICE_TIME = {
    '090000': '上午',
    '150000': '下午',
    '180000': '全天'
}



//安全链路代理服务
const BSL_CONF = {
    BODY_HTTP_VERSION:1.1,//http请求版本
    GET_METHOD:'GET',//get请求
    JSON_CONF: NODE_ENV == 'production' ? `../bslConfig.json?t=${TIMESTAMP}` : './thirdparty/bslConfig.json',
    BIZMATEVER:BIZMATEVER,//bizMate版本号，非bizMate为null
}

export default {
    IMG_PREFIX: IMG_DOMAIN + IMG_PATH, //缩略图片路径前缀
    IMG_PREFIX_MAIN: IMG_DOMAIN + IMG_PATH_MAIN, //主图图片路径前缀
    PAGE_SIZE: PAGE_SIZE,//每页数据长度
    AFTER_SALE: AFTER_SALE,//售后模块
    GOODS: GOODS,//商品模块
    ENTERPRISE_INVOICE_APPID,
    DEFAULT_PAGE: DEFAULT_PAGE,//缺省页配置
    USER_INFO_PARAMS: USER_INFO_PARAMS,//用户基本信息属性
    USER_PARAMS: USER_PARAMS,//终端用户基本信息属性
    URL_STABLE_PARAMS: URL_STABLE_PARAMS,//url上固定需要的参数
    APPSTORAGE_FILENAME: APPSTORAGE_FILENAME,//存app缓存的文件名，用于订单信息传递给审批页面
    BIS_CUSTOMER_SERVICE_PHONE:BIS_CUSTOMER_SERVICE_PHONE,//客服电话
    BPLUS_TITLE:BPLUS_TITLE,//BPlus的title常量
    AUTH_CONFIG: AUTH_CONFIG,//授权相关配置
    FRONTEND_ERROR: FRONTEND_ERROR, //前端相关错误项配置
    WHITE_LIST: WHITE_LIST,//各种白名单配置
    THEMES: THEMES,//主题配置
    SUPPLIER_Map: SUPPLIER_Map,//供应商的相关配置
    SERVICE_TIME: SERVICE_TIME,
    BSL_CONF:BSL_CONF,//安全链路配置
    supplierIdMap:supplierIdMap[RUN_ENV],//供应商id配置
}