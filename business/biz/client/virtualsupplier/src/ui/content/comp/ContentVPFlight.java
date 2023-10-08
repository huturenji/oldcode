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

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.swing.JTextField;
import net.bean.SetVPOrderRequest;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

/**
 * 类      名： ContentVPFlight<BR/>
 * 
 * 描      述： <BR/>虚拟供应商基类。商旅测试工具，可以配置虚拟供应商的一些参数，比如 自动、手动出票等等
 * 
 * 创 建 人： ligu 李冠群<BR/>
 * 
 * 日     期： 2021年5月14日<BR/>
 */
public class ContentVPFlight extends ContentVPBase {
    private JSONObject orderDetailResult;// 网络获取的订单详情
    private Map<String, String> orderStatusMap = new HashMap<String, String>();// 订单状态对照表

    public ContentVPFlight() {
        super("ORDER_TYPE_FLIGHT");

        this.orderStatusMap.put("UNPAID", "待支付");
        this.orderStatusMap.put("ALREADY_PAID", "已支付");
        this.orderStatusMap.put("ALREADY_CANCEL", "已取消");
        this.orderStatusMap.put("PARTIAL_ALREADY_REFUND", "已出票");
        this.orderStatusMap.put("ALREADY_REFUND", "已退票");
        this.orderStatusMap.put("ALREADY_OUT_TICKET", "已出票");
        this.orderStatusMap.put("FAILED_OUT_TICKET", "出票失败");
        this.orderStatusMap.put("ALREADY_INVOICE", "已开发票");
        this.orderStatusMap.put("UNKNOWN", "已支付");
    }

    /**
     * 获取当前的供应商出票状态
     * */
    public void getVPOrderDetail(JTextField jta) {
        if (jta.getText() == null) {
            return;
        }
        String url = this.getServer4Env() + "/travel/flight/v1/getVirtualProviderOrderDetail";

        String reqUrl = url + "?supplierOrderNo=" + jta.getText();
        getLoadingText().setText("发送请求中");
        this.getApiUtil().sendGetRequestAsync(reqUrl, new Callback() {

            @Override
            public void onResponse(Call arg0, Response arg1) throws IOException {
                // TODO Auto-generated method stub
                String ewsponse = arg1.body().string();
                System.out.println(ewsponse);
                JSONObject jsonRes = JSONObject.parseObject(ewsponse);
                getLoadingText().setText("请求结结果：" + jsonRes.getString("resultMessage"));
                if (0 == jsonRes.getInteger("resultCode")) {
                    orderDetailResult = jsonRes.getJSONObject("result");
                    // 更新订单的操作权限列表
                    JSONArray orderTicketActions = orderDetailResult.getJSONArray("orderTicketActions");
                    if (orderTicketActions != null && !orderTicketActions.isEmpty()) {
                        getOrderOperationlist().clear();
                        for (int i = 0; i < orderTicketActions.size(); i++) {
                            getOrderOperationlist().add(orderTicketActions.getString(i));
                        }
                    }
                    JSONObject orderDetail = orderDetailResult.getJSONObject("orderDetail");
                    if (getOrderDetailLabel() != null && orderDetail != null) {
                        getOrderDetailLabel().setText(getOrderDetailText(orderDetail));
                    }
                }
            }

            @Override
            public void onFailure(Call arg0, IOException arg1) {
                // TODO Auto-generated method stub
                System.out.println(arg1.toString());
                getLoadingText().setText("请求结果" + arg1.toString());
            }
        });
    }

    /**
      * 函数名     ：getOrderDetailText<BR/>
      * 
      * 功能描述 ：函数功能<BR/>
      *  
      * 输入参数 ：<BR/>
      *        
      * 返回值     ：<BR/>
      *        String:<BR/>
      * 异 常        ：无<BR/>
      * 
      * 创建人     ：ligu 李冠群<BR/>
      * 
      * 日 期        ：2021年5月31日
      */
    protected String getOrderDetailText(JSONObject orderDetail) {
        String result = "<html><body>订单状态:" + getOrderStatusText(orderDetail) + ";支付方式："
                + orderDetail.getJSONObject("orderBase").getString("payName") + ";预订人:"
                + orderDetail.getJSONObject("orderBase").getString("contactName") + ";预订日期:"
                + orderDetail.getJSONObject("orderBase").getString("orderTime") + ";渠道:"
                + orderDetail.getJSONObject("orderBase").getJSONObject("founderInfo").getString("channelName") + ";企业:"
                + orderDetail.getJSONObject("orderBase").getJSONObject("founderInfo").getString("companyName") + "<br>";
        JSONArray airlines = orderDetail.getJSONArray("airLines");
        for (int i = 0; i < airlines.size(); i++) {
            JSONObject item = airlines.getJSONObject(i);
            result += "航班：" + item.getString("sCityName") + "至" + item.getString("eCityName")
                    + item.getString("airLineName") + item.getString("flightNo") + item.getString("cabinName")
                    + item.getString("sAirportName") + item.getString("beginDate") + item.getString("beginTime") + "到"
                    + item.getString("eAirportName") + item.getString("arriveDate") + item.getString("arriveTime")
                    + "<br>";
            JSONArray passengers = item.getJSONArray("passengers");
            for (int j = 0; j < passengers.size(); j++) {
                result += "乘客：" + passengers.getJSONObject(j).getString("psgName")
                        + passengers.getJSONObject(j).getString("psgId") + "<br>";
            }
        }
        result += "<body></html>";
        return result;
    }

    /**
      * 函数名     ：getOrderStatusText<BR/>
      * 
      * 功能描述 ：函数功能<BR/>
      *  
      * 输入参数 ：<BR/>
      *        
      * 返回值     ：<BR/>
      *        String:<BR/>
      * 异 常        ：无<BR/>
      * 
      * 创建人     ：ligu 李冠群<BR/>
      * 
      * 日 期        ：2021年5月31日
      */
    protected String getOrderStatusText(JSONObject orderDetail) {
        String orderStatus = orderDetail.getJSONObject("orderBase").getString("orderStatus");
        Boolean hasChangeOrder = orderDetail.getJSONObject("orderBase").getBoolean("hasChangeOrder");
        Boolean hasRefundOrder = orderDetail.getJSONObject("orderBase").getBoolean("hasRefundOrder");
        String result = orderStatusMap.get(orderStatus);
        if (hasChangeOrder && hasRefundOrder) {
            result += "(有退改)";
        } else if (hasChangeOrder && !hasRefundOrder) {
            result += "(有改签)";
        } else if (!hasChangeOrder && hasRefundOrder) {
            result += "(有退票)";
        }

        return result;
    }

    public void updateVPOrderState() {
        if (getSelectOrderOperation() == null) {
            return;
        }
        String url = this.getServer4Env() + "/travel/flight/v1/updateVirtualProviderOrderState";

        SetVPOrderRequest rb = new SetVPOrderRequest();
        rb.setSupplierOrderNo(orderDetailResult.getJSONObject("orderDetail").getJSONObject("orderBase").getString("providerOrderNo"));
        rb.setTicketAction(getSelectOrderOperation());

        getLoadingText().setText("发送请求中");
        this.getApiUtil().sendPostDataAsync(url, (JSONObject) JSONObject.toJSON(rb), new Callback() {

            @Override
            public void onResponse(Call arg0, Response arg1) throws IOException {
                String ewsponse = arg1.body().string();
                System.out.println(ewsponse);
                getLoadingText().setText("请求结果" + ewsponse);
            }

            @Override
            public void onFailure(Call arg0, IOException arg1) {
                System.out.println(arg1.toString());
                getLoadingText().setText("请求结果" + arg1.toString());
            }
        });
    }
}
