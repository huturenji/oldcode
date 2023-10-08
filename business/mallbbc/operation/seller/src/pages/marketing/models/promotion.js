import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'promotion',
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
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/seller/coupon/list', 'json');
            callback && callback(response);
        },
        //新增优惠券
        * add_coupon({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/seller/coupon/add', 'json');
            callback && callback(response);
        },
        //编辑优惠券
        * edit_coupon({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/seller/coupon/update', 'json');
            callback && callback(response);
        },
        //删除优惠券
        * del_coupon({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/seller/coupon/del');
            callback && callback(response);
        },
        //失效优惠券
        * invalid_coupon({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/seller/coupon/invalid');
            callback && callback(response);
        },
        //终止领取优惠券
        * stop_coupon({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/seller/coupon/end');
            callback && callback(response);
        },        
        //复制优惠券
        * copy_coupon({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/seller/coupon/copy');
            callback && callback(response);
        },
        //获取优惠券领取列表
        * get_coupon_receive_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/coupon/seller/coupon/receiveDetails');
            callback && callback(response);
        },
        //获取优惠券详情
        * get_coupon_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/coupon/seller/coupon/detail');
            callback && callback(response);
        },
        //获取优惠券商品列表
        * get_coupon_goods_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/coupon/seller/coupon/productList');
            callback && callback(response);
        },
        //审核优惠券
        * approve({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/coupon/seller/coupon/approve','json');
            callback && callback(response);
        },
        //操作记录列表
        * listRecords({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/coupon/seller/coupon/listRecord','json');
            callback && callback(response);
        },
        //循环满减列表
        * get_full_acm_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAcm/list','json');
            callback && callback(response);
        },
        //添加循环满减
        * add_full_acm({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAcm/add','json');
            callback && callback(response);
        },
        //获取循环满减详情
        * get_full_acm_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/discount/seller/fullAcm/detail');
            callback && callback(response);
        },
        //编辑循环满减
        * edit_full_acm({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAcm/update','json');
            callback && callback(response);
        },
        //删除循环满减
        * del_full_acm({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAcm/del');
            callback && callback(response);
        },
        //发布循环满减
        * publish_full_acm({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAcm/publish');
            callback && callback(response);
        },
        //复制循环满减
        * copy_full_acm({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAcm/copy');
            callback && callback(response);
        },
        //失效循环满减
        * invalid_full_acm({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAcm/invalid');
            callback && callback(response);
        },
        //循环满减审核
        * fullAcm_audit({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAcm/audit','json');
            callback && callback(response);
        },

        //阶梯满减列表
        * get_full_asm_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAsm/list','json');
            callback && callback(response);
        },
        //添加阶梯满减
        * add_full_asm({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAsm/add','json');
            callback && callback(response);
        },
        //获取阶梯满减详情
        * get_full_asm_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/discount/seller/fullAsm/detail');
            callback && callback(response);
        },
        //编辑阶梯满减
        * edit_full_asm({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAsm/update','json');
            callback && callback(response);
        },
        //删除阶梯满减
        * del_full_asm({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAsm/del');
            callback && callback(response);
        },
        //发布阶梯满减
        * publish_full_asm({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAsm/publish');
            callback && callback(response);
        },
        //复制阶梯满减
        * copy_full_asm({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAsm/copy');
            callback && callback(response);
        },
        //失效阶梯满减
        * invalid_full_asm({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAsm/invalid');
            callback && callback(response);
        },
        //阶梯满减审核
        * fullAsm_audit({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAsm/audit','json');
            callback && callback(response);
        },
        //满N元折扣列表
        * get_full_ald_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAld/list','json');
            callback && callback(response);
        },
        //添加满N元折扣
        * add_full_ald({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAld/add','json');
            callback && callback(response);
        },
        //获取满N元折扣详情
        * get_full_ald_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/discount/seller/fullAld/detail');
            callback && callback(response);
        },
        //编辑满N元折扣
        * edit_full_ald({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAld/update','json');
            callback && callback(response);
        },
        //删除满N元折扣
        * del_full_ald({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAld/del');
            callback && callback(response);
        },
        //发布满N元折扣
        * publish_full_ald({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAld/publish');
            callback && callback(response);
        },
        //复制满N元折扣
        * copy_full_ald({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAld/copy');
            callback && callback(response);
        },
        //失效满N元折扣
        * invalid_full_ald({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAld/invalid');
            callback && callback(response);
        },
        //满N元审核
        * fullAld_audit({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullAld/audit','json');
            callback && callback(response);
        },
        //满N件折扣列表
        * get_full_nld_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullNld/list','json');
            callback && callback(response);
        },
        //添加满N件折扣
        * add_full_nld({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullNld/add','json');
            callback && callback(response);
        },
        //获取满N件折扣详情
        * get_full_nld_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/discount/seller/fullNld/detail');
            callback && callback(response);
        },
        //编辑满N件折扣
        * edit_full_nld({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullNld/update','json');
            callback && callback(response);
        },
        //删除满N件折扣
        * del_full_nld({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullNld/del');
            callback && callback(response);
        },
        //发布满N件折扣
        * publish_full_nld({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullNld/publish');
            callback && callback(response);
        },
        //复制满N件折扣
        * copy_full_nld({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullNld/copy');
            callback && callback(response);
        },
        //失效满N件折扣
        * invalid_full_nld({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullNld/invalid');
            callback && callback(response);
        },
        //满N件审核
        * fullNld_audit({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/discount/seller/fullNld/audit','json');
            callback && callback(response);
        },
        //slodon_获取所有秒杀活动列表
        * get_all_seckill_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/seckill/listPage', 'json');
            callback && callback(response);
        },
        //slodon_获取秒杀活动详情
        * get_seckill_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/seller/seckill/datail');
            callback && callback(response);
        },
        //slodon_获取秒杀活动场次
        * get_activity_stage({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/seller/seckill/listSeckillStage', 'json');
            callback && callback(response);
        },
        //slodon_获取秒杀活动标签
        * get_activity_label({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/seller/seckill/listSeckillLabel', 'json');
            callback && callback(response);
        },
        //slodon_参加秒杀活动
        * join_seckill_activity({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/seckill/joinSeckill', 'json');
            callback && callback(response);
        },
        //slodon_获取已经参加的秒杀活动
        * get_joined_seckill_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/seckill/listPageWithAttend', 'json');
            callback && callback(response);
        },
        //slodon_退出秒杀活动或商品
        * quit_seckill_activit_good({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/seller/seckill/quit', 'json');
            callback && callback(response);
        },    
        //slodon_获取参加秒杀活动的商品
        * get_joined_seckill_goods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/seckill/listPageSeckillProduct','json');
            callback && callback(response);
        },
        //slodon_删除参加秒杀活动的商品
        * del_seckill_goods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/seckill/deleteProduct','json');
            callback && callback(response);
        },
        //查询待审核+审核失败商品所属的秒杀活动场次列表
        * listAuditSeckillStage({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/seckill/listAuditSeckillStage','json');
            callback && callback(response);
        },
        //审批活动商品
        * audit({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/common/audit','json');
            callback && callback(response);
        },
        //编辑活动商品
        * updateProduct({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/common/updateProduct','json');
            callback && callback(response);
        },
        //slodon_获取参加秒杀活动的商品的sku
        // * get_seckill_goods_sku({ payload, callback }, { call }) {
        //     const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/joinSeckill/detail','json');
        //     callback && callback(response);
        // },
        //slodon_获取阶梯团活动标签
        * get_activity_ladder_group_label({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/seller/ladder/group/labelList');
            callback && callback(response);
        },
        //slodon_video_获取会员列表
        * get_video_member_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/video/seller/video/member/list');
            callback && callback(response);
        },
        //slodon_video_获取短信验证码
        * get_video_sms_code({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/video/seller/video/member/smsCode');
            callback && callback(response);
        },
        //slodon_video_绑定视频会员
        * bind_video_member({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/video/seller/video/member/bindMember');
            callback && callback(response);
        },
        //slodon_video_删除视频会员
        * del_video_member({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/video/seller/video/member/del');
            callback && callback(response);
        },
        //slodon_video_新建阶梯团活动
        * add_ladder_group({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/ladder/group/add', 'json');
            callback && callback(response);
        },
        //slodon_video_编辑阶梯团活动
        * edit_ladder_group({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/ladder/group/update', 'json');
            callback && callback(response);
        },
        //slodon_video_获取阶梯团活动列表
        * get_all_ladder_group_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/seller/ladder/group/list');
            callback && callback(response);
        },
        //slodon_video_发布阶梯团活动
        * publish_ladder_group({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/ladder/group/publish');
            callback && callback(response);
        },
        //slodon_video_失效阶梯团活动
        * invalid_ladder_group({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/ladder/group/invalid');
            callback && callback(response);
        },
        //slodon_video_复制阶梯团活动
        * copy_ladder_group({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/ladder/group/copy');
            callback && callback(response);
        },
        //slodon_video_删除阶梯团活动
        * del_ladder_group({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/ladder/group/del');
            callback && callback(response);
        },
        //slodon_video_获取阶梯团详情
        * get_ladder_group_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/seller/ladder/group/detail');
            callback && callback(response);
        },
        //slodon_video_获取阶梯团团队列表
        * get_ladder_group_team_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/seller/ladder/group/teamList');
            callback && callback(response);
        },
        //slodon_获取所有预售列表
        * get_all_presale_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/seller/preSell/list');
            callback && callback(response);
        },
        //预售商品列表
        * get_presale_joined_goods_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/seller/preSell/goodList');
            callback && callback(response);
        },
        //删除预售商品
        * del_presale_goods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/preSell/delGoods');
            callback && callback(response);
        },
        //删除预售
        * del_full_acm_pre({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/preSell/del');
            callback && callback(response);
        },
        //复制预售
        * copy_full_acm_pre({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/preSell/copy');
            callback && callback(response);
        },
        //失效预售
        * invalid_full_acm_pre({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/preSell/invalid');
            callback && callback(response);
        },
        //获取预售详情
        * get_presale_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/seller/preSell/detail');
            callback && callback(response);
        },
        //发布预售
        * publish_full_acm_pre({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/preSell/publish');
            callback && callback(response);
        },
        //slodon_获取预售活动标签
        * get_activity_label_presale({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/seller/preSell/labelList');
            callback && callback(response);
        },
        //slodon_添加预售活动
        * add_presale_activity({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/preSell/add', 'json');
            callback && callback(response);
        },
        //slodon_编辑预售活动
        * edit_presale_activity({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/preSell/update', 'json');
            callback && callback(response);
        },
        //slodon_video_获取拼团活动列表
        * get_all_spell_group_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/seller/spell/list');
            callback && callback(response);
        },
        //slodon_获取拼团活动标签
        * get_activity_spell_group_label({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/seller/spell/labelList');
            callback && callback(response);
        },
        //slodon_video_新建拼团活动
        * add_spell_group({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/spell/add');
            callback && callback(response);
        },
        //slodon_video_编辑拼团活动
        * edit_spell_group({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/spell/update');
            callback && callback(response);
        },
        //slodon_video_发布拼团活动
        * publish_spell_group({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/spell/publish');
            callback && callback(response);
        },
        //slodon_video_失效拼团活动
        * invalid_spell_group({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/spell/invalid');
            callback && callback(response);
        },
        //slodon_video_复制拼团活动
        * copy_spell_group({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/spell/copy');
            callback && callback(response);
        },
        //slodon_video_删除拼团活动
        * del_spell_group({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/spell/del');
            callback && callback(response);
        },
        //slodon_video_获取拼团详情
        * get_spell_group_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/seller/spell/detail');
            callback && callback(response);
        },
        //拼团商品列表
        * get_spell_group_joined_goods_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/seller/spell/goodList');
            callback && callback(response);
        },
        //删除拼团商品
        * del_spell_group_goods({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/spell/delGoods');
            callback && callback(response);
        },
        //获取拼团活动订单
        * get_spell_group_order_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/seller/spell/order/list');
            callback && callback(response);
        },
        //拼团团队列表模拟成团功能
        * spell_group_team_to_simulate_group({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/seller/spell/simulateGroup');
            callback && callback(response);
        },
        //获取拼团团队列表
        * get_spell_group_team_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/seller/spell/teamList');
            callback && callback(response);
        },
        //卡密导出
        *exportWithPass({ payload, callback },{ call }){
            const response = yield call(sldCommonService, payload, 'get', 'v3/coupon/seller/coupon/exportWithPass');
            callback && callback(response);
        },
        
        //获取一起买活动列表
        * get_buyTogether_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/buyTogether/list','json');
            callback && callback(response);
        },
        //获取一起买活动详情
        * get_buyTogether_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/seller/buyTogether/detail');
            callback && callback(response);
        },
        //参加一起买活动
        * add_buyTogetherProduct({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/buyTogether/joinProduct','json');
            callback && callback(response);
        },
        //参加一起买商品列表
        * get_buyTogetherProduct_List({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/buyTogether/listProduct','json');
            callback && callback(response);
        },
        //商品退出一起买活动
        * quit_buyTogetherProduct({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/buyTogether/quitProduct','json');
            callback && callback(response);
        },
        //导出一起买活动
        * expor_buyTogetherProduct({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/seller/buyTogether/exportProductList');
            callback && callback(response);
        },
        //一起买场次列表
        * get_listAudit_stage({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/buyTogether/listAuditStages','json');
            if (callback) {callback(response);}
        },   
        //一起买查询待审核+审核失败商品所属的天天专场活动列表
        * get_listAuditPromotion({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/buyEveryday/listAuditPromotion','json');
            if (callback) {callback(response);}
        },           
        //获取天天专场活动列表
        * get_buyEveryday_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/buyEveryday/listPage','json');
            callback && callback(response);
        },
        //获取天天专场已参加活动列表
        * get_list_attend({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/buyEveryday/listPageWithAttend','json');
            callback && callback(response);
        },
        //添加天天专场活动
        * addProducts({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/buyEveryday/addProducts','json');
            callback && callback(response);
        },
        //天天专场活动详情及下面的商品
        * get_buyEveryday_skus({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/specialoffer/seller/buyEveryday/pagePromotionBindProduct','json');
            callback && callback(response);
        },
        //退出天天专场活动
        * quit_buyEveryday({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/seller/buyEveryday/quit');
            callback && callback(response);
        },
        //查询行为记录
        * listRecord({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/specialoffer/seller/common/listRecord');
            callback && callback(response);
        }              
    }
};
