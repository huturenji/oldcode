MODE con: COLS=79 LINES=25
REM 输入数字1:build
:cho
@set choice=
@set /p choice= 
@IF NOT "%Choice%"=="" SET Choice=%Choice:~0,1%
@if /i "%choice%"=="1" goto build

@echo 选择无效，请重新输入
@echo.
@goto cho

:build
pyinstaller -F PCDemo.py -n compare
