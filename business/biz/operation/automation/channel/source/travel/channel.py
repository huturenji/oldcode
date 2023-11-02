import requests

from common.config import ReadConfig


class Channel:
    def __init__(self, env, token):
        self.env = env
        self.token = token
        self.config_info = ReadConfig(env)
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            'Content-Type': 'application/json ;charset=UTF-8'
        }

    # 更新渠道
    def update(self, data):
        url = self.config_info.get_travel_channel_update_url()
        response = requests.post(url=url, json=data, headers=self.headers).json()
        if response['resultCode'] == 0:
            return 'success'
        else:
            return f'更新渠道{data["channelId"]}失败,请检查相关参数({response})'

    # 渠道详情
    def detail(self, channelId):
        url = self.config_info.get_travel_channel_detail_url()
        data = {
            'channelId': channelId
        }
        response = requests.get(url=url, params=data, headers=self.headers).json()
        if response['resultCode'] == 0:
            return response
        else:
            return f'查询渠道{data["channelId"]}失败,请检查相关参数({response})'

    # 新建渠道
    def add(self, data):
        url = self.config_info.get_travel_channel_add_url()
        params = {
            "channelInfo":
                {"channelName": data["channelName"],
                 "channelId": data["channelId"],
                 "applicationId": "268435518",
                 "applicationKey": "268435518",
                 "authorizedCertificationUrl": data["third_origin"] + "/bizmate/sso123",
                 "pushMessageUrl": data["third_origin"] + "/bizmate/message/v1/pushBizmateMessage",
                 "zoneId": "0"},
            "channelProtocol": {}, "protocolConfigList": [], "operator": "admin",
            "payTypeList": data["payTypeList"]
        }

        # 查询渠道信息 ，如果信息存在 则更新
        response = requests.post(url=url, json=params, headers=self.headers).json()
        channel_detail = self.detail(data['channelId'])
        id = channel_detail["result"]["id"]
        if response['resultCode'] == 0:
            return self.enable(id)  # 渠道开启
        else:
            if response['resultCode'] == 80103001:  # 渠道已存在
                params['channelInfo']['id'] = id
                update_result = self.update(params)
                if update_result == 'success':
                    return self.enable(id)  # 渠道开启
                else:
                    return f'渠道存在，更新渠道{id}失败,请检查相关参数({update_result})'
            else:
                return f'新增渠道{id}失败,请检查相关参数({response})'

    # 启用渠道
    def enable(self, id):
        url = self.config_info.get_travel_channel_state_url()
        params = {
            "id": id,
            "state": "1",
            "operator": "admin"
        }

        response = requests.post(url=url, json=params, headers=self.headers).json()
        if response['resultCode'] == 0:
            return 'success'
        else:
            return f'开启渠道{id}失败,请检查相关参数({response})'
