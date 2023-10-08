
export const cashState = {
    1: {
        text: '待核销',
        icon: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/icon/icon_common_warning.svg', // 状态前面的icon
        bgImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/coupon/icon_common_daihexiao.svg', // 使用状态对应的bgimage
        lineThrough: false, // 券码是否展示中间划线
        showChecker: false, // 是否显示核销人
        showCheckBtn: true // 是否显示核销按钮
    }, 
    2: {
        text: '已核销',
        icon: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/icon/btn_common_success.svg',
        bgImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/coupon/icon_common_yihexiao.svg', // 使用状态对应的bgimage
        lineThrough: true, // 券码是否展示中间划线
        showChecker: true, // 是否显示核销人
        showCheckBtn: false // 是否显示核销按钮
    }, 
    3: {
        text: '已过期',
        icon: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/icon/icon_common_timeout.svg',
        bgImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/coupon/icon_yhq_yiguoqi.svg', // 使用状态对应的bgimage
        lineThrough: true, // 券码是否展示中间划线
        showChecker: false, // 是否显示核销人
        showCheckBtn: false // 是否显示核销按钮
    },
    5: {
        text: '已失效',
        icon: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/icon/icon_common_timeout.svg',
        bgImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/coupon/icon_common_yishixiao.svg', // 使用状态对应的bgimage
        lineThrough: true, // 券码是否展示中间划线
        showChecker: false, // 是否显示核销人
        showCheckBtn: false // 是否显示核销按钮
    }
}

