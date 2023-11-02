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
    # ‘舱位’选择栏
    seat_choice_svg_loc = (By.XPATH, "//div[@class='text cursorp']/*[name()='svg']")
    # 选择的‘舱位’
    select_seat_text_loc = "//div[@class='cabinListLable cursorp']/div[@class='mainLable']//*[contains(text(), '{}')]"

    @allure.step("机票首页:选择出发日期")
    def selection_day(self, day):
        """选择出发日期，次日起算第一天
        day: 第几天，int类型
        """
        # 点击时间控件
        self.click_element(self.find_element(self.time_date_loc, "出发日期控件"))
        # 选择日期元素
        date = (By.XPATH,
                "//div[contains(@class,'today')]/../..//following::div[@class='day-pack'][{}]".format(day))
        self.swipe_up()
        time.sleep(1)
        date_object = self.wait_element_clickable(date, "出发日期")
        # 点击选择的日期
        self.scroll_into_view(date_object)
        self.click_element(date_object)

    @allure.step("机票首页:点击查询按钮, 跳转至航班列表页")
    def click_search_button(self):
        """点击查询按钮, 跳转至航班列表标签页"""
        self.switch_to_new_window_wait(
            self.find_element(self.search_button_loc, "查询按钮"),
            "机票首页"
        )

    @allure.step("机票首页：点击舱位选择栏，然后选择一个舱位")
    def select_flight_seat(self, value):
        self.click_element(self.wait_element_visible(self.seat_choice_svg_loc, "舱位选择栏"))
        self.click_element(
            self.wait_element_visible((By.XPATH, self.select_seat_text_loc.format(value)), '选择舱位：{}'.format(value)))
