/**
 * 定义全局配置，并输出业务用配置
 */
const TIMESTAMP = process.env.TIMESTAMP_ENV;//时间戳
const NODE_ENV = process.env.NODE_ENV;
//安全链路代理服务
const BSL_CONF = {
    BODY_HTTP_VERSION:1.1,//http请求版本
    GET_METHOD:'GET',//get请求
    JSON_CONF: NODE_ENV == 'production' ? `../bslConfig.json?t=${TIMESTAMP}` : './thirdparty/bslConfig.json'
}


export default {
    BSL_CONF//安全链路配置
}