import homelHandler from "bislibs/requestHandler/homehandler";
import { utils } from "opcl";

/**
 * 新建抽奖的生命周期 4个 关键字
 * 
*/
export const lifecycleKeyMap = {
    ADD_PRIZE: "addPrize",
    SET_LOTTERY: "setLottery",
    CONFIRM_LOTTERY: "confirm_lottery",
    SET_LOTTERY_OK: "setLotteyOK",
}

/**
 * 新建抽奖的生命周期管理类
 *
*/
const lifecycle = [
    {
        key: lifecycleKeyMap.ADD_PRIZE,
        name: "添加奖品",
        pre: "",
        next: lifecycleKeyMap.SET_LOTTERY,
        uiComponent: "addPrize",
        uiCompDataCache: {
            offlinePrizes: [
                // {
                //     goodId: 1,
                //     name: "",
                //     img: "",
                //     price: "",
                //     num: 1,
                // }
            ],// 线下奖品列表
            onlinePrizes: [],// 线上奖品列表
            dialogSelectGoods: [], //online弹框上选中的列表
            dialogSelectGoodsMap: {},//弹框上选中的列表
            // activeTab: "1"//奖品类型线上还是线下，抽奖二期 奖品可以混合添加，这个标志已经没有意义，需要删掉
        },
        resultData: ""
    },
    {
        key: lifecycleKeyMap.SET_LOTTERY,
        name: "抽奖设置",
        pre: lifecycleKeyMap.ADD_PRIZE,
        next: lifecycleKeyMap.CONFIRM_LOTTERY,
        uiComponent: "setLottery",
        uiCompDataCache: {
            //设置活动的输入项
            settingData: {
                activityRule: "本次活动规则的解释权归主办方所有。",
                personTimes: 0,//预计抽奖人次
                winProbability: 0,//中奖概率
                noNumWinDay: true,//中奖次数限制,每日
                noNumWinTotal: true,//中奖次数限制
                noNumRafflesDay: false,//抽奖次数限制,每日
                noNumRafflesTotal: false,//抽奖次数限制,
                numRafflesTotal: 1,//抽奖次数限制
                numRafflesDay: 1,//抽奖次数限制 每日
                inviteUserList:[]//抽检资格
                
            },
        },
        resultData: ""
    },
    {
        key: lifecycleKeyMap.CONFIRM_LOTTERY,
        name: "确认信息",
        pre: lifecycleKeyMap.SET_LOTTERY,
        next: lifecycleKeyMap.SET_LOTTERY_OK,
        uiComponent: "confirmLottery",
        resultData: "",
        uiCompDataCache: {
        },
    },
    {
        key: lifecycleKeyMap.SET_LOTTERY_OK,
        name: "创建成功",
        pre: lifecycleKeyMap.ADD_PRIZE,
        next: "",
        uiComponent: "setokLottery",
        resultData: ""
    },


]

/**
 * 设置 抽奖类型
 * @param {*} aLottery 
 */
export function setCurrentLottery(aLottery) {
    //入参不为空，说明是 首页点击操作，这时候缓存一下 抽奖类型
    if (!!aLottery) {
        //typeId 缓存起来
        utils.setStorage("customer_currentLottery", JSON.stringify({
            "name": aLottery.name,
            "toolId": aLottery.toolId,
            'activityTip': aLottery.activityTip,
        }));
        utils.setStorage("customer_typeId", aLottery.toolId);
    }

    //现场开奖 玩法 第二步 抽奖设置 需要单独的业务组件，这里动态配置
    if (isXCKActivity()) {
        lifecycle[1].uiComponent = 'setLotteryxck'
        lifecycle[1].uiCompDataCache = {
            //设置活动的输入项
            settingData: {
                activityRule: "本次活动规则的解释权归主办方所有。",
                prizeSetList: [],//奖项设置列表
                repeatDraw: 1,//重复中奖 是否

            },
        }
        //现场开奖 玩法 第三步 抽奖确认 需要单独的业务组件，这里动态配置
        lifecycle[2].uiComponent = 'confirmLotteryxck'
    }
    //营销活动 要设置成自己的 业务组件 动态配置一次
    if (isYingxiaoActivity()) {
        lifecycle[1].uiComponent = 'setLottery'
        lifecycle[1].uiCompDataCache = {
            //设置活动的输入项
            //设置活动的输入项
            settingData: {
                activityRule: "本次活动规则的解释权归主办方所有。",
                personTimes: 0,//预计抽奖人次
                winProbability: 0,//中奖概率
                noNumWinDay: true,//中奖次数限制,每日
                noNumWinTotal: true,//中奖次数限制
                noNumRafflesDay: false,//抽奖次数限制,每日
                noNumRafflesTotal: false,//抽奖次数限制,
                numRafflesTotal: 1,//抽奖次数限制
                numRafflesDay: 1,//抽奖次数限制 每日
                inviteUserList:[]//抽奖资格
            },
        }
        //现场开奖 玩法 第三步 抽奖确认 需要单独的业务组件，这里动态配置
        lifecycle[2].uiComponent = 'confirmLottery'
    }
}

/**
 * 商品是否点击选中了
 * @param {*} good 
 */
export function isGoodsSelect(good) {
    let find = getAddPrizeData().dialogSelectGoods.find((item) => {
        return item.goodId && item.goodId == good.goodId;
    });
    return !!find;
}
/**
 * 
 * @param {*} key 
 */
export function setResultData(key) {
    if (key == lifecycleKeyMap.ADD_PRIZE) {
        //抽奖二期，奖品可以混合添加，不再区分线上线下。
        getLifecycleItem(lifecycleKeyMap.ADD_PRIZE).resultData = {
            online: getAddPrizeData().onlinePrizes,
            offline: getAddPrizeData().offlinePrizes
        }
    } else if (key == lifecycleKeyMap.SET_LOTTERY) {
        getLifecycleItem(lifecycleKeyMap.SET_LOTTERY).resultData = geSettingLotteryData().settingData
    }
}
/**
 * 
 * @param {*} key 
 * @param {*} vue 
 * @returns 
 */
export async function ifCanNext(key, vue) {
    let canNext = false;
    let errorText = "请输入必填项";
    let returnVaule = {
        state: canNext,
        showTip: errorText
    }
    let resultData = getLifecycleItem(key).resultData;
    let activityId = utils.getStorage("customer_typeId")//活动类型
    if (key == lifecycleKeyMap.ADD_PRIZE) {
        if (activityId == '1' || activityId == '3') {
            // resultData.length < 4 ||  0815 新需求，不再限制小于4个奖品，而是改为按照默认规则补齐大转盘数据
            //  0823 新需求，添加奖品的上限与大转盘保持一致，均为11件
            if ((resultData.online && resultData.online.length + resultData.offline && resultData.offline.length) > 11) {
                // 提示语也要修改 该活动需添加4-11个奖品
                errorText = "该活动最多添加11个奖品"
                return {
                    state: canNext,
                    showTip: errorText
                }
            }
        }
        //不能为空
        if (resultData.online && resultData.online.length == 0 && resultData.offline && resultData.offline.length == 0) {
            errorText = "请至少添加一个奖品"
        } else {
            //不能忽略必填项 线上商品 要校验 名字 和 数量
            if (resultData.online && resultData.online.length) {
                let find = resultData.online.filter(item => {
                    return !item.inputName || !item.num
                })
                canNext = !(find && find.length)
                //如果校验有问题，给出比较准确的提示，从上到下排序给出
                if (!canNext) {
                    let findIndex = resultData.online.findIndex(item => { return item.sku == find[0].sku })
                    errorText = "线上奖品" + num2Chinese(findIndex) + "的（" + checkPropIsEmpty(find[0], 'online') + "）是必填项！"
                    return {
                        state: canNext,
                        showTip: errorText
                    }
                }
            }
            // 线下商品 要校验 名字 数量 图片 奖品类型 兑奖方式 
            if (resultData.offline && resultData.offline.length) {
                let find = resultData.offline.filter(item => {
                    return !item.name || !item.num || !item.selectedImg || !item.offPrizeType || !item.exchangeType || (item.exchangeType == 'bpluscode' && !item.voucherUrl)
                        || (item.exchangeType == 'bpluscode' && !item.exchangeUrl) || (item.exchangeType == 'othercode' && !item.voucherUrl)
                })
                canNext = !(find && find.length)
                //如果校验有问题，给出比较准确的提示，从上到下排序给出
                if (!canNext) {
                    let findIndex = resultData.offline.findIndex(item => { return item.goodId == find[0].goodId })
                    errorText = "线下奖品" + num2Chinese(findIndex) + "的（" + checkPropIsEmpty(find[0], 'offline') + "）是必填项！"
                    return {
                        state: canNext,
                        showTip: errorText
                    }
                }
                //本地校验成功，还需要在线校验部分数据，比如上传的Excel是否是有效数据，否则，返回校验失败
                let voucherfileList = resultData.offline.filter(item => {
                    return !!item.voucherUrl
                })
                if (voucherfileList && voucherfileList.length) {
                    let result = await checkTheVoucherFile(voucherfileList, vue)
                    if (!result) {
                        return {
                            state: false,
                            showTip: ""
                        }
                    }
                }
            }
        }
    } else if (key == lifecycleKeyMap.SET_LOTTERY && isXCKActivity()) {
        //现场开奖 校验都这里
        //以下的每一条都要校验通过
        //活动名字符合规则
        let myresult = !!resultData.activityName && resultData.activityName.length <= 60
        if (!myresult) return returnVaule
        //奖项设置，不能为空
        if (!(resultData.prizeSetList && resultData.prizeSetList.length)) {
            myresult = false
            errorText = "请添加一个奖项"
            return {
                state: canNext,
                showTip: errorText
            }
        }
        //奖项设置，奖项名字和奖品 不能为空
        if (resultData.prizeSetList && resultData.prizeSetList.length) {
            let find = resultData.prizeSetList.filter(item => {
                return !item.prizeGrade.value || !item.gradeName || !item.good
            })
            canNext = !(find && find.length)
            //如果校验有问题，给出比较准确的提示，从上到下排序给出
            if (!canNext) {
                let findIndex = resultData.prizeSetList.findIndex(item => { return item.goodId == find[0].goodId })
                errorText = "奖项设置" + num2Chinese(findIndex) + "的（" + checkPropIsEmpty(find[0], 'xckprize') + "）是必填项！"
                return {
                    state: canNext,
                    showTip: errorText
                }
            }
        }

        canNext = true
    } else if (key == lifecycleKeyMap.SET_LOTTERY && isYingxiaoActivity()) {
        //营销活动抽奖 校验都走这里
        //以下的每一条都要校验通过
        //活动名字符合规则
        let myresult = !!resultData.activityName && resultData.activityName.length <= 60
        if (!myresult) return returnVaule
        //抽奖概率不为空
        myresult = myresult && !!resultData.winProbability && resultData.winProbability != '0'
        if (!myresult) return returnVaule
        // console.log(myresult)
        //抽奖次数限制 下面3个错误条件，
        //若是有限制的，数值不能为空
        if (!resultData.noNumRafflesTotal && !resultData.numRafflesTotal || !resultData.noNumRafflesDay && !resultData.numRafflesDay) {
            myresult = false
            errorText = "抽奖次数限制不能为空"
            return {
                state: canNext,
                showTip: errorText
            }
        }
        //总数有限制，每日无限制，不合理
        if (!resultData.noNumRafflesTotal && !!resultData.noNumRafflesDay) {
            myresult = false
            errorText = "总限制有限制，每日限制不能无限制"
            return {
                state: canNext,
                showTip: errorText
            }
        }
        //总数、每日都有限制，每日大于总数，不合理 vue已经提示了
        if (!resultData.noNumRafflesTotal && !resultData.noNumRafflesDay && resultData.numRafflesDay > resultData.numRafflesTotal) {
            myresult = false
            errorText = "每日限制不能大于总限制"
            return {
                state: canNext,
                showTip: errorText
            }
        }

        //中奖次数限制 不是必填项，所以不需要判空，下面2个错误条件，
        //总数有限制，每日无限制，不合理
        if (!resultData.noNumWinTotal && !!resultData.noNumWinDay) {
            myresult = false
            errorText = "总限制有限制，每日限制不能无限制"
            return {
                state: canNext,
                showTip: errorText
            }
        }
        //总数、每日都有限制，每日大于总数，不合理 已经在vue上提示了
        if (!resultData.noNumWinTotal && !resultData.noNumWinDay && !!resultData.numWinDay && resultData.numWinTotal
            && resultData.numWinDay > resultData.numWinTotal) {
            myresult = false
            errorText = "每日限制不能大于总限制"
            return {
                state: canNext,
                showTip: errorText
            }
        }

        //活动规则，字数限制,可以不填，填了不能大于2000 .已经在vue上提示了
        if (!!resultData.editortext && resultData.editortext.length > 2000) {
            myresult = false
            errorText = "不能超过2000字"
            return {
                state: canNext,
                showTip: errorText
            }
        }

        canNext = true
    } else if (key == lifecycleKeyMap.CONFIRM_LOTTERY) {
        //确认页面点击按钮 需要 调用接口，这是一个异步的操作。
        let result = await createLotteryActivity(key, vue)
        canNext = !!result ? true : false
        errorText = !!result ? "" : '创建失败'
    }
    return {
        state: canNext,
        showTip: errorText
    }
}
function checkPropIsEmpty(item, type) {
    if (type == 'online') {
        let prop2Nam = { inputName: "奖品名称", num: "奖品数量" }
        if (!item.inputName) {
            return prop2Nam["inputName"]
        }
        if (!item.num) {
            return prop2Nam["num"]
        }
    } else if (type == 'offline') {
        let prop2Nam = { name: "奖品名称", selectedImg: "奖品图片", num: "奖品数量", exchangeType: "兑奖方式", offPrizeType: "奖品名类型", voucherUrl: "上传兑奖码", exchangeUrl: "领取链接" }
        if (!item.name) {
            return prop2Nam["name"]
        }
        if (!item.selectedImg) {
            return prop2Nam["selectedImg"]
        }
        if (!item.num) {
            return prop2Nam["num"]
        }
        if (!item.exchangeType) {
            return prop2Nam["exchangeType"]
        }
        if (item.exchangeType == 'bpluscode' && !item.exchangeUrl) {
            return prop2Nam["exchangeUrl"]
        }
        if (item.exchangeType == 'bpluscode' && !item.voucherUrl) {
            return prop2Nam["voucherUrl"]
        }
        if (item.exchangeType == 'othercode' && !item.voucherUrl) {
            return prop2Nam["voucherUrl"]
        }
    } else if (type == 'xckprize') {
        let prop2Nam = { prizeGrade: "奖项名称", good: "奖项奖品" }
        if (!item.prizeGrade.value || !item.gradeName) {
            return prop2Nam["prizeGrade"]
        }
        if (!item.good) {
            return prop2Nam["good"]
        }
    }
    return "**"
}
function getNetExchangeType(type) {
    //兑换方式：1-在线领取；2-线下领取；3-邮寄；4-凭兑奖码领取
    const typeMap = {
        "offline": 2,
        "mail": 3,
        "bpluscode": 4,
        "othercode": 4,
    }
    return typeMap[type]
}
function getNetOffPrizeType(type) {
    //线下奖品类型：1-商云优惠券；2-实物奖品；3-虚拟奖品；4-商云红包
    const typeMap = {
        "syyhq": 1,
        "swjp": 2,
        "xnjp": 3,
        "syhb": 4,
    }
    return typeMap[type]
}
//真实创建活动
async function createLotteryActivity(key, vue) {
    let that = vue;
    let activityId = utils.getStorage("customer_typeId")//活动类型
    let reqData = {}
    //营销活动类
    if (isYingxiaoActivity()) {
        let inputData = JSON.parse(JSON.stringify(getCompInputData(key)))
        inputData.prize.listMap.online.map(item => {
            item.count = item.num
            item.salePrice = item.unitPrice
            item.name = item.inputName || item.name
            item.mainImage = item.img
            //如果手动上传了，就是selectedImg 如果是内置图片，那就是 selectedImgKey ，如果都没有，那就用商品的图
            if (isManualUploadImg(item)) {
                item.imgUrl = item.selectedImg
            } else if (!!item.selectedImgKey) {
                item.imgUrl = item.selectedImgKey
            } else {
                item.imgUrl = item.mainImage
            }

            item.buildinimgLsit = undefined
            item.selectedImg = undefined
            item.selectedImgKey = undefined
            item.img = undefined
            item.showAllimgs = undefined
            item.goodTotalPrice = undefined
            item.num = undefined
            item.unitPrice = undefined
            return item
        })
        inputData.prize.listMap.offline.map(item => {
            item.count = item.num
            item.name = item.inputName || item.name
            //如果手动上传了，就是selectedImg 如果是内置图片，那就是 selectedImgKey ，
            if (isManualUploadImg(item)) {
                item.imgUrl = item.selectedImg
            } else {
                item.imgUrl = item.selectedImgKey
            }
            //商云优惠券，邮寄 不需要 兑奖提示
            if (item.exchangeType == 'mail' || item.exchangeType == 'bpluscode') {
                item.exchangePrompt = undefined
            }
            item.exchangeType = getNetExchangeType(item.exchangeType)
            item.offPrizeType = getNetOffPrizeType(item.offPrizeType)

            item.buildinimgLsit = undefined
            item.voucherfile = undefined
            item.selectedImg = undefined
            item.selectedImgKey = undefined
            item.showAllimgs = undefined
            item.goodId = undefined
            item.num = undefined
            return item
        })
        reqData = {
            // "channelId": "string",
            // "companyId": "string",
            "companyName": homelHandler.userInfo.companyName,
            "userId": homelHandler.userInfo.userId,
            "mobile": homelHandler.userInfo.mgrName,

            "dayDrawCount": inputData.settings.numRafflesDay,//中奖次数限制,每日
            "dayWinCount": inputData.settings.numWinDay,//抽奖次数限制 每日numRafflesDay
            "drawCount": inputData.settings.numRafflesTotal,//抽奖次数限制
            "winCount": inputData.settings.numWinTotal,//中奖次数限制
            "desc": inputData.settings.activityRule,
            "name": inputData.settings.activityName,
            "toolId": activityId,
            "winRate": inputData.settings.winProbability,
            "prizeList": inputData.prize.listMap.online.concat(inputData.prize.listMap.offline),
            "inviteUserList": inputData.settings.inviteUserList
            
        }
    } else if (isXCKActivity()) {
        //现场开奖类型
        let inputData = JSON.parse(JSON.stringify(getCompInputData(key)))
        let prizeSet = []
        inputData.settings.prizeSetList.forEach(item => {
            let newItem = JSON.parse(JSON.stringify(item.good))

            newItem.grade = item.prizeGrade.value
            newItem.gradeName = item.gradeName

            if (newItem.offPrizeType) {
                //线下奖品
                newItem.count = newItem.num
                newItem.name = newItem.inputName || newItem.name
                //如果手动上传了，就是selectedImg 如果是内置图片，那就是 selectedImgKey ，
                if (isManualUploadImg(newItem)) {
                    newItem.imgUrl = newItem.selectedImg
                } else {
                    newItem.imgUrl = newItem.selectedImgKey
                }
                //商云优惠券，邮寄 不需要 兑奖提示
                if (newItem.exchangeType == 'mail' || newItem.exchangeType == 'bpluscode') {
                    newItem.exchangePrompt = undefined
                }
                newItem.exchangeType = getNetExchangeType(newItem.exchangeType)
                newItem.offPrizeType = getNetOffPrizeType(newItem.offPrizeType)

                newItem.buildinimgLsit = undefined
                newItem.voucherfile = undefined
                newItem.selectedImg = undefined
                newItem.selectedImgKey = undefined
                newItem.showAllimgs = undefined
                newItem.goodId = undefined
                newItem.num = undefined
            } else {
                //线上奖品
                newItem.count = newItem.num
                newItem.salePrice = newItem.unitPrice
                newItem.name = newItem.inputName || newItem.name
                newItem.mainImage = newItem.img
                //如果手动上传了，就是selectedImg 如果是内置图片，那就是 selectedImgKey ，如果都没有，那就用商品的图
                if (isManualUploadImg(newItem)) {
                    newItem.imgUrl = newItem.selectedImg
                } else if (!!newItem.selectedImgKey) {
                    newItem.imgUrl = newItem.selectedImgKey
                } else {
                    newItem.imgUrl = newItem.mainImage
                }

                newItem.buildinimgLsit = undefined
                newItem.selectedImg = undefined
                newItem.selectedImgKey = undefined
                newItem.img = undefined
                newItem.showAllimgs = undefined
                newItem.goodTotalPrice = undefined
                newItem.num = undefined
                newItem.unitPrice = undefined
            }
            prizeSet.push(newItem)
        })

        reqData = {
            // "channelId": "string",
            // "companyId": "string",
            "companyName": homelHandler.userInfo.companyName,
            "userId": homelHandler.userInfo.userId,
            "mobile": homelHandler.userInfo.mgrName,

            "desc": inputData.settings.activityRule,
            "name": inputData.settings.activityName,
            // "repeatDraw": inputData.settings.repeatDraw, 因为默认不能允许，没有意义，不再传值
            "toolId": activityId,
            "prizeList": prizeSet
        }
    } else {
        return
    }

    // prizeList:lifecycle[0].resultData
    let result;
    that.$iLoading.show();
    try {
        result = await homelHandler
            .createLotteryActivity(reqData);
    } catch (error) {
        console.log(error)
    } finally {
        that.$iLoading.hide();
    }
    if (!!result && result.resultCode == 0) {
        lifecycle[3].uiCompDataCache = result
        //清理缓存数据
        destoryUIDataCache()
        return true
    }
    return false
}

//获取预览活动的id（预览活动，非真实活动）
export async function createPreviewLottery(key, vue) {
    let that = vue;
    let inputData = JSON.parse(JSON.stringify(key))
    inputData.prize.listMap.online.map(item => {
        item.count = item.num
        item.salePrice = item.unitPrice
        item.name = item.inputName || item.name
        item.mainImage = item.img
        //如果手动上传了，就是selectedImg 如果是内置图片，那就是 selectedImgKey ，如果都没有，那就用商品的图
        if (isManualUploadImg(item)) {
            item.imgUrl = item.selectedImg
        } else if (!!item.selectedImgKey) {
            item.imgUrl = item.selectedImgKey
        } else {
            item.imgUrl = item.mainImage
        }

        item.buildinimgLsit = undefined
        item.selectedImg = undefined
        item.selectedImgKey = undefined
        item.img = undefined
        item.showAllimgs = undefined
        item.goodTotalPrice = undefined
        item.num = undefined
        item.unitPrice = undefined
        return item
    })
    inputData.prize.listMap.offline.map(item => {
        item.count = item.num
        item.name = item.inputName || item.name
        //如果手动上传了，就是selectedImg 如果是内置图片，那就是 selectedImgKey ，
        if (isManualUploadImg(item)) {
            item.imgUrl = item.selectedImg
        } else {
            item.imgUrl = item.selectedImgKey
        }
        //商云优惠券，邮寄 不需要 兑奖提示
        if (item.exchangeType == 'mail' || item.exchangeType == 'bpluscode') {
            item.exchangePrompt = undefined
        }
        item.exchangeType = getNetExchangeType(item.exchangeType)
        item.offPrizeType = getNetOffPrizeType(item.offPrizeType)

        item.buildinimgLsit = undefined
        item.voucherfile = undefined
        item.selectedImg = undefined
        item.selectedImgKey = undefined
        item.showAllimgs = undefined
        item.goodId = undefined
        item.num = undefined
        return item
    })
    let reqData = {
        // "channelId": "string",
        // "companyId": "string",
        "companyName": homelHandler.userInfo.mgrName,
        "userId": homelHandler.userInfo.userId,
        "mobile": homelHandler.userInfo.mgrName,

        "dayDrawCount": inputData.settings.numRafflesDay,//中奖次数限制,每日
        "dayWinCount": inputData.settings.numWinDay,//抽奖次数限制 每日numRafflesDay
        "drawCount": inputData.settings.numRafflesTotal,//抽奖次数限制
        "winCount": inputData.settings.numWinTotal,//中奖次数限制
        "desc": inputData.settings.activityRule,
        "name": inputData.settings.activityName,
        // "prizeSource": inputData.prize.type,
        // "toolId": inputData.settings.winProbability,
        "toolId": utils.getStorage("customer_typeId"),
        "winRate": inputData.settings.winProbability,
        "prizeList": inputData.prize.listMap.online.concat(inputData.prize.listMap.offline),
        "inviteUserList": inputData.settings.inviteUserList,
    }
    let result;
    that.$iLoading.show();
    try {
        result = await homelHandler
            .createPreviewLottery(reqData);
    } catch (error) {
        console.log(error)
    } finally {
        that.$iLoading.hide();
    }
    return result
}

/**
 * 销魂内存缓存的数据，包括 第一步 选择的商品 和 第二部 设置活动的参数
 */
export function destoryUIDataCache() {
    lifecycle[0].uiCompDataCache = {
        offlinePrizes: [
            // {
            //     goodId: 1,
            //     name: "",
            //     img: "",
            //     price: "",
            //     num: 1,
            // }
        ],// 线下奖品列表
        onlinePrizes: [],// 线上奖品列表
        dialogSelectGoods: [], //online弹框上选中的列表
        // activeTab: "1"
    }
    if (isYingxiaoActivity()) {
        lifecycle[1].uiCompDataCache = {
            //设置活动的输入项
            settingData: {
                activityRule: "本次活动规则的解释权归主办方所有。",
                personTimes: 0,//预计抽奖人次
                winProbability: 0,//中奖概率
                noNumWinDay: true,//中奖次数限制,每日
                noNumWinTotal: true,//中奖次数限制
                noNumRafflesDay: false,//抽奖次数限制,每日
                noNumRafflesTotal: false,//抽奖次数限制,
                numRafflesTotal: 1,//抽奖次数限制
                numRafflesDay: 1,//抽奖次数限制 每日
                inviteUserList:[],//抽奖资格
            },
        }
    } else if (isXCKActivity()) {
        lifecycle[1].uiCompDataCache = {
            //设置活动的输入项
            settingData: {
                activityRule: "本次活动规则的解释权归主办方所有。",
                prizeSetList: [],//奖项设置列表
                repeatDraw: 1,//重复中奖 是否
            },
        }
    }
    return 1
}
/**
 * 设置活动的公共缓存数据
 */
export function geSettingLotteryData() {
    return getLifecycleItem(lifecycleKeyMap.SET_LOTTERY).uiCompDataCache
}

/**
 * 获取添加奖品的公共缓存数据
 */
export function getAddPrizeData() {
    return getLifecycleItem(lifecycleKeyMap.ADD_PRIZE).uiCompDataCache
}
/**
 * 
 * @returns 获取生命周期的名字数字，作为步骤条的数据源
 */
export function getLifecycleSteps() {
    return lifecycle.map(item => {
        return item.name
    })
}
/**
 * 通过key 获取 生命周期对象
 * @param {*} key 
 * @returns 
 */
export function getLifecycleItem(key) {
    return lifecycle.find(item => {
        return item.key == key
    })
}

/**
 * 获取生命周期的初始化默认值 也就是第一步
 * @returns 
 */
export function getDefaultLifecycleState() {
    return lifecycle[0].key
}

/**
 * 是否是生命周期的重点
 * @param {*} key 
 */
export function isLifecycleEnd(key) {
    return lifecycle[lifecycle.length - 1].key == key
}

/**
 * 是否是生命周期 需要展示 插槽
 * @param {*} key 
 */
export function isLifecycleShowSlot(key) {
    return lifecycleKeyMap.ADD_PRIZE == key || lifecycleKeyMap.CONFIRM_LOTTERY == key
}

/**
 * 生命周期 需要展示 几个按钮
 * @param {*} key 
 */
export function getBtnTypeByLifecycle(key) {
    if (key == lifecycle[0].key) {
        return "start";
    } else {
        return "progress";
    }
}

/**
 * 根据 当前生命周期 获取 子组件的入参
 * @param {*} key 
 */
export function getCompInputData(key) {
    //inputData 根据具体的 组件的实现 不一样。这里 可能也不一定叫做 compInputData， 需要的数据 一般是上个页面的数据结果 ，也有可能其他的数据
    if (key == lifecycle[0].key) {
        return "";
    } else if (key == lifecycle[1].key) {
        return getLifecycleItem(getLifecycleItem(key).pre).resultData;
    } else if (key == lifecycle[2].key) {
        //确认页面，要把之前的数据都组织起来
        let myResult = {
            settings: lifecycle[1].resultData,
            prize: {
                // type: lifecycle[0].uiCompDataCache.activeTab,
                listMap: lifecycle[0].resultData
            },
            lotteryType: JSON.parse(utils.getStorage("customer_currentLottery")),
        }

        return myResult;
    } else if (key == lifecycle[3].key) {
        return lifecycle[3].uiCompDataCache;
    }
}

/**
* 对一个数组去重，得到满足条件的非重复的数组
* @param {*} array 要去重复的原数组
* @param {*} isUniq 去重判断标准方法
*/
export function uniqArray(array, isUniq) {
    var temp = [];
    var index = [];
    var l = array.length;
    for (var i = 0; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
            if (isUniq(array[i], array[j])) {
                i++;
                j = i;
            }
        }
        temp.push(array[i]);
        index.push(i);
    }
    return temp;
}
/**
 * 根据商品列表 计算出总价格
 * @param {*} goodlist 
 */
export function getTotalPrice(goodlist, that) {
    // 更新总价格
    let totalPrice = 0;
    goodlist && goodlist.forEach((element) => {
        let price = that.$math.chain(element.price).multiply(element.num).done();
        //每个商品都需要 金额小计
        element.goodTotalPrice = price.toFixed(2)
        totalPrice = that.$math.chain(totalPrice).add(price).done();
    });
    return that.$math.round(totalPrice, 2).toFixed(2)
}

const numchimap = [
    { key: 0, value: "一" },
    { key: 1, value: "二" },
    { key: 2, value: "三" },
    { key: 3, value: "四" },
    { key: 4, value: "五" },
    { key: 5, value: "六" },
    { key: 6, value: "七" },
    { key: 7, value: "八" },
    { key: 8, value: "九" },
    { key: 9, value: "十" },
    { key: 10, value: "十一" },
    { key: 11, value: "十二" },
]
export function num2Chinese(numIndex) {
    let num = "";
    let filterLsit = numchimap.filter((item) => item.key == numIndex);
    if (filterLsit && filterLsit.length) {
        num = filterLsit[0].value;
    }
    return num;
}

export function getRightBtnText(currentState) {
    if (currentState == lifecycleKeyMap.CONFIRM_LOTTERY) {
        return '确认'
    } else {
        return '下一步'
    }
}
/**
 * 创建活动的内置图标集合
 */
export const allbuildinIcons = [
    { key: "img_jp_air", src: require("assets/newactivity/img_jp_air.png") },
    { key: "img_jp_computer", src: require("assets/newactivity/img_jp_computer.png") },
    { key: "img_jp_drier", src: require("assets/newactivity/img_jp_drier.png") },
    { key: "img_jp_earphone", src: require("assets/newactivity/img_jp_earphone.png") },
    { key: "img_jp_phone", src: require("assets/newactivity/img_jp_phone.png") },
    { key: "img_jp_ricecooker", src: require("assets/newactivity/img_jp_ricecooker.png") },
    { key: "img_jp_wash", src: require("assets/newactivity/img_jp_wash.png") },

    { key: "img_jp_coupon", src: require("assets/newactivity/img_jp_coupon.png") },
    { key: "img_jp_coupon10", src: require("assets/newactivity/img_jp_coupon10.png") },
    { key: "img_jp_coupon20", src: require("assets/newactivity/img_jp_coupon20.png") },
    { key: "img_jp_coupon30", src: require("assets/newactivity/img_jp_coupon30.png") },
    { key: "img_jp_coupon50", src: require("assets/newactivity/img_jp_coupon50.png") },
    { key: "img_jp_coupon100", src: require("assets/newactivity/img_jp_coupon100.png") },
    { key: "img_jp_coupon200", src: require("assets/newactivity/img_jp_coupon200.png") },

    { key: "img_jp_redpacket", src: require("assets/newactivity/img_jp_redpacket.png") },
    { key: "img_jp_redpacket10", src: require("assets/newactivity/img_jp_redpacket10.png") },
    { key: "img_jp_redpacket20", src: require("assets/newactivity/img_jp_redpacket20.png") },
    { key: "img_jp_redpacket30", src: require("assets/newactivity/img_jp_redpacket30.png") },
    { key: "img_jp_redpacket50", src: require("assets/newactivity/img_jp_redpacket50.png") },
    { key: "img_jp_redpacket100", src: require("assets/newactivity/img_jp_redpacket100.png") },
    { key: "img_jp_redpacket200", src: require("assets/newactivity/img_jp_redpacket200.png") }
]
export function getAllGoodbuildinIcons() {
    return allbuildinIcons.slice(0, 7)
}
export function getAllCouponbuildinIcons() {
    return allbuildinIcons.slice(7, 14)
}
export function getAllRedpacketbuildinIcons() {
    return allbuildinIcons.slice(14, allbuildinIcons.length)
}
/**
 * 判断图片是否手动上传成功，优先级高，不能再选择预制图片
 */
export function isManualUploadImg(item) {
    return !!item.selectedImg && item.selectedImg.indexOf("http") != -1;
}
//线下兑奖方式
export const awardingTypes = [
    { label: "offline", name: "线下领取" },
    { label: "mail", name: "邮寄" },
    { label: "bpluscode", name: "凭兑奖码领取" },
    { label: "othercode", name: "凭兑奖码领取" },
]
//线下奖品类型
export const myoffPrizeTypes = [
    { label: "syyhq", name: "商云优惠券" },
    { label: "swjp", name: "实物奖品" },
    { label: "xnjp", name: "虚拟奖品" },
    { label: "syhb", name: "商云红包" },
]
/**
 * 获取商云优惠券和红包的默认的连接地址
 */
export function getBplusExchangeUrl(offPrizeType) {
    let hostname = window.location.hostname;
    let hostMap = {
        "bplusdev.sinosun.com": "https://bplusdev.sinosun.com:18180/mallbbcg2",
        "bplussit.sinosun.com": "https://bplussit.sinosun.com:18380/mallbbcg2",
        "bplus-uat.sinosun.com": "https://bplus-uat.sinosun.com/mallbbcg2bank",
        "cloud.sinosun.com": "https://cloud.sinosun.com/mallbbcg2bank"
    }
    let h5type = {
        'syyhq':'/static/mobile/index.html#/pages/coupon/receive',
        'syyhqauto':'/static/mobile/index.html#/pages/coupon/autoReceive',
        'syhb':'/static/mobile/index.html#/pages/redpacket/receive'
    }
    let host = hostMap[hostname]||'https://bplusdev.sinosun.com:18180/mallbbcg2'
    // console.log(origin)
    // let link = window.location.origin + "/mallbbcg2bank/static/mobile/index.html#/pages/coupon/receive"
    let link = `${host}${h5type[offPrizeType]}`
    return link
}
/**
 * 校验兑换码文件
 * @param {*} key 
 * @param {*} vue 
 * @returns 
 */
async function checkTheVoucherFile(offlist, vue) {
    let that = vue;
    let inputData = JSON.parse(JSON.stringify(offlist))

    inputData.map(item => {
        item.count = item.num
        item.name = item.inputName || item.name
        //如果手动上传了，就是selectedImg 如果是内置图片，那就是 selectedImgKey ，
        // if (isManualUploadImg(item)) {
        //     item.imgUrl = item.selectedImg
        // } else {
        //     item.imgUrl = item.selectedImgKey
        // }
        item.exchangeType = getNetExchangeType(item.exchangeType)
        item.offPrizeType = getNetOffPrizeType(item.offPrizeType)

        item.buildinimgLsit = undefined
        item.voucherfile = undefined
        item.selectedImg = undefined
        item.selectedImgKey = undefined
        item.showAllimgs = undefined
        item.goodId = undefined
        item.num = undefined
        return item
    })
    let reqData = {
        "prizeList": inputData
    }

    let result;
    that.$iLoading.show();
    try {
        result = await homelHandler
            .checkVoucherFile(reqData);
    } catch (error) {
        console.log(error)
    } finally {
        that.$iLoading.hide();
    }
    if (!!result && result.resultCode == 0) {
        return true
    }
    return false
}
//判断是否是营销类活动
export function isYingxiaoActivity() {
    let toolId = utils.getStorage("customer_typeId")
    return toolId == 1 || toolId == 2 || toolId == 3 || toolId == 4
}

//判断是否是现场开奖活动
export function isXCKActivity() {
    let toolId = utils.getStorage("customer_typeId")
    return toolId == 5
}