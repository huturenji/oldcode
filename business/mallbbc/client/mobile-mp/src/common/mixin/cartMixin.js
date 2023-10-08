import {isNotEmpty } from '@/utils/common'
import requestMixin from '@/common/mixin/requestMixin.js';
import cartHandler from "@/views/components/cart/handler";
import { mapMutations} from 'vuex';

export default {
    mixins: [requestMixin],
    data() {
        return { 
            cartNum: 0, //购物车数量  
        }
    },    
    created(){
        this.$getCartNum();
    },
    computed: {
        
    },
    methods: {
        ...mapMutations(['updateCartNumById', 'updateCartNum']),
        /**
         * 加入购物车
         * @opt 
         * goodsItem：商品信息
         * addressId: 地址id
         * num: 加入购物车的数量
         * onSuccess(data)：加入成功。 data：{server：是否存入服务器}
         * onError(): 加入失败
         */ 
        async $addCart(opt){
            opt.num = opt.num || 1;
            let sku = opt.goodsItem.sku || opt.goodsItem.defaultProductId;
            let storeId = opt.storeId || opt.goodsItem.storeId;//推荐列表的商品加购物车，从goodsItem获取storeId
            let param = {
                unitKey: 'addCart', //为了用作排他锁【requestExclusive】的唯一key
                requestFun: cartHandler.addCart, //请求 function
                storeId,
                sku,
                number: opt.num
            }
            if (isNotEmpty(opt.addressId)){
                param = {...param, 'addressId': opt.addressId}
            }
            let res = await this.requestExclusive(param)
             // 255 购物车已满，无法添加 267 商品状态有问题(不可买，库存不足，活动失效了 但是仍会加入购物车
            if (res.state == 200 || res.state == 267){
                this.$store.dispatch('getCartList')
                // 上报加购事件
                this.$statEvent({
                    behaviorType: 'cart',
                    storeId,
                    sku
                })
                setTimeout(()=>{
                    uni.showToast({
                        title: res.msg,
                        icon:'none',
                        duration:700
                    })
                }, 0)
                opt.onSuccess?.({server: true});
                this.$getCartNum(); // 更新购物车数量
            } else {
                opt.onError?.({server: true});
                uni.showToast({
                    title:res.msg,
                    icon:'none',
                    duration:700
                })
                return
            }
        },

        /***
         * 获取购物车数量
         */
        $getCartNum(){
            cartHandler.getCartNum().then(res => {
                if(res.state == 200) {
                   this.cartNum = res.data.totalCartNum; //更新全局的购物车数量
                   this.updateCartNum(this.cartNum)
                }
            }).catch(e => {
                console.log(e);
            })
        }

    }
}