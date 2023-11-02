"""
# -*- coding: utf-8 -*-
# @time     : 2019/11/28 20:25
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : mylogger.py
"""

import os
import logging

# 导入绝对路径配置模块
from common.contants import LOG_DIR

# 日志收集器的等级
level = "DEBUG"
# 输出到文件的等级
f_level = "DEBUG"
# 输出到控制台的等级
s_level = "ERROR"
# 日志文件的名称
filename = "test.log"

# 获取日志文件的绝对路径
file_path = os.path.join(LOG_DIR, filename)


class MyLogger(object):

    @staticmethod
    def create_logger():
        # 一、创建一个名为：python_log的日志收集器
        my_log = logging.getLogger("python_log")
        # 二、设置日志收集器的等级
        my_log.setLevel(level)
        # 三、添加输出渠道（输出到控制台）
        # 1、创建一个输出到控制台的输出渠道
        sh = logging.StreamHandler()
        # 2、设置输出等级
        sh.setLevel(s_level)
        # 3、将输出渠道绑定到日志收集器上
        my_log.addHandler(sh)
        # 四、添加输出渠道（输出到文件）
        fh = logging.FileHandler(file_path, encoding="utf8")
        fh.setLevel(f_level)
        my_log.addHandler(fh)
        # 五、设置日志输出的格式
        # 创建一个日志输出格式
        formatter = logging.Formatter('%(asctime)s - [%(filename)s-->line:%(lineno)d] - %(levelname)s: %(message)s')
        # 将输出格式和输出渠道进行绑定
        sh.setFormatter(formatter)
        fh.setFormatter(formatter)

        return my_log


# 调用类的静态方法，创建一个日志收集器
my_log = MyLogger.create_logger()
