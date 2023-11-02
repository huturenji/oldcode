/**
 * nativeHandler，与app主进程交互相关的业务处理均在这里进行
 */
class nativeHandler {
    constructor() {
        this.AFTERSTR = 'Reply';
        this.nativeEnum = {
        }
    }
    //主进程通信方法
    communication(api,data=undefined){
        return new Promise((reslove,reject)=>{
            try {
                let channel = `${api}${this.AFTERSTR}`;
                ipcRenderer && ipcRenderer.removeAllListeners(channel);
                ipcRenderer && ipcRenderer.on(channel, (event, res) => {
                    this.log(`${channel}: ${typeof res =='object'?JSON.stringify(res):res}`)
                    reslove(res);
                });
                ipcRenderer && ipcRenderer.send(api,data);
            } catch (error) {
                reject(`${api} nativeCommunication fail${error}`)
            }
        })
    }
    /**
     * 代理log
     */
    log(logstr){
        console.log(logstr)
        ipcRenderer && ipcRenderer.send('proxyLogger', logstr)
    }
}

export default new nativeHandler();