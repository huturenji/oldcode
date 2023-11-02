# -*- coding: utf-8 -*-
# @time     : 2022/2/10 17:01
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : conftest.py

"""
机票配置文件
"""
import time

import allure
import pytest

from common.mylogger import my_log

from pages.nav_page import NavPage
from pages.com_cloud_page import CommercialCloud


@pytest.fixture(scope="class", autouse=True)
def start_the_ticket(driver):
    """直接从伴正事T信首页点击应用"""
    # 初始化伴正事T信首页
    nav_page = NavPage(driver)
    # 进入机票首页
    nav_page.click_nav("机票")


# @pytest.fixture(scope="class", autouse=True)
def nv_start_the_ticket(driver):
    """从商云首页点击‘服务汇’进入机票应用"""
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
    # 进入商云首页，点击'服务汇'
    com_cloud_page.wait_data_load(False, 1)
    com_cloud_page.choose_function()
    com_cloud_page.swipe_up()
    my_log.info("-------------------------机票开始执行用例-----------------------------")
    # 进入机票首页
    com_cloud_page.click_commercial("订机票")
    yield
    # 初始化商云首页
    com_cloud_page = CommercialCloud(driver)
    # 退出商云webview环境
    com_cloud_page.switch_webview(None)
    print("退回iOS原生的环境", driver.current_context)
    # 点击小程序的"X"按钮
    com_cloud_page.close_applet(step_desc="小程序关闭按钮")
