/**
 * vue组件
 */
import extendUtils from 'utils';
import defaultConfig from './config';
import AuthHandler from './authHandler'
import constant from 'constant';

export async function install(config) {
    //加载keycloak.js
    await import('components/keycloak.sino.js')
    config = extendUtils.deepClone(extendUtils.extend(true, defaultConfig, config))

    //当前页面的路由
    let index = location.hash.indexOf('?')
    let path = location.hash.substring(1,  index>-1 ? index : location.hash.length);
    const authHandler = new AuthHandler(config);
    //如果授权流程未开启，或页面在白名单中，则不走授权流程，直接完成
    if(!!config.enableAuthorize && config.urlWhiteList.every(url=>{return !path.startsWith(url)})){
        //初始化登陆授权流程
        await authHandler.init();
        await authHandler.getUserToken();
    }

    return {
        //获取用户token
        getToken(){
            try{
                let token = authHandler.getCacheToken();
                return token;
            }catch(e){
                return null;
            }
        },
        //返回T信的用户信息
        getTchatUserInfo(){
            return Object.assign({}, authHandler.tchatUserInfo, {prodId: extendUtils.getNonnullValue(authHandler.channelId)});
        },
        //返回keycloak的用户信息
        getUserInfo(){
            return authHandler.getUserInfo();
        },
        getRole(){
            return constant.IDENTITY.USER;
        },
        isGuest(){
            return false
        },
        logout(){
            authHandler.logout()
        },
        decodeToken(token){
            return extendUtils.decodeToken(token);
        }
    }

}
