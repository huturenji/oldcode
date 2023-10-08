import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'consumer_coupon',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        //获取消费券列表接口
        * get_conscoupon_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/conscoupon/admin/consumeCoupon/list', 'json');
            callback && callback(response);
        },
        //获取消费券列表接口
        * get_conscoupon_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/conscoupon/admin/consumeCoupon/detail', 'json');
            callback && callback(response);
        },
        //获取消费券列表接口
        * get_conscoupon_receive_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/conscoupon/admin/consumeCoupon/receiveList', 'json');
            callback && callback(response);
        },
        // slodon_获取自营店铺列表
        * get_own_store_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/seller/admin/opt/listStore');
            if (callback) {callback(response);}
        } 
    }
};
