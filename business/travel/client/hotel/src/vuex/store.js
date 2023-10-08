import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
    count: 10,
    //全局的登录信息
    loginInfo: {
        session: '',
        userInfo: ''
    },
    tripType:'',
    hotel: {
        tripType: 'PUBLIC'
    },
    flight: {
        tripType: 'PUBLIC'
    },
    train: {
        tripType: 'PUBLIC'
    }
}

// 定义所需的 mutations
const mutations = {
    INCREMENT(stat) {
        stat.count++
    },
    DECREMENT(stat) {
        stat.count--
    },
    ADDUSERINFO(stat, userInfo) {
        stat.loginInfo.userInfo = userInfo;
    },
    CHANGEFLIGHTTRIPTYPE(stat, type) {
        stat.flight.tripType = type;
    },
    CHANGETRAINTRIPTYPE(stat, type) {
        stat.train.tripType = type;
    },
    CHANGEHOTELTRIPTYPE(stat, type){
        stat.hotel.tripType = type;
    }
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})