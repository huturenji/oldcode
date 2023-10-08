/**
 * 数据埋点配置
 * 日期：2020年9月9日
*/

/**
 * 资讯小应用信息
*/
const APPINFO = {
    appId:'268435720',
    appName:'资讯'
}
const EVENTTYPE = {
    click:'click',//点击事件包括输入、按钮点击
    systemEvent:'systemEvent',//请求业务处理结果事件
    eventHandler:'eventHandler',//进入/退出页面行为事件
    slide:'slide'//滑动页面行为事件，滑动事件包括上下滑动以及左右滑动
}
/**
 * 数据埋点配置
*/
export const pointDataConfig = {
    enter: {bisName: "进入资讯", eventBisMap:{
        load:{bisData:{eventType:EVENTTYPE.eventHandler,eventURI:'entryPage1',event:'bzs-zx-01',smallAppId:APPINFO.appId,smallAppName:APPINFO.appName}}
    }},
    exit: {bisName: "退出资讯", eventBisMap:{
        unload:{bisData:{eventType:EVENTTYPE.eventHandler,eventURI:'entryPage1',event:'bzs-zx-02',smallAppId:APPINFO.appId,smallAppName:APPINFO.appName}}
    }},
    read: {bisName: "阅读", eventBisMap:{
        click:{bisData:{eventType:EVENTTYPE.click,eventURI:'entryPage1',event:'zx-wz-01',smallAppId:APPINFO.appId,smallAppName:APPINFO.appName}}
    }},
    like: {bisName: "点赞", eventBisMap:{
        click:{bisData:{eventType:EVENTTYPE.click,eventURI:'entryPage1',event:'zx-wz-02',smallAppId:APPINFO.appId,smallAppName:APPINFO.appName}}
    }},
    hate: {bisName: "点踩", eventBisMap:{
        click:{bisData:{eventType:EVENTTYPE.click,eventURI:'entryPage1',event:'zx-wz-05',smallAppId:APPINFO.appId,smallAppName:APPINFO.appName}}
    }},
    favorite: {bisName: "收藏", eventBisMap:{
        click:{bisData:{eventType:EVENTTYPE.click,eventURI:'entryPage1',event:'zx-wz-03',smallAppId:APPINFO.appId,smallAppName:APPINFO.appName}}
    }},
    share: {bisName: "分享", eventBisMap:{
        click:{bisData:{eventType:EVENTTYPE.click,eventURI:'entryPage1',event:'zx-wz-04',smallAppId:APPINFO.appId,smallAppName:APPINFO.appName}}
    }}
    // indexScroll: {bisName: "首页列表滚动", eventBisMap:{
    //     scroll:{bisData:{smallAppId:APPINFO.appId,smallAppName:APPINFO.appName}}
    // }},
}

//1.全局多次注册，需要保证唯一；
//2.系统级的事件如加载、刷新也需要支持监听；
//3.使用统一的config控制组件的加载；
//4.监听白名单；
//5.监听维度、精度问题；