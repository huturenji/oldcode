# -*- coding: utf-8 -*-
# @time     : 2022/1/7 0:56
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : mine_page.py

import allure
from selenium.webdriver.common.by import By
from appium.webdriver.common.mobileby import MobileBy
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from common.mylogger import my_log
from common.base_page import BasePage


class MinePage(BasePage):
    """我的页面，包括商旅的订单、行程、乘客等信息；以及商城的订单、收货地址、发票助手等"""
    # 商城的‘待付款’按钮
    unpaid_order_btn_loc = (By.XPATH, "//uni-view[@class='item_box order-part']//uni-view[text()='待付款']")
    # 商城的‘全部订单’按钮
    all_order_btn_loc = (By.XPATH, "//uni-view[@class='item_box order-part']//uni-view[text()='全部订单']")

    @allure.step("‘我的’页面：点击商城的‘待付款’按钮")
    def click_unpaid_order_btn(self):
        self.click_element(self.wait_element_clickable(self.unpaid_order_btn_loc, "商城的‘待付款’分类"))
