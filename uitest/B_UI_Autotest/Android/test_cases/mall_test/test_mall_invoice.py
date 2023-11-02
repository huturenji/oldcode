# -*- coding: utf-8 -*-
# @time     : 2022/1/12 17:06
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : test_mall_invoice.py

import time
import pytest
import allure
from pytest_assume.plugin import assume

from pages.com_cloud_page import CommercialCloud
from pages.mall_pages.order_details_page import OrderDetailsPage


# 导入下单流程方法
from test_cases.mall_test.process import (
    submit_order,
    pay,
    buy_goods_now,
    confirm_order,
    pay_and_check
)

# 导入测试数据
from data.mall_data.mall_data import (
    homepage_search_goods_keywords
)


@allure.epic("商云业务自动化测试")
@allure.suite("BBC商城测试套件")
@allure.feature("BBC商城模块")
class TestMallInvoiceSmoke:

    @pytest.mark.mall_invoice_smoke
    @allure.severity("blocker")
    @allure.testcase("点我查看禅道用例……")
    @allure.story("测试场景：搜索商品下单支付，然后开具电子发票")
    @allure.title("下单购买商品，开具店子发票的冒烟流程; test_mall_invoice_smoke")
    @pytest.mark.parametrize("goods_search", homepage_search_goods_keywords, indirect=True)
    def test_mall_invoice_smoke(self, driver, goods_search):
        # 初始化订单详情页
        order_details_page = OrderDetailsPage(driver)
        # 初始化商云首页
        com_cloud_page = CommercialCloud(driver)
        # --------------------------------------测试用例步骤--------------------------------------
        # 详情页下单
        buy_goods_now(driver)
        # 编辑发票信息后，在提交订单页面，点击‘提交订单’按钮
        submit_order(driver, invoice=True)
        # 使用'微信测试'支付，进入详情页面
        pay(driver)
        # 进入订单详情页后，断言发票相关信息
        # 获取发票类型
        invoice_type = order_details_page.get_invoice_type_text()
        print("发票类型：", invoice_type)
        with assume:
            assert invoice_type == "深圳兆日科技股份有限公司", "发票类型不对"
        # 断言收票人手机号
        invoice_phone_number = order_details_page.get_invoice_phone_number()
        print("收票人手机号：", invoice_phone_number)
        with assume:
            assert invoice_phone_number == "15088690000", "没有手机号信息，或者手机号不对"
        # 刷新页面等待订单可以手动确认收货，然后点击‘确认收货’
        confirm_order(driver)
        # 刷新页面
        time.sleep(3)
        order_details_page.refresh_page()
        print("活动页名称", driver.current_activity)
        print("包名", driver.current_package)
        # 点击‘查看发票’按钮
        order_details_page.click_check_invoice_btn()
        # 弹窗确定下载电子发票
        order_details_page.click_confirm_download_pdf()
        time.sleep(2)
        print("当前所在的上下文", driver.current_context)
        # 下载管理页面点击左上角的‘返回’按钮
        order_details_page.click_download_back_page_btn()
        print("当前所在的上下文", driver.current_context)
        # 再次点击‘查看发票’按钮
        order_details_page.click_check_invoice_btn()
        time.sleep(3)
        # 截图电子发票
        order_details_page.screen_shot("PDF")
        # 切换至伴正事App的订单详情页面
        driver.start_activity("com.sinosun.bizmate.ace", "com.sinosun.tbrowser.BrowserActivity")

