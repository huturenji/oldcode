import {callHandler} from "sino/bridge/lib/handler";
import utils from 'sino/common/utils'
import {baseAdapter} from '../base'
import constant from 'sino/constant'
export let channelIds = {
    uat: '5890,5891,5892,3163141',
    prod: '5890'
}
export let appName = '华兴企业银行'
export let adapter = Object.assign({}, baseAdapter, {
    async isLogined() {
        let res = await callHandler('GetUserStatusFunction');
        //没有这个方法，当做是已登录
        if(utils.isEmpty(res) || res.ret == constant.NO_BRIDGE_ERROR.RET){
            return {
                ret: 0,
                responseData: {
                    status: 1
                }
            }
        }
        //华兴旧包的返回值格式是{status: 1}
        if(res.status == 1){
            res = {
                ret: 0,
                responseData: {
                    status: 1
                }
            }
        }
        return res;
    },
    /**
     * 拉起app登录页面(华兴定制方法)
     * @returns 
     */
     async login(){
        try{
            if(utils.getPlatform() == constant.RUN_ENV.BIZMATE){
                let response = {};
                let msg = '';
                try{
                    response = await callHandler('RequestLoginFunction');
                }catch(e){
                    console.error('调用app登录失败' + e);
                    msg = '调用APP登录失败'
                }
                if(response.ret == constant.NO_BRIDGE_ERROR.RET){
                    msg = '您的APP版本太低，暂时无法使用该功能，请升级APP软件版本';
                }
                return {
                    state: response.ret == 0 && response.responseData.result == 1,
                    msg: msg
                };
            }
        }catch(e){
            console.error('sinosdk login error! '+e);
        }
        return {
            state: false,
        };
    },
    getToken(path, opt = {}, events = {}){
        let proceed = arguments[arguments.length-1];
       // if(utils.compareBizVersion('1.2.0') > -1){
            opt.mode = 'native';
      //  }
        //继续执行原函数
        proceed.proceedDefault(path, opt = {}, events = {});
    }
})