# -*- coding: utf-8 -*-
# @time     : 2021/9/30 14:03
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : test_hotel_Xbutton.py

import time
import pytest
import allure
import re
from selenium.webdriver.common.by import By
from appium.webdriver.common.touch_action import TouchAction

from selenium.webdriver.support.color import Color

from pytest_assume.plugin import assume
from pages.com_cloud_page import CommercialCloud
from pages.hotel_pages.hotel_home_page import HotelHomePage
from pages.hotel_pages.hotel_list_page import HotelListPage
from pages.hotel_pages.hotel_details_page import HotelDetailsPage
from pages.hotel_pages.edit_order_page import EditOrderPage
from pages.hotel_pages.order_details_page import OrderDetailsPage
from pages.hotel_pages.payment_result_page import PaymentResultPage

from data.hotel_data.hotel_data import (
    detail_page_default,
)


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestHomePageLocation:

    @pytest.mark.hotelhomepagelocation
    @allure.severity("normal")
    @allure.testcase("")
    @allure.story("测试场景：酒店各页面，按钮控件功能验证")
    @allure.title("酒店首页的定位按钮功能; test_location_button")
    def test_location_button(self, driver):
        """酒店首页定位功能验证"""
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化酒店首页
        hotel_home_page = HotelHomePage(driver)
        # ------------------------------------测试步骤--------------------------------------
        # 选择入住、离店时间
        hotel_home_page.selection_day(1, 2)
        # 点击酒店首页的“当前位置”按钮
        hotel_home_page.click_location_button()
        # 获取酒店首页定位后的地址文本
        location_text = hotel_home_page.get_text()
        # 断言定位到的地址
        with assume:
            assert location_text == "湖北省武汉市江夏区金融港一路61号靠近光谷智慧园", "定位的地址不对"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestEmptyFilter:

    @pytest.mark.empty_filter
    @allure.severity("normal")
    @allure.testcase("")
    @allure.story("测试场景：酒店各页面，按钮控件功能验证")
    @allure.title("酒店列表页面查询无数据时，清空筛选; test_empty_filter")
    @pytest.mark.parametrize("test_info", detail_page_default)
    def test_empty_filter(self, driver, test_info):
        """酒店列表页查询不到酒店时，点击‘清空筛选’按钮，然后重新查询"""
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化酒店首页
        hotel_home_page = HotelHomePage(driver)
        # 初始化酒店列表页
        hotel_list_page = HotelListPage(driver)
        # ------------------------------------测试步骤--------------------------------------
        # 选择入住、离店时间
        hotel_home_page.selection_day(test_info["check_in_date"], test_info["check_out_date"])
        # 选择城市
        hotel_home_page.select_city_entrance()
        hotel_home_page.select_city("厦门")
        # 点击查询按钮
        hotel_home_page.click_search_button()
        # 酒店列表页输入内容
        hotel_list_page.search_hotel("啊啊啊啊啊")
        # 点击搜索按钮
        hotel_list_page.wait_data_load(False, 1)
        hotel_list_page.search_enter()
        hotel_list_page.wait_data_load(False, 1)
        # 点击‘清空筛选’按钮
        hotel_list_page.click_delete_button()
        # 获取输入框的文本信息
        del_text = hotel_list_page.get_input_text()
        # print("删除后的文本：", hotel_list_page.get_input_text())
        assert del_text == ""


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestPriceRange:

    @pytest.mark.homepage_pricerange
    @allure.severity("normal")
    @allure.testcase("")
    @allure.story("测试场景：酒店各页面，按钮控件功能验证")
    @allure.title("酒店首页价格范围筛选; test_price_range")
    def test_price_range(self, driver):
        """酒店首页价格范围选择，进入酒店列表后显示价格范围正常"""
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化酒店首页
        hotel_home_page = HotelHomePage(driver)
        # 初始化酒店列表页
        hotel_list_page = HotelListPage(driver)
        # ------------------------------------测试步骤--------------------------------------
        # 选择入住、离店时间
        hotel_home_page.selection_day(5, 6)
        # 点击‘价格/星级’栏
        hotel_list_page.wait_data_load(False, 1)
        hotel_home_page.click_price_star()
        # 左滑选择价格范围
        hotel_home_page.touch_ele_slid()
        # 选择酒店星级
        hotel_home_page.choose_star("四星/高档")
        # 关闭价格星级选择框
        hotel_home_page.click_shut_down_button()
        hotel_home_page.wait_data_load(False, 1)
        # 点击查询按钮
        hotel_home_page.click_search_button()
        # 获取酒店列表所有的价格
        price_list = hotel_list_page.get_price_list()
        # 断言价格
        for i in price_list:
            result = i.text[1:]
            with assume:
                assert 0 < int(result) <= 300, "查询到的酒店列表，价格范围不对"
        # 点击价格/星级按钮
        hotel_list_page.click_price_star_search_btn()
        # 获取星级按钮的颜色
        css_data = hotel_list_page.get_color()
        # 通过断言字体颜色，判断按钮是否选中状态
        assert css_data == "#262dd9", "酒店星级按钮选中后，应该是深蓝色'#262dd9'(默认是灰色),颜色判断不对时表示该按钮不是选中状态"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestListPriceRange:

    @pytest.mark.listpage_price_star_brand_range
    @allure.severity("normal")
    @allure.testcase("")
    @allure.story("测试场景：酒店列表页面，价格、星级、品牌筛选酒店")
    @allure.title("酒店列表页价格、星级、品牌范围筛选; test_list_price_range")
    def test_list_price_range(self, driver):
        """酒店列表页选择'价格/星级、品牌连锁'筛选，验证筛选结果正确性"""
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化酒店首页
        hotel_home_page = HotelHomePage(driver)
        # 初始化酒店列表页
        hotel_list_page = HotelListPage(driver)
        # ------------------------------------测试步骤--------------------------------------
        # 选择入住、离店时间
        hotel_home_page.selection_day(5, 6)
        # 选择城市
        hotel_home_page.select_city_entrance()
        hotel_home_page.select_city("武汉")
        # 点击查询按钮
        hotel_home_page.click_search_button()
        # 点击顶部选择栏的筛选按钮
        hotel_list_page.wait_data_load(False, 1)
        hotel_list_page.click_brand_button()
        # 选择热门酒店品牌的‘如家’
        hotel_list_page.choose_hotel_brand("如家")
        # 点击价格/星级按钮
        hotel_list_page.click_price_star_search_btn()
        # 重置价格区间推荐
        hotel_list_page.click_reset_button()
        # 滑动价格区间至100-300
        hotel_list_page.touch_ele_slid(1, 100)
        hotel_list_page.touch_ele_slid(2, -200)
        # 选择‘三星/舒适’
        hotel_list_page.choose_star("二星/经济")
        # 点击筛选中的“完成”按钮，确认筛选条件
        hotel_list_page.click_complete_button()
        # 获取筛选后的酒店列表的价格
        hotel_list_page.wait_data_load(False, 1)
        price_list = hotel_list_page.get_price_search_list()
        # 断言价格
        for i in price_list:
            result = i.text[1:]
            with assume:
                assert 100 < int(result) < 300, "查询到的酒店列表，价格范围不对"
        # 获取酒店列表的星级文本
        star_text = hotel_list_page.get_list_star()
        # 断言获取到的列表星级
        for i in star_text:
            result = i.text
            with assume:
                assert result == "经济", "查询出来的酒店星级不对"
        # 断言获取到的酒店品牌
        name_list = hotel_list_page.get_hotel_name()
        for i in name_list:
            name = i.text
            with assume:
                assert name[:2] == "如家", "查询得到的酒店品牌不对"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestDistanceSelect:

    @pytest.mark.distance_select
    @allure.severity("normal")
    @allure.testcase("")
    @allure.story("测试场景：酒店列表页面，价格、星级、品牌筛选酒店")
    @allure.title("酒店列表页根据位置区域单项筛选; test_distance_select")
    def test_distance_select(self, driver):
        """酒店列表页通过位置区域单项去筛选"""
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化酒店首页
        hotel_home_page = HotelHomePage(driver)
        # 初始化酒店列表页
        hotel_list_page = HotelListPage(driver)
        # ------------------------------------测试步骤--------------------------------------
        # 选择入住、离店时间
        hotel_home_page.selection_day(5, 6)
        # 选择城市
        hotel_home_page.select_city_entrance()
        hotel_home_page.select_city("武汉")
        # 点击查询按钮
        hotel_home_page.click_search_button()
        # 点击价格/星级按钮
        hotel_list_page.wait_data_load(False, 1)
        hotel_list_page.click_price_star_search_btn()
        # 重置价格区间推荐
        hotel_list_page.click_reset_button()
        # 确认重置推荐
        hotel_list_page.click_complete_button()
        # 点击‘位置区域’筛选
        hotel_list_page.click_distance_btn()
        # 选择具体的位置范围
        hotel_list_page.wait_data_load(False, 2)
        hotel_list_page.select_distance_range("1km")
        # 获取酒店列表所有的距离数据
        hotel_list_page.wait_data_load(False, 1)
        data_list = hotel_list_page.get_distance_data()
        for i in data_list:
            data = re.findall(r"\d+\.?\d*", i.text)[0]
            with assume:
                assert 0 < eval(data) <= 1000, "酒店列表的距离区间不在选择范围内"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestRecommendSorting:

    @pytest.mark.skip(reason="价格排序有Bug还没解决，Bug编号为：61664")
    @pytest.mark.recommend_sorting
    @allure.severity("normal")
    @allure.testcase("")
    @allure.story("测试场景：酒店列表页面，价格、星级、品牌筛选酒店")
    @allure.title("酒店列表页根据价格排序--价格由高到底; test_recommend_sorting")
    def test_recommend_sorting(self, driver):
        """酒店列表页通过价格由高到底排序"""
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化酒店首页
        hotel_home_page = HotelHomePage(driver)
        # 初始化酒店列表页
        hotel_list_page = HotelListPage(driver)
        # ------------------------------------测试步骤--------------------------------------
        # 选择入住、离店时间
        hotel_home_page.selection_day(5, 6)
        # 选择城市
        hotel_home_page.select_city_entrance()
        hotel_home_page.select_city("武汉")
        # 点击查询按钮
        hotel_home_page.click_search_button()
        # 点击价格/星级按钮
        hotel_list_page.wait_data_load(False, 1)
        hotel_list_page.click_price_star_search_btn()
        # 重置价格区间推荐
        hotel_list_page.click_reset_button()
        # 确认重置推荐
        hotel_list_page.click_complete_button()
        hotel_list_page.wait_data_load(False, 2)
        # 点击‘推荐排序’
        hotel_list_page.click_sorting()
        # 选择排序种类
        hotel_list_page.choose_sorting("高到低")
        # 获取排序后的酒店列表的价格
        hotel_list_page.wait_data_load(False, 2)
        price_list = hotel_list_page.get_price_search_list()
        data_lis = []
        for i in price_list:
            price = i.text[1:]
            data_lis.append(eval(price))
        # 断言价格列表降序排列
        assert data_lis == sorted(data_lis), "酒店列表价格不是降序排列"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestDistanceSorting:

    @pytest.mark.skip(reason="酒店列表根据距离由近到远排序有问题，Bug编号：61720")
    @pytest.mark.distance_sorting
    @allure.severity("normal")
    @allure.testcase("")
    @allure.story("测试场景：酒店列表页面，价格、星级、品牌筛选酒店")
    @allure.title("酒店列表页根据离当前位置的距离远近，升序排序; test_distance_sorting")
    def test_distance_sorting(self, driver):
        """酒店列表页通过‘距离您 近到远排序’"""
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化酒店首页
        hotel_home_page = HotelHomePage(driver)
        # 初始化酒店列表页
        hotel_list_page = HotelListPage(driver)
        # ------------------------------------测试步骤--------------------------------------
        # 选择入住、离店时间
        hotel_home_page.selection_day(5, 6)
        # 选择城市
        hotel_home_page.select_city_entrance()
        hotel_home_page.select_city("武汉")
        # 点击查询按钮
        hotel_home_page.click_search_button()
        # 点击价格/星级按钮
        hotel_list_page.wait_data_load(False, 1)
        hotel_list_page.click_price_star_search_btn()
        # 重置价格区间推荐
        hotel_list_page.click_reset_button()
        # 确认重置推荐
        hotel_list_page.click_complete_button()
        hotel_list_page.wait_data_load(False, 2)
        # 点击‘推荐排序’
        hotel_list_page.click_sorting()
        # 选择排序种类
        hotel_list_page.choose_sorting("近到远")
        # 获取酒店列表所有的距离数据
        hotel_list_page.wait_data_load(False, 1)
        data_dis = hotel_list_page.get_distance_data()
        data_lis = []
        for i in data_dis:
            data = re.findall(r"\d+\.?\d*", i.text)[0]
            data_lis.append(eval(data))
        assert data_lis == sorted(data_lis)
