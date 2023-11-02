# -*- coding: utf-8 -*-
# @time     : 2021/12/21 15:03
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : order_details_page.py

import allure
from selenium.webdriver.common.by import By
from appium.webdriver.common.mobileby import MobileBy
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from common.base_page import BasePage


class OrderDetailsPage(BasePage):
    """订单详情页"""
    # 订单详情页顶部，订单状态字段
    order_status_loc = (By.XPATH, "//uni-view[contains(@class, 'state_title')]//span")
    # '确认收货'按钮
    confirm_order_btn_loc = (By.CSS_SELECTOR, "uni-view.order_det_bottom>uni-view.confirm_receipt")
    # 点击'确认收货'按钮后的弹窗，‘确定’按钮
    pop_ups_confirm_btn_loc = (By.XPATH, "//div[@class='uni-modal']//*[contains(@class, 'uni-modal__btn_primary')]")
    # 待付款订单详情页，底部的‘取消订单’按钮
    cancel_order_btn_loc = (By.XPATH, "//*[text()='取消订单']")
    # 待付款订单详情页，底部的‘立即支付’按钮
    pay_now_btn_loc = (By.XPATH, "//*[text()='立即支付']")
    # 取消原因选择弹窗中的‘确定取消’按钮
    confirm_cancel_order_loc = (By.XPATH, "//*[text()='确定取消']")
    # 确定取消弹窗中的‘确定’按钮
    cancel_order_confirm_loc = (By.XPATH, "//div[@class='uni-modal']/div[@class='uni-modal__ft']/div[contains(text(), '确定')]")
    # -------------------------------------------------发票相关元素-------------------------------------------------
    # 订单信息列表中，发票栏字段
    invoice_type_text_loc = (By.XPATH, "//span[text()='发票：']/../following-sibling::uni-text/span")
    # 订单信息列表中，收票人手机号
    invoice_phone_number_loc = (By.XPATH, "//span[text()='收票人手机：']/../following-sibling::uni-text/span")
    # 订单信息列表中，收票人邮箱
    invoice_email_number_loc = (By.XPATH, "//span[text()='收票人邮箱：']/../following-sibling::uni-text/span")
    # 订单详情页底部导航栏，‘查看发票’按钮
    check_invoice_btn_loc = (By.XPATH, "//uni-view[text()='查看发票']")
    # 下载PDF版电子发票的确认弹窗
    confirm_download_PDF_loc = (MobileBy.ANDROID_UIAUTOMATOR,
                                'new UiSelector().resourceId(\"com.sinosun.bizmate.ace:id/positive_bt\")')
    # 伴正事下载管理页面，左上角的返回按钮
    download_back_page_btn_loc = (By.ID, "com.sinosun.bizmate.ace:id/new_titlebar_back_btn")

    @allure.step("订单详情页面：获取订单详情页的状态字段")
    def get_order_status_text(self):
        return self.wait_element_visible(self.order_status_loc, "订单详情页，状态字段").text

    @allure.step("订单详情页面：等待'确认收货'按钮出现")
    def find_confirm_order_btn(self):
        wait = WebDriverWait(self.driver, 2, poll_frequency=0.3).until(
            EC.presence_of_element_located(self.confirm_order_btn_loc))
        return wait

    @allure.step("订单详情页面：确认收货弹窗中，点击‘确定’按钮")
    def click_pop_ups_confirm_btn(self):
        self.click_element(self.wait_element_clickable(self.pop_ups_confirm_btn_loc, "确认收货弹窗的“确定”按钮"))

    @allure.step("待支付的订单详情页面：点击‘取消订单’按钮")
    def click_cancel_order_btn(self):
        self.click_element(self.wait_element_visible(self.cancel_order_btn_loc, "'取消订单'按钮"))

    @allure.step("待支付的订单详情页面：点击‘立即支付’按钮")
    def click_pay_now_btn(self):
        self.click_element(self.wait_element_visible(self.pay_now_btn_loc, "'立即支付'按钮"))

    @allure.step("待支付的订单详情页面：点击取消原因选择弹窗中的‘确定取消’按钮")
    def click_confirm_cancel_order(self):
        self.click_element(self.wait_precence_element(self.confirm_cancel_order_loc, "取消原因选择弹窗中的‘确定取消’按钮"))

    @allure.step("待支付的订单详情页面：点击确定取消弹窗中的‘确定’按钮")
    def click_cancel_order_confirm(self):
        self.click_element(self.wait_precence_element(self.cancel_order_confirm_loc, "确定取消弹窗中的‘确定’按钮"))

    # -------------------------------------------------发票业务相关操作-------------------------------------------------
    @allure.step("订单详情页面，订单信息列表：获取发票栏字段")
    def get_invoice_type_text(self):
        return self.wait_element_visible(self.invoice_type_text_loc, "订单信息列表中，发票栏字段").text

    @allure.step("订单详情页面，订单信息列表：获取收票人手机号")
    def get_invoice_phone_number(self):
        return self.wait_element_visible(self.invoice_phone_number_loc, "订单信息列表中，收票人手机号").text

    @allure.step("订单详情页面，订单信息列表：获取收票人邮箱")
    def get_invoice_email_number(self):
        return self.wait_element_visible(self.invoice_email_number_loc, "订单信息列表中，收票人邮箱").text

    @allure.step("订单详情页，底部的导航栏：点击‘查看发票’按钮")
    def click_check_invoice_btn(self):
        self.click_element(self.wait_element_clickable(self.check_invoice_btn_loc, "订单详情页底部导航栏，‘查看发票’按钮"))

    @allure.step("订单详情页，确认是否下载弹窗中点击’确定‘")
    def click_confirm_download_pdf(self):
        # 切换至Android原生环境
        self.switch_webview()
        # 是否下载弹窗中，点击’确定‘按钮
        self.click_element(self.wait_precence_element(self.confirm_download_PDF_loc, "下载电子发票的‘确定‘按钮"))

    @allure.step("下载管理页面，点击左上角的’返回‘按钮")
    def click_download_back_page_btn(self):
        self.click_element(self.wait_precence_element(self.download_back_page_btn_loc, "下载管理页面的’返回‘按钮"))
        # 切换至webview环境
        self.switch_webview("webview")
