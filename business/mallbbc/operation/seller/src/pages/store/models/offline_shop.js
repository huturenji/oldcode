import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'offline_shop',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        // 新增门店
        * add_offlineShop({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/seller/offlineShop/add','json');
            if (callback) {callback(response);}
        },
        // 编辑门店
        * edit_offlineShop({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/seller/offlineShop/edit','json');
            if (callback) {callback(response);}
        },
        // 启用停用
        * change_state({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/seller/offlineShop/state','json');
            if (callback) {callback(response);}
        },
        // 查看详情
        * get_offlineShop_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/seller/seller/offlineShop/detail');
            if (callback) {callback(response);}
        },
        // 获取门店列表
        * get_offlineShop_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/seller/seller/offlineShop/page');
            if (callback) {callback(response);}
        }
    },

    reducers: {
        
    }
};
