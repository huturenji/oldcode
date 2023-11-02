# -*- coding: utf-8 -*-
# @time     : 2021/9/26 16:39
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : business_front_page.py

import allure

from selenium.webdriver.common.by import By
from common.base_page import BasePage


class BusinessFrontPage(BasePage):
    """商云首页进入的我的商旅页面"""
    # ‘全部订单’按钮
    all_order_loc = (By.XPATH, "//div[@class='item'][1]//*[name()='svg']")

    @allure.step("我的商旅首页：点击全部订单按钮进入我的订单页面")
    def click_all_order_button(self):
        self.switch_to_new_window_wait(
            self.wait_precence_element(self.all_order_loc, "全部订单按钮"),
            "我的商旅首页"
        )
