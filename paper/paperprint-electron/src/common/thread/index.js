const { isMainThread ,Worker,parentPort  } = require("worker_threads");
const workThread = new Worker(__dirname + "/child.js");
const {nativePath} = require('../native')
let timer = null;
/**
 * 多线程调用方法
 * @param {*} method 
 * @param {*} params 
 * @returns 
 */
async function call(method,params){
    return new Promise((res)=>{
        if(isMainThread){
            const timeout = 30000;//图片核验最长时间为30s，如果30s还没有返回结果，则任务核验dll程序没有返回数据，核验程序直接返回null
            workThread.on("message", (result) => {
               timer&&clearTimeout(timer)
               res(result);
            });
            workThread.postMessage({//不支持传递函数，故将路径传递给子线程
                method:method,
                native_path:nativePath,
                params:params
            });
            timer = setTimeout(() => {
                workThread.terminate();
                timer&&clearTimeout(timer)
                res(null);
            }, timeout);
        }else{
            parentPort.postMessage("work is done");
        }
    });
}

module.exports = {call}