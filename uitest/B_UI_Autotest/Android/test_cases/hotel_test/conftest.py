# -*- coding: utf-8 -*-
# @time     : 2021/8/25 11:27
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : conftest.py
import allure
import pytest
import datetime
import time

import requests
import jsonpath
from common.read_yaml import ReadYaml
from data.hotel_data.hotel_data import hotel_trip_data

from pytest_assume.plugin import assume
from pages.nav_page import NavPage
from pages.com_cloud_page import CommercialCloud
from pages.hotel_pages.hotel_home_page import HotelHomePage
from pages.hotel_pages.hotel_list_page import HotelListPage
from pages.hotel_pages.hotel_details_page import HotelDetailsPage
from pages.hotel_pages.edit_order_page import EditOrderPage
from pages.hotel_pages.order_details_page import OrderDetailsPage
from pages.hotel_pages.payment_result_page import PaymentResultPage

# 导入测试数据
from data.hotel_data.hotel_data import (
    hotel_fixture_keywords,
    hotel_to_pay_keywords,
    hotel_idcard_data,
)


@pytest.fixture(scope="class", autouse=True)
def start_the_hotel(driver):
    # 初始化伴正事T信首页
    nav_page = NavPage(driver)
    # 进入酒店首页
    nav_page.click_ticket_service("酒店")


# @pytest.fixture(scope="class", autouse=True)
def nv_start_the_hotel(driver):
    """从商云首页点击‘服务汇’进入机票应用"""
    # 初始化伴正事首页
    nav_page = NavPage(driver)
    # 初始化商云首页
    com_cloud_page = CommercialCloud(driver)
    # -------------------步骤-------------------
    # 伴正事首页，底部导航栏点击‘商云’
    nav_page.click_nav("商云")
    # 切换至商云首页webview
    com_cloud_page.switch_webview('webview')
    # print("当前所有的上下文环境", driver.contexts)
    # print("当前所在的上下文", driver.current_context)
    # print("商云首页所有的标签页", driver.window_handles)
    # print("商云首页页面所在页面的窗口句柄", driver.current_window_handle)
    # 进入商云首页（名商城），点击弹窗‘我知道了’
    # nav_page.click_know_but()
    # 点击服务汇
    com_cloud_page.choose_function()
    com_cloud_page.swipe_up()
    # 点击‘酒店’应用
    com_cloud_page.wait_data_load(False, 1)
    com_cloud_page.click_commercial("订酒店")
    yield
    # 用例后置：退出酒店小应用
    # 切换至App原生环境
    com_cloud_page.switch_webview()
    # 关闭小应用程序
    com_cloud_page.close_applet(step_desc="小程序关闭按钮")


@pytest.fixture(scope="class", params=hotel_fixture_keywords)
def details_page(driver, request):
    """酒店在线付至编辑订单页面"""
    # 初始化酒店首页
    hotel_home_page = HotelHomePage(driver)
    # 初始化酒店列表页
    hotel_list_page = HotelListPage(driver)
    # 初始化酒店详情页
    hotel_details_page = HotelDetailsPage(driver)
    # -------------------测试步骤 -------------------
    test_info = request.param
    # 选择入住、离店时间
    hotel_home_page.selection_day(test_info["check_in_date"], test_info["check_out_date"])
    # 选择城市
    hotel_home_page.wait_data_load(False, 0.3)
    hotel_home_page.select_city_entrance()
    hotel_home_page.select_city("武汉")
    # 输入酒店搜索关键字
    hotel_home_page.search_hotel_text(test_info["keywords"])
    # 点击查询按钮
    hotel_home_page.click_search_button()
    # 酒店列表页去除价格区间推荐
    hotel_list_page.wait_data_load(False, 1)
    hotel_list_page.click_price_star_search_btn()
    # 重置价格区间推荐
    hotel_list_page.wait_data_load(False, 1)
    hotel_list_page.click_reset_button()
    # 确认重置推荐
    hotel_list_page.click_complete_button()
    # 点击搜索按钮
    hotel_list_page.wait_data_load(False, 1)
    hotel_list_page.search_enter()
    hotel_list_page.wait_data_load(False, 1)
    # 酒店列表选择酒店
    hotel_list_page.click_hotel_list()
    # 酒店详情页选择房型
    hotel_details_page.click_room_type(test_info["room"])
    # 点击"在线付"按钮
    hotel_details_page.click_payment_methon_button(method=test_info["method"], room_name=test_info["room"])


@pytest.fixture(scope="class")
def hotel_details(request, driver):
    """酒店下单至编辑订单页面"""
    # 初始化酒店首页
    hotel_home_page = HotelHomePage(driver)
    # 初始化酒店列表页
    hotel_list_page = HotelListPage(driver)
    # 初始化酒店详情页
    hotel_details_page = HotelDetailsPage(driver)
    # -------------------测试步骤 -------------------
    test_info = request.param
    # 选择入住、离店时间
    hotel_home_page.selection_day(test_info["check_in_date"], test_info["check_out_date"])
    # 选择城市
    hotel_home_page.wait_data_load(False, 0.3)
    hotel_home_page.select_city_entrance()
    hotel_home_page.select_city("武汉")
    # 输入酒店搜索关键字
    hotel_home_page.search_hotel_text(test_info["keywords"])
    # 点击查询按钮
    hotel_home_page.click_search_button()
    # 酒店列表页去除价格区间推荐
    hotel_list_page.click_price_star_search_btn()
    # 重置价格区间推荐
    hotel_list_page.wait_data_load(False, 1)
    hotel_list_page.click_reset_button()
    # 确认重置推荐
    hotel_list_page.wait_data_load(False, 1)
    hotel_list_page.click_complete_button()
    # 点击搜索按钮
    hotel_list_page.wait_data_load(False, 1)
    hotel_list_page.search_enter()
    hotel_list_page.wait_data_load(False, 1)
    # 酒店列表选择酒店
    hotel_list_page.click_hotel_list()
    # 酒店详情页选择房型
    hotel_details_page.click_room_type(test_info["room"])
    # 点击"到店付"或者"在线付"按钮
    hotel_details_page.click_payment_methon_button(method=test_info["method"], room_name=test_info["room"])


class DelectHotelTrip:
    # 读取yaml的api数据
    read_yaml = ReadYaml('caps.yaml').read_yaml()["sit_api"]
    # 公共数据
    channelId = read_yaml["channelId"]
    companyId = read_yaml["companyId"]
    uaId = read_yaml["uaId"]
    userId = read_yaml["userId"]
    # token获取地址
    url_token = read_yaml["url_token"]
    # 查询行程列表的地址
    url_trip = read_yaml["url_sit"] + "travel/trip/v1/getTripList"

    def token_data(self):
        """生成token"""
        url = self.url_token
        headers = {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"}
        data = {
            "grant_type": "password",
            "client_id": "MEDIA_operation_front",
            "username": "duli",
            "password": "Hengheng0225,",
            "scope": "openid"
        }
        response = requests.post(url=url, data=data, headers=headers)
        result = response.json()
        access_token = jsonpath.jsonpath(result, "$..access_token")[0]
        token = "Bearer" + " " + access_token
        return token

    def get_hotel_tripno(self, keywords):
        # 获取token
        token = self.token_data()
        url = self.url_trip
        headers = {"Content-Type": "application/json; charset=UTF-8", "Authorization": token}
        data = {
            "userId": self.userId,
            "companyId": self.companyId,
            "channelId": self.channelId,
            "uaId": self.uaId,
            "pageIndex": 1,
            "pageSize": 100,
            "orderType": [0],
            "queryType": 1
        }
        response = requests.post(url=url, json=data, headers=headers)
        result = response.json()
        res = result["result"]["tripList"]
        trip_list = []
        for i in res:
            lis = jsonpath.jsonpath(i, "$..travelMessage")
            if lis is False:
                continue
            elif lis[0] == keywords:
                trip_list.append(i["tripNo"])
        return len(trip_list)


class HotelOrder:
    """通过接口酒店下单"""
    # 读取yaml的api数据
    read_yaml = ReadYaml('caps.yaml').read_yaml()["sit_api"]
    # 公共数据
    com_data = {
        "channelId": read_yaml["channelId"],
        "companyId": read_yaml["companyId"],
        "userId": read_yaml["userId"]
    }
    # 用户信息
    user_data = {
        "idCardNo": "110101199003075437",
        "name": "航航自动化",
        "passengerId": "214708477272064",
        "thirdUserId": "4462471022657@bizmatesit",
        "userId": "7b6d0861-f2db-42ba-be0c-e3450aa8a456",
    }

    def token_data(self):
        """生成token"""
        # token获取地址
        url_token = self.read_yaml["url_token"]
        headers = {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"}
        data = {
            "grant_type": "password",
            "client_id": "MEDIA_operation_front",
            "username": "duli",
            "password": "Hengheng0225,",
            "scope": "openid"
        }
        response = requests.post(url=url_token, data=data, headers=headers)
        result = response.json()
        access_token = jsonpath.jsonpath(result, "$..access_token")[0]
        token = "Bearer" + " " + access_token
        return token

    def search_hotel_list(self):
        """查询酒店列表，获取酒店的id"""
        # 入住、离店时间
        date = self.time_date()
        # 查询酒店列表的地址
        url = self.read_yaml["url_sit"] + "travel/hotel/v1/searchHotelList"
        # 获取token
        token = self.token_data()
        # 请求头
        headers = {"Content-Type": "application/json; charset=UTF-8", "Authorization": token}
        data = {
            "cityName": "武汉",
            "clat": "30.468970918597392",
            "clng": "114.43047566993542",
            "hourRoom": False,
            "inDate": date[0],
            "keywords": "武汉碧朗·家酒店",
            "outDate": date[1],
            "pageIndex": 1,
            "pageSize": 20,
            "useType": "PRIVATE",
        }
        data.update(self.com_data)
        responses = requests.post(url=url, json=data, headers=headers)
        result = responses.json()
        # 获取酒店的hotelId
        hotel_id = jsonpath.jsonpath(result["result"]["dataHotel"], "$..hotelId")[0]
        return hotel_id

    def get_hotel_detail(self):
        """查询酒店详情，获取酒店的房型、价格等"""
        # 入住、离店时间
        date = self.time_date()
        # 查询酒店列表的地址
        url = self.read_yaml["url_sit"] + "travel/hotel/v1/getHotelDetail"
        # 获取token
        token = self.token_data()
        # 请求头
        headers = {"Content-Type": "application/json; charset=UTF-8", "Authorization": token}
        data = {
            "hid": HotelOrder().search_hotel_list(),
            "inDate": date[0],
            "outDate": date[1],
            "providerType": "5",
            "useType": "PRIVATE",
        }
        data.update(self.com_data)
        responses = requests.post(url=url, json=data, headers=headers)
        result = responses.json()
        provider_type = jsonpath.jsonpath(result, "$..providerType")[0]
        # 第一个房型
        rooms = result["result"]["hotelRooms"][0]["rooms"][0]
        product_id = jsonpath.jsonpath(rooms, "$..productId")[0]
        roomtypeid = jsonpath.jsonpath(rooms, "$..roomTypeId")[0]
        price = jsonpath.jsonpath(rooms, "$..perDayPrice")[0]
        room_data = {
            "paymentType": "1",
            "productId": product_id,
            "providerType": provider_type,
            "roomId": "0001",
            "roomTypeId": roomtypeid,
            "roomsCount": 1,
            "settlePrice": price,
            "specialPermissionInfos": [],
            "totalPrice": price,
        }
        return room_data

    def create_hotel_order(self):
        """酒店下单"""
        # 酒店价格
        price = self.get_hotel_detail()["settlePrice"]
        # 获取酒店房型数据
        room_data = self.get_hotel_detail()
        # 入住、离店时间
        date = self.time_date()
        # 酒店下单地址
        url = self.read_yaml["url_sit"] + "travel/hotel/v1/createOrder"
        # 获取token
        token = self.token_data()
        # 请求头
        headers = {"Content-Type": "application/json; charset=UTF-8", "Authorization": token}
        data = {
            "channelName": "伴正事keycloak",
            "city": "武汉",
            "companyName": "梦工场",
            "contactMobile": "13260631733",
            "contactName": "航航自动化",
            "fareAmount": price,
            "founderInfo": {
                "founderCpyId": "d27c3129-a754-4278-90a6-92021a535b63",
                "founderUaId": "7b6d0861-f2db-42ba-be0c-e3450aa8a456",
            },
            "guarantee": False,
            "hid": HotelOrder().search_hotel_list(),
            "inDate": date[0],
            "invoiceFlag": "0",
            "latestTime": "06:00",
            "orderAmount": room_data["settlePrice"],
            "outDate": date[1],
            "passengers": [self.user_data],
            "useType": "PRIVATE",
            "userName": "航航自动化",
        }
        data.update(HotelOrder().get_hotel_detail())
        data.update(self.com_data)
        responses = requests.post(url=url, json=data, headers=headers)
        result = responses.json()
        order_no = jsonpath.jsonpath(result, "$..orderNo")[0]
        return order_no

    def payment_order(self):
        """使用微信支付测试，支付订单"""
        # 订单号
        order_no = HotelOrder().create_hotel_order()
        # 酒店价格
        price = self.get_hotel_detail()["settlePrice"]
        # 时间搓
        t = int(round(time.time() * 1000))
        # 微信支付测试接口
        url = self.read_yaml["url_sit"] + "travel/payment/v1/makePayment"
        # 获取token
        token = self.token_data()
        # 请求头
        headers = {"Content-Type": "application/json; charset=UTF-8", "Authorization": token}
        data = {
            "goodsDesc": "武汉碧朗·家酒店",
            "ipAddress": "10.2.30.152",
            "macAddress": "d4:61:fe:f7:31:72",
            "orderNoList": [order_no],
            "payMethod": "H5_PAY",
            "payType": "WX_PAY_TEST",
            "t": t,
            "totalAmount": price,
            "tradeType": "3",
        }
        data.update(self.com_data)
        responses = requests.post(url=url, json=data, headers=headers)
        result = responses.json()
        return result

    @staticmethod
    def time_date():
        """将时间向后偏移30、31天"""
        time_now = datetime.datetime.now()
        # 入住时间
        indate = (time_now + datetime.timedelta(days=30)).strftime("%Y/%m/%d")
        # 离店时间
        outdate = (time_now + datetime.timedelta(days=31)).strftime("%Y/%m/%d")
        date = [indate, outdate]
        return date


@pytest.fixture()
@allure.step("前置条件：新增自动化操作需要的酒店入住人")
def update_passengers():
    """新增酒店入住人:名字为自动化删除"""
    # 读取yaml的api数据
    read_yaml = ReadYaml('caps.yaml').read_yaml()["sit_api"]
    # 公共数据
    com_data = {
        "channelId": read_yaml["channelId"],
        "companyId": read_yaml["companyId"],
        "userId": read_yaml["userId"]
    }
    # 获取token
    token = HotelOrder().token_data()
    # 新增乘客的url
    url = read_yaml["url_sit"] + "travel/common-passenger/v1/updatePassengers"
    # 请求头
    headers = {"Content-Type": "application/json; charset=UTF-8", "Authorization": token}
    # 入参
    data = {
        "people": [{
            "abbreviation": "CN",
            "birthday": "1979/11/11",
            "gender": 1,
            "idCode": 0,
            "idNum": "110101197911118034",
            "idType": "身份证",
            "identityCardVerifyComplete": False,
            "mobileVerifyComplete": False,
            "name": "自动化删除",
            "nationality": "中国CHINA",
            "passengerId": "",
            "phone": "13925803698",
            "userType": 2
        }]
    }
    # 入参增加渠道id、用户id、企业id
    data.update(com_data)
    responses = requests.post(url=url, json=data, headers=headers)
    result = responses.json()
    print(result)


class DeletePassengter:
    """
    删除自动化测试时，多余的常用入住人
    """
    # 读取yaml的api数据
    read_yaml = ReadYaml('caps.yaml').read_yaml()["sit_api"]
    # 公共数据
    com_data = {
        "channelId": read_yaml["channelId"],
        "companyId": read_yaml["companyId"],
        "userId": read_yaml["userId"]
    }
    # token获取地址
    url_token = "https://bplussit.sinosun.com:18680/auth/realms/bplussit/protocol/openid-connect/token"
    # 查询常用乘客列表的地址
    url_query = "https://bplussit.sinosun.com:18380/travel/common-passenger/v1/queryPassenger"
    # 删除常用乘客的地址：
    url_dele = "https://bplussit.sinosun.com:18380/travel/common-passenger/v1/deletePassengers"

    def query_passenger(self):
        # 获取token
        token = HotelOrder().token_data()
        url = self.url_query
        headers = {"Content-Type": "application/json; charset=UTF-8", "Authorization": token}
        data = {}
        data.update(self.com_data)
        responses = requests.post(url=url, json=data, headers=headers)
        result = responses.json()
        passenger_lis = jsonpath.jsonpath(result, "$..passengerId")
        # 需要排除的乘客id
        data_lis = ['214708477272064', '224933548662784', '214759672946688', '214759366762496', '214760977375232',
                    '214760813797376', '214760411144192', '214760142708736']
        # 筛选出可以删除的乘客
        delete_lis = []
        for i in passenger_lis:
            for j in data_lis:
                if i == j:
                    break
            else:
                delete_lis.append(i)
        return delete_lis

    @allure.step("清理不需要的酒店入住人")
    def delete_passenger(self):
        # 获取token
        token = HotelOrder().token_data()
        # 获取需要删除的乘客的id列表
        del_lis = DeletePassengter().query_passenger()
        # 删除的url
        url = self.url_dele
        headers = {"Content-Type": "application/json; charset=UTF-8", "Authorization": token}
        data = {}
        data.update(self.com_data)
        data["idList"] = del_lis
        responses = requests.post(url=url, json=data, headers=headers)
        return responses.json()


if __name__ == '__main__':
    # 增加常用入住人，姓名为：自动化删除
    # AddPassengers().update_passengers()
    # 删除多余的常用入住人
    result = DeletePassengter().delete_passenger()
    print(result)
