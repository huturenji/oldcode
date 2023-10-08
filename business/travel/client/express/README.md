1. 安装webpack
  npm install webpack -g
2. 安装依赖包
  在源码目录下执行命令 npm install, 然后提交svn的时候要忽略node_modules
3. 程序运行
     (0) . 运行npm run dll 打包依赖的lib与vendor
    （1）. 运行命令 npm run dev 本地跑项目 默认为localhost:8080
    （2）. 运行命令 npm run build, 在dist文件夹下生成文件
    （3）. 不同环境使用不同的build命令即可，例如黑盒：buildBlack
4. 开发环境下要注意以下几点
    1. /src下是所有的源码
    2. /build和/confing是打包依赖的配置
    3. /src/thirdparty 依赖的第三方包
    4. 所有样式用less编写
5. 项目代码会部署到服务端的static下面

6. 直接使用npm会比较慢，可以使用cnpm的镜像 npm install -g cnpm --registry=https://registry.npm.taobao.org