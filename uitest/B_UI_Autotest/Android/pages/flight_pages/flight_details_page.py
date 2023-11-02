# -*- coding: utf-8 -*-
# @time     : 2021/8/12 20:57
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : flight_details_page.py
import time

import allure

from selenium.webdriver.common.by import By
from common.base_page import BasePage


class FlightDetailsPage(BasePage):
    """航班班次详情页"""
    # 预订按钮定位器
    reserve_button_loc = (By.XPATH, "(//*[contains(text(), '预订')])[2]")
    # 改签按钮定位器
    changing_button_loc = (By.XPATH, "(//*[contains(text(), '改签')])[2]")
    # 申请改签时的页面，’立即改签‘按钮
    immediately_change_btn_loc = (By.XPATH, "//*[contains(text(), '立即改签')]")

    @allure.step("航班班次详情页:点击预订按钮")
    def click_reserve_button(self):
        self.click_element(self.wait_element_clickable(self.reserve_button_loc, "预订"))

    @allure.step("航班班次详情页:点击改签按钮")
    def click_changing_button(self):
        self.click_element(self.wait_element_clickable(self.changing_button_loc, "改签"))

    @allure.step("申请改签时的页面，:点击立即改签按钮")
    def click_now_changing_button(self):
        # 点击"立即改签"之前所有的标签页
        old_handles = self.driver.window_handles
        # 点击"立即改签"
        self.click_element(self.wait_element_clickable(self.immediately_change_btn_loc, "立即改签"))
        # 等待'申请改签'页面完全消失
        while True:
            time.sleep(1)
            new_handles = self.driver.window_handles
            # print("进入循环后的new_handles", new_handles)
            if len(old_handles) - len(new_handles) == 1:
                return self.driver.switch_to.window(self.driver.window_handles[-1])
