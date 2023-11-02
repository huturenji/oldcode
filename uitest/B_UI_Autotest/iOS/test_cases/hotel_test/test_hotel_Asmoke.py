# -*- coding: utf-8 -*-
# @time     : 2021/8/25 18:36
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : test_hotel_smoke.py

import time
import pytest
import allure

from pytest_assume.plugin import assume
from pages.com_cloud_page import CommercialCloud
from pages.hotel_pages.hotel_home_page import HotelHomePage
from pages.hotel_pages.hotel_list_page import HotelListPage
from pages.hotel_pages.hotel_details_page import HotelDetailsPage
from pages.hotel_pages.edit_order_page import EditOrderPage
from pages.hotel_pages.order_details_page import OrderDetailsPage
from pages.hotel_pages.payment_result_page import PaymentResultPage

# 导入测试数据
from data.hotel_data.hotel_data import (
    hotel_online_pay_search_keywords,
    hotel_to_pay_yes_keywords,
    hotel_to_pay_keywords
)


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestHotelOnlinePay:

    @pytest.mark.hotel_smoke
    @pytest.mark.test
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：在线付酒店冒烟测试")
    @allure.title("{test_info[title]}, test_hotel_online_pay_order_smoke")
    @pytest.mark.parametrize("test_info", hotel_online_pay_search_keywords)
    def test_hotel_online_pay_order_smoke(self, test_info, driver):
        """在线付酒店单人入住下单冒烟测试"""
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化酒店首页
        hotel_home_page = HotelHomePage(driver)
        # 初始化酒店列表页
        hotel_list_page = HotelListPage(driver)
        # 初始化酒店详情页
        hotel_details_page = HotelDetailsPage(driver)
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # -------------------测试步骤 -------------------
        # 选择入住、离店时间
        hotel_home_page.selection_day(test_info["check_in_date"], test_info["check_out_date"])
        # 选择城市
        hotel_home_page.select_city_entrance()
        hotel_home_page.select_city("武汉")
        # 输入酒店搜索关键字
        hotel_home_page.search_hotel_text(test_info["keywords"])
        # 点击查询按钮
        hotel_home_page.click_search_button()
        # 酒店列表页去除价格区间推荐
        hotel_list_page.wait_data_load(False, 2)
        hotel_list_page.click_price_star_search_btn()
        # 重置价格区间推荐
        hotel_list_page.wait_data_load(False, 1)
        hotel_list_page.click_reset_button()
        # 确认重置推荐
        hotel_list_page.click_complete_button()
        # 点击搜索按钮
        hotel_list_page.wait_data_load(False, 1)
        hotel_list_page.search_enter()
        hotel_list_page.wait_data_load(False, 1)
        # 酒店列表选择酒店
        hotel_list_page.click_hotel_list()
        # 酒店详情页选择房型
        hotel_details_page.click_room_type(test_info["room"])
        # 点击"在线付"按钮
        hotel_details_page.click_payment_methon_button(method=test_info["method"], room_name=test_info["room"])
        # 点击“提交订单”按钮，跳转至订单详情页
        edit_order_page.wait_data_load(False, 2)
        # print("～～～～提交订单前所有的窗口句柄", driver.window_handles)
        edit_order_page.click_submit_order_button_switch()
        # print("～～～～提交订单后所有的窗口句柄", driver.window_handles)
        # 点击“去支付”
        # print("～～～～去支付页面，所在的窗口句炳", driver.current_window_handle)
        order_details_page.click_payment_button()
        # 点击微信支付测试
        order_details_page.wechat_pay()
        # 断言支付成功
        result = payment_result_page.pay_success_text()
        with assume:
            assert result == "付款成功！", "付款不成功，或者没有出现结果页面"
        # 点击“查看详情”按钮
        payment_result_page.click_check_order_button()
        # 断言订单状态
        order_details_page.wait_data_load(False, 1)
        order_status = order_details_page.pay_result_text()
        with assume:
            assert order_status == "已支付，待确认", "订单状态不是已支付"
        # 点击'取消订单'按钮
        order_details_page.click_cancel_order_button()
        # 确认取消订单
        order_details_page.click_confirm_cancel_order_button()
        # 断言订单已取消状态
        order_details_page.wait_data_load(False, 5)
        cancel_status = order_details_page.cancel_order_status()
        assert cancel_status == "已取消", "订单状态不是已取消"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestHotelToPayNo:

    @pytest.mark.hotel_smoke
    @pytest.mark.hotel_topay
    @allure.severity("blocker")
    @allure.testcase("")
    @allure.story("测试场景：到店付酒店无需信用卡冒烟测试")
    @allure.title("到店付酒店无需信用卡, test_hotel_to_pay_smoke")
    @pytest.mark.parametrize("hotel_details", hotel_to_pay_keywords, indirect=True)
    def test_hotel_to_pay_smoke(self, driver, hotel_details):
        """到店付酒店单人入住下单冒烟测试，无需信用卡担保"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # -------------------测试步骤 -------------------
        # 选择无需担保
        edit_order_page.wait_data_load(True, 1)
        edit_order_page.search_guarantee_button()
        # 点击“提交订单”按钮，跳转至订单详情页
        edit_order_page.click_submit_order_button()
        # 断言到店付下单成功的提示字段
        order_details_page.wait_data_load(False, 1)
        result = payment_result_page.submit_success_text()
        with assume:
            assert result == "提交成功！", "到店付下单不成功，或者没有出现结果页面"
        # 点击“查看详情”按钮
        payment_result_page.click_check_order_button_switch()
        # 断言订单状态
        order_details_page.wait_data_load(False, 0.5)
        order_status = order_details_page.to_pay_result_text()
        assert order_status == "待确认", "订单状态不是待确认"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestHotelToPayYes:

    @pytest.mark.hotel_smoke
    @pytest.mark.hotel_topay_yes
    @allure.severity("blocker")
    @allure.testcase("http://zentao.sino.sz/index.php?m=testcase&f=view&caseID=145580&version=1")
    @allure.story("测试场景：到店付酒店需要信用卡冒烟测试")
    @allure.title("{test_info[title]}, test_hotel_to_pay_yes")
    @pytest.mark.parametrize("hotel_details", hotel_to_pay_keywords, indirect=True)
    @pytest.mark.parametrize("test_info", hotel_to_pay_yes_keywords)
    def test_hotel_to_pay_yes(self, test_info, hotel_details, driver):
        """到店付酒店单人入住下单冒烟测试，需要信用卡担保"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # -------------------测试步骤 -------------------
        # 点击“去担保”按钮，跳转至验证银行卡信息标签页
        edit_order_page.wait_data_load(True, 2)
        edit_order_page.click_guarantee_button_switch()
        # 输入信用卡号
        order_details_page.input_credit_card(test_info["credit_card"])
        # 输入CVV2码
        order_details_page.input_cvv2_num(test_info["CVV2"])
        # 输入持卡人姓名
        order_details_page.input_cardholder_name(test_info["cardholder"])
        # 输入证件号码
        order_details_page.input_idcard_number(test_info["IDcard"])
        # 输入手机号
        order_details_page.input_phone_number(test_info["phone_number"])
        # 点击获取验证码
        order_details_page.click_verify_code_btn()
        time.sleep(1)
        # 输入验证码
        order_details_page.input_verify_code(test_info["verify"])
        # 点击提交按钮
        order_details_page.click_submit_button()
        # 断言订单状态
        order_details_page.wait_data_load(False, 0.5)
        order_status = order_details_page.to_pay_result_text()
        assert order_status == "待确认", "订单状态不是待确认"
