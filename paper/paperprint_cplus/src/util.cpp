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

// ����ֽ��ͼ�������ļ�·����Ĭ�Ϸ���(float32 �ĻҶ�ͼ), gray ���Դ�false����ԭʼbgr��֧�� .tiff .dng�ļ�
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

// ��ȡtiffͼƬ(float32 �ĻҶ�ͼ)
cv::Mat util::readTiff(std::string filename, bool gray)
{
    cv::Mat image = cv::imread(filename, cv::IMREAD_UNCHANGED);

    // �Ƿ�Ҫ���²���
    if (0 != ConfigManager::getInstance()->getConfig(SINO_PAPERPRINT_IMAGE_DOWNSAMPLING, 0))
    {
        image = resizeDownsampling(image, (bool)ConfigManager::getInstance()->getConfig(SINO_PAPERPRINT_IMAGE_DOWNSAMPLING_TOGRAY, 0), ConfigManager::getInstance()->getConfig(SINO_PAPERPRINT_IMAGE_DOWNSAMPLING_NUM, 1));
    }

    // ת�Ҷ�ͼ, len(image.shape) == 3 ����rgbͼ��len(image.shape) == 2�Ļ��Ѿ��ǻҶ�ͼ������ת
    if (gray && 3 == image.channels())
    {
        cv::cvtColor(image, image, cv::COLOR_BGR2GRAY);
    }

    // Ĭ��tiff��dng��ȡʱuint16��ת����float32��ʽ
    // ת����float32�������ڼ���
    if (Params::IMAGE_FLOAT32)
    {
        //image = np.float32(image)
        image.convertTo(image, CV_32F);
    }

    return image;
}
   

// 16λͼת8λ
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

    //printf("���ģʽ��%s, ���̣�%s.\n", P1.model, P1.make);
    //printf("ISO�й�ȣ�%f, ���ţ�%f, ��Ȧ��%f, ���ࣺ%f.\n", P2.iso_speed, P2.shutter, P2.aperture, P2.focal_len);

    if (strncmp(P1.cdesc, "RGBG", 4) != 0)
    {
        printf("�����֧��RGBG֮��ĸ�ʽ������GMCY�������˳�\n");
        return image;
    }

    //����������ж���
    char cdesc[5] = { 0 };
    cdesc[0] = P1.cdesc[raw_processor.fcol(0, 0)];
    cdesc[1] = P1.cdesc[raw_processor.fcol(0, 1)];
    cdesc[2] = P1.cdesc[raw_processor.fcol(1, 0)];
    cdesc[3] = P1.cdesc[raw_processor.fcol(1, 1)];


    // ���Rawͼ������,�������Է��ʺʹ����������������
    if ((ret = raw_processor.unpack()) != LIBRAW_SUCCESS)
    {
        fprintf(stderr, "Cannot unpack %s: %s\n", filename.c_str(), libraw_strerror(ret));
        return image;
    }

    // ת��Rawͼ������Ϊͼ������ unsigned short* image_data = rawProcessor.imgdata.image;
    raw_processor.raw2image();
    raw_processor.subtract_black();

    //printf("�������Ϊ��0�е�ǰ100�����ص��ֵ\n");
    //16λ��ɫ���Ϊ65535
    int first_visible_pixel = raw_processor.imgdata.sizes.raw_width * raw_processor.imgdata.sizes.top_margin + raw_processor.imgdata.sizes.left_margin;


    cv::Mat rawData;
    // dngͼ��Ŀ�Ⱥ͸߶�
    rawData = cv::Mat(raw_processor.imgdata.sizes.raw_height, raw_processor.imgdata.sizes.raw_width, CV_32FC1, cv::Scalar(0));
    for (int i = 0; i < raw_processor.imgdata.sizes.raw_height * raw_processor.imgdata.sizes.raw_width; i++)
    {
        rawData.ptr<float>(i / (raw_processor.imgdata.sizes.raw_width))[i % (raw_processor.imgdata.sizes.raw_width)] = raw_processor.imgdata.rawdata.raw_image[i];
        //�ݶ���ֵֻ֧��CV_8U �� CV_16U
        //rawData.ptr<ushort>(i / (raw_processor.imgdata.sizes.raw_width))[i % (raw_processor.imgdata.sizes.raw_width)] = raw_processor.imgdata.rawdata.raw_image[i];

    }
    
    printf("��ǰ����ʹ��4��1�����²���ģʽ\n");
    //dngAttr.format = DNG_FLOAT;

    //4��1��ֵ
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
        //��ͨ��Ĭ�Ͼ��ǻҶ�
        if (1 != channels)
        {
            cv::cvtColor(image, image, cv::COLOR_RGB2GRAY);
        }
    }

    raw_processor.recycle(); // �رյ�ǰ��ͼ���ļ����ͷ��ڴ沢���������صı�����״̬

    // �Ƿ�Ҫ���²���
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
    // ���ͼ���Ƿ�ɹ���ȡ
    if (src.empty()) {
        std::cerr << "downsampling unable to read the input image!" << std::endl;
        return cv::Mat();
    }

    if (resizeNum <= 0)
    {
        std::cerr << "resize num less than zero" << std::endl;
        return cv::Mat();
    }

    // ��ȡͼ��ĸ߶ȺͿ��
    int h = src.rows;
    int w = src.cols;

    // ��Сͼ��
    cv::Mat resized_image;
    cv::resize(src, resized_image, cv::Size(w / resizeNum, h / resizeNum));

    // ת��Ϊ�Ҷ�ͼ�������Ҫ�� - ֻ�е�ͼ��Ϊ��ɫͼ��ʱ��ת��
    if (gray && resized_image.channels() == 3) {
        cv::cvtColor(resized_image, resized_image, cv::COLOR_BGR2GRAY);
    }

    return resized_image;
}