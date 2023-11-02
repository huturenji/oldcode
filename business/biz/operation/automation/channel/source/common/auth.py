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
    def login(self, username, password, token_url):
        self.retry = self.retry + 1
        auth = str(base64.b64encode(f"{'admin'}:{'admin'}".encode("utf-8")), "utf-8")
        headers = {
            "Authorization": f"Basic {auth}",
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
        verify_code, verify_key = self.get_vcode()
        if verify_code is None:
            return None
        data = {
            "username": username,
            "password": password,
            "verifyCode": verify_code,
            "verifyKey": verify_key
        }
        response = requests.request('POST', token_url, headers=headers, data=data).json()
        if response['state'] == 200:
            self.retry = 0
            return response['data']['access_token']
        # 获取token失败后，进行重试，最多重试5次
        elif self.retry < 5:
            print(f'授权失败，重试第{self.retry}次')
            self.login(username, password, token_url)
        else:
            print(f'授权失败，请确认输入的用户名{username}与密码{password}是否正确')
            return None

    def oauth(self, oauth_token_url, params):
        self.retry = self.retry + 1
        headers = {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"}
        data = {
            "grant_type": params['grant_type'],
            "client_id": params['client_id'],
            "username": params['username'],
            "password": params['password'],
            "scope": params['scope']
        }
        response = requests.request('POST', oauth_token_url, headers=headers, data=data).json()
        if response['access_token']:
            self.retry = 0
            return response['access_token']
            # 获取token失败后，进行重试，最多重试5次
        elif self.retry < 5:
            print(f'授权失败，重试第{self.retry}次')
            self.oauth(oauth_token_url, params)
        else:
            print(f'授权失败，请确认输入的用户名{params.username}与密码{params.password}是否正确')
            return None

    # 获取图片验证码
    def get_vcode(self):
        # 获取图片验证码的图片
        response = requests.session().get(self.config_info.get_vcode_url()).json()
        if response['state'] == 200:
            # 提前图片中的验证码
            verify_code, verify_key = DoVcode.get_vcode(response)
            return verify_code, verify_key
        else:
            print(f'获取图片验证码失败，请检查参数{response}')
            return None, None

    # 通过密码获取token
    def get_token_password(self, username, password, token_url):
        return self.login(username, password, token_url)

    def get_default_username(self):
        return self.config_info.username

    def get_default_password(self):
        return self.config_info.password


if __name__ == '__main__':
    rs = Auth('sit')
    print(rs.login('admin', '111111'))
