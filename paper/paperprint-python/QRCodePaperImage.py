'''
Author: miaoju jun.miao@sinosun.com.cn
Date: 2023-06-30 14:42:46
LastEditors: miaoju jun.miao@sinosun.com.cn
LastEditTime: 2023-09-04 11:12:57
FilePath: /paperprintpy/PaperImage.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
'''
拍摄的纸纹图片
1、初始化图片
    paperImage = PaperImage(filePath,type)
        初始化：加载8位灰度图、识别二维码
    
2、裁剪指纹图
    paperImage.cutImgs(cutWidth, cutHeight, padding)
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
import util
import QRCodeParser
import PreprocessImageTool
import numpy as np
import cv2 as cv
import copy
from numpy import mean
from PylabShowTool import showImage
import math
import params
class QRCodePaperImage:
    # J0 一般是纯黑环境+闪光灯拍摄， J2 环境光+闪光灯 拍摄， J1 环境光拍摄
    type = 1    # 0 注册图（J0）， 1 核验图（J2），2 核验图（J1，默认不用J1）
    filePath = "" # 原始文件路径
    filename = "" # 文件名

    # 从图片tiff信息中读取iso和曝光时间，用于后续计算差图DertImage
    tiffISO = None # tiff信息 ISO快门速度
    tiffExposureTime = None # tiff信息 曝光时间

    originImageOld = None # 原图（灰度图）
    originImage = None # 原图 以二维码中心裁剪出来足够区域作为后续计算的图片（灰度图）

    warpImage = None # 配准后的图片

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
    
    qrBlockWidth = None # 透射变换校正后的二维码block大小
    blockSize = None # 二维码每一行的block个数
    qrShape = None # 二维码block个数，如(21,21)

    qrCodeCenterPointOrigin = None # 原图的二维码中心点

    parseStatus = True # 二维码解析状态，在使用时应先判断状态是否“二维码解析成功”

    def __init__(self, filePath, type = 1):
        self.filePath = filePath
        self.type = type
        # 截取文件名
        strs = self.filePath.split("/")
        self.filename = strs[len(strs)-1]
        self.init()

    # 初始化：加载8位灰度图、识别二维码
    def init(self):
        # 加载为灰度图
        self.originImageOld = util.loadPaperImage(self.filePath, gray=True, downSample=False)
        # 读取tiff图片 iso、曝光时间，用于后续的差图计算
        self.tiffISO, self.tiffExposureTime = util.getExifInfo(self.filePath, tags = ['Image ISOSpeedRatings','Image ExposureTime'])

        self.parseQRCodeInfo(self.originImageOld)
        if self.parseStatus:
            smallImg = self.getSmallImage(self.originImageOld, self.qrWidthOrigin, self.qrCodeCenterPointOrigin) # 以二维码中心、边长，裁剪出足够大的图片作为后续计算用的原图
            if smallImg is None:
                self.originImage = self.originImageOld
            else:
                self.originImage = smallImg
                # 裁小图后重新获取二维码信息
                self.parseQRCodeInfo(self.originImage)

    # 计算二维码中心点
    def calcuQrCodeCenterPoint(self,points):
        # 算法1：二维码左下角与右上角对角线的坐标中心，认为是二维码中心
        x = np.int32((points[0][0] + points[2][0]) / 2)
        y = np.int32((points[0][1] + points[2][1]) / 2)

        # 算法2：根据二维码左下角与右上角对角线，左上角与右下角对角线 的相交点作为二维码中心点
        # TODO
        # 暂时以为二维码右下角可能误差较大一些，会导致算法2可能不太准确，故先以算法1为主
        return [x,y]

    # 计算二维码边长
    def calcuQrCodeWidth(self,points): 
        # NORM_L2 欧式距离即两点之间直线距离
        width1 = cv.norm((points[1][0],points[1][1]), (points[2][0],points[2][1]), cv.NORM_L2) # 左上-右上 边长
        width2 = cv.norm((points[1][0],points[1][1]), (points[0][0],points[0][1]), cv.NORM_L2) # 左上-左下 边长
        width3 = cv.norm((points[2][0], points[2][1]), (points[3][0], points[3][1]), cv.NORM_L2) # 右上-右下 边长
        width4 = cv.norm((points[0][0],points[0][1]), (points[3][0], points[3][1]), cv.NORM_L2) # 左下-右下 边长
        # 边长取最大的？最小的？取平均值？暂取平均值
        return np.int32(mean([width1, width2, width3, width4]))

    # 识别二维码, 获二维码内容、四个顶点、以及二维码宽度
    def parseQRCodeInfo(self, image):
        # 识别二维码, 获二维码内容、四个顶点、以及二维码宽度
        qrText, points, qrShape = QRCodeParser.parseQrCodeImage(image)
        # 二维码没识别出来，标记失败状态
        if (qrText == "" or len(points) <= 0):
            self.parseStatus = False
            return
        self.qrText = qrText
        self.qrPointsOrigin = points[0]
        self.qrShape = qrShape
        self.qrWidthOrigin = self.calcuQrCodeWidth(self.qrPointsOrigin) # 计算二维码边长
        self.qrCodeCenterPointOrigin = self.calcuQrCodeCenterPoint(self.qrPointsOrigin) # 计算二维码中心点

    # 以二维码中心、边长，裁剪出足够大的图片作为后续计算用的原图
    def getSmallImage(self, originImage, qrWidth, centerPoint):
        halfWidth = np.int32(qrWidth)
        # 如果二维码与原图边缘距离不够半个二维码宽度，则不裁剪，使用原图
        if centerPoint[1] - halfWidth > 0 and centerPoint[0] - halfWidth > 0:
            smallImg = originImage[(centerPoint[1] - halfWidth) : (centerPoint[1] + halfWidth), (centerPoint[0] - halfWidth) : (centerPoint[0] + halfWidth)]
            return smallImg
        else:
            return None

    # ORB 配准时注册图的处理（基准图） 
    # 1、注册图先自己用二维码进行校正
    def alginByORBRegImg(self, qrPointsOrigin, qrCodeWidth, baseImg = None):
        currentImg = self.originImage
        # 二维码不校正情况下，计算出二维码4个顶点在实际原图上的顶点排序【左下角、左上角、右上角、右下角】
        # targetPoints = self.adjustPoints(qrPointsOrigin)
        targetPoints = qrPointsOrigin
        # 先将注册图进行二维码校正
        warpImage, targetPoints = self.imageWarp(currentImg, targetPoints, qrCodeWidth)
        return warpImage, targetPoints, qrCodeWidth

# ORB 配准时核验图的配置逻辑，以传入的注册图为基本进行orb配准
    def alginByORBVerifiImg2(self, qrPointsOrigin, qrCodeWidth, baseImg = None):
        currentImg = self.originImage
        # 二维码不校正情况下，计算出二维码4个顶点在实际原图上的顶点排序【左下角、左上角、右上角、右下角】
        targetPoints = self.adjustPoints(qrPointsOrigin)
        # 以baseImg做orb配准
        #使用ORB算法检测关键点和计算描述符
        # 归一化
        currentImg = cv.normalize(currentImg, None, 0, 255, cv.NORM_MINMAX).astype('uint8')
        baseImg = cv.normalize(baseImg, None, 0, 255, cv.NORM_MINMAX).astype('uint8')
        orb = cv.ORB_create(2000, scaleFactor=1.4, nlevels=10)
        # 创建与图像相同大小的空白蒙版
        mask = np.zeros(currentImg.shape[:2], dtype=np.uint8)
        m1 = mask.copy()
        m2 = mask.copy()
        m3 = mask.copy()
        m4 = mask.copy()
        a1,a2,a3,a4 = self.calucKeyPointsArea(currentImg,self.qrPointsOrigin,self.qrWidthOrigin)
        cv.fillPoly(m1, [np.array(a1)], 255)
        cv.fillPoly(m2, [np.array(a2)], 255)
        cv.fillPoly(m3, [np.array(a3)], 255)
        cv.fillPoly(m4, [np.array(a4)], 255)
        kp11, des11 = orb.detectAndCompute(currentImg, m1)
        kp12, des12 = orb.detectAndCompute(currentImg, m2)
        kp13, des13 = orb.detectAndCompute(currentImg, m3)
        kp14, des14 = orb.detectAndCompute(currentImg, m4)
        image_with_keypoints = cv.drawKeypoints(currentImg, kp11, None, color=(0, 255, 0), flags=cv.DRAW_MATCHES_FLAGS_NOT_DRAW_SINGLE_POINTS)
        image_with_keypoints = cv.drawKeypoints(image_with_keypoints, kp12, None, color=(0, 255, 0), flags=cv.DRAW_MATCHES_FLAGS_NOT_DRAW_SINGLE_POINTS)
        image_with_keypoints = cv.drawKeypoints(image_with_keypoints, kp13, None, color=(0, 255, 0), flags=cv.DRAW_MATCHES_FLAGS_NOT_DRAW_SINGLE_POINTS)
        image_with_keypoints = cv.drawKeypoints(image_with_keypoints, kp14, None, color=(0, 255, 0), flags=cv.DRAW_MATCHES_FLAGS_NOT_DRAW_SINGLE_POINTS)
        # showImage(image_with_keypoints, "image_with_keypointsVerifi")

        kp1 = kp11 + kp12 + kp13 + kp14
        des1 = np.concatenate((des11,des12,des13,des14))

        mask = np.zeros(baseImg.shape[:2], dtype=np.uint8)
        m1 = mask.copy()
        m2 = mask.copy()
        m3 = mask.copy()
        m4 = mask.copy()
        a1,a2,a3,a4 = self.calucKeyPointsArea(baseImg,qrPointsOrigin, qrCodeWidth)
        cv.fillPoly(m1, [np.array(a1)], 255)
        cv.fillPoly(m2, [np.array(a2)], 255)
        cv.fillPoly(m3, [np.array(a3)], 255)
        cv.fillPoly(m4, [np.array(a4)], 255)
        kp11, des11 = orb.detectAndCompute(baseImg, m1)
        kp12, des12 = orb.detectAndCompute(baseImg, m2)
        kp13, des13 = orb.detectAndCompute(baseImg, m3)
        kp14, des14 = orb.detectAndCompute(baseImg, m4)
        image_with_keypoints = cv.drawKeypoints(baseImg, kp11, None, color=(0, 255, 0), flags=cv.DRAW_MATCHES_FLAGS_NOT_DRAW_SINGLE_POINTS)
        image_with_keypoints = cv.drawKeypoints(image_with_keypoints, kp12, None, color=(0, 255, 0), flags=cv.DRAW_MATCHES_FLAGS_NOT_DRAW_SINGLE_POINTS)
        image_with_keypoints = cv.drawKeypoints(image_with_keypoints, kp13, None, color=(0, 255, 0), flags=cv.DRAW_MATCHES_FLAGS_NOT_DRAW_SINGLE_POINTS)
        image_with_keypoints = cv.drawKeypoints(image_with_keypoints, kp14, None, color=(0, 255, 0), flags=cv.DRAW_MATCHES_FLAGS_NOT_DRAW_SINGLE_POINTS)
        # showImage(image_with_keypoints, "image_with_keypointsReg")

        kp2 = kp11 + kp12 + kp13 + kp14
        des2 = np.concatenate((des11,des12,des13,des14))

        # 使用暴力匹配算法进行特征点匹配
        bf = cv.BFMatcher(cv.NORM_HAMMING, crossCheck=True)
        matches = bf.match(des1, des2)
        # 显示关键点匹配效果图，测试用
        # result = cv.drawMatches(util.img2U8(self.originImage), kp1, util.img2U8(baseImg), kp2, matches, None, flags=cv.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS)
        # showImage(result, "drawMatches")

        # 提取好的匹配对的关键点
        src_pts = [kp1[m.queryIdx].pt for m in matches]
        dst_pts = [kp2[m.trainIdx].pt for m in matches]
        # 估计单应性矩阵
        M, mask = cv.findHomography(np.float32(src_pts), np.float32(dst_pts), cv.RANSAC)
        # 将当前图像配准到基准图像
        warpImage = cv.warpPerspective( self.originImage, M, (baseImg.shape[1], baseImg.shape[0]))
        return warpImage, targetPoints, qrCodeWidth

    def alginByORBVerifiImg(self, qrPointsOrigin, qrCodeWidth, baseImg = None):
        currentImg = self.originImage
        # 二维码不校正情况下，计算出二维码4个顶点在实际原图上的顶点排序【左下角、左上角、右上角、右下角】
        targetPoints = self.adjustPoints(qrPointsOrigin)
        # 以baseImg做orb配准
        #使用ORB算法检测关键点和计算描述符
        # 归一化
        currentImg = cv.normalize(currentImg, None, 0, 255, cv.NORM_MINMAX).astype('uint8')
        baseImg = cv.normalize(baseImg, None, 0, 255, cv.NORM_MINMAX).astype('uint8')
        orb = cv.ORB_create(2000, scaleFactor=1.4, nlevels=10)
        # 创建与图像相同大小的空白蒙版
        mask = np.zeros(currentImg.shape[:2], dtype=np.uint8)
        cv.fillPoly(mask, [np.array(self.qrPointsOrigin)], 255)
        kp1, des1 = orb.detectAndCompute(currentImg, mask)
        image_with_keypoints = cv.drawKeypoints(currentImg, kp1, None, color=(0, 255, 0), flags=cv.DRAW_MATCHES_FLAGS_NOT_DRAW_SINGLE_POINTS)
        # showImage(image_with_keypoints, "image_with_keypointsVerifi")
        
        mask = np.zeros(baseImg.shape[:2], dtype=np.uint8)
        cv.fillPoly(mask, [np.array(qrPointsOrigin)], 255)
        kp2, des2 = orb.detectAndCompute(baseImg, mask)
        image_with_keypoints = cv.drawKeypoints(baseImg, kp2, None, color=(0, 255, 0), flags=cv.DRAW_MATCHES_FLAGS_NOT_DRAW_SINGLE_POINTS)
        # showImage(image_with_keypoints, "image_with_keypointsReg")

        # 使用暴力匹配算法进行特征点匹配
        bf = cv.BFMatcher(cv.NORM_HAMMING, crossCheck=True)
        matches = bf.match(des1, des2)
        # 显示关键点匹配效果图，测试用
        # result = cv.drawMatches(util.img2U8(self.originImage), kp1, util.img2U8(baseImg), kp2, matches, None, flags=cv.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS)
        # showImage(result, "drawMatches")

        # 提取好的匹配对的关键点
        src_pts = [kp1[m.queryIdx].pt for m in matches]
        dst_pts = [kp2[m.trainIdx].pt for m in matches]
        # 估计单应性矩阵
        M, mask = cv.findHomography(np.float32(src_pts), np.float32(dst_pts), cv.RANSAC)
        # 将当前图像配准到基准图像
        warpImage = cv.warpPerspective( self.originImage, M, (baseImg.shape[1], baseImg.shape[0]))
        return warpImage, targetPoints, qrCodeWidth

    # 计算二维码图的四个顶点区域
    def calucKeyPointsArea(self, img, points, qrCodeWidth):
        if params.ORB_BY_ARER == 2: # 计算四个回字
            return self.calucHui(img, points, qrCodeWidth)
        else : # 计算四条边
            p4,p1,p2,p3 = self.adjustPoints(points)
            dis = 10
            a1 = [[p1[0],p1[1]-dis],[p2[0],p2[1]-dis],[p2[0],p2[1]+dis],[p1[0],p1[1]+dis]]
            a2 = [[p2[0]-dis,p2[1]],[p2[0]+dis,p2[1]],[p3[0]+dis,p3[1]],[p3[0]-dis,p3[1]]]
            a3 = [[p4[0],p4[1]-dis],[p3[0],p3[1]-dis],[p3[0],p3[1]+dis],[p4[0],p4[1]+dis]]
            a4 = [[p1[0]-dis,p1[1]],[p1[0]+dis,p1[1]],[p4[0]+dis,p4[1]],[p4[0]-dis,p4[1]]]
            return [a1,a2,a3,a4]

    # 计算四个回字（往外扩大一个block的位置）
    def calucHui(self, img, points, qrCodeWidth):
        p4,p1,p2,p3 = self.adjustPoints(points)
        bw, bs = self.calcQRCodeBlockwidth(img, points, qrCodeWidth, self.qrShape)
        bw = qrCodeWidth / bs

        # 左上角big 回字
        a = self.calcuDistance(p1, p2, 7*bw)
        b = self.calcuDistance(p1, p4, 7*bw)
        c = [a[0]+b[0]-p1[0],a[1]+b[1]-p1[1]]
        bigHui_lt = self.calucBigHui([p1,a,c,b],bw)
        cv.drawContours(img, np.int32([bigHui_lt]), 0, (255, 0, 0), 1)

        # 右上角big 回字
        a = self.calcuDistance(p2, p1, 7*bw)
        b = self.calcuDistance(p2, p3, 7*bw)
        c = [a[0]+b[0]-p2[0],a[1]+b[1]-p2[1]]
        bigHui_rt = self.calucBigHui([a,p2,b,c],bw)
        cv.drawContours(img, np.int32([bigHui_rt]), 0, (255, 0, 0), 1)

        # 右下角big 回字
        a = self.calcuDistance(p3, p2, 7*bw)
        b = self.calcuDistance(p3, p4, 7*bw)
        c = [a[0]+b[0]-p3[0],a[1]+b[1]-p3[1]]
        bigHui_rb = self.calucBigHui([c,a,p3,b],bw)
        cv.drawContours(img, np.int32([bigHui_rb]), 0, (255, 0, 0), 1)

        # 左下角big 回字
        a = self.calcuDistance(p4, p1, 7*bw)
        b = self.calcuDistance(p4, p3, 7*bw)
        c = [a[0]+b[0]-p4[0],a[1]+b[1]-p4[1]]
        bigHui_lb = self.calucBigHui([a,c,b,p4],bw)
        cv.drawContours(img, np.int32([bigHui_lb]), 0, (255, 0, 0), 1)
        # showImage(img,"huizi")
        return bigHui_lt, bigHui_rt, bigHui_rb, bigHui_lb

    # 计算指定points四个顶点往外扩大bigWidth一圈的矩形
    def calucBigHui(self, points, bigWidth):
        p1,p2,p3,p4 = points # 左上角、右上角、右下角、左下角
        p12 = self.calcuDistance(p1, p2, -1*bigWidth)
        p21 = self.calcuDistance(p2, p1, -1*bigWidth)
        p23 = self.calcuDistance(p2, p3, -1*bigWidth)
        p32 = self.calcuDistance(p3, p2, -1*bigWidth)
        p34 = self.calcuDistance(p3, p4, -1*bigWidth)
        p43 = self.calcuDistance(p4, p3, -1*bigWidth)
        p14 = self.calcuDistance(p1, p4, -1*bigWidth)
        p41 = self.calcuDistance(p4, p1, -1*bigWidth)
        p11 = self.calcuDistance(p14, p23, -1*bigWidth)
        p22 = self.calcuDistance(p23, p14, -1*bigWidth)
        p33 = self.calcuDistance(p32, p41, -1*bigWidth)
        p44 = self.calcuDistance(p41, p32, -1*bigWidth)
        return [p11,p22,p33,p44]

    # 查找两点的直线上，与point1距离distance的点坐标
    def calcuDistance(self,point1,point2,distance):
        x1 = point1[0]
        y1 = point1[1] 
        x2 = point2[0]
        y2 = point2[1] 
        # 计算两点之间的距离
        disX = (x2 - x1)
        disY = (y2 - y1)
        disPoint = math.sqrt(disX**2 + disY**2)
        ratio = distance / disPoint
        pX = ratio * disX
        pY = ratio * disY
        return [int(x1 + pX), int(y1 + pY)]

    # 使用orb配准
    # qrPointsOrigin 基准图（注册图）的二维码顶点
    # qrCodeWidth 配准二维码宽度
    # baseImg 基准图
    def alginByORB(self, qrPointsOrigin, qrCodeWidth, baseImg = None) :
        # baseImg为空，表示自己就是基准图
        if baseImg is None:
            warpImage, targetPoints, qrCodeWidth = self.alginByORBRegImg(qrPointsOrigin, qrCodeWidth, baseImg)
        else :
            # 核验图的orb配准
            if params.ORB_BY_ARER == 0:
                warpImage, targetPoints, qrCodeWidth = self.alginByORBVerifiImg(qrPointsOrigin, qrCodeWidth, baseImg)
            else :
                warpImage, targetPoints, qrCodeWidth = self.alginByORBVerifiImg2(qrPointsOrigin, qrCodeWidth, baseImg)

        # 计算二维码blockwidth、blockSize
        self.qrBlockWidth, self.blockSize = self.calcQRCodeBlockwidth(warpImage, targetPoints, qrCodeWidth, self.qrShape)
        # 变换校正后的二维码信息
        self.warpImage = warpImage
        self.qrWidth = qrCodeWidth
        self.qrPoints = targetPoints
        if self.qrShape is None or self.qrShape == ():
            self.qrShape = (self.blockSize, self.blockSize)
        return

    def distanceToOrigin(self, x, y):
        return math.sqrt(x**2 + y**2)

    # 确定原始二维码4个顶点, 以二维码在原始图片中左下角、左上角、右上角、右下角顺序返回
    def adjustPoints (self, originPoints):
        leftBottom = []
        leftTop = []
        rightTop = []
        rightBottom = []
        # 计算四个点与原点的距离、最小距离、最大距离
        distances = []
        for i in range(len(originPoints)):
            distances.append(self.distanceToOrigin(originPoints[i][0], originPoints[i][1]))
        minDistance = min(distances)
        maxDistance = max(distances)
        
        # 确定leftTop、rightBottom
        for j in range (len(distances)):
            if distances[j] == minDistance:
                leftTop = originPoints[j]
            if distances[j] == maxDistance:
                rightBottom = originPoints[j]

         # 确定rightTop、leftBottom
        for k in range (len(distances)):
            if distances[k] not in [minDistance, maxDistance]:
                if originPoints[k][0] - leftTop[0] > originPoints[k][1] - leftTop[1]:
                    rightTop = originPoints[k]
                else:
                    leftBottom = originPoints[k]

        return [leftBottom, leftTop, rightTop, rightBottom]

    # 以二维码配准
    def alginByQRCode(self, qrCodeWidth):
        warpImage, targetPoints = self.imageWarp(self.originImage, self.qrPointsOrigin, qrCodeWidth)
        # 计算二维码blockwidth、blockSize
        self.qrBlockWidth, self.blockSize = self.calcQRCodeBlockwidth(warpImage, targetPoints, qrCodeWidth, self.qrShape)
        self.warpImage = warpImage
        self.qrWidth = qrCodeWidth
        self.qrPoints = targetPoints
        if self.qrShape is None or self.qrShape == ():
            self.qrShape = (self.blockSize, self.blockSize)
        return

    # 裁剪指纹图小图
    '''
        裁剪指纹图小图，围绕二维码裁剪上下左右四个矩形区域
        # cutWidth, 目前只处理了默认-1，取二维码宽度
        # cutHeight: 裁剪纸纹图的短边高度, 负整数表示block的倍数，如-2，-5，正整数表示指定的大小比如30、50
        # padding：裁剪纸纹图距离二维码的距离, 负整数表示block的倍数，如-1，正整数表示指定的大小比如10
    '''
    def cutImgs(self, cutWidth, cutHeight, padding):
        qrCodeWidth = self.qrWidth
        _padding = padding if padding >= 0 else np.int32((self.qrBlockWidth) * padding * -1)
        _cutHeight = cutHeight if cutHeight >= 0 else np.int32((self.qrBlockWidth) * cutHeight * -1)

        # 裁剪图片,返回的是二维码 上下左右的小图的区域(左上角x、左上角y、宽、高)
        imgRects = self.calcCutImage(self.qrPoints, qrCodeWidth, cutWidth, _cutHeight, _padding)
        imgRects = np.int32(imgRects)
        drawCutImg = copy.deepcopy(self.warpImage) # 用于调试的图像，将所有纸纹区绘制框线画出来

        _cutImages = []
        index = 0
        for imgRect in imgRects:
            _cutImages.append(self.warpImage[imgRect[1] : imgRect[1] + imgRect[3], imgRect[0] : imgRect[0] + imgRect[2]]) # 取出每个纸纹区矩阵图
            index += 1
            drawCutImg = self.drawRect(drawCutImg,imgRect[0],imgRect[1],imgRect[2],imgRect[3], index) # 绘制每个纸纹区

        # 以透射变换4个顶点画的线框
        # cv.drawContours(drawCutImg, np.int32([[self.qrPoints[1],self.qrPoints[2],self.qrPoints[3],self.qrPoints[0]]]), 0, (255, 0, 0), 1)
        # 计算二维码中心点
        leftTopPoint = self.qrPoints[1] # 左上角
        centerX = np.int32(leftTopPoint[0] + qrCodeWidth / 2)
        centerY = np.int32(leftTopPoint[1] + qrCodeWidth / 2)

        # 以二维码为中心截取正方形图形，用作显示的cutShowImage
        halfWidth = np.int32(qrCodeWidth/2 + _cutHeight + _padding + 30)
        self.cutShowImage = drawCutImg[(centerY - halfWidth) : (centerY + halfWidth), (centerX - halfWidth) : (centerX + halfWidth)]

        self.cutImages = _cutImages
        # TODO 测试、待去掉
        # showImage(drawCutImg,"cutImg")
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

    # 透视变换校准
    # srcPoints 原图中二维码四个顶点位置 （左下、左上、右上、右下）
    # qrWidth 二维码边长
    # return：srcPoints、targetPoints: [左下、左上、右上、右下]
    def imageWarp(self, image, srcPoints, qrWidth):
        w, h = image.shape[:2]
        # 根据原图二维码中心点，计算矫正后的顶点位置
        qrCodeCenterPoint = self.calcuQrCodeCenterPoint(srcPoints)
        centerX = qrCodeCenterPoint[0]
        centerY = qrCodeCenterPoint[1]
        halfWidth = np.int32(qrWidth/2)
        left_bottom = [centerX - halfWidth, centerY + halfWidth]
        left_top =  [centerX - halfWidth, centerY - halfWidth]
        right_top =  [centerX + halfWidth, centerY - halfWidth]
        right_bottom =  [centerX + halfWidth, centerY + halfWidth]

        targetPoints = [left_bottom, left_top, right_top, right_bottom]

        # 变换前将四个顶点排序下：左上、右上、左下、右下
        _srcPoints = [srcPoints[1], srcPoints[2],srcPoints[0],srcPoints[3]]
        _targetPoints = [targetPoints[1], targetPoints[2],targetPoints[0],targetPoints[3]]

        matrix = cv.getPerspectiveTransform(np.float32(_srcPoints), np.float32(_targetPoints))
        warpImage = cv.warpPerspective(image, matrix, (h,w))
        return warpImage, targetPoints

    # 在图上绘制矩形
    def drawRect(self,img,x,y,w,h, index = 0) :
        lt = [x,y]
        rt = [x + w, y]
        rb = [x + w, y + h]
        lb = [x, y + h]
        cv.drawContours(img, np.int32([[lt,rt,rb,lb]]), 0, (128, 128, 128), 1)
        if (index != 0) and min(w,h) >= 30: # 区域太小了就不要写字了
            cv.putText(img, "%d"%index, (np.int32(lt[0]+w/2-10), np.int32(lt[1]+h/2+10)), cv.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 1)
        return img

    # 计算裁剪图,返回左、下、右、上四个纸纹区的(左上角x、左上角y、宽度、高度)
    def calcCutImage(self, qrPoints, qrCodeWidth, cutWidth, cutHeight, padding):
        if cutWidth == -1:
            cutWidth = qrCodeWidth
        leftTopPoint = qrPoints[1] # 左上角
        # 计算中心点
        centerX = np.int32(leftTopPoint[0] + qrCodeWidth / 2)
        centerY = np.int32(leftTopPoint[1] + qrCodeWidth / 2)

        # 正上方图为1，先计算左上角顶点
        img1LT_X = np.int32(centerX - cutWidth/2) #leftTopPoint[0]
        img1LT_Y = np.int32(centerY - qrCodeWidth/2 - padding - cutHeight)
        upImgRect = (img1LT_X, img1LT_Y, cutWidth, cutHeight)

        # 正下方图为2，先计算左上角顶点
        img2LT_X = np.int32(centerX - cutWidth/2) #leftTopPoint[0]
        img2LT_Y = np.int32(centerY + qrCodeWidth/2 + padding)
        downImgRect = (img2LT_X, img2LT_Y, cutWidth, cutHeight)

        # 左边的图为3，先计算左上角顶点
        img3LT_X = np.int32(centerX - qrCodeWidth/2 - padding - cutHeight)
        img3LT_Y = np.int32(centerY - cutWidth/2) #leftTopPoint[1]
        leftImgRect = (img3LT_X, img3LT_Y, cutHeight, cutWidth)

        # 右边的图为4，先计算左上角顶点
        img4LT_X = np.int32(centerX + qrCodeWidth/2 + padding)
        img4LT_Y = np.int32(centerY - cutWidth/2) #leftTopPoint[1]
        rightImgRect = (img4LT_X, img4LT_Y, cutHeight, cutWidth)

        # 返回的顺序为 左、下、右、上
        return leftImgRect, downImgRect, rightImgRect, upImgRect

    # 计算二维码block宽度
    def calcQRCodeBlockwidth(self, qrCodeImage, qrCodePoints, qrCodeWidth, qrCodeShape):
        calcImg = copy.deepcopy(qrCodeImage)
        calcPoints = qrCodePoints
        # 如果二维码是倾斜的，则需透视变换校正后再计算
        if calcPoints[1][1] != calcPoints[2][1]:
            calcImg, calcPoints = self.imageWarp(calcImg, calcPoints, qrCodeWidth)
        qrBlockWidth, blockSize = QRCodeParser.calcBlockwidth(calcImg, calcPoints, qrCodeWidth, qrCodeShape)
        return qrBlockWidth, blockSize