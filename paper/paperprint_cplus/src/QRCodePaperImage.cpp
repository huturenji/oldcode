#include "QRCodePaperImage.h"

#include <vector>

#include "Tools.h"
#include "util.h"
#include "QRCodeParser.h"
#include "PreprocessImageTool.h"


QRCodePaperImage::QRCodePaperImage(std::string filePath, int type)
{

    tiffISO = 0.0;// tiff信息 ISO快门速度
    tiffExposureTime = 0.0;// tiff信息 曝光时间
    qrWidthOrigin = 0;// 原图的二维码宽度
    qrWidth = 0;// 透射变换后的二维码宽度
    qrBlockWidth = 0;// 透射变换校正后的二维码block大小
    parseStatus = true;


    m_type = type;  // 0 注册图， 1 核验图
	m_filePath = filePath;// 原始文件路径
	filename = Tools::fileName(filePath);

    init();
}

// 初始化：加载8位灰度图、识别二维码
void QRCodePaperImage::init()
{
    // 加载为灰度图
    originImageOld = util::loadPaperImage(m_filePath, true);

    // 读取tiff图片 iso、曝光时间，用于后续的差图计算
    tiffISO = util::getExifInfo(m_filePath, "Exif.Image.ISOSpeedRatings");
    tiffExposureTime = util::getExifInfo(m_filePath, "Exif.Image.ExposureTime");

    parseQRCodeInfo(originImageOld);
    if (!parseStatus)
    {
        return;
    }

    m_originImage = getSmallImage(originImageOld, qrWidthOrigin, qrCodeCenterPointOrigin); // 以二维码中心、边长，裁剪出足够大的图片作为后续计算用的原图

    // 裁小图后重新获取二维码信息
    parseQRCodeInfo(m_originImage);
}


// 识别二维码, 获二维码内容、四个顶点、以及二维码宽度
void QRCodePaperImage::parseQRCodeInfo(cv::Mat image)
{
    // 识别二维码, 获二维码内容、四个顶点、以及二维码宽度
    QRCodeParser qrParser;
    parseStatus = qrParser.parseQrCodeImage(image);
    if (!parseStatus)
    {
        // 二维码没识别出来，标记失败状态
        return;
    }

    qrText = qrParser.getText();
    qrPointsOrigin = qrParser.getPoints();
    qrShape = qrParser.getShape();
    qrWidthOrigin = calcuQrCodeWidth(qrPointsOrigin);// 计算二维码边长
    qrCodeCenterPointOrigin = calcuQrCodeCenterPoint(qrPointsOrigin);// 计算二维码中心点
}
    


// 计算二维码边长
int QRCodePaperImage::calcuQrCodeWidth(std::vector<cv::Point> points)
{
    // NORM_L2 欧式距离即两点之间直线距离
    double width1 = cv::norm(points[0] - points[1]);// 左上 - 右上 边长
    double width2 = cv::norm(points[1] - points[2]);// 左上 - 左下 边长
    double width3 = cv::norm(points[2] - points[3]);// 右上 - 右下 边长
    double width4 = cv::norm(points[3] - points[0]);// 左下 - 右下 边长
    // 边长取最大的？最小的？取平均值？暂取平均值

    int mean = (width1 + width2 + width3 + width4) / 4;
    return mean;
}

// 计算二维码中心点
cv::Point QRCodePaperImage::calcuQrCodeCenterPoint(const std::vector<cv::Point>& points) 
{

    // 算法1：二维码左下角与右上角对角线的坐标中心，认为是二维码中心
    //x = np.int32((points[0][0] + points[2][0]) / 2)
    //y = np.int32((points[0][1] + points[2][1]) / 2)

    //// 算法2：根据二维码左下角与右上角对角线，左上角与右下角对角线 的相交点作为二维码中心点
    //// TODO
    //// 暂时以为二维码右下角可能误差较大一些，会导致算法2可能不太准确，故先以算法1为主

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


// 以二维码中心、边长，裁剪出足够大的图片作为后续计算用的原图
cv::Mat QRCodePaperImage::getSmallImage(cv::Mat originImage, int qrWidth, cv::Point centerPoint)
{

    int halfWidth = qrWidth;
    cv::Rect roiRect(centerPoint.x - halfWidth, centerPoint.y - halfWidth, qrWidth * 2, qrWidth * 2);
    cv::Mat smallImg = originImage(roiRect);
    return smallImg;
}


/// @brief 裁剪指纹图小图，围绕二维码裁剪上下左右四个矩形区域
/// @param qrCodeWidth 透射变换配准的二维码边长标准
/// @param cutWidth 宽度(长的一边)
/// @param cutHeight 高度(短的一边)
/// @param padding 裁剪区域与二维码边的留白距离
/// @return 
std::vector<cv::Mat> QRCodePaperImage::cutImgs(int qrCodeWidth, int cutWidth, int cutHeight, int padding)
{

    // 计算二维码block宽度、裁剪图片padding
    int qrBlockWidth = QRCodeParser::calcBlockwidth(warpImage, qrPoints, qrCodeWidth, qrShape);

    int _padding = qrBlockWidth * padding;
    int _cutHeight = qrBlockWidth * cutHeight;
    // _padding = 10
    // _cutHeight = 30
    // 裁剪图片, 返回的是二维码 上下左右的小图
    return calcCutImage(warpImage, qrPoints, qrCodeWidth, cutWidth, _cutHeight, _padding);
}

/*
 * 确定原始二维码4个顶点, 以二维码在原始图片中左下角、左上角、右上角、右下角顺序返回
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

    // 计算四个点与原点的距离、最小距离、最大距离 
    std::vector<int> distances;
    for (size_t i = 0; i < originPoints.size(); i++)
    {
        distances.push_back(distanceToOrigin(originPoints[i].x, originPoints[i].y));
    }
    int minDistance = *std::min_element(distances.cbegin(), distances.cend());
    int maxDistance = *std::max_element(distances.cbegin(), distances.cend());

    // 确定leftTop、rightBottom 
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

    // 确定rightTop、leftBottom 
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
 * 判断注册图能否直接裁剪（裁剪区域和二维码是否相交）
 */
bool QRCodePaperImage::checkCutImg(int cutPadding)
{
    int qrCodeWidth = this->qrWidthOrigin;
    cv::Mat checkImg = this->m_originImage;
    std::vector<cv::Point> qrPointsCheck = this->adjustPoints(this->qrPointsOrigin);
    // 计算二维码block宽度、裁剪图片padding
    this->qrBlockWidth = QRCodeParser::calcBlockwidth(checkImg, qrPointsCheck, qrCodeWidth, this->qrShape);
    int padding = this->qrBlockWidth * cutPadding;
    // padding = 3
    cv::Point leftTopPoint = qrPointsCheck[1]; // 左上角 
    // 计算中心点
    int centerX = leftTopPoint.x + qrCodeWidth / 2;
    int centerY = leftTopPoint.y + qrCodeWidth / 2;

    // 正上方图为1，计算左下角顶点、右下角顶点
    int img1LB_X = centerX - qrCodeWidth / 2;
    int img1LB_Y = centerY - qrCodeWidth / 2 - padding;
    int img1RB_X = centerX + qrCodeWidth / 2;
    int img1RB_Y = centerY - qrCodeWidth / 2 - padding;
    if (this->hasIntersect(cv::Point(img1LB_X, img1LB_Y), cv::Point(img1RB_X, img1RB_Y), qrPointsCheck[1], qrPointsCheck[2]))
    {
        return false;
    }

    // 正下方图为2，计算左上角顶点、右上角顶点 
    int img2LT_X = centerX - qrCodeWidth / 2;
    int img2LT_Y = centerY + qrCodeWidth / 2 + padding;
    int img2RT_X = centerX + qrCodeWidth / 2;
    int img2RT_Y = centerY + qrCodeWidth / 2 + padding;
    if (this->hasIntersect(cv::Point(img2LT_X, img2LT_Y), cv::Point(img2RT_X, img2RT_Y), qrPointsCheck[0], qrPointsCheck[3]))
    {
        return false;
    }

    // 左边的图为3，计算右上角顶点、右下角顶
    int img3RT_X = centerX - qrCodeWidth / 2 - padding;
    int img3RT_Y = centerY - qrCodeWidth / 2;
    int img3RB_X = centerX - qrCodeWidth / 2 - padding;
    int img3RB_Y = centerY + qrCodeWidth / 2;
    if (this->hasIntersect(cv::Point(img3RT_X, img3RT_Y), cv::Point(img3RB_X, img3RB_Y), qrPointsCheck[0], qrPointsCheck[1]))
    {
        return false;
    }

    // 右边的图为4，计算左上角顶点、左下角顶点 
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
 * 跨立实验
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
 * 判断两线段是否相交
 */
bool QRCodePaperImage::hasIntersect(cv::Point p1, cv::Point p2, cv::Point p3, cv::Point p4)
{
    bool intersect = false;
    // 快速排斥，以l1、l2为对角线的矩形必相交，否则两线段不相交 
    if (std::max(p1.x, p2.x) >= std::min(p3.x, p4.x)  // 矩形1最右端大于矩形2最左端 
        && std::max(p3.x, p4.x) >= std::min(p1.x, p2.x)  // 矩形2最右端大于矩形最左端 
        && std::max(p1.y, p2.y) >= std::min(p3.y, p4.y)  // 矩形1最高端大于矩形最低端 
        && std::max(p3.y, p4.y) >= std::min(p1.y, p2.y)) // 矩形2最高端大于矩形最低端
    {
        // 若通过快速排斥则进行跨立实验 
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

    cv::Point leftTopPoint = qrPoints[1]; /* 左上角 */
    cv::Mat img = srcImage;

    /* 计算中心点 */
    int centerX = leftTopPoint.x + qrCodeWidth / 2;
    int centerY = leftTopPoint.y + qrCodeWidth / 2;

    /* 正上方图为1，先计算左上角顶点 */
    int img1LT_X = centerX - cutWidth / 2;
    int img1LT_Y = centerY - qrCodeWidth / 2 - padding - cutHeight;
    cv::Mat upImage = img(cv::Rect(img1LT_X, img1LT_Y, cutWidth, cutHeight));
    //m_cutImages.push_back(upImage);

    /* 正下方图为2，先计算左上角顶点 */
    int img2LT_X = centerX - cutWidth / 2;
    int img2LT_Y = centerY + qrCodeWidth / 2 + padding;
    cv::Mat downImage = img(cv::Rect(img2LT_X, img2LT_Y, cutWidth, cutHeight));
    //m_cutImages.push_back(downImage);

    /* 左边的图为3，先计算左上角顶点  注意左右两边裁图时宽高的控制*/
    int img3LT_X = centerX - qrCodeWidth / 2 - padding - cutHeight;
    int img3LT_Y = centerY - cutWidth / 2;
    cv::Mat leftImage = img(cv::Rect(img3LT_X, img3LT_Y, cutHeight, cutWidth));
    //m_cutImages.push_back(leftImage);

    /* 右边的图为4，先计算左上角顶点 注意左右两边裁图时宽高的控制*/
    int img4LT_X = centerX + qrCodeWidth / 2 + padding;
    int img4LT_Y = centerY - cutWidth / 2;
    cv::Mat rightImage = img(cv::Rect(img4LT_X, img4LT_Y, cutHeight, cutWidth));
    //m_cutImages.push_back(rightImage);


    //返回的顺序为 左、下、右、上
    m_cutImages.push_back(leftImage);
    m_cutImages.push_back(downImage);
    m_cutImages.push_back(rightImage);
    m_cutImages.push_back(upImage);

    // 测试输出
    //{
    //    /* 测试时在大图上画出要裁剪的区域 */
    //    /* 1、以二维码中心，二维码宽度画的线框 */
    //    img = drawRect(img, leftTopPoint.x, leftTopPoint.y, qrCodeWidth, qrCodeWidth);

    //    /* 2、以透射变换4个顶点画的线框 */
    //    std::vector< std::vector<cv::Point> > cnts(1);
    //    std::vector<cv::Point>& cnt = cnts[0];
    //    cnt.push_back(this->qrPoints[1]);
    //    cnt.push_back(this->qrPoints[2]);
    //    cnt.push_back(this->qrPoints[3]);
    //    cnt.push_back(this->qrPoints[4]);
    //    cv::drawContours(img, cnts, 0, cv::Scalar(255, 0, 0), 1);

    //    /* 3、透射变换后再次识别二维码的线框 */
    //    std::vector< std::vector<cv::Point> > cntsNew(1);
    //    std::vector<cv::Point>& cntNew = cntsNew[0];
    //    cntNew.push_back(this->qrPointsNew[1]);
    //    cntNew.push_back(this->qrPointsNew[2]);
    //    cntNew.push_back(this->qrPointsNew[3]);
    //    cntNew.push_back(this->qrPointsNew[4]);
    //    cv::drawContours(img, cntsNew, 0, cv::Scalar(255, 0, 0), 1);

    //    /* 以二维码为中心截取正方形图形，用作显示的cutShowImage */
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



// 纸纹图预处理
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

    // 根据原图二维码中心点，计算矫正后的顶点位置
    cv::Point left_bottom(centerX - halfWidth, centerY + halfWidth);
    cv::Point left_top(centerX - halfWidth, centerY - halfWidth);
    cv::Point right_top(centerX + halfWidth, centerY - halfWidth);
    cv::Point right_bottom(centerX + halfWidth, centerY + halfWidth);

    std::vector<cv::Point> targetPoints = { left_bottom, left_top, right_top, right_bottom };

    // 变换前将四个顶点排序下：左上、右上、左下、右下
    std::vector<cv::Point2f> _srcPoints = { srcPoints[1], srcPoints[2], srcPoints[0], srcPoints[3] };
    std::vector<cv::Point2f> _targetPoints = { targetPoints[1], targetPoints[2], targetPoints[0], targetPoints[3] };
    // 得到透视变换矩阵
    cv::Mat matrix = cv::getPerspectiveTransform(_srcPoints, _targetPoints);
    // 进行透视变换
    cv::Mat warpImageTemp;
    cv::warpPerspective(image, warpImageTemp, matrix, cv::Size(h, w));

    warpImage = warpImageTemp;
    qrPoints = targetPoints;
    return warpImage;
}


void QRCodePaperImage::alginByORB(std::vector<cv::Point> qrPointsOrigin, int qrCodeWidth, cv::Mat baseImg)
{
    cv::Mat currentImg = m_originImage;

    // 二维码不校正情况下，计算出二维码4个顶点在实际原图上的顶点排序【左下角、左上角、右上角、右下角】
    qrPoints = adjustPoints(qrPointsOrigin);

    // baseImg为空，表示自己就是基准图，不需要配准
    if (baseImg.empty()) {
        if (this->qrWidthOrigin > qrCodeWidth) {
            double ratio = static_cast<double>(qrCodeWidth) / this->qrWidthOrigin;
            cv::resize(currentImg, warpImage, cv::Size(), ratio, ratio);
            // 重新计算二维码顶点
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

    // 以baseImg做orb配准
    // 使用ORB算法检测关键点和计算描述符

    // TODO: 归一化前，对比一下图片是否相等,结论相等
    //{     
    //    cv::Mat baseImg_py = cv::imread(R"(D:\ZhiWen\SinosunCode\TempImg\baseImg.tiff)", cv::IMREAD_UNCHANGED);
    //    cv::Mat currentImg_py = cv::imread(R"(D:\ZhiWen\SinosunCode\TempImg\currentImg.tiff)", cv::IMREAD_UNCHANGED);

    //    double tolerance = 1e-5; // Define a tolerance threshold

    //    bool baseImgSame = cv::norm(baseImg_py, baseImg, cv::NORM_L2) < tolerance;
    //    bool currentImgSame = cv::norm(currentImg_py, currentImg, cv::NORM_L2) < tolerance;
    //}

    cv::normalize(currentImg, currentImg, 0, 255, cv::NORM_MINMAX, CV_8U); // 先归一化处理
    cv::normalize(baseImg, baseImg, 0, 255, cv::NORM_MINMAX, CV_8U);
    // TODO: 把这里归一化处理完的图片保存一下,对比一下归一化过后的图片
    //{
    //    cv::Mat currentImg_normalize_py = cv::imread(R"(D:\ZhiWen\SinosunCode\TempImg\currentImg_normalize.tiff)", cv::IMREAD_UNCHANGED);
    //    cv::Mat baseImg_normalize_py = cv::imread(R"(D:\ZhiWen\SinosunCode\TempImg\baseImg_normalize.tiff)", cv::IMREAD_UNCHANGED);

    //    double tolerance = 1e-5; // Define a tolerance threshold
    //    bool currentImg_normalizeSame = cv::norm(currentImg_normalize_py, currentImg, cv::NORM_L2) < tolerance;
    //    bool baseImg_normalizeSame = cv::norm(baseImg_normalize_py, baseImg, cv::NORM_L2) < tolerance;

    //    // 归一化处理的结果不相等，此处单独处理一下python图片的归一化
    //    cv::Mat currentImg_py = cv::imread(R"(D:\ZhiWen\SinosunCode\TempImg\currentImg.tiff)", cv::IMREAD_UNCHANGED);
    //    cv::Mat currentImgPyNormal;
    //    cv::normalize(currentImg_py, currentImgPyNormal, 0, 255, cv::NORM_MINMAX, CV_8U);
    //    bool isOk_c_p = cv::norm(currentImg_normalize_py, currentImgPyNormal, cv::NORM_L2) < tolerance;
    //    // 是否和c++代码相等
    //    bool isOk_c_c = cv::norm(currentImg, currentImgPyNormal, cv::NORM_L2) < tolerance;
    //    // 和其他机器c++处理的结果
    //    cv::Mat baseImg_normalize_other_c = cv::imread(R"(D:\ZhiWen\SinosunCode\TempImg\currentImgPyNormal.tiff)", cv::IMREAD_UNCHANGED);
    //    bool isOk_c_other_c = cv::norm(baseImg_normalize_other_c, currentImgPyNormal, cv::NORM_L2) < tolerance;
    //}

    // TODO: 用python归一化的图片进行测试
    //currentImg = cv::imread(R"(D:\ZhiWen\SinosunCode\TempImg\currentImg_normalize.tiff)", cv::IMREAD_UNCHANGED);
    //baseImg = cv::imread(R"(D:\ZhiWen\SinosunCode\TempImg\baseImg_normalize.tiff)", cv::IMREAD_UNCHANGED);

    cv::Ptr<cv::ORB> orb = cv::ORB::create(1000, 1.2f, 10);
    std::vector<cv::KeyPoint> kp1, kp2;
    cv::Mat des1, des2;
    orb->detectAndCompute(currentImg, cv::noArray(), kp1, des1);
    orb->detectAndCompute(baseImg, cv::noArray(), kp2, des2);

    // 使用暴力匹配算法进行特征点匹配
    cv::BFMatcher bf(cv::NORM_HAMMING, true);
    std::vector<cv::DMatch> matches;
    bf.match(des1, des2, matches);

    // 提取好的匹配对的关键点
    std::vector<cv::Point2f> src_pts, dst_pts;
    for (const cv::DMatch& match : matches) {
        src_pts.push_back(kp1[match.queryIdx].pt);
        dst_pts.push_back(kp2[match.trainIdx].pt);
    }

    // 估计单应性矩阵
    cv::Mat M = cv::findHomography(src_pts, dst_pts, cv::RANSAC);

    // 将当前图像配准到基准图像
    cv::Mat aligned_image;

    cv::warpPerspective(m_originImage, aligned_image, M, baseImg.size());

    warpImage = aligned_image;
}
