const {ipcMain} = require('electron');
const table = require('../common/db/table')
const {register,register_py,register_server,getRegiterPath,checkFileExist} = require('./core.js')

const ROOT_PATH = 'uvb/root';
const REGISTER_FILE_PATH = 'captured_image.jpg'
const SERVER_FILE_TYPE = 1;//注册图片类型   0：临时存储，1：永久存储
 
let use_python = false;

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
    python_server_url = params.python_server_url;
    python_static_server_url = params.python_static_url;
    use_perspective = params.use_perspective;
    is_qrcode_verify = params.is_qrcode_verify;

    //图片注册
    ipcMain.on('register', async(e,id) => {
        let result = {};
        if(use_server){
            result = await register_server(id,REGISTER_FILE_PATH,java_server_url,java_static_server_url,SERVER_FILE_TYPE,server_appid);
        }else if(use_python){
            result = await register_py(id,REGISTER_FILE_PATH,python_server_url,python_static_server_url);
        }else{
            result = await register(id,ROOT_PATH,REGISTER_FILE_PATH,use_perspective,is_qrcode_verify);
            
        }
        e.returnValue = result;
    })

    //判断图片是否存在 0表示存在 1表示不存在
    ipcMain.on('checkFileExist',async(event,id)=>{
        let ret = getRegiterPath(id,ROOT_PATH,REGISTER_FILE_PATH,use_perspective,is_qrcode_verify);
        let result = checkFileExist(ret);
        event.returnValue = result;
    })



    /**
     * 监听数据库表新增事件 register_add_record 返回新增记录后的结果
     */
    ipcMain.on('register_add_record',async(e,data)=>{
        //以labelhash为key 查询数据是否存在，如果存在，则update，如果不存在则add
        if(data.labelHash){//label hash为必填
            let result = await table.search({labelHash:data.labelHash});
            if (result.code == "0" && result.data && result.data.pageList && result.data.pageList.length > 0) {
                //返回给用户确认是否新增 todo
                let registerItem = result.data.pageList[0];
                e.returnValue = await table.update(Object.assign(data,{labelId:registerItem.labelId,labelNo:registerItem.labelNo}))

            }else{
                e.returnValue = await table.add(data);
            }
        }else{
            e.returnValue = {code:-1};
        }
        
    });

    /**
     * 监听数据库查询事件 register_search_record 返回查询结果，以分页结果返回
     */
    ipcMain.on('register_search_record',async(e,data)=>{
        e.returnValue = await table.search(data);
    });

    /**
     * 监听数据库查询事件 register_search_record 返回查询结果，以分页结果返回
     */
    ipcMain.on('register_search_record_precise',async(e,data)=>{
        e.returnValue = await table.search_precise(data);
    });

    /**
     * 监听数据库更新事件 register_update_record 返回更新结果
     */
    ipcMain.on('register_update_record',async(e,data)=>{
        e.returnValue = await table.update(data);
    });

    /**
     * 监听数据库删除事件 register_del_record 返回删除结果
     */
    ipcMain.on('register_del_record',async(e,labelId)=>{
        e.returnValue = await table.del(labelId);
    });

    /**
     * 监听数据库序列号事件，register_sequence 返回序列号
     */
    ipcMain.on('register_sequence',async(e)=>{
        e.returnValue = await table.sequence();
    });
}

module.exports = {on,getRegiterPath}