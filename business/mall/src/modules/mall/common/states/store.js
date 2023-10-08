import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import cartHandler from 'common/lib/requestHandler/cartHandler.js';
import extendUtils from 'common/lib/utils';
export default new Vuex.Store({
    state:{
       cartNumber: 0,//购物车商品的总数量
    },
    getters:{

    },
    mutations:{
       changeCartNum(state, number){//变更购物车商品的总数量
          state.cartNumber = number;
       }
    },
    actions:{
        //获取购物车总数量的方法
        getCartNum(context){
            if(!extendUtils.getBizMateVersion()){
                return
            }
            let totleCartNum = 0;
            let carList = []
            let obj = {
                "userId": cartHandler.userId,
                "companyId": cartHandler.companyId,
                "channelId": cartHandler.channelId,
                "supplierId": cartHandler.supplierId,
            }
            cartHandler.getCartList(obj).then(data=>{
                if(data.resultCode == 0){
                    carList = data.result.list;
                    if(carList.length <= 0){
                        totleCartNum = 0;
                    }else{
                        carList.forEach(item => {
                            totleCartNum += Number(item.quantity);
                        });
                    }
                    context.commit('changeCartNum', totleCartNum);
                }
            }).catch (e=>{
                context.commit('changeCartNum', 0);
                console.error(e);
            });
        },
    },
});