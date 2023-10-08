/** 
 * 判断分页是否还有数据
 */

export const checkPageHasMore = ({
    current,
    pageSize,
    total
}) => {
    return current * pageSize < total * 1;
}

/** 
 * 大数据统一处理
 */

export const initNum = (num) => {
    if (num * 1 > 9999) {
        return (num / 10000).toFixed(2) * 1 + 'w';
    }

    return num;
}

/** 
 * 颜色数组
 */

export const colorArray = ['#fb8615', '#f2f520', '#3eea02', '#41c3fd', '#0439eb', '#6d02de', '#e207a9', '#eb003b'];

export const emojiPath = getApp().globalData.imgUrl+'emoji/';

export const emoji = [
    {
        title: '羊驼',
        src: 'emo_01.gif'
    },
    {
        title: '神马',
        src: 'emo_02.gif'
    },
    {
        title: '浮云',
        src: 'emo_03.gif'
    },
    {
        title: '给力',
        src: 'emo_04.gif'
    },
    {
        title: '围观',
        src: 'emo_05.gif'
    },
    {
        title: "威武",
        src: "emo_06.gif"
    },
    {
        title: "熊猫",
        src: "emo_07.gif"
    },
    {
        title: "兔子",
        src: "emo_08.gif"
    },
    {
        title: "奥特曼",
        src: "emo_09.gif"
    },
    {
        title: "囧",
        src: "emo_10.gif"
    },
    {
        title: "互粉",
        src: "emo_11.gif"
    },
    {
        title: "礼物",
        src: "emo_12.gif"
    },
    {
        title: "微笑",
        src: "emo_13.gif"
    },
    {
        title: "嘻嘻",
        src: "emo_14.gif"
    },
    {
        title: "哈哈",
        src: "emo_15.gif"
    },
    {
        title: "可爱",
        src: "emo_16.gif"
    },
    {
        title: "可怜",
        src: "emo_17.gif"
    },
    {
        title: "抠鼻",
        src: "emo_18.gif"
    },
    {
        title: "吃惊",
        src: "emo_19.gif"
    },
    {
        title: "害羞",
        src: "emo_20.gif"
    },
    {
        title: "调皮",
        src: "emo_21.gif"
    },
    {
        title: "闭嘴",
        src: "emo_22.gif"
    },
    {
        title: "鄙视",
        src: "emo_23.gif"
    },
    {
        title: "爱你",
        src: "emo_24.gif"
    },
    {
        title: "流泪",
        src: "emo_25.gif"
    },
    {
        title: "偷笑",
        src: "emo_26.gif"
    },
    {
        title: "亲亲",
        src: "emo_27.gif"
    },
    {
        title: "生病",
        src: "emo_28.gif"
    },
    {
        title: "太开心",
        src: "emo_29.gif"
    },
    {
        title: "白眼",
        src: "emo_30.gif"
    },
    {
        title: "右哼哼",
        src: "emo_31.gif"
    },
    {
        title: "左哼哼",
        src: "emo_32.gif"
    },
    {
        title: "嘘",
        src: "emo_33.gif"
    },
    {
        title: "衰",
        src: "emo_34.gif"
    },
    {
        title: "委屈",
        src: "emo_35.gif"
    },
    {
        title: "呕吐",
        src: "emo_36.gif"
    },
    {
        title: "打哈欠",
        src: "emo_37.gif"
    },
    {
        title: "抱抱",
        src: "emo_38.gif"
    },
    {
        title: "怒",
        src: "emo_39.gif"
    },
    {
        title: "问号",
        src: "emo_40.gif"
    },
    {
        title: "馋",
        src: "emo_41.gif"
    },
    {
        title: "拜拜",
        src: "emo_42.gif"
    },
    {
        title: "思考",
        src: "emo_43.gif"
    },
    {
        title: "汗",
        src: "emo_44.gif"
    },
    {
        title: "打呼",
        src: "emo_45.gif"
    },
    {
        title: "睡",
        src: "emo_46.gif"
    },
    {
        title: "钱",
        src: "emo_47.gif"
    },
    {
        title: "失望",
        src: "emo_48.gif"
    },
    {
        title: "酷",
        src: "emo_49.gif"
    },
    {
        title: "好色",
        src: "emo_50.gif"
    },
    {
        title: "生气",
        src: "emo_51.gif"
    },
    {
        title: "鼓掌",
        src: "emo_52.gif"
    },
    {
        title: "晕",
        src: "emo_53.gif"
    },
    {
        title: "悲伤",
        src: "emo_54.gif"
    },
    {
        title: "抓狂",
        src: "emo_55.gif"
    },
    {
        title: "黑线",
        src: "emo_56.gif"
    },
    {
        title: "阴险",
        src: "emo_57.gif"
    },
    {
        title: "怒骂",
        src: "emo_58.gif"
    },
    {
        title: "心",
        src: "emo_59.gif"
    },
    {
        title: "伤心",
        src: "emo_60.gif"
    }

]