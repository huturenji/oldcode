
import * as jsbridge from './snJsBridge'
import external from "./external";
import config from '../config'
import themeManager from 'common/lib/themeManager'
var extendUtils = {}




extendUtils.findIndex = (array, value) => {
    let _index = -1;
    if (!array || array.length == 0) {
        return _index;
    }
    let _value = value;
    let _key = null;

    //value是函数，则直接用函数匹配
    if (value.constructor === Function) {
        array.some((obj, index) => {
            if (value(obj)) {
                _index = index;
                return true;
            }
        })
        return _index;
    }

    //value是对象，则取第一个key进行过滤
    //其他情况，直接用value匹配过滤
    if (value.constructor === Object) {
        let keys = Object.keys(value);
        if (keys.length == 0) {
            return _index;
        }
        _key = keys[0];
        _value = value[_key];
    }
    array.some((obj, index) => {
        if (!!_key && obj.constructor === Object) {
            obj = obj[_key];
        }
        if (obj == _value) {
            _index = index;
            return true;
        }
    })
    return _index;
}

Array.prototype.findIndex = (Array.prototype.findIndex || function(data){
    return extendUtils.findIndex(this, data)
})

// 数组对象根据某个key去重去重
extendUtils.repeatArray = (arr, key) => {
    let obj = {};
    let newArr = [];
    newArr = arr.reduce((cur,next) => {
                obj[next[key]] ? "" : obj[next[key]] = true && cur.push(next);
                return cur;
            }, []);
    return newArr;
}

/**
 * 获取数值的整数部分
 */
extendUtils.priceInt = val => {
    return new Number(val).toFloor(0);
}
/**
 * 获取数值的小数部分 10.5 2
 */
extendUtils.priceFloat = (val, toFixed=2) => {
    //此情况下无意义
    if(toFixed<=0){
        return '';
    }
    let numStr = new String(val);
    let array = numStr.split('.');
    let point = array.length>1 ? array[1] : '';
    //小数位如果比补零的个数小，则直接补零
    if(point.length<toFixed){
        let result = '.' + point;
        for(let i = 0; i < toFixed-point.length; i++){
            result += '0'
        }
        return result;
    }else if(point.length==toFixed){
        return '.' + point;
    }else{
        //否则用去尾法处理小数位
        let num = new Number(val).toFloor(toFixed);
        return '.' + new String(num).split('.')[1];
    }
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
 * 手机号敏感隐藏
 * @param url
 */
extendUtils.sensitiveHide = val => {
    if(typeof val === 'string') {
        if(val.length > 3 && val.length < 8) {
            return val.replace(val.substr(3), val.substr(3).split('').reduce(i => i + '*', ''));
        } else if(val.length >= 8) {
            return val.replace(val.substr(3, 4), '****');
        } else {
            return val;
        }
    } else {
        return '';
    }
}
/**
 * 防抖
 * @func  调用的方法
 * @wait  延迟时间
 */
extendUtils.debounce = (func, wait) => {
    let timeout
    return function(...args) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        timeout = null
        func.apply(this, args)
      }, wait||0)
    }
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
 * 用于计算子元素（一般是数组）是否超过了父元素
 * @param parent 父级dom元素，原生dom或者VueComponet对象都行
 * @param children 数组类型。原生dom或者VueComponet对象都行
 */
extendUtils.domOverflow = (parent, children)=>{
    if(!parent || !children){
        return;
    }
    parent = parent.$el || parent;
    let totalWidth = 0;
    function calcRealWidth(domStyle){
        return getNumeralVal(domStyle.width) + getNumeralVal(domStyle.marginLeft) + getNumeralVal(domStyle.marginRight)
    }
    function getNumeralVal(val){
        val = parseFloat(val);
        //非数字的不参与计算
        if(isNaN(val)){
            return 0
        }
        return val;
    }
    Array.prototype.forEach.call(children, child=>{
        let dom = child.$el || child;
        if(dom instanceof Element){//需要判断是不是Element节点，因为$refs返回的，可能是一个comment节点
            let style = extendUtils.getStyle(dom);
            if(style.display!='none'){
                totalWidth += calcRealWidth(style);
            }
        }
    })
    let parentStyle = extendUtils.getStyle(parent)
    return totalWidth > calcRealWidth(parentStyle);
}

/**
 * 正则校验邮箱
 * @param email 需要校验的邮箱字符串
 */
extendUtils.checkEmail = (email)=> {
    let emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    return emailReg.test(email);
}

/**
 * 加载keycloak配置
 * 此配置是公共配置，只包含了realm和keycloak server的url
 */
extendUtils.getJsonFile = path => {
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest();
        req.open('GET', path, true);
        req.setRequestHeader('Accept', 'application/json');
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    try {
                        resolve(JSON.parse(req.responseText))
                    } catch (e) {
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
 * 授权流程拦截器。
 * 如果url或api接口在白名单中，则不拦截；
 * 如果不在白名单中，且授权流程开启，则先拦截，等待授权流程完成后，对param中的用户信息重新赋值（如果之前有，或之前的值不等于最新的值），然后再继续请求接口
 * @param {*} url 
 * @param {*} param 
 */
extendUtils.authInterceptor = (param, apiUrl)=>{
    return window.authorization ? authorization.authInterceptor(param, apiUrl) : Promise.resolve(param);
}

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
/*** 
* 重写openPage的方法
*/
extendUtils.openPage = (url, oFlag, target) => {
    url = external.urlProxy(url, config.URL_STABLE_PARAMS)
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

/**
 * 地图定位获取当前定位城市
 * 要求html需要引入高德开发者账号相关的信息
 */	
extendUtils.getLocation = () => {
    return new Promise((resolve, reject) => {
        var citysearch = new AMap.CitySearch();
        //自动获取用户IP，返回当前城市
        citysearch.getLocalCity(function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                if (result && result.city) {
                    var cityinfo = result.city;
                    resolve(cityinfo)
                }else{
                    resolve(null)
                }
            } else {
                resolve(null)
            }
        });
    })
}
          

/*
 * 根据供应商id自动加载主题
 */
extendUtils.autoLoadTheme = (supplierId = external.getUserPara('supplierId')) => {
    if(!!!supplierId){ return }
    let supplier = config.SUPPLIER_Map[supplierId];
    if(!supplier || !supplier.theme){
        return ;
    }
    themeManager.load(supplier.theme);
}

/*
 * 根据供应商id获取商城的title
 */
extendUtils.getMallTitle = (supplierId = external.getUserPara('supplierId')) => {
    let title = config.BPLUS_TITLE;
    if(supplierId!=null && supplierId!=undefined && supplierId!=''){
        title = `${config.SUPPLIER_Map[supplierId].name}${config.BPLUS_TITLE}`;
    }
    return title;
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

extendUtils.isEmpty = string=>{
    return string==null || string==undefined || string=='' || string=='undefined'
}

extendUtils.isStrictEmpty = string=>{
    return extendUtils.isEmpty(string) || string=='undefined' || string=='null'
}

let _appBack = jsbridge.appBack;


extendUtils.appBack = (func, context)=>{
    _appBack(func, context);
    window.loadTitleBar && window.loadTitleBar.then(titleBar=>{
        titleBar.appbackFunc = function(){
            func.call(context)
        }
    })
}

extendUtils.getGuestIdentity = ()=>{
    let res = '';
    if(!!external.getSession('identity')){
        res = external.getSession('identity');
    }
    return res
}

let _reFreshPage = jsbridge.reFreshPage;
extendUtils.reFreshPage = (func, context)=>{
    _reFreshPage(func);
    window.loadTitleBar && window.loadTitleBar.then(titleBar=>{
        titleBar.refreshFunc = function(){
            func.call(context)
        }
    })
}

extendUtils.reloadWithNoCache = () => {
    // jsbridge.ClearWebViewCache();
    external.reloadPage();
}

export default Object.assign({}, jsbridge, extendUtils);
