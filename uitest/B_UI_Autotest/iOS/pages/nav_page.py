# -*- coding: utf-8 -*-
# @time     : 2021/6/24 14:39
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : nav_page.py
import time

from appium.webdriver.common.mobileby import MobileBy
from common.base_page import BasePage


class NavPage(BasePage):
    """伴正事导航栏"""
    # 元素定位器
    # 伴正事首页底部导航栏：商云
    bus_bar_loc = (260, 640)
    # ----------伴正事首页-----------
    # 机票icon
    flight_icon_loc = (MobileBy.IOS_PREDICATE, 'label == "机票"')
    # 酒店icon
    hotel_icon_loc = (MobileBy.IOS_PREDICATE, 'label == "酒店"')

    def click_nav(self, menu_name):
        """
        伴正事导航栏操作
        :param menu_name: 导航栏名称
        """
        if menu_name == "商云":
            # 点击导航栏：商云
            self.touch_tap(self.bus_bar_loc)
        elif menu_name == '机票':
            print("商云首页所有环境", self.driver.contexts)
            self.click_element(self.wait_element_clickable(self.flight_icon_loc, "机票icon"))
            print("点击机票后，进入的页面所有环境", self.driver.contexts)
            # 进入机票webview环境
            time.sleep(2)
            self.switch_webview("webview")
            print("切换至机票H5页面后所在的环境", self.driver.current_context)
        elif menu_name == '酒店':
            print("商云首页所有环境", self.driver.contexts)
            self.click_element(self.wait_element_visible(self.hotel_icon_loc, "酒店icon"))
            print("点击酒店后，进入的页面所有环境", self.driver.contexts)
            # 进入酒店webview环境
            time.sleep(2)
            self.switch_webview("webview")
            print("切换至酒店H5页面后所在的环境", self.driver.current_context)
        else:
            raise ValueError("没有该导航")

    def click_page_blank(self):
        # 商云首页空白处坐标
        page_blank_loc = (int(self.width() * 0.03), int(self.height() * 0.15))
        return self.touch_tap(page_blank_loc)
