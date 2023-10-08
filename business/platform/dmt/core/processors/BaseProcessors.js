import Util from "../common/Util";
/**
 *业务处理方法管理器-基类
 */
class BaseProcessors {
  constructor() {
    //存储处理的缓存，使用key\value，key是接口地址，value是处理对象
    this.mProcessorCache = {};
  }
  /**
   * 根据key参数获取指定的处理对象
   * @param {*} key
   * 这里的key支持两种情况，一种是String类型，一般是请求的全量地址。
   * 一种是正则表达式，用于mock数据场景。
   */
  getProcess4Cache(key) {
    let matchResult;
    if (Util.type(key) === "string") {
      let keyPath = key;
      if (key.indexOf("?") != -1) {
        keyPath = key.substring(0, key.indexOf("?"));
      }
      //如果参数是字符串，遍历匹配key
      let keyArr = Object.keys(this.mProcessorCache);
      for (let i = 0, size = keyArr.length; i < size; i++) {
        if (
          keyPath.indexOf(keyArr[i]) != -1 &&
          keyPath.indexOf(keyArr[i], keyPath.length - keyArr[i].length) !== -1
        ) {
          matchResult = this.mProcessorCache[keyArr[i]];
          break;
        }
      }
    } //如果参数是正则，遍历匹配key
    else if (Util.type(key) === "regexp") {
      let keyArr = Object.keys(this.mProcessorCache);
      for (let i = 0, size = keyArr.length; i < size; i++) {
        if (key.test(keyArr[i])) {
          matchResult = this.mProcessorCache[keyArr[i]];
          break;
        }
      }
    } else {
      console.log("getProcess4Cache:unknow key type");
    }
    return matchResult;
  }

  /**
   * 新增一个业务处理器，每新加一个接口的处理，都需要在子类中调用此方法添加。
   * @param {*} key
   * @param {*} processFun
   */
  addProcessor2Cache(key, processFun) {
    if (
      !(
        Util.type(processFun) == "function" || Util.type(processFun) == "object"
      ) ||
      !key
    ) {
      console.error("addProcessor2Cache,param has error");
    }
    this.mProcessorCache[key] = processFun;
  }

  /**
   * 执行处理方法
   * @param {*} key
   * @param {*} sourceData
   */
  executeProcess(key, sourceData) {
    let process = this.getProcess4Cache(key);
    if (process && sourceData) {
      return process(sourceData);
    }
    return sourceData;
  }

}

export default BaseProcessors;
