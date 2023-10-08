import extendUtils from '../utils';
import BMallConfig from 'common/lib/config.js';
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = ['/order/v1/getOrderStatistics'];//全局白名单



//自定义错误码
var errorMap = {
    // "80102001": {//场景说明：请求的公共参数传输错误
    //     text: '系统错误，请稍后再试',
    //     noticeType: extendUtils.NoticeType.TOAST,
    //     showCode: true,
    // },    
    "80102001": {//
        text: '订单不存在',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80102002": {//
        text: '订单类型不存在',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80102003": {//
        text: '订单状态不存在',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80102004": {
        text: '供应商订单配置不存在',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80102005": {
        text: extendUtils.getMallTitle() + '已停用，请稍后再试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80102006": [
        {
            text: '非法订单状态',
            noticeType: extendUtils.NoticeType.TOAST,
            showCode: true,
            scene:['/order/snapshot'],
            ignore : true
        },
        {
            text: '非法订单状态',
            noticeType: extendUtils.NoticeType.TOAST,
            showCode: true,
        }
    ],
    "80102007": {
        text: '验签失败',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80102008": { //下单时如果商品下架、无货、变价后错误码 忽略，业务测自己处理
        ignore: true
    },
    "80102009": {
        text: '系统错误，请稍后再试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80102010": {
        text: '系统错误，请稍后再试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80102011": {
        ignore: true,
        text: '供应商不在服务时间',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: false,
    },
    "80115022": {
        ignore: true,
        text: '抱歉赠品已赠完，是否继续提交订单',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: false,
    },
    "80115029": {
        ignore: true,
        text: '抱歉所选商品附件无货',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: false,
    },
    "80102012": {
        ignore: true,
        text: '订单已签收，无法更改发票抬头',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: false,
    },
    "80102013": {
        text: '订单超过一年无法补开',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80102017": {
        text: '计算金额有误',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    },
    "80102018": {
        text: '系统错误，请稍后再试',
        noticeType: extendUtils.NoticeType.TOAST,
        showCode: true,
    }
}

export default function () {
    Object.assign(extendUtils.ErrorCodeMap, errorMap);
    extendUtils.WhiteList.popup.push(...popupWhiteList);
    extendUtils.WhiteList.global.push(...globalWhiteList)
}