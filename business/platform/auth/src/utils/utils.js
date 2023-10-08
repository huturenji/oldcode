import Constant from '../constant'
import externalUtils from './externalUtils'
import Confirm from './confirm'

const platform = sinosdk.sino.getPlatform();//获取平台类别


/**
 * 自定义工具函数
 */

let Utils = {}
/**
 * 获取弹窗实例，如果已存在实例，则返回空对象。也就是说，一个页面，只会有一个弹窗
 */
 const comfirmObj = new Confirm();
 Utils.showConfirm = obj => {
   if(obj === false){
       comfirmObj.hide();
       return;
   }  
   comfirmObj.show(obj);
 }
 
/**
* 解析token
* @param {*} str 
*/
Utils.decodeToken = str => {
    if(Utils.isEmpty(str)){
        return str;
    }
    try {
        str = str.split('.')[1];
        str = str.replace('/-/g', '+');
        str = str.replace('/_/g', '/');
        switch (str.length % 4) {
            case 0:
                break;
            case 2:
                str += '==';
                break;
            case 3:
                str += '=';
                break;
            default:
                throw 'Invalid token';
        }

        str = (str + '===').slice(0, str.length + (str.length % 4));
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        str = decodeURIComponent(escape(atob(str)));
        str = JSON.parse(str);
        return str;
    } catch (e) {
        console.error(e);
        return null;
    }
}

/**
 * 删除url上的原有的用户参数（处理后的url可能会丢失location.search后面的#/)
 */
Utils.removeUserParamOnUrl = (userInfoParams=[]) => {
    try {
        let search = location.search;
        let hash = location.hash;
        let paramFilter = str => {
            if(Utils.isEmpty(str)){
                return '';
            }
            let prefix = ''
            if(str.startsWith('?')){
                prefix = '?';
                str = str.substring(1);
            }
            let arr = str.split('&').filter(param=>{
                let key = param.split('=')[0];
                if ([...Constant.AUTH_PARAMS_IN_URL, ...userInfoParams].indexOf(key) > -1) {
                    return false;
                } else {//其他的不变
                    return true;
                }
            })
            return Utils.isNotEmpty(arr) ? prefix + arr.join('&') : ''
        }

        if(Utils.isNotEmpty(search)){
            search = paramFilter(search)
        }
        if(Utils.isNotEmpty(hash)){
            let index = hash.indexOf('?');
            if(index > -1){
                hash = hash.substring(0, index) + paramFilter(hash.substring(index))
            }
        }
        history.replaceState(window.history.state, '', location.origin + location.pathname + search + hash);
    } catch (e) {
        console.error('removeUserParamOnUrl error!', e)
    }
}

/**
 * 将用户参数放到url上
 */
Utils.setUserParamOnUrl = (userInfoParams, data) => {
    try {
        let hash = location.hash;
        let index = hash.indexOf('?');
        let route = index > -1 ? hash.substring(0, index) : hash;//只保留问号之前的部分，即路由的path
        let routeParam = hash.substring(index + 1, hash.length);
        routeParam = index > -1 && !!routeParam ? routeParam.split('&') : [];//当前的参数

        //追加用户信息的基本参数
        userInfoParams.forEach(key => {
            if (data[key]) {
                routeParam.push(`${key}=${data[key]}`);
            }
        })
        //更新url参数
        history.replaceState(window.history.state, '', location.origin + location.pathname + location.search + route + (routeParam && routeParam.length > 0 ? '?' : '') + routeParam.join('&'));
    } catch (e) {
        console.error('setUserParamOnUrl error!', e)
    }
}

/**
* token是否过期
*/
Utils.isTokenExpired = (token, minValidity) => {
    if (!token) {
        return true;
    }
    var expiresIn = token['exp'] - Math.ceil(new Date().getTime() / 1000);
    if (minValidity) {
        if (isNaN(minValidity)) {
            throw 'Invalid minValidity';
        }
        expiresIn -= minValidity;
    }
    return expiresIn < 0;
}

/**
 * 自己实现一个Promise.allSettled函数。因为有的浏览器不支持这个函数
 */
Promise.allSettled = Promise.allSettled || function (arr) {
    var P = this;
    return new P(function (resolve, reject) {
        if (Object.prototype.toString.call(arr) !== '[object Array]') {
            return reject(new TypeError(typeof arr + ' ' + arr +
                ' ' + ' is not iterable(cannot read property Symbol(Symbol.iterator))'));
        }
        var args = Array.prototype.slice.call(arr);
        if (args.length === 0) return resolve([]);
        var arrCount = args.length;

        function resolvePromise(index, value) {
            if (typeof value === 'object') {
                var then = value.then;
                if (typeof then === 'function') {
                    then.call(value, function (val) {
                        args[index] = { status: 'fulfilled', value: val };
                        if (--arrCount === 0) {
                            resolve(args);
                        }
                    }, function (e) {
                        args[index] = { status: 'rejected', reason: e };
                        if (--arrCount === 0) {
                            resolve(args);
                        }
                    })
                }
            }
        }

        for (var i = 0; i < args.length; i++) {
            resolvePromise(i, args[i]);
        }
    })
}


/**
 * 加载keycloak配置
 * 此配置是公共配置，只包含了realm和keycloak server的url
 */
Utils.getJsonFile = path => {
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


Utils.loadKeycloakJs = function (src = './keycloak.sino.js') {
    return new Promise((resolve, reject) => {
        externalUtils.loadScript({
            src: src,
            id: 'keycloakLib',
            onload: () => {
                resolve()
            },
            onerror: () => {
                reject();
            }
        })
    })
}

Utils.extend = function extend() {
    var extended = {};
    var deep = false;
    var i = 0;
    
    // 判断是否为深拷贝
    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
        deep = arguments[0];
        i++;//如果为深拷贝则初始的i为1或者为0
    }
    
    // 将对象属性合并到已存在的对象中
    var merge = function(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                // 如果属性为对象并且需要深拷贝时则使用函数递归、反之则将当前的属性替换现有的属性
                if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                　　extended[prop] = extend(extended[prop], obj[prop]);
                } else {
                　　extended[prop] = obj[prop];
                }
        　　}
    　　}
    };
    
    // 遍历所有对象属性
    for (; i < arguments.length; i++) {
    　　merge(arguments[i]);
    }
    
    return extended;
    
}
Utils.getNonnullValue = function(value){
    return value!=null && value!=undefined && value!='null' && value!='undefined' ? value : null;
}

Utils.firstLetterUpCase = function(str){
    if(str==null || str==undefined || str.replace(/\s/g, '').length==0){
        return str;
    }
    return str.substring(0,1).toUpperCase() + str.substring(1)
}

Utils.generateRandomData = function(len) {
    // use web crypto APIs if possible
    var array = null;
    var crypto = window.crypto || window.msCrypto;
    if (crypto && crypto.getRandomValues && window.Uint8Array) {
        array = new Uint8Array(len);
        crypto.getRandomValues(array);
        return array;
    }

    // fallback to Math random
    array = new Array(len);
    for (var j = 0; j < array.length; j++) {
        array[j] = Math.floor(256 * Math.random());
    }
    return array;
}

Utils.generateCodeVerifier = function(len) {
    return Utils.generateRandomString(len, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
}

Utils.generateRandomString = function(len, alphabet){
    var randomData = Utils.generateRandomData(len);
    var chars = new Array(len);
    for (var i = 0; i < len; i++) {
        chars[i] = alphabet.charCodeAt(randomData[i] % alphabet.length);
    }
    return String.fromCharCode.apply(null, chars);
}

Utils.generatePkceChallenge = async function(pkceMethod, codeVerifier) {
    switch (pkceMethod) {
        // The use of the "plain" method is considered insecure and therefore not supported.
        case "S256":
            var base64js = await require('base64-js');
            var sha256 = (await require('js-sha256'))['sha256'];
            // hash codeVerifier, then encode as url-safe base64 without padding
            var hashBytes = new Uint8Array(sha256.arrayBuffer(codeVerifier));
            var encodedHash = base64js.fromByteArray(hashBytes)
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/\=/g, '');
            return encodedHash;
        default:
            throw 'Invalid value for pkceMethod';
    }
}

Utils.createUUID = function() {
    var hexDigits = '0123456789abcdef';
    var s = Utils.generateRandomString(36, hexDigits).split("");
    s[14] = '4';
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = '-';
    var uuid = s.join('');
    return uuid;
}

Utils.isEmpty = obj => {
    if(obj==null || obj==undefined){
        return true;
    }
    if(Utils.isString(obj)){
        return obj.replace(/\s/g, '') == '';
    }
    if(Utils.isArray(obj)){
        return obj.length == 0;
    }
    if(Utils.isObject(obj)){
        return Object.keys(obj).length == 0;        
    }
    if(Utils.isBoolean(obj)){
        return false;
    }
    return false;
}

Utils.isStrictEmpty = obj => {
    return Utils.isEmpty(obj) || obj == 'undefined' || obj == 'null'
}

Utils.isNotEmpty = obj => {
    return !Utils.isEmpty(obj);
}

Utils.isNotStrictEmpty = obj => {
    return !Utils.isStrictEmpty(obj);
}

Utils.isString = obj => {
    return Object.prototype.toString.call(obj) == '[object String]';
}

Utils.isArray = obj => {
    return Object.prototype.toString.call(obj) == '[object Array]';
}

Utils.isObject = obj => {
    return Object.prototype.toString.call(obj) == '[object Object]';
}

Utils.isNumber = obj => {
    return Object.prototype.toString.call(obj) == '[object Number]';
}

Utils.isBoolean = obj => {
    return Object.prototype.toString.call(obj) == '[object Boolean]';
}

// 代理法
Utils.deepClone = obj => {
    if (!Utils.isObject(obj)) {
        throw new Error('obj 不是一个对象！')
    }

    let isArray = Array.isArray(obj)
    let cloneObj = isArray ? [...obj] : { ...obj }
    Reflect.ownKeys(cloneObj).forEach(key => {
        cloneObj[key] = Utils.isObject(obj[key]) ? Utils.deepClone(obj[key]) : obj[key]
    })

    return cloneObj
}

/**
 * 从url上获取使用的授权版本
 * @returns 
 */
Utils.getVersionFromUrl = ()=>{
    let script = document.currentScript || (function() {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
    let uri = script.src
    //如果指定了版本，则直接使用指定版本的install
    return externalUtils.getUrlParams(uri)?.identity;
}

Utils.logError = error => {
    try{
        sinosdk.sino.putNativeCache({
            type: 'string',
            key: 'bplus_auth_error_msg',
            value: error + ' | time: '+new Date().getTime
        })
    }catch(e){
        console.warn(e)
    }
}

Utils.objToStr = obj => {
    try{
        if(Utils.isEmpty(obj)){
            return ''
        }
        return JSON.stringify(obj);
    }catch(e){
        console.warn('objToStr error: ' + e)
        return ''
    }
}
export default Utils