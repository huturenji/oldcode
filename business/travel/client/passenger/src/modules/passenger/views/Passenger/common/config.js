/**
 * 乘客管理相关配置,输出乘客管理通用配置
 */

// eslint-disable-next-line no-unused-vars
const RUN_ENV = process.env.BP_ENV;//运行环境，默认为Dev

// eslint-disable-next-line no-unused-vars
const TIMESTAMP = new Date().getTime();//时间戳

/**
 * http请求配置
 */
const HTTP_CONT = {
    ORIGIN:window.location.origin//域名
}


export default {
    HTTP_CONT:HTTP_CONT//请求域名
}