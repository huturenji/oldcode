# -*- coding: utf-8 -*-
# @time     : 2021/7/29 16:48
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : edit_order_page.py
import time

from selenium.webdriver.common.by import By
from common.base_page import BasePage


class EditOrderPage(BasePage):
    """火车票编辑订单页面"""
    # 提交订单按钮元素定位器
    submit_order_button_loc = (By.XPATH, "//*[text()= '提交订单']")

    def click_submit_order_button(self):
        """点击提交订单按钮，跳转至订单详情标签页"""
        self.switch_to_new_window_wait(
            self.wait_element_clickable(self.submit_order_button_loc, "提交订单"),
            "火车票订单详情页",
            frequcy=0.2
        )



