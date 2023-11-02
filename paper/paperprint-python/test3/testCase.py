
'''
Author: miaoju jun.miao@sinosun.com.cn
Date: 2023-06-01 10:55:38
LastEditors: miaoju jun.miao@sinosun.com.cn
LastEditTime: 2023-09-04 13:18:58
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
from ImageCompare3 import ImageCompare3
import params
import time
from TestReport import TestReport
from PylabShowTool import show2Image, showImage, showResultHist, showSmallCutImgCompare, showHist, showHistData
import PreprocessImageTool
import PaperPrintCompare
import util


# 单组图片对比
def singleTest(regFilePath, verifiFilePath, verifiJ1FilePath = ""):
    
    imageCompare = ImageCompare3(regFilePath,verifiFilePath)
    # 首先判断下核验图与注册图有没有二维码识别失败的, 二维码识别失败直接return
    if imageCompare.isParseQRCodeException() :
        return "qrCode parse failed", imageCompare
    #  如果有J1参与，同时计算差图
    if verifiJ1FilePath != "":
        imageCompare.useDertImage(verifiJ1FilePath)
    # 返回相同位置（上、下、左、右）、不同位置（上下、下上、左右、右左）的相关系数值
    resultsTrue, resultsFalse, resultsTrueDertImg, resultsFalseDertImg  = imageCompare.compare(params.QRCODE_WIDTH) # -1 表示以注册图、核验图二维码边长小的做配准

    print ("regImage: ", regFilePath)
    print ("verifiImage: ", verifiFilePath)
    print ("verifiJ1Image: ", verifiJ1FilePath)

    print("regQrCodeWidth[%d], verifiQrCodeWidth[%d], use qrCodeWidth[%d], regQrCodeBlock[%d], verifiQrCodeBlock[%d] " %(imageCompare.regImage.qrWidthOrigin, imageCompare.verifiImg.qrWidthOrigin, imageCompare.regImage.qrWidth, imageCompare.regImage.qrBlockWidth,imageCompare.verifiImg.qrBlockWidth))

    print(imageCompare.showTrueResults)
    print(imageCompare.showFlaseResults)
    # [0.785, 0.725, 0.68, 0.66]
    # [0.005, 0.085, 0.015, -0.005, 0.0, 0.005, 0.01, -0.005, 0.03, 0.01, -0.015, 0.035]
    print(" --- dertJ ---")
    # [0.785, 0.725, 0.68, 0.66]
    # [0.005, 0.085, 0.015, -0.005, 0.0, 0.005, 0.01, -0.005, 0.03, 0.01, -0.015, 0.035]
    print(imageCompare.showTrueResultsDertImg)

    print(imageCompare.showFlaseResultsDertImg)

    #  显示直方图
    detail = "%s\n%s" %(resultsTrue, resultsFalse)
    # showResultHist(resultsTrue,resultsFalse,"regImage:%s\nverifiImage:%s"%(imageCompare.regImage.filename, imageCompare.verifiImg.filename), detail)

    # 显示原始的图
    # show2Image(imageCompare.regImage.originImage, imageCompare.verifiImg.originImage, imageCompare.regImage.filename, imageCompare.verifiImg.filename)

    # 显示裁剪的图
    show2Image(imageCompare.regImage.cutShowImage, imageCompare.verifiImg.cutShowImage, imageCompare.regImage.filename, imageCompare.verifiImg.filename)

    # 显示所有纸纹区域对比图
    regCutImgs = imageCompare.regImage.ppCutImages
    verifiCutImgs = imageCompare.verifiImg.ppCutImages
    for i in range(len(regCutImgs[:4])):
        # showSmallCutImgCompare(regCutImgs[i], verifiCutImgs[i], "area%s [%s]"%((i+1),resultsTrue[i]))
        pass
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
                imageCompare = ImageCompare3(regFilePath,verifiFilePath)
                # 返回相同位置（上、下、左、右）、不同位置（上下、下上、左右、右左）的相关系数值
                avgLineReg, avgLineVerifi, result = imageCompare.compare(params.QRCODE_WIDTH) # -1 表示以注册图、核验图二维码边长小的做配准
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

def singleTestCase4() :
    fileReg = "/Users/miaojun/Desktop/jpg/picture817/amcap12.bmp"
    fileVerifi = "/Users/miaojun/Desktop/jpg/picture817/amcap22.bmp"
    singleTest(fileReg, fileVerifi)

def singleTestCase5() :
    fileReg = "/Users/miaojun/Desktop/ppimg/new/印刷标签/工厂喷墨/0810/亮白PET/A-3-4-11-02.dng"
    fileVerifi = "/Users/miaojun/Desktop/ppimg/new/印刷标签/工厂喷墨/0810/亮白PET/A-3-4-11-01.dng"
    singleTest(fileReg, fileVerifi)

def singleTestCase6() :
    fileReg = "/Users/miaojun/Desktop/jpg/000093_0006_20230828105300_0_0_0153_00_J1.DNG"
    fileVerifi = "/Users/miaojun/Desktop/jpg/000093_0006_20230828105400_0_0_0154_00_J1.DNG"
    singleTest(fileReg, fileVerifi)
# --------------上面都是测试用例--------------------------------------------------------------------------------------  

# batchingTestCase()
# singleTestCase()
singleTestCase5()
# batchingTestCase2()
