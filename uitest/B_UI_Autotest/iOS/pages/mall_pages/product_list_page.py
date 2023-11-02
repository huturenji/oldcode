# -*- coding: utf-8 -*-
# @time     : 2021/12/17 16:46
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : product_list_page.py

import allure
from selenium.webdriver.common.by import By
from common.base_page import BasePage


class ProductListPage(BasePage):
    """商品列表页"""
    # -----------------------------------元素定位数据-----------------------------------
    # 列表展示样式切换按钮
    list_style_btn_loc = (By.XPATH, "//uni-text[@class='cate_item iconfont iconliebiao1']")
    # 搜索出来的商品列表
    good_list_loc = "(//uni-view[@class='goods_list flex_row_start_start']//descendant::*[@class='goods-img'])[{}]"

    @allure.step("商品列表页面：点击商品列表展示样式切换按钮")
    def click_list_style_btn(self):
        self.click_element(self.wait_precence_element(self.list_style_btn_loc, "商品列表展示样式切换按钮"))

    @allure.step("商品列表页面：选择第几个商品")
    def choose_product(self, value):
        self.click_element(self.wait_element_visible((By.XPATH, self.good_list_loc.format(value)), "选择商品列表第几个商品"))
