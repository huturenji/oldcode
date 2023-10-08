import { Base64 } from 'js-base64'
const BP_PARAM = 'bp-param';

let bpParam = SnUtils.getUserPara('bp-param');
if (!!bpParam && bpParam != 'null' && bpParam != 'undefined'){
    try {
        SnUtils.setSession(BP_PARAM, bpParam)
    } catch (error) {
        
    }
}


// 获取bp-param参数
function getBpParam(data){
    let paramStr = data;
    if(!!!data){
        paramStr = SnUtils.getSession(BP_PARAM);
    }
    try {
        return JSON.parse(Base64.decode(decodeURIComponent(paramStr)))
    } catch (error) {
        try {
            return JSON.parse(decodeURIComponent(paramStr))
        } catch (err) {
            return decodeURIComponent(paramStr)
        }
    }
}

// 设置bp-param参数
function setBpParam(data){
    let paramStr = ''
    if (data) {
        paramStr = Base64.encodeURI(JSON.stringify(data))
    }
    return paramStr
}

export default {
    getBpParam,
    setBpParam,
    BP_PARAM
}