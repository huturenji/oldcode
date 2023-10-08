import extendUtils from '../utils';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = ['https://wq.jd.com/bases/searchdropdown/getdropdown', 'https://ds.suning.com/ds/his/new/', '/product/v1/getPrice'];//全局白名单

//我的收藏 自定义错误码
var errorMap = {
    "80100005": {//
        text: '该商品已下架，不再商品池中',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: false,
        ignore: true
    },
    "80100006": {//
        text: '该商品已下架，不再商品池中',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: false,
        ignore: true
    },

}

export default function () {
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}