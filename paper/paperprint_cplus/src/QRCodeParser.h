#pragma once

#include <opencv2/opencv.hpp>
#include <vector>

/// @brief ��ά����������࣬���ض�ά�������ı�Ҫ��Ϣ
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

