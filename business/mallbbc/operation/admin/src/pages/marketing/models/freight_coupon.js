import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'freight_coupon',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        //获取运费券详情
        * get_freightcoupon_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/cashcoupon/admin/freightcoupon/detail');
            callback && callback(response);
        },
        //编辑运费券
        * edit_freightcoupon({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/cashcoupon/admin/freightcoupon/update', 'json');
            callback && callback(response);
        },
        //新增运费券
        * add_freightcoupon({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/cashcoupon/admin/freightcoupon/add', 'json');
            callback && callback(response);
        },
        //获取运费券领取列表
        * get_freightcoupon_receive_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/cashcoupon/admin/freightcoupon/receiveDetails', 'json');
            callback && callback(response);
        },
        //审核运费券
        * approve({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/cashcoupon/admin/freightcoupon/audit', 'json');
            callback && callback(response);
        },
        //操作记录列表
        * listRecord({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/cashcoupon/admin/freightcoupon/listRecord', 'json');
            callback && callback(response);
        },
        //获取运费券列表接口
        * get_freightcoupon_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/cashcoupon/admin/freightcoupon/list', 'json');
            callback && callback(response);
        },
        //删除运费券
        * del_freightcoupon({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/cashcoupon/admin/freightcoupon/del');
            callback && callback(response);
        },
        //失效运费券
        * invalid_freightcoupon({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/cashcoupon/admin/freightcoupon/invalid');
            callback && callback(response);
        },
        //复制运费券
        * copy_freightcoupon({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/cashcoupon/admin/freightcoupon/copy');
            callback && callback(response);
        },
        //卡密导出
        *exportWithPass({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/cashcoupon/admin/freightcoupon/exportWithPwd');
            callback && callback(response);
        },
        //领取记录导出
        *exportReceiveInfo({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/cashcoupon/admin/freightcoupon/exportReceiveInfo');
            callback && callback(response);
        }
    }
};
