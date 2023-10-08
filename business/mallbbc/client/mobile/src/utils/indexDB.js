
/**
 * @caption dataBase key 为数据表名；对象中的 key 为数据表的索引键
 * @caption 当数据表修改或者新增时，需要修改版本(version)，只能递增
 * @param 方法中的 objectStoreName 为操作的数据表名
 * @param 方法中的 userKey 为用户的唯一标识（可选），如相同sku的商品在其他company下不显示就需要带上
 * 注意：本方法不支持小程序
*/

let dbName = "mallBBC";
let version = "2";

let dataBase = {
    UserGoods: { key: 'sku' },
    DecoInfo: { key: 'DecoName' }
}

function dealUserKey(objectStoreName, data, userKey, isAdd) {
    let newData = JSON.parse(JSON.stringify(data))
    if (isAdd) {
        newData.storagePrefix = userKey
        let dataKey = data[dataBase[objectStoreName].key]
        newData[dataBase[objectStoreName].key] = userKey + dataKey
    } else {
        delete newData.storagePrefix
        let dataKey = newData[dataBase[objectStoreName].key]
        newData[dataBase[objectStoreName].key] = dataKey.slice(userKey.length)
    }

    return newData
}

class IndexDB {
    constructor() {
        this.DB = null
        this.init()
    }

    // 连接indexDB
    init() {
        /* #ifndef MP-WEIXIN */
        let that = this
        try {
            let request = window.indexedDB.open(dbName, version);
    
            request.onerror = function (error) {
                console.error(error)
            }
        
            request.onsuccess = () => {
                that.DB = request.result //可以拿到数据库对象
            }
            //如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件upgradeneeded
            request.onupgradeneeded = function (event) {
                try {
                    that.DB = event.target.result;

                    for (let key in dataBase) {
                        if (!that.DB?.objectStoreNames.contains(key)) {
                            that.DB.createObjectStore(key, { keyPath: dataBase[key].key });
                        }
                    }
                } catch (error) {

                }
            }
        } catch (error) {
            
        }
        /* #endif */
    }

    add(objectStoreName, data, userKey) {
        let compatibleFn
        /* #ifndef MP-WEIXIN */
        if (userKey) {
            data = dealUserKey(objectStoreName, data, userKey, true)
        }
        
        compatibleFn = new Promise((resolve, reject) => {
            try {
                const transaction = this.DB?.transaction([objectStoreName], 'readwrite')
                const store = transaction.objectStore(objectStoreName)
                const handle = store.add(data)
    
                handle.onsuccess = function () {
                    resolve(200);
                };
    
                handle.onerror = function (event) {
                    reject(event);
                }
            } catch (error) {
                console.error(error)
                resolve()
            }
        })
        /* #endif */

        return compatibleFn
    }

    getOne(objectStoreName, key, userKey) {
        let compatibleFn
        /* #ifndef MP-WEIXIN */
        compatibleFn = new Promise((resolve, reject) => {
            try {
                let objectStore = this.DB
                    ?.transaction([objectStoreName], 'readwrite')
                    .objectStore(objectStoreName)

                let request = objectStore.get(userKey ? userKey + key : key)
                request.onsuccess = function () {
                    if (request.result) {
                        let data = request.result
                        if (userKey) {
                            data = dealUserKey(objectStoreName, request.result, userKey, false)
                        }
                        resolve(data);
                    } else {
                        resolve();
                    }
                };
        
                request.onerror = function (event) {
                    reject(event);
                }
            } catch (error) {
                console.error(error)
                resolve()
            }
        })
        /* #endif */
    
        return compatibleFn
    }

    getAll(objectStoreName, userKey) {
        let compatibleFn
        /* #ifndef MP-WEIXIN */
    
        compatibleFn = new Promise((resolve, reject) => {
            try {
                let objectStore = this.DB
                    ?.transaction([objectStoreName], 'readwrite')
                    .objectStore(objectStoreName);
        
                let request = objectStore.getAll();
        
                request.onsuccess = () => {
                    // 删除旧数据代码
                    if (objectStoreName === 'UserGoods') {
                        request.result.forEach(item => {
                            if (!item.storagePrefix) {
                                objectStore.delete(item.sku)
                            }
                        })
                    }

                    let list = request.result
                    if (userKey) {
                        list = list.filter(item => item.storagePrefix === userKey)
                    }
                    let newList = list.map(item => {
                        let data = item
                        if (userKey) {
                            data = dealUserKey(objectStoreName, data, userKey, false)
                        }
                        return data
                    })
                    
                    resolve(newList)
                }
        
                request.onerror = (err) => {
                    reject(err)
                }
            } catch (error) {
                console.error(error)
                resolve([])
            }
        })
        /* #endif */
    
        return compatibleFn
    }

    put(objectStoreName, data, userKey) {
        let compatibleFn
        /* #ifndef MP-WEIXIN */
        if (userKey) {
            data = dealUserKey(objectStoreName, data, userKey, true)
        }

        compatibleFn = new Promise((resolve, reject) => {
            try {
                let objectStore = this.DB
                    ?.transaction([objectStoreName], 'readwrite')
                    .objectStore(objectStoreName);
        
                let request = objectStore.put(data);
        
                request.onsuccess = function() {
                    resolve(200);
                };
        
                request.onerror = function(event) {
                    reject(event);
                }
            } catch (error) {
                resolve();
            }
        })
        /* #endif */
        
        return compatibleFn
    }

    delete(objectStoreName, key, userKey) {
        let compatibleFn
        /* #ifndef MP-WEIXIN */
        compatibleFn = new Promise((resolve, reject) => {
            try {
                let objectStore = this.DB
                    ?.transaction([objectStoreName], 'readwrite')
                    .objectStore(objectStoreName);
        
                let request = objectStore.delete(userKey ? userKey + key : key);
        
                request.onsuccess = function () {
                    resolve(200);
                };
        
                request.onerror = function (event) {
                    reject(event);
                }
            } catch (error) {
                resolve();
            }
        })
        /* #endif */
        
        return compatibleFn
    }
}

export default new IndexDB()