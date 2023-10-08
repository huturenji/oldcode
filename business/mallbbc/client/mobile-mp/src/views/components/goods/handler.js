import request from '@/utils/request';
export default {
    getSettings(param) {
        return request({
            url: '/v3/system/front/setting/getSettings',
            data: param
        })
    },
    followDiscount(param) {
        return request({
            url: '/v3/marketing/front/followDiscount/follow',
            method: 'POST',
            header: { "Content-Type": "application/json" },
            data: param
        })
    },
    /**
     * 获取商品的比价组信息【批量接口】
     * @param {*} param 
    */
    getGoodsGroupInfo(param) {
        return request({
            url: '/v3/goods/front/product/listProductGroup',
            method: 'POST',
            header: { "Content-Type": "application/json" },
            data: param
        })
    },
    

    /**
     * 获取商品的价格信息【批量接口】
     * @param {*} param 
    */
     getProductPriceApi(param) {
        return request({
            url: '/v3/goods/front/product/listProductPrice',
            method: 'POST',
            header: { "Content-Type": "application/json" },
            data: param
        })
    },
    // 通过skus批量获取商品价格的方法
    getProductPrice(param){
        return new Promise((resolve, reject) => {
            this.getProductPriceApi(param).then(res => {
                if(res.state == 200 && res.data?.products?.length > 0){
                    this.handlePrice(res.data.products)
                }
                resolve(res)
            }).catch(e => {
                reject(e)
            })
        })
    },
    /**
     * 获取商品详情
     * @param {*} param 
    */
    getDetail(param) {
        return request({
            url: '/v3/goods/front/product/detail',
            data: param
        })
    },
    /**
     * 获取推荐商品列表
     * @param {*} param 
    */
    getRecommendList(param) {
        return request({
            url: '/v3/goods/front/product/recommendList',
            data: param
        })
    },
    /**
     * 获取联盟商品列表支持自定义url
     * @param {*} param 
     * @url {*} Str
    */
    getUnionGoodsList(param, url) {
        return request({
            url: url,
            method: 'POST',
            header: { "Content-Type": "application/json" },
            data: param
        })
    },
    /**
     * 查询区域限售
     * @param {*} param 
    */
    checkAreaPurchase(param) {
        return request({
            url: '/v3/goods/front/product/checkPurchase',
            method: 'POST',
            header: { "Content-Type": "application/json" },
            data: param
        })
    },
   
    /**
     * 查询商品库存
     * @param {*} param 
    */
    checkStock(param) {
        return request({
            url: '/v3/goods/front/product/listStock',
            method: 'POST',
            header: { "Content-Type": "application/json" },
            data: param
        })
    },
    /**
     * 根据sku查询商品列表
     * @param {*} param 
    */
    getListBySkusApi(param) {
        return request({
            url: '/v3/goods/front/product/listBySkus',
            method: 'POST',
            header: { "Content-Type": "application/json" },
            data: param
        })
    },
    getListBySkus(param){
        return new Promise((resolve, reject) => {
            this.getListBySkusApi(param).then(res => {
                if(res.state == 200 && res.data.length > 0){
                    this.handlePrice(res.data)
                }
                resolve(res)
            }).catch(e => {
                reject(e)
            })
        })
    },
    /**
     * 搜索商品列表
     * @param {*} param 
    */
     searchApi(param) {
        return request({
            url: '/v3/goods/front/product/search',
            method: 'POST',
            header: { "Content-Type": "application/json" },
            data: param
        })
    },
    // 通过skus批量获取商品价格的方法
    search(param){
        return new Promise((resolve, reject) => {
            this.searchApi(param).then(res => {
                if(res.state == 200 && res.data?.productVOPageVO?.list?.length > 0){
                    this.handlePrice(res.data?.productVOPageVO?.list)
                }
                resolve(res)
            }).catch(e => {
                reject(e)
            })
        })
    },
    /**
     * 获取商品评论
     * @param {*} param 
    */
    getComment(param) {
        return request({
            url: '/v3/goods/front/product/comment',
            data: param
        })
    },
    /**
     * 获取商品对比
     * @param {*} param 
    */
    getCompare(param) {
        return request({
            url: '/v3/goods/front/product/compareSkus',
            data: param
        })
    },
    /**
     * 获取品牌列表
     * @param {*} param 
    */
    getBrandList(param) {
        return request({
            url: '/v3/goods/front/product/goodsBrandList',
            data: param
        })
    },
    /**
     * 获取分类树
     * @param {*} param 
    */
    getCategoryTree(param) {
        return request({
            url: '/v3/goods/front/category/getCategoryTree',
            data: param
        })
    },
    /**
     * 获取三级分类和品牌
     * @param {*} param 
    */
    getCategoriesAndBrands(param) {
        return request({
            url: '/v3/goods/front/category/getCategoriesAndBrands',
            data: param
        })
    },
    /**
     * 获取上新列表
     * @param {*} param 
    */
    getNewGoods(param) {
        return request({
            url: '/v3/goods/front/goods/newGoods',
            data: param
        })
    },
    /**
     * 生成分享图片
     * @param {*} param 
    */
    getShareInfo(param) {
        return request({
            url: '/v3/goods/front/goods/share/sharePosters',
            data: param,
            responseType: 'arraybuffer'
        })
    },
    /**
     * 获取运费
     * @param {*} param 
    */
    getCalculateExpress(param) {
        return request({
            url: '/v3/goods/front/product/calculateExpress',
            method: 'POST',
            header: { "Content-Type": "application/json" },
            data: param
        })
    },
    /**
     * 获取赠品
     * @param {*} param 
    */
    getGift(param) {
        return request({
            url: '/v3/goods/front/product/listSkuGift',
            method: 'POST',
            header: { "Content-Type": "application/json" },
            data: param
        })
    },


    /**
     * 立即领取优惠券
     * @param {*} param 
    */
    receiveCoupon(param = {}) {
        return request({
            url: '/v3/coupon/front/coupon/receiveCoupon',
            data: param
        })
    },

    /**
     * 优惠券一键领取
     * @param {*} param 
     * @config 自定义外层请求的配置项
    */
    reveiverAllCoupon(param){
        return request({
            url: '/v3/promotion/front/activity/receiveCoupon',
            method: 'POST',
            header:{"Content-Type": "application/json"},
            data: param
        })
    },
    /**
     * 获取红包列表
     * @param {*} param 
     * @config 自定义外层请求的配置项
    */
    getRedPacketList(param){
        return request({
            url: '/v3/redpacket/front/redpacket/couponCenter',
            method: 'POST',
            header:{"Content-Type": "application/json"},
            data: param
        })
    },
    /**
     * 获取商品池商品
     * @param {*} param 
     * @config 自定义外层请求的配置项
    */
    getGoodsPoolGoodsApi(param){
        return request({
            url: '/v3/goods/front/lowpriceproductpool/getPageProduct',
            method: 'POST',
            header:{"Content-Type": "application/json"},
            data: param
        })
    },
    getGoodsPoolGoods(param){
        return new Promise((resolve, reject) => {
            this.getGoodsPoolGoodsApi(param).then(res => {
                if(res.state == 200 && res.data?.list?.length > 0){
                    this.handlePrice(res.data.list)
                }
                resolve(res)
            }).catch(e => {
                reject(e)
            })
        })
    },
    /**
     * 获取消费券
     * @param {*} param 
     * @config 自定义外层请求的配置项
    */
    getConsumeCouponList(param){
        return request({
            url: '/v3/conscoupon/front/consumeCoupon/couponCenter',
            method: 'POST',
            header:{"Content-Type": "application/json"},
            data: param
        })
    },

    /**
    * 获取优惠券列表
    @param  { } param
    */
    getStoreCouponList(param = {}) {
        return request({
            url: '/v3/promotion/front/coupon/storeCouponList',
            data: param,
            method: 'POST',
            header: { "Content-Type": "application/json" }
        })
    },

    /**
     * 获取领券中心数据
     * @param {*} param 
    */
    couponCenter(param = {}) {
        return request({
            url: '/v3/coupon/front/coupon/couponCenter',
            header:{"Content-Type": "application/x-www-form-urlencoded"},
            data: param,
            method: 'POST'
        })
    },

    // 获取运费券列表
    freightCouponCenter(param = {}) {
        return request({
            url: '/v3/cashcoupon/front/freightcoupon/couponCenter',
            data: param,
            method: 'POST',
            header: { "Content-Type": "application/json" }
        })
    },

    // 领取运费券
    receiveFreightByCouponId(param = {}) {
        return request({
            url: '/v3/cashcoupon/front/freightcoupon/receiveByCouponId',
            data: param
        })
    },

    /**
     * 获取秒杀活动场次列表
     * @param {*} param 
    */
    getTodaySeckillStage(param = {}) {
        return request({
            url: '/v3/specialoffer/front/seckill/listTodaySeckillStage',
            data: param,
            header: { "Content-Type": "application/json" }
        })
    },

    /**
     * 获取秒杀活动商品列表
     * @param {*} param 
    */
    getSeckillProductList(param = {}) {
        return request({
            url: '/v3/specialoffer/front/seckill/listPageSeckillProduct',
            data: param,
            method: 'POST',
            header: { "Content-Type": "application/json" }
        })
    },

    /**
     * 设置/取消秒杀服务的提醒功能
     * @param {*} param 
    */
     setSeckillRemind(param = {}){
        return request({
            url: '/v3/specialoffer/front/common/isRemind',
            data: param,
            header:{"Content-Type": "application/json"}
        })
    },

    /**
     * 获取拼团成员列表
     * @param {*} param 
    */
    getPinTeamList(param = {}) {
        return request({
            url: '/v3/promotion/front/spell/teamList',
            data: param
        })
    },

    /**
     * 获取阶梯团列表
     * @param {*} param 
    */
    getLadderList(param = {}) {
        return request({
            url: '/v3/promotion/front/ladder/group/list',
            data: param
        })
    },

    /**
     * 获取拼团列表
     * @param {*} param 
    */
    getSpellList(param = {}) {
        return request({
            url: '/v3/promotion/front/spell/list',
            data: param
        })
    },

    /**
     * 获取预售列表
     * @param {*} param 
    */
    getPreSaleList(param = {}) {
        return request({
            url: '/v3/promotion/front/preSell/list',
            data: param
        })
    },

    /**
     * 获取预售商品详情
     * @param {*} param 
    */
    getPreSellDetail(param = {}) {
        return request({
            url: '/v3/promotion/front/preSell/detail',
            data: param
        })
    },

    /**
     * 获取拼团商品详情
     * @param {*} param 
    */
    getPinDetail(param = {}) {
        return request({
            url: '/v3/promotion/front/spell/detail',
            data: param
        })
    },

    /**
     * 获取秒杀商品详情
     * @param {*} param 
    */
    getSecKillDetail(param = {}) {
        return request({
            url: '/v3/promotion/front/seckill/detail',
            data: param
        })
    },

    /**
     * 获取阶梯团商品详情
     * @param {*} param 
    */
    getLadderDetail(param = {}) {
        return request({
            url: '/v3/promotion/front/ladder/group/detail',
            data: param
        })
    },

    /**
     * 获取活动签到信息
     * @param {*} param 
    */
    getSignActivityDetail(param = {}) {
        return request({
            url: '/v3/promotion/front/sign/activity/detail',
            data: param
        })
    },

    /**
     * 去签到
     * @param {*} param 
    */
    doSign(param = {}) {
        return request({
            url: '/v3/promotion/front/sign/activity/doSign',
            data: param,
            method: 'POST'
        })
    },

    /**
     * 获取我的优惠券列表
     * @param {*} param 
    */
    getMyCouponList(param = {}) {
        return request({
            url: '/v3/coupon/front/coupon/list',
            data: param
        })
    },
    /**
     * 获取我的优惠券-运费券列表
     * @param {*} param 
    */
    getFreightCoupon(param = {}){
        return request({
            url: '/v3/cashcoupon/front/freightcoupon/list',
            data: param
        })
    },
    /**
     * 获取我的优惠券-消费券列表
     * @param {*} param 
    */
    getConsumeCoupon(param = {}){
        return request({
            url: '/v3/conscoupon/front/consumeCoupon/list',
            data: param,
            method: 'POST',
            header:{"Content-Type": "application/json"}
        })
    },
    /**获取优惠券详情
     * @param {*} param 
    */
    getCouponDetail(param = {}) {
        return request({
            url: '/v3/coupon/front/coupon/detail',
            data: param
        })
    },
    /**
     * 获取消费券使用门店
     * @param {*} param 
    */
    getConsumeStoreList(param = {}){
        return request({
            url: '/v3/seller/front/offlineShop/page',
            data: param
        })
    },
    /**获取消费券详情
     * @param {*} param 
    */
    getConsumDetail(param = {}){
        return request({
            url: '/v3/conscoupon/front/consumeCoupon/detail',
            data: param
        })
    },
    /**
     * 获取红包详情
     * @param {*} param 
    */
    getRedpacketDetail(param = {}){
        return request({
            url: '/v3/redpacket/front/redpacket/useDetail',
            data: param
        })
    },
    /**
     * 获取我的红包列表
     * @param {*} param 
    */
    getMyRedpacketList(param = {}){
        return request({
            url: '/v3/redpacket/front/redpacket/list',
            data: param
        })
    },

    /**获取秒杀活动配置的轮播图
     * @param {*} param 
    */
    getSeckillBanner(param = {}) {
        return request({
            url: '/v3/promotion/front/seckill/banner',
            data: param
        })
    },

    /**获取秒杀活动顶部的分类标签
     * @param {*} param 
    */
    getSeckillLabel(param = {}) {
        return request({
            url: '/v3/promotion/front/seckill/getSeckillLabel',
            data: param
        })
    },

    /**获取秒杀活动场次列表
     * @param {*} param 
    */
    getSeckillStage(param = {}) {
        return request({
            url: '/v3/promotion/front/seckill/getSeckillStage',
            data: param
        })
    },


    /**获取店铺列表
     * @param {*} param 
    */
    getStoreList(param = {}) {
        return request({
            url: '/v3/seller/front/store/list',
            data: param
        })
    },
    /**
     * 获取几个朋友买过
     * @param {*} param 
    */
    getSaleVolume(param = {}) {
        return request({
            url: '/v3/statistics/front/buying/buyingLabel',
            data: param
        })
    },
    // 是否为京东自营和京东物流
    isJdSelf(goods) {
        return goods && goods.jdSelf == 1 && goods.jdLogistics == 1;
    },
    isJdLogistics(goods) {
        return goods.jdLogistics == 1;
    },
    // 商品的是否参加了活动
    attendPromotion(goods) {
        //天天专场，没有预热。必须满足两个条件 attendPromotion promotionStarted都为true
        if (goods.promotionType == 107) {
            return !!goods.attendPromotion && !!goods.promotionStarted;
        } 
        return !!goods.attendPromotion;
    },
    // 是否显示京东实惠标签、京东比价和京东到手价
    isShowJdLable(goods) {
        let that = this;
        return goods && goods?.tags?.[0] == 1 && !that.attendPromotion(goods);
    },
    // 处理价格显示 
    handlePrice(goods) {
        if (!!goods && goods.length){
            goods.forEach(item => {
                //接口优化之后 salePrice是商品正常售价 promotionPrice是活动价，商品没参加活动的时候等于null
                item.originalSalePrice = item.salePrice // 该处是为了兼容老数据
                item.salePrice = (item.attendPromotion && item.promotionStarted) ? item.promotionPrice : item.salePrice; // 前端展示是是销售的价格用salePrice
            })
        }
        return goods;
    }
};