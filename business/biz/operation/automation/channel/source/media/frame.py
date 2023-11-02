from tkinter import *
from tkinter import messagebox as msgbox
from media.auth import MediaAuth
from media.channel import MediaChannel
import utils.globalvar as global_var


class MediaFrame:
    def __init__(self, tk, parent_frame):
        frame = tk  # 根窗口
        self.parent = parent_frame  # 父窗口
        self.channel_data = {}  # channelId channelName  third_addr shortChannelName
        # 登录资讯系统的用户名密码
        env = self.parent.env_sv.get()
        self.username = StringVar()
        self.set_username(env)
        self.password = StringVar()
        self.set_password(env)

        # 用户名密码输入框
        username_label = Label(frame, text='资讯用户名：')
        username_label.grid(row=7, column=4)
        username_entry = Entry(frame, textvariable=self.username, width=19)  # 填写用户名
        username_entry.grid(row=7, column=5)
        password_label = Label(frame, text='资讯密码：')
        password_label.grid(row=8, column=4)
        password_entry = Entry(frame, textvariable=self.password, width=19, show='*')  # 填写密码
        password_entry.grid(row=8, column=5)

        add_channel_btn = Button(frame, text="新建资讯渠道", command=self.add_channel)
        add_channel_btn.grid(row=9, column=5)

    # 新增渠道
    def add_channel(self):
        env = self.parent.env_sv.get()
        auth = MediaAuth(env)
        # 判断是否有值
        if not self.channel_data:
            msgbox.showerror(title='创建渠道失败', message="创建渠道所需信息为空，请重新上传附件")
        else:
            # 获取资讯创建渠道需要的token
            token = auth.login(self.username.get(), self.password.get())
            result = MediaChannel(env, token).add(self.channel_data)  # 新建渠道
            if result == 'success':
                global_var.get_log_value().insert(END, f'新增资讯渠道成功\n')
                msgbox.showinfo(title='成功', message="创建资讯渠道成功")
            else:
                global_var.get_log_value().insert(END, f'新增资讯渠道失败{result}\n')
                msgbox.showerror(title='创建资讯渠道失败', message="请检查相关配置")

    # 设置资讯渠道数据 # channelId channelName  third_addr shortChannelName
    def set_channel_data(self, excel_data, yaml_data):
        self.channel_data = {'channelId': yaml_data['tid'], 'channelName': excel_data['bankname'] + yaml_data["deploy_env"],
                             'shortChannelName': excel_data['bankname'], 'third_origin': self.parent.third_origin}

    # 设置用户名
    def set_username(self, env):
        self.username.set(MediaAuth(env).get_default_username())
        global_var.get_log_value().insert(END, f'设置资讯用户名成功\n')

    # 设置密码
    def set_password(self, env):
        self.password.set(MediaAuth(env).get_default_password())
        global_var.get_log_value().insert(END, f'设置资讯密码成功\n')
