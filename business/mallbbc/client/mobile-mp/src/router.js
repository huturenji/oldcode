import {RouterMount, createRouter} from 'uni-simple-router';
import { authorize, setUserConsent } from '@/utils/auth/index'
import { statEvent } from "./utils/tracking.js";

const router = createRouter({
    resolveQuery:jsonQuery => {
        return jsonQuery
    },
    parseQuery:jsonQuery => {
        return jsonQuery
    },
    platform: process.env.VUE_APP_PLATFORM,  
    routes: [
        ...ROUTES //路由表
    ] 
});



//全局路由前置守卫
router.beforeEach(async (to, from, next) => {
    await authorize(); // 授权
    await setUserConsent(); // 同意协议
    next();
})

// 全局路由后置守卫
router.afterEach((to, from) => {
    let params = { behaviorType: 'pv', pageUrl: to.path, referrerPageUrl: from.path }
    if (to.query.sku) {
        params.sku = to.query.sku
        if (to.query.storeId) {
            params.storeId = to.query.storeId
        }
        if (to.path === '/views/goods/detail/index') {
            params.behaviorType = 'gpv' // 浏览商品详情
        }
    }
    statEvent(params)
})

export {
	router,
	RouterMount
}