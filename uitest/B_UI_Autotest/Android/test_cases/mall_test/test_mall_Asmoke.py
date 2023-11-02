# -*- coding: utf-8 -*-
# @time     : 2021/6/25 17:47
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : test_mall_asmoke.py

import time
import pytest
import allure
from pytest_assume.plugin import assume

from common.mylogger import my_log
from pages.mall_pages.mall_home_page import MallHomePage
from pages.mall_pages.product_details_page import ProductDetailsPage
from pages.mall_pages.confirm_order_page import ConfirmOrderPage
from pages.mall_pages.payment_page import PaymentPage
from pages.mall_pages.order_details_page import OrderDetailsPage
from pages.mall_pages.cart_page import CartPage
from pages.com_cloud_page import CommercialCloud
from pages.mine_page.mine_page import MinePage
from pages.mine_page.mall_mine_order_page import MallMineOrderPage

# 导入下单流程方法
from test_cases.mall_test.process import (
    submit_order,
    pay,
    buy_goods_now,
    confirm_order,
    pay_and_check
)

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
        # --------------------------------------测试用例步骤--------------------------------------
        # 详情页下单
        buy_goods_now(driver)
        # 提交订单页面，点击‘提交订单’
        submit_order(driver)
        # ‘微信测试’支付，并校验支付结果
        pay_and_check(driver)


@allure.epic("商云业务自动化测试")
@allure.suite("BBC商城测试套件")
@allure.feature("BBC商城模块")
class TestOrderTotalState:

    @pytest.mark.order_total_state
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：搜索商品，下单并支付，等待订单状态完成")
    @allure.title("购买下单测试订单状态至完成; test_order_total_state")
    @pytest.mark.parametrize("goods_search", homepage_search_goods_keywords, indirect=True)
    def test_order_total_state(self, driver, goods_search):
        # 初始化订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # --------------------------------------测试用例步骤--------------------------------------
        # 详情页下单
        buy_goods_now(driver)
        # 提交订单页面，点击‘提交订单’
        submit_order(driver)
        # 支付
        pay(driver)
        # 隔一段时间刷新一次页面
        times = 0
        # 初始化订单状态
        order_status = ""
        while times < 65:
            time.sleep(4)
            # 刷新页面
            order_details_page.refresh_page()
            # 获取订单状态
            order_status = order_details_page.get_order_status_text()
            # print("订单状态:::", order_status)
            # 订单状态完成后停止刷新
            if order_status == "交易完成":
                break
            else:
                times += 1
                # print("等待时间<<<", times * 4)
        # 断言订单状态
        assert order_status == "交易完成", "订单状态不是‘交易完成’"


@allure.epic("商云业务自动化测试")
@allure.suite("BBC商城测试套件")
@allure.feature("BBC商城模块")
class TestConfirmOrderState:

    @pytest.mark.confirm_order_state
    @allure.severity("critical")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：搜索商品，下单并支付，最后手动确认收货")
    @allure.title("搜索商品下单，支付后手动确认收货; test_confirm_order_state")
    @pytest.mark.parametrize("goods_search", homepage_search_goods_keywords, indirect=True)
    def test_confirm_order_state(self, driver, goods_search):
        # 初始化订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # --------------------------------------测试用例步骤--------------------------------------
        # 详情页下单
        buy_goods_now(driver)
        # 提交订单页面，点击‘提交订单’
        submit_order(driver)
        # 支付
        pay(driver)
        # 刷新页面等待订单可以手动确认收货，然后点击‘确认收货’
        confirm_order(driver)
        # 断言订单的状态
        order_details_page.wait_data_load(False, 1)
        order_status_text = order_details_page.get_order_status_text()
        with assume:
            assert order_status_text == "交易完成", "订单状态不是‘交易完成’"


@allure.epic("商云业务自动化测试")
@allure.suite("BBC商城测试套件")
@allure.feature("BBC商城模块")
class TestMallOrderCartSmoke:

    @pytest.mark.mall_cart_smoke
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：添加商品至购物车，然后下单并支付测试")
    @allure.title("购物车一件商品下单支付; test_mall_order_cart_smoke")
    @pytest.mark.parametrize("goods_search", homepage_search_goods_keywords, indirect=True)
    def test_mall_order_cart_smoke(self, driver, goods_search):
        # 初始化商品详情展示页
        product_details_page = ProductDetailsPage(driver)
        # 初始化购物车页面
        cart_page = CartPage(driver)
        # --------------------------------------测试用例步骤--------------------------------------
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
        # 提交订单页面，点击‘提交订单’
        submit_order(driver)
        # ‘微信测试’支付，并校验支付结果
        pay_and_check(driver)


@allure.epic("商云业务自动化测试")
@allure.suite("BBC商城测试套件")
@allure.feature("BBC商城模块")
class TestMoreCartOrder:

    @pytest.mark.more_cart_order
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：添加商品至购物车，然后下单并支付测试")
    @allure.title("购物车多件商品下单支付; test_more_cart_order")
    @pytest.mark.parametrize("cart_page_add_goods", homepage_search_goods_keywords, indirect=True)
    def test_more_cart_order(self, driver, cart_page_add_goods):
        # 初始化商城首页
        mall_home_page = MallHomePage(driver)
        # 初始化购物车页面
        cart_page = CartPage(driver)
        # --------------------------------------测试用例步骤--------------------------------------
        # 商城首页点击‘购物车’按钮
        mall_home_page.click_cart_thumb_btn()
        # 购物车页面，点击‘结算’按钮
        cart_page.wait_data_load(True, 1)
        cart_page.click_account_btn()
        # 提交订单页面，点击‘提交订单’
        submit_order(driver)
        # ‘微信测试’支付，并校验支付结果
        pay_and_check(driver)


@allure.epic("商云业务自动化测试")
@allure.suite("BBC商城测试套件")
@allure.feature("BBC商城模块")
class TestDetailsPageCancelsOrder:

    @pytest.mark.details_page_cancels_order
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：商品下单后不支付，订单取消的场景")
    @allure.title("商品下单后不支付，进入其详情页点击‘取消订单’按钮，取消订单; test_details_page_cancels_order")
    @pytest.mark.parametrize("goods_search", homepage_search_goods_keywords, indirect=True)
    def test_details_page_cancels_order(self, driver, goods_search):
        # 初始化app控件
        com_cloud_page = CommercialCloud(driver)
        # 初始化支付页面
        payment_page = PaymentPage(driver)
        # 初始化‘我的’页面
        mine_page = MinePage(driver)
        # 初始化‘我的订单’页面
        mall_mine_order_page = MallMineOrderPage(driver)
        # 初始化订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # --------------------------------------测试用例步骤--------------------------------------
        # 详情页下单
        buy_goods_now(driver)
        # 提交订单页面，点击‘提交订单’
        submit_order(driver)
        # 等待进入支付页面
        payment_page.wait_btn_click()
        # 点击app原生环境的返回按钮
        com_cloud_page.click_back_button()
        # 点击确认离开弹窗的‘确认离开’选项
        payment_page.click_confirm_leave_btn()
        # 点击app原生环境的返回按钮,返回至详情展示页
        com_cloud_page.click_back_button()
        # 返回至搜索列表页
        com_cloud_page.click_back_button()
        # 返回至商云首页
        com_cloud_page.click_back_button()
        # 点击底部导航栏‘我的’分栏
        com_cloud_page.choose_mine()
        # 点击商城的‘待付款’分类
        mine_page.click_unpaid_order_btn()
        # 点击未支付的订单，进入其详情页
        mall_mine_order_page.click_not_pay_order_one()
        # 点击详情页底部的‘取消订单’按钮
        order_details_page.click_cancel_order_btn()
        # 取消原因选择弹窗中点击‘确定取消’按钮
        order_details_page.click_confirm_cancel_order()
        # 确定取消弹窗中点击‘确定’按钮
        order_details_page.click_cancel_order_confirm()
        # 获取订单状态
        order_details_page.wait_data_load(False, 1)
        order_status = order_details_page.get_order_status_text()
        print(order_status)
        # 断言订单状态
        with assume:
            assert order_status == '已取消', '订单取消失败，或者状态没有变成‘已取消’'


@allure.epic("商云业务自动化测试")
@allure.suite("BBC商城测试套件")
@allure.feature("BBC商城模块")
class TestDetailsPagePayAgain:

    @pytest.mark.details_page_pay_again
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：商品下单后不支付，再次支付的场景")
    @allure.title("商品下单后不支付，进入其详情页点击‘立即支付’按钮，支付成功; test_details_page_pay_again")
    @pytest.mark.parametrize("goods_search", homepage_search_goods_keywords, indirect=True)
    def test_details_page_pay_again(self, driver, goods_search):
        # 初始化app控件
        com_cloud_page = CommercialCloud(driver)
        # 初始化支付页面
        payment_page = PaymentPage(driver)
        # 初始化‘我的’页面
        mine_page = MinePage(driver)
        # 初始化‘我的订单’页面
        mall_mine_order_page = MallMineOrderPage(driver)
        # 初始化订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # --------------------------------------测试用例步骤--------------------------------------
        # 详情页下单
        buy_goods_now(driver)
        # 提交订单页面，点击‘提交订单’
        submit_order(driver)
        # 等待进入支付页面
        payment_page.wait_btn_click()
        # 点击app原生环境的返回按钮
        com_cloud_page.click_back_button()
        # 点击确认离开弹窗的‘确认离开’选项
        payment_page.click_confirm_leave_btn()
        # 点击app原生环境的返回按钮,返回至详情展示页
        com_cloud_page.click_back_button()
        # 返回至搜索列表页
        com_cloud_page.click_back_button()
        # 返回至商云首页
        com_cloud_page.click_back_button()
        # 点击底部导航栏‘我的’分栏
        com_cloud_page.choose_mine()
        # 点击商城的‘待付款’分类
        mine_page.click_unpaid_order_btn()
        # 点击未支付的订单，进入其详情页
        mall_mine_order_page.click_not_pay_order_one()
        # 详情页底部，点击‘立即支付’按钮
        order_details_page.click_pay_now_btn()
        # 使用‘微信测试’再次支付
        pay_and_check(driver)
