import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'decocoms',
    state: {
        storeList: [],
        seckillStoreList: []
    },

    effects: {
        // slodon_获取自营店铺列表
        * get_own_store_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/seller/admin/opt/listStore');
            if (callback) {callback(response);}
        }  
    },
 
    reducers: {
        setParams(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        }
    }
};
