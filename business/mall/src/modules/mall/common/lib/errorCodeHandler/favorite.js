import extendUtils from '../utils';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = [];//全局白名单

//我的收藏 自定义错误码
var errorMap = {
    "80112001": {//
        text: '商品收藏数量已达上限',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: false,
    },
    "80112002": {//
        text: '收藏失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80112003": {//
        text: '取消收藏失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80112004": {//
        text: '查询收藏列表失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80112005": {//
        text: '获取收藏详情失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },

}

export default function () {
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}