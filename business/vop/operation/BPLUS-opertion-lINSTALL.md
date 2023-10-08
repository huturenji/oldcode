本文档描述了服务的安装配置过程。 
 # 1. 下载 
 下载SWP-mall的静态资源安装包。例如：opertion-1.0.15 -uat+20200521.tar
  # 2. 部署 
   step1->如果是首次：在域名映射的server目录，新建operation目录。  如果是更新：删除operation目录原有的所有文件。 
   step2->将压缩包（例如opertion-1.0.15 -uat+20200522）移动到opertion目录。
   step3->解压缩tar包到当前文件夹。
 # 3.
  注意事项 部署后的项目访问地址规则如下：域名 + path（以SIT3为例） 
  https://bplussit3.sinosun.com:18480/mall/static/operation/operation/pages/welcome.html 
  等于 https://bplussit3.sinosun.com:18480/mall/static 加   operation/operation/pages/welcome.html