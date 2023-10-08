var extendUtils = {}
/**========== 注入外部提供的函数 ============ */
import externalUtils from './externalUtils.js';
extendUtils = Object.assign({}, extendUtils, externalUtils);

/**========== 注入自定义的工具函数 ============ */
import utils from './utils.js'
extendUtils = Object.assign({}, extendUtils, utils);

export default extendUtils;
