import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'order',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
    //slodon_获取订单列表
        * get_order_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/business/seller/orderInfo/list','json');
            if (callback) {callback(response);}
        },
        //slodon_获取订单详情
        * get_order_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/business/seller/orderInfo/detail');
            if (callback) {callback(response);}
        },
        //slodon_导出订单
        * export_order_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/business/seller/orderInfo/export');
            if (callback) {callback(response);}
        },
        //slodon_获取订单取消/退换货理由
        * get_order_reason({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/seller/reason/list');
            if (callback) {callback(response);}
        },
        //获取物流轨迹
        * get_flow({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/business/seller/logistics/order/getTrace');
            callback && callback(response);
        },
        //取消订单接口
        * cancle_order({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/business/seller/orderInfo/cancel');
            callback && callback(response);
        },
        //确认发货
        * confirm_delivery({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/business/seller/orderInfo/deliver');
            callback && callback(response);
        },
        //获取快递公司
        * get_express({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/seller/seller/express/list');
            callback && callback(response);
        },
        //slodon_获取发货/退货地址列表
        * get_return_address_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/seller/seller/address/list');
            if (callback) {callback(response);}
        },
        //slodon_添加发货/退货地址
        * add_return_address({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/seller/address/add');
            if (callback) {callback(response);}
        },
        //slodon_编辑发货/退货地址
        * edit_return_address({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/seller/address/edit');
            if (callback) {callback(response);}
        },
        //slodon_删除发货/退货地址
        * del_return_address({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/seller/address/del');
            if (callback) {callback(response);}
        },
        //slodon_设置默认发货/退货地址
        * set_return_address_default({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/seller/address/isDefault');
            if (callback) {callback(response);}
        },
        //slodon_获取商品评价列表
        * get_goods_comment_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/goods/seller/goodsComment/list');
            if (callback) {callback(response);}
        },
        //slodon_商家回复评价
        * comment_replay({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/seller/goodsComment/editReply');
            if (callback) {callback(response);}
        },
        //slodon_获取店铺评价列表
        * get_store_comment_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/seller/seller/storeComment/list');
            if (callback) {callback(response);}
        },
        //slodon_获取拼团订单列表
        * get_spell_group_order_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/seller/spell/order/spellList');
            if (callback) {callback(response);}
        },
        //订单标记
        *doMark({ payload, callback },{ call }){
            const response = yield call(sldCommonService, payload, 'post', 'v3/business/seller/orderInfo/doMark','json');
            callback && callback(response);
        },
        //标记详情
        *markDetail({ payload, callback },{ call }){
            const response = yield call(sldCommonService, payload, 'get', 'v3/business/seller/orderInfo/markDetail');
            callback && callback(response);
        },
        //会员详情
        * get_member_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/member/seller/member/detail`);
            if (callback) { callback(response); }
        }
    }
};
