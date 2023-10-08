import taskLock from '@/utils/taskLock/index.js'

export default {
    data() {
        //每个组件内有自己的锁容器
        return {   
            queueLock: new taskLock.Queue(),
            onceLock: new taskLock.Once()
        }
    },    
    onShow() {   
        //页面重新展现时，初始化单次锁。单次锁只锁当前页面生命周期
        this.onceLock?.releaseAll();
    },
    methods: {
        /**
         * 一个页面生命周期内，只可请求一次。多余请求不会执行
         * @returns 
         */
        async requestOnce(opt){
            let that = this;
            let _arguments = arguments;
            return new Promise((resolve, reject) => {
                let locked = that.onceLock.exec(async function(){
                    try {
                        resolve(await opt.requestFun.apply(that, _arguments));
                    } catch (e){
                        reject(e);
                    }
                }, opt.unitKey)
                if (locked){
                    let argumentsStr = _arguments;
                    try {
                        argumentsStr = JSON.stringify(_arguments)
                    } catch (e){}
                    console.warn('multiple request. arguments: ' + (argumentsStr ?? 'null'))
                }
            })
        },

        /**
         * 排他请求，同时只能执行一个请求。被排他的请求不会执行
         * @returns 
         */
        async requestExclusive(opt){
            let that = this;
            let _arguments = arguments;
            return new Promise(async (resolve, reject) => {
                let locked = await taskLock.exclusive(async function(){
                    try {
                        resolve(await opt.requestFun.apply(that, _arguments));
                    } catch (e){
                        reject(e);
                    }
                }, opt.unitKey)
                if (locked){
                    let argumentsStr = _arguments;
                    try {
                        argumentsStr = JSON.stringify(_arguments)
                    } catch (e){}
                    console.warn('blocked request. arguments: ' + (argumentsStr ?? 'null'))
                }
            })
        },

        /**
         * 执行完一个请求后，才会开始执行下一个请求任务
         */
        async requestQueue(){
            let that = this;
            let _arguments = arguments;
            return new Promise((resolve, reject) => {
                that.queueLock.exec(()=>{
                    try {
                        resolve(that.$request.apply(that, _arguments));
                    } catch (e){
                        reject(e);
                    }
                })
            })
        }
    }
}