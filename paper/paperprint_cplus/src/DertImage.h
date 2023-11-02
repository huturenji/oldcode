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
    std::shared_ptr<QRCodePaperImage> m_j2Image; // ����ͼ J2 ������ + �����
    std::shared_ptr<QRCodePaperImage> m_j1Image; // ����ͼ J1 ������


    std::vector<cv::Mat> cutImages; // �ü���ָ��ͼСͼ�б� �������ҵ�Сͼ : j2Image.cutImages - j1Image.cutImages
    std::vector<cv::Mat> ppCutImages; // (sobel X��Y�ᶼ����)�Ѿ�Ԥ�������ֽ��Сͼ�б�(sobel����˹���) �������ҵ�Сͼ
    std::vector<cv::Mat> ppCutImagesX; // (sobel X�ᴦ��)�Ѿ�Ԥ�������ֽ��Сͼ�б�(sobel����˹���) �������ҵ�Сͼ
    std::vector<cv::Mat> ppCutImagesY; // (sobel Y�ᴦ��)�Ѿ�Ԥ�������ֽ��Сͼ�б�(sobel����˹���) �������ҵ�Сͼ
};

