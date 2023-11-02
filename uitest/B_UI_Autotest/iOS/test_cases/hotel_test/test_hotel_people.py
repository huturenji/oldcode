# -*- coding: utf-8 -*-
# @time     : 2021/8/13 19:03
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : test_hotel_people.py
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
    hotel_change_occupant_keywords,
    hotel_add_occupants_keywords,
    hotel_add_two_people_keywords,
    hotel_name_abnormal_scene_keywords
)

# 读取设备信息
device = ReadYaml("caps.yaml").read_yaml()["device"]


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestHotelOccupants:

    @pytest.mark.change_occupant
    @pytest.mark.hotel_smoke
    @allure.severity("critical")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：在线付酒店更改默认入住人测试")
    @allure.title("{test_info[title]}, test_hotel_occupants")
    @pytest.mark.parametrize("test_info", hotel_change_occupant_keywords)
    def test_hotel_occupants(self, test_info, details_page, driver):
        """在线付酒店更改默认入住人测试"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # -------------------测试步骤 -------------------
        # ------------------------入住人编辑---------------------------
        # 删除默认入住人
        edit_order_page.wait_data_load(False, 0.5)
        edit_order_page.clear_people(1)
        # 重新输入入住人
        edit_order_page.input_people(1, test_info["ooccupant_name"])
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
        order_details_page.wait_data_load(False, 0.5)
        order_status = order_details_page.pay_result_text()
        assert order_status == "已支付，待确认", "订单状态不是已支付"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestHotelAddOccupants:

    @pytest.mark.hotel_smoke
    @allure.severity("critical")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：在线付酒店添加入住人测试")
    @allure.title("{test_info[title]}, test_hotel_add_occupants")
    @pytest.mark.parametrize("test_info", hotel_add_occupants_keywords)
    def test_hotel_add_occupants(self, test_info, details_page, driver):
        """在线付酒店添加入住人测试"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # -------------------测试步骤 -------------------
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
        order_details_page.wait_data_load(False, 0.5)
        order_status = order_details_page.pay_result_text()
        assert order_status == "已支付，待确认", "订单状态不是已支付"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestHotelTwoPeople:

    @pytest.mark.hotel_smoke
    @allure.severity("critical")
    @allure.issue("http://zentao.sino.sz/index.php?m=bug&f=view&bugID=60199")
    @allure.story("测试场景：在线付酒店添加护照入住人，手动输入入住人")
    @allure.title("{test_info[title]}, test_hotel_add_two_people")
    @pytest.mark.parametrize("test_info", hotel_add_two_people_keywords)
    def test_hotel_add_two_people(self, test_info, details_page, driver):
        """在线付酒店订单，添加护照入住人，然后手动输入入住人姓名，下单成功"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # -------------------测试步骤 -------------------
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
        # ------------手动输入入住人名称---------------
        # 重新输入入住人
        edit_order_page.input_people(test_info["input_field"], test_info["ooccupant_name"])
        # ------------------------------------------
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
        order_details_page.wait_data_load(False, 0.5)
        order_status = order_details_page.pay_result_text()
        assert order_status == "已支付，待确认", "订单状态不是已支付"


@pytest.mark.skipif(device["platformName"] == "iOS", reason="iOS环境不支持toast提示的验证")
@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestNameAbnormalScene:

    @pytest.mark.toast
    @allure.severity("trivial")
    @allure.testcase("http://zentao.sino.sz/index.php?m=testcase&f=view&caseID=145467&version=1")
    @allure.story("测试场景：酒店下单时，入住人姓名的合规性测试")
    @allure.title("{test_info[title]},test_name_abnormal_scene")
    @pytest.mark.parametrize("test_info", hotel_name_abnormal_scene_keywords)
    def test_name_abnormal_scene(self, test_info, details_page, driver):
        """酒店下单时，入住人姓名的合规性测试"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # --------------------------输入入住人---------------------------
        # 删除入住人
        time.sleep(3)
        edit_order_page.clear_people(1)
        # 重新输入入住人
        edit_order_page.input_people(1, test_info["name"])
        # 点击“提交订单”按钮，跳转至订单详情页
        edit_order_page.click_submit_order_button()
        # 获取toast提示
        toast_result = edit_order_page.get_webview_toast_words(test_info["expected"])
        # 断言toast
        with assume:
            assert toast_result is True
