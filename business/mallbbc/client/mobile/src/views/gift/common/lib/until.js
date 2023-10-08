import {isEmpty} from '@/utils/common.js'
import config from '@/common/lib/config'
import wxHandler from "@/components/wechat/handler";
/***
 * 构造鹅毛情分享微信小程序消息体
 */
export function getEmaoqingShareInfo(featherId, cardIndex){
    return new Promise(async (resolve) => {

        let shareEntryConfig = {
            path: "/views/gift/receive/index", // 鹅毛情小程序 领取礼物的路由path
            query: `featherId=${featherId}&cardIndex=${cardIndex}` // 鹅毛情小程序 领取礼物的路由query
        }; 

        let shareTransferConfig = {
            path: "/views/gift/share/index", //  鹅毛情小程序 领取礼物中转页的路由path
            query: `featherId=${featherId}&cardIndex=${cardIndex}` // 鹅毛情小程序 领取礼物中转页的路由path
        }
      
        sinosdk.sino.getAppInfo({'key':'msgSource'}).then(async res=> {
            let appInfo = JSON.parse(res.value);
            let callBackUrl = `${location.origin + location.pathname}#${shareEntryConfig.path}?featherId=${featherId}&cardIndex=${cardIndex}`; //伴正事分享鹅毛情地址
            let miniConfig = await wxHandler.getMiniConfig(config.WX_APPLET_TYPE_MALL); // 运营后台配置的渠道相关配置
            let wxSchemeData = {
                version: miniConfig.appletType, //微信小程序分享类型 正式版:0， 测试版:1， 体验版:2
                path: shareEntryConfig.path,
                query: shareEntryConfig.query,
                weixinAppletType: config.WX_APPLET_TYPE_MALL
            }
            // 伴正事分享鹅毛情的相关信息
            let shareData = {
                title : '鹅毛情', // 分享标题
                wxTitle: '', //分享小程序的title
                desc : '千里送鹅毛，一点小心意！', // 分享描述
                link : callBackUrl, // 分享链接
                imgUrl : `https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/card/${cardIndex}/share_bizmate.png`, // 分享图标,图片绝对地址  
                wxImgUrl: `https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/card/${cardIndex}/share.png`,
                appId: (appInfo.appId) || '268435729',//小应用Id
                appName: appInfo.appName || appInfo.whereMsgFrom || '比N家',//小应用名字,无合法appId时使用appName
                contentType: 'applet', // 分享类型,music、video、link、applet[小程序] ，不填默认为link
                path: `${shareEntryConfig.path}?${shareEntryConfig.query}`, //小程序页面路径；对于小游戏，可以只传入 query 部分，来实现传参效果，如：传入 "?foo=bar"
                wxSchemeData, //微信小程序scheme
                appletId: miniConfig.appletId, // 原始id
                appletType: miniConfig.appletType,
                shareMini: true, //是否需要分享小程序
                shareEntryConfig,
                shareTransferConfig
            }
            resolve(shareData);
        }).catch(e=> {
            console.log(e)
        })
    })
}

/***
 * 对外暴露的宿主app的name， 经沟通 如果没取到的话，用 “应用内” 咋样代替
 */
export function getAppInfo(){
    let defaultAppName = '应用内';
    let appInfo = getApp().globalData.appInfo;
    // 没有name 用应用内
    if (isEmpty(appInfo.name)){
        appInfo.name = defaultAppName;
    }
    // 没有logo 用默认的
    if (isEmpty(appInfo.logo)){
        appInfo.logo = "data:image/png;base64,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"
    }
    return appInfo;
}

