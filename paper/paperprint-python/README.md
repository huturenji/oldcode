<!--
 * @Author: miaoju jun.miao@sinosun.com.cn
 * @Date: 2023-06-29 13:16:07
 * @LastEditors: miaoju jun.miao@sinosun.com.cn
 * @LastEditTime: 2023-08-02 14:08:15
 * @FilePath: /paperprintpy/README.md
 * @Description: 使用说明文档
-->
# PaperPrintPy
纸纹python验证程序

#### 测试程序python环境准备
###### 检查pip安装源
```python
    pip config list # 查看是否设置源，已经设置安装源的会有下面的显示
    global.index-url='https://pypi.mirrors.ustc.edu.cn/simple/'

    # 没有设置源的请先设置安装源，否则后面install很慢
    pip config set global.index-url https://pypi.mirrors.ustc.edu.cn/simple/
```

###### 安装依赖包
python版本最好 >= python3.9
根据自己电脑pip版本，可能是pip3
```python
    pip install opencv-python
    pip install matplotlib
    pip install numpy
    pip install rawpy
    pip install zxing-cpp
    pip install opencv-contrib-python
    pip install py-cpuinfo
    pip install PyQt5
    pip install piexif
    pip install pillow
    pip install exifread
```

dng2tiffFile.py 为dng转tiff工具，使用C++库模式转换时，第一次执行需要赋予可执行权限:
```shell
cd ./libdng/mac/inter
chmod +x test
```
注意：
- mac电脑需要安装opencv库
- 如果是mac m1芯片电脑，上面执行的是 "./libdng/mac/m1"目录下面的可执行文件

#### 整体流程示意:
```mermaid
    flowchart LR
    注册图 --> 图像配准
    拍摄核验图 --> 图像配准
    图像配准 --> 裁剪指纹图 --> 图像处理 --> 图像对比
```

![](./readme.png)

#### 类图

```mermaid
classDiagram
direction LR
    class testCase {
        测试用例集合
        - listTiffFiles(folderPath, pattern = "")
        - singleTest(regFilePath, verifiFilePath)
        - batcingTest(regFiles, verifiFiles, reportRootPath)
    }

    class ImageCompare {
        注册图、核验图比对
        regImage = None # 注册图
        verifiImg = None # 核验图
        + ImageCompare(imgFile1,imgFile2)
        + compare(qrCodeWidth)
    }

    class QRCodePaperImage {
        带二维码的图片类
        type = 1    # 0 注册图， 1 核验图
        filePath = "" # 原始文件路径
        filename = "" # 文件名
        originImage = None # 原图（灰度图）
        cutShowImage = None # 透射变换后并画了裁剪区域边框的图，只做显示用
        cutImages = None # 裁剪的指纹图小图列表 上下左右的小图
        qrText = '' # 二维码内容
        qrPointsOrigin = None    # 原图的二维码顶点[左下、左上、右上、右下]
        qrPoints = None # 透视变换后的二维码顶点[左下、左上、右上、右下]
        qrWidthOrigin = None # 原图的二维码宽度
        qrWidth = None # 透射变换后的二维码宽度
        parseStatus = True # 二维码解析状态，在使用时应先判断状态是否“二维码解析成功”
        ppCutImages = None # （sobel X、Y轴都处理）已经预处理过的纸纹小图列表（sobel、高斯后的）上下左右的小图
        ppCutImagesX = None # （sobel X轴处理）已经预处理过的纸纹小图列表（sobel、高斯后的）上下左右的小图
        ppCutImagesY = None # （sobel Y轴处理）已经预处理过的纸纹小图列表（sobel、高斯后的—）上下左右的小图

        + QRCodePaperImage(filePath, type = 1)
        + alginByORB(self, qrPointsOrigin, qrCodeWidth, baseImg = None)
        + alginByQRCode(self, qrCodeWidth)
        + cutImgs(self, qrCodeWidth, cutWidth, cutHeight, padding)
        + preProcess()
    }

    class QRCodeParser {
        二维码解析工具
        + parseQrCodeImage(srcImg) # 解析二维码,返回二维码内容和四个顶点（左下、左上、右上、右下）
    }

    class PreprocessImageTool {
        图像预处理工具
        + preProcess(ppImg, direction='xy') # 图片算法处理
        - removeLight(srcImg, direction='xy') # sobel ，可指定x、y方向
        - gaussianImage(srcImg) # 对图片进行高斯模糊
    }

    class PylabShowTool {
        测试图片显示、保存图片工具
        + show2Image(srcImg, dstImg, regFileName, verifiFileName, size= (8,8), savePath = "")
        + showImage(srcImg,fileName, savePath = "")
        + showResultHist(resultTrue,resultFlase,title, detail = "", savePath = "")
        + showSmallCutImgCompare(srcImg, dstImg, name, savePath="")
    }

    class TestReport {
        测试报告
        + create(rootPath) # rootPath 测试报告根目录，在在此目录下创建 "rootPath/report+时间/" 的报告文件夹
        + addImageList(regFileList, verifiFileList) # 记录注册图、核验图清单
        + addCutSampleImg(imgName) # 记录裁剪图示例，传入文件名即可，不要传全路径, 程序会取 ./img/下面的文件名
        + addTestParams(params) # 记录实验参数
        + addResultSummary(allResultsTrue, allResultsFalse, histImgPath, regFilesLen,verifiFilesLen, calcCount, smallCount, costTime, exceptionNum)
        + addParseException(imageCompare, index, originImagePath) # 记录解析二维码异常
        + addResultDetails(imageCompare, resultsTrue, resultsFalse, showTrueResults, showFlaseResults, index) # 记录每组对比实验详细数据
        + save() # 保存测试报告

    }

    class params {
        测试参数
        IMAGE_FLOAT32 = True # 读取dng、tiff image数据为float32类型来处理，否则默认是uint16
        QRCODE_WIDTH = -1 # 透视变换时二维码基准边长, -1 表示以注册图大小为准，否则以指定值为基准,如200、300

        # 裁剪纸纹比对区域的大小，-1表示以二维码大小裁剪, [padding,width,height]
        # padding：裁剪与二维码之间的留白
        # width：裁剪的纸纹图width
        # height: 裁剪的纸纹图height，-1表示取二维码边长
        CUT_SIZE = [10, -1, 30]

        # 模版匹配范围，核验图比对上下左右位移像素范围
        MATCH_POSITION = 3

        # sobel后的高斯模糊参数,越大越模糊
        GAUSSIAN_SIZE = 9
        GAUSSIAN_SIGMA = 3
        SOBEL_CALC_AVG = False # ture 将sobel x、y分别计算相关性后取平均值；false 为sobelx、y后再直接计算相关性

        # sobel3*3矩阵卷积，在矩阵边缘一圈的值是不准确的，给去掉
        SOBEL_1 = False

        # 异常参数阈值设置（minTrue、maxFalse、span） 
        EXCEPITON_MIN_TRUE = 0.4 # 真图相同区域最小相关系数小于阈值认为异常
        EXCEPITON_MAX_FALSE = 0.3 # 假图相关系数大于阈值认为异常
        EXCEPITON_SPAN = 0.2 # 真图、假图相关系数间隔小于0.2的认为有异常

        # 测试报告参数
        SAVE_ORIGIN_IMAGE = True # 是否保存原始对比图
        SAVE_CUT_IMAGE = True # 是否保存配准对比图
        SAVE_COMPARE_IMAGE = True # 是否保存每个裁剪的纸纹图的对比图
        SAVE_TIFF_PPIMAGE = True # 是否保存裁剪后的纸纹tiff图
        SAVE_FALSE_IMAGE = True # 是否保存假图的过程图，false的话以上都不保存
        SAVE_COMPARE_HIST_IMAGE = True # 是否保存每组对比结果直方图
    }

    class util {
        + loadPaperImage(fileName, gray = True) # 加载纸纹图，默认返回(float32 的灰度图), gray 可以传false返回原始bgr，支持 .tiff .dng文件
        + readDNGImage(filename, gray = True)
        + readTiff (filename, gray = True)
        + img2U8(srcImage)
    }

    testCase *-- ImageCompare
    ImageCompare --> params
    ImageCompare *-- QRCodePaperImage
    ImageCompare --> PylabShowTool
    testCase --> PylabShowTool
    QRCodePaperImage --> params
    QRCodePaperImage --> util
    QRCodePaperImage --> QRCodeParser
    QRCodePaperImage --> PreprocessImageTool
    testCase *-- TestReport

```

#### 交互图

```mermaid
sequenceDiagram
autonumber
participant testCase
participant ImageCompare
participant QRCodePaperImage
participant util
participant QRCodeParser
participant PreprocessImageTool
participant TestReport

testCase ->> testCase: batcingTest(regFiles, verifiFiles, reportRootPath)
testCase ->> TestReport: create(reportRootPath)
testCase ->> TestReport: addImageList(regFiles, verifiFiles) # 记录注册图、核验图清单
testCase ->> TestReport: addTestParams(PARAMS_PRINT) # 记录实验参数

loop regFile: regFiles
    loop verifiFile : verifiFiles
        testCase ->>+ ImageCompare: ImageCompare(regFile, verifiFile)
        rect rgb(233,233,254)
        Note over ImageCompare, QRCodeParser: 分别加载注册、核验图片，并解析出二维码内容和顶点

            ImageCompare ->> QRCodePaperImage: QRCodePaperImage(regFile, 0)
            QRCodePaperImage ->> util: loadPaperImage(filePath)
            util -->> QRCodePaperImage: F32 gray image
            QRCodePaperImage ->> QRCodeParser: parseQrCodeImage(originImage)
            QRCodeParser -->> QRCodePaperImage: 二维码内容、四个顶点
            QRCodePaperImage ->> QRCodePaperImage: 根据解析二维码计算qrWidthOrigin
            QRCodePaperImage -->> ImageCompare: 
            ImageCompare ->> QRCodePaperImage: QRCodePaperImage(regFile, 1)
            QRCodePaperImage ->> util: loadPaperImage(filePath)
            util -->> QRCodePaperImage: F32 gray image
            QRCodePaperImage ->> QRCodeParser: parseQrCodeImage(originImage)
            QRCodeParser -->> QRCodePaperImage: 二维码内容、四个顶点
            QRCodePaperImage ->> QRCodePaperImage: 根据解析二维码计算qrWidthOrigin
            QRCodePaperImage -->> ImageCompare: 
        end
        ImageCompare -->> testCase: 
        alt 二维码解析失败:
            testCase ->> TestReport: addParseException
            testCase ->> testCase: continue
        end

        rect rgb(233,233,254)
        Note over ImageCompare, QRCodePaperImage: 以指定qrCodeWidth配准、裁剪注册图和核验图的小纸纹图
            testCase ->>+ ImageCompare : compare(qrCodeWidth)
            ImageCompare ->> QRCodePaperImage: alginByOrb orb配准
            alt: orb配准失败
                Note over ImageCompare, QRCodePaperImage: orb配准失败，换成二维码配准
                ImageCompare ->> QRCodePaperImage: alginByQRCode
            end
            ImageCompare ->> QRCodePaperImage: regImage.cutImgs(qrCodeWidth, cutWidth, cutHeight, padding)
            QRCodePaperImage ->> QRCodePaperImage: calcCutImage 裁剪小图
            QRCodePaperImage ->> ImageCompare: 以qrCodeWidth配准后裁剪的4个小纸纹图
            ImageCompare ->> QRCodePaperImage: verifiImg.cutImgs(qrCodeWidth, cutWidth, cutHeight, padding)
            QRCodePaperImage ->> QRCodePaperImage: calcCutImage 裁剪小图
            QRCodePaperImage -->> ImageCompare: 以qrCodeWidth配准后裁剪的4个小纸纹图
        end
        rect rgb(233,233,254)
        Note over ImageCompare, PreprocessImageTool: 对裁剪的纸纹图进行图像算法处理(sobel、高斯...)
            ImageCompare ->> QRCodePaperImage: regImage.preProcess()
            QRCodePaperImage ->> PreprocessImageTool: preProcessBatching(cutImages, direction = 'xy')
            loop img:cutImages
                PreprocessImageTool ->> PreprocessImageTool: preProcess(ppImg, direction='xy')
                PreprocessImageTool ->> PreprocessImageTool: 图像处理（sobel、高斯...）
            end
            PreprocessImageTool -->> QRCodePaperImage : 图像处理完成的4个纸纹图 regImages

            ImageCompare ->> QRCodePaperImage: verifiImg.preProcess()
            QRCodePaperImage ->> PreprocessImageTool: preProcessBatching(cutImages, direction = 'xy')
            loop img:cutImages
                PreprocessImageTool ->> PreprocessImageTool: preProcess(ppImg, direction='xy')
                PreprocessImageTool ->> PreprocessImageTool: 图像处理（sobel、高斯...）
            end
            PreprocessImageTool -->> QRCodePaperImage : 图像处理完成的4个纸纹图 verifiImages
        end

        rect rgb(233,233,254)
        Note over testCase, PreprocessImageTool: 对裁剪的纸纹图进行图像算法处理(sobel、高斯...)
            ImageCompare ->> ImageCompare: batchingCompareImgs(regImages, verifiImages)
            ImageCompare ->> opencv : cv.matchTemplate(img1, img2, cv.TM_CCOEFF_NORMED)
            opencv -->> ImageCompare:  相关系数集合
            ImageCompare -->>- testCase: 返回上、下、左、右、上下、下上、左右、右左的相关系数值
        end
        testCase ->> TestReport: addResultDetails 记录每组比对的详细信息
        TestReport ->> TestReport: saveCompareImage 保存过程图片
    end
end
testCase -> testCase: 对整体结果计算直方图并show
testCase ->> TestReport: addResultSummary 记录实验整体结果信息
testCase ->> TestReport: save 保存测试报告
```


#### 使用说明
###### 1、GUI
可以直接执行gui.py，在界面中配置比对的注册图、核验图，以及算法参数
![](./gui.png)

###### 2、直接代码编写testCase
testCase.py 中已经提供单组、批量比对方法：
```python
# 单组图片对比, 不会生成测试报告，只是把过程图片都show出来
def singleTest(regFilePath, verifiFilePath)

# 批量比对，中间过程不显示对比图，最后生成指定的测试报告
# regFiles 注册图列表
# verifiFiles 核验图列表
def batcingTest(regFiles, verifiFiles, reportRootPath, onlySameCompare = False, testDesc=''):
```

具体使用方式可以参考下面case写法:
```python
# --------------下面都是测试用例--------------------------------------------------------------------------------------  
# 获取指定文件夹下的所有tiff文件
def listTiffFiles(folder_path, pattern = "", no_pattern = ""):
    listfiles = []
    for file in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file)
        if os.path.isfile(file_path) and (file.endswith(".tiff")  or file.endswith(".tif")):
            if pattern == "" or (pattern != "" and file.find(pattern) > -1) :
                if no_pattern == "" or file.find(no_pattern) < 0 :
                    # 在这里对每个文件进行操作，例如打印文件路径
                    print(file_path)
                    listfiles.append(file_path)

    return sorted(listfiles)

# single file test  case
def singleTestCase() :
    fileReg = "/Users/miaojun/Desktop/ppimg/new/1/dng/629/0001_1_629_J0.tiff"
    fileVerifi = "/Users/miaojun/Desktop/ppimg/new/1/dng/629/0001_1_629_J0_180_1.tiff"
    singleTest(fileReg, fileVerifi)

def batchingTestCase() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/sun3/","j0")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/sun3/","j2")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/sun3/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath)

def batchingTestCase2() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/11/20230621/","J0")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/new/11/20230621/","J2")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/ppimg/new/11/20230621/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath)

# 二维码不清晰、识别失败 case
def batchingTestCase3() :
    regFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/sgy000010/","j0")
    verifiFiles = listTiffFiles("/Users/miaojun/Desktop/ppimg/sgy000010/","j2")
    # /Users/miaojun/Desktop/ppimg/new
    reportRootPath = "/Users/miaojun/Desktop/ppimg/sgy000010/" # 测试报告的根目录
    batcingTest(regFiles, verifiFiles, reportRootPath)

# 测试代码，用于显示测试保存的纸纹图
def showCutTiff():
    regFile = "/Users/miaojun/Desktop/ppimg/new/11/20230621/report-20230705170608/img/0/regArea1.tiff"
    verifiFile = "/Users/miaojun/Desktop/ppimg/new/11/20230621/report-20230705170608/img/0/verifiArea1.tiff"
    regImg = cv.imread(regFile, cv.IMREAD_UNCHANGED)
    verImgImg = cv.imread(verifiFile, cv.IMREAD_UNCHANGED)
    showSmallCutImgCompare(regImg, verImgImg, "compare")
    return
# --------------上面都是测试用例--------------------------------------------------------------------------------------  

# singleTestCase()
# showCutTiff()
batchingTestCase2()
```

#### 测试报告
批量测试时会产生测试报告，报告为markdown文档，发布前可以手动编辑内容，可以使用工具导出pdf进行发布。
测试报告内容及样式，可以参考./report-sample.zip内容