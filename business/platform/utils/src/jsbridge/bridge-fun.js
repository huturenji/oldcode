/*
 * @Author: your name
 * @Date: 2020-10-19 10:49:06
 * @LastEditTime: 2020-11-25 11:29:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \utils\src\jsbridge\bridge-fun.js
 */
import {callHandler,registerHandler,getBridgeType} from 'src/jsbridge/bridge-core';
export {callHandler,registerHandler,getBridgeType} ;
/**
 * js调用 Native confirm 弹窗
 * @export
 */

export function CommonDialogFunction(confirmJson,rightFunction,leftFunction,type){
    return callHandler('CommonDialogFunction', window.JSON.stringify(confirmJson)).then(function (data) {
        if (3 == data.clickType && 2 == type) { //两个按钮点击右侧按钮     //选择按钮类型 1:关闭按钮  2:左侧按钮  3:右侧按钮
          if (rightFunction) { //函数存在则执行函数
            rightFunction();
          }
        } else if (2 == data.clickType && 2 == type) { //两个按钮点击左侧按钮
          if (leftFunction) { //函数存在则执行函数
            leftFunction();
          }
        } else if (1 == type) {
          if (rightFunction) { //函数存在则执行函数
            rightFunction();
          }
        }
    });
}

/**
 * 调用Native 打电话
 * @param {Object} tel 电话号码
 */
export function callNativeTel (tel){
    var Json = {
      action:'ACTION_DIAL',
      dataList: [{key:'tel',value:tel,type:"uri"}],
      responseKeyList:[{key:'',value:'',type:'string'}]
    };
    callHandler('OpenActionFunction',Json).then(function(res){
      
    })
};


/**
 * 回退页面
 * @param {Object} url  //目标页面url
 */
export function goBackPage(url='', backSteps=1, loadData='') {
    callHandler('goBackFunction', window.JSON.stringify({
        loadData: loadData,
        url: url,
        backSteps: backSteps
    }));
}
/**
 * 跳转页面
 * @param {Object} url
 */
export function openPage(url) {
    if(window.isJsbridge){
        callHandler('openPage',url);
    }else{
        window.open(url)
    }
 }

/**
 * 重定向页面
 * @param {Object} url
 */
export function locationPage(url) {
  window.location.href = url;
}