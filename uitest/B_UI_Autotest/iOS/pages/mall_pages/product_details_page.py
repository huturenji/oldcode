# -*- coding: utf-8 -*-
# @time     : 2021/12/17 16:52
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : product_details_page.py

import allure
from selenium.webdriver.common.by import By
from common.base_page import BasePage


class ProductDetailsPage(BasePage):
    """商品详情页"""
    # 商品详情页的“立即购买”按钮元素
    buy_button_loc = (By.XPATH, "//uni-button[contains(@class, 'buy_now_btn')]")
    # 商品详情页，规格选择框中的‘立即购买’按钮
    spec_buy_btn_loc = (By.XPATH, "//uni-button[@class='spec_buy_btn spec_btn_only']")
    # 商品详情页，页面底部的‘加入购物车’按钮
    add_cart_btn_loc = (By.XPATH, "//uni-view[@class='action_btn_group']/uni-button[contains(@class, 'add_cart_btn')]")
    # 商品详情页，规格选择框中的‘加入购物车’按钮
    spec_add_cart_btn_loc = (By.XPATH, "//uni-button[@class='spec_add_cart_btn spec_btn_only']")
    # 商品详情页，‘购物车’按钮
    cart_btn_loc = (By.XPATH, "//uni-view[@class='image cart_img']")

    @allure.step("详情展示页面：点击‘立即购买’按钮")
    def click_buy_now_btn(self):
        self.click_element(self.wait_precence_element(self.buy_button_loc, "立即购买按钮"))

    @allure.step("详情展示页面：点击规格框中的‘立即购买’按钮")
    def click_spec_buy_btn(self):
        self.click_element(self.wait_precence_element(self.spec_buy_btn_loc, "规格框中的立即购买"))

    @allure.step("详情展示页面：点击页面底部的‘加入购物车’按钮")
    def click_add_cart_btn(self):
        self.click_element(self.wait_precence_element(self.add_cart_btn_loc, "页面底部的‘加入购物车’按钮"))

    @allure.step("详情展示页面：点击规格选择框中的‘加入购物车’按钮")
    def click_spec_add_cart_btn(self):
        self.click_element(self.wait_precence_element(self.spec_add_cart_btn_loc, "规格选择框中的‘加入购物车’按钮"))

    @allure.step("详情展示页面：点击‘购物车’按钮")
    def click_cart_btn(self):
        self.click_element(self.wait_element_clickable(self.cart_btn_loc, "'购物车'按钮"))
