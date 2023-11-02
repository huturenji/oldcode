# -*- coding: utf-8 -*-
# @time     : 2021/12/21 0:57
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : payment_page.py.py

import allure
from selenium.webdriver.common.by import By
from common.base_page import BasePage


class PaymentPage(BasePage):
    """支付页面、支付之后的结果页面"""
    # '微信测试'支付方式
    wechat_pay_test_loc = (By.XPATH, "//span[text()='微信测试']")
    # ‘支付’按钮
    pay_btn_loc = (By.XPATH, "//uni-view[@class='clickPay']")
    # 订单支付页面点击返回按钮后，弹窗的‘确认离开’按钮
    confirm_leave_btn_loc = (By.CSS_SELECTOR, "div.uni-modal>div.uni-modal__ft>div.uni-modal__btn_default")
    # 支付成功之后的结果页面，‘支付成功’字段
    pay_success_text_loc = (By.XPATH, "//uni-view[@class='top']/uni-view[@class='label']")
    # 支付成功之后的结果页面，‘查看订单’按钮
    check_order_btn_loc = (By.XPATH, "//*[@class='btn cursorp']")

    @allure.step("订单支付页面：选择‘微信测试’方式")
    def choose_wechat_test(self):
        self.click_element(self.wait_element_clickable(self.wechat_pay_test_loc, "选择‘微信测试’"))

    @allure.step("等待进入支付页面")
    def wait_btn_click(self):
        self.wait_element_visible(self.wechat_pay_test_loc, "选择‘微信测试’")

    @allure.step("订单支付页面：点击‘支付’按钮")
    def click_pay_btn(self):
        self.click_element(self.wait_precence_element(self.pay_btn_loc, "‘支付’按钮"))

    @allure.step("订单支付页面：点击返回按钮后，再点击弹窗的‘确认离开’按钮")
    def click_confirm_leave_btn(self):
        self.click_element(self.wait_element_visible(self.confirm_leave_btn_loc, "点击返回按钮后，弹窗的‘确认离开’按钮"))

    @allure.step("支付成功的结果页面：获取title")
    def pay_result_page_title(self):
        return self.driver.title

    @allure.step("支付成功的结果页面：获取‘支付成功’字段")
    def get_result_text(self):
        return self.wait_precence_element(self.pay_success_text_loc, "获取‘支付成功’字段").text

    @allure.step("支付成功的结果页面：点击‘查看订单’按钮")
    def click_check_order_btn(self):
        self.click_element(self.wait_element_visible(self.check_order_btn_loc, "'查看订单'按钮"))
