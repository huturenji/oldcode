package app;

import ui.UIWindow;

/**********************************************************************************************************
 * Copyright (C) 2016 SINOSUN Co.Ltd. All rights reserved.
 * 版权所有 (C) 2016 兆日科技有限公司. 保留所有权利.
 * 
 * 本软件/源代码受中华人民共和国著作权法保护，除非法律允许或兆日科技书面许可，不得从事下列行为：
 * 1、删除本软件/源代码及其副本上关于著作权的信息
 * 2、对本软件进行反向工程、反向汇编、反向编译，或者以其他方式尝试发现本软件的源代码
 * 3、对本软件/源代码进行：使用、出租、出借、复制、修改、链接、转载、汇编、发表、出版、传播、建立镜像站点等
 * 4、其他未经兆日科技明示授权的行为
 ***********************************************************************************************************/


/**
 * 类      名： Application<BR/>
 * 
 * 描      述： <BR/>这是客户端的首页，一个列表 展示所有的 业务需求
 * 
 * 创 建 人： ligu 李冠群<BR/>
 * 
 * 日     期： 2020年12月8日<BR/>
 */
public class Application {
    private UIWindow iUIWindow;

    public Application() {
        this.iUIWindow = new UIWindow();
        System.out.println(this.iUIWindow);
    }

    public static void main(String[] agrs) {
        new Application();
    }
}
