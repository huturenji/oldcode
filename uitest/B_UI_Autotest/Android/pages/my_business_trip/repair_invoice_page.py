# -*- coding: utf-8 -*-
# @time     : 2021/9/26 11:31
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : repair_invoice_page.py

import allure

from selenium.webdriver.common.by import By
from common.base_page import BasePage


class RepairInvoicePage(BasePage):
    """我的订单页面进入的报销凭证页面相关"""
    # ------------------------------------我的订单页面，报销凭证相关--------------------------------------
    # 我的订单页面，报销凭证按钮
    invoice_button_loc = (By.XPATH, "//div[contains(@class, 'invoice-btn')]/div[1]")
    # 批量报销凭证页面，酒店栏
    hotel_invoice_loc = (By.XPATH, "(//*[@class='right'])[3]/*[name()='svg']")
    # 批量报销凭证里面的酒店列表页面：下一步按钮
    next_step_loc = (By.XPATH, "//div[@class='submit cursorp']/span")
    # 开具报销凭证页面，提交按钮
    submit_loc = (By.XPATH, "//div[@class='submit cursorp']/span")
    # 批量开发票后的结果页面，‘知道了’按钮
    know_button_loc = (By.XPATH, "//*[contains(text(), '知道了')]")
    # 批量补开报销凭证时，酒店订单页的列表元素
    ele_list_loc = (By.XPATH, "//div[@class='trip']")

    @allure.step("我的订单页面：点击右下角的报销凭证按钮，跳转至报销凭证页面")
    def invoice_reim_button(self):
        self.switch_to_new_window_wait(
            self.wait_element_visible(self.invoice_button_loc, "报销凭证按钮"),
            "我的订单页"
        )

    @allure.step("报销凭证页面：点击酒店补开报销凭证列表")
    def click_hotel_invoice(self):
        self.click_element(self.wait_precence_element(self.hotel_invoice_loc, "酒店补开报销凭证"))

    @allure.step("批量报销凭证里面的酒店列表：选择补开发票的酒店")
    def choose_hotel_list(self, value):
        """
        value:酒店列表第几个
        """
        list_loc = (By.XPATH, "(//div[@class='checker'])[{}]/*[name()='svg']".format(value))
        self.click_element(self.wait_precence_element(list_loc, "酒店列表"))

    @allure.step("批量报销凭证里面的酒店列表：下一步按钮")
    def click_next_step(self):
        self.click_element(self.wait_precence_element(self.next_step_loc, "下一步按钮"))

    @allure.step("开具报销凭证页面：点击提交按钮")
    def click_submit_button(self):
        self.click_element(self.wait_element_visible(self.submit_loc, "提交按钮"))

    @allure.step("批量开发票的结果页面：点击知道了按钮")
    def click_know_button(self):
        self.click_element(self.wait_precence_element(self.know_button_loc, "知道了按钮"))

    @allure.step("批量开发票时，酒店列表页面的数量")
    def hotel_list_count(self):
        return self.element_count(self.ele_list_loc, "酒店列表元素")
