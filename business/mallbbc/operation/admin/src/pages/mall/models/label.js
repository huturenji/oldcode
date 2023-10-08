import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'label',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        //slodon_获取商品标签列表
        * get_goods_label_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/label/list`,'json');
            if (callback) {callback(response);}
        },
        //slodon_删除商品标签
        * del_goods_label({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/label/del`,'json');
            if (callback) {callback(response);}
        },
        //slodon_添加商品标签
        * add_goods_label({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/label/add`,'json');
            if (callback) {callback(response);}
        },
        //slodon_编辑商品标签
        * edit_goods_label({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/label/edit`,'json');
            if (callback) {callback(response);}
        }
    }
   
}
