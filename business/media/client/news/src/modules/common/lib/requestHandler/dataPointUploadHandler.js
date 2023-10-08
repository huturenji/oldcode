// import extendUtils from '../utils';

/**
 * 全局数据埋点方法
 * 日期：2020年9月9日
*/
class dataPointUploadHandler {
    constructor() {
        this.listenerEvents = ['click' , 'touchstart' , 'scroll'];//关注的事件列表
        this.signKey = "globalsign";//事件标记所用的key必须全小写，渲染到dom上的会被内核统一转成小写
        this.signData = "globalsigndata";//事件所需的数据，必须全小写，渲染到dom上的会被内核统一转成小写
    }

    /**
     * 全局监听事件的初始化方法（捕获模式，避免被.stop阻止）
	 * @param {*} param 
    */
    dataPointUploadEventListener() {
        let that = this;
        let handler;
        this.listenerEvents.forEach(function (eventType) {
            //先注销掉事件在注册
            document.removeEventListener(eventType, handler);
            document.addEventListener(eventType, handler = function handler1(){
                that.eventListenerHanler(event,eventType);
            }, true);
        })
    }

    /**
    * 事件监听后执行的方法
    * @param event 事件对象
    * @param eventType 事件类型
   */
    eventListenerHanler(event,eventType){
        let that = this;
        let sign = that.getSignForEvent(event.srcElement,that.signKey);
        let signData = that.getSignForEvent(event.srcElement,that.signData);
        if (!!sign) {
            //后续业务
            that.dataPointUpload(sign,eventType,signData);
        }
    }

    /**
     * 获取事件触发的对象的标记
     * @param ele dom对象
     * @param domSignKey 用于dom上标记的key
    */
    getSignForEvent(ele,domSignKey) {
        let that = this;
        //当前dom有标记
        if (!!ele.attributes && 0 < ele.attributes.length) {
            let res = that.getObjKeyByList(domSignKey, ele.attributes);
            if (!!res) {
                return res;
            }else if (!!ele.parentElement) {
                return that.getSignForEvent(ele.parentElement,domSignKey);
            }
            return null;
            
        } 
        return null;
    }

    /**
     * 从json array 中获取指定key名的value
     * @param attrs dom对象的属性 
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
    * 维数组是否包含元素
    */
    arrhaveitem(item, arr, key) {
        var isInArr = false;
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if (!!key ? arr[i][key] == item : arr[i] == item) {
                isInArr = true;
                break;
            }
        }
        return isInArr;
    }

    /**
    * 数据埋点上报
    * @param sign 标记
    * @param eventType 事件类型
    * @param signData 业务数据，如articleId，非必填
    */
    dataPointUpload(sign,eventType,signData){
        // let that = this;
        //事件标记的事务存在
        let globalPointData = window.GlobalConfig.POINT_DATA_CONFIG;
        if(!!globalPointData[sign] && !!globalPointData[sign].eventBisMap[eventType]){
            try {
                let bisData = globalPointData[sign].eventBisMap[eventType].bisData;
                if(!!signData){
                    bisData['extJson'] = signData || '';
                }
                sinosdk.sino.dataTracking(bisData).then(()=>{
                });                
            } catch (error) {
            }
        }
    }
}
export default new dataPointUploadHandler();