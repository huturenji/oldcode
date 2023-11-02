# -*- coding: utf-8 -*-
# @time     : 2021/6/24 16:43
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : com_cloud_page.py
import time

import allure
from selenium.webdriver.common.by import By
from appium.webdriver.common.mobileby import MobileBy
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from common.mylogger import my_log
from common.base_page import BasePage


class CommercialCloud(BasePage):
    """商云首页"""
    # 火车票按钮元素
    train_button_loc = (By.XPATH, "//div[@class='topItem train']")
    # 机票按钮元素
    flight_button_loc = (By.XPATH, "(//*[text()='订机票'])[1]")
    # 酒店按钮元素
    hotel_button_loc = (By.XPATH, "(//*[text()='订酒店'])[1]")
    # 我的商旅元素
    my_business_travel_loc = (By.XPATH, "(//div[@class='textWrap icon-btn'])[2]")
    # 商云业务小程序的关闭"X"按钮
    close_applet_loc = (By.ID, "com.sinosun.bizmate.ace:id/btn_applet_close")
    # 页面左上角的返回按钮
    back_button_loc = (By.ID, "com.sinosun.bizmate.ace:id/img_back")
    # ------------------------------------------商云更改后的元素----------------------------------------
    # 商城下面导航栏的‘服务汇’
    service_summary_loc = (By.XPATH, "//div[contains(text(), '服务汇')]")
    # 商城下面导航栏的‘我的’
    mine_btn_loc = (By.XPATH, "//div[contains(text(), '我的')]")

    @allure.step("商云首页:选择业务模块")
    def click_commercial(self, menu_name):
        """商云首页操作"""
        if menu_name == "订火车票":
            self.switch_to_new_window(self.find_element(self.train_button_loc, "火车票首页的按钮"), "商云首页")
        elif menu_name == "订机票":
            self.switch_to_new_window_wait(element_located=self.find_element(self.flight_button_loc, "机票首页的按钮"),
                                           step_desc="商云首页", method="js")
        elif menu_name == "订酒店":
            self.switch_to_new_window_wait(element_located=self.find_element(self.hotel_button_loc, "酒店首页的按钮"),
                                           step_desc="商云首页", method="js")
        elif menu_name == "我的商旅":
            self.switch_to_new_window(self.find_element(self.my_business_travel_loc, "我的商旅按钮"), "商云首页")
        else:
            raise ValueError("商云没有该业务")

    @allure.step("BBC商城首页：点击下面导航栏的'服务汇'")
    def choose_function(self):
        # 选择‘服务汇’
        self.click_element(self.wait_element_visible(self.service_summary_loc, "点击服务汇"))

    @allure.step("BBC商城首页：点击下面导航栏的'我的'")
    def choose_mine(self):
        # 选择‘我的’
        self.click_element(self.wait_element_visible(self.mine_btn_loc, "点击‘我的’"))

    @allure.step("点击关闭小程序按钮，返回商云首页")
    def close_applet(self, step_desc=None, timeout=2, poll_frequency=0.5):
        for i in range(1):
            locator = self.close_applet_loc
            try:
                wait = WebDriverWait(self.driver, timeout, poll_frequency=poll_frequency).until(
                    EC.presence_of_element_located(locator))
                wait.click()
                my_log.info("等待:{} - 元素'{}'被加载成功。".format(step_desc, locator))
            except:
                my_log.info("等待:{} - 元素'{}'被加载失败！".format(step_desc, locator))

    @allure.step("点击页面左上角的返回按钮，并切换至当前的webview页面")
    def click_back_button(self):
        self.switch_webview()
        self.click_element(self.wait_element_clickable(self.back_button_loc, "点击页面左上角的返回按钮"))
        self.switch_webview("webview")
        # print("页面所有的窗口句柄", self.driver.window_handles)
        # print("当前页面所在页面的窗口句柄", self.driver.current_window_handle)
