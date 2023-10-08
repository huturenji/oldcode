import * as bridge from "sino/bridge/lib/handler";
import utils from 'sino/common/utils'
import constant from 'sino/constant'
export default {
    /**
     * 获取网络信息
     * @returns retCode	int	是	业务返回状态：0：成功；!0：失败
                msg	String	否	业务状态信息
                contectState	boolean	是	false： 未连接；true ：已连接
                netType	int	是	0：默认值无意义；1：WIFI；2：数据
                macAddress	String	是	网络mac地址 netType为1时必选
                netName	String	是	网络名称 netType为1时必选
                ip	String	是	ip地址
    */
    getNetInfo() {
        return bridge.callHandler('CheckNetWorkFunction')
    },

    /**
     * 调用Native 打电话(原名callNativeTel)
     * @param {Object} tel 电话号码
     */
     callTel(tel){
        var Json = {
            action:'ACTION_DIAL',
            dataList: [{key:'tel',value:String(tel),type:"uri"}],
            responseKeyList:[{key:'',value:'',type:'string'}]
        };
        return bridge.callHandler('OpenActionFunction',Json);
    },

    /**
     * 获取app配置信息(原名GetAppConfigFunction)
     * @param {*} data 
     * @returns 
     */
    getAppInfo(data = {}) {
        return bridge.callHandler('GetAppConfigFunction', data);
    },

    /**
     * 打开/关闭位置监听的开关。（原名offLocation）
     * @param {*} data 
     */
    switchLocationObserver(data) {
        bridge.callHandler('LocationObserverFunction', data);
    },

    /**
     * 监听实时位置变化
     * @param {*} func 
     */
    onLocationChange(func){
        bridge.registerHandler('LocationNotify', result=>{
            func(result)
        });
    },

    /**
     * 主动获取实时定位（原名GetLocationFunction）
     * @returns 
     */
    getLocationFunction(data=''){
        return bridge.callHandler('GetLocationFunction',data);
    },
    
    /**
     * 打开第三方地图应用（原名MapFunction）
     * @returns 
     */
    openThirdMapApp(data){
        return bridge.callHandler('MapFunction',data);
    },

    /**
     * 
     * @param {*} data  {
     *                      type: 1:京东, 2:唯品会,//打开的类型
     *                      link //目标链接
     *                  }
     * @returns ret 0成功，非0表示失败
     */
    openThirdApp(data){
        return bridge.callHandler('OpenUnionPageFunction', data);
    },

    /**
     * 
     * @param {*} data  {
     *                      appId,//小应用id
     *                      url //小应用目标页
     *                  }
     * @returns ret 0成功，非0表示失败
     */
    openWXApplet(data){
        return bridge.callHandler('OpenWXAppletFunction', data);
    },

    /**
     * app切换到后台
     * @returns 
     */
    onAppPause(callback){
        return bridge.registerHandler('onAppPause', callback)
    },

    /**
     * app回到前台
     * @returns 
     */
    onAppResume(callback){
        return bridge.registerHandler('onAppResume', callback)
    },

    /**
     * 从app获取剪切板数据
     * @returns 
     */
    async readClipboard(){
        //1.2.5版本以下的安卓，不提供该方法（安卓有bug，有概率闪退）
        if(utils.getNavigatorType() == constant.NAVIGATOR_TYPE.ANDROID && utils.compareBizVersion('1.2.5') == -1){
            return {responseData: {content: null}};
        }
        let data = await bridge.callHandler('GetClipboardFunction');
        return data
    },

    /**
     * 清空剪切板数据
     */
    clearClipboard(callback){
        return bridge.callHandler('ClearClipboardFunction', callback)
    },

    saveImage(data){
        return bridge.callHandler('SaveQRCodeFunction', data)
    }
}