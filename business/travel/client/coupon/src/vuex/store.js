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
    INCREMENT(state) {
        state.count++
    },
    DECREMENT(state) {
        state.count--
    },
    ADDUSERINFO(state, userInfo) {
        state.loginInfo.userInfo = userInfo;
    },
    CHANGEFLIGHTTRIPTYPE(state, type) {
        state.flight.tripType = type;
    },
    CHANGETRAINTRIPTYPE(state, type) {
        state.train.tripType = type;
    },
    CHANGEHOTELTRIPTYPE(state, type){
        state.hotel.tripType = type;
    }
	
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})