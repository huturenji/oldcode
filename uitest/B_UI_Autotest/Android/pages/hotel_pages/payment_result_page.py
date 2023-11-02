# -*- coding: utf-8 -*-
# @time     : 2021/8/15 17:52
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : payment_result_page.py

import allure

from selenium.webdriver.common.by import By
from common.base_page import BasePage


class PaymentResultPage(BasePage):
    """酒店支付成功的结果页面"""
    # 在线付
    # "付款成功"元素字段定位器
    success_text_loc = (By.XPATH, "//div[@class ='top']/div[@ class ='tit']")
    # 查看订单按钮元素定位器
    check_order_button_loc = (By.XPATH, "//button[contains(@class, 'submit_btn normal-btn cursorp')]")
    # 到店付
    # "提交成功"元素字段定位器
    submit_success_text_loc = (By.XPATH, "//div[@class ='top']/div[@ class ='tit']")

    @allure.step("支付成功的结果页面:获取付款成功字段")
    def pay_success_text(self):
        return self.wait_precence_element(self.success_text_loc, "付款成功字段").text

    @allure.step("到店付下单成功的结果页面:获取提交成功字段")
    def submit_success_text(self):
        return self.wait_precence_element(self.submit_success_text_loc, "付款成功字段").text

    @allure.step("支付成功的结果页面:点击查看订单按钮")
    def click_check_order_button(self):
        self.click_element(self.wait_precence_element(self.check_order_button_loc, "查看订单按钮"))

    @allure.step("到店付无需信用卡成功页面：点击查看订单按钮，跳转至订单详情页面")
    def click_check_order_button_switch(self):
        """只用于到店付无需信用卡，结果页面"""
        self.switch_to_new_window_wait(
            self.find_element(self.check_order_button_loc, "查看订单按钮"),
            "到店付无需信用卡成功页面"
        )

