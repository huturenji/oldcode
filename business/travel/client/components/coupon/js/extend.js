let {
    apiCallHandler, showToast,openPage,envHandler,getStorage,throttle,notifyAppBackEvent,reFreshPage,appBack,stateManager,primaryKey,ErrorCodeMap,showConfirm,NoticeType
} = SnUtils;
var extendUtils = {
    apiCallHandler, showToast,openPage,envHandler,getStorage,throttle,notifyAppBackEvent,reFreshPage,appBack,stateManager,primaryKey,ErrorCodeMap,showConfirm,NoticeType
}

/**
 * http请求配置
 */
extendUtils.HTTP_CONT = {
    ORIGIN:window.location.origin//域名
}

//TODO 上述代码已无用，需要引入platform

export default extendUtils;
