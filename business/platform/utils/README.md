<!--
 * @Author: your name
 * @Date: 2020-10-19 10:49:06
 * @LastEditTime: 2020-11-13 14:17:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \utils\README.md
-->
# H5工具类utils目录
utils
├─ .babelrc
├─ .babelrc.js
├─ .editorconfig
├─ .git
├─ .gitignore
├─ build
│  └─ webpack.comp.globaljs.conf.js   ##打包命令
├─ package.json
├─ README.md
├─ src
│  ├─ base64
│  │  └─ index.js   ##base64核心代码
│  ├─ encrypt
│  │  ├─ crypt
│  │  │  ├─ md5.js  ##md5加密算法
│  │  │  └─ sha1.js ##sha加密算法
│  │  └─ index.js  ##索引页
│  ├─ enum
│  │  ├─ errorcode-enum.js   ##错误码枚举
│  │  └─ index.js   ##索引页
│  ├─ filter
│  │  ├─ errorcode-interceptor.js  ##错误码拦截器
│  │  └─ index.js    ##索引页
│  ├─ http
│  │  └─ index.js ##http请求核心代码
│  ├─ index.js    #######打包入口文件#####
│  ├─ jsbridge
│  │  ├─ bridge-core.js   ##jsbridge方法  输出核心方法：callHandler、 registerHandler 
│  │  ├─ bridge-fun.js    ##jsbridge方法  引入核心方法callHandler、 registerHandler，输出方法：callHandler、 registerHandler ; 页面相关方法goBackPage、 openPage 、locationPage;CommonDialogFunction  callNativeTel 公共方法
│  │  ├─ bridge-menu.js   ##浏览器注册menu
│  │  ├─ core
│  │  │  ├─ mpaas.js  ##mpaas中jsbridge代码
│  │  │  ├─ sino.js   ##sino中jsbridge代码
│  │  │  └─ tmf.js    ##tmf中jsbridge代码
│  │  └─ index.js     ##索引页
│  ├─ proxy
│  │  ├─ index.js
│  │  ├─ router-proxy.js  ##路由代理
│  │  └─ url-proxy.js     ##url代理
│  ├─ tools
│  │  ├─ direction.js     ##页面前进后退判断
│  │  ├─ extend.js        ##扩展方法
│  │  ├─ index.js         ##索引页
│  │  ├─ pop-state-manager.js  ##pop管理
│  │  └─ validator.js   ##校验类
│  └─ websocket
│     └─ index.js     ##websocket核心代码，监听服务端
└─ tsconfig.json       ##ts相关配置

# 打包单独js入口
## package.json命令
    "scripts": {
        "build": "cross-env BP_ENV=Production BP_ENTRY=index webpack --config build/webpack.comp.globaljs.conf.js -w",
        "buildextend": "cross-env BP_ENV=Production BP_ENTRY=extend webpack --config build/webpack.comp.globaljs.conf.js -w",
        "buildjsbridge": "cross-env BP_ENV=Production BP_ENTRY=jsBridge webpack --config build/webpack.comp.globaljs.conf.js -w"
    },
其中BP_ENTRY=XXX,是配置打包的入口文件，该参数在webpack.comp.globaljs.conf.js中entryMap中使用
## webpack.comp.globaljs.conf.js
    let entryMap = {
        'index':{
            entry:'./src/index.js',
            filename:'swp-utils.js',
            library:'SnUtils'
        },
        'extend':{
            entry:'./src/tools/extend.js',
            filename:'swp-utils.js',
            library:'SnUtils'
        },
        'SnJsBridge':{
            entry:'./src/jsbridge/bridge-fun.js',
            filename:'swp-jsbridge.js',
            library:'SnJsBridge'
        },
        'pop':{
            entry:'./src/tools/pop-state-manager.js',
            filename:'swp-popmgr.js',
            library:'SnPopStateMgr'
        }
    }
    例如：BP_ENTRY=index，则入口文件为'./src/index.js'
