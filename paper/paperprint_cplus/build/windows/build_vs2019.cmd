@echo off

SET CD_DIR=%CD%
@IF EXIST vs2019 rmdir /s /q vs2019
mkdir vs2019
CD vs2019


rem cmake %CD_DIR%/../ -G "Visual Studio 16 2019" -A x64
rem cmake -G "Visual Studio 16 2019"  %CD_DIR%/../
rem cmake -G "Visual Studio 16 2019" -A x64 -B %CD_DIR%/../
rem cmake -G "Visual Studio 16 2019" -A x64 %CD_DIR%/../

rem cmake %CD_DIR%/../ -G "Visual Studio 12 2013" -A x64  2013 too old, can not cover OpenCV
cmake %CD_DIR%/../ -G "Visual Studio 16 2019" -A x64
rem cmake --build %CD_DIR%\vs2019 --target ALL_BUILD --config Release 
cmake --build %CD_DIR%\vs2019 --target ALL_BUILD --config Release

rem exit 
@IF EXIST %CD_DIR%\result rmdir /s /q %CD_DIR%\result
mkdir %CD_DIR%\result

xcopy %CD_DIR%\Release\*.dll %CD_DIR%\result\ /Y /F
xcopy %CD_DIR%\Release\*.lib %CD_DIR%\result\ /Y /F
xcopy %CD_DIR%\..\..\src\SinoPaperprint.h %CD_DIR%\result\ /Y /F
xcopy %LIBS_PATH%\dll\*.prototxt %CD_DIR%\result\ /Y /F
xcopy %LIBS_PATH%\dll\*.caffemodel %CD_DIR%\result\ /Y /F

rem cd %CD_DIR%

@set LIBS_PATH=%CD_DIR%\..\..\libs\windows\
xcopy %LIBS_PATH%\lib\*.lib %CD_DIR%\result\ /Y /F
xcopy %LIBS_PATH%\dll\*.dll %CD_DIR%\result\ /Y /F


CD %CD_DIR%/../windows/

rem 2019
rem cmake -G "Visual Studio 16 2019" -A Win32
rem cmake -G "Visual Studio 16 2019" -A x64
rem cmake -G "Visual Studio 16 2019" -A ARM
rem cmake -G "Visual Studio 16 2019" -A ARM64