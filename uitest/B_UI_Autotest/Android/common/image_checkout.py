# -*- coding: utf-8 -*-
# @time     : 2021/12/9 16:44
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : image_checkout_.py

import os
import cv2
import imutils
from skimage.metrics import structural_similarity
from common.contants import IMG_DIR, REPORT_DIR


class ImageCheckout:

    def __init__(self, original_image, capture_image):
        """
        :param original_image: 对照标准图的绝对路径
        :param capture_image: 执行用例时截图的绝对路径
        """
        self.original_image = cv2.imread(original_image)
        self.capture_image = cv2.imread(capture_image)

    def processing_images(self, y0=0.06, y1=1, x0=0, x1=1):
        """
        获取的图片可以根据比例剪裁，去除不想要的部分；
        注意：仅适用于大小相同，格式相同的图片。
        :param y0: 距离图片顶部的比例，默认取值0.06
        :param y1: 距离图片顶部的比例，默认取值1
        :param x0: 距离图片左侧的比例，默认取值0
        :param x1: 距离图片左侧的比例，默认取值1
        :return: 返回裁剪的图片
        """
        # 读取图像，读取后为BGR格式数据
        img_1 = self.original_image
        img_2 = self.capture_image
        # 获取图片的尺寸，返回值为一个元组，元素分别为高，宽，通道数
        image_size = img_1.shape
        y0 = int(image_size[0] * y0)  # 计算y0的像素
        y1 = int(image_size[0] * y1)  # 计算y1的像素
        x0 = int(image_size[1] * x0)  # 计算x0的像素
        x1 = int(image_size[1] * x1)  # 计算x1的像素
        # 剪裁图片
        original_image = img_1[y0:y1, x0:x1]
        capture_image = img_2[y0:y1, x0:x1]
        return original_image, capture_image

    def compare_image(self):
        """
        计算两个灰度图像之间的结构相似度
        :return:score，相似度;为1时表示完全匹配
        """
        # 导入需要比较的图片
        original_image, capture_image = self.processing_images()
        # 颜色空间转换函数，将BGR格式转换成灰度图像
        gray_1 = cv2.cvtColor(original_image, cv2.COLOR_BGR2GRAY)
        gray_2 = cv2.cvtColor(capture_image, cv2.COLOR_BGR2GRAY)
        # 计算两个灰度图像之间的结构相似度指数：
        (score, diff) = structural_similarity(gray_1, gray_2, full=True)
        diff = (diff * 255).astype("uint8")
        return score, diff

    def mark_image(self, value):
        """
        找到两个图像不同点的轮廓，并在被标识为“不同”的区域周围放置矩形
        :param value: 标记图像名称
        :return: 返回已标记图像的保存路径
        """
        original_image, capture_image = self.processing_images()
        # 导入处理的图像
        score, diff = self.compare_image()
        # 全局自适应阈值分割（二值化），返回值有两个，第一个是阈值，第二个是二值图像
        thresh = cv2.threshold(diff, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
        # findContours找轮廓，返回值有两个，第一个是轮廓信息，第二个是轮廓的层次信息（“树”状拓扑结构）
        cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        # 取findContours函数的第一个返回值，即取轮廓信息
        cnts = cnts[0] if imutils.is_cv3() else cnts[0]
        # 找到一系列区域，在区域周围放置矩形：
        for c in cnts:
            (x, y, w, h) = cv2.boundingRect(c)
            cv2.rectangle(original_image, (x, y), (x + w, y + h), (0, 0, 255), 2)
            cv2.rectangle(capture_image, (x, y), (x + w, y + h), (0, 0, 255), 2)
        # cv2.imwrite 保存最终标记过的结果图片
        img_path = os.path.join(REPORT_DIR, "{}.png".format(value))
        # 标记的图片为：执行用例时的截图
        cv2.imwrite(img_path, capture_image)
        # 展示标记图片
        # cv2.imshow("Modified", capture_image)
        # cv2.waitKey(0)
        return img_path


if __name__ == '__main__':
    a = ImageCheckout("./111.png", "./444.png").compare_image()[0]
    print(type(a), a)
    ImageCheckout("./111.png", "./444.png").mark_image()
