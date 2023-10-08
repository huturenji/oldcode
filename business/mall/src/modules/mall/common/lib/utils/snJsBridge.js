/**
 * 与app交互的jsbridge函数
 */

import external from "./external";

export function SetTitleBarThemeFunction(data){
    return external.callHandler('SetTitleBarThemeFunction', data);
}

export function GetIdTokenFunction(data){
    return external.callHandler('GetIdTokenFunction', data);
}

/**
 * js调用 Native 获取用户信息
 * fromStorage 表示从前端取数据,默认行为从APP取数据.
 * @export
 */
export function GetUserInfoFunction(data = {}, fromStorage) {
  return external.callHandler('GetUserInfoFunction', data);
}


/**
 * 注册推送
 */
 export function registerCommonPushEvent(){
  external.callHandler('RegisterCommonPushFunction','');
}

/**
 * js调用 Native 加解密
 * @export
 */
export function EncryptionFunction(data){
  return external.callHandler('EncryptionFunction', data);
}

export function DecryptionFunction(data){
  return external.callHandler('DecryptionFunction', data);
}




/**
 * js调用app查看附件预览接口
 * @export
 */
export function FilePreviewWidget(previemJson){
  return external.callHandler('PreviewFunction',previemJson);
}



/*
 * 调用app通知返回事件
 *
 * */

export function notifyAppBackEvent(){
  external.callHandler('notifyAppBackEvent','');
}



/**
 * 清除缓存
 * @param {Object}
 */
export function ClearWebViewCache(){
  external.callHandler('ClearWebViewCacheHandler','');
}

/**
 * app打开H5的小应用
 * @param data {Object}
 */
export function openApplet(data){
  return external.callHandler('OpenAppletFunction', data);
}


/**
 * OpenActionFunction
 * @param {Object} str
 */
export function OpenActionFunction(str){
  return external.callHandler('OpenActionFunction',str);
}




/**
  * 调用app获取配置信息
  * @param {Object} signData
  */
  
export function GetAppConfigFunction(data={}){
  return external.callHandler('GetAppConfigFunction',data);
}











/**
 * 打开选择人员通讯录
 * @param {Object} IdArr     人员Id集合
 * @param {Object} Model     通讯录模式  0-单选 1-多选
 * @param {Object} checkedFlag       选择模式  默认为人员选择后不显示 false selected_list_tpay，勾选显示人员 true selecting_list
 * @param {Object} Key       from_key  默认为9
 */
export function selectContact(IdArr,Model,checkedFlag,Key) {
    let sIdArr = IdArr || [];
    let sModel = Model || '0'; //默认为单选
    let sSelect = !checkedFlag?'selected_list_tpay':'selecting_list';
    let sKey = Key || 9;
    const selectJson = {
      action: 'IntentAction_SelectContactWithOrgListActivity',
      dataList: [{
          key: 'from_key',
          value: sKey,
          type: "int"
        },
        {
          key: 'select_model',
          value: sModel,
          type: "string"
        },
        {
          key: sSelect,
          value: window.JSON.stringify(sIdArr),
          type: "string"
        },
        {
          key: 'is_show_inactivated',
          value: false,
          type: "bool"
        }
      ],
      responseKeyList: [{
        key: 'addusers_tpay',
        value: '',
        type: 'string'
      }]
    };
    return OpenActionFunction(selectJson).then(function (data) { //调用app选择联系人窗口
      try {
        const list = JSON.parse(data[0].value);
        return list || [];
      } catch (e) {
        return [];
      }
    });
  }
  
/**
 * app返回
 * @param {Object} func  返回时触发的方法
 * @param {Object} context  func执行的上下文
 */
export function appBack(func, context) {
    try{
        external.callHandler('notifyAppBackEvent', ''); //调用app，通知返回事件
        external.registerHandler('notifyAppBack', function () { //点击app返回事件
            func.call(context);
        }.bind(this));
    }catch(e){
        console.error(e);
    }
}
//TODO   CheckNetWorkFunction方法直接使用catch来判断浏览器是否有该方法
/**
 * 获取网络状态
 * boolean contectState;//  false 未连接，true已连接
   int netType;// 1 WIFI，2是数据 0，默认值无意义
 */
export function CheckNetWorkFunction(param){
    return new Promise(function(res){
        getNetInfoFunction(param).then(data=>{
            res(!!data && !!data.contectState)
        }).catch(e=>{
            res(true)
        })
    });
};
/**
 * 获取网络信息
 */
export function getNetInfoFunction(param=''){
  return external.callHandler('CheckNetWorkFunction',param)
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
    external.callHandler('OpenActionFunction',Json).then(function(res){
      
    })
};

//处理单页刷新，替代T信默认刷新事件
export function reFreshPage(funName) {
    if(external.isPC()){
        return;
    }
  let options = [{
    name: '刷新',
    menuId: '5',
    type: 2,
    func: funName
  }]
  external.menuHandler.setMenu(options) 
}

/**
 * 是否展示T信的返回按钮
 * @param show
 */
export function toggleReturnBtn(show) {
  let options = [{
    name: show ? 'true' : 'false',
    type: 4,
    menuId: 'returnBtn'
  }]
  external.menuHandler.setMenu(options)
  
}
/**
 * A窗口打开B窗口，B窗口关闭时A窗口的回调
 */
export function winCloseCb(cb){
    registerCommonPushEvent();
    external.registerHandler('refreshPage', function(data){
        cb && cb(data);
    }.bind(this));
}


/**
 * IOS通知app允许在异步回调中打开一个新窗口
 */
export function overwriteWindowopen(){
    external.callHandler('OverwriteWindowopenFunction', {}); 
}

/**
 * js调用 Native 获取头像信息
 * @export
 */
export function QueryUserIconFunction(data = {}) {
    return external.callHandler('QueryUserIconFunction', data);
  }

export function GetSSOServerTGCFunction(){
  
}

/**
 * 获取app缓存数据
 * @export
 */
export function getPropertyFunction(data={}){
  return external.callHandler('GetPropertyFunction', data);
}

/**
 * 设置app缓存数据
 * @export
 */
export function putPropertyFunction(data={}){
  return external.callHandler('PutPropertyFunction', data);
}

/**
 * 伴正事分享
 * @export
 */
export function shareFunction(data={}){
    return external.callHandler('ShareFunction', data);
}

/**
 * 注册伴正事浏览器网页右上角菜单默认分享功能的数据
 * @export
 */
export function registerShare(data={}){
    return external.callHandler('RegisterShareFunction', data);
}


/*****************************获取定位，使用百度地图API获取定位 start***************/
/**
 * 获取定位信息  因为IOS使用多页导致无法使用百度地图WEB的API，使用请求代替
 * @param {Object} onComplete  成功回调
 * @param {Object} onError     失败回调
 */
export function geoLocation(onComplete, onError) {

    if (external.isPC()) {
      console.log('pc client location')
      BMapLocation(onComplete, onError);
      return;
    }
    try {
      //调异步方法获取定位权限 todo安卓后续会解除这个bug
      LocationObserverFunction({observerType: 0});
      external.registerHandler('LocationNotify', (result)=>{
        console.log('LocationNotify is successs');
        _location(JSON.parse(result),'LocationNotify');
      });
      //使用浏览器定位不准，将定位修改为调用app方法
      GetLocationFunction().then((result)=>{
        console.log('GetLocationFunction is success')
        _location(result,'GetLocationFunction');
      });
    } catch (e) {
      console.error('catch app location is fail api location start')
      BMapLocation(onComplete, onError);
    }

    function _location(result,type){
        if (result.retCode == 0) {
          let resData = result.data || {};
          let point = gaoDeToBaidu(resData.longitude, resData.latitude);
          let data = {
            type:type,
            point: point,
            address_detail: {
              city: resData.cityName
            },
            address:resData.regionName,
            addressObj:resData
          }
          external.isPC('lng', point.x);
          external.isPC('lat', point.y);
          onComplete(data);
        } else {
          console.error('app location is fail on error')
          BMapLocation(onComplete, onError);
        }
    }


  
  }
  /**
   * 百度地图定位
   * @param {Object} onComplete
   * @param {Object} onError
   */
  function BMapLocation(onComplete, onError) {
    console.log('BMap location is start')
    let url = 'https://api.map.baidu.com/location/ip?qt=loc&coor=bd09ll&ak=7bO37d1zSe1CM9UAoGBYnv5LIKPrWSGy&timeout=10000';
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'jsonp',
      data: {},
      success: function (r) {
        if (!!r && 0 == r.status) {
          let content = r.content || {};
          let point = content.point || {};
          onComplete(content);
          external.isPC('lng', point.x);
          external.isPC('lat', point.y);
        } else {
          onError(r);
        }
      }
    });urlProxy
  }
  
  /**
   * 高德转百度坐标
   * @param {Object} gd_lon
   * @param {Object} gd_lat
   */
  function gaoDeToBaidu(gd_lon, gd_lat) {
    let point = {};
    let PI = 3.14159265358979324 * 3000.0 / 180.0;
    let x = gd_lon,
      y = gd_lat;
    let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * PI);
    let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * PI);
    point.x = z * Math.cos(theta) + 0.0065;
    point.y = z * Math.sin(theta) + 0.006;
    return point;
  }
  /**
   * 关闭定位
   */
  export function offLocation(){
      LocationObserverFunction({observerType: 1});
  }
/*****************************获取定位，使用百度地图API获取定位 end***************/
