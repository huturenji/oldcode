# -*- coding: utf-8 -*-
# @time     : 2021/8/12 20:45
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : flight_number_list_page.py

import allure
from selenium.webdriver.common.by import By
from common.base_page import BasePage


class FlightNumberListPage(BasePage):
    """机票航班列表页"""
    # 机票航班班次定位器
    flight_num_loc = (By.XPATH, "//div[@id='list']/div[2]")

    @allure.step("机票航班列表页:选择航班班次")
    def click_flight_number(self):
        self.wait_click_element_success(
            self.wait_element_clickable(self.flight_num_loc, "航班班次"),
            "航班班次",
            frequcy=1
        )
