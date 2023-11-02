# -*- coding: utf-8 -*-
# @time     : 2022/1/27 11:17
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : test_flight_people.py

import time

import pytest
import allure

from selenium.webdriver.common.by import By
from pytest_assume.plugin import assume
from pages.flight_pages.flight_home_page import FlightHomePage
from pages.flight_pages.flight_number_list_page import FlightNumberListPage
from pages.flight_pages.flight_details_page import FlightDetailsPage
from pages.flight_pages.edit_order_page import EditOrderPage
from pages.flight_pages.order_details_page import OrderDetailsPage
from pages.flight_pages.payment_result_page import PaymentResultPage
from pages.flight_pages.edit_flight_invoice import EditFlightInvoice

from test_cases.flight_test.process import (
    home_page_date_city,
    choose_flight_and_booking,
    pay_and_check,
    wait_order_complete,
    wechat_test_pay
)


@allure.epic("商云业务自动化测试")
@allure.suite("机票测试套件")
@allure.feature("机票模块")
class TestChildFlightOrder:

    @pytest.mark.child_flight_order
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：不同乘客属性下单")
    @allure.title("测试用例标题：未满12岁的儿童不能购票")
    def test_child_flight_order(self, driver):
        pass
