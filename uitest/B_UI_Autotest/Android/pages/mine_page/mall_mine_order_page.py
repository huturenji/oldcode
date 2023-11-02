# -*- coding: utf-8 -*-
# @time     : 2022/1/14 0:21
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : mall_mine_order_page.py

import allure
from selenium.webdriver.common.by import By
from appium.webdriver.common.mobileby import MobileBy
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from common.mylogger import my_log
from common.base_page import BasePage


class MallMineOrderPage(BasePage):
    """商城从‘我的’进入的‘我的订单’页面"""
    # 待付款分页，订单列表
    not_pay_order_list_loc = (
        By.XPATH,
        "(//uni-view[contains(@class,'goods-box flex_row')])[1]/*[contains(@class,'left flex_row')]/*[@class='goods-img']"
    )

    @allure.step("我的订单页待付款分类列表，点击未支付的订单")
    # 点击“未支付”的订单列表，进入详情页
    def click_not_pay_order_one(self):
        self.click_element(self.wait_precence_element(self.not_pay_order_list_loc, "未支付订单列表"))
