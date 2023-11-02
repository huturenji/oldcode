# -*- coding: utf-8 -*-
# @time     : 2021/9/11 22:58
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : test_touchaction.py


import time
from selenium.webdriver.support import expected_conditions as EC
from appium.webdriver.common.mobileby import MobileBy
from selenium.webdriver.common.by import By
from appium.webdriver.common.touch_action import TouchAction
from selenium.webdriver.common.touch_actions import TouchActions
import pytest
import allure

from pytest_assume.plugin import assume
from selenium.webdriver.support.wait import WebDriverWait

from pages.com_cloud_page import CommercialCloud
from pages.hotel_pages.hotel_home_page import HotelHomePage
from pages.hotel_pages.hotel_list_page import HotelListPage
from pages.hotel_pages.hotel_details_page import HotelDetailsPage
from pages.hotel_pages.edit_order_page import EditOrderPage
from pages.hotel_pages.order_details_page import OrderDetailsPage
from pages.hotel_pages.payment_result_page import PaymentResultPage

# 导入测试数据
from data.hotel_data.hotel_data import (
    hotel_online_pay_search_keywords,
    hotel_to_pay_yes_keywords,
    hotel_to_pay_keywords
)
from pages.my_business_trip.bottom_homepage import BottomHomepage


class TestHotelOnlinePay:

    # @pytest.mark.test
    @pytest.mark.parametrize("test_info", hotel_online_pay_search_keywords)
    def test_hotel(self, test_info, driver):
        """在线付酒店单人入住下单冒烟测试"""
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化酒店首页
        hotel_home_page = HotelHomePage(driver)
        # 初始化酒店列表页
        hotel_list_page = HotelListPage(driver)
        # 初始化酒店详情页
        hotel_details_page = HotelDetailsPage(driver)
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # 初始化酒店首页底部的导航栏
        bottom_homepage = BottomHomepage(driver)
        # -------------------测试步骤 -------------------
        # 进入酒店首页
        com_cloud_page.click_commercial("订酒店")
        # hotel_home_page.allow_location()
        # 点击我的按钮
        bottom_homepage.click_bottom_menu("我的")
        # 切换至配送地址栏
        time.sleep(1.5)
        bottom_homepage.click_bottom_menu("地址")
        # bottom_homepage.switch_webview()
        # # 页面title部分尺寸
        # ele_title = driver.find_element(MobileBy.ID, "com.sinosun.bizmate.ace:id/title_container")
        # print("页面顶部的大小：", ele_title.rect)
        # bottom_homepage.switch_webview("webview")
        # # 查找张三的配送地址
        # ele = driver.find_element(By.XPATH, "//span[text()='张三']/ancestor::div[@class='item-wrap']")
        # #	{"x":28,"y":419,"width":662,"height":188}
        # ele_1 = driver.find_element(By.XPATH, "//span[text()='zhangsan']/ancestor::div[@class='item-wrap']")
        # print("张三的地址的坐标：", ele.rect)
        # print("zhangsan的地址的坐标：", ele_1.rect)
        # print("屏幕大小：", driver.get_window_size())
        # webview = driver.find_element(By.XPATH, "//div[@class='editDetail child-view']")
        # print("webview:", webview.rect)
        # x_str = 28 + 600
        # y_str = 419 + 100
        # x_end = 28
        # y_end = 419 + 100
        width = driver.get_window_size()['width']
        ele_str = driver.find_element(By.XPATH, "//span[text()='张三']/../following-sibling::div[@class='edit']")
        # ele_end = driver.find_element(By.XPATH, "//span[text()='张三']")
        TouchActions(driver).flick_element(ele_str, -width * 0.4, 0, 1000).perform()
        delete = driver.find_element(By.XPATH,
                                     "//span[text()='张三']/../../../../../../../../descendant::button[contains(@class, 'delete_swipe')]")
        #点击删除
        delete.click()
        time.sleep(6)


class TestHotel:

    @pytest.mark.parametrize("test_info", hotel_online_pay_search_keywords)
    def test_hotel(self, test_info, driver):
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # 初始化酒店首页
        hotel_home_page = HotelHomePage(driver)
        # 初始化酒店列表页
        hotel_list_page = HotelListPage(driver)
        # 初始化酒店详情页
        hotel_details_page = HotelDetailsPage(driver)
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # 初始化酒店首页底部的导航栏
        bottom_homepage = BottomHomepage(driver)
        # -------------------测试步骤 -------------------
        # 进入酒店首页
        com_cloud_page.click_commercial("订酒店")
