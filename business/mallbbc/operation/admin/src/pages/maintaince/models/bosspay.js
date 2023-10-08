import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'bosspay',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        //运维平台_获取老板付列表
        * list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/payment/admin/listBossPayConfig');
            if (callback) {callback(response);}
        },
        //运维平台_获取老板付详情
        * detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/payment/admin/getBossPayConfig');
            if (callback) {callback(response);}
        },
        //运维平台_新增老板付
        * add({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/payment/admin/addBossPayConfig','json');
            if (callback) {callback(response);}
        },
        //运维平台_编辑老板付
        * upData({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/payment/admin/updateBossPayConfig','json');
            if (callback) {callback(response);}
        }
    }
};
