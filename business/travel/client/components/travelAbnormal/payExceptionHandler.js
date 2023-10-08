import extendUtils from './extend.js';
const Bus = extendUtils.Bus;

const ERROR_CODE = {
    OVER_STANDARD: 46091006,//超标
    NO_APPLY: 46091005, //无申请单
    TRAVEL_ABNORMALITY: 46091004//行程异常
}

class RequestHandler extends extendUtils.baseRequestHandler {
    constructor(){
        super();
        this.funcSwitch =true; //功能开关
        this.criteriaInfo =null; //差标信息
        this.tripLimitBound =null; //预订日期设置
        this.specialPermissionInfos =null;//特殊授权信息
        this.businessAbnormalArr =null;//存储服务器返回的超标异常数据
        this.abnormalPrompt ={};//当前弹出的超标/行程异常信息框
        this.businessAbnormalRecycle ={};//回收弹出的异常信息，这个信息是再次创建预付单时需要传给服务器的
        this.resolve =null;
    }

    /**
     * 功能打开时，立即获取相关数据
     */
    init() {
        try {
            this.initDone = false;//数据是否初始化完成
            if (this.funcSwitch) {
                (async ()=>{
                    await this.getCriterion();
                    await this.getReservationDateRange();
                    await this.getSpecial();
                    this.initDone = true;
                })().catch(e=>{
                    this.initDone = true;//如果异常了，则也认为已获取完数据
                    console.error(e);
                })
            }
        } catch (e) {
            console.info(e)
        }
    }

    /**
     * 等待数据都拿到了，再返回数据
     * @param inLoop 是否处于递归状态
     * @return {Promise<*>}
     */
    async getTravelParam(inLoop) {
        if (!this.initDone){
            !inLoop && Bus.$emit('lockPage', {
                text: ()=>'加载中'
            })
            return await new Promise(resolve => {
                setTimeout(async ()=>{
                    resolve(await this.getTravelParam(true));
                }, 500)
            })
        }
        Bus.$emit('unlockPage')
        return {
            "criteriaInfo": this.criteriaInfo || {},
            "tripLimitBound": this.tripLimitBound || 0 ,
            "specialPermissionInfos": this.specialPermissionInfos || []
        }
    }

    /**
     * 获取差标信息
     */
    async getCriterion() {
        await new Promise(resolve => {
            //   setTimeout(()=>{
            //       resolve();
            //   }, 5000);
            //   extendUtils.GetCriterionFunction({uaid: 0, cpyId: 0}).then(data => {
            //       if (data && data.ret == 0) {
            //           this.criteriaInfo = data.responseData;
            //       }
            resolve();
        });
            
    
    }

    /**
     * 获取预定日期设置
     */
    async getReservationDateRange() {
        await new Promise(resolve => {
            // setTimeout(()=>{
            //     resolve();
            // }, 5000);
            // extendUtils.GetReservationDateRangeFunction({uaid: 0, cpyId: 0}).then(data => {
            //     if (data && data.ret == 0) {
            //         this.tripLimitBound = data.responseData.range;
            //     }
            resolve();
            // });
        })
    }

    /**
     * 获取免审批信息
     */
    async getSpecial() {
        await new Promise(resolve => {
            // setTimeout(()=>{
            //     resolve();
            // }, 5000);
            // extendUtils.GetSpecialFunction({uaid: 0, cpyId: 0}).then(data => {
            //     if (data && data.ret == 0) {
            //         this.specialPermissionInfos = data.responseData.specialPermissionInfos;
            //     }
            resolve();
            // });
        })
    }

    /**
     * 检查创建预付单是否有异常
     * true表示无异常；false有异常，终止支付
     */
    checkPayResult(res) {
        return !this.isBusinessAbnormal(res.result);
    }

    /**
     * 是否超标
     */
    isBusinessAbnormal(data) {
        let _payExtarInfo = data.payExtraInfo && data.payExtraInfo.businessAbnormalList;
        if (!!_payExtarInfo && _payExtarInfo.length > 0) {
            this.businessAbnormalArr = _payExtarInfo;
            this.businessAbnormalArr = _payExtarInfo.sort(function (info1, info2) {
                if (info1.abnormalPriorityLevel < info2.abnormalPriorityLevel) {
                    return -1;
                } else if (info1.abnormalPriorityLevel > info2.abnormalPriorityLevel) {
                    return 1;
                } 
                return 0;
                
            })
            this.showExtraInfoPop();
            return true;
        }
        return false;
    }

    /**
     * 依次弹出待处理的异常信息，如果有异常，返回true，否则返回false
     */
    showExtraInfoPop() {
        if (!this.businessAbnormalArr || this.businessAbnormalArr.length == 0) {
            return false;
        }
        let topExtraInfo = this.businessAbnormalArr.pop();
        topExtraInfo.abnormalReason = this.abnormalPrompt.abnormalReason;//记住上次输入的异常原因
        this.businessAbnormalRecycle[topExtraInfo.abnormalCode] = topExtraInfo; //弹出的异常存入回收站
        //优先级为负，不处理（数组是按优先级从小到大排序的，遇到为负的，那么剩下的都是负的了，不用继续处理）
        if (topExtraInfo.abnormalPriorityLevel < 0) {
            return false;
        }
        if (topExtraInfo.abnormalCode == ERROR_CODE.OVER_STANDARD) { //超标
            this.abnormalPrompt = topExtraInfo;
            this.abnormalPrompt.placeholder = '请输入超标原因';
            this.abnormalPrompt.tipsLabel = '超标信息';
            this.abnormalPrompt.errorMsg = '请填写超标原因';
            this.abnormalPrompt.title = '行程超标';
            Bus.$emit('payAbnormal', 'showAbnormalPrompt');
            return true;
        }
        if (topExtraInfo.abnormalCode == ERROR_CODE.NO_APPLY) { //没有审批单
            Bus.$emit('payAbnormal', 'showNoApply');
            return true;
        }
        if (topExtraInfo.abnormalCode == ERROR_CODE.TRAVEL_ABNORMALITY) { //行程异常
            this.abnormalPrompt = topExtraInfo;
            this.abnormalPrompt.placeholder = '请输入行程异常原因';
            this.abnormalPrompt.tipsLabel = '行程异常信息';
            this.abnormalPrompt.errorMsg = '请填写行程异常原因';
            this.abnormalPrompt.title = '行程异常';
            Bus.$emit('payAbnormal', 'showAbnormalPrompt');
            return true;
        }
        return false;
    }

    /**
     * 是否超标
     */
    exceedStandard(abnormalObj) {
        if (!abnormalObj || Object.keys(abnormalObj).length == 0) {
            return false;
        }
        return abnormalObj.abnormalCode == ERROR_CODE.OVER_STANDARD || (!!abnormalObj.associateCodes && abnormalObj.associateCodes.indexOf(ERROR_CODE.OVER_STANDARD) > -1);
    }

    /**
     * 支付时，需要的异常数据（如果有的话）
     */
    getPayAbnormalParam() {
        //行程异常集合
        let result = [];
        //如果有异常信息对象
        if (!!this.businessAbnormalRecycle && Object.keys(this.businessAbnormalRecycle).length > 0) {
            let handledAbnormalArr = [];//已处理的异常集合
            Object.keys(this.businessAbnormalRecycle).forEach((key) => {
                handledAbnormalArr.push(this.businessAbnormalRecycle[key]);
            })
            //已处理的异常和不需处理的异常集合合并
            result = handledAbnormalArr.concat(this.businessAbnormalArr);
            return {
                payExtraInfo: {
                    businessAbnormalList: result
                }
            }
        }
        return null;
    }

    /**
     * 再次支付时，需要初始化异常栈，将所有异常和用户输入的原因整理后再存入businessAbnormalArr。
     * 这样再支付时，在创建预付单之前会重新走一遍异常判断
     * 【暂时没用】
     */
    resetBusinessAbnormalArr() {
        const that = this;
        let keys = Object.keys(that.businessAbnormalRecycle);
        that.businessAbnormalArr = [];
        if (!!that.businessAbnormalRecycle && keys.length > 0) {
            keys.forEach((key) => {
                //没有审批单的异常不用重复显示。
                if (key != ERROR_CODE.NO_APPLY) {
                    that.businessAbnormalArr.push(that.businessAbnormalRecycle[key]);
                }
            })
            that.businessAbnormalArr = that.businessAbnormalArr.sort(function (info1, info2) {
                if (info1.abnormalPriorityLevel < info2.abnormalPriorityLevel) {
                    return -1;
                } else if (info1.abnormalPriorityLevel > info2.abnormalPriorityLevel) {
                    return 1;
                } 
                return 0;
                
            })
        }
    }

    async checkOrderAbnormal(param, verified){
        let that = this;
        //行程差标相关参数。getTravelParam是一个异步函数
        Object.assign(param, await that.getTravelParam());
        //行程异常相关参数。只有填写过原因后，才添加这个参数
        !!verified && Object.assign(param, that.getPayAbnormalParam());
        return new Promise((resolve) => {
            Bus.$emit('lockPage', {
                text: ()=>'加载中'
            })
            let url = !!param.isBeforeOrder?'preCheckOrderAbnormal':'checkOrderAbnormal';
            that.request('/special-permission/v1/' + url, param).then(res => {
                Bus.$emit('unlockPage')
                if (that.checkPayResult(res)){
                    //that.resolve不为空说明不是第一次校验，此时使用this.resolve（也就是第一次调用的resolve）提交本函数
                    //非第一次的调用不用resolve，因为不关心它是否完成
                    that.resolve ? that.resolve(res.result) : resolve(res.result);
                    that.resolve = null;//初始化，下次再调用时，应该重新算第一次调用
                    return;
                }
                //如果第一次校验未通过，则存储第一次的resolve，待校验通过后才resolve本函数
                if (!that.resolve){
                    that.resolve = resolve;
                }
            }).catch(e=>{
                Bus.$emit('unlockPage');
                console.error(e);
            })
        })
    }
}

let requestHandler = new RequestHandler();
requestHandler.init();

export default requestHandler;
