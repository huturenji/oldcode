import constant from '../constant/'
/**
 * 常用工具类
 */
const extendUtils = {}
/**
 * 判断是否PC端
 */
extendUtils.isPC = () => {
    return extendUtils.getNavigatorType()==constant.NAVIGATOR_TYPE.PC;
}

/**
 * 判断浏览器类型
 * return pc，android，ios
 */
extendUtils.getNavigatorType = () => {
    var userAgentInfo = window.navigator.userAgent;
    if(/android/i.test(userAgentInfo)){
        return constant.NAVIGATOR_TYPE.ANDROID;
    }else if(/(iPhone|iPad|iPod|iOS)/i.test(userAgentInfo)){
        return constant.NAVIGATOR_TYPE.IOS;
    }else if(/SymbianOS/i.test(userAgentInfo)){
        return constant.NAVIGATOR_TYPE.SYMBIAN;
    }else if(/Windows Phone/i.test(userAgentInfo)){
        return constant.NAVIGATOR_TYPE.WINPHONE;
    }else {
        return constant.NAVIGATOR_TYPE.PC;
    }
}

extendUtils.isEmpty = obj => {
    if(obj==null || obj==undefined){
        return true;
    }
    if(extendUtils.isString(obj)){
        return obj.replace(/\s/g, '') == '';
    }
    if(extendUtils.isArray(obj)){
        return obj.length == 0;
    }
    if(extendUtils.isObject(obj)){
        return Object.keys(obj).length == 0;        
    }
    return false;
}

extendUtils.isStrictEmpty = obj => {
    return extendUtils.isEmpty(obj) || obj == 'undefined' || obj == 'null'
}

extendUtils.isNotEmpty = obj => {
    return !extendUtils.isEmpty(obj);
}

extendUtils.isNotStrictEmpty = obj => {
    return !extendUtils.isStrictEmpty(obj);
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

/**
 * 获取当前url的参数
 */
extendUtils.getUrlParam = (key, url = window.location.href) => {
    let regexP = /[^#&\?]+=[^#&\?]*/ig;
    let res = {};
    var ms = url.match(regexP);
    if (ms) {
        for (var i = 0; i < ms.length; i++) {
        let arr = ms[i].split('=');
        res[arr[0]] = decodeURIComponent(arr[1]);
      }
    }
    if(extendUtils.isEmpty(key)){
        return res;
    }
    let _value = null;
    Object.keys(res).forEach(_key=>{
        if(key.toUpperCase() == _key.toUpperCase()){
            _value = res[_key];
        }
    });
    //如果当前url上拿不到，且当前页面在子frame。则尝试在top的url上再获取一次
    try{
        if(extendUtils.isEmpty(_value) && window.self != window.top && url != top.location.href){
            _value = getUrlParam(key, top.location.href)
        }
    }catch(e){}
    return _value!=null && _value!=undefined ? _value : null;
}

extendUtils.getBplusAppInfo = ()=>{
    let result = {}
    try{
        let content = '';
        Array.prototype.every.call(document.getElementsByTagName('meta'), meta=>{
            if(meta.getAttribute('name') == 'BPLUS-APP-INFO'){
                content = meta.getAttribute('content')
                return false;
            }
            return true;
        })

        content.split(',').forEach(c => {
            let arr = c.split('=');
            if(arr.length==1){
                result[c] = c;
            }else{
                result[arr[0]] = arr[1]
            }
        })
    }catch(e){
        console.warn(e);
    }
    return result;
}

/**
 * 两个字符串按一定长度拼接，中间补0
 * @param {*} prefix 
 * @param {*} suffix 
 * @param {*} length 
 * @returns 
 */
extendUtils.concatByZero = (prefix, suffix, length=9)=>{
    if(!length){
        return ''
    }
    if(extendUtils.isEmpty(prefix)){
        prefix = '';
    }
    if(extendUtils.isEmpty(prefix)){
        suffix = '';
    }
    length = length - String(prefix).length - String(suffix).length;
    return prefix + Array(length+1).join(0) + suffix;
}

  /**
 * 获取json文件
 * @param {Object} path json文件地址
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

/**加载js文件
 * @param {Object} data  //加载js文件的相关属性
 */
 let scriptLoader = {}
extendUtils.loadScript = async data => {
    if(!document.getElementById(data.id)){
        var script=document.createElement("script");
        script.setAttribute('id', data.id);
        script.type="text/javascript";
        script.src= data.src;
        
        //如果短时间内同时加载同一个js，则必须等待第一个js的onload执行完后，才能直接执行下一个的onload
        let scriptLoadedReslove = null;
        let scriptLoaded = new Promise(reslove=>{scriptLoadedReslove = reslove})
        script.onload = async function(){
            await data.onload();
            scriptLoadedReslove();
            delete scriptLoader[data.id];//执行完就删掉
        };
        scriptLoader[data.id] = scriptLoaded;

        document.getElementsByTagName('body')[0].appendChild(script);
    }else{
        let scriptLoaded = scriptLoader[data.id];
        //如果已加载了一个，则等待上一个执行完
        if(scriptLoaded){
            await scriptLoaded;
        }
        data.onload&&data.onload();
    }
}

/**
 * 获取app版本 例如 window.navigator.appVersion为5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36/sinosun 0.1.7 Bizmate 66 121
 * @param {*} param 扩展参数
 */
extendUtils.getAppVersion = param => {
    let userAgent = extendUtils.isNotStrictEmpty(window.sinoUserAgent) ? window.sinoUserAgent : window.navigator.userAgent;//优先级: 已存储的(window下公用) => 入参 => 从window.navigator下获取
    let versionArr = ((userAgent.match(/[^\/]+$/)||[])[0]||'').split(' ');
    if(5>versionArr.length){
      return null;
    }
    let res = {
      platform:versionArr[0],//平台名称，相当于渠道  例子中结果为sinosun
      version:versionArr[1],//app版本  例子结果为0.1.7
      product:versionArr[2],//产品名称 例子结果为Bizmate
      statusBarHeight:versionArr[3],//statusBar高度，单位为px 例子结果为66px
      titleBarHeight:versionArr[4]//titleBar高度，单位为px  例子结果为121px
    }
    if(param){
      return res(param);
    }else{
      return res;
    }
}
extendUtils.BIZMATE_NAME = 'BIZMATE'
extendUtils.DEFAULT_BIZMATE_VERSION = '1.2.8'  //默认bizmate版本，供特殊银行渠道UA使用
extendUtils.SPECIAL_UA = ['cobank'] //特殊银行渠道UA cobank:稠州商业银行
  /**
   * 获取bizmate的版本号 如果没有版本号则返回null
   */
extendUtils.getBizMateVersion = ()=>{
    let appVersion = extendUtils.getAppVersion() || {};
    if(extendUtils.BIZMATE_NAME==(appVersion.product||'').toUpperCase()){
        return appVersion.version;
    }
    //兼容特殊银行的UA 
    for (let index = 0; index < extendUtils.SPECIAL_UA.length; index++) {
        if(window.navigator.userAgent.toUpperCase().indexOf(extendUtils.SPECIAL_UA[index].toUpperCase())>-1){
            return extendUtils.DEFAULT_BIZMATE_VERSION
        }     
    }
    return null;
}

/**
 * 获取APP UA设置运行的平台 值为weboa_sino 则是websino
 * @returns 
 */
extendUtils.getAPPPlatform = ()=>{
    let appVersion = extendUtils.getAppVersion() || {};
    return appVersion.platform;
}
/**
 * 比较版本号
 * @param {*} target 
 * @returns 大于返回1，小于返回-1，相等返回0
 */
extendUtils.compareBizVersion = (target, currVersion = extendUtils.getBizMateVersion()) => {
    if(extendUtils.isEmpty(target) || extendUtils.isEmpty(currVersion)){
        return 1;
    }
    let currVerArr = currVersion.split('\.');
    let currLength = currVerArr.length;
    let targetArr = target.split('\.');
    let targetLength = targetArr.length;
    for(let i=0; i<targetLength; i++){
        //当前没有最后一个版本号，且目标版本号最后一位不是0。则必然比当前版本号大
        if(i>=currLength && targetArr[i]!=0){
            return -1;
        }
        //如果目标版号和当前版号相同则继续比较下一位
        if(targetArr[i] == currVerArr[i]){
            continue
        }
        return targetArr[i] < currVerArr[i] ? 1 : -1
    }
    return 0;
}

/**
 * 获取window对象
 * @param {*} type  sameOrigin: 获取同域的最顶层window(不一定是top)；diffOrigin: 获取第一个非同域的window对象(不一定是top)
 * @returns 
 */
extendUtils.getWindow = (type = 'sameOrigin') => {
    let _window, sameOrigin, diffOrigin = null
    _window = sameOrigin = self;
    if(_window != top){
        let loop = true;
        while (loop) {
            if(_window == top){
                loop = false;
            }
            try{
                //bizmate pc上iframe无跨域限制，因此用origin自行判断是否是同域
                if(_window.location.origin == parent.location.origin){
                    sameOrigin = _window;//同域最顶层window对象
                }else{
                    throw 'Blocked a frame with origin '+_window.location.origin+' from accessing a cross-origin frame.'
                }
            }catch(e){
                loop = false;
                diffOrigin = _window.parent;//不同域的第一层window对象
                break;
            }
            _window = _window.parent
        }
    }
    switch(type){
        case 'sameOrigin':
            return sameOrigin;
        case 'diffOrigin':
            return diffOrigin;
        default:
            return sameOrigin;        
    }
}

/**
 * 是否在Electron容器中
 */
extendUtils.isElectronH5Container = (_window)=>{
    try{
        return _window.frameElement && _window.frameElement.hasAttribute('ElectronH5Container')
    }catch(e){
        return false;
    }
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
 * 将参数放到url上
 */
extendUtils.setUserParamOnUrl = data => {
    try {
        let hash = extendUtils.isNotEmpty(location.hash) ? location.hash : '#/';
        let search = extendUtils.isNotEmpty(location.search) ? location.search.substring(1) : ''
        if (extendUtils.isNotEmpty(search)){
            hash += (hash.indexOf('?') > -1 ? '&' : '?') + search
        }
        hash = extendUtils.updateStableParams(hash, data)
        //更新url参数
        history.replaceState(window.history.state, '', location.origin + location.pathname + hash);
    } catch (e) {
        console.error('setUserParamOnUrl error!', e)
    }
}

/**
 * 更新url上的参数
 * @param {*} url 字符串中只能含有一个?。如果有2个?, 业务侧自己处理成1个再调用本方法
 * @param {*} data 待更新的参数
 * @returns 
 */
extendUtils.updateStableParams = (url, data) => {
    if (extendUtils.isEmpty(url) || extendUtils.isEmpty(data)){
        return url;
    }
    try {
        //删除最后一个/
        if (url.endsWith('/')){
            url = url.substring(0, url.length - 1)
        }
        let arr = url.split('?')
        let oldParamArr = []
        if (arr.length > 1){
            oldParamArr = arr[1].split('&');
        }
        let entries = oldParamArr.map(kv => {
            let kvArr = kv.split('=');
            return [[kvArr[0]], kvArr.length > 1 ? kvArr[1] : '']
        })
        let oldParaObj = Object.fromEntries(entries)
        Object.keys(data).forEach(key => {
            oldParaObj[key] = data[key];
        })
        arr[0] = arr[0] == '#' ? '#/' : arr[0];
        return arr[0] + '?' + Object.entries(oldParaObj).map(entry => `${entry[0]}=${entry[1]}`).join('&')
    } catch (e){
        console.error(e);
        return url
    }
}
export default extendUtils