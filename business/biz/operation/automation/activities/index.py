from tkinter import *
import tkinter as tk
import datetime
from common.handle_data import TestData
from addDaily import addDaily
from buyTogether import bugToge
from seckill import secKill
import time
from datetime import datetime as dt, timedelta

#创建窗口：实例化一个窗口对象
root = Tk()
#窗口大小
root.geometry("800x500+400+400")
root.title("创建每日活动")

#添加标签导出环
lb_env = Label(root, text='天天专场渠道环境')
#定位
lb_env.grid(row=0, column=0)

#渠道环境下拉框
str_env = StringVar(root)
str_env.set("SIT")
out_om = OptionMenu(root,str_env,"SIT","UAT","UATBANK")
out_om["width"] = 14
out_om.grid(row=0,column=1)

lb_acname = Label(root, text='天天专场活动名称')
lb_acname.grid(row=0, column=2)
#活动名称输入框
input_acname = Entry(root)
input_acname.grid(row=0, column=3)
input_acname.insert(INSERT,datetime.datetime.now().strftime("%d%H%M"))

lb_acday = Label(root, text='专场日期')
lb_acday.grid(row=1, column=0)
#专场开始日期
input_acday = Entry(root)
input_acday.grid(row=1, column=1)
input_acday.insert(INSERT,(datetime.datetime.now()).strftime("%Y-%m-%d"))

#专场开始时间
lb_actime = Label(root, text='专场开始时间')
lb_actime.grid(row=1, column=2)
#专场开始日期
input_actime = Entry(root)
input_actime.grid(row=1, column=3)
# input_actime.insert(INSERT,(datetime.datetime.now() + datetime.timedelta(hours=1)).strftime("%H:%M:%S"))
input_actime.insert(INSERT,"00:00:00")

lb_acendtime = Label(root, text='专场结束天数')
lb_acendtime.grid(row=1, column=7)
#专场未来n天
input_acendtime = Entry(root)
input_acendtime.grid(row=1, column=8)
input_acendtime.insert(INSERT,7)

def daily():
    setattr(TestData, "promotionTime", input_acday.get())
    setattr(TestData, "promotionName", input_acname.get())
    setattr(TestData, "promotionStartTime", input_actime.get())
    setattr(TestData, "environment", str_env.get())

    # protime = time.strptime(pro,"%Y-%m-%d")
    # modified_date = time(protime) + datetime.timedelta(days=1)
    # datetime.strftime(modified_date, "%Y-%m-%d")
    # print("pro",pro,"modified_date",modified_date,type(modified_date))
    endtime = input_acday.get()
    days = input_acendtime.get()
    # protime = dt.strptime(endtime, "%Y-%m-%d")
    # modified_date = protime + timedelta(days=i+1)
    # promotionTime = dt.strftime(modified_date, "%Y-%m-%d")
    # print(modified_date.strftime("%Y-%m-%d"))
    #
    # print(endtime,type(endtime))
    if days == "" or days == "0":
        add = addDaily()
        add.adminDaily(getattr(TestData, "environment"))
        add.addProducts(getattr(TestData, "environment"))
        add.sellerAudit(getattr(TestData, "environment"))
    else:
        days = int(days)
        for i in range(days):
            protime = dt.strptime(endtime, "%Y-%m-%d")
            modified_date = protime + timedelta(days=i)
            promotionTime = dt.strftime(modified_date, "%Y-%m-%d")
            setattr(TestData, "promotionTime",promotionTime)
            print(promotionTime,"promotionTime")
            add = addDaily()
            add.adminDaily(getattr(TestData, "environment"))
            add.addProducts(getattr(TestData, "environment"))
            add.sellerAudit(getattr(TestData, "environment"))



btn_add = Button(root,text="创建天天专场活动",command=daily)
btn_add.grid(row=2, column=1)

#添加标签导出环
lb_buyenv = Label(root, text='一起买渠道环境')
#定位
lb_buyenv.grid(row=3, column=0)

#渠道环境下拉框
str_buyenv = StringVar(root)
str_buyenv.set("SIT")
out_buy = OptionMenu(root,str_buyenv,"SIT","UAT","UATBANK")
out_buy["width"] = 14
out_buy.grid(row=3,column=1)

lb_buyname = Label(root, text='一起买活动名称')
lb_buyname.grid(row=3, column=2)
#活动名称输入框
input_buyname = Entry(root)
input_buyname.grid(row=3, column=3)
input_buyname.insert(INSERT,datetime.datetime.now().strftime("%d%H%M"))

lb_buyday = Label(root, text='专场开始日期')
lb_buyday.grid(row=4, column=0)
#专场开始日期
input_buyday = Entry(root)
input_buyday.grid(row=4, column=1)
input_buyday.insert(INSERT,(datetime.datetime.now()).strftime("%Y-%m-%d")+" 00:00:00")

#专场结束日期
lb_buyendday = Label(root, text='专场结束日期')
lb_buyendday.grid(row=4, column=2)
#专场结束日期
input_buyendday = Entry(root)
input_buyendday.grid(row=4, column=3)
input_buyendday.insert(INSERT,(datetime.datetime.now() + datetime.timedelta(days=1)).strftime("%Y-%m-%d")+ " 23:59:59")

def buy():
    setattr(TestData, "buystartTime", input_buyday.get())
    setattr(TestData, "buypromotionName", input_buyname.get())
    setattr(TestData, "buyendTime", input_buyendday.get())
    setattr(TestData, "environment", str_buyenv.get())

    tobuy = bugToge()
    tobuy.addbuyTogether(getattr(TestData, "environment"))
    tobuy.buyListStage(getattr(TestData, "environment"))
    tobuy.searchBuyAudit(getattr(TestData, "environment"))
    tobuy.searchBuyAudit(getattr(TestData, "environment"))

btn_addbuy = Button(root,text="创建一起买活动",command=buy)
btn_addbuy.grid(row=5, column=1)

#添加标签导出环
lb_secenv = Label(root, text='秒杀渠道环境')
#定位
lb_secenv.grid(row=6, column=0)
#秒杀渠道环境下拉框
str_secenv = StringVar(root)
str_secenv.set("SIT")
out_sec = OptionMenu(root,str_buyenv,"SIT","UAT","UATBANK")
out_sec["width"] = 14
out_sec.grid(row=6,column=1)

lb_secname = Label(root, text='秒杀活动名称')
lb_secname.grid(row=6, column=2)
#秒杀活动名称输入框
input_secname = Entry(root)
input_secname.grid(row=6, column=3)
input_secname.insert(INSERT,datetime.datetime.now().strftime("%d%H%M"))

lb_buyday = Label(root, text='秒杀活动开始日期')
lb_buyday.grid(row=7, column=0)
#秒杀开始日期
input_secday = Entry(root)
input_secday.grid(row=7, column=1)
input_secday.insert(INSERT,(datetime.datetime.now()).strftime("%Y-%m-%d"))

#专场结束日期
lb_secendday = Label(root, text='秒杀活动结束日期')
lb_secendday.grid(row=7, column=2)
#秒杀结束日期
input_secendday = Entry(root)
input_secendday.grid(row=7, column=3)
input_secendday.insert(INSERT,(datetime.datetime.now() + datetime.timedelta(days=7)).strftime("%Y-%m-%d"))

def sec():
    setattr(TestData, "secstartTime", input_secday.get())
    setattr(TestData, "secpromotionName", input_secname.get())
    setattr(TestData, "secendTime", input_secendday.get())
    setattr(TestData, "environment", str_secenv.get())

    seck = secKill()
    seck.addSeckill(getattr(TestData, "environment"))
    seck.secListStage(getattr(TestData, "environment"))
    seck.sellersecAudit(getattr(TestData, "environment"))
    seck.admin_audit_seckill(getattr(TestData, "environment"))
    seck.admin_audit_seckill(getattr(TestData, "environment"))
    seck.admin_audit_seckill(getattr(TestData, "environment"))

btn_addbuy = Button(root,text="创建秒杀活动",command=sec)
btn_addbuy.grid(row=8, column=1)

#显示窗口
root.mainloop()

