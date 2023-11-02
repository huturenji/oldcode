# -*- coding: utf-8 -*-
# @time     : 2021/8/12 17:38
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : flight_home_page.py
import time

import allure

from selenium.webdriver.common.by import By
from common.base_page import BasePage


class FlightHomePage(BasePage):
    """机票首页"""
    # 查询按钮定位器
    search_button_loc = (By.XPATH, "//button[contains(@class, 'search-btn')]")
    # 出发日期控件定位器
    time_date_loc = (By.CLASS_NAME, "dateText")

    @allure.step("机票首页:选择出发日期")
    def selection_day(self, day):
        """选择出发日期，次日起算第一天
        day: 第几天，int类型
        """
        # 点击时间控件
        time.sleep(1)
        self.click_element(self.wait_element_clickable(self.time_date_loc, "出发日期控件"))
        # 选择日期元素
        date = (By.XPATH,
                "//div[contains(@class,'today')]/../..//following::div[@class='day-pack'][{}]".format(day))
        # self.swipe_up()
        data_object = self.wait_element_clickable(date, "出发日期")
        # 点击选择的日期
        self.scroll_into_view(data_object)
        self.click_element(data_object)



    @allure.step("机票首页:点击查询按钮, 跳转至航班列表页")
    def click_search_button(self):
        """点击查询按钮, 跳转至航班列表标签页"""
        self.switch_to_new_window_wait(
            self.wait_element(self.search_button_loc, "查询按钮"),
            "查询按钮"
        )
