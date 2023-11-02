#pragma once

#include <string>
#include <opencv2/opencv.hpp>

class QRCodePaperImage;
class DertImage;

/// @brief ͼƬ�����࣬��Сͼ����ͼ�������������
class ImageCompare
{
public:
	ImageCompare(std::string regImagePath, std::string verifiImgPath);
	void init();
	bool isSame();
	/// @brief ��׼
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

	/// @brief ע��ͼ�ͺ���ͼ���Ƿ��ж�ά��ʶ������
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
	double minTrueResult; // ��ͬ������С���
	double avgTrueResult; // ��ͬ����ƽ�����
	double maxFalseResult; // ��ͬ�������ֵ
	double spanResult; // ��ͬ������Сֵ - ��ͬ�������ֵ


	std::vector<double> trueResultsDertImg;
	std::vector<double> falseResultsDertImg;
	double minTrueResultDertImg; // ��ͬ������С���
	double avgTrueResultDertImg; // ��ͬ����ƽ�����
	double maxFalseResultDertImg; // ��ͬ�������ֵ
	double spanResultDertImg; // ��ͬ������Сֵ - ��ͬ�������ֵ

	std::vector<cv::Mat> m_regImagesCut; // �ü�4��ֽ��ͼƬ
	std::vector<cv::Mat> m_verifiImagesCut;

};

