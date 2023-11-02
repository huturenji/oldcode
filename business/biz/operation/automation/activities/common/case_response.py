#!/usr/bin/python
# -*- coding: utf-8 -*-
import time
import requests
from common.handle_data import TestData, replace_data
from common.handle_request import HandleRequest
from common.myconfig import conf


# 请求
def test_send(self, case,token, pri=True, sava_data=None):
    http = HandleRequest()
    if hasattr(TestData, "environment"):
        test_data = "_"+getattr(TestData, "environment")
        url = conf.get_str("env"+test_data, "url") + str(case["url"])
    else:
        url = conf.get_str("env", "url") + str(case["url"])

    method = case["method"]
    headers = eval(conf.get_str("env", "headers"))
    # 获取token,token变量名 从传参token获取
    headers["Authorization"] = getattr(TestData, token)
    row = int(case["case_id"]) + 1
    data = case["data"]
    data = eval(replace_data(data))
    print("Authorization：", headers["Authorization"])
    print("URL：", url)
    print("参数:", data)
    #  预期结果
    expected = eval(case["expected"])
    # 调用接口
    # 判断请求方式，传参
    method = method.lower()
    if method == "get":
        response = http.send(url=url, method=method, params=data, headers=headers)
    else:
        response = http.send(url=url, method=method, json=data, headers=headers)
    result = response.json()
    # print("预期结果：{}".format(expected))
    if pri==True:
        print('实际结果：StatusCode[{}]-[{}]'.format(response.status_code, result))
    else:
        my_log.info('用例：{}实际结果：StatusCode[{}]-[{}]'.format(case["title"],response.status_code, result))
    row = int(case["case_id"]) + 1
    # 运行存数据
    if sava_data != None:
        sava_data(case, result)
    try:
        # 断言异常
    
        if response.status_code == 200:
            self.assertEqual(expected["msg"], result["msg"])
            self.assertEqual(expected["state"], result["state"])
        elif response.status_code > 200:
            self.assertIn(expected["msg"], result)
        response.raise_for_status()

    except AssertionError as e:
        self.rd.write_data(row=row, column=8, value="失败-{}".format(time.strftime("%Y%m%d %H:%M")))
        my_log.info("用例：{}--->执行未通过".format(case["title"]))
        raise e
    # 非200异常
    except requests.exceptions.HTTPError as e:
        self.rd.write_data(row=row, column=8, value="失败-{}".format(time.strftime("%Y%m%d %H:%M")))
        my_log.info("用例：{}--->执行未通过".format(case["title"]))
        # print("预期结果：{}".format(expected))
        # print("实际结果：StatusCode[{}]-{}".format(response.status_code, result))
        raise e
    # 通过
    else:
        self.rd.write_data(row=row, column=8, value="通过-{}".format(time.strftime("%Y%m%d %H:%M")))
        my_log.info("用例：{}--->执行通过".format(case["title"]))
        return result
