一、项目说明

1. 商旅运营管理（travelmanagement），商旅运营管理后台，包含 订单中心、渠道配置、告警服务、供应商配置。
2. 需要添加git子模块build和DMT。

二、项目安装

1. 安装webpack
  npm install webpack -g
2. 安装依赖包
  在源码目录下执行命令 npm install, 然后提交svn的时候要忽略node_modules
3. 程序运行
     (0) . 运行npm run dll 打包依赖的lib与vendor
    （1）. 运行命令 npm run dev 本地跑项目 默认为localhost:8080
    （2）. 运行命令 npm run build -- 2.3.1(版本号) prod（后缀） , 在dist文件夹下生成文件。目前不区分 开发 黑盒等环境，因为项目不依赖跟环境相关的配置了。
    （3）.build相关命令说明：
    BP_ENV 一个环境变量，用于HTML引用的变量HtmlWebpackPlugin，没用到不用关心。
    HTML_ENV指定打包的HTML，对于项目有多个单页应用，可以指定这个变量，打包某个单页应用。
    BP_PREHTML在HTML文件加一层目录，不加的话，HTML会达到dist的根目录。
    BP_APPNAME 指定后，打包后会在dist目录下多一层目录，不加的话会默认平铺到dist目录下。build命令必须加，因为CI打包规范必须这样。
4. 开发环境下要注意以下几点
    1. /src下是所有的源码
    2. /build和/confing是打包依赖的配置
    3. /src/thirdparty 依赖的第三方包
    4. 所有样式用less编写
5. 项目代码会部署到服务端的static下面

6. 直接使用npm会比较慢，可以使用cnpm的镜像 npm install -g cnpm --registry=https://registry.npm.taobao.org

7. 运营管理程序运行
     (0) . 运行命令 npm run dev 本地跑项目 默认为localhost:8080/modules/homePage.html#/
    （1）. 运行命令 npm run buildTM, 在dist文件夹下生成文件
    （2）. 运行命令 npm run buildCustomFun, 生成运营管理的urlConfig文件、并且自动拷贝到dist目录下。
    （3）. 步骤1和2，不同环境使用不同的build命令即可，例如黑盒：buildBlack
8. 2020年7月份，商旅运营重构，因为前后端都部署到了同样的域名下，所以前端调用后端服务，可以直接使用window.origin获取域名。这样前端打包就不需要根据不同环境执行不同的命令了。配置文件urlConfig不再需要了。前端打包执行 npm run build之后，可以一个包发到底，从开发到生产。