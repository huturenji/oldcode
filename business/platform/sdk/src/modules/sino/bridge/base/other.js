import * as bridge from "sino/bridge/lib/handler";
import utils from 'sino/common/utils'
import constant from 'sino/constant'

export default {

    /**
     * 执行app的底层功能（原名OpenActionFunction）
     * @param {*} str 
     * @returns 
     */
    execAction(str){
        return bridge.callHandler('OpenActionFunction',str);
    },

    /**
     * js调用 Native 获取用户差标信息(已弃用，老银行在adapter中单独实现)
     * @export
     */
    async getCriterion() {
        return {
            ret: constant.NO_BRIDGE_ERROR.RET,
            responseData: null
        }
    },
    
    /**
     * js调用 Native 获取用户免审批信息(已弃用，老银行在adapter中单独实现)
     * @export
     */
    async getSpecial() {
        return {
            ret: constant.NO_BRIDGE_ERROR.RET,
            responseData: null
        }
    },

    /**
     * js调用 Native 获取用户预定日期(已弃用，老银行在adapter中单独实现)
     * @export
     */
    async getReservationDateRange() {
        return {
            ret: constant.NO_BRIDGE_ERROR.RET,
            responseData: null
        }
    },

    /**
     * 打开通讯录（原名selectContact）
     * @param {*} IdArr 
     * @param {*} Model 
     * @param {*} checkedFlag 
     * @param {*} Key 
     * @returns 
     */
    contacts(IdArr, Model, checkedFlag, Key) {
        let sIdArr = IdArr || [];
        let sModel = Model || '0'; //默认为单选
        let sSelect = !checkedFlag ? 'selected_list_tpay' : 'selecting_list';
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
        return bridge.callHandler('OpenActionFunction', selectJson).then(function (data) { //调用app选择联系人窗口
            try {
                const list = JSON.parse(data[0].value);
                return list || [];
            } catch (e) {
                return [];
            }
        });
    },

    /**
     * 通过app获取用户头像（原名QueryUserIconFunction）
     * @param {*} data 
     * @returns 
     */
    userProfile(data = {}) {
        return bridge.callHandler('QueryUserIconFunction', data);
    },

    /**
     * 设置app的title栏（原名SetTitleBarThemeFunction）
     * @param {*} data 
     * @returns 
     */
    setTitleBar(data) {
        bridge.callHandler('SetTitleBarThemeFunction', data);//本方法无回调
        return true;
    },

    /**
     * 控制IOS底部的小横条悬浮，只有IOS生效
     * (实际上就是让webview铺满底部安全区域)
     * @returns safeAreaInsetBottom 安全区域高度
     */
    setHomeIndicatorSuspend(){
        return bridge.callHandler('SetTabBarSuspendFunction')
    },

    /**
     * Native 加密(原名EncryptionFunction)
     */
    encryption(data) {
        return bridge.callHandler('EncryptionFunction', data);
    },

    /**
     * Native 解密(原名DecryptionFunction)
     */
    decryption(data) {
        return bridge.callHandler('DecryptionFunction', data);
    },

    /**
     * 清除H5静态资源缓存(原名ClearWebViewCache)
     * @returns 
     */
    clearWebViewCache(){
        return bridge.callHandler('ClearWebViewCacheHandler','');
    },

    /**
     * 数据埋点上报（原名notifyActionEventFunction）
     * @param {*} data 
     * @returns 
     */
    dataTracking(data={}){
        return bridge.callHandler('NotifyActionEventFunction', data);
    },

    
    /**
     * 主动调起app分享功能（原名shareFunction）
     * @param {*} data 
     * @returns 
     */
    share(data = {}) {
        return bridge.callHandler('ShareFunction', data);
    },

    /**
     * 注册app的分享回调
     */
    registerShare(data = {}) {
        return bridge.callHandler('RegisterShareFunction', data);
    },

    /**
     * 获取app缓存数据(原名getPropertyFunction)
     * @export
     */
    getNativeCache(data = {}) {
        return bridge.callHandler('GetPropertyFunction', data);
    },

    /**
     * 设置app缓存数据（原名putPropertyFunction）
     * @export
     */
    putNativeCache(data = {}) {
        return bridge.callHandler('PutPropertyFunction', data);
    },

    /**
     * 选择上传的文件（mpass用）（原名chooseFileFunction）
     * @param {*} data 
     * @returns 
     */
    chooseFile(data={}){
        return bridge.callHandler('ChooseFileFunction', data);
    },
    
    /**
     * 通过app上传多个文件到BOS（mpass用）（原名multiUploadFunction）
     * @param {*} data 
     * @returns 
     */
    upload(data={}){
        return bridge.callHandler('MultiUploadFunction', data);
    },
    
    /**
     * 打开小应用(原名openH5Url)
     * @param data 
     * {
     *   appId	String	(require)	要打开的应用id，默认打开应用首页
     *   url	String	打开应用的目标页面url，参数携带在url上，url支持多种形式: 绝对路径、相对路径、通配符
     * }
     */
    async openApplet(data) {
        return await bridge.callHandler('OpenAppletFunction', data);
    },

    /**
     * 关闭小应用
     * @param {*} data 关闭后带给opener页面的数据
     */
    closeApplet(data){
        return bridge.callHandler('CloseAppletFunction', data);
    },

    /**
     * 打开第三方页面(原名OpenWebViewFunction)
     * 这种打开的页面，回退按钮的默认行为和浏览器一致（有历史先回退历史，无历史关闭页面）
     * @param {*} data 
     */
    async openThirdApplet(data) {
        return await  bridge.callHandler('OpenWebViewFunction', data);
    },

    /**
     * 文件预览（原名FilePreviewWidget）
     */
    filePreview(previemJson) {
        return bridge.callHandler('PreviewFunction', previemJson);
    },

    /**
     * 页面被激活。 通常用于a打开b，b关闭后a被激活的场景
     * @param {*} cb 
     */
    pageActived(cb){
        bridge.registerHandler('refreshPage', function(data){
            cb && cb(data);
        });
    },
    
    /**
     * IOS通知app允许在异步回调中打开一个新窗口
     */
     overwriteWindowopen(){
        if(utils.getNavigatorType() == constant.NAVIGATOR_TYPE.IOS){
            bridge.callHandler('OverwriteWindowopenFunction', {}); 
        }
    },

    /**
     * 用户是否已登录
     * @returns 
     */    
    async isLogined() {
        let res = await bridge.callHandler('GetUserStatusFunction');
        //没有这个方法，当做是已登录
        if(utils.isEmpty(res) || res.ret == constant.NO_BRIDGE_ERROR.RET){
            if(utils.isInSinoEnv()){
                return {
                    ret: 0,
                    responseData: {
                        status: 1
                    }
                }
            }
        }
        return res;
    },

    /**
     * 拉起app登录页面（基线没有这个方法，直接返回成功）
     * @returns 
     */
    async login(){
        return {
            state: 1
        }
    },

    /**
     * 获取bridge的type类型，用来区分是sino bridge、mpaas bridge、tmf bridge、cherry bridge
     */
    getBridgeType(){
        return bridge.getBridgeType();
    },

    /**
     * app的分享面板
     * @returns 
     */
    sharePanel(callback){
        return bridge.callHandler('PanelShareFunction', callback)
    },

    /**
     * 通过jsbridge获取userAgent
     * 某些融合app（比如大连银行的IOS）的原生userAgent不会按标准来，因此需要多加一层处理：通过jsbridge获取userAgent并再判断一次
     * @returns 
     */
     getUserAgentFromJsBridge(){
         return new Promise(async resolve => {
            //先判断浏览器自带的UA是否含有bizmate参数，如果有，则直接使用浏览器的
            let versionArr = ((window.navigator.userAgent.match(/[^\/]+$/)||[])[0]||'').split(' ');
            if(versionArr.length > 2 && versionArr[2].toUpperCase() == utils.BIZMATE_NAME){
                resolve(window.sinoUserAgent = window.navigator.userAgent);
                return;
            }
            let agentFromJsbridge = null;
            //防止老银行不返回404导致页面卡死，因此做超时处理
            //超时时间暂定如下数值，如有问题需要根据情况调整时间长短（对于app来说这是个同步方法，耗时主要在与app通信上）
            let timeInter = setTimeout(()=>{
                resolve('');
            }, 100)
            let data = await bridge.callHandler('GetUserAgentFunction')
            clearInterval(timeInter)
            if(data.ret == constant.NO_BRIDGE_ERROR){
                resolve('');
                return
            }
            agentFromJsbridge = data.responseData ? data.responseData.userAgent : ''
            utils.isNotStrictEmpty(agentFromJsbridge) && (window.sinoUserAgent = agentFromJsbridge)
            resolve(agentFromJsbridge);
        })
    },

    /**
     * 获取企业的认证&签约状态
     * @returns 
     */
    async getCompanyStatus(){
        let response = bridge.callHandler('GetCompanyStatusFunction');
        try{
            if(Object.prototype.toString.call(response) == '[object String]'){
                response = JSON.stringify(response)
            }
        }catch(e){}
        return response
    },

    /**
     * 获取企业详细信息
     * @returns 
     */
    getCompanyDetail(param){
        return bridge.callHandler('QueryCompanyDetailFunction', param)
    },

    /**
     * 页面加载事件
     */
    onSdkLoad(callback){
        callback && callback();
        //删除指定缓存
        let trainKey = ['_historyStation','trainCitys','_indexTrainJson', 'trainPolicy', 'Banning'];
        let newsKey = ['_MEDIA_H5_newsList'];
        this.discardUnusedStorage([...trainKey, ...newsKey], true);
    },

    /**
     * 根据key删除未使用的storage
     * @param {} keys 
     * @param ignoreCase 是否忽略大小写进行匹配
     */
     discardUnusedStorage(keys, ignoreCase){
        try{
            if(utils.isEmpty(keys)){
                return;
            }
            if(utils.isString(keys)){
                keys = [keys];
            }
            //清空指定用户缓存
            Object.keys(localStorage).forEach(key=>{
                let _key = ignoreCase ? key.toLowerCase() : key;
                if(keys.some(target=>_key.indexOf(ignoreCase ? target.toLowerCase() : target)>-1)){
                    localStorage.removeItem(key);
                }
            })
        }catch(e){
            console.error(e);
        }
    },

    async _getAppName(){
        try{
            const response = await bridge.callHandler('GetAppConfigFunction', {key: 'appName'});
            return response.value
        }catch(e){
            return ''
        }
    }
}