/*
 * @Author: your name
 * @Date: 2021-02-02 08:52:22
 * @LastEditTime: 2021-02-04 11:04:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \utils\src\http\bslrequest.js
 */
/**
 * BSL:Bplus Security Layer：在HTTP协议和应用数据之间，插入一个安全层
负责提供安全防护
上层无感知
BSL底层的传输协议，可以是HTTP(S)，也可以是TCP协议
BSL分为两部分：
数据封装（将HTTP请求封装为Json）
JWE加密（可选，即BSL只做封装，不做加密）
BSL层本身也是可选的
*/

import {httpRequest,joinObject} from 'src/http/base';
export {httpRequest,joinObject}

const BSL_CONF = {
    PATH : '/proxy/bsl/request',//BSL请求路径，固定值
    METHOD: 'post',//BSL请求方法，固定为post
    ENCRYTION_HEADERS:{'content-type':'application/json;charset=UTF-8','x-bplus-encryption':true},//加密
    NO_ENCRYTION_HEADERS:{'content-type':'application/json;charset=UTF-8','x-bplus-encryption':false},//不加密
}

/**
 * bsl请求
 * @param {object} requestObj 请求对象  
 * @param {function} timeoutcb 超时回调函数
 */
export function bslRequest(requestObj,timeoutcb){
    
    //需要处理get请求的数据
    let httpParam = {
        url:(requestObj.baseURL?requestObj.baseURL:'')+BSL_CONF.PATH,
        method:BSL_CONF.METHOD,
        headers:requestObj.encryption===false?BSL_CONF.NO_ENCRYTION_HEADERS:BSL_CONF.ENCRYTION_HEADERS,//请求参数对象中通过encryption来标识是否需要加密，默认为true
        data:requestObj.bslBody
    }

    return httpRequest(httpParam,timeoutcb);
}

