MODE con: COLS=79 LINES=25
REM 输入数字0:dev,1:build
:cho
@set choice=
@set /p choice= 
@IF NOT "%Choice%"=="" SET Choice=%Choice:~0,1%
@if /i "%choice%"=="0" goto dev
@if /i "%choice%"=="1" goto build
@echo 选择无效，请重新输入
@echo.
@goto cho
:dev
npm run dev
:build
npm run build