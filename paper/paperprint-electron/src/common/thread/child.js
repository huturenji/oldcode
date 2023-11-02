const {parentPort} = require('worker_threads')


parentPort.on('message',(data)=>{
    const nativemobule = require(data.native_path);
    let result = nativemobule[data.method].apply(null,data.params);
    parentPort.postMessage(result);
});
