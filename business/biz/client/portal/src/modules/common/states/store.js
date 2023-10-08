import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
    state:{
        role: null//角色
    },
    getters:{
        getRole(state){
            return state.role;
        }
    },
    mutations:{
        setRole(state, role){
            state.role = role;
        }
    },
    actions:{
    }
});