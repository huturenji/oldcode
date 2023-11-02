from common.auth import Auth
travel_access_token_map = {}
from common.config import ReadConfig


class TravelAuth:
    def __init__(self, env):
        self.env = env
        self.config_info = ReadConfig(env)

    def login(self, username, password):
        env = self.env
        auth = Auth(env)
        token_url = self.config_info.get_travel_auth_token_url()
        # sit环境token时间较短，通过每次获取来验证
        return auth.oauth(token_url, {
            "grant_type": "password",
            "client_id": "TRAVEL_operation_front",
            "username": username,
            "password": password,
            "scope": "openid"
        })  # 用户名与密码让用户手动输入

        # # token 存在 则直接返回token 否则通过用户名密码获取token todo 需要判断token的有效期
        # global travel_access_token_map
        # if travel_access_token_map.get(env):  # token区分环境
        #     return travel_access_token_map[env]
        # else:
        #     travel_access_token_map[env] = auth.oauth(token_url, {
        #         "grant_type": "password",
        #         "client_id": "TRAVEL_H5",
        #         "username": username,
        #         "password": password,
        #         "scope": "openid"
        #     })  # 用户名与密码让用户手动输入
        #     return travel_access_token_map[env]

    # 默认用户名
    def get_default_username(self):
        return self.config_info.get_travel_auth_username()

    # 默认密码
    def get_default_password(self):
        return self.config_info.get_travel_auth_password()
