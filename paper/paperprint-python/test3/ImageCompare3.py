'''
Author: miaoju jun.miao@sinosun.com.cn
Date: 2023-07-17 14:50:15
LastEditors: miaoju jun.miao@sinosun.com.cn
LastEditTime: 2023-09-04 11:10:58
FilePath: /paperprint-line-py/test2/ImageCompare.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
import sys
import os
# ---- begin python 3.6.7 以上的版本，需要这样import其他目录的py文件
dir_path = os.path.dirname(os.path.realpath(__file__))
parent_dir_path = os.path.abspath(os.path.join(dir_path, os.pardir))
sys.path.insert(0, parent_dir_path)
# ---- end python 3.6.7 以上的版本，需要这样import其他目录的py文件

from ImageCompare import ImageCompare
from test3.QRCodePaperImage3 import  QRCodePaperImage3
from params import CUT_SIZE, MATCH_POSITION, SOBEL_CALC_AVG
import numpy as np
import PylabShowTool
import cv2 as cv
import copy
from numpy import mean
import PreprocessImageTool
import params as params
import QRCodePaperImage
import QRCodeParser
import PylabShowTool
class ImageCompare3(ImageCompare):
    def __init__(self,imgFile1, imgFile2):
        # super().__init__(imgFile1, imgFile2)
        self.regImage = QRCodePaperImage3(imgFile1, 0)
        self.verifiImg = QRCodePaperImage3(imgFile2, 1)
        # print("ImageCompare3 - __init__")

    def compare(self, qrCodeWidth):
        # print("ImageCompare3 - compare")

        return super().compare(qrCodeWidth)

    # 配准
    def algin(self, qrCodeWidth):
        super().algin(qrCodeWidth)
        self.verifiImg.blockGridSize = self.regImage.blockGridSize
        return

    # 裁图
    def cutImgs(self, qrCodeWidth):
        return super().cutImgs(qrCodeWidth)

    def calc(self, regImage: QRCodePaperImage, verifiImg: QRCodePaperImage):
        return super().calc(regImage, verifiImg)
