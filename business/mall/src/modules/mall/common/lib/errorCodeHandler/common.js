import extendUtils from '../utils';
import BMallConfig from 'common/lib/config.js';
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
    "80000001": {
        text: '无效token',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "80000002": {
        text: 'token过期',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "80000003": {
        text: '无效的app key',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "80000004": {
        text: '缺少app key',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "80000005": {
        text: '缺少token',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "80000006": {
        text: 'refresh token过期',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "80000007": {
        text: 'refresh token不存在',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "80000101": {
        text: '参数错误',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "80000555": {
        text: '站点故障',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "80000999": {
        text: '系统内部错误',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "80118003": {
        text: extendUtils.getMallTitle() + '已停用，请稍后再试',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },


    /***********************安全链路的公共错误码开始*********************/
    "87001020": {
        text: '安全链路请求合法性-时间戳校验失败！',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "87001010": {
        text: '安全链路请求报文解析失败！',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "87001021": {
        text: '安全链路请求合法性-reqid校验失败！',
        noticeType: NoticeType.TOAST,
        showCode: true,
    },
    "87001030": {
        text: '安全链路请求业务服务超时',
        noticeType: NoticeType.TOAST,
        showCode: true,
    }
}

export default function(){
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}