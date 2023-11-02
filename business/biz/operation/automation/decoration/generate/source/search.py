# 查询渠道下装修数据信息，需要传入的参数有当前运行环境与授权的token
from common.config import ReadConfig
import requests
from common.auth import Auth


class Search:
    def __init__(self, env='sit', token=''):
        self.config_info = ReadConfig(env)
        self.token = token
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            'Content-Type': 'application/json ;charset=UTF-8'
        }

    # 查询渠道下首页信息
    def get_channel_home_list(self, channelId):
        return self.get_channel_deco_info(channelId, 'home', self.config_info.get_deco_search_home_pagesize())

    # 查询渠道下tabbar信息
    def get_channel_tabbar_list(self, channelId):
        return self.get_channel_deco_info(channelId, 'tabbar', self.config_info.get_deco_search_tabbar_pagesize())

    # 查询渠道下专题页信息
    def get_channel_topic_list(self, channelId):
        return self.get_channel_deco_info(channelId, 'topic', self.config_info.get_deco_add_topic_pagesize())

    # 查询渠道下的装修数据
    def get_channel_deco_info(self, channelId, deco_type, pagesize):
        url = self.config_info.get_deco_search_url()
        params = {
            'channelId': channelId,
            'pagesize': pagesize,
            'type': deco_type
        }
        response = requests.request('GET', url, headers=self.headers, params=params).json()
        if response['state'] == 200:
            deco_list = response['data']['list']
            return deco_list
        else:
            print(f'查询渠道{channelId}的{deco_type}信息失败,请检查相关参数(接口返回错误信息：{response})')
            return None

    # 查询渠道装修页面数据
    def get_channel_deco_list(self, channelId, page_type='home'):
        if page_type == 'tabbar':  # 可以优化通过type取值
            tabbar_list = self.get_channel_tabbar_list(channelId)
            return tabbar_list
        # 查询首页
        elif page_type == 'home':
            home_list = self.get_channel_home_list(channelId)
            return home_list
        # 查询专题页
        elif page_type == 'topic':
            topic_list = self.get_channel_topic_list(channelId)
            return topic_list
        # 查询所有页面
        elif page_type == 'all':
            tabbar_list = self.get_channel_tabbar_list(channelId)
            home_list = self.get_channel_home_list(channelId)
            topic_list = self.get_channel_topic_list(channelId)
            return tabbar_list + home_list + topic_list

# if __name__ == '__main__':
# token = Auth('sit').login('admin', '111111')
# print(Search('sit', token).get_channel_home_list(1111))
