# -*- coding: utf-8 -*-
# @time     : 2021/8/15 16:07
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : hotel_list_page.py
import time

import allure
from selenium.webdriver.common.touch_actions import TouchActions
from selenium.webdriver.common.by import By
from common.base_page import BasePage


class HotelListPage(BasePage):
    """酒店列表页面"""
    # 搜索到的酒店列表中，第一个酒店元素
    the_first_hotel_loc = (By.XPATH, "(//div[contains(@class, 'hoteListItem normal-btn')])[1]")
    # 顶部筛选：推荐排序
    sorting_loc = (By.XPATH, "//div[@class='tabItem cursorp'][1]/span")
    # 顶部筛选：位置区域
    distance_loc = (By.XPATH, "//div[@class='tabItem cursorp'][2]/span")
    # 按距离范围筛选后，酒店列表的距离数据
    distance_data_loc = (By.XPATH, "//*[@class='leftLine']/span")
    # 顶部筛选：价格/星级筛选按钮元素
    price_star_search_loc = (By.XPATH, "//div[@class='tabItem cursorp'][3]/span")
    # 顶部筛选：品牌/设施等筛选
    select_brand_loc = (By.XPATH, "//div[@class='tabItem cursorp'][4]/span")
    # 酒店列表中酒店名元素
    hotel_name_loc = (By.XPATH, "//span[@class='name']")
    # 价格/星级筛选条件中重置按钮元素
    reset_button_loc = (By.XPATH, "//span[@class='rsetButton normal-btn']")
    # 价格/星级筛选条件中完成按钮元素
    complete_button_loc = (By.XPATH, "//span[@class='okButton normal-btn']")
    # 页面顶部的'搜索'框
    search_input_loc = (By.CSS_SELECTOR, "div.componentOut>div.contentWrap>div.content>div.input-block>input")
    search_document_loc = "document.getElementsByTagName('input')[0];"
    # 页面顶部的'搜索'按钮
    search_button_loc = (By.XPATH, "//div[@class='icon cursorp normal-btn']")
    # 查询无酒店时，缺省信息
    hotel_default_loc = (By.XPATH, "//div[@class='emptyCompWrap normal']/div")
    # 清空筛选按钮
    delete_button_loc = (By.XPATH, "//span[@class='cursorp normal-btn']")
    # 酒店列表的价格元素
    price_list_loc = (By.XPATH, "//span[@class='num-font money']")
    # 四星/高档
    star_loc = (By.XPATH, "//div[text()='四星/高档']")
    # 酒店列表页筛选后，符合条件的价格
    price_search_loc = (By.XPATH, "//*[contains(@class,'lineWrap hoteListItem')]//span[@class='num-font money']")
    # 酒店页列表筛选后，获取酒店列表的星级
    list_star_loc = (By.XPATH, "//*[contains(@class,'lineWrap hoteListItem')]//*[contains(@class,'star starIcon')]")

    @allure.step("酒店列表页：酒店列表选择酒店，点击后进入酒店详情页")
    def click_hotel_list(self):
        self.click_element(self.wait_element_clickable(self.the_first_hotel_loc, "点击酒店列表"))

    @allure.step("酒店列表页：点击推荐排序按钮")
    def click_sorting(self):
        self.click_element(self.wait_precence_element(self.sorting_loc, "推荐排序元素"))

    @allure.step("酒店列表页：选择推荐排序种类")
    def choose_sorting(self, value):
        ele = (By.XPATH, "//div[contains(text(),'{}')]".format(value))
        self.click_element(self.wait_precence_element(ele, "选择'{}'排序".format(value)))

    @allure.step("酒店列表页：选择位置区域筛选按钮")
    def click_distance_btn(self):
        self.click_element(self.wait_element_clickable(self.distance_loc, "位置区域筛选按钮"))

    @allure.step("酒店列表页：选择筛选的位置区域范围值")
    def select_distance_range(self, value):
        ele = (By.XPATH, "//*[text()='{}']".format(value))
        self.click_element(self.wait_precence_element(ele, "选择距离范围"))

    @allure.step("酒店列表页：距离远近数据所有元素")
    def get_distance_data(self):
        return self.find_elements(self.distance_data_loc, "距离远近元素")

    @allure.step("酒店列表页：选择价格/星级筛选按钮")
    def click_price_star_search_btn(self):
        self.click_element(self.wait_element_clickable(self.price_star_search_loc, "价格/星级筛选按钮"))

    @allure.step("酒店列表页：选择酒店星级")
    def choose_star(self, value):
        """选择酒店星级"""
        # 价格星级中选择‘四星/高档’元素
        star_loc = (By.XPATH, "//*[text()='{}']".format(value))
        # 点击星级
        self.click_element(self.wait_precence_element(star_loc, "酒店星级"))

    @allure.step("酒店列表页：点击价格/星级筛选中重置按钮")
    def click_reset_button(self):
        self.click_element(self.wait_element_clickable(self.reset_button_loc, "价格/星级筛选中重置按钮"))

    @allure.step("酒店列表页：点击价格/星级筛选条件中完成按钮")
    def click_complete_button(self):
        self.click_element(self.find_element(self.complete_button_loc, "价格/星级筛选中完成按钮"))

    @allure.step("酒店列表页：点击顶部选择栏的筛选按钮")
    def click_brand_button(self):
        self.click_element(self.wait_element_clickable(self.select_brand_loc, "品牌等筛选按钮"))

    @allure.step("酒店列表页：筛选中选择酒店品牌")
    def choose_hotel_brand(self, value):
        """
        点击酒店品牌
        :param value:酒店品牌名
        :return:
        """
        ele = (By.XPATH, "//div[text()='热门']/..//*[text()='{}']".format(value))
        self.click_element(self.wait_element_visible(ele, "选择酒店品牌"))

    @allure.step("酒店列表页：获取酒店名称所有元素")
    def get_hotel_name(self):
        return self.find_elements(self.hotel_name_loc, "酒店名称元素")

    @allure.step("酒店列表页：酒店搜索框输入内容")
    def search_hotel(self, value):
        self.input_keys(self.wait_precence_element(self.search_input_loc, "酒店列表页的搜索框"), value)

    @allure.step("酒店列表页：获取搜索输入框的内容")
    def get_input_text(self):
        return self.wait_precence_element(self.search_input_loc, "酒店列表页的搜索框").get_attribute('value')

    @allure.step("搜索框输入后，通过js方法确认")
    def search_enter(self):
        self.js_keyboard_enter(self.search_document_loc)

    @allure.step("酒店列表页：点击搜索按钮")
    def click_search_button(self):
        self.click_element(self.wait_element_clickable(self.search_button_loc, "搜索按钮"))

    @allure.step("酒店列表页：找到缺省图标元素")
    def find_list_default_pic(self):
        return self.wait_element_visible(self.hotel_default_loc, "缺省图标元素")

    @allure.step("酒店列表页：点击清空筛选按钮")
    def click_delete_button(self):
        self.click_element(self.wait_element_visible(self.delete_button_loc, "清空筛选按钮"))

    @allure.step("酒店列表页：获取酒店列表所有的价格")
    def get_price_list(self):
        return self.find_elements(self.price_list_loc, "酒店列表价格")

    @allure.step("酒店列表页：获取酒店列表筛选后的价格")
    def get_price_search_list(self):
        return self.find_elements(self.price_search_loc, "酒店列表价格")

    @allure.step("酒店列表页：获取字体颜色，结果为十六进制数据")
    def get_color(self):
        # 找到元素
        ele = self.wait_precence_element(self.star_loc, "四星/高档按钮")
        # 获取字体的颜色
        css_attr = self.get_css_attribute(ele)
        return css_attr

    @allure.step("酒店列表页：价格区间按钮选中后滑动")
    def touch_ele_slid(self, which, xoffset):
        """滑动价格按钮，传参-100滑动至500，每增加50左滑多一格"""
        # 价格范围选择右边的按钮
        price_choose_right_loc = (By.XPATH, "(//*[@class='el-slider__button el-tooltip'])[{}]".format(which))
        # 找到价格按钮
        ele = self.wait_precence_element(price_choose_right_loc, "价格区间按钮")
        time.sleep(0.5)
        # 左滑价格区间选择按钮
        TouchActions(self.driver).flick_element(ele, xoffset, 0, 1000).perform()

    @allure.step("酒店列表页：获取酒店列表的星级文本")
    def get_list_star(self):
        return self.find_elements(self.list_star_loc, "酒店列表的星级文本")
