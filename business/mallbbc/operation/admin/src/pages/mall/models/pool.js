import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'pool',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        //新增商品池
        * productpool_add({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/productpool/add`,'json');
            if (callback) {callback(response);}
        },
        //编辑商品池
        * productpool_edit({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/productpool/edit`,'json');
            if (callback) {callback(response);}
        },
        //商品池列表
        * getPage({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/productpool/getPage`,'json');
            if (callback) {callback(response);}
        },
        //删除商品池
        *delete_productpool({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/productpool/delete`);
            if (callback) {callback(response);}
        },
        //获取商品池列表详情
        *productpool_getDetail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/productpool/getDetail`);
            if (callback) {callback(response);}
        }  
    }
   
}
