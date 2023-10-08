import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'full_discount',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        //循环满减列表
        * get_full_acm_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/admin/fullAcm/list', 'json');
            callback && callback(response);
        },
        //获取循环满减详情
        * get_full_acm_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/discount/admin/fullAcm/detail');
            callback && callback(response);
        },
        //删除循环满减
        * del_full_acm({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/admin/fullAcm/del');
            callback && callback(response);
        },
        //失效循环满减
        * invalid_full_acm({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/admin/fullAcm/invalid');
            callback && callback(response);
        },
        //阶梯满减列表
        * get_full_asm_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/admin/fullAsm/list', 'json');
            callback && callback(response);
        },
        //获取阶梯满减详情
        * get_full_asm_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/discount/admin/fullAsm/detail');
            callback && callback(response);
        },
        //删除阶梯满减
        * del_full_asm({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/admin/fullAsm/del');
            callback && callback(response);
        },
        //失效阶梯满减
        * invalid_full_asm({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/admin/fullAsm/invalid');
            callback && callback(response);
        },
        //满N元折扣列表
        * get_full_ald_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/admin/fullAld/list', 'json');
            callback && callback(response);
        },
        //获取满N元折扣详情
        * get_full_ald_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/discount/admin/fullAld/detail');
            callback && callback(response);
        },
        //删除满N元折扣
        * del_full_ald({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/admin/fullAld/del');
            callback && callback(response);
        },
        //失效满N元折扣
        * invalid_full_ald({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/admin/fullAld/invalid');
            callback && callback(response);
        },
        //满N件折扣列表
        * get_full_nld_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/admin/fullNld/list', 'json');
            callback && callback(response);
        },
        //获取满N件折扣详情
        * get_full_nld_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/discount/admin/fullNld/detail');
            callback && callback(response);
        },
        //删除满N件折扣
        * del_full_nld({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/admin/fullNld/del');
            callback && callback(response);
        },
        //失效满N件折扣
        * invalid_full_nld({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/admin/fullNld/invalid');
            callback && callback(response);
        }
    }
};
