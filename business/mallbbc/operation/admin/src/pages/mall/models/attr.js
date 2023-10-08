import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'attr',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        //slodon_获取属性列表
        * get_search_attr_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsAttribute/list`,'json');
            if (callback) {callback(response);}
        },
        //slodon_添加属性
        * add_search_attr({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsAttribute/add`,'json');
            if (callback) {callback(response);}
        },
        //slodon_删除属性
        * del_search_attr({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsAttribute/del`,'json');
            if (callback) {callback(response);}
        },
        //slodon_编辑属性
        * edit_search_attr({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsAttribute/edit`,'json');
            if (callback) {callback(response);}
        }
    }
   
}
