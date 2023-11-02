'''
Author: miaoju jun.miao@sinosun.com.cn
Date: 2023-07-17 14:50:15
LastEditors: miaoju jun.miao@sinosun.com.cn
LastEditTime: 2023-08-31 14:56:32
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
from test2.QRCodePaperImage2 import  QRCodePaperImage2 
from params import CUT_SIZE, MATCH_POSITION, SOBEL_CALC_AVG
import numpy as np
import PylabShowTool
import cv2 as cv
import copy
from numpy import mean
import PreprocessImageTool
import params as params
import QRCodePaperImage
import PylabShowTool
class ImageCompare2(ImageCompare):
    def __init__(self,imgFile1, imgFile2):
        # super().__init__(imgFile1, imgFile2)
        self.regImage = QRCodePaperImage2(imgFile1, 0)
        self.verifiImg = QRCodePaperImage2(imgFile2, 1)
        # print("ImageCompare2 - __init__")

    def compare(self, qrCodeWidth):
        # print("ImageCompare2 - compare")

        return super().compare(qrCodeWidth)

    # # 配准
    # def algin(self, qrCodeWidth):
    #     # 裁三个回字的36条边，这种方案不能使用orb配准，只能用二维码配准将二维码先校正
    #     self.regImage.alginByQRCode(qrCodeWidth) # 透射变换校正
    #     self.verifiImg.alginByQRCode(qrCodeWidth) # 透射变换校正
    #     if self.verifiJ1Img is not None:
    #         self.verifiJ1Img.alginByQRCode(qrCodeWidth)

    #     return

    # 裁图
    def cutImgs(self, qrCodeWidth):
      
        return super().cutImgs(qrCodeWidth)

    def calc(self, regImage: QRCodePaperImage, verifiImg: QRCodePaperImage):
        # regLine = PreprocessImageTool.removeLight(regLine,'x')
        # verifiLine = PreprocessImageTool.removeLight(verifiLine,'x')

        # regLine = cv.GaussianBlur(regLine, (3, 3), 1)
        # verifiLine = cv.GaussianBlur(verifiLine, (3, 3), 1)

        # regCutImgs = regImage.cutImages
        # verifiCutImgs = verifiImg.cutImages
        regCutImgs = regImage.preProcess()  # 对4个纸纹图片进行图像处理
        verifiCutImgs = verifiImg.preProcess()  # 对4个纸纹图片进行图像处理

        results = []
        h,w = regCutImgs[4].shape
        allRegImgs = np.zeros((h,w), dtype=np.float32)
        h,w = verifiCutImgs[4].shape
        allVerifiImgs = np.zeros((h,w), dtype=np.float32)
        # for i in range(len(regCutImgs)):
        #     if i < 4:
        #         continue
        #     regImg = regCutImgs[i]
        #     verifiImg = verifiCutImgs[i]
        #     if (regImg.shape[0] < regImg.shape[1]) :
        #         pass
        #     else :
        #         regImg = np.transpose(regImg)
        #         verifiImg = np.transpose(verifiImg)
        #     allRegImgs = np.concatenate((allRegImgs, regImg), axis=1)
        #     allVerifiImgs = np.concatenate((allVerifiImgs, verifiImg), axis=1)
            
        # result = calcCCOEFF(allRegImgs, allVerifiImgs)
        # maxX = result[0][0]
        # maxX = np.around(maxX,decimals = 5)
        # results.append(maxX)

        for i in range(len(regCutImgs)):
            if i < 4:
                continue
            regImg = regCutImgs[i]
            verifiImg = verifiCutImgs[i]
            # 1、直接比较灰度值
            maxX = compareGaryValue(regImg, verifiImg)
            shape = regImg.shape[:2]
            # 2、比较最大梯度的边缘
            if (shape[0] < shape[1]) :
                pass
            else :
                regImg = np.transpose(regImg)
                verifiImg = np.transpose(verifiImg)
            maxX = compareMaxDiffX(regImg, verifiImg)
            results.append(maxX)

        print("results:%s"%results)
        return results,[],min(results),mean(results),0,"36Side:%s"%results,"no false result"

# 直接计算灰度值相关性
def compareGaryValue(regImg, verifiImg):
    totalReg = sum(regImg)
    avgLineReg = totalReg / len(regImg)
    totalVerifi = sum(verifiImg)
    avgLineVerifi = totalVerifi / len(verifiImg)
    avgLineReg3 = avgLineReg - mean(avgLineReg)
    avgLineVerifi3 = avgLineVerifi - mean(avgLineVerifi)
    avgLineVerifi3 = avgLineVerifi3[3:-3]
    result = calcCCOEFF(avgLineReg3, avgLineVerifi3)
    maxX = result[0][0]
    maxX = np.around(maxX,decimals = 5)
    return maxX

# 计算最大梯度值相关性
def compareMaxDiffX(regImg, verifiImg):
    diffRegImg = makeDiffImg(regImg)
    diffVerifiImg = makeDiffImg(verifiImg)
    maxDiffRegImg = np.argmax(diffRegImg, axis=0)
    maxDiffVerifiImg = np.argmax(diffVerifiImg, axis=0)
    print("compareMaxDiff - reg[%s]"%maxDiffRegImg)
    print("compareMaxDiff - verifi[%s]"%maxDiffVerifiImg)
    print("compareMaxDiff - %s"%(maxDiffVerifiImg - maxDiffRegImg))

    result = calcCCOEFF(diffRegImg, diffVerifiImg)
    maxX = result[0][0]
    maxX = np.around(maxX,decimals = 5)
    return maxX

# 计算图像的梯度图
def makeDiffImg(srcImg):
    h,w = srcImg.shape
    diffImg = np.zeros((h-1,w), dtype=np.float32)
    for i in range(len(srcImg)):
        if i < len(srcImg) - 2:
            diff = abs(srcImg[i+1] - srcImg[i])
            diffImg[i] = diff
    return diffImg

# 使用模版匹配法计算相关性
def calcCCOEFF(image, template):
   # 进行模板匹配
    # 匹配方法：关于匹配方法，使用不同的方法产生的结果的意义可能不太一样，有些返回的值越大表示匹配程度越好，而有些方法返回的值越小表示匹配程度越好。
    # CV_TM_SQDIFF 平方差匹配法：该方法采用平方差来进行匹配；最好的匹配值为0；匹配越差，匹配值越大。
    # CV_TM_CCORR 相关匹配法：该方法采用乘法操作；数值越大表明匹配程度越好。
    # CV_TM_CCOEFF 相关系数匹配法：1表示完美的匹配；-1表示最差的匹配。
    # CV_TM_SQDIFF_NORMED 归一化平方差匹配法
    # CV_TM_CCORR_NORMED 归一化相关匹配法
    # CV_TM_CCOEFF_NORMED 归一化相关系数匹配法
    image = np.float32(image)
    template = np.float32(template)
    # result = cv.matchTemplate(image, template, cv.TM_CCOEFF_NORMED)
    result = cv.matchTemplate(image, template, cv.TM_CCOEFF_NORMED)

    # 查找互相关最高的值和位置,前10位
    maxVals = findMax(result)
    return maxVals

# 找出前N个最大的数
def findMax(result, size=3): 
    _result = copy.deepcopy(result)
    maxVals = []
    for i in range(0, size):
        # 查找最大值和第二大的值及其位置
        (minVal, maxVal, minLoc, maxLoc) = cv.minMaxLoc(_result)
        # print("findMax-%d name%s max:%s min:%s, maxLoc:" % (i, name, maxVal, minVal), maxLoc, "minLoc:", minLoc)
        temp = np.where(_result == maxVal)
        _result[temp] = 0
        maxVals.append([maxVal,maxLoc])
    return maxVals
