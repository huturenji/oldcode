# -*- coding: utf-8 -*-
# @time     : 2021/12/17 16:18
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : mall_home_page.py

import allure
from common.mylogger import my_log
from common.read_yaml import ReadYaml
from selenium.webdriver.common.by import By
from appium.webdriver.common.mobileby import MobileBy
from common.base_page import BasePage
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class MallHomePage(BasePage):
    """商云首页"""
    # -------------------------------------app弹窗-------------------------------------
    # 读取设备信息
    device = ReadYaml("caps.yaml").read_yaml()["device"]
    # Android弹窗：是否允许获取位置信息
    authorization_loc = (MobileBy.ANDROID_UIAUTOMATOR,
                         'new UiSelector().resourceId(\"com.android.packageinstaller:id/permission_allow_button\")')
    # -----------------------------------元素定位数据------------------------------------
    # 商云首页顶部的搜索栏
    search_bar_loc = (By.CSS_SELECTOR, "uni-view.seachTopLan>uni-input.ser-input>div.uni-input-wrapper>input")
    # 搜索页面的搜索栏
    searchpage_bar_loc = (By.XPATH, "//uni-view[@class='sea_input_part']//input[@class='uni-input-input']")
    # 点击搜索栏进入搜索页面，搜索栏右边的‘搜索’按钮
    search_but_loc = (By.XPATH, "//span[text()='搜索']")
    # 商云首页导航栏
    nav_bar_loc = (By.XPATH, "//*[text()='没有更多了']")
    # 商云首页导航栏，‘京东’栏
    jd_btn_loc = (By.XPATH, "(//*[@id='u-tab-item-1'])[1]")
    # 商云首页‘京东’分类商品中，第一个商品
    jd_goods_loc = (By.XPATH, "(//uni-view[@class='goodsNameWrap'])[6]/uni-view")
    # 商城首页的购物车按钮
    cart_thumb_loc = (By.XPATH, "//uni-view[@class='cart-thumb']")

    # -------------------------------------app弹窗-------------------------------------
    @allure.step("Android弹窗：提示是否允许获取位置信息")
    def allow_location(self):
        if self.device["platformName"] == "Android":
            # 切回App原生环境
            self.switch_webview()
            # 弹窗点击“允许授权”
            try:
                wait = WebDriverWait(self.driver, 10, poll_frequency=0.3).until(
                    EC.presence_of_element_located(self.authorization_loc))
                wait.click()
                self.switch_webview("webview")
                my_log.info("允许获取手机位置信息!")
            except:
                # 切换至H5环境
                self.switch_webview("webview")

    # -----------------------------------------搜索部分---------------------------------------
    @allure.step("BBC商城首页：点击页面上方的搜索栏")
    def click_search_bar(self):
        self.click_element(self.wait_element_visible(self.search_bar_loc, "页面顶部的‘搜索’栏"))
        # 从登录app开始时，执行下面流程：H5页面同意获取App定位权限
        # self.allow_location()

    @allure.step("搜索页面：输入搜索内容")
    def send_search_keys(self, value):
        self.input_keys(self.wait_element_visible(self.searchpage_bar_loc, "页面顶部的‘搜索’栏"), value)

    @allure.step("搜索页面：搜索栏后面的‘搜索’按钮")
    def click_search_but(self):
        self.click_element(self.wait_precence_element(self.search_but_loc, "'搜索'按钮"))

    # ----------------------------------------导航栏及商品列表-----------------------------------
    @allure.step("BBC商城首页：滚动页面至导航栏出现在页面")
    def scroll_nav_bar(self):
        self.scroll_into_view(self.wait_element_visible(self.nav_bar_loc, "商云首页导航栏"))

    @allure.step("BBC商城首页：点击导航栏的‘京东’")
    def click_jd_btn(self):
        self.click_element(self.wait_element_visible(self.jd_btn_loc, "导航栏：京东"))

    @allure.step("BBC商城首页：选择京东的商品")
    def click_jd_goods(self):
        self.click_element(self.wait_element_clickable(self.jd_goods_loc, "选择京东分类的商品"))

    @allure.step("BBC商城首页：点击购物车按钮")
    def click_cart_thumb_btn(self):
        self.click_element(self.wait_precence_element(self.cart_thumb_loc, "首页的购物车按钮"))
