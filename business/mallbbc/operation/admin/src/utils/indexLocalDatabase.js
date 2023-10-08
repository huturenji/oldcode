/**
 * tips:该模块用于操作浏览器IndexDB数据库,首次用于装修数据的缓存
 * author:panweijie
 * date:2023/3/20
 */

export default class IndexDbClass {
    dbName = '';// 数据库名称

    storeName = '';// 仓库名称

    dbVersion = 1;// 数据库版本(初始值为1)

    constructor(dbName, storeName) {
        if (!dbName) {
            // console.error('数据仓库名称必传')
            return;
        }
        this.dbName = dbName;
        this.storeName = storeName;

    }

    /**
     * 打开数据库
     * @returns 返回连接对象
     */
    openDb() {
        return new Promise((resolve, reject) => {
            try {
                const request = indexedDB.open(this.dbName, this.dbVersion);
                request.onsuccess = res => {
                    // console.log('数据库链接成功！', res);
                    resolve(res.target.result);

                }
                request.onerror = err => {
                    // console.log('数据库链接失败！', err);
                    reject(err)
                }
                request.onupgradeneeded = res => {
                    // console.log("数据库升级成功！");
                    const db = res.target.result;

                    if (!db.objectStoreNames.contains(this.storeName)) {
                        db.createObjectStore(this.storeName, { keyPath: 'type' })
                    }

                }
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 新增存储数据
     * @param {*} db 数据库连接对象
     * @param {*} data 数据
     * @returns 
     */
    addStoreData(db, data) {
        return new Promise((resolve, reject) => {
            const excuteResult = db.transaction([this.storeName],'readwrite').objectStore(this.storeName).add(data);

            excuteResult.onsuccess = res => {
                // console.log('新增成功');
                resolve(res)

            }

            excuteResult.onerror = error => {
                // console.log('新增失败', error);
                reject(error)

            }
        })


    }

    /**
     * 根据key获取存储数据
     * @param {*} db 数据库连接对象
     * @param {*} keyName 键名
     * @returns 查询结果
     */
    getStoreData(db, keyName) {
        return new Promise((resolve, reject) => {
            const excuteResult = db.transaction(this.storeName,'readwrite').objectStore(this.storeName).get(keyName);

            excuteResult.onsuccess = () => {
                // console.log('查询结果：', excuteResult);
                resolve(excuteResult.result)

            }

            excuteResult.onerror = (error) => {
                console.log('查询失败', error);
                reject(excuteResult.result)

            }
        })


    }

    /**
     * 修改存储的数据
     * @param {*} data 
     */
    updateStoreData(db, data) {
        return new Promise((resolve,reject)=>{
            const excuteResult = db.transaction([this.storeName], 'readwrite').objectStore(this.storeName).put(data);

            excuteResult.onsuccess = res => {
                // console.log('修改成功');
                resolve(res.target.result)
    
            }
    
            excuteResult.onerror = (error) => {
                // console.log('修改失败', error);
                reject(error)
    
            }
        })
    }
    
    /**
     * 关闭数据库链接
     * @param {*} db 连接对象
     */
    closeDb(db){
        db.close()
        // console.log('关闭数据！');
        
    }


}