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

package ui.content.comp;

import java.util.Vector;
import net.APIUtil;

/**
 * 类      名： ContentBox<BR/>
 * 
 * 描      述： <BR/>
 * 
 * 创 建 人： ligu 李冠群<BR/>
 * 
 * 日     期： 2021年5月14日<BR/>
 */
public abstract class ContentComp {
    private Vector<String> envList = new Vector<String>();
    private String evnVaule = null;
    private String channelId = null;
    private APIUtil apiUtil;

    /**
     * 初始化一些公共的数据
     */
    public ContentComp() {
        this.envList.add("sit");
        this.envList.add("uat");
        this.evnVaule = this.envList.elementAt(0).toString();
        this.apiUtil = new APIUtil();
    }

    public Vector<String> getEnvList() {
        return envList;
    }

    public void setEnvList(Vector<String> envList) {
        this.envList = envList;
    }

    public String getEvnVaule() {
        return evnVaule;
    }

    public void setEvnVaule(String evnVaule) {
        this.evnVaule = evnVaule;
    }

    public String getChannelId() {
        return channelId;
    }

    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }

    public APIUtil getApiUtil() {
        return apiUtil;
    }

    public void setApiUtil(APIUtil apiUtil) {
        this.apiUtil = apiUtil;
    }

    public String getServer4Env() {
        if (this.getEvnVaule().equals("uat")) {
            return "https://bplus-uat.sinosun.com";
        } else {
            return "https://bplussit.sinosun.com:18380";
        }

    }

}
