import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'advert',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        //运维平台_获取渠道列表
        * maintenance_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/channel/admin/listConfig');
            if (callback) {callback(response);}
        },
        //运维平台_新增渠道
        * maintenance_add({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/channel/admin/addConfig','json');
            if (callback) {callback(response);}
        },
        //运维平台_获取渠道
        * maintenance_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/channel/admin/getAccessConfig','json');
            if (callback) {callback(response);}
        },
        //运维平台_编辑渠道
        * maintenance_upData({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/channel/admin/updateConfig','json');
            if (callback) {callback(response);}
        },
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
        //运营平台_获取渠道操作日志
        * operation_log({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/channel/admin/getSystemLogs');
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
        //slodon_获取移动端装修列表
        * get_diy_page_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/mobileDeco/list');
            if (callback) {callback(response);}
        },
        //获取渠道下企业
        * get_allCompanyInfo({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/statistics/admin/buying/getAllCompanyInfo','json');
            if (callback) {callback(response);}
        },
        //新增或修改广告推送
        * addAndupdate({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/statistics/admin/buying/saveOrUpdateActivity','json');
            if (callback) {callback(response);}
        },
        //获取广告推送详情
        * get_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/statistics/admin/buying/selectActivityById','json');
            if (callback) {callback(response);}
        },
        //获取广告推送列表
        * get_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/statistics/admin/buying/selectActivityByPage','json');
            if (callback) {callback(response);}
        },
        //获取广告推送列表
        * cancel({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/statistics/admin/buying/terminationActivityById','json');
            if (callback) {callback(response);}
        }
    }
};
