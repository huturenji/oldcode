import time
import requests
from common.myconfig import conf
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
    url = "https://{}/v3/system/common/getCaptcha".format(topUrl)
    res = requests.session().get(url)
    # res = requests.session().get(f"{conf.get_str('env','token')}/v3/system/common/getCaptcha")
    code_text, code_key = DoVcode.get_vcode(res)
    return code_text, code_key
# timenow = time.strftime("%Y-%m-%d")
# setattr(TestData, "timenow", timenow)
# 获取seller端token
def sellerToken(environment):
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
    url = "https://{}/v3/seller/oauth/token".format(topUrl)
    # url = conf.get_str("env", "token")+"/v3/seller/oauth/token"
    # payload = 'grant_type=password&username=duli&client_id=MALLVOP_operation_front&password=Hengheng0225%2e'
    auth = str(base64.b64encode(f"{'seller'}:{'seller'}".encode("utf-8")), "utf-8")
    print("auth",auth)
    headers = {
    "Authorization": f"Basic {auth}",
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    verify = get_vcode(environment)
    verifyCode = verify[0]
    verifyKey = verify[1]
    if environment == "UAT":
        data = {
            "username": "sinosunjdvop",
            "password": "sinosun",
            "verifyCode": verifyCode,
            "verifyKey": verifyKey,
            'client': 'pc'
        }
    if environment == "UATBANK":
        data = {
            "username": "sinosunjdvop",
            "password": "sinosun",
            "verifyCode": verifyCode,
            "verifyKey": verifyKey,
            'client': 'pc'
        }
    elif environment == "SIT":
        data = {
            "username": "sinosunjdvop",
            "password": "123456",
            "verifyCode": verifyCode,
            "verifyKey": verifyKey,
            'client': 'pc'
        }
    response = requests.request("POST", url, headers=headers, data=data).json()
    print("response",response)
    if response['msg'] == "成功":
        access_token = jsonpath.jsonpath(response, "$..access_token")[0]
        token = "Bearer" + " " + access_token
        setattr(TestData, "sellerToken", token)
        print("设置sellertoken", getattr(TestData, "sellerToken"))
    else:
        sellerToken(environment)


if __name__ == '__main__':
    sellerToken("UATBANK")