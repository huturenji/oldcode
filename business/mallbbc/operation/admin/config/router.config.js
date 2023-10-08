export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  {
    path: '/decorate_pc/diy_page_lists_to_edit',
    component: '../layouts/UserLayout',
    Routes: ['src/pages/CheckLogin'],
    routes: [
      { path: '/decorate_pc/diy_page_lists_to_edit', component: './decorate/pc/home/edit_diy_page' },
    ],
  },
  {
    path: '/decorate_pc/topic_diy_page_lists_to_edit',
    component: '../layouts/UserLayout',
    Routes: ['src/pages/CheckLogin'],
    routes: [
      { path: '/decorate_pc/topic_diy_page_lists_to_edit', component: './decorate/pc/home/edit_diy_page' },
    ],
  },
 
  {
    path: '/showicon',
    name: 'showicon',
    component: './showicon/index',
  },
  {
    path: '/diy_document',
    name: 'showicon',
    component: './diyDocument/index',
  },
  
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/CheckLogin'],
    routes: [
      { path: '/', redirect: '/sysset_home/basic' },
      //系统配置—首页管理
      {
        path: '/sysset_home',
        icon: 'home',
        name: 'home',
        routes: [
          //概况页
          {
            path: '/sysset_home/basic',
            name: 'basic',
            component: './systemset/home',
          },
        ],
      },
      //系统配置—基本配置
      {
        path: '/sysset_setting',
        icon: 'setting',
        name: 'setting',
        routes: [
          //站点配置
          {
            path: '/sysset_setting/site_info',
            name: 'site_info',
            component: './systemset/base/site',
          },
          //图片配置
          {
            path: '/sysset_setting/pic_set',
            name: 'pic_set',
            component: './systemset/base/pic',
          },
          //支付配置
          {
            path: '/sysset_setting/payment',
            name: 'payment',
            component: './systemset/base/payment',
          },
          //运营配置
          {
            path: '/sysset_setting/order',
            name: 'order',
            component: './systemset/base/order',
          },
          //APP配置
          {
            path: '/sysset_setting/app_set',
            name: 'app_set',
            component: './systemset/base/app',
          },
        ],
      },
      //系统配置—通知管理
      {
        path: '/sysset_notice_set',
        icon: 'bell',
        name: 'notice_set',
        routes: [
          //短信配置
          {
            path: '/sysset_notice_set/sms',
            name: 'sms',
            component: './systemset/notice_set/sms',
          },
          //邮件配置
          {
            path: '/sysset_notice_set/email',
            name: 'email',
            component: './systemset/notice_set/email',
          },
          //消息模板
          {
            path: '/sysset_notice_set/msg_tpl',
            name: 'msg_tpl',
            component: './systemset/notice_set/msg',
          },
          //广告推送
          {
            path: '/sysset_notice_set/advert',
            name: 'advert',
            component: './systemset/notice_set/advert',
          },
          //广告推送新增编辑
          {
            path: '/sysset_notice_set/advert_to_add',
            name: 'addAdvert',
            component: './systemset/notice_set/advert/advert_add',
          },
          {
            path: '/sysset_notice_set/advert_to_view',
            name: '',
            component: './systemset/notice_set/advert/view',
          }

        ],
      },
      // 系统配置—三方账号
      {
        path: '/sysset_acount',
        icon: 'usergroup-add',
        name: 'acount',
        routes: [
          //授权配置
          {
            path: '/sysset_acount/union_login',
            name: 'union_login',
            component: './systemset/acount',
          },
        ],
      },
      //系统配置—权限管理
      {
        path: '/sysset_authority',
        icon: 'security-scan',
        name: 'authority',
        routes: [
          //权限组
          {
            path: '/sysset_authority/authority_group',
            name: 'authority_group',
            component: './systemset/authority/group',
          },
          //操作员管理
          {
            path: '/sysset_authority/authority_member',
            name: 'authority_member',
            component: './systemset/authority/member',
          },
          //操作日志
          {
            path: '/sysset_authority/operate_log',
            name: 'operate_log',
            component: './systemset/authority/log',
          },
          //导入权限
          {
            path: '/sysset_authority/import_authority',
            name: 'import_authority',
            component: './systemset/authority/import',
          },          
        ],
      },
      //系统配置-协议管理
      {
        path: '/sysset_agreement',
        icon: 'reconciliation',
        name: 'agreement',
        routes: [
          //协议管理
          {
            path: '/sysset_agreement/lists',
            name: 'lists',
            component: './systemset/agreement',
          },
          //编辑协议
          {
            path: '/sysset_agreement/lists_to_edit',
            name: '',
            component: './systemset/agreement/edit',
          },
        ],
      },
      //系统配置—物流管理
      {
        path: '/sysset_express',
        icon: 'car',
        name: 'express',
        routes: [
          //物流公司
          {
            path: '/sysset_express/express_lists',
            name: 'express_lists',
            component: './systemset/express/company',
          },
          //物流配置
          {
            path: '/sysset_express/express_set',
            name: 'express',
            component: './systemset/express/set',
          },
        ],
      },
      //系统配置—渠道配置
      {
        path: '/sysset_channel',
        icon: 'setting',
        name: 'syssetChannel',
        routes: [
            //运营渠道管理
            {
                path: '/sysset_channel/list',
                name: 'syssetChannelList',
                component: './systemset/channel',
            },
            //运营新增编辑渠道
            {
                path: '/sysset_channel/list_to_add',
                name: 'addChannel',
                component: './systemset/channel/operation_add',
            },
        ],
      },

      //运维配置-渠道管理
      {
        path: '/mtc_channel',
        icon: 'setting',
        name: 'mtcChannel',
        routes: [
            //运维渠道管理
            {
                path: '/mtc_channel/list',
                name: 'mtcChannelList',
                component: './maintaince/channel/index',
            },
            //运维新增编辑渠道
            {
                path: '/mtc_channel/list_to_add',
                name: '',
                component: './maintaince/channel/channel_add',
            },
        ],
      },
      //运维配置-支付管理
      {
        path: '/mtc_bosspay',
        icon: 'setting',
        name: 'mtcBosspay',
        routes: [
            //运维老板付管理
            {
                path: '/mtc_bosspay/list',
                name: 'mtcBosspayList',
                component: './maintaince/pay/index',
            },
            //运维新增老板付
            {
                path: '/mtc_bosspay/list_to_add',
                name: '',
                component: './maintaince/pay/add',
            },
        ],
      },
     
      // 会员管理
      {
        path: '/member',
        name: 'member',
        icon: 'usergroup-add',
        routes: [
          //会员列表
          {
            path: '/member/lists',
            name: 'lists',
            component: './member/member_manage/member_list',
          },
          //会员详情
          {
            path: '/member/lists_to_detail',
            name: '',
            component: './member/member_manage/member_list/detail',
          },
          //充值管理
          {
            path: '/member/recharge',
            name: 'recharge',
            component: './member/member_manage/recharge',
          },
          //资金明细
          {
            path: '/member/balance_log',
            name: 'balance_log',
            component: './member/member_manage/balance',
          },
          //积分设置
          {
            path: '/member/point_setting',
            name: 'point_setting',
            component: './member/member_manage/point',
          },
        ],
      },
      // 商品管理
      {
        path: '/manage_product',
        icon: 'appstore',
        name: 'product',
        routes: [
          //商品设置
          {
            path: '/manage_product/goods_setting',
            name: 'goods_setting',
            component: './mall/goods/set/index.js',
          },
          //商品列表
          {
            path: '/manage_product/goods_list',
            name: 'goods_list',
            component: './mall/goods/manage/index.js',
          },
          //分类管理
          {
            path: '/manage_product/cate_lists',
            name: 'cate_lists',
            component: './mall/goods/category/index.js',
          },
          //品牌列表
          {
            path: '/manage_product/brand',
            name: 'brand',
            component: './mall/goods/brand/index.js',
          },
          //属性管理
          {
            path: '/manage_product/search_attr',
            name: 'search_attr',
            component: './mall/goods/attr/index.js',
          },
          //商品标签
          {
            path: '/manage_product/goods_label',
            name: 'goods_label',
            component: './mall/goods/label/index.js',
          },
          {
            path: '/manage_product/privacy_cate_lists',
            name: 'privacy_cate_lists',
            component: './mall/goods/privacy/index.js',
          },
          //商品池
          {
            path: '/manage_product/goods_pool',
            name: 'goods_pool',
            component: './mall/goods/pool/index.js',
          },
          {
            path: '/manage_product/goods_pool_add',
            name: '',
            component: './mall/goods/pool/goods_pool_add',
          },
           //商品分组
           {
            path: '/manage_product/goods_group',
            name: 'goods_group',
            component: './mall/goods/goodsgroup/index.js',
          },
          {
            path: '/manage_product/goods_group_add',
            name: '',
            component: './mall/goods/goodsgroup/goods_group_add',
          }
        ],
      },
      // PC装修
      {
        path: '/decorate_pc',
        icon: 'cluster',
        name: 'decorate_pc',
        routes: [
          // 模板列表
          {
            path: '/decorate_pc/tpl_lists',
            name: 'tpl_lists',
            component: './decorate/pc/home/tpl_lists',
          },
          // 实例化模版
          {
            path: '/decorate_pc/instance_template_lists',
            name: 'instance_template_lists',
            component: './decorate/pc/home/instance_template_lists',
          },
          // 新增/编辑模版
          {
            path: '/decorate_pc/instance_template_lists_to_add',
            name: '',
            component: './decorate/pc/home/add_template',
          },
          // // 测试模板
          // {
          //   path: '/pcdecorate_home/adv_222',
          //   name: 'adv_222',
          //   component: './pcdecorate/home/adv_222',
          // },
          // 首页装修
          {
            path: '/decorate_pc/diy_page_lists',
            name: 'diy_page_lists',
            component: './decorate/pc/home/decorate_pc',
          },
        ],
      },
      // 首页装修
      {
        path: '/decorate_m',
        icon: 'mobile',
        name: 'decorate_m',
        routes: [
          // 装修主页
          {
            path: '/decorate_m/lists',
            name: 'lists',
            component: './decorate/mobile/deco/index',
          },
          // 首页装修页面
          {
            path: '/decorate_m/lists_to_diy',
            name: '',
            component: './decorate/mobile/deco/home/deco',
          },
          // 专题装修页面
          {
            path: '/decorate_m/lists_to_diy_topic',
            name: '',
            component: './decorate/mobile/deco/topic/deco',
          }
        ],
      },
      // 店铺管理
      {
        path: '/manage_store',
        icon: 'shop',
        name: 'store',
        routes: [
          //自营店铺
          {
            path: '/manage_store/own_list',
            name: 'own_list',
            component: './mall/store/own/index.js',
          },
          //入驻店铺
          {
            path: '/manage_store/settle_store_list',
            name: 'settle_store_list',
            component: './mall/store/settle/index.js',
          },
          //入驻审核店铺详情
          {
            path: '/manage_store/settle_store_list_apply_detail',
            name: '',
            component: './mall/store/settle/apply_store_detail',
          },
          //店铺入驻信息详情
          {
            path: '/manage_store/settle_store_list_view',
            name: '',
            component: './mall/store/settle/settled_store_detail',
          },
          //编辑店铺入驻信息
          {
            path: '/manage_store/settle_store_list_to_edit',
            name: '',
            component: './mall/store/settle/edit_settled_store',
          },
          //店铺等级
          {
            path: '/manage_store/grade_list',
            name: 'grade_list',
            component: './mall/store/grade/index',
          },
        ],
      },
      // 订单管理
      {
        path: '/manage_order',
        icon: 'form',
        name: 'order',
        routes: [
          //订单列表
          {
            path: '/manage_order/order_lists',
            name: 'order_lists',
            component: './mall/order/list/index',
          },
          //订单详情
          {
            path: '/manage_order/order_lists_to_detail',
            name: '',
            component: './mall/order/list/order_detail',
          },
          //售后管理
          // {
          //     path: '/manage_order/aftersales_lists',
          //     name: 'aftersales_lists',
          //     component: './mall/order/aftersales_lists',
          // },
          {
            path: '/manage_order/service',
            name: 'service',
            component: './mall/order/service/index',
          },
          //评价管理
          {
            path: '/manage_order/evaluation',
            name: 'evaluation',
            component: './mall/order/evaluation/index',
          },
          //售后原因
          {
            path: '/manage_order/salereson_lists',
            name: 'salereson_lists',
            component: './mall/order/salereson/index',
          },
        ],
      },
      // 结算管理
      {
        path: '/manage_bill',
        icon: 'pay-circle',
        name: 'bill',
        routes: [
          //结算账单
          {
            path: '/manage_bill/lists',
            name: 'lists',
            component: './mall/bill/list/index',
          },
          //结算账单详情
          {
            path: '/manage_bill/lists_to_detail',
            name: '',
            component: './mall/bill/list/detail',
          },
        ],
      },
      
      // 促销活动
      {
        path: '/marketing_promotion',
        icon: 'chrome',
        name: 'promotion',
        routes: [
          //应用中心
          {
            path: '/marketing_promotion/center',
            name: 'center',
            component: './marketing/promotion/index',
          },
          //平台优惠券
          {
            path: '/marketing_promotion/coupon',
            name: 'coupon',
            component: './marketing/promotion/coupon/index',
          },
          //平台优惠券-新建优惠券
          {
            path: '/marketing_promotion/coupon_to_add',
            name: '',
            component: './marketing/promotion/coupon/add_coupon',
          },
          //平台优惠券——查看优惠券
          {
            path: '/marketing_promotion/coupon_to_view',
            name: '',
            component: './marketing/promotion/coupon/view_coupon',
          },
          //平台优惠券——优惠券领取列表
          {
            path: '/marketing_promotion/coupon_to_receive_list',
            name: '',
            component: './marketing/promotion/coupon/member_receive_lists',
          },
          //店铺优惠券
          {
            path: '/marketing_promotion/store_coupon',
            name: 'store_coupon',
            component: './marketing/promotion/store_coupon/index',
          },
          //店铺优惠券——查看优惠券
          {
            path: '/marketing_promotion/store_coupon_to_view',
            name: '',
            component: './marketing/promotion/store_coupon/view_coupon',
          },
          //店铺优惠券——优惠券领取列表
          {
            path: '/marketing_promotion/store_coupon_to_receive_list',
            name: '',
            component: './marketing/promotion/store_coupon/member_receive_lists',
          },
          //积分抵现
          {
            path: '/marketing_promotion/point_setting',
            name: 'point_setting',
            component: './marketing/promotion/point/index',
          },
          //满优惠列表
          {
            path: '/marketing_promotion/full_discount',
            name: 'full_discount',
            component: './marketing/promotion/full_discount/index',
          },
          //秒杀活动
          {
            path: '/marketing_promotion/seckill',
            name: 'seckill',
            component: './marketing/promotion/seckill/index',
          },
          //秒杀活动详情——秒杀活动场次
          {
            path: '/marketing_promotion/seckill_detail',
            name: '',
            component: './marketing/promotion/seckill/detail',
          },
          //秒杀活动商品
          {
            path: '/marketing_promotion/seckill_goods_list',
            name: '',
            component: './marketing/promotion/seckill/seckill_goods_lists',
          },
          //一起买活动
          {
            path: '/marketing_promotion/together_buy',
            name: 'together_buy',
            component: './marketing/promotion/together_buy/index',
          },         
          //一起买活动 详情
          {
            path: '/marketing_promotion/together_buy_detail',
            name: '',
            component: './marketing/promotion/together_buy/detail',
          },         
          //天天专场
          {
            path: '/marketing_promotion/buy_everyday',
            name: 'buy_everyday',
            component: './marketing/promotion/everyday_buy/index',
          },         
          //天天专场 详情
          {
            path: '/marketing_promotion/buy_everyday_detail',
            name: '',
            component: './marketing/promotion/everyday_buy/detail',
          },                  
          //拼团活动
          {
            path: '/marketing_promotion/spell_group',
            name: 'spell_group',
            component: './marketing/promotion/spell_group/index',
          },
          //拼团活动——查看详情
          {
            path: '/marketing_promotion/spell_group_to_view',
            name: '',
            component: './marketing/promotion/spell_group/view_spell_group',
          },
          //拼团活动商品
          {
            path: '/marketing_promotion/spell_group_bind_goods',
            name: '',
            component: './marketing/promotion/spell_group/joined_goods_list',
          },
          //拼团活动订单
          {
            path: '/marketing_promotion/spell_group_order',
            name: '',
            component: './marketing/promotion/spell_group/order_lists',
          },
          //拼团活动订单详情
          {
            path: '/marketing_promotion/spell_group_order_to_detail',
            name: '',
            component: './mall/order/list/order_detail',
          },
          //拼团团队列表
          {
            path: '/marketing_promotion/spell_group_team_list',
            name: '',
            component: './marketing/promotion/spell_group/team_list',
          },
          //阶梯团活动
          {
            path: '/marketing_promotion/ladder_group',
            name: 'ladder_group',
            component: './marketing/promotion/ladder_group/index',
          },
          //阶梯团活动——查看详情
          {
            path: '/marketing_promotion/ladder_group_to_view',
            name: '',
            component: './marketing/promotion/ladder_group/view_ladder_group',
          },
          //阶梯团活动——团队列表
          {
            path: '/marketing_promotion/ladder_group_team_list',
            name: '',
            component: './marketing/promotion/ladder_group/team_list',
          },
          //预售活动
          {
            path: '/marketing_promotion/presale',
            name: 'presale',
            component: './marketing/promotion/presale/index',
          },
          //预售详情
          {
            path: '/marketing_promotion/presale_to_view',
            name: '',
            component: './marketing/promotion/presale/view_presale',
          },
          //预售活动商品
          {
            path: '/marketing_promotion/presale_goods_list',
            name: '',
            component: './marketing/promotion/presale/presale_goods_lists',
          },
           //兑换劵
           {
            path: '/marketing_promotion/exchange_coupon',
            name: 'exchange_coupon',
            component: './marketing/promotion/exchange/index.js',
          },
          //兑换劵新增
          {
            path: '/marketing_promotion/exchange_coupon_add',
            name: 'exchange_coupon',
            component: './marketing/promotion/exchange/exchange_coupon_add.js',
          },
          //兑换劵查看
          {
            path: '/marketing_promotion/exchange_coupon_view',
            name: 'exchange_coupon',
            component: './marketing/promotion/exchange/view.js',
          },
          //签到首页
          {
            path: '/marketing_promotion/sign',
            name: 'sign',
            component: './marketing/promotion/sign_manage/index',
          },
          //新建签到活动
          {
            path: '/marketing_promotion/sign_to_add',
            name: '',
            component: './marketing/promotion/sign_manage/add',
          },
           //查看签到活动
          {
            path: '/marketing_promotion/sign_to_detail',
            name: '',
            component: './marketing/promotion/sign_manage/detail',
          },
          
          // 红包活动
          {
            path: '/marketing_promotion/red_packet',
            name: 'red_packet',
            component: './marketing/promotion/red_packet/index',
          },
          //平台红包-新建红包
          {
            path: '/marketing_promotion/red_packet_to_add',
            name: '',
            component: './marketing/promotion/red_packet/add_red_packet',
          },
          //平台红包——查看红包
          {
            path: '/marketing_promotion/red_packet_to_view',
            name: '',
            component: './marketing/promotion/red_packet/view_red_packet',
          },
          //平台红包——红包领取列表
          {
            path: '/marketing_promotion/red_packet_to_receive_list',
            name: '',
            component: './marketing/promotion/red_packet/member_receive_lists',
          },
          //平台红包——会员领取列表
          {
            path: '/marketing_promotion/red_packet_to_receive_list',
            name: '',
            component: './marketing/promotion/red_packet/member_receive_lists',
          },
          //运费券
          {
            path: '/marketing_promotion/freight_coupon',
            name: 'freight_coupon',
            component: './marketing/promotion/freight_coupon/index',
          },
          //新建运费券
          {
            path: '/marketing_promotion/freight_coupon_to_add',
            name: '',
            component: './marketing/promotion/freight_coupon/add_freight_coupon',
          },
          //查看运费券
          {
            path: '/marketing_promotion/freight_coupon_to_view',
            name: '',
            component: './marketing/promotion/freight_coupon/view_freight_coupon',
          },
          //运费券领取列表
          {
            path: '/marketing_promotion/freight_coupon_to_receive_list',
            name: '',
            component: './marketing/promotion/freight_coupon/member_receive_lists',
          },
          //运费券-会员领取列表
          {
            path: '/marketing_promotion/freight_coupon_to_receive_list',
            name: '',
            component: './marketing/promotion/freight_coupon/member_receive_lists',
          },
          //消费券
          {
            path: '/marketing_promotion/consumer_coupon',
            name: 'consumer_coupon',
            component: './marketing/promotion/consumer_coupon/index',
          },
          //查看消费券
          {
            path: '/marketing_promotion/consumer_coupon_to_view',
            name: '',
            component: './marketing/promotion/consumer_coupon/view_consumer_coupon',
          },
          //领取列表
          {
            path: '/marketing_promotion/consumer_coupon_to_receive_list',
            name: '',
            component: './marketing/promotion/consumer_coupon/member_receive_lists',
          },
        ],
      },

      // 统计中心
      {
        path: '/statistics',
        icon: 'pie-chart',
        name: 'statistics',
        routes: [
          //实时分析
          {
            path: '/statistics/realtime',
            name: 'realtime',
            component: './statistics/realtime',
          },
          //交易分析
          {
            path: '/statistics/trade',
            name: 'trade',
            component: './statistics/trade',
          },
          //流量分析
          {
            path: '/statistics/flow',
            name: 'flow',
            component: './statistics/flow',
          },
          //商品动销
          {
            path: '/statistics/goods_saling',
            name: 'goods_saling',
            component: './statistics/goods_promotion',
          },
          //商品品类
          {
            path: '/statistics/goods_category',
            name: 'goods_category',
            component: './statistics/goods_category',
          },
          //会员分析
          {
            path: '/statistics/member',
            name: 'member',
            component: './statistics/member',
          },
          //店铺分析
          {
            path: '/statistics/store',
            name: 'store',
            component: './statistics/store',
          },
          //地域分析
          {
            path: '/statistics/region',
            name: 'region',
            component: './statistics/region',
          },
          //要优惠统计
          {
            path: '/statistics/want_preferential',
            name: 'want_preferential',
            component: './statistics/want_preferential',
          }
        ]
      },

      // 积分商城
      {
        path: '/marketing_point',
        icon: 'transaction',
        name: 'point',
        routes: [
          //积分商城——首页装修
          {
            path: '/marketing_point/diy_home',
            name: 'diy_home',
            component: './marketing/points_mall/deco/index',
          },
          // 装修页面
          {
            path: '/marketing_point/diy_home_to_edit',
            name: '',
            component: './marketing/points_mall/deco/edit_diy_page',
          },
          //积分商城——积分设置
          {
            path: '/marketing_point/setting',
            name: 'setting',
            component: './marketing/points_mall/setting/index',
          },
          //积分商城——标签管理
          {
            path: '/marketing_point/label',
            name: 'label',
            component: './marketing/points_mall/label/index',
          },
          //积分商城——商品管理
          {
            path: '/marketing_point/goods_list',
            name: 'goods_list',
            component: './marketing/points_mall/goods/index',
          },
          //积分商城——订单管理
          {
            path: '/marketing_point/order_list',
            name: 'order_list',
            component: './marketing/points_mall/order/index',
          },
          //积分商城——订单详情
          {
            path: '/marketing_point/order_list_to_detail',
            name: '',
            component: './marketing/points_mall/order/order_detail',
          },
          //积分商城——结算管理
          {
            path: '/marketing_point/bill_list',
            name: 'bill_list',
            component: './marketing/points_mall/bill/index',
          },
          //积分商城——结算详情
          {
            path: '/marketing_point/bill_list_to_detail',
            name: '',
            component: './marketing/points_mall/bill/detail',
          },
        ]
      },
      
      {
        component: '404',
      },
    ],
  },
];
