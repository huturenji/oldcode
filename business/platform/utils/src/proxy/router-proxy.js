
import { autoFixUrl, loadScript } from 'src/tools/extend';
import {getSession, setSession , getStorage} from 'src/cache/storage'
import {directionHandler} from 'src/tools/direction'
import { urlProxy } from 'src/proxy/url-proxy'

/**
 * 设置页面标题
 * @param {} title 
 */
function setTitle(title) {
    //设置title
    if (title && '' != title) {
        document.title = title;
    }
}

/**
 * 设置页面前进/后退方向
 */
function setPageDirection(to, from) {
    //TODO 两种实现，如果在这里判断backState的值，则在弹窗页面前进时，会直接前进到下一个页面，而不是关闭弹窗
    // if(!directionHandler.getBackState()){
    //     directionHandler.setBackState(true);
    //     next(false)
    //     return;
    // }

    //用储存的栈判断前进后退
    let routerQueue = JSON.parse(getSession('routerQueue'));
    if (!!routerQueue) {
        let index = -1;
        routerQueue.some((i, _index) => {
            if (i == to.fullPath) {
                index = _index;
                return true;
            }
        })
        if (index != -1) {
            if (!directionHandler.getBackState()) {
                directionHandler.setBackState(true);
                next(false)
                return;
            }
            routerQueue.splice(index + 1);
            directionHandler.back();
        } else {
            routerQueue.push(to.fullPath)
            directionHandler.forward();
        }
    } else {
        routerQueue = [];
        routerQueue.push(from.fullPath)
        routerQueue.push(to.fullPath)
        directionHandler.forward();
    }
    setSession('routerQueue', window.JSON.stringify(routerQueue));
}

/**
 * 增加动态路由组件
 * @param {*} newRoute 
 */
export function addRoutes(newRoute) {
    return {
        path: newRoute.path,
        meta: newRoute.meta,
        component: resolve => {
            loadScript({
                id: newRoute.componentConfig.libName,
                src: newRoute.componentConfig.url,
                onload: function () {
                    let obj = {};
                    obj.default = window[newRoute.componentConfig.libName].default[newRoute.componentConfig.comName];
                    obj.__esModule = window[[newRoute.componentConfig.libName]].__esModule;
                    resolve(obj);
                }
            })
        },
    };
}

/**
 * 判断是否有动态路由，如果有则加入到当前路由中
 * @param {*} router 
 * @param {*} to 
 */
function setDynamicRouter(router, to) {
    //先从缓存中读取路由列表，如果有，则与当前的比较，将缓存中多出的路由配置add到当前路由中
    let storageRoutes = getStorage('addRoutes');
    if (!!storageRoutes) {
        let oldParamIndex = location.hash.indexOf('?');
        let oldPath = location.hash.substring(location.hash.indexOf('#') + 1, oldParamIndex == -1 ? location.hash.length : oldParamIndex)
        if (oldPath == to.path) {
            storageRoutes = JSON.parse(storageRoutes);
            let tempRoutes = []
            if (storageRoutes instanceof Array) {
                storageRoutes.forEach(storRoute => {
                    tempRoutes.push(addRoutes(storRoute));
                })
            } else {
                tempRoutes.push(addRoutes(storageRoutes));
            }

            localStorage.removeItem('addRoutes')
            router.addRoutes(tempRoutes)
            router.options.routes = router.options.routes.concat(tempRoutes)
            //replace,保证浏览器回退的时候能直接返回到上个页面，不会叠加
            router.replace({
                path: urlProxy(to.path),
                query: to.query
            })
        }
    }
}

/**
 * 页面是否存在
 * @param {*} router 
 * @param {*} to 
 */
function checkPageExit(router, to) {
    //校验目标页面是否存在，否则前往404页面
    if (router.options.routes.some(route => {
        //01.判断重定向地址是否匹配
        if ('/' + route.redirect == to.path) {
            return true;
        }
        //02.如果有子路由，判断是否匹配
        let children = route.children;
        if (children && children.length > 0) {
            return route.path == to.path || children.some(child => {
                return route.path + child.path == to.path
            })
        }
        //03.判断动态路由
        let dyIndex = route.path.indexOf('/:');
        if (dyIndex > -1) {
            return to.path.indexOf(route.path.substring(0, dyIndex) + '/') > -1;
        }
        //04.判断path是否匹配
        return route.path == to.path
    })) {
        return true;
    }
    return false;
}

export function routesHandler(router, to, from, next) {
    //修复url中斜线的问题
    autoFixUrl();
    //增加动态路由
    setDynamicRouter(router, to);
    //判断页面是否存在
    if (!checkPageExit(router, to, next)){
        next('/404')
        return;
    }
    //设置页面标题
    setTitle((to.meta || {}).title);
    //设置页面方向
    setPageDirection(to, from);
    next();
}

