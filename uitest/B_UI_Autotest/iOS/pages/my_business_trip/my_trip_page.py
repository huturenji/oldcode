# -*- coding: utf-8 -*-
# @time     : 2021/9/3 17:58
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : my_trip_page.py

import allure

from selenium.webdriver.common.by import By
from common.base_page import BasePage


class MyTripPage(BasePage):
    """我的行程页面"""
    # 酒店行程中，酒店名称的Xpath定位表达式
    hotel_name_loc = "//div[text()='{}']"
    # 行程卡片中入住人的名字
    people_name_loc = "//div[text()='{}']/../descendant::span[@class='name'][{}]"

    @allure.step("我的行程页面：判断预订的酒店是否生成行程")
    def find_hotel_trip(self, name):
        """
        name:预订的酒店名称，全称包括符号，且区分英文和中文符号
        """
        locator = (By.XPATH, self.hotel_name_loc.format(name))
        return self.is_element_exist(locator, "酒店：{}的行程".format(name))

    def get_trip_count(self, name):
        """查询酒店行程元素有多少个，返回数量"""
        locator = (By.XPATH, self.hotel_name_loc.format(name))
        return self.element_count(locator, "酒店：{}的行程".format(name))

    @allure.step("我的行程页面：获取入住人的姓名")
    def find_hotel_people(self, name, value):
        """
        name:预订的酒店名称，全称包括符号，且区分英文和中文符号
        value:第几个入住人
        """
        return self.find_element((By.XPATH, self.people_name_loc.format(name, value))).text

    @allure.step("我的行程页面：点击酒店行程")
    def click_hotel_trip(self, name):
        locator = (By.XPATH, self.hotel_name_loc.format(name))
        self.switch_to_new_window_wait(
            self.find_element(locator, "点击酒店‘{}’行程".format(name)),
            "我的行程页面"
        )

    def swipe_find_element(self, name, count):
        locator = (By.XPATH, self.hotel_name_loc.format(name))
        return self.swipe_up_find_element(locator, count=count, step_desc=name, total=20)
