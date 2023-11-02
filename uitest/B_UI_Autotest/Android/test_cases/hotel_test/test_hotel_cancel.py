# -*- coding: utf-8 -*-
# @time     : 2021/8/26 16:27
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : test_hotel_cancel.py

import time
import pytest
import allure

from pytest_assume.plugin import assume
from selenium.webdriver.common.by import By

from pages.hotel_pages.edit_order_page import EditOrderPage
from pages.hotel_pages.order_details_page import OrderDetailsPage
from pages.my_business_trip.bottom_homepage import BottomHomepage
from pages.com_cloud_page import CommercialCloud
from pages.my_business_trip.my_order_page import MyOrderPage


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestManuallyCancelHotel:

    @pytest.mark.hotel_cancel
    @pytest.mark.handle_cancel
    @allure.severity("critical")
    @allure.story("测试场景：在线付酒店不支付时手动取消")
    @allure.title("手动取消未支付酒店订单, test_manually_cancel_hotel")
    def test_manually_cancel_hotel(self, details_page, driver):
        """酒店订单未支付时，10分钟内手动取消订单"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # -------------------测试步骤 -------------------
        # 点击“提交订单”按钮，跳转至订单详情页
        order_details_page.wait_data_load(False, 0.5)
        edit_order_page.click_submit_order_button_switch()
        # 点击'取消订单'按钮
        order_details_page.click_no_pay_cancel_order()
        # 点击“确定”按钮，确认取消
        order_details_page.click_no_pay_cancel_confirm()
        # 断言订单状态
        order_details_page.wait_data_load(False, 0.5)
        cancel_status = order_details_page.cancel_order_status()
        assert cancel_status == "已取消", "订单状态不是已取消"


@pytest.mark.skip(reason="一般测试时，跳过该用例，因为需要10分钟才能完成用例")
@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestAutoCancelHotel:

    @pytest.mark.hotel_cancel
    @pytest.mark.auto_cancel_hotel
    @allure.severity("critical")
    @allure.story("测试场景：在线付酒店不支付时自动取消")
    @allure.title("未支付酒店订单等待自动取消, test_autocancel_hotel")
    def test_autocancel_hotel(self, details_page, driver):
        """酒店订单未支付时，10分钟后自动取消订单"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # -------------------测试步骤 -------------------
        # 点击“提交订单”按钮，跳转至订单详情页
        order_details_page.wait_data_load(False, 0.5)
        edit_order_page.click_submit_order_button_switch()
        used_time = 0
        timeout = 25
        ele = ""
        while used_time < timeout:
            time.sleep(28)
            edit_order_page.refresh_page()
            time.sleep(3)
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
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestOrderCancelHotel:

    @pytest.mark.order_cancel
    @pytest.mark.hotel_cancel
    @allure.severity("critical")
    @allure.story("测试场景：通过酒店订单列表取消酒店")
    @allure.title("酒店订单列表点击‘取消’按钮, test_order_cancel_hotel")
    def test_order_cancel_hotel(self, details_page, driver):
        """酒店订单未支付时，10分钟内在订单列表点击‘取消’按钮"""
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化酒店首页底部的导航栏
        bottom_homepage = BottomHomepage(driver)
        # 初始化我的订单页面
        my_order_page = MyOrderPage(driver)
        # -------------------测试步骤 -------------------
        # 点击“提交订单”按钮，跳转至订单详情页
        order_details_page.wait_data_load(False, 0.5)
        edit_order_page.click_submit_order_button_switch()
        # 点击返回按钮
        order_details_page.wait_data_load(False, 0.5)
        com_cloud_page.click_back_button()
        # 酒店首页底部导航栏点击“订单”
        bottom_homepage.click_bottom_menu("订单")
        # 待支付酒店列表点击取消按钮
        my_order_page.click_hotel_cancel_btn()
        # 点击“确定”按钮，确认取消
        order_details_page.click_no_pay_cancel_confirm()
        #  点击被取消的酒店订单
        my_order_page.click_hotel_list(1)
        # 断言订单状态
        order_details_page.wait_data_load(False, 0.5)
        cancel_status = order_details_page.cancel_order_status()
        assert cancel_status == "已取消", "订单状态不是已取消"
