# -*- coding: utf-8 -*-
# @time     : 2021/7/27 17:10
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : train_number_details_page.py

import allure
from selenium.webdriver.common.by import By
from common.base_page import BasePage


class TrainNumberDetailsPage(BasePage):
    """火车票车次详情页"""
    # 预订按钮定位器
    reserve_button_loc = (By.XPATH, "(//span[contains(text(), '预订')])[1]")

    @allure.step("车次详情页:选择席位，点击预定按钮")
    def click_reserve_button(self):
        self.click_element(self.wait_element_clickable(self.reserve_button_loc, "预订"))
