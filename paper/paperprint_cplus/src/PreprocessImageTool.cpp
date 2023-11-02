#include "PreprocessImageTool.h"
#include "Params.h"
#include <opencv2/opencv.hpp>
#include <vector>

// ��ͼƬ����sobel�ݶȣ�����ȥ���գ�
cv::Mat PreprocessImageTool::sobelImg(cv::Mat srcImg, std::string name) 
{
    // ���� Sobel �ˣ�x��y��ʾ���������й���
    cv::Mat sobel_kernel_x = (cv::Mat_<float>(3, 3) << -1, 0, 1, -2, 0, 2, -1, 0, 1);
    cv::Mat sobel_kernel_y = (cv::Mat_<float>(3, 3) << -1, -2, -1, 0, 0, 0, 1, 2, 1);

    // �ԻҶ�ͼ����� Sobel ����
    cv::Mat grad_x, grad_y;
    cv::filter2D(srcImg, grad_x, -1, sobel_kernel_x);
    cv::filter2D(srcImg, grad_y, -1, sobel_kernel_y);

    // ��һ����0-255
    cv::Mat sobel_result = 0.5 * (grad_x + grad_y);
    sobel_result.convertTo(sobel_result, CV_8U);

    // sobel 3*3 ���������ھ����ԵһȦ��ֵ�ǲ�׼ȷ�ģ���ȥ��
    if (Params::SOBEL_1) {
        sobel_result = sobel_result(cv::Rect(1, 1, sobel_result.cols - 2, sobel_result.rows - 2));
    }

    return sobel_result;
}

// sobel
cv::Mat PreprocessImageTool::removeLight(cv::Mat srcImg, std::string direction) 
{
    // ȥ������
    cv::Mat result = srcImg.clone();
    cv::Mat sobel_result;

    // ���� Sobel ��Ե
    if (direction == "xy") {
        cv::Mat sobel_x, sobel_y;
        cv::Sobel(result, sobel_x, CV_32F, 1, 0, 3);
        cv::Sobel(result, sobel_y, CV_32F, 0, 1, 3);
        cv::addWeighted(sobel_x, 0.5, sobel_y, 0.5, 0, sobel_result);
    }
    else if (direction == "x") {
        cv::Sobel(result, sobel_result, CV_32F, 1, 0, 3);
    }
    else if (direction == "y") {
        cv::Sobel(result, sobel_result, CV_32F, 0, 1, 3);
    }

    // sobel 3*3 ���������ھ����ԵһȦ��ֵ�ǲ�׼ȷ�ģ���ȥ��
    if (Params::SOBEL_1) {
        sobel_result = sobel_result(cv::Rect(1, 1, sobel_result.cols - 2, sobel_result.rows - 2));
    }

    return sobel_result;
}

// ��˹ƽ������
cv::Mat PreprocessImageTool::gaussianImage(cv::Mat srcImg) {
    int size = Params::GAUSSIAN_SIZE;
    double sigma = Params::GAUSSIAN_SIGMA;
    cv::Mat gaussResult;
    cv::GaussianBlur(srcImg, gaussResult, cv::Size(size, size), sigma);

    return gaussResult;
}

// Ԥ����
cv::Mat PreprocessImageTool::preProcess(cv::Mat ppImg, std::string direction) {
    // sobel ����
    cv::Mat imgRet = removeLight(ppImg, direction);

    // ��˹ƽ������
    imgRet = gaussianImage(imgRet);

    return imgRet;
}

// ��������
std::vector<cv::Mat> PreprocessImageTool::preProcessBatching(std::vector<cv::Mat> ppImgs, std::string direction) {
    std::vector<cv::Mat> retImages;
    for (const auto& img : ppImgs) {
        cv::Mat ppImg = preProcess(img, direction);
        retImages.push_back(ppImg);
    }
    return retImages;
}
