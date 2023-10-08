/*
 功能：航班舱位相关数据
author：sj
date：2019年2月21日
/**
 * 证件类型Arr
 */
export const CabinEnum = {
    0: '经济舱',
    1: '商务舱',
    2: '头等舱'
};
    
export function getCabinName(code){
    return !!code ? CabinEnum[code] : null;
}
