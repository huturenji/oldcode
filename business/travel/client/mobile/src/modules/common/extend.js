import SingletonBridge from './singletonBridge'
var extendUtils = SnTravel.functional;

extendUtils.RUN_ENV = process.env.BP_ENV;//运行环境，默认为Dev
extendUtils.winCloseCbSingleton = new SingletonBridge();//单例事件


extendUtils.isString = obj => {
    return Object.prototype.toString.call(obj) == '[object String]';
}

extendUtils.isArray = obj => {
    return Object.prototype.toString.call(obj) == '[object Array]';
}

extendUtils.isObject = obj => {
    return Object.prototype.toString.call(obj) == '[object Object]';
}

extendUtils.isNumber = obj => {
    return Object.prototype.toString.call(obj) == '[object Number]';
}

extendUtils.isEmpty = obj => {
    if (obj==null || obj==undefined){
        return true;
    }
    if (extendUtils.isString(obj)){
        return obj.replace(/\s/g, '') == '';
    }
    if (extendUtils.isArray(obj)){
        return obj.length == 0;
    }
    if (extendUtils.isObject(obj)){
        return Object.keys(obj).length == 0;        
    }
    return false;
}

extendUtils.isStrictEmpty = obj => {
    return extendUtils.isEmpty(obj) || obj == 'undefined' || obj == 'null'
}

extendUtils.isNotEmpty = obj => {
    return !extendUtils.isEmpty(obj);
}

extendUtils.isNotStrictEmpty = obj => {
    return !extendUtils.isStrictEmpty(obj);
}


/**
* url http转https
* @param {String} url
*/
extendUtils.changUrlToHttps = url => {
    let str = url || '';
    return str.replace(/http:/g, "https:")
}

/**
 * 数组去重
 * @param param
 * @return {*}
 */
extendUtils.sortedUniq = (array, iteratee) => {
    if (array == null || array.length == 0) {
        return [];
    }
    function eq(value, other) {
        return value === other ;
    }
    let seen
    let index = -1//循环索引
    let resIndex = 0//结果数组索引
    const { length } = array//数组长度
    const result = []//结果数组
    while (++index < length) {
        const value = array[index], computed = iteratee ? iteratee(value) : value
        //value是原数组的当前值，computed是遍历器处理后的当前值
        if (!index || !eq(computed, seen)) { //如果是第一个元素或者，与之前的元素不相等
            seen = computed//存下新出现的元素，然后给结果数组里赋值
            result[resIndex++] = value === 0 ? 0 : value
            //结果数组结尾插入新值，排除-0的影响
        }
    }
    return result
}

/**
* 时间转换为年月
* @param {Object} date  时间
*/
extendUtils.handleDate = (date, partten='yyyy年MM月dd日') => {
    return new Date(date).format(partten)
}

export default extendUtils;
