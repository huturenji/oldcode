'''
Author: miaoju jun.miao@sinosun.com.cn
Date: 2023-06-15 13:48:22
LastEditors: miaoju jun.miao@sinosun.com.cn
LastEditTime: 2023-08-28 13:58:12
FilePath: /testPy/paperprint/util.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''

"""
图片处理工具类
"""
import cv2 as cv
import numpy as np
import pylab as pl
from matplotlib import cm
from mpl_toolkits.mplot3d import Axes3D
import rawpy
from statistics import mean
import time
import params
from PIL import Image
import piexif
from rawpy import DemosaicAlgorithm

# 加载纸纹图，传入文件路径，默认返回(float32 的灰度图), gray 可以传false返回原始bgr，支持 .tiff .dng文件
def loadPaperImage(fileName, gray = True, downSample = True):
    if (fileName.endswith(".DNG") or fileName.endswith(".dng")) :
        image = readDNGImage(fileName, gray, downSample)
        return image
    # 读取tiff、jpg等图片走下面这个逻辑
    image = readTiff(fileName, gray)
    return image

# 读取dng图片，并下采样、去马赛克,返回 (float32 的灰度图)
def readDNGImage(filename, gray = True, downSample = True) :
    # 读取 DNG 图片
    with rawpy.imread(filename) as raw:
        # 如果 不做下采样，直接返回
        if downSample is False:
            newImage = raw.postprocess(demosaic_algorithm=DemosaicAlgorithm.VNG)
            # bgr3通道转灰度图
            if gray:
                newImage = cv.cvtColor(newImage, cv.COLOR_BGR2GRAY)
            return newImage

        image = raw.raw_image
        # 获取 color_desc 字段
        color_desc = raw.color_desc.decode()
        #print(color_desc)

        # 下采样，RG、BG四合一成bgr三通道的图
        w,h = image.shape[:2]
        newWidth = np.uint16(w / 2)
        newHeight = np.uint16(h / 2)
        newImage = np.zeros((newWidth, newHeight, 3), dtype='uint16')
        startTime = time.perf_counter()
        print('dng file processing: ', filename)
        rangeX = range(newWidth)
        rangeY = range(newHeight)
        # 下采样得到bgr三通道16位图
        for i in rangeX:
            originI = i << 1
            for j in rangeY:
                originJ = j << 1
                # g = mean([g1,g2]) # 取两个g的平均数， 不要用mean()方法，太慢了
                # newImage[i][j] = [image[originI][originJ+1], ((image[originI+1][originJ]+image[originI+1][originJ+1]) >> 1), image[originI][originJ]]
                leftTop = image[originI][originJ] # [0][0]
                rightTop = image[originI+1][originJ] # [1][0]
                leftBottom = image[originI][originJ+1] # [0][1]
                rightBottom = image[originI+1][originJ+1] # [1][1]
                # 分别转换RGBG、GBRG、RGGB、GRBG、BGGR到BGR
                if color_desc == 'RGBG':
                    newImage[i][j] = [leftBottom, ((rightTop + rightBottom) >> 1), leftTop]
                elif color_desc == 'GBRG':
                    newImage[i][j] = [rightTop, ((leftTop + rightBottom) >> 1), leftBottom]
                elif color_desc == 'RGGB':
                    newImage[i][j] = [rightBottom, ((rightTop + leftBottom) >> 1), leftTop]
                elif color_desc == 'GRBG':
                    newImage[i][j] = [leftBottom, ((leftTop + rightBottom) >> 1), rightTop]
                elif color_desc == 'BGGR':
                    newImage[i][j] = [leftTop, ((rightTop + leftBottom) >> 1), rightBottom]

        # bgr3通道转灰度图
        if gray:
            newImage = cv.cvtColor(newImage, cv.COLOR_BGR2GRAY)

        # 默认tiff、dng读取时uint16，转换成float32格式
        # 转换成float32类型用于计算
        if params.IMAGE_FLOAT32:
            newImage = np.float32(newImage)
            print('readDNGImage format uint16 to float32')

        endTime = time.perf_counter()
        print('readDNGImage costTime %.2f ms' % ((endTime - startTime) * 1000))

        return newImage

## 读取tiff图片 (float32 的灰度图)
def readTiff (filename, gray = True) :
    image = cv.imread(filename,cv.IMREAD_UNCHANGED)
    # 转灰度图, len(image.shape) == 3 才是rgb图，len(image.shape)==2的话已经是灰度图不用再转
    if gray and len(image.shape) == 3:
        image = cv.cvtColor(image, cv.COLOR_BGR2GRAY)

    # 默认tiff、dng读取时uint16，转换成float32格式
    # 转换成float32类型用于计算
    if params.IMAGE_FLOAT32:
        image = np.float32(image)

    return image

# 加载图片并下采样为一半的大小
def halfImage(path, gray = True):
    image = cv.imread(path)
    h, w = image.shape[:2]
    resized_image = cv.resize(image, (int(w/2), int(h/2)))
    # 转灰度图, len(image.shape) == 3 才是rgb图，len(image.shape)==2的话已经是灰度图不用再转
    if gray and len(resized_image.shape) == 3:
        resized_image = cv.cvtColor(resized_image, cv.COLOR_BGR2GRAY)

    return resized_image

# 16位图转8位
def img2U8(srcImage):
    img_laplace = cv.normalize(srcImage, None, alpha=0, beta=255, norm_type=cv.NORM_MINMAX, dtype=cv.CV_8UC1)
    return img_laplace

# 保存tiff图
# tags = {'ISO':90, "ExposureTime":(1,1000)}
def saveTiff(srcImg, savePath, tags):
    cv.imwrite(savePath, srcImg, [cv.IMWRITE_TIFF_COMPRESSION, 1])
    # 读取EXIF信息
    exifData = piexif.load(savePath)
    # 修改EXIF信息
    if 'ISO' in tags:
        exifData["Exif"][piexif.ExifIFD.ISOSpeedRatings] = tags['ISO']
    if 'ExposureTime' in tags:
        exifData["Exif"][piexif.ExifIFD.ExposureTime] = tags['ExposureTime']
    # 将修改后的EXIF信息写入图像
    image = Image.open(savePath)
    exifBytes = piexif.dump(exifData)
    image.save(savePath, exif = exifBytes)
    return

# 保存tiff文件iso信息
def saveTiffISO(tiffPath, tags):
        # 读取EXIF信息
    # exifData = piexif.load(tiffPath)
    exifData = {
        "Exif":{piexif.ExifIFD.ISOSpeedRatings: 0, piexif.ExifIFD.ExposureTime: (0, 0)}
    }
    # 修改EXIF信息         tags = {'ISO':ISO_DNG, "ExposureTime":exposureTime_DNG}

    if 'ISO' in tags:
        exifData["Exif"][piexif.ExifIFD.ISOSpeedRatings] = tags['ISO']
    if 'ExposureTime2' in tags:
        exifData["Exif"][piexif.ExifIFD.ExposureTime] = tags['ExposureTime']

    image = Image.open(tiffPath)
    # 将修改后的EXIF信息写入图像
    exifBytes = piexif.dump(exifData)
    image.save(tiffPath, exif = exifBytes)

import exifread
# tags = ['Image ISOSpeedRatings','Image ExposureTime']
# 根据tag读取图片exif信息
def getExifInfo(imgPath, tags):
    values = []
    with open(imgPath, 'rb') as f:
        # 使用 exifread 读取 Exif 信息
        tagInfos = exifread.process_file(f)
    for tag in tags:
        # 获取exif信息的值
        if tag in tagInfos:
            value = tagInfos[tag].values[0]
            values.append(value)
        else:
            values.append(None)
    return values