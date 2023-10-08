import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'goodsgroup',
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
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/lowpriceproductpool/add`,'json');
            if (callback) {callback(response);}
        },
        //编辑商品池
        * productpool_edit({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/lowpriceproductpool/edit`,'json');
            if (callback) {callback(response);}
        },
        //商品池列表
        * getPage({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/lowpriceproductpool/getPage`,'json');
            if (callback) {callback(response);}
        },
        //删除商品池
        *delete_productpool({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/lowpriceproductpool/delete`);
            if (callback) {callback(response);}
        },

        //获取商品池详情 分组信息
        *productpool_getDetail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/lowpriceproductpool/getDetail`);
            if (callback) {callback(response);}
        },
        // 新增商品信息 (导入和手动添加)
        * productpool_addSku({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/lowpriceproductpool/addSku`,'json');
            if (callback) {callback(response);}
        },
        //根据分组id 查询商品列表 
        *productpool_getGoodsDetail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/lowpriceproductpool/getGoodsDetail`);
            if (callback) {callback(response);}
        },
        //删除 分组下的商品
        *deleteSku({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/lowpriceproductpool/deleteSku`);
            if (callback) {callback(response);}
        }   
    }
   
}
