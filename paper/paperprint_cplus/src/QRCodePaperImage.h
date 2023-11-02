#pragma once

#include <opencv2/opencv.hpp>

/// @brief ��ά��ͼƬ�����࣬�����ά��ʶ�𡢲ü���4��Сͼ
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
     * ȷ��ԭʼ��ά��4������, �Զ�ά����ԭʼͼƬ�����½ǡ����Ͻǡ����Ͻǡ����½�˳�򷵻�
     */
    std::vector<cv::Point> adjustPoints(std::vector<cv::Point> originPoints);
    cv::Mat imageWarp(int qrCodeWidth);
    /*
     * �ж�ע��ͼ�ܷ�ֱ�Ӳü����ü�����Ͷ�ά���Ƿ��ཻ��
     */
    bool checkCutImg(int cutPadding);
    std::vector<cv::Mat> cutImgs(int qrCodeWidth, int cutWidth, int cutHeight, int padding);
    /*
     * ����ʵ��
     */
    int cross(cv::Point p1, cv::Point p2, cv::Point p3);

    /*
     * �ж����߶��Ƿ��ཻ
     */
    bool hasIntersect(cv::Point p1, cv::Point p2, cv::Point p3, cv::Point p4);

    cv::Mat drawRect(cv::Mat img, int x, int y, int w, int h, int index = 0);

public:

    int m_type = 1;    // 0 ע��ͼ�� 1 ����ͼ
    std::string m_filePath = "";// ԭʼ�ļ�·��
    std::string filename = "";// �ļ���

    // ��ͼƬtiff��Ϣ�ж�ȡiso���ع�ʱ�䣬���ں��������ͼDertImage
    float tiffISO;// tiff��Ϣ ISO�����ٶ�
    float tiffExposureTime;// tiff��Ϣ �ع�ʱ��

    cv::Mat originImageOld;// ԭͼ���Ҷ�ͼ��
    cv::Mat m_originImage;// ԭͼ �Զ�ά�����Ĳü������㹻������Ϊ���������ͼƬ���Ҷ�ͼ��

    cv::Mat warpImage;// ��׼���ͼƬ
    //cv::Mat m_warpImage;

    cv::Mat cutShowImage;// ͸��任�󲢻��˲ü�����߿��ͼ��ֻ����ʾ��
    std::vector<cv::Mat> m_cutImages;// �ü���ָ��ͼСͼ�б� �������ҵ�Сͼ
    std::vector<cv::Mat> ppCutImages;// (sobel X��Y�ᶼ����)�Ѿ�Ԥ�������ֽ��Сͼ�б�(sobel����˹���) �������ҵ�Сͼ
    std::vector<cv::Mat> ppCutImagesX;// (sobel X�ᴦ��)�Ѿ�Ԥ�������ֽ��Сͼ�б�(sobel����˹���) �������ҵ�Сͼ
    std::vector<cv::Mat> ppCutImagesY;// (sobel Y�ᴦ��)�Ѿ�Ԥ�������ֽ��Сͼ�б�(sobel����˹���) �������ҵ�Сͼ

    std::string qrText = "";// ��ά������
    std::vector<cv::Point> qrPointsOrigin;// ԭͼ�Ķ�ά�붥��[���¡����ϡ����ϡ�����]
    std::vector<cv::Point> qrPoints;// ͸�ӱ任��Ķ�ά�붥��[���¡����ϡ����ϡ�����]
    std::vector<cv::Point> qrPointsNew;// ͸�ӱ任������ʶ���ά���Ķ�ά�붥��[���¡����ϡ����ϡ�����]
    int qrWidthOrigin;// ԭͼ�Ķ�ά����
    int qrWidth;// ͸��任��Ķ�ά����
    cv::Mat qrWidthNew;// ͸��任������ʶ���ά���Ķ�ά����

    float qrBlockWidth;// ͸��任У����Ķ�ά��block��С

    cv::Point qrCodeCenterPointOrigin;// ԭͼ�Ķ�ά�����ĵ�
    cv::Point qrCodeCenterPointNew;// ͸��任������ʶ���ά���Ķ�ά�����ĵ�

    // ��ά�����״̬����ʹ��ʱӦ���ж�״̬�Ƿ񡰶�ά������ɹ���
    bool parseStatus = true;
    
    //int qrShape; // ��ά���С����(21X21)
    cv::Size qrShape;

private:
    int distanceToOrigin(int x, int y);
    
};

