#include "QRCodePaperImage.h"

#include <vector>

#include "Tools.h"
#include "util.h"
#include "QRCodeParser.h"
#include "PreprocessImageTool.h"


QRCodePaperImage::QRCodePaperImage(std::string filePath, int type)
{

    tiffISO = 0.0;// tiff��Ϣ ISO�����ٶ�
    tiffExposureTime = 0.0;// tiff��Ϣ �ع�ʱ��
    qrWidthOrigin = 0;// ԭͼ�Ķ�ά����
    qrWidth = 0;// ͸��任��Ķ�ά����
    qrBlockWidth = 0;// ͸��任У����Ķ�ά��block��С
    parseStatus = true;


    m_type = type;  // 0 ע��ͼ�� 1 ����ͼ
	m_filePath = filePath;// ԭʼ�ļ�·��
	filename = Tools::fileName(filePath);

    init();
}

// ��ʼ��������8λ�Ҷ�ͼ��ʶ���ά��
void QRCodePaperImage::init()
{
    // ����Ϊ�Ҷ�ͼ
    originImageOld = util::loadPaperImage(m_filePath, true);

    // ��ȡtiffͼƬ iso���ع�ʱ�䣬���ں����Ĳ�ͼ����
    tiffISO = util::getExifInfo(m_filePath, "Exif.Image.ISOSpeedRatings");
    tiffExposureTime = util::getExifInfo(m_filePath, "Exif.Image.ExposureTime");

    parseQRCodeInfo(originImageOld);
    if (!parseStatus)
    {
        return;
    }

    m_originImage = getSmallImage(originImageOld, qrWidthOrigin, qrCodeCenterPointOrigin); // �Զ�ά�����ġ��߳����ü����㹻���ͼƬ��Ϊ���������õ�ԭͼ

    // ��Сͼ�����»�ȡ��ά����Ϣ
    parseQRCodeInfo(m_originImage);
}


// ʶ���ά��, ���ά�����ݡ��ĸ����㡢�Լ���ά����
void QRCodePaperImage::parseQRCodeInfo(cv::Mat image)
{
    // ʶ���ά��, ���ά�����ݡ��ĸ����㡢�Լ���ά����
    QRCodeParser qrParser;
    parseStatus = qrParser.parseQrCodeImage(image);
    if (!parseStatus)
    {
        // ��ά��ûʶ����������ʧ��״̬
        return;
    }

    qrText = qrParser.getText();
    qrPointsOrigin = qrParser.getPoints();
    qrShape = qrParser.getShape();
    qrWidthOrigin = calcuQrCodeWidth(qrPointsOrigin);// �����ά��߳�
    qrCodeCenterPointOrigin = calcuQrCodeCenterPoint(qrPointsOrigin);// �����ά�����ĵ�
}
    


// �����ά��߳�
int QRCodePaperImage::calcuQrCodeWidth(std::vector<cv::Point> points)
{
    // NORM_L2 ŷʽ���뼴����֮��ֱ�߾���
    double width1 = cv::norm(points[0] - points[1]);// ���� - ���� �߳�
    double width2 = cv::norm(points[1] - points[2]);// ���� - ���� �߳�
    double width3 = cv::norm(points[2] - points[3]);// ���� - ���� �߳�
    double width4 = cv::norm(points[3] - points[0]);// ���� - ���� �߳�
    // �߳�ȡ���ģ���С�ģ�ȡƽ��ֵ����ȡƽ��ֵ

    int mean = (width1 + width2 + width3 + width4) / 4;
    return mean;
}

// �����ά�����ĵ�
cv::Point QRCodePaperImage::calcuQrCodeCenterPoint(const std::vector<cv::Point>& points) 
{

    // �㷨1����ά�����½������ϽǶԽ��ߵ��������ģ���Ϊ�Ƕ�ά������
    //x = np.int32((points[0][0] + points[2][0]) / 2)
    //y = np.int32((points[0][1] + points[2][1]) / 2)

    //// �㷨2�����ݶ�ά�����½������ϽǶԽ��ߣ����Ͻ������½ǶԽ��� ���ཻ����Ϊ��ά�����ĵ�
    //// TODO
    //// ��ʱ��Ϊ��ά�����½ǿ������ϴ�һЩ���ᵼ���㷨2���ܲ�̫׼ȷ���������㷨1Ϊ��

    cv::Point center(0, 0);
    int numPoints = static_cast<int>(points.size());

    for (const auto& point : points) {
        center.x += point.x;
        center.y += point.y;
    }

    center.x /= numPoints;
    center.y /= numPoints;

    return center;
}


// �Զ�ά�����ġ��߳����ü����㹻���ͼƬ��Ϊ���������õ�ԭͼ
cv::Mat QRCodePaperImage::getSmallImage(cv::Mat originImage, int qrWidth, cv::Point centerPoint)
{

    int halfWidth = qrWidth;
    cv::Rect roiRect(centerPoint.x - halfWidth, centerPoint.y - halfWidth, qrWidth * 2, qrWidth * 2);
    cv::Mat smallImg = originImage(roiRect);
    return smallImg;
}


/// @brief �ü�ָ��ͼСͼ��Χ�ƶ�ά��ü����������ĸ���������
/// @param qrCodeWidth ͸��任��׼�Ķ�ά��߳���׼
/// @param cutWidth ���(����һ��)
/// @param cutHeight �߶�(�̵�һ��)
/// @param padding �ü��������ά��ߵ����׾���
/// @return 
std::vector<cv::Mat> QRCodePaperImage::cutImgs(int qrCodeWidth, int cutWidth, int cutHeight, int padding)
{

    // �����ά��block��ȡ��ü�ͼƬpadding
    int qrBlockWidth = QRCodeParser::calcBlockwidth(warpImage, qrPoints, qrCodeWidth, qrShape);

    int _padding = qrBlockWidth * padding;
    int _cutHeight = qrBlockWidth * cutHeight;
    // _padding = 10
    // _cutHeight = 30
    // �ü�ͼƬ, ���ص��Ƕ�ά�� �������ҵ�Сͼ
    return calcCutImage(warpImage, qrPoints, qrCodeWidth, cutWidth, _cutHeight, _padding);
}

/*
 * ȷ��ԭʼ��ά��4������, �Զ�ά����ԭʼͼƬ�����½ǡ����Ͻǡ����Ͻǡ����½�˳�򷵻�
 */
std::vector<cv::Point> QRCodePaperImage::adjustPoints(std::vector<cv::Point> originPoints)
{
    std::vector<cv::Point> points;

    if (originPoints.empty())
    {
        return points;
    }
    cv::Point leftBottom;
    cv::Point leftTop;
    cv::Point rightTop;
    cv::Point rightBottom;

    // �����ĸ�����ԭ��ľ��롢��С���롢������ 
    std::vector<int> distances;
    for (size_t i = 0; i < originPoints.size(); i++)
    {
        distances.push_back(distanceToOrigin(originPoints[i].x, originPoints[i].y));
    }
    int minDistance = *std::min_element(distances.cbegin(), distances.cend());
    int maxDistance = *std::max_element(distances.cbegin(), distances.cend());

    // ȷ��leftTop��rightBottom 
    for (size_t j = 0; j < distances.size(); j++)
    {
        if (distances[j] == minDistance)
        {
            leftTop = originPoints[j];
        }
        if (distances[j] == maxDistance)
        {
            rightBottom = originPoints[j];
        }
    }

    // ȷ��rightTop��leftBottom 
    for (size_t k = 0; k < distances.size(); k++)
    {
        if ((distances[k] != minDistance) && (distances[k] != maxDistance))
        {
            if (originPoints[k].x - leftTop.x > originPoints[k].y - leftTop.y)
            {
                rightTop = originPoints[k];
            }
            else
            {
                leftBottom = originPoints[k];
            }
        }
    }

    points.push_back(leftBottom);
    points.push_back(leftTop);
    points.push_back(rightTop);
    points.push_back(rightBottom);

    return points;
}

int QRCodePaperImage::distanceToOrigin(int x, int y)
{
    return std::sqrt(x * x + y * y);
}

/*
 * �ж�ע��ͼ�ܷ�ֱ�Ӳü����ü�����Ͷ�ά���Ƿ��ཻ��
 */
bool QRCodePaperImage::checkCutImg(int cutPadding)
{
    int qrCodeWidth = this->qrWidthOrigin;
    cv::Mat checkImg = this->m_originImage;
    std::vector<cv::Point> qrPointsCheck = this->adjustPoints(this->qrPointsOrigin);
    // �����ά��block��ȡ��ü�ͼƬpadding
    this->qrBlockWidth = QRCodeParser::calcBlockwidth(checkImg, qrPointsCheck, qrCodeWidth, this->qrShape);
    int padding = this->qrBlockWidth * cutPadding;
    // padding = 3
    cv::Point leftTopPoint = qrPointsCheck[1]; // ���Ͻ� 
    // �������ĵ�
    int centerX = leftTopPoint.x + qrCodeWidth / 2;
    int centerY = leftTopPoint.y + qrCodeWidth / 2;

    // ���Ϸ�ͼΪ1���������½Ƕ��㡢���½Ƕ���
    int img1LB_X = centerX - qrCodeWidth / 2;
    int img1LB_Y = centerY - qrCodeWidth / 2 - padding;
    int img1RB_X = centerX + qrCodeWidth / 2;
    int img1RB_Y = centerY - qrCodeWidth / 2 - padding;
    if (this->hasIntersect(cv::Point(img1LB_X, img1LB_Y), cv::Point(img1RB_X, img1RB_Y), qrPointsCheck[1], qrPointsCheck[2]))
    {
        return false;
    }

    // ���·�ͼΪ2���������ϽǶ��㡢���ϽǶ��� 
    int img2LT_X = centerX - qrCodeWidth / 2;
    int img2LT_Y = centerY + qrCodeWidth / 2 + padding;
    int img2RT_X = centerX + qrCodeWidth / 2;
    int img2RT_Y = centerY + qrCodeWidth / 2 + padding;
    if (this->hasIntersect(cv::Point(img2LT_X, img2LT_Y), cv::Point(img2RT_X, img2RT_Y), qrPointsCheck[0], qrPointsCheck[3]))
    {
        return false;
    }

    // ��ߵ�ͼΪ3���������ϽǶ��㡢���½Ƕ�
    int img3RT_X = centerX - qrCodeWidth / 2 - padding;
    int img3RT_Y = centerY - qrCodeWidth / 2;
    int img3RB_X = centerX - qrCodeWidth / 2 - padding;
    int img3RB_Y = centerY + qrCodeWidth / 2;
    if (this->hasIntersect(cv::Point(img3RT_X, img3RT_Y), cv::Point(img3RB_X, img3RB_Y), qrPointsCheck[0], qrPointsCheck[1]))
    {
        return false;
    }

    // �ұߵ�ͼΪ4���������ϽǶ��㡢���½Ƕ��� 
    int img4LT_X = centerX + qrCodeWidth / 2 + padding;
    int img4LT_Y = centerY - qrCodeWidth / 2;
    int img4LB_X = centerX + qrCodeWidth / 2 + padding;
    int img4LB_Y = centerY + qrCodeWidth / 2;
    if (this->hasIntersect(cv::Point(img4LT_X, img4LT_Y), cv::Point(img4LB_X, img4LB_Y), qrPointsCheck[2], qrPointsCheck[3]))
    {
        return false;
    }

    return true;
}

/*
 * ����ʵ��
 */
int QRCodePaperImage::cross(cv::Point p1, cv::Point p2, cv::Point p3)
{
    int x1 = p2.x - p1.x;
    int y1 = p2.y - p1.y;
    int x2 = p3.x - p1.x;
    int y2 = p3.y - p1.y;
    return x1 * y2 - x2 * y1;
}

/*
 * �ж����߶��Ƿ��ཻ
 */
bool QRCodePaperImage::hasIntersect(cv::Point p1, cv::Point p2, cv::Point p3, cv::Point p4)
{
    bool intersect = false;
    // �����ų⣬��l1��l2Ϊ�Խ��ߵľ��α��ཻ���������߶β��ཻ 
    if (std::max(p1.x, p2.x) >= std::min(p3.x, p4.x)  // ����1���Ҷ˴��ھ���2����� 
        && std::max(p3.x, p4.x) >= std::min(p1.x, p2.x)  // ����2���Ҷ˴��ھ�������� 
        && std::max(p1.y, p2.y) >= std::min(p3.y, p4.y)  // ����1��߶˴��ھ�����Ͷ� 
        && std::max(p3.y, p4.y) >= std::min(p1.y, p2.y)) // ����2��߶˴��ھ�����Ͷ�
    {
        // ��ͨ�������ų�����п���ʵ�� 
        if (cross(p1, p2, p3) * cross(p1, p2, p4) <= 0
            && cross(p3, p4, p1) * cross(p3, p4, p2) <= 0)
        {
            intersect = true;
        }
    }
    
    return intersect;
}

std::vector<cv::Mat> QRCodePaperImage::calcCutImage(cv::Mat srcImage, const std::vector<cv::Point>& qrPoints, int qrCodeWidth, int cutWidth, int cutHeight, int padding)
{
    if (cutWidth == -1)
    {
        cutWidth = qrCodeWidth;
    }

    cv::Point leftTopPoint = qrPoints[1]; /* ���Ͻ� */
    cv::Mat img = srcImage;

    /* �������ĵ� */
    int centerX = leftTopPoint.x + qrCodeWidth / 2;
    int centerY = leftTopPoint.y + qrCodeWidth / 2;

    /* ���Ϸ�ͼΪ1���ȼ������ϽǶ��� */
    int img1LT_X = centerX - cutWidth / 2;
    int img1LT_Y = centerY - qrCodeWidth / 2 - padding - cutHeight;
    cv::Mat upImage = img(cv::Rect(img1LT_X, img1LT_Y, cutWidth, cutHeight));
    //m_cutImages.push_back(upImage);

    /* ���·�ͼΪ2���ȼ������ϽǶ��� */
    int img2LT_X = centerX - cutWidth / 2;
    int img2LT_Y = centerY + qrCodeWidth / 2 + padding;
    cv::Mat downImage = img(cv::Rect(img2LT_X, img2LT_Y, cutWidth, cutHeight));
    //m_cutImages.push_back(downImage);

    /* ��ߵ�ͼΪ3���ȼ������ϽǶ���  ע���������߲�ͼʱ��ߵĿ���*/
    int img3LT_X = centerX - qrCodeWidth / 2 - padding - cutHeight;
    int img3LT_Y = centerY - cutWidth / 2;
    cv::Mat leftImage = img(cv::Rect(img3LT_X, img3LT_Y, cutHeight, cutWidth));
    //m_cutImages.push_back(leftImage);

    /* �ұߵ�ͼΪ4���ȼ������ϽǶ��� ע���������߲�ͼʱ��ߵĿ���*/
    int img4LT_X = centerX + qrCodeWidth / 2 + padding;
    int img4LT_Y = centerY - cutWidth / 2;
    cv::Mat rightImage = img(cv::Rect(img4LT_X, img4LT_Y, cutHeight, cutWidth));
    //m_cutImages.push_back(rightImage);


    //���ص�˳��Ϊ ���¡��ҡ���
    m_cutImages.push_back(leftImage);
    m_cutImages.push_back(downImage);
    m_cutImages.push_back(rightImage);
    m_cutImages.push_back(upImage);

    // �������
    //{
    //    /* ����ʱ�ڴ�ͼ�ϻ���Ҫ�ü������� */
    //    /* 1���Զ�ά�����ģ���ά���Ȼ����߿� */
    //    img = drawRect(img, leftTopPoint.x, leftTopPoint.y, qrCodeWidth, qrCodeWidth);

    //    /* 2����͸��任4�����㻭���߿� */
    //    std::vector< std::vector<cv::Point> > cnts(1);
    //    std::vector<cv::Point>& cnt = cnts[0];
    //    cnt.push_back(this->qrPoints[1]);
    //    cnt.push_back(this->qrPoints[2]);
    //    cnt.push_back(this->qrPoints[3]);
    //    cnt.push_back(this->qrPoints[4]);
    //    cv::drawContours(img, cnts, 0, cv::Scalar(255, 0, 0), 1);

    //    /* 3��͸��任���ٴ�ʶ���ά����߿� */
    //    std::vector< std::vector<cv::Point> > cntsNew(1);
    //    std::vector<cv::Point>& cntNew = cntsNew[0];
    //    cntNew.push_back(this->qrPointsNew[1]);
    //    cntNew.push_back(this->qrPointsNew[2]);
    //    cntNew.push_back(this->qrPointsNew[3]);
    //    cntNew.push_back(this->qrPointsNew[4]);
    //    cv::drawContours(img, cntsNew, 0, cv::Scalar(255, 0, 0), 1);

    //    /* �Զ�ά��Ϊ���Ľ�ȡ������ͼ�Σ�������ʾ��cutShowImage */
    //    int halfWidth = qrCodeWidth / 2 + cutHeight + padding + 30;
    //    this->cutShowImage = img(cv::Rect(centerX - halfWidth, centerY - halfWidth, halfWidth, halfWidth));
    //}

    return m_cutImages;
}

cv::Mat QRCodePaperImage::drawRect(cv::Mat img, int x, int y, int w, int h, int index)
{

    std::vector< std::vector<cv::Point> > cnts(1);
    std::vector<cv::Point>& cnt = cnts[0];
    cnt.push_back(cv::Point(x, y));
    cnt.push_back(cv::Point(x + w, y));
    cnt.push_back(cv::Point(x + w, y + h));
    cnt.push_back(cv::Point(x, y + h));
    cv::drawContours(img, cnts, 0, cv::Scalar(0, 0, 255), 1);

    if (index != 0)
    {
        cv::putText(img, cv::format("%d", index), cv::Point(x + w / 2 - 10, y + h / 2 + 10), cv::FONT_HERSHEY_SIMPLEX, 1, cv::Scalar(0, 0, 255), 1);
    }

    return img;
}



// ֽ��ͼԤ����
std::vector<cv::Mat> QRCodePaperImage::preProcess()
{
    ppCutImages = PreprocessImageTool::preProcessBatching(m_cutImages, "xy");
    return ppCutImages;
}

std::vector<cv::Mat> QRCodePaperImage::preProcessX()
{
    ppCutImagesX = PreprocessImageTool::preProcessBatching(m_cutImages, "x");
    return ppCutImagesX;
}

std::vector<cv::Mat> QRCodePaperImage::preProcessY()
{
    ppCutImagesY = PreprocessImageTool::preProcessBatching(m_cutImages, "y");
    return ppCutImagesY;
}


void QRCodePaperImage::alginByQRCode(int qrCodeWidth)
{
    imageWarp(qrCodeWidth);
}

cv::Mat QRCodePaperImage::imageWarp(int qrCodeWidth) {
    cv::Mat image = m_originImage;
    std::vector<cv::Point> srcPoints = qrPointsOrigin;
    qrWidth = qrCodeWidth;

    int w = image.cols;
    int h = image.rows;

    cv::Point qrCodeCenterPoint = calcuQrCodeCenterPoint(srcPoints); qrCodeCenterPointOrigin.x;
    int centerX = qrCodeCenterPoint.x;
    int centerY = qrCodeCenterPoint.y;
    int halfWidth = qrWidth / 2;

    // ����ԭͼ��ά�����ĵ㣬���������Ķ���λ��
    cv::Point left_bottom(centerX - halfWidth, centerY + halfWidth);
    cv::Point left_top(centerX - halfWidth, centerY - halfWidth);
    cv::Point right_top(centerX + halfWidth, centerY - halfWidth);
    cv::Point right_bottom(centerX + halfWidth, centerY + halfWidth);

    std::vector<cv::Point> targetPoints = { left_bottom, left_top, right_top, right_bottom };

    // �任ǰ���ĸ����������£����ϡ����ϡ����¡�����
    std::vector<cv::Point2f> _srcPoints = { srcPoints[1], srcPoints[2], srcPoints[0], srcPoints[3] };
    std::vector<cv::Point2f> _targetPoints = { targetPoints[1], targetPoints[2], targetPoints[0], targetPoints[3] };
    // �õ�͸�ӱ任����
    cv::Mat matrix = cv::getPerspectiveTransform(_srcPoints, _targetPoints);
    // ����͸�ӱ任
    cv::Mat warpImageTemp;
    cv::warpPerspective(image, warpImageTemp, matrix, cv::Size(h, w));

    warpImage = warpImageTemp;
    qrPoints = targetPoints;
    return warpImage;
}


void QRCodePaperImage::alginByORB(std::vector<cv::Point> qrPointsOrigin, int qrCodeWidth, cv::Mat baseImg)
{
    cv::Mat currentImg = m_originImage;

    // ��ά�벻У������£��������ά��4��������ʵ��ԭͼ�ϵĶ����������½ǡ����Ͻǡ����Ͻǡ����½ǡ�
    qrPoints = adjustPoints(qrPointsOrigin);

    // baseImgΪ�գ���ʾ�Լ����ǻ�׼ͼ������Ҫ��׼
    if (baseImg.empty()) {
        if (this->qrWidthOrigin > qrCodeWidth) {
            double ratio = static_cast<double>(qrCodeWidth) / this->qrWidthOrigin;
            cv::resize(currentImg, warpImage, cv::Size(), ratio, ratio);
            // ���¼����ά�붥��
            std::vector<cv::Point> points;
            QRCodeParser qrParser;
            qrParser.parseQrCodeImage(warpImage);
            this->qrText = qrParser.getText();
            points = qrParser.getPoints();
            this->qrShape = qrParser.getShape();
            // TODO: self.qrPoints = self.adjustPoints(points[0])
            this->qrPoints = adjustPoints(points); 
        }
        else {
            warpImage = currentImg;
        }
        return;
    }

    // ��baseImg��orb��׼
    // ʹ��ORB�㷨���ؼ���ͼ���������

    // TODO: ��һ��ǰ���Ա�һ��ͼƬ�Ƿ����,�������
    //{     
    //    cv::Mat baseImg_py = cv::imread(R"(D:\ZhiWen\SinosunCode\TempImg\baseImg.tiff)", cv::IMREAD_UNCHANGED);
    //    cv::Mat currentImg_py = cv::imread(R"(D:\ZhiWen\SinosunCode\TempImg\currentImg.tiff)", cv::IMREAD_UNCHANGED);

    //    double tolerance = 1e-5; // Define a tolerance threshold

    //    bool baseImgSame = cv::norm(baseImg_py, baseImg, cv::NORM_L2) < tolerance;
    //    bool currentImgSame = cv::norm(currentImg_py, currentImg, cv::NORM_L2) < tolerance;
    //}

    cv::normalize(currentImg, currentImg, 0, 255, cv::NORM_MINMAX, CV_8U); // �ȹ�һ������
    cv::normalize(baseImg, baseImg, 0, 255, cv::NORM_MINMAX, CV_8U);
    // TODO: �������һ���������ͼƬ����һ��,�Ա�һ�¹�һ�������ͼƬ
    //{
    //    cv::Mat currentImg_normalize_py = cv::imread(R"(D:\ZhiWen\SinosunCode\TempImg\currentImg_normalize.tiff)", cv::IMREAD_UNCHANGED);
    //    cv::Mat baseImg_normalize_py = cv::imread(R"(D:\ZhiWen\SinosunCode\TempImg\baseImg_normalize.tiff)", cv::IMREAD_UNCHANGED);

    //    double tolerance = 1e-5; // Define a tolerance threshold
    //    bool currentImg_normalizeSame = cv::norm(currentImg_normalize_py, currentImg, cv::NORM_L2) < tolerance;
    //    bool baseImg_normalizeSame = cv::norm(baseImg_normalize_py, baseImg, cv::NORM_L2) < tolerance;

    //    // ��һ������Ľ������ȣ��˴���������һ��pythonͼƬ�Ĺ�һ��
    //    cv::Mat currentImg_py = cv::imread(R"(D:\ZhiWen\SinosunCode\TempImg\currentImg.tiff)", cv::IMREAD_UNCHANGED);
    //    cv::Mat currentImgPyNormal;
    //    cv::normalize(currentImg_py, currentImgPyNormal, 0, 255, cv::NORM_MINMAX, CV_8U);
    //    bool isOk_c_p = cv::norm(currentImg_normalize_py, currentImgPyNormal, cv::NORM_L2) < tolerance;
    //    // �Ƿ��c++�������
    //    bool isOk_c_c = cv::norm(currentImg, currentImgPyNormal, cv::NORM_L2) < tolerance;
    //    // ����������c++����Ľ��
    //    cv::Mat baseImg_normalize_other_c = cv::imread(R"(D:\ZhiWen\SinosunCode\TempImg\currentImgPyNormal.tiff)", cv::IMREAD_UNCHANGED);
    //    bool isOk_c_other_c = cv::norm(baseImg_normalize_other_c, currentImgPyNormal, cv::NORM_L2) < tolerance;
    //}

    // TODO: ��python��һ����ͼƬ���в���
    //currentImg = cv::imread(R"(D:\ZhiWen\SinosunCode\TempImg\currentImg_normalize.tiff)", cv::IMREAD_UNCHANGED);
    //baseImg = cv::imread(R"(D:\ZhiWen\SinosunCode\TempImg\baseImg_normalize.tiff)", cv::IMREAD_UNCHANGED);

    cv::Ptr<cv::ORB> orb = cv::ORB::create(1000, 1.2f, 10);
    std::vector<cv::KeyPoint> kp1, kp2;
    cv::Mat des1, des2;
    orb->detectAndCompute(currentImg, cv::noArray(), kp1, des1);
    orb->detectAndCompute(baseImg, cv::noArray(), kp2, des2);

    // ʹ�ñ���ƥ���㷨����������ƥ��
    cv::BFMatcher bf(cv::NORM_HAMMING, true);
    std::vector<cv::DMatch> matches;
    bf.match(des1, des2, matches);

    // ��ȡ�õ�ƥ��ԵĹؼ���
    std::vector<cv::Point2f> src_pts, dst_pts;
    for (const cv::DMatch& match : matches) {
        src_pts.push_back(kp1[match.queryIdx].pt);
        dst_pts.push_back(kp2[match.trainIdx].pt);
    }

    // ���Ƶ�Ӧ�Ծ���
    cv::Mat M = cv::findHomography(src_pts, dst_pts, cv::RANSAC);

    // ����ǰͼ����׼����׼ͼ��
    cv::Mat aligned_image;

    cv::warpPerspective(m_originImage, aligned_image, M, baseImg.size());

    warpImage = aligned_image;
}
