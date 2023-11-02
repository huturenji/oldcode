# -*- coding: utf-8 -*-
# @time     : 2021/12/21 0:47
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : confirm_order_page.py

import allure
from selenium.webdriver.common.by import By
from common.base_page import BasePage


class ConfirmOrderPage(BasePage):
    """确认订单页"""
    # ‘提交订单’按钮
    confirm_order_btn_loc = (By.XPATH, "//uni-text[@class='submit flex_row_center_center']/span")

    @allure.step("确认订单页面：点击‘提交订单’按钮")
    def click_confirm_order_btn(self):
        self.click_element(self.wait_precence_element(self.confirm_order_btn_loc, "‘提交订单’"))
