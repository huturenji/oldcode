import extendUtils from '../utils';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = ['/getApprovalRequestUrl','/cart/v1/list'];//全局白名单

//自定义错误码
var errorMap = {  
    "80101001": {//
        text: '系统错误，请稍后再试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80101002": {//
        text: '购物车商品种类超过上限',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: false,
    },
    "80101003": {//
        text: '数量值不合法',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80101004": [
        {
            text: '购物车中未查询到此商品',
            noticeType: extendUtils.NoticeType.TOAST,
            showCode: true,
            scene:['/order/snapshot'],
            ignore : true
        },
        {
            text: '购物车中未查询到此商品',
            noticeType: extendUtils.NoticeType.TOAST,
            showCode: true,
        }
    ],
    "80101005": {
        text: '参数缺失',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80101006": {
        text: '此商品不可加入购物车',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: false,
    },
    "80101007": {
        text: '最多只能购买500件哦!',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: false,
    },
}

export default function () {
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}