import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'redpacket',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        //获取红包活动详情
        * get_redpacket_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/redpacket/admin/redpacket/detail');
            callback && callback(response);
        },
        //获取红包活动商品列表
        * get_redpacket_goods_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/redpacket/admin/redpacket/productList');
            callback && callback(response);
        },
        //编辑红包活动
        * edit_redpacket({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/redpacket/admin/redpacket/update', 'json');
            callback && callback(response);
        },
        //新增红包活动
        * add_redpacket({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/redpacket/admin/redpacket/add', 'json');
            callback && callback(response);
        },
        //获取红包活动领取列表
        * get_redpacket_receive_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/redpacket/admin/redpacket/receiveDetails');
            callback && callback(response);
        },
        //审核红包活动
        * approve({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/redpacket/admin/redpacket/approve', 'json');
            callback && callback(response);
        },
        //操作记录列表
        * listRecord({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/redpacket/admin/redpacket/listRecord', 'json');
            callback && callback(response);
        },
        //获取红包活动列表接口
        * get_redpacket_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/redpacket/admin/redpacket/list', 'json');
            callback && callback(response);
        },
        //删除红包活动
        * del_redpacket({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/redpacket/admin/redpacket/del');
            callback && callback(response);
        },
        //失效红包活动
        * invalid_redpacket({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/redpacket/admin/redpacket/invalid');
            callback && callback(response);
        },
        //复制红包活动
        * copy_redpacket({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/redpacket/admin/redpacket/copy');
            callback && callback(response);
        },
        //终止领取活动
        * stop_redpacket({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/redpacket/admin/redpacket/end');
            callback && callback(response);
        },
        //卡密导出
        *exportWithPass({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/redpacket/admin/redpacket/exportWithPass');
            callback && callback(response);
        },
        //领取记录导出
        *exportReceiveInfo({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/redpacket/admin/redpacket/receiveDetailsExport');
            callback && callback(response);
        },
        //红包消费明细
        *useDetail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/redpacket/admin/redpacket/useDetail');
            callback && callback(response);
        }
    }
};
