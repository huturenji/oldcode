import base from './base'
import extendUtils from '../utils';
import constant from '../../config';
import protocolHandler from './protocolHandler'
import store from 'store'
import Vue from 'vue';

extendUtils.WhiteList.global.push('/auth-adapter/v1/getIdToken')
const TIMESTAMP = process.env.TIMESTAMP_ENV;//时间戳
const PATH = `./thirdparty/serviceAuth/swp-serviceAuth.js?t=${TIMESTAMP}`
/**
 * 注意：这里就不要用class了，否则外部调用这里的函数时，this的指向会改变（不是当前的class了）
 */

var requestHanlder = new base();

/**
 * 通过TGC等银企通原始用户属性，获取idToken
 */
function getIdTokenByTGC() {
    return new Promise(resolve => {
        let terType = extendUtils.getUserPara('terType')
        terType = extendUtils.isEmpty(terType) || isNaN(terType) ? 0 : parseInt(terType);
        let param = {
            tgc: extendUtils.getUserPara('TGC'),
            uaId: extendUtils.getUserPara('uaId'),
            channelId: extendUtils.getUserPara('ProdId'),
            companyId: extendUtils.getUserPara('cpyId'),
            terType: extendUtils.getUserPara('terType') || terType
        }
        if(param.tgc==null || param.tgc==undefined){
            extendUtils.showToast('url上没有TGC')
            return;
        }
        if(param.uaId==null || param.uaId==undefined){
            extendUtils.showToast('url上没有uaId')
            return;
        }
        if(param.channelId==null || param.channelId==undefined){
            extendUtils.showToast('url上没有channelId')
            return;
        }
        if(param.companyId==null || param.companyId==undefined){
            extendUtils.showToast('url上没有companyId')
            return;
        }

        requestHanlder.request('/auth-adapter/v1/getIdToken', param, { notAssignUserParam: true }).then(res => {
            resolve(res.result.idToken);
        }).catch(e => {
            resolve();
            extendUtils.showConfirm(`TGC换取idToken失败(${e.resultCode})`,null,1)
            console.error(e);
        })
    })
}

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

export function authorize(config){
    return new Promise(async resolve => {
        //todo 海峡临时方案
        let channelId = await sinosdk.sino.getChannelId();
        if(['5248005','3150853','2102277','5125'].some(id=>id==channelId)){
            config.loginKcConfig = {
                clientId: 'MALLBBCG2BANK_member',
                serviceName: 'news'
            }
        }
        //todo end

        constant.AUTH_CONFIG.getIdTokenByTGC = getIdTokenByTGC;
        if(!config.identity){
            config.identity = await getRole();
        }
        sinosdk.sino.auth.getToken(PATH, Object.assign(constant.AUTH_CONFIG, config)).then(async data => {
            window.authorization = data;
            //记录用户进入了系统
            protocolHandler.logUserEntered();
            store.commit('setRole', config.identity)
            if(config.enableAgreement//配置了提示协议
                && config.identity == constant.ROLE.USER//必须是user
                && !window.protocol//未弹出过
                && data && data.getToken()){//有token
                await protocolHandler.getProtocol()
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