import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'global',

    state: {
        collapsed: false,
        notices: []
    },

    effects: {
    //修改密码
        *change_manager_pwd({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload,'post','v3/system/admin/adminUser/updatePwd','', true);
            if (callback) {callback(response);}
        }
    },

    reducers: {
        changeLayoutCollapsed(state, { payload }) {
            return {
                ...state,
                collapsed: payload
            };
        },
        // eslint-disable-next-line no-unused-vars
        getLayoutCollapsed(state, { payload }) {
            return {
                ...state
            };
        }
    },

    subscriptions: {
        setup({ history }) {
            // Subscribe history(url) change, trigger `load` action if pathname is `/`
            return history.listen(({ pathname, search }) => {
                if (typeof window.ga !== 'undefined') {
                    window.ga('send', 'pageview', pathname + search);
                }
            });
        }
    }
};
