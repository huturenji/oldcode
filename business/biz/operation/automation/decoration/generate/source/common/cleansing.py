# 数据清洗
import re
from common.config import ReadConfig


class Clean:
    def __init__(self, env):
        self.env = env
        self.config_info = ReadConfig(env)
        self.host = self.config_info.host
        self.storename = self.config_info.storename
        self.product = self.config_info.product

    # 域名处理 将数据中的域名替换为对应环境的域名
    def domain_handle(self, origin_data):
        pattern = '(bplus.?[su][ia](t.sinosun.com).?\d{0,5}|(cloud.sinosun.com).?\d{0,4})(/mallbbcg2)(bank)?'
        result = re.sub(pattern, f'{self.host}/{self.product}', origin_data, count=0, flags=0)
        return result

    # 店铺处理 将店铺替换为京东企业购店铺
    def store_handle(self, origin_data):
        pattern = '("storeAndSupplierInfos":)((.+?)[}][]]|[[][]])'
        result = re.sub(pattern, self.config_info.get_clean_store_supplier(), origin_data, count=0, flags=0)
        return result

    # 商品sku处理 将商品sku替换为对应环境的sku
    def sku_handle(self, origin_data):
        pattern = '[PA][ABC]AB'
        result = re.sub(pattern, self.storename, origin_data, count=0, flags=0)
        return result

    def all_handle(self, origin_data):
        return self.domain_handle(self.store_handle(self.sku_handle(origin_data)))


if __name__ == '__main__':
    cl = Clean('g2bankuat')
    data = 'PAABJD100003713420--PAABJD100024025144' \
           '"storeAndSupplierInfos":[{1:2},{3:4}],' \
           '"storeAndSupplierInfos":[]'\
            'https://bplussit.sinosun.com:18380/mallbbcg2/static/admin/index.html#/user/login' \
            'https://bplus-uat.sinosun.com/mallbbcg2/static/admin/index.html#/user/login' \
            'https://cloud.sinosun.com:9443/mallbbcg2bank/static/admin/index.html#/sysset_channel/list '
    print(cl.all_handle(data))
