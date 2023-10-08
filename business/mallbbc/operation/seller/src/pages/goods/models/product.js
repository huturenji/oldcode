import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'product',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        //slodon_获取分类列表_根据分类id获取下级分类
        * get_cate_list_by_id({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/seller/goodsCategory/list`);
            if (callback) {callback(response);}
        },
        //slodon_获取商品规格列表
        * get_goods_spec_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/seller/goodsSpec/list`,'json');
            if (callback) {callback(response);}
        },
        //slodon_添加商品规格
        * add_goods_spec({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/seller/goodsSpec/add`,'json');
            if (callback) {callback(response);}
        },
        //slodon_添加商品规格值
        * add_goods_spec_val({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/seller/goodsSpec/addSpecValue`,'json');
            if (callback) {callback(response);}
        },
        //slodon_批量设置推荐/取消推荐商品
        * set_goods_recommend({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/seller/product/isRecommend`,'json');
            if (callback) {callback(response);}
        },
        //slodon_获取商品标签列表
        * get_goods_label_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/seller/goodsLabel/list`,'json');
            if (callback) {callback(response);}
        },
        //slodon_删除商品标签
        * del_goods_label({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsLabel/del`);
            if (callback) {callback(response);}
        },
        //slodon_添加商品标签
        * add_goods_label({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsLabel/add`);
            if (callback) {callback(response);}
        },
        //slodon_编辑商品标签
        * edit_goods_label({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsLabel/edit`);
            if (callback) {callback(response);}
        },
        //slodon_获取分类绑定的品牌和属性信息
        * get_brand_attr_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/goods/seller/goodsAttribute/listByCategoryId');
            if (callback) {callback(response);}
        },
        //slodon_发布商品
        * add_goods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/product/add', 'json');
            if (callback) {callback(response);}
        },
        //slodon_获取店铺分类列表
        * get_store_category_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/seller/seller/storeCategory/list');
            if (callback) {callback(response);}
        },
        //slodon_获取商品详情
        * get_goods_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/goods/seller/product/getSpuInfo');
            if (callback) {callback(response);}
        },
        //slodon_编辑商品
        * edit_goods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/product/edit', 'json');
            if (callback) {callback(response);}
        },
        //slodon_获取在售商品列表
        * get_goods_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/product/search','json');
            if (callback) {callback(response);}
        },
        //slodon_根据状态查询商品列表
        * get_goods_lists_byState({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/product/listByState','json');
            if (callback) {callback(response);}
        },
        //slodon_获取下架商品列表
        * get_offLine_goods_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/product/listOffLine','json');
            if (callback) {callback(response);}
        },
        //slodon_商品列表_下架商品
        * offLine_goods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/seller/product/offLine`,'json');
            if (callback) {callback(response);}
        },
        //slodon_商品列表_上架商品
        * put_goods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/seller/product/inLine`,'json');
            if (callback) {callback(response);}
        },
        //slodon_商品列表_删除商品
        * del_goods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/seller/product/delete`,'json');
            if (callback) {callback(response);}
        },
        // slodon_获取关联版式列表
        * get_related_template_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/seller/goodsRelatedTemplate/list`);
            if (callback) {callback(response);}
        },
        //slodon_ 添加关联版式
        * add_related_template({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/seller/goodsRelatedTemplate/add`);
            if (callback) {callback(response);}
        },
        //slodon_获取关联版式详情
        * get_related_template_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/seller/goodsRelatedTemplate/details`);
            if (callback) {callback(response);}
        },
        //slodon_ 编辑关联版式
        * edit_related_template({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/seller/goodsRelatedTemplate/edit`);
            if (callback) {callback(response);}
        },
        //slodon_删除关联版式
        * del_related_template({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/seller/goodsRelatedTemplate/delete`);
            if (callback) {callback(response);}
        },
        //slodon_为商品批量设置关联版式
        * set_related_template({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/seller/product/setRelatedTemplate`,'json');
            if (callback) {callback(response);}
        },
        //slodon_获取属性分组列表
        * get_attribute_group_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/goodsParameterGroup/list','json');
            if (callback) {callback(response);}
        },
        //slodon_获取可用的属性分组列表
        * get_attribute_group_lists_can_use({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/goodsParameterGroup/list','json');
            if (callback) {callback(response);}
        },
        //slodon_添加属性分组
        * add_attribute_group({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/goodsParameterGroup/add','json');
            if (callback) {callback(response);}
        },
        //slodon_编辑属性分组
        * edit_attribute_group({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/goodsParameterGroup/edit','json');
            if (callback) {callback(response);}
        },
        //slodon_删除属性分组
        * del_attribute_group({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/goodsParameterGroup/del','json');
            if (callback) {callback(response);}
        },
        //slodon_获取属性列表
        * get_attribute_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/goodsParameter/list','json');
            if (callback) {callback(response);}
        },
        //slodon_获取可用的属性列表
        * get_attribute_lists_can_use({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/goodsParameter/list','json');
            if (callback) {callback(response);}
        },
        //slodon_添加属性
        * add_attribute({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/goodsParameter/add','json');
            if (callback) {callback(response);}
        },
        //slodon_编辑属性
        * edit_attribute({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/goodsParameter/edit','json');
            if (callback) {callback(response);}
        },
        //slodon_删除属性
        * del_attribute({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/goodsParameter/del','json');
            if (callback) {callback(response);}
        },
        //slodon_申请通过的商品分类
        * get_system_seller_cate_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/goods/seller/category/getStoreBindCategoryTree');
            if (callback) {callback(response);}
        },
        //slodon_验证是否允许发布商品
        * check_is_allow_add_goods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/goods/seller/product/enablePublish');
            if (callback) {callback(response);}
        },
        //slodon_获取首页店铺信息
        * get_store_info({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/seller/seller/store/indexStoreInfor');
            if (callback) {callback(response);}
        }
    }
};
