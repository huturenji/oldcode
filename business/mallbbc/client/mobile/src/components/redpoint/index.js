// mobile端涉及的红点统一入口，包括购物车种类红点，我的页面各种状态的订单数量红点，优惠券数量红点等，未完待续...
import personalHandler from "@/components/personal/handler";
import store from '@/store'
import config from "./enum";
class Redpoint {
    constructor(){
        this.config = config; //红点相关的配置项
        this.init();
    }

    init(){
        let that = this;
        personalHandler.getInfo().then(res => {
            if (res.state == 200 && res.data && Object.keys(res.data).length > 0) {
                Object.keys(that.config).forEach(item => {
                    that.config[item].number = res.data[that.config[item].key]
                })

                //更新vuex里面的用户信息
                store.commit("setUserCenterData", res.data);
            }
        }).catch(e => {
            console.log(e);
        })
    }

    reset(){
        this.init();
    }
}

export default new Redpoint();