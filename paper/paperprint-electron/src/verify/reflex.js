const MAX_TURE_VALUE = 0.4;
const {Request} = require('../common/utils/http.js')
const file = require('../common/utils/file.js')
const crypto = require("crypto");
const thread = require('../common/thread/index')
/**
 * 反射纸纹核验算法
 * @param {注册图路径} register_path 
 * @param {核验图路径} file_path 
 * @param {核验参数} verifyOption 
 */
async function reflex(register_path,file_path,verifyOption){
    let res = await verify_reflex_core(register_path,file_path,verifyOption);
    if(res.retCode==0){
        let arr = [res.result_1_1,res.result_2_2,res.result_3_3,res.result_4_4];
        result = cal(arr,MAX_TURE_VALUE);//0表示纸纹相符，1表示纸纹不相符
        return {
            code:0,
            data:{result:result}
        }
    }else{
        return {
            code:res.retCode
        }
    }
}

/**
 * 透射纸纹核验方法
 * @param {*} root_path 
 * @param {*} file_path 
 * @param {*} id 
 */
async function verify_reflex_core(register_path,file_path,verifyOption){
    return thread.call('verify_reflex',[register_path,file_path,verifyOption]);
}

/**
 * 判断数组中去除最小值后，平均值是否大于max_value
 * @param {Array} orginArr 原始数组
 * @param {*} max_value 最大值
 */
 function cal(orginArr,max_value){
    let arr = [...orginArr];
    let min = Math.min(...arr);
    for(let i=0;i<arr.length;i++){
        if(orginArr[i]==min){
            arr.splice(i,1);
        }
    }
    return arr.reduce((a,b)=>a+b,0)/arr.length >= max_value ? 0:1;
}


/**
 * 图片核验
 * @param {核验图匹配根路径} root_path 
 * @param {核验图路径} file_path 
 * @returns 
 */
async function verify_py(id,file_path,server_url,static_server_url){
    let result = {};
    let fileId = await file.upload(file_path);
    if(fileId){
        const options = {
            method:'POST',
            url:`${server_url}verify`,
            headers: {
                'Content-Type': 'application/json'
              },
            json: true,
            body:{
                fileId:fileId
            }
        }
        let data = await Request(options);
        if(0==data.code){//核验程序成功
            let labelHash = crypto.createHash('md5').update(id?id:fileId).digest('hex');
            let detailUrl = `${static_server_url}/paperprint/pages/index.html#/report?registId=${data.data.qrCodeHash}&verifyId=${fileId}`;
            result = {
                code:data.code,
                data:{labelHash,result:data.data.status,detailUrl:detailUrl},
                message:data.message
            }
        }else{
            result = {
                code: data.code,
                message:'verify failed, verify_server failed'
            }
        }
        
    }else{
        result = {
            code: -1,
            message:'verify failed, upload failed'
        }
    }
    return result;
}


module.exports = {reflex,verify_py}