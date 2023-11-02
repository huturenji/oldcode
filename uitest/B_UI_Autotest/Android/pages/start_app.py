# -*- coding: utf-8 -*-
# @time     : 2021/6/23 14:21
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : login.py

import time
import allure
from appium.webdriver.common.mobileby import MobileBy
from selenium.webdriver.common.by import By
from common.base_page import BasePage
from appium.webdriver.common.touch_action import TouchAction
from selenium.webdriver.common.touch_actions import TouchActions
# 导入日志模块
from common.mylogger import my_log


class StartApp(BasePage):
    # 元素定位器
    cancel_button = (MobileBy.ID, "com.sinosun.bizmate.ace:id/negative_bt")
    # 是否开启伴正事悬浮框的提示
    temporarily_not_open_loc = (MobileBy.ID, "com.sinosun.bizmate.ace:id/negative_bt")
    # App引导页
    app_guide_loc = (MobileBy.ID, "com.sinosun.bizmate.ace:id/guide_main")

    @allure.step("启动伴正事App")
    def start_app(self):
        """启动伴正事App"""
        my_log.info("##################################开始启动伴正事app##################################")
        # 切换至安卓原生环境
        self.click_element(self.wait_precence_element(self.cancel_button, "自启动取消按钮"))
        # 不开启伴正事的悬浮框
        # self.click_element(self.wait_precence_element(self.temporarily_not_open_loc, "暂不开启伴正事悬浮框"))
        # App的引导页
        # for i in range(4):
        #     self.click_element(self.wait_element_visible(self.app_guide_loc, "下一步"))
        my_log.info("--------------------------------登录完成--------------------------------")
