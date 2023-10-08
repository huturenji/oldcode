一、项目说明
    1. 机票（flight），包含机票首页、机票列表、机票详情、机票下单等主要页面。
    2. 需要添加git子模块build和components。

二、项目安装
    1. 安装webpack（需先安装node环境）
        npm install webpack -g
        
    2. 安装依赖包
        在源码目录下执行命令 npm install, 然后提交svn/git的时候要忽略node_modules

    3. 程序运行
        （0）. 运行命令 npm run dev 本地跑项目 默认为localhost:8080，可在build/config/index.js里面进行配置，dev运行前还需要设置代理域名，在build/config/index.js里修改target
        （1）. 运行命令 npm run build, 在dist文件夹下生成文件
        （2）. 不同环境使用不同的build命令即可，例如黑盒：buildBlack，详见package.json

    4. 开发环境下要注意以下几点
        1. /src下是所有的源码
        2. /build是打包依赖的配置
        3. /src/thirdparty 依赖的第三方包
        4. 所有样式用less编写

    5. 项目代码会部署到服务端的static下面

    6. 直接使用npm会比较慢，可以使用cnpm的镜像 npm install -g cnpm --registry=https://registry.npm.taobao.org，如果引用了sinosun-ui则不能使用cnpm

    7. 如果项目比较大dev或build占用较多内存，可运行npm run fix-memory-limit命令将运行内存设置为4g