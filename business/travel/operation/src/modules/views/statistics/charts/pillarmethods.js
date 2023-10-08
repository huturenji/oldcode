
// echart 一般柱形图 数据展示，分页处理,支持最大值设定，横轴数量
// author: ruansheng
// data:2019年4月8日

/** 
 * 柱形图初始展示函数
* @param {Object} that         实例
* @param {string} pushData     展示数据  {name:[],value:[]}   预定义
* @param {Object} data         获取数据 {'name':'value','name2':'value2'}
* @param {string} centerVlaue Y中转数据 centerName X中转数据  []  预定义
* @param {number} xnumber      横排展示数据量 默认 6   预定义
* @param {string} pageBtnShowL   pageBtnShowR   左右按钮控件显隐状态值   预定义
* @param {string} Ymax         设定Y轴最大值 
*/

// 获取初始展示
export function placeChartData(that, data, pushData, centerName, centerVlaue, xnumber, pageBtnShowL, pageBtnShowR, Ymax) {
    if (!xnumber) {
        xnumber = 6
    }
    let cityDataArrName = []
    let cityDataArrValue = []
    if (!!data && Object.keys(data).length > 0) { // data 非空
        for (var item in data) { // 填写城市数据
            cityDataArrName.push(item)
            cityDataArrValue.push(data[item])
        }
    }
    that[Ymax] = cityDataArrValue[0] // 设定y轴最大值
    // 分页截取 不够就插入空位
    that[centerVlaue] = cityDataArrValue
    that[centerName] = cityDataArrName
    let restLength = cityDataArrValue.length
    if (restLength <= xnumber) { // 城市数据小于xnumber条
        if (pageBtnShowL && pageBtnShowR) {
            that[pageBtnShowL] = false
            that[pageBtnShowR] = false
        }
        for (let i = 0; i < (xnumber - restLength); i++) {
            that[centerVlaue].push('')
            that[centerName].push('')
        }
        that[pushData].name = that[centerName]
        that[pushData].value = that[centerVlaue]
    } else { // 城市数据大于xnumber条
        if (pageBtnShowL && pageBtnShowR) {
            that[pageBtnShowL] = false
            that[pageBtnShowR] = true
        }
        let arrTemporName = []
        let arrTemporValue = []
        for (let i = 0; i < that[centerName].length; i++) {
            if (i < xnumber) {
                arrTemporName.push(that[centerName][i])
                arrTemporValue.push(that[centerVlaue][i])
            }
        }
        that[pushData].name = arrTemporName
        that[pushData].value = arrTemporValue
    }
}

/** 
 * 柱形图左翻页函数
* @param {Object} that          实例
* @param {string} pushData     展示数据 {name:[],value:[]} 预定义
* @param {string} centerVlaue Y中转数据 centerName X中转数据 [] 预定义
* @param {number} xnumber      横排展示数据量 默认 6 预定义
* @param {string} pageBtnShowL   pageBtnShowR   左右按钮控件显隐状态值 默认NULL 预定义
* @param {string} pageIndex       页数 默认设定值为0  预定义
*/

// 左翻页
export function chartBtnClickPre(that, pushData, centerName, centerVlaue, xnumber, pageBtnShowL, pageBtnShowR, pageIndex) {
    if (!pageIndex) {
        pageIndex = 0
    }
    console.log('cityDataDes pre page')
    if ((that[centerVlaue].length - (xnumber * (that[pageIndex] - 1))) <= xnumber) { // 前页剩余数小于xnumber
        that[pageBtnShowL] = false // 不可向左翻页
        that[pageBtnShowR] = true // 可向右翻页
        that[pageIndex]--
        let restLength = that[centerVlaue].length - (xnumber * that[pageIndex])
        let arrTemporName = []
        let arrTemporValue = []
        for (let i = 0; i < restLength; i++) {
            arrTemporName.push(that[centerName][xnumber * (that[pageIndex]) + i])
            arrTemporValue.push(that[centerVlaue][xnumber * (that[pageIndex]) + i])
        }
        for (let i = 0; i < xnumber - restLength; i++) { // 插入空位
            arrTemporName.push("")
            arrTemporValue.push("")
        }
        that[pushData].name = arrTemporName
        that[pushData].value = arrTemporValue
    } else { // 前页剩余数大于xnumber
        that[pageBtnShowL] = true
        that[pageBtnShowR] = true
        that[pageIndex]--
        let arrTemporName = []
        let arrTemporValue = []
        for (let i = 0; i < xnumber; i++) {
            arrTemporName.push(that[centerName][xnumber * (that[pageIndex]) + i])
            arrTemporValue.push(that[centerVlaue][xnumber * (that[pageIndex]) + i])
        }
        that[pushData].name = arrTemporName
        that[pushData].value = arrTemporValue
    }
    if (that[pageIndex] == 0) {// 为第0页的时候隐藏左边按钮
        that[pageBtnShowL] = false
    }
    console.log(that[pageIndex], 'pageSize')
}


/** 
 * 柱形图右翻页函数
* @param {Object} that          实例
* @param {string} pushData     展示数据 {name:[],value:[]} 预定义
* @param {string} centerVlaue Y中转数据 centerName X中转数据 预定义
* @param {number} xnumber      横排展示数据量 默认 6 预定义
* @param {string} pageBtnShowL   pageBtnShowR   左右按钮控件显隐状态值 默认NULL 预定义
* @param {string} pageIndex       页数  预定义
*/

// 右翻页
export function chartBtnClickNext(that, pushData, centerName, centerVlaue, xnumber, pageBtnShowL, pageBtnShowR, pageIndex) {
    console.log('cityDataDes next page')
    let restCityNum = that[centerVlaue].length - (xnumber * (that[pageIndex] + 1))
    if (restCityNum <= xnumber) { // 后页剩余城市数小于等于12
        that[pageBtnShowL] = true // 可向左翻页
        that[pageBtnShowR] = false // 不可向右翻页
        that[pageIndex]++
        let restLength = that[centerVlaue].length - (xnumber * that[pageIndex])
        let arrTemporName = []
        let arrTemporValue = []
        for (let i = 0; i < restLength; i++) {
            let arrLocation = xnumber * (that[pageIndex]) + i
            arrTemporName.push(that[centerName][arrLocation])
            arrTemporValue.push(that[centerVlaue][arrLocation])
        }
        for (let i = 0; i < xnumber - restLength; i++) { // 填充空位
            arrTemporName.push("")
            arrTemporValue.push("")
        }
        that[pushData].name = arrTemporName
        that[pushData].value = arrTemporValue
    } else { // 后页剩余城市数大于12
        that[pageBtnShowL] = true // 可向左翻页
        that[pageBtnShowR] = true // 可向右翻页
        that[pageIndex]++
        let arrTemporName = []
        let arrTemporValue = []
        for (let i = 0; i < xnumber; i++) {
            let arrLocation = xnumber * (that[pageIndex]) + i
            arrTemporName.push(that[centerName][arrLocation])
            arrTemporValue.push(that[centerVlaue][arrLocation])
        }
        that[pushData].name = arrTemporName
        that[pushData].value = arrTemporValue
    }
    console.log(that[pageIndex], 'pageSize')
}