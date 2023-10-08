# 使用说明

##特殊说明
当前是2.x版本，使用exchange token方案获取token

## 1. 前置条件
    a. 必须有一个pdfView包，这是pdfjs的官方demo包，授权组件必须依赖这个包来预览授权协议的pdf文件。
    b. 必须有一个keycloak.sino.js文件。该文件对官方的keycloak.js文件做了扩展，来适配当前的授权流程。
    
## 2. 安装说明 
    a. 引用swp-serviceAuth.js文件，得到一个全局对象swpServiceAuth
    b. 执行函数swpServiceAuth.install([config][, options])。此时授权组件安装成功
    c. install函数返回了一个对象，该对象提供了一个authInterceptor函数。 使用authInterceptor拦截所有的请求。（具体使用方式在下面说明）

## 3. API

### install([config] [, options]): Object 

**【参数】**

**config**

可以是字符串或对象。如果是字符串，则表示一个json类型的文件路径，json内的配置如下；如果是对象，则可配置属性同下：

* `【必填】loginKcConfig：String/Object` 如果是字符串，表示keycloak.json的路径；如果是对象，则需提供keycloak登陆所需的配置。配置如下：

> auth-server-url：keycloak服务器地址;
> realm： 域的名称;
> resource： 客户端id，即clientId;

* `resourceProtectKcConfig:` 静态资源保护的配置。如果是字符串，表示一个json文件的路径；如果是对象，则需提供静态资源保护所需的配置。配置如下：

> auth-server-url：keycloak服务器地址;
> realm： 域的名称;
> resource： 客户端id，即clientId;
> clientSecret: 客户端的密码，开启confidential模式时才有;

* `enableAuthorize：Boolean`是否开启授权
* `enanbleResourceProtect: Boolean` 是否开启静态资源保护
* `urlWhiteList: Array<String>` （白名单）不会进行授权流程的URL地址
* `apiWhiteList: Array<String>` （白名单）不会被授权流程打断的接口请求路径
* `productName: String` 产品名称，建议填写
* `customerServicePhone: String` 客服电话，默认值："400-855-6588"
* `userInfoParams: Array` 用户属性名称，比如userId，companyId，channelId等。一般不需要填写，但如果业务侧的userId等字段名称和默认值不同的情况下，可以通过这个属性来修改本组件中使用的字段名。默认值：['userId','companyId','channelId']
* `kcAdapterUrl: String` keycloakAdapter的路径，默认是本组件的同级目录下

*【关于json文件的说明】
auth-server-url：keycloak服务器地址,
realm： 域的名称,
resource： 客户端id，即clientId，
clientSecret: 客户端的密码，开启confidential模式时才有

*【关于config对象的说明】
url：keycloak服务器地址,
realm： 域的名称,
clientId： 客户端id
clientSecret: 客户端的密码，开启confidential模式时才有


**options**

* `onInitialized: Function` 授权流程初始化完成事件
* `onAuthorized: Function` 授权完成事件

**【返回值】**

* `$instance: VueComponent` 授权组件的vue实例
* `authInterceptor([param][, apiUrl]): Function` 授权拦截器，返回一个Promise对象。该拦截器在授权完成后才会reslove。 在需要等待授权完成后才执行的逻辑中，可加上该函数进行拦截。

> * `param: Object` 需要被替换的对象。授权完成后，会将该对象中的用户信息（字段名称使用config.userInfoParams)进行替换。比如授权之前param.userId是null，则授权完成后，该函数会将param.userId替换成登陆后的userId。
> * `apiUrl: String` 接口路径，如果该路径在apiWhiteList中，则不会被拦截

* `isAuthorized: Function` 返回授权是否已完成
* `IDENTITY: Object` 用户身份枚举
* `getIdentity: Function` 返回当前登陆用户的身份