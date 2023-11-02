# -*- coding: utf-8 -*-
# @time     : 2021/8/27 16:20
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : bottom_homepage.py
import time

import allure

from selenium.webdriver.common.by import By
from common.base_page import BasePage


class BottomHomepage(BasePage):
    """机票、火车票、酒店首页底部的导航栏"""
    # 底部导航栏‘行程’按钮
    # journey_button_loc = (By.XPATH, "//div[contains(@class, 'fixed-dom-part')]/descendant::div[@class='iconItem'][2]")
    journey_button_loc = (140, 630)
    # 底部导航栏‘订单’按钮
    # order_button_loc = (By.XPATH, "//div[contains(@class, 'fixed-dom-part')]/descendant::div[@class='iconItem'][3]")
    order_button_loc = (235, 630)
    # 底部导航栏‘我的’按钮
    # mine_button_loc = (By.XPATH, "//div[contains(@class, 'fixed-dom-part')]/descendant::div[@class='iconItem'][4]")
    mine_button_loc = (330, 635)

    @allure.step("首页底部导航栏选择模块")
    def click_bottom_menu(self, menu_name):
        """机票、火车票、酒店首页底部导航栏选择模块"""
        if menu_name == "行程":
            # self.switch_to_new_window_wait(self.find_element(self.journey_button_loc, "底部导航栏行程按钮"))
            self.touch_tap(self.journey_button_loc)
            time.sleep(1)
            self.driver.switch_to.window(self.driver.window_handles[-1])
        elif menu_name == "订单":
            # self.switch_to_new_window_wait(self.find_element(self.order_button_loc, "底部导航栏订单按钮"))
            self.touch_tap(self.order_button_loc)
            time.sleep(1)
            self.driver.switch_to.window(self.driver.window_handles[-1])
        elif menu_name == "我的":
            # self.switch_to_new_window_wait(self.find_element(self.mine_button_loc, "底部导航栏我的按钮"))
            self.touch_tap(self.mine_button_loc)
            time.sleep(1)
            self.driver.switch_to.window(self.driver.window_handles[-1])
        elif menu_name == "地址":
            self.switch_to_new_window_wait(self.find_element((By.XPATH, "//span[text()='配送地址']")))
        else:
            raise ValueError("机票、火车票、酒店首页底部的导航栏，没有这个模块")
