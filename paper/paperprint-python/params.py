'''
Author: miaoju jun.miao@sinosun.com.cn
Date: 2023-06-28 16:20:42
LastEditors: miaoju jun.miao@sinosun.com.cn
LastEditTime: 2023-09-04 13:23:32
FilePath: /paperprint-py/params.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
'''
定义各种配置参数
'''

MIN_TRUE = 0.4 # 根据相关系数评价为真的 最小阈值

IMAGE_FLOAT32 = True # 读取dng、tiff image数据为float32类型来处理(否则默认是uint16)

QRCODE_ALGIN_FORCE = True # 强制使用二维码配准，false时会先使用orb配准，裁图有问题才会使用二维码配准，true时直接优先使用二维码配准

ORB_BY_ARER = 2 # orb关键点位置，0 整个二维码， 1 二维码四条边，2 二维码4个回字区域

# 透视变换时二维码基准边长, -1 表示以注册图大小为准，否则以指定值为基准,如200、300
QRCODE_WIDTH = -1

# 裁剪纸纹比对区域的大小，-1表示以二维码大小裁剪, [padding,width,height]
# padding：裁剪纸纹图距离二维码的距离, 负整数表示block的倍数，如-1，正整数表示指定的大小比如10
# width：裁剪的纸纹图width, 目前只处理了默认-1，取二维码宽度
# height: 裁剪纸纹图的短边高度, 负整数表示block的倍数，如-2，-5，正整数表示指定的大小比如30、50
CUT_SIZE = [10, -1, -3]

# 计算结果难以确认时需要重新移位计算阈值范围
RECALCULATE_THRESHOLD = [0.2, 0.4]
# RECALCULATE_THRESHOLD = [-1, 1]

# 模版匹配范围，核验图比对上下左右位移像素范围
MATCH_POSITION = 3

# sobel后的高斯模糊参数,越大越模糊
GAUSSIAN_SIZE = 9 # 17
GAUSSIAN_SIGMA = 3 # 4

SOBEL_CALC_AVG = True # ture 将sobel x、y分别计算相关性后取平均值；false 为sobelx、y后再直接计算相关性

# sobel3*3矩阵卷积，在矩阵边缘一圈的值是不准确的，给去掉
SOBEL_1 = False

# 异常参数阈值设置（minTrue、maxFalse、span） 
EXCEPITON_MIN_TRUE = 0.4 # 真图相同区域最小相关系数小于阈值认为异常
EXCEPITON_MAX_FALSE = 0.3 # 假图相关系数大于阈值认为异常
EXCEPITON_SPAN = 0.2 # 真图、假图相关系数间隔小于0.2的认为有异常

# 测试报告参数
SAVE_ORIGIN_IMAGE = True # 是否保存原始对比图
SAVE_CUT_IMAGE = True # 是否保存配准对比图
SAVE_COMPARE_IMAGE = True # 是否保存每个裁剪的纸纹图的对比图
SAVE_TIFF_PPIMAGE = True # 是否保存裁剪后的纸纹tiff图
SAVE_FALSE_IMAGE = True # 是否保存假图的过程图，false的话以上都不保存
SAVE_COMPARE_HIST_IMAGE = True # 是否保存每组对比结果直方图

# 拼接记录日志用的参数集合信息
def getTestParams():
    PARAMS_PRINT = "RECALCULATE_THRESHOLD[%s], QRCODE_WIDTH[%d], CUT_SIZE%s, MATCH_POSITION[%d], GAUSSIAN[%d,%d]" %(RECALCULATE_THRESHOLD, QRCODE_WIDTH, CUT_SIZE, MATCH_POSITION, GAUSSIAN_SIZE, GAUSSIAN_SIGMA)
    print(" ----- params set ----------------------------")
    print(PARAMS_PRINT)
    return PARAMS_PRINT