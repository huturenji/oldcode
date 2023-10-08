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
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.io.IOException;
import javax.swing.Box;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import net.bean.PushRequestBean;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

/**
 * 类      名： ContentPushSet<BR/>
 * 
 * 描      述： <BR/>推送财务报表。这个用来手动执行报表推送的测试工具。按照正常业务逻辑是需要每个月才推送一次。
 * 
 * 创 建 人： ligu 李冠群<BR/>
 * 
 * 日     期： 2021年5月14日<BR/>
 */
public class ContentPushReport extends ContentComp implements ContentBuilder {

    public ContentPushReport() {
        super();
    }

    @Override
    public Box buildContent() {
        Box boxContentChild = Box.createVerticalBox(); // 创建纵向Box容器,菜单容器

        Box boxLin1 = Box.createHorizontalBox(); // 创建横向Box容器
        boxLin1.setBorder(new CompoundBorder(boxLin1.getBorder(), new EmptyBorder(10, 10, 10, 10)));
        boxContentChild.add(boxLin1);
        JLabel jl = new JLabel("请先选择环境，再输入渠道id，最后点击 推送按钮"); // 创建一个标签
        boxLin1.add(jl); // 将标签添加到面板

        Box boxLin2 = Box.createHorizontalBox(); // 创建横向Box容器
        boxLin2.setBorder(new CompoundBorder(boxLin2.getBorder(), new EmptyBorder(10, 10, 10, 10)));
        boxContentChild.add(boxLin2);
        JLabel j2 = new JLabel("选择环境："); // 创建一个标签
        boxLin2.add(j2); // 将标签添加到面板
        JComboBox<String> cmb = new JComboBox<String>(this.getEnvList()); // 创建JComboBox
        cmb.setPreferredSize(new Dimension(50, 20));
        cmb.setForeground(Color.red);
        cmb.addItemListener(new ItemListener() {

            @Override
            public void itemStateChanged(ItemEvent e) {
                setEvnVaule(e.getItem().toString());
            }
        });
        boxLin2.add(cmb); // 将标签添加到面板

        Box boxLin3 = Box.createHorizontalBox(); // 创建横向Box容器
        boxLin3.setBorder(new CompoundBorder(boxLin3.getBorder(), new EmptyBorder(10, 10, 10, 10)));
        boxContentChild.add(boxLin3);
        JLabel j3 = new JLabel("渠道id："); // 创建一个标签
        boxLin3.add(j3); // 将标签添加到面板
        JTextField jta = new JTextField();
        jta.setForeground(Color.gray); // 设置组件的背景色
        jta.setFont(new Font("楷体", Font.BOLD, 16)); // 修改字体样式
        boxLin3.add(jta); // 将标签添加到面板

        Box boxLin4 = Box.createHorizontalBox(); // 创建横向Box容器
        boxContentChild.add(boxLin4);
        JButton btn = new JButton("发送"); // 创建JButton对象
        boxLin4.add(btn);

        Box boxLin5 = Box.createHorizontalBox(); // 创建横向Box容器
        boxLin5.setBorder(new CompoundBorder(boxLin5.getBorder(), new EmptyBorder(10, 10, 10, 10)));
        boxContentChild.add(boxLin5);
        final JTextArea j4 = new JTextArea("执行结果："); // 创建一个标签
        j4.setLineWrap(true); // 设置文本域中的文本为自动换行
        boxLin5.add(j4); // 将标签添加到面板

        btn.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {

                setChannelId(jta.getText());
                sendFinance(j4);
            }
        });

        return boxContentChild;

    }

    private void sendFinance(JTextArea j4) {
        if (null == this.getChannelId() | this.getChannelId().isEmpty()) {
            j4.setText("没有输入渠道id");
            return;
        }

        String url = this.getServer4Env() + "/travel/order/v1/sendFinance";

        PushRequestBean rb = new PushRequestBean();
        rb.setChannelId(this.getChannelId());
        j4.setText("发送请求中");
        this.getApiUtil().sendPostDataAsync(url, (JSONObject) JSONObject.toJSON(rb), new Callback() {

            @Override
            public void onResponse(Call arg0, Response arg1) throws IOException {
                // TODO Auto-generated method stub
                String ewsponse = arg1.body().string();
                System.out.println(ewsponse);
                j4.setText("请求结果" + ewsponse);
            }

            @Override
            public void onFailure(Call arg0, IOException arg1) {
                // TODO Auto-generated method stub
                System.out.println(arg1.toString());
                j4.setText("请求结果" + arg1.toString());
            }
        });
    }
}
