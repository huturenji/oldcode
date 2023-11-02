# -*- coding: utf-8 -*-
# @time     : 2021/7/26 18:32
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : train_home_page.py
import time

import allure

from selenium.webdriver.common.by import By
from common.base_page import BasePage


class TrainHomePage(BasePage):
    """火车票首页"""
    # 查询按钮定位器
    search_button_loc = (By.XPATH, "//div[text()='查询']")
    # 出发日期控件定位器
    time_date_loc = (By.XPATH, "//div[@class='dateItemWrap cursorp']")

    @allure.step("火车票首页:选择出发日期")
    def selection_day(self, day):
        """选择出发日期，次日起算第一天
        day: 第几天，int类型
        """
        # 点击时间控件
        self.click_element(self.wait_element_clickable(self.time_date_loc, "出发日期控件"))
        # 选择日期元素
        date = (By.XPATH,
                "//li[@class='isToday']/../..//following::div[@class='cursorp'][{}]".format(day))
        # 点击选择的日期
        self.click_element(self.wait_element_clickable(date, "出发日期"))

    @allure.step("火车票首页:点击查询按钮, 跳转至车次列表页")
    def click_search_button(self):
        """点击查询按钮, 跳转至新的标签页"""
        self.switch_to_new_window_wait(
            self.find_element(self.search_button_loc, "查询按钮"),
            "火车票首页"
        )
