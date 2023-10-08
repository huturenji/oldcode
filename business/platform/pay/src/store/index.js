import Vue from 'vue'
import Vuex from 'vuex'
import config from '../config'
import {OPERATION_STAGE} from '../constant'
import Utils from '../utils/utils'
import { LOADING_STATE } from '../constant'
Vue.use(Vuex)

let loadingTimer = null;

const store = new Vuex.Store({
  state: {
    limitTime: null,//全局控制支付时间  
    config: config,//全局配置
    depends: {//依赖的环境
        sinosdk: null,
        snutils: null,
    },
    loadingState: false,//锁住页面
    payTypeList: [],//可用的支付方式
    operationStage: '',//0成功, -1失败，-2中断，-3未确认支付状态，1支付中(正在执行支付流程)，2获取支付结果中（支付动作已完成） 默认值是空字符串，无意义
    currPayType: null,//当前使用的payType
    isQRCode: false,//是否使用二维码支付。 因为二维码扫描支付不可感知，因此要特殊处理
  },
  getters: {
    zIndex(state){
        return value => (state.config.zIndex || 1) + (value || 0);
    },
    isBizMateEnv(state){
        return state.config.runEnv == 'bizmate'
    },
    isBrowserEnv(state){
        return state.config.runEnv == 'browser'
    },
  },
  mutations: {
    //合并配置项  
    mergeConfig(state, _config) {
      state.config = Utils.merge(state.config, _config);
    },
    //配置依赖环境
    setDepends(state, payLoad){
      state.depends[payLoad.key] = payLoad.value  
    },
    //锁住页面
    lockPage(state, payLoad){
        if(Utils.isEmpty(payLoad)){
            payLoad = LOADING_STATE.LOADING;//默认值
        }
        state.loadingState = payLoad;
        //正在确认支付结果，超时后变更支付状态为“未确认支付状态”
        if(payLoad == LOADING_STATE.CONFIRM){
            state.operationStage = OPERATION_STAGE.PAYING;//此时认为用户依然在执行支付动作，而非执行完成。 因为confirm状态只有二维码支付用到，这种支付无法判断用户是否操作完成的
            loadingTimer = setTimeout(() => {
                state.loadingState = false;
                state.operationStage = OPERATION_STAGE.UNKNOW;//未确认支付状态
            }, state.config.timeout);
        }else{
            loadingTimer = null;
            clearTimeout(loadingTimer)
        }
    },
    setPayTypeList(state, payLoad){
        state.payTypeList = payLoad
    },
    setOperationStage(state, payLoad){
        state.operationStage = payLoad;
        //1是进行态，其他的是终结态。 终结态不显示loading
        if(payLoad != OPERATION_STAGE.PAYING){
            state.loadingState = false;
        }
    },
    setCurrPayType(state, payLoad){
        state.currPayType = payLoad;
        state.isQRCode = false;//初始化该值
    },
    //是否使用二维码支付
    useQRCode(state, payLoad){
        state.isQRCode = payLoad
    },
    setLimitTime(state, payLoad){
        state.limitTime = payLoad
    },
  }
})

export default store; 