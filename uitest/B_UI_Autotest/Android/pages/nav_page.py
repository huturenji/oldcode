# -*- coding: utf-8 -*-
# @time     : 2021/6/24 14:39
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : nav_page.py

import allure
from appium.webdriver.common.mobileby import MobileBy
from selenium.webdriver.common.by import By
from common.base_page import BasePage
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class NavPage(BasePage):
    """伴正事导航栏"""
    # 元素定位器
    # 导航栏：财务元素
    fin_bar_loc = (MobileBy.ID, "com.sinosun.bizmate.ace:id/menu_third")
    # 导航栏：商云元素
    bus_bar_loc = (MobileBy.ID, "com.sinosun.bizmate.ace:id/menu_forth")
    # 导航栏：伴事元素
    work_bar_loc = (MobileBy.ID, "com.sinosun.bizmate.ace:id/menu_second")
    # 名商城首页弹窗‘我知道了’
    know_button_loc = (By.XPATH, "//uni-view[@class='confirmbtn']")
    # ----------------------------登录伴正事后的‘T信’分类页----------------------------
    # 机票icon
    flight_icon_loc = (MobileBy.ANDROID_UIAUTOMATOR,
                       'new UiSelector().resourceId(\"com.sinosun.bizmate.ace:id/tv_working_name\").text("机票")')
    # 酒店icon
    hotel_icon_loc = (MobileBy.ANDROID_UIAUTOMATOR,
                      'new UiSelector().resourceId(\"com.sinosun.bizmate.ace:id/tv_working_name\").text("酒店")')

    @allure.step("伴正事导航栏：选择业务模块")
    def click_nav(self, menu_name):
        """
        伴正事导航栏操作
        :param menu_name: 导航栏名称
        """
        if menu_name == "财务":
            # 点击导航栏：财务
            self.click_element(self.wait_precence_element(self.fin_bar_loc, "导航栏：财务"))
        elif menu_name == "商云":
            # 点击导航栏：商云
            self.click_element(self.wait_precence_element(self.bus_bar_loc, "导航栏：商云"))
        elif menu_name == "伴事":
            self.click_element(self.wait_precence_element(self.work_bar_loc, "导航栏：伴事"))
        else:
            raise ValueError("没有该导航")

    @allure.step("伴正事的T信首页，商旅的机票、酒店首页入口")
    def click_ticket_service(self, name):
        """进入机票、酒店首页的入口"""
        if name == "机票":
            # 点击‘机票’应用
            self.click_element(self.wait_precence_element(self.flight_icon_loc, "伴正事首页的机票icon"))
            # 切换至webview页面
            self.switch_webview('webview')
        elif name == "酒店":
            # 点击‘酒店’应用
            self.click_element(self.wait_precence_element(self.hotel_icon_loc, "伴正事首页的酒店icon"))
            # 切换至webview页面
            self.switch_webview('webview')

    @allure.step("名商城首页：点击‘我知道了’按钮")
    def click_know_but(self):
        try:
            wait = WebDriverWait(self.driver, timeout=10, poll_frequency=0.2).until(
                EC.presence_of_element_located(self.know_button_loc))
            # ele = self.wait_precence_element(locator=self.know_button_loc, step_desc="我知道了按钮", timeout=10,
            #                                  poll_frequency=0.2)
            self.click_element(wait)
        except:
            pass
