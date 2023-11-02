#ifndef _SINOPAPERPRINT_H_
#define _SINOPAPERPRINT_H_
#include "Constants.h"

#ifndef _WIN32
#ifdef __cplusplus
extern "C"
{

#endif
#endif

#ifdef _WIN32
#define DLL_API __declspec(dllexport)
#define SINOPAPERPRINT_C_CALL __cdecl
#else /* Other Platforms */
#define  DLL_API
#endif // _WIN32


// @brief 
// @param regImagePath 注册图路径
// @param verifiImgPath 核验图路径
// @param stParam 参数
// @param pResult 结果
// @param verifiJ1FilePath J1图路径
// @return 
DLL_API int SINOPAPERPRINT_C_CALL compare(const char* regImagePath, const char* verifiImgPath, PaperprintResult_t* pResult, const char* verifiJ1FilePath = "");

// @brief 
// @param imagePath 输入参数：图片路径
// @param points 输出参数：二维码定点信息
// @param text：输出参数：二维码内容
// @param textLen 输入参数：二维码内容的长度
// @return 0-成功 其他值-失败
DLL_API int SINOPAPERPRINT_C_CALL parseQrCodeImage(const char* imagePath, QrCodePoints_t* points, char* text, int textLen);

// @brief 设置参数
//@param paramsJson json格式的配置信息
// @return 
DLL_API int SINOPAPERPRINT_C_CALL setParams(const char* paramsJson);

#ifndef _WIN32
#ifdef __cplusplus
}
#endif
#endif



#endif //_SINOPAPERPRINT_H_


