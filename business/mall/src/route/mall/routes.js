import Vue from 'vue';
import VueRouter from 'vue-router';
import extendUtils from 'common/lib/utils';
import config from 'common/lib/config'
const ORDER_ENTRANCE_MAP = {
	snapshot:'/order/snapshot/:orderNo',
	detail:'/order/detail/:orderNo',
};
const ENTRANCE_MAP = {
	navigation:'/navigation',
};


function replaceUrl(key, value){
    var oUrl = window.location.href.toString();
    var nUrl = `${oUrl}?${key}=${value}`;
    history.replaceState(null, null, nUrl)
}

Vue.use(VueRouter)
const routers = new VueRouter({
    routes: [	
        //引导页
        { 
            path: '/guide',
            component: resolve =>require(['modules/mall/views/guide/index.vue'], resolve),
            name: 'guide',
            meta: {
                needAnimation:false,
                keepAlive: false,
                title: '商品详情',
                supportGuest:true,
            },
        },

		{
		    path: '',
            component: resolve =>require(['modules/mall/views/wrapper.vue'], resolve),
            name: 'wrapper',
            supportGuest:true,
            redirect:{
                name:'index'
            },
            meta: {
		    	needAnimation:false,
		        keepAlive: false,                        
		        requiresAuth: false,
            },
            children: [
                //该路由(index)只做路由首页的重定向,目前是为了解决申请采购完结后点击去订购按钮后，跳转首页进行重定向
                { 
                    path: '/index',
                    component: resolve =>require(['modules/mall/views/index/indexSkeleton.vue'], resolve),
                    name: 'index',
                    supportGuest:true,
                    redirect: to => {
                        // 方法接收 目标路由 作为参数
                        // return 重定向的 字符串路径/路径对象
                        if(!!!to.query.supplierId){
                            return {
                                path: '/navigation'
                            }
                        }else{
                            return {
                                path: '/home'
                            }
                        }
                    }
                },
                //该路由为真正的商城首页
                { 
                    path: '/home',
                    component: resolve =>require(['modules/mall/views/index/index.vue'], resolve),
                    name: 'home',
                    meta: {
                        index: 1,
                        needAnimation:false,
                        keepAlive: true,
                        pageType: 'entry',
                        supportGuest:true
                    },
                },
                //京东企业购首页
                { 
                    path: '/indexJD',
                    component: resolve =>require(['modules/mall/views/index/indexJD.vue'], resolve),
                    name: 'indexJD',
                    meta: {
                        index: 1,
                        needAnimation:false,
                        keepAlive: true,
                        supportGuest:true,
                        title: '',
                        pageType: 'entry'
                    },
                },                
                //苏宁易购首页
                { 
                    path: '/indexSN',
                    component: resolve =>require(['modules/mall/views/index/indexSN.vue'], resolve),
                    name: 'indexSN',
                    meta: {
                        index: 1,
                        needAnimation:false,
                        keepAlive: true,
                        supportGuest:true,
                        title: '',
                        pageType: 'entry'
                    },
                },
                { 
                    path: '/category',
                    component: resolve =>require(['modules/mall/views/category/category.vue'], resolve),
                    name: 'category',
                    meta: {
                        index: 2,
                        needAnimation:true,
                        keepAlive: true,
                        supportGuest:true,
                        title: '分类',
                    },
                },
                { 
                    path: '/iCart',
                    component: resolve =>require(['modules/mall/views/cart/iCart.vue'], resolve),
                    name: 'iCart',
                    meta: {
                        index: 3,
                        needAnimation:true,
                        keepAlive: false,
                        title: '购物车',
                    },
                },       
                { 
                    path: '/personal/jd',
                    component: resolve =>require(['modules/mall/views/personal/personal.vue'], resolve),
                    name: 'personalJD',
                    meta: {
                        index: 4,
                        needAnimation:true,
                        keepAlive: true,
                        title: '',
                    },
                },            
                { 
                    path: '/personal/sn',
                    component: resolve =>require(['modules/mall/views/personal/personal.vue'], resolve),
                    name: 'personalSN',
                    meta: {
                        index: 4,
                        needAnimation:true,
                        keepAlive: true,
                        title: '',
                    },
                },            
          
            ]
        },

       
        { 
            path: '/personal',
            name: 'personal',
            redirect: to => {

                let supplierId = to.query.supplierId;

                let supplierIdListFun = () => {
                    let supplierIdList = config.supplierIdMap.supplierIdList;
                    replaceUrl('supplierId', supplierIdList[0]);
                    return {
                        path: '/mine',
                        query: {
                            supplierId: supplierIdList[0],
                            supplierIdList: supplierIdList.join('|')
                        }
                    }
                }
                if(!!supplierId){ 
                    return { //如果url上面只有supplierId参数，此时说明是商城内部点击底部footer我的item
                        path: `/personal/${config.SUPPLIER_Map[supplierId].shortName}`,
                        query: {
                            supplierId
                        }
                    }
                }else{ //如果url上面没有supplierId参数，此时说明是新配置的我的商城页面，此时根据环境去取配置项
                    return supplierIdListFun();
                }
            }
        },  
        
        { 
            path: '/mine',
            component: resolve =>require(['modules/mall/views/personal/personal.vue'], resolve),
            name: 'mine',
            meta: {
                needAnimation:true,
                keepAlive: true,
                title: '我的商城',
            },
        }, 

		{
		    path: '/jd',
            name: 'jd',
            supportGuest:true,
            redirect: to => {
                let supplierId = config.supplierIdMap['jd'].supplierId;

                //授权的代码获取授权协议的supplierId均是在url上面取值，当访问/jd路由时，此时url上面没有supplierId（导致一进入不弹授权组件的弹框），此时重新拼接supplierId到url上面
                //授权是在入口文件index.js 的 beforeEach路由守卫里面执行的，当执行该方法的时候，url并没有更新，上还是之前的地址（/jd），未变更，所以此处需要replaceState，将supplierId拼到url上面
                replaceUrl('supplierId', supplierId)
                return {
                    path: '/indexJD',
                    query: {
                        supplierId
                    }
                }
            }
        },

		{
		    path: '/sn',
            name: 'sn',
            supportGuest:true,
            redirect: to => {
                let supplierId = config.supplierIdMap['sn'].supplierId;
                replaceUrl('supplierId', supplierId)
                return {
                    path: '/indexSN',
                    query: {
                        supplierId
                    }
                }
            }
        },
        
        { 
            path: '/cart',
            component: resolve =>require(['modules/mall/views/cart/cart.vue'], resolve),
            name: 'cart',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '购物车',
            },
        },      
        {
            path: '/employees',
            component: resolve =>require(['modules/mall/views/activity/activitys.vue'], resolve),
            name: 'employees',
            meta: {
                needAnimation:true,
                keepAlive: true,
                title: '员工限时特惠',
                pageType: 'entry',
                supportGuest:true,
            },
        },       
        //营销活动                       
        {
            path: '/marketing',
            component: resolve =>require(['modules/mall/views/marketing/index.vue'], resolve),
            name: 'marketing',
            meta: {
                needAnimation:true,
                keepAlive: true,
                title: '',
                pageType: 'entry',
                supportGuest:true,
            },
        },                              
        {
            path: '/product/detail',
		    component: resolve =>require(['modules/mall/views/product/detail/page.vue'], resolve),
            name: 'productDetail',
            meta: {
		    	needAnimation:true,
		        keepAlive: false,                        
                requiresAuth: false,
                supportGuest:true,
		        title: '商品详情'
            }, 
        },                             
        {
            path: '/product/shareDetail',
		    component: resolve =>require(['modules/mall/views/product/detail/page.vue'], resolve),
            name: 'shareDetail',
            meta: {
		    	needAnimation:true,
		        keepAlive: false,                        
                requiresAuth: false,
                supportGuest:true,
		        title: '商品详情'
            }, 
        },
        { 
            path: '/favorite',
            component: resolve =>require(['modules/mall/views/favorite/favorite.vue'], resolve),
            name: 'favorite',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '我的收藏',
            },
        },
        { 
            path: '/share',
            component: resolve =>require(['modules/mall/views/share/share.vue'], resolve),
            name: 'share',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '',
                supportGuest:true,
            },
        },
        { 
            path: '/shareCart',
            component: resolve =>require(['modules/mall/views/share/share.vue'], resolve),
            name: 'shareCart',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '',
                supportGuest:true,
            },
        },
        { 
            path: '/search',
            component:resolve =>require(['modules/mall/views/search/search.vue'], resolve),
            name: 'search',
            meta: {
                needAnimation:false, //搜索页面不需要动画样式
                keepAlive: true,
                supportGuest:true,
                title: '搜索',
            },
        },
        { 
            path: '/product/list',
            component: resolve =>require(['modules/mall/views/product/list/list.vue'], resolve),
            name: 'productList',
            meta: {
                needAnimation:true,
                keepAlive: true,
                supportGuest:true,
                title: '商品列表',
            },
        },
        { 
            path: '/product/recommendList',
            component: resolve =>require(['modules/mall/views/product/list/recommendList.vue'], resolve),
            name: 'recommendList',
            meta: {
                needAnimation:true,
                keepAlive: true,
                supportGuest:true,
                title: '商品列表',
            },
        },
        { 
            path: '/purchase/list',
            component: resolve =>require(['modules/mall/views/purchase/list.vue'], resolve),
            name: 'purchaseList',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '常购清单',
            },
        },
        { 
            path: '/order/confirm',
            component: resolve =>require(['modules/mall/views/order/confirm/confirm.vue'], resolve),
            name: 'orderConfirm',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '填写订单',
            },
        },
        { 
            path: '/pay',
            component: resolve =>require(['modules/mall/views/pay/index.vue'], resolve),
            name: 'pay',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '支付',
            },
        },
        {
            path: '/order/list/:orderType',
            component: resolve =>require(['modules/mall/views/order/list/index.vue'], resolve),
            name: 'orderList',
            meta: {
                needAnimation:true,
                keepAlive: true,
                title: '我的订单',
            },
        },
		{
		    path: '/entrance/:orderNo',
		    name: 'orderEntrance',
			redirect: to => {
                let applayData = {};
                let resQuery = {};
                try {
                    applayData =JSON.parse(Base64.decode(to.query.applayData));
                    resQuery = {
                        "channelId": applayData.channelId || '',
                        "applayData":to.query.applayData,
                        "pageFrom":to.query.pageFrom || '',
                        "supplierId":to.query.supplierId,
                        "applyPage":to.query.applyPage,
                    }
                    if(!!to.query.flowStatus){
                        resQuery['flowStatus'] = to.query.flowStatus;
                        resQuery['flowId'] = to.query.flowId;
                        resQuery['signData'] = to.query.signData;
                    }
                } catch (error) {
                    
                }
				return {
                    path:ORDER_ENTRANCE_MAP[to.query.entranceType] || '/404',
                    query:resQuery
                }
			},
        },
		{
		    path: '/entrance',
		    name: 'entrance',
			redirect: to => {
				return {
                    path:ENTRANCE_MAP[to.query.entranceType] || '/404',
                }
			},
        },
        {
            path: '/navigation',
            component: resolve =>require(['modules/mall/views/navigation/index.vue'], resolve),
            name: 'navigation',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '选择商城',
            },
        },
        {
            path: '/order/snapshot/:orderNo',
            component: resolve =>require(['modules/mall/views/order/snapshot/index.vue'], resolve),
            name: 'snapshot',
            meta: {
                needAnimation:true,
                keepAlive: false,
                noAuthAgreement:true,
                title: '订单详情',
            },
        },
        {
            path: '/order/detail/:orderNo',
            component: resolve =>require(['modules/mall/views/order/detail/index.vue'], resolve),
            name: 'orderDetail',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '订单详情',
            },
        },
        {
            path: '/packageInfor',
            component: resolve =>require(['modules/mall/views/order/expressTrack/packageInfor.vue'], resolve),
            name: 'packageInfor',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '包裹信息',
            },
        },
        {
            path: '/expressTrack',
            component: resolve =>require(['modules/mall/views/order/expressTrack/index.vue'], resolve),
            name: 'expressTrack',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '订单跟踪',
            },
        },
        {
            path: '/orderEdit',
            component: resolve =>require(['modules/mall/views/order/list/components/orderEdit.vue'], resolve),
            name: 'orderEdit',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '修改订单',
            },
        },
        { 
            path: '/order/paySuccess',
            component: resolve =>require(['modules/mall/views/order/paySuccess/index.vue'], resolve),
            name: 'paySuccess',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '支付成功',
            },
        },
        {
            path: '/order/afterSale/list',
            component: resolve =>require(['modules/mall/views/order/afterSale/list.vue'], resolve),
            name: 'orderAfterSaleList',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '退换/售后',
            },
        },
        {
            path: '/order/afterSale/serviceChoose',
            component: resolve =>require(['modules/mall/views/order/afterSale/serviceChoose.vue'], resolve),
            name: 'orderAfterSaleServiceChoose',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '选择售后类型',
            },
        },
        {
            path: '/order/afterSale/serviceDetail',
            component: resolve =>require(['modules/mall/views/order/afterSale/serviceDetail.vue'], resolve),
            name: 'orderAfterSaleServiceDetail',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '服务单详情',
            },
        },
        {
            path: '/order/afterSale/progressDetail',
            component: resolve =>require(['modules/mall/views/order/afterSale/progressDetail.vue'], resolve),
            name: 'orderAfterSaleProgressDetail',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '进度详情',
            },
        },
        {
            path: '/order/afterSale/apply',
            component: resolve =>require(['modules/mall/views/order/afterSale/apply.vue'], resolve),
            name: 'orderAfterSaleApply',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '',
            },
        },
        {
            path: '/order/afterSale/result',
            component: resolve =>require(['modules/mall/views/order/afterSale/result.vue'], resolve),
            name: 'orderAfterSaleResult',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '结果页',
            },
        },
        {
            path: '/order/afterSale/sendSku',
            component: resolve =>require(['modules/mall/views/order/afterSale/sendSku.vue'], resolve),
            name: 'orderAfterSaleSendSku',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '填写发运信息',
            },
        },
        {
            path: '/invoice',
            component: resolve =>require(['modules/mall/views/order/invoice/detail.vue'], resolve),
            name: 'invoiceDetail',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '发票详情',
            },
        },
        {
            path: '/refundDetail',
            component: resolve =>require(['modules/mall/views/order/refund/detail.vue'], resolve),
            name: 'refundDetail',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '退款明细',
            },
        },
        {
            path: '/invoiceReapply',
            component: resolve =>require(['modules/mall/views/order/invoice/invoiceReapply.vue'], resolve),
            name: 'invoiceReapply',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '',
            },
        },
        {
            path: '/exportOrderList',
            component: resolve =>require(['modules/mall/views/order/list/exportList.vue'], resolve),
            name: 'exportOrderList',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '费用明细',
                noAuthAgreement: true,//不显示授权协议
            },
        },
        {
            path: '/address',
            component: resolve =>require(['modules/mall/views/personal/address.vue'], resolve),
            name: 'address',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '地址管理',
            },
        },
        {
            path: '/invoiceAssist',
            component: resolve =>require(['modules/mall/views/personal/invoice.vue'], resolve),
            name: 'invoiceAssist',
            meta: {
                needAnimation:true,
                keepAlive: false,
                title: '发票助手',
            },
        },

        {
            path: '/404',
            component: resolve =>require(['modules/mall/views/404.vue'], resolve),
            name: '',
        },
    ],
	scrollBehavior (to, from, savedPosition) {
	  return new Promise((resolve, reject) => {
	    setTimeout(() => {
	      resolve({ x: 0, y: 0 })
	    }, 10)
	  })
	}
});
export default routers;