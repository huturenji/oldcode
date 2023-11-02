@echo off

SET CD_DIR=%CD%
@IF EXIST vs2013 rmdir /s /q vs2013


rem rmdir /s /q Windows\2015
mkdir vs2013
CD vs2013

call "%VS120COMNTOOLS%\vsvars32.bat"

rem  -T v100 specify Platform Toolset for a Visual Studio 2015 project
rem -DCMAKE_BUILD_TYPE=Release not useful in VS
cmake -G "Visual Studio 12 2013"  %CD_DIR%/
cmake --build %CD_DIR%\vs2013 --target ALL_BUILD --config Release
rem CD %~dp0

rem CD %~dp0
CD %CD_DIR%/../windows/