@echo off


if "%1%" == "" (
    goto failure
) 

if "%2%" == "" (
    goto failure
) 

if "%3%" == "" (
    goto failure
) 


call build_vs2019.cmd
@if not errorlevel==0 (
echo "******************fail to build json project !!******************"
pause
exit 1 
)


@set current_path=%cd%

@set packagePath=%current_path%\packagePath

if exist %packagePath% (
    rmdir /s /q "%packagePath%"
) 
mkdir %packagePath%


@set releaseDate=%date:~0,10%
@set releaseDate="%releaseDate:/=%"
set Version=%1.%2.%3-%releaseDate%
set VersionName=%1.%2.%3

@set releasePath=%current_path%\Release

xcopy %current_path%\..\..\src\SinoPaperprint.h "%packagePath%" /Y /F
xcopy %current_path%\..\..\src\SinoPaperprintErrCode.h "%packagePath%" /Y /F
xcopy %releasePath%\*.dll "%packagePath%" /Y /F
xcopy %releasePath%\*.lib "%packagePath%" /Y /F

rem copy deps dll and file
@set DEPS_PATH=%current_path%\..\..\libs\windows\dll
echo %DEPS_PATH%
xcopy %DEPS_PATH%\exiv2.dll "%packagePath%" /Y /F
xcopy %DEPS_PATH%\PocoFoundation64.dll "%packagePath%" /Y /F
xcopy %DEPS_PATH%\libraw.dll "%packagePath%" /Y /F
xcopy %DEPS_PATH%\opencv_core470.dll "%packagePath%" /Y /F
xcopy %DEPS_PATH%\opencv_dnn470.dll "%packagePath%" /Y /F
xcopy %DEPS_PATH%\opencv_imgproc470.dll "%packagePath%" /Y /F
xcopy %DEPS_PATH%\opencv_wechat_qrcode470.dll "%packagePath%" /Y /F
xcopy %DEPS_PATH%\opencv_world470.dll "%packagePath%" /Y /F
xcopy %DEPS_PATH%\msvcp140d.dll "%packagePath%" /Y /F
xcopy %DEPS_PATH%\ucrtbased.dll "%packagePath%" /Y /F
xcopy %DEPS_PATH%\vcruntime140_1d.dll "%packagePath%" /Y /F
xcopy %DEPS_PATH%\vcruntime140d.dll "%packagePath%" /Y /F
xcopy %DEPS_PATH%\*.prototxt "%packagePath%" /Y /F
xcopy %DEPS_PATH%\*.caffemodel "%packagePath%" /Y /F

cd /d "%packagePath%"
echo %cd%
"%current_path%\zip.exe" -r SinoPaperprint-x64-%Version%.zip *.*


del *.dll *.lib *.h *.txt *.pdb *.sym *.prototxt *.caffemodel
certutil -hashfile SinoPaperprint-x64-%Version%.zip MD5 > SinoPaperprint-x64-%Version%.zip.md5
echo  SinoPaperprint-x64-%Version%.zip >> SinoPaperprint-x64-%Version%.zip.md5

cd %current_path%

goto success

:failure
echo "creat failure please input version num like 1 8 3"
pause 

:success
echo "creat success"