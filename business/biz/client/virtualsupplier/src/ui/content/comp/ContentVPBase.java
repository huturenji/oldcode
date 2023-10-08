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

import com.alibaba.fastjson.JSONObject;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.Window;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Vector;
import javax.swing.Box;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import net.bean.GetVPTypeRequest;
import net.bean.SetVPTypeRequest;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;
import ui.UITools;

/**
 * 类      名： ContentVPBase<BR/>
 * 
 * 描      述： <BR/>虚拟供应商基类。商旅测试工具，可以配置虚拟供应商的一些参数，比如 自动、手动出票等等
 * 
 * 创 建 人： ligu 李冠群<BR/>
 * 
 * 日     期： 2021年5月14日<BR/>
 */
public abstract class ContentVPBase extends ContentComp implements ContentBuilder {
    public static String ISSUETICKET_AUTO = "自动";
    public static String ISSUETICKET_MANUAL = "手动";
    public static String ISSUETICKET_UNKNOW = "未知";

    public static String ISSUETICKET_AUTO_KEY = "AUTO";
    public static String ISSUETICKET_MANUAL_KEY = "MANUAL";
    public static String ISSUETICKET_UNKNOW_KEY = "UNKNOW";

    private String orderType;
    private JTextArea loadingText;// 显示加载或进度的提示框
    private Vector<String> issueTicketTypes = new Vector<String>();// 更改出票方式下拉框数据源列表
    private String selectIssueType;// 用户选中的更改出票方式
    private JLabel issueTicketValue;// 出票方式结果、订单详情 展示
    private JLabel orderDetailLabel;// 出票方式结果、订单详情 展示
    private String netIssueType;// 网络获取的出票方式数据
    private Map<String, String> issueTypeMap = new HashMap<String, String>();// 出票方式的key\value对照
    private JPanel manualUI;// 手工模式UI布局
    private Vector<String> orderOperationlist = new Vector<String>();// 用户可操作性的订单状态
    private String selectOrderOperation;// 用户选择的操作列表

    public String getSelectOrderOperation() {
        return selectOrderOperation;
    }

    public void setSelectOrderOperation(String selectOrderOperation) {
        this.selectOrderOperation = selectOrderOperation;
    }

    public Vector<String> getOrderOperationlist() {
        return orderOperationlist;
    }

    public void setOrderOperationlist(Vector<String> orderOperationlist) {
        this.orderOperationlist = orderOperationlist;
    }

    public JLabel getOrderDetailLabel() {
        return orderDetailLabel;
    }

    public JPanel getManualUI() {
        return manualUI;
    }

    public String getNetIssueType() {
        return this.netIssueType;
    }

    public void setNetIssueType(String currentType) {
        this.netIssueType = currentType;
    }

    public String getSelectIssueType() {
        return selectIssueType;
    }

    public void setSelectIssueType(String selectType) {
        this.selectIssueType = selectType;
    }

    public JTextArea getLoadingText() {
        return loadingText;
    }

    public abstract void getVPOrderDetail(JTextField jta);

    public abstract void updateVPOrderState();

    public ContentVPBase(String orderType) {
        super();
        this.orderType = orderType;
        this.issueTicketTypes.add(ISSUETICKET_AUTO);
        this.issueTicketTypes.add(ISSUETICKET_MANUAL);
        this.setSelectIssueType(ISSUETICKET_AUTO);

        this.setNetIssueType(ISSUETICKET_UNKNOW_KEY);

        this.issueTypeMap.put(ISSUETICKET_AUTO_KEY, ISSUETICKET_AUTO);
        this.issueTypeMap.put(ISSUETICKET_MANUAL_KEY, ISSUETICKET_MANUAL);
        this.issueTypeMap.put(ISSUETICKET_UNKNOW_KEY, ISSUETICKET_UNKNOW);

    }

    @Override
    public Box buildContent() {
        Box VPContent = Box.createVerticalBox(); // 创建纵向Box容器,菜单容器
        VPContent.setSize(500, Window.HEIGHT);

        JPanel envSetPanel = new JPanel();
        envSetPanel.setLayout(new FlowLayout(FlowLayout.LEFT));
        envSetPanel.setBackground(UITools.CONTENT_BG);
        Box boxLin1 = Box.createHorizontalBox(); // 创建横向Box容器
        boxLin1.setBorder(new CompoundBorder(boxLin1.getBorder(), new EmptyBorder(10, 10, 10, 10)));
        envSetPanel.add(boxLin1);
        VPContent.add(envSetPanel);
        JLabel jl = new JLabel("请先选择环境sit或uat, 再执行出票设置等操作"); // 创建一个标签
        boxLin1.add(jl); // 将标签添加到面板

        JPanel boxLin5Root = new JPanel();
        boxLin5Root.setLayout(new FlowLayout(FlowLayout.LEFT));
        boxLin5Root.setBackground(UITools.CONTENT_BG);
        Box boxLin5 = Box.createHorizontalBox(); // 创建横向Box容器
        boxLin5.setBorder(new CompoundBorder(boxLin5.getBorder(), new EmptyBorder(10, 10, 10, 10)));
        boxLin5Root.add(boxLin5);
        VPContent.add(boxLin5Root);
        loadingText = new JTextArea("接口交互显示："); // 创建一个标签
        loadingText.setPreferredSize(new Dimension(450, 60));
        loadingText.setLineWrap(true); // 设置文本域中的文本为自动换行
        boxLin5.add(loadingText); // 将标签添加到面板

        JPanel boxLin2Root = new JPanel();
        boxLin2Root.setLayout(new FlowLayout(FlowLayout.LEFT));
        boxLin2Root.setBackground(UITools.CONTENT_BG);
        Box boxLin2 = Box.createHorizontalBox(); // 创建横向Box容器
        boxLin2.setBorder(new CompoundBorder(boxLin2.getBorder(), new EmptyBorder(10, 10, 10, 10)));
        boxLin2Root.add(boxLin2);
        VPContent.add(boxLin2Root);
        JLabel j2 = new JLabel("选择环境："); // 创建一个标签
        boxLin2.add(j2); // 将标签添加到面板
        JComboBox<String> cmb = new JComboBox<String>(this.getEnvList()); // 创建JComboBox
        cmb.setPreferredSize(new Dimension(450, 20));
        cmb.setForeground(Color.red);
        cmb.addItemListener(new ItemListener() {

            @Override
            public void itemStateChanged(ItemEvent e) {
                // 切换环境，要重新获取一下出票状态
                setEvnVaule(e.getItem().toString());
                getVirtualProviderTicketType();
            }
        });
        boxLin2.add(cmb); // 将标签添加到面板

        JPanel boxLincpfsRoot = new JPanel();
        boxLincpfsRoot.setLayout(new FlowLayout(FlowLayout.LEFT));
        boxLincpfsRoot.setBackground(UITools.CONTENT_BG);
        Box boxLincpfs = Box.createHorizontalBox(); // 创建横向Box容器
        boxLincpfs.setBorder(new CompoundBorder(boxLincpfs.getBorder(), new EmptyBorder(10, 10, 10, 10)));
        boxLincpfsRoot.add(boxLincpfs);
        VPContent.add(boxLincpfsRoot);
        JLabel jlcpfskey = new JLabel("出票方式："); // 创建一个标签
        boxLincpfs.add(jlcpfskey);
        issueTicketValue = new JLabel(ISSUETICKET_UNKNOW); // 创建一个标签
        boxLincpfs.add(issueTicketValue);

        JPanel boxLinchangeRoot = new JPanel();
        boxLinchangeRoot.setLayout(new FlowLayout(FlowLayout.LEFT));
        boxLinchangeRoot.setBackground(UITools.CONTENT_BG);
        Box boxLinchange = Box.createHorizontalBox(); // 创建横向Box容器
        boxLinchange.setBorder(new CompoundBorder(boxLinchange.getBorder(), new EmptyBorder(10, 10, 10, 10)));
        boxLinchangeRoot.add(boxLinchange);
        VPContent.add(boxLinchangeRoot);
        JLabel j21 = new JLabel("更改出票方式："); // 创建一个标签
        boxLinchange.add(j21); // 将标签添加到面板
        JComboBox<String> cmb1 = new JComboBox<String>(issueTicketTypes); // 创建JComboBox
        cmb1.setPreferredSize(new Dimension(450, 20));
        cmb1.setForeground(Color.red);
        cmb1.addItemListener(new ItemListener() {

            @Override
            public void itemStateChanged(ItemEvent e) {
                setSelectIssueType(e.getItem().toString());
            }
        });
        boxLinchange.add(cmb1); // 将标签添加到面板
        JButton btn1 = new JButton("确认"); // 创建JButton对象
        boxLinchange.add(btn1);

        btn1.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
                setVirtualProviderTicketType();
            }
        });

        manualUI = new JPanel();
        manualUI.setLayout(new FlowLayout(FlowLayout.LEFT));
        manualUI.setBackground(UITools.CONTENT_BG);
        VPContent.add(manualUI);

        this.getVirtualProviderTicketType();

        return VPContent;
    }

    private void changeManualUI() {
        if (ISSUETICKET_MANUAL_KEY.equals(getNetIssueType())) {
            showManualUI();
        } else if (ISSUETICKET_AUTO_KEY.equals(getNetIssueType())) {
            orderOperationlist.clear();
            selectOrderOperation = null;
            hideManualUI();
        }
    }

    private void hideManualUI() {
        getManualUI().removeAll();
        getManualUI().updateUI();
    }

    private void showManualUI() {
        Box boxManualUI = Box.createVerticalBox(); // 创建纵向Box容器,菜单容器
        getManualUI().add(boxManualUI);

        JPanel jlRoot = new JPanel();
        jlRoot.setLayout(new FlowLayout(FlowLayout.LEFT));
        jlRoot.setBackground(UITools.CONTENT_BG);
        JLabel jl = new JLabel("查询订单信息、设置订单状态："); // 创建一个标签
        jlRoot.add(jl);
        boxManualUI.add(jlRoot);

        JPanel boxLin3Root = new JPanel();
        boxLin3Root.setLayout(new FlowLayout(FlowLayout.LEFT));
        boxLin3Root.setBackground(UITools.CONTENT_BG);
        Box boxLin3 = Box.createHorizontalBox(); // 创建横向Box容器
        boxLin3.setBorder(new CompoundBorder(boxLin3.getBorder(), new EmptyBorder(10, 10, 10, 10)));
        boxLin3Root.add(boxLin3);
        boxManualUI.add(boxLin3Root);
        JLabel j3 = new JLabel("供应商订单号："); // 创建一个标签
        boxLin3.add(j3); // 将标签添加到面板
        JTextField jta = new JTextField();
        jta.setForeground(Color.gray); // 设置组件的背景色
        jta.setFont(new Font("楷体", Font.BOLD, 16)); // 修改字体样式
        jta.setPreferredSize(new Dimension(450, 20));
        boxLin3.add(jta); // 将标签添加到面板
        JButton btn = new JButton("查询"); // 创建JButton对象
        boxLin3.add(btn);
        btn.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
                getVPOrderDetail(jta);
            }
        });

        JPanel orderDetailRoot = new JPanel();
        orderDetailRoot.setLayout(new FlowLayout(FlowLayout.LEFT));
        orderDetailRoot.setBackground(UITools.CONTENT_BG);
        JLabel j2 = new JLabel("订单信息如下："); // 创建一个标签
        orderDetailRoot.add(j2);
        orderDetailLabel = new JLabel(""); // 创建一个标签
        orderDetailRoot.add(orderDetailLabel);
        boxManualUI.add(orderDetailRoot);

        JPanel boxLinchangeRoot = new JPanel();
        boxLinchangeRoot.setLayout(new FlowLayout(FlowLayout.LEFT));
        boxLinchangeRoot.setBackground(UITools.CONTENT_BG);
        Box boxLinchange = Box.createHorizontalBox(); // 创建横向Box容器
        boxLinchange.setBorder(new CompoundBorder(boxLinchange.getBorder(), new EmptyBorder(10, 10, 10, 10)));
        boxLinchangeRoot.add(boxLinchange);
        boxManualUI.add(boxLinchangeRoot);
        JLabel j21 = new JLabel("选择订单状态："); // 创建一个标签
        boxLinchange.add(j21); // 将标签添加到面板
        JComboBox<String> cmb2 = new JComboBox<String>(orderOperationlist); // 创建JComboBox
        cmb2.setPreferredSize(new Dimension(450, 20));
        cmb2.setForeground(Color.red);
        cmb2.addItemListener(new ItemListener() {

            @Override
            public void itemStateChanged(ItemEvent e) {
                selectOrderOperation = e.getItem().toString();
            }
        });
        boxLinchange.add(cmb2); // 将标签添加到面板
        JButton btn1 = new JButton("确认"); // 创建JButton对象
        boxLinchange.add(btn1);

        btn1.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
                updateVPOrderState();
            }
        });

        getManualUI().updateUI();
    }

    /**
     * 获取当前的供应商出票状态
     * */
    private void getVirtualProviderTicketType() {
        String url = this.getServer4Env() + "/travel/test-assistant/v1/getVirtualProviderTicketType";

        GetVPTypeRequest rb = new GetVPTypeRequest();
        rb.setOrderType(orderType);
        String reqUrl = url + "?" + rb.toString();
        if (loadingText != null) {
            loadingText.setText("发送请求中");
        }
        this.getApiUtil().sendGetRequestAsync(reqUrl, new Callback() {

            @Override
            public void onResponse(Call arg0, Response arg1) throws IOException {
                // TODO Auto-generated method stub
                String ewsponse = arg1.body().string();
                System.out.println(ewsponse);
                JSONObject jsonRes = JSONObject.parseObject(ewsponse);
                if (loadingText != null) {
                    loadingText.setText("请求结结果：" + jsonRes.getString("resultMessage"));
                }
                if (0 == jsonRes.getInteger("resultCode")) {
                    setNetIssueType(jsonRes.getJSONObject("result").getString("ticketType"));
                }
                // 空值要赋值一下
                if (getNetIssueType() == null) {
                    setNetIssueType(ISSUETICKET_UNKNOW_KEY);
                }
                if (issueTicketValue != null) {
                    issueTicketValue.setText(issueTypeMap.get(getNetIssueType()));
                    if (getNetIssueType() != ISSUETICKET_UNKNOW_KEY) {
                        setSelectIssueType(issueTypeMap.get(getNetIssueType()));
                    }
                }
                changeManualUI();
            }

            @Override
            public void onFailure(Call arg0, IOException arg1) {
                // TODO Auto-generated method stub
                System.out.println(arg1.toString());
                if (loadingText != null) {
                    loadingText.setText("请求结果" + arg1.toString());
                }
            }
        });
    }

    private void setVirtualProviderTicketType() {
        if (getSelectIssueType() == issueTypeMap.get(getNetIssueType())) {
            loadingText.setText("你没有更改出票方式");
            return;
        }
        String url = this.getServer4Env() + "/travel/test-assistant/v1/setVirtualProviderTicketType";

        SetVPTypeRequest rb = new SetVPTypeRequest();
        rb.setOrderType(this.orderType);
        rb.setTicketType(getSelectIssueType() == ISSUETICKET_AUTO ? ISSUETICKET_AUTO_KEY : ISSUETICKET_MANUAL_KEY);
        loadingText.setText("发送请求中");
        this.getApiUtil().sendPostDataAsync(url, (JSONObject) JSONObject.toJSON(rb), new Callback() {

            @Override
            public void onResponse(Call arg0, Response arg1) throws IOException {
                String ewsponse = arg1.body().string();
                System.out.println(ewsponse);
                loadingText.setText("请求结果" + ewsponse);
                JSONObject jsonRes = JSONObject.parseObject(ewsponse);
                if (0 == jsonRes.getInteger("resultCode")) {
                    setNetIssueType(rb.getTicketType());
                    issueTicketValue.setText(issueTypeMap.get(getNetIssueType()));

                }
                changeManualUI();
            }

            @Override
            public void onFailure(Call arg0, IOException arg1) {
                // TODO Auto-generated method stub
                System.out.println(arg1.toString());
                loadingText.setText("请求结果" + arg1.toString());
            }
        });
    }

}
