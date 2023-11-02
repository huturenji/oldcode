# -*- coding: utf-8 -*-
# @time     : 2021/9/3 18:01
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : hotel_trip.py

import time
import pytest
import allure

from pytest_assume.plugin import assume
from pages.hotel_pages.edit_order_page import EditOrderPage
from pages.hotel_pages.order_details_page import OrderDetailsPage
from pages.hotel_pages.payment_result_page import PaymentResultPage
from pages.my_business_trip.bottom_homepage import BottomHomepage
from pages.com_cloud_page import CommercialCloud
from test_cases.hotel_test.conftest import DelectHotelTrip
from pages.my_business_trip.my_trip_page import MyTripPage

# 导入测试数据
from data.hotel_data.hotel_data import (
    hotel_trip_data,
    topay_hotel_trip_data,
    two_people_trip,
    three_people_trip
)


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestHotelTrip:
    # 初始化获取行程数量对象
    trip_list = DelectHotelTrip()

    @pytest.mark.hotel_trip_smoke
    @allure.severity("critical")
    @allure.testcase("")
    @allure.story("测试场景：酒店下单后生成行程，然后取消酒店行程消失")
    @allure.title("在线付酒店订单生成行程，和行程消失 test_hotel_trip_smoke")
    @pytest.mark.parametrize("hotel_details", hotel_trip_data, indirect=True)
    @pytest.mark.parametrize("test_info", hotel_trip_data)
    def test_hotel_trip_smoke(self, driver, hotel_details, test_info):
        """在线付酒店下单后在我的行程中生成行程，然后取消订单，行程消失"""
        # 查询测试酒店已有的行程数量
        count = self.trip_list.get_hotel_tripno(test_info["keywords"])
        print("元素行程数据", count)
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化酒店首页底部的导航栏
        bottom_homepage = BottomHomepage(driver)
        # 初始化我的订单页面
        my_trip_page = MyTripPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # -------------------测试步骤--------------------
        # 获取入住人姓名
        get_name = edit_order_page.get_people_name(1)
        print("获取的入住人姓名是：", get_name)
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
        # 点击返回按钮
        com_cloud_page.click_back_button()
        # 酒店首页底部导航栏点击“行程”
        bottom_homepage.click_bottom_menu("行程")
        # 查询测试酒店已有的行程数量
        counts = self.trip_list.get_hotel_tripno(test_info["keywords"])
        print("生成行程", counts)
        ele = my_trip_page.swipe_find_element(test_info["keywords"], count=counts)
        my_trip_page.scroll_into_view(ele)
        # 断言酒店是否生成行程
        trip_result = my_trip_page.get_trip_count(test_info["keywords"])
        print("预定酒店后返回的酒店行程数量:", trip_result)
        print("断言酒店行程数量：", trip_result - count)
        with assume:
            assert trip_result - count == 1, "没有生成行程"
        # 断言酒店行程中入住人是否正确
        name_result = my_trip_page.find_hotel_people(name=test_info["keywords"], value=1)
        print("实际酒店行程入住人：", name_result)
        with assume:
            assert name_result == get_name, "酒店行程的入住人不对"
        # -----------------------------取消酒店，行程消失-------------------------------------
        # 点击行程
        my_trip_page.click_hotel_trip(test_info["keywords"])
        # 点击取消订单按钮
        order_details_page.wait_data_load(True, 0.5)
        order_details_page.click_cancel_order_button()
        # 确认取消订单
        order_details_page.click_confirm_cancel_order_button()
        # 断言订单已取消状态
        order_details_page.wait_data_load(False, 1.5)
        cancel_status = order_details_page.cancel_order_status()
        assert cancel_status == "已取消", "订单状态不是已取消"
        # 返回我的行程页面
        com_cloud_page.click_back_button()
        # 刷新页面
        com_cloud_page.refresh_page()
        # 上滑获取更多行程数据
        for i in range(5):
            time.sleep(1)
            com_cloud_page.swipe_up()
        # 断言酒店行程是否消失
        order_details_page.wait_data_load(True, 1.5)
        trip_result_ = my_trip_page.get_trip_count(test_info["keywords"])
        print("取消后返回的酒店行程数量:", trip_result_)
        with assume:
            assert trip_result_ == count, "酒店订单取消后行程没有消失"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestHotelToPayTrip:
    # 初始化获取行程数量对象
    trip_list = DelectHotelTrip()

    @pytest.mark.topay_hotel_trip_smoke
    @allure.severity("critical")
    @allure.testcase("")
    @allure.story("测试场景：酒店下单后生成行程，然后取消酒店行程消失")
    @allure.title("到店付酒店订单生成行程，和行程消失 test_hotel_topay_trip_smoke")
    @pytest.mark.parametrize("hotel_details", topay_hotel_trip_data, indirect=True)
    @pytest.mark.parametrize("test_info", topay_hotel_trip_data)
    def test_hotel_topay_trip_smoke(self, driver, hotel_details, test_info):
        """到店付酒店下单后在我的行程中生成行程，然后取消订单，行程消失"""
        # 查询测试酒店已有的行程数量
        count = self.trip_list.get_hotel_tripno(test_info["keywords"])
        print("元素行程数据", count)
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化酒店首页底部的导航栏
        bottom_homepage = BottomHomepage(driver)
        # 初始化我的订单页面
        my_trip_page = MyTripPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # -------------------测试步骤--------------------
        # 获取入住人姓名
        edit_order_page.wait_data_load(True, 1)
        get_name = edit_order_page.get_people_name(1)
        print("获取的入住人姓名是：", get_name)
        # 选择无需担保
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
        # ------------------------返回首页，然后进入我的行程页面----------------------------
        # 点击返回按钮
        com_cloud_page.click_back_button()
        # 酒店首页底部导航栏点击“行程”
        bottom_homepage.click_bottom_menu("行程")
        ele = my_trip_page.swipe_find_element(test_info["keywords"])
        my_trip_page.scroll_into_view(ele)
        # 断言酒店是否生成行程
        trip_result = my_trip_page.get_trip_count(test_info["keywords"])
        print("预定酒店后返回的酒店行程数量:", trip_result)
        print("断言酒店行程数量：", trip_result - count)
        with assume:
            assert trip_result - count == 1, "没有生成行程"
        # 断言酒店行程中入住人是否正确
        name_result = my_trip_page.find_hotel_people(name=test_info["keywords"], value=1)
        print("实际酒店行程入住人：", name_result)
        with assume:
            assert name_result == get_name, "酒店行程的入住人不对"
        # -----------------------------取消酒店，行程消失-------------------------------------
        # 点击行程
        my_trip_page.click_hotel_trip(test_info["keywords"])
        # 点击取消订单按钮
        order_details_page.wait_data_load(True, 0.5)
        order_details_page.click_cancel_order_button()
        # 确认取消订单
        order_details_page.click_no_pay_cancel_confirm()
        # 断言订单已取消状态
        order_details_page.wait_data_load(False, 1.5)
        cancel_status = order_details_page.cancel_order_status()
        assert cancel_status == "已取消", "订单状态不是已取消"
        # 返回我的行程页面
        com_cloud_page.click_back_button()
        # 刷新页面
        com_cloud_page.refresh_page()
        # 上滑获取更多行程数据
        for i in range(5):
            time.sleep(1)
            com_cloud_page.swipe_up()
        # 断言酒店行程是否消失
        order_details_page.wait_data_load(True, 1.5)
        trip_result_ = my_trip_page.get_trip_count(test_info["keywords"])
        print("取消后返回的酒店行程数量:", trip_result_)
        with assume:
            assert trip_result_ == count, "酒店订单取消后行程没有消失"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestDeleteDefaultTrip:
    # 初始化获取行程数量对象
    trip_list = DelectHotelTrip()

    @pytest.mark.delete_default_people_trip
    @allure.severity("critical")
    @allure.testcase("http://zentao.sino.sz/index.php?m=testcase&f=view&t=html&id=132445")
    @allure.story("测试场景：酒店下单后生成行程，然后取消酒店行程消失")
    @allure.title("在线付酒店删除默认入住人并手动输入，行程生成和消失正常 test_delete_default_people_trip")
    @pytest.mark.parametrize("hotel_details", hotel_trip_data, indirect=True)
    @pytest.mark.parametrize("test_info", hotel_trip_data)
    def test_delete_default_people_trip(self, driver, hotel_details, test_info):
        """在线付酒店删除默认入住人，手动输入姓名然后下单，查看行程的生成和消失"""
        # 查询测试酒店已有的行程数量
        count = self.trip_list.get_hotel_tripno(test_info["keywords"])
        print("元素行程数据", count)
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # 初始化酒店首页底部的导航栏
        bottom_homepage = BottomHomepage(driver)
        # 初始化我的订单页面
        my_trip_page = MyTripPage(driver)
        # ------------------------入住人编辑---------------------------
        # 删除默认入住人
        edit_order_page.wait_data_load(False, 0.5)
        edit_order_page.clear_people(1)
        # 重新输入入住人
        edit_order_page.input_people(1, test_info["ooccupant_name"])
        # -----------------------------下单-------------------------------
        # 获取入住人姓名
        get_name = edit_order_page.get_people_name(1)
        print("获取的入住人姓名是：", get_name)
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
        # ------------------------返回首页，然后进入我的行程页面----------------------------
        # 点击返回按钮
        com_cloud_page.click_back_button()
        # 酒店首页底部导航栏点击“行程”
        bottom_homepage.click_bottom_menu("行程")
        ele = my_trip_page.swipe_find_element(test_info["keywords"])
        my_trip_page.scroll_into_view(ele)
        # 断言酒店是否生成行程
        trip_result = my_trip_page.get_trip_count(test_info["keywords"])
        print("预定酒店后返回的酒店行程数量:", trip_result)
        print("断言酒店行程数量：", trip_result - count)
        with assume:
            assert trip_result - count == 1, "没有生成行程"
        # 断言酒店行程中入住人是否正确
        name_result = my_trip_page.find_hotel_people(name=test_info["keywords"], value=1)
        print("实际酒店行程入住人：", name_result)
        with assume:
            assert name_result == get_name, "酒店行程的入住人不对"
        # -----------------------------取消酒店，行程消失-------------------------------------
        # 点击行程
        my_trip_page.click_hotel_trip(test_info["keywords"])
        # 点击取消订单按钮
        order_details_page.wait_data_load(True, 0.5)
        order_details_page.click_cancel_order_button()
        # 确认取消订单
        order_details_page.click_confirm_cancel_order_button()
        # 断言订单已取消状态
        order_details_page.wait_data_load(False, 1.5)
        cancel_status = order_details_page.cancel_order_status()
        assert cancel_status == "已取消", "订单状态不是已取消"
        # 返回我的行程页面
        com_cloud_page.click_back_button()
        # 刷新页面
        com_cloud_page.refresh_page()
        # 上滑获取更多行程数据
        for i in range(5):
            time.sleep(1)
            com_cloud_page.swipe_up()
        # 断言酒店行程是否消失
        order_details_page.wait_data_load(True, 1.5)
        trip_result_ = my_trip_page.get_trip_count(test_info["keywords"])
        print("取消后返回的酒店行程数量:", trip_result_)
        with assume:
            assert trip_result_ == count, "酒店订单取消后行程没有消失"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestTwoPeopleHotelTrip:
    # 初始化获取行程数量对象
    trip_list = DelectHotelTrip()

    @pytest.mark.two_people_trip
    @allure.severity("critical")
    @allure.testcase("")
    @allure.story("测试场景：酒店下单后生成行程，然后取消酒店行程消失")
    @allure.title("在线付酒店两人订单生成行程，和行程消失 test_hotel_two_people_trip")
    @pytest.mark.parametrize("hotel_details", two_people_trip, indirect=True)
    @pytest.mark.parametrize("test_info", two_people_trip)
    def test_hotel_two_people_trip(self, driver, hotel_details, test_info):
        """在线付酒店添加一个企业内部人，然后下单生成行程，取消订单后行程消失"""
        # 查询测试酒店已有的行程数量
        count = self.trip_list.get_hotel_tripno(test_info["keywords"])
        print("元素行程数据", count)
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # 初始化酒店首页底部的导航栏
        bottom_homepage = BottomHomepage(driver)
        # 初始化我的订单页面
        my_trip_page = MyTripPage(driver)
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
        # 获取入住人姓名
        get_name_1 = edit_order_page.get_people_name(1)
        print("获取的入住人姓名是：", get_name_1)
        get_name_2 = edit_order_page.get_people_name(2)
        print("获取的入住人姓名是：", get_name_2)
        # -----------------------------下单-------------------------------
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
        # ------------------------返回首页，然后进入我的行程页面----------------------------
        # 点击返回按钮
        com_cloud_page.click_back_button()
        # 酒店首页底部导航栏点击“行程”
        bottom_homepage.click_bottom_menu("行程")
        ele = my_trip_page.swipe_find_element(test_info["keywords"])
        my_trip_page.scroll_into_view(ele)
        # 断言酒店是否生成行程
        trip_result = my_trip_page.get_trip_count(test_info["keywords"])
        print("预定酒店后返回的酒店行程数量:", trip_result)
        print("断言酒店行程数量：", trip_result - count)
        with assume:
            assert trip_result - count == 1, "没有生成行程"
        # 断言酒店行程中入住人是否正确
        name_result_1 = my_trip_page.find_hotel_people(name=test_info["keywords"], value=1)
        name_result_2 = my_trip_page.find_hotel_people(name=test_info["keywords"], value=2)
        print("实际酒店行程入住人：", name_result_1, name_result_2)
        with assume: assert name_result_1 == get_name_1, "酒店行程的入住人不对"
        with assume: assert name_result_2 == get_name_2, "酒店行程的入住人不对"
        # -----------------------------取消酒店，行程消失-------------------------------------
        # 点击行程
        my_trip_page.click_hotel_trip(test_info["keywords"])
        # 点击取消订单按钮
        order_details_page.wait_data_load(True, 0.5)
        order_details_page.click_cancel_order_button()
        # 确认取消订单
        order_details_page.click_confirm_cancel_order_button()
        # 断言订单已取消状态
        order_details_page.wait_data_load(False, 1.5)
        cancel_status = order_details_page.cancel_order_status()
        assert cancel_status == "已取消", "订单状态不是已取消"
        # 返回我的行程页面
        com_cloud_page.click_back_button()
        # 刷新页面
        com_cloud_page.refresh_page()
        # 上滑获取更多行程数据
        for i in range(5):
            time.sleep(1)
            com_cloud_page.swipe_up()
        # 断言酒店行程是否消失
        order_details_page.wait_data_load(True, 1.5)
        trip_result_ = my_trip_page.get_trip_count(test_info["keywords"])
        print("取消后返回的酒店行程数量:", trip_result_)
        with assume:
            assert trip_result_ == count, "酒店订单取消后行程没有消失"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestThreePeopleHotelTrip:
    # 初始化获取行程数量对象
    trip_list = DelectHotelTrip()

    @pytest.mark.three_people_trip
    @allure.severity("critical")
    @allure.testcase("")
    @allure.story("测试场景：酒店下单后生成行程，然后取消酒店行程消失")
    @allure.title("在线付酒店三人订单生成行程，和行程消失 test_hotel_three_people_trip")
    @pytest.mark.parametrize("hotel_details", three_people_trip, indirect=True)
    @pytest.mark.parametrize("test_info", three_people_trip)
    def test_hotel_three_people_trip(self, driver, test_info, hotel_details):
        """在线付酒店添加三个人，然后下单生成行程，取消订单后行程消失"""
        # 查询测试酒店已有的行程数量
        count = self.trip_list.get_hotel_tripno(test_info["keywords"])
        print("元素行程数据", count)
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # 初始化酒店首页底部的导航栏
        bottom_homepage = BottomHomepage(driver)
        # 初始化我的订单页面
        my_trip_page = MyTripPage(driver)
        # ------------------------添加入住人---------------------------
        edit_order_page.wait_data_load(False, 1)
        # 点击房间数下拉按钮
        edit_order_page.click_number_rooms_search()
        # 选择几间房
        edit_order_page.search_room_number(test_info["room_number"])
        # 点击通讯录按钮
        edit_order_page.check_in_people_btn()
        # 选择2个入住人
        edit_order_page.select_people(test_info["occ_name_1"])
        edit_order_page.select_people(test_info["occ_name_2"])
        # 点击确定按钮，确认选择的入住人
        edit_order_page.confirm_people_button()
        # 获取入住人姓名
        get_name_1 = edit_order_page.get_people_name(1)
        print("获取的入住人姓名是：", get_name_1)
        get_name_2 = edit_order_page.get_people_name(2)
        print("获取的入住人姓名是：", get_name_2)
        get_name_3 = edit_order_page.get_people_name(3)
        print("获取的入住人姓名是：", get_name_3)
        # -----------------------------下单-------------------------------
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
        # ------------------------返回首页，然后进入我的行程页面----------------------------
        # 点击返回按钮
        com_cloud_page.click_back_button()
        # 酒店首页底部导航栏点击“行程”
        bottom_homepage.click_bottom_menu("行程")
        ele = my_trip_page.swipe_find_element(test_info["keywords"])
        my_trip_page.scroll_into_view(ele)
        # 断言酒店是否生成行程
        trip_result = my_trip_page.get_trip_count(test_info["keywords"])
        print("预定酒店后返回的酒店行程数量:", trip_result)
        print("断言酒店行程数量：", trip_result - count)
        with assume:
            assert trip_result - count == 1, "没有生成行程"
        # 断言酒店行程中入住人是否正确
        name_result_1 = my_trip_page.find_hotel_people(name=test_info["keywords"], value=1)
        name_result_2 = my_trip_page.find_hotel_people(name=test_info["keywords"], value=2)
        name_result_3 = my_trip_page.find_hotel_people(name=test_info["keywords"], value=3)
        print("实际酒店行程入住人：", name_result_1, name_result_2, name_result_3)
        with assume: assert name_result_1 == get_name_1, "酒店行程的入住人不对"
        with assume: assert name_result_2 == get_name_2, "酒店行程的入住人不对"
        with assume: assert name_result_3 == get_name_3, "酒店行程的入住人不对"
        # -----------------------------取消酒店，行程消失-------------------------------------
        # 点击行程
        my_trip_page.click_hotel_trip(test_info["keywords"])
        # 点击取消订单按钮
        order_details_page.wait_data_load(True, 0.5)
        order_details_page.click_cancel_order_button()
        # 确认取消订单
        order_details_page.click_confirm_cancel_order_button()
        # 断言订单已取消状态
        order_details_page.wait_data_load(False, 1.5)
        cancel_status = order_details_page.cancel_order_status()
        assert cancel_status == "已取消", "订单状态不是已取消"
        # 返回我的行程页面
        com_cloud_page.click_back_button()
        # 刷新页面
        com_cloud_page.refresh_page()
        # 上滑获取更多行程数据
        for i in range(5):
            time.sleep(1)
            com_cloud_page.swipe_up()
        # 断言酒店行程是否消失
        order_details_page.wait_data_load(True, 1.5)
        trip_result_ = my_trip_page.get_trip_count(test_info["keywords"])
        print("取消后返回的酒店行程数量:", trip_result_)
        with assume:
            assert trip_result_ == count, "酒店订单取消后行程没有消失"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestHotelToPayTwoTrip:
    # 初始化获取行程数量对象
    trip_list = DelectHotelTrip()

    @pytest.mark.topay_twopeople_trip
    @allure.severity("critical")
    @allure.testcase("")
    @allure.story("测试场景：酒店下单后生成行程，然后取消酒店行程消失")
    @allure.title("到店付酒店添加企业外部人员，验证行程生成和消失 test_topay_twopeople_trip")
    @pytest.mark.parametrize("hotel_details", topay_hotel_trip_data, indirect=True)
    @pytest.mark.parametrize("test_info", topay_hotel_trip_data)
    def test_topay_twopeople_trip(self, driver, hotel_details, test_info):
        """到店付酒店两人入住下单后在我的行程中生成行程，然后取消订单，行程消失"""
        # 查询测试酒店已有的行程数量
        count = self.trip_list.get_hotel_tripno(test_info["keywords"])
        print("元素行程数据", count)
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化酒店首页底部的导航栏
        bottom_homepage = BottomHomepage(driver)
        # 初始化我的订单页面
        my_trip_page = MyTripPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # -------------------测试步骤--------------------
        # ------------------------添加入住人---------------------------
        edit_order_page.wait_data_load(False, 1)
        # 点击房间数下拉按钮
        edit_order_page.click_number_rooms_search()
        # 选择几间房
        edit_order_page.search_room_number(2)
        # 点击通讯录按钮
        edit_order_page.check_in_people_btn()
        # 选择1个入住人
        edit_order_page.select_people(test_info["occ_name"])
        # 点击确定按钮，确认选择的入住人
        edit_order_page.confirm_people_button()
        # 获取入住人姓名
        get_name_1 = edit_order_page.get_people_name(1)
        print("获取的入住人姓名是：", get_name_1)
        get_name_2 = edit_order_page.get_people_name(2)
        print("获取的入住人姓名是：", get_name_2)
        # 选择无需担保
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
        # ------------------------返回首页，然后进入我的行程页面----------------------------
        # 点击返回按钮
        com_cloud_page.click_back_button()
        # 酒店首页底部导航栏点击“行程”
        bottom_homepage.click_bottom_menu("行程")
        ele = my_trip_page.swipe_find_element(test_info["keywords"])
        my_trip_page.scroll_into_view(ele)
        # 断言酒店是否生成行程
        trip_result = my_trip_page.get_trip_count(test_info["keywords"])
        print("预定酒店后返回的酒店行程数量:", trip_result)
        print("断言酒店行程数量：", trip_result - count)
        with assume:
            assert trip_result - count == 1, "没有生成行程"
            # 断言酒店行程中入住人是否正确
            name_result_1 = my_trip_page.find_hotel_people(name=test_info["keywords"], value=1)
            name_result_2 = my_trip_page.find_hotel_people(name=test_info["keywords"], value=2)
            print("实际酒店行程入住人：", name_result_1, name_result_2)
            with assume: assert name_result_1 == get_name_1, "酒店行程的入住人不对"
            with assume: assert name_result_2 == get_name_2, "酒店行程的入住人不对"
        # -----------------------------取消酒店，行程消失-------------------------------------
        # 点击行程
        my_trip_page.click_hotel_trip(test_info["keywords"])
        # 点击取消订单按钮
        order_details_page.wait_data_load(True, 0.5)
        order_details_page.click_cancel_order_button()
        # 确认取消订单
        order_details_page.click_no_pay_cancel_confirm()
        # 断言订单已取消状态
        order_details_page.wait_data_load(False, 1.5)
        cancel_status = order_details_page.cancel_order_status()
        assert cancel_status == "已取消", "订单状态不是已取消"
        # 返回我的行程页面
        com_cloud_page.click_back_button()
        # 刷新页面
        com_cloud_page.refresh_page()
        # 上滑获取更多行程数据
        for i in range(5):
            time.sleep(1)
            com_cloud_page.swipe_up()
        # 断言酒店行程是否消失
        order_details_page.wait_data_load(True, 1.5)
        trip_result_ = my_trip_page.get_trip_count(test_info["keywords"])
        print("取消后返回的酒店行程数量:", trip_result_)
        with assume:
            assert trip_result_ == count, "酒店订单取消后行程没有消失"
