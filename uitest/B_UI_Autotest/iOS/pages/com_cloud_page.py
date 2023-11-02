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

from common.base_page import BasePage
from common.mylogger import my_log


class CommercialCloud(BasePage):
    """商云首页"""
    # 京东企业购按钮元素
    jd_button_loc = (By.XPATH, "//div[@class='topItem jd']")
    # 苏宁企业购按钮元素
    sn_button_loc = (By.XPATH, "//div[@class='topItem suning']")
    # 火车票按钮元素
    train_button_loc = (By.XPATH, "//div[@class='topItem train']")
    # 机票按钮元素
    flight_button_loc = (By.XPATH, "(//*[text()='订机票'])[1]")
    # 酒店按钮元素
    hotel_button_loc = (By.XPATH, "(//*[text()='订酒店'])[1]")
    # 商云业务小程序的关闭"X"按钮
    # close_applet_loc = (MobileBy.IOS_CLASS_CHAIN, '**/XCUIElementTypeButton[`label == "btn nav systemclose"`]')
    close_applet_loc = (MobileBy.IOS_PREDICATE, 'label == "btn nav systemclose"')
    # ios原生页面左上角的返回按钮
    back_button_loc = (MobileBy.IOS_PREDICATE, 'label == "btn nav back nor"')
    # iOS原生页面右上角的三点
    # three_point_loc = (MobileBy.IOS_PREDICATE, 'label == "btn nav systemmore"')
    # iOS原生页面的刷新按钮
    # refresh_button_loc = (MobileBy.IOS_PREDICATE, 'label == "刷新" AND name == "刷新" AND type == "XCUIElementTypeButton"')
    # ------------------------------------------商云更改后的元素----------------------------------------
    # 名商城下面的‘服务汇’
    service_summary_loc = (By.XPATH, "//div[contains(text(), '服务汇')]")

    @allure.step("商云首页:选择业务模块")
    def click_commercial(self, menu_name):
        """商云首页操作"""
        if menu_name == "订火车票":
            self.switch_to_new_window(self.find_element(self.train_button_loc, "火车票首页的按钮"), "火车票首页的按钮")
        elif menu_name == "订机票":
            self.switch_to_new_window(element_located=self.find_element(self.flight_button_loc, "机票首页的按钮"),
                                      step_desc="商云首页", method="js")
        elif menu_name == "订酒店":
            self.switch_to_new_window(element_located=self.find_element(self.hotel_button_loc, "酒店首页的按钮"),
                                      step_desc="商云首页", method="js")
        else:
            raise ValueError("商云没有该业务")

    @allure.step("名商城首页：点击下面导航栏的服务汇")
    def choose_function(self):
        # 选择‘服务汇’
        self.click_element(self.wait_element_visible(self.service_summary_loc, "点击服务汇"))

    @allure.step("点击关闭小程序按钮，返回商云首页")
    def close_applet(self, step_desc=None, timeout=3, poll_frequency=0.5):
        locator = self.close_applet_loc
        try:
            wait = WebDriverWait(self.driver, timeout, poll_frequency=poll_frequency).until(
                EC.visibility_of_element_located(locator))
            wait.click()
            my_log.info("等待:{} - 元素'{}'被加载成功。".format(step_desc, locator))
        except:
            my_log.info("等待:{} - 元素'{}'被加载失败！".format(step_desc, locator))

    @allure.step("点击页面左上角的返回按钮，并切换至当前的webview页面")
    def click_back_button(self):
        self.switch_webview()
        self.click_element(self.find_element(self.back_button_loc, "点击页面左上角的返回按钮"))
        self.switch_webview("webview")
        time.sleep(1)
        # print("返回后页面所有的窗口句柄", self.driver.window_handles)
        # print("返回后当前页面所在页面的窗口句柄", self.driver.current_window_handle)
