'''
Author: miaoju jun.miao@sinosun.com.cn
Date: 2023-06-30 14:42:46
LastEditors: miaoju jun.miao@sinosun.com.cn
LastEditTime: 2023-09-04 13:25:01
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
import math
class QRCodePaperImage3(QRCodePaperImage):
    def __init__(self, filePath, type = 1):
        super().__init__(filePath, type)
        # print("QRCodePaperImage2 - __init__")
        return 

    blockGridSize = None # 每个block分几个格子
    blockGridWidth = 3 # 每个block内部的小格子像素宽度
    # 重写父类的注册图orb配准逻辑
    # 1、注册图先二维码校正
    # 2、校正后计算blockWidth，并取整
    # 3、根据取整后的blockWidth再将注册图进行resize，保证最后使用的二维码blockWidth为整数，便于后续裁图时保证每个block是完整的
    # @override
    def alginByORBRegImg(self, qrPointsOrigin, qrCodeWidth, baseImg = None):
        currentImg = self.originImage
        targetPoints = qrPointsOrigin
        # 先将注册图进行二维码校正
        warpImage, targetPoints = self.imageWarp(currentImg, targetPoints, qrCodeWidth)
        # 按block内部grid计算并resize校正后的图片
        warpImage, targetPoints, qrCodeWidth, self.blockSize, gridSize = self.calucGridBlockAndResize(warpImage, targetPoints, qrCodeWidth, self.qrShape)

        self.qrShape = (self.blockSize,self.blockSize)
        self.blockGridSize = gridSize
        return warpImage, targetPoints, qrCodeWidth

    # 重写父类的二维码配准逻辑
    # 1、先二维码校正
    # 2、校正后计算blockWidth，并取整
    # 3、根据取整后的blockWidth再将注册图进行resize，保证最后使用的二维码blockWidth为整数，便于后续裁图时保证每个block是完整的
    # @override
    def alginByQRCode(self, qrCodeWidth):
        warpImage, targetPoints = self.imageWarp(self.originImage, self.qrPointsOrigin, qrCodeWidth)
        # 按block内部grid计算并resize校正后的图片
        warpImage, targetPoints, qrCodeWidth, blockSize, gridSize = self.calucGridBlockAndResize(warpImage, targetPoints, qrCodeWidth, self.qrShape)
        if self.qrShape is None or self.qrShape == ():
            self.qrShape = (blockSize, blockSize)
        # 计算二维码blockwidth、blockSize
        self.qrBlockWidth, self.blockSize = self.calcQRCodeBlockwidth(warpImage, targetPoints, qrCodeWidth, self.qrShape)
        self.warpImage = warpImage
        self.qrWidth = qrCodeWidth
        self.qrPoints = targetPoints
        self.blockGridSize = gridSize
        return

    # 按block内部grid计算并resize校正后的图片
    def calucGridBlockAndResize(self,warpImage, qrPoints, qrCodeWidth, qrShape):
        # 计算blockWidth、blockSize
        targetPoints = qrPoints
        blockWidthFloat, blockSize = QRCodeParser.calcBlockwidth(warpImage, qrPoints, qrCodeWidth, qrShape)
        gridSize = math.floor(blockWidthFloat / self.blockGridWidth) # 每个block分几宫格
        # blockWidth 向下取整，重新计算、resize
        blockWidthInt = gridSize * self.blockGridWidth # 计算新的block宽度

        newQrCodeWidth = blockWidthInt * blockSize
        # resize注册图校正后的warpImage
        if newQrCodeWidth != qrCodeWidth:
            ratio = newQrCodeWidth / qrCodeWidth
            warpImage = cv.resize(warpImage, (0, 0), fx=ratio, fy=ratio)
            # 重新计算二维码顶点
            self.qrText, points, qrShape = QRCodeParser.parseQrCodeImage(warpImage)
            if qrShape != None and qrShape != (): # 如果能扫码识别出qrShape，就用识别出来的，更靠谱
                blockSize = qrShape[0]
            targetPoints = self.adjustPoints(points[0])
        return warpImage, targetPoints, newQrCodeWidth, blockSize, gridSize

        
    # 计算裁剪图
    def calcCutImage(self, qrPoints, qrCodeWidth, cutWidth, cutHeight, padding):

        # smallCodeImg = self.warpImage[qrPoints[1][1] : qrPoints[0][1], qrPoints[1][0] : qrPoints[2][0]]
        # thImg = self.imgThd(smallCodeImg)
        # showImage(thImg,"thImg - smallCodeImg")

        # 上下左右四个纸纹区
        allRects = super().calcCutImage(qrPoints, qrCodeWidth, cutWidth, cutHeight, padding)
        print("QRCodePaperImage2 - calcCutImage qrBlockWidth[%d]" %self.qrBlockWidth)

        # 裁剪标准二维码区域
        qrCodeRect = [(qrPoints[1][0], qrPoints[1][1], qrCodeWidth, qrCodeWidth)]
        allRects = np.concatenate((allRects, qrCodeRect))

        leftTop = qrPoints[1]
        blockWidth = np.int32(self.qrBlockWidth)
        blockGridWidth = self.blockGridWidth

        smallCodeImg = self.warpImage[qrPoints[1][1] : qrPoints[1][1] + qrCodeWidth, qrPoints[1][0] : qrPoints[1][0] + qrCodeWidth]
        # thImg = self.imgThd(smallCodeImg)
        # showImage(thImg,"thImg")

        # 将二维码整图分四块区域来二值化
        thImg = self.imgThdByGrid(smallCodeImg)
        showImage(thImg,"thImg")

        # 计算每个block的黑白值, 显示的结果应该是标准的二维码图
        statusImg = np.zeros((self.blockSize, self.blockSize), dtype=np.int16)
        for i in range(self.blockSize):
            for j in range(self.blockSize):
                rectImg = thImg[0 + i*blockWidth : 0 + i*blockWidth + blockWidth, 0 + j*blockWidth : 0 + j*blockWidth + blockWidth]
                status = self.blockStatus(rectImg)
                statusImg[i][j] = status
        showImage(statusImg,"statusImg")

        # 计算每个block中每个宫格的黑白
        statusImg2 = np.zeros((self.blockSize*self.blockGridSize, self.blockSize*self.blockGridSize), dtype=np.int16)
        for i in range(self.blockSize * self.blockGridSize):
            for j in range(self.blockSize * self.blockGridSize):
                # 左上角X，左上角Y，width，height
                rectImg = thImg[0 + i*blockGridWidth : 0 + i*blockGridWidth + blockGridWidth, 0 + j*blockGridWidth : 0 + j*blockGridWidth + blockGridWidth]
                status = self.blockRealStatus(rectImg,statusImg[np.int16(i/self.blockGridSize)][np.int16(j/self.blockGridSize)])
                statusImg2[i][j] = status
        showImage(statusImg2,"statusImg2")

        for i in range(self.blockSize * self.blockGridSize):
            for j in range(self.blockSize * self.blockGridSize):
                # 左上角X，左上角Y，width，height
                rect = [(leftTop[0] + j*blockGridWidth, leftTop[1] + i*blockGridWidth, blockGridWidth, blockGridWidth)]
                allRects = np.concatenate((allRects, rect))

        # 这里返回的是 父类的上下左右四个纸纹区 + 所有的block宫格
        return allRects

    # 将原图分4块来二值化, 减少因为光照阴影不均匀对整体二值化的影响
    def imgThdByGrid(self, img, gridSize=2):
        pass
        h,w = img.shape
        gridWidth = np.int16(h / gridSize)
        imgGrid1 = img[0:gridWidth, 0:gridWidth]
        imgGrid2 = img[0:gridWidth, gridWidth:gridWidth*2]
        imgGrid3 = img[gridWidth:gridWidth*2, 0:gridWidth]
        imgGrid4 = img[gridWidth:gridWidth*2, gridWidth:gridWidth*2]

        imgGrid1Thd = self.imgThd(imgGrid1)
        imgGrid2Thd = self.imgThd(imgGrid2)
        imgGrid3Thd = self.imgThd(imgGrid3)
        imgGrid4Thd = self.imgThd(imgGrid4)
        imgX1 = np.concatenate((imgGrid1Thd, imgGrid2Thd), axis=1)
        imgX2 = np.concatenate((imgGrid3Thd, imgGrid4Thd), axis=1)
        retImg = np.concatenate((imgX1, imgX2), axis=0)
        return retImg

    '''
    t : 二值化的阈值；
    g = min(gray);
    t_new = g + (t - g) * x
    x 是个介于0 到 1之间的数，当等于1的时候，就是用原阈值
    这个阈值到底取多少，要测试得出一个经验值。我现在取的是90%或者95%
    '''
    def imgThd(self,img):
        _img = copy.deepcopy(img)
        _img = np.uint16(img)
        ret, thresh = cv.threshold(_img, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)
        return thresh

        # 指纹图预处理
    def preProcess(self):
        self.ppCutImages = PreprocessImageTool.preProcessBatching(self.cutImages, direction = 'xy')
        qrCodeImg = self.cutImages[4] # 二维码图
        return self.ppCutImages

    # 判断block是 黑0 还是 白 1
    def blockStatus(self, blockImg):
        h,w = blockImg.shape
        qrcode_array = np.array(blockImg)
        avg = np.mean(qrcode_array)
        return 0 if avg < 128 else 1

    # 判断block中小宫格的黑白状态
    # blockHalfImg 像素矩阵
    # originStatus 原始的黑0 还是 白1 状态
    # return 黑0 还是 白1， 如果原始是黑的，只要其中有白色点，就返回白色1
    def blockRealStatus(self, blockHalfImg, originStatus):
        qrcode_array = np.array(blockHalfImg)
        avg = np.mean(qrcode_array)
        if originStatus == 0:
            return  0 if avg == 0 else 1
        if originStatus == 1:
            return  1 if avg == 255 else 0