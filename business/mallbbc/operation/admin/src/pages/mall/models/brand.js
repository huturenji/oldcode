import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'brand',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        // 品牌  获取品牌列表
        * get_brand_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsBrand/list`,'json');
            if (callback) {callback(response);}
        },
        //品牌 删除品牌
        * del_brand({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsBrand/del`,'json');
            if (callback) {callback(response);}
        },
        //品牌 添加品牌
        * add_goods_brand({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsBrand/add`,'json');
            if (callback) {callback(response);}
        },
        //品牌 编辑品牌
        * edit_goods_brand({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsBrand/edit`,'json');
            if (callback) {callback(response);}
        },
        // 品牌 获取待审核品牌列表
        * get_check_brand_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsBrand/applyList`,'json');
            if (callback) {callback(response);}
        },
        //品牌 审核品牌
        * check_brand({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsBrand/audit`,'json');
            if (callback) {callback(response);}
        }
    }
   
}
