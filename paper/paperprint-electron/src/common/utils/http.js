const request = require("request");
/**
* 发送请求
* @param {Object} options 请求参数
* @returns 
*/
async function Request(options){
    return new Promise((res)=>{
        request(options,(err,response,body)=>{
            if(!err&&response.statusCode===200){
                try {
                res(JSON.parse(body));
                } catch (error) {
                    res(body)
                }
            
            }else{
                res(null);
                throw err;
            }
        });
    })
}

module.exports = {Request}