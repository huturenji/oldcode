import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'seckill',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
    // slodon_获取秒杀标签列表
        * get_label_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/seckillLabel/page', 'json');
            callback && callback(response);
        },
        // slodon_删除秒杀标签
        * del_label({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/admin/seckillLabel/delete', 'json');
            callback && callback(response);
        },
        // slodon_添加秒杀标签
        * add_label({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/seckillLabel/add', 'json');
            callback && callback(response);
        },
        // slodon_编辑秒杀标签
        * edit_label({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/seckillLabel/update', 'json');
            callback && callback(response);
        },
        // slodon_更改秒杀标签状态
        * switch_label({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/admin/seckillLabel/updateState', 'json');
            callback && callback(response);
        },
        // slodon_获取活动列表
        * get_activity_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/seckill/listPage', 'json');
            callback && callback(response);
        },
        // slodon_获取秒杀活动详情 no used
        * get_activity_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/Seckill/getSeckill');
            callback && callback(response);
        },
        // slodon_新增活动
        * add_activity({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/seckill/add', 'json');
            callback && callback(response);
        },
        // slodon_删除活动
        * del_activity({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/admin/seckill/delete', 'json');
            callback && callback(response);
        },
        // slodon_获取活动场次列表
        * get_detail_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/seckill/pageSeckillStage', 'json');
            callback && callback(response);
        },
        // slodon_设置活动轮播图 no used
        * set_activity_swiper({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/Seckill/setBanner');
            callback && callback(response);
        },
        // slodon_获取当前场次的参与的商品列表（spu）
        * get_seckill_goods_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/seckill/listPageSeckillProduct','json');
            callback && callback(response);
        },
        // slodon_删除参与的活动商品
        * del_goods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/seckill/deleteProduct','json');
            callback && callback(response);
        },
        // slodon_审核参与的活动商品
        * check_goods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/seckill/audit','json');
            callback && callback(response);
        },
        // 更改当前场次的参与的商品列表的排序
        * refreshSort({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/admin/seckill/sort','json');
            callback && callback(response);
        },
        // 编辑秒杀活动
        * seckill_update({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/seckill/update','json');
            callback && callback(response);
        },
        // 审核秒杀活动
        * auditPromotion({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/seckill/auditPromotion','json');
            callback && callback(response);
        }
    }
};
