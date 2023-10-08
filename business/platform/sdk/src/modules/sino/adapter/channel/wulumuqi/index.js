import {baseAdapter} from '../base'

export let channelIds = {
    dev: '1059077',
    sit: '3156229',
    uat: '2107653',
    prod: '10501',
}
export let appName = '雪莲企赢家'
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