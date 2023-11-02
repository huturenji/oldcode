'''
Author: miaoju jun.miao@sinosun.com.cn
Date: 2023-06-30 16:15:28
LastEditors: miaoju jun.miao@sinosun.com.cn
LastEditTime: 2023-08-02 17:27:17
FilePath: /paperprintpy/PreprocessImage.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
'''
图片预处理：
    1、sobel去光照
    2、对sobel结果的图进行高斯模糊
'''

import cv2 as cv
import numpy as np
import params
# 对图片计算sobel梯度（用于去光照）
def sobelImg(srcImg, name):
    # 定义 Sobel 核，x、y表示两个方向都有光照
    sobel_kernel_x = np.array([[-1, 0, 1],
                            [-2, 0, 2],
                            [-1, 0, 1]])

    sobel_kernel_y = np.array([[-1, -2, -1],
                            [0, 0, 0],
                            [1, 2, 1]])

    # 对灰度图像进行 Sobel 运算
    grad_x = cv.filter2D(srcImg, -1, sobel_kernel_x)
    grad_y = cv.filter2D(srcImg, -1, sobel_kernel_y)

    # // 归一化到0-255
    sobel_result = cv.addWeighted(grad_x, 0.5, grad_y, 0.5, 0)
    sobel_result = cv.normalize(sobel_result, None, alpha=0, beta=255, norm_type=cv.NORM_MINMAX, dtype=cv.CV_8U)
    
    # sobel3*3矩阵卷积，在矩阵边缘一圈的值是不准确的，给去掉
    if params.SOBEL_1:
        h,w=sobel_result.shape[:2]
        sobel_result = sobel_result[1:h-1, 1:w-1]

    return sobel_result

# sobel
def removeLight(srcImg, direction='xy'):
    cv2= cv
    # 去掉光照
    # blurred = cv2.GaussianBlur(srcImg, (17, 17), 4)
    # result = cv2.divide(srcImg, blurred, scale=256)
    result = np.float32(srcImg)
    # 计算 Sobel 边缘
    if direction == 'xy':
        sobel_x = cv2.Sobel(result, cv2.CV_32F, 1, 0, ksize=3)
        sobel_y = cv2.Sobel(result, cv2.CV_32F, 0, 1, ksize=3)
        sobel_result = cv2.addWeighted(sobel_x, 0.5, sobel_y, 0.5, 0)
    elif direction == 'x':
        sobel_result = cv2.Sobel(result, cv2.CV_32F, 1, 0, ksize=3)
    elif direction == 'y':
        sobel_result = cv2.Sobel(result, cv2.CV_32F, 0, 1, ksize=3)

    # miaoju 0707 实测不做归一化和做了归一化，结果一毛一样，所以去掉归一化步骤
    # gaiU8 使用float32模式时，不做uint8转换
    # if params.IMAGE_FLOAT32 == False:
        # 图片像素归一化到0-255
        # sobel_result = cv.normalize(sobel_result, None, alpha=0, beta=255, norm_type=cv.NORM_MINMAX, dtype=cv.CV_8U)

    # sobel3*3矩阵卷积，在矩阵边缘一圈的值是不准确的，给去掉
    if params.SOBEL_1:
        h,w=sobel_result.shape[:2]
        sobel_result = sobel_result[1:h-1, 1:w-1]

    return sobel_result

# 高斯平滑处理
def gaussianImage(srcImg) :
    size = params.GAUSSIAN_SIZE
    sigma = params.GAUSSIAN_SIGMA
    # sigma = 0.3 * ((size - 1) / 2 -1 + 0.8)
    gaussResult = cv.GaussianBlur(srcImg, (size, size), sigma)

    return gaussResult

# ppImg: 
def preProcess(ppImg, direction='xy'):
    # sobel处理
    ppImg = removeLight(ppImg, direction)
    # ppImg = sobelImg(ppImg,"ppImg4-%s"%type)[0]

    # 高斯平滑处理
    ppImg = gaussianImage(ppImg)
    return ppImg

# 批量处理
def preProcessBatching(ppImgs, direction='xy'):
    retImages = []
    for img in ppImgs:
        ppImg = preProcess(img, direction)
        retImages.append(ppImg)
    return retImages