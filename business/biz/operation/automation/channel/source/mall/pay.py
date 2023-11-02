import requests

from common.config import ReadConfig
from common.pay import BasePay


class Pay:
    def __init__(self, env):
        self.token = ''
        self.env = env
        self.headers = {}
        self.config_info = ReadConfig(env)
        self.base_pay = BasePay(env)
        self.production_env = self.config_info.production_env

    # 传入token
    def init(self, token):
        self.token = token
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            'Content-Type': 'application/json ;charset=UTF-8'
        }
        return self

    # 新增公款闪付
    def add_quick_pay(self, data):
        url = self.config_info.get_mall_boss_pay_url()
        params = {
            "signType": "SM2",
            "payType": data["payType"],
            "payTypeName": data["payTypeName"],
            "alias": "公款闪付",
            "apiUrl": data["pay_address"],
            "shopId": "sinosunmall",
            "thirdPublicKey": data["thirdPublicKey"],
            "account": "",
            "accountName": "",
            "recvbank": "",
            "recvbankName": "",
            "publicKey": self.get_public_key(),
            "privateKey": self.get_private_key(),
            "notifyUrl": "https://" + self.config_info.host + self.config_info.product_mall+"/v3/payment/notify"
                                                                                              "/bossPayNotify",
            "operationName": "admin",
            "icon": "https://bucket-sinosun-dev1.oss-cn-hangzhou.aliyuncs.com/jegzgPi4g9/images/admin/setting"
                    "/975a8a1f-a14e-41d2-93d1-f893d379ac24.png "
        }
        response = requests.post(url=url, json=params, headers=self.headers).json() # todo request 需要封装 判断请求state为非200的场景
        if response['state'] == 200:
            return 'success'
        else:
            print(f'新增公款闪付{data["payType"]}失败,请检查相关参数({response})')
            return f'新增公款闪付{data["payType"]}失败,请检查相关参数({response})'

    # 获取微信支付配置
    def get_wx_pay(self):
        return self.base_pay.get_wx_pay()

    # 获取支付宝配置
    def get_ali_pay(self):
        return self.base_pay.get_ali_pay()

    # 公款闪付 B+ 公钥
    def get_public_key(self):
        if self.env.upper() == self.production_env.upper():
            return 'F7AD306BEC62FF9D3350E49B4D874E5490484B0061786B81FC4FBB3CED29A228A2B178E0C82B91527DC22967D530ECAC761CC3197389615BA2ED605264A21E06'
        else:
            return 'A8862D8B4317B6C6FAF8BF7CFD52337C604F62CC0A66A4D9CD1E46EE8BD97CFB4ECD0953264C3230B2FBEBAE092B111C1D7A1E33DA48222D04C508211AF4112A'

    # 公款闪付 B+ 私钥
    def get_private_key(self):
        if self.env.upper() == self.production_env.upper():
            return 'DE156B8896687DC0FFADCC5D96AC9B90656997EA4A1A6CFE83F2F2DE97EE8681'
        else:
            return '9549AD02C00806F4A8AACB0FBB11AEFDD802B617BA38525D89D80D2C04BD7E0C'
