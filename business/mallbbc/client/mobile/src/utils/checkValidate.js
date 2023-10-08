// 正数负数小数
const numberCheck = /^(\-|\+)?\d+(\.\d+)?$/;

/*
 * 校验是否为数字
 * num：数字
 */
export function checkNumber(num) {
    return numberCheck.test(num);
}
