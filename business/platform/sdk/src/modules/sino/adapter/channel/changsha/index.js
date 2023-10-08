import {baseAdapter} from '../base'
export let channelIds = {
    dev: '5252869',
    sit: '3155717',
    uat: '6301445,2107141',
    prod: '9989',
}
export let appName = '企业e钱庄'
export let adapter = Object.assign({}, baseAdapter, {
    getToken(path, opt = {}, events = {}){
        let proceed = arguments[arguments.length-1];
       // if(utils.compareBizVersion('1.2.0') > -1){
            opt.mode = 'native';
      //  }
        //继续执行原函数
        proceed.proceedDefault(path, opt = {}, events = {});
    },
    
    async readClipboard(){
        // let proceed = arguments[arguments.length-1];
        // //1.7.29版本以下的安卓，不提供该方法（安卓有bug，有概率闪退）
        // if(utils.getNavigatorType() == constant.NAVIGATOR_TYPE.ANDROID && utils.compareBizVersion('1.7.29') < 1){
            return {responseData: {content: null}};
        // }
        // proceed.proceedDefault();
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