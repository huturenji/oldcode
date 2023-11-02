'''
pylab 显示图片、保存图片工具类

'''
import pylab as pl
from matplotlib import cm
from statistics import mean
import numpy as np

    # 显示注册图和核验图
def show2Image(srcImg, dstImg, regFileName, verifiFileName, size= (8,8), savePath = "") :
    fig = pl.figure (figsize = size)
    ax3 = fig.add_subplot(121)
    ax3.imshow(srcImg, cmap='gray')
    ax3.set_title("regImage")

    ax4 = fig.add_subplot(122)
    ax4.imshow(dstImg, cmap='gray')
    ax4.set_title("verifiImage")
    fig.suptitle("regImg: %s\nverifiImg:%s"%(regFileName, verifiFileName))
    # 如果传入了保存路径，保存图片到指定path
    if (savePath != ""):
        pl.savefig(savePath)
    # fig.show()

    return 

    # 显示单个图片
def showImage(srcImg,fileName, savePath = "") :
    fig = pl.figure (figsize= (8,8))
    ax3 = fig.add_subplot(111)
    ax3.imshow(srcImg, cmap='gray')
    ax3.set_title(fileName)
    # 如果传入了保存路径，保存图片到指定path
    if (savePath != ""):
        pl.savefig(savePath)
    # fig.show()

    return 

# 显示结果的直方图
def showResultHist(resultTrue,resultFlase,title, detail = "", savePath = ""):
    plt = pl
    plt.figure(figsize=(10, 6))
    plt.hist([resultFlase, resultTrue], bins=20, alpha = 0.5,color=['red','blue'],label=["false","true"])

    # 添加标题和标签
    plt.title(title)
    plt.xlabel('value')
    plt.ylabel('num')
    plt.xlim(-1,1)
    xticks = np.arange(-1,1.1,0.1)
    plt.xticks(xticks)
    # 添加图例
    legend = plt.legend(loc='upper right')

    trueMin = min(resultTrue) if len(resultTrue) > 0 else 0
    trueAvg = mean(resultTrue) if len(resultTrue) > 0 else 0
    falseMax = max(resultFlase) if len(resultFlase) > 0 else 0
    span = (trueMin - falseMax)
    str = "trueAvg [%.3f]\ntrueMin [%.3f]\nfalseMax [%.3f]\nspan [%.3f]"%(trueAvg,trueMin,falseMax,span)
    plt.figtext(0.15, 0.67,str, ha='left')

    if (detail != ""):
        plt.figtext(0.15, 0.8, detail, ha='left')

    # 如果传入了保存路径，保存图片到指定path
    if (savePath != ""):
        pl.savefig(savePath)
    # fig.show()

    return

    # 显示小的指纹图的对比
def showSmallCutImgCompare(srcImg, dstImg, name, savePath="") :
    fig = pl.figure (figsize= (6,6))
    # 创建第一个 Axes 对象，并添加第一个子图
    ax1 = fig.add_subplot(221, projection='3d')
    Y1, X1 = np.meshgrid(range(srcImg.shape[1]), range(srcImg.shape[0]))
    Z1 = srcImg
    surf = ax1.plot_surface(X1, Y1, Z1, cmap=cm.coolwarm,
                        linewidth=0, antialiased=False)
    ax1.set_title('srcImg')

    # 创建第2个 Axes 对象，并添加第2个子图
    ax2 = fig.add_subplot(222, projection='3d')
    Y2, X2 = np.meshgrid(range(dstImg.shape[1]), range(dstImg.shape[0]))
    Z2 = dstImg
    surf = ax2.plot_surface(X2, Y2, Z2, cmap=cm.coolwarm,
                        linewidth=0, antialiased=False)
    ax2.set_title('dstImg')

    ax3 = fig.add_subplot(223)
    ax3.imshow(srcImg, cmap='gray')
    ax4 = fig.add_subplot(224)
    ax4.imshow(dstImg, cmap='gray')
    fig.suptitle(name)
    fig.colorbar(surf, shrink=0.5, aspect=5)
    # 如果传入了保存路径，保存图片到指定path
    if (savePath != ""):
        pl.savefig(savePath)

# 显示直方图
def showHist(data1, data2,title="", detail="", savePath=""):
    pl.figure (figsize= (6,6))
    xMin = min(len(data1), len(data2))
    _data1 = data1[:xMin]
    _data2 = data2[:xMin]
    x = np.arange(0, xMin, 1)
    pl.title(title)
    pl.plot(x,_data1,label="data1")
    pl.plot(x,_data2,label="data2")
    pl.title(title)
    pl.figtext(0.15, 0.83, detail, ha='left')
    pl.xlabel('X-axis')
    pl.ylabel('Y-axis')
    pl.legend()
    # 如果传入了保存路径，保存图片到指定path
    if (savePath != ""):
        pl.savefig(savePath)
    return

# 显示直方图
def showHistData(data1, title="", detail="", savePath=""):
    pl.figure (figsize= (6,6))
    xMin = len(data1)
    x = np.arange(0, xMin, 1)
    pl.title(title)
    pl.plot(x,data1,label="data1")
    pl.ylim(-1.2,1.2)
    yticks = np.arange(-1.2,1.2,0.1)
    pl.yticks(yticks)
    pl.xticks(x)
    pl.title(title)
    pl.figtext(0.15, 0.83, detail, ha='left')
    pl.xlabel('X-axis')
    pl.ylabel('Y-axis')
    pl.grid(True)
    pl.legend()
    # 如果传入了保存路径，保存图片到指定path
    if (savePath != ""):
        pl.savefig(savePath)
    return