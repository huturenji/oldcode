# -*- coding: utf-8 -*-
# @time     : 2021/12/21 15:03
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : order_details_page.py

import allure
from selenium.webdriver.common.by import By
from common.base_page import BasePage


class OrderDetailsPage(BasePage):
    """订单详情页"""
    # 订单详情页顶部，订单状态字段
    order_status_loc = (By.XPATH, "//uni-view[@class='state_title']//span")

    @allure.step("订单详情页面：获取订单详情页的状态字段")
    def get_order_status_text(self):
        return self.wait_element_visible(self.order_status_loc, "订单详情页，状态字段").text
