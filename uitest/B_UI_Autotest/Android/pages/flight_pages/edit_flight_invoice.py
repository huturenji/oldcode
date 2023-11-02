# -*- coding: utf-8 -*-
# @time     : 2022/1/19 23:55
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : edit_flight_invoice.py

import time
import allure

from selenium.webdriver.common.by import By
from common.base_page import BasePage
from common.mylogger import my_log


class EditFlightInvoice(BasePage):
    """机票报销凭证相关"""
    # -------------------------------------------机票编辑订单页元素-------------------------------------------
    # 报销凭证开启按钮
    invoice_switch_loc = (By.XPATH, "//div[@class='switch']/div[contains(@class, 'cursorp sn-switch')]")
    # 下单开发票时报销凭证页面：发票抬头选择栏
    invoice_title_selection_bar_loc = (By.XPATH,
                                       "(//div[contains(text(), '发票抬头') and @class='title']/..//*[name()='svg'])[1]")
    # 配送地址选择栏
    address_selection_bar_loc = (By.XPATH, "//div[contains(text(), '配送地址') and @class='title']/..//*[name()='svg']")
    # ----------------------------补开报销凭证时----------------------------
    # 补开时的‘开具报销凭证’页面，发票抬头选择栏
    been_invoice_title_selection_bar_loc = (
        By.XPATH, "(//div[contains(text(), '发票抬头') and @class='title']/..//*[name()='svg'])[2]")
    # 补开报销凭证时，支付后的结果页面，‘完成’按钮
    complete_btn_loc = (By.XPATH, "//div[@class ='submit_btn cursorp']")
    # -------------------------------------------机票订单详情页元素-------------------------------------------
    # 补开报销凭证按钮
    repair_invoice_btn_loc = (By.XPATH, "//span[text()='补开报销凭证']/..")
    # 已开报销凭证按钮
    been_repair_invoice_btn_loc = (By.XPATH, "//div[@class='reimbursementVoucher cursorp']/*[name()='svg']")
    # ‘报销凭证页面’提示字段：我们将在行程结束后为您寄送报销凭证
    invoice_text_loc = (By.XPATH, "//div[@class='noMail']")
    # 配送方式及配送费
    express_price_loc = (By.XPATH, "//span[text()='配送方式']/../span[@class='infoValue']")
    # ----------------------------------发票抬头页面----------------------------------
    # 发票抬头选择
    sino_invoice_title_loc = "//i[contains(text(), '{}')]/../../../../../descendant::*[name()='svg' " \
                             "and @class='icon btn_common_checkbox_sel']"
    # ----------------------------------配送地址页面----------------------------------
    address_list_loc = "//span[text()='{}']/../../../../descendant::*[name()='svg' " \
                       "and @class='icon btn_common_checkbox_sel']"

    # -----------------------------------------------机票编辑订单页操作-----------------------------------------------
    @allure.step("机票编辑订单页：操作是否开启‘报销凭证’")
    def invoice_switch_choose(self, state):
        """
        操作是否开启‘报销凭证’
        :param state: 传入'true'表示开启，传入'false'表示关闭报销凭证
        :return:
        """
        # 找到报销凭证选择按钮
        invoice_switch = self.wait_element_visible(self.invoice_switch_loc, "报销凭证switch按钮")
        # 滚动报销凭证元素至可视化窗口
        self.scroll_into_view(invoice_switch)
        # 获取当前报销凭证按钮的状态
        invoice_status = invoice_switch.get_attribute("aria-checked")
        # print("机票编辑订单页报,销凭证按钮的状态：", invoice_status, type(invoice_status))
        # 判断状态不对时，点击报销凭证按钮更改状态
        if invoice_status != state:
            self.click_element(invoice_switch)

    @allure.step("机票编辑订单页：点击‘发票抬头选择栏’")
    def click_invoice_title_selection_bar(self):
        self.click_element(self.wait_precence_element(self.invoice_title_selection_bar_loc, "发票抬头选择栏"))

    @allure.step("机票编辑订单页：点击‘配送地址选择栏’")
    def click_address_selection_bar(self):
        self.click_element(self.wait_element_clickable(self.address_selection_bar_loc, "配送地址选择栏"))

    # -----------------------补开报销凭证时-----------------------
    @allure.step("补开报销凭证页：点击‘发票抬头选择栏’")
    def been_invoice_title_selection_bar(self):
        self.click_element(self.wait_precence_element(self.been_invoice_title_selection_bar_loc, "发票抬头选择栏"))

    @allure.step("补开报销凭证时，支付后的结果页面，点击‘完成’按钮")
    def click_complete_btn(self):
        self.click_element(self.wait_precence_element(self.complete_btn_loc, "'完成'按钮"))
        time.sleep(3)
        self.driver.switch_to.window(self.driver.window_handles[-1])

    # ----------------------------------发票抬头页面操作----------------------------------
    @allure.step("发票抬头页面：选择发票抬头")
    def choose_invoice_title(self, value):
        self.click_element(self.wait_element_clickable((By.XPATH, self.sino_invoice_title_loc.format(value)), "发票抬头列表"))

    # ----------------------------------配送地址页面操作----------------------------------
    @allure.step("配送地址页面：选择配送地址")
    def choose_address_list(self, value):
        self.click_element(self.wait_element_clickable((By.XPATH, self.address_list_loc.format(value)), "配送地址列表"))

    # -----------------------------------------------机票订单详情页面操作-----------------------------------------------
    @allure.step("订单详情页面：点击‘补开报销凭证’按钮")
    def click_repair_invoice_btn(self):
        # ‘补开报销凭证’按钮"元素
        ele = self.wait_element_visible(self.repair_invoice_btn_loc, "'补开报销凭证'按钮")
        # 点击进入‘报销凭证’页面
        self.switch_to_new_window_wait(
            ele,
            "订单详情页点击，进入报销凭证页面"
        )

    @allure.step("订单详情页面：已开报销凭证后，点击查看报销凭证")
    def click_been_repair_invoice_btn(self):
        # 找到进入‘报销凭证’页面的元素按钮
        invoice_svg_ele = self.wait_precence_element(self.been_repair_invoice_btn_loc, "‘已开报销凭证’按钮")
        # 点击进入‘报销凭证’页面
        self.switch_to_new_window_wait(
            invoice_svg_ele,
            "订单详情页点击，进入报销凭证页面"
        )

    @allure.step("订单详情页进入的报销凭证页：获取报销凭证结果提示字段")
    def get_invoice_result_text(self):
        return self.wait_precence_element(self.invoice_text_loc, "报销凭证页提示字段").text

    @allure.step("订单详情页进入的报销凭证页：获取配送方式及配送费")
    def get_express_price_text(self):
        return self.wait_precence_element(self.express_price_loc, "配送方式及配送费").text
