'''
Author: miaoju jun.miao@sinosun.com.cn
Date: 2023-06-30 14:42:46
LastEditors: miaoju jun.miao@sinosun.com.cn
LastEditTime: 2023-08-31 14:29:17
FilePath: /paperprintpy/PaperImage.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
'''
拍摄的纸纹图片
1、初始化图片
    paperImage = PaperImage(filePath,type)
        初始化：加载8位灰度图、识别二维码
    
2、裁剪指纹图
    paperImage.cutImgs(qrCodeWidth, cutWidth, cutHeight, padding)
        裁剪指纹图小图，围绕二维码裁剪上下左右四个矩形区域
        qrWidth: 透射变换配准的二维码边长标准
        cutWidth: 宽度(长的一边)
        cutHeight: 高度(短的一边)
        padding: 裁剪区域与二维码边的留白距离
3、指纹图预处理
    paperImage.preProcess()
    sobel、高斯模糊处理

通过paperImage对象可获取这些内容:
   type = 1    # 0 注册图， 1 核验图
    filePath = "" # 原始文件路径
    filename = "" # 文件名
    originImage = None # 原图（8位灰度图）
    cutShowImage = None # 透射变换后并画了裁剪区域边框的图，只做显示用
    cutImages = None # 裁剪的指纹图小图列表 上下左右的小图
    ppCutImages = None # (sobel X、Y轴都处理)已经预处理过的纸纹小图列表(sobel、高斯后的) 上下左右的小图
    ppCutImagesX = None # (sobel X轴处理)已经预处理过的纸纹小图列表(sobel、高斯后的) 上下左右的小图
    ppCutImagesY = None # (sobel Y轴处理)已经预处理过的纸纹小图列表(sobel、高斯后的) 上下左右的小图

    qrText = '' # 二维码内容
    qrPointsOrigin = None    # 原图的二维码顶点[左下、左上、右上、右下]
    qrPoints = None # 透视变换后的二维码顶点[左下、左上、右上、右下]
    qrWidthOrigin = None # 原图的二维码宽度
    qrWidth = None # 透射变换后的二维码宽度

    parseStatus = True # 二维码解析状态，在使用时应先判断状态是否“二维码解析成功”
'''
# ---- begin python 3.6.7 以上的版本，需要这样import其他目录的py文件
import sys
import os
dir_path = os.path.dirname(os.path.realpath(__file__))
parent_dir_path = os.path.abspath(os.path.join(dir_path, os.pardir))
sys.path.insert(0, parent_dir_path)
# ---- end python 3.6.7 以上的版本，需要这样import其他目录的py文件

import util
import QRCodeParser
import PreprocessImageTool
import numpy as np
import cv2 as cv
import copy
from numpy import mean
from QRCodePaperImage import QRCodePaperImage
from PylabShowTool import showImage
from collections import Counter
class QRCodePaperImage2(QRCodePaperImage):
    def __init__(self, filePath, type = 1):
        super().__init__(filePath, type)
        # print("QRCodePaperImage2 - __init__")
        return 

    # 计算裁剪图
    def calcCutImage(self, qrPoints, qrCodeWidth, cutWidth, cutHeight, padding):
        # 上下左右四个纸纹区
        allRects = super().calcCutImage(qrPoints, qrCodeWidth, cutWidth, cutHeight, padding)
        print("QRCodePaperImage2 - calcCutImage qrBlockWidth[%d]" %self.qrBlockWidth)
        
        # 裁剪回字的36条边
        imgRects1_upDown, imgRects1_leftRight, imgRects2_upDown, imgRects2_leftRight, imgRects3_upDown, imgRects3_leftRight = self.cut36Sides(qrPoints, qrCodeWidth, cutWidth, cutHeight, padding)
        allRects = np.concatenate((allRects, imgRects1_upDown, imgRects1_leftRight, imgRects2_upDown, imgRects2_leftRight, imgRects3_upDown, imgRects3_leftRight))

        # 这里返回的是 父类的上下左右四个纸纹区 + 三个回字的36条边
        return allRects

    # 裁剪3个回字的36条边 
    def cut36Sides(self, qrPoints, qrCodeWidth, cutWidth, cutHeight, padding):
        blockWidth = self.qrBlockWidth
        if cutWidth == -1:
            cutWidth = qrCodeWidth
        leftTopPoint = qrPoints[1] # 左上角
        leftBottomPoint = qrPoints[0]
        rightTopPoint = qrPoints[2]
        # 左上角回字的12条边
        imgRects1_upDown, imgRects1_leftRight = self.cutSideImgs(leftTopPoint, blockWidth)
        # 左下角返回的12条边
        imgRects2_upDown, imgRects2_leftRight = self.cutSideImgs([leftBottomPoint[0], leftBottomPoint[1] - np.int32(blockWidth * 7)], blockWidth)
        imgRects2_upDown = imgRects2_upDown[::-1] # 左下角回字的上下6条边顺序需要调整一下
        # 右上角返回的12条边
        imgRects3_upDown, imgRects3_leftRight  = self.cutSideImgs([rightTopPoint[0] - np.int32(blockWidth * 7), rightTopPoint[1]], blockWidth)
        imgRects3_leftRight = imgRects3_leftRight[::-1] # 右上角回字的左右6条边顺序调整一下
        return imgRects1_upDown, imgRects1_leftRight, imgRects2_upDown, imgRects2_leftRight, imgRects3_upDown, imgRects3_leftRight

    # 裁剪回字的12条边
    # ltPoint 回字的左上角
    # blockWidth 二维码block宽度
    def cutSideImgs(self, ltPoint, blockWidth):
        halfBlock = int(blockWidth/2)
        # 竖向的 11 ~ 16 6条边
        # 11
        imgRect11 = (ltPoint[0], ltPoint[1]-halfBlock, 7*blockWidth, blockWidth)
        # 12
        imgRect12 = (ltPoint[0] + blockWidth, ltPoint[1] + blockWidth-halfBlock, 5*blockWidth, blockWidth)

        # 13
        imgRect13 = (ltPoint[0] + 2*blockWidth, ltPoint[1] + 2*blockWidth-halfBlock, 3*blockWidth, blockWidth)

        # 14
        imgRect14 = (ltPoint[0] + 2*blockWidth, ltPoint[1] + 5*blockWidth-halfBlock, 3*blockWidth, blockWidth)

        # 15
        imgRect15 = (ltPoint[0] + blockWidth, ltPoint[1] + 6*blockWidth-halfBlock, 5*blockWidth, blockWidth)

        # 16
        imgRect16 = (ltPoint[0], ltPoint[1] + 7*blockWidth-halfBlock, 7*blockWidth, blockWidth)

        # 横向的 21 ~ 26 6条边
        # 21
        imgRect21 = (ltPoint[0]-halfBlock, ltPoint[1], blockWidth, 7*blockWidth)

        # 22
        imgRect22 = (ltPoint[0] + blockWidth - halfBlock, ltPoint[1] + blockWidth, blockWidth, 5*blockWidth)

        # 23
        imgRect23 = (ltPoint[0] + 2*blockWidth - halfBlock, ltPoint[1] + 2*blockWidth, blockWidth, 3*blockWidth)

        # 24
        imgRect24 = (ltPoint[0] + 5*blockWidth - halfBlock, ltPoint[1] + 2*blockWidth, blockWidth, 3*blockWidth)

        # 25
        imgRect25 = (ltPoint[0] + 6*blockWidth - halfBlock, ltPoint[1] + blockWidth, blockWidth, 5*blockWidth)

        # 26
        imgRect26 = (ltPoint[0] + 7*blockWidth - halfBlock, ltPoint[1], blockWidth, 7*blockWidth)
        return [imgRect11,imgRect12,imgRect13,imgRect14,imgRect15,imgRect16], [imgRect21,imgRect22,imgRect23,imgRect24,imgRect25,imgRect26]

    def calcCutImage4(self, qrCodeWidth,x=2,_y=0):
        self.qrWidth = qrCodeWidth
        # 计算二维码block宽度、裁剪图片padding
        qrBlockWidth, blockSize = QRCodeParser.calcBlockwidth(copy.deepcopy(self.warpImage), self.qrPoints, qrCodeWidth, self.qrShape)
        self.qrBlockWidth = qrBlockWidth
        leftTopPoint = self.qrPoints[1] # 左上角
        y = np.int32(qrBlockWidth/2) + 4
        # y = np.int32(6/2)
        line = self.warpImage[leftTopPoint[1] - y + _y: leftTopPoint[1] + y + _y, leftTopPoint[0] + x : leftTopPoint[0] + np.int32(qrBlockWidth * 7) - x]
        img = copy.deepcopy(self.warpImage)
        img = self.drawRect(img, leftTopPoint[0] + x, leftTopPoint[1] - y, np.int32(qrBlockWidth * 7) - 2*x, 2 * y)
        
        # line = cv.GaussianBlur(line, (3, 3), 1)
        line = makeDiffImg(line)
        middLine = findMiddleLine(line)
        # line = line[middLine - 2: middLine + 3,0:line.shape[1]]
        line = PreprocessImageTool.removeLight(line)
        line = line[middLine - 2:  middLine + 3,  0 : line.shape[1]-1]

        # line = self.warpImage[ leftTopPoint[1] - y + middLine - 2:  leftTopPoint[1] - y + middLine + 3,  leftTopPoint[0] + x : leftTopPoint[0] + np.int32(qrBlockWidth * 7) - x]

        img = self.drawRect(img, leftTopPoint[0] + x, leftTopPoint[1] - y, 4, 4)

        img = self.drawRect(img, leftTopPoint[0] + x, leftTopPoint[1] - y + middLine - 2, np.int32(qrBlockWidth * 7) - 2*x, 5)
        showImage(img, self.filename)

        return line

    def calcCutImage3(self, qrCodeWidth,x=2,_y=0):
        self.qrWidth = qrCodeWidth
        # 计算二维码block宽度、裁剪图片padding
        qrBlockWidth, blockSize = QRCodeParser.calcBlockwidth(copy.deepcopy(self.warpImage), self.qrPoints, qrCodeWidth, self.qrShape)
        self.qrBlockWidth = qrBlockWidth
        leftTopPoint = self.qrPoints[1] # 左上角
        y = np.int32(qrBlockWidth/2) + 4
        # y = np.int32(6/2)
        line = self.warpImage[leftTopPoint[1] - y + _y: leftTopPoint[1] + y + _y, leftTopPoint[0] + x : leftTopPoint[0] + np.int32(qrBlockWidth * 7) - x]
        img = copy.deepcopy(self.warpImage)
        img = self.drawRect(img, leftTopPoint[0] + x, leftTopPoint[1] - y, np.int32(qrBlockWidth * 7) - 2*x, 2 * y)
        line = makeDiffImg(line)

        maxLine = findMaxLine(line)
        # cv.drawContours(img, np.int32([[lt,rt,rb,lb]]), 0, (255, 0, 0), 1)
        contours = []
        for i in range(len(maxLine)):
            contours.append((leftTopPoint[0] + x + i, leftTopPoint[1] - y + maxLine[i]))
        cv.drawContours(img, np.int32([contours]), 0, (255, 0, 0), 1)

        # img = self.drawRect(img, leftTopPoint[0] + x, leftTopPoint[1] - y, 4, 4)

        # img = self.drawRect(img, leftTopPoint[0] + x, leftTopPoint[1] - y + middLine - 2, np.int32(qrBlockWidth * 7) - 2*x, 5)
        showImage(img, self.filename)

        return maxLine

# 计算图像的梯度图
def makeDiffImg(srcImg):
    h,w = srcImg.shape
    diffImg = np.zeros((h-1,w))
    for i in range(len(srcImg)):
        if i < len(srcImg) - 2:
            diff = abs(srcImg[i+1] - srcImg[i])
            diffImg[i] = diff
    return diffImg

# 找出梯度图中的中线
def findMiddleLine(srcImg):
    h,w = srcImg.shape
    maxX = np.argmax(srcImg, axis=0)
    counter = Counter(maxX)
    # 找出出现次数最多的数字
    most_common = counter.most_common(1)
    most_common_number = most_common[0][0]
    most_common_count = most_common[0][1]
    
    return most_common_number

def findMaxLine(srcImg):
    h,w = srcImg.shape
    maxX = np.argmax(srcImg, axis=0)
    return maxX