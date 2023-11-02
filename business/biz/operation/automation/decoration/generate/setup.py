# 构建项目   安装依赖 打包为python包
import os
from setuptools import setup, find_packages

__version__ = '1.0.0'  # 版本号
requirements = open('requirements.txt').readline()  # 读取项目依赖文件

setup(
    name='decoration_generate',
    verion=__version__,
    author='huturenji',
    author_email='huturenji@126.com',
    description='装修数据导入导出',
    packages=find_packages(),
    python_requires='>=3.8.0',
    install_requires=requirements  # 安装依赖
)
