# -*- coding: utf-8 -*-
# @time     : 2022/1/21 11:03
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : process.py

import time

from pytest_assume.plugin import assume
from pages.flight_pages.flight_home_page import FlightHomePage
from pages.flight_pages.flight_number_list_page import FlightNumberListPage
from pages.flight_pages.flight_details_page import FlightDetailsPage
from pages.flight_pages.edit_order_page import EditOrderPage
from pages.flight_pages.order_details_page import OrderDetailsPage
from pages.flight_pages.payment_result_page import PaymentResultPage
from pages.flight_pages.edit_flight_invoice import EditFlightInvoice


def home_page_date_city(driver, day):
    """
    机票首页选择日期、城市，然后点击‘查询’进入航班列表页面
    :param day: 机票出发日期
    :param driver:
    :return:
    """
    # 初始化机票首页
    flight_home_page = FlightHomePage(driver)
    # -----------------------------测试步骤-----------------------------
    # 选择出发日期
    flight_home_page.selection_day(day)
    # 点击查询按钮
    flight_home_page.wait_data_load(False, 1)
    flight_home_page.click_search_button()


def choose_flight_and_booking(driver):
    """
    选择航班，然后点击‘预订’按钮，进入编辑订单页面
    :param driver:
    :return:
    """
    # 初始化航班班次页
    flight_number_list_page = FlightNumberListPage(driver)
    # 初始化航班班次详情页
    flight_details_page = FlightDetailsPage(driver)
    # -----------------------------测试步骤-----------------------------
    # 选择航班班次
    flight_number_list_page.click_flight_number()
    # 点击'预订'按钮
    flight_details_page.click_reserve_button()


def wechat_test_pay(driver):
    """使用‘微信支付测试’支付"""
    # 初始化机票订单详情页面
    order_details_page = OrderDetailsPage(driver)
    # -----------------------------测试步骤-----------------------------
    # 点击“去支付”
    order_details_page.click_payment_button()
    # 点击微信支付测试
    order_details_page.wechat_pay()


def pay_and_check(driver):
    """使用‘微信支付测试’支付，并进入订单详情查看订单状态是不是‘已支付’"""
    # 初始化机票订单详情页面
    order_details_page = OrderDetailsPage(driver)
    # 初始化支付成功的结果页面
    payment_result_page = PaymentResultPage(driver)
    # -----------------------------测试步骤-----------------------------
    # 点击“去支付”
    order_details_page.click_payment_button()
    # 点击微信支付测试
    order_details_page.wechat_pay()
    # 断言支付成功
    result = payment_result_page.pay_success_text()
    with assume:
        assert result == "付款成功", "付款不成功，或者没有出现结果页面"
    # 点击“查看详情”按钮
    payment_result_page.click_check_order_button()
    # 断言订单状态
    order_details_page.wait_data_load(False, 2)
    order_status = order_details_page.pay_result_text()
    assert order_status == "已支付", "订单状态不是已支付"


def wait_order_complete(driver):
    """支付后，等待订单状态变为‘已出票 ’"""
    # 初始化机票订单详情页面
    order_details_page = OrderDetailsPage(driver)
    # -----------------------------测试步骤-----------------------------
    # 等待机票状态变为“已出票”
    order_status = ""
    times = 0
    while times < 15:
        time.sleep(2)
        order_details_page.refresh_page()
        time.sleep(3)
        order_status = order_details_page.pay_result_text()
        # print("订单状态：", order_status)
        if order_status == "已出票":
            break
        else:
            times += 1
    assert order_status == "已出票", "订单状态不是已出票"


def wait_order_status(driver, status):
    """等待订单状态变化"""
    # 初始化机票订单详情页面
    order_details_page = OrderDetailsPage(driver)
    # -----------------------------测试步骤-----------------------------
    # 等待机票状态变化
    order_status = ""
    times = 0
    while times < 15:
        time.sleep(3)
        order_details_page.refresh_page()
        time.sleep(2)
        order_status = order_details_page.pay_result_text()
        if order_status == status:
            break
        else:
            times += 1
