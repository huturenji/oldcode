##安装依赖
pip install pyinstaller
pip install openpyxl
pip install pyyaml
pip install jsonpath
pip install ddddocr
pip install tk


##设置打包变量
修改sepc文件中datas，将python安装路径下的ddddocr\\common_old.onnx复制到当前运行环境的ddddcor目录下
例如，python安装路径为C:\Users\Administrator\AppData\Local\Programs\Python\Python39\python.exe
则datas修改如下
datas=[('C:\\Users\\Administrator\\AppData\Local\\Programs\\Python\\Python39\\Lib\\site-packages\ddddocr\\common_old.onnx','ddddocr')]
修改spec文件后使用命令打包exe文件
pyinstaller index.spec
参考资料https://zhuanlan.zhihu.com/p/456894600

##打包exe文件命令
pyinstaller generate.spec

##其他打包exe命令
pyinstaller -F main.py -n generate
运行该命令后generate.spec会被还原，使用pyinstaller generate.spec打包

##报错
打包过程中报错找不到common.xxx 模块解决方法
将common文件夹设置为源码
参考资料：https://blog.csdn.net/weixin_61745097/article/details/128111047

##代码目录结构
generate
│  generate.iml
│  README.md
│  requirements.txt
│  setup.py
│
├─bin
│      generate.exe      打包生成的exe文件
│
├─docs
│      config.ini        配置文件
│
├─scripts
│      generate.spec
│      spec.bat          生成generate.spec文件
│      start.bat         打包入口命令
│
└─source
    │  main.py          程序入口
    │  search.py        装修数据查询
    │  update.py        装修数据导入
    │
    └─common
            auth.py      授权，通过用户名密码授权
            cleansing.py 数据清洗
            config.py    读取配置文件
            vcode.py     解析图形验证码


    
