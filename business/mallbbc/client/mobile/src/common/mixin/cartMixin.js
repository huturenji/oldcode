import {isNotEmpty } from '@/utils/common'
import requestMixin from '@/common/mixin/requestMixin.js';
import cartHandler from "@/components/cart/handler";
import {
    mapState
} from 'vuex';
export default {
    mixins: [requestMixin],
    data() {
        return {   
        }
    },    
    computed: {
        ...mapState(['hasLogin'])
    },
    methods: {
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
            let goodsItem = opt.goodsItem;
            let storeId = opt.storeId || opt.goodsItem.storeId;//推荐列表的商品加购物车，从goodsItem获取storeId
            //已登录
            if (this.hasLogin){ 
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
                if (res.state == 200){
                    uni.showToast({
                        title: res.msg,
                        icon:'none'
                    })
                   

                    opt.onSuccess?.({server: true});
                } else {
                    opt.onError?.({server: true});
                    uni.showToast({
                        title:res.msg,
                        icon:'none',
                        duration:700
                    })
                    return
                }
            } else { //未登录
                let cart_list = {
                    storeCartGroupList:[{
                        promotionCartGroupList:[{
                            cartList: [{
                                buyNum: opt.num,
                                spu: goodsItem.spu,
                                sku: sku,
                                mainImage: goodsItem.goodsPic ? goodsItem.goodsPic : goodsItem.mainImage,
                                skuName: goodsItem.skuName,
                                isChecked: 1,
                                productPrice: goodsItem.goodsPrice,
                                storeId: storeId
                                // productStock: goodsItem.productStock
                            }]
                        }],
                        storeId:goodsItem.storeId,
                        storeName:goodsItem.storeName,
                        checkedAll:true
                    }],
                    checkedAll: true,
                    invalidList: []
                }

                let local_cart_list = uni.getStorageSync('cart_list') //购物车列表本地缓存
                if (local_cart_list) {
                    let tmp_list1 = []
                    let tmp_list2 = []
                    cart_list.storeCartGroupList.forEach(item=>{
                        item.promotionCartGroupList.forEach(item1=>{
                            item1.cartList.forEach(item2=>{
                                local_cart_list.storeCartGroupList.forEach(v=>{
                                    v.promotionCartGroupList.forEach(v1=>{
                                        v1.cartList.forEach(v2=>{
                                            if (v2.sku == item2.sku && v.storeId == item.storeId){
                                                tmp_list1.push(v)
                                            }
                                        })
                                        tmp_list2 = local_cart_list.storeCartGroupList.filter(scg=>{
                                            return scg.storeId == item.storeId
                                        })
                                    })
                                })
                            })
                        })
                    })
                    if (tmp_list1.length > 0 && tmp_list2.length > 0){ //同一店铺同一商品
                        local_cart_list.storeCartGroupList.forEach(item=>{
                            item.promotionCartGroupList.forEach(item1=>{
                                item1.cartList.map(item2=>{
                                    if (item2.sku == (goodsItem.sku || goodsItem.defaultProductId) && item.storeId == goodsItem.storeId){
                                        item2.buyNum += 1
                                    }
                                    return item2;
                                })
                            })
                        })
                    } else if (tmp_list1.length == 0 && tmp_list2.length > 0){ //同一店铺不同商品
                        local_cart_list.storeCartGroupList.map(item=>{
                            if (item.storeId == goodsItem.storeId){
                                item.promotionCartGroupList.forEach(item2=>{
                                    item2.cartList.push(cart_list.storeCartGroupList[0].promotionCartGroupList[0].cartList[0])
                                })
                            }
                            return item;
                        })
                    } else { //不同店铺不同商品
                        local_cart_list.storeCartGroupList.push(cart_list.storeCartGroupList[0])
                    }
                    cart_list = local_cart_list
                }
                uni.setStorageSync('cart_list',cart_list);
                opt.onSuccess?.({server: false});
                uni.showToast({
                    title: '已加入购物车',
                    icon:'none'
                })
            }
            this.$store.dispatch('getCartNum'); //更新购物车商品数量
            this.$bbcStatEvent({behaviorType:'cart',spu:goodsItem.spu,storeId:goodsItem.storeId})
        }
    }
}