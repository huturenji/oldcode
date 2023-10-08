import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'point_mall',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {

        /*-------积分商城-手机装修 模块-start-----*/
        //slodon_手机装修_获取装修页列表
        * get_diy_page_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/mobileDeco/list');
            if (callback) {callback(response);}
        },
        //slodon_手机装修_添加移动端装修页面
        * add_m_diy_page({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/mobileDeco/add');
            if (callback) {callback(response);}
        },
        //slodon_手机装修_编辑移动端装修页面
        * edit_m_diy_page({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/mobileDeco/update');
            if (callback) {callback(response);}
        },
        //slodon_手机装修_删除移动端装修页面
        * del_m_diy_page({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/mobileDeco/del');
            if (callback) {callback(response);}
        },
        //slodon_手机装修_启用/停用移动端装修页面
        * set_m_diy_page({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/mobileDeco/isUse');
            if (callback) {callback(response);}
        },
        //slodon_手机装修_复制移动端装修页面
        * copy_m_diy_page({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/mobileDeco/copy');
            if (callback) {callback(response);}
        },
        //slodon_手机装修_获取移动端装修页面详情
        * get_diy_page_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/mobileDeco/detail');
            if (callback) {callback(response);}
        },
        //slodon_手机装修_获取移动端装修页面菜单数据
        * get_m_diy_menu({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/tplMobile/menu');
            if (callback) {callback(response);}
        },
        /*-------积分商城-手机装修 模块-end-----*/

        /*-------积分商城-标签管理 模块-start-----*/
        //slodon_更新积分商品积分换算比例
        * updatePointRate({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/integral/admin/integral/goods/platformShelf');
            if (callback) {callback(response);}
        },
        //slodon_更新es积分商品数据(积分商城——积分设置 模块)
        * updateEsPointGoods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/integral/admin/integral/search/esInit');
            if (callback) {callback(response);}
        },
        //slodon_获取积分标签列表
        * get_label_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/integral/admin/integral/goodsLabel/list');
            if (callback) { callback(response); }
        },
        //slodon_添加积分标签
        * add_label({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/integral/admin/integral/goodsLabel/add');
            if (callback) { callback(response); }
        },
        //slodon_编辑积分标签
        * edit_label({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/integral/admin/integral/goodsLabel/update');
            if (callback) { callback(response); }
        },
        //slodon_获取积分树数据
        * get_label_tree_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/integral/admin/integral/goodsLabel/getLabelTree');
            if (callback) { callback(response); }
        },
        //slodon_设置积分标签是否显示
        * is_show_label({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/integral/admin/integral/goodsLabel/isShow');
            if (callback) { callback(response); }
        },
        //slodon_删除积分标签
        * del_label({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/integral/admin/integral/goodsLabel/del');
            if (callback) { callback(response); }
        },
        //slodon_设置积分标签广告
        * set_label_adv({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/integral/admin/integral/goodsLabel/setAdv');
            if (callback) { callback(response); }
        },

        /*-------积分商城-标签管理 模块-end-----*/


        /*-------积分商城-商品管理 模块-start-----*/

        //slodon_获取商品列表
        * get_goods_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/integral/admin/integral/goods/list');
            if (callback) { callback(response); }
        },
        //slodon_违规下架商品
        * lockup_goods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/integral/admin/integral/goods/lockup');
            if (callback) { callback(response); }
        },
        //slodon_审核商品
        * audit_goods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/integral/admin/integral/goods/audit');
            if (callback) { callback(response); }
        },
        /*-------积分商城-商品管理 模块-end-----*/

        /*-------积分商城-订单管理 模块-start-----*/

        //slodon_获取订单列表
        * get_order_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/integral/admin/integral/order/list');
            if (callback) { callback(response); }
        },
        //slodon_获取订单详情
        * get_order_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/integral/admin/integral/order/detail');
            if (callback) { callback(response); }
        },
        //获取物流轨迹
        *get_flow({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/integral/admin/integral/order/getTrace');
            callback && callback(response);
        },
        //slodon_订单导出
        * export_order_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/integral/admin/integral/order/export');
            callback && callback(response);
        },
        /*-------积分商城-订单管理 模块-end-----*/

        /*-------积分商城-结算管理 模块-start-----*/

        //slodon_获取结算单列表
        * get_bill_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/integral/admin/integralBill/list');
            if (callback) { callback(response); }
        },
        //slodon_获取结算单详情
        * get_bill_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/integral/admin/integralBill/detail');
            if (callback) { callback(response); }
        },
        //slodon_审核结算单
        * check_bill({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/integral/admin/integralBill/approved');
            if (callback) { callback(response); }
        },
        //slodon_结算单_打款
        * settle_bill({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/integral/admin/integralBill/confirmPayment');
            if (callback) { callback(response); }
        },
        //slodon_结算单_导出
        * export_bill_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/integral/admin/integralBill/export');
            if (callback) { callback(response); }
        }
        /*-------积分商城-结算管理 模块-end-----*/


    }
};
