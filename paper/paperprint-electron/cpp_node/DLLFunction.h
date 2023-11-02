
#ifndef _DLL_FUNCTION_H_
#define _DLL_FUNCTION_H_

#include <Windows.h>
#include "Constants.h"
#include "AH100SDK.h"
#include "SinoPaperprint.h"

// DLL接口函数类型
typedef int(*P_INT__FUN__VOID)();
typedef int(*P_INT__FUN__INT)(int);
typedef int(*P_INT__FUN__PCCHAR)(const char*);
typedef int(*P_INT__FUN__AINT_INT)(int[], int);
typedef int(*P_INT__FUN__2AINT_INT)(int[], int[], int);
typedef int(*P_INT__FUN__INT_PCHAR_AINT_PINT)(int, char*, int[], int*);
typedef int(*P_INT__FUN__INT_PCHAR_AINT_INT)(int, char*, int[], int);
typedef int(*P_INT__FUN__INT_CB)(int, P_VOID_CALLBACK_PCHAR_3INT);
typedef int(*P_INT__FUN__INT_PCHAR_3PINT)(int, char*, int*, int*, int*);
typedef int(*P_INT__FUN__INT__HWND)(int, HWND);
typedef int(*P_INT__FUN__INT_STRUCT)(const char*,const char*,PaperprintResult_t*,const char*);
typedef int(*P_INT__FUN__PCHAR_STRUCT)(const char*,QrCodePoints_t*, char*,int);
typedef int(*P_INT__FUN__STRUCT_STRUCT_CB)(IMG_DATA_INFO,IMG_DATA_INFO,void(*cb)(int, int));
typedef int(*P_INT__FUN_STRUCT_FLOAT)(IMG_DATA_INFO,float*);

#endif
