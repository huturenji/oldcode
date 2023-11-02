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

    # 新增渠道配置信息
    def config(self, data):
        url = self.config_info.get_mall_channel_config_url()
        params = {
            "channelId": data["channelId"],
            "channelName": data["channelName"],
            "channelAccessConfigs": [{"configKey": "approvalRequestUrl",
                                      "configValue": data[
                                                         "third_origin"] + "/bizmate/static/approval/approval/apply.html"
                                                                           "?templetType=58&title=%E5%87%BA%E5%B7%AE%E7%94%B3"
                                                                           "%E8%AF%B7&appletUAId=268435457"},
                                     {"configKey": "pushRequestUrl",
                                      "configValue": data["third_origin"] + "/message/v1/pushBizmateMessage"}]

        }
        response = requests.post(url=url, json=params, headers=self.headers).json()
        if response['state'] == 200:
            return 'success'
        else:
            return f'新增渠道{data["channelId"]}的配置信息失败,请检查相关参数({response})'

    # 新建渠道
    def add(self, data):
        url = self.config_info.get_mall_channel_add_url()
        params = {"userId": "1", "companyId": "1", "userName": "admin", "channelId": data["channelId"],
                  "channelName": data["channelName"], "shortChannelName": data["shortChannelName"],
                  "logo": "https://bucket-sinosun-dev1.oss-cn-hangzhou.aliyuncs.com/jegzgPi4g9/images/admin/setting"
                          "/31baf489-3202-421b-8169-aca3cf572515.png", "storeIdList": ["6"],
                  "paymentMethods": data["paymentMethods"]}

        config_res = self.config(data)
        if config_res == 'success':
            response = requests.post(url=url, json=params, headers=self.headers).json()
            if response['state'] == 200:
                en_res = self.enable(data['channelId'])
                if en_res == 'success':
                    return 'success'
                else:
                    return f'开启渠道{data["channelId"]}失败){en_res}'
            else:
                return f'新增渠道{data["channelId"]}失败,请检查相关参数({response})'
        else:
            return f'新增渠道{data["channelId"]}失败,请检查相关参数({config_res})'

    # 启用渠道
    def enable(self, channelId):
        url = self.config_info.get_mall_channel_state_url()
        params = {
            "userId": "1",
            "companyId": "1",
            "userName": "admin",
            "channelId": channelId,
            "channelState": "1"
        }

        response = requests.post(url=url, json=params, headers=self.headers).json()
        if response['state'] == 200:
            return 'success'
        else:
            return f'开启渠道{channelId}失败,请检查相关参数({response})'
