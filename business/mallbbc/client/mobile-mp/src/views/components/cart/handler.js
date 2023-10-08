import request from '@/utils/request';
export default {
    /**
     * 获取购物车数量
     * @param {*} param 
    */
    getCartNum(param = {}){
        return request({
            url: '/v3/cart/front/getCartNum',
            data: param,
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 获取购物车列表
     * @param {*} param 
    */
    getCartList(param = {}){
        return request({
            url: '/v3/cart/front/cartList',
            data: param
        })
    },

    /**
     * 变更购物车数量
     * @param {*} param 
    */
    changeCartNum(param = {}){
        return request({
            url: '/v3/cart/front/changeNum',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 变更购物车选中状态
     * @param {*} param 
    */
    checkedCarts(param = {}){
        return request({
            url: '/v3/cart/front/checkedCarts',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 清空购物车失效商品
     * @param {*} param 
    */
    clearInvalid(param = {}){
        return request({
            url: '/v3/cart/front/emptyInvalid',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 清空购物车失效商品
     * @param {*} param 
    */
    deleteCarts(param = {}){
        return request({
            url: '/v3/cart/front/deleteCarts',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 购物车商品移到收藏夹
     * @param {*} param 
    */
    moveToCollection(param = {}){
        return request({
            url: '/v3/cart/front/moveToCollection',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 修改购物车换促销活动
     * @param {*} param 
    */
    changePromotion(param = {}){
        return request({
            url: '/v3/cart/front/changePromotion',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 加入购物车
     * @param {*} param 
    */
    addCart(param = {}){
        return request({
            url: '/v3/cart/front/add',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    },

    /**
     * 批量加入购物车【批量接口】
     * @param {*} param 
    */
    addCarts(param = {}) {
        return request({
            url: '/v3/cart/front/addCarts',
            data: param,
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            }
        })
    },
    /**
     * 获取商品参加的满减活动列表(包括满减、阶梯满减)
     * @param {*} param 
    */
    getGoodsTwoActivityList(param){
        return request({
            url: '/v3/discount/front/discount/detail',
            method: 'GET',
            header:{"Content-Type": "application/json"},
            data: param
        })
    },

    /**
    * 获取优惠券列表
    @param  { } param
    */
    getStoreCouponList(param = {}){
        return request({
            url: '/v3/promotion/front/coupon/storeCouponList',
            data: param,
            method: 'POST',
            header:{"Content-Type": "application/json"}
        })
    },
    /**
     * 立即领取优惠券
     * @param {*} param 
    */
    receiveCoupon(param = {}){
        return request({
            url: '/v3/coupon/front/coupon/receiveCoupon',
            data: param
        })
    },
    /**
     * 获取领券中心数据
     * @param {*} param 
    */
    couponCenter(param = {}){
        return request({
            url: '/v3/coupon/front/coupon/couponCenter',
            header:{"Content-Type": "application/x-www-form-urlencoded"},
            data: param,
            method: 'POST'
        })
    },
    /**
     * 获取专题页装修数据
     * @param {*} param 
     * @config 自定义外层请求的配置项
    */
    getTopicDeco(param = {}, config = {}){
        return request({
            ...config,
            url: '/v3/system/front/deco/special',
            data: param
        })
    },

    /**
     * 获取商品规格
     * @param {*} param 
    */
    getSimilarProduct(param = {}) {
        return request({
            url: '/v3/goods/front/product/similarProduct',
            data: param
        })
    },

    /**
     * 切换商品规格
     * @param {*} param 
     * @config 自定义外层请求的配置项
    */
    switchSpec(param = {}, config = {}) {
        return request({
            ...config,
            url: '/v3/cart/front/switchSpec',
            data: param,
            method: 'POST'
        })
    }

};

