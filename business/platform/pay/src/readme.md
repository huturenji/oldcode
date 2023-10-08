#可用功能：
1. 支付宝、微信支付。包括PC端和移动端。
2. 微信支付测试。
3. 银联支付可正常打开(但未真实支付进行测试)

#遗留点：
1. 微信H5支付，安卓在微信上点回退，会返回上一页
2. 重复支付、初始化等操作还未全局审视
3. 伴正事上的回退问题（app返回事件注册）未处理。 (个人觉得，打开二维码支付时，点击返回，不应该关闭二维码，而是离开支付页面)
4. 可能还缺少一些关键事件，待遇到了再加上
5. 倒计时未处理

#使用方式：
1. 使用sinopay.install()安装支付组件，请参考install的参数说明
2. 业务侧需自行提供支付列表、支付结果页面。 组件有相应的方法和事件来达成该目的。

#API

函数
* install(options) 安装支付组件。 options包含两个对象：config和data
* destroy() 销毁支付组件。 离开支付页面时务必销毁本组件
* config-------
* token(String | Function) 提供token
* origin(String): 请求的域名
* api(Object): 接口路径。 payTypeList， createOrder， getPaymentInfo，payNotify： {path, method}
* commonParams(Object): 公共参数。 比如：userId, companyId, channelId
* bslConfig(Object): bsl配置
* checkNetwork(Boolean): 是否开启网络监测
* depends(Object): 依赖环境配置（默认使用window下对象）
* sinosdk(Object): sinosdk的相关配置 {name: 'sinosdk', value:[sinosdk的对象], path: [sinosdk的路径]}
* snutils(Object): SnUtils的相关配置 {name: 'SnUtils', value:[SnUtils的对象], path: [SnUtils的路径]}
* serviceHotline(String): 客服电话
* timeout(Number)：超时时间（单位：秒）
* responseAdapter(Object): 接口返回值格式，需提供：
* dataKey[String]: [业务数据的key],
* codeKey[String]: [业务code的key],
* messageKey[String][可选]: [接口状态描述的key]，
* isSuccess(response) [Function]: [接口状态是否成功的函数,提供一个参数response，是返回体对象]
* zIndex(Number),//页面元素基准z-index, 默认1000
* redirectUri(String): h5支付使用的url，支付操作完后，回到该url
* validPayType(Boolean): 是否需要校验支付方式的合法性(false时调用use，不会从支付列表查询该支付方式是否存在)，默认true
* runEnv（String）: 运行环境，bizmate需要sinosdk，browser不需要sinosdk。 默认'bizmate'
* primaryColor(String): 组件的主要颜色
* pcWidth(String): pc的宽度，用于判断当前是大屏还是小屏，单位px
* propsData：{
* orderNo [String | Number] (和orderNoList必传其一): 订单号
* orderNoList[Array] (和orderNo必传其一): 订单号列表，
* amount[String | Number]（必传）: 金额,
* goodsDesc[String]（必传）: 订单描述,
* tradeType[Number]（必传）: 订单类型,  1:机票，2：火车票，3：酒店，4：京东企业购
* limitTime[Number]： 剩余支付时间（单位：毫秒）
* cutdown(Boolean)：是否开启倒计时。 如果为true，需要传入limitTime才可生效
* appExtraData(Object): app支付时，需要提供的额外业务参数。具体内容由业务侧按app的api来定  

实例方法:

* initData(data)  初始化支付参数，内容同propsData。 可在install时传入支付参数，也可在install后通过initData传入
* getPayMethod    获取支付列表
* use(String | Object) 调用具体的支付方式。 参数一般是从getPayMethod返回的支付对象。在开启支付方式校验（validPayType=true）时，可传入支付对象的code（String类型）或者整个支付对象；
* 关闭校验时，必须传入对象，且至少要包含{code,payType,payMethod}（其中payMethod的值可从对外暴露的PAY_MODE中获取）。 注意，在非伴正事环境，只可调用H5支付或二维码支付。
* on(name, callback)   监听事件。name：事件名，callback：回调函数
* getPayResult()   获取支付状态  0成功, -1失败，-2中断，-3未确认支付状态，1支付中(正在执行支付流程)，2获取支付结果中（支付动作已完成） 默认值是空字符串，无意义
* closeH5Pay()    关闭正在进行的H5支付。H5支付一般会打开一个全屏iframe来展示第三方支付页面，此方法用于关闭该iframe
* stopTracking() 停止轮询支付结果
* updateLimitTime(Number) 更新剩余支付时间，此时cutdown设置应设置false，将剩余时间的更新交由业务侧控制

事件：
* onOperationEnd  支付操作完成。 只有非PC二维码支付才会触发这个事件。 此时支付state为2
* onListenlingState(state)  监听支付状态，state的值参考OPERATION_STAGE
* onCancelUnknown  支付结果确认confirm框的继续支付（“再次确认”）按钮事件。 在默认操作之前触发，如果返回false，则不执行默认操作。  支持返回一个promise对象。  （默认操作： 继续查询支付结果）
* onConfirmUnknown 支付结果确认confirm框的取消继续等待结果（“知道了”）按钮事件。  没有默认操作。
* onH5PayOperaEnd  H5支付程序操作完成，已加载H5支付的页面
* onBeforeH5Pay(payType) H5支付之前的钩子



常量: 
- PAY_MODE：支付类型枚举
- OPERATION_STAGE： 支付操作步骤枚举：
    1. SUCCESS: 成功、
    2. FAILED: 失败、
    3. BREAK: 支付操作中断、
    4. PAYING: 支付动作执行中、
    5. WAITING: 支付动作完成，等待结果、
    6. UNKNOW: 无法预知支付动作是否完成（主要用在二维码支付上）
    7. END: 非实时支付，当前操作流程结束(原用在公款转账上，现暂时弃用)
