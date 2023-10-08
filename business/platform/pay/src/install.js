import './webpackConfig.js';//必须第一行执行
import Vue from 'vue'
import Pay from './core/pay.vue'
import utils from './utils/utils'
import store from './store';
export {PAY_MODE, PAY_TYPE, OPERATION_STAGE, PAY_RESULT_STATUS} from './constant'
Vue.prototype.$store = store;
const SinoPay = Vue.extend(Pay)

/**
 * 从scope中获取对象
 * @param {*} envName 对象名，支持xx.xx的格式
 * @param {*} scope 
 * @returns 
 */
function getEnvTarget(envName, scope = window) {
    let result = null;
    if (!envName) {
        return result;
    }
    envName.split('.').forEach(name => {
        if (!result) {
            result = scope[name]
        } else {
            result = result[name];
        }
    })
    return result;
}

/**
 * 
 * @param {*} envName 依赖对象名称，可以是 xx.xx的结构。会依据此名称从window下递归获取实例
 * @param {*} envConfig 依赖对象实例。例如：{sinosdk: {name: 'sinosdk', value:[sinosdk的对象], path: [sinosdk的路径]}}
 * @param {*} alia 将依赖对象存入store的别名
 * @returns 
 */
async function checkEnv(envName, envConfig, alia) {
    let storeName = alia || envName;
    //检测依赖环境是否已存在
    let envObj = getEnvTarget(envName);
    //依赖对象不存在则从envConfig中获取
    if (!envObj) {
        let config = (envConfig || {})[envName]
        if (!config || Object.keys(config).length == 0) {
            throw `未找到${envName}，请提供配置`
        }
        //直接通过name获取依赖对象。如果未获取到，则依次从value中获取，从path中下载
        envObj = getEnvTarget(config.name)
        if (envObj) {
            store.commit('setDepends', { key: storeName, value: envObj })
            return
        }
        if (config.value) {
            store.commit('setDepends', { key: storeName, value: config.value })
            return
        }
        if (config.path) {
            try {
                await new Promise(resolve => {
                    utils.loadScript({
                        url: config.src,
                        onload() {
                            store.commit('setDepends', { key: storeName, value: getEnvTarget(envName) || getEnvTarget(config.name) })
                            resolve();
                        },
                        onerror() {
                            reject()
                        }
                    })
                })
            } catch (e) {
                console.error(e);
                throw `配置路径下未找到${envName}:  ${config.path}`
            }
            return;
        }
    } else {
        store.commit('setDepends', { key: storeName, value: envObj })
    }
}

let timeInterval = null;
/**
 * 开启倒计时
 */
function countdownStart(limitTime){
    try{
        if(!!limitTime && limitTime > 0){
            clearInterval(timeInterval)
            store.commit('setLimitTime', limitTime);
            timeInterval = setInterval(function () {
                let _limitTime = store.state.limitTime;
                if (!!_limitTime) {
                    if (_limitTime < 1000) {
                        _limitTime = null;
                        clearInterval(timeInterval)
                    } else {
                        _limitTime = _limitTime - 1000;//注意单位是毫秒ms
                        store.commit('setLimitTime', _limitTime)
                    }
                } else {
                    clearInterval(timeInterval)
                }
            }, 1000);
        }
    }catch(e){
        console.warn(e);
    }
}

/**
 * 
 * @param {*} options 
 * config: {
 *    token(String | Function) 提供token
 *    origin(String): 请求的域名
 *    api(Object): 接口路径。 payTypeList， createOrder， getPaymentInfo，payNotify： {path, method}
 *    commonParams(Object): 公共参数。 比如：userId, companyId, channelId
 *    bslConfig(Object): bsl配置
 *    checkNetwork(Boolean): 是否开启网络监测
 *    depends(Object): 依赖环境对象实例（默认使用window下对象） 
 *        sinosdk(Object): sinosdk的相关配置 {name: 'sinosdk', value:[sinosdk的对象], path: [sinosdk的路径]}
 *        snutils(Object): SnUtils的相关配置 {name: 'SnUtils', value:[SnUtils的对象], path: [SnUtils的路径]}
 *    serviceHotline(String): 客服电话 
 *    timeout(Number)：超时时间（单位：秒）
 *    responseAdapter(Object): 接口返回值格式，需提供： 
 *          dataKey[String]: [业务数据的key], 
 *          codeKey[String]: [业务code的key], 
 *          messageKey[String][可选]: [接口状态描述的key]， 
 *          isSuccess(response) [Function]: [接口状态是否成功的函数,提供一个参数response，是返回体对象]
 *    zIndex(Number),//页面元素基准z-index, 默认1000
 *    redirectUri(String): h5支付使用的url，支付操作完后，回到该url
 *    validPayType(Boolean): 是否需要校验支付方式的合法性(false时调用use，不会从支付列表查询该支付方式是否存在)，默认true
 *    runEnv（String）: 运行环境，bizmate需要sinosdk，browser不需要sinosdk。 默认'bizmate'
 *    primaryColor(String): 组件的主要颜色
 *    limitTime[Number]： 剩余支付时间（单位：毫秒）
 *    cutdown(Boolean)：是否开启倒计时。 如果为true，需要传入limitTime才可生效
 *    appExtraData(Object): app支付时，需要提供的额外业务参数。具体内容由业务侧按app的api来定  
 * data：{
 *              orderNo[String | Number](和orderNoList必传其一): 订单号, 
 *              orderNoList[Array] (和orderNo必传其一): 订单号列表， 
 *              amount[String | Number]（必传）: 金额, 
 *              goodsDesc[String]（必传）: 订单描述, 
 *              tradeType[Number]（必传）: 订单类型,  1:机票，2：火车票，3：酒店，4：京东企业购
 * }
 * @returns 
 * 操作：initData(data)  初始化支付参数，参数体内容同options.data。 可在install时传入支付参数，也可在install后通过initData传入
 *      getPayMethod    获取支付列表
 *      use(String | Object) 调用具体的支付方式。 参数一般是从getPayMethod返回的支付对象。在开启支付方式校验（validPayType=true）时，可传入支付对象的code（String类型）或者整个支付对象；
 *                          关闭校验时，必须传入对象，且至少要包含{code,payType,payMethod}（其中payMethod的值可从对外暴露的PAY_MODE中获取）。 注意，在非伴正事环境，只可调用H5支付或二维码支付。
 *      on(name, callback)   监听事件。name：事件名，callback：回调函数
 *      getPayResult()   获取支付状态  0成功, -1失败，-2中断，-3未确认支付状态，1支付中(正在执行支付流程)，2获取支付结果中（支付动作已完成） 默认值是空字符串，无意义
 *      stopPay()       停止支付，操作状态会变成break
 *      closeH5Pay()    关闭正在进行的H5支付。H5支付一般会打开一个全屏iframe来展示第三方支付页面，此方法用于关闭该iframe
 *      stopTracking() 停止轮询支付结果
 *      updateLimitTime(Number) 更新剩余支付时间，此时cutdown设置应设置false，将剩余时间的更新交由业务侧控制
 * 事件：onOperationEnd  支付操作完成。 只有非PC二维码支付才会触发这个事件。 此时支付state为2
 *      onListenlingState(state)  监听支付状态，state的值参考OPERATION_STAGE
 *      onCancelUnknown  支付结果确认confirm框的继续支付（“再次确认”）按钮事件。 在默认操作之前触发，如果返回false，则不执行默认操作。  支持返回一个promise对象。  （默认操作： 继续查询支付结果）
 *      onConfirmUnknown 支付结果确认confirm框的取消继续等待结果（“知道了”）按钮事件。  没有默认操作。 
 *      onH5PayOperaEnd  H5支付程序操作完成，已加载H5支付的页面
 *      onBeforeH5Pay(payType) H5支付之前的钩子
 */


let instance = null;
export async function install(options = {}) {
    store.commit('mergeConfig', options.config);//最优先合并配置
    options.config.cutdown && countdownStart(options.config.limitTime);//开启倒计时

    await checkEnv('SnUtils', options.depends, 'snutils');
    if(store.getters.isBizMateEnv){
        await checkEnv('sinosdk.sino', options.depends, 'sinosdk')
    }


    let mainDom = document.getElementById('sinoPayEl');//pay.vue的最外层div id，这才是挂载到dom上的div
    if (mainDom) {
        mainDom.remove()
    }
    let el = options.el || document.createElement('div');
    document.body.appendChild(el);
    
    instance = new SinoPay({
        el: el,
        propsData: options.data,
    })
    return instance;
}

export function destroy(){
    if(instance){
        instance.destroy();
        instance.$el.remove()
    }
}