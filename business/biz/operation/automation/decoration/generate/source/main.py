import traceback
from tkinter import *
from tkinter import messagebox as msgbox
import ast
from common.auth import Auth
from search import Search
from update import Update

# 定义全局变量 start 多个函数需要共有该参数，故提取为全局变量

# 创建窗口 实例化一个窗口对象
root_k = Tk()
# 设置窗口大小
root_k.geometry('750x800+400+150')
# 设置框框title
root_k.title('装修数据自动化导入')

import_list = []  # 导入的数据
export_channleId_entry = Entry(root_k, width=19)  # 填写导出渠道的渠道id
export_channleId_entry.grid(row=0, column=3)

access_token_map = {}  # 数据请求的token map


# 定义全局变量 end 多个函数需要共有该参数，故提取为全局变量


# 导出模块窗口
def export_frame():
    # 导出环境选择
    export_l = Label(root_k, text='选择导出环境：')
    export_l.grid(row=0, column=0)
    export_v = StringVar(root_k)
    export_v.set('sit')
    env_list = ['sit', 'g2uat', 'g2bankuat', 'g2pro', 'g2bankpro']
    export_om = OptionMenu(root_k, export_v, *env_list)
    export_om['width'] = 14
    export_om.grid(row=0, column=1)

    # 导出渠道 填写
    export_channel = Label(root_k, text='填写导出渠道：')
    export_channel.grid(row=0, column=2)

    # 导出装修页面类型
    export_page = Label(root_k, text='请选择导出页面类型：')
    export_page.grid(row=0, column=4)

    export_page_type = StringVar(root_k)
    export_page_type.set("ALL")
    page_type_list = ["ALL", "TABBAR", "INDEX", "TOPIC", "部分INDEX", "部分TOPIC"]
    export_page_om = OptionMenu(root_k, export_page_type, *page_type_list)
    export_page_om["width"] = 18
    export_page_om.grid(row=0, column=5, pady=5)

    # 选择导出的首页
    home_list = Listbox(root_k, selectmode=MULTIPLE, height=10, width=70)
    home_list.grid(row=6, column=1, columnspan=4, rowspan=3, pady=10)
    home_list.bind('<<ListboxSelect>>', list_selected)
    # 选择导入的专题页
    topic_list = Listbox(root_k, selectmode=MULTIPLE, height=20, width=70)
    topic_list.grid(row=11, column=1, columnspan=4, rowspan=3)
    topic_list.bind('<<ListboxSelect>>', list_selected)

    # 导出页面所需的用户名密码
    export_username = Label(root_k, text='导出用户名：')
    export_username.grid(row=1, column=0)
    export_username_entry = Entry(root_k, width=19)  # 填写用户名
    export_username_entry.grid(row=1, column=1)
    export_username_entry.insert(0, Auth(export_v.get()).get_default_username())
    export_password = Label(root_k, text='导出密码：')
    export_password.grid(row=1, column=2)
    export_password_entry = Entry(root_k, width=19, show='*')  # 填写密码
    export_password_entry.grid(row=1, column=3)
    export_password_entry.insert(0, Auth(export_v.get()).get_default_password())

    export_v.trace_add('write', lambda *_, callback=export_v: choose_env(export_v.get(), export_username_entry,
                                                                         export_password_entry))  # 监听下拉列表变量变化

    home_button = Button(root_k, text="查询首页",
                         command=lambda: search_page_display(export_channleId_entry.get(), export_v.get(), 'home',
                                                             home_list, export_username_entry.get(),
                                                             export_password_entry.get()))
    home_button.grid(row=7, column=5, padx=20)

    topic_button = Button(root_k, text="查询专题页",
                          command=lambda: search_page_display(export_channleId_entry.get(), export_v.get(), 'topic',
                                                              topic_list, export_username_entry.get(),
                                                              export_password_entry.get()))
    topic_button.grid(row=12, column=5, padx=20)


# 导入模块窗口
def import_frame():
    # 导入环境选择
    import_l = Label(root_k, text='选择导入环境：')
    import_l.grid(row=2, column=0)
    import_v = StringVar(root_k)
    import_v.set('sit')
    import_om = OptionMenu(root_k, import_v, 'sit', 'g2uat', 'g2bankuat', 'g2pro', 'g2bankpro')
    import_om['width'] = 14
    import_om.grid(row=2, column=1)

    # 导入渠道 填写
    import_channel = Label(root_k, text='填写导入渠道：')
    import_channel.grid(row=2, column=2)
    import_channelId_entry = Entry(root_k, width=19)  # 填写渠道id
    import_channelId_entry.grid(row=2, column=3)

    # 导入用户名与密码
    import_username = Label(root_k, text='导入用户名：')
    import_username.grid(row=3, column=0)
    import_username_entry = Entry(root_k, width=19)  # 填写用户名
    import_username_entry.grid(row=3, column=1)
    import_username_entry.insert(0, Auth(import_v.get()).get_default_username())
    import_password = Label(root_k, text='导入密码：')
    import_password.grid(row=3, column=2)
    import_password_entry = Entry(root_k, width=19, show='*')  # 填写密码
    import_password_entry.grid(row=3, column=3)
    import_password_entry.insert(0, Auth(import_v.get()).get_default_password())

    import_v.trace_add('write', lambda *_, callback=import_v: choose_env(import_v.get(), import_username_entry,
                                                                         import_password_entry))  # 监听下拉列表变量变化

    # 导入首页
    import_home = Label(root_k, text='选择要导入的首页')
    # 定位首页
    import_home.grid(row=7, column=0)

    # 导入专题页
    import_topic = Label(root_k, text='选择要导入的专题页')
    # 定位专题页
    import_topic.grid(row=12, column=0)

    # 导入按钮
    in_button = Button(root_k, text="导入装修数据", command=lambda: import_data(import_channelId_entry.get(), import_v.get(),
                                                                          import_username_entry.get(),
                                                                          import_password_entry.get()))
    in_button.grid(row=14, column=2, pady=20)


# 环境选择后，将对应的用户名密码输入框中的变量改变为对应环境的用户名与密码
def choose_env(env, username_entry, password_entry):
    assignment_entry(username_entry, Auth(env).get_default_username())
    assignment_entry(password_entry, Auth(env).get_default_password())


# 给entry赋值
def assignment_entry(entry, value):
    entry.delete(0, END)
    entry.insert(0, value)


# 列表选中事件
def list_selected(event):
    selected = []
    selected_list = event.widget.curselection()
    for cur in selected_list:
        selected.append(ast.literal_eval(event.widget.get(cur)))  # 将字符串转换为json对象
    global import_list
    import_list = selected[:]


# 查询页面，并且展示在界面上
def search_page_display(channelId, env, page_type, list_box, username, password):
    page_list = search_page(channelId, env, page_type, username, password)
    if page_list:
        list_box.delete(0, END)
        for page in page_list:
            list_box.insert(END, page)
    else:
        print(f'search_page_display failed,page_list is {page_list}')


# 查询页面 查询出来的数据存储到内存中，部分数据需要展示在页面上，供选择
def search_page(channelId, env, page_type, username, password):
    if channelId is None or channelId == '':
        msgbox.showerror('渠道信息', '请输入需要查询的导出渠道信息')
        return
    token = get_token(env, username, password)  # 用户名与密码让用户手动输入
    if token is not None:
        search = Search(env, token)
        return search.get_channel_deco_list(channelId, page_type)
    else:
        msgbox.showerror('登录失败', f'search_page is failed, token is {token}')
        print(f'search_page is failed, token is {token}')


# 获取数据请求需要的token
def get_token(env, username, password):
    auth = Auth(env)
    global access_token_map
    if access_token_map.get(env):  # token区分环境
        return access_token_map[env]
    else:
        access_token_map[env] = auth.get_token_password(username, password)  # 用户名与密码让用户手动输入


# 获取导入的数据 并且在页面导入前对填写数据进行校验
def get_import_data(import_channelId, export_channelId, env, username, password):
    if import_channelId is None or import_channelId == '':
        msgbox.showerror('渠道信息', '请输入需要导入装修数据的渠道信息')
        return None
    if export_channelId is None or export_channelId == '':
        msgbox.showerror('渠道信息', '请输入需要导出装修数据的渠道信息')
        return None
    # 判断import_list是否有值，如果有值则直接返回，否则获取导出渠道的所有装修数据
    data_list = import_list
    if not data_list:
        data_list = search_page(export_channelId, env, 'all', username, password)
    return data_list


# 导入数据  将渠道1111导入到1111111中
def import_data(channelId, env, username, password):
    data_list = get_import_data(channelId, export_channleId_entry.get(), env, username, password)
    if not data_list:
        return
    token = get_token(env, username, password)  # 用户名与密码让用户手动输入
    if token is not None:
        update_fun = Update(env, token)
        success_flag = update_fun.update_channel_deco_list(channelId, env, data_list)
        if success_flag == 'success':
            msgbox.showinfo('导入成功', '渠道数据导入成功')
        else:
            msgbox.showerror('导入失败', '渠道数据导入失败，请重新导入')
    else:
        msgbox.showerror('导入失败', '渠道数据导入失败，请重新导入')
        print(f'import_page is failed, token is {token}')


try:
    # 导出窗口
    export_frame()
    # 导入窗口
    import_frame()
    # 显示主窗口
    root_k.mainloop()
    # 等待用户按下任意键
    input('press any key to exit ...')
    # 关闭程序
    sys.exit()
except Exception as e:
    traceback.print_exc()
    input('press any key to exit ...')
