# -*- coding: utf-8 -*-
# @time     : 2022/1/17 14:14
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : conftest.py

"""
订机票的前置相关：
    1、登录伴正事后，进入机票首页的操作
"""
import time

import pytest

from pages.nav_page import NavPage
from pages.com_cloud_page import CommercialCloud


@pytest.fixture(scope="class", autouse=True)
def start_the_ticket(driver):
    """直接从伴正事T信首页点击应用"""
    # 初始化伴正事T信首页
    nav_page = NavPage(driver)
    # 进入机票首页
    nav_page.click_ticket_service("机票")


# @pytest.fixture(scope="class", autouse=True)
def nv_start_the_ticket(driver):
    """从商云首页点击‘服务汇’进入机票应用"""
    # 初始化伴正事首页
    nav_page = NavPage(driver)
    # 初始化商云首页
    com_cloud_page = CommercialCloud(driver)
    # -------------------步骤-------------------
    # 伴正事首页，底部导航栏点击‘商云’
    nav_page.click_nav("商云")
    # 切换至商云首页webview
    com_cloud_page.switch_webview('webview')
    # print("当前所有的上下文环境", driver.contexts)
    # print("当前所在的上下文", driver.current_context)
    # print("商云首页所有的标签页", driver.window_handles)
    # print("商云首页页面所在页面的窗口句柄", driver.current_window_handle)
    # 进入商云首页（名商城），点击弹窗‘我知道了’
    # nav_page.click_know_but()
    # 点击服务汇
    com_cloud_page.choose_function()
    com_cloud_page.swipe_up()
    # 点击‘机票’应用
    com_cloud_page.wait_data_load(False, 1)
    com_cloud_page.click_commercial("订机票")
    yield
    # 用例后置：退出机票小应用
    # 切换至App原生环境
    com_cloud_page.switch_webview()
    # 关闭小应用程序
    com_cloud_page.close_applet(step_desc="小程序关闭按钮")


