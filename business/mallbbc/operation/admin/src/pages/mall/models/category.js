import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'category',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        //slodon_获取分类树数据
        * get_cate_tree_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/category/getCategoryTree`);
            if (callback) {callback(response);}
        },
        //slodon_获取分类列表_根据分类id获取下级分类
        * get_cate_list_by_id({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/category/list`, 'json');
            if (callback) {callback(response);}
        },
        //slodon_添加商品分类
        * add_goods_cat({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/category/add`, 'json');
            if (callback) {callback(response);}
        },
        //slodon_编辑商品分类
        * edit_goods_cat({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/category/edit`, 'json');
            if (callback) {callback(response);}
        },
        //slodon_删除商品分类
        * del_goods_cat({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/category/del`);
            if (callback) {callback(response);}
        },
        // 设置分类启用禁用状态
        * updateState({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/category/updateState`);
            if (callback) {callback(response);}
        },
        // 设置分类显示和隐藏状态
        * updateShow({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/category/updateShow`);
            if (callback) {callback(response);}
        },
        //slodon_初始化分类。20211231，bbcg2重构新增
        * init_category_tree({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/category/init`);
            if (callback) {callback(response);}
        },
        //slodon_获取vop分类树。20211231，bbcg2重构新增
        * get_categorytree_vop({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/category/getTreeFromVop`);
            if (callback) {callback(response);}
        }   
    }
   
}
