
'''
Author: miaoju jun.miao@sinosun.com.cn
Date: 2023-06-01 10:55:38
LastEditors: miaoju jun.miao@sinosun.com.cn
LastEditTime: 2023-08-09 17:12:35
FilePath: /testPy/main.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
#!/usr/bin/env python
# -*- coding=UTF-8 -*-
# -*-coding:utf-8 -*-
 
import params as params
from ImageCompare import ImageCompare

# 单组图片对比
def imageCompare(regFilePath, verifiFilePath, verifiJ1FilePath = ""):
    #print(" --- PaperPrintCompare.singleTest ---")

    imageCompare = ImageCompare(regFilePath,verifiFilePath)
    # 首先判断下核验图与注册图有没有二维码识别失败的, 二维码识别失败直接return
    if imageCompare.isParseQRCodeException() :
        return "qrCode parse failed", imageCompare
    #  如果有J1参与，同时计算差图
    if verifiJ1FilePath != "":
        imageCompare.useDertImage(verifiJ1FilePath)
    # 返回相同位置（上、下、左、右）、不同位置（上下、下上、左右、右左）的相关系数值
    resultsTrue, resultsFalse, resultsTrueDertImg, resultsFalseDertImg  = imageCompare.compare(params.QRCODE_WIDTH) # -1 表示以注册图、核验图二维码边长小的做配准

    return resultsTrue, resultsFalse, resultsTrueDertImg, resultsFalseDertImg, imageCompare
