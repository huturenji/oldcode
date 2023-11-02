#ifndef _SINOPAPERPRINT_H_
#define _SINOPAPERPRINT_H_

extern "C"
{

#ifdef _WIN32
#define DLL_API __declspec(dllexport)
#define SINOPAPERPRINT_C_CALL __cdecl
#else /* Other Platforms */
#define  DLL_API
#endif // _WIN32


	/// @brief 图片对比配置参数
	typedef struct PaperprintParam
	{
		bool imageDownsampling;       // 是否下采样
		bool imageDownsamplingToGray; // 是否转灰度图
		int  imageDownsamplingNum;    // 下采样倍数
		PaperprintParam() {
			imageDownsampling = false;
			imageDownsamplingToGray = false;
			imageDownsamplingNum = 1;
		}
	} PaperprintParam_t;

	/// @brief 图片对比的结果
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

	/// @brief 二维码识别的结果
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

	/// @brief 
	/// @param regImagePath 注册图路径
	/// @param verifiImgPath 核验图路径
	/// @param stParam 参数
	/// @param pResult 结果
	/// @param verifiJ1FilePath J1图路径
	/// @return 0-成功 其他值-失败
	DLL_API int SINOPAPERPRINT_C_CALL compare(const char* regImagePath, const char* verifiImgPath, PaperprintParam_t stParam, PaperprintResult_t* pResult, const char* verifiJ1FilePath = "");

	/// @brief 
	/// @param imagePath 输入参数：图片路径
	/// @param points 输出参数：二维码定点信息
	/// @param text：输出参数：二维码内容
	/// @param textLen 输入参数：二维码内容的长度
	/// @return 0-成功 其他值-失败
	DLL_API int SINOPAPERPRINT_C_CALL parseQrCodeImage(const char* imagePath, QrCodePoints_t* points, char* text, int textLen);

}

#endif //_SINOPAPERPRINT_H_


