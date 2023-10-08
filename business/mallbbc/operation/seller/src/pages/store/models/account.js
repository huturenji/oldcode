import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'account',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
    //slodon_权限管理_获取权限组列表
        * get_role_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/seller/seller/roles/list');
            if (callback) {callback(response);}
        },
        //slodon_权限管理_添加权限组
        * add_role({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/seller/roles/add');
            if (callback) {callback(response);}
        },
        //slodon_权限管理_编辑权限组
        * edit_role({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/seller/roles/update');
            if (callback) {callback(response);}
        },
        //slodon_权限管理_删除权限组
        * del_role({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/seller/roles/delete');
            if (callback) {callback(response);}
        },
        //slodon_权限管理_获取操作员列表
        * get_admin_member({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/seller/seller/vendor/list');
            if (callback) {callback(response);}
        },
        //slodon_权限管理_添加操作员
        * add_admin_member({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/seller/vendor/add');
            if (callback) {callback(response);}
        },
        //slodon_权限管理_编辑操作员
        * edit_admin_member({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/seller/vendor/edit');
            if (callback) {callback(response);}
        },
        //slodon_权限管理_删除操作员
        * del_admin_member({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/seller/vendor/del');
            if (callback) {callback(response);}
        },
        //slodon_权限管理_冻结/解冻操作员
        * freeze_admin_member({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/seller/vendor/isFreeze');
            if (callback) {callback(response);}
        },
        //slodon_权限管理_获取权限列表
        * get_all_permission({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/seller/seller/resource/list');
            if (callback) {callback(response);}
        },
        //slodon_权限管理_角色绑定权限
        * bind_role_permission({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/seller/roles/saveRoleResource');
            if (callback) {callback(response);}
        },
        //slodon_权限管理_重置密码
        * reset_admin_member_pwd({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/seller/vendor/resetPassword');
            if (callback) {callback(response);}
        },
        //slodon_权限管理_重置密码
        * get_msg_type_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/msg/seller/msg/setting/receiveList');
            if (callback) {callback(response);}
        },
        //slodon_权限管理_接收消息设置
        * bind_role_msg_type({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/msg/seller/msg/setting/roleReceiveSetting');
            if (callback) {callback(response);}
        }
    }
};
