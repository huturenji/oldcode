# -*- coding: utf-8 -*-
# @time     : 2021/7/29 17:28
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : order_details_page.py

import allure

from selenium.webdriver.common.by import By
from common.base_page import BasePage


class OrderDetailsPage(BasePage):
    """火车票订单详情页面"""
    # 去支付按钮元素定位器
    payment_button_loc = (By.XPATH, "//*[@class='btn-pay cursorp']")
    # 微信支付测试按钮元素定位器
    wechat_pay_test_loc = (By.XPATH, "//*[contains(text(), '微信支付测试')]")
    # 支付成功后返回订单详情页，“已支付”元素字段
    result_text_loc = (By.CLASS_NAME, "status")

    @allure.step("订单详情页面:点击'去支付'按钮")
    def click_payment_button(self):
        """点击去支付按钮"""
        return self.wait_click_element_success(self.wait_precence_element(self.payment_button_loc, "支付按钮"), "支付按钮")

    @allure.step("订单详情页面:点击'微信支付测试'")
    def wechat_pay(self):
        """点击微信支付测试"""
        return self.click_element(self.wait_element_clickable(self.wechat_pay_test_loc, "微信支付测试"))

    @allure.step("返回订单详情页面:获取订单'已支付'状态")
    def pay_result_text(self):
        return self.wait_precence_element(self.result_text_loc, "订单已支付状态字段").text
