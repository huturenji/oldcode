# 导入渠道下装修数据信息
from common.auth import Auth
from common.cleansing import Clean
from common.config import ReadConfig
import requests

from search import Search


class Update:
    def __init__(self, env='sit', token=''):
        self.token = token
        self.config_info = ReadConfig(env)
        self.token = token
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }

    # 导入首页
    def add_channel_home_list(self, channelId, decoId, name, show_name):
        return self.add_channel_deco_info(channelId, decoId, 'home', name, show_name,
                                          self.config_info.get_deco_add_home_pagesize())

    # 导入tabbar页面
    def add_channel_tabbar_list(self, channelId, decoId, name, show_name):
        return self.add_channel_deco_info(channelId, decoId, 'tabbar', name, show_name,
                                          self.config_info.get_deco_add_tabbar_pagesize())

    # 导入专题页
    def add_channel_topic_list(self, channelId, decoId, name, show_name):
        return self.add_channel_deco_info(channelId, decoId, 'topic', name, show_name,
                                          self.config_info.get_deco_add_topic_pagesize())

    # 导入页面
    def add_channel_deco_info(self, channelId, decoId, deco_type, name, show_name, pagesize=100):
        url = self.config_info.get_deco_add_url()
        params = {
            'channelId': channelId,
            'pagesize': pagesize,
            'decoId': decoId,
            'type': deco_type,
            'name': name,
            'showName': show_name

        }
        response = requests.post(url=url, data=params, headers=self.headers).json()
        if response['state'] == 200:
            return 'success'
        else:
            print(f'导入渠道{channelId}的页面{decoId}信息失败,请检查相关参数({response})')
            return None

    # 导入所有装修页
    def add_channel_deco_info_all(self, channelId, decoId, deco_type, name, show_name):
        return self.add_channel_deco_info(channelId, decoId, deco_type, name, show_name,
                                          self.config_info.get_deco_add_all_pagesize())

    # 更新装修页数据
    def update_channel_deco_info(self, channelId, decoId, deco_type, name, show_name, data):
        url = self.config_info.get_deco_update_url()
        params = {
            'channelId': channelId,
            'decoId': decoId,
            'type': deco_type,
            'name': name,
            'showName': show_name,
            'data': data
        }
        response = requests.post(url=url, data=params, headers=self.headers).json()
        if response['state'] == 200:
            return 'success'
        else:
            print(f'更新渠道{channelId}的首页{name}({decoId})信息失败,请检查相关参数({response})')
            return None

    def update_channel_deco_list(self, channelId, env, deco_list):
        clean_data = Clean(env)
        success_flag = 'success'
        for info in deco_list:
            # 添加专题页面
            add_res = self.add_channel_deco_info_all(channelId, info['decoId'], info['type'], info['name'],
                                                     info['showName'])
            if add_res == 'success':
                data = info['data']
                if info['data']:
                    data = clean_data.all_handle(info['data'])
                update_res = self.update_channel_deco_info(channelId,
                                                           info['decoId'], info['type'], info['name'], info['showName'],
                                                           data)
                if update_res != 'success':
                    success_flag = None
                    break
                print(f'导入渠道{channelId}装修页id：{info["decoId"]}  装修页名称：{info["name"]}  成功')
            else:
                success_flag = None
                break
        return success_flag

# if __name__ == '__main__':
#     token = Auth('sit').login('admin', '111111')
#     home_list = Search('sit', token).get_channel_home_list(1111)
#     import_fun = Update('sit', token)
#     clean_data = Clean('sit')
#     for info in home_list:
#         add_res = import_fun.add_channel_home_list(info['channelId'], info['decoId'])
#         if add_res == 'success':
#             data = clean_data(info['data'])
#             update_res = import_fun.update_channel_deco_info(info['channelId'],
#                                                              info['decoId'], info['type'], info['name'], data)
#             if update_res != 'success':
#                 break
#         else:
#             break
