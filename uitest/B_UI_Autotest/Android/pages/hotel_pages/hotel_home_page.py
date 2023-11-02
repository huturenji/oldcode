# -*- coding: utf-8 -*-
# @time     : 2021/8/13 17:00
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : hotel_home_page.py
import time

import allure

from common.mylogger import my_log
from selenium.webdriver.common.by import By
from appium.webdriver.common.mobileby import MobileBy
from common.base_page import BasePage
from common.read_yaml import ReadYaml
from selenium.webdriver.common.touch_actions import TouchActions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class HotelHomePage(BasePage):
    """酒店首页"""
    # 读取设备信息
    device = ReadYaml("caps.yaml").read_yaml()["device"]
    # Android弹窗：是否允许获取位置信息
    authorization_loc = (MobileBy.ANDROID_UIAUTOMATOR,
                         'new UiSelector().resourceId(\"com.android.packageinstaller:id/permission_allow_button\")')
    # 查询按钮定位器
    search_button_loc = (By.XPATH, "//button[contains(@class, 'primaryButton')]")
    # 出发日期控件定位器
    time_date_loc = (By.XPATH, "//div[@class='panelWrap']")
    # 酒店搜索关键字
    search_bar_loc = (By.XPATH, "//input[@class='text xg9']")
    # 酒店城市元素
    select_city_loc = (By.XPATH, "//div[@class='leftTextWrap cursorp']")
    # 当前位置按钮
    location_loc = (By.XPATH, "//div[@class='nearLocationWrap']/*[name()='svg']")
    # 获取定位位置文本
    location_text_loc = (By.XPATH, "//div[@class='textDetail cursorp']")
    # 价格/星级选择栏
    price_star_but_loc = (By.XPATH, "//div[contains(@class, 'starWrap bbpxd')]//*[name()='svg']")
    # 价格范围选择右边的按钮
    price_choose_right_loc = (By.XPATH, "(//*[@class='el-slider__button el-tooltip'])[2]")
    # 关闭价格星级选择窗口按钮
    Shut_down_loc = (By.XPATH, "//div[@class='btnWrap icon-btn']/*[name()='svg']")

    @allure.step("酒店首页:选择出发日期")
    def selection_day(self, check_in_date, check_out_date):
        """选择入住、离店时间，次日起算第一天
        check_in_date: 入住日期，int类型
        check_out_date: 。离店日期，int类型
        """
        try:
            # 酒店首页允许定位授权的弹窗，只有Android有，iOS屏蔽掉下面一行代码
            if self.device["platformName"] == "Android":
                self.allow_location()
            self.date_function(check_in_date, check_out_date)
        except:
            # 切换至H5环境
            self.switch_webview("webview")
            self.date_function(check_in_date, check_out_date)

    def date_function(self, check_in_date, check_out_date):
        """选择入住日期、离店日期"""
        # 等待日期控件出现
        wait_date = WebDriverWait(self.driver, 3, 0.5).until(EC.presence_of_element_located(self.time_date_loc))
        # 点击日期控件
        wait_date.click()
        # 选择日期元素
        check_in_date = (By.XPATH,
                         "//li[contains(@class, 'isToday')]/../..//following::div[@class='cursorp'][{}]".format(
                             check_in_date))
        check_out_date = (By.XPATH,
                          "//li[contains(@class, 'isToday')]/../..//following::div[@class='cursorp'][{}]".format(
                              check_out_date))
        # 选择入住日期
        self.swipe_up()
        self.click_element(self.wait_element_clickable(check_in_date, "入住日期"))
        # 选择离店日期
        self.click_element(self.wait_element_clickable(check_out_date, "离店日期"))

    @allure.step("Android弹窗：提示是否允许获取位置信息")
    def allow_location(self):
        # 切回App原生环境
        self.switch_webview()
        # App原生环境“允许授权”的‘允许’定位器
        authorization_loc = self.authorization_loc
        # 等待弹窗出现
        wait = WebDriverWait(self.driver, 3, 0.5).until(EC.presence_of_element_located(authorization_loc))
        # 点击“允许授权”
        wait.click()
        my_log.info("允许获取手机位置信息!")
        # 切换至H5环境
        self.switch_webview("webview")

    @allure.step("酒店首页:输入酒店查询关键字")
    def search_hotel_text(self, value):
        self.input_keys(self.find_element(self.search_bar_loc, "酒店名称输入框"), value)

    @allure.step("酒店首页:点击查询按钮, 跳转至酒店列表页")
    def click_search_button(self):
        self.switch_to_new_window_wait(
            self.find_element(self.search_button_loc, "查询按钮"),
            "酒店首页",
            frequcy=1
        )

    @allure.step("酒店首页：选择城市入口")
    def select_city_entrance(self):
        self.click_element(self.wait_precence_element(self.select_city_loc, "选择城市入口"))

    @allure.step("酒店首页：选择城市")
    def select_city(self, value):
        if value == "武汉":
            ele = (By.XPATH, "//div[@class='hisCity']//img")
            self.click_element(self.wait_precence_element(ele, "城市：武汉"))
        else:
            ele = (By.XPATH, "//div[@class='hotCity']//*[text()='{}']".format(value))
            self.click_element(self.wait_precence_element(ele, "城市：{}".format(value)))

    @allure.step("酒店首页：点击当前位置按钮")
    def click_location_button(self):
        self.click_element(self.wait_element_visible(self.location_loc, "酒店首页定位按钮"))

    @allure.step("酒店首页：获取定位的当前位置文本")
    def get_text(self):
        return self.wait_element_visible(self.location_text_loc, "定位的当前位置").text

    @allure.step("酒店首页：点击价格/星级选择栏")
    def click_price_star(self):
        self.click_element(self.wait_precence_element(self.price_star_but_loc, "价格/星级按钮"))

    @allure.step("酒店首页：价格区间筛选中左滑按钮")
    def touch_ele_slid(self, xoffset=-200):
        """左滑价格按钮，默认选择价格区间：0-300;传参-100滑动至500，每增加50左滑多一格"""
        # 找到价格按钮
        ele = self.wait_precence_element(self.price_choose_right_loc, "价格区间按钮")
        time.sleep(0.5)
        # 左滑价格区间选择按钮
        TouchActions(self.driver).flick_element(ele, xoffset, 0, 1000).perform()

    @allure.step("酒店首页：选择酒店星级")
    def choose_star(self, value="四星/高档"):
        """选择酒店星级"""
        # 价格星级中选择‘四星/高档’元素
        star_loc = (By.XPATH, "//*[text()='{}']".format(value))
        # 点击星级
        self.click_element(self.wait_precence_element(star_loc, "酒店星级"))

    @allure.step("酒店首页：关闭价格星级选择窗口")
    def click_shut_down_button(self):
        """关闭价格星级选择窗口"""
        self.click_element(self.wait_precence_element(self.Shut_down_loc, "关闭价格星级选择窗口按钮"))
