/*
 功能：统一处理接口返回错误码提示信息键值对
author：xiaowenchuan
date：2019年04月02日
 */

/**
 * type定义
 * TOAST: toast提示
 * ALERT：confirm提示默认只有一个确认按钮
 * CONFIRM: confirm提示，有两个按钮
 * POPUP: 页面提示
 * ---------- *
 * text定义
 * 显示的文字信息
 * ----------
 * iconName定义
 * noticeType == NoticeType.POPUP时传递的icon参数
 * ----------
 * userMsg定义
 * true 优先使用服务器返回的错误信息（字段msg）
 * ----------
 */

export const NoticeType = {
    "TOAST": 1,//提示信息，使用vux的toast组件
    "ALERT": 2,//弹窗信息，使用vux的cofirm组件，只有一个“确定”按钮，按钮动作可在ErrorCodeMap中定制
    "CONFIRM": 3,//确认框，使用vux的cofirm组件，有两个按钮，默认是“确定"“取消”，按钮文字和动作均可在ErrorCodeMap中定制
    "POPUP": 4,//弹出框，实际上是新生成一个页面覆盖当前页面代码。所以当前页面的功能会被清空。（注意，原页面中的setTimeout等闭包函数可能依然会执行）
    "CUST_ACTION": 5,//自定义动作
}
export const BisType = {
    "CLOSE": 0,//关闭提示信息  暂无用
    "REDO": 1,//重试
    "BACKPAGE": 2,//返回上一页
    "REFRESH": 3,//页面刷新
    "BACKINDEX": 4,//返回首页
    "CONTACTSER": 5,//联系客服
}

export const WhiteList = {
    global: [],
    popup: []
}

export const NETWORK_ERR_SCENE = []

/** ========================================errorCode start========================================== */

/**
 * 标准对象格式：
 * [ErrorCode]: {
 *     text: 错误提示文字，以UE为准
 *     noticeType: 错误提示方式，类型介绍见NoticeType对象
 *     bisType: 按钮动作，支持String和Array类型的参数。如果是String，则表示第一个按钮的动作；如果是Array，第一个表示确定（依照vux confirm组件的确定和取消事件）的动作，第二个表示取消的动作
 *     bisFunc: 自定义按钮动作，如果不为空，则忽略bisType相应的动作。参数类型及用法同bisType。（注：这个参数应该在业务侧加）
 *     btnName: 按钮名字，参数与用法同bisType
 *     iconUri: 图片的路径
 *     showCode: 错误提示中是否显示错误码
 *     useServerMsg: 是否使用服务器返回的错误文字，如果是，则忽略[text]属性    (待确定)
 *     serverMsgName: 用于保存服务器错误文字的字段，一般在接口response的根元素下，当useServerMsg为true时有效。   （待确定）
 *     ignore: 是否忽略当前错误码，如果是，本拦截器不会处理
 *     scene: 场景集合，也就是各场景url的字符串数组。其中这个url是用endsWith匹配的，所以可以给全路径，也可以只给其中一部分，但要能唯一识别它。例：订单列表页面，可写成"static/order/modules/myOrder.html#/" 或 "myOrder.html#/"。 注意：如果只写到.html#/，表示匹配全局路由/，如果匹配单个路由，需要加上路由的路径。比如可以配置成：orderDetail.html#/train/orderDetail，表示匹配火车票订单详情 TODO 1. 用参数区分场景；2. 场景要有自己的白名单
 *     remindTimes: 提醒次数，同一个错误码在一个路由中只提醒remindTimes次
 *     level: 消息级别 TODO 应有详细的级别处理。目前只实现了0级（最高级），表示无视所有白名单，永远会提示
 *
 *
 * [ErrorCode]也可以是个数组，如果是数组，表示是多场景，数组中的每个对象都对应一种场景的提示内容和方式。拦截器会根据第一个匹配到的场景进行处理。（会影响匹配的属性/对象包括： scene和WhiteList）
 */

export const ErrorCodeMap = {}
/** ========================================errorCode end========================================== */
