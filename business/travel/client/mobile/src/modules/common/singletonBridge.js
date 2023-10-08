/**
 * 用于一个页面多次注册同一个jsbridge事件。
 * 同时注册多个时，会按先进后出的顺序执行回调
 */
export default class Singleton{
    constructor(){
        this.cbStack = []
    }
    
    register(jsBridgeFunc, callback){
        let that = this;
        this.cbStack.push(callback);
        jsBridgeFunc(data=>{
            let length = that.cbStack.length;
            for (let i=length-1; i>=0; i--){
                let cb = that.cbStack[i]
                cb && cb(data)
            }
        });
    }
}