"""
二维码图片识别
"""
import cv2 as cv
import numpy as np
import zxingcpp
import copy
import util
import PylabShowTool
# 使用微信工具解析二维码，效果比opencv自带的detectAndDecode好
def scanQRCodeWX(img) :
    # 先做一下图像模糊，二维码更容易识别
    img = cv.blur(img, (6, 6))
    # 创建微信识别脚本 (微信接口需要安装: pip3 install opencv-contrib-python)
    detect_obj = cv.wechat_qrcode_WeChatQRCode()
    # 使用脚本识别二维码坐标
    res, points = detect_obj.detectAndDecode(img)
    res = np.array(res)
    if len(res) == 0:
        #print("scanQRCodeWX parseQRCode failed...")
        return "", []
    # tuple 转数组int32位
    # points = np.array(points).astype('int32')
    points = np.int32(points)
    points = points[0]
	# 转成 左下、左上、右上、右下
    return res[0], [[points[3].tolist(),points[0].tolist(),points[1].tolist(),points[2].tolist()]]

# 原生opencv自带二维码识别，识别率低于微信，但顶点准确
def scanQRCodeOpencv(img) :
    # 创建二维码检测器对象
    detector = cv.QRCodeDetector()
    # 使用原始图检测二维码
    data, points, extData = detector.detectAndDecode(img)
        # 原始图识别失败
    if points is None:
        _img = cv.blur(img, (6, 6))
        data, points, extData = detector.detectAndDecode(_img)
    # 原始图识别失败
    if points is None:
        # 使用处理后的图检测二维码
        # 阈值化处理
        ret, thresh = cv.threshold(img, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)
        # 形态学操作
        kernel = cv.getStructuringElement(cv.MORPH_RECT, (5, 5))
        _img = cv.morphologyEx(thresh, cv.MORPH_OPEN, kernel)
        data, points, extData = detector.detectAndDecode(_img)
        # 处理后的图识别失败
        if points is None:
           # print("scanQRCodeOpencv parseQRCode failed...")
            points = []
            return "", [], ()
    shape = ()
    if extData is not None:
        shape = extData.shape
    # tuple 转数组int32位
    points = np.int32(points)
    # 转成 左下、左上、右上、右下
    points = points[0]
    return data, [[points[3].tolist(),points[0].tolist(),points[1].tolist(),points[2].tolist()]], shape

# 使用zxingcpp工具解析二维码，效果比opencv自带的detectAndDecode好
def scanQRCodeZXingCpp(img) :
    results = zxingcpp.read_barcodes(img)
    # 如果识别不出来，腐蚀操作后再试一次
    if len(results) == 0:
       # print("scanQRCodeZXingCpp parseQRCode failed by zxingCpp..., cv.erode and retry...")
        kernel = np.ones((3,3),np.uint8)
        _img = cv.erode(img,kernel,iterations = 1)
        results = zxingcpp.read_barcodes(_img)

    for result in results:
        points = [[[result.position.bottom_left.x,result.position.bottom_left.y],[result.position.top_left.x,result.position.top_left.y],[result.position.top_right.x,result.position.top_right.y],[result.position.bottom_right.x,result.position.bottom_right.y]]]

    if len(results) == 0:
        #print("scanQRCodeZXingCpp parseQRCode failed too after cv.erode...")
        return "", []
    return result.text, points

# 解析二维码,返回二维码内容和四个顶点（左下、左上、右上、右下）
def parseQrCodeImage(srcImg):
    _srcImg = srcImg
    # 1、识别二维码，获取顶点位置
    # 如果image 不是uint8的，需要转一下
    if srcImg.dtype != 'uint8':
        _srcImg = util.img2U8(_srcImg)
    qrText = ""
    points = []
    qrShape = ()

    # 识别二维码，优先顺序：opencv、zxingcpp、微信
    qrText, points, qrShape = scanQRCodeOpencv(_srcImg)
    # zxingcpp 部分反光图zxingcpp识别二维码顶点右下角偏差有点大，暂时不用
    # if qrText == "" or points == []:
    #     print("parse qrcode failed, next use zxingcpp...")
    #     qrText, points = scanQRCodeZXingCpp(_srcImg)
    if qrText == "" or points == []:
        #print(" parse qrcode failed, next use weixin...")
        # img = copy.deepcopy(_srcImg)
        qrText, points = scanQRCodeWX(_srcImg)
    return qrText, points, qrShape

# 计算二维码block宽度, 一排的block个数
def calcBlockwidth(calcBlockImg, targetPoints, qrCodeWidth, qrShape):
    # 是否计算成功
    calcSucess = False

    # 默认值为二维码边长除以21
    blockWidth = qrCodeWidth / 21
    # 根据shape计算blockWidth
    if qrShape is not None and len(qrShape) != 0:
        blockWidth = round(qrCodeWidth / qrShape[0], 3)
        #print('blockWidth by shape:', blockWidth)
        return blockWidth, qrShape[0]
    # 将校准后的二维码裁剪
    leftTop = targetPoints[1]
    rightTop = targetPoints[2]
    leftBottom = targetPoints[0]
    rightBottom = targetPoints[3]

    # 留边，防止校准误差导致二维码裁剪不全
    calcPadding = 10
    leftTop = [leftTop[0] - calcPadding, leftTop[1] - calcPadding]
    rightTop = [rightTop[0] + calcPadding, rightTop[1] - calcPadding]
    leftBottom = [leftBottom[0] - calcPadding, leftBottom[1] + calcPadding]
    rightBottom = [rightBottom[0] + calcPadding, rightBottom[1] + calcPadding]

    # 计算裁剪矩形的宽度和高度
    width = int(((rightTop[0] - leftTop[0]) + (rightBottom[0] - leftBottom[0])) / 2)
    height = int(((leftBottom[1] - leftTop[1]) + (rightBottom[1] - rightTop[1])) / 2)
    # 裁剪图片
    qrcodeImgCut = calcBlockImg[leftTop[1]:leftTop[1] + height, leftTop[0]:leftTop[0] + width]
    # 如果image 不是uint8的，需要转一下
    qrcodeImg = qrcodeImgCut
    if qrcodeImgCut.dtype != 'uint8':
        qrcodeImg = util.img2U8(qrcodeImgCut)
    # 进行二值化处理
    ret, binary_image = cv.threshold(np.uint8(qrcodeImg), 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)
    # 图像腐蚀，使轮廓更加完整
    kernel = np.ones((3,3),np.uint8)
    erode_image = cv.erode(binary_image, kernel, iterations=1)
    # 寻找轮廓
    contours, hierarchy = cv.findContours(erode_image, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
    hierarchy = hierarchy[0]
    # 轮廓中有两个子轮廓的轮廓可能为二维码角点位置
    tempindex1 = 0
    tempindex2 = 0
    vin = []
    for i in range(0, len(contours)):
        # hierarchy数组中的值分别表示[Next, Previous, First_Child, Parent] First_Child =-1 表示没有子轮廓
        if hierarchy[i][2] == -1:
            continue
        else:
            tempindex1 = hierarchy[i][2]
        # 子轮廓没有子轮廓
        if hierarchy[tempindex1][2] == -1:
            continue
        else:
            tempindex2 = hierarchy[tempindex1][2]
            # 记录第i个轮廓，的子轮廓是第tempindex1个轮廓，子轮廓的子轮廓是第tempindex2个轮廓
            vin.append((i, tempindex1, tempindex2))
    for v in vin:
        contour1 = contours[v[1]]
        contour2 = contours[v[2]]
        # 计算轮廓周长
        lenth1 = cv.arcLength(contour1, True)
        lenth2 = cv.arcLength(contour2, True)
        # 排除过大轮廓
        if (lenth2 != 0) and (abs(lenth1 / lenth2 - 2) > 1):
            vin.remove(v)

    if len(vin) != 0:
        # 位置探测图形中心点坐标
        points = []
        # 识别到的回字x、y坐标集合
        axisList = []
        for v in vin:
            m = cv.moments(contours[v[1]])
            # 'm00'：零阶原始矩（Raw Moment），表示图像的总能量或面积。它计算了图像中所有非零像素的数量。
            # 'm01'：一阶原始矩（Raw Moment），表示图像在 y 轴方向上的质心位置。通过计算每个像素的 y 坐标与亮度值的乘积，并将其相加来获得该值。
            # 'm10'：一阶原始矩（Raw Moment），表示图像在 x 轴方向上的质心位置。通过计算每个像素的 x 坐标与亮度值的乘积，并将其相加来获得该值。
            #一阶原始矩 m10 表示图像在 x 轴方向上的质心位置，而零阶原始矩 m00 表示图像的总能量或面积。通过计算 m10 和 m00 的比值，得到图像质心位置相对于图像的横向中心位置的偏移量
            cx = np.intp(m['m10'] / m['m00'])
            cy = np.intp(m['m01'] / m['m00'])
            if (cx, cy) not in points:
                points.append((cx, cy))
                axisList.append(cx)
                axisList.append(cy)

        # 根据3个回字坐标，分别计算blockwidth,求平均值
        calcblockList = []
        for axis in axisList:
            # 较小的坐标，距离二维码边缘3.5block
            if (axis - calcPadding) < (qrCodeWidth / 2):
                tempBlock = round((axis - calcPadding) / 3.5, 3)
            # 较大的坐标，二维码宽度-该坐标 = 3.5block
            else:
                tempBlock = round((qrCodeWidth - axis + calcPadding) / 3.5, 3)
            calcblockList.append(tempBlock)
        blockWidth = np.mean(calcblockList)
        # 定义二维码版本号和block关系(二维码一共40个版本，最小版本为21*21个block，版本号加1，边长增加4个block)
        blockSizeList = []
        for i in range(0,40):
            blockSizeList.append(21 + 4 * i)
        # 根据二维码宽度、通过寻找轮廓计算出的block宽度，近似计算二维码一行有多少block
        approxSize = qrCodeWidth / blockWidth
        # 计算近似block数与标准block数的差异
        diffValues = []
        for blockSize in blockSizeList:
            diffValues.append([abs(blockSize - approxSize), blockSize])
        # 匹配标准block数，重新计算blockWidth，减少误差
        minDiff = min(diffValues)
        blockSize = minDiff[1]
        blockWidth = round(qrCodeWidth / blockSize, 3)
        calcSucess = True

    # 打印计算结果
    # if calcSucess:
    #     print('block宽度:', blockWidth)
    # else:
    #     print('block宽度(二维码边长/21):%d' %(blockWidth))
    return blockWidth, blockSize
