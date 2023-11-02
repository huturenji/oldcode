# -*- coding: utf-8 -*-
# @time     : 2022/1/26 14:26
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : test_flight_order.py

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
    wechat_test_pay,
    wait_order_status
)


@allure.epic("商云业务自动化测试")
@allure.suite("机票测试套件")
@allure.feature("机票模块")
class TestAutoCancelFlightOrder:

    @pytest.mark.auto_cancenl_flight_order
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：未支付时，取消机票订单")
    @allure.title("测试用例标题：未支付机票订单，支付倒计时结束后自动取消")
    def test_auto_cancel_flight_order(self, driver):
        # 初始化报销凭证编辑
        edit_flight_invoice = EditFlightInvoice(driver)
        # 初始化编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # -------------------测试步骤 -------------------
        # 机票首页选择日期、城市，然后点击‘查询’进入航班列表页面
        home_page_date_city(driver, 10)
        # 选择航班，然后点击‘预订’按钮，进入编辑订单页面
        choose_flight_and_booking(driver)
        # 报销凭证编辑
        edit_flight_invoice.wait_data_load(False, 2)
        # 判断是否关闭报销凭证按钮，没有即点击之
        edit_flight_invoice.invoice_switch_choose(state="false")
        # 点击“提交订单”按钮，并跳转至支付页面
        edit_order_page.click_submit_order_button_switch()
        # 刷新页面至支付倒计时结束
        used_time = 0
        ele = ""
        while used_time < 38:
            time.sleep(10)
            order_details_page.refresh_page()
            time.sleep(5)
            try:
                driver.find_element(By.XPATH, "//div[text()='已取消']")
                ele = True
                break
            except:
                used_time += 1
            ele = False
        # 断言订单状态
        assert ele is True, "订单状态不是已取消"


@allure.epic("商云业务自动化测试")
@allure.suite("机票测试套件")
@allure.feature("机票模块")
class TestHandleCancelFlightOrder:

    @pytest.mark.handle_cancenl_flight_order
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：未支付时，取消机票订单")
    @allure.title("测试用例标题：未支付机票订单，支付倒计时结束前手动取消")
    def test_handle_cancel_flight_order(self, driver):
        # 初始化报销凭证编辑
        edit_flight_invoice = EditFlightInvoice(driver)
        # 初始化编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # -------------------测试步骤 -------------------
        # 机票首页选择日期、城市，然后点击‘查询’进入航班列表页面
        home_page_date_city(driver, 10)
        # 选择航班，然后点击‘预订’按钮，进入编辑订单页面
        choose_flight_and_booking(driver)
        # 报销凭证编辑
        edit_flight_invoice.wait_data_load(False, 2)
        # 判断是否关闭报销凭证按钮，没有即点击之
        edit_flight_invoice.invoice_switch_choose(state="false")
        # 点击“提交订单”按钮，并跳转至支付页面
        edit_order_page.click_submit_order_button_switch()
        # 点击‘取消订单’按钮
        order_details_page.manual_cancel_order_btn()
        # 确认取消的弹窗中，点击‘确定’
        order_details_page.confirm_manual_cancel_order()
        # 获取toast提示字段
        cancel_toast = order_details_page.get_webview_toast_words("取消成功")
        # 断言'取消成功'的toast提示
        with assume:
            assert cancel_toast, "没有抓取到toast提示"
        # 断言订单状态
        order_details_page.wait_data_load(False, 0.5)
        cancel_status = order_details_page.pay_result_text()
        assert cancel_status == "已取消", "订单状态不是已取消"


@allure.epic("商云业务自动化测试")
@allure.suite("机票测试套件")
@allure.feature("机票模块")
class TestThreePeopleFlightOrder:

    @pytest.mark.three_people_flight_order
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：编辑乘客下单，并支付出票")
    @allure.title("测试用例标题：三人乘客下单，并支付出票")
    def test_three_people_flight_order(self, driver):
        # 初始化编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # -------------------测试步骤 -------------------
        # 机票首页选择日期、城市，然后点击‘查询’进入航班列表页面
        home_page_date_city(driver, 10)
        # 选择航班，然后点击‘预订’按钮，进入编辑订单页面
        choose_flight_and_booking(driver)
        # 点击‘新增’按钮，进入新增乘客页面
        edit_order_page.wait_data_load(False, 1)
        edit_order_page.click_add_passenger_btn()
        # 依次选择2个乘客
        edit_order_page.choose_passenger_list("zhao qin")
        edit_order_page.swipe_up()
        edit_order_page.choose_passenger_list("赵港澳")
        # 确认选择的乘客
        edit_order_page.confirm_choose_passenger()
        # 编辑订单页面，点击‘提交订单’按钮
        edit_order_page.click_submit_order_button_switch()
        # 微信支付校验
        pay_and_check(driver)
        # 等待订单状态变为‘已出票’
        wait_order_complete(driver)


@allure.epic("商云业务自动化测试")
@allure.suite("机票测试套件")
@allure.feature("机票模块")
class TestNinePeopleFlightOrder:

    @pytest.mark.nine_people_flight_order
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：编辑乘客下单，并支付出票")
    @allure.title("测试用例标题：九人乘客下单，并支付出票")
    def test_nine_people_flight_order(self, driver):
        # 初始化编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # -------------------测试步骤 -------------------
        # 机票首页选择日期、城市，然后点击‘查询’进入航班列表页面
        home_page_date_city(driver, 10)
        # 选择航班，然后点击‘预订’按钮，进入编辑订单页面
        choose_flight_and_booking(driver)
        # 点击‘新增’按钮，进入新增乘客页面
        edit_order_page.wait_data_load(False, 1)
        edit_order_page.click_add_passenger_btn()
        # 依次选择8个乘客
        edit_order_page.choose_passenger_list("zhao qin")
        edit_order_page.choose_passenger_list("赵港澳")
        edit_order_page.choose_passenger_list("航六零巴巴")
        edit_order_page.choose_passenger_list("测试")
        edit_order_page.choose_passenger_list("赵身份证")
        edit_order_page.choose_passenger_list("赵其他")
        edit_order_page.choose_passenger_list("赵台胞")
        edit_order_page.choose_passenger_list("赵回乡证")
        # 确认选择的乘客
        edit_order_page.confirm_choose_passenger()
        # 编辑订单页面，点击‘提交订单’按钮
        edit_order_page.click_submit_order_button_switch()
        # 微信支付校验
        pay_and_check(driver)
        # 等待订单状态变为‘已出票’
        wait_order_complete(driver)


@allure.epic("商云业务自动化测试")
@allure.suite("机票测试套件")
@allure.feature("机票模块")
class TestRefundFlightOrder:

    @pytest.mark.refund_flight_order
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：机票下单并出票，然后退票成功")
    @allure.title("测试用例标题：单个乘客下单后，退票成功")
    def test_one_refund_flight_order(self, driver):
        # 初始化订单详情页
        order_details_page = OrderDetailsPage(driver)
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
        # 微信支付校验
        pay_and_check(driver)
        # 等待订单状态变为‘已出票’
        wait_order_complete(driver)
        # 乘客栏点击‘退票’按钮
        order_details_page.click_refund_button()
        # 弹窗确认选择的退票乘客
        order_details_page.click_select_refund_button(1)
        # 点击‘提交申请’按钮
        order_details_page.click_submit_applications()
        # 确认弹窗中点击‘确定’
        order_details_page.click_submit_btn()
        # 已提交申请页面，再次确定
        order_details_page.click_submitted_btn()
        # 返回至订单详情页面，获取订单状态
        wait_order_status(driver, '已退票')
        order_status = order_details_page.pay_result_text()
        # 断言订单状态为：已退票
        assert order_status == "已退票", "订单状态不是已退票，或者退票失败"


@allure.epic("商云业务自动化测试")
@allure.suite("机票测试套件")
@allure.feature("机票模块")
class TestMoreRefundFlightOrder:

    @pytest.mark.more_refund_flight_order
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：机票下单并出票，然后退票成功")
    @allure.title("测试用例标题：多个乘客下单后，退票成功")
    def test_more_refund_flight_order(self, driver):
        # 初始化订单详情页
        order_details_page = OrderDetailsPage(driver)
        # 初始化编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # -------------------测试步骤 -------------------
        # 机票首页选择日期、城市，然后点击‘查询’进入航班列表页面
        home_page_date_city(driver, 10)
        # 选择航班，然后点击‘预订’按钮，进入编辑订单页面
        choose_flight_and_booking(driver)
        # 点击‘新增’按钮，进入新增乘客页面
        edit_order_page.wait_data_load(False, 1)
        edit_order_page.click_add_passenger_btn()
        # 依次选择2个乘客
        edit_order_page.choose_passenger_list("zhao qin")
        edit_order_page.swipe_up()
        edit_order_page.choose_passenger_list("赵港澳")
        # 确认选择的乘客
        edit_order_page.confirm_choose_passenger()
        # 编辑订单页面，点击‘提交订单’按钮
        edit_order_page.click_submit_order_button_switch()
        # 微信支付校验
        pay_and_check(driver)
        # 等待订单状态变为‘已出票’
        wait_order_complete(driver)
        # 乘客栏点击‘退票’按钮
        order_details_page.click_refund_button()
        # 弹窗确认选择的退票乘客
        order_details_page.click_select_refund_button(3)
        # 点击‘提交申请’按钮
        order_details_page.swipe_up()
        order_details_page.click_submit_applications()
        # 确认弹窗中点击‘确定’
        order_details_page.click_submit_btn()
        # 已提交申请页面，再次确定
        order_details_page.click_submitted_btn()
        # 返回至订单详情页面，获取订单状态
        wait_order_status(driver, '已退票')
        order_status = order_details_page.pay_result_text()
        # 断言订单状态为：已退票
        assert order_status == "已退票", "订单状态不是已退票，或者退票失败"


@allure.epic("商云业务自动化测试")
@allure.suite("机票测试套件")
@allure.feature("机票模块")
class TestCertificateRefundFlightOrder:

    # @pytest.mark.skip("运行不稳定，暂时不执行用例")
    @pytest.mark.certificate_refund_flight_order
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：机票下单并出票，然后退票成功")
    @allure.title("测试用例标题：单个乘客下单后，选择上传凭证，然后退票成功")
    def test_certificate_refund_flight_order(self, driver):
        # 初始化订单详情页
        order_details_page = OrderDetailsPage(driver)
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
        # 微信支付校验
        pay_and_check(driver)
        # 等待订单状态变为‘已出票’
        wait_order_complete(driver)
        # 乘客栏点击‘退票’按钮
        order_details_page.click_refund_button()
        # 弹窗确认选择的退票乘客
        order_details_page.click_select_refund_button(1)
        # 点击"退票原因"栏
        order_details_page.click_refund_reason_bar()
        # 选择需要上传凭证的‘退票原因’
        order_details_page.select_refund_reason("航班延误或取消")
        # 点击‘上传凭证’按钮
        order_details_page.click_upload_documents_btn()
        # App环境中选择图片
        order_details_page.click_app_select_image()
        # 点击‘提交申请’按钮
        order_details_page.wait_data_load(True, 2)
        order_details_page.click_submit_applications()
        # 确认弹窗中点击‘确定’
        order_details_page.click_submit_btn()
        # 已提交申请页面，再次确定
        order_details_page.click_submitted_btn()
        # 返回至订单详情页面，获取订单状态
        wait_order_status(driver, '已退票')
        order_status = order_details_page.pay_result_text()
        # 断言订单状态为：已退票
        assert order_status == "已退票", "订单状态不是已退票，或者退票失败"

