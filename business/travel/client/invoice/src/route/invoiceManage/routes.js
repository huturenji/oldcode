import Vue from 'vue';
import VueRouter from 'vue-router';
import invoiceHandler from 'modules/invoiceManage/views/common/lib/invoiceHandler.js';

Vue.use(VueRouter)
const routers = new VueRouter({
    // mode: 'history',
    routes: [
        {
            path: '/cpy',
            component: resolve => require(['modules/invoiceManage/views/invoiceSet/invoiceSet.vue'], resolve),
            name: '',
            meta: {
                needAnimation: false,
                requiresAuth: false,
                title: ''
            }
        },
        {
            path: '/invoiceSet',
            component: resolve => require(['modules/invoiceManage/views/invoiceSet/invoiceSet.vue'], resolve),
            name: '',
            meta: {
                needAnimation: false,
                requiresAuth: false,
                title: ''
            }
        },
        {
            path: '/assist',
            component: resolve => require(['modules/invoiceManage/views/assist/wrapperIndex.vue'], resolve),
            name: '',
            meta: {
                needAnimation: false,
                keepAlive: false,
                requiresAuth: false,
                title: '发票助手',
                pageType: 'entry'
            }
        },
        {
            path: '/',
            component: resolve => require(['modules/invoiceManage/views/assist/wrapperIndex.vue'], resolve),
            name: '',
            meta: {
                needAnimation: false,
                keepAlive: false,
                requiresAuth: false,
                title: '发票助手',
                pageType: 'entry'
            }
        },
        {
            path: '/checkPage',
            component: resolve => require(['modules/invoiceManage/views/checkInvoiceManagement/index/indexPage.vue'], resolve),
            name: '',
            redirect: () => {
                // 方法接收 目标路由 作为参数
                // return 重定向的 字符串路径/路径对象
                if (invoiceHandler.isPC()){ 
                    return {
                        path: '/checkPC'
                    }
                }
                return {
                    path: '/check'
                }
            }
        },
        {
            path: '/checkpage',
            component: resolve => require(['modules/invoiceManage/views/checkInvoiceManagement/index/indexPage.vue'], resolve),
            name: '',
            redirect: () => {
                // 方法接收 目标路由 作为参数
                // return 重定向的 字符串路径/路径对象
                if (invoiceHandler.isPC()){ 
                    return {
                        path: '/check/pc'
                    }
                }
                return {
                    path: '/check/app'
                }
            }
        },
        {
            path: '/checkPC',
            component: resolve => require(['modules/invoiceManage/views/checkInvoiceManagement/index/indexInput.vue'], resolve),
            name: '',
            meta: {
                needAnimation: true,
                requiresAuth: false,
                title: '发票查验',
                pageType: 'entry'
            }
        },
        {
            path: '/check/pc',
            component: resolve => require(['modules/invoiceManage/views/checkInvoiceManagement/index/indexInput.vue'], resolve),
            name: '',
            meta: {
                needAnimation: true,
                requiresAuth: false,
                title: '发票查验',
                pageType: 'entry'
            }
        },
        {
            path: '/check',
            component: resolve => require(['modules/invoiceManage/views/checkInvoiceManagement/index/indexPhone.vue'], resolve),
            name: '',
            meta: {
                needAnimation: true,
                requiresAuth: false,
                title: '发票查验',
                pageType: 'entry'
            }
        },
        {
            path: '/check/app',
            component: resolve => require(['modules/invoiceManage/views/checkInvoiceManagement/index/indexPhone.vue'], resolve),
            name: '',
            meta: {
                needAnimation: true,
                requiresAuth: false,
                title: '发票查验',
                pageType: 'entry'
            }
        },
        {
            path: '/detail',
            component: resolve => require(['modules/invoiceManage/views/InvoiceDetailIndex/InvoiceDetailIndex.vue'], resolve),
            name: '',
            meta: {
                needAnimation: true,
                requiresAuth: false,
                title: '报销凭证'
            }
        },
        {
            path: '/check/result',
            component: resolve => require(['modules/invoiceManage/views/checkInvoiceManagement/checkResult/checkResult.vue'], resolve),
            name: '',
            meta: {
                needAnimation: true,
                requiresAuth: false,
                title: '查验结果'
            }
        },
        {
            path: '/check/record',
            component: resolve => require(['modules/invoiceManage/views/checkInvoiceManagement/checlRecord/checkRecordList.vue'], resolve),
            name: '',
            meta: {
                needAnimation: true,
                requiresAuth: false,
                title: '查验记录'
            }
        },
        {
            path: '/mine',
            component: resolve => require(['modules/invoiceManage/views/myInvoice/myInvoice.vue'], resolve),
            name: '',
            meta: {
                needAnimation: false,
                requiresAuth: false,
                title: '我的发票'
            }
        },
        {
            path: '/rule',
            component: resolve => require(['modules/invoiceManage/views/invoiceManage/invoiceRules.vue'], resolve),
            name: '',
            meta: {
                needAnimation: false,
                requiresAuth: false,
                title: '开票规则'
            }
        },
        {
            path: '/index',
            component: resolve => require(['modules/invoiceManage/views/invoiceManage/invoicing.vue'], resolve),
            name: '',
            meta: {
                needAnimation: false,
                requiresAuth: false,
                title: '报销凭证'
            }
        },
        {
            path: '/choose',
            component: resolve => require(['modules/invoiceManage/views/invoiceManage/chooseOrder.vue'], resolve),
            name: '',
            meta: {
                needAnimation: false,
                requiresAuth: false,
                title: ''
            }
        },
        {
            path: '/his',
            component: resolve => require(['modules/invoiceManage/views/invoiceHistory/invoiceHistory.vue'], resolve),
            name: '',
            meta: {
                needAnimation: false,
                requiresAuth: false,
                title: '开票历史'
            }
        },
        {
            path: '/confirm',
            component: resolve => require(['modules/invoiceManage/views/invoiceManage/invoiceConfirm.vue'], resolve),
            name: '',
            meta: {
                needAnimation: false,
                requiresAuth: false,
                title: '开具报销凭证'
            }
        },
        {
            path: '/suc',
            component: resolve => require(['modules/invoiceManage/views/invoiceManage/invoiceTrainHotelSuc.vue'], resolve),
            name: '',
            meta: {
                needAnimation: false,
                requiresAuth: false,
                title: '结果'
            }
        },
        {
            path: '/invoiceCard',
            component: resolve => require(['modules/invoiceManage/components/invoiceCard.vue'], resolve),
            name: '',
            meta: {
                needAnimation: false,
                requiresAuth: false,
                title: '发票卡包'
            }
        },
        {
            path: '/404',
            component: resolve => require(['modules/invoiceManage/views/404.vue'], resolve),
            name: ''
        }
    ],
    scrollBehavior() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ x: 0, y: 0 })
            }, 10)
        })
    }
});
export default routers;