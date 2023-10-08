/**
 * 与app交互的jsbridge函数
 */

import external from "./external";


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
 * js调用 Native 获取用户差标信息
 * @export
 */
export async function GetCriterionFunction(data = {}) {
    //处理从银企通用户服务获取的差标数据，key值首字母调整为小写
    let res = await external.callHandler('GetTravelCriterionFunction', data)
    return external.jsonKeysToCase(res);
}
/**
 * js调用 Native 获取用户免审批信息
 * @export
 */
export async function GetSpecialFunction(data = {}) {
    //处理从银企通用户服务获取的差标数据，key值首字母调整为小写
    let res = await external.callHandler('GetSpecialCompetenciesFunction', data)
    return external.jsonKeysToCase(res);
}

/**
 * js调用 Native 获取用户预定日期
 * @export
 */
export async function GetReservationDateRangeFunction(data = {}) {
    //处理从银企通用户服务获取的差标数据，key值首字母调整为小写
    let res = await external.callHandler('GetReservationDateRangeFunction', data)
    return external.jsonKeysToCase(res);
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
 * js调用 Native confirm 弹窗
 * @export
 */

export function CommonDialogFunction(confirmJson,rightFunction,leftFunction,type){
    return external.callHandler('CommonDialogFunction', window.JSON.stringify(confirmJson)).then(function (data) {
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
 * js调用 Native Toast弹窗
 * @export
 */

export function ToastFunction(tips){
  return external.callHandler('ToastFunction',{
    toastData:tips,
    duration:0       //toast时长，只能是系统默认的2个类型 0: 短时间显示(2s);  1:长时间显示(3.5s)
  });
}

/**
 * js调用 Native PopMenu弹窗
 * @export
 */

export function PopMenuFunction(appData){
  return external.callHandler('PopMenuFunction',appData);
}

/**
 * js调用 Native 省市选择弹窗
 * @export
 */

export function SelectProvinceWidget(provinceListAll){
  return external.callHandler('SelectProvinceWidgetFunction', provinceListAll);
}

/**
 * js调用app查看附件预览接口
 * @export
 */
export function FilePreviewWidget(previemJson){
  return external.callHandler('PreviewFunction',previemJson);
}


/**
 * js调用 Native 时间选择弹窗
 * selectTimeJson
 * @export
 */

export function SelectTimeWidget(selectTimeJson){
  return external.callHandler('SelectTimeWidgetFunction', selectTimeJson);
}

/**
 * 增加app页面监听事件
 * @param {Object} appViewId        事件Id
 * @param {Object} appViewAction    app事件
 * @param {Object} appViewOperator  app显示
 * @param {Object} appViewName      app显示名称
 * @param {Object} func             回调函数
 */
export function addAppViewListener(appViewId,appViewAction,appViewOperator,appViewName,func){
  external.callHandler('addAppViewListener',{
    appViewId:appViewId,
    appViewAction:appViewAction,
    appViewOperator:appViewOperator,
    appViewName:appViewName
  });
  /**
   * 注册点击app按钮回调
   */
    external.registerHandler('appViewCallBack', function(data){
      if(func){
        func();
      }
    }.bind(this));
}

/**
 * 监听app菜单监听事件
 * @param {Object} menuList
 *  {
      List<MenuItem>  menuList;
    }

    MenuItem {
     String name;  //  如果是菜单，用name显示菜单文字
     String iconNormalBase64;  // 如果是图标按钮，用来显示 正常图标（JS交互时，用base64转码，如果图片超过5k，提出来让UI重新切图）
     String iconPressedBase64; // 如果是图标按钮，用来显示 按下效果 图标（JS交互时，用base64转码，如果图片超过5k，提出来让UI重新切图）
     String menuId;  //必填   菜单ID （不区分是 图标按钮 或是 菜单项），列表中的menuId必须相互唯一
     Int type;  // 必填 类型 1 ActionBar上的图标按钮，2 下拉菜单项 3 title显示（一般情况下，只有一个图标按钮，可以有多个下拉菜单项）
  }
   注意
    name 和 iconNormalBase64 至少需要填写一个；
    name 和iconNormalBase64 都有值时ActionBar上的按钮优先显示name，下拉菜单项会左边显示图标，右边显示name；
        当有多个type 为1的item时，app会取第一个值；
        下拉菜单项显示顺序默认按menuList的顺序排序；

 */
export function RegisterMenuFunction(menuList){
  
  external.callHandler('RegisterMenuFunction',menuList);
  
  external.registerHandler('clickMenuCallBack', function(data){
    var dataJson = JSON.parse(data);
      // 找出menuList中的与注册事件对应的函数并且执行
      if(menuList){
      //取对应的func执行 
      for(var i=0;i<menuList.length;i++){
        if(dataJson.menuId==menuList[i].menuId && menuList[i].func){
          menuList[i].func();
          break;
        }
      }
      }
    }.bind(this));
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
 * OpenActionFunction
 * @param {Object} str
 */
export function OpenActionFunction(str){
  return external.callHandler('OpenActionFunction',str);
}

/**
 * verifySignFunction
 * 验签调用函数，此处写为callHandler通用调用方法
 * @param {Object} fnt  接口名
 * @param {Object} signData   参数
 */
export function verifySignFunction(fnt,signData){
  return external.callHandler(fnt,signData);
}


//密码器相关调用

/**
 * 检测密码器是否插入  TPayGetDssStatusFunction “0”密码器已经插入    “-1”密码器未插入
 * @param {Object}
 */
export function TPayGetDssStatusFunction(){
  return external.callHandler('TPayGetDssStatusFunction','');
}

/**
   * 初始化密码器，返回mCode
   * ConnectDssBbFunction 已修改，不返回List<String> list
   */
export function ConnectDssBb(dev){
  return external.callHandler('ConnectDssBbFunction',dev);
}

  /**
   * 登录密码器
   * @param {Object} codeUserData
   */
export function LoginDss(codeUserData){
  return external.callHandler('LoginDssFunction',codeUserData);
}

/**
   * 修改口令
   * @param {Object} dssPswData
   */
export function ModifyDssPsw(dssPswData){
  return external.callHandler('ModifyDssPswFunction',dssPswData);
}
/**
   * 获取密码器付方账号列表
   * ConnectDssBbFunction 已修改，不返回List<String> list
   */
export function GetDssAccountList(){
  return external.callHandler('GetDssAccountListFunction','');
}
/**
  * 调用app计算支付密码
  * @param {Object} signData
  */
export function CalculatePassword(signData){
  return external.callHandler('CalculatePasswordFunction',signData);
}

/**
 * 添加密码器持有人
 * @param {Object} 
 */
export function SetDssUserFun(setUserData){
  return external.callHandler('SetDssUserFunction',setUserData);
}

/**
  * 调用app获取配置信息
  * @param {Object} signData
  */
  
export function GetAppConfigFunction(data={}){
  return external.callHandler('GetAppConfigFunction',data);
}

/**
 * 弹窗打开页面
 * @param {Object} url  //弹窗目标页面url
 */
export function popWindowFunction(targetUrl){
  external.callHandler('PopWindowFunction',window.JSON.stringify({url:targetUrl}));
}

/**
 * 获取签名
 */
export function SignDataFunction(data){
  return external.callHandler('SignDataFunction',data);
}
// 实时监听gps信息
export function LocationObserverFunction(data) {
    external.callHandler('LocationObserverFunction', data);
}
/**
 * 获取基本配置信息
 */
export function GetLocalDataFunction(data){
  return external.callHandler('GetLocalDataFunction',data);
}
/**
 * 注册推送
 */
export function registerCommonPushEvent(){
  external.callHandler('RegisterCommonPushFunction','');
}

/**
 * H5通知APP
 */
export function SendActionFunction(data){
  external.callHandler('SendActionFunction',data);
}

/**
 * 获取经纬度
 */
export function GetLocationFunction(){
  return external.callHandler('GetLocationFunction','');
}

/**
 * 调用地图接口
 */
export function MapFunction(data){
  return external.callHandler('MapFunction',data);
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

//处理转发
export function appSharePage(funName) {
    if(external.isPC()){
        return;
    }
  let options = [{
    name: '转发',
    menuId: '6',
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
  external.menuHandler.setMenu(options);
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
 * 伴正事数据埋点上报
 * @export
 */
export function notifyActionEventFunction(data={}){
    return external.callHandler('NotifyActionEventFunction', data);
}

/**
 * js调用 以小应用方式打开网页
 */
export function openAppletFunction(data = {}) {
    return external.callHandler('OpenAppletFunction', data);
}

/**
 * js调用 以第三方小应用方式打开网页
 */
export function openWebViewFunction(data = {}) {
    return external.callHandler('OpenWebViewFunction', data);
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
    });
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


//获取url中页面重定向次数数组
function _getRedirectionCnt(url) {
    let redirectionCnt;
    let redirectionCntRegRes = url.match(/[?|&]redirectionCnt=([^&]*)(&|$)/);
    if (redirectionCntRegRes) {
        redirectionCnt = JSON.parse(decodeURI(redirectionCntRegRes[1]));
    } else { 
        redirectionCnt = [];
    }
    return redirectionCnt;
}
/********************************alipay mpass兼容方法  end ************************/
