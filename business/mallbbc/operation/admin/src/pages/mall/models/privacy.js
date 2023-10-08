import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'privacy',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        // 获取都在买隐私分类数据
        * get_privacyCategory_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/statistics/admin/buying/goodsPrivacyCategoryList`);
            if (callback) {callback(response);}
        },
        // 获取都在买隐私三级分类数量
        * get_privacyCategory_count({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/statistics/admin/buying/getPrivacyCount`);
            if (callback) {callback(response);}
        },
        // 修改都在买分类隐私设置
        * update_privacyCategory({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/statistics/admin/buying/updatePrivacyState`);
            if (callback) {callback(response);}
        }   
    }
   
}
