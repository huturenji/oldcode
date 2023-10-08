import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routers = new VueRouter({
  // mode: 'history',
  routes: [
    //重定向到列表页面
    // {
    //   path: '/',
    //   redirect: '/mainPage',
    // },
    {
      path: '/',
      component: resolve => require(['modules/views/custlayout.vue'], resolve),
      name: '',
      meta: {
        requiresAuth: false,
        title: '运营管理'
      },
      children: [        
        {
          path: 'order/all',
          component: resolve => require(['modules/views/order/all/list.vue'], resolve),
          name: 'orderList',
          meta: {
            keepAlive: true,
            requiresAuth: false,
            name: ['订单中心', '全部'],
            path: [""],
            title: '全部订单'
          }
        },
        {
          path: 'order/flight',
          component: resolve => require(['modules/views/order/flight/list.vue'], resolve),
          name: 'orderListPageFlight',
          meta: {
            keepAlive: true,
            requiresAuth: false,
            name: ['订单中心', '机票'],
            path: [""],
            title: '机票'
          }
        },
        {
          path: 'order/train',
          component: resolve => require(['modules/views/order/train/list.vue'], resolve),
          name: 'orderListPageTrain',
          meta: {
            keepAlive: true,
            requiresAuth: false,
            name: ['订单中心', '火车票'],
            path: [""],
            title: '火车票'
          }
        },
        {
          path: 'order/hotel',
          component: resolve => require(['modules/views/order/hotel/list.vue'], resolve),
          name: 'orderListPageHotel',
          meta: {
            keepAlive: true,
            requiresAuth: false,
            name: ['订单中心', '酒店'],
            path: [""],
            title: '酒店'
          }
        },
        {
          path: 'order/express',
          component: resolve => require(['modules/views/order/express/list.vue'], resolve),
          name: 'orderListPageExpress',
          meta: {
            keepAlive: true,
            requiresAuth: false,
            name: ['订单中心', '快递'],
            path: [""],
            title: '快递'
          }
        },
        {
          path: 'order/insurance',
          component: resolve => require(['modules/views/order/insurance/list.vue'], resolve),
          name: 'orderListPageInsurance',
          meta: {
            keepAlive: true,
            requiresAuth: false,
            name: ['订单中心', '保险'],
            path: [""],
            title: '保险'
          }
        },
        {
          path: 'aborder',
          component: resolve => require(['modules/views/abnormal-order/flight/list.vue'], resolve),
          name: 'abnormalOrder',
          meta: {
            keepAlive: true,
            requiresAuth: false,
            name: ['异常单处理中心', '异常机票'],
            path: [""],
            title: '异常单处理中心'
          }
        },
        {
          path: 'aborder/flight',
          component: resolve => require(['modules/views/abnormal-order/flight/list.vue'], resolve),
          name: 'abnormalOrderFlight',
          meta: {
            keepAlive: true,
            requiresAuth: false,
            name: ['异常单处理中心', '异常机票'],
            path: [""],
            title: '异常机票'
          }
        },
        {
          path: 'aborder/hotel',
          component: resolve => require(['modules/views/abnormal-order/hotel/list.vue'], resolve),
          name: 'abnormalOrderHotel',
          meta: {
            keepAlive: true,
            requiresAuth: false,
            name: ['异常单处理中心', '异常酒店'],
            path: [""],
            title: '异常酒店'
          }
        },        
        {
          path: 'aborder/train',
          component: resolve => require(['modules/views/abnormal-order/train/list.vue'], resolve),
          name: 'abnormalOrderTrain',
          meta: {
            keepAlive: true,
            requiresAuth: false,
            name: ['异常单处理中心', '异常火车票'],
            path: [""],
            title: '异常火车票'
          }
        },  
        {
          path: 'aborder/insurance',
          component: resolve => require(['modules/views/abnormal-order/insurance/list.vue'], resolve),
          name: 'abnormalOrderInsurance',
          meta: {
            keepAlive: true,
            requiresAuth: false,
            name: ['异常单处理中心', '异常保险'],
            path: [""],
            title: '异常保险'
          }
        },                 
        {
          path: 'mail',
          component: resolve => require(['modules/views/mail/list.vue'], resolve),
          name: 'toMailOrderList',
          meta: {
            keepAlive: true,
            requiresAuth: false,
            name: ['邮寄报销凭证'],
            path: [""],
            title: '邮寄报销凭证'
          }
        },
        {
          path: 'mail/batchMail',
          component: resolve => require(['modules/views/mail/batch.vue'], resolve),
          name: 'batchMail',
          meta: {
            keepAlive: true,
            requiresAuth: false,
            name: ['邮寄报销凭证', '批量邮寄'],
            path: ["/mail"],
            title: '批量邮寄'
          }
        },
        {
          path: 'statistics',
          component: resolve => require(['modules/views/statistics/home.vue'], resolve),
          name: 'operationStatistics',
          meta: {
            keepAlive: true,
            requiresAuth: false,
            name: ['运营统计'],
            path: [""],
            title: '运营统计'
          },
          children: [
            {
              path: '/',
              redirect: '/statistics/operationStatisticsHome',
            },
            {
              path: 'operationStatisticsHome',
              component: resolve => require(['modules/views/statistics/chartspage.vue'], resolve),
              name: 'operationStatisticsHome',
              meta: {
                keepAlive: true,
                requiresAuth: false,
                name: ['运营统计'],
                path: [""],
                title: '运营统计'
              },
            },
            {
              path: 'salesAmount',
              component: resolve => require(['modules/views/statistics/sales.vue'], resolve),
              name: 'salesAmount',
              meta: {
                keepAlive: true,
                requiresAuth: false,
                name: ['运营统计', "销售金额明细"],
                path: ["/statistics/operationStatisticsHome"],
                title: '销售金额明细'
              },
            },
            {
              path: 'refundAmount',
              component: resolve => require(['modules/views/statistics/refund.vue'], resolve),
              name: 'refundAmount',
              meta: {
                keepAlive: true,
                requiresAuth: false,
                name: ['运营统计', "退款金额明细"],
                path: ["/statistics/operationStatisticsHome"],
                title: '退款金额明细'
              },
            }
          ]

        },
        {
          path: 'channel',
          component: resolve => require(['modules/views/channel/list.vue'], resolve),
          name: 'channelList',
          meta: {
            keepAlive: true,
            requiresAuth: false,
            name: ['渠道管理'],
            path: [""],
            title: '渠道管理'
          }
        },
        {
          path: 'channel/addChannel',
          component: resolve => require(['modules/views/channel/edit.vue'], resolve),
          name: 'addChannel',
          meta: {
            keepAlive: true,
            requiresAuth: false,
            name: ['渠道管理', '新增'],
            path: ["/channel"],
          }
        },
        {
          path: 'channel/editChannel',
          component: resolve => require(['modules/views/channel/edit.vue'], resolve),
          name: 'editChannel',
          meta: {
            keepAlive: true,
            requiresAuth: false,
            name: ['渠道管理', '编辑'],
            path: ["/channel"],
          }
        },
        {
          path: 'financial',
          component: resolve => require(['modules/views/financial/home.vue'], resolve),
          name: 'financialStatementsHome',
          meta: {
            keepAlive: false,
            requiresAuth: false,
            name: ['财务报表'],
            path: [""],
            title: '财务报表'
          }
        },
        {
          path: 'configure',
          component: resolve => require(['modules/views/configure/systemconfig.vue'], resolve),
          name: 'systemConfiguration',
          meta: {
            keepAlive: false,
            requiresAuth: false,
            name: ['配置中心'],
            path: [""],
            title: '配置中心'
          }
        },
        {
          path: 'configure/insurance',
          component: resolve => require(['modules/views/configure/insurance/list.vue'], resolve),
          name: 'insuranceProductList',
          meta: {
            keepAlive: false,
            requiresAuth: false,
            name: ['配置中心', '保险配置'],
            path: [""],
            title: '保险配置'
          }
        },
        {
          path: 'configure/insurance/insuranceProductDetail',
          component: resolve => require(['modules/views/configure/insurance/detail.vue'], resolve),
          name: 'insuranceProductDetail',
          meta: {
            keepAlive: false,
            requiresAuth: false,
            name: ['配置中心', '保险配置', '保险详情'],
            path: ["", "/configure/insurance"],
            title: '保险详情'
          }
        },
        {
          path: 'notice',
          component: resolve => require(['modules/views/notice/list.vue'], resolve),
          name: 'serviceReminder',
          meta: {
            keepAlive: false,
            requiresAuth: false,
            name: ['服务提醒'],
            path: [""],
            title: '服务提醒'
          }
        },
        {
          path: 'notice/addReminder',
          component: resolve => require(['modules/views/notice/edit.vue'], resolve),
          name: 'addReminder',
          meta: {
            keepAlive: false,
            requiresAuth: false,
            name: ['服务提醒', '新增'],
            path: ["/notice"],
          }
        },
        {
          path: 'notice/editReminder',
          component: resolve => require(['modules/views/notice/edit.vue'], resolve),
          name: 'editReminder',
          meta: {
            keepAlive: false,
            requiresAuth: false,
            name: ['服务提醒', '编辑'],
            path: ["/notice"],
          }
        },
        {
          path: 'supplier',
          component:resolve => require(['modules/views/supplier/list.vue'], resolve),
          name: 'suppliConfiguration',
          meta: {
            keepAlive: false,
            requiresAuth: false,
            name: ['供应商配置'],
            path: [""],
            title: '供应商配置'
          }
        },
        {
          path: "sysmgr/user",
          name: "usermanage",
          component: resolve => (require(["modules/views/system-management/user/usermanage.vue"], resolve)),
          meta: {
            requiresAuth: false,
            title: "用户管理",
            keepAlive: true,
            name: ['系统管理', '用户管理'],
            path: [""],
          }
        },
        {
          path: "sysmgr/user/adduser",
          name: "adduser",
          component: resolve => (require(["modules/views/system-management/user/adduser.vue"], resolve)),
          meta: {
            requiresAuth: false,
            title: "添加人员",
            name: ['系统管理', '用户管理', '添加人员'],
            path: ["", '/sysmgr/user'],
          }
    
        },
        {
          path: "sysmgr/user/userdetails",
          name: "userdetails",
          component: resolve => (require(["modules/views/system-management/user/userdetails.vue"], resolve)),
          meta: {
            requiresAuth: false,
            title: "用户详情",
            name: ['系统管理', '用户管理', '用户详情'],
            path: ["", '/sysmgr/user'],
          }
    
        },
        {
          path: "sysmgr/user/userinfoedit",
          name: "userinfoedit",
          component: resolve => (require(["modules/views/system-management/user/userinfoedit.vue"], resolve)),
          meta: {
            requiresAuth: false,
            title: "编辑人员",
            name: ['系统管理', '用户管理', '用户详情', '编辑人员'],
            path: ["", '/sysmgr/user', '/sysmgr/user/userdetails'],
          }
    
        },
        {
          path: "sysmgr/role",
          name: "rolemange",
          component: resolve => (require(["modules/views/system-management/role/rolemange.vue"], resolve)),
          meta: {
            requiresAuth: false,
            title: "角色管理",
            keepAlive: true,
            name: ['系统管理', '角色管理'],
            path: [""],
          }
        },
        {
          path: "sysmgr/role/addroles",
          name: "addroles",
          component: resolve => (require(["modules/views/system-management/role/addroles.vue"], resolve)),
          meta: {
            requiresAuth: false,
            title: "添加角色",
            name: ['系统管理', '角色管理', '添加角色'],
            path: ["", '/sysmgr/role'],
          }
        },
        {
          path: "sysmgr/role/roledetails",
          name: "roledetails",
          component: resolve => (require(["modules/views/system-management/role/roledetails.vue"], resolve)),
          meta: {
            requiresAuth: false,
            title: "角色详情",
            name: ['系统管理', '角色管理', '角色详情'],
            path: ["", '/sysmgr/role'],
          }
        },
        {
          path: "sysmgr/role/roleinfoedit",
          name: "roleinfoedit",
          component: resolve => (require(["modules/views/system-management/role/roleinfoedit.vue"], resolve)),
          meta: {
            requiresAuth: false,
            title: "添加角色",
            name: ['系统管理', '角色管理', '角色详情', '编辑角色'],
            path: ["", '/sysmgr/role', '/sysmgr/role/roledetails'],
          }
    
        },
        // {
        //   path: "powermange",
        //   name: "powermange",
        //   component: resolve => (require(["modules/views/system-management/auth/powermange.vue"], resolve)),
        //   meta: {
        //     requiresAuth: false,
        //     title: "权限管理",
        //     keepAlive: true,
        //     name: ['系统管理', '权限管理'],
        //     path: [""],
        //   }
        // },                      
      ]
    },
    {
      path: '/order/orderDetail',
      component: resolve => require(['modules/views/order/detail/detail.vue'], resolve),
      name: 'orderDetail',
      meta: {
        requiresAuth: false,
        title: '订单详情'
      }
    },
    {
      path: '/orderDetailExpress',
      component: resolve => require(['modules/views/order/detail/templet/express.vue'], resolve),
      name: 'orderDetailExpress',
      meta: {
        requiresAuth: false,
        title: "快递订单详情"
      }
    },

    {
      path: '/*',
      component: resolve => require(['components/error/404.vue'], resolve),
      name: '',
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ x: 0, y: 0 })
      }, 10)
    })
  }
});
export default routers;
