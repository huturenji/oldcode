# -*- coding: utf-8 -*-
# @time     : 2021/8/15 16:38
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : hotel_details_page.py
import time

import allure

from selenium.webdriver.common.by import By
from common.base_page import BasePage


class HotelDetailsPage(BasePage):
    """酒店详情页"""
    # 酒店房型元素定位器
    # room_type_loc = "(//span[@class='hotArea num-font'])[{}]/*[name()='svg']"
    room_type_loc = "//div[contains(text(), '{}')]"
    # '在线付'按钮元素定位器
    # pay_online_button_loc = (By.XPATH, "(//div[text()='在线付'])[1]")
    pay_online_button_loc = "//div[contains(text(), '{}')]/../../../../../descendant::div[text()='在线付'][1]"
    # '到店付'按钮元素定位器
    # to_pay_button_loc = (By.XPATH, "(//div[text()='到店付'])[1]")
    to_pay_button_loc = "//div[contains(text(), '{}')]/../../../../../descendant::div[text()='到店付'][1]"
    # 类型选择栏，到店付按钮
    default_but_loc = (By.XPATH, "//div[@class='tagItem cursorp'][2]/span")
    # 酒店查询无房型时，缺省区块显示
    room_default_loc = (By.XPATH, "//div[@class='emptyCompWrap noroom normal']")
    # 缺省图标元素
    default_pic_loc = (By.XPATH, "//div[@class='emptyComp']")

    @allure.step("酒店详情页：选择酒店房型")
    def click_room_type(self, room_name):
        time.sleep(2)
        self.swipe_up()
        self.click_element(self.wait_element_clickable((By.XPATH, self.room_type_loc.format(room_name)), "酒店房型"))

    @allure.step("酒店详情页：选择'在线付'还是'到店付'方式")
    def click_payment_methon_button(self, method, room_name):
        if method == "在线付":
            # self.click_element(self.wait_element_visible(self.pay_online_button_loc, "在线付"))
            self.click_element(
                self.wait_element_visible((By.XPATH, self.pay_online_button_loc.format(room_name)), "在线付"))
        elif method == "到店付":
            # self.click_element(self.wait_element_visible(self.to_pay_button_loc, "到店付"))
            self.click_element(
                self.wait_element_visible((By.XPATH, self.to_pay_button_loc.format(room_name)), "到店付"))
        else:
            raise ValueError("没有该类型的房源")
            
    @allure.step("酒店详情页：点击酒店日期下面的到店付按钮")
    def click_default_but(self):
        self.click_element(self.wait_precence_element(self.default_but_loc, "到店付按钮"))

    @allure.step("酒店详情页：获取缺省块的属性")
    def get_property_values(self):
        return self.wait_precence_element(self.room_default_loc, "无房间时，缺省信息块").get_attribute("style")

    @allure.step("酒店详情页：找到缺省图标元素")
    def find_default_pic(self):
        return self.wait_element_visible(self.default_pic_loc, "缺省图标元素")
