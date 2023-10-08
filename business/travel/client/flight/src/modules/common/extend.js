var extendUtils = SnTravel.functional;

/**
 * 英文名显示证件类型
 */
extendUtils.surnameIDMap = {
    "1":'护照',
    "5": '台胞证',
    "8": '外国人永久居留身份证'
};
/**
 * 显示英文名
 * iDCode  证件类型
 */
extendUtils.showSurname = function(iDCode){
    return !!extendUtils.surnameIDMap[iDCode];
};

extendUtils.RUN_ENV = process.env.BP_ENV;//运行环境，默认为Dev
export default extendUtils;
