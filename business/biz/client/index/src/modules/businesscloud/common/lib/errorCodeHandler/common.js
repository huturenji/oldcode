import extendUtils from '../utils';
import GlobalConfig from 'common/config';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = [];//全局白名单

const NoticeType = extendUtils.NoticeType;
const BisType = extendUtils.BisType;
const NETWORK_ERR_SCENE = extendUtils.NETWORK_ERR_SCENE;

//自定义错误码
var errorMap = {
    //授权失败（token过期或验签失败），http状态码401
    "AUTHORIZE_FAILED": {
        text: '获取信息失败，请稍后重试',
        noticeType: NoticeType.TOAST,
        showCode: false,
    },
    //无权限，http状态码403
    "NO_AUTHORIZATION": {
        text: '您没有权限',
        noticeType: NoticeType.TOAST,
        showCode: false,
    },
    //接口异常(公共异常)
    "NETWORK_ERR": [
        {
            text: "获取信息失败，请稍后重试",
            noticeType: NoticeType.TOAST,
        }
    ],
}

export default function(){
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}