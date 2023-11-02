
'''
Author: miaoju jun.miao@sinosun.com.cn
Date: 2023-06-01 10:55:38
LastEditors: miaoju jun.miao@sinosun.com.cn
LastEditTime: 2023-09-01 17:27:29
FilePath: /testPy/main.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
#!/usr/bin/env python
# -*- coding=UTF-8 -*-
# -*-coding:utf-8 -*-
 
import cv2 as cv
import numpy as np
import pylab as pl
from matplotlib import cm
from mpl_toolkits.mplot3d import Axes3D
from statistics import mean
import params as params
from ImageCompare import ImageCompare
import os
import time
from TestReport import TestReport
from PylabShowTool import show2Image, showImage, showResultHist, showSmallCutImgCompare
import util
import PaperPrintCompare

# 单组图片对比
def singleTest(regFilePath, verifiFilePath, verifiJ1FilePath = ""):
    
    ret = PaperPrintCompare.imageCompare(regFilePath, verifiFilePath, verifiJ1FilePath)
    # 如果二维码解析失败返回的是: ("qrCode parse failed", imageCompare)
    if type(ret).__name__ == 'tuple' and len(ret) == 2:
        print(ret[0])
        return
    # 否则从result中取出结果信息
    resultsTrue, resultsFalse, resultsTrueDertImg, resultsFalseDertImg, imageCompare = ret
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
    showResultHist(resultsTrue,resultsFalse,"regImage:%s\nverifiImage:%s"%(imageCompare.regImage.filename, imageCompare.verifiImg.filename), detail)

    # 显示原始的图
    show2Image(imageCompare.regImage.originImage, imageCompare.verifiImg.originImage, imageCompare.regImage.filename, imageCompare.verifiImg.filename)

    # 显示裁剪的图
    show2Image(imageCompare.regImage.cutShowImage, imageCompare.verifiImg.cutShowImage, imageCompare.regImage.filename, imageCompare.verifiImg.filename)

    # 显示所有纸纹区域对比图
    regCutImgs = imageCompare.regImage.ppCutImages
    verifiCutImgs = imageCompare.verifiImg.ppCutImages
    for i in range(len(regCutImgs)):
        pass
        showSmallCutImgCompare(regCutImgs[i], verifiCutImgs[i], "area%s [%s]"%((i+1),resultsTrue[i]))
    pl.show()
    return

# 一组图片相互批量比较
# regFiles 注册图列表
# verifiFiles 核验图列表
# onlySameCompare 只比真图（判断为文件名前6位相同的）
# testTitle 测试title，不传默认显示 “测试报告”
# testScene 测试场景描述
def batcingTest(regFiles, verifiFiles, reportRootPath, onlySameCompare = False, testTitle= '', testScene=''):
    # 先创建测试报告，传入报告存放根文件夹
    testReport = TestReport()
    testReport.create(reportRootPath)
    testReport.setTestTitle(testTitle)
    testReport.setTestSceneText(testScene)
    testReport.addImageList(regFiles, verifiFiles) # 记录注册图、核验图清单
    testReport.addTestParams(params.getTestParams()) # 记录实验参数

    allResultsTrue = [] # 真图相同区域的结果集
    allResultsFalse = [] # 假图、真图不同区域的结果集
    exceptionResults = [] # 结果有异常结果集
    startTime = time.perf_counter()
    count = 0 # 核验图与注册图比对组数
    smallCount = 0 # 裁剪成纸纹小图的比对组数
    for regFile in regFiles:
        for verifiFile in verifiFiles:
            # start 测试代码，只比相同的图, 节省批量测试时间, TODO 判断代码不严谨，只比对文件名前6位字符相同，仅限自测使用
            if onlySameCompare: 
                strs = regFile.split("/")
                regFilefilename = strs[len(strs)-1]
                strs = verifiFile.split("/")
                verifiFilefilename = strs[len(strs)-1]
                    # 测试代码，只比相同的图
                if (regFilefilename[0:6] != verifiFilefilename[0:6]):
                    continue
            # end 测试代码，只比相同的图

            # 避免循环中创建太多plt窗口，每次循环将之前的窗口全部关闭
            pl.close('all')
            # 注册图、核验图为同一张图
            if regFile != verifiFile:
                print("")
                count += 1 # 核验图与注册图对比组数

                ret = PaperPrintCompare.imageCompare(regFile,verifiFile)
                # 如果二维码解析失败返回的是: ("qrCode parse failed", imageCompare)
                if type(ret).__name__ == 'tuple' and len(ret) == 2:
                    testReport.addParseException(ret[1],count)
                    exceptionResults.append(ret[1])
                    continue
                # 否则从result中取出结果信息
                resultsTrue, resultsFalse, resultsTrueDertImg, resultsFalseDertImg, imageCompare = ret

                # 记录每一组的测试详情到测试报告
                testReport.addResultDetails(imageCompare, count)

                # 比对结果有异常
                if imageCompare.isResultException:
                    exceptionResults.append(imageCompare)

                # 裁剪后的小指纹图之间比对组数
                smallCount += (len(resultsTrue) + len(resultsFalse))

                # 第一组对比图，保存一份裁剪示例图在测试报告中使用
                if count == 1:
                    savePath = "%scutImageSample.png"%testReport.imgPath
                    show2Image(imageCompare.regImage.cutShowImage,imageCompare.verifiImg.cutShowImage,imageCompare.regImage.filename,imageCompare.verifiImg.filename, (10,5), savePath)
                    testReport.addCutSampleImg("cutImageSample.png")

                # 认为二维码内容不一致为不同的纸（测试阶段才能用这个方式判断）
                if imageCompare.isSame():
                    allResultsTrue = np.concatenate((allResultsTrue, resultsTrue))
                    allResultsFalse = np.concatenate((allResultsFalse, resultsFalse))
                else : # 
                     # 不同的纸，resultsTrue也是假图
                    allResultsFalse = np.concatenate((allResultsFalse, resultsTrue))
                    allResultsFalse = np.concatenate((allResultsFalse, resultsFalse))

    endTime = time.perf_counter()
    strResult = 'regFiles[%d], verifiFiles[%d]\ncalcCount[%d]times, smallCount[%d]times\ncostTime %.1f S, exceptionNum[%d]' % (len(regFiles), len(verifiFiles), count, smallCount, (endTime - startTime), len(exceptionResults))
    print("batcingTest result:\n",strResult)

    # 显示直方图，保存图片文件
    # 避免循环中创建太多plt窗口，将之前的窗口全部关闭
    pl.close('all')
    savePath = "%sresultHistImage.png"%testReport.imgPath
    showResultHist(allResultsTrue, allResultsFalse, strResult, savePath = savePath)
    # 记录测试结果摘要信息到测试报告
    testReport.addResultSummary(allResultsTrue, allResultsFalse,"resultHistImage.png", len(regFiles), len(verifiFiles), count, smallCount, (endTime - startTime), len(exceptionResults))
    testReport.save()
    pl.show()
    return

# 获取指定文件夹下的所有tiff文件
def listTiffFiles(folder_path, suffixName = "", pattern = "", no_pattern = ""):
    suffix = ".tiff" if suffixName == "" else suffixName
    print("folder[%s], suffix[%s], pattern[%s], no_pattern[%s]"%(folder_path, suffix, pattern, no_pattern))
    listfiles = []
    for file in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file)
        if os.path.isfile(file_path) and (file.endswith(suffix)):
            if pattern == "" or (pattern != "" and file.find(pattern) > -1) :
                if no_pattern == "" or file.find(no_pattern) < 0 : 
                    # 在这里对每个文件进行操作，例如打印文件路径
                    print(file_path)
                    listfiles.append(file_path)
    return sorted(listfiles)

# --------------下面都是测试用例--------------------------------------------------------------------------------------  
# single file test  case
def singleTestCase() :
    fileReg = "/Users/miaojun/Desktop/ppimg/new/1/dng/629/0001_1_629_J0.tiff"
    fileVerifi = "/Users/miaojun/Desktop/ppimg/new/1/dng/629/0001_1_629_J0_180_1.tiff"
    singleTest(fileReg, fileVerifi)

def batchingTestCase() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/sun3/",pattern="j0")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/sun3/",pattern="j2")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/sun3/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath)

def batchingTestCase2() :
    regFiles = listTiffFiles("D:/paperPrint/ppimg/new/11/20230711/",pattern="J0")
    verifiFiles = listTiffFiles("D:/paperPrint/ppimg/new/11/20230711/", pattern = "J", no_pattern="J0")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "D:/paperPrint/ppimg/new/11/20230711/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath)

# 二维码不清晰、识别失败 case
def batchingTestCase3() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/sgy000010/",pattern="j0")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/sgy000010/",pattern="j2")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/ppimg/sgy000010/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath)
    
# 不干胶-铜版纸 case
def batchingTestCase4() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/不干胶-铜版纸/new/",pattern = "J0")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/不干胶-铜版纸/new/", pattern = "J", no_pattern="J0")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/ppimg/new/不干胶-铜版纸/new/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath)
    
def batchingTestCase5() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/0710/",pattern = "J0")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/0710/", pattern = "J2")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/ppimg/new/0710/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath)
    
    # 标签纸 正常光照 /Users/miaojun/Desktop/ppimg/new/标签纸纹识别
def batchingTestCase6() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-正常光照/",pattern = "J0")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-正常光照/", pattern = "J", no_pattern="J0")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-正常光照/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath)

    # 标签纸 光照增强 /Users/miaojun/Desktop/ppimg/new/标签纸纹识别
def batchingTestCase7() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-增强光照/",pattern = "J0")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-增强光照/", pattern = "J", no_pattern="J0")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-增强光照/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath)


    # 标签纸 无光源J0作为J0，其他无光源、正常光源、增强光源都作为核验图
def batchingTestCase8() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-无光源/",pattern = "J0")
    verifiFiles1 = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-无光源/", pattern = "J", no_pattern="J0")
    verifiFiles2 = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-正常光照/", pattern = "J")
    verifiFiles3 = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-增强光照/", pattern = "J")
    verifiFiles = np.concatenate((verifiFiles1, verifiFiles2, verifiFiles3))
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-无光源/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath)

    # 标签纸  /Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-低角度光照
def batchingTestCase9() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-低角度光照/",pattern = "J0")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-低角度光照/", pattern = "J", no_pattern="J0")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230710-低角度光照/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath)
    
    # /Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230705
def batchingTestCase10() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230705/",pattern = "0045")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230705/", pattern = "0045")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230705/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath)

# /Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230711-不同手机
def batchingTestCase11() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230711-不同手机/",pattern = "000055_0006_20230711165200_0_0_0056_00_J0")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230711-不同手机/", pattern = "0055",no_pattern="J0")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230711-不同手机/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath)
    
# /Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230711-假标签/
def batchingTestCase12() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230711-不同手机/",pattern = "0055")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230711-假标签/", pattern = "0055")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/ppimg/new/标签纸纹识别/20230711-假标签/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath)
    
def batchingTestCase13() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/0719-正常光环境/",pattern = "000023_0006_20230628172838_0_0_0020_00_J0_bgr.tiff")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/0719-正常光环境/", pattern = "J2")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/ppimg/new/0719-正常光环境/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath)

def batchingTestCase14() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/629/",pattern = "J0")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/629/", pattern = "J2")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/ppimg/new/629/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath, onlySameCompare=True)
    
def batchingTestCase15() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/jpg/Camera/",suffixName = "jpg", pattern = "IMG_20230809_134746")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/jpg/Camera/", suffixName = "jpg", pattern = "")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/jpg/Camera/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath)
# 日历    # 
def batchingTestCase16() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/jpg/root/27c81d91523b1fa9dd2075a0fa17151e/",suffixName = "jpg", pattern = "27c81d91523b1fa9dd2075a0fa17151e.jpg")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/jpg/images/rili/", suffixName = "jpg", pattern = "")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/jpg/images/rili/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath)

# A4    # 
def batchingTestCase17() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/jpg/root/75891c215fa472036c240d83dddd8b74",suffixName = "jpg", pattern = "1691143504640.jpg")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/jpg/images/A4", suffixName = "jpg", pattern = "")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/jpg/images/A4/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath)
    
# 测试代码，用于显示测试保存的纸纹图
def showCutTiff():
    regFile = "/Users/miaojun/Desktop/ppimg/new/11/20230621/report-20230705170608/img/0/regArea1.tiff"
    verifiFile = "/Users/miaojun/Desktop/ppimg/new/11/20230621/report-20230705170608/img/0/verifiArea1.tiff"
    regImg = cv.imread(regFile, cv.IMREAD_UNCHANGED)
    verImgImg = cv.imread(verifiFile, cv.IMREAD_UNCHANGED)
    showSmallCutImgCompare(regImg, verImgImg, "compare")
    return
def showTiff():
    # regFile = "/Users/miaojun/Desktop/ppimg/new/0719-正常光环境/dkd/000023_0007_20230719145000_0_7_0133_3_J2.tiff" 
    regFile = "/Users/miaojun/Desktop/sun3/report-20230721111055/img/1/regArea1.tiff" 
    regImg = cv.imread(regFile, cv.IMREAD_UNCHANGED)
    regImg = util.img2U8(regImg)
    regImg = cv.cvtColor(regImg, cv.COLOR_BGR2GRAY)
    cv.imshow("reg", regImg)
    cv.waitKey()
    return
# /Users/miaojun/Desktop/ppimg/new/不干胶-铜版纸/new/000044_0006_20230707104100_0_0_0060_00_J0.tiff
# /Users/miaojun/Desktop/ppimg/new/不干胶-铜版纸/new/000041_0006_20230707104100_0_0_0066_00_J6.tiff

# 注册图: /Users/miaojun/Desktop/ppimg/new/0710/000027_0006_20230628173102_0_7_0020_3_J0.tiff
# 核验图: /Users/miaojun/Desktop/ppimg/new/0710/000027_0007_20230629102020_0_7_0038_3_J2.tiff
def singleTestCase2() :
    fileReg = "/Users/miaojun/Desktop/ppimg/new/0720-正常光环境-标签23八个方向光照/000023_0006_20230628172838_0_0_0020_00_J0_bgr.tiff"
    fileVerifi = "/Users/miaojun/Desktop/ppimg/new/0720-正常光环境-标签23八个方向光照/000023_0007_20230720165900_0_0_0134_00_J2_bgr.tiff"
    singleTest(fileReg, fileVerifi)
# --------------上面都是测试用例--------------------------------------------------------------------------------------  

def singleTestCase3() :
    fileReg = "/Users/miaojun/Desktop/jpg/A-1-3-14-02.JPG"
    fileVerifi = "/Users/miaojun/Desktop/jpg/A-1-3-14-01.JPG"
    singleTest(fileReg, fileVerifi)

def singleTestCase4() :
    fileReg = "/Users/miaojun/Desktop/jpg/picture817/amcap12.bmp"
    fileVerifi = "/Users/miaojun/Desktop/jpg/picture817/amcap22.bmp"
    singleTest(fileReg, fileVerifi)

def singleTestCase5() :
    fileReg = "/Users/miaojun/Desktop/ppimg/new/印刷标签/工厂喷墨/0810/亮白PET/A-3-4-11-02.dng"
    fileVerifi = "/Users/miaojun/Desktop/ppimg/new/印刷标签/工厂喷墨/0810/亮白PET/A-3-4-11-01.dng"
    singleTest(fileReg, fileVerifi)

def singleTestCase6() :
    fileReg = "/Users/miaojun/Desktop/ppimg/new/印刷标签/工厂喷墨/0810/亮白PET/A-3-4-11-01_bgr.tiff"
    fileVerifi = "/Users/miaojun/Desktop/ppimg/new/印刷标签/工厂喷墨/0810/亮白PET/A-3-4-11-02_bgr.tiff"
    singleTest(fileReg, fileVerifi)
    
def singleTestCase7() :
    fileReg = "/Users/miaojun/Desktop/jpg/000093_0006_20230828105300_0_0_0153_00_J1.DNG"
    fileVerifi = "/Users/miaojun/Desktop/jpg/000093_0006_20230828105400_0_0_0154_00_J1.DNG"
    singleTest(fileReg, fileVerifi)

def singleTestCase8() :
    fileReg = "/Users/miaojun/Desktop/jpg/WechatIMG53.jpeg"
    fileVerifi = "/Users/miaojun/Desktop/jpg/WechatIMG51.jpeg"
    # fileVerifi = "/Users/miaojun/Library/Containers/com.tencent.xinWeChat/Data/Library/Application Support/com.tencent.xinWeChat/2.0b4.0.9/089f44c557e942f892f14d898915e6f5/Message/MessageTemp/aac388715081ad28e390f57656163f87/File/000099_0006_20230828111300_0_0_0154_00_J1.DNG"

    singleTest(fileReg, fileVerifi)
    
def singleTestCaseDertJ() :
    fileReg = "/Users/miaojun/Desktop/ppimg/new/3/000003_0003_20230518095529_0_0_0000_00_J0_bgr.tiff"
    fileVerifi = "/Users/miaojun/Desktop/ppimg/new/3/000003_0003_20230518100112_0_0_0001_00_J2_bgr.tiff"
    fileJ1Verifi = "/Users/miaojun/Desktop/ppimg/new/3/000003_0003_20230518100112_0_0_0001_00_J1_bgr.tiff"
    singleTest(fileReg, fileVerifi, fileJ1Verifi)

# def batchingTestCase16() :
#     regFiles = listTiffFiles("C:\\Users\\zhengxi\\Desktop\\1111")
#     verifiFiles = listTiffFiles("C:\\Users\\zhengxi\\Desktop\\1111")
#     reportRootPath = "C:\\Users\\zhengxi\\Desktop\\test" # 测试报告的根目录
#     batcingTest(regFiles, verifiFiles, reportRootPath)

# singleTestCase2()
# singleTestCase4()
# singleTestCase()
# showCutTiff()
# showTiff()
# batchingTestCase()
# batchingTestCase17()
singleTestCase8()
# singleTestCaseDertJ()
# batchingTestCase13()
# batchingTestCase16()
