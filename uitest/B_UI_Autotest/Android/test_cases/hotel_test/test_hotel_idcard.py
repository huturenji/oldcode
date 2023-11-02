# -*- coding: utf-8 -*-
# @time     : 2021/8/28 19:42
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : test_hotel_idcard.py

import time
import pytest
import allure

from pytest_assume.plugin import assume
from pages.hotel_pages.edit_order_page import EditOrderPage
from pages.hotel_pages.order_details_page import OrderDetailsPage
from pages.hotel_pages.payment_result_page import PaymentResultPage
from common.read_yaml import ReadYaml

# 导入测试数据
from data.hotel_data.hotel_data import (
    hotel_idcard_data,
    two_idcard_data,
    four_idcard_data,
    hotel_idcard_toast
)

# 读取设备信息
device = ReadYaml("caps.yaml").read_yaml()["device"]


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestHotelIDCardSmoke:

    @pytest.mark.hotel_smoke
    @pytest.mark.hotel_idcard_smoke
    @allure.severity("critical")
    @allure.testcase("http://zentao.sino.sz/index.php?m=testcase&f=view&caseID=145445&version=1")
    @allure.story("测试场景：部分酒店下单时，需要核验入住人的身份证信息")
    @allure.title("默认入住人身份证信息下单, test_default_id")
    @pytest.mark.parametrize("hotel_details", hotel_idcard_data, indirect=True)
    def test_default_id(self, hotel_details, driver):
        """部分酒店下单时，使用入住人默认的身份证下单成功"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # -------------------测试步骤 -------------------
        # 点击“提交订单”按钮，跳转至订单详情页
        edit_order_page.wait_data_load(False, 1)
        edit_order_page.click_submit_order_button_switch()
        # 点击“去支付”
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
        payment_result_page.wait_data_load(False, 1)
        order_status = order_details_page.pay_result_text()
        assert order_status == "已支付，待确认", "订单状态不是已支付"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestTwoHotelIDCard:

    @pytest.mark.idcard_two
    @allure.severity("critical")
    @allure.story("测试场景：部分酒店下单时，需要核验入住人的身份证信息")
    @allure.title("修改默认入住人身份证信息，并添加入住人下单, test_two_hotel_idcard")
    @pytest.mark.parametrize("hotel_details", hotel_idcard_data, indirect=True)
    @pytest.mark.parametrize("test_info", two_idcard_data)
    def test_two_hotel_idcard(self, driver, hotel_details, test_info):
        """部分酒店下单时，修改默认入住人身份证信息，并添加入住人自动带入身份证信息"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # -------------------------------测试步骤 -------------------------------
        # ------------------------添加入住人---------------------------
        edit_order_page.wait_data_load(False, 1)
        # 点击房间数下拉按钮
        edit_order_page.click_number_rooms_search()
        # 选择几间房
        edit_order_page.search_room_number(test_info["room_number"])
        # 点击通讯录按钮
        edit_order_page.check_in_people_btn()
        # 选择一个入住人
        edit_order_page.select_people(test_info["occ_name"])
        # 点击确定按钮，确认选择的入住人
        edit_order_page.confirm_people_button()
        # ------------------删除默认的身份证号，手动输入一个---------------
        edit_order_page.clear_id_card(1)
        edit_order_page.input_id_card(1, test_info["id_card"])
        # 点击“提交订单”按钮，跳转至订单详情页
        edit_order_page.click_submit_order_button_switch()
        # 点击“去支付”
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
        payment_result_page.wait_data_load(False, 1)
        order_status = order_details_page.pay_result_text()
        assert order_status == "已支付，待确认", "订单状态不是已支付"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestThreeHotelIDCard:

    @pytest.mark.idcard_three
    @allure.severity("critical")
    @allure.story("测试场景：部分酒店下单时，需要核验入住人的身份证信息")
    @allure.title("默认、护照、手动输入3位入住人下单，校验身份证信息, test_four_hotel_idcard")
    @pytest.mark.parametrize("hotel_details", hotel_idcard_data, indirect=True)
    @pytest.mark.parametrize("test_info", four_idcard_data)
    def test_three_hotel_idcard(self, driver, hotel_details, test_info):
        """部分酒店下单时，默认、护照、手动输入4位入住人下单，校验身份证信息"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # -------------------------------测试步骤 -------------------------------
        # ------------------------添加入住人---------------------------
        edit_order_page.wait_data_load(False, 1)
        # 点击房间数下拉按钮
        edit_order_page.click_number_rooms_search()
        # 选择几间房
        edit_order_page.search_room_number(test_info["room_number"])
        # 点击通讯录按钮
        edit_order_page.check_in_people_btn()
        # 选择一个入住人
        edit_order_page.select_people(test_info["occ_name_1"])
        # 点击确定按钮，确认选择的入住人
        edit_order_page.confirm_people_button()
        # 手动输入以为入住人
        edit_order_page.input_people(3, test_info["occ_name_2"])
        # ---------------------手动输入身份证号码------------------------
        edit_order_page.input_id_card(2, test_info["id_card_1"])
        edit_order_page.input_id_card(3, test_info["id_card_2"])
        # ------------------------------------------------------------
        # 点击“提交订单”按钮，跳转至订单详情页
        edit_order_page.click_submit_order_button_switch()
        # 点击“去支付”
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
        payment_result_page.wait_data_load(False, 1)
        order_status = order_details_page.pay_result_text()
        assert order_status == "已支付，待确认", "订单状态不是已支付"


@pytest.mark.skipif(device["platformName"] == "iOS", reason="iOS环境不支持toast提示的验证")
@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestIDcardToast:

    @pytest.mark.idcard_toast
    @pytest.mark.toast
    @allure.severity("critical")
    @allure.story("测试场景：部分酒店下单时，入住人身份证信息格式不对")
    @allure.title("{test_info[title]}, test_idcard_toast")
    @pytest.mark.parametrize("hotel_details", hotel_idcard_data, indirect=True)
    @pytest.mark.parametrize("test_info", hotel_idcard_toast)
    def test_idcard_toast(self, driver, hotel_details, test_info):
        """酒店下单需要入住人身份证时，输入不同格式的身份证号进行校验"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # -------------------测试步骤 -------------------
        # 清空身份证输入栏
        time.sleep(3)
        edit_order_page.clear_id_card(1)
        # 身份证栏输入信息
        edit_order_page.input_id_card(1, test_info["data"])
        # 点击“提交订单”按钮，跳转至订单详情页
        edit_order_page.click_submit_order_button()
        # 断言toast
        result = edit_order_page.get_webview_toast_words(test_info["expected"])
        with assume:
            assert result is True
