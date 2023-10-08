/*
 *  工具类
 */
var Util = {};
/**
 * 判断输入的obj的对象类型，比如 String Object Array RegExp Function
 * @param {*} obj
 */
Util.type = function type(obj) {
  return obj === null || obj === undefined
    ? String(obj)
    : Object.prototype.toString
        .call(obj)
        .match(/\[object (\w+)\]/)[1]
        .toLowerCase();
};
//中台日志标记位，开启或关闭
Util.logSwitch = false;
/**
 * 封装日志方法
 */
Util.log = function(msg, obj, ignore = false) {
  if (this.logSwitch || ignore) {
    console.log(msg, ...obj);
  }
};
export default Util;
