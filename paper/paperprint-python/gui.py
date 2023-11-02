#!/usr/bin/env python

from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5.QtGui import *
import sys
from testCase import singleTest
from testCase import batcingTest
from testCase import listTiffFiles
import params as params

class MainWindow(QWidget):
    compareType = 1  # 1：单组比对、2：批量比对

    registPath = ''  # 注册图文件或者文件夹路径
    registKey = ""   # 注册图匹配关键字
    registFilterKey = "" # 注册图过滤关键字

    verifiPath = ''  # 核验图文件或者文件夹路径
    verifiKey = "" # 核验图匹配关键字
    verifiFilterKey = "" # 核验图过滤关键字

    ## 实验报告配置
    reportPath = '' # 指定报告路径
    reportFileName = '' # 指定报告名称
    testDesc = '' # 测试场景描述

    toggleList = []

    # realValue = 0.4  # 真图最小相关系数阈值
    # fakeValue = 0.3 # 假图最大相关系数阈值
    # realAndFakeValue = 0.2 # 真假图相关系数间隔阈值
    # isSaveOriginal = True # 是否保存原始对比图
    # isSaveRegistration = True # 是否保存配准对比图
    # isSaveCrop = True # 是否保存裁剪的指纹图tiff文件

    ## 实验参数配置
    # priorityQR = False # 优先二维码配准
    # QRWidth = -1 # 透视变换时二维码基准边长, -1 表示以注册图大小为准，否则以指定值为基准,如200、300
    # padding = 1 # 裁剪与二维码之间的留白, 值为二维码block宽度的倍数
    # width = 5 # 裁剪的纸纹图width
    #计算结果难以确认时需要重新移位计算阈值范围
    # minCalc = 0.2 
    # maxCalc = 0.4
    # matchPosition = 3 # 模版匹配范围，核验图比对上下左右位移像素范围

    # gaussianSize = 9  #高斯模糊参数
    # gaussianSigma = 3 #高斯模糊参数

    def __init__(self):
        super().__init__()
        self.setWindowTitle('纸纹比对验证测试程序')
        self.resize(600, 300)
        self.draw()


    def startBtnClick(self):
        if self.compareType == 1:
            singleTest(self.registPath, self.verifiPath)
        else:
            regFiles = listTiffFiles(self.registPath, self.registKey, self.registFilterKey)
            verifiFiles = listTiffFiles(self.verifiPath, self.verifiKey, self.verifiFilterKey)
            batcingTest(regFiles, verifiFiles, self.reportPath + '/', False, self.reportFileName, self.testDesc)

    def textChange(self, element, key, obj = ''):
        if obj == '':
            setattr(self, key, element.text())
        else:
            setattr(obj, key, element.text())

    def plainTextChange(self, element, key):
        setattr(self, key, element.toPlainText())

    def valueChange(self, element, key):
        path = key.split('.')
        if len(path) == 2:
            value = getattr(params, path[0])
            value[int(path[1])] = element.value()
            setattr(params, path[0], value)
        else:
            setattr(params, key, element.value())

    def btnClick(self, element, key):
        if element.isChecked():
            setattr(params, key, True)
        else:
            setattr(params, key, False)
    
    def groupBtnClick(self, element):
        text = element.checkedButton().text()
        if text == '单组':
            self.compareType = 1
            self.selectRegistLabel.setText('选择注册图文件: ')
            self.selectVerifiLabel.setText('选择核验图文件: ')
            for element in self.toggleList:
                element.hide()
            self.removeLayout(self.registKeyLayout)
            self.removeLayout(self.verifiKeyLayout)
            self.removeLayout(self.drawLayout)
            self.setFixedSize(600, 300)
        else:
            self.compareType = 2
            self.selectRegistLabel.setText('选择注册图文件夹: ')
            self.selectVerifiLabel.setText('选择核验图文件夹: ')
            self.fLayout.insertLayout(3, self.registKeyLayout)
            self.fLayout.insertLayout(5, self.verifiKeyLayout)
            self.fLayout.insertLayout(6, self.drawLayout)
            for element in self.toggleList:
                element.show()
            self.setFixedSize(600, 600)
        self.selectVerifiEdit.setText("")
        self.selectRegistEdit.setText("")

    def removeLayout(self, element):
        self.fLayout.removeItem(element)

    def selectFile(self, element, type, key): #type = 1 表示选择文件，type=2表示选择目录
        if type == 1:
            fname, _ = QFileDialog.getOpenFileName()
        else:
            fname = QFileDialog.getExistingDirectory()
        element.setText(fname)
        setattr(self, key, fname)

    def drawReport(self):
        drawLayout = QVBoxLayout()
        # 实验报告配置
        label2 = QLabel('实验报告配置')
        label2.setAlignment(Qt.AlignCenter)
        label2.setFont(self.font1)
        drawLayout.addWidget(label2)
        self.toggleList.append(label2)

        # 指定报告路径
        selectReportLabel = QLabel('指定报告路径: ')
        selectReportLabel.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        selectReportLabel.setFixedSize(150, 30)
        selectReportEdit = QLineEdit()

        selectReportEdit.mousePressEvent = lambda event: self.selectFile(selectReportEdit, 2, 'reportPath')

        selectReportLayout = QHBoxLayout()
        selectReportLayout.addWidget(selectReportLabel)
        selectReportLayout.addWidget(selectReportEdit)
        drawLayout.addLayout(selectReportLayout)

        self.toggleList.append(selectReportLabel)
        self.toggleList.append(selectReportEdit)
        # 报告名称
        selectReportNameLabel = QLabel('指定报告名称: ')
        selectReportNameLabel.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        selectReportNameLabel.setFixedSize(150, 30)
        selectReportNameEdit = QLineEdit()
        selectReportNameEdit.textChanged.connect(lambda event: self.textChange(selectReportNameEdit, 'reportFileName'))

        selectReportNameLayout = QHBoxLayout()
        selectReportNameLayout.addWidget(selectReportNameLabel)
        selectReportNameLayout.addWidget(selectReportNameEdit)
        drawLayout.addLayout(selectReportNameLayout)

        self.toggleList.append(selectReportNameLabel)
        self.toggleList.append(selectReportNameEdit)

        # 测试场景描述
        testDescLabel = QLabel('测试场景描述: ')
        testDescLabel.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        testDescLabel.setFixedSize(150, 30)
        testDescEdit = QPlainTextEdit()
        testDescEdit.setFixedHeight(50)

        testDescEdit.textChanged.connect(lambda: self.plainTextChange(testDescEdit, 'testDesc'))

        testDescLayout = QHBoxLayout()
        testDescLayout.addWidget(testDescLabel)
        testDescLayout.addWidget(testDescEdit)
        drawLayout.addLayout(testDescLayout)

        self.toggleList.append(testDescLabel)
        self.toggleList.append(testDescEdit)

        # 真图最小相关系数阈值
        realPicMinLabel = QLabel('真图最小相关系数阈值: ')
        realPicMinLabel.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        realPicMinLabel.setFixedSize(150, 30)
        realPicMin = QDoubleSpinBox()
        realPicMin.setMinimum(-1)
        realPicMin.setMaximum(1)
        realPicMin.setSingleStep(0.01)
        realPicMin.setValue(params.EXCEPITON_MIN_TRUE)

        realPicMin.valueChanged.connect(lambda: self.valueChange(realPicMin, 'EXCEPITON_MIN_TRUE'))

        # 假图最大相关系数阈值
        fakePicMaxLabel = QLabel('假图最大相关系数阈值: ')
        fakePicMaxLabel.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        fakePicMaxLabel.setFixedSize(150, 30)
        fakePicMax = QDoubleSpinBox()
        fakePicMax.setMinimum(-1)
        fakePicMax.setMaximum(1)
        fakePicMax.setSingleStep(0.01)
        fakePicMax.setValue(params.EXCEPITON_MAX_FALSE)
        fakePicMax.valueChanged.connect(lambda: self.valueChange(fakePicMax, 'EXCEPITON_MAX_FALSE'))

        realPicLayout = QHBoxLayout()
        realPicLayout.addWidget(realPicMinLabel)
        realPicLayout.addWidget(realPicMin)
        realPicLayout.addWidget(fakePicMaxLabel)
        realPicLayout.addWidget(fakePicMax)
        drawLayout.addLayout(realPicLayout)

        self.toggleList.append(realPicMinLabel)
        self.toggleList.append(realPicMin)
        self.toggleList.append(fakePicMaxLabel)
        self.toggleList.append(fakePicMax)

        # 真假图相关系数间隔阈值
        realAndFakeLabel = QLabel('真假图相关系数间隔阈值: ')
        realAndFakeLabel.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        realAndFakeLabel.setFixedSize(150, 30)
        realAndFakeEdit = QDoubleSpinBox()
        realAndFakeEdit.setMinimum(-1)
        realAndFakeEdit.setMaximum(1)
        realAndFakeEdit.setSingleStep(0.01)
        realAndFakeEdit.setValue(params.EXCEPITON_SPAN)

        realAndFakeEdit.valueChanged.connect(lambda: self.valueChange(realAndFakeEdit, 'EXCEPITON_SPAN'))

        realAndFakeLayout = QHBoxLayout()
        realAndFakeLayout.addWidget(realAndFakeLabel)
        realAndFakeLayout.addWidget(realAndFakeEdit)
        drawLayout.addLayout(realAndFakeLayout)

        self.toggleList.append(realAndFakeLabel)
        self.toggleList.append(realAndFakeEdit)
        
        # 是否保存原始对比图
        isSaveOriginalEdit = QCheckBox('是否保存原始对比图')
        if params.SAVE_ORIGIN_IMAGE:
            isSaveOriginalEdit.setChecked(params.SAVE_ORIGIN_IMAGE)
        isSaveOriginalEdit.clicked.connect(lambda: self.btnClick(isSaveOriginalEdit, 'SAVE_ORIGIN_IMAGE'))

        # 是否保存配准对比图
        isSaveRegistrationEdit = QCheckBox('是否保存配准对比图')
        if params.SAVE_CUT_IMAGE:
            isSaveRegistrationEdit.setChecked(params.SAVE_CUT_IMAGE)
        isSaveRegistrationEdit.clicked.connect(lambda: self.btnClick(isSaveRegistrationEdit, 'SAVE_CUT_IMAGE'))

        layH3 = QHBoxLayout()
        layH3.addWidget(isSaveOriginalEdit)
        layH3.addStretch()
        layH3.addWidget(isSaveRegistrationEdit)
        drawLayout.addLayout(layH3)

        self.toggleList.append(isSaveOriginalEdit)
        self.toggleList.append(isSaveRegistrationEdit)

        # 是否保存裁剪的指纹图tiff文件
        isSaveCropEdit = QCheckBox('是否保存裁剪的指纹图tiff文件')
        if params.SAVE_TIFF_PPIMAGE:
            isSaveCropEdit.setChecked(params.SAVE_TIFF_PPIMAGE)
        isSaveCropEdit.clicked.connect(lambda: self.btnClick(isSaveCropEdit, 'SAVE_TIFF_PPIMAGE'))
        drawLayout.addWidget(isSaveCropEdit)

        self.toggleList.append(isSaveCropEdit)

        self.drawLayout = drawLayout

    def drawFilterRuleItem(self, label, key):
        # 匹配关键字
        registKeyLabel = QLabel(label)
        registKeyLabel.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        registKeyLabel.setFixedSize(150, 30)
        registKeyEdit = QLineEdit()
        registKeyEdit.textChanged.connect(lambda event: self.textChange(registKeyEdit, key))
        return registKeyLabel, registKeyEdit

    def drawFilterRule(self, matchKey, filterKey):
        # 匹配关键字
        registKeyLabel, registKeyEdit = self.drawFilterRuleItem('匹配关键字:', matchKey)
        # 过滤关键字
        registFilterKeyLabel, registFilterKeyEdit = self.drawFilterRuleItem('过滤关键字:', filterKey)

        registKeyLayout = QHBoxLayout()
        registKeyLayout.addWidget(registKeyLabel)
        registKeyLayout.addWidget(registKeyEdit)
        registKeyLayout.addWidget(registFilterKeyLabel)
        registKeyLayout.addWidget(registFilterKeyEdit)

        self.toggleList.append(registKeyLabel)
        self.toggleList.append(registKeyEdit)
        self.toggleList.append(registFilterKeyLabel)
        self.toggleList.append(registFilterKeyEdit)

        return registKeyLayout

    def draw(self):
        fLayout = QVBoxLayout()
        self.fLayout = fLayout
        self.setLayout(fLayout)
        
        label1 = QLabel('纸纹比对验证测试程序')
        label1.setAlignment(Qt.AlignCenter)
        self.font1 = font1 = QFont('Arial', 16)
        label1.setFont(font1)
        fLayout.addWidget(label1)

        # 比对方式
        compareTypeLabel = QLabel('比对方式: ')
        compareTypeLabel.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        compareTypeLabel.setFixedSize(150, 30)
        compareTypeBtnGroup = QButtonGroup()
        compareTypeBtn1 = QRadioButton('单组')
        compareTypeBtn1.setChecked(True)
        compareTypeBtn2 = QRadioButton('批量')
        compareTypeBtnGroup.addButton(compareTypeBtn1)
        compareTypeBtnGroup.addButton(compareTypeBtn2)
        compareTypeBtnGroup.buttonClicked.connect(lambda: self.groupBtnClick(compareTypeBtnGroup))

        compareTypeLayH1 = QHBoxLayout()
        compareTypeLayH1.addWidget(compareTypeLabel)
        compareTypeLayH1.addWidget(compareTypeBtn1)
        compareTypeLayH1.addWidget(compareTypeBtn2)

        fLayout.addLayout(compareTypeLayH1)

        # 选择注册图文件夹
        selectRegistLabel = QLabel('选择注册图文件: ')
        selectRegistLabel.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        self.selectRegistLabel = selectRegistLabel
        selectRegistLabel.setFixedSize(150, 30)
        selectRegistEdit = QLineEdit()
        self.selectRegistEdit = selectRegistEdit
        selectRegistEdit.mousePressEvent = lambda event: self.selectFile(selectRegistEdit, self.compareType, 'registPath')

        selectRegistLayH1 = QHBoxLayout()
        selectRegistLayH1.addWidget(selectRegistLabel)
        selectRegistLayH1.addWidget(selectRegistEdit)

        fLayout.addLayout(selectRegistLayH1)

        # registKeyLabel = QLabel()
        # registKeyLabel.setFixedSize(150, 30)
        # registKeyEdit = QLineEdit()
        # registKeyEdit.textChanged.connect(lambda event: self.textChange(registKeyEdit, 'registKey'))

        
        # registFilterKeyLabel = QLabel('过滤关键字: ')
        # registFilterKeyLabel.setFixedSize(150, 30)
        # registFilterKeyEdit = QLineEdit()
        # registFilterKeyEdit.textChanged.connect(lambda event: self.textChange(registFilterKeyEdit, 'registFilterKey'))

        # registKeyLayout = QHBoxLayout()
        # registKeyLayout.addWidget(registKeyLabel)
        # registKeyLayout.addWidget(registKeyEdit)
        # registKeyLayout.addWidget(registFilterKeyLabel)
        # registKeyLayout.addWidget(registFilterKeyEdit)

        # 使用占位的QLabel使布局对齐
        self.registKeyLayout = self.drawFilterRule('registKey', 'registFilterKey')

        # 选择核验图文件夹
        selectVerifiLabel = QLabel('选择核验图文件: ')
        selectVerifiLabel.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        self.selectVerifiLabel = selectVerifiLabel
        selectVerifiLabel.setFixedSize(150, 30)
        selectVerifiEdit = QLineEdit()
        self.selectVerifiEdit = selectVerifiEdit
        selectVerifiEdit.mousePressEvent = lambda event: self.selectFile(selectVerifiEdit, self.compareType, 'verifiPath')

        selectVerifiLayout = QHBoxLayout()
        selectVerifiLayout.addWidget(selectVerifiLabel)
        selectVerifiLayout.addWidget(selectVerifiEdit)
        fLayout.addLayout(selectVerifiLayout)

        # 匹配关键字
        # verifiKeyLabel = QLabel('匹配关键字: ')
        # verifiKeyLabel.setFixedSize(150, 30)
        # verifiKeyEdit = QLineEdit()
        # verifiKeyEdit.textChanged.connect(lambda event: self.textChange(verifiKeyEdit, 'verifiKey'))

        # # 过滤关键字
        # verifiFilterKeyLabel = QLabel('过滤关键字: ')
        # verifiFilterKeyLabel.setFixedSize(150, 30)
        # verifiFilterKeyEdit = QLineEdit()

        # verifiFilterKeyEdit.textChanged.connect(lambda event: self.textChange(verifiFilterKeyEdit, 'verifiFilterKey'))

        # verifiKeyLayout = QHBoxLayout()
        # verifiKeyLayout.addWidget(verifiKeyLabel)
        # verifiKeyLayout.addWidget(verifiKeyEdit)
        # verifiKeyLayout.addWidget(verifiFilterKeyLabel)
        # verifiKeyLayout.addWidget(verifiFilterKeyEdit)
        # fLayout.addLayout(verifiKeyLayout)
        self.verifiKeyLayout = self.drawFilterRule('verifiKey', 'verifiFilterKey')
        # self.verifiKeyLayout = verifiKeyLayout
        # fLayout.addLayout(verifiKeyLayout)

        self.drawReport()

        # 实验参数配置
        label3 = QLabel('实验参数配置')
        label3.setAlignment(Qt.AlignCenter)
        label3.setFont(font1)
        fLayout.addWidget(label3)

        # 优先二维码配准
        priorityQR = QCheckBox('优先二维码配准')
        if params.QRCODE_ALGIN_FORCE:
            priorityQR.setChecked(True)
        priorityQR.clicked.connect(lambda: self.btnClick(priorityQR, 'QRCODE_ALGIN_FORCE'))

        # 二维码配准基准
        QRcodeRegistrationLabel = QLabel('二维码配准基准: ')
        QRcodeRegistrationLabel.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        QRcodeRegistrationEdit = QSpinBox()
        QRcodeRegistrationEdit.setMinimum(-1)
        QRcodeRegistrationEdit.setValue(params.QRCODE_WIDTH)
        QRcodeRegistrationEdit.valueChanged.connect(lambda: self.valueChange(QRcodeRegistrationEdit, 'QRCODE_WIDTH'))
        
        priorityQRLayH = QHBoxLayout()
        priorityQRLayH.addWidget(priorityQR)

        priorityQRLayH2 = QHBoxLayout()

        priorityQRLayH2.addWidget(QRcodeRegistrationLabel)
        priorityQRLayH2.addWidget(QRcodeRegistrationEdit)
        priorityQRLayH.addLayout(priorityQRLayH2)
        fLayout.addLayout(priorityQRLayH)


        # 指纹图与二维码留白
        paddingLabel = QLabel('指纹图与二维码留白: ')
        paddingLabel.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        paddingEdit = QSpinBox()
        paddingEdit.setSuffix('* block')
        paddingEdit.setValue(params.CUT_SIZE[0])
        paddingEdit.valueChanged.connect(lambda: self.valueChange(paddingEdit, 'CUT_SIZE.0'))

        # 指纹图短边
        shortEdgeLabel = QLabel('指纹图短边: ')
        shortEdgeLabel.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        shortEdgeEdit = QSpinBox()  # 5*block
        shortEdgeEdit.setValue(params.CUT_SIZE[2])
        shortEdgeEdit.setSuffix('* block')
        shortEdgeEdit.valueChanged.connect(lambda: self.valueChange(shortEdgeEdit, 'CUT_SIZE.2'))

        shortEdgeLayH = QHBoxLayout()
        shortEdgeLayH.addWidget(paddingLabel)
        shortEdgeLayH.addWidget(paddingEdit)
        shortEdgeLayH.addWidget(shortEdgeLabel)
        shortEdgeLayH.addWidget(shortEdgeEdit)

        fLayout.addLayout(shortEdgeLayH)

        # 平移计算阈值范围
        translationRangeLabel = QLabel('平移计算阈值范围: ')
        translationRangeLabel.setAlignment(Qt.AlignRight | Qt.AlignVCenter)


        rangMinEdit = QDoubleSpinBox()  #0.2-0.4
        rangMinEdit.setValue(params.RECALCULATE_THRESHOLD[0])
        rangMinEdit.valueChanged.connect(lambda: self.valueChange(rangMinEdit, 'RECALCULATE_THRESHOLD.0'))
        rangMaxEdit = QDoubleSpinBox()
        rangMaxEdit.setValue(params.RECALCULATE_THRESHOLD[1])
        rangMaxEdit.valueChanged.connect(lambda: self.valueChange(rangMaxEdit, 'RECALCULATE_THRESHOLD.1'))

        translationRangeEditLayH = QHBoxLayout()
        translationRangeEditLayH.addWidget(rangMinEdit)
        translationRangeEditLayH.addWidget(QLabel('—'))
        translationRangeEditLayH.addWidget(rangMaxEdit)

        translationRangeLayH = QHBoxLayout()
        translationRangeLayH.addWidget(translationRangeLabel)
        translationRangeLayH.addLayout(translationRangeEditLayH)
        

        # 平移像素半径
        translationLabel = QLabel('平移像素半径: ')
        translationLabel.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        translationEdit = QSpinBox()
        translationEdit.setValue(params.MATCH_POSITION)
        translationEdit.valueChanged.connect(lambda: self.valueChange(translationEdit, 'MATCH_POSITION'))

        translationEditLayH = QHBoxLayout()
        translationEditLayH.addWidget(translationLabel)
        translationEditLayH.addWidget(translationEdit)


        translationLayH = QHBoxLayout()
        translationLayH.addLayout(translationRangeLayH)
        translationLayH.addLayout(translationEditLayH)

        fLayout.addLayout(translationLayH)

        # 高斯核size
        gaussianLabel = QLabel('高斯核size: ')
        gaussianLabel.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        gaussianEdit = QSpinBox()
        gaussianEdit.setValue(params.GAUSSIAN_SIZE)
        gaussianEdit.valueChanged.connect(lambda: self.valueChange(gaussianEdit, 'GAUSSIAN_SIZE'))

        # 高斯sigma
        gaussianSigmaLabel = QLabel('高斯sigma：')
        gaussianSigmaLabel.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        gaussianSigmaEdit = QSpinBox()
        gaussianSigmaEdit.setValue(params.GAUSSIAN_SIGMA)
        gaussianSigmaEdit.valueChanged.connect(lambda: self.valueChange(gaussianSigmaEdit, 'GAUSSIAN_SIGMA'))

        gaussianLayH = QHBoxLayout()
        gaussianLayH.addWidget(gaussianLabel)
        gaussianLayH.addWidget(gaussianEdit)
        gaussianLayH.addWidget(gaussianSigmaLabel)
        gaussianLayH.addWidget(gaussianSigmaEdit)

        fLayout.addLayout(gaussianLayH)

        fLayout.addSpacing(30)
        # 开始按钮
        startBtn = QPushButton('开始')
        startBtn.clicked.connect(lambda: self.startBtnClick())
        fLayout.addWidget(startBtn)


app = QApplication(sys.argv)
win = MainWindow()
win.show()
app.exec_()