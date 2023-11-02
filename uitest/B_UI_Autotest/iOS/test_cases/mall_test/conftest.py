# -*- coding: utf-8 -*-
# @time     : 2021/8/25 11:27
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : conftest.py

import allure
import pytest

from common.mylogger import my_log
from pages.mall_pages.mall_home_page import MallHomePage
from pages.mall_pages.product_list_page import ProductListPage
from pages.nav_page import NavPage
from pages.com_cloud_page import CommercialCloud


@pytest.fixture(scope="class", autouse=True)
def start_the_mall(driver):
    NavPage(driver).click_nav("商云")
    # 切换到webview前提条件：
    print("商云首页所有环境", driver.contexts)
    NavPage(driver).click_page_blank()
    # 点击webview页面后，获取所有的环境
    print("点击webview页面，进入商云H5页面后所有环境", driver.contexts)
    # 初始化商云首页
    com_cloud_page = CommercialCloud(driver)
    # 进入商云webview环境
    com_cloud_page.switch_webview("webview")
    print("切换至商云H5页面后所在的环境", driver.current_context)
    my_log.info("-------------------------开始执行商城用例-----------------------------")


@pytest.fixture(scope="class")
def goods_search(request, driver):
    # 初始化商城首页
    mall_home_page = MallHomePage(driver)
    # 初始化商品列表页
    product_list_page = ProductListPage(driver)
    my_log.info("==============================< 测试用例开始 >==============================")
    # 接受传入的数据
    test_info = request.param
    # 点击搜索栏
    # mall_home_page.wait_data_load(False, 1)
    mall_home_page.click_search_bar()
    # 搜索栏输入内容
    mall_home_page.send_search_keys(test_info["goods_name"])
    # 点击搜索栏的“搜索”按钮
    mall_home_page.click_search_but()
    # 搜索的商品列表页点击商品
    product_list_page.choose_product(test_info["goods_list_choose"])
