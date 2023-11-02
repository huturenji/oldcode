#pragma once
#include <opencv2/opencv.hpp>
#include <string>
/// @brief OpenCV基础算法的封装类
class PreprocessImageTool
{
public:
    // 对图片计算sobel梯度（用于去光照）
    static cv::Mat sobelImg(cv::Mat srcImg, std::string name);
    // sobel
    static cv::Mat removeLight(cv::Mat srcImg, std::string direction = "xy");

    // 高斯平滑处理
    static cv::Mat gaussianImage(cv::Mat srcImg);

    // 预处理
    static cv::Mat preProcess(cv::Mat ppImg, std::string direction = "xy");

    // 批量处理
    static std::vector<cv::Mat> preProcessBatching(std::vector<cv::Mat> ppImgs, std::string direction = "xy");
};

