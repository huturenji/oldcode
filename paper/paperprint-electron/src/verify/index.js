
const {ipcMain} = require('electron');
const {getRegiterPath} = require('../register')
const {reflex,verify_py,verify_server} = require('./reflex')
const {transmit} = require('./transmit')
const {checkAreaRadio} = require('../common/utils/image')
const fse = require('fs-extra');
const ROOT_PATH = 'uvb/root';
const VERIFY_FILE_PATH = "captured_image.jpg"
const SERVER_FILE_TYPE = 0;//注册图片类型   0：临时存储，1：永久存储
/**
 * 启动监听
 * @param {*} params 
 */
function on(params){
    use_server = params.use_server;
    java_server_url = params.server_url;
    java_static_server_url = params.static_server_url;
    server_appid = params.server_appid;
    use_python = params.use_python;
    server_url = params.python_server_url;
    static_server_url = params.python_static_url;
    is_qrcode_verify = params.is_qrcode_verify;
    use_perspective = params.use_perspective;
    verifyOption = params.verifyOption;
    area_radio = params.area_radio;

    //图片核验
    ipcMain.on('verify', async(event,id) => {
        let result = {};
        if(use_server){
            result =  await verify_server(id,VERIFY_FILE_PATH,java_server_url,java_static_server_url,SERVER_FILE_TYPE,server_appid);
        }else if(use_python){
            result =  await verify_py(id,VERIFY_FILE_PATH,server_url,static_server_url);
        }else{
            result = await verify(id,ROOT_PATH,VERIFY_FILE_PATH,verifyOption,area_radio);
            
        }
        event.sender.send('verifyReply', result);
    })
}

/**
     * 图片核验  返回结果为对象
     * {
     * code:xxx核验程序结果 0表示成功 非0表示失败错误码
     * data:{result:xxx,labelHash:xxx} code为0时 result拍摄物核验结果 0表示相符 1表示不相符 。code为非0时，没有result
     * message:xxx 提示信息
     * }
     * @param {核验图匹配根路径} root_path 
     * @param {核验图路径} file_path 
     * @returns 
     */
async function verify(id,root_path=ROOT_PATH,file_path=VERIFY_FILE_PATH,verifyOption,area_radio){
    let result = {};
    let ret = getRegiterPath(id,root_path,file_path,use_perspective,is_qrcode_verify);
    if(ret.code==0){
        let labelHash = ret.labelHash;
        let register_path = ret.filePath;
        try {
            fse.accessSync(register_path, fse.constants.F_OK);
            if(use_perspective){//透射纸纹
                //核验之前判断两张图的比例是否超过设置的阈值
                let res = checkAreaRadio([register_path,file_path],area_radio);
                if(res){
                    result = await transmit(register_path,file_path);
                }else{
                    result = {
                        code:12,
                        message:'verify failed, image has not right position'
                    }
                }
               
            }else{
                result= await reflex(register_path,file_path,verifyOption);//反射纸纹
            } 
            if(result.code===0){//0表示核验成功
                result.data.labelHash = labelHash;
                result.message = 'verify success'
            }
        } catch (error) {
            result = {
                code:2,
                message:'verify failed, no register image'
            }
        }
    }else{
        result = ret;
    }
    return result;
}




module.exports = {on}