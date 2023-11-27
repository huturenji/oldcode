const fse = require('fs-extra')
const http = require('./http.js')
const moment = require('moment')
/**
 * 将文件上传到python服务器中 返回文件的fileId
 * @param {string} server_url 文件服务路径
 * @param {string} file_path 文件路径
 */
async function upload_py(server_url,file_path){
    const options = {
        method:'POST',
        url:`${server_url}formUpload`,
        headers: {
            'Content-Type': 'multipart/form-data'
          },
        formData:{
            file:fse.createReadStream(file_path)
        }
    }
    let result = await http.Request(options);
    return result?.data?.fileId;
}


/**
 * 将文件上传到java服务器中 返回文件的fileId
 * @param {string} server_url 文件服务路径
 * @param {string} file_path 文件路径
 * @param {string} type 文件存储类型，0：临时存储，1：永久存储  一般0用来表示注册  1用来表示核验
 * @param {string} appId 接入应用的appId 默认为10000
 */

async function upload(server_url,file_path,type,appId=10000){
    try {
        const options = {
            method:'POST',
            url:`${server_url}fileUpload`,
            headers: {
                'Content-Type': 'multipart/form-data'
              },
            formData:{
                file:fse.createReadStream(file_path),
                type:type,
                appId:appId
            }
        }
        let result = await http.Request(options);
        return result?.result?.filePath;
    } catch (error) {
        console.error(error)
        return null;
    }
}

/**
 * 根据规则将文件重命名
 * @param {原文件路径} file_path 
 * @param {规则} rule 
 * 规则是object对象，包括如下参数
 * 二维码索引：二维码唯一id 编号为6位数字，从0开始，最大999999，不足6位左补零
 * 设备编号：4位数字 从0开始，最大9999，不足4位左补零  AH100
 * 拍摄时间：当前时间 14位时间到毫秒 格式为YYYYMMDDHHMMSS
 * 纸纹所在原图位置信息：1位数字
 * 图片颜色信息：1位数字
 * 场景编号：4位数字 从0开始，最大9999，不足4位左补零，该数据从服务端配置读取
 * 环境光强：5位数字 从0开始，最大99999，不足5位左补零
 * 被摄物的旋转角度: 1位数 逆时针 0-0° 1-45° 2-90° 3/4/5/6/7往上递增45°
 * 拍摄环境:  注册图用J0、核验图用J2
 */
function rename(file_path,rule){
    const now = moment();
    let time = now.format('YYYYMMDDHHmmss')
    let arr = [
        leftPadding(rule.qrcode,6),
        leftPadding(rule.deviceIndex,4),
        time,
        rule.location,
        rule.rgb,
        leftPadding(rule.scene,4),
        leftPadding(rule.light,5),
        rule.rotation,
        rule.env
    ];
    let name = arr.join('_');
    try {
        //将file_path 重命名
        fse.renameSync(file_path,name);
        return name;
    } catch (error) {
        return null
    }
}
/**
 * 数据左补充
 * @param {Nubmer} num 原数据
 * @param {Nubmer} length 最大长度
 * @param {string} padding 补充数据 默认为‘0’ 
 * @returns 
 */
function leftPadding(num,length,padding='0'){
    if(num>Number('9'.repeat(length))){
        return num;
    }else{
        return (padding.repeat(length)+num).slice(-length)
    }
    
}

module.exports = {upload_py,upload,rename}