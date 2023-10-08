import apibase from 'libs/apibase.js';
import idleWatcher from 'libs/idlewatcher';
import injectErrorCode from '../errorcodehandler/base.js';
/**
 * 项目中不允许直接调用libs的对象。对apiBase的调用都在这里。
 * 项目的api封装类
 */
class BaseHandler {
    constructor() {
        this.initData();
    }
    /**
     * 初始化一些数据
     */
    initData() {
        var that = this;
        that.$keycloak = Vue.prototype.$keycloak || {};
        let tokenParsed = that.$keycloak.tokenParsed || {}
        that.userInfo = {
            mgrName: tokenParsed.given_name || "尊敬的管理员", //登录用户姓名
            userName: tokenParsed.preferred_username, //登录用户域账号
            userId: tokenParsed.sub, //用户ID
            mgrPhone: tokenParsed.phone_number, //用户手机号
        };
        //创建api对象
        that.apiClient = new apibase(true)
        //注入请求的全局配置
        injectErrorCode();
        //默认额URL地址，当从URLConfig取不到数据的时候，默认使用这个
        that.defaultUrl = "/travel";
    }
    /**
     * 退出登录
     */
    logOut() {
        idleWatcher.clearTimeoutFlag()
        //退出登录的时候，清理一下菜单的缓存
        window.sessionStorage.removeItem("menuList")
        this.$keycloak.logoutFn()
    }
    /**
     * 运营管理基础http请求方法,默认post
     * @param {*} url 
     * @param {*} param 
     * @param {*} method 
     */
    sendApiRequest(url, param, method, headerObj = {}) {
        let that = this
        //如果长时间不操作，则登出
        if (idleWatcher.checkTimeout()) {
            Vue.prototype.$iLoading.hide();
            Vue.prototype.$Modal.error({
                title: '提示',
                content: '<p>未登录或者登录已经超时，请重新登录</p>',
                onOk: () => {
                    that.logOut();
                },
            });
            return new Promise((rej)=>{
                rej()
            });;
        }
        idleWatcher.invoke();//记录操作

        let paramCopy = param && JSON.parse(JSON.stringify(param))

        let realUrl = url.indexOf("http") == 0 ? url : this.defaultUrl + url
        return this.apiClient.apiCallHandler(realUrl, paramCopy, { "method": method, headers: headerObj });
    }
};
export default BaseHandler;