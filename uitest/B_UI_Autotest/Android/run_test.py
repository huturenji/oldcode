# _*_coding: utf-8_*_
# @time    : 2021/5/21 12:35
# @Author  : 天狼星
# @Email   : 328546246@qq.com
# File     : run_test.py

import subprocess
import pytest

# pytest.main(
#     ["test_cases/hotel_test", "-s", r"--alluredir=allure_report/", "--clean-alluredir", "--reruns", "2", "--reruns-delay", "5"])

# pytest.main(
#     ["test_cases/flight_test", r"--alluredir=allure_report/", "--clean-alluredir", "--reruns", "2",
#      "--reruns-delay", "5"])

pytest.main(["-m", "hotel_quick_payment", r"--alluredir=allure_report/", "--clean-alluredir"])

# pytest.main(["test_cases/mall_test/test_mall_asmoke.py", "-s", r"--alluredir=allure_report/", "--clean-alluredir",  "--reruns", "2", "--reruns-delay", "5"])

# subprocess.check_output("allure serve allure_report", shell=True)
