#pragma once
#include <opencv2/opencv.hpp>
class QRCodePaperImage;
//class cv::Mat;
class DertImage
{
public:
    DertImage(std::shared_ptr<QRCodePaperImage> j1Image, std::shared_ptr<QRCodePaperImage> j2Image);
    std::vector<cv::Mat> preProcess();
    std::vector<cv::Mat> preProcessX();
    std::vector<cv::Mat> preProcessY();
    std::vector<cv::Mat> cutImgs();
    std::vector<cv::Mat> calucDertImage();
public: 
    std::shared_ptr<QRCodePaperImage> m_j2Image; // 核验图 J2 环境光 + 闪光灯
    std::shared_ptr<QRCodePaperImage> m_j1Image; // 核验图 J1 环境光


    std::vector<cv::Mat> cutImages; // 裁剪的指纹图小图列表 上下左右的小图 : j2Image.cutImages - j1Image.cutImages
    std::vector<cv::Mat> ppCutImages; // (sobel X、Y轴都处理)已经预处理过的纸纹小图列表(sobel、高斯后的) 上下左右的小图
    std::vector<cv::Mat> ppCutImagesX; // (sobel X轴处理)已经预处理过的纸纹小图列表(sobel、高斯后的) 上下左右的小图
    std::vector<cv::Mat> ppCutImagesY; // (sobel Y轴处理)已经预处理过的纸纹小图列表(sobel、高斯后的) 上下左右的小图
};

