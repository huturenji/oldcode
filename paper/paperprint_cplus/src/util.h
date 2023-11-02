#pragma once
#include <string>

#include <opencv2/opencv.hpp>
class util
{
public:

	static cv::Mat loadPaperImage(std::string fileName, bool gray = true);

	static cv::Mat readTiff(std::string filename, bool gray = true);

	static void img2U8(cv::Mat& srcImage);
	static cv::Mat readDNGImage(const std::string filename, bool gray = true);
	static float getExifInfo(const std::string& filename, const std::string& tag);

	static cv::Mat resizeDownsampling(const cv::Mat& src, bool gray, int resizeNum);
	
};

