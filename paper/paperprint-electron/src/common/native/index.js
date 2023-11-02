const {app} = require('electron');
const path = require("path");
const NATIVENODE_PATH = app.isPackaged?'../../../../../native.node':'../../../native.node';
let nativePath = path.join(__dirname,NATIVENODE_PATH);
const nativemodule = require(nativePath);



/**
 * 加载dll
 * @returns 
 */
function loadDll(){
    nativemodule.loadDll();
}

/**
 * 打开设备
 */
function openDevice(){
    return nativemodule.openDevice()
}

/**
 * 创建窗口
 * @param {窗口句柄} buffer 
 * @param {窗口参数} option 
 * @param {是否透射} use_perspective 
 */
function createChildWindow(buffer,option,use_perspective){
    return nativemodule.createChildWindow(buffer,option,use_perspective)
}

/**
 * 关闭窗口
 * @param {窗口句柄} buffer 
 * @returns 
 */
function closeChildWindow(buffer){
   return nativemodule.closeChildWindow(buffer);
}

/**
 * 拍照
 * @param {图片路径} path 
 * @returns 
 */
function takePhoto(path){
    return nativemodule.takePhoto(path);
}

/**
 * 隐藏窗口
 * @returns 
 */
function hideChildWindow(){
    return nativemodule.hideChildWindow();
}

/**
 * 显示窗口
 * @returns 
 */
function showChildWindow(){
    return nativemodule.showChildWindow();
}

/**
 * 设置设备参数
 * @param {类型} type 
 * @param {值} value 
 * @returns 
 */
function setCameraParam(type,value){
    return nativemodule.setCameraParam(type,value)
}

/**
 * 获取设备参数
 * @param {类型} type 
 * @returns 
 */
function getCameraParam(type){
    return nativemodule.getCameraParam(type);
}

/**
 * 获取图片二维码
 * @param {路径} path 
 * @returns 
 */
function parseQrCodeImage(path){
    return nativemodule.parseQrCodeImage(path);
}

module.exports = {nativemodule,nativePath,loadDll,openDevice,createChildWindow,closeChildWindow,takePhoto,hideChildWindow,showChildWindow,
    setCameraParam,getCameraParam,parseQrCodeImage}