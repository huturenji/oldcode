
#ifndef __CONSTANTS__
#define __CONSTANTS__


typedef void(*P_VOID_CALLBACK_PCHAR_3INT)(char*, int, int, int);



// @brief 图片对比的结果
typedef struct
{
	double result_1_1;
	double result_2_2;
	double result_3_3;
	double result_4_4;

	double result_1_2;
	double result_1_3;
	double result_1_4;

	double result_2_1;
	double result_2_3;
	double result_2_4;

	double result_3_1;
	double result_3_2;
	double result_3_4;

	double result_4_1;
	double result_4_2;
	double result_4_3;

} PaperprintResult_t;

typedef struct
{
	int left_bottom_x;
	int left_bottom_y;

	int left_top_x;
	int left_top_y;

	int right_top_x;
	int right_top_y;

	int right_bottom_x;
	int right_bottom_y;
} QrCodePoints_t;

//图片结构体
typedef struct 
{
	//图像特征数据流指针
	unsigned char* data;
	//特征数据流字节长度
	unsigned int dataLength;
	//图像宽
	int width;
	//图像高
	int height;
	//图像类型 （0:jpeg, 1:bmp, 2:png, 3:tiff.）
	int dataType;
}IMG_DATA_INFO;

#define CAM_RESOLUTION "resolution" //分辨率
#define CAM_EXPOSURE "exposure"   //曝光
#define CAM_EXPOSURE_AUTO "exposure_auto" //自动曝光
#define CAM_WHITEBALANCE "whitebalance" //白平衡
#define CAM_WHITEBALANCE_AUTO "whitebalance_auto" //自动白平衡

#define DEV_TYPE_AH100 1
#define DEV_TYPE_AR800 2

#define CMD_BUF_LEN 1024

#define ERR_DEV_NOT_OPEN 0x2001
#define ERR_DEV_NO_LIGHT 0x2002

#endif
