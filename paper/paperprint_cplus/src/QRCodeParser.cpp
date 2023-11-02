#include "QRCodeParser.h"
#include "util.h"
#include "Tools.h"
#include "SinoPaperprintErrCode.h"
#include "opencv2/wechat_qrcode.hpp"


// ������ά��, ���ض�ά�����ݺ��ĸ����㣨���¡����ϡ����ϡ����£�
bool QRCodeParser::parseQrCodeImage(cv::Mat srcImg)
{
    m_srcImg = srcImg;
    //1��ʶ���ά�룬��ȡ����λ��
    //���image ����uint8�ģ���Ҫתһ��
    //if srcImg.dtype != 'uint8':
    if (m_srcImg.type() != CV_8UC1)
    {
        util::img2U8(m_srcImg);
    }

    //ʶ���ά�룬����˳��opencv��zxingcpp��΢��
    bool ret = scanQRCodeOpencv();
    if (!ret || m_qrText.empty())
    {
        ret = scanQRCodeWX();
    }

    return ret;
}

bool QRCodeParser::parseQrCodeImage(std::string imgPath)
{
    m_srcImg = cv::imread(imgPath, cv::IMREAD_UNCHANGED);

    if (m_srcImg.empty())
    {
        return false;
    }
    if (m_srcImg.channels() == 3) {
        cv::cvtColor(m_srcImg, m_srcImg, cv::COLOR_BGR2GRAY);
    }

    //1��ʶ���ά�룬��ȡ����λ�� ���image ����uint8�ģ���Ҫתһ��
    if (m_srcImg.type() != CV_8UC1)
    {
        util::img2U8(m_srcImg);
    }

    //ʶ���ά�룬����˳��opencv��zxingcpp��΢��
    bool ret = scanQRCodeOpencv();
    if (!ret || m_qrText.empty())
    {
        ret = scanQRCodeWX();
    }
    return ret;
}

bool QRCodeParser::scanQRCodeOpencv()
{
    m_points.clear();
    // ̽���ǲ��Ƕ�ά��
    cv::QRCodeDetector qrcodeDectector;
    std::vector<cv::Point> vPoints;
    bool isQRCode;
    isQRCode = qrcodeDectector.detect(m_srcImg, vPoints);
    // ������ά��
    if (isQRCode)
    {
        cv::Mat extData;
        m_qrText = qrcodeDectector.decode(m_srcImg, vPoints, extData);
        m_qrShape = extData.size();
        // ת�� ���¡����ϡ����ϡ�����
        m_points.push_back(vPoints[3]);
        m_points.push_back(vPoints[0]);
        m_points.push_back(vPoints[1]);
        m_points.push_back(vPoints[2]);
    }
    return isQRCode;
}

bool QRCodeParser::scanQRCodeWX()
{
    m_points.clear();
    std::string currentPath = Tools::currentPath();
    //����ͼƬ����
    cv::Ptr<cv::wechat_qrcode::WeChatQRCode> detector;
    std::string detect_prototxt = currentPath + R"(\detect.prototxt)";
    std::string detect_caffe_model = currentPath + R"(\detect.caffemodel)";
    std::string sr_prototxt = currentPath + R"(\sr.prototxt)";
    std::string sr_caffe_model = currentPath + R"(\sr.caffemodel)";
    try
    {
        detector = cv::makePtr<cv::wechat_qrcode::WeChatQRCode>(detect_prototxt, detect_caffe_model, sr_prototxt, sr_caffe_model);
    }
    catch (const std::exception& e)
    {
        return false;
    }

    std::vector<cv::Mat> vPoints;
    std::vector<std::string> strDecoded;

    //�õ�QRCodeλ�úͽ�������
    strDecoded = detector->detectAndDecode(m_srcImg, vPoints);
    std::string decode_string;
    if (vPoints.size() == 0)
    {
        // ����ʧ��
        return false;
    }
    for (int i = 0; i < strDecoded.size(); i++)
    {
        cv::Point pt1 = cv::Point((float)vPoints[i].at<float>(0, 0), (int)vPoints[i].at<float>(0, 1));
        cv::Point pt2 = cv::Point((float)vPoints[i].at<float>(1, 0), (int)vPoints[i].at<float>(1, 1));
        cv::Point pt3 = cv::Point((float)vPoints[i].at<float>(2, 0), (int)vPoints[i].at<float>(2, 1));
        cv::Point pt4 = cv::Point((float)vPoints[i].at<float>(3, 0), (int)vPoints[i].at<float>(3, 1));

        // ת�� ���¡����ϡ����ϡ�����
        
        m_points.push_back(pt2);
        m_points.push_back(pt3);
        m_points.push_back(pt4);
        m_points.push_back(pt1);
        
        
        m_qrText = strDecoded[i];
    }
    return true;
}

std::vector<cv::Point> QRCodeParser::getPoints()
{
    return m_points;
}

std::string QRCodeParser::getText()
{
    return m_qrText;
}

cv::Size QRCodeParser::getShape()
{
    return m_qrShape;
}

// �����ά��block���
float QRCodeParser::calcBlockwidth(const cv::Mat& calcBlockImg, const std::vector<cv::Point>& targetPoints, int qrCodeWidth, cv::Size qrShape)
{
    // �Ƿ����ɹ�
    bool calcSuccess = false;

    // Ĭ��ֵΪ��ά��߳�����21
    float blockWidth = qrCodeWidth / 21.0;

    // ���� shape ���� blockWidth
    if (!qrShape.empty() && 0 != qrShape.width) {
        blockWidth = Tools::roundToFixed(qrCodeWidth / (float)qrShape.width, 3);
        return blockWidth;
    }

    // ��У׼��Ķ�ά��ü�
    cv::Point leftTop = targetPoints[1];
    cv::Point rightTop = targetPoints[2];
    cv::Point leftBottom = targetPoints[0];
    cv::Point rightBottom = targetPoints[3];

    // ���ߣ���ֹУ׼���¶�ά��ü���ȫ
    int calcPadding = 10;
    leftTop = cv::Point(leftTop.x - calcPadding, leftTop.y - calcPadding);
    rightTop = cv::Point(rightTop.x + calcPadding, rightTop.y - calcPadding);
    leftBottom = cv::Point(leftBottom.x - calcPadding, leftBottom.y + calcPadding);
    rightBottom = cv::Point(rightBottom.x + calcPadding, rightBottom.y + calcPadding);

    // ����ü����εĿ�Ⱥ͸߶�
    int width = ((rightTop.x - leftTop.x) + (rightBottom.x - leftBottom.x)) / 2;
    int height = ((leftBottom.y - leftTop.y) + (rightBottom.y - rightTop.y)) / 2;

    // �ü�ͼƬ
    cv::Mat qrcodeImgCut = calcBlockImg(cv::Rect(leftTop.x, leftTop.y, width, height));

    // ���image ����uint8�ģ���Ҫתһ��
    cv::Mat qrcodeImg = qrcodeImgCut;
    
    //���image ����uint8�ģ���Ҫתһ��
    if (qrcodeImg.type() != CV_8UC1)
    {
        util::img2U8(qrcodeImg);
    }    

    // ���ж�ֵ������
    cv::Mat binary_image;
    cv::threshold(qrcodeImg, binary_image, 0, 255, cv::THRESH_BINARY + cv::THRESH_OTSU);

    // ͼ��ʴ��ʹ������������
    cv::Mat kernel = cv::getStructuringElement(cv::MORPH_RECT, cv::Size(3, 3));
    cv::Mat erode_image;
    cv::erode(binary_image, erode_image, kernel, cv::Point(-1, -1), 1);

    // Ѱ������
    std::vector<std::vector<cv::Point>> contours;
    std::vector<cv::Vec4i> hierarchy;
    cv::findContours(erode_image, contours, hierarchy, cv::RETR_TREE, cv::CHAIN_APPROX_SIMPLE);

    int tempindex1 = 0;
    int tempindex2 = 0;
    std::vector<std::tuple<int, int, int>> vin;
    for (int i = 0; i < contours.size(); ++i) {
        // hierarchy �����е�ֵ�ֱ��ʾ [Next, Previous, First_Child, Parent]��First_Child = -1 ��ʾû��������
        if (hierarchy[i][2] == -1) {
            continue;
        }
        else {
            tempindex1 = hierarchy[i][2];
        }
        // ������û��������
        if (hierarchy[tempindex1][2] == -1) {
            continue;
        }
        else {
            tempindex2 = hierarchy[tempindex1][2];
            // ��¼�� i �����������������ǵ� tempindex1 �����������������������ǵ� tempindex2 ������
            vin.push_back(std::make_tuple(i, tempindex1, tempindex2));
        }
    }

    std::vector<std::tuple<int, int, int>> newVin;
    for (const auto& v : vin) {
        //const cv::Mat& contour1 = contours[std::get<1>(v)];
        //const cv::Mat& contour2 = contours[std::get<2>(v)];


        std::vector<cv::Point> contour1 = contours[std::get<1>(v)];
        std::vector<cv::Point> contour2 = contours[std::get<2>(v)];

        // ���������ܳ�
        double lenth1 = cv::arcLength(contour1, true);
        double lenth2 = cv::arcLength(contour2, true);

        // �ų���������
        if (lenth2 != 0 && std::abs(lenth1 / lenth2 - 2) <= 1) {
            newVin.push_back(v);
        }
    }
    vin = newVin;


    if (vin.size() != 0) {
        // λ��̽��ͼ�����ĵ�����
        std::vector<cv::Point> points;
        // ʶ�𵽵Ļ���x��y���꼯��
        std::vector<int> axisList;
        for (const auto& v : vin) {
            cv::Moments m = cv::moments(contours[std::get<1>(v)]);
            int cx = static_cast<int>(m.m10 / m.m00);
            int cy = static_cast<int>(m.m01 / m.m00);
            cv::Point center(cx, cy);
            if (std::find(points.begin(), points.end(), center) == points.end()) {
                points.push_back(center);
                axisList.push_back(cx);
                axisList.push_back(cy);
            }
        }
        if (!axisList.empty()) {
            // ����������С����
            int minAxis = *std::min_element(axisList.begin(), axisList.end());
            // ������ֿ��
            int halfDetector = minAxis - calcPadding;
            // ��������½ǵĻ��֣���Ҫ���¼���
            if (minAxis - calcPadding > qrCodeWidth / 2) {
                halfDetector = qrCodeWidth - (minAxis - calcPadding);
            }

            // �����ά��ÿ�� module ��ȣ������������ά���Ե����Ϊ 3.5 module
            blockWidth = Tools::roundToFixed(halfDetector / 3.5, 3);
            
            // �����ά��汾�ź�block��ϵ(��ά��һ��40���汾����С�汾Ϊ21 * 21��block���汾�ż�1���߳�����4��block)
            std::vector<int> blockSizeList;
            for (int i = 0; i < 40; ++i) {
                blockSizeList.push_back(21 + 4 * i);
            }

            // ���ݶ�ά���ȡ�ͨ��Ѱ������������� block ��ȣ����Ƽ����ά��һ���ж��� block
            double approxSize = qrCodeWidth / blockWidth;

            // ������� block �����׼ block ���Ĳ���
            std::vector<std::pair<double, int>> diffValues;
            for (int blockSize : blockSizeList) {
                diffValues.push_back(std::make_pair(std::abs(blockSize - approxSize), blockSize));
            }

            // ƥ���׼ block �������¼��� blockWidth���������
            std::pair<double, int> minDiff = *std::min_element(diffValues.begin(), diffValues.end());
            int blockSize = minDiff.second;
            blockWidth = Tools::roundToFixed(qrCodeWidth / blockSize, 3);
            calcSuccess = true;
        }
    }

    // ��ӡ������
    if (calcSuccess) {
        std::cout << "Block width: " << blockWidth << std::endl;
    }
    else {
        std::cout << "Block width (QR code width / 21): " << blockWidth << std::endl;
    }

    return blockWidth;

}
