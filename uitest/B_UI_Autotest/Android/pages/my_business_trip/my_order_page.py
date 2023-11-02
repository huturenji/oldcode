# -*- coding: utf-8 -*-
# @time     : 2021/8/27 17:32
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : my_order_page.py

import allure

from selenium.webdriver.common.by import By
from common.base_page import BasePage


class MyOrderPage(BasePage):
    """我的订单页面"""
    # 酒店订单列表中，取消按钮
    hotel_cancel_button_loc = (By.XPATH, "//div[contains(@class, 'order-item')][1]//button")

    @allure.step("我的订单页面：待支付酒店列表点击取消按钮")
    def click_hotel_cancel_btn(self):
        self.click_element(self.wait_element_clickable(self.hotel_cancel_button_loc, "酒店列表取消按钮"))

    @allure.step("我的订单页面：点击酒店列表")
    def click_hotel_list(self, number):
        hotel_list = (By.XPATH, "(//div[@class='order-detail cursorp'])[{}]".format(number))
        self.switch_to_new_window_wait(self.find_element(hotel_list, "酒店列表"), step_desc="酒店列表页")
