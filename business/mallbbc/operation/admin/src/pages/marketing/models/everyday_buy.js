import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'everyday_buy',
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
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/buyEveryday/listPage', 'json');
            callback && callback(response);
        },
        // slodon_获取一起买活动详情
        * get_activity_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/admin/buyEveryday/detail', 'json');
            callback && callback(response);
        },
        // slodon_新增活动
        * add_activity({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/buyEveryday/add', 'json');
            callback && callback(response);
        },
        // slodon_删除活动
        * del_activity({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/admin/buyEveryday/close', 'json');
            callback && callback(response);
        },
        // slodon_设置活动轮播图
        * update_activity({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/buyEveryday/update', 'json');
            callback && callback(response);
        },
        // slodon_获取一起买活动场次列表
        * get_stage_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/admin/buyEverydayStage/list', 'json');
            callback && callback(response);
        },
        // slodon_获取活动一起买商品列表
        * get_check_goods_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/buyEveryday/pagePromotionBindProduct', 'json');
            callback && callback(response);
        },
        // slodon_导出参与的活动商品
        * export_goods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/admin/buyEverydayProduct/exportList', 'json');
            callback && callback(response);
        },
        // 更改当前场次的参与的商品列表的排序
        * refreshSort({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/admin/buyEveryday/sort', 'json');
            callback && callback(response);
        },
        // slodon_审核活动
        * auditPromotion({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/buyEveryday/auditPromotion', 'json');
            callback && callback(response);
        },            
        // slodon_删除活动
        * delete_buyEveryday({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/admin/buyEveryday/delete', 'json');
            callback && callback(response);
        }
    }
};
