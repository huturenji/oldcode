# -*- coding: utf-8 -*-
# @time     : 2021/7/29 17:28
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : order_details_page.py
import time

import allure

from selenium.webdriver.common.by import By
from appium.webdriver.common.mobileby import MobileBy
from common.base_page import BasePage
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class OrderDetailsPage(BasePage):
    """机票订单详情页面"""
    # ‘取消订单’按钮
    manual_cancel_order_btn_loc = (By.XPATH, "//a[text()='取消订单']")
    # 再次确认取消订单弹窗，‘确定’按钮
    confirm_manual_cancel_order_loc = (By.XPATH, "//*[text()='确定取消订单？']/../..//a[text()='确定']")
    # '去支付'按钮元素定位器
    payment_button_loc = (By.XPATH, "//*[contains(text(), '去支付')]")
    # '微信支付测试'按钮元素定位器
    wechat_pay_test_loc = (By.XPATH, "//*[contains(text(), '微信支付测试')]")
    # ‘公款闪付’按钮元素定位器
    quick_pay_loc = (By.XPATH, "//*[contains(text(), '公款闪付')]")
    # ‘公款闪付’确认弹窗的‘支付’按钮
    quick_to_pay_loc = (
        MobileBy.ANDROID_UIAUTOMATOR, 'new UiSelector().resourceId(\"com.sinosun.bizmate.ace:id/btn_pay\")')
    # ‘公款闪付’输入支付密码的键盘中，数字0建
    zero_loc = (MobileBy.ANDROID_UIAUTOMATOR, 'new UiSelector().text(\"0\")')
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
    upload_documents_btn_loc = (By.XPATH, "//div[@class='addAttachment']")
    # ------------app环境选择图片-----------
    # ‘选择图片’按钮
    a = 'new UiSelector().text(\"选择图片\")'
    b = 'new UiSelector().textContains(\"选择图片\")'
    c = 'new UiSelector().className(\"android.widget.LinearLayout\")'
    app_select_image_loc = (MobileBy.ANDROID_UIAUTOMATOR, b)
    # ‘截屏录屏’相册
    photo_album_loc = (MobileBy.ANDROID_UIAUTOMATOR, 'new UiSelector().textContains(\"截屏录屏\")')
    # 选择图片
    image_coordinates_loc = (125, 300)
    # 确认选择的图片
    image_confirm_loc = (MobileBy.ANDROID_UIAUTOMATOR,
                         'new UiSelector().resourceId(\"com.android.gallery3d:id/head_select_right\")')
    # ------------------------------------------改签相关元素-----------------------------------------
    # '改签'按钮
    changing_order_btn_loc = (By.XPATH, "(//span[contains(text(), '改签')])[1]/..")
    # 改签的乘机人选择框
    select_changing_order_btn_loc = (By.XPATH, "//div[@class='psgLable']//*[name()='svg']")
    # 改签的乘机人'确定'选择按钮
    changing_submit_btn_loc = (By.XPATH, "//div[text()='确定']")
    # 改签的订单详情页面，乘客栏的状态字段
    changing_success_loc = (By.XPATH, "(//div[@class='cust-btn-group clear']/div[@class='psg-status fl'])[1]")
    # ---------申请改签页面---------
    # 搜索航班按钮
    search_flight_btn_loc = (By.XPATH, "//span[text()='搜索航班']/..")
    # 出发时间选择栏
    departure_time_svg_loc = (By.XPATH, "//span[text()='出发时间']/..//*[name()='svg']")
    # 机票舱位选择栏
    seat_choice_svg_loc = (By.XPATH, "//span[text()='舱位']/..//*[name()='svg']")
    # 选择舱位弹窗中：舱位的选项
    seat_choice_li = "//li[contains(text(), '{}')]"
    # 选择舱位弹窗中：改签时舱位选择规则提示
    marked_words_text_loc = (By.CSS_SELECTOR, "div.tips-container>div.tips")
    # 改签需补款时，出现的‘取消’按钮
    changing_cancel_btn_loc = (By.XPATH, "(//div[@class='add-money']/div[@class='btn-group']/button)[1]")

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
        return self.wait_precence_element(self.result_text_loc, "订单状态字段").text

    # -----------------------公款闪付操作-----------------------
    @allure.step("订单详情页面：选择‘公款闪付’支付方式")
    def click_quick_payment(self):
        return self.click_element(self.wait_element_clickable(self.quick_pay_loc, "公款闪付"))

    @allure.step("订单详情页面：点击公款闪付弹窗的‘支付’按钮")
    def click_quick_to_pay(self):
        self.click_element(self.wait_element_clickable(self.quick_to_pay_loc, "‘支付’按钮"))

    @allure.step("订单详情页面：输入支付密码")
    def input_quick_pay_pwd(self):
        self.click_element(self.wait_element_clickable(self.zero_loc, '键盘0'))

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
        self.click_element(self.wait_precence_element(self.submit_applications_loc, "点击'提交申请'按钮"))

    @allure.step("退票申请页面：提交申请确认弹窗中，点击‘确定’按钮")
    def click_submit_btn(self):
        self.click_element(self.wait_precence_element(self.submit_btn_loc, "弹窗中点击‘确定’按钮"))

    @allure.step("退票申请页面：已提交申请说明页面，点击‘确定’按钮")
    def click_submitted_btn(self):
        self.click_element(self.wait_element_visible(self.submitted_btn_loc, "已提交申请说明页面，‘确定’按钮"))

    @allure.step("退票申请页面：点击‘退票原因’选择栏")
    def click_refund_reason_bar(self):
        self.click_element(self.wait_precence_element(self.refund_reason_bar_loc, "选择退票原因栏"))

    @allure.step("退票申请页面：‘退票原因’选择栏选择一个原因")
    def select_refund_reason(self, value):
        # 元素定位器
        locator = (By.XPATH, self.select_refund_reason_ele.format(value))
        # 选择退票原因
        self.click_element(self.wait_element_visible(locator, "退票原因"))

    @allure.step("退票申请页面：点击‘上传凭证’按钮")
    def click_upload_documents_btn(self):
        self.click_element(self.wait_element_visible(self.upload_documents_btn_loc, "上传凭证按钮"))

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

    # ------------------------------------------改签相关操作----------------------------------------
    @allure.step("出票后的订单详情页面：点击乘客栏的‘改签’按钮")
    def click_changing_button(self):
        self.click_element(self.wait_element_visible(self.changing_order_btn_loc, "‘改签’按钮"))

    @allure.step("出票后的订单详情页面：选择需要改签的乘客")
    def click_select_changing_button(self, value):
        if value != 1:
            # 查找所有的改签乘客
            ele_lis = self.find_elements(self.select_changing_order_btn_loc)
            # print("改签可选择的乘客元素列表：", ele_lis)
            key = 0
            for i in range(value - 1):
                # 依次选择需要改签的乘客
                self.click_element(ele_lis[key])
                key += 1
            # 点击‘确定’按钮
            self.confirm_changing_button()
        else:
            # 点击‘确定’按钮
            self.confirm_changing_button()

    @allure.step("出票后的订单详情页面：确认选择的改签乘客")
    def confirm_changing_button(self):
        self.click_element(self.wait_precence_element(self.changing_submit_btn_loc, "‘确定’按钮"))

    @allure.step("申请改签页面，点击‘出发时间’栏")
    def click_departure_time_svg(self):
        self.click_element(self.wait_precence_element(self.departure_time_svg_loc, "'出发时间'栏"))
        date_ele = "//li[@class='isToday']/../..//following::div[@class='dayDetail'][3]"
        wait = self.wait_element_visible((By.XPATH, date_ele), "改签起飞时间")
        self.scroll_into_view(wait)
        self.click_element(wait)

    @allure.step("申请改签页面：点击‘舱位’选择栏，然后选择舱位")
    def click_seat_choice(self, value):
        self.click_element(self.wait_precence_element(self.seat_choice_svg_loc, "舱位选择栏"))
        ele = (By.XPATH, self.seat_choice_li.format(value))
        self.click_element(self.wait_element_visible(ele, '舱位'))

    @allure.step("申请改签页面：点击‘舱位’选择栏")
    def click_seat_svg(self):
        self.click_element(self.wait_precence_element(self.seat_choice_svg_loc, "舱位选择栏"))

    @allure.step("申请改签页面：不能选择的舱位获取其class属性值")
    def get_seat_attribute(self, value):
        ele = (By.XPATH, self.seat_choice_li.format(value))
        text = self.wait_element_visible(ele, '舱位').get_attribute("class")
        return text

    def get_marked_words_text(self):
        wait = self.wait_element_visible(self.marked_words_text_loc, "改签舱位选择规则提示")
        color = self.get_css_attribute(wait, "color")
        text = wait.get_attribute('textContent')
        return color, text

    @allure.step("改签的订单详情页面：等待改签补款，出现‘去支付’按钮时直接支付")
    def to_pay(self):
        num = 0
        while num < 10:
            time.sleep(5)
            try:
                wait = WebDriverWait(self.driver, 0.5, 0.5).until(EC.presence_of_element_located(
                    (By.XPATH, "//*[contains(text(), '去支付')]/..")
                ))
                time.sleep(2)
                self.js_click(wait)
                break
            except:
                self.refresh_page()
                num += 1
        self.wechat_pay()

    def to_pay_time_over(self):
        num = 0
        while num < 60:
            time.sleep(10)
            wait = WebDriverWait(self.driver, 0.5, 0.5).until(
                EC.presence_of_element_located(self.changing_success_loc))
            if wait.text == '改签失败':
                return wait.text
            else:
                self.refresh_page()
                num += 1

    @allure.step("申请改签页面，点击‘搜索航班‘按钮")
    def click_search_flight_btn(self):
        self.switch_to_new_window_wait(
            element_located=self.wait_element_clickable(self.search_flight_btn_loc, "搜索航班按钮"),
            step_desc="‘搜索航班‘按钮",
            timeout=40,
            frequcy=1
        )

    @allure.step("改签成功后的订单详情页：获取’改签成功‘后的状态")
    def get_changing_success_text(self):
        times = 0
        while times < 18:
            time.sleep(5)
            self.refresh_page()
            time.sleep(2)
            order_status = self.wait_element_visible(self.changing_success_loc, "改签成功字段").text
            # print("该乘客的机票状态", order_status)
            if order_status == '改签成功':
                return order_status
            else:
                times += 1

    def get_people_status(self):
        order_status = self.wait_element_visible(self.changing_success_loc, "改签成功字段").text
        return order_status

    @allure.step("改签需补款页面：点击‘取消’按钮")
    def click_changing_cancel_btn(self):
        num = 0
        wait = ""
        while num < 10:
            time.sleep(5)
            self.refresh_page()
            try:
                time.sleep(5)
                wait = self.driver.find_element(*self.changing_cancel_btn_loc)
                break
            except:
                num += 1
        wait.click()
