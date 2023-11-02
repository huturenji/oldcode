
'''
Author: miaoju jun.miao@sinosun.com.cn
Date: 2023-06-01 10:55:38
LastEditors: miaoju jun.miao@sinosun.com.cn
LastEditTime: 2023-08-31 14:30:53
FilePath: /testPy/main.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
#!/usr/bin/env python
# -*- coding=UTF-8 -*-
# -*-coding:utf-8 -*-
 
import sys
import os
# ---- begin python 3.6.7 以上的版本，需要这样import其他目录的py文件
dir_path = os.path.dirname(os.path.realpath(__file__))
parent_dir_path = os.path.abspath(os.path.join(dir_path, os.pardir))
sys.path.insert(0, parent_dir_path)
# ---- end python 3.6.7 以上的版本，需要这样import其他目录的py文件

import cv2 as cv
import numpy as np
import pylab as pl
from matplotlib import cm
from mpl_toolkits.mplot3d import Axes3D
from statistics import mean
from ImageCompare2 import ImageCompare2
from params import QRCODE_WIDTH
import time
from TestReport import TestReport
from PylabShowTool import show2Image, showImage, showResultHist, showSmallCutImgCompare, showHist, showHistData
import PreprocessImageTool

import util

# 单组图片对比
def singleTest(regFilePath, verifiFilePath):
    imageCompare = ImageCompare2(regFilePath,verifiFilePath)
    # 返回相同位置（上、下、左、右）、不同位置（上下、下上、左右、右左）的相关系数值
    resultsTrue, resultsFalse, resultsTrueDertImg, resultsFalseDertImg = imageCompare.compare(QRCODE_WIDTH) # -1 表示以注册图、核验图二维码边长小的做配准
    regFileName = imageCompare.regImage.filename.split(".")[0]
    verifiFileName = imageCompare.verifiImg.filename.split(".")[0]

    title = "%s\n%s\nresult:%s"%(regFileName, verifiFileName, resultsTrue)
    # showHist(avgLineReg, avgLineVerifi, title=title)
    showHistData(resultsTrue, "36Sides[%.4f]\n%s\n%s"%(mean(resultsTrue),imageCompare.regImage.filePath,imageCompare.verifiImg.filePath))

    print("singleTest--------------------------------")
    print ("regImage: ", imageCompare.regImage.filePath)
    print ("verifiImage: ", imageCompare.verifiImg.filePath)
    print("regQrCodeWidth[%d], verifiQrCodeWidth[%d], use qrCodeWidth[%d], regQrCodeBlock[%d], verifiQrCodeBlock[%d] " %(imageCompare.regImage.qrWidthOrigin, imageCompare.verifiImg.qrWidthOrigin, imageCompare.regImage.qrWidth, imageCompare.regImage.qrBlockWidth,imageCompare.verifiImg.qrBlockWidth))
    print(resultsTrue)
    # # 显示原始的图
    # show2Image(imageCompare.regImage.originImage, imageCompare.verifiImg.originImage, imageCompare.regImage.filename, imageCompare.verifiImg.filename)
    show2Image(imageCompare.regImage.cutShowImage, imageCompare.verifiImg.cutShowImage, imageCompare.regImage.filename, imageCompare.verifiImg.filename)
    pl.show()
    return

# 单组图片对比
def batcingTest(regFiles, verifiFiles, savePath):
    count = 0
    startTime = time.perf_counter()
    for regFilePath in regFiles:
        for verifiFilePath in verifiFiles:
            if regFilePath != verifiFilePath:
                count += 1
                imageCompare = ImageCompare2(regFilePath,verifiFilePath)
                # 返回相同位置（上、下、左、右）、不同位置（上下、下上、左右、右左）的相关系数值
                avgLineReg, avgLineVerifi, result = imageCompare.compare(QRCODE_WIDTH) # -1 表示以注册图、核验图二维码边长小的做配准
                regFileName = imageCompare.regImage.filename.split(".")[0]
                verifiFileName = imageCompare.verifiImg.filename.split(".")[0]

                title = "%s\n%s\nresult:%.3f"%(regFileName, verifiFileName, result[0][0])
                # detail = "result:%.3f"%result[0][0]
                showHist(avgLineReg, avgLineVerifi, title=title, savePath="%s%s_%s.jpg"%(savePath,regFileName, verifiFileName))
                print("%d: %s[%s,%s]  ---------------------------"%(count, ("相同二维码" if imageCompare.isSame() else "不同二维码"), imageCompare.regImage.qrText, imageCompare.verifiImg.qrText))
                print ("regImage: ", imageCompare.regImage.filePath)
                print ("verifiImage: ", imageCompare.verifiImg.filePath)
                print("regQrCodeWidth[%d], verifiQrCodeWidth[%d], use qrCodeWidth[%d], regQrCodeBlock[%d], verifiQrCodeBlock[%d] " %(imageCompare.regImage.qrWidthOrigin, imageCompare.verifiImg.qrWidthOrigin, imageCompare.regImage.qrWidth, imageCompare.regImage.qrBlockWidth,imageCompare.verifiImg.qrBlockWidth))
                print("result:%.3f"%result[0][0])
                # # 显示原始的图
                # show2Image(imageCompare.regImage.originImage, imageCompare.verifiImg.originImage, imageCompare.regImage.filename, imageCompare.verifiImg.filename)
                pl.close()
    endTime = time.perf_counter()
    print("--------------------------------------------------------------------------------")
    print("batcingTest count[%d], costTime[%d S], savePath:[%s]"%(count, (endTime - startTime), savePath))
    return

# 获取指定文件夹下的所有tiff文件
# 获取指定文件夹下的所有tiff文件
def listTiffFiles2(folder_path, pattern = "", no_pattern = ""):
    listfiles = []
    for file in os.listdir(folder_path):  
        file_path = os.path.join(folder_path, file)
        if os.path.isfile(file_path) and (file.endswith(".tiff")  or file.endswith(".tif")):  
            if (pattern != "" and file.find(pattern) > -1) :
                if no_pattern == "" or file.find(no_pattern) < 0 : 
                    # 在这里对每个文件进行操作，例如打印文件路径
                    print(file_path)
                    listfiles.append(file_path)
    return sorted(listfiles)

# 获取指定文件夹下的所有tiff文件
def listTiffFiles(folder_path, suffixName = "", pattern = "", no_pattern = ""):
    suffix = ".tiff" if suffixName == "" else suffixName
    print("folder[%s], suffix[%s], pattern[%s], no_pattern[%s]"%(folder_path, suffix, pattern, no_pattern))
    listfiles = []
    for file in os.listdir(folder_path):  
        file_path = os.path.join(folder_path, file)
        if os.path.isfile(file_path) and (file.endswith(suffix)):
            if (pattern != "" and file.find(pattern) > -1) :
                if no_pattern == "" or file.find(no_pattern) < 0 : 
                    # 在这里对每个文件进行操作，例如打印文件路径
                    print(file_path)
                    listfiles.append(file_path)
    return sorted(listfiles)

# --------------下面都是测试用例--------------------------------------------------------------------------------------  
def batchingTestCase() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-正常光照/",pattern = "000053_0006_20230710131700_0_0_0069_00_J0_bgr")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-正常光照/",pattern = "000")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-正常光照/000053lineTest726-1/" # 测试报告的根目录
    os.makedirs(reportRootPath, exist_ok=True) # 创建测试报告目录
    batcingTest(regFiles, verifiFiles, reportRootPath)

def batchingTestCase3() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-正常光照/",pattern = "000054_0006_20230710132200_0_0_0069_00_J0_bgr")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-正常光照/",pattern = "00054")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-正常光照/000053lineTest2/" # 测试报告的根目录
    os.makedirs(reportRootPath, exist_ok=True) # 创建测试报告目录
    batcingTest(regFiles, verifiFiles, reportRootPath)
    
# 合成纸专项测试
def batchingTestCase2() :
    # 001-00056-J0.JPG 与 001-00056-1.JPG 为真图，其他都为假图
    regFiles = listTiffFiles("/Users/miaojun/Desktop/合成纸/", suffixName = ".JPG", pattern = "0056")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/合成纸/", suffixName = ".JPG", pattern = "0056")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/合成纸/lineTest726-5/" # 测试报告的根目录
    os.makedirs(reportRootPath, exist_ok=True) # 创建测试报告目录
    batcingTest(regFiles, verifiFiles, reportRootPath)

def singleTestCase3() :
    # fileReg = "/Users/miaojun/Desktop/合成纸/001-00056-10.JPG"
    fileReg = "/Users/miaojun/Desktop/合成纸/001-00056-2.JPG"
    # fileReg = "/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-正常光照/000053_0006_20230710131700_0_0_0069_00_J0_bgr.tiff"
    # fileVerifi = "/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-正常光照/000054_0006_20230710141600_0_0_0078_00_J3_bgr.tiff"
    fileVerifi = "/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-正常光照/000053_0006_20230710155800_0_0_0090_00_J7_bgr.tiff"
    fileVerifi = "/Users/miaojun/Desktop/合成纸/001-00056-6.JPG"
    # fileVerifi = "/Users/miaojun/Desktop/合成纸/001-00056-J0.JPG"
    # fileVerifi = "/Users/miaojun/Desktop/合成纸/001-00056-10.JPG"

    singleTest(fileReg, fileVerifi)
    
def singleTestCase4() :
    fileReg = "/Users/miaojun/Desktop/jpg/0807/fake/b03_1.JPG"
    fileVerifi = "/Users/miaojun/Desktop/jpg/0807/fake/b03_2.JPG"
    singleTest(fileReg, fileVerifi)
def singleTestCase5() :
    fileReg = "/Users/miaojun/Desktop/jpg/A-1-3-11-02.JPG"
    fileVerifi = "/Users/miaojun/Desktop/jpg/A-1-3-12-01.JPG"
    singleTest(fileReg, fileVerifi)

def singleTestCase6() :
    fileReg = "/Users/miaojun/Desktop/jpg/A-1-3-14-02.JPG"
    fileVerifi = "/Users/miaojun/Desktop/jpg/B-1-3-09-02.JPG"
    singleTest(fileReg, fileVerifi)
    
def singleTestCase7() :
    fileReg = "/Users/miaojun/Desktop/jpg/0807/11-1-1-02.JPG"
    fileVerifi = "/Users/miaojun/Desktop/jpg/0807/仿真/11-1-1-02.jpg"
    singleTest(fileReg, fileVerifi)
def singleTestCase8() :
    fileReg = "/Users/miaojun/Desktop/jpg/0807/A/a1_1.JPG"
    fileVerifi = "/Users/miaojun/Desktop/jpg/0807/A/a3_1.jpg"
    singleTest(fileReg, fileVerifi)

def singleTestCase9() :
    fileReg = "/Users/miaojun/Desktop/jpg/0807/A/a1_1.JPG"
    fileVerifi = "/Users/miaojun/Desktop/jpg/0807/fake/a1_1.jpeg"
    singleTest(fileReg, fileVerifi)

def singleTestCase10() :
    fileReg = "/Users/miaojun/Desktop/jpg/Camera/IMG_6711.jpeg"
    fileVerifi = "/Users/miaojun/Desktop/jpg/Camera/IMG_6716.jpeg"
    singleTest(fileReg, fileVerifi)
# --------------上面都是测试用例--------------------------------------------------------------------------------------  
def singleTestCase11() :
    fileReg = "/Users/miaojun/Desktop/jpg/000093_0006_20230828105300_0_0_0153_00_J1.DNG"
    fileVerifi = "/Users/miaojun/Desktop/jpg/000093_0006_20230828105400_0_0_0154_00_J1.DNG"
    singleTest(fileReg, fileVerifi)
    
# batchingTestCase()
# singleTestCase()
singleTestCase11()
# batchingTestCase2()

def showHist(path):
    cv2 = cv
    plt = pl
    img = util.loadPaperImage(path)
    img = util.img2U8(img)
    hist = cv2.calcHist([img], [0], None, [256], [0, 256]) 
    # 显示灰度直方图  
    plt.plot(hist)  
    plt.xlim([0, 256])  
    plt.xlabel('灰度级')  
    plt.ylabel('像素数')  
    plt.show()
    return 
def hist(path):
    cv2 = cv
    img = util.loadPaperImage(path)
    img = util.img2U8(img)
        # 使用Otsu算法计算出阈值  
    ret, thresh = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)  
    # cv.imshow("thresh", thresh)
    showImage(thresh, "1")

    hist = cv2.calcHist([img], [0], None, [256], [0, 256]) 
    # 找到灰度直方图中的峰值  
    peak_index = np.argmax(hist)
    # 将峰值降序排列，取前20%的像素值
    threshold_index = int(0.2 * len(hist))  
    threshold_value = np.partition(np.argsort(hist)[::-1], -threshold_index)[threshold_index]  
    # 将取出的像素值对应的灰度值作为阈值  
    threshold = threshold_value  
    # 使用阈值对图像进行二值化处理  
    binary = cv2.threshold(img, threshold, 255, cv2.THRESH_BINARY)[1]  
    # cv.imshow("thresh", thresh)
    showImage(binary, "11")
    return 
def read(path,path2):
    cv2 = cv
    img = util.loadPaperImage(path)
    # 使用Otsu算法计算出阈值  
    ret, thresh = cv2.threshold(util.img2U8(img), 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)  
    # cv.imshow("thresh", thresh)
    showImage(thresh, "1")
    
    img = cv2.GaussianBlur(img, (3, 3), 1)
    # 使用Otsu算法计算出阈值  
    ret, thresh = cv2.threshold(util.img2U8(img), 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)  
    # cv.imshow("thresh", thresh)
    showImage(thresh, "1-gs")


    img2 = util.loadPaperImage(path2)
    # 使用Otsu算法计算出阈值  
    ret2, thresh2 = cv2.threshold(util.img2U8(img2), 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)  
    # cv.imshow("thresh", thresh)
    showImage(thresh2, "2")

    img2 = cv2.GaussianBlur(img2, (3, 3), 1)
    # 使用Otsu算法计算出阈值  
    ret, thresh2 = cv2.threshold(util.img2U8(img2), 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)  
    # cv.imshow("thresh", thresh)
    showImage(thresh2, "2-gs")

    # cv.waitKey(0)
    return 

path = "/Users/miaojun/Desktop/合成纸/001-00056-J0.JPG"
path2 = "/Users/miaojun/Desktop/合成纸/001-00056-1.JPG"

# showHist(path=path)
# read(path, path2)