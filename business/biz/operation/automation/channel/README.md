安装依赖
pip install pyinstaller
pip install openpyxl
pip install pyyaml
pip install jsonpath
pip install ddddocr
pip install tk


设置打包变量
修改sepc文件中datas，将python安装路径下的ddddocr\\common_old.onnx复制到当前运行环境的ddddcor目录下
例如，python安装路径为C:\Users\Administrator\AppData\Local\Programs\Python\Python39\python.exe
则datas修改如下
datas=[('C:\\Users\\Administrator\\AppData\Local\\Programs\\Python\\Python39\\Lib\\site-packages\ddddocr\\common_old.onnx','ddddocr')]
修改spec文件后使用命令打包exe文件
运行start.bat
参考资料https://zhuanlan.zhihu.com/p/456894600

打包exe文件命令
运行start.bat


打包过程中报错找不到common.xxx 模块解决方法
将common文件夹设置为源码
参考资料：https://blog.csdn.net/weixin_61745097/article/details/128111047

