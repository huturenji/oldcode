# -*- coding: utf-8 -*-
# @time     : 2021/12/21 18:00
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : cart_page.py

import allure
from selenium.webdriver.common.by import By
from common.base_page import BasePage


class CartPage(BasePage):
    """购物车页面"""
    # ‘结算’按钮
    account_confirm_loc = (
        By.XPATH,
        "//uni-view[@class='action-section flex_row_between_center']/uni-button[contains(@class, 'confirm-btn')]")

    @allure.step("购物车页面：点击‘结算’按钮")
    def click_account_btn(self):
        self.click_element(self.wait_element_visible(self.account_confirm_loc, "‘结算’按钮"))
