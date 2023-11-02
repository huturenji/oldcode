# -*- coding: utf-8 -*-
# @time     : 2021/8/25 11:27
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : conftest.py
import time

import allure
import pytest
import requests
import jsonpath
from common.read_yaml import ReadYaml
from pytest_assume.plugin import assume

from common.mylogger import my_log
from pages.com_cloud_page import CommercialCloud
from pages.mall_pages.mall_home_page import MallHomePage
from pages.mall_pages.product_list_page import ProductListPage
from pages.nav_page import NavPage


@pytest.fixture(scope="class", autouse=True)
def start_the_mall(driver):
    # 初始化伴正事T信首页
    nav_page = NavPage(driver)
    # 伴正事导航拦进入商云首页
    nav_page.click_nav("商云")
    # 切换至商云首页webview：
    nav_page.switch_webview('webview')


@pytest.fixture()
def goods_search(request, driver):
    """搜索商品，并点击商品进入‘详情展示’页面"""
    # 初始化商城首页
    mall_home_page = MallHomePage(driver)
    # 初始化商品列表页
    product_list_page = ProductListPage(driver)
    my_log.info("================================< 测试用例开始 >================================")
    # 接受传入的数据
    test_info = request.param
    with allure.step("=========< 测试用例开始 >========="):
        # 点击搜索栏
        mall_home_page.click_search_bar()
    # 搜索栏输入内容
    mall_home_page.send_search_keys(test_info["goods_name"])
    # 点击搜索栏的“搜索”按钮
    mall_home_page.click_search_but()
    # 搜索的商品列表页点击商品
    product_list_page.choose_product(test_info["goods_list_choose"])


# ======================================================用例后置======================================================


# ======================================================接口请求部分======================================================


class BbcToken:

    def bbc_token(self):
        """
        用于生成BBC商城的token。
        # 获取B+的token入参username方法: authorization.decodeToken(authorization.getToken())
        :return:
        """
        # 读取yaml的api数据
        read_yaml = ReadYaml('caps.yaml').read_yaml()["sit_api"]
        # ---------------------获取B+的token---------------------
        url = read_yaml["url_token"]
        # 请求头
        headers = {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"}
        data = {
            "grant_type": "password",
            "client_id": "TRAVEL_H5",
            "username": "4462471022657@bizmatesit",
            "password": "123456",
            "scope": "openid"
        }
        response = requests.post(url=url, data=data, headers=headers)
        result = response.json()
        access_token = jsonpath.jsonpath(result, "$..access_token")[0]
        # ------------------------ 二次转换BBC商城的token ------------------------
        bbc_url = read_yaml["bbc_token_url"]
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        data = {
            "bPlusAccessToken": access_token,
            "memberRegisterChannel": 2,
            "channelId": read_yaml["channelId"],
            "companyId": read_yaml["companyId"],
            "userId": read_yaml["userId"]
        }
        response = requests.post(url=bbc_url, data=data, headers=headers)
        result = response.json()
        access_token = jsonpath.jsonpath(result, "$..access_token")[0]
        token = "Bearer" + " " + access_token
        return token


@pytest.fixture()
def cart_page_add_goods(request):
    """
    通过接口添加商品至购物车
    """
    # 获取BBC商城的token
    token = BbcToken().bbc_token()
    # 读取yaml的api数据
    read_yaml = ReadYaml('caps.yaml').read_yaml()["sit_api"]
    with allure.step("传入测试数据，并通过接口添加商品至购物车"):
        # 接受传入的数据
        test_info = request.param
    # -----------------------------通过搜索接口搜索商品，获取商品默认规格的productId---------------------------
    # 搜索商品列表的接口地址
    goods_list_url = r"https://bplussit.sinosun.com:18380/mallbbc/v3/goods/front/goods/goodsList"
    # 请求头
    headers = {"Content-Type": "application/x-www-form-urlencoded", "Authorization": token}
    # 入参
    data = {
        "pageSize": 10,
        "current": 1,
        "sort": 0,
        "store": 1,
        "areaId1": 19,
        "areaId2": 1666,
        "areaId3": 1669,
        "areaId4": 52098,
        "keyword": "笔",
        "channelId": read_yaml["channelId"],
        "companyId": read_yaml["companyId"],
        "userId": read_yaml["userId"]
    }
    response = requests.get(url=goods_list_url, params=data, headers=headers)
    result = response.json()
    # 获取商品默认规格的defaultProductId, 返回的结果是列表
    product_id_list = jsonpath.jsonpath(result, "$..defaultProductId")
    # print(product_id_list)
    # -------------------------------将上面搜索到的商品加入至购物车---------------------------------
    num = 0
    for i in range(test_info["number"]):
        product_id = product_id_list[num]
        num += 1
        # 请求接口添加商品至购物车
        add_cart_url = "https://bplussit.sinosun.com:18380/mallbbc/v3/business/front/cart/add"
        headers = {"Content-Type": "application/x-www-form-urlencoded", "Authorization": token}
        data = {
            "productId": product_id,
            "number": 1,
            "addressId": 222864661893120,
            "channelId": read_yaml["channelId"],
            "companyId": read_yaml["companyId"],
            "userId": read_yaml["userId"]
        }
        response = requests.post(url=add_cart_url, data=data, headers=headers)
        result = response.json()
        print("商品加入购物车：", result)
