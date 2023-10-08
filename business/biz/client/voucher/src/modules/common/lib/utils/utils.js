/**
 * 常用工具类
 */

import external from "./external";
import config from '../../config'; 
import globalBus from './bus';
import Vue from 'vue';


const extendUtils = {};
/**
 * 根据给定的key和value，合并url中的参数。如果有则替换，没有则新增
 * 注：如果有路由，则合并路由后面的参数（即hash）
 */
extendUtils.assignUrlParam = (key, value, url=location.href)=>{
    //合并参数
    function assign (turl){
        let index = turl.indexOf('?');
        if(index==-1){
            return turl + '?' + key + '=' + value;
        }
        let urlArr = turl.split('?');
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
    }
    let hash = url.substring(hashIndex, url.length);
    return url.substring(0, hashIndex) + assign(hash)
    
}
/*** 
* 重写openPage的方法
*/
extendUtils.openPage = (url, oFlag, target) => {
    url = extendUtils.urlProxy(url, constant.USER_CONFIG.URL_STABLE_PARAMS);
    
    let func = sinosdk.sino.open;
    //ios和普通浏览器上，将新开窗口改成页面重定向。用于处理异步打开新窗口会被浏览器拦截的问题。
    if (target=='self' && (external.getNavigatorType()=='ios' || !window.isJsbridge)){
        func = function(urls){
            location.href = urls;
        }
    }
    if (oFlag){
        func(url);
    } else {
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
    return external.urlProxy(toUrl, config.USER_CONFIG.URL_STABLE_PARAMS)
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
extendUtils.showConfirm = (content, rightFunction, types, strLeftBtn, strRightBtn, title, leftFunction) => {
    var type = types || 2; //默认两个按钮
    console.log(content)
    Vue.$vux.confirm.show({ //显示confirm弹窗   暂时屏蔽H5方法
        title: title || '',
        content: content||'hhh',
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
            // eslint-disable-next-line no-unused-expressions
            leftFunction && leftFunction();
        },
        onConfirm() {
            // eslint-disable-next-line no-unused-expressions
            rightFunction && rightFunction();
        }
    });
  
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

extendUtils.getBslConfig = async () => {
    let bslConfig = {}
    if(!!window.bslConfig){
        bslConfig = window.bslConfig;
    }else{
        bslConfig = window.bslConfig = await extendUtils.getJsonFile(config.BSL_CONF.JSON_CONF);
    }
    return bslConfig;
}


/**
 * 获取计算后的属性。  如果attr不传，则返回整个style对象
 */
extendUtils.getStyle = (obj, attr)=>{
    if (obj.currentStyle) {
        return attr ? obj.currentStyle[attr] : obj.currentStyle;
    } 
    return attr ? document.defaultView.getComputedStyle(obj, null)[attr] : document.defaultView.getComputedStyle(obj, null);
    
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
        if (args.length === 0) { return resolve([]); }
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


extendUtils.isString = obj => {
    return Object.prototype.toString.call(obj) == '[object String]';
}

extendUtils.isArray = obj => {
    return Object.prototype.toString.call(obj) == '[object Array]';
}

extendUtils.isObject = obj => {
    return Object.prototype.toString.call(obj) == '[object Object]';
}

extendUtils.isNumber = obj => {
    return Object.prototype.toString.call(obj) == '[object Number]';
}

extendUtils.isEmpty = obj => {
    if (obj==null || obj==undefined){
        return true;
    }
    if (extendUtils.isString(obj)){
        return obj.replace(/\s/g, '') == '';
    }
    if (extendUtils.isArray(obj)){
        return obj.length == 0;
    }
    if (extendUtils.isObject(obj)){
        return Object.keys(obj).length == 0;        
    }
    return false;
}

extendUtils.isNotEmpty = obj => {
    return !extendUtils.isEmpty(obj);
}

extendUtils.inBrowser = () => {
    return sinosdk.sino.getPlatform() == sinosdk.sino.constant.RUN_ENV.BROWSER;
}

/**
 * 是否在iframe中运行
 */
extendUtils.isInSameOriginFrame = () => {
    try{
        return window.parent.location.origin == window.self.location.origin && window.parent && window.parent != window.self;
    }catch(e){
        return false
    }
}


/**
 * iframe中不能直接关闭页面，而是发送消息让父框架处理
 */
extendUtils.closePage = (url, step, loadData) => {
    if(extendUtils.isInSameOriginFrame()){
        sinosdk.sino.message.broadcastEvent(window.parent, 'closePage')
    }else{
        sinosdk.sino.back(url, step, loadData);
    }
}

// 对象深拷贝
extendUtils.deepClone = obj => {
    if (!extendUtils.isObject(obj)) {
        throw new Error('obj 不是一个对象！')
    }

    let cloneObj = extendUtils.isArray() ? [...obj] : { ...obj }
    Reflect.ownKeys(cloneObj).forEach(key => {
        cloneObj[key] = extendUtils.isObject(obj[key]) ? extendUtils.deepClone(obj[key]) : obj[key]
    })

    return cloneObj
}
export default extendUtils;