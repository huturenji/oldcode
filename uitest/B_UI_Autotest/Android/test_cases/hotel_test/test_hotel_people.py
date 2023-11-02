# -*- coding: utf-8 -*-
# @time     : 2021/8/13 19:03
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : test_hotel_people.py
import os
import time

import pytest
import allure
from appium.webdriver import Remote
from pytest_assume.plugin import assume
from pages.hotel_pages.edit_order_page import EditOrderPage
from pages.hotel_pages.order_details_page import OrderDetailsPage
from pages.hotel_pages.payment_result_page import PaymentResultPage
from common.read_yaml import ReadYaml
from test_cases.hotel_test.conftest import DeletePassengter
from common.contants import IMG_DIR, FOLDER_DIR, REPORT_DIR
from common.image_checkout import ImageCheckout

# 导入测试数据
from data.hotel_data.hotel_data import (
    hotel_change_occupant_keywords,
    hotel_add_occupants_keywords,
    hotel_add_two_people_keywords,
    hotel_name_abnormal_scene_keywords
)

# 读取设备信息
device = ReadYaml("caps.yaml").read_yaml()["device"]


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestHotelOccupants:

    @pytest.mark.change_occupant
    @pytest.mark.hotel_smoke
    @allure.severity("critical")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：在线付酒店更改默认入住人下单测试")
    @allure.title("{test_info[title]}, test_hotel_occupants")
    @pytest.mark.parametrize("test_info", hotel_change_occupant_keywords)
    def test_hotel_occupants(self, test_info, details_page, driver):
        """在线付酒店更改默认入住人测试"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # -------------------测试步骤 -------------------
        # ------------------------入住人编辑---------------------------
        # 删除默认入住人
        edit_order_page.wait_data_load(False, 0.5)
        edit_order_page.clear_people(1)
        # 重新输入入住人
        edit_order_page.input_people(1, test_info["ooccupant_name"])
        # ------------------------------------------------------------
        # 点击“提交订单”按钮，跳转至订单详情页
        edit_order_page.click_submit_order_button_switch()
        # 点击“去支付”
        order_details_page.click_payment_button()
        # 点击微信支付测试
        order_details_page.wechat_pay()
        # 断言支付成功
        result = payment_result_page.pay_success_text()
        with assume:
            assert result == "付款成功！", "付款不成功，或者没有出现结果页面"
        # 点击“查看详情”按钮
        payment_result_page.click_check_order_button()
        # 断言订单状态
        order_details_page.wait_data_load(False, 0.5)
        order_status = order_details_page.pay_result_text()
        assert order_status == "已支付，待确认", "订单状态不是已支付"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestHotelAddOccupants:

    @pytest.mark.hotel_smoke
    @allure.severity("critical")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：在线付酒店添加入住人测试")
    @allure.title("{test_info[title]}, test_hotel_add_occupants")
    @pytest.mark.parametrize("test_info", hotel_add_occupants_keywords)
    def test_hotel_add_occupants(self, test_info, details_page, driver):
        """在线付酒店添加入住人下单测试"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # -------------------测试步骤 -------------------
        # ------------------------添加入住人---------------------------
        edit_order_page.wait_data_load(False, 1)
        # 点击房间数下拉按钮
        edit_order_page.click_number_rooms_search()
        # 选择几间房
        edit_order_page.search_room_number(test_info["room_number"])
        # 点击通讯录按钮
        edit_order_page.check_in_people_btn()
        # 选择一个入住人
        edit_order_page.select_people(test_info["occ_name"])
        # 点击确定按钮，确认选择的入住人
        edit_order_page.confirm_people_button()
        # ------------------------------------------------------------
        # 点击“提交订单”按钮，跳转至订单详情页
        edit_order_page.click_submit_order_button_switch()
        # 点击“去支付”
        order_details_page.click_payment_button()
        # 点击微信支付测试
        order_details_page.wechat_pay()
        # 断言支付成功
        result = payment_result_page.pay_success_text()
        with assume:
            assert result == "付款成功！", "付款不成功，或者没有出现结果页面"
        # 点击“查看详情”按钮
        payment_result_page.click_check_order_button()
        # 断言订单状态
        order_details_page.wait_data_load(False, 0.5)
        order_status = order_details_page.pay_result_text()
        assert order_status == "已支付，待确认", "订单状态不是已支付"


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestHotelTwoPeople:

    @pytest.mark.hotel_smoke
    @allure.severity("critical")
    @allure.issue("http://zentao.sino.sz/index.php?m=bug&f=view&bugID=60199")
    @allure.story("测试场景：在线付酒店添加护照入住人，手动输入入住人")
    @allure.title("{test_info[title]}, test_hotel_add_two_people")
    @pytest.mark.parametrize("test_info", hotel_add_two_people_keywords)
    def test_hotel_add_two_people(self, test_info, details_page, driver):
        """在线付酒店订单，添加护照入住人，然后手动输入入住人姓名，下单成功"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # 初始化酒店订单详情页面
        order_details_page = OrderDetailsPage(driver)
        # 初始化支付成功的结果页面
        payment_result_page = PaymentResultPage(driver)
        # -------------------测试步骤 -------------------
        # ------------------------添加入住人---------------------------
        edit_order_page.wait_data_load(False, 1)
        # 点击房间数下拉按钮
        edit_order_page.click_number_rooms_search()
        # 选择几间房
        edit_order_page.search_room_number(test_info["room_number"])
        # 点击通讯录按钮
        edit_order_page.check_in_people_btn()
        # 选择一个入住人
        edit_order_page.select_people(test_info["occ_name"])
        # 点击确定按钮，确认选择的入住人
        edit_order_page.confirm_people_button()
        # ------------手动输入入住人名称---------------
        # 重新输入入住人
        edit_order_page.input_people(test_info["input_field"], test_info["ooccupant_name"])
        # ------------------------------------------
        # 点击“提交订单”按钮，跳转至订单详情页
        edit_order_page.click_submit_order_button_switch()
        # 点击“去支付”
        order_details_page.click_payment_button()
        # 点击微信支付测试
        order_details_page.wechat_pay()
        # 断言支付成功
        result = payment_result_page.pay_success_text()
        with assume:
            assert result == "付款成功！", "付款不成功，或者没有出现结果页面"
        # 点击“查看详情”按钮
        payment_result_page.click_check_order_button()
        # 断言订单状态
        order_details_page.wait_data_load(False, 0.5)
        order_status = order_details_page.pay_result_text()
        assert order_status == "已支付，待确认", "订单状态不是已支付"


@pytest.mark.skipif(device["platformName"] == "iOS", reason="iOS环境不支持toast提示的验证")
@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestNameAbnormalScene:

    @pytest.mark.toast
    @allure.severity("trivial")
    @allure.testcase("http://zentao.sino.sz/index.php?m=testcase&f=view&caseID=145467&version=1")
    @allure.story("测试场景：酒店下单时，入住人姓名的合规性测试")
    @allure.title("{test_info[title]},test_name_abnormal_scene")
    @pytest.mark.parametrize("test_info", hotel_name_abnormal_scene_keywords)
    def test_name_abnormal_scene(self, test_info, details_page, driver):
        """酒店下单时，入住人姓名的合规性测试"""
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # --------------------------输入入住人---------------------------
        # 删除入住人
        time.sleep(3)
        edit_order_page.clear_people(1)
        # 重新输入入住人
        edit_order_page.input_people(1, test_info["name"])
        # 点击“提交订单”按钮，跳转至订单详情页
        edit_order_page.click_submit_order_button()
        # 获取toast提示
        toast_result = edit_order_page.get_webview_toast_words(test_info["expected"])
        # 断言toast
        with assume:
            assert toast_result is True


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestSwipeDeletePassenger:

    @pytest.mark.swipe_delete_passenger
    @pytest.mark.toast
    @allure.severity("critical")
    @allure.testcase("")
    @allure.story("测试场景：酒店编辑订单页，入住人相关测试用例")
    @allure.title("添加入住人页面，左滑删除入住人; test_swipe_delete_passenger")
    def test_swipe_delete_passenger(self, driver, details_page, update_passengers):
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # ------------------------测试用例--------------------
        # 点击通讯录按钮
        edit_order_page.check_in_people_btn()
        # 获取屏幕宽度
        width = edit_order_page.width()
        # 左滑需要操作的入住人列表
        edit_order_page.touch_passenger_lift(value="自动化删除", xoffset=-width * 0.4)
        # 点击“删除”按钮
        edit_order_page.click_delete_but(value="自动化删除")
        # 点击“取消”按钮
        edit_order_page.click_candel_delete()
        # 点击“删除”按钮
        edit_order_page.wait_data_load(False, 1)
        edit_order_page.click_delete_but(value="自动化删除")
        # 点击“确定”按钮
        edit_order_page.wait_data_load(False, 2)
        edit_order_page.click_confirm_delete()
        # 断言结果：删除成功后，会有toast提示
        # 获取toast提示语
        toast_data = edit_order_page.get_webview_toast_words("删除成功")
        with assume:
            assert toast_data is True
        # 通过接口清理不需要的入住人
        DeletePassengter().delete_passenger()


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestHotelDeletePassenger:

    @pytest.mark.delete_passenger
    @pytest.mark.toast
    @allure.severity("critical")
    @allure.testcase("")
    @allure.story("测试场景：酒店编辑订单页，入住人相关测试用例")
    @allure.title("进入编辑入住人页面，删除入住人; test_hotel_delete_passenger")
    def test_hotel_delete_passenger(self, driver, details_page, update_passengers):
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # ------------------------测试用例--------------------
        # 点击通讯录按钮
        edit_order_page.check_in_people_btn()
        # 添加入住人页面，选择需要删除的入住人，进入编辑页面
        edit_order_page.click_edit_passenger(value="自动化删除")
        # 点击删除按钮
        edit_order_page.click_edit_page_delete()
        # 点击“取消”按钮
        edit_order_page.click_candel_delete()
        # 点击删除按钮
        edit_order_page.wait_data_load(False, 1)
        edit_order_page.click_edit_page_delete()
        # 点击“确定”按钮
        edit_order_page.wait_data_load(False, 1)
        edit_order_page.click_confirm_delete()
        # 获取toast提示语
        toast_data = edit_order_page.get_webview_toast_words("删除成功")
        with assume:
            assert toast_data is True
        # 通过接口清理不需要的入住人
        DeletePassengter().delete_passenger()


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestHotelChangePassenger:

    @pytest.mark.change_passenger
    @pytest.mark.toast
    @allure.severity("critical")
    @allure.testcase("")
    @allure.story("测试场景：酒店编辑订单页，入住人相关测试用例")
    @allure.title("进入编辑入住人页面，修改入住人的身份证、手机号; test_hotel_change_passenger")
    def test_hotel_change_passenger(self, driver, details_page, update_passengers):
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # ------------------------测试用例--------------------
        # 点击通讯录按钮
        edit_order_page.check_in_people_btn()
        # 添加入住人页面，选择需要删除的入住人，进入编辑页面
        edit_order_page.click_edit_passenger(value="自动化删除")
        # 删除身份证号
        edit_order_page.clear_id_number()
        # 重新输入身份证号
        edit_order_page.input_id_number("420528199003070753")
        # 删除手机号
        edit_order_page.clear_phone_number()
        # 重新输入手机号
        edit_order_page.input_phone_number("13866667777")
        # 点击“保存”按钮
        edit_order_page.click_edit_page_save()
        # 断言结果
        toast_data = edit_order_page.get_webview_toast_words("编辑成功")
        with assume:
            assert toast_data is True
        # 通过接口清理不需要的入住人
        DeletePassengter().delete_passenger()


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestChangeCertificatetype:

    @pytest.mark.change_certificate_type
    @pytest.mark.toast
    @allure.severity("critical")
    @allure.testcase("")
    @allure.story("测试场景：酒店编辑订单页，入住人相关测试用例")
    @allure.title("进入编辑入住人页面，将入住人的身份证改成护照证件; test_change_certificate_type")
    def test_change_certificate_type(self, driver, details_page, update_passengers):
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # ------------------------测试用例--------------------
        # 点击通讯录按钮
        edit_order_page.check_in_people_btn()
        # 添加入住人页面，选择需要编辑的入住人，进入编辑页面
        edit_order_page.click_edit_passenger(value="自动化删除")
        # 点击证件类型栏
        edit_order_page.click_certificate_type()
        # 选择护照证件类型
        edit_order_page.wait_data_load(False, 0.5)
        edit_order_page.select_id_type("护照")
        # 输入护照姓
        edit_order_page.certificate_to_passport("护照姓", "wu")
        # 输入护照名
        edit_order_page.certificate_to_passport("护照名", "fu")
        # 输入证件号码
        edit_order_page.certificate_to_passport("护照证件号码", "6677889900")
        # 点击证件有效期截止日期
        edit_order_page.choose_validity_certificate()
        # 确认选择证件截止日期
        edit_order_page.wait_data_load(False, 0.5)
        # edit_order_page.touch_day()
        edit_order_page.confirm_the_choice()
        # 保存入住人修改
        edit_order_page.click_edit_page_save()
        # 断言结果
        toast_data = edit_order_page.get_webview_toast_words("编辑成功")
        with assume:
            assert toast_data is True
        # 通过接口清理不需要的入住人
        DeletePassengter().delete_passenger()


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestChoosePeopleToast:

    @pytest.mark.choosepeopletoast
    @pytest.mark.toast
    @allure.severity("minor")
    @allure.testcase("")
    @allure.story("测试场景：酒店编辑订单页，入住人相关测试用例")
    @allure.title("进入添加入住人页面，勾选超过房间数的入住人时有toast提示; test_choose_people_toast")
    def test_choose_people_toast(self, driver, details_page):
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # ------------------------测试用例--------------------
        # 添加一个房间，选择入住人时选两个
        edit_order_page.wait_data_load(False, 1)
        # 点击房间数下拉按钮
        edit_order_page.click_number_rooms_search()
        # 选择几间房
        edit_order_page.search_room_number(2)
        # 点击通讯录按钮
        edit_order_page.check_in_people_btn()
        # 选择一个入住人
        edit_order_page.select_people("赵身份证")
        # 再次选择一个入住人
        edit_order_page.select_people("航六零巴巴")
        # 选择第三个入住人3
        edit_order_page.select_people("赵其他")
        # 选择超过入住房间数的入住人时，toast提示断言
        # 获取toast提示
        test_result = edit_order_page.get_webview_toast_words("最多只能选择2位入住人")
        with assume:
            assert test_result is True


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestAddAddressBookPeople:

    @pytest.mark.addressbookaddpeople
    @pytest.mark.toast
    @allure.severity("minor")
    @allure.testcase("")
    @allure.story("测试场景：酒店新增入住人页，入住人相关测试用例")
    @allure.title("酒店添加入住人页面，从通讯录选择人员添加; test_add_address_book_people")
    def test_add_address_book_people(self, driver, details_page):
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # ---------------------------测试用例--------------------------
        # 点击通讯录按钮
        edit_order_page.wait_data_load(False, 1)
        edit_order_page.check_in_people_btn()
        # 添加入住人页面：点击“+新增入住人”按钮
        edit_order_page.click_add_people_button()
        # 新增入住人页面：点击伴正事通讯录按钮
        edit_order_page.wait_data_load(False, 1)
        edit_order_page.click_bzs_address_book()
        # 进入伴正事App原生环境
        edit_order_page.switch_webview()
        # 搜索框搜索联系人
        edit_order_page.search_app_people("宣宣")
        # 勾选搜索的联系人
        edit_order_page.wait_data_load(False, 0.5)
        edit_order_page.choose_app_address_book_people()
        # 搜索联系人确认
        edit_order_page.click_app_confirm()
        # 切换至webview环境
        edit_order_page.switch_webview("webview")
        # 点击国家地区选择栏
        edit_order_page.celect_columns_countries_regions()
        # 选择中国地区
        edit_order_page.choose_china_regions()
        # 输入证件号码
        edit_order_page.input_id_number("632323190605263728")
        # 确认保存
        edit_order_page.click_add_prople_save_button()
        # 断言获取的toast提示
        toast_result = edit_order_page.get_webview_toast_words("添加成功")
        with assume:
            assert toast_result is True
        # 添加的入住人
        edit_order_page.wait_data_load(False, 1)
        with assume:
            assert edit_order_page.people_is_exist('宣宣') is True
        # 通过接口清理不需要的入住人
        DeletePassengter().delete_passenger()


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestOtherTypesOccupants:

    @pytest.mark.other_types_occupants
    @pytest.mark.toast
    @allure.severity("minor")
    @allure.testcase("")
    @allure.story("测试场景：酒店新增入住人页，入住人相关测试用例")
    @allure.title("酒店新增入住人页面，新增‘其他’类型入住人; test_other_types_occupants")
    def test_other_types_occupants(self, driver, details_page):
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # ---------------------------测试用例--------------------------
        # 点击通讯录按钮
        edit_order_page.wait_data_load(False, 1)
        edit_order_page.check_in_people_btn()
        # 添加入住人页面：点击“+新增入住人”按钮
        edit_order_page.click_add_people_button()
        # 点击证件类型栏
        edit_order_page.click_certificate_type()
        # 选择证件类型
        edit_order_page.wait_data_load(False, 0.4)
        edit_order_page.select_id_type("其他")
        # 输入入住人姓名
        edit_order_page.input_name("搜狗")
        # 选择性别
        edit_order_page.choose_sex("女")
        # 选择出生日期
        edit_order_page.choose_birth_data()
        # 确认选择的出生日期
        edit_order_page.touch_day()
        edit_order_page.confirm_the_choice()
        # 点击国家地区选择栏
        edit_order_page.celect_columns_countries_regions()
        # 选择中国地区
        edit_order_page.choose_china_regions()
        # 输入证件号码
        edit_order_page.certificate_to_passport("护照证件号码", "6677889900")
        # 点击证件有效期截止日期
        edit_order_page.wait_data_load(False, 0.5)
        edit_order_page.choose_time_limit()
        edit_order_page.touch_limit_day()
        # 确认选择证件截止日期
        edit_order_page.limit_confirm()
        # 重新输入手机号
        edit_order_page.input_phone_number("13866667777")
        # 确认保存
        edit_order_page.click_add_prople_save_button()
        # 断言结果
        toast_data = edit_order_page.get_webview_toast_words("添加成功")
        with assume:
            assert toast_data is True
        # 通过接口清理不需要的入住人
        DeletePassengter().delete_passenger()


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestCertificateSample:

    @pytest.mark.certificate_sample
    @allure.severity("minor")
    @allure.testcase("")
    @allure.story("测试场景：酒店新增入住人页，入住人证件类型示例查验")
    @allure.title("酒店新增入住人页面，港澳通行证示例校验; test_certificate_sample")
    def test_certificate_sample(self, driver: Remote, details_page):
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # ---------------------------测试用例--------------------------
        # 点击通讯录按钮
        edit_order_page.wait_data_load(False, 1)
        edit_order_page.check_in_people_btn()
        # 添加入住人页面：点击“+新增入住人”按钮
        edit_order_page.click_add_people_button()
        # 点击证件类型栏
        edit_order_page.click_certificate_type()
        # 选择证件类型
        edit_order_page.wait_data_load(False, 0.4)
        edit_order_page.select_id_type("港澳通行证")
        # 点击证件示例按钮
        edit_order_page.click_certificate_sample()
        edit_order_page.switch_webview()
        # 截图并保存
        img_cases = os.path.join(IMG_DIR, 'Hong_Kong_and_Macao.png')
        driver.get_screenshot_as_file(img_cases)
        time.sleep(0.5)
        # 对比的标准图
        img_standard = os.path.join(FOLDER_DIR, 'Hong_Kong_and_Macao_Pass.png')
        # 用例截图对比
        result = ImageCheckout(img_standard, img_cases).compare_image()[0]
        # 断言图像相似度
        with assume:
            assert result == 1.0
        # 将对比图像的不同之处，在用例执行过程中截取的图片中标记出来
        img_path = ImageCheckout(img_standard, img_cases).mark_image("result_Hong_Kong_and_Macao")
        # 标记的图片上传至allure测试报告
        with allure.step("图像对比，并标记不同处的结果……"):
            allure.attach.file(img_path, "标记不同处的结果图片：", allure.attachment_type.PNG)
            allure.attach.file(img_standard, "正确图样：", allure.attachment_type.PNG)


@allure.epic("商云业务自动化测试")
@allure.suite("酒店测试套件")
@allure.feature("酒店模块")
class TestNameRuleCheck:

    @pytest.mark.name_rule_text_check
    @allure.severity("minor")
    @allure.testcase("")
    @allure.story("测试场景：酒店新增入住人页，入住人姓名填写规范字段查验")
    @allure.title("酒店新增入住人页面，姓名填写规范字段校验; test_name_rule_text_check")
    def test_name_rule_text_check(self, driver: Remote, details_page):
        # 初始化酒店编辑订单页面
        edit_order_page = EditOrderPage(driver)
        # ---------------------------测试用例--------------------------
        # 点击通讯录按钮
        edit_order_page.wait_data_load(False, 1)
        edit_order_page.check_in_people_btn()
        # 添加入住人页面：点击“+新增入住人”按钮
        edit_order_page.click_add_people_button()
        # 点击“姓名填写规范”规则按钮
        edit_order_page.click_name_rule()
        edit_order_page.switch_webview()
        # 截图并保存
        img_cases = os.path.join(IMG_DIR, 'name_rule_check.png')
        driver.get_screenshot_as_file(img_cases)
        time.sleep(0.5)
        # 对比的标准图
        img_standard = os.path.join(FOLDER_DIR, 'Name_Rule_Check_Pass.png')
        # 用例截图对比
        result = ImageCheckout(img_standard, img_cases).compare_image()[0]
        # 断言图像相似度
        with assume:
            assert result == 1.0
        # 将对比图像的不同之处，在用例执行过程中截取的图片中标记出来
        img_path = ImageCheckout(img_standard, img_cases).mark_image("result_name_rule_check")
        # 标记的图片、正确图片上传至allure测试报告
        with allure.step("图像对比，并标记不同处的结果……"):
            allure.attach.file(img_path, "标记不同处的结果图片：", allure.attachment_type.PNG)
            allure.attach.file(img_standard, "正确图样：", allure.attachment_type.PNG)
