# -*- coding: utf-8 -*-
# @time     : 2021/6/22 17:44
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : conftest.py

import os
import time
import pytest
import allure

from appium.webdriver import Remote
from pages.login import LoginBizmate
from common.read_yaml import ReadYaml
from pages.nav_page import NavPage
from pages.start_app import StartApp

from pages.com_cloud_page import CommercialCloud
from common.mylogger import my_log


@pytest.fixture(scope="session", name="driver")
def init_app():
    """初始化伴正事App"""
    # 获取设备信息
    caps = ReadYaml("caps.yaml").read_yaml()["device"]
    # 启动appium服务，初始化app
    driver = Remote(desired_capabilities=caps, command_executor='http://127.0.0.1:4723/wd/hub')
    # 设置隐式等待
    driver.implicitly_wait(10)
    # 登录伴正事
    # LoginBizmate(driver).login_bizmate()
    # 不从登录开始时，执行下面的流程
    StartApp(driver).start_app()
    yield driver
    # 关闭伴正事App
    driver.quit()
    my_log.info("**************************************关闭伴正事APP**************************************" + "\n" + "\n")


@pytest.fixture(scope="class", autouse=True)
def homepage_entry_and_exit(driver):
    """
    用例后置条件：退出商云小应用
    """
    yield
    # 初始化商云首页
    com_cloud_page = CommercialCloud(driver)
    # 切换至App原生环境
    com_cloud_page.switch_webview()
    # 关闭小应用程序
    com_cloud_page.close_applet(step_desc="小程序关闭按钮")
    my_log.info("-------------------------------------用例执行完成--------------------------------------" + "\n")


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """
    获取每个用例状态的钩子函数
    每个测试用例执行后，获取断言结果，断言失败时截图
    :param item:测试用例对象
    :param call:测试用例的测试步骤
                执行完常规钩子函数返回的report报告有个属性叫report.when
                先执行when=’setup’ 返回setup 的执行结果
                然后执行when=’call’ 返回call 的执行结果
                最后执行when=’teardown’返回teardown 的执行结果
    :return:
    """
    # 获取钩子方法的调用结果
    outcome = yield
    rep = outcome.get_result()
    # get括号里面的参数是初始化浏览器、或者APP的方法名
    driver = item.funcargs.get('driver')
    # 仅仅获取用例call 执行结果是失败的情况, 不包含 setup/teardown
    if rep.when == "call" and rep.failed:
        mode = "a" if os.path.exists("failures") else "w"
        with open("failures", mode) as f:
            # let's also access a fixture for the fun of it
            if "tmpdir" in item.fixturenames:
                extra = " (%s)" % item.funcargs["tmpdir"]
            else:
                extra = ""
            f.write(rep.nodeid + extra + "\n")
        # 添加allure报告截图
        if hasattr(driver, "get_screenshot_as_png"):
            with allure.step('添加失败截图...'):
                allure.attach(driver.get_screenshot_as_png(), "失败用例截图", allure.attachment_type.PNG)
