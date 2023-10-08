MODE con: COLS=79 LINES=25
REM 输入数字0:dev,1:build,2.buildBlack,3.buildSandbox,4.buildProd
:cho
@set choice=
@set /p choice= 
@IF NOT "%Choice%"=="" SET Choice=%Choice:~0,1%
@if /i "%choice%"=="0" goto dev
@if /i "%choice%"=="1" goto build
@if /i "%choice%"=="2" goto buildBlack
@if /i "%choice%"=="3" goto buildSandbox
@if /i "%choice%"=="4" goto buildProd
@echo 选择无效，请重新输入
@echo.
@goto cho
:dev
npm run dev
:build
npm run build
:buildBlack
npm run buildBlack
:buildSandbox
npm run buildSandbox
:buildProd
npm run buildProd