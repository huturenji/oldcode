import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'sign_manage',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        //签到活动列表
        * get_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/marketing/admin/sign/list','json');
            callback && callback(response);
        },
        //签到活动
        * add({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/marketing/admin/sign/add','json');
            callback && callback(response);
        },
        //签到活动详情
        * detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/marketing/admin/sign/detail');
            callback && callback(response);
        },
        //签到活动记录
        * getRecord({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/marketing/admin/sign/getRecord');
            callback && callback(response);
        },
        //签到活动审核
        * signAudit({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/marketing/admin/sign/audit','json');
            callback && callback(response);
        },
        //编辑签到活动
        * edit({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/marketing/admin/sign/update','json');
            callback && callback(response);
        },

        //删除签到活动
        * del({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/marketing/admin/sign/del');
            callback && callback(response);
        },

        //失效签到活动
        * invalid({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/marketing/admin/sign/invalid');
            callback && callback(response);
        },

        //获取签到统计列表
        * getStatisticsList({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/marketing/admin/sign/statistics/list');
            callback && callback(response);
        },
        //获取签到统计详情
        * getStatisticsDetail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/marketing/admin/sign/statistics/detail');
            callback && callback(response);
        }
    }
};
