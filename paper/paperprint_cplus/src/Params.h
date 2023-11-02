#pragma once
#include <vector>
class Params {
public:
    static const double MIN_TRUE; // 根据相关系数评价为真的最小阈值
    static const bool IMAGE_FLOAT32 = true; // 读取dng、tiff image数据为float32类型来处理(否则默认是uint16)
    static const bool QRCODE_ALGIN_FORCE = false; // 强制使用二维码配准，false时会先使用orb配准，裁图有问题才会使用二维码配准，true时直接优先使用二维码配准
    static const int QRCODE_WIDTH = -1; // 透视变换时二维码基准边长, -1表示以注册图大小为准，否则以指定值为基准，如200、300
    static const int CUT_SIZE[3]; // 裁剪纸纹比对区域的大小，-1表示以二维码大小裁剪, [padding,width,height]
    static const double RECALCULATE_THRESHOLD[2]; // 计算结果难以确认时需要重新移位计算阈值范围
    static const int MATCH_POSITION = 3; // 模版匹配范围，核验图比对上下左右位移像素范围
    static const int GAUSSIAN_SIZE = 9; // sobel后的高斯模糊参数，越大越模糊
    static const int GAUSSIAN_SIGMA = 3; // sobel后的高斯模糊参数，越大越模糊
    static const bool SOBEL_CALC_AVG = true; // ture将sobel x、y分别计算相关性后取平均值；false为sobelx、y后再直接计算相关性
    static const bool SOBEL_1 = false; // sobel 3*3 矩阵卷积，在矩阵边缘一圈的值是不准确的，给去掉
    static const double EXCEPITON_MIN_TRUE; // 真图相同区域最小相关系数小于阈值认为异常
    static const double EXCEPITON_MAX_FALSE; // 假图相关系数大于阈值认为异常
    static const double EXCEPITON_SPAN; // 真图、假图相关系数间隔小于0.2的认为有异常
    static const bool SAVE_ORIGIN_IMAGE = true; // 是否保存原始对比图
    static const bool SAVE_CUT_IMAGE = true; // 是否保存配准对比图
    static const bool SAVE_COMPARE_IMAGE = true; // 是否保存每个裁剪的纸纹图的对比图
    static const bool SAVE_TIFF_PPIMAGE = true; // 是否保存裁剪后的纸纹tiff图
    static const bool SAVE_FALSE_IMAGE = true; // 是否保存假图的过程图，false的话以上都不保存
    static const bool SAVE_COMPARE_HIST_IMAGE = true; // 是否保存每组对比结果直方图
};

