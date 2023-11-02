#include "DertImage.h"
#include "QRCodePaperImage.h"
#include "PreprocessImageTool.h"

DertImage::DertImage(std::shared_ptr<QRCodePaperImage> j1Image, std::shared_ptr<QRCodePaperImage> j2Image) :
	m_j1Image(j1Image), m_j2Image(j2Image)
{

}

// ָ��ͼԤ����
std::vector<cv::Mat> DertImage::preProcess()
{
	ppCutImages = PreprocessImageTool::preProcessBatching(cutImages, "xy");
	return ppCutImages;
}


// ָ��ͼԤ����
std::vector<cv::Mat> DertImage::preProcessX()
{
	ppCutImagesX = PreprocessImageTool::preProcessBatching(cutImages, "x");
	return ppCutImagesX;
}


// ָ��ͼԤ����
std::vector<cv::Mat> DertImage::preProcessY()
{
	ppCutImagesY = PreprocessImageTool::preProcessBatching(cutImages, "y");
	return ppCutImagesY;
}



// ��ȡ�ü���ֽ��ͼ��ͼ
std::vector<cv::Mat> DertImage::cutImgs()
{
	cutImages = calucDertImage();
	return cutImages;
}

// ����J2��J1�Ĳ�ͼ(��ҪJ2��J1��׼֮�������ͼ)
// ���㹫ʽ: DertJ = J2 - ((exposureTime2 * iso2) / (exposureTime1 * iso1)) * J1
std::vector<cv::Mat> DertImage::calucDertImage()
{
    std::vector<cv::Mat> j2CutImages = m_j2Image->m_cutImages;
    double exposureTime2 = m_j2Image->tiffExposureTime; // tiff��Ϣ �ع�ʱ��
    double iso2 = m_j2Image->tiffISO; // tiff��Ϣ ISO�����ٶ�

    std::vector<cv::Mat> j1CutImages = m_j1Image->m_cutImages;
    double exposureTime1 = m_j1Image->tiffExposureTime;
    double iso1 = m_j1Image->tiffISO;

    double coeffValue = 1.0;
    if (0.0 != (exposureTime1 * iso1))
    {
        coeffValue = (exposureTime2 * iso2) / (exposureTime1 * iso1);
    }
    std::vector<cv::Mat> cutImages;
    // �ֱ�����ĸ�ֽ�����Ĳ�ͼ
    for (int i = 0; i < j2CutImages.size(); i++)
    {
        cv::Mat ppImg2 = j2CutImages[i];
        cv::Mat ppImg1 = j1CutImages[i];
        cv::Mat dert = ppImg2 - ppImg1 * coeffValue;
        //dert.convertTo(dert, CV_32F);
        cutImages.push_back(dert);
    }
    return cutImages;
}
    

