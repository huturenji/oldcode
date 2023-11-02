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
    minTrueResult = 0.0; // ��ͬ������С���
    avgTrueResult = 0.0; // ��ͬ����ƽ�����
    maxFalseResult = 0.0; // ��ͬ�������ֵ
    spanResult = 0.0; // ��ͬ������Сֵ - ��ͬ�������ֵ
    init();
}

#define imageTypeReg 0   // 0 ע��ͼ��J0��
#define imageTypeVerifi 1// 1 ����ͼ��J2��
#define imageTypeVerifiJ1 2

void ImageCompare::init()
{
    regImage = std::make_shared<QRCodePaperImage>(m_regImagePath, imageTypeReg);
    verifiImg = std::make_shared<QRCodePaperImage>(m_verifiImgPath, imageTypeVerifi);
    
}


// �Ƿ�ͬһ����ǩֽ(��ʱ�Զ�ά�������Ƿ���ͬΪ׼)
bool ImageCompare::isSame()
{
    return regImage->qrText == verifiImg->qrText;
}
    

// ��׼
void ImageCompare::algin(int qrCodeWidth)
{
    // ������ǿ��ʹ�ö�ά����׼������ע��ͼ�ͺ���ͼ��ά�����ݲ�һ��
    if (Params::QRCODE_ALGIN_FORCE || !isSame())
    {
        //QRCodePaperImage regImage, verifiImg;
        regImage->alginByQRCode(qrCodeWidth); // ͸��任У��
        verifiImg->alginByQRCode(qrCodeWidth);// ͸��任У��

        if (NULL != verifiJ1Img)
        {
            verifiJ1Img->alginByQRCode(qrCodeWidth);
        }
        return;
    }

    // ���ע��ͼ��У������²�ͼ�Ƿ�OK�� ok �Ļ�ֱ��ʹ��orb��׼����ͼ����ͼ��ok��Ҫ�ö�ά��У����׼
    bool checkCutOrigin = regImage->checkCutImg(Params::CUT_SIZE[0]);
    if (checkCutOrigin)
    {
        regImage->alginByORB(regImage->qrPointsOrigin, qrCodeWidth);
        verifiImg->alginByORB(regImage->qrPoints, qrCodeWidth, regImage->warpImage.clone());

        // TODO��Ϊ�˲��ԣ�ʹ��python��׼���ͼƬ�����´���һ������Ľ��
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
        regImage->alginByQRCode(qrCodeWidth); // ͸��任У��
        verifiImg->alginByQRCode(qrCodeWidth); // ͸��任У��


        if (NULL != verifiJ1Img)
        {
            verifiJ1Img->alginByORB(verifiJ1Img->qrPoints, qrCodeWidth, verifiJ1Img->warpImage);
        }
    }


        
}

// ��ͼ
void ImageCompare::cutImgs(int qrCodeWidth)
{
    std::vector<cv::Mat> regImages = regImage->cutImgs(qrCodeWidth, Params::CUT_SIZE[1], Params::CUT_SIZE[2], Params::CUT_SIZE[0]); // �ü�4��ֽ��ͼƬ
    std::vector<cv::Mat> verifiImages = verifiImg->cutImgs(qrCodeWidth, Params::CUT_SIZE[1], Params::CUT_SIZE[2], Params::CUT_SIZE[0]); // �ü�4��ֽ��ͼƬ

    if (NULL != dertImage)
    {
        verifiJ1Img->cutImgs(qrCodeWidth, Params::CUT_SIZE[1], Params::CUT_SIZE[2], Params::CUT_SIZE[0]); // �ü�4��ֽ��ͼƬ
        dertImage->cutImgs();
    }
    m_regImagesCut = regImages;
    m_verifiImagesCut = verifiImages;
}

// ͼ�������Ѿ��ü��õ�ע��ͼ������ͼֽ��ͼ���д������㣬
typedef enum {
    TYPE_VERIFI_IMG,
    TYPE_DERT_IMG,
}CALC_VERIFI_IMG_TYPE;
void ImageCompare::calc(std::shared_ptr<QRCodePaperImage> regImage, std::shared_ptr<QRCodePaperImage> verifiImg)
{
    /* xy �����sobel */
    std::vector<cv::Mat> regImages = regImage->preProcess(); // ��4��ֽ��ͼƬ����ͼ����
    std::vector<cv::Mat> verifiImages = verifiImg->preProcess(); // ��4��ֽ��ͼƬ����ͼ����


    std::vector<double> maxSame, maxNotSame;
    std::vector<std::string> notSameIndex;
    if (Params::SOBEL_CALC_AVG)
    {
        // ��sobel x��y�ֱ��������Ժ�ȡƽ��ֵ
        std::vector<cv::Mat> regImagesX = regImage->preProcessX();
        std::vector<cv::Mat> verifiImagesX = verifiImg->preProcessX();



        // TODO:���� ʹ��python�ü���ͼ
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

        // TODO:���� ʹ��python�ü���ͼ
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

    // ����ƽ��ֵ�ͼ�ֵ
    double avgTrue = Tools::mean(maxSame);
    double minTrue = *min_element(maxSame.begin(), maxSame.end());
    double maxFalse = *max_element(maxNotSame.begin(), maxNotSame.end());


#ifdef _DEBUG
    // ������ʾ����ַ���
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
    minTrueResult = minTrue; // ��ͬ������С���
    avgTrueResult = avgTrue; // ��ͬ����ƽ�����
    maxFalseResult = maxFalse; // ��ͬ�������ֵ
    spanResult = Tools::roundToFixed(minTrue - maxFalse, 3); // ��ͬ������Сֵ - ��ͬ�������ֵ

} 

void ImageCompare::calc(std::shared_ptr<QRCodePaperImage> regImage, std::shared_ptr<DertImage> verifiImg)
{
    /* xy �����sobel */
    std::vector<cv::Mat> regImages = regImage->preProcess(); // ��4��ֽ��ͼƬ����ͼ����
    std::vector<cv::Mat> verifiImages = verifiImg->preProcess(); // ��4��ֽ��ͼƬ����ͼ����


    std::vector<double> maxSame, maxNotSame;
    std::vector<std::string> notSameIndex;
    if (Params::SOBEL_CALC_AVG)
    {
        // ��sobel x��y�ֱ��������Ժ�ȡƽ��ֵ
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

    // ����ƽ��ֵ�ͼ�ֵ
    double avgTrue = Tools::mean(maxSame);
    double minTrue = *min_element(maxSame.begin(), maxSame.end());
    double maxFalse = *max_element(maxNotSame.begin(), maxNotSame.end());


#ifdef _DEBUG
    // ������ʾ����ַ���
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
    //minTrueResultDertImg = minTrue; // ��ͬ������С���
    //avgTrueResultDertImg = avgTrue; // ��ͬ����ƽ�����
    //maxFalseResultDertImg = maxFalse; // ��ͬ�������ֵ
    //spanResultDertImg = Tools::roundToFixed(minTrue - maxFalse, 3); // ��ͬ������Сֵ - ��ͬ�������ֵ

    trueResults = maxSame;
    falseResults = maxNotSame;
    minTrueResult = minTrue; // ��ͬ������С���
    avgTrueResult = avgTrue; // ��ͬ����ƽ�����
    maxFalseResult = maxFalse; // ��ͬ�������ֵ
    spanResult = Tools::roundToFixed(minTrue - maxFalse, 3); // ��ͬ������Сֵ - ��ͬ�������ֵ
}


// �ҳ�ǰN��������
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

// ʹ��ģ��ƥ�䷨���������
std::vector<std::pair<double, cv::Point>> ImageCompare::calcCCOEFF(cv::Mat image, cv::Mat templateImage) {
    // ����ģ��ƥ��
    // ƥ�䷽��������ƥ�䷽����ʹ�ò�ͬ�ķ��������Ľ����������ܲ�̫һ������Щ���ص�ֵԽ���ʾƥ��̶�Խ�ã�����Щ�������ص�ֵԽС��ʾƥ��̶�Խ�á�
    // CV_TM_SQDIFF ƽ����ƥ�䷨���÷�������ƽ����������ƥ�䣻��õ�ƥ��ֵΪ0��ƥ��Խ�ƥ��ֵԽ��
    // CV_TM_CCORR ���ƥ�䷨���÷������ó˷���������ֵԽ�����ƥ��̶�Խ�á�
    // CV_TM_CCOEFF ���ϵ��ƥ�䷨��1��ʾ������ƥ�䣻 - 1��ʾ����ƥ�䡣
    // CV_TM_SQDIFF_NORMED ��һ��ƽ����ƥ�䷨
    // CV_TM_CCORR_NORMED ��һ�����ƥ�䷨
    // CV_TM_CCOEFF_NORMED ��һ�����ϵ��ƥ�䷨

    cv::Mat result;
    /*
    * image W*H
    * templateImage w*h
    * result (W - w + 1)*(H - h + 1)
    */
    cv::matchTemplate(image, templateImage, result, cv::TM_CCOEFF_NORMED);

    // ���һ��������ֵ��λ��,ǰ10λ
    std::vector<std::pair<double, cv::Point>> maxVals = findMax(result);
    return maxVals;
}


// ��srcImage�вü�ȥ����ΧMATCH_POSITION���ش�С��Сͼ
cv::Mat ImageCompare::cutVerifiImages(cv::Mat srcImage) {
    int h = srcImage.rows;
    int w = srcImage.cols;
    // ������ֽ��ͼƬ�����С
    cv::Rect rect(Params::MATCH_POSITION, Params::MATCH_POSITION, w - 2 * Params::MATCH_POSITION, h - 2 * Params::MATCH_POSITION);
    cv::Mat rectImg = srcImage(rect);
    return rectImg;
}

// ͼƬ�Ա�
double ImageCompare::compareImg(cv::Mat img1, cv::Mat img2) 
{
    // ���img2�ľ����img1����һ�������ȵ���Ϊͬһ�������ٿ�ʼ�ȶ�
    if ((img1.rows > img1.cols && img2.rows < img2.cols) || (img1.rows < img1.cols && img2.rows > img2.cols)) {
        //img2 = img2.t(); // ת��
        img2 = img2.reshape(img2.channels(), img2.cols);
    }

    // 1��ע��ͼ������ͼһ����ֱ�ӱȽϣ�img1��img2����������С�ü�MATCH_POSITIONһȦ�����أ���ʱ_img1��_img2��Сһ����ģ��ƥ��ֻ��Ƚ�һ��
    cv::Mat _img1 = cutVerifiImages(img1);
    cv::Mat _img2 = cutVerifiImages(img2);
    std::vector<std::pair<double, cv::Point>> maxVals1 = calcCCOEFF(_img2, _img1);
    // ������ϵ����λ��
    double max1 = maxVals1[0].first;

    // 2�������1�Ƚ�֮��������ϵ����RECALCULATE_THRESHOLD��0.2, 0.5������ֵ��Χ�ڣ���Ҫ������ͼ��ע��ͼ����ƽ��ģ��ƥ�䣬������׼������ƫ��
    if (max1 > Params::RECALCULATE_THRESHOLD[0] && max1 < Params::RECALCULATE_THRESHOLD[1]) {
        // ��ʱ�����img2��û��������С��ͼ����_img1��һȦ��_img1��img2�н���ģ��ƥ�������Σ�ȡ���ֵ
        std::vector<std::pair<double, cv::Point>> maxVals2 = calcCCOEFF(img2, _img1);
        max1 = maxVals2[0].first;
    }

    return Tools::roundToFixed(max1, 3);
}

// ��������ͼƬ�Ա�
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

// ������������ƽ����������С����3λ
double ImageCompare::avgValue(double v1, double v2)
{
    //return (v1 + v2) / 2;
    return Tools::roundToFixed((v1 + v2) / 2, 3);
}

void ImageCompare::compare(int qrCodeWidth)
{
    int regQrCodeWidth = regImage->qrWidthOrigin;
    int verifiQrCodeWidth = verifiImg->qrWidthOrigin;
    // ������׼�Ķ�ά���ȱ�׼(-1��ʾ��ע��ͼ������ͼ��С��Ϊ׼��������ָ����ֵΪ׼)
    if (qrCodeWidth == -1)
    {
        qrCodeWidth = std::min(regQrCodeWidth, verifiQrCodeWidth);
    }
    // ��qrCodeWidth��׼��ü�ָ��ͼ
    algin(qrCodeWidth);

    // ��ͼ
    //regImages, verifiImages = cutImgs(qrCodeWidth)
    cutImgs(qrCodeWidth);
    

    // �Ƚ� ����ͼ��J2����ע��ͼ
    //maxSame, maxNotSame, minTrue, avgTrue, maxFalse, showTrueResults, showFlaseResults = 
    calc(regImage, verifiImg);
  
    if (NULL == dertImage)
    {
        return;
        //return  maxSame, maxNotSame, [], []
    }

    // �Ƚ� ��ͼ dertImg��J2 - J1����ע��ͼ
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

// ʹ�ò�ͼ���㣬Ĭ��
void ImageCompare::useDertImage(std::string j1ImagePath)
{
    verifiJ1Img= std::make_shared<QRCodePaperImage>(j1ImagePath, imageTypeVerifiJ1);
    dertImage = std::make_shared<DertImage>(verifiImg, verifiJ1Img);
}

