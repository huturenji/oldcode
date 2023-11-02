#pragma once

#include <opencv2/opencv.hpp>

/// @brief 二维码图片处理类，处理二维码识别、裁剪出4个小图
class QRCodePaperImage
{
public:
    
    QRCodePaperImage(std::string filePath, int type);

    void init();

    void parseQRCodeInfo(cv::Mat image);

    int calcuQrCodeWidth(std::vector<cv::Point> points);
    cv::Point calcuQrCodeCenterPoint(const std::vector<cv::Point>& points);
    cv::Mat getSmallImage(cv::Mat originImage, int qrWidth, cv::Point centerPoint);
    void alginByORB(std::vector<cv::Point> qrPointsOrigin, int qrCodeWidth, cv::Mat baseImg = cv::Mat());
    std::vector<cv::Mat> calcCutImage(cv::Mat srcImage, const std::vector<cv::Point>& qrPoints, int qrCodeWidth, int cutWidth, int cutHeight, int padding);
    std::vector<cv::Mat> preProcess();
    std::vector<cv::Mat> preProcessX();
    std::vector<cv::Mat> preProcessY();
    void alginByQRCode(int qrCodeWidth);
    /*
     * 确定原始二维码4个顶点, 以二维码在原始图片中左下角、左上角、右上角、右下角顺序返回
     */
    std::vector<cv::Point> adjustPoints(std::vector<cv::Point> originPoints);
    cv::Mat imageWarp(int qrCodeWidth);
    /*
     * 判断注册图能否直接裁剪（裁剪区域和二维码是否相交）
     */
    bool checkCutImg(int cutPadding);
    std::vector<cv::Mat> cutImgs(int qrCodeWidth, int cutWidth, int cutHeight, int padding);
    /*
     * 跨立实验
     */
    int cross(cv::Point p1, cv::Point p2, cv::Point p3);

    /*
     * 判断两线段是否相交
     */
    bool hasIntersect(cv::Point p1, cv::Point p2, cv::Point p3, cv::Point p4);

    cv::Mat drawRect(cv::Mat img, int x, int y, int w, int h, int index = 0);

public:

    int m_type = 1;    // 0 注册图， 1 核验图
    std::string m_filePath = "";// 原始文件路径
    std::string filename = "";// 文件名

    // 从图片tiff信息中读取iso和曝光时间，用于后续计算差图DertImage
    float tiffISO;// tiff信息 ISO快门速度
    float tiffExposureTime;// tiff信息 曝光时间

    cv::Mat originImageOld;// 原图（灰度图）
    cv::Mat m_originImage;// 原图 以二维码中心裁剪出来足够区域作为后续计算的图片（灰度图）

    cv::Mat warpImage;// 配准后的图片
    //cv::Mat m_warpImage;

    cv::Mat cutShowImage;// 透射变换后并画了裁剪区域边框的图，只做显示用
    std::vector<cv::Mat> m_cutImages;// 裁剪的指纹图小图列表 上下左右的小图
    std::vector<cv::Mat> ppCutImages;// (sobel X、Y轴都处理)已经预处理过的纸纹小图列表(sobel、高斯后的) 上下左右的小图
    std::vector<cv::Mat> ppCutImagesX;// (sobel X轴处理)已经预处理过的纸纹小图列表(sobel、高斯后的) 上下左右的小图
    std::vector<cv::Mat> ppCutImagesY;// (sobel Y轴处理)已经预处理过的纸纹小图列表(sobel、高斯后的) 上下左右的小图

    std::string qrText = "";// 二维码内容
    std::vector<cv::Point> qrPointsOrigin;// 原图的二维码顶点[左下、左上、右上、右下]
    std::vector<cv::Point> qrPoints;// 透视变换后的二维码顶点[左下、左上、右上、右下]
    std::vector<cv::Point> qrPointsNew;// 透视变换、重新识别二维码后的二维码顶点[左下、左上、右上、右下]
    int qrWidthOrigin;// 原图的二维码宽度
    int qrWidth;// 透射变换后的二维码宽度
    cv::Mat qrWidthNew;// 透射变换、重新识别二维码后的二维码宽度

    float qrBlockWidth;// 透射变换校正后的二维码block大小

    cv::Point qrCodeCenterPointOrigin;// 原图的二维码中心点
    cv::Point qrCodeCenterPointNew;// 透射变换、重新识别二维码后的二维码中心点

    // 二维码解析状态，在使用时应先判断状态是否“二维码解析成功”
    bool parseStatus = true;
    
    //int qrShape; // 二维码大小，如(21X21)
    cv::Size qrShape;

private:
    int distanceToOrigin(int x, int y);
    
};

