import * as bridge from "sino/bridge/lib/handler";
import utils from 'sino/common/utils'
import message from 'sino/postMessage'
export default {
    /**
     * 回退页面（原名goBackPage）
     * @param {Object} url  //目标页面url
     */
    back(url='', backSteps=1, loadData='') {
        return bridge.callHandler('goBackFunction', window.JSON.stringify({
            loadData: loadData,
            url: url,
            backSteps: backSteps
        }));
    },

    /**
     * 跳转页面
     * @param {Object} url
     */
    open(url) {
        return bridge.callHandler('openPage',url);
    },

    /**
     * 重定向页面
     * @param {Object} url
     */
    redirect(url) {
        window.location.href = url;
    },

    /**
     * 设置app按钮
     * @param {*} options 
     */
    setMenu(options){
        return bridge.menuHandler.setMenu(options)
    },
    /**
     * 是否显示app的返回按钮（针对PC端）(原名toggleReturnBtn)
     */
    showReturnBtn(show){
        if(!utils.isPC()){
            return;
        }
        let options = [{
            name: show ? 'true' : 'false',
            type: 4,
            menuId: 'returnBtn'
        }]
        return bridge.menuHandler.setMenu(options);
    },
    /**
     * 获取H5设置的app按钮
     * @param {*} options 
     */
    getMenu(){
        return bridge.menuHandler.getMenu()
    },

    /**
     * 页面回退事件（原名appBack）
     * @param {*} func 
     * @param {*} context 
     */
    onBack(func, context) {
        try{
            //如果在iframe中，不可注册app返回事件，改为由父iframe通知
            if(utils.isInSameOriginFrame()){
                window.removeBackEventHandler && window.removeBackEventHandler();//如果已注册过，需要先注销，防止多次注册
                window.removeBackEventHandler = message.addEventListener('appBack', func, context)
                return;
            }
            return bridge.callHandler('notifyAppBackEvent', ''), //调用app，通知返回事件
            bridge.registerHandler('notifyAppBack', function () { //点击app返回事件
                func.call(context);
            }.bind(this));
        }catch(e){
            console.warn(e);
        }
    },

    /**
     * 注销页面回退事件监听（原名UnregisterAppBackFunction）
     */
    removeBackListener(){
        if(utils.isInSameOriginFrame()){
            window.removeBackEventHandler && window.removeBackEventHandler();
            return;
        }
        return bridge.callHandler('UnregisterAppBackFunction');
    },

    /**
     * 刷新事件（原名reFreshPage）
     * @param {*} callback 
     * @returns 
     */
    onRefresh(callback){
        //如果在iframe中，不可注册app返回事件，改为由父iframe通知
        if(utils.isInSameOriginFrame()){
            message.addEventListener('appRefresh', callback)
            return;
        }
        let options = [{
            name: '刷新',
            menuId: '5',
            type: 2,
            func: callback
        }]
        return bridge.menuHandler.setMenu(options) 
    },

    /**
     * 子页面关闭事件（原名winCloseCb）
     * @param {*} callback 
     */
    onChildWindowClose(callback){
        bridge.callHandler('RegisterCommonPushFunction','');
        return bridge.registerHandler('refreshPage', function(data){
            callback && callback(data);
        }.bind(this));
    },
}