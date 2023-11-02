'''
测试报告工具类
'''
from datetime import datetime
from statistics import mean
import numpy as np
import cv2 as cv
import os
import params
from PylabShowTool import show2Image, showImage, showResultHist, showSmallCutImgCompare
from ImageCompare import ImageCompare

class TestReport():
    mdFile = None # md文件
    reportFolder = None # 测试文件保存路径
    imgPath = None # 截图文件保存路径

    excepitonNum = 0 # 异常对比组数
    allCompareImageNum = 0 # 所有注册图、核验图对比组数
    titleText = "" # md标题文本
    testSceneText = "" # 测试场景描述
    fileListText = "" # 注册图、核验图文件清单文本
    cutSampleImageText = "" # 裁剪示例图文本
    testParamsText = "" # 测试参数文本
    testDetailText = "" # 测试每组图片对比详情文本
    exceptionText = "" # 比对异常信息文本
    summaryText = "" # 测试结果摘要信息文本
    
    mDetailFile = None # 输出的详情结果文件
    testDetailFileText = "" # 这个是将详细数据输出到另一个详情文件中，不在测试报告文件中
    summaryDetailFileText = "" # 这个是将总结果详细数据输出到另一个详情文件中，不在测试报告文件中

    def __init__(self):
        return
    
    # 创建测试报告
    # rootPath 测试报告根目录，在在此目录下创建 "rootPath/report+时间/" 的报告文件夹
    def create(self, rootPath):
        current_time = datetime.now()
        # 格式化当前时间
        formatted_time = current_time.strftime('%Y%m%d%H%M%S')
        fileName = "%sreport-%s/testreport.md"%(rootPath, formatted_time)
        folder_path = os.path.dirname(fileName)
        self.mdFile = fileName
        self.mDetailFile = "%sreport-%s/detaildata.md"%(rootPath, formatted_time)
        self.reportFolder = folder_path

        os.makedirs(folder_path, exist_ok=True) # 创建测试报告目录
        self.imgPath = folder_path + "/img/" ##  创建测试截图文件存储文件夹
        os.makedirs(self.imgPath, exist_ok=True)
        print("create report folder : %s"%folder_path)
        return

    # 设置测试title
    def setTestTitle(self, title):
        self.titleText = title
        return
    
    # 设置测试场景
    def setTestSceneText(self, testSceneText):
        self.testSceneText = testSceneText
        return

    # 记录注册图、核验图清单
    def addImageList(self, regFileList, verifiFileList):
        regFilesStr = ""
        for fileName in regFileList:
            regFilesStr += fileName + "\n"

        verifiFilesStr = ""
        for fileName in verifiFileList:
            verifiFilesStr += fileName + "\n"

        self.fileListText = '''
#### 实验图片素材
注册图[%d]:
%s

核验图[%d]:
%s
''' % (len(regFileList), regFilesStr, len(verifiFileList), verifiFilesStr)
        return


    # 记录裁剪图示例，传入文件名即可，不要传全路径, 程序会取 ./img/下面的文件名
    def addCutSampleImg(self, imgName):
        # 纸纹区域裁剪示例
        self.cutSampleImageText = '''
#### 纸纹区域裁剪示例
![纸纹区域裁剪示例图](./img/%s)
###### 报告中每组比对结果数据规则:
r、v分别表示注册图、核验图；1234分别表示标识的纸纹区
- <font color="red">相同区域依次为(共4组): [r1:v1], [r2:v2], [r3:v3], [r4:v4]</font>
- <font color="red">不同区域依次为(共12组): [r1:v234], [r2:v134], [r3:v124], [r4:v123]</font>
'''%imgName

        return
# 二维码透射变换配准后，按照二维码上下左右顺序裁剪1、2、3、4号区域,后面报告中涉及区域编号以此为依据

    # 记录实验参数
    def addTestParams(self, params):
        self.testParamsText = '''
#### 实验相关参数
```
%s
```
- RECALCULATE_THRESHOLD: 需要平移计算的阈值范围
- QRCODE_WIDTH: -1 表示配准时以注册图、核验图二维码边长较小的为基准，大于0表示以指定value为基准配准
- CUT_SIZE: padding 裁剪与二维码之间的留白, 值为二维码block宽度的倍数；width为裁剪矩形长边 -1表示取二维码边长；height为裁剪矩形短边，值为二维码block宽度的倍数
- MATCH_POSITION: 核验图裁剪的纸纹图在注册图相应区域做像素位移的比较（模版匹配），表示模版匹配上下左右移动的像素距离
- GAUSSIAN: 高斯模糊kernel size，sigma
'''%params

        return

    # 注册图7个， 核验图10个
    # 注册图与核验图共对⽐70组，560个纸纹图计算相关系数 
    # 共耗时9248.66 ms 结果异常的有2组图⽚
    # 记录实验结果直方图

    # 记录实验结果摘要
    # histImgPath: 直方图存放名称，不要传全路径，程序自动从 ./img/ 目录下获取
    # regFilesLen 注册图数量
    # verifiFilesLen 核验图数量
    # calcCount 注册图、核验图对比组数
    # smallCount 裁剪的纸纹图计算相关系数组数
    # costTime 测试共耗时 ms
    # exceptionNum 注册图、核验图对比有数据异常的组数
    def addResultSummary(self, allResultsTrue, allResultsFalse, histImgPath, regFilesLen,verifiFilesLen, calcCount, smallCount, costTime, exceptionNum):
        trueMin = min(allResultsTrue) if len(allResultsTrue) > 0 else 0
        trueAvg = mean(allResultsTrue) if len(allResultsTrue) > 0 else 0
        falseMax = max(allResultsFalse) if len(allResultsFalse) > 0 else 0
        span = (trueMin - falseMax)
        resultStr = "真图平均 [%.3f]，真图最小 [%.3f]，假图最大 [%.3f]， 真假间隔 [%.3f]"%(trueAvg,trueMin,falseMax,span)

        self.summaryText = '''
注册图 <font color="red">%s</font> 张，核验图 <font color="red">%s</font> 张
注册图与核验图共对⽐ <font color="red">%s</font> 组, 裁剪的纸纹图对比计算 <font color="red">%s</font> 个
结果异常的有 <font color="red">%s</font> 组图⽚
整个测试共耗时 <font color="red">%.1f</font> S
计算结果: <font color="red">%s</font>
- 真图: 同一纸张不同照片的相同区域为“真图”
- 假图: 不同纸张、不同区域都为“假图”
  
![测试结果直方图](./img/%s)
'''%(regFilesLen,verifiFilesLen, calcCount, smallCount, self.excepitonNum, costTime,resultStr, histImgPath)

        # start 将总结果输出到详细结果文件中
        self.summaryDetailFileText = '''
#### 整体结果:
真图:
%s

假图: 
%s
'''%(', '.join(str(item) for item in allResultsTrue), ', '.join(str(item) for item in allResultsFalse))
        # end 将总结果输出到详细结果文件中
        return

    # 记录解析二维码异常
    def addParseException(self, imageCompare : ImageCompare, index):
        parseFailed = ""
        if imageCompare.regImage.parseStatus == False:
            parseFailed = "注册图 "
        if imageCompare.verifiImg.parseStatus == False:
            parseFailed += "核验图 "
        # begin 这一段仅仅是打印日志用
        print("%d. %s"%(index, parseFailed))
        print("注册图:%s"%imageCompare.regImage.filePath)
        print("核验图:%s"%imageCompare.verifiImg.filePath)
        print("")
        # end 这一段仅仅是打印日志用

        # 二维码识别异常，先保存图片
        savePath = "%s%s/"%(self.imgPath, index)
        os.makedirs(savePath, exist_ok=True) # 创建测试图片的目录
        show2Image(imageCompare.regImage.originImage,imageCompare.verifiImg.originImage,imageCompare.regImage.filename,imageCompare.verifiImg.filename, (10,5), "%sorigin.png"%savePath)

        # 每组对比图的文件夹
        exceptionText = '''
%d. <font color='red'>%s二维码解析失败</font>
```
注册图: %s
核验图: %s
```
![原图比对](./img/%s/%s)
'''%(index, parseFailed, imageCompare.regImage.filePath, imageCompare.verifiImg.filePath, index, "origin.png")
        self.testDetailText += exceptionText
        self.allCompareImageNum += 1

        self.exceptionText += exceptionText
        self.excepitonNum += 1
        return 

    # 记录实验详细数据
    def addResultDetails(self, imageCompare : ImageCompare, index):
        # begin 这一段仅仅是打印日志用
        print("%d. %s"%(index, "相同的二维码标签" if imageCompare.isSame() else "不同二维码标签"))
        print("注册图:%s"%imageCompare.regImage.filePath)
        print("核验图:%s"%imageCompare.verifiImg.filePath)
        print("相同区域:%s"%imageCompare.showTrueResults)
        print("不同区域:%s"%imageCompare.showFlaseResults)
        print("")
        # end 这一段仅仅是打印日志用

        resultsTrue = imageCompare.trueResults
        resultsFalse = imageCompare.falseResults
        isSamePaper = imageCompare.isSame()
        trueStr, falseStr, summaryStr = formatDetail(resultsTrue, resultsFalse, isSamePaper)

        if isSamePaper:
            isSamePaperStr = "<font color='green'>相同的二维码标签</font>"
        else :
            isSamePaperStr = "<font color='red'>不同的二维码标签</font>"

        detailStr = '''
%d. %s, 相关图片放在[./img/%s/]
- 注册图: %s
- 核验图: %s
- regQrCodeWidth[%d], verifiQrCodeWidth[%d], use qrCodeWidth[%d], regQrCodeBlock[%d], verifiQrCodeBlock[%d] 
- 相同区域: %s
- 不同区域: %s
%s
'''%(index, isSamePaperStr, index, imageCompare.regImage.filePath,imageCompare.verifiImg.filePath, imageCompare.regImage.qrWidthOrigin, imageCompare.verifiImg.qrWidthOrigin, imageCompare.regImage.qrWidth,imageCompare.regImage.qrBlockWidth,imageCompare.verifiImg.qrBlockWidth, trueStr,falseStr, summaryStr)
        self.testDetailText += detailStr
        self.allCompareImageNum += 1

        # start 这个是输出到另一份只有详情数据的文件中，用于其他地方获取数据来验证结果
        detailFileStr = '''
%s
%s
%s
'''%(detailStr, ', '.join(str(item) for item in resultsTrue),', '.join(str(item) for item in resultsFalse))
        self.testDetailFileText += detailFileStr
        # end 这个是输出到另一份只有详情数据的文件中，用于其他地方获取数据来验证结果

        # 是否有异常
        exceptionImages = hasException("%s%s/"%(self.imgPath, index), imageCompare)
        # 保存相关的对比图片信息
        saveCompareImage("%s%s/"%(self.imgPath, index), imageCompare)

        # 如果有异常，同时显示异常的对比图信息
        if (imageCompare.isResultException()) : 
            exceptionText = detailStr
            exceptionText += "![裁剪图](./img/%s/cutImage.png)\n"%(index)
            exceptionText += "![直方图](./img/%s/compareHist.png)\n"%(index)
            for i in range(len(exceptionImages)):
                exceptionText += "![](./img/%s/%s)\n"%(index, exceptionImages[i])
            self.exceptionText += exceptionText
            self.excepitonNum += 1
        return

    # 保存测试报告
    def save(self, fileName = ""):
        # self.mdFile.close()
                # 获取当前测试时间
        current_time = currentTimeStr()
        print("create test report ", fileName)
        # 报告标题部分
    
        title = '测试报告' if self.titleText == "" else self.titleText
        # 报告标题部分
        mdText = '''
# <center>%s<center>
<center>测试时间: %s</center>
#### 测试场景:
%s
'''%(title, current_time, self.testSceneText)

        # 裁剪示例图文本
        mdText += self.cutSampleImageText

        # 图片清单部分
        mdText += self.fileListText

        # 测试参数文本
        mdText += self.testParamsText

        # 测试结果
        mdText += '''
#### 测试结果总结
'''
        mdText += self.summaryText

        if self.exceptionText != None:
            mdText += '''
#### 异常结果信息[%s组图片]
<font color = red>真图比对最小相关系数小于[%s] </font>或 <font color = red>假图比对相关系数大于[%s]</font>  或 <font color = red>真图、假图相关系数间隔小于[%s]</font> 的记为异常
%s
'''%(self.excepitonNum, params.EXCEPITON_MIN_TRUE,params.EXCEPITON_MAX_FALSE,params.EXCEPITON_SPAN, self.exceptionText)


        mdText += '''
#### 所有核验图与注册图对比组结果清单[共%s组]
%s
'''%(self.allCompareImageNum, self.testDetailText)

        self.writeto(self.mdFile, mdText, 'w')
        print("test report save to [%s]"%self.mdFile)

        # 图片清单部分
        detailText = self.fileListText
        # 将详细结果写入另一个详情文件中
        detailText += self.summaryDetailFileText
        #### 每组图的详细结果:
#         detailText += '''
# #### 每组图的详细结果:
# '''
#         detailText += self.testDetailFileText
        self.writeto(self.mDetailFile, detailText, 'w')
        print("test detail result save to [%s]"%self.mDetailFile)

        return 

    # 写入文件内容
    def writeto(self, file, md_text, mode = 'a'):
        # with open(file, mode) as f:
        with open(file, mode, encoding='utf-8') as f:
            f.write(md_text)
        return

# 格式化详情数据显示
def formatDetail(resultsTrue, resultsFalse, isSameImage):
    trueStr = ""
    falseStr = ""
    summaryStr = ""
    # 如果注册图、核验图是同一张纸（真图）
    if (isSameImage):
        for result in resultsTrue:
            if  result < params.EXCEPITON_MIN_TRUE:
                trueStr += "<font color='red'>%s</font>, " % result
            else:
                trueStr += "%.3f, " % result
        if len(trueStr) > 0:
            trueStr = trueStr[:-2]

        for result in resultsFalse:
            if  result > params.EXCEPITON_MAX_FALSE:
                falseStr += "<font color='red'>%s</font>, " % result
            else:
                falseStr += "%.3f, " % result
        if len(falseStr) > 0:
            falseStr = falseStr[:-2]

        avgTrue = mean(resultsTrue)
        minTrue = min(resultsTrue)
        maxFalse = max(resultsFalse)
        span = np.around((minTrue - maxFalse), decimals = 2)
        if(avgTrue <  params.EXCEPITON_MIN_TRUE):
              summaryStr += "<font color='red'>avgTrue[%.3f]</font>, " %avgTrue 
        else :
            summaryStr += "avgTrue[%.3f], " %avgTrue
        if(minTrue <  params.EXCEPITON_MIN_TRUE):
              summaryStr += "<font color='red'>minTrue[%.3f]</font>, " %minTrue 
        else :
            summaryStr += "minTrue[%.3f], " %minTrue
        if maxFalse >  params.EXCEPITON_MAX_FALSE:
              summaryStr += "<font color='red'>maxFalse[%.3f]</font>, " %maxFalse 
        else :
            summaryStr += "maxFalse[%.3f], " %maxFalse
        if span < params.EXCEPITON_SPAN:
              summaryStr += "<font color='red'>span[%.3f]</font>" %span 
        else :
            summaryStr += "span[%.3f]" %span
    else: # 如果是注册图、核验图不是一张纸（假图），那么所有区域比对都是假图，不需要判断真图阈值
        for result in resultsTrue:
            if  result > params.EXCEPITON_MAX_FALSE:
                trueStr += "<font color='red'>%.3f</font>, " % result
            else:
                trueStr += "%.3f, " % result
        if len(trueStr) > 0:
            trueStr = trueStr[:-2]

        for result in resultsFalse:
            if  result > params.EXCEPITON_MAX_FALSE:
                falseStr += "<font color='red'>%.3f</font>, " % result
            else:
                falseStr += "%.3f, " % result
        if len(falseStr) > 0:
            falseStr = falseStr[:-2]
        maxFalse = max(np.concatenate((resultsTrue, resultsFalse)))
        if maxFalse >  params.EXCEPITON_MAX_FALSE:
              summaryStr += "<font color='red'>maxFalse[%.3f]</font>" %maxFalse
        else :
            summaryStr += "maxFalse[%s]" %maxFalse
    return trueStr, falseStr, summaryStr

# 保存tiff图
def saveTiff(srcImg, savePath):
    cv.imwrite(savePath, srcImg, [cv.IMWRITE_TIFF_COMPRESSION, 1])
    return 

# 是否对比图有异常
def hasException(imgRootPath, imageCompare : ImageCompare):
    testPath = imgRootPath
    os.makedirs(testPath,  exist_ok=True) # 创建测试图片的目录
    # 保存的异常图片
    saveExceptionImages = []
    regCutImgs = imageCompare.regImage.ppCutImages
    verifiCutImgs = imageCompare.verifiImg.ppCutImages
    resultsTrue = imageCompare.trueResults
    resultsFalse = imageCompare.falseResults
    notSameIndex = imageCompare.notSameIndex
    # 如果是真图
    if (imageCompare.isSame()):
        # 纸纹小图低于阈值的，报异常的对比图保存下来
        for i in range(len(resultsTrue)):
            if (resultsTrue[i] <= params.EXCEPITON_MIN_TRUE):
                showSmallCutImgCompare(regCutImgs[i], verifiCutImgs[i], "area%s [%s]"%((i+1),resultsTrue[i]), "%scompare_area%d.png"%(testPath, (i+1)))
                saveExceptionImages.append("compare_area%d.png"%(i+1))
    else : # 假图(不是同一张纸，相同区域也是假图)，
        # 纸纹小图低于阈值的，报异常的对比图保存下来
        for i in range(len(resultsTrue)):
            if (resultsTrue[i] >= params.EXCEPITON_MAX_FALSE):
                showSmallCutImgCompare(regCutImgs[i], verifiCutImgs[i], "area%s [%s]"%((i+1),resultsTrue[i]), "%scompare_area%d.png"%(testPath, (i+1)))
                saveExceptionImages.append("compare_area%d.png"%(i+1))

    # 1-2,2-1,3-4,4-3 不同区域比对的顺序  TODO
    for i in range(len(resultsFalse)):
        if (resultsFalse[i] >= params.EXCEPITON_MAX_FALSE):
            index = notSameIndex[i] # 形如 1-2，第一位为注册图纸纹图下标，第三位为核验图纸纹图下标
            regIndex = np.int32(index[0]) - 1
            verifiIndex = np.int32(index[2]) - 1
            showSmallCutImgCompare(regCutImgs[regIndex], verifiCutImgs[verifiIndex], "area%d-%d [%s]"%((regIndex+1),(verifiIndex+1),resultsFalse[i]), "%scompare_area%d-%d.png"%(testPath, (regIndex+1),(verifiIndex+1)))
            saveExceptionImages.append("compare_area%d-%d.png"%((regIndex+1),(verifiIndex+1)))
    return saveExceptionImages

# 保存注册图、核验图对比过程相关图片
def saveCompareImage(imgRootPath, imageCompare : ImageCompare):
    regFileName = imageCompare.regImage.filename
    verifiFileName = imageCompare.verifiImg.filename
    testPath = imgRootPath
    os.makedirs(testPath,  exist_ok=True) # 创建测试图片的目录

    regCutImgs = imageCompare.regImage.ppCutImages
    verifiCutImgs = imageCompare.verifiImg.ppCutImages
    #  显示直方图
    if params.SAVE_COMPARE_HIST_IMAGE or imageCompare.isResultException():
        detail = "%s\n%s" %(imageCompare.trueResults, imageCompare.falseResults)
        showResultHist(imageCompare.trueResults, imageCompare.falseResults,"regImage:%s\nverifiImage:%s"%(regFileName, verifiFileName), detail, savePath="%scompareHist.png"%testPath)

    # 显示原始的图
    if params.SAVE_ORIGIN_IMAGE:
        show2Image(imageCompare.regImage.originImage, imageCompare.verifiImg.originImage, regFileName, verifiFileName, size=(10,5), savePath="%sorigin.png"%testPath)

    # 显示裁剪的图
    if params.SAVE_CUT_IMAGE or imageCompare.isResultException():
        show2Image(imageCompare.regImage.cutShowImage, imageCompare.verifiImg.cutShowImage, regFileName, verifiFileName, size=(10,5), savePath="%scutImage.png"%testPath)

    # 保存裁剪后的纸纹小图的tiff图
    if params.SAVE_TIFF_PPIMAGE:
        for i in range(len(regCutImgs)):
                saveTiff(regCutImgs[i], "%sregArea%d.tiff"%(testPath, (i+1)))
                saveTiff(verifiCutImgs[i], "%sverifiArea%d.tiff"%(testPath, (i+1)))
    return

# 获取当前时间的格式化串
def currentTimeStr():
    # 获取当前时间
    current_time = datetime.now()

    # 格式化当前时间
    formatted_time = current_time.strftime('%Y-%m-%d %H:%M:%S')
    return formatted_time