/**
 * 常用工具类
 */

import external from "./external";
import * as jsbridge from './snJsBridge'
import config from '../../config'; 
import bus from './bus';
import Vue from 'vue';


const extendUtils = {};
/**
 * 根据给定的key和value，合并url中的参数。如果有则替换，没有则新增
 * 注：如果有路由，则合并路由后面的参数（即hash）
 */
extendUtils.assignUrlParam = (key, value, url=location.href)=>{
    //合并参数
    function assign (url){
        let index = url.indexOf('?');
        if(index==-1){
            return url + '?' + key + '=' + value;
        }
        let urlArr = url.split('?');
        let params = urlArr[1].split('&');
        let exit = false;//url中是否存在这个key
        params = params.map(keyValues=>{
            let arr = keyValues.split('=');
            if(key == arr[0]){
                exit = true;
                return keyValues = key + '=' + value;
            }
            return keyValues;
        })
        //不存在则新增
        if(!exit){
            params.push(key + '=' + value);
        }
        return urlArr[0] + '?' +params.join('&');
    }
    //判断是否有路由
    let hashIndex = url.indexOf('#');
    if(hashIndex==-1){
        return assign(url);
    }else{
        let hash = url.substring(hashIndex, url.length);
        return url.substring(0, hashIndex) + assign(hash)
    }
}
/*** 
* 重写openPage的方法
*/
extendUtils.openPage = (url, oFlag, target) => {
    globalBus.$emit('videoPlayTypeUpdata','')
    url = extendUtils.urlProxy(url)
    let func = external.openPage;
    //ios和普通浏览器上，将新开窗口改成页面重定向。用于处理异步打开新窗口会被浏览器拦截的问题。
    if(target=='self' && (external.getNavigatorType()=='ios' || !window.isJsbridge)){
        func = function(url){
          location.href = url;
        }
    }
    if(oFlag){
      func(url);
    }else{
        external.throttle(function () {
          func(url);
        });
    }
}

/*** 
* 代理swp-utils里面的urlProxy方法
* @param toUrl string 跳转的url的path
* @param URL_STABLE_PARAMS Array  url上需要的固定参数
*/
extendUtils.urlProxy = (toUrl) => {
    return external.urlProxy(toUrl, config.URL_STABLE_PARAMS)
}

/**
 *
 * @param {Object} content      内容
 * @param {Object} rightFunction   右侧按钮点击事件
 * @param {Object} title        title
 * @param {Object} type         类型       1-单个按钮  2-两个按钮  3-多个按钮      默认为两个按钮
 * @param {Object} strLeftBtn   左侧按钮
 * @param {Object} strRightBtn  右侧按钮
 * @param {Object} leftFunction   左侧按钮点击事件
 * @param {Object} H5Flag       是否调用H5方法
 */
extendUtils.showConfirm = (content, rightFunction, type, strLeftBtn, strRightBtn, title, leftFunction, H5Flag) => {
    var type = type || 2; //默认两个按钮
  
    if (!H5Flag) { //非H5方法
      if (2 == type) { //两个按钮
        strLeftBtn = strLeftBtn || '取消';
        strRightBtn = strRightBtn || '确认';
      } else if (1 == type) { //单个按钮
        strRightBtn = strRightBtn || '确认';
      };
      //如果是pc的话将左右的btnStr和方法对换
      if(!!external.isPC()){
        let tempRightFun = rightFunction;
        let tempLeftFun = leftFunction;
        let tempRightStr = strRightBtn;
        let tempLeftStr = strLeftBtn;
        leftFunction = tempRightFun;
        rightFunction = tempLeftFun;
        strRightBtn = tempLeftStr;
        strLeftBtn = tempRightStr;
      }
      jsbridge.CommonDialogFunction({ //调用native弹框方法
          requestCode: 0,
          strTitle: title,
          message: content,
          strLeftBtn: strLeftBtn,
          rightBtnFontColor: '#478aee', //右边按钮默认颜色
          strRightBtn: strRightBtn
        },rightFunction,leftFunction,type);
    } else {
        Vue.$vux.confirm.show({ //显示confirm弹窗   暂时屏蔽H5方法
          title: title || '',
          content: content,
          confirmText: strRightBtn,
          cancelText: strLeftBtn,
          showCancelButton: type==2,
          onShow() {
            console.log('show')
          },
          onHide() {
            console.log('hide')
          },
          onCancel() {
            leftFunction && leftFunction();
          },
          onConfirm() {
            rightFunction && rightFunction();
          }
        });
  
    }
  }

extendUtils.getJsonFile = path => {
    return new Promise((resolve, reject)=>{
        var req = new XMLHttpRequest();
        req.open('GET', path, true);
        req.setRequestHeader('Accept', 'application/json');
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    try{
                        resolve(JSON.parse(req.responseText))
                    }catch(e){
                        console.error(e);
                        reject()
                    }
                } else {
                    console.error('get json file failed! http state is: ' + req.status)
                    reject()
                }
            }
        };
        req.send();
    })
}

/**
 * 检测图片是否存在
 * @param url
 */
extendUtils.imageIsExist = url => {
    return new Promise((resolve) => {
        var img = new Image();
        img.onload = function () {
            if (this.complete == true){
                resolve(true);
                img = null;
            }
        }
        img.onerror = function () {
            resolve(false);
            img = null;
        }
        img.src = url;
    })
}

/**
 * 获取计算后的属性。  如果attr不传，则返回整个style对象
 */
extendUtils.getStyle = (obj, attr)=>{
    if (obj.currentStyle) {
        return attr ? obj.currentStyle[attr] : obj.currentStyle;
    } else {
        return attr ? document.defaultView.getComputedStyle(obj, null)[attr] : document.defaultView.getComputedStyle(obj, null);
    }
}

/**
 * 自己实现一个Promise.allSettled函数。因为有的浏览器不支持这个函数
 */
Promise.allSettled = Promise.allSettled || function (arr) {
    var P = this;
    return new P(function(resolve,reject) {
      if(Object.prototype.toString.call(arr) !== '[object Array]') {
    return reject(new TypeError(typeof arr + ' ' + arr +
        ' ' +' is not iterable(cannot read property Symbol(Symbol.iterator))'));
  }
  var args = Array.prototype.slice.call(arr);
  if (args.length === 0) return resolve([]);
  var arrCount = args.length;

  function resolvePromise(index, value) {
    if(typeof value === 'object') {
      var then = value.then;
      if(typeof then === 'function'){
        then.call(value,function(val) {
          args[index] = { status: 'fulfilled', value: val};
            if(--arrCount === 0) {
               resolve(args);
                }
         }, function(e) {
               args[index] = { status: 'rejected', reason: e };
           if(--arrCount === 0) {
                 resolve(args);
               }
             })
           }
         }
       }

        for(var i = 0; i < args.length; i++){
          resolvePromise(i, args[i]);
        }
     })
}

/**
 * 授权流程拦截器。
 * 如果url或api接口在白名单中，则不拦截；
 * 如果不在白名单中，且授权流程开启，则先拦截，等待授权流程完成后，对param中的用户信息重新赋值（如果之前有，或之前的值不等于最新的值），然后再继续请求接口
 * @param {*} url 
 * @param {*} param 
 */
extendUtils.authInterceptor = (param, apiUrl)=>{
    return window.authorization ? authorization.authInterceptor(param, apiUrl) : Promise.resolve(param);
}


extendUtils.randomNum = (minNum, maxNum) => {
    let argLength = maxNum!=null ? 2 : 1;
    switch (argLength) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
        break;
      case 2:
        return parseInt(Math.random() * ( maxNum - minNum + 1 ) + minNum, 10);
        break;
      default:
        return 0;
        break;
    }
} 

/**
 * 处理T信的关闭事件数据
 * @param {*} data 
 */
extendUtils.analyzeWinCloseData = data => {
    if(!data){
        return
    }
    if (typeof data == 'string') {
        data = JSON.parse(data);
    }
    if (!!data.refreshData) {//PC兼容处理
        data = data.refreshData;
        if (typeof data == 'string') {
            data = JSON.parse(data);
        }
    }
    if (data.loadData){
        data = JSON.parse(data.loadData)
    }
    return data;
}

extendUtils.isNotEmpty = para => {
    return para!=null && para!='null' && para!='undefined' && para!=undefined
}

extendUtils.isEmpty = para => {
    return !extendUtils.isNotEmpty(para);
}

export default Object.assign(extendUtils, jsbridge);