/**
 * 脱敏的数据类型
 */
export const MASKING_TYPE = {
    NAME: 'name',
    TEL: 'tel',
}

/**
 * 数据脱敏
 * @param {*} type {MASKING_TYPE} 数据类型
 * @param {*} value 数据值
 * @returns 
 */
export function maskingText(type, value){
    if(value==null || value==undefined){
        return value;
    }
    try{
        let length = value.length;
        switch(type){
            case MASKING_TYPE.NAME:
                return length<=3 ? value.substring(length-1).padStart(3, '*') : value.substring(length-2).padStart(length, '*');
            case MASKING_TYPE.TEL:
                return value.substr(0, 3) + value.substring(length-4).padStart(length-3, '*');
            case MASKING_TYPE.ADDRESS:
                return value.substr(0, 3) + value.substring(length-3).padStart(length-3, '*'); 
            case MASKING_TYPE.IDCARD:
                return value.substr(0, 3) + value.substring(length-2).padStart(length-4, '*');    
            default: 
                return value;
        }
    }catch(e){
        console.error('数据脱敏失败：'+e);
        return value;
    }
}
