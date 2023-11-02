# -*- coding: utf-8 -*-
# @time     : 2022/1/11 16:34
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : invoice_page.py


import allure
from selenium.webdriver.common.by import By
from common.base_page import BasePage


class InvoicePage(BasePage):
    """商城所有发票相关元素和操作方法，除发票助手以外"""
    # ---------------------------------------------------确认订单页发票相关元素---------------------------------------------------
    # 发票栏
    invoice_bar_loc = (By.XPATH, "//uni-view[@class='yt-list']/descendant::uni-text[@class='iconfont iconziyuan11']")
    # 进入的我的发票页，‘不需要’选项
    no_need_checkbox_loc = (By.XPATH,
                            "(//uni-view[@class='select_invoice'])[1]/*[@class='not_need_wrap']/*[contains(@class, 'iconfont iconziyuan')]")
    # 进入的我的发票页，‘需要’选项
    is_need_checkbox_loc = (By.XPATH,
                            "(//uni-view[@class='select_invoice'])[1]/*[@class='is_need_wrap']/*[contains(@class, 'iconfont iconziyuan')]")
    # 进入的我的发票页，‘确定’按钮
    invoice_confirm_loc = (By.XPATH, "//uni-view[@class='confirm_btn']")
    # 进入的我的发票页，商品明细选项
    goods_detail_loc = (By.XPATH,
                        "(//uni-view[@class='select_invoice'])[2]/*[@class='not_need_wrap']/*[contains(@class, 'iconfont iconziyuan')]")
    # 进入的我的发票页，商品类别选项
    goods_category_loc = (By.XPATH,
                          "(//uni-view[@class='select_invoice'])[2]/*[@class='is_need_wrap']/*[contains(@class, 'iconfont iconziyuan')]")
    # 进入的我的发票页，发票抬头选择栏
    invoice_header_setting_bar_loc = (By.CSS_SELECTOR, "uni-view.choosed_invoice_item>img")
    # 我的发票进入的发票助手页，发票抬头选择按钮
    invoice_header_list_loc = "//span[contains(text(), {})]/../../../../../*[@class='invoice_choose']/*[name()='img']"
    # 收票人手机号输入栏
    phone_number_input_loc = (By.XPATH, "//*[text()='收票人手机']/following-sibling::uni-input//input")

    # -----------------------------------------------------确认订单页发票相关操作-----------------------------------------------------
    @allure.step("确认订单页：点击‘发票’一栏")
    def click_invoice_bar(self):
        self.click_element(self.wait_precence_element(self.invoice_bar_loc, "发票栏"))

    @allure.step("确认订单页进入的我的发票页，选择‘不需要’")
    def choose_no_need_checkbox(self):
        self.click_element(self.wait_element_visible(self.no_need_checkbox_loc, "‘不需要’选项"))

    @allure.step("确认订单页进入的我的发票页，选择‘需要’")
    def choose_is_need_checkbox(self):
        self.click_element(self.wait_element_visible(self.is_need_checkbox_loc, "'需要'选项"))

    @allure.step("确认订单页进入的我的发票页，点击‘确定’按钮")
    def click_invoice_confirm_btn(self):
        self.click_element(self.wait_element_visible(self.invoice_confirm_loc, "确定按钮"))

    @allure.step("确认订单页进入的我的发票页，选择‘商品明细’")
    def choose_goods_detail(self):
        self.click_element(self.wait_element_visible(self.goods_detail_loc, "‘商品明细’选项"))

    @allure.step("确认订单页进入的我的发票页，选择‘商品类别’")
    def choose_goods_category(self):
        self.click_element(self.wait_element_visible(self.goods_category_loc, "'商品类别'选项"))

    @allure.step("确认订单页进入的我的发票页，点击‘发票抬头信息栏’")
    def click_invoice_header_setting_bar(self):
        self.click_element(self.wait_precence_element(self.invoice_header_setting_bar_loc, "发票抬头信息栏"))

    @allure.step("确认订单页进入的发票助手页，选择一个发票抬头")
    def choose_invoice_header_list(self, value):
        ele = (By.XPATH, self.invoice_header_list_loc.format(value))
        # 在发票助手页选择一个发票抬头
        self.click_element(self.wait_element_visible(ele, "发票抬头列表"))

    @allure.step("确认订单页进入的我的发票页，清空手机号输入栏的默认数据")
    def clear_phone_number_input(self):
        self.wait_precence_element(self.phone_number_input_loc, "手机号输入栏").clear()

    @allure.step("确认订单页进入的我的发票页，输入手机号")
    def input_phone_number(self, value):
        self.input_keys(self.wait_precence_element(self.phone_number_input_loc, "手机号输入栏"), value)
