const http = require('../common/utils/http.js')
const file = require('../common/utils/file.js')
const {parseImgCode} = require('../common/utils/image')
const crypto = require("crypto");
const fse = require('fs-extra');


/**
 * 图片注册
 * @param {注册图存储根路径} root_path 
 * @param {注册图路径} file_path 
 * @param {注册图id} file_id 
 * @returns 
 */
async function register(id,root_path,file_path,use_perspective,is_qrcode_verify){
    let result = {};
    //1、识别二维码  没有二维码 报错-2 返回
    //2、获得二维码hash
    //3、判断id是否存在，存在则使用id，否则使用hash
    let ret = getRegiterPath(id,root_path,file_path,use_perspective,is_qrcode_verify);
    if(ret.code==0){
        try {  
            fse.copySync(file_path,ret.filePath);//复制文件，如果目录不存在则创建目录
            result = {
                code : 0,
                data : {labelHash:ret.labelHash,registerImg:ret.filePath},
                message : 'register success'
            }
            
        } catch (error) {
            result = {
                code: -1,
                message:'register failed, copyfile failed'
            }
        }
    }else{
        result = ret;
    }
    return result;
   
}


/**
 * 获取图片注册的路径
 * @param {注册图存储根路径} root_path 
 * @param {注册图路径} file_path 
 * @param {注册图id} file_id 
 * @returns 
 */
function getRegiterPath(id,root_path,file_path,use_perspective,is_qrcode_verify){
    if(!use_perspective&&is_qrcode_verify){//不是透射并且使用Qrcode 则用Qrcode hash值作为图片的索引值
        let ret = parseImgCode(file_path);
        if(ret.code!=0){
            result = {
                code: -2,
                message:'image parse qrcode failed'
            }
        }else{
            let labelHash = id?id:ret.data.labelHash;
            result = {
                code:0,
                labelHash:labelHash,
                filePath:`${root_path}/${labelHash}/register_${labelHash}.jpg`
            }
        }
    }else{//不使用Qrcode 则使用id hash值作为图片的索引值
        if(id){
            let labelHash = crypto.createHash('md5').update(id).digest('hex');
            result = {
                code:0,
                labelHash:id,
                filePath:`${root_path}/${id}/register_${id}.jpg`
            }
        }else{
            result = {
                code:-2,
                message:'id must be not empty'
            }
        }
    }
    return result;
}


//调用python对比图片
/**
 * compare.exe 接受5个参数
 * --root_path 注册图与核验图存放的根路径 默认为 uvb/root
 * --register_file_path 注册图存放的临时路径，调用注册图注册函数后会将注册图移植到注册图存放的根路径下，路径为 root_path/注册图二维码hash值/注册图id.png 例如 uvb/root/register/27c81d91523b1fa9dd2075a0fa17151e/1.jpg
 * --register_file_id 注册图id
 * --verify_file_path 核验图存放临时路径，核验完成后会将该路径下文件删除
 * --type 值为register执行注册流程 值为verify执行核验流程
 */
/**
 * 图片注册
 * @param {注册图路径} file_path 
 * @param {注册图id} file_id 
 * @param {注册服务地址} server_url 
 * @returns 
 */
async function register_py(id,file_path,server_url,static_server_url){
    let result = {};
    let fileId = await file.upload(server_url,file_path);
    if(fileId){
        const options = {
            method:'POST',
            url:`${server_url}regist`,
            headers: {
                'Content-Type': 'application/json'
              },
            json: true,
            body:{
                fileId:fileId
            }
        }
        let data = await http.Request(options);
        if(0==data.code){
            let labelHash = crypto.createHash('md5').update(id?id:fileId).digest('hex');
            result = {
                code:data.code,
                data:{labelHash,registerImg:`${static_server_url}${data.data.filePath}`},
                message:data.message
            }
        }else{
            result = {
                code: data.code,
                message:'register failed, register_server failed'
            }
        }
        
    }else{
        result = {
            code: -1,
            message:'register failed, upload failed'
        }
    }
    return result;
}

/**
 * 判断文件是否存在
 * @param {文件路径} path 
 * @returns 
 */
function checkFileExist(ret){
    let result = {code:-1};
    try {
        if(ret.code==0){
            if(fse.existsSync(ret.filePath)){//文件存在
                result = {
                    code : 0,
                    message : 'register file exist'
                }
            }
        }
    } catch (error) {
        result = {code:-1};
    }
    return result;
}


module.exports = {register,register_py,checkFileExist,getRegiterPath}


