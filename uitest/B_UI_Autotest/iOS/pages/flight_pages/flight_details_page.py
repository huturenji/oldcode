# -*- coding: utf-8 -*-
# @time     : 2021/8/12 20:57
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : flight_details_page.py

import allure

from selenium.webdriver.common.by import By
from common.base_page import BasePage


class FlightDetailsPage(BasePage):
    """航班班次详情页"""
    # 预订按钮定位器
    reserve_button_loc = (By.XPATH, "(//*[contains(text(), '预订')])[2]")

    @allure.step("航班班次详情页:点击预订按钮")
    def click_reserve_button(self):
        self.click_element(self.wait_element_clickable(self.reserve_button_loc, "预订"))
