#pragma once

#include <opencv2/opencv.hpp>
#include <vector>

/// @brief 二维码解析工具类，返回二维码解析后的必要信息
class QRCodeParser
{
public:

	bool parseQrCodeImage(cv::Mat srcImg);

	bool parseQrCodeImage(std::string imgPath);

	bool scanQRCodeOpencv();

	bool scanQRCodeWX();

	std::vector<cv::Point> getPoints();

	std::string getText();

	cv::Size getShape();

	static float calcBlockwidth(const cv::Mat& calcBlockImg, const std::vector<cv::Point>& points, int qrCodeWidth, cv::Size qrShape);

public:
	cv::Mat m_srcImg;
	std::vector<cv::Point> m_points;
	std::string m_qrText = "";
	cv::Size m_qrShape;
};

