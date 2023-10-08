import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'vendor',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        //slodon_编辑店铺基本信息
        * save_vendor_base_info({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/seller/store/updateSetting');
            if (callback) {callback(response);}
        },
        //slodon_获取商户品牌列表
        * get_brand_apply_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/Brand/applyList','json');
            if (callback) {callback(response);}
        },
        //slodon_申请品牌
        * apply_brand({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/Brand/apply','json');
            if (callback) {callback(response);}
        },
        //slodon_编辑品牌
        * edit_brand({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/Brand/edit','json');
            if (callback) {callback(response);}
        },
        //slodon_删除品牌
        * del_brand({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/Brand/del','json');
            if (callback) {callback(response);}
        },
        //slodon_获取商户品牌列表
        * get_brand_select_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/Brand/list','json');
            if (callback) {callback(response);}
        }
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                data: action.payload.data
            };
        },
        changeLoading(state, action) {
            return {
                ...state,
                loading: action.payload
            };
        }
    }
};
