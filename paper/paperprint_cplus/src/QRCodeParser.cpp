#include "QRCodeParser.h"
#include "util.h"
#include "Tools.h"
#include "SinoPaperprintErrCode.h"
#include "opencv2/wechat_qrcode.hpp"


// 解析二维码, 返回二维码内容和四个顶点（左下、左上、右上、右下）
bool QRCodeParser::parseQrCodeImage(cv::Mat srcImg)
{
    m_srcImg = srcImg;
    //1、识别二维码，获取顶点位置
    //如果image 不是uint8的，需要转一下
    //if srcImg.dtype != 'uint8':
    if (m_srcImg.type() != CV_8UC1)
    {
        util::img2U8(m_srcImg);
    }

    //识别二维码，优先顺序：opencv、zxingcpp、微信
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

    //1、识别二维码，获取顶点位置 如果image 不是uint8的，需要转一下
    if (m_srcImg.type() != CV_8UC1)
    {
        util::img2U8(m_srcImg);
    }

    //识别二维码，优先顺序：opencv、zxingcpp、微信
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
    // 探测是不是二维码
    cv::QRCodeDetector qrcodeDectector;
    std::vector<cv::Point> vPoints;
    bool isQRCode;
    isQRCode = qrcodeDectector.detect(m_srcImg, vPoints);
    // 解析二维码
    if (isQRCode)
    {
        cv::Mat extData;
        m_qrText = qrcodeDectector.decode(m_srcImg, vPoints, extData);
        m_qrShape = extData.size();
        // 转成 左下、左上、右上、右下
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
    //加载图片解码
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

    //得到QRCode位置和解码内容
    strDecoded = detector->detectAndDecode(m_srcImg, vPoints);
    std::string decode_string;
    if (vPoints.size() == 0)
    {
        // 解析失败
        return false;
    }
    for (int i = 0; i < strDecoded.size(); i++)
    {
        cv::Point pt1 = cv::Point((float)vPoints[i].at<float>(0, 0), (int)vPoints[i].at<float>(0, 1));
        cv::Point pt2 = cv::Point((float)vPoints[i].at<float>(1, 0), (int)vPoints[i].at<float>(1, 1));
        cv::Point pt3 = cv::Point((float)vPoints[i].at<float>(2, 0), (int)vPoints[i].at<float>(2, 1));
        cv::Point pt4 = cv::Point((float)vPoints[i].at<float>(3, 0), (int)vPoints[i].at<float>(3, 1));

        // 转成 左下、左上、右上、右下
        
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

// 计算二维码block宽度
float QRCodeParser::calcBlockwidth(const cv::Mat& calcBlockImg, const std::vector<cv::Point>& targetPoints, int qrCodeWidth, cv::Size qrShape)
{
    // 是否计算成功
    bool calcSuccess = false;

    // 默认值为二维码边长除以21
    float blockWidth = qrCodeWidth / 21.0;

    // 根据 shape 计算 blockWidth
    if (!qrShape.empty() && 0 != qrShape.width) {
        blockWidth = Tools::roundToFixed(qrCodeWidth / (float)qrShape.width, 3);
        return blockWidth;
    }

    // 将校准后的二维码裁剪
    cv::Point leftTop = targetPoints[1];
    cv::Point rightTop = targetPoints[2];
    cv::Point leftBottom = targetPoints[0];
    cv::Point rightBottom = targetPoints[3];

    // 留边，防止校准误差导致二维码裁剪不全
    int calcPadding = 10;
    leftTop = cv::Point(leftTop.x - calcPadding, leftTop.y - calcPadding);
    rightTop = cv::Point(rightTop.x + calcPadding, rightTop.y - calcPadding);
    leftBottom = cv::Point(leftBottom.x - calcPadding, leftBottom.y + calcPadding);
    rightBottom = cv::Point(rightBottom.x + calcPadding, rightBottom.y + calcPadding);

    // 计算裁剪矩形的宽度和高度
    int width = ((rightTop.x - leftTop.x) + (rightBottom.x - leftBottom.x)) / 2;
    int height = ((leftBottom.y - leftTop.y) + (rightBottom.y - rightTop.y)) / 2;

    // 裁剪图片
    cv::Mat qrcodeImgCut = calcBlockImg(cv::Rect(leftTop.x, leftTop.y, width, height));

    // 如果image 不是uint8的，需要转一下
    cv::Mat qrcodeImg = qrcodeImgCut;
    
    //如果image 不是uint8的，需要转一下
    if (qrcodeImg.type() != CV_8UC1)
    {
        util::img2U8(qrcodeImg);
    }    

    // 进行二值化处理
    cv::Mat binary_image;
    cv::threshold(qrcodeImg, binary_image, 0, 255, cv::THRESH_BINARY + cv::THRESH_OTSU);

    // 图像腐蚀，使轮廓更加完整
    cv::Mat kernel = cv::getStructuringElement(cv::MORPH_RECT, cv::Size(3, 3));
    cv::Mat erode_image;
    cv::erode(binary_image, erode_image, kernel, cv::Point(-1, -1), 1);

    // 寻找轮廓
    std::vector<std::vector<cv::Point>> contours;
    std::vector<cv::Vec4i> hierarchy;
    cv::findContours(erode_image, contours, hierarchy, cv::RETR_TREE, cv::CHAIN_APPROX_SIMPLE);

    int tempindex1 = 0;
    int tempindex2 = 0;
    std::vector<std::tuple<int, int, int>> vin;
    for (int i = 0; i < contours.size(); ++i) {
        // hierarchy 数组中的值分别表示 [Next, Previous, First_Child, Parent]，First_Child = -1 表示没有子轮廓
        if (hierarchy[i][2] == -1) {
            continue;
        }
        else {
            tempindex1 = hierarchy[i][2];
        }
        // 子轮廓没有子轮廓
        if (hierarchy[tempindex1][2] == -1) {
            continue;
        }
        else {
            tempindex2 = hierarchy[tempindex1][2];
            // 记录第 i 个轮廓，的子轮廓是第 tempindex1 个轮廓，子轮廓的子轮廓是第 tempindex2 个轮廓
            vin.push_back(std::make_tuple(i, tempindex1, tempindex2));
        }
    }

    std::vector<std::tuple<int, int, int>> newVin;
    for (const auto& v : vin) {
        //const cv::Mat& contour1 = contours[std::get<1>(v)];
        //const cv::Mat& contour2 = contours[std::get<2>(v)];


        std::vector<cv::Point> contour1 = contours[std::get<1>(v)];
        std::vector<cv::Point> contour2 = contours[std::get<2>(v)];

        // 计算轮廓周长
        double lenth1 = cv::arcLength(contour1, true);
        double lenth2 = cv::arcLength(contour2, true);

        // 排除过大轮廓
        if (lenth2 != 0 && std::abs(lenth1 / lenth2 - 2) <= 1) {
            newVin.push_back(v);
        }
    }
    vin = newVin;


    if (vin.size() != 0) {
        // 位置探测图形中心点坐标
        std::vector<cv::Point> points;
        // 识别到的回字x、y坐标集合
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
            // 回字中心最小坐标
            int minAxis = *std::min_element(axisList.begin(), axisList.end());
            // 半个回字宽度
            int halfDetector = minAxis - calcPadding;
            // 如果是右下角的回字，需要重新计算
            if (minAxis - calcPadding > qrCodeWidth / 2) {
                halfDetector = qrCodeWidth - (minAxis - calcPadding);
            }

            // 计算二维码每个 module 宽度，回字中心与二维码边缘距离为 3.5 module
            blockWidth = Tools::roundToFixed(halfDetector / 3.5, 3);
            
            // 定义二维码版本号和block关系(二维码一共40个版本，最小版本为21 * 21个block，版本号加1，边长增加4个block)
            std::vector<int> blockSizeList;
            for (int i = 0; i < 40; ++i) {
                blockSizeList.push_back(21 + 4 * i);
            }

            // 根据二维码宽度、通过寻找轮廓计算出的 block 宽度，近似计算二维码一行有多少 block
            double approxSize = qrCodeWidth / blockWidth;

            // 计算近似 block 数与标准 block 数的差异
            std::vector<std::pair<double, int>> diffValues;
            for (int blockSize : blockSizeList) {
                diffValues.push_back(std::make_pair(std::abs(blockSize - approxSize), blockSize));
            }

            // 匹配标准 block 数，重新计算 blockWidth，减少误差
            std::pair<double, int> minDiff = *std::min_element(diffValues.begin(), diffValues.end());
            int blockSize = minDiff.second;
            blockWidth = Tools::roundToFixed(qrCodeWidth / blockSize, 3);
            calcSuccess = true;
        }
    }

    // 打印计算结果
    if (calcSuccess) {
        std::cout << "Block width: " << blockWidth << std::endl;
    }
    else {
        std::cout << "Block width (QR code width / 21): " << blockWidth << std::endl;
    }

    return blockWidth;

}
