功能：
集成AH100sdk打包为node
依赖：
本地安装npm包node-addon-api@2.0.2
打包命令：
npx node-gyp configure build
打包配置文件：
binding.gyp
函数入口：
main.cpp


在打包时，可能因为build文件被占用或者损坏需要将build文件删除
1、手动删除 
直接将生成的build文件夹删除
2、自动删除
2.1 安装依赖包
npm i -g concurrently
npm i -g rimraf
2.2 命令上删除并且打包,打包完成后将node文件copy到相应的路径
concurrently -r "npx rimraf build" "npx node-gyp configure build && copy_node.bat"


 "defines": [ "_DLL", "_MT" ],  // 设置多线程DLL（MD）模式