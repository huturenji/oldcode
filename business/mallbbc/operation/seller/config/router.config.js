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
    path: '/diy_document',
    name: 'showicon',
    component: './diyDocument/index',
  },
  // 商户入驻路由
  {
    path: '/apply',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/CheckSettle'],
    routes: [
      // { path: '/apply', redirect: '/user/login' },
      //start
      //入驻
      {
        path: '/apply/settled',
        icon: 'usergroup-add',
        name: '',
        component: './settledManage/settled/index',
      },
      //入驻协议
      {
        path: '/apply/settled_protocol',
        icon: 'file-done',
        name: 'apply_protocol',
        component: './settledManage/protocol/index',
      },
      //店铺基本信息
      {
        path: '/apply/base_info',
        icon: 'trophy',
        name: 'apply_base_info',
        component: './settledManage/baseInfo/index',
      },
      //经营信息
      {
        path: '/apply/business_info',
        icon: 'dollar',
        name: 'apply_business_info',
        component: './settledManage/businessInfo/index',
      },
      //店铺开通
      {
        path: '/apply/open_up',
        icon: 'control',
        name: 'apply_open_up',
        component: './settledManage/openUp/index',
      },
    ],
  },
  //PC装修页面
  {
    path: '/store/decorate_pc_home_to_edit',
    component: '../layouts/UserLayout',
    Routes: ['src/pages/CheckLogin'],
    routes: [
      { path: '/store/decorate_pc_home_to_edit', component: './store/pc/edit_diy_page' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/CheckLogin'],
    routes: [
      { path: '/', redirect: '/basic/simple_stat' },
      //概况页
      {
        path: '/basic/simple_stat',
        icon: 'setting',
        name: 'basic_simple_stat',
        component: './basic/index',
      },
      //商品列表
      {
        path: '/goods/goods_list',
        icon: 'shopping',
        name: 'goods_goods_list',
        component: './goods/list/index',
      },
      //定价规则列表
      {
        path: '/goods/price_rule_list',
        icon: 'shopping',
        name: 'goods_price_rule_list',
        component: './goods/pricerule/index',
      },
      //定价规则详情
      {
        path: '/goods/price_rule_list_detail',
        icon: '',
        name: 'goods_price_rule_detail',
        component: './goods/pricerule/detail',
      },      
      //新增定价规则
      {
        path: '/goods/price_rule_list_add',
        icon: '',
        name: 'goods_price_rule_add',
        component: './goods/pricerule/add',
      },        
      //发布商品
      {
        path: '/goods/goods_list_to_add',
        icon: '',
        name: '',
        component: './goods/list/add_goods',
      },
      //仓库中商品
      {
        path: '/goods/goods_storage_list',
        icon: 'project',
        name: 'goods_goods_storage_list',
        component: './goods/storage/index',
      },
      //仓库中商品_发布商品
      {
        path: '/goods/goods_storage_list_to_add',
        icon: '',
        name: '',
        component: './goods/list/add_goods',
      },
      //待审核商品
      {
        path: '/goods/goods_check_list',
        icon: 'audit',
        name: 'goods_goods_check_list',
        component: './goods/check/index',
      },
      //待审核商品_发布商品
      {
        path: '/goods/goods_check_list_to_add',
        icon: '',
        name: '',
        component: './goods/list/add_goods',
      },
      //关联版式
      {
        path: '/goods/related_template',
        icon: 'api',
        name: 'goods_related_template',
        component: './goods/template/index',
      },
      //编辑关联版式
      {
        path: '/goods/related_template_to_edit',
        name: '',
        component: './goods/template/edit',
      },
      //自定义属性组
      {
        path: '/goods/attribute_group',
        icon: 'layout',
        name: 'goods_attribute_group',
        component: './goods/attribute/index',
      },
      //自定义属性列表
      {
        path: '/goods/attribute_group_to_detail',
        name: '',
        component: './goods/attribute/detail',
      },
      //订单列表
      {
        path: '/order/order_lists',
        icon: 'container',
        name: 'order_order_lists',
        component: './order/list/index',
      },
      //拼团订单列表
      {
        path: '/order/spell_group_order_lists',
        icon: 'solution',
        name: 'spell_group__order_lists',
        component: './order/spell_group/index',
      },
      //拼团订单详情
      {
        path: '/order/spell_group_order_lists_to_detail',
        icon: '',
        name: '',
        component: './order/list/detail',
      },
      //订单详情
      {
        path: '/order/order_lists_to_detail',
        name: '',
        component: './order/list/detail',
      },
      //订单发货
      {
        path: '/order/order_deliver',
        icon: 'rocket',
        name: 'order_order_deliver',
        component: './order/deliver/index',
      },
      //售后管理
      {
        path: '/order/service',
        icon: 'transaction',
        name: 'service',
        component: './order/service/index',
      },
      //售后管理——仅退款——退款详情
      {
        path: '/order/service_refund_lists_to_detail',
        name: '',
        component: './order/service/detail',
      },
      //售后管理——退货退款——退款详情
      {
        path: '/order/service_return_lists_to_detail',
        name: '',
        component: './order/service/detail',
      },
      //评价管理
      {
        path: '/order/evaluation',
        icon: 'message',
        name: 'order_evaluation',
        component: './order/evaluation/index',
      },
      //物流管理
      {
        path: '/order/express',
        icon: 'read',
        name: 'express',
        component: './order/express/index',
      },
      //新增运费模板
      {
        path: '/order/express_transport_to_add',
        icon: 'setting',
        name: '',
        component: './order/express/add_transport',
      },
      //地址管理
      {
        path: '/order/address_list',
        icon: 'environment',
        name: 'order_address_list',
        component: './order/address/index',
      },
      //店铺设置
      {
        path: '/store/setting',
        icon: 'shop',
        name: 'store_setting',
        component: './store/setting/index',
      },
      //门店设置
      {
        path: '/store/offline_shop',
        icon: 'shopping',
        name: 'store_offline_shop',
        component: './store/offline_shop/index',
      },
       //门店新增
       {
        path: '/store/offline_shop_add',
        icon: '',
        name: '',
        component: './store/offline_shop/add',
      },
      //门店查看
      {
        path: '/store/offline_shop_view',
        icon: '',
        name: '',
        component: './store/offline_shop/view',
      },
      // 店铺PC装修
      {
        path: '/store/decorate_pc',
        icon: 'cluster',
        name: 'diy_decorate_pc',
        component: './store/pc/index',
      },
      // 新增/编辑模版
      {
        path: '/store/decorate_pc_instance_template_lists_to_edit',
        name: '',
        component: './store/pc/add_template',
      },
      // 店铺移动端首页装修
      {
        path: '/store/decorate_mhome',
        icon: 'mobile',
        name: 'diy_decorate_mhome',
        component: './store/mobile/m_diy_lists',
      },
      // 店铺移动端装修页面
      {
        path: '/store/decorate_mhome_to_edit',
        name: '',
        component: './store/mobile/deco',
      },
      //店铺信息
      {
        path: '/store/info',
        icon: 'profile',
        name: 'store_info',
        component: './store/info/index',
      },
      // 店铺分类
      {
        path: '/store/category',
        icon: 'appstore',
        name: 'store_category',
        component: './store/category/index',
      },
      //品牌申请
      {
        path: '/store/brand_lists',
        icon: 'trademark',
        name: 'store_brand_lists',
        component: './store/brand/index',
      },
      // 消息接收设置
      {
        path: '/store/msg_setting',
        icon: 'setting',
        name: 'store_msg_setting',
        component: './store/msg_setting/index',
      },
      // 消息接收设置
      {
        path: '/store/msg_lists',
        icon: 'bell',
        name: 'store_msg_lists',
        component: './store/msg_list/index',
      },
      //账号管理
      {
        path: '/store/account',
        icon: 'trademark',
        name: 'account',
        component: './store/account/index',
      },
      //结算——结算账号
      {
        path: '/bill/account',
        icon: 'property-safety',
        name: 'bill_account',
        component: './bill/account/index',
      },
      //结算——结算账单
      {
        path: '/bill/lists',
        icon: 'transaction',
        name: 'bill_list',
        component: './bill/list/index',
      },
      //结算——结算账单详情
      {
        path: '/bill/lists_to_detail',
        icon: 'transaction',
        name: '',
        component: './bill/list/detail',
      },

      //积分商城——发布商品
      {
        path: '/point/goods_list_to_add',
        icon: 'export',
        name: '',
        component: './point/goods/add_goods',
      },
      //积分商城——商品列表
      {
        path: '/point/goods_list',
        icon: 'shopping',
        name: 'point_goods_list',
        component: './point/goods/goods_list',
      },
      //积分商城——导入商城商品
      {
        path: '/point/goods_list_to_import',
        icon: '',
        name: '',
        component: './point/goods/select_mall_goods',
      },
      //积分商城——订单管理
      {
        path: '/point/order_list',
        icon: 'profile',
        name: 'point_order_list',
        component: './point/order/order_lists',
      },
      //积分商城——订单详情
      {
        path: '/point/order_list_to_detail',
        name: '',
        component: './point/order/order_detail',
      },
      //积分商城——结算管理
      {
        path: '/point/bill_list',
        icon: 'pay-circle',
        name: 'point_bill_list',
        component: './point/bill/lists',
      },
      //积分商城——结算详情
      {
        path: '/point/bill_list_to_detail',
        name: '',
        component: './point/bill/detail',
      },
      
      //实时分析
      {
        path: '/statistics/realtime',
        icon: 'dashboard',
        name: 'statistics_realtime',
        component: './statistics/realtime/index',
      },
      //交易分析
      {
        path: '/statistics/trade',
        icon: 'dollar',
        name: 'statistics_trade',
        component: './statistics/trade/index',
      },
      //流量分析
      {
        path: '/statistics/flow',
        icon: 'line-chart',
        name: 'statistics_flow',
        component: './statistics/flow/index',
      },
      //商品分析
      {
        path: '/statistics/goods',
        icon: 'deployment-unit',
        name: 'statistics_goods',
        component: './statistics/goods/index',
      },
      //用户分析
      {
        path: '/statistics/member',
        icon: 'solution',
        name: 'statistics_member',
        component: './statistics/member/index',
      },
      // 要优惠统计
      {
        path: '/statistics/want_preferential',
        icon: 'dashboard',
        name: 'statistics_want_preferential',
        component: './statistics/want_preferential/index',
      },
      //应用——应用中心
      {
        path: '/marketing/center',
        icon: 'chrome',
        name: 'marketing_center',
        component: './marketing/center',
      },
      //优惠券
      {
        path: '/marketing/coupon_list',
        icon: 'red-envelope',
        name: 'promotion_coupon_list',
        component: './marketing/coupon/index',
      },
      //添加优惠券
      {
        path: '/marketing/coupon_list_to_add',
        icon: '',
        name: '',
        component: './marketing/coupon/add_coupon',
      },
      //优惠券详情
      {
        path: '/marketing/coupon_list_to_view',
        icon: '',
        name: '',
        component: './marketing/coupon/view_coupon',
      },
      //优惠券领取列表
      {
        path: '/marketing/coupon_list_to_receive_list',
        icon: '',
        name: '',
        component: './marketing/coupon/member_receive_lists',
      },
      // 消费券列表
      {
        path: '/marketing/conscoupon_list',
        icon: 'dollar',
        name: 'promotion_conscoupon_list',
        component: './marketing/conscoupon/index',
      },
      {
        path: '/marketing/conscoupon_list_add',
        icon: '',
        name: '',
        component: './marketing/conscoupon/add_coupon',
      },
      {
        path: '/marketing/conscoupon_list_view',
        icon: '',
        name: '',
        component: './marketing/conscoupon/view_coupon',
      },
      {
        path: '/marketing/conscoupon_list_to_receive_list',
        icon: '',
        name: '',
        component: './marketing/conscoupon/member_receive_lists',
      },
      {
        path: '/marketing/conscoupon_list_to_receive_list_detail',
        icon: '',
        name: '',
        component: './marketing/conscoupon/receive_detail',
      },
      {
        path: '/marketing/conscoupon_list_audit',
        icon: '',
        name: '',
        component: './marketing/conscoupon/audit',
      },
      // //满优惠
      // {
      //   path: '/marketing/full_discount',
      //   icon: 'gift',
      //   name: 'promotion_full_discount',
      //   component: './marketing/full/discount',
      // },
      //满减活动
      {
        path: '/marketing/full_acm',
        icon: 'fire',
        name: 'promotion_full_acm',
        component: './marketing/full_acm/index',
      },
      //发布满减活动
      {
        path: '/marketing/full_acm_to_add',
        icon: '',
        name: '',
        component: './marketing/full_acm/add_full_acm',
      },
      //阶梯满减
      {
        path: '/marketing/full_asm',
        icon: 'gold',
        name: 'promotion_full_asm',
        component: './marketing/full_asm/index',
      },
      //发布阶梯满减活动
      {
        path: '/marketing/full_asm_to_add',
        icon: '',
        name: '',
        component: './marketing/full_asm/add_full_asm',
      },
      //满N元折扣
      {
        path: '/marketing/full_ald',
        icon: 'money-collect',
        name: 'promotion_full_ald',
        component: './marketing/full_ald/index',
      },
      //发布满N元折扣活动
      {
        path: '/marketing/full_ald_to_add',
        icon: '',
        name: '',
        component: './marketing/full_ald/add_full_ald',
      },
      //满N件折扣
      {
        path: '/marketing/full_nld',
        icon: 'medicine-box',
        name: 'promotion_full_nld',
        component: './marketing/full_nld/index',
      },
      //发布满N元折扣活动
      {
        path: '/marketing/full_nld_to_add',
        icon: '',
        name: '',
        component: './marketing/full_nld/add_full_nld',
      },
      //秒杀活动
      {
        path: '/marketing/seckill',
        icon: 'thunderbolt',
        name: 'promotion_seckill',
        component: './marketing/seckill/index',
      },
      //参加秒杀活动
      {
        path: '/marketing/seckill_to_add',
        icon: '',
        name: '',
        component: './marketing/seckill/add_seckill',
      },
      //参加秒杀活动的商品列表
      {
        path: '/marketing/seckill_bind_goods',
        icon: '',
        name: '',
        component: './marketing/seckill/joined_goods_list',
      },
      {
        path: '/marketing/seckill_to_review',
        icon: '',
        name: '',
        component: './marketing/seckill/review_detail',
      },
      {
        path: '/marketing/seckill_to_edit',
        icon: '',
        name: '',
        component: './marketing/seckill/edit_seckill',
      },
       //一起买活动
       {
        path: '/marketing/together_buy',
        icon: 'shopping-cart',
        name: 'promotion_together_buy',
        component: './marketing/together_buy/index',
      },
      //参加一起买活动
      {
        path: '/marketing/together_buy_add',
        icon: '',
        name: '',
        component: './marketing/together_buy/add',
      },
      //参加活动的商品
      {
        path: '/marketing/together_buy_joined_goods',
        icon: '',
        name: '',
        component: './marketing/together_buy/joined_goods',
      },
      //参加活动的场次详情
      {
        path: '/marketing/together_buy_review_detail',
        icon: '',
        name: '',
        component: './marketing/together_buy/review_detail',
      },      
      //参加活动的场次编辑
      {
        path: '/marketing/together_buy_review_edit',
        icon: '',
        name: '',
        component: './marketing/together_buy/review_edit',
      },            
      //天天专场活动
      {
        path: '/marketing/buy_everyday',
        icon: 'notification',
        name: 'promotion_buy_everyday',
        component: './marketing/buy_everyday/index',
      },
      //参加天天专场活动
      {
        path: '/marketing/buy_everyday_add',
        icon: '',
        name: '',
        component: './marketing/buy_everyday/add',
      },
      //参加天天专场活动的商品
      {
        path: '/marketing/buy_everyday_joined_goods',
        icon: '',
        name: '',
        component: './marketing/buy_everyday/joined_goods',
      },
      //查看天天专场活动的商品
      {
        path: '/marketing/buy_everyday_review_detail',
        icon: '',
        name: '',
        component: './marketing/buy_everyday/review_detail',
      },
      //参加天天专场活动的商品
      {
        path: '/marketing/buy_everyday_joined_goods_edit',
        icon: '',
        name: '',
        component: './marketing/buy_everyday/review_edit',
      },      
      //拼团活动列表
      {
        path: '/marketing/spell_group',
        icon: 'flag',
        name: 'promotion_spell_group',
        component: './marketing/spell_group/all_list',
      },
      //发布拼团活动
      {
        path: '/marketing/spell_group_to_add',
        icon: '',
        name: '',
        component: './marketing/spell_group/add_spell_group',
      },
      //拼团详情
      {
        path: '/marketing/spell_group_to_view',
        icon: '',
        name: '',
        component: './marketing/spell_group/view_spell_group',
      },
      //拼团的商品列表
      {
        path: '/marketing/spell_group_bind_goods',
        icon: '',
        name: '',
        component: './marketing/spell_group/joined_goods_list',
      },
      //拼团活动订单
      {
        path: '/marketing/spell_group_order',
        icon: '',
        name: '',
        component: './marketing/spell_group/order_lists',
      },
      //拼团活动订单详情
      {
        path: '/marketing/spell_group_order_to_detail',
        icon: '',
        name: '',
        component: './order/list/detail',
      },
      //拼团团队列表
      {
        path: '/marketing/spell_group_team_list',
        icon: '',
        name: '',
        component: './marketing/spell_group/team_list',
      },
      //阶梯团活动
      {
        path: '/marketing/ladder_group',
        icon: 'build',
        name: 'promotion_ladder_group',
        component: './marketing/ladder_group/all_list',
      },
      //参加阶梯团活动
      {
        path: '/marketing/ladder_group_to_add',
        icon: '',
        name: '',
        component: './marketing/ladder_group/add_ladder_group',
      },
      //阶梯团详情
      {
        path: '/marketing/ladder_group_to_view',
        icon: '',
        name: '',
        component: './marketing/ladder_group/view_ladder_group',
      },
      //阶梯团——团队列表
      {
        path: '/marketing/ladder_group_team_list',
        icon: '',
        name: '',
        component: './marketing/ladder_group/team_list',
      },
      //预售活动
      {
        path: '/marketing/presale',
        icon: 'gift',
        name: 'promotion_presale',
        component: './marketing/presale/index',
      },
      //预售查看详情
      {
        path: '/marketing/presale_to_view',
        icon: '',
        name: '',
        component: './marketing/presale/view_presale',
      },
      //预售的商品列表
      {
        path: '/marketing/presale_bind_goods',
        icon: '',
        name: '',
        component: './marketing/presale/joined_goods_list',
      },
      //新建预售活动
      {
        path: '/marketing/presale_to_add',
        icon: '',
        name: '',
        component: './marketing/presale/add_presale',
      },
      
      {
        component: '404',
      },
    ],
  }
];
