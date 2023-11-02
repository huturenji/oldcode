# -*- coding: utf-8 -*-
# @time     : 2021/9/28 16:00
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : test_hotel_default.py

import time
import pytest
import allure

from pytest_assume.plugin import assume
from pages.com_cloud_page import CommercialCloud
from pages.hotel_pages.hotel_home_page import HotelHomePage
from pages.hotel_pages.hotel_list_page import HotelListPage
from pages.hotel_pages.hotel_details_page import HotelDetailsPage

from data.hotel_data.hotel_data import (
    detail_page_default,
)


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestDetailDefault:

    @pytest.mark.details_default
    @allure.severity("minor")
    @allure.testcase("http://zentao.sino.sz/index.php?m=testcase&f=view&t=html&id=145583")
    @allure.story("测试场景：酒店各页面，查询不到数据时显示缺省信息")
    @allure.title("{test_info[title]}; test_details_default")
    @pytest.mark.parametrize("test_info", detail_page_default)
    def test_details_default(self, driver, test_info):
        """查询的酒店进入详情页后，当没有房型时显示缺省图标和提示"""
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化酒店首页
        hotel_home_page = HotelHomePage(driver)
        # 初始化酒店列表页
        hotel_list_page = HotelListPage(driver)
        # 初始化酒店详情页
        hotel_details_page = HotelDetailsPage(driver)
        # ------------------------------------测试步骤--------------------------------------
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
        hotel_list_page.click_price_star_search_btn()
        # 重置价格区间推荐
        hotel_list_page.click_reset_button()
        # 确认重置推荐
        hotel_list_page.click_complete_button()
        # 点击搜索按钮
        hotel_list_page.wait_data_load(False, 1)
        hotel_list_page.search_enter()
        hotel_list_page.wait_data_load(False, 1)
        # 酒店列表选择酒店
        hotel_list_page.click_hotel_list()
        # 点击“到店付”
        hotel_details_page.wait_data_load(False, 1)
        hotel_details_page.click_default_but()
        # 断言无房间时，缺省块的显示状态
        style = hotel_details_page.get_property_values()
        with assume:
            assert style == ''
        # 断言缺省图标的属性
        picture = hotel_details_page.find_default_pic().get_attribute("style")
        with assume:
            assert picture == test_info["expected_1"], "缺省图片的base64值不对"
        # 断言缺省提示语
        tip_fields = hotel_details_page.find_default_pic().text
        with assume:
            assert tip_fields == test_info["expected_2"], "缺省提示字段不对"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestListDetailDefault:

    @pytest.mark.list_details_default
    @allure.severity("minor")
    @allure.testcase("")
    @allure.story("测试场景：酒店各页面，查询不到数据时显示缺省信息")
    @allure.title("酒店首页关键字查询无酒店时，缺省信息校验; test_list_details_default")
    @pytest.mark.parametrize("test_info", detail_page_default)
    def test_list_details_default(self, driver, test_info):
        """酒店首页输入查询字段，酒店列表页查询不到酒店时，显示缺省图标和提示"""
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
        hotel_home_page.select_city("长沙")
        # 输入酒店搜索关键字
        hotel_home_page.search_hotel_text(test_info["keywords"])
        # 点击查询按钮
        hotel_home_page.click_search_button()
        # 断言查询不到酒店列表时，缺省图片
        picture = hotel_list_page.find_list_default_pic().get_attribute("style")
        with assume:
            assert picture == test_info["expected_1"], "缺省图片的base64值不对"
        # 断言缺省提示语
        text_re = hotel_list_page.find_list_default_pic().text
        with assume:
            assert text_re == test_info["expected_3"], "缺省提示字段不对"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestSearchDetailDefault:

    @pytest.mark.search_details_default
    @allure.severity("minor")
    @allure.testcase("")
    @allure.story("测试场景：酒店各页面，查询不到数据时显示缺省信息")
    @allure.title("酒店列表页查询无酒店时，缺省信息校验; test_search_details_default")
    @pytest.mark.parametrize("test_info", detail_page_default)
    def test_search_details_default(self, driver, test_info):
        """酒店列表页输入搜索，查询不到酒店时，显示缺省图标和提示"""
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
        # 断言查询不到酒店列表时，缺省图片
        picture = hotel_list_page.find_list_default_pic().get_attribute("style")
        with assume:
            assert picture == test_info["expected_1"], "缺省图片的base64值不对"
        # 断言缺省提示语
        text_re = hotel_list_page.find_list_default_pic().text
        with assume:
            assert text_re == test_info["expected_3"], "缺省提示字段不对"

