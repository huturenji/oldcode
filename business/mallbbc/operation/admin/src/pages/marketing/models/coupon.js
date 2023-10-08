import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'coupon',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        //获取优惠券详情
        * get_coupon_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/coupon/admin/coupon/detail');
            callback && callback(response);
        },
        //获取优惠券商品列表
        * get_coupon_goods_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/coupon/admin/coupon/productList');
            callback && callback(response);
        },
        //编辑优惠券
        * edit_coupon({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/admin/coupon/update', 'json');
            callback && callback(response);
        },
        //新增优惠券
        * add_coupon({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/admin/coupon/add', 'json');
            callback && callback(response);
        },
        //获取优惠券领取列表
        * get_coupon_receive_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/coupon/admin/coupon/receiveDetails');
            callback && callback(response);
        },
        //卡密导出
        *exportWithPass({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/coupon/admin/coupon/exportWithPass');
            callback && callback(response);
        },
        //审核优惠券
        * approve({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/admin/coupon/approve', 'json');
            callback && callback(response);
        },
        //操作记录列表
        * listRecord({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/coupon/admin/coupon/listRecord', 'json');
            callback && callback(response);
        },
        //获取优惠券列表接口
        * get_coupon_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/admin/coupon/list', 'json');
            callback && callback(response);
        },
        //删除优惠券
        * del_coupon({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/admin/coupon/del');
            callback && callback(response);
        },
        //失效优惠券
        * invalid_coupon({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/admin/coupon/invalid');
            callback && callback(response);
        },
        //复制优惠券
        * copy_coupon({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/admin/coupon/copy');
            callback && callback(response);
        },
        //推荐优惠券
        * recommend_coupon({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/admin/coupon/isRecommend');
            callback && callback(response);
        },
        //推荐优惠券
        * stop_coupon({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/admin/coupon/end');
            callback && callback(response);
        }
    }
};
