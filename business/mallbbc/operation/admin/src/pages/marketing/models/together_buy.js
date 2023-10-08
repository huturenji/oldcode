import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'together_buy',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        // slodon_获取活动列表
        * get_activity_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/buyTogether/list', 'json');
            callback && callback(response);
        },
        // slodon_获取一起买活动详情
        * get_activity_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/admin/buyTogether/detail', 'json');
            callback && callback(response);
        },
        // slodon_新增活动
        * add_activity({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/buyTogether/add', 'json');
            callback && callback(response);
        },
        // slodon_删除活动
        * del_activity({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/admin/buyTogether/close', 'json');
            callback && callback(response);
        },
        // slodon_编辑活动
        * update_activity_swiper({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/buyTogether/update', 'json');
            callback && callback(response);
        },
        // slodon_审核活动
        * auditPromotion({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/buyTogether/auditPromotion', 'json');
            callback && callback(response);
        },        
        // slodon_获取一起买活动场次列表
        * get_stage_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/buyTogether/listStage', 'json');
            callback && callback(response);
        },
        // slodon_获取活动一起买商品列表
        * get_check_goods_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/buyTogether/listProduct', 'json');
            callback && callback(response);
        },
        // slodon_导出参与的活动商品
        * export_goods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/admin/buyTogether/exportProductList', 'json');
            callback && callback(response);
        }
    }
};
