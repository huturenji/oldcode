# 读取配置文件

import configparser
import os


class ReadConfig:
    # readconfig是工具类，实例化时不应该传入环境变量？？
    def __init__(self, env='sit'):
        root_dir = os.path.abspath('..')
        self.filepath = os.path.join(root_dir,'docs', 'config.ini')
        self.cf = configparser.RawConfigParser()
        self.cf.read(self.filepath, encoding='utf-8')
        self.origin = self.cf.get(env, 'origin')
        self.host = self.cf.get(env, 'host')
        self.product = self.cf.get(env, 'product')
        self.storename = self.cf.get(env, 'storename')
        self.username = self.cf.get(env, 'username')
        self.password = self.cf.get(env, 'password')

    def get_auth_conf(self):
        auth_conf = self.cf.items('auth')
        return dict(auth_conf)

    def get_host_conf(self, env):
        host = self.cf.items('auth')
        return dict(host[env])

    def get_auth_token_url(self):
        token_url = self.cf.get('auth', 'token_url')
        url = f'{self.origin}/{self.product}/{token_url}'
        return url

    def get_auth_username(self):
        return self.username

    def get_auth_password(self):
        return self.password

    def get_vcode_url(self):
        vcode_url = self.cf.get('vcode', 'url')
        url = f'{self.origin}/{self.product}/{vcode_url}'
        return url

    def get_deco_search_url(self):
        search_url = self.cf.get('deco', 'search_url')
        url = f'{self.origin}/{self.product}/{search_url}'
        return url

    def get_deco_add_url(self):
        add_url = self.cf.get('deco', 'add_url')
        url = f'{self.origin}/{self.product}/{add_url}'
        return url

    def get_deco_update_url(self):
        update_url = self.cf.get('deco', 'update_url')
        url = f'{self.origin}/{self.product}/{update_url}'
        return url

    def get_deco_search_home_pagesize(self):
        return self.cf.get('deco', 'search_home_pagesize')

    def get_deco_search_tabbar_pagesize(self):
        return self.cf.get('deco', 'search_tabbar_pagesize')

    def get_deco_search_list_pagesize(self):
        return self.cf.get('deco', 'search_list_pagesize')

    def get_deco_add_home_pagesize(self):
        return self.cf.get('deco', 'add_home_pagesize')

    def get_deco_add_tabbar_pagesize(self):
        return self.cf.get('deco', 'add_tabbar_pagesize')

    def get_deco_add_topic_pagesize(self):
        return self.cf.get('deco', 'add_topic_pagesize')

    def get_deco_add_all_pagesize(self):
        return self.cf.get('deco', 'add_all_pagesize')

    def get_clean_store_supplier(self):
        return self.cf.get('clean', 'store_supplier')


if __name__ == '__main__':
    rs = ReadConfig('sit')
    print(rs.get_auth_token_url('sit'))
