from common.auth import Auth
from common.config import ReadConfig

mall_access_token_map = {}


class MallAuth:
    def __init__(self, env):
        self.env = env
        self.config_info = ReadConfig(env)

    def login(self, username, password):
        env = self.env
        auth = Auth(env)
        token_url = self.config_info.get_mall_auth_token_url()
        # token 存在 则直接返回token 否则通过用户名密码获取token
        global mall_access_token_map
        print(f'mall_access_token_map is {mall_access_token_map}')
        if mall_access_token_map.get(env):  # token区分环境
            return mall_access_token_map[env]
        else:
            mall_access_token_map[env] = auth.get_token_password(username, password, token_url)  # 用户名与密码让用户手动输入
            return mall_access_token_map[env]

    # 默认用户名
    def get_default_username(self):
        return self.config_info.get_mall_auth_username()

    # 默认密码
    def get_default_password(self):
        return self.config_info.get_mall_auth_password()
