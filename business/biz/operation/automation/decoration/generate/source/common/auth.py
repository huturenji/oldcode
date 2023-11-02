# 通过用户名 密码登录admin平台，获取到token

import requests
from common.config import ReadConfig
from common.vcode import DoVcode
import base64


class Auth:
    def __init__(self, env='sit'):
        self.config_info = ReadConfig(env)
        self.retry = 0
        self.access_token = None

    # 通过用户名密码登录，用户名与密码由用户输入
    def login(self, username, password):
        self.retry = self.retry + 1
        auth = str(base64.b64encode(f"{'admin'}:{'admin'}".encode("utf-8")), "utf-8")
        headers = {
            "Authorization": f"Basic {auth}",
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
        verify_code, verify_key = self.get_vcode()
        token_url = self.config_info.get_auth_token_url()
        data = {
            "username": username,
            "password": password,
            "verifyCode": verify_code,
            "verifyKey": verify_key
        }
        response = requests.request('POST', token_url, headers=headers, data=data).json()
        if response['state'] == 200:
            return response['data']['access_token']
        # 获取token失败后，进行重试，最多重试5次
        elif self.retry < 5:
            print(f'授权失败，重试第{self.retry}次')
            self.login(username, password)
        else:
            print(f'授权失败，请确认输入的用户名{username}与密码{password}是否正确')
            return None

    # 获取图片验证码
    def get_vcode(self):
        # 获取图片验证码的图片
        response = requests.session().get(self.config_info.get_vcode_url())
        # 提前图片中的验证码
        verify_code, verify_key = DoVcode.get_vcode(response)
        return verify_code, verify_key

    # 通过密码获取token
    def get_token_password(self, username, password):
        access_token = self.access_token
        if access_token:
            return access_token
        else:
            return self.login(username, password)

    def get_default_username(self):
        return self.config_info.username

    def get_default_password(self):
        return self.config_info.password


if __name__ == '__main__':
    rs = Auth('sit')
    print(rs.login('admin', '111111'))
