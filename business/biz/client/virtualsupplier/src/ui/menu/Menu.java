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

package ui.menu;

import java.awt.FlowLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import javax.swing.Box;
import javax.swing.JButton;
import javax.swing.JPanel;
import ui.UITools;

/**
 * 类      名： Menu<BR/>
 * 
 * 描      述： <BR/>
 * 
 * 创 建 人： ligu 李冠群<BR/>
 * 
 * 日     期： 2020年12月8日<BR/>
 */
public class Menu {
    public static String MENUKEY_PUSHREPORT = "pushReport";
    public static String MENUKEY_VPFLIGHT = "vpFlight";
    public static String MENUKEY_VPTRAIN = "vpTrain";

    // 所有的菜单项数据源
    private ArrayList<MenuBean> menuBeanList = new ArrayList<MenuBean>();
    private OnMenuItemClickListener iOnMenuItemClickListener;
    private Box menuCompRoot;

    public Menu() {
        initDatas();
        loadMenuUI();
    }

    public ArrayList<MenuBean> getMenuBeanList() {
        return menuBeanList;
    }

    public OnMenuItemClickListener getiOnMenuItemClickListener() {
        return iOnMenuItemClickListener;
    }

    public void setiOnMenuItemClickListener(OnMenuItemClickListener iOnMenuItemClickListener) {
        this.iOnMenuItemClickListener = iOnMenuItemClickListener;
    }

    public Box getMenuCompRoot() {
        return menuCompRoot;
    }

    private void initDatas() {
        this.menuBeanList.add(new MenuBean(MENUKEY_PUSHREPORT, "推送财务报表", null));
        this.menuBeanList.add(new MenuBean(MENUKEY_VPFLIGHT, "机票虚拟供应商", null));
        this.menuBeanList.add(new MenuBean(MENUKEY_VPTRAIN, "火车票虚拟供应商", null));
    }

    private void loadMenuUI() {
        menuCompRoot = Box.createVerticalBox(); // 创建纵向Box容器,菜单容器

        for (int i = 0; i < this.menuBeanList.size(); i++) {
            JPanel munuItemLayout = new JPanel();
            munuItemLayout.setBackground(UITools.MENU_BG);
            munuItemLayout.setLayout(new FlowLayout(FlowLayout.LEFT));
            final MenuBean munuItem = this.menuBeanList.get(i);
            JButton btn = new JButton(munuItem.getTitle()); // 创建JButton对象
            btn.addActionListener(new ActionListener() {

                @Override
                public void actionPerformed(ActionEvent e) {
                    if (iOnMenuItemClickListener != null) {
                        iOnMenuItemClickListener.OnMenuItemClick(munuItem);
                    }
                }
            });
            btn.setMargin(new Insets(3, 10, 3, 10));
            munuItemLayout.add(btn);

            menuCompRoot.add(munuItemLayout);
        }
    }

}
