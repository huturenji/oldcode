const BP_PARAM_KEY = 'bp-param';

let bpParam = SnUtils.getUserPara('bp-param');
if (!!bpParam && bpParam != 'null' && bpParam != 'undefined'){
    try {
        SnUtils.setSession(BP_PARAM_KEY, bpParam)
    } catch (error) {
        
    }
}


// 获取bp-param参数
function getBpParam(){
    try {
        return JSON.parse(decodeURIComponent(SnUtils.getSession(BP_PARAM_KEY)))
    } catch (error) {
        console.error('获取并解析bp-param参数失败', error);
    }
}

export default {
    getBpParam,
    BP_PARAM_KEY
}