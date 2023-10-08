import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'member_manage',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        /*-------会员管理-会员列表 模块-start-----*/

        //slodon_新增会员
        * add_member_members({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/member/admin/member/add');
            if (callback) { callback(response); }
        },
        //slodon_编辑会员
        * edit_member({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/member/admin/member/edit');
            if (callback) { callback(response); }
        },
        //slodon_修改会员状态
        * switch_member_state({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/member/admin/member/editState');
            if (callback) { callback(response); }
        },
        //slodon_会员积分变更
        * set_member_point({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/member/admin/member/editMemberIntegral');
            if (callback) { callback(response); }
        },
        //slodon_会员管理_修改会员密码
        * change_member_pwd({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/member/admin/member/editPwd');
            if (callback) { callback(response); }
        },
        //slodon_会员列表-会员详情
        * get_member_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/member/admin/member/detail`);
            if (callback) { callback(response); }
        },

        /*-------会员管理-会员列表 模块-end-----*/

        /*-------会员管理-充值管理 模块-start-----*/

        //slodon_获取会员充值记录
        * get_recharge_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/member/admin/balanceRecharge/list');
            if (callback) { callback(response); }
        },
        //slodon_删除充值记录
        * del_recharge_log({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/member/admin/balanceRecharge/del');
            if (callback) { callback(response); }
        },
        //slodon_充值记录付款
        * pay_recharge_log({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/member/admin/balanceRecharge/toPay');
            if (callback) { callback(response); }
        },
        //slodon_获取充值统计数据
        * get_recharge_stat({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/member/admin/balanceRecharge/getSum');
            if (callback) { callback(response); }
        },

        /*-------会员管理-充值管理 模块-start-----*/

        /*-------会员管理-资金明细 模块-start-----*/

        //slodon_获取资金明细列表
        * get_balance_log({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/member/admin/balanceLog/list');
            if (callback) { callback(response); }
        },
        //slodon_资金明细导出
        * export_balance_log({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/member/admin/balanceLog/memberBalanceLogExport');
            if (callback) { callback(response); }
        }

        /*-------会员管理-资金明细 模块-end-----*/
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                data: action.payload.data
            };
        },
        changeLoading(state, action) {
            return {
                ...state,
                loading: action.payload
            };
        }
    }
};
