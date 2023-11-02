# -*- coding: utf-8 -*-
# @time     : 2021/9/22 14:23
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : test_hotel_invoice.py

import time
import pytest
import allure

from pytest_assume.plugin import assume
from pages.hotel_pages.edit_order_page import EditOrderPage
from pages.hotel_pages.order_details_page import OrderDetailsPage
from pages.hotel_pages.payment_result_page import PaymentResultPage
from pages.com_cloud_page import CommercialCloud
from pages.my_business_trip.business_front_page import BusinessFrontPage
from pages.my_business_trip.repair_invoice_page import RepairInvoicePage
from test_cases.hotel_test.conftest import HotelOrder

# 导入测试数据
from data.hotel_data.hotel_data import (
    invoice_data,
    hotel_invoice_data,
)


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestHotelInvoice:

    @pytest.mark.invoice_smoke
    @allure.severity("critical")
    @allure.testcase("http://zentao.sino.sz/index.php?m=testcase&f=view&t=html&id=146046")
    @allure.story("测试场景：在线付酒店开具报销凭证")
    @allure.title("酒店下单勾选报销凭证，test_hotel_invoice_smoke")
    @pytest.mark.parametrize("hotel_details", invoice_data, indirect=True)
    def test_hotel_invoice_smoke(self, driver, hotel_details):
        """在线付酒店下单时勾选报销凭证，下单成功后开出发票（目前只写到发票开出来之前的场景）"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # -----------------------------------------测试步骤--------------------------------------------
        # 选择报销凭证按钮
        edit_order_page.wait_data_load(False, 0.5)
        if edit_order_page.get_attribute() == "false":
            edit_order_page.click_invoice_switch()
        # 点击“提交订单”按钮，跳转至订单详情页
        edit_order_page.click_submit_order_button_switch()
        # 点击“去支付”
        order_details_page.click_payment_button()
        # 点击微信支付测试
        order_details_page.wechat_pay()
        # 断言支付成功
        order_details_page.wait_data_load(False, 0.5)
        result = payment_result_page.pay_success_text()
        with assume:
            assert result == "付款成功！", "付款不成功，或者没有出现结果页面"
        # 点击“查看详情”按钮
        payment_result_page.click_check_order_button()
        # 断言订单状态
        order_details_page.wait_data_load(False, 0.5)
        order_status = order_details_page.pay_result_text()
        assert order_status == "已支付，待确认", "订单状态不是已支付"
        # --------------------------------发票------------------------------------
        # 点击报销凭证栏的详情
        order_details_page.click_invoice_bar()
        # 点击‘下载PDF’按钮
        order_details_page.click_download_pdf()
        # 获取toast提示
        toast_result = order_details_page.get_webview_toast_words("开票中，请稍等")
        # 断言toast
        with assume:
            assert toast_result is True


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestHotelRepairInvoice:

    @pytest.mark.repair_invoice
    @allure.severity("critical")
    @allure.testcase("http://zentao.sino.sz/index.php?m=testcase&f=view&t=html&id=135195")
    @allure.story("测试场景：在线付酒店开具报销凭证")
    @allure.title("酒店下单成功后详情页补开报销凭证，test_hotel_repair_invoice")
    @pytest.mark.parametrize("hotel_details", invoice_data, indirect=True)
    def test_hotel_repair_invoice(self, driver, hotel_details):
        """在线付酒店下单成功后，在订单详情页补开报销凭证（目前只写到发票开出来之前的场景）"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # -----------------------------------------测试步骤--------------------------------------------
        # 选择报销凭证按钮
        edit_order_page.wait_data_load(False, 0.5)
        if edit_order_page.get_attribute() == "true":
            edit_order_page.click_invoice_switch()
        # 点击“提交订单”按钮，跳转至订单详情页
        edit_order_page.wait_data_load(False, 0.5)
        edit_order_page.click_submit_order_button_switch()
        # 点击“去支付”
        order_details_page.click_payment_button()
        # 点击微信支付测试
        order_details_page.wechat_pay()
        # 断言支付成功
        order_details_page.wait_data_load(False, 0.5)
        result = payment_result_page.pay_success_text()
        with assume:
            assert result == "付款成功！", "付款不成功，或者没有出现结果页面"
        # 点击“查看详情”按钮
        payment_result_page.click_check_order_button()
        # 断言订单状态
        order_details_page.wait_data_load(False, 0.5)
        order_status = order_details_page.pay_result_text()
        assert order_status == "已支付，待确认", "订单状态不是已支付"
        '''
        # --------------------------------发票------------------------------------
        # 等待订单状态变为：‘已确认，待入住’
        for i in range(2):
            time.sleep(31)
            order_details_page.refresh_page()
        # 点击报销凭证栏的'补开报销凭证'按钮
        order_details_page.click_repair_invoice()
        # 点击‘提交’按钮
        order_details_page.click_submit()
        # 点击‘下载PDF’按钮
        order_details_page.click_download_pdf()
        # 获取toast提示
        toast_result = order_details_page.get_webview_toast_words("开票中，请稍等")
        # 断言toast
        with assume:
            assert toast_result is True
        '''


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestCancelHotelInvoice:

    @pytest.mark.cancel_hotel_invoice
    @allure.severity("critical")
    @allure.testcase("")
    @allure.story("测试场景：在线付酒店开具报销凭证")
    @allure.title("在线付酒店下单后取消，不显示补开报销凭证栏; test_cancel_hotel_invoice")
    @pytest.mark.parametrize("hotel_details", invoice_data, indirect=True)
    def test_cancel_hotel_invoice(self, driver, hotel_details):
        """在线付酒店下单成功后取消，订单详情页面没有报销凭证栏"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # -----------------------------------------测试步骤--------------------------------------------
        # 选择报销凭证按钮
        edit_order_page.wait_data_load(False, 0.5)
        if edit_order_page.get_attribute() == "true":
            edit_order_page.click_invoice_switch()
        # 点击“提交订单”按钮，跳转至订单详情页
        edit_order_page.click_submit_order_button_switch()
        # 点击“去支付”
        order_details_page.click_payment_button()
        # 点击微信支付测试
        order_details_page.wechat_pay()
        # 断言支付成功
        order_details_page.wait_data_load(False, 0.5)
        result = payment_result_page.pay_success_text()
        with assume:
            assert result == "付款成功！", "付款不成功，或者没有出现结果页面"
        # 点击“查看详情”按钮
        payment_result_page.click_check_order_button()
        # 等待订单状态变为：‘已确认，待入住’
        for i in range(2):
            time.sleep(31)
            order_details_page.refresh_page()
        # 点击取消订单按钮
        order_details_page.wait_data_load(True, 0.5)
        order_details_page.click_cancel_order_button()
        # 确认取消订单
        order_details_page.click_confirm_cancel_order_button()
        # 断言补开报销凭证按钮消失
        order_details_page.wait_data_load(True, 0.5)
        cancel_status = order_details_page.element_exist()
        assert cancel_status is False, "订单取消后，还有‘补开报销凭证’按钮"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestHotelInvoiceData:

    @pytest.mark.hotel_invoice_data
    @allure.severity("critical")
    @allure.testcase("")
    @allure.story("测试场景：在线付酒店开具报销凭证")
    @allure.title("在线付酒店下单开具报销凭证，进入报销凭证页面后校验凭证信息; test_hotel_invoice_data")
    @pytest.mark.parametrize("hotel_details", invoice_data, indirect=True)
    @pytest.mark.parametrize("test_info", hotel_invoice_data)
    def test_hotel_invoice_data(self, driver, test_info, hotel_details):
        """在线付酒店下单时勾选报销凭证，下单成功后进入报销凭证页校验信息"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # -----------------------------------------测试步骤--------------------------------------------
        # 选择报销凭证按钮
        edit_order_page.wait_data_load(False, 0.5)
        if edit_order_page.get_attribute() == "false":
            edit_order_page.click_invoice_switch()
        # 点击“提交订单”按钮，跳转至订单详情页
        edit_order_page.click_submit_order_button_switch()
        # 点击“去支付”
        order_details_page.click_payment_button()
        # 点击微信支付测试
        order_details_page.wechat_pay()
        # 断言支付成功
        order_details_page.wait_data_load(False, 0.5)
        result = payment_result_page.pay_success_text()
        with assume:
            assert result == "付款成功！", "付款不成功，或者没有出现结果页面"
        # 点击“查看详情”按钮
        payment_result_page.click_check_order_button()
        # 断言订单状态
        order_details_page.wait_data_load(False, 0.5)
        order_status = order_details_page.pay_result_text()
        assert order_status == "已支付，待确认", "订单状态不是已支付"
        # 获取酒店订单的价格
        hotel_price = order_details_page.price_number()
        # --------------------------------发票------------------------------------
        # 点击报销凭证栏的详情
        order_details_page.click_invoice_bar()
        # 获取付款方
        payer = order_details_page.get_payer()
        payer_peo = order_details_page.get_payer_peo()
        # 获取收款方
        collection = order_details_page.get_collection()
        # 获取发票金额
        invoice_amount = order_details_page.get_invoice_amount()
        # 付款方校验
        with assume:
            assert payer == test_info["payer"], "付款方信息不对"
        with assume:
            assert payer_peo == test_info["payer_peo"]
        # 收款方校验
        with assume:
            assert collection == test_info["collection"], "收款方信息不对"
        # 发票金额校验
        with assume:
            assert invoice_amount[1:] == hotel_price, "发票金额不对"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestBulkInvoiceOne:

    @pytest.mark.skip(reason="商云结构更改，等待‘我的商旅’按钮定型后放开用例")
    @pytest.mark.hotel_bulk_invoice_one
    @allure.severity("critical")
    @allure.testcase("")
    @allure.story("测试场景：在线付酒店开具报销凭证")
    @allure.title("在线付酒店下单后，批量补开一个酒店发票; test_bulk_invoice_one")
    def test_bulk_invoice_one(self, driver):
        """在线付酒店下单后，在我的订单页面进入批量开发票页面，一个酒店开具发票流程正常"""
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化我的商旅首页
        business_front_page = BusinessFrontPage(driver)
        # 初始化批量报销凭证页面
        repair_invoice_page = RepairInvoicePage(driver)
        # --------------------------------------测试步骤-----------------------------------
        # 预订有报销凭证的酒店
        HotelOrder().payment_order()
        # 进入我的商旅首页
        com_cloud_page.click_commercial("我的商旅")
        # 点击“全部订单”按钮
        business_front_page.click_all_order_button()
        # 我的订单页面点击“报销凭证”按钮
        repair_invoice_page.invoice_reim_button()
        # 点击酒店批量补开发票入口
        repair_invoice_page.click_hotel_invoice()
        # 查询所有可以批量补开发票的酒店数量
        repair_invoice_page.wait_data_load(False, 0.5)
        result_1 = repair_invoice_page.hotel_list_count()
        # 选择需要批量补开发票的酒店
        repair_invoice_page.choose_hotel_list(1)
        # 点击‘下一步’按钮
        repair_invoice_page.click_next_step()
        # 点击“提交”按钮
        repair_invoice_page.wait_data_load(False, 1)
        repair_invoice_page.click_submit_button()
        # 点击‘知道了’按钮
        repair_invoice_page.click_know_button()
        # 获取补开酒店发票后，剩余可以补开发票的酒店列表数量
        repair_invoice_page.wait_data_load(False, 0.5)
        result_2 = repair_invoice_page.hotel_list_count()
        # 断言批量开发票之后的结果
        with assume:
            assert result_1 - result_2 == 1, "批量开发票后，可开发票酒店数量不对"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestBulkInvoiceTwo:

    @pytest.mark.skip(reason="商云结构更改，等待‘我的商旅’按钮定型后放开用例")
    @pytest.mark.hotel_bulk_invoice_two
    @allure.severity("critical")
    @allure.testcase("")
    @allure.story("测试场景：在线付酒店开具报销凭证")
    @allure.title("在线付酒店下单后，批量补开二个酒店发票; test_bulk_invoice_two")
    def test_bulk_invoice_two(self, driver):
        """在线付酒店下单后，在我的订单页面进入批量开发票页面，一个酒店开具发票流程正常"""
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化我的商旅首页
        business_front_page = BusinessFrontPage(driver)
        # 初始化批量报销凭证页面
        repair_invoice_page = RepairInvoicePage(driver)
        # --------------------------------------测试步骤-----------------------------------
        # 预订有报销凭证的酒店
        HotelOrder().payment_order()
        # 进入我的商旅首页
        com_cloud_page.click_commercial("我的商旅")
        # 点击“全部订单”按钮
        business_front_page.click_all_order_button()
        # 我的订单页面点击“报销凭证”按钮
        repair_invoice_page.invoice_reim_button()
        # 点击酒店批量补开发票入口
        repair_invoice_page.click_hotel_invoice()
        # 查询所有可以批量补开发票的酒店数量
        repair_invoice_page.wait_data_load(False, 0.5)
        result_1 = repair_invoice_page.hotel_list_count()
        # 选择需要批量补开发票的酒店
        repair_invoice_page.choose_hotel_list(1)
        repair_invoice_page.choose_hotel_list(2)
        # 点击‘下一步’按钮
        repair_invoice_page.click_next_step()
        # 点击“提交”按钮
        repair_invoice_page.wait_data_load(False, 1)
        repair_invoice_page.click_submit_button()
        # 点击‘知道了’按钮
        repair_invoice_page.click_know_button()
        # 获取补开酒店发票后，剩余可以补开发票的酒店列表数量
        repair_invoice_page.wait_data_load(False, 0.5)
        result_2 = repair_invoice_page.hotel_list_count()
        # 断言批量开发票之后的结果
        with assume:
            assert result_1 - result_2 == 2, "批量开发票后，可开发票酒店数量不对"
