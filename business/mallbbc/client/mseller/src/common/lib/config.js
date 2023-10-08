const ENV = process.env.ENV || 'prod'; //编译的环境变量
const SERVICE_NAME = process.env.SERVICE; //编译的服务环境
const LOGIN_PATH = '/views/login/index';

// 项目中缓存的key
const STORAGE_CACHE_KEY = {
    SHOPLIST_CACHE_KEY: 'shoplist',
    VENDORID: 'vendorId',
    CHOOSED_SHOP_INDEX: 'choosed_shop_index', 
    USER_INFO: 'user_info' 
}
const API_CONFIG = {
    dev: 'https://bplusdev.sinosun.com:18180/',
    sit: 'https://bplussit.sinosun.com:18380/',
    uat: 'https://bplus-uat.sinosun.com/',
    prod: 'https://cloud.sinosun.com:9443/'
}

const API_URL = API_CONFIG[ENV]

export default {
    API_CONFIG,
    SERVICE_NAME,
    ENV,
    API_URL,
    LOGIN_PATH,
    STORAGE_CACHE_KEY
}