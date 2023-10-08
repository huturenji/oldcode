import extendUtils from '../utils';
import constant from '../../config';
// import protocolHandler from './protocolHandler'
import store from 'store'
import Vue from 'vue';

extendUtils.WhiteList.global.push('/auth-adapter/v1/getIdToken')
const TIMESTAMP = process.env.TIMESTAMP_ENV;//时间戳
const PATH = `./thirdparty/auth/swp-serviceAuth.js?t=${TIMESTAMP}`

async function getRole(identityOpt){
    try{
        //url如果有规则，则优先使用url上的规则
        let roleInUrl = extendUtils.getUserPara('role');
        if (extendUtils.isNotEmpty(roleInUrl)){
            return roleInUrl;
        }
        let role = store.state.role;
        if (!role || role != identityOpt){
            if (sinosdk.sino.getPlatform() == sinosdk.sino.constant.RUN_ENV.BROWSER){
                role = constant.ROLE.GUEST
            } else {
                //判断是否登陆
                let isLogined = await sinosdk.sino.isLogined();
                if (isLogined.ret ==0 && isLogined.responseData.status == 1){
                    role = constant.ROLE.USER
                } else {
                    role= constant.ROLE.GUEST
                }
            }
        }
        return role;
    }catch(e){
        console.warn('getRole error:'+e)
        return constant.ROLE.GUEST
    }
}

export function authorize(config = {}){
    return new Promise(async resolve => {
        if(!config.identity){
            config.identity = await getRole();
        }
        sinosdk.sino.auth.getToken(PATH, Object.assign(constant.AUTH_CONFIG, config)).then(async data => {
            window.authorization = data;
            //记录用户进入了系统
            // protocolHandler.logUserEntered();
            store.commit('setRole', config.identity)
            if(config.enableAgreement//配置了提示协议
                && config.identity == constant.ROLE.USER//必须是user
                && !window.protocol//未弹出过
                && data && data.getToken()){ //有token
                // await protocolHandler.getProtocol()  当期没有协议相关接口
            }
            resolve();
        })
    })
}

export async function moduleGate(func){
    try {
        extendUtils.throttle(async ()=>{
            if(store.getters.getRole == constant.ROLE.GUEST){
                //判断是否登陆
                let isLogined = await sinosdk.sino.isLogined();
                if(!(isLogined.ret ==0 && isLogined.responseData.status == 1)){
                    sinosdk.sino.login().then(async result=>{
                        if(result.state){
                            authorization.logout();//先登出guest
                            await authorize({identity: constant.ROLE.USER});//重新授权
                            if(func){
                                func(true);
                            }
                        }else{
                            extendUtils.showToast('用户未登录')
                        }
                    })
                    return;
                }
            }
            if(func){
                func(true);
            }
        }, 'moduleGate', 1000, 'moduleGate')
    } catch (e){
        console.error(e);
    }
}

Vue.prototype.$moduleGate = moduleGate;