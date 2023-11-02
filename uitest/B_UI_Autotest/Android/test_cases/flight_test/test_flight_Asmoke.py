# -*- coding: utf-8 -*-
# @time     : 2021/8/12 17:32
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : test_flight_Asmoke.py

import time

import pytest
import allure

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
    wechat_test_pay,
    quick_payment
)


@allure.epic("商云业务自动化测试")
@allure.suite("机票测试套件")
@allure.feature("机票模块")
class TestFlightOrder:

    @pytest.mark.flight_smoke
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：冒烟测试")
    @allure.title("测试用例标题：单人乘客机票下单冒烟")
    def test_flight_order_smoke(self, driver):
        """机票单人乘客下单冒烟测试"""
        # 初始化报销凭证编辑
        edit_flight_invoice = EditFlightInvoice(driver)
        # 初始化编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # -------------------测试步骤 -------------------
        # 机票首页选择日期、城市，然后点击‘查询’进入航班列表页面
        home_page_date_city(driver, 10)
        # 选择航班，然后点击‘预订’按钮，进入编辑订单页面
        choose_flight_and_booking(driver)
        # 报销凭证编辑
        edit_flight_invoice.wait_data_load(False, 1)
        # 判断是否关闭报销凭证按钮，没有即点击之
        edit_flight_invoice.invoice_switch_choose(state="false")
        # 点击“提交订单”按钮，并跳转至支付页面
        edit_order_page.click_submit_order_button_switch()
        # 校验当前页面的title
        title = driver.title
        with assume:
            assert title == '订单详情'
        # 微信支付校验
        pay_and_check(driver)
        # 等待订单状态变为‘已出票’
        wait_order_complete(driver)


@allure.epic("商云业务自动化测试")
@allure.suite("机票测试套件")
@allure.feature("机票模块")
class TestFlightEditPageInvoice:

    @pytest.mark.flight_edit_order_invoice
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：冒烟测试")
    @allure.title("机票下单时开具报销凭证流程；test_flight_edit_order_invoice")
    def test_flight_edit_order_invoice(self, driver):
        # 初始化报销凭证编辑
        edit_flight_invoice = EditFlightInvoice(driver)
        # 初始化编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # -------------------测试步骤 -------------------
        # 机票首页选择日期、城市，然后点击‘查询’进入航班列表页面
        home_page_date_city(driver, 10)
        # 选择航班，然后点击‘预订’按钮，进入编辑订单页面
        choose_flight_and_booking(driver)
        # 报销凭证编辑
        edit_flight_invoice.wait_data_load(False, 1)
        # 判断是否关闭报销凭证按钮，没有即点击之
        edit_flight_invoice.invoice_switch_choose(state="true")
        edit_flight_invoice.wait_data_load(True, 1)
        # 点击‘报销凭证栏’
        edit_flight_invoice.click_invoice_title_selection_bar()
        # 选择‘发票抬头’
        edit_flight_invoice.choose_invoice_title("深圳兆日科技")
        # 点击‘配送地址栏’
        time.sleep(1)
        edit_flight_invoice.click_address_selection_bar()
        # 选择‘配送地址’
        edit_flight_invoice.choose_address_list("赵四")
        # 点击“提交订单”按钮，并跳转至支付页面
        time.sleep(1)
        edit_order_page.click_submit_order_button_switch()
        # 微信支付校验
        pay_and_check(driver)
        # 进入报销凭证页面
        time.sleep(2)
        edit_flight_invoice.click_been_repair_invoice_btn()
        # 获取报销凭证页面的提示语
        result_text = edit_flight_invoice.get_invoice_result_text()
        # 获取报销凭证页面的配送费
        express_price = edit_flight_invoice.get_express_price_text()
        # 断言报销凭证的结果
        with assume:
            assert result_text == "我们将在行程结束后为您寄送报销凭证", "没有进入‘报销凭证’页面"
        with assume:
            assert express_price == "快递 ￥15", "没有显示快递费"


@allure.epic("商云业务自动化测试")
@allure.suite("机票测试套件")
@allure.feature("机票模块")
class TestFlightRepairInvoice:

    @pytest.mark.flight_order_repair_invoice
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：冒烟测试")
    @allure.title("机票下单出票后，补开报销凭证流程；test_flight_repair_invoice")
    def test_flight_repair_invoice(self, driver):
        # 初始化报销凭证编辑
        edit_flight_invoice = EditFlightInvoice(driver)
        # 初始化编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # -------------------测试步骤 -------------------
        # 机票首页选择日期、城市，然后点击‘查询’进入航班列表页面
        home_page_date_city(driver, 10)
        # 选择航班，然后点击‘预订’按钮，进入编辑订单页面
        choose_flight_and_booking(driver)
        # 报销凭证编辑
        edit_flight_invoice.wait_data_load(False, 1)
        # 判断是否关闭报销凭证按钮，没有即点击之
        edit_flight_invoice.invoice_switch_choose(state="false")
        # 点击“提交订单”按钮，并跳转至支付页面
        edit_order_page.click_submit_order_button_switch()
        # 微信支付校验
        pay_and_check(driver)
        # 等待订单状态变为‘已出票’
        wait_order_complete(driver)
        # 点击‘补开报销凭证’按钮
        edit_flight_invoice.wait_data_load(False, 1)
        edit_flight_invoice.click_repair_invoice_btn()
        # 点击‘报销凭证栏’
        # 校验当前页面的title
        title = driver.title
        with assume:
            assert title == '开具报销凭证'
        edit_flight_invoice.been_invoice_title_selection_bar()
        # 选择‘发票抬头’
        edit_flight_invoice.choose_invoice_title("深圳兆日科技")
        # 点击‘配送地址栏’
        time.sleep(1)
        edit_flight_invoice.click_address_selection_bar()
        # 选择‘配送地址’
        edit_flight_invoice.choose_address_list("赵四")
        # 支付快递费
        time.sleep(1)
        wechat_test_pay(driver)
        # 断言支付成功
        edit_flight_invoice.wait_data_load(False, 1)
        result = payment_result_page.pay_success_text()
        with assume:
            assert result == "付款成功", "付款不成功，或者没有出现结果页面"
        # 点击‘完成’按钮
        edit_flight_invoice.click_complete_btn()
        # 再次进入报销凭证页面
        edit_flight_invoice.click_been_repair_invoice_btn()
        # 获取报销凭证页面的提示语
        result_text = edit_flight_invoice.get_invoice_result_text()
        # 获取报销凭证页面的配送费
        express_price = edit_flight_invoice.get_express_price_text()
        # 断言报销凭证的结果
        with assume:
            assert result_text == "我们将在行程结束后为您寄送报销凭证", "没有进入‘报销凭证’页面"
        with assume:
            assert express_price == "快递 ￥15", "没有显示快递费"


@allure.epic("商云业务自动化测试")
@allure.suite("机票测试套件")
@allure.feature("机票模块")
class TestQuickPayment:

    @pytest.mark.skip("公款闪付目前只能在sit环境的‘梦工场’企业下运行")
    @pytest.mark.flight_quick_payment
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：不同支付方式下单")
    @allure.title("测试用例标题：单人乘客机票下单使用‘公款闪付’支付")
    def test_flight_quick_payment(self, driver):
        # 初始化报销凭证编辑
        edit_flight_invoice = EditFlightInvoice(driver)
        # 初始化编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # -------------------测试步骤 -------------------
        # 机票首页选择日期、城市，然后点击‘查询’进入航班列表页面
        home_page_date_city(driver, 10)
        # 选择航班，然后点击‘预订’按钮，进入编辑订单页面
        choose_flight_and_booking(driver)
        # 报销凭证编辑
        edit_flight_invoice.wait_data_load(False, 1)
        # 判断是否关闭报销凭证按钮，没有即点击之
        edit_flight_invoice.invoice_switch_choose(state="false")
        # 点击“提交订单”按钮，并跳转至支付页面
        edit_order_page.click_submit_order_button_switch()
        # 使用‘公款闪付’支付
        quick_payment(driver)
        # 等待订单状态变为‘已出票’
        wait_order_complete(driver)
