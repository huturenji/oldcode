# -*- coding: utf-8 -*-
# @time     : 2021/6/24 11:28
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : read_yaml.py

import yaml
import os

from common.contants import CONF_DIR


class ReadYaml:

    def __init__(self, filename):
        """
        :param filename: Yaml文件名称,str格式
        """
        # 获取yaml文件路径
        self.yaml_path = os.path.join(CONF_DIR, filename)

    def read_yaml(self):
        # 读取yaml文件内容
        with open(self.yaml_path, "r", encoding='utf-8') as f:
            caps = yaml.load(f, Loader=yaml.FullLoader)
        return caps


if __name__ == '__main__':
    print(ReadYaml('caps.yaml').read_yaml()["sit_api"])
