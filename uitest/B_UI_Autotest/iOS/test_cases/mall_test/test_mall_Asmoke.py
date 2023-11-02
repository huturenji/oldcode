# -*- coding: utf-8 -*-
# @time     : 2021/6/25 17:47
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : test_mall_Asmoke.py

import time
import pytest
import allure
from pytest_assume.plugin import assume

from common.mylogger import my_log

from pages.mall_pages.mall_home_page import MallHomePage
from pages.mall_pages.product_list_page import ProductListPage
from pages.mall_pages.product_details_page import ProductDetailsPage
from pages.mall_pages.confirm_order_page import ConfirmOrderPage
from pages.mall_pages.payment_page import PaymentPage
from pages.mall_pages.order_details_page import OrderDetailsPage
from pages.mall_pages.cart_page import CartPage

# 导入测试数据
from data.mall_data.mall_data import (
    homepage_search_goods_keywords
)


@allure.epic("商云业务自动化测试")
@allure.suite("BBC商城测试套件")
@allure.feature("BBC商城模块")
class TestMallOrderSmoke:

    @pytest.mark.mall_smoke
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：搜索商品，下单并支付冒烟测试")
    @allure.title("立即购买下单冒烟; test_mall_order_smoke")
    @pytest.mark.parametrize("goods_search", homepage_search_goods_keywords, indirect=True)
    def test_mall_order_smoke(self, driver, goods_search):
        # 初始化商品详情展示页
        product_details_page = ProductDetailsPage(driver)
        # 初始化确认订单页面
        confirm_order_page = ConfirmOrderPage(driver)
        # 初始化订单支付页面
        payment_page = PaymentPage(driver)
        # 初始化订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # --------------------------------------测试用例步骤--------------------------------------
        # 在详情展示页点击‘立即购买’按钮
        product_details_page.wait_data_load(False, 2)
        product_details_page.click_buy_now_btn()
        # 在规格选择框中，再次点击‘立即购买’
        product_details_page.click_spec_buy_btn()
        # 点击‘提交订单’按钮
        confirm_order_page.click_confirm_order_btn()
        # 使用‘微信测试’支付
        payment_page.choose_wechat_test()
        # 点击‘支付’按钮
        payment_page.click_pay_btn()
        # 进入支付成功的结果页面，获取title
        payment_page.wait_data_load(False, 1)
        title_result = payment_page.pay_result_page_title()
        # print("页面title：", title_result)
        # 获取'支付成功'字段
        pay_result_text = payment_page.get_result_text()
        # print("页面字段：", pay_result_text)
        # 断言页面title和'支付成功'字段是否出现
        with assume:
            assert title_result == "结果", "页面的title不对，或者没有进入支付成功的结果页面"
        with assume:
            assert pay_result_text == "支付成功", "支付结果不对，或者没有进入支付成功的结果页面"
        # 点击‘查看订单’按钮
        payment_page.click_check_order_btn()
        # 在进入的订单详情页面，获取订单状态
        order_status_text = order_details_page.get_order_status_text()
        # print("订单状态：", order_status_text)
        # 断言订单状态
        with assume:
            assert order_status_text == "待发货", "订单详情页面，订单状态不是'待发货'"


@allure.epic("商云业务自动化测试")
@allure.suite("BBC商城测试套件")
@allure.feature("BBC商城模块")
class TestMallOrderCartSmoke:

    @pytest.mark.mall_cart_smoke
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：添加商品至购物车，然后下单并支付冒烟测试")
    @allure.title("购物车下单冒烟; test_mall_order_cart_smoke")
    @pytest.mark.parametrize("goods_search", homepage_search_goods_keywords, indirect=True)
    def test_mall_order_cart_smoke(self, driver, goods_search):
        # 初始化商品详情展示页
        product_details_page = ProductDetailsPage(driver)
        # 初始化购物车页面
        cart_page = CartPage(driver)
        # 初始化确认订单页面
        confirm_order_page = ConfirmOrderPage(driver)
        # 初始化订单支付页面
        payment_page = PaymentPage(driver)
        # 初始化订单详情页面
        order_details_page = OrderDetailsPage(driver)
        my_log.info("================================测试用例开始================================")
        # 详情展示页，点击页面下方的‘加入购物车’按钮
        product_details_page.wait_data_load(False, 2)
        product_details_page.click_add_cart_btn()
        # 详情展示页，在规格选择框中继续点击‘加入购物车’按钮
        product_details_page.click_spec_add_cart_btn()
        # 获取加入购车成功的toast提示语
        toast_result = product_details_page.get_webview_toast_words(msg="已加入购物车", value='商城')
        # 断言toast提示语
        with assume:
            assert toast_result
        # 详情展示页，点击‘购物车’按钮
        product_details_page.click_cart_btn()
        # 购物车页面，点击‘结算’按钮
        cart_page.wait_data_load(True, 1)
        cart_page.click_account_btn()
        # 确认订单页，点击‘提交订单’按钮
        confirm_order_page.wait_data_load(False, 1)
        confirm_order_page.click_confirm_order_btn()
        # 选择‘微信测试’支付方式
        payment_page.choose_wechat_test()
        # 点击‘支付’按钮
        payment_page.click_pay_btn()
        # 进入支付成功的结果页面，获取title
        payment_page.wait_data_load(False, 1)
        title_result = payment_page.pay_result_page_title()
        # print("页面title：", title_result)
        # 获取'支付成功'字段
        pay_result_text = payment_page.get_result_text()
        # print("页面字段：", pay_result_text)
        # 断言页面title和'支付成功'字段是否出现
        with assume:
            assert title_result == "结果", "页面的title不对，或者没有进入支付成功的结果页面"
        with assume:
            assert pay_result_text == "支付成功", "支付结果不对，或者没有进入支付成功的结果页面"
        # 点击‘查看订单’按钮
        payment_page.click_check_order_btn()
        # 在进入的订单详情页面，获取订单状态
        order_status_text = order_details_page.get_order_status_text()
        # print("订单状态：", order_status_text)
        # 断言订单状态
        with assume:
            assert order_status_text == "待发货", "订单详情页面，订单状态不是'待发货'"
