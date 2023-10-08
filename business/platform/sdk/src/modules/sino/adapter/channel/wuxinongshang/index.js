import {baseAdapter} from '../base'
export let channelIds = {
    uat: '6914',
    prod: '6914',
}

export let adapter = Object.assign({}, baseAdapter, {
    getToken(path, opt = {}, events = {}){
        let proceed = arguments[arguments.length-1];
       // if(utils.compareBizVersion('1.2.0') > -1){
            opt.mode = 'native';
      //  }
        //继续执行原函数
        proceed.proceedDefault(path, opt = {}, events = {});
    },
    /**
     * 用户是否已登录(老银行默认已登录)
     * @returns 
     */    
     async isLogined() {
        return {
            ret: 0,
            responseData: {
                status: 1
            }
        };
    },
})