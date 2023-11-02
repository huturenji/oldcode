#include <algorithm>
#include "ImageCompare.h"
#include "QRCodePaperImage.h"
#include "PreprocessImageTool.h"
#include "Params.h"
#include "Tools.h"
#include "DertImage.h"

#ifdef _DEBUG
#include <iostream>
#endif // DEBUG


ImageCompare::ImageCompare(std::string regImagePath, std::string verifiImgPath) :
    m_regImagePath(regImagePath), m_verifiImgPath(verifiImgPath)
{
    minTrueResult = 0.0; // 相同区域最小结果
    avgTrueResult = 0.0; // 相同区域平均结果
    maxFalseResult = 0.0; // 不同区域最大值
    spanResult = 0.0; // 相同区域最小值 - 不同区域最大值
    init();
}

#define imageTypeReg 0   // 0 注册图（J0）
#define imageTypeVerifi 1// 1 核验图（J2）
#define imageTypeVerifiJ1 2

void ImageCompare::init()
{
    regImage = std::make_shared<QRCodePaperImage>(m_regImagePath, imageTypeReg);
    verifiImg = std::make_shared<QRCodePaperImage>(m_verifiImgPath, imageTypeVerifi);
    
}


// 是否同一个标签纸(暂时以二维码内容是否相同为准)
bool ImageCompare::isSame()
{
    return regImage->qrText == verifiImg->qrText;
}
    

// 配准
void ImageCompare::algin(int qrCodeWidth)
{
    // 配置了强制使用二维码配准，或者注册图和核验图二维码内容不一致
    if (Params::QRCODE_ALGIN_FORCE || !isSame())
    {
        //QRCodePaperImage regImage, verifiImg;
        regImage->alginByQRCode(qrCodeWidth); // 透射变换校正
        verifiImg->alginByQRCode(qrCodeWidth);// 透射变换校正

        if (NULL != verifiJ1Img)
        {
            verifiJ1Img->alginByQRCode(qrCodeWidth);
        }
        return;
    }

    // 检查注册图不校正情况下裁图是否OK？ ok 的话直接使用orb配准核验图，裁图不ok就要用二维码校正配准
    bool checkCutOrigin = regImage->checkCutImg(Params::CUT_SIZE[0]);
    if (checkCutOrigin)
    {
        regImage->alginByORB(regImage->qrPointsOrigin, qrCodeWidth);
        verifiImg->alginByORB(regImage->qrPoints, qrCodeWidth, regImage->warpImage.clone());

        // TODO：为了测试，使用python配准后的图片，测下从这一步往后的结果
        //verifiImg->warpImage = cv::imread(R"(D:\ZhiWen\SinosunCode\TempImg\verifiWarpImage.tiff)", cv::IMREAD_UNCHANGED);
        //regImage->warpImage = cv::imread(R"(D:\ZhiWen\SinosunCode\TempImg\regWarpImage.tiff)", cv::IMREAD_UNCHANGED);
       
        if (NULL != verifiJ1Img)
        {
            verifiJ1Img->alginByORB(regImage->qrPoints, qrCodeWidth, regImage->warpImage);
        } 
        
    }
    else
    {
        // algin image by orb failed, cut image not ok... next use qrcode algin image!
        regImage->alginByQRCode(qrCodeWidth); // 透射变换校正
        verifiImg->alginByQRCode(qrCodeWidth); // 透射变换校正


        if (NULL != verifiJ1Img)
        {
            verifiJ1Img->alginByORB(verifiJ1Img->qrPoints, qrCodeWidth, verifiJ1Img->warpImage);
        }
    }


        
}

// 裁图
void ImageCompare::cutImgs(int qrCodeWidth)
{
    std::vector<cv::Mat> regImages = regImage->cutImgs(qrCodeWidth, Params::CUT_SIZE[1], Params::CUT_SIZE[2], Params::CUT_SIZE[0]); // 裁剪4个纸纹图片
    std::vector<cv::Mat> verifiImages = verifiImg->cutImgs(qrCodeWidth, Params::CUT_SIZE[1], Params::CUT_SIZE[2], Params::CUT_SIZE[0]); // 裁剪4个纸纹图片

    if (NULL != dertImage)
    {
        verifiJ1Img->cutImgs(qrCodeWidth, Params::CUT_SIZE[1], Params::CUT_SIZE[2], Params::CUT_SIZE[0]); // 裁剪4个纸纹图片
        dertImage->cutImgs();
    }
    m_regImagesCut = regImages;
    m_verifiImagesCut = verifiImages;
}

// 图像处理，对已经裁剪好的注册图、核验图纸纹图进行处理、计算，
typedef enum {
    TYPE_VERIFI_IMG,
    TYPE_DERT_IMG,
}CALC_VERIFI_IMG_TYPE;
void ImageCompare::calc(std::shared_ptr<QRCodePaperImage> regImage, std::shared_ptr<QRCodePaperImage> verifiImg)
{
    /* xy 方向的sobel */
    std::vector<cv::Mat> regImages = regImage->preProcess(); // 对4个纸纹图片进行图像处理
    std::vector<cv::Mat> verifiImages = verifiImg->preProcess(); // 对4个纸纹图片进行图像处理


    std::vector<double> maxSame, maxNotSame;
    std::vector<std::string> notSameIndex;
    if (Params::SOBEL_CALC_AVG)
    {
        // 将sobel x、y分别计算相关性后取平均值
        std::vector<cv::Mat> regImagesX = regImage->preProcessX();
        std::vector<cv::Mat> verifiImagesX = verifiImg->preProcessX();



        // TODO:测试 使用python裁剪的图
        //{
        //    regImagesX.clear();
        //    regImagesX.push_back(cv::imread(R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\ImgXY\regAreaX1.tiff)", cv::IMREAD_UNCHANGED));
        //    regImagesX.push_back(cv::imread(R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\ImgXY\regAreaX2.tiff)", cv::IMREAD_UNCHANGED));
        //    regImagesX.push_back(cv::imread(R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\ImgXY\regAreaX3.tiff)", cv::IMREAD_UNCHANGED));
        //    regImagesX.push_back(cv::imread(R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\ImgXY\regAreaX4.tiff)", cv::IMREAD_UNCHANGED));
        //    verifiImagesX.clear();
        //    verifiImagesX.push_back(cv::imread(R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\ImgXY\verifiAreaX1.tiff)", cv::IMREAD_UNCHANGED));
        //    verifiImagesX.push_back(cv::imread(R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\ImgXY\verifiAreaX2.tiff)", cv::IMREAD_UNCHANGED));
        //    verifiImagesX.push_back(cv::imread(R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\ImgXY\verifiAreaX3.tiff)", cv::IMREAD_UNCHANGED));
        //    verifiImagesX.push_back(cv::imread(R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\ImgXY\verifiAreaX4.tiff)", cv::IMREAD_UNCHANGED));
        //}
        
        
        std::vector<double> sameX, notSameX;
        batchingCompareImgs(regImagesX, verifiImagesX, sameX, notSameX, notSameIndex);

        std::vector<cv::Mat> regImagesY = regImage->preProcessY();
        std::vector<cv::Mat> verifiImagesY = verifiImg->preProcessY();

        // TODO:测试 使用python裁剪的图
        //{
        //    regImagesY.clear();
        //    regImagesY.push_back(cv::imread(R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\ImgXY\regAreaY1.tiff)", cv::IMREAD_UNCHANGED));
        //    regImagesY.push_back(cv::imread(R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\ImgXY\regAreaY2.tiff)", cv::IMREAD_UNCHANGED));
        //    regImagesY.push_back(cv::imread(R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\ImgXY\regAreaY3.tiff)", cv::IMREAD_UNCHANGED));
        //    regImagesY.push_back(cv::imread(R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\ImgXY\regAreaY4.tiff)", cv::IMREAD_UNCHANGED));
        //    verifiImagesY.clear();
        //    verifiImagesY.push_back(cv::imread(R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\ImgXY\verifiAreaY1.tiff)", cv::IMREAD_UNCHANGED));
        //    verifiImagesY.push_back(cv::imread(R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\ImgXY\verifiAreaY2.tiff)", cv::IMREAD_UNCHANGED));
        //    verifiImagesY.push_back(cv::imread(R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\ImgXY\verifiAreaY3.tiff)", cv::IMREAD_UNCHANGED));
        //    verifiImagesY.push_back(cv::imread(R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\ImgXY\verifiAreaY4.tiff)", cv::IMREAD_UNCHANGED));
        //}
        
        
        std::vector<double> sameY, notSameY;
        batchingCompareImgs(regImagesY, verifiImagesY, sameY, notSameY, notSameIndex);

        for (int i = 0; i < sameX.size() && i < sameY.size(); i++)
        {
            maxSame.push_back(avgValue(sameX[i], sameY[i]));
        }
        for (int i = 0; i < notSameX.size() && i < notSameY.size(); i++)
        {
            maxNotSame.push_back(avgValue(notSameX[i], notSameY[i]));
        }

    }
    else
    {
        batchingCompareImgs(regImages, verifiImages, maxSame, maxNotSame, notSameIndex);
    }

    // 计算平均值和极值
    double avgTrue = Tools::mean(maxSame);
    double minTrue = *min_element(maxSame.begin(), maxSame.end());
    double maxFalse = *max_element(maxNotSame.begin(), maxNotSame.end());


#ifdef _DEBUG
    // 构建显示结果字符串
    std::string showTrueResults = "", showFlaseResults = "";
    for (size_t i = 0; i < maxSame.size(); ++i) {
        showTrueResults += std::to_string(i + 1) + "-" + std::to_string(i + 1) + "[" + std::to_string(maxSame[i]) + "], ";
    }
    showTrueResults += "avgTrue[" + std::to_string(avgTrue) + "], minTrue[" + std::to_string(minTrue) + "], maxFalse[" + std::to_string(maxFalse) + "], span[" + std::to_string(minTrue - maxFalse) + "]";

    for (size_t i = 0; i < maxNotSame.size() && i < notSameIndex.size(); ++i) {
        showFlaseResults += notSameIndex[i] + "[" + std::to_string(maxNotSame[i]) + "], ";
    }

    std::cout << showTrueResults << std::endl;
    std::cout << showFlaseResults << std::endl;

#endif  //_DEBUG

    trueResults = maxSame;
    falseResults = maxNotSame;
    minTrueResult = minTrue; // 相同区域最小结果
    avgTrueResult = avgTrue; // 相同区域平均结果
    maxFalseResult = maxFalse; // 不同区域最大值
    spanResult = Tools::roundToFixed(minTrue - maxFalse, 3); // 相同区域最小值 - 不同区域最大值

} 

void ImageCompare::calc(std::shared_ptr<QRCodePaperImage> regImage, std::shared_ptr<DertImage> verifiImg)
{
    /* xy 方向的sobel */
    std::vector<cv::Mat> regImages = regImage->preProcess(); // 对4个纸纹图片进行图像处理
    std::vector<cv::Mat> verifiImages = verifiImg->preProcess(); // 对4个纸纹图片进行图像处理


    std::vector<double> maxSame, maxNotSame;
    std::vector<std::string> notSameIndex;
    if (Params::SOBEL_CALC_AVG)
    {
        // 将sobel x、y分别计算相关性后取平均值
        std::vector<cv::Mat> regImagesX = regImage->preProcessX();
        std::vector<cv::Mat> verifiImagesX = verifiImg->preProcessX();
        std::vector<double> sameX, notSameX;
        batchingCompareImgs(regImagesX, verifiImagesX, sameX, notSameX, notSameIndex);

        std::vector<cv::Mat> regImagesY = regImage->preProcessY();
        std::vector<cv::Mat> verifiImagesY = verifiImg->preProcessY();
        std::vector<double> sameY, notSameY;
        batchingCompareImgs(regImagesY, verifiImagesY, sameY, notSameY, notSameIndex);

        for (int i = 0; i < sameX.size(); i++)
        {
            maxSame.push_back(avgValue(sameX[i], sameY[i]));
        }
        for (int i = 0; i < notSameX.size(); i++)
        {
            maxNotSame.push_back(avgValue(notSameX[i], notSameY[i]));
        }

    }
    else
    {
        batchingCompareImgs(regImages, verifiImages, maxSame, maxNotSame, notSameIndex);
    }

    // 计算平均值和极值
    double avgTrue = Tools::mean(maxSame);
    double minTrue = *min_element(maxSame.begin(), maxSame.end());
    double maxFalse = *max_element(maxNotSame.begin(), maxNotSame.end());


#ifdef _DEBUG
    // 构建显示结果字符串
    std::string showTrueResults = "", showFlaseResults = "";
    for (size_t i = 0; i < maxSame.size(); ++i) {
        showTrueResults += std::to_string(i + 1) + "-" + std::to_string(i + 1) + "[" + std::to_string(maxSame[i]) + "], ";
    }
    showTrueResults += "avgTrue[" + std::to_string(avgTrue) + "], minTrue[" + std::to_string(minTrue) + "], maxFalse[" + std::to_string(maxFalse) + "], span[" + std::to_string(minTrue - maxFalse) + "]";

    for (size_t i = 0; i < maxNotSame.size() && i < notSameIndex.size(); ++i) {
        showFlaseResults += notSameIndex[i] + "[" + std::to_string(maxNotSame[i]) + "], ";
    }

    std::cout << showTrueResults << std::endl;
    std::cout << showFlaseResults << std::endl;

#endif  //_DEBUG

    //trueResultsDertImg = maxSame;
    //falseResultsDertImg = maxNotSame;
    //minTrueResultDertImg = minTrue; // 相同区域最小结果
    //avgTrueResultDertImg = avgTrue; // 相同区域平均结果
    //maxFalseResultDertImg = maxFalse; // 不同区域最大值
    //spanResultDertImg = Tools::roundToFixed(minTrue - maxFalse, 3); // 相同区域最小值 - 不同区域最大值

    trueResults = maxSame;
    falseResults = maxNotSame;
    minTrueResult = minTrue; // 相同区域最小结果
    avgTrueResult = avgTrue; // 相同区域平均结果
    maxFalseResult = maxFalse; // 不同区域最大值
    spanResult = Tools::roundToFixed(minTrue - maxFalse, 3); // 相同区域最小值 - 不同区域最大值
}


// 找出前N个最大的数
std::vector<std::pair<double, cv::Point>> ImageCompare::findMax(cv::Mat result, int size) 
{
    cv::Mat _result = result.clone();
    std::vector<std::pair<double, cv::Point>> maxVals;

    for (int i = 0; i < size; ++i) {
        double minVal, maxVal;
        cv::Point minLoc, maxLoc;

        cv::minMaxLoc(_result, &minVal, &maxVal, &minLoc, &maxLoc);
        _result.at<float>(maxLoc) = 0;

        maxVals.push_back(std::make_pair(maxVal, maxLoc));
    }

    return maxVals;
}

// 使用模版匹配法计算相关性
std::vector<std::pair<double, cv::Point>> ImageCompare::calcCCOEFF(cv::Mat image, cv::Mat templateImage) {
    // 进行模板匹配
    // 匹配方法：关于匹配方法，使用不同的方法产生的结果的意义可能不太一样，有些返回的值越大表示匹配程度越好，而有些方法返回的值越小表示匹配程度越好。
    // CV_TM_SQDIFF 平方差匹配法：该方法采用平方差来进行匹配；最好的匹配值为0；匹配越差，匹配值越大。
    // CV_TM_CCORR 相关匹配法：该方法采用乘法操作；数值越大表明匹配程度越好。
    // CV_TM_CCOEFF 相关系数匹配法：1表示完美的匹配； - 1表示最差的匹配。
    // CV_TM_SQDIFF_NORMED 归一化平方差匹配法
    // CV_TM_CCORR_NORMED 归一化相关匹配法
    // CV_TM_CCOEFF_NORMED 归一化相关系数匹配法

    cv::Mat result;
    /*
    * image W*H
    * templateImage w*h
    * result (W - w + 1)*(H - h + 1)
    */
    cv::matchTemplate(image, templateImage, result, cv::TM_CCOEFF_NORMED);

    // 查找互相关最大的值和位置,前10位
    std::vector<std::pair<double, cv::Point>> maxVals = findMax(result);
    return maxVals;
}


// 从srcImage中裁剪去掉周围MATCH_POSITION像素大小的小图
cv::Mat ImageCompare::cutVerifiImages(cv::Mat srcImage) {
    int h = srcImage.rows;
    int w = srcImage.cols;
    // 待核验纸纹图片区域大小
    cv::Rect rect(Params::MATCH_POSITION, Params::MATCH_POSITION, w - 2 * Params::MATCH_POSITION, h - 2 * Params::MATCH_POSITION);
    cv::Mat rectImg = srcImage(rect);
    return rectImg;
}

// 图片对比
double ImageCompare::compareImg(cv::Mat img1, cv::Mat img2) 
{
    // 如果img2的矩阵和img1不是一个方向，先调整为同一个方向再开始比对
    if ((img1.rows > img1.cols && img2.rows < img2.cols) || (img1.rows < img1.cols && img2.rows > img2.cols)) {
        //img2 = img2.t(); // 转置
        img2 = img2.reshape(img2.channels(), img2.cols);
    }

    // 1、注册图、核验图一样大直接比较，img1、img2都会往内缩小裁剪MATCH_POSITION一圈的像素，此时_img1与_img2大小一样，模板匹配只会比较一次
    cv::Mat _img1 = cutVerifiImages(img1);
    cv::Mat _img2 = cutVerifiImages(img2);
    std::vector<std::pair<double, cv::Point>> maxVals1 = calcCCOEFF(_img2, _img1);
    // 最大相关系数和位置
    double max1 = maxVals1[0].first;

    // 2、如果按1比较之后最大相关系数在RECALCULATE_THRESHOLD【0.2, 0.5】的阈值范围内，需要将核验图在注册图内做平移模板匹配，抵消配准带来的偏差
    if (max1 > Params::RECALCULATE_THRESHOLD[0] && max1 < Params::RECALCULATE_THRESHOLD[1]) {
        // 此时传入的img2是没有往内缩小的图，比_img1大一圈，_img1在img2中进行模板匹配会计算多次，取最大值
        std::vector<std::pair<double, cv::Point>> maxVals2 = calcCCOEFF(img2, _img1);
        max1 = maxVals2[0].first;
    }

    return Tools::roundToFixed(max1, 3);
}

// 批量处理图片对比
void ImageCompare::batchingCompareImgs(const std::vector<cv::Mat>& regImages, const std::vector<cv::Mat>& verifiImages,
    std::vector<double>& same, std::vector<double>& notSame, std::vector<std::string>& notSameIndex) 
{
    same.clear();
    notSame.clear();
    notSameIndex.clear();

    for (size_t i = 0; i < regImages.size(); ++i) {
        for (size_t j = 0; j < verifiImages.size(); ++j) {
            if (i == j) {
                same.push_back(compareImg(regImages[i], verifiImages[j]));
            }
            else {
                notSame.push_back(compareImg(regImages[i], verifiImages[j]));
                notSameIndex.push_back(std::to_string(i + 1) + "-" + std::to_string(j + 1));
            }
        }
    }
}

// 计算两个数的平均数，保留小数点3位
double ImageCompare::avgValue(double v1, double v2)
{
    //return (v1 + v2) / 2;
    return Tools::roundToFixed((v1 + v2) / 2, 3);
}

void ImageCompare::compare(int qrCodeWidth)
{
    int regQrCodeWidth = regImage->qrWidthOrigin;
    int verifiQrCodeWidth = verifiImg->qrWidthOrigin;
    // 计算配准的二维码宽度标准(-1表示以注册图、核验图中小的为准，否则以指定数值为准)
    if (qrCodeWidth == -1)
    {
        qrCodeWidth = std::min(regQrCodeWidth, verifiQrCodeWidth);
    }
    // 以qrCodeWidth配准后裁剪指纹图
    algin(qrCodeWidth);

    // 裁图
    //regImages, verifiImages = cutImgs(qrCodeWidth)
    cutImgs(qrCodeWidth);
    

    // 比较 核验图（J2）与注册图
    //maxSame, maxNotSame, minTrue, avgTrue, maxFalse, showTrueResults, showFlaseResults = 
    calc(regImage, verifiImg);
  
    if (NULL == dertImage)
    {
        return;
        //return  maxSame, maxNotSame, [], []
    }

    // 比较 差图 dertImg（J2 - J1）与注册图
    calc(regImage, dertImage);
    

    //return self.trueResults, self.falseResults, self.trueResultsDertImg, self.falseResultsDertImg
}
    

bool ImageCompare::isParseQRCodeException()
{
    return !(regImage->parseStatus) || !(verifiImg->parseStatus);
}

std::vector<double> ImageCompare::getTrueResults()
{
    return trueResults;
}

std::vector<double> ImageCompare::getFalseResults()
{
    return falseResults;
}

// 使用差图计算，默认
void ImageCompare::useDertImage(std::string j1ImagePath)
{
    verifiJ1Img= std::make_shared<QRCodePaperImage>(j1ImagePath, imageTypeVerifiJ1);
    dertImage = std::make_shared<DertImage>(verifiImg, verifiJ1Img);
}

