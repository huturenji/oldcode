# 提供给pcdemo使用的sdk
import argparse
from numpy import mean
import os
import QRCodeParser
import util
import shutil
import PaperPrintCompare
import params
import hashlib
import cv2
import json
import time
import copy
import params
# 注册图保存根路径
# ROOT_PATH = "/Users/miaojun/Desktop/pcdemo/root/"

USE_SMALL_IMAGE = False # 使用下采样一半的小图进行计算
USE_ORIGIN_IMAGE = True # 使用原图对比

# 根据临时图片路径，生成xxx_small.jpg的小图路径
def getSmallTempFilePath(tempPath):
    # /Users/miaojun/Desktop/pcdemo/1691404291567.jpg
    # /Users/miaojun/Desktop/pcdemo/1691404291567_small.jpg
    index = tempPath.rfind(".") # 查找后缀名.的位置
    return "%s_small%s"%(tempPath[:index],tempPath[index:])

#  ROOT_PATH：注册图存放根路径
# 将临时路径保存到注册图下
# tempPath: 注册图临时路径
# id: 外部指定的注册图标签ID，默认为空，如果传了id值，会以id为索引创建注册图，否则以二维码内容为索引
def saveRegistImage(ROOT_PATH,tempPath,id = ""):
    global USE_SMALL_IMAGE
    strRet = ""
    # 如果id参数不为空，会以id为索引创建注册图，否则以二维码内容为索引
    if id == "" :
        # 1、先解析二维码内容，暂定一物一码，二维码做hash，以hash值为文件夹名称
        try:
            # tempImg = util.loadPaperImage(tempPath)
            tempImg = util.halfImage(tempPath, gray=True) # 加载一半大小的图片, 这样二维码解析会快一些
        except  Exception as e:
            strRet = '{"code":-1,"message":"cannot load register file [%s]"}'%tempPath
            return strRet
        qrText, points, qrShape = QRCodeParser.parseQrCodeImage(tempImg)
        if qrText == "":
            strRet = '{"code":-1,"message":"parse register image failed [%s]"}'%tempPath
            return strRet
        strHash = str(hashlib.md5(str(qrText).encode('utf-8')).hexdigest())
    else :
        strHash = id

    folder = "%s/%s"%(ROOT_PATH, strHash)
    os.makedirs(folder, exist_ok=True) # 创建图片的目录
    # 2、将传入的临时jpg，mv 到注册图目录下
    filePath = "%s/%s.jpg"%(folder,strHash)

    # 如果使用小图计算的话，把下采样的图也保存一份
    if USE_SMALL_IMAGE:
        filePathSmall = "%s/%s_small.jpg"%(folder,strHash)
        if os.path.exists(filePathSmall):
            os.remove(filePathSmall)
            print("regist small file exists, overwrite it: %s"%filePathSmall)
        cv2.imwrite(filePathSmall, tempImg)
    #print("saveRegistImage qrText[%s], strHash[%s], tempPath[%s], mv to filePath[%s]"%(qrText, strHash, tempPath, filePath))

    # 如果注册图已经存在，覆盖
    if os.path.exists(filePath):
        os.remove(filePath)
        print("regist file exists, overwrite it: %s"%filePath)
    shutil.move(tempPath, filePath) # TODO 这里后面要 move，而不是copy
    # shutil.copy(tempPath, filePath)

    strRet = '{"code":0,"message":"register image success, resiger image path is %s","data":{"labelHash":"%s"}}'%(filePath,strHash)
    return strRet

# 核验图片
# ROOT_PATH：核验图存放根路径
# tempPath: 核验图临时路径，核验完成后会删除
# id: 标签ID，默认空，如果传了id值，会以id为索引去查找注册图，否则以二维码内容为索引
# return 0 核验成功，结果"真", 1 核验成功，结果"假", 2 未找到注册图, -1 核验图解析二维码失败
def verifiImage(ROOT_PATH,tempPath,id = ""):
    strRet = ""
    # 如果id参数不为空，会以id为索引去查找注册图，否则以二维码内容为索引
    if id == "" :
        try:
            # tempImg = util.loadPaperImage(tempPath)
            tempImg = util.halfImage(tempPath, gray=True) # 加载一半大小的图片, 这样二维码解析会快一些
        except  Exception as e:
            strRet = '{"code":-1,"message":"cannot open verify file [%s]"}'%tempPath
            return strRet
        qrText, points, qrShape = QRCodeParser.parseQrCodeImage(tempImg)
        # 核验图解析二维码失败
        if qrText == "":
            strRet = '{"code":-2,"message":"verifiImage failed, verifiy image parse qrcode failed"}'
            return strRet

        strHash = str(hashlib.md5(str(qrText).encode('utf-8')).hexdigest())
        # strHash = str(hash("%s"%(str(qrText))))
    else :
        strHash = id

    folder = "%s/%s"%(ROOT_PATH, strHash)
    #print("verifiImage qrText[%s], strHash[%s], tempPath[%s], folder[%s]"%(qrText, strHash, tempPath, folder))
    filePath = "%s/%s.jpg"%(folder,strHash) # 注册图文件路径
    if not os.path.exists(filePath): # 没找到注册图
        strRet = '{"code":2,"message":"verifiImage failed, find no regist image"}'
        return strRet

    code = 0
    message = ""
    strRet = '{"code":%d,"message":"%s","data":{"labelHash":"%s"}}'%(code,message,strHash)
    if USE_ORIGIN_IMAGE:
        code, message = compareImage(filePath, tempPath)
        # 核验完成后，删除临时核验图
        if os.path.exists(tempPath):
            os.remove(tempPath)
            # pass
        strRet = '{"code":%d,"message":"%s","data":{"labelHash":"%s"}}'%(code,message,strHash)

    # 启用小图对比
    if USE_SMALL_IMAGE:
        filePathSmall = "%s/%s_small.jpg"%(folder, strHash) # 注册图小图
        if os.path.exists(filePathSmall): # 注册图存在
            # 这里也要同时生成核验图小图
            verifiSmallPath = getSmallTempFilePath(tempPath)
            cv2.imwrite(verifiSmallPath, tempImg) # 把小图写到文件中
            smallCode, smallMessage = compareImage(filePathSmall, verifiSmallPath)
            # 核验完成后，删除临时核验图
            if os.path.exists(verifiSmallPath):
                os.remove(verifiSmallPath)
                # pass
        else:
            smallCode = 2
            smallMessage = "verifiImage small image failed, find no regist small image"
        strRet = '{"code":%d,"message":"%s","data":{"labelHash":"%s"}}'%(smallCode, smallMessage,strHash)

    return strRet

# 调用比对算法，regFiles注册图是数组，可能有多个，verifiFile 核验图只有一个
def compareImage(regFile, verifiFile):
    ret = PaperPrintCompare.imageCompare(regFile, verifiFile)
    # 如果二维码解析失败返回的是: ("qrCode parse failed", imageCompare)
    if type(ret).__name__ == 'tuple' and len(ret) == 2:
        # strRet = '{"code":-2,"message":"verifiImage failed, imageCompare parse qrcode failed..."}'
        code = -2
        message = "verifiImage failed, imageCompare parse qrcode failed..."
    else :
        # 否则从result中取出结果信息
        resultsTrue, resultsFalse, resultsTrueDertImg, resultsFalseDertImg, imageCompare = ret
        if calcuResult(resultsTrue):
            code = 0
            message = "verifiImage ok!!! resultsTrue[%s], resultsFalse[%s]"%(resultsTrue,resultsFalse)
        else :
            code = 1
            message = "verifiImage finished, not true image, resultsTrue[%s], resultsFalse[%s]"%(resultsTrue,resultsFalse)
    return code, message

# 评价计算结果，true 真，false 假
def calcuResult(resultsTrue):
    _resultsTrue = copy.copy(resultsTrue)
    minTrue = min(_resultsTrue)
    _resultsTrue.remove(minTrue)
    avgTrue = mean(_resultsTrue)

    return avgTrue >= params.MIN_TRUE

# 设置核验参数
# invoke '{"func": "setParams", "paramsData":{"QRCODE_ALGIN_FORCE":1,"MATCH_POSITION":2,"QRCODE_WIDTH":200,"CUT_PADDING":10,"CUT_HEIGHT":30}}'
# return '{"code":0,"data":{"QRCODE_ALGIN_FORCE":1,"MATCH_POSITION":2,"QRCODE_WIDTH":200,"CUT_PADDING":2,"CUT_HEIGHT":2}}'
def setParams(paramsData):
    print("setParams - %s"%paramsData)
    if type(paramsData).__name__ == 'str':
        try:
            jsonData = json.loads(paramsData)
        except Exception as e:
            jsonData = {}
    elif type(paramsData).__name__ == 'dict':
        jsonData = paramsData
    else:
        jsonData = {}

    QRCODE_ALGIN_FORCE = jsonData.get("QRCODE_ALGIN_FORCE")
    QRCODE_WIDTH = jsonData.get("QRCODE_WIDTH")
    CUT_PADDING = jsonData.get("CUT_PADDING")
    CUT_HEIGHT = jsonData.get("CUT_HEIGHT")
    MATCH_POSITION = jsonData.get("MATCH_POSITION")

    if QRCODE_ALGIN_FORCE != None :
        params.QRCODE_ALGIN_FORCE = QRCODE_ALGIN_FORCE
    if MATCH_POSITION != None :
        params.MATCH_POSITION = MATCH_POSITION
    if QRCODE_WIDTH != None :
        params.QRCODE_WIDTH = QRCODE_WIDTH
    if CUT_PADDING != None :
        params.CUT_SIZE[0] = CUT_PADDING
    if CUT_HEIGHT != None :
        params.CUT_SIZE[2] = CUT_HEIGHT

    # 设置完成后查询最新的参数并返回
    afterSetParams = queryParams()
    print("setParams - after: %s"%afterSetParams)
    return afterSetParams

# 查询参数设置
# invoke '{"func": "queryParams"}'
# return '{"code":0,"data":{"QRCODE_ALGIN_FORCE":1,"MATCH_POSITION":2,"QRCODE_WIDTH":200,"CUT_PADDING":10,"CUT_HEIGHT":30}}'
# QRCODE_ALGIN_FORCE 1 强制二维码配准，0 优先orb配准
# MATCH_POSITION 裁建的纸纹图比对的位移像素个数
# QRCODE_WIDTH 透视变换时二维码基准边长, -1 表示以注册图大小为准，否则以指定值为基准,如200、300 
# CUT_PADDING 裁剪纸纹图距离二维码的距离, 负整数表示block的倍数，如-1，正整数表示指定的大小比如10
# CUT_HEIGHT 裁剪纸纹图的短边高度, 负整数表示block的倍数，如-2，-5，正整数表示指定的大小比如30、50
def queryParams():
    strRet = '{"code":0,"data":{"QRCODE_ALGIN_FORCE":%d,"MATCH_POSITION":%d,"QRCODE_WIDTH":%d,"CUT_PADDING":%d,"CUT_HEIGHT":%d}}'%((1 if params.QRCODE_ALGIN_FORCE else 0), params.MATCH_POSITION, params.QRCODE_WIDTH, params.CUT_SIZE[0], params.CUT_SIZE[2])
    print("strRet[%s]"%strRet)
    return strRet 

# 获取指定文件夹下的所有文件
def listTiffFiles(folder_path):
    listfiles = []
    for file in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file)
        if os.path.isfile(file_path):
            listfiles.append(file_path)
    #print(listfiles)
    return sorted(listfiles)

#  处理socket请求
def process(data):
    retStr = ""
    # TODO test code， 模拟注册、核验数据
    # if data == "regist":
    #     data = '{"func": "saveRegistImage", "ROOT_PATH": "/Users/miaojun/Desktop/pcdemo/root/", "tempPath": "/Users/miaojun/Desktop/pcdemo/1691405374743.jpg", "id":1, "reqId":123456789}'
    # elif data == "verifiy":
    #     data = '{"func": "verifiImage", "ROOT_PATH": "/Users/miaojun/Desktop/pcdemo/root/", "tempPath": "/Users/miaojun/Desktop/pcdemo/1691404291567.jpg", "reqId":123456789}'
    try:
        jsonData = json.loads(data)
    except Exception as e:
        retStr = '{"code":-9, "message":"message json parse failed...", "data":"%s"}'%data
        return retStr
    if "func" in jsonData:
        func = jsonData.get("func") # 调用方法名
        ROOT_PATH = jsonData.get("ROOT_PATH") # 图片保存的根路径
        tempPath = jsonData.get("tempPath") # 图片路径
        reqId = jsonData.get("reqId") # 请求随机ID，response时带回去
        id = jsonData.get("id") # 如果没有id参数，直接默认为""
        id = "" if id == None else id
        startTime = time.perf_counter()
        if func == "saveRegistImage": # 注册
            retStr = saveRegistImage(ROOT_PATH,tempPath,id)
        elif func == "verifiImage": # 核验
            retStr = verifiImage(ROOT_PATH,tempPath,id)
        elif func == "setParams": # 设置参数
            paramsData = jsonData.get("paramsData")
            retStr = setParams(paramsData)
        elif func == "queryParams": # 查询参数
            retStr = queryParams()
        else :
            retStr = '{"code":-2, "message":"process unkown func[%s]")'%data
        endTime = time.perf_counter()
        if retStr != "":
            jsonObj = json.loads(retStr)
            jsonObj["reqId"] = reqId
            jsonObj["costTime"] = "%.2fS"%(endTime - startTime)
            retStr = json.dumps(jsonObj)
    else :
        retStr = '{"code":-2, "message":"process unkown message[%s]")'%data

    print(retStr)
    return retStr

# 获取主机名和IP地址列表
def getLocalIp():
    _, _, ip_list = socket.gethostbyname_ex(socket.gethostname())

    # 选择第一个IP地址作为本机IP
    ip_address = ip_list[0] if ip_list[0] != '127.0.0.1' else ip_list[1]
    return ip_address

import socket
import threading
mSerSocket:socket = None
isExit = False # 程序退出
# 启动接口服务
def startServer():
    global mSerSocket
    global isExit

    mSerSocket = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
    myIp = '127.0.0.1'
    '''
    异常情况:
    1、没有client连接上来时，python直接关闭进程，再启动server也没有问题
    2、有client连接上来后，由client端主动发起.exit.指令通知服务端关闭连接、退出进程后，再启动server也没有问题
    3、异常情况，有client连接，且还没有close，python直接关闭进程，再启动python server会有问题，bing服务端口时报错: [Errno 48] Address already in use
        应该是短时间内系统未释放之前已经绑定的地址、端口，导致bind失败，过一分钟左右之后再启动可以（应该系统内自动释放了）
    '''
    mSerSocket.bind((myIp,3000))
    mSerSocket.listen(1)

    try :
        while isExit == False:
            # 接受连接
            connect, addr = mSerSocket.accept()
            print('connected[%s:%d]'%(addr[0], addr[1]))
            # 创建新线程处理连接
            thread = threading.Thread(target=handleClientConnect, args=(connect, addr))
            thread.start()
    except Exception as e:
        print("server socket connect exception and exit ... %s", str(e))
    print('server socket closed and exit socket accept loop...')

# 处理client连接
def handleClientConnect(connect, address):
    try:
        while True:
            # 接收消息
            data = connect.recv(1024)
            if not data or data.decode('utf-8') == ".exit.":
                print('connect client[%s:%d], exit service...'%(address[0], address[1]))
                exit(connect)
                break
            # 处理消息
            try:
                retStr = process(data.decode('utf-8'))
            except Exception as e:
                retStr = '{"code":500, "message":"server inner process exception:%s"}'%str(e)
            sendMessage(retStr, connect)
    except Exception as e:
        print("client socket recv exception %s", str(e))
    print('client socket[%s:%d] closed and finish client socket handle Thread...'%(address[0], address[1]))

# 发送消息
def sendMessage(message, connect):
    if connect != None:
        connect.sendall(message.encode('utf-8'))
    else:
        print("sendMessage error, connect is none...")

# 关闭client连接并退出监听循环，退出程序
def exit(connect):
    global mSerSocket
    global isExit
    try:
        isExit = True
        connect.close()
        mSerSocket.close()
        mSerSocket = None
    except Exception as e:
        print("close socket connect exception... %s", str(e))

# 图片比对入口函数
def main():
     # 初始化参数构造器
    parser = argparse.ArgumentParser()
    
    # 在参数构造器中添加两个命令行参数
    parser.add_argument('--root_path', type=str, default='uvb/root')
    parser.add_argument('--register_file_path', type=str, default='register.jpg')
    parser.add_argument('--register_file_id', type=str, default='1')
    parser.add_argument('--verify_file_path', type=str, default='verify.jpg')
    parser.add_argument('--type', type=str, default='register')
    
    # 获取所有的命令行参数
    args = parser.parse_args()
    if args.type== "register":
        saveRegistImage(args.root_path,args.register_file_path,args.register_file_id)
    elif args.type == "verify":
        verifiImage(args.root_path,args.verify_file_path)

# reg1="/Users/miaojun/Desktop/pcdemo/1.jpg"
# verifi1="/Users/miaojun/Desktop/pcdemo/2.jpg"

# # ret = saveRegistImage(reg1,1)
# ret = verifiImage(verifi1)
# print("result:",ret)
# main()
# ip = getLocalIp()
# print("localIp[%s]"%ip)
startServer()