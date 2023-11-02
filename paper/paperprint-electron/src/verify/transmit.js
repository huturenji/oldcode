const thread = require('../common/thread/index')
/**
 * 透射纸纹核验方法
 * @param {*} root_path 
 * @param {*} file_path 
 * @param {*} id 
 */
async function transmit(register_path,file_path){
     let result = await thread.call('verify_transmit',[register_path,file_path]);
     return result;
}

module.exports = {transmit}