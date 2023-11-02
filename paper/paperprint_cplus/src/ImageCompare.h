#pragma once

#include <string>
#include <opencv2/opencv.hpp>

class QRCodePaperImage;
class DertImage;

/// @brief 图片处理类，对小图进行图像处理，计算相关性
class ImageCompare
{
public:
	ImageCompare(std::string regImagePath, std::string verifiImgPath);
	void init();
	bool isSame();
	/// @brief 配准
	/// @param  
	void algin(int qrCodeWidth);

	void cutImgs(int qrCodeWidth);

	void calc(std::shared_ptr<QRCodePaperImage> regImage, std::shared_ptr<QRCodePaperImage> verifiImg);

	void calc(std::shared_ptr<QRCodePaperImage> regImage, std::shared_ptr<DertImage> verifiImg);

	std::vector<std::pair<double, cv::Point>> findMax(cv::Mat result, int size = 10);

	std::vector<std::pair<double, cv::Point>> calcCCOEFF(cv::Mat image, cv::Mat templateImage);

	cv::Mat cutVerifiImages(cv::Mat srcImage);

	double compareImg(cv::Mat img1, cv::Mat img2);

	void batchingCompareImgs(const std::vector<cv::Mat>& regImages, const std::vector<cv::Mat>& verifiImages, std::vector<double>& same, std::vector<double>& notSame, std::vector<std::string>& notSameIndex);

	double avgValue(double v1, double v2);

	void compare(int qrCodeWidth);

	/// @brief 注册图和核验图中是否有二维码识别错误的
	bool isParseQRCodeException();

	std::vector<double> getTrueResults();

	std::vector<double> getFalseResults();
	void useDertImage(std::string j1ImagePath);
public:
	std::shared_ptr<DertImage> dertImage;
	
	std::string m_regImagePath;
	std::string m_verifiImgPath;

	std::shared_ptr<QRCodePaperImage> regImage;
	std::shared_ptr<QRCodePaperImage> verifiImg;
	std::shared_ptr<QRCodePaperImage> verifiJ1Img;

	std::vector<double> trueResults;
	std::vector<double> falseResults;
	double minTrueResult; // 相同区域最小结果
	double avgTrueResult; // 相同区域平均结果
	double maxFalseResult; // 不同区域最大值
	double spanResult; // 相同区域最小值 - 不同区域最大值


	std::vector<double> trueResultsDertImg;
	std::vector<double> falseResultsDertImg;
	double minTrueResultDertImg; // 相同区域最小结果
	double avgTrueResultDertImg; // 相同区域平均结果
	double maxFalseResultDertImg; // 不同区域最大值
	double spanResultDertImg; // 相同区域最小值 - 不同区域最大值

	std::vector<cv::Mat> m_regImagesCut; // 裁剪4个纸纹图片
	std::vector<cv::Mat> m_verifiImagesCut;

};

