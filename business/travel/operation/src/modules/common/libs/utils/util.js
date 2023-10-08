/**
 * 页面数据显示默认还是数据
 * @value 要显示的
 * @empty 默认显示
 * @return {*}
 */
export function showValueOrDeault(value, empty = '---') {
    if (value == 0) {//数值0
        if (isNaN(parseInt(value))) {
            return empty;
        } else {
            return value
        }
    } else if (!!value) {
        return value;
    } else {
        return empty;
    }
}
/**
 * 检验URL，从服务器拿过来的规则
 */
export function isValidUrl(url) {
    // var patrn = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\\/])+$/;
    // if (!patrn.exec(url)) {
    //     return false
    // } else {
    //     return true
    // }
    return true
}
