'''
Author: miaoju jun.miao@sinosun.com.cn
Date: 2023-07-31 13:25:12
LastEditors: miaoju jun.miao@sinosun.com.cn
LastEditTime: 2023-08-01 15:48:56
FilePath: /paperprint-py/DertImage.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
# dertJ图片，系J2-J1的差图
# J1 环境光场景的图片，J2 环境光+闪光灯的图片， dertJ = J2 - J1，理论上得出纯闪光灯差图，然后与小黑屋的闪光灯图片J0进行比对
import util
import QRCodeParser
import PreprocessImageTool
import numpy as np
import cv2 as cv
import copy
from numpy import mean
from PylabShowTool import showImage
import math
from QRCodePaperImage import QRCodePaperImage
class DertImage:
    j2Image : QRCodePaperImage = None  # 核验图 J2 环境光 + 闪光灯
    j1Image : QRCodePaperImage = None # 核验图 J1 环境光

    cutImages = None # 裁剪的指纹图小图列表 上下左右的小图 : j2Image.cutImages - j1Image.cutImages
    ppCutImages = None # (sobel X、Y轴都处理)已经预处理过的纸纹小图列表(sobel、高斯后的) 上下左右的小图
    ppCutImagesX = None # (sobel X轴处理)已经预处理过的纸纹小图列表(sobel、高斯后的) 上下左右的小图
    ppCutImagesY = None # (sobel Y轴处理)已经预处理过的纸纹小图列表(sobel、高斯后的) 上下左右的小图
    def __init__(self, j2Image : QRCodePaperImage, j1Image : QRCodePaperImage) -> None:
        self.j2Image = j2Image
        self.j1Image = j1Image

    # 计算J2、J1的差图 (需要J2、J1配准之后再算差图)
    # 计算公式: DertJ = J2 - ((exposureTime2 * iso2) / (exposureTime1 * iso1)) * J1
    def calucDertImage(self):
        j2CutImages = self.j2Image.cutImages
        exposureTime2 = self.j2Image.tiffExposureTime # tiff信息 曝光时间
        iso2 = self.j2Image.tiffISO # tiff信息 ISO快门速度

        j1CutImages = self.j1Image.cutImages
        exposureTime1 = self.j1Image.tiffExposureTime
        iso1 = self.j1Image.tiffISO

        coeffValue = (exposureTime2 * iso2) / (exposureTime1 * iso1)
        cutImages = []
        # 分别计算四个纸纹区的差图
        for i in range(len(j2CutImages)):
            ppImg2 = j2CutImages[i]
            ppImg1 = j1CutImages[i]
            dert = ppImg2 - ppImg1 * coeffValue
            dert = np.float32(dert)
            cutImages.append(dert)

        return cutImages

    # 获取裁剪的纸纹图差图 
    def cutImgs(self):
        self.cutImages = self.calucDertImage()
        return self.cutImages

    # 指纹图预处理
    def preProcess(self):
        self.ppCutImages = PreprocessImageTool.preProcessBatching(self.cutImages, direction = 'xy')
        return self.ppCutImages

    # 指纹图预处理
    def preProcessX(self):
        self.ppCutImagesX = PreprocessImageTool.preProcessBatching(self.cutImages, direction = 'x')
        return self.ppCutImagesX

    # 指纹图预处理
    def preProcessY(self):
        self.ppCutImagesY = PreprocessImageTool.preProcessBatching(self.cutImages, direction = 'y')
        return self.ppCutImagesY
