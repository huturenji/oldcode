# build

前端公共打包命令
#1 文件目录
config
    --dev.env.js  ##开发环境变量
    --index.js    ##打包命令的配置变量
    --prod.env.js ##生产环境变量
    --sets.env.js ##服务请求地址，以及小应用跳转地址
build.js ##npm build方法入口
check-version.js ##检查node与webpack版本
multi-entry.js ##入口js，在webpack.base.conf.js使用
multi-html.js  ##入口html，在webpack.base.conf.js使用
utils.js       ##方法集合
vue-loader.conf.js  ##vue loader
webpack.base.conf.js ##打包基础文件
webpack.dev.conf.js ##开发环境打包命令
webpack.dll.conf.js ##dll打包
webpack.prod.conf.js ##生产环境打包命令
webpack.comp.globaljs.conf.js  ##将多个js文件打包为单独js文件
webpack.comp.vue.example.index.js ##将vue文件打包为js文件，入口js
webpack.comp.vue.example.js ##将vue文件打包为js文件

在package.json中配置如下命令（以酒店为例）：
  "scripts": {
    "dev": "cross-env BP_ENV=Dev BP_PREHTML=modules webpack-dev-server  --inline --progress --config hotelBuild/webpack.dev.conf.js",
    "build": "cross-env BP_ENV=Dev BP_APPNAME=SWP-Hotel BP_PREHTML=modules BP_VERSION=2.0.1 node hotelBuild/build.js",
    "buildSprite": "webpack --config build/webpack.sprite.conf.js -w ",
    "dll": "webpack --config build/webpack.dll.config.js -w",
    "buildcompvue":"webpack --config build/webpack.comp.vue.example.conf.js -w",
    "buildcompjs":"webpack --config build/webpack.comp.globaljs.conf.js -w"
  },
 
#2 npm run dev 运行的是webpack.dev.conf.js ,webpack.dev.conf.js依赖webpack.base.conf.js 。其中的配置为config文件下index.js中的dev配置。依赖调用路径如下：
    webpack.dev.conf.js-->webpack.base.conf.js-->(multi-entry.js、multi-html.js、vue-loader.conf.js)

#3 npm run build运行的是build.js，build.js依赖webpack.prod.conf.js webpack.prod.conf.js依赖webpack.base.conf.js。其中的配置为config文件下index.js中的prod配置。依赖调用路径如下：
    build.js-->utils(buildWebpack)-->webpack.prod.conf.js-->(check-version.js、webpack.base.conf.js)

#4 npm run dll运行的是webpack.dll.conf.js

#5 npm run buildcomp运行的是webpack.comp.vue.example.js，具体的vue文件需要根据实际情况填写,该命令依赖webpack.prod.conf.js

#6 npm run buildcompjs运行的是ebpack.comp.globaljs.conf.js

#7 npm run buildSprite 运行的是webpack.sprite.conf.js，在运行该命令时，如果出现ERROR in Entry module not found: Error: Can't resolve 'index.js' in 'D:\git\bplus\travel\frontend-client\hotel'的错误，可以不用理会，该错误原因是因为打包命令中的入口entry没有找到，可以通过修改entry为真实js路径消除该错误
    其中：jsonFilePath、cwdPath、globFormat、targetImg、targetCssPath、cssImageRef等参数在打包过程中，根据业务的实际需求进行修改