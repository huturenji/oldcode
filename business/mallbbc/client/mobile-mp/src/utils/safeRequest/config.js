//安全链路代理服务
import config from '@/common/lib/config';
export default {
    PATH : '/proxy/bsl/request',//BSL请求路径，固定值
    METHOD: 'post',//BSL请求方法，固定为post
    ENCRYTION_HEADERS:{'content-type':'application/json;charset=UTF-8','x-bplus-encryption':'true'},//加密
    NO_ENCRYTION_HEADERS:{'content-type':'application/json;charset=UTF-8','x-bplus-encryption':'false'},//不加密
    BODY_HTTP_VERSION:1.1,//http请求版本
    GET_METHOD:'GET',//get请求
    JSON_CONF: config.BSL_CONFIG
}
