import requests


class HandleRequest:
    def send(self, url, method, params=None, data=None, json=None, headers=None):
        # 将请求的方法转换为小写
        method = method.lower()
        if method == "post":
            return requests.post(url=url, json=json, data=data, headers=headers)
        elif method == "patch":
            return requests.patch(url=url, json=json, data=data, headers=headers)
        elif method == "get":
            return requests.get(url=url, headers=headers, params=params)


class HandleSessionRequest:
    """使用session鉴权的接口，使用这个类类发送请求"""

    def __init__(self):
        self.se = requests.session()

    def send(self, url, method, params=None, data=None, json=None, headers=None):
        # 将请求的方法转换为小写
        method = method.lower()
        if method == "post":
            return self.se.post(url=url, json=json, data=data, headers=headers)
        elif method == "patch":
            return self.se.patch(url=url, json=json, data=data, headers=headers)
        elif method == "get":
            return self.se.get(url=url, params=params)


if __name__ == '__main__':
    # 登录接口地址
    pass
