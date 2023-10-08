import utils from 'sino/common/utils';
import constant from 'sino/constant'
import {callHandler,getBridgeType,registerHandler} from './bridge-core';
/*
 * @Descripttion: 浏览器注册menu
 * @version: 
 * @Author: yg
 * @Date: 2020-09-28 08:36:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-11-12 16:06:57
 */
// 顶部导航menu注册类
let _window = utils.getWindow();
let doc = _window.document
class registerMenu {
    constructor(){
        this.menuList = [];
        this.observerTitle();//监听title变化 目前该位置的observerTitle只针对TMF平台有效果。因为TMF平台不支持原生的document.title。T信和mpass都支持原生的document.title
        this.setWebOAMenu();
    }   

    /**
     * 注册jsbridge的menu方法，并且监听jsbridge的回调
     * @param {*} menuList 注册的menuList
     */
    registerMenu(menuList){
        callHandler('RegisterMenuFunction', menuList);
        registerHandler('clickMenuCallBack', function (data) {
            ('String'===Object.prototype.toString.call(data).match(/^\[object\s(.*)\]$/)[1])&&(data=JSON.parse(data))
            // 找出menuList中的与注册事件对应的函数并且执行
            if (menuList) {
                //取对应的func执行 
                for (var i = 0; i < menuList.length; i++) {
                    if (data.menuId == menuList[i].menuId && menuList[i].func) {
                        menuList[i].func.call();
                        break;
                    }
                }
            }
        });
    }
    /**
     * 设置menuList,与this.menuList进行去重合并
     * @param {Array} menuList 
     */
    setMenu(menuList){ 
        const res = new Map();
        this.menuList = [...menuList,...this.menuList].filter(//数组合并后，通过map进行去重
            item=>!res.has(item.menuId)&&res.set(item.menuId,1)
        );
        
        this.registerMenu(this.menuList);//调用jsbridge的设置menu方法
    }

    /**
     * 获取当前配置的menuList数据项
     */
    getMenu(){
        return this.menuList;
    }

    /**
     * 监听title变化
     */
    observerTitle(){
        const that = this;
        var titleEl = document.getElementsByTagName("title")[0];
        var MutationObserver = _window.MutationObserver || _window.WebKitMutationObserver;
        var MutationObserverConfig={
            childList: true,
            subtree: true,
            characterData: true
        };
        var observer = new MutationObserver(function(mutations){
            that.setTMFTitle();//设置TMF下title，TMF不支持document.title方法，需要调用TMF下的setmenu方法设置title
            that.setWebOATitle();//设置WEBOA下title，兼容ios不支持document.title方法
            that.setWebSinoTitle();//设置WEBSINO下title，兼容ios不支持document.title方法
        });
        observer.observe(titleEl, MutationObserverConfig);
    }
    /**
     * 设置TMF容器下页面title
     */
    setTMFTitle(){
        const that = this;
        let titleMenu = { 
            name: document.title,
            menuId: 'title',
            type: 3
        }
        if(_window.TMFJSBridge){//如果window下存在TMFJSBridge，则直接设置menu，否则监听TMFJSBridgeReady事件后在设置menu
            that.setMenu([titleMenu]);
        }else{
            doc.addEventListener('TMFJSBridgeReady',()=>{
                that.setMenu([titleMenu]);
            }, false);
        }
    }

    async setWebOATitle(){
        if(await getBridgeType() == constant.BRIDGE_TYPE.WEBOA){
            callHandler('SetTitleFunction', {title: document.title})
        }else{
            doc.addEventListener('WebOAJSBridgeReady', ()=>{
                callHandler('SetTitleFunction', {title: document.title})
            })
        }
    }

    async setWebSinoTitle(){
        if(await getBridgeType() == constant.BRIDGE_TYPE.WEBSINO){
            callHandler('SetTitleFunction', {title: document.title})
        }else{
            doc.addEventListener('WeboaWebViewJavascriptBridgeReady', ()=>{
                callHandler('SetTitleFunction', {title: document.title})
            })
        }
    }

    /**
     * webOA需要自己设置显示返回按钮
     * @returns 
     */
    async setWebOAMenu(){
        let that = this;
        if(await getBridgeType() != constant.BRIDGE_TYPE.WEBOA){
            return;
        }
        this.historyEvent();//自定义监听replaceState和pushState事件
        let setBackBtn = ()=>{
            if(that.menuList.indexOf(menu => menu.type == 4) ==-1){//不重复设置
                that.setMenu([{
                    name: 'true',
                    type: 4,
                    menuId: 'returnBtn'
                }])
            }
        }
        //路由改变时就显示返回按钮
        window.addEventListener('replaceState', function(e) {
            setBackBtn();
        });
        window.addEventListener('pushState', function(e) {
            setBackBtn();
        });
    }

    historyEvent(){
        const bindEventListener = function(type) {
            const historyEvent = history[type];
            return function() {
                const newEvent = historyEvent.apply(this, arguments);
                const e = new Event(type);
                e.arguments = arguments;
                window.dispatchEvent(e);
                return newEvent;
            };
         };
         history.pushState = bindEventListener('pushState');
         history.replaceState = bindEventListener('replaceState');
    }

}

export const menuHandler =  new registerMenu();