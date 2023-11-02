const {app} = require('electron');
const {connectdb} = require('./database');
const path = require('path')
const REGISTER_PATH = app.isPackaged?'../../../register.db':'\\register.db'
const dbpath = path.join(__dirname,REGISTER_PATH)

/**
 * 创建register表
 * @returns 创建是否成功
 */
async function create(){
    const db = await connectdb(dbpath);
    const sql = `create table if not exists register(
        labelId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        labelNo varchar(1000),
        labelHash varchar(1000),
        labelName varchar(100),
        registerImg varchar(1000),
        registerUserId varchar(100),
        registerUserName varchar(32),
        registerTime TIMESTAMP DEFAULT(datetime(CURRENT_TIMESTAMP,'localtime'))
    )`
    let result = null;
    try {
        const res = await db.run(sql);
        await db.run('PRAGMA encoding = "UTF-8";');//设置字符集
        result = {
            code:0,
            data:res
        }
    } catch (error) {
        result = {
            code:-1,
            data:error
        }
    } finally{
        await db.close();
    }
    return result;
}

/**
 * 添加数据
 * @param {object} data 数据
 * @returns 
 */
async function add(data={}){
    const db = await connectdb(dbpath);
    const sql = `insert into register(labelNo,labelName,labelHash,registerImg,registerUserId,registerUserName)values (?,?,?,?,?,?)`;
    let result = null;
    try {
        const res = await db.run(sql,[data.labelNo,data.labelName,data.labelHash,data.registerImg,data.registerUserId,data.registerUserName]);
        result = {
            code:0,
            data:res
        }
    } catch (error) {
        result = {
            code:-1,
            data:error
        }
    } finally{
        await db.close();
    }
    return result;
}

/**
 * 更新数据
 * @param {object} data 数据
 * @returns 
 */
async function update(data={}){
    const db = await connectdb(dbpath);
    const sql = `update register set labelNo=?,labelName=?,labelHash=?,registerImg=?,registerUserId=?,registerUserName=? where labelId=?`;
    let result = null;
    try {
        const res = await db.run(sql,[data.labelNo,data.labelName,data.labelHash,data.registerImg,data.registerUserId,data.registerUserName,data.labelId]);
        result = {
            code:0,
            data:res
        }
    } catch (error) {
        result = {
            code:-1,
            data:error
        }
    } finally{
        await db.close();
    }
    return result;
}

/**
 * 删除数据
 * @param {int} labelId 标签id
 * @returns 
 */
async function del(labelId){
    const db = await connectdb(dbpath);
    const sql = `delete from register where labelId = ${labelId}`;
    let result = null;
    try {
        const res = await db.run(sql);
        result = {
            code:0,
            data:res
        }
    } catch (error) {
        result = {
            code:-1,
            data:error
        }
    } finally{
        await db.close();
    }
    return result;
}

/**
 * 模糊分页查询数据
 * @param {object} data 参数
 * @returns 
 */
async function search(data={}){
    const db = await connectdb(dbpath);
    data = Object.assign({pageNumber:1,pageSize:10},data);
    let sql = `select * from register where 1=1`;
    let conditon = '';
    conditon += data.startTime?` and registerTime between "${data.startTime}" and "${data.endTime}" `:'';
    conditon += data.labelName?` and labelName like "%${data.labelName}%" `:'';
    conditon += data.labelHash?` and labelHash = "${data.labelHash}" `:'';
    conditon += data.registerUserName?` and registerUserName like "%${data.registerUserName}%" `:'';
    const offset = (data.pageNumber - 1) * data.pageSize;
    const paging = `limit ${data.pageSize} offset ${offset}`;
    sql = `${sql} ${conditon} ${paging}`


    let result = null;
    try {
        let total =await db.all(`SELECT CAST((totalRecords + ${data.pageSize-1}) / ${data.pageSize} AS INTEGER )AS totalPage,totalRecords FROM (SELECT COUNT(*) AS totalRecords FROM register where 1=1 ${conditon}) AS subquery`);
        let totalPage = total[0]?.totalPage;
        let totalRecords = total[0]?.totalRecords;
        const pageList = await db.all(sql);
        result = {
            code:0,
            data:{pageSize:data.pageSize,curPage:data.pageNumber,pageList:pageList,totalPage:totalPage,totalRecords:totalRecords}
        }
    } catch (error) {
        result = {
            code:-1,
            data:error
        }
    } finally{
        await db.close();
    }
    return result;
}

/**
 * 精确分页查询数据
 * @param {object} data 参数
 * @returns 
 */
async function search_precise(data={}){
    const db = await connectdb(dbpath);
    data = Object.assign({pageNumber:1,pageSize:10},data);
    let sql = `select * from register where 1=1`;
    let conditon = '';
    conditon += data.startTime?` and registerTime = "${data.startTime}" `:'';
    conditon += data.labelName?` and labelName = "${data.labelName}" `:'';
    conditon += data.labelHash?` and labelHash = "${data.labelHash}" `:'';
    conditon += data.registerUserName?` and registerUserName = "${data.registerUserName}" `:'';
    const offset = (data.pageNumber - 1) * data.pageSize;
    const paging = `limit ${data.pageSize} offset ${offset}`;
    sql = `${sql} ${conditon} ${paging}`


    let result = null;
    try {
        let total =await db.all(`SELECT CAST((totalRecords + ${data.pageSize-1}) / ${data.pageSize} AS INTEGER )AS totalPage,totalRecords FROM (SELECT COUNT(*) AS totalRecords FROM register where 1=1 ${conditon}) AS subquery`);
        let totalPage = total[0]?.totalPage;
        let totalRecords = total[0]?.totalRecords;
        const pageList = await db.all(sql);
        result = {
            code:0,
            data:{pageSize:data.pageSize,curPage:data.pageNumber,pageList:pageList,totalPage:totalPage,totalRecords:totalRecords}
        }
    } catch (error) {
        result = {
            code:-1,
            data:error
        }
    } finally{
        await db.close();
    }
    return result;
}

/**
 * 获取序列号
 * @returns 序列号
 */
async function sequence(){
    const db = await connectdb(dbpath);
    const sql = 'select seq from sqlite_sequence where name = "register"';
    let result = null;
    try {
        let res = await db.all(sql);
        let seq = res[0]?.seq ||0;
        seq = seq<999999?('0'.repeat(6)+(seq+1)).slice(-6):seq;//获取序列号加1的值，如果该值小于6位数，则左边补零到6位
        result = {
            code:0,
            data:{seq}
        }
    } catch (error) {
        result = {
            code:-1,
            data:error
        }
    } finally{
        await db.close();
    }
    return result;
}
module.exports = {create,add,update,del,search,sequence,search_precise}