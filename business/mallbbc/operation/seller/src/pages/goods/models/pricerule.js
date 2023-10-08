import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'pricerule',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
    //slodon_获取定价策略列表
        * get_price_rule_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/rule/seller/price/listPricingRule`, 'json');
            if (callback) {callback(response);}
        },
        //slodon_获取定价策略详情
        * get_price_rule_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/rule/seller/price/getPricingRule`);
            if (callback) {callback(response);}
        },
        //slodon_新增定价策略
        * add_rule({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/rule/seller/price/addPricingRule`, 'json');
            if (callback) {callback(response);}
        },
        //slodon_删除定价策略
        * delete_priceRule({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/rule/seller/price/deletePricingRule`, 'json');
            if (callback) {callback(response);}
        },
        //slodon_启用、停用定价策略
        * enable_priceRule({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/rule/seller/price/enablePricingRule`, 'json');
            if (callback) {callback(response);}
        },
        //slodon_获取操作日志
        * get_priceRule_logs({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/rule/seller/price/getPricingRuleLogs`, 'json');
            if (callback) {callback(response);}
        },
        //slodon_获取分类列表
        * get_cate_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/seller/category/getCategoryTree`, 'json');
            if (callback) {callback(response);}
        },
        //slodon_sku批量查询
        * get_sku_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/seller/product/getProduct`, 'json');
            if (callback) {callback(response);}
        },
        //slodon_获取分类商品列表
        * product_search({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/seller/product/search`, 'json');
            if (callback) {callback(response);}
        },
        //slodon_批量获取商品定价
        * get_product_prices({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/seller/product/listSkuPrices`, 'json');
            if (callback) {callback(response);}
        },
        //slodon_更新定价规则
        * updatePricingRule({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/rule/seller/price/updatePricingRule`, 'json');
            if (callback) {callback(response);}
        },
        // 定价规则 检验sku重复
        * repeatSku({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/rule/seller/price/repeatSku`, 'json');
            if (callback) {callback(response);}
        }

    }
};
