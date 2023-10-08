import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'project',

    state: {
        notice: []
    },

    effects: {
    //slodon_获取系统配置信息
        * get_system_info({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/system/seller/setting/getSettingList`);
            if (callback) {callback(response);}
        },
        //slodon_获取分类列表_根据分类id获取下级分类
        * get_cate_list_by_id({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/goodsCategory/list`);
            if (callback) {callback(response);}
        },
        //slodon_获取商品列表（用于秒杀商品的选择）
        * get_seckill_goods_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/goods/seller/goodsSeckill/goodsList');
            if (callback) {callback(response);}
        },
        //获取商品列表
        * get_goods_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/goods/seller/goods/list');
            if (callback) {callback(response);}
        },
        //根据关键字搜索商品列表
        * get_search_by_keyword({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/product/searchByKeyword','json');
            if (callback) {callback(response);}
        },
        //sku批量导入商品列表
        * get_list_by_skus({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/product/listBySkus','json');
            if (callback) {callback(response);}
        },
        // 选择商品下的货品列表
        * get_presale_goods_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/seller/preSell/productList');
            if (callback) {callback(response);}
        },
        //获取优惠券列表（只获取未开始和进行中的）
        * get_voucher_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/seller/coupon/list','json');
            if (callback) {callback(response);}
        },
        //获取赠送优惠券列表（只获取未开始和进行中的）
        * get_voucher_send_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/coupon/seller/coupon/sendList');
            if (callback) {callback(response);}
        },
        //获取平台商品分类树
        * get_system_cat_tree({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/goods/seller/goodsCategory/getCateTree');
            if (callback) {callback(response);}
        },
        //获取平台商品分类树——有三级的才显示，没有的不显示
        * get_system_cat_tree_grade3({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/goods/seller/goodsCategory/getCateList');
            if (callback) {callback(response);}
        },
        //slodon_获取分类列表
        * get_cate_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/seller/category/getCategoryTree`, 'json');
            if (callback) {callback(response);}
        },
        //推手——获取店铺商品列表用于导入推手商品
        * get_goods_list_to_import_spreader({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/spreader/seller/spreaderGoods/goodsList');
            if (callback) {callback(response);}
        },
        //推手——获取商品标签列表
        * get_spreader_goods_label_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/spreader/seller/spreaderGoodsLabel/list');
            if (callback) {callback(response);}
        },
        //获取会员列表
        * get_member_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/member/seller/member/list');
            if (callback) {callback(response);}
        },
        //获取会员列表  用来导入和查看 无分页
        * get_member_detail_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/member/seller/member/detailList','json');
            if (callback) {callback(response);}
        },
        //根据商品名称查询税率
        * getGoodsTaxCode({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/product/getGoodsTaxCode','json');
            if (callback) {callback(response);}
        },
        //一起买场次列表
        * get_buyTogether_stage({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/buyTogether/listStage','json');
            if (callback) {callback(response);}
        },
        //查询已参加活动的商品
        * get_productState_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/common/listJoinPromotionSkus','json');
            if (callback) {callback(response);}
        },
        //查询满优惠操作记录
        * getfullRecord({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/discount/seller/common/getRecord');
            callback && callback(response);
        },
        //行为记录
        * listRecord({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/seller/common/listRecord');
            callback && callback(response);
        },
        //门店下拉
        * getOfflineShop({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/seller/seller/offlineShop/list');
            callback && callback(response);
        },
        //获取一起买列表（只获取未开始和进行中的） （装修- 模块）
        * get_buytogether_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/buyTogether/list', 'json');
            callback && callback(response);
        },
        //获取天天买列表（只获取未开始和进行中的） （装修- 模块）
        // * get_buyeveryday_list({ payload, callback }, { call }) {
        //     const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/buyEveryday/listPage','json');
        //     callback && callback(response);
        // },
        * get_singin_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/marketing/seller/sign/list','json');
            callback && callback(response);
        },
        //获取运费券列表接口
        // * get_freightcoupon_lists({ payload, callback }, { call }) {
        //     const response = yield call(sldCommonService, payload, 'post', 'v3/cashcoupon/admin/freightcoupon/list', 'json');
        //     callback && callback(response);
        // },
        //获取消费券列表接口
        * get_conscoupon_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/conscoupon/seller/consumeCoupon/list', 'json');
            callback && callback(response);
        },
        //slodon_获取所有秒杀活动列表
        * get_all_seckill_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/seckill/listPage', 'json');
            callback && callback(response);
        }
    },

    reducers: {
        saveNotice(state, action) {
            return {
                ...state,
                notice: action.payload
            };
        }
    }
};
