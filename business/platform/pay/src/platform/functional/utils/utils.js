/**
 * 常用工具类
 */

import external from "./external";
import {GetIdTokenFunction, bridgeOpenPage, CommonDialogFunction} from '../jsbridge'
import constant from '../constant'

const extendUtils = {};

/*** 
* 重写openPage的方法
*/
extendUtils.openPage = (url, oFlag, target) => {
    external.openPage(extendUtils.urlProxy(url), oFlag, target);
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
 * 通过检查jsbridge函数是否存在来判断当前版本app是否支持idToken
 */
extendUtils.noIdToken = function(){
    return new Promise(resolve => {
        GetIdTokenFunction().then(res=>{
            resolve(res.ret=='404');
        }).catch(e=>{
            resolve(true);
        });
    })
}
extendUtils.authorize = function(config){
    return new Promise(resolve=>{
        extendUtils.noIdToken().then(res=>{
            let getSrc = function(type){
                return constant.HTTP_CONT.ORIGIN + constant.APP_URL_MAP.swplib.path + constant.APP_URL_MAP.swplib.child[type].prefix + 
                (constant.APP_URL_MAP.swplib.child[type].version || '') + constant.APP_URL_MAP.swplib.child[type].entry;
            }
            if(!!res){
                external.loadScript({
                    src: getSrc('serverAuthOld'),
                    id: 'authOld',
                    onload: function(){
                        swpServiceAuth.install();
                        resolve();
                    }
                })
            }else{
                external.loadScript({
                    src: getSrc('serverAuth'),
                    id: 'auth',
                    onload: async function(){
                        Object.assign(constant.AUTH_CONFIG.loginKcConfig, await extendUtils.getJsonFile(constant.AUTH_CONFIG.loginKcConfigPath));
                        swpServiceAuth.install(Object.assign(constant.AUTH_CONFIG, config)).then(data=>{
                            window.authorization = data;
                            resolve();
                        })
                    }
                })
            }
        }).catch(e=>{
            console.error(e);
            resolve();
        })
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
 * 将json的key值首字母进行大小写转换
 * @param {Object} json
 * @param {Object} type： 默认不传 ==>首字母小写;传1 ==>首字母大写
 */
extendUtils.jsonKeysToCase = (json,type)=>{
    try{
        if(typeof json == 'object'){
            var tempJson = JSON.parse(JSON.stringify(json));
            toCase(tempJson);
            return tempJson;
        }else{
            return json;
        }
        function toCase(json){
            if(typeof json == 'object'){
                if(Array.isArray(json)){
                    json.forEach(function(item){
                        toCase(item);
                    })
                }else{
                    for (var key in json){
                        var item = json[key];
                        if(typeof item == 'object'){
                            toCase(item);
                        }
                        //处理参数格式去除Boolean类型key的is
                        if('IsForever'==key){
                            json["forever"] = item;
                        }
                        delete(json[key]);
                        switch (type){
                            case 1:
                                //首字母大写
                                json[key.substring(0,1).toLocaleUpperCase() + key.substring(1)] = item;  
                                break;
                            default:
                                //首字母小写
                                json[key.substring(0,1).toLocaleLowerCase() + key.substring(1)] = item;  
                                break;
                        }
                    }
                }
            }
        }
    }catch(e){
        return json;
    }
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
      CommonDialogFunction({ //调用native弹框方法
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
export default extendUtils;