#pragma once
#include <opencv2/opencv.hpp>
#include <string>
/// @brief OpenCV�����㷨�ķ�װ��
class PreprocessImageTool
{
public:
    // ��ͼƬ����sobel�ݶȣ�����ȥ���գ�
    static cv::Mat sobelImg(cv::Mat srcImg, std::string name);
    // sobel
    static cv::Mat removeLight(cv::Mat srcImg, std::string direction = "xy");

    // ��˹ƽ������
    static cv::Mat gaussianImage(cv::Mat srcImg);

    // Ԥ����
    static cv::Mat preProcess(cv::Mat ppImg, std::string direction = "xy");

    // ��������
    static std::vector<cv::Mat> preProcessBatching(std::vector<cv::Mat> ppImgs, std::string direction = "xy");
};

