//WX_APPLET_TYPE ：微信小程序的环境类型 1：巨拾惠小程序 2：鹅毛情小程序; 因为目前我们有两个小程序，服务端bizcloud服务在和微信服务交互的时候，要明确用哪个小程序的appid和appsecret
//APPID ：微信小程序的appid
const miniEnum = {
    "jushihui": {
        APPID: 'wx1ffbe06fa79b65fb',
        WX_APPLET_TYPE: '1',
        applicationId: 'jsh_wmp',
    },
    "emaoqing": {
        APPID: 'wxe13e3cd6f27a644c',
        WX_APPLET_TYPE: '2',
        applicationId: 'emq_wmp',
    }
}

export default miniEnum;