# -*- coding: utf-8 -*-
# @time     : 2021/6/23 14:21
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : login.py

import time
import allure
from appium.webdriver.common.mobileby import MobileBy
from selenium.webdriver.common.by import By
from common.base_page import BasePage
from appium.webdriver.common.touch_action import TouchAction
from selenium.webdriver.common.touch_actions import TouchActions
# 导入日志模块
from common.mylogger import my_log


class LoginBizmate(BasePage):
    # 元素定位器
    # 用户协议
    agreement_one_loc = (MobileBy.ANDROID_UIAUTOMATOR,
                         'new UiSelector().resourceId(\"com.sinosun.bizmate.ace:id/html_agree\")')
    # 同意用户权限：我知道了按钮
    know_button_loc = (MobileBy.ANDROID_UIAUTOMATOR,
                       'new UiSelector().resourceId(\"com.sinosun.bizmate.ace:id/html_agree\")')
    # 第一项授权元素
    authorization_one_loc = (MobileBy.ANDROID_UIAUTOMATOR,
                             'new UiSelector().resourceId(\"com.android.packageinstaller:id/permission_allow_button\")')
    # 第二项授权元素
    authorization_two_loc = (MobileBy.ANDROID_UIAUTOMATOR,
                             'new UiSelector().resourceId(\"com.android.packageinstaller:id/permission_allow_button\")')
    # 元素：“立即体验”
    experience_loc = (MobileBy.ANDROID_UIAUTOMATOR,
                      'new UiSelector().resourceId(\"com.sinosun.bizmate.ace:id/welcome_btnstart\")')
    # 元素：“账号密码登录”
    ele_loc = (By.XPATH, "//div[@class='authenticationTypeApp']")
    # 手机号输入框元素
    send_phone_loc = (By.XPATH, "//input[@id='phone']")
    # 密码输入框元素
    send_pwd_loc = (By.ID, "passwordView")
    # 登录页面同意勾选协议
    instructions_loc = (By.CLASS_NAME, "instructions_uncheckedIcon")
    # 安全键盘：切换大写
    switch_capital_loc = (MobileBy.ID, "com.sinosun.bizmate.ace:id/keyboard_letter_upper_switch")
    # 安全键盘：切换小写
    switch_lower_loc = (MobileBy.ID, "com.sinosun.bizmate.ace:id/keyboard_letter_lower_switch")
    # 安全键盘：切换数字
    switch_number_loc = (MobileBy.ID, "com.sinosun.bizmate.ace:id/keyboard_letter_number_switch")
    # 安全键盘：大写Q
    capital_Q_loc = (MobileBy.XPATH, '//*[@text="Q"]')
    # 安全键盘：小写q
    lower_q_loc = (MobileBy.XPATH, '//*[@text="q"]')
    # 安全键盘：数字1
    ele_1_loc = (MobileBy.XPATH, '//*[@text="1"]')
    # 登录按钮
    login_button_loc = (By.ID, "kc-form-buttons")
    cancel_button = (MobileBy.ID, "com.sinosun.bizmate.ace:id/negative_bt")
    # 是否开启伴正事悬浮框的提示
    temporarily_not_open_loc = (MobileBy.ID, "com.sinosun.bizmate.ace:id/negative_bt")
    # App引导页
    app_guide_loc = (MobileBy.ID, "com.sinosun.bizmate.ace:id/guide_main")

    @allure.step("登录伴正事App")
    def login_bizmate(self):
        """登录伴正事App"""
        my_log.info("----------------------------开始登录伴正事--------------------------------")
        # 同意用户协议
        self.click_element(self.wait_precence_element(self.agreement_one_loc, "同意第一个用户协议"))
        # 同意权限
        self.click_element(self.wait_precence_element(self.know_button_loc, "我知道了"))
        # 同意两项授权
        self.click_element(self.wait_precence_element(self.authorization_one_loc, "第一项授权，同意"))
        self.click_element(self.wait_precence_element(self.authorization_two_loc, "第二项授权，同意"))
        # 滑屏操作
        time.sleep(1.5)
        self.swipe_left(3)
        self.click_element(self.wait_precence_element(self.experience_loc, "点击立即体验"))
        # 切换至webview环境
        time.sleep(0.5)
        self.switch_webview('webview')
        self.click_element(self.wait_element_clickable(self.instructions_loc, "勾选同意协议"))
        self.click_element(self.wait_precence_element(self.ele_loc, "点击'账号密码登录'"))
        self.input_keys(self.wait_precence_element(self.send_phone_loc, "手机号输入框"), "132 6063 1733")
        self.click_element(self.wait_precence_element(self.send_pwd_loc, "密码输入框"))
        # 切换至安卓原生环境，使用安全键盘
        self.switch_webview()
        #  安全键盘：切换大写
        self.click_element(self.wait_precence_element(self.switch_capital_loc, "切换键盘大写按钮"))
        self.click_element(self.wait_precence_element(self.capital_Q_loc, "大写Q"))
        # 安全键盘：切换小写
        self.click_element(self.wait_precence_element(self.switch_lower_loc, "切换键盘小写按钮"))
        for i in range(6):
            self.click_element(self.wait_precence_element(self.lower_q_loc, "小写q"))
        # 安全键盘：切换数字
        self.click_element(self.wait_precence_element(self.switch_number_loc, "切换数字键盘按钮"))
        self.click_element(self.wait_precence_element(self.ele_1_loc, "数字1"))
        # 切换至webview环境，点击登录
        self.switch_webview('webview')
        self.click_element(self.wait_precence_element(self.login_button_loc, "登录按钮"))
        # 切换至安卓原生环境
        self.switch_webview()
        self.click_element(self.wait_precence_element(self.cancel_button, "自启动取消按钮"))
        # 不开启伴正事的悬浮框
        self.click_element(self.wait_precence_element(self.temporarily_not_open_loc, "暂不开启伴正事悬浮框"))
        # App的引导页
        for i in range(4):
            self.click_element(self.wait_element_visible(self.app_guide_loc, "下一步"))
        my_log.info("--------------------------------登录完成--------------------------------")
