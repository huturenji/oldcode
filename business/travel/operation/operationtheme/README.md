## keycloak登录页主题地定制 注意事项
1、主题包本地启动
    下载安装 Keycloak，这里以 win64 系统为例，Keycloak 官网下载地址：https://www.keycloak.org/downloads

    将operationtheme文件夹放在keycloak安装目录下的 themes 路径下;

    本示例下载 keycloak-4.0.0.Final.zip，需求的 Java 版本为 JDK 1.8及以上。下载完成后，解压缩文件，双击运行 keycloak-4.0.0.Final/bin 目录下的 standalone.bat 文件，启动 Keycloak。

    Keycloak 的本地访问地址为：http://localhost:8080/auth/，访问该地址，点击页面中的“Administration Console“，创建 Keycloak 的管理员账户，该账户用于在 Keycloak 中进行配置，管理用户、角色等。

    进入keycloak管理控制台，选择要配置主题的 Realm，进入Realm 设置页面，选择 Themes 选项卡,登录主题下拉选择框中选择 operationtheme，点击保存退出登录即是该登录主题页面;

    调试时不开启主题缓存(禁用主题缓存后，修改主题资源后，不需要重启keycloak，即可实时生效)：
        禁用主题缓存方法：
        找到 standalone.xml 文件，找到 cacheThemes、cacheTemplate部分，配置如下：
         <theme>
            <staticMaxAge>-1</staticMaxAge>
            <cacheThemes>false</cacheThemes>
            <cacheTemplates>false</cacheTemplates>
            ...
        </theme>


2、样式修改
    login文件夹下template.ftl文件为登录页面静态html模板，login.ftl文件为登录框静态html模板，需要修改页面布局时，可以再这两个文件中进行修改，messages文件夹下两个文件为中英文国际化，登录页面中有部分应用到了，需要改页面文字显示可以使用变量国际化也可以直接在页面中写定值（登陆主题页面暂只用中文），页面样式请在login/resources/css/mythemeLogin.css 文件中写，图片资源在login/resources/img/ 中，修改完样式页面刷新即可显示修改后的样式


3、主题包部署
    压缩成zip，由运维同事部署
