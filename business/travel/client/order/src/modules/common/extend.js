var extendUtils = SnTravel.functional;
extendUtils.findIndex = (array, value) => {
    let _index = -1;
    if (!array || array.length == 0) {
        return _index;
    }
    let _value = value;
    let _key = null;

    //value是函数，则直接用函数匹配
    if (value.constructor === Function) {
        array.some((obj, index) => {
            if (value(obj)) {
                _index = index;
                return true;
            }
            return false;
        })
        return _index;
    }

    //value是对象，则取第一个key进行过滤
    //其他情况，直接用value匹配过滤
    if (value.constructor === Object) {
        let keys = Object.keys(value);
        if (keys.length == 0) {
            return _index;
        }
        _key = keys[0];
        _value = value[_key];
    }
    array.some((obj, index) => {
        if (!!_key && obj.constructor === Object) {
            obj = obj[_key];
        }
        if (obj == _value) {
            _index = index;
            return true;
        }
        return false;
    })
    return _index;
}
//添加脱敏开关
extendUtils.ISDECORATE = true
export default extendUtils;
