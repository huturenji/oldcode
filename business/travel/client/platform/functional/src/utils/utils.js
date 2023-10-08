/**
 * 常用工具类
 */

import external from "./external";
import constant from '../constant'
import ThemeManager from '../themeManager'
const extendUtils = {};

const CHUXING_ENTRY = 'chuxing'
//设置机票、酒店的入口类型是“出行”
if (external.getUserPara('entryType') == CHUXING_ENTRY){
    external.setStorage('travelEntryType', CHUXING_ENTRY)
}

extendUtils.isChuXingEntry = () => {
    return external.getStorage('travelEntryType') == CHUXING_ENTRY
}


/*** 
* 重写openPage的方法
*/
extendUtils.openPage = (ur, oFlag, target) => {
    let url = extendUtils.urlProxy(ur, constant.USER_CONFIG.URL_STABLE_PARAMS);
    
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

/**
 * 是否在iframe中运行
 */
extendUtils.isInSameOriginFrame = () => {
    try {
        return window.parent.location.origin == window.self.location.origin && window.parent && window.parent != window.self;
    } catch (e){
        return false
    }
}

/**
 * iframe中不能直接关闭页面，而是发送消息让父框架处理
 */
extendUtils.closePage = (url, step, loadData) => {
    if (extendUtils.isInSameOriginFrame()){
        sinosdk.sino.message.broadcastEvent(window.parent, 'closePage')
    } else {
        sinosdk.sino.back(url, step, loadData);
    }
}

/*** 
* 代理swp-utils里面的urlProxy方法
* @param toUrl string 跳转的url的path
* @param URL_STABLE_PARAMS Array  url上需要的固定参数
*/
extendUtils.urlProxy = (toUrl) => {
    return external.urlProxy(toUrl, constant.USER_CONFIG.URL_STABLE_PARAMS)
}

/**
 * 根据给定的key和value，合并url中的参数。如果有则替换，没有则新增
 * 注：如果有路由，则合并路由后面的参数（即hash）
 */
extendUtils.assignUrlParam = (key, value, url=location.href)=>{
    //合并参数
    function assign (urls){
        let index = urls.indexOf('?');
        if (index==-1){
            return urls + '?' + key + '=' + value;
        }
        let urlArr = urls.split('?');
        let params = urlArr[1].split('&');
        let exit = false;//url中是否存在这个key
        params = params.map(keyValues=>{
            let arr = keyValues.split('=');
            if (key == arr[0]){
                exit = true;
                return keyValues = key + '=' + value;
            }
            return keyValues;
        })
        //不存在则新增
        if (!exit){
            params.push(key + '=' + value);
        }
        return urlArr[0] + '?' +params.join('&');
    }
    //判断是否有路由
    let hashIndex = url.indexOf('#');
    if (hashIndex==-1){
        return assign(url);
    }
    let hash = url.substring(hashIndex, url.length);
    return url.substring(0, hashIndex) + assign(hash)
    
}

/**
 * 通过检查jsbridge函数是否存在来判断当前版本app是否支持idToken
 */
extendUtils.noIdToken = function(){
    return new Promise(resolve => {
        sinosdk.sino.getIdToken().then(res=>{
            //idToken放window下，避免业务中频繁异步获取
            if (res.idToken){
                window.idToken = res.idToken;
            }
            resolve(res.ret=='404');
        }).catch(()=>{
            resolve(true);
        });
    })
}
extendUtils.isNotEmpty = para => {
    return para!=null && para!='null' && para!='undefined' && para!=undefined
}

extendUtils.isEmpty = para => {
    return !extendUtils.isNotEmpty(para);
}
extendUtils.decodeToken = str => {
    try {
        str = str.split('.')[1];
        str = str.replace('/-/g', '+');
        str = str.replace('/_/g', '/');
        switch (str.length % 4)
        {
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
    } catch (e){
        console.error(e);
        return null;
    }
}
/**
 * 该方法在授权组件中已移除。
 * @param {*} url 
 * @param {*} param 
 */
extendUtils.authInterceptor = (param)=>{
    return Promise.resolve(param);
}

/**
 * 将json的key值首字母进行大小写转换
 * @param {Object} json
 * @param {Object} type： 默认不传 ==>首字母小写;传1 ==>首字母大写
 */
extendUtils.jsonKeysToCase = (json,type)=>{
    try {
        if (typeof json == 'object'){
            var tempJson = JSON.parse(JSON.stringify(json));
            toCase(tempJson);
            return tempJson;
        }
        return json;
        
        function toCase(jsons){
            if (typeof jsons == 'object'){
                if (Array.isArray(jsons)){
                    jsons.forEach(function(item){
                        toCase(item);
                    })
                } else {
                    for (var key in jsons){
                        var item = jsons[key];
                        if (typeof item == 'object'){
                            toCase(item);
                        }
                        //处理参数格式去除Boolean类型key的is
                        if ('IsForever'==key){
                            jsons["forever"] = item;
                        }
                        delete(jsons[key]);
                        switch (type){
                        case 1:
                            //首字母大写
                            jsons[key.substring(0,1).toLocaleUpperCase() + key.substring(1)] = item;  
                            break;
                        default:
                            //首字母小写
                            jsons[key.substring(0,1).toLocaleLowerCase() + key.substring(1)] = item;  
                                
                            //todo 此处为了兼容伴正事将bizMateId转换为uaId orgId改为cpyId  同时删除bizMateId和orgId对应的key和value
                            jsons['uaId'] = jsons.bizMateId || jsons.uaId;
                            jsons['cpyId'] = jsons.orgId || jsons.cpyId;
                            delete(jsons['bizMateId']);
                            delete(jsons['orgId']);

                            break;
                                
                        }
                    }
                }
            }
        }
    } catch (e){
        return json;
    }
}

/**
 *
 * @param {Object} content      内容
 * @param {Object} rightFunction   右侧按钮点击事件
 * @param {Object} title        title
 * @param {Object} types        类型       1-单个按钮  2-两个按钮  3-多个按钮      默认为两个按钮
 * @param {Object} strLeftBtn   左侧按钮
 * @param {Object} strRightBtn  右侧按钮
 * @param {Object} leftFunction   左侧按钮点击事件
 * @param {Object} H5Flag       是否调用H5方法-目前没用到
 */
extendUtils.showConfirm = (content, rightFunction, types, strLeftBtn, strRightBtn, title, leftFunction) => {
    var type = types || 2; //默认两个按钮
  
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

extendUtils.getJsonFile = path => {
    return new Promise((resolve, reject)=>{
        var req = new XMLHttpRequest();
        req.open('GET', path, true);
        req.setRequestHeader('Accept', 'application/json');
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    try {
                        resolve(JSON.parse(req.responseText))
                    } catch (e){
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
    if (!!window.bslConfig){
        bslConfig = window.bslConfig;
    } else {
        bslConfig = window.bslConfig = await extendUtils.getJsonFile(constant.BSL_CONF.JSON_CONF);
    }
    return bslConfig;
}

extendUtils.getEnvConfig = async () => {
    let envConfig = {}
    if (!!window.envConfig){
        envConfig = window.envConfig;
    } else {
        envConfig = window.envConfig = await extendUtils.getJsonFile(constant.ENV_CONF.JSON_CONF);
    }
    return envConfig;
}

/**
 *兼容历史推送消息上大写开头参数
 */
extendUtils.toggleCases = () => {
    try {
        let afterurl = location.href;
        constant.NEED_TOGGLE_CASES.forEach((value)=>{
            let reg = new RegExp(value, "g");
            let after = value.substring(0,1).toLocaleLowerCase() + value.substring(1);
            afterurl = afterurl.replace(reg, after);
        })
        history.replaceState(null,null,afterurl)
    } catch (e){
        console.error(e);
    }
}

/**
 * 获取可用的因公因私配置
 */
extendUtils.useTypeConfig = async ()=>{
    let useType = ''
    if (constant.ENABLE_USE_TYPE){
        useType = [constant.USE_TYPE_ENUM.PUBLIC.name, constant.USE_TYPE_ENUM.PRIVATE.name];//默认值
        await extendUtils.authInterceptor();
        //cpyId为-1时只有因私
        let userInfo = authorization.getUserInfo();
        if (userInfo.companyId=='-1'){
            useType = [constant.USE_TYPE_ENUM.PRIVATE.name];
        }
    }
    
    return {
        //获取默认（如果有多个）
        default(){
            if (!constant.ENABLE_USE_TYPE){ //默认如果没有因公因私功能的话 默认是因私（为了和服务端对齐）
                return constant.USE_TYPE_ENUM.PRIVATE.name;
            }
            return !!useType && useType.length>0 ? useType[0] : null;
        },
        isPrivate(value = useType){
            if (!constant.ENABLE_USE_TYPE){
                return true;
            }
            return value.indexOf(constant.USE_TYPE_ENUM.PRIVATE.name)>-1
        },
        isPublic(value = useType, use_type_scene){
            if (!constant.ENABLE_USE_TYPE){
                if (use_type_scene == constant.USE_TYPE_SCENE.ORDER_ADD_TRIPNO){ //下单页是否需要行程tripNo，作为下单的参数 use_type_scene传1
                    return true;
                } else if (use_type_scene == constant.USE_TYPE_SCENE.ORDER_ADD_INVOICE){ //下单页是否需要打开开发票的开关，作为下单的参数 use_type_scene传2
                    return true;
                } else if (use_type_scene == constant.USE_TYPE_SCENE.TRIP_LIST_CHOOSE){ //车次详情页选择行程 use_type_scene传3
                    return true;
                }
                return false;
            }
            return value.indexOf(constant.USE_TYPE_ENUM.PUBLIC.name)>-1
        },
        isBoth(value = useType){
            if (!constant.ENABLE_USE_TYPE){ //去掉因公因私的话，此时isBoth都返回false
                return false;
            }
            return value.indexOf(constant.USE_TYPE_ENUM.PUBLIC.name)>-1 && value.indexOf(constant.USE_TYPE_ENUM.PRIVATE.name)>-1
        }
    };   
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
     * 获取渠道id
     */
extendUtils.getChannelId = async()=>{
    try {
        let data = await sinosdk.sino.getAppInfo({key: 'tid'});
        return data && data.value;
    } catch (e){
        console.error(e);
    }
}

/*
 * 根据供应商id自动加载主题
 */
extendUtils.autoLoadTheme = async (theme, themeConfig) => {
    if (!theme && theme!=0){
        theme = extendUtils.getChannelId;
    }
    let themeManager = new ThemeManager(themeConfig)
    switch (theme){
    case 'demo':
        themeManager.load('demo');
        break;
    default:
        break;
    }
}

extendUtils.isBossPay = payType=>{
    return (!!payType && payType.indexOf('_BOSS_PAY')>-1) || payType.indexOf('_INBANK_PAY')>-1
}

/*
 * 刷新页面并清除缓存
 */
extendUtils.reloadWithNoCache = () => {
    //tudo目前清理缓存会导致router的history被清导致router的back无效，后续处理好后在调整此处逻辑
    // ClearWebViewCache();
    external.reloadPage();
}

/**
 * 获取app用户字号缩放值并设置页面缩放
 */
extendUtils.setFontScale = ()=>{
    try {
        sinosdk.sino.getAppInfo({key:'fontScale'}).then((res)=>{
            let MIN_PC_WIDTH = 616;
            if (!!res.value&&''!=res.value&&0!=res.value && document.documentElement.clientWidth < MIN_PC_WIDTH){
                document.documentElement.style.fontSize=((res.value*10000/750)+'vw')
            }
        })
    } catch (e){
        console.error(e);
    }
}

/**
 * 高德地图web定位
 * 需在业务侧引入高德地图js
 * @param complete成功回调
 * @param error失败回调
 */
extendUtils.geoLocationByGaode = (complete, error) => {
    AMap.plugin('AMap.Geolocation', function () {
        let amapGeolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：无穷大
            maximumAge: 0, //定位结果缓存0毫秒，默d认：0
            convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: false, //显示定位按钮，默认：true
            showMarker: false, //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy:true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        })
        amapGeolocation.getCurrentPosition()
        AMap.event.addListener(amapGeolocation, 'complete', onComplete)
        AMap.event.addListener(amapGeolocation, 'error', onError)
        function onComplete (data) {
            // data是具体的定位信息
            let point = extendUtils.gaoDeToBaidu(data.position.lng, data.position.lat);
            let res = {
                type:data.type,
                point: point,
                address_detail: {
                    city: data.addressComponent.city
                },
                address:data.formattedAddress,
                addressObj:data
            }
            complete(res)
        }
        function onError (data) {
            error(data)
            // 定位出错
        }
    })
}
/**
   * 高德转百度坐标
   * @param {Object} gd_lon
   * @param {Object} gd_lat
   */
extendUtils.gaoDeToBaidu = (gd_lon, gd_lat) => {
    let point = {};
    /* eslint-disable */
    let PI = 3.14159265358979324 * 3000.0 / 180.0;
    /* eslint-enable */
    let x = gd_lon,
        y = gd_lat;
    let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * PI);
    let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * PI);
    point.x = z * Math.cos(theta) + 0.0065;
    point.y = z * Math.sin(theta) + 0.006;
    return point;
}

/**
 * 百度转高德坐标
 * @param {Object} gd_lon
 * @param {Object} gd_lat
 */
extendUtils.baiduToGaode = (bd_lng, bd_lat) => {
    var X_PI = Math.PI * 3000.0 / 180.0;
    var x = bd_lng - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return { lng: gg_lng, lat: gg_lat }
}

/*****************************获取定位，使用app提供的定位API获取定位 start***************/
/**
 * 获取定位信息
 * 1.app方法获取定位分为getLocationFunction，locationNotify，locationObserver；
 * 2.getLocationFunction为单次获取定位，直接调用即可，部分银行app单独调用会失败（例如北京银行2022-2-25之前的版本）；
 * 3.locationNotify，locationObserver为成对使用，持续获取位置信息，先调用locationObserver通知app开启定位，然后通过locationNotify持续获取回调，还可通过locationObserver方法关闭定位；
 * 4.首次安装app并进入需要获取用户授权获取定位信息，部分老版本app只能通过locationObserver方才才能触发授权；
 * @param {Object} onComplete  成功回调
 * @param {Object} onError     失败回调
 */
extendUtils.geoLocation = (onComplete, onError) => {
    let webMapLocation = extendUtils.geoLocationByGaode;
    
    if (external.isPC()) {
        console.log('pc client location')
        webMapLocation(onComplete, onError);
        return;
    }
    try {
        //2022-2-25兼容老银行，这里采用多种方式定位，业务侧成功获取到后不再接受后续的回调数据，下面的方法的顺序不能改，如果先调用LocationObserver，再调用GetLocationFunction，GetLocationFunction会返回低精度且缺失city的数据导致定位失败
        //使用浏览器定位不准，将定位修改为调用app方法
        sinosdk.sino.getLocationFunction().then((result)=>{
            console.log('GetLocationFunction is success')
            _location(result,'GetLocationFunction');
        });
        sinosdk.sino.onLocationChange((result)=>{
            console.log('LocationNotify is successs');
            _location(JSON.parse(result),'LocationNotify');
        });
        sinosdk.sino.switchLocationObserver({observerType: 0});
    } catch (e) {
        console.error('catch app location is fail api location start')
        webMapLocation(onComplete, onError);
    }

    function _location(result,type){
        if (result.retCode == 0 && 0!==result.data.longitude) {
            let resData = result.data || {};
            let point = extendUtils.gaoDeToBaidu(resData.longitude, resData.latitude);
            let data = {
                type:type,
                point: point,
                address_detail: {
                    city: resData.cityName
                },
                address:resData.regionName,
                addressObj:resData
            }
            onComplete(data);
        } else {
            console.error('app location is fail on error')
            webMapLocation(onComplete, onError);
        }
    }  
}
/**
 * 关闭定位
 */
extendUtils.offLocation = () => {
    sinosdk.sino.switchLocationObserver({observerType: 1});
}

/**
 * js调用 Native 获取用户差标信息
 * @export
 */
extendUtils.GetCriterionFunction = async (data = {}) => {
    //处理从银企通用户服务获取的差标数据，key值首字母调整为小写
    return extendUtils.jsonKeysToCase(await sinosdk.sino.getCriterion(data))
}

/**
 * js调用 Native 获取用户免审批信息
 * @export
 */
extendUtils.GetSpecialFunction = async (data = {}) => {
    //处理从银企通用户服务获取的差标数据，key值首字母调整为小写
    return extendUtils.jsonKeysToCase(await sinosdk.sino.getSpecial(data))
}

/**
 * js调用 Native 获取用户预定日期
 * @export
 */
extendUtils.GetReservationDateRangeFunction = async (data = {}) => {
    //处理从银企通用户服务获取的差标数据，key值首字母调整为小写
    return extendUtils.jsonKeysToCase(await sinosdk.sino.getReservationDateRange(data))
}
extendUtils.inBrowser = () => {
    return sinosdk.sino.getPlatform() == sinosdk.sino.constant.RUN_ENV.BROWSER;
}

export default extendUtils;
