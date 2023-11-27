const {ipcMain} = require('electron');
const crypto = require("crypto");
const nativemodule = require('../native')

let use_perspective = true;
let winBuffer = null;
function on(params){
    winBuffer = params.winBuffer;
    use_perspective = params.use_perspective;
    resolution = params.resolution;
    light_ids = params.light_ids;
    light_brights = params.light_brights;
    //打开设备
    ipcMain.on('openDevice', (event, someArgument) => {
        let res = nativemodule.openDevice();
        event.returnValue = res;
    });
    //初始化dll
    ipcMain.on('createNativeWindow', async(event, position) => {
        /**
         * 创建子窗口
         * 第一个参数为窗口句柄 类型为buffer
         * 第二个参数为窗口位置 类型为数组
         * 第三个参数为是否需要取景框 类型为Boolean 默认为需要 透射算法不需要取景框
         */
        let res = nativemodule.createChildWindow(winBuffer,position,light_ids,light_brights,!use_perspective);  
        // let windowHanlder = win.getNativeWindowHandle();
        // let res = await createChildWindow(windowHanlder,position,use_perspective);//todo 通过子线程调用会导致页面卡死 创建窗口是不是只能在主线程调用？
        event.returnValue = res;
        if((res==0) && resolution){//设置摄像头分辨率
            nativemodule.setCameraParam('resolution',resolution);
        }
    });
    //关闭dll
    ipcMain.on('closeNativeWindow', (event, someArgument) => {
        let res = nativemodule.closeChildWindow(winBuffer);
        event.returnValue = res;
    });
    //拍照
    ipcMain.on('takePhoto', async(event, path=VERIFY_FILE_PATH) => {
        let res = nativemodule.takePhoto(path);
        event.returnValue = res;
    });
    //隐藏预览窗口
    ipcMain.on('hideChildWindow', (event, someArgument) => {
        let res = nativemodule.hideChildWindow();
        event.returnValue = res;
    });
    //隐藏显示窗口
    ipcMain.on('showChildWindow', (event, someArgument) => {
        let res = nativemodule.showChildWindow();
        event.returnValue = res;
        
    });
    //设置摄像头参数
    ipcMain.on('setCameraOption', (event, param) => {
        let ret = nativemodule.setCameraParam(param.type,param.value);
        event.returnValue = ret;
    });
    //获取摄像头参数
    ipcMain.on('getCameraOption', (event,type) => {
        let ret = nativemodule.getCameraParam(type);
        ret.code==0 && (ret.data.type = type);
        event.returnValue = ret;
    });
    //识别图片中的二维码
    ipcMain.on('parseQrCodeImage', (event, path) => {
        let ret = nativemodule.parseQrCodeImage(path);
        if(ret.code==0){
            ret.data.labelHash = crypto.createHash('md5').update(ret.data.content).digest('hex');
        }
        event.returnValue = ret;
    }); 
    //QR拍照
    ipcMain.on('takeQRPhoto', (event, path) => {
        let res = nativemodule.takePhoto(path);
        event.returnValue = res;
    }); 
}

module.exports = {on}