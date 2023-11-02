import { utils } from "opcl";
var popupWhiteList = [];//弹窗白名单
var globalWhiteList = [];//全局白名单

const NoticeType = utils.NoticeType;

//自定义错误码
var errorMap = {
    //参数错误
    "85103001": {
        text: "获取信息失败，请稍后重试",
        noticeType: NoticeType.TOAST
    },
    "91103001": {
        text: "商品已失效，请重新选择",
        noticeType: NoticeType.TOAST
    },
    "91103002": {
        text: "网络连接错误，请稍后再试",
        noticeType: NoticeType.TOAST
    },
    "91102001": {
        text: "获取信息失败，请稍后重试",
        noticeType: NoticeType.TOAST
    },
    "91102002": {
        text: "订单不存在，请确认",
        noticeType: NoticeType.TOAST
    },
    "91102003": {
        text: "商品种类有误，请确认",
        noticeType: NoticeType.TOAST
    },
    // "91102004": {
    //     text: "获取信息失败，请稍后重试",
    //     noticeType: NoticeType.TOAST
    // },
    "91102005": {
        text: "兑换码文件格式有误，请确认",
        noticeType: NoticeType.TOAST
    },
    "91101001": {
        text: "用户审核失败",
        noticeType: NoticeType.TOAST
    },
    "91101002": {
        text: "用户不存在",
        noticeType: NoticeType.TOAST
    },
    "91101003": {
        text: "手机号已被注册",
        noticeType: NoticeType.TOAST
    },
    "91101004": {
        text: "用户名或密码错误",
        noticeType: NoticeType.TOAST
    },
    "91101005": {
        text: "短信验证码过期",
        noticeType: NoticeType.TOAST
    },
    "91101006": {
        text: "短信验证码错误",
        noticeType: NoticeType.TOAST
    },
    "91101007": {
        text: "手机号不存在",
        noticeType: NoticeType.TOAST
    },
    "91101008": {
        text: "用户注册失败",
        noticeType: NoticeType.TOAST
    },
    "91101009": {
        text: "用户重置密码失败",
        noticeType: NoticeType.TOAST
    },
    "91100001": {
        text: "参数错误，无法访问",
        noticeType: NoticeType.TOAST
    },
    "91100002": {
        text: "当前活动已结束",
        noticeType: NoticeType.TOAST
    },
    "91100003": {
        text: "抽奖活动待启用",
        noticeType: NoticeType.TOAST
    },
    "91100004": {
        text: "抽奖活动已启用",
        noticeType: NoticeType.TOAST
    },
    "91100005": {
        text: "创建活动异常",
        noticeType: NoticeType.TOAST
    },
    "91100006": {
        text: "创建奖品名重复",
        noticeType: NoticeType.TOAST
    },
    "91100007": {
        text: "您的活动订单尚未审核通过",
        noticeType: NoticeType.TOAST
    },
    "91100008": {
        text: "抱歉，您的抽奖次数已用完",
        noticeType: NoticeType.TOAST
    },
    "91100009": {
        text: "抱歉，您的抽奖次数已用完",
        noticeType: NoticeType.TOAST
    },
    "91100010": {
        text: "该订单已经审核完成",
        noticeType: NoticeType.TOAST
    },
    "91100011": {
        text: "奖品兑换券数量异常",
        noticeType: NoticeType.TOAST
    },
    "91100012": {
        text: "该奖品暂时无法领取，如有疑问，请联系客服处理",
        noticeType: NoticeType.TOAST
    },
    "91100013": {
        text: "操作过于频繁",
        noticeType: NoticeType.TOAST
    },
    "91100014": {
        text: "该线下奖品类型没有对应的兑换券导入模板",
        noticeType: NoticeType.TOAST
    },
    "91100015": {
        text: "补充奖品异常",
        noticeType: NoticeType.TOAST
    },
    // "91100016": {
    //     text: "兑换优惠券失败",
    //     noticeType: NoticeType.TOAST
    // },
    "91100017": {
        text: "每日抽奖次数不能大于抽奖总次数",
        noticeType: NoticeType.TOAST
    },
    "91100018": {
        text: "每日中奖次数不能大于中奖总次数",
        noticeType: NoticeType.TOAST
    },
    "91100019": {
        text: "中奖概率不能小于等于0",
        noticeType: NoticeType.TOAST
    },
    "91100020": {
        text: "中奖概率不能大于100%",
        noticeType: NoticeType.TOAST
    },
    "91100021": {
        text: "线上奖品不能相同",
        noticeType: NoticeType.TOAST
    },
    "91100022": {
        text: "请上传兑奖码",
        noticeType: NoticeType.TOAST
    },
    // "91100023": {
    //     text: "奖品数量与兑换码数量不一致",
    //     noticeType: NoticeType.TOAST
    // },
    // "91100024": {
    //     text: "兑换码文件中存在重复数据，请检查",
    //     noticeType: NoticeType.TOAST
    // },
    // "91100025": {
    //     text: "本次上传兑换码与之前上传兑换码重复，请检查",
    //     noticeType: NoticeType.TOAST
    // }
}

export default function () {
    Object.assign(utils.ErrorCodeMap, errorMap);
    utils.WhiteList.popup.push(...popupWhiteList);
    utils.WhiteList.global.push(...globalWhiteList)
}