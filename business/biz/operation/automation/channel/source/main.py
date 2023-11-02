from tkinter import *
import tkinter as tk
from tkinter import filedialog
from tkinter import messagebox as msgbox

from mall.frame import MallFrame
from media.frame import MediaFrame
from travel.frame import TravelFrame
from utils.excel import ExcelTools
from utils.yaml import YamlTools
import utils.globalvar as global_var

root = Tk()


class RootFrame:
    def __init__(self):
        global_var.init()
        self.mall_frame = None  # 商城frame
        self.travel_frame = None  # 商旅frame
        self.media_frame = None  # 资讯frame
        self.quick_pay_name = StringVar(root)  # 公款闪付名称
        self.quick_pay_method = StringVar(root)  # 公款闪付方法
        self.pay_type = StringVar(root)  # 支付类型
        self.third_origin = ''  # 第三方域名 包括域名后的产品名称
        self.excel_data = {}  # excel解析出来的数据
        self.yaml_data = {}  # yaml解析出来的数据
        # 日志打印
        log_label = Label(root, text='日志打印')
        log_label.grid(row=4, column=4, )
        # 打印日志输入框
        log_text = Text(root, width=60, height=20)
        log_text.grid(row=4, column=5)
        global_var.set_log_value(log_text)
        # 窗口大小
        root.geometry("1700x550+100+550")
        # 窗口标题
        root.title("自动创建渠道")
        # 添加标签导出环
        env_label = Label(root, text='渠道环境')
        # 定位
        env_label.grid(row=0, column=0)
        # 渠道环境下拉框
        self.env_sv = StringVar(root)
        self.env_sv.set("sit")
        env_list = ['sit', 'g2uat', 'g2bankuat', 'g2pro', 'g2bankpro']
        out_om = OptionMenu(root, self.env_sv, *env_list)
        out_om["width"] = 14
        out_om.grid(row=0, column=1)

        # 监听下拉列表变量变化
        self.env_sv.trace_add('write', lambda *_, callback=self.env_sv: self.choose_env(self.env_sv.get()))

        # 添加标签项目类型
        project_type_label = Label(root, text='项目类型')
        project_type_label.grid(row=0, column=2)
        # 添加输入框项目类型
        self.project_type = StringVar(root)
        project_type_entry = Entry(root, textvariable=self.project_type)
        project_type_entry.grid(row=0, column=3)

        # 添加标签渠道tid
        tid_label = Label(root, text='渠道tid')
        tid_label.grid(row=0, column=4)
        # 添加输入框渠道tid
        self.tid = StringVar(root)
        tid_entry = Entry(root, textvariable=self.tid)
        tid_entry.grid(row=0, column=5)

        # 添加标签渠道全称
        channel_name_label = Label(root, text='渠道全称')
        channel_name_label.grid(row=0, column=6)
        # 渠道全称输入框
        self.channel_name = StringVar(root)
        channel_name_entry = Entry(root, textvariable=self.channel_name, width=30)
        channel_name_entry.grid(row=0, column=7)

        # 添加标签推送地址
        push_addr_label = Label(root, text='推送地址')
        push_addr_label.grid(row=1, column=0)
        # 推送地址域名输入框
        self.push_addr_text = Text(root, width=30, height=3)
        self.push_addr_text.grid(row=1, column=1)

        self.file_frame()
        self.pay_frame()

    # 环境变量修改
    def choose_env(self, env):
        if self.mall_frame:
            self.mall_frame.set_username(env)
            # 重新设置商城数据
            self.mall_frame.set_channel_data(self.excel_data, self.yaml_data, env)
        if self.travel_frame:
            self.travel_frame.set_username(env)
            # 重新设置商旅数据
            self.travel_frame.set_channel_data(self.excel_data, self.yaml_data, env)
        if self.media_frame:
            self.media_frame.set_username(env)
            # 重新设置资讯数据
            self.media_frame.set_channel_data(self.excel_data, self.yaml_data)

    # 主frame赋值   此处设置的值与 mall-frame处的值有重复 通过传递frame解决
    def set_main_frame(self, excel_data, yaml_data):
        # 支付方式名称
        self.quick_pay_name.set(
            yaml_data["bank_name"] + yaml_data["deploy_env"].upper() + "_" + str(yaml_data["tid"]) + "_公款闪付")
        # 支付方式方法
        self.quick_pay_method.set(yaml_data["product_name"].upper() + "_" + str(yaml_data["tid"]) + "_QUICK_PAY")
        # 项目名称
        project_type_list = []
        # 判断是否有 商城 商旅  资讯
        if excel_data['mall_enable'] == '是':  # 商城
            self.mall_frame = MallFrame(root, top_frame)  # 初始化商城frame
            project_type_list.append('商城')
        if excel_data['travel_enable'] == '是':  # 商旅
            self.travel_frame = TravelFrame(root, top_frame)  # 初始化商旅frame
            project_type_list.append('商旅')
        if excel_data['media_enable'] == '是':  # 资讯
            self.media_frame = MediaFrame(root, top_frame)  # 初始化资讯frame
            project_type_list.append('资讯')
        self.project_type.set(project_type_list)
        # 渠道名称
        self.channel_name.set(excel_data['bankname'] + yaml_data["deploy_env"])
        # 渠道id
        self.tid.set(yaml_data["tid"])
        # 推送地址
        third_second_domain = ''
        if excel_data['secondDomain']:
            third_second_domain = excel_data['secondDomain'] if '/' in excel_data['secondDomain'] else '/' + excel_data[
                'secondDomain']
        self.third_origin = f"{excel_data['protocol']}://{excel_data['domain']}:{excel_data['port']}{third_second_domain}"
        push_address = f'{self.third_origin}/bizmate/message/v1/pushBizmateMessage'
        self.push_addr_text.delete('1.0', END)
        self.push_addr_text.insert(INSERT, push_address)

    # 支付frame
    def pay_frame(self):
        # 支付类型
        pay_type_label = Label(root, text='支付类型')
        pay_type_label.grid(row=1, column=2)
        # 支付类型输入框
        pay_type_entry = Entry(root, textvariable=self.pay_type)
        pay_type_entry.grid(row=1, column=3)

        # 标签支付方式
        pay_method_label = Label(root, text='支付方式')
        pay_method_label.grid(row=1, column=4)
        # 支付方式输入框
        pay_method_entry = Entry(root, textvariable=self.quick_pay_method, width=25)
        pay_method_entry.grid(row=1, column=5)

        # 标签支付全称
        pay_name_label = Label(root, text='支付全称')
        pay_name_label.grid(row=1, column=6)
        # 支付全称输入框
        pay_name_entry = Entry(root, textvariable=self.quick_pay_name, width=30)
        pay_name_entry.grid(row=1, column=7)

    # 文件上传frame
    def file_frame(self):
        # 文件上传
        exc = tk.StringVar()
        excel_file_entry = Entry(root, textvariable=exc, width=40)
        excel_file_entry.grid(row=5, column=1)
        btn_excel = Button(root, text='excel上传文件', font=('Arial', 12), width=10, height=1,
                           command=lambda: self.file_upload(excel_file_entry))
        btn_excel.grid(row=5, column=0, ipadx='3', ipady='3', padx='10', pady='20')

        yam = tk.StringVar()
        yaml_file_entry = Entry(root, textvariable=yam, width=40)
        yaml_file_entry.grid(row=5, column=3)
        btn_yaml = Button(root, text='yaml上传文件', font=('Arial', 12), width=10, height=1,
                          command=lambda: self.file_upload(yaml_file_entry))
        btn_yaml.grid(row=5, column=2, ipadx='3', ipady='3', padx='10', pady='20')

        # 初始化按钮
        ini_button = Button(root, text="解析文件",
                            command=lambda: self.file_analysis(excel_file_entry, yaml_file_entry, self.env_sv.get()))
        ini_button.grid(row=6, column=0)

    # 获取上传文件的路径
    def file_upload(self, entry):
        filepath = tk.filedialog.askopenfilename()
        entry.delete(0, END)
        entry.insert(0, filepath)

    # 解析上传文件的数据，并且赋值
    def file_analysis(self, excel_file_entry, yaml_file_entry, env):
        if not excel_file_entry.get() or not yaml_file_entry.get():
            msgbox.showerror(title='读取文件报错', message="请上传excel和yaml文件后解析")
        else:
            # 解析文件
            self.excel_data = ExcelTools(excel_file_entry.get(), '私有云对接公有云提单标准表(项目经理用)').read()
            self.yaml_data = YamlTools(yaml_file_entry.get()).read()
            global_var.get_log_value().insert(INSERT, f'解析上传的excel文件{excel_file_entry.get()}成功\n')
            global_var.get_log_value().insert(INSERT, f'解析上传的yaml文件{yaml_file_entry.get()}成功\n')
            # 给主frame赋值
            self.set_main_frame(self.excel_data, self.yaml_data)
            # 判断是否有商城,如果有则给商城frame赋值
            if self.excel_data['mall_enable'] == '是':
                self.mall_frame.set_channel_data(self.excel_data, self.yaml_data, env)

            if self.excel_data['travel_enable'] == '是':
                self.travel_frame.set_channel_data(self.excel_data, self.yaml_data, env)

            if self.excel_data['media_enable'] == '是':  # 资讯
                self.media_frame.set_channel_data(self.excel_data, self.yaml_data)


# 主窗口
top_frame = RootFrame()
# 显示窗口
root.mainloop()
