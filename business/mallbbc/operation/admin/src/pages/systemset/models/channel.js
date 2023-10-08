import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'systemset_channel',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {

        //运营平台_获取未开通渠道列表
        * operation_optional({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/channel/admin/listOptionalChannel');
            if (callback) {callback(response);}
        },
        //运营平台_获取渠道列表
        * operation_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/channel/admin/list');
            if (callback) {callback(response);}
        },
        //运营平台_获取渠道详情
        * operation_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/channel/admin/get');
            if (callback) {callback(response);}
        },

        //运营平台_新增渠道
        * operation_add({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/channel/admin/add','json');
            if (callback) {callback(response);}
        },
        //运营平台_编辑渠道
        * operation_upData({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/channel/admin/update','json');
            if (callback) {callback(response);}
        },
        //运营平台_启用停用渠道
        * operation_setState({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/channel/admin/setState','json');
            if (callback) {callback(response);}
        },
        //slodon_获取自营店铺列表
        * get_own_store_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/seller/admin/opt/listStore');
            if (callback) {callback(response);}
        },
        //运营平台_获取所有支付方式
        * operation_available({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/payment/admin/getAvailableMethods');
            if (callback) {callback(response);}
        }

    }
};
