from common.auth import Auth
travel_access_token_map = {}
from common.config import ReadConfig


class MediaAuth:
    def __init__(self, env):
        self.env = env
        self.config_info = ReadConfig(env)

    def login(self, username, password):
        env = self.env
        auth = Auth(env)
        token_url = self.config_info.get_media_auth_token_url()
        # sit环境token时间较短，通过每次获取来验证 需要判断token的有效期 用本地缓存来处理
        return auth.oauth(token_url, {
            "grant_type": "password",
            "client_id": "TRAVEL_operation_front",
            "username": username,
            "password": password,
            "scope": "openid"
        })  # 用户名与密码让用户手动输入

    # 默认用户名
    def get_default_username(self):
        return self.config_info.get_media_auth_username()

    # 默认密码
    def get_default_password(self):
        return self.config_info.get_media_auth_password()
