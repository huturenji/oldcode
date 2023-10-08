## 项目名称

中文名称：**运营平台

## 用兆日私仓镜像安装npm包

npm包设置兆日私仓镜像（意思和淘宝镜像类似），里面有我们公司自己的一些工具。如果不执行以下命令，是没法安装我们自己开发的工具的。

本项目使用了兆日工具包：BSL的加解密库。所以必须使用兆日仓库安装依赖。

#### 查看当前的npm的仓库地址配置，是否兆日私仓地址。

npm get registry

#### 全局设置：如下命令会修改电脑全局环境的npm仓库地址。

具体执行的命令为：

npm config set registry http://10.0.5.26:8081/repository/sinosun-front-npm-group/

npm install

#### 局部设置：如下命令会修改当前目录的npm仓库地址。

具体执行的命令为：

npm install --registry=http://10.0.5.26:8081/repository/sinosun-front-npm-group/

## 项目的本地调试

启动本地测试代码

npm run dev 

## 项目的部署和使用

npm run build