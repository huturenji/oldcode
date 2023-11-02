# -*- coding: utf-8 -*-
# @time     : 2021/12/17 16:18
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : mall_home_page.py

import allure
from selenium.webdriver.common.by import By
from common.base_page import BasePage


class MallHomePage(BasePage):
    """商云首页"""
    # -----------------------------------元素定位数据-----------------------------------
    # 商云首页顶部的搜索栏
    search_bar_loc = (By.XPATH, "//*[contains(@class, 'ser-input changeSer')]/div[@class='uni-input-wrapper']")
    # 搜索页面的搜索栏
    searchpage_bar_loc = (By.XPATH, "//uni-view[@class='sea_input_part']//input[@class='uni-input-input']")
    # 点击搜索栏进入搜索页面，搜索栏右边的‘搜索’按钮
    search_but_loc = (By.XPATH, "//span[text()='搜索']")
    # 商云首页导航栏
    nav_bar_loc = (By.XPATH, "//*[text()='没有更多了']")
    # 商云首页导航栏，‘京东’栏
    jd_btn_loc = (By.XPATH, "(//*[@id='u-tab-item-1'])[1]")
    # 商云首页‘京东’分类商品中，第一个商品
    jd_goods_loc = (By.XPATH, "(//uni-view[@class='goodsNameWrap'])[6]/uni-view")

    # -----------------------------------------搜索部分---------------------------------------
    @allure.step("BBC商城首页：点击页面上方的搜索栏")
    def click_search_bar(self):
        self.js_click(self.wait_element_visible(self.search_bar_loc, "页面顶部的‘搜索’栏"))

    @allure.step("搜索页面：输入搜索内容")
    def send_search_keys(self, value):
        self.input_keys(self.wait_element_visible(self.searchpage_bar_loc, "页面顶部的‘搜索’栏"), value)

    @allure.step("搜索页面：搜索栏后面的‘搜索’按钮")
    def click_search_but(self):
        self.click_element(self.wait_precence_element(self.search_but_loc, "'搜索'按钮"))

    # ----------------------------------------导航栏及商品列表-----------------------------------
    @allure.step("BBC商城首页：滚动页面至导航栏出现在页面")
    def scroll_nav_bar(self):
        self.scroll_into_view(self.wait_element_visible(self.nav_bar_loc, "商云首页导航栏"))

    @allure.step("BBC商城首页：点击导航栏的‘京东’")
    def click_jd_btn(self):
        self.click_element(self.wait_element_visible(self.jd_btn_loc, "导航栏：京东"))

    @allure.step("BBC商城首页：选择京东的商品")
    def click_jd_goods(self):
        self.click_element(self.wait_element_clickable(self.jd_goods_loc, "选择京东分类的商品"))
