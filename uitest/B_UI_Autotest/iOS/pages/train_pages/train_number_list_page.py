# -*- coding: utf-8 -*-
# @time     : 2021/7/27 14:21
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : train_number_list_page.py
import time
import allure

from selenium.webdriver.common.by import By
from common.base_page import BasePage


class TrainNumberListPage(BasePage):
    """火车票车次列表页"""
    # 火车票车次定位器
    train_num_loc = (By.XPATH, "(//div[@id='list']//div[@class='trainLabel'])[3]")

    @allure.step("车次列表页:选择车次")
    def click_train_number(self):
        """点击火车票车次"""
        # self.wait_click_element_success(
        #     self.wait_element_clickable(self.train_num_loc, "火车票车次"),
        #     "火车票车次",
        #     frequcy=1
        # )
        self.click_element(self.wait_element_clickable(self.train_num_loc, "火车票车次"))
