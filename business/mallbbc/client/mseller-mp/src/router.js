import {RouterMount, createRouter} from 'uni-simple-router';
import { authorize } from '@/utils/auth/index';
import { isNotEmpty } from '@/utils/common.js'
import config from '@/common/lib/config'

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
    if(to.path == config.LOGIN_PATH){ // 如果要去的页面是登录页的话，此时return掉
        next()
        return
    }
    let tokenInfo = await authorize();
    isNotEmpty(tokenInfo) ? next() : next({ path: `${config.LOGIN_PATH}` });
})

// 全局路由后置守卫
router.afterEach((to, from) => {})

export {
    router,
    RouterMount
}