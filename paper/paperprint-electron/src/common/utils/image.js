const {nativemodule} = require('../native')
/**
 * 识别图片中二维码，返回二维码内容
 * @param {string} path 图片路径
 */
function parseImgCode(path){
    let ret = nativemodule.parseQrCodeImage(path);
    if(ret.code==0){
        ret.data.labelHash = crypto.createHash('md5').update(ret.data.content).digest('hex');
    }
    return ret;
}

/**
 * 获取图片所占比例
 * @param {路径} path 
 * @returns 
 */
function getAreaRadio(path){
    return nativemodule.getAreaRadio(path);
}

/**
 * 判断图片内容所占背景图比例超过radio
 * @param {*} path 
 * @param {*} radio 
 * @returns 
 */
function checkAreaRadio(pathArray,radio){
    if(radio==0){//配置为0 则不进行背景比例计算
        return true;
    }
    for (let index = 0; index < pathArray.length; index++) {
        let result = getAreaRadio(pathArray[index]);
        if(result.code!=0||result.data.radio<=radio){
            return false;
        }
    }
    return true;
}
module.exports = {parseImgCode,getAreaRadio,checkAreaRadio}