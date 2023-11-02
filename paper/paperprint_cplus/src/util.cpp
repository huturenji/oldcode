#include "util.h"
#include "Params.h"
#include "Tools.h"
#include "SinoPaperprintErrCode.h"
#include "libraw.h"
#include "ConfigManager.h"
#include "ConstantDefs.h"
#include <exiv2/exiv2.hpp>

#define OUT raw_processor.imgdata.params
#define OUTR raw_processor.imgdata.rawparams

#define P1 raw_processor.imgdata.idata
#define S raw_processor.imgdata.sizes
#define COLOR raw_processor.imgdata.color
#define T raw_processor.imgdata.thumbnail
#define P2 raw_processor.imgdata.other

// 加载纸纹图，传入文件路径，默认返回(float32 的灰度图), gray 可以传false返回原始bgr，支持 .tiff .dng文件
cv::Mat util::loadPaperImage(std::string fileName, bool gray)
{
    cv::Mat image;
    std::string fileExtension = Tools::fileExtension(fileName);
    if ("DNG" == fileExtension || "dng" == fileExtension)
    {
        image = readDNGImage(fileName, gray);
    }
    else
    {
        image = readTiff(fileName, gray);
    }
    return image;
}

// 读取tiff图片(float32 的灰度图)
cv::Mat util::readTiff(std::string filename, bool gray)
{
    cv::Mat image = cv::imread(filename, cv::IMREAD_UNCHANGED);

    // 是否要做下采样
    if (0 != ConfigManager::getInstance()->getConfig(SINO_PAPERPRINT_IMAGE_DOWNSAMPLING, 0))
    {
        image = resizeDownsampling(image, (bool)ConfigManager::getInstance()->getConfig(SINO_PAPERPRINT_IMAGE_DOWNSAMPLING_TOGRAY, 0), ConfigManager::getInstance()->getConfig(SINO_PAPERPRINT_IMAGE_DOWNSAMPLING_NUM, 1));
    }

    // 转灰度图, len(image.shape) == 3 才是rgb图，len(image.shape) == 2的话已经是灰度图不用再转
    if (gray && 3 == image.channels())
    {
        cv::cvtColor(image, image, cv::COLOR_BGR2GRAY);
    }

    // 默认tiff、dng读取时uint16，转换成float32格式
    // 转换成float32类型用于计算
    if (Params::IMAGE_FLOAT32)
    {
        //image = np.float32(image)
        image.convertTo(image, CV_32F);
    }

    return image;
}
   

// 16位图转8位
void util::img2U8(cv::Mat& srcImage)
{
    normalize(srcImage, srcImage, 0, 255, cv::NORM_MINMAX, CV_8UC1);
}

cv::Mat util::readDNGImage(const std::string filename, bool gray)
{
    cv::Mat image;

    if (!Tools::fileExist(filename))
    {
        return image;
    }

    LibRaw raw_processor;
    int ret = raw_processor.open_file(filename.c_str());
    if (ret != LIBRAW_SUCCESS)
    {
        //fprintf(stderr, "Cannot open %s: %s\n", filename.c_str(), libraw_strerror(ret));
        return image;
    }

    //printf("相机模式：%s, 厂商：%s.\n", P1.model, P1.make);
    //printf("ISO感光度：%f, 快门：%f, 光圈：%f, 焦距：%f.\n", P2.iso_speed, P2.shutter, P2.aperture, P2.focal_len);

    if (strncmp(P1.cdesc, "RGBG", 4) != 0)
    {
        printf("相机不支持RGBG之外的格式，比如GMCY，程序退出\n");
        return image;
    }

    //给后面程序判断用
    char cdesc[5] = { 0 };
    cdesc[0] = P1.cdesc[raw_processor.fcol(0, 0)];
    cdesc[1] = P1.cdesc[raw_processor.fcol(0, 1)];
    cdesc[2] = P1.cdesc[raw_processor.fcol(1, 0)];
    cdesc[3] = P1.cdesc[raw_processor.fcol(1, 1)];


    // 解包Raw图像数据,解包后可以访问和处理解包后的像素数据
    if ((ret = raw_processor.unpack()) != LIBRAW_SUCCESS)
    {
        fprintf(stderr, "Cannot unpack %s: %s\n", filename.c_str(), libraw_strerror(ret));
        return image;
    }

    // 转换Raw图像数据为图像数据 unsigned short* image_data = rawProcessor.imgdata.image;
    raw_processor.raw2image();
    raw_processor.subtract_black();

    //printf("以下输出为第0行的前100个像素点的值\n");
    //16位颜色最大为65535
    int first_visible_pixel = raw_processor.imgdata.sizes.raw_width * raw_processor.imgdata.sizes.top_margin + raw_processor.imgdata.sizes.left_margin;


    cv::Mat rawData;
    // dng图像的宽度和高度
    rawData = cv::Mat(raw_processor.imgdata.sizes.raw_height, raw_processor.imgdata.sizes.raw_width, CV_32FC1, cv::Scalar(0));
    for (int i = 0; i < raw_processor.imgdata.sizes.raw_height * raw_processor.imgdata.sizes.raw_width; i++)
    {
        rawData.ptr<float>(i / (raw_processor.imgdata.sizes.raw_width))[i % (raw_processor.imgdata.sizes.raw_width)] = raw_processor.imgdata.rawdata.raw_image[i];
        //拜耳插值只支持CV_8U 和 CV_16U
        //rawData.ptr<ushort>(i / (raw_processor.imgdata.sizes.raw_width))[i % (raw_processor.imgdata.sizes.raw_width)] = raw_processor.imgdata.rawdata.raw_image[i];

    }
    
    printf("当前正在使用4合1像素下采样模式\n");
    //dngAttr.format = DNG_FLOAT;

    //4合1插值
    image = cv::Mat(raw_processor.imgdata.sizes.raw_height / 2, raw_processor.imgdata.sizes.raw_width / 2, CV_32FC3);
    for (int row = 0; row < raw_processor.imgdata.sizes.iheight; row += 2)
    {
        for (int col = 0; col < raw_processor.imgdata.sizes.iwidth; col += 2)
        {
            float x0y0 = rawData.ptr<float>(row)[col];
            float x0y1 = rawData.ptr<float>(row)[col + 1];
            float x1y0 = rawData.ptr<float>(row + 1)[col];
            float x1y1 = rawData.ptr<float>(row + 1)[col + 1];

            if (strncmp(cdesc, "GBRG", 4) == 0)
            {
                image.at<cv::Vec3f>(row / 2, col / 2)[0] = x0y1;
                image.at<cv::Vec3f>(row / 2, col / 2)[1] = (x0y0 + x1y1) / 2;
                image.at<cv::Vec3f>(row / 2, col / 2)[2] = x1y0;
            }
            else if (strncmp(cdesc, "RGGB", 4) == 0)
            {
                image.at<cv::Vec3f>(row / 2, col / 2)[0] = x1y1;
                image.at<cv::Vec3f>(row / 2, col / 2)[1] = (x0y1 + x1y0) / 2;
                image.at<cv::Vec3f>(row / 2, col / 2)[2] = x0y0;
            }
            else if (strncmp(cdesc, "GRBG", 4) == 0)
            {
                image.at<cv::Vec3f>(row / 2, col / 2)[0] = x1y0;
                image.at<cv::Vec3f>(row / 2, col / 2)[1] = (x0y0 + x1y1) / 2;
                image.at<cv::Vec3f>(row / 2, col / 2)[2] = x0y1;
            }
            else if (strncmp(cdesc, "BGGR", 4) == 0)
            {
                image.at<cv::Vec3f>(row / 2, col / 2)[0] = x0y0;
                image.at<cv::Vec3f>(row / 2, col / 2)[1] = (x0y1 + x1y0) / 2;
                image.at<cv::Vec3f>(row / 2, col / 2)[2] = x1y1;
            }

        }
    }

    if (gray)
    {
        int channels = image.channels();
        //单通道默认就是灰度
        if (1 != channels)
        {
            cv::cvtColor(image, image, cv::COLOR_RGB2GRAY);
        }
    }

    raw_processor.recycle(); // 关闭当前的图像文件，释放内存并清除所有相关的变量和状态

    // 是否要做下采样
    if (0 != ConfigManager::getInstance()->getConfig(SINO_PAPERPRINT_IMAGE_DOWNSAMPLING, 0))
    {
        image = resizeDownsampling(image, (bool)ConfigManager::getInstance()->getConfig(SINO_PAPERPRINT_IMAGE_DOWNSAMPLING_TOGRAY, 0), ConfigManager::getInstance()->getConfig(SINO_PAPERPRINT_IMAGE_DOWNSAMPLING_NUM, 1));
    }

    return image;
}

float util::getExifInfo(const std::string& filename, const std::string& tag)
{
    float value = 1.0;
    if (!Tools::fileExist(filename))
    {
        return value;
    }
    try {
        auto image = Exiv2::ImageFactory::open(filename);
        if (!image)
        {
            return value;
        }

        image->readMetadata();
        Exiv2::ExifData& exifData = image->exifData();
        if (exifData.empty()) {
            std::string error("No Exif data found in file");
            return PAPER_PRINT_FILE_PRAS_FAIL;
        }

        Exiv2::ExifKey tmp = Exiv2::ExifKey(tag);			
        Exiv2::ExifData::iterator pos = exifData.findKey(tmp);
        if (pos == exifData.end())
        {
            return value;
        }
        value =  pos->value().toFloat();

    }
    catch (Exiv2::Error& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        
    }
    //std::cout << "value: " << value << std::endl;
    return value;

}

cv::Mat util::resizeDownsampling(const cv::Mat& src, bool gray = true, int resizeNum = 2)
{
    // 检查图像是否成功读取
    if (src.empty()) {
        std::cerr << "downsampling unable to read the input image!" << std::endl;
        return cv::Mat();
    }

    if (resizeNum <= 0)
    {
        std::cerr << "resize num less than zero" << std::endl;
        return cv::Mat();
    }

    // 获取图像的高度和宽度
    int h = src.rows;
    int w = src.cols;

    // 缩小图像
    cv::Mat resized_image;
    cv::resize(src, resized_image, cv::Size(w / resizeNum, h / resizeNum));

    // 转换为灰度图像（如果需要） - 只有当图像为彩色图像时才转换
    if (gray && resized_image.channels() == 3) {
        cv::cvtColor(resized_image, resized_image, cv::COLOR_BGR2GRAY);
    }

    return resized_image;
}