import requests

from common.config import ReadConfig
from common.pay import BasePay


class Pay:
    def __init__(self, env):
        self.token = ''
        self.env = env
        self.headers = {}
        self.config_info = ReadConfig(env)
        self.base_pay = BasePay(env)
        self.production_env = self.config_info.production_env

    # 传入token
    def init(self, token):
        self.token = token
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            'Content-Type': 'application/json ;charset=UTF-8'
        }
        return self

    # 新增公款闪付
    def add_quick_pay(self, data):
        url = self.config_info.get_travel_boss_pay_url()
        params = {
            "alias": data["payTypeName"],  # 支付方式简称
            "apiUrl": data["pay_address"],  # 支付服务地址 "https://bizmatesit.sinosun.com:17380/bizmate/bosspay"
            "icon": "data:image/png;base64,"
                    "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAMKADAAQAAAABAAAAMAAAAADbN2wMAAAH40lEQVRoBdVaCYwUVRr+Xh3dzcxwycKIjAS5vHcBQUYEXBRv3WjMonHJhnXN6uquullcWOMRNWqMuF5BJZpIPKLiuVFYRU3kUkE0CAtyCOLOIMKwMDDDTHdX1yv/v3r6dVVfU12VjPgnNf1f73///+q9//3v1Qh4oONBNNoOZgvgTDgY5ACaR/yToeSPhMBe8meVLjCvZg4+yzlDMsBZAPPwftxLSrMdB3pOeCT+CgGbBnde7VG4Q1wHy2An2XmKbg4JjnjoGuA55DPDXMHTRjpYeaSPfOHI8pvQBCYbPOdp5KNNm3hfaP1GqD6cjr1w2poVzYjo3QBRM0jxZOt2IHVQ0dUiPOA2MNvgBRt15pjjb0Z8yt3Kh+R71yOzboGiGdFHXIzEBU8rXmrFXbBW3aPoMAj7rnG2CdPY28YYfbmXhP3t+z6aiUJeYZuiBkEY5LtGox8pVYq+w6DXj1Hdyf1b4RzcqegcwjyW5YDbcNsowL5Hcp47N06e6fMhs+UNH+0lCmWFbb26QfFoAQgD5tjrfX1ZG5730V6iUOa2JRtRIFIA+ujLoPUeovq3v18DZ/9mRRciLGOdHHBbthEFIgUQa5zj69ta+5iPLkUU6sQa/1FKLTAvdADGCb+FPni86shu2YjMN++i9pZW1M113KfX71creQ7JbHoFrJsDffAEsK2wEC4Amrexqff5+kyvuBPmqbMgEn0V31rzL4XnEYn0yrvyJGGurZBrIVQA5sS/QztqlHLC/uFL2Fvfhjn+JsWTh5pQmHVyQnvLm+A2OWBbbDMMVB2AGHAiYpPzuy53ml5+B/RRv4HWP19OWF88QWVupoxPDviNeYFtsu1qoeocFjvtr5D7/qv6kQe2w96xBL2u/ljxnHQ7rHXPKLoUYm9fDOvrRb6g2XZq6Q2l1Mvyqg6gVAda/VjoQ89SnVjrn6NCrVXR5ZDUv68sJwrMrzqAUpbN8bcotuNIWGsfV7RCEgOQuGwRlaXZWSubVxRNI6VbBRI5AFF7NIyTrlJd2tvegdP6jaIVkvw/VXRJGCMucllOwyRYX8yH07FHqYRBql7EhZ2Y426A0GOKnf78EYUXIt60ym24bVSIFoCe8NVCnBpl07KyPtnffQR7z1dKbo77Mx0UEooOg0QKwDj5d3TKGqj6tSqMfk7Jq8Nt2UYUiBSAOSG/eGXb98h8/Wq3vmQ2vQzZvlvpeW0oZhVI6EWsDzsX+sBTVFdO+y6YZ/xT0ZUQp20XUDfYVWEb+rDpsHd+WKlJWVn4ADx5n61zUcZPGNCH/rrnA0ivngd5gNKlJwOFcR62hczWt0I15Uai7QE4+ohLKB+3QO5eHdpQTzYUNfUwTpxB+8gTcKeQMepSmGP+BNn6LS3EV+AutJYNPelT933F+8E4/gp309SHTqMNXc8HkGut9TsOMVqI/Mh9m5DZ8T7spuX0rAB4J+1JoPOBdvRpVGNNpWcaLfRzfBtmzpWyi1j7xUmI0YPT/waHrsHkvo20SVEwzZ/Q9cjm7PyPcLOWc8D9JWcFDZ7WfxQ5PQ76seT0kEkQsVqfWimibABeZUEXkW66o5Tn3f7lYbpCPLCNAtpGV4lNcNJtcFJtgNVOeHv2lxapiNVBmHV09KLfWO/sL21iWv+RdDAa7d4PCS2QK163XDxcqy4zWi1d6tGjN5xZZLinGMF3YjpdyT35Y2AUB7N2ZJEJfpslK9kizTwj8BuQe9ah86WpqLnmKzjWYTpG3p630oXFpz9Kc3lkEd/H6GxB5wuT6GzwGvSRl/pE6U/vp8SuI37hsz5+JSJYAOlDEH2OpRR2NVIf3EQdPAN9+AU+u2m6bXaSB+kjT2Xgo6aorafb6uy5oLJ299JAAfBdTmbnUiTOfwpctEE3IWikjLFUDneBtebhHFr+lwbC+nK+mwjk7jWw1i/06XKG4xNb6r3rYJ4yE1rDFJ+8FBF8DXDrXpQ5Bv0K9v+WkyNPlrJXkZda+hd3AEQtFXJ8tOTM432YRxnP5XUdPSsaJGGgN1BoRLasdwMp5FeiM5tfQ2bzIog4pVECbfBExAeeSh7wgSY7jqklf8iugfPmuzpB/lT3Bros8pWI3Esnq+T+IH1kdZIHEL94Ic3/bBnNzM6XpyP98dzgNkpoVh0AF3xy7wZ38+l89Xy61aKNi4F260pgjLmWCrD84Z9142fPg/X5o7C3vF6paUUZfeiDdDwnpIratAhTS66FOeFmJC6nTvU4ku/MpCaVnc/aLB4rjcqF2KTb6TLrRiDTWbHrQiGf6th3jb+A27vXFspL0snFNEfNGsSm3OM6z/c8dvNKWtTLSuoHYfIpLjHjP7QWegVRVzqSfSbfDRq7VXbTsivkoWZofRqUQikkNvFWaANOoM5qXLGoOwY1s9bSdDqOXkLxzlrKRhFPM6HVj8uy2Qal5yCQ2fgiv/dVGv/vgbDa7NSSa9yqs1Jj7ZhGmrj9fCpcwCXfngHn8A/0rXi4TxaU4CmUWjyLvi8sJhs0GN0AZzR7yyKbfdfv+xDNt52DGtm6Y7Lc9QmVsmf57vhdW5kOqiL7UKmb/6CR64MvqLgS5bks+O10A3zy04c0uju7UqUP45wETLrhNn/5x67UqqQKcaQNa/VDbjUgpP1Q7VwsFCz1/bOHUafzRS0fJrzfv5SVnwBxrA4qJNe56w0Ht/v+2cMNIOdTx8/w321+BBiUreMCJ3eXAAAAAElFTkSuQmCC",
            "notifyUrl": "https://" + self.config_info.host + + self.config_info.product_travel+"/v3/payment/notify"
                                                                                                "/bossPayNotify",
            "operationName": "admin",
            "payType": data["payType"],  # 支付方式key
            "payTypeName": data["payTypeName"],  # 支付方式全称
            "privateKey": self.get_private_key(),
            "publicKey": self.get_public_key(),
            "shopId": "sinosuntravel",
            "signType": "SM2",
            "thirdPublicKey": data["thirdPublicKey"]
        }

        # 很容易接口失败，需要找到失败的原因 原因是因为clientid用错了
        response = requests.post(url=url, json=params, headers=self.headers).json()
        if response['resultCode'] == 0:
            return 'success'
        else:
            return f'新增公款闪付{data["payType"]}失败,请检查相关参数({response})'

    # 获取微信支付配置
    def get_wx_pay(self):
        return self.base_pay.get_wx_pay()

    # 获取支付宝配置
    def get_ali_pay(self):
        return self.base_pay.get_ali_pay()

    # 公款闪付 商旅 公钥
    def get_public_key(self):
        if self.env.upper() == self.production_env.upper():
            return '3E29ED16D804E25FF108EC71B4A44E797556644B27DC62EF57D8F1F2C8BC7C2DBBF48EFE1B299DE56778BED504F86578011B7157DCC1663F1895A76F8AD36B66'
        else:
            return '3A71294F88265A2C8CAC0E23D336DA38919F756ECE0BF0BE7924B45A53CA8BE9686A99FDBDD0EC3A03CCD1A90D513DB8D52F1389E4584B3EB05E747CA62BF2CA'

    # 公款闪付 B+ 私钥
    def get_private_key(self):
        if self.env.upper() == self.production_env.upper():
            return 'F0E3CDBF54D7CB8E7D294A68CD4438B44A5134E4032A47A2B6A89457580F9A63'
        else:
            return 'A8180F3A7E7754C22626491B7FA56CB729206E7AFDC633CD2EFC79788B0950CB'
