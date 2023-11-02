# _*_coding: utf-8_*_
# @time    : 2021/5/21 12:35
# @Author  : 天狼星
# @Email   : 328546246@qq.com
# File     : run_test.py

import subprocess
import pytest

# pytest.main(
#     ["-m", "hotel_smoke", "-s", r"--alluredir=allure_report/",
#      "--clean-alluredir", '--reruns', '2', '--reruns-delay', '5'])

# pytest.main(["test_cases/hotel_test/test_hotel_trip.py", "-s", r"--alluredir=allure_report/", '--reruns', '2', '--reruns-delay', '5'])

pytest.main(["-m", "certificate_refund_flight_order", "-s", r"--alluredir=allure_report/"])

# subprocess.check_output("allure serve allure_report", shell=True)
