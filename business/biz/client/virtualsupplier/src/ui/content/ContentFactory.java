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

package ui.content;

import javax.swing.Box;
import ui.content.comp.ContentPushReport;
import ui.content.comp.ContentVPFlight;
import ui.content.comp.ContentVPTrain;
import ui.menu.Menu;

/**
 * 类      名： ConentFactory<BR/>
 * 
 * 描      述： 右侧内容区工厂，专门生产各种内容区组件<BR/>
 * 
 * 创 建 人： ligu 李冠群<BR/>
 * 
 * 日     期： 2021年5月14日<BR/>
 */
public class ContentFactory {
    private Box iConetnt;

    public Box getContent(String key) {
        if (key != null && key != "" && Menu.MENUKEY_PUSHREPORT.equals(key)) {
            iConetnt = new ContentPushReport().buildContent();
        } else if (key != null && key != "" && Menu.MENUKEY_VPFLIGHT.equals(key)) {
            iConetnt = new ContentVPFlight().buildContent();
        } else if (key != null && key != "" && Menu.MENUKEY_VPTRAIN.equals(key)) {
            iConetnt = new ContentVPTrain().buildContent();
        } else {
            iConetnt = null;
        }
        return iConetnt;
    }

}
