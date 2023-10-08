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

package net;

import com.alibaba.fastjson.JSONObject;
import java.util.concurrent.TimeUnit;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;

/**
 * 类      名： APIUtil<BR/>
 * 
 * 描      述： <BR/>
 * 
 * 创 建 人： ligu 李冠群<BR/>
 * 
 * 日     期： 2018年6月1日<BR/>
 */
public class APIUtil {
    public static final String Client_ID = "1292d80187046d524e031098d24e7671_test";
    public static final String Client_Secret = "bc0755c253f9a190f28a468ba4a15a68";
    public static final String Sign_Key = "1b1aF4F0a72947376108";
    public static final String Phone = "11000009641";
    public static final String Company_ID = "2991516157909154950";

    public static final String API_PARAM_1 = "?";
    public static final String API_PARAM_2 = "&";
    public static final String API_PARAM_3 = "=";
    public static final String API_PARAM_CLIENT_ID = "client_id";
    public static final String API_PARAM_TICKET = "ticket";
    public static final String API_PARAM_DATA_ENCODE = "data_encode";
    public static final String API_PARAM_CLIENT_SECRET = "client_secret";
    public static final String API_PARAM_MASTER_PHONE = "master_phone";
    public static final String API_PARAM_PASSENGER_PHONE = "passenger_phone";
    public static final String API_PARAM_AUTH_TYPE = "auth_type";
    public static final String API_PARAM_ORDER_ID = "order_id";

    // 获取滴滴服务城市列表
    public static final String API_CITIES_GETALL = "https://api.es.xiaojukeji.com/webapp/cities/getAll";
    // Ticket申请接口
    public static final String API_TICKET_FETCH = "https://api.es.xiaojukeji.com/webapp/ticket/fetch";
    // WebApp调起
    public static final String API_WEBAPP_ENTRY = "https://open.es.xiaojukeji.com/webapp/entry";
    OkHttpClient client;

    public APIUtil() {
        client = new OkHttpClient().newBuilder().connectTimeout(50000, TimeUnit.MILLISECONDS)
                .readTimeout(50000, TimeUnit.MILLISECONDS)
                .build();
    }

    public String getWebAppUrl(String ticket) {
        return API_WEBAPP_ENTRY + API_PARAM_1 + API_PARAM_CLIENT_ID + API_PARAM_3 + Client_ID + API_PARAM_2
                + API_PARAM_TICKET + API_PARAM_3 + ticket;
    }

    /**
      * 函数名     ：sendGetRequestAsync<BR/>
      * 
      * 功能描述 ：发送GET异步请求<BR/>
      *  
      * 输入参数 ：<BR/>
      *        
      * 返回值     ：<BR/>
      *        int:<BR/>
      * 异 常        ：无<BR/>
      * 
      * 创建人     ：ligu 李冠群<BR/>
      * 
      * 日 期        ：2018年6月4日
      */
    public int sendGetRequestAsync(String url, Callback requestCallback) {
        if (client == null) {
            return -1;
        } else {
            Request request = new Request.Builder().url(url).build();
            client.newCall(request).enqueue(requestCallback);
            return 1;
        }
    }

    public int sendPostDataAsync(String url, JSONObject json, Callback requestCallback) {
        if (client == null) {
            return -1;
        } else {
            // 创建一个RequestBody(参数1：数据类型 参数2传递的json串)
            RequestBody requestBody = RequestBody.create(MediaType
                    .parse("application/json"), json.toJSONString());
            // 创建Request 对象。
            Request request = new Request.Builder().url(url).post(requestBody)
                    .addHeader("content-type", "application/json").build();
            client.newCall(request).enqueue(requestCallback);// 回调方法的使用与get异步请求相同，此时略。
            return 1;
        }
    }

}
