import time
import requests
import jsonpath
from common.handle_data import TestData
from common.do_vcode import DoVcode
import base64
# 获取验证码
def get_vcode(environment):
    if environment == "SIT":
        topUrl = "bplussit.sinosun.com:18380/mallbbcg2"
    elif environment == "UAT":
        topUrl = "bplus-uat.sinosun.com/mallbbcg2"
    elif environment == "UATBANK":
        topUrl = "bplus-uat.sinosun.com/mallbbcg2bank"
    elif environment == "PRODUCT":
        topUrl = "cloud.sinosun.com/mallbbcg2"
    elif environment == "PRODUCTBANK":
        topUrl = "cloud.sinosun.com:9443/mallbbcg2bank"
    # url = "https://{}/v3/system/common/getCaptcha".format(topUrl)
    # token = conf.get_str("env", "token")
    # res = requests.session().get(f"{conf.get_str('env','token')}/v3/system/common/getCaptcha")
    url = "https://{}/v3/system/common/getCaptcha".format(topUrl)
    res = requests.session().get(url)
    code_text, code_key = DoVcode.get_vcode(res)
    return code_text, code_key
# timenow = time.strftime("%Y-%m-%d")
# setattr(TestData, "timenow", timenow)
# 获取admin token
def adminToken(environment):
    if environment == "SIT":
        topUrl = "bplussit.sinosun.com:18380/mallbbcg2"
    elif environment == "UAT":
        topUrl = "bplus-uat.sinosun.com/mallbbcg2"
    elif environment == "UATBANK":
        topUrl = "bplus-uat.sinosun.com/mallbbcg2bank"
    elif environment == "PRODUCT":
        topUrl = "cloud.sinosun.com/mallbbcg2"
    elif environment == "PRODUCTBANK":
        topUrl = "cloud.sinosun.com:9443/mallbbcg2bank"
    url = "https://{}/v3/system/oauth/token".format(topUrl)
    # adminUrl = https: // bplus - uat.sinosun.com / mallbbcg2 / v3 / system / oauth / token
    # payload = 'grant_type=password&username=duli&client_id=MALLVOP_operation_front&password=Hengheng0225%2e'
    auth = str(base64.b64encode(f"{'admin'}:{'admin'}".encode("utf-8")), "utf-8")
    print("auth",auth)
    headers = {
    "Authorization": f"Basic {auth}",
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    verify = get_vcode(environment)
    verifyCode = verify[0]
    verifyKey = verify[1]
    if environment == "PRODUCTBANK":
        data = {
            "username": "bk_dulisa",
            "password": "sinosun",
            "verifyCode": verifyCode,
            "verifyKey": verifyKey
        }
    elif environment == "PRODUCT":
        data = {
            "username": "dulisa",
            "password": "111111",
            "verifyCode": verifyCode,
            "verifyKey": verifyKey
        }
    else:
        data = {
            "username": "admin",
            "password": "111111",
            "verifyCode": verifyCode,
            "verifyKey": verifyKey
        }

    response = requests.request("POST", url, headers=headers, data=data).json()
    print(response)
    if response['msg'] == "成功":
        access_token = jsonpath.jsonpath(response, "$..access_token")[0]
        token = "Bearer" + " " + access_token
        setattr(TestData, "adminToken", token)
        print("设置admintoken",getattr(TestData, "adminToken"))
    else:
        adminToken(environment)
if __name__ == '__main__':
    adminToken("PRODUCT")