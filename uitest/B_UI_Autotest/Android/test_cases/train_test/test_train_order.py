# -*- coding: utf-8 -*-
# @time     : 2021/7/27 15:38
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : test_train_order.py
import time

import pytest
import allure

from pytest_assume.plugin import assume
from pages.com_cloud_page import CommercialCloud
from pages.train_pages.train_home_page import TrainHomePage
from pages.train_pages.train_number_list_page import TrainNumberListPage
from pages.train_pages.train_number_details_page import TrainNumberDetailsPage
from pages.train_pages.edit_order_page import EditOrderPage
from pages.train_pages.order_details_page import OrderDetailsPage
from pages.train_pages.payment_result_page import PaymentResultPage


@allure.epic("商云业务自动化测试")
@allure.suite("火车票测试套件")
@allure.feature("火车票模块")
class TestTrainOrder:

    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：冒烟测试")
    @allure.title("测试用例标题：单人乘客火车票下单冒烟")
    @pytest.mark.train_smoke
    def test_train_order_smoke(self, driver):
        """火车票单人乘客下单冒烟测试"""
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化火车票首页
        train_home_page = TrainHomePage(driver)
        # 初始化火车票车次列表页
        train_number_list_page = TrainNumberListPage(driver)
        # 初始化车次详情页
        train_number_details_page = TrainNumberDetailsPage(driver)
        # 初始化编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # 第一步：火车票下单
        com_cloud_page.click_commercial("订火车票")
        # 选择出发日期:第10天
        train_home_page.selection_day(10)
        # 点击查询按钮
        train_home_page.click_search_button()
        # 选择车次
        train_number_list_page.click_train_number()
        # 点击预订按钮
        train_number_details_page.click_reserve_button()
        # 点击“提交订单”按钮
        edit_order_page.wait_data_load(False, 1)
        edit_order_page.click_submit_order_button()
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
        order_status = order_details_page.pay_result_text()
        assert order_status == "已支付", "订单状态不是已支付"


