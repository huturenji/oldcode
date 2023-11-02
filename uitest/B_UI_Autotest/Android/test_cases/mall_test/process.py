# -*- coding: utf-8 -*-
# @time     : 2022/1/4 14:53
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : process.py

import time

from pytest_assume.plugin import assume

from common.mylogger import my_log
from pages.mall_pages.confirm_order_page import ConfirmOrderPage
from pages.mall_pages.invoice_page import InvoicePage
from pages.mall_pages.payment_page import PaymentPage
from pages.mall_pages.product_details_page import ProductDetailsPage
from pages.mall_pages.order_details_page import OrderDetailsPage


def buy_goods_now(driver):
    """商品详情展示页，点击‘立即购买’后，默认规格至‘确认订单’页面"""
    # 初始化商品详情展示页
    product_details_page = ProductDetailsPage(driver)
    # ------------------------操作步骤------------------------
    # 在详情展示页点击‘立即购买’按钮
    product_details_page.wait_data_load(False, 1)
    product_details_page.click_buy_now_btn()
    # 在规格选择框中，再次点击‘立即购买’
    product_details_page.click_spec_buy_btn()


def submit_order(driver, invoice=False):
    """确认订单页，不选择发票的情况下提交订单"""
    # 初始化确认订单页面
    confirm_order_page = ConfirmOrderPage(driver)
    # 初始化发票相关操作
    invoice_page = InvoicePage(driver)
    # --------------------------------------测试用例步骤--------------------------------------
    # 确认订单页，点击‘发票’一栏
    confirm_order_page.wait_data_load(True, 2)
    invoice_page.click_invoice_bar()
    # 选择是否需要编辑发票信息
    if invoice is False:
        # 发票选择‘不需要发票’
        confirm_order_page.wait_data_load(True, 0.5)
        invoice_page.choose_no_need_checkbox()
    elif invoice is True:
        # 选择需要发票，编辑发票信息
        edit_invoice(driver)
    # 点击‘确定’按钮，确认发票信息编辑
    invoice_page.click_invoice_confirm_btn()
    # 确认订单页，点击‘提交订单’按钮
    confirm_order_page.click_confirm_order_btn()


def edit_invoice(driver):
    """确认订单页进入的‘我的发票’页，发票信息编辑"""
    # 初始化发票相关操作
    invoice_page = InvoicePage(driver)
    # --------------------------------------测试用例步骤--------------------------------------
    # 选择需要开具发票
    invoice_page.wait_data_load(True, 0.5)
    invoice_page.choose_is_need_checkbox()
    # 选择'商品类别'
    invoice_page.choose_goods_category()
    # 点击‘发票抬头信息’栏
    invoice_page.click_invoice_header_setting_bar()
    # 发票助手列表页面，选择一个发票抬头
    invoice_page.choose_invoice_header_list("深圳兆日科技股份")
    # 清空默认的手机号
    invoice_page.clear_phone_number_input()
    # 重新输入手机号
    invoice_page.input_phone_number('15088690011')


def pay(driver):
    """选择支付方式并支付，然后点击‘查看订单’按钮进入订单详情页面"""
    # 初始化订单支付页面
    payment_page = PaymentPage(driver)
    # ---------------------------------------测试流程---------------------------------------
    # 选择‘微信测试’支付方式
    payment_page.wait_data_load(False, 2)
    payment_page.choose_wechat_test()
    # 点击‘支付’按钮
    payment_page.click_pay_btn()
    my_log.info("---------------------< 支付执行结束 >---------------------")
    # 点击‘查看订单’按钮
    payment_page.click_check_order_btn()


def pay_and_check(driver):
    # 初始化订单支付页面
    payment_page = PaymentPage(driver)
    # 初始化订单详情页面
    order_details_page = OrderDetailsPage(driver)
    # ---------------------------------------测试流程---------------------------------------
    # 选择‘微信测试’支付方式
    payment_page.wait_data_load(False, 2)
    payment_page.choose_wechat_test()
    # 点击‘支付’按钮
    payment_page.click_pay_btn()
    # 进入支付成功的结果页面，获取title
    payment_page.wait_data_load(False, 1)
    title_result = payment_page.pay_result_page_title()
    # 获取'支付成功'字段
    pay_result_text = payment_page.get_result_text()
    # 断言页面title和'支付成功'字段是否出现
    with assume:
        assert title_result == "结果", "页面的title不对，或者没有进入支付成功的结果页面"
    with assume:
        assert pay_result_text == "支付成功", "支付结果不对，或者没有进入支付成功的结果页面"
    # 点击‘查看订单’按钮
    payment_page.click_check_order_btn()
    # 在进入的订单详情页面，获取订单状态
    order_status_text = order_details_page.get_order_status_text()
    # print("获取订单状态：", order_status_text)
    # 断言订单状态
    with assume:
        assert order_status_text == "待发货", "订单详情页面，订单状态不是'待发货'"


def confirm_order(driver):
    """订单详情页面，刷新页面同时点击‘确认收货’按钮，手动确认订单"""
    # 初始化订单详情页面
    order_details_page = OrderDetailsPage(driver)
    # 订单详情页面，等待‘确认收货’按钮出现
    num = 0
    btn = ""
    while num < 40:
        time.sleep(4)
        # 刷新页面
        order_details_page.refresh_page()
        # 查找‘确认订单’按钮
        try:
            # 查找‘确认收货’按钮
            btn = order_details_page.find_confirm_order_btn()
            break
        except:
            num += 1
    # 点击‘确认收货’按钮
    order_details_page.click_element(btn)
    # 弹窗确认收货
    order_details_page.click_pop_ups_confirm_btn()
