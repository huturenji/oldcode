export function validatePass(rule, value, callback) {
    if (!value || value.length === 0 || value === '') {
        callback(new Error('密码不能为空'));
    }
    // 至少一个小写字母、大写字母、特殊字符。 长度至少10位数
    // let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[#$*@])[\w#$*@]{10,}$/
    // if (regex.test(value)) {
    //     callback()
    // }
    // callback(new Error('确保至少一个小写字母、大写字母、特殊字符,且长度至少10'))
    if (value.length < 6 || value.length > 20) {
        callback(new Error('请输入6~20位的密码'));
        return false;
    } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback(new Error('密码不可以有中文～'));
        return false;
    } else if (!(/^\S*$/.test(value))) {
        callback(new Error('密码中不可以有空格～'));
        return false;
    }
    callback()
}