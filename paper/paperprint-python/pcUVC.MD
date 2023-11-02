<!--
 * @Author: miaoju jun.miao@sinosun.com.cn
 * @Date: 2023-08-02 10:45:22
 * @LastEditors: miaoju jun.miao@sinosun.com.cn
 * @LastEditTime: 2023-08-02 15:13:44
 * @FilePath: /paperprint-py/pcUVC.MD
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# <center> PC 客户端纸纹注册核验demo </center>

#### 整体模块架构(python版本)
```mermaid
    flowchart LR
    H5界面 -->|界面操作| Electron客户端 -->|拍照| UVC库 -->|存储拍摄图片| fileSystem
    UVC库 -->|拍照| 外置摄像头
    Electron客户端 -->|核验| python核验程序 -->|获取注册图核验图| fileSystem
```
* H5界面，提供摄像头预览，注册图录入、核验图拍摄并展示核验结果
* Electron客户端，为H5界面操作与UVC库、python核验流程做bridge桥接
* UVC库，C++程序部分，内部使用opencv封装的uvc协议调用外置摄像头进行拍照，并保存图片
* python核验程序，接受注册图、核验图本地文件地址作为入参，进行图片比对核验，并返回对比结果
* fileSystem，拍摄图片存储，按照“标签ID”、二维码内容索引到注册图

#### 交互时序(python版本)

###### 纸纹注册
```mermaid
sequenceDiagram
autonumber
actor user as 用户
participant H5 as H5界面
participant electron as Electron客户端
participant uvc as UVC库
participant file as fileSystem
participant camera as 外置摄像头
participant py as python核验程序

user ->> H5: 打开注册界面
H5 ->> H5: 调用浏览器api进行摄像头画面预览
user ->> H5: 拍照
H5 ->>H5: 调用api停止预览，截图显示并loading
H5 ->> electron: 调用拍照
electron ->> uvc: 调用拍照api
uvc ->> uvc: init camera
uvc ->> camera: 拍照
uvc ->> file: save to tempPath
uvc ->> uvc: release camera
uvc -->> electron: tempPath
electron -->> H5: temPath
H5 ->> H5: 显示录入界面
user ->> H5: 录入标签ID、描述..., 保存
H5 ->> electron: 保存注册图
electron ->> py: saveRegistImage(tempPath, ID)
py ->> py: 识别二维码并hashCode
py ->> file: mkDir(rootPath/hashCode)
py ->> file: mvFile(tempPath, rootPath/hashCode/ID.jpg)
py -->> electron: qrCode, savePath
electron -->> H5: result
H5 ->> H5: show Result
```


###### 纸纹核验
```mermaid
sequenceDiagram
autonumber
actor user as 用户
participant H5 as H5界面
participant electron as Electron客户端
participant uvc as UVC库
participant file as fileSystem
participant camera as 外置摄像头
participant py as python核验程序

user ->> H5: 打开核验界面
H5 ->> H5: 调用浏览器api进行摄像头画面预览
user ->> H5: 拍照
H5 ->>H5: 调用api停止预览，截图显示并loading
H5 ->> electron: 调用拍照
electron ->> uvc: 调用拍照api
uvc ->> uvc: init camera
uvc ->> camera: 拍照
uvc ->> file: save to tempPath
uvc ->> uvc: release camera
uvc -->> electron: tempPath

rect rgb(233,233,254)
Note over electron, py: python程序识别出二维码内容并在文件系统找出对应注册图(可能多个)
electron ->> py: verifiy(tempPath)核验图片
py ->> py: 识别二维码并hashCode
py ->> file: listFile(rooPath/hashCode)
file -->> py: fileList
end

rect rgb(233,233,254)
Note over electron, py: 逐个比对找出来的注册图，如果遇到比对成功的就停止
loop: regfile in fileList
    py ->> py: verifiy(regfile, tempPath)
    py ->> file: load regImage
    py ->> file: load verifiImage
    py ->> py: compare(regFile tempFile)
    alt: result is ok
        py ->> py: break
    end
end
end

py ->> file: delete tempPath file
py -->> electron: result
electron -->> H5: result
H5 ->> H5: show Result
```

#### 整体模块架构(C++版本)
```mermaid
    flowchart LR
    H5界面 -->|界面操作| Electron客户端 -->|拍照| AH100库-->|存储拍摄图片| fileSystem
    AH100库 -->|拍照| 外置摄像头
    Electron客户端 -->|核验| C++核验程序 -->|获取注册图核验图| fileSystem
```
* H5界面，提供摄像头预览，注册图录入、核验图拍摄并展示核验结果
* Electron客户端，为H5界面操作与UVC库、python核验流程做bridge桥接
* AH100库，C++程序部分，内部使用directshow封装的uvc协议调用外置摄像头进行拍照，并保存图片
* C++核验程序，接受注册图、核验图本地文件地址作为入参，进行图片比对核验，并返回对比结果
* fileSystem，拍摄图片存储，按照“标签ID”、二维码内容索引到注册图

#### 交互时序(C++版本)

###### 纸纹注册
```mermaid
sequenceDiagram
autonumber
actor user as 用户
participant H5 as H5界面
participant electron as Electron客户端
participant AH100 as AH100库
participant file as fileSystem
participant camera as 外置摄像头
participant cpp as C++核验程序

user ->> H5: 打开注册界面
H5 ->> H5: 显示录入界面
H5 ->> electron: 调用预览视频流
electron ->>AH100: 调用AH100 api进行摄像头画面预览
user ->> H5: 录入标签ID、描述..., 保存
user ->> H5: 注册
H5 ->> electron: 调用拍照
electron ->> AH100: 调用拍照api
AH100 ->> AH100: init camera
AH100 ->> camera: 拍照
AH100 ->> file: save to tempPath
AH100 -->> electron: tempPath
electron -->> H5: temPath
electron ->> cpp: 隐藏视频流窗口
H5 ->> H5: 在原视频流窗口位置显示拍的照片，界面显示loading
H5 ->> electron: 保存注册图
electron ->> cpp: 识别二维码
cpp -->> electron: qrCode
electron ->> electron: hashCode
electron ->> file: mkDir(rootPath/hashCode)
electron ->> file: mvFile(tempPath, rootPath/hashCode/ID.jpg)
electron -->> H5: result
H5 ->> H5: show Result,关闭loading
```


###### 纸纹核验
```mermaid
sequenceDiagram
autonumber
actor user as 用户
participant H5 as H5界面
participant electron as Electron客户端
participant AH100 as AH100库
participant file as fileSystem
participant camera as 外置摄像头
participant cpp as C++核验程序

user ->> H5: 打开核验界面
H5 ->> H5: 显示核验界面
H5 ->> electron: 调用预览视频流
electron ->>AH100: 调用AH100 api进行摄像头画面预览
user ->> H5: 拍照
H5 ->> electron: 调用拍照
electron ->> AH100: 调用拍照api
AH100 ->> AH100: init camera
AH100 ->> camera: 拍照
AH100 ->> file: save to tempPath
AH100 -->> electron: tempPath
electron ->> cpp: 隐藏视频流窗口
H5 ->> H5: 在原视频流窗口位置显示拍的照片，界面显示loading

rect rgb(233,233,254)
Note over electron, cpp: c++程序识别出二维码内容并在文件系统找出对应注册图(可能多个)
electron ->> cpp: verifiy(tempPath)核验图片
cpp ->> cpp: 识别二维码并hashCode
cpp ->> file: listFile(rooPath/hashCode)
file -->> cpp: fileList
end

rect rgb(233,233,254)
Note over electron, cpp: 逐个比对找出来的注册图，如果遇到比对成功的就停止
loop: regfile in fileList
    cpp ->> cpp: verifiy(regfile, tempPath)
    cpp ->> file: load regImage
    cpp ->> file: load verifiImage
    cpp ->> cpp: compare(regFile tempFile)
    alt: result is ok
        cpp ->> cpp: break
    end
end
end

cpp ->> file: delete tempPath file
cpp -->> electron: result
electron -->> H5: result
H5 ->> H5: show Result,关闭loading
```