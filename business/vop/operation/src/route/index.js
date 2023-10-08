import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
const routers = new VueRouter({
  routes: [
    //重定向到首页
    {
      path: "/",
      component: (resolve) =>
        require(["modules/views/pagelayout.vue"], resolve),
      name: "",
      meta: { requiresAuth: false },
      children: [
        {
          path: "product/shelves",
          name: "shelves",
          component: (resolve) =>
            require(["modules/views/product/shelves/search.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "下架管理",
            breadcrumbItems: [
              { title: "下架管理", routePath: "/product/shelves" },
            ],
            // keepAlive: true,
          },
        },
        {
          path: "product/shelves/detail",
          name: "shelvesDetail",
          component: (resolve) =>
            require(["modules/views/product/shelves/detail.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "规则详情",
            breadcrumbItems: [
              { title: "下架管理", routePath: "/product/shelves" },
              { title: "规则详情", routePath: "/product/shelves/detail" },
            ],
          },
        },
        {
          path: "product/shelves/add",
          name: "shelvesAdd",
          component: (resolve) =>
            require(["modules/views/product/shelves/add.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "新建下架规则",
            breadcrumbItems: [
              { title: "下架管理", routePath: "/product/shelves" },
              { title: "新建下架规则", routePath: "/product/shelves/add" },
            ],
          },
        },
        {
          path: "product/shelves/edit",
          name: "shelvesEdit",
          component: (resolve) =>
            require(["modules/views/product/shelves/add.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "编辑规则",
            breadcrumbItems: [
              { title: "下架管理", routePath: "/product/shelves" },
              { title: "编辑规则", routePath: "/product/shelves/edit" },
            ],
          },
        },
        {
          path: "product/price",
          name: "price",
          component: (resolve) =>
            require(["modules/views/product/price/search.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "定价管理",
            breadcrumbItems: [{ title: "定价管理", routePath: "/product/price" }],
            // keepAlive: true,
          },
        },
        {
          path: "product/price/detail",
          name: "priceDetail",
          component: (resolve) =>
            require(["modules/views/product/price/detail.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "定价详情",
            breadcrumbItems: [
              { title: "定价管理", routePath: "/product/price" },
              { title: "定价详情", routePath: "/product/price/detail" },
            ],
          },
        },
        {
          path: "product/price/add",
          name: "priceAdd",
          component: (resolve) =>
            require(["modules/views/product/price/add.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "新增定价",
            breadcrumbItems: [
              { title: "定价管理", routePath: "/product/price" },
              { title: "新增定价", routePath: "/product/price/add" },
            ],
          },
        },
        {
          path: "product/price/edit",
          name: "priceEdit",
          component: (resolve) =>
            require(["modules/views/product/price/add.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "编辑定价",
            breadcrumbItems: [
              { title: "定价管理", routePath: "/product/price" },
              { title: "编辑定价", routePath: "/product/price/edit" },
            ],
          },
        },
        {
          path: "supplier",
          name: "supplier",
          component: (resolve) =>
            require(["modules/views/supplier/search.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "供应商管理",
            breadcrumbItems: [
              { title: "供应商管理", routePath: "/supplier" },
            ]
          },
        },
        {
          path: "supplier/add",
          name: "supplierAdd",
          component: (resolve) =>
            require(["modules/views/supplier/add.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "供应商详情",
            breadcrumbItems: [
              { title: "供应商管理", routePath: "/supplier" },
              { title: "新建供应商", routePath: "/supplier/add" },
            ],
          },
        },
        {
          path: "supplier/detail",
          name: "supplierDetail",
          component: (resolve) =>
            require(["modules/views/supplier/add.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "供应商详情",
            breadcrumbItems: [
              { title: "供应商管理", routePath: "/supplier" },
              { title: "供应商详情", routePath: "/supplier/detail" },
            ],
          },
        },
        {
          path: "channel",
          name: "channel",
          component: (resolve) =>
            require(["modules/views/channel/search.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "渠道管理",
            breadcrumbItems: [
              { title: "渠道管理", routePath: "/channel" },
            ],
            keepAlive: true,
          },
        },
        {
          path: "channel/detail",
          name: "channelDetail",
          component: (resolve) =>
            require(["modules/views/channel/detail.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "渠道详情",
            breadcrumbItems: [
              { title: "渠道管理", routePath: "/channel" },
              { title: "渠道详情", routePath: "/channel/detail" },
            ],
          },
        },
        {
          path: "channel/add",
          name: "channelAdd",
          component: (resolve) =>
            require(["modules/views/channel/add.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "新增渠道",
            breadcrumbItems: [
              { title: "渠道管理", routePath: "/channel" },
              { title: "新增渠道", routePath: "/channel/add" },
            ],
          },
        },
        {
          path: "sysmgr/user",
          name: "usermanage",
          component: (resolve) =>
            require(["modules/views/system-management/user/list.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "用户管理",
            breadcrumbItems: [
              { title: "用户管理", routePath: "/sysmgr/user" },
            ],
            keepAlive: true,
          },
        },
        {
          path: "sysmgr/user/adduser",
          name: "adduser",
          component: (resolve) =>
            require(["modules/views/system-management/user/add.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "添加人员",
            breadcrumbItems: [
              { title: "用户管理", routePath: "/sysmgr/user" },
              { title: "添加人员", routePath: "/sysmgr/user/adduser" },
            ],
          },
        },
        {
          path: "sysmgr/user/userdetails",
          name: "userdetails",
          component: (resolve) =>
            require([
              "modules/views/system-management/user/detail.vue",
            ], resolve),
          meta: {
            requiresAuth: false,
            title: "用户详情",
            breadcrumbItems: [
              { title: "用户管理", routePath: "/sysmgr/user" },
              { title: "用户详情", routePath: "/sysmgr/user/userdetails" },
            ],
          },
        },
        {
          path: "sysmgr/user/userinfoedit",
          name: "userinfoedit",
          component: (resolve) =>
            require(["modules/views/system-management/user/edit.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "编辑人员",
            breadcrumbItems: [
              { title: "用户管理", routePath: "/sysmgr/user" },
              { title: "编辑人员", routePath: "/sysmgr/user/userinfoedit" },
            ],
          },
        },
        {
          path: "sysmgr/role",
          name: "rolemange",
          component: (resolve) =>
            require(["modules/views/system-management/role/list.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "角色管理",
            breadcrumbItems: [
              { title: "角色管理", routePath: "/sysmgr/role" },
            ],
            keepAlive: true,
          },
        },
        {
          path: "sysmgr/role/addroles",
          name: "addroles",
          component: (resolve) =>
            require(["modules/views/system-management/role/add.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "添加角色",
            breadcrumbItems: [
              { title: "角色管理", routePath: "/sysmgr/role" },
              { title: "添加角色", routePath: "/sysmgr/role/addroles" },
            ],
          },
        },
        {
          path: "sysmgr/role/roledetails",
          name: "roledetails",
          component: (resolve) =>
            require([
              "modules/views/system-management/role/detail.vue",
            ], resolve),
          meta: {
            requiresAuth: false,
            title: "添加角色",
            breadcrumbItems: [
              { title: "角色管理", routePath: "/sysmgr/role" },
              { title: "角色详情", routePath: "/sysmgr/role/roledetails" },
            ],
          },
        },
        {
          path: "sysmgr/role/roleinfoedit",
          name: "roleinfoedit",
          component: (resolve) =>
            require(["modules/views/system-management/role/edit.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "编辑角色",
            breadcrumbItems: [
              { title: "角色管理", routePath: "/sysmgr/role" },
              { title: "编辑角色", routePath: "/sysmgr/role/roleinfoedit" },
            ],
          },
        },
        {
          path: "order/sale",
          name: "sale",
          component: (resolve) =>
            require([
              "modules/views/order/sale/search.vue",
            ], resolve),
          meta: {
            requiresAuth: false,
            breadcrumbItems: [{ title: "订单管理", routePath: "/order/sale" }],
            title: "订单管理",
            keepAlive: true,
          },
        },
        {
          path: "order/sale/saleparent",
          name: "saleparent",
          component: (resolve) =>
            require([
              "modules/views/order/sale/saleparentdetail.vue",
            ], resolve),
          meta: {
            requiresAuth: false,
            breadcrumbItems: [
              { title: "订单管理", routePath: "/order/sale" },
              { title: "订单管理详情", routePath: "/order/sale/saleparent" },
            ],
            title: "订单管理详情",
          },
        },
        {
          path: "order/sale/salechild",
          name: "salechild",
          component: (resolve) =>
            require([
              "modules/views/order/sale/salechilddetail.vue",
            ], resolve),
          meta: {
            requiresAuth: false,
            breadcrumbItems: [
              { title: "订单管理", routePath: "/order/sale" },
              { title: "订单管理详情", routePath: "/order/sale/salechild" },
            ],
            title: "订单管理详情",
          },
        },
        {
          path: "order/sale/pageorderdetail",
          name: "pageorderdetail",
          component: (resolve) =>
            require([
              "modules/views/order/sale/pgorderdetail.vue",
            ], resolve),
          meta: {
            requiresAuth: false,
            breadcrumbItems: [
              { title: "订单管理", routePath: "/order/sale" },
              { title: "订单管理详情", routePath: "/order/sale/pageorderdetail" },
            ],
            title: "订单管理详情",
          },
        },
        {
          path: "aftersales/customer",
          name: "customer",
          component: (resolve) =>
            require([
              "modules/views/after-sales/customer/search.vue",
            ], resolve),
          meta: {
            requiresAuth: false,
            breadcrumbItems: [{ title: "客服坐席", routePath: "/aftersales/customer" },],
            title: "客服坐席",
            keepAlive: true,
          },
        },
        {
          path: "aftersales/ticket",
          name: "ticket",
          component: (resolve) =>
            require([
              "modules/views/after-sales/ticket/search.vue",
            ], resolve),
          meta: {
            requiresAuth: false,
            breadcrumbItems: [{ title: "服务单管理", routePath: "/aftersales/ticket" },],
            title: "服务单管理",
            keepAlive: true,
          },
        },
        {
          path: "aftersales/ticketdetail",
          name: "aftersalesorderdetail",
          component: (resolve) =>
            require([
              "modules/views/after-sales/ticket/detail.vue",
            ], resolve),
          meta: {
            requiresAuth: false,
            breadcrumbItems: [
              { title: "服务单管理", routePath: "/aftersales/ticket" },
              { title: "服务单详情", routePath: "/aftersales/ticketdetail" },
            ],
            title: "服务单详情",
          },
        },
        
        {
          path: "virtualsuppliers/home",
          name: "virtualsuppliers",
          component: (resolve) =>
            require(["modules/views/virtualsuppliers/home.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "辅助工具",
            breadcrumbItems: [
              { title: "辅助工具", routePath: "/virtualsuppliers/home" },
            ],
            keepAlive: false,
          },
        },
        {
          path: "virtualsuppliers/jd",
          name: "virtualsuppliersjd",
          component: (resolve) =>
            require(["modules/views/virtualsuppliers/virtual4jd.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "京东虚拟供应商",
            breadcrumbItems: [
              { title: "辅助工具", routePath: "/virtualsuppliers/home" },
              { title: "京东虚拟供应商", routePath: "/virtualsuppliers/jd" },
            ],
            keepAlive: false,
          },
        },
        {
          path: "virtualsuppliers/jdvporderinfo",
          name: "virtualsuppliersjdvporderinfo",
          component: (resolve) =>
            require(["modules/views/virtualsuppliers/jdvporderinfo.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "京东供应商资金明细",
            breadcrumbItems: [
              { title: "辅助工具", routePath: "/virtualsuppliers/home" },
              { title: "京东供应商资金明细", routePath: "/virtualsuppliers/jdvporderinfo" },
            ],
            keepAlive: false,
          },
        },
        {
          path: "tools/selectionTool",
          name: "selectionTool",
          component: (resolve) =>
            require(["modules/views/tools/selectionTool.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "选品工具",
            breadcrumbItems: [  
              { title: "辅助工具", routePath: "/virtualsuppliers/home" },
              { title: "选品工具", routePath: "/tools/selectionTool" }],
          },
        },
        {
          path: "tools/selectionTool/checkSale",
          name: "checkSale",
          component: (resolve) =>
            require(["modules/views/tools/checkSale.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "查询可售性",
            breadcrumbItems: [  
              { title: "辅助工具", routePath: "/virtualsuppliers/home" },
              { title: "选品工具", routePath: "/tools/selectionTool" },
              { title: "查询可售性", routePath: "/tools/selectionTool/checkSale" }
            ],
          },
        },
        {
          path: "tools/selectionTool/realTimeSearch",
          name: "realTimeSearch",
          component: (resolve) =>
            require(["modules/views/tools/realTimeSearch.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "实时搜索",
            breadcrumbItems: [  
              { title: "辅助工具", routePath: "/virtualsuppliers/home" },
              { title: "选品工具", routePath: "/tools/selectionTool" },
              { title: "实时搜索", routePath: "/tools/selectionTool/realTimeSearch" }
            ],
          },
        },
        {
          path: "tools/selectionTool/seckill",
          name: "seckill",
          component: (resolve) =>
            require(["modules/views/tools/selectionTool.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "秒杀",
            breadcrumbItems: [  
              { title: "辅助工具", routePath: "/virtualsuppliers/home" },
              { title: "选品工具", routePath: "/tools/selectionTool" },
              { title: "秒杀", routePath: "/tools/selectionTool/seckill" }
            ],
          },
        },
        {
          path: "tools/selectionTool/ecbuy",
          name: "ecbuy",
          component: (resolve) =>
            require(["modules/views/tools/selectionTool.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "一起买",
            breadcrumbItems: [  
              { title: "辅助工具", routePath: "/virtualsuppliers/home" },
              { title: "选品工具", routePath: "/tools/selectionTool" },
              { title: "一起买", routePath: "/tools/selectionTool/ecbuy" }
            ],
          },
        },
        {
          path: "tools/selectionTool/dayday",
          name: "dayday",
          component: (resolve) =>
            require(["modules/views/tools/selectionTool.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "天天专场",
            breadcrumbItems: [  
              { title: "辅助工具", routePath: "/virtualsuppliers/home" },
              { title: "选品工具", routePath: "/tools/selectionTool" },
              { title: "天天专场", routePath: "/tools/selectionTool/dayday" }
            ],
          },
        },
        {
          path: "tools/selectionTool/emaoqing",
          name: "emaoqing",
          component: (resolve) =>
            require(["modules/views/tools/selectionTool.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "鹅毛情",
            breadcrumbItems: [  
              { title: "辅助工具", routePath: "/virtualsuppliers/home" },
              { title: "选品工具", routePath: "/tools/selectionTool" },
              { title: "鹅毛情", routePath: "/tools/selectionTool/emaoqing" }
            ],
          },
        },
        {
          path: "tools/selectionTool/festival",
          name: "festival",
          component: (resolve) =>
            require(["modules/views/tools/selectionTool.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "节日专场",
            breadcrumbItems: [  
              { title: "辅助工具", routePath: "/virtualsuppliers/home" },
              { title: "选品工具", routePath: "/tools/selectionTool" },
              { title: "节日专场", routePath: "/tools/selectionTool/festival" }
            ],
          },
        },
        {
          path: "tools/selectionTool/discount",
          name: "discount",
          component: (resolve) =>
            require(["modules/views/tools/selectionTool.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "满减专场",
            breadcrumbItems: [  
              { title: "辅助工具", routePath: "/virtualsuppliers/home" },
              { title: "选品工具", routePath: "/tools/selectionTool" },
              { title: "满减专场", routePath: "/tools/selectionTool/discount" }
            ],
          },
        },
        {
          path: "tools/selectionTool/jdAcquireModule",
          name: "jdAcquireModule",
          component: (resolve) =>
            require(["modules/views/tools/jdAcquireModule/index.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "京东数据采集管理",
            breadcrumbItems: [  
              { title: "辅助工具", routePath: "/virtualsuppliers/home" },
              { title: "选品工具", routePath: "/tools/selectionTool" },
              { title: "京东数据采集管理", routePath: "/tools/selectionTool/jdAcquireModule" }
            ],
          },
        },
        {
          path: "tools/selectionTool/crawlData",
          name: "crawlData",
          component: (resolve) =>
            require(["modules/views/tools/jdAcquireModule/crawlData.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "爬取选品",
            breadcrumbItems: [  
              { title: "辅助工具", routePath: "/virtualsuppliers/home" },
              { title: "选品工具", routePath: "/tools/selectionTool" },
              { title: "京东数据采集管理", routePath: "/tools/selectionTool/jdAcquireModule" },
              { title: "爬取选品", routePath: "/tools/selectionTool/crawlData" }
            ],
          },
        },
        {
          path: "tools/selectionTool/acquireData",
          name: "acquireData",
          component: (resolve) =>
            require(["modules/views/tools/jdAcquireModule/acquireData.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "数据采集管理",
            breadcrumbItems: [  
              { title: "辅助工具", routePath: "/virtualsuppliers/home" },
              { title: "选品工具", routePath: "/tools/selectionTool" },
              { title: "京东数据采集管理", routePath: "/tools/selectionTool/jdAcquireModule" },
              { title: "数据采集管理", routePath: "/tools/selectionTool/acquireData" }
            ],
          },
        },
        {
          path: "tools/selectionTool/staticsData",
          name: "staticsData",
          component: (resolve) =>
            require(["modules/views/tools/jdAcquireModule/staticsData.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "数据统计",
            breadcrumbItems: [  
              { title: "辅助工具", routePath: "/virtualsuppliers/home" },
              { title: "选品工具", routePath: "/tools/selectionTool" },
              { title: "京东数据采集管理", routePath: "/tools/selectionTool/jdAcquireModule" },
              { title: "数据统计", routePath: "/tools/selectionTool/staticsData" }
            ],
          },
        },    
        {
          path: "virtualsuppliers/urlEncode",
          name: "urlEncode",
          component: (resolve) =>
            require(["modules/views/virtualsuppliers/urlEncode.vue"], resolve),
          meta: {
            requiresAuth: false,
            title: "url编码工具",
            breadcrumbItems: [
              { title: "辅助工具", routePath: "/virtualsuppliers/home" },
              { title: "url编码工具", routePath: "/virtualsuppliers/urlEncode" },
            ],
            keepAlive: false,
          },
        }       
      ],
    },
    {
      path: "/*",
      component: (resolve) => require(["modules/views/404.vue"], resolve),
      name: "",
      meta: {},
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ x: 0, y: 0 });
      }, 10);
    });
  },
});
export default routers;
