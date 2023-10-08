兆日商云公共JS-SDK使用说明
=============================

# 一、常量
<font size='2' color='#3c3c3c'>对象层级：sinosdk.sino.constant</font>

- **<font size='4'>RUN_ENV: 运行环境名枚举对象</font>**

```javascript
RUN_ENV: {
    BIZMATE: 'bizmate',
    TCHAT: 'tchat',
    BROWSER: 'browser'
}
```

- **<font size='4'>BRIDGE_TYPE: 浏览器内核枚举对象</font>**

```javascript
BRIDGE_TYPE: {
    SINO: 'sino',
    MPAAS: 'mpaas',
    TMF: 'tmf',
    CHERRY: 'cherry'
}
```

# 二、工具函数

<font size='2' color='#3c3c3c'>对象层级：sinosdk.sino</font>

**<font size='3'>getPlatform</font>**
- **返回值： **
  <font size='3' color='#3c3c3c'>sinosdk.sino.constant.RUN_ENV对象</font>
- **用法：**
  获取运行环境名

# 三、sdk基础能力

<font size='2' color='#3c3c3c'>对象层级：sinosdk.sino</font>

## 3.1 函数
*注意：*
*1. 本节包含jsbridge函数，也包含自定义函数*
*2. jsbridge函数具体说明及参数请参考[JsBridge协议文档-基础协议](https://www.yuque.com/docs/share/679bfdf0-776b-4670-a998-08f2bf2e1ce0)*
*3. 本节内的函数，均可能针对渠道做定制*

<br/>

> | sdk函数名 | jsbridge函数名 <br />/ 自定义函数参数说明 | 功能说明 |
> | :-----| :---- | :---- |
> | getAccessToken | GetAccessTokenFunction | 授权：获取accessToken |
> | getIdToken | GetIdTokenFunction | 授权：获取idToken |
> | getUserInfo | GetUserInfoFunction | 获取伴正事用户信息 |
> | back | goBackFunction | 关闭当前页面 |
> | open | openPage | 打开新页面。<br />非伴正事环境使用window.open实现 |
> | redirect | 参数：{String} url 目标地址 | 重定向页面 |
> | setMenu | RegisterMenuFunction<br />clickMenuCallBack | 设置app菜单按钮 |
> | showReturnBtn(boolean) | RegisterMenuFunction<br />clickMenuCallBack | （PC端）是否显示app的返回按钮 |
> | getMenu | （无） | 获取H5设置的app按钮 |
> | onBack(callback) | notifyAppBackEvent<br />notifyAppBack | 监听app的返回按钮的点击事件 |
> | removeBackListener | UnregisterAppBackFunction | 注销onBack事件的监听 |
> | onRefresh(callback) | notifyAppBackEvent<br />notifyAppBack | 监听app的刷新按钮的点击事件 |
> | onChildWindowClose(callback) | RegisterCommonPushFunction<br />refreshPage | 监听子页面关闭事件。子页面通过back(data)关闭时，可将data传给本函数的callback |
> | onSdkLoad | 参数：{Function} callback 回调函数 | sdk加载完成事件 |
> | discardUnusedStorage | 参数：<br />{String\|Array} keys 需要删除的缓存key<br />{Boolean} ignoreCase 是否忽略keys的大小写 | 根据key删除未使用的storage |
> | getNetInfo | CheckNetWorkFunction | 获取网络信息 |
> | callTel | OpenActionFunction | 拨打电话 |
> | getAppInfo | GetAppConfigFunction | 获取app配置信息 |
> | switchLocationObserver | LocationObserverFunction | 打开/关闭位置监听的开关 |
> | onLocationChange(callback) | LocationNotify | 监听实时位置变化 |
> | getLocationFunction | GetLocationFunction | 主动获取实时定位 |
> | openThirdMapApp | MapFunction | 打开第三方地图应用 |
> | openThirdApp | OpenUnionPageFunction | 打开第三方app |
> | openWXApplet | OpenWXAppletFunction | 打开微信小程序 |
> | onAppPause(callback) | onAppPause | 监听app切换到后台事件 |
> | onAppResume(callback) | onAppResume | 监听app回到前台事件 |
> | execAction | OpenActionFunction（未定制功能的原始函数） | 执行app的底层功能 |
> | contacts | OpenActionFunction | 打开通讯录 |
> | userProfile | QueryUserIconFunction | 通过app获取用户头像 |
> | setTitleBar | SetTitleBarThemeFunction | 设置app的title栏 |
> | encryption | EncryptionFunction | Native 加密 |
> | decryption | DecryptionFunction | Native 解密 |
> | clearWebViewCache | ClearWebViewCacheHandler | 清除H5静态资源缓存 |
> | dataTracking | NotifyActionEventFunction | 数据埋点上报 |
> | share | ShareFunction | 主动调起app分享功能 |
> | registerShare | RegisterShareFunction | 注册app的分享回调 |
> | getNativeCache | GetPropertyFunction | 获取app缓存数据 |
> | putNativeCache | PutPropertyFunction | 设置app缓存数据 |
> | chooseFile | ChooseFileFunction | 选择上传的文件 |
> | upload | MultiUploadFunction | 通过app上传多个文件到BOS |
> | openApplet | OpenAppletFunction | 打开伴正事小应用 |
> | closeApplet | CloseAppletFunction | 关闭伴正事小应用 |
> | openThirdApplet | OpenWebViewFunction | 打开第三方webview页面 |
> | filePreview | PreviewFunction | 文件预览 |
> | pageActived | refreshPage | 页面被激活。 通常用于a打开b，b关闭后a被激活的场景 |
> | overwriteWindowopen | OverwriteWindowopenFunction | IOS通知app允许在异步回调中打开一个新窗口 |
> | isLogined | GetUserStatusFunction | 用户是否已登录 |
> | toLogin | RequestLoginFunction | 拉起app登录页面 |
> | getChannelId | GetAppConfigFunction | 获取渠道id |
> | getBridgeType | 返回值：<br />sino表示sino bridge<br />mpaas表示mpaas bridge<br />tmf表示tmf bridge<br />cherry表示cherry bridge | 获取bridge的type类型，用来区分是sino bridge、mpaas bridge、tmf bridge、cherry bridge |
> | sharePanel | PanelShareFunction | 打开app的分享面板 |
> | aliPay | CallALiPayFunction | 支付宝sdk支付 |
> | xmgjPay | QuickPaymentOrderPayFunction | 厦门国际支付 |
> | unionPay | GetPayAccountFunction | 银联支付 |
> | bossPay | QuickPaymentPayOrderFunction | 老板付 |
> | chouzhouPay | PersonalPaymentFunction | 稠州银行个人付 |
> | huaxingPersonalPay | HXPersonalPaymentFunction | 华兴银行个人付 |
> | cancelTransferPay | CancelPublicTransferFunction | 取消老板付 |
> | transferPay | PublicTransferFunction | 公款转账 |
> | quickPay | PublicQuickPayFunction | 公款闪付 |
> | getCriterion | GetTravelCriterionFunction | 获取差标设置 |
> | getSpecial | GetSpecialCompetenciesFunction | 获取免审批设置 |
> | getReservationDateRange | GetReservationDateRangeFunction | 获取用户预订日期设置 |

# 四、授权
<font size='2' color='#3c3c3c'>对象层级：sinosdk.sino.auth</font>

## 5.1 函数

**<font size='3'>getToken</font>**

- **参数：**
  
    - ```{String} path 授权组件的绝对路径```
    - ```{Object} opt 授权组件配置```
    - ```{Object} events 事件```
- **返回值：**
  <font size='3' color='#3c3c3c'>[Promise] 授权组件加载完成后resolve</font>
- **用法：**
  获取授权token


# 五、 渠道定制
*注：3.1节和5.1节中的函数均可对渠道进行定制，这属于sdk内部实现，接入方无需关注。*
<br/>
实现方式说明：
1. 在src/modules/sino/channelAdapter目录下新增[渠道名.js]文件
2. 上述js中export channelIds对象: 该对象指明了本渠道对应各环境的channelId（各个渠道的channelId不可重复）
3. 上述js中export adapter对象，且adapter需extend baseAdapter(import ../base/index.js)。 
4. adapter中实现需要定制的函数。注意： 函数名需和目标函数保持一致
5. adapter中的函数除了原本的参数外，在最后面新增了一个proceed参数。举例：
```javascript
//原函数
open(url){
    ...//原实现逻辑
}
//定制函数
//proceed表示本函数执行完后，继续执行原函数。如果不执行proceed，则原函数会被完全覆盖，不再执行
open(url, proceed){
    ...//新逻辑
    proceed();//表示继续执行原函数
}
```  