# -*- coding: utf-8 -*-
# @time     : 2021/8/12 22:28
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : edit_order_page.py

import allure

from selenium.webdriver.common.by import By
from common.base_page import BasePage
from common.mylogger import my_log


class EditOrderPage(BasePage):
    """机票编辑订单页面"""
    # 提交订单按钮元素定位器
    submit_order_button_loc = (By.XPATH, "//*[text()= '提交订单']")
    # -----------------------------------乘客编辑相关元素-----------------------------------
    # 乘客列表中，‘新增’按钮
    add_passenger_btn_loc = (By.XPATH, "//li[@class='add_psg']/*[name()='svg']")
    # 乘客选择元素定位表达式
    passenger_lict_loc = "//div[text()='{}']/../../../../div[@class='checkBox']/*[name()='svg']"
    # 确认选择的乘客
    confirm_choose_passenger_loc = (By.XPATH, "//div[@class='right blue-btn cursorp']")

    @allure.step("编辑订单页面:点击提交订单按钮，跳转至订单详情标签页")
    def click_submit_order_button_switch(self, options="确定"):
        try:
            self.click_element(self.find_element(self.submit_order_button_loc, "提交订单"))
            # 确认是否需要报销凭证
            self.selection_confirm(options)
            # 点击提交订单按钮，并切换至订单详情页面
            self.click_submit_order_button()
        except:
            self.driver.switch_to.window(self.driver.window_handles[-1])

    def click_submit_order_button(self):
        """点击提交订单按钮，并切换至订单详情页面"""
        self.switch_to_new_window_wait(
            self.wait_element_clickable(self.submit_order_button_loc, "提交订单"),
            "提交订单",
            frequcy=0.5
        )

    @allure.step("编辑订单页面：确认是否需要报销凭证")
    def selection_confirm(self, options):
        """
        确认是否需要报销凭证
        :param options:输入”确定“或者”取消“，str
        """
        # 是否需要报销凭证，并支付15元邮寄费的提醒弹窗，"确定"按钮
        confirm_button_loc = (
            By.XPATH,
            "//div[contains(text(), '您是否需要报销凭证')]/../..//descendant::a[contains(text(), {})]".format(options)
        )
        self.click_element(self.driver.find_element(*confirm_button_loc))
        
    # -----------------------------------乘客编辑相关操作-----------------------------------
    @allure.step("机票编辑订单页面：点击'新增'乘客按钮")
    def click_add_passenger_btn(self):
        self.click_element(self.wait_precence_element(self.add_passenger_btn_loc, "'新增'乘客按钮"))

    @allure.step("机票的添加乘客页面：选择乘客")
    def choose_passenger_list(self, value):
        """
        :param value: 选择的乘客名字
        """
        # 乘客元素定位器
        ele = (By.XPATH, self.passenger_lict_loc.format(value))
        # 点击乘客
        self.click_element(self.wait_element_clickable(ele, "选择乘客"))

    @allure.step("机票的添加乘客页面：确认选择的乘客")
    def confirm_choose_passenger(self):
        self.click_element(self.wait_precence_element(self.confirm_choose_passenger_loc, "‘确定’按钮"))

