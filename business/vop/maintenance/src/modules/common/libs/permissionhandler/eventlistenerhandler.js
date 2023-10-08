/**
 * 全局权限校验的方法
 * 日期：2020年9月9日
*/
import { globalAuthData } from './globalauthenum.js';
import utilshandler from "bislibs/utils";
import permissionManager from 'bislibs/permissionhandler'
class eventlistenerhandler {
    constructor() {
        //关注的事件列表
        // eslint-disable-next-line no-unused-expressions
        this.vueThis;
        this.listenerEvents = ['click', 'touchstart'];
        this.signKey = "globalsign";//必须全小写，渲染到dom上的会被内核统一转成小写
    }

    /**
     * 全局监听事件的初始化方法（捕获模式，避免被.stop阻止）
    * @param {*} param 
    */
    addEventListenerGlobal(vueThis) {
        let that = this;
        that.vueThis = vueThis;
        this.listenerEvents.forEach(function (item) {
            document.body.addEventListener(item, function handle(event) {
                let sign = that.getSignForEvent(event.srcElement);
                if (!!sign) {
                    that.JudgmentAuth(sign);
                }
            }, true);
        })
    }

    /**
     * 获取事件触发的对象的标记
     * @param ele dom对象 
    */
    getSignForEvent(ele) {
        let that = this;
        //当前dom有标记
        if (!!ele.attributes && 0 < ele.attributes.length) {
            let tempres = that.getObjKeyByList(that.signKey, ele.attributes);
            if (!!tempres) {
                return tempres;
            } else if (!!ele.parentElement) {
                return that.getSignForEvent(ele.parentElement);
            }
            return null;
            
        } 
        return null;
    }

    /**
     * 从json array 中获取指定key名的value
     * @param attrs dom对象 
    */
    getObjKeyByList(signKey, attrs) {
        let res = null;
        if (!!attrs && 0 < attrs.length) {
            for (var key in attrs) {
                if (attrs[key].name == signKey) {
                    return attrs[key].value;
                }
            }
        }
        return res;
    }

    /**
    * 判断是否有权限,JS 方法调用
    * @param sign 标记
     */
    hasAuth(sign) {
        let haveAuth = this.getOptionHaveAuth((globalAuthData[sign] && globalAuthData[sign].needAuthList) || []);
        return haveAuth
    }

    /**
    * 判断是否有权限
    * @param sign 标记
   */
    JudgmentAuth(sign) {
        let haveAuth = this.getOptionHaveAuth((globalAuthData[sign] && globalAuthData[sign].needAuthList) || []);
        if (!haveAuth) {
            utilshandler.showToast(((globalAuthData[sign] && globalAuthData[sign].name) || "") + "操作权限不足")
            event.stopPropagation();
            
        }
    }

    /**
     * 判断是否有操作所需的权限
     * @param needAuthList 标记
     */
    getOptionHaveAuth(needAuthList) {
        return permissionManager.hasAuth(needAuthList)
    }
}
export default new eventlistenerhandler();