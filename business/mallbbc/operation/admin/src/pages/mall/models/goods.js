import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'goods',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        //slodon_获取商品规格列表
        * get_goods_spec_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/goodsSpec/list`);
            if (callback) {callback(response);}
        },
        //slodon_获取商品详情
        * get_goods_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/product/detail');
            if (callback) {callback(response);}
        },
        //slodon_获取商品列表
        * get_goods_lists_byState({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/product/listByState','json');
            if (callback) {callback(response);}
        },
        //slodon_获取商品在售列表
        * search_goods_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/product/search','json');
            if (callback) {callback(response);}
        },
        //slodon_获取商品下架列表
        * get_offLine_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/product/listOffLine','json');
            if (callback) {callback(response);}
        },
        //slodon_商品列表_下架商品
        * lockup_goods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/product/offLine`,'json');
            if (callback) {callback(response);}
        },
        //slodon_商品列表_上架商品
        * put_goods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/product/inLine`,'json');
            if (callback) {callback(response);}
        },
        //slodon_商品列表_审核商品
        * audit_goods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/product/audit`,'json');
            if (callback) {callback(response);}
        }  
    }
   
}
