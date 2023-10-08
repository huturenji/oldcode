import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'maintaince_channel',
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
        }
    }
};
