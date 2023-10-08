import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'sldsetting',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
    //slodon_获取首页概况信息
        * get_home_basic_info({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/business/admin/dashboard/indexInfo');
            if (callback) {callback(response);}
        },
        //slodon_获取搜索历史列表
        * get_keyword_history_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/search/log/list');
            if (callback) {callback(response);}
        },
        //slodon_获取物流公司列表
        * get_express_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/express/list');
            if (callback) {callback(response);}
        },
        //slodon_添加物流公司
        * add_express({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/express/add');
            if (callback) {callback(response);}
        },
        //slodon_编辑物流公司
        * edit_express({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/express/update');
            if (callback) {callback(response);}
        },
        //slodon_删除物流公司
        * del_express({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/express/del');
            if (callback) {callback(response);}
        },
        //slodon_获取站点基础配置信息
        * get_site_base_info({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/getBasicSiteSetting');
            if (callback) {callback(response);}
        },
        //slodon_获取PC支付信息
        * get_pc_pay_info({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/getPcPaymentList');
            if (callback) {callback(response);}
        },
        //slodon_获取移动端支付信息
        * get_mobile_pay_info({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/getMobilePayment');
            if (callback) {callback(response);}
        },
        //slodon_获取PC支付宝配置信息
        * get_pc_alipay_info({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/getAliPayPCSetting');
            if (callback) {callback(response);}
        },
        //slodon_获取PC微信配置信息
        * get_pc_weixin_info({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/getWxPayPCSetting');
            if (callback) {callback(response);}
        },
        //slodon_获取支付宝移动支付配置信息
        * get_alipay_mobile({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/getAliPayMobileSetting');
            if (callback) {callback(response);}
        },
        //slodon_获取微信小程序支付配置信息
        * get_wxpay_miniapp({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/getWxPayMiniAppSetting');
            if (callback) {callback(response);}
        },
        //slodon_获取微信app支付配置信息
        * get_wxpay_app({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/getWxPayAppSetting');
            if (callback) {callback(response);}
        },
        //slodon_获取微信h5支付配置信息
        * get_wxpay_h5({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/getWxPayH5Setting');
            if (callback) {callback(response);}
        },
        //slodon_获取PC基础图片
        * get_base_pic({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/getPcMainImage');
            if (callback) {callback(response);}
        },
        //slodon_获取PC默认图片
        * get_default_pic({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/getPcDefaultImage');
            if (callback) {callback(response);}
        },
        //slodon_获取短信配置信息
        * get_sms_info({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/getSMSSetting');
            if (callback) {callback(response);}
        },
        //slodon_获取邮件配置信息
        * get_email_info({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/getSMTPSetting');
            if (callback) {callback(response);}
        },
        //slodon_获取订单导出的配置信息
        * get_order_export_info({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/getOrderListCode');
            if (callback) {callback(response);}
        },
        //slodon_获取操作日志列表
        * get_operate_log_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/adminLog/list');
            if (callback) {callback(response);}
        },
        //slodon_删除操作日志
        * del_operate_log({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/adminLog/del');
            if (callback) {callback(response);}
        },
        //slodon_导出操作日志
        * export_operate_log({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/adminLog/export');
            if (callback) {callback(response);}
        },
        //slodon_发送测试邮件
        * send_test_mail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/msg/admin/msg/push/testEmailSend');
            if (callback) {callback(response);}
        },
        //slodon_获取微信授权登录的信息
        * get_authorized_wx_info({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/getLoginWXSetting');
            if (callback) {callback(response);}
        },
        //slodon_获取会员消息模板列表
        * get_member_msg_tpl_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/msg/admin/msg/tpl/memberTplList');
            if (callback) {callback(response);}
        },
        //运营平台_获取渠道列表
        * operation_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/channel/admin/list');
            if (callback) {callback(response);}
        },
        //slodon_获取商户消息模板列表
        * get_vendor_msg_tpl_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/msg/admin/msg/tpl/storeTplList');
            if (callback) {callback(response);}
        },
        //slodon_更新会员消息模板
        * update_member_msg_tpl({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/msg/admin/msg/tpl/updateMemberTpl');
            if (callback) {callback(response);}
        },
        //slodon_更新商户消息模板
        * update_vendor_msg_tpl({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/msg/admin/msg/tpl/updateStoreTpl');
            if (callback) {callback(response);}
        },
        //slodon_更新会员都在买规则
        * update_rule_msg_tpl({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/statistics/admin/buying/saveOrUpdatePushConfig','json');
            if (callback) {callback(response);}
        },
        //slodon_获取会员都在买规则
        * get_rule_msg_tpl({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/statistics/admin/buying/selectPushConfigByRulesId','json');
            if (callback) {callback(response);}
        },
        //获取推送消息规则配置
        * get_msg_rule({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/admin/briefReport/get','json');
            if (callback) {callback(response);}
        },
        //更新推送消息规则配置
        * update_msg_rule({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/briefReport/update','json');
            if (callback) {callback(response);}
        },
        //slodon_获取概况v2.0待办事项相关数据
        * get_home_basic_stat_info({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/overview/analysis/presentData');
            if (callback) {callback(response);}
        },
        //slodon_获取概况v2.0待办事项相关数据
        * get_home_basic_wait_deal_stat_info({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/overview/analysis/waitDeal');
            if (callback) {callback(response);}
        },
        //slodon_获取概况今日交易信息
        * get_home_basic_today_trade_info({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/overview/analysis/tradeInfo');
            if (callback) {callback(response);}
        },
        //slodon_获取概况今日用户信息
        * get_home_basic_today_member_info({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/overview/analysis/userInfo');
            if (callback) {callback(response);}
        },
        //slodon_获取概况今日流量信息
        * get_home_basic_today_flow_info({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/overview/analysis/viewInfo');
            if (callback) {callback(response);}
        },
        //slodon_获取概况今日商品信息
        * get_home_basic_today_goods_info({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/overview/analysis/goodsInfo');
            if (callback) {callback(response);}
        }
    }
};
