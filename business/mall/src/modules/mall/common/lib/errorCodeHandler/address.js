import extendUtils from '../utils';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = [];//全局白名单

//地址管理 自定义错误码
var errorMap = {
    "80111001": {//
        text: '数据库错误',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80111002": {//
        text: '客户不存在',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80111003": {//
        text: '解析token失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80111004": {//
        text: '客户ID不能为空',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80111005": {//
        text: '地址添加失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80111006": {//
        text: '地址删除失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80111007": {//
        text: '获取地址列表失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80111008": {//
        text: '地址修改失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80111009": {//
        text: '获取一级地址失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80111010": {//
        text: '获取二级地址失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80111011": {//
        text: '获取三级地址失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80111012": {//
        text: '获取四级地址失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80111013": {//
        text: '该地址已存在',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80108009": {//
        text: '无法识别',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: false,
    },
}

export default function () {
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}