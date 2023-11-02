# -*- coding: utf-8 -*-
# @time     : 2019/11/28 21:56
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : contants.py

"""
此模块用来处理整个项目目录的路径
"""

import os

# 当前文件的绝对路径获取(将项目放在服务器时，需要使用下面的方法)
# dir = os.path.abspath(__file__)

# 项目目录的路径（在linux环境中如果报错，使用上面的dir路径方法）
res = os.path.dirname(__file__)
BASEDIR = os.path.dirname(res)

# 配置文件的目录
CONF_DIR = os.path.join(BASEDIR, "config")

# 日志文件的目录
LOG_DIR = os.path.join(BASEDIR, "log")

# 截图保存目录
IMG_DIR = os.path.join(BASEDIR, "img")
# 如果目录不存在，创建一个img文件夹目录
# if os.path.exists(IMG_DIR):
#     os.mkdir(IMG_DIR)

# 上传附件库目录
FOLDER_DIR = os.path.join(BASEDIR, "folder")

# allure测试报告数据存放目录
REPORT_DIR = os.path.join(BASEDIR, "allure_report")
