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

package ui;

import java.awt.Dimension;
import java.awt.FlowLayout;
import javax.swing.Box;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.UIManager;
import javax.swing.UnsupportedLookAndFeelException;
import ui.content.ContentFactory;
import ui.menu.Menu;
import ui.menu.MenuBean;
import ui.menu.OnMenuItemClickListener;

/**
 * 类      名： Home<BR/>
 * 
 * 描      述： <BR/>
 * 
 * 创 建 人： ligu 李冠群<BR/>
 * 
 * 日     期： 2020年12月8日<BR/>
 */
public class UIWindow implements OnMenuItemClickListener {
    private JFrame mainWindow = null;
    private JPanel menuUI, contentUI;
    private Menu iMenu;
    private ContentFactory iContentFactory;
    private String windowTitle = "Bplus测试助手（PC版）";

    public UIWindow() {
        initComponents();
        loadPage();
    }

    /**
      * 函数名     ：initComponents<BR/>
      * 
      * 功能描述 ：初始化窗口UI组件<BR/>
      *  
      * 输入参数 ：<BR/>
      *        
      * 返回值     ：<BR/>
      *        void:<BR/>
      * 异 常        ：无<BR/>
      * 
      * 创建人     ：ligu 李冠群<BR/>
      * 
      * 日 期        ：2021年6月1日
      */
    private void initComponents() {
        this.iMenu = new Menu();
        this.iMenu.setiOnMenuItemClickListener(this);
        this.iContentFactory = new ContentFactory();
    }

    /**
      * 函数名     ：loadPage<BR/>
      * 
      * 功能描述 ：加载窗口主页面<BR/>
      *  
      * 输入参数 ：<BR/>
      *        
      * 返回值     ：<BR/>
      *        JFrame:<BR/>
      * 异 常        ：无<BR/>
      * 
      * 创建人     ：ligu 李冠群<BR/>
      * 
      * 日 期        ：2021年6月1日
      */
    private JFrame loadPage() {
        // 设置系统默认样式
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException
                | UnsupportedLookAndFeelException e) {
            e.printStackTrace();
        }
        mainWindow = new JFrame(windowTitle); // 创建一个JFrame对象
        mainWindow.setBounds(300, 150, 700, 400);
        mainWindow.setMinimumSize(new Dimension(700, 400));
        mainWindow.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JPanel mainPanel = new JPanel();// 创建JPanel容器,顶级容器
        mainPanel.setLayout(new FlowLayout(FlowLayout.LEFT));
        mainPanel.setBackground(UITools.CONTENT_BG);
        mainWindow.add(mainPanel);
        Box mainBoxLayout = Box.createHorizontalBox(); // 创建纵向Box容器,顶级容器
        mainPanel.add(mainBoxLayout);

        menuUI = new JPanel();
        menuUI.setBackground(UITools.MENU_BG);
        contentUI = new JPanel();
        contentUI.setBackground(UITools.CONTENT_BG);
        mainBoxLayout.add(menuUI);
        mainBoxLayout.add(contentUI);
        // 添加菜单栏
        menuUI.add(this.iMenu.getMenuCompRoot());
        // 默认加载菜单的第一项内容区
        contentUI.add(this.getContent(this.iMenu.getMenuBeanList().get(0).getKey()));
        mainWindow.setTitle(windowTitle + "->" + this.iMenu.getMenuBeanList().get(0).getTitle());
        // 设置窗口可见
        mainWindow.setVisible(true);

        return mainWindow;
    }

    /**
      * 函数名     ：getContent<BR/>
      * 
      * 功能描述 ：加载右边的内容区域<BR/>
      *  
      * 输入参数 ：<BR/>
      *        
      * 返回值     ：<BR/>
      *        Box:<BR/>
      * 异 常        ：无<BR/>
      * 
      * 创建人     ：ligu 李冠群<BR/>
      * 
      * 日 期        ：2021年6月1日
      */
    private Box getContent(String key) {
        return iContentFactory.getContent(key);
    }

    @Override
    public String OnMenuItemClick(MenuBean mb) {
        contentUI.removeAll();// 删除原有的内容页面
        contentUI.add(getContent(mb.getKey()));
        contentUI.updateUI();// 一定要更新UI
        mainWindow.setTitle(windowTitle + "->" + mb.getTitle());
        return null;
    }

}
