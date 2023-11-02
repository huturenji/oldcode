# -*- coding: utf-8 -*-
# @time     : 2021/8/15 17:26
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : edit_order_page.py
import time

import allure

from selenium.webdriver.common.touch_actions import TouchActions
from appium.webdriver.common.touch_action import TouchAction
from appium.webdriver.common.mobileby import MobileBy
from selenium.webdriver.common.by import By
from common.base_page import BasePage


class EditOrderPage(BasePage):
    """酒店编辑订单页面"""
    # 选择房间数的下拉按钮元素
    number_rooms_search_loc = (By.XPATH, "//div[contains(@class, 'downWrap bbpxs')]/*[name()='svg']")
    # ------------------------------------------入住人相关元素-----------------------------------------
    # 进入通讯录的按钮元素
    check_in_people_btn_loc = (By.XPATH, "(//div[@class='right cursorp normal-btn'])[1]/*[name()='svg']")
    # 添加入住人页面：“+新增入住人”按钮
    new_occupancy_button_loc = (By.XPATH, "//span[@class='addBut']/*[name()='svg']")
    # 添加入住人页面的确定按钮
    confirm_button_loc = (By.XPATH, "//div[@class='right blue-btn cursorp']")
    # 入住人姓名输入框
    people_name_btn = "(//input[@placeholder='请输入入住人姓名'])[{}]"
    # 入住人身份证输入框
    idcard_input = "(//input[@placeholder='请输入身份证号'])[{}]"
    # 入住人列表中，某入住人列右边的编辑按钮
    edit_passenger_ele = "//div[text()='{}']/../..//child::*[name()='svg']"
    # 左滑入住人列表后，展示的删除按钮
    delete_swipe_loc = "//div[text()='{}']/../../../../../../..//child::*[text()='删除']"
    # 左滑入住人列表后，取消按钮
    cancel_delete_loc = (By.XPATH, "//div[contains(text(),'确定删除该条入')]/../..//child::*[text()='取消']")
    # 左滑入住人列表后，确定删除按钮
    confirm_delete_loc = (By.XPATH, "//div[contains(text(),'确定删除该条入')]/../..//child::*[text()='确定']")
    # ----------------编辑入住人页----------------
    # 编辑入住人页面，“删除”按钮
    edit_page_delete_loc = (By.XPATH, "//div[@class='delete cursorp']")
    # 编辑入住人页面，“保存”按钮
    edit_page_save_loc = (By.XPATH, "//div[@class='save cursorp']")
    # 身份证输入栏
    id_number_input_loc = (By.XPATH, "//textarea[@placeholder='请填写证件号码']")
    # 手机号输入栏
    phone_input_loc = (By.XPATH, "//input[@placeholder='请填写手机号码']")
    # 证件类型栏
    certificate_type_loc = (By.XPATH, "//div[text()='证件类型']/..//span[@class='cursorp']")
    # 证件类型选择弹窗中，选择证件
    id_type_ele = "//div[contains(text(),'{}') and @class='cursorp']"
    # 护照姓输入栏
    passport_name_one = (By.XPATH, "//input[@placeholder='如：ZHANG']")
    # 护照名输入栏
    passport_name_two = (By.XPATH, "//input[@placeholder='如：MIN']")
    # 护照设置证件有效期截止日期的选择栏
    certificate_Validity_loc = (By.XPATH, "//span[@class='vux-cell-placeholder']")
    # 护照选择证件有效期时间后，确定选择按钮
    date_Validity_loc = (By.XPATH, "//div[@class='dp-item dp-right vux-datetime-confirm']")
    # 证件类型有效期,日选项的当天项
    day_choose_loc = (By.XPATH, "//div[@data-role='day']/descendant::div[@class='scroller-indicator']")
    # 证件类型有效期,年选项的当年项
    year_choose_loc = (By.XPATH, "//div[@data-role='year']/descendant::div[@class='scroller-indicator']")
    # -------------------------新增入住人页面--------------------------
    # 新增入住人页面，伴正事通讯录按钮
    bzs_address_book_but = (By.XPATH, "//div[@class='T_addr_div cursorp']/*[name()='svg']")
    # 伴正事App环境选择联系人页面,搜索栏
    app_search_bar_loc = (MobileBy.ID, "com.sinosun.bizmate.ace:id/contact_search")
    # 伴正事App环境选择联系人页面,选择联系人后的‘确定’按钮
    app_confirm_but_loc = (MobileBy.ANDROID_UIAUTOMATOR,
                           'new UiSelector().resourceId(\"com.sinosun.bizmate.ace:id/tv_right_title\")')
    #  伴正事App环境选择联系人页面,搜索后选中唯一的联系人
    search_only_people_loc = (MobileBy.ANDROID_UIAUTOMATOR,
                              'new UiSelector().resourceId(\"com.sinosun.bizmate.ace:id/contactitem_select_cb\")')
    # 姓名填写规范规则按钮
    name_rule_loc = (By.XPATH, "//span[text()='姓名填写规范']")
    # 姓名输入栏
    name_input_loc = (By.XPATH, "//textarea[@placeholder='请填写真实姓名']")
    # 性别选择栏
    choose_sex_loc = "//span[text()='{}']"
    # 出生日期选择栏
    birth_data_loc = (By.XPATH, "//span[text()='请选择出生日期']")
    # 国家地区选择栏
    countries_regions_loc = (By.XPATH, "//span[text()='请选择国家地区']")
    # 证件类型栏，证件示例按钮
    certificate_sample_loc = (By.XPATH, "//div[text()='证件类型']/..//child::*[name()='svg']")
    # 设置国家地区选择页面
    china_regions_loc = (By.XPATH, "//div[contains(text(), '中国CHINA')]")
    # 新增入住人时的证件有效期选择栏
    time_limit_loc = (By.XPATH, "//span[text()='请设置证件有效期截止日期']")
    # 证件类型有效期,日选项的当天项
    day_limit_loc = (By.XPATH, "(//div[@data-role='day'])[2]/descendant::div[@class='scroller-indicator']")
    # 证件类型有效期,年选项的当年项
    year_limit_loc = (By.XPATH, "(//div[@data-role='year'])[2]/descendant::div[@class='scroller-indicator']")
    # 证件有效期的确定按钮
    limit_confirm_loc = (By.XPATH, "(//div[text()='确定'])[2]")
    # ‘保存’按钮
    save_button_loc = (By.XPATH, "//*[text()='保存']")
    # ------------------------------------------在线付------------------------------------------
    # 提交订单按钮元素定位器
    submit_order_button_loc = (By.XPATH, "//*[text()= '提交订单']")
    # ------------------------------------------到店付------------------------------------------
    # 去担保按钮元素定位器
    guarantee_button_loc = (By.XPATH, "//*[text()= '去担保']")
    # 到店付酒店，选择无需担保按钮元素定位器
    no_guarantee_loc = (By.XPATH, "(//div[contains(@class, 'panel-box_attend box_select')])[1]")
    # 到店付酒店，选择需要担保按钮元素定位器
    select_guarantee_loc = (By.XPATH, "(//div[contains(@class, 'panel-box_attend box_select')])[2]")
    # -------------------------------------------发票相关元素--------------------------------------------------
    # 勾选报销凭证的switch组件
    invoice_switch_loc = (By.XPATH, "//div[@class='orderRightWrap cursorp']/div")

    @allure.step("编辑订单页面:点击提交订单按钮，跳转至订单详情标签页")
    def click_submit_order_button_switch(self):
        self.switch_to_new_window_wait(
            self.wait_element_clickable(self.submit_order_button_loc, "提交订单"),
            "提交订单",
            frequcy=1
        )

    @allure.step("编辑订单页面:点击提交订单按钮测试toast提示，不跳转标签页")
    def click_submit_order_button(self):
        self.click_element(self.find_element(self.submit_order_button_loc, "提交订单"))

    @allure.step("编辑订单页面:点击去担保按钮，跳转至验证银行卡信息标签页")
    def click_guarantee_button_switch(self):
        self.switch_to_new_window_wait(
            self.wait_element_clickable(self.guarantee_button_loc, "去担保"),
            "去担保",
            frequcy=1
        )

    @allure.step("编辑订单页面: 到店付酒店选择无需信用卡担保")
    def search_guarantee_button(self):
        self.click_element(self.wait_element_visible(self.no_guarantee_loc, "无需担保按钮"))

    # ---------------------------------------------------入住人操作方法----------------------------------------------------
    @allure.step("编辑订单页面: 点击房间数下拉按钮")
    def click_number_rooms_search(self):
        self.click_element(self.find_element(self.number_rooms_search_loc, "选择房间数的下拉按钮"))

    @allure.step("编辑订单页面: 选择间房")
    def search_room_number(self, number):
        """
        选择需要开几间房，传入房间数量number
        """
        # 选择几间房的元素
        room_loc = (By.XPATH, "//div[contains(@class, 'roomItem cursorp')][{}]".format(number))
        # 点击选择的房间数
        self.click_element(self.find_element(room_loc, "几间房"))

    @allure.step("编辑订单页面: 进入通讯录按钮")
    def check_in_people_btn(self):
        self.click_element(self.wait_element_visible(self.check_in_people_btn_loc, "进入通讯录按钮"))

    @allure.step("添加入住人页面：点击‘新增入住人’按钮")
    def click_add_people_button(self):
        self.click_element(self.wait_precence_element(self.new_occupancy_button_loc, "新增入住人按钮"))

    @allure.step("编辑订单页面: 根据名字选择入住人")
    def select_people(self, name):
        name_of_people = (By.XPATH, "//div[text()='{}']".format(name))
        self.click_element(self.wait_element_clickable(name_of_people, "选择入住人"))

    @allure.step("编辑订单页面: 确认选择的入住人")
    def confirm_people_button(self):
        self.click_element(self.find_element(self.confirm_button_loc, "选择入住人确认按钮"))

    @allure.step("编辑订单页面: 删除入住人名称")
    def clear_people(self, value):
        """
        value:第几个入住人输入栏
        """
        passenger_loc = (By.XPATH, self.people_name_btn.format(value))
        self.wait_element_visible(passenger_loc, "入住人输入栏").clear()

    @allure.step("编辑订单页面: 输入入住人名称")
    def input_people(self, value, name):
        """
        value:第几个入住人输入栏
        name:需要输入的入住人姓名
        """
        passenger_loc = (By.XPATH, self.people_name_btn.format(value))
        a = self.find_element(passenger_loc, "入住人输入栏")
        self.input_keys(self.find_element(passenger_loc, "入住人输入栏"), name)

    @allure.step("编辑订单页面: 获取入住人输入栏的姓名")
    def get_people_name(self, value):
        passenger_loc = (By.XPATH, self.people_name_btn.format(value))
        return self.wait_element_visible(passenger_loc, "入住人输入栏").get_attribute('value')

    @allure.step("编辑订单页面: 删除身份证号码")
    def clear_id_card(self, value):
        """
        value:第几个身份证输入栏
        """
        idcard_input_loc = (By.XPATH, self.idcard_input.format(value))
        self.wait_element_visible(idcard_input_loc, "身份证输入栏").clear()

    @allure.step("编辑订单页面: 输入身份证号码")
    def input_id_card(self, value, id_card):
        """
        value:第几个身份证输入栏
        name:需要输入的身份证号
        """
        idcard_input_loc = (By.XPATH, self.idcard_input.format(value))
        self.input_keys(self.find_element(idcard_input_loc, "身份证输入栏"), id_card)

    @allure.step("编辑订单的添加入住人页面：左滑入住人")
    def touch_passenger_lift(self, value, xoffset):
        """
        :param value: 需要滑动的入住人名称
        :param xoffset: 横屏方向的偏移量
        """
        # 滑动的入住人列表元素定位器
        ele_loc = (By.XPATH, self.edit_passenger_ele.format(value))
        # 定位到需要滑动的入住人
        ele = self.wait_precence_element(ele_loc, "需要滑动的入住人")
        time.sleep(0.5)
        # 左滑价格区间选择按钮
        TouchActions(self.driver).flick_element(ele, xoffset, 0, 1000).perform()

    @allure.step("编辑订单的添加入住人页面：点击左滑后的删除按钮")
    def click_delete_but(self, value):
        ele_loc = (By.XPATH, self.delete_swipe_loc.format(value))
        self.click_element(self.wait_element_visible(ele_loc, "左滑后删除按钮"))

    @allure.step("编辑订单的添加入住人页面：左滑入住人点击删除后，弹窗中取消按钮")
    def click_candel_delete(self):
        self.click_element(self.wait_precence_element(self.cancel_delete_loc, "弹窗中取消按钮"))

    @allure.step("编辑订单的添加入住人页面：左滑入住人点击删除后，弹窗中确定按钮")
    def click_confirm_delete(self):
        self.click_element(self.wait_precence_element(self.confirm_delete_loc, "弹窗中确定按钮"))

    @allure.step("编辑订单的添加入住人页面：点击入住人编辑按钮")
    def click_edit_passenger(self, value):
        ele_loc = (By.XPATH, self.edit_passenger_ele.format(value))
        self.click_element(self.wait_precence_element(ele_loc, "入住人{}的编辑按钮".format(value)))

    # --------------------编辑入住人页面--------------------
    @allure.step("编辑订单页里面的编辑入住人页面：点击删除按钮")
    def click_edit_page_delete(self):
        self.click_element(self.wait_element_visible(self.edit_page_delete_loc, "删除按钮"))

    @allure.step("编辑订单页里面的编辑入住人页面：点击保存按钮")
    def click_edit_page_save(self):
        self.click_element(self.wait_element_visible(self.edit_page_save_loc, "保存按钮"))

    @allure.step("编辑订单页里面的编辑入住人页面：清除身份证输入栏的内容")
    def clear_id_number(self):
        self.wait_element_visible(self.id_number_input_loc, "身份证输入栏").clear()

    @allure.step("编辑订单页里面的编辑入住人页面：清除手机号输入栏")
    def clear_phone_number(self):
        self.wait_element_visible(self.phone_input_loc, "手机号输入栏").clear()

    @allure.step("编辑订单页里面的编辑入住人页面：输入身份证号")
    def input_id_number(self, value):
        self.input_keys(self.wait_precence_element(self.id_number_input_loc, "身份证输入栏"), value)

    @allure.step("编辑订单页里面的编辑入住人页面：输入手机号")
    def input_phone_number(self, value):
        self.input_keys(self.wait_precence_element(self.phone_input_loc, "手机号输入栏"), value)

    @allure.step("编辑订单页里面的编辑入住人页面：点击证件类型选择栏")
    def click_certificate_type(self):
        self.click_element(self.wait_element_visible(self.certificate_type_loc, "证件类型选择栏"))

    @allure.step("编辑订单页里面的编辑入住人页面：选择证件类型")
    def select_id_type(self, value):
        self.click_element(
            self.wait_element_visible((By.XPATH, self.id_type_ele.format(value)), "选择证件：{}".format(value)))

    @allure.step("编辑订单页里面的编辑入住人页面：编辑护照信息")
    def certificate_to_passport(self, choose, value):
        if choose == "护照姓":
            self.input_keys(self.wait_precence_element(self.passport_name_one, "护照姓输入栏"), value)
        elif choose == "护照名":
            self.input_keys(self.wait_precence_element(self.passport_name_two, "护照名输入栏"), value)
        elif choose == "护照证件号码":
            self.input_keys(self.wait_precence_element(self.id_number_input_loc, "证件号码输入栏"), value)

    @allure.step("编辑订单页里面的编辑入住人页面：选择证件有效期截止日期")
    def choose_validity_certificate(self):
        self.click_element(self.wait_precence_element(self.certificate_Validity_loc, "证件有效期截止日期选择栏"))

    @allure.step("编辑订单页里面的编辑入住人页面：确认选择证件截止日期")
    def confirm_the_choice(self):
        self.click_element(self.wait_element_clickable(self.date_Validity_loc, "证件有效期截止日期确认选择"))

    @allure.step("编辑入住人页面：滑动选择证件有效期的日期")
    def touch_day(self):
        # 日元素
        start_day = self.wait_precence_element(self.day_choose_loc, "证件有效期选择栏的当天")
        # 年元素
        start_year = self.wait_precence_element(self.year_choose_loc, "证件有效期选择栏的当年")
        # 上滑选择年
        self.control_sliding(methods=1, ele_located=start_year, xoffset=0, yoffset=-100, speed=600,
                             step_desc="证件有效期的年")
        # 上滑选择日
        # self.control_sliding(methods=1, ele_located=start_day, xoffset=0, yoffset=-90, speed=500,
        #                      step_desc="证件有效期的日")
        self.control_sliding(methods=2, ele_located=start_day, xoffset=0, yoffset=100,
                             step_desc="证件有效期的日")
        time.sleep(3)

    # -----------------------------新增入住人页面----------------------------
    @allure.step("新增入住人页面：点击‘姓名填写规范文本按钮’")
    def click_name_rule(self):
        self.click_element(self.wait_precence_element(self.name_rule_loc, "姓名填写规范文本按钮"))

    @allure.step("新增入住人页面：点击伴正事通讯录按钮")
    def click_bzs_address_book(self):
        self.click_element(self.wait_precence_element(self.bzs_address_book_but, "伴正事通讯录按钮"))

    @allure.step("伴正事通讯录的选择联系人页面：搜索栏")
    def search_app_people(self, value):
        self.input_keys(self.wait_precence_element(self.app_search_bar_loc, "App通讯录"), value)

    @allure.step("伴正事通讯录的选择联系人页面：点击搜索确认按钮")
    def click_app_confirm(self):
        self.click_element(self.wait_precence_element(self.app_confirm_but_loc, "App通讯录选择确认按钮"))

    @allure.step("伴正事通讯录的选择联系人页面：勾选搜索得到的唯一联系人")
    def choose_app_address_book_people(self):
        self.click_element(self.wait_element_visible(self.search_only_people_loc, "勾选搜索得到的唯一联系人"))

    @allure.step("新增入住人页面：手动输入入住人姓名")
    def input_name(self, value):
        self.input_keys(self.wait_precence_element(self.name_input_loc, "姓名输入栏"), value)

    @allure.step("新增入住人页面：选择性别")
    def choose_sex(self, value):
        loc = (By.XPATH, self.choose_sex_loc.format(value))
        self.click_element(self.wait_precence_element(loc, "选择性别"))

    @allure.step("新增入住人页面：选择出生日期")
    def choose_birth_data(self):
        self.click_element(self.wait_precence_element(self.birth_data_loc, "出生日期选择栏"))

    @allure.step("新增入住人页面：点击国家地区选择栏")
    def celect_columns_countries_regions(self):
        self.click_element(self.wait_precence_element(self.countries_regions_loc, "国家地区选择栏"))

    @allure.step("新增入住人页面：设置国家地区：选择中国地区")
    def choose_china_regions(self):
        self.click_element(self.wait_precence_element(self.china_regions_loc, "中国地区选择栏"))

    @allure.step("新增入住人页面：点击证件示例图片按钮")
    def click_certificate_sample(self):
        self.click_element(self.wait_precence_element(self.certificate_sample_loc, "证件示例图片按钮"))

    @allure.step("新增入住人页面，证件有效期选择栏点击")
    def choose_time_limit(self):
        self.click_element(self.wait_precence_element(self.time_limit_loc, "证件有效期选择栏"))

    @allure.step("新增入住人页面，证件有效期滑动选择")
    def touch_limit_day(self):
        # 日元素
        start_day = self.wait_precence_element(self.day_limit_loc, "证件有效期选择栏的当天")
        # 年元素
        start_year = self.wait_precence_element(self.year_limit_loc, "证件有效期选择栏的当年")
        # 上滑选择年
        self.control_sliding(methods=2, ele_located=start_year, xoffset=0, yoffset=100,
                             step_desc="证件有效期的年")
        # 上滑选择日
        self.control_sliding(methods=1, ele_located=start_day, xoffset=0, yoffset=-80, speed=80,
                             step_desc="证件有效期的日")
        time.sleep(2)

    @allure.step("新增入住人页面，证件有效期的确定选择")
    def limit_confirm(self):
        self.click_element(self.wait_precence_element(self.limit_confirm_loc, "证件有效期的确定按钮"))

    @allure.step("新增入住人页面：点击保存按钮")
    def click_add_prople_save_button(self):
        self.click_element(self.wait_precence_element(self.save_button_loc, "'保存'按钮"))

    @allure.step("新增入住人页面：查找入住人列表")
    def people_is_exist(self, value):
        locator = (By.XPATH, "//*[contains(text(), '{}')]".format(value))
        return self.is_element_exist(locator, "入住人{}，列表".format(value))

    # ---------------------------------------------------发票相关-----------------------------------------------------------
    @allure.step("编辑订单页面:勾选报销凭证")
    def click_invoice_switch(self):
        self.click_element(self.wait_element_visible(self.invoice_switch_loc, "勾选报销凭证"))

    @allure.step("编辑订单页面：判断报销凭证是否开启状态")
    def get_attribute(self):
        return self.wait_element_visible(self.invoice_switch_loc, "勾选报销凭证").get_attribute("aria-checked")
