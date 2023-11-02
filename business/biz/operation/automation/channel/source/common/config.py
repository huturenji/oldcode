# 读取配置文件
from conf.mall import *
from conf.travel import *
from conf.media import *
from conf.environment import *


class ReadConfig:
    # readconfig是工具类，实例化时不应该传入环境变量？？
    def __init__(self, env='sit'):
        env_config = Environment[env]
        self.env_config = env_config
        self.product_mall = env_config['product_mall']
        self.production_env = Environment['production']
        self.origin = env_config['origin']
        self.auth_origin = env_config['auth_origin']
        self.host = env_config['host']
        self.product_mall = env_config['product_mall']
        self.username_mall = env_config['username_mall']
        self.password_mall = env_config['password_mall']
        self.product_travel = env_config['product_travel']
        self.realm_travel = env_config['realm_travel']
        self.username_travel = env_config['username_travel']
        self.password_travel = env_config['password_travel']
        self.product_media = env_config['product_media']
        self.realm_media = env_config['realm_media']
        self.username_media = env_config['username_media']
        self.password_media = env_config['password_media']

    def get_mall_auth_token_url(self):
        token_url = MallConfig['token_url']
        url = f'{self.origin}/{self.product_mall}/{token_url}'
        return url

    def get_mall_auth_username(self):
        return self.username_mall

    def get_mall_auth_password(self):
        return self.password_mall

    def get_vcode_url(self):
        vcode_url = MallConfig['vcode_url']
        url = f'{self.origin}/{self.product_mall}/{vcode_url}'
        return url

    def get_mall_channel_add_url(self):
        mall_channel_add_url = MallConfig['add_channel']
        url = f'{self.origin}/{self.product_mall}/{mall_channel_add_url}'
        return url

    def get_mall_channel_config_url(self):
        config_channel_add_url = MallConfig['config_channel']
        url = f'{self.origin}/{self.product_mall}/{config_channel_add_url}'
        return url

    def get_mall_channel_state_url(self):
        state_channel_add_url = MallConfig['setstate_channel']
        url = f'{self.origin}/{self.product_mall}/{state_channel_add_url}'
        return url

    def get_mall_boss_pay_url(self):
        boss_pay_url = MallConfig['update_boss_pay']
        url = f'{self.origin}/{self.product_mall}/{boss_pay_url}'
        return url

    def get_travel_channel_add_url(self):
        travel_channel_add_url = TravelConfig['add_channel']
        url = f'{self.origin}/{self.product_travel}/{travel_channel_add_url}'
        return url

    def get_travel_channel_detail_url(self):
        travel_channel_detail_url = TravelConfig['get_channel']
        url = f'{self.origin}/{self.product_travel}/{travel_channel_detail_url}'
        return url

    def get_travel_channel_update_url(self):
        travel_channel_update_url = TravelConfig['update_channel']
        url = f'{self.origin}/{self.product_travel}/{travel_channel_update_url}'
        return url

    def get_travel_channel_state_url(self):
        state_channel_add_url = TravelConfig['setstate_channel']
        url = f'{self.origin}/{self.product_travel}/{state_channel_add_url}'
        return url

    def get_travel_boss_pay_url(self):
        boss_pay_url = TravelConfig['update_boss_pay']
        url = f'{self.origin}/{self.product_travel}/{boss_pay_url}'
        return url

    def get_travel_auth_token_url(self):
        token_url = TravelConfig['token_url']
        url = f'{self.auth_origin}/auth/realms/{self.realm_travel}/{token_url}'
        return url

    def get_travel_auth_username(self):
        return self.username_travel

    def get_travel_auth_password(self):
        return self.password_travel

    def get_media_auth_username(self):
        return self.username_media

    def get_media_auth_password(self):
        return self.password_media

    def get_media_auth_token_url(self):
        token_url = MediaConfig['token_url']
        url = f'{self.auth_origin}/auth/realms/{self.realm_media}/{token_url}'
        return url

    def get_media_channel_add_url(self):
        media_channel_add_url = MediaConfig['add_channel']
        url = f'{self.origin}/{self.product_media}/{media_channel_add_url}'
        return url

    def get_media_channel_state_url(self):
        media_channel_state_url = MediaConfig['setstate_channel']
        url = f'{self.origin}/{self.product_media}/{media_channel_state_url}'
        return url

    def get_media_channel_config_url(self):
        media_channel_config_url = MediaConfig['config_channel']
        url = f'{self.origin}/{self.product_media}/{media_channel_config_url}'
        return url

    def get_media_channel_notice_url(self):
        notice_channel_add_url = MediaConfig['notice_url']
        url = f'{self.origin}/{self.product_media}/{notice_channel_add_url}'
        return url


if __name__ == '__main__':
    rs = ReadConfig('sit')
    print(rs.get_media_channel_config_url())
