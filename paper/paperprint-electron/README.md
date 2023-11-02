
是一个基于electron框架的，通过opencv调用USBCamera 代码暂存在这里

```
jdreptilejdreptilejdreptilejdreptile
    |--src
        |--main.js       // electron的主进程入口js，在package.json中指定
    |--package.json      // 应用信息
```
#### 开发、打包
* 根据需要修改依赖镜像地址，如（私库地址）：npm config set registry=http://10.0.5.26:8081/repository/sinosun-front-npm-group/
* 根据需要修改electron镜像地址，如：npm config set electron_mirror=https://mirrors.huaweicloud.com/electron/
* 修改src/pack/config.js中的weboa入口html配置项
* 安装依赖： npm i
* 本地运行： npm run start:dev (dev/sit/uat/pro)
* 打包package：npm run build:dev (dev/sit/uat/pro)

> 打包设置参考：
    https://electron.github.io/electron-packager/main/interfaces/electronpackager.options.html
    https://www.electronforge.io/cli#commands

#### 常见问题：
 ***npm run 报错： Electron Forge requires Node.js >= 14.17.5***
`nodejs 版本需要 >= 14.17.5， 可以用nvm进行node版本管理`
由于使用到了electron工具，在install 依赖时，很可能electron依赖库因为网络原因拉不下来，可配置镜像源: 
    打开 `~/.npmrc`文件，添加 `"electron_mirror=https://mirrors.huaweicloud.com/electron/"`