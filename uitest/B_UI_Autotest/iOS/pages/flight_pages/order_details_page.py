# -*- coding: utf-8 -*-
# @time     : 2021/7/29 17:28
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : order_details_page.py
import time

import allure
from appium.webdriver.common.mobileby import MobileBy

from selenium.webdriver.common.by import By
from common.base_page import BasePage


class OrderDetailsPage(BasePage):
    """机票订单详情页面"""
    # ‘取消订单’按钮
    manual_cancel_order_btn_loc = (By.XPATH, "//a[text()='取消订单']")
    # 再次确认取消订单弹窗，‘确定’按钮
    confirm_manual_cancel_order_loc = (By.XPATH, "//*[text()='确定取消订单？']/../..//a[text()='确定']")
    # 去支付按钮元素定位器
    payment_button_loc = (By.XPATH, "//*[contains(text(), '去支付')]")
    # 微信支付测试按钮元素定位器
    wechat_pay_test_loc = (By.XPATH, "//*[contains(text(), '微信支付测试')]")
    # 订单详情页，订单状态元素字段
    result_text_loc = (By.CLASS_NAME, "status")
    # -----------------------------出票后的元素-----------------------------
    # 乘客栏的退票按钮
    refund_button_loc = (By.XPATH, "(//span[contains(text(), '退票')])[1]/..")
    # 选择退票乘机人弹窗的选择框
    select_refund_button_loc = (By.XPATH, "//div[@class='psgLable']//*[name()='svg']")
    # 选择退票乘机人弹窗的‘确定’按钮
    confirm_refund_button_loc = (By.XPATH, "//div[text()='确定']")
    # -----------------------------退票申请页的元素-----------------------------
    # 退票申请页，提交申请按钮
    submit_applications_loc = (By.XPATH, "//span[text()='提交申请']/..")
    # 确定提交申请弹窗的‘确定’
    submit_btn_loc = (By.XPATH, "//a[text()='确定']")
    # 已提交申请说明页面，‘确定’按钮
    submitted_btn_loc = (By.XPATH, "//span[text()='确定']/..")
    # 选择退票原因栏
    refund_reason_bar_loc = (By.XPATH, "//li[@class='cancel-reason cursorp']")
    # 退票原因选择列表中，选择退票原因
    select_refund_reason_ele = "//div[contains(text(), '{}')]"
    # ‘上传凭证’按钮
    # upload_documents_btn_loc = (By.XPATH, "//div[@class='attachments-container']/div[@class='addAttachment']")
    upload_documents_btn_loc = (42, 617)
    # ------------app环境选择图片-----------
    # ‘照片图库’按钮
    a = 'label == "照片图库"'
    app_select_image_loc = (MobileBy.IOS_PREDICATE, a)
    # ‘相机胶卷’相册
    photo_album_loc = (MobileBy.IOS_PREDICATE, 'label == "相机胶卷"')
    # 选择图片
    image_coordinates_loc = (50, 115)
    # 确认选择的图片
    image_confirm_loc = (MobileBy.IOS_PREDICATE, 'label == "完成"')

    @allure.step("订单详情页面：点击‘取消订单’按钮")
    def manual_cancel_order_btn(self):
        self.click_element(self.wait_element_clickable(self.manual_cancel_order_btn_loc, "‘取消订单’按钮"))

    @allure.step("订单详情页面：确认取消订单弹窗中，点击‘确定’按钮")
    def confirm_manual_cancel_order(self):
        self.click_element(self.wait_element_clickable(self.confirm_manual_cancel_order_loc, "‘确定’按钮"))

    @allure.step("订单详情页面:点击'去支付'按钮")
    def click_payment_button(self):
        """点击去支付按钮"""
        return self.click_element(self.wait_element_clickable(self.payment_button_loc, "支付按钮"))

    @allure.step("订单详情页面:点击'微信支付测试'")
    def wechat_pay(self):
        """点击微信支付测试"""
        return self.click_element(self.wait_element_clickable(self.wechat_pay_test_loc, "微信支付测试"))

    @allure.step("订单详情页面:获取订单的状态")
    def pay_result_text(self):
        return self.wait_element_visible(self.result_text_loc, "订单状态字段").text

    # ---------------------------------------------出票后的操作---------------------------------------------
    @allure.step("出票后的订单详情页面：点击乘客栏的‘退票’按钮")
    def click_refund_button(self):
        self.click_element(self.wait_element_visible(self.refund_button_loc, "‘退票’按钮"))

    @allure.step("出票后的订单详情页面：选择需要退票的乘客")
    def click_select_refund_button(self, value):
        if value != 1:
            # 查找所有的退票乘客
            ele_lis = self.find_elements(self.select_refund_button_loc)
            print("退票可选择的乘客元素列表：", ele_lis)
            key = 0
            for i in range(value - 1):
                # 依次选择需要退票的乘客
                self.click_element(ele_lis[key])
                key += 1
            # 点击‘确定’按钮
            self.confirm_refund_button()
        else:
            # 点击‘确定’按钮
            self.confirm_refund_button()

    @allure.step("出票后的订单详情页面：确认选择的退票乘客")
    def confirm_refund_button(self):
        self.click_element(self.wait_precence_element(self.confirm_refund_button_loc, "‘确定’按钮"))

    # -----------------------------退票申请页的操作-----------------------------
    @allure.step("退票申请页面：点击‘提交申请’按钮")
    def click_submit_applications(self):
        self.click_element(self.wait_element_visible(self.submit_applications_loc, "点击'提交申请'按钮"))

    @allure.step("退票申请页面：提交申请确认弹窗中，点击‘确定’按钮")
    def click_submit_btn(self):
        self.click_element(self.wait_precence_element(self.submit_btn_loc, "弹窗中点击‘确定’按钮"))

    @allure.step("退票申请页面：已提交申请说明页面，点击‘确定’按钮")
    def click_submitted_btn(self):
        self.click_element(self.wait_element_visible(self.submitted_btn_loc, "已提交申请说明页面，‘确定’按钮"))

    @allure.step("退票申请页面：点击‘退票原因’选择栏")
    def click_refund_reason_bar(self):
        self.click_element(self.wait_element_visible(self.refund_reason_bar_loc, "选择退票原因栏"))

    @allure.step("退票申请页面：‘退票原因’选择栏选择一个原因")
    def select_refund_reason(self, value):
        # 元素定位器
        locator = (By.XPATH, self.select_refund_reason_ele.format(value))
        # 选择退票原因
        self.click_element(self.wait_element_visible(locator, "退票原因"))

    @allure.step("退票申请页面：点击‘上传凭证’按钮")
    def click_upload_documents_btn(self):
        time.sleep(1)
        # self.js_click(self.wait_element_clickable(self.upload_documents_btn_loc, "上传凭证按钮"))
        self.touch_tap(self.upload_documents_btn_loc)

    @allure.step("退票申请页面：app环境点击‘选择图片’按钮")
    def click_app_select_image(self):
        # 点击‘选择图片’按钮
        self.switch_webview()
        self.click_element(self.wait_precence_element(self.app_select_image_loc, "app环境‘选择图片’按钮"))
        # 进入相册
        time.sleep(1)
        self.click_element(self.wait_element_visible(self.photo_album_loc, '相册'))
        # 选择图片
        time.sleep(1)
        self.driver.tap([self.image_coordinates_loc])
        # 确认选择的图片
        self.click_element(self.wait_precence_element(self.image_confirm_loc, '确认选择的图片'))
        # 切换至webview环境
        self.switch_webview("webview")
