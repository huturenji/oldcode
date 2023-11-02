# -*- coding: utf-8 -*-
# @time     : 2022/1/21 11:03
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : process.py

import time

from pytest_assume.plugin import assume
from pages.flight_pages.order_details_page import OrderDetailsPage
from pages.flight_pages.payment_result_page import PaymentResultPage


def quick_payment(driver):
    """公款闪付"""
    # 初始化机票订单详情页面
    order_details_page = OrderDetailsPage(driver)
    # 初始化支付成功的结果页面
    payment_result_page = PaymentResultPage(driver)
    # -----------------------------测试步骤-----------------------------
    # 点击“去支付”
    order_details_page.click_payment_button()
    # 点击‘公款闪付’
    order_details_page.click_quick_payment()
    # 切换至App原生环境
    order_details_page.switch_webview()
    # 点击‘支付’
    order_details_page.click_quick_to_pay()
    # 输入密码
    for i in range(6):
        order_details_page.input_quick_pay_pwd()
        time.sleep(0.3)
    # 切换至webview环境
    order_details_page.switch_webview("webview")
