/*
 * @Descripttion: url代理
 * @version: 
 * @Author: yg
 * @Date: 2019-05-16 14:10:01
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-11-13 10:59:57
 */


import {getUrlParams} from 'src/tools/extend'

/**
 * 将当前url上的必要参数添加到新url后面
 * @param {*} url 新url
 * @param {*} paramArr 参数数组
 */
export function urlProxy(toUrl,paramArr){
    let _paramArr = paramArr;
    if(!toUrl) return toUrl;
    let paraObj = getUrlParams();
    //在url的hash后面添加参数。如果url的search有值，则有可能有两个问号
    let searchIndex = toUrl.indexOf('?', toUrl.indexOf('#'));
    let join = searchIndex>-1 ? '&' : '?';
    _paramArr && _paramArr.forEach((key, index)=>{
        //如果url中没有这个参数，就将所需参数拼接到目标url上
        if(!!paraObj[key] && paraObj[key]!='undefined' && toUrl.indexOf(key)==-1){
            toUrl += join + key+'='+paraObj[key];
            join = '&';
        }
    })
    return toUrl;
}
