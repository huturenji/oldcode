'''
Author: miaoju jun.miao@sinosun.com.cn
Date: 2023-06-27 16:58:09
LastEditors: miaoju jun.miao@sinosun.com.cn
LastEditTime: 2023-08-29 17:05:27
FilePath: /paperprintpy/dng2tiffFile.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
import cv2 as cv
import numpy as np
import rawpy
import time
import util
import params
import os
import sys
import platform
import PylabShowTool
import pylab as pl
import subprocess
curPath = os.path.abspath(os.path.dirname(__file__))
import cpuinfo # pip3 install py-cpuinfo

os_type = platform.system()
# 判断当前操作系统是否为 Windows
if os_type == 'Windows':
    # print("当前操作系统为 Windows")
    execFile = "libdng/windows/dng_convert.exe"
elif os_type == 'Darwin':
    brand = cpuinfo.get_cpu_info().get('brand_raw')
    if 'M1'.lower() in brand.lower():
        execFile = "libdng/mac/m1/main"
    elif 'Intel'.lower() in brand.lower():
        execFile = "libdng/mac/inter/test"

dng_convertPath = os.path.join(curPath, execFile)
# print(f'执行文件路径 = {execPath}')

def listFiles(folder_path):
    listfiles = []
    for file in os.listdir(folder_path):  
        file_path = os.path.join(folder_path, file)
        if os.path.isfile(file_path) and (file.endswith(".dng")  or file.endswith(".DNG")):  
             # 在这里对每个文件进行操作，例如打印文件路径
            print(file_path)
            listfiles.append(file_path)
    return listfiles

# dng转成tiff并保存文件
def dng2tiff(filename, tiffFilename):
    # 读取dng图片, 返回 f32 图，gray=False 读取的是下采样后的bgr图，gray=true读取的是下采样后的灰度图
    dngImg = util.readDNGImage(filename, gray=False, downSample=False)
    cv.imwrite(tiffFilename, dngImg) # 保存到文件

# c++ dng转成tiff并保存文件
def dng2tiffByCpp(filename, tiffFilename):
    if filename.endswith('.DNG') | filename.endswith('.dng'):
        print(filename, "transfer tiff")
        if os.path.exists(dng_convertPath):
            # 程序执行参数拼接
            arguments = ['-a', filename]
            # 拼接执行命令
            command = [dng_convertPath] + arguments
            p = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            output, err= p.communicate()

    # TODO miaoju
    # 部分android手机（如xiaomi、vivo等）iso值使用上面cpp程序无法将dng中的"iso"快门速度信息写入tiff，使用py检查并重写一次
    # 1、先读取已经转好的图片，检查iso是否为0
    # ISO, exposureTime = util.getExifInfo(tiffFilename, tags = ['Image ISOSpeedRatings','Image ExposureTime'])
    # 2、如果iso为0，用py从dng读取并再次写入
    # if ISO == 0:
    #     ISO_DNG, exposureTime_DNG = util.getExifInfo(filename, tags = ['Image ISOSpeedRatings','Image ExposureTime'])

    #     tags = {'ISO':ISO_DNG, "ExposureTime":exposureTime_DNG}
    #     util.saveTiffISO(tiffFilename, tags)

def dng2TiffCase(byCPP = True, showTiffImage = False):
    # rootPath = "/Users/miaojun/Desktop/ppimg/new/1/dng/629/"
    rootPath = "/Users/miaojun/Desktop/sun3/"
    # rootPath = "D:/paperPrint/\ppimg/new/11/20230711" 
    rootPath = "/Users/miaojun/Desktop/ppimg/new/印刷标签/工厂喷墨/0810/亮白PET"

    # rootPath = "/Users/miaojun/Desktop/ppimg/sgy000010"
    # 处理整个文件夹内的dng图片用这个
    files = listFiles(rootPath)
    # 处理单个或多个，用这个，手动填入文件路径
    # files = []
    # files.append("/Users/miaojun/Desktop/ppimg/new/629/000023_0006_20230628172838_0_0_0020_00_J0.DNG")
    # files.append("/Users/miaojun/Desktop/ppimg/new/1/dng/629/0001_1_629_J0_180_2.DNG")
    # files.append("/Users/miaojun/Desktop/ppimg/new/1/dng/629/0001_1_629_J0_180_1.DNG")
    # files.append("/Users/miaojun/Desktop/ppimg/new/1/dng/629/0001_1_629_J0_center_1.DNG")
    # files.append("/Users/miaojun/Desktop/ppimg/new/1/dng/629/0001_1_629_J0_center_2.DNG")
    startTime = time.perf_counter()
    for fileName in files:
        singleDng2Tiff(byCPP, showTiffImage, fileName)
    endTime = time.perf_counter()
    print('dng2TiffCase costTime %.2f ms, files[%d]' % ((endTime - startTime) * 1000, len(files)))
    pl.show()

def readTiffCase():
    tiffFilename = "/Users/miaojun/Desktop/20230711-不同手机/000055_0006_20230711165200_0_0_0056_00_J0_bgr.tiff"
    image = util.loadPaperImage(tiffFilename, gray = False)
    image = util.img2U8(image)
    PylabShowTool.showImage(image, tiffFilename)
    pl.show()
    return 

# 单个文件转
def singleDng2Tiff(byCPP, showTiffImage, fileName):
    # 确保DNG、dng都正确替换成tiff
    if fileName.endswith('.DNG'):
        tiffFilename = fileName.replace('.DNG', '_bgr.tiff')
    elif fileName.endswith('.dng'):
        tiffFilename = fileName.replace('.dng', '_bgr.tiff')

    #  使用C++程序转换或python
    if (byCPP) :
        dng2tiffByCpp(fileName, tiffFilename)
    else :
        dng2tiff(fileName, tiffFilename)

    if showTiffImage:
        # print(fileName, ", tiff:",tiffFilename)
        # # 读取到的是 float32 的灰度图
        image = util.loadPaperImage(tiffFilename, gray = False)
        image = util.img2U8(image)
        PylabShowTool.showImage(image, fileName)

# dng2TiffCase(byCPP=False)
# dngToTiff()
# readTiffCase()
dngPath = "/Users/miaojun/Desktop/jpg/000093_0006_20230828105300_0_0_0153_00_J1.DNG"

# dngPath = "/Users/miaojun/Desktop/dng/000041_0006_20230706160548_0_0_0060_00_J011.DNG"
singleDng2Tiff(byCPP = True, showTiffImage = False, fileName = dngPath)