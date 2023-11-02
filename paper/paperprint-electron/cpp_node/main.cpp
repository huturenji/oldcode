#include <tchar.h>
#include <iostream>
#include <fstream>
#include <napi.h>
#include <windows.h>
#include <windowsx.h>
#include "Constants.h"
#include "AH100SDK.h"
#include "DLLFunction.h"
#include <list>
#include <map>
using namespace std;
#include <DShow.h>
#pragma comment(lib, "Strmiids.lib")
#include "SinoPaperprint.h"

#define MAX_DEVICE_PATH_LENGTH		255
#define RERVISION_CAMERA_INDEX "VID_32E4&PID_1298"
#define MAX_QRCODE_LENGTH 4096

HWND hwnd;
HWND child_hwnd;
bool shouldExit = false;
int camera_index = 	0;
int result_preview = -1;

P_INT__FUN__VOID Dll_OpenDevice;
P_INT__FUN__VOID Dll_CloseDevice;
P_INT__FUN__INT Dll_OpenCamera;
P_INT__FUN__INT Dll_CloseCamera;
P_INT__FUN__AINT_INT Dll_TurnOffLight;
P_INT__FUN__2AINT_INT Dll_TurnOnLight;
P_INT__FUN__INT_PCHAR_AINT_PINT Dll_GetCameraParameter;
P_INT__FUN__INT_PCHAR_AINT_INT Dll_SetCameraParameter;
P_INT__FUN__INT_CB Dll_TakePicAsyn;
P_INT__FUN__INT_PCHAR_3PINT Dll_TakePicSyn;
P_INT__FUN__INT__HWND Dll_SetPreviewHwnd;
P_INT__FUN__INT Dll_StartPreview;
P_INT__FUN__INT Dll_StopPreview;
P_INT__FUN__INT_STRUCT DLL_CompareImg;
P_INT__FUN__PCHAR_STRUCT DLL_ParseQrCodeImg;
P_INT__FUN__PCCHAR DLL_SetCompareParam;
P_INT__FUN__STRUCT_STRUCT_CB DLL_VerifyImg;
P_INT__FUN_STRUCT_FLOAT DLL_GetForeGroundAreaRatio;

#include<stdio.h>
#include<stdarg.h>
#include<string.h>
#include<fcntl.h>
#include<ctime>
#include <chrono>


class FileWriter {
public:
    FileWriter(const std::string& filename) : filename_(filename) {
        outfile_.open(filename_, std::ios::app);
        if (!outfile_.is_open()) {
            std::cerr << "无法打开文件: " << filename_ << std::endl;
        }
    }

    ~FileWriter() {
        if (outfile_.is_open()) {
            outfile_.close();
        }
    }

    void Write(const std::string& data) {
        if (outfile_.is_open()) {
            outfile_ << data << std::endl;
        }
    }

	bool is_open(){
		return outfile_.is_open();
	}

private:
    std::string filename_;
    std::ofstream outfile_;
};

/*获取格式化时间
*/
string GetFormattedCurrentDate(const char* format){
	// 获取当前时间
	std::time_t now = std::time(nullptr);
	struct tm* timeInfo = std::localtime(&now);
	//格式化时间
	char timeString[64];
    std::strftime(timeString, sizeof(timeString), format, timeInfo);
	return timeString;
}

/**
 * 打印日志
*/
void Log_Printf(const char* msg){
	std::string currentDate = GetFormattedCurrentDate("%Y-%m-%d");
	std::string fileName = "logs/cpp_node_"+currentDate+".log";
	FileWriter writer(fileName);
	if(writer.is_open()){
		std::string timeString = GetFormattedCurrentDate("%Y-%m-%d %H:%M:%S");
		writer.Write("[" +timeString + "] " + msg);
	}
}
/**
 * 获取摄像头索引值
*/
int getCameraIndex(const char* hwid)
{
	bool done = false;
	int deviceCounter = 0;
	int cameraIndex = -1;

	// Initialize COM
	HRESULT hr = NULL;
	hr = CoInitialize(NULL);
	// always true when python is called
	//if (FAILED(hr))
	//{
	//	return cameraID;
	//}

	// Create the System Device Enumerator.
	ICreateDevEnum* pSysDevEnum = NULL;
	hr = CoCreateInstance(CLSID_SystemDeviceEnum, NULL, CLSCTX_INPROC_SERVER, IID_ICreateDevEnum, reinterpret_cast<void**>(&pSysDevEnum));
	if (FAILED(hr))
	{
		CoUninitialize();
		return cameraIndex;
	}
	// Obtain a class enumerator for the video input category.
	IEnumMoniker* pEnumCat = NULL;
	hr = pSysDevEnum->CreateClassEnumerator(CLSID_VideoInputDeviceCategory, &pEnumCat, 0);
	if (hr == S_OK)
	{
		// Enumerate the monikers.
		IMoniker* pMoniker = NULL;
		ULONG cFetched;
		while ((!done) && (pEnumCat->Next(1, &pMoniker, &cFetched) == S_OK))
		{
			// Bind the first moniker to an object
			IPropertyBag* pPropBag;
			hr = pMoniker->BindToStorage(0, 0, IID_IPropertyBag, (void**)&pPropBag);
			if (SUCCEEDED(hr))
			{
				// To retrieve the filter's DevicePath, do the following:
				VARIANT varName;
				varName.vt = VT_BSTR;
				VariantInit(&varName);

				hr = pPropBag->Read(L"DevicePath", &varName, 0);
				if (SUCCEEDED(hr))
				{
					// convert DevicePath to char*
					char devicePath[MAX_DEVICE_PATH_LENGTH] = { 0 };
					int count = 0;
					while (varName.bstrVal[count] != 0x00)
					{
						devicePath[count] = varName.bstrVal[count];
						count++;
					}
					std::string devicePathString = devicePath; // lower string

					// to lower
					std::string hwidString = hwid;
					std::transform(hwidString.begin(), hwidString.end(), hwidString.begin(), ::tolower);

					// match
					int matched = devicePathString.find(hwidString);
					if (matched >= 0)
					{
						cameraIndex = deviceCounter;
						done = true;
					}
				}

				deviceCounter++;

				VariantClear(&varName);
				pPropBag->Release();
				pPropBag = NULL;
			}
			pMoniker->Release();
			pMoniker = NULL;
		}
		pEnumCat->Release();
		pEnumCat = NULL;
	}
	pSysDevEnum->Release();
	pSysDevEnum = NULL;
	CoUninitialize();

	return cameraIndex;
}
/**
 * 加载图像对比dll
*/
int loadCompareDll(){
	HINSTANCE m_hinstLib = LoadLibraryEx(_T("dll\\SinoPaperprint.dll"), NULL, LOAD_WITH_ALTERED_SEARCH_PATH);
	if (NULL == m_hinstLib)
	{	 
		int dwError = GetLastError();
		return dwError;
		// return -1;
	}
	DLL_CompareImg = (P_INT__FUN__INT_STRUCT)GetProcAddress(m_hinstLib,"compare");
	if (NULL == DLL_CompareImg)
	{
		int dwError = GetLastError();
		return dwError;
	}

	DLL_ParseQrCodeImg = (P_INT__FUN__PCHAR_STRUCT)GetProcAddress(m_hinstLib,"parseQrCodeImage");
	if (NULL == DLL_ParseQrCodeImg)
	{
		int dwError = GetLastError();
		return dwError;
	}
	DLL_SetCompareParam = (P_INT__FUN__PCCHAR)GetProcAddress(m_hinstLib,"setParams");
	if (NULL == DLL_ParseQrCodeImg)
	{
		int dwError = GetLastError();
		return dwError;
	}
	// FreeLibrary(m_hinstLib); 不能free，free后会导致空指针异常
	return 0;
}
/**
 * 加载摄像头dll
*/
int LoadCameraDll()
{
	HINSTANCE m_hinstLib = LoadLibrary(_T("dll\\ImgCapture.dll"));
	if (NULL == m_hinstLib)
	{
		return -1;
	}

	Dll_OpenDevice = (P_INT__FUN__VOID)GetProcAddress(m_hinstLib, "OpenDevice");
	if (NULL == Dll_OpenDevice)
	{
		return -10;
	}

	Dll_CloseDevice = (P_INT__FUN__VOID)GetProcAddress(m_hinstLib, "CloseDevice");
	if (NULL == Dll_CloseDevice)
	{
		return -11;
	}

	Dll_OpenCamera = (P_INT__FUN__INT)GetProcAddress(m_hinstLib, "OpenCamera");
	if (NULL == Dll_OpenCamera)
	{
		return -12;
	}

	Dll_CloseCamera = (P_INT__FUN__INT)GetProcAddress(m_hinstLib, "CloseCamera");
	if (NULL == Dll_CloseCamera)
	{
		return -13;
	}

	Dll_TurnOffLight = (P_INT__FUN__AINT_INT)GetProcAddress(m_hinstLib, "TurnOffLight");
	if (NULL == Dll_TurnOffLight)
	{
		return -14;
	}

	Dll_TurnOnLight = (P_INT__FUN__2AINT_INT)GetProcAddress(m_hinstLib, "TurnOnLight");
	if (NULL == Dll_TurnOnLight)
	{
		return -15;
	}

	Dll_GetCameraParameter = (P_INT__FUN__INT_PCHAR_AINT_PINT)GetProcAddress(m_hinstLib, "GetCameraParameter");
	if (NULL == Dll_GetCameraParameter)
	{
		return -16;
	}

	Dll_SetCameraParameter = (P_INT__FUN__INT_PCHAR_AINT_INT)GetProcAddress(m_hinstLib, "SetCameraParameter");
	if (NULL == Dll_SetCameraParameter)
	{
		return -17;
	}

	Dll_TakePicAsyn = (P_INT__FUN__INT_CB)GetProcAddress(m_hinstLib, "TakePicAsyn");
	if (NULL == Dll_TakePicAsyn)
	{
		return -18;
	}

	Dll_TakePicSyn = (P_INT__FUN__INT_PCHAR_3PINT)GetProcAddress(m_hinstLib, "TakePicSyn");
	if (NULL == Dll_TakePicSyn)
	{
		return -19;
	}

	Dll_SetPreviewHwnd = (P_INT__FUN__INT__HWND)GetProcAddress(m_hinstLib, "SetPreviewHwnd");
	if (NULL == Dll_SetPreviewHwnd)
	{
		return -110;
	}

	Dll_StartPreview = (P_INT__FUN__INT)GetProcAddress(m_hinstLib, "StartPreview");
	if (NULL == Dll_StartPreview)
	{
		return -111;
	}

	Dll_StopPreview = (P_INT__FUN__INT)GetProcAddress(m_hinstLib, "StopPreview");
	if (NULL == Dll_StopPreview)
	{
		return -112;
	}
	DLL_VerifyImg = (P_INT__FUN__STRUCT_STRUCT_CB)GetProcAddress(m_hinstLib, "Verify");
	if (NULL == DLL_VerifyImg)
	{
		return -113;
	}
	DLL_GetForeGroundAreaRatio = (P_INT__FUN_STRUCT_FLOAT)GetProcAddress(m_hinstLib, "GetForeGroundAreaRatio");
	if(NULL == DLL_GetForeGroundAreaRatio){
		return -114;
	}
	return 0;
}

/**
 * 加载程序依赖的dll
*/
Napi::Value LoadDLL(const Napi::CallbackInfo &info){
	Napi::Env env = info.Env();
	Log_Printf("load ImgCapture start");
	int ret = LoadCameraDll();//加载摄像头dll
	std::string loadCameraDll_result_log = "load ImgCapture result is : " + std::to_string(ret);
	Log_Printf(loadCameraDll_result_log.c_str());
	Log_Printf("load ImgCapture end");

	Log_Printf("load SinoPaperprint start");
	int retcomparedll = loadCompareDll();//加载图片对比程序dll
	std::string loadCompareDll_result_log = "load SinoPaperprint result is : " + std::to_string(retcomparedll);
	Log_Printf(loadCompareDll_result_log.c_str());
	Log_Printf("load SinoPaperprint end");

	return Napi::Number::New(env,retcomparedll);
}

/**
 * 开灯
*/
int turnOnLight(int type, int lev){

	int ids[1], bright[1];
	ids[0] = type;
	bright[0] = lev;

	return Dll_TurnOnLight(ids, bright, 1);
}

/**
 * 摄像头窗口回调
*/
LRESULT CALLBACK wndProc(HWND hwnd, UINT msg, WPARAM wparam, LPARAM lparam) {
    switch (msg) {
        case WM_NCCALCSIZE: {
            return 0;
        }
		case WM_DESTROY:
			PostQuitMessage(0);
			return 0;
    }
    return DefWindowProcW(hwnd, msg, wparam, lparam);
}
// GDI 绘图颜色
#define DRAW_COLOR RGB(0, 0, 255)

// 窗口透明色
#define TRANSPARENT_COLOR RGB(0, 0, 0)
/**
 * 取景框窗口回调
*/
LRESULT CALLBACK ViewfinderProc(HWND hwnd, UINT msg, WPARAM wparam, LPARAM lparam){
	switch (msg){
		case WM_NCPAINT:{
         	HDC hdc = GetWindowDC(hwnd);
            RECT rect;
            GetWindowRect(hwnd, &rect);

            // 绘制四条绿色边框
            HPEN hPen = CreatePen(PS_SOLID, 1, RGB(0, 255, 0));
            SelectObject(hdc, hPen);
            Rectangle(hdc, 0, 0, rect.right - rect.left, rect.bottom - rect.top);
            DeleteObject(hPen);

            ReleaseDC(hwnd, hdc);
            return 0;
		}
 		case WM_NCCALCSIZE:
            // 去除边框区域，不处理
            return 0;
		case WM_ERASEBKGND:
            // 不擦除背景
            return 1;
	}
	return DefWindowProcW(hwnd, msg, wparam, lparam);
}

/**
 * 开始预览视频流
*/
int PreviewCamera(HWND hwnd){

	//打开设备之前先关闭设备
	Dll_CloseDevice();

	Log_Printf("Dll_SetPreviewHwnd start");

	//设置预览句柄
	Dll_SetPreviewHwnd(camera_index, hwnd);//先设置预览句柄 再打开设置和摄像头

	Log_Printf("Dll_SetPreviewHwnd successed!");


	Log_Printf("Dll_OpenDevice start");
	
	//打开设备
	int result_opendevice = Dll_OpenDevice();

	std::string result_opendevice_log = "Dll_OpenDevice result is : " + std::to_string(result_opendevice);
	Log_Printf(result_opendevice_log.c_str());

	std::cout << "result_opendevice1 is: " << result_opendevice << std::endl;
	Log_Printf("turnOnLight start");
	//开启灯光
	turnOnLight(0,80);


	Log_Printf("turnOnLight successed!");

	Log_Printf("Dll_StartPreview start");

	bool result_start_preview = Dll_StartPreview(camera_index);
	
	if(!result_start_preview){
		std::string result_start_preview_log = "Dll_StartPreview failed! result is : " + std::to_string(result_start_preview);
		Log_Printf(result_start_preview_log.c_str());
		Dll_CloseDevice();//打开失败后，需要关闭设备，避免再次打开报错
		return -1;
	}
	std::string result_start_preview_log = "Dll_StartPreview successed! result bool is : " + std::to_string(result_start_preview);
	Log_Printf(result_start_preview_log.c_str());

	std::string previewCamera_result_log = "PreviewCamera result is : " + std::to_string(result_opendevice);
	Log_Printf(previewCamera_result_log.c_str());

	return result_opendevice;
}


/**
 * 打开摄像头设备
*/
Napi::Value OpenCameraDevice(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();

	Dll_CloseDevice();
	//打开设备
	Log_Printf("OpenCameraDevice start");
	int result_opendevice = Dll_OpenDevice();
	std::string result_opendevice_result_log = "OpenCameraDevice result is : " + std::to_string(result_opendevice);
	Log_Printf(result_opendevice_result_log.c_str());
	Log_Printf("OpenCameraDevice end");

	return Napi::Number::New(env,result_opendevice);
}

/**
 * 程序主入口，创建摄像头窗口，并且设置electron主窗口为父窗口
*/
Napi::Value CreateChildWindow(const Napi::CallbackInfo &info)
{
 	Napi::Env env = info.Env();
	if(!info[1].IsArray()){//窗口位置参数
		Napi::TypeError::New(env, "Array expected").ThrowAsJavaScriptException();
        return env.Null();
	}

	if(!info[2].IsBoolean()){// 是否需要取景框
		Napi::TypeError::New(env, "Boolean expected").ThrowAsJavaScriptException();
        return env.Null();
	}
	

	
   
    Napi::Buffer<void *> wndHandle = info[0].As<Napi::Buffer<void *>>();
    HWND hwndParent = static_cast<HWND>(*reinterpret_cast<void **>(wndHandle.Data()));
    HWND hwndD3D = FindWindowEx(hwndParent, nullptr, "Intermediate D3D Window" , nullptr);
    //下面几行是关键代码，没这几行不行
    LONG_PTR style = GetWindowLongPtr(hwndD3D, GWL_STYLE);
    if ((style & WS_CLIPSIBLINGS) == 0) {
        style |= WS_CLIPSIBLINGS;
        SetWindowLongPtr(hwndD3D, GWL_STYLE, style);
    }
    style = GetWindowLongPtr(hwndParent, GWL_STYLE);
    if ((style & WS_CLIPCHILDREN) == 0) {
        style |= WS_CLIPCHILDREN;
        SetWindowLongPtr(hwndParent, GWL_STYLE, style);
    }
	//注册摄像头窗口
    WNDCLASSEXW wcx = {};
    wcx.cbSize = sizeof(wcx);
    wcx.style = CS_HREDRAW | CS_VREDRAW;
    wcx.hInstance = nullptr;
    wcx.lpfnWndProc = &wndProc;
    wcx.lpszClassName = L"CameraWindowClass";
    // wcx.hbrBackground = CreateSolidBrush(RGB(255, 255, 255));//不能设置背景色，设置背景色后会有窗口闪动的效果
    wcx.hCursor = LoadCursor(nullptr, IDC_ARROW);
    ATOM childClassId = RegisterClassExW(&wcx);
    if (!childClassId)
    {
        auto errCode = GetLastError();
    }
    auto borderlessStyle = WS_CHILD| WS_POPUP | WS_VISIBLE;//(WS_OVERLAPPEDWINDOW & ~WS_VISIBLE)


	
	int child_x = 240;
	int child_y = 81;
	int child_width = 640;
	int child_height = 480;
	Napi::Array pos_array = info[1].As<Napi::Array>();
	int pos[4];
	size_t length = pos_array.Length();
	for(size_t i=0;i<length;i++){
		Napi::Value ele = pos_array.Get(i);
		if(ele.IsNumber()){
			pos[i] = ele.As<Napi::Number>().Int32Value();
		}
	}
	child_x = pos[0];
	child_y = pos[1];
	child_width = pos[2];
	child_height = pos[3];

	//创建摄像头窗口
    hwnd = CreateWindowExW(0, wcx.lpszClassName, NULL, borderlessStyle, child_x, child_y, child_width, child_height, nullptr, nullptr, nullptr, nullptr);
    // if(hwnd != NULL){
        int dpi = GetDpiForWindow(hwnd);
        int x = MulDiv(child_x,dpi,USER_DEFAULT_SCREEN_DPI);
        int y = MulDiv(child_y,dpi,USER_DEFAULT_SCREEN_DPI);
        int width = MulDiv(child_width,dpi,USER_DEFAULT_SCREEN_DPI);
        int height = MulDiv(child_height,dpi,USER_DEFAULT_SCREEN_DPI);
        SetWindowPos(hwnd, HWND_BOTTOM, x, y, width, height, SWP_FRAMECHANGED);
    // }
	
 	result_preview = PreviewCamera(hwnd);

	if(result_preview!=0){//只有返回45060或者0才表示打开设备成功
		if(hwnd != NULL){
			PostMessage(hwnd,WM_CLOSE,0,0);
		}
		return Napi::Number::New(env,result_preview);
	}

	//设置父窗口
    SetParent(hwnd, hwndParent);


	boolean needViewWindow = info[2].As<Napi::Boolean>();
	if(needViewWindow){
		//注册取景框窗口
		WNDCLASSEXW wcViewfinder = {};
		wcViewfinder.cbSize = sizeof(wcViewfinder);
		wcViewfinder.lpfnWndProc = &ViewfinderProc;
		wcViewfinder.hInstance = nullptr;
		wcViewfinder.hCursor = LoadCursor(nullptr,IDC_ARROW);
		wcViewfinder.hbrBackground = NULL;
		wcViewfinder.lpszClassName = L"ViewfinderWindowClass";
		RegisterClassExW(&wcViewfinder);

		//创建取景框窗口
		child_hwnd = CreateWindowExW(
			WS_EX_LAYERED | WS_EX_TRANSPARENT | WS_EX_TOPMOST,L"ViewfinderWindowClass",L"this is a child window 1",
			WS_CHILD | WS_VISIBLE,
			width/2-100, height/2-100, 200, 200,
			hwnd,NULL,NULL,NULL
		);

		// 设置子窗口透明度
		// SetLayeredWindowAttributes(hwndChild, 0, 10, LWA_ALPHA );
		SetLayeredWindowAttributes(child_hwnd, RGB(255, 255, 255), 0, LWA_COLORKEY);//将白色设置为透明色 ，如果参数为LWA_ALPHA则设置整个窗口为透明，包括边框
	}
	

	//     //默认不显示窗口
    // ShowWindow(hwnd, SW_HIDE);
    // UpdateWindow(hwnd);

	return Napi::Number::New(env,result_preview);
}


/**
 * 关灯
*/
int turnOffLight(int type){
	int ids[1];
	ids[0] = type;
	return Dll_TurnOffLight(ids, 1);
}

/**
 *隐藏子窗口
*/
Napi::Value HideChildWindow(const Napi::CallbackInfo &info){
	Napi::Env env = info.Env();
    if(hwnd){
        ShowWindow(hwnd,SW_HIDE);
		return Napi::Number::New(env,0);
    }
	return Napi::Number::New(env,-1);
    
}

/**
 * 显示子窗口 成功返回0 失败返回-1
*/
Napi::Value ShowChildWindow(const Napi::CallbackInfo &info){
	Napi::Env env = info.Env();
    if(hwnd){
		if(result_preview==0){
			//显示窗口
			ShowWindow(hwnd,SW_SHOW);
			return Napi::Number::New(env,0);
		}else{
			return Napi::Number::New(env,-1);
		}
        
    }
	return Napi::Number::New(env,-1);
    
}


/**
 * 关闭摄像头窗口
*/
Napi::Value CloseChildWindow(const Napi::CallbackInfo &info){
	Napi::Env env = info.Env();
	Log_Printf("CloseChildWindow start");
	 if(hwnd != NULL){
        PostMessage(hwnd,WM_CLOSE,0,0);
    }else{
		return Napi::Number::New(env,-1);
	}
	Log_Printf("CloseWindow end");

	Log_Printf("Dll_CloseCamera start");

    Dll_CloseCamera(camera_index);
	Log_Printf("Dll_CloseCamera end");

	Log_Printf("turnOffLight start");
	int rlight = turnOffLight(0);
	std::string turnOffLight_log = "turnOffLight result is : " + std::to_string(rlight);
	Log_Printf(turnOffLight_log.c_str());
	Log_Printf("turnOffLight end");
    Dll_CloseDevice();
	Log_Printf("Dll_CloseDevice success");
    Dll_StopPreview(camera_index);
	Log_Printf("Dll_StopPreview success");
	Log_Printf("CloseChildWindow end");
	return Napi::Number::New(env,0);
   
}

/**
 * 写jpg图片
*/
int WriteFileJPG(const wchar_t *fileName,BYTE* pBuffer,long lBufferSize,int width,int height){
	HANDLE hf = CreateFileW(
		fileName,GENERIC_WRITE,FILE_SHARE_READ,NULL,CREATE_ALWAYS,NULL,NULL
	);
	if(hf == INVALID_HANDLE_VALUE){
		return -1;
	}
	DWORD dwWritten = 0;
	WriteFile(hf,pBuffer,lBufferSize,&dwWritten,NULL);
	CloseHandle(hf);
	return 0;
}

/**
 * 图片转换
*/
int CopyBitmap(const wchar_t *fileName, BYTE * pBuffer, long lBufferSize, int width, int height)
{
	// write out a BMP file
	//
	HANDLE hf = CreateFileW(
		fileName, GENERIC_WRITE, FILE_SHARE_READ, NULL,
		CREATE_ALWAYS, NULL, NULL);

	if (hf == INVALID_HANDLE_VALUE)
		return -102030;

	// write out the file header
	//
	BITMAPFILEHEADER bfh;
	memset(&bfh, 0, sizeof(bfh));
	bfh.bfType = 'MB';
	bfh.bfSize = sizeof(bfh)+lBufferSize + sizeof(BITMAPINFOHEADER);
	bfh.bfOffBits = sizeof(BITMAPINFOHEADER)+sizeof(BITMAPFILEHEADER);

	DWORD dwWritten = 0;
	WriteFile(hf, &bfh, sizeof(bfh), &dwWritten, NULL);

	// and the bitmap format
	//
	BITMAPINFOHEADER bih;
	memset(&bih, 0, sizeof(bih));
	bih.biSize = sizeof(bih);
	bih.biWidth = width;
	bih.biHeight = height;
	bih.biPlanes = 1;
	bih.biBitCount = 24;

	dwWritten = 0;
	WriteFile(hf, &bih, sizeof(bih), &dwWritten, NULL);

	// and the bits themselves
	//
	dwWritten = 0;
	WriteFile(hf, pBuffer, lBufferSize, &dwWritten, NULL);

	CloseHandle(hf);

	return 0;
}

#define IMG_BUF_SIZE1 48832128
char outImg[IMG_BUF_SIZE1];

/**
 * 拍照
*/
Napi::Value TakePhoto(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();
    int outLength, imgWidth, imgHeight;
	
	if(NULL==Dll_TakePicSyn){
		Log_Printf("ERROR:GET Dll_TakePicSyn FROM DLL FAILED, Dll_TakePicSyn is NULL");
 		return Napi::Number::New(env, -999);
	}

    int ret = Dll_TakePicSyn(camera_index, outImg, &outLength, &imgWidth, &imgHeight);
    if(ret!=0){
		std::string takepic_result_log = "Dll_TakePicSyn failed,result is" + std::to_string(ret);
		Log_Printf(takepic_result_log.c_str());
       return Napi::Number::New(env, ret);
    }
	wstring pathW = L"captured_image.jpg";
	try
	{
		std::string filePath = info[0].As<Napi::String>().Utf8Value();
		wstring tempPath;
		tempPath.assign(filePath.begin(),filePath.end());
		pathW = tempPath;
	}
	catch(const std::exception& e)
	{
		std::cerr << e.what() << '\n';
	}
	
	int res = WriteFileJPG(pathW.c_str(), (BYTE*)outImg, outLength, imgWidth, imgHeight);

    return Napi::Number::New(env, ret);
}

/**
 * 设置摄像头参数 接受两个参数，一个参数类型 string 一个参数 array
 * #define CAM_RESOLUTION "resolution" //分辨率
#define CAM_EXPOSURE "exposure"   //曝光
#define CAM_EXPOSURE_AUTO "exposure_auto" //自动曝光
#define CAM_WHITEBALANCE "whitebalance" //白平衡
#define CAM_WHITEBALANCE_AUTO "whitebalance_auto" //自动白平衡
*/
Napi::Value SetCameraParam(const Napi::CallbackInfo& info){
	Napi::Env env = info.Env();
	if(info.Length()<2 || !info[0].IsString() ){
		Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
	}else if(!info[1].IsArray()){
		Napi::TypeError::New(env, "Array expected").ThrowAsJavaScriptException();
        return env.Null();
	}
	std::string typeStr = info[0].As<Napi::String>().Utf8Value();
	Napi::Array  array = info[1].As<Napi::Array>();

	Log_Printf("setCameraParam start");
	char* pType = const_cast<char*>(typeStr.c_str());
	size_t length = array.Length();
	int pValue[2];
	std::string pValue_log;
	for(size_t i=0;i<length;i++){
		Napi::Value ele = array.Get(i);
		if(ele.IsNumber()){
			pValue[i] = ele.As<Napi::Number>().Int32Value();
			pValue_log += " pValue " + to_string(i) +" is " + to_string(pValue[0]);
		}
	}
	std::string CameraParam_log = "type  is:" + typeStr +"; " + pValue_log;
	Log_Printf(CameraParam_log.c_str());
	int res = Dll_SetCameraParameter(camera_index,pType,pValue,length);
	//设置完参数后，需要重新startpreivew
	if(typeStr==CAM_RESOLUTION){

		Dll_StartPreview(camera_index);
	}else{

	}
	std::string SetCameraParam_log = "setCameraParam end result is " + to_string(res);
	Log_Printf(SetCameraParam_log.c_str());
	return Napi::Number::New(env,res);
}

/**
 * 获取摄像头参数 接受两个参数，一个参数类型 string 一个参数 array
 * #define CAM_RESOLUTION "resolution" //分辨率
#define CAM_EXPOSURE "exposure"   //曝光
#define CAM_EXPOSURE_AUTO "exposure_auto" //自动曝光
#define CAM_WHITEBALANCE "whitebalance" //白平衡
#define CAM_WHITEBALANCE_AUTO "whitebalance_auto" //自动白平衡
*/
Napi::Value GetCameraParam(const Napi::CallbackInfo& info){
	int retCode = -1;
	std::string message = "";
	Napi::Env env = info.Env();
	if(info.Length()<1|| !info[0].IsString() ){
		Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
	}
	std::string typeStr = info[0].As<Napi::String>().Utf8Value();

	std::cout << "getCameraParam start... "  << std::endl;
	std::cout << "typeStr is: " << typeStr << std::endl;
	char* pType = const_cast<char*>(typeStr.c_str());

	Napi::Object retData = Napi::Object::New(env);

	if(NULL == Dll_GetCameraParameter){
		retCode = -999;
		message = "Dll_GetCameraParameter is not available";
	}else{
		try
		{	
			if(typeStr==CAM_RESOLUTION){//如果是获取分辨率，则返回两个参数
				int pValue[2];
				int length = 2;
				retCode = Dll_GetCameraParameter(camera_index,pType,pValue,&length);
				Napi::Array pArray = Napi::Array::New(env,2);
				uint32_t index = 0;
				pArray.Set(index,pValue[0]);
				pArray.Set(index+1,pValue[1]);
				retData.Set("value",pArray);
				std::cout << "pType is: " << pType << std::endl <<
				" pValue[0] is: " << pValue[0] <<std::endl
			 	<< " pValue[1] is: " << pValue[1] <<std::endl;
			}else{
				int pValue[1];
				int length = 1;
				retCode = Dll_GetCameraParameter(camera_index,pType,pValue,&length);
				Napi::Array pArray = Napi::Array::New(env,1);
				uint32_t index = 0;
				pArray.Set(index,pValue[0]);
				retData.Set("value",pArray);
				std::cout << "pType is: " << pType << std::endl <<
				" pValue[0] is: " << pValue[0] <<std::endl;
			}
			std::cout << "retCode is: " << retCode << std::endl ;
			std::cout << "getCameraParam end "  << std::endl;
		}
		catch(const std::exception& e)
		{
			std::cerr << e.what() << '\n';
		}
	}

	Napi::Object obj = Napi::Object::New(env);
	obj.Set("code",retCode);
	obj.Set("data",retData);
	obj.Set("message",message);
	return obj;
}

/**
 * 识别图片中的二维码
*/
Napi::Value ParseQrCodeImage(const Napi::CallbackInfo& info){
	int retCode = -1;
	std::string message = "";
	Napi::Env env = info.Env();
	if(info.Length()<1 || !info[0].IsString()){
		Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
	}
	std::string imagePath = info[0].As<Napi::String>().Utf8Value();
	char* context = new char[MAX_QRCODE_LENGTH];
	QrCodePoints_t pos;
	std::cout << "imagePath is: " << imagePath << std::endl;

	if(NULL == DLL_ParseQrCodeImg){
		Log_Printf("ERROR:GET DLL_ParseQrCodeImg FROM DLL FAILED, DLL_ParseQrCodeImg is NULL");
		retCode = -999;
		message = "DLL_ParseQrCodeImg is not available";
	}else{
		retCode = DLL_ParseQrCodeImg(imagePath.c_str(),&pos,context,MAX_QRCODE_LENGTH);
		std::cout << "retCode is: " << retCode << std::endl;
		if(retCode==0){
			message = "parse qrcode success";
		}else{
			message = "parse qrcode failed";
		}
		
	}
	Napi::Object retData = Napi::Object::New(env);
	retData.Set("content",Napi::String::New(env, context));
	Napi::Object obj = Napi::Object::New(env);
	obj.Set("code",retCode);
	obj.Set("data",retData);
	obj.Set("message",message);
	delete context;
	return obj;
}
/**
 * 将结构体转换为对象返回供js使用
*/
Napi::Object CreateObjectWithStruct(const Napi::Env& env,const PaperprintResult_t& result,int retCode){
	Napi::Object obj = Napi::Object::New(env);
	obj.Set("retCode",retCode);
	obj.Set("result_1_1",result.result_1_1);
	obj.Set("result_2_2",result.result_2_2);
	obj.Set("result_3_3",result.result_3_3);
	obj.Set("result_4_4",result.result_4_4);
	obj.Set("result_1_2",result.result_1_2);
	obj.Set("result_1_3",result.result_1_3);
	obj.Set("result_1_4",result.result_1_4);
	obj.Set("result_2_1",result.result_2_1);
	obj.Set("result_2_3",result.result_2_3);
	obj.Set("result_2_4",result.result_2_4);
	obj.Set("result_3_1",result.result_3_1);
	obj.Set("result_3_2",result.result_3_2);
	obj.Set("result_3_4",result.result_3_4);
	obj.Set("result_4_1",result.result_4_1);
	obj.Set("result_4_2",result.result_4_2);
	obj.Set("result_4_3",result.result_4_3);
	return obj;
}
/**
 * NapiObject 转c++ string
*/
std::string ConvertNapiObjectToString(const Napi::Object& napiObject) {
    Napi::Env env = napiObject.Env();
    std::string result = "{";

    Napi::Array propertyNames = napiObject.GetPropertyNames();
    bool firstProperty = true;
    for (uint32_t i = 0; i < propertyNames.Length(); ++i) {
        Napi::Value propertyNameValue = propertyNames.Get(i);
        Napi::Value propertyValue = napiObject.Get(propertyNameValue);
        
        if (firstProperty) {
            firstProperty = false;
        } else {
            result += ", ";
        }

        std::string propertyName = propertyNameValue.ToString().Utf8Value();
        std::string propertyValueString = propertyValue.ToString().Utf8Value();
        
        result += "\"" + propertyName + "\": \"" + propertyValueString + "\"";
    }

    result += "}";
    return result;
}
/**
 * 字符串替换
*/
std::string ReplaceString(std::string original, const std::string& target, const std::string& replacement) {
    size_t position = 0;
    while ((position = original.find(target, position)) != std::string::npos) {
        original.replace(position, target.length(), replacement);
        position += replacement.length();
    }
    return original;
}
/**
 * 图片核验 
*/
Napi::Value Verify_Reflex(const Napi::CallbackInfo& info){//反射纸纹核验方法
	int retCode = -1;
	Napi::Env env = info.Env();

	if(info.Length()<3 || !info[0].IsString() || !info[1].IsString()){
		Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
	}

	if(!info[2].IsObject()){
		Napi::TypeError::New(env, "Object expected").ThrowAsJavaScriptException();
        return env.Null();
	}
	std::string regImagePath = info[0].As<Napi::String>().Utf8Value();
	std::string  verifyImgPath = info[1].As<Napi::String>().Utf8Value();
	const char* verifyJ1FilePath = "";


	std::string CompareImg_path_log = "regImagePath  is:" + regImagePath +"\n verifyImgPath is:" + verifyImgPath;
	Log_Printf(CompareImg_path_log.c_str());

	PaperprintResult_t result;

	Napi::Object obj = info[2].As<Napi::Object>();
	char buffer[MAX_PATH];
    GetCurrentDirectoryA(MAX_PATH, buffer);
	std::string configurationPath = std::string(buffer) + R"(\dll)";
	
	configurationPath = ReplaceString(configurationPath,"\\","\\\\");

	obj.Set("CONFIGURATION_PATH",configurationPath);

	std::string paramsData = ConvertNapiObjectToString(obj);

	std::cout << "paramsData is: " << paramsData << std::endl;
	std::string CompareImg_param_log = "regImageparamsDataPath  is:" + paramsData;
	Log_Printf(CompareImg_param_log.c_str());

	DLL_SetCompareParam(paramsData.c_str());
	if(NULL == DLL_CompareImg){
		Log_Printf("ERROR:DLL_CompareImg is NULL");
		retCode = -999;
	}else{
		Log_Printf("Verify_Reflex:DLL_CompareImg start");
		//retCode -2表示没有找到图片
		retCode = DLL_CompareImg(regImagePath.c_str(),verifyImgPath.c_str(),&result,verifyJ1FilePath);
		std::string CompareImg_log = "Verify_Reflex:DLL_CompareImg result is: " + std::to_string(retCode);
		Log_Printf(CompareImg_log.c_str());
	}
	Napi::Object res = CreateObjectWithStruct(env,result,retCode);
	return res;
}


//透视核验所需参数
int Perspective_result = -999;
std::mutex mtx;
std::condition_variable cv;


/**
 * 透视核验方法回调
*/
void verify_cb(int code,int result){
	if(code==0){
		Perspective_result = result;
	}else{
		Perspective_result = code;
	}
	string verfiy_log = "Verify_Transmit result is:"+to_string(Perspective_result);
	Log_Printf(verfiy_log.c_str());
	cv.notify_one();
}

/**
 * 根据路径获取图片size 与buffer对象
*/
unsigned char * loadfile(const std::string &file, int &size)
{
	std::setlocale(LC_ALL, ".UTF-8");//解决文件路径中中文无法加载问题

    std::ifstream fs(file.c_str(), std::ios::binary);
	if (!fs.is_open()) {
		string file_log = "cannot open file"+file;
		Log_Printf(file_log.c_str());
		return nullptr;
    }
    fs.seekg(0, std::ios::end);
    size = fs.tellg();
    char * data = new char[size + 1];
    fs.seekg(0);
    fs.read(data, size);
    fs.close();
    data[size] = 0;//todo 内存没有释放
    return (unsigned char *)data;
}
/**
 * 获取当前时间毫秒数
*/
std::time_t getTimeStamp()
{
    std::chrono::time_point<std::chrono::system_clock,std::chrono::milliseconds> tp = std::chrono::time_point_cast<std::chrono::milliseconds>(std::chrono::system_clock::now());
    auto tmp=std::chrono::duration_cast<std::chrono::milliseconds>(tp.time_since_epoch());
    std::time_t timestamp = tmp.count();
    return timestamp;

}

/**
 * 获取前景图像占整个拍摄背景的面积比例
*/
Napi::Value GetAreaRatio(const Napi::CallbackInfo& info){
	Napi::Env env = info.Env();
	Log_Printf("GetAreaRatio start------------------");
	if(info.Length()<1 || !info[0].IsString()){
		Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
	}
	std::string imgPath = info[0].As<Napi::String>().Utf8Value();
	int fileSize;
	unsigned char* img = loadfile(imgPath.c_str(), fileSize);
	float radio;
	const IMG_DATA_INFO checkImg = {img,fileSize,4656,3496,0};
	string regImage_log = "checkImg fileSize  is:"+to_string(fileSize);
	Log_Printf(regImage_log.c_str());

	//计算前景图占整个拍摄背景的面积比例
	std::time_t start = getTimeStamp();
	Log_Printf(("DLL_GetForeGroundAreaRatio start:" + to_string(start)).c_str());

	int responseCode = DLL_GetForeGroundAreaRatio(checkImg,&radio);

	std::time_t end = getTimeStamp();

	Log_Printf(("DLL_GetForeGroundAreaRatio end:" + to_string(end)).c_str());

	Log_Printf(("GetForeGroundAreaRatio radio is:" + to_string(radio)).c_str());

	Log_Printf(("GetForeGroundAreaRatio result is:" + to_string(responseCode)).c_str());

	Log_Printf("GetAreaRatio end---------------------");
	delete[] img;
	Napi::Object retData = Napi::Object::New(env);
	retData.Set("radio",radio);
	Napi::Object obj = Napi::Object::New(env);
	obj.Set("code",responseCode);
	obj.Set("data",retData);
	obj.Set("message","");
	return obj;

}

//透视纸纹核验
Napi::Value Verify_Transmit(const Napi::CallbackInfo& info){
	Napi::Env env = info.Env();

	if(info.Length()<2 || !info[0].IsString() || !info[1].IsString()){
		Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return env.Null();
	}

	std::string regImagePath = info[0].As<Napi::String>().Utf8Value();
	std::string  verifyImgPath = info[1].As<Napi::String>().Utf8Value();

	std::string CompareImg_path_log = "regImagePath  is:" + regImagePath +"\n verifyImgPath is:" + verifyImgPath;
	Log_Printf(CompareImg_path_log.c_str());

	int regImageSize, verifyImageSize;



	unsigned char* sign_image = loadfile(regImagePath.c_str(), regImageSize);
	unsigned char* check_image = loadfile(verifyImgPath.c_str(), verifyImageSize);

	const IMG_DATA_INFO signImg = {sign_image,regImageSize,1,1,0};
	const IMG_DATA_INFO checkImg = {check_image,verifyImageSize,1,1,0};

	string regImage_log = "regImageSize  is:"+to_string(regImageSize);
	Log_Printf(regImage_log.c_str());

	string verifyImage_log = "verifyImageSize  is:"+to_string(verifyImageSize);
	Log_Printf(verifyImage_log.c_str());

	int retCode = DLL_VerifyImg(signImg, checkImg, verify_cb);
	unique_lock<std::mutex> lck(mtx);
    cv.wait(lck);

	delete[] sign_image;
	delete[] check_image;

	Log_Printf("Verify_Transmit end");

	Napi::Object retData = Napi::Object::New(env);
	retData.Set("result",Perspective_result);
	Napi::Object obj = Napi::Object::New(env);
	obj.Set("code",retCode);
	obj.Set("data",retData);
	obj.Set("message","");
	return obj;
}


/**
 * 导出函数
*/
Napi::Object Init(Napi::Env env, Napi::Object exports)
{
	exports.Set(Napi::String::New(env, "loadDll"), Napi::Function::New(env, LoadDLL));//加载dll
	exports.Set(Napi::String::New(env, "openDevice"), Napi::Function::New(env, OpenCameraDevice));//打开摄像头
    exports.Set(Napi::String::New(env, "createChildWindow"), Napi::Function::New(env, CreateChildWindow));//创建摄像头窗口 
    exports.Set(Napi::String::New(env, "closeChildWindow"), Napi::Function::New(env, CloseChildWindow));//关闭摄像头窗口
    exports.Set(Napi::String::New(env, "showChildWindow"), Napi::Function::New(env, ShowChildWindow));//显示摄像头窗口
    exports.Set(Napi::String::New(env, "hideChildWindow"), Napi::Function::New(env, HideChildWindow));//隐藏摄像头窗口
	exports.Set(Napi::String::New(env, "takePhoto"), Napi::Function::New(env, TakePhoto));//拍照
	exports.Set(Napi::String::New(env, "verify_reflex"), Napi::Function::New(env, Verify_Reflex));//反射纸纹，图片核验
	exports.Set(Napi::String::New(env, "getAreaRadio"), Napi::Function::New(env, GetAreaRatio));//计算图片背景比例
	exports.Set(Napi::String::New(env, "verify_transmit"), Napi::Function::New(env, Verify_Transmit));//透射纸纹，图片核验
	exports.Set(Napi::String::New(env, "setCameraParam"), Napi::Function::New(env, SetCameraParam));//设置摄像头参数
	exports.Set(Napi::String::New(env, "getCameraParam"), Napi::Function::New(env, GetCameraParam));//获取摄像头参数
	exports.Set(Napi::String::New(env, "parseQrCodeImage"), Napi::Function::New(env, ParseQrCodeImage));//识别图片二维码
	
    return exports;
}
NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)