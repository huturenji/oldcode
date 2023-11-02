'''
图片对比
'''

import cv2 as cv
import copy
import numpy as np
from QRCodePaperImage import QRCodePaperImage
import params as params
from numpy import mean
from DertImage import DertImage
class ImageCompare:
    regImage : QRCodePaperImage = None # 注册图 J0 小黑屋+闪光灯
    verifiImg : QRCodePaperImage = None # 核验图 J2 环境光+闪光灯
    verifiJ1Img : QRCodePaperImage = None # 核验图 J1 环境光
    dertImage : DertImage = None # dertJ，J2-J1的差图，理论差图为 纯黑+闪光灯

    trueResults = None # 相同区域比较结果
    falseResults = None # 不同区域比对结果
    notSameIndex = None # 不同区域比对结果 的序号
    minTrueResult = None # 相同区域最小结果
    avgTrueResult = None # 相同区域平均结果
    maxFalseResult = None # 不同区域最大值
    spanResult = None # 相同区域最小值 - 不同区域最大值
    showTrueResults = '' # 显示结果
    showFlaseResults = '' # 显示结果

    #  begin 如果启用J1、差图计算，这些会用到
    trueResultsDertImg = None # 相同区域比较结果
    falseResultsDertImg = None # 不同区域比对结果
    # notSameIndexDertImg = None # 不同区域比对结果 的序号
    minTrueResultDertImg = None # 相同区域最小结果
    avgTrueResultDertImg = None # 相同区域平均结果
    maxFalseResultDertImg = None # 不同区域最大值
    spanResultDertImg = None # 相同区域最小值 - 不同区域最大值
    showTrueResultsDertImg = '' # 显示结果
    showFlaseResultsDertImg = '' # 显示结果
    #  end 如果启用J1、差图计算，这些会用到

    def __init__(self,imgFile1,imgFile2):
        self.regImage = QRCodePaperImage(imgFile1, 0)
        self.verifiImg = QRCodePaperImage(imgFile2, 1)

    # 使用差图计算，默认
    def useDertImage(self, j1ImagePath):
        self.verifiJ1Img = QRCodePaperImage(j1ImagePath, 2)
        self.dertImage = DertImage(self.verifiImg, self.verifiJ1Img)

    # 是否同一个标签纸(暂时以二维码内容是否相同为准)
    def isSame(self):
        return self.regImage.qrText == self.verifiImg.qrText

    # 是否有二维码识别异常true 有异常，false 无异常
    def isParseQRCodeException(self):
        return (self.regImage.parseStatus and self.verifiImg.parseStatus) is False

    # 比对结果是否有异常 true 有异常，false 无异常
    def isResultException(self):
        return ((min(self.trueResults) <= params.EXCEPITON_MIN_TRUE) or (max(self.falseResults) >= params.EXCEPITON_MAX_FALSE) or (self.spanResult <= params.EXCEPITON_SPAN))

    # 返回上、下、左、右、上下、下上、左右、右左的相关系数值
    def compare(self, qrCodeWidth):
        regQrCodeWidth = self.regImage.qrWidthOrigin
        verifiQrCodeWidth = self.verifiImg.qrWidthOrigin
        minQrCodeWidth = min(regQrCodeWidth, verifiQrCodeWidth)
        # 计算配准的二维码宽度标准(-1表示以注册图、核验图中小的为准；如果指定数值小于注册图、核验图最小宽度，则以指定数值为准)
        if qrCodeWidth == -1 or qrCodeWidth > minQrCodeWidth:
            qrCodeWidth = minQrCodeWidth
        else:
            qrCodeWidth = qrCodeWidth

        # print("regQrCodeWidth[%d], verifiQrCodeWidth[%d], usr qrCodeWidth[%d]" %(regQrCodeWidth, verifiQrCodeWidth, qrCodeWidth))

        # 以qrCodeWidth配准后裁剪指纹图
        self.algin(qrCodeWidth)

        # 裁图
        regImages, verifiImages = self.cutImgs(qrCodeWidth)

        # 比较 核验图（J2）与注册图
        maxSame, maxNotSame, minTrue, avgTrue, maxFalse, showTrueResults, showFlaseResults = self.calc(self.regImage, self.verifiImg)
        self.trueResults = maxSame
        self.falseResults = maxNotSame
        self.minTrueResult = minTrue # 相同区域最小结果
        self.avgTrueResult = avgTrue # 相同区域平均结果
        self.maxFalseResult = maxFalse # 不同区域最大值
        self.showTrueResults = showTrueResults
        self.showFlaseResults = showFlaseResults
        self.spanResult = np.around(minTrue - maxFalse, decimals = 3) # 相同区域最小值 - 不同区域最大值

        if self.dertImage == None:
            return  maxSame, maxNotSame, [], []

        # 比较 差图 dertImg（J2 - J1）与注册图
        maxSame, maxNotSame, minTrue, avgTrue, maxFalse, showTrueResults, showFlaseResults = self.calc(self.regImage, self.dertImage)
        self.trueResultsDertImg = maxSame
        self.falseResultsDertImg = maxNotSame
        self.minTrueResultDertImg = minTrue # 相同区域最小结果
        self.avgTrueResultDertImg = avgTrue # 相同区域平均结果
        self.maxFalseResultDertImg = maxFalse # 不同区域最大值
        self.showTrueResultsDertImg = showTrueResults
        self.showFlaseResultsDertImg = showFlaseResults
        self.spanResultDertImg = np.around(minTrue - maxFalse, decimals = 3) # 相同区域最小值 - 不同区域最大值

        return self.trueResults, self.falseResults, self.trueResultsDertImg, self.falseResultsDertImg

    # 配准
    def algin(self, qrCodeWidth):
        # 配置了强制使用二维码配准，或者注册图和核验图二维码内容不一致
        if params.QRCODE_ALGIN_FORCE or not self.isSame():
            self.regImage.alginByQRCode(qrCodeWidth) # 透射变换校正
            self.verifiImg.alginByQRCode(qrCodeWidth) # 透射变换校正

            if self.verifiJ1Img is not None:
                self.verifiJ1Img.alginByQRCode(qrCodeWidth)
            return

        # 否则ORB配准，1、注册图自身二维码校正，2、核验图对照校正后的注册图做ORB配准
        self.regImage.alginByORB(self.regImage.qrPointsOrigin, qrCodeWidth)
        # 核验图orb配准，以注册图的qrPoints、qrWidth、warpImage为基准参考
        self.verifiImg.alginByORB(self.regImage.qrPoints, self.regImage.qrWidth, copy.deepcopy(self.regImage.warpImage))
        if self.verifiJ1Img is not None:
            self.verifiJ1Img.alginByORB(self.regImage.qrPoints, self.regImage.qrWidth, copy.deepcopy(self.regImage.warpImage))
        return

    # 裁图
    def cutImgs(self, qrCodeWidth):
        regImages = self.regImage.cutImgs(params.CUT_SIZE[1], params.CUT_SIZE[2], params.CUT_SIZE[0]) # 裁剪4个纸纹图片
        verifiImages = self.verifiImg.cutImgs(params.CUT_SIZE[1], params.CUT_SIZE[2], params.CUT_SIZE[0]) # 裁剪4个纸纹图片

        if self.dertImage is not None:
            self.verifiJ1Img.cutImgs(params.CUT_SIZE[1], params.CUT_SIZE[2], params.CUT_SIZE[0]) # 裁剪4个纸纹图片
            self.dertImage.cutImgs()
        return regImages, verifiImages

    # 对已经裁剪好的注册图、核验图纸纹图进行处理、计算
    def calc(self, regImage: QRCodePaperImage, verifiImg: QRCodePaperImage):
        regImages = regImage.preProcess()  # 对4个纸纹图片进行图像处理
        verifiImages = verifiImg.preProcess()  # 对4个纸纹图片进行图像处理

        # SOBEL_CALC_AVG ture 将sobel x、y分别计算相关性后取平均值
        if params.SOBEL_CALC_AVG :
            regImagesX = regImage.preProcessX()
            verifiImagesX = verifiImg.preProcessX()
            sameX, notSameX, self.notSameIndex = batchingCompareImgs(regImagesX, verifiImagesX)

            regImagesY = regImage.preProcessY()
            verifiImagesY = verifiImg.preProcessY()
            sameY, notSameY, self.notSameIndex = batchingCompareImgs(regImagesY, verifiImagesY)

            maxSame = []
            for i in range(len(sameX)) :
                maxSame.append(avgValue(sameX[i], sameY[i]))
            maxNotSame = []
            for i in range(len(notSameX)) :
                maxNotSame.append(avgValue(notSameX[i], notSameY[i]))

        else : #false 为sobelx、y后再直接计算相关性
            maxSame, maxNotSame, self.notSameIndex = batchingCompareImgs(regImages, verifiImages)

        avgTrue = mean(maxSame)
        minTrue = min(maxSame)
        maxFalse = max(maxNotSame)
        showTrueResults = ''
        showFlaseResults = ''
        for i in range(len(maxSame)) :
             showTrueResults += "%d-%d[%.3f], "%(i+1,i+1,maxSame[i])
        showTrueResults += "avgTrue[%.3f], minTrue[%.3f], maxFalse[%.3f], span[%.3f]"%(avgTrue, minTrue, maxFalse, (minTrue - maxFalse))

        # for i in range(len(regImages)):
        #     for j in range(len(verifiImages)):
        #         if i != j :
        #             showFlaseResults += "%d-%d[%.3f], "%(i+1,j+1, maxNotSame[len(regImages) * i + j - (i + 1)])
        for i in range(len(maxNotSame)) :
             showFlaseResults += "%s[%.3f], "%(self.notSameIndex[i], maxNotSame[i])

        # 真图(相同位置)、假图（不同位置）
        return maxSame, maxNotSame, minTrue, avgTrue, maxFalse, showTrueResults, showFlaseResults

# 找出前N个最大的数
def findMax(result, size=10): 
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
    result = cv.matchTemplate(image, template, cv.TM_CCOEFF_NORMED)

    # 查找互相关最高的值和位置,前10位
    maxVals = findMax(result)
    return maxVals

# 从srcImage中裁剪去掉周围MATCH_POSITION像素大小的小图
def cutVerifiImages(srcImage) :
    h,w = srcImage.shape[:2]
    # 待核验纸纹图片区域大小
    rectImg = srcImage[params.MATCH_POSITION : (h - params.MATCH_POSITION), params.MATCH_POSITION : (w - params.MATCH_POSITION)]
    return rectImg

# 图片对比
def compareImg(img1, img2):
    # 如果img2的矩阵和img1不是一个方向，先调整为同一个方向再开始比对
    shape1 = img1.shape
    shape2 = img2.shape
    if (shape1[0] > shape1[1] and shape2[0] < shape2[1]) or  (shape1[0] < shape1[1] and shape2[0] > shape2[1]):
        img2 = np.reshape(img2, (shape2[1], shape2[0]))

    # 1、注册图、核验图一样大直接比较，img1、img2都会往内缩小裁剪MATCH_POSITION一圈的像素，此时_img1与_img2大小一样，模板匹配只会比较一次
    _img1 = cutVerifiImages(img1)
    _img2 = cutVerifiImages(img2)
    maxVals1 = calcCCOEFF(_img2, _img1)
    # 最大相关系数和位置
    max1,max1Loc = maxVals1[0]
    # 2、如果按1比较之后最大相关系数在RECALCULATE_THRESHOLD【0.2, 0.5】的阈值范围内，需要将核验图在注册图内做平移模板匹配，抵消配准带来的偏差
    if max1 > params.RECALCULATE_THRESHOLD[0] and max1 < params.RECALCULATE_THRESHOLD[1] :
        # 此事传入的img2是没有往内缩小的图，比_img1大一圈，_img1在img2中进行模板匹配会计算多次，取最大值
        maxVals1 = calcCCOEFF(img2, _img1)
        max1,max1Loc = maxVals1[0]

    # return "%.3f" %max1
    return np.around(max1,decimals = 3)

def batchingCompareImgs(regImages, verifiImages):
    regImages = regImages[:4]
    verifiImages = verifiImages[:4]
    same = []
    notSame = []
    notSameIndex = []
    for i in range(len(regImages)):
        for j in range(len(verifiImages)):
            if i == j :
                same.append(compareImg(regImages[i],verifiImages[j]))
            else :
                notSame.append(compareImg(regImages[i],verifiImages[j]))
                notSameIndex.append("%d-%d"%(i+1,j+1))

    return same, notSame, notSameIndex

# 计算两个数的平均数，保留小数点2位
def avgValue(v1,v2):
    return np.around((v1 + v2 )/ 2, decimals = 3)