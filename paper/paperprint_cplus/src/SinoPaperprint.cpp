#include <iostream>
#include <Poco/File.h>
#include <Poco/Path.h>
#include <opencv2/opencv.hpp>
#include <stdio.h>

#include "SinoPaperprint.h"
#include "ImageCompare.h"
#include "Params.h"
#include "SinoPaperprintErrCode.h"
#include "Tools.h"
#include "ConfigManager.h"
#include "ConstantDefs.h"
#include "QRCodeParser.h"
void initConfig(PaperprintParam_t stParam)
{
    ConfigManager::getInstance()->setConfig(SINO_PAPERPRINT_IMAGE_DOWNSAMPLING, stParam.imageDownsampling);
    ConfigManager::getInstance()->setConfig(SINO_PAPERPRINT_IMAGE_DOWNSAMPLING_TOGRAY, stParam.imageDownsamplingToGray);
    ConfigManager::getInstance()->setConfig(SINO_PAPERPRINT_IMAGE_DOWNSAMPLING_NUM, stParam.imageDownsamplingNum);
}

/// @brief 
/// @param dngFullPath 
/// @param outFile 
/// @return 
int compare(const char* regImagePath, const char* verifiImgPath, PaperprintParam_t stParam, PaperprintResult_t* pResult, const char* verifiJ1FilePath)
{
    if (!Tools::fileExist(regImagePath) || !Tools::fileExist(verifiImgPath))
    {
        return PAPER_PRINT_FILE_NOT_EXIST;
    }

    // 修改参数配置项
    initConfig(stParam);

    ImageCompare imCompare(regImagePath, verifiImgPath);

    if (imCompare.isParseQRCodeException())
    {
        // 二维码识别错误
        return PAPER_PRINT_QRCODE_ERROR;
    }

    // 如果有J1参与，同时计算差图
    if (0 != strlen(verifiJ1FilePath))
    {
        if (!Tools::fileExist(verifiJ1FilePath))
        {
            return PAPER_PRINT_FILE_NOT_EXIST;
        }
        imCompare.useDertImage(verifiJ1FilePath);
    }

    imCompare.compare(Params::QRCODE_WIDTH);

    if (NULL != pResult)
    {
        std::vector<double> trueResults = imCompare.getTrueResults();
        if (3 < trueResults.size())
        {
            pResult->result_1_1 = trueResults[0];
            pResult->result_2_2 = trueResults[1];
            pResult->result_3_3 = trueResults[2];
            pResult->result_4_4 = trueResults[3];

            
        }
        std::vector<double> falseResults = imCompare.getFalseResults();
        if (11 < falseResults.size())
        {
            pResult->result_1_2 = falseResults[0];
            pResult->result_1_3 = falseResults[1];
            pResult->result_1_4 = falseResults[2];
                                
            pResult->result_2_1 = falseResults[3];
            pResult->result_2_3 = falseResults[4];
            pResult->result_2_4 = falseResults[5];
                                
            pResult->result_3_1 = falseResults[6];
            pResult->result_3_2 = falseResults[7];
            pResult->result_3_4 = falseResults[8];
                                
            pResult->result_4_1 = falseResults[9];
            pResult->result_4_2 = falseResults[10];
            pResult->result_4_3 = falseResults[11];
        }
    }
    
    return 0;
}

int parseQrCodeImage(const char* imagePath, QrCodePoints_t* points, char* text, int textLen)
{
    if (!Tools::fileExist(imagePath))
    {
        return PAPER_PRINT_FILE_NOT_EXIST;
    }

    QRCodeParser qrParser;
    bool parseStatus = qrParser.parseQrCodeImage(imagePath);
    if (!parseStatus)
    {
        // 二维码没识别出来，标记失败状态
        return PAPER_PRINT_QRCODE_ERROR;
    }

    if (NULL != points)
    {
        std::vector<cv::Point> qrPoints = qrParser.getPoints();
        points->left_bottom_x = qrPoints.at(0).x;
        points->left_bottom_y = qrPoints.at(0).y;

        points->left_top_x = qrPoints.at(1).x;;
        points->left_top_y = qrPoints.at(1).y;;
        
        points->right_top_x = qrPoints.at(2).x;;
        points->right_top_y = qrPoints.at(2).y;;

        points->right_bottom_x = qrPoints.at(3).x;;
        points->right_bottom_y = qrPoints.at(3).y;;
    }

    if (NULL != text && 0 < textLen)
    {
        std::string qrText = qrParser.getText();
        strncpy(text, qrText.c_str(), textLen);
    }
    
    return PAPER_PRINT_OK;
}
