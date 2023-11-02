# -*- coding: utf-8 -*-
# @time     : 2021/8/15 17:46
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : order_details_page.py
import time

import allure

from selenium.webdriver.common.by import By
from common.base_page import BasePage


class OrderDetailsPage(BasePage):
    """酒店订单详情页面"""
    # 去支付按钮元素定位器
    payment_button_loc = (By.XPATH, "//*[contains(text(), '去支付')]")
    # 未支付'取消订单'按钮元素定位器
    no_pay_cancel_order_loc = (By.XPATH, "//a[@class='btn-cancel cursorp normal-btn']")
    # 未支付取消订单时，弹窗的确定按钮
    no_pay_cancel_confirm_loc = (By.XPATH, "//div[text()='确定取消订单？']/../..//a[text()='确定']")
    # 微信支付测试按钮元素定位器
    wechat_pay_test_loc = (By.XPATH, "//*[contains(text(), '微信支付测试')]")
    # ------------------------------------------支付成功后的订单详情页------------------------------------------
    # 支付成功后返回订单详情页，“已支付,待确认”元素字段
    result_text_loc = (By.XPATH, "//div[@class='status']")
    # 取消订单按钮元素
    cancel_order_loc = (By.XPATH, "//button[@class='normal-btn bp-button bp-button-danger']")
    # 确认取消订单按钮元素
    confirm_cancel_order_loc = (By.XPATH, "//div[@class='cancelButton cursorp normal-btn']")
    # ------------------------------------------到店付，验证银行卡信息------------------------------------------
    # 信用卡号输入框元素定位器
    credit_card_input_loc = (By.XPATH, "//input[@placeholder='有效信用卡号码']")
    # CVV2码输入框元素定位器
    cvv2_input_loc = (By.XPATH, "//input[@placeholder='卡背后末3位数字']")
    # 持卡人输入框元素定位器
    cardholder_input_loc = (By.XPATH, "//input[@placeholder='持卡人姓名']")
    # 证件号码输入框元素定位器
    ID_number_input_loc = (By.XPATH, "//input[contains(@placeholder, '证件类型号码')]")
    # 手机号码输入框元素定位器
    phone_input_loc = (By.XPATH, "//input[contains(@placeholder, '预留的手机号码')]")
    # 获取验证码按钮元素定位器
    verify_code_btn_loc = (By.CLASS_NAME, "getCaptcha")
    # 验证码输入框元素定位器
    verify_input_loc = (By.CLASS_NAME, "Captcha")
    # 提交按钮元素定位器
    submit_button_loc = (By.XPATH, "//div[@class='primaryBtn']/button[contains(@class, 'bp-button-primary')]")
    # ------------------------------------------------报销凭证相关元素------------------------------------------------
    # 报销凭证栏详情字段后面的三角按钮
    invoice_bar_loc = (By.XPATH, "//div[@class='rightWrap reimburse']//*[name()='svg']")
    # 报销凭证页面：下载PDF按钮
    download_pdf_loc = (By.XPATH, "//span[@class='check cursorp']")
    # 报销凭证页面：付款方税号
    payer_one_loc = (By.XPATH, "(//*[@class='content'])[1]/p[2]")
    # 报销凭证页面：付款方抬头
    payer_two_loc = (By.XPATH, "(//*[@class='content'])[1]/p[1]")
    # 报销凭证页面：收款方
    collection_loc = (By.XPATH, "(//*[@class='content'])[2]")
    # 报销凭证页面：发票金额
    invoice_amount_loc = (By.XPATH, "//*[@class='content money']")
    # 下单后订单详情页面补开报销凭证按钮
    repair_invoice_loc = (By.XPATH, "//div[@class='reimburse-btn cursorp']")
    # 开具报销凭证页面的‘提交’按钮
    submit_loc = (By.XPATH, '//div[@class="submit cursorp"]')
    # 酒店订单详情页面
    price_num_loc = (By.CLASS_NAME, "amountNum")

    @allure.step("订单详情页面:点击'去支付'按钮")
    def click_payment_button(self):
        return self.click_element(self.wait_element_clickable(self.payment_button_loc, "支付按钮"))

    @allure.step("订单详情页面:点击'微信支付测试'")
    def wechat_pay(self):
        return self.click_element(self.wait_element_clickable(self.wechat_pay_test_loc, "微信支付测试"))

    @allure.step("订单详情页面: 未支付时点击取消订单按钮")
    def click_no_pay_cancel_order(self):
        self.click_element(self.find_element(self.no_pay_cancel_order_loc, "取消订单"))

    @allure.step("订单详情页面：未支付是否取消提示弹窗，点击确定按钮")
    def click_no_pay_cancel_confirm(self):
        self.click_element(self.find_element(self.no_pay_cancel_confirm_loc, "确定"))

    # ------------------------------------------支付成功后的订单详情页------------------------------------------
    @allure.step("返回订单详情页面:获取订单'已支付，待确认'状态")
    def pay_result_text(self):
        """在线付酒店订单详情，订单状态"""
        return self.wait_precence_element(self.result_text_loc, "订单'已支付，待确认'状态字段").text

    @allure.step("返回订单详情页面:获取订单'待确认'状态")
    def to_pay_result_text(self):
        """到店付酒店订单详情，订单状态"""
        return self.wait_element_clickable(self.result_text_loc, "订单'待确认'状态字段").text

    @allure.step("取消后的订单详情页面: 获取订单'已取消'状态")
    def cancel_order_status(self):
        return self.find_element(self.result_text_loc, "订单'已取消'状态字段").text

    @allure.step("返回订单详情页面:点击取消订单按钮")
    def click_cancel_order_button(self):
        self.swipe_up()
        self.click_element(self.find_element(self.cancel_order_loc, "取消订单按钮"))

    @allure.step("返回订单详情页面: 点击确认取消订单按钮")
    def click_confirm_cancel_order_button(self):
        self.click_element(self.wait_precence_element(self.confirm_cancel_order_loc, "确认取消订单按钮"))
    
    # ------------------------------------------报销凭证相关-------------------------------------------------
    @allure.step("订单详情页面: 点击报销凭证栏，跳转至报销凭证页面")
    def click_invoice_bar(self):
        self.switch_to_new_window_wait(
            self.find_element(self.invoice_bar_loc, "报销凭证栏"),
            "订单详情页",
            frequcy=0.3
        )

    @allure.step("报销凭证页面：点击‘下载PDF’按钮")
    def click_download_pdf(self):
        time.sleep(3)
        self.click_element(self.wait_element_visible(self.download_pdf_loc, "下载PDF按钮"))

    @allure.step("订单详情页面：点击补开报销凭证按钮，进入开具报销凭证页面")
    def click_repair_invoice(self):
        self.switch_to_new_window_wait(
            self.wait_element_visible(self.repair_invoice_loc, "补开报销凭证"),
            "订单详情页",
            frequcy=0.3
        )

    @allure.step("开具报销凭证页面：点击提交按钮")
    def click_submit(self):
        self.click_element(self.wait_precence_element(self.submit_loc, "提交按钮"))

    @allure.step("开具报销凭证页面：获取付款方税号信息")
    def get_payer(self):
        return self.wait_precence_element(self.payer_one_loc, "付款方税号").text

    @allure.step("开具报销凭证页面：获取付款方抬头信息")
    def get_payer_peo(self):
        return self.wait_precence_element(self.payer_two_loc, "付款方抬头").text

    @allure.step("开具报销凭证页面：获取收款方信息")
    def get_collection(self):
        return self.wait_precence_element(self.collection_loc, "收款方").text

    def get_invoice_amount(self):
        return self.wait_precence_element(self.invoice_amount_loc, "发票金额").text

    @allure.step("订单详情页面：取消订单后查询补开报销凭证元素")
    def element_exist(self):
        return self.is_element_exist(self.repair_invoice_loc, "补开报销凭证按钮")

    @allure.step("订单详情页面：获取酒店的价格")
    def price_number(self):
        return self.wait_precence_element(self.price_num_loc, "酒店价格").text

    # ------------------------------------------到店付，验证银行卡信息------------------------------------------
    @allure.step("验证银行卡信息页面：输入信用卡号")
    def input_credit_card(self, value):
        self.input_keys(self.wait_element_visible(self.credit_card_input_loc, "信用卡号输入框"), value)

    @allure.step("验证银行卡信息页面：输入CVV2码")
    def input_cvv2_num(self, value):
        self.input_keys(self.find_element(self.cvv2_input_loc, "CVV2码输入框"), value)

    @allure.step("验证银行卡信息页面：输入持卡人姓名")
    def input_cardholder_name(self, value):
        self.input_keys(self.find_element(self.cardholder_input_loc, "持卡人姓名输入框"), value)

    @allure.step("验证银行卡信息页面：输入银行卡开卡时使用的证件号码")
    def input_idcard_number(self, value):
        self.input_keys(self.find_element(self.ID_number_input_loc, "证件号码输入框"), value)

    @allure.step("验证银行卡信息页面：输入手机号码")
    def input_phone_number(self, value):
        self.input_keys(self.find_element(self.phone_input_loc, "手机号码输入框"), value)

    @allure.step("验证银行卡信息页面：点击获取验证码按钮")
    def click_verify_code_btn(self):
        self.click_element(self.find_element(self.verify_code_btn_loc, "获取验证码"))

    @allure.step("验证银行卡信息页面：输入验证码")
    def input_verify_code(self, value):
        self.input_keys(self.find_element(self.verify_input_loc, "验证码输入框"), value)

    @allure.step("验证银行卡信息页面：点击提交按钮")
    def click_submit_button(self):
        self.click_element(self.find_element(self.submit_button_loc, "提交按钮"))
