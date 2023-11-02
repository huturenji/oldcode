# -*- coding: utf-8 -*-
# @time     : 2021/8/4 19:05
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : payment_result_page.py

import allure

from selenium.webdriver.common.by import By
from common.base_page import BasePage


class PaymentResultPage(BasePage):
    """火车票支付成功的结果页面"""
    # "付款成功"元素字段定位器
    success_text_loc = (By.XPATH, "//div[@class ='top']/div[@ class ='tit']")
    # 查看订单按钮元素定位器
    check_order_button_loc = (By.XPATH, "//div[@class='submit_btn cursorp']")

    @allure.step("支付成功的结果页面:获取付款成功字段")
    def pay_success_text(self):
        return self.wait_precence_element(self.success_text_loc, "付款成功字段").text

    @allure.step("支付成功的结果页面:点击查看订单按钮")
    def click_check_order_button(self):
        self.click_element(self.wait_element_visible(self.check_order_button_loc, "查看订单按钮"))
