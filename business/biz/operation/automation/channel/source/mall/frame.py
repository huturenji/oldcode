from tkinter import *
from mall.channel import Channel
from mall.auth import MallAuth
from mall.pay import Pay
from tkinter import messagebox as msgbox
import utils.globalvar as global_var


class MallFrame:
    def __init__(self, tk, parent_frame):
        frame = tk  # 根窗口
        self.parent = parent_frame  # 父窗口
        self.pay = None
        self.channel_data = {}  # channelId channelName  third_addr shortChannelName QUICK_PAY
        self.pay_data = {}  # pay_type pay_type_name pay_address third_public_key
        # 登录商城系统的用户名密码
        env = self.parent.env_sv.get()
        self.username = StringVar()
        self.set_username(env)
        self.password = StringVar()
        self.set_password(env)
        # 商城支付服务地址标签
        pay_label = Label(frame, text='商城支付服务地址')
        pay_label.grid(row=2, column=0)
        # 商城支付服务地址输入框
        self.pay_address = StringVar()
        pay_address_entry = Entry(frame, textvariable=self.pay_address, width=50)
        pay_address_entry.grid(row=2, column=1)

        # 第三方公钥
        public_key_label = Label(frame, text='商城第三方公钥')
        public_key_label.grid(row=4, column=0)
        # 第三方公钥输入框
        self.public_key_text = Text(frame, width=20, height=20)
        self.public_key_text.grid(row=4, column=1)

        # 用户名密码输入框
        username_label = Label(frame, text='商城用户名：')
        username_label.grid(row=7, column=0)
        username_entry = Entry(frame, textvariable=self.username, width=19)  # 填写用户名
        username_entry.grid(row=7, column=1)
        password_label = Label(frame, text='商城密码：')
        password_label.grid(row=8, column=0)
        password_entry = Entry(frame, textvariable=self.password, width=19, show='*')  # 填写密码
        password_entry.grid(row=8, column=1)

        add_channel_btn = Button(frame, text="新建商城渠道", command=self.add_channel)
        add_channel_btn.grid(row=9, column=1)

    # 新增渠道
    def add_channel(self):
        env = self.parent.env_sv.get()
        auth = MallAuth(env)
        # 判断是否有值
        if not self.channel_data:
            msgbox.showerror(title='创建渠道失败', message="创建渠道所需信息为空，请重新上传附件")
        elif self.pay_address is None:
            msgbox.showerror(title='创建渠道失败', message="支付服务地址不能为空")
        else:
            # 获取商城创建渠道需要的token
            token = auth.login(self.username.get(), self.password.get())
            add_pay_result = self.add_pay(self.pay_data, token)  # 新增公款闪付支付方式
            if add_pay_result == 'success':
                global_var.get_log_value().insert(END, f'新增商城支付方式成功\n')
                global_var.get_log_value().insert(END, f'开始新增商城渠道\n')
                result = Channel(env, token).add(self.channel_data)  # 新建渠道
                if result == 'success':
                    global_var.get_log_value().insert(END, f'新增商城渠道成功\n')
                    msgbox.showinfo(title='成功', message="创建商城渠道成功")
                else:
                    global_var.get_log_value().insert(END, f'新增商城渠道失败{result}\n')
                    msgbox.showerror(title='创建商城渠道失败', message="请检查相关配置")
            else:
                global_var.get_log_value().insert(END, f'新增商城支付方式失败{add_pay_result}\n')

    # 新增公款闪付支付方式
    def add_pay(self, pay_data, token):
        if 'pay_type' in pay_data:
            self.pay.init(token)
            return self.pay.add_quick_pay({
                'payType': pay_data['pay_type'],
                'payTypeName': pay_data['pay_type_name'],
                'pay_address': pay_data['pay_address'],
                'thirdPublicKey': pay_data['third_public_key']
            })
        else:
            return None

    # 设置商城渠道数据 # channelId channelName  third_addr shortChannelName QUICK_PAY  paymentMethods
    def set_channel_data(self, excel_data, yaml_data, env):
        self.pay = Pay(env)

        third_public_key = yaml_data['bank_mall_sm2_public_key']
        self.channel_data = {
            'channelId': yaml_data['tid'],
            'channelName': excel_data['bankname'] + yaml_data["deploy_env"],
            'shortChannelName': excel_data['bankname'],
            'paymentMethods': [],
            'pay_address': ''
        }

        pay_address = f'{self.parent.third_origin}/bizmate/bosspay'

        self.channel_data['third_origin'] = self.parent.third_origin
        pay_type_list = []
        if excel_data['ali_pay'] == '是':  # 支付宝
            self.channel_data['paymentMethods'].append(self.pay.get_ali_pay())
            # 显示支付方式
            pay_type_list.append('支付宝')
        if excel_data['wx_pay'] == '是':  # 微信
            self.channel_data['paymentMethods'].append(self.pay.get_wx_pay())
            pay_type_list.append('微信')
        if excel_data['quick_pay'] == '是':  # 公款闪付
            pay_type_list.append('公款闪付')
            # 公款闪付类型
            pay_type = self.parent.quick_pay_method.get()
            # 公款闪付名称
            pay_type_name = self.parent.quick_pay_name.get()
            self.channel_data['paymentMethods'].append({
                "basePayType": "QUICK_PAY", "payType": pay_type,
                "payTypeName": pay_type_name, "alias": "公款闪付",
                "icon": "https://bucket-sinosun-dev1.oss-cn-hangzhou.aliyuncs.com/jegzgPi4g9/images/admin/setting"
                        "/975a8a1f-a14e-41d2-93d1-f893d379ac24.png "
            })
            # 公款闪付支付方式参数
            self.pay_data = {
                'pay_type': pay_type,
                'pay_type_name': pay_type_name,
                'pay_address': pay_address,
                'third_public_key': third_public_key
            }

        self.parent.pay_type.set(pay_type_list)
        self.channel_data['pay_address'] = pay_address

        # 显示支付地址
        self.pay_address.set(pay_address)
        # 显示公钥
        self.public_key_text.delete('1.0', END)
        self.public_key_text.insert(INSERT, third_public_key)

    # 设置用户名
    def set_username(self, env):
        self.username.set(MallAuth(env).get_default_username())
        global_var.get_log_value().insert(END, f'设置商城用户名成功\n')

    # 设置密码
    def set_password(self, env):
        self.password.set(MallAuth(env).get_default_password())
        global_var.get_log_value().insert(END, f'设置商旅密码成功\n')
