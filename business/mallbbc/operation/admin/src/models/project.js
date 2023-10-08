import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'project',

    state: {
        notice: []
    },

    effects: {
        

        //slodon_获取系统设置信息（应用中心-平台优惠券、优惠券设置 应用中心-积分抵现-积分设置 应用中心-秒杀活动-秒杀设置 应用中心-预售活动-预售设置 商城管理-商品设置 会员中心-会员管理-积分设置 系统配置-基本配置-运营配置、app配置 系统配置-物流配置 模块）
        * getSetting({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/getSettingList');
            if (callback) {callback(response);}
        },
        //slodon_批量保存设置信息（系统配置 会员中心-会员管理 应用中心 积分商城 模块）
        * saveSetting({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/setting/updateSettingList');
            if (callback) {callback(response);}
        },
        //slodon_获取理由(商品管理-商品列表 店铺管理-入住店铺 积分商城 模块)
        * get_reason_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/reason/list');
            if (callback) {callback(response);}
        },
        //slodon_获取三级地址
        * get_common_area({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v1/admin/common/regions/list');
            if (callback) {callback(response);}
        },
        
        /*--------------------------分割线---------------------*/

        //slodon_获取店铺销售排行TOP10（统计中心-交易分析）
        * get_store_sales_rank({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/trade/analysis/storeSalesRank');
            if (callback) {callback(response);}
        },
        //slodon_获取商品销售排行TOP10（统计中心-交易分析）
        * get_goods_sales_rank({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/trade/analysis/goodsSalesRank');
            if (callback) {callback(response);}
        },
        //slodon_获取品类销售排行TOP10(统计中心-商品种类)
        * get_category_rank({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/overview/analysis/categoryRank');
            if (callback) {callback(response);}
        },
        //slodon_获取品牌销售占比数据
        * get_brand_sales_percent({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/overview/analysis/brandSalesPercent');
            if (callback) {callback(response);}
        },
        //slodon_获取支付/下单金额趋势数据
        * get_pay_order_trend({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/overview/analysis/payOrderTrend');
            if (callback) {callback(response);}
        },
        //slodon_获取流量趋势数据
        * get_flow_trend({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/overview/analysis/flowTrend');
            if (callback) {callback(response);}
        },
        //slodon_获取会员/店铺新增趋势数据
        * get_new_trend({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/overview/analysis/newTrend');
            if (callback) {callback(response);}
        },
        //slodon_获取TOP10品类销售趋势数据
        * get_category_sales_rank({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/category/analysis/categorySalesRank');
            if (callback) {callback(response);}
        },
        //slodon_获取店铺流量排行-TOP10数据
        * get_store_flow_rank({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/flow/analysis/storeFlowRank');
            if (callback) {callback(response);}
        },
        //slodon_获取商品动销趋势数据
        * get_goods_sales_trend({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/goods/analysis/goodsSalesTrend');
            if (callback) {callback(response);}
        },
        //slodon_获取商品销售变化趋势-TOP10数据
        * get_goods_sales_trend_top({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/goods/analysis/goodsSalesRank');
            if (callback) {callback(response);}
        },
        //slodon_获取商品收藏数排行-TOP10数据
        * get_goods_collection_rank({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/goods/analysis/goodsCollectionRank');
            if (callback) {callback(response);}
        },
        //slodon_获取会员地域分布数据
        * get_member_region_distribution({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/member/analysis/regionDistribution');
            if (callback) {callback(response);}
        },
        //slodon_获取店铺地域分布数据
        * get_store_region_distribution({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/store/analysis/regionDistribution');
            if (callback) {callback(response);}
        },
        //slodon_获取会员偏好商品排行-TOP10数据
        * get_goods_prefer_rank({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/member/analysis/preferGoodsRank');
            if (callback) {callback(response);}
        },
        //slodon_获取品牌销售排行-TOP10数据
        * get_brand_rank({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/goods/analysis/brandSalesRank');
            if (callback) {callback(response);}
        },

        //slodon_更新es商品数据(商品管理-商品设置 模块)
        * updateEsGoods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/search/esInit');
            if (callback) {callback(response);}
        },


        /*--------------------------分割线---------------------*/

        //slodon_获取商品流量排行-TOP10数据
        * get_goods_flow_rank({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/flow/analysis/goodsFlowRank');
            if (callback) {callback(response);}
        },

        //slodon_获取分类列表_根据分类id获取下级分类 （商城管理-商品管理 模块）
        * get_cate_list_by_id({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/category/list`, 'json');
            if (callback) { callback(response); }
        },

        /*--------------------------分割线---------------------*/

        //slodon_获取分类树数据 （应用中心-优惠券 模块）
        * get_cate_tree_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/category/getCategoryTree`);
            if (callback) { callback(response); }
        },
        //slodon_获取会员列表 优惠券 （应用中心-优惠券 模块）
        * get_member_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/member/admin/member/inCompanyList');
            if (callback) { callback(response); }
        },
        //获取会员列表 用来导入和查看 无分页 （应用中心-优惠券 模块）
        * get_member_detail_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/member/admin/member/detailList', 'json');
            if (callback) { callback(response); }
        },
        //sldon_获取积分商品列表 （应用中心-积分商城- 模块）
        * get_point_goods_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/integral/admin/integral/goods/list');
            if (callback) { callback(response); }
        },
        // slodon_获取积分标签列表 （应用中心-积分商城- 模块）
        * get_point_label_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/integral/admin/integral/goodsLabel/list');
            if (callback) { callback(response); }
        },
        //根据抽奖订单号获取商品  （应用中心-兑换券 模块）
        *getOrderProduct({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v3/coupon/admin/voucher/getOrderProduct`);
            if (callback) { callback(response); }
        },
        //兑换券操作日志 （应用中心-兑换券 模块）
        * voucher_listRecord({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/coupon/admin/voucher/listRecord');
            callback && callback(response);
        },
        // 查询行为记录 （应用中心- 模块）
        * listRecord({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/admin/common/listRecord');
            callback && callback(response);
        },
        //获取红包活动列表接口
        * get_redpacket_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/redpacket/admin/redpacket/normalList');
            callback && callback(response);
        },
        //获取红包活动列表接口
        * get_deco_redpacket_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/redpacket/admin/redpacket/list', 'json');
            callback && callback(response);
        },

        /*--------------------------分割线---------------------*/

        //slodon_获取商品列表 （装修-PC装修 模块）
        * get_goods_spu_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', `v1/admin/decoration/goods/goodsList`);
            if (callback) { callback(response); }
        },
        //slodon_获取商品列表 （装修-PC装修 模块）
        * get_goods_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/goods/list');
            if (callback) { callback(response); }
        },
        //slodon_获取活动商品列表  sku获取 （装修- 模块，应用中心-兑换券 模块）
        * get_activity_goods_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/product/searchByKeyword', 'json');
            if (callback) { callback(response); }
        },
        //slodon_获取活动商品列表  sku列表获取 （装修- 模块，应用中心-兑换券、满减 模块， 商品管理-自定义商品池 模块）
        * get_activity_goods_lists_byskulist({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/product/listBySkus', 'json');
            if (callback) { callback(response); }
        },
        //slodon_获取移动端装修列表 （装修- 模块，应用中心- 模块）
        * get_diy_page_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/mobileDeco/list');
            if (callback) { callback(response); }
        },
        //slodon_获取PC端装修列表 （装修-PC装修 模块）
        * get_pc_diy_page_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/pcDeco/list');
            if (callback) { callback(response); }
        },
        //sldon_获取秒杀活动列表(获取未结束的活动) （装修- 模块，应用中心- 模块）
        * get_seckill_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/seckill/listPage', 'json');
            if (callback) { callback(response); }
        },
        // slodon_获取短视频列表 （装修- 模块）
        * get_video_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/video/admin/video/list');
            callback && callback(response);
        },
        // slodon_获取直播标签列表 （装修- 模块）
        * get_live_label_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/video/admin/video/live/label/list');
            callback && callback(response);
        },
        // slodon_获取直播列表 （装修- 模块）
        * get_live_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/video/admin/video/live/list');
            if (callback) { callback(response); }
        },
        // slodon_获取短视频标签列表 （装修- 模块， 应用中心-积分商城- 模块）
        * get_svideo_label_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/video/admin/video/label/list');
            if (callback) { callback(response); }
        },
        //获取优惠券列表（只获取未开始和进行中的） （装修- 模块）
        * get_voucher_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/coupon/admin/coupon/sendList');
            if (callback) { callback(response); }
        },
        //获取平台优惠券列表（只获取未开始和进行中的） （装修- 模块）
        * get_coupon_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/admin/coupon/list', 'json');
            callback && callback(response);
        },
        //获取一起买列表（只获取未开始和进行中的） （装修- 模块）
        * get_buytogether_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/buyTogether/list', 'json');
            callback && callback(response);
        },
        //获取天天买列表（只获取未开始和进行中的） （装修- 模块）
        * get_buyeveryday_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/admin/buyEveryday/listPage','json');
            callback && callback(response);
        },
        * get_singin_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/marketing/admin/sign/list','json');
            callback && callback(response);
        },
        //获取运费券列表接口
        * get_freightcoupon_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/cashcoupon/admin/freightcoupon/list', 'json');
            callback && callback(response);
        },
        //获取商品池列表
        * get_productpool_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/lowpriceproductpool/getPage', 'json');
            callback && callback(response);
        },
        //获取商品池分组列表
        * get_productgroup_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/lowpriceproductpool/getDetail', 'json');
            callback && callback(response);
        },
        //获取消费券列表接口
        * get_conscoupon_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/conscoupon/admin/consumeCoupon/list', 'json');
            callback && callback(response);
        },
        //sldon_获取推手商品列表
        * get_spreader_goods_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/spreader/admin/spreaderGoods/list');
            if (callback) { callback(response); }
        },
        // slodon_获取推手商品标签列表  （装修- 模块）
        * get_spreader_label_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/spreader/admin/spreaderGoodsLabel/list');
            callback && callback(response);
        },
        //运营平台_获取渠道列表 （装修- 模块，应用中心- 模块）
        * operation_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/channel/admin/list');
            if (callback) { callback(response); }
        },

        /*--------------------------分割线---------------------*/

        //slodon_获取会员列表 （会员中心-会员管理 模块）
        * get_member_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/member/admin/member/list');
            if (callback) { callback(response); }
        },
        //slodon_会员导出 （会员中心-会员管理 模块）
        *memberListExport({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/member/admin/member/memberListExport');
            callback && callback(response);
        },
        
        /*--------------------------分割线---------------------*/

        //slodon_获取自营店铺列表 （统计中心- 装修- 模块， 应用中心-、 模块）
        * get_own_store_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/seller/admin/opt/listStore');
            if (callback) { callback(response); }
        }
    },

    reducers: {
        saveNotice(state, action) {
            return {
                ...state,
                notice: action.payload
            };
        }
    }
};
