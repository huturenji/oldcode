/*
 * @Descripttion: 浏览器注册menu
 * @version: 
 * @Author: yg
 * @Date: 2020-09-28 08:36:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-11-12 16:06:57
 */
// 顶部导航menu注册类
import {callHandler,registerHandler} from 'src/jsbridge/bridge-core';

class registerMenu {
    constructor(){
        this.menuList = [];
        this.observerTitle();//监听title变化 目前该位置的observerTitle只针对TMF平台有效果。因为TMF平台不支持原生的document.title。T信和mpass都支持原生的document.title
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
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        var MutationObserverConfig={
            childList: true,
            subtree: true,
            characterData: true
        };
        var observer = new MutationObserver(function(mutations){
            that.setTMFTitle();//设置TMF下title，TMF不支持document.title方法，需要调用TMF下的setmenu方法设置title
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
        if(window.TMFJSBridge){//如果window下存在TMFJSBridge，则直接设置menu，否则监听TMFJSBridgeReady事件后在设置menu
            that.setMenu([titleMenu]);
        }else{
            document.addEventListener('TMFJSBridgeReady',()=>{
                that.setMenu([titleMenu]);
            }, false);
        }
    }
}

export const menuHandler =  new registerMenu();