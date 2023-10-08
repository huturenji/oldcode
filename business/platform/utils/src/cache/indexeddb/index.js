/*
 * @Author: your name
 * @Date: 2020-12-09 14:55:43
 * @LastEditTime: 2021-01-06 16:41:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \utils\src\cache\indexeddb\core.js
 */
var db = (function(){
    const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;//indexedDB对象  
    class dbClass{
        constructor(props){
            this.storeAll = {};//存储数据库中所有表的配置，key为storeName，value为storeParam
            if(!!props){
                this.name = props.name; //数据库名称
                this.version = props.version;//数据库版本号，默认为1
                this.storeParam = props.storeParam//数据库表相关配置对象，主要包括表名、索引等,存储数据库最后一个表的配置
            }
            this.db = null;
            this.init(props);
        }
        /**
         * 初始化数据库
         * @param {string} name 数据库名称
         * @param {int} version 数据库版本号
         * @param {object} storeParam 数据库表相关配置对象，主要包括表名、索引等
         * //可以通过init方法修改db的相关配置
         */
        async init(props={}){
            if(!!props){//外部单独调用该函数时，修改db的配置
                props.name&&(this.name = props.name); //数据库名称   todo 数据库名称如果相同，版本号则自动加1
                props.version&&(this.version = props.version);//数据库版本号，默认为1
                props.storeParam&&(this.storeParam = props.storeParam)//数据库表相关配置对象，主要包括表名、索引等
                
            }
            let name = this.name;
            let version = this.version || 1;
            let storeParam = this.storeParam || {};//应该为数组，如果是对象，则直接转为数组
            if(!indexedDB){
                throw('the broswer is not support indexedDB')
            }
            if(null==name||undefined==name||''==name){//初始化时，必须填写数据库名称
                throw('the indexedDB need a name, like {name:"example-name"}')
            }
            if(1>version){
                throw('the indexedDB version must be Integers greater than 1')
            }
            if(null==storeParam.name||undefined==storeParam.name||''==storeParam.name){//初始化时，必须填写数据库表名称
                throw('the indexedDB need a store name,like {storeParam:{name:"example-name"}}')
            }
            !this.storeAll[storeParam.name] && (this.storeAll[storeParam.name] = storeParam);//数据库表相关配置，存储数据库所有表相关配置
            const request  = indexedDB.open(name,version);
            return new Promise((res,rej)=>{
                request.onsuccess = e => {
                    let db = e.target.result;
                    this.db = db;
                    // this.updateStore(storeParam,this.db);
                    db.onversionchange = function(){
                        db.close();//如果onversionchange触发时，不关闭数据库，则谁使得删除数据库与新增数据库表blocked
                        console.info('db is outdated,please reload the page')
                    }
                    res(db);
                }
                request.onupgradeneeded = e => {
                    this.db = e.target.result;
                    this.updateStore(storeParam,this.db);
                    res(e.target.result);
                }
                request.onblocked = e => {
                    console.error('the db is onblocked')
                }
                request.onerror = e => {
                    console.error('open indexeddb `${name}` fail')
                    rej(e)
                }
            });
        }
        /**
         * 更新表
         * @param {string} db 
         * @param {object} storeParam 
         */
        updateStore(storeParam,db=this.db){
            if(null==storeParam.name||undefined==storeParam.name||''==storeParam.name){//初始化时，必须填写数据库表名称
                throw('the updateStore function need a store name,like {name:"example-name"}')
            }
            if(!db.objectStoreNames.contains(storeParam.name)){
                //设置表名storeParam.name，设置表的主键storeParam.key
                let objectStore = null;
                if(storeParam.key){//如果设置了表的主键，则用参数中的主键值，否则主键默认为1
                    //in-line keys 的object store ，要求所有存储的数据中都要含有storeParam.key字段，并且以此创建索引，方便后续通过此字段进行查找,推荐使用此种方式
                    objectStore = db.createObjectStore(storeParam.name,{keyPath:storeParam.key});
                }else{
                    //out-of-line keys 的object store，在改模式下，add()与put()方法中的value不能为单参数"{}"对象形式，而是add(值,键)/put(值,键)的形式
                    objectStore = db.createObjectStore(storeParam.name,{autoIncrement: true});//
                }
                 
                //设置索引storeParam.index 其中索引的三个参数表示索引名称、索引所在的属性、配置对象（说明该属性是否包含重复的值）
                if(storeParam.index&&0<storeParam.index.length){
                    storeParam.index.forEach((e)=>{
                        objectStore.createIndex(e.name,e.props,e.deploy);
                    }) 
                }
                  
            }else{
                //todo something
            }
        }
        /**
         * 打开数据库，供内部方法
         */
        async open(){
            if(this.db){
                return await this.db;
            }else{
                return await this.init();
            }
        }
        /**
         * 新增数据
         * @param {string} key 数据键
         * @param {object} value 数据值
         * @param {string} storeName 表名
         * @param {string} mode 新增数据模式 默认为readwrite
         */
        async add(key,value,storeName=this.storeParam.name,mode='readwrite'){//获取表名，如果不传递，则默认为设置的最后一个表名
            let db = await this.open();//打开数据库
            let objectStore = db.transaction([storeName],mode).objectStore(storeName);
            let request = null;
            if(this.storeAll[storeName].key){
                request = objectStore.add({key:value});//新增数据
            }else{
                request = objectStore.add(value,key);//新增数据
            }
            
            return new Promise((res,rej)=>{
                request.onsuccess = e =>{
                    res(e)
                };
                request.onerror = e =>{
                    rej(e)
                }
            });
        }
        /**
         * 更新数据
         * @param {string} key 数据键
         * @param {object} value 数据值
         * @param {string} storeName 表名
         * @param {string} mode 新增数据模式 默认为readwrite
         */
        async update(key,value,storeName=this.storeParam.name,mode='readwrite'){//获取表名，如果不传递，则默认为设置的最后一个表名
            let db = await this.open();//打开数据库
            let request = null;
            let objectStore = db.transaction([storeName],mode).objectStore(storeName);
            if(this.storeAll[storeName].key){
                request = objectStore.put({key,value});//更新数据，如果数据不存在则新增
            }else{
                request = objectStore.put(value,key);//更新数据，如果数据不存在则新增
            }
    
            return new Promise((res,rej)=>{
                request.onsuccess = e =>{
                    res(e)
                };
                request.onerror = e =>{
                    rej(e)
                }
            });
        }
        /**
         * 读取数据
         * @param {string} storeName 表名
         * @param {number data string binary array} key 主键key,如果表设置了主键则传递主键值，否则可以传递记录的key来获取
         */
        async read(key,storeName=this.storeParam.name){//获取表名，如果不传递，则默认为设置的最后一个表名
            let db = await this.open();//打开数据库
            let request = db.transaction([storeName]).objectStore(storeName)
                            .get(key);
            return new Promise((res,rej)=>{
                request.onsuccess = e =>{
                    res(e.target.result)
                };
                request.onerror = e =>{
                    rej(e)
                }
            });
        }
        /**
         * 读取表中所有数据
         * @param {string} storeName 表名
         */
        async readAll(storeName=this.storeParam.name){ //获取表名，如果不传递，则默认为设置的最后一个表名
            let db = await this.open();//打开数据库
            let recordList = [];
            let request = db.transaction([storeName]).objectStore(storeName).openCursor();
            return new Promise((res,rej)=>{
                request.onsuccess = e =>{
                    let cursor = e.target.result;
                    if(cursor){
                        recordList.push(cursor.value);
                        cursor.continue();
                    }else{
                        res(recordList)
                    }
                    
                };
                request.onerror = e =>{
                    rej(e)
                }
            });
        }
        /**
         * 根据主键删除数据
         * @param {string} storeName 表名
         * @param {number data string binary array} key 主键key
         * @param {string} mode  模式 默认为readwrite
         */
        async remove(key,storeName=this.storeParam.name,mode='readwrite'){
            let db = await this.open();//打开数据库
            let request = db.transaction([storeName],mode).objectStore(storeName)
                            .delete(key);//删除记录
            return new Promise((res,rej)=>{
                request.onsuccess = e =>{
                    res(e)
                };
                request.onerror = e =>{
                    rej(e)
                }
            });
        }
        /**
         * 清空表
         * @param {string} storeName 表名
         * @param {string} mode 模式
         */
        async clear(storeName=this.storeParam.name,mode='readwrite'){
            let db = await this.open();//打开数据库
            let request = db.transaction([storeName],mode).objectStore(storeName)
                            .clear();//清空记录
            return new Promise((res,rej)=>{
                request.onsuccess = e =>{
                    res(e)
                };
                request.onerror = e =>{
                    rej(e)
                }
            });
        }
        /**
         * 关闭数据库
         */
        close(){
            this.db&&this.db.close();
        }
        /**
         * 删除数据库，改操作不可恢复，请谨慎使用
         * @param {string} name 数据库名
         */
        delete(name=this.name){
            indexedDB.deleteDatabase(name);
        }
    }
    return dbClass;
})();
 
export const dbfactory = db;