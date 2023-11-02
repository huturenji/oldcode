from tkinter import *
from tkinter import messagebox as msgbox
import tkinter as tk
from tkinter import filedialog
from common.readexcel import ReadExcel
from updateFile import updateFile
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.executors.pool import ThreadPoolExecutor

#创建窗口：实例化一个窗口对象
root = Tk()
#窗口大小
root.geometry("900x300+400+300")
#窗口标题
root.title("定时更新装修")

fm2 = Frame(root)
fm2.pack(side=BOTTOM,padx=10,fill=NONE)
#添加标签导入渠道
in_ch = Label(fm2, text='任务列表').pack(side=LEFT)

sc = tk.Scrollbar(fm2,orient=HORIZONTAL)
sc.pack(side=BOTTOM,fill=X)

sc1 = tk.Scrollbar(fm2,orient=VERTICAL)
sc1.pack(side=LEFT,fill=Y)

#选择导出的首页
fitListbox = Listbox(fm2, selectmode=MULTIPLE, height=10,width=100,xscrollcommand=sc.set,yscrollcommand=sc1.set)
fitListbox.pack(side=LEFT,fill=NONE)
sc.config(command=fitListbox.xview)
sc1.config(command=fitListbox.yview)

fm1 = Frame(root)
fm1.pack(side=TOP,padx=50,expand=YES)

def upload_excelfile():
    #指定上传mp4视频文件
    # askopenfilename 1次上传1个；askopenfilenames1次上传多个
    selectFile = tk.filedialog.askopenfilename()
    exc.set("")
    excel_file.insert(0, selectFile)

btn_up = Button(fm1, text='上传任务文件excel', width=15, height=1, command=upload_excelfile).pack(side=LEFT, fill=Y, expand=YES,padx=20)

exc = tk.StringVar()
excel_file = Entry(fm1, textvariable=exc,width=50)
excel_file.pack(side=LEFT, fill=Y, expand=YES,padx=10)

def read_excel():
    filename = exc.get()
    if filename == "":
        msgbox.showinfo(title="错误提示", message="请先上传任务文件！")
    else:
        data_file_name = exc.get()
        rd = ReadExcel(data_file_name, "Sheet1")
        excel_data = rd.read_data()
        count = len(excel_data)
        for i in excel_data:
            fitListbox.insert('end',i)
            # print("count",count,i)
        fitListbox.select_set(0,fitListbox.size())



btn_read = Button(fm1, text='读取任务文件', width=10, height=1, command=read_excel).pack(side=LEFT, fill=Y, expand=YES,padx=20)
# 创建定时任务
sched = BackgroundScheduler()
def updateFit(list):
    print(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    # print("list",list)
    uf = updateFile()
    # 如果首页名称不为空，则更新首页装修
    # if list["indexName"] != None:
        # searchIndexRes = uf.searchNameIndex(list["environment"], list)
        # if isinstance(searchIndexRes, str):
        #     msgbox.showinfo("错误提示",searchIndexRes)
        # else:
        #     list["decoId"] = searchIndexRes["decoId"]
    data,name,type = uf.fitDetail(list["environment"], list)
    list["data"] = data
    list["name"] = name
    list["type"] = type
    res = uf.indexTopicUpdate(list["environment"], list)
    print(res)
    # 如果专题页名称不为空，则更新专题装修
    # if list["topicName"] != None:
    #     # searchTopicRes = uf.searchNameTopic(list["environment"], list)
    #     # if isinstance(searchTopicRes, str):
    #     #     msgbox.showinfo("错误提示",searchTopicRes)
    #     # else:
    #     # list["decoId"] = searchTopicRes["decoId"]
    #     data = uf.fitDetail(list["environment"], list)
    #     list["data"] = data
    #     list["data"] = data
    #     list["name"] = name
    #     list["type"] = type
    #     uf.topicUpdate(list["environment"], list)
sched = BackgroundScheduler(daemon=True)
# sched = BlockingScheduler(executors={'default': ThreadPoolExecutor(1)})
# ,executors={'default': ThreadPoolExecutor(1)}
sched.start()
def deal():
    if in_button["text"] == "添加选中的定时任务":
        indexs = fitListbox.curselection()
        for index in indexs:
            list = fitListbox.get(index)
            list = eval(list)
            times = eval(list["updateTime"])
            # updateFit(list)
            sched.add_job(updateFit, 'date', run_date=datetime(int(times[0]), int(times[1]), int(times[2]),int(times[3]), int(times[4]), int(times[5])), args=[list])

        print(sched.get_jobs())
        in_button["text"] = "取消所有任务"
        return
    if in_button["text"] == "取消所有任务":
        # sched.shutdown(wait=False)
        sched.remove_all_jobs()
        print(sched.get_jobs())
        in_button["text"] = "添加选中的定时任务"
        return
    # msgbox.showinfo("提示","定时任务已添加")


fm3 = Frame(root)
fm3.pack(side=BOTTOM,padx=10,expand=YES)

def clearList():
    fitListbox.delete(0,END)

#添加定时任务
in_button = Button(fm3, width=25, text="添加选中的定时任务",command=deal)
# in_button.grid(row=8, column=0)
in_button.pack(side=RIGHT,padx=8)

#清空任务列表
clear_button = Button(fm3, width=25, text="清空任务列表",command=clearList)
# in_button.grid(row=8, column=0)
clear_button.pack(side=RIGHT,padx=8)

#显示窗口
root.mainloop()

