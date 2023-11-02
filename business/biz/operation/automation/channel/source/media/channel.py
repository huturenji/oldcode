import requests

from common.config import ReadConfig


class MediaChannel:
    def __init__(self, env, token):
        self.env = env
        self.token = token
        self.config_info = ReadConfig(env)
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            'Content-Type': 'application/json ;charset=UTF-8'
        }

    # 新增渠道配置信息
    def config(self, data):
        url = self.config_info.get_media_channel_config_url()
        params = {
            "channelId": data["channelId"],
            "channelName": data["channelName"],
            "channelAccessConfigs": [{"configKey": "grayscaleFull", "configValue": "false"},
                                     {"configKey": "pushRequestUrl",
                                      "configValue": data["third_origin"] + "/message/v1/pushBizmateMessage"}]

        }
        response = requests.post(url=url, json=params, headers=self.headers).json()
        if response['resultCode'] == 0 or response['resultCode'] == 81104001:
            return 'success'
        else:
            return f'新增渠道{data["channelId"]}的资讯配置信息失败,请检查相关参数({response})'

    # 更新渠道
    def update(self, data):
        url = self.config_info.get_media_channel_update_url()
        response = requests.post(url=url, json=data, headers=self.headers).json()
        if response['resultCode'] == 0:
            return 'success'
        else:
            return f'更新渠道{data["channelId"]}失败,请检查相关参数({response})'

    # 新建渠道
    def add(self, data):
        url = self.config_info.get_media_channel_add_url()
        params = {
            "channelName": data["channelName"],
            "logo": "https://bucket-sinosun-dev1.oss-cn-hangzhou.aliyuncs.com/jegzgPi4g9/operation/logo/ban-b02c851e-6f8e-406b-aedc-8296eab64b36.png",
            "shortChannelName": data["channelName"],
            "userId": "145a7aff-2084-4d5b-874a-8c49a132d94d",
            "userName": "automation",
            "channelId": data["channelId"]
        }
        config_res = self.config(data)
        if config_res == 'success':
            # 查询渠道信息 ，如果信息存在 则更新
            response = requests.post(url=url, json=params, headers=self.headers).json()
            if response['resultCode'] == 0:
                return self.enable(data["channelId"])  # 渠道开启
            else:
                if response['resultCode'] == 80103001:  # 渠道已存在
                    update_result = self.update(params)
                    if update_result == 'success':
                        return self.enable(data["channelId"])  # 渠道开启
                    else:
                        return update_result
                else:
                    return f'新增渠道{data["channelId"]}失败,请检查相关参数({response})'
        else:
            return config_res

    # 启用渠道
    def enable(self, channelId):
        url = self.config_info.get_media_channel_state_url()
        params = {
            "channelId": channelId,
            "userId": "145a7aff-2084-4d5b-874a-8c49a132d94d",
            "userName": "automation",
            "state": "ENABLE"
        }

        response = requests.post(url=url, json=params, headers=self.headers).json()
        if response['resultCode'] == 0:
            return 'success'
        else:
            return f'开启渠道{id}失败,请检查相关参数({response})'
