import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'conscoupon',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        //获取优惠券列表接口
        * get_coupon_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/conscoupon/seller/consumeCoupon/list', 'json');
            callback && callback(response);
        },
        //新增消费券
        * add_coupon({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/conscoupon/seller/consumeCoupon/add', 'json');
            callback && callback(response);
        },
        //编辑消费券
        * update({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/conscoupon/seller/consumeCoupon/update', 'json');
            callback && callback(response);
        },
        //查看消费券详情
        * get_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/conscoupon/seller/consumeCoupon/detail');
            callback && callback(response);
        },
        //卡密导出
        *exportWithPass({ payload, callback },{ call }){
            const response = yield call(sldCommonService, payload, 'get', 'v3/conscoupon/seller/consumeCoupon/exportWithPass');
            callback && callback(response);
        },
        //消费券审核
        * approve({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/conscoupon/seller/consumeCoupon/approve','json');
            callback && callback(response);
        },
        //审核日志
        * listRecord({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/conscoupon/seller/consumeCoupon/listRecord');
            callback && callback(response);
        },

        //失效
        * invalid({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/conscoupon/seller/consumeCoupon/invalid');
            callback && callback(response);
        },
        //删除
        * del({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/conscoupon/seller/consumeCoupon/del');
            callback && callback(response);
        },
        //终止
        * end({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/conscoupon/seller/consumeCoupon/end');
            callback && callback(response);
        },


        //领取列表
        * receiveList({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/conscoupon/seller/consumeCoupon/receiveList','json');
            callback && callback(response);
        },
        //领取详情
        * receiveDetails({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/conscoupon/seller/consumeCoupon/receiveDetails');
            callback && callback(response);
        },
        //根据劵码查询详情
        * getCouponDetail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/conscoupon/seller/consumeCoupon/getCouponDetail');
            callback && callback(response);
        },

        //核销
        * audit({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/conscoupon/seller/consumeCoupon/audit');
            callback && callback(response);
        },

        //添加备注
        * updateRemarks({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/conscoupon/seller/consumeCoupon/updateRemarks','json');
            callback && callback(response);
        }
    }
};
