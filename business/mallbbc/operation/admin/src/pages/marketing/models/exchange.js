import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'exchange',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        //查询兑换券详情
        * get_orderVoucher_productList({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/admin/voucher/productList', 'json');
            callback && callback(response);
        },
        //新增兑换券
        * get_orderVoucher_add({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/admin/voucher/add', 'json');
            callback && callback(response);
        },
        //编辑兑换券
        * voucher_update({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/admin/voucher/update', 'json');
            callback && callback(response);
        },
        //查询兑换券列表
        * get_orderVoucher_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/admin/voucher/list', 'json');
            callback && callback(response);
        },
        //导出
        *exportTxt({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/coupon/admin/voucher/exportTxt');
            callback && callback(response);
        },
        //失效兑换券
        * voucher_invalid({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/admin/voucher/invalid');
            callback && callback(response);
        },
        //审核兑换券
        * voucher_approve({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/admin/voucher/approve', 'json');
            callback && callback(response);
        },
        //查询兑换券详情
        * voucher_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/coupon/admin/voucher/detail');
            callback && callback(response);
        }
    }
};
